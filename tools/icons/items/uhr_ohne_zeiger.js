// Uhr ohne Zeiger: ein Emaille-Zifferblatt ohne Gehäuse, an einer Öse aufgehängt; ein großer Keil ist
// herausgebrochen (die fehlende Stunde), in der Mitte steht nur der leere Zapfen. Sie gibt dir Zeit und nimmt sie.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C, ring } = A;
    const pts = []; for (let a = -0.15; a <= Math.PI * 2 - 1.15; a += 0.12) pts.push([24 + Math.cos(a) * 18, 26 + Math.sin(a) * 18]);
    const blatt = [Pg([[24, 26], ...pts], null, { b: 1.6, rd: 0.4 })];
    const oese = ring(24, 5, 2.6, 2.6, 0.9, null, {}, 10);
    const zapfen = [C(24, 26, 24, 26, 1.6, 1.6)];
    return {
      gruppen: [{ p: oese, mat: 'messing', k: 0 }, { p: blatt, mat: 'papier', k: 0 }, { p: zapfen, mat: 'messing', k: 0 }],
      details(P) {
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; if (a > -1.2 + Math.PI * 2 - 1.15 - Math.PI * 2 && a < -0.2 && false) continue; const x0 = 24 + Math.cos(a) * 15.5, y0 = 26 + Math.sin(a) * 15.5; if (!P.info(Math.round(x0), Math.round(y0))) continue; P.line(x0, y0, 24 + Math.cos(a) * 13, 26 + Math.sin(a) * 13, 'kohle1', true); }
        P.ritz(24, 26, 11, 15, -1); P.set(24, 25, 'a3');
      },
    };
  },
};
