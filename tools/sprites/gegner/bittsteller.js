// Der Bittsteller (Grotte der Gaben). Kniet seit der letzten Wallfahrt, auf Knien rutschend wie die
// Pilger früher. Auf dem Rücken ein Bündel Wallfahrtskerzen, länger als er selbst; in den Händen hält
// er ein Wachsherz hin, das warm ist. Er bittet. Niemand weiß, worum.
'use strict';
module.exports = {
  id: 'bittsteller', biom: 'grotte', zone: 'grotte', w: 96, h: 120, fuss: [46, 114], kopf: [56, 10], rimBis: 112,
  varianten: {
    // Kerzen: [Winkel, Länge, Dicke]
    bittsteller_a: { kerzen: [[-1.98, 46, 1.5], [-1.78, 64, 1.7], [-1.6, 74, 1.8], [-1.44, 60, 1.6], [-1.3, 68, 1.7], [-1.12, 44, 1.4]], brennt: 2, kapuze: 1 },
    bittsteller_b: { kerzen: [[-2.05, 44, 1.4], [-1.85, 66, 1.7], [-1.62, 78, 1.8], [-1.42, 70, 1.7], [-1.2, 56, 1.5], [-1.0, 38, 1.3]], brennt: 2, kapuze: 0, buckel: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const f = p.f, P0 = pose(p, { fall: 18 });
    let schw = 0, auf = 0, lean = 0, nick = 0, herz = 1, hem = 0, fallK = 0;
    if (p.idle) { schw = 0; nick = [0, 1, 1, 0][f]; herz = [1, 0.85, 1, 1.1][f]; hem = [0, 1, 1, 0][f]; }
    // Ausholen: richtet sich auf den Knien auf, das Bündel kippt nach hinten; dann schlägt es nach vorn
    if (p.angriff) { schw = [0.25, 0.42, -0.62, -0.2][f]; auf = [5, 8, -2, 0][f]; lean = [2, 3, -7, -2][f]; nick = [-1, -2, 2, 0][f]; herz = [1, 1.2, 0.8, 1][f]; }
    if (p.treffer) { schw = [0.2, 0.08][f]; lean = [2, 1][f]; nick = -1; herz = 0.6; }
    if (p.tod) { fallK = p.q; schw = -p.q * 0.9; lean = -r(p.q * 6); nick = r(p.q * 5); herz = 1 - p.q; }
    const Bk = v.buckel || 0, T = 0;
    const ry = 70 - auf + T + r(fallK * 10) - Bk, rx = 58 + lean;
    // Unterschenkel liegen auf dem Boden, Sohlen nach hinten
    const unten = Pg([[30, 107], [60, 104], [72, 106], [80, 110], [80, 114], [28, 114]], null, { rd: 1.5 });
    const sohlen = [E(79, 110, 3, 4, 'haut'), E(74, 111, 2.5, 3, null)];
    // Mantel: kniend, vorgebeugt, Kapuze vorn unten
    // Mantel: Oberschenkel schräg vom Knie (vorn unten) zur Hüfte, Rücken gekrümmt nach vorn zum Kopf
    const mantel = Pg([[30, 110], [28, 103], [rx - 26, ry + 22], [rx - 18, ry + 7], [rx - 6, ry + 1], [rx + 6, ry + 5], [rx + 11, ry + 16], [68, 90], [70, 98], ...saum(70, 30, 102, 6, 3, 9, hem).map(([x, y]) => [x, y + (70 - x) * 0.2])], null, { rd: 2 });
    const knie = E(32, 106, 7, 6, null);
    const riemen = [C(rx - 13, ry + 5, rx + 4, ry + 22, 1.1, 1.1, 'dunkel', { noRim: true }), C(rx - 16, ry + 13, rx + 2, ry + 9, 1, 1, 'dunkel', { noRim: true })];
    const kx = rx - 25 + r(lean * 0.3), ky = ry + 16 + nick;
    const kapuze = v.kapuze ? Pg([[kx - 6, ky - 2], [kx + 2, ky - 9], [kx + 10, ky - 7], [kx + 11, ky + 2], [kx + 4, ky + 8], [kx - 5, ky + 7]], 'dunkel', { rd: 1.5 }) : E(kx + 2, ky, 8, 7, 'dunkel', { pf: 'bevel' });
    // Arme: aus dem Mantel nach vorn, die Hände halten das Herz hin
    const hh = [kx - 11 + r(lean * 0.4), ky + 13 - r(auf * 0.4)];
    const arm = [...glied([[rx - 14, ry + 10], [kx + 2, ky + 15], hh], 2.8, 2, null), E(hh[0], hh[1] + 1, 4.2, 2.6, 'haut')];
    // Kerzenbündel auf dem Rücken: Fuß bei (rx+4, ry+18), gebunden bei ry+6
    const bfx = rx + 5, bfy = ry + 20;
    const kerzen = [], spitzen = [];
    v.kerzen.forEach(([a, l, d], i) => {
      const w = a + schw * (0.7 + 0.3 * (l / 70)) + (fallK ? fallK * (i - 3) * 0.08 : 0);
      const x1 = bfx + Math.cos(w) * l, y1 = bfy + Math.sin(w) * l + (fallK ? fallK * 30 : 0);
      kerzen.push(C(bfx + Math.cos(w) * 8, bfy + Math.sin(w) * 8, x1, y1, d, d * 0.95, i % 2 ? 'dunkel' : null, { pf: 'flat', noRim: i % 2 === 1 }));
      spitzen.push([x1, y1, w]);
    });
    const band = [C(bfx - 6 + Math.cos(-1.57 + schw) * 22, bfy + Math.sin(-1.57 + schw) * 22, bfx + 6 + Math.cos(-1.57 + schw) * 22, bfy + Math.sin(-1.57 + schw) * 22 - 1, 1.6, 1.6, 'dunkel')];
    const gruppen = [
      { p: kerzen, k: 0, pf: 'flat' },
      { p: band, k: 0 },
      { p: [unten, ...sohlen], k: 1 },
      { p: [mantel, knie], k: 3, anker: [lean, T - auf] },
      { p: riemen, k: 0 },
      { p: [kapuze], k: 1 },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // rote Bänder an den Kerzen und Wachsnasen
      spitzen.forEach(([x, y, w], i) => {
        const bx = x - Math.cos(w) * 10, by = y - Math.sin(w) * 10;
        if (i % 2 === 0) { P.auf(bx, by, 'kerzenrot'); P.auf(bx + 1, by, 'kerzenrot'); }
        // Die Wachsnasen laufen nach oben
        if (i % 3 === 1) { P.auf(x - Math.cos(w) * 18 + 1, y - Math.sin(w) * 18, 'wachs'); P.auf(x - Math.cos(w) * 18 + 1, y - Math.sin(w) * 18 - 1, 'wachs'); }
      });
      // Die brennende Kerze
      const b = spitzen[v.brennt];
      if (b && !P0.aus) {
        const x = r(b[0]), y = r(b[1]);
        P.glow(x + 0.5, y + 2, 8, 0.9, 'glutDim', 'k3');
        P.set(x, y - 1, 'flamme'); P.set(x, y - 2, 'kern'); P.set(x, y - 3, p.idle && f % 2 ? 'flamme' : 'glut'); if (p.angriff && f === 2) P.set(x + 1, y - 2, 'flamme');
      }
      // Wachsherz: warm, die zweithellste Stelle
      if (herz > 0.05) {
        const x = r(hh[0]), y = r(hh[1]) - 2;
        P.glow(x + 0.5, y + 1, 9 * herz + 3, 1, 'glutDim', 'k3');
        for (const [a, b2] of [[-2, -2], [-1, -2], [1, -2], [2, -2], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [-1, 0], [0, 0], [1, 0], [0, 1]]) P.set(x + a, y + b2, 'wachs'); P.set(x - 1, y - 2, 'k3'); P.set(x + 2, y - 1, 'r1');
        if (herz > 0.9) P.set(x, y, 'glut');
      }
      // Gesicht in der Kapuze: zwei Augen, tief, nach unten
      if (!P0.aus) { P.auge(kx - 2, ky + 3, 2); P.set(kx + 2, ky + 3, 'glut'); augen.push([r(kx - 2), r(ky + 3)], [r(kx + 2), r(ky + 3)]); }
      // Strick um die Hüfte, Kapuzenrand, das Gesicht als Höhle
      P.line(rx - 20, ry + 20, rx + 8, ry + 14, 'k3', true); P.line(rx - 19, ry + 21, rx + 7, ry + 15, 'k0', true); P.auf(rx - 14, ry + 22, 'r1'); P.auf(rx - 14, ry + 24, 'r1');
      for (let k = -5; k <= 6; k++) P.auf(kx + k, ky - 7 + Math.abs(k) * 0.35 + (k < -3 ? (-3 - k) * 1.5 : 0), 'k3');
      // Falten im Mantel
      P.line(rx - 4, ry + 4, rx - 10, 104, 'k1', true); P.line(rx + 4, ry + 8, rx + 2, 104, 'k1', true);
    };
    return { gruppen, details, augen };
  },
};
