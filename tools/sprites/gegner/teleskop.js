// Mond unter dem Eis, dritter Wächter: Das Teleskop. Der Refraktor der Sternwarte, mit dem der Gehilfe
// 1890 den kleinen Mond zum ersten Mal sah. Es hat ihn nicht mehr aus den Augen gelassen und ist ihm
// gefolgt, auf seinem Stativ wie auf drei Beinen. Im Okular sitzt das Auge des Gehilfen. Wer vor ihm
// steht, wird gemessen, und jede Bewegung kostet mehr. Angriff: das Rohr schwenkt und schlägt.
'use strict';
module.exports = {
  id: 'teleskop', biom: 'mond', zone: 'mond', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [120, 90], rimBis: 172,
  varianten: { teleskop: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let a = -0.55, fall = 0, glanz = 1;
    if (p.idle) { a = [-0.55, -0.54, -0.55, -0.56][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [-0.75, -0.9, -0.1, -0.35][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { a = [-0.6, -0.57][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); a = -0.55 + p.q * 0.4; glanz = f < 2 ? 0.6 : 0; }
    const mx = 92, my = 92 + fall;
    const beine = [[-46, 174], [44, 174], [8, 176]].map(([dx, y]) => glied([[mx, my + 6], [mx + dx * 0.6, my + 40], [mx + dx, y]], 3, 2.4, 'dunkel'));
    const montierung = Pg([[mx - 10, my - 4], [mx + 10, my - 4], [mx + 12, my + 10], [mx - 12, my + 10]], 'dunkel', { rd: 1, pf: 'bevel' });
    const gegengewicht = E(mx + 18, my + 14, 6, 6, 'dunkel', { pf: 'dome' });
    // Rohr: lang, vorn das Objektiv links oben, hinten das Okular rechts unten
    const L = 120, ca = Math.cos(a), sa = Math.sin(a);
    const vx = mx - ca * L * 0.62, vy = my + sa * L * 0.62, hx = mx + ca * L * 0.38, hy = my - sa * L * 0.38;
    const rohr = C(hx, hy, vx, vy, 7, 9, null, { pf: 'bevel' });
    const tau = C(vx + ca * 4, vy - sa * 4, vx - ca * 8, vy + sa * 8, 11, 11, null, { pf: 'bevel' });
    const okular = C(hx, hy, hx + ca * 10 + 2, hy - sa * 10 + 6, 3, 3, 'dunkel', { pf: 'flat' });
    const sucher = C(mx - ca * 30, my + sa * 30 - 10, mx + ca * 6, my - sa * 6 - 10, 2, 2, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [beine[2]].flat(), k: 0 },
      { p: [gegengewicht], k: 0, pf: 'dome' },
      { p: [montierung], k: 1, pf: 'bevel' },
      { p: tot ? [] : [sucher], k: 0, pf: 'flat' },
      { p: [rohr], k: 3, pf: 'bevel' },
      { p: [tau], k: 2, pf: 'bevel' },
      { p: [okular], k: 0, pf: 'flat' },
      { p: [beine[0], beine[1]].flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Messingringe am Rohr, Linse vorn, Mondstaub am Boden
      for (let t = 0.15; t < 0.95; t += 0.2) { const x = hx + (vx - hx) * t, y = hy + (vy - hy) * t; P.line(r(x - sa * 7), r(y - ca * 7), r(x + sa * 7), r(y + ca * 7), 'messing'); }
      P.set(r(vx - ca * 8), r(vy + sa * 8), 'bleich');
      for (let x = 6; x < 156; x += 5) P.set(x, 176 - (x % 2), 'asche');
      if (glanz > 0) {
        // das Auge im Okular
        const ex = r(hx + ca * 10 + 2), ey = r(hy - sa * 10 + 6);
        P.set(ex, ey, 'kern'); P.set(ex, ey - 1, 'glut');
        P.glow(ex, ey, 7 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        P.glow(vx - ca * 6, vy + sa * 6, 6 * glanz, 0.4 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
