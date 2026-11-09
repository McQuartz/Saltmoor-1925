// Das Relief (Barmherzige Trennung, Teil 1): eine dunkle Steinplatte, grob gebrochen, darauf zwei erhabene,
// hellere Gestalten (runde Köpfe, schmale Hälse), deren Arme zur Mitte reichen; die Hände stoppen knapp vor dem
// Riss. Der Riss läuft schwarz und breit von oben bis unten. Quer steht eine Wasserlinie, darunter kaltes Blau.
// Kein Text, keine Schrift, keine Gesichter.
'use strict';
module.exports = {
  w: 48, h: 48, st: ['W', 'S'], rar: 'selten',
  form(A) {
    const { Pg, E, C } = A;
    const platte = [Pg([[7, 9], [15, 5], [29, 6], [40, 4], [43, 13], [42, 30], [44, 41], [33, 44], [20, 43], [9, 45], [5, 33], [6, 20]], null, { b: 2.2, rd: 1.2 })];
    // links: Kopf, Hals, Gewand, Arm zur Mitte (Hand bei 21,22)
    const links = [E(14, 13, 3.1, 3.3, null, { pf: 'bevel', hz: 0.5 }), C(14, 15, 14, 18, 1.2, 1.4), Pg([[9, 19], [19, 19], [20, 26], [21, 40], [7, 40], [8, 27]], null, { b: 1.0, rd: 0.8 }), C(18, 20, 21, 23, 1.5, 1.2)];
    // rechts: Kopf, Hals, Gewand, Arm zur Mitte (Hand bei 27,22)
    const rechts = [E(34, 13, 3.1, 3.3, null, { pf: 'bevel', hz: 0.5 }), C(34, 15, 34, 18, 1.2, 1.4), Pg([[29, 19], [39, 19], [40, 27], [41, 40], [27, 40], [28, 26]], null, { b: 1.0, rd: 0.8 }), C(30, 20, 27, 23, 1.5, 1.2)];
    return {
      gruppen: [
        { p: platte, mat: 'stein', k: 0, tone: -0.5 },
        { p: links, mat: 'knochen', k: 0, tone: 0.5 },
        { p: rechts, mat: 'knochen', k: 0, tone: 0.5 },
      ],
      details(P) {
        // Korn nur im Grund
        for (let y = 5; y < 45; y++) for (let x = 5; x < 44; x++) { const i = P.info(x, y); if (!i || i.mat !== 'stein' || i.stufe > 1) continue; if ((x * 73 + y * 151 + x * y * 7) % 19 === 0) P.stufe(x, y, +1); }
        // Schatten unten rechts an den Gestalten (erhaben: Licht oben, Schatten unten): dunkle Kante rechts und unten
        for (let y = 10; y <= 41; y++) for (let x = 6; x <= 42; x++) {
          const i = P.info(x, y); if (!i || i.mat !== 'knochen' || i.stufe < 2) continue;
          const j = P.info(x + 1, y), k = P.info(x, y + 1);
          if (j && j.stufe <= 1 && (x + y) % 2 === 0) P.set(x + 1, y, 'stein0');
          if (k && k.stufe <= 1) P.set(x, y + 1, 'stein0');
        }
        // Gewandfalten: helle Kanten, nur wenige
        for (const [x, y0, y1] of [[12, 27, 38], [16, 28, 38], [32, 28, 38], [36, 28, 38]]) for (let y = y0; y <= y1; y += 1) if (y % 3) P.stufe(x, y, +1);
        // Licht oben links: Kanten der Gestalten, die links oder oben an den Grund grenzen, eine Stufe heller
        for (let y = 8; y <= 41; y++) for (let x = 6; x <= 42; x++) {
          const i = P.info(x, y); if (!i || i.mat !== 'knochen' || i.stufe < 2) continue;
          const l = P.info(x - 1, y), o = P.info(x, y - 1);
          if ((l && l.stufe <= 1) || (o && o.stufe <= 1)) P.set(x, y, 'knochen3');
        }
        // Arme: dunkle Linie unter dem Arm, helle darüber
        P.line(18, 22, 21, 24, 'stein0', true); P.line(30, 22, 27, 24, 'stein0', true);
        P.line(18, 20, 21, 22, 'knochen3', true); P.line(30, 20, 27, 22, 'knochen3', true);
        // Fingerspitzen: je ein heller Punkt
        P.set(21, 23, 'knochenR2'); P.set(27, 23, 'knochenR2');
        // Der Riss: 3 Pixel breit, schwarz, springt in Absätzen, dazu Splitter
        const riss = [[24, 5], [24, 9], [25, 13], [24, 17], [24, 22], [25, 27], [24, 31], [23, 35], [24, 40], [24, 44]];
        for (let i = 1; i < riss.length; i++) { const [a, b] = riss[i - 1], [c, d] = riss[i]; for (const o of [0, 1]) P.line(a + o, b, c + o, d, 'kohle0', true); }
        for (const [x, y] of [[21, 31], [27, 14], [22, 37], [27, 33]]) P.auf(x, y, 'kohle0');
        // Wasserlinie bei y ≈ 32 und darunter kaltes Blau, gedithert
        const wy = x => 32 + Math.sin(x * 0.55) * 0.9 + Math.sin(x * 0.23 + 1) * 0.7;
        for (let y = 28; y < 46; y++) for (let x = 4; x < 45; x++) {
          const i = P.info(x, y); if (!i || i.mat === 'kohle' || i.stufe >= 4) continue; const d = y - wy(x); if (d < 0) continue;
          const v = Math.min(1, 0.35 + d / 12), b = ((x * 5 + y * 3) % 4) / 4;
          if (v > 0.5 + b * 0.5) P.set(x, y, 'a2'); else if (v > 0.25 + b * 0.5) P.set(x, y, 'a1');
        }
        for (let x = 5; x < 44; x++) { const y = Math.round(wy(x)); if (P.get(x, y) && P.info(x, y)?.mat !== 'kohle' && (P.info(x, y)?.stufe ?? 9) < 4) P.set(x, y, x % 3 ? 'a4' : 'aH'); }
        // Riss auch im Wasser nochmals schwarz
        for (let y = 33; y < 44; y++) for (const o of [0, 1]) P.set(24 + o, y, 'kohle0');
      },
    };
  },
};
