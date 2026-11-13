// Der Zahnradmann (Gezeitenwerk, Elite). Der Mechaniker, der 1909 in das Werk gestiegen ist, um ein
// Zahnrad zu tauschen, und eins geworden ist. Er läuft im Takt des Werks, die Brust ein offenes
// Getriebe, auf dem Rücken ein großes Rad, das sich dreht. Bei jedem Einrasten schützt er die anderen.
// Angriff: der Schraubenschlüssel schlägt zu.
'use strict';
module.exports = {
  id: 'zahnradmann', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 128, h: 160, fuss: [64, 155], kopf: [56, 40], rimBis: 152, rang: 'elite',
  varianten: { zahnradmann: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let dreh = 0, sch = 0.2, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { dreh = f * 0.13; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { dreh = f * 0.4; sch = [-0.4, -0.9, 1.1, 0.5][f]; lean = [2, 3, -7, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66 + lean, sy = 56 + fall;
    // Rad auf dem Rücken
    const rx = cx + 18, ry = sy + 16;
    const rad = E(rx, ry, 26, 26, null, { pf: 'bevel', rd: 1 });
    const zaehne = [];
    for (let i = 0; i < 12; i++) { const w = dreh + i * Math.PI / 6; zaehne.push(C(rx + Math.cos(w) * 25, ry + Math.sin(w) * 25, rx + Math.cos(w) * 31, ry + Math.sin(w) * 31, 2.6, 2, null, { pf: 'bevel' })); }
    const nabe = E(rx, ry, 6, 6, 'dunkel', { pf: 'dome' });
    const leib = Pg([[cx - 16, sy + 2], [cx - 8, sy - 6], [cx + 10, sy - 6], [cx + 16, sy + 4], [cx + 14, sy + 52], [cx - 14, sy + 52]], null, { rd: 2 });
    const brust = E(cx - 2, sy + 22, 8, 9, 'dunkel', { pf: 'flat' });
    const beine = [C(cx - 8, sy + 50, cx - 10, 150, 5, 4, null), C(cx + 8, sy + 50, cx + 10, 150, 5, 4, null)];
    const stiefel = [E(cx - 13, 152, 7, 3, 'dunkel'), E(cx + 9, 152, 6, 3, 'dunkel')];
    const kx = cx - 4, ky = sy - 14;
    const kopf = E(kx, ky, 7, 7.5, null, { rd: 1.4 });
    const muetze = Pg([[kx - 8, ky - 3], [kx - 6, ky - 9], [kx + 6, ky - 9], [kx + 8, ky - 4], [kx - 12, ky - 2]], null, { rd: 1 });
    const hx = cx - 24, hy = sy + 26;
    const armV = glied([[cx - 12, sy + 4], [cx - 22, sy + 14], [hx, hy]], 3.6, 3, null);
    const L = 30, tx = hx - Math.sin(sch) * L, ty = hy - Math.cos(sch) * L;
    const schl = C(hx, hy, tx, ty, 1.8, 1.8, 'dunkel', { pf: 'bevel' });
    const maul = Pg([[tx - 4, ty - 4], [tx + 4, ty - 4], [tx + 3, ty + 2], [tx + 1, ty - 1], [tx - 1, ty - 1], [tx - 3, ty + 2]], 'dunkel', { rd: 0.4, pf: 'bevel' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : zaehne, k: 1, pf: 'bevel' },
      { p: tot ? [] : [rad], k: 2, pf: 'bevel' },
      { p: [nabe], k: 0, pf: 'dome' },
      { p: beine, k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [brust], k: 0, pf: 'flat', noRim: true },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: [schl, maul], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // kleine Zahnräder in der Brust, Bronze am Rad, Wasser tropft
      for (let i = 0; i < 6; i++) { const w = -dreh * 2 + i * Math.PI / 3; P.set(r(cx - 2 + Math.cos(w) * 5), r(sy + 22 + Math.sin(w) * 5), 'bronze'); }
      for (let i = 0; i < 4; i++) { const w = dreh + i * Math.PI / 2; P.line(r(rx), r(ry), r(rx + Math.cos(w) * 22), r(ry + Math.sin(w) * 22), 'bronze', true); }
      P.set(r(cx + 6), r(sy + 60), 'wasser'); P.set(r(cx + 7), r(sy + 70), 'wasser');
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
