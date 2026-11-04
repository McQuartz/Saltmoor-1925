// Die Netzflickerin (Hafenviertel, Favorit). Gebeugt über ein Netz, das nie fertig wird.
// Glieder zu lang, Knie und Ellbogen knicken hart; der Kopf hängt tief unter den Schultern und sieht dich an.
'use strict';
module.exports = {
  id: 'netzflickerin', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [60, 115], kopf: [62, 36], rimBis: 113,
  varianten: {
    netzflickerin_a: { kopf: [31, 82], arm: 1, buckel: 0, netz: 5 },
    netzflickerin_b: { kopf: [33, 88], arm: 1.15, buckel: 3, netz: 4, dritterArm: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f, B = v.buckel;
    let atem = 0, hy = 0, netzDx = 0, netzDy = 0, arbeit = 0, fall = 0, lean = 0, augenAn = true, hem = 0;
    if (p.idle) { atem = [0, 1, 1, 0][f]; arbeit = [0, 1, 0, -1][f]; hy = [0, 0, 1, 1][f]; hem = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [1, -2, -6, -2][f]; hy = [-2, 0, 1, 0][f]; netzDx = [1, -4, -12, -5][f]; netzDy = [0, -4, -3, 0][f]; arbeit = [0, -1, -2, 0][f]; }
    if (p.treffer) { lean = [2, 1][f]; hy = [-2, -1][f]; }
    if (p.tod) { fall = r(p.q * 20); augenAn = f < 2; lean = r(p.q * 2); }
    const T = atem + fall; // Rücken senkt sich
    const kx = v.kopf[0] + lean + Math.min(0, lean), ky = v.kopf[1] + hy + r(fall * 0.5);
    // Rücken und Umhang: Buckel oben rechts, fällt rechts bis fast zum Boden, links zum Kopf hin
    const ruecken = Pg([[44 + lean, 60 + T], [52 + lean, 48 - B + T], [62 + lean, 44 - B + T], [71 + lean, 47 - B + T], [76 + lean, 57 + T], [77, 68 + T * 0.7], [73, 80 + T * 0.5], [71, 88 + fall * 0.2], ...saum(72, 50, 95 + fall * 0.2, 5, 4, 11, hem), [49, 90], [44 + lean, 76 + T * 0.6]], null, { rd: 1.5 });
    // Wirbelgrat: Knochenhöcker brechen die Rundung des Buckels auf
    const wirbel = [[50, 52, 2], [55, 46, 2.3], [61.5, 42, 2.5], [68.5, 42.5, 2.5], [74.5, 46.5, 2.3], [78.5, 53, 2.1], [80, 61, 1.9]].map(([x, y, rr]) => E(x + lean, y - B + fall, rr, rr * 0.85, null));
    const blatt = Pg([[64 + lean, 50 - B + T], [75 + lean, 47 - B + T], [79 + lean, 52 - B + T], [70 + lean, 56 - B + T]], null, { rd: 0.6 });
    const buckel = E(63 + lean, 54 - B + T, 13, 10 + B * 0.5, null, { pf: 'bevel' });
    const nacken = C(50 + lean, 60 + T, kx + 2, ky - 8, 8, 3.5, null);
    // Rippen unter dem Tuch: schräg vom Grat nach unten, wie die Glieder eines Spinnenleibs
    const falten = [[56, 50, 47, 64], [62, 47, 52, 66], [68, 48, 58, 71], [73, 52, 63, 77], [77, 59, 68, 84]].map(([x1, y1, x2, y2], i) => C(x1 + lean, y1 - B + fall + 2, x2 + lean * 0.5, y2 + fall, 0.7, 1.3 - i * 0.05, 'dunkel'));
    // Kopf: Schädel mit spitzem Kinn, hängt kopfüber unter der Schulter
    const kopf = E(kx, ky, 7.5, 7, 'haut', { pf: 'bevel' });
    const kinn = Pg([[kx - 6, ky + 2], [kx - 1, ky + 5], [kx - 7, ky + 10]], 'haut', { rd: 0.5 });
    // Beine unter dem Umhang: Knie knicken weit nach außen
    const fy = 114;
    const beinA = glied([[56, 90 + fall * 0.2], [42, 97], [48, fy]], 3, 1.3, null);
    const beinB = glied([[68, 88 + fall * 0.2], [85, 80 + r(fall * 0.5)], [81, fy]], 2.8, 1.2, null);
    const beinC = glied([[62, 92 + fall * 0.2], [76, 98], [71, fy]], 2.4, 1.1, null);
    // Arme: zu lang, Ellbogen knicken hart; Hände halten das Netz
    const a = v.arm, nY = 98 + netzDy + r(fall * 0.4), nL = 46 + netzDx, nR = 68 + netzDx;
    const armL = glied([[50 + lean, 66 + T], [38 - 4 * (a - 1) * 10 + lean, 88 * a - 10 * (a - 1) * 8 + arbeit], [nL, nY]], 2.6, 1.1, null);
    const armR = glied([[72 + lean, 62 + T], [83 * a - 9 * (a - 1) * 10, 84 - arbeit], [nR, nY + 1]], 2.4, 1.0, null);
    const armC = v.dritterArm ? glied([[60 + lean, 72 + T], [54, 86], [nL + 10, nY + 1]], 1.6, 0.8, null) : [];
    const gruppen = [
      { p: beinB, k: 1 },
      { p: armR, k: 0 },
      { p: beinC, k: 1 },
      { p: [ruecken, buckel, nacken, ...wirbel], k: 2.5 },
      { p: [blatt], k: 1 },
      { p: falten, k: 0, noRim: true },
      { p: beinA, k: 1 },
      { p: armC, k: 0 },
      { p: [kopf, kinn], k: 2 },
      { p: armL, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Netz: senkrechte Fäden im inneren Randlicht, Querfäden gepunktet, hängt durch
      const n = v.netz, w = nR - nL, rows = 3;
      const knot = (i, j) => [r(nL + (w * i) / n + (j % 2) * 1), r(nY + 3 + j * 4 + Math.sin((i / n) * Math.PI) * (1.5 + j) + (i % 2 && p.idle ? arbeit * (j > 1 ? 1 : 0) : 0))];
      for (let j = 0; j <= rows; j++) for (let i = 0; i <= n; i++) {
        const [x, y] = knot(i, j);
        if (i < n) { const [x2, y2] = knot(i + 1, j); const m = Math.max(Math.abs(x2 - x), 1); for (let k = 0; k <= m; k += 2) P.set(x + ((x2 - x) * k) / m, y + ((y2 - y) * k) / m, 'k3'); }
        if (j < rows) { const [x2, y2] = knot(i, j + 1); P.line(x, y, x2, y2, i === n && j === 0 ? 'r2' : 'r1'); }
        P.set(x, y, 'k2');
      }
      for (let i = 1; i <= n; i += 2) { const [x, y] = knot(i, rows); P.set(x, y + 1, 'r1'); P.set(x, y + 2, 'k3'); } // Bleigewichte
      if (augenAn) {
        P.auge(kx - 4, ky + 1, 2); P.auge(kx + 1, ky + 1, 2);
        augen.push([r(kx - 4), r(ky + 1)], [r(kx + 1), r(ky + 1)]);
      } else { P.set(kx - 4, ky + 1, 'k0'); P.set(kx + 1, ky + 1, 'k0'); }
      // Zahnreihe: kleine helle Punkte unter den Augen (nur innen, eine Stufe)
      for (let i = -4; i <= 2; i += 2) P.auf(kx + i, ky + 4 + (p.angriff && f === 2 ? 1 : 0), 'r1');
    };
    return { gruppen, details, augen };
  },
};
