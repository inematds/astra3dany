// Mascote "Any": guia do mundo. Procedural em Babylon (Blender não está disponível nesta máquina).
// Se MUNDO.mascote.glb apontar pra um arquivo em public/assets, o GLB é carregado no lugar.
import { Vector3, Color3, TransformNode, SceneLoader, MeshBuilder, StandardMaterial } from '@babylonjs/core';

export async function criarMascote(ctx, cfg) {
  const { scene, mats, mat } = ctx;
  const raiz = new TransformNode('mascote', scene);
  const pernas = [];
  let tamanhoPasso = 0;

  if (cfg.glb) {
    const url = import.meta.env.BASE_URL + cfg.glb;
    const r = await SceneLoader.ImportMeshAsync('', url.slice(0, url.lastIndexOf('/') + 1), url.slice(url.lastIndexOf('/') + 1), scene);
    for (const m of r.meshes) { if (!m.parent) m.parent = raiz; ctx.casters.push(m); }
    for (const m of r.meshes) if (/^Leg\d|^Perna\d/i.test(m.name)) pernas.push({ mesh: m, rest: m.position.clone() });
  } else {
    const corpo = mat('mascote-corpo', cfg.cor, { roughness: 0.5 });
    const escuro = mat('mascote-escuro', cfg.corEscura, { roughness: 0.6 });
    const olho = mat('mascote-olho', '#1c211f'); olho.specularColor = new Color3(0.5, 0.5, 0.5);
    const brilho = mat('mascote-brilho', '#fbfaf5', { emissive: 0.6 });
    const boca = mat('mascote-boca', '#3a2412');
    // corpo: bloco principal + placa frontal levemente recuada + faixa escura embaixo (silhueta com leitura de "peça de design")
    ctx.box('m-corpo', [0, 0.62, 0], [0.78, 0.5, 0.5], corpo, { parent: raiz });
    ctx.box('m-cinta', [0, 0.4, 0], [0.8, 0.08, 0.52], escuro, { parent: raiz });
    ctx.box('m-placa', [0, 0.64, 0.255], [0.62, 0.36, 0.02], escuro, { parent: raiz, sombra: false });
    // olhos redondos com brilho
    for (const s of [-1, 1]) {
      ctx.esfera(`m-olho${s}`, [s * 0.17, 0.68, 0.27], 0.13, olho, { parent: raiz, sombra: false });
      ctx.esfera(`m-brilho${s}`, [s * 0.17 + 0.03, 0.71, 0.33], 0.035, brilho, { parent: raiz, sombra: false });
    }
    // sorriso curto
    ctx.box('m-boca', [0, 0.56, 0.27], [0.16, 0.03, 0.02], boca, { parent: raiz, sombra: false });
    // orelhas/abas laterais
    for (const s of [-1, 1]) ctx.box(`m-aba${s}`, [s * 0.44, 0.66, 0], [0.1, 0.22, 0.26], escuro, { parent: raiz });
    // antena
    ctx.cilindro('m-antena', [0, 0.95, 0], 0.04, 0.18, escuro, { parent: raiz, tess: 12 });
    ctx.esfera('m-antena-bola', [0, 1.06, 0], 0.11, mats.amarelo, { parent: raiz });
    // quatro pernas com pé
    const posPernas = [[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]];
    posPernas.forEach(([x, z], i) => {
      const perna = new TransformNode(`Perna${i + 1}`, scene); perna.parent = raiz; perna.position = new Vector3(x, 0.36, z);
      ctx.cilindro(`m-perna${i}`, [0, -0.16, 0], 0.11, 0.32, corpo, { parent: perna, tess: 14 });
      ctx.cilindro(`m-pe${i}`, [0, -0.33, 0], 0.16, 0.06, escuro, { parent: perna, tess: 14 });
      pernas.push({ mesh: perna, rest: perna.position.clone() });
    });
  }
  tamanhoPasso = 0.07;

  // Sombra de contato simples (disco escuro semitransparente) — ancora o mascote no chão em qualquer luz.
  const disco = MeshBuilder.CreateDisc('m-sombra', { radius: 0.42, tessellation: 32 }, scene);
  const dm = new StandardMaterial('m-sombra-mat', scene); dm.diffuseColor = Color3.Black(); dm.alpha = 0.14; dm.specularColor = Color3.Black();
  disco.material = dm; disco.rotation.x = Math.PI / 2; disco.position.y = 0.006; disco.parent = raiz;

  const estado = { de: null, para: null, t: 0, dur: 0, andando: false, faseAndar: 0, olharPara: null };

  function irPara(pos, dur = 2) {
    estado.de = raiz.position.clone(); estado.para = pos.clone(); estado.t = 0; estado.dur = Math.max(0.001, dur); estado.andando = dur > 0.05;
    if (dur <= 0.05) { raiz.position.copyFrom(pos); estado.andando = false; }
  }
  function olhar(alvo) { estado.olharPara = alvo ? alvo.clone() : null; }

  function update(dt) {
    if (estado.andando) {
      estado.t += dt; const r = Math.min(1, estado.t / estado.dur); const k = r * r * (3 - 2 * r);
      raiz.position = Vector3.Lerp(estado.de, estado.para, k);
      estado.faseAndar += dt * 9;
      const dir = estado.para.subtract(estado.de);
      if (dir.length() > 0.01) raiz.rotation.y = Math.atan2(dir.x, dir.z);
      pernas.forEach((p, i) => { p.mesh.position.y = p.rest.y + Math.max(0, Math.sin(estado.faseAndar + (i % 2) * Math.PI)) * tamanhoPasso; });
      raiz.position.y = Math.abs(Math.sin(estado.faseAndar)) * 0.02;
      if (r >= 1) { estado.andando = false; raiz.position.y = 0; pernas.forEach((p) => p.mesh.position.copyFrom(p.rest)); }
    } else if (estado.olharPara) {
      const d = estado.olharPara.subtract(raiz.position); const alvo = Math.atan2(d.x, d.z);
      let diff = alvo - raiz.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      raiz.rotation.y += diff * Math.min(1, dt * 4);
    }
  }

  return { raiz, irPara, olhar, update, get andando() { return estado.andando; } };
}
