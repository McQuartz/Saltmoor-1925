// Ereignisbilder 160 × 90 · Kloster (data/biome/kloster.json).
// Palette des Klosters (prototype/js/scenes/world/kloster.js): Schiefer mit einem Stich Malve, Pergament,
// fahles Tageslicht der Watteninsel. Hier ist es grau und hell, nicht nachtblau: die helle Stelle ist Papier,
// ein Fenster oder der Nebel über dem Watt.
'use strict';

const HIMMEL = ['#3a3a42', '#4a4a52', '#5c5c62', '#706e72', '#868480', '#9e9a92', '#b6b0a4', '#ccc6b6', '#dcd6c6'];
const STEIN = ['#0c0a0e', '#151216', '#1f1a1e', '#2a2428', '#383032', '#463d3c', '#564b46', '#6a5c52', '#7e6e5e'];
const PERG = ['#3c3630', '#4e4740', '#635a4e', '#7a705e', '#92876f', '#aa9e84', '#c2b69a', '#d6ccb0', '#e6dcc2'];
const BODEN = ['#0e0c10', '#18141a', '#231d22', '#2e262a', '#3b3134', '#4a3e3e', '#584a48'];
const HOLZ = ['#08060a', '#100c0e', '#1a1416', '#261d1e', '#342828', '#443430'];
const WATT = ['#141418', '#1c1c22', '#26262c', '#323238', '#404046', '#525256', '#686866', '#828078'];
const KUTTE = ['#050407', '#0a080c', '#120f14', '#1b161d'];
const RAND = ['#867c68', '#e6dcc2'];
const TINTE = '#1a1210';

// Sitzender Mönch in Kutte, im Profil: Fuß (x, yb), Höhe h; blick +1 rechts / -1 links; hand: [x, y] am Pult
function moench(K, x, yb, h, o) {
  o = o || {}; const m = K.maske(), s = h / 30, b = o.blick || 1;
  m.ell(x - b * .5 * s, yb - 13 * s, 6.5 * s, 11 * s);                         // runder Rücken
  m.poly([[x - 7 * s, yb], [x - 6 * s, yb - 12 * s], [x + b * 9 * s, yb - 10 * s], [x + b * 10 * s, yb]]); // Kutte bis zum Boden, Knie vorn
  const kx = x + b * 4 * s, ky = yb - 24 * s;
  m.ell(kx, ky, 4 * s, 4.4 * s);                                               // Kapuze
  m.poly([[kx - b * 1 * s, ky - 4.2 * s], [kx - b * 6 * s, ky - 1 * s], [kx - b * 3 * s, ky + 3 * s]]); // Zipfel hinten
  if (o.hand) m.kap(x + b * 2 * s, yb - 18 * s, o.hand[0], o.hand[1], 1.8 * s, 1.2 * s);
  m.kopf = [kx, ky];
  return m;
}
// Gesicht in der Kapuze als dunkle Höhlung (zur Blickseite b)
function kapuzenloch(K, m, b, s) {
  const [kx, ky] = m.kopf, cx = kx + b * 1.6 * s;
  for (let y = Math.floor(ky - 3 * s); y <= ky + 3 * s; y++) for (let x = Math.floor(cx - 2 * s); x <= cx + 2 * s; x++) if (m.has(x, y) && Math.hypot((x + .5 - cx) / (1.6 * s), (y + .5 - ky) / (2.5 * s)) < 1) K.set(x, y, '#020203');
}
// Rundbogen-Maske: Mitte cx, halbe Breite w, Kämpfer ys, unten yb
function rundbogen(m, cx, w, ys, yb, v) { return m.fn(cx - w - 1, ys - w - 1, cx + w + 1, yb, (x, y) => Math.abs(x - cx) <= w && (y >= ys || Math.hypot(x - cx, y - ys) <= w), v); }

