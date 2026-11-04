// Wiederholung: dieselbe Hand dreht denselben Schlüssel zweimal, die erste Lage als dunkles Nachbild daneben.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, ring } = A;
    const g = []; [[4, -0.35], [20, 0]].forEach(([dx, t], i) => { const f = faust({ x: 6 + dx, y: 22, a: -0.9, s: 1.2, seite: -1, arm: 8 }); const [kx, ky] = f.ax.P(4, 0); g.push({ p: [C(kx, ky, kx + 5, ky - 12, 0.9, 0.9), ...ring(kx + 6, ky - 14, 2.4, 2.4, 0.8, null, {}, 8)], mat: 'messing', k: 0, tone: t, ohneRand: i === 0 }, { p: [...f.arm, ...f.alle(), ...f.daumen], mat: 'haut', k: 1, tone: t, ohneRand: i === 0 }); });
    return { gruppen: g };
  },
};
