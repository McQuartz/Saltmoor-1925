// Die Wahrsagerin. Trauerschleier über Kopf und Schultern bis zur Hüfte, weiter Glockenrock bis zum Boden,
// große Ohrringe, die Fackel erhoben in der rechten Hand (Bildseite links). Sie liest jetzt die richtigen Karten.
'use strict';
module.exports = {
  id: 'wahrsagerin', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [57, 62], leib: [58, 92], hand: [27, 82] },
  bild(p, v, A) {
    const { E, C, Pg } = A;
    const cx = 57;
    const kopf = E(cx, 40, 10, 12, null, { pf: 'bevel' });
    const hals = C(cx, 48, cx, 62, 5, 7, null);
    // Schleier: spitz über dem Scheitel, fällt über Schultern bis zur Hüfte, unten leicht geschwungen
    const schleier = Pg([[cx, 21], [cx + 9, 25], [cx + 15, 36], [cx + 17, 50], [cx + 26, 62], [cx + 31, 86], [cx + 33, 108], [cx + 24, 112], [cx + 8, 106], [cx - 8, 106], [cx - 24, 113], [cx - 30, 106], [cx - 28, 84], [cx - 24, 62], [cx - 16, 50], [cx - 14, 35], [cx - 8, 25]], null, { rd: 2 });
    const rock = Pg([[cx - 17, 92], [cx + 17, 92], [cx + 24, 120], [cx + 37, 152], [cx + 40, 167], [cx - 38, 167], [cx - 36, 152], [cx - 24, 120]], null, { rd: 2 });
    const armL = A.glied([[cx - 24, 68], [cx - 31, 76], [cx - 30, 82]], 4, 3.5, null);
    const armR = A.glied([[cx + 25, 68], [cx + 29, 88], [cx + 22, 104]], 4.5, 3.5, null);
    const saumF = Pg(A.saum(cx - 40, cx + 40, 166, 8, 3, 5), null, { rd: 0.5 });
    const ohrL = C(cx - 21, 49, cx - 22, 59, 2.5, 3.5, null), ohrR = C(cx + 21, 49, cx + 22, 59, 2.5, 3.5, null);
    const gruppen = [
      { p: [ohrL, ohrR], k: 1, tone: 0.1 },
      { p: [rock, saumF], k: 3, pf: 'bevel', tone: -0.1 },
      { p: [armR], k: 2, tone: -0.1 },
      { p: [hals, kopf], k: 2 },
      { p: [schleier], k: 2, pf: 'bevel', tone: -0.05 },
      { p: armL, k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Fackel: Schaft senkrecht aus der Faust, oben ein dicker Kopf, darüber die Flamme
      for (let y = 46; y < 96; y++) { P.set(27, y, 'k2'); P.set(28, y, 'r1'); P.set(26, y, 'k1'); }
      P.el(27, 82, 3.5, 3, 'k2');
      for (let y = 34; y < 50; y++) for (let x = 22; x <= 32; x++) if (Math.abs(x - 27) <= (y < 37 ? 3 : y < 46 ? 4 : 2)) P.set(x, y, x >= 30 ? 'r1' : 'k1');
      // Flamme, sparsam: Tropfenform mit hellem Kern
      const fl = [[27, 31, 'kern'], [27, 30, 'kern'], [26, 32, 'glut'], [27, 32, 'kern'], [28, 32, 'glut'], [26, 33, 'glutDim'], [27, 33, 'glut'], [28, 33, 'glutDim'], [27, 29, 'glut'], [27, 28, 'glut'], [27, 27, 'glutDim'], [27, 26, 'glutDim'], [25, 34, 'glutDim'], [29, 34, 'glutDim'], [26, 31, 'glutDim'], [28, 31, 'glutDim'], [26, 30, 'glutDim'], [28, 30, 'glutDim'], [27, 25, 'glutDim']];
      fl.forEach(([x, y, c]) => P.set(x, y, c));
      // Ohrringe: zwei Tropfen, dunkel
      P.set(cx + 24, 52, 'r1');
      // Augen im Schleierschatten
      P.set(cx - 4, 41, 'kern'); P.set(cx + 4, 41, 'kern'); P.set(cx - 3, 41, 'glut'); P.set(cx + 5, 41, 'glut');
      augen.push([cx - 4, 41], [cx + 4, 41]);
      // Talisman: schwarze Kerze als dunkles Stück am Gürtel
      P.line(cx + 6, 90, cx + 6, 100, 'k0', true); P.line(cx + 7, 90, cx + 7, 100, 'k1', true);
      // Rockfalten als dunkle Linien
      P.line(cx - 2, 108, cx - 10, 160, 'k1', true); P.line(cx + 12, 108, cx + 22, 160, 'k1', true);
    };
    return { gruppen, details, augen };
  },
};
