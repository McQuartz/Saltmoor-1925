// Ereignisbilder 160 × 90 · Die Funkstation am Pol (data/biome/funkstation.json).
// Palette der Station (prototype/js/scenes/world/funkstation.js): Bakelit-Braun, Schnee warmweiß im Lampenlicht,
// Röhrenorange als einzige warme Lichtfarbe; Papierstreifen, Kupfer, schwarzes Eis.
'use strict';

const SCHNEE = ['#0c0908', '#15100d', '#1f1814', '#2a221d', '#372d26', '#463a31', '#574940', '#6b5a4e', '#837063', '#9e897a', '#bba595', '#d6c3b2'];
const EIS = ['#020101', '#060404', '#0b0807', '#110c0a', '#18110d', '#201712'];
const HIMMEL = ['#040303', '#080606', '#0d0a08', '#130e0c', '#1a1410', '#231a15'];
const HOLZ = ['#070504', '#0f0a07', '#18100b', '#231710', '#301f15', '#3f291b', '#523524'];
const DUNKEL = ['#060403', '#0d0806', '#160e0a', '#22160f'];
const PAP = ['#2c241e', '#54473c', '#8c7a66', '#cbb8a2', '#ece0d2'];
const OR = '#ff8a2a', OR_K = '#fff2d6', OR_G = '#3a1a08', OR_G2 = '#5c2a0e', ROT = '#d06a1c';
const KUPFER = ['#4e2a16', '#7a4222', '#a85c30', '#c0703e'];
const MORSE = [1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1];

// Plankenwand innen: senkrechte Bretter, Fugen dunkel, ruhig
function wand(K, y1, hell) {
  const { B } = K;
  K.feld(0, 0, 160, y1, HOLZ.slice(0, 5), (x, y) => { const pl = Math.floor((x + 3) / 9), fuge = ((x + 3) % 9) === 0; return fuge ? .02 : .16 + B.hash(pl, 2, K.seed) * .1 + (hell || 0) + (B.fbm(x * .05, y * .2, pl, 2) - .5) * .08; });
}
function dielen(K, y0) {
  const { B } = K;
  K.feld(0, y0, 160, 90, HOLZ.slice(0, 5), (x, y) => { const X = (x - 80) / Math.max(1, y - y0 + 6), pl = Math.floor(X * 6), fuge = Math.abs((X * 6) % 1) < .08; return fuge ? .05 : .2 + B.hash(pl, 5, K.seed) * .1; });
}
// Papierstreifen als Band entlang Punkten, mit Punkten und Strichen
function streifen(K, pts, b) {
  let s = 0;
  for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
    for (let k = 0; k <= n; k++) { const q = k / n, x = x0 + (x1 - x0) * q, y = y0 + (y1 - y0) * q; s++; for (let j = 0; j < b; j++) K.set(x, y + j, j === 0 ? PAP[4] : PAP[3]); if (MORSE[(s >> 1) % MORSE.length] && b > 1) K.set(x, y + b - 1, PAP[1]); } }
}
// Gittermast als Maske
function mastMaske(K, x, yb, yt, wb) {
  const m = K.maske(), wt = Math.max(1.4, wb * .3), st = Math.max(5, (yb - yt) / 10);
  const L = y => x - wb / 2 + (wb - wt) / 2 * (yb - y) / (yb - yt), R = y => x + wb / 2 - (wb - wt) / 2 * (yb - y) / (yb - yt);
  m.kap(L(yb), yb, L(yt), yt, 1, .7); m.kap(R(yb), yb, R(yt), yt, 1, .7);
  let yp = yb; for (let y = yb - st; y > yt; y -= st) { m.kap(L(y), y, R(y), y, .6, .6); m.kap(L(yp), yp, R(y), y, .5, .5); m.kap(R(yp), yp, L(y), y, .5, .5); yp = y; }
  return { m, L, R };
}

