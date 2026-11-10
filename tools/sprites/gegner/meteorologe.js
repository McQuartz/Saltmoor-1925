// Der Meteorologe (Funkstation). Er hat die Wetterberichte von der Küste aufgezeichnet, bis das
// Wetter angefangen hat, ihm zu antworten. Wo bei anderen der Kopf ist, dreht sich ein Schalenkreuz,
// und je nachdem, woher der Wind kommt, ist er gegen etwas anderes empfindlich.
// Ein Mann im Wachsmantel mit Klemmbrett. Angriff: das Schalenkreuz kippt vor und peitscht.
'use strict';
module.exports = {
  id: 'meteorologe', biom: 'funkstation', zone: 'funkstation', w: 96, h: 120, fuss: [48, 115], kopf: [48, 30], rimBis: 112,
  varianten: {
    meteorologe_a: { schalen: 3, mast: 1 },
    meteorologe_b: { schalen: 4, mast: 1.25 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let dreh = 0, kipp = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { dreh = f * 0.4; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { dreh = f * 0.9; kipp = [0, 2, -8, -3][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; dreh = 0.2; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50 + lean, sy = 50 + fall;
    const mantel = Pg([[cx - 9, sy], [cx + 9, sy - 1], [cx + 13, sy + 5], [cx + 14, sy + 22], [cx + 16, 102], ...saum(cx + 16, cx - 15, 106, 6, 2, 4), [cx - 15, 102], [cx - 13, sy + 22]], null, { rd: 2.2 });
    const beine = [C(cx - 5, 102, cx - 6, 113, 2.6, 2.4, null), C(cx + 5, 102, cx + 6, 113, 2.6, 2.4, null)];
    const hals = C(cx, sy, cx + kipp * 0.4, sy - 6, 3.2, 2.8, null);
    const kx = cx + kipp * 0.6, ky = sy - 9;
    const kopf = E(kx, ky, 6.5, 5.5, null, { rd: 1.3 });
    // Mast aus dem Scheitel, oben das Schalenkreuz
    const mx = kx + kipp, my = ky - 16 * v.mast;
    const mast = C(kx, ky - 3, mx, my, 1.1, 1.1, null, { pf: 'flat' });
    const schalen = [], arme = [];
    for (let i = 0; i < v.schalen; i++) {
      const w = dreh + i * Math.PI * 2 / v.schalen, dx = Math.cos(w) * 13, dy = Math.sin(w) * 4;
      arme.push(C(mx, my, mx + dx, my + dy, 0.9, 0.9, null, { pf: 'flat' }));
      schalen.push(E(mx + dx, my + dy, 3.6, 3, null, { pf: 'dome' }));
    }
    const brett = Pg([[cx - 20, sy + 16], [cx - 10, sy + 14], [cx - 9, sy + 28], [cx - 19, sy + 30]], null, { rd: 0.6 });
    const arm = glied([[cx - 6, sy + 3], [cx - 12, sy + 14], [cx - 14, sy + 22]], 2.8, 2.4, null);
    const arm2 = glied([[cx + 7, sy + 3], [cx + 10, sy + 16], [cx + 8, sy + 26]], 2.8, 2.4, null);
    const gruppen = [
      { p: beine, k: 1 },
      { p: [mantel], k: 3 },
      { p: arm2, k: 1 },
      { p: [hals], k: 2 },
      { p: [kopf], k: 2 },
      { p: [mast, ...arme], k: 0, pf: 'flat' },
      { p: schalen, k: 1, pf: 'dome' },
      { p: [brett], k: 0, pf: 'flat', noRim: true },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Papier auf dem Klemmbrett mit Kurve, Kupferklammer, Wachsglanz
      for (let y = 0; y < 3; y++) P.line(r(cx - 18), r(sy + 19 + y * 3), r(cx - 11), r(sy + 18 + y * 3 + (y % 2)), 'papier');
      P.line(r(cx - 17), r(sy + 15), r(cx - 13), r(sy + 14), 'kupfer');
      P.set(r(mx), r(my), 'kupfer');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut');
        P.glow(ex + 1.5, ey, 4 * glanz, 0.7 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
