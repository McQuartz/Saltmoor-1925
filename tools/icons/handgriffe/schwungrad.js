// Schwungrad: eine Hand stößt ein großes Speichenrad an der Speiche an; dann dreht es sich allein.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, ring, C, E, armGruppen } = A;
    const rad = ring(20, 17, 14, 14, 1.8, null, {}, 24);
    const speichen = [0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2 + 0.2; return C(20, 17, 20 + Math.cos(a) * 13, 17 + Math.sin(a) * 13, 1, 1); });
    const nabe = [E(20, 17, 3, 3, null, { pf: 'bevel', hz: 0.5 })];
    const f = faust({ x: 40, y: 30, a: -2.3, s: 1.2, seite: 1, arm: 8 });
    return { gruppen: [{ p: [...rad, ...speichen], mat: 'eisen', k: 0 }, { p: nabe, mat: 'eisen', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(20, 17, 'a3'); for (let a = -0.6; a < 0.6; a += 0.12) P.set(20 + Math.cos(a) * 17, 17 + Math.sin(a) * 16.5, 'a1'); } };
  },
};
