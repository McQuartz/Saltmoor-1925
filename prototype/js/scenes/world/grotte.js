// Saltmoor 1925 · Hintergründe: Akt 2, Die Grotte der Gaben (Biom-Paket grotte).
// Komposition: docs/auftrag-2/biome/grotte.md
// Eine Wallfahrtsgrotte in der Steilküste: nasser Schiefer, eine Quelle, Krücken an der Wand,
// Wachsgaben, Kerzen zu tausenden. Wahrzeichen: die Madonna aus Tropfstein, die zur Wand blickt.
// Falsches Detail: die Wachsgaben sind warm, und auf dem Boden werden es mehr.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#050608', '#0b0e12', '#151a20', '#212831'], rand: ['#a48a4c', '#f4e2a6'], augen: '#ff6a3c', nebel: ['#121418', '#2a2822'], fern: '#2a2620' };
// nasser Schiefer, dunkel -> hell (mit kaltem Glanz oben)
const SCH = ['#030405', '#06080a', '#0a0d10', '#0f1317', '#151a1f', '#1c2229', '#252c34', '#303841', '#3e4752', '#56606b'];
// Höhlenwand im Kerzenschein: Schiefer, der warmes Licht zurückwirft (heller als die Figuren, damit sie stehen)
const WAND = ['#07080a', '#0d0f12', '#15161a', '#1e1e20', '#2a2724', '#38322a', '#4a3f30', '#5e4e38'];
const WACHS = ['#1c130b', '#2e2012', '#46301a', '#644624', '#8a6634', '#b48c4c', '#d8b468', '#f0d8a0', '#fff2d0'];
const TROPF = ['#14130f', '#211f19', '#302d25', '#423e33', '#575144', '#6e6754', '#8a8168', '#a89d80', '#c8bc9c'];
const HOLZ = ['#0a0806', '#140f0b', '#1f1711', '#2c2118', '#3a2c20', '#4c3a2a'];
const ROT = ['#2a0806', '#4a100a', '#6e1a10', '#9a2a18'];
const RIM = ['#a48a4c', '#f4e2a6'], RIMK = ['#4c5a68', '#a8bccc'];
const FL = { kern: '#fff4dc', mitte: '#ffb04a', aussen: '#c0521c', glut: '#4a2a10' };
const GLUT = '#5a3416', GLUTW = '#3a2410';

// Schiefer: geneigte Schichten, nasse senkrechte Glanzspuren, Rauschen
const schiefer = (sd, neig, st) => (x, y) => {
  const lage = Math.floor((y + x * (neig || .3)) / (st || 5));
  let t = ((lage % 3) === 0 ? -.35 : 0) + (B.hash(lage, 0, sd) - .5) * .4 + (B.fbm(x * .05, y * .025, sd, 2) - .5) * .5;
  if (B.hash(x >> 1, 7, sd) > .93 && B.rausch2(x * .2, y * .09, sd + 3) > .62) t += .6;
  return t;
};
const mat = (K, tiefe, k, x) => K.mat(tiefe, Object.assign({ k, r: RIM }, x || {}));

