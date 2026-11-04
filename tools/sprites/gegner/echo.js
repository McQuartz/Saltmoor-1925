// Das Walfänger-Echo (Walkathedrale). Der Harpunier, der den Wal als Erster sah. Er hat geworfen,
// und die Leine ist nie zurückgekommen: Sie läuft von der Harpune in seine eigene Brust.
// Er steht in der Wurfhaltung, immer wieder, wie ein Echo des einen Wurfs.
// Inneres Licht: die Tranlampe am Gürtel und das Glimmen dort, wo die Leine in die Brust geht.
'use strict';
module.exports = {
  id: 'echo', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [48, 115], kopf: [46, 34], rimBis: 113,
  varianten: {
    echo_a: { hut: 1.3, saum: 9, mantel: 20, leine: 1 },
    echo_b: { hut: 1.7, saum: 7, mantel: 18, leine: 2, schulterleine: true },
  },
  // verworfen: Harpune senkrecht wie ein Stab (liest sich als Pilger oder Hirte)
  skizzen: { skizze_stab: { hut: 1, saum: 9, mantel: 17, leine: 1, stab: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, chain } = A;
    const f = p.f;
    let lean = 0, zieh = 0, wurf = 0, fall = 0, glut = 1, dy = 0, saumP = 0;
    // zieh: Harpune nach hinten gezogen (Ausholen), wurf: nach vorn geworfen
    if (p.idle) { dy = [0, 0, 1, 1][f]; glut = [1, .9, 1.1, 1][f]; saumP = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 4, -6, -3][f]; zieh = [4, 9, 0, 0][f]; wurf = [0, 0, 1, 0.5][f]; glut = [1, 1.2, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; glut = .6; zieh = 2; }
    if (p.tod) { fall = r(p.q * 16); glut = Math.max(0, 1 - p.q * 2); lean = r(p.q * 3); }
    const T = fall, cx = 47 + lean, sy = 48 + T;
    // Ölzeug: steif, bis übers Knie, vorn offen; darunter Hosen und hohe Seestiefel in weitem Wurfschritt
    const M = v.mantel, hem = 94 + T;
    const mantel = Pg([[cx - 9, sy - 2], [cx + 9, sy - 3], [cx + 12, sy + 6], [cx + 12, sy + 20], [cx + M - 2, hem - 5], [cx + M, hem],
      ...saum(cx + M, cx - M - 2, hem, 5, 4, 3, saumP), [cx - M - 2, hem], [cx - M, hem - 5], [cx - 12, sy + 20], [cx - 12, sy + 6]], null, { rd: 1.5 });
    const kragen = Pg([[cx - 7, sy - 5], [cx + 7, sy - 6], [cx + 9, sy + 1], [cx - 8, sy + 2]], null, { rd: 1 });
    const fv = [cx - 15 - (wurf ? 4 : 0), 113], fh = [cx + 14 + (zieh > 4 ? 2 : 0), 113];
    const beine = [...glied([[cx - 5, hem - 6], [cx - 11, 102], fv], 4.2, 3.6, null), ...glied([[cx + 5, hem - 6], [cx + 11, 102], fh], 4.2, 3.6, 'dunkel')];
    const stiefel = [E(fv[0] - 2, 113, 5.5, 2.8, 'dunkel'), E(fh[0] + 1, 113, 5.5, 2.8, 'dunkel'), C(fv[0] - 1, 103, fv[0], 112, 4.6, 4.2, null), C(fh[0], 103, fh[0] + 1, 112, 4.6, 4.2, 'dunkel')];
    // Kopf mit Südwester: Krempe hinten lang und nach unten gezogen, vorn hochgeschlagen
    const hx = cx - 1, hy = sy - 15;
    const hals = C(hx, hy + 4, cx, sy - 2, 3, 3.6, 'dunkel');
    const kopf = E(hx - 1, hy + 1, 5, 6, 'haut');
    const hut = [Pg([[hx - 6, hy - 5], [hx + 2, hy - 9], [hx + 6, hy - 5], [hx + 6, hy - 2], [hx - 7, hy - 2]], null, { rd: 1.2 }),
      Pg([[hx - 11, hy - 4], [hx - 7, hy - 2], [hx + 8, hy - 3], [hx + 11 + 6 * v.hut, hy + 3 + 5 * v.hut], [hx + 8 + 5 * v.hut, hy + 6 + 5 * v.hut], [hx + 4, hy + 1], [hx - 8, hy], [hx - 12, hy - 2]], null, { rd: 0.7 })];
    // Harpune: Schaft über dem Kopf, Spitze nach vorn (links); Ausholen zieht sie nach hinten, Wurf schickt sie nach vorn unten
    const ang = v.stab ? -1.5 : -0.2 + wurf * 0.35 - zieh * 0.01;
    const hand2 = v.stab ? [cx - 14, sy + 4] : [cx + 20 + zieh - wurf * 22, sy - 25 + wurf * 16];
    const dirx = Math.cos(Math.PI + ang), diry = Math.sin(Math.PI + ang);
    const spitze = v.stab ? [hand2[0] + 2, sy - 50] : [hand2[0] + dirx * 54, hand2[1] - diry * -1 + diry * 54];
    const ende = v.stab ? [hand2[0] - 1, 112] : [hand2[0] - dirx * 16, hand2[1] - diry * 16];
    const hand1 = v.stab ? [cx - 14, sy + 16] : [hand2[0] + dirx * 34, hand2[1] + diry * 34];
    const schaft = C(ende[0], ende[1], spitze[0], spitze[1], 1.1, 1.1, 'dunkel', { pf: 'flat' });
    const ux = dirx, uy = diry, nx = -uy, ny = ux;
    const eisen = [Pg([[spitze[0] + ux * 9, spitze[1] + uy * 9], [spitze[0] + nx * 2.6, spitze[1] + ny * 2.6], [spitze[0] - ux * 2, spitze[1] - uy * 2], [spitze[0] - nx * 2.6, spitze[1] - ny * 2.6]], null, { rd: 0.3 }),
      C(spitze[0] + ux * 2, spitze[1] + uy * 2, spitze[0] - ux * 3 + nx * 5, spitze[1] - uy * 3 + ny * 5, 0.8, 0.6, null)];
    // Arme: dick im Ölzeug, Fäustlinge
    const schV = [cx - 7, sy + 1], schH = [cx + 8, sy];
    const armV = v.stab ? glied([schV, [cx - 15, sy + 10], hand1], 3.4, 2.6, null) : glied([schV, [(schV[0] + hand1[0]) / 2 - 2, (schV[1] + hand1[1]) / 2 + 6], hand1], 3.6, 2.8, null);
    const armH = v.stab ? glied([schH, [cx + 12, sy + 14], [cx + 6, sy + 22]], 3.4, 2.6, null) : glied([schH, [hand2[0] + 6, (schH[1] + hand2[1]) / 2 + 2], hand2], 3.6, 2.8, null);
    const faust = [E(hand1[0], hand1[1], 3, 2.6, 'haut'), E(hand2[0], hand2[1], 3, 2.6, 'haut')];
    // Leine: von der Harpune hinter der Spitze in einem Bogen hinunter, in die Brust
    const brust = [cx - 3, sy + 12];
    const la = v.stab ? [spitze[0] + 1, spitze[1] + 8] : [spitze[0] - ux * 8, spitze[1] - uy * 8];
    const leine = [];
    const N = 9; for (let k = 0; k < N; k++) { const t0 = k / N, t1 = (k + 1) / N; const P0 = [la[0] + (brust[0] - la[0]) * t0, la[1] + (brust[1] - la[1]) * t0 + Math.sin(t0 * Math.PI) * 16], P1 = [la[0] + (brust[0] - la[0]) * t1, la[1] + (brust[1] - la[1]) * t1 + Math.sin(t1 * Math.PI) * 16]; leine.push(C(P0[0], P0[1], P1[0], P1[1], 0.75, 0.75, 'dunkel', { pf: 'flat' })); }
    // Variante b: eine Leinenrolle über der Schulter
    const rolle = v.schulterleine ? [E(cx + 9, sy + 10, 5, 7, 'dunkel'), E(cx + 9, sy + 10, 2.4, 4, null)] : [];
    const gruppen = [
      { p: v.stab ? [] : [...armH], k: 1.2, anker: [lean, T] },
      { p: [...beine, ...stiefel], k: 1.2 },
      { p: [mantel], k: 2, anker: [lean, T] },
      { p: rolle, k: 0 },
      { p: [kragen], k: 1, anker: [lean, T] },
      { p: [hals], k: 0 },
      { p: [kopf], k: 0, anker: [lean, T] },
      { p: hut, k: 0.8, anker: [lean, T] },
      { p: leine, k: 0, noRim: true },
      { p: [schaft], k: 0 },
      { p: eisen, k: 0 },
      { p: v.stab ? [...armH] : [], k: 1.2 },
      { p: [...armV, ...faust], k: 1.2, anker: [lean, T] },
    ];
    const augen = [];
    const details = P => {
      // Ölzeug: vorn offen (dunkler Spalt), steife Falten, und der Ölglanz in Streifen auf der Lichtseite
      for (let y = r(sy + 2); y < hem - 1; y++) { const x = r(cx - 2 + (y - sy) * 0.08); P.auf(x, y, 'k0'); P.auf(x - 1, y, y % 4 === 0 ? 'k0' : 'k1'); }
      for (let k = -3; k <= 3; k++) { if (!k) continue; const x0 = cx + k * 2.6, x1 = cx + k * (M / 3.2); for (let y = r(sy + 24); y < hem - 2; y++) { const t = (y - sy - 24) / (hem - sy - 24); const x = r(x0 + (x1 - x0) * t); P.auf(x, y, 'k0'); if (k > 0 && (y + k) % 3 !== 0) P.auf(x + 1, y, k > 1 ? 'r1' : 'k3'); } }
      for (let k = 0; k < 4; k++) for (let j = 0; j < 7; j++) P.auf(r(cx + 6 + k * 2 - j * 0.3), r(sy + 4 + k * 4 + j), j % 2 ? 'k3' : 'k2');
      // Rippen um das Loch in der Brust, im Spalt des Mantels sichtbar
      for (let k = 0; k < 3; k++) { P.auf(r(cx - 6), r(sy + 9 + k * 3), 'bein'); P.auf(r(cx - 5), r(sy + 9 + k * 3), 'bein'); P.auf(r(cx), r(sy + 9 + k * 3), 'bein'); }
      // Gürtel mit Schnalle
      for (let x = r(cx - 13); x <= cx + 13; x++) { P.auf(x, r(sy + 21), 'k0'); P.auf(x, r(sy + 22), 'k1'); }
      P.auf(r(cx + 2), r(sy + 21), 'bein'); P.auf(r(cx + 3), r(sy + 21), 'bein');
      // Knebelknöpfe aus Walknochen
      for (let k = 0; k < 3; k++) P.auf(r(cx + 4), r(sy + 4 + k * 6), 'bein');
      // Brust: wo die Leine hineingeht, ist ein Loch, und darin glimmt es
      if (glut > 0) { P.glow(brust[0], brust[1], 9 * glut, 0.8); P.set(r(brust[0]), r(brust[1]), glut > 1.2 ? 'kern' : 'glut'); P.set(r(brust[0]) - 1, r(brust[1]), 'mark'); P.set(r(brust[0]), r(brust[1]) + 1, 'mark'); P.auf(r(brust[0]) + 1, r(brust[1]) - 1, 'glutDim'); augen.push(brust); }
      // Tranlampe am Gürtel, vorn: warmes Licht von unten auf Mantel und Faust
      if (!p.tod || f < 2) { const lx = r(cx - 10), ly = r(sy + 26); P.set(lx, ly - 2, 'k3'); P.set(lx - 1, ly - 1, 'k1'); P.set(lx + 1, ly - 1, 'k1'); P.set(lx, ly - 1, 'tran'); P.set(lx, ly, 'kern'); P.set(lx - 1, ly, 'tran'); P.set(lx + 1, ly, 'tran'); P.set(lx, ly + 1, 'k1'); P.set(lx - 1, ly + 2, 'k2'); P.set(lx + 1, ly + 2, 'k2'); P.glow(lx, ly, 10, 0.75, 'glutDim', 'k3'); augen.push([lx, ly]); }
      // Gesicht unter der Krempe: kein Gesicht, nur zwei blasse Punkte tief im Schatten
      if (!p.tod || f < 1) { const ex = r(hx - 4), ey = r(hy + 2); P.auf(ex, ey, 'kern'); P.auf(ex + 3, ey, 'glut'); P.auf(ex - 1, ey + 3, 'k0'); P.auf(ex, ey + 4, 'k0'); P.auf(ex + 1, ey + 4, 'k0'); augen.push([ex, ey], [ex + 3, ey]); }
      // Harpuneneisen blinkt an der Schneide
      if (!v.stab) { P.auf(r(spitze[0] + ux * 6), r(spitze[1] + uy * 6) - 1, 'r2'); P.auf(r(spitze[0] + ux * 4), r(spitze[1] + uy * 4) - 1, 'r1'); }
      // Leine: einzelne helle Fasern im Gegenlicht
      leine.forEach((c, i) => { if (i % 2 === 0 && i > 0) P.auf(r(c.x1), r(c.y1) - 1, 'r1'); });
    };
    return { gruppen, details, augen, dy };
  },
};
