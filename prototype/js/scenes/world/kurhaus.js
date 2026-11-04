// Saltmoor 1925 · Hintergründe: Akt I, Das Kurhaus (Biom-Paket kurhaus).
// Komposition: docs/auftrag-2/biome/kurhaus.md
// Grundform: die Kuppel. Innen wölbt sie sich als Schale über das Bild (Rippen laufen zu einem Scheitel
// außerhalb des Bildes oben rechts), außen sitzt sie auf der Klippe. Licht: kaltes Tageslicht durch
// Milchglas von oben rechts. Das Glas ist von innen beschlagen, obwohl hier niemand mehr atmet.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#040707', '#091112', '#121c1e', '#1d2c2e'], rand: ['#4f8480', '#bcdcd4'], augen: '#e6fff6', nebel: ['#14262a', '#3a5a5a'], fern: '#5e7c7a' };
const GLAS = ['#152224', '#1f3133', '#2b4244', '#3a5655', '#4c6b69', '#62807d', '#7b9893', '#97b0aa', '#b4c8c1', '#d2e0da'];
const WAND = ['#050909', '#091012', '#0e1819', '#142224', '#1b2d2e', '#243a3a', '#2f4848', '#3c5856'];
const WASSER = ['#020606', '#050d0e', '#081516', '#0d1f20', '#132b2c', '#1b3a3a', '#264c4b', '#36605e'];
const KACHEL = ['#050909', '#0a1213', '#101b1c', '#172627', '#203334', '#2a4040'];
const EISEN = ['#030505', '#070c0d', '#0d1516', '#152122'];
const HOLZ = ['#060908', '#0c1211', '#141c1b', '#1e2928', '#2a3736'];
const SAND = ['#070908', '#0c100f', '#121817', '#1a2221', '#242e2c', '#2f3b38'];
const MESS = ['#b08a46', '#e8cc8a'];
const LICHT = '#d8ece6', GLUT_K = '#1c3434';

