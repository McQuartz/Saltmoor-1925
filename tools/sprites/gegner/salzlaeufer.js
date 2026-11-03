// Salzläufer (Salzstollen). Flacher, weiß verkrusteter Panzer auf vielen Beinen,
// blind, tastet mit einem Fächer zu vieler Fühler. Die Kruste hat die Form eines Gesichts.
'use strict';
module.exports = {
  id: 'salzlaeufer', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [52, 115], kopf: [52, 66],
  varianten: {
    salzlaeufer_a: { fuehler: 5, breit: 27, beine: 4 },
    salzlaeufer_b: { fuehler: 7, breit: 24, beine: 5, hoch: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, chain, glied, pose } = A;
    const P0 = pose(p, { lunge: 8, fall: 4 }), f = p.f;
    const lean = P0.lean, H = v.hoch || 0, by = 92 - H + P0.fall, cx = 58 + lean;
    const panzer = E(cx, by, v.breit, 11 + H / 2, null, { pf: 'bevel' });
    const kopf = E(cx - v.breit + 2, by + 3, 7, 5, null);
    const beine = [], hinten = [];
    for (let i = 0; i < v.beine; i++) for (const s of [-1, 1]) {
      const q = i / (v.beine - 1), x0 = cx - v.breit * 0.6 + q * v.breit * 1.2;
      const knick = 6 + ((i + (s > 0 ? 1 : 0) + (p.angriff ? f : p.idle ? (f >> 1) : 0)) % 2);
      (s > 0 ? beine : hinten).push(...glied([[x0, by + 3], [x0 + s * 3 + (q - 0.5) * 14, by - knick - 4 + P0.fall], [x0 + s * 2 + (q - 0.5) * 18, 114]], 1.4, 0.6, null));
    }
    const fu = [];
    for (let i = 0; i < v.fuehler; i++) {
      const a0 = Math.PI + (i - (v.fuehler - 1) / 2) * 0.22 - 0.25, ph = i * 0.9 + (p.idle ? (f >> 1) : f) * 0.7;
      fu.push(...chain(cx - v.breit - 3, by + 2, a0 + (p.angriff ? 0.2 : 0), 7, 3.6 + (p.angriff ? f * 0.4 : 0), 0.9, 0.4, null, (q, k) => Math.sin(ph + k * 0.8) * 0.1 - 0.03));
    }
    const gruppen = [
      { p: hinten, k: 0 },
      { p: [panzer, kopf], k: 3 },
      { p: fu, k: 0 },
      { p: beine, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Salzkruste: gedithertes Weiß auf der Oberseite, darin ein Gesicht aus Lücken
      for (let y = r(by - 9 - H / 2); y < r(by - 1); y++) for (let x = r(cx - v.breit + 3); x < r(cx + v.breit - 2); x++) if ((x * 7 + y * 13) % 5 === 0 && P.get(x, y) >= 1 && P.get(x, y) <= 4) P.auf(x, y, (x + y) % 3 ? 'r1' : 'k3');
      for (const [dx, dy] of [[-5, -4], [4, -4]]) P.el(cx + dx, by + dy, 2, 1.5, 'k0', true);
      P.line(cx - 3, by + 1, cx + 3, by + 1, 'k0', true);
      // blind: statt Augen glimmen die Fühlerspitzen
      if (!P0.aus) { let k = 0; for (let i = 4; i < fu.length; i += 7) { const e = fu[i]; P.set(r(e.x2), r(e.y2), k % 2 ? 'glut' : 'kern'); augen.push([r(e.x2), r(e.y2)]); k++; } }
    };
    return { gruppen, details, augen };
  },
};
