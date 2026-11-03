// Schlundträger (Salzstollen). Gebeugt auf Hinterläufen, der Kopf senkrecht aufgeplatzt,
// aus dem Spalt hängen Tentakel bis zum Boden, an den Rändern Zahnreihen, zwei Augen je Hälfte.
'use strict';
module.exports = {
  id: 'schlundtraeger', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [54, 115], kopf: [50, 20],
  varianten: {
    schlundtraeger_a: { spalt: 3, tentakel: 6, kopfR: 8 },
    schlundtraeger_b: { spalt: 5, tentakel: 8, kopfR: 9, schief: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, chain, glied, pose } = A;
    const P0 = pose(p, { lunge: 5, fall: 24 }), f = p.f, S = v.schief || 0;
    const lean = P0.lean, T = P0.atem + P0.fall;
    const auf = p.angriff ? [1, 3, 5, 2][f] : p.idle ? [0, 0, 0, 1][f] : 0; // Spalt öffnet sich
    const sp = v.spalt + auf, hx = 44 + lean, hy = 44 + T, R = v.kopfR;
    const rumpf = Pg([[hx - 4, hy + 4], [hx + 14, hy - 2], [70, 56 + P0.fall / 2], [78, 80], [74, 98], [60, 102], [46, 96], [42, 76 + P0.fall / 2]], null, { rd: 4 });
    const buckel = E(62, 62 + r(P0.fall / 2), 13, 14, null, { pf: 'bevel' });
    const beine = [...glied([[66, 92], [74, 104], [66, 114]], 4, 2, null), ...glied([[48, 94], [42, 104], [46, 114]], 3.6, 1.8, null)];
    const halbL = E(hx - sp / 2 - R * 0.6, hy - 1 + S, R * 0.85, R, 'haut', { pf: 'bevel' });
    const halbR = E(hx + sp / 2 + R * 0.6, hy - 3, R * 0.9, R * 1.05, 'haut', { pf: 'bevel' });
    const tent = [];
    for (let i = 0; i < v.tentakel; i++) {
      const x0 = hx - sp / 2 - 2 + (i * (sp + 4)) / Math.max(1, v.tentakel - 1), ph = i * 1.3 + (p.idle ? (f >> 1) * 0.3 : f * 0.9);
      const len = 8 + (i % 3) * 1.5 + (p.angriff ? f * 1.5 : 0);
      tent.push(...chain(x0, hy + 4, Math.PI / 2 + (i - v.tentakel / 2) * 0.09 + (p.angriff ? -0.25 * f : 0), 8, len * (1 - P0.fall / 40), 1.6, 0.6, null, (q, k) => Math.sin(ph + k) * 0.12));
    }
    const gruppen = [
      { p: beine, k: 1 },
      { p: [rumpf, buckel], k: 4 },
      { p: tent, k: 0.5 },
      { p: [halbL], k: 0, anker: [0, T] },
      { p: [halbR], k: 0, anker: [0, T] },
    ];
    const augen = [];
    const details = P => {
      // Zahnreihen an den inneren Rändern des Spalts
      for (let y = -8; y <= 6; y += 2) { P.auf(r(halbL.x + halbL.rx - 1), r(halbL.y + y), 'r1'); P.auf(r(halbR.x - halbR.rx + 1), r(halbR.y + y + 1), 'r1'); }
      if (!P0.aus) for (const [h, s] of [[halbL, -1], [halbR, 1]]) for (const dy of [-4, -1]) { const x = r(h.x + s * 1), y = r(h.y + dy); P.set(x, y, dy === -4 ? 'kern' : 'glut'); P.glow(x + 0.5, y + 0.5, 4, 0.7); augen.push([x, y]); }
    };
    return { gruppen, details, augen };
  },
};
