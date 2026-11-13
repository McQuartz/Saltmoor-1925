// Der Abt (Kloster, Elite). Er hat das Kloster nicht verlassen, als die Brüder gingen, und er ruft
// jeden Tag einen Novizen herbei, den es nicht gibt. Sie kommen trotzdem. Ein schwerer Mann in
// der Kukulle, die Kapuze tief, in der Hand der Krummstab, dessen Krümme sich nach innen eindreht
// wie eine Schnecke. Er segnet die Seinen, und sie heilen. Angriff: der Stab fährt nieder.
'use strict';
module.exports = {
  id: 'abt', biom: 'kloster', zone: 'kloster', w: 128, h: 160, fuss: [64, 155], kopf: [56, 40], rimBis: 152, rang: 'elite',
  varianten: { abt: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stab = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stab = [-4, -10, 14, 6][f]; lean = [2, 3, -7, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; }
    const cx = 68, ox = lean, sy = 52 + fall;
    const kutte = Pg([[cx - 20 + ox, sy + 6], [cx - 8 + ox, sy - 8], [cx + 12 + ox, sy - 8], [cx + 24 + ox, sy + 6], [cx + 28, sy + 50], [cx + 30, 146], ...saum(cx + 30, cx - 28, 150, 7, 3, 5), [cx - 28, 146], [cx - 26, sy + 50]], null, { rd: 2.4 });
    const kx = cx - 4 + ox * 1.2, ky = sy - 8 + atem;
    const kapuze = Pg([[kx - 12, ky + 8], [kx - 11, ky - 6], [kx - 2, ky - 14], [kx + 10, ky - 10], [kx + 14, ky + 4], [kx + 8, ky + 12]], null, { rd: 2 });
    const loch = E(kx - 3, ky + 1, 6, 7, 'dunkel', { pf: 'flat' });
    // Krummstab: lang, Krümme als Schnecke aus Segmenten
    const hx = cx - 24 + ox, hy = sy + 30 + stab * 0.3;
    const top = hy - 64 + stab, bx = hx - 2, by = hy + 50 + stab;
    const schaft = C(bx, Math.min(by, 150), hx - 1, top, 1.8, 1.6, 'dunkel', { pf: 'bevel' });
    const kr = [];
    let px = hx - 1, py = top;
    for (let i = 0; i < 9; i++) { const w = -Math.PI / 2 + i * 0.6, rr = 9 - i * 0.8; const nx = hx - 1 - 6 + Math.cos(w) * rr + 6, ny = top - 6 + Math.sin(w) * rr + 6; kr.push(C(px, py, nx - 6, ny - 6, 1.6 - i * 0.08, 1.5 - i * 0.08, 'dunkel', { pf: 'bevel' })); px = nx - 6; py = ny - 6; }
    const armV = glied([[cx - 16 + ox, sy + 6], [cx - 26 + ox, sy + 18], [hx, hy]], 4.4, 3.6, null);
    const hand = E(hx, hy, 4, 4, 'haut');
    const armH = glied([[cx + 20 + ox, sy + 6], [cx + 24 + ox, sy + 22], [cx + 16 + ox, sy + 34]], 4.4, 3.6, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [kutte], k: 3 },
      { p: [kapuze], k: 2 },
      { p: [loch], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : [schaft, ...kr], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [hand], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Strick um den Bauch, Tintenflecken, Kerze an der Krümme
      P.line(r(cx - 24 + ox / 2), r(sy + 40), r(cx + 26 + ox / 2), r(sy + 42), 'k0', true);
      P.line(r(cx - 6), r(sy + 42), r(cx - 7), r(sy + 60), 'k0', true);
      for (const [x, y] of [[cx + 10, sy + 70], [cx - 14, sy + 88], [cx + 18, sy + 100]]) P.set(r(x), r(y), 'tinte');
      if (glanz > 0) {
        if (!tot) { P.set(r(hx - 1), r(top - 2), 'flamme'); P.glow(hx - 1, top - 2, 4, 0.5, 'glutDim', 'k3'); }
        const ex = r(kx - 6), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
