// Die Gussnaht (Glockengießerei). Was in der Form stand, als die beiden Hälften zusammengesetzt wurden:
// ein Mensch, der Länge nach aus zwei Hälften gegossen, die nicht zueinander passen. Die eine Hälfte ist
// höher und breiter (älter), die andere kleiner und tiefer gerutscht; Augen und Mund stehen nicht auf
// einer Höhe. Die Naht glüht, und aus ihr steht der Gussgrat als dünne Bronzeflosse über den Kopf.
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
// halbe Ellipse als Polygon (seite -1 links, +1 rechts der Naht)
function halbEll(cx, cy, rx, ry, seite, n = 12) { const pts = []; for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 + Math.PI * i / n; pts.push([cx + seite * Math.cos(t) * rx, cy + Math.sin(t) * ry]); } return pts; }
module.exports = {
  id: 'gussnaht', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 96, h: 120, fuss: [48, 115], kopf: [48, 4], rimBis: 113,
  varianten: {
    // a: die linke Hälfte ist die höhere, ältere, breitere
    gussnaht_a: { gross: -1, klein: 0.64, fin: 1 },
    // b: die rechte Hälfte ist die höhere; der Grat zerfranst, an der Schulter ein zweiter Lappen
    gussnaht_b: { gross: 1, klein: 0.7, fin: 2 },
  },
  // Silhouetten-Probe (verworfen): die Hälften klaffen weit auseinander, nur der Grat hält sie zusammen;
  // das las sich als zwei dünne Gestalten nebeneinander, die Naht als „eine“ ging verloren.
  proben: { sil_gleich: { gross: -1, klein: 0.88, fin: 1 } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, spalt = v.spalt || 0, arme = 0, fall = 0, kipp = 0, glut = 0.6;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glut = [0.55, 0.7, 0.6, 0.75][f]; }
    if (p.angriff) { spalt += [3, 7, 0, 1][f]; arme = [0.4, 1, -1, -0.4][f]; lean = [1, 2, -8, -3][f]; glut = [0.9, 1.3, 1, 0.8][f]; }
    if (p.treffer) { lean = [2, 1][f]; spalt += 1; glut = 0.4; }
    if (p.tod) { spalt += r(p.q * 12); kipp = p.q; fall = r(p.q * 10); glut = Math.max(0, 1 - p.q * 1.5); }
    const s = 48 + lean, T = atem + fall;
    const halbe = (seite, gross) => {
      // gross: die größere, ältere Hälfte; sonst kleiner und tiefer
      const sc = gross ? 1 : v.klein, x0 = s + seite * (1 + spalt / 2) + seite * r(kipp * 6), k = seite;
      const Y = y => 114 - (114 - y) * sc + T * sc + r(kipp * 4 * (gross ? 1 : 0));
      const X = u => x0 + k * u * sc;
      const ks = gross ? 1 : 1.22, kopf = Pg([...halbEll(x0, Y(24) + (gross ? 0 : 1), 9 * sc * ks, 10.5 * sc * ks, k), [x0, Y(24) + 10.5 * sc * ks]], 'haut', { rd: 0.6 });
      const ohr = E(X(9 * ks) , Y(25), 1.6 * sc, 2.6 * sc, 'haut');
      const hals = Pg([[x0, Y(32)], [X(4.5), Y(33)], [X(5.5), Y(37)], [x0, Y(38)]], null, { rd: 0.5 });
      const rumpf = gross ? Pg([[x0, Y(35)], [X(12), Y(37)], [X(17), Y(42)], [X(16), Y(60)], [X(17), Y(80)], [X(19), Y(94)], [X(6), Y(95)], [x0, Y(94)]], null, { rd: 1.6 })
        : Pg([[x0, Y(36)], [X(11), Y(38)], [X(15), Y(44)], [X(14), Y(60)], [X(16), Y(80)], [X(4), Y(82)], [x0, Y(81)]], null, { rd: 1.6 });
      const bein = glied([[X(7), Y(77)], [X(9), Y(95)], [X(8), Y(110)]], 4.4 * sc, 3 * sc, null);
      const fuss = [C(X(8), Y(111), X(8) - 7 * sc, 114, 2.4 * sc, 1.6 * sc, 'dunkel')];
      const as = [X(15), Y(41)], ae = [X(22 + arme * 2), Y(60 - arme * 22)], ah = [X(22 + arme * 0 - (arme < 0 ? -10 : 0)), Y(84 - arme * 44 - (arme < 0 ? 8 : 0))];
      if (arme < 0) { ae[0] = X(20) - 8 * (k < 0 ? 1 : 0.4); ah[0] = s - 22 - (k > 0 ? 0 : 4); ah[1] = Y(54); }
      const arm = glied([as, ae, ah], 4.4 * sc, 2.8 * sc, null);
      const hand = [E(ah[0], ah[1] + 1, 2.8 * sc, 3.4 * sc, 'haut')]; for (let i = 0; i < 3; i++) hand.push(C(ah[0] + k * (i - 1) * 1.2 * sc, ah[1] + 2 * sc, ah[0] + k * (i - 1) * 1.5 * sc, ah[1] + 6 * sc, 0.8 * sc, 0.6 * sc, 'haut'));
      // der Alte: Bart unter der halben Kinnlade; das Kind: Haar als Kappe
      const bart = gross ? [Pg([[x0, Y(30)], [X(7), Y(29)], [X(6), Y(36)], [X(3), Y(42)], [x0, Y(44)]], null, { rd: 0.8 })] : [];
      const haar = gross ? [] : [Pg([...halbEll(x0, Y(24) + 1, 9.6 * sc * ks, 11 * sc * ks, k, 10).filter(([, y]) => y < Y(24) - 1), [x0, Y(24) - 1]], 'dunkel', { rd: 0.4 })];
      return { kopf, ohr, hals, rumpf, bein, fuss, arm, hand, bart, haar, Y, X, x0, sc, gross };
    };
    const L = halbe(-1, v.gross < 0), Rr = halbe(1, v.gross > 0);
    // Grat: dünne Flosse aus der Naht, über den Kopf und zwischen den Beinen; zackige Oberkante
    const ytop = Math.min(L.Y(14), Rr.Y(14)) - 10, fin = [];
    const zack = v.fin === 2 ? [[-3, 2], [-4, -4], [-2, -3], [0, -17], [2, -6], [4, -8], [3, -1], [4, 4]] : [[-3, 2], [-3, -5], [-1, -4], [1, -18], [2, -7], [4, -3], [3, 3]];
    fin.push(Pg([...zack.map(([u, w]) => [s + u, ytop + 8 + w]), [s + 2, Math.max(L.Y(30), Rr.Y(30))], [s - 1, Math.max(L.Y(30), Rr.Y(30))]], null, { rd: 0.4 }));
    fin.push(Pg([[s - 1, 82 + T], [s + 2, 82 + T], [s + 3, 96], [s + 1, 104], [s + 2, 110], [s - 2, 108], [s - 1, 96]], null, { rd: 0.3 }));
    { const G = v.gross < 0 ? L : Rr, Kl = v.gross < 0 ? Rr : L, sd = v.gross < 0 ? 1 : -1, ya = G.Y(18), yb = Kl.Y(14);
      const fl = [[s + sd * 0.5, ya]]; for (let y = ya; y <= yb; y += 4) fl.push([s + sd * (2.5 + ((y / 4) % 2) * 2.5), y + 2]); fl.push([s + sd * 0.5, yb + 2]);
      fin.push(Pg(fl, null, { rd: 0.3 })); }
    if (v.fin === 2) fin.push(Pg([[s - 1, L.Y(38)], [s - 9, L.Y(33)], [s - 7, L.Y(37)], [s - 11, L.Y(38)], [s - 2, L.Y(44)]], null, { rd: 0.3 }));
    const gruppen = [
      { p: fin, k: 0, kante: true, pf: 'flat' },
      { p: Rr.arm, k: 1, kante: true }, { p: Rr.hand, k: 0.5, kante: true },
      { p: Rr.bein, k: 1, kante: true }, { p: Rr.fuss, k: 0.5, kante: true },
      { p: [Rr.rumpf, Rr.hals], k: 1.5, kante: true }, { p: [Rr.kopf, Rr.ohr], k: 0.5, kante: true }, { p: [...Rr.bart, ...Rr.haar], k: 0, kante: true },
      { p: L.bein, k: 1, kante: true }, { p: L.fuss, k: 0.5, kante: true },
      { p: [L.rumpf, L.hals], k: 1.5, kante: true }, { p: [L.kopf, L.ohr], k: 0.5, kante: true }, { p: [...L.bart, ...L.haar], k: 0, kante: true },
      { p: L.arm, k: 1, kante: true }, { p: L.hand, k: 0.5, kante: true },
    ];
    const FIN = 0, RR = 5, RK = 6, LR = 10, LK = 11;
    // die kleine Hälfte (das Kind) ist heller: anderer Guss, anderer Mensch
    const klein = v.gross < 0 ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12, 13, 14];
    klein.forEach(i => { gruppen[i].tone = (gruppen[i].tone || 0) + 0.32; });
    gruppen.forEach(g => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glockengiesserei'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      // Gussnaht: der Spalt zwischen den Hälften glüht, auch auf den Hälften eine Pixelreihe Glut
      const y0 = Math.min(L.Y(14), Rr.Y(14)), y1 = 80 + T;
      if (glut > 0) for (let y = r(y0); y <= y1; y++) {
        const xa = r(L.x0), xb = r(Rr.x0);
        for (let x = xa - 1; x <= xb + 1; x++) {
          const cur = P.get(x, y), gi = gid[y * W + x];
          const kante = (x === xa || x === xb) && cur && gi !== FIN;
          if (kante) { if (xb - xa > 2) P.set(x, y, (y + f) % 4 === 0 && glut > 0.6 ? 'glut' : 'guss'); else if (LIB.bay(x, y + f) < glut * 0.75) P.set(x, y, 'glutDim'); continue; }
          if ((x === xa - 1 || x === xb + 1) && cur && gi !== FIN) { if (LIB.bay(x, y) < glut * 0.7) P.set(x, y, 'glutDim'); continue; }
          if (x > xa && x < xb && gi !== FIN) { if (xb - xa <= 2) P.set(x, y, (y + f * 3) % 9 === 0 && glut > 0.6 ? 'glut' : 'guss'); else if ((y * 7 + x * 3 + f * 5) % 23 === 0) P.set(x, y, 'guss'); }
        }
      }
      P.glow(s, (y0 + y1) / 2 - 10, 14 + glut * 6, 0.5 * glut, 'glutDim', 'k3');
      // die Naht leuchtet beide Hälften von innen an: ein Streifen Glut auf den Flächen neben der Naht
      if (glut > 0) for (let y = r(y0); y <= y1 + 14; y++) for (let x = r(L.x0) - 8; x <= r(Rr.x0) + 8; x++) {
        const gi = gid[y * W + x], c = P.get(x, y); if (gi === FIN || c < 1 || c > 4) continue;
        const d = Math.min(Math.abs(x - L.x0), Math.abs(x - Rr.x0)); const v = glut * (1 - d / 8) * (y > y1 ? 1 - (y - y1) / 14 : 1);
        if (v > 0.55 + LIB.bay(x - lean, y - T) * 0.35) P.set(x, y, 'glutDim'); else if (v > LIB.bay(x - lean, y - T) * 0.8) P.set(x, y, 'k3');
      }
      // Grat: Bronze an der Lichtkante, Gussrauheit
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, FIN)) { const c = P.get(x, y); if (c >= 1 && c <= 6) { if (!ist(x + 1, y, FIN) && !P.get(x + 1, y)) P.set(x, y, y % 3 ? 'bronze' : 'r2'); else if (((x + y * 3) % 7) === 0) P.set(x, y, 'k0'); } }
      // offene Schnittfläche der großen Hälfte über dem Kopf der kleinen: glühender Querschnitt
      if (glut > 0) { const G = v.gross < 0 ? L : Rr, Kl = v.gross < 0 ? Rr : L, sd = v.gross < 0 ? 1 : -1; const xa = r(G.x0);
        for (let y = r(G.Y(20)); y < Kl.Y(16); y++) for (const dx of [0, sd, 2 * sd]) { const x = xa + dx; if (!P.get(x, y)) continue; P.set(x, y, dx === 0 ? ((y + f) % 5 === 0 ? 'glut' : 'guss') : dx === sd ? ((y & 1) ? 'guss' : 'glutDim') : 'glutDim'); } }
      // Rümpfe: Rippenbögen und Brustwarzenhof als Gussrelief, der Gussgrat der Formteile als feine Linie
      for (const [Rx, gi, h] of [[L, LR, -1], [Rr, RR, 1]]) {
        for (let i = 0; i < 3; i++) for (let u = 2; u < 13; u++) { const x = Rx.X(u), y = Rx.Y(52 + i * 5) - (u - 2) * 0.35 * 1; if (ist(x, y, gi) && P.get(r(x), r(y)) <= 4) P.set(x, y, (i + u) % 4 === 0 ? 'k3' : 'k0'); }
        for (let u = 0; u < 16; u++) { const x = Rx.X(3 + u * 0.6), y = Rx.Y(66 + u); if (ist(x, y, gi) && P.get(r(x), r(y)) <= 4) P.set(x, y, h > 0 ? 'r1' : 'k3'); }
        // Schulterhöhe: hellere Fläche (Haut, Bronzeglanz)
        const sx = Rx.X(11), sy2 = Rx.Y(40); if (ist(sx, sy2, gi)) { P.set(sx, sy2, 'k3'); P.set(sx + h, sy2 + 1, 'k3'); }
      }
      { const G = L.gross ? L : Rr, gi = L.gross ? LR : RR; for (let i = 0; i < 4; i++) { const x = G.X(3.5), y = G.Y(44 + i * 11); if (ist(x, y, gi)) { P.set(x, y, 'bronze'); P.set(x, y + 1, 'k0'); } }
        for (let y = r(G.Y(38)); y < G.Y(94); y++) { const x = G.X(9 + (y - G.Y(38)) * 0.08); if (ist(x, y, gi) && P.get(r(x), y) <= 4) P.set(x, y, 'k0'); } }
      for (const gi of [7, 12]) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gi) && P.get(x, y) <= 4) P.set(x, y, (x % 2) ? 'k3' : (y % 3 ? 'k2' : 'k0'));
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Augen und Münder: die beiden Hälften passen nicht; je ein Auge, auf verschiedener Höhe
      if (!p.tod || f < 1) {
        const e1 = [r(L.X(4)), r(L.Y(24))], e2 = [r(Rr.X(4)), r(Rr.Y(24))];
        P.auge(e1[0], e1[1], 1); P.set(e1[0] - 1 * 0, e1[1], v.gross < 0 ? 'glut' : 'kern');
        P.auge(e2[0], e2[1], 1); P.set(e2[0], e2[1], v.gross > 0 ? 'glut' : 'kern');
        P.auf(e1[0], e1[1] - 1, 'k0'); P.auf(e2[0], e2[1] - 1, 'k0');
        augen.push(e1, e2);
      }
      for (const Rx of [L, Rr]) for (let u = 1; u <= 4; u++) P.auf(Rx.X(u), Rx.Y(30), 'k0');
    };
    return { gruppen, details, augen };
  },
};
