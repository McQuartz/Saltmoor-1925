// Glas mit Blutegeln: bauchiges Apothekergefäß mit Fuß und gewölbtem Messingdeckel mit Luftlöchern,
// innen kleben die satten Egel an der Glaswand. Breiter und niedriger als das Herzglas.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C, kurve } = A;
    const bauch = [E(24, 29, 16, 12, null, { pf: 'bevel', hz: 0.3 })];
    const fuss = [E(24, 43, 9, 2.6, null, { pf: 'bevel', hz: 0.5 }), C(24, 39, 24, 42, 5, 4)];
    const hals = [Pg([[14, 15], [34, 15], [33, 20], [15, 20]], null, { b: 1 })];
    const deckel = [E(24, 13, 12, 5, null, { pf: 'bevel', hz: 0.45 }), C(24, 8, 24, 6, 2.2, 2.2)];
    const egel = [kurve([[14, 26], [17, 22], [21, 25]], 1.8, 1.4, null, {}, 6), kurve([[28, 31], [32, 27], [35, 31]], 1.9, 1.5, null, {}, 6), kurve([[17, 34], [20, 37], [25, 35]], 1.6, 1.3, null, {}, 6)].flat();
    return {
      gruppen: [{ p: [...bauch, ...hals], mat: 'glas', k: 1.5 }, { p: egel, mat: 'fleisch', k: 0, tone: -0.2, ohneR2: true }, { p: fuss, mat: 'glas', k: 0 }, { p: deckel, mat: 'messing', k: 0 }],
      details(P) {
        for (const x of [19, 24, 29]) P.set(x, 12, 'kohle0');
        P.set(36, 22, 'glas3'); P.set(37, 23, 'glas3');
        for (const [x, y] of [[21, 25], [35, 31], [25, 35]]) P.set(x, y, 'a2');
      },
    };
  },
};
