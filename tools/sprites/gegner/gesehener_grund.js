// Der Umfaltende (Gesehener, Akt IV, an kein Biom gebunden). Etwas Größeres, Lappiges mit Mundorganen, das sich um
// dich herum faltet. Zwei dicke, gefaltete Lappen hängen von einem gemeinsamen Bogen herab wie eine Klammer um eine
// leere Stelle; in der Mitte hängt die Kappe mit den ungleichen Augen und dem Mundorgan, an der Innenseite jedes
// Lappens sitzen zwei große Zahnringe. Mit jedem Atemzug schließt sich die Klammer ein Stück.
// Durchsichtig macht das Spiel zur Laufzeit (halb durchsichtig im Bayer-Raster, schwebend, ohne Bodenschatten);
// das Sprite ist geschlossen gezeichnet, ohne Lücken und ohne Schatten. Die Falten sind Dither-Verläufe über
// zwei bis drei Tonstufen.
// Silhouetten-Proben (a gebaut, b verworfen): a = zwei Lappen als geschlossene Klammer um eine leere Mitte;
// b = ein Umhang aus übereinanderliegenden Lappen (bei Entfernung ein Mantel, die Richtung fehlt).
'use strict';
const LIB = require('../lib');

// Ein Lappen: Mittellinie als Bogen, als Blatt mit gerüschter Außenkante. seite -1 links, +1 rechts.
// zu: 0 offen .. 1 geschlossen (der Lappen schwingt zur Mitte, die Spitze rollt ein)
function lappen(seite, c, zu, hub, flatter) {
  const links = seite < 0;
  const mx = links ? 47 : 49, my = 60, Rx = (links ? 29 : 29.5) * (1 - 0.3 * zu), Ry = links ? 44 : 45;
  const p0 = -1.35 - 0.1 * zu, p1 = (links ? 1.2 : 1.15) + 0.5 * zu, wmax = links ? 11.5 : 11;
  const N = 18, pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, ph = p0 + (p1 - p0) * t;
    pts.push({ x: mx + seite * Rx * Math.cos(ph) - seite * zu * 8 * Math.sin(Math.PI * t) + c, y: my + Ry * Math.sin(ph) + hub, t, w: wmax * Math.pow(Math.sin(Math.PI * (0.03 + 0.94 * t)), 0.6) + 2 });
  }
  const aussen = [], innen = [];
  pts.forEach((a, i) => {
    const b = pts[Math.min(N, i + 1)], d = pts[Math.max(0, i - 1)]; let tx = b.x - d.x, ty = b.y - d.y; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    let nx = ty, ny = -tx; if (nx * seite < 0) { nx = -nx; ny = -ny; } // nach außen
    const rue = 1 + 0.34 * Math.abs(Math.sin(a.t * Math.PI * (links ? 3.5 : 4.5) + (links ? 0.6 : 1.4) + (flatter || 0) * 0.1));
    aussen.push([a.x + nx * a.w * rue, a.y + ny * a.w * rue]); innen.push([a.x - nx * a.w * 0.75, a.y - ny * a.w * 0.75]);
    a.nx = nx; a.ny = ny;
  });
  return { pts, poly: { t: 'p', v: [...aussen, ...innen.reverse()], m: null, rd: 1, b: 4 } };
}

