// Weiterreichen: eine große, offene Hand mit der Fläche nach oben reicht ein kleines Holzkästchen mit Messingschloss
// nach rechts weiter, bevor es schwer wird.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const h = hand({ x: 2, y: 27, a: -0.08, s: 1.75, seite: -1, curl: [0.12, 0.15, 0.18, 0.22], spreiz: 0.03, daumen: 0.15, daumenWinkel: 0.8, arm: 4 });
    const kiste = [Pg([[22, 9], [36, 7], [37, 18], [23, 20]], null, { b: 1.4, rd: 0.4 })];
    const deckel = [Pg([[22, 9], [36, 7], [36, 10.5], [22, 12.5]], null, { b: 0.8 })];
    return { gruppen: [...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }, { p: kiste, mat: 'holz', k: 0, tone: 0.12 }, { p: deckel, mat: 'holz', k: 0, tone: 0.2 }, { p: [Pg([[28, 11], [31, 10.5], [31, 15], [28, 15.5]], null, { b: 0.5 })], mat: 'messing', k: 0, tone: 0.1 }],
      details(P) { P.set(29, 13, 'kohle0'); P.set(40, 10, 'a2'); } };
  },
};
