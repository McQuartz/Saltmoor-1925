// Grotte der Gaben, dritter Wächter: Die Kerzenkönigin. Hundert Jahre lang haben die Pilger ihre Kerzen
// vor der Nische angezündet, und das Wachs ist heruntergelaufen und hat sich gestaut. Jetzt steht es auf:
// ein Kegel aus Wachs, so hoch wie die Nische, mit einem Kranz aus brennenden Dochten als Krone. Wer
// sie schlägt, verbrennt sich. Angriff: sie neigt sich, und das heiße Wachs fließt.
'use strict';
module.exports = {
  id: 'kerzenkoenigin', biom: 'grotte', zone: 'grotte', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 50], rimBis: 172,
  varianten: { kerzenkoenigin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let neig = 0, fall = 0, glanz = 1, flack = 1;
    if (p.idle) { flack = [1, 1.2, 0.9, 1.1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { neig = [2, 5, -12, -4][f]; glanz = [1, 1.3, 1.7, 1.1][f]; flack = [1.2, 1.4, 1.8, 1.2][f]; }
    if (p.treffer) { neig = [4, 2][f]; glanz = 0.5; flack = 0.6; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; flack = f < 2 ? 0.5 : 0; }
    const cx = 80, top = 40 + fall, n = neig;
    const kegel = Pg([[cx - 14 + n, top], [cx + 14 + n, top], [cx + 26 + n * 0.6, top + 50], [cx + 44, 160], ...saum(cx + 44, cx - 44, 168, 11, 4, 6), [cx - 44, 160], [cx - 26 + n * 0.6, top + 50]], null, { rd: 3 });
    // Tropfnasen am Rand
    const nasen = [[-38, 120, 12], [-20, 96, 20], [24, 104, 16], [40, 130, 10], [0, 80, 14]].map(([dx, y, h]) => Pg([[cx + dx - 4, y + fall], [cx + dx + 4, y + fall], [cx + dx + 2, y + h + fall], [cx + dx, y + h + 3 + fall], [cx + dx - 2, y + h + fall]], null, { rd: 1.2, pf: 'dome' }));
    // Gesicht ins Wachs gedrückt, Arme als zusammengelaufene Kerzen
    const arme = [glied([[cx - 20 + n * 0.8, top + 40], [cx - 38 + n, top + 56], [cx - 42 + n * 1.4, top + 80]], 5, 3.6, null), glied([[cx + 20 + n * 0.8, top + 40], [cx + 36, top + 58], [cx + 38, top + 82]], 5, 3.6, null)];
    const kerzenH = [[-42 + n * 1.4, top + 80], [38, top + 82]].map(([x, y]) => C(x + (x < 0 ? cx - cx : 0), y, x, y - 12, 2, 2, null, { pf: 'flat' }));
    const dochte = [];
    for (let i = 0; i < 7; i++) { const x = cx - 13 + i * 4.3 + n, h = 6 + (i % 3) * 3; dochte.push(C(x, top + 1, x, top - h, 1.4, 1.2, null, { pf: 'flat' })); }
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: arme.flat(), k: 1 },
      { p: [kegel], k: 3 },
      { p: nasen, k: 2, pf: 'dome' },
      { p: tot ? [] : dochte, k: 1, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Wachs: Schichten in Wachsgelb, Kerzenrot dazwischen
      for (let y = top + 20; y < 160; y += 12) for (let x = cx - 20 - (y - top) * 0.18; x < cx + 20 + (y - top) * 0.18; x += 5) P.set(r(x + ((y / 12) % 2) * 2), y, ((x + y) % 3) < 1 ? 'kerzenrot' : 'k3');
      // Flammen auf der Krone und an den Armen
      if (flack > 0) {
        for (let i = 0; i < 7; i++) { const x = r(cx - 13 + i * 4.3 + n), h = 6 + (i % 3) * 3; P.set(x, r(top - h - 1), 'flamme'); if (flack > 1) P.set(x, r(top - h - 2), 'kern'); }
        P.glow(cx + n, top - 8, 12 * flack, 0.6 * flack, 'glutDim', 'k3');
        for (const [x, y] of [[cx - 42 + n * 1.4, top + 66], [cx + 38, top + 68]]) { P.set(r(x), r(y), 'flamme'); }
      }
      if (glanz > 0) {
        const ex = r(cx - 6 + n), ey = r(top + 22);
        P.set(ex, ey, 'kern'); P.set(ex + 10, ey, 'glut');
        P.glow(ex + 5, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        P.line(r(cx - 4 + n), r(top + 32), r(cx + 6 + n), r(top + 33), 'k0', true);
        augen.push([ex, ey], [ex + 10, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
