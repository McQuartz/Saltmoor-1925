// Abrollen: eine große, flache Hand schlägt mit gespreizten Fingern auf den Boden ab (Staub stiebt an den Fingerspitzen),
// daneben rollt der Stahlhelm weg. Wie man es nur einmal beigebracht bekommt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, Pg, armGruppen } = A;
    const h = hand({ x: 6, y: 25, a: -0.05, s: 1.75, seite: 1, curl: [0, 0, 0.03, 0.06], spreiz: 0.18, daumen: 0.2, arm: 6 });
    const helm = [E(38, 12, 9, 6.5, null, { pf: 'bevel', hz: 0.4 }), Pg([[28, 12], [48, 12], [47, 15], [29, 15]], null, { b: 0.8 })];
    return { gruppen: [{ p: helm, mat: 'gruenstoff', k: 1.5, tone: 0.1 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const [x, y] of h.spitzen) P.rauch(x + 2, y + 2, 2.6, 'stein2', 0.5); P.rauch(30, 29, 3, 'stein2', 0.5); P.set(40, 8, 'a3'); P.ritz(30, 13, 46, 13, -1); } };
  },
};
