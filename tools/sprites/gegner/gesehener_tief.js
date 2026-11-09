// Der Danebenhängende (Gesehener, Akt II und III, an kein Biom gebunden). Etwas Kleines, Quallenartiges, das neben
// dir in der Luft hängt und schon immer da war. Man sieht es nur, wenn man hinsieht.
// Das Falsche: In der Glocke sitzt eine senkrechte Naht, in der Augen aufeinander folgen wie Knöpfe, und der längste
// Faden endet in einem Auge, das zu Boden schaut. Es schwebt, ohne Füße.
// Durchsichtig macht das Spiel zur Laufzeit (halb durchsichtig im Bayer-Raster, schwebend, ohne Bodenschatten);
// das Sprite ist geschlossen gezeichnet, ohne Lücken und ohne Schatten.
// Silhouetten-Proben (a gebaut, b verworfen): a = schiefe Glocke mit Saumlappen und fünf dünnen Fäden;
// b = hängender Sack mit einem breiten Band (bei Entfernung nur ein Beutel, ohne Kopf und Richtung).
'use strict';
const LIB = require('../lib');

// Abstand zum Rand einer Gruppe (Chamfer), für Dither-Lücken nur im Inneren
function abstand(gid, g, W, H) {
  const d = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) d[i] = gid[i] === g ? 1e3 : 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!d[i]) continue; let m = d[i]; if (x > 0) m = Math.min(m, d[i - 1] + 1); if (y > 0) m = Math.min(m, d[i - W] + 1); if (x > 0 && y > 0) m = Math.min(m, d[i - W - 1] + 1.4); if (x < W - 1 && y > 0) m = Math.min(m, d[i - W + 1] + 1.4); d[i] = m; }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const i = y * W + x; if (!d[i]) continue; let m = d[i]; if (x < W - 1) m = Math.min(m, d[i + 1] + 1); if (y < H - 1) m = Math.min(m, d[i + W] + 1); if (x < W - 1 && y < H - 1) m = Math.min(m, d[i + W + 1] + 1.4); if (x > 0 && y < H - 1) m = Math.min(m, d[i + W - 1] + 1.4); d[i] = m; }
  return d;
}

