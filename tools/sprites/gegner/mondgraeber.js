// Der Mondgräber (Mond unter dem Eis, Elite). Er hat für die Sternwarte die Fundamente gegraben und ist
// nach dem kleinen Mond weitergegraben, durch das Eis, bis er hier war. Er gräbt immer noch, mit einer
// Schaufel, die mit seinen Händen verwachsen ist, und aus den Kratern ruft er die anderen herauf. Ein
// breiter Rücken voller Asche, der Kopf nach unten. Angriff: die Schaufel bricht durch die Deckung.
'use strict';
module.exports = {
  id: 'mondgraeber', biom: 'mond', zone: 'mond', w: 128, h: 160, fuss: [64, 155], kopf: [40, 70], rimBis: 152, rang: 'elite',
  varianten: { mondgraeber: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let hub = 0, lean = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { hub = [8, 16, -10, -2][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 72 + lean, sy = 66 + fall;
    const ruecken = Pg([[cx - 34, sy + 14], [cx - 20, sy - 6], [cx + 6, sy - 14], [cx + 30, sy - 6], [cx + 36, sy + 20], [cx + 30, sy + 46], [cx - 24, sy + 46]], null, { rd: 2.6 });
    const beine = [glied([[cx - 10, sy + 44], [cx - 18, sy + 64], [cx - 16, 150]], 6, 5, null), glied([[cx + 18, sy + 44], [cx + 28, sy + 66], [cx + 24, 150]], 6, 5, null)];
    const stiefel = [E(cx - 20, 152, 9, 3.5, 'dunkel'), E(cx + 22, 152, 8, 3.5, 'dunkel')];
    const kx = cx - 32, ky = sy + 6 + atem * 0.5;
    const kopf = E(kx, ky, 8, 8, null, { rd: 1.4 });
    // Schaufel mit beiden Händen, Blatt am Boden vorn
    const hx = cx - 36, hy = sy + 22 - hub;
    const arme = [glied([[cx - 24, sy + 4], [cx - 34, sy + 14], [hx, hy]], 4.6, 3.8, null), glied([[cx - 10, sy + 6], [cx - 22, sy + 20], [hx + 8, hy - 6]], 4.6, 3.8, null)];
    const ex2 = hx - 10, ey2 = Math.min(150, hy + 40 - hub * 0.5);
    const stiel = C(hx + 10, hy - 8, ex2, ey2, 1.8, 1.8, 'dunkel', { pf: 'flat' });
    const blatt = Pg([[ex2 - 8, ey2 - 2], [ex2 + 6, ey2 - 4], [ex2 + 6, ey2 + 6], [ex2 - 6, ey2 + 8]], 'dunkel', { rd: 1, pf: 'bevel' });
    const krater = E(28, 154, 24, 4, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [krater], k: 0, pf: 'flat', noRim: true },
      { p: beine.flat(), k: 1 },
      { p: stiefel, k: 0 },
      { p: [ruecken], k: 3 },
      { p: [kopf], k: 2 },
      { p: tot ? [] : [stiel, blatt], k: 0, pf: 'bevel' },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Asche auf dem Rücken, Messinglampe am Gürtel, Mondstaub
      for (let y = sy - 8; y < sy + 40; y += 5) for (let x = cx - 26; x < cx + 32; x += 6) if (((x * 3 + y * 5) % 7) === 0) P.auf(r(x), r(y), 'asche');
      P.set(r(cx + 20), r(sy + 40), 'messing');
      for (let x = 8; x < 50; x += 5) P.set(x, 151, 'bleich');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
