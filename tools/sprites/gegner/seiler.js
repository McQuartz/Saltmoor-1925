// Der Glockenseiler (Glockengießerei, Elite). Er hat die Seile für die Glocken geschlagen, und für die
// große hat er eines geschlagen, das nie fertig wurde. Er schlägt es weiter, aus dem eigenen Haar und
// den eigenen Sehnen, und das Seil wickelt sich um alles, was ihm nahe kommt. Ein langer, dünner Mann,
// rückwärts gehend, vor ihm das Seilrad. Angriff: das Seil schnürt zu.
'use strict';
module.exports = {
  id: 'seiler', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 128, h: 160, fuss: [64, 155], kopf: [70, 30], rimBis: 152, rang: 'elite',
  varianten: { seiler: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let peit = 0, dreh = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { dreh = f * 0.4; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { dreh = f; peit = [2, 6, 20, 8][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); glanz = f < 2 ? 0.6 : 0; }
    const cx = 74 + lean, sy = 44 + fall;
    const schurz = Pg([[cx - 9, sy], [cx + 9, sy - 1], [cx + 12, sy + 40], [cx + 14, 110], ...saum(cx + 14, cx - 12, 114, 5, 2, 4), [cx - 12, 110], [cx - 11, sy + 40]], null, { rd: 1.8 });
    const beine = [C(cx - 5, 110, cx - 7, 150, 3, 2.6, null), C(cx + 5, 110, cx + 7, 150, 3, 2.6, null)];
    const fuesse = [E(cx - 10, 152, 6, 2.6, 'dunkel'), E(cx + 8, 152, 5, 2.6, 'dunkel')];
    const kx = cx + lean * 0.3, ky = sy - 10;
    const kopf = E(kx, ky, 6, 7, null, { rd: 1.3 });
    const haar = Pg([[kx - 6, ky - 6], [kx + 6, ky - 7], [kx + 10, ky + 6], [kx + 6, ky + 30], [kx + 2, ky + 4]], null, { rd: 1.2 });
    // Seilrad vorn links: Rad auf Bock, Kurbel
    const rx = 30, ry = 104;
    const rad = E(rx, ry, 14, 14, 'dunkel', { pf: 'flat' });
    const speichen = [0, 1, 2].map(i => { const w = dreh + i * Math.PI / 3; return C(rx - Math.cos(w) * 12, ry - Math.sin(w) * 12, rx + Math.cos(w) * 12, ry + Math.sin(w) * 12, 1, 1, null, { pf: 'flat' }); });
    const bock = [C(rx, ry, rx - 10, 152, 2, 2, 'dunkel', { pf: 'flat' }), C(rx, ry, rx + 10, 152, 2, 2, 'dunkel', { pf: 'flat' })];
    const arme = [glied([[cx - 7, sy + 4], [cx - 16, sy + 18], [cx - 22 - peit * 0.4, sy + 30]], 2.4, 2, null), glied([[cx + 8, sy + 4], [cx + 4, sy + 22], [cx - 18, sy + 34]], 2.4, 2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: bock, k: 0, pf: 'flat' },
      { p: [rad], k: 0, pf: 'flat' },
      { p: speichen, k: 1, pf: 'flat' },
      { p: beine, k: 1 },
      { p: fuesse, k: 0 },
      { p: [schurz], k: 3 },
      { p: [haar], k: 1.5 },
      { p: [kopf], k: 2 },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // das Seil: vom Rad zu seinen Händen und weiter in sein Haar; beim Angriff schlägt eine Schlaufe aus
      if (!tot) {
        P.line(rx, r(ry - 14), r(cx - 20), r(sy + 32), 'lehm');
        P.line(r(cx - 20), r(sy + 32), r(kx + 6), r(ky + 28), 'lehm');
        if (peit > 4) { for (let i = 0; i < 10; i++) { const w = i / 10 * Math.PI * 2; P.set(r(rx - 8 + Math.cos(w) * peit * 0.6), r(ry - 30 + Math.sin(w) * peit * 0.3), 'lehm'); } }
      }
      P.set(rx, ry, 'bronze');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
