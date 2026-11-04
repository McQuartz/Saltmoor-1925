// Saltmoor 1925 · Hintergründe: Akt I, Der Nachtzug (Biom-Paket nachtzug).
// Komposition: docs/auftrag-2/biome/nachtzug.md. Ein Zug, der in Saltmoor hält, obwohl Saltmoor keinen Bahnhof hat.
// Die Tiefe liegt in der Länge des Wagens: Der Innenraum wird je Pixel als Kasten berechnet (Boden, Decke, zwei
// Wände, Stirnwand mit Tür), darauf Formen mit Fase und Randlicht. Hinter der letzten Tür steht die Lok, und ihre
// Lampe leuchtet nach innen. Jedes Fenster zeigt dieselbe Kurve.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#070405', '#110a0a', '#1e1211', '#2e1c19'], rand: ['#58789a', '#cfe2f6'], augen: '#ffc870', nebel: ['#140c0c', '#3a2a2a'], fern: '#4a3a36' };
const HOLZ = ['#060303', '#0e0606', '#170a09', '#22100d', '#2f1712', '#3e1f17', '#52291d', '#6a3624', '#86472e'];
const POLSTER = ['#040805', '#08100a', '#0e1a10', '#152618', '#1e3422', '#28442c', '#345a38'];
const MESSING = ['#1a1208', '#33240e', '#574018', '#7f6024', '#a88436', '#d0ac58', '#f4dc98'];
const DECKE = ['#070505', '#0e0b0a', '#171210', '#211a17', '#2e241f', '#3c3029', '#4e3f35', '#665345'];
const LAEUFER = ['#070304', '#0f0506', '#180809', '#230c0c', '#301211', '#3e1916', '#4e221c'];
const DIELE = ['#050303', '#0b0706', '#120c0a', '#1a120e', '#241914', '#30221a'];
const BLAU = ['#020409', '#050a14', '#0a1424', '#112038', '#1a2e4e', '#284468', '#3c5f88', '#5c84ae', '#8cb0d4', '#c6e0f6'];
const TUCH = ['#0e0c0c', '#1e1a1a', '#2e2a28', '#423c38', '#58504a', '#70665e', '#8c8076', '#a89a8e'];
const LAMPE = '#ffc870', LAMPG = '#4a2c12', LOK = '#fff4dc', LOKG = '#6a5a3a';
const RIM = { r: ['#58789a', '#cfe2f6'] };
const RIM_W = { r: ['#a8742e', '#ffd890'] }; // warmes Randlicht neben Lampen

// ---------- Die Kurve: dasselbe Bild in jedem Fenster ----------
// u, v in 0..1 (u links -> rechts, v oben -> unten); liefert Index in BLAU (oder -2 für das warme Fenster).
function kurve(u, v, fr) {
  const hug = .5 + .1 * Math.sin(u * 3.1 + .6) - .06 * Math.cos(u * 7.3); // Hügelkante
  const hell = .55 - v * .5; // Himmel: oben dunkler
  if (Math.abs(u - .63) < .022 && Math.abs(v - (hug + .045)) < .03) return -2; // ein erleuchtetes Haus am Hang
  if (v < hug) { const st = B.hash(Math.floor(u * 61), Math.floor(v * 37), 5) > .985 ? 3 : 0; return Math.max(2 + (v > hug - .08 ? 1 : 0), st) + (hell > .4 ? 0 : 0); }
  // Gleisbogen: kommt unten links herein, biegt um den Hügel nach rechts
  const tx = (vv) => .12 + Math.pow((1 - vv) / (1 - hug), 1.6) * .75; // u des Gleises je Höhe
  const gu = tx(v), dist = Math.abs(u - gu), breite = .01 + (v - hug) * .09;
  if (dist < breite && dist > breite * .45) return 7;
  if (dist < breite * 1.8) return 2;
  // Telegrafenmast neben dem Gleis
  if (Math.abs(u - .3) < .007 && v > hug - .2 && v < hug + .25) return 1;
  if (Math.abs(v - (hug - .19)) < .008 && Math.abs(u - .3) < .03) return 1;
  return 1 + ((B.hash(Math.floor(u * 40), Math.floor(v * 24), 9) > .8) ? 1 : 0) - (fr > .6 ? 1 : 0);
}

