// Ereignisbilder 160 × 90 · Leuchtturm (prototype/data/biome/leuchtturm.json).
// Palette des Leuchtturmhofs (prototype/js/scenes/world/leuchtturm.js): Schiefer und Kalk in der Nacht,
// das rote Band des Turms, der Strahl cremeweiß; Schiffslichter rot und grün.
'use strict';

const HIMMEL = ['#04040a', '#07070f', '#0b0b16', '#10101e', '#161628', '#1e1d33', '#27263f', '#32304b', '#403d58'];
const KALK = ['#0d0d13', '#16161e', '#202029', '#2c2b35', '#3b3a43', '#504d53', '#6b6664', '#8e877a', '#b6ac96', '#dbd0b5'];
const ROT = ['#100506', '#1b0808', '#2a0d0b', '#3c120e', '#521912', '#6c2217', '#8c2e1f', '#ad3d28'];
const GRAS = ['#050605', '#0a0c0a', '#101310', '#161a16', '#1e231d', '#282e26'];
const FELS = ['#06060a', '#0b0b11', '#121219', '#1a1a22', '#24242e', '#30303b', '#3e3d48'];
const MEER = ['#020307', '#04060c', '#070912', '#0a0d19', '#0f1322', '#151a2d'];
const PFL = ['#070709', '#0d0d11', '#141419', '#1c1c22', '#26252b', '#323037', '#423f43'];
const HOLZ = ['#08070a', '#100e10', '#1a1617', '#262021', '#342b29', '#463a33'];
const EISEN = ['#050607', '#0a0c0e', '#121518', '#1b1f23', '#262b30', '#333a40'];
const MESS = ['#2a2010', '#4a3818', '#7a5e2a', '#a8843c', '#d8b468'];
const PAPIER = ['#2a2620', '#544c40', '#8a8070', '#bcb09a', '#e4dac4'];
const STRAHL = '#fff1c0', STRAHLK = '#fffbe8', STRAHLG = '#3c3522', STRAHLD = '#26221a';
const FENSTER = '#ffc870', FENSTERG = '#4a3010';
const S_ROT = '#ff4a3a', S_GRUEN = '#5cff8e';
const RAND = ['#857a60', '#ece2c8'], RAND_D = ['#3b3a43', '#6b6664'];
const WARMKANTE = ['#8a5a20', '#ffd27a'];

