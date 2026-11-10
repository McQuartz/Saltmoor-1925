// Der Heizer (Nachtzug). Er schaufelt seit Mitternacht Kohle, und der Zug hat keine Lok. Ein
// gedrungener Mann im Unterhemd, die Arme lang von der Schaufel. Wo die Brust war, ist die
// Feuertür offen, und dahinter brennt es; je länger er schaufelt, desto heller. Mütze, Ruß, zwei
// Augen über der Glut. Angriff: er wirft dir die Schaufel voll Glut entgegen.
'use strict';
module.exports = {
  id: 'heizer', biom: 'nachtzug', zone: 'nachtzug', w: 96, h: 120, fuss: [48, 115], kopf: [44, 26], rimBis: 112,
  varianten: {
    heizer_a: { breit: 1, muetze: 1 },
    heizer_b: { breit: 1.15, muetze: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, schaufel = 0, fall = 0, glanz = 1, glut = 0;
    if (p.idle) { glut = f; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 4, -7, -2][f]; schaufel = [6, 12, -10, -3][f]; glut = f; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 32); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean, sy = 40 + fall, b = v.breit;
    const leib = Pg([[cx - 16 * b + ox, sy + 2], [cx + 16 * b + ox, sy], [cx + 18 * b + r(ox / 2), sy + 24], [cx + 13 * b, sy + 46], [cx - 13 * b, sy + 46], [cx - 18 * b + r(ox / 2), sy + 24]], null, { rd: 2.5 });
    const tuer = Pg([[cx - 7 + ox, sy + 12], [cx + 7 + ox, sy + 12], [cx + 7 + ox, sy + 28], [cx - 7 + ox, sy + 28]], 'dunkel', { pf: 'flat' });
    const hose = Pg([[cx - 13 * b, sy + 44], [cx + 13 * b, sy + 44], [cx + 14, 106], [cx + 4, 106], [cx, sy + 56], [cx - 4, 106], [cx - 14, 106]], 'dunkel', { rd: 1 });
    const stiefel = [E(cx - 11, 110, 6, 4, 'dunkel'), E(cx + 10, 110, 6, 4, 'dunkel')];
    const kx = cx - 4 + ox * 1.2, ky = sy - 6;
    const kopf = E(kx, ky, 7, 7, null);
    const muetze = v.muetze ? [Pg([[kx - 12, ky - 2], [kx - 6, ky - 9], [kx + 6, ky - 9], [kx + 8, ky - 2]], null, { rd: 1, pf: 'bevel' })] : [];
    // Schaufel in beiden Händen, vorn
    const hx = cx - 22 + ox - r(schaufel * 0.4), hy = sy + 30 - schaufel;
    const armV = glied([[cx - 14 * b + ox, sy + 4], [cx - 24 + ox, sy + 16], [hx, hy]], 4, 3.2, null);
    const armH = glied([[cx + 14 * b + ox, sy + 4], [cx + 10 + ox, sy + 22], [hx + 10, hy + 6]], 4, 3.2, null);
    const st = C(hx + 12, hy + 7, hx - 8, hy - 4, 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const blatt = Pg([[hx - 8, hy - 9], [hx - 18, hy - 6], [hx - 16, hy + 4], [hx - 6, hy + 1]], null, { rd: 0.6, pf: 'bevel' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [hose], k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [tuer], k: 0, pf: 'flat', noRim: true },
      { p: [kopf, ...muetze], k: 1 },
      { p: [st, blatt], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Glut hinter der Feuertür: Stufen von unten
      if (!tot) for (let y = 0; y < 14; y++) for (let x = -5; x <= 5; x++) { const v2 = (y + ((x + glut) % 3)) / 14; const c = v2 > 0.75 ? 'glut' : v2 > 0.45 ? 'glutDim' : null; if (c && ((x + y) % 2 || v2 > 0.8)) P.set(r(cx + x + ox), r(sy + 13 + y), c); }
      if (!tot) { P.set(r(cx + ox), r(sy + 25), 'kern'); P.glow(cx + ox, sy + 24, 10, 0.5, 'glutDim', 'k3'); }
      // Ruß, Messingbeschlag an der Tür
      P.auf(r(cx - 8 + ox), r(sy + 12), 'messing'); P.auf(r(cx + 8 + ox), r(sy + 12), 'messing');
      if (!tot && schaufel < 0) [[-20, -2], [-22, 2], [-24, -4]].forEach(([dx, dy]) => P.set(r(hx + dx), r(hy + dy), 'glut'));
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'kern');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
