// Der Kartenzeichner (Funkstation am Pol). Er hat für die Expedition von 1912 die Karte des Eises
// gezeichnet, und jeden Tag war sie falsch, weil das Eis sich bewegte. Er zeichnet weiter, die Rolle wird
// länger und schleppt hinter ihm. Er hält dir die Karte hin, und bis du sie gelesen hast, ist alles teurer.
// Angriff: der Zirkel sticht.
'use strict';
module.exports = {
  id: 'kartenzeichner', biom: 'funkstation', zone: 'funkstation', w: 96, h: 120, fuss: [48, 115], kopf: [50, 28], rimBis: 112,
  varianten: { kartenzeichner_a: { rolle: 1 }, kartenzeichner_b: { rolle: 1.3 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let stich = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stich = [2, 4, 14, 5][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52 + lean, sy = 40 + fall;
    const mantel = Pg([[cx - 10, sy], [cx + 10, sy - 1], [cx + 14, sy + 30], [cx + 16, 106], ...saum(cx + 16, cx - 14, 110, 5, 2, 3), [cx - 14, 106], [cx - 12, sy + 30]], null, { rd: 2.2 });
    const kx = cx - 1, ky = sy - 9;
    const kopf = E(kx, ky, 6, 7, null, { rd: 1.3 });
    const muetze = Pg([[kx - 8, ky - 1], [kx - 6, ky - 9], [kx + 6, ky - 9], [kx + 8, ky - 1], [kx + 8, ky + 6], [kx - 8, ky + 6]], null, { rd: 1.6 });
    // Kartenrolle: von der hinteren Hand über den Boden nach hinten
    const rolle = Pg([[cx + 14, sy + 24], [cx + 20, sy + 22], [cx + 34 * v.rolle, 108], [cx + 42 * v.rolle, 112], [cx + 30, 112], [cx + 12, sy + 30]], null, { rd: 1.2, pf: 'flat', tone: 0.2 });
    const armH = glied([[cx + 8, sy + 4], [cx + 14, sy + 14], [cx + 16, sy + 24]], 2.4, 2, null);
    const hx = cx - 18 - stich, hy = sy + 18;
    const armV = glied([[cx - 8, sy + 4], [cx - 14, sy + 12], [hx, hy]], 2.4, 2, null);
    const zirkel = [C(hx, hy, hx - 8, hy + 8, 0.8, 0.6, 'dunkel', { pf: 'flat' }), C(hx, hy, hx - 2, hy + 10, 0.8, 0.6, 'dunkel', { pf: 'flat' })];
    const gruppen = [
      { p: [rolle], k: 1, pf: 'flat' },
      { p: armH, k: 1 },
      { p: [mantel], k: 3 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: armV, k: 1 },
      { p: zirkel, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Küstenlinien auf der Rolle, Kupferzirkel
      for (let i = 0; i < 4; i++) P.line(r(cx + 16 + i * 4), r(sy + 34 + i * 16), r(cx + 22 + i * 4), r(sy + 40 + i * 16), 'k1');
      P.set(r(hx), r(hy), 'kupfer');
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
