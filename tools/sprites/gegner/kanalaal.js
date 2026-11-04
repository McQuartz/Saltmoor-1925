// Gezeitenwerk: Der Kanalaal. Ein Aal steigt in einem hohen S aus einem Stück Bronzekanal.
// Wo der Kopf sein müsste, sitzt eine offene Hand mit sieben Fingern, in der Handfläche ein Auge.
// Entlang der Seitenlinie sieben Lichter. Das Wasser läuft an ihm hinauf, nicht hinab.
'use strict';
const LIB = require('../lib');
// Innenkanten (wie beim Zahnrad-Wärter): vordere Teile fangen an ihrer Lichtkante eine Linie Randlicht
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
// Punkte einer glatten Kurve (Catmull-Rom) durch Stützpunkte
function kurve(st, n) {
  const out = [];
  for (let i = 0; i < st.length - 1; i++) {
    const p0 = st[Math.max(0, i - 1)], p1 = st[i], p2 = st[i + 1], p3 = st[Math.min(st.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(st[st.length - 1]); return out;
}

module.exports = {
  id: 'kanalaal', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 96, h: 120, fuss: [48, 115], kopf: [44, 6], rimBis: 113,
  varianten: {
    kanalaal_a: { st: [[42, 104], [58, 84], [62, 66], [44, 50], [38, 34], [46, 22]], r0: 7.5, r1: 4.2, faust: false },
    kanalaal_b: { st: [[50, 104], [36, 86], [36, 66], [56, 50], [60, 34], [50, 20]], r0: 7, r1: 4, faust: false, hoch: 3, ecke: true },
  },
  // Silhouetten-Proben (nicht gebaut): der Aal flach im Kanal mit gehobener Hand las sich als Schlange
  // mit Fächer; ein Kopf als geballte Faust verlor das Merkmal der sieben Finger.
  proben: {
    probe_flach: { st: [[14, 104], [40, 100], [66, 98], [80, 84], [82, 66]], r0: 6, r1: 4.5 },
    probe_faust: { st: [[42, 104], [58, 84], [62, 66], [44, 50], [38, 34], [46, 22]], r0: 7.5, r1: 4.2, faust: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 96, H = 120;
    let sw = 0, kx = 0, ky = 0, fing = 0, fall = 0, tropf = 0;
    if (p.idle) { sw = [0, 1, 1, 0][f]; fing = [0, 1, 2, 1][f]; tropf = f; }
    if (p.angriff) { kx = [7, 10, -26, -8][f]; ky = [6, -6, 30, 8][f]; fing = [2, 3, -1, 0][f]; }
    if (p.treffer) { kx = [4, 2][f]; ky = [-2, -1][f]; fing = 3; }
    if (p.tod) { fall = r(p.q * 70); fing = -1; }
    // Stützpunkte: die oberen folgen dem Kopf stärker als die unteren
    const n = v.st.length, ww = v.hoch || 0;
    const st = v.st.map(([x, y], i) => { const q = i / (n - 1), w = q * q; return [x + kx * w + sw * q * (i % 2 ? 1 : -1), y + ky * w + fall - ww * q]; });
    const pts = kurve(st, 6);
    const kette = [], bauch = [], flosse = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const q = i / (pts.length - 1), rad = v.r0 + (v.r1 - v.r0) * q;
      kette.push(C(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], rad, rad, null));
      // Bauch: helleres Band auf der linken (lichtabgewandten) Seite, schmaler
      const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      const s = nx < 0 ? 1 : -1; // Normale nach links
      if (q > 0.08 && q < 0.85) bauch.push(C(pts[i][0] + nx * s * rad * 0.45, pts[i][1] + ny * s * rad * 0.45, pts[i + 1][0] + nx * s * rad * 0.45, pts[i + 1][1] + ny * s * rad * 0.45, rad * 0.42, rad * 0.42, 'haut'));
      // Rückenflosse: ein durchgehender Saum mit feinen Strahlen auf der rechten Seite
      if (q > 0.12 && q < 0.82) { const o1 = rad + 1.2 + Math.sin(q * 40) * 0.6, bx = pts[i][0] - nx * s * o1, by = pts[i][1] - ny * s * o1, cx2 = pts[i + 1][0] - nx * s * o1, cy2 = pts[i + 1][1] - ny * s * o1;
        flosse.push(C(bx, by, cx2, cy2, 1.1, 1.1, null)); if (i % 3 === 0) flosse.push(C(bx, by, bx - nx * s * 3 + 0.5, by - ny * s * 3 - 1, 0.7, 0.5, null)); }
    }
    // Hand statt Kopf: Handfläche schräg nach oben links, sieben Finger fächern
    const hx = st[n - 1][0], hy = st[n - 1][1];
    const handflaeche = E(hx - 1, hy - 1, 8, 6.5, 'haut', { pf: 'bevel' });
    const finger = [], knoechel = [];
    for (let i = 0; i < 7; i++) {
      // Finger zeigen nach oben links und krümmen sich nach vorn (zu dir), jeder mit zwei Gelenken
      const a = -Math.PI * 0.5 - 0.7 + i * 0.24 + (p.angriff && f === 2 ? 0.9 : 0);
      const len = (v.faust ? 5 : 15 + [-3, 0, 2, 3, 2, 0, -3][i]) - (fing > 2 ? 4 : 0);
      const k1 = [hx - 1 + Math.cos(a) * 6.5, hy - 1 + Math.sin(a) * 5.5];
      const a2 = a - 0.35 - fing * 0.1, a3 = a2 - 0.55 - fing * 0.12;
      const k2 = [k1[0] + Math.cos(a) * len * 0.42, k1[1] + Math.sin(a) * len * 0.42];
      const k3 = [k2[0] + Math.cos(a2) * len * 0.33, k2[1] + Math.sin(a2) * len * 0.33];
      const k4 = [k3[0] + Math.cos(a3) * len * 0.25, k3[1] + Math.sin(a3) * len * 0.25];
      finger.push(C(k1[0], k1[1], k2[0], k2[1], 1.4, 1.15, null), C(k2[0], k2[1], k3[0], k3[1], 1.1, 0.9, null), C(k3[0], k3[1], k4[0], k4[1], 0.85, 0.5, null));
      knoechel.push(k2);
    }
    // Kanalstück: Trog aus Bronze, schräg gesehen; vorne die Wand, oben die Lippe, innen das Wasser
    const tx0 = v.ecke ? 16 : 14, tx1 = v.ecke ? 84 : 80, ty = 98;
    const trogHinten = Pg([[tx0 + 6, ty - 6], [tx1 + 8, ty - 6], [tx1 + 8, ty], [tx0 + 6, ty]], null, { rd: 0.5 });
    const trogVorn = Pg([[tx0, ty], [tx1, ty], [tx1, 114], [tx0, 114]], null, { rd: 0.6 });
    const trogSeite = Pg([[tx1, ty], [tx1 + 8, ty - 6], [tx1 + 8, 108], [tx1, 114]], null, { rd: 0.4 });
    const lippe = Pg([[tx0 - 1, ty - 1], [tx1 + 1, ty - 1], [tx1 + 1, ty + 2], [tx0 - 1, ty + 2]], null, { rd: 0.3 });
    const gruppen = [
      { p: [trogHinten], k: 0, tone: -0.2 },
      { p: kette, k: 2, anker: [0, r(fall)] },
      { p: flosse, k: 0, anker: [0, r(fall)] },
      { p: bauch, k: 1.5, tone: 0.05, kante: true, noRim: true, anker: [0, r(fall)] },
      { p: [handflaeche], k: 0, kante: true },
      { p: finger, k: 0.6, kante: true },
      { p: [trogSeite], k: 0, tone: -0.1 },
      { p: [trogVorn], k: 0, kante: true, tone: 0.1 },
      { p: [lippe], k: 0, kante: true },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('gezeitenwerk'));
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Wasser im Trog zwischen Lippe und Körper: Fläche in Wasserfarbe, Ringe um den Leib
      for (let x = tx0 + 7; x < tx1 + 7; x++) for (let y = ty - 5; y < ty - 1; y++) { const gi = gid[y * W + x]; if (gi === 0) P.set(x, y, (x + y * 3) % 7 === 0 ? 'r1' : ((x + y) & 1) ? 'wasser' : 'k2'); }
      const bx = st[0][0];
      if (!p.tod) for (let k = 0; k < 2; k++) { const rr = 10 + k * 5 + (p.idle ? f % 2 : 0); for (let x = r(bx - rr); x <= r(bx + rr); x += 2) { const y = ty - 3 - (k % 2); if (gid[y * W + x] === 0) P.set(x, y, 'r1'); } }
      // Nieten und Fugen am Trog
      for (let x = tx0 + 4; x < tx1; x += 9) { P.auf(x, ty + 5, 'r1'); P.auf(x, 110, 'k0'); }
      for (let y = ty + 3; y < 114; y++) P.auf(tx0 + 33, y, 'k0');
      // Knöchel: blank, eine Stufe heller
      for (const [x, y] of knoechel) P.auf(x, y, 'k3');
      // Fingerabdruck auf der Lippe: sieben blanke Punkte
      for (let i = 0; i < 7; i++) P.auf(tx0 + 46 + i * 1.5, ty + (i % 2), i === 0 || i === 6 ? 'k3' : 'bronze');
      // Seitenlinie: sieben Lichter entlang des Leibs
      if (!p.tod || f < 1) {
        for (let i = 0; i < 7; i++) {
          const q = 0.18 + i * 0.09, j = Math.min(pts.length - 2, Math.floor(q * (pts.length - 1)));
          const x = pts[j][0] + 1, y = pts[j][1];
          if (y < ty - 2) { P.set(x, y, i % 3 === 0 ? 'glut' : 'glutDim'); if (i === 3) augen.push([r(x), r(y)]); }
        }
        // Auge in der Handfläche
        P.auge(hx - 1, hy - 1, 3); augen.push([r(hx - 1), r(hy - 1)]);
        // Wasser läuft am Leib hinauf
        for (let k = 0; k < 4; k++) { const q = ((k * 0.22 + tropf * 0.05) % 0.8) + 0.08, j = Math.floor(q * (pts.length - 1)); const x = pts[j][0] - 2, y = pts[j][1]; if (y < ty - 2) P.auf(x, y, 'wasser'); }
      }
      if (p.tod) for (let y = 115; y < H; y++) for (let x = 0; x < W; x++) P.loesch(x, y);
      // Unterhalb der Wasserlinie bleibt nur, was vor dem Trog liegt (der Aal sinkt hinein)
      if (p.tod) for (let y = ty - 1; y < 115; y++) for (let x = 0; x < W; x++) { const gi = gid[y * W + x]; if (gi >= 1 && gi <= 5) P.loesch(x, y); }
    };
    return { gruppen, details, augen };
  },
};
