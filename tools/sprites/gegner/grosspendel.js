// Gezeitenwerk, dritter Wächter: Das Großpendel. Das Pendel, das das ganze Werk im Gang hält, hat sich
// aus der Aufhängung gelöst und hängt jetzt an sich selbst: ein Gestänge aus Bronze auf drei Beinen,
// unten die schwere Linse, in der ein Gesicht eingegossen ist. Es schwingt im Takt, und zwischen zwei
// Schlägen ist es offen. Angriff: die Linse schwingt durch.
'use strict';
module.exports = {
  id: 'grosspendel', biom: 'gezeitenwerk', zone: 'gezeitenwerk', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 120], rimBis: 172,
  varianten: { grosspendel: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let a = 0, fall = 0, glanz = 1;
    if (p.idle) { a = [0, 0.015, 0, -0.015][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [0.3, 0.5, -0.5, -0.2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { a = [0.15, 0.06][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); a = p.q * 0.4; glanz = f < 2 ? 0.6 : 0; }
    const ax = 80, ay = 26 + fall;
    // Dreibein
    const beine = [[-52, 174], [52, 174], [10, 176]].map(([dx, y]) => C(ax, ay, ax + dx, y, 2.4, 3, 'dunkel', { pf: 'bevel' }));
    const kopfstueck = Pg([[ax - 12, ay - 6], [ax + 12, ay - 6], [ax + 8, ay + 8], [ax - 8, ay + 8]], null, { rd: 1.2, pf: 'bevel' });
    const L = 100;
    const lx = ax + Math.sin(a) * L, ly = ay + Math.cos(a) * L;
    const stange = [C(ax - 2, ay + 4, lx - 2, ly, 1.6, 1.6, null, { pf: 'bevel' }), C(ax + 2, ay + 4, lx + 2, ly, 1.6, 1.6, null, { pf: 'bevel' })];
    const linse = E(lx, ly + 10, 24, 20, null, { pf: 'dome', rd: 1.6 });
    const rad = E(ax, ay - 14, 14, 14, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [rad], k: 0, pf: 'flat' },
      { p: [beine[2]], k: 0, pf: 'bevel' },
      { p: stange, k: 1, pf: 'bevel' },
      { p: tot ? [] : [linse], k: 3, pf: 'dome' },
      { p: [beine[0], beine[1]], k: 1, pf: 'bevel' },
      { p: [kopfstueck], k: 2, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Gesicht in der Linse, Gradbogen unten, Zähne am Rad
      for (let i = -5; i <= 5; i++) { const w = i * 0.1; P.set(r(ax + Math.sin(w) * 126), r(ay + Math.cos(w) * 126), 'bronze'); }
      for (let i = 0; i < 12; i++) { const w = i / 12 * Math.PI * 2; P.set(r(ax + Math.cos(w) * 15), r(ay - 14 + Math.sin(w) * 15), 'bronze'); }
      if (!tot) { P.line(r(lx - 10), r(ly + 22), r(lx + 10), r(ly + 22), 'k0', true); P.line(r(lx - 16), r(ly + 2), r(lx + 16), r(ly + 2), 'wasser'); }
      if (glanz > 0 && !tot) {
        const ex = r(lx - 7), ey = r(ly + 10);
        P.set(ex, ey, 'kern'); P.set(ex + 14, ey, 'glut');
        P.glow(ex + 7, ey, 9 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 14, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
