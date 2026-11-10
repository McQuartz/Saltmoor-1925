// Glasmeer, dritter Wächter: Das Spiegelbild. Im Glas unter den Füßen geht jemand mit, der du bist, nur
// andersherum. Hier ist er heraufgestiegen: eine Gestalt, die aus dem Glas wächst und es mitbringt,
// der Unterleib noch Spiegelung, kopfüber. Er spielt deine letzte Karte gegen dich.
// Angriff: er tut, was du getan hast.
'use strict';
module.exports = {
  id: 'spiegelbild', biom: 'glasmeer', zone: 'glasmeer', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 30], rimBis: 172,
  varianten: { spiegelbild: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let arm = 0, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { arm = [4, 10, 28, 12][f]; X = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); glanz = f < 2 ? 0.6 : 0; }
    const cx = 80 + X, GY = 112, sy = 40 + fall;
    // oben: der Mensch, bis zur Hüfte
    const oben = Pg([[cx - 18, sy + 10], [cx - 8, sy], [cx + 8, sy], [cx + 18, sy + 10], [cx + 22, GY], [cx - 22, GY]], null, { rd: 2 });
    const kopf = E(cx, sy - 10 + atem * 0.5, 10, 11, null, { rd: 1.5 });
    const armV = glied([[cx - 16, sy + 8], [cx - 30 - arm * 0.5, sy + 26 - arm * 0.3], [cx - 34 - arm, sy + 44 - arm * 0.6]], 4, 3, null);
    const armH = glied([[cx + 16, sy + 8], [cx + 30, sy + 26], [cx + 34, sy + 46]], 4, 3, null);
    // unten: Spiegelung, kopfüber, im Glas; flacher Ton
    const spiegel = Pg([[cx - 22, GY + 2], [cx + 22, GY + 2], [cx + 18, GY + 56], [cx + 8, GY + 62], [cx - 8, GY + 62], [cx - 18, GY + 56]], null, { rd: 2, pf: 'flat', tone: 0.18, noRim: true });
    const skopf = E(cx, GY + 70, 9, 6, null, { pf: 'flat', tone: 0.18, noRim: true });
    const glas = Pg([[2, GY], [158, GY], [158, GY + 4], [2, GY + 4]], null, { rd: 0.4, pf: 'bevel', tone: 0.2 });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : [spiegel, skopf], k: 1, pf: 'flat', noRim: true },
      { p: armH, k: 1 },
      { p: [oben], k: 3 },
      { p: [kopf], k: 2 },
      { p: armV, k: 1 },
      { p: [glas], k: 2, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Sprünge im Glas, Nordlicht in der Spiegelung, das Spiegelbild hat die Augen offen
      for (const [x0, x1] of [[10, 40], [100, 150], [60, 76]]) P.line(x0, GY + 2, x1, GY + 10, 'r1');
      for (let y = GY + 10; y < GY + 60; y += 8) P.set(r(cx - 10 + (y % 20)), y, 'nordlicht');
      P.line(r(cx - 34 - arm), r(sy + 44 - arm * 0.6), r(cx - 34 - arm), r(GY - 2), 'violett');
      if (glanz > 0) {
        const ex = r(cx - 4), ey = r(sy - 10 + atem * 0.5);
        P.set(ex, ey, 'kern'); P.set(ex + 8, ey, 'glut');
        P.glow(ex + 4, ey, 8 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        if (!tot) { P.set(ex, r(GY + 70), 'glut'); P.set(ex + 8, r(GY + 70), 'glut'); }
        augen.push([ex, ey], [ex + 8, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
