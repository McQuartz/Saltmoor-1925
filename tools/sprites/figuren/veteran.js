// Der Kriegsveteran. Brodie-Helm mit flachem Teller, Gasmaske an Schlauch und Riemen um den Hals,
// langer Offiziersmantel mit Schulterklappen, steife Haltung, das rechte Bein nachgezogen, der Schürhaken in der rechten Hand.
'use strict';
module.exports = {
  id: 'veteran', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [56, 62], leib: [58, 94], hand: [26, 108] },
  bild(p, v, A) {
    const { E, C, Pg } = A;
    const cx = 56;
    const kopf = E(cx, 46, 11, 13, null, { pf: 'bevel' });
    // Brodie: flacher runder Teller, Krempe rundum gleich breit, kleine Kuppel in der Mitte
    const teller = E(cx, 39, 22, 3.5, null, { pf: 'flat' });
    const kuppel = E(cx, 36, 15, 9, null, { pf: 'bevel' });
    const hals = C(cx, 52, cx, 62, 6, 8, null);
    const mantel = Pg([[cx - 14, 60], [cx + 14, 60], [cx + 27, 65], [cx + 28, 72], [cx + 24, 96], [cx + 22, 100], [cx + 30, 142], [cx + 4, 147], [cx - 4, 145], [cx - 31, 146], [cx - 22, 100], [cx - 24, 96], [cx - 28, 72], [cx - 27, 65]], null, { rd: 2 });
    // Schulterklappen als kleine Absätze über der Schulterlinie
    const klappeL = Pg([[cx - 31, 66], [cx - 18, 59], [cx - 16, 62], [cx - 30, 70]], null, { rd: 0.5 });
    const klappeR = Pg([[cx + 16, 62], [cx + 18, 59], [cx + 31, 66], [cx + 30, 70]], null, { rd: 0.5 });
    // Gasmaske: Schlauch von der Brust, Filterdose steht rechts leicht aus dem Mantel heraus
    const dose = E(cx + 32, 82, 5.5, 9, null, { pf: 'bevel' });
    const ruessel = C(cx + 22, 70, cx + 31, 76, 2.5, 3, null);
    const armL = A.glied([[cx - 28, 70], [cx - 31, 90], [cx - 32, 106]], 5.5, 4.5, null);
    const armR = A.glied([[cx + 27, 70], [cx + 28, 94], [cx + 26, 114]], 5.5, 4.5, null);
    const beinL = C(cx - 11, 140, cx - 11, 160, 5.5, 5.5, null);
    const beinR = C(cx + 11, 140, cx + 17, 160, 5.5, 5.5, null);
    const stiefelL = Pg([[cx - 19, 156], [cx - 4, 156], [cx - 4, 168], [cx - 21, 168]], null, { rd: 0.5 });
    const stiefelR = Pg([[cx + 10, 156], [cx + 24, 156], [cx + 29, 164], [cx + 27, 168], [cx + 10, 168]], null, { rd: 0.5 });
    const gruppen = [
      { p: [beinL, stiefelL], k: 1, tone: -0.15 },
      { p: [beinR, stiefelR], k: 1, tone: -0.1 },
      { p: [mantel, hals, klappeL, klappeR], k: 3, pf: 'bevel', tone: -0.05 },
      { p: [armR, dose, ruessel], k: 1, tone: -0.05 },
      { p: [kopf], k: 2 },
      { p: [teller, kuppel], k: 0, pf: 'bevel' },
      { p: armL, k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Schürhaken, 2 px stark, oben klar gebogener Haken nach links
      for (let y = 32; y < 152; y++) { P.set(24, y, 'k2'); P.set(25, y, 'r1'); }
      for (const [x, y] of [[24, 31], [23, 30], [22, 30], [21, 31], [20, 32], [20, 33], [20, 34], [21, 35], [22, 35]]) { P.set(x, y, 'k2'); P.set(x + 1, y, 'k2'); }
      P.set(23, 29, 'r1'); P.set(24, 29, 'r1'); P.set(19, 33, 'r1'); P.set(25, 31, 'r1');
      P.el(24, 108, 4, 3.5, 'k2');
      // Gurtzeug der Gasmaske: Riemen über die Brust zur Dose
      P.line(cx - 8, 61, cx + 24, 76, 'k0', true); P.line(cx + 8, 61, cx + 25, 72, 'k1', true);
      P.set(cx + 37, 80, 'r1'); P.set(cx + 37, 84, 'r1');
      // Augen unter dem Helmrand
      P.set(cx - 5, 46, 'kern'); P.set(cx + 3, 46, 'kern'); P.set(cx - 4, 46, 'glut'); P.set(cx + 4, 46, 'glut');
      augen.push([cx - 5, 46], [cx + 3, 46]);
      // Knopfleiste und Gürtel
      P.line(cx + 1, 66, cx + 1, 140, 'k0', true);
      P.line(cx - 23, 98, cx + 23, 98, 'k0', true);
      // Salzbeutel am Gürtel
      P.el(cx - 12, 106, 3, 4, 'k1', true);
      P.line(cx + 22, 100, cx + 31, 103, 'k1', true); P.set(cx + 33, 100, 'r1');
    };
    return { gruppen, details, augen };
  },
};
