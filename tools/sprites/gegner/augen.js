// Augen im Rand (Pforte). Ein schwebendes Auge mit einem Lid aus Randlicht und dünnen Fäden darunter.
// Der Boss ruft sie herbei. Kleine Figur auf der normalen Fläche 96 × 120; fuss = Schattenpunkt.
'use strict';
module.exports = {
  id: 'augen', biom: 'pforte', zone: 'pforte', w: 96, h: 120, fuss: [48, 112], kopf: [48, 40],
  varianten: { augen_a: { gr: 9, faeden: 3 }, augen_b: { gr: 7, faeden: 4, schraeg: 0.3 } },
  bild(p, v, A) {
    const { E, C, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 10, fall: 10 }), f = p.f;
    const x = 48 + P0.lean, y = 64 + (p.idle ? [0, 0, -1, -1][f] : 0) + P0.fall, G = v.gr;
    const lid = p.idle && f === 3 ? 0.3 : p.angriff ? [0.6, 1, 1.1, 0.8][f] : p.treffer ? 0.2 : 1;
    const ball = E(x, y, G * 1.4, G, 'haut', { pf: 'dome' });
    const ober = glied([[x - G * 1.7, y + 1], [x - G * 0.6, y - G * 1.3], [x + G * 0.6, y - G * 1.35], [x + G * 1.7, y - 1]], 1.6, 1.2, null);
    const faeden = [], fp = p.idle ? 0 : f;
    for (let i = 0; i < v.faeden; i++) { const fx = x - G * 0.6 + i * (G * 1.2) / (v.faeden - 1); faeden.push(...glied([[fx, y + G - 1], [fx + Math.sin(i + fp * 0.6) * 2, y + G + 12], [fx + Math.sin(i * 2 + fp * 0.6) * 3 - 2, y + G + 24 + (i % 2) * 6]], 1.1, 0.4, null)); }
    const gruppen = [{ p: faeden, k: 0, anker: [0, y] }, { p: [ball], k: 0, anker: [0, y] }, { p: ober, k: 0, anker: [0, y] }];
    const augen = [];
    const details = P => {
      if (P0.aus) { P.line(x - G, y, x + G, y, 'k0', true); return; }
      const h = Math.max(1, Math.round(G * 0.7 * lid));
      P.el(x, y + 0.5, G * 0.9, h, 'glutDim', true);
      if (h > 1) { P.el(x - 1, y + 0.5, G * 0.4, Math.min(h, G * 0.4), 'glut', true); P.el(x - 1, y + 0.5, 1.8, Math.min(h, 2), 'k0', true); }
      P.set(r(x - 3), r(y - (h > 1 ? 1 : 0)), 'kern');
      augen.push([r(x - 1), r(y)]);
    };
    return { gruppen, details, augen };
  },
};
