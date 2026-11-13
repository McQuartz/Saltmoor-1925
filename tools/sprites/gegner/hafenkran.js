// Hafenviertel, dritter Wächter: Der Hafenkran. Der Dampfkran am Kai 4, der 1919 eine Ladung Ballast
// ins Hafenbecken fallen ließ und den Kranführer mit hinunterzog. Er hat ihn wieder heraufgeholt. Der
// Führer sitzt noch im Führerhaus, aufgedunsen, und der Kran läuft auf zwei Portalbeinen den Kai entlang.
// Am Ausleger hängt der Haken; wenn er ihn angesagt hat, kommt er herunter.
'use strict';
module.exports = {
  id: 'hafenkran', biom: 'hafen', zone: 'hafen', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [70, 70], rimBis: 172,
  varianten: { hafenkran: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let hak = 0, X = 0, fall = 0, glanz = 1, pendel = 0;
    if (p.idle) { pendel = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { hak = [-6, -12, 34, 12][f]; X = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); glanz = f < 2 ? 0.6 : 0; }
    const cx = 92 + X, sy = 64 + fall;
    // Portal: zwei schräge Beine mit Querstreben, unten Räder auf der Schiene
    const beine = [C(cx - 26, sy + 30, cx - 40, 170, 4, 4, 'dunkel', { pf: 'bevel' }), C(cx + 26, sy + 30, cx + 40, 170, 4, 4, 'dunkel', { pf: 'bevel' })];
    const streben = [C(cx - 33, sy + 70, cx + 33, sy + 70, 2, 2, 'dunkel', { pf: 'flat' }), C(cx - 36, sy + 70, cx + 28, sy + 40, 1.4, 1.4, 'dunkel', { pf: 'flat' }), C(cx + 36, sy + 70, cx - 28, sy + 40, 1.4, 1.4, 'dunkel', { pf: 'flat' })];
    const raeder = [E(cx - 40, 172, 6, 5, 'dunkel', { pf: 'flat' }), E(cx + 40, 172, 6, 5, 'dunkel', { pf: 'flat' })];
    // Führerhaus mit Dach, Fenster vorn, darin der Führer
    const haus = Pg([[cx - 28, sy + 32], [cx - 26, sy - 6], [cx + 24, sy - 8], [cx + 30, sy + 32]], null, { rd: 1.6 });
    const dach = Pg([[cx - 32, sy - 4], [cx - 24, sy - 16], [cx + 24, sy - 18], [cx + 34, sy - 6]], null, { rd: 1.2, pf: 'bevel' });
    const fenster = Pg([[cx - 22, sy + 2], [cx - 4, sy + 1], [cx - 4, sy + 18], [cx - 22, sy + 19]], 'dunkel', { rd: 0.6, pf: 'flat' });
    const fuehrer = E(cx - 13, sy + 12, 6, 7, null, { rd: 1.2 });
    const schlot = C(cx + 16, sy - 16, cx + 18, sy - 34, 3, 3, 'dunkel', { pf: 'flat' });
    // Ausleger: schräg nach links oben, Gitter
    const ax = 12, ay = 12;
    const ausleger = [C(cx - 22, sy - 4, ax, ay, 2.4, 1.6, 'dunkel', { pf: 'bevel' }), C(cx - 22, sy + 8, ax + 2, ay + 6, 1.8, 1.2, 'dunkel', { pf: 'bevel' })];
    const gitter = [];
    for (let i = 1; i < 7; i++) { const t = i / 7, x0 = cx - 22 + (ax - cx + 22) * t, y0 = sy - 4 + (ay - sy + 4) * t, y1 = sy + 8 + (ay + 6 - sy - 8) * t; gitter.push(C(x0, y0, x0 + 2, y1, 0.8, 0.8, 'dunkel', { pf: 'flat', noRim: true })); }
    // Haken an der Kette
    const hx = ax + 6 + pendel, hy = Math.min(150, 70 + hak);
    const haken = [C(hx, hy, hx, hy + 8, 2, 2, 'dunkel', { pf: 'bevel' }), C(hx, hy + 8, hx - 6, hy + 12, 2, 1.6, 'dunkel', { pf: 'bevel' }), C(hx - 6, hy + 12, hx - 7, hy + 6, 1.6, 1.2, 'dunkel', { pf: 'bevel' })];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: streben, k: 0, pf: 'flat' },
      { p: beine, k: 1, pf: 'bevel' },
      { p: raeder, k: 0, pf: 'flat' },
      { p: gitter, k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : ausleger, k: 1, pf: 'bevel' },
      { p: [schlot], k: 0, pf: 'flat' },
      { p: [haus], k: 3 },
      { p: [dach], k: 2, pf: 'bevel' },
      { p: [fenster], k: 0, pf: 'flat', noRim: true },
      { p: [fuehrer], k: 1 },
      { p: tot ? [] : haken, k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      if (!tot) P.line(r(ax + 2), r(ay + 4), r(hx), r(hy), 'r1');
      for (let y = sy + 6; y < sy + 30; y += 6) P.line(r(cx + 4), y, r(cx + 26), y, 'k2', true);
      for (let x = 4; x < 156; x += 6) P.set(x, 177, 'r1');
      if (glanz > 0) {
        const ex = r(cx - 16), ey = r(sy + 11);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        P.set(r(cx + 18), r(sy - 36), 'glutDim');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
