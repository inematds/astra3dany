// Palco: chão, pedestais, luzes, sombras, materiais e helpers de geometria/placas.
import {
  Vector3, Color3, MeshBuilder, StandardMaterial, HemisphericLight, DirectionalLight, ShadowGenerator, DynamicTexture, TransformNode,
} from '@babylonjs/core';

export const PALETA = {
  pedra: '#d9d6cb', pedraEscura: '#b9b5a6', chao: '#e3e1d7', verde: '#2f5b47', verdeClaro: '#5f8a72', amarelo: '#f2c14e',
  terracota: '#d1663d', ambar: '#e0973a', ambarEscuro: '#b46f21', preto: '#1c211f', branco: '#fbfaf5', cinza: '#8a9088',
  ok: '#4f9f6a', erro: '#c65a3c', azul: '#5b8fb0',
};

export function criarPalco(scene) {
  const mats = {};
  const mat = (nome, hex, opts = {}) => {
    if (mats[nome]) return mats[nome];
    const m = new StandardMaterial(nome, scene);
    m.diffuseColor = Color3.FromHexString(hex);
    m.specularColor = new Color3(0.12, 0.11, 0.09);
    m.roughness = opts.roughness ?? 0.7;
    if (opts.emissive) m.emissiveColor = Color3.FromHexString(hex).scale(opts.emissive);
    mats[nome] = m;
    return m;
  };
  for (const [k, v] of Object.entries(PALETA)) mat(k, v, ['amarelo', 'ok', 'erro', 'azul'].includes(k) ? { emissive: 0.25 } : {});

  const ctx = { scene, mats, mat, sombras: null, casters: [] };

  ctx.box = (nome, pos, tam, material, o = {}) => {
    const m = MeshBuilder.CreateBox(nome, { width: tam[0], height: tam[1], depth: tam[2] }, scene);
    m.position = Vector3.FromArray(pos); m.material = material;
    if (o.parent) m.parent = o.parent; if (o.rot) m.rotation = Vector3.FromArray(o.rot);
    if (o.receive) m.receiveShadows = true; if (o.sombra !== false) ctx.casters.push(m);
    return m;
  };
  ctx.cilindro = (nome, pos, d, h, material, o = {}) => {
    const m = MeshBuilder.CreateCylinder(nome, { diameter: d, height: h, tessellation: o.tess || 40 }, scene);
    m.position = Vector3.FromArray(pos); m.material = material;
    if (o.parent) m.parent = o.parent; if (o.rot) m.rotation = Vector3.FromArray(o.rot);
    if (o.receive) m.receiveShadows = true; if (o.sombra !== false) ctx.casters.push(m);
    return m;
  };
  ctx.esfera = (nome, pos, d, material, o = {}) => {
    const m = MeshBuilder.CreateSphere(nome, { diameter: d, segments: 20 }, scene);
    m.position = Vector3.FromArray(pos); m.material = material;
    if (o.parent) m.parent = o.parent; if (o.sombra !== false) ctx.casters.push(m);
    return m;
  };
  // Placa com texto (DynamicTexture). Devolve { mesh, set(texto) } — só redesenha quando o texto muda.
  ctx.placa = (nome, pos, larg, alt, texto, o = {}) => {
    const px = o.px || 256;
    const tex = new DynamicTexture(nome + '-tex', { width: Math.round(px * larg / alt), height: px }, scene, true);
    tex.hasAlpha = true;
    const m = new StandardMaterial(nome + '-mat', scene);
    m.diffuseTexture = tex; m.emissiveColor = new Color3(0.85, 0.85, 0.85); m.specularColor = Color3.Black(); m.backFaceCulling = false;
    const plano = MeshBuilder.CreatePlane(nome, { width: larg, height: alt }, scene);
    plano.position = Vector3.FromArray(pos); plano.material = m; if (o.parent) plano.parent = o.parent; if (o.rot) plano.rotation = Vector3.FromArray(o.rot);
    let atual = null;
    const set = (t) => {
      if (t === atual) return; atual = t;
      const c = tex.getContext(); const w = tex.getSize().width, h = tex.getSize().height;
      c.clearRect(0, 0, w, h);
      c.fillStyle = o.fundo || PALETA.preto; roundRect(c, 0, 0, w, h, h * 0.18); c.fill();
      c.fillStyle = o.cor || PALETA.branco; c.textAlign = 'center'; c.textBaseline = 'middle';
      const linhas = String(t).split('\n'); let fs = (o.fonte || 0.5) * h / Math.max(1, linhas.length * 0.85);
      const fonte = (px) => `${o.peso || 700} ${px}px system-ui, -apple-system, Segoe UI, sans-serif`;
      c.font = fonte(fs);
      // encolhe a fonte até a linha mais larga caber na placa (evita texto cortado)
      const maisLarga = Math.max(...linhas.map((l) => c.measureText(l).width));
      if (maisLarga > w * 0.9) { fs *= (w * 0.9) / maisLarga; c.font = fonte(fs); }
      linhas.forEach((l, i) => c.fillText(l, w / 2, h / 2 + (i - (linhas.length - 1) / 2) * fs * 1.1));
      tex.update();
    };
    set(texto);
    return { mesh: plano, set };
  };

  // Chão e fundo — estúdio claro, sem sala fechada.
  const chao = MeshBuilder.CreateGround('chao', { width: 26, height: 18 }, scene);
  chao.material = mats.chao; chao.receiveShadows = true;
  const degrau = ctx.box('degrau', [0, 0.06, -3.3], [13, 0.12, 2.2], mats.pedra, { receive: true });
  const fundo = ctx.box('fundo', [0, 0.9, -4.6], [13, 1.8, 0.3], mats.pedraEscura, { receive: true });
  fundo.receiveShadows = true; degrau.receiveShadows = true;

  // Pedestais
  const pedestais = [];
  const xs = [-3, 0, 3];
  for (const [i, x] of xs.entries()) {
    const raiz = new TransformNode(`pedestal-${i}`, scene); raiz.position = new Vector3(x, 0, 0);
    ctx.cilindro(`base-${i}`, [0, 0.45, 0], 2.15, 0.9, mats.pedra, { parent: raiz, receive: true });
    const topo = ctx.cilindro(`topo-${i}`, [0, 0.94, 0], 2.3, 0.08, mats.verde, { parent: raiz, receive: true });
    topo.receiveShadows = true;
    ctx.placa(`num-${i}`, [0, 0.45, 1.09], 0.42, 0.28, `0${i + 1}`, { parent: raiz, fundo: PALETA.verde, fonte: 0.62 });
    pedestais.push({ raiz, x, topoY: 0.98, pick: [topo] });
  }

  // Luzes
  const hemi = new HemisphericLight('hemi', new Vector3(0.2, 1, 0.3), scene);
  hemi.intensity = 0.7; hemi.groundColor = Color3.FromHexString('#c9c6b8');
  const key = new DirectionalLight('key', new Vector3(-0.45, -1, -0.5), scene);
  key.position = new Vector3(5, 10, 6); key.intensity = 1.35; key.diffuse = Color3.FromHexString('#fff5e6');
  const sombras = new ShadowGenerator(1024, key);
  sombras.useBlurExponentialShadowMap = true; sombras.blurKernel = 12; sombras.bias = 0.0025; sombras.normalBias = 0.02; sombras.setDarkness(0.45);
  ctx.sombras = sombras;
  ctx.registrarSombras = () => { for (const m of ctx.casters) sombras.addShadowCaster(m); ctx.casters.length = 0; };

  return { ctx, pedestais };
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
