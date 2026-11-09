// Ereignisbilder 160 × 90 · Die Station, die nie eröffnet wurde (data/biome/station.json).
// Palette der Station (prototype/js/scenes/world/station.js): weiße Wandkacheln mit grünem Sockel, Emailblau,
// Messing, Ziegel und Mörtel der vermauerten Ausfahrt; die helle Stelle ist jeweils eine Bogenlampe (kaltes
// Weißviolett), ein Fahrschein oder der Tunnelmund.
'use strict';

const KACHEL = ['#0d1114', '#141a1d', '#1b2326', '#232d30', '#2d383a', '#384446', '#455152', '#545f5f', '#656f6d', '#79817e', '#8e958f', '#a5aaa3'];
const GRUEN = ['#040a08', '#07110d', '#0b1914', '#10221b', '#162d24', '#1d392e', '#25463a'];
const EMAIL = ['#0c1638', '#13214f', '#1b2e6a', '#243c86', '#2f4ea4'];
const DUNKEL = ['#030406', '#06080b', '#0a0d12', '#0f141b', '#151c25', '#1c2530'];
const HOLZ = ['#0a0705', '#140e0a', '#1e150f', '#2a1d14', '#382819', '#48331f'];
const MESSING = ['#30230c', '#4a3614', '#6a4f20', '#8c6c30', '#b08e48', '#d2b46e'];
const ZIEGEL = ['#0b0807', '#130e0c', '#1c1512', '#251c18', '#30251f', '#3c2f27', '#4a3a30'];
const MOERTEL = ['#3c3b35', '#504e46', '#666358', '#7e7a6c', '#9a9686'];
const STEIN = ['#07080a', '#0c0e11', '#121519', '#191d22', '#21262c', '#2a3037', '#343b43', '#3f474f'];
const LAMPE = '#e8f0ff', LAMPE_K = '#ffffff', LAMPE_G = '#1c2236', LAMPE_G2 = '#3a4670', LAMPE_M = '#a8b8e8';
const FIG = ['#04060a', '#0a0f19', '#131b2a', '#1f2c41'], FIG_R = ['#a83a50', '#ffb4b8'], KANTE = ['#7c8ca6', '#e6eeff'];
const PAPIER = ['#5a5e58', '#8a8e84', '#c8ccc0', '#eef0e6'];

