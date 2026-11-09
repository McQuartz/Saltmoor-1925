// Der Friedhofswärter. Gleiche Größe wie der Fischer, aber gebeugt: runde, hochgezogene Schultern, der Kopf tief
// dazwischen geschoben, Schiebermütze. Wollmantel bis zur Wade, die Schaufel mit dem Blatt auf dem Boden in beiden
// Händen (Bildseite links), die Sturmlaterne hängt am Gürtel rechts und ragt aus der Silhouette.
// Varianten: a = Oberkörper nach links geneigt, Kopf leicht gesenkt; b = Buckel, Kopf zwischen den Schultern.
'use strict';
module.exports = {
  id: 'friedhofswaerter', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [54, 60], leib: [58, 96], hand: [30, 100] },
  v: { var: 'b' },
  bild(p, v, A) {
    const { E, C, Pg } = A;
    const b = v.var === 'b';
    const cx = 56, lean = b ? 0 : -3, hy = b ? 50 : 43;
    const kopf = E(cx - 2 + lean, hy, 10.5, 12, null, { pf: 'bevel' });
    const muetze = Pg([[cx - 14 + lean, hy + 1], [cx - 13 + lean, hy - 8], [cx - 6 + lean, hy - 13], [cx + 6 + lean, hy - 13], [cx + 11 + lean, hy - 9], [cx + 11 + lean, hy - 5], [cx + 20 + lean, hy - 2], [cx + 19 + lean, hy + 1], [cx - 14 + lean, hy + 3]], null, { rd: 1 });
    const hals = C(cx - 2 + lean, hy + 8, cx + lean * 0.5, 64, 7, 10, null);
    const mantel = Pg([[cx - 9 + lean, 58], [cx + 9 + lean, 58], [cx + 21 + lean, 64], [cx + 27 + lean, 76], [cx + 24, 100], [cx + 24, 124], [cx + 27, 143], [cx + 4, 146], [cx - 4, 143], [cx - 27, 145], [cx - 24, 124], [cx - 24, 100], [cx - 27 + lean, 76], [cx - 21 + lean, 64]], null, { rd: 3 });
    const buckel = b ? E(cx - 3, 55, 20, 12, null, { pf: 'dome' }) : E(cx - 1 + lean, 63, 17, 7, null, { pf: 'dome' });
    const armL = A.glied([[cx - 24 + lean, 70], [cx - 29, 88], [cx - 26, 100]], 6, 4.5, null);
    const armR = A.glied([[cx + 23 + lean, 70], [cx + 21, 92], [cx - 6, 98], [cx - 22, 88]], 6, 4.5, null);
    const beinL = C(cx - 9, 140, cx - 10, 158, 5.5, 5, null);
    const beinR = C(cx + 9, 140, cx + 10, 158, 5.5, 5, null);
    const stiefelL = Pg([[cx - 17, 154], [cx - 4, 154], [cx - 3, 168], [cx - 19, 168]], null, { rd: 0.5 });
    const stiefelR = Pg([[cx + 4, 154], [cx + 17, 154], [cx + 20, 168], [cx + 4, 168]], null, { rd: 0.5 });
    // Schaufel: Stiel 2 px, T-Griff, großes Blatt auf dem Boden
    const stiel = C(30, 70, 30, 146, 1.3, 1.3, null);
    const griff = [C(23, 68, 37, 68, 1.5, 1.5, null), E(22, 68, 2.5, 2.5, null), E(38, 68, 2.5, 2.5, null)];
    const blatt = Pg([[25, 140], [35, 140], [41, 148], [41, 156], [30, 169], [19, 156], [19, 148]], null, { rd: 1 });
    // Laterne am Gürtel
    const haken = C(cx + 22, 102, cx + 29, 108, 1.4, 1.4, null);
    const korb = Pg([[cx + 27, 110], [cx + 38, 110], [cx + 39, 130], [cx + 26, 130]], null, { rd: 1 });
    const kappe = Pg([[cx + 28, 105], [cx + 37, 105], [cx + 39, 110], [cx + 26, 110]], null, { rd: 0.5 });
    const bugel = [C(cx + 28, 105, cx + 32, 99, 1, 1, null), C(cx + 32, 99, cx + 37, 105, 1, 1, null)];
    const fuss = Pg([[cx + 25, 130], [cx + 40, 130], [cx + 39, 134], [cx + 27, 134]], null, { rd: 0.5 });
    const gruppen = [
      { p: [beinL, stiefelL], k: 1, tone: -0.15 },
      { p: [beinR, stiefelR], k: 1, tone: -0.1 },
      { p: [mantel, hals, buckel], k: 5, pf: 'bevel', tone: -0.05 },
      { p: [armR], k: 2, tone: -0.05 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 1, pf: 'bevel' },
      { p: armL, k: 2 },
      { p: [stiel, ...griff], k: 0.5, pf: 'bevel' },
      { p: [blatt], k: 0, pf: 'bevel' },
      { p: [haken, kappe, korb, fuss, ...bugel], k: 0.5, pf: 'bevel', tone: -0.1 },
    ];
    const augen = [];
    const details = P => {
      // Handschluss um den Stiel
      P.el(30, 100, 4, 3.5, 'k2'); P.el(30, 90, 3.5, 3, 'k2');
      // Laterne: Glaszelle, die einzige warme Stelle
      for (let y = 113; y <= 126; y++) for (let x = cx + 29; x <= cx + 36; x++) P.set(x, y, 'glutDim');
      for (let y = 115; y <= 124; y++) for (let x = cx + 31; x <= cx + 34; x++) P.set(x, y, 'glut');
      P.set(cx + 32, 119, 'kern'); P.set(cx + 33, 119, 'kern'); P.set(cx + 32, 120, 'kern');
      for (let y = 112; y <= 128; y++) P.set(cx + 32, y, y % 3 ? 'glut' : 'glutDim');
      // Augen unter dem Schirm
      const ay = hy + 3;
      P.set(cx - 8 + lean, ay, 'kern'); P.set(cx - 7 + lean, ay, 'glut'); P.set(cx - 1 + lean, ay, 'kern'); P.set(cx + lean, ay, 'glut');
      augen.push([cx - 8 + lean, ay], [cx - 1 + lean, ay]);
      P.line(cx + 1, 70, cx + 2, 142, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
