// Ereignisbilder 160 × 90 · Der Wald, der nach unten wächst (data/biome/wald.json).
// Palette des Waldes (prototype/js/scenes/world/wald.js): versteinertes Holz und Basalt in Braunschwarz,
// Randlicht in Ocker, Licht nur aus Harz (Bernstein). Anders als der Hafen: warm, erdig, keine Nachtfarbe.
'use strict';

const STEIN = ['#0b0a09', '#13120f', '#1c1a16', '#25231e', '#302d27', '#3c3831', '#4a453c', '#5a544a', '#6d665a', '#837b6d', '#9d9483'];
const HARZ = ['#241306', '#40230a', '#5e3410', '#7e4816', '#a4601c', '#ca7c24', '#ec9c32', '#ffc160', '#ffe3a4'];
const BASALT = ['#08090a', '#0e0f11', '#151618', '#1d1e21', '#26272a', '#303134', '#3c3c3e'];
const RINDE = ['#0a0908', '#12110e', '#1b1915', '#25221c', '#302c25', '#3c372e', '#4a4438'];
const SCHNITT = ['#1a140c', '#2a2014', '#3a2d1c', '#4c3b24', '#604b2e', '#78603a', '#927548', '#ac8a58'];
const RAND = ['#8e6a36', '#e6c48a'], RAND_K = ['#5e4a2e', '#a88c5e'];
const GLUT = '#3a2208', HARZG = '#5a3410';
const FRISCH = ['#2a1c0e', '#4a3218', '#6e4c26', '#946838', '#b88a4c', '#d8ac6c'];

