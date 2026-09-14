// Estação 3 — A conferência. Formato passa; a conferência com a fonte muda o total de 100 pra 90
// e deixa a data em aberto (a fonte não dá data). Valores também ficam legíveis em HTML via `dados`.
import { Vector3, TransformNode } from '@babylonjs/core';

const lerp = (a, b, k) => a + (b - a) * k;
const ease = (r) => { r = Math.max(0, Math.min(1, r)); return r * r * (3 - 2 * r); };
const faixa = (t, a, b) => ease((t - a) / (b - a));

export function criarConferencia(ctx, pedestal, cfg) {
  const { scene, mats } = ctx;
  const d = cfg.dados;
  const raiz = new TransformNode('conferencia', scene); raiz.parent = pedestal.raiz; raiz.position.y = pedestal.topoY;

  // duas molduras em pé: resposta (esq) e fonte (dir)
  for (const [i, x] of [-0.52, 0.52].entries()) {
    ctx.box(`c-moldura${i}`, [x, 0.5, -0.1], [0.82, 0.62, 0.06], mats.verde, { parent: raiz });
    ctx.box(`c-pe${i}`, [x, 0.08, -0.1], [0.3, 0.16, 0.2], mats.pedraEscura, { parent: raiz });
  }
  const textoResposta = (v) => `RESPOSTA\ntotal: ${v.total}\ndata: ${v.data}`;
  const resposta = ctx.placa('c-resposta', [-0.52, 0.5, -0.065], 0.74, 0.54, textoResposta(d.antes), { parent: raiz, fundo: '#fbfaf5', cor: '#1c211f', fonte: 0.6, px: 320 });
  ctx.placa('c-fonte', [0.52, 0.5, -0.065], 0.74, 0.54, `FONTE\n${d.fonte}\ndata: —`, { parent: raiz, fundo: '#fbfaf5', cor: '#1c211f', fonte: 0.6, px: 320 });

  // quadro de inspeção (moldura fina que varre a resposta)
  const quadro = new TransformNode('c-quadro', scene); quadro.parent = raiz; quadro.position = new Vector3(-0.52, 0.72, 0.0);
  ctx.box('c-q1', [0, 0.06, 0], [0.8, 0.02, 0.02], mats.amarelo, { parent: quadro, sombra: false });
  ctx.box('c-q2', [0, -0.06, 0], [0.8, 0.02, 0.02], mats.amarelo, { parent: quadro, sombra: false });
  quadro.setEnabled(false);

  // selos
  const selos = [];
  [['FORMATO', -0.52], ['FONTE', 0.52]].forEach(([nome, x], i) => {
    const s = ctx.esfera(`c-selo${i}`, [x, 0.12, 0.42], 0.16, mats.cinza, { parent: raiz });
    ctx.placa(`c-selo-rot${i}`, [x, 0.12, 0.52], 0.34, 0.11, nome, { parent: raiz, fonte: 0.55 });
    selos.push(s);
  });

  const foco = new Vector3(pedestal.x, pedestal.topoY + 0.45, 0);
  const dados = { total: d.antes.total, data: d.antes.data };

  function reset() {
    resposta.set(textoResposta(d.antes)); Object.assign(dados, d.antes);
    for (const s of selos) s.material = mats.cinza; quadro.setEnabled(false); quadro.position.y = 0.72;
  }
  function update(t) {
    // 0–2.6 o quadro varre a resposta de cima a baixo; 2.6 selo FORMATO ok
    if (t > 0.2 && t < 3.2) { quadro.setEnabled(true); quadro.position.y = lerp(0.74, 0.26, faixa(t, 0.2, 2.6)); } else quadro.setEnabled(false);
    selos[0].material = t > 2.6 ? mats.ok : mats.cinza;
    // 3.6 total vira 90; 4.8 data vira desconhecida; 5.2 selo FONTE ok
    const v = { total: t > 3.6 ? d.depois.total : d.antes.total, data: t > 4.8 ? d.depois.data : d.antes.data };
    resposta.set(textoResposta(v)); Object.assign(dados, v);
    selos[1].material = t > 5.2 ? mats.ok : mats.cinza;
  }
  reset();
  return { reset, update, foco, dados, pick: [pedestal.pick[0]] };
}
