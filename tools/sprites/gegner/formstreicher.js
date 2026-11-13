// Der Formstreicher (Ziegelgruben). Er hat den Lehm in die Holzform geschlagen und abgestrichen, tausend
// Ziegel am Tag, und mit jedem ist er ein bisschen mehr Lehm geworden. Jetzt formt er sich selbst nach,
// jeden Zug eine Schicht dicker, und wird stärker davon. Breit, nackter Oberkörper aus nassem Lehm, die
// Form in der Hand. Angriff: die Form klatscht herunter.
'use strict';
module.exports = {
  id: 'formstreicher', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 96, h: 120, fuss: [48, 115], kopf: [46, 30], rimBis: 112,
  varianten: { formstreicher_a: { breit: 1 }, formstreicher_b: { breit: 1.15 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let hub = 0, lean = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { hub = [-6, -12, 12, 4][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50 + lean, sy = 40 + fall, w = v.breit;
    const leib = Pg([[cx - 16 * w, sy + 4], [cx - 8, sy - 4], [cx + 10, sy - 4], [cx + 18 * w, sy + 4], [cx + 14 * w, sy + 40], [cx - 12 * w, sy + 40]], null, { rd: 2.4 });
    const hose = Pg([[cx - 12 * w, sy + 38], [cx + 14 * w, sy + 38], [cx + 14, 106], [cx + 4, 106], [cx + 1, sy + 54], [cx - 2, 106], [cx - 12, 106]], null, { rd: 1.6 });
    const fuesse = [E(cx - 8, 110, 6, 3, 'dunkel'), E(cx + 9, 110, 6, 3, 'dunkel')];
    const kx = cx - 2, ky = sy - 10 + atem * 0.5;
    const kopf = E(kx, ky, 7, 7, null, { rd: 1.3 });
    const hx = cx - 22, hy = sy + 18 + hub;
    const armV = glied([[cx - 12, sy + 4], [cx - 20, sy + 8 + hub * 0.4], [hx, hy]], 3.4, 3, null);
    const form = Pg([[hx - 10, hy - 3], [hx + 2, hy - 3], [hx + 2, hy + 5], [hx - 10, hy + 5]], 'dunkel', { rd: 0.6, pf: 'bevel' });
    const armH = glied([[cx + 14, sy + 4], [cx + 20, sy + 18], [cx + 16, sy + 30]], 3.4, 3, null);
    const gruppen = [
      { p: fuesse, k: 0 },
      { p: [hose], k: 2 },
      { p: armH, k: 1 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: armV, k: 1 },
      { p: [form], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Lehmschichten am Körper, Ziegelstempel auf der Brust
      for (let y = sy + 4; y < sy + 40; y += 5) P.line(r(cx - 10), y, r(cx + 12), y + 1, 'k1', true);
      P.line(r(cx - 2), r(sy + 14), r(cx + 6), r(sy + 14), 'ziegel'); P.line(r(cx - 2), r(sy + 17), r(cx + 6), r(sy + 17), 'ziegel');
      P.set(r(hx - 4), r(hy + 1), 'ziegel');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
