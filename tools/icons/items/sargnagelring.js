// Ring aus Sargnägeln: drei geschmiedete Nägel mit Vierkantschaft, zum groben Ring gebogen, die Köpfe
// stehen außen ab, die Spitzen überlappen. Rostig.
'use strict';
module.exports = {
  form(A) {
    const { ring, E, achse, apg } = A;
    const teile = [], koepfe = [];
    for (let k = 0; k < 3; k++) {
      const a0 = k * 2.09 - 0.4; teile.push(...ring(24, 25, 13, 12, 1.8 - 0, null, {}, 7, a0, a0 + 2.6));
      const ax = achse(24 + Math.cos(a0) * 13, 25 + Math.sin(a0) * 12, a0 - Math.PI / 2);
      koepfe.push(apg(ax, [[-1.5, -3.5], [1.5, -3.5], [1.5, 3.5], [-1.5, 3.5]], null, { b: 0.8 }));
      void E;
    }
    return {
      gruppen: [{ p: teile, mat: 'rost', k: 0 }, { p: koepfe, mat: 'rost', k: 0, tone: 0.06 }],
      details(P) { for (const [x, y] of [[35, 18], [14, 33], [27, 37], [30, 13]]) P.stufe(x, y, -2); P.set(37, 22, 'a3'); },
    };
  },
};
