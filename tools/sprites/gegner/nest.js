// Das Nest (Moorwald). Liest sich als Erdhügel mit Gras, bis acht kantige Insektenbeine
// aufstehen und vorne eine Reihe menschlicher Zähne erscheint. Augen blinzeln nacheinander.
'use strict';
module.exports = {
  id: 'nest', biom: 'moor', zone: 'moor_gruen', w: 96, h: 120, fuss: [48, 115], kopf: [48, 58],
  varianten: {
    nest_a: { beine: 4, breit: 24, hoch: 13, zaehne: 9 },
    nest_b: { beine: 5, breit: 21, hoch: 15, zaehne: 7, zone: 'moor' },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 8 }), f = p.f;
    // aufstehen: im Leerlauf liegt es fast flach; im Angriff hebt es sich auf die Beine
    const auf = p.idle ? 0 : p.angriff ? [4, 12, 14, 6][f] : p.treffer ? 6 : p.tod ? -r(p.q * 6) : 0;
    const lean = P0.lean, cx = 48 + lean, by = 98 - auf + P0.fall, Bw = v.breit, Bh = v.hoch;
    const huegel = E(cx, by, Bw, Bh, null, { pf: 'bevel' });
    const grund = Pg([[cx - Bw - 2, by + 2], [cx + Bw + 2, by + 2], [cx + Bw - 2, by + 8], [cx - Bw + 2, by + 8]], 'dunkel', { rd: 2 });
    // Gras und Wurzeln oben: dünne Halme
    const halme = [];
    for (let i = 0; i < 7; i++) { const x = cx - Bw + 8 + i * (2 * Bw - 14) / 6; const h = 4 + ((i * 5) % 4) + (i === 3 ? 3 : 0); const kipp = (i % 2 ? 1 : -1) * (p.idle ? [0, 1, 0, -1][f] : 0); halme.push(C(x, by - Bh + 3 + Math.abs(i - 3) * 1.2, x + kipp + (i - 3) * 0.6, by - Bh - h + Math.abs(i - 3) * 1.2, 0.8, 0.5, null)); }
    // Beine: Knie hoch über dem Körper, Füße weit außen
    const beine = [], hinten = [];
    for (let i = 0; i < v.beine; i++) {
      for (const s of [-1, 1]) {
        const q = i / (v.beine - 1), hx = cx + s * (Bw * 0.3 + q * Bw * 0.5), hy = by + 2;
        const kx = cx + s * (Bw * 0.8 + q * 10 + 4), ky = by - Bh * 0.6 - auf * 0.3 - (i % 2) * 3 + (p.tod ? r(p.q * 10) : 0);
        const fx = cx + s * (Bw * 0.95 + q * 16 + 4), fy = 114;
        (i % 2 ? hinten : beine).push(...glied([[hx, hy], [kx, ky], [fx, fy]], 1.6, 0.7, null));
      }
    }
    const gruppen = [
      { p: hinten, k: 0 },
      { p: [huegel, grund], k: 3 },
      { p: halme, k: 0 },
      { p: beine, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Zahnreihe: menschliche Zähne, Kontaktschatten darüber
      const offen = p.angriff ? [1, 2, 3, 1][f] : p.treffer ? 1 : 0;
      const zy = r(by + 3), n = v.zaehne;
      for (let i = 0; i < n; i++) { const x = r(cx - n + i * 2); P.auf(x, zy - 1, 'k0'); P.auf(x + 1, zy - 1, 'k0'); P.auf(x, zy, 'r1'); P.auf(x, zy + 1 + offen, 'k3'); for (let k = 1; k <= offen; k++) P.auf(x + 1, zy + k, 'k0'); }
      // Augenreihe: blinzeln nacheinander
      const za = 5;
      for (let i = 0; i < za; i++) {
        const x = r(cx - 8 + i * 4), y = r(by - 3 - Math.abs(i - 2));
        const zu = P0.aus || (p.idle && i === f) || (p.idle && i === f + 1 && f === 3);
        if (zu) { P.auf(x, y, 'k0'); continue; }
        P.auf(x, y, i === 2 ? 'kern' : 'glut'); P.glow(x + 0.5, y + 0.5, 3, 0.7); augen.push([x, y]);
      }
    };
    return { gruppen, details, augen };
  },
};
