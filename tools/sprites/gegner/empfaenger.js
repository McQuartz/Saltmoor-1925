// Funkstation am Pol, dritter Wächter: Der Empfänger. Das Gerät, auf dem 1912 das Signal zum ersten
// Mal kam. Es hat sich die Funker genommen, einen nach dem anderen, und ist mit ihnen gewachsen: ein
// Schrank aus Holz und Kupfer auf Beinen aus Kabel, mit Röhren auf dem Rücken, und wo der Lautsprecher
// war, spricht ein Mund. Er dreht am Knopf, und mit der Frequenz ändert sich, was ihn verletzt.
// Angriff: das Signal schreit.
'use strict';
module.exports = {
  id: 'empfaenger', biom: 'funkstation', zone: 'funkstation', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [70, 70], rimBis: 172,
  varianten: { empfaenger: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let schrei = 0, knopf = 0, X = 0, fall = 0, glanz = 1;
    if (p.idle) { knopf = f * 0.5; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { knopf = f; schrei = [1, 2, 6, 3][f]; X = [1, 2, -5, -2][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 82 + X, top = 40 + fall;
    const schrank = Pg([[cx - 40, top + 6], [cx - 36, top], [cx + 36, top], [cx + 40, top + 6], [cx + 40, top + 100], [cx - 40, top + 100]], null, { rd: 1.6 });
    const roehren = [-24, -8, 8, 24].map((dx, i) => Pg([[cx + dx - 4, top], [cx + dx - 4, top - 14 - (i % 2) * 6], [cx + dx, top - 18 - (i % 2) * 6], [cx + dx + 4, top - 14 - (i % 2) * 6], [cx + dx + 4, top]], null, { rd: 1, pf: 'dome', tone: 0.1 }));
    const mund = E(cx - 10, top + 40, 16, 10 + schrei, 'dunkel', { pf: 'flat' });
    const knoepfe = [cx + 18, cx + 30].map((x, i) => E(x, top + 30 + i * 18, 5, 5, 'dunkel', { pf: 'dome' }));
    const kabel = [[-34, -1], [-14, 0], [14, 0], [34, 1]].map(([dx, s]) => glied([[cx + dx, top + 98], [cx + dx + s * 10, top + 116], [cx + dx + s * 6, 172]], 2.6, 2, 'dunkel'));
    const arme = [glied([[cx - 38, top + 30], [cx - 54, top + 44], [cx - 56, top + 70]], 3, 2.4, null), glied([[cx + 38, top + 30], [cx + 46, top + 34], [cx + 30, top + 30]], 3, 2.4, null)];
    const kopfhoerer = C(cx - 56, top + 70, cx - 50, top + 78, 3, 3, 'dunkel', { pf: 'dome' });
    const antenne = C(cx + 30, top - 4, cx + 44, top - 34, 1, 1, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: kabel.flat(), k: 1 },
      { p: [antenne], k: 0, pf: 'flat' },
      { p: roehren, k: 1, pf: 'dome' },
      { p: arme[0], k: 1 },
      { p: [kopfhoerer], k: 0, pf: 'dome' },
      { p: [schrank], k: 3 },
      { p: [mund], k: 0, pf: 'flat', noRim: true },
      { p: knoepfe, k: 0, pf: 'dome' },
      { p: arme[1], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Skala mit Zeiger, Kupferspulen, Papierstreifen
      P.line(r(cx - 30), r(top + 14), r(cx + 10), r(top + 14), 'papier');
      P.set(r(cx - 30 + (knopf * 9) % 40), r(top + 13), 'kupfer'); P.set(r(cx - 30 + (knopf * 9) % 40), r(top + 15), 'kupfer');
      for (let y = top + 60; y < top + 96; y += 4) P.line(r(cx + 14), y, r(cx + 34), y, 'kupfer', true);
      for (let x = cx - 24; x <= cx + 4; x += 4) P.set(r(x), r(top + 40), 'k3');
      if (glanz > 0) {
        // die Röhren glühen, eine davon ist das Auge
        [-24, -8, 8, 24].forEach((dx, i) => { const x = r(cx + dx), y = r(top - 8 - (i % 2) * 6); P.set(x, y, i === 1 ? 'kern' : 'glut'); P.glow(x, y, (i === 1 ? 7 : 4) * glanz, 0.6 * glanz, 'glutDim', 'k3'); });
        augen.push([r(cx - 8), r(top - 14)]);
        if (schrei > 1) for (let i = 1; i <= 3; i++) P.line(r(cx - 30 - i * 6), r(top + 32 - i * 2), r(cx - 30 - i * 6), r(top + 48 + i * 2), 'r1');
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
