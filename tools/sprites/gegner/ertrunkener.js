// Ertrunkener (Kapelle, Neubau Auftrag 2, M5). Er ist an Land, aber für ihn ist noch Wasser:
// Der kahle Kopf hängt vor der Brust, die Arme treiben wie an Fäden, der Saum der Kutte hebt sich ungleich,
// die nackten Füße hängen schlaff über dem Boden. Aus dem Mund steigen Blasen, von den Zehen tropft es ohne Ende.
// Silhouette: eine schwebende Kutte wie eine Marionette, der Kopf tief vor der Brust, Unterarme und Beine hängen schlaff.
'use strict';
module.exports = {
  id: 'ertrunkener', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [48, 115], kopf: [44, 14], rimBis: 116,
  varianten: {
    ertrunkener_a: { hand: 'treibt', kutte: 1 },
    ertrunkener_b: { hand: 'hoch', kutte: 0.9, kapuze: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A; const f = p.f;
    let bob = 0, lean = 0, welle = 0, griff = 0, fall = 0, aus = false, sack = 0;
    if (p.idle) { bob = [0, 0, -1, -1][f]; welle = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, -1, -8, -3][f]; griff = [0.2, -0.4, 1, 0.5][f]; bob = [-1, -2, 0, 0][f]; welle = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [3, 2][f]; bob = [-1, 0][f]; }
    if (p.tod) { fall = r(p.q * 14); aus = f >= 1; sack = p.q; lean = r(p.q * 2); }
    const Y = bob + fall, cx = 48 + lean, K = v.kutte;
    // Rumpf: schmal, Schultern hängen
    const rumpf = Pg([[cx - 4, 40 + Y], [cx + 4, 37 + Y], [cx + 10, 41 + Y], [cx + 12, 48 + Y], [cx + 10, 58 + Y], [cx + 8, 70 + Y], [cx - 8, 70 + Y], [cx - 9, 57 + Y], [cx - 9, 46 + Y]], null, { rd: 2.5 });
    // Kutte: fällt bis über die Knie, der Saum hebt sich ungleich, als triebe er im Wasser
    const aufb = (1 - sack) * K, wy = 70 + Y, sy = 88 + Y;
    const glocke = Pg([[cx - 9, wy - 4], [cx + 9, wy - 4], [cx + 11, sy - 8], [cx + 17 * aufb + 3, sy - 4 - 5 * aufb - welle], [cx + 21 * aufb + 1, sy - 9 * aufb - welle], [cx + 15, sy + 3 + r(sack * 6)], [cx + 9, sy + 1], [cx + 4, sy + 5 + r(sack * 6)], [cx - 2, sy + 2], [cx - 8, sy + 4 + r(sack * 6)], [cx - 12, sy - 1], [cx - 17 * aufb - 2, sy - 7 * aufb + welle], [cx - 23 * aufb - 2, sy - 16 * aufb + welle], [cx - 15 * aufb - 2, sy - 13 * aufb], [cx - 11, sy - 10]], null, { rd: 1.2 });
    const falten = [C(cx - 3, wy - 2, cx - 6, sy + 1, 0.7, 1.2, 'dunkel'), C(cx + 4, wy - 2, cx + 8, sy, 0.7, 1.2, 'dunkel'), C(cx - 8, sy - 10, cx - 18 * aufb, sy - 13 * aufb, 0.6, 1, 'dunkel')];
    // Beine: dünn, hängen schlaff, Zehen zeigen nach unten
    const by = sy - 2, fy = 108 + Math.min(fall, 4);
    const beine = [...glied([[cx - 4, by], [cx - 5, by + 9], [cx - 3, fy - 2], [cx - 2, fy + 2]], 2.4, 1.1, null), ...glied([[cx + 4, by], [cx + 6, by + 8], [cx + 7, fy - 4], [cx + 8, fy]], 2.3, 1.1, null)];
    // Kopf: kahl, hängt tief vor der Brust; man sieht mehr Schädel als Gesicht
    const kx = cx - 15 + r(griff * 3), ky = 45 + Y + r(sack * 4) - r(griff * 2);
    const hals = C(cx - 4, 40 + Y, kx + 3, ky - 5, 2.8, 2.3, 'haut');
    const kopf = E(kx, ky, 7, 7.5, 'haut', { pf: 'bevel' });
    const kapuze = v.kapuze ? [Pg([[cx - 2, 41 + Y], [cx + 8, 38 + Y], [cx + 12, 30 + Y - welle], [cx + 9, 20 + Y - welle], [cx + 5, 26 + Y], [cx + 1, 33 + Y]], null, { rd: 1.2 })] : [];
        // Arme: Oberarme treiben auf Schulterhöhe nach außen, Unterarme hängen wie an Fäden
    const vor = griff > 0 ? griff : 0, weit = griff < 0 ? -griff : 0;
    const ellL = [cx - 19 - weit * 4 - vor * 6, 63 + Y - weit * 6 - vor * 4], handL = [cx - 25 - vor * 10 - weit * 2, 77 + Y - vor * 14 - weit * 6];
    const armL = glied([[cx - 8, 50 + Y], ellL, handL], 2.8, 1.6, null);
    const fingerL = glied([handL, [handL[0] - 1, handL[1] + 4], [handL[0] + 1, handL[1] + 7]], 1.2, 0.6, null);
    const aermelL = Pg([[cx - 9, 46 + Y], [ellL[0] + 2, ellL[1] + 4], [ellL[0] - 2, ellL[1] + 9 + welle], [ellL[0] - 3, ellL[1] + 2], [cx - 8, 40 + Y]], null, { rd: 1 });
    const hoch = v.hand === 'hoch' && !p.angriff && !p.tod;
    const ellR = hoch ? [cx + 15, 30 + Y] : [cx + 20 + weit * 4, 53 + Y - weit * 6], handR = hoch ? [cx + 15 + welle, 14 + Y] : [cx + 23 - vor * 10, 68 + Y - vor * 8 - weit * 6];
    const armR = glied([[cx + 8, 43 + Y], ellR, handR], 2.6, 1.5, null);
    const fingerR = hoch ? glied([handR, [handR[0] + 1, handR[1] - 5], [handR[0], handR[1] - 8]], 1.1, 0.6, null) : glied([handR, [handR[0] + 1, handR[1] + 4], [handR[0] - 1, handR[1] + 7]], 1.1, 0.6, null);
    const gruppen = [
      { p: [...armR, ...fingerR], k: 1 },
      { p: kapuze, k: 1 },
      { p: beine, k: 1 },
      { p: [glocke], k: 0, anker: [0, Y] },
      { p: falten, k: 0, noRim: true, anker: [0, Y] },
      { p: [rumpf], k: 2, anker: [0, Y] },
      { p: [hals, kopf], k: 1.5, anker: [0, Y] },
      { p: [...armL, ...fingerL], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Kordel um die Hüfte, Knoten vorn links, die Enden treiben nach oben; Knopfleiste der Soutane
      const gy = r(wy - 3);
      for (let x = r(cx - 9); x <= r(cx + 9); x++) { P.auf(x, gy, 'k0'); P.auf(x, gy - 1, x > cx + 3 ? 'r1' : 'k3'); }
      P.auf(r(cx - 4), gy, 'k3'); P.auf(r(cx - 3), gy - 1, 'k3');
      for (let k = 1; k <= 6; k++) { P.set(r(cx - 4 - k * 0.6 + (k > 3 ? welle * 0.5 : 0)), gy - k * 1.2 - 1, k % 2 ? 'k2' : 'k3'); P.set(r(cx - 2 + k * 0.3), gy - k - 1, 'k2'); }
      for (let y = r(42 + Y); y < gy - 2; y += 3) P.auf(r(cx + 1), y, 'k3');
      // Kiemenschlitze am Hals
      for (let i = 0; i < 3; i++) { P.auf(r(kx + 3), r(ky + 5 + i * 2), 'k0'); P.auf(r(kx + 4), r(ky + 5 + i * 2), 'r1'); }
      // Mund: offen, ein dunkler Spalt
      P.auf(r(kx - 3), r(ky + 5), 'k0'); P.auf(r(kx - 2), r(ky + 5), 'k0'); if (p.angriff && f === 2) { P.auf(r(kx - 3), r(ky + 6), 'k0'); P.auf(r(kx - 2), r(ky + 6), 'k0'); }
      // Blasen steigen aus dem Mund nach oben
      if (!p.tod || f < 3) for (let i = 0; i < 4; i++) { const t = ((i * 5 + (p.idle ? f * 2 : f * 3)) % 20); const bx = r(kx - 3 + Math.sin(t * 0.7 + i) * 1.5), byy = r(ky + 1 - t * 1.4); if (byy < 2 || P.get(bx, byy)) continue; P.set(bx, byy, i % 2 ? 'r1' : 'k3'); if (i === 1) P.set(bx + 1, byy - 1, 'k3'); }
      // halb geschlossene Augen, gesenkt
      if (!aus) { P.set(r(kx - 5), r(ky + 2), 'glut'); P.set(r(kx - 1), r(ky + 2), 'kern'); P.glow(kx - 3, ky + 2.5, 4.5, 0.6); augen.push([r(kx - 5), r(ky + 2)], [r(kx - 1), r(ky + 2)]); }
      // Wasser tropft von den Zehen und vom Saum, ohne Ende
      if (!p.tod || f < 4) {
        const tr = [[r(cx - 3), r(fy + 3)], [r(cx + 8), r(fy + 1)]];
        tr.forEach(([x, y0], i) => { for (let y = y0; y < 114; y++) { const ph = (y + f * 2 + i * 3) % 5; if (ph === 0) P.set(x, y, 'r1'); else if (ph === 1) P.set(x, y, 'k3'); } });
        for (let x = r(cx - 9); x <= r(cx + 12); x++) if ((x + f) % 3) P.set(x, 115, x % 2 ? 'k3' : 'k2');
        for (const x of [r(cx - 8), r(cx + 15)]) { const y0 = sy + 4 + r(sack * 6); for (let k = 0; k < 3; k++) if ((k + f) % 3 === 0) P.set(x, y0 + 2 + k * 3, 'r1'); }
      }
    };
    return { gruppen, details, augen };
  },
};
