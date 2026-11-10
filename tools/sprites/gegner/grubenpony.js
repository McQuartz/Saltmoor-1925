// Das Grubenpony (Salzstollen). Die Ponys kamen als Fohlen hinunter und sahen nie wieder Licht.
// Dieses ist geblieben, als die Grube zuging, und das Salz hat es weitergetragen: ein kleines,
// schweres Pferd mit Scheuklappen aus Kruste, auf dem Rücken das Geschirr mit den leeren Hunten-
// ketten. Die Augen sind weiß zugewachsen, aber hinter dem Salz glimmt es. Wenn es scharrt, kommt
// der Tritt. Angriff: es keilt aus.
'use strict';
module.exports = {
  id: 'grubenpony', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [48, 115], kopf: [22, 64], rimBis: 112,
  varianten: {
    grubenpony_a: { kruste: 1, laterne: 1 },
    grubenpony_b: { kruste: 1.3, laterne: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, tritt = 0, fall = 0, glanz = 1, nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; glanz = [1, 1, 1.1, 0.9][f]; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; tritt = [2, 4, -8, -3][f]; nick = [1, 2, -1, 0][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 18); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const ox = lean, by = 78 + fall;
    const rumpf = Pg([[30 + ox, by - 12], [52 + ox, by - 16], [72 + ox, by - 12], [78 + ox, by], [72 + ox, by + 10], [36 + ox, by + 10], [28 + ox, by + 2]], null, { rd: 4 });
    const beine = [...glied([[34 + ox, by + 6], [34 + ox, by + 22], [33, 113]], 3.4, 2.6, null), ...glied([[42 + ox, by + 8], [42 + ox, by + 22], [42, 113]], 3.4, 2.6, 'dunkel'),
      ...glied([[66 + ox, by + 6], [70 + ox + tritt, by + 20], [70 + tritt * 1.5, 113 - Math.abs(tritt)]], 3.6, 2.6, null), ...glied([[72 + ox, by + 4], [76 + ox, by + 20], [76, 113]], 3.6, 2.6, 'dunkel')];
    const hufe = [E(33, 114, 3.5, 2, 'dunkel'), E(42, 114, 3.5, 2, 'dunkel'), E(70 + tritt * 1.5, 114 - Math.abs(tritt), 3.5, 2, 'dunkel'), E(76, 114, 3.5, 2, 'dunkel')];
    // Hals und Kopf, tief gesenkt
    const kx = 18 + ox, ky = by - 10 + nick;
    const hals = C(32 + ox, by - 8, kx + 6, ky - 2, 7, 5, null);
    const kopf = Pg([[kx - 8, ky + 2], [kx - 4, ky - 8], [kx + 6, ky - 9], [kx + 10, ky - 2], [kx + 2, ky + 12], [kx - 6, ky + 12]], null, { rd: 2 });
    const ohren = [Pg([[kx + 4, ky - 8], [kx + 8, ky - 8], [kx + 7, ky - 14]], null, { pf: 'flat' })];
    const mähne = [0, 1, 2, 3].map(i => C(28 + ox - i * 3, by - 14 + i * 1.5, 26 + ox - i * 3, by - 20 + i, 1.4, 0.8, 'dunkel'));
    const schweif = glied([[78 + ox, by - 6], [84 + ox, by + 4], [82, by + 24]], 2.2, 1, 'dunkel');
    const geschirr = C(46 + ox, by - 15, 46 + ox, by + 10, 1.4, 1.4, 'dunkel', { pf: 'flat', noRim: true });
    const lat = v.laterne ? [C(54 + ox, by - 15, 54 + ox, by - 22, 0.6, 0.6, 'dunkel', { noRim: true }), Pg([[51 + ox, by - 30], [57 + ox, by - 30], [57 + ox, by - 22], [51 + ox, by - 22]], null, { rd: 0.6, pf: 'flat' })] : [];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [schweif], k: 0 },
      { p: beine.slice(0, 0), k: 1 },
      { p: [...glied([[42 + ox, by + 8], [42 + ox, by + 22], [42, 113]], 3.4, 2.6, 'dunkel'), ...glied([[72 + ox, by + 4], [76 + ox, by + 20], [76, 113]], 3.6, 2.6, 'dunkel')], k: 1 },
      { p: [rumpf], k: 3 },
      { p: [...glied([[34 + ox, by + 6], [34 + ox, by + 22], [33, 113]], 3.4, 2.6, null), ...glied([[66 + ox, by + 6], [70 + ox + tritt, by + 20], [70 + tritt * 1.5, 113 - Math.abs(tritt)]], 3.6, 2.6, null)], k: 1 },
      { p: hufe, k: 0 },
      { p: [geschirr], k: 0, noRim: true },
      { p: tot ? [] : lat, k: 0, pf: 'flat' },
      { p: [hals, kopf, ...ohren], k: 2 },
      { p: mähne, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Salzkruste: weiß gesprenkelt, b: dichter
      const dicht = v.kruste;
      for (let y = by - 14; y < by + 10; y += 2) for (let x = 30; x < 78; x += 2) if (((x * 13 + y * 7) % 11) < 2 * dicht) P.auf(r(x + ox), y, 'r1');
      for (let k = 0; k < 6; k++) P.auf(r(kx - 4 + k), r(ky - 2 + (k % 2)), 'r1');
      if (!tot && v.laterne) { P.set(54 + ox, by - 26, 'kern'); P.set(54 + ox, by - 27, 'glut'); P.glow(54 + ox, by - 26, 7, 0.6, 'glutDim', 'k3'); }
      // hinter dem Salz zugewachsene Augen
      if (glanz > 0) {
        const ex = r(kx - 1), ey = r(ky - 3);
        P.set(ex, ey, 'glut'); P.set(ex + 1, ey, 'kern');
        P.glow(ex + 1, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex + 1, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
