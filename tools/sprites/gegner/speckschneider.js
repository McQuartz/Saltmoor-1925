// Der Speckschneider (Walkathedrale). Er hat an Bord den Speck vom Wal geschält, mit dem Spaten an der
// langen Stange, in breiten Streifen. Im Wal schält er weiter, die Wände, den Boden, und was im Weg steht.
// Er schneidet durch jede Deckung. Ein gebückter Mann im Ölzeug, die Stange doppelt so lang wie er.
// Angriff: der Spaten zieht einen Streifen.
'use strict';
module.exports = {
  id: 'speckschneider', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [48, 115], kopf: [52, 36], rimBis: 112,
  varianten: { speckschneider_a: { lang: 1 }, speckschneider_b: { lang: 1.15 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let a = 0.5, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { a = [0.5, 0.49, 0.5, 0.51][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [0.3, 0.15, 1.1, 0.8][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 58 + lean, sy = 46 + fall;
    const leib = Pg([[cx - 14, sy + 6], [cx - 6, sy - 4], [cx + 10, sy - 4], [cx + 14, sy + 8], [cx + 16, 106], ...saum(cx + 16, cx - 14, 110, 5, 2, 3), [cx - 14, 106], [cx - 16, sy + 30]], null, { rd: 2 });
    const kx = cx - 6, ky = sy - 8;
    const kopf = E(kx, ky, 5.5, 6, null, { rd: 1.3 });
    const hut = Pg([[kx - 10, ky - 1], [kx - 6, ky - 8], [kx + 5, ky - 9], [kx + 9, ky - 3], [kx + 12, ky + 4], [kx + 4, ky]], null, { rd: 1.2 });
    const hx = cx - 14, hy = sy + 22;
    const L = 70 * v.lang, tx = hx - Math.sin(a) * L * 0.7, ty = hy + Math.cos(a) * L * 0.7 - 20, bx = hx + Math.sin(a) * L * 0.3, by = hy - Math.cos(a) * L * 0.3;
    const stange = C(bx, by, tx, Math.min(ty, 112), 1.3, 1.3, 'dunkel', { pf: 'flat' });
    const spaten = Pg([[tx - 4, Math.min(ty, 112) - 1], [tx + 4, Math.min(ty, 112) - 2], [tx + 3, Math.min(ty, 112) + 6], [tx - 3, Math.min(ty, 112) + 6]], 'dunkel', { rd: 0.4, pf: 'bevel' });
    const arme = [glied([[cx - 10, sy + 4], [cx - 16, sy + 14], [hx, hy]], 2.6, 2.2, null), glied([[cx + 8, sy + 4], [cx + 4, sy + 10], [bx + (hx - bx) * 0.5, by + (hy - by) * 0.5]], 2.6, 2.2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: [hut], k: 2 },
      { p: tot ? [] : [stange, spaten], k: 0, pf: 'bevel' },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Tranflecken, Speckstreifen über der Schulter
      P.line(r(cx + 2), r(sy - 2), r(cx + 12), r(sy + 30), 'mark');
      for (const [dx, dy] of [[-6, 40], [6, 56], [0, 74]]) P.set(r(cx + dx), r(sy + dy), 'tran');
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
