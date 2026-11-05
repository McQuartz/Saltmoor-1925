// Ereignisbilder 160 × 90 · Grotte (data/biome/grotte.json).
// Palette der Grotte (prototype/js/scenes/world/grotte.js): kalter, nasser Schiefer, Tropfstein,
// Wachs in Gelb und Honig, Kerzenlicht warm. Viel Schwarz, das Licht kommt von unten aus den Kerzen.
'use strict';

const SCH = ['#030405', '#06080a', '#0a0d10', '#0f1317', '#151a1f', '#1c2229', '#252c34', '#303841', '#3e4752', '#56606b'];
const WACHS = ['#1c130b', '#2e2012', '#46301a', '#644624', '#8a6634', '#b48c4c', '#d8b468', '#f0d8a0', '#fff2d0'];
const TROPF = ['#14130f', '#211f19', '#302d25', '#423e33', '#575144', '#6e6754', '#8a8168', '#a89d80', '#c8bc9c'];
const HOLZ = ['#0a0806', '#140f0b', '#1f1711', '#2c2118', '#3a2c20', '#4c3a2a'];
const ROT = ['#2a0806', '#4a100a', '#6e1a10', '#9a2a18'];
const RIM = ['#a48a4c', '#f4e2a6'], RIMK = ['#4c5a68', '#a8bccc'];
const FL = { kern: '#fff4dc', mitte: '#ffb04a', aussen: '#c0521c', glut: '#4a2a10' };
const GIPS = ['#2a2a28', '#4a4842', '#6e6a60', '#948e80', '#b4ae9e'];

// Schiefer: geneigte Schichten, nasse Glanzspuren, Rauschen (wie im Hintergrund)
const schiefer = (B, sd, neig, st) => (x, y) => {
  const lage = Math.floor((y + x * (neig || .3)) / (st || 5));
  let t = ((lage % 3) === 0 ? -.35 : 0) + (B.hash(lage, 0, sd) - .5) * .4 + (B.fbm(x * .05, y * .025, sd, 2) - .5) * .5;
  if (B.hash(x >> 1, 7, sd) > .93 && B.rausch2(x * .2, y * .09, sd + 3) > .62) t += .6;
  return t;
};
// Felswand füllen: Schiefer, nach t0 aufgehellt
function fels(K, t0, o) { o = o || {}; const { B } = K; K.feld(o.x0 || 0, o.y0 || 0, o.x1 || 160, o.y1 || 90, SCH.slice(0, 8), (x, y) => (o.maske && !o.maske(x, y)) ? -1 : t0 + schiefer(B, K.seed, o.neig, o.st)(x, y) * .3 + (o.tf ? o.tf(x, y) : 0)); }
// Kleine Kerzen: [x, y, h, art (0 Wachs, 1 rot, 2 weiß), brennt]; Flamme als 1–2 Pixel
function kerzen(K, liste, o) {
  o = o || {}; const { B } = K;
  const KOERPER = [[WACHS[5], WACHS[3]], [ROT[3], ROT[1]], [WACHS[7], WACHS[5]]].map(p => p.map(c => B.mix(c, SCH[2], o.dunkel || 0)));
  for (const [x, y, h, art, an] of liste) {
    if (an && o.hof !== 0) K.licht(x, y - h - 1, o.hof || 7, FL.glut, o.staerke || .7);
  }
  for (const [x, y, h, art, an] of liste) {
    const c = KOERPER[art || 0];
    for (let j = 0; j < h; j++) K.set(x, y - j, j === h - 1 ? c[0] : c[j % 2]);
    if (an) { K.set(x, y - h, FL.aussen); K.set(x, y - h - 1, h > 2 && !o.klein ? FL.mitte : FL.aussen); if (o.kern) K.set(x, y - h - 1, FL.kern); }
  }
}
function kerzenBand(K, x0, x1, yf, o) {
  o = o || {}; const { B } = K, r = B.rng(Math.round(x0 * 31 + x1 * 7 + (o.seed || 0))), L = [];
  for (let x = x0; x < x1; x += o.abstand || 2) {
    if (r() < (o.luecke || .12)) continue;
    if (o.ohne && o.ohne(x)) continue;
    L.push([Math.round(x + r.j(.4)), Math.round(yf(x)), r.i(o.hMin || 1, o.hMax || 4), r() < (o.rot || .3) ? 1 : r() < .3 ? 2 : 0, r() < (o.an === undefined ? .7 : o.an)]);
  }
  kerzen(K, L, o);
  return L;
}
// Achselkrücke als Maske: Fuß (x,y), Winkel a (zum Kopfende), Länge l, Größe s
function kruecke(m, x, y, a, l, s) {
  const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l, nx = -Math.sin(a), ny = Math.cos(a);
  m.kap(x, y, ex, ey, .6 * s, .6 * s);
  m.kap(ex - nx * 3.4 * s, ey - ny * 3.4 * s, ex + nx * 3.4 * s, ey + ny * 3.4 * s, .9 * s, .9 * s);
  const gx = x + Math.cos(a) * l * .62, gy = y + Math.sin(a) * l * .62; m.kap(gx - nx * 2.2 * s, gy - ny * 2.2 * s, gx + nx * 2.2 * s, gy + ny * 2.2 * s, .55 * s, .55 * s);
  const fx = x + Math.cos(a) * l * .3, fy = y + Math.sin(a) * l * .3;
  m.kap(fx, fy, ex + nx * 3 * s, ey + ny * 3 * s, .5 * s, .5 * s); m.kap(fx, fy, ex - nx * 3 * s, ey - ny * 3 * s, .5 * s, .5 * s);
  return [gx, gy];
}
// Hand als Maske: Handwurzel (x, y), Richtung a der Finger, Größe s, spreiz: Fingerspreizung
function handMaske(m, x, y, a, s, o) {
  o = o || {}; const sp = o.spreiz === undefined ? .28 : o.spreiz, c = Math.cos(a), si = Math.sin(a);
  const px = x + c * 3 * s, py = y + si * 3 * s;
  m.ell(px, py, 3.2 * s, 3.2 * s);
  for (let f = 0; f < 4; f++) {
    const fa = a + (f - 1.5) * sp, l = (o.finger ? o.finger[f] : 1) * (6 - Math.abs(f - 1.5) * 1) * s;
    const bx = px + Math.cos(fa) * 2.4 * s, by = py + Math.sin(fa) * 2.4 * s;
    m.kap(bx, by, bx + Math.cos(fa) * l, by + Math.sin(fa) * l, .85 * s, .7 * s);
  }
  const da = a + (o.daumen || -1.25);
  m.kap(px + Math.cos(da) * 2.2 * s, py + Math.sin(da) * 2.2 * s, px + Math.cos(da + .35) * 6 * s, py + Math.sin(da + .35) * 6 * s, 1 * s, .8 * s);
  if (o.arm) m.kap(x, y, x - c * o.arm * s, y - si * o.arm * s, 2 * s, 2.3 * s);
  return [px, py];
}

