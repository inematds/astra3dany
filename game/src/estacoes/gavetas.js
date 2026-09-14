// Estação 2 — As gavetas. O card de instruções entra na gaveta do PROJETO e os dois colegas ficam conectados.
// Metáfora visual de onde guardar orientação compartilhada; não é sincronização de arquivos.
import { Vector3, TransformNode } from '@babylonjs/core';

const lerp = (a, b, k) => a + (b - a) * k;
const ease = (r) => { r = Math.max(0, Math.min(1, r)); return r * r * (3 - 2 * r); };
const faixa = (t, a, b) => ease((t - a) / (b - a));

export function criarGavetas(ctx, pedestal) {
  const { scene, mats } = ctx;
  const raiz = new TransformNode('gavetas', scene); raiz.parent = pedestal.raiz; raiz.position.y = pedestal.topoY;

  ctx.box('g-armario', [0, 0.2, -0.2], [1.56, 0.4, 0.72], mats.pedraEscura, { parent: raiz, receive: true });
  const nomes = ['PESSOAL', 'PROJETO', 'TAREFA'];
  const xs = [-0.5, 0, 0.5];
  xs.forEach((x, i) => {
    // bandeja aberta: fundo + 4 paredes finas
    ctx.box(`g-fundo${i}`, [x, 0.415, -0.2], [0.42, 0.03, 0.56], i === 1 ? mats.verdeClaro : mats.verde, { parent: raiz, receive: true });
    ctx.box(`g-pf${i}`, [x, 0.47, 0.07], [0.42, 0.14, 0.02], mats.verde, { parent: raiz });
    ctx.box(`g-pt${i}`, [x, 0.47, -0.47], [0.42, 0.14, 0.02], mats.verde, { parent: raiz });
    ctx.box(`g-pl${i}`, [x - 0.2, 0.47, -0.2], [0.02, 0.14, 0.56], mats.verde, { parent: raiz });
    ctx.box(`g-pr${i}`, [x + 0.2, 0.47, -0.2], [0.02, 0.14, 0.56], mats.verde, { parent: raiz });
    ctx.placa(`g-rot${i}`, [x, 0.72, -0.5], 0.42, 0.13, nomes[i], { parent: raiz, fundo: i === 1 ? '#2f5b47' : '#1c211f', fonte: 0.5 });
  });

  const card = ctx.box('g-card', [0, 0.72, 0.62], [0.3, 0.025, 0.22], mats.amarelo, { parent: raiz });
  ctx.placa('g-card-rot', [0, 0.014, 0], 0.26, 0.09, 'INSTRUÇÕES', { parent: card, fundo: '#f2c14e', cor: '#1c211f', fonte: 0.62, rot: [-Math.PI / 2, 0, 0] });

  const colegas = [];
  const conectores = [];
  [[-0.92, 0.3], [0.92, 0.3]].forEach(([x, z], i) => {
    const corpo = ctx.cilindro(`g-colega${i}`, [x, 0.17, z], 0.2, 0.34, mats.cinza, { parent: raiz, tess: 20 });
    const cabeca = ctx.esfera(`g-cabeca${i}`, [x, 0.43, z], 0.18, mats.cinza, { parent: raiz });
    colegas.push(corpo, cabeca);
    // conector: uma barra fina que cresce da gaveta do projeto até o colega
    const dir = new Vector3(x, 0, z + 0.2); const comp = dir.length();
    const c = ctx.box(`g-con${i}`, [0, 0.5, -0.2], [comp, 0.03, 0.03], mats.azul, { parent: raiz, sombra: false });
    c.rotation.y = -Math.atan2(dir.z, dir.x); c.setPivotPoint(new Vector3(-comp / 2, 0, 0)); c.scaling.x = 0.001;
    conectores.push({ mesh: c, comp });
  });
  ctx.placa('g-rot-voce', [-0.92, 0.66, 0.3], 0.3, 0.12, 'COLEGA', { parent: raiz, fonte: 0.5 });
  ctx.placa('g-rot-time', [0.92, 0.66, 0.3], 0.3, 0.12, 'COLEGA', { parent: raiz, fonte: 0.5 });

  const foco = new Vector3(pedestal.x, pedestal.topoY + 0.3, 0);

  function reset() {
    card.position.set(0, 0.72, 0.62); card.rotation.set(0, 0, 0);
    for (const c of conectores) c.mesh.scaling.x = 0.001;
    for (const m of colegas) m.material = mats.cinza;
  }
  function update(t) {
    // 0–1.3 o card voa até em cima da gaveta do projeto; 1.3–2.2 desce pra dentro
    const k1 = faixa(t, 0, 1.3);
    card.position.z = lerp(0.62, -0.2, k1); card.position.y = lerp(0.72, 0.8, k1);
    if (t > 1.3) card.position.y = lerp(0.8, 0.45, faixa(t, 1.3, 2.2));
    // 2.2–4 conectores crescem; colegas acendem
    if (t > 2.2) {
      const k = faixa(t, 2.2, 3.8);
      for (const c of conectores) c.mesh.scaling.x = Math.max(0.001, k);
      if (t > 3.4) for (const m of colegas) m.material = mats.azul;
    }
  }
  reset();
  return { reset, update, foco, pick: [pedestal.pick[0], card] };
}
