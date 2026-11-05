// Ereignisbilder 160 × 90 · Das Glasmeer (data/biome/glasmeer.json).
// Palette des Glasmeers (prototype/js/scenes/world/glasmeer.js): schwarzes Glas, das die Eisdecke spiegelt,
// Eis in Grüngrau, Polarlicht von unten in Grün; Spiegelbilder als dunkle Gestalten mit grünem Rand.
'use strict';

const EIS = ['#020507', '#050c10', '#091419', '#0e1e22', '#15292c', '#1e3836', '#2a4a44', '#3a6254', '#507e66', '#6e9e80'];
const GLAS = ['#000102', '#02060a', '#050c10', '#09151a', '#0f2024', '#16302f', '#20403c', '#2c5248', '#3e6a5a'];
const NORD = ['#06160f', '#0b2a1c', '#124428', '#1b6a3c', '#2a9a56', '#4fd27a', '#9effbf'];
const HOLZ = ['#060504', '#0d0a08', '#16110d', '#201912', '#2c2218', '#3c2e20'];
const TUCH = ['#0a0d0c', '#131817', '#1d2423', '#29312f', '#38423f', '#4c5854'];
const GRUEN = ['#2c6a4c', '#aef2bc'];
const DUNKEL = ['#010203', '#03060a', '#060b0f', '#0a1216'];
const PAPIER = ['#1a2220', '#3a4640', '#6a786c', '#a0b0a0', '#d4e2d0'];

