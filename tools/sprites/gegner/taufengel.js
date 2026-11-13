// Überflutete Kapelle, dritter Wächter: Der Taufengel. Ein hölzerner Engel, der früher an Ketten von
// der Decke hing und bei der Taufe die Schale herabließ. Die Ketten sind gerissen, als das Wasser kam,
// und er steht jetzt selbst im Wasser, die Flügel nass und schwer, die Schale vor der Brust. Unter
// seinen Flügeln sieht man nicht, was er vorhat. Angriff: die Flügel schlagen zu.
'use strict';
module.exports = {
  id: 'taufengel', biom: 'kapelle', zone: 'kapelle', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 34], rimBis: 172,
  varianten: { taufengel: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let flug = 0, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { flug = [4, 10, -14, -4][f]; X = [1, 2, -5, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); flug = -r(p.q * 10); glanz = f < 2 ? 0.6 : 0; }
    const cx = 80 + X, sy = 54 + fall;
    const fl = (s) => Pg([[cx + s * 10, sy + 4], [cx + s * (34 + flug), sy - 26 - flug], [cx + s * (60 + flug), sy - 20 - flug * 0.5], [cx + s * (66 + flug * 0.5), sy + 30], [cx + s * 52, sy + 80], [cx + s * 40, sy + 100], [cx + s * 26, sy + 70], [cx + s * 14, sy + 40]], null, { rd: 2, pf: 'bevel' });
    const fluegel = [fl(-1), fl(1)];
    const gewand = Pg([[cx - 12, sy], [cx + 12, sy], [cx + 18, sy + 40], [cx + 24, 150], ...saum(cx + 24, cx - 24, 156, 7, 3, 4), [cx - 24, 150], [cx - 18, sy + 40]], null, { rd: 2 });
    const wasser = E(80, 158, 64, 5, 'dunkel', { pf: 'flat' });
    const kx = cx, ky = sy - 10 + atem * 0.5;
    const kopf = E(kx, ky, 8, 9, null, { rd: 1.4 });
    const locken = [-6, -2, 2, 6].map(dx => E(kx + dx, ky - 8, 3, 2.6, null, { pf: 'dome' }));
    const schale = E(cx, sy + 26, 14, 5, null, { pf: 'bevel' });
    const arme = [glied([[cx - 10, sy + 4], [cx - 16, sy + 18], [cx - 12, sy + 26]], 3, 2.4, null), glied([[cx + 10, sy + 4], [cx + 16, sy + 18], [cx + 12, sy + 26]], 3, 2.4, null)];
    const ketten = [C(cx - 30, sy - 22, cx - 28, 4, 0.8, 0.8, 'dunkel', { pf: 'flat', noRim: true }), C(cx + 30, sy - 22, cx + 32, 2, 0.8, 0.8, 'dunkel', { pf: 'flat', noRim: true })];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : ketten, k: 0, pf: 'flat', noRim: true },
      { p: fluegel, k: 2, pf: 'bevel' },
      { p: [gewand], k: 3 },
      { p: arme.flat(), k: 1 },
      { p: [schale], k: 1, pf: 'bevel' },
      { p: [kopf], k: 2 },
      { p: locken, k: 1.5, pf: 'dome' },
      { p: [wasser], k: 0, pf: 'flat', noRim: true },
    ];
    const augen = [];
    const details = P => {
      // Federn als Holzschnitzerei, abblätterndes Gold, Wasserlinie
      for (const s of [-1, 1]) for (let i = 0; i < 5; i++) P.line(r(cx + s * (20 + i * 8)), r(sy - 6 + i * 4), r(cx + s * (24 + i * 8)), r(sy + 40 + i * 8), 'k1', true);
      for (let x = 20; x < 140; x += 5) P.set(x, 154, 'r1');
      P.set(r(cx - 6), r(sy + 24), 'flamme'); P.set(r(cx + 6), r(sy + 24), 'flamme');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 7, ey, 'glut');
        P.glow(ex + 3.5, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 7, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
