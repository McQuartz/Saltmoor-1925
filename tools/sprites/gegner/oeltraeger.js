// Der Ölträger (Leuchtturmhof). Der zweite Hilfswärter trug jeden Abend zwei Kannen Petroleum die
// 212 Stufen hinauf. Seit 1917 steigt er weiter, auch im Hof: der Rücken hat die Windung der Treppe
// angenommen, er geht schräg verdreht, tief gebeugt, das Joch über den Schultern. In den Kannen brennt
// das Öl ohne Docht; das Licht steigt aus den Ausgüssen. Die Augen sitzen tief unter der Mütze.
// Angriff: er schwingt das Joch herum, eine Kanne voraus.
'use strict';
module.exports = {
  id: 'oeltraeger', biom: 'leuchtturm', zone: 'leuchtturm', w: 96, h: 120, fuss: [48, 115], kopf: [34, 30], rimBis: 112,
  varianten: {
    // a: zwei Kannen am Joch, Schiffermütze
    oeltraeger_a: { kannen: 2, muetze: 'schiffer', buckel: 1 },
    // b: eine schwere Kanne auf dem Rücken, die zweite in der Hand, Südwester, höherer Buckel
    oeltraeger_b: { kannen: 1, muetze: 'suedwester', buckel: 1.35 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, schwung = 0, atem = 0, fall = 0, licht = 1, nick = 0;
    if (p.idle) { atem = [0, 1, 1, 0][f]; licht = [1, 0.85, 1.1, 0.9][f]; schwung = [0, 0.02, 0, -0.02][f]; }
    if (p.angriff) { lean = [2, 3, -7, -3][f]; schwung = [0.25, 0.4, -0.55, -0.2][f]; licht = [1, 1.2, 1.5, 1]; licht = licht[f]; nick = [-1, -1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; schwung = 0.15; licht = 0.6; nick = -2; }
    if (p.tod) { fall = r(p.q * 34); lean = r(p.q * 4); licht = f < 2 ? 0.7 : 0; schwung = p.q * 0.3; }
    const cx = 52 + lean, B = v.buckel;
    // Beine: ein Bein auf der nächsten (unsichtbaren) Stufe, Knie hoch
    const hy = 82 + fall * 0.4;
    const beine = [
      ...glied([[cx - 4, hy], [cx - 13, hy + 13 - fall * 0.2], [cx - 12, 101]], 3.2, 2.2, null),
      E(cx - 15, 102, 4.4, 1.8, null),
      ...glied([[cx + 4, hy], [cx + 9, hy + 16], [cx + 6, 113]], 3.2, 2.2, null),
      E(cx + 3, 114, 4.6, 1.8, null),
    ];
    // Rumpf: gebeugt und verdreht, der Buckel ragt über den Kopf
    const ry = 54 + fall;
    const rumpf = Pg([[cx - 16, ry + 2], [cx - 6, ry - 8 * B], [cx + 8, ry - 11 * B], [cx + 16, ry - 1], [cx + 13, hy + 1], [cx + 1, hy + 3], [cx - 4, ry + 16]], null, { rd: 3 });
    const buckel = E(cx + 6, ry - 6 * B - atem * 0.5, 11, 9 * B + atem * 0.5, null, { pf: 'dome' });
    const jacke = Pg([[cx + 2, hy - 4], [cx + 14, hy - 4], [cx + 19, hy + 9], [cx + 12, hy + 7], [cx + 6, hy + 10], [cx + 3, hy + 4]], null, { rd: 0.8 });
    // Kopf: tief vorne unter dem Buckel, nach links gereckt
    const kx = cx - 21 + (p.angriff ? lean * 0.3 : 0), ky = ry + 9 + nick;
    const hals = C(cx - 8, ry + 2, kx + 3, ky, 3.4, 2.6, null);
    const kopf = E(kx, ky, 6.2, 5.6, 'haut');
    const kinn = Pg([[kx - 6, ky + 1], [kx - 1, ky + 4], [kx - 5, ky + 7]], 'haut', { rd: 0.8 });
    const muetze = v.muetze === 'schiffer'
      ? [E(kx + 1, ky - 4, 6.6, 3, 'dunkel'), Pg([[kx - 9, ky - 2], [kx - 2, ky - 3], [kx - 3, ky - 1]], 'dunkel', { rd: 0.5 })]
      : [Pg([[kx - 10, ky - 1], [kx - 3, ky - 8], [kx + 6, ky - 7], [kx + 11, ky + 3], [kx + 6, ky - 1], [kx - 4, ky - 2]], 'dunkel', { rd: 1 })];
    // Joch: über dem Buckel quer, dreht mit dem Schwung
    const jx = cx + 4, jy = ry - 9 * B, L = 37, ca = Math.cos(schwung), sa = Math.sin(schwung);
    const ende = s => [jx + s * L * ca, jy + s * L * sa * 0.6 + (s < 0 ? 2 : 0)];
    const [lx, ly] = ende(-1), [rx2, ry2] = ende(1);
    const joch = C(lx, ly, rx2, ry2, 1.8, 1.8, 'dunkel', { pf: 'flat' });
    const kanne = (x, y, g = 1) => {
      const ky2 = y + 12 * g;
      return {
        ketten: [C(x, y, x - 3 * g, ky2 - 7 * g, 0.6, 0.6, null, { noRim: true }), C(x, y, x + 3 * g, ky2 - 7 * g, 0.6, 0.6, null, { noRim: true })],
        koerper: [Pg([[x - 6 * g, ky2 - 7 * g], [x + 6 * g, ky2 - 7 * g], [x + 7 * g, ky2 + 8 * g], [x - 7 * g, ky2 + 8 * g]], null, { rd: 1.2 }), C(x + 5 * g, ky2 - 6 * g, x + 9 * g, ky2 - 10 * g, 1.2, 0.9, null)],
        mund: [x + 9 * g, ky2 - 11 * g], deckel: [x, ky2 - 7 * g],
      };
    };
    const kannen = [];
    if (v.kannen === 2) { kannen.push(kanne(lx, ly, 0.85), kanne(rx2, ry2, 0.9)); }
    else { kannen.push(kanne(jx + 8, jy - 10, 1.35)); kannen.push(kanne(lx - 2, ly + 10, 0.8)); }
    // Arme: einer hält das Joch vorne, einer hängt
    const armV = glied([[cx - 8, ry - 2], [cx - 16, ry - 10 * B + 6], [lx + 6, ly]], 2.4, 1.8, null);
    const armH = glied([[cx + 12, ry], [cx + 18, ry + 14], [cx + 15, ry + 26]], 2.2, 1.6, null);
    const tot = p.tod && f >= 4;
    const gruppen = [
      { p: tot ? [] : kannen.length > 1 && v.kannen === 2 ? [...kannen[1].ketten] : [], k: 0, noRim: true },
      { p: tot ? [] : v.kannen === 2 ? kannen[1].koerper : [], k: 0.6 },
      { p: armH, k: 0.5 },
      { p: beine, k: 1 },
      { p: [rumpf, buckel], k: 4 },
      { p: [jacke], k: 1 },
      { p: tot ? [] : [joch], k: 0 },
      { p: tot ? [] : v.kannen === 1 ? [...kannen[0].ketten, ...kannen[0].koerper] : [], k: 0.6 },
      { p: [hals, kopf, kinn], k: 1.5 },
      { p: muetze, k: 0.5 },
      { p: tot ? [] : [...(v.kannen === 2 ? kannen[0].ketten : kannen[1].ketten)], k: 0, noRim: true },
      { p: tot ? [] : (v.kannen === 2 ? kannen[0] : kannen[1]).koerper, k: 0.6 },
      { p: armV, k: 0.5 },
    ];
    const augen = [];
    const details = P => {
      // Öl brennt in den Kannen: Licht aus Ausguss und Deckelspalt
      if (licht > 0 && !tot) kannen.forEach((k, i) => {
        const [mx, my] = k.mund;
        P.set(mx, my, licht > 1.1 ? 'kern' : 'glut'); P.set(mx, my - 1, 'glut'); if (licht > 1) P.set(mx + 1, my - 2, 'glutDim');
        if (p.angriff && f === 2) { for (let j = 0; j < 8; j++) P.set(mx - 2 - j, my - 1 + (j >> 1), j < 3 ? 'glut' : 'glutDim'); }
        const [dx, dy] = k.deckel; P.line(dx - 3, dy, dx + 3, dy, 'glutDim', true); P.auf(dx, dy, 'glut');
        P.glow(dx, dy + 6, 6 * licht, 0.5 * licht, 'glutDim', 'k3');
      });
      // Messingbeschlag am Joch
      if (!tot) { P.auf(r(jx), r(jy), 'messing'); P.auf(r(lx + 2), r(ly), 'messing'); P.auf(r(rx2 - 2), r(ry2), 'messing'); }
      // Augen: tief unter der Mütze, zwei Punkte
      if (!(p.tod && f >= 1)) {
        const ex = r(kx - 3), ey = r(ky);
        P.auge(ex, ey, 1); P.set(ex + 3, ey, 'glut');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
