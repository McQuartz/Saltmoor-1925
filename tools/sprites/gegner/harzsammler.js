// Der Harzsammler (Wald, der nach unten wächst). Er hat die Bäume angeritzt und das Harz in Töpfen
// gefangen, und irgendwann haben die Bäume ihn angeritzt. Aus den Schnitten in seinem Rücken läuft Harz in
// die Töpfe, die an ihm hängen, und er reibt es den anderen in die Wunden. Angriff: das Ritzmesser zieht.
'use strict';
module.exports = {
  id: 'harzsammler', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [48, 115], kopf: [42, 36], rimBis: 112,
  varianten: { harzsammler_a: { toepfe: 2 }, harzsammler_b: { toepfe: 3 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let zug = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { zug = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { zug = [-4, -8, 12, 4][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52 + lean, sy = 46 + fall;
    const leib = Pg([[cx - 14, sy + 4], [cx - 6, sy - 6], [cx + 10, sy - 6], [cx + 16, sy + 6], [cx + 14, sy + 44], [cx - 12, sy + 44]], null, { rd: 2.2 });
    const beine = [C(cx - 6, sy + 42, cx - 9, 113, 3, 2.6, null), C(cx + 6, sy + 42, cx + 8, 113, 3, 2.6, null)];
    const kx = cx - 10, ky = sy - 6;
    const kopf = E(kx, ky, 6, 6.5, null, { rd: 1.3 });
    const hut = Pg([[kx - 10, ky - 2], [kx - 4, ky - 10], [kx + 6, ky - 10], [kx + 11, ky - 2]], null, { rd: 1 });
    const toepfe = [];
    for (let i = 0; i < v.toepfe; i++) toepfe.push(Pg([[cx + 8, sy + 8 + i * 12], [cx + 18, sy + 8 + i * 12], [cx + 17, sy + 16 + i * 12], [cx + 9, sy + 16 + i * 12]], 'dunkel', { rd: 1, pf: 'bevel' }));
    const hx = cx - 22 - Math.max(0, zug), hy = sy + 20 - zug * 0.4;
    const armV = glied([[cx - 10, sy + 4], [cx - 18, sy + 12], [hx, hy]], 2.6, 2.2, null);
    const messer = Pg([[hx - 1, hy - 1], [hx - 8, hy - 6], [hx - 10, hy - 4], [hx - 2, hy + 2]], 'dunkel', { rd: 0.4, pf: 'bevel' });
    const armH = glied([[cx + 10, sy + 4], [cx + 6, sy + 18], [cx - 4, sy + 24]], 2.6, 2.2, null);
    const gruppen = [
      { p: beine, k: 1 },
      { p: [leib], k: 3 },
      { p: toepfe, k: 0, pf: 'bevel' },
      { p: armH, k: 1 },
      { p: [kopf], k: 2 },
      { p: [hut], k: 2 },
      { p: armV, k: 1 },
      { p: [messer], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Schnitte im Rücken mit Harz, gefüllte Töpfe
      for (let i = 0; i < 4; i++) { P.line(r(cx + 2 + i * 3), r(sy + 2 + i * 8), r(cx + 6 + i * 3), r(sy + 6 + i * 8), 'harz'); P.set(r(cx + 6 + i * 3), r(sy + 8 + i * 8), 'harzhell'); }
      for (let i = 0; i < v.toepfe; i++) P.line(r(cx + 10), r(sy + 9 + i * 12), r(cx + 16), r(sy + 9 + i * 12), 'harz');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
