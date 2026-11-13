// Der Siegelmönch (Kloster der Abschrift). Er versiegelt jede Abschrift, wenn sie fertig ist, mit Wachs
// und dem Klostersiegel. Der Siegelstempel ist ihm in die Faust gewachsen, so groß wie ein Hammer, und
// er siegelt alles, was offen ist. Was er schlägt, ist zu. Angriff: der Stempel fährt herunter.
'use strict';
module.exports = {
  id: 'siegelmoench', biom: 'kloster', zone: 'kloster', w: 96, h: 120, fuss: [48, 115], kopf: [46, 28], rimBis: 112,
  varianten: { siegelmoench_a: { stempel: 1, kapuze: 1 }, siegelmoench_b: { stempel: 1.3, kapuze: 1.15 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let hub = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { hub = [0, 1, 2, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { hub = [-6, -12, 16, 6][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52 + lean, sy = 40 + fall, k = v.kapuze;
    const kutte = Pg([[cx - 12, sy + 4], [cx - 4, sy - 4], [cx + 10, sy - 4], [cx + 15, sy + 6], [cx + 17, 108], ...saum(cx + 17, cx - 16, 112, 6, 2, 4), [cx - 16, 108], [cx - 15, sy + 30]], null, { rd: 2 });
    const kx = cx - 4, ky = sy - 6;
    const kapuze = Pg([[kx - 9 * k, ky + 6], [kx - 8 * k, ky - 6], [kx, ky - 11 * k], [kx + 9 * k, ky - 5], [kx + 10 * k, ky + 8]], null, { rd: 1.6 });
    const loch = E(kx - 2, ky + 1, 4.5, 5.5, 'dunkel', { pf: 'flat' });
    const hx = cx - 20, hy = sy + 26 + hub;
    const armV = glied([[cx - 10, sy + 4], [cx - 18, sy + 12 + hub * 0.4], [hx, hy]], 3, 2.6, null);
    const s = v.stempel;
    const stempel = [C(hx, hy, hx, hy + 8 * s, 2.6 * s, 2.2 * s, 'dunkel', { pf: 'bevel' }), Pg([[hx - 6 * s, hy + 8 * s], [hx + 6 * s, hy + 8 * s], [hx + 5 * s, hy + 12 * s], [hx - 5 * s, hy + 12 * s]], 'dunkel', { rd: 0.6, pf: 'bevel' })];
    const armH = glied([[cx + 12, sy + 4], [cx + 16, sy + 16], [cx + 10, sy + 26]], 3, 2.6, null);
    const gruppen = [
      { p: armH, k: 1 },
      { p: [kutte], k: 3 },
      { p: [kapuze], k: 2 },
      { p: [loch], k: 0, pf: 'flat', noRim: true },
      { p: armV, k: 1 },
      { p: stempel, k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Siegelwachstropfen in Rot, Strick, Tinte
      for (const [dx, dy] of [[-6, 50], [6, 64], [-2, 80], [8, 40]]) P.set(r(cx + dx), r(sy + dy), 'flamme');
      P.line(r(cx - 14), r(sy + 36), r(cx + 16), r(sy + 37), 'k0', true);
      P.set(r(hx), r(hy + 11 * v.stempel), 'flamme');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