// ---------------------------------------------------------------------
// Kerzen: Liste [x, y, h, art (0 Wachs, 1 rot, 2 weiß), an]. Statisch in die Ebene, Flackern animiert.
function kerzen(K, eb, liste, o) {
  o = o || {}; const e = K.e[eb], an = [], tiefe = o.tiefe || 0;
  const KOERPER = [[WACHS[5], WACHS[3]], [ROT[3], ROT[1]], [WACHS[7], WACHS[5]]].map(p => p.map(c => B.pk(B.mix(c, K.fern, tiefe))));
  const fm = B.pk(FL.mitte), fa = B.pk(FL.aussen), fk = B.pk(FL.kern);
  for (const [x, y, h, art, brennt] of liste) {
    const c = KOERPER[art || 0];
    for (let j = 0; j < h; j++) { e.set(x, y - j, j === h - 1 ? c[0] : c[j % 2]); }
    if (brennt) { e.set(x, y - h, fa); e.set(x, y - h - 1, h > 2 ? fm : fa); an.push([x, y - h - 1, B.hash(x, y, 3) * 6.28, .8 + B.hash(y, x, 4) * 1.4]); }
  }
  const p = B.PAR[eb];
  K.anim.push({ p, f(ctx, t, ox, oy) {
    for (const [x, y, ph, sp] of an) {
      const v = Math.sin(t * sp * 2.3 + ph) + Math.sin(t * sp * 5.1 + ph * 2) * .5;
      if (v > .6) { ctx.fillStyle = FL.kern; ctx.fillRect(x + ox, y + oy, 1, 1); ctx.fillStyle = FL.mitte; ctx.fillRect(x + ox, y - 1 + oy, 1, 1); }
      else if (v > -.4) { ctx.fillStyle = FL.mitte; ctx.fillRect(x + ox, y + oy, 1, 1); }
    }
  } });
  return an.length;
}
// Kerzenfeld auf einem Felsband: von x0 bis x1 an der Kante y(x), Dichte, Anteil brennend
function kerzenBand(K, eb, x0, x1, yf, o) {
  o = o || {}; const r = B.rng(Math.round(x0 * 31 + x1 * 7 + (o.seed || 0))), L = [];
  for (let x = x0; x < x1; x += o.abstand || 2) {
    if (r() < (o.luecke || .12)) continue;
    const y = Math.round(yf(x)), h = r.i(o.hMin || 1, o.hMax || 4);
    L.push([Math.round(x + r.j(.4)), y, h, r() < (o.rot || .3) ? 1 : r() < .3 ? 2 : 0, r() < (o.an === undefined ? .7 : o.an)]);
    if (o.doppelt && r() < o.doppelt) L.push([Math.round(x + 1), y - r.i(1, 2), r.i(1, 3), r() < .3 ? 1 : 0, r() < .6]);
  }
  return kerzen(K, eb, L, o);
}
// Krücke als Maske: Fuß (x,y), Winkel, Länge, Größe
function kruecke(m, x, y, a, l, s) {
  const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l, nx = -Math.sin(a), ny = Math.cos(a);
  m.kap(x, y, ex, ey, .7 * s, .8 * s);
  m.kap(ex - nx * 3.5 * s, ey - ny * 3.5 * s, ex + nx * 3.5 * s, ey + ny * 3.5 * s, 1 * s, 1 * s);
  const gx = x + Math.cos(a) * l * .62, gy = y + Math.sin(a) * l * .62; m.kap(gx - nx * 2.2 * s, gy - ny * 2.2 * s, gx + nx * 2.2 * s, gy + ny * 2.2 * s, .6 * s, .6 * s);
  // zweiter Holm (Achselkrücke: gegabelt)
  m.kap(x + nx * .4 * s, y + ny * .4 * s, ex + nx * 3 * s, ey + ny * 3 * s, .5 * s, .6 * s); m.kap(x, y, ex - nx * 3 * s, ey - ny * 3 * s, .5 * s, .6 * s);
}
// Kleine Wachsgaben an Schnüren: Hand, Bein, Herz, Augenpaar (Pixel, in Wachsfarben)
function votive(K, eb, liste, tiefe) {
  const e = K.e[eb], m = B.maske(), sc = B.pk(B.mix(SCH[7], K.fern, tiefe || 0));
  for (const [x, y, typ, schnur, g] of liste) {
    const s = g || 1;
    if (schnur) for (let j = 1; j <= schnur; j++) e.set(x, y - j, sc);
    if (typ === 'hand') { m.ell(x, y + 3 * s, 2 * s, 2.6 * s); for (let k = -1; k <= 2; k++) m.kap(x + k * 1.1 * s - .5, y + 4 * s, x + k * 1.3 * s - .5, y + 7.5 * s, .55 * s, .45 * s); m.kap(x - 2 * s, y + 3 * s, x - 3.4 * s, y + 5 * s, .5 * s, .4 * s); m.kap(x, y, x, y + 2 * s, 1.2 * s, 1.5 * s); }
    else if (typ === 'bein') { m.kap(x, y, x, y + 6 * s, 1.4 * s, 1 * s); m.kap(x, y + 6 * s, x - 2.5 * s, y + 6.8 * s, .9 * s, .8 * s); }
    else if (typ === 'herz') { m.ell(x - 1.2 * s, y + 1.2 * s, 1.6 * s, 1.5 * s); m.ell(x + 1.2 * s, y + 1.2 * s, 1.6 * s, 1.5 * s); m.poly([[x - 2.7 * s, y + 1.6 * s], [x + 2.7 * s, y + 1.6 * s], [x, y + 5 * s]]); }
    else { m.ell(x - 2 * s, y + 1, 2 * s, 1.3 * s); m.ell(x + 2.6 * s, y + 1, 2 * s, 1.3 * s); }
  }
  B.form(e, m, mat(K, tiefe || 0, WACHS.slice(2, 8), { ton: 2.2, fase: 1, rand: 1, schatten: 1 }));
  for (const [x, y, typ, , g] of liste) { if (typ === 'augen') { const s = g || 1; e.set(x - 2 * s, y + 1, B.pk(WACHS[1])); e.set(x + 2.6 * s, y + 1, B.pk(WACHS[1])); } B.gluehen(e, x, y + 3, 6 * (g || 1), GLUTW, .6); }
}
// Die Madonna aus Tropfstein: steht, das Gesicht zur Wand (Blick nach rechts), wir sehen Rücken und Schleier
function madonna(K, eb, x, yF, h, tiefe, o) {
  o = o || {}; const m = B.maske(), s = h / 100, d = o.dreh || 1; // d = 1: blickt nach rechts
  const P = (a, b) => [x + a * s * d, yF - b * s];
  // Sockel: gewachsener Tropfstein, unten breit, mit Wülsten
  m.poly([P(-26, 0), P(-19, 6), P(-15, 16), P(-13, 30), P(-12, 50), P(-11, 66), P(-9, 74), P(10, 74), P(12, 62), P(13, 44), P(15, 26), P(19, 10), P(28, 0)]);
  // Mantel über den Schultern, Kopf geneigt zur Wand (vorn rechts tiefer)
  m.poly([P(-11, 66), P(-12, 76), P(-8, 84), P(-1, 89), P(6, 89), P(12, 84), P(16, 76), P(15, 66)]);
  m.ell(...P(5, 90), 7.5 * s, 7 * s);
  // Schleier: über den Kopf, hinten weit herab
  m.poly([P(-3, 98), P(6, 99), P(12, 94), P(15, 86), P(12, 82), P(2, 86), P(-6, 82), P(-12, 70), P(-15, 50), P(-18, 30), P(-20, 18), P(-14, 22), P(-10, 46), P(-8, 64), P(-6, 78)]);
  // gefaltete Hände: ein Knick vorne vor der Brust
  m.poly([P(12, 70), P(19, 66), P(20, 60), P(13, 58)]);
  // Heiligenschein: ein dünner Ring aus Tropfstein hinter dem Kopf
  if (h > 30) { const [hx, hy] = P(2, 94); m.fn(hx - 14 * s, hy - 14 * s, hx + 14 * s, hy + 14 * s, (px, py) => { const q = Math.hypot((px - hx) / (12.5 * s), (py - hy) / (11.5 * s)); return q < 1 && q > 1 - Math.max(.14, 1.6 / (12 * s)); }); }
  const rillen = (px, py) => (Math.floor((px - x) * 1.1 / Math.max(.6, s)) % 4 === 0 ? -.45 : 0) + ((py % 7 === 0) && B.hash(px, py, 5) > .5 ? -.3 : 0) + (B.fbm(px * .1, py * .04, 9, 2) - .5) * .5;
  B.form(K.e[eb], m, mat(K, tiefe, TROPF.slice(o.dunkel ? 0 : 2, o.dunkel ? 6 : 9), { ton: o.ton || 2.4, fase: Math.max(1, 2 * s), verlauf: o.verlauf === undefined ? .8 : o.verlauf, verlaufX: o.vx || 0, muster: rillen, schatten: 2 }));
  // Tropfspitzen am Saum (sie wächst noch)
  const tm = B.maske(); for (const a of [-18, -13, -8]) { const [px, py] = P(a, 22 + (a + 18) * 1.6); tm.kap(px, py, px, py + 5 * s, 1.2 * s, .3); }
  B.form(K.e[eb], tm, mat(K, tiefe, TROPF.slice(2, 8), { ton: 2.5, fase: 0 }));
  return { kopf: P(5, 90), fuss: [x, yF] };
}
// Wachshaufen am Boden mit Händen, die herausragen; glimmt von innen (das falsche Detail)
function wachshaufen(K, eb, x, y, s, seed) {
  const r = B.rng(seed || x * 13 + y), m = B.maske();
  m.ell(x, y - 2 * s, 9 * s, 4 * s); m.ell(x - 4 * s, y - 4 * s, 5 * s, 4 * s); m.ell(x + 5 * s, y - 3 * s, 5 * s, 3 * s); m.ell(x, y, 12 * s, 2 * s);
  const n = r.i(1, 3);
  for (let i = 0; i < n; i++) {
    const bx = x + r.j(5 * s), a = -Math.PI / 2 + r.j(.7), l = r.f(5, 9) * s, ex = bx + Math.cos(a) * l, ey = y - 4 * s + Math.sin(a) * l;
    m.kap(bx, y - 4 * s, ex, ey, 1.4 * s, 1 * s);
    for (let k = -1; k <= 2; k++) { const fa = a + k * .22; m.kap(ex, ey, ex + Math.cos(fa) * 2.6 * s, ey + Math.sin(fa) * 2.6 * s, .55 * s, .45 * s); }
  }
  B.form(K.e[eb], m, mat(K, 0, WACHS.slice(0, 5), { ton: 1.4, fase: 1, schatten: 1, muster: (px, py) => (B.hash(px, py, 4) - .5) * .4 }));
  B.gluehen(K.e[eb], x, y - 4 * s, 14 * s, GLUT, .9);
  const g = B.glanzSprite(12 * s, '#2a1608', .7);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { if (Math.sin(t * .6 + x) < -.2) return; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - 4 * s - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}
// Tropfsteine von der Decke
function tropfsteine(K, eb, x0, x1, yT, lMax, tiefe, seed, dichte) {
  const r = B.rng(seed), m = B.maske();
  for (let x = x0; x < x1; x += r.i(2, 6)) {
    if (r() > (dichte || .7)) continue; const l = Math.pow(r(), 1.6) * lMax + 3, w = 1 + l * .07 + r() * 1.5;
    m.poly([[x - w, yT], [x + w, yT], [x + w * .25, yT + l * .8], [x, yT + l], [x - w * .25, yT + l * .8]]);
  }
  m.rect(x0 - 4, yT - 30, x1 - x0 + 8, 31);
  B.form(K.e[eb], m, mat(K, tiefe, SCH.slice(1, 8), { ton: 1.8, fase: 1, verlauf: -1, muster: schiefer(seed, .1, 4) }));
}
// Boden aus nassem Schiefer: Platten entlang der Fluchtlinien, Pfützen, die die Kerzen spiegeln
function bodenSchiefer(K, P, sd, o) {
  o = o || {}; const warm = o.warm || [0, 0, 0], wx0 = warm[0], wx1 = warm[1];
  K.bodenStoffe(P.vy + 1, H + M, [
    { cols: SCH.slice(0, 8), tf: (x, y) => {
      const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z);
      const px = X * 1.1 + B.rausch1(Z * .7, sd) * .8, pz = Z * .9 + B.rausch1(X * 1.3, sd + 1) * .5;
      const fx = px - Math.floor(px), fz = pz - Math.floor(pz);
      let t = .32 + B.hash(Math.floor(px), Math.floor(pz), sd) * .14 - Math.min(.2, Z / 60) + (1 - Math.min(1, Z / 6)) * -.08;
      if (fx * k / 1.1 < 1.1 || fz * k * k / P.h / .9 < .9) t -= .16;
      else if (fx * k / 1.1 < 2.2 && k > 14) t += .1;
      if (o.licht) t += o.licht(x, y) * .3;
      return t;
    } },
    { cols: ['#030405', '#07090c', '#0c1014', '#141a20', '#3a3020', '#7a5a2a', '#c8984a'], tf: (x, y) => {
      // Pfütze: dunkel, spiegelt warmes Licht in senkrechten Streifen unter dem Kerzenfeld
      const Z = P.z(y + .5); let t = .25 + Math.min(.15, 3 / Z);
      if (x > wx0 && x < wx1) { const q = Math.sin((x - wx0) / (wx1 - wx0) * Math.PI); if (Z > 1.6 && B.hash(x, 0, sd) < q * .4 && Math.sin(Z * 9 + B.hash(x, 1, sd) * 6) > .3) t += .4 + q * .3 * B.hash(x, 2, sd); }
      return t;
    } }
  ], (x, y) => {
    if (y <= P.vy + 1) return -1; const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; if (o.breite && Math.abs(X) > o.breite + (B.rausch1(Z * 2, sd) - .5) * .3) return -1;
    return B.fbm(X * .9, Z * .45, sd + 7, 3) > (o.pfuetzen || .62) ? 1 : 0;
  });
}
// Rand des Kerzenlichts auf nahen Flächen und Rauch, der steigt
function rauch(K, x0, x1, y0, y1, n) { B.partikel(K, { n: n || 40, farben: ['#2e2a24', '#3e3830', '#5a4a34'], vx: 1, vy: -6, wob: 3, wf: .4, x0, x1, y0, y1, hellSelten: 2.2, p: .5 }); }
function tropfen(K, x0, x1, y0, y1, n) { B.partikel(K, { n: n || 14, farben: ['#56606b', '#a8bccc'], vy: 70, x0, x1, y0, y1, laenge: 2, p: .9, hellSelten: 1.4 }); }

