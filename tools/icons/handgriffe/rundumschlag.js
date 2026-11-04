// Rundumschlag: ein Arm schwingt im Kreis; die Faust ist dreimal zu sehen, die früheren Lagen dunkel (Nachbild).
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust } = A;
    const g = []; [[10, 24, -1.6, -0.35], [22, 7, -0.6, -0.18], [36, 14, 0.5, 0]].forEach(([x, y, a, t], i) => { const f = faust({ x, y, a, s: 1.25, seite: -1, arm: 7 }); g.push({ p: f.arm, mat: 'haut', k: 0, tone: t, ohneRand: i < 2 }, { p: [...f.alle(), ...f.daumen], mat: 'haut', k: 1, tone: t, ohneRand: i < 2 }); });
    return { gruppen: g };
  },
};