// ---------- eigene Bausteine ----------
// Zellrauschen für Eisplatten: Abstand zur nächsten Kante
function zellen(B, x, y, s) {
  const ix = Math.floor(x), iy = Math.floor(y); let d1 = 9, d2 = 9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = ix + i + B.hash(ix + i, iy + j, s), cy = iy + j + B.hash(ix + i, iy + j, s + 7), d = Math.hypot(x - cx, y - cy);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return d2 - d1;
}
// Eisdecke oben (0..y1): ruhige Platten in Flucht, Zapfen, ein schwacher grüner Schein
function decke(K, y1, o) {
  o = o || {}; const { B } = K, rx = o.rx === undefined ? 134 : o.rx;
  K.feld(0, 0, 160, y1, EIS.slice(0, 8), (x, y) => {
    const dy = Math.max(.8, y1 + 4 - y), Z = 30 / dy, X = (x - 80) * Z / 30;
    const z = zellen(B, X * .5 + 3, Z * .5, K.seed), kw = .05 * Math.max(1, Z / 4);
    const rq = Math.max(0, 1 - Math.hypot((x - rx) / 60, (y - 4) / 16));
    return .1 + (z < kw ? .12 : 0) + B.fbm(X * .3, Z * .3, K.seed, 2) * .08 + rq * rq * .18 - Math.min(.1, (1 - y / y1) * .05);
  });
  // Zapfen
  const r = B.rng(K.seed + 4);
  for (let i = 0; i < (o.zapfen || 9); i++) { const x = r.f(0, 160), l = r.f(3, 9) * (y1 / 30), m = K.maske(); m.poly([[x - 1.6, y1 - 1], [x + 1.6, y1 - 1], [x, y1 - 1 + l]]); K.form(m, .3, { k: EIS.slice(2, 6), r: [EIS[6], EIS[8]], ton: 1.5, fase: 0, rand: 1 }); }
}
// Glasboden ab y0: schwarzes Glas; durch das Glas scheint unten grünes Licht (glow(x,y) 0..1)
function glas(K, y0, glow) {
  const { B } = K;
  K.feld(0, y0, 160, 90, GLAS.slice(0, 7), (x, y) => {
    const q = (y - y0) / (90 - y0), Z = 30 / Math.max(.8, y - y0 + 2), X = (x - 80) * Z / 30;
    const z = zellen(B, X * .5 + 9, Z * .4, K.seed + 5), kw = .04 * Math.max(1, Z / 4);
    return .1 + Math.pow(1 - q, 4) * .3 + (z < kw ? .12 : 0) + (glow ? glow(x, y) * .5 : 0);
  });
  // feine, gerade Horizontlinie
  for (let x = 0; x < 160; x++) K.set(x, y0, B.bay(x, 0) < .5 ? EIS[6] : EIS[5]);
}
// Polarlicht unter dem Glas: additiv in Stufen
function tiefenlicht(K, x, y, rx, ry, col, st, o) {
  K.licht(x, y, rx, col, st, Object.assign({ oval: rx / ry }, o || {}));
}
// Spiegelung: Pixel über der Achse yA nach unten gespiegelt, gedämpft (f)
function spiegeln(K, yA, y1, f, o) {
  o = o || {}; const { B } = K, x0 = o.x0 || 0, x1 = o.x1 || 160;
  const quelle = [];
  for (let y = 0; y < yA; y++) { const z = []; for (let x = 0; x < 160; x++) z.push(K.get(x, y)); quelle.push(z); }
  for (let y = yA; y < y1; y++) {
    const q = (y - yA) / Math.max(1, y1 - yA);
    for (let x = x0; x < x1; x++) {
      const sy = 2 * yA - y - 1; if (sy < 0 || sy >= yA) continue;
      const p = quelle[sy][x]; if (!(p >>> 24)) continue;
      const b = K.get(x, y); if (!(b >>> 24)) continue;
      const a = f * (1 - q * (o.abfall === undefined ? .6 : o.abfall)); if (a <= 0) continue;
      K.set(x, y, B.mix(B.unpk(b), B.unpk(p), a));
    }
  }
}
// Maske an der Waagerechten yA spiegeln, um dx versetzt
function spiegelMaske(K, m, yA, dx) {
  const n = K.maske(), y0 = 2 * yA - m.y1 - 1, y1 = 2 * yA - m.y0 + 1;
  n.fn(m.x0 + dx - 1, y0, m.x1 + dx + 1, y1, (x, y) => m.has(x - dx, 2 * yA - y));
  return n;
}
// Spiegelgestalt: dunkle Füllung, grüner Rand (wie im Hintergrund des Bioms)
function spiegelGestalt(K, m, o) {
  o = o || {};
  K.form(m, 0, { k: o.k || DUNKEL, r: o.r || GRUEN, ton: o.ton || .6, fase: 0, rand: o.rand || 1, rimF: -2, L: [0, 1] });
}
// Umrisslinie einer Maske (alle Randpixel) in einer Farbe, gedithert mit Dichte a
function umriss(K, m, col, a) {
  const { B } = K;
  for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) if (m.has(x, y) && (!m.has(x - 1, y) || !m.has(x + 1, y) || !m.has(x, y - 1) || !m.has(x, y + 1)) && (a === undefined || a > B.bay(x, y))) K.set(x, y, col);
}

