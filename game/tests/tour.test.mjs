import test from 'node:test';
import assert from 'node:assert/strict';
import { amostrarTour, TOUR_SHOTS, TOUR_DURACAO, TOUR_ESTACOES, cueDoTour, observacaoDaFase } from '../src/tour.js';
import { MUNDO } from '../src/mundo.config.js';

const R = MUNDO.ritmo;
const dist = (p) => Math.hypot(...p.position.map((n, i) => n - p.target[i]));

test('o tour passa por todas as poses autorais e termina em ~60 s', () => {
  for (const shot of TOUR_SHOTS) {
    const p = amostrarTour(shot.at);
    assert.deepEqual(p.position, shot.position);
    assert.deepEqual(p.target, shot.target);
  }
  assert.equal(TOUR_DURACAO, R.intro + MUNDO.estacoes.length * (R.chegar + R.aproximar + R.demo + R.segurar) + R.saida);
  assert.equal(amostrarTour(TOUR_DURACAO).done, true);
  assert.equal(amostrarTour(TOUR_DURACAO - 0.1).done, false);
});

test('cada estação: chegar 3 s, aproximar 3 s, demo 6 s, segurar 5 s, close-up bem mais perto que a vista ampla', () => {
  for (const est of TOUR_ESTACOES) {
    assert.equal(est.close - est.chegada, R.chegar);
    assert.equal(est.demo - est.close, R.aproximar);
    assert.equal(est.resultado - est.demo, R.demo);
    assert.equal(est.fim - est.resultado, 5);
    const wide = amostrarTour(est.close), close = amostrarTour(est.demo);
    assert.ok(dist(close) < dist(wide) * 0.7, `${est.id}: close-up deveria ser bem mais perto`);
  }
});

test('o resultado fica parado durante os 5 s de hold e a câmera não salta entre trechos', () => {
  for (const est of TOUR_ESTACOES) {
    assert.deepEqual(amostrarTour(est.resultado).position, amostrarTour(est.fim - 0.1).position);
    // ao chegar, a câmera ainda está onde parou (hold anterior ou overview): sem corte seco
    const anterior = est.index === 0 ? amostrarTour(R.intro) : amostrarTour(TOUR_ESTACOES[est.index - 1].fim);
    assert.deepEqual(amostrarTour(est.chegada).position, anterior.position);
  }
  for (let i = 1; i < TOUR_SHOTS.length; i++) {
    const antes = amostrarTour(TOUR_SHOTS[i].at - 0.01), depois = amostrarTour(TOUR_SHOTS[i].at);
    for (let j = 0; j < 3; j++) assert.ok(Math.abs(antes.position[j] - depois.position[j]) < 0.05, `salto no shot ${i}`);
  }
});

test('reduced motion segura poses paradas dentro de cada capítulo', () => {
  for (const est of TOUR_ESTACOES) {
    const a = amostrarTour(est.chegada + 0.5, true), b = amostrarTour(est.close - 0.1, true);
    assert.deepEqual(a.position, b.position);
    const c = amostrarTour(est.resultado + 0.5, true), d = amostrarTour(est.fim - 0.1, true);
    assert.deepEqual(c.position, d.position);
  }
  assert.deepEqual(amostrarTour(0.5, true).position, MUNDO.camera.overview.position);
  assert.deepEqual(amostrarTour(TOUR_DURACAO, true).position, MUNDO.camera.final.position);
});

test('cada card acompanha a estação certa e cada fase tem a frase certa', () => {
  assert.equal(cueDoTour(0), null);
  assert.equal(cueDoTour(TOUR_ESTACOES.at(-1).fim), null);
  for (const [i, est] of TOUR_ESTACOES.entries()) {
    const cfg = MUNDO.estacoes[i];
    assert.equal(cueDoTour(est.chegada).index, i);
    assert.equal(cueDoTour(est.chegada).fase, 'chegando');
    assert.equal(cueDoTour(est.chegada).observacao, cfg.chegando);
    assert.equal(cueDoTour(est.close).fase, 'aproximando');
    assert.equal(cueDoTour(est.demo).fase, 'demo');
    assert.equal(cueDoTour(est.demo).demoTime, 0);
    assert.equal(cueDoTour(est.resultado).fase, 'takeaway');
    assert.equal(cueDoTour(est.resultado).observacao, cfg.takeaway);
    assert.equal(cueDoTour(est.fim - 0.01).observacao, cfg.takeaway);
    // a última observação da demo é a que fica visível no fim dos 6 s
    assert.equal(observacaoDaFase(cfg, 'demo', R.demo - 0.01), cfg.observacoes.at(-1)[1]);
  }
});

test('a demo do portão narra a falha antes do sucesso; a conferência narra a correção', () => {
  const portao = TOUR_ESTACOES[0];
  assert.match(cueDoTour(portao.demo + 2).observacao, /falhou/i);
  assert.match(cueDoTour(portao.demo + 4).observacao, /passou/i);
  const conf = TOUR_ESTACOES[2];
  assert.match(cueDoTour(conf.demo + 1).observacao, /formato/i);
  assert.match(cueDoTour(conf.demo + 4).observacao, /90/);
});

test('cada estação tem UMA mudança visível descrita e um takeaway curto', () => {
  for (const e of MUNDO.estacoes) {
    assert.ok(e.observacoes.length >= 2);
    assert.ok(e.takeaway.length < 110);
    assert.equal(e.sequencia.length, 3);
    assert.ok(e.camera.wide && e.camera.closeStart && e.camera.closeEnd);
  }
});