module.exports = {
  biom: 'grotte',
  bilder: {
    // Eine Felswand voller Krücken im Kerzenlicht, kleine Zettel daran, einer davon frisch und weiß.
    grotte_kruecken(K) {
      const { B } = K;
      fels(K, .3, { tf: (x, y) => -Math.abs(x - 80) / 400 });
      // Felsband unten mit Kerzen: das Licht kommt von unten
      const band = K.maske(); band.poly([[0, 80], [40, 77], [90, 78], [130, 76], [160, 79], [160, 90], [0, 90]]);
      K.form(band, 0, { k: SCH.slice(1, 6), r: RIM, ton: 1.6, fase: 1, rand: 1, L: [0, -1], muster: (x, y) => (B.hash(x >> 2, y >> 1, 5) - .5) * .5 });
      K.licht(80, 92, 90, '#3a2410', .9, { oval: 1.1 });
      // Krücken: unregelmäßig an Nägeln gehängt, schief, übereinander; Holz mit Flächen, von unten warm
      K.lichtquelle(80, 120);
      const HOLZW = ['#100906', '#1e1209', '#311d0f', '#462a16', '#5e3a1f', '#7a4e2a', '#9a683a'];
      const tr = B.rng(29), zettel = [];
      const liste = [
        [10, 46, -.22, 36, .15], [30, 40, .12, 30, .15], [52, 50, -.08, 40, .15], [76, 38, .28, 28, .15], [98, 48, -.3, 34, .15], [122, 42, .06, 32, .15], [146, 50, -.15, 38, .15],
        [20, 76, .2, 40, 0], [42, 70, -.35, 34, 0], [64, 78, .05, 44, 0], [88, 72, -.12, 38, 0], [110, 77, .32, 42, 0], [134, 74, -.05, 40, 0], [154, 70, .25, 30, 0],
      ];
      for (const [x, yf, wink, l, tiefe] of liste) {
        const a = -Math.PI / 2 + wink, m = K.maske();
        const g = kruecke(m, x, yf, a, l, 1.6);
        const ex = x + Math.cos(a) * l, ey = yf + Math.sin(a) * l;
        K.form(m, tiefe, { k: HOLZW, r: ['#6a4422', '#a0703a'], ton: 2.4, fase: 1, rand: 1, rimF: .25, verlauf: -.9, schatten: 2, muster: (px, py) => ((px * 3 + py) % 9 === 0 ? -.5 : 0) });
        K.set(ex, ey - 4, SCH[8]); K.set(ex, ey - 5, SCH[6]);   // Nagel über der Achselstütze
        zettel.push([Math.round(g[0]) + 2, Math.round(g[1]) + 1, tr()]);
      }
      // Licht der Kerzen: unten stark, nach oben verlöschend
      K.licht(80, 96, 100, '#3a2410', .95, { oval: 1.05 });
      // Zettel an Schnüren, vergilbt; einer frisch und weiß
      const frisch = 10;
      zettel.forEach(([x, y, v], i) => {
        if (i === frisch) return;
        K.linie(x - 1, y - 2, x, y, SCH[7]);
        K.rect(x, y, 4, 3, v < .5 ? WACHS[2] : WACHS[3]); K.rect(x, y, 4, 1, WACHS[4]); K.set(x + 1, y + 1, WACHS[1]); K.set(x + 2, y + 1, WACHS[1]);
      });
      const [fx, fy] = zettel[frisch];
      K.licht(fx + 2, fy + 2, 16, '#2a2a26', .9);
      K.linie(fx - 2, fy - 3, fx, fy, '#8a8a84');
      K.rect(fx, fy, 6, 4, '#e8e4da'); K.rect(fx, fy, 6, 1, '#ffffff'); K.rect(fx, fy + 3, 6, 1, '#b4b0a6');
      K.linie(fx + 1, fy + 2, fx + 4, fy + 2, '#5a5650');
      // Kerzen auf dem Felsband
      kerzenBand(K, 4, 156, x => 79 - Math.sin(x * .05) * 1.5, { abstand: 3, hMin: 1, hMax: 3, an: .8, hof: 6, staerke: .6, klein: true });
      K.vignette(.7, { cx: 80, cy: 44, farbe: SCH[0] });
    },

    // Ein steinernes Becken unter einem Wasserfaden, auf dem Grund Brillen und ein Glasauge im Kerzenschein.
    grotte_quelle(K) {
      const { B } = K;
      fels(K, .25, { neig: .4 });
      // Felslippe oben, aus der der Wasserfaden kommt
      const lippe = K.maske(); lippe.poly([[40, 0], [120, 0], [112, 10], [90, 14], [80, 16], [70, 13], [50, 9]]);
      K.form(lippe, 0, { k: SCH.slice(1, 7), r: [SCH[7]], ton: 1.4, fase: 0, rand: 0, L: [0, 1], muster: schiefer(B, 3, .2, 3) });
      // Becken: Rand aus Tropfstein, innen klares Wasser über hellem Grund
      const cx = 80, cy = 60, rx = 46, ry = 15;
      const auss = K.maske(); auss.fn(cx - rx, cy - ry, cx + rx, cy + ry + 14, (x, y) => { const q = (x - cx) / rx; return Math.abs(q) <= 1 && y >= cy - ry * Math.sqrt(Math.max(0, 1 - q * q)) && y <= cy + 8 + Math.sqrt(Math.max(0, 1 - q * q)) * ry; });
      K.lichtquelle(20, 30);
      K.form(auss, 0, { k: TROPF.slice(0, 6), r: RIM, ton: 2.2, fase: 1, rand: 1, verlauf: .5, schatten: 2 });
      const ix = rx - 5, iy = ry - 4;
      const innen = (x, y) => Math.hypot((x + .5 - cx) / ix, (y + .5 - cy) / iy) < 1;
      K.feld(0, 0, 160, 90, SCH.slice(1, 9), (x, y) => innen(x, y) ? .45 - Math.hypot((x - 50) / 60, (y - cy) / 20) * .3 + (B.hash(x >> 1, y, 4) - .5) * .12 : -1);
      // Auf dem Grund: Brillen, ein Hörrohr, das Glasauge
      const draht = ['#1a1810', '#3a3424', '#6a6040', '#a89a6a'];
      for (const [bx, by, s] of [[58, 61, 1], [104, 57, .8]]) {
        const br = K.maske(); br.ell(bx - 3.4 * s, by, 3 * s, 2 * s); br.ell(bx + 3.4 * s, by, 3 * s, 2 * s); br.ell(bx - 3.4 * s, by, 2.2 * s, 1.2 * s, 0); br.ell(bx + 3.4 * s, by, 2.2 * s, 1.2 * s, 0); br.rect(bx - .6, by - 1, 1.6, 1); br.kap(bx - 6.2 * s, by, bx - 9 * s, by + 2 * s, .45, .45);
        K.form(br, 0, { k: draht, r: RIM, ton: 2, fase: 0, rand: 1 });
      }
      const hr = K.maske(); hr.kap(88, 66, 100, 64, .8, 2.2); hr.ell(101, 64, 1.6, 3); hr.kap(88, 66, 85, 69, .8, .8);
      K.form(hr, 0, { k: ['#1a1008', '#3a2412', '#5a3a1c', '#7a5428'], r: RIM, ton: 2, fase: 0, rand: 1 });
      // Das Glasauge: dreht sich zu dir
      const ax = 78, ay = 65;
      K.licht(ax, ay, 22, '#2a2014', .9, { maske: innen });
      const ag = K.maske(); ag.ell(ax, ay, 3.2, 3);
      K.form(ag, 0, { k: ['#8a8478', '#b8b2a4', '#ded8c8', '#f4f0e4'], ton: 2.6, fase: 0, rand: 1, r: ['#ffffff'], L: [-.7, -.7] });
      K.set(ax + 1, ay, '#2a4a5a'); K.set(ax + 2, ay, '#2a4a5a'); K.set(ax + 1, ay + 1, '#2a4a5a'); K.set(ax + 2, ay + 1, '#1a2a34'); K.set(ax + 2, ay - 1, '#3a6070');
      K.set(ax - 1, ay - 1, '#ffffff');
      // Wasserfaden und der Ring, wo er auftrifft
      for (let y = 15; y < 57; y++) { K.set(80 + (y % 7 === 0 ? 1 : 0), y, y % 3 ? '#7a8a96' : '#b8c8d2'); }
      for (let a = 0; a < 6.28; a += .2) K.set(80 + Math.cos(a) * 6, 57 + Math.sin(a) * 1.6, '#4a5a66');
      for (let a = 0; a < 6.28; a += .14) if (B.bay(Math.cos(a) * 20, Math.sin(a) * 9) < .6) K.set(80 + Math.cos(a) * 13, 58 + Math.sin(a) * 3.4, '#2a343c');
      // Kerzen auf dem Rand links
      kerzen(K, [[40, 50, 4, 0, true], [44, 51, 3, 2, true], [47, 50, 2, 1, false]], { hof: 26, staerke: .8 });
      K.vignette(.75, { cx: 74, cy: 54, farbe: SCH[0] });
    },

    // Ein Arbeitstisch mit Gussformen aus Gips, Dochte im Bündel, eine weiche Wachshand mit einer Narbe.
    grotte_wachszieher(K) {
      const { B } = K;
      fels(K, .2, { y1: 44 });
      // Tischplatte in Aufsicht
      const tisch = K.maske(); tisch.poly([[4, 42], [156, 42], [172, 90], [-12, 90]]);
      K.lichtquelle(122, 30);
      K.form(tisch, 0, { k: HOLZ.slice(0, 6), r: RIM, ton: 2.2, fase: 1, rand: 1, verlauf: -.5, muster: (x, y) => (((x - 80) / (1 + (y - 42) / 30)) % 14 < 1 ? -1 : 0) + (B.rausch2(x * .03, y * .4, 3) - .5) * .4 });
      // Gussformen aus Gips: Block mit Hohlform (Hand, Bein, Herz)
      const form = (x, y, w, h, hohl) => {
        const m = K.maske(); m.rect(x, y, w, h);
        K.form(m, 0, { k: GIPS, r: ['#d0cabc'], ton: 2.4, fase: 1, rand: 1, schatten: 2 });
        const n = K.maske(); hohl(n); K.form(n, 0, { k: ['#0e0e0c', '#1a1a18', '#2a2a26', '#3a3a34'], ton: 1.4, fase: 0, rand: 0, verlauf: -.8 });
      };
      form(14, 46, 22, 14, n => handMaske(n, 18, 53, 0, .9, { spreiz: .22 }));
      form(40, 44, 14, 18, n => { n.kap(47, 47, 47, 57, 2.4, 1.8); n.kap(47, 57, 51, 58, 1.5, 1.2); });
      form(58, 46, 14, 12, n => { n.ell(63, 50, 2.4, 2.2); n.ell(67, 50, 2.4, 2.2); n.poly([[60.6, 50.6], [69.4, 50.6], [65, 55.5]]); });
      // Augenpaar aus Wachs, fertig, auf einem Brett
      const au = K.maske(); au.ell(82, 51, 3, 1.8); au.ell(90, 51, 3, 1.8);
      K.form(au, 0, { k: WACHS.slice(2, 6), r: RIM, ton: 2, fase: 0, rand: 1 });
      // Dochte im Bündel: über einem Stab hängend, oben zusammengebunden
      const do_ = K.maske(); do_.kap(126, 6, 152, 6, .9, .9);
      for (let i = 0; i < 12; i++) { const x = 130 + i * 1.6; do_.kap(x, 7, x + Math.sin(i * 1.7) * 1.2, 26 + (i * 7) % 6, .4, .4); }
      do_.rect(129, 10, 19, 2);
      K.form(do_, .05, { k: ['#2a2620', '#4a443a', '#6a6456', '#8a8472'], ton: 2, fase: 0, rand: 1, r: ['#c8c0a8'], L: [-.5, -1] });
      // Talglicht auf dem Tisch
      const lm = K.maske(); lm.ell(122, 45, 4, 1.6); lm.rect(120.5, 38, 3, 7);
      K.form(lm, 0, { k: WACHS.slice(3, 7), ton: 2, fase: 0, rand: 1, r: [WACHS[7]], L: [0, -1] });
      // Die weiche Wachshand: liegt da, frisch gegossen, mit deiner Narbe am Daumen
      const wh = K.maske(), hx = 76, hy = 72;
      handMaske(wh, hx, hy, -.12, 2.2, { spreiz: .3, arm: 6, finger: [1, 1.05, 1, .9], daumen: -1.35 });
      K.licht(hx + 8, hy - 4, 34, '#3a2610', .8);
      K.form(wh, 0, { k: WACHS.slice(3, 9), r: [WACHS[7], WACHS[8]], ton: 3.2, fase: 1, rand: 2, verlauf: .6, schatten: 2, muster: (x, y) => (B.fbm(x * .3, y * .3, 5, 2) - .5) * .6 });
      // weich: ein Tropfen ist am Handballen ausgelaufen
      const tp = K.maske(); tp.ell(hx - 2, hy + 6, 3.6, 1.3); K.form(tp, 0, { k: WACHS.slice(3, 7), ton: 2.4, fase: 0, rand: 0 });
      // Narbe am Daumen
      K.linie(hx + 9, hy - 9, hx + 12, hy - 11, '#6a2a18'); K.set(hx + 10, hy - 9, '#9a4a2a');
      K.flamme(122, 38, { gross: 2, hof: 70 });
      K.vignette(.75, { cx: 90, cy: 58, farbe: SCH[0] });
    },

    // Nahe vor dem Tropfstein: eine glatte, glänzende Fläche, wo das Gesicht sein müsste, und im Rücken des Betrachters ein warmes Licht.
    grotte_abgewandt(K) {
      const { B } = K;
      // Ganz nah die Felswand rechts, links der Spalt ins Dunkel
      fels(K, .22, { neig: .5, st: 4 });
      K.feld(0, 0, 160, 90, SCH, (x, y) => x < 24 - y * .05 ? .05 : -1);
      // Die Madonna aus Tropfstein: Schleier, gewachsene Falten, Tropfspuren
      const m = K.maske();
      m.ell(82, 30, 26, 28); m.poly([[56, 34], [108, 34], [124, 92], [40, 92]]);
      K.lichtquelle(80, 140);
      K.form(m, 0, { k: TROPF.slice(0, 7), r: RIM, ton: 2.6, fase: 2, rand: 2, verlauf: -.6, schatten: 2, rimF: .2, muster: (x, y) => (Math.sin((x - 82) * .55 + Math.sin(y * .08) * 1.5) > .72 ? -.9 : 0) + ((x * 7 + 3) % 11 === 0 && B.rausch2(x * .3, y * .05, 3) > .5 ? .6 : 0) + (B.fbm(x * .08, y * .08, 9, 2) - .5) * .5 });
      // Wo das Gesicht sein müsste: glatt gerieben wie eine Türklinke, glänzend, ohne Züge
      const fx = 82, fy = 32, rx = 13, ry = 16;
      const g = K.maske(); g.ell(fx, fy, rx, ry);
      K.form(g, 0, { k: ['#0e0c09', '#1e1a14', '#342e22', '#4e4532', '#6a5e44'], r: [], ton: 1.6, fase: 0, rand: 0, muster: (x, y) => { const q = Math.hypot((x - fx) / rx, (y - fy) / ry); return -q * 1.2 + (1 - q) * .8; } });
      K.feld(0, 0, 160, 90, ['#4e4532', '#7a6a46', '#b89658', '#e8c47a', '#fff0c0'], (x, y) => {
        const q = Math.hypot((x + .5 - (fx + 1)) / 6.5, (y + .5 - (fy + 6)) / 8);
        if (q >= 1 || !g.has(x, y)) return -1; return (1 - q) * 1.1;
      });
      // Spiegelbild des Lichts im Rücken: ein heller Punkt, darum ein Ring
      K.set(fx + 1, fy + 5, '#ffffff'); K.set(fx + 2, fy + 5, '#fff0c0'); K.set(fx + 1, fy + 6, '#fff0c0');
      // Warmes Licht von hinten (vom Betrachter): auf Schleier und Fels
      K.licht(82, 100, 90, '#3a2410', .85);
      K.vignette(.7, { cx: 82, cy: 40, farbe: SCH[0] });
    },

    // Ein Gang mit Wachshaufen auf dem Boden, aus denen Hände ragen, eine davon heller als die anderen.
    grotte_mehr(K) {
      const { B } = K;
      const vx = 86, vy = 38;
      // Gang: Felswände laufen zum Fluchtpunkt, hinten Schwarz
      fels(K, .32, { tf: (x, y) => -Math.max(0, 1 - Math.hypot((x - vx) / 40, (y - vy) / 26)) * .7 });
      for (const z of [1.2, 1.8, 2.7, 4]) { const w = 64 / z, h = 44 / z; for (let a = Math.PI * 1.05; a < Math.PI * 1.95; a += .02) K.set(vx + Math.cos(a) * w, vy + 6 / z + Math.sin(a) * h, SCH[1]); }
      K.feld(0, 0, 160, 90, SCH, (x, y) => Math.hypot((x - vx) / 12, (y - vy) / 10) < 1 ? .04 : -1);
      K.feld(0, 0, 160, 90, SCH.slice(0, 6), (x, y) => y > vy + 6 + Math.abs(x - vx) * .15 ? .25 + (y - vy) / 120 : -1);
      // Wachshaufen links und rechts, Hände ragen heraus, hinten kleiner
      K.lichtquelle(96, 76);
      const tr = B.rng(43);
      const haufen = [[-1, 6.5], [1, 6], [-1, 4.4], [1, 4], [-1, 3], [1, 2.8], [-1, 2], [1, 1.8], [-1, 1.35], [1, 1.25]];
      for (const [sd, z] of haufen) {
        const s = 1.6 / z, x = vx + sd * (52 + tr.j(5)) / z, y = vy + 48 / z;
        const h = K.maske(); for (let i = 0; i < 5; i++) h.ell(x + (i - 2) * 4 * s + tr.j(1.5 * s), y - tr.f(0, 2) * s, (4 + tr.f(0, 3)) * s, (2.5 + tr.f(0, 2)) * s);
        K.form(h, Math.min(.6, (z - 1) / 7), { k: WACHS.slice(0, 4), r: [WACHS[4]], ton: 2, fase: 1, rand: 1, muster: (px, py) => (B.hash(px >> 1, py >> 1, 6) - .5) * .5 });
        for (let j = 0; j < 2; j++) {
          const hm = K.maske(); handMaske(hm, x + (j ? 3 : -4) * s + tr.j(2 * s), y - 2 * s, -Math.PI / 2 + tr.j(.6), s * .9, { spreiz: .25 + tr.f(0, .15), arm: 4, finger: [1, tr.f(.6, 1.1), 1, .8] });
          K.form(hm, Math.min(.6, (z - 1) / 7), { k: WACHS.slice(1, 5), r: [WACHS[5]], ton: 2.2, fase: 1, rand: 1 });
        }
      }
      // Vorn die neue Hand: heller, noch weich, der Zeigefinger zeigt auf dich
      const nx = 96, ny = 80, nm = K.maske();
      nm.ell(nx, ny + 2, 12, 4); nm.ell(nx - 8, ny + 4, 7, 3);
      K.form(nm, 0, { k: WACHS.slice(1, 5), r: [WACHS[5]], ton: 2.2, fase: 1, rand: 1 });
      K.licht(nx, ny - 8, 30, '#3a2610', .9);
      const hd = K.maske();
      handMaske(hd, nx + 2, ny, -Math.PI / 2 - .5, 2.2, { spreiz: .3, arm: 4, finger: [.35, 1.25, .35, .3], daumen: -1.6 });
      K.form(hd, 0, { k: WACHS.slice(4, 9), r: [WACHS[8], '#ffffff'], ton: 3, fase: 1, rand: 2, verlauf: .5, L: [-.3, -1] });
      // Kerzenstumpf weit hinten im Gang
      kerzen(K, [[vx + 3, vy + 9, 2, 0, true], [vx - 2, vy + 9, 1, 1, true]], { hof: 34, staerke: .8 });
      K.vignette(.7, { cx: 92, cy: 56, farbe: SCH[0] });
    },

    // Ein dunkles Wasserbecken, darin keine Spiegelung, nur Kerzenpunkte an der falschen Stelle.
    grotte_stimme(K) {
      const { B } = K;
      fels(K, .26, { neig: .35 });
      // Felsband hinten mit Kerzen (links oben)
      const band = K.maske(); band.poly([[0, 40], [30, 37], [76, 39], [100, 42], [160, 40], [160, 50], [0, 50]]);
      K.form(band, 0, { k: SCH.slice(1, 7), r: RIM, ton: 1.6, fase: 1, rand: 1, L: [0, -1] });
      const oben = [[14, 39, 4, 0, true], [19, 38, 6, 2, true], [24, 39, 3, 1, true], [30, 38, 5, 0, true], [35, 39, 3, 0, true], [41, 39, 4, 2, true], [47, 40, 2, 1, true], [53, 40, 5, 0, true]];
      kerzen(K, oben, { hof: 20, staerke: .8, kern: true });
      // Becken: Rand, darin Schwarz ohne Spiegelung
      const cx = 80, cy = 66, rx = 70, ry = 18;
      const rand = K.maske(); rand.ell(cx, cy, rx, ry); rand.rect(cx - rx, cy, 2 * rx, 30);
      K.form(rand, 0, { k: TROPF.slice(0, 5), r: RIM, ton: 1.8, fase: 1, rand: 1, L: [-.4, -1], muster: (x, y) => (B.hash(x >> 2, y >> 1, 3) - .5) * .5 });
      const ix = rx - 5, iy = ry - 4;
      const innen = (x, y) => Math.hypot((x + .5 - cx) / ix, (y + .5 - cy) / iy) < 1;
      K.feld(0, 0, 160, 90, ['#000000', '#010102', '#020304', '#040507'], (x, y) => innen(x, y) ? .3 + (Math.sin(y * 2.4 + x * .1) > .9 ? .5 : 0) : -1);
      // Kerzenpunkte im Wasser: rechts, wo oben keine stehen, in einer stillen Reihe
      const falsch = [[96, 62], [104, 64], [112, 63], [120, 66], [128, 65], [108, 70], [118, 71], [100, 69]];
      for (const [x, y] of falsch) { K.licht(x, y, 5, FL.glut, .8, { maske: innen }); K.set(x, y, FL.mitte); K.set(x, y + 1, FL.aussen); }
      K.vignette(.75, { cx: 70, cy: 50, farbe: SCH[0] });
    },

    // Eine alte Frau zwischen tausend Kerzen, die Hände offen, in jeder etwas aus Wachs.
    grotte_tausch(K) {
      const { B } = K;
      fels(K, .22, {});
      // Felsstufen, unregelmäßig gebrochen
      const kanten = [30, 44, 58, 72];
      kanten.forEach((y0, i) => {
        const kf = x => y0 + Math.round(B.rausch1(x * .08, i + 3) * 4 - 2);
        K.feld(0, y0 - 3, 160, y0 + 14, SCH.slice(1, 8), (x, y) => y < kf(x) ? -1 : .32 + (y === kf(x) ? .45 : 0) - (y - kf(x)) / 30 + (B.hash(x >> 2, y, i) - .5) * .2);
      });
      // Die Kerzenfrau: sitzt auf der untersten Stufe, Kopftuch, Schultertuch
      const fm = K.maske(), fx = 80;
      fm.poly([[fx - 10, 42], [fx + 10, 42], [fx + 17, 68], [fx + 22, 90], [fx - 22, 90], [fx - 17, 68]]);
      fm.ell(fx, 44, 12, 5);
      fm.ell(fx, 33, 6, 7); fm.poly([[fx - 7, 31], [fx + 7, 31], [fx + 12, 48], [fx - 12, 48]]);
      // Arme angewinkelt, die Unterarme nach vorn zum Schoß
      fm.kap(fx - 11, 47, fx - 15, 60, 3.2, 2.8); fm.kap(fx - 15, 60, fx - 9, 66, 2.8, 2.4);
      fm.kap(fx + 11, 47, fx + 15, 60, 3.2, 2.8); fm.kap(fx + 15, 60, fx + 9, 66, 2.8, 2.4);
      // Kerzen: verstreut, ungleich hoch, viele erloschen, keine Reihen
      const tr = B.rng(91), L = [];
      for (let n = 0; n < 70 && L.length < 44; n++) {
        const st = tr.i(0, 3), x = Math.round(tr.f(4, 156)), y = kanten[st] + Math.round(B.rausch1(x * .08, st + 3) * 4 - 2) + 1 + tr.i(0, 3);
        if (Math.abs(x - fx) < 24 && y > 26) continue;
        if (L.some(([a, b]) => Math.abs(a - x) < 3 && Math.abs(b - y) < 3)) continue;
        L.push([x, y, tr.i(1, 5), tr() < .12 ? 1 : tr() < .3 ? 2 : 0, tr() < .55]);
      }
      kerzen(K, L, { hof: 9, staerke: .5 });
      K.licht(fx, 30, 80, '#1e1208', .7, { ohne: fm });
      K.form(fm, 0, { k: ['#030202', '#080605', '#0e0b09', '#16110d'], ton: 1, fase: 0, rand: 0 });
      K.kante(fm, fx, 0, 90, ['#5a3a18', '#a07034'], { nah: .2, min: .2 });
      // Die offenen Hände im Schoß, in jeder etwas aus Wachs: die helle Stelle
      K.licht(fx, 64, 30, '#4a3012', .95);
      K.licht(fx, 64, 14, '#5a3c16', .8);
      const HAUT = ['#2a1e16', '#4e3a28', '#7a5e40', '#a07e58'];
      const haende = K.maske();
      for (const sx of [-1, 1]) {
        const hx = fx + sx * 8, hy = 67;
        haende.ell(hx, hy, 5, 2.4);
        for (let f = 0; f < 4; f++) haende.ell(hx - sx * 1 + sx * (f * 1.6 - 2.4) * -1, hy + 2.2, .9, 1);
        haende.kap(hx + sx * 4, hy - 1, hx + sx * 6, hy - 3, 1, .8);   // Daumen
      }
      K.form(haende, 0, { k: HAUT, r: ['#c89a6a', '#f0d0a0'], ton: 2.4, fase: 1, rand: 1, L: [0, -1] });
      const herz = K.maske(); herz.ell(fx - 9.4, 63.6, 1.9, 1.8); herz.ell(fx - 6.6, 63.6, 1.9, 1.8); herz.poly([[fx - 11.3, 64], [fx - 4.7, 64], [fx - 8, 67.5]]);
      K.form(herz, 0, { k: WACHS.slice(4, 9), r: [WACHS[8], '#ffffff'], ton: 2.8, fase: 0, rand: 1, L: [0, -1] });
      const hd = K.maske(); handMaske(hd, fx + 8, 66.5, -Math.PI / 2 + .15, .7, { spreiz: .25 });
      K.form(hd, 0, { k: WACHS.slice(4, 9), r: [WACHS[8], '#ffffff'], ton: 2.8, fase: 0, rand: 1, L: [0, -1] });
      K.kante(fm, fx, 66, 22, ['#6a4a20', '#d8a868'], { nah: .5, min: .1 });
      // Gesicht unter dem Tuch: nur ein Rest Licht von unten
      K.set(fx - 2, 36, '#2a1e14'); K.set(fx + 2, 36, '#2a1e14'); K.set(fx, 38, '#24180f'); K.linie(fx - 2, 40, fx + 2, 40, '#20160e');
      K.vignette(.6, { cx: 80, cy: 54, farbe: SCH[0] });
    },
  },
};
