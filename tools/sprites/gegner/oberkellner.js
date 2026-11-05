// Nachtzug, zweiter Wächter: Der Oberkellner. Er hat im Speisewagen bedient, seit der Zug fährt, und er hat
// nie aufgehört, die Rechnung zu bringen. Frack, Serviette über dem Arm, sehr gerade. Wo der Kopf sein müsste,
// steht auf dem Kragen ein Teller mit einer silbernen Speiseglocke darüber. Unter dem Rand der Glocke kommt
// Licht heraus, warm, wie aus einer Küche. Er reicht dir die Rechnung. Sie ist für alle Gänge, auch die,
// die noch kommen.
// Phase 2 (oberkellner_p2): Er hebt die Glocke. Auf dem Teller liegt sein Kopf, auf dem Rücken, und sieht
// zu dir herauf.
'use strict';
const KA = require('./hilfe/kanten');
const LIB = require('../lib');

module.exports = {
  id: 'oberkellner', biom: 'nachtzug', zone: 'nachtzug_kellner', rang: 'waechter', w: 160, h: 180, fuss: [96, 176], kopf: [92, 14], rimBis: 174,
  varianten: { oberkellner: { offen: false }, oberkellner_p2: { offen: true } },
  // Silhouetten-Probe (nicht gebaut): ein Kellner mit Kopf, der die Glocke auf der Hand trägt. Schwarz ein
  // gewöhnlicher Kellner mit Tablett, nichts Falsches daran, und neben der Kontrolleurin wieder eine schmale
  // Säule mit ausgestrecktem Arm. Genommen: die Glocke statt des Kopfs, breit über dem Kragen, dazu die Rockschöße.
  proben: { probe_mit_kopf: { offen: false, mitKopf: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let lean = 0, buck = 0, hub = 0, reich = 0, fall = 0, atem = 0, sch = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; hub = [0, 0, 1, 0][f]; sch = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [3, 5, -10, -4][f]; buck = [0, -0.05, 0.22, 0.1][f]; hub = [0, 1, 4, 1][f]; reich = [0.2, 0, 1, 0.5][f]; sch = [1, 2, -2, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; buck = -0.04; }
    if (p.tod) { fall = r(p.q * 26); buck = p.q * 0.25; hub = 0; }
    const offen = !!v.offen;
    const FY = 176;
    // Oberkörper kippt um die Hüfte (Verbeugung)
    const hx0 = 98 + lean * 0.4, hy0 = 112 + fall * 0.6;
    const rot = (x, y) => { const X = x - hx0, Y = y - hy0; return [hx0 + lean * 0.6 + X * Math.cos(-buck) - Y * Math.sin(-buck), hy0 + atem + X * Math.sin(-buck) + Y * Math.cos(-buck)]; };
    const R = pts => pts.map(([x, y]) => rot(x, y));
    // Beine: schmal, dunkle Hose mit Galon, Lackschuhe
    const beine = [...glied([[94 + lean * 0.3, 112 + fall * 0.6], [92, 146], [90, 172]], 4.4, 3.2, null), ...glied([[104 + lean * 0.3, 112 + fall * 0.6], [106, 146], [108, 172]], 4.2, 3, null)];
    const schuhe = [Pg([[82, 170], [94, 170], [95, 176], [80, 176]], null, { rd: 1 }), Pg([[104, 170], [114, 170], [116, 176], [102, 176]], null, { rd: 1 })];
    // Frack: kurze Front, lange Schöße hinten (nach rechts), schmale Taille
    const frack = Pg(R([[86, 72], [112, 70], [116, 84], [114, 104], [118, 112], [126 + sch, 150], [120 + sch, 152], [112, 126], [104, 116], [90, 116], [86, 104], [84, 86]]), null, { rd: 2 });
    const hemd = Pg(R([[90, 72], [102, 71], [100, 98], [94, 104], [89, 96]]), 'haut', { rd: 1, tone: 0.2 });
    // Kragen, darauf der Teller, darüber die Glocke
    const kragen = Pg(R([[90, 64], [106, 64], [108, 72], [88, 72]]), 'haut', { rd: 1 });
    const tx = rot(97, 60);
    const teller = E(tx[0], tx[1], 22, 4, null, { pf: 'flat' });
    const gh = offen ? 0 : hub;
    const glockeF = []; let gx = tx[0], gy = tx[1] - 2 - gh;
    if (!offen && !v.mitKopf) glockeF.push(Pg([[gx - 19, gy], [gx - 18, gy - 8], [gx - 13, gy - 17], [gx - 5, gy - 22], [gx + 5, gy - 22], [gx + 13, gy - 17], [gx + 18, gy - 8], [gx + 19, gy]], null, { rd: 1.2 }), E(gx, gy - 24, 3, 2.4, null), C(gx, gy - 22, gx, gy - 24, 1.4, 1.4, null));
    // Phase 2: die Glocke in der hinteren Hand hoch erhoben, auf dem Teller der Kopf
    let gH = null;
    if (offen) { gH = [134 + lean * 0.5, 34 + atem - hub]; glockeF.push(Pg([[gH[0] - 14, gH[1] + 14], [gH[0] - 13, gH[1] + 7], [gH[0] - 9, gH[1]], [gH[0] - 3, gH[1] - 3], [gH[0] + 4, gH[1] - 3], [gH[0] + 10, gH[1]], [gH[0] + 14, gH[1] + 7], [gH[0] + 15, gH[1] + 14]], null, { rd: 1.2 }), E(gH[0] + 1, gH[1] - 5, 2.6, 2, null)); }
    const kopfP = [];
    if (offen) kopfP.push(E(tx[0], tx[1] - 6, 8, 7, 'haut'));
    if (v.mitKopf) kopfP.push(E(tx[0], tx[1] - 10, 6, 7.5, 'haut'));
    // Arme: vorn mit Serviette über dem Unterarm, die Hand reicht die Rechnung; hinten auf dem Rücken
    const hand = [64 - reich * 22, 92 - reich * 6];
    const armV = [...glied(R([[88, 76], [80, 94], hand]), 3.8, 2.8, null), E(...rot(hand[0] - 1, hand[1]), 3.2, 2.8, 'haut')];
    const serv = Pg(R([[84, 92], [74, 92], [72, 112 + sch], [78, 116 + sch], [82, 108]]), 'haut', { rd: 0.8, tone: 0.3 });
    const zettel = Pg(R([[hand[0] - 8, hand[1] - 9], [hand[0] - 2, hand[1] - 9], [hand[0] - 1, hand[1] + 2], [hand[0] - 7, hand[1] + 3]]), 'haut', { rd: 0.3, pf: 'flat', tone: 0.45 });
    const armH = offen ? [...glied(R([[110, 76], [124, 64]]), 3.4, 2.8, null), ...glied([rot(124, 64), [gH[0] + 1, gH[1] + 14]], 2.8, 2.4, null)] : [...glied(R([[110, 76], [118, 94], [110, 104]]), 3.4, 2.6, null)];
    const gruppen = [
      { p: armH, k: 1, kante: true, tone: -0.05 },     // 0
      { p: [...beine, ...schuhe], k: 1, kante: true }, // 1
      { p: [frack], k: 1.5, kante: true },             // 2
      { p: [hemd], k: 0, kante: true },                // 3
      { p: [kragen], k: 0, kante: true },              // 4
      { p: [teller], k: 0, kante: true, tone: 0.1 },   // 5
      { p: kopfP, k: 1, kante: true, tone: 0.25 },     // 6
      { p: glockeF, k: 0.6, kante: true, tone: 0.06 }, // 7
      { p: [serv], k: 0, kante: true },                // 8
      { p: armV, k: 1, kante: true, tone: 0.05 },      // 9
      { p: [zettel], k: 0, kante: true },              // 10
    ];
    const FRACK = 2, HEMD = 3, TELLER = 5, KOPF = 6, GL = 7, SERV = 8, ZETTEL = 10;
    gruppen.forEach((g, i) => { g.anker = i === 1 ? [0, 0] : [r(lean * 0.6), atem]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('nachtzug_kellner'), { rimBis: 174 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - r(lean * 0.6), y - atem);
      // Frack: Revers aus Seide (eine Stufe heller), Knöpfe, Falte der Schöße
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== FRACK) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [u, w] = [x, y];
        let rr = x; while (gid[y * W + rr + 1] === FRACK) rr++; const d = rr - x;
        if (d < 5 && d > 1 && B(x, y) < 0.6 - d * 0.1) P.set(x, y, 'k3');
      }
      for (let k = 0; k < 3; k++) { const [x, y] = rot(91, 98 + k * 6); P.auf(x, y, 'messing'); }
      { const [x0, y0] = rot(112, 116), [x1, y1] = rot(122, 148); P.line(x0, y0, x1 + sch, y1, 'k0', true); }
      // Hemdbrust: Plastron, Fliege
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== HEMD) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; P.set(x, y, B(x, y) < 0.55 ? 'k3' : 'k2'); }
      { const [x, y] = rot(95, 74); P.set(x - 2, y, 'k0'); P.set(x - 1, y, 'k0'); P.set(x, y, 'k1'); P.set(x + 1, y, 'k0'); P.set(x + 2, y, 'k0'); P.set(x - 2, y + 1, 'k0'); P.set(x + 2, y + 1, 'k0'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Glocke: Silber, poliert: ein Glanzband (Randlicht) und gespiegelter Wagen (dunkle Bänder)
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== GL) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const cx = offen ? gH[0] : gx, cy = offen ? gH[1] + 12 : gy; const u = (x + 0.5 - cx) / 19, w = (cy - y - 0.5) / 22;
        let t = c;
        if (u > 0.3 && u < 0.46 && w > 0.15 && w < 0.85) t = 'r1'; else if (u > 0.46 && u < 0.6 && w > 0.15 && w < 0.8) t = 'k3';
        else if (u > -0.6 && u < -0.2 && w > 0.2) t = B(x, y) < 0.35 ? 'k3' : 'k2';
        if (Math.abs(w - 0.45) < 0.03) t = 'k1';
        P.set(x, y, t);
      }
      // Teller: weißes Porzellan mit Goldrand, schräg gesehen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== TELLER) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue; const dy = y + 0.5 - tx[1]; P.set(x, y, dy > 2 ? 'messing' : dy > 0.5 ? 'k3' : (B(x, y) < 0.6 ? 'k3' : 'k2')); }
      // Licht unter dem Glockenrand: der Spalt zwischen Glocke und Teller
      if (!offen && !v.mitKopf) {
        const sp = 1 + hub; const hell = !(p.tod && f >= 1);
        for (let x = r(gx - 17); x <= gx + 17; x++) for (let k = 0; k < sp; k++) { const y = r(gy + 1 + k); if (!P.get(x, y) || gid[y * W + x] === TELLER || gid[y * W + x] === GL) P.set(x, y, hell ? (Math.abs(x - gx) < 7 && k === 0 ? 'glut' : 'glutDim') : 'k1'); }
        if (hell) { P.set(gx - 4, r(gy + 1), 'kern'); P.set(gx + 3, r(gy + 1), 'kern'); P.glow(gx, gy + 4, 18, 0.5, 'glutDim', 'k3'); augen.push([r(gx - 4), r(gy + 1)], [r(gx + 3), r(gy + 1)]); }
      }
      // Phase 2: der Kopf auf dem Teller, auf dem Rücken liegend, Augen offen, nach oben
      if (offen) {
        // das Gesicht liegt auf dem Hinterkopf und sieht nach oben zu dir: Stirn hinten, Haar gescheitelt, Augen offen
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== KOPF) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const u = x + 0.5 - tx[0], w = y + 0.5 - (tx[1] - 6);
          if (w < -3.5 || (w < -1.5 && Math.abs(u) > 5)) P.set(x, y, (x + y) % 3 ? 'k1' : 'k2'); else if (Math.abs(u) > 6.5) P.set(x, y, 'k2'); else P.set(x, y, B(x, y) < 0.75 ? 'k3' : 'k2'); }
        { const y0 = r(tx[1] - 6); P.set(tx[0], y0 - 4, 'k0'); // Scheitel
          P.set(tx[0], y0 + 1, 'k2'); P.set(tx[0], y0 + 2, 'k2'); // Nase
          P.set(tx[0] - 2, y0 + 4, 'k0'); P.set(tx[0] - 1, y0 + 4, 'k0'); P.set(tx[0], y0 + 4, 'k0'); P.set(tx[0] + 1, y0 + 4, 'k0'); P.set(tx[0] + 2, y0 + 4, 'k0'); // Mund, gerade
          if (!(p.tod && f >= 1)) { P.glow(tx[0], y0, 9, 0.8, 'glutDim', 'k3'); for (const ex of [tx[0] - 3, tx[0] + 3]) { P.set(ex, y0 - 1, 'kern'); P.set(ex + (ex < tx[0] ? -1 : 1), y0 - 1, 'glut'); P.set(ex, y0 - 2, 'k0'); } augen.push([r(tx[0] - 3), y0 - 1], [r(tx[0] + 3), y0 - 1]); } }
        // Licht aus der leeren Glocke von unten
        const cx = gH[0], cy = gH[1] + 14; for (let x = cx - 13; x <= cx + 13; x++) if (P.get(r(x), r(cy))) P.set(x, cy, Math.abs(x - cx) < 6 ? 'glut' : 'glutDim');
        P.glow(cx, cy - 2, 12, 0.7, 'glutDim', 'k3'); augen.push([r(cx), r(cy)]);
      }
      if (v.mitKopf) { P.auge(tx[0] - 3, tx[1] - 11, 2); augen.push([r(tx[0] - 3), r(tx[1] - 11)]); }
      // Serviette: weißes Leinen mit Faltenwurf, Rechnung mit Zeilen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = gid[y * W + x]; if (g !== SERV && g !== ZETTEL) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue; if (g === SERV) P.set(x, y, (x % 3 === 0) ? 'k2' : (B(x, y) < 0.7 ? 'k3' : 'r1')); else P.set(x, y, (y % 2 === 0 && B(x, y) < 0.8) ? 'k2' : 'r1'); }
      KA.licht(P, armV, { c: 'r1', c2: null });
      // Randlicht oben rechts kräftig (das Fensterlicht ohne Morgen)
      { const z = []; for (let y = 0; y < 172; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y, 'r2']); } for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
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
