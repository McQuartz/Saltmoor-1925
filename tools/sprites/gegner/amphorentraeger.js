// Der Wasserträger der Legion (Ziegelgruben). Er brachte den Ziegelstreichern das Wasser für den
// Lehm, zwei Amphoren an einem Joch, und er hat nie aufgehört, obwohl der Lehm längst trocken ist.
// Ein ausgezehrter Mann mit Lederhelm; die Amphoren sind ihm an die Schultern gewachsen, und aus
// ihren Hälsen läuft Wasser, mit dem er die anderen kühlt. Angriff: er schwingt das Joch herum.
'use strict';
module.exports = {
  id: 'amphorentraeger', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 96, h: 120, fuss: [48, 115], kopf: [46, 30], rimBis: 112,
  varianten: {
    amphorentraeger_a: { amph: 1, helm: 1 },
    amphorentraeger_b: { amph: 1.2, helm: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, schwung = 0, fall = 0, glanz = 1, tropf = 0;
    if (p.idle) { tropf = f; schwung = [0, 0.02, 0, -0.02][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; schwung = [0.2, 0.35, -0.45, -0.15][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 48, ox = lean, sy = 42 + fall;
    const tunika = Pg([[cx - 10 + ox, sy], [cx + 10 + ox, sy - 1], [cx + 12, sy + 34], ...saum(cx + 12, cx - 12, sy + 42, 4, 3, 9), [cx - 12, sy + 34]], null, { rd: 1.4 });
    const beine = [...glied([[cx - 5, sy + 40], [cx - 6, 100], [cx - 8, 113]], 2.6, 2, 'haut'), ...glied([[cx + 5, sy + 40], [cx + 6, 100], [cx + 8, 113]], 2.6, 2, 'haut')];
    const kx = cx - 2 + ox * 1.2, ky = sy - 9;
    const kopf = E(kx, ky, 6, 7, 'haut');
    const helm = v.helm ? [Pg([[kx - 7, ky - 1], [kx - 6, ky - 8], [kx + 4, ky - 9], [kx + 8, ky - 2], [kx + 8, ky + 4], [kx + 5, ky - 1]], null, { rd: 1, pf: 'bevel' })] : [];
    // Joch über den Schultern, zwei Amphoren an den Enden
    const a = schwung, L = 26, jx = cx + ox, jy = sy + 1;
    const ends = [-1, 1].map(s => [jx + s * L * Math.cos(a), jy + s * L * Math.sin(a)]);
    const joch = C(ends[0][0], ends[0][1], ends[1][0], ends[1][1], 1.6, 1.6, 'dunkel', { pf: 'flat' });
    const amphoren = ends.map(([x, y], i) => { const z = v.amph; const ay = y + 8; return [C(x, y, x, ay - 4, 0.6, 0.6, 'dunkel', { noRim: true }), Pg([[x - 1.5, ay - 4], [x + 1.5, ay - 4], [x + 2, ay + 1], [x + 6 * z, ay + 5], [x + 5 * z, ay + 16 * z], [x + 1, ay + 26 * z], [x - 1, ay + 26 * z], [x - 5 * z, ay + 16 * z], [x - 6 * z, ay + 5], [x - 2, ay + 1]], null, { rd: 1, pf: 'bevel' }), C(x - 2, ay - 2, x - 6 * z, ay + 4, 0.8, 0.8, null, { pf: 'flat' })]; });
    const arme = [...glied([[cx - 8 + ox, sy + 3], [cx - 14 + ox, sy - 2], [ends[0][0] + 6, ends[0][1]]], 2.2, 1.6, 'haut'), ...glied([[cx + 8 + ox, sy + 3], [cx + 14 + ox, sy - 2], [ends[1][0] - 6, ends[1][1]]], 2.2, 1.6, 'haut')];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: amphoren[1], k: 0.5, pf: 'bevel' },
      { p: beine, k: 1 },
      { p: [tunika], k: 2 },
      { p: [kopf, ...helm], k: 1 },
      { p: [joch], k: 0, pf: 'flat' },
      { p: arme, k: 1 },
      { p: amphoren[0], k: 0.5, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Ziegelfarbene Bänder an den Amphoren, Wasser tropft aus den Hälsen
      ends.forEach(([x, y], i) => { P.line(r(x - 6), r(y + 16), r(x + 6), r(y + 16), 'ziegel', true); P.line(r(x - 5), r(y + 22), r(x + 5), r(y + 22), 'ziegel', true); if (!tot) { P.set(r(x + 4), r(y + 4 + ((tropf + i) % 3) * 2), 'r1'); } });
      P.line(r(cx - 10 + ox / 2), sy + 18, r(cx + 10 + ox / 2), sy + 18, 'k0', true);
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
