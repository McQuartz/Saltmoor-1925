// Der Leithund (Glasmeer). Der Leithund des Expeditionsgespanns von 1925, noch im Geschirr. Seine Beine sind
// zu lang geworden, wie Stelzen, und sein Fell ist zu Glas erstarrt: lange schwarze Nadeln auf dem Rücken,
// die falsch herum wachsen, zum Kopf hin. Der Kopf hängt tief zwischen den Vorderbeinen, er sieht in das Glas,
// immer, auf das, was darunter läuft. Die Zugleine hinter ihm ist straff und führt schräg in den Boden.
'use strict';
const { glas } = require('./glasschwimmer');
module.exports = {
  id: 'leithund', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [48, 114], kopf: [40, 30], rimBis: 112,
  varianten: {
    leithund_a: { bein: 1, nadeln: 12, rute: 1 },
    leithund_b: { bein: 1.12, nadeln: 10, rute: 0.8, mager: 2 },
  },
  skizzen: { skizze_kopfhoch: { bein: 0.8, nadeln: 0, rute: 1, kopfhoch: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, BL = v.bein, mg = v.mager || 0;
    let lean = 0, atem = 0, kopfV = 0, kopfY = 0, maul = 0, rute = 0, fall = 0, licht = 1, sitz = 0;
    if (p.idle) { atem = [0, 1, 1, 0][f]; rute = [0, 1, 2, 1][f]; }
    if (p.angriff) { lean = [3, 6, -12, -5][f]; kopfV = [2, 4, -10, -4][f]; kopfY = [-2, -8, -4, -1][f]; maul = [0, 1, 2, 1][f]; sitz = [2, 4, -2, 0][f]; licht = [1.1, 1.3, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [4, 2][f]; kopfY = [-3, -1][f]; licht = 0.6; }
    if (p.tod) { fall = r(p.q * 34); licht = Math.max(0, 1 - p.q * 1.7); lean = r(p.q * 3); }
    const hoch = 44 * BL, by = 114 - hoch - 8 + sitz + fall * 0.9, bx = 50 + lean;
    // Rumpf: tiefe Brust vorn, schmale Lende hinten
    const rumpf = Pg([[bx - 22, by - 4 + atem], [bx - 10, by - 9], [bx + 8, by - 8], [bx + 20, by - 6], [bx + 25, by + 1], [bx + 22, by + 8], [bx + 10, by + 7 - mg], [bx - 4, by + 9 - mg], [bx - 16, by + 12 + atem], [bx - 24, by + 6]], null, { rd: 2.5 });
    // Hals hängt nach vorn unten, Kopf tief zwischen den Vorderbeinen, Schnauze zum Boden
    let kx = bx - 26 + kopfV, ky = by + 26 + kopfY + fall * 0.1;
    if (v.kopfhoch) { kx = bx - 30; ky = by - 14; }
    const hals = glied([[bx - 18, by - 2], [bx - 26 + kopfV * 0.5, by + 8 + kopfY * 0.5], [kx + 3, ky - 4]], 6.5, 4.5, null);
    const schaedel = E(kx + 1, ky - 2, 6.5, 5.5, null, { pf: 'bevel' });
    const schnauze = Pg([[kx - 3, ky - 4], [kx + 3, ky - 3], [kx - 1, ky + 9 - maul], [kx - 5, ky + 8 - maul]], 'haut', { rd: 1 });
    const kiefer = maul ? [Pg([[kx, ky + 1], [kx + 1, ky + 9], [kx - 2, ky + 11]], 'dunkel', { rd: 0.6 })] : [];
    const ohren = [Pg([[kx + 2, ky - 6], [kx + 7, ky - 13], [kx + 7, ky - 5]], null, { rd: 0.4 }), Pg([[kx - 2, ky - 6], [kx - 1, ky - 13], [kx + 3, ky - 6]], null, { rd: 0.4 })];
    // Beine: Stelzen. Vorn gerade, hinten mit Sprunggelenk
    const fy = 112;
    const vorn = (x0, dx) => [...glied([[x0, by + 6], [x0 - 1 + dx, by + 6 + hoch * 0.5], [x0 + dx - 2 + lean * -0.2, fy]], 3.2, 1.6, null), E(x0 + dx - 4 + lean * -0.2, fy + 1, 3.4, 1.8, null)];
    const hinten = (x0, dx) => [...glied([[x0, by + 2], [x0 + 6 + dx, by + 6 + hoch * 0.38], [x0 + dx - 1, by + 6 + hoch * 0.72], [x0 + dx, fy]], 3.6, 1.5, null), E(x0 + dx - 2, fy + 1, 3.2, 1.8, null)];
    const beinFern = [...vorn(bx - 12, 3), ...hinten(bx + 14, 4)];
    const beinNah = [...vorn(bx - 18, -2), ...hinten(bx + 19, -1)];
    // Rute: Huskyschwanz, über den Rücken gerollt
    const rx0 = bx + 22, ry0 = by - 4;
    const rutePts = [[rx0, ry0], [rx0 + 6, ry0 - 8 - rute], [rx0 + 4, ry0 - 16 - rute], [rx0 - 3, ry0 - 17], [rx0 - 6, ry0 - 12 + rute]];
    const ruteF = glied(rutePts.slice(0, 4 + (v.rute > 0.9 ? 1 : 0)), 3.2, 1.8, null);
    // Glasnadeln auf dem Rücken: wachsen falsch herum, zum Kopf hin (nach vorn oben)
    const nadeln = [];
    for (let i = 0; i < v.nadeln; i++) {
      const q = i / Math.max(1, v.nadeln - 1), x = bx - 24 + q * 42, y = by - 7 + Math.pow(q - 0.45, 2) * 10 + (q < 0.15 ? 4 : 0), L = 12 + Math.sin(i * 2.1) * 4 + (1 - Math.abs(q - 0.4)) * 10, a = -2.15 - q * 0.35 + Math.sin(i * 1.7) * 0.12 + (p.idle && i === f * 3 % v.nadeln ? 0.08 : 0) + (p.angriff ? [0, -0.15, 0.25, 0.1][f] : 0);
      nadeln.push(Pg([[x - 2.6, y + 3], [x + 2.6, y + 3.2], [x + Math.cos(a) * L, y + Math.sin(a) * L]], null, { rd: 0.2 }));
    }
    // Geschirr: Brustriemen, Rückenriemen, Zugleine straff schräg in den Boden (hinter dem Hund)
    const leine = [C(bx + 18, by + 2, 94, fy + 4, 0.8, 0.8, 'dunkel', { pf: 'flat' })];
    const gruppen = [
      { p: v.kopfhoch ? [] : leine, k: 0, noRim: true },
      { p: beinFern, k: 1, tone: -0.15 },
      { p: ruteF, k: 1.5 },
      { p: nadeln, k: 0 },
      { p: [rumpf], k: 2, anker: [lean, fall] },
      { p: hals, k: 2 },
      { p: ohren, k: 0 },
      { p: [schaedel], k: 1 },
      { p: [schnauze, ...kiefer], k: 1 },
      { p: beinNah, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Geschirr: Brustriemen quer, Rückenriemen, Ring
      P.line(r(bx - 20), r(by - 3), r(bx - 14), r(by + 11), 'k0', true); P.line(r(bx - 19), r(by - 3), r(bx - 13), r(by + 11), 'k3', true);
      P.line(r(bx - 12), r(by - 7), r(bx + 18), r(by - 5), 'k0', true);
      P.el(bx + 18.5, by + 2.5, 1.8, 1.8, 'r1', true); P.auf(r(bx + 18), r(by + 2), 'k0');
      // Rippen unter dem Fell (mager), Fase an der Brust
      for (let k = 0; k < 4; k++) P.line(r(bx - 6 + k * 5), r(by - 2), r(bx - 8 + k * 5), r(by + 6), k % 2 ? 'k0' : 'k3', true);
      // Riss an der Flanke: das Glas bricht durch, Licht von unten scheint durch den Hund
      glas.riss(P, [bx - 2, by + 6], [bx + 16, by - 2], { seed: 4, zacken: 5, staerke: licht });
      // Augen: schauen hinunter ins Glas; ein Lichtfleck am Boden unter der Schnauze (sein Blick)
      if (licht > 0 && !(p.tod && f > 0)) {
        const ex = r(kx - 1), ey = r(ky + 1); P.set(ex, ey, 'kern'); P.set(ex + 2, ey - 1, 'glut'); P.glow(ex + 1, ey + 2, 6 * licht, 0.5); augen.push([ex, ey], [ex + 2, ey - 1]);
        if (maul) { P.set(r(kx - 1), r(ky + 7), 'nordlicht'); P.set(r(kx), r(ky + 8), 'glutDim'); }
      }
      // Nadelspitzen: eine leuchtet grün (Licht in der Bruchkante)
      glas.unterlicht(P, fy - 2, 50, licht * 0.85);
      nadeln.forEach((n2, i) => { const t = n2.v[2]; if ((i + (p.idle ? f : 0)) % 4 === 0 && licht > 0.3) P.auf(r(t[0] + 0.3), r(t[1] + 0.6), 'nordlicht'); });
      // Spiegelglanz auf dem Rücken
      glas.streif(P, [bx - 14, by - 6], [bx + 14, by - 5], 0.8, { hell: 0.4 });
    };
    return { gruppen, details, augen };
  },
};
