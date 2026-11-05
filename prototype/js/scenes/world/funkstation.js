// Saltmoor 1925 · Hintergründe: Akt IV, Die Funkstation am Pol (Biom-Paket funkstation).
// Komposition: docs/auftrag-2/biome/funkstation.md. Auf dem schwarzen Eis eine eingeschneite Hütte von 1912,
// daneben ein Gittermast, an dessen Seilen das Eis in Strähnen hängt wie Haar. Die Röhren glühen noch.
// Licht: warmes Röhrenorange aus Fenstern und Geräten, Schnee warmweiß im Lampenlicht (Gegenlicht oben rechts).
// Wahrzeichen: der Antennenmast und der Morsetisch. Falsches Detail: Unter dem Eis blinken Morsezeichen, in einer
// Reihe, die auf dich zuläuft; der Antennendraht und der Papierstreifen führen in ein Loch im Eis.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060403', '#110a07', '#1e120c', '#311d14'], rand: ['#a48a74', '#f4ebe0'], augen: '#ff8a2a', nebel: ['#140d0a', '#3a2c24'], fern: '#4a3a30' };
const SCHNEE = ['#0c0908', '#15100d', '#1f1814', '#2a221d', '#372d26', '#463a31', '#574940', '#6b5a4e', '#837063', '#9e897a', '#bba595', '#d6c3b2', '#ece0d2'];
const EIS = ['#020101', '#060404', '#0b0807', '#110c0a', '#18110d', '#201712', '#2a1e17'];
const HIMMEL = ['#040303', '#080606', '#0d0a08', '#130e0c', '#1a1410', '#231a15', '#2e221b', '#3b2c22'];
const HOLZ = ['#070504', '#0f0a07', '#18100b', '#231710', '#301f15', '#3f291b', '#523524'];
const KUPFER = ['#2a150b', '#4e2a16', '#7a4222', '#a85c30', '#c0703e', '#e2a070'];
const KALT = ['#0c1014', '#141b22', '#1e2832', '#2a3846', '#3a4a5a', '#4e6070', '#647686'];
const OR = '#ff8a2a', OR_K = '#fff2d6', OR_G = '#3a1a08', OR_G2 = '#5c2a0e', PAPIER = '#cbb8a2';
const frac = v => v - Math.floor(v);
const schneeMat = (ton, x) => Object.assign({ k: SCHNEE.slice(1, 9), r: ['#a48a74', '#ece0d2'], ton, fase: 1.5, rand: 2, schatten: 2, muster: (px, py) => (B.fbm(px * .07, py * .2, 5, 2) - .5) * .9 }, x || {});
const holzMat = (ton, x) => Object.assign({ k: HOLZ.slice(0, 6), r: ['#7a5a44', '#d8bea0'], ton, fase: 1, rand: 2, schatten: 2 }, x || {});
const eisenMat = (ton, x) => Object.assign({ k: ['#050404', '#0c0908', '#16110d', '#221a14'], r: ['#8a7262', '#e0cdb8'], ton, fase: 0, rand: 1 }, x || {});

