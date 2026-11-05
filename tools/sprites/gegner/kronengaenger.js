// Zweiter Wächter Wald: Der Kronengänger. Ein Baum aus dem Wald, der nach unten wächst, dessen Krone den Boden
// erreicht hat. Er hat sich oben von der Decke gerissen; die Wurzeln stehen zerfetzt in die Luft. Jetzt geht er auf
// der Krone: sieben Hauptäste als Beine, mit Knien, die ein Ast nicht hat, und Laubballen aus Stein an den Knien.
// In der Astgabel, wo die Beine ansetzen, sitzt ein Klumpen Harz, und in dem Harz sind zwei Augen eingeschlossen,
// die offen sind. Randlicht moosgrün: das kalte Licht aus der Tiefe, aus der er heraufkommt, das die Harzhöhle
// sonst nicht hat.
'use strict';
const LIB = require('../lib');
const { h, innenKanten, randKraeftig } = require('./hilfe/w2a3');

// Genommene Form: Laubkuppel unten (die Krone, auf der er geht), Stamm darauf, oben die abgerissenen Wurzeln.
// Die Hauptäste laufen sichtbar vom Stamm über die Kuppel nach unten (ohne sie las es sich als Wolke).
function kuppel(p, v, A) {
  const { E, C, Pg, glied, r } = A;
  const f = p.f, W = 160, H = 180, FY = 175;
  let sw = 0, hebe = 0, stoss = 0, lean = 0, fall = 0, glueh = [0.8, 0.9, 1, 0.9][f % 4], wipp = 0;
  if (p.idle) { sw = [0, 1, 1, 0][f]; }
  if (p.angriff) { hebe = [0.5, 1, 0, 0.2][f]; stoss = [0, 0, 1, 0.4][f]; lean = [3, 5, -7, -3][f]; wipp = [1, 2, -3, -1][f]; glueh = [1, 1.1, 1.3, 1][f]; }
  if (p.treffer) { lean = [3, 1][f]; glueh = 0.6; }
  if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 12); glueh = Math.max(0, 1 - p.q * 2); }
  const LX = r(lean * 0.3);
  // Kuppel aus Laubballen: Außenring und Füllung, unten gerade auf dem Boden
  const ballen = [];
  for (let i = 0; i < 13; i++) { const t = i / 12, a = Math.PI * (1.02 + t * 0.96); const x = 82 + Math.cos(a) * 70, y = 172 + Math.sin(a) * 56; ballen.push({ x: x + LX, y: Math.min(166, y) + fall * 0.2, rx: 11 + h(i, 2) * 5, ry: 8 + h(i, 3) * 3, i, lage: 0 }); }
  for (let i = 0; i < 8; i++) { const x = 28 + i * 15 + (h(i, 4) - 0.5) * 6, y = 150 + (h(i, 5) - 0.5) * 10 - (4 - Math.abs(i - 3.5)) * 3; ballen.push({ x: x + LX, y: y + fall * 0.2, rx: 12 + h(i, 6) * 4, ry: 8 + h(i, 7) * 3, i: 20 + i, lage: 1 }); }
  // Zweig-Zehen unter der Kuppel (er geht)
  const zehen = [];
  for (const [x, d] of [[34, -1], [118, 1]]) { const s0 = [x + LX, 160], e = [x + LX + d * 6, FY]; zehen.push(...glied([s0, [x + LX + d * 2, 168], e], 2.6, 1.1, null), C(e[0], e[1], e[0] + d * 5, e[1], 1, 0.7, null)); }
  // Stamm: steht auf der Kuppel, leicht schräg; oben die Abrissstelle mit Wurzeln
  const gx = 86 + lean * 0.5 + wipp, gy = 118 + fall * 0.6, sx = 96 + lean * 1.8 + wipp * 2 + sw, sy = 22 + fall;
  const stamm = [Pg([[gx - 16, gy + 6], [gx - 12, gy - 22], [sx - 11, sy + 12], [sx - 12, sy], [sx + 12, sy - 2], [sx + 11, sy + 14], [gx + 13, gy - 20], [gx + 19, gy + 6]], null, { rd: 2.5 })];
  const wurzeln = [];
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI / 2 + (i - 5) * 0.3 + (h(i, 1) - 0.5) * 0.25, l = 14 + h(i, 2) * 14, x0 = sx - 11 + i * 2.2, y0 = sy + 2;
    const k1 = [x0 + Math.cos(a) * l * 0.55, y0 + Math.sin(a) * l * 0.55], b = a + (h(i, 3) - 0.5) * 1.4, k2 = [k1[0] + Math.cos(b) * l * 0.5, Math.max(1, k1[1] + Math.sin(b) * l * 0.5)];
    wurzeln.push(...glied([[x0, y0], k1, k2], 2.6 - (i % 3) * 0.5, 0.6, null));
  }
  // Aststumpf rechts am Stamm, daran ein kleiner Laubballen, der nach unten hängt
  const stumpf = [...glied([[sx + 6, sy + 40], [sx + 20, sy + 36], [sx + 26, sy + 46]], 3.6, 1.6, null), E(sx + 27, sy + 50, 6.5, 4.5, null), E(sx + 23, sy + 53, 4, 3, null)];
  // Hauptäste über der Kuppel: von der Stammbasis nach außen unten, tauchen ins Laub
  const aeste = [];
  for (const [ex, ey, w] of [[26, 140, 5], [52, 150, 4.4], [118, 148, 4.4], [142, 136, 5], [86, 158, 4]]) {
    const dir = ex < gx ? -1 : 1, mx = gx + (ex + LX - gx) * 0.5, my = gy - 4 + Math.abs(ex - gx) * 0.05;
    aeste.push(...glied([[gx + dir * 6, gy + 2], [mx, my], [ex + LX, ey]], w, 2, null));
  }
  // Greifast vorn links: holt aus (hebe) und schlägt nach vorn (stoss)
  const g0 = [gx - 12, gy + 4], gk = [34 + LX - stoss * 14 + hebe * 4, 112 - hebe * 30 - stoss * 14], ge = [12 - stoss * 8 + hebe * 6, 118 - hebe * 52 - stoss * 6];
  const greif = [...glied([g0, gk, ge], 4.4, 1.4, null)]; for (let j = 0; j < 3; j++) greif.push(C(ge[0], ge[1], ge[0] - 5 + j * 3, ge[1] + 6 - j, 1, 0.6, null));
  greif.push(E(gk[0] - 2, gk[1] - 1, 7, 5, null), E(gk[0] + 3, gk[1] - 4, 4.5, 3.5, null));
  // Harzklumpen im Stamm: ein Astloch, darin Harz mit zwei Augen
  const hx = gx - 6 + (sx - gx) * 0.45, hy = gy - 34 - (gy - sy) * 0.2;
  const astloch = [E(hx, hy, 7, 8, 'dunkel', { pf: 'flat' })], harz = [E(hx - 0.5, hy + 0.5, 5.2, 6.2, 'haut', { pf: 'bevel' })];
  const gruppen = [], BAL = [];
  const WURZ = gruppen.push({ p: wurzeln, k: 1, kante: true }) - 1;
  ballen.filter(b => b.lage === 0).forEach(b => BAL.push(gruppen.push({ p: [E(b.x, b.y, b.rx, b.ry, 'dunkel'), E(b.x + 4, b.y - 4, b.rx * 0.6, b.ry * 0.7, 'dunkel')], k: 2, kante: true, laub: b }) - 1));
  const ZEHEN = gruppen.push({ p: zehen, k: 1, kante: true }) - 1;
  ballen.filter(b => b.lage === 1).forEach(b => BAL.push(gruppen.push({ p: [E(b.x, b.y, b.rx, b.ry, null), E(b.x - 5, b.y + 3, b.rx * 0.6, b.ry * 0.7, null)], k: 2, kante: true, laub: b }) - 1));
  const STUMPF = gruppen.push({ p: stumpf, k: 1, kante: true }) - 1;
  const STAMM = gruppen.push({ p: stamm, k: 2, kante: true }) - 1;
  const AESTE = gruppen.push({ p: aeste, k: 1.5, kante: true }) - 1;
  const LOCH = gruppen.push({ p: astloch, k: 0, noRim: true }) - 1;
  const HARZ = gruppen.push({ p: harz, k: 0, noRim: true }) - 1;
  const GREIF = gruppen.push({ p: greif, k: 1, kante: true }) - 1;
  gruppen.forEach(g => { g.anker = [0, 0]; });
  const { gid } = LIB.render(W, H, gruppen, LIB.palette('wald_tiefe'), { rimBis: 174 });
  const augen = [];
  const details = P => {
    const B = LIB.bay;
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
    // Stamm und Äste: versteinerte Rinde in Rissen, rechts Streiflicht, Harz in einzelnen Rissen
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (ist(x, y, STAMM)) { const k = P.get(x, y); if (k < 1 || k > 4) continue;
        const q = Math.max(0, Math.min(1, (y - sy) / (gy - sy))), u = x - (sx + (gx - sx) * q), riss = Math.abs(Math.sin(u * 0.8 + Math.sin(y * 0.13) * 1.3));
        let t = riss < 0.24 ? 1 : u > 6 ? (B(x, y) < 0.6 ? 4 : 3) : u > -3 ? (B(x, y) < 0.35 ? 3 : 2) : (B(x, y) < 0.15 ? 2 : 1);
        if (riss < 0.24 && h(r(u / 4), r(y / 9)) < 0.1 && glueh > 0.5) t = 'harz';
        P.set(x, y, t); }
      if ((ist(x, y, AESTE) || ist(x, y, GREIF) || ist(x, y, ZEHEN) || ist(x, y, STUMPF)) && P.get(x, y) <= 4 && P.get(x, y) >= 1) { if ((x * 3 + y) % 7 === 0) P.set(x, y, 1); else if (!ist(x, y - 1, gid[y * W + x])) P.set(x, y, 4); }
    }
    // Abrissstelle oben: Jahresringe, der äußere Ring hell
    for (let x = r(sx - 12); x <= r(sx + 11); x++) { const y = r(sy - 1 - (x - sx) * 0.08); if (P.get(x, y) && P.get(x, y) <= 4) P.set(x, y, Math.abs(x - sx) > 9 ? 'r2' : (x & 1) ? 3 : 1); }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, WURZ) && P.get(x, y) <= 4) P.set(x, y, (x + y) % 3 ? 2 : 1);
    // Laub aus Stein: große Blätter in versetzten Reihen, Spitze unten, Oberkante im Licht
    BAL.forEach(gi => { const hint = gruppen[gi].laub.lage === 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
        const row = Math.floor(y / 5), lx = (x + (row % 2) * 3) % 6, ly = y % 5;
        let t = ly === 0 ? 1 : ly === 1 ? (lx === 0 ? 1 : lx < 4 ? (hint ? 3 : 4) : 2) : ly === 2 ? (lx === 0 ? 1 : lx < 4 ? (hint ? 2 : 3) : 2) : ly === 3 ? (lx > 0 && lx < 4 ? 2 : 1) : (lx === 2 ? 2 : 1);
        if (!hint && !ist(x, y - 2, gi) && ly < 3 && lx < 5) t = B(x, y) < 0.5 ? 'r1' : 4;
        P.set(x, y, t); } });
    // Astloch und Harz mit Augen
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (ist(x, y, LOCH)) P.set(x, y, 1);
      if (ist(x, y, HARZ)) { const d = Math.hypot((x + 0.5 - hx) / 5.2, (y + 0.5 - hy) / 6.2); const t = glueh * (1.15 - d) + (B(x, y) - 0.5) * 0.3; P.set(x, y, t > 0.75 ? 'harzhell' : t > 0.38 ? 'harz' : t > 0.12 ? 'glutDim' : 1); } }
    if (glueh > 0.3 && !(p.tod && f >= 1)) { const ex = r(hx - 3), ey = r(hy - 1); P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 4, ey, 'kern'); P.set(ex + 5, ey, 'glut'); P.set(ex, ey + 1, 1); P.set(ex + 4, ey + 1, 1); augen.push([ex, ey], [ex + 4, ey]); }
    if (glueh > 0.3) P.glow(hx, hy, 15 * glueh, 0.45, 'glutDim', 'k3');
    if (!p.tod) for (let k = 0; k < 5; k++) { const y = r(hy + 8 + k * 2 + (f % 2)); const x = r(hx + 1); if (P.get(x, y) && P.get(x, y) <= 4) P.set(x, y, k < 2 ? 'harz' : 'glutDim'); }
    innenKanten(P, gid, gruppen, W, H, 'r1');
    randKraeftig(P, W, H, { bis: 172 });
  };
  return { gruppen, details, augen };
}

