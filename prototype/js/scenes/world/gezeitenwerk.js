// Saltmoor 1925 · Hintergründe: Akt III, Das Gezeitenwerk (Biom-Paket gezeitenwerk).
// Komposition: docs/auftrag-2/biome/gezeitenwerk.md
// Grundform: der Eingriff. Riesige Kreisbögen (Zahnräder, angeschnitten) schneiden das Bild, die Kanäle
// am Boden laufen als Fluchtlinien darauf zu. Licht: oben rechts stürzt der Zulauf herab, Meerwasser
// voll Meeresleuchten; daher das Gegenlicht. Das falsche Detail: alles ist für Hände mit sieben Fingern
// gebaut, und in Griffen, Hebeln und Grünspan sind die Abdrücke noch frisch.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M, TAU = Math.PI * 2;
const pal = { koerper: ['#030504', '#08100c', '#0f1d16', '#1a2e24'], rand: ['#3f8a6c', '#a8e6c4'], augen: '#d4ff5a', nebel: ['#0c1c16', '#2c4a3c'], fern: '#3c6a56' };
const BRONZE = ['#040907', '#08120d', '#0d1b14', '#13261c', '#1a3225', '#223f2f', '#2c4e3a', '#3a6249'];
const NASS = ['#020403', '#040907', '#08100c', '#0c1712', '#111f18', '#182a20', '#21382b'];
const WASSER = ['#020707', '#041010', '#071a18', '#0b2622', '#10332d', '#174238', '#215446'];
const HIMMEL = ['#06100c', '#0a1812', '#0f2219', '#152d21', '#1d3b2b', '#274c37', '#335f45', '#437556', '#5a8f6c', '#7aaa88'];
const BLANK = ['#2a2210', '#4a3a1a', '#7a6230', '#a8823e'];
const MESS = ['#a8823e', '#e6c88a'];
const PHOS = '#d4ff5a', PHOS_K = '#f4ffd0', PHOS_G = '#28400e';
const LAMPE = '#ffc070', LAMPG = '#4a2a0a';

