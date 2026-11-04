// Klingelbeutel: ein Samtbeutel an einem Bügel am Ende einer langen Stange, schräg ins Bild gereicht,
// am Bügel ein kleines Glöckchen. Der Samt ist nass und hängt schwer durch.
'use strict';
module.exports = {
  form(A) {
    const { C, Pg, ring, E } = A;
    const stange = [C(2, 44, 26, 18, 1.4, 1.4)];
    const buegel = ring(33, 17, 9, 4, 1.1, null, {}, 16);
    const beutel = [Pg([[24, 18], [42, 17], [40, 30], [34, 40], [28, 38], [25, 28]], null, { b: 2.4, rd: 1.5 })];
    const glocke = [Pg([[41, 18], [45, 18], [46.5, 25], [39.5, 25]], null, { b: 0.8, rd: 0.5 }), E(43, 26, 1, 1)];
    return {
      gruppen: [{ p: stange, mat: 'holz', k: 0 }, { p: beutel, mat: 'rotstoff', k: 0 }, { p: buegel, mat: 'messing', k: 0 }, { p: glocke, mat: 'messing', k: 0, tone: 0.1 }],
      details(P) { for (const [a, b, c, d] of [[29, 20, 30, 36], [35, 20, 36, 36]]) P.ritz(a, b, c, d, -2); P.set(34, 41, 'a2'); P.set(34, 43, 'a3'); P.set(31, 25, 'rotstoffR1'); },
    };
  },
};
