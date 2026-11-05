// Saltmoor 1925 · Hintergründe: Akt II, Das Waisenhaus am Deich (Biom-Paket waisenhaus).
// Komposition: docs/auftrag-2/biome/waisenhaus.md
// Ort: ein Waisenhaus von 1890 auf dem Deich hinter Saltmoor, seit der Sturmflut von 1913 voll belegt. Gekalkte
// Wände, Linoleum in Ocker, Eisenbetten. Das Licht kommt kalt und grau durch hohe Fenster (Sturm, Regen), dazu ein
// einziges rotes Licht: das Nachtlicht über der Tür zum Schlafsaal. Wahrzeichen: der Schlafsaal mit vierzig
// gemachten Betten, über jedem eine Nummer. Falsches Detail: Die Nummern gehen weiter, wo keine Betten mehr stehen,
// auf jedem Kissen ist ein nasser Fleck, und am Ende der Reihe stehen mehr Kinder, als Betten da sind.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060708', '#0d0f12', '#171a1f', '#252a31'], rand: ['#7a8792', '#e2e8e6'], augen: '#ff3b2b', nebel: ['#14171b', '#2c3238'], fern: '#3a4046' };
const KALK = ['#0b0c0e', '#131518', '#1b1e21', '#24282b', '#2f3336', '#3b3f42', '#494d4f', '#585b5c', '#6a6c6b', '#7f807d'];
const SOCKEL = ['#08090a', '#0e1012', '#15181b', '#1c2024', '#252a2f', '#30363b'];
const LINO = ['#0b0806', '#140f09', '#1d150c', '#271c10', '#332414', '#402d18', '#4f381d', '#614524', '#76552c'];
const STURM = ['#1c232a', '#28313a', '#36414c', '#46525e', '#596673', '#6f7c88', '#8995a0', '#a6b0b8'];
const EISEN = ['#060708', '#0c0e10', '#14171a', '#1d2125', '#282d32', '#353b41'];
const LEINEN = ['#1a1c1e', '#25282a', '#313436', '#3e4143', '#4d5051', '#5e6061', '#717272'];
const DECKE = ['#0c0e10', '#13161a', '#1b1f24', '#242930', '#2e343b'];
const HOLZ = ['#0a0807', '#120e0b', '#1a1410', '#231b15', '#2e231b', '#3a2c22'];
const RAND = ['#7a8792', '#e2e8e6'], RAND_D = ['#4a535c', '#9aa4ac'];
const ROT = '#ff3b2b', ROTG = '#3a0c08', NASS = '#2c3c48', NASS2 = '#3f5868';