// Zahnrad von vorn: Kranz mit Zähnen, Speichen, Nabe, Löcher dazwischen.
// o: n Zähne, th Zahnhöhe, rot, sp Speichen, kranz (Breite), nabe (Radius), sy (Stauchung), tiefe, dicke [dx,dy]
function zahnrad(K, eb, cx, cy, R, o) {
  const n = o.n || 40, th = o.th || R * 0.08, rot = o.rot || 0, sp = o.sp || 7, kr = o.kranz || R * 0.16, nb = o.nabe || R * 0.18, sy = o.sy || 1;
  const innen = (x, y, dx, dy) => {
    const u = x - cx - dx, v = (y - cy - dy) / sy, rr = Math.hypot(u, v); if (rr > R + th) return false;
    const a = Math.atan2(v, u) + rot;
    if (rr > R) { const f = ((a / TAU * n) % 1 + 1) % 1; const z = f < 0.1 ? f / 0.1 : f < 0.45 ? 1 : f < 0.55 ? 1 - (f - 0.45) / 0.1 : 0; return rr < R + th * z; }
    if (rr > R - kr || rr < nb) return true;
    if (o.voll) return true; // Scheibe: Speichen nur als Rillen (muster)
    const s = ((a / TAU * sp) % 1 + 1) % 1, d = Math.min(s, 1 - s) * TAU / sp * rr; return d < (o.speiche || R * 0.045) + (R - rr) * 0.03;
  };
  const bb = [cx - R - th - 10, cy - (R + th) * sy - 10, cx + R + th + 10, cy + (R + th) * sy + 10];
  const d = o.dicke || [R * 0.03, -R * 0.022];
  const hinten = B.maske(); hinten.fn(bb[0], bb[1], bb[2], bb[3], (x, y) => innen(x, y, d[0], d[1]));
  K.form(eb, hinten, (o.tiefe || 0) + 0.04, { k: BRONZE.slice(0, 5), ton: 1.2, fase: 0, rand: 2, verlauf: 0.3 });
  const vorn = B.maske(); vorn.fn(bb[0], bb[1], bb[2], bb[3], (x, y) => innen(x, y, 0, 0));
  K.form(eb, vorn, o.tiefe || 0, { k: BRONZE.slice(1, 8), ton: o.ton || 2.2, fase: Math.max(1.5, R * 0.012), rand: 2, schatten: 2, verlauf: 0.6,
    muster: (x, y) => { const u = x - cx, v = (y - cy) / sy, rr = Math.hypot(u, v); let t = (Math.abs(rr - (R - kr)) < 1.2 || Math.abs(rr - nb) < 1.2 ? -1.2 : 0) + (B.fbm(x * 0.05, y * 0.05, 7, 2) - 0.5) * 0.9;
      if (o.voll && rr < R - kr && rr > nb) { const a = Math.atan2(v, u) + rot, s2 = ((a / TAU * sp) % 1 + 1) % 1, d2 = Math.min(s2, 1 - s2) * TAU / sp * rr; t += d2 < 1.3 ? -1.6 : d2 < 3 ? 0.6 : -0.9 - (1 - rr / R) * 0.8; }
      return t; } });
  return { innen, R, th, cx, cy, n, rot, sy };
}
// Handabdruck mit sieben Fingern, auf eine Fläche gedrückt; die Kuppen leuchten schwach (Phosphoröl)
function abdruck(K, eb, x, y, s, winkel, hell) {
  // Blank gegriffen: wo die Hand lag, ist der Grünspan weg und die Bronze glänzt
  const e = K.e[eb], f0 = B.pk(BLANK[0]), f1 = B.pk(BLANK[1]), f2 = B.pk(BLANK[2]), ph = B.pk(PHOS), pg = B.pk(PHOS_G);
  const ca = Math.cos(winkel || 0), sa = Math.sin(winkel || 0), T = (u, v) => [x + u * ca - v * sa, y + u * sa + v * ca];
  const m = B.maske();
  for (let v = -3 * s; v <= 3 * s; v += 0.4) for (let u = -4 * s; u <= 4 * s; u += 0.4) if ((u / (4 * s)) ** 2 + (v / (3 * s)) ** 2 <= 1) { const [px, py] = T(u, v); m.put(Math.floor(px), Math.floor(py), 1); m._grow(Math.floor(px), Math.floor(py), Math.floor(px), Math.floor(py)); }
  const kuppen = [];
  for (let i = 0; i < 7; i++) {
    const u0 = (-3.6 + i * 1.2) * s, l = [3, 4.4, 5.4, 6, 5.4, 4.4, 3][i] * s;
    for (let k = 0; k <= l; k += 0.4) { const [px, py] = T(u0 + (i - 3) * k * 0.06, -2.4 * s - k); m.put(Math.floor(px), Math.floor(py), 1); m._grow(Math.floor(px), Math.floor(py), Math.floor(px), Math.floor(py)); }
    kuppen.push(T(u0 + (i - 3) * l * 0.06, -2.4 * s - l));
  }
  for (let py = m.y0; py <= m.y1; py++) for (let px = m.x0; px <= m.x1; px++) if (m.has(px, py)) {
    const rand = !m.has(px + 1, py - 1) || !m.has(px + 1, py); const innen = !m.has(px - 1, py + 1);
    e.set(px, py, rand ? f2 : innen ? f0 : (B.bay(px, py) > 0.7 ? f2 : f1));
  }
  kuppen.forEach(([tx, ty], i) => { if (hell && i % 2 === 0) { e.set(tx, ty, ph); B.gluehen(e, tx, ty, 3 + s, PHOS_G, 0.6); } else if (hell) e.set(tx, ty, pg); });
}
// Boden: Bronzeplatten (genietet, nass) mit Kanälen; klasse liefert -1 / 0 Platte / 1 Wasser / 2 Kante
function bodenWerk(K, P, y0, kanaele, o) {
  o = o || {}; const sd = K.o.seed, gr = o.gr || 1.1, hx = o.glanzX === undefined ? 380 : o.glanzX;
  const mats = [
    { cols: NASS, tf: (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h, k = P.k(Z); const fx = X / gr - Math.floor(X / gr), fz = Z / (gr * 1.6) - Math.floor(Z / (gr * 1.6));
      let t = 0.32 + Math.min(0.25, Z / 60) + (B.hash(Math.floor(X / gr), Math.floor(Z / gr / 1.6), sd) - 0.5) * 0.12;
      if (fx * gr * k < 1 || fz * gr * 1.6 * k * k / P.h < 0.8) t -= 0.25; // Fugen
      if ((fx * gr * k < 3.2 && fx * gr * k > 2.2) && (fz * gr * 1.6 * k * k / P.h < 2.5)) t += 0.5; // Nieten
      t += Math.max(0, 0.35 - Math.abs(x - hx - (y - P.vy) * 0.6) / 140) * (1 - Math.min(1, (y - P.vy) / 130)); // nasser Glanz zum Licht
      return t + (B.fbm(X * 0.6, Z * 0.4, sd + 3, 2) - 0.5) * 0.25; } },
    { cols: WASSER, tf: (x, y) => { const Z = P.z(y + 0.5); return 0.3 + Math.min(0.3, 8 / Z) * 0.6 + (Math.sin(Z * 3 + x * 0.05) > 0.85 ? 0.3 : 0) + (B.fbm(x * 0.03, Z * 0.6, sd + 9, 2) - 0.5) * 0.3; } },
    { cols: BRONZE.slice(2), tf: (x, y) => 0.55 + (B.hash(x >> 1, y, sd) - 0.5) * 0.2 },
  ];
  K.bodenStoffe(y0, H + M, mats, (x, y) => {
    const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h, k = P.k(Z);
    for (const c of kanaele) { const dx = Math.abs(X - c.X) * k; const w = c.w * k; if (dx < w) return 1; if (dx < w + Math.max(1, k * 0.06)) return 2; }
    return 0;
  });
}
// Leuchten im Wasser der Kanäle: Punkte, die gegen die Neigung laufen (vom Betrachter weg, bergauf)
function kanalLeuchten(K, P, kanaele, y0, n) {
  const pts = [];
  for (let i = 0; i < n; i++) pts.push({ c: kanaele[i % kanaele.length], z0: Math.random(), dx: Math.random() * 2 - 1, v: 0.03 + Math.random() * 0.04, ph: Math.random() * 6 });
  const zMax = P.z(y0 + 1);
  K.anim.push({ p: 0.5, f(ctx, t) {
    for (const q of pts) {
      const s = ((q.z0 - t * q.v) % 1 + 1) % 1; const Z = 1.1 + (zMax - 1.1) * Math.pow(s, 1.6);
      const [x, y] = P.q(q.c.X + q.dx * q.c.w * 0.7, 0, Z); if (y < y0) continue;
      const b = Math.sin(t * 2 + q.ph); if (b < -0.2) continue;
      ctx.fillStyle = b > 0.6 && Z < 4 ? PHOS_K : PHOS; ctx.fillRect(Math.round(x), Math.round(y), Z < 3 ? 2 : 1, 1);
    }
  } });
}
// Zulauf oben rechts: Meerwasser stürzt durch einen Spalt herab, voller Meeresleuchten (das Gegenlicht)
function zulauf(K, x, y0, y1, w, eb) {
  const e = K.e[eb === undefined ? 0 : eb];
  B.feld(e, x - w, y0, x + w, y1, HIMMEL.slice(3), (px, py) => { const q = Math.abs(px - x) / w; if (q > 1) return -1; return 0.95 - q * 0.6 + (B.fbm(px * 0.2, py * 0.03, 5, 2) - 0.5) * 0.5 - K.fr * 0.1; });
  for (const L of [K.e[0], K.e[1], K.e[2]]) B.kegel(L, x, y0 - 10, Math.PI * 0.72, 0.16, 360, '#1a3a2a', 0.45);
  K.licht(x, y0 + 40, '#9ad8b4', 220, 0.8);
  B.partikel(K, { n: 50, farben: [HIMMEL[9], PHOS, HIMMEL[7]], vy: 70, x0: x - w, x1: x + w, y0, y1, laenge: 3, p: 0.08, hellSelten: 2.5 });
}
// Eiserne Bühne des Ingenieurs (1880): Gitterboden, Geländer, eine Lampe mit warmem Licht (das einzige menschliche Licht)
function buehne(K, eb, x, y, s, lampe) {
  const m = B.maske(); m.rect(x - 18 * s, y, 36 * s, 2.2 * s); for (let i = 0; i < 5; i++) m.rect(x - 18 * s + i * 9 * s, y - 12 * s, 1.2 * s, 12 * s); m.rect(x - 18 * s, y - 12 * s, 37 * s, 1.2 * s);
  m.kap(x - 14 * s, y + 2 * s, x - 4 * s, y + 14 * s, 0.9 * s, 0.9 * s); m.kap(x + 14 * s, y + 2 * s, x + 4 * s, y + 14 * s, 0.9 * s, 0.9 * s);
  // Leiter hinab
  m.kap(x + 20 * s, y, x + 22 * s, y + 40 * s, 0.7 * s, 0.7 * s); m.kap(x + 25 * s, y, x + 27 * s, y + 40 * s, 0.7 * s, 0.7 * s); for (let i = 1; i < 8; i++) m.rect(x + 20.5 * s + i * 0.25 * s, y + i * 5 * s, 5 * s, 0.8 * s);
  K.form(eb, m, 0.08, { k: ['#050606', '#0b0d0d', '#141818', '#202626'], r: ['#5a6a5a', '#b8c8b0'], ton: 1.3, fase: 0, rand: 1 });
  if (lampe && K.fr < 0.8) { B.flamme(K, Math.round(x - 10 * s), Math.round(y - 13 * s), { p: 0.3, kern: '#fff4d0', mitte: LAMPE, aussen: '#a05a10', glut: LAMPG }); for (const i of [eb, eb + 1].filter(i => i < 5)) B.gluehen(K.e[i], x - 10 * s, y - 13 * s, 34 * s, LAMPG, 0.8); }
}
// Großer Hebel mit Griff für sieben Finger
function hebel(K, eb, x, y, h, s, ab, neig) {
  const ng = neig === undefined ? 0.22 : neig;
  const m = B.maske(); m.kap(x, y, x + h * ng, y - h, 4.5 * s, 3 * s); m.ell(x, y, 8 * s, 6 * s); m.rect(x - 14 * s, y, 28 * s, 6 * s);
  const gx = x + h * ng, gy = y - h; m.kap(gx - 9 * s, gy - 4 * s, gx + 9 * s, gy + 2 * s, 4 * s, 4 * s);
  K.form(eb, m, 0, { k: BRONZE.slice(1), r: pal.rand, ton: 2, fase: 2, rand: 2, schatten: 2, muster: (px, py) => (Math.abs(py - gy + (px - gx) * 0.33) < 1 ? -1 : 0) });
  const e = K.e[eb], bl = B.pk(MESS[0]);
  for (let i = 0; i < 7; i++) { const u = -7 * s + i * 2.3 * s; e.set(gx + u, gy - 1 * s + u * 0.33 - 3.4 * s, bl); e.set(gx + u, gy + u * 0.33 + 3.6 * s, B.pk(BRONZE[0])); }
  if (ab) abdruck(K, eb, x + h * ng * 0.4, y - h * 0.42, s * 1.15, -0.1, true);
}

