// Der Mond unter dem Eis: Der Astronom. Ein Privatgelehrter der Expedition von 1890, der die Strickleiter
// hinabgestiegen ist, um den Mond von nah zu sehen. Wo sein Kopf war, steht jetzt eine Armillarsphäre aus
// Messingringen, und in ihr kreist ein kleiner, bleicher Mond. Im Gehrock steckt sein Beobachtungsbuch,
// in der Hand trägt er einen großen Stechzirkel, mit dem er Krater misst. Was er ansieht, bleibt stehen.
'use strict';
// Innenkanten: vordere Teile fangen an ihrer Lichtkante (oben rechts) eine Linie inneres Randlicht
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
// Randlicht an der lichtzugewandten Seite dünner Kapseln (Ringe, Zirkelschenkel)
function kapselLicht(P, caps, c = 'r1') {
  for (const k of caps) {
    if (!k || k.t !== 'c') continue; const dx = k.x2 - k.x1, dy = k.y2 - k.y1, l = Math.hypot(dx, dy) || 1; let nx = -dy / l, ny = dx / l;
    if (nx * 0.9 - ny * 0.5 < 0) { nx = -nx; ny = -ny; } if (nx * 0.9 - ny * 0.5 < 0.15) continue;
    for (let i = 0; i <= Math.ceil(l); i++) { const q = i / Math.ceil(l), rr = k.r1 + (k.r2 - k.r1) * q - 0.6; const x = Math.round(k.x1 + dx * q + nx * rr - 0.5), y = Math.round(k.y1 + dy * q + ny * rr - 0.5); const cur = P.get(x, y); if (cur && cur <= 4) P.set(x, y, c); }
  }
}
// Ellipse als geschlossener Ring aus Kapseln (rot = Drehung)
function ring(C, cx, cy, rx, ry, rot, r, n = 28, m = null, von = 0, bis = 1) {
  const out = [], ca = Math.cos(rot), sa = Math.sin(rot);
  const pt = t => { const a = t * Math.PI * 2, u = Math.cos(a) * rx, v = Math.sin(a) * ry; return [cx + u * ca - v * sa, cy + u * sa + v * ca]; };
  for (let i = 0; i < n; i++) { const t0 = von + (bis - von) * i / n, t1 = von + (bis - von) * (i + 1) / n; const a = pt(t0), b = pt(t1); out.push(C(a[0], a[1], b[0], b[1], r, r, m)); }
  out.pt = pt; return out;
}

