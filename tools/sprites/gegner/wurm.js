// Wächter Salzstollen: Der Wurm im Salz. Kommt rechts aus dem Boden, wölbt sich hoch
// und senkt den Kopf nach links; ein rundes Maul mit einem Kranz aus Salzzähnen.
'use strict';
module.exports = {
  id: 'wurm', biom: 'salz', zone: 'salz', rang: 'waechter', w: 128, h: 160, fuss: [70, 155], kopf: [52, 30], rimBis: 156,
  varianten: { wurm: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, pose } = A;
    const P0 = pose(p, { lunge: 0, fall: 0 }), f = p.f;
    const stoss = p.angriff ? [-2, 4, 12, 4][f] : p.treffer ? [-5, -2][f] : 0;
    const sinken = p.tod ? r(p.q * 70) : 0;
    const welle = p.idle ? [0, 1, 1, 0][f] : 0;
    // Bogen: Parameter t von 0 (Boden rechts) bis 1 (Kopf links)
    const B = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
    const pt = t => [B(114, 104 + welle, 40 - stoss * 1.5, t), B(176, -14, 78 + stoss * 2, t) + sinken];
    const n = 20, ringe = [];
    for (let i = 0; i < n; i++) { const t = i / (n - 1); const [x, y] = pt(t); const rad = 16 - t * 5 + (i % 2) * 0.8; ringe.push({ x, y, rad }); }
    const gruppen = [];
    ringe.forEach((g, i) => { if (g.y - g.rad < 160) gruppen.push({ p: [E(g.x, g.y, g.rad, g.rad * 0.95, null, { pf: 'bevel' })], k: 0 }); });
    const kopf = ringe[n - 1];
    const augen = [];
    const details = P => {
      // Maul: runde Öffnung nach links unten, Kranz aus Salzzähnen
      const mx = r(kopf.x - 4), my = r(kopf.y + 6), mr = 7 + (p.angriff ? f : 0);
      if (my < 158) {
        P.el(mx + 0.5, my + 0.5, mr, mr * 0.8, 'k0', true);
        for (let a = 0; a < Math.PI * 2; a += 0.45) { P.auf(r(mx + Math.cos(a) * (mr - 1)), r(my + Math.sin(a) * (mr - 1) * 0.8), 'r2'); P.auf(r(mx + Math.cos(a) * (mr - 2)), r(my + Math.sin(a) * (mr - 2) * 0.8), 'r1'); }
        if (!P0.aus) for (const [dx, dy] of [[-9, -7], [-3, -11], [5, -9]]) { const x = r(kopf.x + dx + 2), y = r(kopf.y + dy + 2); P.set(x, y, dx === -3 ? 'kern' : 'glut'); P.glow(x + 0.5, y + 0.5, 4, 0.6); augen.push([x, y]); }
      }
      // Salz in den Ringfugen
      ringe.forEach((g, i) => { if (i % 2) for (let k = -3; k <= 3; k++) P.auf(r(g.x + k * 2), r(g.y - g.rad * 0.6 + Math.abs(k)), 'r1'); });
    };
    return { gruppen, details, augen };
  },
};
