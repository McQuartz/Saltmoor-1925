// Konservenfabrik, dritter Wächter: Das Fließband. Das Band läuft seit der Nachtschicht vom 4. November,
// und es hat sich aufgerichtet: ein langer Rücken aus Rollen und Gurt, der sich wie eine Raupe aufbäumt,
// vorn die Verschließmaschine als Kopf mit zwei Stempelaugen. Es läuft im Takt, und im Takt kommen
// die Dosen. Angriff: das Band schnellt vor und wirft die Dosen.
'use strict';
module.exports = {
  id: 'fliessband', biom: 'fabrik', zone: 'fabrik', rang: 'waechter', w: 160, h: 180, fuss: [84, 176], kopf: [40, 40], rimBis: 172,
  varianten: { fliessband: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lauf = 0, X = 0, fall = 0, glanz = 1, hub = 0;
    if (p.idle) { lauf = f; hub = [0, 1, 0, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { lauf = f * 2; hub = [-4, -8, 6, 2][f]; X = [2, 4, -10, -3][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    // Rücken als Bogen von hinten unten nach vorn oben
    const pts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([150 - t * 104 + X * t, 160 - Math.sin(t * Math.PI * 0.85) * 96 - t * 14 + hub * t + fall * t]); }
    const ruecken = glied(pts, 8, 7, null);
    const rollen = pts.slice(1, 8).map(([x, y], i) => E(x, y + 8, 3.6, 3.6, 'dunkel', { pf: 'flat' }));
    const [kx, ky] = pts[8];
    const kopf = Pg([[kx - 26, ky - 10], [kx - 8, ky - 22], [kx + 12, ky - 16], [kx + 14, ky + 10], [kx - 4, ky + 18], [kx - 24, ky + 12]], null, { rd: 1.6 });
    const stempel = [C(kx - 14, ky + 12, kx - 14, ky + 24 - hub, 2.4, 2.4, 'dunkel', { pf: 'bevel' }), C(kx, ky + 12, kx, ky + 22 - hub, 2.4, 2.4, 'dunkel', { pf: 'bevel' })];
    const fuesse = [[150, 170], [128, 170], [104, 170]].map(([x, y], i) => C(pts[i * 2][0], pts[i * 2][1] + 6, x - 4, y, 3, 2.6, 'dunkel', { pf: 'bevel' }));
    const dosen = [];
    if (p.angriff && f >= 2) for (let i = 0; i < 3; i++) dosen.push(Pg([[kx - 30 - i * 10, ky + 20 + i * 8], [kx - 24 - i * 10, ky + 20 + i * 8], [kx - 24 - i * 10, ky + 28 + i * 8], [kx - 30 - i * 10, ky + 28 + i * 8]], null, { rd: 0.6, pf: 'bevel' }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: fuesse, k: 0, pf: 'bevel' },
      { p: ruecken, k: 3 },
      { p: rollen, k: 0, pf: 'flat' },
      { p: [kopf], k: 2 },
      { p: tot ? [] : stempel, k: 0, pf: 'bevel' },
      { p: dosen, k: 1, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Gurtglieder laufen über den Rücken
      for (let i = 0; i < 8; i++) { const [x, y] = pts[i], [x2, y2] = pts[i + 1]; for (let s = (lauf % 3) / 3; s < 1; s += 0.34) P.set(r(x + (x2 - x) * s), r(y - 7 + (y2 - y) * s), 'rost'); }
      if (glanz > 0) {
        const ex = r(kx - 14), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'kern'); P.set(ex + 12, ey, 'glut'); P.set(ex + 13, ey, 'glut');
        P.glow(ex + 6, ey, 9 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 12, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
