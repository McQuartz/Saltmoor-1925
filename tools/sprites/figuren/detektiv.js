// Der Detektiv. Fedora mit eingedellter Krone und vorn abgesenkter Krempe, hochgeschlagener Kragen, Trenchcoat
// mit Gürtel (deutlich tailliert) und ausschwingendem Saum, der Revolver gesenkt in der Hand links, frei neben dem Bein.
// Zigarettenglut am Mundwinkel als einzige weitere warme Stelle.
// Varianten: a = Krempe nach links gesenkt, Saum beidseitig ausschwingend; b = Hut tief in die Stirn, Saum vom Wind nach rechts getrieben.
'use strict';
module.exports = {
  id: 'detektiv', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [56, 60], leib: [58, 94], hand: [29, 108] },
  v: { var: 'a' },
  bild(p, v, A) {
    const { E, C, Pg } = A;
    const b = v.var === 'b';
    const cx = 56;
    const kopf = E(cx, 48, 10, 12, null, { pf: 'bevel' });
    const hy = b ? 3 : 0;
    const krone = Pg([[cx - 12, 41 + hy], [cx - 10, 31 + hy], [cx - 7, 26 + hy], [cx - 2, 27 + hy], [cx, 30 + hy], [cx + 2, 27 + hy], [cx + 7, 26 + hy], [cx + 10, 31 + hy], [cx + 12, 41 + hy]], null, { rd: 2 });
    const krempe = b
      ? Pg([[cx - 12, 41 + hy], [cx - 20, 46 + hy], [cx - 19, 50 + hy], [cx - 8, 49 + hy], [cx, 51 + hy], [cx + 8, 49 + hy], [cx + 19, 49 + hy], [cx + 20, 45 + hy], [cx + 12, 41 + hy]], null, { rd: 1 })
      : Pg([[cx - 12, 41], [cx - 22, 45], [cx - 22, 49], [cx - 9, 48], [cx, 50], [cx + 9, 47], [cx + 20, 45], [cx + 21, 42], [cx + 12, 40]], null, { rd: 1 });
    const kragenL = Pg([[cx - 20, 68], [cx - 16, 56], [cx - 11, 51], [cx - 8, 58], [cx - 8, 68]], null, { rd: 1 });
    const kragenR = Pg([[cx + 20, 68], [cx + 16, 56], [cx + 11, 51], [cx + 8, 58], [cx + 8, 68]], null, { rd: 1 });
    const hals = C(cx, 56, cx, 66, 6, 8, null);
    const saumR = b ? [[cx + 36, 150], [cx + 22, 147]] : [[cx + 30, 150], [cx + 18, 147]];
    const mantel = Pg([[cx - 8, 62], [cx + 8, 62], [cx + 17, 67], [cx + 19, 80], [cx + 14, 92], [cx + 13, 100], [cx + 19, 116], [cx + 26, 134], ...saumR, [cx + 2, 151], [cx - 14, 147], [cx - 29, 150], [cx - 26, 134], [cx - 19, 116], [cx - 13, 100], [cx - 14, 92], [cx - 19, 80], [cx - 17, 67]], null, { rd: 2 });
    const guertel = Pg([[cx - 15, 93], [cx + 15, 93], [cx + 16, 99], [cx - 16, 99]], null, { rd: 0.5 });
    const armL = A.glied([[cx - 18, 70], [cx - 25, 90], [cx - 27, 106]], 5.5, 4.2, null);
    const armR = A.glied([[cx + 18, 70], [cx + 22, 90], [cx + 19, 106]], 5.5, 4.2, null);
    const beinL = C(cx - 8, 144, cx - 9, 158, 5, 4.5, null);
    const beinR = C(cx + 8, 144, cx + 9, 158, 5, 4.5, null);
    const schuhL = Pg([[cx - 14, 158], [cx - 4, 158], [cx - 3, 168], [cx - 18, 168]], null, { rd: 0.5 });
    const schuhR = Pg([[cx + 4, 158], [cx + 14, 158], [cx + 18, 168], [cx + 3, 168]], null, { rd: 0.5 });
    // Revolver gesenkt: Lauf 4 px, Trommel, Griff zur Faust, Korn
    const lauf = Pg([[22, 112], [27, 112], [27, 134], [22, 134]], null, { rd: 0.5 });
    const trommel = E(24.5, 113, 5, 5, null);
    const griff = Pg([[27, 106], [33, 108], [34, 116], [29, 118]], null, { rd: 0.8 });
    const korn = Pg([[22, 130], [20, 130], [20, 134], [22, 134]], null, { rd: 0.3 });
    const gruppen = [
      { p: [beinL, schuhL], k: 1, tone: -0.15 },
      { p: [beinR, schuhR], k: 1, tone: -0.1 },
      { p: [mantel, hals], k: 4, pf: 'bevel', tone: -0.05 },
      { p: [guertel], k: 0, tone: -0.25 },
      { p: [armR], k: 2, tone: -0.05 },
      { p: [kopf], k: 2 },
      { p: [kragenL, kragenR], k: 2, pf: 'bevel' },
      { p: [krone, krempe], k: 1, pf: 'bevel' },
      { p: armL, k: 2 },
      { p: [lauf, trommel, griff, korn], k: 0.5, pf: 'bevel', tone: -0.1 },
    ];
    const augen = [];
    const details = P => {
      P.el(29, 108, 3.5, 3, 'k2');
      // Kronendelle und Hutband als dunkle Linien
      P.line(cx - 8, 36 + hy, cx + 8, 36 + hy, 'k0', true);
      P.line(cx - 4, 29 + hy, cx + 4, 29 + hy, 'k0', true);
      // Mantelknöpfe/Riegel als dunkle Linie
      P.line(cx + 1, 99, cx + 3, 140, 'k0', true);
      // Augen unter der Krempe, Zigarette im Mundwinkel
      const ay = 52 + hy;
      P.set(cx - 5, ay, 'kern'); P.set(cx - 4, ay, 'glut'); P.set(cx + 3, ay, 'kern'); P.set(cx + 4, ay, 'glut');
      augen.push([cx - 5, ay], [cx + 3, ay]);
      P.set(cx + 5, 58, 'k3'); P.set(cx + 6, 58, 'k3'); P.set(cx + 7, 58, 'glut'); P.set(cx + 8, 58, 'kern'); P.glow(cx + 8, 58, 4, 0.8);
    };
    return { gruppen, details, augen };
  },
};
