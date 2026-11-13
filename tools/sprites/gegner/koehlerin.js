// Die Köhlerin (Wald, der nach unten wächst, Elite). Sie hat für die Legion Holzkohle gebrannt,
// als der Wald noch oben wuchs, und sie brennt immer noch. Den Meiler trägt sie auf dem Rücken:
// ein Hügel aus Erde und Scheiten, größer als sie, durch dessen Zuglöcher die Glut schaut. Sie
// selbst ist klein, gebückt, schwarz von Ruß, in einem Kittel aus Rindenstreifen; in der Hand der
// lange Schürhaken. Ihre Augen sind zwei Zuglöcher mehr. Angriff: sie stößt den Haken nach vorn.
'use strict';
module.exports = {
  id: 'koehlerin', biom: 'wald', zone: 'wald', w: 128, h: 160, fuss: [64, 155], kopf: [40, 60], rimBis: 152, rang: 'elite',
  varianten: { koehlerin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stoss = 0, glut = 1, fall = 0, hem = 0, rauch = f;
    if (p.idle) { glut = [1, 0.85, 1.1, 0.9][f]; }
    if (p.angriff) { lean = [3, 4, -5, -2][f]; stoss = [6, 10, -14, -6][f]; glut = [1, 1.2, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glut = 0.6; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glut = f < 3 ? 0.8 - p.q * 0.6 : 0; }
    const cx = 66, ox = lean;
    // Meiler: großer Hügel hinter ihr, unten breit
    const my = 82 + fall * 0.6;
    const meiler = [E(cx + 14 + ox, my + 22, 31, 52, null, { pf: 'dome' }), Pg([[cx - 18, 151], [cx - 16, my + 30], [cx + 44, my + 30], [cx + 47, 151]], null, { rd: 2 })];
    const kappe = E(cx + 14 + ox, my - 29, 8, 5, 'dunkel', { pf: 'dome' });
    // Körper: klein, gebückt, vor dem Meiler
    const ky = 96 + fall;
    const kittel = Pg([[cx - 18 + ox, ky - 6], [cx - 2 + ox, ky - 10], [cx + 6 + ox, ky + 4], [cx + 8, 140], ...saum(cx + 8, cx - 22, 146, 5, 4, 3, hem), [cx - 22, 140], [cx - 20 + ox, ky + 8]], null, { rd: 1 });
    const beine = [C(cx - 14, 140, cx - 15, 152, 2.4, 2.2, null), C(cx - 2, 140, cx, 152, 2.4, 2.2, null), E(cx - 18, 153, 4, 1.8, 'dunkel'), E(cx - 3, 153, 4, 1.8, 'dunkel')];
    // Kopf mit Kopftuch, tief vorne
    const hx = cx - 22 + ox, hy = ky - 10;
    const kopf = E(hx, hy, 6.5, 6, 'haut');
    const tuch = Pg([[hx - 8, hy - 1], [hx - 4, hy - 8], [hx + 5, hy - 8], [hx + 10, hy + 2], [hx + 14, hy + 8], [hx + 5, hy + 4]], null, { rd: 1 });
    // Arm mit Schürhaken (lang, waagrecht nach vorne)
    const ax = cx - 26 + ox + stoss * 0.4, ay = ky + 10;
    const arm = glied([[cx - 10 + ox, ky - 4], [cx - 20 + ox, ky + 4], [ax, ay]], 2.8, 2.2, null);
    const haken = [C(ax + 16, ay - 4, ax - 30 + stoss, ay + 2, 1.1, 1, 'dunkel', { pf: 'flat' }), C(ax - 30 + stoss, ay + 2, ax - 32 + stoss, ay - 4, 1, 0.9, 'dunkel', { pf: 'flat' })];
    const tot = p.tod && f >= 4;
    const gruppen = [
      { p: [...meiler, kappe], k: 3 },
      { p: beine, k: 0.5 },
      { p: [kittel], k: 2 },
      { p: [kopf, tuch], k: 1 },
      { p: tot ? [] : haken, k: 0 },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Scheite im Meiler: schräge Linien
      for (let i = 0; i < 7; i++) { const x0 = cx - 6 + ox + i * 7, y0 = my - 20 + Math.abs(3 - i) * 5; P.line(x0, y0, x0 + 4, y0 + 10, 'k1', true); }
      // Zuglöcher: Glut schaut heraus
      if (glut > 0) {
        const loecher = [[cx + 6, my - 14], [cx + 22, my - 22], [cx + 32, my - 6], [cx + 16, my + 4], [cx + 30, my + 18], [cx + 4, my + 20], [cx + 38, my + 36]];
        loecher.forEach(([x, y], i) => {
          const X = r(x + ox), Y = r(y);
          if (p.idle && (i + f) % 4 === 0) { P.auf(X, Y, 'glutDim'); return; }
          P.glow(X + 0.5, Y + 0.5, 7 * glut, 0.9 * glut, 'glutDim', 'k3'); P.auf(X - 1, Y, 'harz');
          P.auf(X, Y, glut > 1.2 ? 'kern' : 'glut'); P.auf(X + 1, Y, 'harzhell'); P.auf(X, Y + 1, 'harz');
        });
        // Rauch aus der Kappe: gedithert, wandert
        for (let k = 0; k < 14; k++) { const x = r(cx + 14 + ox + Math.sin((k + rauch) * 0.7) * 2), y = r(my - 34 - k * 2); if (y > 0 && A.bay(x, y + rauch) < 0.5 - k * 0.025) P.set(x, y, 'k3'); }
      }
      // Augen: zwei Zuglöcher im Gesicht
      if (!(p.tod && f >= 1)) {
        const ex = r(hx - 4), ey = r(hy);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut');
        P.glow(ex + 1.5, ey + 0.5, 5, 0.8, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
      // Hakenspitze glüht beim Stoß
      if (!tot && p.angriff && f >= 2) { const x = r(ax - 31 + stoss), y = r(ay - 3); P.set(x, y, 'kern'); P.set(x, y + 1, 'glut'); P.set(x + 1, y + 2, 'harzhell'); }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
