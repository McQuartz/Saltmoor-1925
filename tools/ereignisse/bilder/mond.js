// Ereignisbilder 160 × 90 · Der Mond unter dem Eis (data/biome/mond.json).
// Palette des Mondes (prototype/js/scenes/world/mond.js): warmgraue Asche, schwarzes Eis als Himmel,
// bleiches Gelb von jenseits des stark gekrümmten Horizonts; Messing der Expedition von 1890, weiße Kreide.
'use strict';

const EIS = ['#020202', '#050505', '#090908', '#0e0e0c', '#141411', '#1b1a17', '#24231f', '#2f2d28'];
const STAUB = ['#070706', '#0d0d0b', '#141412', '#1c1b18', '#25241f', '#302e29', '#3d3b34', '#4c4a42', '#5e5b52', '#726e63', '#888478', '#a19c8e', '#bab4a4', '#d2ccba'];
const LICHTR = ['#1a1912', '#26241a', '#353222', '#47432c', '#5c5636', '#746c42', '#90864f', '#ada15e', '#c9bb72', '#e2d38a'];
const GELB = '#efe07c', GELB_K = '#fffbe2', GELB_G = '#2a2614', GELB_G2 = '#433d1f';
const MESS = ['#2a2412', '#4a3e1c', '#76632c', '#9c8546', '#cdb878'];
const SEIL = ['#0a0806', '#16120c', '#241d13', '#352b1c', '#4a3c27'];
const HOLZ = ['#0a0806', '#16110c', '#241c13', '#34291c', '#463826'];
const RAND = ['#83837d', '#dddcd4'];
const DUNKEL = ['#050505', '#0a0a09', '#121210', '#1a1a17'];
const KREIDE = '#e8e6dc';

