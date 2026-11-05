// Die Bahnsteigkarte: ein kleiner Pappfahrschein, schräg im Licht, oben ein blaues Band, in der Mitte ein
// ausgeknipstes Loch, durch das man den Grund sieht; unten ein Stempel in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const karte = [Pg([[8, 14], [36, 8], [41, 33], [13, 40]], null, { b: 1, rd: 0.6 })];
    const kante = [Pg([[13, 40], [41, 33], [41, 35], [13, 42]], null, { b: 0.6, rd: 0.3 })];
    return {
      gruppen: [{ p: kante, mat: 'papier', k: 0, tone: -0.3 }, { p: karte, mat: 'papier', k: 0, tone: 0.05 }],
      details(P) {
        // blaues Band oben
        for (let i = 0; i < 4; i++) P.line(9 + i * 0.1, 16 + i, 36.5 + i * 0.1, 10 + i, 'blaustoff3', true);
        P.line(9, 20, 37, 14, 'blaustoff1', true);
        // gedruckte Zeilen
        for (const [y0, l] of [[25, 20], [29, 16], [33, 12]]) P.ritz(13, y0, 13 + l, y0 - l * 0.21, -1);
        // das Loch: dunkel, mit Lichtkante unten links
        P.el(28.5, 27.5, 2.6, 2.6, 0); P.set(26, 29, 'papierR2'); P.set(27, 30, 'papierR1');
        // Stempel
        P.el(18, 34, 3, 2.4, 'a2', true); P.set(18, 34, 'a4'); P.set(17, 33, 'a3');
      },
    };
  },
};
