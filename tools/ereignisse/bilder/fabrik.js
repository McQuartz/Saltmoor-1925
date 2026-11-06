// Ereignisbilder 160 × 90 · Fabrik (prototype/data/biome/fabrik.json).
// Palette der Konservenfabrik (prototype/js/scenes/world/fabrik.js): Kachelgrün, Ziegel, Rost,
// Natriumlicht bernsteingelb als einzige warme Lichtquelle; das Kühlhaus als kalter Gegenpol.
'use strict';

const KACHEL = ['#050a07', '#09130e', '#0e1d15', '#14281d', '#1b3526', '#244430', '#2e543c'];
const ZIEGEL = ['#0a0605', '#140b08', '#20110c', '#2c1810', '#3a2014', '#4a2a1a'];
const BODEN = ['#040605', '#080c0a', '#0d1310', '#131b16', '#1a251e', '#22302a'];
const ROST = ['#0a0503', '#160a05', '#24100a', '#361a0e', '#4c2614', '#64341c'];
const BLECH = ['#0b120f', '#152019', '#203027', '#2e4336', '#3e5747', '#566e5c'];
const HOF = ['#120f08', '#1c170c', '#282010', '#352a14', '#463718', '#5a461e', '#73581f'];
const RAUCH = ['#1a1a14', '#26261c', '#34342a', '#4c4a38', '#686448'];
const HOLZ = ['#0c0806', '#1a120c', '#2a1e14', '#3c2c1e', '#523e2a'];
const DUNKEL = ['#030504', '#060a08', '#0a100c', '#0e1611'];
const NAT = '#ffb84a', NAT_K = '#fff2c4', NAT_G = '#3a2a0c', NAT_G2 = '#5a400e';
const NATKANTE = ['#8c5a24', '#ffcf6a'];
const RAND_D = ['#3a2a12', '#6a4a1c'];          // gedämpfte Bernsteinkante
const DOSE = ['#1a1e1c', '#3a403c', '#6a706a', '#a8aca0', '#e8e4d0'];
const KALT = ['#0e1a22', '#1e3444', '#3a5a70', '#7a9ab0', '#cfe6ff', '#f4faff'];
const PAPIER = ['#2a2418', '#4a4030', '#7a6c50', '#b0a078', '#e0d4b0'];

// Nackte Glühbirne mit Emailleschirm an einem Draht: Mitte des Schirms (x, y)
function birne(K, x, y, o) {
  o = o || {}; const m = K.maske();
  m.rect(x, 0, 1, y - 2);
  m.poly([[x - 5, y + 1], [x - 2, y - 2], [x + 3, y - 2], [x + 6, y + 1]]);
  if (o.hof !== 0) K.licht(x + .5, y + 3, o.hof || 70, NAT_G, o.staerke || .95, { ohne: o.ohne, oval: o.oval || 1 });
  K.licht(x + .5, y + 3, 9, NAT_G2, 1);
  K.form(m, 0, { k: BLECH.slice(0, 4), r: RAND_D, ton: 1.6, fase: 0, rand: 1, L: [0, -1] });
  K.rect(x - 1, y + 2, 3, 2, NAT); K.set(x, y + 2, NAT_K); K.set(x, y + 3, NAT_K); K.set(x, y + 4, NAT);
  K.lichtquelle(x + .5, y + 3);
}
// Stehende Blechdose: Fuß (x, yb), Radius r, Höhe h; Glanz von der Lichtseite lx (-1 links / +1 rechts)
function dose(K, x, yb, r, h, o) {
  o = o || {}; const { B } = K, lx = o.lx === undefined ? 1 : o.lx, cols = (o.k || DOSE).map(c => B.pk(c));
  const top = yb - h, ry = Math.max(1, r * .38);
  for (let yy = Math.floor(top); yy <= yb; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) {
    const u = (xx + .5 - x) / r; if (Math.abs(u) > 1) continue;
    const yUnten = yb - ry + ry * Math.sqrt(1 - u * u); if (yy > yUnten) continue;
    let t = .6 + u * lx * .9 - Math.abs(u) * .5 + (o.hell || 0);
    if (Math.abs(u * lx - .45) < .14) t += 1.2;                      // Glanzstreif
    if (yy === Math.floor(top + 1) || yy === Math.floor(yb - 1)) t -= .6; // Falze
    t = Math.max(0, Math.min(cols.length - 1.001, t * (cols.length - 1) / 2));
    const k = Math.floor(t); K.e.set(xx, yy, cols[Math.min(cols.length - 1, (t - k) > B.bay(xx, yy) ? k + 1 : k)]);
  }
  for (let yy = Math.floor(top - ry); yy <= top + ry; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) {
    const q = ((xx + .5 - x) / r) ** 2 + ((yy + .5 - top) / ry) ** 2; if (q > 1) continue;
    K.e.set(xx, yy, q > .55 ? cols[Math.min(cols.length - 1, 3 + (o.hell > 0 ? 1 : 0))] : cols[2]);
  }
}
// Liegende Dose, Boden zum Betrachter: Mitte (x, y), Radius r, Länge l nach rechts hinten
function doseLiegend(K, x, y, r, l, o) {
  o = o || {}; const { B } = K, cols = DOSE.map(c => B.pk(c));
  for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x); xx <= x + l; xx++) {
    const v = (yy + .5 - y) / r; if (Math.abs(v) > 1) continue;
    let t = .9 - v * 1.1 + (Math.abs(v + .5) < .16 ? 1.4 : 0) - (xx - x) / l * .4;
    if ((xx - x) % 4 === 0) t -= .5;
    t = Math.max(0, Math.min(3.999, t * 2)); const k = Math.floor(t); K.e.set(xx, yy, cols[(t - k) > B.bay(xx, yy) ? k + 1 : k]);
  }
  const rx = r * .45;
  for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - rx); xx <= x + rx; xx++) {
    const q = ((xx + .5 - x) / rx) ** 2 + ((yy + .5 - y) / r) ** 2; if (q > 1) continue;
    K.e.set(xx, yy, q > .6 ? cols[(yy < y) ? 4 : 3] : cols[q < .2 ? 3 : 2]);
  }
}