// ---------- eigene Bausteine ----------
// Himmel: schwarzes Eis mit flachen Platten; Zapfen, die zur Mitte zeigen
function eisdecke(K, y1, o) {
  o = o || {}; const { B } = K;
  K.feld(0, 0, 160, y1, EIS, (x, y) => {
    const fuge = Math.abs(Math.sin(x * .07 + Math.sin(y * .3) * 1.5) * Math.sin(y * .45 + x * .02)) < .06 ? .15 : 0;
    return .12 + fuge + B.fbm(x * .04, y * .1, K.seed, 2) * .15 + (y / y1) * .12;
  });
  const r = B.rng(K.seed + 3), m = K.maske();
  for (let i = 0; i < (o.zapfen === undefined ? 8 : o.zapfen); i++) { const x = r.f(0, 160), l = r.f(4, 12), w = r.f(1, 2.2), zx = (80 - x) * .08; m.poly([[x - w, -1], [x + w, -1], [x + zx, l]]); }
  K.form(m, .1, { k: EIS.slice(2, 8), r: ['#6a6862', '#bdb9ae'], ton: 1.6, fase: 0, rand: 1 });
}
// Gekrümmter Horizont: Kante y(x); dahinter bleicher Schein bei gx; darunter Asche
function horizont(K, hy, krumm) { return x => hy + Math.pow((x - 80) / 80, 2) * krumm; }
function schein(K, gx, gy, rx, ry, st, o) {
  o = o || {}; const { B } = K;
  K.feld(gx - rx, gy - ry, gx + rx, gy + 2, LICHTR, (px, py) => {
    if (o.nurUeber && !o.nurUeber(px, py)) return -1;
    const q = Math.hypot((px - gx) / rx, (py - gy) / ry); if (q > 1) return -1;
    const v = Math.pow(1 - q, 1.4) * st; return v < .05 + B.bay(px, py) * .05 ? -1 : v;
  });
}
// Asche: Boden unterhalb der Kante, zum Horizont heller (Gegenlicht), mit kleinen Kratern
function asche(K, kante, o) {
  o = o || {}; const { B } = K, s = K.seed;
  K.feld(0, 0, 160, 90, STAUB.slice(0, o.bis || 9), (x, y) => {
    const k = kante(x); if (y < k) return -1;
    const d = y - k, nah = Math.exp(-d / (o.abfall || 8));
    return .1 + nah * (o.hell === undefined ? .45 : o.hell) * Math.exp(-(((x - (o.gx || 80)) / (o.gb || 90)) ** 2)) + (B.fbm(x * .06, y * .14, s, 2) - .5) * .18 + (B.hash(x >> 1, y, 31) < .04 ? -.15 : 0);
  });
  // Kante: hell gesäumt vom Licht dahinter
  for (let x = 0; x < 160; x++) { const k = Math.round(kante(x)), v = Math.exp(-(((x - (o.gx || 80)) / (o.gb || 60)) ** 2)); if (v > B.bay(x, k) * .8) K.set(x, k, v > .6 ? STAUB[11] : STAUB[8]); }
}
// Ziffern 3 × 5 (Kreide)
const ZIFF = {
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'], 2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '011', '001', '111'], 4: ['101', '101', '111', '001', '001'],
  5: ['111', '100', '111', '001', '111'], 6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'], 8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111'],
};
function zahl(K, x, y, n, col, o) {
  o = o || {}; const s = String(n);
  for (let i = 0; i < s.length; i++) { const g = ZIFF[s[i]]; for (let j = 0; j < 5; j++) for (let k = 0; k < 3; k++) if (g[j][k] === '1' && (!o.wisch || K.B.hash(x + i * 4 + k, y + j, 9) > o.wisch)) K.set(x + i * 4 + k, y + j, col); }
}
// Klappstuhl von der Seite (Holz, X-Gestell, Leinwand): Fuß (x, yb), Höhe h
function klappstuhlMaske(K, x, yb, h) {
  const m = K.maske(), k = h / 24;
  m.kap(x - 6 * k, yb, x + 6 * k, yb - 12 * k, .9 * k, .8 * k); m.kap(x + 6 * k, yb, x - 6 * k, yb - 12 * k, .9 * k, .8 * k);
  m.rect(x - 7 * k, yb - 13 * k, 14 * k, 2 * k);
  m.kap(x - 6 * k, yb - 12 * k, x - 8 * k, yb - 24 * k, .8 * k, .7 * k);
  m.poly([[x - 8 * k, yb - 23 * k], [x - 6.4 * k, yb - 14 * k], [x - 5 * k, yb - 15 * k], [x - 6.5 * k, yb - 23.5 * k]]);
  return m;
}
// Aufgeschlagenes Buch, schräg von oben
function buch(K, x, y, w, o) {
  o = o || {}; const h = w * .44, m = K.maske();
  m.poly([[x - w / 2, y - h / 2 + 1], [x, y - h / 2 + 2], [x + w / 2, y - h / 2], [x + w / 2 + 1, y + h / 2], [x, y + h / 2 + 1], [x - w / 2 - 1, y + h / 2 + 1]]);
  const PAP = ['#2c2a24', '#56524a', '#8e897c', '#c4beac', '#e8e2d0'];
  K.form(m, 0, { k: PAP, r: [PAP[3], PAP[4]], ton: o.ton || 3.2, fase: 0, rand: 1, L: [0, -1], muster: (px) => (Math.abs(px - x) < .8 ? -1.6 : 0) });
  return { m, h };
}

