import { Engine, Scene, Vector3, Color4, FreeCamera, Viewport } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import './style.css';
import { MUNDO } from './mundo.config.js';
import { amostrarTour, cueDoTour, observacaoDaFase, TOUR_DURACAO, TOUR_ESTACOES } from './tour.js';
import { criarPalco } from './palco.js';
import { criarMascote } from './mascote.js';
import { anexarControles } from './camera-controls.js';
import { criarPortao } from './estacoes/portao.js';
import { criarGavetas } from './estacoes/gavetas.js';
import { criarConferencia } from './estacoes/conferencia.js';

const DEMOS = { portao: criarPortao, gavetas: criarGavetas, conferencia: criarConferencia };
const $ = (id) => document.getElementById(id);
const canvas = $('world');
const R = MUNDO.ritmo;

// ---------- engine, cena, câmera ----------
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }, true);
const scene = new Scene(engine);
scene.useRightHandedSystem = true;
scene.clearColor = Color4.FromHexString('#e6eae5ff');
const camera = new FreeCamera('camera', Vector3.FromArray(MUNDO.camera.overview.position), scene);
camera.minZ = 0.05; camera.maxZ = 150; camera.fov = (MUNDO.camera.overview.fov * Math.PI) / 180;
const alvo = Vector3.FromArray(MUNDO.camera.overview.target);
camera.setTarget(alvo);

const state = {
  modo: 'inicio', ativa: 0, fase: 'chegada', faseT: 0, pausado: false, tourT: 0, tourVel: 1,
  reduzido: matchMedia('(prefers-reduced-motion: reduce)').matches, usuarioCamera: false, tween: null, ultimaPose: null,
  completas: MUNDO.estacoes.map(() => false), tourEstacaoAtual: -1, tourDemoResetada: -1,
};
let estacoes = []; let mascote = null; let ctrl = null; let pedestais = [];
const ancoras = MUNDO.estacoes.map((e) => new Vector3(e.x - 0.95, 0, 1.35));

// ---------- câmera: poses e tween ----------
const poseDe = (p) => ({ position: [...p.position], target: [...p.target], fov: p.fov });
function aplicarPose(p) {
  camera.position = Vector3.FromArray(p.position); alvo.copyFrom(Vector3.FromArray(p.target)); camera.setTarget(alvo);
  // em retrato o campo horizontal fica estreito demais: abre o FOV vertical proporcionalmente
  const aspecto = engine.getAspectRatio(camera);
  camera.fov = ((p.fov * Math.PI) / 180) * (aspecto < 1.1 ? Math.min(1.7, 1.1 / aspecto) : 1);
}
function moverCamera(p, dur) {
  state.ultimaPose = poseDe(p); state.usuarioCamera = false;
  if (state.reduzido || dur <= 0) { state.tween = null; aplicarPose(p); return; }
  const de = { position: camera.position.asArray(), target: alvo.asArray(), fov: (camera.fov * 180) / Math.PI };
  state.tween = { de, para: poseDe(p), t: 0, dur };
}
function tickTween(dt) {
  const tw = state.tween; if (!tw) return;
  tw.t += dt; const r = Math.min(1, tw.t / tw.dur); const k = r * r * (3 - 2 * r);
  const mix = (a, b) => a + (b - a) * k;
  aplicarPose({ position: tw.de.position.map((n, i) => mix(n, tw.para.position[i])), target: tw.de.target.map((n, i) => mix(n, tw.para.target[i])), fov: mix(tw.de.fov, tw.para.fov) });
  if (r >= 1) state.tween = null;
}

// ---------- painéis ----------
function mostrarPainel(id) {
  for (const p of document.querySelectorAll('.painel')) p.hidden = p.id !== id;
  document.body.dataset.view = id; document.querySelector('.sidebar').scrollTop = 0;
}
function syncNav() {
  document.querySelectorAll('.estacao-botao').forEach((b, i) => {
    const on = state.modo === 'estacao' && state.ativa === i;
    b.classList.toggle('ativa', on); b.setAttribute('aria-current', on ? 'step' : 'false'); b.classList.toggle('feita', state.completas[i]);
  });
}
function setTexto(id, t) { $(id).textContent = t; }

