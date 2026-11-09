// Das Zeichen: ein Brett aus nassem, vom Wasser geglättetem Holz, in das sich ein Muster gedrückt hat, das
// niemand geschnitten hat: Wellenlinien oben und unten, in der Mitte ein Auge, dessen Lider und Iris sich wie
// ein Gezeitenstrudel zur Mitte hin schließen. Aus dem Muster scheint kaltes Grün-Blau von unten (Gegenlicht
// der Tiefe), das Holz darum bleibt dunkel. Kein Text, keine Schrift, kein Gesicht.
'use strict';
module.exports = {
  w: 48, h: 48, st: ['W', 'V'],
  form(A) {
    const { Pg } = A;
    // unregelmäßiges, vom Wasser rund geschliffenes Brett (Treibholz), leicht gekippt
    const brett = [Pg([[8, 14], [15, 7], [27, 5], [37, 8], [42, 16], [43, 29], [39, 39], [31, 43], [18, 43], [10, 38], [5, 27]], null, { b: 2.4, rd: 4 })];
    return {
      gruppen: [{ p: brett, mat: 'holz', k: 0, tone: 0.0 }],
      details(P) {
        const cx = 24, cy = 25;
        // Maserung: lange, leicht gekrümmte dunkle Fasern, vom Wasser weich gefressen
        for (let k = 0; k < 9; k++) {
          const y0 = 8 + k * 4.2;
          for (let x = 5; x <= 43; x++) { const y = y0 + Math.sin(x * 0.21 + k * 1.7) * 1.4 + (x - 24) * 0.04; if ((x * 7 + k * 13) % 5 < 3) P.stufe(x, y, -1); }
        }
        // Gegenlicht aus der Tiefe: kaltes Blau-Grün steigt von unten ins Holz, oben bleibt es dunkel
        P.glow(cx, 52, 26, 1.9, 'a2', 'a1');
        P.glow(cx, 50, 14, 1.6, 'a3', 'a2');
        // Wellenlinien oben (zwei) und unten (zwei), in das Holz gedrückt: Rinne dunkel, Grund hell
        const welle = (y, amp, ph, c, c2) => {
          for (let x = 11; x <= 37; x++) {
            const f = 1 - Math.pow(Math.abs(x - cx) / 14, 3) * 0.6;
            const yy = y + Math.sin(x * 0.55 + ph) * amp * f;
            P.auf(x, yy, c); P.auf(x, yy + 1, c2);
          }
        };
        welle(12, 1.4, 0, 'b3', 'b0'); welle(16, 1.2, 1.1, 'b2', 'b0');
        welle(34, 1.2, 2.2, 'b3', 'b0'); welle(38, 1.4, 0.7, 'b2', 'b0');
        // Auge: Mandel aus zwei Bögen
        const lid = (sign) => { for (let x = 10; x <= 38; x++) { const t = (x - cx) / 14; const h = 8 * (1 - t * t); if (h < 0) continue; P.auf(x, cy + sign * h, 'bG'); P.auf(x, cy + sign * (h + 1), 'b1'); } };
        lid(-1); lid(1);
        // Iris als Strudel: eine Spirale, die sich nach innen zusammenzieht und in einem Punkt schließt
        const sp = [];
        for (let i = 0; i <= 80; i++) { const a = i * 0.2, r = 7.4 * (1 - i / 84); sp.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.95]); }
        for (let i = 1; i < sp.length; i++) {
          const t = i / sp.length; const c = t > 0.8 ? 'bH' : t > 0.45 ? 'bG' : 'b4';
          P.auf(sp[i][0], sp[i][1], c);
        }
        // Pupille: der Punkt, in dem sich der Strudel schließt, hell wie Licht von unten
        P.set(cx, cy, 'bH'); P.set(cx + 1, cy, 'bG'); P.set(cx, cy + 1, 'b4');
        // Gischt: einzelne helle Tropfen am Rand des Musters
        [[12, 22], [36, 28], [15, 29], [33, 21]].forEach(([x, y], i) => P.auf(x, y, i % 2 ? 'aH' : 'bH'));
      },
    };
  },
};
