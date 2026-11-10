// Der Okkultist. Schmale, sehr lange Robe bis zum Boden, spitze Kapuze wie ein Schornstein,
// der Ritualdolch tief gehalten in der linken Hand (Bildseite), ein dickes Buch unter dem rechten Arm.
'use strict';
module.exports = {
  id: 'okkultist', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [56, 64], leib: [56, 96], hand: [24, 108] },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum } = A;
    const cx = 56;
    const kapuze = Pg([[cx - 13, 56], [cx - 12, 42], [cx - 8, 28], [cx - 2, 12], [cx + 1, 8], [cx + 4, 14], [cx + 9, 30], [cx + 13, 44], [cx + 14, 58], [cx + 7, 64], [cx - 7, 64]], null, { rd: 1.5 });
    const schulter = Pg([[cx - 16, 64], [cx + 16, 64], [cx + 19, 74], [cx - 19, 74]], null, { rd: 3 });
    const robe = Pg([[cx - 14, 66], [cx + 14, 66], [cx + 18, 90], [cx + 20, 130], [cx + 23, 160], ...saum(cx + 23, cx - 23, 168, 7, 3, 4, 0), [cx - 21, 130], [cx - 18, 90]], null, { rd: 2 });
    const armL = glied([[cx - 17, 72], [cx - 26, 90], [cx - 32, 108]], 4.5, 3.5, null);
    const armR = glied([[cx + 17, 72], [cx + 22, 90], [cx + 12, 104]], 4.5, 3.5, null);
    const buch = Pg([[cx + 6, 94], [cx + 22, 92], [cx + 25, 118], [cx + 9, 121]], null, { rd: 0.5 });
    const gruppen = [
      { p: [robe], k: 2, pf: 'bevel', tone: -0.1 },
      { p: [schulter], k: 2, tone: -0.05 },
      { p: armL, k: 2 },
      { p: [buch], k: 1 },
      { p: armR, k: 2, tone: -0.05 },
      { p: [kapuze], k: 1, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Dolch, Spitze nach unten, Faust um den Griff, Klinge breit und Parierstange weit
      for (let y = 100; y < 142; y++) { const w = y < 112 ? 1.5 : Math.max(0, (142 - y) / 10); for (let x = Math.round(-w); x <= Math.round(w); x++) P.set(24 + x, y, x === Math.round(w) ? 'r2' : 'k2'); }
      for (let x = 17; x <= 31; x++) { P.set(x, 112, 'k2'); P.set(x, 113, 'k2'); }
      P.el(24, 106, 4, 4, 'k2');
      // Kapuzenöffnung als dunkler Schatten, darin die Augen
      P.el(cx, 52, 8, 7, 'k0');
      P.set(cx - 4, 52, 'kern'); P.set(cx + 3, 52, 'kern'); P.set(cx - 3, 52, 'glut'); P.set(cx + 4, 52, 'glut');
      augen.push([cx - 4, 52], [cx + 3, 52]);
      // Gürtelstrick
      P.line(cx - 16, 98, cx + 16, 98, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
