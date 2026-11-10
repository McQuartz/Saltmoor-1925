// Der Rubrikator (Kloster der Abschrift). Er malt in jede Abschrift die roten Anfangsbuchstaben,
// und er hat sich das Rot nie von den Händen gewaschen. Ein hagerer Mönch, über das Pult gebeugt,
// das er vor dem Bauch trägt wie einen Bauchladen. Seine Finger sind Pinsel geworden, lang und
// spitz, rot bis zum Ellbogen. Was er anmalt, wird schwer: eine Karte kostet mehr. Angriff: er
// sticht mit den Pinselfingern.
'use strict';
module.exports = {
  id: 'rubrikator', biom: 'kloster', zone: 'kloster', w: 96, h: 120, fuss: [48, 115], kopf: [40, 26], rimBis: 112,
  varianten: {
    rubrikator_a: { pult: 1, kapuze: 1 },
    rubrikator_b: { pult: 1.2, kapuze: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stich = 0, fall = 0, glanz = 1, nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; glanz = [1, 1, 1.1, 0.9][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; stich = [-2, -4, 10, 4][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 32); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52, ox = lean, sy = 38 + fall;
    const kutte = Pg([[cx - 12 + ox, sy], [cx + 4 + ox, sy - 6], [cx + 14 + ox, sy + 2], [cx + 14, sy + 40], [cx + 16, 104], ...saum(cx + 16, cx - 16, 112, 4, 2, 5), [cx - 16, 104], [cx - 14, sy + 36]], null, { rd: 1.6 });
    const kx = cx - 8 + ox * 1.2, ky = sy - 4 + nick;
    const kopf = v.kapuze ? Pg([[kx - 8, ky + 6], [kx - 7, ky - 5], [kx + 2, ky - 9], [kx + 10, ky - 3], [kx + 10, ky + 8], [kx, ky + 10]], null, { rd: 1.5 }) : E(kx, ky, 6, 7, null);
    const gesicht = E(kx - 3, ky + 2, 3, 4, 'dunkel', { pf: 'flat' });
    // Pult vor dem Bauch an einem Riemen, schräg
    const pz = v.pult, px = cx - 6 + ox, py = sy + 30;
    const pult = Pg([[px - 16 * pz, py - 2], [px + 10 * pz, py - 7], [px + 10 * pz, py + 1], [px - 16 * pz, py + 5]], null, { rd: 0.5, pf: 'bevel' });
    const blatt = Pg([[px - 13 * pz, py - 2], [px + 7 * pz, py - 6], [px + 7 * pz, py - 4], [px - 13 * pz, py]], 'haut', { pf: 'flat' });
    const riemen = C(px + 8, py - 6, cx + 6 + ox, sy + 2, 0.6, 0.6, 'dunkel', { noRim: true });
    // Pinselfinger: drei lange Spitzen, vorn
    const hx = cx - 20 + ox - stich, hy = sy + 22;
    const armV = glied([[cx - 8 + ox, sy + 4], [cx - 14 + ox, sy + 14], [hx, hy]], 2.6, 2, null);
    const finger = [-3, 0, 3].map(d => C(hx, hy + d * 0.5, hx - 12 - stich / 2, hy + d * 1.6 - 2, 1, 0.3, null));
    const armH = glied([[cx + 8 + ox, sy + 4], [cx + 6 + ox, sy + 18], [px + 2, py - 6]], 2.6, 2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [kutte], k: 3 },
      { p: [kopf], k: 1.5 },
      { p: [gesicht], k: 0, pf: 'flat', noRim: true },
      { p: [riemen], k: 0, noRim: true },
      { p: armH, k: 1 },
      { p: tot ? [] : [pult], k: 0, pf: 'bevel' },
      { p: tot ? [] : [blatt], k: 0, pf: 'flat' },
      { p: armV, k: 1 },
      { p: finger, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Rot (glutDim/flamme) an Händen und Fingerspitzen, ein roter Buchstabe auf dem Blatt
      finger.forEach(c => { P.auf(r(c.x2), r(c.y2), 'flamme'); P.auf(r((c.x1 + c.x2) / 2), r((c.y1 + c.y2) / 2), 'glutDim'); });
      if (!tot) { const bx = r(px - 8), by = r(py - 3); P.auf(bx, by, 'flamme'); P.auf(bx + 1, by - 1, 'flamme'); P.auf(bx + 3, by - 1, 'tinte'); P.auf(bx + 5, by - 2, 'tinte'); P.auf(bx + 7, by - 2, 'tinte'); }
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 3, ey, 'glut');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