// ---------- Der Wagen als Kasten ----------
// cfg: P (Perspektive), XL, XR (Wände), YC (Decke), ZE (Stirnwand), links/rechts: 'tueren' | 'fenster' | 'brett' | 'tafel',
// boden: 'laeufer' | 'diele', lampen: [{X,Y,Z}], ende: 'lok' | 'loknah' | 'wasser' | 'fenster'
function wagen(K, c) {
  const P = c.P, fr = K.fr, sd = K.o.seed;
  const lampen = (c.lampen || []).filter((l, i) => !(fr > .4 && l.Z > 8 - fr * 6 && (i % 2 || fr > .8))); // hinten gehen Lampen aus
  const lokStark = c.ende === 'lok' || c.ende === 'loknah' ? .8 + fr * .5 : 0;
  // Licht an einem Punkt: warm von den Lampen, kalt vom Ende (Lok)
  const licht = (X, Y, Z) => {
    let w = 0; for (const l of lampen) { const d2 = (X - l.X) ** 2 + (Y - l.Y) ** 2 * 1.4 + (Z - l.Z) ** 2; w += 1.1 / (1 + d2 * 1.6); }
    let k = 0; if (lokStark) { const dz = c.ZE - Z; k = lokStark * Math.max(0, 1 - Math.hypot(X - (c.lokX || 0), Y - .7) * .45) * (1 / (1 + Math.max(0, dz) * .09)); if (Y < .05) k = Math.max(k, lokStark * .55 * Math.max(0, 1 - Math.abs(X - (c.lokX || 0)) / (.25 + dz * .03)) * (1 / (1 + Math.max(0, dz) * .05))); }
    return [Math.min(1.2, w), k];
  };
  const fensterZ = (Z, per, off, w) => { const q = (Z - off) / per, f = q - Math.floor(q); return f * per < w ? (f * per) / w : -1; };
  const zFern = c.zFern || 7;
  const ebW = Z => Z > zFern ? 2 : 3;
  const setz = (eb, x, y, ramp, t) => { t = B.clamp(t, 0, .9999) * (ramp.length - 1); const k = Math.floor(t); K.e[eb].set(x, y, B.pk(ramp[Math.min(ramp.length - 1, (t - k) > B.bay(x, y) ? k + 1 : k)])); };
  const fensterBild = []; // Fensterflächen für Glanz
  for (let y = -M; y < H + M; y++) for (let x = -M; x < W + M; x++) {
    const dx = (x + .5 - P.vx) / P.h, dy = (P.vy - (y + .5)) / P.h;
    let Z = 1e9, s = '';
    if (dx < -1e-4) { const z = -c.XL / dx; if (z < Z) { Z = z; s = 'L'; } }
    if (dx > 1e-4) { const z = c.XR / dx; if (z < Z) { Z = z; s = 'R'; } }
    if (dy < -1e-4) { const z = -1 / dy; if (z < Z) { Z = z; s = 'B'; } }
    if (dy > 1e-4) { const z = (c.YC - 1) / dy; if (z < Z) { Z = z; s = 'D'; } }
    const X = dx * Z, Y = 1 + dy * Z;
    if (Z > c.ZE) { // Stirnwand oder Durchblick
      const Xe = dx * c.ZE, Ye = 1 + dy * c.ZE;
      if (Math.abs(Xe - (c.tuerX || 0)) < (c.tuerB ?? .42) && Ye < (c.tuerH || 1.5) && Ye > 0) { K.e[1].set(x, y, B.pk('#000000')); continue; } // Türöffnung: später gefüllt
      const [w, k] = licht(Xe, Ye, c.ZE - .01);
      const pan = (Math.abs(Xe - (c.tuerX || 0)) < (c.tuerB ?? .42) + .08 && Ye < (c.tuerH || 1.5) + .08) ? .9 : 0;
      if (c.endeBrett) { const b = Xe * 4 - Math.floor(Xe * 4); setz(1, x, y, HOLZ, .24 + w * .5 + (b * P.h / c.ZE / 4 < 1 ? -.14 : 0) + (B.hash(Math.floor(Xe * 4), 2, sd) - .5) * .1 + (Math.abs(Ye - .95) < .04 ? .1 : 0) + (Ye > c.YC - .1 ? -.12 : 0)); continue; }
      setz(1, x, y, HOLZ, .22 + w * .35 + k * .5 + pan * .12 + (Ye > c.YC - .12 ? -.1 : 0) + ((Math.floor(Xe * 6) & 1) ? .03 : 0));
      continue;
    }
    if (s === 'B') { // Boden
      const eb = K.eb(y), [w, k] = licht(X, 0, Z);
      const lw = c.laeuferB || .62;
      const fz = fensterZ(Z, c.fPer || 1.7, c.fOff || .4, c.fW || .9);
      const kalt = c.rechts === 'fenster' && X > c.XR - 1.1 && fz >= 0 && fz < 1 ? (1 - (c.XR - X) / 1.1) * .5 : 0;
      if (c.boden === 'laeufer' && Math.abs(X - (c.laeuferX || 0)) < lw) {
        const rand = Math.abs(X - (c.laeuferX || 0)) > lw - .09, mus = ((Math.floor(Z * 3) + Math.floor((X + 3) * 3)) & 1) ? .05 : 0;
        let t = .26 + w * .42 + k * .55 + (rand ? .16 : mus) - Math.min(.12, Z * .006);
        if (rand && Math.abs(X - (c.laeuferX || 0)) > lw - .03) t -= .3;
        setz(eb, x, y, rand ? POLSTER : LAEUFER, t);
      } else {
        const brett = (X * 5) - Math.floor(X * 5), fuge = brett * (P.h / Z) / 5 < 1 ? -.18 : 0;
        setz(eb, x, y, DIELE, .3 + w * .4 + k * .5 + fuge + (B.hash(Math.floor(X * 5), Math.floor(Z * .7), sd) - .5) * .12);
      }
      if (kalt > B.bay(x, y) + .1) K.e[eb].set(x, y, B.pk(BLAU[3]));
      continue;
    }
    if (s === 'D') { // Decke: Mittelstreifen (Oberlicht), Spanten
      const [w, k] = licht(X, c.YC, Z), sp = (Z * 1.25) - Math.floor(Z * 1.25);
      let t = .2 + w * .45 + k * .3 + (Math.abs(X) < .5 ? .1 : 0) - (Math.abs(Math.abs(X) - .5) < .03 ? .12 : 0);
      if (sp * (P.h / Z) / 1.25 < 1.2) t -= .2; else if (sp * (P.h / Z) / 1.25 < 2.4) t += .08;
      if (Math.abs(X) < .5 && Math.abs(X) > .44) t += .12;
      setz(ebW(Z), x, y, DECKE, t);
      continue;
    }
    // Wände
    const seite = s === 'L' ? c.links : c.rechts, eb = ebW(Z), [w, k] = licht(X, Y, Z);
    const kpx = P.h / Z; // Pixel je Einheit an dieser Stelle
    if (Y > c.YC - .1) { setz(eb, x, y, DECKE, .25 + w * .4 + k * .3 - (Y > c.YC - .04 ? .15 : 0)); continue; } // Hohlkehle
    if (seite === 'fenster') {
      const fz = fensterZ(Z, c.fPer || 1.7, c.fOff || .4, c.fW || .9), fy0 = c.fY0 || .92, fy1 = c.fY1 || 1.42;
      if (fz >= 0 && Y > fy0 && Y < fy1) {
        const u = s === 'R' ? 1 - fz : fz, v = (fy1 - Y) / (fy1 - fy0);
        const vv = 1 - v; const idx = kurve(u, vv, fr);
        if (idx === -2) { K.e[eb].set(x, y, B.pk(LAMPE)); fensterBild.push([x, y, 1]); }
        else { setz(eb, x, y, BLAU, (Math.max(0, idx) + .5) / BLAU.length + (B.bay(x, y) - .5) * .05); if (idx >= 7 && B.hash(x, y, 3) > .5) fensterBild.push([x, y, 0]); }
        continue;
      }
      // Täfelung: Füllungen unter den Fenstern, Leisten
      const unter = Y < fy0, rahmen = (Y > fy0 - .05 && Y < fy0) || (Y > fy1 && Y < fy1 + .05) || (fz < 0 && Math.abs(fensterZ(Z + .04, c.fPer || 1.7, c.fOff || .4, (c.fW || .9) + .08)) < 1 && fensterZ(Z + .04, c.fPer || 1.7, c.fOff || .4, (c.fW || .9) + .08) >= 0 && Y > fy0 && Y < fy1);
      let t = .32 + w * .6 + k * .45 + (unter && Y > .12 && Y < fy0 - .15 && (Z * 2.4 - Math.floor(Z * 2.4)) * kpx / 2.4 > 1.4 ? .08 : 0) - (Y < .1 ? .14 : 0);
      if (rahmen) t += .18;
      setz(eb, x, y, HOLZ, t);
      continue;
    }
    if (seite === 'tueren') {
      const per = c.tPer || 2.1, off = c.tOff || .5, tw = .78, q = (Z - off) / per, f = (q - Math.floor(q)) * per, nr = Math.floor(q);
      const inTuer = f < tw, gl = inTuer && f > .07 && f < tw - .07 && Y > .9 && Y < 1.4;
      if (gl) { // Abteilfenster: warmes Licht hinter dem Vorhang (Falten), eines ist dunkel
        const dunkel = (nr + sd) % 4 === 2 || (fr > .5 && nr % 2) || (fr > .85 && nr > 0);
        const falte = Math.sin((f - .07) * 70) * .5 + .5, offen = (f - .07) / (tw - .14) > .62;
        if (dunkel) setz(eb, x, y, HOLZ, .08 + falte * .08);
        else setz(eb, x, y, ['#3a2410', '#5a3816', '#7a5020', '#a06a2a', '#c8903c', '#f0c070'], offen ? .55 + (Y - .9) * .5 : .25 + falte * .35 - (1.4 - Y) * .1);
        continue;
      }
      let t = .3 + w * .6 + k * .45;
      if (inTuer) t += (f < .07 || f > tw - .07 || Y < .9 && Y > .84 || Y > 1.4) ? .14 : -.02;
      else if (Y > .15 && Y < 1.5 && (f - tw) * kpx > 2 && (per - f) * kpx > 2) t += .07; // Füllung zwischen den Türen
      if (Y < .1) t -= .14;
      setz(eb, x, y, HOLZ, t);
      continue;
    }
    if (seite === 'brett') { // Gepäckwagen: senkrechte Bretter
      const b = (Z * 4) - Math.floor(Z * 4); let t = .26 + w * .45 + k * .4 + (b * kpx / 4 < 1 ? -.15 : 0) + (B.hash(Math.floor(Z * 4), 1, sd) - .5) * .1;
      if (Math.abs(Y - .9) < .04) t += .1;
      setz(eb, x, y, HOLZ, t);
      continue;
    }
    setz(eb, x, y, HOLZ, .3 + w * .4 + k * .4);
  }
  K.fensterBild = fensterBild;
  K.licht3 = licht;
  return P;
}

function inPoly(x, y, v) { let c = false; for (let i = 0, j = v.length - 1; i < v.length; j = i++) if ((v[i][1] > y) !== (v[j][1] > y) && x < (v[j][0] - v[i][0]) * (y - v[i][1]) / (v[j][1] - v[i][1]) + v[i][0]) c = !c; return c; }
// Quad auf einer Wand: X fest, Y0..Y1, Z0..Z1
const quadR = (P, X, Y0, Y1, Z0, Z1) => [P.q(X, Y0, Z0), P.q(X, Y1, Z0), P.q(X, Y1, Z1), P.q(X, Y0, Z1)];
// Rahmen (außen minus innen) als Maske
function rahmenMaske(m, aussen, innen) { m.poly(aussen); m.poly(innen, 0); return m; }