module.exports = {
  biom: 'funkstation',
  bilder: {
    // Ein Tisch mit einem Röhrenempfänger, vier glühende Röhren, eine Taste, eine Petroleumlampe; ein Papierstreifen hängt über die Kante bis auf die Dielen.
    funkstation_morsetisch(K) {
      wand(K, 62, .1); dielen(K, 62); K.licht(74, 34, 60, '#24140a', .9);
      K.lichtquelle(118, 30);
      // Tisch
      const t = K.maske(); t.rect(14, 52, 128, 5); t.rect(20, 56, 3, 24); t.rect(134, 56, 3, 24); K.form(t, 0, { k: HOLZ.slice(1, 6), r: ['#7a5a44', '#d8bea0'], ton: 1.4, fase: 1 });
      // Empfänger
      const e = K.maske(); e.rect(48, 34, 52, 18); K.form(e, 0, { k: HOLZ.slice(0, 5), ton: 1.1, fase: 1, rand: 2, r: ['#a48a74', '#e0cdb8'], L: [.6, -.8], muster: (px, py) => (py === 35 ? 1.4 : 0) });
      for (let i = 0; i < 3; i++) { K.set(56 + i * 9, 43, KUPFER[3]); K.set(57 + i * 9, 43, KUPFER[1]); }
      K.rect(82, 39, 12, 8, '#0d0806'); for (let x = 83; x < 93; x++) K.set(x, 42, OR_G2); K.set(87, 42, OR);
      for (let i = 0; i < 4; i++) { const rx = 54 + i * 12, ry = 28; const r = K.maske(); r.ell(rx, ry, 2.6, 5); K.form(r, 0, { k: ['#3a1a08', '#7a3a12', ROT, OR], ton: 1.4, fase: 1, rand: 0 }); K.set(rx, ry, OR); K.licht(rx, ry, 9, OR_G2, .6); }
      // Taste
      const ta = K.maske(); ta.rect(24, 48, 14, 4); ta.kap(25, 47, 36, 45, .8, .8); K.form(ta, 0, { k: KUPFER, ton: 1.3, fase: 0, rand: 1, r: ['#c0703e', '#e2a070'] });
      // Lampe (die helle Stelle)
      const la = K.maske(); la.rect(114, 46, 8, 6); la.ell(118, 38, 4, 6); K.form(la, 0, { k: DUNKEL, ton: 1.6, fase: 0, rand: 1 });
      K.licht(118, 36, 60, '#3a2010', .9); K.flamme(118, 39, { gross: 1.3, hof: 0 });
      // Streifen aus dem Schreiber über die Kante in Schleifen auf die Dielen
      streifen(K, [[96, 50], [104, 52], [106, 56], [102, 64], [108, 72], [101, 80], [96, 86], [112, 88], [126, 85]], 2);
      K.vignette(.7);
    },
    // Der Fuß eines Gittermastes im Schnee, lange Eisfäden hängen von den Seilen; hoch oben eine dunkle Gestalt, darüber ein glühender Isolator.
    funkstation_mast(K) {
      const { B } = K;
      K.himmel(70, HIMMEL, { gx: 84, gb: 40, basis: .08, steil: .5 }); K.licht(80, 24, 40, '#2a1c14', .9);
      K.sterne(30, 50, ['#2e241e', '#5a4a3e']);
      K.feld(0, 68, 160, 90, SCHNEE.slice(1, 9), (x, y) => .25 + (y - 68) / 22 * .2 + Math.max(0, .35 - Math.abs(x - 84) / 80) + (Math.abs(((x * .3 + y) % 7) - 3.5) < .4 ? -.12 : 0) + (B.fbm(x * .05, y * .2, 3, 2) - .5) * .2);
      K.lichtquelle(84, 4);
      const { m, L, R } = mastMaske(K, 84, 76, 2, 22); K.form(m, 0, { k: DUNKEL, ton: 1.2, fase: 0, rand: 1, r: ['#8a7262', '#e0cdb8'] });
      // Seile mit Eishaar
      for (const [fy, ax] of [[14, 4], [14, 156], [36, 22], [36, 140]]) { const sx = (L(fy) + R(fy)) / 2, n = Math.ceil(Math.hypot(ax - sx, 74 - fy)); for (let i = 0; i <= n; i++) { const q = i / n, x = sx + (ax - sx) * q, y = fy + (74 - fy) * q; K.set(x, y, '#1a120d'); if (i % 2 === 0 && q > .05 && q < .95) { const l = Math.round(2 + B.hash(i, fy, 7) * 7 * (1 - Math.abs(q - .4))); for (let j = 1; j <= l; j++) K.set(x, y + j, j < 3 ? SCHNEE[10] : SCHNEE[7]); } } }
      // Gestalt im Gitter, Kopf zu dir
      const g = K.maske(); g.ell(76, 28, 5.5, 8); g.ell(72, 18, 3.6, 4); g.kap(80, 22, 88, 14, 1.6, 1.2); g.kap(73, 26, 66, 34, 1.5, 1.2); g.kap(74, 35, 82, 44, 1.8, 1.4); g.kap(78, 35, 72, 46, 1.8, 1.4); K.form(g, 0, { k: DUNKEL, ton: .7, fase: 0, rand: 2, r: ['#a48a74', '#e0cdb8'] });
      for (let j = 0; j < 34; j++) for (const dx of [-4, -2, 0, 2]) if (B.hash(dx, j, 3) < .85 - j * .015) K.set(72 + dx, 22 + j, j < 8 ? SCHNEE[10] : SCHNEE[7]);
      K.set(70, 18, OR); K.set(73, 18, OR_G2);
      // Isolator, die helle Stelle
      K.licht(84, 2, 22, OR_G, .9); K.set(84, 1, OR_K); K.set(83, 1, OR); K.set(85, 1, OR); K.set(84, 2, OR);
      K.vignette(.6);
    },
    // Drei Reihen Kojen aus Planken, zugeschnürte Schlafsäcke darin, eine Laterne auf dem Boden; der unterste Sack ist offen.
    funkstation_kojen(K) {
      const { B } = K;
      wand(K, 74, -.05); dielen(K, 74);
      K.lichtquelle(124, 76);
      for (let r = 0; r < 3; r++) {
        const y = 20 + r * 20, b = K.maske(); b.rect(10, y, 100, 3); b.rect(10, y - 18, 3, 21); b.rect(107, y - 18, 3, 21); K.form(b, 0, { k: HOLZ.slice(1, 6), r: ['#7a5a44', '#d8bea0'], ton: 1.4, fase: 1 });
        for (let s = 0; s < 2; s++) { const sx = 18 + s * 46; if (r === 2 && s === 1) { const o = K.maske(); o.ell(sx + 18, y - 4, 20, 5); K.form(o, 0, { k: ['#2a2018', '#3e3024', '#54443a', '#6e5c4c'], ton: 1.2, fase: 1 }); const h = K.maske(); h.ell(sx + 10, y - 5, 6, 2.6); K.form(h, 0, { k: ['#000000', '#050302'], ton: 0, fase: 0, rand: 0 }); continue; }
          const sa = K.maske(); sa.ell(sx + 18, y - 6, 19, 6); sa.ell(sx + 2, y - 7, 5, 5); K.form(sa, 0, { k: ['#120c09', '#1e150f', '#2a1e16', '#3a2a1e', '#4c3828'], ton: 1.7, fase: 1, rand: 1, r: ['#6a5040', '#a48a74'], lichtVon: [124, 76], muster: (px) => (Math.abs(((px - sx) % 7) - 3.5) < .5 ? -.6 : 0) });
          for (let i = 0; i < 6; i++) K.set(sx + 6 + i * 4, y - 9 + (i % 2), PAP[2]); }
      }
      // Laterne am Boden
      K.laterne(124, 82, 1.4, { hof: 50 });
      K.vignette(.65);
    },
    // Ein rundes Loch im schwarzen Eis mit einem Wall aus Schnee, ein straffer Draht führt hinein; tief unten ein orange Schimmer.
    funkstation_eisloch(K) {
      const { B } = K;
      K.himmel(36, HIMMEL, { basis: .05, steil: .4 });
      K.sterne(14, 26, ['#2e241e', '#5a4a3e']);
      K.feld(0, 34, 160, 90, EIS.concat(SCHNEE.slice(4, 8)), (x, y) => { const fl = B.fbm(x * .03, y * .08, 4, 3); return fl > .55 ? .62 + (y - 34) / 56 * .25 : .15 + (y - 34) / 56 * .2 + (Math.abs(((x * .7 + y * 1.4) % 13) - 6.5) < .4 ? .3 : 0); });
      // Morselichter unter dem Eis, auf das Loch zu
      for (let i = 0; i < 9; i++) { const q = i / 8, x = 150 - q * 66, y = 86 - q * 26, w = Math.max(1, 3 - q * 2); if (MORSE[i + 3]) { K.licht(x, y, 5 + w * 2, OR_G, .6); for (let k = -w; k <= w; k++) K.set(x + k, y, i % 3 ? ROT : OR); } else K.set(x, y, OR_G2); }
      // Wall und Loch
      const wa = K.maske(); wa.ell(80, 60, 34, 10); K.form(wa, 0, { k: SCHNEE.slice(2, 10), r: ['#a48a74', '#ece0d2'], ton: 1.8, fase: 2, verlauf: .3 });
      const lo = K.maske(); lo.ell(80, 60, 24, 6.5); K.form(lo, 0, { k: ['#000000', '#050302', '#120805', '#2a1206', '#5c2a0e'], ton: 0, fase: 0, rand: 0, muster: (px, py) => Math.max(0, 1 - Math.hypot((px - 80) / 14, (py - 62) / 3.5)) * 4 });
      K.licht(80, 62, 20, OR_G2, .9); K.set(80, 62, OR_K); K.set(79, 62, OR); K.set(81, 62, OR);
      // Draht von oben links, straff
      K.linie(6, 0, 78, 60, '#1a120d'); K.linie(7, 0, 79, 60, '#3a2c22');
      K.vignette(.6);
    },
    // Ein aufgeschlagenes Logbuch unter einer Petroleumlampe, links ordentliche Zeilen, rechts eine Seite voller Punkte und Striche.
    funkstation_logbuch(K) {
      const { B } = K;
      K.fuell(HOLZ.slice(0, 5), (x, y) => .18 + (B.fbm(x * .03, y * .3, 2, 2) - .5) * .15 + (((y + 1) % 11) === 0 ? -.15 : 0));
      K.lichtquelle(132, 14);
      const b = K.maske(); b.poly([[22, 28], [78, 32], [136, 26], [140, 78], [78, 84], [18, 80]]); K.form(b, 0, { k: PAP, r: [PAP[3], PAP[4]], ton: 2.5, fase: 0, rand: 1, muster: (px, py) => (Math.abs(px - 78) < .8 ? -1.8 : 0) + (Math.hypot(px - 132, py - 14) < 60 ? .5 : 0) });
      for (let i = 0; i < 9; i++) { const y = 36 + i * 5; for (let x = 28; x < 72; x++) if ((x * 7 + i) % 9 < 6 && x < 70 - (i % 3) * 6) K.set(x, y + (x - 28) * .06, PAP[1]); }
      let s = 0; for (let i = 0; i < 9; i++) { const y = 34 + i * 5; for (let x = 84; x < 132; x++) { s++; const bit = MORSE[(Math.floor(x / 3) + i * 5) % MORSE.length]; if (bit && (x % 3) !== 2) K.set(x, y - (x - 84) * .05, (x % 3) === 0 && bit ? '#2a1a10' : PAP[1]); } }
      K.set(108, 46, '#000000'); K.set(109, 46, '#000000');
      const la = K.maske(); la.ell(132, 14, 5, 7); la.rect(127, 20, 10, 4); K.form(la, 0, { k: DUNKEL, ton: 1.4, fase: 0, rand: 1 });
      K.flamme(132, 15, { gross: 1.4, hof: 0 });
      K.vignette(.7);
    },
    // Ein Pult vor einem hohen Röhrenschrank, darauf ein ausgefülltes Formular und ein Bleistift; die Röhren glühen durch das Gitter.
    funkstation_antwort(K) {
      const { B } = K;
      wand(K, 72, .08); dielen(K, 72); K.licht(80, 28, 70, '#24140a', .9);
      K.lichtquelle(80, 20);
      const s = K.maske(); s.rect(48, 6, 64, 66); s.rect(44, 3, 72, 4); K.form(s, 0, { k: HOLZ.slice(0, 5), ton: 1.2, fase: 1, rand: 2, r: ['#a48a74', '#e0cdb8'], L: [.6, -.8] });
      K.rect(56, 12, 48, 30, '#0d0806'); for (let x = 56; x < 104; x += 4) for (let y = 12; y < 42; y++) K.set(x, y, '#1e120c');
      for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) { const x = 62 + i * 12, y = 18 + r * 13; K.licht(x, y + 3, 9, OR_G2, .7); for (let j = 0; j < 5; j++) K.set(x, y + j, j === 2 ? OR : ROT); }
      // Pult und Formular (die helle Stelle)
      const p = K.maske(); p.poly([[30, 64], [130, 60], [134, 66], [26, 70]]); p.rect(30, 70, 3, 20); p.rect(126, 66, 3, 24); K.form(p, 0, { k: HOLZ.slice(1, 6), r: ['#7a5a44', '#d8bea0'], ton: 1.5, fase: 1 });
      const f = K.maske(); f.poly([[62, 60], [94, 58], [96, 64], [60, 66]]); K.form(f, 0, { k: PAP, r: [PAP[3], PAP[4]], ton: 3.6, fase: 0, rand: 1 });
      for (let i = 0; i < 3; i++) K.linie(64, 61 + i * 1.6, 84 - i * 6, 60 + i * 1.6, PAP[1]);
      K.linie(100, 63, 112, 60, '#7a4222'); K.set(100, 63, '#1a120d');
      K.licht(80, 30, 70, '#2a1608', .6);
      K.vignette(.7);
    },
  },
};
