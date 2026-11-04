// Wächter Moorwald: Der Opfernde. Ein Haufen kantiger Steine mit einer Kerbe,
// aus der ein langer, menschlicher Arm wächst. In der Kerbe glimmt es.
'use strict';
module.exports = {
  id: 'opfernde', biom: 'moor', zone: 'moor', rang: 'waechter', w: 128, h: 160, fuss: [70, 155], kopf: [72, 50], rimBis: 154,
  varianten: { opfernde: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 2, fall: 6 }), f = p.f;
    const T = P0.atem;
    // Steine: hinten -> vorne, jeder eigene Gruppe (Kontaktschatten an den Fugen)
    const st = (pts, dx = 0, dy = 0) => Pg(pts.map(([x, y]) => [x + dx, y + dy]), null, { rd: 1.5 });
    const fallen = p.tod ? r(p.q * 14) : 0;
    const steine = [
      st([[54, 92], [72, 70], [96, 74], [104, 100], [80, 108]], 0, fallen),
      st([[86, 64], [100, 52], [114, 62], [112, 96], [96, 98]], fallen ? 4 : 0, fallen * 1.4),
      st([[44, 118], [56, 96], [82, 100], [90, 124], [62, 132]], 0, fallen * 0.5),
      st([[84, 104], [106, 98], [120, 118], [116, 146], [92, 148]], 0, fallen * 0.3),
      st([[34, 152], [40, 128], [62, 126], [74, 140], [70, 154]]),
      st([[66, 154], [72, 132], [94, 136], [104, 154]]),
      st([[96, 154], [104, 140], [122, 144], [124, 155]]),
    ];
    // Arm aus der Kerbe zwischen Stein 0 und 1: lang, glatt, menschlich
    const greif = p.angriff ? [[0.2, 0], [-0.3, -6], [-0.75, -14], [-0.35, -6]][f] : p.treffer ? [0.25, 2] : p.idle ? [[0, 0], [0.04, 0], [0.06, 1], [0.03, 0]][f] : [0.4 + p.q, 0];
    const sx = 84, sy = 76 + T + fallen;
    const a1 = -Math.PI * 0.8 + greif[0], a2 = Math.PI * 0.55 + greif[0] * 1.6;
    const ell = [sx + Math.cos(a1) * 34, sy + Math.sin(a1) * 34];
    const hand = [ell[0] + Math.cos(a2) * 40 + greif[1], ell[1] + Math.sin(a2) * 40];
    const arm = p.tod && f >= 4 ? [] : glied([[sx, sy], ell, hand], 4, 2.2, 'haut');
    const finger = [];
    if (arm.length) for (let i = 0; i < 4; i++) { const fa = a2 + 0.5 - i * 0.35 - (p.angriff && f === 2 ? 0.6 : 0); finger.push(...glied([hand, [hand[0] + Math.cos(fa) * 7, hand[1] + Math.sin(fa) * 7], [hand[0] + Math.cos(fa + 0.6) * 12, hand[1] + Math.sin(fa + 0.6) * 12]], 1.1, 0.6, 'haut')); }
    const gruppen = [
      ...steine.slice(0, 2).map(s => ({ p: [s], k: 0, pf: 'bevel' })),
      { p: arm, k: 1 },
      { p: finger, k: 0 },
      ...steine.slice(2).map(s => ({ p: [s], k: 0, pf: 'bevel' })),
    ];
    const augen = [];
    const details = P => {
      // Kerbe: dunkler Spalt mit Glut darin
      P.line(76, 72 + fallen, 92, 98 + fallen, 'k0', true); P.line(77, 72 + fallen, 93, 98 + fallen, 'k0', true);
      if (!P0.aus) { P.glow(86, 86 + fallen, 10, 0.9, 'glutDim', 'k3'); P.set(85, 84 + fallen, 'kern'); P.set(88, 88 + fallen, 'glut'); augen.push([85, 84 + fallen], [88, 88 + fallen]); }
      // eingeritzte Zeichen auf den Steinen
      for (const [x, y] of [[60, 140], [100, 118], [64, 110]]) { P.auf(x, y, 'r1'); P.auf(x + 1, y + 1, 'r1'); P.auf(x - 1, y + 1, 'r1'); P.auf(x, y + 2, 'r1'); }
    };
    return { gruppen, details, augen };
  },
};