// Sitzende Gestalt von hinten, über das Band gebeugt, Kopftuch: Sitzmitte (x, ys), Größe s
function ruecken(K, x, ys, s, o) {
  o = o || {}; const m = K.maske(), lean = o.lean || 0;
  m.ell(x, ys, 9 * s, 3.2 * s);                                                     // Rock auf dem Schemel
  m.poly([[x - 9 * s, ys], [x - 5.5 * s + lean, ys - 9 * s], [x + 5.5 * s + lean, ys - 9 * s], [x + 9 * s, ys]]); // Hüfte, Taille
  m.ell(x + lean, ys - 12 * s, 6.5 * s, 5 * s);                                      // Rücken
  m.ell(x + lean, ys - 16 * s, 7 * s, 2.8 * s);                                      // Schultern
  m.kap(x - 6 * s + lean, ys - 15 * s, x - 8.5 * s + lean, ys - 9 * s, 2 * s, 1.8 * s); m.kap(x + 6 * s + lean, ys - 15 * s, x + 8.5 * s + lean, ys - 9 * s, 2 * s, 1.8 * s); // Oberarme, Ellbogen nach außen
  const kx = x + lean * 1.3, ky = ys - 21 * s;
  m.ell(kx, ky, 3.4 * s, 3.6 * s);                                                  // Kopf im Tuch
  m.poly([[kx - 3.3 * s, ky + 1 * s], [kx + 3.3 * s, ky + 1 * s], [kx, ys - 13 * s]]);  // Tuchzipfel im Nacken
  m.kap(x - 6 * s, ys + 2 * s, x - 7 * s, ys + 16 * s, .9, .9); m.kap(x + 6 * s, ys + 2 * s, x + 7 * s, ys + 16 * s, .9, .9);
  return m;
}

