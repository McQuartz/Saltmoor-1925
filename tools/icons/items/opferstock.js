// Schlüssel zum Opferstock: ein großer Kirchenschlüssel schräg von links unten nach rechts oben. Der Griff ein
// Ring mit drei Pässen wie ein Kleeblatt, der Bart mit Kerben; durch den Griff läuft eine Schnur aus Kerzenwachs.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, ring, kurve, E } = A;
    const ax = achse(13, 35, -0.74);
    const [gx, gy] = ax.P(0, 0);
    const griff = [...ring(gx, gy, 6, 6, 1.7, null, {}, 16)];
    const paesse = [];
    for (const w of [Math.PI * 0.8, Math.PI * 1.25, Math.PI * 1.7].map(q => q - 0.74)) paesse.push(...ring(gx + Math.cos(w) * 7.5, gy + Math.sin(w) * 7.5, 2.6, 2.6, 1.1, null, {}, 10));
    const schaft = [acap(ax, 6, 0, 32, 0, 1.8, 1.6)];
    const bart = [apg(ax, [[24, 1], [32, 1], [32, 8], [30, 8], [30, 5.5], [27.5, 5.5], [27.5 , 8], [24, 8]], null, { b: 0.9 })];
    const knauf = [E(...ax.P(33, 0), 2, 2, null, { pf: 'bevel' })];
    const schnur = kurve([[gx - 3, gy + 3], [gx - 6, gy + 10], [gx + 3, gy + 12], [gx + 4, gy + 4]], 0.8, 0.8, null, { cr: true }, 14);
    return {
      gruppen: [{ p: schnur, mat: 'wachs', k: 0, tone: 0.25 }, { p: [...griff, ...paesse], mat: 'messing', k: 0 }, { p: schaft, mat: 'eisen', k: 0, tone: 0.06 }, { p: bart, mat: 'eisen', k: 0, tone: 0.06 }, { p: knauf, mat: 'messing', k: 0 }],
      details(P) {
        // Kreuzchen in der Mitte des Griffs, Rost im Bart
        P.set(gx, gy - 1, 'a3'); P.set(gx, gy + 1, 'a3'); P.set(gx - 1, gy, 'a3'); P.set(gx + 1, gy, 'a3'); P.set(gx, gy, 'aG');
        for (const [t, q] of [[26, 3], [29, 6], [31, 2]]) P.set(...ax.P(t, q), 'rost2');
      },
    };
  },
};
