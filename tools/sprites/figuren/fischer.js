// Der Fischer. Südwester mit breiter Krempe hinten, Ölmantel bis über die Knie, Seestiefel,
// die Harpune senkrecht in der rechten Hand (Bildseite links). Was ihn falsch macht: nichts, er ist der, der hinuntergeht.
'use strict';
module.exports = {
  id: 'fischer', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  // Anschlusspunkte der Fächer: Hals (Talismane), Leib (Kleidung), Hand (Waffen)
  koerper: { hals: [56, 62], leib: [60, 92], hand: [24, 106] },
  bild(p, v, A) {
    const { E, C, Pg } = A;
    const cx = 56;
    const kopf = E(cx, 45, 12, 13, null, { pf: 'bevel' });
    const kragen = Pg([[cx - 14, 50], [cx + 14, 50], [cx + 18, 64], [cx - 17, 64]], null, { rd: 2 });
    const hut = Pg([[cx - 15, 33], [cx - 13, 25], [cx - 4, 21], [cx + 8, 22], [cx + 14, 27], [cx + 16, 31], [cx + 22, 36], [cx + 20, 39], [cx + 12, 37], [cx - 15, 37]], null, { rd: 1 });
    const hals = C(cx, 52, cx + 1, 62, 6, 8, null);
    const mantel = Pg([[cx - 13, 60], [cx + 14, 60], [cx + 22, 70], [cx + 24, 104], [cx + 26, 138], [cx + 3, 141], [cx - 4, 139], [cx - 24, 140], [cx - 22, 104], [cx - 22, 70]], null, { rd: 2 });
    const armL = A.glied([[cx - 20, 66], [cx - 27, 86], [cx - 32, 104]], 5, 4, null);
    const armR = A.glied([[cx + 21, 66], [cx + 25, 88], [cx + 25, 110]], 5, 4.5, null);
    const beinL = C(cx - 9, 136, cx - 10, 158, 5, 5, null);
    const beinR = C(cx + 9, 136, cx + 10, 158, 5, 5, null);
    const stiefelL = Pg([[cx - 16, 154], [cx - 4, 154], [cx - 4, 168], [cx - 18, 168]], null, { rd: 0.5 });
    const stiefelR = Pg([[cx + 4, 154], [cx + 16, 154], [cx + 18, 168], [cx + 4, 168]], null, { rd: 0.5 });
    const gruppen = [
      { p: [beinL, stiefelL], k: 1, tone: -0.15 },
      { p: [beinR, stiefelR], k: 1, tone: -0.1 },
      { p: [mantel, hals, kragen], k: 4, pf: 'bevel', tone: -0.05 },
      { p: [armR], k: 2, tone: -0.05 },
      { p: [kopf], k: 2 },
      { p: [hut], k: 1, pf: 'bevel' },
      { p: armL, k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Harpune: Schaft senkrecht, Spitze mit Widerhaken oben, die Faust darum
      for (let y = 9; y < 164; y++) P.set(24, y, y < 100 ? 'k2' : 'k1');
      for (let y = 9; y < 150; y++) P.set(25, y, y < 30 ? 'r2' : 'r1');
      // Spitze als Rhombus mit zwei Widerhaken
      for (let k = 0; k < 9; k++) { const w = k < 5 ? Math.floor(k / 2) : Math.floor((9 - k) / 2); for (let x = -w; x <= w; x++) P.set(24 + x, k, x === w ? 'r2' : 'k2'); }
      P.set(21, 10, 'r1'); P.set(22, 9, 'k2'); P.set(27, 10, 'r2'); P.set(26, 9, 'k2');
      P.el(24, 106, 3.5, 3, 'k2');
      // Augen unter der Krempe
      P.set(cx - 5, 44, 'kern'); P.set(cx + 3, 44, 'kern'); P.set(cx - 4, 44, 'glut'); P.set(cx + 4, 44, 'glut');
      augen.push([cx - 5, 44], [cx + 3, 44]);
      // Knopfleiste und Kragen als dunkle Formen, keine Innenzeichnung sonst
      P.line(cx, 64, cx, 136, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
