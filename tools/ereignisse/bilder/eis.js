// Ereignisbilder 160 × 90 · Das schwarze Eis (data/events.json mit biom "eis" und eis_plus.json).
// Palette des Eises (prototype/js/scenes/world/eis.js): Schwarzblau, kaltes weißblaues Randlicht,
// fahles Nordlicht; der Umriss unter dem Eis in Türkis. Warmes Licht nur dort, wo es nicht hingehört.
'use strict';

const EIS = ['#020306', '#04070c', '#070c16', '#0b1422', '#111e32', '#1a2a44', '#26405e', '#3a5a80', '#5a80a8'];
const NACHT = ['#020306', '#04070c', '#070c16', '#0b1422', '#111e32', '#1a2a44'];
const KALT = ['#5a8ab0', '#e8f6ff'];
const UMRISS = ['#0c2a36', '#15485a', '#2a7088', '#5ab0c8'];
const TUCH = ['#06080c', '#0e141c', '#1a2230', '#2a3446', '#3e4a5c'];
const DUNKEL = ['#020306', '#04070c', '#080d16', '#0e1622'];

// ---------- eigene Bausteine ----------
// Schwarzes Eis: dunkle Fläche, zum Horizont heller, mit waagerechten Glanzstreifen und feinen Rissen
function eisFlaeche(K, y0, o) {
  o = o || {}; const { B } = K, s = K.seed;
  K.feld(0, y0, 160, 90, o.cols || EIS.slice(0, 6), (x, y) => {
    const q = (y - y0) / (90 - y0);
    const streif = Math.sin(y * 2.7 + B.rausch2(x * .03, y * .2, s) * 5) > .9 ? .16 : 0;
    const riss = B.rausch2(x * .09, y * .35, s + 3) > .78 && B.hash(x, y, 4) < .5 ? .18 : 0;
    return (o.basis === undefined ? .12 : o.basis) + Math.pow(1 - q, 3) * (o.horizont === undefined ? .35 : o.horizont) + streif + riss;
  });
}
// Spiegelung: Pixel über der Achse yA nach unten gespiegelt, gedämpft (f) und zum Boden hin schwächer
function spiegeln(K, yA, y1, f, o) {
  o = o || {}; const { B } = K, x0 = o.x0 || 0, x1 = o.x1 || 160, grund = B.col(o.grund || EIS[1]);
  const quelle = [];
  for (let y = 0; y < yA; y++) { const z = []; for (let x = 0; x < 160; x++) z.push(K.get(x, y)); quelle.push(z); }
  for (let y = yA; y < y1; y++) {
    const q = (y - yA) / Math.max(1, y1 - yA);
    for (let x = x0; x < x1; x++) {
      const sy = 2 * yA - y - 1 + (o.welle ? Math.round(Math.sin(y * 1.3 + x * .07) * o.welle * q) : 0);
      if (sy < 0 || sy >= yA) continue;
      if (o.nur && !o.nur(x, sy)) continue;
      const p = quelle[sy][x]; if (!(p >>> 24)) continue;
      const b = K.get(x, y), bc = b >>> 24 ? B.unpk(b) : grund;
      const a = f * (1 - q * (o.abfall === undefined ? .7 : o.abfall));
      if (a <= B.bay(x, y) * .3) continue;
      K.set(x, y, B.mix(bc, B.unpk(p), a));
    }
  }
}
// Nordlicht: ein Vorhang aus senkrechten Strahlen unter einer Kurve, nach unten auslaufend; additiv in Stufen
function nordlicht(K, pts, col, staerke, laenge) {
  const { B } = K, C = B.col(col); laenge = laenge || 14;
  for (let x = 0; x < 160; x++) {
    let y = null; for (let i = 0; i + 1 < pts.length; i++) if (x >= pts[i][0] && x <= pts[i + 1][0]) { const q = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); y = B.lerp(pts[i][1], pts[i + 1][1], B.glatt(q)); }
    if (y === null) continue;
    const ende = B.clamp(Math.min(x - pts[0][0], pts[pts.length - 1][0] - x) / 24, 0, 1);
    const strahl = .35 + .65 * B.rausch2(x * .16, 3, K.seed + 5), l = laenge * (.6 + .6 * B.rausch2(x * .07, 7, K.seed));
    for (let j = -2; j < l; j++) {
      const v = (j < 0 ? (j + 3) / 3 : Math.pow(1 - j / l, 1.3)) * staerke * strahl * ende;
      const lv = Math.floor(v * 3 + B.bay(x, y + j)) / 3; if (lv > 0) K.e.add(x, Math.round(y + j), C, Math.min(1, lv));
    }
  }
}
// Hund von der Seite, Fuß bei (x, yb), Blick richtung (+1 rechts, -1 links), kopfTief 0..1
function hundMaske(K, x, yb, s, o) {
  o = o || {}; const m = K.maske(), d = o.richtung || 1, X = u => x + d * u * s, kt = o.kopfTief === undefined ? 1 : o.kopfTief;
  m.ell(x, yb - 8 * s, 7 * s, 3.2 * s);
  m.ell(X(5), yb - 8.4 * s, 3.6 * s, 3.6 * s);
  const kx = X(9.5), ky = yb - 10 * s + kt * 7 * s;
  m.kap(X(5.5), yb - 10 * s, kx, ky - 1 * s, 2.2 * s, 1.6 * s);
  m.ell(kx, ky, 2.4 * s, 2 * s);
  m.kap(kx, ky, X(12.5), ky + (kt > .5 ? 1.6 : .4) * s, 1.3 * s, .9 * s);
  m.poly([[X(8.5), ky - 1.5 * s], [X(9), ky - 4 * s], [X(10.3), ky - 1.7 * s]]);
  for (const u of [-5, -3.5, 3.5, 5.5]) m.kap(X(u), yb - 8 * s, X(u + .3), yb - .5, 1 * s, .8 * s);
  m.kap(X(-6.5), yb - 9.5 * s, X(-8.5), yb - 13 * s, 1.2 * s, .8 * s); m.kap(X(-8.5), yb - 13 * s, X(-6.5), yb - 14.5 * s, .8 * s, .6 * s);
  m.kopf = [kx, ky];
  return m;
}

