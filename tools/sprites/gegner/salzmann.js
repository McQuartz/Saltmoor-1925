// Der Mann im Salz (Salzstollen, Ergänzung). Ein Hauer aus der Bronzezeit, lange vor den Römern
// im Stollen verschüttet und vom Salz bewahrt. Fellumhang, Tragsack, Bronzepickel, in der anderen
// Hand ein Bündel brennender Kienspäne, wie man sie damals im Berg trug. Falsch ist der Kopf:
// Das Salz hat ihn zu einem einzigen Würfel auskristallisiert, glatt und rechtwinklig, und drinnen
// sieht man sein Gesicht, bewahrt und mit offenen Augen. Am Tragsack wachsen weitere Würfel nach.
'use strict';
// Würfel in Schrägansicht als Sechseck: Mitte, Größe, Drehung -> Eckpunkte und Flächen
function wuerfel(x, y, s, a) {
  const ro = ([u, w]) => [x + u * Math.cos(a) - w * Math.sin(a), y + u * Math.sin(a) + w * Math.cos(a)];
  const k = 0.87 * s;
  const o = ro([0, -s]), or = ro([k, -s / 2]), ur = ro([k, s / 2]), u = ro([0, s]), ul = ro([-k, s / 2]), ol = ro([-k, -s / 2]), m = ro([0, 0]);
  return { umriss: [o, or, ur, u, ul, ol], oben: [o, or, m, ol], links: [ol, m, u, ul], rechts: [m, or, ur, u], m, o, or, ur, u, ul, ol };
}
// Inneres Randlicht: Kanten eines Polygons, die zum Gegenlicht (oben rechts) zeigen, eine Spur nach innen aufhellen
function kante(P, v, c = 'r1', schwelle = 0.3) {
  const n = v.length; let cx = 0, cy = 0; v.forEach(q => { cx += q[0] / n; cy += q[1] / n; });
  for (let i = 0; i < n; i++) {
    const a = v[i], b = v[(i + 1) % n]; let nx = b[1] - a[1], ny = -(b[0] - a[0]); const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
    if (nx * 0.9 + ny * -0.5 < schwelle) continue;
    const st = Math.ceil(l); for (let k = 0; k <= st; k++) { const x = a[0] + (b[0] - a[0]) * k / st - nx * 0.9, y = a[1] + (b[1] - a[1]) * k / st - ny * 0.9; const X = Math.round(x - 0.5), Y = Math.round(y - 0.5); const cur = P.get(X, Y); if (cur >= 1 && cur <= 4) P.set(X, Y, c); }
  }
}
function inPoly(px, py, v) { let c = false; for (let i = 0, j = v.length - 1; i < v.length; j = i++) { if ((v[i][1] > py) !== (v[j][1] > py) && px < (v[j][0] - v[i][0]) * (py - v[i][1]) / (v[j][1] - v[i][1]) + v[i][0]) c = !c; } return c; }
module.exports = {
  id: 'salzmann', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [46, 115], kopf: [42, 10], rimBis: 112,
  varianten: {
    // a: großer Würfelkopf, leicht gekippt, Kristalle am Tragsack
    salzmann_a: { kopfS: 13, kipp: 0.14, sackK: [[66, 39, 5, 0.25], [74, 35, 6.5, -0.12], [80, 46, 3.5, 0.4], [70, 29, 3.5, 0.5]], hals: 3 },
    // b: Würfel stärker gekippt, Hals länger, die Kristalle wachsen auch auf der Schulter
    salzmann_b: { kopfS: 12, kipp: -0.24, sackK: [[64, 37, 4, 0.4], [73, 33, 7, -0.25], [82, 40, 4.5, 0.1]], hals: 6, schulterK: 1 },
  },
  skizzen: {
    sil_wuerfelkopf: { kopfS: 13, kipp: 0.14, sackK: [[66, 39, 5, 0.25], [74, 35, 6.5, -0.12], [80, 46, 3.5, 0.4], [70, 29, 3.5, 0.5]], hals: 3 },
    sil_langhals: { kopfS: 12, kipp: -0.24, sackK: [[64, 37, 4, 0.4], [73, 33, 7, -0.25], [82, 40, 4.5, 0.1]], hals: 6, schulterK: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, bay } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, flamme = 1, pk = 0, kipp = 0, blick = 1, span = 0;
    // pk: Pickel 0 gesenkt, 1 hoch über dem Kopf ausgeholt, 2 nach vorn unten geschlagen
    if (p.idle) { atem = [0, 0, 1, 1][f]; flamme = [1, 0.8, 1.15, 0.9][f]; blick = [1, 1, 1, 0][f]; span = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -3][f]; pk = [0.6, 1, 2, 1.7][f]; flamme = [1, 1.2, 1.4, 1.1][f]; blick = [1, 1.4, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; flamme = 0.6; kipp = 0.12; blick = 0.6; }
    if (p.tod) { fall = r(p.q * 14); lean = r(p.q * 5); flamme = Math.max(0, 1 - p.q * 3); kipp = p.q * 0.5; blick = 0; }
    const T = atem + fall, bx = 46 + lean, by = 76 + T; // Hüfte
    // Beine: leicht gebeugt, Lederwickel, Bundschuhe
    const beinV = glied([[bx - 5, by + 2], [bx - 9, by + 20 - fall / 2], [bx - 8, 112]], 3.8, 2.6, null);
    const beinH = glied([[bx + 5, by + 2], [bx + 9, by + 20 - fall / 2], [bx + 7, 112]], 3.8, 2.6, null);
    const fuesse = [E(bx - 11, 113, 4.6, 2.3, 'dunkel'), E(bx + 5, 113, 4.6, 2.3, 'dunkel')];
    // Rumpf: Kittel aus Wolle, leicht gebeugt
    const sx = bx - 6, sy = by - 30; // vordere Schulter
    const rumpf = Pg([[sx - 5, sy + 3], [sx, sy - 2], [bx + 6, by - 33], [bx + 11, by - 28], [bx + 11, by - 4], [bx + 9, by + 4], [bx - 8, by + 4], [bx - 10, by - 8], [sx - 6, sy + 12]], null, { rd: 2 });
    // Fellumhang nur über den Schultern, zottiger Saum (heller als der Kittel)
    const umhang = Pg([[sx - 7, sy + 2], [sx - 1, sy - 4], [bx + 7, by - 35], [bx + 13, by - 30], [bx + 13, by - 20], ...A.saum(bx + 13, sx - 8, by - 16, 7, 4, 3, p.idle ? [0, 1, 1, 0][f] : 0), [sx - 8, sy + 8]], 'haut', { rd: 0.6 });
    const guertel = C(bx - 10, by - 1, bx + 11, by - 2, 1.4, 1.4, 'dunkel');
    const schurz = Pg([[bx - 9, by], [bx + 10, by - 1], [bx + 8, by + 7], [bx - 7, by + 8]], 'dunkel', { rd: 0.6 });
    // Tragsack hinter dem Rücken, höher als die Schulter, mit Holzrahmen
    const kx = bx + 14, ky = by - 34;
    const sack = Pg([[kx - 3, ky - 2], [kx + 9, ky - 6], [kx + 17, ky + 2], [kx + 16, ky + 24], [kx + 9, ky + 32], [kx + 1, ky + 30], [kx - 2, ky + 16]], null, { rd: 2.5 });
    const sackRand = C(kx - 3, ky - 2, kx + 9, ky - 6, 1.5, 1.5, 'dunkel');
    const rahmen = [C(kx + 15, ky - 10, kx + 15, ky + 34, 1.1, 1.1, 'dunkel', { pf: 'flat' }), C(kx - 1, ky - 6, kx + 1, ky + 30, 1, 1, 'dunkel', { pf: 'flat' })];
    // Hals und Würfelkopf
    const kS = v.kopfS, hx = sx - 4 + r(lean * 0.4), hy = sy - v.hals - kS + 2 + (p.idle && f === 2 ? 1 : 0);
    const hals = C(sx + 1, sy + 2, hx + 1, hy + kS * 0.6, 3.4, 2.8, 'haut');
    const KW = wuerfel(hx, hy, kS, v.kipp + kipp + (p.angriff ? [0, -0.06, 0.1, 0.05][f] : 0));
    // Kristalle am Tragsack (und auf der Schulter)
    const SK = v.sackK.map(([x, y, s, a], i) => wuerfel(x + lean + (p.tod ? r(p.q * 3) * (i + 1) : 0), y + T + (p.tod ? r(p.q * 4) : 0), s, a + (p.treffer && f === 0 ? 0.1 : 0)));
    if (v.schulterK) SK.push(wuerfel(sx + 6, sy - 2, 3, 0.35));
    // Arme: vorne der Pickel, hinten das Spanbündel
    let hand, ell;
    if (pk === 0) { ell = [sx - 6, sy + 12]; hand = [sx - 9, sy + 23]; }
    else if (pk < 1.5) { ell = [sx - 2 + pk, sy - 6 - pk * 3]; hand = [sx + 6 - pk * 2, sy - 16 - pk * 4]; }
    else { ell = [sx - 12, sy + 2]; hand = [sx - 21, sy + 9]; }
    const armV = [...glied([[sx - 2, sy + 2], ell, hand], 3.5, 2.3, null), E(hand[0], hand[1], 2.8, 2.5, 'haut')];
    const hh = [bx + 24 + (p.angriff ? 2 : 0), by + 2 - span];
    const armH = [...glied([[bx + 10, by - 24], [bx + 20, by - 10], hh], 3, 2.3, null), E(hh[0], hh[1], 2.6, 2.3, 'haut')];
    const spaene = [0, 1, 2].map(i => C(hh[0] - 2 + i * 2, hh[1] + 4, hh[0] + 1 + i * 3, hh[1] - 9 + i, 0.8, 0.8, 'dunkel', { pf: 'flat' }));
    const flX = hh[0] + 3, flY = hh[1] - 10;
    // Bronzepickel: Stiel, Klinge quer, Spitze in Schlagrichtung
    const pick = [];
    {
      const wa = pk === 0 ? 1.45 : pk < 1.5 ? -1.5 - pk * 0.75 : 0.7, L = 22;
      const e = [hand[0] + Math.cos(wa) * L, hand[1] + Math.sin(wa) * L], s0 = [hand[0] - Math.cos(wa) * 4, hand[1] - Math.sin(wa) * 4];
      const nx = -Math.sin(wa), ny = Math.cos(wa), dx = Math.cos(wa), dy = Math.sin(wa);
      pick.push(C(s0[0], s0[1], e[0], e[1], 1.3, 1.4, 'dunkel', { pf: 'flat' }));
      const sp = pk >= 1.5 || pk === 0 ? 1 : -1;
      pick.push(Pg([[e[0] - nx * 3 * sp - dx, e[1] - ny * 3 * sp - dy], [e[0] - nx * 3 * sp + dx * 3, e[1] - ny * 3 * sp + dy * 3], [e[0] + nx * 10 * sp + dx * 1, e[1] + ny * 10 * sp + dy * 1], [e[0] + nx * 1 * sp - dx * 1.5, e[1] + ny * 1 * sp - dy * 1.5]], null, { rd: 0.3 }));
    }
    const pickHinten = pk > 0 && pk < 1.5;
    const schneide = pick[1].v;
    const gruppen = [
      { p: pickHinten ? pick : [], k: 0 },
      { p: rahmen, k: 0, anker: [lean, T] },
      { p: [sack], k: 1, anker: [lean, T] },
      { p: [sackRand], k: 0 },
      ...SK.map(w => ({ p: [Pg(w.umriss, null, { rd: 0.3, b: 1.5 })], k: 0, anker: [lean, T] })),
      { p: [beinH, fuesse[1]].flat(), k: 1 },
      { p: [beinV, fuesse[0]].flat(), k: 1 },
      { p: [rumpf], k: 2, anker: [lean, T] },
      { p: [schurz], k: 0, anker: [lean, T] },
      { p: [guertel], k: 0, noRim: true },
      { p: [umhang], k: 0.5, anker: [lean, T] },
      { p: spaene, k: 0 },
      { p: armH, k: 1, anker: [lean, T] },
      { p: [hals], k: 0 },
      { p: [Pg(KW.umriss, null, { rd: 0.4, pf: 'flat' })], k: 0, anker: [lean, T] },
      { p: pickHinten ? [] : pick, k: 0 },
      { p: armV, k: 1.2, anker: [lean, T] },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Würfelflächen mit Verlauf (k1 < k2 < k3 < r1), gedithert: oben hell zur Lichtkante, vorn mittel, rechts dunkler mit Lichtkante
      const STU = ['k1', 'k2', 'k3', 'r1'];
      const stufe = (x, y, t) => { const q = Math.max(0, Math.min(0.999, t)) * 3, k = Math.floor(q); return STU[Math.min(3, (q - k) > bay(x - lean, y - T) ? k + 1 : k)]; };
      const flaechen = (w, hell) => {
        const xs = w.umriss.map(q => q[0]), ys = w.umriss.map(q => q[1]); const s = Math.hypot(w.o[0] - w.m[0], w.o[1] - w.m[1]);
        for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++) {
          if (!B(x, y)) continue; const X = x + 0.5, Y = y + 0.5;
          const dOr = Math.hypot(X - w.or[0], Y - w.or[1]) / (s * 1.7), dO = Math.hypot(X - w.o[0], Y - w.o[1]) / (s * 1.7);
          if (inPoly(X, Y, w.oben)) P.set(x, y, stufe(x, y, hell * (1.25 - Math.min(dOr, dO) * 0.7)));
          else if (inPoly(X, Y, w.links)) P.set(x, y, stufe(x, y, hell * (0.92 - Math.hypot(X - w.ol[0], Y - w.ol[1]) / (s * 2.2) * 0.4)));
          else if (inPoly(X, Y, w.rechts)) P.set(x, y, stufe(x, y, hell * (0.6 - dOr * 0.25)));
        }
        P.line(w.ol[0], w.ol[1], w.m[0], w.m[1], 'k3', true); P.line(w.m[0], w.m[1], w.u[0], w.u[1], 'k1', true);
        P.line(w.m[0], w.m[1], w.or[0], w.or[1], 'r1', true);
      };
      SK.forEach(w => flaechen(w, 0.95));
      // Würfelkopf: Salz ist heller als alles andere an ihm
      flaechen(KW, 1);
      // Glitzern auf der Oberseite (Salzkorn), ein Pixel, wandert im Leerlauf
      const gl = [[0.3, 0.25], [0.55, 0.4], [0.4, 0.55], [0.6, 0.3]][f % 4];
      P.auf(r(KW.ol[0] + (KW.or[0] - KW.ol[0]) * gl[0]), r(KW.o[1] + (KW.m[1] - KW.o[1]) * gl[1] + 1), 'r2');
      // Gesicht im Salz, auf der vorderen (linken) Fläche: Augenhöhlen, Nase, offener Mund, Augen
      const L = (a, b) => [KW.ol[0] + (KW.m[0] - KW.ol[0]) * a + (KW.ul[0] - KW.ol[0]) * b, KW.ol[1] + (KW.m[1] - KW.ol[1]) * a + (KW.ul[1] - KW.ol[1]) * b];
      const [e1x, e1y] = L(0.28, 0.32), [e2x, e2y] = L(0.7, 0.32), [nx_, ny_] = L(0.5, 0.55), [mx, my] = L(0.48, 0.78);
      P.el(e1x + 0.5, e1y + 0.5, 1.8, 1.4, 'k0', true); P.el(e2x + 0.5, e2y + 0.5, 1.8, 1.4, 'k0', true);
      P.auf(r(nx_), r(ny_), 'k0'); P.auf(r(nx_), r(ny_) - 1, 'k1');
      P.el(mx + 0.5, my + 0.5, p.angriff ? 2.2 : 1.6, p.angriff ? 1.6 : 1, 'k0', true);
      if (blick > 0) {
        P.glow((e1x + e2x) / 2 + 0.5, e1y + 0.5, 7 * blick, 0.7);
        P.set(r(e1x), r(e1y), 'kern'); P.set(r(e2x), r(e2y), blick > 1.2 ? 'kern' : 'glut');
        if (blick > 1.3) { P.set(r(e1x) + 1, r(e1y), 'glut'); P.set(r(e2x) + 1, r(e2y), 'glut'); }
        augen.push([r(e1x), r(e1y)], [r(e2x), r(e2y)]);
      }
      // inneres Randlicht: Schulterfell vor dem Sack, Sack vor dem Rahmen, Kittel unter dem Fell
      kante(P, [[sx - 7, sy + 2], [sx - 1, sy - 4], [bx + 7, by - 35], [bx + 13, by - 30], [bx + 13, by - 20], [sx - 8, sy + 8]], 'r1', 0.1); kante(P, sack.v, 'r1', 0.2); kante(P, rumpf.v, 'k3', 0.2);
      // Fell: senkrechte Strähnen, oben heller (Gegenlicht), unten dunkel
      const UP = [[sx - 7, sy + 2], [sx - 1, sy - 4], [bx + 7, by - 35], [bx + 13, by - 30], [bx + 13, by - 16], [sx - 8, sy + 10]];
      for (let y = r(sy - 6); y < by - 10; y++) for (let x = r(sx - 9); x < bx + 15; x++) {
        const c = P.get(x, y); if (c < 1 || c > 4 || !inPoly(x + 0.5, y + 0.5, UP)) continue;
        const str = ((x * 13) % 5), t = 0.75 - (y - (sy - 4)) / 26 + (str === 0 ? 0.25 : str === 3 ? -0.2 : 0);
        P.set(x, y, stufe(x, y, t * 0.92));
      }
      // Beinwickel: Querstreifen
      for (let y = r(by + 8); y < 110; y += 3) { for (const lx of [bx - 9, bx + 8]) { P.auf(r(lx - 2), y, 'k3'); P.auf(r(lx - 1), y, 'k3'); P.auf(r(lx), y + 1, 'k0'); } }
      // Fellumhang: Zotteln entlang der Schulterlinie, Fransen am Saum
      for (let i = 0; i < 9; i++) { const zx = r(sx - 4 + i * 2.4), zy = r(sy + 1 + ((i * 7) % 5)); P.auf(zx, zy, 'k1'); P.auf(zx, zy + 1, 'k1'); P.auf(zx + 1, zy - 1, 'k3'); }
      for (let x = r(bx - 9); x <= bx + 10; x += 3) P.auf(x, r(by - 3 + ((x * 5) % 2)), 'k3');
      // Kittel: Falten, Saum unter dem Fell
      P.line(bx - 3, by - 14, bx - 4, by - 3, 'k0', true); P.line(bx - 2, by - 14, bx - 3, by - 3, 'k3', true); P.line(bx + 5, by - 14, bx + 5, by - 3, 'k0', true);
      // Tragsack: Naht mit Stichen, Lederflicken, Rahmenholz unten
      for (let y = r(ky + 2); y < ky + 24; y += 2) P.auf(r(kx + 6 + (y - ky) * 0.08), y, 'k3');
      P.line(kx - 2, ky + 20, kx + 10, ky + 25, 'k0', true); P.line(kx - 2, ky + 19, kx + 10, ky + 24, 'k3', true);
      P.el(kx + 1, ky + 10, 2.5, 3, 'k1', true); P.auf(r(kx), r(ky + 8), 'k3'); P.auf(r(kx + 2), r(ky + 12), 'k3');
      // Faltenlichter im Umhang: helle Kante links neben jeder Falte
      // Riemen des Tragsacks quer über die Schulter
      P.line(sx + 2, sy - 1, bx + 6, by - 8, 'k0', true);
      // Bundschuh-Schnürung
      P.auf(r(bx - 9), 110, 'k3'); P.auf(r(bx + 7), 110, 'k3');
      // Bronzeklinge: Schneide glänzt
      P.line(schneide[1][0], schneide[1][1], schneide[2][0], schneide[2][1], 'r1', true);
      // Spanbündel brennt: inneres Licht, beleuchtet Hand und Sack von unten
      if (flamme > 0) {
        P.glow(flX + 0.5, flY + 3.5, 11 * flamme, 0.9);
        P.set(flX, flY, 'kern'); P.set(flX, flY - 1, flamme > 0.85 ? 'kern' : 'glut'); P.set(flX - 1, flY, 'glut'); P.set(flX + 1, flY, 'glut'); P.set(flX + 1, flY - 1, 'glut');
        if (flamme > 0.95) { P.set(flX, flY - 2, 'glut'); P.set(flX - 1, flY - 3, 'glutDim'); P.set(flX - 1, flY - 1, 'glut'); }
        if (flamme > 1.1) { P.set(flX + 1, flY - 3, 'glut'); P.set(flX, flY - 4, 'glutDim'); P.set(flX + 2, flY - 2, 'glutDim'); }
        P.set(flX - 2, flY + 1, 'glutDim'); P.set(flX + 2, flY + 1, 'glutDim');
        augen.push([flX, flY]);
      }
    };
    return { gruppen, details, augen };
  },
};
