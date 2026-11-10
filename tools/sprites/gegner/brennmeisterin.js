// Die Brennmeisterin (Ziegelgruben, Elite). Sie hat den Feldbrand gehütet, den Meiler aus Rohlingen, der
// tagelang glühen muss, und eines Nachts hat sie sich selbst daraufgelegt, weil das Feuer zu kalt war.
// Jetzt ist sie gebrannt wie ein Ziegel, rot und hart, und in ihrem Bauch glüht es noch. Wer sie schlägt,
// verbrennt sich, und sie wird jeden Zug heißer. Angriff: sie stößt die glühende Schaufel vor.
'use strict';
module.exports = {
  id: 'brennmeisterin', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 128, h: 160, fuss: [64, 155], kopf: [60, 36], rimBis: 152, rang: 'elite',
  varianten: { brennmeisterin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let stoss = 0, lean = 0, fall = 0, glanz = 1, glut = 1;
    if (p.idle) { glut = [1, 1.1, 0.95, 1.05][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stoss = [-4, -8, 16, 6][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; glut = [1.2, 1.4, 1.8, 1.2][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; glut = 0.6; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; glut = f < 2 ? 0.5 : 0; }
    const cx = 68 + lean, sy = 52 + fall;
    const leib = Pg([[cx - 16, sy + 2], [cx - 6, sy - 6], [cx + 12, sy - 6], [cx + 20, sy + 6], [cx + 24, sy + 40], [cx + 28, 146], ...saum(cx + 28, cx - 24, 150, 6, 2, 4), [cx - 24, 146], [cx - 22, sy + 40]], null, { rd: 2.2 });
    const ofen = Pg([[cx - 10, sy + 30], [cx + 10, sy + 30], [cx + 12, sy + 52], [cx - 12, sy + 52]], 'dunkel', { rd: 2.4, pf: 'flat' });
    const kx = cx - 2, ky = sy - 14;
    const kopf = E(kx, ky, 7.5, 8, null, { rd: 1.4 });
    const tuch = Pg([[kx - 9, ky - 2], [kx - 6, ky - 10], [kx + 6, ky - 11], [kx + 10, ky - 2], [kx + 14, ky + 12], [kx + 6, ky + 2]], null, { rd: 1.4 });
    const hx = cx - 22, hy = sy + 26;
    const armV = glied([[cx - 12, sy + 4], [cx - 22, sy + 14], [hx, hy]], 3.6, 3, null);
    const sx = hx - 24 - stoss, sy1 = hy + 4;
    const stiel = C(hx + 10, hy - 2, sx, sy1, 1.6, 1.6, 'dunkel', { pf: 'flat' });
    const blatt = Pg([[sx - 8, sy1 - 5], [sx + 1, sy1 - 5], [sx + 2, sy1 + 4], [sx - 9, sy1 + 5]], 'dunkel', { rd: 1, pf: 'bevel' });
    const armH = glied([[cx + 16, sy + 4], [cx + 22, sy + 18], [hx + 10, hy - 2]], 3.6, 3, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [leib], k: 3 },
      { p: [ofen], k: 0, pf: 'flat', noRim: true },
      { p: [kopf], k: 2 },
      { p: [tuch], k: 2 },
      { p: tot ? [] : [stiel, blatt], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Ziegelhaut, Glut im Bauch und auf der Schaufel, Risse
      for (let y = sy + 4; y < 146; y += 6) for (let x = cx - 20 + ((y / 6) % 2) * 4; x < cx + 24; x += 8) if (y < sy + 28 || y > sy + 54) P.line(r(x), y, r(x + 5), y, 'ziegel', true);
      if (glut > 0) {
        for (let y = sy + 34; y < sy + 50; y += 3) for (let x = cx - 8; x < cx + 9; x += 3) if (((x + y) % 4) === 0) P.set(r(x), y, y > sy + 42 ? 'glut' : 'glutDim');
        P.glow(cx, sy + 42, 10 * glut, 0.6 * glut, 'glutDim', 'k3');
        if (!tot) { P.set(r(sx - 4), r(sy1), 'glut'); P.set(r(sx - 2), r(sy1 - 1), 'glutDim'); }
      }
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
