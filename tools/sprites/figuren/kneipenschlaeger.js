// Der Kneipenschläger. Breite Schultern, Kopf eingezogen, Rumpf verjüngt sich zur Hüfte, leicht vorgebeugt.
// Beide Arme frei vom Körper, Ellbogen sichtbar, Ärmel hochgekrempelt (Absatz am Unterarm),
// die Flasche am Hals gepackt, wie ein Knüppel zum Schlag erhoben (linke Bildseite).
'use strict';
module.exports = {
  id: 'kneipenschlaeger', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [58, 66], leib: [58, 100], hand: [17, 86] },
  bild(p, v, A) {
    const { E, C, Pg, glied } = A;
    const cx = 56;
    const kopf = E(cx + 3, 54, 11.5, 10.5, null, { pf: 'bevel' });
    const muetze = Pg([[cx - 9, 52], [cx - 8, 44], [cx, 40], [cx + 10, 41], [cx + 15, 46], [cx + 25, 51], [cx + 22, 54], [cx - 9, 54]], null, { rd: 1 });
    const nacken = Pg([[cx - 8, 58], [cx + 14, 58], [cx + 36, 70], [cx - 30, 70]], null, { rd: 3 });
    const rumpf = Pg([[cx - 32, 70], [cx + 34, 70], [cx + 33, 88], [cx + 24, 112], [cx + 24, 138], [cx - 22, 138], [cx - 21, 112], [cx - 28, 88]], null, { rd: 3 });
    const schulterL = E(cx - 31, 76, 8, 8, null);
    const schulterR = E(cx + 33, 76, 8, 8, null);
    const oberL = glied([[cx - 31, 77], [cx - 46, 100]], 8, 7, null);
    const aermelL = glied([[cx - 46, 100], [cx - 41, 91]], 7, 7, null);
    const unterL = glied([[cx - 41, 91], [cx - 39, 87]], 5, 5, null);
    const oberR = glied([[cx + 34, 77], [cx + 46, 100]], 8, 7, null);
    const aermelR = glied([[cx + 46, 100], [cx + 44, 110]], 7, 7, null);
    const unterR = glied([[cx + 44, 111], [cx + 40, 122]], 5, 5.5, null);
    const faustR = E(cx + 39, 126, 6, 6, null);
    const beinL = C(cx - 11, 134, cx - 14, 158, 9, 7, null);
    const beinR = C(cx + 12, 134, cx + 15, 158, 9, 7, null);
    const stiefelL = Pg([[cx - 24, 154], [cx - 6, 154], [cx - 5, 168], [cx - 27, 168]], null, { rd: 0.5 });
    const stiefelR = Pg([[cx + 6, 154], [cx + 25, 154], [cx + 28, 168], [cx + 5, 168]], null, { rd: 0.5 });
    const gruppen = [
      { p: [beinL, stiefelL], k: 1, tone: -0.15 },
      { p: [beinR, stiefelR], k: 1, tone: -0.1 },
      { p: [rumpf, nacken, schulterL, schulterR], k: 3, pf: 'bevel', tone: -0.05 },
      { p: [oberR, aermelR, unterR, faustR], k: 2, tone: -0.05 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 1, pf: 'bevel' },
      { p: [oberL, aermelL, unterL], k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Flasche: Hals in der Faust unten, Bauch oben, als Knüppel erhoben
      for (let y = 46; y < 90; y++) { const w = y < 52 ? 3.4 : y < 76 ? 3.6 : y < 82 ? 2.4 : 1.4; for (let x = Math.round(-w); x <= Math.round(w); x++) P.set(17 + x, y, x === Math.round(w) ? 'r1' : 'k2'); }
      for (let x = 15; x <= 19; x++) P.set(x, 45, 'k2');
      P.el(17, 87, 4.5, 4, 'k2');
      // Augen unter dem Mützenschirm
      P.set(cx - 1, 55, 'kern'); P.set(cx + 9, 55, 'kern'); P.set(cx, 55, 'glut'); P.set(cx + 10, 55, 'glut');
      augen.push([cx - 1, 55], [cx + 9, 55]);
      // Hosenträger
      P.line(cx - 8, 70, cx - 8, 138, 'k0', true);
      P.line(cx + 14, 70, cx + 14, 138, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
