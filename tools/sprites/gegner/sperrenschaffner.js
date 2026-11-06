// Die Station, die nie eröffnet wurde: Der Sperrenschaffner. Der Schaffner an der Bahnsteigsperre, 1925
// eingestellt für den Tag der Eröffnung. Er steht in seiner hölzernen Kanzel und lehnt sich heraus; die Kanzel
// hat keine Tür, und unten, wo seine Beine sein müssten, laufen die Bretter in seinen Mantel hinauf. Sein
// rechter Unterarm endet nicht in einer Hand, sondern in der Lochzange. Wer keinen Fahrschein hat, dem knipst
// er ihn in die Hand. Über ihm hängt die Lampe der Sperre an einem Schwanenhals.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'sperrenschaffner', biom: 'station', zone: 'station', w: 96, h: 120, fuss: [50, 115], kopf: [42, 22], rimBis: 113,
  varianten: {
    // a: die Zange nach vorn gestreckt, die andere Hand flach auf dem Brett; Lampe rechts am Schwanenhals
    sperrenschaffner_a: { hoch: false, lampeL: false, fach: false },
    // b: die Zange hoch über dem Kopf, die andere Hand fordernd vorgestreckt; seitlich ein Fahrkartenfach
    sperrenschaffner_b: { hoch: true, lampeL: false, fach: true },
  },
  // Silhouetten-Probe (nicht gebaut): ein geschlossenes Häuschen mit Dach, er lehnt nur mit Kopf und Arm aus
  // dem Fenster (die Figur war zu klein, das Häuschen las sich als Kasten). Genommen: halbhohe Kanzel, er steht
  // darin bis zur Hüfte, die Lampe am Schwanenhals über ihm.
  proben: { probe_haeuschen: { hoch: false, haeuschen: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, arm = 0, maul = 0.5, kopfH = 0;
    // arm: 0 Ruhe, 1 zurückgezogen (ausgeholt), 2 weit vorgestoßen; maul: Öffnung der Zange 0..1
    if (p.idle) { kopfH = [0, 0, 1, 1][f]; maul = [0.4, 0.1, 0.4, 0.6][f]; }
    if (p.angriff) { lean = [2, 3, -7, -3][f]; arm = [0.6, 1, 2, 1.6][f]; maul = [0.6, 1, 0, 0.1][f]; kopfH = [-1, -1, 2, 1][f]; }
    if (p.treffer) { lean = [3, 2][f]; kopfH = -1; maul = 0.8; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); maul = 0.2; }
    const T = atem + fall, L = lean;
    // Kanzel: Front, Seite (perspektivisch), Brett obenauf, Sockel
    const kanzel = [Pg([[30, 79], [64, 79], [64, 112], [30, 112]], null, { rd: 0.6 })];
    const seite = [Pg([[64, 79], [73, 74], [73, 108], [64, 112]], null, { rd: 0.4 })];
    const brett = [Pg([[26, 76], [65, 76], [76, 71], [77, 74], [66, 80], [26, 80]], null, { rd: 0.5 })];
    const sockel = [Pg([[28, 111], [65, 111], [75, 107], [76, 110], [66, 115], [28, 115]], null, { rd: 0.4 })];
    const fach = v.fach ? [Pg([[73, 82], [80, 79], [80, 100], [73, 103]], null, { rd: 0.4 })] : [];
    // Schwanenhals mit Lampe: hinten rechts aus der Kanzel, über ihm gebogen
    const hals = v.haeuschen ? [] : glied([[72, 74], [74, 40], [72, 26], [64, 20], [57, 22]], 1.3, 1.1, null);
    const lampe = v.haeuschen ? [] : [Pg([[53, 23], [61, 22], [63, 28], [51, 29]], null, { rd: 0.5 }), E(57, 21.5, 2, 1.5, null)];
    // Er: Mantel vom Brett bis zu den Schultern, nach links geneigt
    const sx = 46 + L, sy = 50 + T;
    const mantel = Pg([[sx - 11, sy + 2], [sx - 5, sy - 3], [sx + 6, sy - 3], [sx + 12, sy + 2], [sx + 14, sy + 14], [sx + 15, 80], [sx - 15, 80], [sx - 14, sy + 14]], null, { rd: 1.5 });
    const kragen = Pg([[sx - 6, sy - 5], [sx + 5, sy - 5], [sx + 6, sy + 1], [sx - 1, sy + 4], [sx - 7, sy + 1]], null, { rd: 0.6 });
    const kx = 41 + L * 1.2, ky = 37 + T + kopfH;
    const halsF = C(sx - 1, sy - 3, kx + 1, ky + 5, 3.4, 3, 'haut');
    const kopf = [E(kx, ky, 6.2, 7, 'haut', { pf: 'bevel' }), C(kx - 5, ky + 1, kx - 7.5, ky + 3, 1.6, 1, 'haut'), E(kx - 2, ky + 5, 3.6, 2.8, 'haut')];
    // Schirmmütze: Deckel, Band, Schirm nach links
    const muetze = [Pg([[kx - 6, ky - 5], [kx - 5, ky - 10], [kx + 7, ky - 11], [kx + 9, ky - 6], [kx + 6, ky - 4]], null, { rd: 0.8 }), Pg([[kx - 5, ky - 5], [kx - 13, ky - 3], [kx - 13, ky - 2], [kx - 3, ky - 3]], null, { rd: 0.4 })];
    // Arme: vorn (links) der Zangenarm, hinten (rechts) die Hand
    const schV = [sx - 9, sy + 2], schH = [sx + 9, sy + 2];
    let eV, hV, zangeDir;
    if (v.hoch && arm < 0.5) { eV = [sx - 17, sy - 2]; hV = [sx - 21, sy - 17]; zangeDir = -2.2; }
    else if (arm < 0.5) { eV = [sx - 15, sy + 12]; hV = [sx - 27, sy + 8]; zangeDir = -2.9; }
    else if (arm < 1.5) { const k = Math.min(1, arm); eV = [sx - 10 + k * 4, sy + 14]; hV = [sx - 6 + k * 2, sy + 4 - k * 4]; zangeDir = -2.1 - k * 0.4; }
    else { const k = arm - 1.5; eV = [sx - 20 + k * 4, sy + 6]; hV = [sx - 36 + k * 8, sy + 4 + k * 2]; zangeDir = -3.05; }
    const armV = glied([schV, eV, hV], 3.6, 3, null);
    // Zange: am Gelenk zwei Backen (Maul), hinten das Gelenk rund; der Unterarm geht ins Eisen über
    const gx = hV[0], gy = hV[1], ca = Math.cos(zangeDir), sa = Math.sin(zangeDir), o = 0.18 + maul * 0.32;
    // Lochzange: oben der hohle Stempel (rund), unten die Platte; der Unterarm geht ins Eisen über
    const sp = (s, l) => [gx + Math.cos(zangeDir + s * o) * l, gy + Math.sin(zangeDir + s * o) * l];
    const [ox1, oy1] = sp(1, 10), [ox2, oy2] = sp(-1, 9);
    const nx = -sa, ny = ca;
    const zange = [E(gx, gy, 3.2, 3.2, null), C(gx, gy, ox1, oy1, 2.2, 1.6, null), C(gx, gy, ox2, oy2, 2.2, 1.6, null),
      E(ox1, oy1, 2.6, 2.6, null), C(ox2 - nx * 2.5, oy2 - ny * 2.5, ox2 + nx * 2.5, oy2 + ny * 2.5, 1.1, 1.1, null),
      C(gx - ca * 1, gy - sa * 1, gx - ca * 6, gy - sa * 6, 3, 2.4, null)];
    let eH, hH;
    if (v.hoch) { eH = [sx + 2, sy + 14]; hH = [sx - 14, sy + 16 + (arm >= 1.5 ? 2 : 0)]; }
    else { eH = [sx + 13, sy + 16]; hH = [sx + 8, 76]; }
    const armH = [...glied([schH, eH, hH], 3.4, 2.8, null), E(hH[0], hH[1], 2.8, 2.2, 'haut')];
    const fingerH = v.hoch ? [0, 1, 2, 3].map(i => C(hH[0], hH[1], hH[0] - 5, hH[1] - 3 + i * 1.6, 0.8, 0.6, 'haut')) : [0, 1, 2, 3].map(i => C(hH[0], hH[1], hH[0] - 4 + i * 2, hH[1] + 1 + ((i + f) % 2 && p.idle ? -1 : 0), 0.8, 0.7, 'haut'));
    // Probe: geschlossenes Häuschen mit Dach
    const dach = v.haeuschen ? [Pg([[24, 60], [48, 50], [78, 52], [74, 60]], null, { rd: 0.5 }), Pg([[30, 60], [72, 60], [72, 80], [30, 80]], null, { rd: 0.5 })] : [];
    const gruppen = [
      { p: hals, k: 0.5, kante: true },                                  // 0 Schwanenhals
      { p: [...seite, ...fach], k: 0, kante: true, tone: -0.1 },         // 1 Seite der Kanzel
      { p: armH, k: 1, kante: true, anker: [L, T] },                     // 2 hinterer Arm
      { p: [mantel], k: 1.5, kante: true, anker: [L, T], tone: 0.05 },   // 3 Mantel
      { p: [kragen], k: 0.5, kante: true },                              // 4 Kragen
      { p: [halsF], k: 1, kante: true },                                 // 5 Hals
      { p: kopf, k: 1.4, kante: true, anker: [L, T] },                   // 6 Kopf
      { p: muetze, k: 0.6, kante: true },                                // 7 Mütze
      { p: [...kanzel, ...sockel], k: 0, kante: true, tone: 0.08 },      // 8 Kanzel vorn
      { p: brett, k: 0, kante: true, tone: 0.15 },                       // 9 Brett
      { p: fingerH, k: 0.5, kante: true },                               // 10 Finger auf dem Brett
      { p: armV, k: 1, kante: true, anker: [L, T] },                     // 11 Zangenarm
      { p: zange, k: 0.4, kante: true },                                 // 12 Zange
      { p: lampe, k: 0.4, kante: true },                                 // 13 Lampe
      { p: dach, k: 0, kante: true },                                    // 14 Probe
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('station'), { rimBis: 113 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      H0.kapselLicht(P, hals, 'r1');
      H0.kapselLicht(P, zange.filter(k => k.t === 'c'), 'r2');
      // Kanzel: senkrechte Bretter mit Fuge (dunkel) und Fase (hell), Leiste oben und unten, Emailschild
      for (const bx of [36, 42, 48, 54, 60]) for (let y = 81; y < 110; y++) { P.auf(bx, y, 'k0'); if (y % 3) P.auf(bx + 1, y, 'k3'); }
      for (let x = 31; x < 64; x++) { P.auf(x, 84, 'k0'); P.auf(x, 85, x % 2 ? 'k3' : 'k2'); P.auf(x, 106, 'k0'); P.auf(x, 105, x % 2 ? 'r1' : 'k3'); }
      for (let y = 76; y < 108; y += 4) { P.auf(68, y + 1, 'k0'); P.auf(69, y, 'k3'); }
      for (let y = 90; y < 97; y++) for (let x = 41; x < 54; x++) P.auf(x, y, (y === 90 || x === 53) ? 'r1' : (y === 96 || x === 41) ? 'k1' : ((x + y) % 2 && (y === 91 || y === 95)) ? 'k3' : 'email');
      for (let x = 43; x < 52; x += 2) P.auf(x, 93, 'blass');
      // Die Bretter laufen in seinen Mantel hinauf: Maserung über die Kante hinweg
      const X = r(sx), Y = r(sy);
      for (const bx of [36, 42, 48, 54]) for (let y = 66; y < 79; y++) if ((y + bx) % 3 && y > 70 + ((bx * 3) % 5)) { P.auf(bx + r(L * (79 - y) / 30), y, 'k0'); P.auf(bx + 1 + r(L * (79 - y) / 30), y, 'k3'); }
      // Mantel: Knopfleiste in Messing, Gürtel, Schulterstück, Falten
      for (let i = 0; i < 4; i++) { P.auf(X - 3, Y + 4 + i * 6, 'messing'); P.auf(X - 2, Y + 4 + i * 6, 'k1'); }
      for (let y = Y + 2; y < 74; y++) { P.auf(X - 1, y, y % 2 ? 'k3' : 'k1'); }
      for (let x = X - 13; x < X + 14; x++) { P.auf(x, Y + 18, 'k0'); P.auf(x, Y + 17, x % 2 ? 'k3' : 'k2'); }
      for (const [x0, x1] of [[X + 7, X + 9], [X + 4, X + 5]]) { P.line(x0, Y + 20, x1, 74, 'k0', true); P.line(x0 + 1, Y + 20, x1 + 1, 74, 'k3', true); }
      P.line(X + 5, Y - 2, X + 11, Y + 1, 'messing', true); P.auf(X + 12, Y + 2, 'r1');
      // Revers: zwei Kanten zum Kragen, die rechte fängt das Licht
      P.line(X - 1, Y + 12, X + 5, Y - 1, 'r1', true); P.line(X - 2, Y + 12, X + 4, Y - 1, 'k0', true);
      P.line(X - 1, Y + 12, X - 7, Y - 1, 'k0', true); P.line(X - 2, Y + 11, X - 8, Y, 'k3', true);
      // Brusttasche mit Klappe, darin ein Bündel Fahrscheine
      for (let x = X + 3; x < X + 9; x++) { P.auf(x, Y + 8, 'k3'); P.auf(x, Y + 9, 'k0'); }
      P.auf(X + 5, Y + 7, 'blass'); P.auf(X + 6, Y + 7, 'k3');
      // Ärmelfalten am Zangenarm
      { const [ex, ey] = eV; P.auf(r(ex) + 1, r(ey) - 2, 'r1'); P.auf(r(ex) + 2, r(ey) - 1, 'k0'); P.auf(r(ex) - 1, r(ey) - 1, 'k0'); }
      // Mütze: Band dunkel, Abzeichen (Flügelrad) in Messing, Schirm mit Lichtkante
      const KX = r(kx), KY = r(ky);
      for (let x = KX - 5; x < KX + 8; x++) P.auf(x, KY - 6, 'k0');
      P.auf(KX + 1, KY - 8, 'messing'); P.auf(KX, KY - 8, 'messing'); P.auf(KX + 2, KY - 8, 'messing'); P.auf(KX + 1, KY - 9, 'k3');
      // Gesicht unter dem Schirm: Schatten, zwei Augen, Mund
      for (let x = KX - 8; x < KX + 2; x++) P.auf(x, KY - 2, 'k0');
      if (!aus) {
        P.set(KX - 4, KY, 'kern'); P.set(KX - 5, KY, 'glut'); P.set(KX, KY, 'glut'); P.set(KX + 1, KY, 'glutDim');
        P.glow(KX - 3.5, KY + 0.5, 4, 0.5); augen.push([KX - 4, KY], [KX, KY]);
      }
      // Nase und Wange fangen das Lampenlicht
      P.auf(KX - 7, KY + 1, 'k3'); P.auf(KX - 8, KY + 2, 'k3'); P.auf(KX - 2, KY + 2, 'k3'); P.auf(KX - 1, KY + 2, 'k2'); P.auf(KX + 2, KY - 1, 'r1');
      P.auf(KX - 4, KY + 4, 'k0'); P.auf(KX - 3, KY + 4, 'k0'); if (p.angriff && f === 2) P.auf(KX - 3, KY + 5, 'k0');
      // Unterarm geht ins Eisen über: Ring am Handgelenk, Nieten an den Backen
      const GX = r(gx), GY = r(gy);
      P.auf(GX, GY, 'k0'); P.auf(GX + 1, GY - 1, 'r2'); P.auf(r(ox1), r(oy1), 'k0'); P.auf(r(ox1) + 1, r(oy1) - 1, 'r2');
      // Konfetti aus Löchern: kleine helle Punkte fallen unter der Zange
      if (!p.tod) for (let i = 0; i < 4; i++) { const yy = GY + 4 + ((i * 5 + f * 3) % 14), xx = GX - 4 + ((i * 7) % 6); if (yy < 110) P.set(xx, yy, i % 2 ? 'blass' : 'k3'); }
      // Lampe der Sperre: das innere Licht, sie hellt seine Mütze von oben auf
      if (lampe.length && !aus) { P.glow(57, 27, 9, 0.9); P.set(57, 28, 'kern'); P.set(56, 28, 'glut'); P.set(58, 28, 'glut'); P.set(57, 29, 'glutDim'); P.glow(52, 28, 9, 0.7); P.glow(KX + 4, KY - 3, 6, 0.45); }
      // Fahrkartenfach: kleine Schübe
      if (v.fach) for (let y = 84; y < 100; y += 4) { P.line(74, y + 1, 79, y - 1, 'k0', true); P.auf(77, y - 1, 'messing'); }
    };
    return { gruppen, details, augen };
  },
};
