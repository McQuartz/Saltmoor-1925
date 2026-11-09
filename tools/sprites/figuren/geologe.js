// Der Geologe. Tropenhelm mit breiter Krempe, langer Ölmantel, großer Rucksack, dessen Umriss
// über der rechten Schulter steht, eine Kartenrolle schräg hinter dem Rücken, die Spitzhacke in der linken Faust.
'use strict';
module.exports = {
  id: 'geologe', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [56, 64], leib: [58, 94], hand: [18, 112] },
  bild(p, v, A) {
    const { E, C, Pg, glied } = A;
    const cx = 56;
    const kopf = E(cx, 47, 11, 12, null, { pf: 'bevel' });
    const helm = Pg([[cx - 24, 46], [cx - 14, 42], [cx - 11, 30], [cx - 4, 24], [cx + 6, 24], [cx + 12, 30], [cx + 14, 42], [cx + 26, 46], [cx + 22, 50], [cx - 22, 50]], null, { rd: 1.5 });
    const hals = C(cx, 55, cx, 64, 6, 8, null);
    const mantel = Pg([[cx - 13, 62], [cx + 14, 62], [cx + 24, 72], [cx + 27, 106], [cx + 29, 144], [cx + 3, 147], [cx - 4, 145], [cx - 27, 146], [cx - 25, 106], [cx - 23, 72]], null, { rd: 2 });
    const rucksack = Pg([[cx + 10, 56], [cx + 22, 52], [cx + 34, 58], [cx + 38, 74], [cx + 38, 108], [cx + 30, 114], [cx + 18, 112], [cx + 14, 76]], null, { rd: 3 });
    const rolle = glied([[cx + 12, 118], [cx + 24, 80], [cx + 36, 38]], 3.5, 3.5, null);
    const armL = glied([[cx - 21, 68], [cx - 27, 90], [cx - 38, 111]], 5, 4, null);
    const armR = glied([[cx + 22, 68], [cx + 27, 90], [cx + 24, 112]], 5, 4.5, null);
    const beinL = C(cx - 9, 140, cx - 10, 158, 5, 5, null);
    const beinR = C(cx + 9, 140, cx + 10, 158, 5, 5, null);
    const stiefelL = Pg([[cx - 17, 154], [cx - 4, 154], [cx - 4, 168], [cx - 19, 168]], null, { rd: 0.5 });
    const stiefelR = Pg([[cx + 4, 154], [cx + 17, 154], [cx + 20, 168], [cx + 4, 168]], null, { rd: 0.5 });
    const gruppen = [
      { p: [rucksack, rolle], k: 1, pf: 'bevel' },
      { p: [beinL, stiefelL], k: 1, tone: -0.15 },
      { p: [beinR, stiefelR], k: 1, tone: -0.1 },
      { p: [mantel, hals], k: 4, pf: 'bevel', tone: -0.05 },
      { p: [armR], k: 2, tone: -0.05 },
      { p: [kopf], k: 2 },
      { p: [helm], k: 1, pf: 'bevel' },
      { p: armL, k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Spitzhacke: Schaft von der Faust nach unten, schwerer Kopf mit zwei gekrümmten Zinken oben
      for (let y = 60; y <= 152; y++) for (let x = 17; x <= 19; x++) P.set(x, y, x === 19 ? 'r1' : 'k2');
      const zinke = dir => { for (let k = 0; k <= 15; k++) { const x = 18 + dir * k, y = 60 + Math.round(k * k / 16); for (let d = -1; d <= 2; d++) P.set(x, y + d, d === -1 ? 'r2' : 'k2'); } };
      zinke(1); zinke(-1);
      P.el(18, 112, 4, 3.5, 'k2');
      // Augen unter der Helmkrempe
      P.set(cx - 5, 49, 'kern'); P.set(cx + 3, 49, 'kern'); P.set(cx - 4, 49, 'glut'); P.set(cx + 4, 49, 'glut');
      augen.push([cx - 5, 49], [cx + 3, 49]);
      // Riemen über der Brust
      P.line(cx - 12, 66, cx + 16, 100, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
