// Sich sammeln: zwei Hände liegen flach auf zwei Knien (Hosenstoff), die Finger gespreizt, bis die Füße wieder gehören.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, armGruppen } = A;
    const knie = [E(12, 24, 10, 8, null, { pf: 'bevel', hz: 0.4 }), E(36, 24, 10, 8, null, { pf: 'bevel', hz: 0.4 })];
    const h1 = hand({ x: 10, y: 10, a: 1.25, s: 1.25, seite: -1, curl: [0.15, 0.2, 0.2, 0.2], spreiz: 0.12, daumen: 0.2, arm: 12 });
    const h2 = hand({ x: 38, y: 10, a: 1.89, s: 1.25, seite: 1, curl: [0.15, 0.2, 0.2, 0.2], spreiz: 0.12, daumen: 0.2, arm: 12 });
    return { gruppen: [{ p: knie, mat: 'stoff', k: 2 }, ...armGruppen(h1, 'wolle'), ...armGruppen(h2, 'wolle'), { p: h1.alle(), mat: 'haut', k: 1 }, { p: h2.alle(), mat: 'haut', k: 1 }] };
  },
};
