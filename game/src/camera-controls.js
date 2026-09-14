// Exploração livre: orbit (arrastar), pan (shift/botão direito/dois dedos), zoom (roda/pinça/botões), teclado, reset.
// A câmera é uma FreeCamera sem inputs próprios; aqui mexemos em position + alvo e chamamos setTarget.
import { Vector3 } from '@babylonjs/core';

export function anexarControles(canvas, camera, alvo, opts = {}) {
  const ctrl = { ativo: true, alvo };
  const ponteiros = new Map();
  let arrastando = null; let moveu = 0; let pinca = null;

  const esferico = () => {
    const d = camera.position.subtract(alvo); const r = d.length();
    return { r, theta: Math.atan2(d.x, d.z), phi: Math.acos(Math.max(-1, Math.min(1, d.y / r))) };
  };
  const aplicar = ({ r, theta, phi }) => {
    r = Math.max(1.2, Math.min(22, r)); phi = Math.max(0.12, Math.min(1.45, phi));
    camera.position = new Vector3(alvo.x + r * Math.sin(phi) * Math.sin(theta), alvo.y + r * Math.cos(phi), alvo.z + r * Math.sin(phi) * Math.cos(theta));
    camera.setTarget(alvo);
  };
  const usuario = () => { opts.onUser?.(); };

  ctrl.orbitar = (dx, dy) => { const s = esferico(); s.theta -= dx; s.phi -= dy; aplicar(s); usuario(); };
  ctrl.zoom = (fator) => { const s = esferico(); s.r *= fator; aplicar(s); usuario(); };
  ctrl.pan = (dx, dy) => {
    const s = esferico(); const dir = alvo.subtract(camera.position).normalize();
    const direita = Vector3.Cross(Vector3.Up(), dir).normalize(); const cima = Vector3.Cross(dir, direita).normalize();
    const desloc = direita.scale(-dx * s.r).add(cima.scale(dy * s.r));
    alvo.addInPlace(desloc); camera.position.addInPlace(desloc); camera.setTarget(alvo); usuario();
  };
  ctrl.reset = () => opts.onReset?.();

  canvas.addEventListener('pointerdown', (e) => {
    if (!ctrl.ativo) return;
    ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId); moveu = 0;
    if (ponteiros.size === 2) { const [a, b] = [...ponteiros.values()]; pinca = { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; arrastando = null; return; }
    arrastando = { modo: e.shiftKey || e.button === 2 || e.button === 1 ? 'pan' : 'orbit', x: e.clientX, y: e.clientY };
    canvas.classList.add('dragging'); canvas.classList.toggle('pan-mode', arrastando.modo === 'pan');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!ctrl.ativo || !ponteiros.has(e.pointerId)) return;
    ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ponteiros.size === 2 && pinca) {
      const [a, b] = [...ponteiros.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
      if (Math.abs(d - pinca.d) > 1) ctrl.zoom(pinca.d / d);
      ctrl.pan((cx - pinca.cx) / canvas.clientWidth, (cy - pinca.cy) / canvas.clientHeight);
      pinca = { d, cx, cy }; moveu += 10; return;
    }
    if (!arrastando) return;
    const dx = e.clientX - arrastando.x, dy = e.clientY - arrastando.y; arrastando.x = e.clientX; arrastando.y = e.clientY; moveu += Math.abs(dx) + Math.abs(dy);
    if (arrastando.modo === 'pan') ctrl.pan(dx / canvas.clientWidth, dy / canvas.clientHeight);
    else ctrl.orbitar(dx * 0.006, dy * 0.005);
  });
  const soltar = (e) => {
    ponteiros.delete(e.pointerId); try { canvas.releasePointerCapture(e.pointerId); } catch {}
    if (ponteiros.size < 2) pinca = null;
    if (ponteiros.size === 0) { canvas.classList.remove('dragging', 'pan-mode'); if (moveu < 6 && ctrl.ativo) opts.onClick?.(e); arrastando = null; }
  };
  canvas.addEventListener('pointerup', soltar); canvas.addEventListener('pointercancel', soltar);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('wheel', (e) => { if (!ctrl.ativo) return; e.preventDefault(); ctrl.zoom(Math.exp(Math.sign(e.deltaY) * 0.12)); }, { passive: false });
  canvas.addEventListener('keydown', (e) => {
    if (!ctrl.ativo) return; const passo = 0.08;
    const mapa = { ArrowLeft: () => ctrl.orbitar(-passo, 0), ArrowRight: () => ctrl.orbitar(passo, 0), ArrowUp: () => ctrl.orbitar(0, -passo * 0.6), ArrowDown: () => ctrl.orbitar(0, passo * 0.6), '+': () => ctrl.zoom(0.88), '=': () => ctrl.zoom(0.88), '-': () => ctrl.zoom(1.14), r: () => ctrl.reset(), R: () => ctrl.reset() };
    if (mapa[e.key]) { e.preventDefault(); mapa[e.key](); }
  });
  return ctrl;
}