// =====================================================================
// Variante 0: Das Hauptrad. Wir stehen am Kanal vor dem Rad; nur sein oberer Bogen ragt aus der Grube,
// jeder Zahn so groß wie ein Haus. Der Zeiger oben steht vor der nächsten Lücke. Links die Bühne des Ingenieurs.
function hauptrad(K, cfg) {
  const fr = K.fr, sd = K.o.seed, nah = !!cfg.nah;
  const vx = nah ? 250 : 290, vy = nah ? 150 : 140, P = B.persp(vx, vy); K.split = nah ? [170, 182] : [160, 172];
  // Ebene 0: Gewölbe, dunkel, oben rechts hell vom Zulauf
  B.feld(K.e[0], -M, -M, W + M, H + M, HIMMEL, (x, y) => 0.12 + 0.42 * Math.pow((x + M) / (W + 2 * M), 2) * (1 - y / 200) + (B.fbm(x * 0.015, y * 0.02, sd, 3) - 0.5) * 0.18 - fr * 0.06);
  zulauf(K, nah ? 440 : 452, -M, vy - 4, nah ? 22 : 16);
  // Ebene 1: ferne Räder im Dunst (Maßstab)
  if (!nah) { zahnrad(K, 1, 70, 40, 70, { n: 22, th: 7, sp: 5, tiefe: 0.7, rot: 0.2 }); zahnrad(K, 1, 150, 96, 38, { n: 14, th: 5, sp: 5, tiefe: 0.75 }); }
  // Ebene 2: das Hauptrad, Mitte unter dem Boden
  const R = nah ? 300 : 250, cx = nah ? 230 : 250, cy = nah ? 330 : 300;
  const rad = zahnrad(K, 2, cx, cy, R, { n: 48, th: 26, sp: 7, kranz: 34, nabe: 46, tiefe: 0.18, rot: 0.03, speiche: 10, dicke: [9, -7], voll: true });
  // Abdrücke im Grünspan des Kranzes: Hände mit sieben Fingern, so groß wie Menschen? Nein: so groß wie Hände.
  for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 - 0.5 + i * 0.33 + B.hash(i, 3, sd) * 0.05, rr = R - 15; abdruck(K, 2, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr + 2, 1.7, a + Math.PI / 2, i % 2 === 1); }
  // Zeiger oben: ein Arm aus Bronze, der auf die nächste Lücke zeigt; an der Spitze ein Phosphorpunkt
  const zx = cx + 40, zy = cy - R - 34, zm = B.maske(); zm.kap(zx + 110, -M, zx + 60, zy - 30, 6, 5); zm.kap(zx + 60, zy - 30, zx + 4, zy + 8, 5, 2); zm.ell(zx + 60, zy - 30, 8, 8);
  K.form(2, zm, 0.12, { k: BRONZE.slice(1), r: pal.rand, ton: 2, fase: 1.5, rand: 2, schatten: 2 });
  K.e[2].set(zx + 4, zy + 8, B.pk(PHOS_K)); B.gluehen(K.e[2], zx + 4, zy + 8, 10, PHOS_G, 0.9); B.gluehen(K.e[1], zx + 4, zy + 8, 26, PHOS_G, 0.6);
  // Bühne des Ingenieurs, an einen Zahn links geschraubt (Maßstab: Geländer, Leiter, eine Lampe)
  const [bx, by] = [cx - R * 0.62, cy - R * 0.8 + 8]; if (!nah) buehne(K, 2, Math.round(bx), Math.round(by), 1, true);
  // Grube vor dem Rad: Kante, dahinter Dunkel; dann der Boden mit Kanälen zum Rad
  const yG = P.q(0, 0, nah ? 9 : 14)[1];
  B.feld(K.e[2], -M, yG - 10, W + M, yG + 1, NASS, (x, y) => 0.15 + (y - yG + 10) / 40);
  const kante = B.maske(); kante.rect(-M, yG - 1, W + 2 * M, 3); K.form(2, kante, 0.08, { k: BRONZE.slice(1, 6), r: pal.rand, ton: 2, fase: 0, rand: 2 });
  const kan = [{ X: -1.4, w: 0.32 }, { X: 2.3, w: 0.24 }, { X: -4.5, w: 0.2 }];
  bodenWerk(K, P, yG + 2, kan, { glanzX: 360 });
  kanalLeuchten(K, P, kan, yG + 2, 46 + Math.round(fr * 30));
  // Säulen der Halle rechts (Maßstab), Rohr links
  for (const [X, Z] of [[6.2, 6], [6.2, 11]]) { const [x, yb] = P.q(X, 0, Z), [, yt] = P.q(X, 6, Z), k = P.k(Z); const m = B.maske(); m.rect(x - k * 0.25, Math.max(-M, yt), k * 0.5, yb - yt); m.rect(x - k * 0.34, yb - k * 0.18, k * 0.68, k * 0.18); K.form(Z > 8 ? 2 : 3, m, Z > 8 ? 0.2 : 0.05, { k: BRONZE.slice(0, 6), r: pal.rand, ton: 1.6, fase: 2, schatten: 2, muster: px => (Math.round(px - x) % 5 === 0 ? -0.5 : 0) }); }
  // Vordergrund: links ein Hebel mit Griff für sieben Finger, rechts die Kante eines Zahns
  hebel(K, 5, nah ? 10 : 14, H + 4, 140, 1.6, true, 0.08);
  const v = B.maske(); v.poly([[440, H + M], [462, 150], [W + M, 140], [W + M, H + M]]); K.form(5, v, 0, { k: BRONZE.slice(0, 5), r: pal.rand, ton: 1.4, fase: 3 });
  B.nebel(K.e[2], { y0: yG - 30, y1: yG + 8, col: B.mix(pal.nebel[1], K.fern, 0.35), dichte: 0.32, xs: [-20, 500, 60], seed: 3 });
  B.partikel(K, { n: 26, farben: [PHOS_G, HIMMEL[6]], vx: -2, vy: -4, wob: 3, wf: 0.4, x0: 0, x1: 480, y0: 40, y1: 200, p: 0.8, blink: 0.7 });
  K.reihen = nah ? [{ y: 186, skala: 0.9, nebel: 0.25 }, { y: 200, skala: 1, nebel: 0.1 }, { y: 214, skala: 1, nebel: 0 }] : [{ y: 176, skala: 0.9, nebel: 0.3 }, { y: 195, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 206], P };
}

