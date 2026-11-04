// Wächter Grotte: Die Erhörte. Eine Pilgerin, deren Gebet erhört wurde, ganz und gar.
// Sie steht in der Haltung der Betenden, die Hände über dem Kopf zur Spitze gefaltet, und aus den
// Fingerspitzen brennt ein Docht. Sie ist aus Wachs: der Rock ist zu einem Sockel zerflossen, in
// Schultern und Rock stecken Votivkerzen, an der Brust ein Wachsherz. Sie ist warm.
'use strict';
module.exports = {
  id: 'erhoerte', biom: 'grotte', zone: 'grotte', rang: 'waechter', w: 128, h: 160, fuss: [64, 155], kopf: [64, 4], rimBis: 152,
  varianten: { erhoerte: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const f = p.f, P0 = pose(p, { fall: 0 });
    let hebe = 0, lean = 0, nick = 0, schmelz = 0, flamme = 1, tropf = 0;
    if (p.idle) { hebe = [0, 0, 1, 1][f]; tropf = f; flamme = [1, 1.2, 1, 0.9][f]; }
    // Ausholen: die gefalteten Hände gehen höher und nach hinten, dann fahren sie nach vorn herab
    if (p.angriff) { hebe = [4, 7, -16, -5][f]; lean = [2, 4, -10, -3][f]; nick = [-1, -2, 2, 0][f]; flamme = [1.2, 1.4, 1.8, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; nick = -2; flamme = 0.7; }
    if (p.tod) { schmelz = p.q; flamme = Math.max(0, 1 - p.q * 2); }
    const T = P0.atem, S = schmelz;
    const sy = y => r(155 - (155 - y) * (1 - S * 0.55)); // Schmelzen: alles sackt zum Boden
    const sx = (x, y) => r(64 + (x - 64) * (1 + S * 0.35 * (y / 155)));
    const cx = 64 + lean;
    // Sockel aus zerflossenem Rock: runde Wachszungen statt Saum
    const rock = Pg([[sx(54, 92), sy(92)], [sx(74, 92), sy(92)], [sx(80, 106), sy(106)], [sx(88, 122), sy(122)], [sx(98, 140), sy(140)], [sx(108, 152), 153], [104, 156], [24, 156], [20, 153], [sx(30, 140), sy(140)], [sx(40, 122), sy(122)], [sx(48, 106), sy(106)]], null, { rd: 2 });
    const zungen = [E(30, 153, 11, 3.5, null), E(56, 154, 13, 3, null), E(86, 154, 12, 3, null), E(106, 152, 7, 4, null), E(sx(36, 140), sy(142), 6, 8, null), E(sx(94, 138), sy(140), 6, 9, null)];
    // Leib: Taille, Brust, Schultern
    const ty = sy(64 + T);
    const leib = Pg([[sx(54, 100), sy(100)], [sx(56, 84) + lean * 0.4, sy(84)], [cx - 10, ty + 8], [cx - 14, ty + 1], [cx - 6, ty - 3], [cx + 6, ty - 3], [cx + 14, ty + 1], [cx + 10, ty + 8], [sx(72, 84) + lean * 0.4, sy(84)], [sx(74, 100), sy(100)]], null, { rd: 2 });
    // Kopf im Nacken, Schleier fällt über den Rücken
    const kx = cx + 2 + nick, ky = ty - 13 + nick - r(S * 6);
    const kopf = Pg([[kx - 6, ky + 4], [kx - 6, ky - 3], [kx - 2, ky - 8], [kx + 4, ky - 7], [kx + 6, ky - 1], [kx + 4, ky + 6], [kx - 2, ky + 8]], 'haut', { rd: 1.5 });
    const schleier = Pg([[kx - 2, ky - 9], [kx + 6, ky - 8], [kx + 10, ky], [cx + 17, ty + 4], [cx + 16, ty + 24], [cx + 12, ty + 16], [kx + 6, ky + 8]], 'dunkel', { rd: 1.5 });
    // Arme: gehoben, die Hände über dem Kopf zur Spitze gefaltet
    const hx = cx - (p.angriff && f === 2 ? 22 : 0) + (p.angriff ? lean * 0.6 : 0), hyy = ty - 44 - hebe + (p.angriff && f === 2 ? 38 : 0) + r(S * 40);
    const armL = glied([[cx - 11, ty + 1], [cx - 22 + (f === 2 && p.angriff ? -6 : 0), ty - 18 - hebe * 0.5 + (p.angriff && f === 2 ? 22 : 0) + r(S * 25)], [hx - 2, hyy + 2]], 3.4, 2.2, null);
    const armR = glied([[cx + 11, ty + 1], [cx + 22 + (f === 2 && p.angriff ? -10 : 0), ty - 18 - hebe * 0.5 + (p.angriff && f === 2 ? 26 : 0) + r(S * 25)], [hx + 2, hyy + 2]], 3.4, 2.2, null);
    // Wachszapfen hängen unter den Unterarmen (sie schmilzt im Stehen)
    const zapfen = [];
    for (const arm of [armL, armR]) { const sg = arm[0]; for (const q of [0.35, 0.7]) { const x = sg.x1 + (sg.x2 - sg.x1) * q, y = sg.y1 + (sg.y2 - sg.y1) * q; zapfen.push(C(x, y + 2, x - 0.5, y + 5 + q * 4 + (p.idle ? f % 2 : 0), 1.3, 0.6, null)); } const sg2 = arm[1]; zapfen.push(C(sg2.x1, sg2.y1 + 2, sg2.x1, sg2.y1 + 7, 1.4, 0.6, null)); }
    const haende = Pg([[hx - 4, hyy + 4], [hx, hyy - 7], [hx + 4, hyy + 4]], 'haut', { rd: 1.2 });
    // Votivkerzen, die in ihr stecken: [x, y, Höhe]
    const kz = [[cx - 13, ty - 2, 6], [cx + 14, ty - 1, 5], [cx - 8, ty - 4, 4], [sx(46, 118), sy(118), 7], [sx(84, 116), sy(116), 6], [sx(36, 136), sy(136), 5], [sx(96, 134), sy(134), 6], [sx(60, 130), sy(130), 4], [sx(74, 140), sy(140), 5], [sx(52, 144), sy(144), 3], [sx(86, 146), sy(146), 4], [sx(68, 120), sy(120), 3], [sx(28, 150), 150, 3], [sx(102, 149), 149, 3]];
    const kerzen = kz.map(([x, y, h]) => C(x, y, x, y - h * (1 - S), 1.4, 1.3, null, { pf: 'flat' }));
    const gruppen = [
      { p: [schleier], k: 1, anker: [lean, T] },
      { p: [rock, ...zungen, leib], k: 4, tone: 0.12 },
      { p: [kopf], k: 0 },
      { p: kerzen, k: 0 },
      { p: [...armR, ...zapfen.slice(3)], k: 1 },
      { p: [...armL, ...zapfen.slice(0, 3)], k: 1 },
      { p: [haende], k: 0.5 },
    ];
    const augen = [];
    const details = P => {
      // Wärme: das Wachs glimmt von innen, am stärksten um das Herz
      P.glow(cx, ty + 14, 34, 0.75, 'k3', 'k2');
      P.glow(64, 132, 40, 0.7, 'k3', 'k2');
      P.glow(cx - 4, ty + 9, 8, 0.8, 'glutDim', 'k3');
      // Wachsherz an der Brust
      const hzx = cx - 4, hzy = ty + 9;
      for (const [a, b] of [[-2, -1], [-1, -2], [1, -2], [2, -1], [-2, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) P.auf(hzx + a, hzy + b, 'wachs');
      if (!P0.aus) { P.set(hzx, hzy, 'glut'); P.set(hzx - 1, hzy - 1, 'kern'); }
      // Tropfspuren: laufen von Armen und Schultern herab (wandern im Leerlauf)
      for (const [x0, y0, l] of [[cx - 14, ty + 2, 8], [cx + 15, ty + 3, 10], [sx(50, 100), sy(100), 12], [sx(78, 102), sy(102), 9], [sx(88, 124), sy(124), 7]]) {
        for (let k = 0; k < l; k++) P.auf(x0, y0 + k, k === (l - 1 + tropf) % l ? 'wachs' : 'k3');
      }
      // Kerzenflammen: in den Schultern und im Rock
      if (flamme > 0) kz.forEach(([x, y, h], i) => {
        if (p.idle && (i + f) % 5 === 4) return;
        const tY = r(y - h * (1 - S)) - 1;
        P.glow(x + 0.5, tY + 1, 5, 0.85, 'glutDim', 'k3');
        P.set(x, tY, 'flamme'); P.set(x, tY - 1, i % 3 ? 'flamme' : 'kern');
        if ((i + f) % 2) P.set(x, tY - 2, 'glut');
        for (let k = 1; k < h * (1 - S) - 1; k += 3) P.auf(x, tY + 1 + k, 'kerzenrot');
      });
      // Docht aus den Fingerspitzen: die große Flamme
      if (flamme > 0) {
        const fx = r(hx), fy = r(hyy) - 7, fh = Math.round(6 * flamme);
        P.glow(fx + 0.5, fy + 4, 14, 0.95, 'glutDim', 'k3');
        for (let k = 0; k < fh; k++) { P.set(fx, fy - k, k < 2 ? 'kern' : k < fh - 2 ? 'flamme' : 'glut'); if (k > 0 && k < fh - 2) { P.set(fx - 1, fy - k + 1, 'glut'); P.set(fx + 1, fy - k + 1, k % 2 ? 'flamme' : 'glut'); } }
        if (p.angriff && f === 2) for (let k = 1; k < 6; k++) P.set(fx + k * 2, fy - k + 2, 'glut');
      }
      // Gesicht nach oben: zwei Augen, offener Mund
      if (!P0.aus) {
        P.auge(kx - 3, ky - 2, 2); P.auge(kx + 2, ky - 3, 2);
        augen.push([r(kx - 3), r(ky - 2)], [r(kx + 2), r(ky - 3)]);
      }
      P.auf(kx - 2, ky + 3, 'k0'); P.auf(kx - 1, ky + 3, 'k0'); P.auf(kx - 2, ky + 4, 'k0'); P.auf(kx - 1, ky + 4, 'k0');
      augen.push([r(hx), r(hyy) - 9]);
    };
    return { gruppen, details, augen };
  },
};
