// Der Glasbläser (Glasmeer, Elite). Er kam mit der Expedition, um Probengläser zu blasen, und hat
// gesehen, dass das ganze Meer aus Glas ist. Seitdem bläst er es. Ein schmaler Mann in Lederschürze,
// die Pfeife am Mund, und an ihrem Ende eine Blase, die größer ist als sein Oberkörper. In der Blase
// hängt grünes Licht wie Nordlicht unter dem Eis. Seine Wangen sind selbst schon Glas. Angriff: er
// stößt die Blase nach vorn. Sie wächst mit jedem Atemzug, und wenn er fällt, platzt sie.
'use strict';
module.exports = {
  id: 'glasblaeser', biom: 'glasmeer', zone: 'glasmeer', w: 128, h: 160, fuss: [80, 155], kopf: [82, 40], rimBis: 152, rang: 'elite',
  varianten: { glasblaeser: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, vor = 0, blase = 1, licht = 1, fall = 0, hem = 0;
    if (p.idle) { blase = [1, 1.03, 1.06, 1.03][f]; licht = [1, 1.1, 0.9, 1][f]; }
    if (p.angriff) { lean = [3, 4, -6, -2][f]; vor = [4, 6, -5, -2][f]; blase = [1.05, 1.1, 0.95, 1][f]; licht = [1, 1.2, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; licht = 0.6; vor = 3; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 4); licht = f < 2 ? 1.4 : 0; blase = f < 2 ? 1.15 + p.q : 0; }
    const cx = 82, ox = lean, sy = 66 + fall;
    // Schürze und Körper: schmal, leicht vorgebeugt
    const koerper = Pg([[cx - 10 + ox, sy], [cx + 10 + ox, sy - 2], [cx + 13 + r(ox / 2), sy + 36 - fall / 2], [cx + 14, 140], [cx - 12, 140], [cx - 11 + r(ox / 2), sy + 36 - fall / 2]], null, { rd: 1.5 });
    const schuerze = Pg([[cx - 9 + ox, sy + 12], [cx + 3 + ox, sy + 10], [cx + 4, 136], ...saum(cx + 4, cx - 14, 141, 3, 2, 17, hem), [cx - 14, 136]], 'dunkel', { rd: 0.8 });
    const beine = [C(cx - 5, 138, cx - 6, 151, 2.6, 2.2, null), C(cx + 6, 138, cx + 7, 151, 2.6, 2.2, null), E(cx - 9, 153, 4.6, 1.8, 'dunkel'), E(cx + 4, 153, 4.6, 1.8, 'dunkel')];
    // Kopf: zur Pfeife geneigt, Wangen aufgeblasen (Glas)
    const kx = cx - 6 + ox, ky = sy - 14;
    const hals = C(cx - 2 + ox, sy + 2, kx + 2, ky + 4, 2.8, 2.4, null);
    const kopf = E(kx, ky, 7, 7.5, 'haut');
    const wange = E(kx - 6, ky + 3, 5, 4.5, null, { pf: 'dome' });
    // Pfeife: lang nach links unten; Blase am Ende
    const mx = kx - 10, my = ky + 4;
    const ex = mx - 26 + vor, ey = my + 22;
    const pfeife = C(mx, my, ex, ey, 1, 1, 'dunkel', { pf: 'flat' });
    const R = 17 * blase;
    const bx = ex - R * 0.75, by = ey + R * 0.55;
    const kugel = R > 0 ? [E(bx, by, R, R * 0.95, null, { pf: 'dome', noRim: false })] : [];
    // Arme: beide an der Pfeife
    const arm1 = glied([[cx - 8 + ox, sy + 4], [cx - 16 + ox, sy + 16], [mx - 8 + vor * 0.3, my + 7]], 2.6, 2, null);
    const arm2 = glied([[cx + 8 + ox, sy + 4], [cx + 2 + ox, sy + 18], [mx - 15 + vor * 0.5, my + 12]], 2.4, 1.9, null);
    const tot = p.tod && f >= 2;
    const gruppen = [
      { p: arm2, k: 1 },
      { p: beine, k: 0.5 },
      { p: [koerper], k: 2 },
      { p: [schuerze], k: 0, noRim: true },
      { p: [hals, kopf], k: 1.5 },
      { p: [wange], k: 0 },
      { p: tot ? [] : [pfeife], k: 0, pf: 'flat' },
      { p: tot ? [] : kugel, k: 0 },
      { p: arm1, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Blase: innen dunkel und durchsichtig, Nordlicht in Schleiern, Glanzlicht oben
      if (!tot && R > 0) {
        P.el(bx + 0.5, by + 0.5, R - 2, R * 0.95 - 2, 'k0', true);
        for (let k = 0; k < 3; k++) {
          for (let x = -R + 4; x < R - 4; x++) {
            const y = by - 2 + k * 5 + Math.sin(x * 0.35 + k * 1.7 + f * 0.8) * 3;
            const X = r(bx + x), Y = r(y);
            if (((X - bx) / (R - 3)) ** 2 + ((Y - by) / (R * 0.95 - 3)) ** 2 > 1) continue;
            if (A.bay(X, Y) < 0.55 * licht - k * 0.12) P.auf(X, Y, k === 1 && licht > 1.2 ? 'glut' : 'nordlicht');
            else if (A.bay(X, Y) < 0.75 * licht) P.auf(X, Y + 1, 'glutDim');
          }
        }
        // Glanzlicht und Rand
        P.auf(r(bx + R * 0.35), r(by - R * 0.6), 'kern'); P.auf(r(bx + R * 0.45), r(by - R * 0.5), 'r2'); P.auf(r(bx + R * 0.25), r(by - R * 0.68), 'r1');
        // Glut an der Pfeifenmündung
        P.set(r(ex), r(ey), 'glut');
      }
      // Wange: Glas mit einem grünen Schein
      P.auf(r(kx - 7), r(ky + 2), 'nordlicht'); P.auf(r(kx - 8), r(ky + 3), 'glutDim');
      // Augen: zusammengekniffen vor Anstrengung, zwei helle Schlitze
      if (!(p.tod && f >= 2)) {
        const ax = r(kx - 3), ay = r(ky - 2);
        P.set(ax, ay, 'kern'); P.set(ax - 1, ay, 'glut'); P.set(ax + 3, ay, 'kern'); P.set(ax + 4, ay, 'glut');
        augen.push([ax, ay], [ax + 3, ay]);
      }
      // Schürze: Brandflecken in Violett
      P.auf(r(cx - 4), r(sy + 30), 'violett'); P.auf(r(cx - 8), r(sy + 46), 'violett');
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