// Petroleumlampe mit Glaszylinder: Fuß (x, yb), Größe s
function petroleum(K, x, yb, s, o) {
  o = o || {}; s = s || 1; const fuss = K.maske();
  fuss.ell(x, yb - 1 * s, 5 * s, 1.6 * s); fuss.ell(x, yb - 5 * s, 4.5 * s, 3.4 * s); fuss.rect(x - 2.5 * s, yb - 9 * s, 5 * s, 2 * s);
  if (o.hof !== 0) K.licht(x, yb - 14 * s, o.hof || 80, '#4a3414', o.staerke || 1, { ohne: o.ohne });
  K.licht(x, yb - 14 * s, 12 * s, '#6a4a1c', 1);
  K.form(fuss, 0, { k: MESS, r: ['#d8b468', '#fff0c0'], ton: 2.6, rand: 1, fase: 1, L: [-.6, -.8] });
  // Zylinder: bauchiges Glas, darin die Flamme
  const zyl = K.maske(); zyl.ell(x, yb - 14 * s, 2.8 * s, 4 * s); zyl.rect(x - 1.6 * s, yb - 22 * s, 3.2 * s, 8 * s);
  K.form(zyl, 0, { k: ['#4a4030', '#7a6a4a', '#b0a070', '#e0d4a8'], r: ['#fff0c0', '#fffbe8'], ton: 1.6, rand: 1, fase: 0, L: [-1, 0] });
  const fx = Math.round(x), fy = Math.round(yb - 12 * s);
  for (let j = 0; j < 4 * s; j++) K.set(fx, fy - j, j < 2 * s ? '#fffbe8' : '#ffd27a');
  K.set(fx - 1, fy - 1, '#ffd27a'); K.set(fx + 1, fy - 1, '#ffd27a');
  K.lichtquelle(x, yb - 14 * s);
}
// Strichliste in Fünferbündeln: ab (x, y), n Bündel, Zeilenlänge bis x1
function striche(K, x0, y, x1, n, col) {
  let x = x0;
  for (let b = 0; b < n && x + 5 < x1; b++) {
    for (let i = 0; i < 4; i++) K.linie(x + i * 2, y, x + i * 2, y + 3, col);
    K.linie(x - 1, y + 3, x + 7, y, col); x += 11;
  }
}
// Aufgeschlagenes Buch in Aufsicht: Bundsteg bei bm; liefert Seitenmaske
function buch(K, bl, bt, bm, br, bb) {
  const ein = K.maske(); ein.poly([[bl - 3, bt - 1], [br + 3, bt - 1], [br + 5, bb + 3], [bl - 5, bb + 3]]);
  K.form(ein, 0, { k: ['#0c0606', '#1a0c0a', '#2a1410', '#3c1e16'], ton: 1.6, rand: 1, r: RAND_D, schatten: 2 });
  const s = K.maske(); s.poly([[bl, bt + 2], [bm, bt], [bm, bb], [bl - 2, bb + 1]]); s.poly([[bm, bt], [br, bt + 2], [br + 2, bb + 1], [bm, bb]]);
  K.form(s, 0, { k: PAPIER, r: ['#bcb09a', '#efe6d2'], ton: 2.2, verlaufX: -.6, rand: 1, L: [-.6, -.8], muster: (x) => (Math.abs(x - bm) < 1.5 ? -1.4 : Math.abs(x - bm) < 5 ? -.5 : 0) });
  return s;
}

