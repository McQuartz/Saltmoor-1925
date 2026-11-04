// Bote (Namenlose Stadt). Ein Hut auf einer Säule aus Augen statt eines Halses,
// der Mantel steht offen, quer durch die Brust ein senkrechter Mund. Posttasche voller Briefe.
'use strict';
module.exports = {
  id: 'bote', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [48, 115], kopf: [48, 10],
  varianten: {
    bote_a: { breit: 15, hals: 16, tasche: true },
    bote_b: { breit: 13, hals: 20, tasche: false, krumm: 2 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 3, fall: 30 }), f = p.f, K = v.krumm || 0;
    const lean = P0.lean, T = P0.atem + P0.fall, B = v.breit, cx = 48;
    const mund = p.angriff ? [2, 3, 5, 3][f] : p.idle ? [2, 2, 3, 2][f] : p.treffer ? 1 : 2;
    const top = 44 + T;
    const mantel = Pg([[cx - 10 + lean, top], [cx + 10 + lean, top], [cx + B + lean / 2, top + 14], [cx + B + 2, 100], ...saum(cx + B + 2, cx - B - 2, 108, 6, 5, 51, p.idle ? [0, 1, 1, 0][f] : 0), [cx - B - 2, 100], [cx - B + lean / 2, top + 14]], null, { rd: 1.5 });
    const schultern = E(cx + lean, top + 3, B - 1, 5, null);
    const hals = C(cx + lean + K, top, cx + lean - K, top - v.hals, 2.5, 2, 'haut');
    const hy = top - v.hals - 4;
    const hut = [E(cx + lean - K, hy, 6, 5, 'dunkel'), Pg([[cx - 7 + lean - K, hy - 2], [cx - 5 + lean - K, hy - 11], [cx + 6 + lean - K, hy - 12], [cx + 8 + lean - K, hy - 2]], 'dunkel', { rd: 1 }), C(cx - 13 + lean - K, hy - 1, cx + 13 + lean - K, hy - 2, 1.3, 1.3, 'dunkel')];
    const zug = p.angriff ? [0, -6, -12, -4][f] : 0;
    const arme = [...glied([[cx - B + 2 + lean, top + 6], [cx - B - 4 + lean + zug / 2, top + 28], [cx - B - 2 + zug, top + 48 - (zug ? 10 : 0)]], 2.4, 1.3, null), ...glied([[cx + B - 2 + lean, top + 6], [cx + B + 4 + lean, top + 28], [cx + B + 2, top + 48]], 2.4, 1.3, null)];
    const tasche = v.tasche ? [Pg([[cx + 6, top + 26], [cx + 16, top + 24], [cx + 17, top + 36], [cx + 7, top + 38]], 'dunkel', { rd: 1 }), C(cx - 8 + lean, top + 2, cx + 12, top + 25, 0.8, 0.8, 'dunkel')] : [];
    const gruppen = [
      { p: [hals], k: 0 },
      { p: [mantel, schultern], k: 3 },
      { p: hut, k: 1 },
      { p: tasche, k: 0 },
      { p: arme, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Mantel steht offen: dunkle Spalte in der Mitte, darin der senkrechte Mund
      const mx = cx + lean, my0 = top + 8, my1 = top + 52;
      for (let y = my0; y <= my1; y++) { const t = (y - my0) / (my1 - my0), w = Math.round(Math.sin(t * Math.PI) * mund * 0.8); for (let x = -w - 1; x <= w; x++) P.auf(mx + x, y, 'k0'); if (y % 2 === 0) { P.auf(mx - w - 2, y, 'r1'); P.auf(mx + w + 1, y, 'r1'); } if (w > 0 && y % 3 === 1) P.auf(mx, y, 'glutDim'); }
      // Augen statt Hals: eine senkrechte Reihe
      if (!P0.aus) for (let i = 0; i < 4; i++) { const t = (i + 0.5) / 4, x = r(cx + lean + K - 2 * K * t), y = r(top - v.hals * t); const zu = p.idle && i === f; P.set(x, y, zu ? 'k1' : i === 1 ? 'kern' : 'glut'); if (!zu) augen.push([x, y]); }
      // Briefe ragen aus der Tasche
      if (v.tasche) for (let i = 0; i < 3; i++) P.line(cx + 8 + i * 3, top + 25 - (i % 2), cx + 9 + i * 3, top + 22 - (i % 2), 'r1');
    };
    return { gruppen, details, augen };
  },
};