// Variante 1: Die Schleusen. Frontal: eine Wand mit drei Schleusentoren, jedes mit einem Handrad (sieben
// Speichen). Die Kanäle laufen auf die Tore zu und an ihnen hinauf. Über der Wand fern der Bogen des Hauptrads.
function schleusen(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(240, 136); K.split = [160, 172];
  B.feld(K.e[0], -M, -M, W + M, H + M, HIMMEL, (x, y) => 0.1 + 0.35 * Math.pow((x + M) / (W + 2 * M), 1.6) * (1 - y / 160) + (B.fbm(x * 0.02, y * 0.02, sd + 1, 3) - 0.5) * 0.15);
  zulauf(K, 430, -M, 60, 14);
  // fern: der Bogen des Hauptrads über der Wand
  zahnrad(K, 1, 210, 300, 290, { n: 56, th: 22, sp: 7, kranz: 30, nabe: 40, tiefe: 0.62, rot: 0.1, speiche: 9 });
  // Wand mit Toren (Ebene 2), Gesims und senkrechte Zahnstangen
  const yW = 136, wand = B.maske(); wand.rect(-M, 34, W + 2 * M, yW - 34 + 2);
  const tore = [[100, 30], [240, 38], [380, 30]];
  for (const [tx, tw] of tore) wand.fn(tx - tw, 60, tx + tw, yW + 2, (x, y) => y > 60 + tw - Math.sqrt(Math.max(0, tw * tw - (x - tx) ** 2)) * 0.9, 0);
  K.form(2, wand, 0.12, { k: BRONZE.slice(0, 6), r: pal.rand, ton: 1.5, fase: 1, rand: 2, muster: (x, y) => ((y % 13) === 0 ? -0.6 : 0) + (((x + (Math.floor(y / 13) & 1) * 20) % 40) === 0 ? -0.6 : 0) + (B.fbm(x * 0.04, y * 0.04, sd + 5, 2) - 0.5) * 0.6 });
  const ges = B.maske(); ges.rect(-M, 30, W + 2 * M, 6); ges.rect(-M, 54, W + 2 * M, 3); K.form(2, ges, 0.1, { k: BRONZE.slice(1, 7), r: pal.rand, ton: 2.2, fase: 1, rand: 2 });
  for (const x of [30, 170, 310, 450]) { const z = B.maske(); z.rect(x - 4, 36, 8, yW - 36); for (let y = 40; y < yW; y += 7) z.rect(x - 7, y, 14, 3); K.form(2, z, 0.08, { k: BRONZE.slice(1, 7), r: pal.rand, ton: 2, fase: 0, rand: 2, schatten: 2 }); }
  // Tore: Bronzeplatten, Wasser steigt an ihnen hinauf (Leuchtstreifen), Handräder mit sieben Speichen
  for (const [tx, tw] of tore) {
    const tor = B.maske(); tor.fn(tx - tw + 3, 62, tx + tw - 3, yW, (x, y) => y > 62 + tw - Math.sqrt(Math.max(0, (tw - 3) ** 2 - (x - tx) ** 2)) * 0.9);
    K.form(2, tor, 0.1, { k: BRONZE.slice(0, 5), r: pal.rand, ton: 1.2, fase: 1, rand: 1, muster: (x) => ((Math.round(x - tx) % 8) === 0 ? -0.8 : 0) });
    B.dith(K.e[2], tx - tw + 4, 90, tx + tw - 4, yW, WASSER[5], (x, y) => tor.has(x, y) ? 0.25 + 0.25 * Math.sin(x * 0.7 + y * 0.15) - (yW - y) / 140 : 0);
    zahnrad(K, 2, tx, 98, tw * 0.55, { n: 7, th: 3, sp: 7, kranz: 3, nabe: 3.5, tiefe: 0.05, speiche: 1.1, dicke: [1, -1] });
    K.e[2].set(tx, 98, B.pk(PHOS)); B.gluehen(K.e[2], tx, 98, 8, PHOS_G, 0.7);
    abdruck(K, 2, tx - tw * 0.62, 124, 1.3, 0.2, fr > 0.3 || tx === 240);
  }
  // Boden: Kanäle laufen auf die Tore zu
  const kan = [{ X: -2.2, w: 0.3 }, { X: 0, w: 0.4 }, { X: 2.2, w: 0.3 }];
  bodenWerk(K, P, yW + 1, kan, { glanzX: 340 });
  kanalLeuchten(K, P, kan, yW + 1, 60 + Math.round(fr * 30));
  // Poller und eine Kurbel vorne, Rohrbogen im Vordergrund oben links
  for (const [X, Z] of [[-3.2, 5], [3.4, 5], [-3.2, 9]]) { const [x, y] = P.q(X, 0, Z), k = P.k(Z); const m = B.maske(); m.rect(x - k * 0.12, y - k * 0.45, k * 0.24, k * 0.45); m.ell(x, y - k * 0.45, k * 0.16, k * 0.06); K.form(K.eb(y), m, 0, { k: BRONZE.slice(0, 6), r: pal.rand, ton: 1.8, fase: 1, schatten: 2 }); }
  const v = B.maske(); v.kap(-M, 14, 70, 4, 9, 9); v.kap(70, 4, 96, -M, 9, 9); v.rect(-M, 220, 60, 60); v.poly([[-M, 206], [40, 214], [60, 230], [-M, 240]]);
  K.form(5, v, 0, { k: BRONZE.slice(0, 5), r: pal.rand, ton: 1.4, fase: 3, muster: (x, y) => ((x + y) % 11 === 0 ? -0.6 : 0) });
  B.nebel(K.e[2], { y0: yW - 26, y1: yW + 10, col: B.mix(pal.nebel[1], K.fern, 0.35), dichte: 0.3, xs: [-20, 500, 60], seed: 6 });
  B.partikel(K, { n: 24, farben: [PHOS_G, HIMMEL[6]], vx: 0, vy: -3, wob: 2, wf: 0.3, x0: 0, x1: 480, y0: 40, y1: 200, p: 0.8, blink: 0.7 });
  K.reihen = [{ y: 172, skala: 0.9, nebel: 0.3 }, { y: 193, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [318, 206], P };
}

// Variante 2: Im Eingriff. Zwei Räder links und rechts, ihre Zähne greifen über uns ineinander. Wir stehen
// auf einem schmalen Steg, darunter der Kanal. Durch die Lücke fern das Hauptrad.
function eingriff(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(250, 150); K.split = [168, 178];
  B.feld(K.e[0], -M, -M, W + M, H + M, HIMMEL, (x, y) => 0.14 + 0.4 * Math.pow((x + M) / (W + 2 * M), 2) * (1 - y / 190) + (B.fbm(x * 0.02, y * 0.03, sd + 2, 3) - 0.5) * 0.2);
  // der Zulauf stürzt genau durch den Eingriff herab
  zulauf(K, 214, 30, 168, 9);
  // zwei Räder greifen oben bei (204, 26) ineinander; das rechte steht weiter hinten
  zahnrad(K, 2, 370, 20, 150, { n: 32, th: 16, sp: 7, kranz: 20, nabe: 26, tiefe: 0.22, rot: 0.05, speiche: 7, dicke: [6, -4] });
  zahnrad(K, 3, 60, 10, 130, { n: 26, th: 16, sp: 7, kranz: 18, nabe: 24, tiefe: 0.03, rot: 0.02, speiche: 6, dicke: [6, -4] });
  for (let i = 0; i < 3; i++) { const a = 0.1 + i * 0.38, rr = 121; abdruck(K, 3, 60 + Math.cos(a) * rr, 10 + Math.sin(a) * rr, 1.5, a + Math.PI / 2, i !== 1); }
  for (let i = 0; i < 2; i++) { const a = Math.PI - 0.1 + i * 0.45, rr = 140; abdruck(K, 2, 370 + Math.cos(a) * rr, 20 + Math.sin(a) * rr, 1.4, a + Math.PI / 2, i === 0); }
  // Steg: schmal, Gitter, Geländer; darunter Kanal
  const yS = P.q(0, 0, 10)[1];
  B.feld(K.e[2], -M, yS - 4, W + M, yS + 6, WASSER, (x, y) => 0.4 + (B.fbm(x * 0.05, y * 0.3, sd, 2) - 0.5) * 0.4);
  bodenWerk(K, P, yS + 2, [{ X: -6, w: 1.6 }, { X: 6.4, w: 1.6 }], { glanzX: 300, gr: 0.8 });
  kanalLeuchten(K, P, [{ X: -6, w: 1.6 }, { X: 6.4, w: 1.6 }], yS + 2, 40);
  const gl = B.maske();
  for (const sx of [-1, 1]) { const pts = [P.q(sx * 4.2, 0.55, 1.2), P.q(sx * 4.2, 0.55, 10)]; gl.pfad(pts, 1.6, 0.6); for (let Z = 1.4; Z < 10; Z *= 1.35) { const [x, y] = P.q(sx * 4.2, 0, Z), [, yt] = P.q(sx * 4.2, 0.55, Z); gl.kap(x, y, x, yt, Math.max(0.6, P.k(Z) * 0.02), Math.max(0.6, P.k(Z) * 0.02)); } }
  K.form(4, gl, 0, { k: ['#050606', '#0b0d0d', '#141818', '#202626'], r: pal.rand, ton: 1.4, fase: 0, rand: 1 });
  B.nebel(K.e[2], { y0: yS - 34, y1: yS + 6, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.3, xs: [120, 420, 60], seed: 8 });
  B.partikel(K, { n: 30, farben: [PHOS_G, HIMMEL[6]], vx: 1, vy: -3, wob: 2, wf: 0.3, x0: 0, x1: 480, y0: 30, y1: 210, p: 0.8, blink: 0.7 });
  K.reihen = [{ y: 180, skala: 0.9, nebel: 0.3 }, { y: 197, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], P };
}

// Wächter: Die Hemmung. Untersicht in die Kammer des Regulators: hinten das Hemmungsrad mit Sägezähnen,
// darüber das Hauptrad, am Boden der Gradbogen, über den die Spitze streicht. Übergang: der Kanal läuft leer
// und die Schleuse am Grund öffnet sich nach unten.
function hemmung(K, cfg) {
  const fr = K.fr, sd = K.o.seed, vy = cfg.ebbe ? 150 : 162, P = B.persp(240, vy); K.split = [vy + 18, vy + 30];
  B.feld(K.e[0], -M, -M, W + M, H + M, HIMMEL, (x, y) => 0.12 + 0.4 * Math.pow((x + M) / (W + 2 * M), 1.8) * (1 - y / 220) + (B.fbm(x * 0.015, y * 0.02, sd + 4, 3) - 0.5) * 0.18);
  zulauf(K, 456, -M, vy - 10, 14);
  // das Hauptrad, riesig, oben links; abgedunkelt, damit es hinter dem Pendel nicht mitspricht
  zahnrad(K, 1, 96, -70, 220, { n: 52, th: 22, sp: 7, kranz: 30, nabe: 44, tiefe: cfg.ebbe ? 0.55 : 0.3, ton: cfg.ebbe ? 2.2 : 1.1, rot: 0.2, speiche: 9 });
  // Hemmungsrad mit Sägezähnen, hoch über der Kammer: nur seine unteren Zähne ragen herein, der Anker greift hinein
  const hx = 240, hy = cfg.ebbe ? 40 : -22, hr = cfg.ebbe ? 92 : 70, hz = B.maske();
  hz.fn(hx - hr - 20, hy - hr - 20, hx + hr + 20, hy + hr + 20, (x, y) => { const u = x - hx, v = y - hy, rr = Math.hypot(u, v), a = Math.atan2(v, u); const f = ((a / TAU * 21) % 1 + 1) % 1; const R = hr + 16 * f; if (rr > R) return false; if (rr > hr - 14 || rr < 16) return true; const s = ((a / TAU * 5) % 1 + 1) % 1; return Math.min(s, 1 - s) * TAU / 5 * rr < 5; });
  K.form(2, hz, 0.14, { k: BRONZE.slice(1), r: pal.rand, ton: 2.2, fase: 2, rand: 2, schatten: 2, verlauf: 0.5 });
  if (cfg.ebbe) { K.e[2].set(hx, hy, B.pk(PHOS_K)); B.gluehen(K.e[2], hx, hy, 14, PHOS_G, 0.8); }
  // Rückwand mit Nischen: in jeder ein Abdruck; Pfeiler links und rechts
  const wand = B.maske(); wand.fn(-M, 120, W + M, vy + 2, (x, y) => y > 120 + Math.abs(x - 240) * 0.05); K.form(2, wand, 0.1, { k: BRONZE.slice(0, 6), r: pal.rand, ton: 1.5, fase: 1, rand: 1, muster: (x, y) => ((x % 30) === 0 ? -0.7 : 0) + ((y % 10) === 0 ? -0.4 : 0) });
  for (let i = 0; i < 6; i++) { if (!cfg.ebbe && (i === 2 || i === 3)) continue; abdruck(K, 2, 40 + i * 80, vy - 16, 1.6, (i - 2.5) * 0.08, i === 1 || i === 4 || fr > 0.5); }
  for (const x of [26, 454]) { const m = B.maske(); m.rect(x - 16, -M, 32, vy + 30); m.rect(x - 22, vy + 18, 44, 14); K.form(3, m, 0, { k: BRONZE.slice(0, 6), r: pal.rand, ton: 1.6, fase: 3, schatten: 2, muster: (px, py) => (((py >> 3) & 1) && Math.abs(px - x) < 12 ? -0.3 : 0) }); }
  // Wasserwand hinter dem Pendel: Meerwasser fällt als glatte, leuchtende Fläche senkrecht herab (ruhige helle
  // Zone, vor der der Regulator als Silhouette steht); die Kanten fransen gedithert aus
  if (!cfg.ebbe) {
    const ww = 104, w0 = 26; // breit genug für beide Stellungen des Pendels (x 0,3 hinten und 0,7 vorn)
    B.feld(K.e[2], 240 - ww - 8, w0, 240 + ww + 8, vy + 3, HIMMEL, (x, y) => { const q = Math.abs(x - 240) / ww; if (q > 1.12) return -1;
      const rand = q > 0.86 ? (q - 0.86) / 0.26 : 0; if (rand > B.bay(x, y) + 0.05) return -1;
      return 0.74 + 0.2 * (1 - q) - (y - w0) / (vy - w0) * 0.14 + (B.rausch2(x * 0.35, y * 0.012, sd + 21) - 0.5) * 0.22 - fr * 0.1; });
    const kant = B.maske(); kant.rect(240 - ww - 10, w0 - 4, 2 * ww + 20, 5); K.form(2, kant, 0.1, { k: BRONZE.slice(1, 7), r: pal.rand, ton: 2, fase: 1, rand: 2, schatten: 2 });
    for (const L of [K.e[2], K.e[3]]) B.gluehen(L, 240, vy - 20, 110, PHOS_G, 0.55);
    K.licht(240, 110, '#9ad8b4', 140, 0.7);
    B.partikel(K, { n: 40, farben: [HIMMEL[9], PHOS], vy: 60, x0: 240 - ww + 4, x1: 240 + ww - 4, y0: w0, y1: vy, laenge: 3, p: 0.15, hellSelten: 2 });
  }
  // Boden: Platten; der Gradbogen ist eine Rinne mit Teilstrichen, die beiden Enden leuchten (zwei Reihen)
  const kan = cfg.ebbe ? [{ X: 0, w: 1.2 }] : [];
  bodenWerk(K, P, vy + 1, kan, { glanzX: 360 });
  const yb = cfg.ebbe ? 0 : 214, e4 = K.e[4];
  if (!cfg.ebbe) {
    for (let t = -1; t <= 1; t += 0.002) { const x = 240 + t * 150, y = yb - (1 - t * t) * 34; for (let k = -2; k <= 2; k++) e4.set(x, y + k, B.pk(k === -2 ? BRONZE[6] : k === 2 ? BRONZE[0] : NASS[1])); }
    for (let i = -10; i <= 10; i++) { const t = i / 10, x = 240 + t * 150, y = yb - (1 - t * t) * 34; B.linie(e4, x, y + 3, x, y + (i % 5 === 0 ? 9 : 6), B.pk(i % 5 === 0 ? BRONZE[7] : BRONZE[4])); }
    for (const t of [-0.8, 0.8]) { const x = 240 + t * 150, y = yb - (1 - t * t) * 34; e4.set(x, y, B.pk(PHOS_K)); B.gluehen(e4, x, y, 16, PHOS_G, 0.9); }
  } else {
    // Ebbe: der Kanal ist leer, am Grund ein runder Schacht, Stufen führen hinein, Wasser zieht nach unten
    const [sx, sy] = P.q(0, 0, 3.2), k = P.k(3.2);
    for (let i = 0; i < 9; i++) { const rw = k * (1.6 - i * 0.14), ry = rw * 0.28; const m = B.maske(); m.ell(sx, sy + i * 3, rw, ry); m.ell(sx, sy + i * 3 + 2, rw - 3, ry - 1, 0); K.form(4, m, 0, { k: BRONZE.slice(0, 5 - Math.min(3, i >> 1)), r: i < 3 ? pal.rand : [], ton: 1.6 - i * 0.12, fase: 0, rand: 1 }); }
    const sch = B.maske(); sch.ell(sx, sy + 30, k * 0.38, k * 0.1); B.form(e4, sch, { k: [B.pk('#000000'), B.pk('#010202')], ton: 0.4, fase: 0, rand: 0 });
    K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { ctx.fillStyle = PHOS; for (let i = 0; i < 14; i++) { const a = t * 0.8 + i * 0.45, q = ((t * 0.12 + i / 14) % 1); const r = k * 1.4 * (1 - q); ctx.fillRect(Math.round(sx + Math.cos(a) * r + ox), Math.round(sy + 6 + q * 24 + Math.sin(a) * r * 0.28 + oy), 1, 1); } } });
  }
  B.nebel(K.e[2], { y0: vy - 30, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, 0.35), dichte: 0.3, xs: [40, 440, 60], seed: 11 });
  const v = B.maske(); v.rect(-M, -M, W + 2 * M, 16); for (let i = 0; i < 40; i++) v.poly([[i * 13 - 12, 15], [i * 13 - 4, 15], [i * 13 - 6, 21], [i * 13 - 10, 21]]); K.form(5, v, 0, { k: BRONZE.slice(0, 5), r: pal.rand, ton: 1.2, fase: 2 });
  B.partikel(K, { n: 30, farben: [PHOS_G, HIMMEL[6]], vy: -4, wob: 2, wf: 0.3, x0: 0, x1: 480, y0: 40, y1: 210, p: 0.8, blink: 0.7 });
  K.reihen = cfg.ebbe ? [{ y: 172, skala: 0.9, nebel: 0.3 }, { y: 190, skala: 1, nebel: 0.12 }, { y: 206, skala: 1, nebel: 0 }] : [{ y: 184, skala: 0.9, nebel: 0.3 }, { y: 200, skala: 1, nebel: 0.12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}

// Krämer: die Bühne des Ingenieurs nah, mit Zelt, Theodolit und Kisten; das einzige warme Licht im Werk
function ingenieurStand(K, x, y) {
  const m = B.maske(); m.poly([[x - 50, y], [x - 20, y - 46], [x + 10, y], [x + 4, y], [x - 20, y - 36], [x - 44, y]]); m.rect(x - 52, y - 2, 64, 3);
  K.form(4, m, 0, { k: ['#0a0a07', '#14130c', '#201e14', '#2e2b1e'], r: ['#6a6448', '#c8bc90'], ton: 1.6, fase: 1, schatten: 2, muster: (px) => ((Math.round(px) % 6) === 0 ? -0.4 : 0) });
  const th = B.maske(); th.kap(x + 30, y, x + 36, y - 30, 0.9, 0.9); th.kap(x + 42, y, x + 36, y - 30, 0.9, 0.9); th.kap(x + 36, y, x + 36, y - 30, 0.8, 0.8); th.rect(x + 31, y - 38, 12, 6); th.kap(x + 30, y - 36, x + 24, y - 38, 1.6, 1.4);
  K.form(4, th, 0, { k: BLANK, r: MESS, ton: 1.4, fase: 0, rand: 1 });
  const ki = B.maske(); ki.rect(x + 50, y - 12, 18, 12); ki.rect(x + 54, y - 22, 14, 10); K.form(4, ki, 0, { k: ['#0a0907', '#15120c', '#221c12', '#30281a'], r: ['#6a5a3a', '#c8a870'], ton: 1.6, fase: 1, schatten: 2 });
  B.flamme(K, x - 20, y - 50, { p: 0.5, kern: '#fff4d0', mitte: LAMPE, aussen: '#a05a10', glut: LAMPG, gross: 1.3 });
  for (const i of [3, 4]) B.gluehen(K.e[i], x - 20, y - 48, 60, LAMPG, 0.9);
}
// Fund und Ereignis: eine Kiste des Ingenieurs, offen, darin ein Logbuch und ein Handschuh mit sieben Fingern
function kiste(K, x, y) {
  const m = B.maske(); m.rect(x - 16, y - 12, 32, 12); m.poly([[x - 16, y - 12], [x - 13, y - 26], [x + 19, y - 25], [x + 16, y - 12]]);
  K.form(4, m, 0, { k: ['#0a0907', '#15120c', '#221c12', '#30281a'], r: ['#6a5a3a', '#c8a870'], ton: 1.8, fase: 1, schatten: 2, muster: (px, py) => (py === y - 6 ? -0.8 : 0) });
  const hs = B.maske(); hs.ell(x - 4, y - 14, 5, 2.2); for (let i = 0; i < 7; i++) hs.kap(x - 9 + i * 1.6, y - 15, x - 10 + i * 1.8, y - 20 - (i % 3), 0.6, 0.5);
  K.form(4, hs, 0, { k: BRONZE.slice(1, 6), r: pal.rand, ton: 2, fase: 0, rand: 1 });
  const sh = B.maske(); sh.ell(x, y + 1, 22, 2.5); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  B.gluehen(K.e[4], x - 4, y - 18, 22, PHOS_G, 0.9);
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.4) > 0.5) { ctx.fillStyle = PHOS; ctx.fillRect(x - 9 + ox, y - 21 + oy, 1, 1); ctx.fillRect(x - 3 + ox, y - 21 + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 2 : art === 'kraemer' ? 0 : art === 'ereignis' || art === 'fund' ? 1 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = hemmung(K, {});
  else if (art === 'uebergang') info = hemmung(K, { ebbe: true });
  else if (art === 'kraemer') info = hauptrad(K, { nah: true });
  else info = [k => hauptrad(k, {}), schleusen, eingriff][v](K);
  if (art === 'fund' || art === 'ereignis') kiste(K, info.mitte[0], info.mitte[1]);
  else if (art === 'kraemer') ingenieurStand(K, info.mitte[0] + 20, info.mitte[1] - 2);
  else if (art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.gezeitenwerk = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 3, knick: 0.7, stein: ['#1a3225', '#2c4e3a', '#3a6249', '#7aaa88'] } };
if (World.BIOME.indexOf('gezeitenwerk') < 0) World.BIOME.push('gezeitenwerk');
})();
