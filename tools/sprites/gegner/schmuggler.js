// Schmuggler (Hafen). Hut, langer Mantel, Laterne in der ausgestreckten Hand,
// das Gesicht bleibt im Schatten. Unter dem Mantel ein Arm zu viel.
'use strict';
module.exports = {
  id: 'schmuggler', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [52, 115], kopf: [54, 22],
  varianten: {
    schmuggler_a: { krempe: 10, mantel: 14, dritter: [50, 84] },
    schmuggler_b: { krempe: 8, mantel: 16, dritter: [57, 74], hoch: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 26 }), f = p.f, H = v.hoch || 0;
    const lean = P0.lean, T = P0.atem + P0.fall;
    const schwing = p.idle ? [0, 1, 0, -1][f] : p.angriff ? [1, -2, -3, -1][f] : 0;
    const cx = 54, M = v.mantel;
    const beine = [C(48, 98, 47, 113, 3, 2.4, null), C(58, 98, 60, 113, 3, 2.4, null)];
    const mantel = Pg([[cx - 9 + lean, 44 - H + T], [cx + 9 + lean, 44 - H + T], [cx + M - 2 + lean / 2, 70 + T / 2], [cx + M, 104], ...saum(cx + M, cx - M, 108, 5, 3, 21, schwing), [cx - M, 103], [cx - M + 3 + lean / 2, 70 + T / 2]], null, { rd: 1.5 });
    const kragen = E(cx + lean, 47 - H + T, 11, 5, null);
    const beule = E(cx - 4 + lean / 2, 78 + T / 2, 8, 10, null, { pf: 'dome' }); // der Mantel ist ausgebeult
    const kopf = E(cx + 1 + lean, 36 - H + T, 6, 6.5, 'haut');
    const hut = [Pg([[cx - 6 + lean, 33 - H + T], [cx - 5 + lean, 24 - H + T], [cx + 7 + lean, 23 - H + T], [cx + 8 + lean, 33 - H + T]], 'dunkel', { rd: 1 }), C(cx - v.krempe + lean, 33 - H + T, cx + v.krempe + 2 + lean, 32 - H + T, 1.4, 1.4, 'dunkel')];
    // Laternenarm nach links
    const hand = [26 + lean + (p.angriff ? [0, -2, -6, -2][f] : 0), 68 - H + T + (p.angriff ? [-4, -8, -6, 0][f] : 0)];
    const arm = glied([[cx - 8 + lean, 50 - H + T], [cx - 18 + lean, 62 - H + T], hand], 3, 2, null);
    const lx = hand[0] - 1 + schwing, ly = hand[1] + 6;
    const laterne = [C(hand[0], hand[1] + 1, lx, ly - 3, 0.6, 0.6, null, { noRim: true }), Pg([[lx - 3, ly - 3], [lx + 3, ly - 3], [lx + 3, ly + 4], [lx - 3, ly + 4]], 'dunkel', { rd: 0.5 })];
    // dritter Arm: dünn, bleich, kommt aus dem Mantelschlitz; im Angriff schnellt er vor
    const [dx, dy] = v.dritter;
    const raus = p.angriff ? [2, 10, 22, 8][f] : p.idle ? [3, 3, 4, 3][f] : 2;
    const dritter = (P0.fall > 10) ? [] : glied([[dx + lean, dy + T / 2], [dx - raus * 0.6 + lean, dy + 4 + T / 2], [dx - raus + lean, dy + 2 + T / 2 - (raus > 10 ? 4 : 0)]], 1.6, 0.9, 'haut');
    const gruppen = [
      { p: beine, k: 1 },
      { p: [mantel, kragen, beule], k: 3 },
      { p: [kopf], k: 0 },
      { p: hut, k: 1 },
      { p: arm, k: 1 },
      { p: laterne, k: 0 },
      { p: dritter, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Gesicht im Schatten der Krempe: nur zwei matte Punkte
      if (!P0.aus) { P.set(cx - 2 + lean, 37 - H + T, 'glutDim'); P.set(cx + 2 + lean, 37 - H + T, 'glutDim'); augen.push([cx - 2 + lean, 37 - H + T]); }
      // Laternenlicht: Glas mit Kern, Schein auf Mantel und Arm
      if (!P0.aus || f < 2) {
        P.glow(lx + 0.5, ly + 0.5, 22, 0.6, 'glutDim', 'k3');
        for (let y = ly - 2; y <= ly + 3; y++) for (let x = lx - 2; x <= lx + 2; x++) P.set(x, y, Math.abs(x - lx) + Math.abs(y - ly - 0.5) < 2 ? 'kern' : 'glut');
        P.set(lx, ly - 2, 'k2'); P.set(lx, ly + 3, 'k2');
        augen.push([lx, ly]);
      }
      // Finger der dritten Hand
      if (dritter.length) { const e = dritter[dritter.length - 1]; P.set(e.x2 - 1, e.y2 + 1, 'k3'); P.set(e.x2 - 2, e.y2, 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
