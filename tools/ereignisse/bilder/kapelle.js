// Ereignisbilder 160 × 90 · Kapelle (data/events.json mit biom "kapelle" und kapelle_plus.json).
// Palette der überfluteten Kapelle (prototype/js/scenes/world/kapelle.js): Umbra und Bernstein,
// trübes, bräunliches Wasser, von unten ein grünes Leuchten. Das Wasser steht oft schräg.
'use strict';

const WAND = ['#050302', '#0a0604', '#120b07', '#1b110a', '#26180e', '#332214', '#45301c'];
const WASSER = ['#030302', '#060605', '#0a0b08', '#10120d', '#181a12', '#22241a', '#30301f'];
const BODEN = ['#060403', '#0d0906', '#16100a', '#21170e', '#2e2014'];
const GRUEN = ['#0a2a1a', '#14583a', '#2a9a62', '#6ae0a0', '#c8ffe0'];
const HOLZ = ['#070504', '#120c08', '#1e140c', '#2c1e12', '#3c2a18'];
const STEIN = ['#0a0806', '#14100c', '#201a14', '#2e261c', '#3e3426', '#524634'];
const PAPIER = ['#2e2416', '#5a4a32', '#8f7a58', '#c8b48a', '#ece0c0'];
const HIMMEL = ['#040302', '#080604', '#0d0a06', '#130e09', '#1a130c', '#22190f'];
const SAMT = ['#120404', '#240a08', '#3a120c', '#541c12'];
const MESSING = ['#2a1a06', '#6a4416', '#b08030', '#ffd27a'];
const WARMKANTE = ['#8a5a20', '#ffd27a'];
const GRUENKANTE = ['#2a9a62', '#6ae0a0'];

// Spitzbogen-Maske: Mitte cx, halbe Breite w, Kämpfer ys, unten yb (gleichseitiger Bogen)
function spitzbogen(m, cx, w, ys, yb, v) {
  return m.fn(cx - w - 1, ys - w * 1.8 - 1, cx + w + 1, yb, (x, y) => Math.abs(x - cx) <= w && (y >= ys || (Math.hypot(x - (cx - w), y - ys) <= 2 * w && Math.hypot(x - (cx + w), y - ys) <= 2 * w)), v);
}
// Alles unterhalb der Linie unter(x, y) ins Wasser tauchen: Farben zum Wasserton ziehen
function tauchen(K, unter, farbe, f, o) {
  o = o || {}; const { B } = K;
  for (let y = 0; y < 90; y++) for (let x = 0; x < 160; x++) {
    if (!unter(x, y)) continue;
    const p = K.get(x, y), c = p >>> 24 ? B.unpk(p) : B.col(farbe);
    const ff = Math.min(1, f + (o.tiefe ? o.tiefe(x, y) : 0));
    K.set(x, y, B.mix(c, farbe, ff));
  }
}
// Wasserlinie: dünne, unterbrochene Kante mit Glanz
function wasserlinie(K, wy, x0, x1, cols, o) {
  o = o || {}; const { B } = K;
  for (let x = x0; x < x1; x++) {
    const y = Math.round(wy(x));
    if (o.maske && !o.maske(x, y)) continue;
    if (B.hash(x >> 1, 3, K.seed) < (o.dicht || .8)) K.set(x, y, cols[0]);
    if (B.hash(x, 5, K.seed) < (o.glanz || .12)) K.set(x, y, cols[1]);
  }
}

