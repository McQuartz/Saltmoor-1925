// Leuchtturmhof, zweiter Wächter: Das Nebelhorn. Der Hornwärter Jens Ohm hat in der Nacht, als die „Gesine“
// an der Klippe auflief, das Horn nicht geblasen, weil die Küste abgedunkelt bleiben sollte. Jetzt trägt er
// den Schalltrichter statt des Kopfes, und auf dem Rücken den Blasebalg aus dem Nebelhornhaus. Er bläst nicht
// hinaus. Das Horn zieht ein: Nebel, Licht, Schall, alles strömt in den Trichter. Wenn es voll ist, kommt
// alles auf einmal zurück. Tief im Rohr brennt das Licht, das es aus der Laterne gesogen hat.
'use strict';
const KA = require('./hilfe/kanten');
const LIB = require('../lib');

module.exports = {
  id: 'nebelhorn', biom: 'leuchtturm', zone: 'leuchtturm_horn', rang: 'waechter', w: 160, h: 180, fuss: [106, 176], kopf: [70, 30], rimBis: 174,
  varianten: { nebelhorn: {} },
  // Silhouetten-Probe (nicht gebaut): der Trichter senkrecht nach oben wie ein Schornstein; schwarz eine Glocke
  // oder ein Trichter auf einem Mantel, zu nah an der Glockenmutter (Kapelle). Genommen: der Trichter
  // waagerecht nach vorn, auf dich gerichtet, dazu der Blasebalg als Buckel.
  proben: { probe_senkrecht: { senkrecht: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let lean = 0, hoch = 0, fall = 0, balg = 0.5, sog = 1, stoss = 0, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; balg = [0.5, 0.6, 0.7, 0.6][f]; sog = 1; }
    if (p.angriff) { lean = [4, 6, -9, -3][f]; hoch = [5, 9, -3, 0][f]; balg = [0.9, 1, 0, 0.2][f]; sog = [1.6, 2, 0, 0][f]; stoss = [0, 0, 1, 0.5][f]; }
    if (p.treffer) { lean = [3, 1][f]; balg = 0.4; }
    if (p.tod) { fall = r(p.q * 18); lean = r(p.q * 3); hoch = -r(p.q * 10); balg = 0; sog = 0; }
    const X = lean, Y = atem + fall;
    // Stiefel (fest), Mantel aus Ölzeug, Blasebalg auf dem Rücken
    const stiefel = [Pg([[90, 160], [102, 160], [104, 176], [86, 176]], null, { rd: 1 }), Pg([[108, 160], [120, 160], [124, 176], [106, 176]], null, { rd: 1 })];
    const mantel = Pg([[92 + X, 82 + Y], [98 + X, 72 + Y], [110 + X, 68 + Y], [122 + X, 72 + Y], [127 + X * 0.8, 90 + Y], [131 + X * 0.5, 128 + Y], [138, 162], [132, 167], [108, 165], [96, 168], [78, 164], [83 + X * 0.5, 126 + Y], [87 + X * 0.8, 98 + Y]], null, { rd: 2.5 });
    const kragen = Pg([[96 + X, 68 + Y], [104 + X, 62 + Y], [116 + X, 62 + Y], [120 + X, 70 + Y], [112 + X, 76 + Y], [98 + X, 76 + Y]], null, { rd: 2 });
    const bh = 34 + balg * 14;
    const balgP = Pg([[120 + X, 78 + Y], [138 + X, 74 + Y - balg * 4], [146 + X, 80 + Y], [146 + X, 80 + Y + bh], [138 + X, 86 + Y + bh], [122 + X, 84 + Y + bh * 0.9]], null, { rd: 1.4 });
    // Rohr vom Balg über die Schulter zum Trichter
    const rohr = glied([[140 + X, 76 + Y], [136 + X, 62 + Y], [122 + X, 56 + Y], [108 + X, 60 + Y + hoch * 0.3]], 3, 2.6, null);
    // Der Trichter: vom Hals nach vorn links, öffnet sich exponentiell; hoch = nach oben geneigt (Einziehen)
    const N = [104 + X, 66 + Y], M = [34 + X * 1.4, 72 + Y - hoch * 1.4 + (v.senkrecht ? -60 : 0)];
    if (v.senkrecht) { M[0] = 106 + X; M[1] = 6; }
    const ax = M[0] - N[0], ay = M[1] - N[1], L = Math.hypot(ax, ay), ux = ax / L, uy = ay / L, nx = -uy, ny = ux;
    const rad = t => 4.2 + 19 * Math.pow(t, 2.4);
    const oben = [], unten = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16, cx = N[0] + ax * t, cy = N[1] + ay * t, rr = rad(t); oben.push([cx + nx * rr, cy + ny * rr]); unten.push([cx - nx * rr, cy - ny * rr]); }
    const trichter = Pg([...oben, ...unten.reverse()], null, { rd: 0.8 });
    // Mündung: die Öffnung als Ellipse (schräg gesehen), Wulst am Rand
    const mx = M[0], my = M[1], mR = rad(1);
    const muendung = E(mx - ux * 1, my - uy * 1, 6.5, mR + 1.5, null, { pf: 'flat' });
    // Arme: vorn hält er den Trichter am Rand, hinten zieht er den Hebel des Balgs
    const hv = [N[0] + ax * 0.55 + nx * rad(0.55), N[1] + ay * 0.55 + ny * rad(0.55) + 2];
    const armV = [...glied([[96 + X, 80 + Y], [86 + X, 96 + Y], [hv[0] + 2, hv[1] + 4]], 4, 3, null), E(hv[0] + 1, hv[1] + 3, 3.6, 3.2, 'haut')];
    const hebel = [126 + X - balg * 4, 118 + Y + balg * 8];
    const armH = [...glied([[118 + X, 80 + Y], [128 + X, 100 + Y], hebel], 3.6, 2.8, null), E(hebel[0], hebel[1], 3, 2.8, 'haut'), C(hebel[0], hebel[1], 142 + X, 108 + Y + balg * 6, 1.4, 1.2, null, { pf: 'flat' })];
    const gruppen = [
      { p: [...armH], k: 1, kante: true, tone: -0.05 },  // 0
      { p: [balgP], k: 0, kante: true },                  // 1
      { p: stiefel, k: 0.6, kante: true },                // 2
      { p: [mantel], k: 2, kante: true },                 // 3
      { p: rohr, k: 0.8, kante: true, tone: 0.1 },        // 4
      { p: [kragen], k: 1, kante: true, tone: 0.05 },     // 5
      { p: [trichter], k: 0, kante: true, tone: 0.12 },   // 6
      { p: [muendung], k: 0, kante: true, noRim: false }, // 7
      { p: armV, k: 1, kante: true, tone: 0.06 },         // 8
    ];
    const BALG = 1, MANTEL = 3, TR = 6, MU = 7;
    gruppen.forEach((g, i) => { g.anker = i === 2 ? [0, 0] : [X, Y]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('leuchtturm_horn'), { rimBis: 174 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - X, y - Y);
      // Ölzeug: steife Falten, Knöpfe aus Horn, Gürtel; nass glänzend an der Lichtseite
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== MANTEL) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (y - 72 - Y) / 94;
        for (const o of [-10, 2, 14]) { const lx = 106 + X + o * (0.6 + u * 0.8); if (Math.abs(x - lx) < 0.6) P.set(x, y, 'k0'); else if (Math.abs(x - lx - 1) < 0.6 && B(x, y) < 0.5) P.set(x, y, 'k3'); }
        let rr = x; while (gid[y * W + rr + 1] === MANTEL) rr++; const d = rr - x; if (d < 6 && d > 1 && B(x, y) < 0.6 - d * 0.08) P.set(x, y, 'k3');
        if (Math.abs(y - (110 + Y)) < 1) P.set(x, y, 'k0');
      }
      for (let k = 0; k < 4; k++) P.auf(92 + X + k * 0.6, 86 + Y + k * 9, 'messing');
      // Blasebalg: Lederfalten quer, die sich mit dem Pumpen zusammenschieben
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== BALG) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const q = (y - 80 - Y) / (bh || 1); const fz = ((q * 7) % 1 + 1) % 1; P.set(x, y, fz < 0.18 ? 'k0' : fz < 0.4 ? (x > 132 + X ? 'k3' : 'k2') : c); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Trichter: Messing, angelaufen; Ringe (Lötnähte) quer, Glanzband an der Oberseite
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== TR) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const qx = x + 0.5 - N[0], qy = y + 0.5 - N[1]; const t = (qx * ux + qy * uy) / L, s = (qx * nx + qy * ny) / rad(Math.max(0, Math.min(1, t)));
        let col = c;
        if (s > 0.35 && s < 0.7 && B(x, y) < 0.7 - t * 0.2) col = 'k3';
        if (s > 0.55 && s < 0.68 && t > 0.2 && t < 0.9 && B(x, y) < 0.45) col = 'messing';
        if (s < -0.5) col = 'k1';
        for (const n of [0.3, 0.55, 0.78]) if (Math.abs(t - n) * L < 0.7) col = 'k0'; else if (Math.abs(t - n - 1.1 / L) * L < 0.6 && s > 0) col = 'r1';
        P.set(x, y, col);
      }
      // Mündung: innen dunkel, Ringe in die Tiefe, ganz hinten das eingesogene Licht
      const glut = Math.max(0, p.tod ? 0.8 - p.q * 1.2 : 0.7 + sog * 0.15 + stoss * 0.5);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== MU) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue;
        const dx = (x + 0.5 - mx) / 6.5, dy = (y + 0.5 - my) / (mR + 1.5); const d = Math.hypot(dx * 0.75, dy);
        let col = d > 0.86 ? (dy < 0 ? 'r2' : 'r1') : d > 0.74 ? 'k0' : d > 0.6 ? 'k1' : d > 0.42 ? (B(x, y) < glut * 0.5 ? 'glutDim' : 'k2') : d > 0.22 ? (glut > 0.6 ? 'glutDim' : 'k3') : d > 0.12 ? 'glut' : 'kern';
        if (d <= 0.22 && glut < 0.3) col = 'k2';
        P.set(x, y, col);
      }
      if (glut > 0.3) { augen.push([r(mx), r(my)]); }
      // der Sog: Nebelfäden strömen in den Trichter (Idle und Ausholen); der Stoß: Ringe nach vorn
      if (sog > 0) for (let k = 0; k < 7; k++) {
        const ang = (k / 7 - 0.5) * 2.4 + Math.PI, len = 10 + sog * 6 + (k % 3) * 3, rr0 = mR + 4 + (k % 2) * 3;
        for (let i = 0; i < len; i++) { const q = i / len; const x = mx + Math.cos(ang) * (rr0 + len - i) * 0.9 + (k % 2 ? 1 : -1) * Math.sin(q * 3) * 1.2, y = my + Math.sin(ang) * (rr0 + len - i); if (!P.get(r(x), r(y)) && LIB.bay(r(x) + f, r(y)) < 0.35 + q * 0.4) P.set(x, y, q > 0.7 ? 'r2' : 'r1'); }
      }
      if (stoss > 0) for (let k = 0; k < 3; k++) { const rr = mR + 6 + k * 8; for (let t = -1; t <= 1; t += 0.04) { const x = mx - 8 - k * 6 + Math.cos(Math.PI + t * 0.6) * 4, y = my + Math.sin(t * 0.9) * rr; if (!P.get(r(x), r(y)) && (k < 2 || stoss > 0.8) && LIB.bay(r(x), r(y)) < 0.85 - k * 0.2) P.set(x, y, k === 0 ? 'r2' : 'r1'); } }
      // Rohr und Arme: Lichtkante
      KA.licht(P, rohr, { c: 'r1', c2: 'k3' });
      KA.licht(P, armV, { c: 'r1', c2: null });
      // Handschuh am Trichterrand: Finger
      for (let k = 0; k < 3; k++) P.auf(hv[0] - 1 + k * 1.5, hv[1] + 6, 'k0');
      // Randlicht oben rechts kräftig: das kalte Licht von draußen
      { const z = []; for (let y = 0; y < 172; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y, 'r2']); } for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
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
