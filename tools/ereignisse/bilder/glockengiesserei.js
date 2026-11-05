// Ereignisbilder 160 × 90 · Glockengießerei (data/biome/glockengiesserei.json).
// Palette der Gießerei (prototype/js/scenes/world/glockengiesserei.js): Ziegel und Lehm fast schwarz,
// Bronze, Randlicht rot, die Glut der Rinnen und des Ofens als einzige helle Stelle.
'use strict';

const ZIEGEL = ['#060304', '#0c0607', '#130a0a', '#1b0e0d', '#251411', '#311a15', '#3f2119', '#52291d'];
const LEHM = ['#050404', '#0a0807', '#110e0c', '#181411', '#201a16', '#2a221c', '#352b23', '#433629'];
const GLUT = ['#2a0806', '#4e100a', '#7e1a0e', '#b02c14', '#da4a1c', '#ff6a24', '#ff9a40', '#ffd36a', '#fffbe6'];
const BRONZE = ['#0a0606', '#140c0a', '#20140f', '#2e1d16', '#40291e', '#563828', '#714a34', '#a87a52'];
const HOLZ = ['#060404', '#0d0908', '#150f0c', '#1f1611', '#2a1e17', '#382820'];
const MANTEL = ['#0d0a08', '#18120e', '#241b14', '#31251b', '#403023', '#52402e'];
const HAUT = ['#150c0a', '#241510', '#352018', '#482c20', '#5e3a2a'];
const KALT = ['#0e1216', '#161c22', '#202a34', '#2e3c4a', '#43566a', '#62788e'];
const RAND_B = ['#a8322a', '#ff9e6e'], RAND_H = ['#7a2a1e', '#d8805a'];
const PAPIER = ['#2a1e16', '#4e3a2a', '#7a6248', '#a88c6a', '#ccb28c', '#e8d4b0'];
const WACHS = ['#2a1a0c', '#4a3216', '#7a5826', '#b08a40', '#dcb868', '#f4dca0'];

