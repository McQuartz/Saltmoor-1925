// Gezeitenwerk: Die Ölerin. Ein gebeugter Umhang aus geöltem Tuch. Wo der Kopf sein müsste, sitzt eine
// Ölkanne; ihr langer dünner Ausguss reicht wie ein Schnabel bis zum Boden. Der Deckel steht offen,
// darin leuchtet das Öl. Mit sieben Fingern hält sie den Lappen, mit dem sie die anderen wieder gängig macht.
'use strict';
const LIB = require('../lib');
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}

module.exports = {
  id: 'oelerin', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 96, h: 120, fuss: [54, 116], kopf: [50, 14], rimBis: 113,
  varianten: {
    oelerin_a: { buckel: 0, schwanen: false, zweiteKanne: false },
    oelerin_b: { buckel: 3, schwanen: true, zweiteKanne: true },
  },
  // Silhouetten-Probe (verworfen, nur im Verlauf beschrieben): ein breiter Umhang mit der Kanne tief am Kragen
  // war ein Block mit einem Stock; die Kanne verschwand in der Fläche. Genommen: schmaler Leib, Hals, Kanne als Kopf.
  proben: {
    probe_block: { buckel: 0, schwanen: false },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f, W = 96, H = 120, B = v.buckel;
    let lean = 0, hy = 0, sp = 0, spY = 0, hem = 0, atem = 0, fall = 0, tropf = 0, arm = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; hem = [0, 1, 1, 0][f]; tropf = f; }
    if (p.angriff) { lean = [5, 3, -10, -3][f]; hy = [-6, -9, 4, 1][f]; sp = [10, 14, -12, -2][f]; spY = [-16, -22, 8, 2][f]; arm = [-2, -3, 3, 1][f]; hem = [0, 1, 3, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; hy = [-3, -1][f]; sp = 4; spY = -6; }
    if (p.tod) { fall = r(p.q * 30); lean = r(-p.q * 6); sp = r(p.q * 6); spY = r(p.q * 14); }
    const T = atem + fall, top = 50 - B + T;
    // Umhang: schmal und hoch, nach vorn gebeugt; der Buckel trägt einen Riemen
    const umhang = Pg([[46 + lean, top], [60 + lean, top - 4 - B], [70 + r(lean / 2), top + 4], [74, 80 + T * 0.5], [78, 104], ...saum(80, 38, 113, 7, 4, 5, hem), [38, 102], [42 + r(lean / 3), 78 + T * 0.5]], null, { rd: 1.5 });
    const schulter = E(54 + lean, top + 4, 11, 7, null, { pf: 'bevel' });
    // Falten: dunkle Täler und helle Grate abwechselnd, vom Buckel schräg nach unten
    const taeler = [[56, top + 6, 50, 108], [64, top + 4, 62, 110], [71, top + 14, 74, 108], [48, top + 12, 43, 106]].map(([a, b, c, d]) => C(a + lean, b, c + r(hem * 0.5), d, 0.7, 1.5, 'dunkel'));
    const grate = [[60, top + 4, 57, 104], [68, top + 10, 69, 106], [52, top + 10, 47, 104]].map(([a, b, c, d]) => C(a + lean, b, c + r(hem * 0.5), d, 0.6, 1.2, 'haut'));
    const riemen = [C(48 + lean, top + 2, 74, top + 30, 1.2, 1.2, 'dunkel')];
    // Hals: dünn, nach vorn oben; die Kanne sitzt darauf wie ein Kopf
    const kx = 40 + lean + r(sp * 0.3), ky = 30 + T + hy + r(spY * 0.15);
    const hals = glied([[50 + lean, top + 2], [45 + lean + r(sp * 0.15), top - 8 + r(hy * 0.5)], [kx + 3, ky + 5]], 3, 2.2, null);
    // Kanne: flacher, breiter Leib, oben ein Kegel, der in den Ausguss übergeht; Deckel steht offen
    const kanne = Pg([[kx - 9, ky + 4], [kx + 10, ky + 4], [kx + 11, ky - 1], [kx + 6, ky - 3], [kx - 2, ky - 6], [kx - 8, ky - 5], [kx - 11, ky - 1]], null, { rd: 1 });
    const kanneBand = Pg([[kx - 10, ky + 1], [kx + 11, ky + 1], [kx + 11, ky + 3], [kx - 10, ky + 3]], 'dunkel', { rd: 0.2 });
    const deckel = Pg([[kx + 2, ky - 5], [kx + 8, ky - 11], [kx + 10, ky - 10], [kx + 5, ky - 4]], null, { rd: 0.4 });
    // Ausguss: lang und dünn aus der Kegelspitze, erst waagerecht nach vorn, dann bis fast zum Boden
    const t0 = [kx - 10, ky - 3];
    const tip = [6 + lean * 0.3 - sp, (v.schwanen ? 70 : 82) + spY + r(fall * 0.4)];
    const mid = v.schwanen ? [kx - 30 - sp * 0.5, ky - 14 + spY * 0.3] : [kx - 26 - sp * 0.6, ky + 2 + spY * 0.2];
    const ausguss = glied([t0, mid, tip], 2.2, 0.8, null);
    // Arm mit dem Lappen: aus dem Umhang vorn, sieben Finger um das Tuch
    const sh = [46 + lean, top + 12], el = [34 + lean + arm, top + 30], hd = [40 + lean + arm * 2, top + 44];
    const armP = glied([sh, el, hd], 2.4, 1.5, null);
    const lappen = Pg([[hd[0] - 3, hd[1]], [hd[0] + 5, hd[1] - 1], ...saum(hd[0] + 6, hd[0] - 4, hd[1] + 14 + (p.idle ? hem : 0), 4, 3, 21, hem)], 'haut', { rd: 0.6 });
    const finger = [];
    for (let i = 0; i < 7; i++) finger.push(C(hd[0] - 3 + i * 1.2, hd[1] - 1, hd[0] - 4 + i * 1.3, hd[1] + 3 + (i % 2), 0.6, 0.5, null));
    // zweite Kanne (Variante b): klein, am Riemen an der Hüfte
    const kanne2 = v.zweiteKanne ? [E(76, 84 + T, 5, 5.5, null), C(76, 78 + T, 74, 72 + T, 1.2, 1, null)] : [];
    const kapuze = [schulter];
    const gruppen = [
      { p: [umhang], k: 2, anker: [0, r(T)] },
      { p: taeler, k: 0, noRim: true, anker: [0, r(T)] },
      { p: grate, k: 0, noRim: true, tone: 0.06, anker: [0, r(T)] },
      { p: riemen, k: 0, noRim: true },
      { p: kanne2, k: 0.5, kante: true },
      { p: kapuze, k: 1.5, kante: true, anker: [0, r(T)] },
      { p: hals, k: 1, kante: true },
      { p: armP, k: 0.5, kante: true },
      { p: [lappen], k: 0.5, tone: -0.05, kante: true },
      { p: finger, k: 0, kante: true },
      { p: ausguss, k: 0.6 },
      { p: [kanne], k: 1, kante: true },
      { p: [kanneBand], k: 0, noRim: true },
      { p: [deckel], k: 0, kante: true },
    ];
    gruppen.forEach(g => { if (!g.anker) g.anker = [r(lean), r(T)]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('gezeitenwerk'));
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Schnalle am Riemen
      P.auf(62 + lean, top + 16, 'bronze'); P.auf(63 + lean, top + 17, 'bronze');
      // Kanne: Nieten am Band, Fingerabdrücke (sieben) auf dem Bauch der Kanne
      for (let i = -4; i <= 4; i += 2) P.auf(kx + i * 2, ky + 2, 'r1');
      for (let i = 0; i < 7; i++) P.auf(kx - 5 + i * 1.4, ky - 1 - (i === 0 || i === 6 ? 0 : 1), i % 2 ? 'k3' : 'k2');
      // offener Hals: darin leuchtet das Öl (das Auge der Ölerin)
      if (!p.tod || f < 1) {
        const ox = r(kx + 3), oy = r(ky - 4);
        P.set(ox - 1, oy, 'glut'); P.set(ox, oy, 'kern'); P.set(ox + 1, oy, 'glut'); P.set(ox, oy + 1, 'glutDim');
        P.glow(ox + 0.5, oy + 2, 6, 0.8); P.set(ox, oy, 'kern'); augen.push([ox, oy]);
        // ein Tropfen leuchtendes Öl bildet sich an der Spitze und fällt
        const tx = r(tip[0]), ty = r(tip[1]);
        if (p.idle) { const d = [0, 1, 3, 7][tropf]; P.set(tx, ty + 1 + d, tropf === 0 ? 'glutDim' : 'glut'); if (tropf === 3) P.set(tx, ty + 7, 'glutDim'); }
        else P.set(tx, ty + 1, 'glut');
        // Spur im Ausguss: ein Faden Licht
        P.auf(r((t0[0] + mid[0]) / 2), r((t0[1] + mid[1]) / 2) - 1, 'glutDim');
      }
    };
    return { gruppen, details, augen };
  },
};
