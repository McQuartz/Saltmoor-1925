// Der Schleusenwärter (Gezeitenwerk, Elite). Jemand musste die Schützen ziehen, als das Werk noch
// lief, und das Werk hat ihn dafür gebaut. Ein hoher, gebeugter Leib zwischen zwei Pfosten wie ein
// Schleusentor; unten, wo die Beine sein müssten, hebt sich das Schütz und lässt Wasser durch. Auf
// den Schultern statt des Kopfes das Handrad aus Bronze, sechs Speichen, in der Nabe die Augen.
// Mit beiden Händen dreht er sich selbst auf und zu, und je nachdem, wie weit, ist er gegen
// anderes schwach. Angriff: er reißt das Rad herum, das Schütz fällt.
'use strict';
module.exports = {
  id: 'schleusenwaerter', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 128, h: 160, fuss: [64, 155], kopf: [62, 22], rimBis: 152, rang: 'elite',
  varianten: { schleusenwaerter: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, dreh = 0, hub = 0, fall = 0, glanz = 1, strahl = 0;
    if (p.idle) { dreh = [0, 0, 0.06, 0.06][f]; hub = 0; strahl = f; glanz = [1, 1.1, 1, 0.9][f]; }
    if (p.angriff) { lean = [1, 2, -6, -2][f]; dreh = [0.3, 0.7, 1.6, 1.9][f]; hub = [2, 4, -2, 0][f]; glanz = [1, 1.3, 1.7, 1.1][f]; strahl = f; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; dreh = -0.2; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; dreh = p.q; }
    const cx = 64, ox = lean, sy = 50 + fall;
    // Pfosten links und rechts, bis zum Boden
    const pfosten = [Pg([[cx - 28, sy + 6], [cx - 21, sy + 6], [cx - 21, 154], [cx - 28, 154]], null, { rd: 0.5, pf: 'bevel' }), Pg([[cx + 21, sy + 4], [cx + 28, sy + 4], [cx + 28, 154], [cx + 21, 154]], null, { rd: 0.5, pf: 'bevel' })];
    const kappen = [E(cx - 24.5, sy + 5, 5, 3, null, { pf: 'bevel' }), E(cx + 24.5, sy + 3, 5, 3, null, { pf: 'bevel' })];
    // Leib: Oberkörper eines Mannes, ab der Hüfte das Schütz aus Bohlen
    const leib = Pg([[cx - 16 + ox, sy + 8], [cx - 4 + ox, sy + 2], [cx + 14 + ox, sy + 6], [cx + 18 + ox, sy + 36], [cx - 18 + ox, sy + 38]], null, { rd: 2 });
    const schuetz = Pg([[cx - 20, sy + 36 - hub], [cx + 20, sy + 34 - hub], [cx + 20, 140 - hub], [cx - 20, 140 - hub]], null, { rd: 0.4, pf: 'flat' });
    // Handrad auf den Schultern
    const rx = cx + ox * 1.2, ry = sy - 14, R = 17;
    const ring = [];
    for (let i = 0; i < 12; i++) { const a0 = dreh + i * Math.PI / 6, a1 = dreh + (i + 1) * Math.PI / 6; ring.push(C(rx + R * Math.cos(a0), ry + R * Math.sin(a0), rx + R * Math.cos(a1), ry + R * Math.sin(a1), 2.2, 2.2, null, { pf: 'bevel' })); }
    const speichen = [0, 1, 2].map(i => { const a = dreh + i * Math.PI / 3; return C(rx - R * Math.cos(a), ry - R * Math.sin(a), rx + R * Math.cos(a), ry + R * Math.sin(a), 1.3, 1.3, null, { pf: 'bevel' }); });
    const nabe = E(rx, ry, 5.5, 5.5, null, { pf: 'bevel' });
    const hals = C(cx + ox, sy + 4, rx, ry + 4, 4, 3, null);
    // Arme greifen den Kranz
    const g1 = [rx + R * Math.cos(dreh + 2.6), ry + R * Math.sin(dreh + 2.6)], g2 = [rx + R * Math.cos(dreh + 0.4), ry + R * Math.sin(dreh + 0.4)];
    const armL = glied([[cx - 14 + ox, sy + 10], [cx - 30 + ox, sy + 4], g1], 3.4, 2.6, null);
    const armR = glied([[cx + 12 + ox, sy + 10], [cx + 26 + ox, sy + 14], g2], 3.4, 2.6, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : [...ring, ...speichen], k: 0.5, pf: 'bevel' },
      { p: armR, k: 1 },
      { p: [hals], k: 1 },
      { p: [leib], k: 3 },
      { p: [schuetz], k: 0, pf: 'flat' },
      { p: [...pfosten, ...kappen], k: 0.5, pf: 'bevel' },
      { p: tot ? [] : [nabe], k: 0, pf: 'bevel' },
      { p: armL, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Bohlenfugen und Beschläge am Schütz, Algen unten
      for (let y = sy + 46; y < 140; y += 9) P.line(cx - 19, r(y - hub), cx + 19, r(y - hub - 0.5), 'k0', true);
      [[cx - 15, sy + 42], [cx + 14, sy + 42], [cx - 15, 132], [cx + 14, 132]].forEach(([x, y]) => P.auf(x, r(y - hub), 'bronze'));
      // Bronze am Rad
      if (!tot) for (let i = 0; i < 6; i++) { const a = dreh + i * Math.PI / 3 + 0.3; P.auf(r(rx + (R - 1) * Math.cos(a)), r(ry + (R - 1) * Math.sin(a)), 'bronze'); }
      // Wasser unter dem Schütz: ein flacher Strahl in Stufen
      const wy = 140 - hub;
      for (let x = cx - 19; x <= cx + 19; x++) { const t = (x + strahl * 3) % 6; P.set(x, wy + 1, t < 3 ? 'wasser' : 'r1'); if (hub > 0 || t === 0) P.set(x, wy + 2 + (t % 3 === 0 ? 1 : 0), 'wasser'); }
      for (let x = cx - 30; x <= cx + 30; x += 2) P.set(x + (strahl % 2), 154, 'wasser');
      // Augen in der Nabe
      if (glanz > 0 && !tot) {
        const ex = r(rx - 2), ey = r(ry);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'kern'); P.set(ex, ey + 1, 'glut'); P.set(ex + 3, ey + 1, 'glut');
        P.glow(ex + 2, ey + 0.5, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
