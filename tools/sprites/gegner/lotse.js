// Wächter Hafen: Der Lotse. Sehr hoch, Ölzeug, statt eines Kopfes ein Laternengehäuse,
// in dem etwas atmet. Ein langer Bootshaken.
'use strict';
module.exports = {
  id: 'lotse', biom: 'hafen', zone: 'hafen', rang: 'waechter', w: 128, h: 160, fuss: [62, 155], kopf: [64, 4], rimBis: 152,
  varianten: { lotse: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 6, fall: 40 }), f = p.f;
    const lean = P0.lean, T = P0.atem + P0.fall;
    const atmen = p.idle ? [0, 1, 2, 1][f] : p.angriff ? [1, 2, 3, 2][f] : 0;
    const hem = p.idle ? [0, 1, 1, 0][f] : 0;
    const cx = 62;
    const beine = [C(54, 136, 53, 154, 4, 3.4, null), C(70, 136, 72, 154, 4, 3.4, null), E(52, 154, 5, 2, null), E(73, 154, 5, 2, null)];
    const mantel = Pg([[cx - 16 + lean, 42 + T], [cx + 15 + lean, 42 + T], [cx + 21 + lean / 2, 60 + T], [cx + 22, 100 + T / 3], [cx + 24, 138], ...saum(cx + 24, cx - 22, 143, 6, 3, 5, hem), [cx - 22, 136], [cx - 20 + lean / 2, 60 + T]], null, { rd: 2 });
    const schultern = E(cx + lean, 46 + T, 19, 7, null, { pf: 'dome' });
    const kapuze = Pg([[cx - 10 + lean, 44 + T], [cx - 7 + lean, 36 + T], [cx + 7 + lean, 36 + T], [cx + 10 + lean, 44 + T]], 'dunkel', { rd: 1.5 });
    const falten = [C(cx - 6 + lean, 56 + T, cx - 9, 138, 1, 1.8, 'dunkel'), C(cx + 8 + lean, 58 + T, cx + 12, 136, 1, 1.8, 'dunkel'), C(cx + lean, 62 + T, cx + 1, 140, 0.6, 1.2, 'dunkel')];
    // Laternenkopf: Dach, Gehäuse, Ring
    const lx = cx + lean, ly = 22 + T;
    const gehaeuse = [Pg([[lx - 8, ly - 7], [lx + 8, ly - 7], [lx + 9, ly + 12], [lx - 9, ly + 12]], null, { rd: 1 })];
    const dach = [Pg([[lx - 11, ly - 7], [lx, ly - 15], [lx + 11, ly - 7]], 'dunkel', { rd: 1 }), E(lx, ly - 18, 3, 3, null), C(lx - 10, ly + 13, lx + 10, ly + 13, 1.6, 1.6, 'dunkel')];
    // Arme: links hängt bis zum Knie, rechts hält den Bootshaken
    const haken = p.angriff ? [0.1, -0.15, -0.65, -0.3][f] : p.tod ? Math.min(0.9, p.q * 1.2) : 0;
    const hx = cx + 30 + lean, hy = 82 + T;
    const ang = -Math.PI / 2 - haken; const sx = hx + Math.cos(ang) * 70, sy = hy + Math.sin(ang) * 70;
    const stange = [C(hx - Math.cos(ang) * 60, hy - Math.sin(ang) * 60, sx, sy, 1.2, 1.1, 'dunkel', { pf: 'flat' })];
    const spitze = glied([[sx, sy], [sx + Math.cos(ang) * 6, sy + Math.sin(ang) * 6], [sx + Math.cos(ang - 1.8) * 8 + Math.cos(ang) * 4, sy + Math.sin(ang - 1.8) * 8 + Math.sin(ang) * 4]], 1.4, 0.9, null);
    const armR = glied([[cx + 16 + lean, 50 + T], [cx + 28 + lean, 66 + T], [hx, hy]], 4, 2.6, null);
    const armL = glied([[cx - 16 + lean, 50 + T], [cx - 24 + lean, 80 + T], [cx - 22 + lean, 112 + T * 0.8]], 3.8, 2.2, null);
    const gruppen = [
      { p: beine, k: 2 },
      { p: [mantel, schultern], k: 4 },
      { p: falten, k: 0, noRim: true },
      { p: [kapuze], k: 1 },
      { p: gehaeuse, k: 0, pf: 'flat' },
      { p: dach, k: 1 },
      { p: armL, k: 1 },
      { p: stange, k: 0 },
      { p: spitze, k: 0 },
      { p: armR, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Glas: gedithertes Licht, darin ein dunkler Klumpen, der atmet; Stäbe davor
      if (!P0.aus || f < 2) {
        for (let y = ly - 5; y <= ly + 10; y++) for (let x = lx - 6; x <= lx + 6; x++) {
          const d = Math.hypot(x - lx, (y - ly - 3) * 0.8); const t = 1 - d / 9;
          P.set(x, y, t > 0.55 + A.bay(x, y) * 0.3 ? 'kern' : t > 0.15 + A.bay(x, y) * 0.3 ? 'glut' : 'glutDim');
        }
        P.el(lx + 0.5, ly + 4, 2.5 + atmen * 0.6, 3 + atmen * 0.7, 'k1'); P.el(lx + 0.5, ly + 3, 1.2 + atmen * 0.3, 1.5, 'k0');
        for (const x of [lx - 4, lx, lx + 4]) P.line(x, ly - 6, x, ly + 11, 'k2');
        P.glow(lx + 0.5, ly + 28, 26, 0.5, 'glutDim', 'k3');
        augen.push([lx - 3, ly], [lx + 3, ly]);
      } else for (let y = ly - 5; y <= ly + 10; y++) for (let x = lx - 6; x <= lx + 6; x++) P.set(x, y, (x + y) % 3 ? 'k1' : 'k2');
    };
    return { gruppen, details, augen };
  },
};
