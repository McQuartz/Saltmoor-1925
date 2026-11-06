// Abwarten: eine große Hand liegt ruhig über einer offenen Taschenuhr, nur der Daumen zählt am Rand mit.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, armGruppen } = A;
    const uhr = [E(31, 18, 10, 10, null, { pf: 'bevel', hz: 0.3 })];
    const h = hand({ x: 4, y: 12, a: 0.25, s: 1.7, seite: 1, curl: [0.15, 0.15, 0.2, 0.25], spreiz: 0.06, daumen: 0.2, arm: 6 });
    return { gruppen: [{ p: uhr, mat: 'gold', k: 0, tone: 0.05 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let y = 10; y < 28; y++) for (let x = 22; x < 40; x++) { const i = P.info(x, y); if (i && i.mat === 'gold' && Math.hypot(x - 31, y - 18) < 8 && i.stufe < 4) P.set(x, y, 'papier3'); } for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; const x = 31 + Math.cos(a) * 6.5, y = 18 + Math.sin(a) * 6.5; if (P.info(Math.round(x), Math.round(y))?.mat === 'papier') P.set(x, y, 'kohle1'); } P.line(31, 18, 35, 15, 'kohle0', true); P.line(31, 18, 31, 23, 'kohle0', true); P.set(31, 18, 'messing3'); } };
  },
};
