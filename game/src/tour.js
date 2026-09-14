// Timeline do World Tour: segundos, poses de câmera e cues de texto. Sem Babylon (testável em node).
import { MUNDO } from './mundo.config.js';

const R = MUNDO.ritmo;

// Capítulos por estação: chegar (wide) → aproximar (closeStart) → demo (closeStart→closeEnd) → segurar (closeEnd parado).
export const TOUR_ESTACOES = MUNDO.estacoes.map((e, index) => {
  const chegada = R.intro + index * (R.chegar + R.aproximar + R.demo + R.segurar);
  const close = chegada + R.chegar;
  const demo = close + R.aproximar;
  const resultado = demo + R.demo;
  const fim = resultado + R.segurar;
  return { index, id: e.id, chegada, close, demo, resultado, fim, nome: e.nome, titulo: e.titulo, explicacao: e.explicacao, sequencia: e.sequencia, takeaway: e.takeaway };
});

function shots() {
  // intro: push-in lento da vista final pra overview; em `chegada` a câmera ainda está na pose anterior
  // e viaja até a vista ampla durante "chegar"; em `close` começa a aproximação; em `demo` já está no close-up.
  const lista = [{ at: 0, ...MUNDO.camera.final }, { at: R.intro, ...MUNDO.camera.overview, still: true }];
  for (const [i, e] of MUNDO.estacoes.entries()) {
    const t = TOUR_ESTACOES[i];
    lista.push({ at: t.close, ...e.camera.wide, still: true });
    lista.push({ at: t.demo, ...e.camera.closeStart, still: true });
    lista.push({ at: t.resultado, ...e.camera.closeEnd, still: true });
    lista.push({ at: t.fim, ...e.camera.closeEnd, still: true });
  }
  const ultimo = TOUR_ESTACOES.at(-1).fim;
  lista.push({ at: ultimo + R.saida / 2, ...MUNDO.camera.mascote });
  lista.push({ at: ultimo + R.saida, ...MUNDO.camera.final, still: true });
  // remove duplicatas de tempo mantendo a última definição
  const porTempo = new Map();
  for (const s of lista) porTempo.set(s.at, s);
  return [...porTempo.values()].sort((a, b) => a.at - b.at);
}
export const TOUR_SHOTS = shots();
export const TOUR_DURACAO = TOUR_SHOTS.at(-1).at;

const suave = (r) => r * r * (3 - 2 * r);

// Pose da câmera no segundo `t`. Com reduced motion, segura a pose "parada" do capítulo atual.
export function amostrarTour(t, reducedMotion = false) {
  const tempo = Math.max(0, Math.min(TOUR_DURACAO, t));
  let i = 0;
  while (i < TOUR_SHOTS.length - 2 && tempo >= TOUR_SHOTS[i + 1].at) i++;
  const de = TOUR_SHOTS[i], para = TOUR_SHOTS[i + 1];
  const bruto = para.at === de.at ? 1 : (tempo - de.at) / (para.at - de.at);
  const k = suave(Math.max(0, Math.min(1, bruto)));
  const mix = (a, b) => a + (b - a) * k;
  let parada = de;
  if (reducedMotion) {
    // a pose parada é o destino do trecho em movimento, ou o próprio trecho se ele é um hold
    parada = de.still && para.still ? de : para.still ? para : de.still ? de : para;
    if (!parada.still) parada = TOUR_SHOTS.slice(0, i + 2).reverse().find((s) => s.still) || de;
  }
  return {
    position: reducedMotion ? [...parada.position] : de.position.map((n, j) => mix(n, para.position[j])),
    target: reducedMotion ? [...parada.target] : de.target.map((n, j) => mix(n, para.target[j])),
    fov: reducedMotion ? parada.fov : mix(de.fov, para.fov),
    done: tempo >= TOUR_DURACAO,
  };
}

// Qual estação, fase e frase mostrar no card no segundo `t`. null fora das estações.
export function cueDoTour(t) {
  const est = TOUR_ESTACOES.find((s) => t >= s.chegada && t < s.fim);
  if (!est) return null;
  const cfg = MUNDO.estacoes[est.index];
  const demoTime = Math.max(0, Math.min(R.demo, t - est.demo));
  const fase = t < est.close ? 'chegando' : t < est.demo ? 'aproximando' : t < est.resultado ? 'demo' : 'takeaway';
  return { ...est, fase, demoTime, observacao: observacaoDaFase(cfg, fase, demoTime) };
}

export function observacaoDaFase(cfg, fase, demoTime) {
  if (fase === 'chegando') return cfg.chegando;
  if (fase === 'aproximando') return cfg.aproximando;
  if (fase === 'takeaway' || fase === 'resultado') return cfg.takeaway;
  const item = cfg.observacoes.find(([ate]) => demoTime < ate) || cfg.observacoes.at(-1);
  return item[1];
}
