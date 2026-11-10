// Die Aussage (Barmherzige Trennung, Teil 3): ein ruhiges, kühl graues Blatt mit klaren dunklen Protokollzeilen,
// unten links ein großer Daumenabdruck in Teer (schwarz, mit zwei hellen Glanzpixeln), rechts daneben eine dicke
// Schlaufe aus gedrehtem Tau mit Knoten, halb über den Blattrand gelegt. Kein lesbarer Text.
'use strict';
module.exports = {
  w: 48, h: 48, st: ['S', 'E'], rar: 'selten',
  form(A) {
    const { Pg, ring, E, C } = A;
    const blatt = [Pg([[5, 6], [27, 4], [32, 6], [33, 41], [27, 44], [6, 43], [4, 25]], null, { b: 1.0, rd: 0.4 })];
    // Schlaufe: Ring mit Knoten unten und zwei Enden, dickes Tau (r 2.4)
    const tau = [...ring(38, 22, 6.5, 8, 2.4, null, {}, 22), E(36, 31, 3.8, 3.2, null, { pf: 'bevel', hz: 0.5 }), C(35, 33, 29, 41, 2.1, 1.8), C(37, 33, 41, 42, 2.1, 1.8)];
    return {
      gruppen: [{ p: blatt, mat: 'stein', k: 0, tone: 0.2 }, { p: tau, mat: 'wolle', k: 0, tone: 0.3 }],
      details(P) {
        // Papier: ruhig, hellste Körperstufe, nur ein paar Stockpunkte
        for (let y = 4; y < 45; y++) for (let x = 4; x < 34; x++) { const i = P.info(x, y); if (!i || i.mat !== 'stein' || i.stufe >= 4) continue; P.set(x, y, 'stein3'); if ((x * 31 + y * 17) % 29 === 0) P.set(x, y, 'stein2'); }
        // Kopfzeile dick, dann klare Zeilen mit Wortlücken, links Nummern
        for (let x = 8; x <= 24; x++) { P.auf(x, 8, 'kohle1'); P.auf(x, 9, 'kohle1'); }
        for (let y = 13, k = 0; y <= 27; y += 3, k++) {
          P.auf(8, y, 'kohle1'); P.auf(9, y, 'kohle1');
          const e = 28 - (k % 3) * 3;
          for (let x = 12; x <= e; x++) if (!((x - 12 + k * 3) % 8 === 7)) P.auf(x, y, 'kohle1');
        }
        // Daumenabdruck: großes schwarzes Oval, Rillen als Bögen in kohle1, zwei helle Glanzpunkte
        const px = 14, py = 35, rx = 7, ry = 8;
        for (let y = Math.floor(py - ry); y <= py + ry; y++) for (let x = Math.floor(px - rx); x <= px + rx; x++) {
          const i = P.info(x, y); if (!i || i.mat !== 'stein') continue;
          const d = Math.hypot((x + 0.5 - px) / rx, (y + 0.5 - py) / ry); if (d > 1) continue;
          const dd = Math.hypot((x + 0.5 - px + 1.5) / rx, (y + 0.5 - py + 2) / ry) * 8;
          P.set(x, y, Math.floor(dd) % 2 === 0 && d < 0.9 ? 'kohle1' : 'kohle0');
        }
        P.set(11, 31, 'kohleR2'); P.set(12, 30, 'kohleR2');
        // Tau: Drehung als schräge helle und dunkle Abschnitte entlang des Rings, Knoten dunkler
        for (let y = 10; y < 44; y++) for (let x = 29; x < 47; x++) {
          const i = P.info(x, y); if (!i || i.mat !== 'wolle' || i.stufe >= 4) continue;
          P.set(x, y, ((x + y) >> 1) % 2 === 0 ? 'wolle3' : 'wolle1');
        }
        for (const [x, y] of [[34, 30], [35, 32], [37, 30], [38, 32]]) P.set(x, y, 'wolle0');
        P.set(40, 15, 'wolleR2'); P.set(41, 16, 'wolleR2');
      },
    };
  },
};
