// Wächter Nachtzug: Der Uhrmacher im Speisewagen. Ein langer, gebeugter Reisender im offenen Ulster,
// eine Uhrmacherlupe im Auge. Mit beiden Händen dreht er einen Aufzugsschlüssel, der im Boden des Wagens steckt:
// er zieht den Zug auf. Falsch: Im Mantelfutter hängen Dutzende Taschenuhren, und alle gehen rückwärts.
'use strict';
module.exports = {
  id: 'uhrmacher', biom: 'nachtzug', zone: 'nachtzug', rang: 'waechter', w: 128, h: 160, fuss: [66, 155], kopf: [56, 4], rimBis: 152,
  varianten: { uhrmacher: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 6, fall: 46 }), f = p.f;
    const T = P0.atem + P0.fall;
    let lean = P0.lean, dreh = 0, raus = 0, lupe = 1, hem = 0;
    if (p.idle) { dreh = f; hem = [0, 1, 1, 0][f]; lupe = [1, 1, 0.9, 1][f]; }
    if (p.angriff) { lean = [3, 5, -8, -3][f]; dreh = [1, 2, 2, 3][f]; raus = [0, 0.35, 1, 0.3][f]; lupe = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) lupe = 0.6;
    if (p.tod) lupe = f < 1 ? 0.5 : 0;
    const cx = 72;
    // Beine: dünne Hosenbeine unter dem Mantel
    const beine = [C(64, 132 + T * 0.3, 60, 153, 3.2, 2.6, null), C(80, 132 + T * 0.3, 84, 153, 3.2, 2.6, null), E(57, 154, 5, 2, 'dunkel'), E(83, 154, 5, 2, 'dunkel')];
    // Schultern weit oben, Buckel rechts, Kopf weit vorgebeugt nach links
    const sy = 52 + T, sx = cx + lean;
    const mantel = Pg([[sx - 16, sy + 2], [sx - 4, sy - 6], [sx + 12, sy - 8], [sx + 22, sy + 4], [cx + 26 + r(lean / 3), sy + 40], [cx + 30, 136], ...saum(cx + 31, cx - 30, 146, 7, 4, 13, hem), [cx - 30, 134], [sx - 22 + r(lean / 3), sy + 40]], null, { rd: 2 });
    const kragen = Pg([[sx - 14, sy + 2], [sx - 6, sy - 9], [sx + 6, sy - 11], [sx + 4, sy - 2], [sx - 6, sy + 10]], 'dunkel', { rd: 1.5 });
    // Futter: offen vorn, ein dunkles Feld, in dem die Uhren hängen
    const futter = Pg([[sx - 10, sy + 8], [sx + 4, sy + 6], [cx + 8, 132], [cx - 22, 136]], 'dunkel', { rd: 1, pf: 'flat' });
    // Kopf: lang, kahl, vorgeneigt; Hals dünn
    const kx = sx - 18, ky = sy - 18 + (p.angriff ? [0, -1, 2, 0][f] : 0);
    const hals = C(sx - 4, sy - 4, kx + 4, ky + 6, 3.4, 2.6, null);
    const kopf = Pg([[kx - 7, ky - 8], [kx + 4, ky - 12], [kx + 9, ky - 4], [kx + 6, ky + 8], [kx - 2, ky + 11], [kx - 8, ky + 4]], 'haut', { rd: 2 });
    // Lupe: Röhre vor dem linken Auge
    const lupeR = [C(kx - 6, ky - 1, kx - 13, ky, 3.2, 3.6, 'dunkel', { pf: 'flat' })];
    // Aufzugsschlüssel: senkrechter Schaft mit Querbalken als Griff, steckt im Boden.
    // Im Angriff reißt er ihn heraus und stößt den Bart nach links.
    const gx = cx - 40 + lean * 0.6 - r(raus * 4), gy0 = 90 + T * 0.5 + r(raus * -6);
    const d = Math.PI / 2 + raus * Math.PI / 2 * 0.92, lang = raus > 0 ? 64 - raus * 14 : 66;
    const spitze = [gx, gy0], fussP = [gx + Math.cos(d) * lang, gy0 + Math.sin(d) * lang];
    const schaft = [C(spitze[0], spitze[1], fussP[0], fussP[1], 1.7, 1.5, 'dunkel', { pf: 'flat' })];
    // Griff: Querbalken mit zwei Knäufen, dreht sich (perspektivisch kürzer)
    const gb = [15, 10, 3, 10][dreh % 4];
    const qx = Math.cos(d + Math.PI / 2), qy = Math.sin(d + Math.PI / 2);
    const g1 = [spitze[0] - qx * gb, spitze[1] - qy * gb], g2 = [spitze[0] + qx * gb, spitze[1] + qy * gb];
    const griff = [C(g1[0], g1[1], g2[0], g2[1], 2.2, 2.2, 'dunkel'), E(g1[0], g1[1], 3.2, 3.2, null), E(g2[0], g2[1], 3.2, 3.2, null)];
    const bx = fussP[0], by = fussP[1];
    const bart = raus > 0 ? [Pg([[bx - Math.cos(d) * 2 - qx * 1, by - Math.sin(d) * 2 - qy * 1], [bx - Math.cos(d) * 9 - qx * 7, by - Math.sin(d) * 9 - qy * 7], [bx - qx * 7, by - qy * 7], [bx, by]], 'dunkel', { rd: 0.6 })] : [];
    // Arme: lang, beide Hände am Griff; Finger dünn und lang
    const h1 = [spitze[0] - qx * gb * 0.55, spitze[1] - qy * gb * 0.55], h2 = [spitze[0] + qx * gb * 0.55, spitze[1] + qy * gb * 0.55];
    const armR = glied([[sx + 14, sy + 2], [sx + 6, sy + 34], h2], 4, 2.2, null);
    const armL = glied([[sx - 12, sy + 4], [sx - 32 + r(raus * 6), sy + 18 - r(raus * 8)], h1], 4, 2.2, null);
    const finger = [h1, h2].flatMap(([x, y], i) => [-1, 0, 1].map(k => C(x, y, x - 3 + k * 2, y + 5 + Math.abs(k), 0.7, 0.5, 'haut')));
    const gruppen = [
      { p: beine, k: 1 },
      { p: armR, k: 1 },
      { p: [mantel], k: 4 },
      { p: [futter], k: 0, noRim: true },
      { p: [kragen], k: 1 },
      { p: [hals, kopf], k: 2 },
      { p: lupeR, k: 0 },
      { p: [...schaft, ...bart], k: 0 },
      { p: griff, k: 0.5 },
      { p: armL, k: 1 },
      { p: finger, k: 0.4 },
    ];
    const augen = [];
    const details = P => {
      // Uhren im Futter: Ketten von oben, Zifferblätter hell, Gehäuse aus Messing. Zeiger stehen je Bild anders (rückwärts).
      const uhren = [[-4, 20], [-14, 34], [0, 40], [-10, 54], [2, 62], [-16, 70], [-6, 80]];
      uhren.forEach(([dx, dy], i) => {
        const ux = r(sx + dx), uy = r(sy + dy);
        if (!P.get(ux, uy)) return;
        for (let k = 1; k < 7; k++) P.auf(ux + r(Math.sin(k * 0.6 + i) * 1.2), uy - 3 - k, k % 2 ? 'messing' : 'k3');
        P.el(ux + 0.5, uy + 0.5, 3.1, 3.1, 'messing', true); P.el(ux + 0.5, uy + 0.5, 2.2, 2.2, 'k3', true);
        P.set(ux, uy, 'r1'); P.set(ux - 1, uy - 1, 'r1');
        const t = (i * 5 - p.f * 3) & 7; // Zeiger rückwärts: je Bild eine Stufe zurück
        const zx = [0, 1, 1, 1, 0, -1, -1, -1][t], zy = [-1, -1, 0, 1, 1, 1, 0, -1][t];
        P.set(ux + zx, uy + zy, 'k0'); P.set(ux + zx * 2, uy + zy * 2, 'k0');
      });
      // Schlüsselloch im Boden: Messingplatte (nur wenn der Schlüssel steckt); Messingkante am Schaft (Licht von rechts)
      if (raus === 0) { P.line(r(gx - 6), 154, r(gx + 6), 154, 'messing'); P.line(r(gx - 4), 155, r(gx + 4), 155, 'messing'); }
      const n = Math.ceil(lang);
      for (let k = 4; k < n; k += 1) { const x = spitze[0] + Math.cos(d) * k - qx * -1.6, y = spitze[1] + Math.sin(d) * k - qy * -1.6; if (k % 9 !== 0) P.set(r(x), r(y), k % 9 === 1 ? 'r2' : 'messing'); }
      for (const [x, y] of [g1, g2]) { P.set(r(x + 1), r(y - 2), 'messing'); P.set(r(x + 2), r(y - 1), 'messing'); }
      // Lupe: Linse glüht, zweites Auge klein
      if (lupe > 0) {
        const lx = r(kx - 13), ly = r(ky);
        P.glow(lx + 0.5, ly + 0.5, 9 * lupe, 1);
        P.el(lx + 0.5, ly + 0.5, 2.6, 3, 'glut'); P.set(lx, ly, 'kern'); P.set(lx, ly - 1, 'kern'); if (lupe > 1.3) { P.set(lx - 1, ly, 'kern'); P.set(lx, ly + 1, 'kern'); }
        P.set(r(kx + 2), r(ky - 2), 'glut');
        augen.push([lx, ly], [r(kx + 2), r(ky - 2)]);
      }
      // Mund: ein Strich, im Angriff offen
      P.line(r(kx - 4), r(ky + 6), r(kx + 1), r(ky + 6), 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
