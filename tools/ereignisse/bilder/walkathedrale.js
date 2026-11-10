// Ereignisbilder 160 × 90 · Die Walkathedrale (data/biome/walkathedrale.json).
// Palette der Walkathedrale (prototype/js/scenes/world/walkathedrale.js): Knochen in warmem Grau mit
// elfenbeinfarbenem Randlicht, dahinter schwarzblaues Eis; warmes Licht aus Tranlampen, rotes Glimmen aus
// dem Mark und vom Herzen ganz hinten.
'use strict';

const KNOCHEN = ['#06070b', '#0f1016', '#1a1b21', '#28282c', '#3a3835', '#534e45', '#71695a', '#968a72'];
const KN = KNOCHEN.slice(1, 7);
const KN_RAND = ['#958a74', '#f2e8ce'];
const EIS = ['#020308', '#04070f', '#070c18', '#0b1322', '#111c30', '#19283f', '#24364f', '#33496a'];
const EISBODEN = ['#030409', '#060a12', '#0a101c', '#101828', '#172235', '#202e44'];
const HOLZ = ['#070504', '#110b07', '#1c130c', '#2a1c11', '#3a2717', '#4e3620'];
const MARK = '#ff8c70', MARK_K = '#fff0e4', MARK_G = '#2c1014', MARK_G2 = '#4a1a20', MARK_D = '#a8362f';
const TRAN = '#e8a447', TRAN_K = '#fff2c8', TRAN_G = '#2e1e08';
const KALT = '#b8d0ec', KALT_G = '#141e30';
const TRANKANTE = ['#8a5a20', '#ffd27a'];
const DUNKEL = ['#030306', '#07080c', '#0d0e13', '#15161c'];

