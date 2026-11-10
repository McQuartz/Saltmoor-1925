// Kloster der Abschrift, dritter Wächter: Die Bücherwand. Das Regal der Bibliothek, in dem jede Abschrift
// steht, die je gemacht wurde, und jede steht doppelt. Es hat sich von der Wand gelöst und geht auf
// geschnitzten Löwenfüßen; aus den Fächern greifen Arme aus gebundenem Papier. Was du tust, steht schon
// in einem seiner Bücher, und es liest es dir vor. Angriff: die Bücher fallen auf dich.
'use strict';
module.exports = {
  id: 'buecherwand', biom: 'kloster', zone: 'kloster', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 30], rimBis: 172,
  varianten: { buecherwand: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let kipp = 0, X = 0, fall = 0, glanz = 1, blatt = 0;
    if (p.idle) { blatt = f % 2; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { kipp = [2, 4, -10, -3][f]; X = [1, 2, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 80 + X, top = 18 + fall, k = kipp;
    const regal = Pg([[cx - 44 + k, top + 6], [cx - 38 + k, top - 4], [cx + 38 + k, top - 4], [cx + 44 + k, top + 6], [cx + 42, 156], [cx - 42, 156]], null, { rd: 1.2 });
    const krone = Pg([[cx - 30 + k, top - 4], [cx - 10 + k, top - 14], [cx + k, top - 20], [cx + 10 + k, top - 14], [cx + 30 + k, top - 4]], null, { rd: 1.2, pf: 'bevel' });
    const fuesse = [cx - 34, cx + 34].map(x => Pg([[x - 6, 154], [x + 6, 154], [x + 8, 168], [x + 4, 174], [x - 6, 174], [x - 8, 166]], 'dunkel', { rd: 1.6 }));
    // Fächer: vier Reihen, Bücher als Rechtecke
    const buecher = [];
    for (let row = 0; row < 4; row++) {
      const y0 = top + 12 + row * 34, y1 = y0 + 28;
      let x = cx - 36 + k * (1 - row / 4);
      for (let i = 0; i < 9; i++) { const w = 6 + ((i * 7 + row * 3) % 4), h = 20 + ((i * 5 + row) % 8); if (!(row === 1 && i >= 3 && i <= 5)) buecher.push(Pg([[x, y1], [x, y1 - h], [x + w, y1 - h], [x + w, y1]], null, { rd: 0.4, pf: 'flat' })); x += w + 1; if (x > cx + 34) break; }
    }
    // Lücke in Reihe 2: darin das Gesicht
    const loch = Pg([[cx - 14 + k * 0.75, top + 48], [cx + 14 + k * 0.75, top + 48], [cx + 14 + k * 0.75, top + 74], [cx - 14 + k * 0.75, top + 74]], 'dunkel', { rd: 0.6, pf: 'flat' });
    // Papierarme aus den Seiten
    const ga = k < 0 ? -k * 2 : 0;
    const arme = [glied([[cx - 42, top + 60], [cx - 58 - ga, top + 76], [cx - 56 - ga * 1.4, top + 100]], 3.4, 2.6, null), glied([[cx + 42, top + 60], [cx + 56, top + 80], [cx + 52, top + 104]], 3.4, 2.6, null)];
    const fallend = [];
    if (p.angriff && f >= 2) for (let i = 0; i < 4; i++) fallend.push(Pg([[cx - 40 - i * 8, top + 100 + i * 10], [cx - 32 - i * 8, top + 96 + i * 10], [cx - 30 - i * 8, top + 106 + i * 10], [cx - 38 - i * 8, top + 110 + i * 10]], null, { rd: 0.4, pf: 'bevel' }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: fuesse, k: 0 },
      { p: arme.flat(), k: 1 },
      { p: [regal], k: 3 },
      { p: [krone], k: 2, pf: 'bevel' },
      { p: buecher, k: 1, pf: 'flat' },
      { p: [loch], k: 0, pf: 'flat', noRim: true },
      { p: fallend, k: 1, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Fachböden, Tinte an den Rücken, ein Buch im Loch, das blättert
      for (let row = 0; row <= 4; row++) P.line(r(cx - 40 + k * (1 - row / 4)), r(top + 40 + row * 34 - 28 + 28), r(cx + 40 + k * (1 - row / 4)), r(top + 40 + row * 34), 'k0', true);
      for (let i = 0; i < 12; i++) P.set(r(cx - 34 + i * 6 + k * 0.5), r(top + 30 + (i % 4) * 34), 'tinte');
      if (!tot) P.line(r(cx - 8 + k * 0.75), r(top + 70 - blatt), r(cx + 8 + k * 0.75), r(top + 70 + blatt), 'r1');
      if (glanz > 0) {
        const ex = r(cx - 6 + k * 0.75), ey = r(top + 58);
        P.set(ex, ey, 'kern'); P.set(ex + 10, ey, 'glut');
        P.glow(ex + 5, ey, 8 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 10, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
