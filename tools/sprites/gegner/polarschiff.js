// Schwarzes Eis, dritter Wächter: Das Expeditionsschiff. Die Bark der Expedition von 1903, eingefroren,
// als der Winter zu früh kam. Das Eis hat sie nicht zerdrückt, es hat sie aufgerichtet: Sie steht auf dem
// Heck, der Bug ragt wie ein Kopf, die Masten sind Arme mit gefrorenen Segeln. Wo sie hinsieht, friert
// alles fest. Angriff: der Bug kracht herunter.
'use strict';
module.exports = {
  id: 'polarschiff', biom: 'eis', zone: 'eis', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [58, 24], rimBis: 172,
  varianten: { polarschiff: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let nick = 0, X = 0, fall = 0, glanz = 1, knarr = 0;
    if (p.idle) { knarr = [0, 1, 0, 0][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { nick = [-4, -8, 18, 6][f]; X = [1, 2, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 84 + X, top = 20 + fall + Math.max(0, nick) * 0.5;
    // Rumpf senkrecht: Bug oben, Heck im Eis
    const rumpf = Pg([[cx - 12 - nick * 0.6, top + 4], [cx + 4 - nick * 0.4, top - 4], [cx + 20, top + 20], [cx + 30, top + 70], [cx + 32, 150], [cx - 30, 150], [cx - 28, top + 70], [cx - 22, top + 30]], null, { rd: 2.2 });
    const bugspriet = C(cx - 8 - nick * 0.6, top + 6, cx - 30 - nick * 1.4, top - 6 + nick * 0.6, 2, 1.2, 'dunkel', { pf: 'flat' });
    const eis = Pg([[4, 176], [10, 150], [40, 140], [cx, 146], [130, 138], [156, 152], [156, 176]], null, { rd: 2, pf: 'bevel', tone: 0.15 });
    // Masten als Arme seitlich, mit gefrorenen Segeln
    const mast = (s, y, L) => [C(cx + s * 22, y, cx + s * (22 + L), y - 30 + knarr, 2, 1.4, 'dunkel', { pf: 'flat' })];
    const segel = (s, y, L) => Pg([[cx + s * 26, y - 4], [cx + s * (18 + L), y - 28 + knarr], [cx + s * (14 + L), y + 6], [cx + s * 26, y + 12]], null, { rd: 1.4, pf: 'bevel', tone: 0.12 });
    const masten = [...mast(-1, top + 60, 40), ...mast(1, top + 70, 36), ...mast(1, top + 110, 26)];
    const segelP = [segel(-1, top + 60, 40), segel(1, top + 70, 36), segel(1, top + 110, 26)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : masten, k: 0, pf: 'flat' },
      { p: tot ? [] : segelP, k: 1.5, pf: 'bevel' },
      { p: [bugspriet], k: 0, pf: 'flat' },
      { p: [rumpf], k: 3 },
      { p: [eis], k: 2, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Planken, Bullaugen, Reif, Name am Heck
      for (let y = top + 20; y < 148; y += 7) P.line(r(cx - 24), y, r(cx + 28), y + 1, 'k1', true);
      for (const y of [top + 50, top + 80, top + 110]) P.auf(r(cx + 14), r(y), 'r1');
      for (let x = 10; x < 150; x += 4) P.set(x, r(146 + Math.sin(x) * 3), 'r1');
      if (glanz > 0) {
        // die Augen sind Positionslampen am Bug
        const ex = r(cx - 8 - nick * 0.6), ey = r(top + 12);
        P.set(ex, ey, 'kern'); P.set(ex + 6, ey + 2, 'glut');
        P.glow(ex + 3, ey + 1, 8 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 6, ey + 2]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
