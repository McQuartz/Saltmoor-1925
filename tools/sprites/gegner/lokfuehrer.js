// Der Lokführer (Nachtzug, Elite). Er fährt den Zug, der nicht ankommt, und er hält den Fahrplan.
// Alle vier Takte pfeift er, und bei jedem Pfiff ist der Kessel heißer. Ein Mann in der Latzhose,
// die Schutzbrille auf der Stirn, und wo die Brust war, steht die Feuertür offen.
// In der Hand die Kohlenschaufel. Angriff: die Schaufel schleudert Glut.
'use strict';
module.exports = {
  id: 'lokfuehrer', biom: 'nachtzug', zone: 'nachtzug', w: 128, h: 160, fuss: [64, 155], kopf: [58, 38], rimBis: 152, rang: 'elite',
  varianten: { lokfuehrer: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, sch = 1.2, fall = 0, glanz = 1, glut = 1;
    if (p.idle) { glut = [1, 1.15, 0.95, 1.1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { sch = [1.5, 1.8, 0.1, 0.6][f]; lean = [3, 4, -7, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; glut = [1.2, 1.4, 1.8, 1.3][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; glut = 0.7; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; glut = f < 2 ? 0.6 : 0.2; }
    const cx = 66, ox = lean, sy = 54 + fall;
    const leib = Pg([[cx - 20 + ox, sy + 6], [cx - 12 + ox, sy - 4], [cx + 12 + ox, sy - 5], [cx + 22 + ox, sy + 4], [cx + 24, sy + 24], [cx + 20, sy + 52], [cx - 18, sy + 52], [cx - 22, sy + 26]], null, { rd: 2.2 });
    const tuer = Pg([[cx - 10 + ox, sy + 10], [cx + 6 + ox, sy + 10], [cx + 6 + ox, sy + 28], [cx - 10 + ox, sy + 28]], 'dunkel', { rd: 1, pf: 'flat' });
    const klappe = Pg([[cx - 10 + ox, sy + 10], [cx - 18 + ox, sy + 12], [cx - 18 + ox, sy + 26], [cx - 10 + ox, sy + 28]], 'dunkel', { rd: 0.6, pf: 'bevel' });
    const beine = [C(cx - 10, sy + 50, cx - 12, 150, 6, 5, null), C(cx + 10, sy + 50, cx + 12, 150, 6, 5, null)];
    const stiefel = [E(cx - 15, 152, 8, 3.5, 'dunkel'), E(cx + 12, 152, 7, 3.5, 'dunkel')];
    const kx = cx - 4 + ox * 1.2, ky = sy - 12;
    const kopf = E(kx, ky, 8, 8, null, { rd: 1.5 });
    const muetze = Pg([[kx - 9, ky - 4], [kx - 7, ky - 11], [kx + 6, ky - 12], [kx + 9, ky - 5]], null, { rd: 1.6 });
    const brille = [E(kx - 4, ky - 6, 2.6, 2.2, 'dunkel', { pf: 'dome' }), E(kx + 2, ky - 6, 2.6, 2.2, 'dunkel', { pf: 'dome' })];
    // Schaufel
    const hx = cx - 26 + ox, hy = sy + 30;
    const L = 24, tx = hx - Math.cos(sch) * L * 0.8, ty = hy + 10 + Math.sin(sch) * L * 0.7;
    const stiel = C(hx + 8, hy - 6, tx, ty, 1.4, 1.4, 'dunkel', { pf: 'flat' });
    const blatt = Pg([[tx - 6, ty - 4], [tx + 2, ty - 5], [tx + 3, ty + 4], [tx - 7, ty + 5]], 'dunkel', { rd: 1, pf: 'bevel' });
    const armV = glied([[cx - 16 + ox, sy + 4], [cx - 26 + ox, sy + 16], [hx, hy]], 4.4, 3.6, null);
    const armH = glied([[cx + 18 + ox, sy + 4], [cx + 22 + ox, sy + 20], [hx + 8, hy - 6]], 4.4, 3.6, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [tuer], k: 0, pf: 'flat', noRim: true },
      { p: [klappe], k: 0, pf: 'bevel' },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: brille, k: 0, pf: 'dome' },
      { p: armH, k: 1 },
      { p: tot ? [] : [stiel, blatt], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Glut in der Feuertür, Latzhosenträger, Messingknöpfe
      if (glut > 0) {
        for (let y = sy + 13; y < sy + 27; y += 2) for (let x = cx - 8; x < cx + 5; x += 2) if (((x + y) % 4) === 0) P.set(r(x + ox), y, y > sy + 22 ? 'glut' : 'glutDim');
        P.glow(cx - 2 + ox, sy + 20, 10 * glut, 0.7 * glut, 'glutDim', 'k3');
        if (p.angriff && f >= 2) for (let i = 0; i < 4; i++) P.set(r(tx - 8 - i * 4), r(ty - 4 - i * 2), 'glut');
      }
      P.line(r(cx - 14 + ox), r(sy - 2), r(cx - 12 + ox), r(sy + 50), 'k0', true);
      P.line(r(cx + 14 + ox), r(sy - 2), r(cx + 12 + ox), r(sy + 50), 'k0', true);
      P.set(r(cx - 13 + ox), r(sy + 8), 'messing'); P.set(r(cx + 13 + ox), r(sy + 8), 'messing');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
