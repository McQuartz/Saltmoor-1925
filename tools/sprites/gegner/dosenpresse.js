// Die Dosenpresse (Fabrik, Elite). In der Konservenfabrik hat sie 1924 einen Arbeiter in ihre
// Form genommen und seither nicht mehr losgelassen. Er bedient sie noch, von innen. Ein Gestell
// aus Eisen auf zwei krummen Beinen, oben das Schwungrad, unten der Stempel. Sie zählt laut,
// und bei drei kommt der Stempel. Angriff: der Stempel fällt.
'use strict';
module.exports = {
  id: 'dosenpresse', biom: 'fabrik', zone: 'fabrik', w: 128, h: 160, fuss: [64, 155], kopf: [64, 84], rimBis: 152, rang: 'elite',
  varianten: { dosenpresse: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let st = 0, rad = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { rad = f * 0.5; st = [0, 1, 2, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { rad = f * 1.2; st = [-4, -8, 16, 6][f]; lean = [1, 2, -3, -1][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 6); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64, ox = lean, sy = 36 + fall;
    const holm = [Pg([[cx - 30 + ox, sy + 14], [cx - 22 + ox, sy + 14], [cx - 20, sy + 96], [cx - 30, sy + 96]], null, { rd: 1 }), Pg([[cx + 22 + ox, sy + 14], [cx + 30 + ox, sy + 14], [cx + 30, sy + 96], [cx + 20, sy + 96]], null, { rd: 1 })];
    const kopf = Pg([[cx - 34 + ox, sy + 6], [cx + 34 + ox, sy + 6], [cx + 32 + ox, sy + 24], [cx - 32 + ox, sy + 24]], null, { rd: 1.4 });
    const tisch = Pg([[cx - 34, sy + 92], [cx + 34, sy + 92], [cx + 30, sy + 102], [cx - 30, sy + 102]], null, { rd: 1 });
    const beine = [glied([[cx - 24, sy + 100], [cx - 34, sy + 108], [cx - 30, 152]], 5, 4, 'dunkel'), glied([[cx + 24, sy + 100], [cx + 36, sy + 108], [cx + 32, 152]], 5, 4, 'dunkel')];
    const fuesse = [E(cx - 33, 153, 7, 3, 'dunkel'), E(cx + 34, 153, 7, 3, 'dunkel')];
    // Schwungrad oben rechts mit Speichen
    const rx = cx + 22 + ox, ry = sy - 2;
    const radR = E(rx, ry, 14, 14, 'dunkel', { pf: 'flat' });
    const speichen = [0, 1, 2].map(i => { const w = rad + i * Math.PI / 3; return C(rx - Math.cos(w) * 12, ry - Math.sin(w) * 12, rx + Math.cos(w) * 12, ry + Math.sin(w) * 12, 1, 1, null, { pf: 'flat' }); });
    // Stempel und darin der Arbeiter (Oberkörper hinter den Holmen)
    const sY = sy + 52 + st;
    const stange = C(cx + ox, sy + 24, cx + ox, sY, 3, 3, 'dunkel', { pf: 'bevel' });
    const stempel = Pg([[cx - 16 + ox, sY], [cx + 16 + ox, sY], [cx + 14 + ox, sY + 10], [cx - 14 + ox, sY + 10]], null, { rd: 0.8, pf: 'bevel' });
    const mann = Pg([[cx - 12, sy + 90], [cx - 12, sy + 74], [cx - 6, sy + 66], [cx + 6, sy + 66], [cx + 12, sy + 74], [cx + 12, sy + 90]], null, { rd: 1.6 });
    const mkopf = E(cx, sy + 60 + Math.max(0, st) * 0.3, 6, 6, null, { rd: 1.3 });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [radR], k: 0, pf: 'flat' },
      { p: speichen, k: 1, pf: 'flat' },
      { p: [mann], k: 2 },
      { p: [mkopf], k: 2 },
      { p: holm, k: 3 },
      { p: [kopf], k: 3 },
      { p: [stange], k: 0, pf: 'bevel' },
      { p: tot ? [] : [stempel], k: 1, pf: 'bevel' },
      { p: beine.flat(), k: 1 },
      { p: fuesse, k: 0 },
      { p: [tisch], k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Nieten, Rost, Zählwerk mit glühender Ziffer
      for (let x = -30; x <= 30; x += 6) { P.set(r(cx + x + ox), r(sy + 9), 'k3'); P.set(r(cx + x), r(sy + 95), 'k3'); }
      for (let y = sy + 30; y < sy + 90; y += 7) P.auf(r(cx - 26), y, 'rost');
      P.set(r(rx), r(ry), 'rost');
      if (glanz > 0) {
        const zx = r(cx - 22 + ox), zy = r(sy + 15);
        P.set(zx, zy, 'flamme'); P.set(zx + 1, zy, 'flamme');
        const ex = r(cx - 3), ey = r(sy + 60 + Math.max(0, st) * 0.3);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
