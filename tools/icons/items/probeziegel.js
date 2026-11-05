// Brennprobe: ein kleiner gebrannter Ziegel an einer kurzen Kette, die an einem eisernen Haken hängt (das Ende der
// Stange des Brennmeisters). Der Ziegel glüht von innen; in seiner Mitte der Abdruck, Ringlinien mit einer Narbe.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg, acap, achse, kettenglieder } = A;
    const ax = achse(30, 6, 2.2);
    const haken = [acap(ax, -6, 0, 6, 0, 1.6, 1.4), A.C(34, 10, 31, 15, 1.3, 1.2)];
    const kette = kettenglieder([[30, 13], [28, 18], [26, 23]], 4, 1.5, null);
    const ziegel = [Pg([[10, 25], [32, 21], [38, 33], [16, 38]], null, { b: 2.4, rd: 1.2 })];
    const oben = [Pg([[10, 25], [32, 21], [34, 24], [12, 28]], null, { b: 1, rd: 0.6 })];
    return {
      gruppen: [{ p: haken, mat: 'eisen', k: 0.6 }, { p: [...kette.flach, ...kette.kant], mat: 'eisen', k: 0 }, { p: ziegel, mat: 'rost', k: 0, tone: 0.2 }, { p: oben, mat: 'kupfer', k: 0, tone: 0.35 }],
      details(P) {
        // Glut im Ziegel: Mitte weißgelb, nach außen Orange, die Kanten bleiben Ton
        for (let y = 26; y <= 36; y++) for (let x = 13; x <= 35; x++) {
          const q = ((x + 0.5 - 24) / 8) ** 2 + ((y + 0.5 - 31.5) / 3.6) ** 2; if (q > 1 || !P.info(x, y)) continue;
          if (q < 0.55) P.set(x, y, q < 0.12 ? 'flammeKern' : q < 0.3 ? 'flammeHell' : 'flamme'); else if (q < 0.8 && (x + y) % 2) P.set(x, y, 'glutMittel');
        }
        // Abdruck: Ringlinien dunkler, Narbe quer
        for (const r of [1.6, 3.2]) for (let a = 0; a < 6.28; a += 0.3) { const x = Math.round(24 + Math.cos(a) * r * 1.4), y = Math.round(31 + Math.sin(a) * r * 0.7); if (P.info(x, y)) P.set(x, y, r < 2 ? 'flamme' : 'glutMittel'); }
        P.ritz(19, 33, 29, 29, -1);
        
      },
    };
  },
};
