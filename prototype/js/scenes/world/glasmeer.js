// Saltmoor 1925 · Hintergründe: Akt IV, Das Glasmeer (Biom-Paket glasmeer).
// Komposition: docs/auftrag-2/biome/glasmeer.md. Bildaufbau „Spiegel“: Der Boden ist schwarzes Glas und
// spiegelt die Eisdecke darüber; in der Nähe sieht man durch das Glas hinunter ins grüne Polarlicht, in der
// Ferne nur den Spiegel. Wahrzeichen: eine riesige Gestalt, die es nur im Spiegelbild gibt (kopfüber im Boden,
// darüber ist nichts). Falsches Detail: dein eigenes Spiegelbild, klein, vorn im Glas, einen Schritt voraus.
// Gegenlicht: ein Riss in der Eisdecke oben rechts, in dem sich das grüne Licht von unten sammelt.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#020305', '#070b0f', '#0f181d', '#1b2a2e'], rand: ['#2c6a4c', '#aef2bc'], augen: '#6dff9e', nebel: ['#06100e', '#1c3a30'], fern: '#1a3430' };
const EIS = ['#020507', '#050c10', '#091419', '#0e1e22', '#15292c', '#1e3836', '#2a4a44', '#3a6254', '#507e66', '#6e9e80'];
const GLAS = ['#000102', '#02060a', '#050c10', '#09151a', '#0f2024', '#16302f', '#20403c', '#2c5248', '#3e6a5a'];
const NORD = ['#06160f', '#0b2a1c', '#124428', '#1b6a3c', '#2a9a56', '#4fd27a', '#9effbf'];
const OBS = ['#010203', '#04070a', '#080e12', '#0e171c', '#152227', '#1e3034'];
const HOLZ = ['#060504', '#0d0a08', '#16110d', '#201912', '#2c2218'];
const TUCH = ['#0a0d0c', '#131817', '#1d2423', '#29312f', '#38423f'];
const pkC = {}; const pk = c => pkC[c] || (pkC[c] = B.pk(c));
const ramp = (cols, t, x, y) => { t = B.clamp(t, 0, .9999) * (cols.length - 1); const k = Math.floor(t); return cols[Math.min(cols.length - 1, (t - k) > B.bay(x, y) ? k + 1 : k)]; };
const frac = v => v - Math.floor(v);

// ---------- Rauschen: Zellen (Eisplatten) ----------
let ZID = 0;
function zellen(x, y, s) {
  const ix = Math.floor(x), iy = Math.floor(y); let d1 = 9, d2 = 9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = ix + i + B.hash(ix + i, iy + j, s), cy = iy + j + B.hash(ix + i, iy + j, s + 7), d = Math.hypot(x - cx, y - cy);
    if (d < d1) { d2 = d1; d1 = d; ZID = B.hash(ix + i, iy + j, s + 13); } else if (d < d2) d2 = d;
  }
  return d2 - d1; // klein an den Kanten; ZID = Kennung der nächsten Zelle (0..1)
}
const rqq = (x, riss) => Math.max(0, 1 - Math.abs(x - riss[0]) / 50);
// Polarlicht: Vorhänge in der Tiefe (X seitlich, Z Tiefe), 0..1
function vorhang(X, Z, s, t) {
  t = t || 0; let v = 0;
  for (let k = 0; k < 3; k++) { const xx = X * (.55 + k * .2) + Math.sin(Z * (.5 + k * .17) + s + k * 2 + t * .3) * 1.2 + k * 1.7; v = Math.max(v, Math.pow(Math.max(0, Math.sin(xx * 1.3)), 6 - k) * (1 - k * .22)); }
  return v * (.6 + .4 * B.fbm(X * .6, Z * .4 + t * .05, s + 3, 2));
}

