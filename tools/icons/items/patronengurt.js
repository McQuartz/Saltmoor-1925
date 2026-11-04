// Patronengurt des Lotsen: ein Lederriemen als Schlaufe (über die Schulter), mit Schlaufen voller
// Messingpatronen, eine Schlaufe leer. Messingschnalle unten.
'use strict';
module.exports = {
  form(A) {
    const { kurve, achse, acap, Pg } = A;
    const pfad = [[8, 8], [14, 30], [28, 44], [42, 38], [38, 16], [20, 4], [8, 8]];
    const gurt = kurve(pfad, 2.8, 2.8, null, { cr: true }, 30);
    const pat = []; const leer = 6;
    for (let i = 0; i < 13; i++) {
      if (i === leer) continue; const q = 0.08 + i * 0.065; const [x, y] = gurt.B(q), [x2, y2] = gurt.B(q + 0.01);
      const a = Math.atan2(y2 - y, x2 - x) - Math.PI / 2; const ax = achse(x, y, a);
      pat.push(acap(ax, -1, 0, 4.5, 0, 1.1, 1.0));
    }
    const [sx, sy] = gurt.B(0.5); const schnalle = [Pg([[sx - 3, sy - 3], [sx + 3, sy - 3], [sx + 3, sy + 3], [sx - 3, sy + 3]], null, { b: 0.6 })];
    return {
      gruppen: [{ p: gurt, mat: 'leder', k: 0 }, { p: pat, mat: 'messing', k: 0 }, { p: schnalle, mat: 'messing', k: 0 }],
      details(P) { const [x, y] = gurt.B(0.08 + leer * 0.065); P.set(x, y, 'kohle0'); P.set(sx, sy, 'kohle0'); },
    };
  },
};