// Kuppel von innen: der Kämpferkranz erscheint als U (hinten tief, an den Seiten hoch), Rippen laufen
// zum Scheitel A. o: cx, rx (Halbbreite des U), yb (tiefster Punkt), ry (Anstieg), ax, ay (Scheitel), n (Rippen), ringe
function kuppelInnen(K, o) {
  const e0 = K.e[0], rip = B.maske(), sd = K.o.seed, fr = K.fr;
  const rim = phi => [o.cx + o.rx * Math.sin(phi), o.yb - o.ry * (1 - Math.cos(phi))];
  const pt = (phi, s) => { const [x0, y0] = rim(phi), q = Math.pow(s, 0.8), bu = Math.sin(s * Math.PI) * o.bauch; return [x0 + (o.ax - x0) * q + Math.sin(phi) * bu, y0 + (o.ay - y0) * q - bu * 0.6]; };
  const P = GLAS.map(B.pk), n = P.length - 1, dichte = new Float32Array((W + 2 * M) * (H + 2 * M)).fill(-1);
  const ribs = []; for (let i = 0; i <= o.n; i++) ribs.push(-Math.PI / 2 * 1.08 + i * Math.PI * 1.08 / o.n);
  for (let a = -Math.PI / 2 * 1.1; a <= Math.PI / 2 * 1.1; a += 0.0016) for (let s = 0; s <= 1; s += 0.0022) {
    const [x, y] = pt(a, s); const xi = Math.floor(x), yi = Math.floor(y); if (xi < -M || yi < -M || xi >= W + M || yi >= H + M) continue;
    // Helligkeit: rechts oben am hellsten (Licht), oben heller, Beschlag als ruhiges Rauschen
    const t = 0.12 + 0.5 * ((x + M) / (W + 2 * M)) ** 1.4 + 0.3 * s + (B.fbm(x * 0.025, y * 0.04, sd + 3, 3) - 0.5) * 0.45 - fr * 0.12;
    dichte[(yi + M) * (W + 2 * M) + xi + M] = t;
    const ri = ribs.some(r0 => Math.abs(a - r0) < 0.006 + 0.004 * (1 - s));
    const ri2 = o.ringe.some(r0 => Math.abs(s - r0) < 0.0045);
    if (ri || ri2) rip.put(xi, yi, 1), rip._grow(xi, yi, xi, yi);
  }
  // Lücken der Vorwärtsabbildung schließen (Nachbarn mitteln)
  const DW = W + 2 * M;
  for (let pass = 0; pass < 2; pass++) for (let y = 1 - M; y < H + M - 1; y++) for (let x = 1 - M; x < W + M - 1; x++) {
    const i = (y + M) * DW + x + M; if (dichte[i] > -0.5) continue; let su = 0, nn = 0;
    for (const j of [i - 1, i + 1, i - DW, i + DW]) if (dichte[j] > -0.5) { su += dichte[j]; nn++; }
    if (nn >= 2) dichte[i] = su / nn;
  }
  for (let y = -M; y < H + M; y++) for (let x = -M; x < W + M; x++) {
    let t = dichte[(y + M) * (W + 2 * M) + x + M]; if (t < -0.5) continue; t = B.clamp(t, 0, 0.9999) * n; const k = Math.floor(t);
    e0.set(x, y, P[Math.min(n, (t - k) > B.bay(x, y) ? k + 1 : k)]);
  }
  // Beschlag: Tropfspuren laufen das Glas hinab (klar, also dunkler), am Ende ein heller Tropfen
  const r = B.rng(sd * 31 + 7), dunkel = B.pk(GLAS[2]), perle = B.pk(GLAS[8]);
  for (let i = 0; i < o.tropfen; i++) {
    const a = r.f(-1.4, 1.4), s0 = r.f(0.25, 0.9); let [x, y] = pt(a, s0); x = Math.round(x); const L = r.i(6, 26);
    for (let k = 0; k < L; k++) { if (e0.get(x, y + k) >>> 24 && !rip.has(x, y + k)) e0.set(x, y + k, dunkel); }
    e0.set(x, y + L, perle);
  }
  K.form(1, rip, 0.15, { k: EISEN, r: pal.rand, ton: 1.2, fase: 0, rand: 1 });
  return { rim, pt };
}
// Fenster aus Milchglas im Rundbogen (Lichtquelle), mit Sprossen
function bogenfenster(K, eb, x, y, w, h, tiefe, hell) {
  const m = B.maske(); m.rect(x, y + w / 2, w, h - w / 2); m.ell(x + w / 2, y + w / 2, w / 2, w / 2);
  const e = K.e[eb], fr = K.fr;
  B.feld(e, x - 1, y - 1, x + w + 1, y + h + 1, GLAS, (px, py) => m.has(px, py) ? (hell || 0.7) - (py - y) / h * 0.25 - fr * 0.15 + (B.hash(px >> 1, py >> 2, 9) - 0.5) * 0.12 : -1);
  const s = B.maske(); s.rect(x + w / 2 - 0.5, y, 1, h); for (let k = 1; k < 4; k++) s.rect(x, y + w / 2 + (h - w / 2) * k / 4, w, 1);
  const rr = B.maske(); rr.ell(x + w / 2, y + w / 2, w / 2 + 2, w / 2 + 2); rr.rect(x - 2, y + w / 2, w + 4, h - w / 2 + 2); rr.ell(x + w / 2, y + w / 2, w / 2, w / 2, 0); rr.rect(x, y + w / 2, w, h - w / 2, 0);
  K.form(eb, rr, tiefe, { k: WAND.slice(2, 6), ton: 1.5, fase: 0, rand: 1 });
  K.form(eb, s, tiefe + 0.05, { k: EISEN, ton: 1, fase: 0, rand: 0 });
}
// Säule aus Gusseisen mit Kapitell und Sockel
function saeule(K, eb, x, yT, yB, w, tiefe) {
  const m = B.maske(); m.rect(x - w / 2, yT, w, yB - yT);
  m.poly([[x - w * 1.2, yT], [x + w * 1.2, yT], [x + w * 0.6, yT + w * 1.1], [x - w * 0.6, yT + w * 1.1]]);
  m.rect(x - w, yB - w * 0.9, w * 2, w * 0.9); m.rect(x - w * 0.8, yT + w * 2.2, w * 1.6, Math.max(1, w * 0.3));
  K.form(eb, m, tiefe, { k: EISEN.concat(['#1f2e30']), ton: 1.3, fase: Math.max(1, w * 0.2), schatten: 2, muster: (px) => ((Math.round(px - x) % 3 === 0) ? -0.4 : 0) });
}
// Kopf im Wasser: liegt auf dem Rücken, Gesicht nach oben, rührt sich nicht
function treibender(K, eb, x, y, s) {
  const m = B.maske(); m.ell(x, y, 3.4 * s, 2 * s); m.ell(x - 3.2 * s, y - 0.3 * s, 1.2 * s, 1.1 * s);
  K.form(eb, m, 0.1, { k: ['#0c1617', '#1b2b2c', '#3a5252', '#6a8682'], r: [GLAS[6], GLAS[8]], ton: 2.2, fase: 1, rand: 2 });
  const sch = B.maske(); sch.ell(x + 2 * s, y + 1.6 * s, 6 * s, 0.9 * s); B.form(K.e[eb], sch, { k: [B.pk(WASSER[3])], ton: 0, fase: 0, rand: 0 });
  K.e[eb].set(Math.round(x - 2 * s), Math.round(y - 0.6 * s), B.pk('#0a1212')); K.e[eb].set(Math.round(x - 0.5 * s), Math.round(y - 0.8 * s), B.pk('#0a1212'));
}
// Rollstuhl aus Korbgeflecht, leer, zum Becken gedreht
function rollstuhl(K, eb, x, y, s) {
  const m = B.maske(), R = 11 * s;
  m.ell(x, y - R, R, R); m.ell(x, y - R, R - 1.6 * s, R - 1.6 * s, 0);
  m.kap(x - R, y - R, x + R, y - R, 0.7 * s, 0.7 * s); m.kap(x, y - 2 * R, x, y, 0.7 * s, 0.7 * s);
  m.poly([[x - 4 * s, y - 2.3 * R], [x + 9 * s, y - 2.6 * R], [x + 10 * s, y - 1.2 * R], [x - 6 * s, y - 1.1 * R]]);
  m.poly([[x - 6 * s, y - 1.25 * R], [x - 20 * s, y - 1.3 * R], [x - 20 * s, y - 1.05 * R], [x - 6 * s, y - 1 * R]]);
  m.kap(x - 20 * s, y - 1.1 * R, x - 24 * s, y - 2, 0.8 * s, 0.8 * s); m.ell(x - 24 * s, y - 2 * s, 2.6 * s, 2.6 * s);
  K.form(eb, m, 0, { k: HOLZ, r: pal.rand, ton: 1.7, fase: 1, schatten: 2, muster: (px, py) => ((px + py) % 3 === 0 ? -0.5 : 0) });
}
// Kachelboden in Weltkoordinaten (X seitlich, Z Tiefe): helle Fugen, ab und zu eine Pfütze
function kacheln(P, gr, sd) {
  return (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h, k = P.k(Z); const fx = X / gr - Math.floor(X / gr), fz = Z / gr - Math.floor(Z / gr);
    let t = 0.45 + Math.min(0.35, Z / 40) + (B.hash(Math.floor(X / gr), Math.floor(Z / gr), sd) - 0.5) * 0.15;
    if (fx * gr * k < 0.9 || fz * gr * k * k / P.h < 0.7) t += 0.18;
    if (B.fbm(X * 0.5, Z * 0.8, sd + 9, 2) > 0.72) t += 0.12;
    return t; };
}

