// Nachgeher (Schwarzes Eis). Eine Brücke aus Gliedern: rückwärts gebogen auf allen vieren,
// Knie nach hinten, der Kopf hängt verdreht nach unten und sieht dich an.
'use strict';
module.exports = {
  id: 'nachgeher', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [52, 115], kopf: [52, 52],
  varianten: {
    nachgeher_a: { bogen: 76, breit: 26 },
    nachgeher_b: { bogen: 72, breit: 30, schief: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 9, fall: 14 }), f = p.f, S = v.schief || 0;
    const lean = P0.lean, T = P0.fall, Bw = v.breit, cx = 54 + lean;
    const by = v.bogen + T;
    // Rumpf liegt rücklings: Brust links, Becken rechts, Bauch nach oben gewölbt
    const brust = E(cx - Bw / 2, by + 2 + S, 11, 8, null, { pf: 'bevel' });
    const becken = E(cx + Bw / 2, by + 3, 10, 7, null);
    const bauch = C(cx - Bw / 2, by, cx + Bw / 2, by + 1, 7.5, 7, null);
    // Arme (links) und Beine (rechts): Ellbogen/Knie nach oben-außen, Hände/Füße am Boden
    const tritt = p.idle ? 0 : p.angriff ? [0, -4, -10, -3][f] : 0;
    const arme = [...glied([[cx - Bw / 2 - 4, by + 4], [cx - Bw / 2 - 12 + tritt, by - 10], [cx - Bw / 2 - 16 + tritt, 113]], 3.2, 1.6, null), ...glied([[cx - Bw / 2 + 2, by + 6], [cx - Bw / 2 - 2, by - 6], [cx - Bw / 2 - 4, 113]], 2.8, 1.4, null)];
    const beine = [...glied([[cx + Bw / 2 + 4, by + 4], [cx + Bw / 2 + 14, by - 12], [cx + Bw / 2 + 18, 113]], 3.4, 1.7, null), ...glied([[cx + Bw / 2 - 2, by + 6], [cx + Bw / 2 + 4, by - 6], [cx + Bw / 2 + 6, 113]], 3, 1.5, null)];
    // Kopf hängt unter der Brust, verkehrt herum
    const kx = cx - Bw / 2 - 2 + (p.angriff ? tritt / 2 : 0), ky = by + 17 + (p.idle ? [0, 0, 1, 1][f] : 0);
    const hals = C(cx - Bw / 2 - 2, by + 6, kx, ky - 4, 3, 2.4, 'haut');
    const kopf = E(kx, ky, 5.5, 6.5, 'haut', { pf: 'bevel' });
    const gruppen = [
      { p: [arme[2], arme[3], beine[2], beine[3]], k: 1 },
      { p: [brust, becken, bauch], k: 4 },
      { p: [hals], k: 0 },
      { p: [kopf], k: 0, anker: [0, ky] },
      { p: [arme[0], arme[1], beine[0], beine[1]], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Gesicht kopfüber: Mund oben, Augen unten
      P.line(kx - 2, ky - 3, kx + 1, ky - 3, 'k0', true);
      if (!P0.aus) { P.set(r(kx - 2), r(ky + 2), 'kern'); P.set(r(kx + 2), r(ky + 2), 'glut'); P.glow(kx, ky + 2, 5, 0.7); augen.push([r(kx - 2), r(ky + 2)], [r(kx + 2), r(ky + 2)]); }
      // Rippen auf dem Bauch
      for (let i = -2; i <= 2; i++) P.auf(r(cx + i * 4), r(by - 4), 'k0');
    };
    return { gruppen, details, augen };
  },
};
