// Das Gespann (schwarzes Eis, Elite). Die Hunde der Expedition von 1903 sind weitergelaufen, als
// der Führer nicht mehr rief, und irgendwann zusammengewachsen: ein langer, niedriger Leib mit zu
// vielen Beinen, vorn drei Köpfe nebeneinander im Geschirr. Hinten auf den Kufen steht noch der
// Schlittenführer, aufrecht, vornübergebeugt, die Peitsche erhoben, mit Reif statt Gesicht. Er
// treibt sie an, und mit jedem Zug laufen sie schneller. Angriff: das Gespann springt vor.
'use strict';
module.exports = {
  id: 'gespann', biom: 'eis', zone: 'eis', w: 128, h: 160, fuss: [64, 155], kopf: [92, 52], rimBis: 152, rang: 'elite',
  varianten: { gespann: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, sprung = 0, lauf = 0, fall = 0, glanz = 1, peitsche = 0;
    if (p.idle) { lauf = [0, 0, 0, 0][f]; glanz = [1, 1.1, 1, 0.9][f]; peitsche = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 3, -10, -4][f]; sprung = [0, -2, -6, -2][f]; lauf = f; glanz = [1, 1.3, 1.7, 1.1][f]; peitsche = [3, 5, -3, 0][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 20); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const ox = lean, by = 118 + sprung + fall;
    // Hundeleib: lang, niedrig, Rückenlinie gewellt
    const leib = Pg([[22 + ox, by - 10], [36 + ox, by - 16], [54 + ox, by - 12], [70 + ox, by - 15], [86 + ox, by - 10], [94 + ox, by - 4], [90 + ox, by + 4], [70 + ox, by + 4], [50 + ox, by + 6], [32 + ox, by + 12], [20 + ox, by + 6]], null, { rd: 2.5 });
    // Beine: sechs Paare sichtbar, im Lauf versetzt
    const beine = [];
    for (let i = 0; i < 6; i++) { const x = 24 + i * 12 + ox, ph = (i + lauf) % 2 ? 1 : -1; beine.push(...glied([[x, by + 2], [x + 3 + ph * 2, by + 16], [x - 1 + ph * 3, 153]], i < 2 ? 3.2 : 2.6, 1.6, null)); }
    // drei Köpfe vorn, nebeneinander, leicht versetzt
    // drei Hälse aus der Brust, drei Köpfe auf verschiedenen Höhen
    const koepfe = [[16, by - 34, 0], [6, by - 20, 1], [20, by - 8, 2]].map(([x, y, i]) => {
      const kx = x + ox, ky = y + ((lauf + i) % 2);
      return [E(kx + 6, ky, 8, 7, null), C(kx + 8, ky + 2, 30 + ox, by - 6, 5, 6, null), Pg([[kx - 8, ky - 1], [kx + 2, ky - 5], [kx + 2, ky + 5], [kx - 7, ky + 4]], null, { rd: 1.2 }), Pg([[kx + 6, ky - 6], [kx + 11, ky - 5], [kx + 10, ky - 13]], null, { pf: 'flat' })];
    });
    const geschirr = [C(10 + ox, by - 2, 94 + ox, by - 10, 0.8, 0.8, 'dunkel', { noRim: true })];
    // Schlitten mit Kufen, hinten
    const sx = 100 + r(ox / 2), sy0 = 140 + fall / 2;
    const kufe = Pg([[78, 150], [122, 150], [124, 147], [126, 150], [124, 153], [78, 153]], null, { rd: 0.4, pf: 'flat' });
    const ladung = Pg([[84, sy0 - 12], [112, sy0 - 14], [114, sy0 + 6], [82, sy0 + 6]], null, { rd: 1, pf: 'bevel' });
    const holme = [C(116, 150, 114, 98 + fall, 1.2, 1.2, 'dunkel', { pf: 'flat' })];
    // der Führer: aufrecht hinter der Ladung, Parka, vornübergebeugt
    const fy = 64 + fall;
    const parka = Pg([[sx - 12, fy + 8], [sx - 2, fy], [sx + 12, fy + 6], [sx + 16, fy + 60], [sx + 14, sy0 - 10], [sx - 12, sy0 - 10], [sx - 14, fy + 40]], null, { rd: 2 });
    const kapuze = Pg([[sx - 14, fy + 2], [sx - 10, fy - 10], [sx + 2, fy - 14], [sx + 10, fy - 6], [sx + 8, fy + 6], [sx - 6, fy + 10]], null, { rd: 2 });
    const reif = E(sx - 6, fy - 2, 5, 6, null, { tone: 0.3 });
    const pa = -0.9 - peitsche * 0.15;
    const armP = glied([[sx + 6, fy + 10], [sx + 2, fy - 8], [sx - 2, fy - 20]], 3, 2.4, null);
    const peit = C(sx - 2, fy - 20, sx - 2 + 26 * Math.cos(pa - 1.2), fy - 20 + 26 * Math.sin(pa - 1.2), 0.8, 0.6, 'dunkel', { noRim: true });
    const armH = glied([[sx - 8, fy + 12], [sx - 4, fy + 30], [114, fy + 34]], 3, 2.4, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [peit], k: 0, noRim: true },
      { p: armP, k: 1 },
      { p: holme, k: 0, pf: 'flat' },
      { p: [parka], k: 3 },
      { p: [kapuze], k: 2 },
      { p: [reif], k: 0 },
      { p: armH, k: 1 },
      { p: [ladung], k: 1, pf: 'bevel' },
      { p: [kufe], k: 0, pf: 'flat' },
      { p: beine, k: 1 },
      { p: [leib], k: 3 },
      { p: geschirr, k: 0, noRim: true },
      { p: tot ? [] : koepfe[0], k: 1.5 },
      { p: tot ? [] : koepfe[1], k: 1.5 },
      { p: tot ? [] : koepfe[2], k: 1.5 },
    ];
    const augen = [];
    const details = P => {
      // Reif am Fell: helle Spitzen entlang des Rückens
      for (let x = 22; x < 92; x += 4) P.auf(r(x + ox), r(by - 13 + Math.sin(x * 0.3) * 2), 'r1');
      // Riemen der Ladung
      P.line(90, r(sy0 - 12), 92, r(sy0 + 5), 'k0', true); P.line(104, r(sy0 - 13), 106, r(sy0 + 5), 'k0', true);
      // Gesicht aus Reif: Kerben statt Augen, keine Glut
      P.auf(r(sx - 8), r(fy - 3), 'k1'); P.auf(r(sx - 5), r(fy - 3), 'k1'); P.auf(r(sx - 7), r(fy + 1), 'k1');
      // Augen der Hunde: je eins, das man sieht
      if (glanz > 0 && !tot) koepfe.forEach(([schaedel], i) => {
        const ex = r(schaedel.x - 5), ey = r(schaedel.y - 2);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut');
        P.glow(ex + 1, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey]);
      });
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