// =====================================================================
// Variante 0: Das Wellenbad. Kuppel über dem Becken, das Wasser steht wie Glas, darin Treibende.
function wellenbad(K, cfg) {
  const fr = K.fr, nah = !!cfg.nah, sd = K.o.seed;
  const vx = nah ? 250 : 300, vy = nah ? 146 : 132, P = B.persp(vx, vy); K.split = nah ? [178, 186] : [168, 176];
  // Ebene 0: Kuppel
  const kp = kuppelInnen(K, nah ? { cx: 250, rx: 330, yb: 86, ry: 70, ax: 360, ay: -230, bauch: 30, n: 13, ringe: [0.18, 0.38, 0.6], tropfen: 70 } : { cx: 290, rx: 300, yb: 76, ry: 58, ax: 400, ay: -260, bauch: 24, n: 15, ringe: [0.16, 0.34, 0.55], tropfen: 90 });
  const rimY = x => { const ph = Math.asin(B.clamp((x - (nah ? 250 : 290)) / (nah ? 330 : 300), -1, 1)); return kp.rim(ph)[1]; };
  // Ebene 1: Wand unter dem Kämpfer: Galerie mit Rundbogenfenstern aus Milchglas
  const Zw = nah ? 14 : 26, yW = P.q(0, 0, Zw)[1];
  const wm = B.maske(); wm.fn(-M, -M, W + M, yW + 2, (x, y) => y > rimY(x) - 1);
  K.form(1, wm, 0.1, { k: WAND.slice(0, 6), ton: 1.6, fase: 0, rand: 0, verlauf: -0.6, muster: (x, y) => ((y % 5 === 0) ? -0.5 : 0) + ((x + (Math.floor(y / 5) & 1) * 4) % 8 === 0 ? -0.4 : 0) });
  const gesims = B.maske(); gesims.fn(-M, -M, W + M, H, (x, y) => Math.abs(y - rimY(x) - 2) < 2.2); K.form(1, gesims, 0.15, { k: WAND.slice(1, 7), ton: 2.5, fase: 0, rand: 2 });
  const fw = nah ? 26 : 18, fh = nah ? 50 : 36;
  for (let x = nah ? -20 : 4; x < W + 20; x += fw * 2.1) { const yt = rimY(x + fw / 2) + 8; if (yt + fh > yW - 6) continue; bogenfenster(K, 1, Math.round(x), Math.round(yt), fw, Math.min(fh, yW - yt - 8), 0.12, 0.62 + 0.25 * x / W); }
  // Licht durch die Kuppel: breite, kalte Bahnen von oben rechts
  for (const L of [K.e[1], K.e[2]]) { B.kegel(L, 470, -60, Math.PI * 0.66, 0.1, 380, '#24403e', 0.5); B.kegel(L, 380, -80, Math.PI * 0.6, 0.06, 360, '#24403e', 0.35); }
  // Becken: hinten Wasser bis an die Wand; vorne der Rand (Messing-Handlauf), auf dem Umgang stehen die Gegner
  const Zr = nah ? 3.9 : 3.6, Xb = nah ? 6 : 9;
  const yR = P.q(0, 0, Zr)[1], e2 = K.e[2], e1 = K.e[1];
  const was = WASSER.map(B.pk), nW = was.length - 1;
  for (let y = Math.floor(yW); y < yR; y++) for (let x = -M; x < W + M; x++) {
    const Z = P.z(y + 0.5), X = (x + 0.5 - vx) * Z / P.h; if (Math.abs(X) > Xb + (nah ? 2 : 0)) continue;
    // Spiegelung: was über der Wasserlinie steht, steht darunter noch einmal, ohne eine einzige Welle
    const my = Math.round(yW - (y - yW) * 2.2); const q = e1.get(x, my) || K.e[0].get(x, my);
    let t = 0.25 + Math.min(0.2, (y - yW) / 80);
    if (q >>> 24) { const c = B.unpk(q); t = (c[0] + c[1] + c[2]) / 3 / 150 * 0.9; }
    t = B.clamp(t * (1 - fr * 0.3), 0, 0.9999) * nW; const k = Math.floor(t);
    e2.set(x, y, was[Math.min(nW, (t - k) > B.bay(x, y) ? k + 1 : k)]);
  }
  // Beckenrand vorne und seitlich, Kacheln an der Innenwand, Leiter aus Messing
  const rm = B.maske(), [r0x, r0y] = P.q(-Xb, 0, Zr), [r1x] = P.q(Xb, 0, Zr), kr = P.k(Zr);
  rm.rect(r0x - 40, r0y - Math.max(2, kr * 0.08), r1x - r0x + 80, Math.max(3, kr * 0.12));
  for (const sx of [-1, 1]) { const pts = [P.q(sx * Xb, 0.02, Zr), P.q(sx * Xb, 0.02, Zw)]; rm.pfad(pts, Math.max(1.2, kr * 0.05), 1); }
  K.form(K.eb(r0y), rm, 0, { k: KACHEL.slice(1), ton: 2.4, fase: 1, rand: 2, schatten: 2 });
  const leiter = B.maske(), lx = P.q(-Xb * 0.45, 0, Zr)[0], ky2 = r0y;
  leiter.pfad([[lx, ky2 + 1], [lx - 2, ky2 - 16], [lx + 4, ky2 - 18], [lx + 6, ky2 - 2]], 1.2, 1.1); leiter.pfad([[lx + 12, ky2 + 1], [lx + 10, ky2 - 16], [lx + 16, ky2 - 18], [lx + 18, ky2 - 2]], 1.2, 1.1);
  K.form(K.eb(ky2), leiter, 0, { k: ['#2a2010', '#4a3818', '#7a6030', '#b08a46'], r: MESS, ton: 1.6, fase: 0, rand: 1 });
  // Treibende: Köpfe auf dem Rücken, in einer Reihe, wie aufgereiht für die Visite
  const nT = nah ? 3 : 5 + Math.round(fr * 2);
  for (let i = 0; i < nT; i++) { const Z = (nah ? 5.5 : 6) + i * (nah ? 1.4 : 2.2), X = -3.4 + i * 1.5 + B.hash(i, 1, sd) * 0.6, [tx, ty] = P.q(X, 0, Z); treibender(K, 2, Math.round(tx), Math.round(ty), Math.max(0.8, P.k(Z) / 11)); }
  // Umgang: Kacheln bis zum Rand
  K.boden(yR + 1, H + M, KACHEL, kacheln(P, 0.42, sd));
  // nasse Kacheln: die Fenster spiegeln sich als senkrechte Lichtbahnen, nahe am Becken am deutlichsten
  for (let y = Math.ceil(yR + 2); y < H; y++) { const e = K.e[K.eb(y)], q = 1 - (y - yR) / 70; if (q <= 0) continue;
    for (let x = -M; x < W + M; x++) { const src = e1.get(x, Math.round(yW - 30 - (y - yR) * 0.6)); if (!(src >>> 24)) continue; const c = B.unpk(src); if (c[0] + c[1] + c[2] < 330) continue; if (q * 0.7 > B.bay(x, y) + 0.15) e.set(x, y, B.pk(KACHEL[5])); } }
  // nasse Fußspuren: aus dem Becken heraus, auf dich zu, und keine zurück
  if (!nah) { const fp = B.pk(WASSER[5]); for (let i = 0; i < 7; i++) { const Z = Zr - 0.35 - i * 0.3, X = -1.2 + (i % 2) * 0.35 + i * 0.12, [fx, fy] = P.q(X, 0, Z), k = P.k(Z) * 0.03; const m = B.maske(); m.ell(fx, fy, 1.6 * k + 0.6, 0.8 * k + 0.4); m.ell(fx - 1.8 * k, fy, 0.9 * k + 0.3, 0.6 * k + 0.3); for (let yy = m.y0; yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) if (m.has(xx, yy)) K.e[K.eb(yy)].set(xx, yy, fp); } }
  // Säulen der Kuppel links und rechts, eine Liegebank mit Handtüchern, Badethermometer an der Säule
  const Zs = nah ? [3.4, 7] : [3.4, 7, 13];
  for (const Z of Zs.slice().reverse()) for (const sx of [-1, 1]) {
    const X = sx * (Xb + 1.2), [x, yb2] = P.q(X, 0, Z), [, yt] = P.q(X, 5.2, Z); const k = P.k(Z);
    if (x < -40 || x > W + 40) continue;
    saeule(K, Z > 7 ? 2 : 3, Math.round(x), Math.max(-M, Math.round(yt)), Math.round(yb2), Math.max(2.5, k * 0.3), Z > 7 ? 0.25 : 0.05);
  }
  if (!nah) {
    const [tx, ty] = P.q(Xb + 1.2, 2.6, 7), tk = P.k(7) * 0.06; const th = B.maske(); th.rect(tx - 9 * tk, ty, 4 * tk, 22 * tk); th.ell(tx - 7 * tk, ty + 23 * tk, 2.4 * tk, 2.4 * tk);
    K.form(3, th, 0, { k: ['#2a2010', '#4a3818', '#7a6030', '#b08a46'], r: MESS, ton: 1.5, fase: 1 });
    B.linie(K.e[3], tx - 7 * tk, ty + 3, tx - 7 * tk, ty + 22 * tk, B.pk('#0a1010'));
    // Bank vorne links mit gefalteten Tüchern
    const bk = B.maske(); bk.rect(18, 178, 62, 5); bk.rect(22, 183, 4, 14); bk.rect(72, 183, 4, 14); for (let i = 0; i < 3; i++) bk.rect(26 + i * 15, 170 - (i % 2) * 2, 12, 8 - (i % 2));
    K.form(4, bk, 0, { k: HOLZ, r: pal.rand, ton: 1.8, fase: 1, schatten: 2 });
  }
  if (!nah) rollstuhl(K, 3, 392, 176, 1.15); else rollstuhl(K, 3, 404, 190, 1.3);
  B.nebel(K.e[2], { y0: yW - 26, y1: yW + 14, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.3, xs: [30, 450, 80], seed: 4 });
  // Vordergrund: links ein Handtuch über einer Stange, rechts die Kante einer Säule
  const v = B.maske(); v.rect(-M, -M, 26, H + 2 * M); v.rect(-M, 40, 34, 6); v.ell(30, 92, 15, 16); v.ell(30, 92, 8, 9, 0); v.kap(22, 46, 30, 76, 0.8, 0.8); v.kap(38, 46, 30, 76, 0.8, 0.8); v.rect(458, -M, 40, H + 2 * M); v.rect(450, 30, 50, 6);
  K.form(5, v, 0, { k: EISEN.concat(['#1d2c2e']), r: pal.rand, ton: 1.2, fase: 2 });
  // Luft: Tropfen fallen aus der Kuppel; über dem Wasser keine einzige Welle
  B.partikel(K, { n: 26, farben: [GLAS[6], GLAS[8]], vy: 26, x0: 40, x1: 460, y0: 0, y1: yR, laenge: 2, p: 0.6, hellSelten: 1.2 });
  B.partikel(K, { n: 30, farben: [GLAS[4], GLAS[5]], vx: 1, vy: -2, wob: 3, wf: 0.3, x0: 0, x1: 480, y0: 20, y1: 150, p: 0.8 });
  K.licht(440, 20, LICHT, 200, 0.5);
  K.reihen = nah ? [{ y: 188, skala: 0.9, nebel: 0.25 }, { y: 202, skala: 1, nebel: 0.1 }, { y: 215, skala: 1, nebel: 0 }] : [{ y: 178, skala: 0.9, nebel: 0.25 }, { y: 196, skala: 1, nebel: 0.1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 206], P, Zr, Xb, yR };
}

