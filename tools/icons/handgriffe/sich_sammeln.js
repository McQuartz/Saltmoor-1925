// Sich sammeln: von der Seite ein Bein im Sitzen, Oberschenkel waagerecht, das Knie vorn, der Unterschenkel fällt
// senkrecht ab; eine Hand liegt schwer auf der Kniescheibe, bis die Füße wieder dir gehören.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, E, armGruppen } = A;
    const bein = [C(0, 18, 30, 17, 5.5, 5), C(32, 19, 33, 32, 4.4, 4)];
    const knie = [E(32, 17, 5.6, 5.4, null, { pf: 'bevel', hz: 0.4 })];
    const h = hand({ x: 18, y: 2, a: 0.62, s: 1.4, seite: 1, curl: [0.35, 0.45, 0.5, 0.55], spreiz: 0.08, daumen: 0.2, arm: 10 });
    return { gruppen: [{ p: [...bein, ...knie], mat: 'stoff', k: 2 }, ...armGruppen(h, 'wolle'), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.ritz(4, 18, 24, 17, -1); P.ritz(31, 24, 32, 31, -1); } };
  },
};
