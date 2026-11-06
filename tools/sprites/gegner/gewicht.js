// Gezeitenwerk: Das Gewicht. Ein siebenkantiges Senklot aus Bronze, groß wie ein Ofen, die Spitze
// eine Handbreit über dem Boden. Es hängt an einer Kette, und die Kette hängt durch. In die Flächen
// sind Hände mit sieben Fingern gedrückt. Es tut nichts. Dann fällt es.
'use strict';
const LIB = require('../lib');
const TAU = Math.PI * 2;
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

module.exports = {
  id: 'gewicht', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 96, h: 120, fuss: [48, 116], kopf: [48, 30], rimBis: 114,
  varianten: {
    gewicht_a: { R: 21, hoch: 28, spitze: 102, rot: 0.32, durch: 1 },
    gewicht_b: { R: 18, hoch: 38, spitze: 106, rot: 0.08, durch: -1, baender: true },
  },
  // Silhouetten-Proben (nicht gebaut): ein Uhrgewicht als langer Zylinder las sich wie eine Säule und kam
  // dem Kreuzgangwächter zu nah; ein flacher Waagstein auf dem Boden hatte nichts, was fallen kann.
  proben: {
    probe_zylinder: { R: 13, hoch: 64, spitze: 0, rot: 0.2, durch: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 96, H = 120;
    let dy = 0, sw = 0, auge = 0, fall = 0, quetsch = 0;
    let dxBild = 0;
    if (p.idle) { dxBild = [0, 0, 1, 0][f]; }
    if (p.angriff) { dy = [-10, -24, 6, 2][f]; auge = [1, 2, 2, 1][f]; quetsch = [0, 0, 2, 0][f]; }
    if (p.treffer) { dy = [-2, -1][f]; sw = [1, 0][f]; }
    if (p.tod) { fall = r(Math.min(1, p.q * 1.6) * 10); }
    const cx = 48 + sw, R = v.R, spitze = v.spitze || 0;
    const yTop = (spitze ? spitze - v.hoch - R * 1.5 : 112 - v.hoch) + dy + fall;
    const yBot = yTop + v.hoch - quetsch;
    const tipY = spitze ? Math.min(114, spitze + dy + fall - quetsch) : yBot;
    // Siebeneck in Aufsicht, schräg gesehen: x = X, y = Z * 0.32
    const ecken = Array.from({ length: 7 }, (_, i) => { const a = v.rot + i / 7 * TAU; return [Math.cos(a) * R, Math.sin(a) * R]; });
    const proj = ([X, Z], y) => [cx + X, y + Z * 0.32];
    const deckel = Pg(ecken.map(e => proj(e, yTop)), null, { rd: 0.5 });
    const flaechen = [], kegel = [];
    for (let i = 0; i < 7; i++) {
      const a = ecken[i], b = ecken[(i + 1) % 7];
      const nz = (a[1] + b[1]) / 2; if (nz < -2) continue; // nur Flächen, die zu uns zeigen
      const nx = (a[0] + b[0]) / 2;
      flaechen.push({ p: [Pg([proj(a, yTop), proj(b, yTop), proj(b, yBot), proj(a, yBot)], null, { rd: 0.3 })], k: 0, kante: true, tone: nx > 0 ? 0.08 : -0.06, mitte: [cx + nx, (yTop + yBot) / 2 + nz * 0.32], nz });
      if (spitze) kegel.push({ p: [Pg([proj(a, yBot), proj(b, yBot), [cx, tipY]], null, { rd: 0.3 })], k: 0, kante: true, tone: nx > 0 ? 0 : -0.15 });
    }
    flaechen.sort((x, y) => x.nz - y.nz); kegel.reverse();
    // Öse oben und die Kette: sie hängt durch, als trüge sie nichts
    const oeseY = yTop - 4;
    const oese = [E(cx, oeseY, 4.5, 4.5, null, { pf: 'bevel' })];
    const glieder = [];
    const k0 = [cx, oeseY - 4], k3 = [cx + 2 * v.durch, -4];
    for (let i = 0; i < 26; i++) {
      const t = i / 25, bx = k0[0] + (k3[0] - k0[0]) * t + Math.sin(t * Math.PI) * 22 * v.durch + Math.sin(t * Math.PI * 2) * 4 * v.durch, by = k0[1] + (k3[1] - k0[1]) * t + Math.sin(t * Math.PI) * 6;
      if (by < -3) continue;
      glieder.push(i % 2 ? C(bx, by - 1.2, bx, by + 1.2, 1.1, 1.1, null) : E(bx, by, 2.2, 1.8, null, { pf: 'flat' }));
    }
    const baender = v.baender ? [Pg([proj(ecken[0], yTop + 8).map((q, j) => q + (j ? 0 : -2)), [cx + R + 1, yTop + 8], [cx + R + 1, yTop + 11], [cx - R - 1, yTop + 11], [cx - R - 1, yTop + 8]], 'dunkel', { rd: 0.2 })] : [];
    const gruppen = [
      { p: glieder, k: 0 },
      { p: oese, k: 0, kante: true },
      ...kegel,
      ...flaechen.map(x => ({ p: x.p, k: 0, kante: true, tone: x.tone })),
      { p: [deckel], k: 0, kante: true, tone: 0.15 },
      { p: baender, k: 0, noRim: true },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('gezeitenwerk'));
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kante der Fase am Deckel: eine Linie Licht entlang der vorderen Deckelkante
      for (let i = 0; i < 7; i++) { const a = ecken[i], b = ecken[(i + 1) % 7]; if ((a[1] + b[1]) / 2 < 0) continue; const [x0, y0] = proj(a, yTop), [x1, y1] = proj(b, yTop); P.line(x0, y0 + 1, x1, y1 + 1, 'k3', true); }
      // Handabdrücke: eine Hand mit sieben Fingern in die mittlere Fläche gedrückt, die Finger nach oben
      const mi = flaechen.reduce((m, x) => (Math.abs(x.mitte[0] - cx) < Math.abs(m.mitte[0] - cx) ? x : m), flaechen[0]);
      const hx = r(mi.mitte[0]) - 1, hy = r(mi.mitte[1]) + 3;
      for (let yy = -3; yy <= 3; yy++) for (let xx = -6; xx <= 6; xx++) if (xx * xx / 40 + yy * yy / 10 <= 1) P.auf(hx + xx, hy + 2 + yy, 'k0');
      for (let i = 0; i < 7; i++) { const fx = hx - 6 + i * 2, l = [4, 6, 7, 8, 7, 6, 4][i]; for (let k = 1; k <= l; k++) P.auf(fx, hy - k, (k === l) ? 'k1' : 'k0'); P.auf(fx + 1, hy - 1, 'k2'); }
      // die Kuppen leuchten schwach: dort ist das Phosphoröl hängen geblieben
      if (!p.tod || f < 1) { for (let i = 0; i < 7; i++) { const l = [4, 6, 7, 8, 7, 6, 4][i]; P.set(hx - 6 + i * 2, hy - l, i % 2 ? 'k3' : 'glutDim'); } }
      // zweiter, halber Abdruck auf einer Seitenfläche
      const se = flaechen.find(x => x !== mi && x.mitte[0] > cx);
      if (se) { const sx = r(se.mitte[0]), sy = r(se.mitte[1]) - 4; for (let i = 0; i < 4; i++) P.auf(sx - 1 + i, sy - [3, 4, 4, 3][i], 'k0'); P.auf(sx, sy, 'k0'); P.auf(sx + 1, sy, 'k0'); }
      // Auge: ein waagerechter Spalt im Deckel, der sich bei der Ansage öffnet
      if (!p.tod || f < 1) {
        const ex = cx - 1, ey = r(yTop + 1);
        P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 1, ey, 'glut');
        if (auge >= 1) { P.set(ex - 2, ey, 'glut'); P.set(ex + 2, ey, 'glut'); P.set(ex, ey - 1, 'glutDim'); P.set(ex, ey + 1, 'glutDim'); }
        if (auge >= 2) { P.set(ex - 3, ey, 'glutDim'); P.set(ex + 3, ey, 'glutDim'); }
        augen.push([ex, ey]);
      }
      // blanke Spitze (Bronze), wo sie den Boden schon einmal berührt hat
      if (spitze && (!p.tod || f < 2)) { P.auf(cx, tipY - 1, 'bronze'); P.auf(cx, tipY - 2, 'k3'); }
      // Aufschlag: Staub springt seitlich weg
      if (p.angriff && f === 2) for (let i = 1; i < 6; i++) { P.set(cx - 8 - i * 3, 114 - (i % 2), 'r1'); P.set(cx + 8 + i * 3, 114 - ((i + 1) % 2), 'r1'); }
    };
    return { gruppen, details, augen, dx: dxBild };
  },
};