// ---------- eigene Bausteine ----------
// Hintergrund: dunkler versteinerter Wald, hängende Stämme als Silhouetten, Licht von (lx, ly)
function waldgrund(K, lx, ly, r, o) {
  o = o || {}; const { B } = K;
  K.fuell(STEIN.slice(0, 7), (x, y) => ruhig(.04 + Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * 1.2) / r), 1.4) * (o.st || .6), 6, .12));
  // hängende Stämme: von der Decke herab, nach unten spitz zulaufend, ruhige dunkle Silhouetten
  for (const [x, w] of (o.staemme || [])) {
    const m = K.maske(), yb = o.stammUnten || 60;
    m.poly([[x - w * 1.1, -2], [x + w * 1.1, -2], [x + w * .6, yb * .35], [x + w * .45, yb * .8], [x, yb], [x - w * .45, yb * .8], [x - w * .6, yb * .35]]);
    K.form(m, 0, { k: ['#060605', '#0b0a09', '#100f0c'], r: RAND_K, ton: 1, fase: 0, rand: 1, lichtVon: [lx, ly] });
  }
}
// Wurzelstränge an der Decke (Baumregel aus basis.js)
function wurzeln(K, n, y1, o) {
  o = o || {}; const { B } = K, m = K.maske(), r = B.rng(K.seed + 5);
  for (let i = 0; i < n; i++) B.baum(m, r, r.f(-10, 170), r.f(-6, 2), r.f(20, 50), r.f(.2, 1.2) + (r() < .5 ? 0 : 1.6), r.f(1.2, 2.6), 2, { krumm: .4, spreiz: .6, kuerz: .65 });
  K.form(m, o.tiefe || .1, { k: RINDE, r: RAND_K, ton: 1.6, fase: 1, rand: 1, lichtVon: o.lichtVon, maske: undefined });
  return m;
}
// Harzträne: leuchtender Tropfen, Spitze oben am Wurzelstrang. Gibt die Maske zurück.
function harztraene(K, x, y, r, o) {
  o = o || {}; const { B } = K, m = K.maske();
  m.ell(x, y, r, r * 1.08); m.poly([[x - r * .62, y - r * .7], [x, y - r * 2], [x + r * .62, y - r * .7]]);
  K.licht(x, y, o.hof || r * 6, HARZG, o.staerke || 1, { exp: 1.3, ohne: o.ohne });
  K.licht(x, y, r * 2.2, GLUT, 1);
  // Körper: Ränder satt, innen hell, Kern fast weiß
  K.feld(m.x0, m.y0, m.x1 + 1, m.y1 + 1, HARZ.slice(3), (px, py) => m.has(px, py) ? .95 - Math.hypot(px - x + r * .2, (py - y + r * .25) * 1.1) / (r * 1.25) : -1);
  K.set(x - r * .35, y - r * .45, '#fff4d8'); K.set(x - r * .35 + 1, y - r * .45, '#ffe3a4');
  K.lichtquelle(x, y);
  return m;
}
// Römische Zahl als Kerbschrift: Höhe h, Strichdicke 1, gibt die Breite zurück. Zeichen: I V X L C
function roem(K, x, y, txt, h, cols, o) {
  o = o || {}; const { B } = K; let cx = x; const w = Math.max(2, Math.round(h * .6));
  const strich = (x0, y0, x1, y1) => { K.linie(x0, y0, x1, y1, cols[0]); if (cols[1]) K.linie(x0 + 1, y0 + 1, x1 + 1, y1 + 1, cols[1], o.licht === undefined ? .7 : o.licht); };
  for (const c of txt) {
    if (c === 'I') { strich(cx, y, cx, y + h - 1); cx += 2 + (o.weit || 1); }
    else if (c === 'V') { strich(cx, y, cx + w / 2, y + h - 1); strich(cx + w, y, cx + w / 2, y + h - 1); cx += w + 2 + (o.weit || 1); }
    else if (c === 'X') { strich(cx, y, cx + w, y + h - 1); strich(cx + w, y, cx, y + h - 1); cx += w + 2 + (o.weit || 1); }
    else if (c === 'L') { strich(cx, y, cx, y + h - 1); strich(cx, y + h - 1, cx + w * .8, y + h - 1); cx += w + 1 + (o.weit || 1); }
    else if (c === 'C') { strich(cx + w, y, cx, y + 1); strich(cx, y + 1, cx, y + h - 2); strich(cx, y + h - 2, cx + w, y + h - 1); cx += w + 2 + (o.weit || 1); }
    else cx += w;
  }
  return cx - x;
}
// Römische Öllampe aus Ton, flach, Schnauze rechts: Fuß (x, yb); Flamme ist die hellste Stelle
function oellampe(K, x, yb, o) {
  o = o || {}; const m = K.maske();
  m.ell(x, yb - 2, 6, 2.6); m.kap(x + 3, yb - 2.5, x + 8.5, yb - 3, 1.6, 1.3); m.kap(x - 5, yb - 3, x - 8, yb - 5, .8, .8);
  K.licht(x + 9, yb - 6, o.hof || 60, HARZG, o.staerke || 1, { exp: 1.3, ohne: o.ohne });
  K.licht(x + 9, yb - 6, 12, GLUT, 1);
  K.form(m, 0, { k: ['#1a0e08', '#2e1a0e', '#4a2c16', '#6a4220'], r: RAND, ton: 1.6, fase: 1, rand: 1, lichtVon: [x + 9, yb - 8] });
  const fx = x + 9, fy = yb - 4;
  K.set(fx, fy, HARZ[6]); K.set(fx, fy - 1, HARZ[8]); K.set(fx + 1, fy - 1, HARZ[6]); K.set(fx, fy - 2, HARZ[8]); K.set(fx - 1, fy - 2, HARZ[6]); K.set(fx, fy - 3, HARZ[7]); K.set(fx, fy - 4, HARZ[5]);
  K.lichtquelle(fx, fy - 2);
  return [fx, fy - 2];
}
// Basaltpflaster der Römerstraße in Aufsicht (Polygonplatten), Licht lic(x,y)
function strasse(K, y0, y1, lic, o) {
  o = o || {}; const { B } = K, vx = o.vx === undefined ? 80 : o.vx;
  K.feld(o.x0 || 0, y0, o.x1 || 160, y1, BASALT, (x, y) => {
    if (o.maske && !o.maske(x, y)) return -1;
    const d = y - y0 + 3, Z = 60 / d, X = (x - vx) / d * 8;
    const cx = Math.floor(X / 3), cz = Math.floor(Z * 2); let d1 = 9, d2 = 9;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const px = (cx + i + B.hash(cx + i, cz + j, 3)) * 3, pz = (cz + j + B.hash(cx + i, cz + j, 4)) / 2; const dd = Math.hypot(X - px, (Z - pz) * 6); if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd; }
    return .12 + lic(x, y) * .8 + (d2 - d1 < .35 ? -.14 : 0) + (B.hash(cx, cz, 9) - .5) * .08;
  });
}
// Ruhige Rampe: rastet auf Stufen ein, gedithert nur im schmalen Übergang (große Flächen fast flach)
function ruhig(t, n, b) {
  const f = Math.max(0, Math.min(.9999, t)) * n, k = Math.floor(f), fr = f - k, w = b === undefined ? .18 : b;
  return (k + (fr < .5 - w ? 0 : fr > .5 + w ? 1 : (fr - (.5 - w)) / (2 * w))) / n;
}
const lichtF = (lx, ly, r, ov, ex) => (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * (ov || 1)) / r), ex || 1.4);

