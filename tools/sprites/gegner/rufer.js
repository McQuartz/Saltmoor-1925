// Rufer (Schwarzes Eis). Fast ein Mensch: dünn, Mantel, aber der Hals zu lang und der Kopf zu klein.
// Der Mund steht immer offen.
'use strict';
module.exports = {
  id: 'rufer', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [48, 115], kopf: [46, 6],
  varianten: {
    rufer_a: { hals: 26, kopf: 4.5, kipp: 3 },
    rufer_b: { hals: 32, kopf: 4, kipp: -2, gebeugt: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 34 }), f = p.f;
    const lean = P0.lean, T = P0.atem + P0.fall, cx = 48;
    const ruf = p.angriff ? [1, 2, 3, 2][f] : p.idle ? [1, 1, 1, 2][f] : 1;
    const top = 52 + T + (v.gebeugt ? 4 : 0);
    const beine = [C(44, 92, 43, 113, 2.8, 2, null), C(52, 92, 54, 113, 2.8, 2, null)];
    const rumpf = Pg([[cx - 9 + lean, top], [cx + 9 + lean, top], [cx + 11, top + 22], [cx + 12, 96], ...saum(cx + 12, cx - 12, 100, 4, 3, 61, p.idle ? [0, 1, 1, 0][f] : 0), [cx - 12, 96], [cx - 11, top + 22]], null, { rd: 2 });
    const k = v.kipp + (p.angriff ? [0, -4, -9, -3][f] : 0), hx = cx + lean + k, hy = top - v.hals;
    const hals = [C(cx + lean, top + 2, cx + lean + k * 0.4, top - v.hals * 0.5, 2.6, 2, 'haut'), C(cx + lean + k * 0.4, top - v.hals * 0.5, hx, hy + 2, 2, 1.8, 'haut')];
    const kopf = E(hx, hy, v.kopf, v.kopf + 1, 'haut', { pf: 'bevel' });
    const arme = [...glied([[cx - 8 + lean, top + 3], [cx - 13 + lean, top + 22], [cx - 12, top + 42]], 2.2, 1.2, null), ...glied([[cx + 8 + lean, top + 3], [cx + 13 + lean, top + 22], [cx + 12, top + 42]], 2.2, 1.2, null)];
    const gruppen = [
      { p: beine, k: 1 },
      { p: [rumpf], k: 2 },
      { p: arme, k: 1 },
      { p: hals, k: 1 },
      { p: [kopf], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Mund immer offen: dunkles Oval, im Ruf größer
      P.el(hx - 0.5, hy + 2, 1 + ruf * 0.4, 1 + ruf * 0.6, 'k0', true);
      if (!P0.aus) { P.set(r(hx - 2), r(hy - 2), 'kern'); P.set(r(hx + 1), r(hy - 2), 'glut'); P.glow(hx, hy - 2, 4, 0.7); augen.push([r(hx - 2), r(hy - 2)], [r(hx + 1), r(hy - 2)]); }
      // Ruf: Atemhauch als Randlicht-Punkte vor dem Mund
      if (ruf > 1) for (let i = 1; i <= ruf; i++) P.set(r(hx - 4 - i * 3), r(hy + 2 - (i % 2)), i === 1 ? 'r1' : 'k3');
      // Reif auf den Schultern
      for (let i = 0; i < 6; i++) P.auf(r(cx - 7 + i * 3 + lean), top + 1 + (i % 2), 'r1');
    };
    return { gruppen, details, augen };
  },
};
