// Der Mond unter dem Eis: Die Gezogene (die Gezeiten-Gestalt). Der Mond zieht das Meer über dem Eis zu sich
// herab, als Strang aus Wasser, der von oben bis auf den Staub reicht. Mit ihm kommt herunter, wen das Meer
// behalten hat. Eine Ertrunkene hängt kopfüber an diesem Strang, die Knöchel im Wasser; ihr Rock fällt über
// sie wie eine umgedrehte Glocke, die Arme hängen bis in den Staub, das Haar liegt auf dem Mond wie Wurzeln.
// Sie sieht dich an, verkehrt herum. Ebbe und Flut: Mal ist sie Wasser, mal ist sie Salz.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'gezogene', biom: 'mond', zone: 'mond', w: 96, h: 120, fuss: [50, 115], kopf: [56, 6], rimBis: 113,
  varianten: {
    // a: Arme hängen gerade in den Staub, langes Haar
    gezogene_a: { arme: 'haengen', haar: 1, strang: 4.2, saum: 3 },
    // b: Arme seitlich ausgebreitet, als fiele sie, Rock zerrissen, ein zweiter dünner Strang
    gezogene_b: { arme: 'breit', haar: 0.8, strang: 4.8, saum: 6, zweiter: true },
  },
  // Silhouetten-Proben (nicht gebaut): aufrecht stehend (eine Frau im nassen Kleid, nichts Falsches zu sehen);
  // frei schwebend ohne Strang (las sich wie eine Glocke mit Fransen). Genommen: kopfüber am Strang.
  proben: {
    probe_aufrecht: { arme: 'haengen', haar: 1, strang: 0, saum: 3, aufrecht: true },
    probe_frei: { arme: 'haengen', haar: 1, strang: 0, saum: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, saum } = A;
    const f = p.f, W = 96, H = 120;
    let sw = 0, fall = 0, reiss = 0, greif = 0;
    // sw: Ausschlag des Pendels unten (Pixel, + = nach hinten rechts); der Strang ist oben fest
    let idx = 0; if (p.idle) idx = [0, 1, 1, 0][f];
    if (p.angriff) { sw = [7, 12, -18, -6][f]; greif = [0, 0, 1, 0.4][f]; }
    if (p.treffer) sw = [5, 3][f];
    if (p.tod) { fall = r(p.q * 18); reiss = p.q; sw = r(p.q * 4); }
    const X = (x, y) => x + sw * Math.max(0, y) / 110; // Verschiebung wächst nach unten (Pendel)
    if (v.aufrecht) {
      const g = [{ p: [Pg([[38, 50], [62, 50], [70, 112], [30, 112]], null, { rd: 2 }), E(50, 40, 7, 8, 'haut'), C(42, 54, 32, 90, 2.5, 2, null), C(58, 54, 66, 90, 2.5, 2, null)], k: 1 }];
      return { gruppen: g, details: P => { P.auge(47, 40, 1); }, augen: [[47, 40]] };
    }
    // Strang aus Wasser: von oben bis um die Knöchel, leicht verdreht
    const strang = [];
    if (v.strang && reiss < 0.3) { const pts = []; for (let i = 0; i <= 6; i++) { const y = -4 + i * 5; pts.push([X(52 + Math.sin(i * 1.3) * 1.5, y), y]); } strang.push(...glied(pts, v.strang * 0.8, v.strang, 'haut')); if (v.zweiter) strang.push(...glied([[X(44, -4), -4], [X(45, 10), 10], [X(47, 24), 24]], 1.6, 1.4, 'haut')); }
    // Beine (oben), Hüfte, Rock als umgedrehte Glocke
    const fy = fall, ky = 26 + fy;
    const beine = [...glied([[X(48, ky - 2), ky - 2], [X(46, ky + 9), ky + 9], [X(45, ky + 20), ky + 20]], 2.6, 3.4, 'haut'), ...glied([[X(55, ky - 1), ky - 1], [X(56, ky + 10), ky + 10], [X(56, ky + 20), ky + 20]], 2.5, 3.4, 'haut')];
    const fuesse = [E(X(48, ky - 3), ky - 3, 2.4, 3, 'haut'), E(X(55, ky - 2), ky - 2, 2.3, 3, 'haut')];
    const hy = ky + 20, ry = hy + 32;
    const rockPts = [[X(43, hy), hy], [X(58, hy), hy], [X(64, hy + 10), hy + 10], [X(72, ry - 6), ry - 6], ...saum(X(74, ry), X(26, ry), ry, 9, v.saum, 5).map(([x, y]) => [x, y]), [X(28, ry - 6), ry - 6], [X(36, hy + 10), hy + 10]];
    const rock = Pg(rockPts, null, { rd: 1.2 });
    // Unter dem Saum: Schultern, Kopf kopfüber, Haar bis in den Staub
    const ky2 = ry + 9, kx2 = X(50, ky2);
    const schultern = Pg([[X(38, ry - 2), ry - 2], [X(62, ry - 2), ry - 2], [X(58, ry + 4), ry + 4], [X(42, ry + 4), ry + 4]], null, { rd: 1.5 });
    const hals = C(X(50, ry), ry, X(50, ky2 - 4), ky2 - 4, 3, 2.6, 'haut');
    const kopf = E(kx2, ky2, 7.5, 8, 'haut', { pf: 'bevel' });
    const haar = [];
    const hl = (113 - ky2 - 4) * v.haar + (p.tod ? 0 : 0);
    for (let i = 0; i < 9; i++) { const q = i / 8 - 0.5, x0 = kx2 + q * 10, wob = -sw * 0.12; const yb = Math.min(114, ky2 + 4 + hl);
      haar.push(...glied([[x0, ky2 + 3], [x0 + q * 6 + wob, ky2 + 4 + hl * 0.5], [x0 + q * 18 + wob * 1.5, yb - 2], [x0 + q * 30 + (q < 0 ? -4 : 4), 114]], 1.8 - Math.abs(q), 0.6, null)); }
    // Arme: hängen bis in den Staub (a) oder breit (b); beim Angriff greifen sie nach vorn
    const arme = [];
    for (const s of [-1, 1]) {
      const sx = X(50 + s * 10, ry), sy = ry + 1;
      let e, h;
      if (v.arme === 'breit') { e = [sx + s * 14, sy + 8]; h = [sx + s * 26, sy + 24]; }
      else { e = [sx + s * 10, sy + 15]; h = [sx + s * 15, 112]; }
      if (greif && s < 0) { e = [sx - 14 * greif - 4, sy + 10]; h = [sx - 30 * greif - 6, sy + 12 + (1 - greif) * 20]; }
      if (p.tod) h = [h[0], Math.min(113, h[1])];
      arme.push(...glied([[sx, sy], e, h], 2.4, 1.6, 'haut'), C(h[0], h[1], h[0] + s * 1.5, h[1] + 3, 1.2, 0.7, 'haut'), C(h[0], h[1], h[0] - s * 0.5, h[1] + 3.5, 1.1, 0.6, 'haut'));
    }
    const gruppen = [
      { p: haar, k: 0, kante: true },                         // 0
      { p: strang, k: 1.5, kante: true },                     // 1
      { p: [...fuesse, ...beine], k: 1.2, kante: true },      // 2
      { p: [schultern, hals], k: 1.5, kante: true },          // 3
      { p: [kopf], k: 0, kante: true },                       // 4
      { p: [rock], k: 0, kante: true },                       // 5
      { p: arme, k: 1, kante: true },                         // 6
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('mond'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Strang: fließendes Wasser, helle Fäden laufen nach unten, Funkeln im Mondlicht
      for (let y = 0; y < ky + 2; y++) for (let x = 30; x < 70; x++) { if (gid[y * W + x] !== 1) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const sx = x - X(52, y); const fl = (y + (p.idle ? f * 3 : 0) + (sx > 0 ? 0 : 4)) % 7; if (Math.abs(sx) < 1.5 && fl < 2) P.set(x, y, 'r1'); else if (fl === 3 && sx > 1) P.set(x, y, 'k3'); }
      if (strang.length && !p.tod) { const gx = r(X(53, 8 + (p.idle ? f * 3 : 6))), gy = 8 + (p.idle ? f * 3 : 6); P.set(gx, gy, 'bleich'); P.set(gx, gy + 7, 'r1'); }
      // Rock: Falten laufen zur Hüfte zusammen (Tal dunkel, Grat hell), nasse Glanzstreifen, Spitzensaum
      const mx = X(50, hy);
      for (const q of [-0.8, -0.45, -0.1, 0.25, 0.6]) {
        const x0 = mx + q * 4, x1 = X(50 + q * 22, ry - 2), y0 = hy + 4, y1 = ry - 2;
        P.line(x0, y0, x1, y1, 'k0', true); P.line(x0 + 1, y0 + 1, x1 + 1, y1, q > 0 ? 'r1' : 'k3', true);
      }
      for (let x = r(X(28, ry)); x <= X(72, ry); x += 2) { let y = ry + v.saum + 2; while (y > ry - 4 && gid[y * W + x] !== 5) y--; if (gid[y * W + x] === 5) P.set(x, y, (x >> 1) % 2 ? 'k3' : 'r1'); }
      // Tropfen fallen vom Saum (Leerlauf), Spritzer beim Schwung
      if (!p.tod) for (let k = 0; k < 4; k++) { const x = r(X(32 + k * 12, ry)) + 1, y = ry + 6 + ((k * 7 + f * 5) % 14); if (!gid[y * W + x]) P.set(x, y, k % 2 ? 'r1' : 'k3'); }
      // Gesicht, kopfüber: Augen unter dem Mund, offen; der Mund ein Spalt mit schwachem Licht
      if (!p.tod || f < 1) {
        const ex = r(kx2 - 3), ey = r(ky2 + 2);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'glut'); P.set(ex + 6, ey, 'glutDim'); P.glow(ex + 3, ey + 0.5, 5, 0.6);
        P.auf(ex, ey + 1, 'k0'); P.auf(ex + 5, ey + 1, 'k0');
        P.line(ex + 1, ey - 5, ex + 4, ey - 5, 'k0', true); P.auf(ex + 2, ey - 5, 'glutDim');
        P.auf(ex + 3, ey - 2, 'k3'); // Nasenrücken
        augen.push([ex, ey], [ex + 5, ey]);
      }
      // Haar am Boden: liegt im Staub wie Wurzeln, ein paar helle Strähnen
      for (let x = 10; x < 90; x += 3) if (gid[113 * W + x] === 0) P.set(x, 113, (x >> 1) % 3 ? 'k2' : 'k3');
      // Mondlicht im Wasser: wo der Strang die Knöchel umschließt, glimmt es bleich
      if (strang.length && (!p.tod || f < 1)) { const gx = r(X(52, ky - 6)), gy = ky - 6; P.glow(gx + 0.5, gy, 7, 0.8); P.set(gx, gy, 'bleich'); P.set(gx + 1, gy + 1, 'glut'); augen.push([gx, gy]); }
      // Ebbe und Flut: an den Knöcheln Salzkrusten (Körner)
      for (const [x, y] of [[-1, 2], [1, 4], [0, 6], [8, 3], [7, 6]]) P.auf(r(X(47 + x, ky + y)), ky + y, 'asche');
    };
    return { gruppen, details, augen, dx: idx };
  },
};
