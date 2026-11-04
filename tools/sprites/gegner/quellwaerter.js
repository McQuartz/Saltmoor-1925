// Der Quellwärter (Grotte der Gaben). Er hat den Pilgern mit der Kelle aus der Quelle geschöpft.
// Jetzt steht er bis zur Hüfte in der Brunnenschale, die eine Handbreit tief ist. Der rechte Arm
// greift hinunter ins Wasser, tiefer, als die Schale ist. Mit der Kelle schöpft er für die anderen.
'use strict';
module.exports = {
  id: 'quellwaerter', biom: 'grotte', zone: 'grotte', w: 96, h: 120, fuss: [48, 114], kopf: [46, 18], rimBis: 112,
  varianten: {
    quellwaerter_a: { schale: 'rund', breit: 34, kelle: 'kelle' },
    quellwaerter_b: { schale: 'muschel', breit: 31, kelle: 'becher', lang: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const f = p.f, P0 = pose(p, { fall: 26 });
    const L = v.lang || 0, cx = 48, B = v.breit;
    let lean = 0, ka = -2.5, kopfN = 0, armR = 0, sink = 0;
    // Kelle: Winkel des Stiels (−π/2 = senkrecht hoch, −π = waagerecht nach links)
    if (p.idle) { ka = [-2.55, -2.5, -2.45, -2.5][f]; kopfN = [0, 0, 1, 1][f]; armR = [0, 1, 1, 0][f]; }
    if (p.angriff) { ka = [-1.9, -1.35, -3.05, -2.7][f]; lean = [1, 2, -5, -2][f]; kopfN = [-1, -2, 1, 0][f]; }
    if (p.treffer) { lean = [2, 1][f]; ka = -2.2; kopfN = -1; }
    if (p.tod) { sink = r(p.q * 30); kopfN = r(p.q * 4); ka = -2.9 + p.q * 0.6; }
    const T = 0;
    // Schale (Lippe bei y 76), Schaft, Fuß
    const ly = 77;
    let schale;
    if (v.schale === 'rund') schale = [Pg([[cx - B, ly - 1], [cx + B, ly - 1], [cx + B - 3, ly + 6], [cx + B - 12, ly + 11], [cx - B + 12, ly + 11], [cx - B + 3, ly + 6]], null, { rd: 1.5 })];
    else { schale = [Pg([[cx - B, ly - 3], [cx - B + 6, ly - 1], [cx + B - 6, ly - 1], [cx + B, ly - 3], [cx + B - 2, ly + 5], [cx + 6, ly + 12], [cx - 6, ly + 12], [cx - B + 2, ly + 5]], null, { rd: 1.5 })]; }
    const schaft = [Pg([[cx - 6, ly + 10], [cx + 6, ly + 10], [cx + 5, 104], [cx + 9, 109], [cx + 14, 114], [cx - 14, 114], [cx - 9, 109], [cx - 5, 104]], null, { rd: 1 })];
    // Wasserfläche in der Schale (eine Stufe heller, flach)
    const wasser = [Pg([[cx - B + 3, ly - 1], [cx + B - 3, ly - 1], [cx + B - 6, ly + 1], [cx - B + 6, ly + 1]], 'haut', { pf: 'flat' })];
    // Figur: Rumpf steigt aus dem Wasser, sinkt beim Tod hinein
    const bx = cx + 1 + lean, sy = ly - 30 - L + T + sink;
    const rumpf = Pg([[bx - 7, ly + T], [bx - 8, sy + 8], [bx - 5, sy], [bx + 6, sy - 1], [bx + 9, sy + 6], [bx + 7, ly + T]], null, { rd: 2 });
    const schulter = E(bx, sy + 2, 9, 3.5, null, { pf: 'dome' });
    // Kopf: gesenkt, nach vorn links
    const hx = bx - 5 + kopfN * 0.5, hy = sy - 8 + kopfN;
    const hals = C(bx - 1, sy, hx + 2, hy + 3, 3, 2.2, null);
    const kopf = Pg([[hx - 5, hy - 4], [hx + 3, hy - 6], [hx + 6, hy - 1], [hx + 3, hy + 5], [hx - 2, hy + 9], [hx - 6, hy + 4]], 'haut', { rd: 1.2 });
    // nasses Tuch über dem Kopf, klebt am Rücken
    const tuch = Pg([[hx - 4, hy - 6], [hx + 4, hy - 8], [hx + 8, hy - 3], [bx + 10, sy + 4], [bx + 10, sy + 16], [bx + 7, sy + 22], [bx + 5, sy + 8], [hx + 4, hy + 2]], 'dunkel', { rd: 1.2 });
    // Rechter Arm: greift hinab ins Wasser, vor dem Rumpf
    const armRe = glied([[bx + 7, sy + 3], [bx + 15, sy + 16 + armR], [bx + 13, ly + 2]], 2.4, 1.6, null);
    // Linker Arm hält die Kelle
    const sh = [bx - 6, sy + 3];
    const hand = [sh[0] - 7 + Math.cos(ka + 0.6) * 4, sh[1] + 12 + Math.sin(ka + 0.6) * 4 - (p.angriff && f < 2 ? 12 : 0)];
    const armLi = glied([sh, [sh[0] - 6, sh[1] + 10 - (p.angriff && f < 2 ? 10 : 0)], hand], 2.3, 1.5, null);
    const kl = 26, ke = [hand[0] + Math.cos(ka) * kl, hand[1] + Math.sin(ka) * kl];
    const stiel = C(hand[0] - Math.cos(ka) * 3, hand[1] - Math.sin(ka) * 3, ke[0], ke[1], 0.8, 0.8, 'dunkel', { pf: 'flat' });
    const kopfK = v.kelle === 'kelle' ? [E(ke[0], ke[1] + 1.5, 4, 2.6, null), C(ke[0] - 4, ke[1], ke[0] + 4, ke[1], 0.9, 0.9, null)] : [Pg([[ke[0] - 3, ke[1] - 2], [ke[0] + 3, ke[1] - 2], [ke[0] + 2, ke[1] + 4], [ke[0] - 2, ke[1] + 4]], null, { rd: 0.5 })];
    const gruppen = [
      { p: schaft, k: 1 },
      { p: [rumpf, schulter, hals], k: 2.5, anker: [lean, T + sink] },
      { p: [kopf], k: 0, anker: [lean, T] },
      { p: [tuch], k: 1, anker: [lean, T] },
      { p: schale, k: 0 },
      { p: wasser, k: 0, noRim: true },
      { p: armRe, k: 1 },
      { p: [stiel], k: 0 },
      { p: kopfK, k: 0.5 },
      { p: armLi, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Wasser, das über die Lippe läuft: Fäden bis zum Boden (Lichtfarbe innen), Pfütze
      const faeden = v.schale === 'rund' ? [cx - B + 5, cx + B - 7, cx + B - 16] : [cx - B + 3, cx + 12, cx + B - 3];
      faeden.forEach((x, i) => {
        const y0 = ly + (i % 2 ? 9 : 5), ph = p.idle ? f : 0;
        for (let y = y0; y < 113; y++) { const g = (y + ph * 2 + i * 3) % 9; if (g === 4 || g === 7) continue; P.set(x + (y > 108 ? (i % 2 ? 1 : -1) : 0), y, g === 0 ? 'r2' : g === 5 ? 'k3' : 'r1'); }
      });
      faeden.forEach((x, i) => { for (let k = -2; k <= 2; k++) if (k) P.set(x + k + (i % 2 ? 1 : -1), 114, Math.abs(k) === 2 ? 'k3' : 'r1'); });
      // Wasserlinie um den Rumpf: der Körper geht unter der Oberfläche weiter
      for (let x = r(bx - 9); x <= r(bx + 9); x++) P.auf(x, ly - 1, (x + f) % 2 ? 'r1' : 'r2');
      for (let x = r(bx + 10); x <= r(bx + 16); x++) P.auf(x, ly - 1, 'r1');
      // Muschelrippen (b)
      if (v.schale === 'muschel') for (let k = -3; k <= 3; k++) P.line(cx + k * 6, ly + 1, cx + k * 2.5, ly + 10, 'k1', true);
      // Tropfen aus der Kelle
      if (!P0.aus) { for (let k = 0; k < 3; k++) P.set(ke[0] + (k % 2), ke[1] + 4 + k * 3 + (p.idle ? f % 2 : 0), k === 0 ? 'r2' : 'r1'); }
      // Gesicht: Augen tief unter der Stirn, Mund, aus dem Wasser rinnt
      if (!P0.aus) {
        P.auge(hx - 3, hy, 2); P.set(hx + 1, hy - 1, 'glut'); P.set(hx + 2, hy - 1, 'glutDim');
        augen.push([r(hx - 3), r(hy)], [r(hx + 1), r(hy - 1)]);
      }
      P.auf(hx - 4, hy - 2, 'k0'); P.auf(hx - 3, hy - 2, 'k0'); P.auf(hx - 2, hy - 2, 'k0');
      for (let k = 0; k < 2; k++) P.auf(hx - 2 + k, hy + 5, 'k0');
    };
    return { gruppen, details, augen };
  },
};