module.exports = {
  id: 'gesehener_tief', zone: 'blick', rang: 'normal', w: 96, h: 120, fuss: [48, 114], kopf: [44, 30], rimBis: 104, todStart: 0.15,
  varianten: { gesehener_tief: {} },
  // verworfene Probe b: Sack mit einem Band (nur Silhouette)
  proben: {
    sack() {
      const { E, C, Pg } = LIB;
      return [{ p: [E(46, 52, 20, 26, null), Pg([[30, 66], [62, 66], [66, 100], [58, 104], [52, 84], [44, 106], [34, 96]], null, { rd: 1 }), C(46, 30, 40, 18, 5, 3, null)], k: 3 }];
    },
  },
  bild(p, v, A) {
    const { E, C, glied, r, bay } = A;
    const f = p.f, q = p.q, W = 96, H = 120;
    // puls: Glocke weitet (>1) oder zieht sich zusammen (<1); lunge: Versatz der Figur nach links; peitsch: Fäden nach vorn
    let wob = 0, puls = 1, hub = 0, peitsch = 0, lunge = 0, tilt = 0.14, sway = 0, fall = 0, slack = 0, augen = 1;
    if (p.idle) { hub = [0, -1, -1, 0][f]; sway = f * 0.7; wob = [0, 1, 0, 1][f]; }
    if (p.angriff) { puls = [1.12, 1.2, 0.78, 0.92][f]; hub = [-3, -8, 0, -1][f]; peitsch = [-0.3, -0.6, 1, 0.45][f]; lunge = [2, 6, -18, -8][f]; tilt = [0.2, 0.3, -0.12, 0.05][f]; sway = 1.5 + f; augen = [1, 1, 3, 2][f]; }
    if (p.treffer) { puls = [0.9, 0.97][f]; lunge = [5, 2][f]; tilt = [0.3, 0.2][f]; peitsch = -0.2; sway = 2 + f; }
    if (p.tod) { fall = r(q * 42); puls = 1 - q * 0.25; slack = q; peitsch = -0.15; tilt = 0.14 + q * 0.3; sway = 2 + f; }
    const cx = 46 + lunge, by = 46 + hub + fall;
    const bw = 21 / Math.sqrt(puls), bh = 24 * puls * (1 - 0.5 * slack);
    const cs = Math.cos(tilt), sn = Math.sin(tilt);
    const rot = (x, y) => [cx + (x - cx) * cs - (y - by) * sn, by + (x - cx) * sn + (y - by) * cs];
    // Glocke: gewölbt, Saum in sechs Lappen
    const pts = [];
    for (let i = 0; i <= 20; i++) { const a = Math.PI + i / 20 * Math.PI; pts.push(rot(cx + Math.cos(a) * bw, by + Math.sin(a) * bh)); }
    for (let i = 0; i <= 12; i++) pts.push(rot(cx + bw - i / 12 * bw * 2, by + (i % 2 ? 7 - 3 * slack - (i % 4 === 1 ? wob : 0) : 1)));
    const glocke = { t: 'p', v: pts, m: null, rd: 1.5, b: 3 };
    // Bänder: vier breite, gekräuselte Fäden, verschieden lang; der zweite trägt das Auge am Ende
    const laenge = [46, 58, 40, 50], faeden = [], knoten = []; let spitze = [0, 0];
    for (let i = 0; i < 4; i++) {
      const [x0, y0] = rot(cx - bw * 0.7 + i * bw * 0.46, by + 3), L = laenge[i] * (1 - 0.6 * slack), P = [];
      for (let k = 0; k <= 10; k++) {
        const t = k / 10;
        const x = x0 + Math.sin(t * 2.6 + sway + i * 1.7) * (0.1 + t * 0.55) * (1 - 0.5 * slack) - peitsch * t * t * (26 + 4 * i) - lunge * 0.5 * t + (i - 1.5) * t * 3 + [-5, 5, -4, 6][i] * Math.sin(Math.PI * t) * (1 - 0.6 * slack) + [3, -3, 4, -4][i] * t * t * t;
        P.push([x, Math.min(106, y0 + t * L)]);
        if ((k === 5 || k === 8) && i !== 1) knoten.push([i, E(x, Math.min(106, y0 + t * L), 2.2, 2.2, null, { pf: 'dome' })]);
      }
      if (i === 1) { spitze = P[10]; knoten.push([i, E(P[10][0], P[10][1], 3, 3, null, { pf: 'dome' })]); }
      faeden.push([i, glied(P, 2.8, 1.1, null)]);
    }
    // Knospe: eine zweite, kleine Glocke wächst an der rechten Schulter und hängt tiefer
    const [kx, ky] = rot(cx + bw * 0.95, by + 9);
    const kp = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; kp.push([kx + Math.cos(a) * 8, ky + Math.sin(a) * 9 * (1 - 0.3 * slack)]); }
    for (let i = 0; i <= 6; i++) kp.push([kx + 8 - i / 6 * 16, ky + (i % 2 ? 5 : 0)]);
    const knospe = { t: 'p', v: kp, m: null, rd: 1, b: 2.5 };
    const knospenFaden = glied([[kx - 3, ky + 3], [kx - 3 - peitsch * 4, ky + 14], [kx - 1 - peitsch * 8, ky + 26 * (1 - 0.6 * slack)]], 2, 0.8, null);
    // zwei Mundarme: kurz, breit, gekräuselt
    const arme = [];
    for (const o of [-3, 4]) {
      const P = []; const [x0, y0] = rot(cx + o, by + 2);
      for (let k = 0; k <= 6; k++) { const t = k / 6; P.push([x0 + Math.sin(t * 4 + sway * 0.5 + o) * (0.4 + t * 0.7) - peitsch * t * t * 12, Math.min(106, y0 + t * 26 * (1 - 0.6 * slack))]); }
      arme.push(...glied(P, 3.2, 1, null));
    }
    const hinten = faeden.filter(([i]) => i % 2).flatMap(([, g]) => g).concat(knoten.filter(([i]) => i % 2).map(([, e]) => e));
    const vorn = faeden.filter(([i]) => !(i % 2)).flatMap(([, g]) => g).concat(knoten.filter(([i]) => !(i % 2)).map(([, e]) => e));
    const gruppen = [
      { p: hinten, k: 0.6 },
      { p: [glocke], k: 2 },
      { p: arme, k: 1.2 },
      { p: vorn, k: 0.6 },
      { p: [knospe, ...knospenFaden], k: 1.5 },
    ];
    gruppen.forEach(g => { g.anker = [lunge, hub + fall]; });
    const pal = LIB.palette('blick');
    const { gid } = LIB.render(W, H, gruppen, pal, { rimBis: 104 });
    const aus = p.tod && f >= 1;
    const details = P => {
      const ox = lunge, oy = hub + fall;
      // Auge mit gedithertem Glühen, Dither wandert mit der Figur (kein Flackern beim Schweben)
      const auge = (x, y, gr) => {
        x = r(x); y = r(y);
        for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) { const q = Math.hypot(i, j) / (gr + 3.5); if (q >= 1) continue; const c = P.get(x + i, y + j); if (c < 1 || c > 4) continue; const vv = 0.9 * (1 - q) * (1 - q); if (vv > 0.45 + bay(x + i - ox, y + j - oy) * 0.4) P.set(x + i, y + j, 'glutDim'); }
        P.set(x, y, 'kern'); if (gr === 2) P.set(x + 1, y, 'glut'); if (gr === 3) { P.set(x - 1, y, 'glut'); P.set(x + 1, y, 'glut'); P.set(x, y - 1, 'glut'); P.set(x, y + 1, 'glut'); }
      };
      // Gekröse: zwei Hufeisen in der Glocke
      const gx = cx, gy = by - bh * 0.3;
      for (const [rad, c] of [[0.34, 'k3'], [0.2, 'k2']]) for (let a = 0.1 * Math.PI; a <= 0.9 * Math.PI; a += 0.07) { const [x, y] = rot(gx + Math.cos(a) * bw * rad * 1.4, gy + Math.sin(a) * bh * rad * 1.5); if (gid[r(y) * W + r(x)] === 1) P.set(x, y, c); }
      // Naht mit Augen: von unten nach oben kleiner
      if (!aus) {
        const sz = [3, 2, 1];
        [-4, -10, -16].forEach((dy, k) => {
          const [ex, ey] = rot(cx - 1, by + dy * (bh / 24));
          P.el(ex, ey, 3.5, 3.5, 'k0', false);
          auge(ex, ey, augen === 3 ? 3 : sz[k] === 3 ? 2 : sz[k]);
          if (k < 2 && augen > 1) P.set(ex - 3, ey, 'glutDim');
        });
        P.el(kx, ky - 2, 2.5, 2.5, 'k0'); P.set(kx - 1, ky - 2, 'kern'); P.set(kx, ky - 2, 'glut'); P.set(kx + 1, ky - 2, 'glut');
        P.set(spitze[0], spitze[1], 'kern'); P.set(spitze[0], spitze[1] + 1, 'glut');
      } else { const [ex, ey] = rot(cx - 1, by - 4); P.set(ex, ey, 'k0'); }
    };
    const augenListe = [];
    if (!aus) [-4, -10, -16].forEach(dy => { const [ex, ey] = rot(cx - 1, by + dy * (bh / 24)); augenListe.push([ex, ey]); });
    if (!aus) augenListe.push(spitze, [kx - 1, ky - 2]);
    return { gruppen, details, augen: augenListe };
  },
};
