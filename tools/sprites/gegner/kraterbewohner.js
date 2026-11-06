// Der Mond unter dem Eis: Der Kraterbewohner. Die Krater sind bewohnt. In jedem brennt eine Lampe, und wer
// darin wohnt, stützt sich auf den Rand wie auf ein Fensterbrett, um zu sehen, wer kommt. Er ist lang und
// mager, ein Rücken wie ein Fragezeichen, die Arme so lang, dass die Hände draußen im Staub liegen. Sein
// Schädel ist narbig wie der Mond selbst. Hinter ihm, auf dem inneren Wall, stehen Lampe und Tasse.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'kraterbewohner', biom: 'mond', zone: 'mond', w: 96, h: 120, fuss: [48, 115], kopf: [40, 40], rimBis: 113,
  varianten: {
    // a: weiter, flacher Krater, Lampe auf dem Wall, Tasse auf dem Rand
    kraterbewohner_a: { rx: 42, tief: 0, hals: 0, lampeHand: false },
    // b: engerer, tieferer Krater, er steht höher und trägt die Lampe in der Hand
    kraterbewohner_b: { rx: 36, tief: 3, hals: 5, lampeHand: true },
  },
  // Silhouetten-Proben (nicht gebaut): ohne Krater (ein kriechender Mann, nichts vom Mond);
  // Krater als voller Hügel (las sich wie die Wachshand: ein Haufen mit Armen). Genommen: der Ringwall mit Loch.
  proben: {
    probe_ohne: { rx: 42, tief: 0, hals: 0, ohneKrater: true },
    probe_huegel: { rx: 42, tief: 0, hals: 0, huegel: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let hoch = 0, vor = 0, fall = 0, kopfN = 0, griff = 0, lampe = 1;
    // hoch: wie weit er sich aus dem Krater hebt, vor: wie weit er sich nach vorn (links) lehnt
    if (p.idle) { kopfN = [0, 0, 1, 1][f]; }
    if (p.angriff) { hoch = [-5, 6, 2, 0][f]; vor = [-3, -2, 16, 6][f]; kopfN = [3, -3, 2, 1][f]; griff = [0, 0.3, 1, 0.5][f]; }
    if (p.treffer) { hoch = [-2, -1][f]; vor = [-3, -2][f]; kopfN = 2; lampe = 0.7; }
    if (p.tod) { fall = r(p.q * 44); lampe = Math.max(0, 1 - p.q * 2); }
    const cx = 50, cy = 100 + v.tief, RX = v.rx;
    // Krater: ein Ringwall aus Asche, flach von vorn gesehen. Kammlinie = Ellipse; hinten etwas höher.
    const er = RX - 7, ey = 7 + v.tief * 0.4;
    const kamm = (a) => [cx + Math.cos(a) * er, cy - 2 + Math.sin(a) * ey - (Math.sin(a) < 0 ? -Math.sin(a) * 5 : 0)];
    const hintenPts = []; for (let i = 0; i <= 18; i++) hintenPts.push(kamm(Math.PI + i / 18 * Math.PI));
    const hinten = Pg([[cx - RX - 2, cy + 12], ...hintenPts, [cx + RX + 2, cy + 12]], null, { rd: 1.5 });
    const innen = Pg([...hintenPts.map(([x, y]) => [x + (x - cx) * -0.06, y + 2]), [cx + er - 2, cy + 3], [cx - er + 2, cy + 3]], null, { rd: 0.5 });
    const loch = E(cx, cy + 1, er - 4, ey - 2.5, 'dunkel', { pf: 'flat' });
    const vornPts = []; for (let i = 0; i <= 18; i++) vornPts.push(kamm(i / 18 * Math.PI));
    const vorn = Pg([[cx - RX - 4, cy + 15], ...vornPts.reverse().map(([x, y]) => [x, y + 2]), [cx + RX + 4, cy + 15]], null, { rd: 1.5 });
    const huegel = E(cx, cy + 4, RX, 16, null);
    // Er: Hüfte im Loch, Rücken als Fragezeichen, Kopf vorgereckt über dem Rand; die Arme wie ein Insekt
    const T = fall - hoch, bx = 54 + vor * 0.3, by = cy + 2 + T;
    const sch = [52 + vor * 0.6, 58 - v.hals + T], nacken = [44 + vor * 0.85, 52 - v.hals + T + kopfN * 0.5];
    const kopf = [32 + vor + kopfN * 0.3, 54 - v.hals + T + kopfN];
    const ruecken = glied([[bx + 2, by], [bx + 8, by - 22], [sch[0] + 4, sch[1] + 4], sch, nacken], 7.5, 4, 'haut');
    const brust = glied([[bx - 4, by], [bx - 5, by - 16], [sch[0] - 6, sch[1] + 8]], 5.5, 4.5, 'haut');
    const schaedel = Pg([[kopf[0] - 9, kopf[1] - 1], [kopf[0] - 5, kopf[1] - 9], [kopf[0] + 4, kopf[1] - 11], [kopf[0] + 11, kopf[1] - 6], [kopf[0] + 10, kopf[1] + 2], [kopf[0] + 1, kopf[1] + 7], [kopf[0] - 7, kopf[1] + 6]], 'haut', { rd: 2 });
    const kiefer = Pg([[kopf[0] - 8, kopf[1] + 3], [kopf[0] + 2, kopf[1] + 5], [kopf[0] - 2, kopf[1] + 11 + (p.angriff && f === 2 ? 3 : 0)], [kopf[0] - 8, kopf[1] + 9]], null, { rd: 1 });
    // Arme: Schulter -> Ellbogen hoch und weit -> Hand draußen im Staub (links) bzw. auf dem Rand (rechts)
    const greif = griff;
    const handL = [10 + vor * 0.6 - greif * 6, 113 - greif * 22], handR = [cx + er + 2 + vor * 0.3, cy + 4 - greif * 4];
    const ellL = [15 + vor * 0.7 - greif * 6, 44 - v.hals * 0.5 + T * 0.4 - greif * 6];
    const armL = [...glied([[sch[0] - 8, sch[1] + 4], ellL], 3.4, 2.6, 'haut'), ...glied([ellL, [ellL[0] - 6, ellL[1] + 30], handL], 2.8, 1.8, 'haut')];
    const ellR = [cx + er + 4 + vor * 0.2, 46 - v.hals * 0.5 + T * 0.4]; const armR = [...glied([[sch[0] + 4, sch[1] + 4], ellR], 3.2, 2.4, 'haut'), ...glied([ellR, [ellR[0] + 3, ellR[1] + 24], handR], 2.6, 1.7, 'haut')];
    const finger = (h, s) => [-1.6, -0.6, 0.4, 1.4].map(k => C(h[0], h[1], h[0] + k * 2.6 * s - 2 * s, h[1] + 3 - Math.abs(k) * 0.6 + (greif > 0.5 && s < 0 ? -3 : 0), 0.9, 0.5, 'haut'));
    // Lampe (a innen auf dem hinteren Wall, b in der rechten Hand) und Tasse auf dem vorderen Rand
    const lx = v.lampeHand ? handR[0] - 6 : cx + er - 12, ly = v.lampeHand ? handR[1] + 6 : cy - 7;
    const lampeF = [Pg([[lx - 3, ly + 3], [lx + 3, ly + 3], [lx + 2, ly + 7], [lx - 2, ly + 7]], null, { rd: 0.5 }), E(lx, ly, 2.6, 3, null), C(lx, ly - 3, lx, ly - 6, 1, 0.8, null)];
    const tasse = v.lampeHand ? [] : [Pg([[cx - 24, cy + 4], [cx - 19, cy + 4], [cx - 20, cy + 8], [cx - 23, cy + 8]], 'haut', { rd: 0.4 })];
    const ohne = v.ohneKrater, voll = v.huegel;
    const koerper = [ruecken, brust].flat();
    const gruppen = [
      { p: ohne || voll ? [] : [hinten], k: 0, tone: -0.05 },      // 0
      { p: ohne || voll ? [] : [innen], k: 0, noRim: true, tone: 0.15 }, // 1
      { p: ohne || voll ? [] : [loch], k: 0, noRim: true },          // 2
      { p: v.lampeHand ? [] : lampeF, k: 0, kante: true },           // 3
      { p: [...armR, ...finger(handR, 1)], k: 1, kante: true },      // 4
      { p: koerper, k: 3, anker: [0, r(T)], kante: true },           // 5
      { p: [kiefer], k: 1, anker: [0, r(T)] },                       // 6
      { p: [schaedel], k: 1.5, anker: [0, r(T)], kante: true },      // 7
      { p: voll ? [huegel] : ohne ? [] : [vorn], k: 0, tone: 0.1 },  // 8
      { p: tasse, k: 0, kante: true, noRim: true },                  // 9
      { p: [...armL, ...finger(handL, -1)], k: 1, kante: true },     // 10
      { p: v.lampeHand ? lampeF : [], k: 0, kante: true },           // 11
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('mond'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      H0.kapselLicht(P, [...armL, ...armR], 'r1');
      // Wirbel am Rücken: kleine Grate entlang der Linie
      for (let i = 1; i < 6; i++) { const q = i / 6, x = r(bx + 6 + (sch[0] - bx - 6) * q + 4), y = r(by - 8 - (by - 8 - sch[1]) * q); if (P.get(x, y) && P.get(x, y) <= 4) { P.set(x, y, 'k3'); P.set(x + 1, y + 1, 'k0'); } }
      // Rippen: fünf Bögen auf der Flanke, Tal dunkel, Grat hell; Schulterblatt als Buckel mit Licht
      for (let i = 0; i < 5; i++) { const y = r(by - 6 - i * 4.5), x = r(bx - 4 + i * 0.6); P.line(x - 4, y + 1, x + 5, y - 2, 'k0', true); P.line(x - 4, y, x + 5, y - 3, i % 2 ? 'k3' : 'r1', true); }
      { const x = r(sch[0] + 2), y = r(sch[1] + 3); P.line(x, y, x + 5, y + 6, 'k0', true); P.line(x + 1, y - 1, x + 6, y + 5, 'k3', true); }
      // Krater auf dem Schädel: Mulden mit Licht an der unteren linken Innenkante
      if (!p.tod || f < 2) for (const [dx, dy, rr] of [[3, -6, 1.6], [-3, -5, 1.2], [6, -1, 1.1], [0, -2, 0.9]]) { const x = r(kopf[0] + dx), y = r(kopf[1] + dy); P.auf(x, y, 'k0'); if (rr > 1) P.auf(x + 1, y, 'k1'); P.auf(x - 1, y + 1, 'k3'); }
      // Augen: zwei bleiche Punkte, tief in den Höhlen; der Mund ein dunkler Strich
      if (!p.tod || f < 1) {
        const ex = r(kopf[0] - 6), ey = r(kopf[1]);
        for (const dx of [0, 5]) { P.auf(ex + dx - 1, ey - 1, 'k0'); P.auf(ex + dx, ey - 1, 'k0'); P.auf(ex + dx + 1, ey - 1, 'k0'); }
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'glut'); P.set(ex + 6, ey, 'glutDim'); P.glow(ex + 3, ey + 0.5, 5, 0.6); augen.push([ex, ey], [ex + 5, ey]);
        P.line(ex - 1, ey + 6, ex + 4, ey + 7, 'k0', true); if (p.angriff && f === 2) P.line(ex, ey + 8, ex + 3, ey + 9, 'k0', true);
        // Wangenknochen und Brauen: ein Grat Licht
        P.line(ex + 2, ey - 3, ex + 8, ey - 4, 'k3', true); P.auf(ex + 8, ey + 2, 'k3');
      }
      if (lampe > 0 && !ohne && !voll && (!p.tod || f < 2)) { P.glow(bx - 2, by - 4, 18 * lampe, 0.95); for (let y = r(by - 14); y < by + 2; y++) for (let x = r(bx - 10); x < bx + 4; x++) { const gi = gid[y * W + x]; const dd = Math.hypot(x - bx + 3, (y - by - 2) * 1.3) / 14; if (gi === 5 && dd < 1 && LIB.bay(x, y) < (1 - dd) * 0.75) { const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, 'glutDim'); } } }
      // Lampe: Glaskolben bleich, Docht als Kern; Licht fällt auf die Innenseite des Walls und auf seinen Rücken
      if (lampe > 0 && (!p.tod || f < 2)) {
        const LX = r(lx), LY = r(ly);
        P.glow(LX + 0.5, LY + 0.5, 15 * lampe, 0.85);
        P.el(LX + 0.5, LY + 0.5, 2.2, 2.6, 'bleich'); P.set(LX, LY, p.idle && f % 2 ? 'glut' : 'kern'); P.set(LX, LY + 1, 'glut'); P.set(LX + 1, LY - 1, 'glut');
        P.auf(LX - 2, LY + 4, 'messing'); P.auf(LX + 2, LY + 4, 'messing');
        augen.push([LX, LY]);
      }
      // Unterlicht: was über dem Loch hängt, wird von unten bleich angestrahlt
      if (lampe > 0 && !ohne && !voll && (!p.tod || f < 2)) for (let y = r(cy - 30); y < cy + 2; y++) for (let x = r(cx - er); x < cx + er; x++) { const gi = gid[y * W + x]; if (gi < 4 || gi > 7) continue; const below = gid[(y + 1) * W + x]; const c = P.get(x, y); if (c >= 1 && c <= 4 && (below === 2 || below === 1 || below === 0)) P.set(x, y, (x + y) % 2 ? 'glutDim' : 'k3'); }
      // Innenwand: vom Licht getroffen, gedithert bleich nach oben ausdünnend
      if (lampe > 0 && !ohne && !voll && (!p.tod || f < 2)) for (let y = r(cy - 16); y < cy + 4; y++) for (let x = r(cx - er); x < cx + er; x++) { if (gid[y * W + x] !== 1) continue; const d = Math.hypot((x - lx) / 1.6, y - ly) / 18; const t = lampe * (1 - d); if (t > 0.55 + LIB.bay(x, y) * 0.3) P.set(x, y, 'glutDim'); else if (t > LIB.bay(x, y) * 0.8) P.set(x, y, 'k3'); }
      // Tasse: ein Henkel, ein heller Rand
      if (tasse.length) { P.set(cx - 25, cy + 5, 'k3'); P.set(cx - 25, cy + 6, 'k3'); P.line(cx - 24, cy + 4, cx - 20, cy + 4, 'r1', true); }
      // Krater: Schichtlinien im Wall, Auswurf als helle Körner am Fuß
      if (!ohne && !voll) {
        for (let x = cx - RX + 2; x < cx + RX - 2; x += 2) { const q = (x - cx) / RX; const y = r(cy + 10 - q * q * 2); if (gid[y * W + x] === 8) P.auf(x, y, (x >> 1) % 3 ? 'k0' : 'k3'); }
        for (let i = 0; i < 9; i++) { const x = r(cx - RX - 2 + i * (RX * 2 + 4) / 8), y = 114 - (i % 2); P.auf(x, y, i % 3 ? 'k3' : 'asche'); }
      }
      // Kamm des vorderen Walls: Körner im Licht, nicht als durchgehende Linie
      if (!ohne && !voll) for (let x = r(cx - er); x <= cx + er; x++) { let y = 0; while (y < H && gid[y * W + x] !== 8) y++; if (y < H && (x * 5 + y) % 4 !== 0) P.set(x, y, (x * 3) % 7 < 2 ? 'r1' : 'k3'); }
      // Tod: was unter den vorderen Wall sinkt, verschwindet im Loch
      if (p.tod) { const yv = cy + 6; for (let y = yv - 2; y < H; y++) for (let x = 0; x < W; x++) { const gi = gid[y * W + x]; if (gi >= 4 && gi <= 7 && y > yv - 2) P.loesch(x, y); } }
    };
    return { gruppen, details, augen };
  },
};
