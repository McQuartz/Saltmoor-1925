// Ereignisbilder 160 × 90 · Kurhaus (prototype/data/biome/kurhaus.json).
// Palette des Kurhauses (prototype/js/scenes/world/kurhaus.js): Seegrün-Grau, Milchglas, Kacheln,
// Messing als warmer Glanz. Das Licht ist kalt und milchig, nie nachtblau.
'use strict';

const GLAS = ['#152224', '#1f3133', '#2b4244', '#3a5655', '#4c6b69', '#62807d', '#7b9893', '#97b0aa', '#b4c8c1', '#d2e0da'];
const WAND = ['#050909', '#091012', '#0e1819', '#142224', '#1b2d2e', '#243a3a', '#2f4848', '#3c5856'];
const WASSER = ['#020606', '#050d0e', '#081516', '#0d1f20', '#132b2c', '#1b3a3a', '#264c4b', '#36605e'];
const KACHEL = ['#050909', '#0a1213', '#101b1c', '#172627', '#203334', '#2a4040', '#36504e'];
const EISEN = ['#030505', '#070c0d', '#0d1516', '#152122', '#1d2c2e'];
const HOLZ = ['#060908', '#0c1211', '#141c1b', '#1e2928', '#2a3736'];
const DECKE = ['#0e1414', '#1e2a2a', '#344444', '#4e6260', '#6e8480'];
const MESS = ['#2a2010', '#4a3818', '#7a6030', '#b08a46', '#e8cc8a'];
const MESSKANTE = ['#b08a46', '#f4e0a8'];
const RAND = ['#4f8480', '#bcdcd4'];
const RAND_D = ['#2f4848', '#4f8480'];
const MILCH = '#d8ece6', MILCH_G = '#1c3434', MILCH_G2 = '#2a4a48';
const HAUT = ['#3a3a34', '#6a6a5e', '#a8a898', '#d0d4c4'];
const PAPIER = ['#2a2e2a', '#545a54', '#8a928a', '#bcc4bc', '#e4ece4'];

// Gesicht, frontal: Mitte (x, y), klein (3×4 px), Augen dunkel
function gesicht(K, x, y, s) {
  s = s || 1; const { B } = K;
  for (let j = -2 * s; j <= 2 * s; j++) for (let i = -1.5 * s; i <= 1.5 * s; i++) { const q = Math.hypot(i / (1.6 * s), j / (2.2 * s)); if (q > 1) continue; K.set(x + i, y + j, q < .5 ? HAUT[3] : q < .8 ? HAUT[2] : HAUT[1]); }
  K.set(x - Math.round(.7 * s), y - Math.round(.3 * s), '#0a1010'); K.set(x + Math.round(.7 * s), y - Math.round(.3 * s), '#0a1010');
  void B;
}

