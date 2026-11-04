// Erbauer-Mumie (Namenlose Stadt, Neubau Auftrag 2, M5). Einer der Erbauer, die nicht aufrecht gingen:
// ein Echsenleib in Binden, der hockt wie ein Wasserspeier, mit langem Hals und langer Schnauze.
// Die Vorderarme haben ein Gelenk zu viel und knicken zweimal. Vor der Schnauze sitzt eine flache,
// helle Maske mit einem Menschengesicht. Das ist das Relief, und es zeigt dich.
// Silhouette: ein hockender Wasserspeier mit gestrecktem Hals, Schnauze mit Maske, eingerolltem Schwanz, hängenden Bindenenden.
'use strict';
module.exports = {
  id: 'mumie', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [54, 115], kopf: [30, 26], rimBis: 114,
  varianten: {
    mumie_a: { hals: 1, kamm: false, gelenke: 2 },
    mumie_b: { hals: 1.25, kamm: false, gelenke: 3, mehrBinden: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, chain } = A; const f = p.f;
    let atem = 0, stoss = 0, lean = 0, fall = 0, aus = false, schw = 0, klaue = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; schw = [0, 1, 1, 0][f]; }
    if (p.angriff) { stoss = [-0.3, 0.2, 1, 0.4][f]; lean = [2, 0, -4, -1][f]; klaue = [0, 1, 1, 0][f]; schw = f; }
    if (p.treffer) { lean = [3, 2][f]; stoss = -0.3; }
    if (p.tod) { fall = r(p.q * 16); aus = f >= 1; stoss = -p.q * 0.5; lean = r(p.q * 3); }
    const T = fall, H = v.hals;
    // Keule und Hinterbein: hockt, Knie vorn, Fuß lang
    const keule = E(66 + lean * 0.3, 91 + fall * 0.4, 14, 12, null);
    const bein = glied([[62, 96 + fall * 0.4], [52, 104], [57, 112]], 5.4, 3.2, null);
    const fuss = glied([[57, 112], [48, 113], [43, 114]], 2.8, 1.4, null);
    // Rumpf: steigt schräg von der Keule zu den Schultern, gewickelter Buckel
    const sx = 45 + lean, sy = 58 + T;
    const rumpf = C(66 + lean * 0.3, 89 + fall * 0.4, sx, sy, 12, 9.5, null);
    const buckel = E(59 + lean * 0.6, 67 + T, 11, 10, null);
    // Schwanz: rollt sich nach rechts hinten ein
    const schwanz = chain(75, 99 + fall * 0.4, 0.2, 9, 4.2, 4.5, 1, null, q => -0.32 - Math.sin(q * 3 + schw * 0.5) * 0.05);
    // Hals und Kopf: lang nach vorn oben, die Schnauze zeigt schräg nach unten
    const kx = Math.max(18, sx - 12 * H - stoss * 16), ky = sy - 16 * H + stoss * 4 + atem;
    const hals = C(sx + 2, sy + 2, kx + 4, ky + 2, 6.5, 4.5, null);
    const schaedel = E(kx + 3, ky, 8.5, 5.5, null);
    const sn = [kx - 11, ky + 4];
    const schnauze = C(kx + 1, ky + 1, sn[0], sn[1], 4.6, 3.6, null);
    const kamm = v.kamm ? [Pg([[kx + 1, ky - 5], [kx + 6, ky - 15], [kx + 9, ky - 7], [kx + 13, ky - 12], [kx + 13, ky - 2], [kx + 7, ky - 2]], null, { rd: 0.6 })] : [];
    // Maske: flach, hell, ein Menschengesicht vor der Schnauze
    const mx = sn[0] + 1, my = sn[1] - 1;
    const maske = Pg([[mx - 5, my - 7], [mx + 3, my - 7], [mx + 5, my - 1], [mx + 2, my + 7], [mx - 3, my + 7], [mx - 6, my]], 'haut', { rd: 1, pf: 'flat', tone: 0.2 });
    // Vorderarme: lang, zwei oder drei Knicke, Klauen auf dem Boden
    const g = v.gelenke, hb = klaue * 8;
    const armPts = g === 3 ? [[sx - 2, sy + 4], [sx - 10, sy + 16], [sx - 4, sy + 27], [sx - 12, sy + 40 - hb], [sx - 14 - hb * 0.5, 113 - hb]] : [[sx - 2, sy + 4], [sx - 10, sy + 20], [sx - 3, sy + 33], [sx - 12 - hb * 0.5, 113 - hb]];
    const armV = glied(armPts, 3.6, 2, null);
    const armH = glied([[sx + 6, sy + 6], [sx + 1, sy + 22], [sx + 7, sy + 34], [sx + 2, 113]], 3.2, 1.9, null);
    const hand = armPts[armPts.length - 1];
    const krallen = [glied([hand, [hand[0] - 5, hand[1] + 1]], 1.4, 0.7, null), glied([hand, [hand[0] - 3, hand[1] - 2], [hand[0] - 7, hand[1] - 1]], 1.2, 0.6, null)];
    // lose Bindenenden hängen herab
    const lose = [[sx - 9, sy + 19, 7], [kx + 2, ky + 5, 9], [kx - 6, ky + 4, 6], [74 + 4 * 4.2, 92 + fall * 0.4, 7], [56 + lean * 0.6, 78 + T, 6], ...(v.mehrBinden ? [[sx + 4, sy + 2, 10], [66, 84 + T, 8]] : [])].map(([x, y, n], i) => chain(x, y, Math.PI / 2 + 0.15 * (i % 2 ? 1 : -1), n, 2, 2.1, 0.8, null, q => Math.sin(q * 4 + i + schw * 0.4) * 0.12));
    const gruppen = [
      { p: armH, k: 1 },
      { p: schwanz, k: 1 },
      { p: [keule, bein, fuss].flat(), k: 2 },
      { p: [rumpf, buckel], k: 3, anker: [0, T] },
      { p: kamm, k: 0 },
      { p: [hals, schaedel, schnauze], k: 2.5, anker: [0, T + atem] },
      { p: lose.flat(), k: 0 },
      { p: [...armV, ...krallen.flat()], k: 1 },
      { p: [maske], k: 0, anker: [0, T + atem] },
    ];
    const augen = [];
    const details = P => {
      // Wicklung: schräge Binden über allen Gliedern, abwechselnd dunkle Fuge und helle Kante
      for (let y = 20; y < 114; y++) for (let x = 4; x < 94; x++) {
        if (Math.abs(x - mx) < 7 && Math.abs(y - my) < 9) continue;
        const yy = x < sx + 4 && y < sy + 2 ? y - atem : y; const d = (x * 0.6 + yy + 300) % 5; const c = P.get(x, y); if (!c || c > 4) continue;
        if (d < 1) P.set(x, y, 'k0'); else if (d < 2 && (!P.get(x + 2, y - 1) || !P.get(x + 3, y))) P.set(x, y, 'r1'); else if (d < 1.8) P.set(x, y, 'k3'); else if (d < 2.6 && c < 3 && c > 1) P.set(x, y, c + 1);
      }
      // Maske: Menschengesicht im Relief (Brauen, Nase, Mund), die Augen glimmen
      P.line(mx - 4, my - 3, mx - 2, my - 4, 'k1', true); P.line(mx + 1, my - 4, mx + 3, my - 3, 'k1', true);
      P.line(mx, my - 1, mx, my + 2, 'k1', true); P.line(mx - 2, my + 4, mx + 2, my + 4, 'k0', true);
      if (!aus) { P.set(r(mx - 3), r(my - 2), 'glut'); P.set(r(mx + 2), r(my - 2), 'kern'); P.glow(mx, my - 1.5, 4, 0.5); augen.push([r(mx - 3), r(my - 2)], [r(mx + 2), r(my - 2)]); }
      // Echsenauge am Schädel hinter der Maske, matt
      if (!aus) P.auf(r(kx + 3), r(ky - 1), 'glutDim');
    };
    return { gruppen, details, augen };
  },
};
