// Ereignisbilder 160 × 90 · Das Ufer unten (data/biome/ufer.json).
// Palette des Ufers (prototype/js/scenes/world/ufer.js): der Sand vom Anfang in warmem Braungrau, darüber
// hängt das Meer als Decke in Blaugrün mit Schaum an den Kämmen; Morgenlicht fällt hinten rechts durchs Wasser.
'use strict';

const WASSER = ['#04070a', '#081016', '#0d1920', '#13242c', '#1c3238', '#284440', '#365846', '#4c6e56', '#6e8c6c', '#a0b48e'];
const SCHAUM = ['#c8ccb4', '#eee8d2'];
const SAND = ['#0d0c0a', '#1a1814', '#2a2620', '#3e382e', '#544c3e', '#6e6452', '#8a806a', '#a89c84'];
const KORB = ['#0c0a07', '#17130d', '#241e14', '#342b1c', '#463a26', '#5c4c32'];
const SEE = '#7ab4aa', MORGEN = '#e4dcc4', MORGEN_G = '#2a2a1e', MORGEN_G2 = '#3e3a28';
const SANDRAND = ['#8a806a', '#e4dcc4'];
const DUNKEL = ['#040607', '#0b1214', '#162024', '#25333a'];

// ---------- eigene Bausteine ----------
// Die Decke: das Meer von unten. Wellenbänder von fern (tief am Horizont, hell) nach nah (oben, dunkel);
// jede hängende Front ist an der Lippe durchscheinend, an der Kante Schaum. lx: Morgenlicht hinten.
function meerDecke(K, hy, o) {
  o = o || {}; const { B } = K, lx = o.lx === undefined ? 130 : o.lx, n = o.baender || 5;
  K.feld(0, 0, 160, hy + 1, WASSER, (x, y) => .15 + (y / hy) * .35 + Math.exp(-(((x - lx) / 40) ** 2)) * (y / hy) * .35);
  for (let i = n - 1; i >= 0; i--) {
    const q = i / (n - 1), basis = B.lerp(o.oben === undefined ? 10 : o.oben, hy - 2, Math.pow(q, .8)), amp = B.lerp(4, 1, q), fq = B.lerp(.05, .12, q);
    const kante = x => basis + Math.sin(x * fq + i * 2.1) * amp + (B.rausch2(x * fq * 2, i, K.seed) - .5) * amp * 1.4 + (o.haenge ? o.haenge(x, i) : 0);
    K.feld(0, 0, 160, 90, WASSER, (x, y) => {
      const k = kante(x); if (y > k) return -1;
      const lippe = Math.max(0, 1 - (k - y) / (4 + amp * 2)), licht = Math.exp(-(((x - lx) / 46) ** 2));
      return .06 + q * .26 + lippe * (.12 + licht * .3) + licht * q * .22 + (B.rausch2(x * .2, y * .3, K.seed + i) - .5) * .06 - (k - y) / 100;
    });
    // Schaum an der Kante: nur in Flocken, hell nur nahe am Licht
    for (let x = 0; x < 160; x++) {
      const k = Math.round(kante(x)), v = B.rausch2(x * .3, i * 3, K.seed + 7), licht = Math.exp(-(((x - lx) / 40) ** 2));
      if (v > .66) K.set(x, k, licht > .5 && v > .74 ? SCHAUM[1] : licht > .2 ? SCHAUM[0] : WASSER[6 + Math.round(q * 2)]);
    }
  }
}
// Sand: zum Horizont heller (Morgenlicht von hinten), Rippeln
function sand(K, hy, o) {
  o = o || {}; const { B } = K, lx = o.lx === undefined ? 130 : o.lx;
  K.feld(0, hy, 160, 90, SAND, (x, y) => {
    const q = (y - hy) / (90 - hy), rip = Math.sin(y * (1.1 + q * .3) + Math.sin(x * .05) * 3) > .82 ? .07 : 0;
    return .1 + Math.pow(1 - q, 3) * .5 * (.35 + .65 * Math.exp(-(((x - lx) / 60) ** 2))) + rip;
  });
  // Horizont: heller Streifen, wo Meer und Sand sich treffen
  for (let x = 0; x < 160; x++) { const v = Math.exp(-(((x - lx) / 60) ** 2)); K.set(x, hy, v > .4 ? MORGEN : SAND[6]); if (v > .7) K.set(x, hy - 1, SEE); }
}
// Fußabdruck nackter Fuß im Sand (Aufsicht schräg): Ferse, Ballen, Zehen; s = Größe
function fuss(K, x, y, s, links) {
  const { B } = K, d = links ? -1 : 1, m = K.maske();
  m.ell(x, y + 1.3 * s, .9 * s, .75 * s); m.ell(x + d * .2 * s, y - .2 * s, 1.1 * s, .9 * s); m.kap(x, y + 1.2 * s, x + d * .15 * s, y, .7 * s, .85 * s);
  for (let i = 0; i < 4; i++) m.ell(x + d * (-.55 + i * .45) * s, y - 1.55 * s + Math.abs(i - .8) * .12 * s, .26 * s + .2, .24 * s + .2);
  for (let j = m.y0; j <= m.y1; j++) for (let i = m.x0; i <= m.x1; i++) if (m.has(i, j)) K.set(i, j, m.has(i, j - 1) ? SAND[1] : SAND[0]);
  // der vordere Rand jeder Mulde fängt das Licht von hinten
  for (let j = m.y0; j <= m.y1 + 1; j++) for (let i = m.x0; i <= m.x1; i++) if (!m.has(i, j) && m.has(i, j - 1)) K.set(i, j, SAND[6]);
  void B; return m;
}
module.exports = {
  biom: 'ufer',
  bilder: {
    // Eine Reihe Fußabdrücke im Sand, die unter einer herabhängenden Welle enden; im vordersten steht ein Schuh.
    ufer_spuren(K) {
      const { B } = K;
      const hy = 46, wx = 110;
      meerDecke(K, hy, { lx: wx + 14 });
      sand(K, hy, { lx: wx + 14 });
      // Eine Welle hängt tief herab, fast bis auf den Sand: breite Front, durchscheinend im Morgenlicht, an der Lippe Schaum
      const lip = x => 56 - Math.pow(Math.abs(x - wx) / 40, 2) * 22 + Math.sin(x * .45) * 1.2;
      const we = K.maske(); we.fn(wx - 46, 0, wx + 50, 60, (x, y) => y < lip(x) && y > 8 + Math.abs(x - wx) * .1);
      K.feld(0, 0, 160, 90, WASSER, (x, y) => { if (!we.has(x, y)) return -1; const d = lip(x) - y; return .32 + Math.max(0, 1 - d / 20) * .62 * Math.exp(-(((x - wx - 6) / 30) ** 2)) + (Math.sin(x * .35 - y * .5) > .85 ? .08 : 0) - d / 140; });
      for (let x = wx - 46; x <= wx + 50; x++) { const y = Math.round(lip(x) - 1); if (!we.has(x, y)) continue; const nah = Math.abs(x - wx) < 26; K.set(x, y, nah && B.hash(x, 1, 2) < .7 ? SCHAUM[1] : SCHAUM[0]); if (nah && B.hash(x, 2, 2) < .25) K.set(x, y + 1, SCHAUM[0]); }
      // Licht durch die hängende Welle auf den Sand darunter
      K.licht(wx, 62, 36, MORGEN_G2, 1, { oval: 2.4, maske: (x, y) => y > hy });
      K.licht(wx, 60, 16, '#4a4630', 1, { oval: 2.4, maske: (x, y) => y > hy });
      // Spur: von vorn links bis unter die Welle, die Abdrücke werden kleiner
      const pfad = [];
      for (let i = 0; i < 8; i++) { const q = i / 7, x = B.lerp(26, wx - 6, Math.pow(q, .85)) + ((i & 1) ? 3.5 : -3.5) * (1 - q * .5), y = B.lerp(86, 61, Math.pow(q, .75)); pfad.push([x, y, B.lerp(3.4, 1.5, q), i & 1]); }
      K.licht(70, 72, 56, MORGEN_G2, 1, { oval: 2, maske: (x, y) => y > hy });
      for (const [x, y, s, l] of pfad) fuss(K, x, y, s, l);
      // Im vordersten Abdruck unter der Welle steht ein Schuh, ordentlich, als hätte ihn jemand hineingestellt
      const [sx, sy] = pfad[pfad.length - 1];
      const schuh = K.maske(); schuh.ell(sx + 4, sy + 1, 4.6, 1.8); schuh.rect(sx - 1, sy - 3, 5, 4); schuh.kap(sx + 1, sy - 2, sx + 7, sy, 1.4, 1.2);
      K.form(schuh, 0, { k: KORB, r: [SANDRAND[0], MORGEN], ton: 2.2, fase: 0, rand: 2, L: [.3, -1], schatten: 1 });
      K.set(sx + 1, sy - 2, '#3e382e'); K.set(sx + 2, sy - 2, '#3e382e');
      // Tropfen aus der Lippe der Welle
      for (const [x, y] of [[wx - 8, 57], [wx + 5, 59], [wx + 14, 56]]) { K.set(x, y, SCHAUM[0]); K.set(x, y + 2, SEE); }
      K.vignette(.6, { cx: 96, cy: 56 });
    },

    // Ein Strandkorb von hinten im Sand, gestreifter Stoff in der Haube, darüber hängt das Meer.
    ufer_strandkorb(K) {
      const { B } = K;
      const hy = 50;
      meerDecke(K, hy, { lx: 112 });
      sand(K, hy, { lx: 112 });
      K.lichtquelle(112, 46);
      // Strandkorb von hinten: Korbgeflecht, die Haube oben gerundet, an den Seiten der gestreifte Stoff
      const cx = 72, yb = 82;
      const korb = K.maske();
      korb.rect(cx - 22, yb - 26, 44, 26);
      korb.fn(cx - 24, yb - 54, cx + 24, yb - 24, (x, y) => Math.abs(x - cx) < 22 + (yb - 26 - y) * .08 && Math.hypot((x - cx) / 24, (y - (yb - 34)) / 20) < 1);
      korb.rect(cx - 24, yb - 27, 48, 3);
      const geflecht = (x, y) => ((x + (y >> 1)) % 3 === 0 ? -.5 : 0) + ((y % 2) ? .25 : 0);
      K.form(korb, 0, { k: KORB, r: SANDRAND, ton: 2, verlauf: .6, muster: (x, y) => geflecht(x, y) - Math.abs(x - cx) / 24 * .6 + (y === yb - 26 || y === yb - 25 ? 1.2 : 0) });
      // gestreifter Stoff, der seitlich unter der Haube hervorschaut
      for (const s of [-1, 1]) {
        const st = K.maske(); st.poly([[cx + s * 22, yb - 50], [cx + s * 25, yb - 46], [cx + s * 26, yb - 28], [cx + s * 22, yb - 28]]);
        K.form(st, 0, { k: ['#1a1410', '#4a2a22', '#7a4a3a', '#b89a80', '#d8ccb4'], r: SANDRAND, ton: 2, fase: 0, rand: 1, muster: (x, y) => (Math.floor(y / 3) % 2 ? 1.4 : -1) });
      }
      // Füße des Korbs im Sand, Schatten, das Schild mit der Nummer
      const fu = K.maske(); fu.rect(cx - 22, yb, 6, 2); fu.rect(cx + 16, yb, 6, 2); K.form(fu, 0, { k: KORB, ton: 1, fase: 0, rand: 0 });
      K.feld(cx - 30, yb + 1, cx + 30, yb + 5, SAND.slice(0, 3), (x, y) => Math.abs(x - cx + 2) < 30 - (y - yb) * 3 ? .2 : -1);
      // Schild mit der Kabinennummer (17)
      const schild = K.maske(); schild.rect(cx - 6, yb - 47, 13, 8); K.form(schild, 0, { k: ['#2a2620', '#5a5446', '#a8a08a', '#d8d0b8'], r: [MORGEN, '#fff8e4'], ton: 2.4, fase: 0, rand: 1 });
      const ZI = { 1: ['01', '11', '01', '01', '01'], 7: ['111', '001', '010', '010', '010'] };
      for (const [d, ox] of [[1, -3], [7, 1]]) ZI[d].forEach((z, j) => [...z].forEach((c, i) => { if (c === '1') K.set(cx + ox + i, yb - 45 + j, '#2a2016'); }));
      // Haubenrand: der gestreifte Stoff schaut oben über das Geflecht
      for (let x = cx - 21; x <= cx + 21; x++) { const y = Math.round(yb - 34 - Math.sqrt(Math.max(0, 1 - ((x - cx) / 24) ** 2)) * 20); K.set(x, y + 1, Math.floor((x - cx + 40) / 3) % 2 ? '#b89a80' : '#7a4a3a'); }
      K.vignette(.7, { cx: 80, cy: 50 });
    },

    // Eine grüne Flasche steckt kopfüber im Sand, darüber zieht sich ein Wassertropfen nach oben zurück.
    ufer_flaschenpost(K) {
      const { B } = K;
      const hy = 46;
      meerDecke(K, hy, { lx: 84, haenge: (x, i) => i === 0 ? Math.max(0, 1 - Math.abs(x - 82) / 16) ** 2 * 10 : 0 });
      sand(K, hy, { lx: 84 });
      K.lichtquelle(84, 30);
      // Die Flasche: kopfüber, der Hals im Sand, ein Zettel darin
      const fx = 80, fy = 78;
      K.licht(fx, fy - 10, 26, MORGEN_G, 1);
      const fl = K.maske(); fl.kap(fx, fy, fx, fy - 6, 1.6, 1.8); fl.kap(fx, fy - 7, fx, fy - 10, 2, 4.4); fl.kap(fx, fy - 10, fx, fy - 24, 4.6, 4.6); fl.ell(fx, fy - 25, 4.4, 1.4);
      K.form(fl, 0, { k: ['#041008', '#0a2414', '#14402a', '#246040', '#3e8a5a'], r: ['#7ab48a', '#e0f8e0'], ton: 2.2, vx: -.8, fase: 0, rand: 2, L: [-.5, -.9] });
      const zt = K.maske(); zt.rect(fx - 1.5, fy - 22, 3, 9); K.form(zt, 0, { k: ['#3e3a2c', '#6e6650', '#a89c7c', '#d8ccaa'], ton: 2.4, fase: 0, rand: 0 });
      K.set(fx - 3, fy - 21, '#e0f8e0'); K.set(fx - 3, fy - 20, '#9ad0a4'); K.set(fx - 3, fy - 15, '#7ab48a');
      // Sand um den Hals aufgeworfen
      const hg = K.maske(); hg.ell(fx, fy + 1, 6, 1.8); K.form(hg, 0, { k: SAND.slice(2, 7), r: SANDRAND, ton: 2.2, fase: 0, rand: 1, L: [0, -1] });
      // Der Tropfen über der Flasche: zieht sich nach oben zur Decke zurück, ein Faden
      const ty = 50;
      const tr = K.maske(); tr.ell(fx, ty, 2.4, 3); tr.kap(fx, ty - 2, fx, hy - 8, 1.2, .5);
      K.licht(fx, ty, 12, '#1c3238', 1);
      K.form(tr, 0, { k: WASSER.slice(4, 10), r: [SEE, SCHAUM[1]], ton: 3, fase: 0, rand: 1, L: [-.5, -.9] });
      K.set(fx - 1, ty - 1, '#ffffff');
      for (const [x, y] of [[fx + 1, ty + 6], [fx - 1, ty + 9]]) K.set(x, y, SEE);
      K.vignette(.75, { cx: 80, cy: 50 });
    },
  },
};