module.exports = {
  biom: 'fabrik',
  bilder: {
    // Eine Stempeluhr unter einer Glühbirne am Fabriktor, der Kartenkasten offen, eine Karte steht ein Stück heraus.
    fabrik_stempeluhr(K) {
      const { B } = K;
      // Ziegelpfeiler links und Mitte, rechts das genietete Tor
      K.mauer(0, 0, 112, 90, ZIEGEL, { hoehe: 4, breite: 9, ton: .42, tf: (x, y) => (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .2 });
      const tor = K.maske(); tor.rect(112, 0, 48, 90);
      K.form(tor, 0, { k: BLECH.slice(0, 5), r: RAND_D, ton: 1.5, rand: 1, L: [-1, 0], muster: (x, y) => ((x - 112) % 12 === 0 ? -.8 : 0) + ((y % 10 === 2 && (x - 112) % 12 === 3) || (y % 10 === 2 && (x - 112) % 12 === 9) ? 1.2 : 0) + (B.fbm(x * .1, y * .1, 4, 2) - .5) * .5 });
      const pf = K.maske(); pf.rect(106, 0, 7, 90); K.form(pf, 0, { k: ROST, ton: 1.6, rand: 1, r: RAND_D, L: [-1, 0] });
      // Boden
      K.feld(0, 82, 160, 90, BODEN, (x, y) => .4 + (y - 82) / 30);
      // Die Stempeluhr: Holzgehäuse mit Zifferblatt oben, Druckhebel, Schlitz
      const ux = 54, uy = 22, uw = 26, uh = 36;
      const geh = K.maske(); geh.rect(ux - uw / 2, uy, uw, uh); geh.poly([[ux - uw / 2 - 1, uy], [ux, uy - 5], [ux + uw / 2 + 1, uy]]);
      K.form(geh, 0, { k: HOLZ, r: NATKANTE, ton: 2.2, schatten: 2, muster: (x, y) => ((x === ux - uw / 2 + 2 || x === ux + uw / 2 - 3) ? -.6 : 0) + (y === uy + 22 ? -1 : 0) });
      const zb = K.maske(); zb.ell(ux, uy + 9, 7.5, 7.5);
      K.form(zb, 0, { k: ['#3a3424', '#7a6e52', '#bcb08c', '#e8dfc0'], r: ['#a08a50', '#fff2c4'], ton: 2.6, fase: 1, L: [0, -1] });
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; K.set(ux + Math.cos(a) * 6, uy + 9 + Math.sin(a) * 6, '#2a2418'); }
      K.linie(ux, uy + 9, ux + 3, uy + 4, '#1a140c'); K.linie(ux, uy + 9, ux - 1, uy + 13, '#1a140c'); K.set(ux, uy + 9, '#8a2a1a');
      K.rect(ux - 6, uy + 24, 12, 2, '#000000');
      const hebel = K.maske(); hebel.kap(ux + uw / 2, uy + 26, ux + uw / 2 + 6, uy + 20, 1, 1); hebel.ell(ux + uw / 2 + 6, uy + 20, 1.8, 1.8);
      K.form(hebel, 0, { k: BLECH, r: NATKANTE, ton: 2, rand: 1, fase: 0 });
      // Kartenkasten darunter: Fächer, Tür offen nach links
      const kx = ux - 15, ky = 62, kw = 30, kh = 18;
      const kas = K.maske(); kas.rect(kx, ky, kw, kh); K.form(kas, 0, { k: HOLZ, r: RAND_D, ton: 1.6, schatten: 2 });
      K.rect(kx + 2, ky + 2, kw - 4, kh - 4, '#050302');
      const tuer = K.maske(); tuer.poly([[kx, ky], [kx - 8, ky + 2], [kx - 8, ky + kh + 1], [kx, ky + kh]]);
      K.form(tuer, 0, { k: HOLZ, r: RAND_D, ton: 1.4, rand: 1, L: [1, 0] });
      // Karten in den Fächern: Oberkanten, eine steht weit heraus
      for (let i = 0; i < 6; i++) { const x = kx + 3 + i * 4; K.rect(x, ky + 5, 3, 1, PAPIER[1]); K.rect(x, ky + 11, 3, 1, PAPIER[0]); }
      const karte = K.maske(); karte.rect(kx + 15, ky - 9, 3, 15);
      // Licht: Birne über dem Ganzen
      birne(K, ux + 2, 7, { hof: 76 });
      K.form(karte, 0, { k: PAPIER.slice(1), r: ['#e0d4b0', '#fff2c4'], ton: 2.6, rand: 1, fase: 0, L: [0, -1] });
      K.set(kx + 16, ky - 5, '#3a2a18'); K.set(kx + 16, ky - 3, '#3a2a18'); K.set(kx + 16, ky - 1, '#8a2a1a');
      K.vignette(.7, { cx: 60 });
    },

    // Ein leerer Schemel zwischen zwei gebeugten Rücken in Kopftüchern, auf dem Band davor eine Reihe blanker Dosen.
    fabrik_platz(K) {
      const { B } = K;
      // Kachelwand hinten, im Lampenlicht
      K.feld(0, 0, 160, 50, KACHEL, (x, y) => .45 + ((y % 6 === 0 || x % 8 === 0) ? -.2 : 0) + (B.hash(x >> 3, y / 6 | 0, 3) - .5) * .1 - y / 260);
      // Band: Gurt und Gestell, quer durchs Bild
      const band = K.maske(); band.rect(0, 50, 160, 4); band.rect(0, 54, 160, 3);
      K.form(band, 0, { k: BLECH, r: RAND_D, ton: 2, rand: 1, L: [0, -1], muster: (x, y) => (y >= 54 ? -1 : 0) + (y === 51 ? .4 : 0) });
      for (let x = 10; x < 160; x += 28) { const b = K.maske(); b.rect(x, 57, 2, 33); K.form(b, 0, { k: BLECH.slice(0, 4), ton: 1, rand: 0 }); }
      K.feld(0, 76, 160, 90, BODEN, (x, y) => .25 + (y - 76) / 50);
      // Dosen auf dem Band, blank, in Reihe
      for (let x = 7; x < 160; x += 11) dose(K, x, 51, 3.4, 8, { lx: x < 80 ? 1 : -1 });
      // Lampe darüber, Mitte
      birne(K, 80, 8, { hof: 92, oval: 1 });
      // Die beiden Frauen und der leere Schemel dazwischen
      const f1 = ruecken(K, 36, 74, 1.55, { lean: 1.5 }), f2 = ruecken(K, 124, 74, 1.55, { lean: -1.5 });
      const s0 = K.maske(); s0.ell(80, 72, 8, 2.2); s0.rect(72, 72, 16, 2); s0.kap(74, 74, 72, 89, 1, 1); s0.kap(86, 74, 88, 89, 1, 1); s0.kap(80, 74, 80, 87, .9, .9);
      K.form(f1, 0, { k: DUNKEL, ton: 1.2, rand: 0 });
      K.form(f2, 0, { k: DUNKEL, ton: 1.2, rand: 0 });
      K.form(s0, 0, { k: HOLZ, r: NATKANTE, ton: 2.2, rand: 2, L: [0, -1], schatten: 1 });
      K.kante(f1, 80, 11, 90, NATKANTE, { nah: .5, min: .3 });
      K.kante(f2, 80, 11, 90, NATKANTE, { nah: .5, min: .3 });
      // Messer auf dem Band vor dem leeren Platz
      K.linie(73, 49, 81, 49, '#a8aca0'); K.set(79, 49, '#e8e4d0'); K.linie(82, 49, 86, 49, '#523e2a');
      K.vignette(.65, { cy: 50 });
    },

    // Eine einzelne blanke Dose auf nassen Fliesen, dahinter der Dosenturm mit einer Lücke in der untersten Reihe.
    fabrik_dose(K) {
      const { B } = K;
      K.feld(0, 0, 160, 50, KACHEL, (x, y) => .3 - y / 300 + ((y % 7 === 0 || x % 9 === 0) ? -.18 : 0));
      // Nasse Fliesen in Aufsicht, mit Spiegelglanz
      K.pflaster(48, 90, BODEN, { vx: 80, ton: .38, dichte: 2.2 });
      // Dosenturm: Pyramide, unterste Reihe mit Lücke
      const tx = 100, tb = 56, r = 4.5, h = 10, reihen = 5;
      const turm = [];
      for (let j = 0; j < reihen; j++) { const n = reihen - j; for (let i = 0; i < n; i++) { if (j === 0 && i === 2) continue; turm.push([tx - (n - 1) * r + i * 2 * r, tb - j * h]); } }
      // von hinten oben nach vorne zeichnen
      turm.sort((a, b) => a[1] - b[1]);
      for (const [x, y] of turm) dose(K, x, y, r - .2, h - 1, { lx: -1, hell: -.15 });
      // Lücke: schwarzes Dunkel unter der zweiten Reihe
      K.rect(Math.round(tx - 4 * r + 4 * r - r + 1), tb - h + 2, Math.round(2 * r - 2), h - 2, '#020302');
      // Lampe oben links
      birne(K, 40, 8, { hof: 0 });
      K.licht(40, 30, 90, NAT_G, .8, { oval: .9 });
      // Die einzelne Dose, liegend auf den Fliesen, und ihr Spiegelbild
      const lx = 46, ly = 70;
      doseLiegend(K, lx, ly, 5, 13);
      for (let yy = ly + 6; yy < ly + 14; yy++) for (let xx = lx - 2; xx <= lx + 13; xx++) { const q = (yy - ly - 6) / 8; if (B.bay(xx, yy) < (1 - q) * .5 && (xx + yy) % 2 === 0) K.set(xx, yy, q < .4 ? '#6a706a' : '#3a403c'); }
      K.licht(lx + 2, ly, 22, NAT_G2, .8);
      K.set(lx - 1, ly - 3, NAT_K); K.set(lx, ly - 4, '#fff8e0');
      // Pfütze unter dem Turm: Glanzlinien
      // Spiegelung des Turms in den nassen Fliesen: gebrochene, dunklere Streifen
      for (let y = tb + 1; y < tb + 22; y++) for (let x = tx - 5 * r; x <= tx + 5 * r; x++) { const sy = 2 * tb - y, q = K.get(x, sy); if (!(q >>> 24) || (y - tb) % 3 === 2) continue; const c = B.unpk(q); if (c[0] + c[1] + c[2] < 180) continue; if (B.bay(x, y) < .55 - (y - tb) / 40) K.set(x, y, (y - tb) < 8 ? '#3a403c' : '#1a251e'); }
      for (const [x, y] of [[30, 62], [64, 80], [120, 74], [140, 84], [24, 84]]) { K.set(x, y, '#3e5747'); K.set(x + 1, y, '#566e5c'); }
      K.vignette(.75, { cx: 70 });
    },

    // Ein Spalt aus kaltem Licht in einer gepolsterten Tür, dahinter ein Mann mit Melone zwischen gestapelten Fischkisten.
    fabrik_kuehlhaus(K) {
      const { B } = K;
      // Wand: Kacheln, Boden
      K.feld(0, 0, 160, 80, KACHEL, (x, y) => .28 + ((y % 6 === 0 || x % 8 === 0) ? -.15 : 0));
      K.feld(0, 80, 160, 90, BODEN, (x, y) => .3 + (y - 80) / 30);
      // Türöffnung: innen kaltes Licht, Nebel, Kistenstapel, der Mann
      const ox0 = 72, ox1 = 104, oy0 = 8, oy1 = 82;
      K.feld(ox0, oy0, ox1, oy1, KALT, (x, y) => .55 + (1 - Math.abs(y - 40) / 50) * .25 - (y > 66 ? .2 : 0) + (B.fbm(x * .1, y * .05, 3, 2) - .5) * .2);
      const kis = K.maske(); for (let j = 0; j < 6; j++) { kis.rect(ox0 - 2, 70 - j * 10, 12, 9); kis.rect(ox1 - 9, 74 - j * 9, 12, 8); }
      K.form(kis, .1, { k: ['#0c1820', '#1a2e3c', '#2c4a5e', '#466a82'], r: ['#7a9ab0', '#cfe6ff'], ton: 1.4, rand: 1, L: [0, -1], muster: (x, y) => (y % 9 === 0 ? -.8 : 0) + ((y % 9 === 3) && x % 2 ? .6 : 0) });
      // der Mann, sitzend auf einer Kiste, Melone auf den Knien
      const sitz = K.maske(); sitz.rect(80, 66, 16, 12); K.form(sitz, .05, { k: ['#0c1820', '#1a2e3c', '#2c4a5e', '#466a82'], r: ['#7a9ab0', '#cfe6ff'], ton: 1.6, rand: 1, L: [0, -1], muster: (x, y) => (y === 71 ? -.8 : 0) });
      const mann = K.figurMaske(90, 80, 40, { haltung: 'sitzen', blick: -1, kopf: 'kahl', arme: [[80, 64], [82, 65]], ellbogen: [[85, 60], [87, 61]], weit: .9 });
      const [mkx, mky] = mann.kopf; mann.kap(mkx - 5, mky - 2.4, mkx + 5, mky - 2.4, .8, .8); mann.ell(mkx, mky - 3.4, 3.4, 3);   // Melone
      K.form(mann, 0, { k: ['#03050a', '#070c12', '#0c141c', '#121c26'], r: [], ton: .6, rand: 0 });
      // Reif an der Kante des Spalts
      for (let y = oy0; y < oy1; y++) { if (B.hash(1, y, 3) < .5) K.set(ox0, y, '#f4faff'); if (B.hash(2, y, 3) < .3) K.set(ox1 - 1, y, '#cfe6ff'); }
      // Die gepolsterte Tür links: Rauten, Knöpfe, steht einen Spalt offen
      const tuer = K.maske(); tuer.rect(14, 6, 58, 78);
      K.form(tuer, 0, { k: ['#0a0c08', '#141810', '#20261a', '#2e3626', '#3e4834'], r: ['#3a5a70', '#7a9ab0'], ton: 2, rand: 1, L: [1, 0], muster: (x, y) => { const u = (x - 14 + y - 6) % 10, v = (x - 14 - (y - 6) + 100) % 10; return (u < 1 || v < 1 ? -1 : 0) + ((u > 4 && u < 6 && v > 4 && v < 6) ? -.8 : 0) + (Math.min(u, 10 - u, v, 10 - v) > 3 ? .5 : 0); } });
      const zarge = K.maske(); zarge.rect(8, 2, 6, 84); zarge.rect(104, 2, 6, 84); zarge.rect(8, 2, 102, 5);
      K.form(zarge, 0, { k: BLECH.slice(0, 5), r: RAND_D, ton: 1.6, rand: 1 });
      // Klinke mit Reif
      const kl = K.maske(); kl.rect(64, 44, 3, 6); kl.kap(65, 46, 58, 47, 1, 1);
      K.form(kl, 0, { k: BLECH, r: ['#7a9ab0', '#f4faff'], ton: 2.4, rand: 2, fase: 0, L: [1, 0] });
      for (const [x, y] of [[59, 46], [61, 48], [64, 44], [66, 50]]) K.set(x, y, '#f4faff');
      // Kaltes Licht fällt aus dem Spalt auf Boden und Tür
      K.licht(88, 82, 50, '#1e3444', .9, { maske: (x, y) => y > oy1 || x < ox0 - 1 || x > ox1, oval: 2.2 });
      K.licht(72, 44, 26, '#1e3444', .7, { maske: (x, y) => x < ox0 });
      K.lichtquelle(88, 40);
      K.vignette(.75, { cx: 88 });
    },

    // Ein Hof im Natriumlicht, knietief in Rauch, der vom Schornstein herabfließt; im Rauch glimmen Lichter von unten.
    fabrik_rauch(K) {
      const { B } = K;
      // Dunstiger Himmel, über den Dächern ein schwacher Schein der Stadt
      K.himmel(70, ['#050605', '#080a07', '#0d0f0a', '#13150d', '#1a1c10', '#232412', '#2e2e16', '#3a3a1c'], { steil: .8, basis: .25, gx: 60, gb: 60 });
      // Hallen links und rechts, Ziegel mit Fenstern
      const hl = K.maske(); hl.poly([[0, 30], [34, 38], [34, 90], [0, 90]]);
      K.form(hl, 0, { k: ZIEGEL, r: RAND_D, ton: 1.5, rand: 1, muster: (x, y) => (y % 4 === 0 ? -.4 : 0) });
      const hr = K.maske(); hr.poly([[120, 40], [160, 30], [160, 90], [120, 90]]);
      K.form(hr, 0, { k: ZIEGEL, r: NATKANTE, ton: 1.8, rand: 1, L: [-1, 0], muster: (x, y) => (y % 4 === 0 ? -.4 : 0) });
      for (const [x, y] of [[6, 46], [20, 48], [136, 50], [150, 48]]) K.rect(x, y, 6, 10, '#050403');
      // Schornstein: hoch, konisch, als Silhouette vor dem Dunst
      const sx = 62, sch = K.maske(); sch.poly([[sx - 5, 4], [sx + 5, 4], [sx + 8, 70], [sx - 8, 70]]); sch.rect(sx - 6.5, 3, 13, 3);
      K.form(sch, 0, { k: ['#040303', '#080605', '#0e0a08', '#160f0b'], r: RAND_D, ton: 1.2, rand: 1, L: [1, 0], muster: (x, y) => (y % 12 === 0 ? -.6 : 0) });
      // Hofboden
      K.feld(0, 66, 160, 90, HOF, (x, y) => .18 + (y - 66) / 70);
      // Lichter tief im Rauch: ein zweiter Hof darunter
      const lichter = [[22, 84], [48, 80], [90, 86], [112, 79], [140, 85]];
      // Rauch: quillt oben über den Rand, fließt am Schornstein herab und liegt knietief auf dem Hof
      const oben = y => 64 + Math.sin(y) * 0;
      const dichte = (x, y) => {
        // zwei Vorhänge, die außen am Schaft herabfließen und unten breiter werden
        const halb = 5 + (y - 4) * 3 / 66, dick = 2 + Math.max(0, y - 4) * .1;
        let v = 0;
        if (y > 1 && y < 72) for (const sd of [-1, 1]) { const kante = sx + sd * (halb + dick * .7 + Math.sin(y * .2 + sd) * .8); v = Math.max(v, Math.exp(-(((x - kante) / dick) ** 2)) * .95); }
        if (y < 8) v = Math.max(v, Math.exp(-(((x - sx) / 10) ** 2)) * Math.max(0, (8 - y) / 6) * .8 * (Math.abs(x - sx) > 4 ? 1 : .4));   // quillt über den Rand
        const flaeche = 66 + Math.sin(x * .09) * 1.5 + B.fbm(x * .04, 0, 4, 2) * 3 - Math.exp(-(((x - sx) / 22) ** 2)) * 4;
        if (y > flaeche) v = Math.max(v, Math.min(1, (y - flaeche) / 3) * .95);
        return v * (.55 + .6 * B.fbm(x * .06, y * .1, K.seed, 3)) * (oben(y) ? 1 : 1);
      };
      for (const [x, y] of lichter) K.licht(x, y, 18, '#2a3410', .9, { oval: 1.5 });
      K.dith(0, 0, 160, 90, RAUCH[1], (x, y) => dichte(x, y) * 1.2);
      K.dith(0, 0, 160, 90, RAUCH[2], (x, y) => dichte(x, y) - .2);
      K.dith(0, 0, 160, 90, RAUCH[3], (x, y) => (dichte(x, y) - .45) * 1.4);
      for (const [x, y] of lichter) { K.licht(x, y, 12, '#2e3a12', 1, { oval: 1.4 }); K.set(x, y, '#c8d8b0'); K.set(x - 1, y, '#5a7a3a'); K.set(x + 1, y, '#5a7a3a'); K.set(x, y - 1, '#5a7a3a'); }
      // Natriumlampe am Ausleger rechts: die eine helle Stelle, sie färbt den Rauch
      const a = K.maske(); a.kap(120, 44, 104, 44, .8, .8); a.kap(120, 51, 110, 44, .5, .5); a.kap(104, 44, 104, 47, .4, .4);
      K.form(a, 0, { k: ROST, ton: 1.4, rand: 0 });
      K.licht(104, 52, 76, NAT_G, 1, { oval: .9 });
      K.licht(104, 50, 12, NAT_G2, 1);
      const sch2 = K.maske(); sch2.poly([[99, 50], [102, 47], [106, 47], [109, 50]]); K.form(sch2, 0, { k: BLECH, ton: 1.4, rand: 0 });
      K.rect(103, 50, 3, 1, NAT); K.set(104, 50, NAT_K); K.set(104, 51, NAT);
      K.kegel(104, 51, Math.PI / 2, .45, 30, '#5a400e', .7);
      K.vignette(.65, { cx: 84 });
    },

    // Fischkisten unter einer Lampe, Eis und Hering, an einer Kiste ein Zettel mit einem Bootsnamen.
    fabrik_annahme(K) {
      const { B } = K;
      K.feld(0, 0, 160, 90, BODEN, (x, y) => .25 + (y > 30 ? (y - 30) / 140 : 0) + ((y < 30 && (y % 6 === 0 || x % 8 === 0)) ? -.12 : 0));
      // Hinten im Dunkel: gestapelte Kisten
      for (const [x, y, w] of [[0, 10, 34], [0, 22, 34], [126, 14, 34], [126, 26, 34], [30, 26, 30]]) { const m = K.maske(); m.rect(x, y, w, 11); K.form(m, .2, { k: HOLZ.slice(0, 4), ton: 1.2, rand: 1, r: RAND_D, muster: (px, py) => ((py - y) % 4 === 0 ? -.8 : 0) }); }
      // Die große Kiste vorn, schräg von oben: Innenraum mit drei Reihen Hering auf Eis
      const x0 = 18, x1 = 142, y0 = 36, y1 = 66;
      K.feld(x0, y0, x1, y1, ['#060c10', '#0c1820', '#16283a', '#284660', '#4a6e88'], (x, y) => .16 + (B.hash(x >> 1, y >> 1, 3) < .2 ? .25 : 0) + (B.hash(x, y, 4) < .02 ? .45 : 0));
      const hering = (x, y, l, d) => {
        const f = K.maske();
        f.poly([[x - d * l / 2, y], [x - d * l * .2, y - 2.2], [x + d * l * .3, y - 2], [x + d * l / 2, y], [x + d * l * .3, y + 1.8], [x - d * l * .25, y + 1.6]]);
        f.poly([[x - d * l / 2 + d, y], [x - d * (l / 2 + 3), y - 2.4], [x - d * (l / 2 + 3), y + 2.4]]);
        K.form(f, 0, { k: ['#0e1418', '#24323a', '#4a5e68', '#8098a4', '#c4d6de'], r: ['#c4d6de', '#eef6fa'], ton: 2.5, rand: 1, fase: 0, L: [0, -1], muster: (px, py) => (py < y - .5 ? -1.6 : py > y + .5 ? .4 : 0) });
        K.set(x + d * (l / 2 - 3), y - .6, '#000000'); K.set(x + d * (l / 2 - 3) - d, y - .6, '#8098a4');
        K.set(x + d * (l / 2 - 5), y + .4, '#24323a');
      };
      const r = B.rng(9);
      for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) hering(x0 + 14 + i * 20 + (j & 1) * 8 + r.j(1.2), y0 + 5 + j * 7 + r.j(.6), 18, ((i + j) & 1) ? 1 : -1);
      // Eisbrocken zwischen den Fischen
      for (let i = 0; i < 40; i++) { const x = r.f(x0 + 3, x1 - 3), y = r.f(y0 + 2, y1 - 2); const q = K.get(x, y), c = B.unpk(q); if (c[2] > 120) continue; K.set(x, y, '#7a9ab0'); K.set(x + 1, y, '#cfe6ff'); K.set(x, y + 1, '#3a5a70'); }
      // Kastenwände: hinten schmal, vorn die Bretterwand
      const w = K.maske(); w.rect(x0 - 3, y0 - 3, x1 - x0 + 6, 3); w.rect(x0 - 3, y0, 3, y1 - y0); w.rect(x1, y0, 3, y1 - y0); w.rect(x0 - 3, y1, x1 - x0 + 6, 20);
      K.form(w, 0, { k: HOLZ, r: RAND_D, ton: 2.1, rand: 1, schatten: 2, L: [0, -1], muster: (x, y) => (y > y1 && (y - y1) % 6 === 0 ? -1 : 0) + (B.rausch2(x * .1, y * 2, 5) - .5) * .4 });
      // Lampe darüber
      birne(K, 80, 4, { hof: 0 });
      K.licht(80, 40, 80, NAT_G, .9, { oval: 1.3 });
      // Zettel mit Bootsnamen vorn an der Kiste, mit einem Reißnagel
      const z = K.maske(); z.poly([[66, 70], [92, 69], [93, 80], [67, 81]]);
      K.form(z, 0, { k: PAPIER, r: ['#e0d4b0', '#fff2c4'], ton: 3.1, rand: 1, fase: 0, L: [0, -1] });
      K.schrift(70, 73, 90, '#2a2418', { min: 2, max: 4 }); K.schrift(71, 77, 84, '#5a4a30', { min: 1, max: 3 });
      K.set(79, 70, '#8a2a1a');
      K.vignette(.7, { cy: 50 });
    },

    // Eine braune Lohntüte auf dem Brett eines Spindes, daneben ein Paar Gummistiefel, die nass sind.
    fabrik_lohn(K) {
      const { B } = K;
      // Umkleide: Kachelwand, Boden
      K.feld(0, 0, 160, 80, KACHEL, (x, y) => .22 + ((y % 6 === 0 || x % 8 === 0) ? -.12 : 0));
      K.feld(0, 80, 160, 90, BODEN, (x, y) => .3 + (y - 80) / 30);
      // Reihe Spinde: links zu, Mitte offen, rechts zu
      const spind = (x, w, auf) => {
        const m = K.maske(); m.rect(x, 6, w, 76);
        K.form(m, 0, { k: BLECH.slice(0, 5), r: RAND_D, ton: 1.5, rand: 1, L: [-1, -.2], muster: (px, py) => (!auf && py > 12 && py < 22 && py % 2 === 0 && px > x + 4 && px < x + w - 4 ? -1 : 0) + (B.fbm(px * .1, py * .1, 3, 2) - .5) * .4 });
        if (auf) K.rect(x + 2, 8, w - 4, 72, '#020302');
      };
      spind(4, 30, false); spind(118, 30, false);
      const sx = 46, sw = 54; spind(sx, sw, true);
      // Innenraum: Rückwand dunkel, Brett oben
      K.feld(sx + 2, 8, sx + sw - 2, 80, BLECH.slice(0, 3), (x, y) => .2 + (x - sx) / sw * .3);
      const brett = K.maske(); brett.rect(sx + 2, 28, sw - 4, 3);
      K.form(brett, 0, { k: BLECH, r: NATKANTE, ton: 2, rand: 1, L: [-.5, -1] });
      // Haken mit Jacke-Schatten rechts
      const jacke = K.maske(); jacke.poly([[86, 33], [94, 33], [97, 58], [84, 60]]); K.form(jacke, 0, { k: DUNKEL, ton: 1.5, rand: 0 });
      // Lohntüte auf dem Brett
      const lt = K.maske(); lt.poly([[56, 27], [58, 18], [78, 17], [80, 27]]);
      // Gummistiefel unten, nass
      const st = K.maske();
      const stiefel = (x, spitze) => { st.rect(x, 50, 9, 26); st.ell(x + 4.5, 50, 4.5, 1.6); st.poly([[x, 72], [x + 9, 72], [x + 9 + spitze, 75], [x + 9 + spitze, 79], [x, 79]]); st.ell(x + 9 + spitze - 1, 77, 2, 2); };
      stiefel(57, 6); stiefel(72, 7);
      // Spindtür offen nach rechts, perspektivisch
      const td = K.maske(); td.poly([[sx + sw, 6], [sx + sw + 16, 2], [sx + sw + 16, 86], [sx + sw, 82]]);
      K.form(td, 0, { k: BLECH.slice(0, 5), r: RAND_D, ton: 1.3, rand: 1, L: [-1, 0], muster: (x, y) => (y > 14 && y < 26 && y % 2 === 0 && x > sx + sw + 3 ? -1 : 0) });
      // Licht von links (Deckenlampe außerhalb) fällt hinein auf Tüte und Stiefel
      K.licht(50, 22, 56, NAT_G, .9, { ohne: td });
      K.licht(54, 64, 40, '#1c1608', .8, { ohne: st });
      K.lichtquelle(30, 20);
      K.form(st, 0, { k: ['#030403', '#080a09', '#101412', '#1a201c', '#26302a'], r: ['#6a706a', '#e8e4d0'], ton: 2, rand: 2, L: [-.9, -.4], muster: (x, y) => ((x === 59 || x === 74) && y > 52 && y < 72 ? 1.6 : 0) + ((x === 60 || x === 75) && y > 56 && y < 70 && y % 3 ? 1 : 0) + (y === 72 ? -.8 : 0) });
      for (const x of [61, 76]) K.rect(x - 3, 49, 7, 2, '#000000');
      K.form(lt, 0, { k: ['#2a1a0c', '#5a3a1a', '#8a5e2e', '#b88a48', '#dcb070'], r: ['#e8c080', '#fff2c4'], ton: 2.6, rand: 2, L: [-1, -.4], muster: (x, y) => (y === 20 ? -1 : 0) + (x > 66 && x < 72 && y > 21 && y < 25 ? .8 : 0) });
      K.schrift(60, 23, 70, '#2a1a0c', { min: 2, max: 3 });
      // Nässe: Tropfen und Pfütze
      for (const [x, y] of [[62, 60], [77, 64], [64, 70], [79, 56]]) { K.set(x, y, '#e8e4d0'); K.set(x, y + 1, '#6a706a'); }
      for (let x = 54; x < 92; x++) if (Math.sin(x * .9) > -.2) K.set(x, 80, x < 70 ? '#566e5c' : '#2e4336');
      K.set(68, 81, '#a8aca0'); K.set(70, 82, '#566e5c');
      K.vignette(.7, { cx: 70 });
    },
  },
};
