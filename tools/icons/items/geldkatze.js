// Geldkatze: ein breiter Ledergurt, leicht durchhängend von links nach rechts, vorn eine flache Tasche mit Klappe
// und Druckknopf. Die Klappe steht einen Spalt offen, darunter glänzen Münzen. Rechts hängt die Schnalle.
'use strict';
module.exports = {
  form(A) {
    const { kurve, Pg, C, E } = A;
    const gurt = kurve([[2, 18], [14, 25], [34, 25], [46, 18]], 2.8, 2.8, null, {}, 22);
    const tasche = [Pg([[12, 20], [36, 20], [37, 40], [24, 43], [11, 40]], null, { b: 2.4, rd: 1.5 })];
    const klappe = [Pg([[11, 18], [37, 18], [37, 28], [24, 32], [11, 28]], null, { b: 1.6, rd: 1 })];
    const knopf = [E(24, 29, 1.8, 1.8, null, { pf: 'dome' })];
    const schnalle = [C(41, 21, 41, 29, 1, 1), C(41, 29, 46, 29, 1, 1), C(46, 21, 46, 29, 1, 1), C(41, 21, 46, 21, 1, 1)];
    const muenzen = [E(18, 33.5, 2.6, 1.4, null, { pf: 'bevel' }), E(30, 33.5, 2.4, 1.3, null, { pf: 'bevel' })];
    return {
      gruppen: [{ p: gurt, mat: 'leder', k: 0, tone: 0.02 }, { p: schnalle, mat: 'messing', k: 0 }, { p: tasche, mat: 'leder', k: 0, tone: 0.1 }, { p: muenzen, mat: 'gold', k: 0, tone: 0.2 }, { p: klappe, mat: 'leder', k: 0, tone: 0.16 }, { p: knopf, mat: 'messing', k: 0 }],
      details(P) {
        // Steppnaht an Klappe und Tasche
        for (let x = 13; x < 36; x += 2) { P.stufe(x, 20, -1); P.stufe(x, 39 + (x > 24 ? (36 - x) * 0.1 : (x - 11) * 0.1), -1); }
        for (let i = 0; i < 12; i++) { P.stufe(13 + i, 28 + i * 0.32, -1); P.stufe(35 - i, 28 + i * 0.32, -1); }
        // Spalt unter der Klappe mit Münzglanz
        P.set(18, 33, 'goldR2'); P.set(30, 33, 'goldR1'); P.set(24, 34, 'gold3');
        for (let x = 4; x < 11; x += 2) P.stufe(x, 20 + (x - 2) * 0.4, -1);
      },
    };
  },
};
