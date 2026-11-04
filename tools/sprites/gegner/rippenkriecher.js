// Der Rippenkriecher (Walkathedrale). Ein Flenser der Expedition, der im Brustkorb des Wals schlief.
// Seine eigenen Rippen sind ihm aus dem Rücken gewachsen, nach außen, zu einem Gewölbe wie das des Wals,
// und er kriecht auf den Händen darunter. Falsch: Die Rippenspitzen wachsen schon wieder nach innen, zu ihm.
// Inneres Licht: Unter dem Gewölbe ist seine Brust offen, das Mark glimmt und beleuchtet die Rippen von innen.
'use strict';
module.exports = {
  id: 'rippenkriecher', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [48, 115], kopf: [20, 82], rimBis: 113,
  varianten: {
    rippenkriecher_a: { rippen: 4, hoch: 0, spitzen: 1 },
    rippenkriecher_b: { rippen: 5, hoch: 7, spitzen: 2, lampe: true },
  },
  // verworfen: das Gewölbe steht allein auf den Rippen, der Mann hängt innen (liest sich als Käfig/Tierskelett)
  skizzen: { skizze_kaefig: { rippen: 5, hoch: 4, spitzen: 0, kaefig: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, atem = 0, arm = 0, kopfY = 0, fall = 0, glut = 1, zu = 0;
    // arm: 0 kriechend, 1 vordere Hand hoch ausgeholt, 2 Hand schlägt vorn auf, Rippen schnappen zu (zu)
    let dy = 0;
    if (p.idle) { dy = [0, 0, 1, 1][f]; glut = [1, .95, 1.1, 1][f]; kopfY = [0, 0, 1, 0][f]; }
    if (p.angriff) { lean = [3, 4, -6, -3][f]; arm = [0.5, 1, 2, 1.5][f]; zu = [0, 0.3, 1, 0.6][f]; glut = [1, 1.2, 1.5, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; glut = .6; zu = -0.4; }
    if (p.tod) { fall = r(p.q * 14); glut = Math.max(0, 1 - p.q * 2); lean = r(p.q * 2); zu = p.q * 0.6; }
    const T = atem + fall, H0 = v.hoch;
    // Rücken des Mannes: tief, waagerecht. Schulter vorn links, Becken hinten rechts.
    const sx = 30 + lean, sy = 88 + T, bx = 62 + lean, by = 90 + T;
    const ruecken = Pg([[sx - 4, sy - 6], [sx + 10, sy - 9], [bx - 2, by - 8], [bx + 7, by - 4], [bx + 6, by + 5], [bx - 4, by + 8], [sx + 8, sy + 9], [sx - 5, sy + 6]], null, { rd: 2.5 });
    // Beine: hinten eingeknickt, Knie am Boden, Füße hoch (kriechend)
    const beinH = glied([[bx + 4, by + 2], [bx + 10, 110], [bx + 22, 112], [bx + 27, 106]], 4.2, 2.2, null);
    const beinV = glied([[bx - 2, by + 4], [bx + 2, 111], [bx + 13, 113]], 3.6, 2.2, 'dunkel');
    // Kopf hängt tief vor der Schulter, fast am Boden
    const hx = sx - 11, hy = sy + 6 + kopfY + (arm >= 2 ? 3 : 0);
    const kopf = E(hx, hy, 7, 6, 'haut');
    const haar = [C(hx - 2, hy + 3, hx - 4, hy + 13, 1.6, 0.6, 'dunkel'), C(hx + 2, hy + 4, hx + 2, hy + 12, 1.4, 0.6, 'dunkel'), C(hx - 6, hy + 1, hx - 8, hy + 10, 1.2, 0.5, 'dunkel')];
    const hals = C(sx - 2, sy - 1, hx + 2, hy - 1, 3.6, 3, null);
    // Arme: lang, auf den Handballen. Vorderer Arm holt beim Angriff aus und schlägt auf.
    const handV = arm === 0 ? [sx - 20, 112] : arm < 1.5 ? [sx - 18 - arm * 4, 70 - arm * 6] : [sx - 26, 112];
    const ellV = arm === 0 ? [sx - 10, 100] : arm < 1.5 ? [sx - 18, 84] : [sx - 18, 96];
    const armV = [...glied([[sx + 1, sy - 2], ellV, handV], 3.4, 2.4, null), E(handV[0] - 2, handV[1] - 1, 3.4, 1.8, 'haut')];
    const armH = [...glied([[sx + 6, sy + 1], [sx - 2, 104], [sx - 8, 112]], 3, 2.2, 'dunkel'), E(sx - 10, 112, 3, 1.6, 'dunkel')];
    // Rippen wachsen aus dem Rückgrat, steigen als Bögen über ihn, und ihre Spitzen biegen nach innen, zu ihm zurück
    // Rippen als gebogene Sicheln, die aus dem Rückgrat fächern; die Spitzen haken nach innen, zu ihm
    const n = v.rippen, rippen = [], grat = [], { chain } = A;
    for (let i = 0; i < n; i++) {
      const q = i / (n - 1), xs = sx + 3 + (bx - sx) * q * 0.9, ys = sy - 7 + (by - sy) * q - 1;
      grat.push([xs, ys]);
      const a0 = v.kaefig ? -Math.PI / 2 : -Math.PI / 2 - 0.55 + q * 1.25 + zu * 0.35 * (1 - q), L = (v.kaefig ? 34 : 46 + H0) - q * 18;
      const seg = 7, krumm = v.kaefig ? -0.12 : 0.17 + q * 0.03;
      rippen.push(chain(xs, ys, a0, seg, L / seg, 3 - q * 0.6, 1, null, (qq, k) => (k === 0 ? 0 : k >= seg - 1 ? krumm * (3 + v.spitzen) : krumm)));
    }
    const wirbel = grat.map(([x, y]) => E(x + 1, y - 1, 3, 2.4, null));
    const gruppen = [
      ...rippen.slice().reverse().filter((_, k) => k % 2 === 0).map(rp => ({ p: rp, k: 0.6, tone: -0.1 })),
      { p: beinH, k: 1.2 },
      { p: armH, k: 1.2 },
      { p: [ruecken, hals], k: 2, anker: [lean, T] },
      { p: beinV, k: 1.2 },
      { p: [kopf, ...haar], k: 1, anker: [lean, T] },
      { p: wirbel, k: 1.4, anker: [lean, T] },
      ...rippen.slice().reverse().filter((_, k) => k % 2 === 1).map(rp => ({ p: rp, k: 0.6 })),
      { p: armV, k: 1.2 },
    ];
    const augen = [];
    const details = P => {
      // Offene Brust unter dem Gewölbe: das Mark glimmt, Licht fällt auf die Innenseiten der Rippen
      const mx = r(sx + 12), my = r(sy + 3);
      if (glut > 0) {
        P.glow(mx, my - 6, 22 * glut, 0.55, 'glutDim', 'k3');
        for (let y = my - 2; y <= my + 4; y++) for (let x = mx - 6; x <= mx + 7; x++) {
          const q = Math.hypot((x - mx) / 7, (y - my - 1) / 3.5); if (q > 1) continue;
          const t = glut * (1.1 - q) + (((x * 5 + y * 3 + f) % 4) - 1.5) * 0.08;
          P.auf(x, y, t > 0.85 ? 'kern' : t > 0.55 ? 'glut' : t > 0.3 ? 'mark' : 'glutDim');
        }
        // Rippenstümpfe der eigenen Brust, schwarz vor dem Glimmen
        for (let k = -4; k <= 5; k += 3) P.line(mx + k, my - 2, mx + k - 1, my + 4, 'k0', true);
        augen.push([mx, my]);
        // Rippenwurzeln fangen das Glimmen auf der Unterseite (warmes Licht von unten, gegen das kalte Randlicht)
        rippen.forEach((rp, i) => { const c = rp[0], c2 = rp[1]; for (let k = 0; k <= 6; k++) { const t = k / 6, x = r(c.x1 + (c2.x2 - c.x1) * t) - 1, y = r(c.y1 + (c2.y2 - c.y1) * t) + 1; if (P.get(x, y) && P.get(x, y) <= 4) P.set(x, y, k < 3 ? 'glutDim' : 'k3'); } });
        // Licht fällt auf Unterarm und Kinn
        P.glow(mx - 10, my + 6, 9 * glut, 0.5, 'glutDim', 'k3');
      }
      // Rücken: Wirbel als Knochenknoten zwischen den Rippen, Schulterblatt als Fase
      for (let k = 0; k <= 8; k++) { const t = k / 8, x = r(sx + 2 + (bx - sx) * t), y = r(sy - 8 + (by - sy) * t + Math.sin(t * Math.PI) * -1.5); P.auf(x, y, k % 2 ? 'r1' : 'bein'); P.auf(x, y + 1, 'k0'); }
      for (let k = 0; k < 6; k++) P.auf(r(sx + 4 + k), r(sy - 4 + Math.abs(k - 3) * 0.6), 'k3');
      // Hemdfetzen hängen unter dem Bauch
      for (let k = 0; k < 5; k++) { const x = r(sx + 14 + k * 5), y0 = r(sy + 7 + (k % 2)); for (let j = 0; j < 3 + (k % 3); j++) P.set(x + (j > 2 ? 1 : 0), y0 + j, j === 0 ? 'k2' : 'k1'); }
      // Gesicht: hängt nach unten, zwei Augen, eins weiter offen
      if (!p.tod || f < 1) { const ex = r(hx - 3), ey = r(hy + 1); P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut'); P.glow(ex + 1.5, ey + 0.5, 4, 0.6); augen.push([ex, ey], [ex + 3, ey]); P.auf(ex + 1, ey + 3, 'k0'); P.auf(ex + 2, ey + 3, 'k0'); }
      // Tranlampe (Variante b): hängt ihm am Bügel aus dem Mund, pendelt knapp über dem Boden
      if (v.lampe && (!p.tod || f < 2)) { const lx = r(hx - 1 + (p.idle ? [0, 1, 0, -1][f] : 0)), ly = r(hy + 11); P.line(r(hx), r(hy + 4), lx, ly - 3, 'k2'); P.set(lx - 1, ly - 2, 'k3'); P.set(lx, ly - 2, 'k3'); P.set(lx + 1, ly - 2, 'k3'); P.set(lx - 1, ly - 1, 'k1'); P.set(lx + 1, ly - 1, 'k1'); P.set(lx - 1, ly, 'k1'); P.set(lx + 1, ly + 2, 'k1'); P.set(lx, ly, 'tran'); P.set(lx, ly + 1, 'kern'); P.set(lx - 1, ly + 1, 'tran'); P.set(lx + 1, ly + 1, 'tran'); P.glow(lx, ly + 1, 6, 0.6); }
    };
    return { gruppen, details, augen, dy };
  },
};
