// Gezeitenwerk: Der Zahnrad-Wärter. Ein Zahnrad, so groß wie ein Mühlstein, steht hochkant auf zwei
// Vogelbeinen. Statt eines Kopfes die Nabe, darin zwei Lichter übereinander. Aus der Nabe hängt ein Arm
// mit sieben Fingern. Wer ihn schlägt, schlägt in die Zähne (Dornen).
'use strict';
const LIB = require('../lib');
const TAU = Math.PI * 2;
// Zahnkranz als Polygon (Ellipse rx/ry, gedreht um rot, n Zähne der Höhe th)
function kranz(cx, cy, rx, ry, n, th, rot, schritte = 180) {
  const pts = [];
  for (let i = 0; i < schritte; i++) {
    const a = i / schritte * TAU, f = ((a + rot) / TAU * n) % 1, ff = f < 0 ? f + 1 : f;
    const z = ff < 0.12 ? ff / 0.12 : ff < 0.42 ? 1 : ff < 0.54 ? 1 - (ff - 0.42) / 0.12 : 0;
    pts.push([cx + Math.cos(a) * (rx + th * z), cy + Math.sin(a) * (ry + th * z * ry / rx)]);
  }
  return pts;
}
// Innenkanten: Teile, die vor anderen liegen, fangen an ihrer Lichtkante (oben rechts) eine Linie Randlicht.
// Die Lücken zwischen den Speichen bekommen an ihrer Unterkante links Randlicht wie eine Außenkante.
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi && !(gruppen[v] && gruppen[v].p === gruppen[gi].p);
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
function lochRand(P, istLoch, x0, y0, x1, y1) {
  const z = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!P.get(x, y) || istLoch(x, y)) continue;
    if (istLoch(x + 1, y - 1) || istLoch(x + 1, y) && istLoch(x, y - 1)) z.push([x, y, 'r1']);
    else if (istLoch(x + 2, y - 1)) z.push([x, y, 'k3']);
    else if (istLoch(x - 1, y + 1) || istLoch(x - 1, y)) z.push([x, y, 'k0']);
  }
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (istLoch(x, y)) P.loesch(x, y);
  for (const [x, y, c] of z) P.set(x, y, c);
}

