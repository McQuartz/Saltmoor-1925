// Die Morsetaste: Eichenbrett schräg im Licht, darauf der Messinghebel mit schwarzem Knopf vorn, hinten die
// Feder und die Stellschraube; am Kontakt springt ein winziger Funke in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { C, E, Pg } = A;
    const brett = [Pg([[4, 34], [36, 26], [44, 32], [12, 42]], null, { rd: 1 })];
    const kante = [Pg([[12, 42], [44, 32], [44, 35], [12, 45]], null, { rd: 0.6 })];
    const lager = [E(30, 27, 3, 2.4, null), C(30, 27, 30, 23, 1.6, 1.4)];
    const hebel = [C(36, 20, 10, 30, 1.6, 1.4)];
    const knopf = [E(9, 28, 5, 3.2, null, { pf: 'bevel', hz: 0.6 }), C(9, 28, 9, 31, 1.2, 1.2)];
    const feder = [C(38, 21, 38, 27, 1.1, 1.1), E(38, 19, 2, 1.6, null)];
    const kontakt = [C(16, 34, 16, 31, 1, 0.9)];
    return {
      gruppen: [{ p: kante, mat: 'holz', k: 0, tone: -0.2 }, { p: brett, mat: 'holzhell', k: 0 }, { p: [...lager, ...feder, ...kontakt], mat: 'messing', k: 0 }, { p: hebel, mat: 'messing', k: 0, tone: 0.1 }, { p: knopf, mat: 'kohle', k: 0 }],
      details(P) {
        for (let i = 0; i < 5; i++) P.ritz(8 + i * 6, 36 - i * 1.6, 12 + i * 6, 38 - i * 1.6, -1);
        P.set(16, 30, 'a4'); P.set(15, 30, 'a3'); P.set(17, 29, 'a3'); P.glow(16, 30, 4, 0.8);
        for (let k = 0; k < 4; k++) P.stufe(38, 22 + k * 1.5, k % 2 ? +1 : -1);
        P.set(7, 27, 'kohleR2');
      },
    };
  },
};
