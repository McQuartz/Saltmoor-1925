// Zweiter Wächter Gezeitenwerk: Der Griff. Die Hand, für die die Maschine gebaut ist. Sie steigt aus einem
// Kanal, der Unterarm verschwindet im Wasser, und niemand weiß, wie lang er ist. Sieben Finger: fünf oben, dazu
// zwei Daumen, links und rechts, gleich lang. Um das Handgelenk eine Bronzemanschette mit sieben Zapfen. In den
// Kuppen sitzt leuchtendes Öl, und in den Linien der Handfläche auch: Wo sie hingreift, bleibt ein blanker
// Abdruck. Randlicht blanke Bronze, das einzige Warme in der grünen Maschine.
// Phase 2 (griff_p2): Die Hand schließt sich zur Faust.
'use strict';
const LIB = require('../lib');
const { h, innenKanten, randKraeftig } = require('./hilfe/w2a3');

module.exports = {
  id: 'griff', biom: 'gezeitenwerk', zone: 'gezeitenwerk_bronze', rang: 'waechter', w: 160, h: 180, fuss: [84, 174], kopf: [74, 8], rimBis: 168,
  varianten: { griff: { faust: false }, griff_p2: { faust: true } },
  // Silhouetten-Probe (verworfen): die Hand flach auf dem Boden, auf den Fingern laufend. Schwarz eine Spinne
  // (wie Netzflickerin und Zahnradwärter); aufrecht aus dem Wasser liest man sofort eine Hand.
  proben: { probe_liegend: { faust: false, liegend: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let a = 0, krumm = [0, 0.02, 0.04, 0.02][f % 4], sink = 0, glueh = [0.8, 0.9, 1, 0.9][f % 4], spritz = 0;
    if (p.angriff) { a = [-0.2, -0.32, 0.46, 0.16][f]; krumm = [-0.1, -0.18, 0.7, 0.35][f]; glueh = [1, 1.1, 1.3, 1][f]; spritz = f === 2 ? 1 : 0; }
    if (p.treffer) { a = [-0.12, -0.05][f]; krumm = 0.2; glueh = 0.6; }
    if (p.tod) { sink = r(p.q * 70); a = -p.q * 0.3; krumm = p.q * 0.8; glueh = Math.max(0, 1 - p.q * 1.6); }
    if (v.faust) krumm = Math.max(krumm, 0) + 1;
    // Drehpunkt: der Unterarm taucht aus dem Wasser (wx, wy), das Handgelenk (hx, hy) schwenkt um ihn
    const wx = 94, wy = 168, L0 = 64, S = 1.32;
    const ua = -Math.PI / 2 - 0.2 - a;
    const hx = wx + Math.cos(ua) * L0, hy = wy + Math.sin(ua) * L0 + sink;
    const rot = (u, w) => { const t = ua + Math.PI / 2; u *= S; w *= S; return [hx + u * Math.cos(t) - w * Math.sin(t), hy + u * Math.sin(t) + w * Math.cos(t)]; };
    // Becken: der Kanal, aus dem sie steigt (fest), Wasser darin
    const becken = [Pg([[14, 160], [146, 158], [150, 170], [140, 177], [20, 178], [10, 170]], null, { rd: 1.5 })];
    const wasser = [Pg([[20, 161], [140, 159], [142, 165], [18, 167]], null, { rd: 0.5, pf: 'flat' })];
    // Unterarm: vom Wasser zum Gelenk, verjüngt; Sehnen
    const arm = [C(wx + 1, wy + 6, hx, hy + 6, 16, 13, null)];
    const manschette = [Pg([rot(-14, 4), rot(14, 4), rot(15, 14), rot(-15, 14)], null, { rd: 1.2 })];
    const zapfen = []; for (let i = 0; i < 7; i++) { const [x, y] = rot(-12 + i * 4, 9); zapfen.push(E(x, y, 2, 2, null)); }
    // Handfläche: breit, oben gerade, zu uns gedreht
    const handP = [rot(-17, 3), rot(-20, -14), rot(-18, -30), rot(18, -30), rot(20, -14), rot(17, 3)];
    const hand = [Pg(handP, 'haut', { rd: 3 })];
    // Finger: fünf oben, zwei Daumen außen; jeder drei Glieder, krumm beugt sie zur Handfläche
    const fingerP = [], kuppen = [];
    const DEF = [[-15, -29, -0.26, 22], [-8, -31, -0.1, 27], [0, -32, 0, 30], [8, -31, 0.1, 27], [15, -29, 0.26, 22], [-20, -12, -1.05, 21], [20, -12, 1.05, 21]];
    if (v.faust) {
      // Faust von vorn: oben die Reihe der Knöchel, darunter die eingeschlagenen Finger, die Kuppen nach unten,
      // quer davor die zwei Daumen von links und rechts (sie greifen ineinander)
      for (let i = 0; i < 5; i++) { const u = -14 + i * 7, kn = rot(u, -30 + Math.abs(i - 2) * 1.2 - krumm * 0), mi = rot(u, -21), tip = rot(u + 0.5, -13);
        const g = [E(kn[0], kn[1], 4.2 * S, 4.6 * S, 'haut'), C(kn[0], kn[1], mi[0], mi[1], 3.8 * S, 3.6 * S, 'haut'), C(mi[0], mi[1], tip[0], tip[1], 3.4 * S, 3 * S, 'haut')];
        fingerP.push({ i, g, pts: [kn, kn, mi, tip], daumen: false, faust: true }); kuppen.push(tip); }
      for (const [i, sg] of [[5, -1], [6, 1]]) { const a0 = rot(sg * 20, -8), a1 = rot(sg * 10, -9), a2 = rot(sg * 1, -7);
        fingerP.push({ i, g: glied([a0, a1, a2], 4.4 * S, 3.2 * S, 'haut'), pts: [a0, a0, a1, a2], daumen: false, vorn: true }); kuppen.push(a2); }
    } else DEF.forEach(([u0, w0, wink, len], i) => {
      const daumen = i >= 5, seite = u0 < 0 ? -1 : 1;
      let [px, py] = rot(u0, w0); let ang = ua + wink + (daumen ? 0 : (h(i, 1) - 0.5) * 0.12); const pts = [[px, py]];
      for (let k = 0; k < 3; k++) {
        const l = S * len / 3 * (k === 0 ? 1.15 : k === 1 ? 1 : 0.85) * (v.faust ? 0.85 : 1);
        ang += (k === 0 ? 0.08 : 0.18) * seite * (daumen ? -1 : 0) + krumm * (daumen ? -seite * 0.6 : 1) * (k === 0 ? 0.7 : 1.1) * (u0 < 0 ? -1 : 1) * (daumen ? 1 : 1);
        // Krümmen: zur Handfläche hin heißt beim aufrechten Arm nach vorn (links) und unten
        const kk = daumen ? 0 : krumm * (k + 1) * 0.42;
        const aa = ang - kk * (1) ;
        px += Math.cos(aa) * l; py += Math.sin(aa) * l; pts.push([px, py]);
      }
      fingerP.push({ i, g: glied(pts, (daumen ? 4.6 : 4.2) * S, 2.2 * S, 'haut'), pts, daumen });
      kuppen.push(pts[3]);
    });
    const gruppen = [];
    const BECKEN = gruppen.push({ p: becken, k: 0, kante: true }) - 1;
    const WASSER = gruppen.push({ p: wasser, k: 0, noRim: true }) - 1;
    const ARM = gruppen.push({ p: arm, k: 0, kante: true }) - 1;
    const MAN = gruppen.push({ p: manschette, k: 0, kante: true }) - 1;
    const ZAP = gruppen.push({ p: zapfen, k: 0, kante: true }) - 1;
    // Finger hinter der Hand (beim Krümmen) zuerst, die Daumen
    const FING = [];
    fingerP.filter(x => x.daumen).forEach(x => FING.push(gruppen.push({ p: x.g, k: 1, kante: true, finger: x }) - 1));
    const HAND = gruppen.push({ p: hand, k: 0, kante: true }) - 1;
    fingerP.filter(x => !x.daumen && !x.vorn).forEach(x => FING.push(gruppen.push({ p: x.g, k: 1, kante: true, finger: x }) - 1));
    fingerP.filter(x => x.vorn).forEach(x => FING.push(gruppen.push({ p: x.g, k: 1, kante: true, finger: x }) - 1));
    gruppen.forEach((g, i) => { g.anker = i <= WASSER ? [0, 0] : [0, sink]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('gezeitenwerk_bronze'), { rimBis: 168 });
    const augen = [];
    const details = P => {
      const B = LIB.bay;
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
      const inv = (x, y) => { const t = ua + Math.PI / 2, dx = x - hx, dy = y - hy; return [(dx * Math.cos(-t) - dy * Math.sin(-t)) / S, (dx * Math.sin(-t) + dy * Math.cos(-t)) / S]; };
      // Handfläche: Grünspan, darin die Linien blank (Bronze) und voll Öl (Phosphor); Ballen heller
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, HAND)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue; const [u, w] = inv(x + 0.5, y + 0.5);
        let t = B(x, y) < 0.3 ? 3 : 2;
        if (Math.abs(u) > 13 && w > -20) t = B(x, y) < 0.5 ? 3 : 2;
        if (w < -26) t = 1;
        // Linien: Lebenslinie (Bogen), Kopflinie, Herzlinie
        const l1 = Math.abs(Math.hypot(u + 18, w + 2) - 15), l2 = Math.abs(w + 16 + u * 0.25), l3 = Math.abs(w + 22 - u * 0.1);
        if ((l1 < 0.8 && w < 0 && u > -14) || (l2 < 0.7 && u > -14 && u < 10) || (l3 < 0.7 && u > -6 && u < 16)) t = glueh > 0.3 && h(r(u), r(w)) < 0.45 * glueh ? 'glutDim' : 'bronze';
        if (v.faust && w < -18) t = 1;
        P.set(x, y, t);
      }
      // Finger: Glieder mit Falten, Nagel als heller Fleck, Kuppe mit Öl
      FING.forEach(gi => { const fp = gruppen[gi].finger;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
          let nah = 1e9, seg = 0; for (let s2 = 1; s2 < 3; s2++) { const d = Math.hypot(x - fp.pts[s2][0], y - fp.pts[s2][1]); if (d < nah) { nah = d; seg = s2; } }
          if (fp.faust || fp.vorn) { const l = gid[y * W + x - 1], o = gid[(y - 1) * W + x]; const naht = (l !== gi && FING.includes(l)) || (o !== gi && FING.includes(o) && fp.vorn);
            P.set(x, y, naht ? 1 : (o !== gi ? 4 : (B(x, y) < 0.3 ? 3 : 2))); }
          else P.set(x, y, nah < 1.6 ? 1 : (B(x, y) < 0.35 ? 3 : 2)); } });
      kuppen.forEach(([x, y], i) => { if (glueh > 0.25 && !(p.tod && f >= 2)) { P.set(x, y, i === 2 || i === 5 ? 'kern' : 'glut'); P.set(x + 1, y, 'glutDim'); if (i === 2 || i === 5) augen.push([r(x), r(y)]); } });
      if (glueh > 0.3) { const [cx, cy] = rot(-2, -16); P.glow(cx, cy, 14 * glueh, 0.45, 'glutDim', 'k3'); P.set(cx, cy, glueh > 0.9 ? 'kern' : 'glut'); augen.push([r(cx), r(cy)]); }
      // Unterarm: Sehnen, Grünspanflecken, nass am Wasser
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, ARM)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
        const [u] = inv(x + 0.5, y + 0.5); if (Math.abs(u - 5) < 0.6 || Math.abs(u + 4) < 0.6) P.set(x, y, 1); else if (h(x >> 1, y >> 1) < 0.05) P.set(x, y, 'gruenspan'); else if (u > 9) P.set(x, y, B(x, y) < 0.5 ? 3 : 2); }
      // Manschette und Zapfen: Bronze blank, Nieten
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (ist(x, y, MAN) && P.get(x, y) <= 4) { const [u, w] = inv(x + 0.5, y + 0.5); P.set(x, y, Math.abs(w - 9) < 0.6 ? 1 : w < 5 ? (u > 4 ? 'bronze' : 3) : (u > 8 ? 'bronze' : 2)); }
        if (ist(x, y, ZAP) && P.get(x, y) <= 4) P.set(x, y, 'bronze'); }
      // Becken und Wasser: Bronze mit Grünspan, das Wasser dunkel mit Phosphorpunkten, Ringe um den Arm
      for (let y = 150; y < H; y++) for (let x = 0; x < W; x++) {
        if (ist(x, y, BECKEN) && P.get(x, y) <= 4) P.set(x, y, y > 174 ? 1 : (x % 16 === 4 && y === 171) ? 'bronze' : (x % 13 === 7 && y < 168 + (x % 3)) ? 'gruenspan' : B(x, y) < 0.2 ? 3 : 2);
        if (ist(x, y, WASSER)) { const d = Math.abs(Math.hypot((x - wx) / 2.6, (y - 163) / 0.8) - 6 - (f % 2) * 2); P.set(x, y, d < 0.6 && !p.tod ? 'r1' : h(x, y, f) < 0.015 ? 'glut' : (B(x, y) < 0.25 ? 'wasser' : 1)); }
      }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      randKraeftig(P, W, H, { bis: 158 });
      // Spritzer beim Schlag: Tropfen links von der Hand
      if (spritz) for (let k = 0; k < 18; k++) { const x = r(14 + h(k, 1) * 36), y = r(40 + h(k, 2) * 50); if (!P.get(x, y)) P.set(x, y, h(k, 3) < 0.3 ? 'r2' : 'gruenspan'); }
    };
    return { gruppen, details, augen };
  },
};
