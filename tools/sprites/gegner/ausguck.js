// Der Ausguck (Walkathedrale). Der Matrose, der „Da bläst er!“ rief, sitzt noch in seinem Fass, nur
// steht das Fass jetzt auf einer Rippe des Wals wie auf einem Mast. Man sieht von ihm nur Kopf und
// Arme über dem Rand und das Fernrohr, das ihm am Auge festgewachsen ist; was er sieht, verrät er
// nicht. Angriff: er wirft sich aus dem Fass nach vorn, das Fernrohr voran.
'use strict';
module.exports = {
  id: 'ausguck', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [48, 115], kopf: [42, 22], rimBis: 112,
  varianten: {
    ausguck_a: { mast: 1, fass: 1 },
    ausguck_b: { mast: 0.85, fass: 1.15 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, wurf = 0, fall = 0, glanz = 1, schwank = 0;
    if (p.idle) { schwank = [0, 0, 1, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [1, 2, -8, -3][f]; wurf = [0, -2, 8, 3][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean;
    // Rippe als Mast, gebogen, unten breiter
    const fz = v.fass, ty = 40 + (1 - v.mast) * 20 + fall;
    const rippe = Pg([[cx - 4, ty + 22 * fz], [cx + 3, ty + 22 * fz], [cx + 8, 80], [cx + 12, 104], [cx + 16, 114], [cx - 10, 114], [cx - 6, 100], [cx - 6, 80]], null, { rd: 1.2, pf: 'bevel' });
    const fuss = Pg([[cx - 18, 108], [cx + 20, 108], [cx + 22, 114], [cx - 20, 114]], null, { rd: 0.8, pf: 'bevel' });
    const fass = Pg([[cx - 13 * fz + ox, ty], [cx + 13 * fz + ox, ty], [cx + 11 * fz + ox, ty + 22 * fz], [cx - 11 * fz + ox, ty + 22 * fz]], null, { rd: 2, pf: 'bevel' });
    const kx = cx - 2 + ox * 1.5 - wurf, ky = ty - 8 + schwank;
    const kopf = E(kx, ky, 6, 6.5, null);
    const muetze = Pg([[kx - 6, ky - 3], [kx - 4, ky - 9], [kx + 6, ky - 8], [kx + 7, ky - 3]], 'dunkel', { rd: 1.2 });
    const rohr = C(kx - 4, ky, kx - 20 - wurf, ky + 2, 2, 2.8, null, { pf: 'bevel' });
    const arme = [...glied([[cx - 8 + ox, ty + 1], [kx - 10, ky + 8], [kx - 14 - wurf / 2, ky + 2]], 2.2, 1.8, null), ...glied([[cx + 8 + ox, ty + 1], [cx + 14 + ox, ty - 6], [cx + 18 + ox, ty - 2]], 2.2, 1.8, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [rippe, fuss], k: 1, pf: 'bevel' },
      { p: [kopf, muetze], k: 1 },
      { p: [fass], k: 0.5, pf: 'bevel' },
      { p: arme, k: 1 },
      { p: tot ? [] : [rohr], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Fassdauben und Reifen, Mark an der Rippe
      for (let i = -2; i <= 2; i++) P.line(r(cx + i * 4 * fz + ox), r(ty + 2), r(cx + i * 3.6 * fz + ox), r(ty + 21 * fz), 'k1', true);
      P.line(r(cx - 12 * fz + ox), r(ty + 5), r(cx + 12 * fz + ox), r(ty + 5), 'bein', true); P.line(r(cx - 11 * fz + ox), r(ty + 18 * fz), r(cx + 11 * fz + ox), r(ty + 18 * fz), 'bein', true);
      for (let y = 84; y < 108; y += 6) P.auf(cx + 2, y, 'mark');
      // das Auge vorn im Fernrohr, das andere schwach unter der Mütze
      if (glanz > 0 && !tot) {
        const ex = r(kx - 20 - wurf), ey = r(ky + 2);
        P.set(ex, ey, 'kern'); P.set(ex, ey - 1, 'glut'); P.set(ex, ey + 1, 'glut');
        P.glow(ex + 0.5, ey + 0.5, 6 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        P.set(r(kx + 1), r(ky), 'glutDim');
        augen.push([ex, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
