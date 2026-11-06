// Brille mit drei Gläsern: ein Drahtgestell mit zwei runden Gläsern und einem dritten über der Nase
// auf der Stirnhöhe, Bügel nach hinten aufgeklappt. Das mittlere Glas leuchtet von innen.
'use strict';
module.exports = {
  form(A) {
    const { ring, C, E } = A;
    const g1 = ring(13, 29, 7, 6.5, 1, null, {}, 16), g2 = ring(35, 29, 7, 6.5, 1, null, {}, 16), g3 = ring(24, 14, 6, 5.5, 1, null, {}, 14);
    const steg = [C(20, 28, 28, 28, 0.8, 0.8), C(19, 24, 21, 18, 0.8, 0.8), C(29, 24, 27, 18, 0.8, 0.8)];
    const buegel = [C(6, 27, 3, 40, 0.8, 0.7), C(42, 27, 46, 38, 0.8, 0.7), C(3, 40, 5, 44, 0.8, 0.7), C(46, 38, 44, 43, 0.8, 0.7)];
    const glaeser = [E(13, 29, 6, 5.6), E(35, 29, 6, 5.6), E(24, 14, 5, 4.6)];
    return {
      gruppen: [{ p: glaeser, mat: 'glas', k: 0, tone: -0.15, ohneRand: true }, { p: buegel, mat: 'gold', k: 0 }, { p: [...g1, ...g2, ...g3, ...steg], mat: 'gold', k: 0 }],
      details(P) { P.glow(24, 14, 5, 1.3, 'a3', 'a1'); P.set(24, 14, 'aH'); P.set(16, 26, 'glas3'); P.set(38, 26, 'glas3'); P.set(15, 27, 'glas2'); P.set(37, 27, 'glas2'); },
    };
  },
};