module.exports = {
  id: 'zahnradwaerter', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 96, h: 120, fuss: [52, 116], kopf: [54, 14], rimBis: 113,
  varianten: {
    zahnradwaerter_a: { n: 13, rx: 22, ry: 27, speichen: 7, arme: 1 },
    zahnradwaerter_b: { n: 11, rx: 20, ry: 25, speichen: 5, arme: 2, kleinesRad: true, kopf: [56, 10] },
  },
  // Silhouetten-Proben (nicht gebaut): ein Rad auf dem Rücken einer gebückten Gestalt las sich wie die
  // Netzflickerin mit Schild; ein Rad ohne Beine, rollend, war nur ein Kreis und hatte keinen Körper.
  proben: {
    probe_ruecken: { n: 13, rx: 22, ry: 27, speichen: 7, arme: 1, ruecken: true },
    probe_rollend: { n: 13, rx: 24, ry: 30, speichen: 7, arme: 0, ohneBeine: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, rot = 0, armA = 0, atem = 0, fall = 0, kn = 0, fing = 0, sinkY = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; rot = [0, 0, 0.035, 0.035][f]; fing = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [4, 2, -9, -3][f]; rot = [-0.1, 0.25, 0.7, 0.85][f]; armA = [-0.9, -0.3, 1.0, 0.35][f]; kn = [3, 1, -1, 0][f]; fing = [2, 0, -1, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; rot = [-0.06, -0.03][f]; armA = -0.25; kn = 1; }
    if (p.tod) { fall = r(p.q * 34); lean = r(p.q * 6); rot = p.q * 0.6; armA = p.q * 0.6; sinkY = 0; }
    const ru = v.ruecken, ohneB = v.ohneBeine;
    const cx = 52 + lean, cy = (ohneB ? 82 : 50) + atem + kn + fall * (ohneB ? 0 : 1), rx = v.rx, ry = v.ry;
    // Dicke des Rades: eine zweite Scheibe nach hinten rechts versetzt
    const hinten = Pg(kranz(cx + 4, cy - 2, rx, ry, v.n, 5, rot + 0.11), null, { rd: 0.4 });
    const vorn = Pg(kranz(cx, cy, rx, ry, v.n, 5, rot), null, { rd: 0.4 });
    const nabe = E(cx - 1, cy, 7.5, 8.5, 'haut', { pf: 'bevel' });
    const nabenring = E(cx - 1, cy, 10.5, 12, null, { pf: 'bevel' });
    // Beine: Vogelbeine, das Knie nach hinten (rechts), dünn und lang
    const fy = 115, hipY = cy + ry - 6;
    const beinL = ohneB ? [] : glied([[cx - 8, hipY], [cx - 2 + r(kn / 2), hipY + 16 - kn - fall * 0.3], [cx - 14 + r(lean / 3), fy]], 4.6, 1.6, null);
    const beinR = ohneB ? [] : glied([[cx + 9, hipY - 2], [cx + 20 + r(kn / 2), hipY + 14 - kn - fall * 0.3], [cx + 10 + r(lean / 3), fy]], 4, 1.5, null);
    const fussL = ohneB ? [] : [C(cx - 22 + r(lean / 3), fy, cx - 10 + r(lean / 3), fy, 1.2, 1.4, null)];
    const fussR = ohneB ? [] : [C(cx + 4 + r(lean / 3), fy, cx + 15 + r(lean / 3), fy, 1.1, 1.3, null)];
    // Arm aus der Nabe nach vorn unten, Ellbogen knickt; Hand mit sieben Fingern
    const ax0 = cx - 6, ay0 = cy + 4;
    const ell = [ax0 - 16 + r(armA * 4), ay0 + 14 - r(armA * 16)], hand = [ax0 - 30 - r(armA * 10), ay0 + 34 - r(armA * 26)];
    const arm = v.arme ? glied([[ax0, ay0], ell, hand], 3.6, 1.8, null) : [];
    const finger = [];
    if (v.arme) for (let i = 0; i < 7; i++) {
      const a = Math.PI * 0.5 + (i - 3) * 0.22 + armA * 0.5 + fing * 0.05 * (i - 3);
      const len = 9 + (i === 3 ? 3 : 0) + (i % 2) * 2;
      const k = [hand[0] + Math.cos(a) * len * 0.55, hand[1] + Math.sin(a) * len * 0.55];
      finger.push(...glied([[hand[0], hand[1]], k, [k[0] + Math.cos(a + 0.35) * len * 0.5, k[1] + Math.sin(a + 0.35) * len * 0.5]], 0.75, 0.45, null));
    }
    // zweiter Arm (Variante b): hält einen Schlüssel aus Bronze mit sieben Bärten
    const arm2 = [], schluessel = [];
    if (v.arme > 1) {
      const s0 = [cx + 6, cy + 8], s1 = [cx + 2 - r(armA * 6), cy + 26 - r(armA * 6)], s2 = [cx - 8 - r(armA * 10), cy + 34 - r(armA * 12)];
      arm2.push(...glied([s0, s1, s2], 2.2, 1.3, null));
      schluessel.push(C(s2[0] + 2, s2[1] - 8, s2[0] - 2, s2[1] + 16, 1.1, 1.1, null), E(s2[0] + 2.5, s2[1] - 10, 3, 3, null));
      for (let i = 0; i < 4; i++) schluessel.push(C(s2[0] - 2 + i * 0.1, s2[1] + 10 + i * 2, s2[0] - 5 - (i % 2) * 2, s2[1] + 10 + i * 2, 0.6, 0.6, null));
    }
    // kleines Rad (Variante b): greift oben rechts in den Kranz
    const klein = v.kleinesRad ? [Pg(kranz(cx + rx + 3, cy - ry + 4, 8, 9, 7, 3, -rot * 1.8 + 0.2, 90), null, { rd: 0.3 })] : [];
    // Probe: Rad auf dem Rücken einer gebückten Gestalt
    const ruck = ru ? [Pg([[cx - 30, cy + 8], [cx - 14, cy - 6], [cx + 6, cy + 30], [cx + 2, 112], [cx - 22, 112]], null, { rd: 3 }), E(cx - 30, cy + 10, 7, 6, 'haut')] : [];
    const gruppen = [
      { p: klein, k: 0, kante: true },
      { p: beinR, k: 1 }, { p: fussR, k: 1 },
      { p: arm2.length ? [] : [], k: 0 },
      { p: [hinten], k: 0, tone: -0.15 },
      { p: ruck, k: 2 },
      { p: [vorn], k: 0, kante: true },
      { p: [nabenring], k: 0, kante: true },
      { p: [nabe], k: 0, kante: true },
      { p: beinL, k: 1, kante: true }, { p: fussL, k: 1 },
      { p: arm2, k: 0, kante: true }, { p: schluessel, k: 0.5, kante: true },
      { p: arm, k: 0.5, kante: true },
      { p: finger, k: 0, kante: true },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette(v.zone || 'gezeitenwerk'));
    const augen = [];
    const details = P => {
      // Lücken zwischen den Speichen, Zahnfuß-Kreis als feine Fuge
      const n = v.speichen, rIn = 0.72, rHub = 0.42;
      const loch = (x, y) => {
        const u = (x + 0.5 - cx) / (rx - 1), w = (y + 0.5 - cy) / (ry - 1); const q = Math.hypot(u, w); if (q > rIn || q < rHub) return false;
        let a = Math.atan2(w, u) + rot; a = ((a / TAU * n) % 1 + 1) % 1; const breite = 0.16 + 0.12 * (q - rHub);
        return a > breite && a < 1 - breite * 0.4;
      };
      lochRand(P, loch, r(cx - rx), r(cy - ry), r(cx + rx), r(cy + ry));
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Fuge am Zahnfuß und Nieten auf dem Kranz
      for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; const x = cx + Math.cos(a) * (rx - 2.5), y = cy + Math.sin(a) * (ry - 3); if (P.get(r(x), r(y)) >= 1 && P.get(r(x), r(y)) <= 4) P.auf(x, y, i % 2 ? 'k0' : 'k1'); }
      for (let i = 0; i < v.speichen; i++) { const a = (i + 0.5) / v.speichen * TAU - rot; P.auf(cx + Math.cos(a) * (rx - 4.5), cy + Math.sin(a) * (ry - 5.5), 'r1'); }
      // Fingerabdrücke auf dem Kranz: sieben Punkte im Bogen, ein Hauch Bronze, blank gegriffen
      const ab = [cx - rx * 0.62, cy - ry * 0.42];
      for (let i = 0; i < 7; i++) { const a = -2.4 + i * 0.22; P.auf(ab[0] + Math.cos(a) * 4, ab[1] + Math.sin(a) * 4.5, i === 3 ? 'bronze' : 'k3'); }
      P.auf(ab[0] + 1, ab[1] + 1, 'k3');
      // Augen: zwei Lichter übereinander in der Nabe
      if (!p.tod || f < 1) {
        const ex = r(cx - 2), e1 = r(cy - 3), e2 = r(cy + 3);
        P.auge(ex, e1, p.angriff && f === 2 ? 3 : 2); P.auge(ex, e2, 1); augen.push([ex, e1], [ex, e2]);
      } else { P.set(cx - 2, cy - 3, 'k0'); P.set(cx - 2, cy + 3, 'k0'); }
      // Knöchel der Finger: Bronze blankgerieben (kleine Lichter)
      if (v.arme) P.auf(hand[0], hand[1], 'bronze');
    };
    return { gruppen, details, augen };
  },
};
