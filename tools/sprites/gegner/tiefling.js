// Tiefling (Hafen). Junger Fischer mit dem Erbe des Großvaters: zu breiter Kopf,
// Augen zu groß und zu weit seitlich, Kiemenfalten am Hals, Hände bis zu den Knien.
'use strict';
module.exports = {
  id: 'tiefling', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [48, 115], kopf: [48, 28],
  varianten: {
    tiefling_a: { kb: 10, auge: 3, arm: 1, muetze: true },
    tiefling_b: { kb: 11.5, auge: 3.5, arm: 1.12, muetze: false, krumm: 2 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 5, fall: 22 }), f = p.f;
    const K = v.krumm || 0, lean = P0.lean, T = P0.atem + P0.fall;
    const kiemen = p.idle ? [0, 1, 1, 0][f] : p.angriff ? 1 : 0, maul = p.angriff ? [0, 1, 2, 1][f] : 0;
    const hx = 48 + lean - K, hy = 42 + T + K;
    const beine = [C(44, 90, 42 + (P0.fall ? -3 : 0), 113, 3.6, 2.6, null), C(53, 90, 56, 113, 3.4, 2.4, null), E(41, 113, 4, 1.8, null), E(57, 113, 4, 1.8, null)];
    const rumpf = Pg([[38 + lean - K, 56 + T + K], [59 + lean - K, 55 + T + K], [62 + lean / 2, 76 + T / 2], [61, 93], [36, 93], [36 + lean / 2, 76 + T / 2]], null, { rd: 2 });
    const hals = C(hx, hy + 4, 48 + lean - K, 57 + T + K, 4.5, 5.5, 'haut');
    const kopf = E(hx, hy, v.kb, 7, 'haut', { pf: 'bevel' });
    const muetze = v.muetze ? [Pg([[hx - 9, hy - 4], [hx + 6, hy - 9], [hx + 9, hy - 5], [hx - 8, hy - 2]], 'dunkel', { rd: 1.5 }), C(hx - 11, hy - 3, hx + 3, hy - 4, 1, 1, 'dunkel')] : [];
    const a = v.arm, vor = p.angriff ? [0, -6, -14, -6][f] : 0;
    const armL = glied([[39 + lean - K, 59 + T + K], [33 + lean + vor / 2, 76 + T], [32 + vor, 98 * a - (a - 1) * 70 - (vor ? 8 : 0)]], 3, 1.6, null);
    const armR = glied([[59 + lean - K, 59 + T + K], [65, 77 + T], [64, 98 * a - (a - 1) * 70]], 2.8, 1.5, null);
    const gruppen = [
      { p: armR, k: 1 },
      { p: beine, k: 2 },
      { p: [rumpf], k: 2 },
      { p: [hals], k: 0 },
      { p: [kopf], k: 0 },
      { p: muetze, k: 1 },
      { p: armL, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Kiemenfalten am Hals: dunkle Schlitze, offen mit innerem Randlicht
      for (let i = 0; i < 3; i++) { const y = r(hy + 8 + i * 2), x = r(hx + 2); P.auf(x, y, 'k0'); P.auf(x + 1, y, 'k0'); P.auf(x + 2, y, kiemen ? 'r1' : 'k0'); }
      // Augen zu groß, weit seitlich
      const ex = [r(hx - v.kb + 3), r(hx + v.kb - 4)], ey = r(hy - 1);
      ex.forEach(x => {
        if (P0.aus) { P.el(x + 0.5, ey + 0.5, v.auge * 0.7, v.auge * 0.7, 'k0', true); return; }
        P.glow(x + 0.5, ey + 0.5, 6, 0.6);
        P.el(x + 0.5, ey + 0.5, v.auge * 0.75, v.auge * 0.75, 'glutDim', true); P.set(x, ey, 'kern'); P.set(x - 1, ey, 'glut'); P.set(x, ey + 1, 'k0');
        augen.push([x, ey]);
      });
      for (let i = -4; i <= 3; i++) P.auf(hx + i, hy + 4, 'k0'); // Maul, breit
      if (maul) for (let i = -3; i <= 2; i++) for (let k = 1; k <= maul; k++) P.auf(hx + i, hy + 4 + k, 'k0');
    };
    return { gruppen, details, augen };
  },
};