// Glockenprofil wie im Hintergrund: halbe Breite (Anteil am Randradius) über der Höhe
const PROFIL = [[0, 0.5], [0.04, 0.6], [0.12, 0.66], [0.35, 0.68], [0.55, 0.73], [0.7, 0.81], [0.82, 0.91], [0.92, 0.99], [0.98, 1.02], [1, 1]];
const breite = q => { for (let i = 1; i < PROFIL.length; i++) if (q <= PROFIL[i][0]) { const [q0, w0] = PROFIL[i - 1], [q1, w1] = PROFIL[i]; return w0 + (w1 - w0) * (q - q0) / (q1 - q0 || 1); } return 1; };
// Glocke: cx, Haube yt, Höhe h, Randradius R; o.umgedreht: Mund nach oben (yt ist dann der Mund)
function glocke(K, cx, yt, h, R, o) {
  o = o || {}; const { B } = K, um = !!o.umgedreht;
  const qv = y => um ? 1 - (y - yt) / h : (y - yt) / h;
  const m = K.maske(); m.fn(cx - R - 2, yt - 1, cx + R + 2, yt + h + 1, (x, y) => { const q = qv(y); if (q < 0 || q > 1) return false; return Math.abs(x - cx) <= breite(q) * R; });
  const kr = Math.max(1, R * .14);
  if (!um) { m.rect(cx - R * .3, yt - kr, R * .6, kr + 1); if (o.haken !== false) m.rect(cx - .5, yt - kr - (o.haken || 4), Math.max(1, R * .06), o.haken || 4); }
  else m.rect(cx - R * .3, yt + h - 1, R * .6, kr + 1);
  const rib = [.13, .17, .8, .85];
  K.form(m, o.tiefe || 0, { k: BRONZE.slice(0, o.dunkel ? 5 : 7), r: RAND_B, ton: o.ton || 1.5, fase: Math.max(1, R * .06), rand: 2, schatten: 2, verlauf: um ? -.4 : .4, L: o.L,
    muster: (x, y) => { const q = qv(y), sn = (x - cx) / (breite(Math.max(0, q)) * R || 1); let t = 0;
      for (const l of rib) { const d = (q - l) * h; if (Math.abs(d) < .6) t -= 1.6; else if (Math.abs(d + 1.1) < .6) t += .8; }
      if (sn > .25 && sn < .48) t += .7; else if (sn > .55 && sn < .65) t += 1.5; else if (sn < -.4) t -= .6;
      return t; } });
  return { m, mund: um ? yt : yt + h };
}
// Zwei nackte Füße, die unter dem Glockenrand hängen (Zehen nach unten); tritt: Gehbewegung (0..1)
function fuesse(K, cx, my, R, o) {
  o = o || {}; const s = Math.max(.6, R / 13), fm = K.maske(), tr = o.tritt || 0;
  const paar = [[-.24, 1, tr], [.2, .92, -tr]];
  for (const [dx, l, t] of paar) {
    const fx = cx + dx * R, top = my - 1, kn = my + 5 * s * l, an = kn + 4 * s * l + t * -2 * s, ax = fx + t * 4 * s;
    fm.kap(fx, top, fx + t * 2 * s, kn, 1.3 * s, 1.1 * s);
    fm.kap(fx + t * 2 * s, kn, ax, an, 1.1 * s, .9 * s);
    // Fuß: Ferse hinten, Zehen nach unten-vorn
    fm.poly([[ax - 1.3 * s, an - 1 * s], [ax + 1.6 * s, an - 1 * s], [ax + 1.8 * s, an + 1.4 * s], [ax - .4 * s, an + 4.6 * s + t * s], [ax - 2.4 * s, an + 4.8 * s + t * s], [ax - 2.2 * s, an + 2.6 * s]]);
  }
  K.form(fm, o.tiefe || 0, { k: HAUT, r: RAND_H, ton: 2.2, fase: .8, rand: 1, schatten: 1, verlauf: -.6, L: [0, 1] });
  // Licht von unten auf den Sohlen
  for (let y = fm.y0; y <= fm.y1; y++) for (let x = fm.x0; x <= fm.x1; x++) if (fm.has(x, y) && !fm.has(x, y + 1)) K.set(x, y, o.sohle || GLUT[2]);
  return fm;
}
// Glühende Rinne im Lehmboden: Punkte entlang einer Linie, Kern hell, Ränder dunkler
function rinne(K, pts, breit, o) {
  o = o || {}; const { B } = K, m = K.maske(); m.pfad(pts, breit, breit * (o.ende || .8));
  for (const p of pts) void p;
  K.form(m, 0, { k: [GLUT[2], GLUT[3], GLUT[4], GLUT[5], GLUT[6], GLUT[7]], ton: o.ton || 3.2, fase: 0, rand: 0, muster: (x, y, d) => Math.min(1.6, d * .6) - 1.2 + (B.hash(x >> 1, y, 4) - .5) * .6 });
  return m;
}
// Ziegelwand: Lagen und Fugen, sehr dunkel
function ziegelwand(K, x0, y0, x1, y1, o) { o = o || {}; K.mauer(x0, y0, x1, y1, ZIEGEL.slice(0, 6), Object.assign({ hoehe: 4, breite: 9, ton: .45 }, o)); }

