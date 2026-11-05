// Gießkelle: ein eiserner Löffel an einem langen Stiel, schräg von unten links nach oben rechts. Im Löffel
// steht flüssige Bronze und glüht; der Stiel endet oben in einem Holzgriff. Innen ist der Löffel blank.
'use strict';
module.exports = {
  form(A) {
    const { E, acap, achse, apg } = A;
    const ax = achse(15, 33, -0.72);
    const stiel = [acap(ax, 9, 0, 40, 0, 1.4, 1.2)];
    const griff = [acap(ax, 34, 0, 46, 0, 2.6, 2.4)];
    const schale = [E(13, 34, 10, 7.5, null, { pf: 'bevel', hz: 0.6 }), apg(ax, [[6, -2.5], [11, -1.6], [11, 1.6], [6, 2.5]], null, { b: 0.8 })];
    const rand = [E(13, 31, 9, 4.2, null, { pf: 'bevel' })];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0.8 }, { p: stiel, mat: 'eisen', k: 0 }, { p: schale, mat: 'rost', k: 1.4 }, { p: rand, mat: 'eisen', k: 0, tone: 0.1 }],
      details(P) {
        // flüssige Bronze im Löffel: glüht, in der Mitte am hellsten
        for (let y = 29; y <= 33; y++) for (let x = 5; x <= 21; x++) { const q = ((x + 0.5 - 13) / 7.6) ** 2 + ((y + 0.5 - 31) / 2.6) ** 2; if (q > 1) continue; P.set(x, y, q < 0.25 ? 'flammeKern' : q < 0.55 ? 'flammeHell' : q < 0.85 ? 'flamme' : 'glutMittel'); }
        P.glow(13, 31, 9, 0.8, 'glutMittel', 'glutDim');
        // ein Tropfen läuft am Rand herunter
        P.set(4, 34, 'flamme'); P.set(4, 35, 'glutMittel'); P.set(4, 37, 'glutMittel');
        for (let t = 36; t <= 45; t += 3) { const [a, b] = ax.P(t, 0); P.stufe(a, b, -1); }
      },
    };
  },
};
