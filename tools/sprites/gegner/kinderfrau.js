// Die Kinderfrau (Waisenhaus, Elite). Sie schiebt den Kinderwagen durch die Gänge, seit 1918,
// und unter der Decke bewegt sich etwas, das sie zudeckt, wann immer es herausschaut. Sie ruft die
// Zugedeckten zu sich und stellt sich schützend vor die anderen. Eine lange Frau in Schwesterntracht,
// den Kopf schräg, der Wagen hoch und schwarz. Angriff: sie stößt den Wagen auf dich zu.
'use strict';
module.exports = {
  id: 'kinderfrau', biom: 'waisenhaus', zone: 'waisenhaus', w: 128, h: 160, fuss: [64, 155], kopf: [74, 32], rimBis: 152, rang: 'elite',
  varianten: { kinderfrau: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let stoss = 0, lean = 0, fall = 0, glanz = 1, wack = 0;
    if (p.idle) { wack = [0, 1, 0, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stoss = [2, 4, -14, -5][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; }
    const cx = 80, ox = lean, sy = 44 + fall;
    const tracht = Pg([[cx - 8 + ox, sy], [cx + 10 + ox, sy - 2], [cx + 14, sy + 40], [cx + 20, 146], ...saum(cx + 20, cx - 16, 150, 6, 2, 4), [cx - 16, 146], [cx - 12, sy + 40]], null, { rd: 2 });
    const kx = cx - 2 + ox * 1.2, ky = sy - 10;
    const kopf = E(kx, ky, 6, 7.5, null, { rd: 1.4 });
    const haube = Pg([[kx - 8, ky - 4], [kx - 4, ky - 12], [kx + 8, ky - 12], [kx + 12, ky - 4], [kx + 14, ky + 10], [kx + 6, ky + 2]], null, { rd: 1.2, pf: 'flat', tone: 0.15 });
    // Kinderwagen vorn links: Korb, Verdeck, große Räder
    const wx = 36 + stoss, wy = 112 + wack;
    const korb = Pg([[wx - 22, wy - 18], [wx + 18, wy - 18], [wx + 14, wy + 4], [wx - 18, wy + 4]], null, { rd: 2.2 });
    const verdeck = Pg([[wx + 18, wy - 18], [wx + 16, wy - 34], [wx + 4, wy - 42], [wx - 6, wy - 40], [wx - 2, wy - 18]], null, { rd: 2, pf: 'bevel' });
    const decke = Pg([[wx - 22, wy - 18], [wx - 12, wy - 24 - wack], [wx - 2, wy - 20], [wx - 2, wy - 16], [wx - 22, wy - 14]], null, { rd: 1.4, pf: 'flat', tone: 0.12 });
    const raeder = [E(wx - 14, wy + 16, 10, 10, 'dunkel', { pf: 'flat' }), E(wx + 10, wy + 18, 8, 8, 'dunkel', { pf: 'flat' })];
    const griff = C(wx + 18, wy - 16, cx - 14 + ox, sy + 30, 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const arm = glied([[cx - 6 + ox, sy + 4], [cx - 12 + ox, sy + 18], [cx - 14 + ox, sy + 30]], 2.6, 2.2, null);
    const arm2 = glied([[cx + 8 + ox, sy + 4], [cx + 4 + ox, sy + 20], [cx - 12 + ox, sy + 32]], 2.6, 2.2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: arm2, k: 1 },
      { p: [tracht], k: 3 },
      { p: [kopf], k: 2 },
      { p: [haube], k: 1, pf: 'flat' },
      { p: [griff], k: 0, pf: 'flat' },
      { p: raeder, k: 0, pf: 'flat' },
      { p: [korb], k: 2 },
      { p: [verdeck], k: 1.5, pf: 'bevel' },
      { p: tot ? [] : [decke], k: 1, pf: 'flat' },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Speichen, Schürzenkante, Rotkreuz-Kalk an der Haube
      for (const [x, y, rr] of [[wx - 14, wy + 16, 8], [wx + 10, wy + 18, 6]]) { P.line(r(x - rr), r(y), r(x + rr), r(y), 'k2', true); P.line(r(x), r(y - rr), r(x), r(y + rr), 'k2', true); }
      P.line(r(cx - 10 + ox), r(sy + 18), r(cx + 10 + ox), r(sy + 18), 'kalk');
      P.set(r(kx + 2), r(ky - 9), 'kalk');
      if (glanz > 0) {
        // unter der Decke schaut etwas heraus
        if (!tot) { const ux = r(wx - 6), uy = r(wy - 20); P.set(ux, uy, 'glut'); P.set(ux + 2, uy, 'glut'); P.glow(ux + 1, uy, 4 * glanz, 0.6 * glanz, 'glutDim', 'k3'); }
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
