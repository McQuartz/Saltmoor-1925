// Die Etikettiererin (Konservenfabrik). Sie hat die Etiketten auf die Dosen geklebt, mit dem Pinsel und
// dem Leimtopf, und irgendwann hat sie angefangen, sie auf alles zu kleben. Ihr Kittel ist voll davon,
// ihr Gesicht auch: auf jedem steht „Inhalt“. Was sie beklebt, ist teurer. Angriff: der Leimpinsel klatscht.
'use strict';
module.exports = {
  id: 'etikettiererin', biom: 'fabrik', zone: 'fabrik', w: 96, h: 120, fuss: [48, 115], kopf: [48, 26], rimBis: 112,
  varianten: { etikettiererin_a: { topf: 1, breit: 1 }, etikettiererin_b: { topf: 1.3, breit: 1.12 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let pin = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { pin = [0, 1, 2, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { pin = [-4, -8, 12, 4][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50 + lean, sy = 36 + fall, w = v.breit;
    const kittel = Pg([[cx - 10 * w, sy], [cx + 10 * w, sy - 1], [cx + 14 * w, sy + 30], [cx + 16 * w, 106], ...saum(cx + 16 * w, cx - 15 * w, 110, 5, 2, 3), [cx - 15 * w, 106], [cx - 13 * w, sy + 30]], null, { rd: 2 });
    const beine = [C(cx - 5, 106, cx - 6, 113, 2.4, 2.2, null), C(cx + 5, 106, cx + 6, 113, 2.4, 2.2, null)];
    const kx = cx, ky = sy - 9;
    const kopf = E(kx, ky, 6, 7, null, { rd: 1.3 });
    const haube = Pg([[kx - 7, ky - 3], [kx - 5, ky - 9], [kx + 5, ky - 9], [kx + 7, ky - 3]], null, { rd: 1, pf: 'flat', tone: 0.12 });
    const hx = cx - 20, hy = sy + 18 - pin;
    const armV = glied([[cx - 8, sy + 4], [cx - 16, sy + 10], [hx, hy]], 2.4, 2, null);
    const pinsel = [C(hx, hy, hx - 6, hy - 8, 1, 1, 'dunkel', { pf: 'flat' }), E(hx - 7, hy - 10, 2.4, 3, null, { pf: 'dome' })];
    const armH = glied([[cx + 8, sy + 4], [cx + 14, sy + 16], [cx + 14, sy + 28]], 2.4, 2, null);
    const topf = Pg([[cx + 8, sy + 28], [cx + 20, sy + 28], [cx + 19, sy + 28 + 10 * v.topf], [cx + 9, sy + 28 + 10 * v.topf]], 'dunkel', { rd: 1, pf: 'bevel' });
    const gruppen = [
      { p: beine, k: 1 },
      { p: armH, k: 1 },
      { p: [kittel], k: 3 },
      { p: [topf], k: 0, pf: 'bevel' },
      { p: [kopf], k: 2 },
      { p: [haube], k: 1, pf: 'flat' },
      { p: armV, k: 1 },
      { p: pinsel, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Etiketten überall: kleine helle Rechtecke mit roter Linie
      for (const [dx, dy] of [[-8, 10], [4, 22], [-6, 40], [6, 52], [-4, 64], [8, 36]]) { P.line(r(cx + dx), r(sy + dy), r(cx + dx + 4), r(sy + dy), 'k3'); P.set(r(cx + dx + 1), r(sy + dy + 1), 'rost'); }
      P.line(r(kx - 4), r(ky + 3), r(kx + 3), r(ky + 3), 'k3');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
