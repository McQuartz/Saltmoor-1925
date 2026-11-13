// Der Weidenmann (Moorwald). Den hat man früher am Mittsommer aus Weidenruten geflochten und
// angezündet; einer ist im Regen nicht verbrannt. Ein hoher, hohler Mann aus Flechtwerk, durch
// dessen Rippen man den Nebel sieht. Im Brustkorb sitzt noch, was man ihm hineingelegt hat: ein
// Vogel aus Stroh mit zwei Lichtern. Wer ihn anfasst, reißt sich an den Ruten. Angriff: er langt
// mit dem langen Rutenarm zu.
'use strict';
module.exports = {
  id: 'weidenmann', biom: 'moor', zone: 'moor', w: 96, h: 120, fuss: [48, 115], kopf: [46, 14], rimBis: 112,
  varianten: {
    weidenmann_a: { kopf: 0, breit: 1 },
    weidenmann_b: { kopf: 1, breit: 1.15 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, griff = 0, fall = 0, glanz = 1, wank = 0;
    if (p.idle) { wank = [0, 0, 1, 1][f]; glanz = [1, 1.1, 1, 0.9][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; griff = [4, 8, -12, -4][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; }
    const cx = 48, ox = lean, b = v.breit;
    // Ruten: der Leib als Gitter aus vielen dünnen Kapseln
    const ruten = [];
    const sy = 26 + fall;
    for (let i = -3; i <= 3; i++) ruten.push(C(cx + ox + i * 3 * b, sy + 4, cx + i * 2.2 * b + (i % 2), 80, 1.2, 1.2, null, i < 3 ? { noRim: true } : {}));
    for (let y = sy + 8; y < 80; y += 7) { const w = (10 + (y - sy) * 0.08) * b; ruten.push(C(cx + ox * (1 - (y - sy) / 60) - w, y, cx + ox * (1 - (y - sy) / 60) + w, y + 2, 1.3, 1.3, null)); }
    const beine = [...glied([[cx - 5, 78], [cx - 8, 96], [cx - 9, 114]], 2.2, 1.6, null), ...glied([[cx + 5, 78], [cx + 9, 96], [cx + 10, 114]], 2.2, 1.6, null)];
    const schultern = C(cx - 14 * b + ox, sy + 4, cx + 14 * b + ox, sy + 3, 2, 2, null);
    // Kopf: ein geflochtener Korb, b: mit Hörnern aus Ruten
    const kx = cx + ox * 1.2 - 2, ky = sy - 10 + wank;
    const kopf = Pg([[kx - 6, ky + 8], [kx - 7, ky - 4], [kx, ky - 9], [kx + 7, ky - 4], [kx + 6, ky + 8]], null, { rd: 1, pf: 'bevel' });
    const hoerner = v.kopf ? [...glied([[kx - 5, ky - 4], [kx - 10, ky - 10], [kx - 9, ky - 16]], 1.2, 0.6, null), ...glied([[kx + 5, ky - 4], [kx + 10, ky - 11], [kx + 8, ky - 17]], 1.2, 0.6, null)] : [];
    const hx = cx - 26 + ox - griff, hy = sy + 30 - r(griff / 2);
    const armV = glied([[cx - 12 * b + ox, sy + 5], [cx - 20 + ox - griff / 2, sy + 18], [hx, hy], [hx - 4, hy + 6]], 1.8, 1, null);
    const armH = glied([[cx + 12 * b + ox, sy + 5], [cx + 20 + ox, sy + 20], [cx + 22, sy + 40]], 1.8, 1, null);
    const vogel = E(cx + ox * 0.8, sy + 22, 5, 4, 'dunkel');
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 0 },
      { p: tot ? [] : [vogel], k: 0 },
      { p: [...ruten, schultern], k: 0 },
      { p: beine, k: 0 },
      { p: [kopf, ...hoerner], k: 0.5 },
      { p: armV, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Dornen an den Ruten
      for (let y = sy + 10; y < 78; y += 9) { P.set(r(cx - 13 * b + ox * 0.5), y, 'k3'); P.set(r(cx + 14 * b + ox * 0.5), y + 3, 'k3'); }
      // Flechtmuster am Kopf
      P.line(r(kx - 5), r(ky), r(kx + 5), r(ky), 'k0', true); P.line(r(kx - 5), r(ky + 4), r(kx + 5), r(ky + 4), 'k0', true);
      // der Strohvogel im Brustkorb hat die Augen
      if (glanz > 0 && !tot) {
        const ex = r(cx + ox * 0.8 - 3), ey = r(sy + 21);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'kern');
        P.glow(ex + 2, ey + 0.5, 6 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
