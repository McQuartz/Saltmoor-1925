// Die Walpredigerin (Walkathedrale, Elite). Die Frau des Schiffspredigers, die nach ihm in den Wal kam
// und seine Predigt übernommen hat. Sie steht auf einer Kanzel aus Wirbelknochen und predigt dem Herzen,
// und wer zuhört, dem wachsen die Wunden zu. Was sie vorhat, sieht man nicht hinter dem aufgeschlagenen
// Buch. Angriff: sie schlägt das Buch zu.
'use strict';
module.exports = {
  id: 'walpredigerin', biom: 'walkathedrale', zone: 'walkathedrale', w: 128, h: 160, fuss: [64, 155], kopf: [62, 30], rimBis: 152, rang: 'elite',
  varianten: { walpredigerin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let buch = 0, lean = 0, fall = 0, glanz = 1, arm = 0;
    if (p.idle) { arm = [0, 1, 2, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { buch = [0.3, 0.6, 1, 0.5][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66 + lean, sy = 42 + fall;
    // Kanzel aus Wirbeln: drei Knochenscheiben übereinander
    const wirbel = [0, 1, 2].map(i => E(64, 146 - i * 18, 30 - i * 2, 9, null, { pf: 'bevel', rd: 1.2 }));
    const fortsatz = [C(34, 140, 20, 130, 4, 2, null, { pf: 'bevel' }), C(94, 140, 108, 130, 4, 2, null, { pf: 'bevel' }), C(36, 104, 24, 96, 3, 1.6, null, { pf: 'bevel' }), C(92, 104, 104, 96, 3, 1.6, null, { pf: 'bevel' })];
    const talar = Pg([[cx - 10, sy], [cx + 10, sy - 1], [cx + 16, sy + 30], [cx + 20, sy + 66], ...saum(cx + 20, cx - 20, sy + 70, 5, 2, 3), [cx - 20, sy + 66], [cx - 16, sy + 30]], null, { rd: 2 });
    const kx = cx, ky = sy - 10;
    const kopf = E(kx, ky, 6.5, 7.5, null, { rd: 1.4 });
    const haube = Pg([[kx - 8, ky + 4], [kx - 7, ky - 7], [kx + 2, ky - 11], [kx + 9, ky - 5], [kx + 9, ky + 6]], null, { rd: 1.4, pf: 'flat', tone: 0.12 });
    // Buch vor der Brust, aufgeschlagen; beim Angriff klappt es zu
    const bx = cx - 6, by = sy + 24, o = 1 - buch;
    const buchL = Pg([[bx, by], [bx - 14 * o - 2, by - 4 * o], [bx - 14 * o - 2, by + 10], [bx, by + 12]], null, { rd: 0.6, pf: 'flat', tone: 0.2 });
    const buchR = Pg([[bx, by], [bx + 14 * o + 2, by - 4 * o], [bx + 14 * o + 2, by + 10], [bx, by + 12]], null, { rd: 0.6, pf: 'flat', tone: 0.15 });
    const arme = [glied([[cx - 9, sy + 4], [cx - 18, sy + 16], [bx - 10, by + 8]], 2.6, 2.2, null), glied([[cx + 9, sy + 4], [cx + 22, sy - 4 - arm], [cx + 26, sy - 18 - arm]], 2.6, 2.2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [talar], k: 3 },
      { p: [kopf], k: 2 },
      { p: [haube], k: 1, pf: 'flat' },
      { p: arme[1], k: 1 },
      { p: fortsatz, k: 1, pf: 'bevel' },
      { p: wirbel.reverse(), k: 2, pf: 'bevel' },
      { p: tot ? [] : [buchL, buchR], k: 1, pf: 'flat' },
      { p: arme[0], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Zeilen im Buch, Mark in den Wirbeln, Tran tropft
      if (!tot && buch < 0.8) for (let i = 0; i < 3; i++) { P.line(r(bx - 12 * (1 - buch)), r(by + 2 + i * 3), r(bx - 2), r(by + 2 + i * 3), 'k1'); P.line(r(bx + 2), r(by + 2 + i * 3), r(bx + 12 * (1 - buch)), r(by + 2 + i * 3), 'k1'); }
      for (let i = 0; i < 3; i++) P.set(64, 146 - i * 18, 'mark');
      P.set(r(cx + 26), r(sy - 20 - arm), 'tran');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
