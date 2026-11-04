// Wächter Gezeitenwerk: Der Regulator. Ein Pendel, das einen Körper hat. Oben der Anker der Hemmung
// mit zwei Krallen, darunter eine Stange aus Wirbeln, unten eine hohle Linse aus grüner Bronze. Darin
// liegt jemand zusammengerollt und hält die Stange mit sieben Fingern fest. Unter ihm der Gradbogen
// am Boden; die Spitze streicht darüber, von der einen Reihe zur anderen.
'use strict';
const LIB = require('../lib');
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

module.exports = {
  id: 'regulator', biom: 'gezeitenwerk', zone: 'gezeitenwerk', rang: 'waechter', w: 160, h: 180, fuss: [80, 174], kopf: [80, 8], rimBis: 178,
  varianten: { regulator: {} },
  // Silhouetten-Probe (verworfen): eine volle Linse ohne Loch las sich wie ein Schild an einer Stange;
  // erst die hohle Linse mit dem Körper darin zeigt, was hier pendelt.
  proben: { probe_voll: { voll: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180;
    let a = 0, fall = 0, kauer = 0, blick = 0;
    const scher = 0, dxIdle = p.idle ? [-1, 0, 1, 0][f] : 0; // Leerlauf: Pendeln als ganzzahlige Verschiebung (kein kriechender Dither)
    if (p.angriff) { a = [0.18, 0.27, -0.3, -0.1][f]; kauer = [1, 2, -1, 0][f]; blick = [0, 1, 2, 1][f]; }
    if (p.treffer) a = [0.09, 0.05][f];
    if (p.tod) { a = p.q * 0.08; fall = r(Math.max(0, p.q - 0.2) * 40); }
    const px = 80, py = 12, L = 100;
    const rot = (x, y) => [px + x * Math.cos(a) - y * Math.sin(a), py + x * Math.sin(a) + y * Math.cos(a)];
    const Cr = (x1, y1, x2, y2, r1, r2, m, o) => { const [a1, b1] = rot(x1, y1), [a2, b2] = rot(x2, y2); return C(a1, b1, a2, b2, r1, r2, m, o); };
    const Er = (x, y, rx, ry, m, o) => { const [cx, cy] = rot(x, y); return E(cx, cy, rx, ry, m, o); };
    const Pr = (pts, m, o) => Pg(pts.map(([x, y]) => rot(x, y)), m, o);
    // fester Balken oben (dreht nicht mit), Lager
    const balken = [Pg([[44, -4], [116, -4], [112, 7], [48, 7]], null, { rd: 0.6 })];
    const lager = [E(px, py, 7, 7, null, { pf: 'bevel' })];
    // Anker der Hemmung: ein Bogen wie Schultern, zwei Krallen zeigen nach unten
    const anker = [Pr([[-38, 18], [-30, 10], [-12, 4], [12, 4], [30, 10], [38, 18], [34, 22], [26, 15], [10, 11], [-10, 11], [-26, 15], [-34, 22]], null, { rd: 1.2 })];
    const krallen = [Cr(-36, 20, -40, 32, 3, 1.6, null), Cr(-40, 32, -36, 38, 1.6, 0.8, null), Cr(36, 20, 40, 32, 3, 1.6, null), Cr(40, 32, 36, 38, 1.6, 0.8, null)];
    // Stange aus Wirbeln: abwechselnd Wirbelkörper und dünne Stücke
    const wirbel = [];
    for (let i = 0; i < 7; i++) { const y0 = 17 + i * 8.4; wirbel.push(Cr(0, y0, 0, y0 + 5, 4.4 - i * 0.12, 4 - i * 0.12, null), Cr(-6, y0 + 2.5, 6, y0 + 2.5, 1.2, 1.2, null), Cr(1, y0 + 2, 4, y0 - 2, 1.4, 0.8, null)); }
    const stange = [Cr(0, 14, 0, L + 32 + kauer, 1.5, 1.2, null)];
    // Linse: hohler Ring aus Bronze
    const lx = 0, ly = L, lrx = 44, lry = 34;
    const linse = [Er(lx, ly, lrx, lry, null, { pf: 'bevel' })];
    const spitze = [Cr(0, L + lry - 2, 0, L + lry + 20, 3, 0.9, null)];
    // Körper in der Linse: zusammengerollt, Rücken rechts, Kopf oben links, Knie unten links
    // Körper in der Linse: zusammengerollt, Rücken rechts, Kopf oben links, Knie unten links (Maßstab 1,5)
    const k = kauer, S = 1.55, Q = (x, y) => [x * S, L + y * S];
    const PrS = (pts, m, o) => Pr(pts.map(([x, y]) => Q(x, y)), m, o);
    const CrS = (x1, y1, x2, y2, r1, r2, m) => { const [a1, b1] = Q(x1, y1), [a2, b2] = Q(x2, y2); return Cr(a1, b1, a2, b2, r1 * S, r2 * S, m); };
    const ErS = (x, y, rx, ry, m, o) => { const [a1, b1] = Q(x, y); return Er(a1, b1, rx * S, ry * S, m, o); };
    const ruecken = [PrS([[-4, -15 + k], [8, -17], [17, -9], [19, 3], [13, 13], [2, 15 - k], [-6, 8], [-2, -4]], null, { rd: 2 })];
    const wirbelR = [0, 1, 2, 3, 4].map(i => { const t = -1.2 + i * 0.55; return ErS(8 + Math.cos(t) * 10.5, -1 + Math.sin(t) * 13, 1.5, 1.5, null); });
    const kopf = [ErS(-11 - blick * 0.6, -11 + k, 6, 5.5, 'haut', { pf: 'bevel' })];
    const schaedelnaht = [CrS(-15 - blick * 0.6, -14 + k, -7 - blick * 0.6, -15 + k, 0.4, 0.4, 'dunkel')];
    const knie = [ErS(-13, 7 - k, 5.5, 4.6, null), CrS(-13, 7 - k, -1, 14, 3.4, 3, null), CrS(-14, 9 - k, -10, 16, 2, 1.4, null)];
    const arm = [CrS(9, -11, -5, -3, 2.2, 1.8, null), CrS(-5, -3, -1, 1, 1.8, 1.6, null)];
    const finger = []; for (let i = 0; i < 7; i++) finger.push(CrS(-2.5 + i * 0.75, -0.5 + (i % 2) * 0.6, 2.8, 1.2 + i * 0.7, 0.42, 0.38, null));
    const gruppen = [
      { p: balken, k: 0, kante: true },
      { p: stange, k: 0 },
      { p: krallen, k: 1, kante: true },
      { p: anker, k: 0, kante: true },
      { p: lager, k: 0, kante: true },
      { p: wirbel, k: 0.8, kante: true },
      { p: spitze, k: 0 },
      { p: linse, k: 0, kante: true },
      { p: ruecken, k: 1.5, kante: true },
      { p: wirbelR, k: 0, noRim: true, tone: 0.1 },
      { p: knie, k: 1.2, kante: true },
      { p: kopf, k: 0, kante: true },
      { p: schaedelnaht, k: 0, noRim: true },
      { p: arm, k: 0.6, kante: true },
      { p: finger, k: 0, kante: true },
    ];
    const LINSE = 7, KOERPER0 = 8;
    const dxb = r(-(L) * Math.sin(a)), dyb = r(L * Math.cos(a) - L);
    gruppen.forEach((g, i) => { g.anker = i >= 5 ? [dxb, dyb] : [0, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('gezeitenwerk'));
    const augen = [];
    const details = P => {
      // Loch in der Linse: was zur Linse gehört und innen liegt, verschwindet; Randlicht an der Lochkante
      const [cx, cy] = rot(lx, ly);
      const innen = (x, y) => { const dx = x + 0.5 - cx, dy = y + 0.5 - cy, u = dx * Math.cos(-a) - dy * Math.sin(-a), w = dx * Math.sin(-a) + dy * Math.cos(-a); return (u / (lrx - 6.5)) ** 2 + (w / (lry - 5.5)) ** 2 < 1; };
      const loch = (x, y) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === LINSE && innen(x, y);
      if (!v.voll) {
        const z = [];
        for (let y = r(cy - lry - 2); y <= r(cy + lry + 2); y++) for (let x = r(cx - lrx - 2); x <= r(cx + lrx + 2); x++) {
          if (loch(x, y)) continue; const gi = gid[y * W + x]; if (gi !== LINSE) continue;
          if (loch(x + 1, y - 1) || (loch(x + 1, y) && loch(x, y - 1))) z.push([x, y, 'r1']);
          else if (loch(x - 1, y + 1) || loch(x - 1, y)) z.push([x, y, 'k0']);
        }
        for (let y = r(cy - lry); y <= r(cy + lry); y++) for (let x = r(cx - lrx); x <= r(cx + lrx); x++) if (loch(x, y)) P.loesch(x, y);
        // die Stange läuft hinter dem Körper durch das Loch
        for (let y = r(cy - lry); y <= r(cy + lry); y++) for (let x = r(cx - lrx); x <= r(cx + lrx); x++) if (!P.get(x, y) && gid[y * W + x] === LINSE && innen(x, y)) {
          const dx = x + 0.5 - cx, dy = y + 0.5 - cy, u = dx * Math.cos(-a) - dy * Math.sin(-a); if (Math.abs(u) < 1.4) P.set(x, y, u > 0.5 ? 'r1' : 'k1');
        }
        for (const [x, y, c] of z) P.set(x, y, c);
      }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Rücken des Zusammengerollten: Rippen als Bögen (Grat hell, Tal dunkel), Spalt zwischen Schenkel und Leib
      if (!fall) {
        for (let i = 0; i < 4; i++) for (let t = -0.9; t <= 0.5; t += 0.06) {
          const rr = 6 + i * 3, [x, y] = rot((7 + Math.cos(t) * rr) * 1.55 - 6, L + (-2 + Math.sin(t) * rr * 1.1) * 1.55 * 0.7);
          const gi = gid[r(y) * W + r(x)]; if (gi === KOERPER0) P.auf(x, y, i % 2 ? 'k0' : 'k3');
        }
        for (let t = 0; t <= 1; t += 0.05) { const [x, y] = rot((-6 + t * 12) * 1.55, L + (4 + t * 4 - k) * 1.55); if (gid[r(y) * W + r(x)] >= KOERPER0) P.auf(x, y, 'k0'); }
      }
      // Linse: sieben Nieten im Ring, eine davon blank; Abdrücke von sieben Fingern am oberen Rand
      for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 2, [x, y] = rot(lx + Math.cos(t) * (lrx - 3), ly + Math.sin(t) * (lry - 2.8)); if (gid[r(y) * W + r(x)] === LINSE && P.get(r(x), r(y))) P.set(x, y, i === 3 ? 'bronze' : (i % 2 ? 'k0' : 'r1')); }
      for (let i = 0; i < 7; i++) { const [x, y] = rot(-14 + i * 4, ly - lry + 1.5); if (gid[r(y) * W + r(x)] === LINSE) P.auf(x, y, i % 2 ? 'glutDim' : 'k3'); }
      // Gradbogen am Boden: fest, mit Teilstrichen; die beiden Enden leuchten (die zwei Reihen)
      const gy = 168 + fall * 0;
      for (let t = -1; t <= 1.0001; t += 0.004) {
        const x = 80 + t * 62, y = gy + (1 - t * t) * 5;
        P.set(x, y, 'k2'); P.set(x, y + 1, 'k1'); P.set(x, y - 1, t > 0.1 ? 'r1' : 'k3');
      }
      for (let i = -6; i <= 6; i++) { const t = i / 6, x = 80 + t * 62, y = gy + (1 - t * t) * 5; P.set(x, y + 2, 'k0'); P.set(x, y + 3, i % 3 === 0 ? 'r1' : 'k1'); }
      for (const t of [-0.82, 0.82]) { const x = 80 + t * 62, y = gy + (1 - t * t) * 5; P.set(x, y - 2, 'glut'); P.set(x, y - 3, 'glutDim'); }
      // Augen: zwei, eng, im Gesicht des Zusammengerollten; im Angriff sieht es dich an
      if (!p.tod || f < 1) {
        const [ex, ey] = rot((-14 - blick * 0.6) * 1.55, L + (-11 + k) * 1.55);
        P.auge(ex, ey, p.angriff && f === 2 ? 3 : 2); P.auge(ex + 4, ey - 1, 1);
        augen.push([r(ex), r(ey)], [r(ex + 4), r(ey - 1)]);
        // das Lager oben glimmt
        P.set(px, py, 'glutDim'); P.set(px, py - 1, 'glut');
      }
      if (scher) for (let y = py + 1; y < 163; y++) { const d = r(-scher * (y - py)); if (!d) continue; const row = []; for (let x = 0; x < W; x++) row.push(P.get(x, y)); for (let x = 0; x < W; x++) { const sx = x - d; if (sx >= 0 && sx < W && row[sx]) P.set(x, y, row[sx]); else P.loesch(x, y); } }
      // Tod: alles unterhalb der Linse sinkt, die Spitze bricht
      if (fall) { for (let y = H - 1; y >= 0; y--) for (let x = 0; x < W; x++) { const gi = gid[y * W + x]; if (gi >= LINSE - 1 && y + fall < H && y > 40) { const c = P.get(x, y); if (c) { P.loesch(x, y); P.set(x, y + fall, c); } } } }
    };
    return { gruppen, details, augen, dx: dxIdle };
  },
};
