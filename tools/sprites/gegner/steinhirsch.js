// Wald (Akt III): Der Steinhirsch. Ein Hirsch aus Stein, älter als die Legion, der Hirsch des Hains,
// dem man vor Rom die Geweihe brachte. Sein Geweih wächst nach unten, wie alles in diesem Wald:
// es hängt vom Kopf herab wie ein Vorhang aus Wurzeln, bis auf den Boden, und schleift mit.
// In den Rissen des Körpers steht Harz und glimmt.
'use strict';
module.exports = {
  id: 'steinhirsch', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [54, 116], kopf: [34, 14], rimBis: 113,
  varianten: {
    steinhirsch_a: { strang: 5, laenge: 1, risse: 3 },
    steinhirsch_b: { strang: 7, laenge: 0.9, risse: 4, buckel: 3 },
  },
  // probe1 genommen: Kopf hoch, das Geweih hängt wie ein Vorhang bis zum Boden.
  // probe2 verworfen: Kopf tief, das Geweih sticht nach vorn in den Boden. Las sich als grasendes Tier mit Rechen,
  // der Kopf verschwand zwischen den Beinen, das falsche Detail war nicht zu sehen.
  proben: { probe1: { strang: 5, laenge: 1, risse: 3 }, probe2: { strang: 5, laenge: 1, risse: 3, tief: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, kopfY = 0, kopfX = 0, sway = 0, vorne = 0, fall = 0, knick = 0, augen = true, hinten = 0;
    if (p.idle) { sway = [0, 1, 1, 0][f]; kopfY = [0, 0, 1, 0][f]; }
    // Angriff: Kopf hoch, aufbäumen (Vorderbeine hoch), dann mit dem Geweihvorhang nach vorn schlagen, zurück
    if (p.angriff) { kopfY = [-3, -8, 6, 1][f]; kopfX = [2, 4, -10, -3][f]; vorne = [2, 9, -2, 0][f]; sway = [2, 4, -5, -1][f]; lean = [1, 2, -7, -2][f]; hinten = [0, 1, 0, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; kopfY = [-2, -1][f]; sway = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 18); knick = p.q; augen = f < 1; kopfY = r(p.q * 16); sway = r(p.q * 4); }
    const fy = 115, bk = v.buckel || 0;
    const T = fall;
    // Rumpf: schwerer Steinleib, Widerrist hoch (Buckel), Bauch durchhängend
    const bx = 60 + lean, by = 70 + T - vorne * 0.5;
    const rumpf = Pg([[bx - 22, by - 8 - bk], [bx - 14, by - 13 - bk], [bx, by - 11], [bx + 14, by - 10], [bx + 21, by - 6], [bx + 22, by + 3], [bx + 14, by + 9], [bx - 4, by + 11], [bx - 18, by + 8], [bx - 24, by + 1]], null, { rd: 2 });
    const schulter = E(bx - 16, by - 2 - vorne * 0.4, 9, 10, null, { pf: 'bevel' });
    const keule = E(bx + 14, by - 1, 9, 9, null, { pf: 'bevel' });
    // Hals und Kopf: Hals steil nach oben vorn, Kopf mit langem Äser nach links
    const hx = bx - 30 + kopfX, hy = (v.tief ? by + 22 : by - 36) + kopfY - vorne;
    const hals = C(bx - 18, by - 4 - vorne * 0.5, hx + 4, hy + 4, 7, 4, null);
    const kopf = E(hx + 2, hy, 6.5, 5, 'haut', { pf: 'bevel' });
    const aeser = C(hx, hy + 1, hx - 9, hy + 6, 3.6, 2.4, 'haut');
    const ohr = Pg([[hx + 5, hy - 3], [hx + 12, hy - 8], [hx + 8, hy - 2]], null, { rd: 0.5 });
    // Beine: dünn, Vorderbeine mit Knie, Hinterbeine mit Sprunggelenk nach hinten
    const kn = knick;
    const vb1 = glied([[bx - 18, by + 6], [bx - 20 - vorne * 0.6, by + 24 - vorne * 1.6 + kn * 8], [bx - 19 - vorne, fy - vorne * 2.2]], 2.8, 1.6, null);
    const vb2 = glied([[bx - 12, by + 7], [bx - 11 - vorne * 0.3, by + 25 - vorne * 1.2 + kn * 6], [bx - 12 - vorne * 0.5, fy - vorne * 1.2]], 2.5, 1.5, null);
    const hb1 = glied([[bx + 16, by + 5], [bx + 22 + hinten, by + 22 + kn * 5], [bx + 17, fy - 12 + kn * 6], [bx + 18, fy]], 3.2, 1.5, null);
    const hb2 = glied([[bx + 10, by + 6], [bx + 15, by + 22 + kn * 4], [bx + 11, fy - 12 + kn * 6], [bx + 12, fy]], 2.8, 1.4, null);
    const hufe = [E(bx - 20 - vorne, fy - vorne * 2.2, 2.4, 1.4, null), E(bx - 13 - vorne * 0.5, fy - vorne * 1.2, 2.2, 1.3, null), E(bx + 17, fy, 2.4, 1.4, null), E(bx + 11, fy, 2.2, 1.3, null)];
    const schwanz = C(bx + 21, by - 6, bx + 25, by - 2, 2, 1.2, null);
    // Geweih: zwei Stangen gehen kurz hoch, biegen nach vorn und fallen dann als Stränge bis auf den Boden
    const gx = hx + 4, gy = hy - 4, L = v.laenge;
    const stränge = [], strängeHinten = [];
    for (let i = 0; i < v.strang; i++) {
      const q = i / Math.max(1, v.strang - 1);
      const vorn = q < 0.5; // vordere Stange
      const sx0 = gx + (vorn ? -1 : 3), sy0 = gy;
      const kx = sx0 - 6 - q * 4 + (vorn ? 0 : 6), ky = sy0 - 10 - (1 - Math.abs(q - 0.5)) * 6; // Scheitel des Bogens
      const ax = kx - 8 - q * 10 + sway * (0.5 + q), ay = ky + 6; // nach vorn
      const endY = v.tief ? fy : Math.min(fy, gy + (30 + (i % 3) * 22) * L + (i === 0 || i === v.strang - 1 ? 40 : 0));
      const ex = ax - 2 + sway * (1 + q) + (i % 2 ? 3 : -2), ey = endY;
      const mx = (ax + ex) / 2 + (i % 2 ? 2 : -1) + sway, my = (ay + ey) / 2;
      const pts = v.tief ? [[sx0, sy0], [sx0 - 6 - i * 3, sy0 + 10], [sx0 - 10 - i * 4, fy - 4], [sx0 - 9 - i * 4, fy]] : [[sx0, sy0], [kx, ky], [ax, ay], [mx, my], [ex, ey]];
      (vorn ? stränge : strängeHinten).push({ pts, i, ex, ey });
    }
    const zuGlied = s => {
      const out = glied(s.pts, 1.9 - (s.i % 2) * 0.3, 0.7, null);
      // Seitenenden (Sprossen), die wie Wurzelhaare abstehen
      const m = s.pts[Math.min(3, s.pts.length - 1)], n = s.pts[Math.min(2, s.pts.length - 1)];
      out.push(...glied([[(m[0] + n[0]) / 2, (m[1] + n[1]) / 2], [(m[0] + n[0]) / 2 - 4 + (s.i % 2) * 7, (m[1] + n[1]) / 2 + 5]], 0.9, 0.5, null));
      return out;
    };
    const gruppen = [
      { p: strängeHinten.flatMap(zuGlied), k: 0.4, tone: -0.1 },
      { p: [...hb2, hufe[3]], k: 0.8 },
      { p: [...vb2, hufe[1]], k: 0.8 },
      { p: [rumpf, schwanz], k: 2 },
      { p: [keule], k: 1.5, tone: 0.05 },
      { p: [...hb1, hufe[2]], k: 0.8 },
      { p: [schulter], k: 1.5, tone: 0.08 },
      { p: [...vb1, hufe[0]], k: 0.8 },
      { p: [hals], k: 1 },
      { p: [ohr], k: 0.5 },
      { p: [kopf, aeser], k: 1.5 },
      { p: stränge.flatMap(zuGlied), k: 0.4 },
    ];
    const augenL = [];
    const details = P => {
      // Risse im Stein, Harz darin (kleine Lichter), die Ränder der Risse fangen das Licht oben rechts
      const risse = [[[bx - 8, by - 10], [bx - 4, by - 3], [bx - 7, by + 4], [bx - 3, by + 9]], [[bx + 6, by - 9], [bx + 9, by - 2], [bx + 7, by + 6]], [[bx - 20, by - 1], [bx - 16, by + 4]], [[bx + 16, by - 6], [bx + 19, by + 1]]].slice(0, v.risse);
      risse.forEach((rr, k) => { for (let i = 0; i + 1 < rr.length; i++) { P.line(r(rr[i][0]), r(rr[i][1]), r(rr[i + 1][0]), r(rr[i + 1][1]), 'k0', true); P.line(r(rr[i][0]) + 1, r(rr[i][1]), r(rr[i + 1][0]) + 1, r(rr[i + 1][1]), 'k3', true); }
        const m = rr[1]; P.auf(r(m[0]), r(m[1]), k % 2 ? 'harz' : 'glutDim'); if (k === 0) { P.auf(r(m[0]), r(m[1]) + 1, 'harzhell'); } });
      // Schichtung des Steins: waagerechte Bänder auf dem Rumpf
      for (let k = 0; k < 3; k++) P.line(r(bx - 18), r(by - 4 + k * 5), r(bx + 18), r(by - 5 + k * 5), 'k1', true);
      // Fell/Steinmaserung am Hals: kurze Striche in Wuchsrichtung
      for (let k = 0; k < 4; k++) P.auf(r(hx + 6 + k * 2), r(hy + 8 + k * 4), 'k3');
      // Geweih: Knoten an den Biegungen (kleine Harzperlen), Spitzen am Boden mit Erdklumpen
      [...stränge, ...strängeHinten].forEach(s => { const k = s.pts[2] || s.pts[1]; if (s.i % 2 === 0) P.auf(r(k[0]), r(k[1]), 'harz'); if (s.ey >= fy - 1) { P.set(r(s.ex) - 1, fy, 'k1'); P.set(r(s.ex) + 1, fy, 'k1'); } });
      // Auge: groß, rund, im Kopf unter dem Geweih
      if (augen) { P.auge(hx, hy - 1, 2); augenL.push([r(hx), r(hy - 1)]); P.auf(r(hx - 8), r(hy + 5), 'k0'); }
    };
    gruppen.forEach(g => { g.anker = [0, 0]; });
    return { gruppen, details, augen: augenL };
  },
};