// ---------- Eisdecke (Ebene 0) und Spiegelboden ----------
// Die Decke liegt als Ebene über dem Auge (Höhe 1), der Boden darunter (Höhe 1); Weltkoordinaten X, Z.
// deckeT(x,y) gibt {t (Helligkeit 0..1), g (Grünanteil 0..1)}
function deckeFn(K, P, o) {
  const sd = K.o.seed + (o.sd || 0), riss = o.riss || [400, 14];
  return function (x, y) {
    const dy = Math.max(.6, P.vy - y), Z = P.h / dy, X = (x - P.vx) * Z / P.h;
    const z1 = zellen(X * .55 + 13, Z * .35, sd), id = ZID, z2 = zellen(X * 1.6, Z * 1.1, sd + 3);
    // jede Eisplatte hat ihre eigene Neigung: Licht vom Riss rechts trifft sie verschieden
    let t = .12 + id * .16 + B.fbm(X * .25, Z * .2, sd, 3) * .12 + Math.min(.16, Z / 80);
    const kw = .035 * Math.max(1, Z / 5);
    if (z1 < kw) t += .26 * (1 - z1 / kw); else if (z1 < kw * 2.2) t -= .05;
    if (z2 < kw * .7) t += .06;
    // Pressrücken: lange Wülste quer
    t += Math.pow(Math.max(0, Math.sin(Z * .9 + Math.sin(X * .3) * 1.4)), 12) * .12;
    // Riss oben rechts: Quelle des Gegenlichts
    const rq = Math.max(0, 1 - Math.hypot((x - riss[0]) / 130, (y - riss[1]) / 46));
    const rl = Math.max(0, 1 - Math.abs(y - riss[1] - (x - riss[0]) * .18 + (B.hash(x >> 3, 0, sd) - .5) * 5 + (B.hash(x >> 1, 1, sd) - .5) * 1.5) / (2.2 + 2 * rqq(x, riss))) * Math.max(0, 1 - Math.abs(x - riss[0]) / 100);
    t += rq * rq * .3 + rl * .55;
    const g = Math.max(0, vorhang(X * .3, Z * .2, sd, 0) - .35) * .9 * Math.min(1, Z / 4) + rl * .7 + rq * rq * .25;
    // Ferne: ruhig in Nebelfarbe auflösen (keine Struktur mehr, sonst flimmert es)
    const fern = B.clamp(1 - (dy - 6) / 30, 0, 1);
    return { t: t * (1 - fern) + fern * .3, g: g * (1 - fern), fern };
  };
}
function decke(K, P, o) {
  const f = deckeFn(K, P, o), e = K.e[0];
  for (let y = -M; y < P.vy; y++) for (let x = -M; x < W + M; x++) {
    const v = f(x, y); let c = ramp(EIS, v.t, x, y);
    if (v.g > .25 + B.bay(x, y) * .7) c = ramp(NORD, .1 + v.g * .45 + v.t * .2, x, y);
    e.d[(y + M) * B.EW + x + M] = pk(c);
  }
  return f;
}
// Spiegelboden: fern Spiegel der Decke, nah Blick ins Glas mit Polarlicht darunter, Risse als Fluchtlinien
function boden(K, P, fD, o) {
  o = o || {}; const sd = K.o.seed, risse = [];
  const rr = B.rng(sd * 31 + (o.sd || 0));
  for (let i = 0; i < (o.risse || 7); i++) risse.push({ X: rr.f(-6, 6), d: rr.f(-.25, .25), z0: rr.f(1, 4), z1: rr.f(6, 30), gr: rr() < .45 });
  const gruen = [];
  for (let y = P.vy; y < H + M; y++) {
    const e = K.e[K.eb(y)];
    for (let x = -M; x < W + M; x++) {
      const dy = Math.max(.5, y - P.vy), Z = P.h / dy, X = (x - P.vx) * Z / P.h, k = P.k(Z);
      if (o.nur && !o.nur(x, y, X, Z)) continue;
      const nah = B.clamp(3 / Z, 0, 1), spiegel = 1 - nah * .45; // Fresnel grob: fern Spiegel, nah durchsichtig
      const yc = P.vy - dy / 1.4, d = fD(x, yc);
      let t = d.t * .95 * spiegel + .04 + (B.fbm(X * .3, Z * .3, sd + 9, 2) - .5) * .04;
      // Fließbänder im Glas (wie in Obsidian): feine Linien in der Tiefe, nah sichtbar
      const fl = Math.sin(X * 2.2 + B.fbm(X * .2, Z * .25, sd + 4, 3) * 9 + Z * .15);
      if (fl > .93 && nah > .2) t += .12 * nah; else if (fl < -.96 && nah > .2) t -= .05;
      // Glanzbahn vom Riss oben rechts im Spiegel
      t += Math.max(0, 1 - Math.abs(x - (o.glanzX || 400) + (y - P.vy) * .25) / 22) * .2 * spiegel;
      // Schimmer hinter den Gegnern: das Glas im Mittelgrund fängt den Widerschein der ganzen Decke
      t += Math.max(0, 1 - Math.abs(y - (P.vy + 50)) / 60) * .1;
      let gr = d.g * spiegel * .45;
      // Polarlicht tief unter dem Glas: schmale Bänder, nur nah sichtbar
      const tv = vorhang(X * .9 + Math.sin(Z * .7 + X * .1) * 1.6 + 2, Z * .5 + 3, sd + 5, 0), tief = Math.max(0, tv - .3) / .7 * Math.min(1, nah * 1.6) * (o.licht || 1);
      gr = Math.max(gr, tief * .8);
      // Risse in der Glasfläche (Fluchtlinien), manche mit Licht
      for (const r of risse) { if (Z < r.z0 || Z > r.z1) continue; const Xr = r.X + r.d * Z + Math.sin(Z * 1.7 + r.X) * .06; const dd = Math.abs(X - Xr) * k; if (dd < .55) { t = .5; if (r.gr) gr = Math.max(gr, .7); } else if (dd < 1.4 && X > Xr) t += .05; }
      let c = ramp(GLAS, t, x, y);
      if (gr > .12 + B.bay(x, y) * .5) c = ramp(NORD, gr * .55, x, y);
      e.d[(y + M) * B.EW + x + M] = pk(c);
      if (tief > .25 && ((x + y * 3) & 5) === 0) gruen.push(x, y, tief);
    }
  }
  // ruhiges Wogen des Lichts unter dem Glas (nur einzelne Pixel, gedithert)
  const cs = [B.css(NORD[3]), B.css(NORD[4])];
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { for (let i = 0; i < gruen.length; i += 3) { const x = gruen[i], y = gruen[i + 1], v = gruen[i + 2] * (.5 + .5 * Math.sin(t * .7 + x * .045 - y * .02)); if (v > .45 + B.bay(x, y) * .4) { ctx.fillStyle = cs[v > .8 ? 1 : 0]; ctx.fillRect(x + ox, y + oy, 1, 1); } } } });
}
// Spiegelbild einer Maske: an der Fußlinie yb gekippt, verkürzt (ks), dunkel, unten ausdünnend
function spiegeln(K, m, yb, o) {
  o = o || {}; const ks = o.ks || .7, mm = B.maske(), lang = o.lang || 60;
  for (let y = Math.max(m.y0, -M); y <= Math.min(m.y1, yb); y++) for (let x = m.x0; x <= m.x1; x++) {
    if (!m.has(x, y)) continue; const y0 = Math.round(yb + 1 + (yb - y) * ks), y1 = Math.round(yb + 1 + (yb - y + 1) * ks);
    for (let ty = y0; ty < Math.max(y0 + 1, y1); ty++) { if (ty > H + M - 1) continue; const q = (ty - yb) / lang; if (q > 1 || (q > .35 && B.bay(x, ty) < (q - .35) * 1.6)) continue; mm.put(x, ty, 1); mm._grow(x, ty, x, ty); }
  }
  if (mm.leer()) return;
  const eb = o.eb === undefined ? K.eb(yb + 2) : o.eb;
  B.form(K.e[eb], mm, K.mat(o.tiefe || 0, { k: OBS.slice(0, 4), r: [B.mix(pal.rand[0], '#000', .3), pal.rand[0]], ton: .6, fase: 0, rand: 1, rimF: .1 }));
}
// Objekt auf dem Glas: Form + Spiegelbild
function aufGlas(K, eb, m, yb, tiefe, mat, so) {
  spiegeln(K, m, yb, Object.assign({ tiefe: Math.min(.9, tiefe + .1) }, so || {}));
  K.form(eb, m, tiefe, mat);
}

