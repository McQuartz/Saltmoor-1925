// Die Wasserschöpferin (Grotte der Gaben). Sie füllt an der Quelle die Flaschen für die Pilger ab, seit
// hundert Jahren, und trägt sie an einem Joch, so viele, dass sie klirren. Das Wasser darin heilt, nur
// nicht sie. Sie gibt es den anderen. Angriff: das Joch schwingt herum.
'use strict';
module.exports = {
  id: 'wasserschoepferin', biom: 'grotte', zone: 'grotte', w: 96, h: 120, fuss: [48, 115], kopf: [48, 26], rimBis: 112,
  varianten: { wasserschoepferin_a: { flaschen: 3, breit: 1 }, wasserschoepferin_b: { flaschen: 4, breit: 1.12 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let sw = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { sw = [0, 0.03, 0, -0.03][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { sw = [-0.15, -0.3, 0.35, 0.1][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 48 + lean, sy = 38 + fall, w = v.breit;
    const rock = Pg([[cx - 8 * w, sy], [cx + 8 * w, sy - 1], [cx + 12 * w, sy + 30], [cx + 16 * w, 108], ...saum(cx + 16 * w, cx - 16 * w, 112, 6, 2, 4), [cx - 16 * w, 108], [cx - 12 * w, sy + 30]], null, { rd: 2 });
    const kx = cx, ky = sy - 10;
    const kopf = E(kx, ky, 5.5, 6.5, null, { rd: 1.3 });
    const tuch = Pg([[kx - 7, ky - 1], [kx - 5, ky - 8], [kx + 5, ky - 8], [kx + 7, ky], [kx + 6, ky + 8], [kx - 6, ky + 8]], null, { rd: 1.4, pf: 'flat', tone: 0.1 });
    const L = 34, ca = Math.cos(sw), sa = Math.sin(sw);
    const j0 = [cx - ca * L, sy + 2 - sa * L], j1 = [cx + ca * L, sy + 2 + sa * L];
    const joch = C(j0[0], j0[1], j1[0], j1[1], 1.6, 1.6, 'dunkel', { pf: 'bevel' });
    const fl = [];
    for (const [ex, ey] of [j0, j1]) for (let i = 0; i < v.flaschen; i++) { const x = ex + (i - (v.flaschen - 1) / 2) * 5, y = ey + 10 + (i % 2) * 4; fl.push(Pg([[x - 2, y], [x + 2, y], [x + 2.4, y + 9], [x - 2.4, y + 9]], null, { rd: 1, pf: 'dome', tone: 0.12 })); }
    const arme = [glied([[cx - 7, sy + 4], [cx - 14, sy + 2], [cx - 20, sy + 2]], 2.2, 2, null), glied([[cx + 7, sy + 4], [cx + 14, sy + 2], [cx + 20, sy + 2]], 2.2, 2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [rock], k: 3 },
      { p: [kopf], k: 2 },
      { p: [tuch], k: 1, pf: 'flat' },
      { p: tot ? [] : [joch], k: 0, pf: 'bevel' },
      { p: tot ? [] : fl, k: 1, pf: 'dome' },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      if (!tot) for (const [ex, ey] of [j0, j1]) { P.line(r(ex), r(ey), r(ex - 6), r(ey + 10), 'k0'); P.line(r(ex), r(ey), r(ex + 6), r(ey + 10), 'k0'); for (let i = 0; i < v.flaschen; i++) P.set(r(ex + (i - (v.flaschen - 1) / 2) * 5), r(ey + 16 + (i % 2) * 4), 'wachs'); }
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
