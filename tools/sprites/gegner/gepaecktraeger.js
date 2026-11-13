// Der Gepäckträger (Station, die nie eröffnet wurde). Er wartet seit dem Tag der Eröffnung auf Reisende,
// mit der Karre voll Koffern, die niemandem gehören. Er stellt die Koffer vor die anderen wie eine Mauer.
// Ein Mann in Uniformjacke mit der Nummer an der Mütze, hinter einem Turm aus Gepäck auf zwei Rädern.
// Angriff: der Turm kippt.
'use strict';
module.exports = {
  id: 'gepaecktraeger', biom: 'station', zone: 'station', w: 96, h: 120, fuss: [48, 115], kopf: [62, 30], rimBis: 112,
  varianten: { gepaecktraeger_a: { koffer: 4 }, gepaecktraeger_b: { koffer: 5 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let kipp = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { kipp = [1, 2, -6, -2][f]; lean = [1, 2, -3, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); glanz = f < 2 ? 0.6 : 0; }
    const cx = 62 + lean, sy = 40 + fall;
    const jacke = Pg([[cx - 8, sy], [cx + 8, sy - 1], [cx + 12, sy + 30], [cx + 12, sy + 44], [cx - 10, sy + 44]], null, { rd: 2 });
    const beine = [C(cx - 4, sy + 42, cx - 6, 113, 2.8, 2.4, 'dunkel'), C(cx + 6, sy + 42, cx + 7, 113, 2.8, 2.4, 'dunkel')];
    const kx = cx, ky = sy - 9;
    const kopf = E(kx, ky, 5.5, 6.5, null, { rd: 1.3 });
    const muetze = Pg([[kx - 7, ky - 3], [kx - 5, ky - 8], [kx + 6, ky - 8], [kx + 7, ky - 3], [kx - 10, ky - 2]], null, { rd: 1 });
    // Karre vorn links mit Kofferturm
    const kb = 108, kxs = 28;
    const rad = E(kxs + 4, kb + 2, 5, 5, 'dunkel', { pf: 'flat' });
    const holm = C(kxs + 10, kb, cx - 8, sy + 26, 1.4, 1.4, 'dunkel', { pf: 'flat' });
    const koffer = [];
    let y = kb - 2;
    for (let i = 0; i < v.koffer; i++) { const w = 22 - (i % 3) * 3, h = 9 + (i % 2) * 3, x = kxs - 6 + (i % 2) * 2 + kipp * i * 0.8; koffer.push(Pg([[x - w / 2 + 6, y], [x + w / 2 + 6, y], [x + w / 2 + 6, y - h], [x - w / 2 + 6, y - h]], null, { rd: 1, pf: 'bevel', tone: (i % 2) * 0.08 })); y -= h + 1; }
    const arme = [glied([[cx - 6, sy + 4], [cx - 12, sy + 16], [cx - 10, sy + 26]], 2.4, 2, null), glied([[cx + 6, sy + 4], [cx + 2, sy + 18], [cx - 8, sy + 28]], 2.4, 2, null)];
    const gruppen = [
      { p: beine, k: 1 },
      { p: [jacke], k: 3 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: [holm], k: 0, pf: 'flat' },
      { p: [rad], k: 0, pf: 'flat' },
      { p: koffer, k: 1.5, pf: 'bevel' },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Nummer an der Mütze, Kofferriemen, Etiketten
      P.set(r(kx - 1), r(ky - 6), 'messing'); P.set(r(kx + 1), r(ky - 6), 'messing');
      for (let i = 0, yy = kb - 2; i < v.koffer; i++) { const h = 9 + (i % 2) * 3; P.set(r(kxs + 2 + kipp * i * 0.8), r(yy - h / 2), 'email'); yy -= h + 1; }
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