// ---------- Bausteine ----------
// Obsidian-Spitze: Splitter aus schwarzem Glas, schräg aus der Fläche
function spitze(K, eb, x, yb, h, w, neig, tiefe, gr) {
  const m = B.maske(), tx = x + neig * h;
  m.poly([[x - w, yb], [x - w * .5 + neig * h * .3, yb - h * .45], [tx - w * .2, yb - h], [tx + w * .15, yb - h * .9], [x + w * .6 + neig * h * .4, yb - h * .4], [x + w, yb]]);
  aufGlas(K, eb, m, yb, tiefe, { k: OBS, ton: 1.5, fase: Math.max(1, w * .15), muster: (px, py) => ((px - x) * .9 + (py - yb) * .25 > 0 && (px - x) * .9 + (py - yb) * .25 < 1.2 ? .9 : 0) + (B.hash(px >> 1, py >> 2, 5) - .5) * .25 }, { ks: .75, lang: h * .8 });
  if (gr) { const e = K.e[eb]; for (let k = 2; k < h * .7; k += 1) { const yy = yb - k, xx = x + neig * k + Math.sin(k * .7) * 1.2 - w * .1; if (B.bay(xx, yy) < .7) e.set(xx, yy, pk(k % 4 ? NORD[4] : NORD[5])); } K.glut(x + neig * h * .3, yb - h * .3, h * .5, '#0a2a18', .7, [eb]); }
}
// Eiszapfen von der Decke (hängt, Spitze nach unten)
function zapfen(K, eb, x, yt, h, w, tiefe) {
  const m = B.maske(); m.poly([[x - w, yt - 4], [x + w, yt - 4], [x + w * .45, yt + h * .55], [x + w * .1, yt + h], [x - w * .3, yt + h * .6]]);
  K.form(eb, m, tiefe, { k: EIS.slice(1, 8), r: [EIS[7], EIS[9]], ton: 2.6, fase: 1, verlauf: .8, muster: (px, py) => (frac((px - x) * .3) < .2 ? .5 : 0) });
}
// Die Gestalt, die es nur im Spiegel gibt. dir = +1: kopfüber im Boden (Füße an yb, Kopf unten),
// dir = -1: aufrecht (in der Spiegelwand). Lang, schmal, die Arme hängen bis unter die Knie, der Kopf zu klein
// und leicht geneigt. Innen dunkel mit Faltenwurf, außen ein Kranz aus Polarlicht, das hinter ihr steht.
function gestaltMaske(x, yb, h, dir) {
  const m = B.maske(), s = h / 100, Y = q => yb + dir * q * h;
  const kontur = [];
  const li = [[0, -6], [.12, -9], [.3, -11], [.5, -13], [.66, -14], [.78, -11], [.84, -6]], re = [[.84, 6], [.78, 11], [.66, 14], [.5, 12], [.3, 10], [.12, 8], [0, 6]];
  li.concat(re).forEach(([q, dx]) => kontur.push([x + dx * s + Math.sin(q * 9) * .8 * s, Y(q)]));
  m.poly(kontur);
  m.ell(x + 1.5 * s, Y(.915), 4.6 * s, 6.4 * s); m.kap(x, Y(.84), x + 1 * s, Y(.88), 2.4 * s, 2.4 * s);
  m.pfad([[x - 13 * s, Y(.78)], [x - 19 * s, Y(.56)], [x - 20 * s, Y(.34)], [x - 18 * s, Y(.2)]], 3.2 * s, 1.4 * s);
  m.pfad([[x + 13 * s, Y(.78)], [x + 19 * s, Y(.58)], [x + 21 * s, Y(.38)], [x + 22 * s, Y(.22)]], 3.2 * s, 1.4 * s);
  // Finger: lang, gespreizt
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const hx = x + sx * (19 + k * .8) * s, hy = Y(sx < 0 ? .2 : .22); m.kap(hx, hy, hx + sx * (k - 1) * 1.5 * s, hy + dir * -(6 + k) * s * -1, .7 * s, .5 * s); }
  return { m, Y, s };
}
function gestaltMalen(K, x, yb, h, dir, o) {
  o = o || {}; const { m, Y, s } = gestaltMaske(x, yb, h, dir), ok = o.sichtbar, ebF = o.eb !== undefined ? () => o.eb : y => K.eb(y), st0 = o.staerke || 1;
  for (let y = Math.max(-M, m.y0 - 4); y <= Math.min(m.y1 + 4, H + M - 1); y++) {
    const e = K.e[ebF(y)];
    for (let x2 = m.x0 - 4; x2 <= m.x1 + 4; x2++) {
      if (ok && !ok(x2, y)) continue; const inn = m.has(x2, y), q = Math.abs(y - yb) / h, st = st0 * (dir > 0 ? 1 - Math.max(0, q - .8) * 2 : 1), b = B.bay(x2, y);
      if (inn) {
        const rand = !m.has(x2 + 1, y) || !m.has(x2 - 1, y) || !m.has(x2, y + dir) || !m.has(x2, y - dir);
        if (rand) { if (st * (.55 + .45 * Math.sin(y * .5 + x2 * .3)) > b * .9) e.set(x2, y, pk(st > .75 && b < .45 ? NORD[5] : NORD[4])); else e.set(x2, y, pk(NORD[2])); continue; }
        // Faltenwurf: senkrechte Bahnen, die nach unten (zum Saum) auseinanderlaufen
        const fx = (x2 - x) / (s * (6 + q * 6)), falte = Math.sin(fx * 3.1 + Math.sin(q * 7) * .6);
        let c = GLAS[0]; if (falte > .82 && b < .6) c = GLAS[3]; else if (falte > .55 && b < .35) c = GLAS[2]; else if (falte < -.85) c = '#000000';
        // Licht dringt an der rechten Kante durch (Gegenlicht)
        if (!m.has(x2 + 3, y) && b < .5) c = NORD[2];
        e.set(x2, y, pk(c));
      } else {
        // Kranz: das Polarlicht hinter ihr, 1–3 px, gedithert
        let dmin = 9; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (m.has(x2 + dx, y + dy)) dmin = Math.min(dmin, Math.hypot(dx, dy));
        if (dmin < 3.5) { const v = st * (1 - dmin / 3.5) * .9; if (v > b) e.set(x2, y, pk(v > .6 ? NORD[3] : NORD[2])); }
      }
    }
  }
  // Augen: zwei Punkte, offen
  const ay = Math.round(Y(.915)), ax = Math.round(x + 1.5 * s), e = K.e[ebF(ay)];
  e.set(ax - Math.round(1.6 * s), ay, pk(NORD[6])); e.set(ax + Math.round(1.6 * s), ay, pk(NORD[5]));
  K.licht(ax, ay, NORD[5], 30 * s, .4);
  K.anim.push({ p: B.PAR[ebF(ay)], f(ctx, t, ox, oy) { if (Math.sin(t * .4 + x) > .97) return; ctx.fillStyle = NORD[6]; ctx.fillRect(ax - Math.round(1.6 * s) + ox, ay + oy, 1, 1); ctx.fillRect(ax + Math.round(1.6 * s) + ox, ay + oy, 1, 1); } });
  return m;
}
function gestalt(K, x, yb, h, o) { gestaltMalen(K, x, yb, h, 1, o); K.glut(x, yb + h * .8, 22, '#0c3a20', .7, [K.eb(Math.round(yb + h * .8))]); }
const P0 = yb => Math.floor(yb);
// Dein Spiegelbild: klein, kopfüber im Glas, von hinten, im Gehen (ein Bein vorn), oben ist niemand
function deinSpiegelbild(K, x, yb, h) {
  const m = B.maske(), s = h / 40, Y = q => yb + q * h;
  m.pfad([[x - 1 * s, Y(.48)], [x - 5 * s, Y(.22)], [x - 7 * s, Y(.02)]], 2 * s, 1.6 * s); // Bein vorn (Schritt)
  m.pfad([[x + 1 * s, Y(.48)], [x + 3 * s, Y(.24)], [x + 3 * s, Y(.02)]], 2 * s, 1.6 * s);
  m.poly([[x - 6 * s, Y(.45)], [x + 6 * s, Y(.45)], [x + 6 * s, Y(.8)], [x - 6 * s, Y(.8)]]);
  m.ell(x, Y(.9), 3.6 * s, 4 * s);
  m.pfad([[x - 6 * s, Y(.76)], [x - 8 * s, Y(.52)]], 1.6 * s, 1.3 * s); m.pfad([[x + 6 * s, Y(.76)], [x + 8 * s, Y(.54)]], 1.6 * s, 1.3 * s);
  B.form(K.e[K.eb(yb + 2)], m, K.mat(0, { k: OBS.slice(0, 3), r: [NORD[2], NORD[4]], ton: .4, fase: 0, rand: 1, rimF: -.2 }));
  K.glut(x, yb + h * .5, h * .6, '#06180e', .6, [K.eb(yb + 2)]);
}
// Schlitten der Expedition (Querblick), Kufen ins Glas gewachsen, Plane, Flagge
function schlitten(K, eb, x, yb, s, tiefe, flagge) {
  const m = B.maske();
  m.kap(x - 30 * s, yb - 1, x + 26 * s, yb - 1, 1.6 * s, 1.6 * s); m.pfad([[x + 26 * s, yb - 1], [x + 33 * s, yb - 5 * s], [x + 32 * s, yb - 10 * s]], 1.6 * s, 1.2 * s);
  for (let i = 0; i < 5; i++) m.rect(x - 26 * s + i * 13 * s, yb - 8 * s, 2 * s, 8 * s);
  m.rect(x - 28 * s, yb - 10 * s, 58 * s, 3 * s);
  m.poly([[x - 26 * s, yb - 10 * s], [x - 20 * s, yb - 24 * s], [x + 18 * s, yb - 26 * s], [x + 26 * s, yb - 10 * s]]);
  aufGlas(K, eb, m, yb, tiefe, { k: TUCH, ton: 1.6, fase: 1, muster: (px, py) => ((px - x) % Math.round(9 * s) === 0 ? -.6 : 0) + (py < yb - 11 * s && py > yb - 24 * s && frac((px - x + py) * .12) < .15 ? -.4 : 0), schatten: 2 }, { ks: .6, lang: 26 * s });
  if (flagge) { const f = B.maske(); f.kap(x + 20 * s, yb - 10 * s, x + 22 * s, yb - 62 * s, .8 * s, .7 * s); f.poly([[x + 22 * s, yb - 62 * s], [x + 40 * s, yb - 58 * s], [x + 38 * s, yb - 52 * s], [x + 22 * s, yb - 50 * s]]); aufGlas(K, eb, f, yb, tiefe, { k: TUCH, ton: 1.8, fase: 0, rand: 2 }, { ks: .6, lang: 40 * s }); }
}
// Zelt, halb im Glas versunken (die untere Hälfte fehlt, darunter schwach sichtbar im Glas)
function zelt(K, eb, x, yb, s, tiefe) {
  const m = B.maske(); m.poly([[x - 30 * s, yb], [x - 4 * s, yb - 30 * s], [x + 2 * s, yb - 31 * s], [x + 34 * s, yb], [x + 10 * s, yb + 1]]);
  m.kap(x - 1 * s, yb - 31 * s, x - 1 * s, yb - 40 * s, .8 * s, .6 * s);
  aufGlas(K, eb, m, yb, tiefe, { k: TUCH, ton: 1.5, fase: 1.2, schatten: 2, muster: (px, py) => (Math.abs(px - x + 1 * s - (py - yb + 31 * s) * .15) < 1 ? -.7 : 0) + (frac((px - x) * .08 + (py - yb) * .05) < .1 ? -.3 : 0) }, { ks: .55, lang: 18 * s });
  // Eingang: dunkles Dreieck mit grünem Schein von innen
  const t = B.maske(); t.poly([[x - 2 * s, yb - 22 * s], [x + 9 * s, yb], [x - 10 * s, yb]]); K.form(eb, t, tiefe, { k: ['#010302', '#02080a', '#06160f', '#0b2a1c'], ton: 0, fase: 0, rand: 0, verlauf: -1.4 });
  K.glut(x, yb - 6 * s, 26 * s, '#0a2a18', .8, [eb, eb + 1].filter(i => i < 5));
}
// Plattenkamera auf Dreibein, schwarzes Tuch
function kamera(K, eb, x, yb, s, tiefe) {
  const m = B.maske(); m.pfad([[x, yb - 30 * s], [x - 9 * s, yb]], 1 * s, .8 * s); m.pfad([[x, yb - 30 * s], [x + 8 * s, yb]], 1 * s, .8 * s); m.pfad([[x, yb - 30 * s], [x + 1 * s, yb]], .9 * s, .8 * s);
  m.rect(x - 6 * s, yb - 40 * s, 12 * s, 10 * s); m.rect(x - 11 * s, yb - 38 * s, 5 * s, 6 * s);
  m.poly([[x + 5 * s, yb - 41 * s], [x + 13 * s, yb - 39 * s], [x + 15 * s, yb - 24 * s], [x + 6 * s, yb - 28 * s]]);
  aufGlas(K, eb, m, yb, tiefe, { k: HOLZ, ton: 1.8, fase: .6, rand: 2 }, { ks: .6, lang: 26 * s });
  K.e[eb].set(x - 9 * s, yb - 35 * s, pk(NORD[5]));
}
// Plattenkasten, aufgesprungen, Scherben mit Gesicht nach oben
function plattenkasten(K, x, yb) {
  const m = B.maske(); m.poly([[x - 14, yb], [x - 13, yb - 12], [x + 13, yb - 13], [x + 14, yb]]); m.poly([[x - 13, yb - 12], [x - 20, yb - 20], [x + 6, yb - 22], [x + 13, yb - 13]]);
  aufGlas(K, 4, m, yb, 0, { k: HOLZ, ton: 1.8, fase: 1, schatten: 2 }, { ks: .6, lang: 16 });
  for (let i = 0; i < 6; i++) { const sx = x - 22 + i * 9 + (i % 2) * 2, sy = yb + 2 + (i % 3); const sc = B.maske(); sc.poly([[sx, sy], [sx + 6, sy - 1], [sx + 5, sy + 3], [sx - 1, sy + 3]]); K.form(4, sc, 0, { k: OBS, ton: 2.2, fase: 0, rand: 2 }); K.e[4].set(sx + 2, sy + 1, pk(NORD[5])); K.e[4].set(sx + 4, sy + 1, pk(NORD[4])); }
  K.glut(x, yb - 6, 28, '#0a2a18', .9, [3, 4]); K.licht(x, yb - 8, NORD[5], 40, .6);
}
// Spirituskocher mit grüner Flamme (Rast)
function kocher(K, x, y) {
  const m = B.maske(); m.rect(x - 7, y - 8, 14, 8); m.ell(x, y, 7, 2); m.rect(x - 9, y - 12, 18, 2); m.kap(x - 8, y - 12, x - 10, y - 1, .8, .8); m.kap(x + 8, y - 12, x + 10, y - 1, .8, .8);
  aufGlas(K, 4, m, y, 0, { k: OBS, ton: 2, fase: .6, rand: 2, schatten: 2 }, { ks: .7, lang: 14 });
  for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x, y - 14, 70, '#0a2e18', .9);
  K.licht(x, y - 14, NORD[5], 70, 1);
  const g1 = B.glanzSprite(26, '#0c3a1e', .75), g2 = B.glanzSprite(30, '#0c3a1e', .8), cols = [NORD[2], NORD[4], NORD[5], NORD[6]];
  K.luft.push({ p: .8, f(ctx, t, ox, oy) {
    const fl = Math.sin(t * 5.1) + Math.sin(t * 9.3) * .6; const g = fl > 0 ? g2 : g1;
    ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - 16 - g.R + oy); ctx.globalCompositeOperation = 'source-over';
    for (let k = 0; k < 4; k++) { ctx.fillStyle = cols[k]; const w = [8, 6, 3, 1][k], hh = [9, 7, 5, 2][k]; for (let j = 0; j < hh; j++) { const q = j / hh, ww = Math.max(1, Math.round(w * (1 - q) * (1 + .15 * Math.sin(t * 8 + j + k)))); ctx.fillRect(Math.round(x - ww / 2 + Math.sin(t * 4 + j * .7) * q * 2) + ox, y - 13 - j - k + oy, ww, 1); } }
  } });
}
// Schneekristalle aus der Decke (Diamantstaub), sinken langsam, blinken
function staub(K, n) { B.partikel(K, { n: n || 40, farben: ['#3a6254', '#6e9e80', '#c8ffd8'], vx: -1, vy: 3, wob: 3, wf: .4, x0: 0, x1: 480, y0: 0, y1: 230, blink: 1.6, hellSelten: 2.2 }); }
// Nebel: nur ein schmales Band am Horizont
function horizontDunst(K, P, d) { B.nebel(K.e[1], { y0: P.vy - 8, y1: P.vy + 1, col: '#163028', dichte: (d || .5) * .7, seed: 3 }); B.nebel(K.e[2], { y0: P.vy - 1, y1: P.vy + 7, col: '#122824', dichte: (d || .5) * .6, seed: 4 }); }

