// Waisenhaus am Deich, dritter Wächter: Die Wiege. Im Säuglingszimmer stand eine Wiege für alle, und
// alle haben darin gelegen. Sie ist gewachsen, mit jedem Kind ein Stück, und schaukelt von allein, im
// Takt. Unter dem Himmel aus Leinen liegt etwas, das nie größer geworden ist und viele Hände hat.
// Bei jedem Schaukeln wird es ruhig, dazwischen schreit es. Angriff: die Wiege kippt nach vorn.
'use strict';
module.exports = {
  id: 'wiege', biom: 'waisenhaus', zone: 'waisenhaus', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [56, 70], rimBis: 172,
  varianten: { wiege: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let a = 0, fall = 0, glanz = 1, haende = 0;
    if (p.idle) { a = [0, 0.03, 0, -0.03][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [0.08, 0.14, -0.22, -0.06][f]; haende = [2, 4, 12, 6][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { a = [0.08, 0.04][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); a = p.q * 0.2; glanz = f < 2 ? 0.6 : 0; }
    const cx = 84, cy = 120 + fall;
    const rot = (x, y) => { const dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; };
    const R = pts => pts.map(([x, y]) => rot(x, y));
    const korb = Pg(R([[cx - 56, cy - 30], [cx + 56, cy - 30], [cx + 50, cy + 6], [cx - 50, cy + 6]]), null, { rd: 2.4 });
    const himmel = Pg(R([[cx - 56, cy - 30], [cx - 50, cy - 70], [cx - 30, cy - 88], [cx - 8, cy - 84], [cx - 10, cy - 30]]), null, { rd: 2, pf: 'bevel', tone: 0.14 });
    const kufen = Pg([[cx - 62 + a * 100, 168 + a * 40], [cx - 30, 172], [cx + 30, 172], [cx + 62 + a * 100, 168 - a * 40], [cx + 58, 164], [cx - 58, 164]], 'dunkel', { rd: 3, pf: 'bevel' });
    const pfosten = [[-44], [44]].map(([dx]) => C(...rot(cx + dx, cy + 4), cx + dx * 1.1, 166, 3, 3, 'dunkel', { pf: 'flat' }));
    const decke = Pg(R([[cx - 8, cy - 30], [cx + 10, cy - 38], [cx + 30, cy - 34], [cx + 52, cy - 30]]).concat(R([[cx + 52, cy - 26], [cx - 8, cy - 26]])), null, { rd: 2, pf: 'flat', tone: 0.12 });
    const arme = [];
    for (let i = 0; i < 4; i++) { const [sx, sy0] = rot(cx + 6 + i * 11, cy - 34); arme.push(glied([[sx, sy0], [sx - 4 + i, sy0 - 10 - haende], [sx - 8 + i * 2, sy0 - 18 - haende * 1.4]], 2, 1.4, null)); }
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: pfosten, k: 0, pf: 'flat' },
      { p: [kufen], k: 1, pf: 'bevel' },
      { p: tot ? [] : arme.flat(), k: 1 },
      { p: [korb], k: 3 },
      { p: [decke], k: 1.5, pf: 'flat' },
      { p: [himmel], k: 2, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Korbgeflecht, Nummernschild in Kalk, nasse Flecken
      for (let x = cx - 50; x < cx + 50; x += 6) { const [x0, y0] = rot(x, cy - 28), [x1, y1] = rot(x + 2, cy + 4); P.line(r(x0), r(y0), r(x1), r(y1), 'k1', true); }
      const [nx, ny] = rot(cx + 30, cy - 10); P.line(r(nx - 4), r(ny), r(nx + 4), r(ny), 'kalk');
      const [wx, wy] = rot(cx - 30, cy - 6); P.set(r(wx), r(wy), 'nass'); P.set(r(wx + 3), r(wy + 2), 'nass');
      if (glanz > 0) {
        // unter dem Himmel: zwei Augen im Dunkel
        const [ex0, ey0] = rot(cx - 32, cy - 44); const ex = r(ex0), ey = r(ey0);
        P.set(ex, ey, 'kern'); P.set(ex + 6, ey, 'glut');
        P.glow(ex + 3, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 6, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
