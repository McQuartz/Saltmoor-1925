// Ereignisbilder 160 × 90 · Das Waisenhaus am Deich (data/biome/waisenhaus.json).
// Palette des Waisenhauses (prototype/js/scenes/world/waisenhaus.js): Kalk und Sturmgrau, Linoleum in dunklem
// Ocker, Eisen fast schwarz mit kaltem Randlicht; das einzige warme oder rote Licht ist jeweils die helle Stelle.
'use strict';

const KALK = ['#0b0c0e', '#131518', '#1b1e21', '#24282b', '#2f3336', '#3b3f42', '#494d4f', '#585b5c', '#6a6c6b', '#7f807d'];
const LINO = ['#0b0806', '#140f09', '#1d150c', '#271c10', '#332414', '#402d18', '#4f381d'];
const STURM = ['#1c232a', '#28313a', '#36424e', '#46525e', '#596673', '#6f7c88', '#8995a0', '#a6b0b8', '#c4ccd2'];
const EISEN = ['#060708', '#0c0e10', '#14171a', '#1d2125', '#282d32'];
const LEINEN = ['#1a1c1e', '#25282a', '#313436', '#3e4143', '#4d5051', '#5e6061', '#717272', '#8a8a86'];
const HOLZ = ['#0a0807', '#120e0b', '#1a1410', '#231b15', '#2e231b', '#3a2c22'];
const KIND = ['#060708', '#0d0f12', '#171a1f', '#252a31'];
const RAND = ['#7a8792', '#e2e8e6'], RAND_D = ['#4a535c', '#9aa4ac'];
const ROT = '#ff3b2b', ROTG = '#4a1210', NASS = '#2c3c48', NASS2 = '#3f5868';

// Kind im Nachthemd, von vorn oder seitlich: Kopf groß, nasses Haar, zwei rote Punkte
function kind(K, x, yb, h, o) {
  o = o || {}; const m = K.maske(), k = h / 30;
  m.poly([[x - 4 * k, yb], [x - 2.6 * k, yb - 15 * k], [x - 1.6 * k, yb - 19 * k], [x + 1.6 * k, yb - 19 * k], [x + 2.6 * k, yb - 15 * k], [x + 4 * k, yb]]);
  m.ell(x, yb - 23.5 * k, 3.8 * k, 4.2 * k);
  m.poly([[x - 3.8 * k, yb - 24 * k], [x + 3.8 * k, yb - 24 * k], [x + 4 * k, yb - 13 * k], [x - 4 * k, yb - 13 * k]]);
  K.form(m, o.tiefe || 0, { k: KIND, r: o.rand || RAND, ton: 1.3, fase: .8, rand: 1 });
  if (o.augen !== false && h >= 10) { K.set(x - 1.5 * k, yb - 23 * k, ROT); K.set(x + 1.5 * k, yb - 23 * k, '#8a1a12'); }
  return m;
}
// Fußabdruck-Paar (nass) auf dem Boden
function fuesse(K, x, y, s, col) { for (const dx of [-1.6 * s, 1.6 * s]) { const m = K.maske(); m.ell(x + dx, y, 1 * s, .55 * s); for (let yy = m.y0; yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) if (m.has(xx, yy)) K.set(xx, yy, (xx + yy) & 1 ? col || NASS : NASS2); } }
// Nummernschild (Email): helles Rechteck mit zwei dunklen Strichen
function schild(K, x, y, w, h) { K.rect(x, y, w, h, LEINEN[6]); K.rect(x, y + h - 1, w, 1, LEINEN[4]); if (w >= 4) { K.set(x + Math.round(w * .3), y + Math.floor(h / 2), EISEN[1]); K.set(x + Math.round(w * .65), y + Math.floor(h / 2), EISEN[1]); } }

