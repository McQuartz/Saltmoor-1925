// Der Vermesser (namenlose Stadt). Er hat für die Expedition von 1903 die Stadt vermessen, mit dem
// Theodolit auf dem Dreibein, und die Winkel ergaben nie dieselbe Summe. Er misst weiter. Sein Kopf
// steckt im Fernrohr, das Dreibein ist mit seinen Beinen verwachsen, und er sieht deinen nächsten Zug,
// bevor du ihn machst. Angriff: die Messlatte schlägt.
'use strict';
module.exports = {
  id: 'vermesser', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [48, 115], kopf: [42, 30], rimBis: 112,
  varianten: { vermesser_a: { latte: 1 }, vermesser_b: { latte: 1.2 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let a = 0.08, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { a = [0.08, 0.07, 0.08, 0.09][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [-0.1, -0.3, 0.8, 0.4][f]; lean = [1, 2, -3, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); glanz = f < 2 ? 0.6 : 0; }
    const cx = 54 + lean, sy = 48 + fall;
    const mantel = Pg([[cx - 10, sy], [cx + 10, sy - 2], [cx + 14, sy + 26], [cx + 12, sy + 40], [cx - 12, sy + 40], [cx - 14, sy + 26]], null, { rd: 2 });
    const dreibein = [[-16, 113], [16, 113], [2, 114]].map(([dx, y]) => C(cx, sy + 38, cx + dx, y, 2.2, 1.6, 'dunkel', { pf: 'bevel' }));
    // Kopf im Fernrohr: Rohr waagerecht nach links
    const kx = cx - 4, ky = sy - 10;
    const hinterkopf = E(kx + 4, ky, 6, 6.5, null, { rd: 1.3 });
    const rohr = C(kx + 2, ky, kx - 18, ky - 1, 3.4, 4, 'dunkel', { pf: 'bevel' });
    const hut = Pg([[kx - 2, ky - 4], [kx, ky - 9], [kx + 10, ky - 9], [kx + 12, ky - 4]], null, { rd: 1 });
    // Messlatte in der hinteren Hand, rot-weiß
    const hx = cx + 16, hy = sy + 20;
    const armH = glied([[cx + 8, sy + 4], [cx + 16, sy + 12], [hx, hy]], 2.4, 2, null);
    const L = 60 * v.latte, tx = hx - Math.sin(a) * L * 0.7, ty = hy - Math.cos(a) * L * 0.7, bx = hx + Math.sin(a) * L * 0.3, by = hy + Math.cos(a) * L * 0.3;
    const latte = C(bx, Math.min(by, 114), tx, ty, 1.6, 1.6, null, { pf: 'flat' });
    const armV = glied([[cx - 8, sy + 4], [cx - 14, sy + 4], [kx - 12, ky + 2]], 2.4, 2, null);
    const gruppen = [
      { p: dreibein, k: 0, pf: 'bevel' },
      { p: [mantel], k: 3 },
      { p: [hinterkopf], k: 2 },
      { p: [hut], k: 2 },
      { p: [rohr], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [latte], k: 1, pf: 'flat' },
      { p: armH, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Teilung auf der Latte, Messing am Theodolit, Notizen
      for (let t = 0.1; t < 1; t += 0.2) P.set(r(bx + (tx - bx) * t), r(by + (ty - by) * t), 'binde');
      P.set(r(kx - 4), r(ky - 3), 'k3');
      if (glanz > 0) {
        // das Auge sitzt im Objektiv
        const ex = r(kx - 19), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex, ey + 1, 'glut');
        P.glow(ex, ey, 5 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