// Kachelwand: Fliesen 6 × 3, Fugen eine Stufe dunkler; licht = [x, y, r, stärke]
function kacheln(K, x0, y0, x1, y1, ton, licht) {
  const { B } = K, n = KACHEL.length - 1;
  // flache Stufen statt Rauschen: Grundstufe aus ton, Licht in ganzen Stufen, Fuge eine Stufe dunkler
  K.feld(x0, y0, x1, y1, KACHEL, (x, y) => {
    const row = Math.floor((y - y0) / 5), off = row % 2 ? 5 : 0, fuge = ((y - y0) % 5) === 4 || ((x + off) % 10) === 9;
    let l = 0; if (licht) for (const [lx, ly, lr, ls] of licht) l += Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * 1.1) / lr) * ls;
    const tl = Math.floor(l * 6), st = Math.round(ton * n) + tl + (B.hash(Math.floor((x + off) / 10), row, K.seed) < .1 ? -1 : 0) - (fuge ? (tl > 1 ? 2 : 1) : 0) + (!fuge && ((y - y0) % 5) === 0 && ((x + off) % 10) === 8 && tl > 1 ? 1 : 0);
    return Math.max(0, Math.min(n, st)) / n + .001;
  });
}
function sockel(K, y0, y1, ton) {
  const { B } = K;
  K.feld(0, y0, 160, y1, GRUEN, (x, y) => { if (y === y0) return .8; const fuge = ((y - y0) % 4) === 3 || (x % 4) === 3; return (ton || .35) - (y - y0) / (y1 - y0) * .2 + (fuge ? -.12 : 0) + (B.hash(x >> 2, y >> 2, 4) - .5) * .08; });
}
// Bogenlampe: Kugel an einer Stange, die helle Stelle des Bildes
function lampe(K, x, y, r, st) {
  const s = K.maske(); s.kap(x, 0, x, y - 3, .6, .6); K.form(s, 0, { k: DUNKEL.slice(0, 4), r: KANTE, ton: 1.2, fase: 0, rand: 1 });
  K.licht(x, y, (r || 60) * .7, LAMPE_G2, (st === undefined ? .9 : st) * .55, { exp: 2.2 });
  const k = K.maske(); k.ell(x, y, 2.6, 3); K.form(k, 0, { k: [LAMPE_G2, '#56628a', LAMPE_M, LAMPE], ton: 2.4, fase: 1, rand: 0 });
  K.set(x, y - 1, LAMPE_K); K.set(x + 1, y - 1, LAMPE_K);
}
// Zeichen wie auf dem Emailschild: Striche in Zellen, keine lesbare Schrift
function zeichen(K, x, y, w, h, n, seed, col, roh) {
  const r = K.B.rng(seed);
  for (let i = 0; i < n; i++) {
    const cx = x + i * (w + 1), m = r.i(0, 15) | 1, halb = roh && i === n - 1;
    const st = (a, b, c, d) => K.linie(cx + a, y + b, cx + c, y + d, col, roh ? .8 : undefined);
    if (m & 1) st(0, 0, 0, h - 1); if (m & 2 && !halb) st(w - 1, 0, w - 1, h - 1); if (m & 4) st(0, 0, w - 1, 0);
    if (m & 8 && !halb) st(0, h >> 1, w - 1, h >> 1); if ((m & 6) === 6 && !halb) st(0, h - 1, w - 1, h - 1);
  }
}
// Sitzende oder stehende Gestalt mit langem Hals nach links (die Wartenden)
function wartender(K, x, yb, h, o) {
  o = o || {}; const m = K.maske(), k = h / 30, hx = x - (o.weit || 14) * k, hy = yb - (o.hoch || 30) * k;
  m.poly([[x - 5 * k, yb], [x - 4.5 * k, yb - 18 * k], [x - 3 * k, yb - 21 * k], [x + 3.5 * k, yb - 21 * k], [x + 5 * k, yb - 18 * k], [x + 6 * k, yb]]);
  m.pfad([[x, yb - 20 * k], [x - 1 * k, yb - 26 * k], [hx + 6 * k, hy - 3 * k], [hx + 2 * k, hy]], 1.3 * k, 1 * k);
  m.ell(hx, hy, 2.4 * k, 2.8 * k); if (o.hut) m.ell(hx + .5 * k, hy - 2 * k, 3.6 * k, 1.6 * k);
  K.form(m, o.tiefe || 0, { k: FIG, r: FIG_R, ton: 1.2, fase: .8, rand: 1 });
  K.set(hx - 1 * k, hy, '#9ff0da');
  return m;
}

