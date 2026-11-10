// Das Fensterkind (Waisenhaus am Deich). Es hat in der Sturmnacht 1913 am Fenster gestanden und auf
// den Deich geschaut, ob jemand kommt, und es trägt das Fenster jetzt mit sich: einen Rahmen mit
// vier Scheiben, den es vor sich hält, das Gesicht an das Glas gedrückt. Wo sein Atem das Glas
// trifft, friert es, und deine Hand mit. Angriff: es schlägt mit dem Rahmen zu.
'use strict';
module.exports = {
  id: 'fensterkind', biom: 'waisenhaus', zone: 'waisenhaus', w: 96, h: 120, fuss: [48, 115], kopf: [44, 52], rimBis: 112,
  varianten: {
    fensterkind_a: { rahmen: 1, decke: 0 },
    fensterkind_b: { rahmen: 1.15, decke: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, schlag = 0, fall = 0, glanz = 1, hauch = 0;
    if (p.idle) { hauch = [0, 1, 2, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -7, -2][f]; schlag = [-2, -4, 6, 2][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52, ox = lean, sy = 60 + fall;
    // Nachthemd, klein, b: mit Decke über den Schultern
    const hemd = Pg([[cx - 8 + ox, sy], [cx + 8 + ox, sy - 1], [cx + 11, 102], ...saum(cx + 11, cx - 11, 108, 4, 2, 1), [cx - 11, 102]], null, { rd: 1.4, tone: 0.1 });
    const decke = v.decke ? [Pg([[cx - 12 + ox, sy + 2], [cx + 4 + ox, sy - 6], [cx + 16 + ox, sy], [cx + 22, sy + 30], [cx + 26, 112], [cx + 10, 112], [cx + 4, sy + 20]], 'dunkel', { rd: 1.5 })] : [];
    const beine = [C(cx - 4, 104, cx - 5, 113, 2, 1.8, 'haut'), C(cx + 4, 104, cx + 5, 113, 2, 1.8, 'haut')];
    const kx = cx - 4 + ox, ky = sy - 8;
    const kopf = E(kx, ky, 7, 7.5, null);
    const haar = Pg([[kx - 7, ky - 2], [kx - 4, ky - 8], [kx + 4, ky - 8], [kx + 8, ky - 2], [kx + 9, ky + 8], [kx + 3, ky + 2]], 'dunkel', { rd: 1.2 });
    // Fensterrahmen vor dem Gesicht, mit beiden Händen gehalten
    const rz = v.rahmen, fx = kx - 10 + schlag, fy = ky + 4;
    const hw = 8 * rz, hh = 12 * rz, x0 = fx - hw, x1 = fx + hw * 0.6, y0 = fy - hh, y1 = fy + hh;
    const rahmen = [C(x0, y0, x1, y0, 1.3, 1.3, null, { pf: 'bevel' }), C(x0, y1, x1, y1, 1.3, 1.3, null, { pf: 'bevel' }), C(x0, y0, x0, y1, 1.3, 1.3, null, { pf: 'bevel' }), C(x1, y0, x1, y1, 1.3, 1.3, null, { pf: 'bevel' }),
      C((x0 + x1) / 2, y0, (x0 + x1) / 2, y1, 0.7, 0.7, null, { pf: 'flat' }), C(x0, fy, x1, fy, 0.7, 0.7, null, { pf: 'flat' })];
    const haende = [E(x0 + 1, fy + 4, 2, 2, 'haut'), E(x1, fy + 6, 2, 2, 'haut')];
    const arme = [...glied([[cx - 6 + ox, sy + 3], [cx - 10 + ox, sy + 6], [x0 + 1, fy + 4]], 1.8, 1.4, null), ...glied([[cx - 4 + ox, sy + 6], [cx - 8 + ox, sy + 14], [x1, fy + 6]], 1.8, 1.4, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: decke, k: 1 },
      { p: beine, k: 0 },
      { p: [hemd], k: 2 },
      { p: [kopf], k: 1 },
      { p: [haar], k: 1 },
      { p: arme, k: 1 },
      { p: tot ? [] : rahmen, k: 0, pf: 'flat' },
      { p: haende, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Sprossen sieht man von der Seite als Kerben, Reif am Rahmen
      if (!tot) { for (let k = 0; k < 3 + hauch; k++) { P.set(r(x0 + 3 + k), r(fy - 3 + (k % 2)), 'kalk'); P.set(r(x0 + 4 + k), r(fy + 3 - (k % 2)), 'kalk'); } }
      // nasses Haar
      P.auf(r(kx + 6), r(ky + 5), 'nass'); P.auf(r(kx + 7), r(ky + 7), 'nass');
      // Augen ans Glas gedrückt
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'kern');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