module.exports = {
  id: 'kronengaenger', biom: 'wald', zone: 'wald_tiefe', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [86, 4], rimBis: 174,
  varianten: { kronengaenger: {} },
  // Silhouetten-Probe (verworfen): der Stamm auf sieben Ästen mit Knien. Schwarz eine Spinne mit Turm (Weberknecht),
  // man sieht keinen Baum mehr. Genommen: die Krone als Laubkuppel unten, der Stamm steht darauf, oben die Wurzeln.
  proben: { probe_spinne: { spinne: true, beine: 7 } },
  bild(p, v, A) {
    if (!v.spinne) return kuppel(p, v, A);
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180, FY = 175;
    let sw = [0, 1, 0, -1][f % 4], hebe = 0, stoss = 0, lean = 0, fall = 0, glueh = [0.8, 0.9, 1, 0.9][f % 4];
    if (!p.idle) sw = 0;
    if (p.angriff) { hebe = [0.5, 1, 0, 0][f]; stoss = [0, 0, 1, 0.4][f]; lean = [2, 4, -7, -3][f]; glueh = [1, 1.1, 1.3, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glueh = 0.6; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 10); glueh = Math.max(0, 1 - p.q * 2); }
    // Gabel: wo der Stamm in die Äste übergeht
    const gx = 84 + lean + sw * 0.5, gy = 96 + fall * 0.7 - hebe * 4;
    // Stamm: von der Gabel nach oben, leicht gebogen, oben die zerrissenen Wurzeln
    const sx = 92 + lean * 0.4 + sw, sy = 18 + fall;
    const stamm = [Pg([[gx - 13, gy + 2], [gx - 11, gy - 30], [sx - 11, sy + 14], [sx - 13, sy], [sx + 12, sy - 2], [sx + 10, sy + 16], [gx + 13, gy - 26], [gx + 15, gy + 4]], null, { rd: 2.5 })];
    const wurzeln = [];
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.36 + (h(i, 1) - 0.5) * 0.3, l = 12 + h(i, 2) * 12, x0 = sx - 10 + i * 2.6, y0 = sy + 2;
      const k1 = [x0 + Math.cos(a) * l * 0.5, y0 + Math.sin(a) * l * 0.5], k2 = [x0 + Math.cos(a + (h(i, 3) - 0.5) * 1.2) * l, Math.max(2, y0 + Math.sin(a + (h(i, 3) - 0.5) * 1.2) * l)];
      wurzeln.push(...glied([[x0, y0], k1, k2], 2.4 - (i % 3) * 0.4, 0.6, null));
    }
    // Beine: sieben Hauptäste, Knie hoch, Fuß auf dem Boden; vorne (links) zwei heben sich beim Angriff
    const beine = [], knie = [], laub = [];
    const ziele = [8, 26, 46, 112, 132, 150, 70];
    for (let i = 0; i < v.beine; i++) {
      const hinten = i === 6;
      const fx = ziele[i] + (i < 2 ? -stoss * 8 + hebe * 6 : 0) + lean * 0.3, vorn = i < 2;
      const fyy = FY - (vorn ? hebe * 46 + (stoss ? 0 : 0) : 0) - (hinten ? 4 : 0);
      const ansx = gx + (i - 3) * 3.2, ansy = gy + 2;
      const dir = fx < gx ? -1 : 1, ab = Math.abs(fx - gx);
      const kx = gx + (fx - gx) * 0.62, ky = v.rock ? (ansy + fyy) / 2 : ansy - 4 - ab * 0.12 - (vorn ? hebe * 22 : 0) + fall * 0.4 * (i % 2);
      const mx = (ansx + kx) / 2, my = Math.min(ansy, ky) - 8 - ab * 0.06;
      const pts = v.rock ? [[ansx, ansy], [fx, fyy]] : [[ansx, ansy], [mx, my], [kx, ky], [fx - dir * 4, (ky + fyy) / 2 + 6], [fx, fyy]];
      const g = glied(pts, hinten ? 4 : 5.6, 1.4, hinten ? 'dunkel' : null);
      // Zweige vom Knie: zwei kurze, nach oben und außen, mit Gabel
      const zw = [];
      if (!v.rock) for (let k = 0; k < 2; k++) { const a = -Math.PI / 2 + dir * (0.5 + k * 0.6), l = 9 + h(i, k) * 6, z0 = [kx - dir * k * 4, ky - 1 + k * 3], z1 = [z0[0] + Math.cos(a) * l, z0[1] + Math.sin(a) * l];
        zw.push(...glied([z0, z1], 1.6, 0.8, hinten ? 'dunkel' : null), C(z1[0], z1[1], z1[0] + dir * 4, z1[1] - 2, 0.8, 0.5, null)); }
      beine.push({ i, hinten, g: [...g, ...zw], kx, ky, fx, fyy });
      if (!v.rock) laub.push({ i, hinten, x: kx + dir * 3, y: ky + 3, rx: 9 + h(i, 5) * 4, ry: 5.5 + h(i, 6) * 2 });
    }
    // Harzklumpen in der Gabel (das innere Licht), davor die Rinde der Gabel
    const harz = [E(gx - 1, gy - 8, 7.5, 6.5, 'haut', { pf: 'bevel' })];
    const gabel = [Pg([[gx - 16, gy + 4], [gx - 12, gy - 6], [gx - 8, gy - 1], [gx + 8, gy - 2], [gx + 12, gy - 8], [gx + 17, gy + 5], [gx, gy + 10]], null, { rd: 2 })];
    const gruppen = [];
    beine.filter(b => b.hinten).forEach(b => gruppen.push({ p: b.g, k: 1.2, kante: true, bein: b }));
    laub.filter(l => l.hinten).forEach(l => gruppen.push({ p: [E(l.x, l.y, l.rx, l.ry, 'dunkel'), E(l.x + 3, l.y - 3, l.rx * 0.6, l.ry * 0.7, 'dunkel')], k: 1.5, kante: true, laub: l }));
    const WURZ = gruppen.push({ p: wurzeln, k: 1, kante: true }) - 1;
    const STAMM = gruppen.push({ p: stamm, k: 2, kante: true }) - 1;
    const HARZ = gruppen.push({ p: harz, k: 0, noRim: true }) - 1;
    const GABEL = gruppen.push({ p: gabel, k: 1.5, kante: true }) - 1;
    beine.filter(b => !b.hinten).sort((a, b) => Math.abs(a.fx - gx) - Math.abs(b.fx - gx)).forEach(b => gruppen.push({ p: b.g, k: 1.2, kante: true, bein: b }));
    laub.filter(l => !l.hinten).forEach(l => { const d = l.x < gx ? -1 : 1; gruppen.push({ p: [E(l.x, l.y, l.rx, l.ry, null), E(l.x + d * 6, l.y - 3, l.rx * 0.6, l.ry * 0.8, null), E(l.x - d * 5, l.y + 3, l.rx * 0.6, l.ry * 0.7, null), E(l.x + d * 2, l.y + 5, l.rx * 0.5, l.ry * 0.6, null)], k: 2, kante: true, laub: l }); });
    gruppen.forEach(g => { g.anker = [0, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('wald_tiefe'), { rimBis: 174 });
    const augen = [];
    const details = P => {
      const B = LIB.bay;
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
      // Stamm: versteinerte Rinde in senkrechten Rissen, rechts Licht in Streifen, Harz in einzelnen Rissen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, STAMM) && !ist(x, y, GABEL)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
        const u = x - (sx + (gx - sx) * Math.max(0, Math.min(1, (y - sy) / (gy - sy)))), riss = Math.abs(Math.sin(u * 0.75 + Math.sin(y * 0.11) * 1.4));
        let t = riss < 0.22 ? 1 : u > 5 ? (B(x, y) < 0.55 ? 4 : 3) : u > -2 ? (B(x, y) < 0.4 ? 3 : 2) : 2;
        if (riss < 0.22 && h(r(u / 4), r(y / 9)) < 0.12 && glueh > 0.5) t = 'harz';
        P.set(x, y, t);
      }
      // Jahresringe an der Abrissstelle oben (rückwärts gezählt: der äußere Ring ist hell und frisch)
      for (let x = r(sx - 12); x <= r(sx + 11); x++) { const y = r(sy - 1 + (x - sx) * -0.08); if (P.get(x, y) && P.get(x, y) <= 4) P.set(x, y, Math.abs(x - sx) > 9 ? 'r2' : (x & 1) ? 3 : 1); }
      // Wurzeln: dünn, nur innere Randlichtstufe
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, WURZ) && P.get(x, y) <= 4) P.set(x, y, (x + y) % 3 ? 2 : 1);
      // Beine: Rinde mit Ringen an den Gelenken, Krallen aus Zweigen am Fuß
      gruppen.forEach((g, gi) => {
        if (g.bein) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue; if (Math.hypot(x - g.bein.kx, y - g.bein.ky) < 3.2 && (x + y) % 2) P.set(x, y, 1); else if ((x * 3 + y) % 9 === 0) P.set(x, y, 1); }
          if (!p.tod) { const b = g.bein, dir = b.fx < gx ? -1 : 1; for (let k = 0; k < 3; k++) { const x0 = r(b.fx), y0 = r(b.fyy); P.line(x0, y0, x0 + dir * (3 + k * 2), y0 + 1 - (k === 1 ? 2 : 0), k === 1 ? 'r1' : 2); } } }
        // Laub aus Stein: Blätter als kleine Schuppen, oben Licht
        if (g.laub) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
          // Blätter aus Stein: kleine Mandeln in versetzten Reihen, Spitze nach unten, oben hell (Licht von oben)
          const row = Math.floor(y / 3), lx = (x + (row % 2) * 2) % 4, ly = y % 3;
          let t = ly === 0 ? (lx === 1 || lx === 2 ? 3 : 1) : ly === 1 ? (lx === 0 ? 1 : 2) : (lx === 3 ? 1 : (B(x, y) < 0.3 ? 2 : 1));
          if (!ist(x, y - 2, gi) && ly !== 2) t = 4;
          P.set(x, y, t); }
      });
      // Harz: glüht, darin zwei Augen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, HARZ)) continue; const d = Math.hypot((x + 0.5 - gx + 1) / 7.5, (y + 0.5 - gy + 8) / 6.5); const t = glueh * (1.1 - d) + (B(x, y) - 0.5) * 0.3; P.set(x, y, t > 0.7 ? 'harzhell' : t > 0.35 ? 'harz' : t > 0.1 ? 'glutDim' : 1); }
      if (glueh > 0.3 && !(p.tod && f >= 1)) { const ex = r(gx - 4), ey = r(gy - 9); P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 5, ey - 1, 'glut'); P.set(ex + 4, ey - 1, 'kern'); P.set(ex, ey + 1, 1); P.set(ex + 4, ey, 1); augen.push([ex, ey], [ex + 4, ey - 1]); }
      if (glueh > 0.3) P.glow(gx - 1, gy - 6, 18 * glueh, 0.45, 'glutDim', 'k3');
      // ein Faden Harz tropft aus der Gabel
      if (!p.tod) for (let k = 0; k < 6; k++) { const y = r(gy + 9 + k * 2 + (f % 2)); if (!P.get(r(gx + 2), y)) P.set(gx + 2, y, k < 3 ? 'harz' : 'glutDim'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      randKraeftig(P, W, H, { bis: 172 });
    };
    return { gruppen, details, augen };
  },
};