// =====================================================================
// Variante 0: Vor der Kerzenwand. Kerzen auf Felsstufen steigen nach rechts zur Madonna auf,
// links die Wand mit den Krücken, oben rechts ein Spalt, durch den kaltes Licht fällt.
function kerzenwand(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, P = B.persp(262, 150); K.split = [152, 162];
  // Ebene 0: Höhlenwand, warm vom Kerzenfeld, kalt oben rechts am Spalt
  B.feld(K.e[0], -M, -M, W + M, H + M, WAND, (x, y) => .25 + Math.max(0, 1 - Math.hypot((x - 250) * .6, (y - 130) * 1.1) / 200) * .45 - (Math.abs(x - 352) < 36 && y < 90 ? .15 : 0) - Math.max(0, (60 - y) / 200) + schiefer(sd, .25, 6)(x, y) * .25);
  // Madonna oben auf dem Felsen, mit dem Gesicht zur Wand rechts
  const fels = B.maske(); fels.poly([[250, 154], [262, 120], [290, 100], [318, 86], [340, 82], [370, 86], [384, 98], [392, 124], [400, 154]]);
  B.form(K.e[1], fels, mat(K, .2, SCH.slice(1, 8), { ton: 1.9, fase: 2, muster: schiefer(sd, .3, 4), schatten: 2 }));
  const mad = madonna(K, 1, 352, 86, 62, .12);
  // Wand, auf die sie blickt: glatt gerieben, als hätte man sie berührt
  const wr = B.maske(); wr.poly([[392, -M], [W + M, -M], [W + M, 170], [440, 160], [404, 126], [390, 96], [396, 50]]);
  B.form(K.e[2], wr, mat(K, .05, SCH.slice(0, 8), { ton: 2.2, fase: 3, muster: (x, y) => schiefer(sd + 2, .4, 5)(x, y) + (Math.hypot(x - 404, y - 70) < 16 ? .6 : 0), schatten: 2 }));
  // Spalt in der Wand oben rechts: kaltes Nachtlicht von der Küste, daher das Gegenlicht
  const spalt = B.maske(); spalt.poly([[432, -M], [462, -M], [458, 8], [448, 30], [444, 48], [438, 30], [436, 10]]);
  B.form(K.e[2], spalt, { k: ['#1c2632', '#2c3a4a', '#40546a', '#5a7088'].map(B.pk), r: [], ton: 1.4, fase: 0, rand: 0, verlauf: 1.4 });
  for (const L of [K.e[0], K.e[1]]) B.kegel(L, 446, 20, 2.3, .14, 240, '#1a2430', .5);
  K.licht(446, 20, '#a8bccc', 60, .5);
  // Kerzenfeld: Felsstufen, auf jeder eine Reihe Kerzen, Wachs läuft die Stufen hinab
  const stufen = [[180, 300, 142, -.02], [196, 330, 130, -.04], [214, 340, 118, -.05], [240, 350, 107, -.06], [270, 366, 97, -.04], [300, 380, 90, -.03]];
  const st = B.maske();
  stufen.forEach(([x0, x1, y, n]) => st.poly([[x0 - 6, y + 4], [x0, y], [x1, y + n * (x1 - x0)], [x1 + 4, y + 6 + n * (x1 - x0)], [x1, y + 12], [x0 - 6, y + 14]]));
  B.form(K.e[2], st, mat(K, .08, SCH.slice(1, 8), { ton: 1.6, fase: 1, muster: (x, y) => schiefer(sd + 5, .1, 3)(x, y) * .6 }));
  // Wachs, das über die Stufen läuft (helle Zungen auf dunklem Stein)
  const e2 = K.e[2], wp = WACHS.map(B.pk);
  stufen.forEach(([x0, x1, y, n], i) => { for (let x = x0; x < x1; x += 2) { if (B.hash(x, i, sd) > .55) continue; const l = 3 + Math.floor(B.hash(x, i + 9, sd) * 8), yy = Math.round(y + n * (x - x0)) + 1; for (let j = 0; j < l; j++) e2.set(x, yy + j, wp[Math.max(2, 6 - j - (j > l - 3 ? 2 : 0))]); } });
  let anz = 0;
  stufen.forEach(([x0, x1, y, n], i) => { anz += kerzenBand(K, 2, x0 + 2, x1 - 2, x => y + n * (x - x0), { abstand: i < 2 ? 2 : 3, an: fr < .6 ? .75 : .45, hMax: i < 3 ? 4 : 3, doppelt: .3, seed: i, tiefe: i * .03 }); });
  K.glut(275, 118, 120, GLUT, 1, [0, 1, 2]); K.glut(290, 130, 70, '#6a4418', .8, [2]); K.licht(280, 120, FL.mitte, 140, 1);
  // Kerzen zu Füßen der Madonna
  kerzenBand(K, 1, 330, 376, x => 86 + Math.abs(x - 352) * .08, { abstand: 2, an: .8, hMax: 3, seed: 40, tiefe: .1 });
  // Linke Wand mit Krücken und Wachsgaben, die Quelle tritt unten aus
  const lw = B.maske(); lw.poly([[-M, -M], [150, -M], [138, 30], [146, 70], [128, 120], [138, 160], [104, 176], [-M, 190]]);
  B.form(K.e[3], lw, mat(K, 0, SCH.slice(0, 8), { ton: 2, fase: 3, muster: schiefer(sd + 8, .5, 6), schatten: 2 }));
  const kr = B.maske(), r = B.rng(sd * 3 + 5);
  for (let i = 0; i < 9; i++) { const x = 14 + i * 13 + r.j(3), y = 158 - (i % 2) * 6; kruecke(kr, x, y, -Math.PI / 2 + (i % 2 ? .22 : -.18) + r.j(.08), 54 + r.i(-6, 6), 1.3); }
  for (let i = 0; i < 6; i++) { const x = 20 + i * 18, y = 96; kruecke(kr, x, y, -Math.PI / 2 + (i % 2 ? .35 : -.3), 40, 1.1); }
  B.form(K.e[3], kr, mat(K, 0, HOLZ, { ton: 2, fase: 0, rand: 1, schatten: 1 }));
  const vl = []; for (let i = 0; i < 12; i++) vl.push([10 + i * 11 + r.i(-2, 2), 28 + (i % 3) * 12 + r.i(0, 4), ['hand', 'bein', 'herz', 'augen'][i % 4], 4 + r.i(0, 6), 1.6]);
  for (let x = 4; x < 140; x++) K.e[3].set(x, 22 + Math.round(Math.sin(x * .05) * 2), B.pk(SCH[6]));
  votive(K, 3, vl, 0);
  B.gluehen(K.e[3], 120, 110, 60, GLUTW, .8);
  // Quelle: Wasser aus dem Fels in ein Becken
  const bk = B.maske(); bk.poly([[30, 178], [104, 174], [108, 182], [100, 192], [36, 194], [26, 186]]);
  B.form(K.e[4], bk, mat(K, 0, SCH.slice(1, 9), { ton: 2.2, fase: 1, schatten: 2 }));
  const e4 = K.e[4]; for (let x = 34; x < 100; x++) e4.set(x, 178, B.pk(x % 5 ? '#2e3a44' : '#7a6a48'));
  for (let y = 150; y < 178; y++) if (y % 4) e4.set(96 + ((y >> 3) & 1), y, B.pk(y % 3 ? '#56606b' : '#a8bccc'));
  // Boden
  bodenSchiefer(K, P, sd, { warm: [200, 400], licht: (x, y) => Math.max(0, 1 - Math.hypot(x - 280, (y - 160) * 2) / 160) });
  // Wachshaufen auf dem Boden: zwischen den Gegnern, mehr mit der Fremdheit
  const wh = [[196, 176, .9], [338, 172, .8], [410, 198, 1.1], [150, 214, 1.2], [270, 232, 1.4]];
  wh.slice(0, 3 + Math.round(fr * 2)).forEach(([x, y, s], i) => wachshaufen(K, K.eb(y), x, y, s, i + sd));
  // Vordergrund: Tropfsteine oben, Stalagmiten unten links und rechts, Kerzenstümpfe
  tropfsteine(K, 5, -M, 200, -2, 34, 0, sd + 11, .55);
  tropfsteine(K, 1, 150, 400, -4, 26, .25, sd + 17, .6);
  const vg = B.maske(); vg.poly([[-M, 230], [16, 208], [30, 214], [40, 236], [60, 250], [64, H + M], [-M, H + M]]); vg.poly([[W + M, 218], [460, 214], [446, 236], [430, 250], [424, H + M], [W + M, H + M]]);
  vg.poly([[W + M, 150], [470, 160], [462, 200], [458, 222], [W + M, 230]]); vg.poly([[-M, 190], [12, 196], [20, 214], [-M, 232]]);
  B.form(K.e[5], vg, mat(K, 0, SCH.slice(0, 6), { ton: 1.6, fase: 2, muster: schiefer(sd + 13, .3, 5) }));
  kerzen(K, 5, [[432, 250, 3, 1, true], [438, 252, 2, 0, fr < .7], [444, 248, 4, 0, true], [40, 238, 3, 1, true], [48, 244, 2, 0, false]]);
  K.glut(440, 246, 26, GLUT, .8, [5]); K.glut(42, 236, 22, GLUT, .8, [5]);
  B.nebel(K.e[2], { y0: 120, y1: 168, col: '#2a2620', dichte: .22, xs: [140, 420, 60], seed: 4 });
  rauch(K, 180, 380, 20, 150, 40); tropfen(K, 0, 220, 30, 260, 10);
  K.reihen = [{ y: 166, skala: .9, nebel: .32 }, { y: 190, skala: 1, nebel: .14 }, { y: 213, skala: 1, nebel: 0 }];
  void mad; return { mitte: [250, 206] };
}

