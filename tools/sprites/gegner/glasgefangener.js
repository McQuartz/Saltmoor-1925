// Der Gefangene im Glas (Glasmeer, Elite). Ein Mann der Expedition, der durch das Glas gebrochen ist,
// als es noch weich war, und darin erstarrt. Er steckt aufrecht in einem Block aus grünem Glas und
// schiebt ihn vor sich her. Nichts bleibt an ihm haften, das Glas ist glatt, und in seiner Nähe ist
// jede Bewegung zäh. Angriff: er wirft sich mit dem Block nach vorn.
'use strict';
module.exports = {
  id: 'glasgefangener', biom: 'glasmeer', zone: 'glasmeer', w: 128, h: 160, fuss: [64, 155], kopf: [64, 44], rimBis: 152, rang: 'elite',
  varianten: { glasgefangener: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { lean = [2, 4, -12, -4][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64 + lean, top = 26 + fall;
    const block = Pg([[cx - 34, top + 10], [cx - 26, top], [cx + 28, top - 2], [cx + 36, top + 8], [cx + 38, 148], [cx + 30, 154], [cx - 30, 154], [cx - 36, 146]], null, { rd: 1.4, pf: 'bevel', tone: 0.2 });
    // der Mann darin, dunkler, mit erhobenen Händen gegen das Glas
    const mann = Pg([[cx - 10, top + 30], [cx + 10, top + 30], [cx + 14, top + 80], [cx + 10, 140], [cx - 10, 140], [cx - 14, top + 80]], 'dunkel', { rd: 2, pf: 'flat' });
    const mkopf = E(cx, top + 20 + atem * 0.5, 7, 8, 'dunkel', { pf: 'flat' });
    const haende = [glied([[cx - 10, top + 34], [cx - 20, top + 24], [cx - 22, top + 12]], 2.4, 2, 'dunkel', { pf: 'flat' }), glied([[cx + 10, top + 34], [cx + 20, top + 24], [cx + 22, top + 12]], 2.4, 2, 'dunkel', { pf: 'flat' })];
    const beine = [C(cx - 16, 150, cx - 18, 156, 4, 4, 'dunkel'), C(cx + 16, 150, cx + 18, 156, 4, 4, 'dunkel')];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 0 },
      { p: [block], k: 2, pf: 'bevel' },
      { p: tot ? [] : [mann, mkopf], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : haende.flat(), k: 0, pf: 'flat', noRim: true },
    ];
    const augen = [];
    const details = P => {
      // Spiegelungen und Bruchkanten im Glas, Nordlicht innen
      P.line(r(cx - 28), r(top + 14), r(cx - 16), r(top + 6), 'r1');
      P.line(r(cx + 24), r(top + 30), r(cx + 30), r(top + 90), 'r1');
      for (let y = top + 50; y < 140; y += 14) P.set(r(cx - 24 + (y % 9)), y, 'nordlicht');
      for (const [x, y] of [[-22, 12], [22, 12]]) P.set(r(cx + x), r(top + y), 'violett');
      if (glanz > 0 && !tot) {
        const ex = r(cx - 3), ey = r(top + 20 + atem * 0.5);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
