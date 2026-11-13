// Der Schneeblinde (schwarzes Eis). Ein Matrose der Expedition, dem das Licht auf dem Eis die Augen
// verbrannt hat. Er trägt die Schneebrille aus Holz mit den schmalen Schlitzen und tastet mit vorgestreckten
// Armen. Was ihn befällt, merkt er nicht, die Kälte nimmt es ihm ab. Angriff: er greift blind zu.
'use strict';
module.exports = {
  id: 'schneeblinder', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [48, 115], kopf: [48, 26], rimBis: 112,
  varianten: { schneeblinder_a: { pelz: 1 }, schneeblinder_b: { pelz: 1.15 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let griff = 0, lean = 0, fall = 0, glanz = 1, tast = 0;
    if (p.idle) { tast = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { griff = [2, 4, 12, 5][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 54 + lean, sy = 38 + fall, z = v.pelz;
    const pelz = Pg([[cx - 12 * z, sy + 2], [cx - 6, sy - 6], [cx + 8, sy - 6], [cx + 14 * z, sy + 4], [cx + 16 * z, 106], ...saum(cx + 16 * z, cx - 16 * z, 110, 6, 3, 4), [cx - 16 * z, 106], [cx - 14 * z, sy + 30]], null, { rd: 2.4 });
    const kx = cx - 2, ky = sy - 10;
    const kapuze = Pg([[kx - 9, ky + 6], [kx - 8, ky - 6], [kx, ky - 10], [kx + 9, ky - 5], [kx + 10, ky + 8]], null, { rd: 1.6 });
    const gesicht = E(kx - 1, ky + 1, 5.5, 6, null, { rd: 1.2 });
    const brille = Pg([[kx - 7, ky - 1], [kx + 5, ky - 1], [kx + 5, ky + 2], [kx - 7, ky + 2]], 'dunkel', { rd: 0.6, pf: 'bevel' });
    const arme = [glied([[cx - 10, sy + 4], [cx - 22 - griff * 0.5, sy + 8 + tast], [cx - 34 - griff, sy + 10 + tast]], 3, 2.4, null), glied([[cx + 8, sy + 4], [cx - 6 - griff * 0.4, sy + 14 - tast], [cx - 26 - griff, sy + 18 - tast]], 3, 2.4, null)];
    const fausthandschuhe = [E(cx - 35 - griff, sy + 10 + tast, 3.4, 3, null), E(cx - 27 - griff, sy + 18 - tast, 3.4, 3, null)];
    const gruppen = [
      { p: arme[1], k: 1 },
      { p: [pelz], k: 3 },
      { p: [kapuze], k: 2 },
      { p: [gesicht], k: 1 },
      { p: [brille], k: 0, pf: 'bevel' },
      { p: arme[0], k: 1 },
      { p: fausthandschuhe, k: 1 },
    ];
    const augen = [];
    const details = P => {
      for (let x = -8; x <= 8; x += 3) P.auf(r(kx + x), r(ky - 8 + Math.abs(x) * 0.3), 'r1');
      for (let x = cx - 14; x <= cx + 14; x += 5) P.set(r(x), 108, 'r1');
      if (glanz > 0) {
        // Licht nur durch die Schlitze
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 6, ey, 'glut'); P.set(ex + 7, ey, 'glutDim');
        P.glow(ex + 3.5, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 6, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
