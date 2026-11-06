// Wald (Akt III): Die Bernsteinlarve. Eine Larve wie die der Köcherfliege, aber so groß wie ein Mann.
// Ihren Köcher hat sie aus dem gebaut, was von einer Kohorte übrig war: Helmschalen, Schildbuckel,
// Münzen, Fingerknochen, verklebt mit Harz. Sie trägt ihn schräg aufgerichtet wie einen Turm.
// Ihr eigener Leib ist Bernstein, man sieht durch ihn hindurch. Was fault, frisst sie.
'use strict';
const rot = (pts, cx, cy, a) => pts.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
const rechteck = (w, h) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
module.exports = {
  id: 'bernsteinlarve', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [44, 116], kopf: [64, 12], rimBis: 113,
  varianten: {
    bernsteinlarve_a: { neig: 0.5, laenge: 62, dick: 11.5, helm: true },
    bernsteinlarve_b: { neig: 0.38, laenge: 60, dick: 12.5, helm: false, knochen: true },
  },
  // probe1 genommen: der Köcher steht schräg aufgerichtet, die Larve zieht ihn vorn am Boden.
  // probe2 verworfen: der Köcher liegt flach wie ein Stamm. Las sich als Baumstamm mit Beinen und
  // ähnelte dem Liegenden aus dem Kurhaus (lange Waagerechte).
  proben: { probe1: { neig: 0.48, laenge: 76, dick: 12, helm: true }, probe2: { neig: 1.45, laenge: 64, dick: 12, helm: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let kopfX = 0, kopfY = 0, kiefer = 0, bein = [0, 0, 0], kipp = 0, fall = 0, augen = true, rein = 0, schub = 0;
    if (p.idle) { bein = [[0, 0, 0], [1, 0, -1], [0, 1, 0], [-1, 0, 1]][f]; kiefer = [0, 0, 1, 0][f]; }
    // Angriff: Vorderleib weit aus dem Köcher heben, dann nach vorn schnappen, zurückziehen
    if (p.angriff) { kopfY = [-4, -12, 6, 1][f]; kopfX = [2, 2, -11, -4][f]; kiefer = [1, 2, 0, 1][f]; kipp = [0.03, 0.06, -0.08, -0.02][f]; schub = [1, 2, -5, -1][f]; bein = [[0, 0, 0], [-2, -3, -1], [-3, 2, 1], [0, 0, 0]][f]; }
    if (p.treffer) { kipp = [0.07, 0.03][f]; kopfX = [3, 1][f]; rein = [4, 2][f]; }
    if (p.tod) { rein = r(Math.min(1, p.q * 2) * 12); kipp = p.q * 0.55; fall = r(p.q * 6); augen = f < 1; }
    const fy = 115;
    // Köcher: Achse von der Öffnung unten links zum Ende oben rechts
    const ox0 = 52 + schub, oy0 = 97 + fall;
    const a = -Math.PI / 2 + v.neig + kipp; // Richtung der Achse (nach oben, rechts geneigt)
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux; // n zeigt nach rechts unten
    const L = v.laenge, D = v.dick;
    const ax = (t, s = 0) => [ox0 + ux * L * t + nx * s, oy0 + uy * L * t + ny * s];
    const [ex, ey] = ax(1);
    const roehre = C(ox0, oy0, ex, ey, D, D * 0.66, null);
    const rand = E(ox0 + ux * 1.5, oy0 + uy * 1.5, D * 0.95, D * 0.95, null, { pf: 'bevel' });
    // Teile des Köchers: Helmschale, Schildbuckel, Blechstreifen (Schienen), Münzen, Knochen, Zweige
    const teile = [];
    const platte = (t, s, w, h, dw, m = null, tone = 0) => { const [px, py] = ax(t, s); const ecken = rot(rechteck(w - 1, h - 1), px, py, a + dw); teile.push({ p: [Pg(rot(rechteck(w, h), px, py, a + dw), m, { rd: 0.8 })], tone, ecken, c: [px, py] }); };
    platte(0.14, -3, 11, 7, 0.4, null, 0.05);
    platte(0.3, 4, 13, 6, -0.3, null, 0.12);
    platte(0.47, -4, 12, 6, 0.25, null, 0.08);
    platte(0.62, 3, 10, 6, -0.35, null, 0.1);
    platte(0.8, -2, 9, 5, 0.2, null, 0.06);
    if (v.helm) { const [hx, hy] = ax(0.56, 5); teile.push({ p: [E(hx, hy, 7.5, 6, null, { pf: 'bevel' }), Pg(rot([[-8, 2], [8, 2], [9, 5], [-9, 5]], hx, hy, a + Math.PI / 2 - 0.2), null, { rd: 0.4 })], tone: 0.15, helm: [hx, hy] }); }
    { const [bx, by] = ax(0.3, -6); teile.push({ p: [E(bx, by, 6.5, 6.5, null, { pf: 'bevel' })], tone: 0.1, buckel: [bx, by] }); }
    const zweige = [C(...ax(0.05, -D + 1), ...ax(0.4, -D - 2), 1.1, 0.8, null), C(...ax(0.66, D - 1), ...ax(1.06, D + 1), 1, 0.7, null), C(...ax(0.86, -D * 0.6), ...ax(1.12, -D * 0.9), 0.9, 0.6, null)];
    const knochen = v.knochen ? [C(...ax(0.42, D - 2), ...ax(0.52, D + 3), 1.1, 1, 'haut'), C(...ax(0.7, -D + 1), ...ax(0.77, -D - 3), 1.1, 1, 'haut')] : [];
    // Larve: Kopfkapsel und drei Brustringe kommen unten links aus der Öffnung
    const hx0 = ox0 - 30 + kopfX + rein * 2.2, hy0 = oy0 - 6 + kopfY + rein * 0.4;
    const ringe = [0, 1, 2, 3].map(i => { const q = (i + 0.6) / 4.3; return E(ox0 + (hx0 - ox0) * q, oy0 + (hy0 - oy0) * q - Math.sin(q * Math.PI) * 5, 7.6 - i * 0.5, 6.8 - i * 0.4, null, { pf: 'bevel' }); });
    const kopf = E(hx0, hy0, 7, 6, 'haut', { pf: 'bevel' });
    const kieferL = glied([[hx0 - 5, hy0 + 1], [hx0 - 11 - kiefer, hy0 - kiefer], [hx0 - 14 - kiefer * 2, hy0 + 4]], 1.6, 0.6, null);
    const kieferR = glied([[hx0 - 4, hy0 + 4], [hx0 - 10 - kiefer, hy0 + 8 + kiefer], [hx0 - 14 - kiefer, hy0 + 7 + kiefer * 2]], 1.5, 0.6, null);
    // sechs Beine: kurz, dreigliedrig, setzen vor dem Köcher auf
    const beine = [0, 1, 2].map(i => { const g = ringe[i + 1] || ringe[i], sx = g.x - 1, sy = g.y + 4, b = bein[i];
      return glied([[sx, sy], [sx - 5 + b, sy + 7 - Math.abs(b)], [sx - 7 + b * 2, fy - 3 + (p.angriff && f === 1 ? -8 + i * 3 : 0)], [sx - 9 + b * 2, fy]], 1.8, 0.7, null); });
    const beineHinten = [0, 1, 2].map(i => { const g = ringe[i + 1] || ringe[i], sx = g.x + 2, sy = g.y + 4, b = -bein[i];
      return glied([[sx, sy], [sx + 2 + b, sy + 7], [sx + 3 + b, fy - 2], [sx + 5 + b, fy]], 1.5, 0.6, null); });
    const sichtbar = rein < 10;
    const gruppen = [
      { p: zweige.slice(1), k: 0.5, tone: -0.05 },
      { p: sichtbar ? beineHinten.flat() : [], k: 0.5, tone: -0.1 },
      { p: [roehre], k: 2, tone: -0.05 },
      ...teile.map(t => ({ p: t.p, k: 0.6, tone: t.tone + 0.16 })),
      { p: [zweige[0], ...knochen], k: 0.5 },
      { p: [rand], k: 1, tone: 0.05 },
      { p: sichtbar ? ringe : [], k: 1.2, tone: 0.1 },
      { p: sichtbar ? [kopf] : [], k: 1 },
      { p: sichtbar ? [...kieferL, ...kieferR] : [], k: 0.4 },
      { p: sichtbar ? beine.flat() : [], k: 0.5 },
    ];
    const augenL = [];
    const details = P => {
      // Öffnung: dunkel, darin der Bernsteinleib, der nach hinten im Köcher glimmt
      const [mx, my] = [ox0 + ux * 1.5, oy0 + uy * 1.5];
      P.glow(mx - 2, my + 1, 9, 0.85, 'glutDim', 'k3');
      // Brustringe: Bernstein, durchscheinend (Randlicht innen als Füllung, eine helle Fuge je Ring)
      if (sichtbar) ringe.forEach((g, i) => { for (let y = r(g.y - g.ry); y <= r(g.y + g.ry); y++) for (let x = r(g.x - g.rx); x <= r(g.x + g.rx); x++) { const q = ((x + 0.5 - g.x) / g.rx) ** 2 + ((y + 0.5 - g.y) / g.ry) ** 2; const c = P.get(x, y); if (q > 0.7 || !c || c > 4) continue; P.set(x, y, q < 0.25 ? (A.bay(x, y) < 0.5 ? 'harz' : 'r1') : (A.bay(x, y) < 0.6 ? 'r1' : 'glutDim')); } P.line(r(g.x - g.rx * 0.6), r(g.y - g.ry * 0.7), r(g.x - g.rx * 0.6), r(g.y + g.ry * 0.7), 'k1', true); });
      // Blechstreifen: Lichtkante oben, Nieten; Helm mit Kamm-Halter; Schildbuckel mit Ring
      teile.forEach((t, i) => { if (t.helm) { const [hx, hy] = t.helm; P.auf(r(hx + 2), r(hy - 4), 'r2'); P.auf(r(hx + 3), r(hy - 3), 'r1'); P.auf(r(hx), r(hy - 6), 'k3'); P.auf(r(hx - 3), r(hy), 'k0'); }
        else if (t.buckel) { const [bx, by] = t.buckel; P.auf(r(bx + 1), r(by - 2), 'r1'); P.auf(r(bx), r(by - 1), 'k3'); P.auf(r(bx - 2), r(by + 2), 'k0'); }
        else if (t.ecken) { const e = t.ecken; let best = -9, bi = 0; for (let k = 0; k < 4; k++) { const [p1, p2] = [e[k], e[(k + 1) % 4]]; const mx2 = (p1[0] + p2[0]) / 2 - t.c[0], my2 = (p1[1] + p2[1]) / 2 - t.c[1]; const d = (mx2 * 0.9 - my2 * 0.5) / Math.hypot(mx2, my2); if (d > best) { best = d; bi = k; } } const [p1, p2] = [e[bi], e[(bi + 1) % 4]]; P.line(r(p1[0]), r(p1[1]), r(p2[0]), r(p2[1]), 'r1', true); const [q1, q2] = [e[(bi + 2) % 4], e[(bi + 3) % 4]]; P.line(r(q1[0]), r(q1[1]), r(q2[0]), r(q2[1]), 'k0', true); P.auf(r(t.c[0]), r(t.c[1]), 'k3'); } });
      // Münzen: kleine Scheiben, eine fängt das Licht
      for (const [t, s] of [[0.2, 7], [0.38, -9], [0.72, 7], [0.9, 4], [0.52, -1]]) { const [x, y] = ax(t, s); P.auf(r(x), r(y), 'k3'); P.auf(r(x) + 1, r(y), 'r1'); P.auf(r(x), r(y) - 1, 'k2'); }
      // Harz in den Fugen, das ganze Gehäuse zusammenklebend
      for (const [t, s] of [[0.22, 0], [0.4, 2], [0.58, -3], [0.75, 0], [0.93, -1]]) { const [x, y] = ax(t, s); P.auf(r(x), r(y), 'harz'); P.auf(r(x), r(y) + 1, 'glutDim'); }
      // Kopf: zwei Punktaugen seitlich, die Kieferspitzen hell
      if (sichtbar && augen) { P.auge(hx0 - 2, hy0 - 1, 2); augenL.push([r(hx0 - 2), r(hy0 - 1)]); P.set(r(hx0 + 2), r(hy0 - 2), 'glut'); augenL.push([r(hx0 + 2), r(hy0 - 2)]); }
      if (sichtbar) { P.auf(r(hx0 - 11 - kiefer * 2), r(hy0 + 5), 'r1'); P.auf(r(hx0 - 11 - kiefer), r(hy0 + 6 + kiefer * 2), 'r1'); }
      if (!sichtbar && !p.tod) { P.auge(mx - 1, my, 1); augenL.push([r(mx - 1), r(my)]); }
    };
    gruppen.forEach(g => { g.anker = [0, 0]; });
    return { gruppen, details, augen: augenL };
  },
};
