// Zweiter Wächter Namenlose Stadt: Der Getragene. Durch die niedrigen Gänge der Erbauer zieht noch ein Leichenzug.
// Vier Träger, längst vertrocknet, in Binden gewickelt, mit den langen flachen Schädeln der Erbauer, tragen eine
// Lade auf zwei Stangen. Die Stirnseite der Lade ist sein Gesicht, aus Stein geschnitten, mit langer Schnauze.
// Der Deckel steht einen Spalt offen, und aus dem Spalt kommen Finger, zu viele und zu lang. Die Träger sind tot.
// Der in der Lade ist es nicht. Randlicht phosphorgrün: das Licht aus dem Abgrund hinter dem Messingtor, das die
// rote Stadt sonst nirgends hat.
'use strict';
const LIB = require('../lib');
const { h, innenKanten, randKraeftig } = require('./hilfe/w2a3');

// Ein Träger: aufrecht gebückt unter der Stange, die Schulter trägt, der lange flache Schädel hängt nach vorn
// unter der Last, ein Arm hält die Stange, der andere hängt; die Beine im Schritt
function traeger(A, x, fy, s, schritt, shY, lunge, m) {
  const { E, C, Pg, glied } = A;
  const hu = [x + 3, fy - 40 * s], sch = [x - 3 + lunge * 0.4, shY];
  const rumpf = Pg([[hu[0] + 5 * s, hu[1] + 4], [hu[0] - 6 * s, hu[1] + 3], [sch[0] - 7 * s, sch[1] + 6], [sch[0] - 3 * s, sch[1] - 1], [sch[0] + 6 * s, sch[1] - 1], [sch[0] + 8 * s, sch[1] + 8]], m, { rd: 1.8 * s });
  const kx = sch[0] - 11 * s + lunge * 0.5, ky = sch[1] + 9 * s;
  const hals = C(sch[0] - 3 * s, sch[1] + 3, kx + 4 * s, ky - 1, 2.8 * s, 2.2 * s, m);
  const kopf = [E(kx, ky, 6 * s, 4.2 * s, m), C(kx - 3 * s, ky + 1.5 * s, kx - 13 * s, ky + 4.5 * s, 2.6 * s, 1.3 * s, m)];
  const b1 = [[hu[0] - 2 * s, hu[1] + 2], [x - 5 * s + schritt * 5, fy - 20 * s], [x - 8 * s + schritt * 7, fy - 1]];
  const b2 = [[hu[0] + 3 * s, hu[1] + 2], [x + 8 * s - schritt * 5, fy - 21 * s], [x + 4 * s - schritt * 6, fy - 1]];
  const beine = [...glied(b1, 3.2 * s, 1.8 * s, m), ...glied(b2, 3.2 * s, 1.8 * s, m), C(b1[2][0], b1[2][1], b1[2][0] - 5 * s, fy, 1.5 * s, 1.2 * s, m), C(b2[2][0], b2[2][1], b2[2][0] - 5 * s, fy, 1.5 * s, 1.2 * s, m)];
  const armHoch = glied([[sch[0] + 1 * s, sch[1] + 3], [sch[0] - 7 * s, sch[1] + 4], [sch[0] - 8 * s, sch[1] - 3]], 2.2 * s, 1.6 * s, m);
  const armVor = glied([[sch[0] + 3 * s, sch[1] + 5], [sch[0] + 2 * s, sch[1] + 18 * s], [sch[0] - 4 * s + lunge * 0.4, sch[1] + 28 * s]], 2.1 * s, 1.3 * s, m);
  return { rumpf, hals, kopf, beine, armHoch, armVor, kx, ky, hu, sch };
}

