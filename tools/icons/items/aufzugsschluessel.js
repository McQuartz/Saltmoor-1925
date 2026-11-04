// Aufzugsschlüssel: großer Messingschlüssel zum Aufziehen, Flügelgriff (zwei geschwungene Ohren),
// langer Vierkantschaft, schräg gestellt. In der Griffmitte ein kleines Licht.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, E } = A;
    const ax = achse(15, 17, 0.8);
    const oval = (t0, q0, rt, rq) => apg(ax, Array.from({ length: 14 }, (_, i) => { const w = i / 14 * Math.PI * 2; return [t0 + Math.cos(w) * rt, q0 + Math.sin(w) * rq]; }), null, { b: 2, rd: 0.5 });
    const fluegel = [oval(-6, -8, 3.6, 6.5), oval(-6, 8, 3.6, 6.5)];
    const nabe = [E(...ax.P(-4, 0), 3.8, 3.8, null, { pf: 'bevel', hz: 0.5 })];
    const schaft = [acap(ax, -1, 0, 30, 0, 2.2, 2)];
    const kopf = [apg(ax, [[28, -3], [34, -3], [34, 3], [28, 3]], null, { b: 1 })];
    const ring1 = [acap(ax, 8, 0, 10, 0, 3, 3)];
    return {
      gruppen: [{ p: schaft, mat: 'messing', k: 0 }, { p: ring1, mat: 'messing', k: 0 }, { p: kopf, mat: 'stahl', k: 0 }, { p: fluegel, mat: 'messing', k: 2 }, { p: nabe, mat: 'messing', k: 0, tone: 0.1 }],
      details(P) {
        const [cx, cy] = ax.P(-4, 0); P.glow(cx, cy, 4, 1.2, 'b3', 'b1'); P.set(cx, cy, 'bH');
        const [a, b] = ax.P(34, 0); P.set(a, b, 'kohle0');
        for (const q of [-7, 7]) { const [x, y] = ax.P(-9, q); P.stufe(x, y, -2); }
      },
    };
  },
};
