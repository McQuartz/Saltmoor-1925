// Heuerbeutel eines Ertrunkenen: eine Bügelbörse aus nassem Leder, oben der Messingbügel mit zwei Kugeln als
// Schloss. Der Boden ist dunkel vom Wasser, unten hängen Tropfen, die nicht aufhören.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve, E } = A;
    const beutel = [Pg([[9, 21], [39, 21], [43, 32], [38, 43], [24, 46], [10, 43], [5, 32]], null, { b: 3, rd: 2 })];
    const buegel = kurve([[8, 22], [16, 16.5], [32, 16.5], [40, 22]], 1.6, 1.6, null, {}, 14);
    const kugeln = [E(21.5, 14, 2.1, 2.1, null, { pf: 'dome' }), E(26.5, 14, 2.1, 2.1, null, { pf: 'dome' })];
    const schlaufe = kurve([[40, 22], [45, 14], [42, 8]], 0.9, 0.8, null, {}, 8);
    return {
      gruppen: [{ p: schlaufe, mat: 'leder', k: 0 }, { p: beutel, mat: 'leder', k: 0, tone: 0.06 }, { p: buegel, mat: 'messing', k: 0 }, { p: kugeln, mat: 'messing', k: 0, tone: 0.1 }],
      details(P) {
        // nasser Boden: untere Hälfte eine Stufe dunkler, Glanzlinie in Wasserfarbe
        for (let y = 36; y < 47; y++) for (let x = 5; x < 44; x++) { const i = P.info(x, y); if (i && i.mat === 'leder' && i.stufe < 4 && (y > 39 || (x + y) % 2)) P.stufe(x, y, -1); }
        for (let x = 13; x < 36; x += 2) P.auf(x, 36 + Math.sin(x * 0.7), 'a2');
        // Naht unter dem Bügel, Tropfen
        for (let x = 11; x < 38; x += 3) P.stufe(x, 24 + Math.abs(x - 24) * 0.05, -1);
        P.tropfen(20, 47, 'a2', 'a3'); P.tropfen(30, 46, 'a2', 'a3'); P.set(25, 47, 'a1');
      },
    };
  },
};
