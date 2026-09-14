// Estação 1 — O portão. Pedido 1 chega ao portão fechado e é desviado pra revisão.
// Pedido 2 passa na checagem: o portão abre e a roda (ação) gira. Duas peças distintas: uma falha não "vira" sucesso.
import { Vector3, TransformNode } from '@babylonjs/core';

const lerp = (a, b, k) => a + (b - a) * k;
const ease = (r) => { r = Math.max(0, Math.min(1, r)); return r * r * (3 - 2 * r); };
const faixa = (t, a, b) => ease((t - a) / (b - a));

export function criarPortao(ctx, pedestal) {
  const { scene, mats } = ctx;
  const raiz = new TransformNode('portao', scene); raiz.parent = pedestal.raiz; raiz.position.y = pedestal.topoY;

  ctx.box('p-trilho', [0, 0.02, 0], [0.34, 0.04, 1.7], mats.pedraEscura, { parent: raiz, receive: true });
  for (const s of [-1, 1]) ctx.box(`p-poste${s}`, [s * 0.3, 0.3, 0], [0.1, 0.6, 0.1], mats.verde, { parent: raiz });
  const barra = ctx.box('p-barra', [0, 0.36, 0], [0.64, 0.08, 0.08], mats.terracota, { parent: raiz });

  const roda = new TransformNode('p-roda', scene); roda.parent = raiz; roda.position = new Vector3(0, 0.26, -0.6);
  ctx.cilindro('p-roda-c', [0, 0, 0], 0.44, 0.1, mats.verdeClaro, { parent: roda, rot: [0, 0, Math.PI / 2] });
  ctx.box('p-raio1', [0, 0, 0], [0.12, 0.36, 0.05], mats.branco, { parent: roda, sombra: false });
  ctx.box('p-raio2', [0, 0, 0], [0.12, 0.05, 0.36], mats.branco, { parent: roda, sombra: false });
  ctx.box('p-eixo', [0, 0.1, -0.6], [0.12, 0.2, 0.12], mats.pedraEscura, { parent: raiz });

  const bandeja = ctx.box('p-bandeja', [0.66, 0.05, 0.28], [0.42, 0.1, 0.42], mats.cinza, { parent: raiz, receive: true });

  const placaCheck = ctx.placa('p-placa-check', [0, 0.95, 0], 0.78, 0.18, 'CHECAGEM', { parent: raiz, fundo: '#1c211f', fonte: 0.55 });
  ctx.placa('p-placa-acao', [0, 0.84, -0.62], 0.44, 0.16, 'AÇÃO', { parent: raiz, fundo: '#2f5b47', fonte: 0.55 });
  ctx.placa('p-placa-rev', [0.66, 0.5, 0.28], 0.5, 0.16, 'REVISÃO', { parent: raiz, fundo: '#c65a3c', fonte: 0.55 });

  const pedidoA = ctx.box('p-pedidoA', [0, 0.15, 0.7], [0.22, 0.22, 0.22], mats.amarelo, { parent: raiz });
  const pedidoB = ctx.box('p-pedidoB', [0, 0.15, 1.02], [0.22, 0.22, 0.22], mats.amarelo, { parent: raiz });

  const foco = new Vector3(pedestal.x, pedestal.topoY + 0.3, 0);

  function reset() {
    pedidoA.position.set(0, 0.15, 0.7); pedidoB.position.set(0, 0.15, 1.02);
    barra.position.y = 0.36; roda.rotation.x = 0; bandeja.material = mats.cinza; placaCheck.set('CHECAGEM');
  }
  function update(t) {
    // 0–1.5 pedido A chega ao portão fechado
    pedidoA.position.z = lerp(0.7, 0.16, faixa(t, 0, 1.5));
    // 1.5–2.8 falha: A é desviado pra bandeja de revisão (pulinho lateral)
    if (t > 1.5) {
      const k = faixa(t, 1.5, 2.8);
      pedidoA.position.x = lerp(0, 0.66, k); pedidoA.position.z = lerp(0.16, 0.28, k);
      pedidoA.position.y = 0.15 + Math.sin(Math.PI * k) * 0.25 + (k >= 1 ? 0.06 : 0);
      bandeja.material = t > 2.4 ? mats.erro : mats.cinza;
      placaCheck.set(t > 2.0 && t < 4.2 ? 'CHECAGEM ✗' : t >= 4.2 ? 'CHECAGEM ✓' : 'CHECAGEM');
    }
    // 2.8–4.0 pedido B chega
    if (t > 2.8) pedidoB.position.z = lerp(1.02, 0.16, faixa(t, 2.8, 4.0));
    // 4.0–4.6 checagem passa: barra sobe
    if (t > 4.0) barra.position.y = lerp(0.36, 0.66, faixa(t, 4.0, 4.6));
    // 4.6–6 B atravessa e a roda gira
    if (t > 4.6) { pedidoB.position.z = lerp(0.16, -0.32, faixa(t, 4.6, 5.6)); roda.rotation.x = -(t - 4.6) * 5.5; }
  }
  reset();
  return { reset, update, foco, pick: [pedestal.pick[0], barra, pedidoA, pedidoB] };
}
