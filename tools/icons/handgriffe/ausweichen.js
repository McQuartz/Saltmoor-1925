// Ausweichen: offene Hand, flach nach vorn abgestützt, schiebt sich weg; dahinter fährt ein Netzseil vorbei.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, kurve, armGruppen } = A;
    const h = hand({ x: 31, y: 22, a: -2.4, s: 1.5, seite: 1, curl: [0.05, 0, 0.05, 0.1], spreiz: 0.18, daumen: 0.2, arm: 16 });
    const seil = kurve([[0, 6], [14, 12], [24, 4], [48, 9]], 1, 1, null, {}, 16);
    return { gruppen: [{ p: seil, mat: 'wolle', k: 0, ohneR2: true }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }] };
  },
};
