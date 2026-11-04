// Der Kreuzgangwächter (Kloster der Abschrift). Ein Mönch, der sich zur Buße in den Kreuzgang stellte
// und das Stehen nie beendete: Säulenschaft, Würfelkapitell mit gemeißeltem Kapuzengesicht, zwei abgebrochene
// Bogenansätze wie Schultern. Unten zwei nackte, glatt getretene Menschenfüße. Um den Schaft der Strick der Kutte.
'use strict';
module.exports = {
  id: 'kreuzgangwaechter', biom: 'kloster', zone: 'kloster', w: 96, h: 120, fuss: [48, 115], kopf: [48, 8], rimBis: 113,
  varianten: {
    // breit: halbe Schaftbreite, hoch: Oberkante des Kapitells, bogen: Länge der Bogenansätze, dreh: gedrehter Schaft (Rillen)
    kreuzgangwaechter_a: { breit: 8, hoch: 30, bogen: 1, dreh: 0, risse: [[44, 60], [52, 82]] },
    kreuzgangwaechter_b: { breit: 7, hoch: 24, bogen: 0.75, dreh: 1, risse: [[50, 54], [43, 76], [51, 92]] },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let a = 0, atem = 0, fall = 0, augenAn = true, strick = 0, dx = 0;
    if (p.idle) { atem = [0, 0, -1, -1][f]; strick = [0, 1, 1, 0][f]; }
    if (p.angriff) { a = [-0.06, -0.14, 0.3, 0.1][f]; dx = [1, 2, -3, -1][f]; strick = [1, 2, -2, -1][f]; }
    if (p.treffer) { a = [-0.07, -0.03][f]; dx = [2, 1][f]; }
    if (p.tod) { a = p.q * 0.25; fall = r(p.q * 18); augenAn = f < 1; }
    // Drehung um den Fuß des Schafts (die Füße bleiben stehen). a > 0 kippt nach vorn (links).
    const px = 48 + dx, py = 103 + fall + atem;
    const R = ([x, y]) => { const X = x - 48, Y = y - 103; return [px + X * Math.cos(a) + Y * Math.sin(a), py - X * Math.sin(a) + Y * Math.cos(a)]; };
    const B = v.breit, top = v.hoch;
    const RP = pts => pts.map(R);
    // Basis (attisch: Wulst, Kehle, Wulst) und Plinthe
    const plinthe = Pg(RP([[48 - B - 6, 97], [48 + B + 6, 97], [48 + B + 6, 104], [48 - B - 6, 104]]), null, { rd: 0.8 });
    const wulst = Pg(RP([[48 - B - 4, 92], [48 + B + 4, 92], [48 + B + 5, 97], [48 - B - 5, 97]]), null, { rd: 1.2 });
    // Schaft mit leichter Schwellung
    const schaft = Pg(RP([[48 - B, top + 13], [48 + B, top + 13], [48 + B + 1, 62], [48 + B + 0.5, 92], [48 - B - 0.5, 92], [48 - B - 1, 62]]), null, { rd: 0.5 });
    const halsring = Pg(RP([[48 - B - 1.5, top + 11], [48 + B + 1.5, top + 11], [48 + B + 1.5, top + 14], [48 - B - 1.5, top + 14]]), null, { rd: 0.6 });
    // Würfelkapitell: oben Würfel, unten zur Rundung des Schafts geschnitten; darüber die Deckplatte
    const kap = Pg(RP([[48 - B - 9, top + 2], [48 + B + 9, top + 2], [48 + B + 9, top + 5], [48 + B + 2, top + 11], [48 - B - 2, top + 11], [48 - B - 9, top + 5]]), null, { rd: 1 });
    const platte = Pg(RP([[48 - B - 12, top - 3], [48 + B + 12, top - 3], [48 + B + 12, top + 2], [48 - B - 12, top + 2]]), null, { rd: 0.6 });
    // Bogenansätze: steigen aus der Deckplatte nach außen und oben, oben abgebrochen
    const bg = v.bogen, bl = 48 - B - 12, br = 48 + B + 12;
    // Mauerstück der Arkade über dem Kapitell: links und rechts springt je ein Rundbogen an (Unterseite hohl),
    // oben abgebrochen. Liest sich als Stück Kreuzgang, nicht als Hörner.
    const Rr = 17, tm = 0.62 + 0.45 * bg, yk = top - 3;
    const iL = [], iR = [];
    for (let k = 0; k <= 6; k++) { const t = tm * k / 6; iL.push([bl - Rr + Rr * Math.cos(t), yk - Rr * Math.sin(t)]); iR.push([br + Rr - Rr * Math.cos(t), yk - Rr * Math.sin(t)]); }
    const lx = iL[6][0], rx2 = iR[6][0], yo = iL[6][1] - 3;
    const bruch = []; for (let k = 1; k < 9; k++) bruch.push([lx + (rx2 - lx) * k / 9, yo - [2, 4, 1, 5, 3, 6, 2, 4, 1][k] + (k > 5 ? 2 : 0)]);
    const mauer = Pg(RP([[bl + 1, yk + 0.5], ...iL, [lx - 1, yo + 1], ...bruch, [rx2 + 1, yo + 2], ...iR.slice().reverse(), [br - 1, yk + 0.5]]), null, { rd: 0.6 });
    // Füße: nackt, unter der Plinthe hervor
    const fuesse = [C(42 + r(dx / 2), 102, 40, 111, 3.6, 2.8, 'haut'), C(55 + r(dx / 2), 102, 56, 111, 3.6, 2.8, 'haut'), E(36, 113, 6.5, 2.6, 'haut'), E(55, 113, 5.5, 2.6, 'haut')];
    // Strick um den Schaft, Knoten hängen herab
    const [sx0, sy0] = R([48 - B + 1, 70]);
    const strickTeile = glied([[sx0, sy0], [sx0 - 2 + strick * 0.5, sy0 + 8], [sx0 - 3 + strick, sy0 + 17]], 1.2, 1.0, 'dunkel');
    const gruppen = [
      { p: fuesse, k: 1 },
      { p: [plinthe, wulst], k: 1, anker: [0, atem] },
      { p: [schaft], k: 0, pf: 'bevel', anker: [0, atem] },
      { p: [halsring], k: 0, anker: [0, atem] },
      { p: [kap, platte], k: 1, anker: [0, atem] },
      { p: [mauer], k: 0, anker: [0, atem] },
      { p: strickTeile, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Trommelfugen und Risse im Schaft, Rillen bei der gedrehten Variante
      for (const yy of [52, 72]) { const [x0, y0] = R([48 - B, yy]), [x1, y1] = R([48 + B, yy]); P.line(r(x0), r(y0), r(x1), r(y1), 'k0', true); }
      if (v.dreh) for (let k = -B + 3; k < B; k += 4) for (let yy = top + 15; yy < 91; yy++) { const [x, y] = R([48 + k + ((yy * 0.25) % 4), yy]); if ((yy & 1) === 0) P.auf(r(x), r(y), 'k1'); }
      for (const [rx, ry] of v.risse) { let x = rx, y = ry; for (let k = 0; k < 7; k++) { const [X, Y] = R([x, y]); P.auf(r(X), r(Y), 'k0'); x += (k % 3) - 1; y += 1; } }
      // Salzausblühung am Fuß: helle Krümel (Salz aus der Watt-Luft)
      for (let k = 0; k < 14; k++) { const x = 48 - B - 4 + ((k * 7) % (2 * B + 8)), y = 86 + ((k * 5) % 9); const [X, Y] = R([x, y]); if (k % 3 === 0) P.auf(r(X), r(Y), 'r1'); else if (k % 3 === 1) P.auf(r(X), r(Y), 'k3'); }
      // Gesicht unter der Kapuze, gemeißelt in die Stirnseite des Kapitells
      const [fx, fy] = R([46, top + 6]);
      const X = r(fx), Y = r(fy);
      for (let k = -6; k <= 6; k++) { const yy = Y - 3 + Math.round((k * k) / 8); P.auf(X + k, yy - 1, 'k0'); if (Math.abs(k) < 5) P.auf(X + k, yy - 2, 'k3'); }
      P.auf(X - 6, Y - 1, 'k0'); P.auf(X + 6, Y - 1, 'k0'); P.auf(X - 6, Y, 'k0'); P.auf(X + 6, Y, 'k0');
      if (augenAn) {
        P.auge(X - 3, Y, 1); P.auge(X + 2, Y, 1); P.set(X - 2, Y, 'glut'); P.set(X + 3, Y, 'glutDim');
        augen.push([X - 3, Y], [X + 2, Y]);
      } else { P.set(X - 3, Y, 'k0'); P.set(X + 2, Y, 'k0'); }
      // Mund: ein waagerechter Schlitz, atmet (offen in Bild 2/3)
      P.auf(X - 1, Y + 3, 'k0'); P.auf(X, Y + 3, 'k0'); if ((p.idle && f >= 2) || (p.angriff && f === 2)) { P.auf(X - 1, Y + 4, 'k0'); P.auf(X, Y + 4, 'k0'); }
      // Fugen der Bogensteine (radial) und Bruchkante oben
      for (const sgn of [-1, 1]) for (let k = 1; k <= 3; k++) { const t = tm * k / 3.5, c0 = sgn < 0 ? bl - Rr : br + Rr; for (let q = 0; q <= 5; q++) { const rr = Rr + q; const [X2, Y2] = R([c0 - sgn * rr * Math.cos(t), yk - rr * Math.sin(t)]); P.auf(r(X2), r(Y2), 'k0'); } }
      for (const [bx, by] of bruch) { const [Xb, Yb] = R([bx, by + 1]); P.auf(r(Xb), r(Yb), 'k3'); }
      // Zehen
      for (const [tx, ty] of [[31, 114], [33, 114], [35, 114], [51, 114], [53, 114]]) P.auf(tx, ty, 'k0');
    };
    return { gruppen, details, augen };
  },
};
