// Der Moorkönig (Moor, Elite). Eine Moorleiche, die man 1898 gefunden und wieder versenkt hat,
// weil sie eine Krone trug, die niemand anfassen wollte. Er steht bis zur Hüfte im Torf und ruft
// die Gepfählten zu sich; um ihn herum stehen die Pflöcke wie ein Hofstaat.
// Lederhaut, ein Strick um den Hals, die Krone aus Wurzeln. Angriff: er greift aus dem Moor.
'use strict';
module.exports = {
  id: 'moorkoenig', biom: 'moor', zone: 'moor', w: 128, h: 160, fuss: [64, 155], kopf: [60, 46], rimBis: 152, rang: 'elite',
  varianten: { moorkoenig: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let griff = 0, lean = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { griff = [4, 8, 22, 10][f]; lean = [2, 4, -8, -3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, sy = 64 + fall;
    // Torf: flacher Hügel unten, aus dem er wächst
    const torf = Pg([[8, 156], [18, 136], [44, 128], [86, 126], [114, 136], [122, 156]], 'dunkel', { rd: 3 });
    const leib = Pg([[cx - 18 + ox, sy + 4], [cx - 8 + ox, sy - 6], [cx + 10 + ox, sy - 6], [cx + 20 + ox, sy + 4], [cx + 18, sy + 40], [cx + 16, 134], [cx - 16, 134], [cx - 18, sy + 40]], null, { rd: 2 });
    const kx = cx - 2 + ox * 1.2, ky = sy - 12 + atem;
    const kopf = Pg([[kx - 8, ky - 4], [kx - 4, ky - 10], [kx + 6, ky - 10], [kx + 9, ky - 2], [kx + 6, ky + 8], [kx - 2, ky + 10], [kx - 8, ky + 5]], null, { rd: 2 });
    const krone = [];
    for (let i = 0; i < 5; i++) { const x = kx - 8 + i * 4, h = [7, 11, 13, 10, 7][i]; krone.push(C(x, ky - 9, x + (i - 2) * 1.5, ky - 9 - h, 1.3, 0.7, null, { pf: 'flat' })); }
    const strick = C(kx - 9, ky + 12, kx + 10, ky + 11, 1.6, 1.6, 'dunkel', { pf: 'flat' });
    // vorderer Arm greift nach vorn
    const hx = cx - 26 + ox - griff, hy = sy + 22 - griff * 0.3;
    const armV = glied([[cx - 14 + ox, sy + 2], [cx - 22 + ox - griff * 0.4, sy + 14], [hx, hy]], 3.6, 2.8, null);
    const finger = [0, 1, 2, 3].map(i => C(hx, hy, hx - 7, hy - 4 + i * 3, 1, 0.7, null, { pf: 'flat' }));
    const armH = glied([[cx + 16 + ox, sy + 2], [cx + 24 + ox, sy + 18], [cx + 30, sy + 30]], 3.4, 2.6, null);
    // Pflöcke als Hofstaat
    const pfl = [[16, 132, 26], [104, 134, 34], [114, 140, 20], [28, 138, 18]].map(([x, y, h], i) => Pg([[x - 2.5, y], [x - 2, y - h], [x, y - h - 4], [x + 2, y - h], [x + 2.5, y]], 'dunkel', { rd: 0.6 }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: pfl.slice(1, 3), k: 0, pf: 'flat' },
      { p: armH, k: 1 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: tot ? [] : krone, k: 1, pf: 'flat' },
      { p: [strick], k: 0, pf: 'flat', noRim: true },
      { p: armV, k: 1 },
      { p: finger, k: 0, pf: 'flat' },
      { p: [torf], k: 2 },
      { p: [pfl[0], pfl[3]], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Lederhaut: Falten, Rippen
      for (let i = 0; i < 4; i++) P.line(r(cx - 10 + ox), r(sy + 6 + i * 6), r(cx + 8 + ox), r(sy + 7 + i * 6), 'k3', true);
      // Moorlichter an den Pflöcken
      if (glanz > 0) {
        for (const [x, y] of [[16, 104], [104, 96]]) { P.set(x, y, 'glut'); P.glow(x, y, 4 * glanz, 0.5 * glanz, 'glutDim', 'k3'); }
        const ex = r(kx - 4), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