module.exports = {
  id: 'getragene', biom: 'stadt', zone: 'stadt_phosphor', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 30], rimBis: 172,
  varianten: { getragene: {} },
  // Silhouetten-Probe (verworfen): die Lade allein, aufrecht wie ein Sarg, der Deckel offen. Schwarz ein Brett mit
  // Kopf, zu nah am Relief und an der Bote-Silhouette; erst die Träger darunter machen den Zug lesbar.
  proben: { probe_aufrecht: { aufrecht: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    let dx = 0, dy = 0, deckel = [0.08, 0.085, 0.09, 0.085][f % 4], greif = 0, duck = 0, lunge = 0, schritt = [0, 0.12, 0, -0.12][f % 4], fall = 0, sinkL = 0;
    if (p.angriff) { dx = [3, 5, -10, -4][f]; dy = [0, 2, -2, 0][f]; deckel = [0.12, 0.17, 0.21, 0.12][f]; greif = [0.2, 0, 1, 0.5][f]; duck = [2, 5, -1, 1][f]; lunge = [2, 4, -8, -3][f]; schritt = [0.2, 0.5, -0.8, -0.3][f]; }
    if (p.treffer) { dx = [3, 2][f]; deckel = 0.02; }
    if (p.tod) { fall = r(p.q * 34); sinkL = r(p.q * 14); deckel = Math.max(0, 0.07 - p.q * 0.1); schritt = 0; }
    if (p.idle) dy = 0;
    // Lade: langer Kasten, rechts etwas kleiner (nach hinten), Stirnseite links mit Gesicht
    const X = dx, Y = dy + duck * 0.6 + (p.tod ? fall : 0);
    const ladeL = 18 + X, ladeR = 148 + X, oben = v.aufrecht ? 20 : 64 + Y, unten = v.aufrecht ? 170 : 100 + Y;
    const lade = v.aufrecht ? [Pg([[60, 20], [100, 20], [104, 172], [56, 172]], null, { rd: 1.5 })]
      : [Pg([[ladeL, oben + 2 + sinkL], [ladeR, oben - 4], [ladeR + 1, unten - 4], [ladeL + 1, unten + 1 + sinkL]], null, { rd: 1.5 })];
    // Deckel: Satteldach, dreht sich links auf (Achse rechts hinten)
    const ax = ladeR + 2, ay = oben - 5, ca = Math.cos(deckel), sa = Math.sin(deckel);
    const rot = ([x, y]) => [ax + (x - ax) * ca - (y - ay) * sa, ay + (x - ax) * sa + (y - ay) * ca];
    const dpts = [[ladeL - 4, oben + 4 + sinkL], [ladeR + 3, oben - 3], [ladeR + 1, oben - 10], [ladeL + 8, oben - 6 + sinkL], [ladeL - 2, oben - 2 + sinkL]].map(([x, y]) => [x, y]);
    const deckelP = v.aufrecht ? [] : [Pg(dpts.map(q => { const [x, y] = rot(q); return [x, y]; }), null, { rd: 1 })];
    const spalt = v.aufrecht ? [] : [Pg([[ladeL + 2, oben + 3 + sinkL], [ladeR - 10, oben - 3], rot([ladeR - 10, oben - 4]), rot([ladeL + 2, oben + 2 + sinkL])], 'dunkel', { rd: 0.3, pf: 'flat' })];
    // Gesicht der Stirnseite: langer, flacher Erbauerschädel aus Stein, Schnauze nach links
    const gx = ladeL + 2, gy = (oben + unten) / 2 + 2 + sinkL;
    const gesicht = v.aufrecht ? [E(80, 30, 12, 8, 'haut'), C(70, 30, 52, 34, 5, 3, 'haut')]
      : [Pg([[gx + 10, gy - 16], [gx - 6, gy - 13], [gx - 16, gy - 6], [gx - 17, gy + 2], [gx - 6, gy + 8], [gx + 10, gy + 14]], 'haut', { rd: 1.5 }), C(gx - 12, gy - 2, gx - 26 + greif * -2, gy + 1, 4.4, 2.6, 'haut')];
    // Stangen: vorn und hinten, die Träger halten sie
    const stange = (yy, x0, x1) => [C(x0 + X, yy + Y + 4, x1 + X, yy + Y - 2, 2, 2, null)];
    const stH = v.aufrecht ? [] : stange(unten - 2, 4, 158), stV = v.aufrecht ? [] : stange(unten + 5, 0, 156);
    // Finger aus dem Spalt: sieben, lang, über den Rand gehakt; beim Angriff greift ein Arm nach vorn
    const finger = [];
    if (!v.aufrecht && !(p.tod && f >= 3)) {
      for (let i = 0; i < 7; i++) {
        const bx = ladeL + 16 + i * 7 + (i > 3 ? 6 : 0), [sx, sy] = rot([bx, oben - 1 + sinkL - i * 0.05 * 6]);
        const lang = 9 + h(i, 1) * 6 + deckel * 30, kr = (h(i, 2) - 0.5) * 2;
        finger.push(...glied([[sx + 1, sy - 1], [sx - 2 + kr, sy - 4], [sx - 4 + kr, sy + 2], [sx - 4 + kr * 1.5, sy + lang * 0.7]], 1.5, 0.8, 'haut'));
      }
      if (greif > 0) { const [sx, sy] = rot([ladeL + 14, oben + sinkL]); const ex = Math.max(10, sx - 8 - greif * 10), ey = sy - 30 + greif * 18;
        finger.push(...glied([[sx + 4, sy], [sx + 2, sy - 24], [ex, ey]], 2.8, 1.8, 'haut'));
        for (let k = 0; k < 5; k++) finger.push(C(ex, ey, ex - 6 - k * 0.6, ey + 3 + k * 2.2, 1, 0.6, 'haut')); }
    }
    // Träger: zwei hinten (kleiner, dunkler), zwei vorn
    const tr = v.aufrecht ? [] : [
      traeger(A, 72 + X, FY - 4, 0.8, -schritt, unten - 1, lunge, 'dunkel'),
      traeger(A, 142 + X, FY - 5, 0.8, schritt, unten - 4, lunge, 'dunkel'),
      traeger(A, 36 + X, FY, 1, schritt, unten + 6, lunge, null),
      traeger(A, 106 + X, FY, 0.98, -schritt, unten + 3, lunge, null),
    ];
    if (p.tod) tr.forEach((t, i) => { const k = r(Math.max(0, p.q * 2 - i * 0.2) * 10); t.beine.forEach(c => { c.y1 += k * 0.3; c.y2 += k * 0.3; }); });
    const gruppen = [];
    const T = {};
    tr.slice(0, 2).forEach((t, i) => { gruppen.push({ p: [...t.beine, t.rumpf, t.hals, ...t.kopf, ...t.armVor], k: 1, kante: true, tr: t, hinten: true }); });
    gruppen.push({ p: stH, k: 0, kante: true, stange: true });
    tr.slice(0, 2).forEach(t => gruppen.push({ p: t.armHoch, k: 0.6, kante: true, arm: true }));
    T.LADE = gruppen.push({ p: lade, k: 0, kante: true }) - 1;
    T.SPALT = gruppen.push({ p: spalt, k: 0, noRim: true }) - 1;
    T.DECKEL = gruppen.push({ p: deckelP, k: 0, kante: true }) - 1;
    T.FINGER = gruppen.push({ p: finger, k: 0.5, kante: true }) - 1;
    T.GESICHT = gruppen.push({ p: gesicht, k: 1, kante: true }) - 1;
    gruppen.push({ p: stV, k: 0, kante: true, stange: true });
    tr.slice(2).forEach(t => { gruppen.push({ p: [...t.beine, t.rumpf, t.hals, ...t.kopf, ...t.armVor], k: 1, kante: true, tr: t }); gruppen.push({ p: t.armHoch, k: 0.6, kante: true, arm: true }); });
    gruppen.forEach(g => { g.anker = g.tr || g.arm ? [r(X), 0] : [r(X), r(Y)]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('stadt_phosphor'), { rimBis: 172 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - r(X), y - r(Y));
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
      // Lade: Fries mit Reihen kleiner Felder (die Geschichte der Erbauer), Kanten, Ecken
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, T.LADE)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
        const u = (x - ladeL) / (ladeR - ladeL), top = oben + 2 + sinkL * (1 - u) - u * 6, bot = unten + 1 + sinkL * (1 - u) - u * 5, w = (y - top) / (bot - top);
        let t = B(x, y) < 0.25 ? 2 : 1;
        if (w > 0.16 && w < 0.2 || w > 0.78 && w < 0.82) t = 1;
        else if (w > 0.12 && w < 0.16 || w > 0.74 && w < 0.78) t = 3;
        else if (w > 0.24 && w < 0.7) { const fx = Math.floor((x - ladeL) / 9), fz = Math.floor((w - 0.24) / 0.23); const lu = ((x - ladeL) % 9) / 9, lw = ((w - 0.24) % 0.23) / 0.23;
          if (lu < 0.12 || lw < 0.1) t = 1; else if (lu > 0.82 || lw > 0.85) t = 3; else t = h(fx, fz) < 0.35 && lu > 0.3 && lu < 0.6 && lw > 0.3 && lw < 0.7 ? 3 : 2; }
        if (x > ladeR - 4) t = B(x, y) < 0.5 ? 4 : 3;
        P.set(x, y, t);
      }
      // Deckel: Grat und Schuppen, Lichtkante zum Grat
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, T.DECKEL)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue; P.set(x, y, ((x >> 2) + (y >> 1)) % 3 === 0 ? 1 : B(x, y) < 0.4 ? 3 : 2); if (!ist(x, y - 1, T.DECKEL)) P.set(x, y, 'r1'); }
      // Spalt: von innen ein gelbes Licht, die Finger davor
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, T.SPALT)) continue; const t = 1 - Math.abs(x - (ladeL + 50)) / 70 + (B(x, y) - 0.5) * 0.4; P.set(x, y, p.tod && f >= 2 ? 1 : t > 0.75 ? 'glut' : t > 0.35 ? 'glutDim' : 1); }
      // Finger: Gelenke, Nägel
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, T.FINGER) && P.get(x, y) <= 4) P.set(x, y, (x + y) % 4 === 0 ? 2 : 3);
      // Gesicht: Augenhöhle, Maul als Kerbe, Schuppenmuster; die Augen glühen gelb
      if (!v.aufrecht) {
        for (let y = r(gy - 16); y <= r(gy + 14); y++) for (let x = r(gx - 30); x <= r(gx + 12); x++) { if (!ist(x, y, T.GESICHT)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue; let t = (x + 2 * y) % 5 === 0 ? 2 : B(x, y) < 0.45 ? 4 : 3; if (x > gx + 4) t = 2; P.set(x, y, t); }
        P.line(gx - 26 + 2, gy + 2, gx - 6, gy + 4, 1, true); P.line(gx - 22, gy + 3, gx - 8, gy + 5, 2, true);
        for (let k = 0; k < 4; k++) P.auf(gx - 22 + k * 4, gy + 4 + (k % 2), 'r1');
        if (!(p.tod && f >= 1)) { P.glow(gx - 8, gy - 6, 7, 0.9, 'glutDim', 'k3'); P.set(gx - 9, gy - 6, 'kern'); P.set(gx - 8, gy - 6, 'glut'); P.set(gx - 4, gy - 7, 'glut'); P.set(gx - 3, gy - 7, 'glutDim'); augen.push([r(gx - 9), r(gy - 6)], [r(gx - 4), r(gy - 7)]); }
      }
      // Träger: Binden quer gewickelt, Schädel mit Augenschlitz (erloschen, nur ein Funke)
      gruppen.forEach((g, gi) => {
        if (!g.tr) return; const t = g.tr;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
          const band = ((x + y * 2 + (g.hinten ? 3 : 0)) % 8);
          if (band === 0) P.set(x, y, 1); else if (band === 1 && !g.hinten) P.set(x, y, 'binde'); else if (band === 2 && !g.hinten) P.set(x, y, 3); else if (!g.hinten) P.set(x, y, B(x, y) < 0.2 ? 3 : 2);
          if (g.hinten && k > 2) P.set(x, y, 2); }
        if (!(p.tod && f >= 1)) { P.set(t.kx - 3, t.ky - 1, g.hinten ? 'glutDim' : 'glut'); }
        // Binde hängt lose vom Arm
        if (!g.hinten && !p.tod) for (let k = 0; k < 7; k++) { const x = r(t.sch[0] - 6 - k * 0.3 + Math.sin(k * 0.8 + f) * 1.2), y = r(t.sch[1] + 14 + k); if (!P.get(x, y)) P.set(x, y, k % 2 ? 'binde' : 2); }
      });
      // Stangen: Holz mit Metallbeschlag
      gruppen.forEach((g, gi) => { if (!g.stange) return; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gi) && P.get(x, y) <= 4) P.set(x, y, x % 23 < 2 ? 4 : (ist(x, y - 1, gi) ? 2 : 3)); });
      innenKanten(P, gid, gruppen, W, H, 'r1');
      randKraeftig(P, W, H, { bis: 170 });
    };
    return { gruppen, details, augen };
  },
};
