// Wächter Schwarzes Eis: Der Chor im Eis. Ein schiefer Klumpen Eis mit Zacken obenauf,
// darin viele runde Köpfe, die gemeinsam atmen; die Münder öffnen sich gleichzeitig.
'use strict';
module.exports = {
  id: 'chor', biom: 'eis', zone: 'eis', rang: 'waechter', w: 128, h: 160, fuss: [64, 155], kopf: [62, 26], rimBis: 154,
  varianten: { chor: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 0 }), f = p.f;
    const atem = p.idle ? [0, 1, 2, 1][f] : p.angriff ? [2, 3, 1, 0][f] : 0;
    const lean = P0.lean, sinken = p.tod ? r(p.q * 30) : 0;
    const klumpen = Pg([[18, 154], [14, 118], [22, 84], [36, 60 - atem], [52, 44 - atem], [74, 42 - atem], [96, 54 - atem], [110, 80], [116, 116], [112, 154]].map(([x, y]) => [x + lean * (1 - y / 160), y + sinken * (1 - y / 160)]), null, { rd: 3 });
    const zacken = [[40, 58, -0.5, 18], [56, 44, -0.15, 24], [72, 42, 0.2, 20], [90, 50, 0.55, 22], [104, 72, 0.9, 14]].map(([x, y, a, l]) => { const yy = y - atem + sinken * 0.7, xx = x + lean; const tx = xx + Math.sin(a) * l, ty = yy - Math.cos(a) * l; return Pg([[xx - 5, yy + 4], [tx, ty], [xx + 5, yy + 4]], null, { rd: 0.4 }); });
    // Köpfe: Positionen im Klumpen, unterschiedlich groß, einige verdreht
    const K = [[40, 92, 8], [62, 78, 9], [86, 90, 8], [50, 118, 7.5], [76, 116, 8.5], [98, 120, 6.5], [30, 128, 6], [64, 140, 7], [70, 58, 6]];
    const koepfe = K.map(([x, y, rr], i) => E(x + lean * (1 - y / 160), y - (i % 3 === 0 ? atem : 0) + sinken * (1 - y / 160), rr, rr * 1.05, 'haut', { pf: 'bevel' }));
    const gruppen = [
      { p: zacken, k: 0, pf: 'flat' },
      { p: [klumpen], k: 0, pf: 'bevel', tone: 0.1 },
      ...koepfe.map(k => ({ p: [k], k: 0, tone: -0.1 })),
    ];
    const augen = [];
    const details = P => {
      // Eisrisse
      for (const [x0, y0, x1, y1] of [[26, 100, 36, 112], [100, 96, 108, 108], [58, 100, 66, 104], [88, 136, 96, 146]]) P.line(x0 + lean, y0, x1 + lean, y1, 'r1', true);
      koepfe.forEach((k, i) => {
        const x = r(k.x), y = r(k.y), offen = 1 + (atem > 1 ? 1 : 0) + (p.angriff && f === 2 ? 1 : 0);
        P.el(x + 0.5, y + 3.5, 1.5, offen, 'k0', true);
        if (P0.aus) return;
        if (i % 3 !== 1) { P.set(x - 3, y - 1, i % 2 ? 'glut' : 'kern'); P.set(x + 2, y - 1, 'glut'); augen.push([x - 3, y - 1]); }
        else { P.line(x - 4, y - 1, x - 2, y - 1, 'k0', true); P.line(x + 1, y - 1, x + 3, y - 1, 'k0', true); }
      });
      if (!P0.aus) P.glow(64, 96, 40, 0.35, 'glutDim', 'k3');
    };
    return { gruppen, details, augen };
  },
};
