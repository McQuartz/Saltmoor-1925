// Die Wärterfrau (Leuchtturm, Elite). Die Frau des letzten Wärters, die nach dem Sturm von 1921
// oben geblieben ist und das Glas putzt. Ihr Blick hält dich fest wie das Feuer die Möwen, und die
// Möwen kommen zurück, wenn sie ruft. Eine hagere Frau, das Tuch um den Kopf, auf dem Rücken die
// Fresnel-Linse wie ein gläserner Buckel. Angriff: das Licht bricht durch die Linse.
'use strict';
module.exports = {
  id: 'waerterfrau', biom: 'leuchtturm', zone: 'leuchtturm', w: 128, h: 160, fuss: [64, 155], kopf: [52, 46], rimBis: 152, rang: 'elite',
  varianten: { waerterfrau: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, wisch = 0, fall = 0, glanz = 1, licht = 1;
    if (p.idle) { wisch = [0, 2, 4, 2][f]; licht = [1, 1.1, 0.9, 1.05][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; licht = [1.2, 1.5, 2.2, 1.3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; licht = 0.6; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; licht = f < 2 ? 0.5 : 0; }
    const cx = 62, ox = lean, sy = 56 + fall;
    const rock = Pg([[cx - 10 + ox, sy], [cx + 12 + ox, sy - 2], [cx + 18, sy + 40], [cx + 22, 146], ...saum(cx + 22, cx - 20, 150, 6, 3, 4), [cx - 20, 146], [cx - 16, sy + 40]], null, { rd: 2 });
    // Linse auf dem Rücken: Kuppel aus Ringen
    const lx = cx + 20 + ox, ly = sy + 8;
    const linse = E(lx, ly, 17, 20, null, { pf: 'dome', rd: 1 });
    const kx = cx - 10 + ox * 1.3, ky = sy - 6;
    const kopf = E(kx, ky, 6.5, 7, null, { rd: 1.4 });
    const tuch = Pg([[kx - 8, ky - 2], [kx - 6, ky - 9], [kx + 4, ky - 11], [kx + 10, ky - 4], [kx + 12, ky + 6], [kx + 4, ky + 2]], null, { rd: 1.6 });
    // Arm mit Putzlappen nach vorn
    const hx = cx - 24 + ox, hy = sy + 18 - wisch;
    const armV = glied([[cx - 6 + ox, sy + 4], [cx - 16 + ox, sy + 12], [hx, hy]], 2.6, 2.2, null);
    const lappen = Pg([[hx - 4, hy - 3], [hx + 2, hy - 4], [hx + 3, hy + 3], [hx - 2, hy + 7], [hx - 6, hy + 4]], null, { rd: 1, pf: 'flat', tone: 0.15 });
    const armH = glied([[cx + 8 + ox, sy + 4], [cx + 10 + ox, sy + 18], [cx + 4 + ox, sy + 28]], 2.6, 2.2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : [linse], k: 1.5, pf: 'dome' },
      { p: armH, k: 1 },
      { p: [rock], k: 3 },
      { p: [kopf], k: 2 },
      { p: [tuch], k: 2 },
      { p: armV, k: 1 },
      { p: [lappen], k: 1, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Linsenringe aus Glas, das Feuer in der Mitte
      if (!tot) {
        for (let i = -3; i <= 3; i++) P.line(r(lx - 14 + Math.abs(i)), r(ly + i * 5), r(lx + 14 - Math.abs(i)), r(ly + i * 5), 'glas', true);
        if (licht > 0) { P.set(r(lx), r(ly), 'kern'); P.set(r(lx + 1), r(ly), 'glut'); P.glow(lx, ly, 9 * licht, 0.8 * licht, 'glutDim', 'k3'); }
      }
      P.set(r(cx - 2 + ox), r(sy + 12), 'messing');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