// ---------- Himmel: Polarnacht, über dem Horizont ein schwacher warmer Schein (Dämmerung, die nie kommt) ----------
function himmel(K, hy, lx, staerke) {
  const sd = K.o.seed;
  B.feld(K.e[0], -M, -M, W + M, hy + 6, HIMMEL, (x, y) => {
    const q = Math.max(0, 1 - Math.hypot((x - lx) / 360, (y - hy) / 130));
    return .08 + (y + M) / (hy + M) * .25 + q * q * staerke + (B.fbm(x * .01, y * .03, sd + 3, 2) - .5) * .12;
  });
  const r = B.rng(sd * 3 + 1); B.sterne(K.e[0], r, 70, -M, -M, W + M, hy - 30, ['#2e241e', '#4a3c32', '#8a7666']);
}
// ---------- Schnee auf schwarzem Eis, perspektivisch; Wehen; Licht von Lampen; blanke Eisflecken ----------
function schneeBoden(K, P, y0, o) {
  o = o || {}; const sd = K.o.seed, lichter = o.lichter || [], blank = o.blank || .3, hell = o.hell || 0;
  const eisP = EIS.map(B.pk), sP = SCHNEE.map(B.pk);
  for (let y = Math.max(-M, Math.floor(y0)); y < H + M; y++) {
    const e = K.e[K.eb(y)];
    for (let x = -M; x < W + M; x++) {
      const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h;
      const fl = B.fbm(X * .35 + 9, Z * .22, sd + 7, 3) - (o.blankX !== undefined ? Math.max(0, .25 - Math.abs(X - o.blankX) * .12) : 0);
      let licht = 0; for (const L of lichter) { const d = Math.hypot(x - L.x, (y - L.y) * 2.2); licht += Math.max(0, 1 - d / L.r) * L.s; }
      let c;
      if (fl < blank) { // blankes schwarzes Eis, mit hellem Glanzstrich
        let t = .25 + (B.fbm(X * 2, Z * 1.4, sd, 2) - .5) * .5 + licht * .5 + (Math.abs(frac(X * .6 + Z * .1) - .5) < .02 ? .8 : 0);
        t = B.clamp(t, 0, .999) * (eisP.length - 1); const k = Math.floor(t); c = eisP[Math.min(eisP.length - 1, (t - k) > B.bay(x, y) ? k + 1 : k)];
      } else {
        const welle = Math.sin(X * 1.6 + Z * .5 + B.fbm(X * .4, Z * .3, sd, 2) * 6) * .5 + .5; // Wehen
        const rippe = Math.abs(frac(X * 2.2 + Z * .35 + B.fbm(X * .5, Z * .5, sd + 1, 2) * 3) - .5) < .07 ? -.09 : 0; // Windrippen (Sastrugi)
        const spur = (o.spur && Math.abs(X - o.spur(Z)) < .18 && frac(Z * 1.3) < .45) ? -.14 : 0;
        let t = .06 + hell + Math.min(.3, 6 / Z) * .5 + welle * .17 + rippe + spur + licht * .62 + (fl - blank < .04 ? -.14 : 0) + (B.hash(x, y, sd) < .02 ? .1 : 0);
        t = B.clamp(t, 0, .999) * (sP.length - 1); const k = Math.floor(t); c = sP[Math.min(sP.length - 1, (t - k) > B.bay(x, y) ? k + 1 : k)];
      }
      e.d[(y + M) * B.EW + x + M] = c;
    }
  }
}
// ---------- Morselichter unter dem Eis (falsches Detail): eine Reihe, die auf dich zuläuft, blinkt in Kurz und Lang ----------
// Muster: der Name, den du noch nicht gesagt hast. Wandert pro Takt eine Lampe näher.
const MORSE = [1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
function morse(K, P, X0, Z0, X1, Z1, n, eb) {
  const pts = [];
  for (let i = 0; i < n; i++) { const q = i / (n - 1), X = X0 + (X1 - X0) * q, Z = Z0 + (Z1 - Z0) * q; const [x, y] = P.q(X, 0, Z), k = P.k(Z); pts.push({ x, y, w: Math.max(1, k * .07), h: Math.max(1, k * .02) }); }
  const e = K.e[eb === undefined ? 3 : eb];
  for (const p of pts) { B.gluehen(e, p.x, p.y, p.w * 2.5 + 2, OR_G, .7); for (let j = 0; j < p.h; j++) for (let i = -p.w; i <= p.w; i++) e.set(p.x + i, p.y + j, B.pk(OR_G2)); }
  const C1 = B.css(OR), C2 = B.css(OR_K), CG = B.css('#7a3a12');
  K.anim.push({ p: B.PAR[eb === undefined ? 3 : eb], f(ctx, t, ox, oy) {
    const s = Math.floor(t * 3.2);
    pts.forEach((p, i) => { const bit = MORSE[((s - i) % MORSE.length + MORSE.length) % MORSE.length]; if (!bit) return;
      const w = Math.round(p.w), h = Math.max(1, Math.round(p.h));
      ctx.fillStyle = CG; ctx.fillRect(Math.round(p.x - w - 1) + ox, Math.round(p.y - 1) + oy, w * 2 + 3, h + 2);
      ctx.fillStyle = C1; ctx.fillRect(Math.round(p.x - w) + ox, Math.round(p.y) + oy, w * 2 + 1, h);
      ctx.fillStyle = C2; ctx.fillRect(Math.round(p.x) + ox, Math.round(p.y) + oy, Math.max(1, w), 1); });
  } });
  K.licht(pts[n - 1].x, pts[n - 1].y, OR, 40, .3);
}
// ---------- Gittermast mit Abspannseilen, an denen Eis wie Haar hängt (Wahrzeichen) ----------
function mast(K, eb, x, yb, yt, wb, tiefe, o) {
  o = o || {}; const m = B.maske(), wt = Math.max(1.5, wb * .28), st = Math.max(6, (yb - yt) / 16);
  const L = y => x - (wb / 2) + (wb - wt) / 2 * (yb - y) / (yb - yt), R = y => x + (wb / 2) - (wb - wt) / 2 * (yb - y) / (yb - yt);
  const d = Math.max(.6, wb * .045);
  m.kap(L(yb), yb, L(yt), yt, d * 1.4, d); m.kap(R(yb), yb, R(yt), yt, d * 1.4, d);
  let yp = yb; for (let y = yb - st; y > yt + 2; y -= st) { m.kap(L(y), y, R(y), y, d * .8, d * .8); m.kap(L(yp), yp, R(y), y, d * .55, d * .55); m.kap(R(yp), yp, L(y), y, d * .55, d * .55); yp = y; }
  m.kap(x, yt, x, yt - wb * .5, d, d * .7);
  K.form(eb, m, tiefe, eisenMat(1.4, { rand: tiefe > .5 ? 0 : 1 }));
  // Isolator auf der Spitze glüht
  const ix = x, iy = yt - wb * .5;
  K.e[eb].set(ix, iy, B.pk(OR_K)); K.e[eb].set(ix + 1, iy, B.pk(OR)); B.gluehen(K.e[eb], ix, iy, 10 + wb * .4, OR_G2, .8); K.licht(ix, iy, OR, 50, .4);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { if (Math.sin(t * 9.1) > .93) { ctx.fillStyle = OR_K; ctx.fillRect(Math.round(ix + 2) + ox, Math.round(iy - 1) + oy, 1, 1); } } });
  // Abspannseile mit Eishaar
  (o.seile || []).forEach(([fy, ax, ay]) => {
    const sx = (L(fy) + R(fy)) / 2, sy = fy, n = Math.ceil(Math.hypot(ax - sx, ay - sy));
    const e = K.e[o.seilEbene || eb], c = B.pk(B.mix('#16110d', K.fern, tiefe)), cl = B.pk(B.mix(o.hell ? SCHNEE[9] : SCHNEE[7], K.fern, tiefe * .8)), cd = B.pk(B.mix(SCHNEE[4], K.fern, tiefe));
    const r = B.rng(Math.round(ax * 13 + ay));
    for (let i = 0; i <= n; i++) { const q = i / n, px = sx + (ax - sx) * q, py = sy + (ay - sy) * q + Math.sin(q * Math.PI) * n * .03; e.set(px, py, c);
      if (i % 2 === 0 && r() < .75 && q > .04 && q < .96) { const len = Math.round((2 + r() * 10) * (o.haar || 1) * (1 - Math.abs(q - .45))); for (let j = 1; j <= len; j++) e.set(px + Math.sin(j * .5 + i) * .4, py + j, j < len * .4 ? cl : (j % 2 || j < len * .7) ? cd : 0); } }
  });
  return { ix, iy, L, R };
}
// ---------- Hütte: Planken, Teerpappe, eingeschneit bis zu den Fenstern, ein Fenster glüht ----------
function huette(K, eb, x, y, w, h, tiefe, o) {
  o = o || {}; const m = B.maske(), dh = h * .38;
  m.rect(x, y - h, w, h); m.poly([[x - 3, y - h + 1], [x + w / 2, y - h - dh], [x + w + 3, y - h + 1]]);
  const rohr = B.maske(); rohr.rect(x + w * .72, y - h - dh * .9, Math.max(2, w * .05), dh * .7);
  K.form(eb, rohr, tiefe, eisenMat(1.2));
  K.form(eb, m, tiefe, holzMat(1.4, { muster: (px, py) => (py > y - h ? ((Math.round(py - y) % 4) === 0 ? -.8 : 0) : ((Math.round(px - py * .8) % 5) === 0 ? -.5 : .2)) }));
  // Schnee auf dem Dach
  const sd = B.maske(); sd.poly([[x - 4, y - h + 1], [x + w / 2, y - h - dh - 1], [x + w + 4, y - h + 1], [x + w + 4, y - h + 3], [x + w / 2, y - h - dh + 2], [x - 4, y - h + 3]]); K.form(eb, sd, tiefe, schneeMat(1.6, { muster: null, rand: 1 }));
  // Fenster
  const fx = x + w * .2, fy = y - h * .62, fw = w * .26, fh = h * .32;
  for (let j = 0; j < fh; j++) for (let i = 0; i < fw; i++) { const kreuz = Math.abs(i - fw / 2) < .6 || Math.abs(j - fh / 2) < .6; const eisb = B.fbm((fx + i) * .4, (fy + j) * .4, 7, 2) > .62; K.e[eb].set(fx + i, fy + j, B.pk(kreuz ? HOLZ[2] : eisb ? '#ffd9a8' : j < fh * .5 ? OR : '#e07020')); }
  K.glut(fx + fw / 2, fy + fh / 2, w * .9, OR_G2, .9, [eb, eb + 1].filter(i => i <= 4)); K.licht(fx + fw / 2, fy + fh / 2, OR, w * 1.2, .7);
  // Tür
  const tx = x + w * .62, tw = w * .2, th = h * .75; const tm = B.maske(); tm.rect(tx, y - th, tw, th); K.form(eb, tm, tiefe, holzMat(.7, { rand: 1, fase: 0 }));
  if (o.offen) { for (let j = 1; j < th - 1; j++) for (let i = 1; i < tw - 1; i++) K.e[eb].set(tx + i, y - th + j, B.pk(j > th * .5 ? '#d06a1c' : OR_G2)); B.gluehen(K.e[eb], tx + tw / 2, y - 4, w * .6, OR_G, .9); }
  // Wehe davor bis unter das Fenster
  const we = B.maske(); we.poly([[x - w * .25, y + 2], [x - w * .05, y - h * .2], [x + w * .3, y - h * .28], [x + w * .55, y - h * .1], [x + w * .9, y - h * .16], [x + w * 1.25, y + 2]]); K.form(eb, we, tiefe, schneeMat(1.9));
  return { fx, fy, fw, fh, tx, tw };
}
// ---------- Loch im Eis: rund, glatt; ein Wall aus Schnee; von unten ein orange Schimmer ----------
function eisloch(K, P, X, Z, rr, o) {
  o = o || {}; const [x, y] = P.q(X, 0, Z), k = P.k(Z), rx = rr * k, ry = rx * .28, eb = K.eb(y);
  const wall = B.maske(); wall.ell(x, y, rx * 1.5, ry * 1.9); K.form(eb, wall, 0, schneeMat(1.9, { verlauf: .3 }));
  const loch = B.maske(); loch.ell(x, y, rx, ry);
  B.form(K.e[eb], loch, { k: [B.pk('#000000'), B.pk('#050302'), B.pk('#120805'), B.pk('#2a1206')], ton: .2, fase: 0, rand: 0, verlauf: -.2, muster: (px, py) => Math.max(0, .9 - Math.hypot((px - x) / rx, (py - y - ry * .2) / ry) * 1.6) * 2.4 });
  K.e[eb].set(x, y + ry * .3, B.pk(OR)); B.gluehen(K.e[eb], x, y, rx * 1.2, OR_G, .8); K.licht(x, y, OR, rx * 3, .5);
  return [x, y, rx, ry];
}
// Draht als Kurve (Kettenlinie), dunkel, mit Reif
function draht(K, eb, x0, y0, x1, y1, durch, farbe) {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)); const c = B.pk(farbe || '#120d0a');
  for (let i = 0; i <= n; i++) { const q = i / n; K.e[eb].set(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * durch, c); if (i % 5 === 0) K.e[eb].set(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * durch - 1, B.pk(SCHNEE[7])); }
}
// Papierstreifen des Schreibers über Schnee oder Dielen
function streifen(K, pts, breite) {
  for (let s = 0; s < pts.length - 1; s++) { const [x0, y0] = pts[s], [x1, y1] = pts[s + 1], n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
    for (let i = 0; i <= n; i++) { const q = i / n, x = x0 + (x1 - x0) * q, y = y0 + (y1 - y0) * q, e = K.e[K.eb(y)], b = Math.max(1, breite * (y - 120) / 120);
      for (let j = 0; j < b; j++) e.set(x, y + j, B.pk(j === 0 ? PAPIER : (Math.round(x * .7) % 5 === 0 ? HOLZ[2] : '#9a8672'))); } }
}
// Fass, Schlitten, Kiste (Maßstab)
function fass(K, eb, x, y, s, tiefe) { const m = B.maske(); m.rect(x - s * .35, y - s, s * .7, s); m.ell(x, y - s, s * .35, s * .1); K.form(eb, m, tiefe, eisenMat(1.6, { k: ['#0c0705', '#1a0e08', '#2a160c', '#3a2214'], rand: 2, fase: 1, muster: (px, py) => (Math.abs(py - (y - s * .3)) < .6 || Math.abs(py - (y - s * .7)) < .6 ? .6 : 0) })); const sn = B.maske(); sn.ell(x, y - s - 1, s * .36, s * .09); K.form(eb, sn, tiefe, schneeMat(2.2, { rand: 1 })); }
function schlitten(K, eb, x, y, s, tiefe) { const m = B.maske(); m.rect(x - s, y - s * .32, s * 2, s * .08); m.kap(x - s * 1.1, y, x + s, y, s * .03 + .5, s * .03 + .5); m.kap(x - s * 1.1, y, x - s * 1.25, y - s * .2, s * .03 + .5, s * .03 + .5); for (const k of [-.7, 0, .7]) m.kap(x + k * s, y, x + k * s, y - s * .3, s * .03 + .5, s * .03 + .5); m.rect(x - s * .8, y - s * .6, s * 1.2, s * .28); K.form(eb, m, tiefe, holzMat(1.6)); }
function kiste(K, eb, x, y, w, h, tiefe) { const m = B.maske(); m.rect(x - w / 2, y - h, w, h); K.form(eb, m, tiefe, holzMat(1.7, { muster: (px, py) => ((Math.round(py - y) % 4) === 0 ? -.7 : 0) })); }