// Variante 1: Der Gang der Gaben. Ein enger Gang, die Wände voller Krücken und Wachsgaben,
// am Boden zwei Reihen Kerzen als Fluchtlinien, hinten klein die Madonna, abgewandt.
function gang(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(236, 134); K.split = [148, 158];
  B.feld(K.e[0], -M, -M, W + M, H + M, WAND, (x, y) => .3 + Math.max(0, 1 - Math.hypot((x - 236) * .8, (y - 120) * 1.2) / 140) * .5 + schiefer(sd, .2, 5)(x, y) * .2);
  // Ende des Gangs: kleine Kammer, hell vom Kerzenlicht, darin die Madonna
  const ka = B.maske(); ka.ell(236, 112, 30, 34); ka.rect(206, 112, 60, 26);
  B.form(K.e[0], ka, mat(K, .3, SCH.slice(3, 10), { ton: 2.6, fase: 0, rand: 0, verlauf: .6, muster: schiefer(sd + 1, .2, 3) }));
  madonna(K, 1, 242, 142, 30, .2);
  kerzenBand(K, 1, 216, 260, x => 137 + Math.abs(x - 236) * .05, { abstand: 1, an: .85, hMax: 2, seed: 9, tiefe: .2 });
  K.glut(236, 124, 70, GLUT, 1, [0, 1]); K.licht(236, 124, FL.mitte, 80, .9);
  // Der Gang: Felsringe hintereinander, jeder mit einer unregelmäßigen Öffnung (organisch, kein Kasten)
  const sw = 2.7, hY = 3.4, ringe = [12, 8.6, 6.4, 4.8, 3.6, 2.6, 1.05];
  const loch = (Z, x, y) => {
    const k = P.k(Z), cx = P.vx + B.rausch1(Z * .7, sd) * 6, yb = P.q(0, 0, Z)[1], yt = P.q(0, hY, Z)[1], ym = (yb + yt) / 2 + (yb - yt) * .12;
    const a = Math.atan2(y - ym, x - cx), n = 1 + (B.rausch1(a * 2.2 + Z * 3, sd + Math.round(Z * 10)) - .5) * .32 + (B.hash(Math.round(a * 14), Math.round(Z * 10), sd) - .5) * .05;
    const rx = sw * k * n, ry = (yb - yt) * .62 * n;
    if (y > ym) return Math.abs(x - cx) < rx * (1 - Math.pow(Math.max(0, (y - ym) / (yb - ym + 1)), 6) * .1) && y < yb + 2;
    return ((x - cx) / rx) ** 2 + ((y - ym) / ry) ** 2 < 1;
  };
  ringe.forEach((Z, i) => {
    const m = B.maske(), yb = P.q(0, 0, Z)[1], eb = Z > 6 ? 1 : Z > 3 ? 2 : Z > 2.2 ? 3 : 5;
    m.fn(-M, -M, W + M - 1, H + M - 1, (x, y) => !loch(Z, x, y) && (eb < 5 || y < 150 || Math.abs(x - 240) > 205 - (y - 150) * .3));
    B.form(K.e[eb], m, mat(K, eb === 5 ? 0 : Math.min(.45, Z / 26), eb === 5 ? SCH.slice(0, 6) : WAND, { ton: eb === 5 ? 1.5 : 2.2 + Math.min(1.5, Z / 6), fase: Math.max(1, P.k(Z) * .04), muster: schiefer(sd + i, .2, 4 + i), schatten: 2 }));
    // an der nahen Innenkante: Krücken links an der Wand, Wachsgaben rechts, groß
    if (eb === 3 || eb === 2 && Z < 4) {
      const k = P.k(Z), kr = B.maske(), cx = P.vx, yt = P.q(0, hY, Z)[1];
      for (let j = 0; j < 5; j++) { const x = cx - sw * k * (.93 - j * .05) + j * 2, y = yb - 2 - (j % 2) * 4; kruecke(kr, x, y, -Math.PI / 2 + (j % 2 ? .2 : -.15), k * (.9 + (j % 3) * .12), Math.max(.6, k / 60)); }
      B.form(K.e[eb], kr, mat(K, Math.min(.3, Z / 30), HOLZ, { ton: 2, fase: 0, rand: 1, schatten: 1 }));
      const vg = []; for (let j = 0; j < 6; j++) vg.push([Math.round(cx + sw * k * (.86 - (j % 3) * .06)), Math.round(yt + (yb - yt) * (.25 + Math.floor(j / 2) * .15)), ['hand', 'herz', 'augen', 'bein', 'hand', 'herz'][j], 3 + j, Math.max(1, k / 45)]);
      votive(K, eb, vg, Math.min(.3, Z / 30));
    }
  });
  // Boden mit zwei Kerzenreihen an den Wänden: das sind die Fluchtlinien
  bodenSchiefer(K, P, sd + 1, { breite: sw * .95, warm: [170, 300], licht: (x, y) => { const Z = P.z(y + .5), X = Math.abs((x + .5 - P.vx) * Z / P.h); return Math.max(0, 1 - Math.abs(X - (sw - .3)) / .7) * .7; }, pfuetzen: .74 });
  const reihe = sd2 => { const L = []; for (let Z = 1.15; Z < 12; Z *= 1.045) { const [x, y] = P.q(sd2 * (sw - .3), 0, Z), k = P.k(Z); L.push([Math.round(x), Math.round(y), Math.max(1, Math.min(6, Math.round(k * .1 * (1 + B.hash(Math.round(Z * 30), sd2, sd))))), B.hash(Math.round(Z * 30), 3, sd) < .3 ? 1 : 0, B.hash(Math.round(Z * 30), 4, sd) < (fr < .6 ? .8 : .5)]); } return L; };
  const rl = reihe(-1), rr = reihe(1);
  kerzen(K, 4, rl.filter(c => c[1] >= 158)); kerzen(K, 3, rl.filter(c => c[1] < 158 && c[1] >= 148)); kerzen(K, 2, rl.filter(c => c[1] < 148));
  kerzen(K, 4, rr.filter(c => c[1] >= 158)); kerzen(K, 3, rr.filter(c => c[1] < 158 && c[1] >= 148)); kerzen(K, 2, rr.filter(c => c[1] < 148));
  for (const sd2 of [-1, 1]) for (let Z = 1.3; Z < 10; Z *= 1.25) { const [x, y] = P.q(sd2 * (sw - .3), .1, Z); K.glut(x, y - 4, Math.min(60, P.k(Z) * .5), GLUT, .7, [2, 3, 4]); }
  // Wachshaufen, die aus den Wänden fließen
  const wh = [[150, 176, .9], [300, 182, 1], [96, 214, 1.3], [380, 220, 1.4], [230, 160, .6]];
  wh.slice(0, 3 + Math.round(fr * 2)).forEach(([x, y, s], i) => wachshaufen(K, K.eb(y), x, y, s, i * 7 + sd));
  B.nebel(K.e[2], { y0: 104, y1: 152, col: '#2a2620', dichte: .25, xs: [140, 300, 40], seed: 6 });
  rauch(K, 120, 320, 30, 150, 30); tropfen(K, 100, 360, 20, 220, 10);
  K.reihen = [{ y: 166, skala: .9, nebel: .32 }, { y: 190, skala: 1, nebel: .14 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [230, 206] };
}

// Variante 2: Am Grottenmund. Rechts die Öffnung zur See (kalt, Nacht), links die Quelle,
// die aus dem Fels in einen Teich läuft; die Madonna steht im Mund, Rücken zum Meer, Blick zur Wand.
function mund(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(300, 160); K.split = [162, 170];
  // Draußen: Nachthimmel und See (kühl), Horizont bei y 128
  B.feld(K.e[0], -M, -M, W + M, H + M, ['#06080c', '#0a0e14', '#10161e', '#182230', '#223042', '#2c3e54'], (x, y) => y < 128 ? .25 + (y / 128) * .55 + (B.hash(x >> 2, y >> 2, 3) - .5) * .05 : .35 - (y - 128) / 300 + (Math.sin(y * 1.7 + B.rausch1(x * .05, y) * 4) > .7 ? .2 : 0));
  B.sterne(K.e[0], B.rng(sd + 2), 40, 250, 0, W + M, 110, ['#3a4a5e', '#6a7a8e', '#a8bccc']);
  for (let x = 250; x < W + M; x++) K.e[0].set(x, 128, B.pk(x % 3 ? '#3a4e66' : '#56708a'));
  // Höhlenrahmen: alles außer der Öffnung ist Fels
  const rm = B.maske(); rm.rect(-M, -M, W + 2 * M, H + 2 * M);
  rm.poly([[262, 170], [266, 120], [282, 70], [310, 34], [350, 16], [400, 14], [440, 30], [462, 70], [474, 120], [480, 170]], 0);
  B.form(K.e[2], rm, mat(K, .02, WAND, { ton: 1.6, fase: 3, muster: (x, y) => schiefer(sd, .35, 6)(x, y) + Math.max(0, 1 - Math.hypot(x - 200, y - 130) / 200) * 2.2, r: RIMK, schatten: 2 }));
  // Madonna in der Öffnung, Rücken zur See, das Gesicht zur Felswand links
  const fs = B.maske(); fs.poly([[262, 172], [274, 150], [300, 144], [330, 150], [338, 172]]);
  B.form(K.e[2], fs, mat(K, .05, SCH.slice(1, 8), { ton: 1.8, fase: 2, r: RIMK, muster: schiefer(sd + 1, .3, 3) }));
  madonna(K, 2, 300, 146, 74, .02, { dreh: -1, dunkel: true, ton: 1.4 });
  kerzenBand(K, 3, 270, 334, x => 150 + Math.abs(x - 300) * .1, { abstand: 2, an: fr < .6 ? .8 : .5, hMax: 3, doppelt: .4, seed: 12 });
  K.glut(300, 140, 60, GLUT, .9, [2, 3]); K.licht(300, 140, FL.mitte, 70, .8);
  // Quelle: links aus dem Fels, ein Faden, der in den Teich fällt; Teich spiegelt
  const tm = B.maske(); tm.ell(150, 196, 120, 20);
  B.form(K.e[4], tm, { k: ['#040506', '#080a0d', '#0e1216', '#161c22', '#2a2e30'].map(B.pk), r: [], ton: 1.2, fase: 0, rand: 0, muster: (x, y) => (Math.sin(y * 2.1 + Math.sin(x * .05) * 2) > .7 ? .9 : 0) + (B.hash(x, y, 2) > .985 ? 2 : 0) });
  const e4 = K.e[4];
  for (let y = 180; y < 214; y++) if (y % 3) { const q = (y - 180) / 34; for (let k = -2; k <= 2; k++) if (B.hash(300 + k, y, 9) < (1 - q) * .6) e4.set(300 + k * 2 + Math.round(Math.sin(y) * 1.5), y, B.pk(k ? '#5a4220' : '#b48c4c')); }
  const ufer = B.maske(); ufer.poly([[-M, 166], [80, 172], [180, 176], [262, 172], [300, 178], [W + M, 176], [W + M, 186], [280, 188], [270, 180], [180, 180], [60, 180], [-M, 178]]);
  B.form(K.e[3], ufer, mat(K, 0, SCH.slice(0, 8), { ton: 1.9, fase: 1, muster: schiefer(sd + 2, .1, 3), schatten: 1 }));
  // Quelle: tritt aus einem Riss im Schiefer, fällt als Faden in den Teich
  const riss = B.maske(); riss.poly([[80, 112], [96, 108], [104, 116], [90, 120]]);
  B.form(K.e[3], riss, { k: ['#000000', '#030405'].map(B.pk), r: [], ton: .5, fase: 0, rand: 0 });
  for (let y = 116; y < 180; y++) { const x = 94 + Math.round((y - 116) * .05); if (y % 6 !== 3) K.e[3].set(x, y, B.pk(y % 4 ? '#56606b' : '#a8bccc')); if (y > 172) K.e[3].set(x + ((y & 1) ? 2 : -2), y, B.pk('#3e4752')); }
  // Krücken links an die Wand gelehnt und Votivkerzen am Ufer
  const kr = B.maske(); for (let i = 0; i < 7; i++) kruecke(kr, 14 + i * 8, 166 + (i % 2) * 2, -Math.PI / 2 + .12 - i * .03, 40 + (i % 3) * 5, 1);
  B.form(K.e[3], kr, mat(K, 0, HOLZ, { ton: 2, fase: 0, rand: 1, schatten: 1 }));
  votive(K, 3, [[120, 70, 'hand', 6], [134, 84, 'herz', 4], [150, 64, 'augen', 8], [168, 80, 'bein', 5], [184, 72, 'hand', 7], [204, 88, 'herz', 3], [222, 66, 'augen', 6]], 0);
  kerzenBand(K, 3, 110, 250, x => 174 + Math.sin(x * .04) * 1.5, { abstand: 3, an: fr < .6 ? .7 : .4, hMax: 3, seed: 13 });
  K.glut(180, 168, 90, GLUTW, .8, [2, 3, 4]);
  // Boden vorne: nasser Schiefer, Wachshaufen
  const Pb = B.persp(300, 168);
  B.feld(K.e[4], -M, 186, W + M, H + M, SCH.slice(0, 8), (x, y) => { const Z = Pb.z(y + .5), X = (x + .5 - Pb.vx) * Z / Pb.h, k = Pb.k(Z); const fx = X * 1.2 - Math.floor(X * 1.2); return .3 + B.hash(Math.floor(X * 1.2), Math.floor(Z), sd) * .15 - (fx * k / 1.2 < 1.1 ? .16 : 0) + Math.max(0, 1 - Math.hypot(x - 300, y - 190) / 120) * .25; });
  const wh = [[380, 196, 1], [120, 230, 1.3], [250, 238, 1.1], [430, 240, 1.4]];
  wh.slice(0, 2 + Math.round(fr * 2)).forEach(([x, y, s], i) => wachshaufen(K, 4, x, y, s, i * 5 + sd));
  B.wasserGlanz(K, { x0: 40, x1: 260, y0: 180, y1: 214, n: 50, farben: ['#2e3a44', '#56606b', '#7a6a48'], p: .5, schwelle: .7 });
  B.partikel(K, { n: 30, farben: ['#3a4e66', '#6a7a8e'], vx: -14, vy: 2, wob: 2, wf: .5, x0: 262, x1: 480, y0: 20, y1: 170, p: .1 });
  rauch(K, 260, 340, 60, 150, 16); tropfen(K, 0, 260, 0, 180, 12);
  K.reihen = [{ y: 176, skala: .9, nebel: .3 }, { y: 196, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [250, 210] };
}

// Wächter: die Madonna nah und riesig, rechts, mit dem Gesicht zur Wand; zu ihren Füßen ein Berg
// aus Kerzen und Wachs. Untersicht. Beim Übergang: dort, wohin sie blickt, ein Spalt mit Stufen nach unten.
function nah(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, P = B.persp(230, 190); K.split = [192, 200];
  B.feld(K.e[0], -M, -M, W + M, H + M, WAND, (x, y) => .22 + Math.max(0, 1 - Math.hypot((x - 300) * .6, y - 190) / 240) * .5 - Math.max(0, (50 - y) / 160) + schiefer(sd, .3, 7)(x, y) * .25);
  tropfsteine(K, 1, -M, W + M, -4, 40, .25, sd + 3, .5);
  // die Wand, auf die sie blickt (rechts), mit Wachsfluss
  const wr = B.maske(); wr.poly([[420, -M], [W + M, -M], [W + M, 210], [440, 200], [430, 140], [414, 60]]);
  if (cfg.spalt) wr.poly([[436, 200], [446, 120], [452, 80], [460, 120], [470, 200]], 0);
  B.form(K.e[2], wr, mat(K, .04, SCH.slice(0, 8), { ton: 2.3, fase: 3, muster: schiefer(sd + 2, .4, 5), schatten: 2 }));
  if (cfg.spalt) {
    const sp = B.maske(); sp.poly([[436, 200], [446, 120], [452, 80], [460, 120], [470, 200]]);
    B.form(K.e[1], sp, { k: ['#000000', '#020203', '#040506', '#07090b'].map(B.pk), r: [], ton: .6, fase: 0, rand: 0, verlauf: -.8 });
    for (let i = 0; i < 7; i++) { const y = 196 - i * 8, w = 14 - i * 1.4; B.linie(K.e[1], 453 - w / 2, y, 453 + w / 2, y, B.pk(i < 3 ? SCH[6] : SCH[4])); }
    for (let y = 90; y < 200; y += 3) K.e[1].set(452 + Math.round(Math.sin(y * .2)), y, B.pk('#56606b'));
  }
  // Wachsberg zu ihren Füßen, voller Kerzen
  const berg = B.maske(); berg.poly([[200, 204], [240, 176], [290, 160], [340, 150], [390, 152], [430, 168], [460, 196], [470, 210]]);
  B.form(K.e[2], berg, mat(K, 0, WACHS.slice(0, 6), { ton: 1.1, fase: 2, muster: (x, y) => (B.fbm(x * .08, y * .1, sd + 4, 2) - .5) * .9 + (B.hash(x >> 1, 3, sd) > .8 ? .5 : 0), schatten: 2 }));
  const kb = []; const r = B.rng(sd + 77);
  for (let i = 0; i < 260; i++) { const x = r.i(214, 462), top = x < 340 ? 204 - (x - 200) * .4 : 150 + (x - 340) * .45; const y = Math.round(top + Math.pow(r(), 1.5) * 30); if (y > 206) continue; kb.push([x, y, r.i(2, 7), r() < .35 ? 1 : r() < .3 ? 2 : 0, r() < (fr < .6 ? .65 : .4)]); }
  kerzen(K, 2, kb);
  K.glut(330, 170, 160, GLUT, 1, [0, 1, 2]); K.glut(340, 180, 80, '#7a5020', .7, [2]); K.licht(330, 170, FL.mitte, 160, 1);
  // die Madonna: groß, im Halbprofil zur Wand, rechts der Mitte
  madonna(K, 2, 372, 156, 150, 0, { dunkel: true, ton: .5, verlauf: .7, vx: 2.2 });
  // Wachsgaben am Berg: Hände, die zu ihr hinauf greifen
  const hm = B.maske();
  for (const [x, y, a, l] of [[262, 176, -1.2, 18], [292, 166, -1.05, 22], [318, 158, -.95, 16], [244, 186, -1.35, 12], [410, 160, -2.1, 14]]) {
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l; hm.kap(x, y, ex, ey, 2.2, 1.6);
    for (let k = -1; k <= 2; k++) { const fa = a + k * .2; hm.kap(ex, ey, ex + Math.cos(fa) * 5, ey + Math.sin(fa) * 5, .9, .6); }
  }
  B.form(K.e[3], hm, mat(K, 0, WACHS.slice(1, 7), { ton: 1.8, fase: 1, schatten: 1 }));
  // Boden: Schiefer, Untersicht
  bodenSchiefer(K, P, sd + 3, { warm: [240, 460], pfuetzen: .6, licht: (x, y) => Math.max(0, 1 - Math.hypot(x - 330, (y - 200) * 2) / 180) });
  const wh = [[130, 214, 1.2], [96, 240, 1.5], [250, 236, 1.3]]; wh.slice(0, 1 + Math.round(fr * 2)).forEach(([x, y, s], i) => wachshaufen(K, 4, x, y, s, i * 3 + sd));
  // links: Krücken, zu einem Haufen geworfen
  const kr = B.maske(); for (let i = 0; i < 9; i++) kruecke(kr, 20 + i * 9, 206 - (i % 2) * 4, -Math.PI / 2 - .5 + i * .12, 50, 1.1);
  B.form(K.e[3], kr, mat(K, 0, HOLZ, { ton: 2, fase: 0, rand: 1, schatten: 1 }));
  const vg = B.maske(); vg.poly([[-M, 180], [20, 196], [34, 232], [50, 252], [56, H + M], [-M, H + M]]);
  B.form(K.e[5], vg, mat(K, 0, SCH.slice(0, 6), { ton: 1.5, fase: 2, muster: schiefer(sd + 9, .3, 5) }));
  rauch(K, 220, 460, 0, 170, 50); tropfen(K, 0, 420, 20, 260, 12);
  K.reihen = [{ y: 196, skala: .9, nebel: .28 }, { y: 206, skala: 1, nebel: .12 }, { y: 218, skala: 1, nebel: 0 }];
  return { mitte: [200, 212] };
}

// Kerzenkreis statt Lagerfeuer (Rast) und Stand der Kerzenfrau (Krämer)
function kerzenkreis(K, x, y) {
  const L = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; L.push([Math.round(x + Math.cos(a) * 18), Math.round(y + Math.sin(a) * 5), 2 + (i % 3), i % 4 === 0 ? 1 : 0, true]); }
  const st = B.maske(); st.ell(x, y + 1, 24, 7); B.form(K.e[4], st, mat(K, 0, SCH.slice(1, 7), { ton: 1.6, fase: 1, schatten: 1 }));
  kerzen(K, 4, L); K.glut(x, y - 4, 90, GLUT, 1, [2, 3, 4]); K.licht(x, y - 4, FL.mitte, 90, 1);
  wachshaufen(K, 4, x, y + 1, .7, 3);
}
function kerzenfrau(K, x, y) {
  const m = B.maske(); m.rect(x - 34, y - 24, 68, 5); m.rect(x - 30, y - 19, 4, 19); m.rect(x + 26, y - 19, 4, 19);
  m.kap(x - 36, y - 80, x - 36, y, 1.4, 1.6); m.kap(x + 36, y - 84, x + 36, y, 1.4, 1.6); m.kap(x - 38, y - 76, x + 38, y - 80, 1.2, 1.2);
  B.form(K.e[4], m, mat(K, 0, HOLZ, { ton: 1.8, fase: 1, schatten: 2 }));
  // Kerzen in Bündeln, von der Stange hängend, und Gaben auf dem Tisch
  const L = []; for (let i = 0; i < 18; i++) L.push([x - 30 + i * 3.4 | 0, y - 25, 2 + (i * 7 % 5), i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 0, i % 4 === 0]);
  kerzen(K, 4, L);
  const e = K.e[4], wp = WACHS.map(B.pk);
  for (let i = 0; i < 9; i++) { const hx = x - 32 + i * 8; for (let j = 0; j < 4; j++) e.set(hx, y - 78 + j, B.pk(SCH[6])); for (let j = 0; j < 12 + (i % 3) * 3; j++) { e.set(hx, y - 74 + j, wp[5 - (j % 2)]); if (i % 2) e.set(hx + 1, y - 74 + j, wp[4]); } }
  votive(K, 4, [[x - 20, y - 32, 'herz', 0], [x - 4, y - 33, 'hand', 0], [x + 12, y - 31, 'augen', 0]], 0);
  K.glut(x, y - 30, 60, GLUT, .9, [3, 4]);
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' || art === 'rast' ? 2 : art === 'ereignis' || art === 'wandbild' ? 1 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = nah(K, {});
  else if (art === 'uebergang') info = nah(K, { spalt: true });
  else info = [kerzenwand, gang, mund][v](K);
  const x = info.mitte[0], y = info.mitte[1];
  if (art === 'rast') kerzenkreis(K, x, y + 10);
  else if (art === 'kraemer') kerzenfrau(K, x + 30, y - 2);
  else if (art === 'werkstatt') B.werkbank(K, x, y + 4);
  else if (art === 'fund' || art === 'ereignis') wachshaufen(K, 4, x, y + 4, 1.6, 21);
  return K.fertig();
}
World._biome.grotte = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 2, knick: .2, stein: ['#1c2229', '#252c34', '#303841', '#56606b'] } };
})();
