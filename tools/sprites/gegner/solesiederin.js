// Die Solesiederin (Salzstollen). Sie hat in der Siedehütte die Sole gekocht, bis das Salz ausfiel, und
// sich dabei über die Pfanne gebeugt, Jahr um Jahr. Das Salz ist an ihr ausgefallen: Kristalle stehen ihr
// aus Rücken und Armen wie Dornen. Sie rührt mit der Krücke in einer Pfanne, die sie vor sich herträgt.
// Angriff: sie stößt mit der Rührkrücke zu.
'use strict';
module.exports = {
  id: 'solesiederin', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [48, 115], kopf: [36, 44], rimBis: 112,
  varianten: { solesiederin_a: { dornen: 5 }, solesiederin_b: { dornen: 8 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let ruehr = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { ruehr = [0, 1, 2, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { ruehr = [0, -4, 12, 4][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); glanz = f < 2 ? 0.6 : 0; }
    const cx = 54 + lean, sy = 50 + fall;
    const leib = Pg([[cx - 20, sy + 4], [cx - 10, sy - 8], [cx + 8, sy - 10], [cx + 18, sy], [cx + 16, sy + 24], [cx + 18, 106], ...saum(cx + 18, cx - 14, 110, 5, 2, 3), [cx - 14, 106], [cx - 12, sy + 26]], null, { rd: 2 });
    const kx = cx - 18, ky = sy - 4;
    const kopf = E(kx, ky, 5.5, 6, null, { rd: 1.3 });
    const pfanne = Pg([[cx - 34, sy + 30], [cx - 6, sy + 30], [cx - 8, sy + 36], [cx - 32, sy + 36]], 'dunkel', { rd: 1.6, pf: 'bevel' });
    const hx = cx - 20 - ruehr, hy = sy + 24;
    const krucke = [C(hx + 6, hy - 14, hx - 2, sy + 34, 1.2, 1.2, 'dunkel', { pf: 'flat' }), C(hx - 6, sy + 34, hx + 2, sy + 34, 1.2, 1.2, 'dunkel', { pf: 'flat' })];
    const arme = [glied([[cx - 14, sy + 2], [cx - 20, sy + 12], [hx + 4, hy - 10]], 2.4, 2, null), glied([[cx + 2, sy + 2], [cx - 12, sy + 20], [cx - 26, sy + 30]], 2.4, 2, null)];
    const dornen = [];
    for (let i = 0; i < v.dornen; i++) { const t = i / (v.dornen - 1), x = cx - 8 + t * 24, y = sy - 8 + Math.abs(t - 0.4) * 10; dornen.push(Pg([[x - 2, y + 2], [x + 1 + (i % 2), y - 8 - (i % 3) * 2], [x + 3, y + 2]], null, { rd: 0.4, pf: 'bevel', tone: 0.15 })); }
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: dornen, k: 2, pf: 'bevel' },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: tot ? [] : [pfanne], k: 0, pf: 'bevel' },
      { p: tot ? [] : krucke, k: 0, pf: 'flat' },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      for (let y = sy; y < 104; y += 5) for (let x = cx - 10; x < cx + 16; x += 5) if (((x * 3 + y * 7) % 6) === 0) P.auf(r(x), r(y), 'r1');
      if (!tot) for (let x = cx - 30; x < cx - 8; x += 4) P.set(r(x), r(sy + 29), 'r2');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
