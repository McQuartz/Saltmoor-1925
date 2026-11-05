// Zweiter Wächter Station: Die Menge. Alle, die zur Eröffnung gekommen sind: Herren mit Zylinder und Melone,
// Damen mit Glockenhut, ein Schirm, der Pressefotograf mit der Blitzpfanne hoch über den Köpfen, vorn einer mit der
// großen Schere für das Band. Das Band ist nie durchgeschnitten worden. Sie stehen so dicht, dass sie ein Leib
// geworden sind, und alle sehen zum Tunnel, mit dem Rücken zu dir. Nur einer in der Mitte hat sich umgedreht.
'use strict';
const LIB = require('../lib');
const { h, innenKanten, randKraeftig } = require('./hilfe/w2a3');

// Köpfe der Menge: x, Höhe des Kinns, Größe, Hut (z Zylinder, m Melone, g Glockenhut, 0 ohne), Reihe (0 hinten)
const KOEPFE = [
  [58, 92, 0.78, 'z', 0], [82, 88, 0.8, 'g', 0], [104, 86, 0.78, 'm', 0], [128, 90, 0.8, 'z', 0], [146, 98, 0.74, 'g', 0],
  [46, 104, 0.92, 'm', 1], [70, 100, 0.95, 'z', 1], [94, 99, 0.96, 'u', 1], [118, 101, 0.94, 'g', 1], [140, 108, 0.9, 'm', 1],
  [30, 116, 1.05, 'g', 2], [58, 114, 1.08, 'm', 2], [86, 113, 1.1, 'z', 2], [112, 115, 1.06, 'g', 2],
];
module.exports = {
  id: 'menge', biom: 'station', zone: 'station', rang: 'waechter', w: 160, h: 180, fuss: [84, 176], kopf: [84, 8], rimBis: 172,
  varianten: { menge: {} },
  // Silhouetten-Probe (verworfen): die Menge ohne Schere, Blitz und Schirm, nur Köpfe und Hüte. Schwarz ein
  // Hügel mit Buckeln (wie Kachelleger und Salzmann im Großen); erst die hochgereckten Arme geben ihr Spitzen.
  proben: { probe_huegel: { ohneArme: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    let wog = [0, 1, 1, 0][f % 4], lean = 0, hebe = 0, stoss = 0, fall = 0, blitz = [0.85, 0.9, 1, 0.9][f % 4], dreh = 0;
    if (!p.idle) wog = 0;
    if (p.angriff) { lean = [3, 5, -8, -3][f]; hebe = [0.5, 1, 0, 0.2][f]; stoss = [0, 0, 1, 0.4][f]; blitz = [1, 1, 1.5, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; blitz = 0.6; }
    if (p.tod) { fall = r(p.q * 30); blitz = Math.max(0, 0.9 - p.q * 2); }
    const L = r(lean), T = fall;
    // Leib: alle Mäntel zusammen, ein Hügel bis zum Boden
    const saumPts = []; for (let i = 0; i <= 10; i++) saumPts.push([156 - i * 15 + L * (i / 10), 156 + T * 0.6 + (i % 2) * 4 + (i % 3)]);
    const leib = [Pg([...saumPts.slice(0, 1).map(([x]) => [158, 150 + T]), ...saumPts, [4 + L, 150 + T], [8 + L, 132 + T], [20 + L, 118 + T], [44 + L, 112 + T], [70 + L, 106 + T], [100 + L, 104 + T], [128 + L, 108 + T], [150 + L, 114 + T], [158, 130 + T]], null, { rd: 3 })];
    // Beine unter den Mänteln: Hosen, Strümpfe, Schuhe, dicht an dicht
    const beine = []; for (let i = 0; i < 12; i++) { const x = 10 + i * 12.6 + L * 0.5 + (h(i, 3) - 0.5) * 3, hint = i % 2, y0 = 152 + T * 0.6;
      beine.push(C(x, y0, x - 1, FY - 2 - hint, 2.4 - hint * 0.4, 2, hint ? 'dunkel' : null), Pg([[x - 6, FY - 3 - hint], [x + 1, FY - 3 - hint], [x + 1, FY - hint], [x - 7, FY - hint]], hint ? 'dunkel' : null, { rd: 0.6 })); }
    // Schultern als Wülste
    const schultern = KOEPFE.map(([x, y, s, , rh]) => E(x + L + 2, y + 13 * s + T + (rh === 2 ? 2 : 0), 12 * s, 6 * s, rh < 2 ? 'dunkel' : null));
    // Köpfe und Hüte; der in der Mitte vorn hat sich umgedreht (Gesicht zu dir)
    const koepfe = KOEPFE.map(([x, y, s, hut, rh], i) => {
      const X = x + L + (rh === 2 ? wog : rh === 1 ? -wog : 0), Y = y + T - (rh === 0 ? wog : 0);
      const um = i === 12;
      const kopf = E(X, Y, 6 * s, 7 * s, um ? 'haut' : null);
      const formen = [kopf];
      if (hut === 'z') formen.push(Pg([[X - 6 * s, Y - 4 * s], [X - 5 * s, Y - 17 * s], [X + 5 * s, Y - 17 * s], [X + 6 * s, Y - 4 * s]], 'dunkel', { rd: 0.6 }), C(X - 9 * s, Y - 4 * s, X + 9 * s, Y - 4 * s, 1.4 * s, 1.4 * s, 'dunkel'));
      if (hut === 'm') formen.push(E(X, Y - 6 * s, 6.5 * s, 5 * s, 'dunkel'), C(X - 9 * s, Y - 3 * s, X + 8 * s, Y - 3 * s, 1.3 * s, 1.3 * s, 'dunkel'));
      if (hut === 'g') formen.push(E(X + 0.5, Y - 4 * s, 7.5 * s, 6 * s, 'dunkel'), C(X - 7 * s, Y + 1 * s, X + 8 * s, Y + 1 * s, 1.6 * s, 1.6 * s, 'dunkel'));
      return { X, Y, s, hut, rh, um, formen };
    });
    // Arme: vorn links die Schere, hinten rechts die Blitzpfanne, in der Mitte der Schirm
    const arme = [], schere = [], blitzP = [], schirm = [];
    if (!v.ohneArme && !(p.tod && f >= 3)) {
      const sh = [32 + L, 122 + T], hd = [24 + L - stoss * 10 + hebe * 4, 60 + T - hebe * 12 + stoss * 30];
      arme.push(...glied([sh, [20 + L - stoss * 6, 94 + T + stoss * 12], hd], 4, 3, null), E(hd[0], hd[1], 3.6, 3.2, 'haut'));
      const auf = 0.35 + hebe * 0.3 - stoss * 0.3;
      for (const sgn of [-1, 1]) { const a = -Math.PI / 2 - 0.15 + sgn * auf - stoss * 1.2; const ex = hd[0] + Math.cos(a) * 22, ey = hd[1] + Math.sin(a) * 22;
        schere.push(C(hd[0], hd[1] - 1, ex, ey, 2.2, 0.8, null, { pf: 'flat' })); const ga = a + Math.PI; schere.push(E(hd[0] + Math.cos(ga + sgn * 0.6) * 6, hd[1] + Math.sin(ga + sgn * 0.6) * 6, 3, 3, null)); }
      const bs = [128 + L, 104 + T], bh = [134 + L + wog, 30 + T - hebe * 6];
      arme.push(...glied([bs, [140 + L, 70 + T], bh], 3.4, 2.6, 'dunkel'), E(bh[0], bh[1] + 1, 3, 3, 'haut'));
      blitzP.push(C(bh[0], bh[1] - 2, bh[0], bh[1] - 8, 1, 1, null), C(bh[0] - 9, bh[1] - 9, bh[0] + 8, bh[1] - 9, 1.6, 1.6, null));
      schirm.push(C(96 + L, 96 + T, 100 + L - wog, 40 + T, 1.2, 1.2, null), Pg([[98 + L, 92 + T], [94 + L, 72 + T], [101 + L - wog, 46 + T], [104 + L, 72 + T], [102 + L, 92 + T]], null, { rd: 0.8 }), C(96 + L, 96 + T, 93 + L, 100 + T, 1.2, 1, null));
    }
    // Das Band: quer vor der Menge, durchhängend, links von einer Hand gehalten, rechts an einem Ständer
    const band = [];
    if (!(p.tod && f >= 4)) { const pts = []; for (let i = 0; i <= 12; i++) { const q = i / 12, x = 6 + q * 150, y = 136 + T * 0.5 + Math.sin(q * Math.PI) * 6 + (p.angriff ? stoss * 4 * Math.sin(q * Math.PI) : 0); pts.push([x + L * (1 - q), y]); }
      for (let i = 0; i < 12; i++) band.push(C(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 1.8, 1.8, 'haut', { pf: 'flat' }));
      band.push(C(152, 134 + T * 0.5, 152, FY, 1.4, 1.4, null), E(152, FY - 1, 5, 1.6, null)); }
    const gruppen = [];
    const BEINE = gruppen.push({ p: beine, k: 0.5, kante: true }) - 1;
    const LEIB = gruppen.push({ p: leib, k: 0, kante: true }) - 1;
    const KG = [];
    [0, 1, 2].forEach(rh => {
      gruppen.push({ p: schultern.filter((_, i) => KOEPFE[i][4] === rh), k: 2, kante: true, reihe: rh });
      if (rh === 1) { if (schirm.length) gruppen.push({ p: schirm, k: 0.5, kante: true, schirm: true }); if (arme.length) gruppen.push({ p: arme.slice(3), k: 1, kante: true }); if (blitzP.length) gruppen.push({ p: blitzP, k: 0, kante: true, blitz: true }); }
      koepfe.filter(k => k.rh === rh).forEach(k => KG.push(gruppen.push({ p: k.formen, k: 0.6, kante: true, kopf: k }) - 1));
    });
    const BAND = gruppen.push({ p: band, k: 0.5, kante: true }) - 1;
    if (arme.length) { gruppen.push({ p: arme.slice(0, 3), k: 1, kante: true }); gruppen.push({ p: schere, k: 0, kante: true, schere: true }); }
    gruppen.forEach(g => { g.anker = [L, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('station'), { rimBis: 172 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - L, y - T);
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
      // Leib: Mäntel, Knopfreihen, Kragen; nach unten dunkler
      for (let y = 100; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, LEIB)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
        let t = !ist(x, y + 2, LEIB) ? 1 : (B(x, y) < 0.3 - (y - 120) / 200 ? 3 : 2); const m = (x - L) % 26; if (m === 0) t = 1; else if (m === 1 && B(x, y) < 0.5) t = 3; if (m === 13 && y % 9 === 0 && y < 150) t = 'messing'; P.set(x, y, t); }
      // Köpfe: von hinten das Haar, der Nacken bleich, die Ohren; der Umgedrehte zeigt sein Gesicht mit Augen
      KG.forEach(gi => { const k = gruppen[gi].kopf;
        for (let y = r(k.Y - 20 * k.s); y <= r(k.Y + 8 * k.s); y++) for (let x = r(k.X - 10 * k.s); x <= r(k.X + 10 * k.s); x++) {
          if (!ist(x, y, gi)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const dx = x + 0.5 - k.X, dy = y + 0.5 - k.Y;
          const imKopf = (dx / (6 * k.s)) ** 2 + (dy / (7 * k.s)) ** 2 < 1;
          if (!imKopf) { P.set(x, y, (k.hut === 'z' && Math.abs(dy + 6 * k.s) < 1) ? 'email' : c <= 2 ? c : (B(x, y) < 0.3 ? 3 : 2)); continue; }
          if (k.um) P.set(x, y, dy < -4 * k.s ? 2 : dx < -4 ? 3 : 'blass');
          else P.set(x, y, dy > 3 * k.s && Math.abs(dx) < 3 * k.s ? (k.rh < 2 ? 3 : 'blass') : (dx > 4.5 * k.s && Math.abs(dy) < 2) ? 3 : (x + y) % 5 ? 1 : 2);
        }
        if (k.um && !(p.tod && f >= 1)) { const ex = r(k.X - 3), ey = r(k.Y - 1); P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 5, ey, 'glut'); P.set(ex + 1, ey + 4, 2); P.set(ex + 2, ey + 4, 1); P.set(ex + 3, ey + 4, 2); augen.push([ex, ey], [ex + 4, ey]); P.glow(k.X, k.Y - 1, 9, 0.5, 'glutDim', 'k3'); }
      });
      // Schere: Stahl, Schneiden hell; Band: Seide, Falten; Schirm: Bespannung mit Rippen
      gruppen.forEach((g, gi) => {
        if (g.schere) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gi) && P.get(x, y) <= 4) P.set(x, y, (x + y) % 2 ? 'blass' : 3);
        if (g.schirm) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gi) && P.get(x, y) <= 4) P.set(x, y, (x - L) % 3 === 0 ? 1 : 2);
        if (g.blitz) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gi) && P.get(x, y) <= 4) P.set(x, y, 'messing');
      });
      for (let y = 120; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, BAND) && P.get(x, y) <= 4) P.set(x, y, x > 148 ? 2 : (x + (y >> 1)) % 7 === 0 ? 2 : (!ist(x, y - 1, BAND) ? 'email' : (B(x, y) < 0.4 ? 'email' : 3)));
      // Blitzpfanne: das Magnesium glimmt, beim Angriff zündet es
      if (!v.ohneArme && blitz > 0.2 && !(p.tod && f >= 3)) { const bx = r(134 + L + wog), by = r(30 + T - hebe * 6 - 11);
        // Pulver auf der Pfanne: ein flacher Haufen, glimmend; darüber ein Hauch Rauch in Randlicht
        for (const [dy, w] of [[0, 7], [-1, 5], [-2, 3]]) for (let k = -w; k <= w; k++) P.set(bx + k, by + 1 + dy, Math.abs(k) < 2 && dy > -2 ? (blitz > 0.95 ? 'kern' : 'glut') : (Math.abs(k) > w - 2 && dy === 0 ? 'glutDim' : 'glut'));
        P.glow(bx, by + 2, 8, 0.5, 'glutDim', 'k3');
        if (!p.tod) for (let k = 0; k < 4; k++) { const x = bx - 1 + ((k + f) % 3) - 1, y = by - 4 - k * 2; if (!P.get(x, y)) P.set(x, y, 'r1'); }
        if (blitz > 1.2) for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, rr = 9 + (k % 3) * 3, x = r(bx + Math.cos(a) * rr), y = r(by - 2 + Math.sin(a) * rr * 0.6); if (!P.get(x, y)) P.set(x, y, k % 2 ? 'r2' : 'glutDim'); }
        augen.push([bx, by]); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      randKraeftig(P, W, H, { bis: 172 });
    };
    return { gruppen, details, augen };
  },
};
