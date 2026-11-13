// Der Pilzsammler (Wald, der nach unten wächst). Ein alter Mann aus dem Dorf über dem Wald, der zu
// tief nach Pilzen ging. Er trägt den Korb noch am Arm, aber die Pilze wachsen jetzt aus ihm: aus
// Rücken und Schultern stehen Hüte, die schwach leuchten wie das Harz. Gift tut ihm nur halb so
// viel, er hat zu viel davon gegessen. Angriff: er schlägt mit dem Stock.
'use strict';
module.exports = {
  id: 'pilzsammler', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [48, 115], kopf: [38, 34], rimBis: 112,
  varianten: {
    pilzsammler_a: { pilze: 5, korb: 1 },
    pilzsammler_b: { pilze: 7, korb: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, schlag = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; schlag = [6, 12, -8, -2][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52, ox = lean, sy = 46 + fall;
    const leib = Pg([[cx - 14 + ox, sy + 4], [cx - 2 + ox, sy - 6], [cx + 14 + ox, sy - 2], [cx + 16, sy + 28], [cx + 14, 100], ...saum(cx + 14, cx - 14, 106, 4, 2, 7), [cx - 14, 100], [cx - 16, sy + 30]], null, { rd: 1.8 });
    const beine = [C(cx - 6, 100, cx - 8, 112, 3, 2.6, 'dunkel'), C(cx + 6, 100, cx + 7, 112, 3, 2.6, 'dunkel')];
    const kx = cx - 12 + ox * 1.3, ky = sy - 6 + atem;
    const kopf = E(kx, ky, 6, 6.5, null);
    const hut = Pg([[kx - 11, ky - 2], [kx - 4, ky - 9], [kx + 6, ky - 8], [kx + 9, ky - 1]], 'dunkel', { rd: 1, pf: 'bevel' });
    // Pilze: Stiele und Hüte aus dem Rücken
    const pilze = [];
    for (let i = 0; i < v.pilze; i++) { const t = i / (v.pilze - 1); const x0 = cx - 4 + t * 20 + ox, y0 = sy - 4 + Math.abs(t - 0.4) * 22, L = 6 + (i % 3) * 3, a = -1.9 + t * 1.3; const x1 = x0 + Math.cos(a) * L, y1 = y0 + Math.sin(a) * L; pilze.push({ st: C(x0, y0, x1, y1, 1.2, 1, null), hut: Pg([[x1 - 4, y1 + 1], [x1 - 2, y1 - 3], [x1 + 2, y1 - 3], [x1 + 4, y1 + 1]], null, { rd: 0.8, pf: 'bevel' }), x1, y1 }); }
    const hx = cx - 22 + ox + r(schlag / 3), hy = sy + 22 - schlag;
    const armV = glied([[cx - 10 + ox, sy + 4], [cx - 18 + ox, sy + 14], [hx, hy]], 2.6, 2, null);
    const stock = C(hx, hy - 4, hx - 6 + r(schlag / 2), hy + 40 - schlag * 1.2, 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const korb = v.korb ? [Pg([[cx + 14 + ox, sy + 26], [cx + 28 + ox, sy + 26], [cx + 26 + ox, sy + 38], [cx + 16 + ox, sy + 38]], null, { rd: 1, pf: 'bevel' }), C(cx + 15 + ox, sy + 26, cx + 21 + ox, sy + 16, 0.7, 0.7, 'dunkel', { noRim: true })] : [];
    const armH = glied([[cx + 10 + ox, sy + 2], [cx + 18 + ox, sy + 14], [cx + 20 + ox, sy + 18]], 2.6, 2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : pilze.map(q => q.st), k: 0 },
      { p: tot ? [] : pilze.map(q => q.hut), k: 0, pf: 'bevel' },
      { p: armH, k: 1 },
      { p: beine, k: 1 },
      { p: [leib], k: 3 },
      { p: korb, k: 0.5, pf: 'bevel' },
      { p: [kopf], k: 1 },
      { p: [hut], k: 1 },
      { p: [stock], k: 0, pf: 'flat' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Lamellen leuchten schwach von unten
      if (!tot) pilze.forEach((q, i) => { P.set(r(q.x1 - 1), r(q.y1 + 1), i % 2 ? 'harz' : 'harzhell'); P.set(r(q.x1 + 1), r(q.y1 + 1), 'harz'); });
      if (v.korb) for (let k = 0; k < 3; k++) P.auf(r(cx + 18 + k * 3 + ox), r(sy + 27), 'harz');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
