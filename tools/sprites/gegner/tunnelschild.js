// Station, die nie eröffnet wurde, dritter Wächter: Der Vortriebsschild. Mit ihm wurde 1925 der Tunnel
// gegraben, ein runder Stahlschild, hinter dem die Mineure arbeiteten. Er gräbt weiter, auch wo kein
// Tunnel hin soll, und hinter dem Schild schieben ihn die Männer auf ihren Knien. Er bricht durch jede
// Wand und jede Deckung. Angriff: der Schneidring dreht und stößt vor.
'use strict';
module.exports = {
  id: 'tunnelschild', biom: 'station', zone: 'station', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [64, 90], rimBis: 172,
  varianten: { tunnelschild: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let stoss = 0, dreh = 0, fall = 0, glanz = 1;
    if (p.idle) { dreh = f * 0.2; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { dreh = f * 0.6; stoss = [2, 4, -14, -5][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { stoss = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); glanz = f < 2 ? 0.6 : 0; }
    const sx = 66 + stoss, sy = 104 + fall;
    // Hinten der Zylinder mit den Männern, vorn der Schild
    const rohr = Pg([[sx + 4, sy - 56], [sx + 70, sy - 52], [sx + 76, sy - 40], [sx + 76, sy + 50], [sx + 70, sy + 62], [sx + 4, sy + 58]], null, { rd: 2 });
    const schild = E(sx, sy, 34, 62, null, { pf: 'dome', rd: 1.6 });
    const nabe = E(sx - 4, sy, 9, 14, 'dunkel', { pf: 'dome' });
    const zaehne = [];
    for (let i = 0; i < 10; i++) { const w = dreh + i * Math.PI / 5, y = sy + Math.sin(w) * 58, x = sx - 6 + Math.cos(w) * 8; zaehne.push(Pg([[x - 4, y - 3], [x - 10, y], [x - 4, y + 3]], 'dunkel', { rd: 0.4, pf: 'bevel' })); }
    const speichen = [0, 1, 2].map(i => { const w = dreh + i * Math.PI / 3; return C(sx - 4 - Math.cos(w) * 4, sy - Math.sin(w) * 50, sx - 4 + Math.cos(w) * 4, sy + Math.sin(w) * 50, 1.6, 1.6, 'dunkel', { pf: 'flat' }); });
    const maenner = [0, 1, 2].map(i => { const x = sx + 30 + i * 16, y = sy + 30 - (i % 2) * 4; return [E(x, y - 30, 6, 6.5, null, { rd: 1.2 }), Pg([[x - 7, y - 24], [x + 7, y - 24], [x + 9, y + 20], [x - 9, y + 20]], null, { rd: 1.6 })]; });
    const kufen = [C(sx + 6, sy + 60, sx + 76, sy + 62, 3, 3, 'dunkel', { pf: 'bevel' }), E(sx + 16, 170, 8, 5, 'dunkel', { pf: 'flat' }), E(sx + 62, 170, 8, 5, 'dunkel', { pf: 'flat' })];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: kufen, k: 0, pf: 'bevel' },
      { p: [rohr], k: 3 },
      { p: tot ? [] : maenner.flat(), k: 1.5 },
      { p: [schild], k: 2, pf: 'dome' },
      { p: speichen, k: 0, pf: 'flat' },
      { p: [nabe], k: 0, pf: 'dome' },
      { p: zaehne, k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Nieten am Rohr, Emailschild mit Baunummer, Abraum unten
      for (let x = sx + 10; x < sx + 72; x += 8) { P.set(r(x), r(sy - 50), 'k3'); P.set(r(x), r(sy + 56), 'k3'); }
      P.line(r(sx + 40), r(sy - 44), r(sx + 56), r(sy - 44), 'email'); P.line(r(sx + 40), r(sy - 42), r(sx + 56), r(sy - 42), 'email');
      for (let x = 4; x < sx - 10; x += 5) P.set(x, 174 - (x % 3), 'blass');
      if (glanz > 0) {
        // die Nabe ist das Auge, die Männer haben Grubenlampen
        const ex = r(sx - 6), ey = r(sy);
        P.set(ex, ey, 'kern'); P.set(ex, ey + 1, 'glut');
        P.glow(ex, ey, 9 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        if (!tot) for (let i = 0; i < 3; i++) P.set(r(sx + 30 + i * 16), r(sy - 2 - (i % 2) * 4), 'glut');
        augen.push([ex, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
