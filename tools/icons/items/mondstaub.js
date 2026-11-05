// Mondstaub im Fläschchen: ein kleines Glas mit Korken, halb voll grauem Staub. Der Staub liegt nicht flach,
// er hat sich zu einer Form gesetzt, und darin glimmen zwei bleiche Punkte.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C, E } = A;
    const glas = [Pg([[16, 16], [32, 16], [36, 24], [36, 42], [12, 42], [12, 24]], null, { b: 2, rd: 2 })];
    const hals = [C(24, 10, 24, 16, 4.2, 4.2)];
    const korken = [C(24, 5, 24, 10, 3.6, 3.8)];
    const staub = [Pg([[14, 41], [14, 33], [19, 30], [23, 24], [27, 27], [30, 31], [34, 33], [34, 41]], null, { b: 1.5, rd: 1.2 })];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: hals, mat: 'glas', k: 0 }, { p: staub, mat: 'stein', k: 0, tone: 0.1 }, { p: korken, mat: 'holzhell', k: 0 }],
      details(P) {
        P.glow(23.5, 31, 6, 0.8); P.set(21, 31, 'a5'); P.set(26, 31, 'a5'); P.set(22, 31, 'a3'); P.set(27, 31, 'a3');
        for (const [x, y] of [[17, 36], [29, 35], [22, 38], [31, 39], [19, 40]]) P.stufe(x, y, +1);
        for (let y = 19; y < 40; y += 3) P.auf(33, y, 'glas3');
        P.line(15, 22, 15, 30, 'glas3', true);
        for (const [x, y] of [[23, 20], [25, 17], [22, 13]]) P.auf(x, y, 'stein2');
      },
    };
  },
};
