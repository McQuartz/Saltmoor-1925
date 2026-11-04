// Dolabra der Legion: römische Pionieraxt, langer gerader Stiel schräg, oben ein Eisenkopf mit senkrechtem
// Beilblatt auf der einen und langer, nach unten gebogener Hacke auf der anderen Seite. Auf dem Stiel Namenskerben.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg } = A;
    const ax = achse(9, 45, -1.15);
    const stiel = [acap(ax, 0, 0, 40, 0, 1.9, 1.9)];
    const kopf = [apg(ax, [[34, -3], [42, -3], [42, 3], [34, 3]], null, { b: 1 })];
    const blatt = [apg(ax, [[35, -2.5], [40, -2.5], [45, -9], [44, -13], [37, -12], [33, -6]], null, { b: 1.4 })];
    const hacke = [apg(ax, [[35, 2.5], [41, 2.5], [40, 9], [35, 18], [33, 17], [34, 9]], null, { b: 1 })];
    return {
      gruppen: [{ p: stiel, mat: 'holz', k: 0 }, { p: [...kopf, ...blatt, ...hacke], mat: 'eisen', k: 0.8 }],
      details(P) {
        for (let t = 6; t < 30; t += 2.2) { const [x, y] = ax.P(t, 0.6); P.stufe(x, y, -2); }
        for (let k = 0; k < 8; k++) { const [x, y] = ax.P(44.6 - k * 0.2, -12 + k * 1.1); P.stufe(x, y, +1); }
        const [a, b] = ax.P(36, 17); P.set(a, b, 'a3');
      },
    };
  },
};
