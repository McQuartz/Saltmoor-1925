// Ereignisbilder 160 × 90 · Hafen (data/events.json mit biom "hafen" und hafen_plus.json).
// Palette des Hafens (prototype/js/scenes/world/hafen.js): Nachtblau, kaltes Randlicht, Gaslicht warm.
'use strict';

const HIMMEL = ['#04060b', '#070b14', '#0b1220', '#111b2e', '#19273d', '#22344c', '#2e4460'];
const WASSER = ['#04070b', '#080e16', '#0d1622', '#142134', '#1d2e46', '#2a405c'];
const STEIN = ['#06080b', '#0b1016', '#121a24', '#1a2532', '#243243', '#2e4058'];
const HOLZ = ['#0a0c0e', '#151a1f', '#212a32', '#2f3c48'];
const NASS = ['#4a6a8a', '#cfe6ff'];
const WARMKANTE = ['#8a5a20', '#ffd27a'];
const NEBEL = ['#16202e', '#22304a', '#30425c', '#40546e'];

module.exports = {
  biom: 'hafen',
  bilder: {
    // Eine gebeugte Gestalt unter einer Gaslaterne, das Netz läuft von ihren Händen über die Kaikante ins schwarze Wasser.
    hafen_netze(K) {
      const { B } = K;
      K.himmel(50, HIMMEL, { gx: 130, gb: 50 });
      K.sterne(14, 30);
      K.wasser(50, 90, WASSER, { horizont: .35 });
      // Kai von der Seite: Oberfläche bei y 61, Mauer bis x 104, rechts das schwarze Wasser
      const kante = 104;
      K.mauer(0, 64, kante, 90, STEIN.slice(0, 5), { hoehe: 6, breite: 12, ton: .32, tf: (x, y) => -(y - 64) / 60 });
      const ob = K.maske(); ob.rect(0, 61, kante + 1, 3); K.form(ob, 0, { k: STEIN.slice(1, 5), ton: 2, L: [0, -1] });
      K.feld(kante + 1, 64, 160, 90, WASSER, (x, y) => .05 + (Math.sin(y * 1.9 + x * .1) > .85 ? .15 : 0));
      // Die Netzflickerin: gebeugt, Kopftuch, Hände vorn am Netz
      const frau = K.figurMaske(56, 61, 44, { kopf: 'tuch', buckel: .9, neig: 5, blick: 1, kopfDreh: 2, arme: [[76, 46], [74, 49]], ellbogen: [[70, 50], [68, 53]], weit: 1.25 });
      K.form(frau, 0, { ton: .8, rand: 1 });
      // Netz: aus ihren Händen, als Haufen auf dem Kai, über die Kante und hinab ins Wasser
      const nm = { k: ['#121210', '#28261e', '#464232', '#665f48'], r: ['#8a7a50', '#e8d8a0'], ton: 2.1, rand: 1 };
      K.netz([[74, 45], [79, 44], [90, 52], [102, 57], [108, 60], [114, 66], [118, 78], [122, 90], [104, 90], [104, 64], [96, 62], [82, 62], [76, 54]], 0, { weite: 3, mat: nm });
      K.netz([[72, 62], [78, 57], [92, 56], [104, 58], [106, 62]], 0, { weite: 3, mat: Object.assign({}, nm, { ton: 1.7 }) });
      // Gaslaterne hinter ihr
      K.gaslaterne(40, 61, 52, { hof: 70, ohne: frau });
      K.kante(frau, 40, 16, 64, WARMKANTE, { nah: .6 });
      K.vignette(.7, { cx: 76 });
    },

    // Ein leerer Kutter im Nebel, an Deck eine brennende Laterne und eine offene Luke, aus der es silbern glitzert.
    hafen_kutter(K) {
      const { B } = K;
      K.fuell(['#141c28', '#1a2434', '#202c3e', '#283648'], (x, y) => .25 + (1 - y / 90) * .45 + (B.fbm(x * .015, y * .05, K.seed, 2) - .5) * .2);
      K.wasser(64, 90, WASSER, { horizont: .5, basis: .2 });
      K.nebel(56, 72, .3, NEBEL[1]);
      const k = K.kutter(80, 74, 1.4, 0, { mast: 34 });
      // Offene Luke, aus der es silbern glitzert
      const lx = 68, ly = Math.round(k.deck);
      const luke = K.maske(); luke.rect(lx - 1, ly - 3, 13, 3); K.form(luke, 0, { ton: 1.6, fase: 0 });
      K.rect(lx + 1, ly - 2, 9, 2, '#000000');
      const fr = B.rng(9);
      for (let i = 0; i < 18; i++) { const x = lx + 1 + fr.f(0, 9), y = ly - 2 - Math.pow(fr(), 1.6) * 7; K.set(x, y, fr() < .45 ? '#e8f0f8' : '#9ab0cc'); }
      K.licht(lx + 5, ly - 3, 12, '#1e3044', .9);
      // Laterne an Deck, am Mast
      K.laterne(97, ly, 1.25, { hof: 42 });
      K.spiegel(97, 76, 90, '#6a4416', 2);
      // Nebel vor dem Rumpf
      K.nebel(70, 90, .25, NEBEL[0]);
      K.vignette(.6, { cx: 84 });
    },

    // Eine Laterne unter nassen Bohlen, ein Mantel, der sich an der falschen Stelle wölbt, und eine offene Kiste voll Stroh.
    hafen_steg(K) {
      const { B } = K;
      K.fuell(['#04060a', '#070a10', '#0b1018', '#101722'], (x, y) => .3 + (B.fbm(x * .04, y * .05, K.seed, 2) - .5) * .2);
      K.wasser(72, 90, WASSER, { horizont: .2, basis: .25 });
      // Bohlen oben, von unten gesehen, mit Spalten
      K.bretter(0, 0, 160, 14, HOLZ, { senkrecht: true, breite: 9, ton: .5 });
      const balken = K.maske(); balken.rect(0, 13, 160, 4); K.form(balken, 0, { k: HOLZ, ton: 1.4, L: [0, 1], rand: 1 });
      // Pfähle: dunkel, nur ein schmaler Glanz der Nässe
      for (const px of [12, 132]) { const p = K.maske(); p.rect(px - 3, 17, 6, 73); K.form(p, 0, { k: HOLZ, ton: 1.1, rand: 1, r: ['#1d2e46', '#2a405c'], muster: (x, y) => (B.hash(x, y >> 2, 3) - .5) * .4 }); }
      for (const [x, y] of [[40, 22], [92, 30], [118, 19], [74, 44]]) { K.set(x, y, NASS[0]); K.set(x, y + 1, NASS[1]); }
      // Der Mann: Hut, Gesicht im Schatten, der Mantel wölbt sich hinten an der Hüfte, als wäre da noch ein Arm
      const mann = K.figurMaske(100, 84, 54, { kopf: 'hut', blick: -1, kopfDreh: -1, wulst: [111, 62, 5, 7], arme: [[89, 67], [108, 72]], ellbogen: [[91, 59], null] });
      mann.ell(114, 56, 3, 4);
      K.form(mann, 0, { ton: .85, rand: 1, muster: (x, y) => (Math.hypot(x - 111, y - 61) < 7 && ((x - y) % 3 === 0) ? .7 : 0) });
      // Offene Kiste voll Stroh links vorne
      const ki = K.maske(); ki.rect(26, 74, 30, 14); K.form(ki, 0, { k: ['#0e0c09', '#1e1912', '#30281c', '#4a3c2a'], ton: 1.8, schatten: 2, muster: (x, y) => (y === 80 ? -.8 : 0) });
      const deckel = K.maske(); deckel.poly([[26, 74], [22, 62], [50, 60], [56, 74]]); K.form(deckel, 0, { k: ['#0e0c09', '#1e1912', '#30281c', '#4a3c2a'], ton: 1.2 });
      const halme = B.rng(4);
      for (let i = 0; i < 50; i++) { const x = 27 + halme() * 28, y = 74 - halme() * 3, a = -Math.PI / 2 + halme.j(1.1), l = 2 + halme() * 4; K.linie(x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, halme() < .5 ? '#b09048' : '#6a5428'); }
      // Laterne am Boden zwischen beiden
      K.laterne(70, 82, 1.3, { hof: 56, ohne: mann });
      K.kante(mann, 70, 74, 40, WARMKANTE);
      K.vignette(.75, { cx: 76 });
    },

    // Ein Lichtkegel, der von oben schräg in eine enge Gasse fällt, und darin ein einzelner, langer Schatten.
    hafen_lichtkegel(K) {
      const { B } = K;
      K.himmel(30, HIMMEL, { steil: .6 });
      K.pflaster(46, 90, STEIN, { vx: 80, ton: .28 });
      // Wände links und rechts in Flucht
      const L = K.maske(); L.poly([[0, 0], [62, 18], [62, 50], [0, 90]]);
      const R = K.maske(); R.poly([[160, 0], [98, 18], [98, 50], [160, 90]]);
      const ziegel = (x, y) => ((y % 4 === 0) ? -.5 : 0) + (B.hash(x >> 2, y >> 2, 6) - .5) * .3;
      K.form(L, 0, { k: STEIN.slice(0, 4), ton: .9, verlauf: -.3, muster: ziegel, rand: 1 });
      K.form(R, 0, { k: STEIN.slice(0, 4), ton: 1.2, verlauf: -.3, muster: ziegel, rand: 1 });
      for (const [x, y] of [[20, 26], [20, 50], [132, 30], [134, 54]]) { const f = K.maske(); f.rect(x, y, 7, 10); K.form(f, 0, { k: STEIN.slice(0, 4), ton: 0, rand: 0, fase: 0 }); }
      // Der Kegel: von oben rechts schräg auf das Pflaster, gedithert in zwei Stufen
      const fx = 82, fy = 74;
      for (let y = 0; y < fy + 4; y++) for (let x = 0; x < 160; x++) {
        const t = y / fy, cx = B.lerp(124, fx, t), w = B.lerp(4, 15, t);
        const d = Math.abs(x - cx) / w; if (d > 1) continue;
        const v = (1 - d * d) * (.35 + .45 * t), b = B.bay(x, y);
        if (v > b + .3) K.e.add(x, y, [96, 90, 60], 1); else if (v > b) K.e.add(x, y, [48, 45, 30], 1);
      }
      // Heller Fleck am Boden
      for (let y = fy - 6; y <= fy + 6; y++) for (let x = fx - 18; x <= fx + 18; x++) { const q = Math.hypot((x - fx) / 17, (y - fy) / 5.5); if (q >= 1) continue; const v = 1 - q; K.set(x, y, v > .6 ? '#e8d8a0' : v > .3 ? '#a89860' : v * 2 > B.bay(x, y) ? '#6a6040' : '#3a3628'); }
      // Die Gestalt im Licht, der Schatten lang nach vorn links
      for (let i = 0; i < 40; i++) { const q = i / 40, x = fx - 2 - q * 34, y = fy + 1 + q * 16, w = 1.6 + q * 2.4; for (let k = -w; k <= w; k++) K.set(x + k, y, '#06080b'); }
      const fig = K.figurMaske(fx, fy + 1, 22, { kopf: 'hut', blick: 1 });
      K.form(fig, 0, { ton: .6, rand: 1, L: [.6, -.8], r: ['#e8d8a0', '#fff0c0'] });
      K.vignette(.7);
    },

    // Eine Leiter an der nassen Kaimauer, eine straffe Leine über der Kante, im Wasser darunter ein runder Glanz wie von einem Helm.
    hafen_leiter(K) {
      const { B } = K;
      K.himmel(10, HIMMEL, { steil: .6, basis: .3 });
      K.mauer(0, 12, 160, 66, STEIN.slice(0, 5), { hoehe: 7, breite: 15, ton: .38, tf: (x, y) => (y > 50 ? -.12 : 0) + (B.fbm(x * .05, y * .1, K.seed, 2) - .5) * .2 });
      const kante = K.maske(); kante.rect(0, 10, 160, 3); K.form(kante, 0, { k: STEIN.slice(1, 5), ton: 2.2, L: [0, -1] });
      // Nässe: dunkle Laufspuren, unten Tang
      K.feld(0, 54, 160, 66, ['#05070a', '#0a0e14', '#101722'], (x, y) => (y > 58 + Math.sin(x * .3) * 2) ? .4 : -1);
      // schwarzes Wasser mit heller Linie an der Mauer
      K.feld(0, 66, 160, 90, ['#020306', '#04070b', '#080e16'], (x, y) => .2 + (Math.sin(y * 2.1 + Math.sin(x * .07) * 3) > .8 ? .5 : 0));
      for (let x = 0; x < 160; x++) if (Math.sin(x * .4) > -.4) K.set(x, 66, x % 7 < 4 ? '#2a405c' : '#1d2e46');
      // Eiserne Leiter, die im Wasser verschwindet
      const lx = 50, le = K.maske(); le.rect(lx - 6, 6, 2, 64); le.rect(lx + 5, 6, 2, 64);
      for (let y = 15; y < 68; y += 7) le.rect(lx - 5, y, 11, 1.5);
      le.kap(lx - 5, 6, lx - 5, 2, .9, .9); le.kap(lx + 6, 6, lx + 6, 2, .9, .9); le.kap(lx - 5, 2, lx + 6, 2, .9, .9);
      K.form(le, 0, { k: ['#08090b', '#12151a', '#1e232a', '#2c333c'], ton: 1.6, fase: 0, rand: 1 });
      for (let y = 68; y < 84; y += 2) { K.set(lx - 5, y, '#1d2e46'); K.set(lx + 6, y, '#1d2e46'); }
      // Poller mit der Leine, straff über die Kante und senkrecht ins Wasser
      const po = K.maske(); po.rect(100, 2, 8, 8); po.ell(104, 2, 5, 2); K.form(po, 0, { k: STEIN.slice(1, 5), ton: 1.4 });
      K.linie(106, 6, 112, 11, '#a08a60'); K.linie(112, 11, 112, 68, '#a08a60'); K.linie(113, 12, 113, 68, '#3a3226');
      // Unter Wasser: ein runder Glanz, ein Helm mit Fenster
      const hx = 112, hy = 80;
      const helm = K.maske(); helm.ell(hx, hy, 10, 9);
      K.form(helm, 0, { k: ['#05080c', '#0a1018', '#121c28', '#1a2838'], r: ['#4a6a8a', '#cfe6ff'], ton: 1.6, L: [-.3, -1], rand: 2 });
      for (let y = hy - 9; y <= hy - 3; y++) for (let x = hx - 8; x <= hx + 3; x++) { const q = Math.hypot((x - hx + 2) / 6, (y - hy + 5) / 3); if (q < 1 && (1 - q) * 1.6 > B.bay(x, y)) K.set(x, y, (1 - q) > .55 ? '#cfe6ff' : '#4a6a8a'); }
      const fe = K.maske(); fe.ell(hx - 3, hy + 2, 3.6, 3.6); K.form(fe, 0, { k: ['#1a1408', '#3a2c12', '#6a5424', '#9a8040'], r: ['#c8a860', '#f0d898'], ton: 2.4, fase: 0, rand: 1 });
      const gl = K.maske(); gl.ell(hx - 3, hy + 2, 2.2, 2.2); K.form(gl, 0, { k: ['#000000', '#000000', '#020304', '#05070a'], ton: 0, rand: 0, fase: 0 });
      K.licht(hx, hy - 3, 22, '#1e3044', .8, { maske: (x, y) => y > 66 });
      // Wasser über dem Helm: ein paar Wellenlinien quer darüber
      for (const yy of [74, 79, 85]) for (let x = hx - 11; x <= hx + 11; x++) if (Math.sin(x * .7 + yy) > .2) K.set(x, yy, '#04070b');
      K.vignette(.8, { cx: 96, cy: 52 });
    },

    // Ein aufgeschlagenes, gewelltes Logbuch an einem Nagel über der Werkbank, ein Bleistift auf dem Sims, durchs Fenster der Kai bei Nacht.
    hafen_logbuch(K) {
      const { B } = K;
      // Bretterwand innen
      K.bretter(0, 0, 160, 90, ['#05070a', '#0a0e14', '#10161e', '#18202a', '#202a36'], { senkrecht: true, breite: 10, ton: .35 });
      // Fenster rechts: draußen der Kai bei Nacht, eine Gaslaterne
      const fx0 = 104, fy0 = 10, fx1 = 148, fy1 = 52;
      K.feld(fx0, fy0, fx1, fy1, HIMMEL, (x, y) => (y - fy0) / (fy1 - fy0) * .7 + .1);
      K.feld(fx0, 36, fx1, fy1, WASSER, (x, y) => .3 + (Math.sin(y * 2) > .7 ? .2 : 0));
      K.feld(fx0, 42, fx1, fy1, STEIN, (x, y) => y > 42 + (x - fx0) * .12 ? .3 : -1);
      const pol = K.maske(); pol.rect(112, 40, 4, 5); pol.ell(114, 40, 3, 1.2); K.form(pol, .2, { ton: 1, rand: 1 });
      K.set(134, 26, '#fff0c0'); K.set(134, 27, '#ffd27a'); K.licht(134, 27, 9, '#6a4416', .9, { maske: (x, y) => x >= fx0 && x < fx1 && y >= fy0 && y < fy1 });
      for (let y = 28; y < 42; y++) K.set(134, y, '#0a0e14');
      K.spiegel(134, 37, 44, '#a07a3a', 1.2, (x, y) => x >= fx0 && x < fx1);
      const rahmen = K.maske(); rahmen.rect(fx0 - 3, fy0 - 3, fx1 - fx0 + 6, fy1 - fy0 + 6); rahmen.rect(fx0, fy0, fx1 - fx0, fy1 - fy0, 0); rahmen.rect(125, fy0, 2, fy1 - fy0); rahmen.rect(fx0, 30, fx1 - fx0, 2);
      K.form(rahmen, 0, { k: HOLZ, ton: 1.6, L: [-1, 0] });
      // Sims mit Bleistift
      const sims = K.maske(); sims.rect(fx0 - 6, fy1 + 3, fx1 - fx0 + 12, 3); K.form(sims, 0, { k: HOLZ, ton: 1.8, L: [0, -1] });
      K.linie(112, fy1 + 2, 124, fy1 + 1, '#a08040'); K.set(125, fy1 + 1, '#2a2a2a'); K.set(111, fy1 + 2, '#d8c8a0');
      // Licht vom Fenster in den Raum
      K.licht(126, 40, 70, '#14202e', .9, { maske: (x, y) => !(x >= fx0 && x < fx1 && y >= fy0 && y < fy1) });
      // Werkbank unten
      const wb = K.maske(); wb.rect(0, 70, 160, 5); wb.rect(6, 75, 5, 15); wb.rect(92, 75, 5, 15);
      K.form(wb, 0, { k: HOLZ, ton: 1.7, L: [.6, -.8], schatten: 2 });
      // Schraubstock, Hobel, eine Dose Nägel auf der Bank
      const wz = K.maske(); wz.rect(14, 62, 10, 8); wz.rect(12, 60, 14, 3); wz.kap(26, 64, 32, 64, .8, .8);
      wz.poly([[60, 70], [62, 65], [76, 65], [79, 70]]); wz.kap(66, 65, 69, 62, 1, 1);
      wz.rect(118, 63, 8, 7); wz.ell(122, 63, 4, 1.4);
      K.form(wz, 0, { k: ['#08090b', '#12151a', '#1e232a', '#2c333c'], ton: 1.5, fase: 0, rand: 1, L: [.8, -.6], schatten: 1 });
      // Logbuch am Nagel: zwei gewellte Seiten, Schnur
      K.set(56, 12, '#8a9aaa'); K.linie(56, 12, 46, 20, '#3a3226'); K.linie(56, 12, 66, 20, '#3a3226');
      const PAPIER = ['#1a1c1e', '#36383a', '#5e605e', '#8e8c84'];
      const buch = K.maske();
      buch.poly([[30, 22], [44, 19], [56, 22], [56, 58], [44, 56], [30, 60]]);
      buch.poly([[56, 22], [68, 19], [82, 21], [82, 60], [68, 56], [56, 58]]);
      K.form(buch, 0, { k: PAPIER, r: ['#7a8a9a', '#cfe6ff'], ton: 2.3, L: [1, -.2], muster: (x, y) => Math.sin(y * .5 + x * .15) * .35 + (Math.abs(x - 56) < 1 ? -1.2 : 0) });
      for (let i = 0; i < 9; i++) { K.schrift(34, 26 + i * 3 + Math.round(Math.sin(i) * .5), 53, '#24262a', { min: 1, max: 4 }); if (i < 6) K.schrift(59, 25 + i * 3, 79, '#24262a', { min: 1, max: 4 }); }
      // die leere Zeile und der Strich, wo der Satz abbricht
      K.schrift(59, 43, 68, '#24262a', { min: 2, max: 3 });
      K.vignette(.75, { cx: 90 });
    },
  },
};
