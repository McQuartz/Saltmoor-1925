// Der gebrannte Finger: ein linker Ringfinger aus gebranntem Ton, schräg liegend und leicht gekrümmt, drei Glieder
// mit Falten an den Gelenken, der Nagel blass. Auf der Kuppe der Abdruck mit der Narbe quer über den Linien.
// An der Bruchstelle glüht es noch. Er ist warm.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg } = A;
    // Gelenkpunkte: Bruch unten links, dann leicht nach unten gekrümmt zur Kuppe oben rechts
    const p0 = [8, 38], p1 = [18, 29], p2 = [27, 19], p3 = [35, 13], kp = [39, 12];
    const glieder = [C(...p0, ...p1, 5, 4.6), C(...p1, ...p2, 4.6, 4.1), C(...p2, ...p3, 4.1, 3.7), C(...p3, ...kp, 3.7, 3.4)];
    const knoechel = [E(...p1, 5.2, 4.6, null, { pf: 'bevel' }), E(...p2, 4.6, 4.2, null, { pf: 'bevel' })];
    const nagel = [Pg([[34, 9], [40, 7], [43, 10], [37, 12]], null, { b: 0.8, rd: 0.6 })];
    const bruch = [E(7, 39, 4.4, 4.4, null, { pf: 'bevel' })];
    return {
      gruppen: [{ p: [...glieder, ...knoechel], mat: 'rost', k: 1.6, tone: 0.3 }, { p: nagel, mat: 'knochen', k: 0, tone: 0.1 }, { p: bruch, mat: 'kohle', k: 0, ohneRand: true }],
      details(P) {
        // Gelenkfalten quer
        for (const [x, y] of [p1, p2]) { P.ritz(x - 2, y - 3, x + 3, y + 2, -2); P.ritz(x - 1, y - 4, x + 4, y + 1, +1); }
        // Abdruck auf der Kuppe, Ringlinien und die Narbe
        for (const r of [1, 2.2]) for (let a = 0; a < 6.28; a += 0.45) { const x = Math.round(38 + Math.cos(a) * r), y = Math.round(15 + Math.sin(a) * r * 0.8); if (P.info(x, y)) P.stufe(x, y, -1); }
        P.ritz(35, 16, 40, 13, +1);
        // an der Bruchstelle glüht es noch
        P.glow(7, 39, 5, 0.9, 'glutMittel', 'glutDim'); P.set(7, 39, 'flammeHell'); P.set(8, 39, 'flamme'); P.set(7, 40, 'flamme');
      },
    };
  },
};