// ---------- Raum mit Fluchtpunkt: Wände, Decke, Stirnwand als Strahl durch jedes Pixel ----------
// cfg: xl, xr (Wände), yc (Decke, in Augenhöhen), ze (Stirnwand), sockel (Höhe der Ölfarbe), fenster: [{Z0,Z1,Y0,Y1}] rechts
function raum(K, P, cfg) {
  const sd = K.o.seed, xl = cfg.xl, xr = cfg.xr, yc = cfg.yc, ze = cfg.ze, so = cfg.sockel || 0.85;
  const hell = cfg.hell || 0;
  B.feld(K.e[0], -M, -M, W + M, H + M, KALK, (x, y) => {
    const dx = x + 0.5 - P.vx, dy = y + 0.5 - P.vy;
    // Kandidaten: linke Wand, rechte Wand, Decke, Stirnwand (der Boden kommt danach auf eigene Ebenen)
    let Z = ze, flaeche = 'stirn';
    if (dx < 0) { const z = xl * P.h / dx; if (z > 0 && z < Z) { Z = z; flaeche = 'links'; } }
    if (dx > 0) { const z = xr * P.h / dx; if (z > 0 && z < Z) { Z = z; flaeche = 'rechts'; } }
    if (dy < 0) { const z = (1 - yc) * P.h / dy; if (z > 0 && z < Z) { Z = z; flaeche = 'decke'; } }
    const Y = 1 - dy * Z / P.h, X = dx * Z / P.h;
    let t;
    if (flaeche === 'decke') { t = 0.12 + Math.min(0.15, 1 / Z) + ((Math.floor(Z * 1.2) & 1) ? 0 : 0.04); if (Math.abs(Z * 1.2 - Math.round(Z * 1.2)) < 0.06 * Z * 0.4) t -= 0.08; }
    else if (flaeche === 'stirn') { t = 0.5 + hell * 0.2 - (Y < so ? 0.25 : 0) - Math.abs(X) * 0.02; }
    else if (flaeche === 'links') { t = 0.56 + hell * 0.2 - Z * 0.012 - (Y < so ? 0.3 : 0) - Math.max(0, Y - 1.8) * 0.12; if (cfg.wandFlecken) for (const [z0, z1, y0, y1] of cfg.wandFlecken) { const sh = (Y - y0) * 0.35; if (Z > z0 + sh && Z < z1 + sh && Y > y0 && Y < y1) t += 0.14; } }
    else { t = 0.36 - Z * 0.01 - (Y < so ? 0.2 : 0) - Math.max(0, Y - 1.8) * 0.1; }
    // Sockelkante: Lichtlinie
    if (flaeche !== 'decke' && Math.abs(Y - so) < 0.012 * Z) t += 0.12;
    // Kalk: leicht fleckig, Stockflecken unten (Feuchte vom Deich)
    t += (B.fbm(x * 0.03, y * 0.03, sd + 4, 2) - 0.5) * 0.06;
    if (flaeche !== 'decke' && Y < so + 0.5 && Y > so) t -= Math.max(0, B.fbm((flaeche === 'stirn' ? X : Z) * 2, Y * 3, sd + 9, 3) - 0.58) * 0.8;
    return t;
  });
}
// Punkt im Raum -> Bild
const Q = (P, X, Y, Z) => P.q(X, Y, Z);
function quad(P, pts) { return pts.map(([X, Y, Z]) => Q(P, X, Y, Z)); }
// Wand-Rechteck (Fläche in der Wand X = xw) als Maske
function wandRechteck(P, m, xw, Y0, Y1, Z0, Z1) { m.poly(quad(P, [[xw, Y0, Z0], [xw, Y1, Z0], [xw, Y1, Z1], [xw, Y0, Z1]])); return m; }
// Fenster in der rechten Wand: Sturmhimmel, Sprossen, Regen (animiert), Lichtfleck auf dem Boden
function fenster(K, P, eb, xw, Z0, Z1, Y0, Y1, o) {
  o = o || {}; const e = K.e[eb], sd = K.o.seed;
  const m = B.maske(); wandRechteck(P, m, xw, Y0, Y1, Z0, Z1);
  // Laibung (Wandstärke): ein Rahmen aus Kalk
  const lb = B.maske(); wandRechteck(P, lb, xw, Y0 - 0.06, Y1 + 0.06, Z0 - 0.08, Z1 + 0.08); wandRechteck(P, lb, xw, Y0, Y1, Z0, Z1);
  for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) if (m.has(x, y)) lb.put(x, y, 0);
  K.form(eb, lb, 0.05, { k: KALK.slice(3), r: RAND_D, ton: 4, fase: 1, rand: 1 });
  B.feld(e, m.x0, m.y0, m.x1 + 1, m.y1 + 1, STURM, (x, y) => { if (!m.has(x, y)) return -1; return 0.45 + (o.hell || 0) + (B.fbm(x * 0.05, y * 0.02, sd + 31, 3) - 0.5) * 0.35 - (y - m.y0) / (m.y1 - m.y0 + 1) * 0.15; });
  // Sprossen: ein Kreuz und ein Querriegel
  const sp = B.maske(); const zm = (Z0 + Z1) / 2;
  sp.poly(quad(P, [[xw, Y0, zm - 0.025], [xw, Y1, zm - 0.025], [xw, Y1, zm + 0.025], [xw, Y0, zm + 0.025]]));
  for (const yy of [Y0 + (Y1 - Y0) * 0.38, Y0 + (Y1 - Y0) * 0.7]) sp.poly(quad(P, [[xw, yy - 0.025, Z0], [xw, yy + 0.025, Z0], [xw, yy + 0.025, Z1], [xw, yy - 0.025, Z1]]));
  K.form(eb, sp, 0.1, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
  // Deich draußen: eine dunkle Linie im unteren Drittel, darauf (mit fremdheit) kleine Gestalten
  if (o.deich) {
    const dy0 = Y0 + (Y1 - Y0) * 0.22;
    for (let x = m.x0; x <= m.x1; x++) for (let y = m.y0; y <= m.y1; y++) {
      if (!m.has(x, y) || sp.has(x, y)) continue;
      const [, yd] = Q(P, xw, dy0, Z0 + (Z1 - Z0) * ((x - m.x0) / Math.max(1, m.x1 - m.x0)));
      if (y > yd) e.set(x, y, B.pk(STURM[y > yd + 2 ? 0 : 1]));
    }
  }
  K.licht(m.x0, (m.y0 + m.y1) / 2, STURM[6], 60, 0.4);
  // Regen am Glas
  const rr = []; for (let i = 0; i < Math.max(4, (m.x1 - m.x0) * (m.y1 - m.y0) / 60); i++) rr.push([B.hash(i, 3, sd) , B.hash(i, 7, sd), 0.5 + B.hash(i, 9, sd)]);
  const col = B.css(STURM[7]), col2 = B.css(STURM[5]);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) {
    for (const [a, b2, v] of rr) { const x = Math.floor(m.x0 + a * (m.x1 - m.x0)), y = Math.floor(m.y0 + ((b2 + t * 0.35 * v) % 1) * (m.y1 - m.y0)); if (!m.has(x, y) || sp.has(x, y)) continue; ctx.fillStyle = v > 1.1 ? col : col2; ctx.fillRect(x + ox, y + oy, 1, 2); }
  } });
  return m;
}
// Lichtfleck eines Fensters auf dem Boden (in X/Z), Licht fällt von rechts oben nach links vorn
function lichtFleck(xw, Z0, Z1, Y0, Y1, dx, dz) { const a = [], f = Y => [xw - Y * dx, Z0 + Y * dz]; const p1 = f(Y0), p2 = f(Y1); return [[p1[0], Z0 + Y0 * dz], [p2[0], Z0 + Y1 * dz], [p2[0], Z1 + Y1 * dz], [p1[0], Z1 + Y0 * dz]]; }
function inPoly(px, py, v) { let c = false; for (let i = 0, j = v.length - 1; i < v.length; j = i++) { if ((v[i][1] > py) !== (v[j][1] > py) && px < (v[j][0] - v[i][0]) * (py - v[i][1]) / (v[j][1] - v[i][1]) + v[i][0]) c = !c; } return c; }
// Linoleum: Ocker, Bahnen, glänzende Lichtflecken der Fenster, nasse Fußspuren
function boden(K, P, y0, o) {
  o = o || {}; const sd = K.o.seed, flecken = o.flecken || [], spuren = o.spuren || [];
  const mats = [
    { cols: LINO, tf: (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; let t = 0.32 + Math.min(0.12, 1.5 / Z) + (B.fbm(X * 0.6, Z * 0.4, sd + 3, 2) - 0.5) * 0.12;
      // Bahnen des Linoleums: feine Fugen in Längsrichtung
      if (Math.abs(X * 1.25 - Math.round(X * 1.25)) < 0.012 * Z) t -= 0.12;
      for (const f of flecken) if (inPoly(X, Z, f)) t += 0.3;
      if (o.lauf && Math.abs(X - o.lauf[0]) < o.lauf[1]) { const d = Math.abs(X - o.lauf[0]); t -= 0.1; if (Math.abs(d - o.lauf[1] * 0.82) < 0.012 * Z + 0.006) t += 0.22; if (d > o.lauf[1] - 0.012 * Z - 0.004) t -= 0.12; if (Math.abs(Z * 2 - Math.round(Z * 2)) < 0.01 * Z && d < o.lauf[1] * 0.7) t -= 0.05; }
      return t - (o.dunkel || 0); } },
    { cols: [NASS, NASS2, STURM[3]], tf: (x, y) => 0.3 + B.bay(x, y) * 0.2 },
  ];
  K.bodenStoffe(y0, H + M, mats, (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; if (o.xl !== undefined && (X < o.xl || X > o.xr || Z > o.ze)) return -1; for (const s of spuren) { const dx = (X - s[0]) / s[2], dz = (Z - s[1]) / (s[2] * 1.9); if (dx * dx + dz * dz < 1) return 1; } return 0; });
}
// Fußspuren: Paare entlang einer Linie (X/Z), mit fremdheit mehr
function fussSpur(X0, Z0, X1, Z1, n, g) { const s = []; for (let i = 0; i < n; i++) { const t = i / Math.max(1, n - 1), X = X0 + (X1 - X0) * t, Z = Z0 + (Z1 - Z0) * t; s.push([X + (i & 1 ? 0.08 : -0.08), Z, g || 0.045]); } return s; }
// Eisenbett: Kopfteil an der Wand (xw), Fußteil zur Mitte, Länge 1,15, Breite bz; Matratze, Decke, Kissen mit nassem Fleck
function bett(K, P, xw, z0, bz, o) {
  o = o || {}; const s = Math.sign(xw), xk = xw - s * 0.06, xf = xw - s * 1.2, td = o.tiefe || 0;
  const zf = z0 + bz, eb = o.eb !== undefined ? o.eb : K.eb(Q(P, xf, 0, z0)[1]);
  const st = B.maske(), r = 0.025 * (o.dick || 1);
  const pfosten = (X, Z, h) => st.poly(quad(P, [[X, 0, Z - r], [X, h, Z - r], [X, h, Z + r], [X, 0, Z + r]]));
  // Pfosten und Stäbe
  pfosten(xk, z0, 0.78); pfosten(xk, zf, 0.78); pfosten(xf, z0, 0.55); pfosten(xf, zf, 0.55);
  for (const h of [0.78, 0.7, 0.3]) st.poly(quad(P, [[xk, h - 0.02, z0], [xk, h + 0.02, z0], [xk, h + 0.02, zf], [xk, h - 0.02, zf]]));
  for (const h of [0.55, 0.48]) st.poly(quad(P, [[xf, h - 0.02, z0], [xf, h + 0.02, z0], [xf, h + 0.02, zf], [xf, h - 0.02, zf]]));
  for (let i = 1; i < 5; i++) { const Z = z0 + bz * i / 5; st.poly(quad(P, [[xf, 0.3, Z - 0.012], [xf, 0.55, Z - 0.012], [xf, 0.55, Z + 0.012], [xf, 0.3, Z + 0.012]])); }
  // Matratze und Decke (Kasten), Decke hängt seitlich bis 0,2 herab
  const ma = B.maske();
  ma.poly(quad(P, [[xk, 0.36, z0], [xf, 0.36, z0], [xf, 0.36, zf], [xk, 0.36, zf]]));
  ma.poly(quad(P, [[xk, 0.18, z0], [xk, 0.36, z0], [xf, 0.36, z0], [xf, 0.18, z0]]));
  ma.poly(quad(P, [[xf, 0.18, z0], [xf, 0.36, z0], [xf, 0.36, zf], [xf, 0.18, zf]]));
  const kz = (z0 + zf) / 2;
  const fl = o.leer ? 0 : 1;
  K.form(eb, ma, td, { k: DECKE, r: RAND, ton: 3.2, fase: 1, rand: 1, schatten: 1,
    muster: (x, y) => { const Z = Math.min(Math.max(P.z(y), z0), zf); let t = 0; const [, ys] = Q(P, xf, 0.33, Z); if (Math.abs(y - ys) < 0.6) t -= 1; const [, ys2] = Q(P, xf, 0.24, Z); if (Math.abs(y - ys2) < 0.7) t += 1.6; const [, ys3] = Q(P, xf, 0.21, Z); if (Math.abs(y - ys3) < 0.6) t += 1.2; return t; } });
  // Umschlag des Lakens (hell) und Kissen
  const ki = B.maske();
  ki.poly(quad(P, [[xk - s * 0.04, 0.37, z0 + 0.05], [xk - s * 0.3, 0.37, z0 + 0.05], [xk - s * 0.3, 0.37, zf - 0.05], [xk - s * 0.04, 0.37, zf - 0.05]]));
  ki.poly(quad(P, [[xk - s * 0.05, 0.36, z0 + 0.05], [xk - s * 0.05, 0.52, z0 + 0.07], [xk - s * 0.3, 0.5, z0 + 0.07], [xk - s * 0.3, 0.36, z0 + 0.05]]));
  ki.poly(quad(P, [[xk - s * 0.05, 0.52, z0 + 0.07], [xk - s * 0.3, 0.5, z0 + 0.07], [xk - s * 0.3, 0.5, zf - 0.07], [xk - s * 0.05, 0.52, zf - 0.07]]));
  if (!o.leer) K.form(eb, ki, td, { k: LEINEN, r: RAND, ton: 5 + (o.hell || 0), fase: 1, rand: 1, schatten: 1 });
  const um = B.maske(); um.poly(quad(P, [[xk - s * 0.32, 0.37, z0], [xk - s * 0.42, 0.37, z0], [xk - s * 0.42, 0.37, zf], [xk - s * 0.32, 0.37, zf]]));
  if (!o.leer) K.form(eb, um, td, { k: LEINEN, r: RAND, ton: 3, fase: 0, rand: 1 });
  // der nasse Fleck auf dem Kissen (falsches Detail)
  if (!o.leer && fl) { const [cx, cy] = Q(P, xk - s * 0.17, 0.5, kz); const k = P.k(kz); const nm = B.maske(); nm.ell(cx, cy, Math.max(1, k * 0.08), Math.max(1, k * 0.05)); for (let y = nm.y0; y <= nm.y1; y++) for (let x = nm.x0; x <= nm.x1; x++) if (nm.has(x, y) && ki.has(x, y)) K.e[eb].set(x, y, B.pk((x + y) & 1 ? NASS : NASS2)); }
  K.form(eb, st, td, { k: EISEN, r: RAND, ton: 2.6, fase: 0, rand: 1 });
  // Nummer über dem Bett an der Wand (Email, hell, mit dunklem Zeichen)
  if (o.nummer !== false) nummer(K, P, o.nEb !== undefined ? o.nEb : 0, xw, 1.3, kz, o.nTiefe || 0);
  return { eb, st };
}
// Emailschild mit Nummer: ein helles Rechteck, darin zwei dunkle Striche (nicht lesbar)
function nummer(K, P, eb, xw, Y, Z, td, frontal) {
  const m = B.maske(); let pts;
  if (frontal) pts = [[Z - 0.1, Y - 0.07], [Z + 0.1, Y - 0.07], [Z + 0.1, Y + 0.07], [Z - 0.1, Y + 0.07]].map(([X, YY]) => Q(P, X, YY, xw));
  else pts = quad(P, [[xw, Y - 0.07, Z - 0.1], [xw, Y + 0.07, Z - 0.1], [xw, Y + 0.07, Z + 0.1], [xw, Y - 0.07, Z + 0.1]]);
  m.poly(pts);
  if (m.leer()) { const [x, y] = frontal ? Q(P, Z, Y, xw) : Q(P, xw, Y, Z); m.rect(x - 1, y, 2, 1); }
  K.form(eb, m, td, { k: LEINEN.slice(2), r: RAND, ton: 3.5, fase: 0, rand: 1 });
  const w = m.x1 - m.x0, h = m.y1 - m.y0;
  if (w >= 3 && h >= 2) { const c = B.pk(EISEN[1]); const yy = Math.round((m.y0 + m.y1) / 2); for (const fx of [0.35, 0.65]) { const xx = Math.round(m.x0 + w * fx); K.e[eb].set(xx, yy, c); if (h >= 4) K.e[eb].set(xx, yy - 1, c); } }
  return m;
}
// Kind (fernes falsches Detail): dunkle kleine Gestalt im Nachthemd, nasses Haar, zwei rote Punkte
function kind(K, eb, x, fy, h, td, o) {
  o = o || {}; const m = B.maske(), k = h / 30;
  m.poly([[x - 3 * k, fy], [x - 2.2 * k, fy - 14 * k], [x - 1.4 * k, fy - 19 * k], [x + 1.4 * k, fy - 19 * k], [x + 2.2 * k, fy - 14 * k], [x + 3.2 * k, fy]]);
  m.ell(x, fy - 23 * k, 3.4 * k, 3.8 * k);
  m.poly([[x + 0.5 * k, fy - 26 * k], [x + 3.6 * k, fy - 23 * k], [x + 3 * k, fy - 13 * k], [x + 1 * k, fy - 15 * k]]);
  K.form(eb, m, td, { k: pal.koerper, r: o.rand || RAND, ton: 1.4, fase: 0.8, rand: 1 });
  if (h >= 14) { K.e[eb].set(x - 2 * k, fy - 23 * k, B.pk(ROT)); K.e[eb].set(x, fy - 23 * k, B.pk('#4a1512')); }
  return m;
}
// rotes Nachtlicht: kleine Lampe in rotem Glas, Glühen auf Wand und Boden, leises Flackern
function nachtlicht(K, x, y, eb, o) {
  o = o || {}; const m = B.maske(); m.rect(x - 2, y - 1, 5, 4); m.rect(x - 3, y - 3, 7, 2); m.rect(x, y - 6, 1, 3);
  K.form(eb, m, 0, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
  K.e[eb].set(x - 1, y, B.pk('#ff7a5a')); K.e[eb].set(x, y, B.pk(ROT)); K.e[eb].set(x + 1, y, B.pk(ROT)); K.e[eb].set(x, y + 1, B.pk('#a8180e'));
  for (const i of [0, 1, 2, 3, 4].filter(i => i >= eb - 1 && i <= Math.min(4, eb + 2))) B.gluehen(K.e[i], x, y + 2, o.r || 36, ROTG, 0.9);
  K.licht(x, y, ROT, o.r || 40, 0.7);
  const g1 = B.glanzSprite(7, '#3a0806', 0.8), g2 = B.glanzSprite(8, '#4a0a06', 0.85);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { const fl = Math.sin(t * 1.7) + Math.sin(t * 5.3) * 0.4; const g = fl > 0.9 ? g1 : g2; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y + 1 - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}
// Deckenbalken quer
function balkenQuer(K, P, eb, Z, yc, xl, xr, td) { const m = B.maske(); m.poly(quad(P, [[xl, yc, Z - 0.12], [xr, yc, Z - 0.12], [xr, yc - 0.18, Z], [xl, yc - 0.18, Z]])); m.poly(quad(P, [[xl, yc - 0.18, Z], [xr, yc - 0.18, Z], [xr, yc - 0.18, Z + 0.1], [xl, yc - 0.18, Z + 0.1]])); K.form(eb, m, td, { k: KALK.slice(1, 6), r: RAND_D, ton: 2, fase: 1, rand: 1 }); }
// Hängelampe (aus): Schirm aus Email, Kabel
function haengelampe(K, P, eb, X, Z, yc, td) { const [x, y] = Q(P, X, yc - 0.45, Z), [, yt] = Q(P, X, yc, Z), k = P.k(Z); const m = B.maske(); m.rect(x, yt, 1, y - yt); m.poly([[x - k * 0.12, y + k * 0.06], [x - k * 0.03, y - k * 0.02], [x + k * 0.03, y - k * 0.02], [x + k * 0.12, y + k * 0.06]]); K.form(eb, m, td, { k: EISEN, r: RAND_D, ton: 2.5, fase: 0, rand: 1 }); }
// Luft: Staub im Fensterlicht, ganz wenig
function luft(K) {
  B.partikel(K, { n: 18, farben: [STURM[4], STURM[6]], vx: -2, vy: 1.5, wob: 3, wf: 0.4, x0: 0, x1: 480, y0: 10, y1: 230, p: 0.8, blink: 0.6, hellSelten: 1.4 });
}

// =====================================================================
// Variante 0: Der Schlafsaal (Grundform: Tunnel mit Fluchtpunkt, Reihen gleicher Dinge). Zwei Reihen Eisenbetten,
// rechts die hohen Fenster, hinten die Stirnwand mit der Tür und dem roten Nachtlicht; die Nummern laufen dort ohne
// Betten weiter bis unter die Decke, und davor stehen die, für die kein Bett da ist.
function schlafsaal(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, vx = 252, vy = 128, P = B.persp(vx, vy); K.split = [150, 166];
  const xl = -2.25, xr = 2.25, yc = 2.6, ze = 11.6;
  raum(K, P, { xl, xr, yc, ze, sockel: 0.82, hell: cfg.dunkel ? -0.8 : 0, wandFlecken: cfg.dunkel ? [] : [1.9, 3.3, 4.7, 6.1, 7.5, 8.9].map(Z => [Z + 1.1, Z + 1.6, 0.9, 1.8]) });
  // Deckenbalken und Lampen
  for (const Z of [2.4, 4.4, 6.4, 8.4, 10.4]) balkenQuer(K, P, Z > 7 ? 0 : 1, Z, yc, xl, xr, Z > 7 ? 0.3 : 0.1);
  for (const Z of [3.4, 7.4]) haengelampe(K, P, Z > 7 ? 0 : 1, 0, Z, yc, 0.1);
  // Fenster rechts zwischen den Betten
  const fen = [], fl = [];
  for (const Z of [1.9, 3.3, 4.7, 6.1, 7.5, 8.9, 10.2]) { const eb = Z > 6 ? 0 : 1; fenster(K, P, eb, xr, Z + 0.3, Z + 0.95, 1.15, 2.2, { hell: cfg.dunkel ? -0.3 : 0, deich: Z < 5 }); if (Z < 9) fl.push(lichtFleck(xr, Z + 0.3, Z + 0.95, 1.15, 2.2, 1.0, 0.2)); }
  // Stirnwand: Tür mit Nachtlicht, Nummern ohne Betten bis unter die Decke
  { const tm = B.maske(); tm.poly([Q(P, -0.45, 0, ze), Q(P, -0.45, 1.35, ze), Q(P, 0.45, 1.35, ze), Q(P, 0.45, 0, ze)]); K.form(0, tm, 0.15, { k: HOLZ, r: RAND_D, ton: 1.6, fase: 1, rand: 1, muster: (x, y) => (Math.abs(x - vx) < 0.6 ? -1 : 0) });
    const [nx, ny] = Q(P, 0, 1.5, ze); if (!cfg.dunkel || true) nachtlicht(K, Math.round(nx), Math.round(ny), 0, { r: 30 });
    for (let r = 0; r < 6; r++) for (let c = -6; c <= 6; c++) { if (Math.abs(c) < 2 && r < 2) continue; const Y = 0.95 + r * 0.28, X = c * 0.42; if (Y > yc - 0.1) continue; nummer(K, P, 0, ze, Y, X, 0.12, true); } }
  // Boden: Linoleum mit Fensterflecken, nasse Spur von der Tür zu einem der Betten
  const spuren = cfg.dunkel ? [] : [...fussSpur(-0.1, ze - 0.6, -0.3, 5, 12 + Math.round(fr * 6)), ...fussSpur(-0.3, 5, -0.6, 2.2, 7, 0.05), ...fussSpur(-0.6, 2.2, -1.15, 1.45, 3, 0.055)];
  boden(K, P, vy + 1, { flecken: fl, spuren, lauf: [0.05, 0.42], dunkel: cfg.dunkel ? 0.12 : 0, xl, xr, ze });
  // Betten: links und rechts, Kopfteil an der Wand
  const bz = 0.62;
  for (const Z of [1.25, 2.6, 4.0, 5.4, 6.8, 8.2, 9.6, 10.8].reverse()) for (const xw of [xl, xr]) {
    if (Z < 2 && xw > 0) continue;
    const yb = Q(P, xw * 0.6, 0, Z)[1]; const eb = Z > 8 ? 1 : K.eb(yb);
    bett(K, P, xw, Z, bz, { eb: Math.max(1, eb), tiefe: Math.min(0.45, Z * 0.03), nEb: Z > 6 ? 0 : 1, nTiefe: Math.min(0.4, Z * 0.025) });
  }
  // die ohne Bett: vor der Stirnwand, unter den Nummern, mit fremdheit mehr
  const n = cfg.dunkel ? 0 : 2 + Math.round(fr * 5);
  for (let i = 0; i < n; i++) { const X = -1.3 + i * 0.45 + (i > 2 ? 0.95 : 0); const [x, y] = Q(P, X, 0, ze - 0.4); kind(K, 2, Math.round(x), Math.round(y), 21 + (i % 2) * 2, 0.15); }
  // Vordergrund: links das Fußteil eines Betts angeschnitten, rechts ein Stuhl mit gefalteter Wäsche
  { const v = B.maske(); v.rect(-M, 196, 54, 5); v.rect(-M, 214, 54, 4); v.rect(46, 192, 5, H + M - 192); for (let i = 0; i < 4; i++) v.rect(4 + i * 12, 201, 3, 13); K.form(5, v, 0, { k: EISEN, r: RAND, ton: 2, fase: 1, rand: 2 }); }
  { const v = B.maske(); v.rect(436, 226, 40, 5); v.rect(440, 231, 4, 40); v.rect(468, 231, 4, 40); v.rect(468, 176, 4, 50); v.rect(466, 176, 8, 4); K.form(5, v, 0, { k: HOLZ, r: RAND, ton: 2.6, fase: 1, rand: 2 });
    const w = B.maske(); w.rect(440, 218, 26, 8); w.rect(442, 214, 22, 4); K.form(5, w, 0, { k: LEINEN, r: RAND, ton: 2.4, fase: 1, rand: 1 }); }
  B.nebel(K.e[1], { y0: vy - 30, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.18, xs: [-20, 500, 60], seed: 3 });
  luft(K);
  K.reihen = [{ y: 166, skala: 0.9, nebel: 0.25 }, { y: 190, skala: 1, nebel: 0.1 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], P };
}

// Variante 1: Der Flur der Nummern (Grundform: frontale Wand, waagerechtes Band). Eine lange Wand, frontal: unten
// Ölfarbe, darüber Kalk, an Haken die Nachthemden mit Nummern, unter jedem ein Paar nasser Füße auf dem Linoleum.
// Rechts das hohe Fenster zum Deich, links die Tür mit dem roten Nachtlicht. Der Flur läuft nach links hinten weg.
function flur(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 120, vy = 150, P = B.persp(vx, vy); K.split = [164, 178];
  const wz = 3.4; // Wand in Tiefe wz (frontal)
  // Wand frontal (Ebene 0), links knickt der Flur nach hinten weg (Tunnel)
  B.feld(K.e[0], -M, -M, W + M, vy + 1, KALK, (x, y) => {
    const [, ys] = Q(P, 0, 0.82, wz); const Z = wz; const Y = 1 - (y + 0.5 - vy) * Z / P.h;
    let t = 0.6 - Math.max(0, Y - 1.9) * 0.1 - (y < ys ? 0 : 0.28) + (B.fbm(x * 0.03, y * 0.03, sd + 4, 2) - 0.5) * 0.06;
    if (Math.abs(y - ys) < 0.6) t += 0.12;
    t += Math.max(0, 0.25 - Math.abs(x - 410) / 400) * 0.6; // Licht vom Fenster rechts
    if (y > ys - 30 && y < ys) t -= Math.max(0, B.fbm(x * 0.05, y * 0.08, sd + 9, 3) - 0.6) * 0.8;
    return t;
  });
  // Durchgang links: dunkler Gang nach hinten, Tür mit Nachtlicht
  { const g = B.maske(); g.poly([[18, 152], [18, 46], [86, 46], [86, 152]]); B.feld(K.e[0], 18, 46, 87, 153, KALK.slice(0, 5), (x, y) => { if (!g.has(x, y)) return -1; return 0.25 + (x - 18) / 300 - (y - 46) / 600; });
    const tm = B.maske(); tm.rect(38, 84, 26, 68); K.form(0, tm, 0.2, { k: HOLZ, r: RAND_D, ton: 1.4, fase: 1, rand: 1 });
    nachtlicht(K, 51, 76, 0, { r: 34 });
    const lb = B.maske(); lb.rect(12, 40, 80, 6); lb.rect(12, 40, 6, 114); lb.rect(86, 40, 6, 114); K.form(1, lb, 0.05, { k: KALK.slice(2), r: RAND_D, ton: 4.5, fase: 1, rand: 2, schatten: 2 }); }
  // Fenster rechts frontal: hoch, mit Deich draußen und den Wartenden darauf
  { const m = B.maske(); m.rect(372, 22, 76, 112); B.feld(K.e[0], 372, 22, 448, 134, STURM, (x, y) => 0.5 + (B.fbm(x * 0.05, y * 0.02, sd + 31, 3) - 0.5) * 0.35 - (y - 22) / 400);
    for (let x = 372; x < 448; x++) { const yd = 104 + Math.round(Math.sin(x * 0.05) * 1.5); for (let y = yd; y < 134; y++) K.e[0].set(x, y, B.pk(y > yd + 2 ? STURM[0] : STURM[1])); }
    const nk = 3 + Math.round(fr * 6); for (let i = 0; i < nk; i++) { const x = 378 + i * (66 / Math.max(1, nk - 1)); const km = B.maske(); km.rect(x, 98 + (i % 2), 2, 6); km.rect(x, 96 + (i % 2), 2, 2); for (let y = km.y0; y <= km.y1; y++) for (let xx = km.x0; xx <= km.x1; xx++) if (km.has(xx, y)) K.e[0].set(xx, y, B.pk(STURM[0])); }
    const sp = B.maske(); sp.rect(408, 22, 3, 112); sp.rect(372, 62, 76, 3); sp.rect(372, 96, 76, 3);
    const lb = B.maske(); lb.rect(364, 14, 92, 128); lb.rect(372, 22, 76, 112, 0); K.form(0, lb, 0, { k: KALK.slice(3), r: RAND, ton: 4.8, fase: 2, rand: 2, schatten: 2 });
    K.form(0, sp, 0.05, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
    const fb = B.maske(); fb.rect(360, 134, 100, 5); K.form(1, fb, 0, { k: KALK.slice(4), r: RAND, ton: 5, fase: 1, rand: 2, schatten: 2 });
    for (let x = 366; x < 454; x++) if ((x * 7) % 5 < 2) K.e[1].set(x, 139, B.pk(NASS2));
    K.licht(410, 80, STURM[6], 160, 0.6);
    const rr = []; for (let i = 0; i < 26; i++) rr.push([B.hash(i, 3, sd), B.hash(i, 7, sd), 0.5 + B.hash(i, 9, sd)]);
    K.anim.push({ p: 0, f(ctx, t, ox, oy) { for (const [a, b2, v] of rr) { const x = Math.floor(372 + a * 76), y = Math.floor(22 + ((b2 + t * 0.3 * v) % 1) * 110); if (sp.has(x, y)) continue; ctx.fillStyle = B.css(v > 1.1 ? STURM[7] : STURM[5]); ctx.fillRect(x + ox, y + oy, 1, 2); } } }); }
  // Bilderleiste: gerahmte Gruppenfotos der Jahrgänge; das von 1913 ist breiter, und es sind zu viele darauf
  for (const [x, w, jahr] of [[112, 34, 0], [158, 34, 0], [204, 70, 1]]) {
    const r = B.maske(); r.rect(x, 54, w, 26); r.rect(x + 3, 57, w - 6, 20, 0); K.form(0, r, 0, { k: HOLZ, r: RAND_D, ton: 2.6, fase: 0, rand: 1 });
    B.feld(K.e[0], x + 3, 57, x + w - 3, 77, KALK.slice(3, 8), (px, py) => 0.4 + (py - 57) / 60 + (B.hash(px, py, 5) - 0.5) * 0.1);
    const rows = jahr ? 3 : 2, per = jahr ? 13 : 5; for (let rI = 0; rI < rows; rI++) for (let c = 0; c < per; c++) { const px = x + 5 + c * ((w - 10) / per) + (rI & 1) * 1.5, py = 62 + rI * 5; K.e[0].set(px, py, B.pk(KALK[1])); K.e[0].set(px, py + 1, B.pk(KALK[2])); K.e[0].set(px, py + 2, B.pk(KALK[2])); }
  }
  // Hakenleiste mit Nachthemden, Nummern darüber, darunter je ein Paar nasser Füße
  const hy = 96, hz = 2;
  { const l = B.maske(); l.rect(100, hy, 262, 4); K.form(1, l, 0, { k: HOLZ, r: RAND, ton: 3, fase: 1, rand: 2, schatten: 2 }); }
  const nh = 9;
  for (let i = 0; i < nh; i++) {
    const x = 112 + i * 28 + (i % 2), fehlt = i === 6 && !cfg.dunkel;
    const sch = B.maske(); sch.rect(x - 4, hy - 12, 9, 6); K.form(1, sch, 0, { k: LEINEN.slice(2), r: RAND, ton: 3.6, fase: 0, rand: 1 }); K.e[1].set(x - 1, hy - 9, B.pk(EISEN[1])); K.e[1].set(x + 1, hy - 9, B.pk(EISEN[1]));
    const hk = B.maske(); hk.rect(x, hy + 3, 1, 3); K.form(1, hk, 0, { k: EISEN, r: RAND, ton: 2, fase: 0, rand: 1 });
    if (fehlt) continue;
    const m = B.maske(); const l = 40 + (i % 3) * 2; m.poly([[x - 3, hy + 5], [x + 3, hy + 5], [x + 6, hy + 12], [x + 4, hy + 12], [x + 7, hy + l], [x - 7, hy + l], [x - 4, hy + 12], [x - 6, hy + 12]]);
    K.form(1, m, 0, { k: LEINEN, r: RAND, ton: 3.2, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (Math.abs(px - x + (py - hy) * 0.05) < 0.6 ? -1 : 0) + (py > hy + l - 4 ? -0.6 : 0) });
    for (let k = 0; k < 3; k++) K.e[1].set(x - 4 + k * 4, hy + l + 1 + ((k + i) % 3) * 3, B.pk(NASS2));
  }
  // Boden: Linoleum, unter jedem Nachthemd ein Paar nasser Fußabdrücke (stehen still, darüber niemand)
  const spuren = [];
  for (let i = 0; i < nh; i++) { if (cfg.dunkel && i % 2) continue; const x = 112 + i * 28; const Z = 3.15, X = (x - vx) * Z / P.h; spuren.push([X - 0.07, Z, 0.04], [X + 0.07, Z - 0.03, 0.04]); }
  if (!cfg.dunkel) spuren.push(...fussSpur(-0.3, 2.6, -0.1, 1.5, 3 + Math.round(fr * 3)));
  const fl = [[[1.6, 2.4], [2.6, 2.4], [2.2, 1.2], [1.0, 1.2]]];
  boden(K, P, vy + 1, { flecken: cfg.dunkel ? [] : fl, spuren, dunkel: cfg.dunkel ? 0.1 : 0 });
  // Sockelleiste
  { const l = B.maske(); l.rect(-M, vy - 4, W + 2 * M, 5); K.form(1, l, 0, { k: SOCKEL, r: RAND_D, ton: 2.6, fase: 1, rand: 1 }); }
  // Vordergrund: links eine Bank angeschnitten, rechts der Heizkörper unter dem Fenster
  { const v = B.maske(); v.rect(-M, 232, 92, 6); v.rect(6, 238, 5, 40); v.rect(70, 238, 5, 40); K.form(5, v, 0, { k: HOLZ, r: RAND, ton: 2.6, fase: 1, rand: 2 }); }
  { const v = B.maske(); for (let i = 0; i < 9; i++) v.rect(402 + i * 9, 186, 6, 40); v.rect(398, 222, 86, 4); v.rect(398, 190, 86, 3); K.form(4, v, 0, { k: EISEN, r: RAND, ton: 2.4, fase: 1, rand: 2, schatten: 1 }); }
  B.nebel(K.e[1], { y0: vy - 14, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.12, xs: [-20, 500, 60], seed: 5 });
  luft(K);
  K.reihen = [{ y: 172, skala: 0.9, nebel: 0.22 }, { y: 194, skala: 1, nebel: 0.1 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [250, 210], P };
}

// Variante 2: Der Turnsaal (Grundform: Diagonale aus hängenden Linien). Hoch, Oberlichter rechts oben, Seile und
// Ringe hängen von der Decke, links die Sprossenwand. Auf den Dielen sind Fußpaare in Reihen vorgezeichnet; auf
// jedem steht ein Paar nasser Abdrücke. Hinten ein Bock, eine Bank, an der Wand ein Haken mit einer Pfeife.
function turnsaal(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 330, vy = 152, P = B.persp(vx, vy); K.split = [168, 182];
  const xl = -4.2, xr = 2.6, yc = 3.4, ze = 11;
  raum(K, P, { xl, xr, yc, ze, sockel: 1.3, hell: cfg.dunkel ? -0.4 : 0.3 });
  // Oberlichter rechts oben (rechte Wand), hoch
  for (const Z of [2.5, 4.5, 6.5, 8.5]) fenster(K, P, Z > 5 ? 0 : 1, xr, Z, Z + 1.3, 2.2, 3.1, { hell: 0.05 });
  // Sprossenwand links: senkrechte Holme, waagerechte Sprossen
  { const sw = B.maske(); for (let i = 0; i < 9; i++) { const Z = 2.6 + i * 0.42; sw.poly(quad(P, [[xl + 0.16, 0, Z - 0.05], [xl + 0.16, 2.7, Z - 0.05], [xl + 0.16, 2.7, Z + 0.05], [xl + 0.16, 0, Z + 0.05]])); }
    for (let j = 0; j < 16; j++) { const Y = 0.12 + j * 0.16; sw.poly(quad(P, [[xl + 0.18, Y - 0.022, 2.55], [xl + 0.18, Y + 0.022, 2.55], [xl + 0.18, Y + 0.022, 6.05], [xl + 0.18, Y - 0.022, 6.05]])); }
    K.form(1, sw, 0.04, { k: HOLZ, r: RAND, ton: 3.6, fase: 0, rand: 1, schatten: 1 }); }
  // Haken mit Pfeife an der Stirnwand, Nummernschilder der Riegen
  { const [x, y] = Q(P, -1.2, 1.8, ze); const m = B.maske(); m.rect(x, y, 1, 3); m.rect(x - 1, y + 6, 3, 2); K.form(0, m, 0.1, { k: EISEN, r: RAND, ton: 2, fase: 0, rand: 1 }); K.e[0].set(x, y + 4, B.pk('#4a3a20')); K.e[0].set(x, y + 5, B.pk('#4a3a20')); K.e[0].set(x + 1, y + 6, B.pk('#8a6a34'));
    for (let c = -4; c <= 3; c++) nummer(K, P, 0, ze, 2.4, c * 0.55 + 0.2, 0.15, true); }
  // Deckenbalken diagonal (Binder), Seile und Ringe hängen
  for (const Z of [2.2, 4.2, 6.2, 8.2]) balkenQuer(K, P, Z > 5 ? 0 : 1, Z, yc, xl, xr, 0.1);
  const seile = [[0.5, 2.7, 1.45, 1], [1.0, 2.7, 1.45, 1], [-1.4, 4.6, 0.35, 0], [-0.9, 5.4, 0.35, 0], [1.6, 6.2, 0.3, 0]];
  for (const [X, Z, Yu, ring] of seile) {
    const [x, yu] = Q(P, X, Yu, Z), [, yt] = Q(P, X, yc, Z), k = P.k(Z); const eb = Z < 4 ? 2 : 1;
    const m = B.maske(); m.rect(x, yt, Math.max(2, Math.round(k * 0.035)), yu - yt);
    if (ring) { const rr = k * 0.1; m.ell(x + 1, yu + rr, rr, rr); m.ell(x + 1, yu + rr, rr - 2.2, rr - 2.2, 0); }
    K.form(eb, m, Z * 0.03, { k: HOLZ, r: RAND, ton: 3.4, fase: 0, rand: 2 });
  }
  // Bock und Bank hinten
  { const [x, y] = Q(P, 1.3, 0, 3.9), k = P.k(3.9); const m = B.maske(); m.ell(x, y - k * 0.7, k * 0.62, k * 0.13); m.rect(x - k * 0.62, y - k * 0.7, k * 1.24, k * 0.1); for (const dx of [-0.48, -0.36, 0.36, 0.48]) m.poly([[x + dx * k - 1, y - k * 0.6], [x + dx * k + 1, y - k * 0.6], [x + dx * k * 1.2 + 1.5, y], [x + dx * k * 1.2 - 1, y]]); for (const dx of [-0.16, 0.12]) { m.rect(x + dx * k, y - k * 0.86, k * 0.06, k * 0.08); m.rect(x + dx * k - k * 0.03, y - k * 0.88, k * 0.12, k * 0.03); }
    K.form(K.eb(y), m, 0.1, { k: HOLZ, r: RAND, ton: 3, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (py < y - k * 0.6 && (px + py) % 9 === 0 ? -0.8 : 0) }); }
  { const [x0, y0] = Q(P, 0.6, 0.25, 8.2), [x1] = Q(P, 2.4, 0.25, 8.2), [, yb] = Q(P, 0.6, 0, 8.2); const m = B.maske(); m.rect(x0, y0, x1 - x0, 3); m.rect(x0 + 2, y0 + 3, 2, yb - y0 - 3); m.rect(x1 - 4, y0 + 3, 2, yb - y0 - 3); K.form(0, m, 0.2, { k: HOLZ, r: RAND_D, ton: 2.6, fase: 0, rand: 1 }); }
  // Boden: Dielen (Holz, ockergelb, Fluchtlinien), vorgezeichnete Fußpaare in Reihen, nasse Abdrücke darauf
  const kreide = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) kreide.push([-2.4 + c * 0.95 + (r & 1) * 0.4, 2.2 + r * 1.3]);
  const nass = kreide.filter((_, i) => cfg.dunkel ? i % 4 === 0 : (i % 3 !== 1 || fr > 0.5)).flatMap(([X, Z]) => [[X - 0.07, Z, 0.036], [X + 0.07, Z, 0.036]]);
  const mats = [
    { cols: LINO, tf: (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; let t = 0.38 + Math.min(0.12, 1.5 / Z) + (B.fbm(X * 2, Z * 0.2, sd + 3, 2) - 0.5) * 0.14;
      if (Math.abs(X * 4 - Math.round(X * 4)) < 0.02 * Z) t -= 0.14; // Dielenfugen
      if (Math.abs(Z * 1.1 - Math.round(Z * 1.1)) < 0.006 * Z * Z && (Math.floor(X * 4) & 1)) t -= 0.1;
      t += Math.max(0, 0.2 - Math.abs(X - 1.2) * 0.1) * (Z < 6 ? 1 : 0);
      return t - (cfg.dunkel ? 0.12 : 0); } },
    { cols: [NASS, NASS2, STURM[3]], tf: (x, y) => 0.3 + B.bay(x, y) * 0.2 },
    { cols: [LINO[5], KALK[6], KALK[8]], tf: (x, y) => 0.4 + B.bay(x, y) * 0.3 - (cfg.dunkel ? 0.3 : 0) },
  ];
  K.bodenStoffe(vy + 1, H + M, mats, (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; if (X < xl || X > xr) return -1; for (const s of nass) { const dx = (X - s[0]) / s[2], dz = (Z - s[1]) / (s[2] * 1.9); if (dx * dx + dz * dz < 1) return 1; }
    for (const [kx, kz] of kreide) for (const s of [-0.07, 0.07]) { const dx = (X - kx - s) / 0.06, dz = (Z - kz) / 0.12; const d = dx * dx + dz * dz; if (d < 1.2 && d > 0.55) return 2; } return 0; });
  // Vordergrund: links ein Seil, das bis in den Boden hängt; unten eine Matte angeschnitten
  { const v = B.maske(); v.rect(40, -M, 3, 210 + M); v.ell(41, 214, 5, 3); K.form(5, v, 0, { k: HOLZ, r: RAND, ton: 2.8, fase: 0, rand: 2 }); }
  { const v = B.maske(); v.poly([[300, H + M], [318, 246], [480 + M, 244], [480 + M, H + M]]); K.form(5, v, 0, { k: DECKE, r: RAND, ton: 2.4, fase: 2, rand: 2, muster: (x, y) => ((x + y) % 7 === 0 ? -0.6 : 0) }); }
  // rotes Licht: über der Tür der Umkleide links hinten
  { const [x, y] = Q(P, -3.4, 1.6, ze); nachtlicht(K, Math.round(x), Math.round(y), 0, { r: 26 }); const tm = B.maske(); tm.poly([Q(P, -3.8, 0, ze), Q(P, -3.8, 1.4, ze), Q(P, -3.0, 1.4, ze), Q(P, -3.0, 0, ze)]); K.form(0, tm, 0.2, { k: HOLZ, r: RAND_D, ton: 1.6, fase: 1, rand: 1 }); }
  B.nebel(K.e[1], { y0: vy - 24, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.15, xs: [-20, 500, 60], seed: 7 });
  luft(K);
  K.reihen = [{ y: 178, skala: 0.9, nebel: 0.22 }, { y: 198, skala: 1, nebel: 0.1 }, { y: 217, skala: 1, nebel: 0 }];
  return { mitte: [250, 212], P };
}

// Wächter-Szene: Die Halle mit dem großen Fenster. Hinter der Heimleiterin ein Rundbogenfenster, hoch wie die Halle,
// gefüllt mit ruhigem Sturmgrau (die helle, ruhige Zone, vor der sie als dunkle Gestalt steht). Links ihr Pult mit
// dem roten Licht, rechts die Treppe nach oben zum Schlafsaal, an den Wänden Nummern ohne Ende. Übergang: dieselbe
// Halle leer, ein Bett beiseitegeschoben, im Boden eine offene Luke mit Leiter.
function halle(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 240, vy = 164, P = B.persp(vx, vy); K.split = [176, 188];
  // Wand frontal
  B.feld(K.e[0], -M, -M, W + M, vy + 1, KALK, (x, y) => { let t = 0.42 - (y > 128 ? 0.22 : 0) + (B.fbm(x * 0.03, y * 0.03, sd + 4, 2) - 0.5) * 0.06 - Math.abs(x - 240) / 1400; if (Math.abs(y - 128) < 0.6) t += 0.12; return t; });
  // großes Rundbogenfenster mitten hinter dem Wächter: ruhige helle Fläche, wenige Sprossen
  const fx0 = 168, fx1 = 312, fy0 = 14, fy1 = 156, fr0 = (fx1 - fx0) / 2, fc = (fx0 + fx1) / 2;
  const fm = B.maske(); fm.fn(fx0, fy0, fx1, fy1, (x, y) => { if (y > fy0 + fr0 * 0.7) return x >= fx0 && x < fx1; const dy = (fy0 + fr0 * 0.7 - y) / (fr0 * 0.7), dx = (x - fc) / fr0; return dx * dx + dy * dy <= 1; });
  B.feld(K.e[0], fx0, fy0, fx1, fy1, STURM, (x, y) => { if (!fm.has(x, y)) return -1; return (cfg.leer ? 0.42 : 0.56) + (B.rausch2(x * 0.03, y * 0.02, sd + 31) - 0.5) * 0.08 - (y - fy0) / 900; });
  // Deich ganz unten im Fenster, ruhig; mit fremdheit die Wartenden darauf
  for (let x = fx0; x < fx1; x++) { const yd = 138 + Math.round(Math.sin(x * 0.04) * 1.2); for (let y = yd; y < fy1; y++) if (fm.has(x, y)) K.e[0].set(x, y, B.pk(y > yd + 2 ? STURM[1] : STURM[2])); }
  if (fr > 0.3) for (let i = 0; i < Math.round(fr * 10); i++) { const x = fx0 + 6 + i * ((fx1 - fx0 - 12) / 9); for (let y = 132; y < 138; y++) K.e[0].set(x, y, B.pk(STURM[1])); K.e[0].set(x, 131, B.pk(STURM[1])); }
  const sp = B.maske(); sp.rect(fc - 1, fy0, 3, fy1 - fy0); sp.rect(fx0, 98, fx1 - fx0, 3); sp.fn(fx0, fy0, fx1, fy0 + fr0, (x, y) => { const dy = (fy0 + fr0 * 0.7 - y) / (fr0 * 0.7), dx = (x - fc) / fr0; const d = Math.hypot(dx, dy); return y < fy0 + fr0 * 0.7 && Math.abs(d - 0.8) < 0.02; });
  K.form(0, sp, 0.05, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
  const lb = B.maske(); lb.fn(fx0 - 10, fy0 - 10, fx1 + 10, fy1 + 2, (x, y) => { const inn = fm.has(x, y); if (inn) return false; if (y > fy0 + fr0 * 0.7) return x >= fx0 - 9 && x < fx1 + 9; const dy = (fy0 + fr0 * 0.7 - y) / (fr0 * 0.7 + 9), dx = (x - fc) / (fr0 + 9); return dx * dx + dy * dy <= 1; });
  K.form(0, lb, 0, { k: KALK.slice(3), r: RAND, ton: 5, fase: 2, rand: 2, schatten: 2 });
  const fb = B.maske(); fb.rect(fx0 - 12, fy1, fx1 - fx0 + 24, 6); K.form(1, fb, 0, { k: KALK.slice(3), r: RAND, ton: 5, fase: 1, rand: 2, schatten: 2 });
  K.licht(fc, 80, STURM[6], 220, 0.8);
  { const rr = []; for (let i = 0; i < 30; i++) rr.push([B.hash(i, 3, sd), B.hash(i, 7, sd), 0.5 + B.hash(i, 9, sd)]);
    K.anim.push({ p: 0, f(ctx, t, ox, oy) { for (const [a, b2, v] of rr) { const x = Math.floor(fx0 + a * (fx1 - fx0)), y = Math.floor(fy0 + ((b2 + t * 0.25 * v) % 1) * (fy1 - fy0)); if (!fm.has(x, y) || sp.has(x, y)) continue; ctx.fillStyle = B.css(v > 1.1 ? STURM[7] : STURM[6]); ctx.fillRect(x + ox, y + oy, 1, 2); } } }); }
  // Nummern links und rechts an der Wand, viele, bis unter die Decke (ohne Betten)
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) for (const side of [-1, 1]) { const x = side < 0 ? 30 + c * 30 : 346 + c * 30, y = 22 + r * 21; const m = B.maske(); m.rect(x, y, 10, 6); K.form(0, m, 0.12, { k: LEINEN.slice(2), r: RAND, ton: 3.4, fase: 0, rand: 1 }); K.e[0].set(x + 3, y + 3, B.pk(EISEN[1])); K.e[0].set(x + 6, y + 3, B.pk(EISEN[1])); }
  // links: das Pult der Heimleiterin, darauf eine Lampe mit rotem Schirm (das rote Licht)
  if (!cfg.leer) { const m = B.maske(); m.poly([[44, 166], [52, 120], [118, 112], [120, 120], [112, 166]]); m.rect(50, 166, 6, 30); m.rect(104, 166, 6, 30); K.form(3, m, 0, { k: HOLZ, r: RAND, ton: 2.6, fase: 1.5, rand: 2, schatten: 2, muster: (x, y) => (y > 124 && Math.abs((x - 44) % 22) < 0.8 ? -0.8 : 0) });
    const bm = B.maske(); bm.poly([[60, 116], [88, 112], [90, 116], [62, 120]]); K.form(3, bm, 0, { k: LEINEN, r: RAND, ton: 3.2, fase: 0, rand: 1 });
    nachtlicht(K, 104, 104, 3, { r: 40 }); }
  // rechts: Treppe nach oben (diagonale Wange, Geländer mit Stäben)
  { const m = B.maske(); m.poly([[372, 164], [480 + M, 64], [480 + M, 84], [392, 168]]); K.form(2, m, 0.05, { k: HOLZ, r: RAND, ton: 2.6, fase: 1, rand: 2, schatten: 2 });
    const g = B.maske(); g.poly([[372, 128], [480 + M, 30], [480 + M, 34], [372, 132]]); for (let i = 0; i < 9; i++) { const x = 378 + i * 12, y0 = 128 - (x - 372) * 0.9; g.rect(x, y0, 2, 164 - (x - 372) * 0.92 - y0); } g.rect(370, 126, 6, 46); K.form(2, g, 0.05, { k: HOLZ, r: RAND, ton: 3, fase: 0, rand: 1 }); }
  // Boden: Linoleum, ein Lichtfleck des Fensters fällt nach vorn, eine lange Reihe nasser Füße quer (der Appell)
  const spuren = [];
  if (!cfg.leer) for (let i = 0; i < 9 + Math.round(fr * 6); i++) { const X = -2.9 + i * 0.42 + (i > 6 ? 0.5 : 0), Z = 3.6; spuren.push([X - 0.08, Z, 0.055], [X + 0.08, Z + 0.04, 0.055]); }
  boden(K, P, vy + 1, { flecken: [[[-0.9, 9], [0.9, 9], [1.6, 2.6], [-1.6, 2.6]]], spuren });
  if (cfg.leer) {
    // Übergang: ein Bett beiseitegeschoben, eine Luke im Boden, Leiter nach unten, kaltes Licht von unten
    const [lx, ly] = Q(P, 0.2, 0, 2.6), k = P.k(2.6);
    const lm = B.maske(); lm.poly([Q(P, -0.5, 0, 2.2), Q(P, 0.9, 0, 2.2), Q(P, 0.9, 0, 3.2), Q(P, -0.5, 0, 3.2)]);
    for (let y = lm.y0; y <= lm.y1; y++) for (let x = lm.x0; x <= lm.x1; x++) if (lm.has(x, y)) K.e[4].set(x, y, B.pk(y < lm.y0 + 3 ? NASS : '#06080a'));
    const deckel = B.maske(); deckel.poly([Q(P, -0.5, 0, 3.2), Q(P, 0.9, 0, 3.2), Q(P, 0.9, 0.9, 3.35), Q(P, -0.5, 0.9, 3.35)]); K.form(3, deckel, 0, { k: HOLZ, r: RAND, ton: 1.8, fase: 1, rand: 2, schatten: 2, muster: (x, y) => ((x - 200) % 9 === 0 ? -0.8 : 0) });
    const lei = B.maske(); for (const X of [-0.15, 0.55]) lei.poly([Q(P, X, 0, 2.5), Q(P, X + 0.05, 0, 2.5), Q(P, X + 0.05, -0.6, 2.5), Q(P, X, -0.6, 2.5)]); for (let i = 0; i < 4; i++) lei.poly([Q(P, -0.15, -i * 0.15, 2.5), Q(P, 0.6, -i * 0.15, 2.5), Q(P, 0.6, -i * 0.15 - 0.03, 2.5), Q(P, -0.15, -i * 0.15 - 0.03, 2.5)]);
    for (let y = lei.y0; y <= lei.y1; y++) for (let x = lei.x0; x <= lei.x1; x++) if (lei.has(x, y) && lm.has(x, y)) K.e[4].set(x, y, B.pk(HOLZ[3]));
    B.kegel(K.e[4], lx, ly + 4, -Math.PI / 2, 0.35, 40, NASS2, 0.4);
    bett(K, P, 3.0, 2.0, 0.62, { eb: 4, leer: true, nummer: false });
    void k;
  }
  // Vordergrund: links eine Säule angeschnitten, unten rechts eine Bank
  { const v = B.maske(); v.rect(-M, -M, 30, H + 2 * M); K.form(5, v, 0, { k: KALK.slice(1, 6), r: RAND, ton: 2.2, fase: 2, rand: 2 }); }
  B.nebel(K.e[1], { y0: vy - 16, y1: vy + 6, col: B.mix(pal.nebel[1], K.fern, 0.35), dichte: 0.12, xs: [-20, 500, 60], seed: 11 });
  luft(K);
  K.reihen = [{ y: 184, skala: 0.9, nebel: 0.22 }, { y: 200, skala: 1, nebel: 0.1 }, { y: 218, skala: 1, nebel: 0 }];
  return { mitte: [240, 212], P };
}

// Krämer: der Hausmeister. Ein Regal mit Fundsachen (jede mit Zettel), daneben der Kanonenofen, Koks.
function hausmeister(K, x, y) {
  const m = B.maske(); m.rect(x - 40, y - 64, 4, 64); m.rect(x - 6, y - 64, 4, 64); for (const yy of [y - 64, y - 44, y - 24]) m.rect(x - 42, yy, 42, 3);
  K.form(4, m, 0, { k: HOLZ, r: RAND, ton: 2.8, fase: 1, rand: 2, schatten: 2 });
  const d = B.maske(); for (let i = 0; i < 9; i++) { const xx = x - 37 + (i % 3) * 11, yy = y - 64 + Math.floor(i / 3) * 20; d.ell(xx + 4, yy - 3, 3 + (i % 2), 3); }
  K.form(4, d, 0, { k: LEINEN, r: RAND, ton: 2.6, fase: 1, rand: 1 });
  for (let i = 0; i < 9; i++) { const xx = x - 37 + (i % 3) * 11, yy = y - 64 + Math.floor(i / 3) * 20; K.e[4].set(xx + 6, yy + 1, B.pk(LEINEN[5])); K.e[4].set(xx + 7, yy + 1, B.pk(LEINEN[5])); }
  const o = B.maske(); o.rect(x + 14, y - 36, 22, 36); o.ell(x + 25, y - 36, 11, 4); o.rect(x + 22, y - 80, 6, 44); o.rect(x + 22, y - 82, 30, 5);
  K.form(4, o, 0, { k: EISEN, r: RAND, ton: 2.6, fase: 1, rand: 2, schatten: 2 });
  for (let i = 0; i < 8; i++) K.e[4].set(x + 21 + i, y - 14, B.pk(i % 3 ? '#d0601a' : '#ffb040'));
  for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x + 25, y - 14, 46, '#3a1a08', 0.9); K.licht(x + 25, y - 14, '#ff9a40', 60, 0.7);
  const k = B.maske(); for (let i = 0; i < 7; i++) k.ell(x + 44 + (i % 4) * 5, y - 2 - Math.floor(i / 4) * 4, 3, 2.5); K.form(4, k, 0, { k: EISEN, r: RAND_D, ton: 2, fase: 0, rand: 1 });
}
// Fund und Ereignis: ein Kissen auf dem Boden, darunter schaut etwas hervor, das kurz aufglimmt
function kissen(K, x, y) {
  const m = B.maske(); m.ell(x, y - 4, 13, 5); m.ell(x - 9, y - 3, 4, 4); m.ell(x + 10, y - 3, 4, 4);
  K.form(4, m, 0, { k: LEINEN, r: RAND, ton: 3.8, fase: 1, rand: 2, schatten: 2 });
  const n = B.maske(); n.ell(x - 1, y - 5, 5, 2); for (let yy = n.y0; yy <= n.y1; yy++) for (let xx = n.x0; xx <= n.x1; xx++) if (n.has(xx, yy)) K.e[4].set(xx, yy, B.pk((xx + yy) & 1 ? NASS : NASS2));
  const sh = B.maske(); sh.ell(x, y + 1, 18, 2.5); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  K.e[4].set(x + 12, y - 1, B.pk('#8a6a34')); K.e[4].set(x + 13, y - 1, B.pk('#8a6a34'));
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.4) > 0.6) { ctx.fillStyle = '#e2e8e6'; ctx.fillRect(x + 13 + ox, y - 2 + oy, 1, 1); } } });
}
// Rast: ein Nachttisch mit einer Kerze neben einem trockenen Bett
function nachttisch(K, x, y) {
  const m = B.maske(); m.rect(x - 9, y - 22, 18, 22); m.rect(x - 11, y - 24, 22, 3); K.form(4, m, 0, { k: HOLZ, r: RAND, ton: 2.6, fase: 1, rand: 2, schatten: 2 });
  const c = B.maske(); c.rect(x - 1, y - 32, 3, 8); c.rect(x - 4, y - 25, 9, 2); K.form(4, c, 0, { k: LEINEN, r: RAND, ton: 3.6, fase: 0, rand: 1 });
  B.flamme(K, x, y - 32, { p: 0.5, glanz: 6 });
  for (const L of [K.e[2], K.e[3], K.e[4]]) B.gluehen(L, x, y - 32, 60, '#3a2408', 0.85);
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' || art === 'fund' || art === 'ereignis' ? 0 : art === 'kraemer' || art === 'werkstatt' ? 1 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = halle(K, {});
  else if (art === 'uebergang') info = halle(K, { leer: true });
  else if (art === 'rast') info = schlafsaal(K, { dunkel: true });
  else info = [schlafsaal, flur, turnsaal][v](K, {});
  if (art === 'fund' || art === 'ereignis') kissen(K, info.mitte[0], info.mitte[1]);
  else if (art === 'kraemer') hausmeister(K, info.mitte[0] + 10, info.mitte[1] - 2);
  else if (art === 'rast') { for (let i = 0; i < 5; i++) B.dith(K.e[i], -M, -M, W + M, H + M, pal.koerper[0], (px, py) => 0.3 + 0.06 * i - Math.hypot(px - info.mitte[0], py - info.mitte[1] + 30) / 900); nachttisch(K, info.mitte[0], info.mitte[1]); }
  else if (art === 'werkstatt') B.werkbank(K, info.mitte[0], info.mitte[1] + 4);
  return K.fertig();
}
World._biome.waisenhaus = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 2, knick: 0.4, stein: ['#2f3336', '#3b3f42', '#494d4f', '#6a6c6b'] } };
if (World.BIOME.indexOf('waisenhaus') < 0) World.BIOME.push('waisenhaus');
})();
