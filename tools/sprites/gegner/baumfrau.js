// Die Baumfrau (Wald, Elite). Sie hängt kopfüber im Geäst, die Füße in die Rinde eingewachsen,
// das Haar fällt bis zum Waldboden und schlägt dort Wurzeln. Sie pendelt, und wer ihrem Pendel
// zusieht, dem frieren die Hände. Harz tropft von ihren Fingerspitzen.
// Angriff: sie schwingt herab und schlägt mit dem Haar.
'use strict';
module.exports = {
  id: 'baumfrau', biom: 'wald', zone: 'wald', w: 128, h: 160, fuss: [64, 155], kopf: [62, 104], rimBis: 152, rang: 'elite',
  varianten: { baumfrau: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let sw = 0, fall = 0, glanz = 1, hub = 0;
    if (p.idle) { sw = [0, 0.5, 0, -0.5][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { sw = [3, 6, -10, -3][f]; hub = [0, -3, 6, 2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { sw = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    // Ast oben quer, fester Teil des Bildes
    const ast = Pg([[2, 14], [40, 8], [80, 10], [126, 4], [126, 14], [84, 20], [44, 22], [2, 24]], 'dunkel', { rd: 2 });
    const zweig = C(96, 14, 112, 28, 2, 1, 'dunkel', { pf: 'flat' });
    const ax = 64, ay = 20;
    const d = sw * 0.6; // Pendel: oben fest, unten weiter
    // Beine hoch in den Ast, Körper hängt
    const beine = [glied([[ax - 4, ay], [ax - 5 + d * 0.2, ay + 12], [ax - 4 + d * 0.4, ay + 26]], 3.6, 3, null), glied([[ax + 5, ay], [ax + 4 + d * 0.2, ay + 12], [ax + 4 + d * 0.4, ay + 26]], 3.6, 3, null)];
    const rock = Pg([[ax - 7 + d * 0.4, ay + 24], [ax + 7 + d * 0.4, ay + 24], [ax + 16 + d * 0.6, ay + 44], [ax + 12 + d * 0.6, ay + 52], [ax - 12 + d * 0.6, ay + 52], [ax - 16 + d * 0.6, ay + 44]], null, { rd: 2 });
    const leib = Pg([[ax - 9 + d * 0.6, ay + 50], [ax + 9 + d * 0.6, ay + 50], [ax + 8 + d * 0.8, ay + 76 + hub], [ax - 8 + d * 0.8, ay + 76 + hub]], null, { rd: 2 });
    const kx = ax + d * 0.9, ky = ay + 84 + hub + fall * 0.3;
    const kopf = E(kx, ky, 7, 7.5, null, { rd: 1.4 });
    // Haar fällt bis zum Boden, Strähnen
    const haar = [];
    for (let i = 0; i < 5; i++) { const x0 = kx - 6 + i * 3, x1 = kx - 10 + i * 5 + d * 1.2 + (p.angriff ? sw * 1.6 : 0); haar.push(glied([[x0, ky + 4], [(x0 + x1) / 2 + (i - 2), ky + 24], [x1, 150]], 1.6, 1, null)); }
    // Arme hängen herab
    const arme = [glied([[ax - 8 + d * 0.6, ay + 54], [ax - 16 + d, ay + 72], [ax - 16 + d * 1.1, ay + 92]], 2.4, 2, null), glied([[ax + 8 + d * 0.6, ay + 54], [ax + 16 + d, ay + 72], [ax + 18 + d * 1.1, ay + 90]], 2.4, 2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [ast, zweig], k: 1 },
      { p: beine.flat(), k: 1 },
      { p: [rock], k: 3 },
      { p: [leib], k: 3 },
      { p: arme.flat(), k: 1 },
      { p: tot ? haar.slice(0, 2).flat() : haar.flat(), k: 1.5 },
      { p: [kopf], k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Rinde wächst über die Füße, Harz an den Fingern, Wurzeln am Boden
      for (let x = ax - 8; x <= ax + 8; x += 3) P.auf(r(x), r(ay + 3), 'harz');
      for (const x of [ax - 16 + d * 1.1, ax + 18 + d * 1.1]) { P.set(r(x), r(ay + 95), 'harzhell'); P.set(r(x), r(ay + 99), 'harz'); }
      for (let x = kx - 12; x < kx + 14; x += 6) P.line(r(x), 152, r(x + 3), 155, 'k2', true);
      if (glanz > 0) {
        // kopfüber: Augen unter dem Mund
        const ex = r(kx - 3), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