module.exports = {
  biom: 'leuchtturm',
  bilder: {
    // Ein aufgeschlagenes Buch unter einer Petroleumlampe, die Seiten voller Striche in Fünferbündeln, am Rand ein Fingerabdruck in Ruß.
    leuchtturm_wachbuch(K) {
      const { B } = K;
      // Wachstube: gekalkte Wand, Tisch aus Holz
      K.feld(0, 0, 160, 44, KALK.slice(0, 5), (x, y) => .3 + (B.fbm(x * .04, y * .05, K.seed, 2) - .5) * .2);
      K.bretter(0, 40, 160, 90, HOLZ, { breite: 7, ton: .45 });
      const s = buch(K, 50, 44, 98, 146, 84);
      // linke Seite: Einträge; rechte Seite: Striche in Fünferbündeln, dicht
      for (let i = 0; i < 9; i++) K.schrift(54, 49 + i * 4, 92, '#2a2218', { min: 2, max: 5 });
      for (let i = 0; i < 7; i++) striche(K, 103 + (i % 2) * 2, 47 + i * 5, 132, 3, '#2a2218');
      // Fingerabdruck in Ruß am Rand der rechten Seite: ovale Rillen
      for (let y = 64; y <= 80; y++) for (let x = 132; x <= 146; x++) { const dx = (x - 139) / 5.5, dy = (y - 72) / 7.5, d = Math.hypot(dx, dy); if (d > 1 || !s.has(x, y)) continue; if (Math.sin(d * 12) > -.3) K.set(x, y, d < .55 ? '#0e0c0a' : '#1e1a16'); }
      // Petroleumlampe hinten links: die helle Stelle
      petroleum(K, 30, 56, 1.5, { hof: 96 });
      K.vignette(.7, { cx: 84, cy: 56 });
    },

    // Die eiserne Galerie um die Laterne, Scheiben mit Rautenrahmen, ein Kreis in der beschlagenen Scheibe, dahinter ein Glimmen.
    leuchtturm_galerie(K) {
      const { B } = K;
      // Nachthimmel rechts, Meer tief unten
      K.himmel(90, HIMMEL, { steil: .5 });
      K.sterne(20, 50, ['#2a2a42', '#4a4a66', '#9a96b0']);
      // Laternenglas: Rautengitter, beschlagen (helles, gedithertes Grau), Licht dahinter gedämpft
      const gx0 = 8, gx1 = 118, gy0 = 4, gy1 = 66;
      const glas = (x, y) => x >= gx0 && x < gx1 && y >= gy0 && y < gy1;
      const kx = 62, ky = 34, kr = 9;
      K.feld(gx0, gy0, gx1, gy1, ['#16161e', '#202029', '#2c2b35', '#3b3a43', '#504d53', '#6b6664'], (x, y) => .35 + Math.max(0, 1 - Math.hypot(x - kx, y - ky) / 70) * .4 + (B.fbm(x * .08, y * .1, K.seed, 2) - .5) * .25);
      // Der Kreis, mit dem Finger gewischt: klar, dahinter das Glimmen der Linse
      for (let y = ky - kr; y <= ky + kr; y++) for (let x = kx - kr; x <= kx + kr; x++) {
        const d = Math.hypot(x - kx, y - ky) / kr; if (d > 1) continue;
        const v = 1 - Math.hypot(x - kx - 1, y - ky + 1) / (kr * .9);
        K.set(x, y, v > .7 ? STRAHLK : v > .5 ? STRAHL : v > .25 ? '#d8c890' : v > 0 ? '#8a7a50' : STRAHLG);
        if (d > .82 && B.bay(x, y) < .5) K.set(x, y, '#8e877a');
      }
      // Wischspuren: Tropfen, die aus dem Kreis nach unten laufen
      for (const [x, l] of [[56, 10], [60, 6], [66, 12], [69, 5]]) for (let j = 0; j < l; j++) if (j % 3 !== 2) K.set(x, ky + kr - 1 + j, '#3b3a43');
      // Rautensprossen
      const spr = K.maske(); spr.fn(gx0, gy0, gx1, gy1, (x, y) => { const u = ((x - gx0) + (y - gy0) * .9) % 18, v = ((x - gx0) - (y - gy0) * .9 + 1800) % 18; return u < 1.3 || v < 1.3; });
      spr.rect(gx0 - 3, gy0 - 4, gx1 - gx0 + 6, 4); spr.rect(gx0 - 3, gy1, gx1 - gx0 + 6, 3); spr.rect(gx1, gy0, 4, gy1 - gy0);
      K.form(spr, 0, { k: EISEN, r: RAND_D, ton: 1.8, rand: 1, fase: 0 });
      K.licht(kx, ky, 34, STRAHLD, .9, { maske: (x, y) => !glas(x, y) || spr.has(x, y) });
      // Galerieboden und Geländer vorn
      const boden = K.maske(); boden.rect(0, 69, 160, 4); K.form(boden, 0, { k: EISEN, r: RAND, ton: 2, rand: 1, L: [0, -1] });
      const gel = K.maske(); gel.kap(0, 58, 160, 58, 1, 1); gel.kap(0, 64, 160, 64, .6, .6);
      for (let x = 4; x < 160; x += 22) gel.kap(x, 58, x, 90, 1, 1);
      // Eimer und Ledertuch auf dem Boden
      const ei = K.maske(); ei.poly([[124, 69], [126, 56], [140, 56], [142, 69]]); ei.ell(133, 56, 7, 1.8);
      K.form(ei, 0, { k: EISEN, r: RAND, ton: 2.2, rand: 1, L: [-1, -.4], muster: (x, y) => (y === 60 ? -1 : 0) });
      K.feld(126, 54, 141, 58, ['#0a0c10', '#141820'], (x, y) => Math.hypot((x - 133) / 6, (y - 56) / 1.4) < 1 ? .5 : -1);
      const tu = K.maske(); tu.rect(98, 65, 16, 4); tu.rect(99, 63, 14, 2);
      K.form(tu, 0, { k: ['#120a06', '#24140c', '#3a2214', '#52321e'], r: ['#8a5a30', '#d8a060'], ton: 2.2, rand: 1, L: [-1, -.4], muster: (x, y) => (y === 65 ? -1 : 0) });
      K.form(gel, 0, { k: EISEN, r: RAND, ton: 1.6, rand: 1, L: [-1, -.4] });
      K.feld(0, 73, 160, 90, MEER, (x, y) => .2 + (Math.sin(y * 1.8 + x * .05) > .9 ? .3 : 0));
      K.lichtquelle(kx, ky);
      K.vignette(.65, { cx: 66, cy: 40 });
    },

    // Schwarzes Meer unter der Klippe, darauf elf Lichterpaare, rot und grün, alle in einer Linie, die auf den Betrachter zeigt.
    leuchtturm_schiffe(K) {
      const { B } = K;
      K.himmel(30, HIMMEL, { steil: .5, basis: .25 });
      K.sterne(30, 24, ['#2a2a42', '#4a4a66', '#9a96b0']);
      // Meer: schwarz, ruhig
      K.feld(0, 30, 160, 90, MEER, (x, y) => .25 + Math.pow(1 - (y - 30) / 60, 3) * .5 + (Math.sin(y * 1.3 + Math.sin(x * .05) * 2) > .92 ? .25 : 0));
      // Elf Schiffe in einer Linie, vom Horizont auf dich zu
      for (let i = 0; i < 11; i++) {
        const z = 1 + i * .9, y = 30 + 40 / z, x = 82 - 6 / z, sp = Math.max(1, 14 / z), g = Math.max(.5, 3.4 / z);
        const yy = Math.round(y), xl = Math.round(x - sp), xr = Math.round(x + sp);
        K.licht(xl, yy, 2 + g * 2.2, '#0e3a1e', .8); K.licht(xr, yy, 2 + g * 2.2, '#4a1210', .8);
        if (g > 1.1) { const h = K.maske(); h.poly([[x - sp * 1.3, yy + 1], [x + sp * 1.3, yy + 1], [x + sp * .9, yy + 1 + g * 1.6], [x - sp * .9, yy + 1 + g * 1.6]]); h.kap(x, yy, x, yy - g * 2.4, .5, .4); K.form(h, 0, { k: ['#010204', '#030509', '#05080e'], ton: 1, rand: 0, fase: 0 }); }
        K.set(xl, yy, S_GRUEN); K.set(xr, yy, S_ROT);
        if (g > 1.2) { K.set(xl - 1, yy, '#2a8a4a'); K.set(xr + 1, yy, '#a8261c'); K.set(xl, yy - 1, '#2a8a4a'); K.set(xr, yy - 1, '#a8261c'); }
        if (g > 2) { K.rect(xl - 1, yy - 1, 2, 2, S_GRUEN); K.rect(xr, yy - 1, 2, 2, S_ROT); K.set(xl, yy - 1, '#c8ffd8'); K.set(xr, yy - 1, '#ffc0b0'); K.set(Math.round(x), yy - Math.round(g * 2.6), '#fff6d8'); }
        // Spiegelung im Wasser
        for (let k = 2 + Math.round(g * 1.6); k < 4 + g * 3.5; k++) if (k % 2) { K.set(xl, yy + k, '#1a4a2a'); K.set(xr, yy + k, '#5a1a14'); }
      }
      // Klippe vorn: Grasrand, Fels fällt ab
      const kl = K.maske(); kl.poly([[0, 72], [30, 74], [60, 80], [90, 78], [120, 82], [160, 76], [160, 90], [0, 90]]);
      K.form(kl, 0, { k: GRAS, r: RAND_D, ton: 1.6, rand: 1, L: [0, -1], muster: (x, y) => (B.hash(x, y, 4) < .1 ? .8 : 0) });
      const gr = K.maske(); for (let x = 0; x < 160; x += 2) { const y = 76 + Math.sin(x * .13) * 3; gr.kap(x, y, x + K.r.j(1.5), y - K.r.f(2, 5), .5, .4); }
      K.form(gr, 0, { k: GRAS, ton: 1.4, rand: 0, fase: 0 });
      K.vignette(.65, { cy: 52 });
    },

    // Eine Wäscheleine zwischen zwei Pfählen, ein triefendes Ölzeug, darunter auf dem Pflaster Tropfen, die nach oben fallen.
    leuchtturm_waesche(K) {
      const { B } = K;
      K.himmel(50, HIMMEL, { steil: .5 });
      // Der Strahl streicht von links oben herein und trifft die Wäsche
      // Strahl: gedithertes Band von links oben, innen heller
      { const ax = -20, ay = -16, wi = .4, ca = Math.cos(wi), sa = Math.sin(wi);
        for (let y = 0; y < 90; y++) for (let x = 0; x < 160; x++) { const dx = x - ax, dy = y - ay, d = dx * ca + dy * sa, q = Math.abs(-dx * sa + dy * ca) / (d * .14 + 2); if (q > 1 || d < 0) continue; const v = (1 - q) * Math.max(0, 1 - d / 230); if (v * 1.4 > B.bay(x, y)) K.e.add(x, y, [34, 30, 18], 1); if (v > .5 + B.bay(x, y) * .3) K.e.add(x, y, [30, 28, 16], 1); } }
      // Wärterhaus-Wand rechts hinten, Pflaster
      const haus = K.maske(); haus.rect(122, 10, 38, 50); K.form(haus, .2, { k: KALK.slice(1, 7), r: RAND_D, ton: 2, rand: 1, L: [-1, 0] });
      K.pflaster(56, 90, PFL, { vx: 80, ton: .32, dichte: 2.2 });
      // Pfähle und Leine, durchhängend
      const pf = K.maske(); pf.kap(18, 18, 18, 70, 1.4, 1.6); pf.kap(142, 16, 142, 68, 1.4, 1.6);
      K.form(pf, 0, { k: HOLZ, r: RAND, ton: 1.6, rand: 1, L: [-.8, -.6] });
      const leine = x => 20 + Math.pow((x - 80) / 62, 2) * -6 + 6;
      for (let x = 18; x <= 142; x++) K.set(x, leine(x), '#6b6664');
      // Wäsche: Kinderhemd, zwei Hosen, das Ölzeug in Männergröße
      const st = (x, w, h, form) => { const m = K.maske(), y = leine(x); form(m, x, y, w, h); return m; };
      const hemd = st(36, 12, 12, (m, x, y, w, h) => { m.rect(x - w / 2, y, w, h); m.poly([[x - w / 2, y], [x - w / 2 - 4, y + 5], [x - w / 2, y + 6]]); m.poly([[x + w / 2, y], [x + w / 2 + 4, y + 5], [x + w / 2, y + 6]]); });
      const h1 = st(58, 10, 22, (m, x, y, w, h) => { m.rect(x - w / 2, y, w, 6); m.rect(x - w / 2, y + 6, w / 2 - .5, h - 6); m.rect(x + .5, y + 6, w / 2 - .5, h - 6); });
      const h2 = st(76, 10, 20, (m, x, y, w, h) => { m.rect(x - w / 2, y, w, 6); m.rect(x - w / 2, y + 6, w / 2 - .5, h - 6); m.rect(x + .5, y + 6, w / 2 - .5, h - 6); });
      const oel = st(108, 22, 34, (m, x, y, w, h) => { m.poly([[x - w / 2, y], [x + w / 2, y], [x + w / 2 + 3, y + h], [x - w / 2 - 3, y + h]]); m.poly([[x - w / 2, y], [x - w / 2 - 7, y + 18], [x - w / 2 - 3, y + 20], [x - w / 2 + 1, y + 8]]); m.poly([[x + w / 2, y], [x + w / 2 + 7, y + 18], [x + w / 2 + 3, y + 20], [x + w / 2 - 1, y + 8]]); });
      K.lichtquelle(0, -10);
      K.form(hemd, 0, { k: KALK.slice(2, 8), r: RAND, ton: 2.6, rand: 1, L: [-.8, -.6] });
      K.form(h1, 0, { k: FELS, r: RAND, ton: 2.6, rand: 1, L: [-.8, -.6], muster: (x) => (x % 3 === 0 ? -.4 : 0) });
      K.form(h2, 0, { k: FELS, r: RAND, ton: 2.2, rand: 1, L: [-.8, -.6] });
      K.form(oel, 0, { k: ['#0e0c04', '#1e1a08', '#363010', '#54481a', '#7a6a26', '#a08a34'], r: ['#d8c070', '#fff1c0'], ton: 2.6, rand: 2, L: [-.8, -.6], muster: (x, y) => (Math.sin(x * .7 + y * .1) > .7 ? .8 : 0) + (y > leine(x) + 30 ? -.6 : 0) });
      // Tang aus der Tasche
      K.linie(102, 42, 100, 47, '#2a4a24'); K.linie(103, 42, 103, 48, '#3a5a2a');
      // Pfütze unter dem Ölzeug, und Tropfen, die von ihr nach oben fallen
      K.feld(92, 78, 126, 84, MEER.concat(['#1e2436']), (x, y) => Math.hypot((x - 109) / 16, (y - 81) / 2.6) < 1 ? .5 + (Math.sin(x) > .5 ? .2 : 0) : -1);
      const tr = B.rng(31);
      for (let i = 0; i < 14; i++) { const x = Math.round(tr.f(96, 122)), y = Math.round(B.lerp(78, 58, Math.pow(tr(), .8))); K.set(x, y, '#ece2c8'); K.set(x, y + 1, '#857a60'); if (y < 72) K.set(x, y + 3, '#3b3a43'); }
      K.vignette(.65, { cx: 90 });
    },

    // Ein weiß gekalktes Haus mit Sprossenfenstern, zwölf, und eine Frau im Schultertuch davor, die einen Finger hebt.
    leuchtturm_fenster(K) {
      const { B } = K;
      K.himmel(14, HIMMEL, { steil: .5 });
      // Hauswand frontal, gekalkt, im Widerschein des Strahls
      K.feld(0, 8, 160, 80, KALK, (x, y) => .38 + (B.fbm(x * .05, y * .06, K.seed, 2) - .5) * .18 - (y - 8) / 400);
      const dach = K.maske(); dach.poly([[0, 0], [160, 0], [160, 10], [0, 10]]); K.form(dach, 0, { k: FELS, r: RAND_D, ton: 1.6, rand: 1 });
      K.pflaster(78, 90, PFL, { vx: 80, ton: .3, dichte: 2.2 });
      // Zwölf Fenster: drei Reihen zu vier; das zwölfte (unten rechts) erleuchtet
      const fw = 16, fh = 18;
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const x = 14 + c * 36, y = 14 + r * 22, an = r === 2 && c === 3;
        if (an) K.feld(x, y, x + fw, y + fh, ['#6a4010', '#a06a20', '#d89a40', FENSTER, '#ffe0a8'], (px, py) => .55 + (1 - Math.hypot(px - x - fw / 2, py - y - fh / 2) / 12) * .5);
        else K.feld(x, y, x + fw, y + fh, ['#040408', '#08080f', '#0e0e18'], (px, py) => .3 + (py < y + 3 ? .3 : 0));
        const sp = K.maske(); sp.rect(x - 1, y - 1, fw + 2, fh + 2); sp.rect(x, y, fw, fh, 0); sp.rect(x + fw / 2 - .5, y, 1.4, fh); sp.rect(x, y + fh / 2 - .5, fw, 1.4);
        K.form(sp, 0, { k: KALK.slice(4, 9), r: RAND, ton: 2.4, rand: 1, fase: 0, L: [0, -1] });
        if (an) K.licht(x + fw / 2, y + fh / 2, 30, FENSTERG, .9, { maske: (px, py) => !(px >= x && px < x + fw && py >= y && py < y + fh) });
      }
      // Die Frau davor: Schultertuch, ein Finger gehoben, Silhouette vor der hellen Wand
      const fr = K.figurMaske(70, 88, 54, { kopf: 'kahl', blick: 1, arme: [[84, 41], [62, 66]], ellbogen: [[82, 54], null], weit: 1.2 });
      fr.poly([[56, 56], [84, 56], [80, 68], [60, 68]]);     // Schultertuch, dreieckig
      fr.ell(68, 44, 3.4, 3.4); fr.kap(84, 40, 84, 34, .7, .6);  // Haarknoten, der gehobene Finger
      K.form(fr, 0, { k: ['#040406', '#08080c', '#0e0e14', '#16161e'], ton: .8, rand: 0 });
      K.kante(fr, 130, 58, 70, WARMKANTE, { nah: .3 });
      K.lichtquelle(130, 58);
      K.vignette(.6, { cx: 80 });
    },

    // Dieselbe Seite wie vorher, darunter eine Zeile in anderer Hand, der letzte Buchstabe ausgelaufen.
    leuchtturm_eintrag(K) {
      const { B } = K;
      K.bretter(0, 0, 160, 90, HOLZ, { breite: 7, ton: .45 });
      // Näher: nur die rechte Seite, groß
      const s = K.maske(); s.poly([[14, 6], [150, 2], [154, 86], [10, 88]]);
      K.form(s, 0, { k: PAPIER, r: ['#bcb09a', '#efe6d2'], ton: 2.4, verlaufX: -1.4, verlauf: .3, rand: 1, L: [-.6, -.8], muster: (x) => (x < 20 ? -.8 : 0) });
      // die Striche in Fünferbündeln, wie zuvor
      for (let i = 0; i < 8; i++) striche(K, 24 + (i % 2) * 3, 9 + i * 6, 146, 11, '#2a2218');
      // die neue Zeile in anderer Hand: steiler, dunkler, frisch
      const y = 64, tinte = '#0a0a14';
      const r = B.rng(7); let x = 26;
      while (x < 112) { const l = r.i(3, 7); for (let i = 0; i < l; i++) { K.set(x + i, y + Math.round(Math.sin((x + i) * .9) * 1.2), tinte); if (i % 2) K.set(x + i, y - 2 + Math.round(Math.sin((x + i) * .9)), tinte); } x += l + 3; }
      // der letzte Buchstabe ausgelaufen: ein Fleck, der ins Papier zieht
      for (let yy = 58; yy < 78; yy++) for (let xx = 112; xx < 132; xx++) { const d = Math.hypot(xx - 120, (yy - 66) * 1.2) / 8 + (B.fbm(xx * .3, yy * .3, 5, 2) - .5) * .6; if (d >= 1) continue; const c = d < .45 ? tinte : d < .75 ? '#1a1a2a' : (B.bay(xx, yy) < .5 ? '#3a3846' : null); if (c) K.set(xx, yy, c); }
      for (let j = 0; j < 9; j++) if (j % 3 !== 2) K.set(121, 75 + j, '#2a2838');
      // Lampenlicht von links oben
      K.licht(20, 0, 110, '#3a2a10', .7, { maske: (px, py) => s.has(px, py) });
      K.lichtquelle(20, -20);
      K.vignette(.7, { cx: 96, cy: 58 });
    },

    // Der rot-weiß gestreifte Turm von unten, der Strahl senkrecht herab wie ein Stab aus Licht, darin ein kleiner Mensch.
    leuchtturm_marke(K) {
      const { B } = K;
      K.himmel(90, HIMMEL, { steil: .55, basis: .1 });
      K.sterne(30, 70, ['#2a2a42', '#4a4a66', '#9a96b0']);
      // Turm von unten: unten breit, oben schmal, starke Flucht nach oben
      const tx = 80, tb = 92, tt = 14, wb = 70, wt = 14;
      const rumpf = K.maske(); rumpf.poly([[tx - wb / 2, tb], [tx - wt / 2, tt], [tx + wt / 2, tt], [tx + wb / 2, tb]]);
      const bandAn = y => Math.floor(Math.pow((tb - y) / (tb - tt), .6) * 7) % 2 === 1;
      K.form(rumpf, 0, { k: KALK.slice(2, 10), r: RAND, ton: 3.8, verlaufX: -3, rand: 1, L: [-.8, -.6], muster: (x, y) => (B.fbm(x * .1, y * .1, 3, 2) - .5) * .6 });
      const band = K.maske(); band.fn(0, 0, 160, 90, (x, y) => rumpf.has(x, y) && bandAn(y));
      K.form(band, 0, { k: ROT, r: ['#ad3d28', '#d86a4a'], ton: 4.6, verlaufX: -3.4, rand: 1, fase: 0, L: [-.8, -.6] });
      // Galerie und Laterne oben
      const gal = K.maske(); gal.rect(tx - wt / 2 - 5, tt - 2, wt + 10, 2); for (let i = 0; i <= 6; i++) gal.rect(tx - wt / 2 - 5 + i * (wt + 10) / 6, tt - 5, 1, 3); gal.rect(tx - wt / 2 - 5, tt - 6, wt + 10, 1);
      K.form(gal, 0, { k: EISEN, ton: 1.6, fase: 0, rand: 0 });
      const lx = tx, ly = tt - 9;
      K.licht(lx, ly, 34, STRAHLG, 1);
      for (let y = ly - 3; y <= ly + 2; y++) for (let x = lx - 5; x <= lx + 5; x++) K.set(x, y, Math.abs(x - lx) < 2 ? STRAHLK : STRAHL);
      const haube = K.maske(); haube.poly([[lx - 7, ly - 3], [lx, ly - 9], [lx + 7, ly - 3]]); K.form(haube, 0, { k: EISEN, ton: 1.4, rand: 0 });
      // Der Strahl: senkrecht herab vor dem Turm, wie ein Stab aus Licht, unten etwas breiter
      const sx = lx;
      for (let y = ly + 3; y < 90; y++) { const w = 3 + (y - ly) * .06; for (let x = Math.floor(sx - w - 3); x <= sx + w + 3; x++) {
        const d = Math.abs(x + .5 - sx) / w, b = B.bay(x, y);
        if (d < .55) K.set(x, y, y % 9 ? STRAHL : STRAHLK); else if (d < 1) { if ((1 - d) * 2.2 > b) K.set(x, y, '#d8c890'); else K.e.add(x, y, [70, 62, 40], 1); } else if (d < 1.8 && (1.8 - d) * .8 > b) K.e.add(x, y, [50, 44, 28], 1);
      } }
      // Am Fuß: ein Lichtfleck, darin der kleine Mensch, das Gesicht nach oben
      for (let y = 80; y < 90; y++) for (let x = sx - 18; x <= sx + 18; x++) { const q = Math.hypot((x - sx) / 18, (y - 86) / 4); if (q >= 1) continue; const c = q < .35 ? '#fffbe8' : q < .6 ? '#d8c890' : (B.bay(x, y) < 1 - q ? '#8a7a50' : null); if (c) K.set(x, y, c); }
      const mensch = K.figurMaske(sx, 87, 13, { kopf: 'kahl', arme: [[sx - 2.5, 80], [sx + 2.5, 80]] });
      K.form(mensch, 0, { k: ['#0a0806', '#14100c', '#1e1812', '#2a2218'], ton: .6, rand: 0, fase: 0 });
      K.lichtquelle(lx, ly);
      K.vignette(.6, { cx: 80 });
    },
  },
};
