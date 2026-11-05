// Zweiter Wächter Salzstollen: Die Eingesalzene. Eine Salzsiederin aus der Zeit, bevor die Römer kamen. Sie hat
// sich in die Siedepfanne gesetzt, damit sie bleibt, und sie ist geblieben: Das Salz ist an ihr gewachsen, in
// Würfeln, alle gleich glatt, und es wächst weiter, als Treppe hinter ihr bis unter die Decke. Vorn sind noch
// Gesicht, Schulter und der Arm frei, die Hand offen, und aus der Hand rieselt Salz. Unter der Pfanne brennt das
// Siedefeuer bis heute. Phase 2 (eingesalzene_p2): Die Kruste springt; was darunter ist, ist noch warm.
'use strict';
const LIB = require('../lib');
const { h, innenKanten, randKraeftig, quad } = require('./hilfe/w2a3');

// Würfel des Salzturms: gesät in einem Treppenprofil (rechts hoch, nach links in Stufen herab). Jeder Würfel ist
// ein kleines Isometrie-Bild (Deckfläche, linke und rechte Seite), damit man Kristall liest und nicht Mauer.
function wuerfelListe(v) {
  const top = x => {
    if (v.saeule) return x > 56 && x < 96 ? 16 : 999;
    if (x < 72) return 999; if (x < 88) return v.offen ? 76 : 58; if (x < 104) return v.offen ? 58 : 40;
    if (x < 122) return v.offen ? 44 : 22; if (x < 142) return v.offen ? 36 : 10; if (x < 154) return v.offen ? 62 : 34; return 999; };
  const out = [];
  for (let row = 0; row < 11; row++) for (let col = 0; col < 7; col++) {
    const x = 70 + col * 13.5 + (row % 2) * 6 + (h(row, col, 3) - 0.5) * 7;
    const cy = 14 + row * 13 + (h(row, col, 5) - 0.5) * 6;
    const s = 11 + h(row, col, 7) * 9 + (row > 6 ? 3 : 0);
    if (cy - s * 0.2 < top(x) || cy > 146 || x > 150) continue;
    if (!v.saeule && x < 82 && cy > 90) continue;
    out.push({ x, y: cy, s, d: 0.25 + h(row, col, 9) * 0.5, t: (h(row, col, 11) - 0.5) * 0.35, id: row * 9 + col });
  }
  // Kapuze: ein großer, gekippter Würfel über dem Kopf, ein kleiner wächst auf der Schulter
  if (!v.offen && !v.saeule) out.push({ x: 63, y: 72, s: 19, d: 0.6, t: -0.2, id: 901, kapuze: true }, { x: 73, y: 92, s: 9, d: 0.4, t: 0.3, id: 903, kapuze: true });
  out.push({ x: 76, y: 100, s: 12, d: 0.4, t: 0.15, id: 904 });
  if (!v.offen) out.push({ x: 42, y: 118, s: 7, d: 0.5, t: 0.25, id: 905, arm: true });
  // Phase 2: abgesprungene Würfel liegen vorn in der Pfanne
  if (v.offen) out.push({ x: 104, y: 150, s: 11, d: 0.3, t: 0.5, id: 906, gefallen: true }, { x: 128, y: 152, s: 13, d: 0.6, t: -0.4, id: 907, gefallen: true }, { x: 88, y: 154, s: 7, d: 0.5, t: 0.9, id: 908, gefallen: true });
  return out;
}
// Isometrischer Würfel um (cx, cy): Ecken L, F, R unten, Ft, Rt, Bt, Lt oben; d teilt die Breite auf die Seiten, t kippt
function wuerfel(cx, cy, s, d, t) {
  const wl = s * 0.62 * (1 - d) + 2, wr = s * 0.62 * d + 2, hh = s * 0.8;
  const ca = Math.cos(t), sa = Math.sin(t);
  const R = ([x, y]) => [cx + x * ca - y * sa, cy + x * sa + y * ca];
  const F = [0, hh / 2], L = [-wl, hh / 2 - wl * 0.45], Rr = [wr, hh / 2 - wr * 0.45];
  const Ft = [0, -hh / 2], Lt = [-wl, -hh / 2 - wl * 0.45], Rt = [wr, -hh / 2 - wr * 0.45], Bt = [wr - wl, -hh / 2 - (wl + wr) * 0.45];
  const e = { F: R(F), L: R(L), R: R(Rr), Ft: R(Ft), Lt: R(Lt), Rt: R(Rt), Bt: R(Bt) };
  e.umriss = [e.L, e.F, e.R, e.Rt, e.Bt, e.Lt];
  return e;
}
const inPoly = (x, y, v) => { let c = false; for (let i = 0, j = v.length - 1; i < v.length; j = i++) if ((v[i][1] > y) !== (v[j][1] > y) && x < (v[j][0] - v[i][0]) * (y - v[i][1]) / (v[j][1] - v[i][1]) + v[i][0]) c = !c; return c; };