module.exports = {
  biom: 'station',
  bilder: {
    // Ein langes blaues Emailschild auf weißen Kacheln unter einer Bogenlampe; rechts davon geht die Schrift mit weißer Farbe auf den Kacheln weiter, ein Farbtropfen läuft herab.
    station_schild(K) {
      kacheln(K, 0, 0, 160, 66, .22, [[64, 14, 90, .55]]);
      sockel(K, 66, 90, .3);
      lampe(K, 64, 10, 70, .7);
      // Schild
      const s = K.maske(); s.rect(10, 28, 92, 20); K.form(s, 0, { k: EMAIL, r: ['#8090c0', '#dfe6ff'], ton: 2.2, fase: 1, rand: 1 });
      for (let x = 11; x < 101; x++) { K.set(x, 29, '#b8c2d8'); K.set(x, 46, '#8a94ac'); } for (let y = 29; y < 47; y++) { K.set(11, y, '#8a94ac'); K.set(100, y, '#b8c2d8'); }
      for (const [a, b] of [[13, 31], [98, 31], [13, 44], [98, 44]]) K.set(a, b, MESSING[5]);
      zeichen(K, 15, 33, 6, 10, 12, 4711, '#e8ecf4');
      // Überlauf auf den Kacheln, roh gemalt, der letzte halb; ein Tropfen
      zeichen(K, 104, 33, 6, 10, 6, 821, '#c8ccc0', true);
      for (let y = 43; y < 56; y++) K.set(146, y, y < 52 ? '#c8ccc0' : '#8a8e84'); K.set(146, 56, '#eef0e6');
      K.vignette(.45);
    },
    // Die offene Tür eines Wagens, drinnen eine Reihe sitzender Gestalten im trüben Licht, alle mit dem Gesicht in dieselbe Richtung; in der Mitte ein leerer Sitz mit einem hellen Fahrschein.
    station_zug(K) {
      const { B } = K;
      // Wagenwand außen, dunkel, um die Tür
      K.fuell(DUNKEL, (x, y) => .35 + (y % 12 === 0 ? .2 : 0) + (B.fbm(x * .05, y * .05, 3, 2) - .5) * .1);
      // Innenraum
      K.feld(30, 8, 130, 84, KACHEL.slice(1, 8), (x, y) => .3 + Math.max(0, 1 - Math.hypot(x - 80, y - 14) / 70) * .35 - (y > 56 ? .2 : 0));
      // Fenster hinten (schwarz, der Tunnel), Haltestangen
      for (const fx of [36, 64, 92, 116]) K.rect(fx, 22, 14, 14, DUNKEL[1]);
      for (const sx of [50, 108]) { const s = K.maske(); s.kap(sx, 8, sx, 84, .6, .6); K.form(s, 0, { k: MESSING.slice(0, 4), r: ['#b08e48', '#f0dca0'], ton: 1.4, fase: 0, rand: 1 }); }
      // Bank
      const bk = K.maske(); bk.rect(30, 56, 100, 6); bk.rect(30, 40, 100, 3); K.form(bk, 0, { k: HOLZ.slice(0, 5), r: ['#8a7058', '#e0cbb0'], ton: 1.4, fase: 1, rand: 1 });
      // Sitzende, alle nach links gewandt, einer fehlt in der Mitte
      for (const x of [40, 60, 98, 118]) { const m = K.figurMaske(x, 62, 26, { haltung: 'sitzen' }); K.form(m, 0, { k: FIG, r: ['#3a4458', '#7c8ca6'], ton: 1.1, fase: .8, rand: 1 }); K.set(x - 1, 41, '#9ff0da'); K.set(x + 1, 41, '#1c4440'); }
      // Fahrschein auf dem leeren Sitz: die helle Stelle
      K.licht(80, 52, 22, LAMPE_G2, .55, { exp: 2.2 });
      const fs = K.maske(); fs.poly([[74, 53], [86, 51], [87, 55], [75, 57]]); K.form(fs, 0, { k: PAPIER, ton: 2.6, fase: 0, rand: 0 });
      K.set(80, 54, DUNKEL[0]);
      // Türrahmen, Türflügel zur Seite geschoben
      const tr = K.maske(); tr.rect(22, 0, 8, 90); tr.rect(130, 0, 8, 90); tr.rect(22, 0, 116, 8); K.form(tr, 0, { k: ['#05080a', '#0a1014', '#10191e', '#172328'], r: FIG_R, ton: 1.3, fase: 1, rand: 1 });
      K.feld(0, 84, 160, 90, STEIN, () => .3);
      K.vignette(.45);
    },
    // Eine leere hölzerne Kanzel mit einer Lampe am Schwanenhals; auf dem Brett eine Zange, ein Stapel Fahrscheine und eine Schale mit weißen Papierplättchen.
    station_sperre(K) {
      kacheln(K, 0, 0, 160, 58, .14, [[100, 20, 70, .5]]);
      sockel(K, 58, 72, .25);
      K.feld(0, 72, 160, 90, STEIN, (x, y) => .2 + Math.max(0, 1 - Math.hypot(x - 90, y - 76) / 60) * .4);
      // Kanzel
      const kz = K.maske(); kz.rect(46, 46, 70, 40); kz.poly([[116, 46], [126, 42], [126, 82], [116, 86]]); K.form(kz, 0, { k: HOLZ, r: ['#8a7058', '#e0cbb0'], ton: 1.3, fase: 1, rand: 2, muster: (x, y) => ((x - 46) % 9 === 0 && x < 116 ? -.6 : 0) });
      const br = K.maske(); br.poly([[42, 42], [118, 42], [130, 37], [130, 40], [118, 46], [42, 46]]); K.form(br, 0, { k: HOLZ, r: ['#8a7058', '#e0cbb0'], ton: 1.8, fase: 1, rand: 1 });
      // Schwanenhals und Lampe
      const h = K.maske(); h.pfad([[126, 40], [128, 10], [120, 4], [104, 6]], .8, .7); K.form(h, 0, { k: DUNKEL.slice(0, 4), r: KANTE, ton: 1.3, fase: 0, rand: 1 });
      K.licht(102, 14, 50, LAMPE_G2, .5, { exp: 2.2 });
      const sh = K.maske(); sh.poly([[97, 7], [108, 7], [110, 12], [95, 12]]); K.form(sh, 0, { k: DUNKEL.slice(1, 5), r: KANTE, ton: 1.4, fase: 0, rand: 1 });
      K.rect(99, 12, 7, 1, LAMPE); K.set(102, 13, LAMPE_K);
      // Auf dem Brett: Fahrscheinstapel, Schale mit Plättchen, Zange
      const st = K.maske(); st.rect(80, 36, 14, 6); K.form(st, 0, { k: PAPIER, ton: 1.8, fase: 0, rand: 0 }); for (let i = 0; i < 3; i++) K.set(86, 38 + i * 2, PAPIER[0]);
      const sc = K.maske(); sc.ell(104, 40, 7, 2.6); K.form(sc, 0, { k: MESSING, r: ['#b08e48', '#f0dca0'], ton: 1.6, fase: 0, rand: 1 });
      for (let i = 0; i < 16; i++) K.set(99 + (i * 7) % 11, 38 + (i * 3) % 2, i % 3 ? PAPIER[3] : PAPIER[2]);
      const z = K.maske(); z.kap(52, 41, 72, 39, 1.1, 1); z.kap(52, 41, 70, 43, 1, 1); z.ell(48, 40, 2.4, 2.4); K.form(z, 0, { k: DUNKEL.slice(1, 5), r: KANTE, ton: 1.5, fase: 0, rand: 1 });
      // Emailschild an der Kanzel
      K.rect(70, 60, 22, 7, EMAIL[3]); K.rect(70, 60, 22, 1, '#8090c0'); zeichen(K, 72, 62, 2, 3, 6, 33, '#c8ccd8');
      K.vignette(.45);
    },
    // Ein gekachelter Rundbogen, darin eine Ziegelmauer mit hervorgequollenem Mörtel in jeder Fuge; die Schienen verschwinden unter der Mauer, darüber eine einzelne Lampe.
    station_mauer(K) {
      const { B } = K;
      kacheln(K, 0, 0, 160, 76, .16, [[80, 6, 80, .45]]);
      const cx = 80, rb = 44, y0 = 14;
      const innen = (x, y) => y >= y0 + rb ? Math.abs(x - cx) < rb : Math.hypot(x - cx, y - y0 - rb) < rb;
      const ra = K.maske(); ra.fn(cx - rb - 6, y0 - 6, cx + rb + 6, 80, (x, y) => { const d = y >= y0 + rb ? Math.abs(x - cx) - rb : Math.hypot(x - cx, y - y0 - rb) - rb; return d >= 0 && d < 5; }); K.form(ra, 0, { k: KACHEL.slice(3, 10), r: KANTE, ton: 1.6, fase: 1, rand: 2 });
      // Ziegel, die Fugen gequollen
      K.feld(cx - rb, y0, cx + rb, 78, ZIEGEL, (x, y) => { if (!innen(x, y)) return -1; const row = Math.floor((y - y0) / 4), off = row % 2 ? 4 : 0; return .15 + B.hash(Math.floor((x + off) / 8), row, 5) * .2 + Math.floor(Math.max(0, 1 - Math.hypot(x - 80, y - 14) / 50) * 4) / 4 * .5; });
      for (let y = y0; y < 78; y++) for (let x = cx - rb; x < cx + rb; x++) { if (!innen(x, y)) continue; const row = Math.floor((y - y0) / 4), off = row % 2 ? 4 : 0; const fq = ((y - y0) % 4) === 3, fs = ((x + off) % 8) === 7; if (!fq && !fs) continue; const hl = Math.hypot(x - 80, y - 14) < 26; K.set(x, y, hl ? MOERTEL[1] : ZIEGEL[3]); if (fq && B.hash(x >> 1, row, 9) < .6) { K.set(x, y, hl ? MOERTEL[4] : MOERTEL[1]); K.set(x, y + 1, hl ? MOERTEL[0] : ZIEGEL[0]); if (B.hash(x, row, 4) < .3) K.set(x, y + 2, ZIEGEL[0]); } }
      // Gleisbett, Schienen unter die Mauer
      K.feld(0, 78, 160, 90, STEIN, (x, y) => .2 + B.hash(x >> 1, y >> 1, 3) * .25);
      for (const [a, b] of [[60, 20], [100, 140]]) K.linie(a, 78, b, 90, '#8a96a8');
      lampe(K, 80, 6, 64, .8);
      K.vignette(.45);
    },
    // Eine Holzbank vor der Kachelwand, darauf drei dunkle Gestalten, deren Köpfe an langen Hälsen weit nach links in die Luft ragen; links der helle Tunnelmund.
    station_bank(K) {
      const { B } = K;
      kacheln(K, 0, 0, 160, 58, .2, [[10, 30, 70, .6]]);
      sockel(K, 58, 70, .28);
      K.feld(0, 70, 160, 90, STEIN, (x, y) => .2 + Math.max(0, 1 - Math.hypot(x - 10, y - 72) / 70) * .35);
      // Tunnelmund links, hell: die helle Stelle
      const cx = 6, rb = 26; K.feld(0, 10, 32, 70, ['#1e2636', '#38445c', '#5a6a88', '#8494b4', '#b0bcd8'], (x, y) => { const inn = y >= 10 + rb ? x < cx + rb : Math.hypot(x - cx, y - 10 - rb) < rb; if (!inn) return -1; return .9 - Math.hypot(x - cx, y - 40) / 40; });
      K.licht(10, 40, 50, LAMPE_G2, .45, { exp: 2.2 });
      // Bank
      const b = K.maske(); b.rect(54, 61, 98, 4); b.rect(54, 52, 98, 3); b.rect(58, 61, 3, 9); b.rect(146, 61, 3, 9); K.form(b, 0, { k: HOLZ, r: ['#8a7058', '#e0cbb0'], ton: 1.5, fase: 1, rand: 1 });
      // Drei Wartende, die Hälse zum Tunnel
      const f1 = wartender(K, 72, 64, 26, { weit: 18, hoch: 36, hut: true }); K.kante(f1, 10, 40, 80, ['#5a6a88', '#a8b8e8']);
      const f2 = wartender(K, 100, 64, 28, { weit: 26, hoch: 40, hut: true }); K.kante(f2, 10, 40, 100, ['#5a6a88', '#a8b8e8']);
      const f3 = wartender(K, 128, 64, 20, { weit: 30, hoch: 44 }); K.kante(f3, 10, 40, 130, ['#5a6a88', '#a8b8e8']);
      K.vignette(.6, { cx: 60 });
    },
    // Eine breite gekachelte Treppe, die oben an einer Betondecke endet; auf der letzten Stufe eine Reihe Schuhe im Licht einer Lampe.
    station_treppe(K) {
      kacheln(K, 0, 0, 160, 90, .1, [[80, 26, 60, .4]]);
      // Stufen: unten breit, oben schmal; jede Stufe dunkel, die Kante hell
      for (let i = 0; i < 11; i++) { const y = 88 - i * 6, w = 124 - i * 6, x = 80 - w / 2; const s = K.maske(); s.rect(x, y - 6, w, 6); K.form(s, 0, { k: STEIN.slice(1, 7), r: KANTE, ton: .7 + i * .04, fase: 0, rand: 1, muster: (px, py) => (py === y - 6 ? 2.2 : py === y - 5 ? .6 : 0) }); }
      // Messinggeländer
      for (const s of [-1, 1]) { const g = K.maske(); g.kap(80 + s * 66, 88, 80 + s * 36, 26, .8, .7); K.form(g, 0, { k: MESSING.slice(0, 4), r: ['#b08e48', '#f0dca0'], ton: 1.6, fase: 0, rand: 1 }); }
      // Die Decke: eine Betonplatte, in der die Treppe endet
      const d = K.maske(); d.rect(0, 0, 160, 22); K.form(d, 0, { k: STEIN.slice(0, 5), r: KANTE, ton: .8, fase: 1, rand: 2 });
      // Lampe an der Unterseite der Platte, die helle Stelle
      K.licht(80, 24, 34, LAMPE_G2, .55, { exp: 2.2 }); K.rect(76, 22, 9, 1, LAMPE); K.set(80, 23, LAMPE_K);
      // Schuhe auf der obersten Stufe, die Spitzen zur Decke
      for (let i = 0; i < 9; i++) { const x = 58 + i * 5.4, y = 27; const m = K.maske(); m.ell(x, y, 2, 1.5); m.ell(x, y - 1.6, 1.2, 1.2); K.form(m, 0, { k: ['#0a0705', '#140e0a', '#1e150f', '#2a1d14'], r: ['#8a7058', '#e0cbb0'], ton: 1.4, fase: 0, rand: 1 }); }
      K.vignette(.45);
    },

    // Ein Bahnsteig unter einer Bogenlampe: links eine Abfahrtstafel aus Klappbuchstaben, alle Zeilen mit derselben Abfahrt, rechts ein stehender Zug mit offenen Türen, davor ein Gepäckwagen mit Lederkoffer.
    station_abfahrt(K) {
      const { B } = K;
      const lx = 84, ly = 9;
      kacheln(K, 0, 0, 160, 64, .18, [[lx, ly + 6, 100, .6]]);
      sockel(K, 64, 70, .28);
      K.feld(0, 70, 160, 90, STEIN, (x, y) => .12 + Math.max(0, 1 - Math.hypot(x - lx, (y - 74) * 1.8) / 90) * .5);
      // Der Zug: ein Wagen von der Seite, dunkel, Fenster mit trübem Innenlicht, zwei Türen weit offen
      const wg = K.maske(); wg.rect(62, 16, 98, 52); wg.rect(60, 14, 100, 4);
      K.form(wg, 0, { k: ['#0a0f19', '#131b2a', '#1f2c41', '#2e4062', '#44587e'], r: KANTE, ton: 2.2, fase: 1, rand: 1, lichtVon: [lx, ly], schatten: 2, muster: (x, y) => ((y === 60 || y === 22) ? -.5 : 0) });
      for (const fx of [92, 106, 122]) { K.feld(fx, 26, fx + 8, 40, KACHEL.slice(0, 6), (x, y) => .25 + (y - 26) / 28 * .3 + (x > fx + 6 ? .2 : 0)); }
      for (const tx of [68, 138]) {
        K.feld(tx, 24, tx + 18, 66, DUNKEL, () => 0);
        const rahm = K.maske(); rahm.rect(tx - 2, 22, 2, 44); rahm.rect(tx + 18, 22, 2, 44); rahm.rect(tx - 2, 22, 22, 2);
        K.form(rahm, 0, { k: MESSING.slice(0, 5), r: ['#b08e48', '#f0dca0'], ton: 1.6, fase: 0, rand: 1, lichtVon: [lx, ly] });
        // innen nur der Boden und die Stange im Schimmer
        K.feld(tx, 56, tx + 18, 66, KACHEL.slice(0, 5), (x, y) => .15 + (y - 56) / 20 * .35 + Math.max(0, 1 - Math.hypot(x - lx, y - 40) / 90) * .3);
        const st = K.maske(); st.kap(tx + 9, 24, tx + 9, 66, .6, .6); K.form(st, 0, { k: MESSING.slice(1, 6), r: ['#b08e48', '#f0dca0'], ton: 1.3, fase: 0, rand: 1 });
        K.rect(tx - 2, 66, 22, 2, '#8c8f84'); K.rect(tx - 2, 68, 22, 1, '#30333a');   // Trittbrett
      }
      K.kante(wg, lx, ly, 120, KANTE, { min: .45 });
      // Die Tafel: schwarzer Kasten, Rahmen aus Messing, fünf Zeilen Klappzellen, alle Abfahrtszellen gleich und hell
      K.rect(6, 6, 62, 40, DUNKEL[1]);
      const rahm = K.maske(); rahm.rect(4, 4, 66, 44); rahm.rect(6, 6, 62, 40, 0);
      K.form(rahm, 0, { k: MESSING.slice(0, 5), r: ['#b08e48', '#f0dca0'], ton: 1.8, fase: 1, rand: 1, lichtVon: [lx, ly] });
      K.licht(lx - 24, 26, 50, LAMPE_G2, .35, { ohne: rahm });
      for (let z = 0; z < 5; z++) {
        const y = 9 + z * 7.6 | 0;
        for (let i = 0; i < 6; i++) { const x = 8 + i * 6; K.rect(x, y, 5, 6, '#171d26'); K.linie(x, y + 3, x + 4, y + 3, DUNKEL[0]); }
        zeichen(K, 8, y + 1, 4, 4, 6, 100 + z * 17, '#7c8ca6');
        // die Abfahrt: vier gleiche Zellen, hell, in jeder Zeile dasselbe
        for (let i = 0; i < 3; i++) { const x = 46 + i * 7 | 0; K.rect(x, y, 6, 6, '#1f2c41'); K.linie(x, y + 3, x + 5, y + 3, DUNKEL[0]); }
        zeichen(K, 47, y + 1, 5, 4, 3, 7, '#f0f4ff');
      }
      K.set(6, 6, '#f0dca0');
      // Der Kreis auf dem Boden: eine Spur aus hellen Punkten, auf der der Wagen rollt
      for (let a = 0; a < 6.28; a += .09) { const x = Math.round(78 + 62 * Math.cos(a)), y = Math.round(80 + 8 * Math.sin(a)); if (B.bay(x, y) < .7) K.set(x, y, '#58627a'); }
      // Gepäckwagen: Ladefläche, zwei Räder, Schiebegriff
      const bett = K.maske(); bett.rect(92, 68, 54, 5); bett.rect(92, 73, 3, 6);
      K.form(bett, 0, { k: HOLZ, r: ['#8a7058', '#e0cbb0'], ton: 1.8, fase: 1, rand: 1, lichtVon: [lx, ly], schatten: 2 });
      const rad = (cx, cy, r) => { const m = K.maske(); m.ell(cx, cy, r, r); m.ell(cx, cy, r - 1.6, r - 1.6, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + .3; m.kap(cx, cy, cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1), .5, .5); } m.ell(cx, cy, 1.6, 1.6); K.form(m, 0, { k: MESSING.slice(0, 5), r: ['#b08e48', '#f0dca0'], ton: 1.6, fase: 0, rand: 1, lichtVon: [lx, ly] }); };
      rad(138, 80, 8); rad(103, 83, 5);
      const gr = K.maske(); gr.kap(93, 70, 80, 54, .9, .9); gr.kap(80, 54, 76, 54, .9, .9);
      K.form(gr, 0, { k: DUNKEL.slice(1, 5), r: KANTE, ton: 1.3, fase: 0, rand: 1 });
      // Der Koffer: Leder, Riemen, Messingecken, Griff; er liegt der Lampe zugewandt und wirft sein Licht auf den Wagen
      const kof = K.maske(); kof.rect(106, 52, 30, 16);
      K.form(kof, 0, { k: ['#0c0705', '#1a0f0a', '#2c1b10', '#432a18', '#5e3c22'], r: ['#9a6a3a', '#ffd8a0'], ton: 2, fase: 1, rand: 1, lichtVon: [lx, ly], verlauf: .5, schatten: 2, muster: (x, y) => (B.rausch2(x * .4, y * .4, 3) - .5) * .4 });
      for (const x of [112, 129]) { K.linie(x, 52, x, 67, '#120a06'); K.linie(x + 1, 52, x + 1, 67, '#6a4a2a', .7); }
      for (const [x, y] of [[106, 52], [135, 52], [106, 67], [135, 67]]) { K.set(x, y, '#d2b46e'); K.set(x + (x > 120 ? -1 : 1), y, '#8c6c30'); }
      const gf = K.maske(); gf.kap(117, 50, 125, 50, .9, .9); gf.rect(116, 50, 2, 3); gf.rect(125, 50, 2, 3);
      K.form(gf, 0, { k: ['#1a0f0a', '#432a18', '#8c6c30', '#d2b46e'], ton: 1.5, fase: 0, rand: 0 });
      lampe(K, lx, ly + 1, 80, .95);
      K.lichtquelle(lx, ly);
      K.vignette(.45);
    },
  },
};
