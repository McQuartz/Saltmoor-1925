// Fährgeld: zwei abgegriffene Silbergroschen, wie man sie Toten auf die Lider legt. Einer liegt flach (man sieht
// seine Kante), der andere lehnt hochkant daran. Beide mit Perlrand, auf dem stehenden ein blank geriebenes Profil.
// Darüber ein bleicher Schimmer.
'use strict';
module.exports = {
  form(A) {
    const { E } = A;
    const kante = [E(18, 39, 14, 6.5, null, { pf: 'bevel', hz: 0.3 })];
    const liegend = [E(18, 36.5, 14, 6.5, null, { pf: 'bevel', hz: 0.5 })];
    const stehendKante = [E(31, 22, 11, 13.5, null, { pf: 'bevel', hz: 0.3 })];
    const stehend = [E(29.5, 22, 10.5, 13, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: kante, mat: 'silber', k: 0, tone: -0.25 }, { p: liegend, mat: 'silber', k: 0, tone: 0.06 }, { p: stehendKante, mat: 'silber', k: 0, tone: -0.2 }, { p: stehend, mat: 'silber', k: 0, tone: 0.1 }],
      details(P) {
        // Perlränder: ein Ring heller und dunkler Punkte knapp innerhalb der Kante
        for (let a = 0; a < 30; a++) { const w = a / 30 * Math.PI * 2; P.stufe(29.5 + Math.cos(w) * 8.6, 22 + Math.sin(w) * 10.8, a % 2 ? -2 : 1); }
        for (let a = 0; a < 26; a++) { const w = a / 26 * Math.PI * 2; P.stufe(18 + Math.cos(w) * 11.5, 36.5 + Math.sin(w) * 4.8, a % 2 ? -2 : 1); }
        // Profil nach links: Stirn, Nase, Mund, Kinn, Hals
        for (const [x, y] of [[29, 15], [28, 16], [27, 17], [27, 18], [26, 19], [25, 20], [26, 21], [27, 22], [26, 23], [27, 24], [28, 25], [28, 26], [29, 27], [30, 28]]) P.set(x, y, 'silber0');
        for (let y = 15; y < 29; y++) for (let x = 28; x < 34; x++) { const i = P.info(x, y); if (i && i.mat === 'silber' && x > 27 + Math.abs(y - 21) * 0.3 && (x + y) % 2) P.stufe(x, y, 1); }
        // Kreuz auf dem liegenden Groschen, bleicher Schimmer
        P.ritz(18, 34, 18, 39, -2); P.ritz(15, 36.5, 21, 36.5, -2);
        for (const [x, y, c] of [[40, 6, 'aG'], [43, 9, 'a3'], [37, 3, 'a3'], [44, 4, 'aH'], [41, 12, 'a2']]) P.set(x, y, c);
      },
    };
  },
};
