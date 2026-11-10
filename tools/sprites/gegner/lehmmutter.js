// Die Lehmmutter (Ziegelgruben, Elite). Die Grube selbst, so wie die Legion sie sich vorstellte,
// als sie ihr opferte: eine Frau aus nassem Lehm, so breit wie ein Ofen, die auf den Fersen hockt.
// Ihr Kopf ist ein gebrannter Ziegel mit dem Stempel der Legion; durch die Löcher des Stempels
// sieht sie. Aus ihrem Schoß drängen sich halbfertige Lehmhunde, noch ohne Beine. Fällt sie,
// laufen die beiden letzten heraus. Angriff: sie schlägt mit der flachen Hand, Lehm spritzt.
'use strict';
module.exports = {
  id: 'lehmmutter', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 128, h: 160, fuss: [64, 155], kopf: [58, 40], rimBis: 152, rang: 'elite',
  varianten: { lehmmutter: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, hand = 0, fall = 0, glanz = 1, atem = 0, regen = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; regen = [0, 1, 1, 0][f]; glanz = [1, 1, 0.9, 1.1][f]; }
    if (p.angriff) { lean = [2, 3, -7, -3][f]; hand = [10, 18, -8, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, sy = 64 + fall;
    // Leib: hockend, breit, Schultern rund abfallend, die Knie vorn
    const leib = Pg([[cx - 20 + ox, sy + 6], [cx - 8 + ox, sy - 4], [cx + 12 + ox, sy - 2], [cx + 26 + r(ox / 2), sy + 22], [cx + 34, sy + 60], [cx + 34, 140], [cx + 26, 152], [cx - 18, 152], [cx - 22, 130], [cx - 26 + r(ox / 2), sy + 30]], null, { rd: 3 });
    const knie = [E(cx - 22, 142, 13, 10, null), E(cx + 22, 144, 12, 9, null)];
    // Kopf: gebrannter Ziegel, etwas schief
    const kx = cx - 12 + ox * 1.3, ky = sy - 10 + atem;
    const ziegel = Pg([[kx - 10, ky - 8], [kx + 9, ky - 10], [kx + 10, ky + 8], [kx - 9, ky + 10]], null, { rd: 0.5, pf: 'bevel', tone: 0.1 });
    const hals = C(cx + ox, sy + 2, kx, ky + 8, 6, 5, null);
    // Lehmhunde im Schoß: Köpfe, Rücken, ohne Beine
    // je Hund: Rücken aus dem Bauch nach vorn unten, ein Ziegelkopf mit Schnauze
    const hunde = [[cx - 8, sy + 44, cx - 44, sy + 50], [cx - 2, sy + 62, cx - 40, sy + 78]].map(([x0, y0, x1, y1], i) => {
      const hx1 = x1 - regen * (i ? 1 : -1), hy1 = y1;
      return [C(x0, y0, hx1 + 6, hy1, 7, 5, null),
        Pg([[hx1 - 8, hy1 - 9], [hx1 + 7, hy1 - 10], [hx1 + 8, hy1 + 5], [hx1 - 7, hy1 + 6]], null, { rd: 0.4, pf: 'bevel', tone: 0.25 }),
        Pg([[hx1 - 16, hy1 - 2], [hx1 - 7, hy1 - 4], [hx1 - 7, hy1 + 5], [hx1 - 15, hy1 + 5]], null, { rd: 0.4, pf: 'bevel', tone: 0.25 }),
        Pg([[hx1 + 2, hy1 - 9], [hx1 + 7, hy1 - 9], [hx1 + 6, hy1 - 15]], null, { pf: 'flat', tone: 0.15 })];
    });
    // Arme: vorn schlägt die flache Hand, hinten stützt sie sich auf
    const hx = cx - 30 + ox + r(hand * 0.2), hy = sy + 30 - r(hand * 1.6);
    const armV = glied([[cx - 14 + ox, sy + 6], [cx - 32 + ox, sy + 24], [hx, hy]], 7, 5, null);
    const handV = Pg([[hx - 8, hy - 2], [hx + 4, hy - 4], [hx + 6, hy + 3], [hx - 10, hy + 5]], null, { rd: 1.5 });
    const armH = glied([[cx + 16 + ox, sy + 6], [cx + 36 + ox, sy + 30], [cx + 44, 140], [cx + 46, 152]], 7, 5, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 2 },
      { p: [leib], k: 4 },
      { p: knie, k: 2 },
      { p: tot ? [] : hunde.flat(), k: 1.5 },
      { p: [hals], k: 2 },
      { p: [ziegel], k: 0, pf: 'bevel' },
      { p: armV, k: 2 },
      { p: [handV], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Lehm läuft: Rinnsale am Leib, Tropfen unten
      [[cx - 24, sy + 20], [cx - 6, sy + 30], [cx + 14, sy + 16], [cx + 26, sy + 34]].forEach(([x, y], i) => { for (let k = 0; k < 10 + (i % 2) * 6; k++) P.auf(r(x + ox * (1 - k / 20)), r(y + k * 2), k % 2 ? 'k3' : 'ziegel'); });
      // Stempel auf dem Ziegel: Rahmen, LEG in Strichen, zwei Löcher sind die Augen
      P.line(r(kx - 7), r(ky - 5), r(kx + 6), r(ky - 6), 'k0', true); P.line(r(kx - 7), r(ky + 6), r(kx + 7), r(ky + 5), 'k0', true);
      P.auf(r(kx - 4), r(ky + 2), 'k0'); P.auf(r(kx - 1), r(ky + 1), 'k0'); P.auf(r(kx + 2), r(ky + 2), 'k0'); P.auf(r(kx + 5), r(ky + 1), 'k0');
      for (let x = -6; x <= 6; x += 3) P.auf(r(kx + x), r(ky - 8 + (x > 0 ? 0 : 1)), 'ziegel');
      // Hunde: je ein Ziegelkopf-Fleck, Augen schwach
      if (!tot) hunde.forEach(([, kopf]) => { const [x, y] = kopf.v[0]; P.line(r(x + 2), r(y + 3), r(x + 12), r(y + 2), 'ziegel', true); P.line(r(x + 2), r(y + 4), r(x + 12), r(y + 3), 'ziegel', true); if (glanz > 0) { P.set(r(x + 3), r(y + 8), 'kern'); P.set(r(x + 4), r(y + 8), 'glut'); } });
      // Augen durch die Stempellöcher
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky - 2);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 7, ey - 1, 'kern'); P.set(ex + 8, ey - 1, 'glut');
        P.glow(ex + 4, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 7, ey - 1]);
      }
      // Spritzer beim Schlag
      if (p.angriff && f === 2) [[-14, 4], [-18, 0], [-10, 8], [-20, 6]].forEach(([dx, dy]) => P.set(r(hx + dx), r(hy + dy), 'ziegel'));
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
