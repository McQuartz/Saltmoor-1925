// Der Leser (Kloster der Abschrift). Der Lektor des Refektoriums, der anfing, anderen über die Schulter zu lesen.
// Aus der Kapuze ragt ein Hals so lang wie ein Arm, waagerecht nach vorn; am Ende ein kleiner Kopf mit zwei
// Lesesteinen statt Augen, hinter dem Glas brennt es. Er hält ein offenes Buch, aber er liest nicht darin.
'use strict';
module.exports = {
  id: 'leser', biom: 'kloster', zone: 'kloster', w: 96, h: 120, fuss: [60, 115], kopf: [30, 20], rimBis: 113,
  varianten: {
    // kopf: Ruhelage des Kopfs, bogen: Hals wölbt sich nach oben (Gänsehals), schulter: Höhe der Schultern
    leser_a: { kopf: [20, 42], bogen: 4, schulter: 40, buch: true, breit: 10 },
    leser_b: { kopf: [24, 50], bogen: 18, schulter: 44, buch: false, breit: 12 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let hdx = 0, hdy = 0, lean = 0, atem = 0, fall = 0, augenAn = true, mund = 0, zieh = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; hdx = [0, -1, -1, 0][f]; hdy = [0, 0, 1, 1][f]; }
    if (p.angriff) { hdx = [10, 16, -12, -4][f]; hdy = [-6, -10, 6, 2][f]; lean = [1, 2, -3, -1][f]; mund = [0, 1, 3, 1][f]; zieh = [0.3, 0.6, -0.2, 0][f]; }
    if (p.treffer) { hdx = [8, 4][f]; hdy = [-4, -2][f]; lean = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 10); hdy = r(p.q * 50); hdx = r(p.q * 10); augenAn = f < 1; }
    const T = atem + fall, S = v.schulter + T, cx = 60 + lean, b = v.breit;
    // Kutte: schmal, hoch, fällt fast senkrecht; Kapuze offen nach vorn
    const kutte = Pg([[cx - b + 3, S], [cx + b - 2, S - 1], [cx + b + 1, S + 8], [cx + b + 3, 96], [cx + b + 5, 108], ...saum(cx + b + 5, cx - b - 3, 113, 6, 3, 31, p.idle ? [0, 1, 1, 0][f] : 0), [cx - b - 3, 104], [cx - b, S + 20], [cx - b + 1, S + 6]], null, { rd: 1.2 });
    const kapuze = Pg([[cx - 7, S + 2], [cx - 9, S - 6], [cx - 4, S - 13], [cx + 4, S - 14], [cx + 9, S - 8], [cx + 9, S + 2]], null, { rd: 2 });
    const falten = [C(cx - 2, S + 12, cx - 4, 108, 0.8, 1.4, 'dunkel'), C(cx + 5, S + 10, cx + 7, 106, 0.8, 1.2, 'dunkel')];
    // Hals: Bezier aus der Kapuze zum Kopf, verjüngt; leichte Querfalten
    const h0 = [cx - 6, S - 7], hk = [v.kopf[0] + hdx + lean, v.kopf[1] + hdy + T];
    const ctl = [B => (h0[0] + hk[0]) / 2 + 4 + zieh * 10, (h0[1] + hk[1]) / 2 - v.bogen - zieh * 8];
    const ctlX = (h0[0] + hk[0]) / 2 + 4 + zieh * 10, ctlY = Math.min(h0[1], hk[1]) - v.bogen - zieh * 8 - (p.tod ? -p.q * 30 : 0);
    void ctl;
    const hals = []; const N = 9;
    for (let i = 0; i <= N; i++) { const t = i / N, u = 1 - t; hals.push([u * u * h0[0] + 2 * u * t * ctlX + t * t * hk[0], u * u * h0[1] + 2 * u * t * ctlY + t * t * hk[1]]); }
    const halsForm = glied(hals, 3.6, 2.4, null);
    // Kopf: klein, Stirn vorn, Kinn hängt; zwei Lesesteine
    const kopf = E(hk[0], hk[1], 7, 5.5, 'haut');
    const stirn = E(hk[0] + 2, hk[1] - 3, 5, 3.5, 'haut');
    const kiefer = Pg([[hk[0] - 6, hk[1] + 2], [hk[0] + 3, hk[1] + 3], [hk[0] - 4, hk[1] + 7 + mund]], 'haut', { rd: 0.8 });
    // Arme halten das Buch vor der Brust (a) oder hängen lang (b)
    const by = S + 22;
    const armL = glied([[cx - b + 3, S + 4], [cx - b - 2, S + 16], [cx - 8, by]], 2.0, 1.4, null);
    const armR = glied([[cx + b - 2, S + 4], [cx + b + 2, S + 18], [cx - 1, by + 1]], 2.0, 1.4, null);
    const buch = v.buch ? [Pg([[cx - 13, by - 1], [cx - 4, by + 2], [cx + 4, by - 1], [cx + 4, by + 4], [cx - 4, by + 7], [cx - 13, by + 4]], null, { rd: 0.5 })] : [];
    const armB = !v.buch ? glied([[cx - b + 3, S + 4], [cx - b - 4, S + 22], [cx - b - 2, S + 40]], 2.0, 1.2, null) : [];
    const fingerB = !v.buch ? [0, 1, 2].map(i => C(cx - b - 2, S + 40, cx - b - 4 + i * 2, S + 48 + (i % 2), 0.7, 0.5, 'haut')) : [];
    const gruppen = [
      { p: v.buch ? armR : [], k: 0 },
      { p: [kutte], k: 3, anker: [lean, T] },
      { p: falten, k: 0, noRim: true },
      { p: halsForm, k: 1.5 },
      { p: [kapuze], k: 1, anker: [lean, T] },
      { p: [kopf, stirn, kiefer], k: 1.5 },
      { p: buch, k: 0 },
      { p: v.buch ? armL : [...armB, ...fingerB], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Hals: Querfalten
      for (let i = 2; i < N - 1; i += 2) { const [x, y] = hals[i]; P.auf(r(x), r(y) + 1, 'k0'); P.auf(r(x), r(y) + 2, 'k1'); }
      // Lesesteine: Ring aus Glas (Randlicht), dahinter Glut
      const kx = r(hk[0]), ky = r(hk[1]);
      for (const ox of [-4, 2]) {
        const X = kx + ox, Y = ky;
        // Glasring
        for (let t = 0; t < 12; t++) { const a2 = t / 12 * 6.283; P.set(r(X + Math.cos(a2) * 2.3), r(Y + Math.sin(a2) * 2.3), Math.sin(a2) < -0.3 && Math.cos(a2) > -0.3 ? 'r2' : Math.sin(a2) > 0.4 ? 'k1' : 'r1'); }
        if (augenAn) {
          P.glow(X + 0.5, Y + 0.5, 5, 0.9);
          P.set(X, Y, 'kern'); P.set(X + 1, Y, 'glut'); P.set(X - 1, Y, 'glut'); P.set(X, Y + 1, 'glut'); P.set(X, Y - 1, 'glutDim'); P.set(X + 1, Y + 1, 'glutDim');
          augen.push([X, Y]);
        } else { P.set(X, Y, 'k0'); P.set(X + 1, Y, 'k1'); }
      }
      // Mund: offen beim Zuschnappen
      for (let k = 0; k < 1 + mund; k++) { P.auf(kx - 4, ky + 4 + k, 'k0'); P.auf(kx - 3, ky + 4 + k, 'k0'); }
      // Buch: Seiten hell an der Lichtkante, Zeilen
      if (v.buch) { for (let x = cx - 11; x <= cx + 2; x++) { if (x === cx - 4) continue; for (let y = by + 1; y <= by + 4; y++) if ((y + x) % 2 === 0) P.auf(x, y + (x < cx - 4 ? (x - cx + 13) / 4 : (cx + 4 - x) / 3) - 1, x > cx - 2 ? 'r1' : 'k3'); } P.auf(cx + 3, by, 'r2'); }
      // leere Kapuze: dunkle Öffnung, aus der der Hals kommt
      P.el(cx - 4.5 - 0, S - 6, 3, 5, 'k0', true);
      // Gürtelstrick
      P.line(cx - b + 1, S + 30, cx + b + 2, S + 29, 'k0', true);
      for (let k = 0; k < 6; k++) P.auf(cx - b + 3 + (p.idle ? [0, 1, 1, 0][f] : 0), S + 31 + k, k % 2 ? 'k0' : 'k3');
    };
    return { gruppen, details, augen };
  },
};
