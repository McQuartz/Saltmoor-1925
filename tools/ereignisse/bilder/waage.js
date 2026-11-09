// Ereignisbilder 160 × 90 · Die Waage am Grund (data/biome/waage.json).
// Palette des Bioms (prototype/js/scenes/world/waage.js): Aktenpapier im Wasserlicht, Messing, Siegellackrot;
// über allem das Meer, dunkles Oliv. Je Bild ein großes Motiv und eine helle Stelle.
'use strict';

const WASSER = ['#040504', '#080a07', '#0d110b', '#131910', '#1b2216', '#242c1c', '#2f3823', '#3c452b'];
const KACHEL = ['#0b0a07', '#12110c', '#1a1811', '#232017', '#2e2a1e', '#3a3526', '#47412f', '#554e38', '#655d43', '#786e50', '#8c8160', '#a29572'];
const HOLZ = ['#070504', '#0e0906', '#170f09', '#21160d', '#2c1e12', '#392818'];
const MESS = ['#100b05', '#1d1509', '#2e220e', '#433214', '#5c461c', '#7a5e26', '#9c7a34', '#c09c48', '#e0c26a'];
const PAPIER = ['#3a3526', '#655d43', '#8c8160', '#bdb190', '#e6dcbc'];
const DUNKEL = ['#030302', '#070605', '#0c0a07', '#14110b'];
const SIEGEL = '#9c2a1e', ROT = '#ec4a34', LAMPE = '#f0c870', LAMPE_K = '#fff2d0', LAMPE_G = '#3a2a10', WLICHT_G = '#262a1a';

// ---------- eigene Bausteine ----------
// Gekachelte Wand (Fugenraster), unten Holzpaneel; ruhig, wenig Rauschen
function kachelwand(K, y0, y1, o) {
  o = o || {}; const { B } = K, kw = o.kw || 8, kh = o.kh || 6;
  K.feld(0, y0, 160, y1, KACHEL.slice(1, 8), (x, y) => {
    const fuge = (x % kw === 0 || y % kh === 0) ? -.08 : 0;
    return (o.basis === undefined ? .32 : o.basis) + fuge + (B.hash(Math.floor(x / kw), Math.floor(y / kh), 7) - .5) * .05 + (o.gx === undefined ? 0 : Math.exp(-(((x - o.gx) / (o.gb || 50)) ** 2)) * .2);
  });
}
// Fliesenboden im Schachbrett, perspektivisch (Fluchtpunkt vx, Horizont hy)
function fliesen(K, hy, vx, o) {
  o = o || {}; const { B } = K;
  K.feld(0, hy, 160, 90, KACHEL.slice(1, 9), (x, y) => {
    const Z = 40 / Math.max(.5, y - hy + 1), X = (x - vx) * Z / 40, kon = Math.min(1, (y - hy) / 18);
    const hell = (Math.floor(X * 2.2) + Math.floor(Z * 2.2)) & 1;
    return .22 + (hell ? .14 : 0) * kon + .07 * (1 - kon) + (o.gx === undefined ? 0 : Math.exp(-(((x - o.gx) / (o.gb || 40)) ** 2)) * .14 * (1 - kon * .5));
  });
}
// Das Meer oben: dunkles Oliv mit feinem Lichtnetz
function meer(K, y1) {
  const { B } = K;
  K.feld(0, 0, 160, y1, WASSER, (x, y) => { const c = Math.abs(Math.sin(x * .12 + Math.sin(y * .3) * 1.4) + Math.sin(y * .37 - x * .05)); return .12 + (y / y1) * .35 + (c < .12 ? .14 : 0); });
}
// Lichtschacht von oben (Wasserlicht), schräg
function schacht(K, x, breite, laenge, a) { K.kegel(x, -10, 1.85, breite, laenge, WLICHT_G, a); }