module.exports = {
  biom: 'kloster',
  bilder: {
    // Eine Reihe Reisigstangen im nassen Schlick, die in den Nebel führt; an der letzten flattert ein dunkler Stofffetzen.
    kloster_pricken(K) {
      const { B } = K;
      const hz = 42, gx = 121;
      K.himmel(hz + 2, HIMMEL, { basis: .02, steil: .62, gx, gb: 34, wolken: .14 });
      K.nebel(34, 52, .55, '#9e9a92', { xs: [-20, 180, 40] });
      // Watt: Rippelmarken, Pfützen spiegeln den Himmel, nach vorn dunkler
      K.feld(0, hz, 160, 90, WATT, (x, y) => {
        const d = (y - hz) / (90 - hz), pf = B.fbm(x * .04, y * .12, K.seed + 2, 2);
        let t = .62 - d * .5 + (Math.sin(y * 1.6 + Math.sin(x * .09) * 2.2) > .55 ? .08 : 0);
        if (pf > .6) t = .78 - d * .35 + Math.max(0, 1 - Math.abs(x - gx) / 30) * .2;
        return t;
      });
      // Priel um die letzte Stange: Wasser, hell vom Nebel
      K.feld(0, hz, 160, 90, ['#6a6866', '#828078', '#9e9a92', '#b6b0a4', '#ccc6b6'], (x, y) => { const c = 50 + Math.sin(x * .05) * 1.5 - (x - 120) * .02; return Math.abs(y - c) < 1.8 - Math.abs(x - 118) / 60 ? .5 + Math.max(0, 1 - Math.abs(x - gx) / 22) * .45 : -1; });
      // Die Pricken: vorn groß und dunkel, hinten im Nebel
      const zs = [1, 1.35, 1.8, 2.4, 3.15, 4.2, 5.6];
      for (let i = zs.length - 1; i >= 0; i--) {
        const z = zs[i], x = 140 - 120 / z, yb = hz + 3 + 44 / z, h = 54 / z + 4, r = Math.max(.5, 1.5 / Math.sqrt(z));
        const m = K.maske(); m.kap(x, yb, x + .4, yb - h, r, r * .8);
        // Reisig oben: Zweige fächern auf
        const tr = B.rng(i * 13 + 5);
        for (let j = 0; j < 7; j++) { const a = -Math.PI / 2 + (j - 3) * .2 + tr.j(.08), l = (10 + tr.f(0, 5)) / Math.pow(z, .9); m.kap(x + .4, yb - h + 2 / z, x + .4 + Math.cos(a) * l, yb - h + Math.sin(a) * l, Math.max(.45, .6 / Math.sqrt(z)), .4); }
        const tiefe = Math.min(.82, (z - 1) / 6);
        K.form(m, tiefe, { k: HOLZ.slice(0, 4), r: RAND, ton: 1.2, fase: 0, rand: 1, L: [.6, -.8] });
        // Spiegelung im nassen Schlick
        for (let y = Math.ceil(yb) + 1; y < yb + h * .35; y++) if (B.bay(x, y) < .55 - (y - yb) / (h * .35) * .5) K.set(x, y, B.mix(HOLZ[2], '#9a948a', tiefe));
        // An der letzten: ein dunkler Stofffetzen, vom Wind gezogen
        if (i === zs.length - 1) {
          const f = K.maske(), fy = yb - h + 4;
          f.poly([[x + .5, fy], [x + 6, fy - 1.5], [x + 9, fy + .5], [x + 7, fy + 2], [x + 10, fy + 4], [x + 4, fy + 4.5], [x + .5, fy + 5]]);
          K.form(f, 0, { k: KUTTE, ton: 1.3, fase: 0, rand: 0 });
        }
      }
      K.vignette(.55, { cx: 100, cy: 46, farbe: STEIN[2] });
    },

    // Eine Reihe Schreibpulte mit Kerzen, eines leer, darauf ein Blatt mit einer einzelnen Zeile.
    kloster_pult(K) {
      const { B } = K;
      // Wand, ein hohes Fenster mit fahlem Tageslicht, Steinboden
      K.mauer(0, 0, 160, 58, STEIN.slice(2, 8), { hoehe: 7, breite: 13, ton: .42, tf: (x, y) => -y / 200 - Math.abs(x - 40) / 500 });
      const fe = K.maske(); rundbogen(fe, 16, 7, 12, 40);
      K.form(fe, 0, { k: HIMMEL.slice(1, 5), ton: 2, verlauf: 1, fase: 0, rand: 0, muster: (x, y) => (x === 16 || y === 24 ? -2.5 : 0) });
      K.pflaster(58, 90, BODEN, { vx: 30, ton: .34 });
      K.rect(0, 58, 160, 1, STEIN[4]);
      // Pult von der Seite: Fuß (x, yb), Größe s; Platte steigt nach rechts an
      const pult = (x, yb, s, tiefe) => {
        const m = K.maske();
        m.kap(x - 7 * s, yb, x - 6 * s, yb - 19 * s, 1 * s, .8 * s); m.kap(x + 7 * s, yb, x + 6 * s, yb - 24 * s, 1 * s, .8 * s);
        m.kap(x - 7 * s, yb - 6 * s, x + 7 * s, yb - 6 * s, .6 * s, .6 * s);
        m.poly([[x - 10 * s, yb - 19 * s], [x + 9 * s, yb - 26 * s], [x + 9 * s, yb - 23.5 * s], [x - 10 * s, yb - 16.5 * s]]);
        K.form(m, tiefe, { k: HOLZ, r: RAND, ton: 2, fase: 1, rand: 1 });
        return { blatt: [[x - 7 * s, yb - 19.4 * s], [x + 5 * s, yb - 23.8 * s]], kerze: [x + 8 * s, yb - 26 * s] };
      };
      const blatt = (p, hell, tiefe) => {
        const [[ax, ay], [bx, by]] = p, m = K.maske();
        m.poly([[ax, ay], [bx, by], [bx - 1, by - 3], [ax - 1, ay - 3]]);
        K.form(m, tiefe, { k: PERG.slice(hell ? 4 : 0, hell ? 9 : 4), ton: 2, fase: 0, rand: 0 });
      };
      // Hinten: drei besetzte Pulte, die Mönche schreiben weiter, kleine Kerzen
      const reihe = [[30, 63, .6, .4], [60, 70, .8, .25], [96, 78, 1, .1]];
      for (const [x, yb, s, tf] of reihe) {
        const p = pult(x, yb, s, tf);
        blatt(p.blatt, false, tf);
        const mo = moench(K, x - 15 * s, yb, 34 * s, { blick: 1, hand: [x - 6 * s, yb - 19 * s] });
        K.form(mo, tf * .6, { k: KUTTE, r: RAND, ton: 1.1, fase: 0, rand: 1, lichtVon: [16, 10] });
        kapuzenloch(K, mo, 1, s);
        const kz = K.maske(); kz.rect(p.kerze[0] - .5, p.kerze[1] - 4 * s, 1.5, 4 * s); K.form(kz, 0, { k: PERG.slice(3, 7), ton: 2, fase: 0, rand: 0 });
        K.flamme(p.kerze[0], p.kerze[1] - 4 * s, { hof: 16 * s + 6, staerke: .55 });
      }
      // Vorn: das freie Pult, ein leerer Hocker, das Blatt mit der einen Zeile
      const p = pult(130, 88, 1.55, 0);
      const ho = K.maske(); ho.rect(99, 72, 14, 2.5); ho.kap(101, 74, 100, 88, .9, .9); ho.kap(111, 74, 112, 88, .9, .9);
      K.form(ho, 0, { k: HOLZ, r: RAND, ton: 1.8, fase: 1, rand: 1 });
      const [[ax, ay], [bx, by]] = p.blatt, bm = K.maske();
      bm.poly([[ax, ay], [bx, by], [bx - 1.5, by - 5], [ax - 1.5, ay - 5]]);
      K.form(bm, 0, { k: PERG.slice(4, 9), r: [PERG[8]], ton: 3.4, fase: 0, rand: 1, L: [.6, -.8] });
      // eine einzige Zeile, oben, und die nasse Feder daneben
      K.linie(ax + 2, ay - 4, ax + 13, ay - 4 - 11 * (by - ay) / (bx - ax), TINTE);
      K.linie(ax + 3, ay - 3, ax + 9, ay - 3 - 6 * (by - ay) / (bx - ax), TINTE, .5);
      K.linie(bx - 2, by - 7, bx + 4, by - 13, '#c8c0b0'); K.set(bx - 2, by - 6, TINTE);
      const kz = K.maske(); kz.rect(p.kerze[0] - 1, p.kerze[1] - 6, 2.5, 6); K.form(kz, 0, { k: PERG.slice(4, 8), ton: 2.5, fase: 0, rand: 1, r: ['#fff0c0'], L: [0, -1] });
      K.flamme(p.kerze[0] + .5, p.kerze[1] - 6, { gross: 2, hof: 52 });
      K.vignette(.65, { cx: 100, farbe: STEIN[0] });
    },

    // Eine lange Bank mit Büchern, die von links nach rechts immer dicker werden, der letzte so groß wie eine Truhe.
    kloster_abschriften(K) {
      const { B } = K;
      K.fuell(STEIN.slice(1, 6), (x, y) => .35 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .2 - y / 400);
      K.feld(0, 76, 160, 90, BODEN, (x, y) => .35 + (y - 76) / 40);
      K.rect(0, 76, 160, 1, BODEN[4]);
      // Hohes Fenster rechts oben, sein Licht fällt schräg auf das letzte Buch
      const fe = K.maske(); rundbogen(fe, 136, 6, 8, 26);
      K.form(fe, 0, { k: HIMMEL.slice(4, 9), ton: 3, verlauf: .8, fase: 0, rand: 0, muster: (x) => (x === 136 ? -2 : 0) });
      for (let y = 26; y < 76; y++) for (let x = 90; x < 160; x++) {
        const c = 136 - (y - 26) * .32, w = 6 + (y - 26) * .1;
        if (Math.abs(x - c) < w && B.bay(x, y) < .45 - (y - 26) / 200) K.set(x, y, B.mix(K.get(x, y) >>> 24 ? B.unpk(K.get(x, y)) : STEIN[2], '#6a6460', .35));
      }
      // Die Bank
      const bank = K.maske(); bank.rect(4, 64, 152, 4); bank.kap(10, 68, 10, 77, 1.4, 1.4); bank.kap(150, 68, 150, 77, 1.4, 1.4); bank.kap(80, 68, 80, 77, 1.4, 1.4);
      K.lichtquelle(136, 14);
      K.form(bank, 0, { k: HOLZ, r: RAND, ton: 2, fase: 1, rand: 1, schatten: 2 });
      // Bücher: Band neben Band, jeder dicker als der davor
      const LEDER = [['#1a0c0a', '#2e1610', '#44201a', '#5a2c22'], ['#14100a', '#261e12', '#3a2e1c', '#4e3e26'], ['#120e14', '#201a24', '#302836', '#403648']];
      let x = 8;
      const n = 9;
      for (let i = 0; i < n; i++) {
        const q = i / (n - 1), w = Math.round(2 + q * q * 12), h = Math.round(14 + q * 9);
        const m = K.maske(); m.rect(x, 64 - h, w, h);
        K.form(m, 0, { k: LEDER[i % 3], r: RAND, ton: 2, fase: 0, rand: 1, muster: (px, py) => ((py - (64 - h)) === 2 || (py - (64 - h)) === h - 3 ? 1 : 0) + (px === x ? -.6 : 0) });
        x += w + 1;
      }
      // Der letzte: liegt da wie eine Truhe, mit Beschlägen, Schnitt aus Pergament
      const tx0 = x + 2, tx1 = 152, ty = 36;
      const tr = K.maske(); tr.rect(tx0, ty, tx1 - tx0, 28);
      K.form(tr, 0, { k: LEDER[0], r: RAND, ton: 2.2, fase: 1, rand: 2, muster: (px, py) => (py === ty + 3 || py === ty + 24 ? -1 : 0) });
      const schnitt = K.maske(); schnitt.rect(tx0 + 2, ty + 4, tx1 - tx0 - 2, 20);
      K.form(schnitt, 0, { k: PERG.slice(2, 8), ton: 3.6, fase: 0, rand: 0, muster: (px, py) => ((py & 1) ? -.6 : 0) + (px - tx0) / 30 });
      const besch = K.maske(); for (const [bx, by] of [[tx0, ty], [tx1 - 5, ty], [tx0, ty + 23], [tx1 - 5, ty + 23]]) besch.rect(bx, by, 5, 5); besch.rect(tx0 - 2, ty + 11, 5, 6);
      K.form(besch, 0, { k: ['#1a1610', '#3a3020', '#6a5a38', '#9a8a5a'], r: ['#c8b880', '#f0e6c0'], ton: 2, fase: 0, rand: 1 });
      K.licht(130, 48, 30, '#2a2620', .7);
      K.vignette(.65, { cx: 100, farbe: STEIN[0] });
    },

    // Ein langer Speisesaal mit Mönchen an Tischen, über ihnen ein Kopf mit zwei glimmenden Gläsern, der an einem viel zu langen Hals hängt.
    kloster_lesung(K) {
      const { B } = K;
      const vx = 80, vy = 30;
      // Saal in Fluchtperspektive: Decke, Wände, Boden
      K.fuell(STEIN.slice(0, 6), (x, y) => {
        const dx = Math.abs(x - vx), dy = y - vy;
        if (y < vy - 14 - dx * .5) return .15;                               // Decke
        if (y > vy + 10 + dx * .45) return .25 + (y - vy) / 200;                // Boden
        return .35 - dx / 400 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .15;
      });
      // Deckenbalken
      for (const z of [1.2, 1.7, 2.5, 3.8]) { const yy = vy - 14 - 60 / z; K.feld(0, yy, 160, yy + 3 / z + 1, HOLZ, () => .5); }
      // Rückwand mit drei hohen, fahlen Fenstern
      K.feld(vx - 24, vy - 16, vx + 25, vy + 11, STEIN.slice(1, 6), () => .45);
      for (const cx of [vx - 14, vx, vx + 14]) { const f = K.maske(); rundbogen(f, cx, 3, vy - 9, vy + 6); K.form(f, 0, { k: HIMMEL.slice(1, 5), ton: 2, verlauf: .8, fase: 0, rand: 0 }); }
      // Zwei lange Tische und die Reihen der Mönche (Boden: X seitlich, z Tiefe)
      const P = (X, z, hoch) => [vx + X * 40 / z, vy + (1 - (hoch || 0)) * 40 / z];
      for (const sd of [-1, 1]) {
        const t = K.maske(); t.poly([P(sd * .45, .7, .45), P(sd * .95, .7, .45), P(sd * .95, 9, .45), P(sd * .45, 9, .45)]);
        t.poly([P(sd * .45, .7, .45), P(sd * .45, .7, .37), P(sd * .45, 9, .37), P(sd * .45, 9, .45)]);
        K.form(t, .1, { k: HOLZ.slice(1), r: RAND, ton: 2.4, fase: 0, rand: 1, L: [0, -1] });
        for (const z of [7, 5, 3.6, 2.6, 1.9, 1.4, 1.05]) {
          const [x, yb] = P(sd * 1.2, z), h = 30 / z, [hx, hy] = P(sd * .8, z, .5);
          const m = moench(K, x, yb, h, { blick: -sd, hand: [hx, hy] });
          K.form(m, Math.min(.45, (z - 1) / 9), { k: KUTTE, r: [STEIN[5], STEIN[7]], ton: 1, fase: 0, rand: 1, lichtVon: [vx, vy - 10] });
          kapuzenloch(K, m, -sd, h / 30);
        }
      }
      // Die Kanzel links an der Wand, aus ihr der Hals über die Tische
      const kz = K.maske(); kz.poly([[8, 30], [26, 32], [24, 48], [10, 46]]); kz.rect(14, 46, 6, 10);
      K.form(kz, 0, { k: HOLZ, r: RAND, ton: 2, fase: 1, rand: 1 });
      const hx = 104, hy = 30;
      const hals = K.maske(); hals.pfad([[18, 30], [26, 16], [46, 6], [72, 6], [92, 12], [101, 20], [hx, hy - 4]], 2, 1.4);
      const HAUT = ['#1e1a1e', '#3a3436', '#5a504c', '#7a6e64'];
      K.form(hals, 0, { k: HAUT, r: RAND, ton: 1.8, fase: 0, rand: 1, L: [0, -1] });
      const kopf = K.maske(); kopf.ell(hx, hy, 4.6, 5.4); kopf.ell(hx, hy - 3, 4.8, 3);
      K.form(kopf, 0, { k: HAUT, r: RAND, ton: 1.4, fase: 0, rand: 1, L: [0, -1] });
      // Zwei glimmende Gläser
      K.licht(hx, hy + 1, 26, '#3a2810', .9);
      for (const gx of [hx - 2, hx + 2]) { K.set(gx, hy + 1, '#ffd27a'); K.set(gx - 1, hy + 1, '#e6aa4a'); K.set(gx, hy, '#e6aa4a'); K.set(gx, hy + 2, '#a06a20'); }
      K.set(hx, hy + 1, '#3a2810');
      // Ein offenes Buch auf der Kanzel, das er nicht ansieht
      K.rect(11, 29, 6, 2, PERG[4]); K.rect(17, 30, 6, 2, PERG[3]);
      K.vignette(.6, { cx: 80, cy: 40, farbe: STEIN[0] });
    },

    // Ein überfluteter Kreuzgang, Mönche an Pulten bis zum Hals im Wasser, darüber schwarze Schriftzeilen, die aus dem Wasser steigen.
    kloster_flut(K) {
      const { B } = K;
      const wl = 58;
      // Hinten der Garten des Kreuzgangs: fahl, Nebel
      K.himmel(wl, HIMMEL, { basis: .3, steil: .45, gx: 80, gb: 70, wolken: .12 });
      // Arkade: Pfeiler und Rundbögen, dahinter das Helle
      const ark = K.maske(); ark.rect(0, 0, 160, wl);
      for (let i = 0; i < 5; i++) rundbogen(ark, 16 + i * 32, 11, 26, wl, 0);
      K.form(ark, 0, { k: STEIN.slice(1, 6), r: RAND, ton: 2, fase: 1, rand: 1, L: [0, 1], muster: (x, y) => ((y % 6) === 0 || ((x + (Math.floor(y / 6) & 1) * 5) % 10) === 0 ? -.6 : 0) });
      // Das Wasser: grau, die Bögen spiegeln sich
      K.feld(0, wl, 160, 90, WATT, (x, y) => {
        const yy = wl - (y - wl) * 1.2, xi = ((x - 16) % 32 + 32) % 32 - 16;
        const hell = Math.abs(xi) < 11 && (yy > 26 || Math.hypot(xi, yy - 26) < 11);
        return (hell ? .62 : .2) - (y - wl) / 90 + (Math.sin(y * 2.2 + B.rausch2(x * .08, y * .3, K.seed) * 5) > .7 ? .12 : -.02);
      });
      K.rect(0, wl, 160, 1, STEIN[5]);
      // Mönche an Pulten, bis zum Hals im Wasser: Kapuzen, die Pultkanten knapp unter der Oberfläche
      const mo = [[22, 1.1], [58, 1.25], [102, 1.15], [138, 1.05]];
      for (const [x, s] of mo) {
        const yb = wl + 6 * s;
        const p = K.maske(); p.poly([[x + 2 * s, wl + 1 + 1 * s], [x + 16 * s, wl + 1 - 2 * s], [x + 16 * s, wl + 1], [x + 2 * s, wl + 2 + 1 * s]]);
        K.form(p, 0, { k: HOLZ, ton: 1.5, fase: 0, rand: 0 });
        const m = K.maske(); const ky = wl - 4 * s;
        m.ell(x, ky, 4 * s, 4.6 * s); m.poly([[x - 1 * s, ky - 4 * s], [x - 6 * s, ky + 1 * s], [x - 2 * s, ky + 3 * s]]);
        m.ell(x - .5 * s, wl, 6 * s, 2 * s);
        K.form(m, 0, { k: KUTTE, r: RAND, ton: 1, fase: 0, rand: 1, L: [0, -1] });
        for (let yy = Math.round(ky - 2 * s); yy <= ky + 2.5 * s; yy++) for (let xx = Math.round(x); xx <= x + 3 * s; xx++) if (Math.hypot((xx - x - 1.8 * s) / (1.6 * s), (yy - ky) / (2.4 * s)) < 1) K.set(xx, yy, '#020203');
        for (let a = .2; a < 2.9; a += .15) K.set(x + Math.cos(a) * 8 * s, wl + 1 + Math.sin(a) * 1.6 * s, STEIN[6]);
        // Die Tinte steigt auf, Zeile um Zeile, oben lichter und schiefer
        const tr = B.rng(Math.round(x) * 7 + 3);
        for (let z = 0; z < 6; z++) {
          const zy = Math.round(wl - 11 * s - z * 6), x0 = x - 6 + z * 1.5 + tr.j(1), l = 20 - z;
          let xx = x0; while (xx < x0 + l) { const n = tr.i(2, 5); for (let k = 0; k < n; k++) if (B.bay(xx + k, zy) < 1.05 - z * .14) K.set(xx + k, zy + Math.round(Math.sin((xx + k) * .35 + z) * .7 - (xx + k - x0) * z * .03), '#08070a'); xx += n + 1; }
        }
      }
      K.vignette(.5, { cx: 80, farbe: STEIN[1] });
    },

    // Ein aufgeschlagenes Buch auf einem Kettenpult, eine Hand mit Tintenfingern zeigt auf eine Zeile.
    kloster_chronik(K) {
      const { B } = K;
      K.fuell(STEIN.slice(0, 5), (x, y) => .3 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .2 + (40 - x) / 400);
      K.lichtquelle(0, 0);
      // Pult: schräge Platte, Stange für die Kette
      const pl = K.maske(); pl.poly([[6, 78], [16, 20], [134, 16], [148, 74]]);
      K.form(pl, 0, { k: HOLZ, r: RAND, ton: 2, fase: 1, rand: 1, schatten: 2 });
      const st = K.maske(); st.kap(0, 84, 160, 82, 1.6, 1.6);
      K.form(st, 0, { k: ['#0a0a0c', '#18181c', '#28282e', '#3a3a42'], r: ['#8a8a92', '#d0d0d6'], ton: 2, fase: 0, rand: 1 });
      // Das Buch: zwei Seiten, Falz, Licht vom Fenster links
      const sl = K.maske(); sl.poly([[18, 70], [24, 22], [50, 22], [76, 26], [76, 72], [48, 68]]);
      const sr = K.maske(); sr.poly([[78, 72], [78, 26], [104, 21], [128, 21], [138, 68], [106, 68]]);
      K.form(sl, 0, { k: PERG.slice(3, 9), r: [PERG[8]], ton: 3.8, fase: 0, rand: 1, muster: (x, y) => (B.hash(x, y, 8) - .5) * .3 - (x > 70 ? (x - 70) * .3 : 0) });
      K.form(sr, 0, { k: PERG.slice(2, 8), r: [PERG[7]], ton: 3.2, fase: 0, rand: 1, muster: (x, y) => (B.hash(x, y, 8) - .5) * .3 - (x < 84 ? (84 - x) * .3 : 0) });
      for (let i = 0; i < 12; i++) {
        const y = 28 + i * 3.4;
        K.schrift(28 + Math.round(i * .4), Math.round(y), 72, '#4a3424', { min: 1, max: 4 });
        K.schrift(84, Math.round(y - 1), 128 + Math.round(i * .5), i === 8 ? TINTE : '#4a3424', { min: 1, max: 4 });
      }
      // Die Kette: vom Deckel hinunter zur Stange
      for (let i = 0; i < 9; i++) {
        const q = i / 8, x = 20 + q * 16 + Math.sin(q * 3) * 2, y = 70 + q * 12;
        const g = K.maske(); if (i % 2) g.ell(x, y, 1.4, 2.2); else g.ell(x, y, 2.2, 1.4); g.ell(x, y, i % 2 ? .4 : 1, i % 2 ? 1.1 : .4, 0);
        K.form(g, 0, { k: ['#0a0a0c', '#202024', '#3a3a40', '#5a5a62'], r: ['#9a9aa2'], ton: 2.2, fase: 0, rand: 1, L: [-.6, -.8] });
      }
      // Hand von rechts unten: Ärmel der Kutte, Zeigefinger mit Tinte bis zum zweiten Glied
      const arm = K.maske(); arm.poly([[160, 58], [160, 90], [128, 90], [126, 76], [138, 64]]);
      K.form(arm, 0, { k: KUTTE, r: RAND, ton: 1.3, fase: 0, rand: 1 });
      const HAUT = ['#2a221e', '#4e4038', '#76624e', '#9a8468'];
      const hd = K.maske();
      hd.ell(126, 70, 8, 6.5);                                   // Handrücken
      hd.kap(120, 65, 101, 53, 2.2, 1.6);                        // Zeigefinger
      hd.ell(117, 72, 3, 2.6); hd.ell(119, 76, 2.8, 2.4); hd.ell(122, 79, 2.6, 2.2);   // eingerollte Finger
      hd.kap(126, 64, 116, 62, 2, 1.6);                          // Daumen
      K.form(hd, 0, { k: HAUT, r: ['#b8a080', '#e0d0b0'], ton: 2, fase: 1, rand: 2, L: [-.7, -.7], schatten: 2 });
      // Tinte: Fingerkuppe schwarz, Flecken an den Knöcheln
      const tm = K.maske(); tm.kap(108, 57.5, 101, 53, 2, 1.6);
      K.form(tm, 0, { k: ['#050405', '#0e0b0c', '#1a1416', '#2a2224'], r: ['#5a4a44'], ton: 1.5, fase: 0, rand: 1, L: [-.7, -.7] });
      for (const [x, y] of [[115, 71], [116, 71], [118, 75], [117, 63], [118, 63]]) K.set(x, y, TINTE);
      K.vignette(.6, { cx: 74, cy: 46, farbe: STEIN[0] });
    },
  },
};
