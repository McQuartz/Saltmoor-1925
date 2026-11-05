// Bluteid: eine große, offene Hand mit der Fläche nach oben, quer ein frischer Schnitt; das Blut tropft in eine kleine
// Messingschale darunter. Der Schwur gilt, solange es tropft.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, Pg, armGruppen } = A;
    const h = hand({ x: 2, y: 15, a: -0.05, s: 1.7, seite: -1, curl: [0.1, 0.1, 0.12, 0.15], spreiz: 0.03, daumen: 0.15, daumenWinkel: 0.8, arm: 4 });
    const schale = [Pg([[25, 25], [43, 25], [40, 31], [28, 31]], null, { b: 1.2, rd: 0.8 }), E(34, 25, 9, 1.8, null, { pf: 'flat' })];
    return { gruppen: [{ p: schale, mat: 'messing', k: 0, tone: 0.1 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.line(9, 14, 19, 11, 'a2', true); P.line(10, 15, 18, 12, 'a3', true); for (const y of [17, 20, 23]) P.tropfen(32, y); P.el(34, 25, 6, 1, 'akzent2', true); P.set(33, 25, 'a3'); } };
  },
};
