// Salzstollen, dritter Wächter: Der Förderkorb. Der Korb, der 1911 die letzte Schicht hinunterbrachte
// und leer wieder heraufkam. Er fährt noch, ohne Seil, auf Beinen aus Grubenholz, und im Gitter stehen
// die Männer der letzten Schicht, dicht an dicht, die Lampen an. Wenn er hält, steigt einer aus.
// Angriff: das Gitter schlägt auf, und alle drängen nach vorn.
'use strict';
module.exports = {
  id: 'foerderkorb', biom: 'salz', zone: 'salz', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 40], rimBis: 172,
  varianten: { foerderkorb: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let tuer = 0, X = 0, fall = 0, glanz = 1, ruck = 0;
    if (p.idle) { ruck = [0, 1, 0, 0][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { tuer = [2, 6, 18, 8][f]; X = [1, 2, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 82 + X, top = 26 + fall + ruck;
    const rahmen = Pg([[cx - 40, top + 6], [cx - 36, top], [cx + 36, top], [cx + 40, top + 6], [cx + 40, 148], [cx - 40, 148]], null, { rd: 1.2 });
    const innen = Pg([[cx - 32, top + 12], [cx + 32, top + 12], [cx + 32, 142], [cx - 32, 142]], 'dunkel', { rd: 0.6, pf: 'flat' });
    const buegel = [C(cx - 30, top, cx, top - 16, 2, 2, 'dunkel', { pf: 'bevel' }), C(cx + 30, top, cx, top - 16, 2, 2, 'dunkel', { pf: 'bevel' }), E(cx, top - 18, 4, 3, 'dunkel', { pf: 'flat' })];
    const beine = [[-36, -1], [-14, 0], [14, 0], [36, 1]].map(([dx, s]) => glied([[cx + dx, 146], [cx + dx + s * 6, 158], [cx + dx + s * 4, 172]], 3.6, 3, 'dunkel'));
    // Männer im Korb: Köpfe mit Helm, Schultern
    const maenner = [], koepfe = [];
    for (let i = 0; i < 4; i++) { const x = cx - 22 + i * 15, y = top + 34 + (i % 2) * 4 - (i === 1 ? tuer * 0.3 : 0); maenner.push(E(x, y + 30, 8, 26, null, { rd: 1.6 })); koepfe.push(E(x, y, 6, 6.5, null, { rd: 1.2 })); koepfe.push(Pg([[x - 7, y - 2], [x - 5, y - 8], [x + 5, y - 8], [x + 7, y - 2]], null, { rd: 0.8, pf: 'bevel' })); }
    // Gitter: vorn, klappt nach links auf
    const g = [];
    const gx0 = cx - 34 - tuer * 1.2;
    for (let i = 0; i < 7; i++) g.push(C(gx0 + i * (10 - tuer * 0.4), top + 14, gx0 + i * (10 - tuer * 0.4), 140, 0.9, 0.9, 'dunkel', { pf: 'flat', noRim: true }));
    g.push(C(gx0, top + 60, gx0 + 6 * (10 - tuer * 0.4), top + 60, 0.9, 0.9, 'dunkel', { pf: 'flat', noRim: true }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine.flat(), k: 1 },
      { p: buegel, k: 0, pf: 'bevel' },
      { p: [rahmen], k: 3 },
      { p: [innen], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : maenner, k: 1.5 },
      { p: tot ? [] : koepfe, k: 2 },
      { p: g, k: 0, pf: 'flat', noRim: true },
    ];
    const augen = [];
    const details = P => {
      // Salzkruste am Rahmen, Lampen auf den Helmen
      for (let y = top + 4; y < 146; y += 4) { if ((y * 7) % 5 === 0) { P.auf(r(cx - 38), y, 'r1'); P.auf(r(cx + 38), y + 2, 'r1'); } }
      if (glanz > 0 && !tot) {
        for (let i = 0; i < 4; i++) { const x = r(cx - 22 + i * 15), y = r(top + 34 + (i % 2) * 4 - (i === 1 ? tuer * 0.3 : 0) - 6); P.set(x, y, i === 1 ? 'kern' : 'glut'); P.glow(x, y, (i === 1 ? 7 : 4) * glanz, 0.7 * glanz, 'glutDim', 'k3'); if (i === 1) augen.push([x, y]); }
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
