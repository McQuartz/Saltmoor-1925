// Die Handglocke der Ungetauften: eine kleine Glocke aus rosiger Glockenspeise mit gedrechseltem Holzgriff,
// leicht gekippt. Unter dem Rand hängt statt eines Klöppels ein Fingerknochen an einer Sehne.
'use strict';
module.exports = {
  form(A) {
    const { E, acap, achse, apg } = A;
    const ax = achse(22, 8, 1.42);
    const glocke = [apg(ax, [[4, -6], [8, -7.2], [16, -7.8], [24, -10], [29, -13.5], [31, -13], [31, 13], [29, 13.5], [24, 10], [16, 7.8], [8, 7.2], [4, 6]], null, { b: 2.6, rd: 1.2 })];
    const griff = [acap(ax, -9, 0, 4, 0, 2.6, 2.2), E(...ax.P(-10, 0), 3.2, 3.2, null, { pf: 'bevel' }), E(...ax.P(-3, 0), 3, 3, null, { pf: 'bevel' })];
    const mund = [E(...ax.P(30.4, 0), 12.4, 3.4)];
    const sehne = [acap(ax, 29, 1, 35, 2.5, 0.5, 0.5)];
    const knochen = [acap(ax, 35, 2.5, 42, 4.5, 1.3, 1.1), E(...ax.P(35, 2.5), 1.7, 1.7), E(...ax.P(42.4, 4.6), 1.5, 1.5)];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0.8 }, { p: glocke, mat: 'kupfer', k: 0, tone: 0.1 }, { p: mund, mat: 'kohle', k: 0, tone: -0.5, ohneRand: true }, { p: sehne, mat: 'leder', k: 0 }, { p: knochen, mat: 'knochen', k: 0.8 }],
      details(P) {
        for (const t of [9, 11, 26]) { const [a, b] = ax.P(t, -8), [c, d] = ax.P(t, 8); P.ritz(a, b, c, d, t === 26 ? -2 : -1); }
        for (let q = -6; q <= 6; q += 3) { const [a, b] = ax.P(18, q); P.stufe(a, b, +1); }
        const [g1, g2] = ax.P(20, -6); P.set(g1, g2, 'a3'); const [h1, h2] = ax.P(21, -5); P.set(h1, h2, 'a2');
      },
    };
  },
};