// =====================================================================
// Variante 0: Die Spiegelebene. Weite, flache Fläche bis zum Horizont, die Decke mit Eisplatten und Zapfen;
// die Gestalt steht kopfüber rechts im Spiegel; vorn links der Schlitten der Expedition mit Flagge.
function ebene(K) {
  const P = B.persp(214, 118); K.split = [150, 172];
  const fD = decke(K, P, { riss: [410, 12] });
  boden(K, P, fD, { glanzX: 410, risse: 8 });
  horizontDunst(K, P, .45);
  // ferne Obsidianspitzen am Horizont links, Zapfen in der Ferne
  [[22, 18, 5, .3], [48, 30, 7, -.1], [70, 14, 4, .2], [118, 10, 3, 0], [140, 22, 5, .25]].forEach(([x, h, w, n]) => spitze(K, 1, x, P.vy + 1, h, w, n, .65));
  [[260, 38, 6], [300, 22, 4], [330, 50, 8], [372, 26, 5], [180, 18, 3]].forEach(([x, h, w]) => zapfen(K, 1, x, 0, h, w, .55));
  [[90, 70, 12], [420, 64, 11], [455, 40, 7]].forEach(([x, h, w]) => zapfen(K, 2, x, -M, h, w, .3));
  // Wahrzeichen: die Gestalt im Spiegel, Füße am Horizont, kopfüber bis tief in den Boden
  gestalt(K, 352, P.vy + 2, 92, { staerke: .9 + K.fr * .3 });
  // nahe Splitter und der Schlitten
  spitze(K, 3, 410, 158, 34, 8, -.25, .1, true);
  spitze(K, 3, 120, 150, 22, 6, .3, .2);
  schlitten(K, 4, 70, 238, 1.35, 0, true);
  // vorn: Kante einer gekippten Glasplatte rechts unten, Splitter links
  const vg = B.maske(); vg.poly([[408, H + M], [432, 238], [470, 226], [W + M, 232], [W + M, H + M]]); K.form(5, vg, 0, { k: OBS, ton: 1.6, fase: 1.5, muster: (x, y) => (frac((x - y) * .07) < .08 ? .8 : 0) });
  const vg2 = B.maske(); vg2.poly([[-M, 246], [12, 238], [30, 252], [24, H + M], [-M, H + M]]); K.form(5, vg2, 0, { k: OBS, ton: 1.4, fase: 1.5 });
  // dein Spiegelbild: vorn im Glas, einen Schritt vor dir
  deinSpiegelbild(K, 196 + (K.o.seed % 3) * 6, 240, 34);
  staub(K, 46);
  return { mitte: [240, 205] };
}
// Variante 1: Das Lager. Das halb versunkene Zelt, Plattenkamera, ein Spalt in der Decke tiefer;
// Fluchtpunkt links, die Gestalt links im Spiegel, groß und nah.
function lager(K) {
  const P = B.persp(150, 128); K.split = [156, 176];
  const fD = decke(K, P, { riss: [380, 22], sd: 4 });
  boden(K, P, fD, { glanzX: 380, risse: 6, sd: 2 });
  horizontDunst(K, P, .5);
  [[300, 26, 6, -.2], [340, 16, 4, .1], [392, 34, 7, .25], [440, 20, 5, -.1]].forEach(([x, h, w, n]) => spitze(K, 1, x, P.vy + 1, h, w, n, .6));
  [[40, 30, 6], [96, 50, 9], [210, 34, 6], [250, 60, 10], [470, 44, 8]].forEach(([x, h, w]) => zapfen(K, 1, x, -2, h, w, .5));
  [[30, 86, 14], [196, 70, 12]].forEach(([x, h, w]) => zapfen(K, 2, x, -M, h, w, .25));
  gestalt(K, 92, P.vy + 2, 110, { staerke: 1 });
  zelt(K, 3, 330, 168, 1.2, .15);
  kamera(K, 3, 268, 166, 1, .15);
  spitze(K, 3, 430, 172, 28, 7, -.3, .1, true);
  // vorn: Schlittenkufe und Kiste
  const vg = B.maske(); vg.kap(-M, 252, 120, 246, 2.2, 2.2); vg.pfad([[120, 246], [132, 238], [130, 228]], 2.2, 1.6); vg.rect(20, 238, 30, 10); K.form(5, vg, 0, { k: HOLZ, ton: 1.5, fase: 1, schatten: 2 });
  deinSpiegelbild(K, 404, 240, 32);
  staub(K, 40);
  return { mitte: [236, 206] };
}
// Variante 2: Die Bruchkante. Die Glasfläche ist in gekippte Platten zerbrochen; aus den Spalten scheint
// das Polarlicht von unten herauf. Die Gestalt in der Mitte, fern, zwischen den Platten.
function bruch(K) {
  const P = B.persp(318, 112); K.split = [146, 168];
  const fD = decke(K, P, { riss: [430, 8], sd: 9 });
  // Spalten: Linien in Weltkoordinaten; nahe einer Spalte ist der Boden offen (grünes Licht)
  const spalten = [[-3.2, .15], [1.1, -.08], [3.6, .22], [-6, .3]];
  const spaltD = (X, Z) => Math.min(...spalten.map(([a, d]) => Math.abs(X - (a + d * Z + Math.sin(Z * .9 + a) * .25))));
  boden(K, P, fD, { glanzX: 430, risse: 4, sd: 5, licht: .85 });
  for (let y = P.vy + 2; y < H + M; y++) { const e = K.e[K.eb(y)]; for (let x = -M; x < W + M; x++) { const Z = P.h / (y - P.vy), X = (x - P.vx) * Z / P.h, k = P.k(Z), d = spaltD(X, Z) * k; if (d < 2.2) { const v = 1 - d / 2.2; e.set(x, y, pk(ramp(NORD, .08 + v * .5, x, y))); } else if (d < 3.4) e.set(x, y, pk(GLAS[0])); } }
  // gekippte Platten: Kanten heben sich an der Spalte (Kontaktschatten), mit Randlicht
  [[40, 214, 90, 24, .3], [300, 196, 70, 16, -.2], [372, 232, 110, 30, .25], [150, 168, 46, 10, .1]].forEach(([x, y, w, h, n]) => { const m = B.maske(); m.poly([[x - w / 2, y], [x - w / 2 + n * 20, y - h], [x + w / 2 + n * 20, y - h * .7], [x + w / 2, y + 2]]); aufGlas(K, K.eb(y), m, y + 1, .1 * (y < 200), { k: OBS, ton: 1.6, fase: 1.5, muster: (px, py) => (frac((px * .9 - py) * .05) < .06 ? .9 : 0) }, { ks: .5, lang: h }); K.glut(x, y + 2, w * .5, '#0a3018', .8, [K.eb(y)]); });
  K.licht(240, 230, NORD[5], 160, .5);
  horizontDunst(K, P, .4);
  [[30, 22, 5, .2], [70, 36, 8, -.2], [110, 16, 4, .1], [450, 26, 6, -.15]].forEach(([x, h, w, n]) => spitze(K, 1, x, P.vy + 1, h, w, n, .6));
  [[120, 44, 8], [190, 26, 5], [262, 52, 8], [400, 36, 6]].forEach(([x, h, w]) => zapfen(K, 1, x, -1, h, w, .5));
  gestalt(K, 250, P.vy + 2, 78, { staerke: .9 });
  spitze(K, 3, 96, 168, 40, 9, .25, .15, true);
  spitze(K, 4, 452, 196, 46, 10, -.3, 0, true);
  // vorn: eine Platte steht senkrecht, angeschnitten, links
  const vg = B.maske(); vg.poly([[-M, 160], [26, 176], [40, H + M], [-M, H + M]]); K.form(5, vg, 0, { k: OBS, ton: 1.5, fase: 2, muster: (x, y) => (frac((x + y * .3) * .06) < .05 ? .9 : 0) });
  deinSpiegelbild(K, 214, 244, 30);
  // Licht steigt aus den Spalten (Partikel nach oben)
  B.partikel(K, { n: 30, farben: [NORD[3], NORD[5]], vx: 0, vy: -6, wob: 2, wf: .7, x0: 0, x1: 480, y0: 130, y1: 260, blink: 2, maske: (x, y) => { if (y < P.vy + 4) return false; const Z = P.h / (y - P.vy), X = (x - P.vx) * Z / P.h; return spaltD(X, Z) * P.k(Z) < 6; } });
  staub(K, 30);
  return { mitte: [240, 210] };
}
// Wächter: Die Spiegelwand. Eine senkrechte Platte aus schwarzem Glas, so hoch wie die Halle; in ihr steht,
// aufrecht, die Gestalt neben einem kleinen Menschen (dir), der schon einen Schritt weiter ist. Die Decke wölbt sich.
function spiegelwand(K) {
  const P = B.persp(240, 132); K.split = [169, 200];
  const fD = decke(K, P, { riss: [400, 16], sd: 7 });
  boden(K, P, fD, { glanzX: 400, risse: 7, sd: 7, licht: 1.2 });
  horizontDunst(K, P, .35);
  // Wand: Platte mit gebrochener Oberkante, frontal
  const x0 = 104, x1 = 376, yb = 168, wm = B.maske();
  wm.poly([[x0, yb], [x0 + 4, 46], [x0 + 40, 30], [x0 + 70, 40], [x0 + 110, 18], [x0 + 150, 26], [x0 + 190, 12], [x0 + 230, 34], [x1 - 6, 44], [x1, yb]]);
  // Spiegelinhalt: die Decke gespiegelt, dunkler; darin die Gestalt aufrecht und du
  const innen = (x, y) => wm.has(x, y);
  for (let y = 10; y <= yb; y++) for (let x = x0; x <= x1; x++) { if (!innen(x, y)) continue; const d = fD(480 - x, 8 + (y - 10) * .6); let c = ramp(GLAS, d.t * .9 + .02, x, y); if (d.g * .8 > .25 + B.bay(x, y) * .6) c = ramp(NORD, .08 + d.g * .4, x, y); K.e[2].set(x, y, pk(c)); }
  // Facetten der Wand: Rand mit Fase und Randlicht (Form ohne Füllung drüberlegen)
  const rand = B.maske(); for (let y = 0; y <= yb; y++) for (let x = x0 - 2; x <= x1 + 2; x++) if (wm.has(x, y) && (!wm.has(x - 4, y) || !wm.has(x + 4, y) || !wm.has(x, y - 3))) rand.put(x, y, 1), rand._grow(x, y, x, y);
  K.form(2, rand, .15, { k: OBS, ton: 2.2, fase: 1.5, rand: 2 });
  // im Spiegel: die Gestalt aufrecht, groß, und neben ihr klein du, einen Schritt voraus (in der Wand)
  const gx = 168, gb = yb - 2;
  gestaltMalen(K, gx, gb, 120, -1, { eb: 2, sichtbar: (x, y) => innen(x, y), staerke: 1 });
  const du = B.maske(), dx = 318, db = yb - 2; du.pfad([[dx, db - 16], [dx - 4, db - 7], [dx - 6, db]], 1.6, 1.3); du.pfad([[dx + 1, db - 16], [dx + 3, db - 8], [dx + 3, db]], 1.6, 1.3); du.poly([[dx - 5, db - 15], [dx + 5, db - 15], [dx + 5, db - 29], [dx - 5, db - 29]]); du.ell(dx, db - 33, 3, 3.4);
  for (let y = 0; y <= yb; y++) for (let x = x0; x <= x1; x++) { if (!du.has(x, y)) continue; const r = !du.has(x + 1, y) || !du.has(x, y - 1); K.e[2].set(x, y, pk(r ? NORD[4] : GLAS[1])); }
  K.glut(gx, gb - 60, 90, '#06200f', .7, [2]);
  // Spiegelbild der Wand im Boden
  spiegeln(K, wm, yb, { ks: .4, lang: 24, eb: 3, tiefe: .45 });
  // Glanz: zwei schräge Streifen über die Wand (die Eisdecke spiegelt sich in ihr)
  for (const [sx0, br] of [[150, 7], [262, 4]]) for (let y = 30; y <= yb; y++) for (let k = -br; k <= br; k++) { const x = Math.round(sx0 + (y - 30) * .35 + k); if (!innen(x, y) || B.bay(x, y) > (1 - Math.abs(k) / br) * .55) continue; const c = K.e[2].get(x, y); if (c === pk(GLAS[0]) || c === pk('#000000')) continue; K.e[2].add(x, y, [40, 70, 60], .5); }
  // Zapfen links und rechts, nah
  [[40, 96, 14], [452, 110, 16], [16, 60, 9]].forEach(([x, h, w]) => zapfen(K, 2, x, -M, h, w, .2));
  spitze(K, 3, 60, 186, 44, 10, .2, .1, true); spitze(K, 3, 430, 190, 50, 11, -.25, .1, true);
  const vg = B.maske(); vg.poly([[-M, 238], [40, 230], [70, H + M], [-M, H + M]]); vg.poly([[W + M, 228], [430, 240], [404, H + M], [W + M, H + M]]); K.form(5, vg, 0, { k: OBS, ton: 1.5, fase: 2 });
  staub(K, 50);
  return { mitte: [240, 212] };
}

