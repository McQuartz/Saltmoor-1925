// Die Funkstation am Pol: Die Telegrafistin. Sie nahm 1912 im Postamt von Saltmoor die Meldungen der
// Expedition auf und fuhr eines Tages selbst hin. Jetzt klopfen ihre Finger ohne Pause auf der Taste, die ihr
// vor der Brust gewachsen ist; zu lange Finger, zu viele Glieder. Was sie tippt, kommt ihr als Papierstreifen
// aus dem Mund und fällt in Schleifen bis auf den Boden. Auf dem Streifen steht dein Name.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'telegrafistin', biom: 'funkstation', zone: 'funkstation', w: 96, h: 120, fuss: [50, 115], kopf: [48, 10], rimBis: 113,
  varianten: {
    // a: Augenschirm, Haarknoten, der Streifen fällt in Schleifen vor ihr bis auf den Boden
    telegrafistin_a: { schirm: true, offen: false, stola: false },
    // b: ohne Schirm, das Haar offen den Rücken hinab, der Streifen ist ihr wie eine Stola um Hals und Arme gewunden
    telegrafistin_b: { schirm: false, offen: true, stola: true },
  },
  // Silhouetten-Probe (nicht gebaut): ohne Streifen, Hände an der Taste (eine Frau im langen Rock, nichts
  // Falsches zu sehen, zu nah an der Kurgästin). Genommen: der Streifen aus dem Mund in Schleifen bis zum Boden.
  proben: { probe_ohne: { schirm: true, offen: false, stola: false, ohne: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, hand = 0, tipp = f % 2, kopfH = 0;
    // hand: 0 an der Taste, 1 hoch über dem Kopf (ausgeholt, Finger gespreizt), 2 nach vorn unten geschlagen
    if (p.idle) { atem = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 3, -8, -3][f]; hand = [0.7, 1, 2, 1.5][f]; kopfH = [-1, -2, 2, 1][f]; tipp = 0; }
    if (p.treffer) { lean = [3, 2][f]; hand = 0.3; }
    if (p.tod) { fall = r(p.q * 22); lean = r(p.q * 4); }
    const T = atem + fall, L = lean;
    // Rock: schmal, bis zum Knöchel, hinten etwas Stoff
    const wx = 50 + L * 0.5, wy = 62 + T;
    const rock = Pg([[wx - 7, wy], [wx + 6, wy], [wx + 12, wy + 10], [wx + 16, wy + 30], [wx + 19, 108], [wx + 21, 113], [wx - 15, 113], [wx - 14, 108], [wx - 11, wy + 24], [wx - 9, wy + 8]], null, { rd: 1.4 });
    const turnuere = E(wx + 8, wy + 5, 5, 6, null);
    const schuhe = [E(wx - 9, 113, 3.6, 2, 'dunkel')];
    // Oberkörper: Bluse mit Puffärmeln, Mieder; hoher Kragen
    const sx = 50 + L, sy = 40 + T;
    const leib = Pg([[sx - 7, sy], [sx + 6, sy - 1], [sx + 9, sy + 4], [sx + 8, sy + 14], [sx + 7, sy + 23], [sx - 8, sy + 23], [sx - 10, sy + 12], [sx - 9, sy + 4]], null, { rd: 1.6 });
    const mieder = Pg([[sx - 8, sy + 14], [sx + 7, sy + 14], [sx + 7, sy + 23], [sx - 1, sy + 26], [sx - 8, sy + 23]], 'dunkel', { rd: 0.6 });
    const kx = 46 + L * 1.1, ky = 27 + T + kopfH;
    const hals = C(sx - 1, sy, kx + 1, ky + 6, 3.2, 2.6, 'haut');
    const kragen = Pg([[sx - 5, sy - 6], [sx + 3, sy - 7], [sx + 4, sy + 1], [sx - 5, sy + 2]], 'haut', { rd: 0.5 });
    const kopf = [E(kx, ky, 6.2, 7.2, 'haut', { pf: 'bevel' }), C(kx - 5, ky - 1, kx - 7.5, ky + 2, 1.4, 0.9, 'haut'), E(kx - 3, ky + 5, 3, 2.6, 'haut')];
    const haar = v.offen
      ? [E(kx + 2, ky - 3, 7, 6, null), ...glied([[kx + 5, ky - 1], [kx + 9, ky + 10], [kx + 11, ky + 26], [kx + 12, ky + 42]], 3.4, 1.6, null), ...glied([[kx + 2, ky + 1], [kx + 6, ky + 16], [kx + 6, ky + 30]], 2.6, 1.2, null)]
      : [E(kx + 2, ky - 3, 7, 5.6, null), E(kx + 8, ky - 2, 4, 4, null)];
    const schirm = v.schirm ? [Pg([[kx - 2, ky - 6], [kx + 3, ky - 8], [kx - 12, ky - 4], [kx - 13, ky - 2]], null, { rd: 0.5 }), C(kx - 3, ky - 6, kx + 6, ky - 7, 1, 1, null)] : [];
    // Taste vor der Brust: Holzsockel, Hebel, Knopf; sie ist in die Bluse gewachsen
    const tx = sx - 9, ty = sy + 10;
    const taste = [Pg([[tx - 4, ty - 1], [tx + 5, ty - 2], [tx + 6, ty + 3], [tx - 4, ty + 4]], null, { rd: 0.5 }), C(tx - 2, ty - 2, tx + 4, ty - 3 + (tipp ? 1 : 0), 0.8, 0.8, null), E(tx - 3, ty - 3 + (tipp ? 1 : 0), 1.6, 1.2, null)];
    // Hände: Schultern, Ellbogen; lange Finger mit vielen Gliedern, die klopfen
    const schV = [sx - 7, sy + 3], schH = [sx + 6, sy + 3];
    let hV, eV, hH, eH;
    if (hand < 0.5) { eV = [sx - 13, sy + 14]; hV = [tx - 1, ty - 6]; eH = [sx + 8, sy + 16]; hH = [tx + 6, ty - 6]; }
    else if (hand < 1.5) { const k = Math.min(1, hand); eV = [sx - 12, sy - 4 * k]; hV = [sx - 8, sy - 18 * k - 2]; eH = [sx + 11, sy - 2 * k]; hH = [sx + 4, sy - 20 * k]; }
    else { eV = [sx - 18, sy + 6]; hV = [sx - 27, sy + 14]; eH = [sx - 6, sy + 10]; hH = [sx - 20, sy + 20]; }
    const arm = (s, e, h) => [...glied([s, e, h], 2.6, 1.8, null), E(h[0], h[1], 2, 2.2, 'haut')];
    // Finger: vier je Hand, je drei Glieder, gespreizt; beim Klopfen hebt sich jeder zweite
    const finger = (h, dir, n, hoch) => { const out = []; for (let i = 0; i < n; i++) { const a0 = dir + (i - (n - 1) / 2) * 0.38; const up = (i + f) % 2 && hand < 0.5 ? -1.5 : 0; let [x, y] = h; let a = a0; const pts = [[x, y]]; for (let j = 0; j < 3; j++) { a += (j ? 0.5 : -0.2) * (hoch ? -1 : 1); x += Math.cos(a) * (5.4 - j * 0.7); y += Math.sin(a) * (5.4 - j * 0.7) + (j === 2 ? up : 0); pts.push([x, y]); } out.push(...glied(pts, 1.1, 0.7, 'haut')); } return out; };
    const handDir = hand < 0.5 ? 1.75 : hand < 1.5 ? -1.3 : 2.4;
    const fingerV = finger(hV, handDir, 4, hand >= 0.5 && hand < 1.5), fingerH = finger(hH, handDir + 0.2, 4, hand >= 0.5 && hand < 1.5);
    // Papierstreifen aus dem Mund: Schleifen vor dem Rock bis auf den Boden, dort gerollt
    const mx = kx - 5, my = ky + 4;
    const sw = p.idle ? 0 : p.angriff ? [1, 2, -3, -1][f] : 0;
    let streifenPts;
    if (v.stola) streifenPts = [[mx, my], [mx - 2, my + 4], [sx - 6, sy - 3], [sx + 2, sy - 6], [sx + 9, sy - 2], [sx + 16, sy + 4], [sx + 22, sy + 18], [sx + 25 + sw, sy + 36], [sx + 25 + sw, sy + 54], [sx + 25, 104], [sx + 29, 112], [sx + 37, 113], [sx + 40, 110]];
    else streifenPts = [[mx, my], [mx - 3, my + 7], [mx - 10 + sw, my + 16], [mx - 6 + sw, my + 25], [mx - 2 + sw, my + 30], [mx - 8 + sw, my + 36], [mx - 17 + sw, my + 44], [mx - 21 + sw, my + 56], [mx - 15, my + 66], [mx - 12, my + 72], [mx - 18, my + 80], [mx - 24, 104], [mx - 22, 112], [mx - 12, 113], [mx - 6, 110], [mx - 12, 108]];
    // glätten (Catmull-Rom), damit der Streifen in Bögen fällt und nicht in Zacken
    const glatt = pts => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; for (let k = 0; k < 4; k++) { const t = k / 4, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(d => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3))); } } out.push(pts[pts.length - 1]); return out; };
    const streifen = v.ohne ? [] : glied(glatt(streifenPts), 1.8, 1.9, 'haut', { pf: 'flat' });
    const hochH = hand >= 0.5 && hand < 1.5;
    const gruppen = [
      { p: v.offen ? haar.slice(1) : [], k: 1, kante: true },              // 0 offenes Haar hinten
      { p: arm(schH, eH, hH).concat(hochH ? [] : fingerH), k: 1, kante: true, anker: [L, T] }, // 1 hinterer Arm
      { p: [rock, turnuere, ...schuhe], k: 2.5, anker: [L * 0.5, T], kante: true },   // 2 Rock
      { p: [leib], k: 1.5, anker: [L, T], kante: true },                  // 3 Leib
      { p: [mieder], k: 0.5, anker: [L, T], kante: true },                // 4 Mieder
      { p: [hals, kragen], k: 0.8, kante: true },                          // 5
      { p: [kopf[0], kopf[1], kopf[2], ...(v.offen ? [haar[0]] : haar)], k: 1.2, kante: true, anker: [L, T] }, // 6 Kopf und Haar
      { p: schirm, k: 0, kante: true },                                    // 7 Augenschirm
      { p: taste, k: 0.5, kante: true },                                   // 8 Taste
      { p: hochH ? fingerH : [], k: 0.5, kante: true },                    // 9
      { p: arm(schV, eV, hV).concat(fingerV), k: 1, kante: true, anker: [L, T] }, // 10 vorderer Arm
      { p: streifen, k: 0, kante: true, noRim: true },                     // 11 Streifen
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('funkstation'), { rimBis: 113 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Streifen: helles Papier im Licht, darauf Punkt und Strich (dein Name), die Kante zur Lampe weiß
      if (streifen.length) {
        let s = 0;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== 11) continue; const c = P.get(x, y); if (!c || c > 4) continue; P.set(x, y, 'r1'); }
        for (const k of streifen) { const n = Math.ceil(Math.hypot(k.x2 - k.x1, k.y2 - k.y1)); for (let i = 0; i < n; i++) { const q = i / n, x = r(k.x1 + (k.x2 - k.x1) * q), y = r(k.y1 + (k.y2 - k.y1) * q); s++; if (gid[y * W + x] !== 11) continue; const m = s % 11; if (m === 0 || m === 3 || (m >= 6 && m <= 8)) { P.set(x, y, 'k1'); if (gid[(y + 1) * W + x] === 11) P.set(x, y + 1, 'k1'); } } }
        // Rand zur Lampe (oben rechts): helle Kante
        for (let y = 1; y < H; y++) for (let x = 0; x < W - 1; x++) if (gid[y * W + x] === 11 && gid[(y - 1) * W + x + 1] !== 11 && gid[y * W + x + 1] !== 11 && P.get(x, y) === 5) P.set(x, y, 'r2');
        for (let y = 0; y < H - 1; y++) for (let x = 1; x < W; x++) if (gid[y * W + x] === 11 && gid[(y + 1) * W + x - 1] !== 11 && gid[y * W + x - 1] !== 11 && P.get(x, y) === 5) P.set(x, y, 'k3');
      }
      // Bluse: Falten von der Schulter zum Mieder, Biesen; Mieder mit Schnürung
      const X = r(sx), Y = r(sy);
      for (const [x0, y0, x1, y1] of [[X - 4, Y + 1, X - 5, Y + 13], [X + 2, Y, X + 4, Y + 13], [X + 5, Y + 2, X + 7, Y + 12]]) { P.line(x0, y0, x1, y1, 'k1', true); P.line(x0 + 1, y0, x1 + 1, y1, 'k3', true); }
      for (let i = 0; i < 4; i++) { P.auf(X - 1, Y + 15 + i * 2, 'kupfer'); P.auf(X - 2, Y + 16 + i * 2, 'k3'); }
      // Rock: Bahnen, Saumband, eine Lichtfalte
      for (const [x0, x1] of [[X - 4, X - 7], [X + 1, X + 1], [X + 6, X + 9]]) { P.line(x0, Y + 26, x1, 111, 'k0', true); P.line(x0 + 1, Y + 27, x1 + 1, 111, 'k2', true); }
      P.line(r(wx - 12), 109, r(wx + 13), 109, 'k3', true);
      // Taste: Kupferhebel, am Kontakt springt ein Funke, wenn sie drückt
      const TX = r(tx), TY = r(ty);
      P.auf(TX - 2, TY - 2 + (tipp ? 1 : 0), 'kupfer'); P.auf(TX, TY - 2 + (tipp ? 1 : 0), 'kupfer'); P.auf(TX + 2, TY - 3 + (tipp ? 1 : 0), 'kupfer');
      if (!aus) { P.glow(TX + 0.5, TY + 0.5, 9, 0.8); P.set(TX + 1, TY, tipp ? 'kern' : 'glut'); P.set(TX + 2, TY, 'glutDim'); augen.push([TX + 1, TY]); }
      // Gesicht: Mund offen (der Streifen kommt heraus), Augen unter dem Schirm glimmen
      const ex = r(kx - 3), ey = r(ky - 1);
      if (!aus) { P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 3, ey, 'glut'); P.glow(ex + 1, ey + 0.5, 4.5, 0.5); augen.push([ex, ey]); }
      P.auf(r(mx), r(my), 'k0'); P.auf(r(mx) + 1, r(my), 'k0');
      if (v.schirm) { P.line(r(kx - 12), r(ky - 3), r(kx - 2), r(ky - 6), 'k0', true); P.auf(r(kx - 12), r(ky - 4), 'kupfer'); }
      // Haar: Strähnen, ein Kamm im Knoten
      if (!v.offen) { P.auf(r(kx + 8), r(ky - 4), 'kupfer'); P.line(r(kx - 2), r(ky - 7), r(kx + 6), r(ky - 6), 'k3', true); }
      else { for (let i = 0; i < 4; i++) P.line(r(kx + 6 + i), r(ky + 2 + i * 6), r(kx + 8 + i), r(ky + 8 + i * 6), i % 2 ? 'k3' : 'k1', true); }
      // Fingerkuppen: abgegriffen, hell
      for (const k of [...fingerV, ...fingerH].filter((_, i) => i % 3 === 2)) P.auf(r(k.x2), r(k.y2), 'r1');
    };
    return { gruppen, details, augen };
  },
};