module.exports = {
  biom: 'glasmeer',
  bilder: {
    // Eine Gestalt auf schwarzem, spiegelglattem Glas, darunter ihr Spiegelbild, das einen Schritt weiter vorn steht und sich umsieht.
    glasmeer_schritt(K) {
      const { B } = K;
      const hy = 40;
      decke(K, hy - 6);
      K.feld(0, hy - 8, 160, hy + 1, EIS.slice(2, 8), (x, y) => .3 + (y - hy + 8) / 9 * .5);
      glas(K, hy, (x, y) => Math.max(0, 1 - Math.hypot((x - 74) / 70, (y - 72) / 22)) * .6);
      spiegeln(K, hy, 90, .35);
      tiefenlicht(K, 74, 74, 60, 18, NORD[1], 1);
      // Polarlicht hinter dir an der Eisdecke und am Horizont: dagegen stehst du als Schattenriss
      K.licht(60, 34, 46, NORD[1], 1, { oval: 1.3 });
      K.licht(60, 38, 26, NORD[2], 1, { oval: 1.6 });
      const yb = 50, x = 62;
      // Die Gestalt: dunkel vor dem hellen Horizont
      const g = K.figurMaske(x, yb, 34, { kopf: 'muetze', blick: 1 });
      K.form(g, 0, { k: DUNKEL, r: [NORD[2], NORD[3]], ton: .5, rand: 1, L: [0, -1] });
      // Das Spiegelbild: einen Schritt voraus, halb umgedreht
      const sp = K.figurMaske(x + 16, yb, 32, { kopf: 'muetze', blick: -1, kopfDreh: -3, neig: -2, spreiz: 3.4, arme: [[x + 9, yb - 15], [x + 25, yb - 17]] });
      const ms = spiegelMaske(K, sp, yb, 0);
      // grüner Schein unter dem Glas um das Spiegelbild, das einzige Licht vorn
      K.licht(x + 16, yb + 20, 32, NORD[2], 1);
      K.licht(x + 16, yb + 20, 14, NORD[3], 1);
      spiegelGestalt(K, ms, { k: ['#010302', '#03080a', '#06100e', '#0b1a14'], ton: 1.2 });
      umriss(K, ms, NORD[4]);
      // das Gesicht, halb zu dir umgedreht: zwei helle Punkte
      const [kx, ky] = sp.kopf, sky = 2 * yb - ky;
      K.set(kx - 1, sky, NORD[6]); K.set(kx - 3, sky, NORD[5]);
      // unter dir selbst: kein Spiegelbild, nur Glas
      // Fußpunkte auf dem Glas
      for (let i = x - 8; i <= x + 20; i++) K.set(i, yb, B.bay(i, 1) < .5 ? GLAS[6] : GLAS[4]);
      K.vignette(.75, { cx: 70, cy: 58 });
    },

    // Spiegelglattes Glas, darin das Spiegelbild einer riesigen Gestalt neben einem kleinen Menschen; unter der Oberfläche schwach ein langer, liegender Umriss.
    glasmeer_gestalt(K) {
      const { B } = K;
      const hy = 22;
      decke(K, hy - 3, { rx: 40, zapfen: 6 });
      K.feld(0, hy - 5, 160, hy + 1, EIS.slice(2, 8), (x, y) => .3 + (y - hy + 5) / 6 * .5);
      K.licht(58, 16, 30, NORD[1], 1, { oval: 1.3 });
      glas(K, hy, (x, y) => Math.max(0, 1 - Math.hypot((x - 96) / 70, (y - 90) / 30)) * .45);
      spiegeln(K, hy, 60, .25);
      // Unter dem Glas, ganz unten, nur angedeutet: lang, liegend, mit zwei offenen Augen
      const lu = K.maske(); lu.pfad([[60, 86], [40, 84], [22, 84], [10, 85]], 3, 3.5); lu.ell(6, 85, 5, 3.6);
      K.licht(30, 86, 40, NORD[1], .8, { oval: 3 });
      umriss(K, lu, NORD[2], .45);
      K.set(4, 84, NORD[4]); K.set(8, 84, NORD[4]);
      // Der kleine Mensch: klarer Schattenriss vor dem hellen Streifen am Horizont, darunter sein kleines Spiegelbild
      const x = 60, yb = 30;
      const g = K.figurMaske(x, yb, 18, { kopf: 'muetze', blick: 1 });
      K.form(g, 0, { k: ['#000101', '#010203', '#020406', '#04080a'], r: [NORD[2], NORD[3]], ton: .5, rand: 1, L: [0, -1] });
      spiegelGestalt(K, spiegelMaske(K, g, yb, 0), { r: [GLAS[5], GLAS[7]] });
      // Daneben im Glas: das Spiegelbild einer riesigen Gestalt, kopfüber, die Füße an derselben Linie wie seine.
      // Gebaut gleich gespiegelt: y wächst von den Füßen nach unten zu Schultern und Kopf.
      const gx = 106, gm = K.maske();
      gm.kap(gx - 3, yb + 1, gx - 6, yb + 14, 1.4, 3); gm.kap(gx + 3, yb + 1, gx + 6, yb + 14, 1.4, 3);
      gm.kap(gx - 5, yb + .6, gx - 1, yb + .6, .9, .9); gm.kap(gx + 2, yb + .6, gx + 6, yb + .6, .9, .9);
      gm.poly([[gx - 9, yb + 13], [gx + 9, yb + 13], [gx + 20, yb + 26], [gx + 32, yb + 34], [gx - 32, yb + 34], [gx - 20, yb + 26]]);
      gm.ell(gx, yb + 34, 33, 5);
      gm.kap(gx - 32, yb + 33, gx - 21, yb + 12, 5, 2.4); gm.kap(gx + 32, yb + 33, gx + 21, yb + 12, 5, 2.4);
      gm.ell(gx - 21, yb + 11, 2.4, 2.8); gm.ell(gx + 21, yb + 11, 2.4, 2.8);
      gm.kap(gx, yb + 36, gx, yb + 42, 6, 6);
      gm.ell(gx, yb + 50, 12, 13);
      K.licht(gx, yb + 44, 60, NORD[1], 1, { oval: .9 });
      K.licht(gx, yb + 52, 28, NORD[2], 1);
      K.form(gm, 0, { k: ['#000101', '#010304', '#03080a', '#06100e'], ton: 1, verlauf: -.6, fase: 0, rand: 0 });
      K.kante(gm, gx, 96, 90, [NORD[3], NORD[5]], { min: -.3, nah: .5 });
      umriss(K, gm, NORD[3]);
      // das Gesicht kopfüber: Augen unten, Mund oben, nur als grüne Funken und dunkle Kerbe
      K.set(gx - 4, yb + 54, NORD[5]); K.set(gx + 4, yb + 54, NORD[5]);
      for (let i = -3; i <= 3; i++) K.set(gx + i, yb + 45, NORD[1]);
      K.vignette(.7, { cx: 84, cy: 50 });
    },

    // Ein schräges Segeltuchzelt, bis zur Mitte in schwarzem Glas, davor ein Schlitten mit gerissener Plane und ein aufgeschlagenes Buch.
    glasmeer_lager(K) {
      const { B } = K;
      const hy = 34;
      decke(K, hy - 4, { rx: 120 });
      K.feld(0, hy - 6, 160, hy + 1, EIS.slice(2, 8), (x, y) => .3 + (y - hy + 6) / 7 * .5);
      glas(K, hy, (x, y) => Math.max(0, 1 - Math.hypot((x - 70) / 60, (y - 70) / 18)) * .6);
      spiegeln(K, hy, 90, .3);
      tiefenlicht(K, 70, 70, 56, 16, NORD[1], 1);
      // Zelt, schräg gekippt; die untere Hälfte steckt im Glas (dort nur noch grünlich durchscheinend)
      const gl = 58;   // Glasoberfläche am Zelt
      const zelt = K.maske(); zelt.poly([[46, 66], [72, 24], [112, 30], [118, 64]]);
      const unten = K.maske(); unten.fn(zelt.x0, gl, zelt.x1, zelt.y1 + 1, (x, y) => zelt.has(x, y));
      const oben = K.maske(); oben.fn(zelt.x0, zelt.y0, zelt.x1, gl - 1, (x, y) => zelt.has(x, y));
      K.form(oben, 0, { k: TUCH, r: GRUEN, ton: 1.8, L: [.7, -.7], muster: (x, y) => (Math.abs((x - 72) - (y - 24) * -.6) < 1 ? 1 : 0) + ((x + y * .5) % 9 < 1 ? -.6 : 0) });
      for (let y = unten.y0; y <= unten.y1; y++) for (let x = unten.x0; x <= unten.x1; x++) if (unten.has(x, y) && B.bay(x, y) < .55) K.set(x, y, (x + y) % 5 ? GLAS[4] : GLAS[6]);
      for (let x = 50; x < 118; x++) if (zelt.has(x, gl)) K.set(x, gl, GRUEN[0]);
      // Eingang: dunkler Spalt
      const ein = K.maske(); ein.poly([[66, 57], [72, 34], [80, 57]]); K.form(ein, 0, { k: DUNKEL, ton: .4, fase: 0, rand: 0 });
      // Schlitten davor, Plane gerissen
      const sl = K.maske(); sl.kap(16, 74, 56, 74, .9, .9); sl.kap(16, 74, 12, 69, .9, .8); for (const x of [20, 34, 48]) sl.kap(x, 74, x, 68, .7, .7); sl.rect(18, 66, 36, 2);
      K.form(sl, 0, { k: HOLZ, r: GRUEN, ton: 2, fase: 0, rand: 1 });
      const pl = K.maske(); pl.poly([[20, 66], [24, 56], [44, 54], [52, 60], [52, 66]]); pl.poly([[44, 54], [50, 48], [52, 52]], 0); pl.poly([[30, 56], [33, 62], [36, 56]], 0);
      K.form(pl, 0, { k: TUCH, r: GRUEN, ton: 1.6, L: [.6, -.8], muster: (x, y) => (Math.sin(x * .8) > .7 ? -.6 : 0) });
      K.linie(52, 60, 58, 64, TUCH[3]); K.linie(51, 62, 55, 68, TUCH[2]);
      // Das Buch, aufgeschlagen auf dem Glas: die helle Stelle
      const bx = 84, by = 78, bm = K.maske();
      bm.poly([[bx - 11, by - 3], [bx, by - 2], [bx + 11, by - 4], [bx + 12, by + 3], [bx, by + 4], [bx - 12, by + 4]]);
      K.licht(bx, by, 22, NORD[2], 1);
      K.form(bm, 0, { k: PAPIER, r: [PAPIER[3], PAPIER[4]], ton: 3.3, fase: 0, rand: 1, L: [0, -1], muster: (x, y) => (Math.abs(x - bx) < .8 ? -1.6 : 0) });
      for (let i = 0; i < 3; i++) { K.schrift(bx - 10, by - 1 + i * 2, bx - 2, '#1a2a24', { min: 1, max: 3 }); K.schrift(bx + 2, by - 2 + i * 2, bx + 10, '#1a2a24', { min: 1, max: 3 }); }
      K.vignette(.7, { cx: 76, cy: 56 });
    },

    // Eine Plattenkamera auf einem Dreibein auf schwarzem Glas, das schwarze Tuch weht nicht, daneben eine Kiste mit zerbrochenen Glasplatten.
    glasmeer_platte(K) {
      const { B } = K;
      const hy = 38;
      decke(K, hy - 4, { rx: 30 });
      K.feld(0, hy - 6, 160, hy + 1, EIS.slice(2, 8), (x, y) => .3 + (y - hy + 6) / 7 * .5);
      glas(K, hy, (x, y) => Math.max(0, 1 - Math.hypot((x - 110) / 50, (y - 80) / 14)) * .6);
      spiegeln(K, hy, 90, .3);
      K.lichtquelle(30, 4);
      // Dreibein, Balgenkamera, schwarzes Tuch hängt reglos
      const yb = 80, cx = 58;
      const bein = K.maske(); bein.kap(cx, 46, cx - 18, yb, 1, .9); bein.kap(cx + 1, 46, cx + 2, yb + 2, 1, .9); bein.kap(cx + 2, 46, cx + 18, yb - 1, 1, .9);
      K.form(bein, 0, { k: HOLZ, r: GRUEN, ton: 2.4, fase: 0, rand: 1 });
      const kam = K.maske(); kam.rect(cx - 8, 32, 14, 14); kam.poly([[cx + 6, 34], [cx + 16, 31], [cx + 16, 47], [cx + 6, 45]]);
      K.form(kam, 0, { k: HOLZ, r: GRUEN, ton: 2.4, muster: (x, y) => (x > cx + 6 && (x & 1)) ? -.8 : 0 });
      const ob = K.maske(); ob.rect(cx + 16, 35, 4, 8); K.form(ob, 0, { k: ['#0a0c08', '#1c2018', '#3a4030', '#6a7458'], r: ['#9aa888', '#e0ecd0'], ton: 2.2, fase: 0 });
      const tuch = K.maske(); tuch.poly([[cx - 9, 31], [cx - 1, 29], [cx - 1, 34], [cx - 5, 60], [cx - 9, 56], [cx - 12, 61], [cx - 15, 56], [cx - 12, 40]]);
      K.licht(cx - 4, 40, 30, NORD[1], 1, { oval: 1.2 });
      K.form(tuch, 0, { k: DUNKEL, ton: 1.2, r: [GLAS[4], GLAS[6]], rand: 1, muster: (x, y) => (Math.sin(x * 1.3) > .6 ? -.8 : 0) });
      umriss(K, tuch, GLAS[5], .7);
      // Spiegelung der Kamera im Glas
      const ganz = K.maske(); for (const m of [bein, kam, tuch]) ganz.fn(m.x0, m.y0, m.x1, m.y1, (x, y) => m.has(x, y));
      spiegelGestalt(K, spiegelMaske(K, ganz, yb + 1, 0), { r: [GLAS[4], GLAS[6]], ton: .3 });
      // Kiste mit zerbrochenen Platten rechts; die Scherben glänzen grünweiß
      const ki = K.kiste(112, 82, 28, 14, 0, 0, { mat: { k: HOLZ, r: GRUEN, ton: 2.2 } });
      void ki;
      // zerbrochene Glasplatten, schräg in der Kiste, oben gezackt; Scherben davor auf dem Glas
      const PL = ['#0f2024', '#16302f', '#20403c', '#2c5248', '#3e6a5a', '#507e66'];
      for (const [x, w, h, a, zack] of [[100, 9, 18, .18, [3, -4, 2]], [109, 10, 14, .05, [-3, 2, -5]], [119, 9, 20, -.14, [1, -6, 0]]]) {
        const m = K.maske(), s0 = Math.sin(a) * h, top = 69 - h;
        m.poly([[x, 69], [x + w, 69], [x + w + s0, top + zack[2]], [x + w * .6 + s0, top + zack[1]], [x + w * .3 + s0, top + zack[0]], [x + s0, top]]);
        K.form(m, 0, { k: PL, r: [NORD[5], '#e8fff0'], ton: 2.2, verlauf: 1, fase: 0, rand: 1, L: [-.7, -.7], muster: (px, py) => ((px + py) % 7 === 0 ? .8 : 0) });
      }
      for (const [x, y, l, a] of [[94, 86, 5, .3], [130, 87, 4, -.5], [86, 84, 3, .9]]) { const m = K.maske(); m.poly([[x, y], [x + l, y - 1], [x + l * .5, y - Math.abs(a) * 3 - 1]]); K.form(m, 0, { k: PL, r: [NORD[4], NORD[6]], ton: 2.4, fase: 0, rand: 1 }); }
      K.licht(112, 62, 26, NORD[2], .9);
      K.set(104, 54, '#ffffff'); K.set(104, 55, NORD[6]); K.set(121, 51, NORD[6]);
      K.vignette(.75, { cx: 84, cy: 56 });
    },

    // Eine straffe Hundeleine aus Leder, die schräg in eine glatte schwarze Fläche taucht; darunter grünes Licht.
    glasmeer_leine(K) {
      const { B } = K;
      const hy = 16;
      decke(K, hy - 2, { rx: 120, zapfen: 6 });
      K.feld(0, hy - 3, 160, hy + 1, EIS.slice(2, 8), (x, y) => .4 + (y - hy + 3) / 4 * .4);
      // Tiefe unter dem Glas: grünes Licht unten rechts, darin ein Hundekopf
      const gx = 124, gy = 74;
      glas(K, hy, (x, y) => Math.max(0, 1 - Math.hypot((x - gx) / 70, (y - gy) / 40)) * .7);
      spiegeln(K, hy, 44, .25);
      tiefenlicht(K, gx, gy, 64, 34, NORD[2], 1);
      tiefenlicht(K, gx, gy, 30, 18, NORD[3], 1);
      // Hundekopf unter dem Glas, nur als Umriss im grünen Licht, die Schnauze zur Leine gereckt
      const hk = K.maske();
      hk.ell(gx, gy, 8, 7); hk.kap(gx - 5, gy - 1, gx - 16, gy - 6, 4.2, 2.6); hk.ell(gx - 17, gy - 6.5, 2, 1.8);
      hk.poly([[gx - 1, gy - 5], [gx + 3, gy - 17], [gx + 6, gy - 4]]); hk.poly([[gx + 4, gy - 4], [gx + 10, gy - 14], [gx + 10, gy - 1]]);
      hk.kap(gx + 2, gy + 4, gx + 8, gy + 18, 6, 8);
      for (let y = hk.y0; y <= hk.y1; y++) for (let x = hk.x0; x <= hk.x1; x++) if (hk.has(x, y)) K.set(x, y, y > gy + 8 ? GLAS[1] : GLAS[2]);
      umriss(K, hk, NORD[4]);
      for (let i = 0; i < 7; i++) K.set(gx - 16 + i * 1.3, gy - 4 + i * .5, GLAS[0]);   // Maul
      K.set(gx - 5, gy - 3, NORD[6]); K.set(gx - 4, gy - 3, NORD[5]);
      // Halsband, an dem die Leine unten ankommt
      for (let i = -6; i <= 6; i++) K.set(gx + 4 + i * .3, gy + 9 + i * .5, NORD[5]);
      // Eintauchpunkt mit Ringen, als wäre das Glas Wasser
      const ex = 92, ey = 46;
      for (const [r, c, d] of [[5, GLAS[8], 1], [10, GLAS[7], .8], [16, GLAS[5], .6]]) for (let a = 0; a < Math.PI * 2; a += .04) { const x = ex + Math.cos(a) * r, y = ey + Math.sin(a) * r * .24; if (B.bay(x, y) < d) K.set(x, y, c); }
      // unter dem Glas: die Leine weiter zum Halsband, dunkler, grün umspielt
      for (let i = 0; i <= 60; i++) { const q = i / 60, x = B.lerp(ex, gx + 4, q), y = B.lerp(ey + 1, gy + 8, q) + Math.sin(q * Math.PI) * 2; K.set(x, y, q < .5 ? '#2a2216' : '#1a2a1c'); if (B.bay(x, y) < .4) K.set(x + 1, y, NORD[2]); }
      // Die Hand im Handschuh vorn links, die Leine straff in der Faust
      const leder = ['#0c0806', '#1e140c', '#3a2616', '#5a3c22', '#7a5430'];
      const le = K.maske(); le.kap(36, 70, ex, ey, 1.6, 1.1);
      K.form(le, 0, { k: leder, r: ['#9a7040', '#e0b880'], ton: 2.6, fase: 0, rand: 2, L: [.3, -1] });
      const hand = K.maske();
      hand.poly([[-4, 92], [-4, 70], [8, 64], [18, 70], [12, 92]]);                       // Ärmel
      hand.ell(24, 72, 13, 10);                                                          // Faust
      for (let i = 0; i < 4; i++) hand.ell(34 - i * 1.2, 66 + i * 3.6, 4, 2.2);           // Finger um die Leine
      hand.kap(18, 64, 30, 63, 3, 2.4);                                                  // Daumen oben
      K.form(hand, 0, { k: ['#0e0907', '#1e140c', '#3a2616', '#5a3c22', '#7a5430'], r: ['#5a8a5a', '#aef2bc'], ton: 2.3, verlauf: .6, fase: 1, rand: 2, L: [.8, .4], muster: (x, y) => (x < 13 ? -.6 : 0) + (Math.abs(y - 66 - Math.round((34 - x) / 1.2) * 0) % 4 === 0 && x > 28 ? -.5 : 0) });
      // Fingerfugen und eine Naht am Handschuh
      for (let i = 1; i < 4; i++) for (let k = -2; k <= 1; k++) K.set(33 - i * 1.2 + k, 64.4 + i * 3.6, '#060403');
      for (let y = 66; y < 80; y += 2) K.set(14, y, '#2a1e14');
      K.kante(hand, gx, gy, 140, ['#1b6a3c', '#2a9a56'], { min: .5 });
      K.vignette(.65, { cx: 96, cy: 60 });
    },

    // Ein Spiegelbild im schwarzen Glas, das einen Gegenstand nach oben reicht, die Hand dicht unter der Oberfläche.
    glasmeer_wartet(K) {
      const { B } = K;
      const hy = 22;
      decke(K, hy - 3, { rx: 30, zapfen: 7 });
      K.feld(0, hy - 4, 160, hy + 1, EIS.slice(2, 8), (x, y) => .35 + (y - hy + 4) / 5 * .45);
      glas(K, hy, (x, y) => Math.max(0, 1 - Math.hypot((x - 80) / 60, (y - 80) / 26)) * .5);
      spiegeln(K, hy, 60, .3);
      tiefenlicht(K, 80, 82, 60, 24, NORD[1], 1);
      K.licht(80, 28, 40, NORD[1], 1, { oval: 1.3 });
      // Du stehst am oberen Rand des Glases, klein; dein Spiegelbild darunter, kopfüber, vor dir
      const x = 80, yb = 50;
      const g = K.figurMaske(x, yb, 28, { kopf: 'muetze', blick: 1 });
      K.form(g, 0, { k: DUNKEL, r: [NORD[2], NORD[3]], ton: .5, rand: 1, L: [0, -1] });
      // Spiegelbild mit der falschen Hand erhoben: die Hand kommt nach oben bis dicht unter die Fläche
      const sp = K.figurMaske(x, yb, 28, { kopf: 'muetze', blick: 1, arme: [[x - 7, yb - 4], [x + 6, yb - 17]], ellbogen: [[x - 12, yb - 13], null] });
      const ms = spiegelMaske(K, sp, yb, 0);
      K.licht(x, yb + 18, 28, NORD[1], 1);
      spiegelGestalt(K, ms, { k: ['#010302', '#03080a', '#06100e', '#0b1a14'], ton: 1.2 });
      umriss(K, ms, NORD[3]);
      // Der Gegenstand in der Hand dicht unter dem Glas: ein Taschenspiegel/eine Uhr, die einzige helle Stelle
      const hx = x - 7, hyy = 2 * yb - (yb - 4);
      K.licht(hx, hyy, 16, NORD[2], 1);
      const ob = K.maske(); ob.ell(hx, hyy - 1, 2.4, 2.2); K.form(ob, 0, { k: ['#2a3428', '#5a6a54', '#9aae94', '#d8ecd4'], r: ['#e8fff0', '#ffffff'], ton: 2.6, fase: 0, rand: 1, L: [0, -1] });
      K.set(hx, hyy - 2, '#ffffff');
      // die Glasoberfläche zwischen dir und ihm: eine helle Linie, gerade über der Hand
      for (let i = x - 22; i <= x + 22; i++) if (B.bay(i, yb) < .6) K.set(i, yb, GLAS[6]);
      K.kante(ms, hx, hyy, 30, [NORD[4], NORD[6]], { min: .2 });
      K.vignette(.75, { cx: 80, cy: 50 });
    },
  },
};
