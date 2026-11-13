// Der Messdiener (überflutete Kapelle). Er schwenkt das Weihrauchfass seit 1634, und der Rauch ist
// nie abgezogen. Ein Junge im Rochett, viel zu lang geworden, die Arme so dünn wie die Kette. Das
// Fass schwingt vor ihm hin und her, und der Rauch hängt um ihn, sodass man nicht sieht, was er als
// Nächstes tut. Sein Gesicht ist im Rauch, nur die Augen glimmen. Angriff: das Fass schlägt zu.
'use strict';
module.exports = {
  id: 'messdiener', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [48, 115], kopf: [46, 16], rimBis: 112,
  varianten: {
    messdiener_a: { lang: 1, kragen: 0 },
    messdiener_b: { lang: 1.1, kragen: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, pendel = 0, fall = 0, glanz = 1, rauch = 0;
    if (p.idle) { pendel = [-0.15, -0.05, 0.05, 0.15][f]; rauch = f; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; pendel = [0.5, 0.9, -0.9, -0.3][f]; rauch = f; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52, ox = lean, L = v.lang, sy = 28 + fall;
    // Rochett: weiß gedacht, hier hellere Fläche (tone), darunter die Soutane
    const soutane = Pg([[cx - 9 + ox, sy + 30], [cx + 9 + ox, sy + 30], [cx + 12, 106], ...saum(cx + 12, cx - 12, 112, 4, 2, 2), [cx - 12, 106]], null, { rd: 1.2 });
    const rochett = Pg([[cx - 8 + ox, sy], [cx + 8 + ox, sy - 1], [cx + 16 + ox, sy + 46 * L], ...saum(cx + 16 + ox, cx - 16 + ox, sy + 50 * L, 6, 3, 4), [cx - 16 + ox, sy + 46 * L]], null, { rd: 1.2, tone: 0.2 });
    const kragen = v.kragen ? [Pg([[cx - 9 + ox, sy - 2], [cx + 9 + ox, sy - 3], [cx + 7 + ox, sy + 4], [cx - 7 + ox, sy + 5]], 'dunkel', { pf: 'flat' })] : [];
    const kx = cx - 2 + ox * 1.2, ky = sy - 10;
    const kopf = E(kx, ky, 6, 7.5, null);
    // Arm mit Kette, das Fass pendelt
    const hx = cx - 14 + ox, hy = sy + 12;
    const armV = glied([[cx - 6 + ox, sy + 3], [cx - 12 + ox, sy + 8], [hx, hy]], 2, 1.5, null);
    const kl = 30, fx = hx + Math.sin(pendel) * kl - 4, fy = hy + Math.cos(pendel) * kl;
    const kette = C(hx, hy, fx, fy - 5, 0.5, 0.5, 'dunkel', { noRim: true });
    const fass = Pg([[fx - 5, fy - 5], [fx + 5, fy - 5], [fx + 6, fy + 2], [fx, fy + 7], [fx - 6, fy + 2]], null, { rd: 1, pf: 'bevel' });
    const deckel = Pg([[fx - 3, fy - 5], [fx + 3, fy - 5], [fx, fy - 10]], null, { pf: 'bevel' });
    const armH = glied([[cx + 6 + ox, sy + 3], [cx + 12 + ox, sy + 16], [cx + 10 + ox, sy + 26]], 2, 1.5, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [soutane], k: 2 },
      { p: [rochett], k: 2 },
      { p: kragen, k: 0, pf: 'flat' },
      { p: [kopf], k: 1 },
      { p: armV, k: 1 },
      { p: [kette], k: 0, noRim: true },
      { p: tot ? [] : [fass, deckel], k: 0.5, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Glut im Fass, Rauch steigt in Stufen und legt sich ums Gesicht
      if (!tot) { P.set(r(fx - 2), r(fy), 'flamme'); P.set(r(fx + 1), r(fy + 1), 'glutDim'); P.set(r(fx), r(fy - 1), 'glut'); }
      const pts = [[fx, fy - 12], [fx + 2, fy - 18], [kx - 6, ky + 8], [kx - 8, ky + 3], [kx - 4, ky - 2], [kx + 5, ky + 5]];
      pts.forEach(([x, y], i) => { const xx = r(x + Math.sin(i + rauch) * 1.5), yy = r(y - (rauch % 2)); P.set(xx, yy, 'r1'); if (i % 2) P.set(xx + 1, yy, 'k3'); });
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
