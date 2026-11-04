// Pilgerstab: hoher Stab mit Knauf, an einer Schnur hängen Kürbisflasche und Jakobsmuschel.
// Im Griff die Kerben der Wallfahrten.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, E, kurve, Pg } = A;
    const ax = achse(14, 46, -1.36);
    const stab = [acap(ax, 0, 0, 43, 0, 1.5, 1.7)];
    const knauf = [E(...ax.P(44, 0), 2.6, 2.6, null, { pf: 'bevel', hz: 0.5 }), acap(ax, 36, 0, 38, 0, 2.1, 2.1)];
    const [sx, sy] = ax.P(35, 0);
    const schnur = kurve([[sx, sy], [sx + 6, sy + 3], [sx + 9, sy + 8]], 0.6, 0.6, null, {}, 6);
    const kuerbis = [E(sx + 10, sy + 12, 3.2, 3, null, { pf: 'bevel', hz: 0.5 }), E(sx + 10, sy + 18, 4.6, 4.6, null, { pf: 'bevel', hz: 0.4 })];
    const muschel = [Pg([[sx - 1, sy + 7], [sx - 7, sy + 10], [sx - 7, sy + 15], [sx - 3, sy + 18], [sx + 1, sy + 15], [sx + 1, sy + 10]], null, { b: 1, rd: 1 })];
    return {
      gruppen: [{ p: stab, mat: 'holzhell', k: 0 }, { p: knauf, mat: 'holzhell', k: 0.8 }, { p: schnur, mat: 'wolle', k: 0, ohneR2: true }, { p: muschel, mat: 'knochen', k: 0 }, { p: kuerbis, mat: 'holz', k: 1.5 }],
      details(P) {
        for (let t = 22; t < 32; t += 2) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -2); }
        for (let i = 0; i < 4; i++) P.ritz(sx - 3, sy + 17, sx - 6 + i * 2, sy + 9.5, -1);
        P.set(sx + 12, sy + 16, 'a3');
      },
    };
  },
};