module.exports = {
  id: 'eingesalzene', biom: 'salz', zone: 'salz_sole', rang: 'waechter', w: 160, h: 180, fuss: [82, 176], kopf: [104, 6], rimBis: 168,
  todStart: 0.3,
  varianten: { eingesalzene: { offen: false }, eingesalzene_p2: { offen: true } },
  // Silhouetten-Probe (verworfen): sie steht als Salzsäule, Würfel nur senkrecht über ihr. Schwarz eine Säule mit
  // Buckeln, zu nah an Gewicht, Kreuzgangwächter und am bekannten Bild; die Treppe hinter ihr ist eigen.
  proben: { probe_saeule: { offen: false, saeule: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let atem = 0, hebe = 0, schlag = 0, lean = 0, fall = 0, riesel = f, feuer = [0.8, 1, 0.85, 0.95][f % 4], kipp = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; }
    if (p.angriff) { hebe = [0.5, 1, 0, 0.1][f]; schlag = [0, 0, 1, 0.5][f]; lean = [2, 4, -8, -3][f]; kipp = [2, 4, -4, -1][f]; feuer = [1, 1.1, 1.3, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 22); feuer = Math.max(0, 1 - p.q * 1.5); }
    const T = atem;
    // Pfanne auf Steinen, dahinter der Feuerraum
    const feuerraum = [Pg([[20, 163], [144, 161], [142, 175], [22, 176]], 'dunkel', { rd: 1, pf: 'flat' })];
    const steine = [[28, 171, 9, 5.5], [60, 172, 10, 5], [100, 172, 10, 5], [134, 170, 9, 5.5]].map(([x, y, rx, ry]) => E(x, y, rx, ry, null));
    const pfanne = [Pg([[10, 151], [152, 147], [148, 165], [16, 167]], null, { rd: 1.2 })];
    const lippe = [C(9, 150, 153, 146, 2, 2, null)];
    // Frau: kniet in der Pfanne, Oberkörper nach vorn, Kopf leicht gesenkt
    const lx = lean, ty = T + Math.max(0, fall - 6);
    const rumpf = [Pg([[52 + lx, 150], [86 + lx, 150], [84 + lx, 124 + ty], [80 + lx, 102 + ty], [58 + lx, 99 + ty], [50 + lx, 118 + ty]], null, { rd: 2.5 })];
    const kx = 61 + lx - kipp, ky = 84 + ty + (v.offen ? 2 : 0);
    const kopf = [E(kx, ky, 8, 9.6, 'haut', { pf: 'bevel' })];
    const hals = [Pg([[57 + lx, 99 + ty], [58 + lx - kipp, 90 + ty], [67 + lx - kipp, 90 + ty], [70 + lx, 100 + ty]], 'haut', { rd: 1 })];
    // Haar: nass, an den Kopf gelegt, hinten in einen Zopf, der im Salz verschwindet
    const haar = v.offen ? [Pg([[kx - 6, ky - 8], [kx + 4, ky - 11], [kx + 9, ky - 5], [kx + 10, ky + 6], [kx + 14, ky + 16], [kx + 9, ky + 18], [kx + 5, ky + 4], [kx + 1, ky - 6]], 'dunkel', { rd: 1.2 })] : [];
    // Arm: Schulter, Ellbogen, Handgelenk; ausholen hebt ihn hoch, der Schlag fährt nach vorn unten in die Pfanne
    const sh = [58 + lx, 104 + ty];
    let el, wr;
    if (hebe > 0) { el = [46 + lx, 104 - hebe * 22 + ty]; wr = [40 + lx, 96 - hebe * 34 + ty]; }
    else if (schlag > 0) { el = [36 + lx, 118 + ty]; wr = [16 + lx + schlag * 2, 128 + schlag * 10 + ty]; }
    else { el = [42 + lx, 122 + ty]; wr = [27 + lx, 124 + ty + (p.tod ? fall * 0.6 : 0)]; }
    if (v.saeule) { el = [52, 128]; wr = [50, 146]; }
    const arm = glied([sh, el, wr], 4.6, 3, 'haut');
    // Hand offen, Handfläche nach oben (beim Ausholen: nach vorn gekippt), Finger lang
    const hx = wr[0], hy = wr[1];
    const hand = hebe > 0
      ? [E(hx - 1, hy - 2, 4, 4.5, 'haut'), ...[0, 1, 2, 3].map(i => C(hx - 2 + i * 1.5, hy - 5, hx - 6 + i * 2.5, hy - 12 + i * 0.6, 1.3, 1, 'haut')), C(hx + 2, hy - 1, hx + 6, hy - 6, 1.3, 1, 'haut')]
      : [E(hx - 3, hy, 5, 3.2, 'haut'), ...[0, 1, 2, 3].map(i => C(hx - 6, hy - 1 + i * 1.4, hx - 12 + i * 0.5, hy - 4 + i * 2.2, 1.2, 1, 'haut')), C(hx - 2, hy - 2, hx - 5, hy - 7, 1.3, 1, 'haut')];
    // Salzturm: Kern und Würfel
    const wl = wuerfelListe(v).filter(c => !(c.gefallen && p.tod && f >= 3));
    const sinkt = c => (p.tod ? r(Math.max(0, p.q * 1.6 - (c.y / 180)) * 40 * (0.6 + h(c.id, 2) * 0.8)) : 0);
    const kernPts = v.saeule ? [[56, 150], [56, 20], [96, 14], [98, 150]]
      : v.offen ? [[76, 150], [80, 98], [92, 86], [106, 72], [120, 58], [132, 56], [140, 78], [140, 150]]
        : [[74, 150], [76, 70], [88, 56], [102, 40], [118, 24], [134, 18], [142, 40], [140, 150]];
    const turmKern = [Pg(kernPts.map(([x, y]) => [x + lx * 0.5, y + (p.tod ? r(Math.max(0, p.q * 1.6 - (y / 180)) * 40) : 0) + (p.angriff ? -kipp * (150 - y) / 150 : 0)]), 'dunkel', { rd: 2 })];
    const wg = wl.map(c => {
      const dy = sinkt(c) + (p.angriff ? r(-kipp * (150 - c.y) / 150) : 0) + (c.kapuze ? ty - (v.offen ? 0 : 0) : 0), dx = c.arm ? (el[0] - 42) : r(lx * 0.5);
      const cx = c.arm ? (sh[0] + el[0]) / 2 - 3 : c.x + dx + (c.kapuze ? -kipp : 0), cy = c.arm ? (sh[1] + el[1]) / 2 + 2 : c.y + dy;
      const e = wuerfel(cx, cy, c.s, c.d, c.t);
      return { c, cx, cy, e, p: [Pg(e.umriss, null, { rd: 0.4 })] };
    });
    wg.sort((a, b) => (a.cy + a.c.s * 0.3) - (b.cy + b.c.s * 0.3) || a.cx - b.cx);
    const hinten = wg.filter(w => !w.c.kapuze && !w.c.arm && !w.c.gefallen), vorn = wg.filter(w => w.c.kapuze || w.c.arm || w.c.gefallen);
    const gruppen = [
      { p: feuerraum, k: 0, noRim: true },
      { p: steine, k: 1, kante: true },
      { p: turmKern, k: 0, kante: true },
      ...hinten.map(w => ({ p: w.p, k: 0, kante: false, w })),
      { p: haar, k: 1, kante: true },
      { p: rumpf, k: 2, kante: true },
      { p: hals, k: 1, kante: true },
      { p: kopf, k: 0.5, kante: true },
      ...vorn.filter(w => w.c.kapuze).map(w => ({ p: w.p, k: 0, kante: true, w })),
      { p: pfanne, k: 0, kante: true },
      { p: lippe, k: 0, kante: true },
      ...vorn.filter(w => w.c.gefallen).map(w => ({ p: w.p, k: 0, kante: true, w })),
      { p: arm, k: 1.2, kante: true },
      { p: hand, k: 0.8, kante: true },
      ...vorn.filter(w => w.c.arm).map(w => ({ p: w.p, k: 0, kante: true, w })),
    ];
    gruppen.forEach(g => { g.anker = [0, 0]; });
    const idx = n => gruppen.findIndex(g => g.p === n);
    const FEUER = 0, STEINE = 1, KERN = 2, RUMPF = idx(rumpf), KOPF = idx(kopf), PFANNE = idx(pfanne), LIPPE = idx(lippe), ARM = idx(arm), HAND = idx(hand), HAAR = idx(haar);
    const { gid } = LIB.render(W, H, gruppen, LIB.palette(v.zone || 'salz_sole'), { rimBis: 168 });
    const augen = [];
    const details = P => {
      const B = LIB.bay;
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
      // Würfel: Deckfläche hell (Salz), rechte Seite zum Gegenlicht mittel mit Lichtkante, linke Seite dunkel;
      // die vordere senkrechte Kante als feine helle Linie
      gruppen.forEach((g, gi) => {
        if (!g.w) return; const { e, c } = g.w; const top = [e.Ft, e.Rt, e.Bt, e.Lt], re = [e.F, e.R, e.Rt, e.Ft];
        for (let y = r(g.w.cy - c.s * 1.2); y <= r(g.w.cy + c.s); y++) for (let x = r(g.w.cx - c.s); x <= r(g.w.cx + c.s); x++) {
          if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue; const X = x + 0.5, Y = y + 0.5;
          let t;
          if (inPoly(X, Y, top)) { const q = (e.Ft[1] - Y) / Math.max(1, e.Ft[1] - e.Bt[1]); t = q > 0.62 ? (B(x, y) < 0.7 ? 'r1' : 4) : q > 0.3 ? (B(x, y) < 0.35 ? 'r1' : 4) : (B(x, y) < 0.6 ? 4 : 3); }
          else if (inPoly(X, Y, re)) t = B(x, y) < 0.55 ? 3 : 2;
          else t = B(x, y) < 0.12 ? 2 : 1;
          if (v.offen && Math.abs((X - g.w.cx) * 0.7 + (Y - g.w.cy) - (h(c.id, 6) - 0.5) * 6) < 0.6) t = 1;
          P.set(x, y, t);
        }
        // Kanten: vordere Kante und Deckkante rechts hell, Fuß der linken Seite schwarz
        P.line(e.Ft[0], e.Ft[1] + 1, e.F[0], e.F[1] - 1, 'k3', true); P.line(e.Ft[0] + 1, e.Ft[1], e.Rt[0] - 1, e.Rt[1], 'r1', true);
        P.line(e.L[0] + 1, e.L[1], e.F[0], e.F[1], 1, true);
      });
      // Turmkern: Fugen sichtbar als tiefe Schatten
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, KERN) && P.get(x, y) <= 4) P.set(x, y, B(x, y) < 0.15 ? 2 : 1);
      // Phase 2: Fugen der Kruste glühen (darunter ist sie noch warm)
      if (v.offen && !(p.tod && f >= 2)) {
        for (let y = 20; y < 150; y++) for (let x = 60; x < 156; x++) {
          const g = gid[y * W + x]; if (g < 0 || !gruppen[g].w) continue;
          const o = gid[y * W + x + 1], u = gid[(y + 1) * W + x];
          if ((o >= 0 && o !== g && gruppen[o] && gruppen[o].w) || (u >= 0 && u !== g && gruppen[u] && gruppen[u].w)) P.set(x, y, h(x, y) < 0.18 ? 'glut' : 'glutDim');
        }
      }
      // Gesicht: hager, Augen offen hinter dem Salz, Mund ein Strich; Haar im Salz
      const fx = kx, fy = ky;
      for (let y = r(fy - 10); y <= r(fy + 10); y++) for (let x = r(fx - 9); x <= r(fx + 9); x++) {
        if (!ist(x, y, KOPF)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue; const dx = x + 0.5 - fx, dy = y + 0.5 - fy;
        if (dy < -5 + Math.max(0, dx) * 0.5 || dx > 4) P.set(x, y, (x + y) % 3 ? 1 : 2); else P.set(x, y, dx < -5 ? 2 : dy > 5 ? 2 : (B(x, y) < 0.6 ? 3 : 4));
      }
      P.auf(fx - 6, fy + 5, 1); P.auf(fx - 5, fy + 5, 1); P.auf(fx - 4, fy + 5, 1); P.auf(fx - 3, fy + 1, 2); P.auf(fx - 3, fy + 2, 2);
      if (!(p.tod && f >= 1)) {
        P.glow(fx - 4, fy - 1, 7, 0.9, 'glutDim', 'k3');
        P.set(fx - 6, fy - 1, 'kern'); P.set(fx - 5, fy - 1, 'glut'); P.set(fx - 1, fy - 1, 'glut'); if (v.offen) P.set(fx - 2, fy - 1, 'kern');
        augen.push([r(fx - 6), r(fy - 1)], [r(fx - 1), r(fy - 1)]);
      }
      // Rumpf: Kittel in Falten, Salzkörner in den Falten; Arm und Hand: Knöchel, Sehnen
      for (let y = 96; y < 152; y++) for (let x = 44; x < 92; x++) { if (!ist(x, y, RUMPF)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
        for (const o of [-8, 0, 9]) { const lx2 = 66 + lean + o * (0.4 + (y - 100) / 70); if (Math.abs(x - lx2) < 0.6) P.set(x, y, 1); else if (Math.abs(x - lx2 - 1) < 0.6 && B(x, y) < 0.4) P.set(x, y, 3); }
        if (h(x, y, 11) < 0.012) P.set(x, y, 'r1'); }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((ist(x, y, ARM) || ist(x, y, HAND)) && P.get(x, y) <= 4 && h(x, y, 13) < 0.02) P.set(x, y, 'r1');
      // Pfanne: Eisen genietet, Sole an der Oberfläche (kalter Glanz), Kruste am Rand
      for (let y = 140; y < 170; y++) for (let x = 0; x < W; x++) {
        if (ist(x, y, PFANNE)) { const k = P.get(x, y); if (k < 1 || k > 4) continue; const t = (y - 148) / 18;
          if (t < 0.18) P.set(x, y, h(x, 3) < 0.5 && B(x, y) < 0.6 ? 'sole' : 2); else P.set(x, y, (x % 14 === 3 && y % 4 === 1) ? 4 : (B(x, y) < 0.3 - t * 0.2 ? 3 : t > 0.8 ? 1 : 2)); }
        if (ist(x, y, LIPPE) && P.get(x, y) <= 4 && x % 12 === 5) P.set(x, y, 'r1');
      }
      // Siedefeuer zwischen den Steinen
      if (feuer > 0) for (let y = 160; y < 178; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, FEUER)) continue; const fl = (Math.sin(x * 0.7 + f * 1.9) * 0.5 + 0.5) * feuer, t = fl * (1 - Math.abs(y - 171) / 6) + (B(x, y) - 0.5) * 0.3; P.set(x, y, t > 0.82 ? 'glut' : t > 0.45 ? 'glutDim' : 1); }
      if (feuer > 0) for (const sx of [44, 80, 118]) { P.set(sx, 170, feuer > 0.9 ? 'kern' : 'glut'); augen.push([sx, 170]); }
      // Steine: Licht von unten am Rand zur Glut
      for (let y = 160; y < 179; y++) for (let x = 0; x < W; x++) if (ist(x, y, STEINE) && P.get(x, y) <= 4 && feuer > 0.3 && (ist(x - 1, y, FEUER) || ist(x + 1, y, FEUER))) P.set(x, y, 'glutDim');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      randKraeftig(P, W, H, { bis: 166 });
      // rieselndes Salz aus der Hand in die Pfanne (Leerlauf), beim Schlag eine Wolke
      if (!p.tod && !hebe) { const sx = r(hx - 9), sy = r(hy + 3); for (let k = 0; k < 7; k++) { const y = sy + k * 3 + (riesel % 3); if (y < 150 && !P.get(sx - (k > 4 ? 1 : 0), y)) P.set(sx - (k > 4 ? 1 : 0), y, k % 2 ? 'r1' : 'r2'); } }
      if (schlag >= 1) for (let k = 0; k < 26; k++) { const x = r(hx - 14 + h(k, 1) * 22), y = r(hy + 6 + h(k, 2) * 14); if (!P.get(x, y)) P.set(x, y, h(k, 3) < 0.4 ? 'r2' : 'r1'); }
    };
    return { gruppen, details, augen };
  },
};