module.exports = {
  biom: 'eis',
  bilder: {
    // Ein vereistes Zelt auf schwarzem Eis, durch die Plane schimmert ein Licht, das niemand angezündet hat.
    eis_zelt(K) {
      const { B } = K;
      K.himmel(46, NACHT, { steil: .5, gx: 40, gb: 70 });
      K.sterne(26, 36, ['#1a2a44', '#5a80a8']);
      eisFlaeche(K, 46, { horizont: .45 });
      spiegeln(K, 46, 70, .35);
      // Zelt: Giebel vorn links, Dachseite nach rechts hinten
      const fx = 60, apex = 34, fb = 70;
      const front = K.maske(); front.poly([[fx, apex], [fx + 18, fb], [fx - 18, fb]]);
      const seite = K.maske(); seite.poly([[fx, apex], [fx + 44, apex + 4], [fx + 54, fb - 3], [fx + 18, fb]]);
      const reif = (x, y) => (B.hash(x, y >> 1, 7) < .07 ? .6 : 0) + (Math.sin(x * .9 + y * .2) > .85 ? -.35 : 0);
      K.lichtquelle(150, 4);
      K.form(seite, 0, { k: TUCH, r: KALT, ton: 1.5, verlauf: .7, muster: (x, y) => reif(x, y) + ((x - fx) % 11 < 1 ? -.6 : 0) });
      K.form(front, 0, { k: TUCH, r: KALT, ton: 1.2, muster: reif });
      // Stangen über dem First, Abspannleinen
      const st = K.maske(); st.kap(fx, apex, fx - 3, apex - 5, .6, .5); st.kap(fx, apex, fx + 3, apex - 5, .6, .5); st.kap(fx + 44, apex + 4, fx + 46, apex - 1, .6, .5);
      K.form(st, 0, { k: DUNKEL, r: KALT, ton: 2, fase: 0, rand: 1 });
      K.linie(fx - 2, apex + 4, 24, 76, '#26405e'); K.linie(fx + 46, apex + 5, 132, 74, '#1a2a44');
      // Das Licht innen: Plane leuchtet fahl von innen
      K.licht(fx + 1, 60, 24, '#5a5230', 1, { maske: (x, y) => front.has(x, y), exp: 1.2 });
      K.licht(fx + 1, 61, 13, '#7a7044', 1, { maske: (x, y) => front.has(x, y) });
      K.licht(fx + 14, 58, 34, '#3a3420', 1, { maske: (x, y) => seite.has(x, y) });
      // Tür: Schlitz, von innen verschnürt
      for (let y = apex + 10; y < fb; y++) K.set(fx, y, y > 55 ? '#3a3420' : '#0e141c');
      for (let y = apex + 13; y < fb - 2; y += 4) { K.set(fx - 1, y, '#0a0c10'); K.set(fx + 1, y + 1, '#0a0c10'); K.set(fx + 1, y, '#0a0c10'); K.set(fx - 1, y + 1, '#0a0c10'); }
      K.set(fx, 62, '#f4ecc8'); K.set(fx, 63, '#e8dcaa'); K.set(fx, 61, '#c8bc8a');
      // Spiegelung des Zelts und Schein auf dem Eis
      spiegeln(K, fb, 90, .45, { x0: fx - 20, x1: fx + 56, nur: (x, y) => front.has(x, y) || seite.has(x, y), abfall: .9 });
      K.licht(fx, fb + 3, 30, '#2a2616', 1, { oval: 2.4, maske: (x, y) => y >= fb });
      K.vignette(.75, { cx: 70 });
    },

    // Eine gefrorene Welle, höher als ein Haus, darin dunkle Formen, und ihr Schatten fällt über dich.
    eis_welle(K) {
      const { B } = K;
      const hy = 62, gx = 122;
      // Himmel: rechts tief am Horizont ein fahler Schein, gegen den sich die Lippe der Welle und du abheben
      K.feld(0, 0, 160, hy, ['#020306', '#04070c', '#070c16', '#0b1422', '#111e32', '#1a2a44', '#26405e', '#3a5a80', '#5a80a8', '#8ab0d0'], (x, y) => {
        const v = (y + 1) / hy; return .06 + Math.pow(v, 2.2) * .3 + Math.exp(-(((x - gx) / 30) ** 2)) * Math.pow(v, 2.4) * .75 + (B.fbm(x * .03, y * .1, K.seed, 2) - .5) * .08;
      });
      K.sterne(20, 34, ['#1a2a44', '#5a80a8']);
      K.mond(14, 10, 2.5, { hof: 5, hofFarbe: '#0e1828' });
      eisFlaeche(K, hy, { horizont: .5, basis: .12 });
      spiegeln(K, hy, 90, .6, { x0: 80, abfall: .5 });
      // Die Welle: Rücken links, Kamm oben, Lippe hängt nach rechts über, darunter die hohle Wand
      const w = K.maske();
      w.poly([[-4, 64], [-4, 40], [16, 27], [38, 11], [56, 4], [74, 5], [91, 11], [103, 20], [107, 32], [104, 37], [99, 30], [91, 25], [83, 26], [78, 34], [79, 47], [89, 58], [112, 64]]);
      K.lichtquelle(gx, 58);
      const fluss = (x, y) => Math.sin((x * .22 - y * .5) + Math.sin(y * .18) * 2) > .8 ? .5 : 0;
      // Eis der Welle: durchscheinend, am dünnen Kamm heller, unten und in der Hohlwand dunkel
      K.form(w, 0, { k: ['#03060c', '#08101c', '#0e1a2c', '#172840', '#223a58', '#335478'], r: KALT, ton: 1.4, L: [-.6, -.8], muster: (x, y) => {
        const kamm = Math.max(0, 1 - Math.abs(Math.hypot(x - 62, y - 40) - 32) / 7);
        return fluss(x, y) + kamm * 2.3 - (y - 4) / 60 * .6 - (x > 76 && y > 28 ? .6 : 0);
      } });
      K.licht(46, 30, 34, '#14243a', 1, { maske: (x, y) => w.has(x, y), exp: 1.1 });
      // Dunkle Formen im Eis; eine lange unter dem Kamm schwimmt auf das Ufer zu
      const fo = K.maske();
      fo.pfad([[30, 30], [42, 22], [56, 16], [70, 14], [84, 16]], 1.2, 3.4); fo.ell(87, 17.5, 4.2, 2.8); fo.poly([[23, 27], [31, 29], [25, 35]]);
      fo.poly([[60, 18], [63, 13], [66, 18]]); fo.poly([[46, 22], [48, 17], [51, 21]]);
      const fo2 = K.maske(); fo2.ell(28, 48, 6, 2.6); fo2.kap(22, 48, 16, 45, 1.4, .6); fo2.ell(58, 44, 3.4, 1.6); fo2.ell(12, 58, 2.6, 1.2);
      for (const [f, c] of [[fo, ['#010204', '#030610']], [fo2, ['#03060c', '#060c16']]]) for (let y = f.y0; y <= f.y1; y++) for (let x = f.x0; x <= f.x1; x++) if (f.has(x, y) && w.has(x, y)) K.set(x, y, c[(x + y) & 1]);
      for (const f of [fo, fo2]) for (let y = f.y0; y <= f.y1; y++) for (let x = f.x0; x <= f.x1; x++) if (f.has(x, y) && !f.has(x, y - 1) && w.has(x, y) && B.bay(x, y) < .6) K.set(x, y, UMRISS[0]);
      K.set(89, 17, UMRISS[3]); K.set(90, 17, UMRISS[2]);
      // Schatten der Welle fällt nach vorn über das Eis, bis über dich
      K.kante(w, gx, 58, 46, ['#3a5a80', '#8ab0d0'], { min: .3 });
      K.dith(0, hy, 160, 90, '#010204', (x, y) => { const g = 96 + (y - hy) * 1.2; return x < g ? .92 : x < g + 10 ? (g + 10 - x) / 10 * .92 : 0; });
      // Du: vorn, am Rand des Schattens; Kopf und Schultern vor dem Schein am Horizont
      const ich = K.figurMaske(gx + 2, 90, 40, { kopf: 'muetze', blick: -1, kopfDreh: -1 });
      K.form(ich, 0, { k: ['#010204', '#020408', '#04070c', '#060a12'], ton: 1, rand: 0, fase: 0 });
      K.kante(ich, gx + 8, 56, 40, ['#26405e', '#5a80a8'], { min: .35 });
      K.vignette(.6, { cx: 86, cy: 40 });
    },

    // Eine endlose schwarze Eisfläche, ganz hinten eine dünne, aufrechte Gestalt mit zu langem Hals, die winkt.
    eis_name(K) {
      const { B } = K;
      const hy = 58, gx = 106;
      // Himmel fast schwarz, tief am Horizont ein fahler Schein genau hinter der Gestalt
      K.feld(0, 0, 160, hy, ['#020306', '#04070c', '#070c16', '#0b1422', '#111e32', '#1a2a44', '#26405e', '#3a5a80', '#7a9ec0'], (x, y) => {
        const v = (y + 1) / hy, g = Math.exp(-(((x - gx) / 24) ** 2) - (((y - hy) / 40) ** 2)), h = Math.exp(-(((x - gx) / 50) ** 2)) * Math.pow(v, 6);
        return .06 + v * .12 + g * .62 + h * .3 + (B.fbm(x * .03, y * .12, K.seed, 2) - .5) * .06;
      });
      K.sterne(14, 26, ['#1a2a44', '#3a5a80']);
      eisFlaeche(K, hy, { horizont: .3, basis: .08 });
      spiegeln(K, hy, 90, .55, { welle: 1 });
      // Die Gestalt: sehr dünn, Hals zu lang, ein Arm winkt
      const m = K.maske(), fb = hy + 1, k = 1.2;
      m.kap(gx - 1.4, fb, gx - .9, fb - 9 * k, .5, .7); m.kap(gx + 1.4, fb, gx + .9, fb - 9 * k, .5, .7);
      m.poly([[gx - 2.2, fb - 9 * k], [gx + 2.2, fb - 9 * k], [gx + 1.8, fb - 19 * k], [gx - 1.8, fb - 19 * k]]);
      m.kap(gx + .2, fb - 19 * k, gx + 1.2, fb - 30 * k, .6, .55);
      m.ell(gx + 1.6, fb - 31 * k, 1.7, 2);
      m.kap(gx - 1.8, fb - 18 * k, gx - 3, fb - 8 * k, .55, .5);
      m.kap(gx + 1.8, fb - 18 * k, gx + 6, fb - 24 * k, .55, .5); m.kap(gx + 6, fb - 24 * k, gx + 7.5, fb - 32 * k, .55, .5);
      for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) if (m.has(x, y)) K.set(x, y, '#010204');
      // ihr Spiegelbild im Eis, ein dunkler Strich durch den Schein
      for (let y = fb; y < fb + 30; y++) { const q = (y - fb) / 30; if (B.hash(gx, y, 5) < .85 - q * .5) K.set(gx + Math.round(Math.sin(y * .9) * q), y, '#02040a'); }
      // fahle Spur im Eis von ihr bis zu dir
      K.spiegel(gx, hy + 2, 90, '#26405e', 1.2);
      K.vignette(.8, { cx: gx - 10, cy: 40 });
    },

    // Ein Schlitten mit Kisten, davor eine Reihe Hunde im Eis, alle mit gesenktem Kopf, einer mit hellen Augen.
    eis_schlitten(K) {
      const { B } = K;
      const hy = 73, yb = 86;
      // tief stehender, fahler Schein am Horizont: Hunde und Schlitten stehen als Schattenrisse davor
      K.feld(0, 0, 160, hy, ['#020306', '#04070c', '#070c16', '#0b1422', '#111e32', '#1a2a44', '#26405e', '#3a5a80', '#5a80a8', '#7a9ec0'], (x, y) => {
        const v = (y + 1) / hy; return .06 + Math.pow(v, 3) * .82 + Math.exp(-(((x - 60) / 50) ** 2)) * Math.pow(v, 5) * .15 + (B.fbm(x * .03, y * .1, K.seed, 2) - .5) * .06;
      });
      K.sterne(16, 30, ['#1a2a44', '#3a5a80']);
      nordlicht(K, [[-10, 12], [50, 5], [110, 15], [170, 7]], '#16304a', .9, 22);
      eisFlaeche(K, hy, { horizont: .75, basis: .1 });
      spiegeln(K, hy, 90, .5, { abfall: .5 });
      K.lichtquelle(60, 70);
      const dunkel = ['#010204', '#03050a', '#060a12', '#0b1220'];
      // Schlitten rechts angeschnitten: Kufen, Rungen, Kisten unter steifer Plane, Griffbügel
      const sl = K.maske();
      sl.kap(128, yb, 170, yb, 1.2, 1.2); sl.kap(128, yb, 122, yb - 8, 1.2, 1);
      for (const x of [133, 147, 160]) sl.kap(x, yb, x, yb - 9, 1, 1);
      sl.rect(126, yb - 11, 44, 2.5);
      sl.rect(131, yb - 28, 20, 17); sl.rect(152, yb - 33, 16, 22); sl.rect(137, yb - 40, 16, 12);
      K.form(sl, 0, { k: ['#03050a', '#0a1018', '#121c2a', '#1c2a3e'], r: KALT, ton: 1.6, verlauf: .8, fase: 1, rand: 1, muster: (x, y) => ((x === 151 || x === 152 || y === yb - 28 || y === yb - 33 || y === yb - 40) ? -1.2 : (y - yb) % 5 === 0 ? -.5 : 0) });
      const pl = K.maske(); pl.poly([[133, yb - 37], [141, yb - 49], [158, yb - 47], [168, yb - 38], [166, yb - 32], [135, yb - 31]]);
      K.form(pl, 0, { k: TUCH, r: KALT, ton: 1.8, verlauf: .8, muster: (x, y) => (Math.sin(x * .8 + y * .3) > .75 ? .9 : 0) });
      sl.poly([[133, yb - 37], [141, yb - 49], [158, yb - 47], [168, yb - 38], [166, yb - 32], [135, yb - 31]]);
      K.kante(sl, 100, 30, 80, ['#26405e', '#5a80a8'], { min: .3 });
      // Zugleine von den Hunden zum Schlitten
      K.linie(0, yb - 21, 124, yb - 8, '#04070c');
      // Die Hunde, im Stehen gefroren, Köpfe nach unten; der mittlere hat die Augen offen
      const hunde = [];
      for (const [x, s, kt] of [[30, 1.9, .45], [70, 1.95, .3], [108, 1.9, .5]]) {
        const h = hundMaske(K, x, yb, s, { richtung: -1, kopfTief: kt });
        K.form(h, 0, { k: dunkel, r: KALT, ton: .7, rand: 1, muster: (px, py) => (B.hash(px, py, 2) < .05 ? .8 : 0) });
        hunde.push(h);
      }
      // Eis um die Pfoten: der Boden ist um sie hochgefroren
      for (const h of hunde) for (let y = yb - 4; y <= yb; y++) for (let x = h.x0 - 1; x <= h.x1 + 1; x++) if ((h.has(x, y) || h.has(x - 1, y) || h.has(x + 1, y)) && B.bay(x, y) < .7) K.set(x, y, y === yb - 4 ? '#5a80a8' : '#26405e');
      // die hellen Augen
      const [kx, ky] = hunde[1].kopf;
      K.licht(kx - 1, ky - 1, 10, '#2a4a70', 1);
      K.set(kx - 1, ky - 1, '#ffffff'); K.set(kx - 2, ky - 1, '#e8f6ff'); K.set(kx, ky - 1, '#5a8ab0');
      K.vignette(.7, { cx: 76, cy: 60 });
    },

    // Eine einsame Fahnenstange auf spiegelndem schwarzem Eis, das Tuch gefroren und quer abstehend, im Stoff die Wölbung eines Gesichts.
    eis_fahne(K) {
      const { B } = K;
      const hy = 56;
      K.himmel(hy, NACHT, { steil: .55, gx: 20, gb: 50, basis: .12 });
      K.sterne(18, 40, ['#1a2a44', '#3a5a80']);
      K.mond(22, 14, 2.5, { hof: 6, hofFarbe: '#0e1828' });
      eisFlaeche(K, hy, { horizont: .4, basis: .1 });
      spiegeln(K, hy, 90, .5);
      for (let x = 0; x < 160; x++) if (B.hash(x >> 2, 1, 3) < .7) K.set(x, hy, '#1a2a44');
      const px = 52, pb = 74;
      // Stange
      const st = K.maske(); st.kap(px, pb, px, 10, 1.5, 1.2); st.ell(px, 9, 2, 1.6);
      K.form(st, 0, { k: DUNKEL, r: KALT, ton: 1.2, fase: 0, rand: 1, rimF: .6, L: [-1, -.2] });
      // Das Tuch: steif quer, mit Falten; in der Mitte wölbt sich ein Gesicht
      const fy0 = 12, fy1 = 42, fx0 = px + 1, fx1 = 124;
      const tuch = K.maske();
      tuch.fn(fx0, fy0 - 4, fx1, fy1 + 4, (x, y) => {
        const q = (x - fx0) / (fx1 - fx0), oben = fy0 + q * 3 + Math.sin(q * 9) * 1.4, unten = fy1 - q * 2 + Math.sin(q * 8 + 1) * 1.6;
        return y >= oben && y <= unten && x <= fx1 - Math.abs(Math.sin(y * .5)) * 3;
      });
      const gx = 92, gy = 27;
      const gesicht = (x, y) => {
        const dx = (x - gx) / 11, dy = (y - gy) / 13, r = Math.hypot(dx, dy); if (r > 1.15) return 0;
        let t = (1.1 - r) * 1.3 - dx * 1.3 - dy * .5;                                 // Wölbung, Licht von links oben
        if (Math.hypot((x - gx + 4.5) / 2.6, (y - gy + 3) / 2.2) < 1) t -= 2;         // Augenhöhlen
        if (Math.hypot((x - gx - 4.5) / 2.6, (y - gy + 3) / 2.2) < 1) t -= 2.2;
        if (Math.abs(x - gx) < 1 && y > gy - 2 && y < gy + 3) t += .8;                // Nasenrücken
        if (Math.abs(x - gx - 1.5) < 1 && y > gy && y < gy + 4) t -= .8;
        if (Math.hypot((x - gx) / 2.8, (y - gy - 7.5) / 3.4) < 1) t -= 3;             // offener Mund
        if (Math.hypot((x - gx) / 4, (y - gy - 7.5) / 4.6) < 1 && y < gy + 5) t += .5; // Oberlippe
        return t;
      };
      const falte = (x, y) => Math.sin((x - fx0) * .55 + y * .08) * .45;
      K.form(tuch, 0, { k: ['#05080e', '#0e1622', '#1c2a3e', '#30445e', '#4c6684', '#7a96b4', '#a8c0d8'], r: KALT, ton: 2, vx: -.8, L: [-.8, -.6], muster: (x, y) => falte(x, y) * Math.min(1, Math.hypot(x - gx, y - gy) / 12) + gesicht(x, y) });
      // Reif am Saum, ein paar Eiszapfen unter dem Tuch
      for (let x = fx0 + 3; x < fx1 - 6; x += 5 + (x % 3)) { const yb = fy1 - (x - fx0) / (fx1 - fx0) * 2 + 1; for (let j = 0; j < 2 + (x % 4); j++) K.set(x, yb + j, j ? '#26405e' : '#5a8ab0'); }
      // Stange und Tuch im Eis gespiegelt
      spiegeln(K, pb, 90, .45, { x0: px - 3, x1: px + 3 });
      K.licht(px, pb, 18, '#0e1828', .8, { oval: 2.5, maske: (x, y) => y >= hy });
      K.vignette(.75, { cx: 84, cy: 36 });
    },

    // Durch schwarzes Eis gesehen: ein Feld steinerner, gefiederter Lilien, eine Lücke darin, und auf dem Eis darüber eine Spur aus dünnen Krallenabdrücken.
    eis_garten(K) {
      const { B } = K;
      // Oben ein Streifen Eis bis zum Horizont, darunter sieht man durch das Eis in die Tiefe: fahles Türkis hinter den Lilien
      K.himmel(10, NACHT, { steil: .4 });
      const lx = 80, ly = 60; // die Lücke
      K.feld(0, 10, 160, 90, ['#010204', '#03080c', '#061218', '#0a1c24', '#0c2a36', '#123e4e', '#15485a'], (x, y) => .1 + Math.exp(-(((y - 44) / 20) ** 2)) * .75 * Math.exp(-(((x - lx) / 60) ** 2)) + (B.fbm(x * .04, y * .08, K.seed, 2) - .5) * .12);
      K.rect(0, 10, 160, 1, '#1a2a44');
      const lilie = (x, yb, s, neig, tiefe) => {
        const m = K.maske(), top = [x + neig * s, yb - 15 * s];
        for (let i = 0; i < 9; i++) { const q = i / 9; m.ell(B.lerp(x, top[0], q), B.lerp(yb, top[1], q), 1.5 * s, .75 * s); }
        m.kap(x, yb, top[0], top[1], .7 * s, .6 * s);
        for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .34 + neig * .05, l = (6.5 - Math.abs(i - 3) * .6) * s; m.kap(top[0], top[1] + s, top[0] + Math.cos(a) * l, top[1] + Math.sin(a) * l * .9 + Math.abs(i - 3) * 1.1 * s, 1.1 * s, .3 * s); }
        K.form(m, tiefe, { k: ['#010204', '#02050a', '#050c12', '#08141c'], r: [UMRISS[1], UMRISS[2]], ton: .8, rand: 1, L: [0, -1], nebelFarbe: '#0c2a36', muster: (px, py) => (py > top[1] + 2 * s && Math.abs((py - yb) % (1.67 * s)) < .6 ? 1.2 : 0) });
      };
      const r = B.rng(11);
      for (const [y, s, tf, ab] of [[36, .7, .5, 16], [48, 1, .25, 22], [ly, 1.4, .05, 30], [92, 2.1, 0, 44]]) {
        for (let x = (y % 4) * 4 - 6; x < 172; x += ab + r.f(-2, 2)) {
          if (Math.abs(x - lx) < ab * .5 && y === ly) continue;
          lilie(x, y, s, (x - lx) / 40 * -1.2, tf);
        }
      }
      // Lücke: nur ein Abdruck im Grund, aus dem es fahl leuchtet
      K.licht(lx, ly - 4, 26, '#0c3440', 1, { oval: 1.4 });
      const ab = K.maske(); ab.ell(lx, ly, 7, 2.4); ab.ell(lx, ly - .3, 4.4, 1.3, 0);
      K.form(ab, 0, { k: ['#0c2a36', '#15485a', '#2a7088', '#5ab0c8'], r: ['#5ab0c8', '#bfeef6'], ton: 2, fase: 0, rand: 1, L: [0, -1] });
      for (let x = lx - 3; x <= lx + 3; x++) K.set(x, ly, Math.abs(x - lx) < 2 ? '#bfeef6' : '#5ab0c8');
      // Das Eis darüber: ein paar Glanzstreifen und feine Risse auf der Oberfläche
      for (let i = 0; i < 6; i++) { const y = 18 + i * 12 + r.f(-2, 2); for (let x = 0; x < 160; x++) if (Math.sin(x * .04 + i * 2) > .55 && B.hash(x, i, 3) < .55) K.set(x, Math.round(y + Math.sin(x * .03 + i) * 1.5), '#1a2a44'); }
      // Krallenspur auf dem Eis: von der Lücke weg nach vorn, dorthin, wo du herkommst
      for (let i = 0; i < 6; i++) {
        const q = i / 5, cx = lx + (i & 1 ? 1 : -1) * (2 + q * 4) + q * 6, cy = ly + 4 + Math.pow(q, 1.2) * 30, s = .8 + q * .9;
        for (const a of [-.55, 0, .55]) K.linie(cx, cy, cx + Math.sin(a) * 3 * s, cy + Math.cos(a) * 3.4 * s, '#a8c8e8');
        K.set(cx, cy - 1, '#5a8ab0'); K.set(cx, cy, '#e8f6ff');
      }
      K.vignette(.8, { cx: lx, cy: 52 });
    },

  },
};
