// Die Nachgeherin (Pforte). Unten ist alles seitenverkehrt, auch sie: sie geht rückwärts, und
// ihr Gesicht sitzt am Hinterkopf. Sie weiß, was du als Nächstes tust, weil sie es schon getan hat.
// Eine Frau im Mantel, von hinten gesehen, das Haar als Knoten; darunter schaut das Gesicht.
// Angriff: sie dreht sich nicht um, die Arme greifen nach hinten.
'use strict';
module.exports = {
  id: 'nachgeherin', biom: 'pforte', zone: 'pforte', w: 96, h: 120, fuss: [48, 115], kopf: [48, 24], rimBis: 112,
  varianten: {
    nachgeherin_a: { lang: 1, knoten: 1 },
    nachgeherin_b: { lang: 1.1, knoten: 1.3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let griff = 0, lean = 0, fall = 0, glanz = 1, schritt = 0;
    if (p.idle) { schritt = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { griff = [2, 4, 16, 6][f]; lean = [-1, -2, 4, 1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 28); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean, sy = 38 + fall, L = v.lang;
    const mantel = Pg([[cx - 9 + ox, sy], [cx + 9 + ox, sy], [cx + 12, sy + 26], [cx + 15, 104 * L > 108 ? 108 : 104], ...saum(cx + 15, cx - 14, 108, 5, 2, 4), [cx - 14, 104], [cx - 11, sy + 26]], null, { rd: 2 });
    const beine = [C(cx - 4, 104, cx - 5 + schritt, 113, 2.2, 2, null), C(cx + 4, 104, cx + 5 - schritt, 113, 2.2, 2, null)];
    const kx = cx + ox * 1.1, ky = sy - 8;
    const kopf = E(kx, ky, 6.5, 7.5, null, { rd: 1.4 });
    const knoten = E(kx + 1, ky - 8, 3.4 * v.knoten, 3 * v.knoten, null, { pf: 'dome' });
    // Arme verdreht nach hinten, also zu uns
    const hx = cx - 14 - griff, hy = sy + 22 - griff * 0.4;
    const armV = glied([[cx - 8 + ox, sy + 3], [cx - 14 + ox, sy + 10], [hx, hy]], 2.4, 2, null);
    const armH = glied([[cx + 8 + ox, sy + 3], [cx + 14 + ox, sy + 14], [cx + 12 + griff * 0.4, sy + 26 - griff * 0.3]], 2.4, 2, null);
    const finger = [0, 1, 2].map(i => C(hx, hy, hx - 5, hy - 4 + i * 3, 0.8, 0.6, null, { pf: 'flat' }));
    const gruppen = [
      { p: beine, k: 1 },
      { p: [mantel], k: 3 },
      { p: [kopf], k: 2 },
      { p: [knoten], k: 1.5, pf: 'dome' },
      { p: armH, k: 1 },
      { p: armV, k: 1 },
      { p: finger, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Mantelnaht hinten, Kragen; das Gesicht am Hinterkopf, unter dem Knoten
      P.line(r(cx + ox * 0.5), r(sy + 2), r(cx), 104, 'k0', true);
      P.line(r(kx - 6), r(ky + 6), r(kx + 6), r(ky + 6), 'k3', true);
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'kern'); P.set(r(kx), r(ky + 3), 'glutDim');
        P.glow(ex + 2.5, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
