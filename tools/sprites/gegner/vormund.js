// Der Vormund (Waisenhaus am Deich, Elite). Der Amtsvormund kam nach der Sturmflut 1913 und
// unterschrieb für alle Kinder auf einmal. Er hat sie alle bei sich: hoher Zylinder, langer
// Gehrock, der vorne offen steht wie eine Tür. Innen, wo sein Leib sein müsste, stehen sie in
// Reihen, klein und dicht, nur ihre Augen leuchten im Dunkel des Mantels. Sein eigenes Gesicht
// ist schmal und grau, die Augen zwei rote Punkte unter der Krempe. Angriff: er schlägt den
// Mantel auf, und die Reihen drängen nach vorn.
'use strict';
module.exports = {
  id: 'vormund', biom: 'waisenhaus', zone: 'waisenhaus', w: 128, h: 160, fuss: [64, 155], kopf: [60, 4], rimBis: 152, rang: 'elite',
  varianten: { vormund: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, auf = 3, atem = 0, fall = 0, blick = 1, hem = 0, blinzeln = -1;
    if (p.idle) { atem = [0, 0, 1, 1][f]; blinzeln = [-1, 3, -1, 7][f]; }
    if (p.angriff) { lean = [2, 2, -5, -2][f]; auf = [5, 8, 12, 6][f]; blick = [1, 1.3, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; auf = -1; blick = 0.5; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 4); blick = f < 2 ? 0.6 : 0; auf = r(p.q * 6); }
    const cx = 64, ox = lean, sy = 46 + fall;
    // Rock: zwei Flügel, vorne offen; der linke Flügel (vorn) schwingt beim Angriff auf
    const flH = Pg([[cx + ox, sy], [cx + 16 + ox, sy + 2], [cx + 20 + r(ox / 2), sy + 50 - fall / 2], [cx + 24, 148], ...saum(cx + 24, cx + 9, 152, 3, 2, 5, hem), [cx + 9, 148], [cx + 5 + ox, sy + 20]], null, { rd: 1.2 });
    const flV = Pg([[cx - 2 + ox, sy], [cx - 16 + ox - auf * 0.4, sy + 3], [cx - 22 + r(ox / 2) - auf, sy + 50 - fall / 2], [cx - 24 - auf * 1.4, 146], ...saum(cx - 24 - auf * 1.4, cx - 10 - auf * 0.5, 151, 3, 2, 8, hem).reverse(), [cx - 10 - auf * 0.5, 148], [cx - 6 + ox - auf * 0.2, sy + 20]], null, { rd: 1.2 });
    const schultern = E(cx + ox, sy + 4, 17, 6, null, { pf: 'bevel' });
    // Inneres: dunkle Höhle zwischen den Flügeln (eigene Gruppe, ohne Randlicht)
    const innen = Pg([[cx - 6 + ox, sy + 8], [cx + 5 + ox, sy + 8], [cx + 10, 149], [cx - 11 - auf * 0.6, 149]], 'dunkel', { rd: 0.5, noRim: true });
    // Kopf, Hals, Zylinder
    const kx = cx - 2 + ox, ky = sy - 12;
    const hals = C(cx + ox, sy + 2, kx, ky + 4, 3, 2.6, 'haut');
    const kopf = Pg([[kx - 6, ky - 4], [kx + 5, ky - 5], [kx + 5, ky + 5], [kx - 1, ky + 10], [kx - 6, ky + 5]], 'haut', { rd: 1 });
    const krempe = Pg([[kx - 12, ky - 6], [kx + 10, ky - 7], [kx + 10, ky - 4], [kx - 12, ky - 3]], 'dunkel', { rd: 0.6 });
    const zyl = Pg([[kx - 7, ky - 5], [kx + 6, ky - 6], [kx + 7, ky - 26], [kx - 6, ky - 25]], null, { rd: 0.8 });
    // Arme: lange Ärmel, Hände halten die Revers
    const armL = glied([[cx - 13 + ox, sy + 4], [cx - 20 + ox - auf * 0.5, sy + 22], [cx - 14 + ox - auf, sy + 34]], 3, 2.2, null);
    const armR = glied([[cx + 14 + ox, sy + 4], [cx + 20 + ox, sy + 22], [cx + 10 + ox, sy + 30]], 3, 2.2, null);
    const tot = p.tod && f >= 4;
    const gruppen = [
      { p: [flH], k: 2 },
      { p: [innen], k: 0, noRim: true },
      { p: [flV, schultern], k: 2 },
      { p: armR, k: 1 },
      { p: [hals, kopf], k: 1 },
      { p: [zyl, krempe], k: 0.5 },
      { p: armL, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Die Kinder im Mantel: Augenpaare in Reihen, kleine Köpfe als Andeutung (k1)
      if (!tot) {
        const reihen = [[sy + 16, 2], [sy + 28, 2], [sy + 40, 3], [sy + 54, 3], [sy + 68, 3], [sy + 82, 4], [sy + 96, 4]];
        let n = 0;
        reihen.forEach(([y, k], ri) => {
          for (let j = 0; j < k; j++) {
            const x = r(cx - 4 + ox * 0.6 - auf * 0.4 + (j - (k - 1) / 2) * 5.5 + (ri % 2) * 1.5), yy = r(y + (j % 2) * 2 - (p.angriff ? auf * 0.3 : 0));
            n++;
            P.el(x + 1, yy + 1, 2.4, 2.2, 'k1', true);
            if (n === blinzeln || n === blinzeln + 5) continue;
            const hell = ri < 2 || (p.angriff && f === 2);
            P.auf(x, yy, hell ? 'glut' : 'glutDim'); P.auf(x + 2, yy, hell ? 'glut' : 'glutDim');
          }
        });
      }
      // Hutband
      P.line(r(kx - 6), r(ky - 8), r(kx + 6), r(ky - 9), 'k0', true);
      // eigene Augen: zwei rote Punkte unter der Krempe
      if (blick > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey + 0.5, 6 * blick, 0.8, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
      // Uhrkette quer über die Weste
      P.line(r(cx + 4 + ox), r(sy + 20), r(cx + 12 + ox), r(sy + 23), 'ocker', true);
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
