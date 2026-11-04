// Der nasse Mantel: ein langer Mantel, an einem Haken aufgehängt und schwer vor Nässe; der Stoff klebt in
// senkrechten Falten, vom Saum fallen Tropfen, darunter eine Pfütze. Anders als Woll- und Trenchmantel: hängend, mit Pfütze.
'use strict';
module.exports = {
  form(A) {
    const { mantel, C, E, ring } = A;
    const m = mantel({ cx: 24, y0: 9, y1: 40, sb: 7, sb2: 10, aerm: 25, aw: 3, kragen: 'hoch', aermSpreiz: 0.5 });
    const haken = ring(24, 3, 2.4, 2.4, 0.9, null, {}, 10, Math.PI, Math.PI * 2.2);
    const pfuetze = [E(24, 45, 16, 2.4, null, { pf: 'flat' })];
    void C;
    return {
      gruppen: [{ p: pfuetze, mat: 'akzent', k: 0, tone: -0.35 }, { p: haken, mat: 'eisen', k: 0 }, { p: m.aermelL, mat: 'blaustoff', k: 0 }, { p: m.koerper, mat: 'blaustoff', k: 0 }, { p: m.aermelR, mat: 'blaustoff', k: 0 }, { p: m.kragen, mat: 'blaustoff', k: 0, tone: 0.08 }],
      details(P) {
        for (const x of [19, 23, 27, 31]) { P.ritz(x, 14, x, 39, -2); P.ritz(x + 1, 16, x + 1, 38, +1); }
        for (const [x, y] of [[17, 42], [26, 41], [33, 43]]) P.tropfen(x, y);
        P.set(30, 25, 'papier2');
      },
    };
  },
};
