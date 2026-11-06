// Harpune: Eschenschaft schräg nach oben rechts, eiserne Spitze mit einem Widerhaken, die nasse Leine
// vom Bruder hängt in einer losen Schlaufe vom Auge herunter.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, kurve } = A;
    const ax = achse(6, 42, -Math.PI / 4);
    const schaft = [acap(ax, 0, 0, 33, 0, 2.0, 1.7)];
    const spitze = [apg(ax, [[31, -2.2], [37, -2.4], [48, 0], [37, 2.4], [31, 2.2]], null, { b: 1.2 }),
      apg(ax, [[38, 1.5], [41, 1.6], [35, 6.2], [36.5, 2.2]], null, { b: 0.8 })];
    const tuelle = [acap(ax, 29, 0, 32.5, 0, 2.4, 2.4)];
    const [ox, oy] = ax.P(30, 0);
    const leine = kurve([[ox, oy], [ox + 9, oy + 8], [ox + 4, oy + 22], [ox - 7, oy + 19], [ox - 6, oy + 9]], 1.1, 1.1, null, {}, 16);
    return {
      gruppen: [
        { p: leine, mat: 'wolle', k: 0, ohneR2: true },
        { p: schaft, mat: 'holz', k: 0 },
        { p: tuelle, mat: 'eisen', k: 0 },
        { p: spitze, mat: 'stahl', k: 0.5 },
      ],
      details(P) {
        // Wicklung am Griff
        for (let t = 4; t < 11; t += 2) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -2); P.stufe(x + 1, y, -2); }
        // Tropfen an der Leine
        const [x, y] = leine.B(0.55); P.set(x, y + 3, 'a2'); P.set(x, y + 4, 'aG');
      },
    };
  },
};
