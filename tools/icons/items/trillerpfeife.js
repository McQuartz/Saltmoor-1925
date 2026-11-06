// Trillerpfeife des Turnlehrers: Messing, schräg, vorn das Mundstück, hinten die runde Kammer mit dem Ring,
// an dem eine graue Schnur hängt. Aus dem Mundstück läuft ein Tropfen Wasser.
'use strict';
module.exports = {
  form(A) {
    const { E, acap, achse, apg, kurve } = A;
    const ax = achse(10, 30, -0.42);
    const rohr = [apg(ax, [[0, -3.2], [20, -3.6], [22, -2], [22, 5], [0, 3.2]], null, { b: 1.6, rd: 1 })];
    const kammer = [E(...ax.P(25, 2.5), 8.2, 8, null, { pf: 'dome' })];
    const ringe = [A.ring(...ax.P(33, -4), 3, 3, 0.9, null)];
    const schnur = kurve([ax.P(35, -6), [44, 4], [44, 22], [34, 40], [26, 44]], 0.8, 0.8, null, {}, 14);
    const tropfen = [E(...ax.P(0.5, 6), 1.3, 1.8)];
    return {
      gruppen: [{ p: schnur, mat: 'stoff', k: 0 }, { p: ringe, mat: 'messing', k: 0 }, { p: rohr, mat: 'messing', k: 0.6 }, { p: kammer, mat: 'messing', k: 0.6, tone: 0.1 }, { p: tropfen, mat: 'akzent', k: 0 }],
      details(P) {
        const [a, b] = ax.P(1, -2), [c, d] = ax.P(1, 2); P.ritz(a, b, c, d, -3);
        const [e, f] = ax.P(14, -3), [g, h] = ax.P(19, -3); P.ritz(e, f, g, h, -2);
        const [k1, k2] = ax.P(25, 2); P.ritz(k1 - 2, k2 + 1, k1 + 3, k2 + 2, -1);
        const [l1, l2] = ax.P(27, -2); P.set(l1, l2, 'messingR2');
        const [t1, t2] = ax.P(0.5, 6); P.set(t1, t2 + 3, 'a2'); P.set(t1, t2 + 6, 'a1');
      },
    };
  },
};
