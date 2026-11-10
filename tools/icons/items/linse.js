// Linse: eine große Handlupe, schräg im Gegenlicht, Griff unten links aus Holz, der Messingring oben rechts.
// Im Glas steht ein einzelner heller Brennpunkt, und von der Linse läuft ein enger Lichtkegel nach rechts unten
// auf einen Punkt zu, an dem nichts liegt, der aber zu hell ist.
'use strict';
module.exports = {
  form(A) {
    const { E, C, ring } = A;
    const griff = [C(21, 27, 7, 42, 2.4, 3.2)];
    const zwinge = [C(24, 24, 19, 29, 3.2, 3.2)];
    const rahmen = ring(30, 18, 12.5, 12.5, 2.3, null, {}, 28);
    const glas = [E(30, 18, 12, 12, null, { pf: 'bevel', hz: 0.3 })];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0 }, { p: glas, mat: 'glas', k: 0, tone: 0.1 }, { p: [...rahmen, ...zwinge], mat: 'messing', k: 0 }],
      details(P) {
        // Lichtkegel nach rechts unten, gedithert: zwei Kanten, dazwischen Dither, Spitze mit Funken
        const px = 44, py = 42;
        for (let t = 0; t <= 1; t += 0.02) {
          const ax = 37 + (px - 37) * t, ay = 27 + (py - 27) * t, bx = 40 + (px - 40) * t, by = 24.5 + (py - 24.5) * t;
          const n = Math.ceil(Math.hypot(bx - ax, by - ay));
          for (let k = 0; k <= n; k++) { const q = k / (n || 1), x = ax + (bx - ax) * q, y = ay + (by - ay) * q; const d = (Math.round(x) + Math.round(y)) % 2; if (!P.get(Math.round(x), Math.round(y))) P.set(x, y, k === 0 || k === n ? 'a3' : (d && t > 0.1 ? 'a2' : 'a1')); }
        }
        P.set(px, py, 'a5'); P.set(px - 1, py, 'a4'); P.set(px + 1, py, 'a4'); P.set(px, py - 1, 'a4'); P.set(px, py + 1, 'a4'); P.set(px - 2, py, 'a2'); P.set(px, py - 2, 'a2');
        // Glas: dunkel, dazu flache Ringe aus Licht und der Brennpunkt mit vier Strahlen
        for (let y = 5; y < 32; y++) for (let x = 17; x < 44; x++) { const d = Math.hypot(x + 0.5 - 30, y + 0.5 - 18); const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4) continue; if (d > 7 && d < 8.2 && (x + y) % 2) P.set(x, y, 'a1'); else if (d < 7) P.set(x, y, d < 2.6 ? 'a4' : d < 4.5 ? ((x + y) % 2 ? 'a3' : 'a2') : 'a1'); }
        P.el(30, 18, 1.4, 1.4, 'a5'); P.line(30, 11, 30, 25, 'a3', true); P.line(23, 18, 37, 18, 'a3', true);
        P.set(30, 12, 'a4'); P.set(30, 24, 'a4'); P.set(24, 18, 'a4'); P.set(36, 18, 'a4');
        // Glanz am Glas, oben rechts
        P.set(37, 11, 'glasR2'); P.set(38, 12, 'glasR2'); P.set(39, 14, 'glasR2');
        // Wicklung am Griff
        for (let t = 0.25; t < 0.8; t += 0.12) { const x = 21 + (7 - 21) * t, y = 27 + (42 - 27) * t; P.stufe(x, y, -2); P.stufe(x + 1, y, -1); }
      },
    };
  },
};
