// Die Masseurin (Kurhaus, Elite). Sie hat im Kurhaus die Gäste geknetet, bis ihre Hände mehr
// wurden. Jetzt hat sie acht, und jede ist warm und fest. Wer sie anfasst, wird angefasst.
// Eine runde Frau in weißer Schürze, Haube, die Arme fächern hinter ihr wie bei einem Heiligenbild.
// Angriff: alle Hände greifen zu.
'use strict';
module.exports = {
  id: 'masseurin', biom: 'kurhaus', zone: 'kurhaus', w: 128, h: 160, fuss: [64, 155], kopf: [62, 46], rimBis: 152, rang: 'elite',
  varianten: { masseurin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let griff = 0, lean = 0, fall = 0, glanz = 1, wieg = 0;
    if (p.idle) { wieg = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { griff = [2, -4, 12, 5][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, sy = 60 + fall;
    const leib = Pg([[cx - 16 + ox, sy], [cx + 16 + ox, sy], [cx + 26, sy + 30], [cx + 26, 146], ...saum(cx + 26, cx - 24, 150, 7, 2, 4), [cx - 24, 146], [cx - 26, sy + 30]], null, { rd: 2.6 });
    const schuerze = Pg([[cx - 14 + ox, sy + 14], [cx + 6 + ox, sy + 14], [cx + 10, 144], [cx - 18, 144]], null, { rd: 1.4, pf: 'flat', tone: 0.2 });
    const kx = cx - 2 + ox * 1.2, ky = sy - 10;
    const kopf = E(kx, ky, 8, 8.5, null, { rd: 1.5 });
    const haube = Pg([[kx - 9, ky - 3], [kx - 7, ky - 11], [kx + 4, ky - 13], [kx + 10, ky - 6], [kx + 9, ky - 2]], null, { rd: 1.4, pf: 'flat', tone: 0.2 });
    // acht Arme im Fächer hinter dem Körper; vorne zwei greifen
    const arme = [];
    for (let i = 0; i < 6; i++) {
      const w = -2.6 + i * 0.42 + wieg * 0.02, L = 30 + (i % 2) * 6, g = griff * 0.4;
      const sx = cx + ox + (i < 3 ? -10 : 10), sY = sy + 8;
      const ex = sx + Math.cos(w) * (L + g), ey = sY + Math.sin(w) * (L + g);
      arme.push(glied([[sx, sY], [(sx + ex) / 2 + Math.sin(w) * 4, (sY + ey) / 2 - Math.cos(w) * 4], [ex, ey]], 2.8, 2.2, null));
      arme.push([E(ex, ey, 3.4, 3, 'haut', { pf: 'dome' })]);
    }
    const hx = cx - 26 + ox - griff, hy = sy + 26;
    const vorn = [glied([[cx - 12 + ox, sy + 4], [cx - 22 + ox, sy + 14], [hx, hy]], 3.2, 2.6, null), [E(hx, hy, 4, 3.6, 'haut')], glied([[cx - 4 + ox, sy + 6], [cx - 14 + ox, sy + 22], [hx + 4, hy + 8]], 3.2, 2.6, null), [E(hx + 4, hy + 8, 4, 3.6, 'haut')]];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : arme.flat(), k: 1 },
      { p: [leib], k: 3 },
      { p: [schuerze], k: 1, pf: 'flat' },
      { p: [kopf], k: 2 },
      { p: [haube], k: 1, pf: 'flat' },
      { p: vorn.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Messingschnalle, Handtuch über der Schulter, Wasserperlen
      P.set(r(cx - 4 + ox), r(sy + 16), 'messing'); P.set(r(cx - 3 + ox), r(sy + 16), 'messing');
      for (let y = sy + 20; y < 140; y += 12) P.auf(r(cx - 6), y, 'wasser');
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
