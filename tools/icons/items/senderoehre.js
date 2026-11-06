// Die Senderöhre (Reliquie): ein Glaskolben, schräg im Licht, darin Gitter und Anode; der Faden glüht in der
// Farbe des Stoffs, kalt und hell zugleich. Unten der Sockel aus Bakelit mit Kupferstiften.
'use strict';
module.exports = {
  form(A) {
    const { C, E, Pg } = A;
    const kolben = [E(24, 20, 11, 14, null, { pf: 'bevel', hz: 0.5 }), C(24, 30, 24, 36, 8, 7)];
    const kuppe = [C(24, 6, 24, 3, 1.4, 0.9)];
    const sockel = [Pg([[15, 36], [33, 36], [32, 42], [16, 42]], null, { rd: 1 })];
    const stifte = [C(19, 42, 19, 46, 0.9, 0.8), C(24, 42, 24, 46, 0.9, 0.8), C(29, 42, 29, 46, 0.9, 0.8)];
    const anode = [Pg([[19, 14], [29, 13], [29, 30], [19, 31]], null, { rd: 0.6 })];
    return {
      gruppen: [{ p: stifte, mat: 'kupfer', k: 0 }, { p: sockel, mat: 'kohle', k: 0 }, { p: [...kolben, ...kuppe], mat: 'glas', k: 0, tone: -0.25 }, { p: anode, mat: 'eisen', k: 0, tone: -0.2 }],
      details(P) {
        // Gitter: waagerechte Windungen auf der Anode; der Faden glüht senkrecht in der Mitte
        for (let y = 15; y < 30; y += 2) P.line(19, y, 28, y, 'eisen0', true);
        P.glow(24, 21, 10, 1, 'a2', 'a1');
        for (let y = 16; y < 28; y++) P.set(24, y, y % 3 ? 'a4' : 'a5');
        P.set(23, 21, 'a3'); P.set(25, 21, 'a3');
        // Spiegelung im Glas oben rechts
        P.set(30, 10, 'glasR2'); P.set(31, 12, 'glasR2'); P.set(31, 13, 'glasR1');
        for (let x = 16; x < 33; x += 3) P.stufe(x, 39, -1);
      },
    };
  },
};
