// Salve: drei Gewehrläufe in einer Reihe, gestaffelt, alle feuern zugleich. Auch die hinteren, die schon lange liegen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { gewehr } = A;
    const g = []; [[0, 9, -0.35], [2, 18, -0.18], [4, 27, 0]].forEach(([x, y, t]) => { const G = gewehr(x - 4, y, -0.08, 36); g.push({ p: [...G.schaft, ...G.vorder], mat: 'holz', k: 0.5, tone: t }, { p: [...G.system, ...G.lauf], mat: 'eisen', k: 0.5, tone: t }); g.push({ mz: G.muendung }); });
    const mz = g.filter(x => x.mz).map(x => x.mz);
    return { gruppen: g.filter(x => !x.mz), details(P) { for (const [x, y] of mz) P.blitz(x + 3, y, 3.5, -0.08); } };
  },
};
