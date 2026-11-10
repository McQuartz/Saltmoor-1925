// Die Krückenträgerin (Grotte der Gaben). Wer geheilt wurde, ließ die Krücken in der Grotte; sie
// hat sie alle eingesammelt und trägt sie gebündelt auf dem Rücken, ein Fächer aus Holz, der nach
// allen Seiten absteht. Sie selbst geht auf vieren, wie die Geheilten, die Beine nach hinten. Wer
// sie anfasst, sticht sich an den Spitzen. Angriff: sie stößt mit einer Krücke zu.
'use strict';
module.exports = {
  id: 'kruecken', biom: 'grotte', zone: 'grotte', w: 96, h: 120, fuss: [48, 115], kopf: [26, 70], rimBis: 112,
  varianten: {
    kruecken_a: { n: 7, hoch: 1 },
    kruecken_b: { n: 9, hoch: 1.15 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, stoss = 0, fall = 0, glanz = 1, wipp = 0;
    if (p.idle) { wipp = [0, 0, 1, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -7, -2][f]; stoss = [2, 4, -12, -4][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 18); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const ox = lean, by = 82 + fall;
    // Leib waagerecht, auf vier Gliedern
    const leib = Pg([[30 + ox, by - 8], [50 + ox, by - 12], [70 + ox, by - 8], [72 + ox, by + 4], [50 + ox, by + 6], [30 + ox, by + 4]], null, { rd: 3 });
    const glieder = [...glied([[34 + ox, by + 2], [28 + ox, by + 16], [30, 114]], 2.6, 2, null), ...glied([[42 + ox, by + 4], [40 + ox, by + 18], [42, 114]], 2.6, 2, null),
      ...glied([[62 + ox, by + 2], [74 + ox, by + 12], [70, 114]], 2.8, 2, null), ...glied([[68 + ox, by], [82 + ox, by + 10], [80, 114]], 2.8, 2, null)];
    const kx = 24 + ox, ky = by - 10 + wipp;
    const kopf = Pg([[kx - 6, ky - 4], [kx + 2, ky - 8], [kx + 8, ky - 2], [kx + 6, ky + 6], [kx - 4, ky + 6]], null, { rd: 2 });
    const tuch = Pg([[kx - 3, ky - 7], [kx + 6, ky - 9], [kx + 14, ky - 2], [kx + 6, ky + 1]], 'dunkel', { rd: 1 });
    // Krücken-Fächer vom Rücken
    const n = v.n, kr = [];
    for (let i = 0; i < n; i++) { const a = -Math.PI * 0.92 + i * (Math.PI * 0.84) / (n - 1), L = (34 + (i % 3) * 7) * v.hoch; const x0 = 52 + ox, y0 = by - 8; const x1 = x0 + Math.cos(a) * L, y1 = y0 + Math.sin(a) * L; kr.push(C(x0, y0, x1, y1, 1.3, 1.1, null, { pf: 'flat' })); const qa = a + Math.PI / 2; kr.push(C(x1 - Math.cos(qa) * 4, y1 - Math.sin(qa) * 4, x1 + Math.cos(qa) * 4, y1 + Math.sin(qa) * 4, 1.4, 1.4, null, { pf: 'bevel' })); }
    // eine Krücke vorn in der Hand
    const hx = 22 + ox + stoss, hy = by + 4;
    const vorn = [C(hx + 14, hy - 4, hx - 6, hy + 4, 1.3, 1.3, null, { pf: 'flat' }), C(hx - 6, hy + 1, hx - 6, hy + 8, 1.4, 1.4, null, { pf: 'bevel' })];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : kr, k: 0, pf: 'flat' },
      { p: glieder.slice(6), k: 1 },
      { p: [leib], k: 3 },
      { p: glieder.slice(0, 6), k: 1 },
      { p: [kopf], k: 1.5 },
      { p: [tuch], k: 1 },
      { p: tot ? [] : vorn, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Wachsreste und Kerzenstummel auf den Krücken
      if (!tot) kr.forEach((c, i) => { if (i % 4 === 1) { P.auf(r(c.x1), r(c.y1), 'wachs'); } });
      if (!tot) { P.set(52 + ox, by - 15, 'wachs'); P.set(52 + ox, by - 16, 'flamme'); }
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey - 1, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey - 1]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
