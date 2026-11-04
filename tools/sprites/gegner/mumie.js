// Erbauer-Mumie (Namenlose Stadt). Flach, lang gestreckt, kriecht auf zu vielen Gelenken,
// in Binden. Das Gesicht ist ein schildförmiges Relief.
'use strict';
module.exports = {
  id: 'mumie', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [50, 115], kopf: [30, 70],
  varianten: {
    mumie_a: { glieder: 3, lang: 40, hoch: 0 },
    mumie_b: { glieder: 4, lang: 44, hoch: 6 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 8, fall: 6 }), f = p.f;
    const lean = P0.lean + (p.idle ? [0, 0, -1, -1][f] : 0), H = v.hoch, by = 90 - H + P0.fall, x0 = 58 - v.lang / 2 + lean, x1 = 58 + v.lang / 2 + lean;
    const hebe = p.angriff ? [2, 6, 2, 0][f] : 0;
    const leib = [C(x0, by - hebe, x1, by + 2, 9, 7, null), E(x1 + 4, by + 3, 8, 7, null)];
    const schild = Pg([[x0 - 16, by - 12 - hebe], [x0 - 4, by - 14 - hebe], [x0 - 2, by - 2 - hebe], [x0 - 9, by + 6 - hebe], [x0 - 17, by - 2 - hebe]], 'haut', { rd: 1, pf: 'bevel' });
    const hals = C(x0 + 2, by - hebe, x0 - 6, by - 6 - hebe, 4, 3.5, null);
    const vorn = [], hinten = [];
    for (let i = 0; i < v.glieder; i++) for (const s of [0, 1]) {
      const q = i / (v.glieder - 1), x = x0 + q * (x1 - x0), ph = (i + s + (p.idle ? 0 : f)) % 2;
      const kx = x - 6 + s * 3 + ph * 2, ky = by - 10 - ph * 3 - H * 0.5, fx = x - 10 + s * 6 + (p.angriff && i === 0 ? -8 : 0), fy = 114;
      (s ? vorn : hinten).push(...glied([[x, by + 2], [kx, ky], [kx - 3, ky + 8], [fx, fy]], 2.4, 1, null));
    }
    const gruppen = [
      { p: hinten, k: 0 },
      { p: [...leib, hals], k: 3, anker: [lean, 0] },
      { p: [schild], k: 0, anker: [lean, 0] },
      { p: vorn, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Binden: schräge Streifen über den Leib
      for (let x = r(x0 - 6); x < x1 + 10; x += 3) P.line(x, by - 7 - hebe, x + 3, by + 7, 'k0', true);
      // Relief-Gesicht: eingeritzte Linien, Augen glimmen matt
      const gx = r(x0 - 10), gy = r(by - 5 - hebe);
      P.line(gx - 4, gy - 4, gx + 3, gy - 5, 'r1', true); P.line(gx - 3, gy + 3, gx + 2, gy + 3, 'k0', true); P.line(gx - 1, gy - 3, gx - 1, gy + 2, 'k3', true);
      if (!P0.aus) { P.set(gx - 4, gy - 1, 'glut'); P.set(gx + 2, gy - 1, 'kern'); P.glow(gx, gy, 5, 0.6); augen.push([gx - 4, gy - 1], [gx + 2, gy - 1]); }
    };
    return { gruppen, details, augen };
  },
};