// Fensterrahmen aus Messing und gebundene Vorhänge auf einer Fensterwand
function fensterRahmen(K, P, c, seite) {
  const X = seite === 'R' ? c.XR : -c.XL, per = c.fPer || 1.7, off = c.fOff || .4, fw = c.fW || .9, y0 = c.fY0 || .92, y1 = c.fY1 || 1.42;
  for (let Z0 = off + Math.floor((1 - off) / per) * per; Z0 < c.ZE - .2; Z0 += per) {
    if (Z0 + fw < .5) continue;
    const z0 = Math.max(.55, Z0), d = .035 * Math.max(1, Z0 / 3);
    const eb = Z0 > (c.zFern || 7) ? 2 : 3, tf = Math.min(.5, Z0 / 30);
    const m = B.maske(); rahmenMaske(m, quadR(P, X, y0 - d, y1 + d, z0 - d, Z0 + fw + d), quadR(P, X, y0, y1, z0, Z0 + fw));
    K.form(eb, m, tf, { k: MESSING.slice(0, 5).map(B.col), ton: 1.6, fase: 0, rand: 1, r: ['#a88436', '#f4dc98'] });
    // Vorhänge: gebundene Bahnen an beiden Seiten (grüner Samt)
    const vh = B.maske(), vb = .16;
    for (const [za, zb] of [[z0 - .02, z0 + vb], [Z0 + fw - vb, Z0 + fw + .02]]) {
      if (za < .5) continue;
      const a = P.q(X, y1 + .02, za), b = P.q(X, y1 + .02, zb), mid = P.q(X, (y0 + y1) / 2 - .05, (za + zb) / 2), ua = P.q(X, y0 - .1, za + .02), ub = P.q(X, y0 - .1, zb - .02);
      vh.poly([a, b, [B.lerp(b[0], mid[0], .7), mid[1]], ub, ua, [B.lerp(a[0], mid[0], .7), mid[1]]]);
    }
    K.form(eb, vh, tf, { k: POLSTER.slice(0, 5).map(B.col), ton: 1.3, fase: 1, rand: 2, r: RIM.r, muster: (x) => (x % 3 === 0 ? -.4 : 0), schatten: 1 });
  }
}
// Abteiltüren: Rahmen, Messinggriff, Nummernschild
function tuerRahmen(K, P, c) {
  const X = -c.XL, per = c.tPer || 2.1, off = c.tOff || .5, tw = .78;
  for (let Z0 = off; Z0 < c.ZE - .2; Z0 += per) {
    if (Z0 + tw < .55) continue;
    const z0 = Math.max(.6, Z0), eb = Z0 > (c.zFern || 7) ? 2 : 3, tf = Math.min(.5, Z0 / 30);
    const g = B.maske(), [gx, gy] = P.q(X, 1.0, Z0 + tw - .12), k = P.k(Z0 + tw - .12);
    g.kap(gx, gy - k * .05, gx, gy + k * .07, Math.max(.6, k * .012), Math.max(.6, k * .012));
    const [sx, sy] = P.q(X, 1.47, Z0 + tw / 2); g.rect(sx - Math.max(1, k * .04), sy, Math.max(2, k * .08), Math.max(1, k * .035));
    if (Z0 > .5) K.form(eb, g, tf, { k: MESSING.slice(1, 6).map(B.col), ton: 2, fase: 0, rand: 1, r: ['#d0ac58', '#f4dc98'] });
  }
}
// Hängelampe: Messingstange, Glasglocke, Glühen
function haengelampe(K, P, l, an) {
  const [x, y] = P.q(l.X, l.Y, l.Z), k = P.k(l.Z), eb = l.Z > 7 ? 2 : 3;
  const m = B.maske(), [, yd] = P.q(l.X, l.YC || 1.75, l.Z);
  m.kap(x, yd, x, y - k * .05, Math.max(.5, k * .008), Math.max(.5, k * .008));
  m.poly([[x - k * .07, y - k * .05], [x + k * .07, y - k * .05], [x + k * .045, y + k * .03], [x - k * .045, y + k * .03]]);
  K.form(eb, m, Math.min(.4, l.Z / 30), { k: MESSING.slice(0, 5).map(B.col), ton: 1.5, fase: 0, rand: 1, r: ['#a88436', '#f4dc98'] });
  if (!an) return;
  const gm = B.maske(); gm.ell(x, y + k * .06, Math.max(1, k * .05), Math.max(1, k * .045));
  K.form(eb, gm, 0, { k: ['#6a4a20', '#a07030', '#e0a850', '#ffd890'].map(B.col), ton: 2.4, fase: 0, rand: 0 });
  K.e[eb].set(x, y + k * .06, B.pk('#fff4dc'));
  K.glut(x, y + k * .06, Math.max(8, k * .5), LAMPG, .8, [1, 2, 3]);
  K.licht(x, y + k * .06, LAMPE, Math.max(10, k * .6), .7);
}
// Messing-Haltestange unter den Fenstern
function haltestange(K, P, c) {
  const pts = []; for (let Z = .6; Z < c.ZE; Z *= 1.08) pts.push(P.q(c.XR - .05, .98, Z));
  for (let i = 0; i + 1 < pts.length; i++) {
    const Z = .6 * Math.pow(1.08, i), eb = Z > (c.zFern || 7) ? 2 : 3, k = P.k(Z), m = B.maske();
    m.kap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], Math.max(.5, k * .016), Math.max(.5, k * .016));
    K.form(eb, m, Math.min(.4, Z / 30), { k: MESSING.slice(1, 6).map(B.col), ton: 1.8, fase: 0, rand: 1, r: ['#d0ac58', '#f4dc98'] });
  }
}

