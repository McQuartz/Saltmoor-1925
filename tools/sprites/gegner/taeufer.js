// Der Täufer (überflutete Kapelle, Elite). Der Kaplan, der 1634 die Kinder taufte, während das
// Wasser stieg, und nicht aufhörte. Er steht bis zum Gürtel im Taufstein, einem achteckigen
// Becken auf einem Fuß, das für ihn viel zu klein ist und trotzdem tief genug. Oben ein langer,
// gebeugter Leib im Chorhemd, die Stola hängt ins Wasser. Seine Arme sind zu lang: die eine Hand
// segnet, die andere liegt flach auf dem Wasser und drückt etwas hinunter. Angriff: beide Hände
// fahren ins Becken, das Wasser schlägt über.
'use strict';
module.exports = {
  id: 'taeufer', biom: 'kapelle', zone: 'kapelle', w: 128, h: 160, fuss: [64, 155], kopf: [56, 22], rimBis: 152, rang: 'elite',
  varianten: { taeufer: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, druck = 0, nick = 0, fall = 0, glanz = 1, welle = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; welle = [0, 1, 2, 1][f]; glanz = [1, 1, 0.9, 1.1][f]; }
    if (p.angriff) { lean = [2, 3, -8, -3][f]; druck = [-6, -10, 10, 4][f]; nick = [0, -1, 3, 1][f]; glanz = [1, 1.3, 1.6, 1.1][f]; welle = [0, 1, 4, 2][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; nick = -1; }
    if (p.tod) { fall = r(p.q * 48); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64, ox = lean;
    // Taufstein: Fuß, Schaft, achteckiges Becken (vorn zwei Kanten)
    const fussS = Pg([[cx - 20, 146], [cx + 20, 146], [cx + 24, 154], [cx - 24, 154]], null, { rd: 0.5, pf: 'bevel' });
    const schaft = Pg([[cx - 10, 124], [cx + 10, 124], [cx + 12, 146], [cx - 12, 146]], null, { rd: 0.5, pf: 'bevel' });
    const becken = Pg([[cx - 34, 98], [cx + 34, 98], [cx + 30, 116], [cx + 14, 126], [cx - 14, 126], [cx - 30, 116]], null, { rd: 0.8, pf: 'bevel' });
    const rand = Pg([[cx - 36, 95], [cx + 36, 95], [cx + 36, 100], [cx - 36, 100]], null, { rd: 0.6, pf: 'flat' });
    // Leib: aus dem Becken, lang und gebeugt, Chorhemd mit weiten Ärmeln
    const sy = 40 + fall, by = 96;
    const leib = Pg([[cx - 24 + ox, by], [cx - 18 + ox, sy + 34], [cx - 12 + ox, sy + 6], [cx - 4 + ox, sy - 2], [cx + 10 + ox, sy - 2], [cx + 18 + ox, sy + 8], [cx + 20 + ox, sy + 30], [cx + 26 + ox, by]], null, { rd: 1.6 });
    const stola = [Pg([[cx - 6 + ox, sy + 2], [cx - 2 + ox, sy + 2], [cx - 2 + ox, by + 2], [cx - 6 + ox, by + 2]], 'dunkel', { pf: 'flat' })];
    // Kopf: kahl, vorgebeugt, lange Nase nach unten
    const kx = cx - 8 + ox * 1.4, ky = sy - 10 + nick;
    const hals = C(cx - 1 + ox, sy, kx + 2, ky + 6, 4, 3, null);
    const kopf = Pg([[kx - 7, ky - 6], [kx + 4, ky - 10], [kx + 9, ky - 3], [kx + 6, ky + 8], [kx - 4, ky + 10], [kx - 9, ky + 3]], 'haut', { rd: 2 });
    // Arme: zu lang. Vorn die drückende Hand auf dem Wasser, hinten die segnende
    const hx = cx - 26 + ox + r(druck / 2), hy = 96 + r(Math.max(0, druck) / 2);
    const armV = [Pg([[cx - 12 + ox, sy + 4], [cx - 24 + ox, sy + 26], [cx - 34 + ox, sy + 40], [cx - 26 + ox, sy + 42], [cx - 16 + ox, sy + 26]], null, { rd: 1.2 }), ...glied([[cx - 29 + ox, sy + 40], [cx - 32 + ox, sy + 52], [hx, hy - 2]], 2.6, 2.2, 'haut')];
    const handV = Pg([[hx - 8, hy - 3], [hx + 4, hy - 4], [hx + 6, hy], [hx - 9, hy + 1]], 'haut', { rd: 0.8 });
    const sx = cx + 30 + ox - r(druck / 3), syb = sy + 4 - r(druck / 2);
    const armH = glied([[cx + 12 + ox, sy + 8], [cx + 26 + ox, sy + 22], [sx, syb]], 4.2, 2.6, null);
    const segen = [C(sx, syb, sx - 1, syb - 9, 1.2, 1, 'haut'), C(sx + 2, syb, sx + 2, syb - 8, 1.2, 1, 'haut')];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: segen, k: 0 },
      { p: [leib], k: 3 },
      { p: stola, k: 0, pf: 'flat' },
      { p: [hals, kopf], k: 2 },
      { p: [fussS, schaft], k: 0.5, pf: 'bevel' },
      { p: [becken], k: 0.5, pf: 'bevel' },
      { p: [rand], k: 0, pf: 'flat' },
      { p: armV, k: 1 },
      { p: [handV], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Wasserspiegel im Becken, gekräuselt; beim Angriff schlägt es über
      for (let x = cx - 33; x <= cx + 33; x++) { const y = 96 - (((x + welle) >> 2) % 2); P.set(x, y, 'r1'); }
      if (welle >= 3) for (let i = 0; i < 6; i++) { P.set(cx - 30 + i * 2, 93 - (i % 3), 'r1'); P.set(cx - 31 + i * 2, 91 - (i % 2) * 2, 'r2'); }
      // Kanten des Achtecks vorn
      P.line(cx - 14, 101, cx - 14, 125, 'k1', true); P.line(cx + 14, 101, cx + 14, 125, 'k1', true);
      // unter der Hand ein heller Fleck im Wasser: etwas Kleines, das hinaufsieht
      if (!tot) { P.set(r(hx - 2), 99, 'glutDim'); P.set(r(hx + 1), 99, 'glutDim'); }
      // Augen tief unter der Stirn
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey + 1, 'kern'); P.set(ex + 5, ey + 1, 'glut');
        P.glow(ex + 2.5, ey + 0.5, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey + 1]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
