// Wächter Wald (Akt III): Der Wurzelstock. Oben an der Decke, wo die Wurzeln des umgekehrten Waldes
// sich zu einem Gewölbe verflechten, hängt ein Stock, älter als der Wald. In seiner Rinde ist ein Gesicht.
// Er lässt Arme aus Ästen herunter, bis auf den Boden, und mit jedem Zug wird es einer mehr.
// Drei Sheets: wurzelstock (2 Arme), wurzelstock_p2 (4 Arme), wurzelstock_p3 (6 Arme, das Harz im Mund kocht).
'use strict';
module.exports = {
  id: 'wurzelstock', biom: 'wald', zone: 'wald', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 4], rimBis: 173,
  varianten: {
    wurzelstock: { arme: 2, wut: 0 },
    wurzelstock_p2: { arme: 4, wut: 1 },
    wurzelstock_p3: { arme: 6, wut: 2 },
  },
  // probe1 genommen: hängt von oben, Arme fallen bis zum Boden (der Wald wächst nach unten).
  // probe2 verworfen: ein Stumpf, der auf Wurzelbeinen steht, das Gesicht vorn. Las sich als
  // gewöhnlicher Baum-Riese aus jedem Märchenfilm (Klischee) und verlor das Hängen.
  proben: { probe1: { arme: 4, wut: 1 }, probe2: { arme: 2, wut: 0, steht: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, chain } = A;
    const f = p.f, n = v.arme;
    let hub = 0, lean = 0, schwung = 0, sway = 0, mund = 0, fall = 0, augen = true, schlaff = 0, stossX = 0;
    if (p.idle) { sway = [0, 1, 1, 0][f]; mund = [0, 0, 1, 0][f]; }
    // Angriff: Arme ziehen sich hoch (der Stock hebt sich an seinen Wurzeln), dann fallen alle Arme schräg nach vorn
    if (p.angriff) { hub = [-4, -10, 6, 2][f]; schwung = [0.2, 0.45, -1, -0.35][f]; lean = [1, 2, -5, -2][f]; mund = [1, 2, 3, 1][f]; stossX = [0, 2, -14, -5][f]; }
    if (p.treffer) { lean = [4, 2][f]; schwung = [0.25, 0.1][f]; mund = 2; }
    if (p.tod) { schlaff = p.q; fall = r(p.q * 30); augen = f < 1; mund = 0; }
    const steht = !!v.steht;
    const cx = 80 + lean, fy = 175;
    // Stock: oben breit (dort, wo die Wurzeln ansetzen), nach unten schmaler; hängt
    const st = (steht ? 70 : 36) + hub + fall, sb = (steht ? 150 : 104) + hub + fall; // Oberkante, Unterkante
    const stock = Pg([[cx - 34, st - 2], [cx - 12, st - 8], [cx + 14, st - 8], [cx + 36, st - 2], [cx + 30, st + 14], [cx + 28, st + 40], [cx + 22, sb - 14], [cx + 10, sb], [cx + 3, sb + 14], [cx - 1, sb + 22], [cx - 4, sb + 12], [cx - 12, sb], [cx - 22, sb - 14], [cx - 28, st + 40], [cx - 31, st + 14]], null, { rd: 3 });
    // Rindenwülste: senkrechte Leisten, jede ein eigenes Teil (Binnenform)
    const leisten = [[-26, 0.02, 0.62], [-16, -0.02, 0.18], [0, -0.04, 0.14], [16, -0.02, 0.2], [26, 0.02, 0.6], [-6, 0.82, 1.05], [7, 0.8, 1.0]].map(([dx, a, b]) => C(cx + dx, st + (sb - st) * a, cx + dx * 0.75, st + (sb - st) * b, 3, 2, null));
    // Wurzelkrone: dicke Wurzeln gehen nach oben aus dem Bild (an der Decke fest), dünne breiten sich aus und kringeln
    const wurzeln = [];
    if (!steht) {
      const W = [[-24, -1.9, 44, 6.5], [-10, -1.68, 50, 7], [6, -1.5, 50, 7.5], [20, -1.3, 46, 6.5], [-34, -2.5, 40, 3.2], [36, -0.6, 40, 3.2], [-28, -2.2, 52, 2.6], [30, -0.9, 52, 2.6]];
      W.forEach(([dx, a, len, d], i) => { const kette = chain(cx + dx, st + 2, a, 6, len / 6, d, i < 4 ? 2.4 : 0.6, null, (q, k) => (i % 2 ? 1 : -1) * (i > 3 ? 0.12 : 0.03) * (k > 2 ? 1.5 : 1)); wurzeln.push(...kette); });
    } else {
      for (let i = 0; i < 6; i++) { const s = i < 3 ? -1 : 1, k = i % 3; wurzeln.push(...glied([[cx + s * (8 + k * 6), sb - 8], [cx + s * (22 + k * 10), sb + 6], [cx + s * (26 + k * 12), fy]], 4, 2, null)); }
    }
    // Arme: hängen herab wie das ganze Holz dieses Waldes. Sie stehen nicht, sie baumeln: Schulter am Stock
    // (oder an der Wurzelkrone), ein Knick, dann hängt der Unterarm senkrecht, die Hand offen nach unten.
    const arme = [];
    const ansatz = [[-10, 'u', 44], [12, 'u', 48], [-24, 's', 58], [26, 's', 52], [-44, 'w', 76], [46, 'w', 70]];
    for (let i = 0; i < (steht ? 2 : n); i++) {
      const [dx, wo, lang] = ansatz[i], s = dx < 0 ? -1 : 1;
      const x0 = cx + dx * (wo === 'u' ? 0.7 : 1), y0 = wo === 'u' ? sb - 6 : wo === 's' ? st + 40 : st + 4;
      const sw = (s < 0 ? 1.4 : 0.9) * schwung, sz = (i % 2 ? 1 : -1) * sway * 0.7;
      // Ellbogen: etwas nach außen, Hand: darunter, beim Schlag nach vorn (links) gerissen
      const ex = x0 + s * (wo === 'w' ? 8 : 6) + sw * 10 + sz * 0.5, ey = y0 + lang * 0.42 + hub * 0.3;
      const hx = ex + s * 2 + sw * 34 + stossX * (s < 0 ? 1 : 0.5) + sz + schlaff * s * 10, hy = Math.min(fy - 6, ey + lang * 0.58 * (1 - Math.abs(sw) * 0.25) - hub * 0.5 + schlaff * 14);
      const pts = [[x0, y0], [ex, ey], [(ex + hx) / 2 + s * 1.5, (ey + hy) / 2], [hx, hy]];
      // Hand: Zweige hängen offen nach unten, gespreizt
      const fa = Math.atan2(hy - ey, hx - ex);
      const finger = [-0.45, -0.1, 0.3, 0.6].map((d, k) => chain(hx, hy, fa + d + (k % 2 ? 0.1 : -0.1) * sway, 3, 3 + (k === 1 ? 1.4 : 0.6), 1.2, 0.5, null, (q, kk) => (kk ? 0.2 : 0) * (d < 0 ? -1 : 1))).flat();
      const dick = wo === 'u' ? 4 : wo === 's' ? 3.4 : 2.8;
      arme.push({ i, wo, g: [...glied(pts, dick, 1.9, null), E(hx, hy, 2.6, 2.4, null), ...finger], knoten: [ex, ey], hand: [hx, hy] });
    }
    const hinten = arme.filter(a => a.wo !== 'u'), vorne = arme.filter(a => a.wo === 'u');
    // Gesicht: Brauenwülste, tiefe Augenhöhlen, Nasengrat, Mund als Riss
    const gx = cx - 3, gy = st + 30;
    const brauen = [Pg([[gx - 19, gy - 9], [gx - 3, gy - 7], [gx - 3, gy - 3], [gx - 18, gy - 4]], 'haut', { rd: 1.2 }), Pg([[gx + 3, gy - 7], [gx + 18, gy - 10], [gx + 18, gy - 5], [gx + 3, gy - 3]], 'haut', { rd: 1.2 })];
    const nase = Pg([[gx - 2, gy - 5], [gx + 2, gy - 5], [gx + 4, gy + 12], [gx - 3, gy + 13]], 'haut', { rd: 1 });
    const wangen = [Pg([[gx - 20, gy + 6], [gx - 6, gy + 7], [gx - 8, gy + 15], [gx - 17, gy + 13]], 'haut', { rd: 1.5 }), Pg([[gx + 6, gy + 7], [gx + 20, gy + 5], [gx + 17, gy + 13], [gx + 8, gy + 15]], 'haut', { rd: 1.5 })];
    const gruppen = [
      { p: wurzeln, k: 1.2, tone: -0.05 },
      { p: hinten.flatMap(a => a.g), k: 0.6, tone: -0.08 },
      { p: [stock], k: 3, tone: 0.1 },
      ...leisten.map((l, i) => ({ p: [l], k: 0, tone: 0.06 + (i % 2) * 0.05 })),
      { p: wangen, k: 1, tone: 0.05 },
      { p: brauen, k: 0.6, tone: 0.1 },
      { p: [nase], k: 0.6, tone: 0.08 },
      { p: vorne.flatMap(a => a.g), k: 0.6 },
    ];
    const augenL = [];
    const details = P => {
      // Maserung: das Holz fließt in Ringen um die Augen und den Mund, wie um Astlöcher (Binnenform des Stocks)
      const knoten = [[gx - 10, gy], [gx + 10, gy], [gx, gy + 22]];
      for (let y = r(st - 6); y <= r(sb + 4); y++) for (let x = r(cx - 34); x <= r(cx + 36); x++) {
        const c = P.get(x, y); if (c < 1 || c > 4) continue;
        let d = 1e9; for (const [kx, ky] of knoten) d = Math.min(d, Math.hypot(x + 0.5 - kx, (y + 0.5 - ky) * 0.8));
        if (d < 8 || d > 30) continue;
        const t = d / 3.8, ring = t - Math.floor(t) < 0.27, seite = (x - cx) * 0.9 - (y - (st + sb) / 2) * 0.5 > 6;
        if (ring) P.set(x, y, seite ? 'k3' : 'k0');
      }
      // Augenhöhlen: tief, darin glimmt Harz; Wut macht das Glimmen größer
      for (const s of [-1, 1]) {
        const ax = r(gx + s * 10), ay = r(gy);
        P.el(ax, ay, 6, 4.2, 'k0', true);
        if (augen) { P.glow(ax + 0.5, ay + 0.5, 7 + v.wut * 2, 1, 'glutDim', 'k1'); P.set(ax, ay, 'kern'); P.set(ax - s, ay, 'glut'); P.set(ax + s, ay, 'harz'); P.set(ax, ay + 1, 'harz'); P.set(ax, ay - 1, 'glut'); if (v.wut) { P.set(ax + s * 2, ay, 'harzhell'); P.set(ax - s, ay + 1, 'harzhell'); } augenL.push([ax, ay]); }
      }
      // Mund: senkrechter Riss unter der Nase, öffnet sich; Harz tropft heraus (Wut: es kocht)
      const my = r(gy + 17), mh = 10 + mund * 2;
      for (let y = 0; y < mh; y++) { const w = Math.round(Math.sin((y + 0.5) / mh * Math.PI) * (2.6 + mund * 0.8)); for (let x = -w; x <= w; x++) P.auf(gx + x, my + y, Math.abs(x) === w ? 'k1' : 'k0'); }
      if (augen) { P.set(gx, my + 2, 'glutDim'); P.set(gx, my + mh - 2, v.wut > 1 ? 'harzhell' : 'harz'); P.set(gx, my + mh, 'harz'); P.set(gx, my + mh + 1 + (p.idle ? f % 2 : 0), 'glutDim'); if (v.wut > 1) { P.set(gx - 1, my + mh - 3, 'harz'); P.set(gx + 1, my + 3, 'harz'); } }
      // Jahresringe am Stockende unten (Schnittfläche): sichtbar als Bögen
      for (let k = 1; k <= 3; k++) P.line(r(cx - 12 + k * 2), r(sb - 4 + k), r(cx + 10 - k * 2), r(sb - 4 + k), k % 2 ? 'k3' : 'k1', true);
      // Rinde: Querrisse zwischen den Leisten, Licht auf den Kanten rechts oben
      for (let k = 0; k < 7; k++) { const y = r(st + 8 + k * 10), x = r(cx - 22 + (k * 13) % 40); P.line(x, y, x + 4, y + 1, 'k0', true); P.auf(x + 1, y - 1, 'k3'); }
      leisten.forEach((l, i) => { if (i === 3 || i === 4) P.line(r(l.x1 + 2), r(l.y1 + 2), r(l.x2 + 2), r(l.y2 - 2), 'r1', true); });
      // Arme: Knoten an den Ellbogen (Harzperlen), Hände
      arme.forEach(a => { P.auf(r(a.knoten[0]), r(a.knoten[1]), 'harz'); P.auf(r(a.knoten[0]) + 1, r(a.knoten[1]) - 1, 'r1'); });
      // Wurzeln: Harztränen an zwei Stellen, die Wurzelkrone leuchtet nicht, nur das Harz
      if (!steht) for (const [x, y] of [[cx - 20, st - 4], [cx + 22, st - 2], [cx + 4, st - 8]]) { P.auf(r(x), r(y), 'harz'); P.auf(r(x), r(y) + 1, 'glutDim'); }
    };
    gruppen.forEach(g => { g.anker = [0, r(hub + fall)]; });
    return { gruppen, details, augen: augenL };
  },
};
