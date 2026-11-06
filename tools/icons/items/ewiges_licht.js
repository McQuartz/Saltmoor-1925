// Ewiges Licht: rote Ampel aus Glas in einer Messingfassung, an drei Ketten von oben hängend,
// darin brennt ein kleines Licht, das man nicht auspusten kann.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg, kettenglieder, ring } = A;
    const k1 = kettenglieder([[24, 2], [13, 24]], 6, 1.3, null), k2 = kettenglieder([[24, 2], [35, 24]], 6, 1.3, null), k3 = kettenglieder([[24, 2], [24, 22]], 5, 1.3, null);
    const glas = [E(24, 31, 10, 9, null, { pf: 'bevel', hz: 0.3 })];
    const fassung = [Pg([[12, 22], [36, 22], [34, 27], [14, 27]], null, { b: 1.2, rd: 0.6 }), C(24, 40, 24, 45, 2, 1)];
    const oese = ring(24, 2.5, 2, 2, 0.8, null, {}, 8);
    return {
      gruppen: [{ p: [...k1.flach, ...k1.kant, ...k2.flach, ...k2.kant, ...k3.flach, ...k3.kant, ...oese], mat: 'messing', k: 0 }, { p: glas, mat: 'rotstoff', k: 0, tone: 0.1 }, { p: fassung, mat: 'messing', k: 0 }],
      details(P) { P.glow(24, 32, 9, 1.2, 'fleisch3', 'rotstoff3'); P.flamme(24, 33, 6, 1.6, 0); P.set(31, 28, 'rotstoffR2'); },
    };
  },
};