module.exports = {
  biom: 'mond',
  bilder: {
    // Eine Strickleiter verschwindet senkrecht im schwarzen Eis; auf den Sprossen weiße Kreidezahlen, die unterste ohne Zahl.
    mond_leiter(K) {
      const { B } = K;
      const kante = horizont(K, 66, 10);
      eisdecke(K, 70, { zapfen: 6 });
      schein(K, 128, 66, 70, 30, .8, { nurUeber: (x, y) => y < kante(x) });
      asche(K, kante, { gx: 128, gb: 50, hell: .5 });
      K.lichtquelle(128, 62);
      // Das Loch im Eis oben, aus dem die Leiter kommt
      const lx = 70;
      const loch = K.maske(); loch.ell(lx, 0, 13, 4); K.form(loch, 0, { k: ['#000000', '#000000', '#020202', '#050505'], ton: 0, fase: 0, rand: 0 });
      for (let x = lx - 13; x <= lx + 13; x++) { const y = Math.round(Math.sqrt(Math.max(0, 1 - ((x - lx) / 13) ** 2)) * 4); K.set(x, y, EIS[7]); K.set(x, y + 1, EIS[5]); }
      // Holme und Sprossen
      const hl = K.maske(); hl.pfad([[lx - 9, 0], [lx - 9.3, 40], [lx - 9, 80]], .8, .8); hl.pfad([[lx + 9, 0], [lx + 9.3, 40], [lx + 9, 80]], .8, .8);
      K.form(hl, 0, { k: SEIL, r: ['#6a5a40', '#b8a07a'], ton: 2.4, fase: 0, rand: 1, muster: (x, y) => ((x + y) % 3 === 0 ? -.8 : 0) });
      // Seilenden, die im Staub liegen
      K.linie(lx - 9, 80, lx - 13, 84, SEIL[3]); K.linie(lx + 9, 80, lx + 14, 83, SEIL[3]);
      const spr = [], n = 10;
      for (let i = 0; i < n; i++) spr.push(Math.round(7 + i * 7.6));
      for (const y of spr) { const s = K.maske(); s.rect(lx - 9, y, 19, 2); K.form(s, 0, { k: HOLZ, r: ['#7a6448', '#c8b088'], ton: 2.6, fase: 0, rand: 1, L: [.3, -1] }); }
      // Kreidezahlen, von oben nach unten gezählt; auf der untersten steht keine
      for (let i = 0; i < n - 1; i++) {
        const num = 404 + i, y = spr[i] - 6, x = lx - 5;
        zahl(K, x, y, num, i < 3 ? STAUB[9] : i < 6 ? STAUB[11] : KREIDE, { wisch: i < 3 ? .3 : .08 });
      }
      // Die unterste: ohne Zahl, im Licht
      K.licht(lx, spr[n - 1] - 2, 14, GELB_G, .9);
      K.vignette(.75, { cx: 76, cy: 46 });
    },

    // Eine Lampe auf einem Kraterwall; unten im Rund ein gedeckter Tisch mit zwei Tassen, ein Stuhl schräg.
    mond_krater(K) {
      const { B } = K;
      const kante = horizont(K, 30, 8);
      eisdecke(K, 34, { zapfen: 7 });
      schein(K, 30, 30, 60, 18, .5, { nurUeber: (x, y) => y < kante(x) });
      asche(K, kante, { gx: 40, gb: 60, hell: .3, abfall: 6 });
      // Der Krater: Wall als Ring, Mulde dunkel; die Lampe auf dem Wall hinten rechts
      const cx = 80, cy = 62, rx = 66, ry = 22;
      const wall = K.maske(); wall.ell(cx, cy, rx + 6, ry + 5); wall.ell(cx, cy + 1, rx - 2, ry - 3, 0);
      const lmp = [112, cy - ry - 2];
      K.lichtquelle(lmp[0], lmp[1]);
      K.form(wall, 0, { k: STAUB.slice(1, 9), r: ['#8e8a7e', '#d6d1c0'], ton: 2.4, verlauf: -1, fase: 1.5, rand: 1, muster: (x, y) => (B.fbm(x * .1, y * .2, 4, 2) - .5) * 1.2 });
      K.feld(0, 0, 160, 90, STAUB.slice(0, 7), (x, y) => { const q = Math.hypot((x - cx) / (rx - 2), (y - cy - 1) / (ry - 3)); if (q >= 1) return -1; return .12 + (1 - q) * .1 + (y - cy) / ry * .12 + (B.fbm(x * .08, y * .16, 6, 2) - .5) * .15; });
      // Lampe auf dem Wall: Sturmlaterne, warm, die einzige Lampe weit und breit
      K.laterne(lmp[0], lmp[1], 1, { hof: 70 });
      K.licht(lmp[0] - 20, cy + 6, 50, GELB_G, .9, { oval: 2 });
      // Tisch mit weißem Tuch, zwei Tassen, ein Stuhl zurückgeschoben
      const tx = 74, ty = 66;
      const tisch = K.maske(); tisch.ell(tx, ty, 14, 4.2); tisch.rect(tx - 14, ty, 28, 6); tisch.ell(tx, ty + 6, 14, 2);
      K.form(tisch, 0, { k: ['#2a2822', '#56524a', '#8e897c', '#c4beac', '#e8e2d0'], r: ['#c4beac', '#e8e2d0'], ton: 1.9, verlauf: 1, fase: 1, rand: 1, muster: (x, y) => (y > ty + 1 && (x % 3 === 0) ? -.6 : 0) });
      const bein = K.maske(); bein.rect(tx - 10, ty + 7, 1.5, 6); bein.rect(tx + 9, ty + 7, 1.5, 6); K.form(bein, 0, { k: HOLZ, ton: 1.6, fase: 0, rand: 0 });
      for (const [x, y] of [[tx - 6, ty - 1], [tx + 5, ty - 2]]) { K.rect(x - 2, y, 5, 1, '#3a382f'); K.rect(x - 1, y - 3, 3, 3, '#fffbe2'); K.set(x - 1, y - 1, '#a8a290'); K.set(x + 2, y - 2, '#e8e2d0'); K.set(x + 3, y - 2, '#5a564c'); K.set(x, y - 3, '#3a2a18'); }
      K.set(tx + 5, ty - 5, '#6a6458'); K.set(tx + 6, ty - 7, '#4a463e');   // Dampf
      // Stuhl schräg zurückgeschoben
      const st = K.maske(); st.poly([[96, 70], [104, 69], [105, 71], [97, 72]]); st.kap(97, 71, 95, 78, .7, .7); st.kap(104, 70, 106, 77, .7, .7); st.kap(104, 70, 109, 60, .8, .7); st.kap(97, 71, 101, 61, .7, .6); st.kap(101, 61, 109, 60, .7, .7);
      K.form(st, 0, { k: HOLZ, r: TRAN(), ton: 2, fase: 0, rand: 1 });
      const st2 = K.maske(); st2.poly([[46, 66], [53, 66], [53, 68], [46, 68]]); st2.kap(47, 68, 47, 74, .7, .7); st2.kap(52, 68, 52, 74, .7, .7); st2.kap(46, 66, 45, 57, .8, .7);
      K.form(st2, 0, { k: HOLZ, r: TRAN(), ton: 1.8, fase: 0, rand: 1 });
      K.vignette(.75, { cx: 84, cy: 56 });
      function TRAN() { return ['#8a6a38', '#e0c088']; }
    },

    // Ein Messingfernrohr auf drei Beinen, das Objektiv im Staub; daneben ein Klappstuhl und ein aufgeschlagenes Buch.
    mond_refraktor(K) {
      const { B } = K;
      const kante = horizont(K, 54, 14);
      eisdecke(K, 58, { zapfen: 7 });
      schein(K, 40, 56, 70, 34, .85, { nurUeber: (x, y) => y < kante(x) });
      asche(K, kante, { gx: 40, gb: 60, hell: .55 });
      K.lichtquelle(40, 52);
      // Dreibein, Messingrohr senkrecht nach unten, Objektiv im Staub
      const cx = 80, yb = 82;
      const bein = K.maske(); bein.kap(cx, 30, cx - 16, yb, 1, .9); bein.kap(cx + 1, 30, cx + 18, yb - 1, 1, .9); bein.kap(cx + .5, 30, cx + 6, yb + 3, 1, .9);
      K.form(bein, 0, { k: HOLZ, r: ['#8a7a5a', '#d8c8a0'], ton: 2, fase: 0, rand: 1 });
      const kopf = K.maske(); kopf.rect(cx - 4, 26, 9, 5); K.form(kopf, 0, { k: MESS, r: ['#cdb878', GELB_K], ton: 2, fase: 0, rand: 1 });
      const rohr = K.maske(); rohr.kap(cx, 10, cx, yb - 6, 2.2, 3.2); rohr.rect(cx - 3.4, 13, 7, 2); rohr.rect(cx - 4, 50, 8, 2); rohr.rect(cx - 4.6, yb - 10, 9.4, 11);
      K.form(rohr, 0, { k: MESS, r: ['#9c8546', '#cdb878'], ton: .9, vx: -.5, fase: 0, rand: 1, L: [-1, 0], muster: (x, y) => (Math.abs(x - cx + 1) < .6 ? 1.8 : 0) + (x > cx ? -.6 : 0) + ((y > 12 && y < 16) || (y > 49 && y < 53) ? 1 : 0) });
      K.set(cx - 1, 14, GELB_K); K.set(cx - 1, 51, GELB_K);
      // Sucher neben dem Rohr
      const su = K.maske(); su.kap(cx + 5, 16, cx + 5, 34, .9, .9); su.rect(cx + 2, 18, 3, 1); su.rect(cx + 2, 31, 3, 1);
      K.form(su, 0, { k: MESS, r: ['#9c8546', '#cdb878'], ton: 1.4, fase: 0, rand: 1, L: [-1, 0] });
      // Okular oben, noch warm
      const ok = K.maske(); ok.kap(cx, 10, cx + 4, 6, 1.2, 1); K.form(ok, 0, { k: MESS, r: ['#cdb878', GELB_K], ton: 2.4, fase: 0, rand: 1 });
      K.licht(cx + 4, 6, 10, GELB_G2, 1); K.set(cx + 5, 5, GELB_K); K.set(cx + 4, 5, GELB);
      // Staubhügel, wo das Objektiv steckt
      const hg = K.maske(); hg.ell(cx, yb + 2, 8, 2.4); K.form(hg, 0, { k: STAUB.slice(4, 10), r: ['#a19c8e', '#d2ccba'], ton: 2.4, fase: 1, rand: 1 });
      // Klappstuhl rechts, darauf ein Buch
      const st = klappstuhlMaske(K, 124, 84, 24);
      K.form(st, 0, { k: HOLZ, r: ['#8a7a5a', '#d8c8a0'], ton: 2, fase: 0, rand: 1 });
      buch(K, 126, 70, 14, { ton: 3 });
      K.vignette(.75, { cx: 84, cy: 50 });
    },

    // Eine scharfe Grenze zwischen hellem und grauem Staub; jenseits davon flache Mulden, in denen etwas glänzt.
    mond_rand(K) {
      const { B } = K;
      const kante = horizont(K, 28, 6);
      eisdecke(K, 32, { zapfen: 8 });
      // hinter der Grenze: grau, ohne Licht; davor hell, im Licht der Rückseite
      const grenze = x => 54 + (x - 80) * .05;
      K.feld(0, 0, 160, 90, STAUB, (x, y) => {
        const k = kante(x); if (y < k) return -1;
        if (y < grenze(x)) return .3 + (B.fbm(x * .05, y * .18, 3, 2) - .5) * .1 + (y - k) / 160;
        return .46 + (y - grenze(x)) / 150 + (B.fbm(x * .06, y * .14, 5, 2) - .5) * .2 + (B.hash(x >> 1, y, 31) < .05 ? -.2 : 0);
      });
      for (let x = 0; x < 160; x++) K.set(x, Math.round(grenze(x)), STAUB[12]);
      // Mulden im grauen Feld, in jeder ein Glanz, wie ein Auge unter einem Lid
      const r = B.rng(K.seed + 9);
      for (const [x, y, w] of [[22, 44, 9], [58, 40, 7], [96, 46, 10], [132, 41, 8], [76, 36, 5], [40, 36, 4], [116, 35, 4], [148, 47, 6]]) {
        const m = K.maske(); m.ell(x, y, w, w * .26 + .8);
        K.form(m, 0, { k: STAUB.slice(0, 5), r: [STAUB[5], STAUB[7]], ton: .8, fase: 0, rand: 1, L: [0, 1] });
        const g = w > 6 ? 2 : 1; for (let i = -g; i <= g; i++) K.set(x + i, y, Math.abs(i) < g ? GELB : '#9a904e');
        if (w > 6) K.set(x, y - 1, '#5c5636');
        void r;
      }
      K.licht(80, 80, 90, GELB_G, .7, { oval: 2.4, maske: (x, y) => y > grenze(x) });
      // ein Stiefelabdruck genau an der Linie: so weit bist du gegangen
      for (const [x, y] of [[74, 62], [82, 71]]) { const m = K.maske(); m.ell(x, y, 2.2, 1.2); m.ell(x + 2.6, y, 1.6, 1.1); K.form(m, 0, { k: STAUB.slice(6, 11), ton: 1, fase: 0, rand: 0 }); }
      K.vignette(.7, { cx: 80, cy: 50 });
    },

    // Zwölf Spuren nebeneinander bis zum gekrümmten Horizont; zurück laufen elf, eine fehlt.
    mond_spuren(K) {
      const { B } = K;
      const kante = horizont(K, 34, 16);
      eisdecke(K, 40, { zapfen: 7 });
      schein(K, 80, 34, 70, 22, .75, { nurUeber: (x, y) => y < kante(x) });
      asche(K, kante, { gx: 80, gb: 90, hell: .5, abfall: 40, bis: 10 });
      // ruhiger, im Gegenlicht heller Staub, damit die Spuren sich abheben
      K.feld(0, 0, 160, 90, STAUB.slice(2, 11), (x, y) => { const k = kante(x); if (y <= k) return -1; const q = (y - k) / (90 - k); return .62 - q * .4 - Math.abs(x - 80) / 160 * .25 + (B.fbm(x * .05, y * .1, 5, 2) - .5) * .06; });
      // Spuren: zwölf hinaus (links), elf zurück (rechts, eine Lücke); Fluchtpunkt am Horizont.
      // Jede Spur: festgetretener, dunkler Streifen, darin die Abdrücke, deren vorderer Rand das Licht fängt.
      const vx = 80, vy = Math.round(kante(80)) + 1;
      const spur = (bx, ph) => {
        for (let y = vy + 1; y < 90; y++) {
          const q = (y - vy) / (90 - vy), x = B.lerp(vx + (bx - vx) * .03, bx, q), w = .4 + q * 1.6;
          for (let i = Math.floor(x - w); i <= x + w; i++) K.set(i, y, q < .3 ? STAUB[4] : STAUB[3]);
        }
        for (let i = 0; i < 20; i++) {
          const t = (i + ph) / 20, q = t * t, y = B.lerp(vy + 1, 92, q); if (y > 89) break;
          const x = B.lerp(vx + (bx - vx) * .03, bx, (y - vy) / (90 - vy)) + ((i & 1) ? -1 : 1) * q * 1.4, s = q * 2.6;
          if (s < .5) continue;
          const w = s * .8, h = s * .55;
          for (let j = -Math.ceil(h); j <= Math.ceil(h) + 1; j++) for (let k = -Math.ceil(w); k <= Math.ceil(w); k++) {
            const d = (k / w) ** 2 + (j / h) ** 2; if (d <= 1) K.set(x + k, y + j, STAUB[1]); else if (j > 0 && d < 1.9 && s > 1.3) K.set(x + k, y + j, STAUB[8]);
          }
        }
      };
      for (let i = 0; i < 12; i++) spur(-66 + i * 12, (i * .37) % 1);
      for (let i = 0; i < 12; i++) if (i !== 2) spur(90 + i * 12, (i * .61) % 1);
      // wo die zwölfte zurück sein müsste: unberührter, heller Staub
      for (let y = vy + 4; y < 90; y++) { const q = (y - vy) / (90 - vy), x = B.lerp(vx + (114 - vx) * .03, 114, q), w = .3 + q * 2.6; for (let i = Math.floor(x - w); i <= x + w; i++) if (B.bay(i, y) < .5 + q * .3) K.set(i, y, STAUB[8 + (q > .5 ? 1 : 0)]); }
      K.vignette(.7, { cx: 80, cy: 50 });
    },

    // Ein aufgeschlagenes Buch auf einem Klappstuhl im Staub, eine Reihe kleiner Mondsicheln am Rand, die letzte nur ein Strich.
    mond_beobachtungsbuch(K) {
      const { B } = K;
      const kante = horizont(K, 40, 10);
      eisdecke(K, 44, { zapfen: 6 });
      schein(K, 130, 40, 60, 24, .7, { nurUeber: (x, y) => y < kante(x) });
      asche(K, kante, { gx: 130, gb: 50, hell: .45 });
      K.lichtquelle(130, 36);
      // Klappstuhl groß im Vordergrund, schräg von vorn: Sitz als Fläche, X-Beine
      const sx = 76, sy = 54;
      const beine = K.maske(); beine.kap(sx - 24, sy + 4, sx + 20, 90, 1.4, 1.6); beine.kap(sx + 24, sy + 4, sx - 20, 90, 1.4, 1.6); beine.kap(sx - 28, sy - 2, sx - 30, 18, 1.3, 1.1); beine.kap(sx + 28, sy - 2, sx + 30, 18, 1.3, 1.1);
      K.form(beine, 0, { k: HOLZ, r: ['#8a7a5a', '#d8c8a0'], ton: 2, fase: 0, rand: 1 });
      const lehne = K.maske(); lehne.poly([[sx - 30, 18], [sx + 30, 18], [sx + 29, 30], [sx - 29, 30]]);
      K.form(lehne, .05, { k: ['#0e0c09', '#1e1a14', '#302a20', '#443c2e'], r: ['#8a7a5a', '#d8c8a0'], ton: 1.6, verlauf: .4, muster: (x, y) => (x % 4 === 0 ? -.4 : 0) });
      const sitz = K.maske(); sitz.poly([[sx - 30, sy - 4], [sx + 30, sy - 4], [sx + 34, sy + 6], [sx - 34, sy + 6]]);
      K.form(sitz, 0, { k: ['#0e0c09', '#1e1a14', '#302a20', '#443c2e'], r: ['#8a7a5a', '#d8c8a0'], ton: 1.8, L: [.4, -.9] });
      // Das Buch darauf, groß: Uhrzeiten, Rechnungen, am Rand die Sicheln, die letzte nur ein Strich
      const bx = sx, by = sy - 4, bw = 58;
      const { m } = buch(K, bx, by, bw, { ton: 3.1 });
      K.licht(bx + 10, by, 40, GELB_G, .9, { maske: (x, y) => m.has(x, y) });
      for (let i = 0; i < 4; i++) { K.schrift(bx - 25, by - 9 + i * 3, bx - 3, '#2a2620', { min: 1, max: 3 }); K.schrift(bx + 3, by - 10 + i * 3, bx + 25, '#2a2620', { min: 1, max: 3 }); }
      // Datum unten, unterstrichen
      K.schrift(bx + 14, by + 2, bx + 25, '#2a2620', { min: 2, max: 3 }); K.linie(bx + 14, by + 4, bx + 26, by + 4, '#7a2a1a');
      // Sicheln als Reihe am unteren Rand, abnehmend bis zum Strich
      for (let i = 0; i < 6; i++) {
        const x = bx - 23 + i * 7, y = by + 7;
        if (i === 5) { for (let j = -3; j <= 3; j++) K.set(x - 1, y + j, '#2a2620'); continue; }
        const off = 1 + (4 - i) * .6;
        for (let j = -3; j <= 3; j++) for (let k = -4; k <= 4; k++) if (Math.hypot(j, k) <= 3.4 && Math.hypot(j, k + off) > 3.4) K.set(x + k, y + j, '#2a2620');
      }
      K.vignette(.8, { cx: 80, cy: 52 });
    },
  },
};
