// Revolver: schwerer Dienstrevolver von 1925 im Profil, Lauf nach rechts oben gekippt,
// Trommel mit einer Kammer, die glimmt (die Patrone, die du nicht geladen hast).
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(9, 30, -0.42);
    const lauf = [acap(ax, 12, -3, 36, -3, 2.1, 1.9)];
    const korn = [apg(ax, [[33, -5], [35, -5], [35, -6.5], [34, -6.5]], null, { b: 0.6 })];
    const rahmen = [apg(ax, [[4, -6], [16, -6], [17, 0], [15, 3], [6, 3], [3, 0]], null, { b: 1.6, rd: 0.5 })];
    const trommel = [apg(ax, [[8, -5.5], [16, -5.5], [16.5, 1.5], [7.5, 1.5]], null, { b: 2, rd: 1 })];
    const hahn = [apg(ax, [[3, -5], [1, -9], [-1.5, -9.5], [1, -6.5], [4, -3]], null, { b: 0.8 })];
    const griff = [apg(ax, [[2, -1], [9, 1], [7, 14], [5, 17.5], [0, 17], [-1.5, 12]], null, { b: 2, rd: 1.3 })];
    const buegel = A.ring(...ax.P(10, 4.5), 3, 3, 0.8, null, {}, 10, 0, Math.PI);
    return {
      gruppen: [
        { p: griff, mat: 'holz', k: 0 },
        { p: [...rahmen, ...hahn], mat: 'eisen', k: 1 },
        { p: buegel, mat: 'eisen', k: 0, ohneR2: true },
        { p: [...lauf, ...korn], mat: 'stahl', k: 0.6 },
        { p: trommel, mat: 'stahl', k: 0 },
      ],
      details(P) {
        // Rillen der Trommel und eine Kammer, die glimmt
        for (const t of [9.5, 12, 14.5]) { const [a, b] = ax.P(t, -5), [c, d] = ax.P(t, 1); P.ritz(a, b, c, d, -2); }
        const [gx, gy] = ax.P(16.8, -2.5); P.set(gx, gy, 'aG'); P.set(gx, gy + 1, 'a3');
        // Griffschalen-Raute
        for (let k = 0; k < 4; k++) { const [x, y] = ax.P(3 + k * 1.2, 5 + k * 2.4); P.stufe(x, y, -1); P.stufe(x + 2, y, -1); }
      },
    };
  },
};
