// Wächter Kurhaus: Die Oberschwester. Übergroß, die gestärkte Haube steht wie ein Segel über ihr.
// Sie trägt eine Zinkwanne voll stillem Wasser vor sich her; darin ruht ein Patient, die Augen offen.
// Das Wasser bleibt waagerecht, auch wenn sie die Wanne kippt und damit zuschlägt.
'use strict';
const rot = (pts, cx, cy, a) => pts.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
const ell = (cx, cy, rx, ry, n = 20) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * 6.283) * rx, cy + Math.sin(i / n * 6.283) * ry]);
module.exports = {
  id: 'oberschwester', biom: 'kurhaus', zone: 'kurhaus', rang: 'waechter', w: 128, h: 160, fuss: [74, 155], kopf: [70, 4], rimBis: 153,
  varianten: { oberschwester: {} },
  // Silhouetten-Probe (verworfen): ein einzelnes hohes Segel nach hinten oben, las sich wie ein Horn und ragte aus dem Bild
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 5, fall: 40 }), f = p.f;
    let lean = P0.lean, T = P0.atem + P0.fall, wy = 0, wx = 0, wk = 0, segel = 0, hem = 0, nick = 0;
    if (p.idle) { segel = [0, 1, 1, 0][f]; hem = [0, 1, 0, -1][f]; }
    if (p.angriff) { lean = [3, 4, -6, -2][f]; wy = [-14, -40, 18, 4][f]; wx = [2, 6, -10, -3][f]; wk = [0.05, 0.3, -0.45, -0.12][f]; segel = [1, 2, -2, 0][f]; hem = [0, 1, 3, 1][f]; nick = [-1, -2, 2, 1][f]; }
    if (p.treffer) { wy = [-3, -1][f]; wk = 0.1; nick = -2; }
    if (p.tod) { wy = r(p.q * 44); wk = -p.q * 0.25; nick = r(p.q * 4); }
    const cx = 74, top = 60 + T;
    // Habit: breite Schultern, fällt schwer bis zum Boden
    const habit = Pg([[cx - 16 + lean, top], [cx + 16 + lean, top], [cx + 24 + r(lean / 2), top + 20], [cx + 28, 128 + T / 3], [cx + 32, 148], ...saum(cx + 32, cx - 30, 153, 8, 2, 13, hem), [cx - 30, 146], [cx - 24, 120 + T / 3], [cx - 22 + r(lean / 2), top + 20]], null, { rd: 2.5 });
    const schultern = E(cx + lean, top + 4, 21, 8, null, { pf: 'bevel' });
    const falten = [C(cx - 12, top + 40, cx - 20, 150, 1, 1.8, 'dunkel'), C(cx + 14, top + 34, cx + 22, 150, 1, 2, 'dunkel'), C(cx + 4, top + 50, cx + 6, 152, 0.7, 1.4, 'dunkel')];
    // Schürze: helleres Tuch mit Latz
    const schuerze = Pg([[cx - 9 + lean, top + 6], [cx + 9 + lean, top + 6], [cx + 10 + r(lean / 2), top + 24], [cx + 18, 136], [cx - 18, 136], [cx - 11 + r(lean / 2), top + 24]], 'haut', { rd: 1.5 });
    // Kopf: klein unter der Haube, sieht auf die Wanne
    const kx = cx - 4 + lean, ky = top - 10 + nick;
    const kopf = E(kx, ky, 7, 8, 'haut', { pf: 'bevel' });
    // Haube: ein großes Segel nach hinten oben (gestärktes Leinen), vorn ein kleinerer Flügel
    const sg = segel, hy = ky - 6;
    // Flügelhaube: gestärktes Leinen, die Flügel blähen sich wie Segel nach oben, der hintere größer
    const haube = [Pg([[kx - 6, hy + 5], [kx - 20, hy], [kx - 42, hy - 18 + sg], [kx - 44, hy - 24 + sg], [kx - 36, hy - 14 + sg], [kx - 16, hy - 12], [kx, hy - 13], [kx + 18, hy - 16], [kx + 40, hy - 34 - sg], [kx + 48, hy - 38 - sg], [kx + 44, hy - 24 - sg], [kx + 24, hy - 2], [kx + 8, hy + 6]], 'haut', { rd: 1.5 }),
      E(kx + 1, hy - 6, 10, 8, 'haut', { pf: 'bevel' })];
    const kinnband = [C(kx - 6, ky + 4, kx + 7, ky + 2, 1.6, 1.6, 'haut')];
    // Wanne: Zink, oval, Griffe an beiden Enden; wk = Neigung
    const wcx = cx - 34 + wx + lean, wcy = 98 + wy + T;
    const wanne = Pg(rot([[-28, -8], [28, -8], [23, 10], [-23, 10]], wcx, wcy, wk), null, { rd: 2 });
    const rand = [Pg(rot(ell(0, -8, 29, 4.5), wcx, wcy, wk), null, { rd: 0.5 })];
    const griffe = [...rot([[-31, -6], [-34, -2]], wcx, wcy, wk), ...rot([[31, -6], [34, -2]], wcx, wcy, wk)];
    const griffP = [C(griffe[0][0], griffe[0][1], griffe[1][0], griffe[1][1], 1.5, 1.5, null), C(griffe[2][0], griffe[2][1], griffe[3][0], griffe[3][1], 1.5, 1.5, null)];
    // Arme: von den Schultern zu den Griffen, kräftig
    const gL = rot([[-26, -4]], wcx, wcy, wk)[0], gR = rot([[24, -3]], wcx, wcy, wk)[0];
    const armL = glied([[cx - 16 + lean, top + 6], [cx - 30 + lean + wx * 0.3, top + 20 + wy * 0.4], gL], 5.6, 3.6, null);
    const armR = glied([[cx + 14 + lean, top + 6], [cx + 18 + lean, top + 26 + wy * 0.3], gR], 5.2, 3.4, null);
    const gruppen = [
      { p: [...haube], k: 2, tone: 0.28, anker: [0, r(T)] },
      { p: [habit, schultern], k: 4, anker: [0, r(T)] },
      { p: falten, k: 0, noRim: true, anker: [0, r(T)] },
      { p: [schuerze], k: 1, tone: 0.12, anker: [0, r(T)] },
      { p: armR, k: 1, anker: [0, r(T)] },
      { p: [kopf, ...kinnband], k: 1, anker: [0, r(T)] },
      { p: [wanne, ...griffP], k: 1, pf: 'bevel', anker: [0, r(T)] },
      { p: rand, k: 0, anker: [0, r(T)] },
      { p: armL, k: 1, anker: [0, r(T)] },
    ];
    const augen = [];
    const details = P => {
      // Wasser: waagerecht, egal wie die Wanne steht. Ellipse ungedreht, nur innerhalb des (gedrehten) Rands.
      const [ox, oy] = rot([[0, -8]], wcx, wcy, wk)[0];
      const innen = (x, y) => { const dx = x - ox, dy = y - oy, c = Math.cos(-wk), s = Math.sin(-wk), u = dx * c - dy * s, w = dx * s + dy * c; return (u / 26.5) ** 2 + (w / 3.2) ** 2 <= 1; };
      const wsY = oy + Math.sin(wk) * 0; // Wasserspiegel: bleibt auf Höhe der Randmitte
      for (let y = r(oy - 12); y <= r(oy + 12); y++) for (let x = r(ox - 30); x <= r(ox + 30); x++) {
        if (!innen(x + 0.5, y + 0.5) && !(Math.abs(wk) > 0.08 && Math.abs(y + 0.5 - wsY) < 3.2 && Math.abs(x - ox) < 24 && P.get(x, y))) continue;
        const q = ((x + 0.5 - ox) / 26) ** 2 + ((y + 0.5 - wsY) / 3.4) ** 2; if (q > 1) continue;
        P.set(x, y, q > 0.75 ? 'r1' : q < 0.25 + A.bay(x, y) * 0.3 ? 'wasser' : 'glutDim');
      }
      // der Ruhende im Wasser: ein Gesicht knapp unter dem Spiegel, Augen offen
      if (!p.tod || f < 2) {
        const fx = r(ox - 4), fy = r(wsY);
        for (const [a, b] of [[-3, -1], [3, -1], [-4, 0], [4, 0], [-3, 1], [3, 1], [-1, 2], [1, 2]]) P.set(fx + a, fy + b, 'k3');
        P.set(fx - 2, fy, 'kern'); P.set(fx + 2, fy, 'kern'); augen.push([fx - 2, fy], [fx + 2, fy]);
      }
      // ihre Augen: klein, blass, gesenkt
      if (!P0.aus) { P.auge(kx - 4, ky + 1, 1); P.auge(kx + 1, ky + 1, 1); augen.push([r(kx - 4), r(ky + 1)], [r(kx + 1), r(ky + 1)]); }
      P.auf(kx - 3, ky + 5, 'k0'); P.auf(kx - 2, ky + 5, 'k0'); P.auf(kx - 1, ky + 5, 'k0');
      // Haube: gestärkte Kanten, Falzlinien im Leinen
      for (let k = 0; k < 3; k++) { P.line(kx + 8 + k * 3, hy - 6 + k * 3, kx + 36 - k * 2, hy - 28 - sg + k * 5, k === 1 ? 'k1' : 'k2', true); P.line(kx - 8 - k * 2, hy - 4 + k * 3, kx - 34 + k * 2, hy - 16 + sg + k * 3, k === 1 ? 'k1' : 'k2', true); }
      // Zink: Nieten am Rand
      for (let i = -3; i <= 3; i++) { const [nx, ny] = rot([[i * 7, -2]], wcx, wcy, wk)[0]; P.auf(nx, ny, 'r1'); }
      // Schürzenband und Uhr an der Brust (Messing)
      P.auf(cx + 6 + lean, top + 12, 'messing'); P.auf(cx + 6 + lean, top + 13, 'messing'); P.line(cx + 6 + lean, top + 8, cx + 6 + lean, top + 11, 'k1', true);
    };
    return { gruppen, details, augen };
  },
};
