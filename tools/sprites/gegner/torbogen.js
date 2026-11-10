// Namenlose Stadt, dritter Wächter: Der Torbogen. Die Expedition von 1903 hat das Tor vermessen und kam
// nicht auf dieselbe Zahl zweimal. Es ist ein Bogen aus Stein mit zu vielen Ecken, und er geht. Wer
// hindurchschaut, sieht den nächsten Augenblick: dort steht schon, was du gleich tun wirst, und der
// Bogen tut es zuerst. Angriff: der Schlussstein fällt herab.
'use strict';
module.exports = {
  id: 'torbogen', biom: 'stadt', zone: 'stadt', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 24], rimBis: 172,
  varianten: { torbogen: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let stein = 0, X = 0, fall = 0, glanz = 1, schim = 0;
    if (p.idle) { schim = f; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stein = [-3, -6, 28, 10][f]; X = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 80 + X, top = 24 + fall;
    // Zwei Pfeiler, schief, mit falschen Winkeln
    const pfL = Pg([[cx - 56, 156], [cx - 54, top + 50], [cx - 46, top + 30], [cx - 30, top + 34], [cx - 28, top + 60], [cx - 32, 156]], null, { rd: 1 });
    const pfR = Pg([[cx + 30, 156], [cx + 32, top + 64], [cx + 28, top + 36], [cx + 46, top + 26], [cx + 58, top + 46], [cx + 56, 156]], null, { rd: 1 });
    const bogen = Pg([[cx - 50, top + 32], [cx - 40, top + 8], [cx - 16, top - 4], [cx + 18, top - 2], [cx + 44, top + 10], [cx + 52, top + 30], [cx + 30, top + 36], [cx + 14, top + 18], [cx - 12, top + 16], [cx - 30, top + 36]], null, { rd: 1.2, pf: 'bevel' });
    const schluss = Pg([[cx - 7, top - 2 + Math.max(0, stein)], [cx + 7, top - 3 + Math.max(0, stein)], [cx + 5, top + 16 + Math.max(0, stein)], [cx - 5, top + 16 + Math.max(0, stein)]], null, { rd: 0.6, pf: 'bevel' });
    const durch = Pg([[cx - 28, 156], [cx - 26, top + 40], [cx - 12, top + 20], [cx + 14, top + 22], [cx + 28, top + 40], [cx + 30, 156]], 'dunkel', { rd: 1.2, pf: 'flat' });
    // im Durchgang: eine Gestalt, die du bist, einen Augenblick voraus
    const gest = Pg([[cx - 6, 156], [cx - 8, top + 92], [cx - 4, top + 72], [cx + 4, top + 72], [cx + 8, top + 92], [cx + 6, 156]], null, { rd: 1.6, tone: 0.1 });
    const gk = E(cx, top + 64, 5, 6, null, { rd: 1.2 });
    const fuesse = [cx - 44, cx + 44].map(x => Pg([[x - 12, 154], [x + 12, 154], [x + 10, 172], [x - 10, 172]], 'dunkel', { rd: 1.6 }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: fuesse, k: 0 },
      { p: [durch], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : [gest, gk], k: 1 },
      { p: [pfL, pfR], k: 3 },
      { p: [bogen], k: 2, pf: 'bevel' },
      { p: [schluss], k: 1.5, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Reliefzeichen, Fugen
      for (let y = top + 50; y < 152; y += 12) { P.line(r(cx - 54), y, r(cx - 30), y + 1, 'k0', true); P.line(r(cx + 32), y + 3, r(cx + 56), y + 2, 'k0', true); }
      for (const [x, y] of [[-44, 70], [-40, 100], [44, 84], [40, 120]]) P.auf(r(cx + x), r(top + y), 'r1');
      if (glanz > 0) {
        // Schimmer im Durchgang, die Augen der Gestalt, ein Auge im Schlussstein
        for (let i = 0; i < 4; i++) P.set(r(cx - 20 + ((i * 13 + schim * 7) % 40)), r(top + 50 + i * 22), 'glutDim');
        const ex = r(cx - 2), ey = r(top + 64);
        P.set(ex, ey, 'glut'); P.set(ex + 4, ey, 'glut');
        const sx = r(cx), sy0 = r(top + 6 + Math.max(0, stein));
        P.set(sx, sy0, 'kern'); P.glow(sx, sy0, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([sx, sy0], [ex, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