// ---------- eigene Bausteine ----------
// Knochenmaterial: Poren, Fase und elfenbeinfarbenes Randlicht
function knochen(K, ton, x) {
  const { B } = K;
  return Object.assign({ k: KN, r: KN_RAND, ton, fase: 1.2, rand: 2, muster: (px, py, d) => (B.hash(px >> 1, py >> 1, 17) < .07 ? -1 : 0) + (B.hash(px, py, 5) < .04 ? .7 : 0) + (d > 3 ? -.25 : 0) }, x || {});
}
// Eiswand als Grund: Schichten, ein heller Fleck, wo der Riss Licht hereinlässt
function eisWand(K, rx, ry, st) {
  const { B } = K;
  K.fuell(EIS, (x, y) => {
    const schicht = Math.sin((y + B.fbm(x * .03, y * .05, 3, 2) * 14) * .3) * .05, licht = Math.max(0, 1 - Math.hypot((x - rx) / 90, (y - ry) / 70));
    return .08 + licht * (st === undefined ? .45 : st) + schicht + B.fbm(x * .04, y * .08, K.seed, 2) * .12;
  });
}
// Riss oben, durch den kaltes Licht fällt
function riss(K, x, y, len, ang) {
  const { B } = K, r = B.rng(x * 7 + y); let px = x, py = y;
  K.licht(x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2, len * 1.6, KALT_G, .9);
  for (let k = 0; k < len; k++) { K.set(px, py, k % 5 ? KALT : '#ffffff'); K.set(px + 1, py, EIS[7]); px += Math.cos(ang) + r.j(.9); py += Math.sin(ang) + r.j(.4); }
}
// Eisboden: dunkle Fläche mit Glanzstreifen, nach hinten heller
function eisBoden(K, y0, o) {
  o = o || {}; const { B } = K;
  K.feld(0, y0, 160, 90, EISBODEN, (x, y) => {
    const q = (y - y0) / (90 - y0);
    return .15 + Math.pow(1 - q, 3) * .45 + (B.rausch2(x * .05, y * .4, K.seed) > .72 ? .2 : 0) + (o.tf ? o.tf(x, y) : 0);
  });
}
// Rippenbogen (Halbellipse) mit nach innen gehakten Enden; Dicke d unten, oben d*verj
function bogenMaske(K, cx, yb, b, h, d, o) {
  o = o || {}; const m = K.maske(), pts = [], n = 22;
  for (let i = 0; i <= n; i++) { const t = i / n * Math.PI; pts.push([cx - b * Math.cos(t), yb - h * Math.sin(t)]); }
  for (let i = 0; i < n; i++) { const q = Math.abs(i / n - .5) * 2, r0 = d * (o.verj || .6) + d * (1 - (o.verj || .6)) * q; m.kap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r0, r0); }
  if (o.haken !== false) { m.kap(cx - b, yb, cx - b + d * 2.2, yb + d * .3, d * .9, d * .5); m.kap(cx + b, yb, cx + b - d * 2.2, yb + d * .3, d * .9, d * .5); }
  return m;
}
// Kirchenschiff: Bögen in Flucht zum Punkt (vx, vy); Boden bei boden (vorderster Bogen)
function schiff(K, vx, vy, o) {
  o = o || {}; const n = o.n || 7, boden = o.boden || 88;
  const ms = [];
  for (let i = n - 1; i >= 0; i--) {
    const s = Math.pow(o.f || .72, i), yb = vy + (boden - vy) * s;
    const m = bogenMaske(K, vx, yb, (o.b || 70) * s, (o.h || 84) * s, Math.max(.7, (o.d || 4) * s));
    if (o.ohne && o.ohne(i)) continue;
    K.form(m, Math.min(.9, i / n * 1.25 + (o.tiefe || 0)), knochen(K, o.ton || 1.6, { rand: i > 3 ? 1 : 2, nebelFarbe: o.nebel || EIS[3] }));
    ms.push(m);
  }
  return ms;
}
// Fernes Herz: dunkle Öffnung mit rotem Glimmen
function herz(K, x, y, r, st) {
  K.licht(x, y, r * 4, MARK_G, st);
  K.licht(x, y, r * 2, MARK_G2, st);
  K.licht(x, y, r, MARK_D, st * .8);
  K.set(x, y, MARK); K.set(x, y + 1, MARK_D);
}
// Tranlampe (offene Schale, Docht, Flamme), hängend oder stehend; y = Fuß der Flamme
function tranflamme(K, x, y, o) {
  o = o || {};
  if (o.hof !== 0) K.licht(x, y - 2, o.hof || 40, TRAN_G, o.staerke || 1, { ohne: o.ohne });
  K.licht(x, y - 2, 9, '#4a2a08', 1, { ohne: o.ohne });
  K.set(x, y - 1, TRAN_K); K.set(x, y - 2, TRAN); K.set(x, y - 3, TRAN); K.set(x - 1, y - 1, '#c07a20'); K.set(x + 1, y - 1, '#c07a20');
  K.lichtquelle(x, y - 2);
}
// Sitzender Mann in Ölzeug von vorn (Südwester, Hände auf den Knien); Fuß bei (x, yb), Höhe h
function sitzerMaske(K, x, yb, h, o) {
  o = o || {}; const m = K.maske(), k = h / 26;
  m.ell(x, yb - 20.5 * k, 2.5 * k, 2.9 * k);
  m.kap(x - 4.6 * k, yb - 22 * k, x + 4.6 * k, yb - 22 * k, .9 * k, .9 * k); m.ell(x, yb - 23 * k, 2.8 * k, 1.8 * k);
  m.poly([[x - 5 * k, yb - 17 * k], [x + 5 * k, yb - 17 * k], [x + 6.2 * k, yb - 7 * k], [x - 6.2 * k, yb - 7 * k]]);
  m.ell(x, yb - 16.5 * k, 5.2 * k, 1.8 * k);
  m.ell(x - 3.4 * k, yb - 7 * k, 3.2 * k, 2.3 * k); m.ell(x + 3.4 * k, yb - 7 * k, 3.2 * k, 2.3 * k);
  m.rect(x - 5.6 * k, yb - 6 * k, 4 * k, 6 * k); m.rect(x + 1.6 * k, yb - 6 * k, 4 * k, 6 * k);
  m.kap(x - 5.2 * k, yb - 15 * k, x - 4 * k, yb - 8.5 * k, 1.3 * k, 1.1 * k); m.kap(x + 5.2 * k, yb - 15 * k, x + 4 * k, yb - 8.5 * k, 1.3 * k, 1.1 * k);
  return m;
}
// Sitzender Mann von hinten (Rücken zum Betrachter)
function ruckenMaske(K, x, yb, h) {
  const m = K.maske(), k = h / 26;
  m.ell(x, yb - 20 * k, 2.6 * k, 2.9 * k);
  m.kap(x - 4.4 * k, yb - 21.5 * k, x + 4.4 * k, yb - 21.5 * k, .9 * k, .9 * k); m.ell(x, yb - 22.5 * k, 2.8 * k, 1.8 * k);
  m.poly([[x - 5 * k, yb - 17 * k], [x + 5 * k, yb - 17 * k], [x + 6.6 * k, yb - 1 * k], [x - 6.6 * k, yb - 1 * k]]);
  m.ell(x, yb - 16.5 * k, 5.2 * k, 1.8 * k); m.ell(x, yb - 1.5 * k, 6.6 * k, 1.6 * k);
  return m;
}
// Aufgeschlagenes Buch, schräg von oben: Mitte (x, y), Breite w
function buch(K, x, y, w, o) {
  o = o || {}; const { B } = K, h = w * .42, m = K.maske();
  m.poly([[x - w / 2, y - h / 2 + 1], [x, y - h / 2 + 2], [x + w / 2, y - h / 2], [x + w / 2 + 1, y + h / 2], [x, y + h / 2 + 1], [x - w / 2 - 1, y + h / 2 + 1]]);
  const PAP = o.papier || ['#2a2418', '#4e4632', '#807458', '#b8aa86', '#e2d6b4'];
  K.form(m, 0, { k: PAP, r: o.rand || [PAP[3], PAP[4]], ton: o.ton || 3.2, fase: 0, rand: 1, L: o.L || [0, -1], muster: (px, py) => (Math.abs(px - x) < .8 ? -1.6 : 0) + (o.leer && px > x ? .3 : 0) });
  const zeilen = Math.floor(h / 2) - 1;
  for (let i = 0; i < zeilen; i++) {
    K.schrift(Math.round(x - w / 2 + 2), Math.round(y - h / 2 + 3 + i * 2), Math.round(x - 2), o.tinte || '#3a2a1a', { min: 1, max: 3 });
    if (!o.leer) K.schrift(Math.round(x + 2), Math.round(y - h / 2 + 3 + i * 2), Math.round(x + w / 2 - 1), o.tinte || '#3a2a1a', { min: 1, max: 3 });
  }
  return m;
}

