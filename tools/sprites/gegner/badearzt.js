// Der Badearzt (Kurhaus, Elite). Dr. Ahlers hat jedem Gast vor der Abreise noch einmal die Brust
// abgehört. Seit dem Sommer 1900 hört er etwas, das tiefer liegt als die Brust. Langer, heller
// Kittel, ein Rücken wie ein Fragezeichen, der kahle Kopf schräg zum Boden geneigt, die Brille
// leuchtet. Das Hörrohr ist gewachsen: die Schläuche laufen von seinen Ohren in den Boden, drei
// davon enden in Trichtern, die auf den Fliesen liegen und horchen. Den Bruststück-Trichter
// schwingt er an einem Schlauch wie ein Pendel. Angriff: das Bruststück fährt nach vorne.
'use strict';
module.exports = {
  id: 'badearzt', biom: 'kurhaus', zone: 'kurhaus', w: 128, h: 160, fuss: [70, 155], kopf: [58, 30], rimBis: 152, rang: 'elite',
  varianten: { badearzt: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, chain } = A;
    const f = p.f;
    let lean = 0, pend = 0, atem = 0, fall = 0, brille = 1, hem = 0, horch = 0;
    if (p.idle) { pend = [0.25, 0.1, -0.1, 0.1][f]; atem = [0, 0, 1, 1][f]; brille = [1, 1, 0.9, 1.1][f]; horch = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [3, 4, -6, -2][f]; pend = [-0.5, -0.8, 1.3, 0.6][f]; brille = [1, 1.3, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; pend = 0.5; brille = 0.5; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 6); brille = f < 2 ? 0.5 : 0; pend = p.q; }
    const cx = 72, ox = lean;
    const sy = 60 + atem + fall;
    // Kittel: hell (Material haut), unten gerade, hinten länger
    const kittel = Pg([[cx - 10 + ox, sy + 2], [cx + 12 + ox, sy - 6], [cx + 19 + ox, sy + 8], [cx + 19 + r(ox / 2), sy + 46 - fall / 2], [cx + 29, 146], ...saum(cx + 29, cx - 21, 150, 6, 2, 9, hem), [cx - 21, 144], [cx - 13 + r(ox / 2), sy + 40 - fall / 2], [cx - 14 + ox, sy + 10]], 'haut', { rd: 1.5 });
    const buckel = E(cx + 4 + ox, sy - 3, 14, 12, 'haut', { pf: 'dome' });
    const beine = [C(cx - 6, 140, cx - 7, 152, 2.4, 2.2, null), C(cx + 10, 140, cx + 11, 152, 2.4, 2.2, null), E(cx - 10, 153, 4.6, 1.8, 'dunkel'), E(cx + 8, 153, 4.6, 1.8, 'dunkel')];
    // Kopf: weit vorgestreckt und gesenkt, kahl
    const kx = cx - 16 + ox * 1.3, ky = sy + 2 + horch * 0.5;
    const hals = C(cx - 6 + ox, sy + 2, kx + 3, ky - 1, 3.6, 3, 'haut');
    const kopf = E(kx, ky, 8, 7.6, 'haut', { pf: 'dome' });
    const kiefer = Pg([[kx - 7, ky + 2], [kx - 2, ky + 8], [kx + 4, ky + 6]], 'haut', { rd: 1.2 });
    // Hörschläuche: von den Ohren hinab in den Boden, drei Trichter liegen auf den Fliesen
    const ohr = [kx + 3, ky + 3];
    const schl = [];
    const trichter = [];
    [[-44, 0.9], [-22, 0.7], [30, 0.8]].forEach(([dx, g], i) => {
      const ex = cx + dx, ey = 150;
      const mx = (ohr[0] + ex) / 2 + (i === 2 ? 10 : -6), my = (ohr[1] + ey) / 2 + 10;
      schl.push(...glied([[ohr[0], ohr[1] + 2], [ohr[0] + (i - 1) * 3, ohr[1] + 16], [mx, my], [ex, ey - 3]], 1.2, 1.0, 'dunkel'));
      trichter.push(Pg([[ex - 5 * g, ey + 2], [ex + 5 * g, ey + 2], [ex + 2 * g, ey - 4], [ex - 2 * g, ey - 4]], null, { rd: 0.6 }));
    });
    // Arm vorne: hält den Pendelschlauch; Bruststück am Ende
    const hx = kx + 2, hy = sy + 22;
    const arm = glied([[cx - 4 + ox, sy + 4], [cx - 10 + ox, sy + 16], [hx, hy]], 3, 2.2, 'haut');
    const pa = Math.PI / 2 + pend, pl = 26;
    const px = hx + Math.cos(pa) * pl, py = hy + Math.sin(pa) * pl;
    const pschlauch = C(hx, hy, px, py, 0.9, 0.9, 'dunkel', { noRim: true });
    const brust = E(px, py, 4.4, 4.4, null, { pf: 'dome' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 0.5 },
      { p: tot ? [] : schl, k: 0, noRim: true },
      { p: tot ? [] : trichter, k: 0 },
      { p: [kittel, buckel], k: 4 },
      { p: [hals, kopf, kiefer], k: 1.5 },
      { p: arm, k: 1 },
      { p: tot ? [] : [pschlauch], k: 0, noRim: true },
      { p: tot ? [] : [brust], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Knopfleiste am Kittel und Taschen-Kante
      for (let i = 0; i < 4; i++) P.auf(r(cx - 10 + ox * 0.6), r(sy + 14 + i * 9), 'k1');
      // Brille: zwei runde Gläser, leuchten von innen
      if (brille > 0) {
        const ex = r(kx - 4), ey = r(ky + 1);
        [[ex, ey], [ex + 5, ey]].forEach(([x, y], i) => {
          P.el(x + 0.5, y + 0.5, 1.6, 1.6, i ? 'glut' : 'glut', true); P.set(x, y, 'kern');
          augen.push([x, y]);
        });
        P.set(ex + 2, ey, 'messing'); P.set(ex + 3, ey, 'messing');
        P.glow(ex + 2.5, ey + 0.5, 8 * brille, 0.8 * brille, 'glutDim', 'k3');
      }
      // Trichter horchen: Messingrand, ein leiser Schein darunter
      if (!tot) trichter.forEach((t, i) => { const [x0, y0] = t.v[3], [x1] = t.v[2]; P.line(x0, y0, x1, y0, 'messing', true); if ((i + f) % 2 === 0) P.set(r((x0 + x1) / 2), y0 + 6, 'glutDim'); });
      // Bruststück: Membran leuchtet beim Schlag
      if (!tot) { P.auf(r(px), r(py), p.angriff && f === 2 ? 'kern' : 'wasser'); P.auf(r(px) - 1, r(py), 'messing'); }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