module.exports = {
  biom: 'waisenhaus',
  bilder: {
    // Ein langer Schlafsaal mit zwei Reihen Eisenbetten, darüber kleine helle Schilder; an der Stirnwand Schilder ohne Betten bis unter die Decke, ein hohes Fenster mit Sturmlicht.
    waisenhaus_schlafsaal(K) {
      const { B } = K, vx = 70, vy = 40;
      // Wände und Decke als Tunnel, Stirnwand hinten
      K.fuell(KALK, (x, y) => { const dx = x - vx, dy = y - vy; if (Math.abs(dx) < 22 && dy > -16 && dy < 16) return .5; if (dy < -16 && Math.abs(dx) < -dy * 1.4) return .12; return dx < 0 ? .42 - Math.abs(dx) / 400 : .28; });
      // Stirnwand: Schilder in Reihen bis unter die Decke, darunter kein Bett
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) schild(K, vx - 20 + c * 7, vy - 14 + r * 6, 4, 3);
      // drei Kinder stehen dort, wo keine Betten sind
      for (const dx of [-8, 0, 8]) kind(K, vx + dx, vy + 16, 10, { tiefe: .3 });
      // hohes Fenster rechts: die helle Stelle (Sturmgrau)
      const f = K.maske(); f.poly([[124, 6], [150, 0], [150, 46], [124, 42]]);
      K.feld(124, 0, 150, 47, STURM, (x, y) => f.has(x, y) ? .7 - y / 120 + (B.fbm(x * .1, y * .05, 3, 2) - .5) * .3 : -1);
      K.linie(137, 3, 137, 44, EISEN[2]); K.linie(124, 24, 150, 22, EISEN[2]);
      // Boden: Linoleum
      K.feld(0, vy + 16, 160, 90, LINO, (x, y) => .2 + (y - vy) / 120 + (x > 100 && x < 150 && y > 60 && y < 80 ? .25 : 0));
      // Betten links und rechts, nach hinten kleiner: dunkler Kasten, Eisengestell, helles Kissen mit nassem Fleck
      const bett = (x, yb, s, links) => {
        const m = K.maske(); m.rect(x - 12 * s, yb - 7 * s, 24 * s, 5 * s); K.form(m, 0, { k: EISEN.concat(['#2e343b']), r: RAND_D, ton: 2.6, fase: 1, rand: 1 });
        const g = K.maske(); g.rect(links ? x - 13 * s : x + 11 * s, yb - 13 * s, 1.5 * s, 13 * s); g.rect(links ? x + 11 * s : x - 13 * s, yb - 9 * s, 1.5 * s, 9 * s); g.rect(links ? x - 13 * s : x + 11 * s, yb - 13 * s, 3 * s, 1.2 * s);
        K.form(g, 0, { k: EISEN, r: RAND, ton: 2.4, fase: 0, rand: 1 });
        const kx = links ? x - 8 * s : x + 8 * s; const ki = K.maske(); ki.ell(kx, yb - 8 * s, 3.4 * s, 1.6 * s); K.form(ki, 0, { k: LEINEN, ton: 5, fase: 1, rand: 0 });
        K.set(kx, yb - 8 * s, NASS); K.set(kx + 1, yb - 8 * s, NASS2);
      };
      for (const [x, yb, s] of [[46, 60, .55], [30, 70, .8], [8, 86, 1.15]]) bett(x, yb, s, true);
      for (const [x, yb, s] of [[94, 60, .55], [112, 70, .8], [138, 86, 1.15]]) bett(x, yb, s, false);
      K.vignette(.5);
    },
    // Ein langer Flur mit einer Reihe kleiner Gestalten im Nachthemd, nach hinten kleiner, am Ende eine Lücke; vorn eine Schwester mit Liste unter einer Lampe.
    waisenhaus_reihe(K) {
      const { B } = K;
      K.fuell(KALK, (x, y) => .32 - y / 400 + (B.fbm(x * .04, y * .04, 5, 2) - .5) * .06);
      K.rect(0, 54, 160, 1, KALK[5]);
      K.feld(0, 55, 160, 64, KALK, (x, y) => .15);
      K.feld(0, 64, 160, 90, LINO, (x, y) => .25 + (y - 64) / 70);
      // Lampe links oben: die helle Stelle
      K.lichtquelle(30, 14);
      K.licht(30, 30, 46, '#8a6a3a', .6);
      const l = K.maske(); l.rect(29, 0, 1, 9); l.poly([[24, 13], [27, 9], [33, 9], [36, 13]]); K.form(l, 0, { k: EISEN, r: RAND, ton: 2, fase: 0, rand: 1 });
      K.rect(28, 13, 4, 2, '#ffe8b0'); K.set(30, 15, '#fff6e0');
      // die Reihe: Kinder nach rechts hinten kleiner, am Ende eine Lücke mit nassen Füßen
      const reihe = [[58, 74, 22], [72, 72, 20], [85, 70, 18], [97, 69, 17], [108, 68, 15], [118, 67, 14], [136, 65, 12]];
      reihe.forEach(([x, yb, h]) => kind(K, x, yb, h, { tiefe: (74 - yb) * .03 }));
      fuesse(K, 127, 66.5, 1);
      // Schwester mit Liste, im Lampenlicht
      const s = K.figurMaske(30, 80, 46, { kopf: 'tuch', arme: [[22, 52], [24, 56]], ellbogen: [[24, 48], [27, 50]] });
      K.form(s, 0, { k: KIND, r: ['#8a7a5a', '#ffe0a8'], ton: 1.2, fase: 1, rand: 2 });
      K.kante(s, 30, 14, 40, ['#8a7a5a', '#ffe0a8']);
      const liste = K.maske(); liste.rect(18, 50, 6, 8); K.form(liste, 0, { k: LEINEN.slice(3), ton: 3, rand: 0 });
      K.vignette(.55);
    },
    // Ein Regal mit vielen Fächern, darin gefaltete helle Wäsche, unter jedem Fach ein dunkler Fleck auf dem Boden; an der Tür ein Zettel.
    waisenhaus_waesche(K) {
      const { B } = K;
      K.fuell(KALK, (x, y) => .22 + (B.fbm(x * .04, y * .04, 7, 2) - .5) * .06);
      K.feld(0, 76, 160, 90, LINO, (x, y) => .25 + (y - 76) / 40);
      // Regal
      const r = K.maske(); r.rect(14, 6, 104, 70); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) r.rect(18 + i * 25, 10 + j * 22, 21, 18, 0);
      K.form(r, 0, { k: HOLZ, r: RAND_D, ton: 2.6, fase: 1, rand: 2 });
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
        K.feld(18 + i * 25, 10 + j * 22, 39 + i * 25, 28 + j * 22, KALK, () => .05);
        for (let k = 0; k < 3; k++) { const w = K.maske(); w.rect(20 + i * 25, 22 + j * 22 - k * 4, 17, 4); K.form(w, 0, { k: LEINEN, r: RAND, ton: 3.4 + (i === 1 && j === 1 ? .8 : 0), fase: 1, rand: 1 }); K.set(34 + i * 25, 23 + j * 22 - k * 4, '#8a2018'); }
        K.set(26 + i * 25 + (j % 2), 28 + j * 22, NASS2);
      }
      // nasse Flecken unter jedem Fach
      for (let i = 0; i < 4; i++) { const m = K.maske(); m.ell(28 + i * 25, 82, 8, 2); for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) if (m.has(x, y)) K.set(x, y, (x + y) & 1 ? NASS : NASS2); }
      // Tür rechts mit dem Zettel: die helle Stelle
      const t = K.maske(); t.rect(126, 4, 30, 74); K.form(t, 0, { k: HOLZ, r: RAND_D, ton: 2, fase: 1, rand: 1 });
      K.rect(134, 26, 12, 15, '#c8c0a8'); K.rect(134, 40, 12, 1, '#8a8470');
      K.schrift(136, 29, 144, '#4a4438'); K.schrift(136, 32, 145, '#4a4438'); K.schrift(136, 35, 142, '#4a4438');
      K.licht(140, 33, 30, '#6a6a60', .5);
      K.vignette(.5);
    },
    // Ein hohes Sprossenfenster, dahinter Sturmgrau und die Linie des Deichs, darauf eine Reihe kleiner dunkler Gestalten; auf der Fensterbank innen Wasser.
    waisenhaus_deich(K) {
      const { B } = K;
      K.fuell(KALK, (x, y) => .2 + Math.max(0, .2 - Math.abs(x - 80) / 300));
      // Fenster: die helle Stelle
      const f = K.maske(); f.rect(44, 6, 72, 66);
      K.feld(44, 6, 116, 72, STURM, (x, y) => .82 - (y - 6) / 110 + (B.fbm(x * .06, y * .03, 9, 3) - .5) * .35);
      // Deich draußen
      for (let x = 44; x < 116; x++) { const yd = 56 + Math.round(Math.sin(x * .06) * 1.2); for (let y = yd; y < 72; y++) K.set(x, y, STURM[y > yd + 2 ? 0 : 1]); }
      for (let i = 0; i < 13; i++) { const x = 48 + i * 5.3, yd = 56 + Math.round(Math.sin(x * .06) * 1.2); K.rect(x, yd - 5, 2, 5, STURM[0]); K.rect(x, yd - 7, 2, 2, STURM[0]); }
      // Regen
      for (let i = 0; i < 40; i++) { const x = 44 + K.r.i(0, 71), y = 6 + K.r.i(0, 50); K.set(x, y, STURM[8]); K.set(x, y + 1, STURM[6]); }
      // Sprossen und Laibung
      const sp = K.maske(); sp.rect(79, 6, 2, 66); sp.rect(44, 30, 72, 2); sp.rect(44, 51, 72, 2); K.form(sp, 0, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
      const lb = K.maske(); lb.rect(38, 0, 84, 78); lb.rect(44, 6, 72, 66, 0); K.form(lb, 0, { k: KALK.slice(2), r: RAND, ton: 4, fase: 2, rand: 2 });
      const bank = K.maske(); bank.rect(34, 72, 92, 5); K.form(bank, 0, { k: KALK.slice(3), r: RAND, ton: 5, fase: 1, rand: 2 });
      for (let x = 40; x < 120; x++) if ((x * 7) % 5 < 2) K.set(x, 72, NASS2);
      for (const x of [52, 77, 103]) { K.set(x, 78, NASS2); K.set(x, 81, NASS); K.set(x, 85, NASS2); }
      K.feld(0, 78, 160, 90, KALK, () => .1);
      K.vignette(.45);
    },
    // Ein hoher Turnsaal mit Sprossenwand und zwei hängenden Ringen, auf dem Boden Reihen gezeichneter Fußpaare, auf einigen nasse Abdrücke, die glänzen.
    waisenhaus_turnsaal(K) {
      const { B } = K;
      K.fuell(KALK, (x, y) => .25 - y / 300);
      // Oberlicht rechts oben: die helle Stelle
      K.feld(112, 2, 156, 16, STURM, (x, y) => .8 - (y - 2) / 60 + (B.fbm(x * .08, y * .1, 4, 2) - .5) * .25);
      for (const x of [122, 133, 144]) K.linie(x, 2, x, 16, EISEN[2]);
      K.kegel(134, 16, 2.3, .3, 70, '#2a3440', .5);
      // Sprossenwand hinten
      const sw = K.maske(); for (let i = 0; i < 8; i++) sw.rect(14 + i * 9, 14, 2, 38); for (let j = 0; j < 9; j++) sw.rect(14, 16 + j * 4, 65, 1);
      K.form(sw, .2, { k: HOLZ, r: RAND_D, ton: 3, fase: 0, rand: 1 });
      // Dielen
      K.feld(0, 52, 160, 90, LINO, (x, y) => .3 + (y - 52) / 80 + ((Math.round((x - 80) / ((y - 30) / 8))) % 2 ? .04 : 0));
      // gezeichnete Fußpaare in Reihen (Kreide), einige mit nassen Abdrücken
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
        const s = .8 + r * .35, y = 60 + r * 9, x = 20 + c * (22 + r * 2) - r * 4;
        for (const dx of [-1.8 * s, 1.8 * s]) { const m = K.maske(); m.ell(x + dx, y, 1.3 * s, .8 * s); m.ell(x + dx, y, .6 * s, .3 * s, 0); for (let yy = m.y0; yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) if (m.has(xx, yy)) K.set(xx, yy, KALK[7]); }
        if ((r * 6 + c) % 3 !== 1) fuesse(K, x, y, s * .9);
      }
      // zwei Ringe an Seilen vorn
      for (const x of [62, 82]) { const m = K.maske(); m.rect(x, -1, 1, 34); m.ell(x, 38, 5, 5); m.ell(x, 38, 3.4, 3.4, 0); K.form(m, 0, { k: HOLZ, r: RAND, ton: 3.4, fase: 0, rand: 2 }); }
      K.vignette(.5);
    },
    // Eine hohe Tür im dunklen Flur, darüber eine kleine Lampe in rotem Glas, das einzige Licht; davor auf dem Linoleum ein langer Schatten.
    waisenhaus_nachtlicht(K) {
      const { B } = K;
      K.fuell(KALK, (x, y) => .14 - y / 600);
      K.feld(0, 70, 160, 90, LINO, (x, y) => .12 + (y - 70) / 80);
      // Tür
      const t = K.maske(); t.rect(64, 20, 32, 50); K.form(t, 0, { k: HOLZ, r: ['#6a2018', '#c04a30'], ton: 1.8, fase: 1, rand: 1, lichtVon: [80, 12] });
      const lb = K.maske(); lb.rect(60, 16, 40, 54); lb.rect(64, 20, 32, 50, 0); K.form(lb, 0, { k: KALK.slice(1), r: ['#6a2018', '#c04a30'], ton: 3, fase: 1, rand: 2, lichtVon: [80, 12] });
      K.linie(80, 22, 80, 68, HOLZ[0]); K.rect(91, 46, 2, 3, '#4a3a20');
      // das Nachtlicht: rote Lampe, die helle Stelle
      const l = K.maske(); l.rect(76, 6, 8, 5); l.rect(79, 2, 2, 4); K.form(l, 0, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
      K.rect(77, 11, 6, 3, '#a8180e'); K.rect(78, 11, 4, 2, ROT); K.set(79, 11, '#ff9a80');
      K.licht(80, 14, 60, '#5a0c08', .9, { oval: 1.2 });
      K.gluehen(80, 13, 14, '#3a0806', .9);
      // langer Schatten auf dem Linoleum, von der Tür nach vorn, der nicht ganz menschlich ist
      const s = K.maske(); s.poly([[74, 70], [86, 70], [104, 90], [52, 90]]); s.ell(78, 89, 8, 3);
      for (let y = s.y0; y <= s.y1; y++) for (let x = s.x0; x <= s.x1; x++) if (s.has(x, y)) K.set(x, y, KALK[0]);
      K.vignette(.4);
    },
  },
};