// ---------- Arten ----------
// Krämer: dein Spiegelbild im Glas, auf einer Decke voller Ware, die es oben nicht gibt
function kraemerSpiegel(K, x, y) {
  const s = 1.1, m = B.maske(), Y = q => y + 2 + q * 60 * s;
  m.poly([[x - 7 * s, Y(0)], [x + 7 * s, Y(0)], [x + 10 * s, Y(.4)], [x + 11 * s, Y(.75)], [x - 11 * s, Y(.75)], [x - 10 * s, Y(.4)]]); m.ell(x, Y(.86), 5 * s, 6 * s);
  m.pfad([[x + 10 * s, Y(.65)], [x + 18 * s, Y(.4)], [x + 22 * s, Y(.2)]], 2.4 * s, 1.6 * s);
  B.form(K.e[4], m, K.mat(0, { k: OBS.slice(0, 3), r: [NORD[2], NORD[4]], ton: .4, fase: 0, rand: 1, rimF: -.2 }));
  // Decke mit Ware, im Glas
  const d = B.maske(); d.poly([[x - 40, y + 3], [x + 44, y + 3], [x + 52, y + 14], [x - 46, y + 14]]); B.form(K.e[4], d, K.mat(0, { k: TUCH.slice(0, 3), ton: .8, fase: 0, rand: 1, rimF: -.2 }));
  for (let i = 0; i < 6; i++) { const wx = x - 36 + i * 14, w = B.maske(); w.ell(wx, y + 8, 4, 2.4); B.form(K.e[4], w, K.mat(0, { k: OBS, r: [NORD[3], NORD[5]], ton: 1.5, fase: 0, rand: 1, rimF: -.3 })); K.e[4].set(wx, y + 7, pk(NORD[i % 2 ? 5 : 4])); }
  K.glut(x, y + 30, 70, '#06200f', .8, [3, 4]); K.licht(x, y + 20, NORD[5], 70, .6);
  K.e[4].set(x - 2, Math.round(Y(.86)), pk(NORD[6])); K.e[4].set(x + 2, Math.round(Y(.86)), pk(NORD[6]));
}
// Übergang: unter der Gestalt ist das Glas dünn; ein Kreis aus Rissen, grünes Licht, du fällst hinein
function abstieg(K, x, y) {
  const m = B.maske(); m.ell(x, y, 54, 14); B.form(K.e[4], m, K.mat(0, { k: [NORD[1], NORD[2], NORD[3], NORD[4]], ton: 1.2, fase: 0, rand: 0, verlauf: -1.8 }));
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r0 = 10 + (i % 3) * 6; for (let k = r0; k < 64; k++) { const xx = x + Math.cos(a + Math.sin(k * .2) * .1) * k, yy = y + Math.sin(a) * k * .27; if (B.bay(xx, yy) < .8) K.e[4].set(xx, yy, pk(k < 52 ? NORD[5] : NORD[3])); } }
  K.glut(x, y, 90, '#0c3a20', 1, [2, 3, 4]); K.licht(x, y, NORD[5], 100, 1);
  const g = B.glanzSprite(40, '#0c3a20', .6);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (Math.sin(t * .6) < -.4) return; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}
// Ereignis/Fund: Plattenkasten; Werkstatt: Werkbank auf dem Schlitten
function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante, info;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 0 : art === 'rast' || art === 'werkstatt' ? 1 : art === 'ereignis' || art === 'fund' ? 1 : art === 'uebergang' ? 0 : art === 'wandbild' ? 2 : (o.seed + v) % 3;
  if (art === 'waechter') info = spiegelwand(K);
  else info = [ebene, lager, bruch][v](K);
  if (art === 'kraemer') kraemerSpiegel(K, 250, 206);
  else if (art === 'rast') kocher(K, info.mitte[0], info.mitte[1] + 14);
  else if (art === 'werkstatt') B.werkbank(K, info.mitte[0] - 20, info.mitte[1] + 4);
  else if (art === 'ereignis' || art === 'fund') plattenkasten(K, info.mitte[0], info.mitte[1] + 6);
  else if (art === 'uebergang') abstieg(K, 320, 214);
  return K.fertig();
}
World._biome.glasmeer = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 3, knick: .5, grossX: 120, stein: ['#070d11', '#0e171c', '#152227', '#4fd27a'] } };
})();
