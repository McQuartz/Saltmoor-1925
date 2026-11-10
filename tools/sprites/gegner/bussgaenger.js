// Der Bußgänger (Grotte der Gaben, Elite). Er ist auf den Knien zur Grotte gekommen, von der Küste
// her, und auf den Knien geblieben. Die Knie sind Stümpfe geworden, auf denen er rutscht, und auf dem
// Rücken trägt er das Kreuz, das mit jedem Schritt schwerer wird. Aus dem Boden hinter ihm wachsen die
// Wachshände. Angriff: er wirft sich mit dem Kreuz nach vorn.
'use strict';
module.exports = {
  id: 'bussgaenger', biom: 'grotte', zone: 'grotte', w: 128, h: 160, fuss: [64, 155], kopf: [48, 64], rimBis: 152, rang: 'elite',
  varianten: { bussgaenger: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { lean = [3, 6, -14, -5][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64 + lean, sy = 82 + fall;
    const kutte = Pg([[cx - 18, sy + 6], [cx - 8, sy - 4], [cx + 14, sy - 6], [cx + 24, sy + 8], [cx + 30, 148], ...saum(cx + 30, cx - 26, 152, 7, 2, 4), [cx - 26, 148], [cx - 24, sy + 40]], null, { rd: 2.2 });
    const kx = cx - 16 + lean * 0.4, ky = sy - 10 + atem * 0.5;
    const kopf = E(kx, ky, 7, 7.5, null, { rd: 1.4 });
    const kapuze = Pg([[kx - 9, ky + 4], [kx - 8, ky - 6], [kx + 2, ky - 12], [kx + 12, ky - 4], [kx + 14, ky + 8]], null, { rd: 1.6 });
    // Kreuz auf dem Rücken, schräg
    const kreuzL = C(cx - 6, sy - 42, cx + 40, 148, 4, 4, 'dunkel', { pf: 'bevel' });
    const kreuzQ = C(cx - 9, sy - 14, cx + 15, sy - 24, 3, 3, 'dunkel', { pf: 'bevel' });
    const arme = [glied([[cx - 12, sy + 4], [cx - 24, sy + 24], [cx - 30 - Math.max(0, -lean), sy + 50]], 3.2, 2.6, null), glied([[cx + 14, sy + 2], [cx + 8, sy - 6], [cx + 2, sy - 12]], 3.2, 2.6, null)];
    const haende = [E(cx - 30 - Math.max(0, -lean), sy + 52, 4, 3.5, 'haut'), E(cx + 2, sy - 13, 3.6, 3.2, 'haut')];
    const wachs = [[100, 150, 14], [112, 152, 10], [16, 152, 8]].map(([x, y, h]) => glied([[x, y], [x - 2, y - h * 0.6], [x + 1, y - h]], 2.2, 1.6, null));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : wachs.flat(), k: 1 },
      { p: [kreuzL], k: 1, pf: 'bevel' },
      { p: [kutte], k: 3 },
      { p: [kreuzQ], k: 1, pf: 'bevel' },
      { p: [kapuze], k: 2 },
      { p: [kopf], k: 2 },
      { p: arme.flat(), k: 1 },
      { p: haende, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Schleifspur, Wachs an den Fingern, Strick
      for (let x = cx + 30; x < 126; x += 4) P.set(x, 154, 'wachs');
      for (const [x, y] of [[100, 136], [112, 142], [16, 144]]) P.set(x, y, 'flamme');
      P.line(r(cx - 20), r(sy + 30), r(cx + 24), r(sy + 32), 'k0', true);
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
