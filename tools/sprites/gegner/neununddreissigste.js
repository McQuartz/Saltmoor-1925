// Zweiter Wächter Ziegelgruben: Die Neununddreißigste. Die Legion, die es nie gab, ihr Zeichen ist ein Ofen. Sie
// steht in der Schildkröte: die Schilde dicht über- und voreinander wie ein Dach, nur unten die Füße, viele, in
// Sandalen aus Lehm. Die Schilde sind Ziegel, gebrannt, mit dem Stempel der Legion, und in jedem ist derselbe
// Fingerabdruck. Zwischen den Schilden sieht man Augen, und Lanzen kommen heraus. Oben ragt das Feldzeichen:
// eine Stange mit Scheiben, ganz oben ein kleiner Ofen, in dem die Glut nicht ausgeht.
// Randlicht kühl wie nasser Lehm, ein Ton, den die rote Ofenhalle nicht hat.
'use strict';
const LIB = require('../lib');
const { h, innenKanten, randKraeftig } = require('./hilfe/w2a3');

module.exports = {
  id: 'neununddreissigste', biom: 'ziegelgruben', zone: 'ziegelgruben_lehm', rang: 'waechter', w: 160, h: 180, fuss: [84, 176], kopf: [92, 4], rimBis: 172,
  varianten: { neununddreissigste: {} },
  // Silhouetten-Probe (verworfen): die Schildkröte als flacher, langer Kasten auf Beinen. Schwarz zu nah am
  // Getragenen und am Lehmhund; als hohe Kuppel mit Feldzeichen liest sie sich als Schildkröte.
  proben: { probe_kasten: { kasten: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    let lean = 0, dy = 0, stoss = 0, schritt = [0, 1, 0, -1][f % 4], sw = [0, 1, 0, -1][f % 4], fall = 0, glueh = [0.8, 0.95, 1, 0.9][f % 4];
    if (!p.idle) { schritt = 0; sw = 0; }
    if (p.angriff) { lean = [3, 6, -8, -3][f]; dy = [0, -2, 1, 0][f]; stoss = [0, -0.4, 1, 0.4][f]; schritt = [0.5, 1, -1, 0][f]; glueh = [1, 1.1, 1.3, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; }
    if (p.tod) { fall = p.q; }
    const cx = 86 + lean, cy = 150 + dy, rx = v.kasten ? 72 : 64, ry = v.kasten ? 40 : 62;
    const kTop = v.kasten ? 92 : cy - ry;
    // Schilde: Reihen über die Kuppel, oben zuerst (hinten), unten zuletzt (vorn); jede Reihe versetzt
    const schilde = [];
    // Dach: drei Reihen, schräg gestellt und überlappend; unten die Seitenwand aus hohen Schilden, senkrecht
    const reihen = v.kasten ? [[100, 13], [114, 13], [128, 13], [142, 13]] : [[cy - ry + 10, 16], [cy - ry + 24, 18], [cy - ry + 39, 19]];
    reihen.forEach(([yy, sh], j) => {
      const halb = v.kasten ? rx : rx * Math.sqrt(Math.max(0, 1 - ((yy - cy) / ry) ** 2)) + 4;
      const n = Math.max(2, Math.round(halb * 2 / 17)), sbw = halb * 2 / n;
      for (let i = 0; i < n; i++) {
        const x = cx - halb + sbw * (i + 0.5) + (j % 2 ? sbw * 0.25 : -sbw * 0.25);
        const u = (x - cx) / rx, tilt = v.kasten ? 0 : u * 0.35;
        // Tod: die Schilde fallen von oben einzeln herab
        const fq = p.tod ? Math.max(0, fall * 1.8 - (1 - j / reihen.length) * 0.6 - h(i, j) * 0.3) : 0;
        const ox = fq * (h(i, j, 2) - 0.5) * 30, oy = fq * fq * (FY - yy) * 0.9;
        const w2 = sbw * 0.56, h2 = sh * 0.62, ca = Math.cos(tilt), sa = Math.sin(tilt), X = x + ox, Y = yy + oy;
        const pts = [[-w2, -h2], [w2, -h2], [w2, h2], [-w2, h2]].map(([a, b]) => [X + a * ca - b * sa, Y + a * sa + b * ca]);
        schilde.push({ i, j, x: X, y: Y, w2, h2, tilt, p: [Pg(pts, null, { rd: 1.2 })], id: j * 20 + i });
      }
    });
    const wand = [];
    if (!v.kasten) { const n = 7, x0 = cx - rx + 4, x1 = cx + rx - 4, sbw = (x1 - x0) / n;
      for (let i = 0; i < n; i++) { const fq = p.tod ? Math.max(0, fall * 1.6 - 0.3 - h(i, 9) * 0.4) : 0; const X = x0 + sbw * (i + 0.5) + fq * (h(i, 8) - 0.5) * 20, Y = cy - 15 + fq * fq * 30, w2 = sbw * 0.56, h2 = 15, tl = fq * (h(i, 7) - 0.5) * 1.2;
        const ca = Math.cos(tl), sa = Math.sin(tl); const pts = [[-w2, -h2], [w2, -h2], [w2, h2], [-w2, h2]].map(([a, b]) => [X + a * ca - b * sa, Y + a * sa + b * ca]);
        wand.push({ i, j: 9, x: X, y: Y, w2, h2, tilt: tl, p: [Pg(pts, null, { rd: 1.5 })], id: 200 + i, wand: true }); } }
    // Füße: zwei Reihen, im Schritt; in Sandalen
    const fuesse = [];
    if (!(p.tod && fall > 0.6)) for (let i = 0; i < 9; i++) {
      const x = cx - rx + 14 + i * ((rx * 2 - 22) / 8), hint = i % 2, phase = (i % 2 ? 1 : -1) * schritt;
      const y0 = cy - 4, k = [x + phase * 2 - 2, 166 + (hint ? -2 : 0)], e = [x + phase * 3 - 3, FY - (hint ? 3 : 0) - (phase > 0 ? 1 : 0)];
      fuesse.push({ hint, g: [...glied([[x, y0], k, e], 3.2, 2.2, hint ? 'dunkel' : null), Pg([[e[0] - 5, e[1] - 2], [e[0] + 2, e[1] - 2], [e[0] + 2, e[1] + 1], [e[0] - 6, e[1] + 1]], hint ? 'dunkel' : null, { rd: 0.6 })] });
    }
    // Lanzen: drei aus den Lücken vorn, beim Stoß weit heraus
    const lanzen = [];
    if (!(p.tod && fall > 0.4)) for (const [yy, l0] of [[cy - 31, 30], [cy - 18, 26], [cy - 44, 22]]) { const x0 = cx - rx + 10, L = l0 + stoss * 18, x1 = x0 - L, y1 = yy - 2 - stoss * 2;
      lanzen.push(C(x0, yy, x1, y1, 1.1, 1.1, null, { pf: 'flat' }), Pg([[x1 + 1, y1 - 2.6], [x1 - 7, y1], [x1 + 1, y1 + 2.6]], null, { rd: 0.3 })); }
    // Feldzeichen: Stange, Querholz mit Bändern, drei Scheiben, oben der kleine Ofen
    const zx = cx + 6 + sw * 0.5, zTop = 8 + (p.tod ? r(fall * 60) : 0) + dy, zx2 = zx + (p.tod ? fall * 20 : 0);
    const stange = [C(zx, kTop + 12, zx2, zTop + 14, 1.6, 1.4, null)];
    const quer = [C(zx2 - 10, zTop + 30, zx2 + 10, zTop + 30, 1.3, 1.3, null), ...glied([[zx2 - 9, zTop + 31], [zx2 - 10 - sw, zTop + 40], [zx2 - 9 - sw, zTop + 48]], 1.4, 1, null), ...glied([[zx2 + 9, zTop + 31], [zx2 + 8 - sw, zTop + 40], [zx2 + 9 - sw, zTop + 47]], 1.4, 1, null)];
    const scheiben = [E(zx2 + (zx - zx2) * 0.2, zTop + 40, 4.6, 4.6, null), E(zx2 + (zx - zx2) * 0.35, zTop + 52, 4.6, 4.6, null), E(zx2 + (zx - zx2) * 0.5, zTop + 64, 4.6, 4.6, null)];
    const ofen = [Pg([[zx2 - 7, zTop + 22], [zx2 + 7, zTop + 22], [zx2 + 6, zTop + 12], [zx2 + 2, zTop + 6], [zx2 + 2, zTop], [zx2 - 2, zTop], [zx2 - 2, zTop + 6], [zx2 - 6, zTop + 12]], null, { rd: 0.8 })];
    const gruppen = [];
    const FUH = []; fuesse.filter(q => q.hint).forEach(q => FUH.push(gruppen.push({ p: q.g, k: 0.8, kante: true }) - 1));
    const STANGE = gruppen.push({ p: stange, k: 0, kante: true }) - 1;
    const QUER = gruppen.push({ p: quer, k: 0.5, kante: true }) - 1;
    const SCHEIB = gruppen.push({ p: scheiben, k: 0, kante: true }) - 1;
    const OFEN = gruppen.push({ p: ofen, k: 0.5, kante: true }) - 1;
    const DUNKEL = gruppen.push({ p: [Pg([[cx - rx + 8, cy - 2], [cx - rx + 10, cy - 40], [cx - 20, cy - ry + 8], [cx + 30, cy - ry + 8], [cx + rx - 10, cy - 40], [cx + rx - 8, cy - 2]], 'dunkel', { rd: 4, pf: 'flat' })], k: 0, noRim: true }) - 1;
    const SCH = []; schilde.forEach(s2 => SCH.push(gruppen.push({ p: s2.p, k: 0, kante: true, schild: s2 }) - 1));
    const LANZE = gruppen.push({ p: lanzen, k: 0, kante: true }) - 1;
    wand.forEach(s2 => SCH.push(gruppen.push({ p: s2.p, k: 0, kante: true, schild: s2 }) - 1));
    fuesse.filter(q => !q.hint).forEach(q => FUH.push(gruppen.push({ p: q.g, k: 0.8, kante: true }) - 1));
    gruppen.forEach(g => { g.anker = [r(lean), r(dy)]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('ziegelgruben_lehm'), { rimBis: 172 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - r(lean), y - r(dy));
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[y * W + x] === g;
      // Schilde: gebrannter Ziegel (dunkel), Rand als Wulst, Mitte der Buckel (Umbo), Stempel der Legion und der Abdruck
      SCH.forEach(gi => { const s2 = gruppen[gi].schild, ca = Math.cos(-s2.tilt), sa = Math.sin(-s2.tilt);
        for (let y = r(s2.y - 14); y <= r(s2.y + 14); y++) for (let x = r(s2.x - 16); x <= r(s2.x + 16); x++) {
          if (!ist(x, y, gi)) continue; const k = P.get(x, y); if (k < 1 || k > 4) continue;
          const dx = x + 0.5 - s2.x, dyy = y + 0.5 - s2.y, u = (dx * ca - dyy * sa) / s2.w2, w = (dx * sa + dyy * ca) / s2.h2;
          // gewölbt: oben rechts heller (Licht von hinten oben), unten links dunkel
          let t = (u * 0.5 - w) > 0.5 ? (B(x, y) < 0.55 ? 4 : 3) : (u * 0.5 - w) > -0.1 ? (B(x, y) < 0.45 ? 3 : 2) : (B(x, y) < 0.3 ? 2 : 1);
          if (w < -0.8) t = s2.wand || u > -0.6 ? 'r1' : 4; else if (u > 0.82) t = B(x, y) < 0.5 ? 'r1' : 4; else if (w > 0.82 || u < -0.84) t = 1;
          else if (Math.hypot(u * 1.4, w * (s2.wand ? 2.4 : 1.8)) < 0.36) t = Math.hypot(u * 1.4 - 0.14, w * 2 + 0.24) < 0.18 ? 'r1' : 4;
          // Stempel: ein kleines Rechteck unten, gebrannter Ziegel
          if (s2.wand && u > -0.45 && u < 0.2 && w > 0.48 && w < 0.66) t = 'ziegel';
          // Fingerabdruck: Bögen oben links
          const fr = Math.hypot((u + 0.38) * 1.3, (w + 0.3) * (s2.wand ? 2.6 : 1.6)); if (fr < 0.34 && Math.round(fr * 20) % 2 === 0) t = 1;
          P.set(x, y, t);
        } });
      // Dunkel zwischen den Schilden, darin Augen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, DUNKEL)) P.set(x, y, 1);
      if (!(p.tod && f >= 1)) for (const [ex, ey] of [[cx - rx + 14, cy - 33], [cx - rx + 34, cy - 32], [cx - 4, cy - 31], [cx - rx + 22, cy - 46]]) {
        const X = r(ex), Y = r(ey); if (gid[Y * W + X] === DUNKEL || gid[Y * W + X + 3] === DUNKEL) { P.set(X, Y, 'glut'); P.set(X + 3, Y, 'glut'); augen.push([X, Y]); } }
      // Feldzeichen: Bronze? hier gebrannter Ton, Scheiben mit Buckel, Bänder aus Leinen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (ist(x, y, SCHEIB) && P.get(x, y) <= 4) P.set(x, y, Math.hypot(x - zx2 - (zx - zx2) * 0.35, (y - zTop - 52) % 12) < 1.5 ? 4 : (B(x, y) < 0.4 ? 3 : 2));
        if (ist(x, y, OFEN) && P.get(x, y) <= 4) P.set(x, y, ((y - zTop) % 4 === 0) ? 1 : 2);
        if (ist(x, y, LANZE) && P.get(x, y) <= 4) P.set(x, y, 3);
      }
      // der Ofen im Feldzeichen glüht: Feuerloch unten, Glut oben im Schlot
      if (glueh > 0.2) { const ox = r(zx2), oy = r(zTop + 18); for (let y = oy - 2; y <= oy + 2; y++) for (let x = ox - 3; x <= ox + 3; x++) if (ist(x, y, OFEN)) P.set(x, y, Math.abs(x - ox) < 2 && y > oy - 2 ? (glueh > 0.9 && y === oy ? 'kern' : 'glut') : 'glutDim');
        P.glow(ox, oy, 9 * glueh, 0.5, 'glutDim', 'k3'); augen.push([ox, oy]); if (glueh > 0.9) P.set(ox, zTop - 1, 'glutDim'); }
      // Füße: Lehm, Riemen der Sandalen
      FUH.forEach(gi => { for (let y = 160; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gi) && P.get(x, y) <= 4 && y % 3 === 0) P.set(x, y, 1); });
      innenKanten(P, gid, gruppen, W, H, 'r1');
      randKraeftig(P, W, H, { bis: 170 });
    };
    return { gruppen, details, augen };
  },
};
