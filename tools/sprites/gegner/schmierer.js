// Der Schmierer (Gezeitenwerk). Er geht mit der Ölkanne durch das Werk und schmiert jedes Lager, damit
// nichts stockt. Wo er geht, gleiten die anderen: Er ölt ihre Gelenke und stellt sich mit dem breiten
// Rücken vor sie. Ein kleiner, dicker Mann, die Kanne mit langem Schnabel, die Hände schwarz bis zum
// Ellbogen. Angriff: ein heißer Ölstrahl.
'use strict';
module.exports = {
  id: 'schmierer', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 96, h: 120, fuss: [48, 115], kopf: [48, 44], rimBis: 112,
  varianten: { schmierer_a: { breit: 1, schnabel: 1 }, schmierer_b: { breit: 1.15, schnabel: 1.4 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let spritz = 0, lean = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { spritz = [0, 1, 3, 1][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52 + lean, sy = 56 + fall, w = v.breit;
    const leib = E(cx, sy + 18, 18 * w, 24, null, { rd: 2 });
    const beine = [C(cx - 7, sy + 36, cx - 9, 113, 3.6, 3, 'dunkel'), C(cx + 7, sy + 36, cx + 9, 113, 3.6, 3, 'dunkel')];
    const kx = cx - 4, ky = sy - 10 + atem * 0.5;
    const kopf = E(kx, ky, 6.5, 6.5, null, { rd: 1.3 });
    const muetze = Pg([[kx - 7, ky - 3], [kx - 5, ky - 8], [kx + 6, ky - 8], [kx + 7, ky - 3], [kx - 11, ky - 2]], null, { rd: 1 });
    const hx = cx - 22, hy = sy + 14;
    const armV = glied([[cx - 14, sy + 6], [cx - 20, sy + 12], [hx, hy]], 3.2, 2.8, 'dunkel');
    const kanne = Pg([[hx - 6, hy - 4], [hx + 4, hy - 4], [hx + 5, hy + 8], [hx - 7, hy + 8]], 'dunkel', { rd: 2, pf: 'dome' });
    const schnabel = C(hx - 6, hy - 2, hx - 6 - 12 * v.schnabel, hy - 8, 1, 0.7, 'dunkel', { pf: 'flat' });
    const armH = glied([[cx + 14, sy + 6], [cx + 20, sy + 18], [cx + 16, sy + 30]], 3.2, 2.8, 'dunkel');
    const gruppen = [
      { p: beine, k: 1 },
      { p: armH, k: 1 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: armV, k: 1 },
      { p: [kanne, schnabel], k: 0, pf: 'dome' },
    ];
    const augen = [];
    const details = P => {
      // Ölflecken, Bronzeknöpfe, Strahl
      for (const [dx, dy] of [[-8, 10], [6, 22], [-2, 32]]) P.set(r(cx + dx), r(sy + dy), 'k0');
      P.set(r(cx + 2), r(sy + 4), 'bronze'); P.set(r(cx + 2), r(sy + 12), 'bronze');
      if (spritz > 0) { const sx = hx - 6 - 12 * v.schnabel, sy0 = hy - 8; for (let i = 0; i < 6 * spritz; i++) P.set(r(sx - i * 2), r(sy0 - 1 + i * 0.4 + (i % 2)), i % 3 ? 'glutDim' : 'glut'); }
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
