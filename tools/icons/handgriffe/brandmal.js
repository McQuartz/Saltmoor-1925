// Brandmal: eine große Faust hält das Brandeisen schräg nach unten, der Ring am Ende glüht weiß-orange, es raucht.
// Die Haut merkt sich die Form länger als du.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, ring, armGruppen } = A;
    const f = faust({ x: 8, y: 6, a: 0.45, s: 1.75, seite: 1, arm: 8 });
    const stiel = [C(18, 13, 33, 22, 1.2, 1.2)];
    const zeichen = ring(37, 25, 4.2, 3.4, 1.1, null, {}, 12);
    return { gruppen: [{ p: stiel, mat: 'eisen', k: 0, tone: 0.1 }, { p: zeichen, mat: 'eisen', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (let a = 0; a < 6.3; a += 0.25) P.set(37 + Math.cos(a) * 4.2, 25 + Math.sin(a) * 3.4, a < 3 ? 'flammeHell' : 'flamme'); P.set(41, 24, 'flammeKern'); P.rauch(41, 15, 4, 'stoff2', 0.5); P.rauch(45, 9, 3, 'stoff1', 0.35); P.line(30, 20, 33, 22, 'glutMittel', true); } };
  },
};