module.exports = {
  biom: 'kurhaus',
  bilder: {
    // Eine Reihe eingepackter Patienten auf Liegestühlen, alle Gesichter zu dir, und ein Stuhl, dessen Decke schon aufgeschlagen ist.
    kurhaus_visite(K) {
      const { B } = K;
      // Liegehalle: Rückwand mit hohen Fenstern, milchiges Licht von draußen, nur gedämpft
      K.feld(0, 0, 160, 50, WAND, (x, y) => .3 + (B.fbm(x * .04, y * .05, K.seed, 2) - .5) * .15);
      for (let i = 0; i < 6; i++) {
        const x = 4 + i * 27, w = 19, hell = i === 4 ? .25 : 0;
        K.feld(x, 4, x + w, 40, GLAS, (px, py) => .25 + hell + (1 - (py - 4) / 36) * .25 + (B.fbm(px * .1, py * .06, 3, 2) - .5) * .15 + ((px - x) % 6 === 0 || (py - 4) % 9 === 0 ? -.2 : 0));
      }
      for (let i = 0; i <= 6; i++) { const p = K.maske(); p.rect(i * 27, 0, 5, 50); K.form(p, 0, { k: WAND.slice(1, 6), r: RAND_D, ton: 1.8, rand: 1, L: [0, -1] }); }
      K.licht(119, 40, 60, MILCH_G, .8);
      // Boden: Dielen in Flucht
      K.pflaster(50, 90, HOLZ, { vx: 40, ton: .4, dichte: 2 });
      // Liegestühle von der Seite (Fußende rechts), in einer Reihe nach hinten; die Köpfe drehen sich zu dir
      const stuhl = (x, yb, s, leer) => {
        const m = K.maske();
        m.kap(x - 12 * s, yb - 19 * s, x - 4 * s, yb - 6 * s, 1 * s, 1 * s);        // Lehne
        m.kap(x - 4 * s, yb - 6 * s, x + 13 * s, yb - 5 * s, 1 * s, 1 * s);         // Sitz und Fußteil
        m.kap(x - 8 * s, yb - 12 * s, x - 13 * s, yb, .7 * s, .7 * s); m.kap(x - 4 * s, yb - 6 * s, x - 2 * s, yb, .7 * s, .7 * s); m.kap(x + 12 * s, yb - 5 * s, x + 13 * s, yb, .7 * s, .7 * s);
        K.form(m, 0, { k: HOLZ, r: leer ? RAND : RAND_D, ton: leer ? 3 : 2.2, rand: 1, L: [.3, -1] });
        const kissen = K.maske(); kissen.ell(x - 11 * s, yb - 19.5 * s, 2.6 * s, 2.2 * s);
        if (!leer) {
          const d = K.maske();
          d.kap(x - 9 * s, yb - 15 * s, x - 3 * s, yb - 8.5 * s, 3.6 * s, 3.6 * s); d.kap(x - 3 * s, yb - 8.5 * s, x + 12 * s, yb - 8 * s, 3.6 * s, 2.8 * s);
          K.form(d, 0, { k: DECKE, r: RAND, ton: 2.3, rand: 1, L: [.3, -1], muster: (px) => (Math.round(px - x) % Math.max(3, Math.round(4 * s)) === 0 ? -1.1 : 0) });
          const kopf = K.maske(); kopf.ell(x - 11 * s, yb - 20 * s, 3 * s, 3.3 * s); K.form(kopf, 0, { k: WAND.slice(0, 5), r: RAND_D, ton: 1.4, rand: 1, L: [.3, -1] });
          gesicht(K, Math.round(x - 11 * s), Math.round(yb - 19.5 * s), Math.max(1.1, s * 1.1));
        } else {
          K.form(kissen, 0, { k: DECKE, r: RAND, ton: 3, rand: 1, L: [.3, -1], muster: (px, py) => (Math.hypot(px - x + 11 * s, py - yb + 19.5 * s) < 1.3 * s ? -1 : 0) });
          // Decke aufgeschlagen: am Fußende zusammengelegt, die helle Innenseite nach oben
          const d = K.maske(); d.kap(x + 2 * s, yb - 7.5 * s, x + 12 * s, yb - 7.5 * s, 2 * s, 2 * s);
          K.form(d, 0, { k: DECKE, r: RAND, ton: 2.3, rand: 1, L: [.3, -1] });
          const ecke = K.maske(); ecke.poly([[x - 4 * s, yb - 7 * s], [x + 4 * s, yb - 9.5 * s], [x + 3 * s, yb - 6 * s]]);
          K.form(ecke, 0, { k: ['#3a4e4c', '#6a827e', '#a8bcb6', '#d2e0da'], r: ['#d2e0da', '#eef6f2'], ton: 2.6, rand: 1, L: [.3, -1] });
        }
      };
      const P = [[34, 58, .8], [64, 64, .95], [96, 72, 1.15], [134, 88, 1.55]];
      P.forEach(([x, y, s], i) => stuhl(x, y, s, i === P.length - 1));
      K.lichtquelle(119, 20);
      K.vignette(.65, { cy: 44 });
    },

    // Ein gekachelter Raum voll weißem Nebel, eine Reihe Rücken auf Hockern, Schläuche aus Messing, und ein Gang durch den Nebel, so breit wie du.
    kurhaus_inhalatorium(K) {
      const { B } = K;
      // Rückwand aus Kacheln, Boden in Flucht
      K.feld(0, 0, 160, 58, KACHEL, (x, y) => .55 + ((x % 7 === 0 || y % 7 === 0) ? -.3 : 0) - y / 400);
      K.pflaster(58, 90, KACHEL, { vx: 80, ton: .35, dichte: 2.2 });
      // Messingrohr quer über die Wand, Düsen darunter
      const rohr = K.maske(); rohr.kap(0, 24, 160, 24, 1.6, 1.6);
      for (let i = 0; i < 7; i++) { const x = 12 + i * 23; rohr.kap(x, 25, x, 32, .7, .7); rohr.ell(x, 33, 1.6, 1.2); }
      // Ganz hinten im Gang: eine Tür mit Licht (die helle Stelle)
      const gx = 80;
      K.feld(gx - 5, 34, gx + 6, 58, GLAS, (x, y) => .98 - (y - 34) / 150);
      const zarge = K.maske(); zarge.rect(gx - 7, 32, 2, 26); zarge.rect(gx + 6, 32, 2, 26); zarge.rect(gx - 7, 32, 15, 2);
      // Nebel überall, nur der Gang in Personenbreite ist frei
      const frei = (x, y) => { if (y < 30) return 0; const t = Math.max(0, (y - 34) / 56), w = B.lerp(6, 15, t); return Math.abs(x - gx) < w ? 1 : Math.abs(x - gx) < w + 2 ? .5 : 0; };
      K.feld(0, 0, 160, 90, GLAS.slice(3, 9), (x, y) => frei(x, y) >= 1 ? -1 : (frei(x, y) > 0 && B.bay(x, y) < .5) ? -1 : .35 + .3 * B.fbm(x * .03, y * .05, K.seed, 2) - y / 400);
      K.form(rohr, 0, { k: MESS, r: MESSKANTE, ton: 2.2, rand: 1, L: [0, -1] });
      K.form(zarge, 0, { k: WAND.slice(1, 6), r: RAND, ton: 1.8, rand: 1 });
      // Die Reihe Rücken auf Hockern, vor den Düsen; Schläuche zu den Masken; im Gang sitzt niemand
      const rueck = K.maske(), schl = K.maske();
      for (const x of [14, 36, 58, 104, 126, 148]) {
        const ys = 64, s = 1.2;
        rueck.ell(x, ys - 16 * s, 7.2 * s, 3.4 * s);
        rueck.poly([[x - 7.2 * s, ys - 16 * s], [x + 7.2 * s, ys - 16 * s], [x + 5.4 * s, ys - 5 * s], [x - 5.4 * s, ys - 5 * s]]);
        rueck.ell(x, ys - 2.5 * s, 6.8 * s, 3 * s);
        rueck.rect(x - 1.4 * s, ys - 20.5 * s, 2.8 * s, 3 * s); rueck.ell(x, ys - 22.5 * s, 3.2 * s, 3.5 * s);
        rueck.kap(x - 4 * s, ys - 1, x - 5 * s, ys + 14, .9, .9); rueck.kap(x + 4 * s, ys - 1, x + 5 * s, ys + 14, .9, .9);
        const dx = 12 + Math.round((x - 12) / 23) * 23;
        const sx2 = x + (dx >= x ? 3.5 : -3.5) * s; schl.pfad([[dx, 34], [B.lerp(dx, sx2, .5), 36], [sx2, ys - 22 * s]], .9, .8);
      }
      K.form(schl, 0, { k: MESS, r: MESSKANTE, ton: 2, rand: 1, L: [0, -1] });
      K.form(rueck, 0, { k: GLAS.slice(1, 4), r: GLAS.slice(5, 7), ton: 1, fase: 0, rand: 1, L: [0, -1] });
      // Vorn noch ein Hauch Nebel über den Rücken, ruhig
      K.dith(0, 30, 160, 90, GLAS[5], (x, y) => rueck.has(x, y) && !frei(x, y) ? .18 * (.6 + .6 * B.fbm(x * .05, y * .07, K.seed + 3, 2)) : 0);
      // Ränder des Gangs: der Nebel steht still wie eine Wand
      for (let y = 34; y < 90; y++) { const t = (y - 34) / 56, w = B.lerp(6, 15, t); for (const sd of [-1, 1]) if (B.bay(gx + sd * w, y) < .5) K.set(gx + sd * (w + 1), y, GLAS[7]); }
      K.lichtquelle(gx, 40);
      K.vignette(.55);
    },

    // Ein stilles Becken unter der beschlagenen Kuppel, darin Köpfe in einer Reihe, die sich heben, ohne dass sich die Oberfläche bewegt.
    kurhaus_wellen(K) {
      const { B } = K;
      // Kuppel: Rippen strahlen vom Oculus aus, Milchglas dazwischen
      const ox = 80, oy = -6;
      K.feld(0, 0, 160, 52, GLAS, (x, y) => {
        const a = Math.atan2(y - oy, x - ox), d = Math.hypot(x - ox, (y - oy) * 1.8);
        const rippe = Math.abs(((a * 9 / Math.PI) % 1 + 1) % 1 - .5) > .46, ring = Math.abs((d % 22) - 11) > 10;
        return .3 + Math.max(0, 1 - d / 120) * .5 + (rippe || ring ? -.35 : 0) + (B.fbm(x * .06, y * .08, K.seed, 2) - .5) * .12;
      });
      K.feld(ox - 16, 0, ox + 17, 8, GLAS, (x, y) => Math.hypot(x - ox, (y - oy) * 1.8) < 18 ? .97 : -1);
      // Beckenrand
      const rand = K.maske(); rand.rect(0, 50, 160, 4); K.form(rand, 0, { k: KACHEL.slice(1), r: RAND, ton: 2.6, rand: 1, L: [0, -1], muster: (x) => (x % 8 === 0 ? -.8 : 0) });
      // Wasser: glatt wie Glas, spiegelt die Kuppel
      K.feld(0, 54, 160, 90, WASSER, (x, y) => { const sy = 108 - y + 0 * x, a = Math.atan2(sy - oy, x - ox), rip = Math.abs(((a * 9 / Math.PI) % 1 + 1) % 1 - .5) > .46; return .42 + (1 - (y - 54) / 36) * .35 + (rip ? -.15 : 0) + (Math.abs(x - ox) < 14 && y < 64 ? .25 : 0); });
      // Köpfe in einer Reihe: jeder steht anders hoch aus dem Wasser, die Linie bleibt gerade
      const wl = 66;
      for (let i = 0; i < 9; i++) {
        const x = 12 + i * 17, hub = Math.sin(i * .85) * 5 + 4, m = K.maske();
        m.ell(x, wl - 3 - hub, 3.4, 3.8); m.kap(x, wl - hub, x, wl + 2, 2, 2.4);
        if (hub > 3) m.ell(x, wl - hub + 4, 5.4, 2.4); if (hub > 6) m.rect(x - 5, wl - hub + 4, 11, hub - 3);   // Schultern, wenn er hoch steht
        m.fn(m.x0, wl + 1, m.x1, m.y1 + 1, () => true, 0);
        K.form(m, 0, { k: WAND.slice(0, 5), r: RAND, ton: 1.4, rand: 1, L: [0, -1] });
        K.rect(x - 4, wl, 9, 1, GLAS[6]);
        // Spiegelbild: nur ein dunkler Fleck, ruhig
        for (let y = wl + 2; y < wl + 5 + hub; y++) for (let xx = x - 2; xx <= x + 2; xx++) if (B.bay(xx, y) < .6) K.set(xx, y, WASSER[1]);
      }
      // Leiter aus Messing am Rand
      const le = K.maske(); le.kap(146, 46, 146, 66, .7, .7); le.kap(152, 46, 152, 66, .7, .7); le.kap(146, 46, 149, 42, .7, .7); le.kap(152, 46, 149, 42, .7, .7); for (const y of [52, 58, 64]) le.rect(146, y, 6, 1);
      K.form(le, 0, { k: MESS, r: MESSKANTE, ton: 2.2, rand: 1, fase: 0, L: [0, -1] });
      K.lichtquelle(ox, 2);
      K.vignette(.6, { cy: 40 });
    },

    // Eine gestreifte Badekabine auf hohen Rädern, bis zu den Achsen im stillen Wasser, die Tür ein schwarzes Rechteck, davor ein Paar Schuhe.
    kurhaus_badekarren(K) {
      const { B } = K;
      // Milchiger Himmel, die Sonne als heller Fleck im Dunst
      K.himmel(48, GLAS.slice(0, 8), { steil: .3, basis: .35, wolken: .12, gx: 124, gb: 30 });
      K.licht(124, 30, 30, MILCH_G2, .9);
      for (let y = 26; y <= 34; y++) for (let x = 119; x <= 129; x++) { const q = Math.hypot(x - 124, y - 30) / 5; if (q < 1) K.set(x, y, q < .6 ? '#eef6f2' : GLAS[9]); }
      // Stilles Meer, glatt, nach vorn dunkler
      K.feld(0, 48, 160, 90, WASSER, (x, y) => .75 - (y - 48) / 50 + (Math.sin(y * 1.7) > .9 ? .08 : 0));
      K.spiegel(124, 49, 70, GLAS[8], 3);
      // Die Kabine auf Rädern: Kasten mit Streifen, Satteldach, Tür schwarz
      const cx = 70, wl = 66;
      const rad = K.maske();
      for (const x of [cx - 18, cx + 18]) { rad.ell(x, wl, 11, 11); rad.ell(x, wl, 9.5, 9.5, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; rad.kap(x + Math.cos(a) * 9.5, wl + Math.sin(a) * 9.5, x - Math.cos(a) * 9.5, wl - Math.sin(a) * 9.5, .6, .6); } rad.ell(x, wl, 1.6, 1.6); }
      rad.kap(cx - 18, wl, cx + 18, wl, .9, .9);
      rad.fn(0, wl + 1, 160, 90, () => true, 0);
      K.form(rad, 0, { k: EISEN, r: RAND, ton: 1.6, rand: 1, L: [.8, -.6] });
      const kab = K.maske(); kab.rect(cx - 20, 24, 40, 32);
      K.form(kab, 0, { k: ['#0e1616', '#1e2c2c', '#3a4e4c', '#6a827e', '#a8bcb6'], r: RAND, ton: 2, rand: 1, L: [.8, -.6], muster: (x) => (Math.floor((x - cx + 20) / 5) % 2 ? -1.6 : .6) });
      const dach = K.maske(); dach.poly([[cx - 23, 25], [cx, 14], [cx + 23, 25]]);
      K.form(dach, 0, { k: WAND.slice(1, 7), r: RAND, ton: 2, rand: 2, L: [.6, -.8] });
      K.rect(cx - 6, 32, 12, 24, '#000000');
      // Treppe vor der Tür, die Schuhe auf der untersten Stufe
      const tr = K.maske(); tr.rect(cx - 7, 56, 14, 2); tr.rect(cx - 7, 60, 14, 2); tr.kap(cx - 7, 56, cx - 8, 66, .7, .7); tr.kap(cx + 7, 56, cx + 8, 66, .7, .7);
      K.form(tr, 0, { k: HOLZ, r: RAND, ton: 2, rand: 1, L: [.4, -1] });
      const sh = K.maske(); sh.ell(cx - 3, 59, 2.4, 1.2); sh.ell(cx + 2.5, 59, 2.4, 1.2); sh.rect(cx - 5, 58, 3, 1); sh.rect(cx + 2, 58, 3, 1);
      K.form(sh, 0, { k: ['#050404', '#0e0b0a', '#1c1714', '#2e2620'], r: ['#6a827e', '#d2e0da'], ton: 1.6, rand: 1, fase: 0, L: [.6, -.8] });
      // Spiegelung der Kabine im Wasser: gestreift, gebrochen
      for (let y = wl + 1; y < 90; y++) for (let x = cx - 20; x < cx + 20; x++) { const sy = 2 * wl - y - 10; if (sy < 24 || (y - wl) % 3 === 0) continue; const str = Math.floor((x - cx + 20) / 5) % 2; if (B.bay(x, y) < .5) K.set(x, y, str ? WASSER[1] : WASSER[4]); }
      K.lichtquelle(124, 30);
      K.vignette(.55, { cx: 90 });
    },

    // Ein runder Pavillon im Milchlicht, Messing glänzt, Stuhlreihen mit Rücken in Mänteln, kein Atemhauch in der kalten Luft.
    kurhaus_kurkonzert(K) {
      const { B } = K;
      // Milchiger Nebel über dem Kurpark
      K.himmel(60, GLAS.slice(0, 7), { steil: .2, basis: .45, wolken: .1 });
      K.feld(0, 54, 160, 90, SAND(), (x, y) => .3 + (y - 54) / 60);
      // Pavillon: Kuppeldach, Säulen, Podest; innen die Kapelle
      const px = 80, pw = 34, dy = 20, py = 52;
      const dach = K.maske(); dach.ell(px, dy + 2, pw + 3, 9); dach.fn(px - pw - 4, dy + 2, px + pw + 4, dy + 12, () => false); dach.rect(px - pw - 3, dy + 2, 2 * pw + 6, 3); dach.kap(px, dy - 7, px, dy - 13, .8, .5);
      dach.fn(0, dy + 5, 160, 90, () => true, 0);
      K.form(dach, 0, { k: WAND.slice(1, 7), r: RAND, ton: 2, rand: 2, L: [0, -1], muster: (x) => (Math.round(x - px) % 7 === 0 ? -.6 : 0) });
      // Inneres: heller Schein
      K.feld(px - pw, dy + 5, px + pw, py, GLAS, (x, y) => .55 + (1 - Math.abs(x - px) / pw) * .25 - (y - dy) / 120);
      // Musiker: Silhouetten mit Hörnern, Messing glänzt
      const mus = K.maske();
      for (let i = 0; i < 6; i++) { const x = px - pw + 7 + i * 11, yb = py; mus.ell(x, yb - 15, 2.4, 2.6); mus.poly([[x - 3.5, yb - 12], [x + 3.5, yb - 12], [x + 4.5, yb], [x - 4.5, yb]]); }
      K.form(mus, 0, { k: WAND.slice(0, 4), ton: 1.2, rand: 0 });
      for (let i = 0; i < 6; i++) {
        const x = px - pw + 7 + i * 11, h = K.maske();
        if (i % 2) { h.kap(x + 1, py - 13, x + 5, py - 6, .5, .5); h.ell(x + 5.5, py - 5, 2.4, 2.4); } else { h.ell(x + 3, py - 8, 3, 2.6); h.ell(x + 3, py - 8, 1.6, 1.3, 0); h.kap(x + 1, py - 13, x + 2, py - 10, .5, .5); }
        K.form(h, 0, { k: MESS, r: MESSKANTE, ton: 2.6, rand: 1, fase: 0, L: [0, -1] });
      }
      for (const x of [px - pw, px - pw / 2, px + pw / 2, px + pw - 1]) { const s = K.maske(); s.rect(x - 1, dy + 4, 3, py - dy - 4); K.form(s, 0, { k: WAND.slice(2, 7), r: RAND, ton: 2.2, rand: 1, L: [0, -1] }); }
      const pod = K.maske(); pod.rect(px - pw - 4, py, 2 * pw + 8, 5); K.form(pod, 0, { k: WAND.slice(1, 7), r: RAND, ton: 2.2, rand: 1, L: [0, -1] });
      // Kies hell im Milchlicht, dann zwei Reihen Rücken in Mänteln und Hüten, ganz still
      K.feld(0, 57, 160, 90, GLAS.slice(1, 6), (x, y) => .55 - (y - 57) / 60 + (B.hash(x, y, 3) < .1 ? .15 : 0));
      const pub = K.maske();
      for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
        const s = 1 + row * .45, x = 4 + i * (20 + row * 8) + (row ? 4 : 12), yb = 82 + row * 14;
        if (x > 166) continue;
        const hut = (i + row) % 3;
        pub.ell(x, yb - 16 * s, 2.7 * s, 3 * s);
        if (hut === 0) { pub.kap(x - 4.2 * s, yb - 19 * s, x + 4.2 * s, yb - 19 * s, .6 * s, .6 * s); pub.ell(x, yb - 20.5 * s, 2.6 * s, 2.2 * s); }
        else if (hut === 1) { pub.kap(x - 4 * s, yb - 19 * s, x + 4 * s, yb - 19 * s, .6 * s, .6 * s); pub.rect(x - 2.6 * s, yb - 22.5 * s, 5.2 * s, 3.5 * s); }
        else pub.ell(x, yb - 18.5 * s, 3.2 * s, 2 * s);
        pub.poly([[x - 6 * s, yb - 12.5 * s], [x + 6 * s, yb - 12.5 * s], [x + 7 * s, yb], [x - 7 * s, yb]]); pub.ell(x, yb - 12.5 * s, 6.2 * s, 2.6 * s);
        pub.rect(x - 1.5 * s, yb - 14 * s, 3 * s, 2 * s);
      }
      K.form(pub, 0, { k: ['#030606', '#060c0c', '#0b1414', '#121e1e'], r: RAND_D, ton: 1.2, rand: 1, L: [0, -1] });
      K.lichtquelle(px, 30);
      K.vignette(.55, { cy: 40 });
      function SAND() { return ['#070908', '#0c100f', '#121817', '#1a2221', '#242e2c', '#2f3b38']; }
      void B;
    },

    // Ein aufgeschlagenes Buch auf einem Tresen aus Marmor, eine Klingel, ein Füllhalter, und eine Spalte, die nach unten hin immer leerer wird.
    kurhaus_gaestebuch(K) {
      const { B } = K;
      // Hintergrund: dunkle Halle, Schlüsselbrett
      K.feld(0, 0, 160, 40, WAND, (x, y) => .3 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .12);
      for (let j = 0; j < 3; j++) for (let i = 0; i < 8; i++) { const x = 100 + i * 7, y = 6 + j * 9; K.set(x, y, MESS[3]); K.linie(x, y + 1, x, y + 4, MESS[1]); }
      // Marmortresen: geädert, Kante vorn
      K.feld(0, 34, 160, 90, ['#0e1616', '#1a2626', '#2a3a3a', '#3e5252', '#566c6a', '#728886'], (x, y) => { const ader = Math.abs(Math.sin(x * .05 + B.fbm(x * .03, y * .06, 5, 3) * 6)) < .06; return .35 + (y - 34) / 200 + (ader ? .35 : 0) + (B.fbm(x * .05, y * .08, 7, 2) - .5) * .2; });
      const kante = K.maske(); kante.rect(0, 80, 160, 10); K.form(kante, 0, { k: WAND.slice(1, 7), r: RAND, ton: 2, rand: 1, L: [0, -1], muster: (x, y) => (y === 82 ? -1 : 0) });
      // Lampe oben links (außerhalb): Licht auf dem Buch
      K.lichtquelle(30, -10);
      // Buch: zwei Seiten, leicht gewölbt
      const bl = 34, bt = 40, bm = 80, br = 126, bb = 74;
      const buch = K.maske(); buch.poly([[bl, bt + 2], [bm, bt], [bm, bb], [bl - 2, bb + 2]]); buch.poly([[bm, bt], [br, bt + 2], [br + 2, bb + 2], [bm, bb]]);
      const einband = K.maske(); einband.poly([[bl - 3, bt + 1], [br + 3, bt + 1], [br + 5, bb + 4], [bl - 5, bb + 4]]);
      K.form(einband, 0, { k: ['#0a0606', '#1a0e0c', '#2c1814', '#40241c'], ton: 1.6, rand: 1, r: RAND_D, schatten: 2 });
      K.form(buch, 0, { k: PAPIER, r: ['#bcc4bc', '#f0f6f0'], ton: 3, rand: 1, L: [-.4, -1], muster: (x, y) => (Math.abs(x - bm) < 1.5 ? -1.4 : 0) - Math.abs(x - bm) * -.0 + (Math.abs(x - bm) < 5 ? -.4 : 0) });
      // Zeilen: Namen links, rechts die Spalte "Abreise", nach unten immer leerer
      for (let i = 0; i < 10; i++) {
        const y = bt + 6 + i * 3;
        K.schrift(bl + 3, y, bl + 30, '#1a2020', { min: 2, max: 5 });
        K.linie(bl + 31, y + 1, bm - 3, y + 1, PAPIER[2]);
        const voll = Math.max(0, 1 - i / 6.5);
        K.schrift(bm + 3, y, bm + 20, '#1a2020', { min: 2, max: 4 });
        if (voll > 0) K.schrift(bm + 24, y, bm + 24 + Math.round(18 * voll), '#2a1e10', { min: 1, max: 3 });
      }
      K.linie(bm + 22, bt + 4, bm + 22, bb - 2, PAPIER[2]);
      // Füllhalter schräg auf der rechten Seite
      const fh = K.maske(); fh.kap(104, 70, 124, 60, 1.2, 1); const sp = K.maske(); sp.poly([[103, 70], [100, 72], [104, 71]]);
      K.form(fh, 0, { k: ['#040404', '#0c0c0c', '#181818', '#262626'], r: ['#6a827e', '#d2e0da'], ton: 1.6, rand: 1, fase: 0 });
      K.form(sp, 0, { k: MESS, ton: 3, rand: 0, fase: 0 });
      // Klingel: Messingkuppel auf schwarzem Fuß, die helle Stelle
      const kf = K.maske(); kf.ell(142, 70, 9, 2.6); K.form(kf, 0, { k: EISEN, r: RAND_D, ton: 1.6, rand: 1 });
      const kl = K.maske(); kl.ell(142, 66, 7, 6); kl.fn(130, 66, 154, 74, () => true, 0); kl.rect(135, 66, 14, 2); kl.kap(142, 60, 142, 58, .8, .8);
      K.form(kl, 0, { k: MESS, r: MESSKANTE, ton: 2.4, rand: 2, L: [-.6, -.8] });
      K.set(139, 62, '#fff6d8'); K.set(140, 61, '#f4e0a8');
      K.licht(70, 50, 70, MILCH_G, .7, { oval: 1.4 });
      K.vignette(.65, { cx: 82, cy: 56 });
    },
  },
};
