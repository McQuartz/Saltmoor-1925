// Leuchtturmhof, dritter Wächter: Die Schiffbrüchigen. Die Besatzung der „Margarethe“, die 1921 im
// Sturm auf die Klippe lief, weil das Feuer aus war. Sie sind auf ihrem Floß angetrieben und nicht
// abgestiegen: fünf Mann, ineinander verkeilt, die Arme umeinander, ein einziger Klumpen aus Ölzeug.
// Jeden Zug klammern sie sich fester. Angriff: alle Arme greifen zugleich.
'use strict';
module.exports = {
  id: 'schiffbruechige', biom: 'leuchtturm', zone: 'leuchtturm', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [72, 50], rimBis: 172,
  varianten: { schiffbruechige: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let griff = 0, X = 0, fall = 0, glanz = 1, wieg = 0;
    if (p.idle) { wieg = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { griff = [3, 8, 22, 10][f]; X = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 82 + X, base = 150 + fall * 0.3;
    const floss = Pg([[cx - 60, base + 6], [cx - 56, base - 4 + wieg], [cx + 58, base - 6 - wieg], [cx + 62, base + 4], [cx + 56, base + 16], [cx - 54, base + 18]], 'dunkel', { rd: 1.2, pf: 'bevel' });
    const mast = C(cx + 40, base - 4, cx + 46, 30 + fall, 2, 1.6, 'dunkel', { pf: 'flat' });
    const segel = Pg([[cx + 46, 34 + fall], [cx + 66, 58 + fall], [cx + 50, 88 + fall], [cx + 44, 70 + fall]], null, { rd: 1.6, pf: 'bevel', tone: 0.1 });
    // fünf Körper als ein Klumpen
    const leiber = [[-30, -40, 14, 30], [-8, -52, 16, 38], [16, -44, 15, 32], [-18, -20, 16, 20], [8, -18, 18, 18]].map(([dx, dy, rx, ry]) => E(cx + dx, base + dy + fall * 0.7, rx, ry, null, { rd: 2 }));
    const koepfe = [[-32, -76], [-8, -94], [16, -80], [-24, -46], [30, -56]].map(([dx, dy], i) => E(cx + dx + (i === 1 ? wieg * 0.5 : 0), base + dy + fall, 7, 7.5, null, { rd: 1.4 }));
    const huete = [[-32, -76], [-8, -94], [16, -80]].map(([dx, dy]) => Pg([[cx + dx - 9, base + dy - 2 + fall], [cx + dx - 4, base + dy - 10 + fall], [cx + dx + 6, base + dy - 10 + fall], [cx + dx + 12, base + dy + 2 + fall]], null, { rd: 1.2 }));
    const arme = [];
    for (let i = 0; i < 6; i++) {
      const a = -2.4 + i * 0.32, sx = cx - 20 + i * 6, sy0 = base - 54 + (i % 2) * 10 + fall * 0.7, L = 26 + (i % 3) * 6 + griff * (i < 3 ? 1 : 0.4);
      arme.push(glied([[sx, sy0], [sx + Math.cos(a) * L * 0.5 + (i % 2 ? 4 : -4), sy0 + Math.sin(a) * L * 0.5 + 6], [sx + Math.cos(a) * L, sy0 + Math.sin(a) * L + 14]], 3, 2.4, null));
    }
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [mast], k: 0, pf: 'flat' },
      { p: [segel], k: 1, pf: 'bevel' },
      { p: [floss], k: 1, pf: 'bevel' },
      { p: leiber, k: 3 },
      { p: tot ? [] : arme.flat(), k: 1 },
      { p: koepfe, k: 2 },
      { p: huete, k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Planken, Schiffsname, Ölzeugnähte
      for (let x = cx - 50; x < cx + 56; x += 9) P.line(r(x), r(base), r(x + 2), r(base + 14), 'k2', true);
      P.line(r(cx - 30), r(base + 10), r(cx - 12), r(base + 10), 'rot');
      if (glanz > 0) {
        [[-32, -76], [-8, -94], [16, -80], [-24, -46], [30, -56]].forEach(([dx, dy], i) => { const ex = r(cx + dx - 3), ey = r(base + dy + fall); P.set(ex, ey, i === 1 ? 'kern' : 'glut'); P.set(ex + 4, ey, 'glut'); if (i === 1) { P.glow(ex + 2, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3'); augen.push([ex, ey], [ex + 4, ey]); } });
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