module.exports = {
  biom: 'kapelle',
  bilder: {
    // Ein Beichtstuhl aus dunklem Holz im schrägen Wasser, hinter dem Gitter zwei helle Punkte.
    kapelle_beichte(K) {
      const { B } = K;
      const wy = x => 49 + x * .14;              // das Wasser steht schräg
      K.fuell(WAND, (x, y) => .3 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .25 - y / 300);
      // Wandpfeiler und ein hohes, blindes Fenster
      K.mauer(0, 0, 18, 90, WAND.slice(1, 6), { hoehe: 7, breite: 9, ton: .4 });
      K.mauer(144, 0, 160, 90, WAND.slice(1, 6), { hoehe: 7, breite: 9, ton: .4 });
      const fe = K.maske(); spitzbogen(fe, 130, 6, 24, 60);
      K.form(fe, 0, { k: ['#080605', '#0d0a07', '#120e0a', '#18130d'], ton: 1.2, fase: 0, rand: 0, muster: (x, y) => (x === 130 || y === 40 ? -1 : 0) });
      // Beichtstuhl: Mittelteil mit Tür und Gitter, zwei Seitenkabinen mit Vorhängen, Giebel mit Kreuz
      const m = K.maske();
      m.rect(46, 22, 68, 66);
      m.poly([[43, 22], [117, 22], [113, 16], [47, 16]]);
      m.poly([[62, 17], [80, 6], [98, 17]]);
      m.rect(79, 0, 2, 7); m.rect(77, 2, 6, 2);
      K.lichtquelle(150, 0);
      K.form(m, 0, { k: HOLZ, ton: 1.6, verlauf: .4, schatten: 2, muster: (x, y) => {
        if (x === 64 || x === 96) return -1.2;
        if (x === 65 || x === 97) return .6;
        if (y === 22 || y === 17) return -.8;
        if (x > 66 && x < 94 && y > 46 && ((x - 67) % 13 === 0 || (y - 47) % 18 === 0)) return -.6;
        return 0;
      } });
      // Vorhänge der Seitenkabinen: nasser Samt in Falten
      for (const [x0, x1] of [[49, 62], [98, 111]]) {
        const v = K.maske(); v.rect(x0, 26, x1 - x0, 60);
        K.form(v, 0, { k: SAMT, ton: 1.3, fase: 0, rand: 0, muster: (x, y) => (Math.sin((x - x0) * 1.3) > .55 ? -.8 : Math.sin((x - x0) * 1.3) < -.7 ? .5 : 0) });
      }
      // Gitter in der Tür: dahinter nur Schwarz, darin zwei Punkte
      K.rect(70, 26, 20, 18, '#000000');
      K.licht(80, 34, 14, '#4a3414', .9);
      K.set(76, 34, '#fff4d0'); K.set(83, 34, '#fff4d0'); K.set(76, 35, '#a07a3a'); K.set(83, 35, '#a07a3a');
      for (let y = 26; y < 44; y++) for (let x = 70; x < 90; x++) if (((x + y) % 4 === 0 || (x - y + 100) % 4 === 0) && !((x === 76 || x === 83) && (y === 34 || y === 35))) K.set(x, y, HOLZ[3]);
      K.rect(69, 25, 22, 1, HOLZ[4]); K.rect(69, 44, 22, 1, HOLZ[1]);
      // Das Wasser: alles darunter trüb, grün von unten
      tauchen(K, (x, y) => y > wy(x), '#081410', .5, { tiefe: (x, y) => (y - wy(x)) / 60 });
      K.licht(80, 96, 50, GRUEN[0], .8, { maske: (x, y) => y > wy(x) + 1 });
      // Spiegelung der zwei Punkte und des Holzes
      K.spiegel(76, wy(76) + 2, wy(76) + 14, '#6a5028', 1);
      K.spiegel(83, wy(83) + 2, wy(83) + 14, '#6a5028', 1);
      wasserlinie(K, wy, 0, 160, ['#3a4a32', '#8ab890']);
      for (let i = 0; i < 6; i++) { const y0 = 4 + i * 6; for (let x = 0; x < 160; x++) { const y = Math.round(wy(x) + y0); if (y < 90 && Math.sin(x * .35 + i * 2) > .7) K.set(x, y, '#1e2a1e'); } }
      K.vignette(.75, { cx: 80, cy: 40 });
    },

    // Eine kleine, ruhige Flamme unter einer schrägen Wasserfläche, darüber treibende Seiten aus einem Gesangbuch.
    kapelle_kerze(K) {
      const { B } = K;
      const sy = x => 24 - x * .075;            // Wasserspiegel von unten gesehen, schräg
      // Luft über dem Wasser: dunkel
      K.feld(0, 0, 160, 30, WAND, (x, y) => y < sy(x) ? .12 + (B.fbm(x * .05, y * .1, K.seed, 2) - .5) * .1 : -1);
      // Wasser: trüb, nach unten dunkler
      K.feld(0, 0, 160, 90, WASSER, (x, y) => y >= sy(x) ? .42 - (y - sy(x)) / 140 + (B.fbm(x * .03, y * .06, K.seed + 3, 2) - .5) * .12 : -1);
      // Unterseite des Spiegels: helles, gewelltes Band
      for (let x = 0; x < 160; x++) for (let j = 0; j < 4; j++) { const y = Math.round(sy(x)) + j; const v = (1 - j / 4) * .9 + Math.sin(x * .4 + j) * .15; if (v > B.bay(x, y)) K.set(x, y, j === 0 ? '#3a4a36' : '#22281c'); }
      // Säulenbasen links und rechts im Wasser
      const saeulen = [];
      for (const [cx, w] of [[18, 9], [144, 8]]) {
        const s = K.maske(); s.rect(cx - w, 0, 2 * w, 72); s.rect(cx - w - 3, 64, 2 * w + 6, 4); s.rect(cx - w - 4, 68, 2 * w + 8, 5);
        K.form(s, .1, { k: STEIN.slice(0, 5), ton: 1.6, verlauf: -.4, fase: 1, rand: 0, muster: (x, y) => (Math.abs(x - cx) < w - 2 && (x - cx + 40) % 4 === 0 ? -.6 : 0) + (y === 64 || y === 68 ? -.8 : 0) });
        saeulen.push(s);
      }
      // Boden: Steinplatten in Aufsicht, deutlich gefugt
      K.feld(0, 68, 160, 90, ['#060705', '#0c0e0a', '#141710', '#1e2218', '#2a2e20', '#383a28', '#484632'], (x, y) => {
        const Z = 30 / (y - 58), X = (x - 80) / (y - 58) * 2, zi = Math.floor(Z * 2.6), xi = Math.floor(X + (zi & 1) * .5);
        const fz = Z * 2.6 - zi, fx = X + (zi & 1) * .5 - xi;
        let t = .55 + (B.hash(xi, zi, 5) - .5) * .2 - (90 - y) / 140;
        if (fz < .16 || fx < .07) t -= .4; else if (fz < .3) t += .08;
        return t;
      });
      // Treibende Seiten: zwei liegen flach am Spiegel, zwei sinken schräg
      const seite = (cx, cy, w, h, a, dunkel) => {
        const c = Math.cos(a), s = Math.sin(a), P = (u, v) => [cx + u * c - v * s, cy + u * s + v * c];
        const m = K.maske(); m.poly([P(-w / 2, -h / 2), P(w / 2, -h / 2 + 1), P(w / 2, h / 2), P(-w / 2 + 1, h / 2)]);
        K.form(m, 0, { k: PAPIER.slice(dunkel ? 0 : 1, dunkel ? 3 : 4), r: [PAPIER[2]], ton: 1.4, fase: 0, rand: 1, L: [0, 1], muster: (x, y) => { const dx = x + .5 - cx, dy = y + .5 - cy, v = -dx * s + dy * c, u = dx * c + dy * s; return (Math.abs(u) < w / 2 - 2 && Math.round(v + h / 2) % 3 === 1 && B.hash(Math.floor(u / 2), Math.round(v), 4) > .3) ? -1.2 : 0; } });
      };
      seite(42, sy(42) + 2.5, 22, 3, -.07, true);
      seite(116, sy(116) + 2.5, 18, 3, -.07, true);
      seite(64, 33, 16, 11, -.35, false);
      seite(98, 41, 13, 10, .45, false);
      // Leuchter mit Kerze, die Flamme steht gerade
      const l = K.maske(); l.rect(76, 79, 9, 2); l.poly([[77, 79], [80, 73], [81, 73], [84, 79]]); l.rect(80, 70, 1.4, 4); l.rect(77, 69, 7, 1.5);
      K.form(l, 0, { k: ['#060504', '#120d08', '#22180e', '#36261a'], ton: 1.6, fase: 0 });
      const kz = K.maske(); kz.rect(79, 59, 3, 10);
      K.form(kz, 0, { k: ['#4a4030', '#8a7a5a', '#c8b88e', '#ece0c0'], ton: 2.2, fase: 0, rand: 1, r: ['#fff0c0'], L: [0, -1] });
      K.set(80, 58, '#2a1a0a');
      // Um die Flamme ist das Wasser klar: hellerer, kühler Hof
      K.licht(80, 52, 22, '#16201a', .9);
      // Licht der Flamme: ein Fleck auf dem Boden um den Leuchter, Streiflicht an den Säulen
      K.licht(80, 80, 56, '#3a2810', 1, { oval: 2.6, exp: 1.2 });
      K.licht(80, 80, 26, '#4a3414', .9, { oval: 2.6 });
      for (const sm of saeulen) { K.licht(80, 58, 90, '#2a1c0c', .9, { maske: (x, y) => sm.has(x, y) }); K.kante(sm, 80, 56, 120, ['#6a4a20', '#c89a50'], { nah: .5, min: .2 }); }
      K.kante(l, 80, 56, 40, ['#6a4a20', '#c89a50'], { nah: .4, min: .1 });
      K.flamme(80, 58, { gross: 2, hof: 64, hofFarbe: '#5a3c14' });
      K.vignette(.5, { cx: 80, cy: 56 });
    },

    // Ein überfluteter Kirchenraum im grünen Licht von unten, eine Glocke unter der Oberfläche und Köpfe, die sich in den Bänken erheben.
    kapelle_glocke(K) {
      const { B } = K;
      const hz = 42;                            // Wasserspiegel trifft die Chorwand
      K.fuell(WAND, (x, y) => .26 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .2 - y / 300);
      // Chorwand: hohes Fenster in der Mitte, zwei Pfeiler
      const fe = K.maske(); spitzbogen(fe, 80, 8, 16, 44);
      K.form(fe, 0, { k: ['#060605', '#0b0a08', '#11100c', '#181610'], ton: 1.2, fase: 0, rand: 0, muster: (x, y) => (x === 80 || y === 28 ? -1 : 0) });
      for (const [x0, w] of [[0, 18], [142, 18]]) K.mauer(x0, 0, x0 + w, hz, WAND.slice(1, 6), { hoehe: 6, breite: 9, ton: .45 });
      // Wasser bis nach vorn, grün von unten durchleuchtet; Bankreihen als dunkle Bänder darunter
      const WG = ['#020604', '#040c08', '#07140d', '#0b1e13', '#10291a', '#163623', '#1e462d'];
      const reihen = [50, 58, 68, 82];
      K.feld(0, hz, 160, 90, WG, (x, y) => {
        const g = Math.max(0, 1 - Math.hypot((x - 80) / 95, (y - 74) / 40));
        let t = .18 + g * .82 + (Math.sin(y * 1.7 + B.rausch2(x * .06, y * .3, K.seed) * 6) > .8 ? .1 : 0);
        for (const ry of reihen) if (y >= ry && y < ry + 2 + (ry - hz) / 14 && Math.abs(x - 80) > 10 + (ry - hz) * .3) t -= .25;
        return t;
      });
      K.rect(0, hz, 160, 1, '#0e1a12');
      // Die Glocke unter der Oberfläche: dunkle Bronze vor dem Licht, der Mund leuchtet
      const gl = K.maske(), gx = 80, gt = 48, gb = 70;
      gl.fn(gx - 16, gt - 2, gx + 16, gb + 1, (x, y) => { const q = (y - gt) / (gb - gt); if (q < 0 || q > 1) return false; const w = 5 + 4 * Math.pow(q, .6) + Math.pow(q, 5) * 6; return Math.abs(x - gx) <= w; });
      gl.ell(gx, gt, 5, 2.6); gl.rect(gx - 1.5, gt - 5, 3, 4);
      K.licht(gx, gb + 3, 40, '#0e3a24', .9);
      K.form(gl, 0, { k: ['#020403', '#050a07', '#0a140e', '#102018'], ton: 1.3, verlauf: .5, fase: 0, rand: 0 });
      K.kante(gl, gx, gb + 4, 30, GRUENKANTE, { nah: .7 });
      const mund = K.maske(); mund.ell(gx, gb, 14, 2.4);
      K.form(mund, 0, { k: [GRUEN[1], GRUEN[2], GRUEN[3], GRUEN[4]], ton: 3, fase: 0, rand: 0, muster: (x) => -Math.abs(x - gx) / 5 });
      // Köpfe in den Bänken: hinten still, vorn erheben sie sich bis zur Schulter
      const koepfe = [[20, 50, .55, 0], [38, 50, .55, .2], [56, 50, .55, 0], [104, 50, .55, 0], [122, 50, .55, .3], [140, 50, .55, 0],
        [14, 58, .7, 0], [34, 58, .7, .5], [54, 58, .7, 0], [108, 58, .7, .2], [128, 58, .7, 0], [148, 58, .7, .6],
        [24, 68, .9, .8], [50, 68, .9, 0], [112, 68, .9, .6], [138, 68, .9, 0],
        [12, 82, 1.2, 1], [46, 82, 1.2, .3], [120, 82, 1.2, .9], [152, 82, 1.2, 0]];
      for (const [x, wl, s, hoch] of koepfe) {
        const m = K.maske(), kr = 3 * s, ky = wl - kr - .5 - hoch * 7 * s;
        m.ell(x, ky, kr, kr * 1.15);
        m.kap(x, ky + kr, x, wl, kr * .5, kr * .65);
        if (hoch > .25) m.ell(x, wl + 1, kr * 2.4, kr * (.5 + hoch * 1.1));
        K.form(m, 0, { k: ['#010201', '#030504', '#060a07', '#0a100c'], ton: .8, rand: 0, fase: 0 });
        // Ring auf dem Wasser um den Hals (nur die vordere Hälfte)
        for (let a = .3; a < 2.85; a += .14) K.set(x + Math.cos(a) * kr * 2.6, wl + .5 + Math.sin(a) * kr * .5, '#3a9a68');
      }
      K.vignette(.7, { cx: 80, cy: 62 });
    },

    // Ein steinernes Becken vor einem halb abgeblätterten Fresko, darin ein Gesicht, das nicht ganz deines ist.
    kapelle_taufe(K) {
      const { B } = K;
      // Fresko auf Putz: ein Heiliger mit Nimbus, rote Tunika, blauer Mantel, segnende Hand.
      // Wo der Putz abgeblättert ist, kommt der Ziegel durch.
      const putz = ['#100b07', '#1a120c', '#251a11', '#302217', '#3c2b1d'];
      const ab = (x, y) => B.fbm(x * .07, y * .09, K.seed + 7, 3) + (x - 70) / 260 + (y < 10 ? -.1 : 0) > .6 || Math.hypot((x - 81) / 6, (y - 16) / 5) + (B.hash(x, y, 2) - .5) * .4 < 1;
      K.fuell(putz, (x, y) => .5 + (B.fbm(x * .12, y * .12, K.seed, 2) - .5) * .25);
      // Rahmenband des Freskos
      K.feld(0, 0, 160, 90, ['#1e1208', '#2e1c0c', '#3e2812'], (x, y) => (Math.abs(x - 46) < 1.5 || Math.abs(x - 114) < 1.5) && y < 62 ? .6 : -1);
      const nimbus = (x, y) => { const d = Math.hypot(x - 80, y - 15); return d < 12.5 && d > 8.5; };
      K.feld(0, 0, 160, 90, ['#2a1c08', '#4a3210', '#6a4a18', '#8a6424'], (x, y) => nimbus(x, y) ? .6 + (Math.hypot(x - 80, y - 15) > 11.5 ? .25 : 0) : -1);
      K.feld(0, 0, 160, 90, ['#1e140c', '#33241a', '#4a3424', '#5e4430'], (x, y) => Math.hypot((x - 80) / 6, (y - 15) / 7.5) < 1 ? .55 - (x > 80 ? .15 : 0) : -1);
      K.feld(0, 0, 160, 90, ['#0c0806', '#1a120c', '#261a12'], (x, y) => Math.hypot((x - 80) / 7, (y - 10) / 4) < 1 && y < 12 ? .5 : -1);   // Haar
      K.set(77, 15, '#120c08'); K.set(83, 15, '#120c08'); K.set(80, 19, '#2a1a10');
      // Tunika und Mantel
      K.feld(0, 0, 160, 90, ['#1a0a08', '#2e120c', '#441c12', '#5a281a'], (x, y) => { if (y < 23 || y > 70) return -1; const w = 7 + (y - 23) * .45; return Math.abs(x - 80) < w ? .55 + (Math.sin((x - 80) * 1.1 + y * .05) > .7 ? -.3 : 0) : -1; });
      K.feld(0, 0, 160, 90, ['#0a0e12', '#121a20', '#1c262e', '#26323c'], (x, y) => { if (y < 24 || y > 70) return -1; const w = 7 + (y - 24) * .45; return (x - 80 > w * .15 && x - 80 < w) || (80 - x > w * .6 && 80 - x < w) ? .55 + (Math.sin(x * .9) > .7 ? -.25 : 0) : -1; });
      // Hände vor der Brust gefaltet
      K.feld(0, 0, 160, 90, ['#1e140c', '#33241a', '#4a3424', '#5e4430'], (x, y) => Math.hypot((x - 80) / 3, (y - 34) / 4) < 1 ? .55 : -1);
      // Abgeblätterte Stellen: Ziegel darunter, die Bruchkante heller
      K.mauer(0, 0, 160, 90, ['#0a0604', '#140c08', '#1e120c', '#2a1a10'], { hoehe: 4, breite: 8, ton: .5, maske: ab });
      for (let y = 0; y < 90; y++) for (let x = 0; x < 160; x++) if (!ab(x, y) && (ab(x + 1, y) || ab(x, y + 1))) K.set(x, y, '#4a3826');
      // Taufbecken: Schale, Schaft, Sockel
      const cx = 80, cy = 58, rx = 37, ry = 14;
      const fuss = K.maske(); fuss.poly([[60, 90], [65, 85], [95, 85], [100, 90]]); fuss.rect(71, 70, 18, 16);
      K.form(fuss, 0, { k: STEIN.slice(0, 4), ton: 1.4, verlauf: -.5, rand: 1, r: [STEIN[4]], muster: (x) => ((x - 71) % 6 === 0 ? -.6 : 0) });
      const schale = K.maske(); schale.fn(cx - rx, cy, cx + rx, cy + 20, (x, y) => { const q = (x - cx) / rx; return Math.abs(q) <= 1 && y <= cy + 3 + Math.sqrt(Math.max(0, 1 - q * q)) * 13; });
      K.form(schale, 0, { k: STEIN.slice(1, 5), ton: 1.6, verlauf: -.8, muster: (x) => (Math.round(x - cx) % 9 === 0 ? -.7 : 0), schatten: 2 });
      const rand = K.maske(); rand.ell(cx, cy, rx + 1, ry + 1);
      K.form(rand, 0, { k: STEIN.slice(2, 6), ton: 2, fase: 1 });
      // Wasser ohne Grund
      const ix = rx - 4, iy = ry - 3;
      const innen = (x, y) => Math.hypot((x + .5 - cx) / ix, (y + .5 - cy) / iy) < 1;
      K.feld(0, 0, 160, 90, ['#000000', '#020302', '#050705', '#0a0d0a'], (x, y) => innen(x, y) ? .4 - (y - cy) / 24 : -1);
      // Das Gesicht im Wasser: blass, älter als du, zufrieden. Länglich, mit Kinn und gelichtetem Haar,
      // jede Zeile vom Wellengang ein wenig verschoben.
      const fx = 80, fy = 58, off = 2;
      const wv = y => (y === 53 || y === 54 ? 1 : y === 61 || y === 62 ? -1 : 0);          // Versatz der Zeile durch die Wellen
      const S = (x, y, c) => { y += off; if (innen(x + wv(y), y)) K.set(x + wv(y), y, c); };
      const HAUT = ['#22201a', '#4a4436', '#7a7060', '#aea088', '#d8ccb0', '#ece2c8'];
      const breiteF = y => y < fy ? 7.2 * Math.sqrt(Math.max(0, 1 - ((fy - y) / 8.5) ** 2)) + .3 : 7.2 - (y - fy) * .55;
      K.feld(0, 0, 160, 90, HAUT, (x, y) => {
        if (!innen(x, y)) return -1;
        const xx = x - wv(y), w = breiteF(y); if (y < fy - 8 || y > fy + 8 || Math.abs(xx - fx) > w) return -1;
        const q = Math.abs(xx - fx) / Math.max(1, w);
        return .92 - q * .45 - Math.max(0, y - fy - 3) * .08 + (xx < fx - 2 ? -.1 : 0);
      });
      // Ohren
      for (const sx of [-1, 1]) { S(fx + sx * 8, fy - 1, HAUT[2]); S(fx + sx * 8, fy, HAUT[2]); S(fx + sx * 8, fy + 1, HAUT[1]); }
      // gelichtetes graues Haar: kahle Stirn, ein dünner Kranz an den Seiten
      for (let y = 47; y <= 55; y++) for (const sx of [-1, 1]) { const w = breiteF(y + off); for (let d = 0; d < 2; d++) S(Math.round(fx + sx * (w - d)), y, d ? '#5a5648' : '#8a8678'); }
      for (let x = fx - 3; x <= fx + 3; x++) S(x, 47 + (Math.abs(x - fx) > 1 ? 0 : -1), '#9a968a');
      const D = '#2a261e', F = '#6a6250';
      // Brauen, Augen halb zu, Krähenfüße, lange Nase, Nasolabialfalten, schmaler Mund, Kinnfalte
      for (const [x0, x1, y] of [[74, 77, 52], [83, 86, 52]]) for (let x = x0; x <= x1; x++) S(x, y, F);
      for (const [x0, x1] of [[75, 77], [83, 85]]) for (let x = x0; x <= x1; x++) S(x, 54, D);
      S(74, 53, F); S(86, 53, F); S(73, 55, F); S(87, 55, F);
      for (let y = 54; y <= 58; y++) S(80, y, F); S(79, 59, D); S(81, 59, D);
      S(77, 59, F); S(76, 60, F); S(83, 59, F); S(84, 60, F);
      for (let x = 78; x <= 82; x++) S(x, 61, D); S(77, 60, D); S(83, 60, D);
      for (let x = 79; x <= 81; x++) S(x, 63, F);
      // Wellenlinien quer durchs Wasser und übers Gesicht
      for (const wy of [49, 53, 60, 64, 67]) for (let x = 40; x < 122; x++) { const y = wy + Math.round(Math.sin(x * .3 + wy) * .7); if (innen(x, y) && Math.sin(x * .55 + wy * 2) > .35) { const p = K.get(x, y); K.set(x, y, B.mix(p >>> 24 ? B.unpk(p) : [0, 0, 0], '#9aa290', .35)); } }
      // Blasen im Takt eines Atems
      for (const [x, y] of [[93, 57], [95, 54], [92, 52]]) K.set(x, y, '#9aa290');
      K.licht(fx, fy, 34, '#2a2416', .8, { ohne: schale });
      K.vignette(.7, { cx: 80, cy: 48 });
    },

    // Ein helles Leinenbündel auf schwarzem Wasser vor einer halb versunkenen Kapellenwand, ein Seil führt vom Bündel ans Ufer zu deinen Füßen.
    kapelle_probe(K) {
      const { B } = K;
      const wl = 52;
      K.himmel(wl, HIMMEL, { steil: .5, gx: 120, gb: 50 });
      K.sterne(10, 18, [WAND[4], WAND[6]]);
      // Kapellenwand mit Giebel und Dachreiter, bis über die Fenster im Wasser
      const wand = K.maske(); wand.rect(14, 20, 132, 40); wand.poly([[10, 21], [80, 4], [150, 21]]); wand.rect(76, -2, 8, 8); wand.poly([[74, -1], [80, -8], [86, -1]]);
      K.form(wand, .1, { k: WAND.slice(1, 5), ton: 1.5, fase: 1, muster: (x, y) => { const fy = (y - 20) % 6, fx = (x + (Math.floor((y - 20) / 6) & 1) * 5) % 10; return (y > 20 && (fy === 0 || fx === 0)) ? -.7 : (B.hash(x >> 2, y >> 1, 3) - .5) * .4; } });
      for (const cx of [38, 80, 122]) { const f = K.maske(); spitzbogen(f, cx, 6, 34, 60); K.form(f, 0, { k: ['#000000', '#030202', '#060403', '#0a0705'], ton: .6, fase: 0, rand: 1, r: [WAND[4]] }); }
      // Das schwarze Wasser, die Wand spiegelt sich kaum
      K.feld(0, wl, 160, 90, WASSER, (x, y) => .08 + (Math.sin(y * 2.1 + B.rausch2(x * .07, y * .3, K.seed) * 5) > .82 ? .18 : 0));
      K.rect(14, wl, 132, 1, WAND[2]);
      // Ufer vorn: Schlick, darauf deine Stiefelspitzen
      const ufer = x => 79 + Math.sin(x * .05) * 2 - (x - 80) * .02;
      K.feld(0, 70, 160, 90, BODEN, (x, y) => y > ufer(x) ? .35 + (y - ufer(x)) / 30 + (B.hash(x, y, 2) < .1 ? .15 : 0) : -1);
      for (let x = 0; x < 160; x++) K.set(x, Math.round(ufer(x)), BODEN[4]);
      // Seil: vom Bündel übers Wasser, ans Ufer, zur Schlaufe vor den Stiefeln
      const seil = K.maske(); seil.pfad([[86, 62], [82, 68], [76, 74], [72, 80], [71, 84], [75, 86], [80, 85], [78, 83]], .7, .8);
      K.form(seil, 0, { k: ['#1a140c', '#3a2e1c', '#5a4a30', '#7a6644'], ton: 1.6, fase: 0, rand: 1, r: ['#a08a60'], muster: (x, y) => ((x + y) % 3 === 0 ? -.6 : 0) });
      // Stiefel am unteren Rand
      const st = K.maske(); st.ell(62, 92, 7, 5); st.ell(98, 92, 7, 5); st.rect(55, 89, 14, 4); st.rect(91, 89, 14, 4);
      K.form(st, 0, { k: ['#030202', '#080605', '#100c09', '#1a140e'], ton: 1.2, rand: 1, L: [0, -1] });
      // Das Leinenbündel: trocken, hell, verschnürt
      const bu = K.maske(), bx = 90, by = 59;
      bu.ell(bx, by, 9, 4.6); bu.ell(bx - 2, by - 3, 5.5, 3.2); bu.ell(bx + 1, by - 6, 2.2, 2); bu.kap(bx + 1, by - 7, bx + 4, by - 10, .8, .5);
      const LEINEN = ['#4a4438', '#7a7262', '#b0a690', '#dcd2bc', '#f4ecd8'];
      K.lichtquelle(120, 10);
      K.form(bu, 0, { k: LEINEN.slice(0, 4), r: [LEINEN[3], LEINEN[4]], ton: 2.4, verlauf: .4, muster: (x, y) => (Math.abs(x - bx + 1 + (y - by) * .3) < .6 || Math.abs(y - by + 1.5) < .5) ? -1.5 : (Math.sin(x * .9 + y * .4) > .7 ? -.5 : 0) });
      K.licht(bx, by, 20, '#1e1a12', .9, { ohne: bu });
      K.spiegel(bx, wl + 12, 76, '#5a5240', 3);
      for (let a = 0; a < 6.28; a += .2) { const px = bx + Math.cos(a) * 15, py = by + 4 + Math.sin(a) * 2.6; if (Math.sin(a) > 0) K.set(px, py, '#2a2820'); }
      K.vignette(.8, { cx: 84, cy: 52 });
    },

    // Ein Klingelbeutel an einer langen Stange über einer überfluteten Kirchenbank, das Glöckchen glänzt, der Halter ist nur ein Kragen im Dunkel.
    kapelle_kollekte(K) {
      const { B } = K;
      // Kirchenraum im Dunkel, rechts eine Wand mit Pfeiler; links unter der Empore Schwarz
      K.fuell(WAND, (x, y) => .22 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .2 + x / 600 - y / 400);
      K.mauer(124, 0, 160, 70, WAND.slice(1, 6), { hoehe: 6, breite: 10, ton: .4 });
      K.feld(0, 0, 160, 90, ['#000000', '#020101', '#040302'], (x, y) => x + y * .6 < 44 ? .2 + (x + y * .6) / 88 : -1);
      // Der Kragen: ein weißer, gestärkter Strich oben links im Dunkel, darüber nichts
      K.linie(8, 21, 13, 23, '#c8c0b0'); K.linie(13, 23, 19, 23, '#e8e2d4'); K.linie(19, 23, 23, 21, '#c8c0b0');
      K.linie(10, 22, 21, 22, '#3a3630'); K.set(16, 24, '#8a8478');
      // Überflutete Bank: die Kante der Rückenlehne knapp über dem Wasser, das Wasser darunter
      const wl = 81;
      const bank = K.maske(); bank.rect(-2, 73, 164, 3); bank.rect(-2, 76, 164, 5);
      K.lichtquelle(130, 10);
      K.form(bank, 0, { k: HOLZ, r: ['#6a4422', '#c08a48'], ton: 2.4, fase: 1, rand: 1, L: [0, -1], muster: (x, y) => (y === 76 ? -1 : 0) + ((x % 31) === 0 ? -.6 : 0) });
      K.feld(0, wl, 160, 90, WASSER, (x, y) => .14 + (y - wl) / 110 + (Math.sin(y * 2.1 + B.rausch2(x * .06, y * .3, K.seed) * 6) > .82 ? .2 : 0));
      // Spiegelung der Bankkante
      for (let x = 0; x < 160; x++) if (Math.sin(x * .7) > -.2) K.set(x, wl + 1 + (x % 5 === 0 ? 1 : 0), '#2e2014');
      // Die lange Stange: diagonal aus dem Dunkel
      const bx = 88, by = 24;
      const sg = K.maske(); sg.kap(-4, 2, bx - 9, by - 1, 1.6, 2.2);
      K.form(sg, 0, { k: HOLZ.concat(['#4a3420']), r: ['#6a4a24', '#c89a58'], ton: 3.4, verlauf: .5, fase: 0, rand: 2, L: [.4, -1] });
      K.linie(-4, .2, bx - 9, by - 3, '#7a5428'); K.linie(10, 3.6, bx - 12, by - 3.2, '#a07840', .7);
      // Messingring, an dem der Beutel hängt (Ellipse, hinten und vorn)
      const rx = 14, ry = 4;
      const rh = K.maske(); rh.ell(bx, by, rx, ry); rh.ell(bx, by, rx - 2, ry - 1.4, 0); rh.fn(bx - rx - 1, by - ry - 1, bx + rx + 1, by + ry + 1, (x, y) => y > by, 0);
      K.form(rh, 0, { k: MESSING.slice(0, 3), r: ['#c09040'], ton: 1.6, fase: 0, rand: 1 });
      // Der Samtbeutel: nass, schwer, in Falten, unten spitz zum Glöckchen
      K.licht(104, 46, 70, '#3a2410', .8);
      const bt = K.maske(); bt.fn(bx - rx - 2, by, bx + rx + 2, by + 34, (x, y) => { const q = (y - by) / 32; if (q < 0 || q > 1) return false; const w = rx * (1 + Math.sin(q * 2.6) * .18) * Math.pow(1 - q, .55); return Math.abs(x - bx - q * 1.5) <= w; });
      bt.ell(bx, by + 1, rx, ry);
      K.form(bt, 0, { k: ['#0e0303', '#1e0806', '#36100a', '#521c12', '#6e2a1a', '#8a3a24'], r: ['#9a4a30', '#e09070'], ton: 2.6, fase: 1, rand: 2, verlauf: .6, schatten: 2, L: [.6, -.8],
        muster: (x, y) => { const f = Math.sin((x - bx) * .75 + (y - by) * .12); return (f > .55 ? -1.2 : f < -.6 ? .6 : 0) + (B.hash(x, y, 3) < .05 ? .9 : 0); } });
      // Vorderer Ringbogen über dem Samt
      const rv = K.maske(); rv.ell(bx, by, rx, ry); rv.ell(bx, by, rx - 2, ry - 1.4, 0); rv.fn(bx - rx - 1, by - ry - 1, bx + rx + 1, by + ry + 1, (x, y) => y <= by, 0);
      K.form(rv, 0, { k: MESSING, r: WARMKANTE, ton: 2.4, fase: 0, rand: 2, L: [.6, -.8] });
      // Tropfen vom Samt ins Wasser
      for (const [x, y] of [[80, 56], [98, 60], [84, 66]]) K.set(x, y, '#5a2a1a');
      // Das Glöckchen am Zipfel: der Glanz im Bild
      const gx = bx + 1.5, gy = by + 33;
      K.licht(gx, gy + 3, 30, '#5a3a12', .9);
      const gl = K.maske(); gl.kap(gx, gy - 1, gx, gy + 1, .6, .6); gl.poly([[gx - 2.5, gy + 1], [gx + 2.5, gy + 1], [gx + 3.5, gy + 6], [gx + 5, gy + 8], [gx - 5, gy + 8], [gx - 3.5, gy + 6]]); gl.ell(gx, gy + 9, 1.2, 1.2);
      K.form(gl, 0, { k: MESSING, r: WARMKANTE, ton: 2.3, fase: 0, rand: 2, L: [.7, -.7] });
      K.set(gx + 2, gy + 2, '#fff0c0'); K.set(gx + 2, gy + 3, '#fff0c0'); K.set(gx + 3, gy + 5, '#ffd27a'); K.set(gx + 4, gy + 7, '#ffd27a');
      // Spiegelung von Glöckchen und Beutel im Wasser
      K.spiegel(gx, wl + 2, 89, '#6a4416', 2);
      K.spiegel(bx, wl + 3, 88, '#3a140c', 6);
      K.vignette(.65, { cx: 92, cy: 50 });
    },
  },
};
