// Saltmoor 1925 · Hintergründe: Akt III, Die Ziegelgruben (Biom-Paket ziegelgruben).
// Komposition: docs/auftrag-2/biome/ziegelgruben.md
// Ort: Ziegelbrennereien tief unter Rom, die Öfen noch warm. Wahrzeichen: der Ringofen, ein gewölbter Gang,
// dessen Kammern in einer Kurve nach hinten laufen, die sich nie schließt; hinter jeder Tür steht weiße Glut.
// Falsches Detail: In jedem Ziegel ist ein Fingerabdruck, immer derselbe Finger (Ringlinien mit einer Narbe
// quer darüber); in der Lehmgrube sind die Terrassen selbst die Linien eines Abdrucks.
// Palette: Ziegelrot gegen Aschegrau, Ruß; das Licht weißglühend aus vielen Öffnungen in Reihe.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060505', '#0d0b0a', '#171312', '#241d1a'], rand: ['#c4582c', '#ffdcae'], augen: '#fff1b0', nebel: ['#2a2421', '#6a5c54'], fern: '#5a4a42' };
const ZIEGEL = ['#0e0605', '#180a07', '#24100a', '#33170d', '#441f11', '#572815', '#6c331a', '#843f21', '#9c4c28', '#b65c31', '#cc6d3b'];
const ASCHE = ['#121110', '#1c1a19', '#282523', '#36322f', '#45403c', '#55504b', '#67605a', '#7a726b', '#8e857d', '#a39990'];
const RUSS = ['#050404', '#0a0807', '#110e0d', '#191514', '#221c1a'];
const LEHM = ['#17130f', '#211b16', '#2d251e', '#3a3027', '#483c31', '#57493c', '#685847', '#7b6a56'];
const GLUT = ['#3a0e06', '#6a1c0a', '#a0300e', '#d24c16', '#ff7a2a', '#ffa848', '#ffd27a', '#fff1c0', '#ffffff'];
const RAND_Z = ['#c4582c', '#ffdcae'], RAND_A = ['#8e7a6a', '#e0cfbe'];
const KALT = ['#0c1218', '#14202a', '#1e3040', '#2c4660', '#46688a', '#7aa0c4'];
const PK = a => a.map(B.pk);
const pZ = PK(ZIEGEL), pA = PK(ASCHE), pR = PK(RUSS), pG = PK(GLUT), pL = PK(LEHM), pK2 = PK(KALT);
const bay = B.bay, clamp = B.clamp;
// Farbe aus einer Rampe, t in 0..1, geordnet gedithert
const rp = (P, t, x, y) => { t = clamp(t, 0, 0.9999) * (P.length - 1); const k = Math.floor(t); return P[Math.min(P.length - 1, (t - k) > bay(x, y) ? k + 1 : k)]; };
const fx = t => t - Math.floor(t);

// Ziegelverband auf einer Fläche (u längs, v hoch), Weltmaße: Lage ch, Länge bl. k = Pixel je Einheit.
// Gibt einen Helligkeitsbeitrag: Fuge dunkel, Oberkante hell, je Ziegel leichte Streuung, Abdruck in manchen.
function ziegel(u, v, k, ch, bl, sd) {
  const lage = Math.floor(v / ch), fv = v / ch - lage, uu = u / bl + (lage % 2) * 0.5, nr = Math.floor(uu), fu = uu - nr;
  const pxV = ch * k, pxU = bl * k; let t = (B.hash(nr, lage, sd) - 0.5) * 0.14;
  if (pxV >= 2.2) { if (fv < 1 / pxV) t -= 0.28; else if (fv > 1 - 1.2 / pxV) t += 0.1; }
  if (pxU >= 3 && fu < 1 / pxU) t -= 0.22;
  // Abdruck: Ringlinien in der Mitte des Ziegels (nur, wenn groß genug), mit einer Narbe quer
  if (pxV >= 6 && B.hash(nr, lage, sd + 5) > 0.45) {
    const dx = (fu - 0.5) * pxU, dy = (fv - 0.5) * pxV, rr = Math.hypot(dx, dy * 1.2);
    if (rr < pxV * 0.42 && Math.abs(dy + dx * 0.5) > 0.5) { if (fx(rr / 1.5) < 0.45) t -= 0.12; else t += 0.06; }
  }
  return t;
}

