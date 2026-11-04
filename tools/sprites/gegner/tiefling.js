// Tiefling (Hafen, Neubau Auftrag 2, M5). Junger Fischer mit dem Erbe des Großvaters.
// Was falsch ist: Der Kopf ist breit und flach wie ein Fischkopf und sitzt ohne Hals tief zwischen den Schultern.
// Die Augen quellen seitlich aus dem Kopf und sehen in zwei Richtungen. Das Maul ist zu breit, mit Unterbiss,
// am Hals öffnen sich Kiemen, über den Hinterkopf läuft ein Flossenkamm. Die Hände haben Schwimmhäute
// und hängen bis zu den Knien, die Füße sind lang und flach. Er trägt noch das Ölzeug.
// Silhouette: ein gebückter Fischer in steifer Jacke, der Kopf breit und flach mit zwei seitlichen Augenbuckeln
// und einem Flossenkamm, lange Arme mit Fächerhänden, lange flache Füße.
'use strict';
module.exports = {
  id: 'tiefling', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [48, 115], kopf: [46, 30], rimBis: 114,
  varianten: {
    tiefling_a: { kb: 13.5, muetze: true, kamm: 0.9, arm: 1 },
    tiefling_b: { kb: 15, muetze: false, kamm: 1.1, arm: 1.1, krumm: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A; const f = p.f;
    let atem = 0, lean = 0, maul = 0, vor = 0, fall = 0, aus = false, kiemen = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; kiemen = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, -2, -7, -2][f]; maul = [0, 1, 3, 1][f]; vor = [0, 0.4, 1, 0.3][f]; kiemen = 1; }
    if (p.treffer) { lean = [3, 2][f]; maul = 1; }
    if (p.tod) { fall = r(p.q * 24); aus = f >= 1; lean = r(p.q * 2); }
    const K = v.krumm || 0, T = fall, X = lean;
    // Beine: dünn, Knie leicht gebeugt, lange flache Füße
    const beine = [...glied([[42, 84], [38, 98], [41, 112]], 3.6, 2.4, null), ...glied([[54, 84], [57, 98], [55, 112]], 3.4, 2.3, null)];
    const fuesse = [Pg([[44, 110], [30, 112], [27, 115], [44, 115]], null, { rd: 1 }), Pg([[57, 110], [46, 112], [44, 115], [59, 115]], null, { rd: 1 })];
    // Jacke: Ölzeug, steif, Schultern hochgezogen, gebückt
    const sy = 58 + T + K;
    const jacke = Pg([[38 + X, sy + 1], [48 + X, sy - 2], [58 + X, sy + 1], [60 + X * 0.6, sy + 14], [61, 89], [35, 89], [36 + X * 0.6, sy + 14]], null, { rd: 2.5 });
    const kragen = [];
    const naht = [C(47 + X, sy + 4, 47, 87, 0.6, 0.8, 'dunkel')];
    // Kopf: breit, flach, ohne Hals; Augenbuckel stehen seitlich aus der Kontur
    const kx = 47 + X - K, ky = sy - 9 + atem + (p.angriff ? -maul * 0.5 : 0), kb = v.kb;
    const kopf = E(kx, ky, kb, 6.5, 'haut', { pf: 'bevel' });
    const kiefer = Pg([[kx - kb + 1, ky + 2], [kx + kb - 2, ky + 2], [kx + kb - 4, ky + 6 + maul], [kx - kb + 2, ky + 7 + maul]], 'haut', { rd: 1.5 });
    const augL = E(kx - kb + 1, ky - 1, 3.6, 3.4, null, { pf: 'dome' }), augR = E(kx + kb - 1, ky - 2, 3.4, 3.2, null, { pf: 'dome' });
    const km = v.kamm, kamm = Pg([[kx - 5, ky - 6], [kx - 2, ky - 6 - 8 * km], [kx + 1, ky - 7 - 3 * km], [kx + 4, ky - 6 - 9 * km], [kx + 7, ky - 6 - 4 * km], [kx + 11, ky - 4 - 7 * km], [kx + 14, ky + 1], [kx + 5, ky - 3]], null, { rd: 0.5 });
    const muetze = v.muetze ? [Pg([[kx - 9, ky - 5], [kx - 4, ky - 10], [kx + 5, ky - 10], [kx + 9, ky - 6], [kx + 1, ky - 4]], 'dunkel', { rd: 1.2 }), C(kx - 11, ky - 5, kx + 2, ky - 5, 1.1, 1, 'dunkel')] : [];
    // Arme: lang, hängen bis zu den Knien, Fächerhände mit Schwimmhaut
    const a = v.arm, hL = [27 + X - vor * 12, 94 * a - (a - 1) * 60 - vor * 18], hR = [68 + X * 0.3, 94 * a - (a - 1) * 60];
    const armL = glied([[38 + X, sy + 3], [27 + X - vor * 6, sy + 18 - vor * 4], hL], 3.2, 1.9, null);
    const armR = glied([[57 + X, sy + 3], [68 + X * 0.5, sy + 18], hR], 3, 1.8, null);
    const facher = (h, s) => Pg([[h[0] - 1, h[1] - 1], [h[0] + 3 * s, h[1] - 1], [h[0] + 4 * s, h[1] + 7], [h[0] + 1 * s, h[1] + 9], [h[0] - 2 * s, h[1] + 8]], null, { rd: 0.6 });
    const handL = facher(hL, vor > 0.6 ? -1 : 1), handR = facher(hR, -1);
    const gruppen = [
      { p: [...armR, handR], k: 1 },
      { p: [...beine, ...fuesse], k: 1 },
      { p: [jacke], k: 2 },
      { p: naht, k: 0, noRim: true },
      { p: [kamm], k: 0.5 },
      { p: [kopf, kiefer], k: 1.5, anker: [0, ky] },
      { p: [augL, augR], k: 0 },
      { p: muetze, k: 1 },
            { p: [...armL, handL], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Maul: breite, nach unten gezogene Linie, beim Biss weit offen mit Zahnreihe
      const my = r(ky + 3);
      for (let i = -kb + 3; i <= kb - 4; i++) P.auf(r(kx + i), my + (Math.abs(i) > kb - 6 ? 1 : 0), 'k0');
      if (maul) { for (let k = 1; k <= maul; k++) for (let i = -kb + 4; i <= kb - 5; i++) P.auf(r(kx + i), my + k, 'k0'); for (let i = -kb + 4; i <= kb - 5; i += 2) P.auf(r(kx + i), my + 1, 'r1'); }
      // Kiemen am Kieferwinkel, öffnen sich beim Atmen
      for (let i = 0; i < 3; i++) { const x = r(kx + kb - 5 - i * 2), y = r(ky + 6); P.auf(x, y, 'k0'); P.auf(x, y + 1, kiemen ? 'r1' : 'k0'); }
      // Augen: dunkle Augäpfel, kleine leuchtende Pupille, schauen in zwei Richtungen
      if (!aus) {
        const L = [r(kx - kb), r(ky - 1)], R = [r(kx + kb - 1), r(ky - 2)];
        P.glow(L[0] + 0.5, L[1] + 0.5, 4, 0.5); P.glow(R[0] + 0.5, R[1] + 0.5, 3.5, 0.4);
        P.set(L[0], L[1], 'kern'); P.set(L[0] - 1, L[1], 'glut'); P.set(R[0] + 1, R[1], 'glut'); P.set(R[0], R[1], 'glutDim');
        augen.push(L, R);
      } else { P.auf(r(kx - kb), r(ky - 1), 'k0'); P.auf(r(kx + kb - 1), r(ky - 2), 'k0'); }
      // Schwimmhaut zwischen den Fingern: dunkle Linien
      for (const [h, s] of [[hL, vor > 0.6 ? -1 : 1], [hR, -1]]) { P.line(h[0], h[1] + 1, h[0] + 3 * s, h[1] + 7, 'k0', true); P.line(h[0], h[1] + 1, h[0], h[1] + 8, 'k1', true); }
    };
    return { gruppen, details, augen };
  },
};
