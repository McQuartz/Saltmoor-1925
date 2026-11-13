// Der Ankermann (Hafen, Elite). Er ist 1922 mit dem Anker über Bord gegangen und hat ihn nicht
// losgelassen. Jetzt trägt er ihn wieder hinauf, die Kette um Schultern und Hals geschlungen, und
// jedes Glied, das er heraufzieht, macht ihn schwerer. Wer ihn schlägt, schlägt auf Eisen.
// Ein gebeugter Riese, Muscheln und Tang auf dem Rücken. Angriff: der Anker schwingt herum.
'use strict';
module.exports = {
  id: 'ankermann', biom: 'hafen', zone: 'hafen', w: 128, h: 160, fuss: [64, 155], kopf: [58, 50], rimBis: 152, rang: 'elite',
  varianten: { ankermann: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, sw = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; sw = [0, 0.05, 0, -0.05][f]; glanz = [1, 1, 0.9, 1.1][f]; }
    if (p.angriff) { lean = [3, 5, -8, -3][f]; sw = [-0.6, -1.1, 1.0, 0.4][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; sw = 0.2; }
    if (p.tod) { fall = r(p.q * 42); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; }
    const cx = 70, ox = lean, sy = 58 + fall;
    const leib = Pg([[cx - 24 + ox, sy + 8], [cx - 14 + ox, sy - 6], [cx + 8 + ox, sy - 12], [cx + 26 + ox, sy - 2], [cx + 28 + r(ox / 2), sy + 30], [cx + 22, sy + 58], ...saum(cx + 22, cx - 18, sy + 62, 6, 3, 4), [cx - 22 + r(ox / 2), sy + 36]], null, { rd: 2.4 });
    const beine = [C(cx - 10, sy + 58, cx - 12, 150, 7, 6, 'dunkel'), C(cx + 12, sy + 58, cx + 14, 150, 7, 6, 'dunkel')];
    const stiefel = [E(cx - 15, 152, 9, 3.5, 'dunkel'), E(cx + 14, 152, 8, 3.5, 'dunkel')];
    const kx = cx - 16 + ox * 1.3, ky = sy + 2 + atem;
    const kopf = E(kx, ky, 9, 9, null, { rd: 1.6 });
    // Anker: Hand vorn, Schaft hängt, Arme unten; Schwung dreht um die Hand
    const hx = cx - 30 + ox, hy = sy + 34;
    const a = sw, L = 54;
    const ax = hx - Math.sin(a) * L, ay = hy + Math.cos(a) * L;
    const schaft = C(hx, hy, ax, ay, 2.4, 2.4, 'dunkel', { pf: 'bevel' });
    const nx = Math.cos(a), ny = Math.sin(a);
    const flunkL = glied([[ax, ay], [ax - nx * 12 - Math.sin(a) * 2, ay - ny * 12 + Math.cos(a) * 2], [ax - nx * 18 + Math.sin(a) * 10, ay - ny * 18 - Math.cos(a) * 10]], 3, 1.6, 'dunkel');
    const flunkR = glied([[ax, ay], [ax + nx * 12 - Math.sin(a) * 2, ay + ny * 12 + Math.cos(a) * 2], [ax + nx * 18 + Math.sin(a) * 10, ay + ny * 18 - Math.cos(a) * 10]], 3, 1.6, 'dunkel');
    const stock = C(hx - nx * 12, hy - ny * 12 + 6, hx + nx * 12, hy + ny * 12 + 6, 1.6, 1.6, 'dunkel', { pf: 'flat' });
    const armV = glied([[cx - 18 + ox, sy + 4], [cx - 30 + ox, sy + 18], [hx, hy]], 5.5, 4.5, null);
    const faust = E(hx, hy, 5, 5, 'haut');
    const armH = glied([[cx + 20 + ox, sy + 4], [cx + 30 + ox, sy + 24], [cx + 26 + ox, sy + 42]], 5, 4, null);
    // Kette über die Schulter: Glieder als kleine Ellipsen
    const kette = [];
    for (let i = 0; i < 9; i++) { const t = i / 8, x = cx + 22 - t * 38 + ox, y = sy - 4 + Math.sin(t * Math.PI) * -4 + t * 14; kette.push(E(x, y, i % 2 ? 2.6 : 1.6, i % 2 ? 1.6 : 2.4, 'dunkel', { pf: 'flat' })); }
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: beine, k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: kette, k: 0, pf: 'flat' },
      { p: tot ? [] : [schaft, stock, ...flunkL, ...flunkR], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [faust], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Muscheln und Seepocken auf dem Rücken, Tang
      for (let y = sy; y < sy + 44; y += 5) for (let x = cx + 6; x < cx + 24; x += 5) if (((x * 3 + y * 7) % 4) === 0) P.auf(r(x + ox), r(y), 'r1');
      for (let i = 0; i < 4; i++) P.line(r(cx + 10 + i * 4 + ox), r(sy + 50), r(cx + 9 + i * 4), r(sy + 60 + (i % 2) * 3), 'k3');
      for (let i = 0; i < 9; i += 2) { const t = i / 8; P.auf(r(cx + 22 - t * 38 + ox), r(sy - 5 + Math.sin(t * Math.PI) * -4 + t * 14), 'r1'); }
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 7 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
