// Der nasse Mantel: ein langer Mantel an einem Haken, die Schultern hängen schwer herab, beide Ärmel hängen deutlich
// neben dem Leib, der Stoff klebt in senkrechten Falten; von Saum und Ärmeln fallen Tropfen in eine breite Pfütze.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C, E, ring } = A;
    const haken = ring(24, 3, 2.4, 2.4, 0.9, null, {}, 10, Math.PI, Math.PI * 2.2);
    const leib = [Pg([[19, 6], [29, 6], [36, 12], [37, 40], [11, 40], [12, 12]], null, { b: 2.2, rd: 1 })];
    const aermel = [C(12, 12, 6, 34, 3.4, 2.8), C(36, 12, 42, 34, 3.4, 2.8)];
    const kragen = [Pg([[18, 4], [30, 4], [27, 13], [24, 16], [21, 13]], null, { b: 1, rd: 0.6 })];
    const pfuetze = [E(24, 45, 21, 2.4, null, { pf: 'flat' })];
    return {
      gruppen: [{ p: pfuetze, mat: 'akzent', k: 0, tone: -0.2 }, { p: haken, mat: 'eisen', k: 0 }, { p: aermel, mat: 'blaustoff', k: 0, tone: -0.04 }, { p: leib, mat: 'blaustoff', k: 0, tone: 0.06 }, { p: kragen, mat: 'blaustoff', k: 0, tone: 0.15 }],
      details(P) {
        for (const x of [17, 22, 27, 32]) { P.ritz(x, 16, x, 39, -2); P.ritz(x + 1, 17, x + 1, 38, +1); }
        for (const [x, y] of [[14, 42], [24, 41], [34, 42], [6, 37], [42, 37]]) P.tropfen(x, y, 'a3', 'aH');
        for (let x = 6; x < 43; x += 4) P.set(x, 45, 'a3');
      },
    };
  },
};
