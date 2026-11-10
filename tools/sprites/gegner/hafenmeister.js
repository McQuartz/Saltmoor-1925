// Der Hafenmeister (Hafenviertel, Elite). Er schreibt seit 1919 den Pegel an, jede Stunde, auch
// nachts, auch jetzt. Breiter Mann im knielangen Überzieher, Schirmmütze tief im Gesicht, darunter
// nur zwei Lichter. In der Faust die Pegellatte, höher als er, mit Kerben; an der Marke, wo das
// Wasser steht, glimmt sie. Aus beiden Ärmeln laufen Festmacher bis auf den Boden und liegen dort
// in Buchten. Angriff: er stößt die Latte vor wie einen Bootshaken.
'use strict';
module.exports = {
  id: 'hafenmeister', biom: 'hafen', zone: 'hafen', w: 128, h: 160, fuss: [64, 155], kopf: [62, 34], rimBis: 152, rang: 'elite',
  varianten: { hafenmeister: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stoss = 0, atem = 0, fall = 0, glanz = 1, pegel = 0, hem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; pegel = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, 3, -7, -3][f]; stoss = [4, 6, -12, -4][f]; glanz = [1, 1.2, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; pegel = [2, 4, 6, 3][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; stoss = 2; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 5); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, sy = 60 + atem + fall;
    // Überzieher: schwer, breit an den Schultern, Saum knapp über dem Boden
    const mantel = Pg([[cx - 14 + ox, sy - 4], [cx + 4 + ox, sy - 8], [cx + 20 + ox, sy + 2], [cx + 18 + r(ox / 2), sy + 36 - fall / 2], [cx + 14 + r(ox / 3), sy + 52 - fall / 2], [cx + 28, 138], ...saum(cx + 30, cx - 26, 146, 6, 4, 7, hem), [cx - 26, 138], [cx - 14 + r(ox / 3), sy + 52 - fall / 2], [cx - 20 + r(ox / 2), sy + 30 - fall / 2]], null, { rd: 1.6 });
    // nasser Saum: Tang hängt bis auf den Boden
    const tang = [0, 1, 2, 3].map(i => glied([[cx - 20 + i * 14, 142], [cx - 22 + i * 14 + (i % 2 ? 2 : -1), 148], [cx - 21 + i * 14, 153]], 1.6, 0.8, 'dunkel'));
    const kragen = Pg([[cx - 14 + ox, sy - 4], [cx + 16 + ox, sy - 2], [cx + 10 + ox, sy + 10], [cx - 12 + ox, sy + 8]], 'dunkel', { rd: 1, pf: 'bevel' });
    const beine = [C(cx - 9, 140, cx - 10, 152, 4, 4, 'dunkel'), C(cx + 10, 140, cx + 12, 152, 4, 4, 'dunkel')];
    // Kopf und Mütze (Schirm nach vorn, also nach links)
    const kx = cx - 9 + ox * 1.3, ky = sy - 8 + atem;
    const hals = C(cx - 2 + ox, sy - 2, kx + 1, ky + 6, 4, 3, null);
    const kopf = E(kx, ky + 2, 9, 8, null);
    const muetze = Pg([[kx - 9, ky - 3], [kx - 7, ky - 10], [kx + 6, ky - 11], [kx + 10, ky - 5], [kx + 9, ky - 2]], null, { rd: 1, pf: 'bevel' });
    const schirm = Pg([[kx - 16, ky - 1], [kx + 2, ky - 4], [kx + 2, ky - 1], [kx - 14, ky + 1]], 'dunkel', { rd: 0.5, pf: 'flat' });
    // Pegellatte in der vorderen Faust; beim Stoß wandert sie nach vorn
    const lx = cx - 32 + ox + stoss, ly0 = 8 + fall, ly1 = 152;
    const latte = Pg([[lx - 2.5, ly0], [lx + 2.5, ly0], [lx + 2.5, ly1], [lx - 2.5, ly1]], null, { rd: 0.3, pf: 'flat' });
    const faust = E(lx + 1, sy + 26, 4, 4, 'haut');
    const armV = glied([[cx - 14 + ox, sy + 4], [cx - 22 + ox + stoss / 2, sy + 16], [lx + 2, sy + 25]], 4, 3.4, null);
    const armH = glied([[cx + 14 + ox, sy + 4], [cx + 18 + ox, sy + 20], [cx + 16 + ox, sy + 34]], 4, 3.4, null);
    // Festmacher: aus den Ärmeln bis auf den Boden, dort Buchten
    const tau = [
      ...glied([[lx + 3, sy + 28], [lx + 6, sy + 60], [lx + 2, 120], [lx - 6, 148]], 1.3, 1.1, 'dunkel', { noRim: true }),
      ...glied([[cx + 16 + ox, sy + 36], [cx + 22, sy + 70], [cx + 30, 130], [cx + 36, 150]], 1.3, 1.1, 'dunkel', { noRim: true }),
    ];
    const bucht = [E(lx - 10, 151, 9, 3, 'dunkel', { pf: 'bevel' }), E(cx + 40, 151, 10, 3, 'dunkel', { pf: 'bevel' })];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: bucht, k: 1, pf: 'bevel' },
      { p: tau, k: 0 },
      { p: armH, k: 1 },
      { p: beine, k: 1 },
      { p: [mantel], k: 3 },
      { p: tang.flat(), k: 0 },
      { p: [kragen], k: 1 },
      { p: [hals, kopf, muetze], k: 2 },
      { p: [schirm], k: 0, pf: 'flat' },
      { p: tot ? [] : [latte], k: 0, pf: 'flat' },
      { p: armV, k: 1 },
      { p: [faust], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // nass bis zur Wasserlinie: unten eine Stufe dunkler, gedithert
      for (let y = 118; y < 150; y++) for (let x = 0; x < 128; x++) { const c = P.get(x, y); if (c >= 2 && c <= 4 && ((x + y) % 2 === 0 || y > 132)) P.set(x, y, c - 1); }
      // Knopfreihen am Überzieher
      for (let i = 0; i < 4; i++) { P.auf(r(cx - 5 + ox), r(sy + 14 + i * 9), 'k3'); P.auf(r(cx + 3 + ox), r(sy + 14 + i * 9), 'k3'); }
      // Kerben an der Latte, jede fünfte länger; die Wasserlinie glimmt
      if (!tot) {
        for (let y = ly0 + 4; y < ly1 - 4; y += 4) { const lang = ((y - ly0) / 4) % 5 === 0; P.line(r(lx - 2), r(y), r(lx - 2 + (lang ? 3 : 1)), r(y), 'k0', true); }
        const wy = r(96 - pegel * 3 + fall / 2);
        P.line(r(lx - 2), wy, r(lx + 2), wy, 'glut', true); P.auf(r(lx), wy, 'kern');
        P.glow(lx, wy + 0.5, 7, 0.7, 'glutDim', 'k3');
      }
      // Augen unter dem Schirm
      if (glanz > 0) {
        const ex = r(kx - 6), ey = r(ky + 2);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'kern'); P.set(ex + 6, ey, 'glut');
        P.glow(ex + 3, ey + 0.5, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
