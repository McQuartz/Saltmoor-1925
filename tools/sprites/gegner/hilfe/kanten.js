// Binnenkanten für Gegner-Skripte (Auftrag 2, alte Biome): Randlicht und Fase auch an inneren Kanten.
// Der Renderer setzt Randlicht nur an der Außenkante der ganzen Figur. Diese Hilfen malen nach dem Rendern
// eine Lichtkante an die zum Gegenlicht (oben rechts) zeigende Kante einzelner Teile und einen Kontaktschatten
// an die abgewandte Kante. Liegt im Unterordner, damit bauen.js sie nicht als Gegner lädt.
'use strict';
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function sdPoly(px, py, v) {
  let d = (px - v[0][0]) ** 2 + (py - v[0][1]) ** 2, s = 1; const n = v.length;
  for (let i = 0, j = n - 1; i < n; j = i, i++) {
    const ex = v[j][0] - v[i][0], ey = v[j][1] - v[i][1], wx = px - v[i][0], wy = py - v[i][1];
    const h = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey || 1), 0, 1);
    const bx = wx - ex * h, by = wy - ey * h; d = Math.min(d, bx * bx + by * by);
    const c1 = py >= v[i][1], c2 = py < v[j][1], c3 = ex * wy > ey * wx;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
  }
  return s * Math.sqrt(d);
}
function sd(px, py, p) {
  if (p.t === 'p') return sdPoly(px, py, p.v) - (p.rd || 0);
  if (p.t === 'e') { const dx = (px - p.x) / p.rx, dy = (py - p.y) / p.ry; return (Math.hypot(dx, dy) - 1) * Math.min(p.rx, p.ry); }
  const ax = px - p.x1, ay = py - p.y1, bx = p.x2 - p.x1, by = p.y2 - p.y1;
  const h = clamp((ax * bx + ay * by) / (bx * bx + by * by || 1), 0, 1); const r = p.r1 + (p.r2 - p.r1) * h;
  return Math.hypot(ax - bx * h, ay - by * h) - r;
}
const drin = (formen, x, y) => formen.some(p => sd(x + 0.5, y + 0.5, p) < 0);
function box(formen) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const p of formen) {
    if (p.t === 'p') p.v.forEach(([a, b]) => { x0 = Math.min(x0, a - 2 - (p.rd || 0)); x1 = Math.max(x1, a + 2 + (p.rd || 0)); y0 = Math.min(y0, b - 2 - (p.rd || 0)); y1 = Math.max(y1, b + 2 + (p.rd || 0)); });
    else if (p.t === 'e') { x0 = Math.min(x0, p.x - p.rx - 1); x1 = Math.max(x1, p.x + p.rx + 1); y0 = Math.min(y0, p.y - p.ry - 1); y1 = Math.max(y1, p.y + p.ry + 1); }
    else { const r = Math.max(p.r1, p.r2) + 1; x0 = Math.min(x0, p.x1 - r, p.x2 - r); x1 = Math.max(x1, p.x1 + r, p.x2 + r); y0 = Math.min(y0, p.y1 - r, p.y2 - r); y1 = Math.max(y1, p.y1 + r, p.y2 + r); }
  }
  return [Math.floor(x0), Math.floor(y0), Math.ceil(x1), Math.ceil(y1)];
}
// Lichtkante: Pixel im Teil, deren Nachbar in Richtung d (Standard oben rechts) außerhalb des Teils liegt.
// c = Farbe der ersten Reihe, c2 = Farbe der zweiten Reihe (Fase), nur auf Körperpixel (1..4), dither: jede 2. Zeile.
function licht(P, formen, o = {}) {
  formen = [].concat(formen).flat(3); const d = o.d || [1, -1], c = o.c || 'r1', c2 = o.c2 === undefined ? 'k3' : o.c2;
  const [x0, y0, x1, y1] = box(formen); const B = o.bis ?? 1e9;
  for (let y = y0; y <= Math.min(y1, B); y++) for (let x = x0; x <= x1; x++) {
    const cur = P.get(x, y); if (cur < 1 || cur > 4) continue;
    if (!drin(formen, x, y)) continue;
    if (!drin(formen, x + d[0], y + d[1]) && (!o.nur || o.nur(x, y))) { if (!o.luecke || (x + y) % o.luecke) P.set(x, y, c); }
    else if (c2 && !drin(formen, x + 2 * d[0], y + 2 * d[1]) && cur < 4) P.set(x, y, c2);
  }
}
// Schattenkante: Pixel im Teil, deren Nachbar in Richtung d (Standard unten links) außerhalb liegt -> dunkelste Stufe
function schatten(P, formen, o = {}) {
  formen = [].concat(formen).flat(3); const d = o.d || [-1, 1], c = o.c || 'k0';
  const [x0, y0, x1, y1] = box(formen);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const cur = P.get(x, y); if (cur < 1 || cur > 6) continue;
    if (drin(formen, x, y) && !drin(formen, x + d[0], y + d[1])) P.set(x, y, c);
  }
}
module.exports = { licht, schatten, drin, sd };