// ---------- modos ----------
function inicio() {
  state.modo = 'inicio'; state.pausado = false; state.tween = null;
  for (const e of estacoes) e.reset();
  mascote?.raiz.setEnabled(true);
  mascote?.irPara(ancoras[0], 0); mascote?.olhar(new Vector3(2, 0, 6));
  mostrarPainel('painelInicio');
  setTexto('cenaKicker', 'UM MUNDO EM MINIATURA'); $('cenaTitulo').innerHTML = 'Três máquinas pequenas.<br>Três hábitos úteis.';
  setTexto('viewLabel', 'O palco inteiro');
  moverCamera(MUNDO.camera.overview, 2); syncNav();
}

function setFase(fase) {
  const cfg = MUNDO.estacoes[state.ativa];
  state.fase = fase; state.faseT = 0;
  setTexto('faseLabel', { chegada: '01 / CONHEÇA A MÁQUINA', aproximar: '02 / OLHE MAIS DE PERTO', demo: '03 / VEJA ACONTECER', resultado: 'A IDEIA PRA LEVAR' }[fase]);
  setTexto('observacao', observacaoDaFase(cfg, fase === 'chegada' ? 'chegando' : fase === 'aproximar' ? 'aproximando' : fase === 'demo' ? 'demo' : 'takeaway', 0));
  $('observacaoBloco').classList.toggle('is-takeaway', fase === 'resultado');
  setTexto('viewLabel', fase === 'chegada' ? 'Vista da estação · ' + cfg.curto : fase === 'resultado' ? 'Demonstração concluída' : fase === 'aproximar' ? 'Aproximando' : 'Veja a máquina');
  $('btnDemo').textContent = fase === 'resultado' ? 'Repetir a demonstração' : 'Ver de perto e rodar';
  $('btnDemo').disabled = fase === 'aproximar' || fase === 'demo';
  mascote?.raiz.setEnabled(fase === 'chegada'); // fora dos close-ups: o mascote não entra no quadro da máquina
  if (fase === 'aproximar') moverCamera(cfg.camera.closeStart, R.aproximar);
  if (fase === 'demo') { estacoes[state.ativa].reset(); moverCamera(cfg.camera.closeEnd, R.demo); }
  if (fase === 'resultado') { state.completas[state.ativa] = true; syncNav(); }
  atualizarDados();
}
function mostrarEstacao(i) {
  state.modo = 'estacao'; state.ativa = i; state.pausado = false; state.tween = null;
  const cfg = MUNDO.estacoes[i];
  for (const e of estacoes) e.reset(); // troca rápida de estação não deixa demo parada no meio
  mostrarPainel('painelEstacao');
  setTexto('estacaoKicker', `ESTAÇÃO 0${i + 1} DE 0${MUNDO.estacoes.length}`); setTexto('estacaoTitulo', cfg.titulo); setTexto('estacaoSub', cfg.subtitulo);
  setTexto('estacaoExplicacao', cfg.explicacao);
  $('estacaoSequencia').innerHTML = cfg.sequencia.map((s, j) => `<span>${s}</span>${j < 2 ? '<b>→</b>' : ''}`).join('');
  setTexto('guiaNota', `${MUNDO.mascote.nome} diz: ${cfg.chegando}`);
  $('btnProxima').textContent = i === MUNDO.estacoes.length - 1 ? 'Ver os três hábitos →' : 'Próxima estação →';
  setTexto('cenaKicker', `0${i + 1} / ${cfg.curto.toUpperCase()}`); $('cenaTitulo').innerHTML = '';
  mascote?.irPara(ancoras[i], 2); mascote?.olhar(estacoes[i].foco);
  setFase('chegada'); moverCamera(cfg.camera.wide, 2.2); syncNav();
}
function recap() {
  state.modo = 'recap'; state.pausado = false; state.tween = null;
  mascote?.raiz.setEnabled(true);
  mostrarPainel('painelRecap'); setTexto('cenaKicker', 'O QUE FICA'); $('cenaTitulo').innerHTML = '';
  setTexto('viewLabel', 'O palco inteiro');
  mascote?.irPara(new Vector3(2.1, 0, 1.25), 2); mascote?.olhar(new Vector3(6, 1, 8));
  moverCamera(MUNDO.camera.final, 2.5); syncNav();
  $('painelRecap').querySelector('h1').focus({ preventScroll: true });
}

