// Der Hakenmann (Konservenfabrik). Er hat die Fischkisten mit dem Handhaken vom Band gezogen,
// zwölf Stunden die Nacht. Ein langer Arbeiter im Ölzeug, die Schürze steif von Schuppen. Der
// Haken ist ihm in die Hand gewachsen und länger geworden, ein Bogen aus Eisen bis zur Schulter
// und zurück. Er reißt dir die Deckung weg wie eine Kiste vom Band. Angriff: der Haken fährt vor.
'use strict';
module.exports = {
  id: 'hakenmann', biom: 'fabrik', zone: 'fabrik', w: 96, h: 120, fuss: [48, 115], kopf: [42, 22], rimBis: 112,
  varianten: {
    hakenmann_a: { haken: 1, muetze: 0 },
    hakenmann_b: { haken: 1.3, muetze: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, zug = 0, fall = 0, glanz = 1, nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; glanz = [1, 1, 1.1, 0.9][f]; }
    if (p.angriff) { lean = [2, 4, -7, -2][f]; zug = [5, 9, -10, -3][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52, ox = lean, sy = 36 + fall;
    const leib = Pg([[cx - 10 + ox, sy], [cx + 10 + ox, sy - 1], [cx + 12 + r(ox / 2), sy + 30], [cx + 14, 92], ...saum(cx + 14, cx - 14, 96, 4, 2, 6), [cx - 14, 92], [cx - 12 + r(ox / 2), sy + 30]], null, { rd: 1.4 });
    const beine = [C(cx - 6, 92, cx - 8, 112, 3.4, 3, 'dunkel'), C(cx + 6, 92, cx + 7, 112, 3.4, 3, 'dunkel')];
    const stiefel = [E(cx - 10, 113, 5, 2.5, 'dunkel'), E(cx + 8, 113, 4.5, 2.5, 'dunkel')];
    const kx = cx - 4 + ox * 1.3, ky = sy - 9 + nick;
    const kopf = E(kx, ky, 6, 7, null);
    const hut = v.muetze ? Pg([[kx - 12, ky - 1], [kx - 6, ky - 9], [kx + 6, ky - 9], [kx + 10, ky], [kx + 4, ky - 3], [kx - 6, ky - 3]], null, { rd: 1, pf: 'bevel' })
      : Pg([[kx - 7, ky - 2], [kx - 5, ky - 9], [kx + 5, ky - 9], [kx + 7, ky - 2]], null, { rd: 1, pf: 'bevel' });
    // Arm mit Haken, vorn
    const hk = v.haken, hx = cx - 20 + ox - zug, hy = sy + 22 - r(zug / 3);
    const armV = glied([[cx - 8 + ox, sy + 3], [cx - 16 + ox - zug / 2, sy + 14], [hx, hy]], 3, 2.4, null);
    const haken = [], R = 6 * hk, hcx = hx - R, hcy = hy - 14 * hk;
    for (let i = 0; i < 6; i++) { const a0 = -i * Math.PI / 6, a1 = -(i + 1) * Math.PI / 6; haken.push(C(hcx + R * Math.cos(a0), hcy + R * Math.sin(a0), hcx + R * Math.cos(a1), hcy + R * Math.sin(a1), 1.5, 1.3, null, { pf: 'bevel' })); }
    haken.push(C(hcx - R, hcy, hcx - R + 1, hcy + 5, 1.3, 0.6, null, { pf: 'bevel' }));
    const stiel = C(hx, hy + 2, hx, hcy, 1.6, 1.5, null, { pf: 'bevel' });
    const armH = glied([[cx + 8 + ox, sy + 3], [cx + 14 + ox, sy + 18], [cx + 12 + ox, sy + 32]], 3, 2.4, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: beine, k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [kopf, hut], k: 1 },
      { p: armV, k: 1 },
      { p: tot ? [] : [stiel, ...haken], k: 0.5, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Schuppen auf der Schürze, Rost am Haken
      for (let y = sy + 16; y < 92; y += 5) for (let x = cx - 9; x < cx + 9; x += 4) P.auf(x + ((y >> 2) % 2) * 2 + r(ox / 3), y, 'k3');
      if (!tot) { P.auf(r(hx), r(hy - 6 * hk), 'rost'); P.auf(r(hx + 1), r(hy - 9 * hk), 'rost'); }
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'kern');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
