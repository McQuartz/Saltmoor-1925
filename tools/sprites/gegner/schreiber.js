// Die Waage am Grund: Der Schreiber. Ein Zollschreiber auf dem hohen Kontorbock, über das Stehpult gebeugt,
// Ärmelschoner, Augenschirm, eine Messinglampe auf dem Pult. Er schreibt auf, was du bei dir trägst, Stück für
// Stück. Falsch ist das Papier: Die Liste wird nicht kürzer, sie wächst ihm aus dem Buch und steigt im Wasser
// nach oben, Bahn um Bahn, wie Tang. Er schreibt mit dem Finger; die Feder steckt hinter dem Ohr.
'use strict';
const K = require('./hilfe/kanten');

module.exports = {
  id: 'schreiber', biom: 'waage', zone: 'waage', w: 96, h: 120, fuss: [62, 115], kopf: [40, 6], rimBis: 113,
  varianten: {
    // a: Lampe auf dem Pult, drei Papierbahnen
    schreiber_a: { bahnen: 3, lampe: 'pult', akten: false, bock: 44 },
    // b: Hängelampe über ihm, vier schmalere Bahnen, unter dem Bock ein Aktenstapel
    schreiber_b: { bahnen: 4, lampe: 'haengend', akten: true, bock: 40 },
  },
  // Silhouetten-Proben (nicht gebaut): stehend am Pult ohne Bock (las sich wie der Leser im Kloster);
  // Papier fällt nach unten auf den Boden (las sich als Bart oder Schleier). Genommen: hoher Bock, Papier steigt.
  proben: {
    probe_stehend: { bahnen: 3, lampe: 'pult', akten: false, bock: 0 },
    probe_faellt: { bahnen: 3, lampe: 'pult', akten: false, bock: 44, faellt: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, auf = 0, stich = 0, wehen = f * 0.8, lampe = 1;
    // auf: Oberkörper richtet sich auf (Ausholen), stich: Hand fährt nach vorn
    if (p.idle) { atem = [0, 0, 1, 1][f]; wehen = [0, 0.2, 0.4, 0.2][f]; }
    if (p.angriff) { auf = [0.5, 1, 0.2, 0.1][f]; stich = [0, 0, 1, 0.4][f]; lean = [1, 2, -3, -1][f]; wehen = [0.5, 1.5, 3, 4][f]; lampe = [1, 1.1, 1.3, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; auf = 0.3; lampe = 0.7; }
    if (p.tod) { fall = r(p.q * 14); lean = r(p.q * 3); lampe = Math.max(0, 1 - p.q * 3); wehen = 2 + p.q * 4; }
    const T = fall, L = lean;
    const hoch = v.bock;               // Sitzhöhe über dem Boden
    const sy0 = 114 - hoch;            // Sitz
    // Kontorbock: Brett, vier gespreizte Beine, Querstrebe
    const bock = hoch ? [
      C(58, sy0 + 2, 53, 113, 1.4, 1.2, null), C(76, sy0 + 2, 80, 113, 1.4, 1.2, null),
      C(57, sy0 + 20, 79, sy0 + 20, 0.9, 0.9, null), Pg([[54, sy0 - 1], [80, sy0 - 2], [80, sy0 + 2], [54, sy0 + 3]], null, { rd: 0.6 }),
    ] : [];
    const bockH = hoch ? [C(62, sy0 + 2, 61, 111, 1.1, 1, null), C(72, sy0 + 2, 74, 111, 1.1, 1, null)] : [];
    // Pult: schräge Platte, Kasten, zwei Beine (links, zum Spieler hin)
    const pt = [8, 60 + (hoch ? 0 : 4)], pr = [36, 54 + (hoch ? 0 : 4)];
    const pult = [
      Pg([[pt[0] - 2, pt[1] + 1], [pr[0] + 2, pr[1] - 2], [pr[0] + 3, pr[1] + 2], [pt[0] - 1, pt[1] + 5]], null, { rd: 0.6 }),
      Pg([[pt[0] + 1, pt[1] + 4], [pr[0], pr[1] + 2], [pr[0] - 1, pr[1] + 12], [pt[0] + 2, pt[1] + 14]], null, { rd: 0.8 }),
      C(pt[0] + 4, pt[1] + 13, pt[0] + 2, 113, 1.3, 1.1, null), C(pr[0] - 4, pr[1] + 11, pr[0] - 2, 113, 1.3, 1.1, null),
      C(pt[0] + 3, 100, pr[0] - 3, 100, 0.8, 0.8, null),
    ];
    const buch = Pg([[pt[0] + 3, pt[1] - 1], [pr[0] - 3, pr[1] - 3], [pr[0] - 2, pr[1] - 1], [pt[0] + 4, pt[1] + 1]], 'haut', { rd: 0.5 });
    // Schreiber: Hüfte auf dem Sitz, Rücken als Buckel (Fragezeichen), langer Hals, Kopf weit vorn über dem Buch
    const hx = 68 + L * 0.3, hy = (hoch ? sy0 - 3 : 80) + T;
    const dy = -auf * 7, dx = L - auf * 1 - stich * 3;
    const shx = 56 + dx, shy = 40 + T + dy + (hoch ? 0 : 6);
    const ruecken = Pg([[hx + 7, hy + 2], [hx + 9, hy - 10], [hx + 9 + dx * 0.5, shy + 8], [hx + 5 + dx * 0.7, shy - 2], [shx + 8, shy - 5], [shx, shy - 3], [shx - 4, shy + 4], [shx + 1, shy + 14], [hx - 6, hy - 8], [hx - 9, hy + 2]], null, { rd: 3.5 });
    const kx = shx - 13 - stich * 3, ky = shy + 3 - auf * 3 + atem;
    const kopf = [E(kx, ky, 5, 6, 'haut'), C(shx - 1, shy + 1, kx + 3, ky + 1, 3.4, 2.4, 'haut'), E(kx - 4.5, ky + 2, 1.6, 1.8, 'haut')];
    const schirm = Pg([[kx - 11, ky - 3], [kx + 1, ky - 6], [kx + 2, ky - 4], [kx - 10, ky - 1]], 'dunkel', { rd: 0.4 });
    const band = C(kx - 4, ky - 4, kx + 5, ky - 5, 1.1, 1.1, 'dunkel');
    // Beine: Oberschenkel nach vorn, Unterschenkel hängen, Füße auf der Strebe
    const beinV = glied([[hx - 4, hy + 1], [hx - 15, hy + 2], [hx - 13, hy + 18], [hx - 9, hy + 22]], 3.8, 2.2, null);
    const beinH = glied([[hx + 2, hy], [hx - 10, hy], [hx - 7, hy + 16], [hx - 3, hy + 21]], 3.4, 2.2, null);
    // vorderer Arm: schreibt (Finger auf dem Buch); beim Ausholen hoch, beim Stich weit nach vorn
    const hand = stich ? [pt[0] - 4 + (1 - stich) * 14, pt[1] - 10] : auf ? [shx - 4, shy - 18 * auf] : [pt[0] + 14, pt[1] - 4];
    const ell = stich ? [shx - 12, shy + 6] : auf ? [shx - 10, shy + 4] : [shx - 4, shy + 15];
    const armV = [...glied([[shx + 1, shy + 2], ell, hand], 3.3, 2, null), C(hand[0], hand[1], hand[0] - 4, hand[1] + 1, 0.9, 0.6, 'haut')];
    const schoner = C(ell[0] + (hand[0] - ell[0]) * 0.15, ell[1] + (hand[1] - ell[1]) * 0.15, ell[0] + (hand[0] - ell[0]) * 0.7, ell[1] + (hand[1] - ell[1]) * 0.7, 3.1, 2.7, 'haut');
    const armH = glied([[shx + 7, shy + 1], [shx + 5, shy + 16], [pt[0] + 22, pt[1] - 2]], 2.8, 2, null);
    // Lampe: auf dem Pult (a) oder hängend über ihm (b)
    const lp = v.lampe === 'pult' ? [pr[0] - 2, pr[1] - 13] : [40, 16];
    const lampeF = v.lampe === 'pult'
      ? [C(pr[0] - 1, pr[1] - 1, lp[0], lp[1] + 2, 0.8, 0.8, null), Pg([[lp[0] - 6, lp[1] + 3], [lp[0] + 6, lp[1] + 2], [lp[0] + 3, lp[1] - 3], [lp[0] - 3, lp[1] - 2]], null, { rd: 0.6 }), E(pr[0] - 1, pr[1] - 1, 3, 1, null)]
      : [C(lp[0] + 1, -2, lp[0], lp[1] - 3, 0.6, 0.6, null), Pg([[lp[0] - 7, lp[1] + 3], [lp[0] + 7, lp[1] + 3], [lp[0] + 3, lp[1] - 3], [lp[0] - 3, lp[1] - 3]], null, { rd: 0.6 })];
    // Papierbahnen: wachsen aus dem Buch, steigen nach oben und wehen (links vom Kopf, zum Spieler hin)
    const bahnen = [];
    const fussPunkte = [];
    for (let b = 0; b < v.bahnen; b++) {
      const bx0 = pt[0] + 4 + b * (16 / v.bahnen), by0 = pt[1] - 1 - b * 1.2;
      const breite = v.bahnen > 3 ? 3.1 : 3.8, len = 36 + b * 4 + (b % 2 ? -5 : 3);
      const pts = []; const n = 10;
      for (let i = 0; i <= n; i++) {
        const q = i / n, y = v.faellt ? by0 + q * (112 - by0) : by0 - q * len;
        const x = bx0 + Math.sin(q * 3.6 + b * 1.7 + wehen) * (0.6 + q * 2.6) + (v.faellt ? -q * 4 : q * (b - 1.5) * 6);
        pts.push([x, y]);
      }
      fussPunkte.push(pts);
      for (let i = 0; i < n; i++) bahnen.push(C(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], breite * (1 - i / n * 0.25), breite * (1 - (i + 1) / n * 0.25), 'haut', { pf: 'flat', tone: 0.45 }));
    }
    // Akten unter dem Bock (b)
    const akten = v.akten ? [Pg([[58, 104], [78, 103], [79, 114], [57, 114]], null, { rd: 0.6 }), Pg([[60, 97], [76, 97], [75, 104], [61, 104]], null, { rd: 0.5 })] : [];
    const gruppen = [
      { p: bahnen, k: 0, kante: true },                         // 0 Papier steigt (hinter allem)
      { p: bockH, k: 0 },                                       // 1
      { p: akten, k: 0.5, kante: true },                        // 2
      { p: [beinH].flat(), k: 1 },                              // 3
      { p: bock, k: 0.5, kante: true },                         // 4
      { p: armH, k: 1, anker: [L, T] },                         // 5
      { p: [ruecken], k: 2, anker: [L, T], kante: true },       // 6
      { p: [beinV].flat(), k: 1, kante: true },                 // 7
      { p: kopf, k: 1.5, anker: [L, T], kante: true },                         // 8
      { p: [band, schirm], k: 0, kante: true },                 // 9
      { p: pult, k: 0.5, kante: true },                         // 10
      { p: [buch], k: 0, noRim: true },                         // 11
      { p: lampeF, k: 0, kante: true },                         // 12
      { p: [...armV, schoner], k: 1, anker: [L, T], kante: true },             // 13
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(96, 120, gruppen, LIB.palette('waage'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const g = (x, y) => (x < 0 || y < 0 || x >= 96 || y >= 120 ? -1 : gid[y * 96 + x]);
      const ziel = [];
      for (let y = 1; y < 119; y++) for (let x = 0; x < 95; x++) { const gi = g(x, y); if (gi < 0 || !gruppen[gi].kante) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1); const h = q => q >= 0 && q < gi; if (h(a) || (h(b) && h(d))) ziel.push([x, y]); }
      ziel.forEach(([x, y]) => P.set(x, y, 'r1'));
      // Papier im Wasserlicht: gedithert zwischen hellster Körperstufe und Messing-Randlicht
      for (let y = 0; y < 120; y++) for (let x = 0; x < 96; x++) if (gid[y * 96 + x] === 0) { const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, LIB.bay(x, y) < 0.45 + y / 400 ? 'r1' : 'k3'); }
      // Papier: Zeilen auf den Bahnen (feine dunkle Striche quer), die Lichtkante hell
      fussPunkte.forEach((pts, b) => { for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i]; for (let k = -1; k <= 1; k++) if ((i + k + b) % 3) P.auf(r(x) + k, r(y), 'k1'); if (i % 3 === 1) P.auf(r(x) + 1, r(y) - 2, 'papier'); } });
      K.licht(P, bahnen, { c: 'r2', c2: null, nur: (x, y) => gid[y * 96 + x] === 0 });
      // Rücken: Jackennaht entlang des Buckels, Hosenträger, Falten in der Hüfte
      const sx = r(shx), sy = r(shy);
      P.line(sx + 6, sy - 2, r(hx) + 6, r(hy) - 10, 'k0', true); P.line(sx + 7, sy - 2, r(hx) + 7, r(hy) - 10, 'k3', true);
      P.line(sx + 1, sy + 5, r(hx) - 5, r(hy) - 6, 'k0', true); P.line(sx + 2, sy + 4, r(hx) - 4, r(hy) - 7, 'r1', true);
      for (let i = 0; i < 3; i++) { P.line(r(hx) - 3 + i * 4, r(hy) - 6, r(hx) - 2 + i * 4, r(hy) + 1, 'k0', true); P.line(r(hx) - 2 + i * 4, r(hy) - 6, r(hx) - 1 + i * 4, r(hy) - 1, 'k3', true); }
      P.auf(r(hx) + 2, r(hy) - 4, 'messing');
      // Ärmelschoner: hell, mit Gummizug
      K.licht(P, [schoner], { c: 'r1', c2: 'k3' });
      // Augenschirm wirft Schatten, darunter die Augen (rot)
      if (!p.tod || f < 1) {
        const ex = r(kx - 3), ey = r(ky - 1);
        P.glow(ex + 0.5, ey + 0.5, 5, 0.7);
        P.set(ex, ey, 'glut'); P.set(ex + 3, ey, 'glut'); P.set(ex, ey, 'kern');
        augen.push([ex, ey]);
      }
      // Feder hinter dem Ohr
      P.line(r(kx + 2), r(ky - 2), r(kx + 7), r(ky - 8), 'r1'); P.set(r(kx + 7), r(ky - 9), 'papier');
      // Finger schreibt: Spur auf dem Buch in Siegelrot (die Tinte ist rot)
      if (!stich && !auf) { P.set(r(hand[0]) - 4, r(hand[1]) + 1, 'siegel'); P.set(r(hand[0]) - 5, r(hand[1]) + 1, 'siegel'); }
      // Buch: Seiten hell an der Kante, Zeilen
      for (let i = 0; i < 6; i++) P.auf(pt[0] + 5 + i * 4, pt[1] - 1 - i * 0.9, i % 2 ? 'papier' : 'k3');
      // Lampe: Licht unter dem Schirm, fällt auf Buch und Hände
      if (lampe > 0) {
        const lx = r(lp[0]), ly = r(lp[1] + 3);
        P.glow(lx + 0.5, ly + 4, 13 * lampe, 0.85, 'messing', 'k3');
        for (let x = lx - 3; x <= lx + 3; x++) P.set(x, ly + 1, Math.abs(x - lx) < 2 ? 'kern' : 'papier');
        P.set(lx, ly + 2, 'glut');
        augen.push([lx, ly + 1]);
      }
      // Bock: Holzmaserung
      if (hoch) P.line(56, sy0, 78, sy0 - 1, 'k3', true);
    };
    return { gruppen, details, augen };
  },
};