// ---------- Innen: Plankenwand, Dielen, Fenster mit Eisblumen ----------
function wand(K, y1, o) {
  o = o || {}; const sd = K.o.seed;
  B.feld(K.e[1], -M, -M, W + M, y1 + 2, HOLZ, (x, y) => { const pl = Math.floor((x + 400) / 11); const fuge = ((x + 400) % 11) < 1; const lichtL = (o.lichter || []).reduce((s, L) => s + Math.max(0, 1 - Math.hypot(x - L.x, (y - L.y) * 1.2) / L.r) * L.s, 0);
    return fuge ? .02 : .2 + B.hash(pl, 0, sd) * .12 + (B.fbm(x * .05, y * .25, pl, 2) - .5) * .15 + lichtL * .6 - (y < 20 ? .1 : 0); });
}
function dielen(K, P, y0, o) {
  o = o || {}; const sd = K.o.seed;
  K.boden(y0, H + M, HOLZ, (x, y) => { const X = P.X(x, y), pl = Math.floor(X * 3), fuge = Math.abs(frac(X * 3) - .5) > .46; const Z = P.z(y + .5), quer = Math.abs(frac(Z * .5 + B.hash(pl, 1, sd)) - .5) > .485;
    const licht = (o.lichter || []).reduce((s, L) => s + Math.max(0, 1 - Math.hypot(x - L.x, (y - L.y) * 2) / L.r) * L.s, 0);
    return (fuge || quer) ? .05 : .22 + B.hash(pl, 2, sd) * .12 + (B.fbm(X * 4, Z * .5, pl, 2) - .5) * .12 + licht * .55 + Math.min(.15, 3 / Z) * .3; });
}
function fenster(K, eb, x, y, w, h, o) {
  o = o || {}; const sd = K.o.seed, sp = Math.max(2, Math.round(w / 40));
  const rahmen = B.maske(); rahmen.rect(x - 3, y - 3, w + 6, h + 6); rahmen.rect(x, y, w, h, 0); K.form(eb, rahmen, 0, holzMat(1.5));
  const aussen = o.aussen || ['#1a1410', '#2a211b', '#3e3229', '#54463a', '#6d5d50', '#8a7868', '#a69384'];
  B.feld(K.e[eb], x, y, x + w, y + h, aussen, (px, py) => { const q = (py - y) / h; const eisb = B.fbm(px * .18, py * .18, sd + 5, 3); const rand = Math.min(px - x, x + w - px, py - y, y + h - py) / 10; return (o.hell || .55) * (1 - q * .3) + (eisb > .6 && rand < 1.2 ? .35 : 0) - (o.dunkel || 0) + (B.fbm(px * .04, py * .02, sd, 2) - .5) * .15; });
  // Mast draußen als dünne Senkrechte (Wahrzeichen)
  if (o.mastX !== undefined) mast(K, eb, o.mastX, y + h + 6, y + 8, Math.max(4, w * .05), .55, { seile: [[y + h * .3, o.mastX - w * .4, y + h + 4], [y + h * .3, o.mastX + w * .45, y + h + 4]], haar: .5 });
  // Sprossen
  const sp2 = B.maske(); for (let i = 1; i < sp; i++) sp2.rect(x + w * i / sp - 1, y, 2, h); sp2.rect(x, y + h * .5 - 1, w, 2); K.form(eb, sp2, 0, holzMat(1.3, { rand: 1 }));
}
// Morsetisch: Tisch, Empfänger mit Röhren, Taste, Kopfhörer, Lampe, Logbuch (Wahrzeichen innen)
function morsetisch(K, x, y, s) {
  const eb = K.eb(y - 1), m = B.maske(), tw = 90 * s, th = 32 * s;
  m.rect(x, y - th, tw, 4 * s); m.rect(x + 3 * s, y - th + 4 * s, 3 * s, th - 4 * s); m.rect(x + tw - 6 * s, y - th + 4 * s, 3 * s, th - 4 * s); m.rect(x + 3 * s, y - 9 * s, tw - 6 * s, 2 * s);
  K.form(eb, m, 0, holzMat(1.6));
  // Empfänger: Bakelitkasten mit Fenster, vier Röhren obenauf
  const ex = x + 34 * s, ey = y - th, ew = 34 * s, eh = 18 * s; const em = B.maske(); em.rect(ex, ey - eh, ew, eh); K.form(eb, em, 0, holzMat(1.5, { k: ['#060403', '#110a07', '#1e120c', '#311d14', '#40281a'] }));
  for (let i = 0; i < 4; i++) { const rx = ex + 5 * s + i * 8 * s, ry = ey - eh; const r = B.maske(); r.ell(rx, ry - 4 * s, 2.2 * s, 4.5 * s); B.form(K.e[eb], r, { k: [B.pk('#3a1a08'), B.pk('#7a3a12'), B.pk('#d06a1c'), B.pk(OR)], ton: 1.8, fase: 1, rand: 0 }); K.e[eb].set(rx, ry - 4 * s, B.pk(OR_K)); B.gluehen(K.e[eb], rx, ry - 4 * s, 12 * s, OR_G2, .9); }
  K.licht(ex + ew / 2, ey - eh - 4 * s, OR, 70 * s, .6);
  for (let i = 0; i < 3; i++) { const kx = ex + 6 * s + i * 10 * s, ky = ey - eh / 2; K.e[eb].set(kx, ky, B.pk(KUPFER[4])); K.e[eb].set(kx + 1, ky, B.pk(KUPFER[2])); }
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { for (let i = 0; i < 4; i++) { const v = Math.sin(t * (2.1 + i * .7) + i); if (v < .7) continue; ctx.fillStyle = OR_K; ctx.fillRect(Math.round(ex + 5 * s + i * 8 * s) + ox, Math.round(ey - eh - 5 * s) + oy, 1, 2); } } });
  // Taste (Messing auf Holz), Kopfhörer am Haken, Logbuch
  const ta = B.maske(); ta.rect(x + 12 * s, ey - 3 * s, 12 * s, 3 * s); ta.kap(x + 13 * s, ey - 4 * s, x + 23 * s, ey - 6 * s, .8 * s, .8 * s); K.form(eb, ta, 0, { k: KUPFER.slice(0, 4).map(B.pk), r: [B.pk(KUPFER[4]), B.pk(KUPFER[5])], ton: 1.4, fase: 0, rand: 1 });
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { const bit = MORSE[Math.floor(t * 3.2) % MORSE.length]; if (bit) { ctx.fillStyle = OR_K; ctx.fillRect(Math.round(x + 22 * s) + ox, Math.round(ey - 3 * s) + oy, 1, 1); } } });
  const ko = B.maske(); ko.ell(x + 78 * s, ey - 24 * s, 7 * s, 6 * s); ko.ell(x + 78 * s, ey - 24 * s, 5 * s, 4 * s, 0); ko.ell(x + 72 * s, ey - 20 * s, 2.5 * s, 3 * s); ko.ell(x + 84 * s, ey - 20 * s, 2.5 * s, 3 * s); K.form(eb, ko, 0, holzMat(1.4));
  const lb = B.maske(); lb.rect(x + 2 * s, ey - 2 * s, 12 * s, 2 * s); K.form(eb, lb, 0, { k: [B.pk('#3a2c22'), B.pk('#6a5646'), B.pk('#9a8672'), B.pk(PAPIER)], ton: 2, fase: 0, rand: 0 });
  // Petroleumlampe
  B.flamme(K, Math.round(x + 76 * s), Math.round(ey - 6 * s), { p: B.PAR[eb], kern: OR_K, mitte: '#ffb050', aussen: '#a04a10', glut: OR_G, gross: s > 1.2 ? 1.4 : 1 });
  const lm = B.maske(); lm.rect(x + 73 * s, ey - 3 * s, 6 * s, 3 * s); K.form(eb, lm, 0, eisenMat(1.6));
  for (const i of [1, 2, 3]) B.gluehen(K.e[i], x + 76 * s, ey - 8 * s, 80 * s, OR_G, .7);
  return { ex, ey, ew, eh };
}
// Regal mit Glasakkus (Kupferplatten in Säure)
function akkuregal(K, eb, x, y, w, h, tiefe, still) {
  const m = B.maske(); for (let i = 0; i < 4; i++) m.rect(x, y - h + i * h / 3.2, w, 3); m.rect(x, y - h, 3, h); m.rect(x + w - 3, y - h, 3, h); K.form(eb, m, tiefe, holzMat(1.4, still ? { rand: 0 } : {}));
  for (let r = 0; r < 3; r++) for (let i = 0; i < Math.floor(w / 13); i++) { const ax = x + 6 + i * 13, ay = y - h + (r + 1) * h / 3.2 - 1, ah = h / 3.2 - 5; const a = B.maske(); a.rect(ax, ay - ah, 9, ah);
    K.form(eb, a, tiefe, { k: ['#0a0807', '#16110d', '#241b15', '#3a2c22'], r: ['#8a7262', '#e0cdb8'], ton: 1.2, fase: 0, rand: still ? 0 : 1, muster: (px, py) => ((Math.round(px - ax) === 3 || Math.round(px - ax) === 6) && py > ay - ah + 2 ? 1.6 : 0) });
    for (let j = 2; j < ah; j++) { K.e[eb].set(ax + 3, ay - ah + j, B.pk(B.mix(KUPFER[still ? 1 : 3], K.fern, tiefe))); K.e[eb].set(ax + 6, ay - ah + j, B.pk(B.mix(KUPFER[still ? 0 : 2], K.fern, tiefe))); } }
}
function kabelDecke(K, eb, n, x0, x1, y1) { const r = B.rng(K.o.seed * 5 + 3); for (let i = 0; i < n; i++) { const a = r.f(x0, x1), b = a + r.f(-60, 60); draht(K, eb, a, -M, b, -M, r.f(20, y1), '#0a0705'); } }

