// Die Abklatscherin (namenlose Stadt, Elite). Sie kam 1903 mit der Expedition, um die Reliefs
// abzunehmen: nasses Papier auf den Stein, mit der Bürste hineingeklopft, bis es jede Kerbe hat.
// Sie hat nicht aufgehört. Jetzt hängen die Bögen an ihr wie Schuppen, vom Tropenhut bis zum
// Saum, und auf jedem ist ein Erbauer. Über ihr Gesicht ist ein Bogen geklebt; man sieht nur,
// wo darunter die Augen sind. In der Hand die Klopfbürste, in der anderen der Eimer. Sie nimmt
// einen Abdruck von dem, was du tust. Angriff: die Bürste schlägt zu.
'use strict';
module.exports = {
  id: 'abklatscherin', biom: 'stadt', zone: 'stadt', w: 128, h: 160, fuss: [64, 155], kopf: [54, 30], rimBis: 152, rang: 'elite',
  varianten: { abklatscherin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, buerste = 0, fall = 0, glanz = 1, flattern = 0, hem = 0;
    if (p.idle) { flattern = [0, 1, 0, 1][f]; glanz = [1, 1, 1.1, 0.9][f]; }
    if (p.angriff) { lean = [2, 4, -7, -3][f]; buerste = [8, 14, -10, -3][f]; glanz = [1, 1.2, 1.6, 1.1][f]; flattern = [1, 2, 3, 1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; flattern = 2; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64, ox = lean, sy = 52 + fall;
    // Leib: schmal oben, Rock weit, alles mit Bögen behängt
    const leib = Pg([[cx - 12 + ox, sy], [cx + 12 + ox, sy - 1], [cx + 14 + r(ox / 2), sy + 30], [cx + 26, 140], ...saum(cx + 26, cx - 24, 150, 7, 3, 5, hem), [cx - 24, 140], [cx - 14 + r(ox / 2), sy + 30]], null, { rd: 1.5 });
    // Kopf mit Tropenhut, ein Bogen klebt über dem Gesicht
    const kx = cx - 4 + ox * 1.2, ky = sy - 12;
    const kopf = E(kx, ky, 8, 9, null);
    const hut = [E(kx, ky - 7, 11, 6, null, { pf: 'bevel' }), Pg([[kx - 17, ky - 3], [kx + 16, ky - 4], [kx + 14, ky - 1], [kx - 15, ky]], 'dunkel', { pf: 'flat' })];
    const maske = Pg([[kx - 9, ky - 2], [kx + 2, ky - 3], [kx + 1, ky + 10], [kx - 8, ky + 12]], null, { pf: 'flat', tone: 0.2 });
    // Bögen: Reihen von Blättern, versetzt, nach unten hin größer
    const boegen = [];
    for (let row = 0; row < 6; row++) {
      const y = sy + 6 + row * 15, n = 2 + (row > 1 ? 1 : 0) + (row > 3 ? 1 : 0), w = 9 + row * 1.2;
      for (let i = 0; i < n; i++) {
        const x = cx - (n - 1) * w / 2 + i * w + (row % 2 ? 3 : -2) + r(ox * (1 - row / 6)), fl = ((i + row + flattern) % 2) * (row > 2 ? 1 : 0);
        const a = Math.sin(row * 3.1 + i * 7.7) * 0.28 + (i - (n - 1) / 2) * 0.12 + fl * 0.05, ca = Math.cos(a), sa = Math.sin(a);
        const q = (dx, dy) => [x + dx * ca - dy * sa, y + dx * sa + dy * ca];
        boegen.push(Pg([q(-w / 2, 0), q(w / 2, -1), q(w / 2 - 1, 12), q(w / 2 - 3, 14), q(-w / 2 + 1, 13)], null, { rd: 0.3, pf: 'flat', tone: (row + i) % 3 === 0 ? 0.42 : 0.3 }));
      }
    }
    // Arme: vorn die Klopfbürste, hinten der Eimer
    const hx = cx - 26 + ox + r(buerste * 0.4), hy = sy + 28 - buerste;
    const armV = glied([[cx - 10 + ox, sy + 4], [cx - 20 + ox, sy + 18], [hx, hy]], 3.4, 2.6, null);
    const stiel = C(hx, hy, hx - 6, hy - 10 - r(buerste / 3), 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const bx = hx - 6, by = hy - 10 - r(buerste / 3);
    const buersteK = Pg([[bx - 7, by - 4], [bx + 3, by - 6], [bx + 5, by - 1], [bx - 5, by + 2]], null, { rd: 0.8, pf: 'bevel' });
    const ex = cx + 26 + ox, ey = sy + 50;
    const armH = glied([[cx + 10 + ox, sy + 4], [cx + 20 + ox, sy + 22], [ex, ey - 12]], 3.4, 2.6, null);
    const eimer = Pg([[ex - 7, ey - 6], [ex + 7, ey - 6], [ex + 5, ey + 8], [ex - 5, ey + 8]], null, { rd: 0.8, pf: 'bevel' });
    const henkel = C(ex - 6, ey - 6, ex, ey - 12, 0.6, 0.6, 'dunkel', { noRim: true });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [henkel], k: 0, noRim: true },
      { p: [eimer], k: 0, pf: 'bevel' },
      { p: [leib], k: 3 },
      { p: tot ? [] : boegen, k: 0, pf: 'flat' },
      { p: [kopf], k: 1 },
      { p: [maske], k: 0, pf: 'flat' },
      { p: hut, k: 1 },
      { p: armV, k: 1 },
      { p: [stiel, buersteK], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // auf jedem Bogen ein Erbauer im Abdruck: flacher Schädel, eine Kerbe für den Mund
      if (!tot) boegen.forEach((b, i) => { const [x0, y0] = b.v[0], [x1, y1] = b.v[1]; const mx = r((x0 + x1) / 2), my = r((y0 + y1) / 2 + 5); P.auf(mx - 2, my, 'k0'); P.auf(mx - 1, my - 1, 'k0'); P.auf(mx, my - 1, 'k0'); P.auf(mx + 1, my, 'k0'); if (i % 2) P.auf(mx - 1, my + 4, 'k0'); else P.auf(mx, my + 4, 'k0'); });
      // Borsten der Bürste
      for (let k = 0; k < 4; k++) P.auf(r(bx - 6 + k * 3), r(by + 1 - k * 0.6), 'k0');
      // Wasser im Eimer
      P.line(r(ex - 5), r(ey - 5), r(ex + 5), r(ey - 5), 'r1', true);
      // Augen hinter dem Papier: durchscheinend
      if (glanz > 0) {
        const ax = r(kx - 6), ay = r(ky + 2);
        P.set(ax, ay, 'glut'); P.set(ax + 4, ay, 'glut'); P.set(ax, ay + 1, 'glutDim'); P.set(ax + 4, ay + 1, 'glutDim');
        if (glanz > 1.2) { P.set(ax, ay, 'kern'); P.set(ax + 4, ay, 'kern'); }
        P.glow(ax + 2, ay + 0.5, 5 * glanz, 0.6 * glanz, 'glutDim', 'k3');
        augen.push([ax, ay], [ax + 4, ay]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