module.exports = {
  id: 'gesehener_grund', zone: 'blick', rang: 'normal', w: 96, h: 120, fuss: [48, 114], kopf: [48, 44], rimBis: 108, todStart: 0.15,
  varianten: { gesehener_grund: {} },
  // verworfene Probe b: Umhang aus Lappen (nur Silhouette)
  proben: {
    umhang() {
      const { E, Pg } = LIB;
      return [{ p: [E(48, 30, 15, 14, null), Pg([[34, 36], [62, 36], [80, 70], [72, 104], [62, 92], [54, 106], [44, 94], [34, 106], [22, 90], [16, 70]], null, { rd: 2 }), E(22, 64, 9, 16, null), E(76, 60, 10, 18, null)], k: 3 }];
    },
  },
  bild(p, v, A) {
    const { E, C, glied, r, bay } = A;
    const f = p.f, q = p.q, W = 96, H = 120;
    // zu: Lappen schließen sich; mund: Zahnringe öffnen sich; lunge: Versatz nach links; hub: Heben; senk: Kappe sinkt
    let zu = 0, mund = 0, lunge = 0, hub = 0, senk = 0, fall = 0, aug = 1;
    if (p.idle) { mund = [0, 1, 0, -1][f]; hub = [0, -1, -1, 0][f]; }
    if (p.angriff) { zu = [0.1, 0.0, 0.62, 0.3][f]; mund = [1, 2, 4, 2][f]; lunge = [2, 4, -9, -3][f]; hub = [-2, -5, 2, 0][f]; senk = [0, -2, 3, 1][f]; aug = [1, 1, 2, 1][f]; }
    if (p.treffer) { zu = 0.14; mund = -1; lunge = [4, 2][f]; hub = [1, 0][f]; senk = 2; }
    if (p.tod) { zu = 0.25 + q * 0.5; mund = -1; fall = r(q * 38); senk = r(q * 10); }
    const fl = p.idle ? f : 2 + f;
    const L = lappen(-1, lunge, zu, hub + fall, fl), R = lappen(1, lunge, zu, hub + fall, fl);
    // Bogen: verbindet die beiden Lappen oben, damit eine geschlossene Klammer entsteht
    const a0 = L.pts[0], b0 = R.pts[0];
    const bogen = [C(a0.x, a0.y + 2, b0.x, b0.y + 2, 6.5, 6.5, null), E((a0.x + b0.x) / 2, a0.y + 3, 10, 6, null)];
    // Kappe: breite Haube tief in der Mitte; Fransen hängen darunter
    const kx = 48 + lunge, ky = 40 + hub + senk + fall;
    const kappe = [E(kx, ky, 14, 10, null, { pf: 'dome' }), E(kx - 9, ky + 3, 6.5, 6, null), E(kx + 9, ky + 3, 6.5, 6.5, null)];
    const fransen = [];
    [[-8, 16], [0, 26], [8, 19]].forEach(([dx, len], i) => {
      const P = []; for (let k = 0; k <= 4; k++) { const t = k / 4; P.push([kx + dx + Math.sin(t * 3 + fl * 0.6 + i) * (0.3 + 0.6 * t) * (1 - zu * 0.3) - lunge * 0.2 * t, ky + 9 + t * len * (1 - 0.5 * zu) + (p.tod ? t * 4 : 0)]); }
      fransen.push(...glied(P, 3.6, 1.4, null));
    });
    // Zipfel: lose Enden der Lappen, hängen unter dem Saum
    const zipfel = [];
    for (const lp of [L, R]) { const e = lp.pts[18], s2 = lp === L ? -1 : 1; zipfel.push(...glied([[e.x, e.y - 2], [e.x + s2 * 1 - 2, e.y + 5], [e.x + s2 * 3 - 3, Math.min(110, e.y + 11 + (p.tod ? 0 : 3))]], 4.5, 1, null)); }
    const gruppen = [
      { p: [R.poly], k: 1 },                                // 0 rechter Lappen (hinten)
      { p: [L.poly], k: 1 },                                // 1 linker Lappen
      { p: bogen, k: 3 },                                   // 2 Bogen
      { p: zipfel, k: 0.8 },                                // 3 Zipfel
      { p: [...fransen], k: 0.8 },                          // 4 Fransen
      { p: kappe, k: 2.5 },                                 // 5 Kappe
    ];
    gruppen.forEach(g => { g.anker = [lunge, hub + fall]; });
    const pal = LIB.palette('blick');
    const { gid } = LIB.render(W, H, gruppen, pal, { rimBis: 108 });
    const aus = p.tod && f >= 1;
    const details = P => {
      const ox = lunge, oy = hub + fall;
      const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y);
      // Falten: quer über die Breite jedes Lappens zwei bis drei Tonstufen als Dither-Verlauf (zwei Wellen)
      for (const [g, lp] of [[0, R], [1, L]]) {
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          if (gid[y * W + x] !== g) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          let best = 1e9, sb = 0; for (const a of lp.pts) { const dd = (a.x - x) ** 2 + (a.y - y) ** 2; if (dd < best) { best = dd; sb = ((x - a.x) * a.nx + (y - a.y) * a.ny) / a.w; } }
          const vv = c + 1.5 * Math.sin((sb + 1) * Math.PI * 1.4 + 0.4) - 0.3, k = Math.floor(vv), fr = vv - k;
          P.set(x, y, Math.max(1, Math.min(4, fr > bay(x - ox, y - oy) ? k + 1 : k)));
        }
      }
      // Kräftiges Randlicht (Gegenlicht oben rechts): äußerste Kante hell, eine Reihe dahinter mittel
      const kante = [];
      for (let y = 0; y < H - 6; y++) for (let x = 0; x < W; x++) {
        const c = P.get(x, y); if (!c || c >= 7) continue;
        if (leer(x, y - 1) || leer(x + 1, y)) kante.push([x, y, 'r2']);
        else if (leer(x, y - 2) || leer(x + 2, y) || leer(x + 1, y - 1)) kante.push([x, y, 'r1']);
      }
      kante.forEach(([x, y, c]) => P.set(x, y, c));
      const auge = (x, y, gr) => {
        x = r(x); y = r(y);
        for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const q2 = Math.hypot(i, j) / (gr + 3.5); if (q2 >= 1) continue; const c = P.get(x + i, y + j); if (c < 1 || c > 4) continue; if (0.9 * (1 - q2) * (1 - q2) > 0.45 + bay(x + i - ox, y + j - oy) * 0.4) P.set(x + i, y + j, 'glutDim'); }
        P.set(x, y, 'kern'); if (gr >= 2) { P.set(x + 1, y, 'glut'); P.set(x - 1, y, 'glut'); } if (gr >= 3) { P.set(x, y - 1, 'glut'); P.set(x, y + 1, 'glut'); }
      };
      // Zahnring: Lippe, dunkler Schlund, Zähne außen hell, Zähne innen mittel
      const ring = (mx, my, rad, k, offen) => {
        P.el(mx, my, rad + 2.4, rad * 1.1 + 2.4, 'k2', true); P.el(mx, my, rad + 1.3, rad * 1.1 + 1.3, 'k3', true); P.el(mx, my, rad, rad * 1.1, 'k0');
        const n = 14 + (k % 2) * 2;
        for (let a = 0; a < n; a++) { const w = a / n * Math.PI * 2 + k, cs = Math.cos(w), sn = Math.sin(w); P.set(mx + cs * (rad + 0.4), my + sn * (rad * 1.1 + 0.4), 'r2'); P.set(mx + cs * (rad - 0.8), my + sn * (rad * 1.1 - 0.8), a % 2 ? 'r2' : 'r1'); }
        for (let a = 0; a < 6; a++) { const w = a / 6 * Math.PI * 2 + 0.5 + k; P.set(mx + Math.cos(w) * (rad - 2.6), my + Math.sin(w) * (rad * 1.1 - 2.8), 'r1'); }
        if (offen) P.set(mx, my, 'glutDim');
      };
      // Zwei Zahnringe je Lappen an der Innenseite, groß
      const muender = [[L, 0.34], [L, 0.7], [R, 0.3], [R, 0.68]];
      muender.forEach(([lp, t], k) => {
        const a = lp.pts[Math.round(t * 18)];
        const rad = Math.max(4.5, Math.min(7, a.w * 0.5 + (p.idle ? 0 : mund * 0.5)));
        const mx = a.x - a.nx * a.w * 0.15, my = a.y - a.ny * a.w * 0.15;
        if (!aus) ring(mx, my, rad, k, mund >= 1 && (!p.idle || (k + f) % 2 === 0)); else P.el(mx, my, rad - 1, rad - 1, 'k0');
      });
      // Mitte: Mundorgan der Kappe als Brennpunkt, darüber die ungleichen Augen
      if (!aus) {
        ring(kx, ky + 6, 4 + (p.idle ? 0 : mund * 0.4), 1, mund >= 1);
        [[-9, -3, 2], [-3, -7, 1], [3, -7, aug === 2 ? 3 : 2], [9, -3, 1]].forEach(([dx, dy, gr]) => { const ex = kx + dx, ey = ky + dy; P.el(ex, ey, 3.2, 2.8, 'k0'); auge(ex, ey, gr); });
      } else P.el(kx, ky + 5, 4, 4, 'k0');
    };
    const al = [];
    if (!aus) [[-9, -3], [-3, -7], [3, -7], [9, -3]].forEach(([dx, dy]) => al.push([kx + dx, ky + dy]));
    return { gruppen, details, augen: al };
  },
};
