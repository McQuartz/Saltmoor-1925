// Schwelle: eine große Faust lässt Salz rieseln, ein heller Strahl fällt und zieht unten eine weiße Linie,
// ohne abzusetzen. Davor beginnt ein schmaler Streifen Türschwelle.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const schwelle = [Pg([[0, 29], [48, 27], [48, 32], [0, 32]], null, { b: 0.8 })];
    const f = faust({ x: 32, y: 0, a: 1.75, s: 1.7, seite: 1, arm: 4 });
    return { gruppen: [{ p: schwelle, mat: 'holz', k: 0, tone: 0.05 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const [x0, y0] = f.spitze; for (let y = Math.round(y0) + 1; y < 28; y++) P.set(x0 + (y % 3 === 0 ? 1 : 0), y, y % 2 ? 'papierR2' : 'papier3'); for (let x = 2; x <= x0 + 1; x++) { const y = Math.round(27.5 - x * 0.04); P.set(x, y, x % 3 ? 'papierR2' : 'a3'); } } };
  },
};
