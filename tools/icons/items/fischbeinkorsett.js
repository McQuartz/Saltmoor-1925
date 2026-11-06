// Fischbein-Korsett: ein Mieder von vorn, in der Taille eingeschnürt (Sanduhr), mit senkrechten Fischbeinstäben
// und Schnürung in der Mitte; ein Stab ragt oben zu weit heraus, er wächst noch.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C } = A;
    const korsett = [Pg([[11, 8], [37, 8], [34, 18], [31, 27], [36, 41], [12, 41], [17, 27], [14, 18]], null, { b: 2, rd: 1 })];
    const stab = [C(30, 9, 31, 2, 0.9, 0.8)];
    return {
      gruppen: [{ p: stab, mat: 'knochen', k: 0, tone: 0.1 }, { p: korsett, mat: 'papier', k: 0, tone: -0.12 }],
      details(P) {
        for (const x of [16, 20, 28, 32]) P.ritz(x, 9, x + (x < 24 ? 1 : -1) * 1.5, 40, -2);
        for (let y = 10; y < 40; y += 3) { P.set(23, y, 'kohle1'); P.set(25, y + 1, 'kohle1'); P.set(24, y + 1, 'leder3'); }
        P.set(30, 2, 'a3'); P.ritz(12, 40, 36, 40, -1);
      },
    };
  },
};
