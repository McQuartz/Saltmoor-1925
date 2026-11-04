// Priesterkragen: gestärkter weißer Kollarring, schräg von oben gesehen, vorn die offene Lasche,
// hinten der schwarze Kragenstreifen. Ein Ring, kein Kleidungsstück zum Hineinsehen.
'use strict';
module.exports = {
  form(A) {
    const { ring, Pg } = A;
    const kragen = ring(24, 25, 17, 11, 3.2, null, {}, 22, -Math.PI * 0.42, Math.PI * 1.42);
    const innen = ring(24, 21, 15, 9, 2.2, null, {}, 20, Math.PI * 0.9, Math.PI * 2.1);
    const lasche = [Pg([[20, 33], [28, 33], [27, 40], [21, 40]], null, { b: 1 })];
    return {
      gruppen: [{ p: innen, mat: 'tuch', k: 0 }, { p: kragen, mat: 'papier', k: 1, tone: 0.1 }, { p: lasche, mat: 'tuch', k: 0 }],
      details(P) { P.set(24, 36, 'a3'); P.set(24, 37, 'a2'); for (let x = 10; x < 40; x += 2) P.stufe(x, 25 + Math.round(Math.sin((x - 24) / 17 * 1.5) * 0), 0); },
    };
  },
};
