// Der Stehgeiger (Nachtzug, Elite). Er spielt im Speisewagen, seit der Zug fährt, und er spielt
// immer das, was eben gesprochen wurde, nur einen Takt später. Frack mit langen Schößen, schmale
// Schultern, der Kopf liegt auf der Geige wie auf einem Kissen, die Augen geschlossen und doch
// hell. Der Bogen ist so lang wie er selbst, und die Haare des Bogens leuchten, wo sie die Saiten
// berühren. Angriff: ein langer Strich nach vorn.
'use strict';
module.exports = {
  id: 'geiger', biom: 'nachtzug', zone: 'nachtzug', w: 128, h: 160, fuss: [70, 155], kopf: [62, 30], rimBis: 152, rang: 'elite',
  varianten: { geiger: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, strich = 0, glanz = 1, fall = 0, wieg = 0;
    if (p.idle) { strich = [-0.15, 0, 0.15, 0][f]; wieg = [0, 0.5, 1, 0.5][f]; }
    if (p.angriff) { lean = [3, 4, -6, -2][f]; strich = [0.4, 0.6, -0.9, -0.4][f]; glanz = [1, 1.2, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; strich = 0.3; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; strich = p.q * 0.5; }
    const cx = 72, ox = lean, sy = 58 + fall;
    // Frack: kurz vorn, lange Schöße hinten (rechts)
    const frack = Pg([[cx - 12 + ox, sy], [cx + 12 + ox, sy - 1], [cx + 14 + ox, sy + 30], [cx + 20, sy + 64], [cx + 13, sy + 70], [cx + 6, sy + 40], [cx - 10, sy + 38], [cx - 14 + ox, sy + 20]], null, { rd: 1.2 });
    const hemd = Pg([[cx - 5 + ox, sy + 2], [cx + 2 + ox, sy + 2], [cx + 1 + ox, sy + 28], [cx - 6 + ox, sy + 28]], 'haut', { rd: 0.5, pf: 'flat' });
    const beine = [C(cx - 5, sy + 36, cx - 7, 150, 3.2, 2.6, 'dunkel'), C(cx + 5, sy + 36, cx + 6, 150, 3.2, 2.6, 'dunkel'), E(cx - 11, 152, 5, 1.8, null), E(cx + 3, 152, 5, 1.8, null)];
    // Geige auf der linken Schulter (im Bild links), Kopf darauf geneigt
    const gx = cx - 14 + ox, gy = sy - 2;
    const geige = Pg([[gx + 10, gy - 4], [gx - 6, gy + 2], [gx - 14, gy + 6], [gx - 18, gy + 3], [gx - 16, gy - 3], [gx - 8, gy - 6], [gx + 2, gy - 9]], null, { rd: 2 });
    const hals = C(gx - 16, gy + 1, gx - 32, gy + 9, 1.4, 1.1, 'dunkel', { pf: 'flat' });
    const schnecke = E(gx - 33, gy + 9, 2.2, 2.2, 'dunkel');
    const kx = cx - 6 + ox, ky = sy - 14 + wieg * 0.5;
    const kopf = E(kx, ky, 7, 7.5, 'haut');
    const haar = Pg([[kx - 6, ky - 4], [kx + 2, ky - 9], [kx + 9, ky - 5], [kx + 8, ky + 3], [kx + 3, ky - 2]], 'dunkel', { rd: 1 });
    // Griffarm (links, hält den Hals), Bogenarm (rechts, Bogen lang)
    const armL = glied([[cx - 10 + ox, sy + 3], [cx - 22 + ox, sy + 10], [gx - 26, gy + 9]], 2.6, 2, null);
    const bh = [cx + 4 + ox + strich * 14, sy + 16 - strich * 4];
    const armR = glied([[cx + 10 + ox, sy + 2], [cx + 14 + ox, sy + 14], bh], 2.6, 2, null);
    const ba = Math.PI + 0.32 - strich * 0.3;
    const b2 = [bh[0] + Math.cos(ba) * 64, bh[1] + Math.sin(ba) * 64];
    const bogen = C(bh[0] + 4, bh[1] + 1, b2[0], b2[1], 0.8, 0.7, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 0.5 },
      { p: [frack], k: 2 },
      { p: [hemd], k: 0, pf: 'flat' },
      { p: armR, k: 1 },
      { p: tot ? [] : [geige, hals, schnecke], k: 1 },
      { p: [kopf, haar], k: 1 },
      { p: armL, k: 1 },
      { p: tot ? [] : [bogen], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Fliege und Hemdknöpfe
      P.auf(r(cx - 3 + ox), r(sy + 3), 'k0'); P.auf(r(cx - 2 + ox), r(sy + 3), 'k0');
      for (let i = 0; i < 3; i++) P.auf(r(cx - 2 + ox), r(sy + 9 + i * 6), 'k2');
      // Geige: Messingwirbel, Saiten als Lichtlinie wo der Bogen streicht
      if (!tot) {
        P.auf(r(gx - 33), r(gy + 8), 'messing'); P.auf(r(gx - 31), r(gy + 7), 'messing');
        P.line(r(gx - 30), r(gy + 8), r(gx - 4), r(gy - 2), 'k3', true);
        // Bogenhaare leuchten an der Saite
        const sx = r(gx - 10), sy2 = r(gy + 1);
        P.set(sx, sy2, glanz > 1.3 ? 'kern' : 'glut'); P.set(sx - 1, sy2 + 1, 'glut'); P.set(sx + 1, sy2 - 1, 'glutDim');
        P.glow(sx + 0.5, sy2 + 0.5, 6 * glanz, 0.6 * glanz, 'glutDim', 'k3');
        // Töne: kleine helle Punkte, die vom Bogen nach vorn wandern
        if (p.angriff && f >= 2) for (let k = 0; k < 6; k++) P.set(r(sx - 6 - k * 5), r(sy2 + Math.sin(k * 1.4) * 3), k < 3 ? 'glut' : 'glutDim');
        if (p.idle) P.set(r(sx - 8 - f * 3), r(sy2 - 3 - f), 'glutDim');
      }
      // Augen: geschlossen und doch hell, zwei Bögen
      if (!(p.tod && f >= 1)) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex - 1, ey - 1, 'glut'); P.set(ex + 4, ey, 'kern'); P.set(ex + 3, ey - 1, 'glut');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