// ---------- World Tour (cinema) ----------
// No tour a cena é renderizada num viewport reservado: ao lado do card (desktop) ou acima dele (mobile), pra o card nunca cobrir a demonstração.
function ajustarViewportTour() {
  if (state.modo !== 'tour') { camera.viewport = new Viewport(0, 0, 1, 1); return; }
  const temCard = !$('tourCard').hidden;
  // desktop: cena nos 66% da esquerda, card à direita. Celular: o CSS encurta o canvas e põe o card embaixo (viewport inteiro).
  if (temCard && innerWidth > 760) camera.viewport = new Viewport(0, 0, 0.66, 1);
  else camera.viewport = new Viewport(0, 0, 1, 1);
}
function iniciarTour() {
  state.modo = 'tour'; state.tourT = 0; state.pausado = false; state.tween = null; state.usuarioCamera = false; state.tourEstacaoAtual = -1; state.tourDemoResetada = -1;
  for (const e of estacoes) e.reset();
  mascote?.irPara(ancoras[0], 0); mascote?.olhar(estacoes[0].foco);
  document.body.classList.add('cinema'); $('tourUI').hidden = false; $('tourCard').hidden = true; canvas.tabIndex = -1;
  $('btnTourPausa').textContent = 'Pausar'; $('btnCardPausa').textContent = 'Pausar pra ler'; syncVelocidade();
  engine.resize(); atualizarTour(); $('tourUI').focus({ preventScroll: true });
}
function sairTour(concluido = false) {
  document.body.classList.remove('cinema'); $('tourUI').hidden = true; $('tourCard').hidden = true; canvas.tabIndex = 0; engine.resize();
  state.pausado = false; state.modo = 'inicio'; ajustarViewportTour();
  if (concluido) { state.completas = state.completas.map(() => true); recap(); } else inicio();
}
function syncVelocidade() { document.querySelectorAll('[data-vel]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.vel === state.tourVel))); }
function atualizarTour() {
  const pose = amostrarTour(state.tourT, state.reduzido); aplicarPose(pose);
  const cue = cueDoTour(state.tourT);
  const pct = Math.min(100, (state.tourT / TOUR_DURACAO) * 100); $('tourProgresso').style.width = pct + '%';
  mascote?.raiz.setEnabled(!cue || cue.fase === 'chegando');
  if (!cue) {
    $('tourCard').hidden = true; $('tourUI').classList.remove('tem-card'); ajustarViewportTour();
    setTexto('tourKicker', state.tourT < R.intro ? 'WORLD TOUR · CHEGANDO' : 'WORLD TOUR · O PALCO INTEIRO');
    setTexto('tourLegenda', state.tourT < R.intro ? MUNDO.intro : MUNDO.recap.titulo);
    if (state.tourT >= TOUR_ESTACOES.at(-1).fim && state.tourEstacaoAtual !== 'fim') { state.tourEstacaoAtual = 'fim'; mascote?.irPara(new Vector3(2.1, 0, 1.25), 2.5); mascote?.olhar(new Vector3(5, 1, 8)); }
    return;
  }
  const cfg = MUNDO.estacoes[cue.index];
  if (state.tourEstacaoAtual !== cue.index) {
    state.tourEstacaoAtual = cue.index; estacoes[cue.index].reset(); state.tourDemoResetada = -1;
    mascote?.irPara(ancoras[cue.index], cue.index === 0 ? 0.01 : R.chegar + R.aproximar - 0.5); mascote?.olhar(estacoes[cue.index].foco);
  }
  if (cue.fase === 'demo') { if (state.tourDemoResetada !== cue.index) { estacoes[cue.index].reset(); state.tourDemoResetada = cue.index; } estacoes[cue.index].update(cue.demoTime); }
  else if (cue.fase === 'takeaway') estacoes[cue.index].update(R.demo); // garante o estado final mesmo se o tempo pulou (seek, aba oculta)
  setTexto('tourKicker', `WORLD TOUR · ESTAÇÃO 0${cue.index + 1} DE 0${MUNDO.estacoes.length}`);
  $('tourCard').hidden = false; $('tourUI').classList.add('tem-card'); ajustarViewportTour();
  setTexto('cardEyebrow', `0${cue.index + 1} / ${cfg.nome.toUpperCase()}`); setTexto('cardTitulo', cfg.titulo);
  setTexto('cardExplicacao', cfg.explicacao);
  $('cardSequencia').innerHTML = cfg.sequencia.map((s, j) => `<span>${s}</span>${j < 2 ? '<b>→</b>' : ''}`).join('');
  setTexto('cardRotulo', cue.fase === 'chegando' ? 'O QUE VOCÊ ESTÁ VENDO' : cue.fase === 'takeaway' ? 'O QUE LEMBRAR' : 'O QUE ESTÁ ACONTECENDO');
  setTexto('cardObservacao', cue.observacao); $('cardObservacaoBloco').classList.toggle('is-takeaway', cue.fase === 'takeaway');
  atualizarDados(cue.index);
}

function atualizarDados(i = state.ativa) {
  const e = estacoes[i]; const el = state.modo === 'tour' ? $('cardDados') : $('estacaoDados');
  if (!e?.dados) { $('cardDados').hidden = true; $('estacaoDados').hidden = true; return; }
  el.hidden = false; el.textContent = `Resposta agora: total ${e.dados.total} · data ${e.dados.data}`;
}

// ---------- loop ----------
function tick(dt) {
  if (state.pausado || document.hidden) return;
  mascote?.update(dt);
  if (state.modo === 'tour') {
    state.tourT += dt * state.tourVel; atualizarTour();
    if (state.tourT >= TOUR_DURACAO) sairTour(true);
    return;
  }
  tickTween(dt);
  if (state.modo === 'estacao') {
    state.faseT += dt;
    if (state.fase === 'aproximar' && state.faseT >= (state.reduzido ? 0.6 : R.aproximar)) setFase('demo');
    else if (state.fase === 'demo') {
      const t = Math.min(R.demo, state.faseT); estacoes[state.ativa].update(t);
      setTexto('observacao', observacaoDaFase(MUNDO.estacoes[state.ativa], 'demo', t)); atualizarDados();
      if (state.faseT >= R.demo) setFase('resultado');
    }
  }
}

// ---------- eventos ----------
function ligarEventos() {
  $('btnTour').onclick = iniciarTour; $('btnIniciarTour').onclick = iniciarTour; $('btnRecapTour').onclick = iniciarTour;
  $('btnInicio').onclick = inicio; $('btnExplorar').onclick = () => mostrarEstacao(0); $('btnRecapExplorar').onclick = () => mostrarEstacao(0);
  $('btnRecap').onclick = recap;
  $('btnDemo').onclick = () => setFase('aproximar');
  $('btnAmpla').onclick = () => { state.tween = null; moverCamera(MUNDO.estacoes[state.ativa].camera.wide, 1.6); };
  $('btnProxima').onclick = () => (state.ativa === MUNDO.estacoes.length - 1 ? recap() : mostrarEstacao(state.ativa + 1));
  document.querySelectorAll('.estacao-botao').forEach((b, i) => (b.onclick = () => mostrarEstacao(i)));
  const alternarPausa = () => {
    state.pausado = !state.pausado;
    $('btnTourPausa').textContent = state.pausado ? 'Retomar' : 'Pausar'; $('btnCardPausa').textContent = state.pausado ? 'Retomar o tour' : 'Pausar pra ler';
    $('tourUI').classList.toggle('pausado', state.pausado);
  };
  $('btnTourPausa').onclick = alternarPausa; $('btnCardPausa').onclick = alternarPausa;
  $('btnTourReiniciar').onclick = iniciarTour; $('btnTourSair').onclick = () => sairTour(false);
  document.querySelectorAll('[data-vel]').forEach((b) => (b.onclick = () => { state.tourVel = +b.dataset.vel; syncVelocidade(); }));
  $('btnMovimento').onclick = () => { state.reduzido = !state.reduzido; $('btnMovimento').setAttribute('aria-pressed', String(state.reduzido)); if (state.ultimaPose && state.modo !== 'tour') { state.tween = null; aplicarPose(state.ultimaPose); } };
  $('btnMovimento').setAttribute('aria-pressed', String(state.reduzido));
  document.addEventListener('keydown', (e) => {
    if (state.modo !== 'tour') return;
    if (e.key === 'Escape') sairTour(false); if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); alternarPausa(); }
  });
  $('camMais').onclick = () => ctrl.zoom(0.85); $('camMenos').onclick = () => ctrl.zoom(1.18); $('camReset').onclick = () => ctrl.reset();
  const dlg = $('dlgFontes'); $('btnFontes').onclick = () => dlg.showModal(); $('btnFecharFontes').onclick = () => dlg.close();
}

