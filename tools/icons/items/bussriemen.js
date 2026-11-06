// Bußriemen: ein Lederriemen zur Schlinge gelegt, mit neun (oder zehn) dicken Knoten,
// die Enden hängen herab. Zwischen den Knoten ist das Leder dunkel geworden.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E } = A;
    const pfad = [[30, 4], [12, 8], [8, 22], [20, 30], [36, 24], [38, 12], [26, 14], [22, 30], [26, 46]];
    const riemen = kurve(pfad, 1.4, 1.3, null, { cr: true }, 40);
    const knoten = []; for (let i = 0; i < 10; i++) { const [x, y] = riemen.B(0.05 + i * 0.1); knoten.push(E(x, y, 2.3, 2.3, null, { pf: 'bevel', hz: 0.6 })); }
    return {
      gruppen: [{ p: riemen, mat: 'leder', k: 0 }, { p: knoten, mat: 'leder', k: 0, tone: 0.06 }],
      details(P) { const [x, y] = riemen.B(0.95); P.set(x, y - 2, 'a2'); P.set(x + 1, y, 'a3'); const [a, b] = riemen.B(0.97); P.set(a - 1, b + 1, 'a2'); },
    };
  },
};
