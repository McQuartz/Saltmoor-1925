// Zittern: eine erhobene offene Hand, dahinter zwei dunkle, verschobene Nachbilder derselben Hand.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand } = A;
    const g = []; [[-3, 1, -0.35], [3, -1, -0.25], [0, 0, 0]].forEach(([dx, dy, t], i) => { const h = hand({ x: 22 + dx, y: 31 + dy, a: -1.45 + dx * 0.02, s: 1.45, seite: -1, curl: [0.15, 0.1, 0.15, 0.2], spreiz: 0.2, daumen: 0.25, arm: 8 }); g.push({ p: [...h.arm, ...h.alle()], mat: 'haut', k: 1, tone: t, ohneR2: i < 2 }); });
    return { gruppen: g };
  },
};
