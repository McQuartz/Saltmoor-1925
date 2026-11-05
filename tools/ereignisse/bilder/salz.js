// Ereignisbilder 160 × 90 · Salzstollen (data/events.json mit biom "salz" und salz_plus.json).
// Palette der Salzstollen (prototype/js/scenes/world/salz.js): warmes Grau bis Salzweiß, Grubenholz,
// eine Grubenlampe in Orange. Anders als der Hafen: helle Wände, die nur im Lampenkreis aufleuchten,
// außerhalb sinken sie in Braunschwarz.
'use strict';

const SALZ = ['#141110', '#211c1a', '#322a27', '#463c38', '#5e524c', '#786a63', '#94877f', '#b2a69d', '#d0c6bd', '#ece4dc'];
const HOLZ = ['#0a0706', '#150f0c', '#221812', '#33241a', '#463324', '#5c4430'];
const EISEN = ['#070606', '#100d0c', '#1c1716', '#2c2421', '#3e3430'];
const LAMPE = '#ffb060', LAMPG = '#6a3410', LAMPK = '#fff0d0';
const HOLZKANTE = ['#8a5a30', '#ffb060'];
const SALZKANTE = ['#b2a69d', '#f4ece4'];

// ---------- eigene Bausteine ----------
// Salzkruste: Voronoi-Zellen, Kanten dunkel (wie salz.js der Hintergründe)
function kruste(B, X, Z, s, gr) {
  const cx = Math.floor(X / gr), cz = Math.floor(Z / gr); let d1 = 9, d2 = 9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const px = (cx + i + B.hash(cx + i, cz + j, s)) * gr, pz = (cz + j + B.hash(cx + i, cz + j, s + 1)) * gr; const d = Math.hypot(X - px, (Z - pz) * .8); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return d2 - d1;
}
// Salzwand im Lampenlicht: hell nahe (lx, ly), nach außen ins Dunkle; o.maske, o.gr (Zellgröße), o.st, o.basis
function salzwand(K, x0, y0, x1, y1, lx, ly, r, o) {
  o = o || {}; const { B } = K, gr = o.gr || 7, st = o.st === undefined ? .95 : o.st, ov = o.oval || 1.2;
  K.feld(x0, y0, x1, y1, o.cols || SALZ, (x, y) => {
    if (o.maske && !o.maske(x, y)) return -1;
    const q = Math.min(1, Math.hypot(x - lx, (y - ly) * ov) / r), lic = Math.pow(1 - q, 1.5) * st;
    const k = kruste(B, x, y, K.seed + (o.s || 0), gr), kante = k < .9 ? -.04 - lic * .16 : 0;
    return (o.basis === undefined ? .06 : o.basis) + lic + kante + (B.fbm(x * .08, y * .08, K.seed, 2) - .5) * .1 + (o.tf ? o.tf(x, y) : 0);
  });
}
// Grubenlampe (Öl, mit Haken): Fuß bei (x, yb); hängt am Haken oder steht.
// Bauchiger Ölbehälter, oben die Tülle mit offener Flamme (die hellste Stelle im Bild).
function grubenlampe(K, x, yb, o) {
  o = o || {}; const m = K.maske();
  m.ell(x, yb - 3, 3.6, 3);
  m.rect(x - 3.5, yb - 1, 7, 1.5);
  m.kap(x + 1, yb - 5, x + 3.5, yb - 8, .9, .7);              // Tülle
  if (o.haken !== false) { m.kap(x - 1, yb - 5, x - 2, yb - 12, .45, .45); m.kap(x - 2, yb - 12, x, yb - 14, .45, .45); }
  const fx = Math.round(x + 4), fy = Math.round(yb - 10);
  K.licht(fx, fy, o.hof || 46, LAMPG, o.staerke || .95, { ohne: o.ohne, oval: o.oval });
  K.licht(fx, fy, 9, '#3a1806', 1);
  K.form(m, 0, { k: HOLZ.slice(0, 5), r: HOLZKANTE, ton: 1.5, fase: 0, rand: 1, lichtVon: [fx, fy - 3] });
  // Flamme: Tropfen, Kern fast weiß
  K.set(fx, fy + 1, '#c05a20'); K.set(fx + 1, fy + 1, '#c05a20');
  K.set(fx - 1, fy, LAMPE); K.set(fx, fy, LAMPK); K.set(fx + 1, fy, LAMPK); K.set(fx + 2, fy, '#c05a20');
  K.set(fx - 1, fy - 1, LAMPE); K.set(fx, fy - 1, LAMPK); K.set(fx + 1, fy - 1, LAMPE); K.set(fx + 2, fy - 1, '#c05a20');
  K.set(fx, fy - 2, LAMPE); K.set(fx + 1, fy - 2, '#c05a20'); K.set(fx, fy - 3, LAMPE); K.set(fx, fy - 4, '#c05a20');
  K.lichtquelle(fx, fy);
  return [fx, fy];
}
// Balken mit Holzmaserung
function balken(K, m, o) {
  const { B } = K; o = o || {};
  K.form(m, o.tiefe || 0, Object.assign({ k: HOLZ, r: HOLZKANTE, ton: 1.6, fase: 1, rand: 1, schatten: 2, muster: (x, y) => (B.rausch2(x * (o.quer ? .5 : .08), y * (o.quer ? .08 : .5), 9) - .5) * .7 }, o.mat || {}));
}