module.exports = {
  id: 'astronom', biom: 'mond', zone: 'mond', w: 96, h: 120, fuss: [50, 115], kopf: [44, 4], rimBis: 113,
  hilfe: { innenKanten, kapselLicht, ring },
  varianten: {
    // a: drei Ringe, Buch vor der Brust, Zirkel wie ein Stock
    astronom_a: { R: 14, ringe: 3, pelerine: false, buch: true, lampe: false },
    // b: Pelerine über dem Gehrock, größere Sphäre mit vier Ringen, statt des Buchs eine Blendlaterne
    astronom_b: { R: 15.5, ringe: 4, pelerine: true, buch: false, lampe: true },
  },
  // Silhouetten-Proben (nicht gebaut): volle Kugel als Kopf (las sich als Ballon, die Ringe fehlten);
  // Fernrohr statt Kopf (zu nah am Vermesser aus der Stadt). Genommen: offene Ringe.
  proben: {
    probe_kugel: { R: 12, ringe: 0, voll: true, pelerine: false, buch: true },
    probe_fernrohr: { R: 12, ringe: 0, rohr: true, pelerine: false, buch: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, zh = 0, orbit = f * 0.25, auf = 0.32, bl = 1;
    // zh: Haltung des Zirkels 0 Stock, 1 ausgeholt über dem Kopf, 2 Stich nach vorn
    if (p.idle) { atem = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 4, -7, -3][f]; zh = [0.6, 1, 2, 1.4][f]; auf = [0.4, 0.5, 0.18, 0.26][f]; orbit = [0.1, 0.35, 0.62, 0.8][f]; bl = [1.2, 1.4, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; zh = 0.3; orbit = 0.5; bl = 0.6; }
    if (p.tod) { fall = r(p.q * 26); lean = r(p.q * 6); zh = 0; orbit = 0.15; bl = 0; }
    const T = atem + fall, L = lean;
    // Beine: dünn, Hose, Gamaschen; das hintere etwas zurückgesetzt
    const knick = p.tod ? p.q * 8 : 0;
    const beinV = glied([[45 + L * 0.3, 80 + T], [42 + L * 0.2 - knick, 96 + T * 0.6], [41, 110]], 3.2, 2.4, null);
    const beinH = glied([[54 + L * 0.3, 80 + T], [55, 96 + T * 0.6], [57, 110]], 3.2, 2.4, null);
    const gamV = C(41, 106, 41, 111, 2.6, 2.6, 'haut'), gamH = C(57, 106, 57, 111, 2.6, 2.6, 'haut');
    const stiefel = [E(39, 113, 5, 2.4, 'dunkel'), E(58, 113, 4.5, 2.4, 'dunkel')];
    // Gehrock: Schultern schmal, die Schöße hinten lang und geteilt, vorn offen (Weste)
    const sx = 47 + L, sy = 40 + T;
    const rock = Pg([[sx - 10, sy + 1], [sx + 8, sy - 1], [sx + 12, sy + 6], [sx + 14, sy + 30], [sx + 18, sy + 54], [sx + 11, sy + 54], [sx + 8, sy + 44], [sx - 2, sy + 42], [sx - 9, sy + 40], [sx - 13, sy + 22], [sx - 13, sy + 8]], null, { rd: 1.5 });
    const schoss = Pg([[sx + 9, sy + 34], [sx + 14, sy + 32], [sx + 19, sy + 55], [sx + 13, sy + 56]], null, { rd: 0.8 });
    const weste = Pg([[sx - 9, sy + 6], [sx - 3, sy + 4], [sx - 2, sy + 36], [sx - 8, sy + 38]], 'haut', { rd: 0.8 });
    const pelerine = v.pelerine ? Pg([[sx - 14, sy + 2], [sx + 10, sy - 2], [sx + 17, sy + 8], [sx + 18, sy + 24], ...A.saum(sx + 18, sx - 16, sy + 24, 6, 3, 4).map(([x, y]) => [x, y]), [sx - 16, sy + 22]], null, { rd: 1.2 }) : null;
    // Hals und Vatermörder-Kragen, darauf der Sockel der Sphäre
    const R = v.R, kx = 44 + L * 1.2, ky = 22 + T + (p.angriff && f === 2 ? 2 : 0);
    const hals = C(sx - 2, sy, kx + 1, ky + R - 1, 2.6, 1.6, 'haut');
    const kragen = Pg([[sx - 7, sy - 4], [sx + 4, sy - 5], [sx + 5, sy + 1], [sx - 7, sy + 2]], 'haut', { rd: 0.6 });
    // Sphäre: äußerer Ring, Äquator, Ekliptik (gekippt), dazu Achse mit Knauf; b mit viertem Ring
    const ringe = [];
    let ekl = null;
    if (v.voll) ringe.push(E(kx, ky, R, R, null));
    else if (v.rohr) ringe.push(C(kx + 6, ky, kx - 18, ky + 2, 4, 3, null), E(kx + 4, ky + 2, 6, 6, null));
    else {
      ringe.push(...ring(C, kx, ky, R, R, 0, 1.15, 34));
      ringe.push(...ring(C, kx, ky, R, R * 0.28, 0.08, 1, 26));
      ekl = ring(C, kx, ky, R * 0.98, R * 0.36, -0.55, 1, 26); ringe.push(...ekl);
      if (v.ringe > 3) ringe.push(...ring(C, kx, ky, R * 0.42, R, 0.15, 0.9, 24));
      ringe.push(C(kx + 2, ky - R - 4, kx - 2, ky + R + 2, 0.8, 0.8, null), E(kx + 2, ky - R - 4.5, 1.8, 1.8, null));
    }
    // Arme: vorn der Zirkel (im Leerlauf wie ein Stock aufgesetzt), hinten das Buch (a) oder die Laterne (b)
    const schV = [sx - 8, sy + 6], schH = [sx + 9, sy + 5];
    let handV, w, ell;
    if (zh < 0.5) { handV = [sx - 15, sy + 25]; w = 1.86; ell = [sx - 14, sy + 15]; }
    else if (zh < 1.5) { const k = zh - 0.5; handV = [sx - 12 + k * 8, sy + 4 - k * 10]; w = -1.0 + k * 0.4; ell = [sx - 16, sy + 6 - k * 4]; }
    else { const k = zh - 1.5; handV = [sx - 22 + k * 8, sy + 12 + k * 6]; w = 2.62 - k * 0.5; ell = [sx - 14, sy + 10]; }
    const armV = [...glied([schV, ell, handV], 2.9, 2.2, null), E(handV[0], handV[1], 2.2, 2, 'haut')];
    const zl = 44, sp = auf;
    const z1 = [handV[0] + Math.cos(w - sp / 2) * zl, handV[1] + Math.sin(w - sp / 2) * zl], z2 = [handV[0] + Math.cos(w + sp / 2) * zl, handV[1] + Math.sin(w + sp / 2) * zl];
    const zirkel = [C(handV[0], handV[1], z1[0], z1[1], 1.4, 0.5, null), C(handV[0], handV[1], z2[0], z2[1], 1.4, 0.5, null), E(handV[0], handV[1] - 1.5, 2.4, 2.4, null), C((handV[0] * 3 + z1[0]) / 4, (handV[1] * 3 + z1[1]) / 4, (handV[0] * 3 + z2[0]) / 4, (handV[1] * 3 + z2[1]) / 4, 0.6, 0.6, null)];
    const handH = [sx + 15, sy + 27];
    const armH = [...glied([schH, [sx + 15, sy + 16], handH], 2.8, 2.2, null), E(handH[0], handH[1], 2.2, 2, 'haut')];
    const buch = v.buch ? [Pg([[handH[0] - 3, handH[1] - 2], [handH[0] + 3, handH[1] - 3], [handH[0] + 4, handH[1] + 9], [handH[0] - 2, handH[1] + 10]], null, { rd: 0.4 })] : [];
    const lampe = v.lampe ? [C(handH[0], handH[1] + 2, handH[0], handH[1] + 5, 0.6, 0.6, null), Pg([[handH[0] - 4, handH[1] + 5], [handH[0] + 5, handH[1] + 5], [handH[0] + 5, handH[1] + 16], [handH[0] - 4, handH[1] + 16]], null, { rd: 0.6 }), E(handH[0] + 0.5, handH[1] + 4, 3.2, 1.4, null), E(handH[0] + 0.5, handH[1] + 17, 4, 1.2, null)] : [];
    const zirkelHinten = zh > 0.4 && zh < 1.5;
    const gruppen = [
      { p: zirkelHinten ? zirkel : [], k: 0 },                      // 0
      { p: armH, k: 1, anker: [L, T] },                              // 1
      { p: [...buch, ...lampe], k: 0, kante: true },                 // 2
      { p: [beinH, gamH, stiefel[1]].flat(), k: 1, kante: true },    // 3
      { p: [schoss], k: 0.5, anker: [L, T] },                        // 4
      { p: [beinV, gamV, stiefel[0]].flat(), k: 1, kante: true },    // 5
      { p: [rock], k: 1.5, anker: [L, T], kante: true },             // 6
      { p: [weste], k: 0, anker: [L, T], noRim: true },              // 7
      { p: pelerine ? [pelerine] : [], k: 1, anker: [L, T], kante: true }, // 8
      { p: [hals, kragen], k: 1, kante: true },                      // 9
      { p: ringe, k: 0, kante: true },                               // 10
      { p: armV, k: 1, anker: [L, T], kante: true },                 // 11
      { p: zirkelHinten ? [] : zirkel, k: 0, kante: true },          // 12
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('mond'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      kapselLicht(P, ringe.filter(k => k.t === 'c'), 'r1');
      kapselLicht(P, zirkel.filter(k => k.t === 'c'), 'r1');
      // Rock: Faltentäler (dunkel) mit Grat (hell) daneben, Knöpfe, Tasche, Naht der Schöße
      const rx = r(sx), ry = r(sy);
      for (const [x0, y0, x1, y1] of [[rx + 3, ry + 10, rx + 6, ry + 40], [rx + 9, ry + 14, rx + 13, ry + 46], [rx - 7, ry + 26, rx - 9, ry + 38]]) {
        P.line(x0, y0, x1, y1, 'k0', true); P.line(x0 - 1, y0 + 2, x1 - 1, y1, 'k3', true);
      }
      for (let i = 0; i < 4; i++) P.auf(rx - 4, ry + 9 + i * 6, i % 2 ? 'k3' : 'messing');
      P.line(rx + 2, ry + 30, rx + 7, ry + 30, 'k0', true); P.line(rx + 2, ry + 29, rx + 7, ry + 29, 'k3', true);
      // Revers: zwei Grate entlang der Weste
      P.line(rx - 3, ry + 3, rx - 1, ry + 20, 'r1', true); P.line(rx - 10, ry + 4, rx - 9, ry + 14, 'k3', true);
      if (pelerine) { for (let x = rx - 10; x < rx + 16; x += 6) { P.line(x, ry + 8, x + 1, ry + 22, 'k0', true); P.line(x + 1, ry + 8, x + 2, ry + 21, 'k3', true); } }
      // Buch: Seiten mit Zeilen, ein Strich in Messing (das Lesebändchen)
      if (v.buch && !p.tod) { const [hx, hy] = handH; for (let i = 0; i < 4; i++) P.line(hx - 1, hy + i * 2, hx + 2, hy - 1 + i * 2, i % 2 ? 'k1' : 'k3', true); P.auf(hx, hy + 9, 'messing'); P.auf(hx, hy + 10, 'messing'); }
      // Laterne (b): ein bleiches Fenster, Licht fällt auf Arm und Rock
      if (v.lampe && (!p.tod || f < 1)) { const [hx, hy] = handH; P.glow(hx + 0.5, hy + 10, 16, 0.9); for (let y = hy + 7; y <= hy + 14; y++) for (let x = hx - 2; x <= hx + 3; x++) P.set(x, y, (x === hx || x === hx + 1) && (y === hy + 10 || y === hy + 11) ? 'kern' : x === hx - 2 || y === hy + 7 ? 'glutDim' : (x + y) % 3 ? 'bleich' : 'glut'); augen.push([hx, hy + 10]); }
      // Zirkelspitzen und Gelenk: blankes Messing
      P.auf(handV[0], handV[1] - 3, 'messing'); P.auf(handV[0] + 1, handV[1] - 3, 'messing');
      // Kragenknopf, Gamaschenknöpfe
      P.auf(r(sx - 2), r(sy - 2), 'messing'); P.auf(42, 108, 'k1'); P.auf(58, 108, 'k1');
      // Der kleine Mond in der Sphäre: kreist auf der Ekliptik, ist das Auge
      if (ekl && (!p.tod || f < 1)) {
        const [mx, my] = ekl.pt(orbit); const MX = r(mx), MY = r(my);
        P.glow(MX + 0.5, MY + 0.5, 7 * Math.max(0.6, bl), 0.9);
        P.el(MX + 0.5, MY + 0.5, 3.3, 3.3, 'bleich');
        P.el(MX + 1, MY, 2, 2, 'glut'); P.set(MX + 1, MY - 1, 'kern'); P.set(MX - 1, MY + 1, 'k3');
        augen.push([MX, MY]);
        if (my > ky - 2) P.glow(r(sx - 2), r(sy + 2), 9, 0.55);
        // Licht des kleinen Mondes auf die Ringe gegenüber
        for (const k of ringe) { if (k.t !== 'c') continue; const d = Math.hypot(k.x1 - mx, k.y1 - my); if (d < 6) P.auf(k.x1, k.y1, 'r1'); }
      } else if (v.voll || v.rohr) { P.auge(r(kx - 6), r(ky), 2); augen.push([r(kx - 6), r(ky)]); }
      // Achse: Knauf in Messing
      if (ekl) { P.auf(r(kx + 2), r(ky - R - 5), 'messing'); }
    };
    return { gruppen, details, augen };
  },
};
