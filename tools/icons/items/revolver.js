// Revolver: schwerer Dienstrevolver von 1925 im Profil, Lauf nach rechts oben gekippt, Vogelkopfgriff,
// Trommel mit einer Kammer, die glimmt (die Patrone, die du nicht geladen hast).
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(7, 26, -0.38);
    const lauf = [apg(ax, [[16, -5.6], [39, -5.4], [39, -1.6], [16, -1.2]], null, { b: 1.2, rd: 0.4 })];
    const korn = [apg(ax, [[36, -5], [38, -5], [38, -7.5], [37, -7.5]], null, { b: 0.6 })];
    const rahmen = [apg(ax, [[5, -6.5], [18, -6.5], [18, 1], [16, 3], [6, 3], [4, 0]], null, { b: 1.6, rd: 0.5 })];
    const trommel = [apg(ax, [[8.5, -6], [17, -6], [17, 2], [8.5, 2]], null, { b: 2.2, rd: 1 })];
    const hahn = [apg(ax, [[5, -5.5], [2.5, -10], [0, -10.5], [2, -7], [5, -3]], null, { b: 0.8 })];
    const griff = [apg(ax, [[3, -2], [10, 1], [9, 9], [7.5, 15], [3.5, 18], [-1.5, 16.5], [-2, 13], [1, 7]], null, { b: 2, rd: 1.3 })];
    const kappe = [acap(ax, -0.5, 16.5, 3.5, 17.5, 1.6, 1.6)];
    const buegel = A.ring(...ax.P(12, 4.2), 3.2, 3.2, 0.8, null, {}, 10, -0.3, Math.PI - 0.3);
    return {
      gruppen: [
        { p: griff, mat: 'holz', k: 0 },
        { p: kappe, mat: 'eisen', k: 0 },
        { p: [...rahmen, ...hahn], mat: 'eisen', k: 1 },
        { p: buegel, mat: 'eisen', k: 0, ohneR2: true },
        { p: [...lauf, ...korn], mat: 'stahl', k: 0.6 },
        { p: trommel, mat: 'stahl', k: 0 },
      ],
      details(P) {
        for (const t of [10.5, 13, 15.5]) { const [a, b] = ax.P(t, -5.5), [c, d] = ax.P(t, 1.5); P.ritz(a, b, c, d, -2); }
        const [gx, gy] = ax.P(17.6, -2.2); P.set(gx, gy, 'aG'); P.set(gx, gy + 1, 'a3');
        // Rille unter dem Lauf (Ausstoßerstange)
        const [a, b] = ax.P(19, -2.6), [c, d] = ax.P(34, -2.6); P.ritz(a, b, c, d, -1);
        for (let k = 0; k < 4; k++) { const [x, y] = ax.P(3 + k * 0.9, 4 + k * 3); P.stufe(x, y, -1); P.stufe(x + 2, y, -1); }
      },
    };
  },
};