// Kurhaus von außen: Bau mit Kuppel (Laterne beschlagen, Licht von innen), für Ferne und Klippe
function kurhausAussen(K, eb, x, y, s, tiefe) {
  const m = B.maske(), w = 70 * s, h = 26 * s;
  m.rect(x - w / 2, y - h, w, h); m.rect(x - w / 2 - 14 * s, y - h * 0.7, 14 * s, h * 0.7); m.rect(x + w / 2, y - h * 0.75, 18 * s, h * 0.75);
  m.fn(x - 22 * s, y - h - 24 * s, x + 22 * s, y - h, (px, py) => ((px - x) / (22 * s)) ** 2 + ((py - (y - h)) / (22 * s)) ** 2 <= 1);
  m.rect(x - 4 * s, y - h - 30 * s, 8 * s, 8 * s); m.poly([[x - 5 * s, y - h - 30 * s], [x, y - h - 35 * s], [x + 5 * s, y - h - 30 * s]]);
  K.form(eb, m, tiefe, { ton: 1.6, fase: 1, rand: 2, verlauf: 0.3 });
  // Kuppel: Glas milchig, Rippen
  const e = K.e[eb];
  B.feld(e, x - 22 * s, y - h - 24 * s, x + 22 * s, y - h, GLAS, (px, py) => { const q = ((px - x) / (20.5 * s)) ** 2 + ((py - (y - h)) / (20.5 * s)) ** 2; if (q > 1) return -1; const a = Math.atan2(py - (y - h), px - x); return (Math.abs(Math.sin(a * 5)) < 0.12 ? 0.15 : 0.55 + 0.25 * (px - x) / (22 * s)) - K.fr * 0.2; });
  for (let i = 0; i < 9; i++) { const fx = x - w / 2 + 5 * s + i * (w - 10 * s) / 8; B.feld(e, fx, y - h * 0.65, fx + 3 * s, y - h * 0.65 + 6 * s, GLAS, () => (i === 6 ? 0.9 : 0.4)); }
  K.glut(x, y - h - 10 * s, 30 * s, GLUT_K, 0.7, [0, 1]);
}
// Liegestuhl von vorn, darin ein eingepackter Patient, der dich ansieht (leer: nur die Decke in Form)
function liegerFront(K, eb, x, y, s, leer, sd) {
  const m = B.maske(), w = 13 * s;
  m.poly([[x - w, y - 30 * s], [x + w, y - 30 * s], [x + w + 2 * s, y - 8 * s], [x - w - 2 * s, y - 8 * s]]);
  for (const dx of [-w, w]) m.kap(x + dx, y - 8 * s, x + dx * 1.1, y, 0.9 * s, 0.9 * s);
  K.form(eb, m, 0.1, { k: HOLZ, r: pal.rand, ton: 1.6, fase: 1, rand: 2, muster: (px) => ((Math.round(px - x) % 4) === 0 ? -0.5 : 0) });
  const b = B.maske(); b.poly([[x - 8 * s, y - 24 * s], [x + 8 * s, y - 24 * s], [x + 10 * s, y - 10 * s], [x + 6 * s, y - 2 * s], [x - 6 * s, y - 2 * s], [x - 10 * s, y - 10 * s]]);
  b.ell(x, y - 26 * s, 6.5 * s, 5.5 * s);
  K.form(eb, b, 0.05, { ton: 1.8, fase: 1.5, rand: 2, muster: (px, py) => (((Math.round(py - y) % Math.max(3, Math.round(5 * s))) === 0) ? -0.6 : 0) });
  if (!leer) { const g = B.maske(); g.ell(x, y - 27 * s, 3.4 * s, 3.8 * s); K.form(eb, g, 0, { k: ['#162222', '#2c4040', '#56706c', '#8aa49e'], ton: 2.4, fase: 1, rand: 1 });
    const e = K.e[eb]; e.set(x - 1, y - 25 * s, B.pk('#2c4040')); e.set(x, y - 25 * s, B.pk('#2c4040')); }
  else { const g = B.maske(); g.ell(x, y - 27 * s, 3 * s, 3.3 * s); K.form(eb, g, 0, { k: WAND.slice(0, 4), ton: 0.6, fase: 0, rand: 0 }); }
}

