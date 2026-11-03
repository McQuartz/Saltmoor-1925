// Wächter Kapelle: Die Glockenmutter. Zwei lange Beine unter einem schmalen Kleid,
// statt eines Kopfes eine große Glocke. Sie läutet ohne Klöppel.
'use strict';
module.exports = {
  id: 'glockenmutter', biom: 'kapelle', zone: 'kapelle', rang: 'waechter', w: 128, h: 160, fuss: [64, 155], kopf: [64, 6], rimBis: 153,
  varianten: { glockenmutter: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 50 }), f = p.f;
    const lean = P0.lean, T = P0.atem + P0.fall;
    // Glocke schwingt beim Läuten
    const schw = p.angriff ? [0, -3, 3, -1][f] : p.treffer ? [3, 1][f] : p.idle ? [0, 0, 1, 0][f] : r(p.q * 6);
    const cx = 64;
    const beine = [...glied([[58, 112], [54, 134], [57, 154]], 2.6, 1.6, null), ...glied([[70, 112], [76, 134], [72, 154]], 2.6, 1.6, null)];
    const kleid = Pg([[cx - 9 + lean, 58 + T], [cx + 9 + lean, 58 + T], [cx + 12 + lean / 2, 90 + T / 2], [cx + 16, 116], ...saum(cx + 16, cx - 16, 121, 5, 3, 41, p.idle ? [0, 1, 1, 0][f] : 0), [cx - 16, 116], [cx - 12 + lean / 2, 90 + T / 2]], null, { rd: 2 });
    const schultern = E(cx + lean, 60 + T, 12, 4, null);
    // Glocke: schmaler Kopf oben, weit ausgestellter Rand unten, Krone (Henkel) obenauf
    const gx = cx + lean + schw, gy = 30 + T;
    const glocke = Pg([[gx - 7, gy - 16], [gx + 7, gy - 16], [gx + 10, gy - 6], [gx + 13, gy + 10], [gx + 18, gy + 20], [gx - 18, gy + 20], [gx - 13, gy + 10], [gx - 10, gy - 6]], null, { rd: 2 });
    const krone = [E(gx, gy - 20, 4, 4, null), C(gx - 8, gy + 20, gx + 8, gy + 20, 2, 2, 'dunkel')];
    const zug = p.angriff ? [0, -10, -18, -6][f] : 0;
    const armL = glied([[cx - 10 + lean, 62 + T], [cx - 20 + lean + zug / 3, 82 + T], [cx - 18 + zug, 104 + T - (zug ? 14 : 0)]], 2.4, 1.2, null);
    const armR = glied([[cx + 10 + lean, 62 + T], [cx + 22 + lean, 84 + T], [cx + 18, 106 + T]], 2.4, 1.2, null);
    const gruppen = [
      { p: beine, k: 1 },
      { p: armR, k: 0 },
      { p: [kleid, schultern], k: 3 },
      { p: [glocke], k: 1, pf: 'bevel' },
      { p: krone, k: 0 },
      { p: armL, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Inneres der Glocke: dunkel, kein Klöppel; tief drinnen zwei Augen
      for (let x = r(gx - 15); x <= r(gx + 15); x++) for (let y = r(gy + 16); y <= r(gy + 19); y++) P.auf(x, y, 'k0');
      if (!P0.aus) { P.set(r(gx - 3), r(gy + 17), 'glut'); P.set(r(gx + 3), r(gy + 17), 'kern'); P.glow(gx, gy + 17, 6, 0.8); augen.push([r(gx - 3), r(gy + 17)], [r(gx + 3), r(gy + 17)]); }
      // Läuten: Klangringe aus Randlicht neben der Glocke
      if (p.angriff && f >= 1) for (const s of [-1, 1]) for (let k = 0; k < f; k++) { const rr = 22 + k * 5; for (let a = -0.7; a <= 0.7; a += 0.08) P.set(r(gx + s * Math.cos(a) * rr), r(gy + 6 + Math.sin(a) * rr), k ? 'r1' : 'r2'); }
      // Inschriftband auf der Glocke
      for (let x = r(gx - 9); x <= r(gx + 9); x += 2) P.auf(x, r(gy + 4), 'r1');
    };
    return { gruppen, details, augen };
  },
};
