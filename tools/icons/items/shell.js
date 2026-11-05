// Seltsame Muschel: ein großes Schneckenhaus von der Seite, die Windung als deutliche Spirale, die gegen den
// Uhrzeigersinn läuft (falsch herum); unten links die weite Öffnung wie ein Ohr, in der es schwach leuchtet.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg } = A;
    const haus = [E(26, 22, 17, 16, null, { pf: 'bevel', hz: 0.35 })];
    const lippe = [Pg([[9, 26], [14, 40], [24, 45], [30, 40], [26, 33], [17, 28]], null, { b: 1.6, rd: 1.2 })];
    return {
      gruppen: [{ p: haus, mat: 'perlmutt', k: 0, tone: 0.05 }, { p: lippe, mat: 'perlmutt', k: 0, tone: 0.15 }],
      details(P) {
        // Spirale von außen nach innen, gegen den Uhrzeigersinn
        let px = null; for (let a = 0; a < 16; a += 0.05) { const r = 15 * Math.exp(-a * 0.16); const x = 27 - Math.cos(a + 2.4) * r, y = 22 - Math.sin(a + 2.4) * r * 0.95; if (P.info(Math.round(x), Math.round(y))) { P.stufe(x, y, -2); P.stufe(x + 1, y + 1, +1); } px = [x, y]; }
        P.el(18, 36, 3.5, 5, 'perlmutt0', true); P.glow(18, 37, 5, 1.1, 'a2', 'a1'); P.set(18, 37, 'a3');
        void px;
      },
    };
  },
};