// ---------- Was hinter der letzten Tür ist ----------
// Lok: Die Türen der Wagen davor werden immer kleiner, ganz hinten die Lampe der Lok, die nach innen leuchtet.
function durchblick(K, P, c) {
  const tx = c.tuerX || 0, tb = c.tuerB || .42, th = c.tuerH || 1.5, fr = K.fr;
  const e = K.e[1];
  if (c.ende === 'lok' || c.ende === 'loknah') {
    const n = c.ende === 'lok' ? 2 : 0;
    // Durchblick: Wagen um Wagen, Türen im Wechsel hell und dunkel
    let Z = c.ZE;
    for (let i = 0; i < n; i++) {
      const Zn = Z + 3.2 + i * .6;
      const [x0, y0] = P.q(tx - tb, th, Z), [x1, y1] = P.q(tx + tb, 0, Z), [u0, v0] = P.q(tx - tb, th, Zn), [u1, v1] = P.q(tx + tb, 0, Zn);
      B.feld(e, x0, y0, x1, y1, HOLZ, (x, y) => { const inn = x >= u0 && x < u1 && y >= v0 && y < v1; if (inn) return -1; const q = (y - y0) / Math.max(1, y1 - y0); return .18 + (1 - q) * .05 + (i / n) * .25 + fr * .1; });
      // Lichtband am Boden des Durchblicks
      B.dith(e, x0, B.lerp(y0, y1, .85), x1, y1, LOKG, (x, y) => .3 + (i / n) * .4 - Math.abs(x - (x0 + x1) / 2) / Math.max(1, x1 - x0));
      Z = Zn;
    }
    const [lx0, ly0] = P.q(tx - tb, th, Z), [lx1, ly1] = P.q(tx + tb, 0, Z);
    const cx = (lx0 + lx1) / 2 + (c.lokDx || 0), cy = B.lerp(ly0, ly1, c.ende === 'loknah' ? .42 : .45), R = Math.max(5, (lx1 - lx0) * (c.ende === 'loknah' ? .3 : .5));
    // Stirn der Lok (Rauchkammertür, Nieten), dann die Lampe
    if (c.ende === 'loknah') {
      const lw = lx1 - lx0, my = cy + R * 1.9;
      B.feld(e, lx0, ly0, lx1, ly1, ['#0a0909', '#1a1614', '#2a2420', '#3c332c', '#52463c', '#6a5c4e'], (x, y) => { const d = Math.hypot(x - cx, (y - my) * .9) / (lw * .5); return d < 1 ? .62 - d * .28 + (Math.abs(d - .8) < .025 ? .35 : 0) + (x > cx ? .08 : 0) : .2 + (y > my + lw * .3 ? .1 : 0); });
      for (let a = 0; a < 6.28; a += .3) e.set(cx + Math.cos(a) * lw * .4, my + Math.sin(a) * lw * .44, B.pk(MESSING[3 + (Math.cos(a) > 0 ? 2 : 0)]));
      for (const dx of [-.3, .3]) for (let y = ly0; y < ly1; y += 6) e.set(cx + dx * lw, y, B.pk(MESSING[3]));
      B.linie(e, lx0 + 2, my + lw * .5, lx1 - 2, my + lw * .5, B.pk(MESSING[4]));
    }
    B.feld(e, cx - R * 1.3, cy - R * 1.3, cx + R * 1.3, cy + R * 1.3, MESSING, (x, y) => { const q = Math.hypot(x + .5 - cx, y + .5 - cy) / R; if (q > 1.25) return -1; return q > 1 ? .55 + (x > cx ? .3 : 0) : -1; });
    B.feld(e, cx - R, cy - R, cx + R, cy + R, ['#a07a3a', '#e0c070', '#fff0b0', '#fff4dc', '#ffffff'], (x, y) => { const q = Math.hypot(x + .5 - cx, y + .5 - cy) / R; if (q > 1) return -1; return 1 - q * .8; });
    // Strahlen: die Lampe leuchtet in den Zug hinein
    const st = .7 + fr * .6;
    for (const L of [K.e[1], K.e[2], K.e[3], K.e[4]]) for (const [win, br, a] of [[Math.PI / 2, .9, .32 * st], [Math.PI / 2 + .55, .12, .3 * st], [Math.PI / 2 - .5, .1, .3 * st], [Math.PI, .08, .22 * st], [0, .08, .22 * st]]) B.kegel(L, cx, cy, win, br, 300, '#5a4a30', a);
    K.licht(cx, cy, LOK, R * 6, 1);
    K.lok = [cx, cy, R];
    const g1 = B.glanzSprite(Math.max(R * 3, 26), '#4a3e28', .85), g2 = B.glanzSprite(Math.max(R * 3.3, 29), '#4a3e28', .9), g0 = B.glanzSprite(Math.max(R * 1.6, 10), '#6a5a40', .8);
    K.anim.push({ p: B.PAR[1], f(ctx, t, ox, oy) { const g = Math.sin(t * .9) + Math.sin(t * 2.3) * .3 > 0 ? g2 : g1; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, Math.round(cx - g.R + ox), Math.round(cy - g.R + oy)); ctx.drawImage(g0, Math.round(cx - g0.R + ox), Math.round(cy - g0.R + oy)); ctx.globalCompositeOperation = 'source-over'; } });
  } else if (c.ende === 'wasser') {
    // Übergang: Die Tür steht offen. Draußen Stufen ins schwarze Wasser, eine Kirchenmauer, ein grünes Rundfenster.
    const [x0, y0] = P.q(tx - tb, th, c.ZE), [x1, y1] = P.q(tx + tb, 0, c.ZE), hy = B.lerp(y0, y1, .62);
    B.feld(e, x0, y0, x1, hy, ['#020302', '#040605', '#070a08', '#0a100c'], (x, y) => .2 + (y - y0) / Math.max(1, hy - y0) * .5);
    const mx = B.lerp(x0, x1, .3), mw = (x1 - x0) * .9;
    B.feld(e, mx, B.lerp(y0, hy, .25), mx + mw, hy, ['#0a0806', '#120e0a', '#1a140e', '#241c14'], (x, y) => .4 + (((Math.floor(y / 3) + Math.floor((x + (Math.floor(y / 3) & 1) * 3) / 6)) & 1) ? .1 : 0));
    const rx = mx + mw * .5, ry = B.lerp(y0, hy, .45), rr = Math.max(3, (x1 - x0) * .14);
    B.feld(e, rx - rr, ry - rr, rx + rr, ry + rr, ['#0a2a1a', '#14583a', '#2a9a62', '#6ae0a0'], (x, y) => { const q = Math.hypot(x + .5 - rx, y + .5 - ry) / rr; return q > 1 ? -1 : .3 + (y - ry) / rr * .4 + (Math.abs(x - rx) < .6 || Math.abs(y - ry) < .6 ? -.3 : 0); });
    K.glut(rx, ry, rr * 4, '#0c3a20', .8, [1]);
    B.feld(e, x0, hy, x1, y1, ['#000000', '#030404', '#060908', '#0a100c'], (x, y) => .15 + (Math.sin(y * 1.7 + x * .05) > .7 ? .25 : 0) + (Math.abs(x - rx) < 2 && Math.sin(y * 2.1) > .3 ? .35 : 0));
    for (let i = 0; i < 4; i++) { const yy = B.lerp(hy, y1, (i + 1) / 5), m = B.maske(); m.rect(B.lerp(x0, x1, .1 + i * .03), yy, (x1 - x0) * (.8 - i * .06), Math.max(1, (y1 - hy) * .05)); K.form(1, m, 0, { k: HOLZ.slice(1, 6).map(B.col), ton: 1.5, fase: 0, rand: 1, r: RIM.r }); }
    K.licht(rx, ry, '#6ae0a0', rr * 3, .6);
  }
}

