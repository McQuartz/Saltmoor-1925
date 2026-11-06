// Nachtzug: Das Gepäckstück. Ein Überseekoffer, ein Handkoffer und eine Hutschachtel, mit einem Riemen
// zusammengeschnallt. Darunter laufen zwei menschliche Arme auf den Händen, die Ellbogen hoch wie bei einer Krabbe.
// Falsch: Aus dem Spalt des Handkoffers hängt ein Mantelärmel, und durch Schlüsselloch und Deckelspalt
// fällt warmes Licht, als wäre innen ein Abteil.
'use strict';
const rot = (pts, cx, cy, a) => pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
module.exports = {
  id: 'gepaeck', biom: 'nachtzug', zone: 'nachtzug', w: 96, h: 120, fuss: [52, 116], kopf: [52, 18], rimBis: 113,
  varianten: {
    gepaeck_a: { stapel: 3, truheB: 54, truheH: 30, koffer: [40, 18], schachtel: true, aermel: true, k2: -0.12 },
    gepaeck_b: { stapel: 2, truheB: 50, truheH: 40, koffer: [44, 20], schachtel: false, aermel: true, drittHand: true, k2: 0.1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let kipp = 0, hub = 0, schritt = 0, auf = 0, lean = 0, fall = 0, licht = 1;
    if (p.idle) { hub = [0, 0, 1, 1][f]; schritt = 0; licht = [1, 1, 0.9, 0.9][f]; }
    if (p.angriff) { kipp = [0.1, 0.16, -0.22, -0.06][f]; lean = [3, 4, -9, -3][f]; hub = [1, -3, 2, 0][f]; auf = [0, 0.2, 1, 0.4][f]; licht = [1, 1.2, 1.5, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; kipp = [0.08, 0.03][f]; licht = 0.6; }
    if (p.tod) { fall = r(p.q * 30); kipp = p.q * 0.35; licht = f < 1 ? 0.5 : 0; }
    const bx = 52 + lean, ty1 = 86 + hub + fall * 0.4, tB = v.truheB, tH = v.truheH;
    const ty0 = ty1 - tH;
    // Arme: Schultern unter der Truhe, Ellbogen hoch und außen, Hände flach am Boden
    const fy = 114, sp = r(fall * 0.5);
    const ang = p.angriff && f === 2 ? -6 : 0;
    const hLx = bx - tB / 2 - 2 + schritt * 2 + ang, hRx = bx + tB / 2 + 2 - schritt * 2;
    const armL = glied([[bx - tB / 2 + 8, ty1 - 2], [bx - tB / 2 - 13 + schritt, ty0 - 8 + sp + (p.angriff ? [0, -6, 4, 0][f] : 0)], [hLx, fy - 2]], 3.8, 2.2, null);
    const armR = glied([[bx + tB / 2 - 8, ty1 - 2], [bx + tB / 2 + 13 - schritt, ty0 - 6 + sp], [hRx, fy - 2]], 3.6, 2.0, null);
    // Hände flach, Finger gespreizt (links zum Spieler hin)
    const hand = (x, s) => [E(x, fy - 1, 3.2, 2, 'haut'), ...[-1, 0, 1, 2].map(k => C(x + s * 2, fy - 1 + (k > 0 ? 0 : 0), x + s * (6 + Math.abs(k)) , fy + 1 - (k < 0 ? 1 : 0) + k * 0.4, 0.9, 0.7, 'haut'))];
    const handL = hand(hLx, -1), handR = hand(hRx, 1);
    // Truhe: Kasten mit gewölbtem Deckel; beim Angriff klappt der Deckel vorne auf
    const cx = bx, cy = ty1;
    const truhe = Pg(rot([[bx - tB / 2, ty1], [bx + tB / 2, ty1], [bx + tB / 2, ty0 + 6], [bx - tB / 2, ty0 + 6]], cx, cy, kipp), null, { rd: 1.2 });
    const dw = auf * 0.6;
    const deckel = Pg(rot(rot([[bx - tB / 2 - 1, ty0 + 7], [bx + tB / 2 + 1, ty0 + 7], [bx + tB / 2, ty0 + 2], [bx + tB / 4, ty0], [bx - tB / 4, ty0], [bx - tB / 2, ty0 + 2]], bx + tB / 2, ty0 + 7, dw), cx, cy, kipp), 'dunkel', { rd: 1 });
    // Handkoffer obenauf, schräg; Hutschachtel ganz oben
    const [kb, kh] = v.koffer, ky1 = ty0 + 1, kx = bx + 2 + r(auf * 2);
    const k2 = v.k2 + kipp * 1.4;
    const koffer = Pg(rot([[kx - kb / 2, ky1], [kx + kb / 2, ky1], [kx + kb / 2, ky1 - kh], [kx - kb / 2, ky1 - kh]], kx, ky1, k2), 'haut', { rd: 1.5, tone: -0.05 });
    const griff = C(...rot([[kx - 4, ky1 - kh - 1]], kx, ky1, k2)[0], ...rot([[kx + 4, ky1 - kh - 1]], kx, ky1, k2)[0], 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const sy1 = ky1 - kh - 2;
    const sx = kx - 8 + r(kipp * 10);
    const schachtel = v.schachtel ? [Pg(rot([[sx - 10, sy1 + 2], [sx + 10, sy1 + 2], [sx + 10, sy1 - 11], [sx - 10, sy1 - 11]], sx, sy1, 0.14), null, { rd: 1, tone: 0.2 }), E(...rot([[sx, sy1 - 11]], sx, sy1, 0.14)[0], 10.5, 3, 'haut')] : [];
    // Ärmel aus dem Kofferspalt, eine Hand hängt heraus
    const ap = rot([[kx - kb / 2 + 3, ky1 - 6]], kx, ky1, k2)[0];
    const ah = [ap[0] - 12, ap[1] + 20 + (p.angriff ? -f * 2 : 0)];
    const aermel = v.aermel ? glied([ap, [ap[0] - 9, ap[1] + 4], [ah[0], ah[1] - 3]], 3, 2.4, null) : [];
    const aHand = v.aermel ? [E(ah[0], ah[1], 2.2, 3, 'haut', { tone: 0.3 }), ...[-1, 0, 1].map(k => C(ah[0] + k, ah[1] + 1, ah[0] + k * 1.6 - 1, ah[1] + 6 - Math.abs(k), 0.6, 0.5, 'haut', { tone: 0.3 }))] : [];
    const dritt = v.drittHand ? glied([[bx + 6, ty1 - 2], [bx + 4, ty1 + 8], [bx + 9, fy]], 2.2, 1.4, null) : [];
    const gruppen = [
      { p: armR, k: 1 },
      { p: handR, k: 0.5 },
      { p: dritt, k: 1 },
      { p: [truhe], k: 0, pf: 'bevel', tone: -0.05, anker: [lean, hub] },
      { p: [deckel], k: 0, anker: [lean, hub] },
      { p: [koffer, griff], k: 1, anker: [lean, hub] },
      { p: schachtel, k: 1, anker: [lean, hub] },
      { p: [...aermel, ...aHand], k: 1, anker: [lean, hub] },
      { p: armL, k: 1 },
      { p: handL, k: 0.5 },
    ];
    const augen = [];
    const R = (x, y) => rot([[x, y]], cx, cy, kipp)[0].map(r);
    const details = P => {
      // Riemen senkrecht über Truhe und Koffer, Schnalle aus Messing
      for (let y = ty0 + 2; y < ty1 - 1; y++) { const [x, yy] = R(bx - 7, y); P.auf(x, yy, 'k0'); P.auf(x + 1, yy, 'k0'); }
      { const [x, y] = R(bx - 7, ty0 + 14); P.auf(x - 1, y, 'messing'); P.auf(x + 2, y, 'messing'); P.auf(x - 1, y + 1, 'messing'); P.auf(x + 2, y + 1, 'messing'); }
      // Beschläge an den Ecken, Leisten
      for (const [a, b] of [[bx - tB / 2 + 1, ty1 - 1], [bx + tB / 2 - 1, ty1 - 1], [bx - tB / 2 + 1, ty0 + 7], [bx + tB / 2 - 1, ty0 + 7]]) { const [x, y] = R(a, b); P.auf(x, y, 'messing'); }
      for (let x = bx - tB / 2 + 2; x < bx + tB / 2 - 1; x += 1) { const [px, py] = R(x, ty1 - 10); if ((x & 3) !== 1) P.auf(px, py, 'k1'); }
      // Hand aus dem Ärmel: fahl im Fensterlicht
      if (v.aermel) for (let y = r(ah[1] - 2); y <= r(ah[1] + 6); y++) for (let x = r(ah[0] - 3); x <= r(ah[0] + 3); x++) { const c = P.get(x, y); if (c && c < 5 && A.bay(x, y) < 0.55) P.set(x, y, 'r1'); }
      // Reiseaufkleber: helle, schiefe Flecken (Bahnhöfe, die es nicht gibt)
      for (const [a, b, w, h] of [[bx + 8, ty0 + 12, 6, 4], [bx - tB / 2 + 4, ty0 + 16, 5, 5]]) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const [x, y] = R(a + i, b + j); P.auf(x, y, (i + j) % 3 ? 'k3' : 'r1'); }
      // Licht von innen: Schlüsselloch und Deckelspalt
      if (licht > 0) {
        const [lx, ly] = R(bx + 4, ty0 + 10);
        P.glow(lx + 0.5, ly + 1, 6 * licht, 0.9);
        P.set(lx, ly, 'kern'); P.set(lx, ly + 1, 'glut'); P.set(lx, ly + 2, 'glut');
        augen.push([lx, ly]);
        const n = r(tB * (0.45 + auf * 0.4));
        for (let i = 0; i < n; i++) { const [x, y] = R(bx + tB / 2 - 3 - i, ty0 + 7 - r(auf * (tB - i) * 0.55) * 0); P.auf(x, y, i % 4 === 0 ? 'glut' : 'glutDim'); }
        if (auf > 0.5) { // offener Deckel: innen ein warmer Schlitz, darin Zähne aus Kofferschlössern
          for (let i = 3; i < tB - 6; i++) { const yy = ty0 + 6 - Math.round(Math.sin(dw) * (tB - i) * 0.9); const [x, y] = R(bx - tB / 2 + i, yy); for (let k = 0; k < 3; k++) P.set(x, y + k + 1, k === 1 ? 'glut' : 'glutDim'); if (i % 5 === 0) P.set(x, y + 1, 'messing'); }
        }
        const kp = rot([[kx + kb / 2 - 4, ky1 - kh / 2]], kx, ky1, k2)[0].map(r);
        P.set(kp[0], kp[1], licht > 1 ? 'kern' : 'glut'); P.set(kp[0] - 1, kp[1], 'glutDim'); P.set(kp[0] + 1, kp[1], 'glutDim');
        augen.push(kp);
      }
    };
    return { gruppen, details, augen };
  },
};
