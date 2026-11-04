// Der Markfresser (Walkathedrale). Der Schiffsjunge der Expedition, der als Erster vom Wal gegessen hat.
// Er hängt an einem abgebrochenen Knochen, schräg wie ein umgestürzter Mast, den Mund im Bruch, und trinkt das Mark.
// Falsch: Sein Rücken ist ein Sack, durch dessen Haut das Mark leuchtet, und er wird mit jedem Bissen größer.
// Inneres Licht: das Glimmen im Bruch des Knochens und der Sack auf seinem Rücken mit den Adern.
'use strict';
module.exports = {
  id: 'markfresser', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [54, 115], kopf: [34, 30], rimBis: 113,
  varianten: {
    markfresser_a: { sack: 1, neig: 0.42, knochenR: 6 },
    markfresser_b: { sack: 1.22, neig: 0.3, knochenR: 5.4, zweiter: true },
  },
  // verworfen: Knochen senkrecht (liest sich als Säule wie der Kreuzgangwächter)
  skizzen: { skizze_saeule: { sack: 1, neig: 0.02, knochenR: 7 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let puls = 0, los = 0, fall = 0, glut = 1, dy = 0, lean = 0;
    // los: löst sich vom Knochen und schnappt nach vorn (Angriff)
    if (p.idle) { puls = [0, 0.5, 1, 0.5][f]; glut = [1, 1.05, 1.2, 1.05][f]; }
    if (p.angriff) { los = [0.3, 0.6, 1, 0.5][f]; lean = [2, 3, -5, -2][f]; glut = [1.1, 1.3, 1.6, 1.2][f]; puls = [1, 1.5, 0, 0.5][f]; }
    if (p.treffer) { glut = 0.7; lean = [3, 2][f]; puls = -0.5; }
    if (p.tod) { fall = r(p.q * 10); glut = Math.max(0, 1 - p.q * 1.8); puls = -p.q * 2; }
    const S = v.sack;
    // Knochen: Gelenkkopf am Boden, Schaft schräg nach vorn oben, oben gebrochen
    const b0 = [58, 108], L = 94, a = -Math.PI / 2 - v.neig;
    const b1 = [b0[0] + Math.cos(a) * L, b0[1] + Math.sin(a) * L];
    const R = v.knochenR, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const P2 = (t, s) => [b0[0] + ux * L * t + nx * s, b0[1] + uy * L * t + ny * s];
    const schaft = Pg([P2(0, -R - 1), P2(0.5, -R + 1), P2(0.92, -R), P2(1.0, -R + 2), P2(0.97, -1), P2(1.03, 1.5), P2(0.98, R), P2(0.5, R - 1), P2(0, R + 1.5)], null, { rd: 1 });
    const gelenk = [E(b0[0] - 5, b0[1] + 2, 8, 5.5, null), E(b0[0] + 6, b0[1] + 3, 7, 4.5, 'dunkel')];
    const zweiter = v.zweiter ? [C(b0[0] + 18, 112, b0[0] + 26, 62, 3.2, 2.4, 'dunkel'), E(b0[0] + 26, 61, 3.6, 3, 'dunkel')] : [];
    // Er: hängt hinten (rechts) am Knochen, der Sack auf dem Rücken zum Licht; der Hals reicht über den Schaft,
    // der Kopf ist vorn (links), der Mund steckt im Bruch. Die Arme umfassen den Knochen von vorn.
    const T = fall;
    const [rx0, ry0] = P2(0.6, R + 8);
    const sx = rx0 + 4 - los * 4 + lean, sy = ry0 + T;
    const sack = E(sx + 2, sy - 3, (9.5 + puls) * S, (13 + puls) * S, null, { pf: 'bevel' });
    const [tx, ty] = P2(0.36, R + 5);
    const [nk, nky] = P2(0.8, R + 3);
    const leib = Pg([[nk, nky - 2], [sx - 2, sy - 13 * S], [sx + 7 * S, sy - 2], [tx + 9, ty + 4], [tx + 3, ty + 12], [tx - 3, ty + 6], [nk - 4, nky + 6]], null, { rd: 3 });
    const [kx0, ky0] = P2(0.84, -R - 8);
    const kx = kx0 - los * 12 + lean, ky = ky0 + los * 10 + T;
    const hals = glied([[nk + 1, nky], P2(0.9, 0), [kx + 3, ky - 1]], 3.2, 2.6, null);
    const kopf = E(kx, ky, 6, 5.4, 'haut');
    const maul = C(kx + 3, ky - 2, b1[0] - 1, b1[1] + 3, 1.7, 1.2, 'dunkel');
    // Arme: lang und dünn, kommen von hinten um den Schaft; Finger liegen vorn auf dem Knochen
    const [g1x, g1y] = P2(0.7, -R - 2), [g2x, g2y] = P2(0.5, -R - 1);
    const arm1 = los > 0.7 ? glied([P2(0.72, R - 1), [kx - 6, ky + 14], [kx - 16, ky + 10]], 2.3, 1.4, null) : glied([P2(0.74, R - 1), P2(0.76, -R - 4), [g1x, g1y + 4]], 2.3, 1.4, null);
    const arm2 = glied([P2(0.52, R - 1), P2(0.54, -R - 4), [g2x, g2y + 4]], 2.3, 1.4, null);
    const [kn, kny] = P2(0.2, R + 12);
    const bein = [...glied([[tx + 2, ty + 10], [kn + 2, kny], P2(0.12, R)], 3, 1.6, null), ...glied([[tx + 6, ty + 8], [kn + 9, kny + 6], [kn + 3, kny + 13]], 2.8, 1.6, 'dunkel')];
    const gruppen = [
      { p: zweiter, k: 1, tone: -0.2 },
      { p: [leib, ...bein], k: 2, anker: [lean, T] },
      { p: [sack], k: 1.5, anker: [lean, T] },
      { p: gelenk, k: 2.5, tone: 0.2 },
      { p: [schaft], k: 1, tone: 0.3 },
      { p: [maul], k: 0 },
      { p: hals, k: 1.2, anker: [lean, T] },
      { p: [kopf], k: 0, anker: [lean, T] },
      { p: [...arm2], k: 1 },
      { p: [...arm1], k: 1 },
    ];
    const g1 = [g1x, g1y + 4], g2 = [g2x, g2y + 4];
    const augen = [];
    const details = P => {
      // Knochen: Längsrillen und Poren, ein Riss; die Bruchkante oben ausgefranst
      for (let t = 0.05; t < 0.95; t += 0.012) { const [x, y] = P2(t, -1.5); P.auf(r(x), r(y), (t * 100 | 0) % 7 < 2 ? 'bein' : 'k2'); const [x2, y2] = P2(t, 2.5); if ((t * 100 | 0) % 5 === 0) P.auf(r(x2), r(y2), 'k0'); }
      for (let k = 0; k < 9; k++) { const [x, y] = P2(0.12 + k * 0.09, ((k * 7) % 5) - 2); P.auf(r(x), r(y), 'k0'); }
      // Glimmen im Bruch: Mark, wo der Mund sitzt
      if (glut > 0) {
        const [mx, my] = P2(0.985, 0.5);
        P.glow(mx, my, 10 * glut, 0.85);
        P.set(r(mx), r(my), glut > 1.2 ? 'kern' : 'glut'); P.set(r(mx) + 1, r(my) + 1, 'glut'); P.set(r(mx) - 1, r(my), 'mark'); P.set(r(mx), r(my) + 1, 'mark');
        augen.push([mx, my]);
        // Rückensack: das Mark leuchtet durch die Haut; Adern als dunkle Linien, Kern hell
        const rx = (9.5 + puls) * S, ry = (13 + puls) * S, cy0 = sy - 3;
        for (let y = r(cy0 - ry); y <= cy0 + ry; y++) for (let x = r(sx - rx); x <= sx + rx; x++) {
          const q = Math.hypot((x + 0.5 - sx - 1) / rx, (y + 0.5 - cy0 + 1) / ry); if (q > 0.8 || !P.get(x, y) || P.get(x, y) > 4) continue;
          const ader = Math.abs(Math.sin((x - sx) * 0.7 + Math.sin((y - cy0) * 0.35) * 2.4)) < 0.2;
          const t = glut * (1 - q / 0.8);
          if (ader) P.set(x, y, t > 0.45 ? 'glut' : t > 0.2 ? 'mark' : 'glutDim');
          else if (t > 0.72) P.set(x, y, t > 0.9 ? 'kern' : 'glut');
          else if (t > 0.4 && (x + y) % 2) P.set(x, y, 'glutDim');
        }
        augen.push([sx + 1, cy0 - 1]);
        // Unterlicht auf Knochen und Armen neben dem Sack
        P.glow(sx - rx, cy0 + 2, 10 * glut, 0.4, 'glutDim', 'k3');
      }
      // Augen: klein, weit auseinander, an den Seiten des Kopfs
      if (!p.tod || f < 1) { const ex = r(kx - 4), ey = r(ky - 1); P.set(ex, ey, 'kern'); P.set(ex + 5, ey - 1, 'glut'); P.auf(ex - 1, ey + 3, 'k0'); augen.push([ex, ey], [ex + 5, ey - 1]); }
      // Finger auf der anderen Seite des Schafts
      for (const g of [g1, g2]) for (let k = 0; k < 3; k++) { P.set(r(g[0] - 1 + k * 0.5), r(g[1] + k * 1.6 - 1), k === 1 ? 'k3' : 'k2'); P.set(r(g[0] - 2 + k * 0.5), r(g[1] + k * 1.6 - 1), 'k1'); }
      // Gesicht: vom Glimmen aus dem Bruch von rechts unten angeleuchtet
      if (glut > 0) P.glow(kx + 4, ky + 1, 6 * glut, 0.5, 'glutDim', 'k3');
    };
    return { gruppen, details, augen, dy };
  },
};
