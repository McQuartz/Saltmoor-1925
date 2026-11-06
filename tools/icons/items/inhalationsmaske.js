// Inhalationsmaske: eine ovale Porzellanmaske für Nase und Mund, schräg von der Seite (man sieht in die Schale),
// mit dickem Gummirand; unten ein Rohransatz, daran ein Schlauch zum Gummiball. Keine Augen, anders als die Gasmaske.
'use strict';
module.exports = {
  form(A) {
    const { E, kurve, achse, acap } = A;
    const schale = [E(19, 17, 13, 15, null, { pf: 'bevel', hz: 0.3 })];
    const rand = [...A.ring(19, 17, 12.5, 14.5, 1.7, null, {}, 26)];
    const ax = achse(26, 30, 0.7);
    const rohr = [acap(ax, 0, 0, 5, 0, 2.2, 1.8)];
    const schlauch = kurve([ax.P(5, 0), [38, 40], [44, 30], [41, 20]], 1.5, 1.5, null, {}, 14);
    const ball = [E(41, 15, 5, 6, null, { pf: 'bevel', hz: 0.45 })];
    return {
      gruppen: [{ p: schale, mat: 'knochen', k: 0, tone: 0.1 }, { p: rand, mat: 'gummi', k: 0, tone: 0.1 }, { p: rohr, mat: 'messing', k: 0 }, { p: schlauch, mat: 'gummi', k: 0, tone: 0.1 }, { p: ball, mat: 'gummi', k: 0, tone: 0.12 }],
      details(P) {
        P.el(20, 18, 8.5, 10.5, 'knochen1', true); P.el(21, 19, 6, 8, 'knochen0', true);
        for (const [x, y] of [[10, 3], [13, 1], [17, 2], [8, 6]]) P.set(x, y, 'a2');
        P.set(43, 12, 'a3');
      },
    };
  },
};
