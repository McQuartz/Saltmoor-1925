// Nachtzug: Der Mitreisende. Ein Herr mit Melone sitzt auf seinem Koffer und liest Zeitung.
// Falsch: Seine Beine sind viel zu lang. Er hat sie zusammengelegt wie einen Zollstock, die Knie
// stehen höher als sein Hut. Über dem Zeitungsrand zwei Augen, die nicht blinzeln.
// Im Angriff klappt er sich auf und ist viel zu groß.
'use strict';
const lerp = (a, b, t) => a + (b - a) * t;
// Knie aus Hüfte, Fuß und zwei Längen; Knie liegt links oben (Beine knicken nach vorn zum Spieler)
function knie(h, f, a, b) {
  const dx = f[0] - h[0], dy = f[1] - h[1], d = Math.min(Math.hypot(dx, dy), a + b - 0.5);
  const x = (a * a - b * b + d * d) / (2 * d), y = Math.sqrt(Math.max(0, a * a - x * x));
  const ux = dx / d, uy = dy / d; // Senkrechte nach links-oben wählen
  const k1 = [h[0] + ux * x + uy * y, h[1] + uy * x - ux * y], k2 = [h[0] + ux * x - uy * y, h[1] + uy * x + ux * y];
  return k1[0] < k2[0] ? k1 : k2;
}
module.exports = {
  id: 'mitreisender', biom: 'nachtzug', zone: 'nachtzug', w: 96, h: 120, fuss: [52, 116], kopf: [46, 10], rimBis: 113,
  varianten: {
    mitreisender_a: { hut: 'melone', schenkel: 78, schienbein: 88, zeitung: [28, 58], fussX: [18, 32] },
    mitreisender_b: { hut: 'zylinder', schenkel: 84, schienbein: 92, zeitung: [30, 57], fussX: [16, 30], schirm: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    // u: 0 = sitzt gefaltet, 1 = aufgeklappt; zl: Zeitung sinkt (0 oben, 1 weg); lean nach links beim Zuschlagen
    let u = 0, zl = 0, lean = 0, atem = 0, blatt = 0, augenAn = true, arm = 0, fall = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; blatt = [0, 1, 0, 0][f]; }
    // Angriff: das nahe Bein klappt auf wie ein Zollstock und tritt weit nach links
    let tritt = null;
    if (p.angriff) { u = [0.04, 0.12, 0.2, 0.1][f]; zl = [0.15, 0.7, 1, 1][f]; lean = [1, -1, -5, -2][f]; arm = [0, 0.3, 0.9, 0.3][f];
      tritt = [[[38, 4], [24, 112]], [[40, 2], [36, 50]], [[30, 60], [2, 60]], [[26, 24], [12, 96]]][f]; }
    if (p.treffer) { u = [0.05, 0][f]; lean = [2, 1][f]; zl = [0.15, 0.05][f]; }
    if (p.tod) { fall = r(p.q * 10); augenAn = f < 1; zl = Math.min(1, p.q * 1.6); }
    const fy = 114;
    const H0 = [66, 98], H1 = [60, 44];
    const hip = [r(lerp(H0[0], H1[0], u) + lean * 0.4), r(lerp(H0[1], H1[1], u) + fall)];
    const F1 = [v.fussX[0] + r(u * 8), fy], F2 = [v.fussX[1] + r(u * 12), fy];
    let K1 = knie(hip, F1, v.schenkel, v.schienbein), K2 = knie([hip[0] - 3, hip[1]], F2, v.schenkel - 3, v.schienbein - 2);
    if (p.tod) { K1[1] += fall * 2; K2[1] += fall * 2.4; }
    if (tritt) { K1 = tritt[0]; F1[0] = tritt[1][0]; F1[1] = tritt[1][1]; }
    // Rumpf: Mantel von der Sitzfläche zu den Schultern, leicht vorgebeugt
    const sh = [hip[0] - 6 + lean, hip[1] - 34 + (p.tod ? fall : 0)];
    const rumpf = Pg([[hip[0] - 10, hip[1] + 2], [hip[0] + 10, hip[1] + 2], [sh[0] + 10, sh[1] + 4], [sh[0] + 6, sh[1] - 1], [sh[0] - 7, sh[1] - 1], [sh[0] - 9, sh[1] + 6]], null, { rd: 2 });
    const kragen = E(sh[0], sh[1] + 1, 9, 3.5, null);
    const kx = sh[0] - 2, ky = sh[1] - 8 + atem;
    const kopf = E(kx, ky, 6, 7, 'haut', { pf: 'bevel' });
    const hut = v.hut === 'melone'
      ? [E(kx + 1, ky - 6, 9, 2, 'dunkel', { pf: 'flat' }), E(kx + 1, ky - 10, 6, 5, null, { pf: 'dome' })]
      : [E(kx + 1, ky - 6, 9, 1.6, 'dunkel', { pf: 'flat' }), Pg([[kx - 5, ky - 7], [kx + 6, ky - 7], [kx + 7, ky - 20], [kx - 4, ky - 20]], null, { rd: 0.6 })];
    // Beine: Oberschenkel und Schienbein, Schuhe spitz nach links
    const bein = (h, k, fu, d) => [...glied([h, k, fu], d, d * 0.55, null), Pg([[fu[0] - 6, fu[1] + 1], [fu[0] + 3, fu[1] + 1], [fu[0] + 3, fu[1] - 3], [fu[0] - 3, fu[1] - 2]], 'dunkel', { rd: 0.6 })];
    const beinFern = bein([hip[0] - 3, hip[1]], K2, F2, 3.2), beinNah = bein(hip, K1, F1, 3.6);
    // Koffer, auf dem er sitzt (bleibt stehen)
    const koffer = [Pg([[50, 100 + (u > 0.3 ? 2 : 0)], [82, 100 + (u > 0.3 ? 2 : 0)], [82, 115], [50, 115]], null, { rd: 1 }), C(60, 98, 70, 98, 1, 1, 'dunkel', { pf: 'flat' })];
    // Zeitung: hochgehalten vor dem Gesicht, beim Angriff sinkt sie und fällt
    const zx0 = v.zeitung[0] + lean * 0.6, zx1 = v.zeitung[1] + lean * 0.6, zy = ky - atem + 4 + r(zl * 34) + (p.tod ? fall : 0);
    const kipp = zl * 9;
    const zeitung = zl >= 1 ? [] : [Pg([[zx0 - kipp * 0.2, zy + blatt], [zx1, zy - kipp * 0.4], [zx1 + 1, zy + 30 - kipp * 0.6], [zx0 - 1, zy + 31]], 'haut', { rd: 0.5, pf: 'flat', tone: 0.35 })];
    // Arme: halten die Zeitung an den Rändern; im Angriff greift der nahe Arm weit nach links
    const hand1 = zl >= 1 ? [lerp(zx0, 6, arm), lerp(zy + 10, ky + 14, arm)] : [zx0 + 1, zy + 12];
    const hand2 = [zx1 - 1, zy + 13];
    const armFern = glied([[sh[0] + 6, sh[1] + 3], [sh[0] + 13, sh[1] + 16], hand2], 2.6, 1.4, null);
    const armNah = glied([[sh[0] - 6, sh[1] + 3], [lerp(sh[0] - 4, sh[0] - 18, arm), lerp(sh[1] + 20, sh[1] + 6, arm)], hand1], 2.6, 1.3, null);
    const finger = zl >= 1 ? glied([hand1, [hand1[0] - 6, hand1[1] + 3], [hand1[0] - 9, hand1[1] + 8]], 1, 0.6, null) : [E(hand1[0], hand1[1], 2, 2.5, 'haut')];
    const schirm = v.schirm ? [C(K2[0] + 2, K2[1] + 2, F2[0] + 22, 114, 0.8, 0.8, 'dunkel', { pf: 'flat', noRim: true }), ...glied([[K2[0] + 2, K2[1] + 2], [K2[0] - 1, K2[1] - 2], [K2[0] - 4, K2[1]]], 0.9, 0.8, 'dunkel')] : [];
    const gruppen = [
      { p: koffer, k: 0 },
      { p: beinFern, k: 1 },
      { p: armFern, k: 0 },
      { p: [rumpf, kragen], k: 3 },
      { p: [kopf, ...hut], k: 1, anker: [0, atem] },
      { p: beinNah, k: 1 },
      { p: schirm, k: 0 },
      { p: zeitung, k: 0 },
      { p: [...armNah, ...finger], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Messingbeschläge am Koffer
      for (const [x, y] of [[51, 101], [81, 101], [51, 114], [81, 114], [66, 106]]) P.auf(x, y + (u > 0.3 && y < 110 ? 2 : 0), 'messing');
      // Zeitung: Spalten und Zeilen in einer Stufe dunkler, eine fette Schlagzeile
      if (zl < 1) {
        const y0 = r(zy) + 3;
        for (let x = r(zx0) + 2; x <= r(zx1) - 2; x++) { P.auf(x, y0, 'k1'); if (x % 3) P.auf(x, y0 + 1, 'k1'); }
        for (let row = y0 + 4; row < r(zy) + 24; row += 2) for (let x = r(zx0) + 2; x <= r(zx1) - 2; x++) { const sp = x === r((zx0 + zx1) / 2); if (!sp && (x * 7 + row * 3) % 5) P.auf(x, row, 'k2'); }
        P.line(r((zx0 + zx1) / 2), y0 + 3, r((zx0 + zx1) / 2), r(zy) + 24, 'k1', true);
      }
      // Augen über dem Zeitungsrand (oder im leeren Gesicht, wenn die Zeitung fällt)
      if (augenAn) {
        const ey = r(ky - 1);
        P.auge(kx - 3, ey, 1); P.auge(kx + 2, ey, 1);
        augen.push([r(kx - 3), ey], [r(kx + 2), ey]);
        if (zl >= 0.75) { P.line(kx - 4, ky + 4, kx + 3, ky + 4, 'k0', true); if (p.angriff && f === 2) P.line(kx - 3, ky + 5, kx + 2, ky + 5, 'glutDim', true); }
      }
      // Uhrkette an der Weste
      P.auf(sh[0] + 2, sh[1] + 14, 'messing'); P.auf(sh[0] + 3, sh[1] + 15, 'messing'); P.auf(sh[0] + 5, sh[1] + 15, 'messing');
    };
    return { gruppen, details, augen };
  },
};