// ---------- Variante 0 und Krämer: Der Ringofen ----------
// Ray-Marching durch einen gewölbten Gang, der nach links wegkrümmt (Außenwand rechts mit Kammertüren).
function ringofen(K, cfg) {
  const sd = K.o.seed, fr = K.fr, vx = cfg.vx || 300, vy = 148, P = B.persp(vx, vy), h = P.h;
  const Xo = 1.9, Xi = -1.7, bend = 0.042, Yw = 2.05, Yc = 2.7;
  const dZ = 1.7, z0 = 1.1; // Kammertüren auf der Außenwand
  const tuer = (u, v) => { const i = Math.round((u - z0) / dZ); if (i < 0) return null; const du = u - (z0 + i * dZ); const tw = 0.34, th = 1.22;
    if (Math.abs(du) > tw || v < 0 || v > th + tw) return { i, du, aus: true }; if (v > th && Math.hypot(du, v - th) > tw) return { i, du, aus: true }; return { i, du, rand: Math.min(tw - Math.abs(du), v > th ? tw - Math.hypot(du, v - th) : 9) }; };
  const doorLicht = (u, v) => { let L = 0; const i0 = Math.round((u - z0) / dZ); for (let i = Math.max(0, i0 - 1); i <= i0 + 1; i++) { const du = u - (z0 + i * dZ), dv = v - 0.65; L += Math.exp(-(du * du * 2.2 + dv * dv * 1.1)); } return L; };
  const e2 = K.e[2];
  const fog = Z => 1 - Math.exp(-Z / 15);
  const fernP = B.pk(K.fern);
  for (let y = -M; y < H + M; y++) {
    const c = (y + 0.5 - vy) / h;
    for (let x = -M; x < W + M; x++) {
      const a = (x + 0.5 - vx) / h;
      // grob vorwärts, dann Halbierung auf dem letzten Stück
      const test = Z => { const X = a * Z, Y = 1 - c * Z, xo = Xo - bend * Z * Z, xi = Xi - bend * Z * Z;
        if (Y < 0) return 1; if (X > xo) return 2; if (X < xi) return 3; const q = (X - xi) / (xo - xi); if (Y > Yw + (Yc - Yw) * Math.sin(Math.PI * clamp(q, 0, 1))) return 4; return 0; };
      let Z = 0.25, Zp = 0.25, hit = test(Z), X = 0, Y = 0;
      while (!hit && Z < 60) { Zp = Z; Z *= 1.07; hit = test(Z); }
      if (hit) { for (let i = 0; i < 7; i++) { const Zm = (Zp + Z) / 2, hm = test(Zm); if (hm) { Z = Zm; hit = hm; } else Zp = Zm; } }
      X = a * Z; Y = 1 - c * Z;
      const k = h / Z; let col;
      const ziel = hit === 1 ? K.e[K.eb(y)] : e2;
      if (hit === 1) {
        // Boden: Ziegelpflaster im Fischgrät, Asche in den Fugen, Glutlicht von den Türen der Außenwand
        Z = 1 / c; X = a * Z;
        const uu = (X + Z) * 2.6, ww = (Z - X) * 2.6, bi = Math.floor(uu) + Math.floor(ww), quer = bi % 2 === 0;
        const f1 = quer ? fx(uu) : fx(ww), f2 = quer ? fx(ww * 0.5 + Math.floor(uu) * 0.5) : fx(uu * 0.5 + Math.floor(ww) * 0.5);
        const pxs = k / 2.6; let t = 0.28 + (B.hash(Math.floor(uu), Math.floor(ww), sd) - 0.5) * 0.1;
        const fuge = (pxs > 2.5 && (f1 < 1 / pxs || f2 < 0.5 / pxs));
        const xo = Xo - bend * Z * Z, L = doorLicht(Z * 1.0, 0.3) * Math.exp(-Math.max(0, xo - X) * 1.1);
        t += L * 0.32 - fog(Z) * 0.1;
        if (fuge) { col = rp(pA, 0.25 + L * 0.25 + (B.hash(x, y, sd) > 0.6 ? 0.1 : 0), x, y); }
        else col = rp(pZ, t + 0.05, x, y);
        // Asche-Verwehung am Fuß der Wände
        if (X > xo - 0.25 && B.fbm(Z * 2, X * 3, sd, 2) > 0.45) col = rp(pA, 0.4 + L * 0.2, x, y);
        if (fog(Z) > 0.55) col = B.pk(B.mix(B.unpk(col), K.fern, (fog(Z) - 0.55) * 1.8));
      } else if (hit === 2) {
        // Außenwand: Ziegel, Kammertüren mit weißer Glut, Rußfächer, Zahlen aus Strichen
        const u = Z, v = Y, td = tuer(u, v);
        if (td && !td.aus) {
          const depth = clamp(td.rand / 0.34, 0, 1), fl = B.fbm(u * 6 + 3, v * 4, sd + td.i, 2);
          let g = 0.62 + depth * 0.5 + fl * 0.15 - fog(Z) * 0.35 - (fr > 0.6 && td.i % 3 === 2 ? 0.6 : 0);
          if (td.rand * k < 1.2) g = 0.45 - fog(Z) * 0.2;
          col = rp(pG, g, x, y);
        } else {
          const L = doorLicht(u, v);
          let t = 0.36 + L * 0.42 + ziegel(u, v, k, 0.09, 0.26, sd);
          // Rußfächer über jeder Tür
          const i = Math.round((u - z0) / dZ), du = Math.abs(u - (z0 + i * dZ)); if (i >= 0 && v > 1.5 && du < 0.16 + (v - 1.5) * 0.55) t -= 0.42 * clamp((v - 1.5) * 3, 0, 1) * (0.75 + 0.25 * B.fbm(u * 8, v * 8, sd, 2));
          // Bogen aus Bindern um die Tür: helle Kante
          if (td && td.aus && i >= 0) { const dv = v - 1.22, dd = v > 1.22 ? Math.hypot(du, dv) : du; if (dd > 0.34 && dd < 0.34 + 0.07 && v > 0) t += 0.18; }
          // Strichzahl über der Tür (eingeritzt), nach hinten immer länger
          if (i >= 0 && Math.abs(v - 1.7) < 0.05 && k > 30) { const n = 3 + i * 2, sp = 0.035, x0 = -n * sp / 2; const o = u - (z0 + i * dZ) - x0; if (o > 0 && o < n * sp && fx(o / sp) < 0.4) t -= 0.25; }
          // falsches Detail vorn: eine Lage einzeln gesetzter Ziegel, hell, jeder mit dem Abdruck
          if (u < 3.0 && v > 0.05 && v < 0.3) t += 0.08;
          col = rp(pZ, t - fog(Z) * 0.35, x, y);
          if (fog(Z) > 0.5) col = B.pk(B.mix(B.unpk(col), K.fern, (fog(Z) - 0.5) * 1.6));
        }
      } else if (hit === 3) {
        // Innenwand: Ziegel, von den Türen gegenüber angeleuchtet; Gitterstapel davor als Lagen mit Lücken
        const u = Z, v = Y; let t = 0.22 + ziegel(u, v, k, 0.09, 0.26, sd + 1) + 0.18 * Math.exp(-Math.pow((fx((u - z0 + 0.85) / dZ) - 0.5) * 2.2, 2));
        if (v < 0.9 && u > 3 && k < 60 && fx((u - 0.4) / 3.4) < 0.42) { const gl = fx(v / 0.11) < 0.5, gu = fx(u / 0.14 + Math.floor(v / 0.11) * 0.5) < 0.35; if (gl && gu) { col = rp(pG, 0.32 - fog(Z) * 0.3, x, y); } else t += 0.06; }
        if (!col) col = rp(pZ, t - fog(Z) * 0.3, x, y);
        if (fog(Z) > 0.5) col = B.pk(B.mix(B.unpk(col), K.fern, (fog(Z) - 0.5) * 1.6));
      } else if (hit === 4) {
        // Gewölbe: Ringe aus Ziegeln quer, Ruß; Schürlöcher in der Mitte glühen
        const xo = Xo - bend * Z * Z, xi = Xi - bend * Z * Z, q = (X - xi) / (xo - xi);
        let t = 0.13 + (1 - Math.abs(q - 0.7) * 1.2) * 0.12 + (fx(Z / 0.32) < 0.5 / Math.max(1, k * 0.32) * 2 ? -0.08 : 0) + ziegel(q * 3, Z, k * 0.5, 0.16, 0.3, sd + 2) * 0.6;
        const sl = fx((Z - z0 - dZ / 2) / dZ); if (Math.abs(q - 0.5) < 0.05 && Math.abs(sl - 0.5) < 0.035 + 0.02 / Z) { col = rp(pG, 0.6 - fog(Z) * 0.4, x, y); }
        else col = rp(pZ, t - fog(Z) * 0.25, x, y);
        if (fog(Z) > 0.5) col = B.pk(B.mix(B.unpk(col), K.fern, (fog(Z) - 0.5) * 1.5));
      } else col = fernP;
      ziel.d[(y + M) * B.EW + x + M] = col;
    }
  }
  // Licht für die Figuren: die Türen rechts
  for (let i = 0; i < 4; i++) { const Z = z0 + i * dZ + dZ * 0; if (Z < 1.6) continue; const [tx, ty] = P.q(Xo - bend * Z * Z, 0.7, Z); K.licht(tx, ty, '#ffb050', 120 / i, 0.7); }
  // Funken aus den Türen, Asche in der Luft (fällt langsam)
  B.partikel(K, { n: 70, farben: [ASCHE[6], ASCHE[8], ASCHE[4]], vy: 4, vx: -1, wob: 2, wf: 0.4, p: 0.8, hellSelten: 1.2 });
  B.partikel(K, { n: 18, farben: [GLUT[6], GLUT[4]], x0: 300, x1: 480, y0: 90, y1: 200, vy: -10, vx: -4, wob: 3, wf: 2, blink: 3, p: 0.6 });
  // Nebel: ein schmales Ascheband hinten
  B.nebel(K.e[2], { y0: vy - 22, y1: vy + 4, col: ASCHE[5], dichte: 0.14, xs: [200, 330, 50], seed: 7 });
  // Vordergrund links: ein Stapel gebrannter Ziegel, angeschnitten; vorn liegen einzelne Ziegel mit Abdruck
  if (!cfg.ohneVorne) {
    const st = B.maske(); for (let i = 0; i < 9; i++) { const yy = 270 - i * 12, w = 34 - (i % 2) * 4; st.rect(-M, yy - 11, w + M + (i === 8 ? -6 : 0), 11); }
    K.form(5, st, 0, { k: pR, r: RAND_Z, ton: 1.4, fase: 1.5, rand: 2, muster: (x, y) => ((y % 12) === 0 ? -1.4 : (((x + ((y / 12) | 0) * 9) % 18) === 0 ? -1 : 0)) });
    vorneZiegel(K, [[96, 238], [126, 244], [440, 236]]);
  }
  K.reihen = [{ y: 168, skala: 0.9, nebel: 0.3 }, { y: 192, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}
// Einzelne Ziegel am Boden, groß genug, dass man den Abdruck sieht (Ringlinien, Narbe quer)
function vorneZiegel(K, lst) {
  for (const [x, y] of lst) {
    const m = B.maske(); m.poly([[x - 13, y - 4], [x + 11, y - 6], [x + 14, y + 1], [x - 10, y + 3]]);
    K.form(4, m, 0, { k: pZ.slice(2, 9), r: RAND_Z, ton: 3.4, fase: 1.5, rand: 2, schatten: 2 });
    const e = K.e[4]; const dk = pZ[2];
    for (let r = 1; r <= 4; r += 1.5) for (let a = 0; a < 6.28; a += 0.25) { const px = Math.round(x + Math.cos(a) * r * 1.4), py = Math.round(y - 1.5 + Math.sin(a) * r * 0.55); if (B.hash(px, py, 3) > 0.25) e.set(px, py, dk); }
    for (let i = -5; i <= 5; i++) e.set(x + i, Math.round(y - 1.5 - i * 0.3), pZ[7]);
  }
}

// ---------- Variante 1, Werkstatt, Ereignis: Die Lehmgrube ----------
// Terrassen in Ellipsen, die zusammen die Linien eines Fingerabdrucks bilden, mit der Narbe quer darüber.
function lehmgrube(K, cfg) {
  const sd = K.o.seed, fr = K.fr, vx = 250, vy = 84, P = B.persp(vx, vy), h = P.h;
  // Decke und Rückwand der Höhle: roter Lehm in Schichten, oben Ruß
  B.feld(K.e[0], -M, -M, W + M, vy + 4, ZIEGEL.slice(0, 7), (x, y) => 0.12 + 0.3 * (y / vy) + (B.fbm(x * 0.03, y * 0.09, sd, 3) - 0.5) * 0.3 + Math.max(0, 0.25 - Math.abs(x - 400) / 300));
  // Schichtlinien in der Rückwand
  for (let i = 0; i < 9; i++) { const yy = 20 + i * 10; for (let x = -M; x < W + M; x++) { const y = Math.round(yy + Math.sin(x * 0.02 + i) * 3 + (B.fbm(x * 0.05, i, sd, 2) - 0.5) * 4); if (y < vy) K.e[0].set(x, y, pZ[1]); } }
  // Grubenboden (Aufsicht): Fingerabdruck-Terrassen
  const cx0 = 0.4, cz0 = 2.75;
  const feld = (X, Z) => {
    const dx = (X - cx0) / 1.35, dz = (Z - cz0) / 1.1, r = Math.hypot(dx, dz), a = Math.atan2(dz, dx);
    const loop = r + 0.18 * Math.sin(a * 2 + r * 0.6) + (dz > 0 ? dz * 0.1 : 0); // Schlinge eines Abdrucks
    const nar = Math.abs((X - cx0) * 0.55 + (Z - cz0) * 0.85 - 0.35) < 0.08; // Narbe quer
    return { loop, nar, r };
  };
  const yu = 172;
  for (let y = vy; y < yu + 2; y++) {
    const Z = h / (y + 0.5 - vy), e = K.e[K.eb(y)];
    for (let x = -M; x < W + M; x++) {
      const X = (x + 0.5 - vx) * Z / h, k = h / Z;
      const F = feld(X, Z); let col;
      if (F.r > 2.6) { col = rp(pL, 0.3 + (B.fbm(X, Z, sd, 2) - 0.5) * 0.3 - (F.r - 2.6) * 0.05, x, y); }
      else {
        // Terrassen: jede Stufe tiefer und dunkler; die Kante (Stirn) zur Lichtseite hell wie Ziegel im Glutlicht,
        // dahinter Schatten; auf den Stufen Rohlinge in Reihen (Aschegrau)
        const ring = F.loop / 0.24, fr2 = fx(ring), stufe = Math.floor(ring);
        const tief = Math.max(0, 1 - F.r / 2.6);
        let t = 0.5 - tief * 0.3;
        const kante = fr2 < 0.2, schatten = fr2 > 0.82;
        const roh = !F.nar && fr2 > 0.36 && fr2 < 0.66 && k > 7 && fx(Math.atan2(Z - cz0, X - cx0) * (10 + stufe * 4) / 6.283) < 0.5;
        if (F.nar) col = rp(pR, 0.5, x, y);
        else if (kante) col = Z > cz0 - 0.15 ? rp(pZ, 0.62 - tief * 0.2, x, y) : rp(pL, 0.12, x, y);
        else if (roh) col = rp(pA, 0.62 - tief * 0.25, x, y);
        else col = rp(pL, t - (schatten ? 0.25 : 0) + (B.hash(x >> 1, y, sd) - 0.5) * 0.05, x, y);
      }
      e.d[(y + M) * B.EW + x + M] = col;
    }
  }
  // Rückwand der Grube: eine Steilwand aus rotem Lehm bis an die oberste Terrasse, mit Bänken und Rohlingen
  const kl = x => 116 + Math.round(Math.sin(x * 0.021 + sd) * 4 + Math.sin(x * 0.07) * 2);
  B.feld(K.e[2], -M, -M, W + M, 124, ZIEGEL, (x, y) => { if (y > kl(x)) return -1; const bank = (y - 30) % 26; let t = 0.2 + (y / 120) * 0.28 + (B.fbm(x * 0.04, y * 0.12, sd + 3, 3) - 0.5) * 0.28 + Math.max(0, 0.3 - Math.abs(x - 414) / 260);
    if (y > 30 && bank < 2) t += 0.22; else if (y > 30 && bank < 4) t -= 0.14; if (Math.abs(x - 300 + y * 0.6) < 1.2 && y > 40) t -= 0.25; return t; });
  for (let j = 0; j < 3; j++) for (let i = 0; i < 70; i++) { const x = Math.round(8 + i * 6.6 + (j % 2) * 3 + (B.hash(i, j + 9, sd) - 0.5) * 2), y = 30 + j * 26 - 3; if (x > 360 && j === 0) continue; if (B.hash(i, j, sd) < 0.3) continue;
    // Rohling auf der Bank: Oberseite hell, Stirn mittel, Schatten darunter; manche hochkant
    const hoch = B.hash(i, j + 3, sd) > 0.75, w = hoch ? 2 : 4, hh = hoch ? 4 : 2; K.e[2].rect(x, y - (hh - 2), w, 1, pA[8 - j]); K.e[2].rect(x, y + 1 - (hh - 2), w, hh - 1, pA[6 - j]); K.e[2].rect(x, y + 2, w + 1, 1, pZ[1]); }
  for (let x = -M; x < W + M; x++) { const y = kl(x); K.e[2].set(x, y, pZ[8]); K.e[2].set(x, y - 1, pZ[6]); }
  // Rand der Grube, Boden vorn: gestampfter Lehm mit Fußspuren und Pfoten
  const vorn = B.persp(vx, vy);
  K.boden(yu, H + M, LEHM, (x, y) => { const Z = vorn.z(y + 0.5), X = (x - vx) * Z / vorn.h; let t = 0.38 + (B.fbm(X * 1.4, Z * 1.4, sd + 4, 3) - 0.5) * 0.35 + Math.max(0, (y - 200) / 300);
    const sp = (fx(Z * 1.6) < 0.18 && Math.abs(X + 0.6 + Math.sin(Z * 3) * 0.08) < 0.07) || (fx(Z * 1.7 + 0.3) < 0.15 && Math.abs(X - 0.9) < 0.05); if (sp) t -= 0.22;
    // Trockenboden: Rohlinge in Reihen, die als Fluchtlinien zur Grube laufen; jeder vorn mit Schattenkante
    const reihe = Math.round(X / 0.62), dx = X - reihe * 0.62, fz = fx(Z / 0.3 + reihe * 0.37);
    if (Math.abs(reihe) <= 4 && reihe !== 0 && Math.abs(dx) < 0.13 && fz > 0.15 && fz < 0.62 && B.hash(reihe, Math.floor(Z / 0.3 + reihe * 0.37), sd) > 0.18) t = fz < 0.24 ? 0.18 : 0.78 + (dx > 0.08 ? 0.12 : 0);
    return t; });
  // Kante der Grube: helle Lippe
  for (let x = -M; x < W + M; x++) { const y = yu + Math.round(Math.sin(x * 0.03) * 2); K.e[K.eb(y)].set(x, y, pA[7]); K.e[K.eb(y + 1)].set(x, y + 1, pA[4]); K.e[K.eb(y + 2)].set(x, y + 2, pL[1]); }
  // Kuppelofen oben rechts auf der höchsten Terrasse: weißer Mund (Gegenlicht), Rauch steigt und knickt
  const ox = 414, oy = 55;
  const of = B.maske(); of.fn(ox - 34, oy - 46, ox + 34, oy, (x, y) => ((x - ox) / 30) ** 2 + ((y - oy) / 44) ** 2 <= 1); of.rect(ox - 34, oy - 4, 68, 6);
  K.form(2, of, 0.1, { k: pZ.slice(1, 8), r: RAND_Z, ton: 2.6, fase: 2, rand: 2, schatten: 2, verlauf: 0.5, muster: (x, y) => ((y % 5) === 0 ? -0.8 : (((x + ((y / 5) | 0) * 4) % 9) === 0 ? -0.5 : 0)) });
  for (let y = oy - 18; y < oy; y++) for (let x = ox - 10; x <= ox + 10; x++) { const dy = oy - y; if (dy > 10 && Math.hypot(x - ox, dy - 10) > 10) continue; const q = Math.min(10 - Math.abs(x - ox), dy > 10 ? 10 - Math.hypot(x - ox, dy - 10) : 9); K.e[2].set(x, y, rp(pG, 0.55 + q * 0.06, x, y)); }
  for (const L of [K.e[0], K.e[1], K.e[2]]) B.gluehen(L, ox, oy - 8, 90, '#5a2a10', 0.7);
  K.licht(ox, oy - 8, '#ffc070', 200, 0.9);
  B.partikel(K, { n: 40, farben: [ASCHE[5], ASCHE[7]], x0: ox - 8, x1: ox + 30, y0: -M, y1: oy - 46, vy: -6, vx: 2, wob: 4, wf: 0.4, p: 0.1 });
  // Trockengerüst links fern: Regal mit Rohlingen
  const tg = B.maske(); for (let i = 0; i < 5; i++) { tg.rect(18 + i * 22, 36, 2, 52); } for (let j = 0; j < 3; j++) tg.rect(16, 44 + j * 16, 92, 2);
  K.form(2, tg, 0.15, { k: pZ.slice(0, 5), r: RAND_Z, ton: 1.6, fase: 0, rand: 1 });
  for (let j = 0; j < 3; j++) for (let i = 0; i < 14; i++) { const x = 20 + i * 6.4, y = 40 + j * 16; K.e[2].rect(x, y, 5, 3, rp(pA, 0.55 + (i % 3) * 0.05, x, y)); }
  // Ziegelform aus Holz und Spaten vorn (Werkstatt hat stattdessen die Bank)
  if (!cfg.ohneVorne) {
    const sp2 = B.maske(); sp2.kap(452, 262, 462, 196, 1.6, 1.4); sp2.poly([[455, 196], [470, 196], [471, 214], [462, 222], [455, 214]]); sp2.kap(458, 196, 466, 192, 2, 2);
    K.form(5, sp2, 0, { k: pR, r: RAND_Z, ton: 1.4, fase: 1, rand: 2 });
    vorneZiegel(K, [[60, 236], [88, 248]]);
  }
  B.partikel(K, { n: 50, farben: [ASCHE[6], ASCHE[8]], vy: 3, vx: 1, wob: 2, wf: 0.4, p: 0.8 });
  B.nebel(K.e[2], { y0: vy - 6, y1: vy + 12, col: ASCHE[4], dichte: 0.25, xs: [0, 480, 80], seed: 3 });
  K.split = [150, 168];
  K.reihen = [{ y: 176, skala: 0.9, nebel: 0.25 }, { y: 196, skala: 1, nebel: 0.1 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [250, 212], P };
}

// ---------- Variante 2 und Rast: In der Kammer ----------
// Frontal: die Rückwand ist ein Gitter aus gestapelten Rohlingen, durch die Lücken scheint weiße Glut.
function kammer(K, cfg) {
  const sd = K.o.seed, fr = K.fr, vy = 152, vx = 240, P = B.persp(vx, vy);
  const dunkel = !!cfg.dunkel, e1 = K.e[1], e0 = K.e[0];
  // Glut hinter dem Gitter (Ebene 0): weiß in der Mitte, rot an den Rändern; in der Rast heruntergebrannt
  B.feld(e0, -M, -M, W + M, vy + 2, GLUT, (x, y) => { const q = Math.hypot((x - 250) / 260, (y - 90) / 120); return (dunkel ? 0.35 : 0.88) - q * 0.6 + (B.fbm(x * 0.03, y * 0.03, sd, 2) - 0.5) * 0.25; });
  // Gitter: Lagen aus Rohlingen, abwechselnd Läufer (lange Flächen mit Lücken) und Köpfe (kurze Stirnseiten)
  const gx0 = 70, gx1 = 430, gy0 = 26, gy1 = vy;
  const fehlt = (x, y) => Math.abs(x - 250) < 8 && Math.abs(y - 92) < 4;
  for (let y = gy0; y < gy1; y++) {
    const lage = Math.floor((y - gy0) / 7), fy = (y - gy0) % 7, laeufer = lage % 2 === 0;
    for (let x = gx0; x < gx1; x++) {
      const per = laeufer ? 22 : 11, off = laeufer ? (lage % 4 === 0 ? 0 : 11) : 3, fxp = ((x - gx0 + off) % per + per) % per;
      const luecke = laeufer ? fxp >= 17 : fxp >= 7;
      if (fy === 6 || luecke || fehlt(x, y)) {
        if (fehlt(x, y) && fr >= 0.5) { e1.set(x, y, Math.abs(x - 250) < 3 && y > 90 ? pL[5] : pR[0]); continue; }
        if (fehlt(x, y)) { e1.set(x, y, pR[0]); continue; }
        continue; // Lücke: Glut von hinten scheint durch
      }
      const lit = (fxp === 0 || fy === 0) ? 0.18 : 0; const nahLuecke = laeufer ? fxp >= 15 : fxp >= 5;
      let t = 0.35 + lit + (nahLuecke && !dunkel ? 0.2 : 0) + (B.hash(Math.floor((x - gx0 + off) / per), lage, sd) - 0.5) * 0.12 - Math.abs(x - 250) / 900;
      // Abdruck in jedem dritten Rohling (Ringlinien)
      if (laeufer && fy > 1 && fy < 5 && Math.abs(fxp - 8) < 3 && (Math.floor((x - gx0 + off) / per) + lage) % 3 === 0 && ((Math.round(Math.hypot(fxp - 8, (fy - 3) * 1.6))) % 2 === 0)) t -= 0.12;
      e1.set(x, y, rp(dunkel ? pZ : pA, dunkel ? t * 0.8 : t, x, y));
    }
  }
  // Seitenwände und Gewölbe: gemauert, schräg in die Tiefe (Leibung), mit Ruß
  // Leibung der Kammer: Seitenwände und Gewölbe, gemauert, in die Tiefe zum Gitter, vom Gitter her angeleuchtet
  for (let y = -M; y < vy; y++) for (let x = -M; x < W + M; x++) {
    if (x >= gx0 && x < gx1 && y >= gy0) continue;
    let t, u, vv;
    const tl = x < gx0 ? (gx0 - x) / (gx0 + M) : x >= gx1 ? (x - gx1) / (W + M - gx1) : 0, tt = y < gy0 ? (gy0 - y) / (gy0 + M) : 0;
    const seitlich = tl * 1.1 > tt * 1.6;
    if (seitlich) { const sc = 1 + tl * 2.6; vv = (vy - y) / sc; u = Math.log(sc) * 22; t = 0.5 - tl * 0.32; }
    else { const sc = 1 + tt * 2.6; vv = (x - vx) / sc + 300; u = Math.log(sc) * 22; t = 0.34 - tt * 0.3; }
    const lage = Math.floor(vv / 5), fv = vv / 5 - lage, fu = fx(u / 3 + (lage % 2) * 0.5);
    t += (B.hash(Math.floor(u / 3 + (lage % 2) * 0.5), lage, sd) - 0.5) * 0.12;
    if (fv < 0.2) t -= 0.22; else if (fv > 0.8) t += 0.06; if (fu < 0.12) t -= 0.18;
    // Kante zum Gitter: Randlicht
    if ((x === gx0 - 1 || x === gx1) && y >= gy0) t += 0.35; if (y === gy0 - 1 && x >= gx0 && x < gx1) t += 0.35;
    if (dunkel) t -= 0.18;
    K.e[2].d[(y + M) * B.EW + x + M] = rp(pZ, t, x, y);
  }
  // Schürlöcher im Gewölbe: drei Lichtpunkte
  for (const sx of [160, 250, 340]) { K.e[2].rect(sx - 2, 10, 5, 3, pG[dunkel ? 3 : 6]); K.e[2].set(sx, 11, pG[dunkel ? 4 : 8]); B.gluehen(K.e[2], sx, 12, 16, '#4a1a08', 0.8); }
  // Boden: Ziegelpflaster frontal, lange Fugen zur Mitte
  K.boden(vy, H + M, ZIEGEL.slice(1, 9), (x, y) => { const Z = P.z(y + 0.5), X = (x - vx) * Z / P.h, k = P.k(Z); let t = 0.3 + (dunkel ? -0.1 : 0.1) * (1 - Math.min(1, Z / 6)) + (B.hash(Math.floor(X / 0.5 + Math.floor(Z / 0.25) * 0.5), Math.floor(Z / 0.25), sd) - 0.5) * 0.12;
    if (fx(Z / 0.25) * 0.25 * k * k / P.h < 0.9 || fx(X / 0.5 + Math.floor(Z / 0.25) * 0.5) * 0.5 * k < 1) t -= 0.18; return t; });
  K.bodenDith(-M, vy, W + M, H + M, ASCHE[4], (x, y) => { const Z = P.z(y + 0.5), X = (x - vx) * Z / P.h; return clamp((B.fbm(X * 2, Z * 2, sd + 1, 2) - 0.55) * 3, 0, 0.4); });
  if (!dunkel) { for (const L of [K.e[3], K.e[4]]) B.gluehen(L, 250, vy + 6, 160, '#3a1608', 0.6); K.licht(250, 90, '#ffd080', 260, 0.9); }
  else K.licht(250, 90, '#a04010', 200, 0.5);
  // Vordergrund: angeschnittene Stapel links und rechts
  for (const [x0, x1] of [[-M, 30], [452, W + M]]) { const st = B.maske(); for (let i = 0; i < 11; i++) { const yy = 270 - i * 9; st.rect(x0 + (i % 2) * 2, yy - 8, x1 - x0 - (i % 3), 8); } K.form(5, st, 0, { k: pR, r: RAND_Z, ton: 1.4, fase: 1, rand: 2, muster: (x, y) => ((y % 9) === 0 ? -1.4 : 0) }); }
  vorneZiegel(K, [[110, 240], [380, 246]]);
  B.partikel(K, { n: 40, farben: [ASCHE[6], GLUT[5]], vy: -3, wob: 2, wf: 0.3, p: 0.7, blink: 0.6, hellSelten: 3 });
  K.reihen = [{ y: 170, skala: 0.9, nebel: 0.2 }, { y: 192, skala: 1, nebel: 0.08 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}

// ---------- Wächter und Übergang: Vor der Feuertür ----------
// Hinter dem Wächter die Aschewand (ruhig, mittelhell, kühl), links und rechts Kammertüren mit weißer Glut.
function vorDerTuer(K, cfg) {
  const sd = K.o.seed, fr = K.fr, vy = 166, vx = 240, P = B.persp(vx, vy);
  const ende = !!cfg.ende;
  // Mauer: Ziegel frontal, von den Türen angeleuchtet
  const tueren = [[52, 150], [128, 156], [352, 156], [428, 150]];
  B.feld(K.e[1], -M, -M, W + M, vy + 2, ZIEGEL, (x, y) => {
    let L = 0; for (const [tx] of tueren) L += Math.exp(-((x - tx) ** 2) / 1800 - ((y - 120) ** 2) / 4000);
    const lage = Math.floor(y / 6), fv = y % 6, nr = Math.floor(x / 16 + (lage % 2) * 0.5), fu = fx(x / 16 + (lage % 2) * 0.5);
    let t = 0.28 + L * 0.42 + (B.hash(nr, lage, sd) - 0.5) * 0.1 - (y < 30 ? 0.15 : 0); if (fv === 0) t -= 0.25; else if (fv === 1) t += 0.06; if (fu < 1 / 16) t -= 0.2;
    for (const [tx] of tueren) { const dx = Math.abs(x - tx); if (y < 92 && dx < 10 + (92 - y) * 0.35) t -= 0.35 * Math.min(1, (92 - y) / 20); }
    return t; });
  // Kammertüren mit weißer Glut und Binderbogen
  for (const [tx, ty] of tueren) {
    const tw = 14, th = 44, m = B.maske(); m.fn(tx - tw, ty - th - tw, tx + tw, ty, (x, y) => (y > ty - th ? Math.abs(x - tx) <= tw : Math.hypot(x - tx, y - (ty - th)) <= tw));
    for (let y = ty - th - tw; y <= ty; y++) for (let x = tx - tw; x <= tx + tw; x++) { if (!m.has(x, y)) continue; const d = Math.min(tw - Math.abs(x - tx), y < ty - th ? tw - Math.hypot(x - tx, y - (ty - th)) : 99); K.e[1].set(x, y, rp(pG, (ende ? 0.25 : 0.55) + Math.min(1, d / 9) * 0.45 + (B.fbm(x * 0.2, y * 0.1, sd, 2) - 0.5) * 0.2, x, y)); }
    const bo = B.maske(); bo.fn(tx - tw - 5, ty - th - tw - 5, tx + tw + 5, ty, (x, y) => { const d = y > ty - th ? Math.abs(x - tx) : Math.hypot(x - tx, y - (ty - th)); return d > tw && d <= tw + 4; });
    K.form(1, bo, 0, { k: pZ.slice(3, 10), r: RAND_Z, ton: 3.2, fase: 1, rand: 2, muster: (x, y) => ((Math.round(Math.atan2(y - ty + th, x - tx) * 7) % 2) ? -0.6 : 0.3) });
    for (const L of [K.e[1], K.e[2], K.e[3]]) B.gluehen(L, tx, ty - 20, 60, '#4a1c08', ende ? 0.3 : 0.7);
    K.licht(tx, ty - 24, '#ffb050', 90, ende ? 0.3 : 0.6);
  }
  // Großer Bogen in der Mitte; darin die Aschewand (Wächter) oder die offene letzte Kammer (Übergang)
  const bx = 240, bw = 104, bt = 60, bunt = vy + 1;
  const imBogen = (x, y) => y <= bunt && (y > bt ? Math.abs(x - bx) <= bw : Math.hypot(x - bx, (y - bt) * 1.15) <= bw);
  if (!ende) {
    B.feld(K.e[1], bx - bw - 2, bt - bw, bx + bw + 2, bunt + 1, ASCHE, (x, y) => { if (!imBogen(x, y)) return -1;
      return 0.6 + 0.08 * (1 - Math.abs(x - bx) / bw) - (y - 20) / 900 + (B.fbm(x * 0.012, y * 0.02, sd + 9, 2) - 0.5) * 0.12 + (fx(x / 23 + B.rausch1(y * 0.05, sd) * 0.3) < 0.05 ? -0.05 : 0) - fr * 0.06; });
    // Asche rieselt am Bogen herab (ruhig)
    B.partikel(K, { n: 50, farben: [ASCHE[8], ASCHE[9]], x0: bx - bw, x1: bx + bw, y0: bt - 60, y1: bunt, vy: 6, wob: 1, wf: 0.3, p: 0.05, hellSelten: 1.5 });
  } else {
    // Übergang: die letzte Kammer, die Glut ist schwarz; unten ein ausgemauerter Schacht mit Wendel, von unten kalt
    B.feld(K.e[1], bx - bw - 2, bt - bw, bx + bw + 2, bunt + 1, RUSS, (x, y) => (imBogen(x, y) ? 0.3 + (B.fbm(x * 0.05, y * 0.05, sd, 2) - 0.5) * 0.4 : -1));
  }
  const bogen = B.maske(); bogen.fn(bx - bw - 12, bt - bw - 12, bx + bw + 12, bunt, (x, y) => { const d = y > bt ? Math.abs(x - bx) : Math.hypot(x - bx, (y - bt) * 1.15); return d > bw && d <= bw + 10; });
  K.form(2, bogen, 0, { k: pZ.slice(2, 10), r: RAND_Z, ton: 3, fase: 2, rand: 2, schatten: 3, muster: (x, y) => { const a = Math.atan2((y - bt) * 1.15, x - bx); return (Math.round(a * 16) % 2 ? -0.7 : 0.2) + (y > bt && ((y >> 2) % 2) ? -0.3 : 0); } });
  // Boden: Kreis aus gebrannten Ziegeln um den Wächter, Asche
  K.boden(vy, H + M, ZIEGEL.slice(1, 9), (x, y) => { const Z = P.z(y + 0.5), X = (x - vx) * Z / P.h, k = P.k(Z); const r = Math.hypot(X / 1.0, (Z - 2.4) / 0.7), a = Math.atan2(Z - 2.4, X);
    let t = 0.26 + (B.fbm(X * 1.5, Z * 1.5, sd + 2, 2) - 0.5) * 0.2; if (r > 0.6 && r < 1.45) { t += 0.18; if (fx(a * 16 / 6.283) * r * k * 0.4 < 1 || fx(r / 0.28) * 0.28 * k < 0.8) t -= 0.25; } if (r > 1.45 && r < 1.55) t += 0.3; return t + Math.max(0, 0.2 - Math.abs(y - vy - 6) / 40); });
  K.bodenDith(-M, vy, W + M, H + M, ASCHE[5], (x, y) => { const Z = P.z(y + 0.5), X = (x - vx) * Z / P.h; return clamp((B.fbm(X * 1.2, Z * 1.2, sd + 6, 2) - 0.56) * 3, 0, 0.35); });
  if (ende) {
    const [sx, sy] = P.q(0, 0, 2.6), kk = P.k(2.6);
    for (let i = 0; i < 8; i++) { const rw = kk * (0.9 - i * 0.08), ry = rw * 0.3; const m = B.maske(); m.ell(sx, sy + i * 3, rw, ry); m.ell(sx, sy + i * 3 + 2, rw - 3, ry - 1, 0); K.form(4, m, 0, { k: pZ.slice(1, 8 - Math.min(5, i)), r: i < 2 ? RAND_Z : [], ton: 2.4 - i * 0.25, fase: 0, rand: 1, muster: (x) => (((x >> 2) + i) % 2 ? -0.4 : 0) }); }
    const sch = B.maske(); sch.ell(sx, sy + 26, kk * 0.28, kk * 0.08); B.form(K.e[4], sch, { k: pK2.slice(0, 3), ton: 1.6, fase: 0, rand: 0 });
    B.gluehen(K.e[4], sx, sy + 24, kk * 0.6, '#1a3048', 0.8);
    K.licht(sx, sy + 20, '#7aa0c4', 120, 0.6);
    B.partikel(K, { n: 24, farben: [KALT[5], KALT[4]], x0: sx - 30, x1: sx + 30, y0: sy - 40, y1: sy + 24, vy: -8, wob: 2, wf: 0.6, p: 0.5, blink: 0.8 });
  }
  // Vordergrund: oben ein Rand des Gewölbes, unten links und rechts Stapel
  const v = B.maske(); v.rect(-M, -M, W + 2 * M, 12); for (let i = 0; i < 34; i++) v.rect(i * 15 - 10 + (i % 2) * 7, 11, 13, 4 + (i % 3));
  K.form(5, v, 0, { k: pR, r: RAND_Z, ton: 1.2, fase: 1.5 });
  for (const [x0, x1] of [[-M, 24], [458, W + M]]) { const st = B.maske(); for (let i = 0; i < 7; i++) { const yy = 270 - i * 10; st.rect(x0 + (i % 2) * 3, yy - 9, x1 - x0 - (i % 2) * 3, 9); } K.form(5, st, 0, { k: pR, r: RAND_Z, ton: 1.4, fase: 1, rand: 2, muster: (x, y) => ((y % 10) === 0 ? -1.4 : 0) }); }
  B.partikel(K, { n: 30, farben: [ASCHE[6], GLUT[5]], vy: 3, wob: 2, wf: 0.3, p: 0.8, blink: 0.4, hellSelten: 3 });
  B.nebel(K.e[2], { y0: vy - 22, y1: vy + 6, col: ASCHE[6], dichte: 0.22, xs: [0, 480, 80], seed: 4 });
  K.reihen = [{ y: 180, skala: 0.9, nebel: 0.25 }, { y: 198, skala: 1, nebel: 0.1 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 212], P };
}

// Krämer: der Schreiber der Legion vor einer kalten Kammertür: Pult, Wachstafeln, Waage, Ziegelstapel, Lampe
function schreiber(K, x0, y0) {
  // in Ortskoordinaten (0,0 = Bodenpunkt), um S vergrößert gesetzt
  const S = 1.6, P = (px, py) => [x0 + px * S, y0 + py * S];
  const sk = m => ({ rect: (x, y, w, h) => m.poly([P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)]), poly: pts => m.poly(pts.map(([u, v]) => P(u, v))), kap: (a, b, c, d, r1, r2) => m.kap(...P(a, b), ...P(c, d), r1 * S, r2 * S), ell: (x, y, rx, ry) => m.ell(...P(x, y), rx * S, ry * S) });
  const m0 = B.maske(), m = sk(m0);
  m.rect(-20, -26, 30, 26); m.poly([[-24, -30], [14, -34], [14, -28], [-24, -24]]); // Pult aus Ziegeln mit Schräge
  for (let i = 0; i < 5; i++) m.rect(22 + (i % 2) * 2, -8 - i * 6, 22, 5); // Stapel gestempelter Ziegel
  m.kap(-46, 0, -46, -40, 1.2, 1.2); m.rect(-62, -42, 32, 2); m.kap(-60, -40, -60, -30, 0.6, 0.6); m.kap(-32, -40, -32, -26, 0.6, 0.6);
  m.ell(-60, -29, 6, 2); m.ell(-32, -25, 6, 2); m.rect(-50, -2, 8, 3); // Waage, die rechte Schale tiefer
  K.form(4, m0, 0, { k: pZ.slice(1, 8), r: RAND_Z, ton: 2.4, fase: 1, rand: 2, schatten: 2, muster: (px, py) => ((Math.round((py - y0) / S) % 6) === 0 && px > x0 + 20 * S ? -1.2 : 0) });
  const t0 = B.maske(), tf = sk(t0); for (let i = 0; i < 3; i++) tf.poly([[-18 + i * 10, -30 - i * 1.2], [-10 + i * 10, -31 - i * 1.2], [-10 + i * 10, -36 - i * 1.2], [-18 + i * 10, -35 - i * 1.2]]);
  K.form(4, t0, 0, { k: LEHM.slice(2, 8).map(B.pk), r: RAND_A, ton: 2.6, fase: 0, rand: 1 });
  const [lx, ly] = P(8, -38);
  B.flamme(K, Math.round(lx), Math.round(ly), { p: 0.5, kern: '#fff4d0', mitte: '#ffb040', aussen: '#a05010', glut: '#3a1406', gross: 1.3 });
  for (const L of [K.e[3], K.e[4]]) B.gluehen(L, lx, ly + 2, 70, '#4a2008', 0.8);
  const sh = B.maske(); sh.ell(x0, y0 + 2, 60 * S / 1.6, 3); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
}
// Fund und Ereignis: eine Ziegelform aus Holz, darin ein Rohling, dessen Abdruck kurz aufglimmt
function form(K, x, y) {
  const m = B.maske(); m.poly([[x - 18, y - 6], [x + 14, y - 9], [x + 18, y - 1], [x - 14, y + 2]]); m.poly([[x - 15, y - 5], [x + 12, y - 7], [x + 15, y - 1], [x - 12, y + 1]], 0);
  K.form(4, m, 0, { k: pR, r: RAND_Z, ton: 2.2, fase: 0.5, rand: 2, schatten: 2 });
  const ro = B.maske(); ro.poly([[x - 14, y - 5], [x + 11, y - 7], [x + 14, y - 1], [x - 11, y + 1]]);
  K.form(4, ro, 0, { k: pL.slice(2, 8), r: RAND_A, ton: 3, fase: 0, rand: 1 });
  const sh = B.maske(); sh.ell(x, y + 3, 22, 2.5); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  B.gluehen(K.e[4], x, y - 3, 22, '#4a1c08', 0.8);
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { const a = Math.sin(t * 1.3); if (a < 0.2) return; ctx.fillStyle = a > 0.7 ? GLUT[7] : GLUT[5]; for (let r = 1; r <= 3; r++) for (let k = 0; k < 8; k++) { const w = k / 8 * 6.28; ctx.fillRect(Math.round(x + Math.cos(w) * r * 1.6) + ox, Math.round(y - 3 + Math.sin(w) * r * 0.6) + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 2 : art === 'kraemer' ? 0 : art === 'werkstatt' || art === 'ereignis' || art === 'fund' ? 1 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = vorDerTuer(K, {});
  else if (art === 'uebergang') info = vorDerTuer(K, { ende: true });
  else if (art === 'rast') info = kammer(K, { dunkel: true });
  else if (art === 'kraemer') info = ringofen(K, { vx: 330, ohneVorne: true });
  else if (art === 'werkstatt' || art === 'ereignis' || art === 'fund') info = lehmgrube(K, { ohneVorne: art === 'werkstatt' });
  else info = [c => ringofen(c, {}), c => lehmgrube(c, {}), c => kammer(c, {})][v](K);
  if (art === 'fund' || art === 'ereignis') form(K, info.mitte[0], info.mitte[1]);
  else if (art === 'kraemer') schreiber(K, info.mitte[0] + 10, info.mitte[1] + 6);
  else if (art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.ziegelgruben = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 3, knick: 0.4, stein: ['#441f11', '#6c331a', '#843f21', '#cc6d3b'] } };
if (World.BIOME.indexOf('ziegelgruben') < 0) World.BIOME.push('ziegelgruben');
})();
