// Der Lehmhund (Ziegelgruben). Der Hund, der über die trocknenden Ziegel lief; man findet seine Pfoten in
// römischen Ziegeln bis heute. Aus ungebranntem Lehm, zu lang, auf sechs Beinen. Sein Kopf ist ein Ziegel,
// flach und rechteckig, mit dem Stempel der Legion auf der Stirn; die Augen sind zwei Fingerabdrücke, in
// denen Glut sitzt. In seiner Kehle glimmt es, als hätte man ihn mit dem Ofen gefüttert.
'use strict';
const LIB = require('../lib');
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}

module.exports = {
  id: 'lehmhund', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 96, h: 120, fuss: [50, 115], kopf: [30, 62], rimBis: 113,
  varianten: {
    lehmhund_a: { lang: 52, kopfTief: 1, ruecken: 70 },
    lehmhund_b: { lang: 54, kopfTief: 0.4, ruecken: 66, buckel: 6, schwanz: true },
  },
  // Silhouetten-Probe (verworfen): Kopf hoch erhoben wie beim Heulen las sich als gewöhnlicher Hund (Leithund,
  // Steinhirsch). Der Kopf tief am Boden, vorgestreckt wie ein Ziegel auf einem Hals, ist fremder und lesbarer.
  proben: { sil_heulen: { lang: 58, kopfTief: -1.4, ruecken: 70 } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, duck = 0, maul = 0, fall = 0, schritt = 0, sack = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; maul = [0, 0.3, 0.6, 0.3][f]; }
    if (p.angriff) { lean = [4, 6, -7, -3][f]; duck = [3, 5, -2, 0][f]; maul = [0.3, 0.6, 1.4, 0.8][f]; schritt = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; duck = 1; }
    if (p.tod) { sack = p.q; fall = r(p.q * 8); }
    const T = fall + duck;
    const x0 = 30 + lean, x1 = x0 + v.lang, ry = v.ruecken + T + r(sack * 10); // Schultern vorn bei x0+6, Hüfte bei x1
    // Leib: lang, dünn in der Mitte, Brustkorb vorn tief, Becken hinten
    const bauch = ry + 15 - sack * 4;
    const leib = Pg([[x0 + 2, ry + 4], [x0 + 12, ry - 2 - (v.buckel || 0) * 0.3], [x0 + v.lang * 0.3, ry + 1 - (v.buckel || 0) * 0.6], [x0 + v.lang * 0.55, ry + 4 - (v.buckel || 0)], [x1 - 6, ry - 2], [x1 + 4, ry + 3], [x1 + 3, ry + 12], [x1 - 8, bauch - 2], [x0 + v.lang * 0.55, bauch + 7 - sack * 2], [x0 + v.lang * 0.35, bauch + 4], [x0 + 14, bauch + 3], [x0 + 2, bauch + 1]], null, { rd: 3 });
    // sechs Beine: vorn, Mitte, hinten; je ein Paar (hinteres Bein des Paars dunkler, eine Gruppe davor)
    const beinPaar = (bx, ph, dick) => {
      const s = schritt ? Math.sin(ph + schritt * 1.2) * 4 : 0;
      const kn = sack * 7;
      const vorn = glied([[bx, bauch - 4], [bx - 5 + s, bauch + 12 - kn], [bx - 2 + s, 111 - kn * 0.2], [bx - 6 + s, 114]], dick * 1.5, 1.5, null);
      const hinten = glied([[bx + 4, bauch - 4], [bx + 8 - s, bauch + 11 - kn], [bx + 4 - s, 111 - kn * 0.2], [bx + 1 - s, 114]], dick * 1.2, 1.3, null);
      return { vorn, hinten };
    };
    const b1 = beinPaar(x0 + 8, 0, 3.4), b2 = beinPaar(x0 + v.lang * 0.5, 2, 2.8), b3 = beinPaar(x1 - 4, 4, 3.6);
    // Hals und Kopf: der Hals lang und gesenkt, der Kopf ein Ziegel
    const kt = v.kopfTief;
    const hx = x0 - 4 - (p.angriff ? Math.max(0, -lean) * 0.3 : 0), hy = ry + 12 + kt * 10 - (kt < 0 ? 22 : 0) + r(sack * 6);
    const hals = glied([[x0 + 6, ry + 4], [x0 - 1, ry + 6 + kt * 4], [hx + 4, hy - 2]], 5, 4, null);
    const kw = 21, kh = 11, ka = kt < 0 ? -0.5 : 0.18 + sack * 0.3; // Kopf leicht nach unten geneigt
    const rot = (u, w) => [hx + u * Math.cos(ka) - w * Math.sin(ka), hy + u * Math.sin(ka) + w * Math.cos(ka)];
    const kopf = Pg([rot(-kw * 0.7, -kh / 2), rot(kw * 0.3, -kh / 2), rot(kw * 0.3, kh / 2 - maul), rot(-kw * 0.7, kh / 2 - maul)], 'haut', { rd: 0.6, b: 1.8 });
    const kiefer = Pg([rot(-kw * 0.66, kh / 2 - 1 + maul * 2), rot(kw * 0.2, kh / 2 - 1), rot(kw * 0.2, kh / 2 + 2), rot(-kw * 0.62, kh / 2 + 2 + maul * 3)], null, { rd: 0.6, b: 1.4 });
    // Schwanz: ein Wulst Lehm, der hinten zu Boden läuft (b: lang, tropfend)
    const schwanz = v.schwanz ? glied([[x1 + 3, ry + 5], [x1 + 10, ry + 12], [x1 + 12, ry + 26], [x1 + 10, 112]], 2.6, 1.4, null) : glied([[x1 + 3, ry + 5], [x1 + 9, ry + 9], [x1 + 12, ry + 16]], 2.6, 1.2, null);
    const gruppen = [
      { p: [...b1.hinten, ...b2.hinten, ...b3.hinten], k: 1, tone: -0.2, noRim: true },
      { p: schwanz, k: 1, kante: true },
      { p: [leib], k: 2 },
      { p: [...b1.vorn, ...b2.vorn, ...b3.vorn], k: 1.2, kante: true },
      { p: hals, k: 1.5, kante: true },
      { p: [kiefer], k: 0, kante: true },
      { p: [kopf], k: 0, kante: true },
    ];
    const LEIB = 2, KOPF = 6, KIEFER = 5, HALS = 4;
    gruppen.forEach(g => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('ziegelgruben'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => gid[r(y) * W + r(x)] === g;
      // Rippen: Bögen am Brustkorb, Grat hell, Tal dunkel; am Rücken Fingerspuren (vom Formen), längs
      for (let i = 0; i < 6; i++) for (let t = 0; t <= 1; t += 0.07) {
        const x = r(x0 + 12 + i * 4.2 + t * 2), y = r(ry + 3 + t * 11);
        if (ist(x, y, LEIB) && P.get(x, y) <= 4) { P.set(x, y, 'k0'); if (ist(x + 1, y, LEIB) && P.get(x + 1, y) <= 4) P.set(x + 1, y, 'k3'); }
      }
      for (let j = 0; j < 3; j++) for (let x = r(x0 + v.lang * 0.5); x < x1 - 2; x++) { const y = r(ry + 2 + j * 3 + Math.sin(x * 0.3 + j) * 0.8); if (ist(x, y, LEIB) && P.get(x, y) <= 4 && LIB.bay(x - lean, y - T) < 0.55) P.set(x, y, j === 1 ? 'k3' : 'k0'); }
      // Lehm tropft am Bauch
      for (const dx of [0.3, 0.55, 0.8]) { const x = r(x0 + v.lang * dx); let y = r(bauch - 4); while (ist(x, y + 1, LEIB)) y++; if (!p.tod) { P.set(x, y + 1, 'k2'); P.set(x, y + 2 + (f % 2), 'k3'); } }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kopf: Ziegelkante oben hell, Stempel auf der Stirn (Rechteck mit Zeichen), Fugenkante
      {
        const [sx0, sy0] = rot(-kw * 0.45, -kh / 2 + 1.5);
        for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) { const x = r(sx0 + i), y = r(sy0 + j); if (!ist(x, y, KOPF)) continue; const rand = i === 0 || i === 6 || j === 0 || j === 2; P.set(x, y, rand ? 'k0' : (i % 2 ? 'ziegel' : 'k1')); }
      }
      // Ziegelkopf: Oberseite als eigene, hellere Fläche (Lagerfläche), Unterkante dunkel
      for (let u = -kw * 0.7 + 1; u < kw * 0.3; u += 0.5) { const [x, y] = rot(u, -kh / 2 + 1); if (ist(x, y, KOPF) && P.get(r(x), r(y)) <= 4) P.set(x, y, 'ziegel'); const [x2, y2] = rot(u, kh / 2 - maul - 1); if (ist(x2, y2, KOPF) && P.get(r(x2), r(y2)) <= 4) P.set(x2, y2, 'k0'); }
      // gebrannter Kopf auf ungebranntem Leib: die Vorderfläche gedithert in Ziegelrot
      for (let w = -kh / 2 + 2; w < kh / 2 - maul - 1; w += 0.5) for (let u = -kw * 0.7 + 1; u < kw * 0.3 - 1; u += 0.5) { const [x, y] = rot(u, w); if (ist(x, y, KOPF) && P.get(r(x), r(y)) >= 2 && P.get(r(x), r(y)) <= 4 && LIB.bay(r(x) - lean, r(y) - T) < 0.3) P.set(x, y, 'ziegel'); }
      // Kehle: Glut im offenen Maul, das Licht fällt auf Kiefer und Hals
      if (!p.tod || f < 2) {
        const [mx, my] = rot(-kw * 0.15, kh / 2 - maul * 0.5 + 0.5);
        if (maul > 0.2) { for (let i = -3; i <= 3; i++) { const x = r(mx + i * 1.6), y = r(my + 0.5 + maul * 0.5); if (!ist(x, y, KOPF) && !ist(x, y, KIEFER)) continue; P.set(x, y, Math.abs(i) < 2 ? 'glut' : 'glutDim'); } }
        P.glow(mx + 2, my + 3, 7, 0.5 + maul * 0.2, 'glutDim', 'k3');
        augen.push([r(mx), r(my + 1)]);
      }
      // Augen: zwei Fingerabdrücke (Ring dunkel, Mitte Glut)
      if (!p.tod || f < 1) {
        for (const u of [-kw * 0.56, -kw * 0.18]) {
          const [ex, ey] = rot(u, 0.5); const X = r(ex), Y = r(ey);
          for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1]]) if (ist(X + dx, Y + dy, KOPF)) P.set(X + dx, Y + dy, 'k0');
          P.set(X, Y, 'kern'); P.set(X + 1, Y - 1, 'glutDim'); augen.push([X, Y]);
        }
      }
      // Pfoten: Abdrücke unter den Füßen (ein Pixel heller Lehm vorn an jeder Pfote)
      if (!p.tod) for (const bp of [b1, b2, b3]) { const g = bp.vorn[bp.vorn.length - 1]; P.auf(r(g.x2) - 2, 113, 'k3'); }
    };
    return { gruppen, details, augen, dy: atem };
  },
};
