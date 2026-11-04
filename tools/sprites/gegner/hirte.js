// Der Hirte aus dem Nebel (Moorwald, Favorit). Hoher Mantel, Geweih mit leuchtenden Knoten,
// ein Gesicht aus Lichtpunkten (wie ein Sternbild), Finger so lang wie ein Hirtenstab.
'use strict';
module.exports = {
  id: 'hirte', biom: 'moor', zone: 'moor', w: 96, h: 120, fuss: [48, 116], kopf: [48, 4], rimBis: 112,
  varianten: {
    hirte_a: { finger: 2, fingerLen: 42, geweih: 1, stab: false, schulter: 13 },
    hirte_b: { finger: 3, fingerLen: 30, geweih: 0.85, stab: true, schulter: 11, lang: 2 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, saum, glied } = A;
    const f = p.f, L = v.lang || 0;
    let lean = 0, nick = 0, hem = 0, atem = 0, armA = 0, armX = 0, knotenAn = [1, 1, 1, 1, 1, 1], gesicht = 1, fall = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; hem = [0, 1, 1, 0][f]; nick = [0, 0, 0, 1][f]; knotenAn = [[1, 1, 1, 1, 1, 1], [1, 0, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1], [1, 1, 1, 1, 1, 0]][f]; }
    if (p.angriff) { lean = [1, -1, -3, -1][f]; armA = [-0.5, -0.2, 0.75, 0.3][f]; armX = [1, -1, -8, -3][f]; gesicht = [1, 1.4, 1.6, 1.1][f]; nick = [-1, 0, 1, 0][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; nick = [-1, 0][f]; gesicht = 0.6; armA = -0.15; }
    if (p.tod) { fall = r(p.q * 26); gesicht = f < 2 ? 0.6 : 0; knotenAn = knotenAn.map((_, i) => (i < 6 - f * 2 ? 1 : 0)); lean = r(p.q * 3); }
    const cx = 48, S = v.schulter, top = 46 - L + atem + fall;
    const ox = lean; // Oberkörper-Neigung (Saum bleibt stehen)
    // Mantel: Schultern rund, fällt fast senkrecht, zerfetzter Saum
    const mantel = Pg([[cx - S + 4 + ox, top], [cx + S - 4 + ox, top], [cx + S + ox, top + 5], [cx + S + 2 + r(ox / 2), top + 30 - fall / 2], [cx + S + 5, 104], ...saum(cx + S + 5, cx - S - 6, 112, 8, 5, 7, hem), [cx - S - 5, 100], [cx - S - 1 + r(ox / 2), top + 24 - fall / 2], [cx - S + ox, top + 6]], null, { rd: 0.8 });
    const schultern = E(cx + ox, top + 4, S + 1, 5, null, { pf: 'dome' });
    const falte1 = C(cx - 3 + ox, top + 12, cx - 5, 108, 1, 1.6, 'dunkel'), falte2 = C(cx + 5 + ox, top + 14, cx + 7, 106, 0.8, 1.4, 'dunkel');
    // Kopf: Drachenform, Spitze nach unten; Hals dünn
    const hx0 = cx - 1 + ox + nick, hy = 22 - L + fall + atem;
    const hals = C(cx + ox, top + 1, hx0 - 1, hy + 18, 1.6, 1.3, null);
    const kopf = Pg([[hx0 - 7, hy + 2], [hx0 + 6, hy], [hx0 + 5, hy + 9], [hx0 - 1, hy + 20], [hx0 - 6, hy + 10]], 'haut', { rd: 1 });
    // Geweih: zwei Äste mit Verzweigungen, dünn
    const g = v.geweih, gx = hx0, gy = hy + 1;
    const ast = (x0, y0, pts) => glied([[x0, y0], ...pts.map(([a, b]) => [x0 + a * g, y0 + b * g])], 1.1, 0.6, null);
    const links = ast(gx - 3, gy, [[-4, -7], [-10, -12], [-15, -16]]);
    const links2 = glied([[gx - 3 - 4 * g, gy - 7 * g], [gx - 3 - 3 * g, gy - 15 * g]], 0.8, 0.55, null);
    const links3 = glied([[gx - 3 - 10 * g, gy - 12 * g], [gx - 3 - 9 * g, gy - 19 * g]], 0.7, 0.5, null);
    const rechts = ast(gx + 3, gy, [[4, -6], [11, -11], [16, -15]]);
    const rechts2 = glied([[gx + 3 + 4 * g, gy - 6 * g], [gx + 3 + 6 * g, gy - 15 * g]], 0.8, 0.55, null);
    const rechts3 = glied([[gx + 3 + 11 * g, gy - 11 * g], [gx + 3 + 17 * g, gy - 10 * g]], 0.7, 0.5, null);
    const knoten = [[gx - 3 - 15 * g, gy - 16 * g], [gx - 3 - 3 * g, gy - 15 * g], [gx - 3 - 9 * g, gy - 19 * g], [gx + 3 + 16 * g, gy - 15 * g], [gx + 3 + 6 * g, gy - 15 * g], [gx + 3 + 17 * g, gy - 10 * g]];
    // Arm rechts: Hand tritt unter dem Mantel hervor, die Finger hängen bis zu den Knien
    const hand = [cx + S + 3 + ox + armX, top + 13 + (fall ? -fall / 3 : 0)];
    const arm = [];
    if (!p.tod || f < 3) {
      arm.push(C(cx + S - 2 + ox, top + 6, hand[0], hand[1], 2.2, 1.6, null));
      for (let i = 0; i < v.finger; i++) {
        const a0 = -Math.PI / 2 - 0.5 + i * 0.25 + armA * 0.2; // erstes Glied nach oben (Knick)
        const k1 = [hand[0] + Math.cos(a0) * 5 + i * 4, hand[1] + Math.sin(a0) * 5];
        const a1 = Math.PI / 2 - 0.05 - i * 0.12 + armA;
        const k2 = [k1[0] + Math.cos(a1) * v.fingerLen, k1[1] + Math.sin(a1) * v.fingerLen];
        arm.push(...glied([[hand[0] + i, hand[1]], k1, k2], 1.15, 0.7, null));
      }
    }
    const stab = v.stab ? [C(cx - S - 6 + ox * 0.5, top - 18, cx - S - 6, 113, 0.7, 0.8, 'dunkel', { pf: 'flat', noRim: true }), ...glied([[cx - S - 6 + ox * 0.5, top - 18], [cx - S - 4 + ox * 0.5, top - 24], [cx - S, top - 25], [cx - S + 2, top - 21]], 1, 0.8, 'dunkel')] : [];
    const stabHand = v.stab ? [E(cx - S - 5 + ox * 0.5, top + 10, 2.5, 2, null)] : [];
    const gruppen = [
      { p: stab, k: 0, pf: 'flat' },
      { p: [links, links2, links3, rechts, rechts2, rechts3].flat(), k: 0.5 },
      { p: [hals], k: 0 },
      { p: [mantel, schultern], k: 3 },
      { p: [falte1, falte2], k: 0, noRim: true },
      { p: [kopf], k: 0, pf: 'bevel' },
      { p: stabHand, k: 0 },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Gesicht aus Lichtpunkten: ein kleines Sternbild in der Kopfmitte
      const fx = r(hx0 - 1), fy = r(hy + 8);
      if (gesicht > 0) {
        P.glow(fx + 0.5, fy + 0.5, 8 * gesicht, 1, 'glutDim', 'k3');
        const pts = [[0, 0, 'kern'], [-2, -1, 'glut'], [2, -1, 'glut'], [-1, -3, 'glut'], [1, -3, 'glutDim'], [-1, 2, 'glut'], [1, 2, 'glutDim'], [0, 4, 'glut'], [0, -2, 'glutDim'], [-3, 1, 'glutDim'], [2, 1, 'glutDim'], [0, -5, 'glutDim'], [2, -4, 'glut']];
        pts.slice(0, gesicht > 1.3 ? 13 : gesicht < 0.8 ? 5 : 11).forEach(([a, b, c], i) => { if (p.idle && f === 2 && i === 5) return; P.set(fx + a, fy + b, c); });
        augen.push([fx, fy]);
      }
      knoten.forEach(([x, y], i) => {
        if (!knotenAn[i]) { P.auf(x, y, 'k3'); return; }
        const X = r(x), Y = r(y);
        P.set(X, Y, (p.angriff && f === 2) || i % 3 === 0 ? 'kern' : 'glut');
        P.set(X + 1, Y, 'glut'); P.set(X - 1, Y, 'glutDim'); P.set(X, Y - 1, 'glutDim');
        if (i % 2 === 0) { P.set(X, Y + 1, 'glutDim'); P.set(X + 1, Y - 1, 'glutDim'); }
        augen.push([r(x), r(y)]);
      });
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