module.exports = {
  biom: 'walkathedrale',
  bilder: {
    // Ein riesiger, ausgehöhlter Wirbel mit einer Treppe aus Knochenplatten; auf der Brüstung ein aufgeschlagenes Buch unter einer Tranlampe.
    walkathedrale_kanzel(K) {
      const { B } = K;
      eisWand(K, 140, 6, .35);
      riss(K, 150, 2, 12, 2.2);
      eisBoden(K, 70);
      schiff(K, 48, 40, { n: 5, b: 60, h: 70, d: 3, f: .62, tiefe: .35, ton: 1.2 });
      K.lichtquelle(116, 18);
      // Dornfortsatz hinten, breit und hoch wie ein Schalldeckel, mit einem Haken für die Lampe
      const cx = 104;
      const dorn = K.maske(); dorn.poly([[cx - 10, 40], [cx + 8, 40], [cx + 22, 6], [cx + 18, 0], [cx + 6, 2]]);
      dorn.kap(cx + 16, 8, cx + 4, 12, 1, .8);
      K.form(dorn, .3, knochen(K, 1.2));
      // Wirbelkörper als Sockel: Spule mit eingezogener Mitte, Wachstumsringe
      const sockel = K.maske(); sockel.fn(cx - 24, 46, cx + 24, 86, (x, y) => Math.abs(x - cx) < 21 - Math.sin(Math.PI * (y - 46) / 40) * 5); sockel.ell(cx, 85, 21, 3.5);
      const rillen = (px, py) => (Math.abs(py - 58) < .7 || Math.abs(py - 72) < .7 ? -1 : 0) + (B.hash(px >> 1, py >> 1, 17) < .1 ? -.9 : 0) + (Math.sin(px * 1.3 + Math.sin(py * .3) * 2) > .85 ? -.5 : 0);
      K.form(sockel, 0, knochen(K, .9, { verlauf: .9, muster: (px, py) => rillen(px, py) - Math.abs(px - cx) / 20 * .8 }));
      // Querfortsätze als Flügel
      const fl = K.maske();
      fl.poly([[cx - 20, 44], [cx - 40, 42], [cx - 47, 45], [cx - 46, 49], [cx - 24, 54]]); fl.poly([[cx + 20, 44], [cx + 40, 42], [cx + 47, 45], [cx + 46, 49], [cx + 24, 54]]);
      K.form(fl, .1, knochen(K, 1, { muster: rillen }));
      // ausgehöhlte Schale mit Brüstung
      const schale = K.maske(); schale.fn(cx - 27, 37, cx + 27, 52, (x, y) => Math.hypot((x - cx) / 27, (y - 38) / 13) < 1 && y >= 38); schale.ell(cx, 38, 27, 5);
      K.form(schale, 0, knochen(K, 1.2, { verlauf: 1.2, muster: rillen }));
      const innen = K.maske(); innen.ell(cx, 38, 24, 3.6);
      K.form(innen, 0, { k: DUNKEL, ton: .5, fase: 0, rand: 0 });
      // Treppe aus Knochenplatten, die sich links am Sockel hinaufwindet
      for (let i = 0; i < 6; i++) {
        const q = i / 5, y = 84 - q * 40, x0 = cx - 20 + Math.sin(Math.PI * (y - 46) / 40) * 5 + 2, l = 16 - q * 3, p = K.maske();
        p.poly([[x0, y - 1.5], [x0 - l, y - 3 + q * 2], [x0 - l - 2, y + 1], [x0 - l + 1, y + 4], [x0, y + 4]]);
        K.form(p, 0, knochen(K, 1.3, { L: [-.1, -1], rimF: .7, rand: 1, schatten: 1, verlauf: 1 }));
      }
      // Lampe am Haken, darunter auf der Brüstung das Buch
      K.linie(cx + 4, 12, cx + 4, 20, '#2a1c11');
      const sch = K.maske(); sch.ell(cx + 4, 22, 3.4, 1.6); sch.rect(cx + 1, 20, 7, 2);
      K.form(sch, 0, { k: HOLZ, ton: 2, fase: 0, rand: 1 });
      const ganz = K.maske(); for (const m of [sockel, fl, schale]) for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) if (m.has(x, y)) ganz.fn(x, y, x, y, () => true);
      K.kante(ganz, cx + 4, 20, 46, TRANKANTE, { nah: .35 });
      K.licht(cx + 4, 24, 56, TRAN_G, 1, { ohne: innen });
      K.licht(cx + 4, 26, 30, '#3a2408', 1, { ohne: innen });
      tranflamme(K, cx + 4, 20, { hof: 0 });
      buch(K, cx + 2, 34, 22, { ton: 3.4 });
      K.licht(cx + 3, 31, 12, '#3a2a10', .9);
      K.vignette(.75, { cx: 100, cy: 40 });
    },

    // Eine junge, glatte Rippe ragt aus dem Eis und biegt sich zur Mitte des Ganges; dahinter die großen, alten Bögen.
    walkathedrale_rippe(K) {
      const { B } = K;
      eisWand(K, 128, 8, .4);
      riss(K, 136, 2, 14, 2.1);
      eisBoden(K, 52);
      // Bohlenweg der Expedition in der Mitte
      K.feld(0, 52, 160, 90, HOLZ, (x, y) => { const q = (y - 52) / 38, w = 4 + q * 26; if (Math.abs(x - 84) > w) return -1; return .3 + ((y * (1 + q) | 0) % 4 === 0 ? -.25 : 0) + (B.hash(x >> 2, y, 3) - .5) * .15; });
      schiff(K, 84, 46, { n: 7, b: 74, h: 88, d: 4.4, f: .7, ton: 1.5 });
      K.lichtquelle(136, 6);
      // Die junge Rippe: aus dem Eis links, glatt und hell, krümmt sich zur Mitte; die Spitze weich und warm
      const jx = 30, jy = 86;
      const pts = [[jx, jy], [jx + 2, 74], [jx + 6, 62], [jx + 13, 53], [jx + 22, 48], [jx + 31, 47], [jx + 37, 49]];
      const j = K.maske(); j.pfad(pts, 3.2, 1.1);
      K.form(j, 0, { k: ['#1a1418', '#3a2e2c', '#6a5a50', '#9a8a76', '#c8b8a0'], r: ['#d8c8b0', '#fff0e4'], ton: 2.2, verlauf: -.4, fase: 1.4, rand: 2 });
      // die Spitze: warm, rosa, aus dem Mark
      K.licht(jx + 37, 49, 14, MARK_G2, 1);
      K.licht(jx + 37, 49, 6, '#6a2a24', 1);
      K.set(jx + 37, 49, MARK_K); K.set(jx + 36, 49, MARK); K.set(jx + 38, 50, MARK_D);
      // Eis um den Fuß aufgebrochen
      const sch = K.maske(); sch.poly([[jx - 10, jy + 2], [jx - 6, jy - 3], [jx - 1, jy - 1], [jx + 2, jy - 5], [jx + 7, jy - 1], [jx + 13, jy + 2]]);
      K.form(sch, 0, { k: EISBODEN.slice(1, 6), r: [EIS[7], KALT], ton: 2.4, fase: 1, rand: 1, L: [.6, -.8] });
      K.vignette(.7, { cx: 80, cy: 46 });
    },

    // Eine Pyramide aus Tranfässern zwischen zwei Rippen, ein Fass offen, daneben eine Kelle und eine erloschene Lampe.
    walkathedrale_tran(K) {
      const { B } = K;
      eisWand(K, 120, 0, .3);
      eisBoden(K, 70);
      riss(K, 120, 0, 10, 1.9);
      // Kalter Schacht von oben auf die Fässer
      for (let y = 0; y < 90; y++) for (let x = 0; x < 160; x++) {
        const cx = 120 - y * .45, w = 10 + y * .25, d = Math.abs(x - cx) / w; if (d > 1) continue;
        const v = (1 - d * d) * .55; if (v > B.bay(x, y) + .2) K.e.add(x, y, [14, 20, 30], 1);
      }
      K.lichtquelle(116, 0);
      // Zwei große Rippen rahmen das Lager
      const r1 = K.maske(); r1.pfad([[2, 92], [6, 60], [14, 30], [28, 8], [44, -4]], 6, 3.5);
      const r2 = K.maske(); r2.pfad([[154, 92], [152, 60], [146, 32], [134, 10], [120, -4]], 6, 3.5);
      K.form(r1, 0, knochen(K, 1.5)); K.form(r2, 0, knochen(K, 1.5));
      // Fässer von vorn: Boden mit Dauben, Reifen und Brandzeichen (ein Schiff)
      const fass = (x, y, r) => {
        const m = K.maske(); m.ell(x, y, r, r);
        K.form(m, 0, { k: HOLZ, r: ['#7a5a38', '#d8b080'], ton: 2.4, fase: 1, rand: 2, schatten: 1, muster: (px, py) => {
          const d = Math.hypot(px - x, py - y) / r; return (d > .78 && d < .9 ? -1.2 : 0) + ((px - x + 20) % 3 < .9 ? -.5 : 0);
        } });
        // Brandzeichen: kleiner Rumpf mit Mast
        K.rect(x - 2, y + 1, 5, 1, '#0a0604'); K.set(x - 1, y + 2, '#0a0604'); K.set(x + 1, y + 2, '#0a0604'); K.set(x, y + 2, '#0a0604'); K.rect(x, y - 3, 1, 4, '#0a0604'); K.set(x + 1, y - 2, '#0a0604');
      };
      const r = 7.5, by = 81;
      for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++) fass(60 - (3 - row) * r + i * r * 2, by - row * r * 1.72, r);
      // Das offene Fass rechts, aufrecht: Tran darin glänzt warm
      const of = K.maske(); of.rect(102, 66, 22, 18); of.ell(113, 84, 11, 2.4);
      K.form(of, 0, { k: HOLZ, r: ['#7a5a38', '#d8b080'], ton: 2.2, schatten: 1, muster: (px, py) => (Math.abs(py - 70) < .7 || Math.abs(py - 79) < .7 ? -1.2 : 0) + (px % 3 === 0 ? -.4 : 0) - Math.abs(px - 113) / 11 * .6 });
      const rnd = K.maske(); rnd.ell(113, 66, 11, 2.6); K.form(rnd, 0, { k: HOLZ, r: ['#7a5a38', '#d8b080'], ton: 3, fase: 0, rand: 1 });
      for (let x = 103; x <= 123; x++) for (let y = 64; y <= 68; y++) if (Math.hypot((x - 113) / 9.5, (y - 66.2) / 1.7) < 1) K.set(x, y, Math.hypot((x - 110) / 4, (y - 65.6) / 1) < 1 ? TRAN : (x + y) & 1 ? '#6a4416' : '#4a2c0c');
      K.set(109, 66, TRAN_K); K.set(110, 66, TRAN_K);
      K.licht(111, 64, 18, TRAN_G, .9);
      // Kelle über dem Rand, erloschene Lampe am Boden
      const ke = K.maske(); ke.kap(118, 66, 132, 54, .7, .6); ke.ell(117, 67, 2.4, 1.2);
      K.form(ke, 0, { k: DUNKEL, r: ['#6a6a70', '#c8c8d0'], ton: 2, fase: 0, rand: 1 });
      const la = K.maske(); la.ell(134, 85, 5, 1.6); la.rect(130, 81, 8, 4); la.kap(134, 81, 134, 76, .5, .5); la.kap(130, 81, 128, 79, .6, .4);
      K.form(la, 0, { k: DUNKEL, r: ['#3a3835', '#968a72'], ton: 1.6, fase: 0, rand: 1, schatten: 1 });
      K.set(134, 75, '#2a2a2e'); K.set(135, 73, '#1e1e22'); K.set(134, 71, '#16161a');
      K.vignette(.75, { cx: 84, cy: 56 });
    },

    // Eine Gestalt, klein, mit dem Kopf an einen riesigen Knochenbogen gelehnt; ganz hinten ein schwaches rotes Glimmen.
    walkathedrale_horchen(K) {
      const { B } = K;
      eisWand(K, 60, 30, .25);
      eisBoden(K, 56, { tf: (x, y) => -Math.abs(x - 60) / 300 });
      schiff(K, 60, 50, { n: 6, b: 50, h: 62, d: 3, f: .68, tiefe: .25, ton: 1.2, boden: 70 });
      herz(K, 60, 47, 3, 1);
      K.lichtquelle(60, 46);
      // Der riesige Bogen vorn: rechts aus dem Boden, über das ganze Bild nach links; kaltes Licht von oben rechts
      riss(K, 156, 4, 10, 2);
      const bo = K.maske(); bo.pfad([[134, 94], [136, 70], [132, 44], [120, 20], [98, 4], [66, -4], [20, -6]], 13, 6);
      K.form(bo, 0, knochen(K, 2, { L: [.3, -1], verlauf: -.6, muster: (px, py) => (B.hash(px >> 1, py >> 1, 17) < .08 ? -1 : 0) + (Math.sin(py * .9 + px * .2) > .9 ? -.5 : 0) }));
      K.licht(146, 66, 64, '#24344e', 1, { maske: (x, y) => bo.has(x, y) });
      // Die Gestalt: klein, Ohr an den Knochen, Hände flach daran
      const g = K.figurMaske(122, 88, 36, { kopf: 'muetze', blick: 1, neig: 4, kopfDreh: 2.5, arme: [[133, 61], [132, 72]], ellbogen: [[127, 66], [126, 76]] });
      K.form(g, 0, { k: DUNKEL, ton: .7, rand: 0, fase: 0 });
      K.kante(g, 60, 47, 90, ['#4a1a20', '#a8362f'], { min: .5 });
      // rotes Licht des Herzens auf der Innenkante des Bogens
      K.kante(bo, 60, 47, 90, ['#2c1014', '#4a1a20'], { min: .5 });
      K.vignette(.6, { cx: 96, cy: 50 });
    },

    // Eine alte Handharpune schräg in einem Wirbelkörper, die Leine gespannt, sie verschwindet zwischen den Rippen im Dunkel.
    walkathedrale_harpune(K) {
      const { B } = K;
      eisWand(K, 150, 0, .3);
      riss(K, 148, 0, 10, 2.2);
      eisBoden(K, 64);
      // Rippen rechts in Flucht, das Dunkel dazwischen, ganz hinten das Herz
      const vx = 136, vy = 46;
      for (let i = 6; i >= 0; i--) {
        const s = Math.pow(.72, i), x = vx + (176 - vx) * s, yb = vy + (90 - vy) * s;
        const m = K.maske(); m.pfad([[x, yb], [x - 6 * s, yb - 40 * s], [x - 22 * s, yb - 70 * s], [x - 50 * s, yb - 86 * s]], 4 * s + .6, 2.4 * s + .4);
        const m2 = K.maske(); m2.pfad([[x - 74 * s, yb + 2 * s], [x - 72 * s, yb - 30 * s], [x - 62 * s, yb - 60 * s]], 3.4 * s + .5, 2 * s + .4);
        K.form(m, Math.min(.9, i / 6), knochen(K, 1.4, { nebelFarbe: EIS[3] })); K.form(m2, Math.min(.95, i / 6 + .2), knochen(K, 1.2, { nebelFarbe: EIS[3] }));
      }
      herz(K, vx - 4, vy - 2, 2, .7);
      K.lichtquelle(150, 0);
      // Wirbel links von vorn: runde Körperscheibe mit Wachstumsringen, darüber der Bogen um den Markkanal,
      // der Dornfortsatz nach oben, die Querfortsätze waagerecht
      const wx = 46, wy = 58;
      const fort = K.maske();
      fort.poly([[wx - 7, wy - 30], [wx + 7, wy - 30], [wx + 4, wy - 56], [wx - 2, wy - 58]]);
      fort.poly([[wx - 16, wy - 6], [wx - 44, wy - 10], [wx - 46, wy - 4], [wx - 18, wy + 4]]); fort.poly([[wx + 16, wy - 6], [wx + 44, wy - 10], [wx + 46, wy - 4], [wx + 18, wy + 4]]);
      K.form(fort, .12, knochen(K, 1.3));
      const bg = K.maske(); bg.fn(wx - 16, wy - 36, wx + 16, wy - 10, (x, y) => Math.hypot((x - wx) / 14, (y - wy + 18) / 14) < 1);
      bg.fn(wx - 8, wy - 30, wx + 8, wy - 14, (x, y) => Math.hypot((x - wx) / 6.5, (y - wy + 21) / 6) < 1, 0);
      K.form(bg, .05, knochen(K, 1.5));
      const kanal = K.maske(); kanal.ell(wx, wy - 21, 6, 5.5); K.form(kanal, 0, { k: DUNKEL, ton: .2, fase: 0, rand: 0 });
      const kp = K.maske(); kp.ell(wx, wy, 21, 19);
      K.form(kp, 0, knochen(K, 1.8, { verlauf: .5, muster: (px, py, d) => { const r = Math.hypot(px - wx, (py - wy) * 1.1); return (r % 5 < .8 ? -.6 : 0) + (B.hash(px >> 1, py >> 1, 17) < .07 ? -1 : 0) - r / 21 * .5; } }));
      // Harpune: Eisen tief im Knochen, Schaft schräg nach links unten heraus
      const hx = wx + 4, hy = wy + 2;
      const ha = K.maske(); ha.kap(hx, hy, hx - 40, hy + 34, 1.3, 1.6);
      K.form(ha, 0, { k: HOLZ, r: ['#7a5a38', '#d8b080'], ton: 3, fase: 0, rand: 2, L: [.6, -.8] });
      const ei = K.maske(); ei.kap(hx, hy, hx - 9, hy + 7.6, 1, .8); ei.rect(hx - 10, hy + 7, 3, 2);
      K.form(ei, 0, { k: DUNKEL, r: ['#6a6a70', '#e0e0e8'], ton: 2, fase: 0, rand: 1 });
      // Bruchrand im Knochen um das Eisen
      for (const [dx, dy] of [[1, -1], [2, 1], [-1, -2], [0, 2], [2, -2]]) K.set(hx + dx, hy + dy, KNOCHEN[0]);
      // Leine: vom Ring am Schaft straff nach rechts ins Dunkel zwischen den Rippen
      const lx0 = hx - 9, ly0 = hy + 8;
      for (let i = 0; i <= 120; i++) { const q = i / 120, x = B.lerp(lx0, vx - 4, q), y = B.lerp(ly0, vy - 2, q) + Math.sin(q * Math.PI) * 1.5; if (q < .85 || B.bay(x, y) > (q - .85) * 6) K.set(x, y, q < .5 ? '#a08a60' : '#6a5a40'); }
      K.vignette(.75, { cx: 76, cy: 46 });
    },

    // Elf sitzende Gestalten im Kreis zwischen den Rippen, eine Tranlampe in der Mitte; eine Lücke im Kreis.
    walkathedrale_mannschaft(K) {
      const { B } = K;
      eisWand(K, 80, 50, .15);
      eisBoden(K, 40, { tf: (x, y) => -.15 });
      // Rippen hinten im Dunkel, schwach vom Lampenlicht gestreift
      const rippen = K.maske();
      for (const [x, s] of [[10, -1], [34, -1], [126, 1], [150, 1]]) rippen.pfad([[x, 52], [x + s * 4, 30], [x + s * 14, 10], [x + s * 30, -4]], 3, 2);
      K.form(rippen, .35, knochen(K, 1.1, { nebelFarbe: EIS[2] }));
      const lx = 80, ly = 54, rx = 62, ry = 22;
      // Lampenlicht auf dem Boden
      K.licht(lx, ly, 74, TRAN_G, 1, { oval: 2.4 });
      K.licht(lx, ly, 44, '#3a2610', 1, { oval: 2.4 });
      // Die Männer: zwölf Plätze, der vorderste leer; hinten von vorn gesehen, vorn von hinten
      const plaetze = [];
      for (let i = 0; i < 12; i++) { const a = Math.PI / 2 + i / 12 * Math.PI * 2; plaetze.push({ i, x: lx + Math.cos(a) * rx, y: ly + Math.sin(a) * ry, a }); }
      plaetze.sort((p, q) => p.y - q.y);
      const lampe = () => {
        const s = K.maske(); s.ell(lx, ly, 3.6, 1.4); s.rect(lx - 3, ly - 2, 7, 2); K.form(s, 0, { k: HOLZ, ton: 2.4, fase: 0, rand: 1 });
        tranflamme(K, lx, ly - 2, { hof: 0 });
      };
      let lampeGemalt = false;
      for (const p of plaetze) {
        if (!lampeGemalt && p.y > ly) { lampe(); lampeGemalt = true; }
        const h = 17 + (p.y - (ly - ry)) / (2 * ry) * 10;
        if (p.i === 0) continue;   // der Platz für den zwölften
        const vorn = p.y > ly + ry * .45;
        const m = vorn ? ruckenMaske(K, p.x, p.y + 2, h) : sitzerMaske(K, p.x, p.y + 2, h);
        K.form(m, 0, { k: ['#060504', '#0e0b08', '#1a140e', '#2a2016'], ton: vorn ? .6 : 1.4, verlauf: vorn ? 0 : .5, rand: 0, fase: 0 });
        K.kante(m, lx, ly - 4, 80, TRANKANTE, { nah: .4 });
        if (!vorn) K.licht(p.x, p.y - h * .5, h * .7, '#2a1a08', .8, { maske: (x, y) => m.has(x, y) });
      }
      if (!lampeGemalt) lampe();
      K.licht(lx, ly - 3, 50, TRAN_G, .9);
      K.licht(lx, ly - 3, 10, '#4a2a08', 1);
      tranflamme(K, lx, ly - 2, { hof: 0 });
      // vor dem leeren Platz: das Logbuch mit dem leeren Blatt
      const p0 = plaetze.find(p => p.i === 0);
      buch(K, Math.round(p0.x), Math.round(p0.y - 4), 16, { leer: true, ton: 3, L: [0, -1] });
      K.vignette(.8, { cx: 80, cy: 56 });
    },

    // Kamera dicht am Eisboden: drei Mulden in einer Reihe, von links nach rechts wachsend (10, 16, 24 px), jede mit hellem Randlicht oben und dunklem Grund, Risse dazwischen; oben nur Rippenbögen als Rahmen, fern ein kleines rotes Glimmen; links ein heller Knochenpfeiler mit drei Kreidestrichen.
    walkathedrale_dritter_schlag(K) {
      const { B } = K;
      const vx = 84, vy = 34;
      eisWand(K, vx, vy, .3);
      eisBoden(K, 46, { tf: (x, y) => .08 + Math.max(0, 1 - Math.hypot((x - 80) / 90, (y - 70) / 30)) * .22 });
      schiff(K, vx, vy, { n: 4, b: 74, h: 50, d: 3.6, f: .66, tiefe: .2, ton: 1.5, boden: 52 });
      herz(K, vx, vy + 4, 2, 1);
      K.lichtquelle(vx, vy);
      // Kaltes Licht von oben auf den Boden, damit Randlicht und Risse lesbar sind
      K.licht(80, 66, 80, KALT_G, .8, { oval: 2, maske: (x, y) => y > 48 });
      // Risse zuerst: von der dritten Mulde nach links durch die zweite und erste, kleine Zweige
      const rng = B.rng(41);
      const riss2 = (x0, y0, x1, y1) => {
        let x = x0, y = y0; const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
        for (let k = 0; k < n; k++) { const q = k / n; x = x0 + (x1 - x0) * q + rng.j(.9); y = y0 + (y1 - y0) * q + rng.j(.6); K.set(Math.round(x), Math.round(y), k % 4 ? '#4a6a94' : '#9cc0e8'); K.set(Math.round(x), Math.round(y) + 1, '#0a101c'); }
      };
      riss2(96, 78, 80, 77); riss2(80, 77, 74, 74); riss2(58, 74, 50, 73); riss2(96, 80, 78, 83); riss2(60, 76, 52, 80); riss2(34, 74, 22, 72); riss2(40, 76, 30, 80);
      riss2(104, 70, 100, 62); riss2(118, 72, 128, 66);
      // Die drei Mulden: dunkler Grund, heller Rand oben (die Lippe), Eisbrocken an der Kante
      const mulde = (cx, cy, rx, ry, tiefe) => {
        const m = K.maske(); m.ell(cx, cy, rx, ry);
        K.form(m, 0, { k: ['#000103', '#01040a', '#030812', '#070f1c'].slice(0, 2 + tiefe), r: [], ton: .7, fase: 0, rand: 0, verlauf: -.8 });
        // heller Rand oben, 2 px breit, und schwacher Rand an den Seiten
        for (let x = Math.round(cx - rx) - 1; x <= cx + rx + 1; x++) {
          const u = (x - cx) / rx; if (Math.abs(u) > 1) continue; const yo = Math.round(cy - ry * Math.sqrt(1 - u * u));
          K.set(x, yo - 1, '#d4ecff'); K.set(x, yo, '#7aa8d8'); if (Math.abs(u) < .75) K.set(x, yo + 1, '#33496a');
        }
        for (let j = 0; j < 6; j++) { const a = -Math.PI * (.1 + j * .16), x = Math.round(cx + Math.cos(a) * (rx + 1)), y = Math.round(cy + Math.sin(a) * (ry + 1)); K.set(x, y - 1, '#e8f6ff'); K.set(x + 1, y - 1, '#8ab0d8'); }
        // unterer Rand: nur ein feiner Strich, damit die Mulde Tiefe hat
        for (let x = Math.round(cx - rx * .6); x <= cx + rx * .6; x++) K.set(x, Math.round(cy + ry) + 1, '#1a2a44');
      };
      mulde(40, 76, 5, 2, 1);
      mulde(68, 76, 8, 3.4, 2);
      mulde(108, 77, 12, 5.5, 4);
      // Pfeiler links, hell vom Randlicht, aus Knochen; Kreide: drei Striche
      const pf = K.maske(); pf.poly([[0, 0], [30, 0], [27, 36], [25, 90], [0, 90]]);
      K.form(pf, 0, knochen(K, 3.2, { L: [1, -.1], verlauf: -.2, lichtVon: [80, 40] }));
      K.kante(pf, 80, 50, 200, KN_RAND, { min: .2, nah: .6 });
      K.licht(26, 40, 40, '#2e3a52', .5, { maske: (x, y) => pf.has(x, y) });
      const KR = '#f0ead8', KRd = '#9a9684';
      for (const [x, y0, y1, d] of [[8, 22, 40, false], [14, 22, 40, false], [20, 18, 44, true]]) {
        K.linie(x, y0, x, y1, KR);
        if (d) { K.linie(x + 1, y0, x + 1, y1, KR); K.linie(x - 1, y0 + 1, x - 1, y1, KRd, .6); }
      }
      for (let i = 0; i < 12; i++) { const x = 4 + rng.i(0, 22), y = 86 + rng.i(0, 3); if (B.bay(x, y) < .7) K.set(x, y, i % 3 ? KRd : KR); }
      K.vignette(.5, { cx: 86, cy: 54 });
    },
  },
};
