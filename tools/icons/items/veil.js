// Trauerschleier: ein schwarzer Damenhut schräg von vorn, breite runde Krempe, hoher Kopf mit Stoffblume; von der
// vorderen Krempe hängt ein halbrunder Tüllschleier herab, ein lichtes Netz mit hellem Saum. Durch den Tüll sieht man hindurch.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg } = A;
    const krempe = [E(24, 17, 22, 7, null, { pf: 'bevel', hz: 0.3 })];
    const kopf = [Pg([[13, 15], [15, 4], [33, 4], [35, 15]], null, { b: 1.8, rd: 2 })];
    const blume = [E(32, 7, 4, 3.4, null, { pf: 'bevel', hz: 0.5 })];
    const schleier = [Pg([[6, 19], [42, 19], [41, 32], [34, 40], [24, 43], [14, 40], [7, 32]], null, { b: 1, rd: 1 })];
    return {
      gruppen: [{ p: schleier, mat: 'tuch', k: 0, tone: 0.1 }, { p: krempe, mat: 'tuch', k: 0, tone: 0.18 }, { p: kopf, mat: 'tuch', k: 0, tone: 0.2 }, { p: blume, mat: 'tuch', k: 0, tone: 0.3 }],
      details(P) {
        for (let y = 21; y < 44; y++) for (let x = 6; x < 43; x++) { const i = P.info(x, y); if (!i || i.mat !== 'tuch' || i.stufe >= 4) continue; let rand = false; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!P.get(x + dx, y + dy)) rand = true; if (rand) continue; P.set(x, y, (x + y) % 4 === 0 || (x - y + 100) % 4 === 0 ? 'tuchR1' : 'tuch0'); }
        for (let x = 8; x < 41; x++) for (let y = 30; y < 44; y++) { if (P.info(x, y) && !P.get(x, y + 1)) { P.set(x, y, x % 2 ? 'tuchR1' : 'a2'); break; } }
        P.ritz(14, 13, 34, 13, -2); P.set(32, 6, 'a3'); P.set(31, 7, 'a2');
      },
    };
  },
};
