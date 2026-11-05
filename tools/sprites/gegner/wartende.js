// Die Station, die nie eröffnet wurde: Die Wartende. Eine Frau im Sonntagsmantel von 1925, mit Glockenhut
// und Schleier, die am Tag der Eröffnung jemanden abholen wollte. Bei jedem Zug, der einfährt, hat sie den
// Hals gereckt, um in den Tunnel zu sehen, und der Hals ist dabei lang geworden, so lang wie ihr Arm, und
// dann länger. Ihr Kopf hängt weit vor ihr in der Luft. Den Strauß hält sie noch; die Blumen sind trocken
// und hängen mit den Köpfen nach unten. Hinter dem Schleier sieht man nicht, was sie vorhat.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'wartende', biom: 'station', zone: 'station', w: 96, h: 120, fuss: [52, 115], kopf: [18, 14], rimBis: 113,
  varianten: {
    // a: Strauß vor dem Leib, der Hals in einem S nach vorn, der Kopf leicht gesenkt
    wartende_a: { schirm: false, hoch: false },
    // b: der Schirm als Stock, die Tasche am Arm; der Hals steigt erst hoch und hängt dann wie ein Fragezeichen
    wartende_b: { schirm: true, hoch: true },
  },
  // Silhouetten-Probe (nicht gebaut): normaler Hals, nur der Kopf nach vorn gestreckt (las sich als gewöhnliche
  // Frau mit Hut, das Falsche verschwand). Genommen: der lange Hals, der Kopf weit vor dem Körper.
  proben: { probe_kurz: { schirm: false, hoch: false, kurz: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, fall = 0, hx = 0, hy = 0, sink = 0;
    // hx/hy: Versatz des Kopfes gegenüber der Ruhelage (Hals folgt)
    if (p.idle) { hx = [0, -1, -1, 0][f]; hy = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [1, 2, -3, -1][f]; hx = [4, 9, -9, -4][f]; hy = [-4, -8, 18, 8][f]; }
    if (p.treffer) { lean = [2, 1][f]; hx = [6, 4][f]; hy = [-5, -3][f]; }
    if (p.tod) { fall = r(p.q * 10); hx = r(p.q * 4); hy = r(p.q * 60); sink = r(p.q * 8); }
    const L = lean, T = fall;
    // Mantel: Schultern, gerade fallend, unten etwas weiter; Saum in der Wade
    const sx = 54 + L, sy = 46 + T;
    const mantel = Pg([[sx - 5, sy - 1], [sx + 5, sy - 1], [sx + 10, sy + 5], [sx + 11, sy + 24], [sx + 17, sy + 52], [sx + 16, sy + 56], [sx - 17, sy + 56], [sx - 16, sy + 50], [sx - 10, sy + 24], [sx - 10, sy + 5]], null, { rd: 1.6 });
    const pelz = [E(sx - 7, sy + 2, 5, 4, null), E(sx, sy, 6, 4, null), E(sx + 7, sy + 2, 5, 4, null)];
    const beine = [C(sx - 5, sy + 52, sx - 6, 111, 2.2, 1.8, null), C(sx + 4, sy + 52, sx + 5, 111, 2.2, 1.8, null)];
    const schuhe = [E(sx - 8, 113, 3.4, 1.8, 'dunkel'), E(sx + 3, 113, 3.4, 1.8, 'dunkel')];
    // Kopf und Hals: Ruhelage weit links vor dem Körper
    const kurz = !!v.kurz;
    const KX0 = kurz ? sx - 10 : v.hoch ? 22 : 16, KY0 = kurz ? sy - 12 : v.hoch ? 26 : 22;
    const kx = KX0 + hx, ky = Math.min(KY0 + hy + sink, 108), basis = [sx - 1, sy - 2];
    const c1 = v.hoch ? [basis[0] + 1, basis[1] - 30] : [basis[0] + 2, basis[1] - 18];
    const c2 = v.hoch ? [kx + 16, ky - 20] : [kx + 16, ky - 4];
    const bez = q => { const u = 1 - q; return [u * u * u * basis[0] + 3 * u * u * q * c1[0] + 3 * u * q * q * c2[0] + q * q * q * kx, u * u * u * basis[1] + 3 * u * u * q * c1[1] + 3 * u * q * q * c2[1] + q * q * q * ky]; };
    const halsPts = []; for (let i = 0; i <= 10; i++) halsPts.push(bez(i / 10));
    const hals = kurz ? [C(basis[0], basis[1], kx + 3, ky + 3, 3, 2.6, 'haut')] : glied(halsPts, 3.2, 2.2, 'haut');
    const kopf = [E(kx, ky + 1, 5.2, 6, 'haut', { pf: 'bevel' }), E(kx - 2, ky + 5, 3, 2.6, 'haut')];
    // Glockenhut, tief in die Stirn, mit schmaler Krempe; Schleier fällt bis unters Kinn
    const hut = [E(kx + 1, ky - 3, 7, 5, null), Pg([[kx - 9, ky - 1], [kx + 10, ky - 2], [kx + 10, ky], [kx - 9, ky + 2]], null, { rd: 0.6 })];
    const schleier = [Pg([[kx - 8, ky], [kx + 3, ky], [kx + 2, ky + 9], [kx - 7, ky + 8]], null, { rd: 0.4 })];
    // Arme: beide Hände vor dem Leib am Strauß (a) bzw. rechte am Schirm (b)
    const schV = [sx - 8, sy + 3], schH = [sx + 8, sy + 3];
    const hV = [sx - 8, sy + 26], eV = [sx - 13, sy + 16];
    const hH = v.schirm ? [sx + 13, sy + 30] : [sx - 4, sy + 27], eH = v.schirm ? [sx + 13, sy + 17] : [sx + 9, sy + 18];
    const armV = [...glied([schV, eV, hV], 3, 2.4, null), E(hV[0], hV[1], 2.2, 2, 'haut')];
    const armH = [...glied([schH, eH, hH], 3, 2.4, null), E(hH[0], hH[1], 2.2, 2, 'haut')];
    // Strauß: Stiele gebündelt, die Köpfe hängen nach unten über die Hände
    const strauss = [];
    if (!v.schirm) {
      // Tüte aus Papier, Spitze nach unten, unter den Händen; oben hängen die trockenen Köpfe über den Rand
      const bx = hV[0] + 1, by = hV[1] - 2;
      strauss.push(Pg([[bx - 8, by - 1], [bx + 7, by - 3], [bx + 1, by + 18], [bx - 1, by + 18]], null, { rd: 0.8 }));
      for (let i = 0; i < 5; i++) { const tx = bx - 6 + i * 3, ty = by - 4 - (i % 2) * 2; strauss.push(C(tx, by - 1, tx - 1, ty - 1, 0.7, 0.6, null), C(tx - 1, ty - 1, tx - 4 + i * 0.4, ty + 3, 0.6, 0.6, null), E(tx - 4 + i * 0.4, ty + 5, 2.3, 2.4, null)); }
    }
    const tasche = v.schirm ? [Pg([[sx - 12, sy + 26], [sx - 4, sy + 26], [sx - 3, sy + 34], [sx - 13, sy + 34]], null, { rd: 1 }), C(sx - 11, sy + 26, sx - 8, sy + 21, 0.6, 0.6, null)] : [];
    const schirm = v.schirm ? [C(hH[0] + 1, hH[1] - 4, hH[0] + 3, 113, 1, 0.9, null), C(hH[0] + 1, hH[1] - 4, hH[0] - 3, hH[1] - 6, 0.9, 0.9, null), Pg([[hH[0] + 1, hH[1] + 6], [hH[0] + 4, hH[1] + 6], [hH[0] + 4.5, hH[1] + 28], [hH[0] + 2.5, hH[1] + 34], [hH[0] + 1, hH[1] + 28]], null, { rd: 0.6 })] : [];
    const gruppen = [
      { p: beine, k: 0.5, kante: true },                                   // 0
      { p: schuhe, k: 0.5, kante: true },                                  // 1
      { p: armH, k: 1, kante: true, anker: [L, T] },                       // 2 hinterer Arm
      { p: schirm, k: 0.3, kante: true },                                  // 3 Schirm
      { p: [mantel], k: 1.5, kante: true, anker: [L, T], tone: 0.05 },     // 4 Mantel
      { p: pelz, k: 1.5, kante: true, tone: 0.2 },                         // 5 Pelzkragen
      { p: hals, k: 1, kante: true },                                      // 6 Hals
      { p: kopf, k: 1, kante: true },                                      // 7 Kopf
      { p: hut, k: 0.6, kante: true },                                     // 8 Hut
      { p: tasche, k: 0.5, kante: true },                                  // 9 Tasche
      { p: armV, k: 1, kante: true, anker: [L, T] },                       // 10 vorderer Arm
      { p: strauss, k: 0.3, kante: true },                                 // 11 Strauß
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('station'), { rimBis: 113 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      H0.kapselLicht(P, hals.filter(k => k.t === 'c'), 'r1');
      H0.kapselLicht(P, schirm.filter(k => k.t === 'c'), 'r1');
      const X = r(sx), Y = r(sy);
      // Hals: Ringe wie bei einem Rohr, das man ausgezogen hat
      if (!kurz) for (let i = 2; i < 10; i += 2) { const [x, y] = halsPts[i], [x2, y2] = halsPts[i + 1]; const dx = x2 - x, dy = y2 - y, l = Math.hypot(dx, dy) || 1; const nx = -dy / l, ny = dx / l; for (let k = -2; k <= 2; k++) P.auf(r(x + nx * k), r(y + ny * k), k === -2 ? 'k3' : 'k0'); }
      // Mantel: Gürtel tief auf der Hüfte mit Schnalle, Falten darunter mit Lichtgrat, Knöpfe, Saumband
      for (let x = X - 12; x <= X + 12; x++) { P.auf(x, Y + 26, 'k0'); P.auf(x, Y + 25, x % 2 ? 'k3' : 'k2'); }
      P.auf(X + 1, Y + 25, 'messing'); P.auf(X + 2, Y + 25, 'messing'); P.auf(X + 1, Y + 26, 'k3');
      for (const [x0, x1] of [[X - 7, X - 9], [X - 2, X - 3], [X + 3, X + 4], [X + 8, X + 11]]) { P.line(x0, Y + 28, x1, Y + 54, 'k0', true); P.line(x0 + 1, Y + 28, x1 + 1, Y + 54, 'k3', true); P.line(x0 + 2, Y + 30, x1 + 2, Y + 52, 'k2', true); }
      for (let x = X - 14; x <= X + 14; x++) { P.auf(x, Y + 52, x % 2 ? 'r1' : 'k3'); P.auf(x, Y + 53, 'k0'); }
      for (let i = 0; i < 3; i++) { P.auf(X + 2, Y + 7 + i * 6, 'k3'); P.auf(X + 3, Y + 7 + i * 6, 'k0'); }
      P.line(X + 1, Y + 3, X + 1, Y + 24, 'k0', true);
      // Pelz: Büschel mit hellen Spitzen
      for (let i = 0; i < 12; i++) { const xx = X - 12 + i * 2; const yy = Y - 1 + Math.abs(i - 6) * 0.4 + ((i * 3) % 2); P.auf(xx, r(yy), i % 3 ? 'k3' : 'r1'); P.auf(xx + 1, r(yy) + 3, 'k0'); }
      // Medaillon an der Kette: das innere Licht, ein Bild von jemandem, der nicht kommt
      if (!aus) { P.glow(X - 1.5, Y + 11, 7, 0.75); P.set(X - 2, Y + 11, 'glut'); P.set(X - 1, Y + 11, 'messing'); P.set(X - 2, Y + 12, 'messing'); }
      P.line(X - 6, Y + 2, X - 2, Y + 10, 'messing', true);
      // Hut: Band, eine Feder, Lichtkante an der Krempe
      const KX = r(kx), KY = r(ky);
      for (let x = KX - 5; x <= KX + 6; x++) P.auf(x, KY - 2, 'k0');
      P.auf(KX + 4, KY - 3, 'email'); P.auf(KX + 5, KY - 3, 'email'); P.auf(KX + 5, KY - 4, 'k3');
      // Schleier: feines Netz über dem Gesicht, dahinter die Augen
      for (let y = KY + 1; y <= KY + 8; y += 2) for (let x = KX - 7; x <= KX + 2; x += 2) { const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, c >= 3 ? 'k1' : 'k3'); else if (!c && x < KX - 4 && y > KY + 2) P.set(x, y, 'k2'); }
      P.auf(KX + 2, KY + 4, 'k3'); P.auf(KX + 3, KY + 3, 'r1'); P.auf(KX - 5, KY + 6, 'k3');
      if (!aus) { P.set(KX - 3, KY + 2, 'kern'); P.set(KX - 4, KY + 2, 'glut'); P.set(KX, KY + 2, 'kern'); P.set(KX + 1, KY + 2, 'glut'); P.glow(KX - 1.5, KY + 2.5, 6, 0.7); P.set(KX - 3, KY + 2, 'kern'); P.set(KX, KY + 2, 'kern'); augen.push([KX - 3, KY + 2], [KX, KY + 2]); }
      // Strauß: trockene Köpfe, einer hat noch Farbe
      if (strauss.length) { const bx = r(hV[0]) + 1, by = r(hV[1]) - 2; for (let y = by; y < by + 15; y++) { P.auf(bx + 3 - r((y - by) * 0.3), y, 'blass'); if (y % 3 === 0) P.auf(bx - 2, y, 'k3'); } P.line(bx - 7, by, bx + 6, by - 2, 'k3', true); for (let i = 0; i < 5; i++) { const fx = r(bx - 10 + i * 3.4), fy = r(by + 1 - (i % 2) * 2); P.auf(fx, fy, i === 2 ? 'email' : 'r1'); P.auf(fx + 1, fy - 1, 'k3'); P.auf(fx, fy + 1, 'k0'); } }
      // Tasche: Bügel in Messing
      if (tasche.length) { P.line(X - 12, Y + 27, X - 4, Y + 27, 'messing', true); P.auf(X - 8, Y + 30, 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
