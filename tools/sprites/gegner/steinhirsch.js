// Wald (Akt III): Der Steinhirsch. Ein Hirsch aus Stein, älter als die Legion, der Hirsch des Hains,
// dem man vor Rom die Geweihe brachte. Sein Geweih wächst nach unten, wie alles in diesem Wald:
// es hängt vom Kopf herab wie ein Vorhang aus Wurzeln, bis auf den Boden, und schleift mit.
// In den Rissen des Körpers steht Harz und glimmt.
'use strict';
module.exports = {
  id: 'steinhirsch', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [54, 116], kopf: [34, 14], rimBis: 113,
  varianten: {
    steinhirsch_a: { laenge: 1, risse: 3, breite: 0.86 },
    steinhirsch_b: { laenge: 0.8, risse: 4, buckel: 3, breite: 0.74 },
  },
  // probe1 genommen: Kopf hoch, das Geweih hängt wie ein Vorhang bis zum Boden.
  // probe2 verworfen: Kopf tief, das Geweih sticht nach vorn in den Boden. Las sich als grasendes Tier mit Rechen,
  // der Kopf verschwand zwischen den Beinen, das falsche Detail war nicht zu sehen.
  proben: { probe1: { laenge: 1, risse: 3, breite: 1 }, probe2: { laenge: 1, risse: 3, breite: 1, tief: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, kopfY = 0, kopfX = 0, sway = 0, vorne = 0, fall = 0, knick = 0, augen = true, hinten = 0;
    let wehen = 0;
    if (p.idle) { wehen = [0, 0.5, 1, 0.5][f]; }
    // Angriff: Kopf hoch, aufbäumen (Vorderbeine hoch), dann mit dem Geweihvorhang nach vorn schlagen, zurück
    if (p.angriff) { kopfY = [-2, -3, 6, 1][f]; kopfX = [2, 4, -10, -3][f]; vorne = [2, 6, -2, 0][f]; sway = [2, 4, -5, -1][f]; lean = [1, 2, -7, -2][f]; hinten = [0, 1, 0, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; kopfY = [-2, -1][f]; sway = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 18); knick = p.q; augen = f < 1; kopfY = r(p.q * 16); sway = r(p.q * 4); }
    const fy = 115, bk = v.buckel || 0;
    const T = fall;
    // Rumpf: schwerer Steinleib, Widerrist hoch (Buckel), Bauch durchhängend
    const bx = 64 + lean, by = 72 + T - vorne * 0.5;
    const rumpf = Pg([[bx - 22, by - 8 - bk], [bx - 14, by - 13 - bk], [bx, by - 11], [bx + 14, by - 10], [bx + 21, by - 6], [bx + 22, by + 3], [bx + 14, by + 9], [bx - 4, by + 11], [bx - 18, by + 8], [bx - 24, by + 1]], null, { rd: 2 });
    const schulter = E(bx - 16, by - 2 - vorne * 0.4, 9, 10, null, { pf: 'bevel' });
    const keule = E(bx + 14, by - 1, 9, 9, null, { pf: 'bevel' });
    // Hals und Kopf: Hals steil nach oben vorn, Kopf mit langem Äser nach links
    const hx = bx - 30 + kopfX, hy = (v.tief ? by + 22 : by - 36) + kopfY - vorne;
    const hals = C(bx - 17, by - 2 - vorne * 0.5, hx + 4, hy + 4, 8.5, 4.5, null);
    const kopf = E(hx + 2, hy, 7.5, 5.5, 'haut', { pf: 'bevel' });
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
    // Geweih: eine breite Krone wie bei jedem alten Hirsch, aber aus jeder Sprosse hängt ein Strang herab
    // wie Luftwurzeln, bis auf den Boden. Das Geweih wächst nach unten, wie der ganze Wald.
    const gx = hx + 4, gy = hy - 5, L = v.laenge, { chain } = A, br = v.breite || 1;
    const stangen = [], hängend = [[], []], spitzen = [];
    for (const s of [0, 1]) { // 0 = vordere Stange nach links, 1 = hintere nach rechts
      const d = s ? 1 : -1, o = s ? 4 : 0;
      const pts = [[gx + o, gy], [gx + o + d * 4 * br, gy - 9], [gx + o + d * 12 * br, gy - 16], [gx + o + d * 22 * br + sway * 0.3, gy - 19], [gx + o + d * 30 * br + sway * 0.5, gy - 17]];
      const sprossen = [[1, d * 2, -9], [2, d * 1, -10], [2, d * 7, -6], [3, d * 2, -8], [4, d * 4, 2]].map(([k, dx, dy]) => [pts[k], [pts[k][0] + dx * br, pts[k][1] + dy]]);
      stangen.push({ s, pts, sprossen });
      [pts[4], ...sprossen.map(x => x[1])].forEach((sp, j) => spitzen.push({ s, x: sp[0], y: sp[1], j }));
    }
    spitzen.forEach((sp, i) => {
      const links = sp.s === 0, lang = links ? (sp.j === 0 || sp.j === 3 ? 1 : 0.55) : (sp.j === 0 ? 0.45 : 0.25);
      const len = v.tief ? 14 : Math.min(fy - sp.y, (fy - sp.y) * lang * L);
      if (len < 6) return;
      const segN = Math.max(3, Math.round(len / 7)), ph = i * 1.9 + sway * 0.5 + (i % 3 === 0 ? wehen * 0.9 : 0);
      const kette = chain(sp.x, sp.y, Math.PI / 2 + (links ? 0.06 : -0.04), segN, len / segN, 0.95, 0.5, null, (qq, k) => Math.sin(ph + k * 1.4) * 0.14);
      hängend[sp.s].push(...kette);
      if (i % 2 === 0 && kette.length > 4) { const c = kette[Math.floor(kette.length * 0.5)]; hängend[sp.s].push(...chain(c.x2, c.y2, Math.PI / 2 + (i % 4 ? 0.5 : -0.45), 3, 3 + (i % 3), 0.8, 0.45, null, () => 0)); }
      if (kette.end[1] >= fy - 2) hängend[sp.s].push(E(kette.end[0], fy - 0.5, 2, 1, null));
    });
    const stangeGl = st => [...glied(st.pts, 2.6, 1.3, null), ...st.sprossen.flatMap(([a, b]) => glied([a, b], 1.3, 0.7, null))];
    const gruppen = [
      { p: [...stangeGl(stangen[1]), ...hängend[1]], k: 0.4, tone: -0.1 },
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
      { p: [...stangeGl(stangen[0]), ...hängend[0]], k: 0.4 },
    ];
    const augenL = [];
    const details = P => {
      // Risse im Stein, Harz darin (kleine Lichter), die Ränder der Risse fangen das Licht oben rechts
      const risse = [[[bx - 8, by - 10], [bx - 4, by - 3], [bx - 7, by + 4], [bx - 3, by + 9]], [[bx + 6, by - 9], [bx + 9, by - 2], [bx + 7, by + 6]], [[bx - 20, by - 1], [bx - 16, by + 4]], [[bx + 16, by - 6], [bx + 19, by + 1]]].slice(0, v.risse);
      risse.forEach((rr, k) => { for (let i = 0; i + 1 < rr.length; i++) { P.line(r(rr[i][0]), r(rr[i][1]), r(rr[i + 1][0]), r(rr[i + 1][1]), 'k0', true); P.line(r(rr[i][0]) + 1, r(rr[i][1]), r(rr[i + 1][0]) + 1, r(rr[i + 1][1]), 'k3', true); }
        const m = rr[1]; P.auf(r(m[0]), r(m[1]), k % 2 ? 'harz' : 'glutDim'); if (k === 0) { P.auf(r(m[0]), r(m[1]) + 1, 'harzhell'); } });
      // Schichtung des Steins: waagerechte Bänder auf dem Rumpf
      for (let k = 0; k < 3; k++) P.line(r(bx - 18), r(by - 4 + k * 5), r(bx + 18), r(by - 5 + k * 5), 'k1', true);
      // Binnenform: Schulterblatt und Keule als Kanten, Rippen als dunkle Bögen, Licht auf den oberen Kanten
      P.line(r(bx - 22), r(by - 8), r(bx - 10), r(by - 11), 'r1', true); P.line(r(bx + 8), r(by - 9), r(bx + 18), r(by - 8), 'r1', true);
      for (let k = 0; k < 4; k++) P.line(r(bx - 6 + k * 4), r(by + 1), r(bx - 8 + k * 4), r(by + 8), 'k0', true);
      P.line(r(bx - 24), r(by + 2), r(bx - 16), r(by + 9), 'k3', true); P.line(r(bx + 6), r(by + 1), r(bx + 12), r(by + 8), 'k3', true);
      // Fell/Steinmaserung am Hals: kurze Striche in Wuchsrichtung
      for (let k = 0; k < 4; k++) P.auf(r(hx + 6 + k * 2), r(hy + 8 + k * 4), 'k3');
      // Geweih: Knoten an den Biegungen (kleine Harzperlen), Spitzen am Boden mit Erdklumpen
      stangen.forEach(st => { P.auf(r(st.pts[0][0]), r(st.pts[0][1]) + 1, 'k3'); P.auf(r(st.pts[0][0]) + 1, r(st.pts[0][1]), 'k3'); P.auf(r(st.pts[3][0]), r(st.pts[3][1]) + 1, 'harz'); });
      // Auge: groß, rund, im Kopf unter dem Geweih
      if (augen) { P.auge(hx, hy - 1, 2); augenL.push([r(hx), r(hy - 1)]); P.auf(r(hx - 8), r(hy + 5), 'k0'); }
    };
    gruppen.forEach(g => { g.anker = [0, 0]; });
    return { gruppen, details, augen: augenL };
  },
};
