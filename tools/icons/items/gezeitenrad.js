// Das Gezeitenrad: ein großes Zahnrad aus grüner Bronze, schräg gedreht, mit zu vielen Zähnen:
// eine zweite Zahnreihe sitzt versetzt darüber, wo keine mehr Platz hätte. Speichen, Nabe.
'use strict';
module.exports = {
  form(A) {
    const { zahnrad, E, C } = A;
    const rad1 = [zahnrad(24, 24, 15, 18, 3)];
    const rad2 = [zahnrad(24, 24, 13, 22, 2.4)];
    const nabe = [E(24, 24, 4, 4, null, { pf: 'bevel', hz: 0.5 })];
    const speichen = [0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2 + 0.3; return C(24, 24, 24 + Math.cos(a) * 11, 24 + Math.sin(a) * 11, 1.6, 1.3); });
    return {
      gruppen: [{ p: rad1, mat: 'kupfer', k: 0 }, { p: rad2, mat: 'akzent', k: 0, tone: 0.15 }, { p: speichen, mat: 'kupfer', k: 0 }, { p: nabe, mat: 'kupfer', k: 0 }],
      details(P) {
        for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { const r = Math.hypot(x + 0.5 - 24, y + 0.5 - 24); const i = P.info(x, y); if (i && i.mat === 'akzent' && r < 10.5 && i.stufe < 4) { let an = false; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.3; const d = Math.abs((x + 0.5 - 24) * Math.sin(a) - (y + 0.5 - 24) * Math.cos(a)); if (d < 1.8 && (x - 24) * Math.cos(a) + (y - 24) * Math.sin(a) > 0) an = true; } if (!an && r > 4) P.loesch(x, y); } }
        P.set(24, 24, 'kohle0'); P.set(22, 22, 'a4');
      },
    };
  },
};
