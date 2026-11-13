// Der Trankocher (Walkathedrale, Elite). Er hat an Bord den Speck ausgekocht, Tag und Nacht, und im
// Wal hat er weitergemacht. Sein Leib ist der Trankessel geworden: ein bauchiger Topf aus Eisen auf
// zwei krummen Beinen, unter dem ein Feuer aus Walknochen glimmt. Oben schaut er aus dem Rand
// heraus, nur Schultern und ein kahler Kopf, und rührt mit der Kelle in sich selbst. Der Tran
// läuft über den Rand. Er heizt an, bis es überkocht, und zwischendurch löffelt er den anderen
// etwas davon zu. Angriff: er schüttet die Kelle aus.
'use strict';
module.exports = {
  id: 'trankocher', biom: 'walkathedrale', zone: 'walkathedrale', w: 128, h: 160, fuss: [64, 155], kopf: [52, 40], rimBis: 152, rang: 'elite',
  varianten: { trankocher: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, kelle = 0, fall = 0, glanz = 1, nick = 0, glut = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; glut = f; kelle = [0, 1, 2, 1][f]; glanz = [1, 1, 0.9, 1.1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; kelle = [6, 12, -10, -4][f]; glut = f; glanz = [1, 1.3, 1.7, 1.1][f]; nick = [0, -1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, ky0 = 70 + fall;
    // Kessel: bauchig, oben ein Rand, auf Beinen
    const kessel = Pg([[cx - 24 + ox, ky0], [cx + 24 + ox, ky0], [cx + 34 + ox, ky0 + 20], [cx + 32, ky0 + 44], [cx + 18, ky0 + 56], [cx - 18, ky0 + 56], [cx - 32, ky0 + 44], [cx - 34 + ox, ky0 + 20]], null, { rd: 3, pf: 'bevel' });
    const rand = Pg([[cx - 28 + ox, ky0 - 3], [cx + 28 + ox, ky0 - 3], [cx + 28 + ox, ky0 + 3], [cx - 28 + ox, ky0 + 3]], null, { rd: 1, pf: 'flat' });
    const beine = [...glied([[cx - 14, ky0 + 52], [cx - 24, 140], [cx - 20, 153]], 3.4, 2.6, null), ...glied([[cx + 14, ky0 + 52], [cx + 24, 140], [cx + 22, 153]], 3.4, 2.6, null)];
    // Feuer aus Knochen darunter
    const knochen = [C(cx - 14, 150, cx + 2, 146, 1.6, 1.6, null, { pf: 'flat' }), C(cx - 2, 146, cx + 14, 151, 1.6, 1.6, null, { pf: 'flat' }), C(cx - 8, 152, cx + 8, 152, 1.6, 1.6, null, { pf: 'flat' })];
    // oben aus dem Rand: Schultern und Kopf
    const sx = cx - 2 + ox, sy = ky0 - 8;
    const schultern = E(sx, sy + 4, 16, 8, null);
    const kx = sx - 8 + ox * 0.4, ky = sy - 10 + nick;
    const kopf = Pg([[kx - 8, ky - 2], [kx - 2, ky - 10], [kx + 8, ky - 9], [kx + 10, ky + 2], [kx + 4, ky + 9], [kx - 6, ky + 8]], 'haut', { rd: 2 });
    // Arm mit Kelle (vorn), der andere hält den Rand
    const hx = sx - 22 + r(kelle * 0.3), hy = sy - 6 - kelle;
    const armV = glied([[sx - 12, sy + 2], [sx - 22, sy - 2], [hx, hy]], 3.4, 2.8, null);
    const kStiel = C(hx, hy, hx - 10 - r(kelle / 2), hy + 26 - kelle * 1.5, 1.1, 1.1, 'dunkel', { pf: 'flat' });
    const lx = hx - 10 - r(kelle / 2), ly = hy + 26 - kelle * 1.5;
    const loeffel = E(lx, ly, 5, 3.5, null, { pf: 'bevel' });
    const armH = glied([[sx + 12, sy + 2], [sx + 24, sy + 4], [cx + 28 + ox, ky0 - 2]], 3.4, 2.8, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [schultern, kopf], k: 2 },
      { p: beine, k: 1 },
      { p: [kessel], k: 2, pf: 'bevel' },
      { p: [rand], k: 0, pf: 'flat' },
      { p: knochen, k: 0, pf: 'flat' },
      { p: [kStiel, loeffel], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Tran im Kessel und über den Rand gelaufen
      for (let x = cx - 26; x <= cx + 26; x++) if ((x + glut) % 5) P.auf(r(x + ox), r(ky0 - 3), 'tran');
      [[cx - 22, 6], [cx - 6, 12], [cx + 12, 8], [cx + 24, 14]].forEach(([x, n], i) => { for (let k = 0; k < n + (i === glut % 4 ? 2 : 0); k++) P.auf(r(x + ox * (1 - k / 30)), r(ky0 + 4 + k * 2), 'tran'); });
      // Nieten in einer Reihe
      for (let x = cx - 28; x <= cx + 28; x += 6) P.auf(r(x + ox), r(ky0 + 8), 'bein');
      // Glut unter dem Kessel
      [[cx - 6, 148], [cx + 4, 149], [cx, 147], [cx - 10, 150], [cx + 8, 150]].forEach(([x, y], i) => { if ((i + glut) % 3) P.set(x, y, i % 2 ? 'mark' : 'glutDim'); });
      if (!tot) { P.set(cx - 1, 146 - (glut % 2), 'glut'); P.glow(cx, 146, 8, 0.6, 'glutDim', 'k3'); }
      // in der Kelle ein Klecks Tran
      P.auf(r(lx - 2), r(ly - 1), 'tran'); P.auf(r(lx + 1), r(ly - 1), 'tran');
      if (p.angriff && f === 2) [[-6, 6], [-10, 10], [-4, 12], [-12, 4]].forEach(([dx, dy]) => P.set(r(lx + dx), r(ly + dy), 'tran'));
      // Augen
      if (glanz > 0) {
        const ex = r(kx - 6), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey - 1, 'kern'); P.set(ex + 6, ey - 1, 'glut');
        P.glow(ex + 3, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey - 1]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