// ---------- init ----------
async function init() {
  const palco = criarPalco(scene); pedestais = palco.pedestais;
  estacoes = MUNDO.estacoes.map((cfg, i) => DEMOS[cfg.demo](palco.ctx, pedestais[i], cfg));
  try { mascote = await criarMascote(palco.ctx, MUNDO.mascote); mascote.irPara(ancoras[0], 0); }
  catch (err) { console.error('mascote', err); $('avisoMascote').hidden = false; }
  palco.ctx.registrarSombras();
  ctrl = anexarControles(canvas, camera, alvo, {
    onUser: () => { state.usuarioCamera = true; state.tween = null; setTexto('viewLabel', 'Câmera livre · arraste, role, shift+arraste'); },
    onReset: () => { state.usuarioCamera = false; if (state.modo === 'estacao') moverCamera(MUNDO.estacoes[state.ativa].camera.wide, 1); else moverCamera(state.modo === 'recap' ? MUNDO.camera.final : MUNDO.camera.overview, 1); setTexto('viewLabel', state.modo === 'estacao' ? 'Vista da estação · ' + MUNDO.estacoes[state.ativa].curto : 'O palco inteiro'); },
    onClick: (e) => {
      if (state.modo === 'tour') return;
      const pick = scene.pick(scene.pointerX, scene.pointerY, (m) => estacoes.some((est) => est.pick.includes(m)));
      if (!pick?.hit) return;
      const i = estacoes.findIndex((est) => est.pick.includes(pick.pickedMesh)); if (i >= 0) mostrarEstacao(i);
    },
  });
  scene.onPointerMove = () => { if (state.modo === 'tour') return; const pick = scene.pick(scene.pointerX, scene.pointerY, (m) => estacoes.some((est) => est.pick.includes(m))); canvas.classList.toggle('pode-clicar', !!pick?.hit); };
  engine.setHardwareScalingLevel(1 / Math.min(devicePixelRatio || 1, 2));
  ligarEventos();
  // textos fixos
  setTexto('marcaTitulo', MUNDO.titulo); setTexto('marcaSub', `${MUNDO.marca} · mundo de aprendizagem`); document.title = `${MUNDO.titulo} — ${MUNDO.marca}`;
  setTexto('inicioTitulo', MUNDO.subtitulo); setTexto('inicioIntro', MUNDO.intro);
  $('inicioRota').innerHTML = MUNDO.estacoes.map((e, i) => `<li><span>0${i + 1}</span><div><strong>${e.nome}</strong><p>${e.principio}</p></div></li>`).join('');
  document.querySelectorAll('.estacao-botao').forEach((b, i) => (b.textContent = `0${i + 1} · ${MUNDO.estacoes[i].curto}`));
  setTexto('recapTitulo', MUNDO.recap.titulo); setTexto('recapTexto', MUNDO.recap.texto);
  $('recapLista').innerHTML = MUNDO.estacoes.map((e, i) => `<li><span>0${i + 1}</span><div><strong>${e.principio}</strong><p>${e.takeaway}</p></div></li>`).join('');
  $('listaFontes').innerHTML = MUNDO.fontes.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener">${f.rotulo}</a></li>`).join('');
  inicio(); moverCamera(MUNDO.camera.overview, 0);
  $('loading').hidden = true;
  const diag = new URLSearchParams(location.search).has('diagnostics'); $('diagnostics').hidden = !diag;
  const amostras = []; let acc = 0;
  engine.runRenderLoop(() => {
    const dt = Math.min(0.1, engine.getDeltaTime() / 1000); tick(dt); scene.render();
    if (diag && !document.hidden) { amostras.push(dt * 1000); if (amostras.length > 600) amostras.shift(); acc += dt; if (acc > 1) { const s = [...amostras].sort((a, b) => a - b); const fps = 1000 / (amostras.reduce((a, b) => a + b, 0) / amostras.length); $('diagnostics').textContent = `${fps.toFixed(1)} fps · p95 ${s[Math.floor(s.length * 0.95)].toFixed(1)} ms · ${scene.getActiveMeshes().length} meshes · ${engine.getRenderWidth()}×${engine.getRenderHeight()}`; $('diagnostics').dataset.fps = fps.toFixed(1); acc = 0; } }
  });
}
new ResizeObserver(() => { engine.resize(); if (state.modo === 'tour') atualizarTour(); else if (state.ultimaPose && !state.tween && !state.usuarioCamera) aplicarPose(state.ultimaPose); }).observe(canvas);
window.__astra = { state, camera, mostrarEstacao, setFase, iniciarTour, sairTour, inicio, recap, get estacoes() { return estacoes; } };
init().catch((err) => { console.error(err); $('loading').innerHTML = 'O mundo 3D não carregou. <button onclick="location.reload()">Recarregar</button>'; });
