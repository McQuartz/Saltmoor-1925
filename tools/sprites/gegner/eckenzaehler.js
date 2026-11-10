// Der Eckenzähler (namenlose Stadt). Der Mathematiker der Expedition von 1903 sollte die Ecken der
// Stadt zählen, und er kam jeden Tag auf eine mehr. Inzwischen hat er sie selbst: Arme und Beine
// knicken an Stellen, an denen kein Gelenk ist, und jedes neue Gelenk ist eine Ecke, die er gefunden
// hat. Er findet auch die Ecke in deiner Deckung, die du nicht siehst. Angriff: der Arm klappt auf.
'use strict';
module.exports = {
  id: 'eckenzaehler', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [48, 115], kopf: [50, 26], rimBis: 112,
  varianten: { eckenzaehler_a: { knick: 1 }, eckenzaehler_b: { knick: 1.25 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let reich = 0, lean = 0, fall = 0, glanz = 1, wipp = 0;
    if (p.idle) { wipp = [0, 1, 0, -1][f] * 0.5; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { reich = [0, -0.3, 1, 0.6][f]; lean = [0, 1, -3, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const k = v.knick;
    const cx = 50 + lean, sy = 44 + fall;
    // schmaler Rumpf in der Tropenjacke, leicht gebückt
    const rumpf = Pg([[cx - 7, sy], [cx + 8, sy - 1], [cx + 10, sy + 24], [cx + 7, sy + 32], [cx - 8, sy + 32], [cx - 10, sy + 22]], null, { rd: 2 });
    // Beine mit zu vielen Knien: Zickzack bis zum Boden
    const beinL = glied([[cx - 4, sy + 30], [cx - 12 * k, sy + 44], [cx - 4, sy + 56], [cx - 13 * k, sy + 66], [cx - 8, 114]], 2.6, 2, null);
    const beinR = glied([[cx + 4, sy + 30], [cx + 12 * k, sy + 42], [cx + 5, sy + 54], [cx + 13 * k, sy + 64], [cx + 9, 114]], 2.6, 2, null);
    // Kopf mit Tropenhelm
    const kx = cx + 1, ky = sy - 9 + wipp;
    const kopf = E(kx, ky, 5.5, 6.5, null, { rd: 1.3 });
    const helm = Pg([[kx - 10, ky - 3], [kx - 5, ky - 10], [kx + 5, ky - 11], [kx + 10, ky - 3]], null, { rd: 1 });
    // hinterer Arm hält das Notizbuch an die Brust
    const armH = glied([[cx + 7, sy + 3], [cx + 15, sy + 10], [cx + 10, sy + 16], [cx + 5, sy + 14]], 2.2, 1.8, null);
    const buch = Pg([[cx + 1, sy + 10], [cx + 9, sy + 9], [cx + 10, sy + 19], [cx + 2, sy + 20]], null, { rd: 0.5 });
    // vorderer Arm: drei Knicke, beim Angriff klappt er nach vorn auf
    const ax = cx - 7, ay = sy + 3;
    const p1 = [ax - 9, ay + 6 - reich * 4], p2 = [ax - 4 - reich * 10, ay + 14 - reich * 10], p3 = [ax - 14 - reich * 16, ay + 20 - reich * 16], p4 = [ax - 10 - reich * 24, ay + 28 - reich * 22];
    const armV = glied([[ax, ay], p1, p2, p3, p4], 2.2, 1.6, null);
    const kreide = C(p4[0], p4[1], p4[0] - 2, p4[1] + 5, 1.2, 1, null, { pf: 'flat' });
    const gruppen = [
      { p: beinR, k: 0 },
      { p: armH, k: 1 },
      { p: [rumpf], k: 3 },
      { p: [buch], k: 2, pf: 'flat' },
      { p: beinL, k: 1 },
      { p: [kopf], k: 2 },
      { p: [helm], k: 2 },
      { p: armV, k: 1 },
      { p: [kreide], k: 2, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Strichlisten im Buch, Kreidespitze, Knickstellen hell markiert
      for (let i = 0; i < 4; i++) P.set(r(cx + 3 + i * 1.6), r(sy + 13), 'binde');
      for (const q of [p1, p2, p3]) P.set(r(q[0]), r(q[1]), 'k3');
      P.set(r(p4[0] - 2), r(p4[1] + 5), 'binde');
      if (glanz > 0) {
        const ex = r(kx - 2), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut');
        P.glow(ex, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
