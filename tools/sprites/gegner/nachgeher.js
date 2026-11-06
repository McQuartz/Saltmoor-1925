// Nachgeher (Schwarzes Eis, Neubau Auftrag 2, M5). Er hat einen Menschen sehr lange beobachtet und geht
// dir nach, nur falsch herum: rücklings im hohen Bogen auf Händen und Füßen, der Bauch oben.
// Der Kopf hängt kopfüber unter den Schultern, die Haare fallen bis fast zum Boden, das Hemd hängt nach unten.
// Er sieht dich an, das Gesicht steht auf dem Kopf: der Mund oben, die Augen unten.
// Silhouette: ein hoher Bogen aus Leib auf vier gewinkelten Gliedern, vorn ein hängender Kopf mit Haarvorhang.
'use strict';
module.exports = {
  id: 'nachgeher', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [54, 115], kopf: [54, 36], rimBis: 114,
  varianten: {
    nachgeher_a: { bogen: 0, hemd: false, haar: 6 },
    nachgeher_b: { bogen: 5, hemd: false, haar: 3, rippen: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A; const f = p.f;
    let atem = 0, lean = 0, hoch = 0, greif = 0, kopfS = 0, fall = 0, aus = false, schw = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; schw = [0, 1, 0, -1][f]; }
    if (p.angriff) { hoch = [3, 1, -2, 0][f]; lean = [3, 0, -5, -1][f]; greif = [0, 0.4, 1, 0.3][f]; kopfS = [0, -1, -3, -1][f]; schw = [1, 0, -2, -1][f]; }
    if (p.treffer) { lean = [3, 2][f]; hoch = -1; schw = 1; }
    if (p.tod) { fall = r(p.q * 30); aus = f >= 1; lean = r(p.q * 2); }
    const B = v.bogen + hoch, Y = Math.min(fall, 34), X = lean;
    // Leib: ein Bogen von der Schulter (links unten) über den Bauch (oben) zur Hüfte (rechts)
    const sch = [33 + X, 66 + Y * 0.5 - B * 0.3], brust = [40 + X, 55 + Y - B * 0.6], bauch = [54 + X * 0.6, 47 + Y - B], beck = [66 + X * 0.3, 52 + Y - B * 0.7], huef = [72, 61 + Y * 0.5 - B * 0.3];
    const leib = [C(sch[0], sch[1], brust[0], brust[1], 6.5, 8, null), C(brust[0], brust[1], bauch[0], bauch[1], 8, 7.5, null), C(bauch[0], bauch[1], beck[0], beck[1], 7.5, 8.5, null), C(beck[0], beck[1], huef[0], huef[1], 8.5, 6.5, null)];
    // Hemd hängt vom Bogen nach unten
    const hemd = v.hemd ? [Pg([[brust[0] - 2, brust[1] + 4], [bauch[0], bauch[1] + 5], [beck[0] + 2, beck[1] + 5], [beck[0], beck[1] + 9], ...saum(beck[0], brust[0] + 2, bauch[1] + 13 - r(fall * 0.3), 3, 9, 8, 0), [brust[0], brust[1] + 9]], 'dunkel', { rd: 1 })] : [];
    // Glieder: Arme vorn, Beine hinten; Ellbogen und Knie zeigen nach außen oben
    const fy = 113, g = greif;
    const armV = glied([[sch[0] - 1, sch[1]], [15 + X - g * 6, 78 + Y * 0.3 - g * 10], [13 + X - g * 6, fy - g * 22]], 3.4, 1.6, null);
    const fingerV = [glied([[13 + X - g * 6, fy - g * 22], [9 + X - g * 7, fy - g * 20]], 1.2, 0.6, null), glied([[13 + X - g * 6, fy - g * 22], [10 + X - g * 6, fy - g * 24 + 3]], 1.1, 0.6, null)];
    const armH = glied([[sch[0] + 5, sch[1] + 2], [36 + X * 0.5, 86 + Y * 0.3], [32 + X * 0.3, fy]], 3, 1.5, null);
    const beinV = glied([[huef[0], huef[1]], [88, 74 + Y * 0.4], [85, fy]], 4.2, 2, null);
    const beinH = glied([[huef[0] - 4, huef[1] + 1], [76, 88 + Y * 0.3], [71, fy]], 3.6, 1.8, null);
    const fuesse = [E(87, fy, 3.5, 1.6, null), E(73, fy, 3, 1.5, null)];
    // Kopf: hängt kopfüber unter der Schulter
    const kx = 29 + X + kopfS * 0.5, ky = 82 + Y * 0.6 + kopfS + atem;
    const hals = C(sch[0], sch[1] + 1, kx + 1, ky - 5, 3.4, 2.8, 'haut');
    const kopf = E(kx, ky, 6, 7, 'haut', { pf: 'bevel' });
    const haare = [];
    for (let i = 0; i < v.haar; i++) { const hx = kx - 4 + i * (8 / Math.max(1, v.haar - 1)), hl = 10 + ((i * 7) % 5) + (v.haar > 4 ? 6 : -3); haare.push(...glied([[hx, ky + 5], [hx + schw * 0.6 + (i - 2) * 0.4, ky + 5 + hl * 0.5], [hx + schw + (i - 2) * 0.8, Math.min(111, ky + 5 + hl)]], 1.1, 0.6, 'dunkel')); }
    const gruppen = [
      { p: [...armH, ...beinH], k: 1 },
      { p: hemd, k: 1 },
      { p: leib, k: 3, anker: [0, Y] },
      { p: [...beinV, ...fuesse], k: 1 },
      { p: [hals, kopf], k: 1.5 },
      { p: haare, k: 0 },
      { p: [...armV, ...fingerV.flat()], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Gesicht kopfüber: Mund oben (offen), Augen unten
      const mx = r(kx), my = r(ky - 3);
      P.auf(mx - 2, my, 'k0'); P.auf(mx - 1, my, 'k0'); P.auf(mx, my, 'k0'); P.auf(mx + 1, my, 'k0');
      if (p.angriff && f === 2) { P.auf(mx - 1, my - 1, 'k0'); P.auf(mx, my - 1, 'k0'); }
      P.auf(mx, my + 3, 'k1'); // Nase, falsch herum
      if (!aus) { P.set(mx - 2, my + 5, 'kern'); P.set(mx + 2, my + 5, 'glut'); P.glow(kx, my + 5.5, 5, 0.7); augen.push([mx - 2, my + 5], [mx + 2, my + 5]); }
      // Rippen auf dem Bauch (Variante b ohne Hemd)
      if (v.rippen) for (let i = 0; i < 4; i++) { const x = r(brust[0] + 4 + i * 4), y = r(brust[1] + (bauch[1] - brust[1]) * (0.3 + i * 0.22) + 3); P.auf(x, y, 'k0'); P.auf(x + 1, y + 1, 'k0'); P.auf(x - 1, y + 1, 'k3'); }
      // Nabel oben auf dem Bauch: er liegt verkehrt herum
      P.auf(r(bauch[0]), r(bauch[1] - 2), 'k0');
    };
    return { gruppen, details, augen };
  },
};
