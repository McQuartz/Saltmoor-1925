// Der Chorknabe (Kapelle, Favorit). Drei Köpfe auf einem Hals, eine Robe, ein Lied.
// Kerzen am Saum sind die einzige warme Lichtquelle.
'use strict';
module.exports = {
  id: 'chorknabe', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [48, 114], kopf: [48, 14], rimBis: 112,
  varianten: {
    // [dx, y, rx, ry] je Kopf, unten -> oben
    chorknabe_a: { koepfe: [[0, 57, 8, 6.5], [1, 45, 7.5, 6], [0, 33, 7, 6]], kerzen: [35, 42, 50, 57, 63], breit: 19 },
    chorknabe_b: { koepfe: [[-1, 58, 7.5, 6], [1, 47, 6.5, 5.5], [-1, 36, 8.5, 7]], kerzen: [37, 45, 54, 61], breit: 17, lang: 2 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, saum } = A;
    const f = p.f, L = v.lang || 0;
    let lean = 0, lift = [0, 0, 0], mund = [1, 1, 1], flamme = [1, 2, 1, 2, 1], kerzenAn = true, sinkTop = [0, 0, 0], kippX = [0, 0, 0], glut = 1;
    // Singen: die Köpfe heben sich nacheinander, der Mund geht mit
    if (p.idle) { lift = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]][f]; mund = [[2, 1, 1], [1, 2, 1], [1, 1, 2], [1, 1, 1]][f]; flamme = [[3, 2, 3, 2, 3], [2, 3, 3, 2, 2], [3, 3, 2, 3, 3], [2, 3, 2, 3, 2]][f]; glut = [1, 0.95, 1, 0.9][f]; }
    if (p.angriff) { lean = [1, -2, -4, -1][f]; lift = [[1, 1, 1], [0, 0, 0], [0, -1, -1], [0, 0, 0]][f]; mund = [[1, 1, 1], [2, 2, 2], [3, 3, 3], [2, 1, 1]][f]; flamme = [[1, 1, 1, 1, 1], [2, 2, 2, 2, 2], [3, 3, 3, 3, 3], [2, 1, 2, 1, 2]][f]; glut = [0.8, 1.1, 1.35, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; lift = [[-1, 0, 1], [0, 1, 0]][f]; mund = [[0, 0, 0], [1, 1, 1]][f]; glut = 0.7; }
    if (p.tod) { kerzenAn = f < 1; const q = p.q; sinkTop = [0, r(q * 4), r(q * 9)]; kippX = [0, r(q * 3), r(q * 8)]; mund = [0, 0, 0]; lean = r(q * 2); }
    const cx = 48, b = v.breit, yt = 61 - L;
    // Robe: Kegel vom Hals bis zum Boden; unterer Teil unter dem Kerzenkranz dunkler, zerfetzt
    const robe = Pg([[cx - 5 + lean * 0.5, yt], [cx + 5 + lean * 0.5, yt], [cx + 8, yt + 10], [cx + b - 4, 92], [cx + b - 2, 100], [cx - b + 2, 100], [cx - b + 4, 92], [cx - 8, yt + 10]], null, { rd: 1 });
    const unten = Pg([[cx - b + 2, 97], [cx + b - 2, 97], [cx + b + 1, 109], ...saum(cx + b, cx - b, 113, 6, 2, 3).map(([x, y]) => [x, y]), [cx - b - 1, 109]], 'dunkel', { rd: 0.5 });
    const koepfe = v.koepfe.map(([dx, y, rx, ry], i) => E(cx + dx + (i ? lean : r(lean / 2)) + kippX[i], y - L - lift[i] + sinkTop[i], rx, ry, null, { pf: 'dome' }));
    const hals = C(cx + r(lean / 2), 63 - L, cx + lean, 52 - L, 4, 3.5, null);
    const kerzen = kerzenAn ? v.kerzen.map((x, i) => C(x, 96 - (i % 2), x, 99, 1.0, 1.4, null, { pf: 'flat', noRim: true })) : [];
    const gruppen = [
      { p: [robe], k: 2, pf: 'bevel' },
      { p: [unten], k: 1, pf: 'bevel', tone: -0.1 },
      { p: [hals, koepfe[0]], k: 2 },
      { p: [koepfe[1]], k: 0 },
      { p: [koepfe[2]], k: 0 },
      { p: kerzen, k: 0 },
    ];
    const augen = [];
    const details = P => {
      if (kerzenAn) {
        // warmer Schein der Kerzen auf der Robe (links stärker, Licht fällt nach oben)
        P.glow(cx - 9, 80, 26 * glut, 0.75 * glut, 'glutDim', 'k3');
        P.glow(cx - 4, 94, 10 * glut, 0.7 * glut, 'r1', 'glutDim');
      }
      koepfe.forEach((k, i) => {
        const ex = r(k.x), ey = r(k.y), aus = p.tod && f >= 1;
        if (kerzenAn) P.glow(ex - 3, ey + 5, 9, 0.85 * glut, 'glutDim', 'k3'); // von unten beleuchtet
        P.set(ex - 3, ey - 1, aus ? 'k0' : 'glut'); P.set(ex + 2, ey - 1, aus ? 'k0' : 'glut');
        augen.push([ex - 3, ey - 1], [ex + 2, ey - 1]);
        // singender Mund: dunkles, senkrechtes O; weit offen glimmt es innen
        const m = mund[i];
        for (let k = 0; k < Math.max(1, m); k++) { P.set(ex - 1, ey + 2 + k, 'k0'); if (m > 1) P.set(ex, ey + 2 + k, 'k0'); }
        if (m > 2) P.set(ex - 1, ey + 3, 'glutDim');
      });
      if (kerzenAn) v.kerzen.forEach((x, i) => {
        const top = 95 - (i % 2), h = flamme[i % 5];
        P.glow(x + 0.5, top - 1, 4, 0.9, 'r1', 'glutDim');
        P.set(x, top, 'flamme'); P.set(x, top - 1, 'kern');
        for (let k = 2; k <= h; k++) P.set(x, top - k, k === h ? 'flamme' : 'glut');
        if (h > 2) P.set(x - 1, top - 1, 'flamme');
      });
      else if (p.f < 3) v.kerzen.forEach((x, i) => P.set(x, 93 - (i % 2) - p.f, 'k3')); // Rauchfaden
    };
    return { gruppen, details, augen, sinken: p.tod ? r(p.q * 5) : 0 };
  },
};