module.exports = {
  biom: 'salz',
  bilder: {
    // Eine einzelne Lore auf Schienen, die in einen dunklen Stollen abfallen, im Salz ein Hackenstiel.
    salz_lore(K) {
      const { B } = K;
      const lx = 46, ly = 22;   // Lampe am Stempel links
      salzwand(K, 0, 0, 160, 90, lx, ly + 10, 92, { gr: 8 });
      // Boden: gestampftes Salz, flach, rechts fällt die Sohle in den Stollen ab
      const sohle = x => x < 96 ? 70 : 70 + (x - 96) * .32;
      salzwand(K, 0, 64, 160, 90, lx + 10, 66, 80, { gr: 5, oval: 2.4, basis: .02, st: .8, maske: (x, y) => y >= sohle(x) - 1, tf: (x, y) => (y - sohle(x)) * -.004 });
      // Stollenmund rechts: schwarzer Bogen, innen Tiefe
      const mund = K.maske(); mund.ell(128, 64, 26, 30); mund.rect(102, 64, 52, 26);
      const innen = K.maske(); innen.ell(129, 66, 22, 26); innen.rect(107, 66, 44, 24);
      K.form(mund, 0, { k: SALZ.slice(1, 6), r: SALZKANTE, ton: 1.8, fase: 2, rand: 2, lichtVon: [lx, ly], muster: (x, y) => (kruste(B, x, y, 5, 4) < 1 ? -.7 : 0) });
      K.feld(100, 36, 156, 90, ['#000000', '#050404', '#0a0807', '#100d0c'], (x, y) => innen.has(x, y) ? Math.max(0, .5 - Math.hypot(x - 122, y - 74) / 30) : -1);
      // Gleis: zwei Schienen von links, ab x 96 abwärts in den Stollen, Schwellen
      const SCH = (x, d) => sohle(x) - 1 + d;
      for (let x = 0; x < 150; x += 7) { const s = K.maske(); s.rect(x, Math.round(SCH(x, 1)), 5, 2); if (x < 140 && !(x > 110 && x < 150 && false)) K.form(s, x > 112 ? .6 : 0, { k: HOLZ, ton: 1.4, fase: 0, rand: 1, r: ['#4a3020', '#8a5a30'] }); }
      for (let x = 0; x < 152; x++) {
        const y = Math.round(SCH(x, 0)), tief = x > 116 ? (x - 116) / 30 : 0, glanz = Math.max(0, 1 - Math.abs(x - lx - 10) / 60);
        if (tief > .9 && B.bay(x, y) > 1 - tief * .6) continue;
        K.set(x, y, glanz > .55 ? '#e8c8a0' : glanz > .2 ? '#8a7060' : tief > .3 ? '#2c2421' : '#463c38');
        K.set(x, y + 1, '#100d0c');
      }
      // Stempel und Kappe mit der Lampe
      const st = K.maske(); st.rect(18, 0, 6, 70); st.rect(10, 0, 64, 5);
      balken(K, st);
      K.set(lx, 5, '#2c2421'); K.set(lx, 6, '#2c2421');
      grubenlampe(K, lx, 24, { hof: 70 });
      // Die Lore: Profil, auf den Schienen, halb voll Salz, Hackenstiel schräg heraus
      const x = 72, yb = Math.round(SCH(72, 0));
      const kasten = K.maske(); kasten.poly([[x - 17, yb - 21], [x + 17, yb - 21], [x + 13, yb - 6], [x - 13, yb - 6]]); kasten.rect(x - 18, yb - 22, 36, 2);
      kasten.rect(x - 14, yb - 6, 28, 2);
      const raeder = K.maske(); raeder.ell(x - 8, yb - 3, 3.4, 3.4); raeder.ell(x + 8, yb - 3, 3.4, 3.4);
      // Salz in der Lore (Haufen), davor der Stiel
      const haufen = K.maske(); haufen.poly([[x - 16, yb - 21], [x - 9, yb - 26], [x - 2, yb - 25], [x + 5, yb - 28], [x + 12, yb - 24], [x + 16, yb - 21]]);
      K.form(haufen, 0, { k: SALZ.slice(3, 10), r: ['#d0c6bd', '#ffffff'], ton: 2.6, fase: 1, rand: 2, muster: (px, py) => (kruste(B, px, py, 3, 2.5) < .7 ? -.8 : 0) });
      const stiel = K.maske(); stiel.kap(x + 3, yb - 24, x + 15, yb - 43, 1.2, 1);
      balken(K, stiel, { mat: { ton: 2.4, k: HOLZ.slice(1) } });
      const kopf = K.maske(); kopf.kap(x + 2, yb - 26, x + 7, yb - 22, 1, .6); K.form(kopf, 0, { k: EISEN, ton: 1.5, fase: 0, rand: 1 });
      K.form(kasten, 0, { k: EISEN, r: HOLZKANTE, ton: 1.4, fase: 1, rand: 2, schatten: 2, verlauf: .6, muster: (px, py) => (py === yb - 14 ? -.8 : 0) + ((px - x + 30) % 9 === 0 ? -.5 : 0) });
      K.form(raeder, 0, { k: EISEN, r: HOLZKANTE, ton: 1.2, fase: 0, rand: 1 });
      K.set(x - 8, yb - 3, '#5c4430'); K.set(x + 8, yb - 3, '#5c4430');
      K.vignette(.7, { cx: 70, cy: 40 });
    },

    // Eine Grubenlampe auf einem Holzbalken, eine Joppe am Haken und ein aufgeschlagenes Buch im kleinen Lichtkreis.
    salz_schichtbuch(K) {
      const { B } = K;
      const lx = 92, ly = 42;
      salzwand(K, 0, 0, 160, 90, lx - 6, ly, 70, { gr: 10, st: .85, basis: .03 });
      // Türstock: zwei Stempel, Kappe; ein Querbalken als Bank, darauf Lampe und Buch
      const ts = K.maske(); ts.rect(34, 0, 7, 90); ts.rect(126, 0, 7, 90); ts.rect(26, 8, 116, 6);
      balken(K, ts, { mat: { ton: 2.2, lichtVon: [lx, ly] } });
      const bank = K.maske(); bank.rect(41, 56, 85, 5); bank.rect(50, 61, 4, 29); bank.rect(112, 61, 4, 29);
      balken(K, bank, { mat: { ton: 2.4, L: [0, -1] } });
      // Joppe am Haken am rechten Stempel: Schultern, hängende Ärmel, Falten
      const hx = 120, hy = 20;
      K.linie(hx, hy, hx + 6, hy, '#5c4430'); K.set(hx, hy - 1, '#5c4430');
      const jo = K.maske();
      jo.poly([[hx, hy + 1], [hx - 6, hy + 4], [hx - 9, hy + 10], [hx - 10, hy + 34], [hx - 4, hy + 36], [hx + 2, hy + 35], [hx + 8, hy + 36], [hx + 10, hy + 33], [hx + 9, hy + 10], [hx + 6, hy + 4]]);
      jo.kap(hx - 8, hy + 7, hx - 12, hy + 31, 2.6, 2.2); jo.kap(hx + 8, hy + 7, hx + 11, hy + 30, 2.4, 2.1);
      K.form(jo, 0, { k: ['#0e0a08', '#1c1410', '#2c2018', '#3e2e22', '#524032'], r: ['#6a4a30', '#c08a50'], ton: 1.6, verlauf: .5, fase: 1, rand: 1, lichtVon: [lx, ly], muster: (x, y) => (Math.sin(x * 1.3 + y * .05) > .75 ? -.6 : 0) + (x === hx && y > hy + 6 ? -.8 : 0) });
      K.kante(jo, lx, ly - 4, 40, ['#8a5a30', '#ffb060']);
      const kragen = K.maske(); kragen.poly([[hx - 5, hy + 3], [hx, hy + 1], [hx + 5, hy + 3], [hx + 2, hy + 9], [hx, hy + 6], [hx - 2, hy + 9]]);
      K.form(kragen, 0, { k: ['#0e0a08', '#1c1410', '#2c2018', '#3e2e22'], r: ['#6a4a30', '#c08a50'], ton: 1.2, fase: 1, rand: 1, lichtVon: [lx, ly] });
      // Knöpfe
      for (let i = 0; i < 3; i++) K.set(hx + 1, hy + 10 + i * 6, '#5c4430');
      // Aufgeschlagenes Schichtbuch auf der Bank, im Lichtkreis
      const PAPIER = ['#2a221c', '#5a4a3e', '#9a8672', '#d6c4a8', '#f0e2c8'];
      const bx = 58, buch = K.maske(); buch.poly([[bx, 56], [bx + 3, 48], [bx + 14, 47], [bx + 16, 49], [bx + 18, 47], [bx + 29, 48], [bx + 32, 56], [bx + 16, 56]]);
      K.form(buch, 0, { k: PAPIER, r: ['#d6c4a8', '#fff0d0'], ton: 2.7, fase: 1, rand: 1, lichtVon: [lx, ly], verlaufX: .5, muster: (x, y) => (x === bx + 16 || x === bx + 17 ? -1.4 : 0) + (y === 55 ? -.6 : 0) });
      for (let i = 0; i < 3; i++) { K.schrift(bx + 4, 50 + i * 2, bx + 15, '#3a2c22', { min: 1, max: 3 }); K.schrift(bx + 19, 50 + i * 2, bx + 30 - i * 3, '#3a2c22', { min: 1, max: 3 }); }
      // Der letzte Eintrag: frische, glänzende Tinte, der Federhalter liegt quer
      K.linie(bx + 19, 55, bx + 25, 55, '#120c08'); K.set(bx + 26, 54, '#6a5040');
      K.linie(bx + 22, 58, bx + 34, 52, '#1a120c'); K.set(bx + 34, 52, '#8a7060');
      // Grubenlampe auf der Bank rechts neben dem Buch
      grubenlampe(K, lx + 6, 56, { haken: true, hof: 58, oval: 1.1 });
      K.vignette(.6, { cx: 88, cy: 46, innen: .45 });
    },

    // Ein vermauerter Bogen im weißen Salz, darüber verwitterte Steinmetzzeichen, davor ein Häufchen Mörtelstaub.
    salz_mauer(K) {
      const { B } = K;
      const lx = 30, ly = 76;   // Lampe am Boden links
      salzwand(K, 0, 0, 160, 90, lx + 30, ly - 22, 120, { gr: 10, st: 1, basis: 0 });
      // Boden
      salzwand(K, 0, 78, 160, 90, lx + 16, 80, 70, { gr: 5, oval: 3, basis: 0, st: .7 });
      // Bogen: Laibung aus Salz, darin Mauerwerk aus Quadern
      const cx = 92, by = 80, br = 26, bh = 58;
      const bogen = K.maske(); bogen.ell(cx, by - bh + br, br + 4, br + 4); bogen.rect(cx - br - 4, by - bh + br, 2 * br + 8, bh - br);
      const loch = K.maske(); loch.ell(cx, by - bh + br, br, br); loch.rect(cx - br, by - bh + br, 2 * br, bh - br);
      K.form(bogen, 0, { k: SALZ.slice(2, 9), r: SALZKANTE, ton: 3, fase: 2, rand: 2, lichtVon: [lx, ly - 10], muster: (x, y) => -Math.hypot(x - lx, y - ly) / 40 + (kruste(B, x, y, 7, 4) < 1 ? -.6 : 0) });
      const MAUER = ['#0e0b0a', '#1a1513', '#28201d', '#382e2a', '#4c403a', '#625550'];
      K.mauer(cx - br, by - bh, cx + br, by, MAUER, { hoehe: 6, breite: 10, ton: .3, maske: (x, y) => loch.has(x, y), tf: (x, y) => Math.max(0, .55 - Math.hypot(x - lx, y - ly) / 120) });
      // Schatten der Laibung innen rechts oben
      K.dith(cx - br, by - bh, cx + br, by, '#0e0b0a', (x, y) => loch.has(x, y) && (x - cx) > br - 6 - (y - (by - bh)) * .05 ? .6 : 0);
      // Steinmetzzeichen über dem Bogen: eingeschlagen, hastig, verwittert
      const zeichen = [
        [[0, 0], [3, 9]], [[3, 9], [6, 0]],                      // V
        [[10, 0], [10, 9]], [[13, 0], [13, 9]], [[16, 0], [16, 9]], // III
        [[22, 0], [28, 9]], [[28, 0], [22, 9]],                   // X
        [[33, 1], [33, 9]], [[33, 1], [37, 3]], [[37, 3], [33, 5]], // P (Rest)
        [[42, 9], [44, 0]], [[44, 0], [46, 9]],                   // Λ
      ];
      const zx = cx - 24, zy = by - bh - 14;
      for (const [[a, b], [c, d]] of zeichen) { K.linie(zx + a, zy + b, zx + c, zy + d, '#100d0c'); K.linie(zx + a + 1, zy + b + 1, zx + c + 1, zy + d + 1, B.hash(a, b, 3) > .3 ? '#94877f' : '#5e524c', .8); }
      // Mörtelstaub am Fuß des Bogens
      const st = K.maske(); st.poly([[64, 81], [70, 77], [76, 76], [80, 78], [84, 81]]); st.ell(74, 80, 9, 2);
      K.form(st, 0, { k: SALZ.slice(3, 9), r: SALZKANTE, ton: 2.4, fase: 0, rand: 1, lichtVon: [lx, ly - 6], muster: (x, y) => (B.hash(x, y, 4) - .5) * .9 });
      for (let i = 0; i < 9; i++) K.set(60 + K.r() * 28, 82 + K.r() * 3, '#94877f');
      // Lampe am Boden links
      grubenlampe(K, lx, ly + 6, { haken: false, hof: 48 });
      K.vignette(.6, { cx: 80, cy: 40 });
    },

    // Eine weiße Salzwand im Lampenlicht, darin halb eingeschlossen ein dunkler Schuh und ein Holzspan; über ihnen ein glatter, würfelförmiger Kristall.
    salz_schuh(K) {
      const { B } = K;
      const lx = 18, ly = 30;   // Lampe am linken Rand, hängend
      salzwand(K, 0, 0, 160, 90, 70, 48, 110, { gr: 12, st: 1, basis: 0, oval: 1.4, tf: (x, y) => -Math.max(0, x - 110) * .006 });
      // Schichten im Salz: schräge Bänder
      K.dith(0, 0, 160, 90, '#322a27', (x, y) => (Math.abs(((y + x * .18) % 22) - 11) < .6 ? .6 : 0));
      // Der Schuh im Profil: Spitze links, Ferse rechts, offener Schaft oben; die Ferse steckt noch im Salz
      const sch = K.maske();
      sch.poly([[50, 67], [50, 64], [53, 60], [60, 57], [69, 55], [76, 51], [79, 45], [94, 44], [98, 48], [100, 56], [102, 64], [101, 67]]);
      const sohle = K.maske(); sohle.poly([[49, 66], [102, 66], [102, 69], [86, 69], [86, 68], [52, 69], [49, 68]]);
      const LEDER = ['#0c0705', '#180e0a', '#26160e', '#362014', '#4a2c1a', '#623c24'];
      K.form(sch, 0, { k: LEDER, r: ['#8a5a36', '#e8b888'], ton: 2.4, fase: 1, rand: 2, lichtVon: [lx, ly], verlauf: .8, schatten: 2, muster: (x, y) => (B.rausch2(x * .3, y * .3, 5) - .5) * .5 });
      K.form(sohle, 0, { k: LEDER.slice(0, 3), r: ['#4a2c1a', '#8a5a36'], ton: 1.2, fase: 0, rand: 1, schatten: 2, lichtVon: [lx, ly] });
      // Schaftöffnung (dunkel) und Naht
      const off = K.maske(); off.ell(87, 46.5, 6.5, 1.6); K.form(off, 0, { k: ['#000000', '#050302'], ton: .3, fase: 0, rand: 0 });
      for (let x = 56; x < 80; x += 2) K.set(x, Math.round(60 - (x - 56) * .18 + (x > 70 ? -(x - 70) * .35 : 0)), '#9a7050');
      K.linie(80, 49, 80, 66, '#140c09');
      // Salz kriecht über die Ferse (der Schuh steckt mit der Ferse in der Wand)
      const kr = K.maske(); kr.poly([[91, 43], [96, 41], [104, 44], [106, 56], [105, 70], [97, 71], [99, 60], [96, 50]]);
      K.form(kr, 0, { k: SALZ.slice(3, 10), r: SALZKANTE, ton: 2.6, fase: 1, rand: 1, lichtVon: [lx, ly], muster: (x, y) => (kruste(B, x, y, 6, 3) < .8 ? -.9 : 0) });
      // Der angekohlte Span daneben, schräg
      const span = K.maske(); span.kap(108, 70, 126, 58, 1.5, 1);
      K.form(span, 0, { k: HOLZ, r: HOLZKANTE, ton: 2.2, fase: 0, rand: 1, lichtVon: [lx, ly], muster: (x, y) => (x > 120 ? -1.4 : 0) });
      K.set(126, 57, '#3a1806'); K.set(125, 58, '#1a0a04'); K.set(127, 57, '#1a0a04');
      // Der Würfelkristall darüber: glatte Flächen, oben hell, Seiten gestuft
      const wx = 84, wy = 22, s = 8;
      const oben = K.maske(); oben.poly([[wx - s, wy - s * .4], [wx, wy - s * .9], [wx + s, wy - s * .4], [wx, wy + s * .1]]);
      const links = K.maske(); links.poly([[wx - s, wy - s * .4], [wx, wy + s * .1], [wx, wy + s * 1.1], [wx - s, wy + s * .6]]);
      const rechts = K.maske(); rechts.poly([[wx, wy + s * .1], [wx + s, wy - s * .4], [wx + s, wy + s * .6], [wx, wy + s * 1.1]]);
      K.form(links, 0, { k: SALZ.slice(5, 10), r: [], ton: 2.4, fase: 0, rand: 0 });
      K.form(rechts, 0, { k: SALZ.slice(2, 7), r: [], ton: 1.4, fase: 0, rand: 0 });
      K.form(oben, 0, { k: SALZ.slice(6, 10), r: ['#ffffff', '#ffffff'], ton: 3, fase: 0, rand: 1, L: [-.6, -.8] });
      K.linie(wx - s, wy - s * .4, wx, wy + s * .1, '#ffffff');
      // Lampe am Rand, an einer Kette
      grubenlampe(K, lx, ly, { hof: 80, staerke: .7 });
      const hz = K.maske(); hz.kap(lx, ly - 15, lx, 0, .5, .5); K.form(hz, 0, { k: EISEN, ton: 2, fase: 0, rand: 0 });
      K.vignette(.45, { cx: 80, cy: 50 });
    },

    // Ein Stapel dunkler Holztafeln auf einem Salzblock, voller Kerbstriche, daneben ein Häufchen kleiner, glatter Salzwürfel.
    salz_zweites_buch(K) {
      const { B } = K;
      const lx = 136, ly = 40;
      salzwand(K, 0, 0, 160, 90, lx - 40, ly + 4, 100, { gr: 11, st: .7, basis: 0 });
      // Salzblock (Quader in leichter Aufsicht)
      const top = K.maske(); top.poly([[24, 62], [36, 52], [130, 52], [118, 62]]);
      const front = K.maske(); front.rect(24, 62, 94, 28);
      const seite = K.maske(); seite.poly([[118, 62], [130, 52], [130, 80], [118, 90]]);
      K.form(front, 0, { k: SALZ.slice(1, 7), r: SALZKANTE, ton: 1.6, fase: 1, rand: 1, verlauf: .8, verlaufX: 1.4, muster: (x, y) => (kruste(B, x, y, 2, 6) < .8 ? -.4 : 0) });
      K.form(seite, 0, { k: SALZ.slice(3, 9), r: SALZKANTE, ton: 2.6, fase: 1, rand: 2, muster: (x, y) => (kruste(B, x, y, 3, 4) < .8 ? -.4 : 0) });
      K.form(top, 0, { k: SALZ.slice(3, 9), r: SALZKANTE, ton: 2.2, fase: 0, rand: 1, verlaufX: 1.6 });
      // Tafelstapel: drei Tafeln, leicht gegeneinander verschoben
      const T = ['#0a0705', '#140e0a', '#20160f', '#2e2015', '#3e2c1c', '#523b26'];
      const tafeln = [[38, 60, 66, 3], [41, 57, 64, 3], [39, 54, 66, 3]];
      for (const [x, y, w, h] of tafeln) { const t = K.maske(); t.rect(x, y, w, h); balken(K, t, { mat: { k: T, ton: 1.6, lichtVon: [lx, ly] } }); K.linie(x + w * .4, y, x + w - 1, y, '#6a4a30', .7); K.set(x + w - 1, y, '#a87040'); }
      // oberste Fläche in Aufsicht: Kerbreihen, nach hinten länger, hinter jeder Reihe ein Würfel
      const fl = K.maske(); fl.poly([[39, 54], [48, 40], [114, 40], [105, 54]]);
      K.form(fl, 0, { k: T, r: HOLZKANTE, ton: 3.4, fase: 0, rand: 1, verlaufX: 1.2, lichtVon: [lx, ly], muster: (x, y) => (B.rausch2(x * .4, y * .05, 4) - .5) * .8 });
      for (let i = 0; i < 6; i++) {
        const y = 51 - i * 2, sx = 44 + i * 1.3, n = 5 + i * 5;
        let x = sx;
        for (let k = 0; k < n && x < 100; k++, x += 1.6) { K.set(Math.round(x), y, '#0a0705'); K.set(Math.round(x), y - 1, '#20160f'); }
        const wx = Math.round(Math.min(101, x + 1.5));
        K.set(wx, y, '#ece4dc'); K.set(wx + 1, y, '#b2a69d'); K.set(wx, y - 1, '#ffffff'); K.set(wx + 1, y - 1, '#d0c6bd');
      }
      // Häufchen Salzwürfel daneben auf dem Block
      const wm = K.maske();
      for (const [x, y] of [[112, 57], [116, 57], [114, 54], [120, 56], [109, 59], [118, 59], [113, 60], [117, 53]]) wm.rect(x, y, 3, 3);
      K.form(wm, 0, { k: SALZ.slice(4, 10), r: ['#ffffff', '#ffffff'], ton: 3, fase: 0, rand: 1, lichtVon: [lx, ly] });
      // Lampe rechts, hinter dem Block an der Wand
      grubenlampe(K, lx, 48, { haken: true, hof: 72 });
      K.vignette(.55, { cx: 84, cy: 52 });
    },
  },
};