// =====================================================================
// Variante 0: Seitengang im Schlafwagen. Links Abteiltüren mit Licht hinter Vorhängen, rechts die Fenster mit
// derselben Kurve, Haltestange, Läufer; ganz hinten Tür um Tür bis zur Lok.
function gang(K, o) {
  o = o || {};
  const P = B.persp(o.vx || 268, o.vy || 104), fr = K.fr; K.split = [168, 178];
  B.feld(K.e[0], -M, -M, W + M, H + M, ['#000000', '#040202'], () => .3);
  const c = { P, XL: 2.3, XR: 2.0, YC: 1.6, ZE: o.ZE || 12.5, tuerB: o.ZE ? .6 : .42, links: 'tueren', rechts: 'fenster', boden: 'laeufer', laeuferX: -.1, laeuferB: .66, ende: o.ende || 'lok', fOff: .3, tOff: .2, zFern: 6, fW: 1.05, fPer: 1.6, fY0: .84,
    lampen: [1.6, 4.0, 6.4, 8.8, 11.2].map(Z => ({ X: 0, Y: 1.45, Z, YC: 1.6 })) };
  wagen(K, c);
  durchblick(K, P, c);
  fensterRahmen(K, P, c, 'R'); tuerRahmen(K, P, c); haltestange(K, P, c);
  c.lampen.forEach((l, i) => haengelampe(K, P, l, !(fr > .4 && l.Z > 8 - fr * 6 && (i % 2 || fr > .8))));
  // Licht aus den Abteilen fällt schräg auf den Gangboden
  for (let Z0 = c.tOff; Z0 < c.ZE; Z0 += 2.1) { const nr = Math.floor((Z0 - c.tOff) / 2.1 + 1e-6); if ((nr + K.o.seed) % 4 === 2 || (fr > .5 && nr % 2)) continue; const [gx, gy] = P.q(-c.XL + .55, 0, Z0 + .4); K.glut(gx, gy, P.k(Z0 + .4) * .7, '#3a2008', .9, [2, 3, 4]); }
  // Schatten hinter einem Abteilvorhang: jemand sitzt aufrecht und rührt sich nicht
  const [sx, sy] = P.q(-c.XL, 1.2, 2.75), k = P.k(2.75), sm = B.maske(); sm.ell(sx, sy - k * .06, k * .028, k * .09); sm.ell(sx + k * .01, sy + k * .12, k * .05, k * .12);
  for (let y = sm.y0; y <= sm.y1; y++) for (let x = sm.x0; x <= sm.x1; x++) if (sm.has(x, y) && (K.e[3].get(x, y) >>> 24)) K.e[3].set(x, y, B.pk('#3a2410'));
  // Vordergrund: angeschnittene, offene Abteiltür links; rechts die Kante eines Fenstervorhangs
  const v = B.maske(); v.poly([[-M, -M], [22, -M], [30, 40], [30, H + M], [-M, H + M]]);
  K.form(5, v, 0, { k: HOLZ.slice(0, 5).map(B.col), ton: 1.4, fase: 2, rand: 2, r: RIM.r, muster: (x, y) => (Math.abs(x - 12) < 1 ? -.6 : 0) + (y > 120 && y < 124 ? .5 : 0) });
  const gm = B.maske(); gm.kap(25, 132, 25, 148, 1.6, 1.6); K.form(5, gm, 0, { k: MESSING.slice(1, 6).map(B.col), ton: 2, fase: 0, rand: 1, r: ['#d0ac58', '#f4dc98'] });
  const vr = B.maske(); vr.poly([[W + M, -M], [452, -M], [446, 30], [458, 120], [468, 210], [W + M, 230]]);
  K.form(5, vr, 0, { k: POLSTER.slice(0, 5).map(B.col), ton: 1, fase: 2, rand: 2, r: RIM.r, muster: (x) => ((x * 3) % 7 === 0 ? -.5 : 0) });
  fensterGlanz(K);
  luft(K, P);
  K.reihen = [{ y: 180, skala: .9, nebel: .3 }, { y: 198, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [250, 210] };
}

// Variante 1: Speisewagen. Fluchtpunkt links, die Tische stehen rechts an den Fenstern, jede mit einer Tischlampe.
// Gedeckt für Gäste, die nicht kommen. Links das Büfett mit Gläsern.
function speisewagen(K, o) {
  o = o || {};
  const nah = !!o.nah, P = B.persp(o.vx || (nah ? 250 : 176), o.vy || (nah ? 112 : 108)), fr = K.fr; K.split = nah ? [176, 186] : [168, 178];
  B.feld(K.e[0], -M, -M, W + M, H + M, ['#000000', '#040202'], () => .3);
  const ZE = nah ? 5.2 : 13;
  const c = { P, XL: nah ? 2.6 : 1.7, XR: nah ? 2.6 : 2.6, YC: 1.62, ZE, links: nah ? 'fenster' : 'tafel', rechts: 'fenster', boden: 'laeufer', laeuferX: nah ? 0 : -.3, laeuferB: .7, ende: nah ? 'loknah' : 'lok', fOff: .2, fPer: 1.5, fW: .95, zFern: nah ? 4 : 6,
    tuerB: nah ? .78 : .42, tuerH: nah ? 1.62 : 1.5, lokDx: nah ? 6 : 0,
    lampen: (nah ? [1.6, 3.4, 5] : [1.2, 2.7, 4.2, 5.7, 7.2, 8.7, 10.2, 11.7]).map(Z => ({ X: nah ? 1.75 : 1.85, Y: 1.05, Z })).concat(nah ? [1.6, 3.4, 5].map(Z => ({ X: -1.75, Y: 1.05, Z })) : []) };
  wagen(K, c);
  durchblick(K, P, c);
  fensterRahmen(K, P, c, 'R'); if (nah) fensterRahmen(K, P, c, 'L');
  // Büfett links: Anrichte mit Gläserschrank (Glanzpunkte)
  if (!nah) {
    for (let Z = 1.2; Z < ZE - .5; Z += 2.2) {
      const eb = Z > 6 ? 2 : 3, m = B.maske(), q = (Y, z) => P.q(-c.XL + .35, Y, z);
      m.poly([q(0, Z), q(.95, Z), q(.95, Z + 1.8), q(0, Z + 1.8)]);
      m.poly([P.q(-c.XL, 1.02, Z), P.q(-c.XL + .4, .95, Z), P.q(-c.XL + .4, .95, Z + 1.8), P.q(-c.XL, 1.02, Z + 1.8)]);
      K.form(eb, m, Math.min(.4, Z / 30), { k: HOLZ.slice(1, 7).map(B.col), ton: 1.6, fase: 1, rand: 2, r: RIM.r, schatten: 2 });
      for (let i = 0; i < 9; i++) { const [gx, gy] = P.q(-c.XL + .06, 1.18 + (i % 3) * .14, Z + .2 + Math.floor(i / 3) * .5); K.e[eb].set(gx, gy, B.pk(i % 4 ? '#c6e0f6' : '#ffd890')); }
    }
  }
  // Tische mit weißem Tuch, Tischlampe mit Faltenschirm, Stühle
  const tische = []; for (let Z = nah ? 1.6 : 1.4; Z < ZE - .8; Z += c.fPer) { tische.push([c.XR - .45, Z + .45]); if (nah) tische.push([-c.XL + .45, Z + .45]); }
  tische.sort((a, b) => b[1] - a[1]).forEach(([X, Z], i) => {
    const eb = Z > c.zFern ? 2 : 3, tf = Math.min(.4, Z / 30), k = P.k(Z), sg = Math.sign(X), Xw = sg * (sg > 0 ? c.XR : c.XL), Xa = X - sg * .42;
    // Sitzbank mit hoher Lehne (grüner Samt), Stirnseite zum Gang
    const bank = (z, vorn) => { const m = B.maske(), q = (XX, Y, zz) => P.q(XX, Y, zz);
      m.poly([q(Xw, 0, z), q(Xa, 0, z), q(Xa, .45, z), q(Xa + sg * .1, .45, z), q(Xa + sg * .1, 1.2, z), q(Xw, 1.2, z)]);
      m.poly([q(Xa, 0, z), q(Xa, 0, z + (vorn ? .5 : -.5)), q(Xa, .45, z + (vorn ? .5 : -.5)), q(Xa, .45, z)]);
      m.poly([q(Xa + sg * .1, 1.2, z), q(Xa + sg * .1, 1.2, z + .12), q(Xw, 1.2, z + .12), q(Xw, 1.2, z)]);
      K.form(z > c.zFern ? 2 : 3, m, Math.min(.4, z / 30), { k: POLSTER.map(B.col), ton: 1.5 + K.licht3(X, .8, z)[0] * 1.5, fase: 1, rand: 2, r: RIM.r, schatten: 2, muster: (x, y) => ((x + y * 2) % 9 === 0 ? -.35 : 0) }); };
    bank(Z + .62, false);
    const m = B.maske(), t = (dx, dz, Y) => P.q(X + dx, Y, Z + dz);
    m.poly([t(-.4, -.32, .76), t(.4, -.32, .76), t(.4, .32, .76), t(-.4, .32, .76)]);
    m.poly([t(-.4 * sg, -.32, .76), t(-.4 * sg, .32, .76), t(-.4 * sg, .32, .5), t(-.4 * sg, -.32, .5)]); // Tuch hängt zum Gang
    m.poly([t(-.4, -.32, .76), t(.4, -.32, .76), t(.4, -.32, .5), t(-.4, -.32, .5)]);
    K.form(eb, m, tf, { k: TUCH.slice(1, 8).map(B.col), ton: 1.6 + (K.licht3(X, .8, Z)[0]) * 2.2, fase: 1, rand: 2, r: ['#c8a060', '#fff0d0'], schatten: 2, muster: (x, y) => (B.bay(x, y) > .85 ? -.5 : 0) });
    for (const dz of [-.15, .15]) { const [px, py] = t(-.1 * sg, dz, .77); K.e[eb].set(px, py, B.pk(TUCH[7])); K.e[eb].set(px + 1, py, B.pk(TUCH[6])); const [gx, gy] = t(-.25 * sg, dz, .8); K.e[eb].set(gx, gy, B.pk('#c6e0f6')); }
    const an = !(fr > .5 && i % 3 === 1);
    const [lx, ly] = t(.2 * sg, 0, .77), lk = k * .1;
    const lm = B.maske(); lm.kap(lx, ly, lx, ly - lk * 2.2, Math.max(.5, lk * .12), Math.max(.5, lk * .12)); lm.poly([[lx - lk, ly - lk * 2], [lx + lk, ly - lk * 2], [lx + lk * .55, ly - lk * 3.2], [lx - lk * .55, ly - lk * 3.2]]);
    K.form(eb, lm, 0, { k: (an ? ['#5a3010', '#8a5018', '#c07a28', '#f0b050'] : HOLZ.slice(2, 6)).map(B.col), ton: 1.6, fase: 0, rand: 1, r: an ? ['#ffd890', '#fff4dc'] : RIM.r, muster: (x) => (x % 2 ? .2 : -.2) });
    if (an) { K.glut(lx, ly - lk * 2, Math.max(10, k * .7), LAMPG, .9, [2, 3, 4]); K.licht(lx, ly - lk * 2, LAMPE, Math.max(10, k * .7), .6); }
    bank(Z - .62, true);
  });
  if (nah) uhrBahnhof(K, P, c);
  // Vordergrund: angeschnittene Banklehne(n), nah und dunkel
  for (const sg of nah ? [-1, 1] : [1]) { const v = B.maske(), x = sg < 0 ? -M : W + M, x2 = sg < 0 ? 40 : 440; v.poly([[x, 120], [x2 + sg * 8, 124], [x2, 132], [x2 - sg * 4, H + M], [x, H + M]]); K.form(5, v, 0, { k: POLSTER.slice(0, 5).map(B.col), ton: 1.1, fase: 2, rand: 2, r: RIM.r, muster: (px, py) => ((px + py * 2) % 9 === 0 ? -.35 : 0) }); }
  fensterGlanz(K);
  luft(K, P);
  K.reihen = nah ? [{ y: 186, skala: .9, nebel: .28 }, { y: 200, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }] : [{ y: 180, skala: .9, nebel: .3 }, { y: 198, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [nah ? 240 : 230, 210] };
}
// Bahnhofsuhr über der Tür nach vorn (Wächter-Szene): Zeiger stehen, der Sekundenzeiger läuft rückwärts
function uhrBahnhof(K, P, c) {
  const [x, y] = P.q(-.95, 1.55, c.ZE - .05), R = Math.max(5, P.k(c.ZE) * .16), e = K.e[1];
  B.feld(e, x - R - 2, y - R - 2, x + R + 2, y + R + 2, MESSING, (px, py) => { const q = Math.hypot(px + .5 - x, py + .5 - y) / R; return q > 1.2 ? -1 : q > 1 ? .5 + (px > x ? .3 : 0) : -1; });
  B.feld(e, x - R, y - R, x + R, y + R, TUCH, (px, py) => { const q = Math.hypot(px + .5 - x, py + .5 - y) / R; return q > 1 ? -1 : .75 - q * .2; });
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; e.set(x + Math.cos(a) * R * .82, y + Math.sin(a) * R * .82, B.pk(TUCH[1])); }
  B.linie(e, x, y, x - R * .45, y - R * .2, B.pk(TUCH[0])); B.linie(e, x, y, x + R * .1, y - R * .72, B.pk(TUCH[0]));
  K.anim.push({ p: B.PAR[1], f(ctx, t, ox, oy) { const a = -Math.PI / 2 - t * .5; ctx.fillStyle = '#8a2a1a'; for (let r = 1; r < R * .78; r++) ctx.fillRect(Math.round(x + Math.cos(a) * r + ox), Math.round(y + Math.sin(a) * r + oy), 1, 1); } });
}

// Variante 2: Gepäckwagen, quer gesehen. Gegenüber steht die Schiebetür offen, und draußen ist nichts, nicht einmal
// Nacht. Links und rechts Gepäck, Postsäcke, Milchkannen. Vorne (links) durch die Ritzen der Stirntür: das Licht der Lok.
function gepaeckwagen(K, o) {
  o = o || {};
  const P = B.persp(250, 112), fr = K.fr; K.split = [168, 178];
  B.feld(K.e[0], -M, -M, W + M, H + M, ['#000000', '#040202'], () => .3);
  const c = { P, XL: 2.9, XR: 3.4, YC: 1.55, ZE: 2.1, links: 'brett', rechts: 'brett', boden: 'diele', ende: 'schwarz', endeBrett: true, zFern: 9, tuerX: .25, tuerB: .78, tuerH: 1.42,
    lampen: [{ X: -.6, Y: 1.2, Z: 1.5 }, { X: -2.8, Y: .9, Z: 1.4 }] };
  wagen(K, c);
  // Türrahmen und die aufgeschobene Tür daneben
  const [dx0, dy0] = P.q(c.tuerX - c.tuerB, c.tuerH, c.ZE), [dx1, dy1] = P.q(c.tuerX + c.tuerB, 0, c.ZE);
  const rm = B.maske(); rahmenMaske(rm, [[dx0 - 4, dy0 - 5], [dx1 + 4, dy0 - 5], [dx1 + 4, dy1], [dx0 - 4, dy1]], [[dx0, dy0], [dx1, dy0], [dx1, dy1], [dx0, dy1]]);
  K.form(1, rm, 0, { k: HOLZ.slice(1, 7).map(B.col), ton: 1.7, fase: 1, rand: 2, r: RIM.r });
  const sch = B.maske(); sch.rect(dx1 + 6, dy0 - 3, (dx1 - dx0) * .95, dy1 - dy0 + 3); sch.rect(dx0 - 10, dy0 - 9, (dx1 - dx0) * 2.1, 3);
  K.form(1, sch, 0, { k: HOLZ.slice(0, 6).map(B.col), ton: .9, fase: 2, rand: 2, r: RIM.r, muster: (x, y) => ((x - dx1) % 7 === 0 ? -.4 : 0) + (Math.abs(y - (dy0 + dy1) / 2) < 1 ? .4 : 0), schatten: 2 });
  // Draußen: völlig schwarz. Nur ganz unten ein Streifen kalter Luft, der hereinweht (Partikel)
  for (let y = Math.floor(dy0); y < dy1; y++) for (let x = Math.floor(dx0); x < dx1; x++) for (const e of [K.e[1], K.e[2], K.e[3]]) e.set(x, y, e === K.e[1] ? 0xff000000 : 0);
  // Stirntür links (Richtung Lok): Licht durch die Ritzen
  const zt0 = .7, zt1 = 1.6, e = K.e[3];
  for (const [Y0, Y1, Z] of [[0, 1.5, zt0], [0, 1.5, zt1], [1.5, 1.5, -1]]) {
    if (Z > 0) { const a = P.q(-c.XL, Y0, Z), b = P.q(-c.XL, Y1, Z); B.linie(e, a[0], a[1], b[0], b[1], B.pk(LOK)); B.linie(e, a[0] + 1, a[1], b[0] + 1, b[1], B.pk('#d0ac58'), .6); }
    else { const a = P.q(-c.XL, 1.5, zt0), b = P.q(-c.XL, 1.5, zt1); B.linie(e, a[0], a[1], b[0], b[1], B.pk(LOK)); }
  }
  const [kx, ky] = P.q(-c.XL, .95, zt1 - .2); e.set(kx, ky, B.pk(LOK)); e.set(kx, ky + 1, B.pk(LOK));
  for (const L of [K.e[3], K.e[4]]) { B.kegel(L, kx, ky, .25, .12, 260, '#4a3a22', .4 + fr * .3); B.kegel(L, P.q(-c.XL, 0, zt1)[0], P.q(-c.XL, 0, zt1)[1], -.05, .05, 300, '#4a3a22', .45 + fr * .3); }
  K.glut(kx, ky, 40, '#3a3020', .8, [3]); K.licht(kx, ky, LOK, 40, .8);
  // Laterne am Deckenbalken, Deckenbalken quer
  for (const X of [-2.6, -.6, 1.4, 3.4]) { const bm = B.maske(); bm.poly([P.q(X - .07, c.YC, .5), P.q(X + .07, c.YC, .5), P.q(X + .07, c.YC, c.ZE), P.q(X - .07, c.YC, c.ZE)]); K.form(2, bm, 0, { k: HOLZ.slice(0, 6).map(B.col), ton: 1.3, fase: 1, rand: 2, r: RIM.r }); }
  const [lx, ly] = P.q(-.6, 1.2, 1.5), lk = P.k(1.5);
  const lm = B.maske(); lm.kap(lx, P.q(-.6, c.YC, 1.5)[1], lx, ly - lk * .1, .8, .8); lm.poly([[lx - lk * .07, ly - lk * .1], [lx + lk * .07, ly - lk * .1], [lx + lk * .08, ly + lk * .12], [lx - lk * .08, ly + lk * .12]]); lm.poly([[lx - lk * .09, ly - lk * .1], [lx + lk * .09, ly - lk * .1], [lx, ly - lk * .18]]);
  K.form(3, lm, 0, { k: HOLZ.slice(0, 5).map(B.col), ton: 1.2, fase: 0, rand: 1, r: RIM_W.r });
  if (fr < .85) { B.flamme(K, Math.round(lx), Math.round(ly + lk * .06), { p: B.PAR[3], kern: '#fff4dc', mitte: LAMPE, aussen: '#b06a20', glut: '#3a2008', gross: 2 }); K.glut(lx, ly, lk * 1.8, LAMPG, 1, [1, 2, 3, 4]); K.licht(lx, ly, LAMPE, lk * 1.8, 1); }
  // Gepäck: Kisten und Koffer (Quader), Postsäcke, Milchkannen
  const quader = (X, Z, b, h, t, ton, eb) => { const q = (dx, Y, dz) => P.q(X + dx, Y, Z + dz), E2 = eb || 3, li = K.licht3(X, h, Z)[0];
    const vorn = [q(-b, 0, 0), q(b, 0, 0), q(b, h, 0), q(-b, h, 0)], oben = [q(-b, h, 0), q(b, h, 0), q(b, h, t), q(-b, h, t)], seite = X + b < 0 ? [q(b, 0, 0), q(b, 0, t), q(b, h, t), q(b, h, 0)] : [q(-b, 0, 0), q(-b, 0, t), q(-b, h, t), q(-b, h, 0)];
    const m = B.maske(); m.poly(vorn); m.poly(oben); m.poly(seite);
    K.form(E2, m, 0, { k: ['#060303', '#0e0706', '#180c09', '#24120d', '#331a12', '#462418', '#5c3020', '#743c28'].map(B.col), ton: 1.6 + (ton || 1.5) * .3 + li * 1.6, fase: 1, rand: 2, r: RIM.r, schatten: 2, muster: (x, y) => (inPoly(x + .5, y + .5, oben) ? 2.2 : inPoly(x + .5, y + .5, seite) ? .9 : 0) + (B.hash(x >> 2, y >> 1, Z * 9 | 0) > .85 ? .35 : 0) });
    const [bx, by] = q(-b * .5, h * .6, 0); K.e[E2].set(bx, by, B.pk(MESSING[5])); const [ex, ey] = q(b * .5, h * .6, 0); K.e[E2].set(ex, ey, B.pk(MESSING[4]));
    const [r0x, r0y] = q(-b, h * .5, 0), [r1x, r1y] = q(b, h * .5, 0); B.linie(K.e[E2], r0x + 1, r0y, r1x - 1, r1y, B.pk('#060303')); };
  quader(-2.3, 1.55, .4, .55, .5, 1.3, 2); quader(-2.25, 1.6, .32, .38, .42, 1.8, 2); quader(-2.35, 1.65, .18, .26, .3, 2.1, 2); quader(-1.55, 1.7, .26, .3, .38, 1.6, 2); quader(-2.2, 1.05, .28, .42, .4, 1.2, 3);
  quader(1.7, 1.6, .42, .62, .45, 1.3, 2); quader(1.75, 1.65, .26, .3, .36, 1.9, 2); quader(2.5, 1.5, .22, .85, .5, 1.4, 2);
  for (const [X, Z, s] of [[-1.0, 1.85, 1], [-1.3, 1.65, .8], [-.75, 1.95, .7]]) { const m = B.maske(), [x, y] = P.q(X, 0, Z), k = P.k(Z) * s; m.ell(x, y - k * .16, k * .22, k * .17); m.ell(x - k * .05, y - k * .33, k * .07, k * .08); K.form(2, m, 0, { k: TUCH.slice(0, 6).map(B.col), ton: 2.2 + K.licht3(X, .2, Z)[0] * 1.5, fase: 2, rand: 2, r: RIM.r, schatten: 2, muster: (px) => (px % 5 === 0 ? -.3 : 0) }); }
  for (const [X, Z] of [[1.05, 1.45], [1.3, 1.6], [1.45, 1.3]]) { const m = B.maske(), [x, y] = P.q(X, 0, Z), k = P.k(Z); m.rect(x - k * .11, y - k * .48, k * .22, k * .48); m.ell(x, y - k * .48, k * .08, k * .03); m.rect(x - k * .055, y - k * .6, k * .11, k * .12); m.ell(x, y - k * .61, k * .075, k * .025); K.form(Z > 1.5 ? 2 : 3, m, 0, { k: ['#0a0c0e', '#14181c', '#20262c', '#2e363e', '#3e4852', '#56626e'].map(B.col), ton: 1.7, fase: 2, rand: 2, r: RIM.r, schatten: 2, muster: (px, py) => (Math.abs(py - (y - k * .36)) < 1 ? -.6 : 0) }); }
  const fm = B.maske(), [fx, fy] = P.q(2.6, .7, 2.05), fk = P.k(2.05); fm.ell(fx - fk * .3, fy, fk * .2, fk * .2); fm.ell(fx - fk * .3, fy, fk * .17, fk * .17, 0); fm.ell(fx + fk * .3, fy, fk * .2, fk * .2); fm.ell(fx + fk * .3, fy, fk * .17, fk * .17, 0); fm.pfad([[fx - fk * .3, fy], [fx, fy - fk * .25], [fx + fk * .3, fy], [fx + fk * .05, fy], [fx - fk * .3, fy]], .7, .7);
  K.form(1, fm, 0, { k: HOLZ.slice(0, 5).map(B.col), ton: 1.2, fase: 0, rand: 1, r: RIM.r });
  // Vordergrund: Postsäcke links unten, Kante eines Überseekoffers rechts unten; Lichtfleck der Laterne am Boden
  const v1 = B.maske(); v1.ell(18, 262, 40, 22); v1.ell(52, 268, 26, 16); v1.ell(8, 236, 18, 14); K.form(5, v1, 0, { k: TUCH.slice(0, 5).map(B.col), ton: 1.4, fase: 2, rand: 2, r: RIM.r, muster: (px) => (px % 6 === 0 ? -.4 : 0) });
  const v2 = B.maske(); v2.poly([[418, 236], [W + M, 228], [W + M, H + M], [424, H + M]]); v2.poly([[410, 236], [418, 230], [W + M, 222], [W + M, 230]]); K.form(5, v2, 0, { k: HOLZ.slice(0, 6).map(B.col), ton: 1.5, fase: 2, rand: 2, r: RIM.r, muster: (px, py) => (py === 250 || py === 251 ? -.8 : 0) });
  for (const [x, y] of [[422, 238], [474, 232], [424, 268]]) K.e[5].set(x, y, B.pk(MESSING[5]));
  const [bfx, bfy] = P.q(-.6, 0, 1.5); B.dith(K.e[4], bfx - 90, bfy - 14, bfx + 90, bfy + 30, "#3a2412", (x, y) => .55 * Math.max(0, 1 - Math.hypot((x - bfx) / 90, (y - bfy - 6) / 26)));
  luft(K, P);
  K.reihen = [{ y: 180, skala: .9, nebel: .3 }, { y: 198, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [250, 210] };
}

// Abteil (Rast): Blick von der Tür auf das Fenster. Zwei Polsterbänke einander gegenüber an den Seitenwänden,
// darüber Gepäcknetze, am Fenster ein Klapptisch und die Leselampe. Im Fenster groß: die Kurve.
function abteil(K) {
  const P = B.persp(240, 116), fr = K.fr; K.split = [176, 186];
  B.feld(K.e[0], -M, -M, W + M, H + M, ['#000000', '#040202'], () => .3);
  const ZE = 2.5, XW = 1.25;
  const c = { P, XL: XW, XR: XW, YC: 1.55, ZE, links: 'tafel', rechts: 'tafel', boden: 'laeufer', laeuferB: 1.0, ende: 'fenster', tuerB: 0, zFern: 9,
    lampen: [{ X: .95, Y: 1.2, Z: 2.2 }, { X: 0, Y: 1.1, Z: 2.4 }] };
  wagen(K, c);
  // Fenster in der Stirnwand: groß, mit der Kurve
  const [fx0, fy0] = P.q(-.82, 1.4, ZE), [fx1, fy1] = P.q(.82, .82, ZE);
  for (let y = Math.floor(fy0); y < fy1; y++) for (let x = Math.floor(fx0); x < fx1; x++) { const u = (x - fx0) / (fx1 - fx0), v = (y - fy0) / (fy1 - fy0), i = kurve(u, v, fr); K.e[1].set(x, y, B.pk(i === -2 ? LAMPE : BLAU[Math.max(0, i)])); if (i >= 7 || i === -2) (K.fensterBild = K.fensterBild || []).push([x, y, i === -2 ? 1 : 0]); }
  const rm = B.maske(); rahmenMaske(rm, [[fx0 - 4, fy0 - 4], [fx1 + 4, fy0 - 4], [fx1 + 4, fy1 + 4], [fx0 - 4, fy1 + 4]], [[fx0, fy0], [fx1, fy0], [fx1, fy1], [fx0, fy1]]);
  K.form(1, rm, 0, { k: MESSING.slice(0, 5).map(B.col), ton: 1.6, fase: 1, rand: 1, r: ['#a88436', '#f4dc98'] });
  // Vorhänge seitlich am Fenster
  for (const sg of [-1, 1]) { const v = B.maske(), a = sg < 0 ? fx0 : fx1; v.poly([[a - sg * 2, fy0 - 6], [a + sg * 16, fy0 - 6], [a + sg * 8, (fy0 + fy1) / 2], [a + sg * 12, fy1 + 10], [a - sg * 2, fy1 + 10]]); K.form(1, v, 0, { k: POLSTER.map(B.col), ton: 1.5, fase: 1, rand: 2, r: RIM.r, muster: (x) => (x % 3 === 0 ? -.4 : 0) }); }
  // Klapptisch unter dem Fenster
  const tm = B.maske(), tq = (X, Y, Z) => P.q(X, Y, Z); tm.poly([tq(-.45, .78, ZE - .4), tq(.45, .78, ZE - .4), tq(.45, .78, ZE), tq(-.45, .78, ZE)]); tm.poly([tq(-.45, .78, ZE - .4), tq(.45, .78, ZE - .4), tq(.45, .72, ZE - .4), tq(-.45, .72, ZE - .4)]);
  K.form(2, tm, 0, { k: HOLZ.slice(1, 8).map(B.col), ton: 1.8, fase: 1, rand: 2, r: RIM_W.r });
  // Bänke an beiden Seitenwänden, einander gegenüber: Sitz, Stirnseite, Rückenlehne, Kopfstütze
  for (const sg of [-1, 1]) {
    const q = (X, Y, Z) => P.q(sg * X, Y, Z), z0 = .55, z1 = ZE - .02;
    const m = B.maske();
    m.poly([q(.66, .42, z0), q(1.1, .42, z0), q(1.1, .42, z1), q(.66, .42, z1)]); // Sitzfläche
    m.poly([q(.66, 0, z0), q(.66, .42, z0), q(.66, .42, z1), q(.66, 0, z1)]); // Vorderkante
    m.poly([q(1.1, .42, z0), q(1.02, 1.28, z0), q(1.02, 1.28, z1), q(1.1, .42, z1)]); // Lehne
    m.poly([q(.66, 0, z0), q(1.25, 0, z0), q(1.25, 1.32, z0), q(1.02, 1.32, z0), q(1.1, .42, z0), q(.66, .42, z0)]); // Stirnseite (nah)
    K.form(3, m, 0, { k: POLSTER.map(B.col), ton: 1.6 + (sg > 0 ? .3 : 0), fase: 2, rand: 2, r: sg > 0 ? RIM_W.r : RIM.r, schatten: 2, muster: (x, y) => ((x * 2 + y) % 13 === 0 ? -.4 : 0) });
    // Spitzendeckchen an der Kopfstütze (hell)
    const d = B.maske(); d.poly([q(1.03, 1.18, 1.3), q(1.03, 1.3, 1.3), q(1.03, 1.3, 1.75), q(1.03, 1.18, 1.75)]); K.form(3, d, 0, { k: TUCH.slice(2, 7).map(B.col), ton: 1.4, fase: 0, rand: 1, r: ['#c8a060', '#fff0d0'] });
    // Gepäcknetz mit Koffer
    const n = B.maske(); n.poly([q(1.25, 1.45, .6), q(.82, 1.42, .6), q(.82, 1.42, z1), q(1.25, 1.45, z1)]);
    K.form(2, n, 0, { k: MESSING.slice(0, 4).map(B.col), ton: 1, fase: 0, rand: 1, r: ['#a88436', '#f4dc98'], muster: (x, y) => ((x + y) % 3 ? -.6 : .4) });
    const km = B.maske(); km.poly([q(1.2, 1.43, 1.0 + (sg > 0 ? .3 : 0)), q(.88, 1.43, 1.0 + (sg > 0 ? .3 : 0)), q(.88, 1.62, 1.0 + (sg > 0 ? .3 : 0)), q(1.2, 1.62, 1.0 + (sg > 0 ? .3 : 0))]);
    K.form(2, km, 0, { k: HOLZ.slice(1, 7).map(B.col), ton: 1.6, fase: 1, rand: 2, r: RIM.r, schatten: 1 });
  }
  // Reiseplaid auf der linken Bank, kariert
  const pm = B.maske(), pq = (X, Y, Z) => P.q(X, Y, Z); pm.poly([pq(-1.08, .46, .9), pq(-.68, .44, .95), pq(-.66, .1, 1.05), pq(-.68, .44, 1.5), pq(-1.08, .46, 1.6)]);
  K.form(3, pm, 0, { k: ['#0a0606', '#1a0c0a', '#2e1612', '#44201a', '#5e2c22', '#783a2c'].map(B.col), ton: 1.8, fase: 1, rand: 2, r: RIM.r, muster: (x, y) => (((x >> 2) + (y >> 2)) & 1 ? .5 : 0) + ((x & 3) === 0 || (y & 3) === 0 ? -.3 : 0) });
  // Leselampe an der Wand rechts, sie brennt
  const [lx, ly] = P.q(1.18, 1.18, 2.2); B.flamme(K, Math.round(lx), Math.round(ly), { p: B.PAR[3], kern: '#fff4dc', mitte: LAMPE, aussen: '#b06a20', glut: '#3a2008' }); K.glut(lx, ly, 90, LAMPG, .95, [1, 2, 3, 4]); K.licht(lx, ly, LAMPE, 90, .9);
  fensterGlanz(K);
  luft(K, P);
  K.reihen = [{ y: 184, skala: .9, nebel: .3 }, { y: 200, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 212] };
}

// Glanz in den Fenstern: Das warme Haus am Hang glimmt, die Schienen blinken auf (in allen Fenstern gleichzeitig)
function fensterGlanz(K) {
  const L = K.fensterBild || []; if (!L.length) return;
  const haus = L.filter(p => p[2] === 1), gleis = L.filter(p => p[2] === 0);
  K.anim.push({ p: B.PAR[3], f(ctx, t, ox, oy) {
    if (Math.sin(t * .7) > -.6) { ctx.fillStyle = '#fff4dc'; for (const [x, y] of haus) if (B.hash(x, y, 4) > .5) ctx.fillRect(x + ox, y + oy, 1, 1); }
    if (Math.sin(t * 1.3) > .6) { ctx.fillStyle = '#c6e0f6'; for (const [x, y] of gleis) ctx.fillRect(x + ox, y + oy, 1, 1); }
  } });
}
// Luft: Staub im Lampenlicht, langsam nach hinten treibend (der Zug fährt)
function luft(K, P) {
  B.partikel(K, { n: 46, farben: ['#3a2a22', '#6a5040', '#a88436'], vx: 3, vy: -.5, wob: 2, wf: .4, x0: 20, x1: 460, y0: 10, y1: 220, hellSelten: 2.5 });
  B.nebel(K.e[2], { y0: P.vy - 30, y1: P.vy + 40, col: '#2a1e1a', dichte: .2, xs: [P.vx - 160, P.vx + 160, 60], seed: 4 });
}

// ---------- Zusätze je Art ----------
function kraemerStand(K, x, y) { // Der Schaffner: Klapptisch mit Fundsachen, Schirme, Hüte, eine Laterne
  const m = B.maske(); m.rect(x - 40, y - 26, 80, 5); m.kap(x - 34, y - 21, x - 30, y, 1.6, 1.6); m.kap(x + 34, y - 21, x + 30, y, 1.6, 1.6);
  for (let i = 0; i < 4; i++) m.kap(x - 46 + i * 4, y, x - 40 + i * 5, y - 60 - i * 3, 1, .8); // Schirme an der Wand
  m.ell(x - 18, y - 30, 7, 2); m.ell(x - 18, y - 33, 4.5, 3.5); // Melone
  m.rect(x - 4, y - 34, 14, 8); m.rect(x + 14, y - 31, 10, 5); m.ell(x + 30, y - 29, 4, 3);
  K.form(4, m, 0, { k: HOLZ.slice(0, 7).map(B.col), ton: 1.6, fase: 1, rand: 2, r: RIM.r, schatten: 2 });
  K.e[4].set(x + 30, y - 30, B.pk(MESSING[5])); K.e[4].set(x + 3, y - 30, B.pk(MESSING[4]));
  B.flamme(K, x + 36, y - 52, { p: .5, kern: '#fff4dc', mitte: LAMPE, aussen: '#b06a20', glut: '#3a2008' }); for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x + 36, y - 50, 44, LAMPG, .9);
  K.licht(x + 36, y - 52, LAMPE, 44, .9);
}
function koffer(K, x, y) { // Fundstück / Ereignis: ein Koffer mitten im Gang, das Schloss glimmt
  const m = B.maske(); m.rect(x - 16, y - 16, 32, 16); m.kap(x - 5, y - 18, x + 5, y - 18, 1.4, 1.4);
  B.form(K.e[4], m, K.mat(0, { k: HOLZ.slice(1, 7).map(B.col), ton: 1.6, schatten: 2, muster: (px, py) => (py === y - 8 ? -1 : 0) }));
  K.e[4].set(x + 6, y - 9, B.pk(LAMPE)); B.gluehen(K.e[4], x + 6, y - 9, 12, LAMPG, .9);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.7) > .5) { ctx.fillStyle = '#fff4dc'; ctx.fillRect(x + 6 + ox, y - 9 + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' || art === 'werkstatt' ? 2 : art === 'ereignis' || art === 'fund' || art === 'wandbild' ? 0 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = speisewagen(K, { nah: true });
  else if (art === 'uebergang') info = gang(K, { ende: 'wasser', ZE: 5.5 });
  else if (art === 'rast') info = abteil(K);
  else info = [gang, speisewagen, gepaeckwagen][v](K);
  if (art === 'kraemer') kraemerStand(K, info.mitte[0] + 40, info.mitte[1]);
  else if (art === 'werkstatt') B.werkbank(K, info.mitte[0], info.mitte[1] + 4);
  else if (art === 'fund' || art === 'ereignis') koffer(K, info.mitte[0], info.mitte[1]);
  return K.fertig();
}
World._biome.nachtzug = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 3, knick: .4, stein: ['#22100d', '#2f1712', '#3e1f17', '#86472e'] } };
})();
