// Der Reliquienträger (Grotte der Gaben, Elite). Der Bruder, der den Schrein von Ort zu Ort trug,
// damit die Kranken ihn berühren konnten. Er trägt ihn noch: ein Kasten mit Giebeldach, auf
// Tragriemen, doppelt so hoch wie er, und er ist darunter klein und krumm geworden. Hinter der
// Glasscheibe liegt die Reliquie, eine Hand aus Wachs und Knochen, und in ihrer Fläche ist ein
// Auge. Wenn die Wachshände bei ihm sind, schließt er die Läden. Angriff: er stößt mit dem
// Pilgerstab, der Schrein kippt nach vorn.
'use strict';
module.exports = {
  id: 'reliquientraeger', biom: 'grotte', zone: 'grotte', w: 128, h: 160, fuss: [64, 155], kopf: [40, 84], rimBis: 152, rang: 'elite',
  varianten: { reliquientraeger: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, kipp = 0, stoss = 0, fall = 0, glanz = 1, hem = 0, flack = 0;
    if (p.idle) { kipp = [0, 0, 1, 1][f]; flack = f; glanz = [1, 1.1, 1, 0.9][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; kipp = [1, 2, -5, -2][f]; stoss = [3, 5, -10, -3][f]; glanz = [1, 1.3, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; kipp = 3; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 4); kipp = r(p.q * 10); glanz = f < 2 ? 0.6 : 0; }
    const cx = 62, ox = lean;
    // Der Mann: klein, gebückt, Kutte bis zum Boden
    const my = 96 + fall;
    const kutte = Pg([[cx - 18 + ox, my], [cx + 6 + ox, my - 6], [cx + 16 + ox, my + 6], [cx + 18, 140], [cx + 20, 148], ...saum(cx + 20, cx - 20, 153, 5, 2, 9, hem), [cx - 20, 146], [cx - 22 + ox, my + 22]], null, { rd: 1.5 });
    const kx = cx - 22 + ox * 1.2, ky = my - 8;
    const kapuze = Pg([[kx - 8, ky + 6], [kx - 7, ky - 5], [kx + 3, ky - 9], [kx + 12, ky - 3], [kx + 12, ky + 8], [kx + 2, ky + 10]], null, { rd: 1.5 });
    const gesicht = E(kx - 4, ky + 2, 3.5, 4.5, 'dunkel', { pf: 'flat' });
    // Pilgerstab vorn
    const stx = cx - 36 + ox + stoss;
    const stab = C(stx, 70 + fall, stx + 2, 153, 1.4, 1.4, 'dunkel', { pf: 'flat' });
    const knauf = E(stx, 68 + fall, 2.5, 2.5, null);
    const arm = glied([[cx - 14 + ox, my + 2], [cx - 26 + ox, my + 10], [stx + 1, my + 4]], 3.4, 2.6, null);
    const hand = E(stx + 1, my + 4, 2.8, 2.8, 'haut');
    // Schrein: Kasten mit Giebel, auf dem Rücken, kippt mit
    const s0x = cx + 4 + ox + kipp, s0y = 26 + fall;
    const k = kipp * 0.6;
    const kasten = Pg([[s0x - 22 - k, s0y + 16], [s0x + 22 - k, s0y + 16 + k], [s0x + 24, s0y + 74], [s0x - 20, s0y + 74 - k]], null, { rd: 0.8, pf: 'bevel' });
    const giebel = Pg([[s0x - 26 - k, s0y + 18], [s0x - k * 1.5, s0y - 2], [s0x + 26 - k, s0y + 18 + k]], null, { rd: 0.8, pf: 'bevel' });
    const kreuz = [C(s0x - k * 1.5, s0y - 2, s0x - k * 1.5, s0y - 12, 1, 1, null, { pf: 'flat' }), C(s0x - 4 - k * 1.5, s0y - 8, s0x + 4 - k * 1.5, s0y - 8, 1, 1, null, { pf: 'flat' })];
    const fenster = Pg([[s0x - 13 - k, s0y + 26], [s0x + 13 - k, s0y + 26 + k / 2], [s0x + 14, s0y + 58], [s0x - 12, s0y + 58 - k / 2]], 'dunkel', { pf: 'flat' });
    const riemen = [C(cx + 2 + ox, my - 4, s0x - 10, s0y + 70, 1, 1, 'dunkel', { noRim: true })];
    // Reliquie: eine Hand, Finger nach oben, im Fenster
    const rx = s0x + 1 - k, ry = s0y + 52;
    const reliquie = [Pg([[rx - 6, ry], [rx + 6, ry], [rx + 5, ry - 10], [rx - 5, ry - 10]], null, { rd: 1.5 }),
      ...[-4, -1.5, 1, 3.5].map((dx, i) => C(rx + dx, ry - 10, rx + dx * 1.1, ry - 17 - (i === 1 || i === 2 ? 2 : 0), 1.2, 1, null))];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : [kasten, giebel, ...kreuz], k: 0.5, pf: 'bevel' },
      { p: tot ? [] : [fenster], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : reliquie, k: 1, tone: 0.15 },
      { p: riemen, k: 0, noRim: true },
      { p: [kutte], k: 3 },
      { p: [kapuze], k: 1.5 },
      { p: [gesicht], k: 0, pf: 'flat', noRim: true },
      { p: [stab, knauf], k: 0, pf: 'flat' },
      { p: arm, k: 1 },
      { p: [hand], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Wachstropfen an der Reliquie, Kerzen am Fensterrand
      if (!tot) {
        P.auf(r(rx - 5), r(ry - 2), 'wachs'); P.auf(r(rx + 4), r(ry - 4), 'wachs'); P.auf(r(rx), r(ry - 1), 'wachs');
        [[s0x - 16 - k, s0y + 72], [s0x + 18, s0y + 73]].forEach(([x, y], i) => { P.set(r(x), r(y) - 1, 'wachs'); P.set(r(x), r(y) - 2, 'wachs'); P.set(r(x), r(y) - 3, (flack + i) % 2 ? 'flamme' : 'glut'); });
        // Beschläge an den Ecken
        P.auf(r(s0x - 20 - k), r(s0y + 18), 'wachs'); P.auf(r(s0x + 21 - k), r(s0y + 18 + k), 'wachs');
      }
      // das Auge in der Handfläche
      if (glanz > 0 && !tot) {
        const ex = r(rx), ey = r(ry - 5);
        P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 1, ey, 'glut');
        P.glow(ex + 0.5, ey + 0.5, 7 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey]);
      }
      // unter der Kapuze nur zwei matte Punkte
      if (glanz > 0) { P.set(r(kx - 6), r(ky + 2), 'glutDim'); P.set(r(kx - 3), r(ky + 2), 'glutDim'); }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