module.exports = {
  biom: 'glockengiesserei',
  bilder: {
    // Eine runde Grube im Lehmboden, darin eine bienenkorbförmige Form mit Eisenbändern, aus der Fuge oben ein dünner Rauch.
    glockengiesserei_grube(K) {
      const { B } = K;
      ziegelwand(K, 0, 0, 160, 44, { tf: (x, y) => -y / 200 });
      // Ofenbogen fern rechts: schwache Glut
      const ob = K.maske(); ob.fn(130, 14, 152, 44, (x, y) => Math.abs(x - 141) < 8 && (y > 24 || Math.hypot(x - 141, y - 24) < 8));
      K.form(ob, 0, { k: [GLUT[0], GLUT[0], GLUT[1], GLUT[2]], ton: 1.6, verlauf: -1, fase: 0, rand: 0 });
      K.licht(141, 40, 26, '#2a0806', .7);
      // Lehmboden
      K.feld(0, 44, 160, 90, LEHM, (x, y) => .3 + (y - 44) / 90 + (B.hash(x, y >> 1, 3) < .1 ? .15 : 0) + (B.fbm(x * .05, y * .1, K.seed, 2) - .5) * .2);
      K.rect(0, 44, 160, 1, LEHM[5]);
      // Die Grube: Ring aus festgestampftem Lehm, innen schwarz, unten ein roter Schein der Wärme
      const cx = 74, cy = 70, rx = 46, ry = 13;
      const ring = K.maske(); ring.ell(cx, cy, rx + 3, ry + 2);
      K.form(ring, 0, { k: LEHM.slice(2, 8), r: RAND_H, ton: 2.4, fase: 1, rand: 1, L: [.4, -1] });
      K.feld(0, 0, 160, 90, ['#000000', '#050101', '#0e0303', '#1a0605', '#2a0806'], (x, y) => Math.hypot((x - cx) / rx, (y - cy) / ry) < 1 ? .2 + Math.max(0, (y - cy + ry) / (2 * ry)) * .6 : -1);
      // Die Form: Bienenkorb aus Lehm, mannshoch, mit Eisenbändern
      const bx = 74, bt = 20, bb = 78, bw = 23;
      const bk = K.maske(); bk.fn(bx - bw - 1, bt, bx + bw + 1, bb, (x, y) => { const q = (y - bt) / (bb - bt); return Math.abs(x - bx) <= bw * Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, q * 1.25)) ** 2)) * (1 - q * .06); });
      K.lichtquelle(141, 30);
      K.form(bk, 0, { k: MANTEL, r: RAND_H, ton: 2.4, fase: 1.5, rand: 2, schatten: 2, verlauf: .2,
        muster: (x, y) => (B.hash(x >> 1, y >> 1, 9) - .5) * .8 + ((y - bb) > -12 ? -((y - bb + 12) / 12) * .8 : 0) });
      for (const by of [38, 52, 64]) {
        const q = (by - bt) / (bb - bt), w = bw * Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, q * 1.25)) ** 2)) * (1 - q * .06);
        const band = K.maske(); band.fn(bx - w - 1, by - 1, bx + w + 1, by + 1, (x, y) => Math.abs(x - bx) <= w + .5 && Math.abs(y - by - Math.sqrt(Math.max(0, 1 - ((x - bx) / (w + .5)) ** 2)) * 1.5) < 1);
        K.form(band, 0, { k: KALT.slice(0, 4), r: [KALT[4], KALT[5]], ton: 2, fase: 0, rand: 1 });
      }
      // Vorderrand der Grube vor dem Fuß der Form
      const vr = K.maske(); vr.fn(cx - rx - 3, cy, cx + rx + 3, cy + ry + 3, (x, y) => { const a = Math.hypot((x - cx) / (rx + 3), (y - cy) / (ry + 2)), b = Math.hypot((x - cx) / rx, (y - cy) / ry); return a < 1 && b >= 1 && y > cy; });
      K.form(vr, 0, { k: LEHM.slice(2, 8), r: RAND_H, ton: 2.4, fase: 1, rand: 1, L: [.4, -1] });
      // Das Datum in Wachs auf dem Mantel: kleine helle Zeichen
      for (const [x, y] of [[66, 45], [67, 45], [69, 45], [70, 44], [72, 45], [74, 45], [75, 44], [77, 45], [79, 45]]) K.set(x, y, WACHS[2]);
      // Fuge oben: ein Glutstrich, daraus ein dünner Rauch
      K.rect(bx - 3, bt + 1, 6, 1, GLUT[5]); K.set(bx - 1, bt + 1, GLUT[7]); K.set(bx, bt + 1, GLUT[8]); K.set(bx + 1, bt + 1, GLUT[7]);
      K.licht(bx, bt + 2, 10, '#4a1408', .9);
      for (let y = bt - 1; y > 1; y--) {
        const q = (bt - y) / bt, x = bx + Math.sin(y * .25) * (1 + q * 5) + q * 6;
        K.set(x, y, q < .35 ? '#7a6660' : q < .7 ? '#5a4a46' : '#3a302e');
        if (q > .3 && B.bay(x + 1, y) < .5) K.set(x + 1, y, '#3a302e');
      }
      K.vignette(.7, { cx: 76, cy: 50 });
    },

    // Ein aufgeschlagenes Folio auf einem Amboss, Spalten in brauner Tinte, die letzte Zeile frisch.
    glockengiesserei_giessbuch(K) {
      const { B } = K;
      ziegelwand(K, 0, 0, 160, 66, { tf: (x, y) => -y / 300 - x / 900 });
      K.feld(0, 66, 160, 90, LEHM, (x, y) => .3 + (y - 66) / 50 + (B.hash(x, y >> 1, 3) < .1 ? .15 : 0));
      K.rect(0, 66, 160, 1, LEHM[5]);
      // Glut von links (Ofen außerhalb des Bildes)
      K.lichtquelle(-20, 40);
      K.licht(-10, 50, 110, '#3a0c06', .9);
      // Amboss: Bahn, Horn nach links, Fuß, Klotz
      const am = K.maske();
      am.poly([[34, 50], [126, 50], [126, 56], [110, 58], [104, 66], [56, 66], [50, 58], [34, 56]]);
      am.poly([[34, 50], [34, 56], [14, 54], [8, 52.5], [14, 51]]);
      am.poly([[60, 66], [100, 66], [106, 74], [54, 74]]);
      am.rect(46, 74, 68, 16);
      K.form(am, 0, { k: ['#060606', '#0e0d0e', '#181618', '#242024', '#322c30'], r: RAND_B, ton: 1.8, fase: 1, rand: 2, schatten: 2, muster: (x, y) => (y >= 74 ? -.6 + ((x * 3 + y) % 7 === 0 ? -.4 : 0) : 0) });
      // Das Folio: zwei Seiten, liegt auf der Bahn
      const sl = K.maske(); sl.poly([[38, 50], [42, 20], [62, 18], [80, 22], [80, 52], [60, 49]]);
      const sr = K.maske(); sr.poly([[81, 52], [81, 22], [100, 18], [120, 20], [124, 50], [101, 49]]);
      K.form(sl, 0, { k: PAPIER.slice(1, 6), r: [PAPIER[5]], ton: 3.2, fase: 0, rand: 1, muster: (x, y) => (B.hash(x, y, 8) - .5) * .3 - (x > 75 ? (x - 75) * .35 : 0) + (x - 60) / 40 });
      K.form(sr, 0, { k: PAPIER.slice(0, 5), r: [PAPIER[4]], ton: 2.8, fase: 0, rand: 1, muster: (x, y) => (B.hash(x, y, 8) - .5) * .3 - (x < 86 ? (86 - x) * .35 : 0) - (x - 100) / 40 });
      // Spalten (Gewicht, Gemeinde, Ton, Klöppel) und Zeilen in brauner Tinte
      const TINTE = '#4a2a16';
      for (const x of [52, 64, 70]) K.linie(x, 24, x, 47, '#6a4a30');
      for (const x of [92, 104, 110]) K.linie(x, 24, x, 48, '#5a3e28');
      for (let i = 0; i < 8; i++) {
        const y = 24 + i * 3;
        K.schrift(45, y, 51, TINTE, { min: 1, max: 3 }); K.schrift(54, y, 63, TINTE, { min: 1, max: 3 }); K.set(66, y, TINTE); K.set(67, y, TINTE); K.schrift(72, y, 78, TINTE, { min: 2, max: 4 });
        K.schrift(84, y, 91, TINTE, { min: 1, max: 3 }); K.schrift(94, y, 103, TINTE, { min: 1, max: 3 }); K.set(106, y, TINTE); K.schrift(112, y, 119, TINTE, { min: 2, max: 4 });
      }
      // Die letzte Zeile: nur das Gewicht, frisch, schwarz glänzend
      const ly = 24 + 8 * 3;
      K.rect(84, ly, 2, 1, '#050304'); K.rect(87, ly, 3, 1, '#050304'); K.set(85, ly - 1, '#8a6a4a'); K.set(88, ly - 1, '#a08060');
      K.licht(86, ly, 8, '#2a1a10', .5);
      K.vignette(.75, { cx: 70, cy: 40 });
    },

    // Eine Glocke an einem dunklen Balken, darunter zwei hängende nackte Füße über einem glühenden Rinnsal.
    glockengiesserei_stille(K) {
      const { B } = K;
      ziegelwand(K, 0, 0, 160, 72, { ton: .32, tf: (x, y) => -y / 300 });
      K.feld(0, 72, 160, 90, LEHM, (x, y) => .3 + (y - 72) / 40 + (B.hash(x, y >> 1, 3) < .1 ? .12 : 0));
      // Das glühende Rinnsal quer über den Boden, unter den Füßen am hellsten
      const rs = [[0, 83], [26, 81], [52, 83], [80, 82], [104, 84], [132, 82], [160, 83]];
      K.licht(80, 82, 90, '#3a0c06', .9, { oval: 1.4 });
      K.licht(80, 80, 34, '#5a1a0a', .8, { oval: 1.2 });
      rinne(K, rs, 1.1, { ende: 1, ton: 2.6 });
      K.feld(70, 80, 92, 86, GLUT.slice(4, 9), (x, y) => { const m = Math.abs(y - 82.5 + (x - 80) * .04) < 1.1; return m ? 1.2 - Math.abs(x - 81) / 9 : -1; });
      // Balken oben, die Glocke tief daran
      const bal = K.maske(); bal.rect(-2, 2, 164, 8);
      K.lichtquelle(80, 84);
      K.form(bal, 0, { k: HOLZ, r: RAND_H, ton: 3, fase: 1, rand: 1, L: [0, 1], muster: (x, y) => (B.rausch2(x * .05, y * .8, 3) - .5) * .8 });
      const bh = K.maske(); bh.rect(78, 10, 4, 6); K.form(bh, 0, { k: KALT.slice(0, 4), ton: 1.6, fase: 0, rand: 1, r: [KALT[4]] });
      const gl = glocke(K, 80, 20, 38, 23, { haken: 3, L: [0, 1], ton: 1.8 });
      K.kante(gl.m, 80, 84, 70, RAND_B, { nah: .5, min: .05 });
      // Der Mund der Glocke: innen dunkel, unten ein roter Saum vom Rinnsal
      for (let x = 58; x <= 102; x++) if (gl.m.has(x, gl.mund - 1)) K.set(x, gl.mund - 1, Math.abs(x - 80) < 18 ? GLUT[2] : GLUT[1]);
      // Die Füße unter dem Rand: nackt, still, von unten warm beleuchtet
      const fm = fuesse(K, 80, gl.mund, 26, { sohle: GLUT[5] });
      K.kante(fm, 80, 84, 40, ['#d8805a', '#ffb08a'], { nah: .5, min: 0 });
      K.vignette(.5, { cx: 80, cy: 52 });
    },

    // Ein Holzkasten mit Fächern voll kleiner Wachsbuchstaben, daneben ein Lehmband mit angedrückter Schrift und einer Lücke.
    glockengiesserei_wachs(K) {
      const { B } = K;
      // Werkbank in Aufsicht, schräg
      K.bretter(0, 0, 160, 90, HOLZ.concat(['#4a3428']), { breite: 9, ton: .32, tf: (x, y) => -Math.hypot(x - 100, y - 30) / 300 });
      K.lichtquelle(150, -10);
      K.licht(150, 0, 120, '#3a1408', .8);
      // Setzkasten: Rahmen und Fächer, darin Wachsbuchstaben
      const kx = 8, ky = 10, kw = 72, kh = 70, nx = 6, ny = 5, fw = kw / nx, fh = kh / ny;
      const rahmen = K.maske(); rahmen.rect(kx - 3, ky - 3, kw + 6, kh + 6);
      K.form(rahmen, 0, { k: HOLZ.slice(1), r: RAND_H, ton: 2.6, fase: 1, rand: 2, schatten: 3 });
      const tr = B.rng(21);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const x0 = Math.round(kx + i * fw + 1), y0 = Math.round(ky + j * fh + 1), x1 = Math.round(kx + (i + 1) * fw - 1), y1 = Math.round(ky + (j + 1) * fh - 1);
        K.feld(x0, y0, x1, y1, ['#050303', '#0a0605', '#120a08', '#1a100c'], (x, y) => .3 + (y - y0) / 40 - (x - x0) / 60);
        K.rect(x0, y0, x1 - x0, 1, HOLZ[0]); K.rect(x0, y0, 1, y1 - y0, HOLZ[0]);
        // Buchstaben: kleine Striche und Bögen aus Wachs, haufenweise
        const n = tr.i(5, 11);
        for (let k = 0; k < n; k++) {
          const x = tr.f(x0 + 2, x1 - 3), y = tr.f(y0 + 2, y1 - 3), art = tr.i(0, 3), c = tr() < .4 ? WACHS[4] : WACHS[3];
          if (art === 0) { K.set(x, y, c); K.set(x, y + 1, c); K.set(x, y + 2, WACHS[2]); }
          else if (art === 1) { K.set(x, y, c); K.set(x + 1, y, c); K.set(x, y + 1, c); K.set(x + 1, y + 2, WACHS[2]); }
          else if (art === 2) { K.set(x, y, c); K.set(x + 1, y + 1, c); K.set(x + 2, y, WACHS[2]); }
          else { K.set(x, y, c); K.set(x + 1, y, WACHS[2]); K.set(x + 1, y + 1, c); K.set(x, y + 2, c); }
        }
      }
      for (let i = 1; i < nx; i++) K.rect(Math.round(kx + i * fw) - 1, ky, 2, kh, HOLZ[4]);
      for (let j = 1; j < ny; j++) K.rect(kx, Math.round(ky + j * fh) - 1, kw, 2, HOLZ[4]);
      // Das Lehmband: gebogen wie das Schriftband einer Glocke, die Buchstaben eingedrückt, mitten eine Lücke
      const bx = 88, bt = 32;
      const band = K.maske(); band.fn(84, 20, 160, 70, (x, y) => { const c = bt + ((x - 122) / 38) ** 2 * 10; return y > c && y < c + 22; });
      K.form(band, 0, { k: LEHM.slice(3), r: RAND_H, ton: 2.6, fase: 1.5, rand: 2, schatten: 3, muster: (x, y) => (B.hash(x >> 1, y >> 1, 9) - .5) * .6 });
      const zeile = x => bt + ((x - 122) / 38) ** 2 * 10 + 8;
      const luecke = [114, 133];
      for (let x = bx + 2; x < 158; x += 4) {
        if (x >= luecke[0] && x < luecke[1]) continue;
        const y = Math.round(zeile(x)), f = Math.floor(B.hash(x, 3, 7) * 4);
        const P = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [2, 0], [1, 4], [2, 4], [2, 2], [1, 2], [2, 1], [2, 3]].filter((p, i) => i < 5 || B.hash(x, i, f) > .45);
        for (const [dx, dy] of P) { K.set(x + dx, y + dy, WACHS[3]); if (dy === 4) K.set(x + dx, y + dy + 1, LEHM[2]); }
      }
      // Die Lücke: glatter Lehm, genau so lang wie ein Name, eine feine Kante
      K.licht((luecke[0] + luecke[1]) / 2, zeile(123) + 2, 16, '#3a1a0c', .9);
      for (let x = luecke[0]; x < luecke[1]; x++) { K.set(x, Math.round(zeile(x)) - 1, LEHM[7]); K.set(x, Math.round(zeile(x)) + 6, LEHM[1]); }
      K.vignette(.7, { cx: 90, cy: 44 });
    },

    // Fünf Glocken mit dem Mund nach oben auf dem Lehmboden, in einer ein Meißel, der aufrecht steckt.
    glockengiesserei_stimmen(K) {
      const { B } = K;
      ziegelwand(K, 0, 0, 160, 50, { tf: (x, y) => -y / 200 });
      // Ofen hinten: ein glühender Bogen, dahinter die Glut
      const ob = K.maske(); ob.fn(66, 22, 94, 50, (x, y) => Math.abs(x - 80) < 9 && (y > 32 || Math.hypot(x - 80, y - 32) < 9));
      K.form(ob, 0, { k: GLUT.slice(1, 6), ton: 2.6, verlauf: -1.6, fase: 0, rand: 0, muster: (x, y) => -Math.abs(x - 80) / 9 });
      K.licht(80, 44, 70, '#4a1208', .9);
      K.feld(0, 50, 160, 90, LEHM, (x, y) => .35 + (y - 50) / 70 + (B.hash(x, y >> 1, 3) < .1 ? .15 : 0) + Math.max(0, 1 - Math.hypot((x - 80) / 50, (y - 52) / 10)) * .3);
      K.rect(0, 50, 160, 1, LEHM[6]);
      // Fünf Glocken, der Größe nach, Mund nach oben
      K.lichtquelle(80, 30);
      const reihe = [[12, 7], [35, 9], [63, 11], [96, 13.5], [134, 16]];
      let fuenfte;
      // umgedreht: unten die runde Haube, in der Mitte die Taille, oben der ausgestellte Schlag
      const prof = q => q < .2 ? .5 + Math.sqrt(q / .2) * .14 : q < .55 ? .64 + (q - .2) * .1 : .675 + Math.pow((q - .55) / .45, 2.2) * .45;
      reihe.forEach(([cx, R], i) => {
        const h = R * 1.35, fy = 84 - i, yt = fy - h;
        const m = K.maske(); m.fn(cx - R * 1.2, yt - 1, cx + R * 1.2, fy + 2, (x, y) => { const q = 1 - (y - yt) / h; if (q < -.02 || q > 1) return false; return Math.abs(x - cx) <= prof(Math.max(0, q)) * R; });
        m.ell(cx, fy - 1, R * .5, R * .16);
        K.form(m, 0, { k: BRONZE, r: RAND_B, ton: 3, fase: Math.max(1, R * .06), rand: 2, schatten: 2, verlauf: -1.2, L: [(80 - cx) / 90, -1],
          muster: (x, y) => { const q = 1 - (y - yt) / h, sn = (x - cx) / (prof(Math.max(0, q)) * R || 1); let t = 0;
            for (const l of [.12, .16, .82, .87]) { const d = (q - l) * h; if (Math.abs(d) < .6) t -= 1.6; else if (Math.abs(d - 1.1) < .6) t += .8; }
            const gl = (80 - cx) > 0 ? sn : -sn; if (gl > .2 && gl < .42) t += 2.4; else if (gl > .5 && gl < .6) t += .9; else if (gl < -.4) t -= 1; return t; } });
        // Mund: Ellipse oben, die Innenwand hinten vom Ofen beleuchtet; die fünfte innen weich
        const mm = K.maske(); mm.ell(cx, yt + .5, R * 1.08 - 1.2, Math.max(1.5, R * .42));
        K.form(mm, 0, { k: i === 4 ? ['#0a0404', '#1a0a08', '#2e140e', '#421c12'] : ['#030202', '#0a0505', '#160a08', '#24100c'], ton: 1.4, fase: 0, rand: 1, r: RAND_B, L: [0, 1], verlauf: 1.6, muster: (x, y) => i === 4 ? (B.fbm(x * .3, y * .5, 3, 2) - .5) * 1.6 : 0 });
        if (i === 4) fuenfte = { cx, yt, R };
      });
      K.licht(80, 40, 80, '#2a0a06', .8);
      // Der Meißel: steckt aufrecht in der fünften
      const { cx, yt } = fuenfte, mx = cx - 4;
      const me = K.maske(); me.rect(mx - 1, yt - 16, 2.5, 18); me.rect(mx - 1.5, yt - 18, 3.5, 3);
      K.form(me, 0, { k: KALT.slice(0, 5), r: ['#c8d8e4', '#ffffff'], ton: 2.4, fase: 0, rand: 1, L: [-.6, -.8] });
      K.set(mx, yt - 16, '#ffffff');
      K.vignette(.7, { cx: 84, cy: 50 });
    },

    // Eine Reihe hängender Glocken im Halbdunkel, unter jeder treten zwei Füße in der Luft; durch den Boden steigt Wasser in die glühenden Rinnen.
    glockengiesserei_flut(K) {
      const { B } = K;
      ziegelwand(K, 0, 0, 160, 58, { tf: (x, y) => -y / 220 });
      // Boden: nasser Lehm, Wasser steht in Lachen und dringt in die Rinnen
      K.feld(0, 58, 160, 90, LEHM, (x, y) => .3 + (y - 58) / 60 + (B.hash(x, y >> 1, 3) < .1 ? .12 : 0));
      K.rect(0, 58, 160, 1, LEHM[5]);
      K.feld(0, 58, 160, 90, KALT.slice(0, 5), (x, y) => B.fbm(x * .05, y * .18, K.seed + 4, 2) > .56 ? .25 + (Math.sin(y * 2.2 + x * .2) > .8 ? .4 : 0) : -1);
      // Zwei glühende Rinnen zum Betrachter hin; das Wasser löscht sie in Stücken
      K.licht(80, 80, 90, '#3a0c06', .8, { oval: 1.5 });
      const r1 = rinne(K, [[70, 60], [56, 72], [34, 90]], 1, { ende: 2.4 });
      const r2 = rinne(K, [[90, 60], [106, 72], [128, 90]], 1, { ende: 2.4 });
      for (const r of [r1, r2]) for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) if (r.has(x, y) && B.fbm(x * .1, y * .25, K.seed + 9, 2) > .58) K.set(x, y, (x + y) & 1 ? KALT[3] : KALT[2]);
      // Dampf, wo Wasser auf Glut trifft
      for (let i = 0; i < 40; i++) { const t = K.r(), side = K.r() < .5 ? -1 : 1, x = 80 + side * (10 + t * 36) + K.r.j(3), y = 60 + t * 28 - K.r.f(2, 9); K.set(x, y, '#3a3236'); }
      // Balken und die Reihe der Glocken, nach hinten kleiner
      const bal = K.maske(); bal.poly([[-2, 4], [162, 18], [162, 23], [-2, 11]]);
      K.lichtquelle(80, 90);
      K.form(bal, 0, { k: HOLZ, r: RAND_H, ton: 3.4, fase: 1, rand: 2, L: [0, 1], muster: (x, y) => (B.rausch2(x * .05, y * .8, 3) - .5) * .8 });
      const gl = [[22, 11, 14, 0], [58, 14, 12, .6], [91, 17, 10, -.7], [120, 19.5, 8, .8], [144, 21.5, 6.5, -.5]];
      for (const [cx, by, R, tritt] of gl) {
        const h = R * 1.6, g = glocke(K, cx, by + R * .35, h, R, { haken: 2, L: [0, 1], ton: 2, tiefe: (cx - 18) / 300 });
        K.kante(g.m, 80, 92, 110, RAND_B, { nah: .3, min: .05 });
        const f = fuesse(K, cx, g.mund, R * 1.15, { tritt, tiefe: (cx - 18) / 300, sohle: GLUT[4] });
        K.kante(f, 80, 92, 90, ['#d8805a', '#ffb08a'], { nah: .3, min: 0 });
      }
      K.vignette(.65, { cx: 80, cy: 50 });
    },
  },
};
