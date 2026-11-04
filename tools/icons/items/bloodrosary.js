// Blutrosenkranz: große Glasperlen an einer dunklen Schnur, zu einer engen Spirale gelegt, in jeder steht
// ein roter Tropfen. Am Ende hängt ein schmales Kreuz, von dem ein Tropfen fällt. Spirale statt Schlaufe.
'use strict';
module.exports = {
  form(A) {
    const { perlen, C, kurve } = A;
    const pts = []; for (let i = 0; i <= 18; i++) { const a = i * 0.55 - 2.05, r = 2.5 + i * 0.85; pts.push([24 + Math.cos(a) * r, 17 + Math.sin(a) * r * 0.85]); }
    const schnur = kurve(pts, 0.6, 0.6, null, { cr: true }, 40);
    const spirale = perlen(pts, 22, 2.2, null);
    const [ex, ey] = spirale.B(1);
    const kreuz = [C(ex, ey + 2, ex, ey + 13, 1.1, 1.1), C(ex - 3.5, ey + 6, ex + 3.5, ey + 6, 1, 1)];
    return {
      gruppen: [{ p: schnur, mat: 'leder', k: 0, ohneR2: true }, { p: spirale, mat: 'glas', k: 0, tone: 0.05 }, { p: kreuz, mat: 'eisen', k: 0 }],
      details(P) {
        for (let i = 0; i < 22; i++) { const [x, y] = spirale.B(i / 21); P.set(x - 0.5, y + 0.6, 'a3'); P.set(x - 0.5, y - 0.4, 'a2'); }
        P.set(ex, ey + 15, 'a3'); P.set(ex, ey + 16, 'a2');
      },
    };
  },
};
