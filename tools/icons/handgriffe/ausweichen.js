// Ausweichen: eine offene Hand, flach nach vorn abgestützt, als schiebe sie sich von etwas weg,
// der Arm kommt von rechts. Wie Großvater, wenn die Netze schlugen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand } = A;
    const h = hand({ x: 30, y: 22, a: -2.4, s: 1.5, seite: 1, curl: [0.05, 0, 0.05, 0.1], spreiz: 0.18, daumen: 0.2, arm: 16 });
    return { gruppen: [{ p: h.aermel, mat: 'wolle', k: 0 }, { p: h.arm, mat: 'haut', k: 0 }, { p: h.alle(), mat: 'haut', k: 1 }] };
  },
};