module.exports = {
  biom: 'waage',
  bilder: {
    // Ein Wartemarkenautomat aus Messing an einer Säule, eine helle Marke hängt aus dem Schlitz;
    // dahinter eine Bank mit dunklen, sitzenden Gestalten.
    waage_wartemarke(K) {
      const { B } = K;
      kachelwand(K, 0, 64, { basis: .26, gx: 110, gb: 60 });
      fliesen(K, 64, 80);
      // Bank mit Wartenden rechts (dunkle Silhouetten vor der hellen Wand)
      const bank = K.maske(); bank.rect(84, 52, 72, 3); bank.rect(84, 60, 72, 2); for (const x of [86, 120, 152]) bank.rect(x, 52, 2, 14);
      K.form(bank, .15, { k: HOLZ, r: [MESS[5]], ton: 1.6, fase: 0, rand: 1 });
      // Wartende: gebeugte Rücken mit Hut oder Kopftuch, je eine helle Marke in der Hand
      const wm = K.maske();
      for (const [x, h, hut] of [[96, 22, 1], [112, 20, 0], [128, 23, 1], [144, 21, 0]]) {
        wm.poly([[x - 6, 60], [x - 6, 60 - h * .55], [x - 3, 60 - h * .85], [x + 3, 60 - h * .9], [x + 6, 60 - h * .6], [x + 6, 60]]);
        wm.ell(x - 1, 60 - h * .95, 3.2, 3.6); if (hut) { wm.rect(x - 5, 60 - h - 2, 9, 1); wm.rect(x - 3, 60 - h - 5, 5, 3); } else wm.ell(x, 60 - h - .5, 3.8, 3);
        wm.rect(x - 6, 60, 3, 6); wm.rect(x + 2, 60, 3, 6);
      }
      K.form(wm, .05, { k: DUNKEL, r: [KACHEL[8], KACHEL[10]], ton: 1.2, fase: 1, rand: 2 });
      for (const x of [96, 112, 128, 144]) { K.set(x - 7, 50, PAPIER[2]); K.set(x - 7, 51, PAPIER[1]); }
      // Säule und Automat (links, groß)
      K.lichtquelle(150, 0);
      const s = K.maske(); s.rect(30, 0, 14, 90); K.form(s, 0, { k: MESS.slice(0, 6), r: [MESS[7], MESS[8]], ton: 1.6, fase: 1, rand: 2, muster: (x, y) => (x - 30) * .06 + (y % 22 < 2 ? .6 : 0) });
      const a = K.maske(); a.rect(22, 30, 30, 28); a.ell(37, 30, 15, 4); K.form(a, 0, { k: MESS.slice(0, 7), r: [MESS[7], MESS[8]], ton: 2.2, fase: 1.5, rand: 2, muster: (x, y) => (y === 44 ? -1.4 : 0) + (x - 22) * .03 });
      // Kurbel
      const kb = K.maske(); kb.kap(52, 40, 58, 36, 1, 1); kb.ell(58, 36, 1.6, 1.6); K.form(kb, 0, { k: MESS.slice(1, 6), r: [MESS[8]], ton: 2, fase: 0, rand: 1 });
      // Schlitz und die Marke: die helle Stelle
      K.rect(30, 50, 14, 1, DUNKEL[0]);
      K.licht(37, 56, 22, LAMPE_G, .9);
      K.rect(34, 51, 7, 9, PAPIER[3]); K.rect(34, 51, 7, 1, PAPIER[4]); K.rect(40, 51, 1, 9, PAPIER[2]);
      // die Eins
      K.rect(37, 53, 1, 5, SIEGEL); K.set(36, 54, SIEGEL);
      K.vignette(.7, { cx: 60, cy: 46 });
    },

    // Eine leere, flache Messingschale auf einem Fliesenboden; drei Ketten laufen schräg nach oben ins Dunkel, oben ein Schimmer.
    waage_schale(K) {
      const { B } = K;
      meer(K, 36);
      kachelwand(K, 26, 52, { basis: .2, gx: 80 });
      fliesen(K, 52, 80, { gx: 80, gb: 50 });
      K.lichtquelle(96, 0);
      schacht(K, 110, .22, 120, .9);
      // Ketten: von der Schale nach oben zu einem Punkt außerhalb des Bildes
      const kt = K.maske(); for (const [x0, x1] of [[38, 74], [80, 82], [122, 90]]) kt.pfad([[x0, 66], [x1, -2]], .8, .7);
      K.form(kt, 0, { k: MESS.slice(1, 6), r: [MESS[7]], ton: 2, fase: 0, rand: 1, muster: (x, y) => (y % 3 === 0 ? -1 : 0) });
      // Schale: flache Ellipse, Innenseite hell im Licht von oben
      const aus = K.maske(); aus.ell(80, 70, 50, 13);
      K.form(aus, 0, { k: MESS.slice(0, 6), r: [MESS[7], MESS[8]], ton: 1.6, fase: 1, rand: 2 });
      K.feld(30, 57, 130, 72, MESS.slice(2, 9), (x, y) => { const q = Math.hypot((x - 80) / 46, (y - 66) / 9); if (q > 1 || y > 71) return -1; return .25 + (1 - q) * .55 + (x - 80) / 220; });
      for (let x = 32; x <= 128; x++) { const y = Math.round(66 - Math.sqrt(Math.max(0, 1 - ((x - 80) / 48) ** 2)) * 9.5); K.set(x, y, x % 4 ? MESS[8] : '#f0e2a8'); }
      K.licht(84, 64, 24, WLICHT_G, .8, { oval: 2 });
      K.vignette(.75, { cx: 80, cy: 58 });
    },

    // Ein offener Karteikasten in einem Regal, das bis in die Dunkelheit hinaufreicht; eine Karte steht heraus und leuchtet hell.
    waage_registratur(K) {
      const { B } = K;
      K.lichtquelle(140, -10);
      // Regal: Schubladen im Raster, nach oben dunkler
      K.feld(0, 0, 160, 90, HOLZ, (x, y) => { const fx = x % 20, fy = y % 12; if (fx < 1 || fy < 1) return .05; const griff = fx > 8 && fx < 12 && fy > 5 && fy < 7; return .25 + y / 90 * .35 + (griff ? .4 : 0) + (B.hash(Math.floor(x / 20), Math.floor(y / 12), 3) - .5) * .08; });
      // Griffe in Messing
      for (let y = 6; y < 90; y += 12) for (let x = 9; x < 160; x += 20) if (y > 20) { K.rect(x, y, 3, 1, y > 50 ? MESS[6] : MESS[4]); }
      // Die offene Schublade (Mitte): herausgezogen, darin Karten, eine steht hoch
      const sx = 60, sy = 48;
      K.rect(sx, sy, 20, 11, DUNKEL[0]);
      const lade = K.maske(); lade.poly([[sx - 4, sy + 10], [sx + 24, sy + 10], [sx + 26, sy + 22], [sx - 6, sy + 22]]);
      K.form(lade, 0, { k: HOLZ, r: [MESS[6], MESS[8]], ton: 2.4, fase: 1, rand: 2 });
      for (let i = 0; i < 9; i++) K.rect(sx - 2 + i * 3, sy + 7 - (i % 3), 2, 4, PAPIER[1 + (i % 2)]);
      K.licht(sx + 10, sy + 2, 24, LAMPE_G, .9);
      K.rect(sx + 8, sy - 10, 9, 15, PAPIER[3]); K.rect(sx + 8, sy - 10, 9, 1, PAPIER[4]); K.rect(sx + 16, sy - 10, 1, 15, PAPIER[2]);
      for (let j = 0; j < 5; j++) K.rect(sx + 9, sy - 7 + j * 2, 5 + (j % 2) * 2, 1, PAPIER[1]);
      K.rect(sx + 9, sy - 9, 3, 1, SIEGEL);
      // Leiter rechts davor, dunkel
      const l = K.maske(); l.rect(118, 0, 2, 90); l.rect(132, 0, 2, 90); for (let y = 6; y < 90; y += 9) l.rect(118, y, 16, 2);
      K.form(l, 0, { k: DUNKEL, r: [MESS[5], MESS[7]], ton: 1.4, fase: 0, rand: 1 });
      K.vignette(.85, { cx: 70, cy: 50 });
    },

    // Ein Berg aus Mänteln und Koffern hinter einem Gitter unter einer Hängelampe; obenauf ein offener Koffer, darin ein heller Brief.
    waage_asservaten(K) {
      const { B } = K;
      kachelwand(K, 0, 70, { basis: .14 });
      fliesen(K, 70, 80);
      K.lichtquelle(80, 8);
      // Hängelampe
      K.linie(80, 0, 80, 6, MESS[4]); const sch = K.maske(); sch.poly([[72, 12], [88, 12], [84, 6], [76, 6]]); K.form(sch, 0, { k: MESS.slice(1, 6), r: [MESS[8]], ton: 2, fase: 0, rand: 1 });
      for (let x = 74; x <= 86; x++) K.set(x, 12, Math.abs(x - 80) < 3 ? LAMPE_K : LAMPE);
      K.kegel(80, 13, Math.PI / 2, .6, 70, LAMPE_G, .9);
      // Haufen: wenige große Koffer mit Riemen, Mantelballen an den Seiten (ruhig, nur Messing an den Kanten)
      const m = K.maske();
      for (const [x, y, w, h] of [[26, 80, 38, 13], [64, 80, 34, 14], [100, 80, 36, 12], [42, 67, 30, 12], [84, 66, 32, 13], [62, 54, 26, 11]]) m.rect(x, y - h, w, h);
      m.ell(16, 76, 14, 9); m.ell(146, 76, 14, 8); m.ell(140, 66, 10, 7);
      K.form(m, 0, { k: HOLZ, r: [MESS[5], MESS[7]], ton: 1.6, fase: 1, rand: 1, muster: (x, y) => (B.fbm(x * .1, y * .1, K.seed, 2) - .5) * .5 });
      for (const [x, y, w, h] of [[26, 80, 38, 13], [64, 80, 34, 14], [100, 80, 36, 12], [42, 67, 30, 12], [84, 66, 32, 13]]) { K.rect(x + w * .3, y - h, 2, h, HOLZ[0]); K.rect(x + w * .7, y - h, 2, h, HOLZ[0]); K.set(x + w * .3, y - h * .5, MESS[6]); K.set(x + w * .7, y - h * .5, MESS[6]); K.rect(x, y - h, w, 1, MESS[4]); }
      K.licht(80, 46, 70, LAMPE_G, 1, { oval: 1.3 });
      // Offener Koffer obenauf, darin ein heller Brief (die helle Stelle)
      const k2 = K.maske(); k2.rect(66, 34, 28, 9); k2.poly([[66, 34], [94, 34], [92, 22], [68, 22]]);
      K.form(k2, 0, { k: HOLZ, r: [MESS[6], LAMPE], ton: 2.2, fase: 1, rand: 2 });
      K.licht(80, 34, 20, LAMPE_G, .9);
      K.rect(74, 32, 12, 6, PAPIER[3]); K.rect(74, 32, 12, 1, PAPIER[4]); K.set(79, 35, SIEGEL); K.set(80, 35, SIEGEL);
      // Gitter davor
      for (let x = 4; x < 160; x += 12) if (x < 56 || x > 104) K.rect(x, 18, 1, 72, MESS[3]);
      K.rect(0, 18, 56, 1, MESS[4]); K.rect(104, 18, 56, 1, MESS[4]);
      K.vignette(.8, { cx: 80, cy: 44 });
    },

    // Ein Haufen ungeöffneter Briefe mit roten Siegeln in einer großen Messingschale; einer liegt obenauf, das Siegel glimmt.
    waage_briefe(K) {
      const { B } = K;
      meer(K, 50);
      K.lichtquelle(120, -10);
      schacht(K, 130, .2, 100, .6);
      // Schale: groß, füllt die untere Hälfte
      const aus = K.maske(); aus.ell(80, 74, 78, 18);
      K.form(aus, 0, { k: MESS.slice(0, 6), r: [MESS[7], MESS[8]], ton: 1.7, fase: 1.5, rand: 2 });
      // Briefe: viele helle Rechtecke, schräg übereinander, nach hinten dunkler
      const r = B.rng(K.seed);
      for (let i = 0; i < 70; i++) {
        const x = r.f(12, 146), y = r.f(56, 74), q = (y - 56) / 18, w = r.f(9, 14), h = r.f(5, 7), c = PAPIER[Math.min(3, Math.floor(q * 2.5 + r.f(0, 1)))];
        if (Math.hypot((x - 80) / 74, (y - 66) / 14) > 1) continue;
        K.rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), c); K.rect(Math.round(x), Math.round(y + h - 1), Math.round(w), 1, PAPIER[0]);
        if (r() < .7) K.set(Math.round(x + w / 2), Math.round(y + h / 2), SIEGEL);
      }
      // Rand der Schale vorn
      for (let x = 4; x <= 156; x++) { const y = Math.round(74 + Math.sqrt(Math.max(0, 1 - ((x - 80) / 78) ** 2)) * 4); K.set(x, y, MESS[6]); }
      // Der eine Brief obenauf, das Siegel glimmt (die helle Stelle)
      K.rect(70, 50, 22, 12, PAPIER[3]); K.rect(70, 50, 22, 1, PAPIER[4]); K.rect(70, 61, 22, 1, PAPIER[1]);
      K.linie(70, 50, 81, 56, PAPIER[2]); K.linie(91, 50, 81, 56, PAPIER[2]);
      K.licht(81, 56, 14, '#3a120c', .9);
      K.rect(80, 55, 3, 3, SIEGEL); K.set(81, 56, ROT);
      K.vignette(.75, { cx: 80, cy: 58 });
    },

    // Ein Schalterfenster mit Messinggitter, dahinter eine Lampe; eine Hand ohne Gesicht hält einen Stempel über den Schlitz.
    waage_schalter(K) {
      const { B } = K;
      // Holzwand mit Paneelen, darin das Fenster
      K.feld(0, 0, 160, 90, HOLZ, (x, y) => .3 + (x % 40 < 1 ? -.2 : 0) + (y === 70 ? .3 : 0) + (B.fbm(x * .05, y * .2, K.seed, 2) - .5) * .1);
      const fx0 = 36, fx1 = 124, fy0 = 10, fy1 = 62;
      K.lichtquelle(80, 20);
      K.feld(fx0, fy0, fx1, fy1, [HOLZ[1], HOLZ[3], LAMPE_G, MESS[3], MESS[5], MESS[7]], (x, y) => .15 + .85 * Math.exp(-(((x - 80) / 34) ** 2) - (((y - 24) / 18) ** 2)));
      // Lampe hinter dem Glas
      for (let x = 74; x <= 86; x++) K.set(x, 16, Math.abs(x - 80) < 3 ? LAMPE_K : LAMPE);
      const ls = K.maske(); ls.poly([[72, 16], [88, 16], [84, 10], [76, 10]]); K.form(ls, 0, { k: MESS.slice(0, 5), r: [MESS[8]], ton: 1.6, fase: 0, rand: 1 });
      // Der Beamte: dunkle Schultern, kein Gesicht
      const b = K.maske(); b.ell(80, 34, 7, 8); b.poly([[60, 62], [64, 44], [72, 40], [88, 40], [96, 44], [100, 62]]);
      K.form(b, 0, { k: DUNKEL, r: [MESS[6], LAMPE], ton: 1.2, fase: 1, rand: 2, lichtVon: [80, 16] });
      // Gitterstäbe
      for (let x = fx0 + 4; x < fx1; x += 7) K.rect(x, fy0, 1, fy1 - fy0 - 6, x % 2 ? MESS[6] : MESS[5]);
      K.rect(fx0, fy0, fx1 - fx0, 1, MESS[6]); K.rect(fx0, fy1 - 6, fx1 - fx0, 2, MESS[5]);
      // Durchreiche, Brett, die Hand mit dem Stempel darüber
      K.rect(fx0 - 6, fy1, fx1 - fx0 + 12, 4, HOLZ[4]); K.rect(fx0 - 6, fy1, fx1 - fx0 + 12, 1, MESS[6]);
      K.rect(66, fy1 - 6, 28, 5, DUNKEL[0]);
      const st = K.maske(); st.rect(76, 46, 8, 6); st.kap(80, 46, 80, 40, 1.5, 1.5); st.ell(80, 39, 2.6, 2.6); st.ell(85, 44, 5, 3); st.kap(88, 44, 96, 48, 2.4, 2.8);
      K.form(st, 0, { k: DUNKEL, r: [MESS[6], LAMPE], ton: 1.3, fase: 1, rand: 2, lichtVon: [80, 16] });
      K.rect(76, 52, 8, 1, SIEGEL);
      // Stempelkissen auf dem Brett, rot
      K.rect(102, fy1 - 2, 10, 2, SIEGEL); K.rect(102, fy1 - 3, 10, 1, '#5a1a12');
      K.vignette(.8, { cx: 80, cy: 34 });
    },

    // Ein Messingschalter: vorn eine herausgezogene Lade voller Papierröllchen mit Zahlen, dahinter eine Rechenmaschine mit Kurbel, an der Wand ein emailliertes Schild, über allem eine hängende Lampe.
    waage_restposten(K) {
      const { B } = K;
      const lx = 62, ly = 17;
      // Holzwand, im Lampenkreis heller
      K.feld(0, 0, 160, 90, HOLZ, (x, y) => .26 + (x % 40 < 1 ? -.2 : 0) + (B.fbm(x * .05, y * .2, K.seed, 2) - .5) * .1 + Math.exp(-((((x - lx) / 70) ** 2) + (((y - 30) / 42) ** 2))) * .3);
      K.lichtquelle(lx, ly);
      // Emailschild links oben: cremeweiß, roter Rand, drei Schriftzeilen aus Strichen
      const sch = K.maske(); sch.rect(10, 11, 36, 20);
      K.form(sch, 0, { k: PAPIER, r: [MESS[7], MESS[8]], ton: 2.2, fase: 1, rand: 1, lichtVon: [lx, ly], verlauf: .4 });
      for (let x = 11; x < 45; x++) { K.set(x, 12, SIEGEL); K.set(x, 29, SIEGEL); } for (let y = 12; y < 30; y++) { K.set(11, y, SIEGEL); K.set(44, y, SIEGEL); }
      K.schrift(15, 16, 40, '#1a1208', { min: 2, max: 5 }); K.schrift(15, 20, 40, '#1a1208', { min: 2, max: 6 }); K.schrift(15, 24, 31, '#1a1208', { min: 2, max: 4 });
      for (const [x, y] of [[13, 14], [42, 14], [13, 27], [42, 27]]) K.set(x, y, MESS[7]);
      // Die Rechenmaschine: Messingkasten, Anzeige, Tastenfeld, Kurbel rechts
      const kasten = K.maske(); kasten.rect(76, 26, 60, 38);
      K.form(kasten, 0, { k: MESS.slice(0, 7), r: [MESS[7], MESS[8]], ton: 2.2, fase: 1, rand: 1, lichtVon: [lx, ly], schatten: 2, verlauf: .4, muster: (x, y) => (y === 40 ? -.7 : 0) });
      K.rect(81, 30, 40, 8, DUNKEL[0]);
      for (let i = 0; i < 9; i++) { const h = 3 + (B.hash(i, 3, 5) * 3 | 0); K.rect(83 + i * 4, 35 - h, 2, h, i % 4 === 3 ? LAMPE : LAMPE_K); }
      for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const x = 81 + c * 6, y = 43 + r * 6; K.rect(x, y, 4, 4, DUNKEL[1]); K.rect(x, y, 4, 3, MESS[5]); K.set(x, y, MESS[8]); }
      const arm = K.maske(); arm.kap(136, 50, 148, 50, 1.6, 1.6); arm.kap(148, 50, 148, 40, 1.3, 1.3); arm.ell(148, 38, 2.6, 2.6);
      K.form(arm, 0, { k: MESS.slice(0, 7), r: [MESS[7], MESS[8]], ton: 2.2, fase: 0, rand: 1, lichtVon: [lx, ly] });
      K.set(147, 37, LAMPE_K);
      // Hängende Lampe mit Messingschirm: die hellste Stelle
      const schnur = K.maske(); schnur.kap(lx, 0, lx, ly - 7, .5, .5); K.form(schnur, 0, { k: DUNKEL, ton: 1, fase: 0, rand: 0 });
      K.licht(lx, ly + 6, 80, LAMPE_G, .95, { oval: 1.15 });
      const schirm = K.maske(); schirm.poly([[lx - 3, ly - 7], [lx + 3, ly - 7], [lx + 9, ly + 1], [lx - 9, ly + 1]]);
      K.form(schirm, 0, { k: MESS.slice(0, 7), r: [MESS[7], MESS[8]], ton: 1.8, fase: 0, rand: 1, L: [0, 1] });
      K.rect(lx - 3, ly + 2, 7, 2, LAMPE); K.set(lx, ly + 2, LAMPE_K); K.set(lx - 1, ly + 3, LAMPE_K); K.set(lx, ly + 3, LAMPE_K);
      // Tresen: Platte mit Messingkante, Front aus Holz
      K.rect(0, 62, 160, 5, HOLZ[4]); K.rect(0, 62, 160, 1, MESS[8]); K.rect(0, 63, 160, 1, MESS[6]);
      K.feld(0, 67, 160, 90, HOLZ, (x, y) => .24 + (x % 28 === 0 ? -.14 : 0) + (y === 67 ? -.1 : 0) - (y - 67) * .004 + Math.exp(-(((x - 40) / 70) ** 2)) * .16);
      // Die Lade: herausgezogen, von oben gesehen; innen Reihen von Papierröllchen
      const lade = K.maske(); lade.poly([[8, 66], [72, 66], [78, 83], [2, 83]]);
      K.form(lade, 0, { k: HOLZ.slice(0, 5), r: [MESS[6], MESS[8]], ton: 1.4, fase: 1, rand: 1, lichtVon: [lx, ly], schatten: 2 });
      const innen = K.maske(); innen.poly([[11, 68], [69, 68], [74, 81], [6, 81]]);
      K.form(innen, 0, { k: ['#020201', '#060503', '#0e0a05'], ton: .5, fase: 0, rand: 0 });
      for (const [y, s, n] of [[72, .85, 8], [77, 1.05, 7], [81, 1.25, 6]]) {
        const xl = 11 - (y - 68) * .43, xr = 69 + (y - 68) * .43, dx = (xr - xl) / n;
        for (let i = 0; i < n; i++) {
          const x = xl + dx * (i + .5), m = K.maske(); m.rect(x - 2.6 * s, y - 3 * s, 5.2 * s, 3 * s); m.ell(x, y, 2.6 * s, 1.6 * s); m.ell(x, y - 3 * s, 2.6 * s, 1.5 * s);
          K.form(m, 0, { k: PAPIER, r: [PAPIER[3], PAPIER[4]], ton: 2.2, fase: 0, rand: 1, lichtVon: [lx, ly], verlauf: .4 });
          K.set(x, y - 2, '#1a1208'); K.set(x + 1, y - 2, i % 3 ? '#1a1208' : '#5a4a2a'); K.set(x, y - 1, SIEGEL);
        }
      }
      // Die Lade vorn: Holzfront mit Messinggriff und Zahlenschild
      const front = K.maske(); front.rect(2, 83, 76, 7);
      K.form(front, 0, { k: HOLZ, r: [MESS[6], MESS[8]], ton: 2.2, fase: 1, rand: 1, lichtVon: [lx, ly] });
      K.rect(34, 85, 12, 3, MESS[6]); K.rect(34, 85, 12, 1, MESS[8]); K.set(38, 86, DUNKEL[0]); K.set(42, 86, DUNKEL[0]);
      // Zwei Röllchen lose auf dem Tresen, eines angestoßen
      for (const [x, y, a] of [[96, 66, 0], [106, 67, 1]]) { const m = K.maske(); m.kap(x - 3, y - 2 - a, x + 3, y - 2 + a, 2, 2); K.form(m, 0, { k: PAPIER, r: [PAPIER[3], PAPIER[4]], ton: 2.2, fase: 0, rand: 1, lichtVon: [lx, ly] }); K.set(x, y - 2, '#1a1208'); K.set(x + 1, y - 2, SIEGEL); }
      K.vignette(.65, { cx: 76, cy: 40 });
    },
  },
};
