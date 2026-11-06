// Ballaststein der Henriette: ein länglicher, glatt gewaschener Feldstein liegt schräg, einmal um die Mitte mit
// geteertem Tau umwickelt; oben ein Knoten, das lose Ende hängt rechts über den Rand herab. Auf dem Rücken des Steins
// zum Licht hin eine Kruste aus grobem Salz, quer eine helle Quarzader.
'use strict';
module.exports = {
  form(A) {
    const { achse, E, kurve } = A;
    const ax = achse(22, 30, -0.42);
    const [sx, sy] = ax.P(0, 0);
    const stein = [E(sx, sy, 19, 12.5, null, { pf: 'dome' })];
    // Tau als Band quer über den Stein (leicht gewölbt), Schlaufe oben rechts
    const band = kurve([ax.P(4, -12.5), ax.P(7, -4), ax.P(7, 5), ax.P(4, 12.5)], 1.7, 1.7, null, { cr: true }, 12);
    const [bx, by] = ax.P(5.5, -12);
    const schlaufe = [E(bx + 0.5, by + 1, 2.6, 2.2, null, { pf: 'bevel' }), ...kurve([[bx + 2, by], [bx + 8, by + 1], [bx + 13, by + 6], [bx + 15, by + 13]], 1.2, 0.9, null, { cr: true }, 10)];
    return {
      gruppen: [{ p: stein, mat: 'stein', k: 0, tone: 0.18 }, { p: [...band, ...schlaufe], mat: 'leder', k: 0 }],
      details(P) {
        for (let i = 1; i < 20; i += 2) { const [x, y] = band.B(i / 20); P.stufe(x, y, -1); }
        // weiße Quarzader quer über den Stein
        for (let t = -16; t < 0; t++) { const [x, y] = ax.P(t, Math.sin(t * 0.4) * 1.2 + t * 0.15); P.auf(x, y, (t & 3) ? 'stein3' : 'steinR1'); }
        // Salzkruste: grobe Körner auf dem oberen Rand des Steins rechts vom Tau
        for (let y = 16; y < 30; y++) for (let x = 27; x < 42; x++) { const i = P.info(x, y); if (!i || i.mat !== 'stein') continue; const oben = ((x - sx) / 19) ** 2 + ((y - sy) / 12.5) ** 2; if (oben < 0.55) continue; const h = (x * 5 + y * 3) % 5; if (h < 2) P.set(x, y, 'aH'); else if (h < 3) P.set(x, y, 'aG'); else if (h < 4 && oben > 0.75) P.set(x, y, 'a3'); }
        for (const [t, q] of [[-10, 6], [-3, 8], [13, 5], [-12, -3]]) P.stufe(...ax.P(t, q), -1);
      },
    };
  },
};
