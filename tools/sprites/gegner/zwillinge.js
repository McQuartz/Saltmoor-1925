// Die Zwillinge (Waisenhaus am Deich). Zwei Mädchen im Nachthemd, gleich groß, gleich gekämmt, das Haar nass bis
// zur Hüfte, Hand in Hand. Sie kamen 1913 zusammen ins Haus, Bett 17 und Bett 18. Das Licht aus dem Fenster
// wirft nur einen Schatten. Er liegt lang über dem Linoleum, und er hat zwei Hände.
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
  id: 'zwillinge', biom: 'waisenhaus', zone: 'waisenhaus', w: 96, h: 120, fuss: [52, 115], kopf: [50, 46], rimBis: 113,
  varianten: {
    // a: nebeneinander, offenes Haar; den Schatten wirft die vordere (linke)
    zwillinge_a: { xs: [38, 64], schatten: 0, zoepfe: false },
    // b: Zöpfe; den Schatten wirft die hintere (rechte), er läuft unter der vorderen hindurch
    zwillinge_b: { xs: [37, 63], schatten: 1, zoepfe: true },
  },
  // Silhouetten-Probe (verworfen): die beiden eng hintereinander, fast deckungsgleich; schwarz ein einzelnes Kind
  // mit breitem Rock (zu nah am Schlafwagenkind). Erst der Abstand und die gefassten Hände zeigen zwei.
  proben: { sil_eng: { xs: [48, 54], schatten: 0, zoepfe: false } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120, FY = 114;
    let atem = [0, 0], dx = 0, hub = 0, fall = 0, lang = 0, lean = 0;
    // hub: gefasste Hände hoch (0..1), lang: der Schatten greift nach vorn
    if (p.idle) { atem = [[0, 0], [0, 1], [1, 1], [1, 0]][f]; }
    if (p.angriff) { dx = [2, 3, -7, -3][f]; hub = [0.5, 1, 0.3, 0.1][f]; lang = [0.2, 0.4, 1, 0.5][f]; lean = [1, 2, -3, -1][f]; }
    if (p.treffer) { dx = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 20); }
    const kinder = v.xs.map((x0, i) => {
      const cx = x0 + dx + (i === 0 ? 0 : -dx * 0.2), T = atem[i] + fall * (i === 0 ? 1 : 1.2);
      const top = FY - 66 + T;
      const hemd = Pg([[cx - 5.5 + lean, top + 16], [cx + 5.5 + lean, top + 16], [cx + 7.5, top + 24], [cx + 12, FY - 7], [cx + 12, FY - 5], [cx - 12, FY - 5], [cx - 11, FY - 7], [cx - 7.5, top + 24]], 'haut', { rd: 1.4, tone: 0.18 });
      const kopf = E(cx - 1 + lean, top + 7.5, 7.6, 8.2, 'haut', { pf: 'bevel', tone: 0.1 });
      // Haar: offen bis zur Hüfte (a) oder zwei Zöpfe (b), hinten
      const haar = [];
      if (!v.zoepfe) haar.push(Pg([[cx + 1 + lean, top - 0.5], [cx + 7 + lean, top + 3], [cx + 8 + lean * 0.5, top + 18], [cx + 8, top + 32], [cx + 4, top + 34], [cx + 2, top + 16]], null, { rd: 1 }));
      else { haar.push(E(cx + 1 + lean, top + 4, 6.4, 5, null)); for (const s of [-1, 1]) haar.push(...glied([[cx + 3 + s * 2 + lean, top + 10], [cx + 6 + s * 2.5, top + 20], [cx + 5 + s * 2, top + 30]], 1.8, 1.2, null)); }
      const beine = [C(cx - 3, FY - 7, cx - 3, FY - 1, 1.5, 1.3, 'haut'), C(cx + 3, FY - 7, cx + 3, FY - 1, 1.5, 1.3, 'haut'), C(cx - 3, FY, cx - 7, FY, 1.2, 1, 'haut'), C(cx + 3, FY, cx - 1, FY, 1.2, 1, 'haut')];
      // Arme: der innere zur Schwester, der äußere hängt
      const sh = [cx + (i === 0 ? 4 : -4) + lean, top + 18];
      return { cx, T, top, hemd, kopf, haar, beine, sh, aussen: [cx + (i === 0 ? -5 : 5) + lean, top + 18] };
    });
    const [A0, B0] = kinder;
    const mx = (A0.cx + B0.cx) / 2, my = FY - 26 - hub * 22 + (A0.T + B0.T) / 2;
    const armA = glied([A0.sh, [A0.sh[0] + 4, my - 4 + hub * 6], [mx - 1, my]], 2, 1.6, null);
    const armB = glied([B0.sh, [B0.sh[0] - 4, my - 4 + hub * 6], [mx + 1, my]], 2, 1.6, null);
    const haende = [E(mx, my, 2.6, 2.2, 'haut')];
    const aussenA = glied([A0.aussen, [A0.aussen[0] - 2 - hub * 3, A0.top + 27 - hub * 4], [A0.aussen[0] - 2 - hub * 6, A0.top + 35 - hub * 8]], 1.9, 1.5, null);
    const aussenB = glied([B0.aussen, [B0.aussen[0] + 2, B0.top + 27], [B0.aussen[0] + 1, B0.top + 35]], 1.9, 1.5, null);
    // der eine Schatten: flach auf dem Boden, nach vorn links, mit zwei Köpfen und zwei Händen
    const S = kinder[v.schatten];
    const sl = 40 + lang * 16, sx = S.cx - 2, sy = FY + 2;
    const schatten = fall > 14 ? [] : [Pg([[sx + 6, sy - 2], [sx - sl * 0.5, sy + 1], [sx - sl, sy + 2.2], [sx - sl - 4, sy + 3.5], [sx - sl * 0.4, sy + 3.5], [sx + 4, sy + 1]], 'dunkel', { pf: 'flat', noRim: true }),
      E(sx - sl - 5, sy + 1.8, 4.5, 2, 'dunkel', { pf: 'flat', noRim: true }), E(sx - sl - 2, sy - 0.6, 3.6, 1.6, 'dunkel', { pf: 'flat', noRim: true }),
      C(sx - sl * 0.55, sy + 1, sx - sl * 0.75, sy - 2 - lang * 2, 0.8, 0.7, 'dunkel', { pf: 'flat', noRim: true }), C(sx - sl * 0.6, sy + 2.5, sx - sl * 0.85, sy + 3.5 + lang, 0.8, 0.7, 'dunkel', { pf: 'flat', noRim: true })];
    const gruppen = [
      { p: schatten, k: 0, noRim: true },
      { p: B0.haar, k: 0.8, kante: true },
      { p: aussenB, k: 0.8, kante: true },
      { p: B0.beine, k: 0.5, kante: true },
      { p: [B0.hemd], k: 1, kante: true },
      { p: [B0.kopf], k: 0.5, kante: true },
      { p: armB, k: 0.8, kante: true },
      { p: A0.haar, k: 0.8, kante: true },
      { p: A0.beine, k: 0.5, kante: true },
      { p: [A0.hemd], k: 1, kante: true },
      { p: [A0.kopf], k: 0.5, kante: true },
      { p: aussenA, k: 0.8, kante: true },
      { p: armA, k: 0.8, kante: true },
      { p: haende, k: 0.4, kante: true },
    ];
    const SCH = 0, HAAR = [7, 1], HEMD = [9, 4], KOPF = [10, 5];
    gruppen.forEach(g => { g.anker = [dx, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waisenhaus'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - dx, y);
      // Schatten: ganz dunkel, flach, kein Licht
      for (let y = FY - 2; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, SCH)) P.set(x, y, (x + y) % 5 === 0 ? 'k1' : 'k0');
      kinder.forEach((K, i) => {
        // Nachthemd: Kragen, Knopfleiste, zwei Falten, Saum; Kalk nur an der Lichtkante
        for (let y = r(K.top + 14); y < FY; y++) for (let x = r(K.cx - 12); x < r(K.cx + 12); x++) {
          if (!ist(x, y, HEMD[i])) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          const u = (y - K.top - 16) / (FY - K.top - 16);
          if (!ist(x, y + 1, HEMD[i])) P.set(x, y, 'k0');
          else if (Math.abs(x - (K.cx - 3 - u * 3)) < 0.6 || Math.abs(x - (K.cx + 3 + u * 3)) < 0.6) P.set(x, y, 'k1');
          else if (Math.abs(x - (K.cx + 4 + u * 3)) < 0.6 && b(x, y) < 0.5) P.set(x, y, 'k3');
          else if (!ist(x + 1, y, HEMD[i]) && (y & 1)) P.set(x, y, 'kalk');
          if (y === r(K.top + 17) && Math.abs(x - K.cx) < 4) P.set(x, y, (x & 1) ? 'kalk' : 'k3');
          if (y === FY - 9) P.set(x, y, 'k0'); else if (y === FY - 8 && b(x, y) < 0.7) P.set(x, y, 'k3');
          if (Math.abs(x - (K.cx - 0.5)) < 0.6 && y > K.top + 18 && y < K.top + 30) P.set(x, y, (y % 3) ? 'k1' : 'kalk');
        }
        // Haar nass: dunkel mit glänzenden Strähnen
        for (let y = r(K.top - 2); y < r(K.top + 40); y++) for (let x = r(K.cx - 8); x < r(K.cx + 12); x++) {
          if (!ist(x, y, HAAR[i])) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          P.set(x, y, (x * 3 + y) % 9 === 0 ? 'nass' : (x - K.cx) % 3 === 0 ? 'k0' : c > 2 ? 'k2' : 'k1');
        }
        // Gesicht: Scheitel nass, Pony über der Stirn; Augen rot; das Kind ohne Schatten hat die helleren
        const kx = K.cx - 1 + lean, ky = K.top + 8.5;
        for (let y = r(ky - 8); y <= r(ky + 8); y++) for (let x = r(kx - 8); x <= r(kx + 8); x++) {
          if (!ist(x, y, KOPF[i])) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          const ddx = x + 0.5 - kx, ddy = y + 0.5 - ky;
          if (ddy < -3.5 + Math.max(0, ddx) * 0.5 || ddx > 2.5) P.set(x, y, (x * 2 + y) % 7 === 0 ? 'nass' : (ddx > 0 && ddy < -4 ? 'k2' : 'k1'));
          else P.set(x, y, ddx < -4.5 ? 'k2' : (ddy > 3 && b(x, y) < 0.5 ? 'k2' : 'k3'));
        }
        // Mittelscheitel und Strähnen über der Stirn
        for (const sx of [kx - 3, kx - 1]) for (let k2 = 0; k2 < 3; k2++) P.auf(sx, ky - 3 + k2, 'k0');
        if (!(p.tod && f >= 1)) {
          const ohne = i !== v.schatten;
          P.glow(kx - 3, ky, 5, ohne ? 0.9 : 0.6, 'glutDim', 'k3');
          P.set(kx - 4, ky, ohne ? 'kern' : 'glut'); P.set(kx - 1, ky, 'glut');
          augen.push([r(kx - 4), r(ky)]);
        }
        P.auf(kx - 3, ky + 3, 'k0'); P.auf(kx - 2, ky + 3, 'k0');
        // Tropfen aus dem Haar
        if (!p.tod) P.set(K.cx + 6, K.top + 40 + ((f + i) % 2) * 3, 'nass');
      });
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // gefasste Hände: Knöchel blass
      P.auf(mx - 1, my - 1, 'kalk'); P.auf(mx + 1, my, 'kalk');
      // kräftige Lichtkante oben rechts an Köpfen und Schultern
      const z = [];
      for (let y = 0; y < 110; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (gid[y * W + x] === SCH) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y]); }
      for (const [x, y] of z) P.set(x, y, 'r2');
      // unter dem Kind ohne Schatten ist der Boden leer und nass
      const O = kinder[1 - v.schatten];
      if (!p.tod) for (let x = r(O.cx - 8); x <= r(O.cx + 9); x++) if (!P.get(x, FY + 1) && (x % 3)) P.set(x, FY + 1, 'nass');
    };
    return { gruppen, details, augen };
  },
};
