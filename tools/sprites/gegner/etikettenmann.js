// Der Etikettenmann (Konservenfabrik, Elite). Er hat in der Klebestube die Etiketten auf die Dosen
// gebracht, „Saltmoorer Hering in Tomate“, zwanzigtausend am Tag, bis eines Nachts der Leim auf ihn
// überging. Jetzt klebt er an sich selbst: ein hoher, runder Leib aus Etiketten, Schicht über Schicht,
// darüber der kleine Kopf mit dem Pinsel zwischen den Zähnen, die Arme lang wie Bandarme. Auf seiner
// Brust lacht der Fisch vom Etikett, und der Fisch hat die Augen. Angriff: er klatscht ein Etikett
// mit der flachen Hand nach vorn.
'use strict';
module.exports = {
  id: 'etikettenmann', biom: 'fabrik', zone: 'fabrik', w: 128, h: 160, fuss: [66, 155], kopf: [60, 12], rimBis: 152, rang: 'elite',
  varianten: { etikettenmann: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, schlag = 0, blick = 1, fall = 0, flatter = f % 2;
    if (p.angriff) { lean = [3, 4, -6, -2][f]; schlag = [-0.4, -0.7, 1, 0.4][f]; blick = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; blick = 0.5; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 4); blick = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, by = 92 + fall;
    // Leib: hoher Zylinder aus Papierschichten, oben schmaler
    const leib = [E(cx - 1 + ox * 0.6, by + 2, 25, 40, null, { pf: 'bevel' }), Pg([[cx - 16, by + 30], [cx + 14, by + 30], [cx + 12, by + 44], [cx - 14, by + 44]], null, { rd: 3 })];
    const fetzen = [];
    for (let i = 0; i < 5; i++) { const y = by - 24 + i * 14, rw = 24 * Math.sqrt(Math.max(0, 1 - ((y + 3 - by - 2) / 40) ** 2)), x = cx - 1 + ox * 0.6 + (i % 2 ? rw : -rw), d = i % 2 ? 1 : -1; fetzen.push(Pg([[x, y], [x + d * 7, y + 2 + (i === 2 ? flatter : 0)], [x + d * 5, y + 7], [x, y + 5]], 'haut', { rd: 0.3, pf: 'flat' })); }
    const beine = [C(cx - 10, by + 40, cx - 11, 151, 3.4, 2.8, null), C(cx + 8, by + 40, cx + 9, 151, 3.4, 2.8, null), E(cx - 15, 153, 5, 1.8, 'dunkel'), E(cx + 5, 153, 5, 1.8, 'dunkel')];
    // Kopf: klein auf dem Leib, Pinsel quer im Mund
    const kx = cx - 4 + ox, ky = by - 42;
    const kopf = E(kx, ky, 7, 7, 'haut');
    const muetze = Pg([[kx - 8, ky - 2], [kx - 5, ky - 9], [kx + 6, ky - 9], [kx + 8, ky - 2]], 'dunkel', { rd: 1 });
    const pinsel = C(kx - 14, ky + 4, kx + 8, ky + 3, 0.9, 0.9, 'dunkel', { pf: 'flat' });
    // Arme: lang, mit vielen Gelenken wie die Bandarme der Maschine
    const s = schlag;
    const armL = glied([[cx - 18 + ox, by - 28], [cx - 30 + ox, by - 14], [cx - 36 + ox - s * 14, by - 2 - s * 8], [cx - 44 + ox - s * 18, by + 6 - s * 16]], 3, 2.2, null);
    const hand = [cx - 44 + ox - s * 18, by + 6 - s * 16];
    const etikett = Pg([[hand[0] - 9, hand[1] - 6], [hand[0] + 3, hand[1] - 6], [hand[0] + 3, hand[1] + 2], [hand[0] - 9, hand[1] + 2]], 'haut', { rd: 0.3, pf: 'flat' });
    const armR = glied([[cx + 16 + ox, by - 28], [cx + 30 + ox, by - 10], [cx + 30 + ox, by + 12], [cx + 24 + ox, by + 22]], 3, 2.2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armR, k: 1 },
      { p: beine, k: 1 },
      { p: leib, k: 4 },
      { p: tot ? [] : fetzen, k: 0, pf: 'flat' },
      { p: [kopf, muetze], k: 1 },
      { p: tot ? [] : [pinsel], k: 0, pf: 'flat' },
      { p: armL, k: 1 },
      { p: tot ? [] : [etikett], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Schichtkanten der Etiketten: Bögen quer über den Leib
      for (let i = 0; i < 6; i++) { const y = by - 26 + i * 12; for (let x = -20; x <= 20; x++) { const X = r(cx + x + ox * (1 - i / 6)), Y = r(y + (x * x) / 120); if ((x + i * 3) % 7 !== 0) P.auf(X, Y, i % 2 ? 'k1' : 'k3'); } }
      // Das große Etikett auf der Brust: ein Fisch, Rostrot, mit den Augen
      const fx = r(cx - 2 + ox * 0.8), fy = r(by - 10);
      P.el(fx + 0.5, fy + 0.5, 12, 7, 'k3', true);
      for (let x = -9; x <= 8; x++) { const h = Math.max(0, 4 - Math.abs(x + 1) * 0.4); for (let y = -h; y <= h; y++) P.auf(fx + x, fy + y, 'rost'); }
      P.auf(fx + 9, fy - 2, 'rost'); P.auf(fx + 9, fy + 2, 'rost'); P.auf(fx + 10, fy - 3, 'rost'); P.auf(fx + 10, fy + 3, 'rost');
      // Maul: ein lachender Strich
      P.line(fx - 9, fy + 1, fx - 5, fy + 2, 'k0', true);
      if (blick > 0) {
        P.set(fx - 6, fy - 2, 'kern'); P.set(fx - 5, fy - 2, 'glut'); P.set(fx - 6, fy - 3, 'glut');
        P.glow(fx - 5.5, fy - 1.5, 6 * blick, 0.8, 'glutDim', 'k3');
        augen.push([fx - 6, fy - 2]);
        // die eigenen Augen: zwei matte Punkte, kaum Licht
        P.set(r(kx - 4), r(ky - 1), 'glutDim'); P.set(r(kx), r(ky - 1), 'glutDim');
      }
      // Leim am Pinsel
      if (!tot) { P.set(r(kx - 14), r(ky + 4), 'glut'); P.set(r(kx - 15), r(ky + 5), 'glutDim'); }
      // Etikett in der Hand: Rostband
      if (!tot) P.line(r(hand[0] - 8), r(hand[1] - 2), r(hand[0] + 2), r(hand[1] - 2), 'rost', true);
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
