// Hilfen für die zweiten Wächter in Akt III (Salz, Stadt, Wald, Gezeitenwerk, Ziegelgruben, Station).
// Liegt im Unterordner, damit bauen.js sie nicht als Gegner lädt.
'use strict';
const LIB = require('../../lib');
// Gesäter Hash 0..1 (kein Math.random)
const h = (a, b = 0, c = 0) => { const v = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return v - Math.floor(v); };
// Innenkanten: Pixel eines vorderen Teils, dessen Nachbar oben rechts zu einem hinteren Teil gehört, fängt Randlicht
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
// Kräftiges Randlicht an der Außenkante zur Lichtseite (rechts, rechts oben, oben): außen r2, dahinter r1
function randKraeftig(P, W, H, o = {}) {
  const bis = o.bis ?? H - 3, nur = o.nur || (() => true), z = [];
  const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y);
  for (let y = 0; y < bis; y++) for (let x = 0; x < W; x++) {
    const c = P.get(x, y); if (c < 1 || c > 5 || !nur(x, y)) continue;
    if (leer(x + 1, y) || leer(x + 1, y - 1) || (o.oben !== false && leer(x, y - 1) && leer(x + 1, y - 2))) z.push([x, y, 'r2']);
    else if (leer(x + 2, y) || leer(x + 2, y - 1) || leer(x, y - 1)) z.push([x, y, 'r1']);
  }
  for (const [x, y, c] of z) P.set(x, y, c);
}
// Quadrat (Würfelansicht) als Polygon um (cx, cy), Kantenlänge s, gedreht um a
function quad(cx, cy, sx, sy, a = 0) {
  const ca = Math.cos(a), sa = Math.sin(a);
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [cx + u * sx / 2 * ca - v * sy / 2 * sa, cy + u * sx / 2 * sa + v * sy / 2 * ca]);
}
// Pixel einer Gruppe durchlaufen
function jeder(gid, W, H, gi, fn, box) {
  const [x0, y0, x1, y1] = box || [0, 0, W - 1, H - 1];
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) if (gid[y * W + x] === gi) fn(x, y);
}
module.exports = { h, innenKanten, randKraeftig, quad, jeder, bay: LIB.bay };
