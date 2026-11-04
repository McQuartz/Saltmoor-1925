// Hexenflasche: bauchiger Steinzeugkrug (Bartmannkrug) mit grimmigem Bartgesicht am Hals, kleinem Henkel,
// aus dem Korken ragen rostige Nägel. Erde klebt am Fuß.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg, ring } = A;
    const bauch = [E(23, 31, 13, 13, null, { pf: 'bevel', hz: 0.3 })];
    const hals = [C(23, 19, 23, 10, 5, 4)];
    const rand = [E(23, 9, 5.2, 2, null, { pf: 'bevel', hz: 0.5 })];
    const henkel = ring(31, 16, 4, 5, 1.2, null, {}, 10, -Math.PI / 2, Math.PI / 2);
    const naegel = [C(20, 8, 17, 1, 0.8, 0.7), C(24, 8, 25, 0, 0.8, 0.7), C(26, 8, 30, 2, 0.8, 0.7)];
    const gesicht = [Pg([[17, 14], [29, 14], [28, 24], [23, 27], [18, 24]], null, { b: 1.2, rd: 0.8 })];
    return {
      gruppen: [{ p: naegel, mat: 'rost', k: 0 }, { p: henkel, mat: 'stein', k: 0 }, { p: [...bauch, ...hals], mat: 'holzhell', k: 2 }, { p: rand, mat: 'holzhell', k: 0 }, { p: gesicht, mat: 'holzhell', k: 0, tone: 0.08 }],
      details(P) {
        P.set(20, 17, 'kohle0'); P.set(26, 17, 'kohle0'); P.set(20, 16, 'holzhell0'); P.set(26, 16, 'holzhell0');
        for (let y = 20; y < 26; y++) for (let x = 19; x < 28; x += 2) if (P.info(x, y)) P.stufe(x + (y % 2), y, -1);
        P.line(21, 20, 25, 20, 'holzhell0', true);
        for (let x = 14; x < 34; x += 3) P.stufe(x, 42, -2);
        P.set(17, 30, 'a3'); P.set(28, 36, 'b3'); P.set(29, 36, 'b2');
      },
    };
  },
};