module.exports = {
  biom: 'wald',
  bilder: {
    // Eine Steinsäule am Straßenrand, eine Öllampe davor, Zahlen untereinander, jede kleiner als die darüber.
    wald_meilenstein(K) {
      const { B } = K;
      const cx = 72, lx = cx + 6, ly = 80;
      waldgrund(K, cx, 18, 95, { st: .42, staemme: [[20, 8], [134, 10]], stammUnten: 50 });
      strasse(K, 64, 90, lichtF(lx, ly, 70, 2), { vx: 120 });
      for (let x = 0; x < 160; x += 9) { const b = K.maske(); b.rect(x, 63, 8, 3); K.form(b, 0, { k: BASALT, r: RAND_K, ton: 2, fase: 0, rand: 1, lichtVon: [lx, ly] }); }
      // Die Säule: Zylinder mit Fuß und gerundetem Kopf, von unten angeleuchtet
      const y0 = 8, y1 = 78, rw = 19;
      const s = K.maske(); s.rect(cx - rw, y0 + 4, 2 * rw, y1 - y0 - 4); s.ell(cx, y0 + 4, rw, 4); s.rect(cx - rw - 2, y1 - 4, 2 * rw + 4, 4);
      const LS = lichtF(lx, ly + 4, 84, .8, 1.1);
      K.feld(cx - rw - 2, y0, cx + rw + 3, y1, STEIN, (x, y) => s.has(x, y) ? .12 + LS(x, y) * .9 - Math.pow(Math.abs(x - cx - 2) / rw, 3) * .25 + (B.fbm(x * .3, y * .2, 3, 2) - .5) * .1 : -1);
      K.form(K.maske(), 0, {});
      // Randlicht links/rechts
      for (let y = y0 + 4; y < y1 - 4; y++) { if (B.bay(cx + rw - 1, y) < LS(cx + rw - 1, y) * 2) K.set(cx + rw - 1, y, RAND[0]); }
      // Zahlen untereinander, jede kleiner; die oberen durchgestrichen, die letzte geritzt
      const KERB = ['#13120f', '#9d9483'];
      const zeilen = [['XXXIV', 9, 18], ['XXI', 7, 32], ['XIII', 5, 43], ['VII', 4, 52]];
      for (const [t, h, y] of zeilen) {
        const w = roem(K, 0, -50, t, h, ['#000000'], {});
        const x = Math.round(cx - w / 2 + 1);
        roem(K, x, y, t, h, KERB, { licht: 1 });
        K.linie(x - 2, y + h / 2 + 1, x + w, y + h / 2 - 1, '#0b0a09'); K.linie(x - 2, y + h / 2 + 2, x + w, y + h / 2, '#6d665a', .7);
      }
      // die letzte: winzig, mit dem Fingernagel geritzt, frischer heller Staub darin
      const fx = cx - 3, fy = 66; K.linie(fx, fy, fx, fy + 2, '#e6dcc0'); K.linie(fx + 2, fy, fx + 2, fy + 2, '#e6dcc0'); K.linie(fx + 4, fy, fx + 5, fy + 2, '#e6dcc0'); K.linie(fx + 6, fy, fx + 5, fy + 2, '#e6dcc0');
      // Öllampe vor der Säule
      oellampe(K, lx - 9, ly + 5, { hof: 80 });
      K.vignette(.7, { cx: 76, cy: 50 });
    },

    // Eine riesige Schnittfläche mit Ringen, eine Reihe römischer Zahlen vom Mark zur Rinde, die letzte Lücke vor der Rinde.
    wald_ringe(K) {
      const { B } = K;
      const tx = 150, ty = 12;   // Harzträne oben rechts
      waldgrund(K, tx, ty, 140, { st: .4 });
      strasse(K, 76, 90, lichtF(tx - 40, 80, 120, 1.5), { vx: 40 });
      // Schnittfläche: fast kreisrund, Rinde dunkel, Ringe als Bänder
      const cx = 70, cy = 44, rx = 52, ry = 46;
      const rinde = K.maske(); rinde.ell(cx, cy, rx + 4, ry + 4);
      K.form(rinde, 0, { k: RINDE, r: RAND, ton: 1.6, fase: 1, rand: 2, schatten: 2, lichtVon: [tx, ty], muster: (x, y) => (Math.sin(Math.atan2(y - cy, x - cx) * 40) > .5 ? -.6 : .2) });
      const flaeche = K.maske(); flaeche.ell(cx, cy, rx, ry);
      const LF = lichtF(tx, ty, 190, 1, 1.3);
      K.feld(cx - rx, cy - ry, cx + rx + 1, cy + ry + 1, SCHNITT, (x, y) => {
        if (!flaeche.has(x, y)) return -1;
        const q = Math.hypot((x - cx) / rx, (y - cy) / ry), w = q * 15 + Math.sin(Math.atan2(y - cy, x - cx) * 3) * .15, f = w % 1;
        return .1 + LF(x, y) * .8 + (f < .2 ? -.22 : 0) + (B.hash(Math.floor(w), 0, 4) - .5) * .12 + (B.hash(x, y >> 1, 2) - .5) * .06;
      });
      // Mark
      K.set(cx, cy, '#0b0a09'); K.set(cx + 1, cy, '#1a140c');
      // Zahlen vom Mark zur Rinde (innen die höchste), gemeißelt; vor der Rinde eine Lücke
      const KERB = ['#120e08', '#c8a870'];
      const zahlen = ['L', 'XL', 'XXX', 'XX', 'X'];
      let x = cx + 3;
      for (const z of zahlen) { const w = roem(K, x, cy - 3, z, 7, KERB, { licht: .9 }); x += w + 3; }
      // die Lücke: eine leere, glatte Stelle zwischen der letzten Zahl und der Rinde, ein Meißelansatz
      K.set(cx + rx - 4, cy - 1, '#c8a870'); K.set(cx + rx - 4, cy, '#120e08');
      // Harzträne oben rechts an einem Wurzelstrang
      const w = K.maske(); w.pfad([[tx + 8, -4], [tx + 2, 2], [tx, ty - 8]], 1.6, 1); K.form(w, 0, { k: RINDE, r: RAND, ton: 1.6, fase: 0, rand: 1 });
      harztraene(K, tx, ty, 4, { hof: 50, ohne: flaeche });
      K.vignette(.6, { cx: 76, cy: 46 });
    },

    // Ein leuchtender Bernsteintropfen an einem Wurzelstrang, darin eine offene Hand, darunter am Boden Knochen in einer Reihe.
    wald_traene(K) {
      const { B } = K;
      const tx = 80, ty = 40, tr = 13;
      waldgrund(K, tx, ty, 110, { st: .55, staemme: [[14, 10, .45], [140, 13, .4], [118, 6, .7], [36, 5, .7]], stammUnten: 56 });
      // Boden: Basalt und Wurzelerde
      strasse(K, 70, 90, lichtF(tx, 74, 80, 2.2), { vx: 80 });
      // Wurzeln an der Decke, ein Strang läuft hinab zur Träne
      wurzeln(K, 10, 20, { lichtVon: [tx, ty] });
      const st = K.maske(); st.pfad([[tx - 22, -4], [tx - 10, 6], [tx - 3, 14], [tx, ty - tr * 1.8]], 3, 1.6);
      K.form(st, 0, { k: RINDE, r: RAND, ton: 1.8, fase: 1, rand: 2, lichtVon: [tx, ty] });
      // Die Träne
      const m = harztraene(K, tx, ty, tr, { hof: 90 });
      // darin eine offene Hand, Handfläche zum Betrachter, Finger leicht gespreizt (dunkler Bernstein)
      const h = K.maske(), hx = tx - 1, hy = ty + 3;
      h.ell(hx, hy, 4.2, 4.6);
      for (const [dx, l, a] of [[-3.2, 5, -.35], [-1.2, 6.5, -.1], [1, 6.8, .08], [3, 5.6, .25]]) h.kap(hx + dx, hy - 3, hx + dx + Math.sin(a) * l, hy - 3 - Math.cos(a) * l, 1, .8);
      h.kap(hx - 4, hy + 1, hx - 8, hy - 2, 1.2, .9);
      h.kap(hx, hy + 4, hx + 1, hy + 9, 2.6, 2.2);
      K.dith(m.x0, m.y0, m.x1 + 1, m.y1 + 1, HARZ[3], (x, y) => h.has(x, y) && m.has(x, y) ? .85 : 0);
      K.dith(m.x0, m.y0, m.x1 + 1, m.y1 + 1, HARZ[2], (x, y) => h.has(x, y) && m.has(x, y) && !h.has(x - 1, y - 1) ? 1 : 0);
      // Knochen eines Arms am Boden, ordentlich in einer Reihe
      const kn = K.maske(), ky = 80;
      const knochen = (x0, x1, d) => { kn.kap(x0, ky, x1, ky, d, d * .8); kn.ell(x0, ky, d * 1.4, d * 1.2); kn.ell(x1, ky, d * 1.3, d * 1.1); };
      knochen(46, 70, 1.4);   // Oberarm
      knochen(76, 94, 1); kn.kap(76, ky - 3, 94, ky - 3, .9, .8); kn.ell(76, ky - 3, 1.2, 1.1); kn.ell(94, ky - 3, 1.2, 1.1);   // Elle und Speiche
      for (let i = 0; i < 5; i++) { kn.kap(100 + i * 3, ky - 1, 100 + i * 3, ky - 4 - (i % 2), .7, .6); }
      for (let i = 0; i < 4; i++) kn.ell(100 + i * 3.5, ky + 2, .9, .8);
      K.form(kn, 0, { k: ['#3a2e1e', '#6a5a40', '#9a8a68', '#c8b890', '#e8dcc0'], r: ['#ffe3a4', '#fff4d8'], ton: 2.4, fase: 0, rand: 1, schatten: 1, lichtVon: [tx, ty] });
      K.vignette(.7, { cx: 80, cy: 48 });
    },

    // Ein runder Erdhügel mit Luftlöchern, kein Rauch, daneben ein Schleifstein auf einem Holzgestell, eine Pfütze darunter.
    wald_meiler(K) {
      const { B } = K;
      const tx = 140, ty = 16;
      waldgrund(K, tx, ty + 20, 120, { st: .45, staemme: [[96, 7], [12, 9]], stammUnten: 42 });
      const LB = lichtF(tx - 14, 74, 90, 2);
      K.feld(0, 60, 160, 90, ['#0e0c08', '#17140e', '#221d15', '#2e271c', '#3c3324', '#4a3f2c'], (x, y) => ruhig(.06 + LB(x, y) * .9, 5));
      // Der Meiler: Kuppel aus Erde, Luftlöcher in Reihen, kein Rauch
      const mx = 54, my = 78, mr = 44, mh = 34;
      const mei = K.maske(); mei.fn(mx - mr, my - mh, mx + mr, my + 2, (x, y) => ((x - mx) / mr) ** 2 + ((y - my) / mh) ** 2 <= 1 && y <= my + 1);
      const ERDE = ['#0c0a07', '#16120c', '#211b12', '#2e2619', '#3c3221', '#4c402c'];
      K.form(mei, 0, { k: ERDE, r: RAND, ton: 2, fase: 1, rand: 2, schatten: 2, verlaufX: 1.4, lichtVon: [tx, ty], muster: (x, y) => (B.fbm(x * .15, y * .15, 6, 2) - .5) * .9 + ((y + Math.round(Math.sin(x * .2) * 1.5)) % 7 === 0 ? -.4 : 0) });
      for (let row = 0; row < 3; row++) {
        const yy = my - 8 - row * 9, half = Math.sqrt(Math.max(0, 1 - ((yy - my) / mh) ** 2)) * mr;
        for (let i = 0; i < 6 - row; i++) {
          const x = mx - half * .8 + (i + .5) * half * 1.6 / (6 - row);
          const l = K.maske(); l.ell(x, yy, 1.6, 1.2); K.form(l, 0, { k: ['#000000', '#030202'], ton: .5, fase: 0, rand: 0 });
          K.set(x, yy + 2, ERDE[5]); K.set(x + 1, yy + 2, ERDE[4]);
        }
      }
      // Schleifstein: dicke Steinscheibe, schräg gesehen, auf einer Achse zwischen zwei Holzböcken
      const sx = 120, sy = 58, srx = 10, sry = 17;
      const hinten = K.maske(); hinten.ell(sx + 4, sy, srx, sry); hinten.rect(sx, sy - sry, 4, 2 * sry);
      K.form(hinten, 0, { k: STEIN.slice(0, 6), r: RAND_K, ton: 1.6, fase: 0, rand: 1, lichtVon: [tx, ty], muster: (x, y) => ((y - sy) % 3 === 0 ? -.5 : 0) });
      const rad = K.maske(); rad.ell(sx, sy, srx, sry);
      K.form(rad, 0, { k: STEIN.slice(0, 9), r: RAND, ton: 3.2, fase: 1, rand: 2, schatten: 2, lichtVon: [tx, ty], verlauf: .8, muster: (x, y) => (Math.hypot((x - sx) / srx, (y - sy) / sry) % .3 < .06 ? -.6 : 0) - (y > sy + 6 ? 1.2 : 0) });
      const bock = K.maske();
      for (const bx of [sx - 16, sx + 18]) { bock.kap(bx - 6, 86, bx, sy, 1.6, 1.3); bock.kap(bx + 6, 86, bx, sy, 1.6, 1.3); bock.kap(bx - 4, 78, bx + 4, 78, 1, 1); }
      bock.kap(sx - 18, sy, sx + 20, sy, 1.2, 1.2);   // Achse
      bock.kap(sx + 20, sy, sx + 26, sy - 6, .9, .9); bock.kap(sx + 26, sy - 6, sx + 26, sy - 10, .9, .9);   // Kurbel
      K.form(bock, 0, { k: RINDE, r: RAND, ton: 3.2, fase: 0, rand: 2, schatten: 1, lichtVon: [tx, ty] });
      const nabe = K.maske(); nabe.ell(sx, sy, 2.4, 2.4); K.form(nabe, 0, { k: ['#1a1208', '#3a2a14', '#6e5228'], r: RAND, ton: 1.6, fase: 0, rand: 1, lichtVon: [tx, ty] });
      // nass: Tropfen fallen von der unteren Kante
      K.set(sx, sy + sry + 3, '#e6c48a'); K.set(sx, sy + sry + 7, '#a88c5e');
      // die Pfütze, in ihr die Träne gespiegelt
      const pf = K.maske(); pf.ell(sx + 2, 82, 26, 4.5);
      K.form(pf, 0, { k: ['#050403', '#0c0a07', '#16120c', '#211b12'], r: ['#8e6a36', '#e6c48a'], ton: 1.6, fase: 0, rand: 1, L: [0, -1] });
      for (const [dx, dy, c] of [[0, 0, 8], [1, 0, 7], [0, 1, 7], [-1, 1, 6], [1, 2, 6], [0, 3, 5], [-1, 4, 4], [1, 4, 4], [0, 5, 3]]) if (pf.has(tx + dx, 79 + dy)) K.set(tx + dx, 79 + dy, HARZ[c]);
      K.licht(tx, 81, 12, GLUT, .8, { maske: (x, y) => pf.has(x, y) });
      for (let x = sx - 22; x < sx + 26; x += 5) K.set(x, 85 + (x % 2), '#5e4a2e');
      // Harzträne oben rechts
      const w = K.maske(); w.pfad([[tx - 10, -4], [tx - 3, 4], [tx, ty - 6]], 1.8, 1); K.form(w, 0, { k: RINDE, r: RAND, ton: 1.6, fase: 0, rand: 1 });
      harztraene(K, tx, ty, 3.8, { hof: 64 });
      K.vignette(.65, { cx: 80, cy: 56 });
    },

    // Eine schmale Hängebrücke aus frischen Brettern über einem Abgrund, darunter Baumkronen, die nach unten hängen, in Lagen übereinander.
    wald_bruecke(K) {
      const { B } = K;
      // Tiefe: nach unten heller (dort schimmert es), Lagen hängender Kronen
      K.fuell(STEIN.slice(0, 6), (x, y) => .05 + Math.pow(Math.max(0, (y - 20) / 70), 2) * .45 + (B.fbm(x * .03, y * .06, K.seed, 2) - .5) * .1);
      K.licht(80, 96, 80, HARZG, .9, { oval: 2, exp: 1.2 });
      K.licht(80, 94, 30, GLUT, 1, { oval: 2.4 });
      const lagen = [[84, .82, 7, 4], [70, .65, 10, 6], [54, .45, 14, 8], [36, .2, 19, 11]];
      for (const [yb, t, rx, ry] of lagen) {
        const m = K.maske(), r = B.rng(yb * 7);
        for (let x = -10; x < 175; x += rx * 1.9 + r.f(0, rx)) {
          const xx = x + r.j(3), top = yb - ry * 1.6;
          m.kap(xx, top - 40, xx, top, rx * .2, rx * .14);
          m.ell(xx, yb - ry * .2, rx, ry);
          m.ell(xx - rx * .5, yb + ry * .3, rx * .6, ry * .7); m.ell(xx + rx * .55, yb + ry * .25, rx * .55, ry * .65);
          m.ell(xx, yb + ry * .6, rx * .5, ry * .6);
        }
        K.form(m, t, { k: STEIN.slice(0, 8), r: RAND_K, ton: 1.5, fase: 1, rand: 1, L: [0, 1], muster: (x, y) => (B.hash(x >> 1, y >> 1, yb) - .5) * .6, nebelFarbe: '#3a2a16' });
      }
      // Die Brücke in Flucht: vorn breit, hinten schmal, hängt in der Mitte durch; frische Bretter, zwei Handseile
      const vx = 92, vy = 26;
      const P = t => ({ x: B.lerp(80, vx, t), y: B.lerp(92, vy, t) + Math.sin(t * Math.PI) * 6 * (1 - t), w: B.lerp(34, 3, Math.pow(t, .8)) });
      const br = K.maske(), seil = K.maske();
      for (let i = 0; i < 40; i++) {
        const t = 1 - Math.pow(1 - i / 40, 1.6), p = P(t), dick = Math.max(1, 4 * (1 - t)), gap = Math.max(1, 5 * (1 - t));
        br.poly([[p.x - p.w, p.y], [p.x + p.w, p.y], [p.x + p.w, p.y + dick], [p.x - p.w, p.y + dick]]);
        if (dick > 1.6) { const q = P(t + .004); br.poly([[q.x - q.w, p.y + dick], [q.x + q.w, p.y + dick], [q.x + q.w, p.y + dick + gap * .5], [q.x - q.w, p.y + dick + gap * .5]], 0); }
      }
      K.form(br, 0, { k: FRISCH, r: ['#d8ac6c', '#ffe3a4'], ton: 3.6, fase: 0, rand: 1, L: [0, 1], muster: (x, y) => (B.hash(x >> 2, y, 3) - .5) * .8 - Math.max(0, (60 - y) / 40) * 1.6 });
      for (const sgn of [-1, 1]) {
        const pts = []; for (let t = 0; t <= 1.001; t += .05) { const p = P(t); pts.push([p.x + sgn * p.w * 1.05, p.y - B.lerp(26, 3, t) + Math.sin(t * Math.PI) * 4]); }
        seil.pfad(pts, 1.1, .4);
        for (let t = .04; t < 1; t += .1) { const p = P(t); seil.kap(p.x + sgn * p.w, p.y, p.x + sgn * p.w * 1.05, p.y - B.lerp(26, 3, t) + Math.sin(t * Math.PI) * 4, .5, .4); }
      }
      K.form(seil, 0, { k: ['#1e140a', '#3a2814', '#5a3e1e'], r: ['#946838', '#d8ac6c'], ton: 1.4, fase: 0, rand: 1, L: [0, 1] });
      // Wurzeln oben, dunkel
      K.feld(0, 0, 160, 8, RINDE, (x, yy) => .1 + (B.fbm(x * .08, yy * .3, 2, 2) - .5) * .5);
      K.vignette(.5, { cx: 82, cy: 56 });
    },

    // Ein Soldat mit Helm im Halbdunkel eines Tunnels aus Holz, ein beschriebenes Brett in der ausgestreckten Hand, hinter ihm die Straße.
    wald_brief(K) {
      const { B } = K;
      const ox = 94, oy = 42;   // Öffnung des Tunnels hinten, dort Harzlicht
      // Tunnel im Stamm: ruhige Ringe im Holz um die Öffnung
      const HOLZW = ['#060503', '#0c0a06', '#14100a', '#1e180e', '#2a2014', '#3a2d1c'];
      K.feld(0, 0, 160, 90, HOLZW, (x, y) => { const d = Math.hypot((x - ox) / 1.25, y - oy), f = (d * .3) % 1; return ruhig(.04 + Math.pow(Math.max(0, 1 - d / 90), 1.5) * .8, 5) + (f < .12 ? -.2 : 0); });
      // Öffnung: Bogen, dahinter die Straße im Harzlicht (die helle Stelle)
      const off = K.maske(); off.ell(ox, oy, 20, 22); off.rect(ox - 20, oy, 40, 22);
      K.feld(ox - 21, oy - 23, ox + 21, oy + 23, ['#3a2810', '#6a4818', '#a06820', '#d8902c', '#ffc160', '#ffe3a4'], (x, y) => off.has(x, y) ? ruhig(.25 + Math.max(0, 1 - Math.hypot(x - ox - 4, y - oy + 4) / 24) * .8, 5, .25) : -1);
      // die Straße dahinter: Fluchtlinien
      for (let y = oy + 10; y < oy + 22; y++) for (let x = ox - 20; x < ox + 20; x++) if (off.has(x, y) && Math.abs((x - ox) / (y - oy - 8)) % 2.2 < .3) K.set(x, y, '#6a4818');
      K.licht(ox, oy, 90, HARZG, .8, { exp: 1.5, ohne: off });
      // Boden im Tunnel
      K.feld(0, 64, 160, 90, BASALT, (x, y) => off.has(x, y) ? -1 : ruhig(.08 + lichtF(ox, 60, 80, 1.6)(x, y) * .6, BASALT.length - 1));
      K.lichtquelle(ox, oy);
      // Der Legionär sitzt vor der Öffnung, Helm und Schultern gegen das Licht; er streckt das Brett zum Betrachter
      const fx = 80, fy = 88;
      const fig = K.figurMaske(fx, fy, 56, { kopf: 'kahl', haltung: 'sitzen', blick: 1, kopfDreh: 1, arme: [[fx + 31, fy - 17], [fx + 12, fy - 14]], ellbogen: [[fx + 20, fy - 24], [fx + 15, fy - 20]] });
      const kx = fig.kopf[0], ky = fig.kopf[1], s = 1.4;
      // Helm: Kalotte, Nackenschirm, Wangenklappe, Querkamm
      fig.ell(kx, ky - 1.6 * s, 4.2 * s, 3.9 * s); fig.poly([[kx - 4 * s, ky - .5 * s], [kx - 7.5 * s, ky + 2.6 * s], [kx - 2.5 * s, ky + 2.4 * s]]); fig.rect(kx + 1.4 * s, ky, 2.4 * s, 4.4 * s);
      fig.kap(kx - 3 * s, ky - 6 * s, kx + 2.5 * s, ky - 6.4 * s, 1.2 * s, 1 * s);
      K.form(fig, 0, { ton: .9, rand: 0, k: ['#030302', '#080706', '#0e0c0a'], r: [] });
      K.kante(fig, ox, oy, 80, RAND, { nah: .45 });
      // das Brett in der Hand, mit Kohle beschrieben, unter der Öffnung im Licht
      const bx = fx + 28, by = fy - 24;
      const brett = K.maske(); brett.poly([[bx, by], [bx + 20, by - 2], [bx + 21, by + 12], [bx + 1, by + 14]]);
      K.form(brett, 0, { k: FRISCH, r: ['#d8ac6c', '#ffe3a4'], ton: 3.4, fase: 0, rand: 1, lichtVon: [ox, oy - 10], schatten: 1 });
      for (let i = 0; i < 5; i++) K.schrift(bx + 2, by + 2 + i * 2, bx + 18, '#1a1208', { min: 1, max: 3 });
      K.vignette(.5, { cx: 88, cy: 48 });
    },
  },
};
