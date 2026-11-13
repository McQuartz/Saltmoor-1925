// Der Obersteiger (Salzstollen, Elite). Er hat die letzte Schicht 1911 eingefahren und nicht
// mehr ausgefahren. Ein breiter, schwerer Mann in der Lederjoppe, den Kopf eingezogen, auf dem
// Schutzhut die Karbidlampe; die Lampe ist das eine Auge, das ihm geblieben ist. Seine rechte
// Seite ist ins Salz gewachsen, Kruste bis über die Schulter. In der vorderen Hand das Grubenbeil,
// in der hinteren der Kanarienkäfig; was darin sitzt, hat zu viele Augen und singt nicht mehr.
// Angriff: das Beil fährt herunter und schlägt den Verbau weg.
'use strict';
module.exports = {
  id: 'obersteiger', biom: 'salz', zone: 'salz', w: 128, h: 160, fuss: [64, 155], kopf: [56, 44], rimBis: 152, rang: 'elite',
  varianten: { obersteiger: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, beil = 0, bt = 0.15, fall = 0, glanz = 1, atem = 0, schaukel = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; schaukel = [0, 1, 0, -1][f]; glanz = [1, 1, 0.9, 1.1][f]; }
    if (p.angriff) { lean = [2, 4, -8, -3][f]; beil = [10, 18, -14, -6][f]; bt = [1.6, 2.5, 0.9, 0.4][f]; glanz = [1, 1.3, 1.7, 1.1][f]; schaukel = [1, 2, -2, 0][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; schaukel = 2; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, sy = 62 + fall;
    // Joppe: breit, Schultern hoch, der Kopf eingezogen
    const leib = Pg([[cx - 22 + ox, sy + 6], [cx - 10 + ox, sy - 4], [cx + 14 + ox, sy - 6], [cx + 26 + ox, sy + 4], [cx + 24 + r(ox / 2), sy + 40], [cx + 18, sy + 56], [cx - 16, sy + 56], [cx - 22 + r(ox / 2), sy + 38]], null, { rd: 2 });
    const kruste = Pg([[cx + 6 + ox, sy - 6], [cx + 20 + ox, sy - 12], [cx + 30 + ox, sy - 2], [cx + 28 + ox, sy + 20], [cx + 26, sy + 46], [cx + 16, sy + 30]], null, { rd: 1, pf: 'bevel', tone: 0.18 });
    const beine = [C(cx - 10, sy + 54, cx - 12, 150, 6, 5, 'dunkel'), C(cx + 10, sy + 54, cx + 12, 150, 6, 5, 'dunkel')];
    const stiefel = [E(cx - 15, 152, 8, 3.5, 'dunkel'), E(cx + 12, 152, 7, 3.5, 'dunkel')];
    // Kopf: tief zwischen den Schultern, Hut mit Krempe, Lampe vorn
    const kx = cx - 6 + ox * 1.2, ky = sy - 4 + atem;
    const kopf = E(kx, ky, 9, 8, null);
    const hut = Pg([[kx - 10, ky - 4], [kx - 8, ky - 12], [kx + 6, ky - 14], [kx + 11, ky - 6], [kx + 13, ky - 3], [kx - 13, ky - 2]], null, { rd: 1, pf: 'bevel' });
    const lampe = Pg([[kx - 12, ky - 12], [kx - 7, ky - 12], [kx - 7, ky - 7], [kx - 12, ky - 7]], null, { rd: 0.6, pf: 'flat' });
    // Grubenbeil in der vorderen Hand
    const hx = cx - 26 + ox + r(beil * 0.3), hy = sy + 26 - r(beil * 1.2);
    const armV = glied([[cx - 18 + ox, sy + 6], [cx - 28 + ox, sy + 18], [hx, hy]], 5, 4, null);
    const faust = E(hx, hy, 4.5, 4.5, 'haut');
    const stiel = C(hx, hy, hx - 4 - 30 * Math.sin(bt), hy + 30 * Math.cos(bt) - 2, 1.6, 1.6, 'dunkel', { pf: 'flat' });
    const ex0 = hx - 4 - 30 * Math.sin(bt), ey0 = hy + 30 * Math.cos(bt) - 2;
    const blatt = Pg([[ex0 - 3, ey0 - 6], [ex0 + 3, ey0 - 6], [ex0 + 4, ey0 + 4], [ex0 - 10, ey0 + 8], [ex0 - 8, ey0]], null, { rd: 0.6, pf: 'bevel' });
    // Kanarienkäfig in der hinteren Hand
    const qx = cx + 34 + ox + schaukel, qy = sy + 46;
    const armH = glied([[cx + 22 + ox, sy + 6], [cx + 30 + ox, sy + 22], [qx - 1, qy - 16]], 5, 4, null);
    const buegel = C(qx - 1, qy - 16, qx, qy - 10, 0.6, 0.6, 'dunkel', { noRim: true });
    const kaefig = Pg([[qx - 6, qy - 10], [qx + 6, qy - 10], [qx + 7, qy + 6], [qx - 7, qy + 6]], 'dunkel', { rd: 2, pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: tot ? [] : [buegel], k: 0, noRim: true },
      { p: tot ? [] : [kaefig], k: 0, pf: 'flat' },
      { p: beine, k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [kruste], k: 1, pf: 'bevel' },
      { p: [kopf, hut], k: 1.5 },
      { p: [lampe], k: 0, pf: 'flat' },
      { p: tot ? [] : [stiel, blatt], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [faust], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Salzkruste: Würfelkanten, hell gesprenkelt
      for (let y = sy - 10; y < sy + 46; y += 3) for (let x = cx + 8; x < cx + 32; x += 3) if (((x * 7 + y * 3) % 5) === 0) P.auf(r(x + ox), r(y), 'r1');
      // Joppe: Gürtel, Arschleder
      P.line(r(cx - 20 + ox / 2), r(sy + 38), r(cx + 22 + ox / 2), r(sy + 38), 'k0', true);
      // Käfig: Stäbe, darin der Vogel mit drei Augen
      if (!tot) {
        for (let x = -5; x <= 5; x += 2) P.line(r(qx + x), r(qy - 9), r(qx + x), r(qy + 5), 'k2', true);
        if (glanz > 0) { P.set(r(qx - 2), r(qy - 2), 'glut'); P.set(r(qx + 1), r(qy - 3), 'glut'); P.set(r(qx), r(qy), 'glut'); }
      }
      // die Lampe ist das Auge
      if (glanz > 0) {
        const lx = r(kx - 10), ly = r(ky - 10);
        P.set(lx, ly, 'kern'); P.set(lx + 1, ly, 'kern'); P.set(lx, ly + 1, 'glut'); P.set(lx + 1, ly + 1, 'glut');
        P.glow(lx + 1, ly + 1, 9 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        augen.push([lx, ly]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
