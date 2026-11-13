// Der Balgtreter (Glockengießerei). Er trat 1641 den großen Blasebalg, damit das Feuer heiß genug
// für die Bronze wurde, und er tritt ihn noch: der Balg ist ihm an die Brust gewachsen, ein
// Lederleib mit Falten, der sich hebt und senkt, wenn er atmet. Aus der Düse vorn fährt Glut. Mit
// jedem Atemzug bläst er den anderen Hitze in den Rücken. Angriff: er presst den Balg zusammen.
'use strict';
module.exports = {
  id: 'blasebalg', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 96, h: 120, fuss: [48, 115], kopf: [56, 22], rimBis: 112,
  varianten: {
    blasebalg_a: { balg: 1, kopf: 0 },
    blasebalg_b: { balg: 1.15, kopf: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, druck = 0, fall = 0, glanz = 1;
    if (p.idle) { druck = [0, 1, 2, 1][f]; glanz = [1, 1.05, 1.1, 1.05][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; druck = [-2, -3, 6, 3][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 32); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 54, ox = lean, sy = 34 + fall, bz = v.balg;
    // Balg: zwei Bretter, dazwischen Leder; die Düse zeigt nach vorn (links)
    const h = (20 - druck * 1.5) * bz;
    const brettO = Pg([[cx - 24 + ox, sy + 18 - h / 2], [cx + 14 + ox, sy + 10 - h / 2], [cx + 16 + ox, sy + 13 - h / 2], [cx - 24 + ox, sy + 21 - h / 2]], null, { rd: 0.6, pf: 'bevel' });
    const brettU = Pg([[cx - 24 + ox, sy + 30 + h / 2], [cx + 16 + ox, sy + 38 + h / 2], [cx + 14 + ox, sy + 41 + h / 2], [cx - 24 + ox, sy + 33 + h / 2]], null, { rd: 0.6, pf: 'bevel' });
    const leder = Pg([[cx - 22 + ox, sy + 20 - h / 2], [cx + 14 + ox, sy + 12 - h / 2], [cx + 18 + ox, sy + 24], [cx + 14 + ox, sy + 38 + h / 2], [cx - 22 + ox, sy + 32 + h / 2], [cx - 26 + ox, sy + 26]], null, { rd: 2, pf: 'dome' });
    const duese = C(cx - 26 + ox, sy + 26, cx - 38 + ox, sy + 28, 3, 1.6, null, { pf: 'bevel' });
    // Mann: dahinter, Kopf oben, Beine unten, ein Bein tritt
    const kx = cx + 2 + ox * 1.1, ky = sy - 2;
    const kopf = v.kopf ? Pg([[kx - 7, ky + 6], [kx - 6, ky - 6], [kx + 4, ky - 8], [kx + 8, ky], [kx + 6, ky + 8]], null, { rd: 1.5 }) : E(kx, ky, 6.5, 7.5, null);
    const hals = C(kx + 2, ky + 6, cx + 4 + ox, sy + 14 - h / 2, 3, 3, null);
    const beine = [...glied([[cx + 2, sy + 44 + h / 2], [cx - 2, 96], [cx - 4, 113]], 3.4, 2.6, null), ...glied([[cx + 12, sy + 44 + h / 2], [cx + 16, 92 - druck], [cx + 14, 106 - druck]], 3.4, 2.6, null)];
    const fuss2 = E(cx + 12, 107 - druck, 5, 2.5, 'dunkel');
    const arme = [...glied([[cx + 10 + ox, sy + 14 - h / 2], [cx + 20 + ox, sy + 18], [cx + 14 + ox, sy + 38 + h / 2]], 2.6, 2.2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 1 },
      { p: [fuss2], k: 0 },
      { p: [hals, kopf], k: 1.5 },
      { p: [leder], k: 2, pf: 'dome' },
      { p: [brettO, brettU], k: 0, pf: 'bevel' },
      { p: [duese], k: 0, pf: 'bevel' },
      { p: arme, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Falten im Leder
      for (let i = 1; i < 4; i++) { const y = r(sy + 26 + (i - 2) * h / 4); P.line(cx - 20 + ox, y, cx + 14 + ox, y + (i - 2), 'k1', true); }
      // Glut aus der Düse, beim Pressen weit
      if (!tot) { const n = druck > 3 ? 6 : 2; for (let k = 0; k < n; k++) P.set(r(cx - 40 + ox - k * 2), r(sy + 28 + (k % 2 ? -1 : 1)), k < 2 ? 'guss' : 'glutDim'); }
      P.auf(r(cx - 20 + ox), r(sy + 19 - h / 2), 'bronze'); P.auf(r(cx + 10 + ox), r(sy + 12 - h / 2), 'bronze');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'kern');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
