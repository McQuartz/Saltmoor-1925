// Der Novize (Kloster der Abschrift). Ein Junge mit zugenähten Augen unter einem Turm aus Abschriften,
// der höher ist als er und nach oben breiter wird: jedes Buch dicker als das darunter.
// Durch die Stiche der Naht scheint Licht. Eine Hand tastet nach vorn.
'use strict';
const rot = (px, py, th) => (x, y) => { const dx = x - px, dy = y - py, c = Math.cos(th), s = Math.sin(th); return [px + dx * c + dy * s, py - dx * s + dy * c]; };
module.exports = {
  id: 'novize', biom: 'kloster', zone: 'kloster', w: 96, h: 120, fuss: [48, 115], kopf: [42, 22], rimBis: 113,
  varianten: {
    // b: Breite der Bücher unten -> oben, t: Dicke, kipp: Grundneigung des Turms nach vorn, kerze: Kerze auf dem obersten Buch
    novize_a: { b: [13, 15, 17, 19, 22, 25, 28, 32], t: [5, 5, 6, 7, 7, 8, 9, 11], kipp: 0.12, buckel: 0, kerze: false, versatz: [0, 2, -1, 2, -2, 1, 0, 2], krumm: 1.0 },
    novize_b: { b: [12, 15, 16, 20, 21, 25, 27, 30, 34], t: [4, 5, 5, 6, 6, 7, 8, 8, 10], kipp: 0.04, buckel: 2, kerze: true, versatz: [1, -1, 2, 0, 3, -1, 2, 0, 3], krumm: 1.25 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let th = v.kipp, lean = 0, atem = 0, fall = 0, hand = 0, augenAn = true, streu = 0, hy = 0;
    let wieg = 0;
    if (p.idle) { wieg = [0, -1, -1, 0][f]; atem = [0, 0, 1, 1][f]; hand = [0, 1, 2, 1][f]; }
    if (p.angriff) { th += [-0.1, -0.2, 0.36, 0.12][f]; lean = [1, 2, -5, -2][f]; hy = [-1, -2, 2, 1][f]; hand = [0, -2, 3, 1][f]; }
    if (p.treffer) { th += [-0.07, -0.03][f]; lean = [2, 1][f]; hy = [-1, 0][f]; }
    if (p.tod) { th += p.q * 0.6; fall = r(p.q * 14); streu = p.q; augenAn = f < 1; lean = r(p.q * 2); }
    const T = atem + fall, B = v.buckel;
    // Junge: klein, tief gebeugt (der Rücken trägt den Turm), sieht nach links
    const sx = 40 + lean, sy = 82 + T + B; // Schultern
    const kx = 29 + lean + Math.min(0, lean), ky = 81 + T + B + hy;
    const kutte = Pg([[sx - 6, sy - 2], [sx + 6, sy - 6], [sx + 16, sy + 1], [60, 96], [61, 104], ...saum(61, 42, 108, 4, 3, 21, p.idle ? [0, 1, 1, 0][f] : 0), [41, 101], [sx - 3, sy + 8]], null, { rd: 1.2 });
    const kapuze = E(sx - 2, sy - 2, 5, 3.5, 'dunkel');
    const kopf = E(kx, ky, 5.5, 6, 'haut');
    const nacken = C(sx - 2, sy, kx + 2, ky + 1, 3.2, 2.6, null);
    const beine = [...glied([[48, 104], [45, 109], [46, 114]], 2.3, 1.6, null), ...glied([[56, 104], [59, 109], [57, 114]], 2.3, 1.6, null), E(44, 114, 3, 1.3, 'haut'), E(56, 114, 3, 1.3, 'haut')];
    // tastende Hand: Arm nach vorn, Finger gespreizt
    const hx = 16 - hand + (p.angriff && f === 2 ? -3 : 0), hyy = 93 + T + B + (p.idle ? [0, 0, -1, 0][f] : 0);
    const arm = glied([[sx - 4, sy + 3], [27 + lean, 96 + T + B], [hx, hyy]], 2.0, 1.3, null);
    const finger = [0, 1, 2].map(i => C(hx, hyy, hx - 5 + i, hyy - 3 + i * 3, 0.8, 0.6, 'haut'));
    const arm2 = glied([[sx + 10, sy], [sx + 16, sy + 9], [sx + 13, sy + 15]], 1.8, 1.3, null);
    // Bücherturm: auf dem Rücken, Drehpunkt unten am Rücken; nach oben breiter, kippt nach vorn
    const px = 52 + lean, py = 84 + T + B;
    const R0 = rot(px, py, th);
    const buecher = []; let y = py;
    v.b.forEach((w, i) => {
      const t = v.t[i]; const cy = y - t / 2; y -= t;
      // Kippen: obere Bücher hängen weiter nach vorn (gebogener Turm), etwas schief gestapelt
      const vor = -Math.pow(i, 1.5) * 0.75 * v.krumm + v.versatz[i];
      const a = (i % 2 ? 0.05 : -0.04) + i * 0.012;
      let cx = px + vor + 3, ccy = cy; const off = r(wieg * i / (v.b.length - 1));
      if (streu) { cx -= streu * i * i * 0.35; ccy += streu * i * 3.5; }
      const ca = Math.cos(a), sa = Math.sin(a);
      const ecken = [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([u, q]) => { const [X, Y] = R0(cx + u * ca - q * sa, ccy + u * sa + q * ca); return [X + off, Y]; });
      buecher.push({ ecken, cx, cy: ccy, w, t, a, i, off });
    });
    const gruppen = [
      { p: arm2, k: 0 },
      { p: beine, k: 1 },
      { p: [kutte, kapuze, nacken], k: 3, anker: [lean, T + B] },
      ...buecher.map(b => ({ p: [Pg(b.ecken, b.i % 3 === 1 ? 'dunkel' : null, { rd: 0.6 })], k: 0, pf: 'bevel', anker: [r(R0(b.cx, b.cy)[0] - b.cx) + b.off, r(R0(b.cx, b.cy)[1] - b.cy) + T] })),
      { p: [kopf], k: 0, anker: [lean, T] },
      { p: [...arm, ...finger], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Seiten der Bücher: Lagen als Linien, Rücken mit Bünden (links, zum Betrachter)
      for (const b of buecher) {
        const ca = Math.cos(b.a), sa = Math.sin(b.a);
        for (let u = -b.w / 2 + 0.5; u <= b.w / 2 - 0.5; u += 0.5) for (let q = -b.t / 2 + 0.5; q <= b.t / 2 - 0.5; q += 0.5) {
          const [x, yy] = R0(b.cx + u * ca - q * sa, b.cy + u * sa + q * ca); const X = r(x) + b.off, Y = r(yy); const c = P.get(X, Y);
          if (c < 1 || c > 4) continue;
          const zeile = Math.floor(q + b.t / 2), deckel = zeile === 0 || zeile >= Math.floor(b.t) - 1;
          if (u < -b.w / 2 + 3) { if (Math.abs((u + b.w / 2) - 1.5) < 0.3 || deckel) P.set(X, Y, 'k0'); else P.set(X, Y, 'k1'); continue; }
          if (deckel) { if (c > 2) P.set(X, Y, 'k2'); continue; }
          // Lagen nur angedeutet: am Licht (rechts) eine helle Kante, sonst dunkle Fugen zwischen den Lagen
          if (u > b.w / 2 - 2.5) P.set(X, Y, zeile % 2 ? 'r1' : 'k3');
          else if (zeile % 2 === 1) P.set(X, Y, u > -b.w / 4 ? 'k3' : 'k2');
          else if (c > 2) P.set(X, Y, 'k1');
        }
      }
      // Riemen über die Schulter
      P.line(r(sx), r(sy - 3), r(px - 4), r(py - 8), 'k0', true);
      // zugenähte Augen: Naht aus Licht, Stiche davor
      const ex = r(kx - 3), ey = r(ky);
      if (augenAn) {
        P.glow(ex + 1.5, ey + 0.5, 6, 0.85);
        for (let k = -1; k <= 4; k++) P.set(ex + k - 1, ey, k === 1 || k === 2 ? 'kern' : 'glut');
        for (const k of [-1, 1, 3]) { P.set(ex + k - 1, ey - 1, 'k0'); P.set(ex + k, ey + 1, 'k0'); P.set(ex + k - 0, ey, 'k0'); }
        augen.push([ex + 1, ey]);
      } else for (let k = -1; k <= 4; k++) P.set(ex + k - 1, ey, k % 2 ? 'k0' : 'k1');
      // Mund: klein, offen beim Umkippen
      P.auf(r(kx - 2), r(ky + 3), 'k0'); if (p.angriff && f >= 2) P.auf(r(kx - 2), r(ky + 4), 'k0');
      // Kerze auf dem obersten Buch (Variante b)
      if (v.kerze && !p.tod) {
        const top = buecher[buecher.length - 1]; const [kx2, ky2] = R0(top.cx - top.w / 2 + 6, top.cy - top.t / 2);
        const X = r(kx2) + top.off, Y = r(ky2);
        for (let k = 1; k <= 4; k++) { P.set(X, Y - k, 'r1'); P.set(X + 1, Y - k, 'k3'); }
        P.glow(X + 0.5, Y - 6, 7, 0.9);
        const fl = p.idle ? [2, 3, 2, 3][f] : 2;
        P.set(X, Y - 5, 'flamme'); P.set(X + 1, Y - 5, 'flamme'); P.set(X, Y - 6, 'kern'); P.set(X, Y - 7, 'glut'); if (fl > 2) P.set(X, Y - 8, 'flamme');
        augen.push([X, Y - 6]);
      }
    };
    return { gruppen, details, augen };
  },
};
