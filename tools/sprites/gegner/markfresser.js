// Der Markfresser (Walkathedrale). Der Schiffsjunge der Expedition, der als Erster vom Wal gegessen hat.
// Vorn ist er noch ein Junge: dünner Oberkörper, kahler Kopf, in den Händen ein gespaltener Knochen, an dem er saugt.
// Hinten ist er eine Made, so lang wie ein Boot, und durch ihre Glieder leuchtet das Mark, das er gefressen hat.
// Falsch: Er wird mit jedem Bissen größer, und die hintersten Glieder sind schon wieder Knochen.
// Inneres Licht: die Ringe der Made, die von innen glimmen, und das Mark im gespaltenen Knochen.
'use strict';
module.exports = {
  id: 'markfresser', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [44, 115], kopf: [24, 50], rimBis: 113,
  varianten: {
    markfresser_a: { glieder: 7, dick: 1, kringel: 1 },
    markfresser_b: { glieder: 8, dick: 1.15, kringel: 1.4, buckel: true },
  },
  // verworfen: Made aufgerichtet hinter ihm wie ein Sack (Masse ohne Lesart, der Junge geht unter)
  skizzen: { skizze_aufrecht: { glieder: 6, dick: 1, kringel: 0, aufrecht: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let puls = 0, beug = 0, lean = 0, fall = 0, glut = 1, dy = 0, saug = 0;
    // beug: Oberkörper stößt nach vorn unten (Biss), saug: Knochen am Mund
    if (p.idle) { puls = [0, 0.4, 0.8, 0.4][f]; glut = [1, 1.05, 1.15, 1.05][f]; saug = [0, 1, 1, 0][f]; }
    if (p.angriff) { beug = [-0.4, -0.7, 1, 0.5][f]; lean = [3, 4, -7, -3][f]; glut = [1.1, 1.3, 1.6, 1.2][f]; puls = [0.8, 1.2, 0, 0.4][f]; }
    if (p.treffer) { glut = 0.7; lean = [3, 2][f]; beug = -0.3; }
    if (p.tod) { fall = r(p.q * 8); glut = Math.max(0, 1 - p.q * 1.8); beug = p.q * 0.8; }
    const D = v.dick, n = v.glieder;
    // Made: Glieder entlang eines Bogens vom Becken nach hinten, das Ende ringelt sich hoch
    const seg = [];
    for (let i = 0; i < n; i++) {
      const q = i / (n - 1);
      let x, y;
      if (v.aufrecht) { x = 50 + q * 12; y = 100 - q * 60; }
      else { const hoch = q > 0.62 ? Math.pow((q - 0.62) / 0.38, 1.6) * 30 * v.kringel : 0; x = 40 + q * 44 - hoch * 0.25; y = 101 - Math.sin(q * Math.PI) * 5 - hoch; }
      const rr = (6.5 + 7 * Math.sin(Math.PI * (0.12 + q * 0.7))) * D * (1 - q * 0.35) + (i % 2 ? puls * 0.5 : 0) * (1 - q);
      seg.push({ x: x + lean * (1 - q) * 0.3, y: y + fall * 0.3, rx: rr * 1.05, ry: rr * (0.92 + (v.buckel && i === 2 ? 0.25 : 0)) });
    }
    const made = seg.map(s => E(s.x, s.y, s.rx, s.ry, null, { pf: 'bevel' }));
    // Junge: Becken im vordersten Glied, Oberkörper aufgerichtet, nach vorn geneigt
    const bx = seg[0].x - 2 + lean, by = seg[0].y - 4 + fall;
    const neig = 0.25 + beug * 0.55, len = 30;
    const shx = bx - Math.sin(neig) * len, shy = by - Math.cos(neig) * len;
    const rumpf = Pg([[bx - 6, by + 2], [bx + 6, by + 1], [shx + 7, shy + 2], [shx + 4, shy - 3], [shx - 5, shy - 2], [shx - 6, shy + 4]], null, { rd: 2 });
    const hx = shx - 4 - Math.sin(neig) * 6, hy = shy - 8 + (saug ? 1 : 0);
    const kopf = E(hx, hy, 5.6, 6.2, 'haut');
    const hals = C(shx - 1, shy, hx + 1, hy + 3, 2.6, 2.2, null);
    // Knochen: gespalten, am Mund; beim Biss weggerissen und als Keule nach vorn
    const kb = beug > 0.6 ? [[hx - 22, hy + 12], [hx - 4, hy - 4]] : [[hx - 14, hy + 8 + saug], [hx + 8, hy - 12]];
    const knochen = [C(kb[0][0], kb[0][1], kb[1][0], kb[1][1], 2.6, 2.2, 'haut'), E(kb[1][0], kb[1][1], 3.6, 3, 'haut'), E(kb[1][0] + 2, kb[1][1] + 2, 2.6, 2.4, 'haut')];
    // Arme: dünn, halten den Knochen
    const kmx = (kb[0][0] + kb[1][0]) / 2, kmy = (kb[0][1] + kb[1][1]) / 2;
    const h1 = [kmx - 4, kmy + 3], h2 = [kmx + 4, kmy - 3];
    const arm1 = glied([[shx - 4, shy + 2], [shx - 10, shy + 14], h1], 2.4, 1.6, null);
    const arm2 = glied([[shx + 4, shy + 2], [shx + 2, shy + 15], h2], 2.2, 1.5, 'dunkel');
    const haende = [E(h1[0], h1[1], 2.4, 2, 'haut'), E(h2[0], h2[1], 2.2, 1.8, 'haut')];
    // Die hintersten Glieder sind schon Knochen: Dornfortsätze wie Wirbel
    const dorn = seg.slice(-3).map((s, k) => C(s.x, s.y - s.ry + 1, s.x + 2 + k, s.y - s.ry - 5 - k, 1.4, 0.6, null));
    const gruppen = [
      { p: [arm2], k: 1 },
      ...made.slice().reverse().map((m, k) => ({ p: [m], k: 0, tone: k < 3 ? 0.35 : 0 })),
      { p: dorn, k: 0, tone: 0.5 },
      { p: [rumpf, hals], k: 2, anker: [lean, fall] },
      { p: [kopf], k: 0, anker: [lean, fall] },
      { p: knochen, k: 1.2 },
      { p: [...arm1, ...haende], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Glieder: der Ring zwischen zwei Gliedern ist dunkel, dahinter glimmt das Mark durch die Haut
      seg.forEach((s, i) => {
        if (i >= n - 2) return;
        const lx = r(s.x - s.rx * 0.25), ly = r(s.y + s.ry * 0.15), t = glut * (1 - i / n) * (i % 2 ? 1 : 0.85);
        if (glut > 0) {
          P.glow(lx, ly, s.rx * 0.85 * Math.max(0.3, t), 0.85 * t, 'glutDim', 'k3');
          for (let k = -2; k <= 2; k++) P.auf(lx + k, ly + Math.abs(k) * 0.3, t > 0.6 && Math.abs(k) < 2 ? 'glut' : 'mark');
          if (t > 0.75) P.set(lx, ly, 'kern');
          if (i < 2) augen.push([lx, ly]);
        }
        // Falte zum nächsten Glied
        const nx = seg[i + 1]; for (let k = -3; k <= 3; k++) P.auf(r((s.x + nx.x) / 2 + k * 0.3), r((s.y + nx.y) / 2 + k), 'k0');
      });
      // Rippen des Jungen und der eingefallene Bauch
      for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) P.auf(r(shx - 2 + j + Math.sin(neig) * k * -4), r(shy + 6 + k * 4 + j * 0.3), j === 3 ? 'k3' : 'k1');
      // Knochen: gespalten, das Mark glimmt im Spalt
      if (glut > 0) { const [mx, my] = kb[1]; P.set(r(mx), r(my), glut > 1.2 ? 'kern' : 'glut'); P.set(r(mx) + 1, r(my) + 1, 'mark'); P.set(r(mx) - 1, r(my) + 1, 'glutDim'); P.glow(mx, my, 6 * glut, 0.6); augen.push([mx, my]); }
      for (let k = 2; k < 12; k += 3) { const t = k / 14; P.auf(r(kb[0][0] + (kb[1][0] - kb[0][0]) * t), r(kb[0][1] + (kb[1][1] - kb[0][1]) * t) - 1, 'bein'); }
      // Gesicht: von unten aus dem Knochen beleuchtet, große dunkle Augenhöhlen, ein Lichtpunkt darin
      if (!p.tod || f < 1) { const ex = r(hx - 3), ey = r(hy - 1); P.auf(ex - 1, ey, 'k0'); P.set(ex, ey, 'kern'); P.auf(ex + 3, ey, 'k0'); P.set(ex + 3, ey + 1, 'glut'); P.glow(hx - 2, hy + 4, 5, 0.6, 'glutDim', 'k3'); augen.push([ex, ey], [ex + 3, ey + 1]); }
    };
    return { gruppen, details, augen, dy };
  },
};