// =====================================================================
// Variante 0: Der Mast. Draußen, Polarnacht. Links die Hütte mit glühendem Fenster, rechts der Gittermast mit
// den Eishaar-Seilen; die Antennenlitze führt vom Mast in ein Loch im Eis. Unter dem Eis die Morselichter.
function amMast(K) {
  const fr = K.fr, vy = 160, P = B.persp(250, vy); K.split = [168, 182];
  himmel(K, vy, 420, .9);
  // Ferne: niedrige Presseisrücken
  const fern = B.maske(); fern.fn(-M, vy - 20, W + M, vy + 2, (x, y) => y > vy - 2 - B.rausch1(x * .05, K.o.seed) * 7 - Math.max(0, Math.sin(x * .013) * 5)); K.form(1, fern, .6, schneeMat(1.2));
  // Hütte links im Mittelgrund
  const hu = huette(K, 2, -14, vy + 12, 70, 34, .12, { offen: true });
  // Mast rechts, steigt aus dem Bild
  const ms = mast(K, 2, 356, vy + 24, -M - 4, 34, 0, { seile: [[30, 236, vy + 18], [30, 488, vy + 30], [92, 282, vy + 20], [92, 452, vy + 26], [4, 196, vy + 14]], haar: 1.8 });
  void ms;
  // Boden: Schnee, im Licht der Tür und des Fensters; vorn ein blanker Streifen Eis mit den Morselichtern
  schneeBoden(K, P, vy, { lichter: [{ x: hu.tx + hu.tw / 2, y: vy + 20, r: 140, s: .9 }, { x: 356, y: vy + 26, r: 110, s: .45 }], blank: .4, blankX: -.4, hell: .04, spur: Z => -4 + Z * .3 });
  const [lx, ly] = eisloch(K, P, -5.2, 7.5, .6);
  // Litze vom Mast ins Loch, Papierstreifen von der Tür ins Loch
  draht(K, 2, 356, 14, lx + 2, ly - 2, 40);
  streifen(K, [[hu.tx + hu.tw / 2, vy + 15], [hu.tx + 30, vy + 20], [lx - 30, ly - 4], [lx - 4, ly]], 2);
  morse(K, P, -5.2, 8.2, -.4, 1.3, 10 + Math.round(fr * 4), 4);
  // Maßstab: Fass, Schlitten
  { const [x, y] = P.q(4.6, 0, 6), k = P.k(6); fass(K, K.eb(y), x, y, k * .5, 0); }
  { const [x, y] = P.q(-6.2, 0, 4.2), k = P.k(4.2); schlitten(K, K.eb(y), x, y, k * .55, 0); }
  // Vordergrund: Wehen links und rechts
  const v = B.maske(); v.poly([[-M, H + M], [-M, 214], [30, 228], [70, 250], [96, H + M]]); v.poly([[W + M, H + M], [W + M, 206], [446, 226], [412, H + M]]); K.form(5, v, 0, schneeMat(1.8, { fase: 3, verlauf: .8, muster: (px, py) => (B.fbm(px * .06, py * .12, 4, 3) - .5) * 1.6 + (Math.abs(frac(px * .05 + py * .02) - .5) < .05 ? -.6 : 0) }));
  B.nebel(K.e[2], { y0: vy - 10, y1: vy + 8, col: B.mix(pal.nebel[1], SCHNEE[6], .3), dichte: .2, xs: [-20, 500, 60], seed: 3 });
  B.partikel(K, { n: 60, farben: [SCHNEE[7], SCHNEE[10], SCHNEE[12]], vx: -14, vy: 5, wob: 2, wf: .7, x0: 0, x1: 480, y0: 0, y1: 260, p: .8, hellSelten: 2 });
  K.reihen = [{ y: 176, skala: .9, nebel: .2 }, { y: 196, skala: 1, nebel: .08 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}

// Variante 1: Der Funkraum. Innen, Plankenwand, Fenster mit Eisblumen, draußen der Mast. Links der Morsetisch,
// rechts das Akkuregal. Der Papierstreifen läuft über die Dielen in eine Ritze, aus der es orange blinkt.
function funkraum(K) {
  const fr = K.fr, vy = 150, P = B.persp(250, vy); K.split = [158, 172];
  // Wand: in der Mitte, wo die Gegner stehen, dunkel und ruhig; Licht nur an den Rändern (Lampe links)
  wand(K, vy, { lichter: [{ x: 10, y: 120, r: 120, s: .55 }] });
  B.dith(K.e[1], 110, -M, 430, vy + 2, HOLZ[0], (x, y) => .55 * Math.min(1, Math.min(x - 110, 430 - x) / 50) * Math.min(1, (vy + 2 - y) / 30));
  // Fenster hoch über den Köpfen: kaltes Schneelicht, ruhig; der Mast als dünne Senkrechte
  fenster(K, 1, 196, 6, 92, 34, { mastX: 262, hell: .55 - fr * .2, aussen: KALT });
  kabelDecke(K, 1, 3, 20, 140, 26);
  dielen(K, P, vy, { lichter: [{ x: 30, y: vy + 20, r: 140, s: .55 }] });
  // Morsetisch ganz links, angeschnitten; Röhren klein und warm am Rand
  const mt = morsetisch(K, -62, vy + 30, 1.6);
  // Akkuregal rechts am Rand, ohne helle Kanten
  akkuregal(K, 2, 432, vy + 2, 70, 70, .25, true);
  // Streifen vom Tisch über die Dielen in die Ritze; dort blinkt es
  const [rx, ry] = P.q(1.4, 0, 2.6);
  streifen(K, [[mt.ex + 40, vy + 30], [mt.ex + 70, vy + 44], [rx - 40, ry - 4], [rx - 6, ry]], 2);
  const ri = B.maske(); ri.poly([[rx - 10, ry - 1], [rx + 24, ry - 3], [rx + 26, ry + 1], [rx - 8, ry + 3]]); B.form(K.e[K.eb(ry)], ri, { k: [B.pk('#000000'), B.pk('#120805')], ton: 0, fase: 0, rand: 0 });
  K.anim.push({ p: B.PAR[K.eb(ry)], f(ctx, t, ox, oy) { const bit = MORSE[Math.floor(t * 3.2) % MORSE.length]; ctx.fillStyle = bit ? OR : '#3a1a08'; ctx.fillRect(Math.round(rx - 6) + ox, Math.round(ry) + oy, 28, 1); } });
  B.gluehen(K.e[K.eb(ry)], rx + 8, ry, 24, OR_G, .6 + fr * .3);
  // Vordergrund: Tischkante unten links, Kabelbündel rechts
  const v = B.maske(); v.rect(-M, 246, 120, 40); v.kap(400, H + M, 470, 224, 6, 4); v.kap(430, H + M, 492, 236, 5, 4); K.form(5, v, 0, holzMat(1.1));
  B.partikel(K, { n: 14, farben: [HOLZ[5], KALT[3]], vx: 1, vy: .5, wob: 1.5, wf: .2, x0: 0, x1: 480, y0: 0, y1: 240, p: .8 });
  K.reihen = [{ y: 168, skala: .9, nebel: .15 }, { y: 192, skala: 1, nebel: .05 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], P };
}

// Variante 2: Das Eisloch. Weit draußen auf blankem Eis; die Station klein in der Ferne, die Litze kommt auf
// Stangen herüber und taucht in ein rundes Loch. Zelt, umgekippter Schlitten, Kisten. Unter dem Eis die Lichter.
function eislochSzene(K) {
  const fr = K.fr, vy = 140, P = B.persp(240, vy); K.split = [152, 166];
  himmel(K, vy, 90, .7);
  const fern = B.maske(); fern.fn(-M, vy - 16, W + M, vy + 2, (x, y) => y > vy - 1 - B.rausch1(x * .04, K.o.seed + 2) * 5); K.form(1, fern, .6, schneeMat(1.2));
  huette(K, 1, 50, vy + 1, 30, 14, .35, {});
  mast(K, 1, 96, vy + 2, vy - 70, 6, .35, { seile: [[vy - 50, 80, vy + 1], [vy - 50, 112, vy + 2]], haar: .5 });
  schneeBoden(K, P, vy, { lichter: [{ x: 300, y: 196, r: 140, s: .45 }], blank: .5, hell: .02 });
  const [lx, ly, lr] = eisloch(K, P, .8, 4.4, .75);
  // Stangen mit Isolatoren, die Litze von der Station herüber
  let last = [96, vy - 62];
  for (const [X, Z] of [[-5, 30], [-3.6, 16], [-2, 8.5]]) { const [x, y] = P.q(X, 0, Z), k = P.k(Z), h = k * 1.4; const m = B.maske(); m.kap(x, y, x, y - h, Math.max(.5, k * .03), Math.max(.5, k * .025)); m.kap(x - k * .15, y - h, x + k * .15, y - h, Math.max(.5, k * .02), Math.max(.5, k * .02)); const eb = K.eb(y); K.form(eb, m, Math.min(.5, Z / 60), holzMat(1.5, { rand: 1 })); K.e[eb].set(x, y - h - 1, B.pk(KUPFER[4])); draht(K, eb, last[0], last[1], x, y - h - 1, 4 + k * .05); last = [x, y - h - 1]; }
  draht(K, K.eb(ly), last[0], last[1], lx, ly - 2, 10);
  morse(K, P, .8, 4.8, 1.6, 1.25, 8 + Math.round(fr * 5), 4);
  morse(K, P, -3, 14, .4, 5, 6, 3);
  streifen(K, [[60, vy + 2], [140, vy + 14], [lx - 60, ly - 8], [lx - lr, ly]], 2);
  // Zelt, Schlitten, Kisten (Maßstab)
  { const [x, y] = P.q(-5.4, 0, 6), k = P.k(6); const z = B.maske(); z.poly([[x - k * .6, y], [x - k * .1, y - k * .7], [x + k * .55, y]]); K.form(K.eb(y), z, 0, holzMat(1.9, { k: ['#14100c', '#221a14', '#30261c', '#40332a', '#544436'], muster: px => ((Math.round(px - x) % 7) === 0 ? -.6 : 0) })); }
  { const [x, y] = P.q(5.8, 0, 7.5), k = P.k(7.5); schlitten(K, K.eb(y), x, y, k * .5, 0); }
  { const [x, y] = P.q(3.6, 0, 12), k = P.k(12); kiste(K, K.eb(y), x, y, k * .5, k * .35, 0); kiste(K, K.eb(y), x + k * .45, y, k * .4, k * .3, 0); }
  // Vordergrund: Presseis
  const v = B.maske(); v.poly([[-M, H + M], [-M, 220], [20, 214], [44, 236], [70, H + M]]); v.poly([[W + M, H + M], [W + M, 210], [462, 218], [430, 244], [418, H + M]]); K.form(5, v, 0, schneeMat(1.3, { fase: 3, k: EIS.slice(1, 7).concat([SCHNEE[6], SCHNEE[8]]) }));
  B.nebel(K.e[2], { y0: vy - 12, y1: vy + 6, col: B.mix(pal.nebel[1], SCHNEE[6], .3), dichte: .2, xs: [-20, 500, 60], seed: 6 });
  B.partikel(K, { n: 70, farben: [SCHNEE[7], SCHNEE[10], SCHNEE[12]], vx: -22, vy: 3, wob: 2, wf: .7, x0: 0, x1: 480, y0: 60, y1: 260, p: .8, hellSelten: 2 });
  K.reihen = [{ y: 166, skala: .9, nebel: .2 }, { y: 190, skala: 1, nebel: .08 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Wächter: Der Senderaum. Innen; hinten eine Fensterwand aus bereiften Scheiben, draußen fahler Schnee (die ruhige,
// helle Zone hinter dem Wächter), der Mast als dünne Senkrechte. Akkuregale links und rechts, Kabel über die
// Dielen zu einem Loch im Boden, aus dem orange Licht blinkt.
function senderaum(K) {
  const fr = K.fr, vy = 150, P = B.persp(240, vy); K.split = [160, 174];
  wand(K, vy, { lichter: [{ x: 240, y: 90, r: 230, s: .3 }] });
  fenster(K, 1, 130, 14, 220, 120, { mastX: 300, hell: .62 - fr * .25, aussen: ['#2a211b', '#3e3229', '#54463a', '#6d5d50', '#85735f', '#9c8a76', '#b2a08c', '#c4b2a0'] });
  akkuregal(K, 2, 10, vy + 4, 100, 100, .05);
  akkuregal(K, 2, 372, vy + 4, 100, 100, .05);
  kabelDecke(K, 1, 4, 20, 120, 50); kabelDecke(K, 1, 3, 360, 470, 40);
  dielen(K, P, vy, { lichter: [{ x: 240, y: vy + 6, r: 200, s: .35 }] });
  // Kabel von beiden Seiten zu einem Loch im Boden vorn links
  const [hx, hy] = P.q(-2.6, 0, 2.6), hk = P.k(2.6);
  const loch = B.maske(); loch.ell(hx, hy, hk * .45, hk * .12); B.form(K.e[4], loch, { k: [B.pk('#000000'), B.pk('#0a0402'), B.pk('#2a1206')], ton: .3, fase: 0, rand: 0, verlauf: -.5 });
  for (const [x0, y0] of [[60, vy + 4], [110, vy + 6], [400, vy + 6], [440, vy + 4]]) { const m = B.maske(); const pts = [[x0, y0], [(x0 + hx) / 2 + (x0 > 240 ? 30 : -10), (y0 + hy) / 2 + 6], [hx + (x0 > 240 ? 10 : -10), hy - 2]]; m.pfad(pts, 1.4, 2.2); K.form(K.eb((y0 + hy) / 2), m, 0, eisenMat(1.3, { k: ['#040303', '#0a0705', '#130d09', '#1e150f'] })); }
  B.gluehen(K.e[4], hx, hy, hk * .7, OR_G2, .9);
  K.anim.push({ p: B.PAR[4], f(ctx, t, ox, oy) { const bit = MORSE[Math.floor(t * 3.2) % MORSE.length]; if (!bit) return; ctx.fillStyle = OR; ctx.fillRect(Math.round(hx - hk * .3) + ox, Math.round(hy) + oy, Math.round(hk * .6), 1); ctx.fillStyle = OR_K; ctx.fillRect(Math.round(hx) + ox, Math.round(hy) + oy, 2, 1); } });
  K.licht(hx, hy, OR, 70, .5);
  // Vordergrund: Akku-Ecke links, Kabel rechts
  const v = B.maske(); v.rect(-M, 228, 40, 60); v.kap(420, H + M, 486, 228, 6, 4); K.form(5, v, 0, holzMat(1.1));
  B.partikel(K, { n: 16, farben: [HOLZ[5], SCHNEE[8]], vx: 1, vy: .5, wob: 1.5, wf: .2, x0: 0, x1: 480, y0: 0, y1: 240, p: .8 });
  K.reihen = [{ y: 172, skala: .9, nebel: .12 }, { y: 194, skala: 1, nebel: .05 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}

// Übergang: Am Loch. Die Litze führt hinab ins Dunkel, und von unten kommt Licht (zur Pforte).
function hinab(K) {
  const vy = 120, P = B.persp(240, vy); K.split = [132, 150];
  himmel(K, vy, 240, .3);
  schneeBoden(K, P, vy, { blank: .6, hell: -.04 });
  const [lx, ly] = P.q(0, 0, 2.8), k = P.k(2.8);
  for (let i = 0; i < 7; i++) { const m = B.maske(); m.ell(lx, ly + i * 3, k * (1.25 - i * .05), k * (.32 - i * .012)); m.ell(lx, ly + i * 3 + 3, k * (1.25 - i * .05) - 3, k * (.32 - i * .012) - 1, 0); K.form(4, m, 0, schneeMat(1.4 - i * .16, { k: EIS.slice(0, 6), fase: 0, rand: i < 2 ? 2 : 0 })); }
  const sch = B.maske(); sch.ell(lx, ly + 18, k * .95, k * .24); B.form(K.e[4], sch, { k: [B.pk('#000000'), B.pk('#050302'), B.pk('#1a0c05'), B.pk('#3a1a08')], ton: .6, fase: 0, rand: 0, verlauf: -1.4 });
  draht(K, 4, 120, -M, lx + 4, ly + 20, 30); draht(K, 4, 140, -M, lx + 9, ly + 22, 40);
  B.gluehen(K.e[4], lx, ly + 22, k * .9, OR_G2, .9); K.licht(lx, ly + 22, OR, k * 2, .6);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { for (let i = 0; i < 10; i++) { const q = frac(t * .09 + i / 10); const bit = MORSE[(Math.floor(t * 3.2) + i) % MORSE.length]; if (!bit) continue; ctx.fillStyle = q < .5 ? OR_K : OR; ctx.fillRect(Math.round(lx - k * .4 + i * k * .08) + ox, Math.round(ly + 20 + q * 6) + oy, 1, 1); } } });
  const v = B.maske(); v.poly([[-M, H + M], [-M, 210], [40, 230], [70, H + M]]); v.poly([[W + M, H + M], [W + M, 200], [440, 226], [410, H + M]]); K.form(5, v, 0, schneeMat(1.2, { fase: 3 }));
  B.partikel(K, { n: 50, farben: [SCHNEE[7], SCHNEE[10]], vx: -16, vy: 4, wob: 2, wf: .7, x0: 0, x1: 480, y0: 0, y1: 260, p: .8 });
  K.reihen = [{ y: 170, skala: .9, nebel: .2 }, { y: 192, skala: 1, nebel: .08 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Krämer: der Proviantmeister vor der Hütte, Kisten, die Liste auf einem Brett, eine Laterne
function proviant(K, x, y) {
  kiste(K, 4, x - 30, y, 30, 18, 0); kiste(K, 4, x - 32, y - 18, 22, 14, 0); kiste(K, 4, x + 18, y, 26, 12, 0);
  const b = B.maske(); b.rect(x - 4, y - 46, 3, 46); b.rect(x - 10, y - 46, 18, 22); K.form(4, b, 0, holzMat(1.6));
  for (let i = 0; i < 6; i++) for (let j = 0; j < 12; j++) if ((i * 7 + j * 3) % 5) K.e[4].set(x - 8 + j, y - 43 + i * 3, B.pk(i === 5 && j > 6 ? OR : PAPIER));
  B.flamme(K, x + 30, y - 18, { p: .5, kern: OR_K, mitte: '#ffb050', aussen: '#a04a10', glut: OR_G, gross: 1.3 });
  for (const i of [3, 4]) B.gluehen(K.e[i], x + 30, y - 16, 60, OR_G2, .9);
}
// Fund/Ereignis: eine Kiste der Expedition, halb offen, darin ein Kopfhörer, dessen Muschel glimmt
function fundkiste(K, x, y) {
  const m = B.maske(); m.rect(x - 16, y - 12, 32, 12); m.poly([[x - 16, y - 12], [x - 20, y - 26], [x + 14, y - 27], [x + 16, y - 12]]); K.form(4, m, 0, holzMat(1.8, { muster: (px, py) => (py === y - 6 ? -.8 : 0) }));
  const g = B.maske(); g.ell(x - 4, y - 13, 4, 3); g.ell(x + 6, y - 13, 4, 3); g.kap(x - 4, y - 16, x + 6, y - 16, .9, .9); K.form(4, g, 0, holzMat(1.4));
  K.e[4].set(x - 4, y - 13, B.pk(OR)); B.gluehen(K.e[4], x, y - 14, 22, OR_G2, .9);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (MORSE[Math.floor(t * 3.2) % MORSE.length]) { ctx.fillStyle = OR_K; ctx.fillRect(x + 6 + ox, y - 13 + oy, 1, 1); } } });
}
// Rast: der Kanonenofen brennt, zum ersten Mal seit 1912
function ofen(K, x, y) {
  const m = B.maske(); m.ell(x, y - 18, 13, 17); m.rect(x - 3, -M, 6, y - 30 + M); m.rect(x - 14, y - 4, 28, 4); K.form(4, m, 0, eisenMat(1.4, { rand: 2, fase: 1.5 }));
  for (let j = 0; j < 8; j++) for (let i = 0; i < 10; i++) K.e[4].set(x - 5 + i, y - 22 + j, B.pk(j < 2 ? '#d06a1c' : (i + j) % 3 ? OR : '#ffd08a'));
  for (const i of [2, 3, 4]) B.gluehen(K.e[i], x, y - 18, 110, OR_G2, .9); K.licht(x, y - 18, OR, 120, 1);
  B.flamme(K, x, y - 16, { p: .5, kern: OR_K, mitte: '#ffb050', aussen: '#a04a10', glut: OR_G, gross: 1.5 });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' || art === 'werkstatt' ? 1 : art === 'kraemer' ? 0 : art === 'ereignis' || art === 'fund' ? 2 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = senderaum(K);
  else if (art === 'uebergang') info = hinab(K);
  else info = [amMast, funkraum, eislochSzene][v](K);
  if (art === 'fund' || art === 'ereignis') fundkiste(K, info.mitte[0] + 40, info.mitte[1]);
  else if (art === 'kraemer') proviant(K, info.mitte[0] + 40, info.mitte[1] - 2);
  else if (art === 'rast') ofen(K, info.mitte[0] + 60, info.mitte[1]);
  else if (art === 'werkstatt') B.werkbank(K, info.mitte[0] + 40, info.mitte[1] + 4);
  return K.fertig();
}
World._biome.funkstation = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 3, knick: .7, grossX: 108, stein: ['#1e140e', '#33231a', '#4e3828', '#7a5a44'] } };
if (World.BIOME.indexOf('funkstation') < 0) World.BIOME.push('funkstation');
})();
