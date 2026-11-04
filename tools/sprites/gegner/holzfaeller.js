// Wald (Akt III): Der Holzfäller der Legion. Ein Legionär mit Helm, Schienenpanzer und Dolabra,
// der seit neunzehnhundert Jahren denselben Baum fällt. Der Baum ist sein eigener linker Arm:
// ein Stammstück, waagerecht nach vorn, voller Kerben. Unter dem Helm ist kein Gesicht, sondern eine
// Schnittfläche mit Jahresringen; in den Ringen sitzen zwei Harztropfen als Augen.
'use strict';
module.exports = {
  id: 'holzfaeller', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [50, 116], kopf: [48, 14], rimBis: 113,
  varianten: {
    holzfaeller_a: { arm: 0.84, kerben: 4, helm: 1 },
    holzfaeller_b: { arm: 0.72, kerben: 6, helm: 1.1, zweig: true, schief: 2 },
  },
  // Silhouetten-Proben (nicht gebaut). probe1 = genommen (Axt hoch, Holzarm nach vorn).
  // probe2 (verworfen): die Axt steckt in der eigenen Schulter, beide Arme hängen als Äste zum Boden.
  // Las sich als gebückter Baum ohne Römer, der Helm verschwand im Buckel.
  proben: { probe1: { arm: 1, kerben: 4, helm: 1 }, probe2: { haengend: true, arm: 1, kerben: 3, helm: 1 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let atem = 0, lean = 0, axA = 0, axX = 0, axY = 0, armDy = 0, fall = 0, augen = true, splitter = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; axA = [0, 0.02, 0.04, 0.02][f]; armDy = [0, 0, 1, 1][f]; }
    // Angriff: weit zurück ausholen, über den Kopf, mit Gewicht nach vorn unten durch, zurückfedern
    if (p.angriff) { lean = [3, 1, -6, -2][f]; axA = [0.55, 0.15, -2.15, -1.1][f]; axX = [3, 0, -6, -2][f]; axY = [-1, -3, 4, 1][f]; armDy = [1, 0, 3, 1][f]; splitter = f === 2 ? 1 : 0; }
    if (p.treffer) { lean = [3, 1][f]; axA = [0.25, 0.1][f]; armDy = [-2, -1][f]; }
    if (p.tod) { fall = r(p.q * 22); augen = f < 1; lean = r(p.q * 4); axA = p.q * 0.9; armDy = r(p.q * 10); }
    const T = atem + fall, sch = v.schief || 0;
    const ox = lean; // Oberkörper
    const fy = 115;
    // Beine mit Sandalenriemen (Caligae): Schritt nach vorn, Gewicht auf dem hinteren Bein
    const hy = 80 + r(fall * 0.6);
    const beinL = glied([[44 + r(ox / 2), hy], [38, 98 + r(fall * 0.2)], [34, fy]], 4.2, 3, null);
    const beinR = glied([[56 + r(ox / 2), hy], [60, 98 + r(fall * 0.2)], [63, fy]], 4.2, 3, null);
    const fussL = E(32, fy - 1, 5, 2.2, null), fussR = E(65, fy - 1, 4.6, 2.2, null);
    // Tunika mit Lederstreifen (Pteruges) unter dem Panzer
    const rockY = 70 + T;
    const rock = Pg([[38 + ox, rockY], [62 + ox, rockY], [65 + r(ox / 2), hy + 2], ...saum(66 + r(ox / 2), 35 + r(ox / 2), hy + 7, 6, 3, 5, 0), [34 + r(ox / 2), hy + 2]], null, { rd: 0.8 });
    // Panzer: vier Schienen, jede ein eigenes Teil mit eigener Fase
    const top = 44 + T + sch;
    const schienen = [];
    for (let i = 0; i < 4; i++) {
      const y0 = top + 6 + i * 6, w0 = 15 - i * 1.2, w1 = 14 - i * 1.4;
      schienen.push(Pg([[48 + ox - w0, y0], [48 + ox + w0 + 1, y0 - 1], [48 + ox + w1 + 1, y0 + 6.5], [48 + ox - w1, y0 + 7]], null, { rd: 0.6 }));
    }
    const brust = Pg([[34 + ox, top + 2], [62 + ox, top], [64 + ox, top + 10], [32 + ox, top + 12]], null, { rd: 1 });
    // Schulterschienen: drei gewölbte Bügel je Seite, der rechte höher (der Arm mit der Axt)
    const schulterL = [0, 1, 2].map(i => E(33 + ox - i * 1.5, top + 2 + i * 3.4, 7 - i, 3.2, null, { pf: 'bevel' }));
    const schulterR = [0, 1, 2].map(i => E(63 + ox + i * 1.2, top + i * 3.4, 6.5 - i, 3, null, { pf: 'bevel' }));
    // Helm (Galea): Kalotte, breiter Nackenschirm nach hinten rechts, Wangenklappe vorn; Kamm-Halter oben
    const kx = 46 + ox - sch, ky = 30 + T + sch, hm = v.helm;
    const kalotte = E(kx, ky - 2, 8.5 * hm, 7.5 * hm, null, { pf: 'bevel' });
    const nacken = Pg([[kx + 4, ky - 1], [kx + 10 * hm, ky + 2], [kx + 13 * hm, ky + 5], [kx + 12 * hm, ky + 6], [kx + 5, ky + 4]], null, { rd: 0.5 });
    const wange = Pg([[kx - 8, ky + 1], [kx - 4, ky + 1], [kx - 4, ky + 10], [kx - 8, ky + 8]], null, { rd: 0.6 });
    const schirm = Pg([[kx - 10 * hm, ky - 1], [kx + 2, ky - 2], [kx + 2, ky], [kx - 10 * hm, ky + 1]], null, { rd: 0.4 });
    const knauf = E(kx + 1, ky - 9 * hm, 1.6, 2, null);
    // Helmbusch aus Rosshaar, längs, steht wie ein Kamm (macht ihn auf Entfernung zum Römer)
    const busch = Pg([[kx - 9, ky - 11 * hm], [kx - 4, ky - 15 * hm], [kx + 6, ky - 16 * hm], [kx + 13, ky - 13 * hm], [kx + 9, ky - 10 * hm], [kx - 6, ky - 9 * hm]], null, { rd: 0.8 });
    // Gesicht: Schnittfläche eines Stamms (Holz, eine Stufe heller), sitzt in der Helmöffnung
    const gesicht = E(kx - 1.5, ky + 4, 5.8, 6, 'haut', { pf: 'flat' });
    const hals = C(kx + 2, ky + 8, 48 + ox, top + 2, 3, 4, null);
    // Rechter Arm mit der Dolabra: Schulter -> Ellbogen -> Hände am Stiel
    const sx = 62 + ox, sy = top + 3;
    const ax0 = sx + 6 + axX, ay0 = sy - 14 + axY; // Hände
    const ang = -1.25 - axA; // Stiel-Richtung (von den Händen aus, nach oben)
    const sL = 30, ex = ax0 + Math.cos(ang) * sL, ey = ay0 + Math.sin(ang) * sL; // Kopf der Axt
    const armR = glied([[sx, sy], [sx + 8 + axX * 0.3, sy - 4 + axY * 0.5], [ax0, ay0]], 3.6, 2.6, null);
    const stiel = C(ax0 - Math.cos(ang) * 6, ay0 - Math.sin(ang) * 6, ex, ey, 1.2, 1.1, null);
    // Dolabra-Kopf: Beil nach vorn (links), Hacke nach hinten
    const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2); // quer zum Stiel
    const beil = Pg([[ex + nx * 1, ey + ny * 1], [ex - nx * 9 + Math.cos(ang) * 4, ey - ny * 9 + Math.sin(ang) * 4], [ex - nx * 10 - Math.cos(ang) * 3, ey - ny * 10 - Math.sin(ang) * 3], [ex - Math.cos(ang) * 2, ey - Math.sin(ang) * 2]], null, { rd: 0.4 });
    const hacke = C(ex, ey, ex + nx * 9 - Math.cos(ang) * 2, ey + ny * 9 - Math.sin(ang) * 2, 1.6, 0.7, null);
    // Linker Arm: ein Stammstück, waagerecht nach vorn, mit Kerben; am Ende Zweige statt Finger
    const al = v.arm, aY = top + 8 + armDy;
    const armHolz = v.haengend
      ? glied([[34 + ox, aY], [26, aY + 30], [22, fy - 2]], 5, 3, null)
      : [C(36 + ox, aY, 34 + ox - 30 * al, aY + 6, 6.6, 5.4, null), E(34 + ox - 30 * al, aY + 6, 5.2, 5.6, null, { pf: 'flat' }), ...glied([[24 + ox, aY - 2], [21 + ox, aY - 9], [22 + ox, aY - 11]], 1.8, 1.2, null)];
    const ende = [34 + ox - 30 * al, aY + 6];
    const zweige = v.haengend ? [] : [
      ...glied([[ende[0] - 2, ende[1] - 2], [ende[0] - 8, ende[1] - 7], [ende[0] - 11, ende[1] - 6]], 1.2, 0.6, null),
      ...glied([[ende[0] - 3, ende[1] + 1], [ende[0] - 11, ende[1] + 1], [ende[0] - 14, ende[1] + 4]], 1.1, 0.55, null),
      ...glied([[ende[0] - 1, ende[1] + 3], [ende[0] - 5, ende[1] + 10], [ende[0] - 4, ende[1] + 14]], 1, 0.5, null),
      ...(v.zweig ? glied([[ende[0] + 8, ende[1] - 3], [ende[0] + 6, ende[1] - 12], [ende[0] + 9, ende[1] - 16]], 1, 0.5, null) : []),
    ];
    const gruppen = [
      { p: [stiel], k: 0, pf: 'flat' },
      { p: [beil, hacke], k: 0 },
      { p: armR, k: 1 },
      { p: [beinR, fussR], k: 1 },
      { p: [beinL, fussL], k: 1 },
      { p: [rock], k: 1, tone: 0.05 },
      { p: [brust], k: 1, tone: 0.1 },
      ...schienen.map((s, i) => ({ p: [s], k: 0, tone: 0.12 - i * 0.03 })),
      { p: schulterR, k: 0.5, tone: 0.1 },
      { p: [hals], k: 0 },
      { p: [busch], k: 0.5, tone: -0.05 },
      { p: [nacken, kalotte, knauf], k: 1.2, tone: 0.1 },
      { p: [gesicht], k: 0 },
      { p: [wange, schirm], k: 0.5, tone: 0.05 },
      { p: schulterL, k: 0.5, tone: 0.08 },
      { p: zweige, k: 0.5 },
      { p: armHolz, k: 1, tone: 0.06 },
    ];
    const augenL = [];
    const details = P => {
      // Jahresringe im Gesicht: konzentrisch um einen Kern, der unten links sitzt (der Baum wuchs schief)
      const gx = r(kx - 1), gy = r(ky + 4);
      for (let yy = gy - 6; yy <= gy + 6; yy++) for (let xx = gx - 6; xx <= gx + 6; xx++) {
        if (((xx + 0.5 - (kx - 1)) / 5) ** 2 + ((yy + 0.5 - (ky + 4)) / 5.5) ** 2 > 0.85) continue;
        const d = Math.hypot(xx - (gx - 1), (yy - (gy + 1)) * 0.9);
        if (Math.round(d) % 2 === 0) P.auf(xx, yy, 'k2'); else P.auf(xx, yy, d > 3.5 ? 'r1' : 'k3');
      }
      // Holzarm: Rinde als Längsrillen, Kerben der Axt (Keile mit hellem Splint), Schnittfläche am Ende mit Ringen
      if (!v.haengend) {
        const x0 = 34 + ox, x1 = ende[0];
        for (let x = r(x1 + 4); x < x0 - 2; x++) { const t = (x0 - x) / (x0 - x1), yc = aY + 6 * t; if ((x & 3) !== 1) P.auf(x, r(yc - 2), 'k1'); P.auf(x, r(yc + 2), 'k0'); if ((x % 5) === 2) P.auf(x, r(yc), 'k1'); }
        for (let k = 0; k < v.kerben; k++) {
          const t = 0.18 + k * (0.62 / v.kerben), x = r(x0 - (x0 - x1) * t), yc = aY + 6 * t;
          P.auf(x, r(yc - 4), 'k0'); P.auf(x - 1, r(yc - 3), 'k0'); P.auf(x, r(yc - 3), 'harz'); P.auf(x + 1, r(yc - 3), 'k0'); P.auf(x, r(yc - 2), 'k1');
        }
        // Schnittfläche am Ende: Ringe, außen hell (Fase zum Licht)
        const cx = r(ende[0]), cy = r(ende[1]);
        for (let yy = cy - 5; yy <= cy + 5; yy++) for (let xx = cx - 5; xx <= cx + 5; xx++) { const d = Math.hypot(xx - cx - 1, yy - cy + 1); if (d > 4.6) continue; P.auf(xx, yy, Math.round(d) % 2 ? 'k3' : (d > 2.5 ? 'r1' : 'k2')); } P.auf(cx + 1, cy - 1, 'harz');
      }
      // Schienenpanzer: Lichtkante an der Oberseite jeder Schiene (rechte Hälfte), Nieten
      for (let i = 0; i < 4; i++) { const y0 = r(top + 6 + i * 6), w0 = 15 - i * 1.2; P.line(48 + ox + 2, y0, 48 + ox + w0 - 1, y0 - 1, 'r1', true); P.auf(48 + ox - w0 + 3, y0 + 3, 'k3'); P.auf(48 + ox + w0 - 2, y0 + 3, 'r1'); }
      P.line(36 + ox, r(top + 3), 60 + ox, r(top + 1), 'k3', true);
      // Gürtel (Cingulum) mit hängenden Riemen und Beschlägen
      P.line(37 + ox, r(rockY), 62 + ox, r(rockY), 'k3', true);
      for (let i = 0; i < 4; i++) { P.line(42 + ox + i * 2, r(rockY + 1), 42 + ox + i * 2 - 1, r(rockY + 8), 'k1', true); P.auf(42 + ox + i * 2 - 1, r(rockY + 8), 'r1'); }
      // Helm: Lichtkante am Nackenschirm, Wangenklappe mit Niete
      P.auf(r(kx - 6), r(ky + 5), 'r1');
      P.line(r(kx + 6), r(ky + 2), r(kx + 15 * hm), r(ky + 4), 'k3', true);
      // Busch: Borsten als senkrechte Striche
      for (let i = -7; i <= 10; i += 2) P.line(r(kx + i), r(ky - 14 * hm + Math.abs(i - 2) * 0.25), r(kx + i + 1), r(ky - 10 * hm), (i & 2) ? 'k0' : 'k2', true);
      // Tunika: Falten zwischen den Riemen, Knie
      for (const fx of [-8, 6, 12]) P.line(48 + r(ox / 2) + fx, r(rockY + 4), 48 + r(ox / 2) + fx + (fx > 0 ? 1 : -1), r(hy + 4), 'k0', true);
      for (let i = 0; i < 6; i++) { const px = r(36 + r(ox / 2) + i * 5.2); P.line(px, r(hy - 2), px, r(hy + 5), 'k0', true); P.auf(px + 2, r(hy + 4), i > 2 ? 'r1' : 'k3'); }
      P.auf(39, 97, 'k3'); P.auf(40, 96, 'k3'); P.auf(60, 97, 'r1');
      // Sandalenriemen
      for (const [bx, by] of [[36, 106], [36, 110], [61, 106], [62, 110]]) P.auf(bx, by, 'k3');
      // Axtblatt: Schneide blank (Randlicht innen)
      P.line(r(ex - nx * 9 + Math.cos(ang) * 3), r(ey - ny * 9 + Math.sin(ang) * 3), r(ex - nx * 10 - Math.cos(ang) * 2), r(ey - ny * 10 - Math.sin(ang) * 2), 'r1');
      if (splitter) { for (const [a, b] of [[-14, 4], [-18, 1], [-12, 9], [-20, 7]]) P.set(r(ex + a * 0.6), r(ey + b), 'harz'); }
      // Augen: zwei Harztropfen in den Ringen
      if (augen) { P.auge(gx - 2, gy - 1, 2); P.auge(gx + 2, gy + 1, 1); augenL.push([gx - 2, gy - 1], [gx + 2, gy + 1]); }
    };
    return { gruppen, details, augen: augenL };
  },
};