// Variante 1: Die Liegehalle. Frontal: eine Reihe Liegestühle an der Rückwand, alle Gesichter zu dir.
// Hinter dir ist das Meer, nach dem sie sehen sollten. Rechts endet die Halle, dort die Klippe und das Kurhaus.
function liegehalle(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(300, 138); K.split = [160, 170];
  // Himmel: Milchglas-Tag, rechts am hellsten; das Meer rechts unten
  B.feld(K.e[0], -M, -M, W + M, H + M, GLAS, (x, y) => 0.3 + 0.45 * (x / W) - y / H * 0.35 + (B.fbm(x * 0.012, y * 0.03, sd, 3) - 0.5) * 0.25 - fr * 0.15);
  B.feld(K.e[1], 360, 120, W + M, 160, WASSER, (x, y) => 0.55 + (Math.sin(y * 1.7) > 0.7 ? 0.15 : 0) - (y - 120) / 120);
  const kl = B.maske(); kl.poly([[372, 160], [380, 128], [410, 116], [470, 112], [W + M, 112], [W + M, 160]]); K.form(1, kl, 0.35, { ton: 1.4, fase: 1, rand: 2 });
  kurhausAussen(K, 1, 444, 114, 0.62, 0.3);
  // Rückwand der Halle (dunkel, Fenster mit Milchglas), Dach mit Sparren, Pfosten der offenen Seite
  const wand = B.maske(); wand.rect(-M, 40, 386, 112); K.form(2, wand, 0.05, { k: WAND.slice(0, 6), ton: 1.4, fase: 0, rand: 0, muster: (x, y) => ((x % 24) === 0 ? -0.6 : 0) + ((y % 9) === 0 ? -0.25 : 0) });
  for (let x = 14; x < 360; x += 48) { const f = B.maske(); f.rect(x, 62, 20, 34); B.feld(K.e[2], x, 62, x + 20, 96, GLAS, (px, py) => 0.45 - (py - 62) / 80 + (B.hash(px >> 1, py >> 1, 3) - 0.5) * 0.15 - fr * 0.2); const r2 = B.maske(); r2.rect(x - 2, 60, 24, 2); r2.rect(x - 2, 96, 24, 3); r2.rect(x + 9, 62, 2, 34); r2.rect(x, 78, 20, 1); K.form(2, r2, 0.05, { k: WAND.slice(2, 6), ton: 1.6, fase: 0, rand: 1 }); }
  const dach = B.maske(); dach.poly([[-M, -M], [400, -M], [400, 30], [388, 42], [-M, 46]]); K.form(3, dach, 0, { k: HOLZ, r: pal.rand, ton: 1.1, fase: 1, rand: 2, muster: (x, y) => ((x % 34) < 3 ? 0.6 : 0) + ((y % 6) === 0 ? -0.3 : 0) });
  for (const x of [60, 168, 276, 384]) { const pf = B.maske(); pf.rect(x - 3, 40, 6, 120); pf.rect(x - 6, 152, 12, 6); pf.poly([[x - 3, 52], [x - 16, 42], [x + 16, 42], [x + 3, 52]]); K.form(3, pf, 0, { k: HOLZ, r: pal.rand, ton: 1.5, fase: 1, schatten: 2 }); }
  // Liegestühle: in einer Reihe, gleich ausgerichtet; einer ist leer, die Decke behält die Form
  const leerI = 2 + (sd % 3);
  for (let i = 0; i < 9; i++) { const x = 26 + i * 40 + (i % 2), leer = i === leerI || (fr > 0.6 && i === 6); if (x > 372) continue; liegerFront(K, 2, x, 152, 1.05, leer, sd); }
  // Boden: Dielen, die zu dir laufen
  K.boden(152, H + M, HOLZ.concat(['#364644']), (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h, k = P.k(Z), f = X / 0.32 - Math.floor(X / 0.32); let t = 0.35 + B.hash(Math.floor(X / 0.32), 1, sd) * 0.15 + Math.min(0.25, Z / 20) - (y > 200 ? 0.1 : 0); if (f * 0.32 * k < 1) t -= 0.25; t += (x - 200) / 900; for (const px of [60, 168, 276, 384]) { const d = x - (px - (y - 152) * 1.6); if (d > -5 && d < 4) t -= 0.35; } return t; });
  // Decke über der Brüstung zum Trocknen, Krankenblätter an einem Haken
  const br = B.maske(); br.rect(386, 136, 100, 3); br.rect(386, 150, 100, 3); for (let x = 390; x < W + M; x += 9) br.rect(x, 136, 2, 16); K.form(3, br, 0, { k: HOLZ, r: pal.rand, ton: 1.5, fase: 0, rand: 1 });
  const de = B.maske(); de.poly([[402, 132], [436, 133], [434, 160], [430, 156], [424, 162], [416, 157], [408, 163], [404, 156]]); K.form(3, de, 0, { ton: 2, fase: 1, rand: 2, muster: (x) => ((x % 6) < 2 ? -0.4 : 0) });
  B.nebel(K.e[2], { y0: 128, y1: 160, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.22, xs: [0, 380, 60], seed: 6 });
  // Vordergrund: der vorderste Pfosten links angeschnitten, eine Decke über der Lehne eines Stuhls rechts unten
  const v = B.maske(); v.rect(-M, -M, 20, H + 2 * M); v.poly([[-M, 20], [60, -M], [70, -M], [-M, 34]]); v.poly([[420, 236], [W + M, 222], [W + M, 270], [430, 270]]); v.rect(428, 200, 6, 40);
  K.form(5, v, 0, { k: HOLZ, r: pal.rand, ton: 0.9, fase: 2 });
  B.partikel(K, { n: 24, farben: [GLAS[5], GLAS[7]], vx: -6, vy: 1, wob: 2, wf: 0.5, x0: 0, x1: 480, y0: 40, y1: 200, p: 0.9 });
  K.licht(470, 100, LICHT, 160, 0.5);
  K.reihen = [{ y: 172, skala: 0.9, nebel: 0.25 }, { y: 194, skala: 1, nebel: 0.1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [220, 206] };
}

// Badekarren: Holzhütte auf hohen Rädern, Tür zum Meer
function badekarren(K, eb, x, y, s, tiefe, tuerAuf) {
  // y = Wasserlinie. Kasten auf hohen Rädern, Dach aus gestreiftem Segeltuch, Leiter ins Wasser
  const m = B.maske(), w = 19 * s, h = 22 * s, yb = y - 6 * s;
  m.rect(x - w, yb - h, 2 * w, h); m.poly([[x - w - 3 * s, yb - h], [x - w + 2 * s, yb - h - 9 * s], [x + w - 2 * s, yb - h - 9 * s], [x + w + 3 * s, yb - h]]);
  for (const dx of [-w * 0.55, w * 0.55]) { m.fn(x + dx - 11 * s, y - 12 * s, x + dx + 11 * s, y, (px, py) => { const d = Math.hypot(px - x - dx, py - y); return d < 10.5 * s && d > 8.6 * s && py < y; }); m.kap(x + dx, y, x + dx, y - 10 * s, 0.7 * s, 0.7 * s); m.kap(x + dx - 7 * s, y - 7 * s, x + dx + 7 * s, y - 7 * s, 0.6 * s, 0.6 * s); }
  m.kap(x - w * 0.55, yb, x + w * 0.55, yb, 0.9 * s, 0.9 * s);
  K.form(eb, m, tiefe, { k: HOLZ, r: pal.rand, ton: 1.8, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (py < yb - h ? (((Math.round(px - x) >> 1) & 1) ? 0.9 : -0.3) : ((Math.round(px - x) % Math.max(2, Math.round(4 * s))) === 0 ? -0.5 : 0)) });
  const t = B.maske(); t.rect(x - 5 * s, yb - h + 3 * s, 10 * s, h - 3 * s); B.form(K.e[eb], t, K.mat(tiefe, { k: tuerAuf ? ['#010303', '#030606'] : HOLZ.slice(1, 4), ton: tuerAuf ? 0.3 : 1.2, fase: 0, rand: 0 }));
  if (tuerAuf) { const l = B.maske(); l.kap(x - 4 * s, yb, x - 6 * s, y + 2, 0.5 * s + 0.3, 0.5 * s + 0.3); l.kap(x + 4 * s, yb, x + 2 * s, y + 2, 0.5 * s + 0.3, 0.5 * s + 0.3); for (let k = 1; k < 3; k++) l.kap(x - 4.6 * s - k * 0.6 * s, yb + k * 2.4 * s, x + 3.4 * s - k * 0.6 * s, yb + k * 2.4 * s, 0.35 * s + 0.3, 0.35 * s + 0.3); K.form(eb, l, tiefe, { k: HOLZ, r: pal.rand, ton: 1.6, fase: 0, rand: 1 }); }
}

// Variante 2: Am Strand unter der Klippe. Die Badekarren stehen draußen im tiefen Wasser, die Türen offen.
// Oben auf der Klippe das Kurhaus. Das Meer ist so still wie das Becken.
function strand(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(170, 150); K.split = [166, 176];
  B.feld(K.e[0], -M, -M, W + M, H + M, GLAS, (x, y) => 0.25 + 0.5 * (x / W) - y / H * 0.3 + (B.fbm(x * 0.01, y * 0.035, sd + 1, 3) - 0.5) * 0.3 - fr * 0.15);
  // Klippe rechts, oben das Kurhaus
  const kl = B.maske(); kl.poly([[300, 175], [318, 150], [332, 120], [340, 92], [352, 84], [372, 78], [W + M, 74], [W + M, 190], [300, 190]]);
  K.form(1, kl, 0.08, { ton: 1.2, fase: 2, rand: 2, muster: (x, y) => (B.fbm(x * 0.08, y * 0.08, sd + 2, 2) - 0.5) * 1.4 + ((y % 11) === 0 ? -0.4 : 0) });
  kurhausAussen(K, 1, 420, 76, 1, 0.05);
  // Treppe die Klippe hinab, Geländer
  const tr = B.maske(); tr.pfad([[372, 80], [356, 110], [370, 130], [348, 160], [336, 176]], 1.2, 1.4); K.form(2, tr, 0, { k: HOLZ, r: pal.rand, ton: 1.6, fase: 0, rand: 1 });
  // Meer: still, spiegelt den Himmel und die Karren; ganz fern eine Brandungslinie, die nicht näher kommt
  const e1 = K.e[1], e2 = K.e[2], was = WASSER.map(B.pk), nW = was.length - 1;
  for (let y = 150; y < 186; y++) for (let x = -M; x < 330; x++) { const q = K.e[0].get(x, Math.round(150 - (y - 150) * 1.6)); let t = 0.3; if (q >>> 24) { const c = B.unpk(q); t = (c[0] + c[1] + c[2]) / 3 / 170; } if (y < 153 && B.hash(x >> 2, 0, sd) > 0.5) t += 0.25; t = B.clamp(t, 0, 0.9999) * nW; const k = Math.floor(t); (y < 166 ? e1 : e2).set(x, y, was[Math.min(nW, (t - k) > B.bay(x, y) ? k + 1 : k)]); }
  const kar = [[78, 166, 0.95, true], [168, 161, 0.68, true], [232, 157, 0.5, false], [278, 155, 0.36, true]];
  for (const [x, y, sc, auf] of kar.slice().reverse()) {
    badekarren(K, 1, x, y, sc, 0.05 + (1 - sc) * 0.3, auf);
    // Spiegelbild, ohne eine Welle
    for (let yy = Math.round(y); yy < y + 32 * sc; yy++) for (let xx = Math.round(x - 24 * sc); xx < x + 24 * sc; xx++) { const q = e1.get(xx, Math.round(2 * y - yy)); if ((q >>> 24) && B.unpk(q)[1] < 50 && B.bay(xx, yy) < 0.7) (yy < 166 ? e1 : e2).set(xx, yy, was[1]); }
    // das Wasser steht bis über die Achsen
    for (let xx = Math.round(x - 26 * sc); xx < x + 26 * sc; xx++) e1.set(xx, Math.round(y), was[6]);
  }
  // Strand: nasser Sand, Flutsaum, Fußspuren aus dem Wasser
  K.boden(184, H + M, SAND, (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; return 0.35 + Math.min(0.3, Z / 30) + (B.fbm(X * 0.6, Z * 1.5, sd, 2) - 0.5) * 0.3 + (Math.sin(Z * 6 + X * 0.3) > 0.92 ? 0.15 : 0); });
  for (let x = -M; x < 330; x++) { const y = Math.round(185 + Math.sin(x * 0.05) * 1.5); K.e[K.eb(y)].set(x, y, B.pk(GLAS[3])); if (B.bay(x, 0) > 0.5) K.e[K.eb(y + 1)].set(x, y + 1, B.pk(SAND[5])); }
  const fp = B.pk(SAND[0]); for (let i = 0; i < 9; i++) { const y = 188 + i * 8 + i * i * 0.6, x = 128 + i * 6 + (i % 2) * 7, k = 0.6 + i * 0.12; const m = B.maske(); m.ell(x, y, 2 * k, 1 * k); m.ell(x - 2.2 * k, y, 1 * k, 0.7 * k); for (let yy = m.y0; yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) if (m.has(xx, yy)) K.e[K.eb(yy)].set(xx, yy, fp); }
  // Leine von den Karren zum Strand, Pfahl
  const le = B.maske(); le.kap(56, 150, 32, 190, 0.6, 0.6); le.kap(30, 178, 34, 200, 1.6, 1.8); K.form(3, le, 0, { k: HOLZ, r: pal.rand, ton: 1.4, fase: 0, rand: 1 });
  B.nebel(K.e[1], { y0: 132, y1: 160, col: B.mix(pal.nebel[1], K.fern, 0.5), dichte: 0.3, xs: [-20, 320, 60], seed: 8 });
  // Vordergrund: Strandkorb rechts angeschnitten, Treibholz links
  const v = B.maske(); v.kap(452, 150, 456, 270, 5, 6); v.kap(446, 170, 470, 168, 1.2, 1.2); v.poly([[-M, 246], [80, 238], [86, 244], [-M, 256]]); v.poly([[300, 270], [340, 252], [372, 256], [390, 270]]);
  K.form(5, v, 0, { k: HOLZ, r: pal.rand, ton: 1, fase: 2, muster: (x, y) => ((x + y) % 4 === 0 ? -0.5 : 0) });
  B.partikel(K, { n: 30, farben: [GLAS[6], GLAS[8]], vx: -5, vy: 0.5, wob: 2, wf: 0.4, x0: 0, x1: 480, y0: 20, y1: 190, p: 0.9 });
  K.licht(440, 60, LICHT, 160, 0.5);
  K.reihen = [{ y: 190, skala: 0.9, nebel: 0.2 }, { y: 202, skala: 1, nebel: 0.08 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [240, 210] };
}

// Wächter: Unter der Laterne. Untersicht, die Rippen laufen sichtbar zur Laterne im Scheitel, deren Glas
// von innen beschlagen ist. Vorne der Beckenrand, dahinter die Treppe ins Wasser. Übergang: die Treppe
// führt unter dem Wasser weiter hinab, als das Becken tief sein kann.
function unterDerLaterne(K, cfg) {
  const fr = K.fr, sd = K.o.seed, vy = cfg.treppe ? 160 : 176, P = B.persp(250, vy); K.split = cfg.treppe ? [176, 186] : [184, 192];
  const ax = 300, ay = 34;
  const kp = kuppelInnen(K, { cx: 250, rx: 360, yb: vy - 20, ry: 150, ax, ay, bauch: 46, n: 20, ringe: [0.3, 0.55, 0.78], tropfen: 130 });
  // Laterne im Scheitel: ein Ring aus Eisen, darin das hellste Glas
  const ring = B.maske(); ring.ell(ax, ay, 46, 26); ring.ell(ax, ay, 38, 20, 0); K.form(1, ring, 0.05, { k: EISEN, r: pal.rand, ton: 1.2, fase: 1, rand: 2 });
  B.feld(K.e[0], ax - 40, ay - 22, ax + 40, ay + 22, GLAS, (x, y) => { const q = ((x - ax) / 38) ** 2 + ((y - ay) / 20) ** 2; if (q > 1) return -1; return 0.95 - q * 0.35 - fr * 0.2; });
  const sp = B.maske(); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; sp.kap(ax + Math.cos(a) * 6, ay + Math.sin(a) * 3.2, ax + Math.cos(a) * 38, ay + Math.sin(a) * 20, 0.6, 0.8); } sp.ell(ax, ay, 7, 4); sp.ell(ax, ay, 5, 2.6, 0); K.form(1, sp, 0.1, { k: EISEN, ton: 1, fase: 0, rand: 1 });
  for (const L of [K.e[1], K.e[2], K.e[3]]) { B.kegel(L, ax, ay + 10, Math.PI / 2 + 0.25, 0.1, 230, '#2a4644', 0.5); B.kegel(L, ax, ay + 10, Math.PI / 2 - 0.05, 0.07, 230, '#2a4644', 0.4); }
  K.glut(ax, ay, 90, GLUT_K, 0.9, [0, 1]); K.licht(ax, ay, LICHT, 120, 1);
  // niedrige Wand mit Fenstern unter dem Kämpfer
  const rimY = x => kp.rim(Math.asin(B.clamp((x - 250) / 360, -1, 1)))[1];
  const wm = B.maske(); wm.fn(-M, -M, W + M, vy + 1, (x, y) => y > rimY(x) - 1); K.form(1, wm, 0.08, { k: WAND.slice(0, 6), ton: 1.4, fase: 0, rand: 0, muster: (x, y) => ((y % 5 === 0) ? -0.5 : 0) });
  for (let x = -10; x < W + 20; x += 52) { const yt = rimY(x + 11) + 6; if (yt + 22 > vy - 4) continue; bogenfenster(K, 1, x, Math.round(yt), 22, Math.min(40, vy - yt - 6), 0.08, 0.6 + 0.3 * x / W); }
  // Boden: Kacheln; vorne der Beckenrand, dahinter Wasser mit Treppe
  K.boden(vy + 1, H + M, KACHEL, kacheln(P, 0.42, sd));
  const yB = cfg.treppe ? 200 : 236, e = K.e[4], was = WASSER.map(B.pk), nW = was.length - 1;
  for (let y = yB; y < H + M; y++) for (let x = -M; x < W + M; x++) { const q = K.e[1].get(x, Math.round(yB - (y - yB) * 1.4 - 40)) || K.e[0].get(x, Math.round(yB - (y - yB) * 1.4 - 40)); let t = 0.3; if (q >>> 24) { const c = B.unpk(q); t = (c[0] + c[1] + c[2]) / 3 / 170; } t = B.clamp(t * 0.85, 0, 0.9999) * nW; const k = Math.floor(t); e.set(x, y, was[Math.min(nW, (t - k) > B.bay(x, y) ? k + 1 : k)]); }
  const rd = B.maske(); rd.rect(-M, yB - 3, W + 2 * M, 4); K.form(4, rd, 0, { k: KACHEL.slice(1), ton: 2.4, fase: 1, rand: 2, schatten: 2 });
  if (cfg.treppe) {
    // Stufen unter dem Wasser: werden schmaler und dunkler, hören nicht auf
    for (let i = 0; i < 12; i++) { const y = yB + 6 + i * (9 - i * 0.45), w = 120 - i * 8, d = Math.max(0, 0.5 - i * 0.045); if (y > H + 4) break; B.dith(e, 250 - w, y, 250 + w, y + 2, WASSER[5 - Math.min(4, i >> 1)], () => 0.4 + d); B.linie(e, 250 - w, y, 250 + w, y, B.pk(WASSER[Math.max(2, 7 - i)])); }
    const dk = B.maske(); dk.ell(250, 300, 70, 40); B.form(e, dk, { k: [B.pk('#000000'), B.pk('#020404')], ton: 0.5, fase: 0, rand: 0 });
  } else {
    const st = B.maske(); for (let i = 0; i < 3; i++) st.rect(196 + i * 6, yB + 4 + i * 8, 108 - i * 12, 3); K.form(4, st, 0.1, { k: KACHEL.slice(0, 4), ton: 1.6, fase: 0, rand: 1 });
    const hl = B.maske(); hl.pfad([[190, yB + 30], [186, yB - 22], [196, yB - 30], [206, yB - 22]], 1.3, 1.2); hl.pfad([[310, yB + 30], [314, yB - 22], [304, yB - 30], [294, yB - 22]], 1.3, 1.2);
    K.form(4, hl, 0, { k: ['#2a2010', '#4a3818', '#7a6030', '#b08a46'], r: MESS, ton: 1.6, fase: 0, rand: 1 });
  }
  // Säulen nah, links und rechts, groß
  saeule(K, 3, 54, -M, vy + 14, 9, 0); saeule(K, 3, 430, -M, vy + 12, 8, 0);
  rollstuhl(K, 3, 96, vy + 18, 1.3);
  // Badethermometer an der rechten Säule, so groß wie ein Mensch; die Skala ist leer
  const th = B.maske(); th.rect(446, 70, 7, 72); th.ell(449.5, 146, 6, 6); K.form(3, th, 0, { k: ['#2a2010', '#4a3818', '#7a6030', '#b08a46'], r: MESS, ton: 1.5, fase: 1 });
  for (let y = 74; y < 140; y += 4) K.e[3].set(448, y, B.pk('#0a1010'));
  B.nebel(K.e[2], { y0: vy - 30, y1: vy + 10, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.28, xs: [20, 460, 80], seed: 9 });
  const v = B.maske(); v.rect(-M, -M, 18, H + 2 * M); v.rect(466, -M, 30, H + 2 * M); K.form(5, v, 0, { k: EISEN.concat(['#1d2c2e']), r: pal.rand, ton: 1.2, fase: 2 });
  B.partikel(K, { n: 34, farben: [GLAS[6], GLAS[8]], vy: 30, x0: 60, x1: 440, y0: 40, y1: yB, laenge: 2, p: 0.6, hellSelten: 1.2 });
  K.reihen = cfg.treppe ? [{ y: 180, skala: 0.9, nebel: 0.25 }, { y: 190, skala: 1, nebel: 0.1 }, { y: 198, skala: 1, nebel: 0 }] : [{ y: 192, skala: 0.9, nebel: 0.25 }, { y: 206, skala: 1, nebel: 0.1 }, { y: 218, skala: 1, nebel: 0 }];
  return { mitte: [250, 214] };
}

// Fundstück: ein Arzneikästchen, offen, darin ein Thermometer, das nichts anzeigt
function arzneikasten(K, x, y) {
  const m = B.maske(); m.rect(x - 16, y - 12, 32, 12); m.poly([[x - 16, y - 12], [x - 12, y - 26], [x + 18, y - 25], [x + 16, y - 12]]);
  K.form(4, m, 0, { k: HOLZ, r: pal.rand, ton: 1.8, fase: 1, schatten: 2, muster: (px, py) => (py === y - 6 ? -0.8 : 0) });
  const th = B.maske(); th.kap(x - 8, y - 14, x + 9, y - 16, 0.8, 0.8); th.ell(x + 10, y - 16, 1.6, 1.6); K.form(4, th, 0, { k: ['#2a2010', '#4a3818', '#7a6030', '#b08a46'], r: MESS, ton: 1.8, fase: 0, rand: 1 });
  const s2 = B.maske(); s2.ell(x, y + 1, 22, 2.5); B.form(K.e[4], s2, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  B.gluehen(K.e[4], x, y - 12, 26, GLUT_K, 0.9);
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.3) > 0.55) { ctx.fillStyle = pal.augen; ctx.fillRect(x + 10 + ox, y - 17 + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 1 : art === 'kraemer' ? 0 : art === 'ereignis' || art === 'fund' ? 2 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = unterDerLaterne(K, {});
  else if (art === 'uebergang') info = unterDerLaterne(K, { treppe: true });
  else info = [k => wellenbad(k, {}), liegehalle, strand][v](K);
  if (art === 'fund' || art === 'ereignis') arzneikasten(K, info.mitte[0], info.mitte[1]);
  else B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.kurhaus = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 2, knick: 0.4 } };
if (World.BIOME.indexOf('kurhaus') < 0) World.BIOME.push('kurhaus');
})();
