// Trommelfeuer: eine Faust hält den Abzug eines schweren Maschinengewehrs mit Kühlmantel, Patronengurt hängt herab, Feuer ohne Pause.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { Pg, C, faust, kurve, armGruppen } = A;
    const gehaeuse = [Pg([[6, 10], [22, 10], [22, 20], [6, 20]], null, { b: 1.4, rd: 0.6 })];
    const mantel = [C(22, 13, 38, 13, 3.2, 3.2)], lauf = [C(38, 13, 42, 13, 1, 1)];
    const gurt = kurve([[12, 20], [13, 26], [9, 31]], 1.8, 1.6, null, {}, 8);
    const f = faust({ x: 0, y: 22, a: -0.2, s: 1.15, seite: 1, arm: 0 });
    const griff = [C(4, 15, 6, 15, 2, 2)];
    return { gruppen: [{ p: gurt, mat: 'messing', k: 0 }, { p: [...gehaeuse, ...griff], mat: 'eisen', k: 0.5 }, { p: mantel, mat: 'eisen', k: 0, tone: 0.06 }, { p: lauf, mat: 'stahl', k: 0 }, { p: [...f.alle(), ...f.daumen], mat: 'haut', k: 1 }],
      details(P) { for (let x = 24; x < 38; x += 2) P.set(x, 13, 'eisen0'); P.blitz(45, 13, 4, 0); for (const [x, y] of [[30, 26], [34, 29], [26, 30]]) P.set(x, y, 'messing3'); } };
  },
};
