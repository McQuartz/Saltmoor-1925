// Nachtzug, dritter Wächter: Die Schlafwagendame. Sie hat 1911 Abteil 7 gebucht, bis zur Endstation,
// und ist nicht aufgewacht. Sie geht jetzt mit ihrem Bett durch den Zug: Die Koje steht aufrecht auf
// vier Füßen, der Vorhang halb offen, und sie liegt darin, die Schlafmaske über den Augen. Wer ihr
// zu nahe kommt, schläft ein, die Hand wird schwer. Angriff: der Vorhang schlägt zu.
'use strict';
module.exports = {
  id: 'schlafwagendame', biom: 'nachtzug', zone: 'nachtzug', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [76, 50], rimBis: 172,
  varianten: { schlafwagendame: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let vh = 0, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { vh = [4, 10, 26, 12][f]; X = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 84 + X, top = 22 + fall;
    const koje = Pg([[cx - 34, top + 6], [cx - 30, top - 2], [cx + 30, top - 4], [cx + 36, top + 4], [cx + 36, 160], [cx - 34, 160]], null, { rd: 1.6 });
    const innen = Pg([[cx - 26, top + 10], [cx + 26, top + 8], [cx + 26, 150], [cx - 26, 152]], 'dunkel', { rd: 1, pf: 'flat' });
    const fuesse = [[-30, -1], [-14, 0], [14, 0], [30, 1]].map(([dx, s]) => glied([[cx + dx, 158], [cx + dx + s * 3, 166], [cx + dx + s * 5, 172]], 2.4, 2, 'dunkel'));
    // Sie liegt darin, aufrecht: Kopf auf dem Kissen oben, Decke bis zur Brust
    const kissen = E(cx + 2, top + 26, 20, 8, null, { pf: 'dome', tone: 0.15 });
    const kx = cx + 2, ky = top + 40 + atem * 0.5;
    const kopf = E(kx, ky, 9, 10, null, { rd: 1.4 });
    const maske = Pg([[kx - 10, ky - 4], [kx + 10, ky - 4], [kx + 9, ky + 2], [kx - 9, ky + 2]], 'dunkel', { rd: 1, pf: 'flat' });
    const decke = Pg([[cx - 24, top + 58 + atem], [cx + 24, top + 56 + atem], [cx + 24, 148], [cx - 24, 148]], null, { rd: 2, pf: 'bevel', tone: 0.12 });
    const hand = E(cx - 12, top + 62 + atem, 4, 3.4, 'haut');
    // Vorhang: von links, zieht beim Angriff zu
    const vw = 18 + vh;
    const vorhang = Pg([[cx - 34, top + 2], [cx - 34 + vw, top + 2], [cx - 30 + vw, top + 60], ...saum(cx - 34 + vw, cx - 34, 158, 5, 3, 4), [cx - 34, 158]], null, { rd: 1.4, pf: 'bevel', tone: 0.1 });
    const stange = C(cx - 36, top + 2, cx + 36, top, 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: fuesse.flat(), k: 1 },
      { p: [koje], k: 3 },
      { p: [innen], k: 0, pf: 'flat', noRim: true },
      { p: [kissen], k: 1, pf: 'dome' },
      { p: [kopf], k: 2 },
      { p: [maske], k: 0, pf: 'flat', noRim: true },
      { p: [decke], k: 2, pf: 'bevel' },
      { p: [hand], k: 0 },
      { p: tot ? [] : [vorhang], k: 1.5, pf: 'bevel' },
      { p: [stange], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Messingnummer, Ringe am Vorhang, Falten
      P.set(r(cx + 28), r(top + 4), 'messing'); P.set(r(cx + 29), r(top + 4), 'messing');
      for (let x = cx - 32; x < cx - 34 + vw; x += 4) P.set(r(x), r(top + 2), 'messing');
      for (let x = cx - 30; x < cx - 34 + vw; x += 5) P.line(r(x), r(top + 8), r(x + 1), 150, 'k1', true);
      for (let y = top + 66; y < 146; y += 10) P.line(r(cx - 22), y, r(cx + 22), y + 1, 'k3', true);
      if (glanz > 0) {
        // die Augen glühen durch die Maske
        const ex = r(kx - 5), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 9, ey, 'glut'); P.set(ex + 1, ey, 'glutDim'); P.set(ex + 8, ey, 'glutDim');
        P.glow(ex + 4.5, ey, 8 * glanz, 0.7 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 9, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
