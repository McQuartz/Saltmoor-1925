// Wächter Namenlose Stadt: Der Wind, der Gestalt hat (Neubau Auftrag 2, M0).
// Der Atem aus dem Abgrund hat sich aus den Binden der Erbauer einen Leib gewickelt und trägt die
// Totenmaske ihres Baumeisters. Der Leib ist hohl: man sieht durch die Rippen aus Binden hindurch.
// Unten gibt es keine Beine, nur einen gedrehten Stiel, der aus dem Spalt im Boden kommt.
// Lose Bindenenden wehen nach oben, denn hier weht der Wind aus der Tiefe.
// Kampf: Er atmet ein (der Brustkorb wird weit), dann aus (die Maske reißt den Mund auf, alles weht nach links).
'use strict';
module.exports = {
  id: 'windgestalt', biom: 'stadt', zone: 'stadt', rang: 'waechter', w: 128, h: 160, fuss: [64, 155], kopf: [60, 6], rimBis: 156,
  varianten: { windgestalt: {} },
  anim: { idle: { n: 4, fps: 5, loop: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, chain, glied } = A; const f = p.f;
    let atem = 0, lean = 0, weh = 0, fall = 0, wind = 0, mund = 0, arm = 0, hebe = 0, nick = 0, aus = false, sinkArm = 0;
    if (p.idle) { atem = [0, 1, 1, 0][f]; weh = [0, 0.5, 1, 0.5][f]; nick = [0, 0, 1, 1][f]; }
    if (p.angriff) { atem = [3, 2, -1, 0][f]; lean = [2, -2, -7, -3][f]; wind = [0.2, -0.4, -1.1, -0.5][f]; mund = [0, 1, 3, 1][f]; arm = [-0.4, 0.3, 1, 0.4][f]; hebe = [-2, 0, 1, 0][f]; weh = f; }
    if (p.treffer) { lean = [4, 2][f]; wind = [0.5, 0.3][f]; nick = -1; atem = -1; }
    if (p.tod) { fall = r(p.q * 34); aus = f >= 1; lean = r(p.q * 3); wind = p.q * 0.6; sinkArm = p.q; atem = -r(p.q * 3); }
    const cx = 64 + lean, sy = 64 + fall + hebe;
    // Stiel: dreht sich aus dem Spalt im Boden nach oben, wird zur Hüfte breiter
    const stiel = []; let px = 64, py = 155;
    for (let i = 1; i <= 9; i++) { const t = i / 9, nx = 64 + Math.sin(t * 5.2 + weh * 0.5) * 3.5 * (1 - t) + (lean + 1) * t, ny = 155 - t * (48 - fall * 0.6); stiel.push(C(px, py, nx, ny, 1.6 + (t - 1 / 9) * 8.5, 1.6 + t * 8.5, null)); px = nx; py = ny; }
    const hx = px, hy = py; // Hüfte
    // hohler Brustkorb: Rippen aus Binden, Rückgrat, Schulterjoch
    const rippen = [];
    for (let i = 0; i < 5; i++) { const y = sy + 9 + i * 7.5, w = 24 - i * 3.6 + atem * (1 - i * 0.15); const d = 3 + i * 0.4; rippen.push(C(cx - w, y + d, cx - 1, y, 2.1, 2.5, null), C(cx + 1, y, cx + w, y + d, 2.5, 2.1, null)); }
    const ruecken = C(cx, sy + 2, hx, hy, 3.6, 4.6, null);
    const joch = [C(cx - 24, sy + 5, cx + 24, sy + 3, 4.5, 4.5, null), E(cx - 25, sy + 5, 7, 5.5, null), E(cx + 25, sy + 3, 7, 5.5, null)];
    // Umhang: Bindenlappen über den Schultern, Enden zeigen nach oben außen
    const lappen = [Pg([[cx - 13, sy - 4], [cx - 33, sy - 6 - r(weh)], [cx - 38, sy + 3], [cx - 35, sy + 8], [cx - 38, sy + 16], [cx - 32, sy + 12], [cx - 30, sy + 21], [cx - 25, sy + 12], [cx - 20, sy + 15], [cx - 14, sy + 8]], null, { rd: 0.8 }),
      Pg([[cx + 13, sy - 5], [cx + 32, sy - 9 - r(weh)], [cx + 38, sy + 1], [cx + 36, sy + 8], [cx + 39, sy + 15], [cx + 33, sy + 12], [cx + 30, sy + 19], [cx + 26, sy + 11], [cx + 20, sy + 14], [cx + 14, sy + 8]], null, { rd: 0.8 })];
    const haufen = [E(64, 154, 12, 2.6, 'dunkel'), E(58, 153, 5, 2.4, null)];
    // Arme: bandagiert, lang, drei Krallen. Vorderer Arm (links) stößt beim Ausatmen nach vorn
    const ellL = [cx - 38 - arm * 8, sy + 26 - arm * 6 + sinkArm * 10], handL = [cx - 33 - arm * 22, sy + 50 - arm * 16 + sinkArm * 14];
    const armL = glied([[cx - 27, sy + 6], ellL, handL], 5, 2.8, null);
    const kr = (dx, dy) => glied([handL, [handL[0] + dx * 0.6, handL[1] + dy * 0.6], [handL[0] + dx, handL[1] + dy]], 1.8, 0.7, null);
    const krallenL = arm > 0.6 ? [kr(-12, -2), kr(-11, 4), kr(-7, 9)] : [kr(-7, 9), kr(-1, 12), kr(4, 11)];
    const handR = [cx + 42 + arm * 3, sy + 50 + sinkArm * 12];
    const armR = glied([[cx + 27, sy + 5], [cx + 41, sy + 25], handR], 4.6, 2.6, null);
    const krallenR = [glied([handR, [handR[0] - 2, handR[1] + 7], [handR[0] - 5, handR[1] + 12]], 1.4, 0.6, null), glied([handR, [handR[0] + 2, handR[1] + 7], [handR[0] + 1, handR[1] + 13]], 1.4, 0.6, null)];
    // Kopf: Haube aus Binden, davor die lange Totenmaske des Baumeisters
    const mx = cx - 4, my = sy - 24 + nick + r(fall * 0.2);
    const hals = C(cx, sy + 2, mx + 2, my + 10, 6, 5, null);
    const haube = E(mx + 5, my - 2, 15, 16, null);
    // Haarbusch aus Binden: eine breite Fahne, die von der Haube nach oben rechts weht
    const bw = wind * 14, bf = r(weh);
    const busch = Pg([[mx - 6, my - 12], [mx - 2 + bw * 0.3, my - 24], [mx + 6 + bw * 0.7, my - 31 - bf], [mx + 12 + bw, my - 36], [mx + 15 + bw, my - 29 + bf], [mx + 22 + bw * 0.8, my - 30], [mx + 21 + bw * 0.6, my - 20 - bf], [mx + 26 + bw * 0.4, my - 16], [mx + 19, my - 6], [mx + 10, my - 2]], null, { rd: 1.5 });
    const maske = Pg([[mx - 12, my - 12], [mx + 9, my - 14], [mx + 13, my + 1], [mx + 6, my + 21 + mund], [mx - 2, my + 23 + mund], [mx - 13, my + 4]], 'haut', { rd: 1.5 });
    // lose Bindenenden: wehen nach oben (aus der Tiefe), beim Ausatmen nach links
    const W = -Math.PI / 2;
    const quellen = [[cx + 34, sy - 5, 0.55, 5, 4.5], [cx - 35, sy - 2, -0.4, 4, 4.5], [ellL[0] - 2, ellL[1], -0.6, 4, 4], [cx + 41, sy + 25, 0.5, 4, 4]];
    const baender = [];
    quellen.forEach(([x, y, a, n, len], i) => baender.push(...chain(x, y, W + a + wind, n, len, 2.6, 0.8, null, q => Math.sin(q * 4 + weh * 0.6 + i * 1.7) * 0.16 + wind * 0.08)));
    const gruppen = [
      { p: [...armR, ...krallenR.flat()], k: 1 },
      { p: baender, k: 0 },
      { p: haufen, k: 2 },
      { p: stiel, k: 3, anker: [0, 0] },
      { p: [ruecken, ...joch, ...rippen], k: 1.5, anker: [lean, sy - 50] },
      { p: lappen, k: 1 },
      { p: [busch], k: 1 },
      { p: [hals, haube], k: 2 },
      { p: [maske], k: 0, anker: [mx, my] },
      { p: [...armL, ...krallenL.flat()], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Wicklung: schräge dunkle Linien über Stiel, Arme und Joch
      for (let y = r(hy) + 4; y < 150; y += 4) P.line(r(64 - 6), y + 2, r(64 + 7), y - 2, 'k0', true);
      for (let k = 0; k < 4; k++) { const t = 0.2 + k * 0.2; P.line(r(cx - 27 + (ellL[0] - cx + 27) * t) - 2, r(sy + 6 + (ellL[1] - sy - 6) * t), r(cx - 27 + (ellL[0] - cx + 27) * t) + 2, r(sy + 6 + (ellL[1] - sy - 6) * t) - 2, 'k0', true); }
      // Relief der Maske: eingeritzte Stirnlinien, Wangenkerben
      P.line(mx - 7, my - 7, mx + 6, my - 9, 'k1', true); P.line(mx - 6, my - 4, mx + 6, my - 6, 'k1', true);
      P.line(mx - 8, my + 6, mx - 6, my + 12, 'k1', true); P.line(mx + 8, my + 4, mx + 5, my + 11, 'k1', true);
      // Mund: senkrechter Spalt, beim Ausatmen weit offen
      for (let k = 0; k <= mund; k++) P.line(mx - 1 + k - (mund >> 1), my + 8, mx - 1 + k - (mund >> 1), my + 14 + mund, 'k0', true);
      // Sand steigt nach oben (im Angriff weht er nach links)
      for (let i = 0; i < 14; i++) {
        const sx = 22 + ((i * 41) % 86), base = 40 - ((i * 17 + (p.idle ? f * 3 : f * 6)) % 38);
        const x = r(sx + wind * (40 - base) * 0.9), y = r(base + 6);
        if (P.get(x, y)) continue; P.set(x, y, i % 4 ? 'k3' : 'r1');
      }
      if (!aus) {
        P.auge(mx - 5, my + 1, 2); P.auge(mx + 3, my, 2); augen.push([r(mx - 5), r(my + 1)], [r(mx + 3), r(my)]);
        if (p.angriff && f === 2) { P.set(mx - 1, my + 15, 'glut'); P.set(mx, my + 16, 'glutDim'); }
      }
    };
    return { gruppen, details, augen };
  },
};
