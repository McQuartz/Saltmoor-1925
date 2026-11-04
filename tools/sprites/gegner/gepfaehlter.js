// Der Gepfählte (Moorwald, Ergänzung). Vor siebzehnhundert Jahren ins Moor gelegt, mit der Weidenschlinge
// um den Hals, unter ein Flechtwerk gedrückt und mit Pfählen festgesteckt, damit er nicht wiederkommt.
// 1925 haben die Torfstecher die Pfähle mit ausgestochen. Er kniet unter dem Flechtwerk wie unter einem Dach,
// die Pfähle stecken noch, die Haut ist gegerbtes Leder. Die Augen sind zu, aber das Licht kommt durch die Lider.
'use strict';
const K = require('./hilfe/kanten');
module.exports = {
  id: 'gepfaehlter', biom: 'moor', zone: 'moor', w: 96, h: 120, fuss: [54, 115], kopf: [60, 14], rimBis: 113,
  varianten: {
    gepfaehlter_a: { haltung: 'kniend', pfaehle: 3, kappe: true, irrlicht: true },
    gepfaehlter_b: { haltung: 'kniend', pfaehle: 4, kappe: false, irrlicht: true, zone: 'moor_gruen', zerrissen: true },
  },
  skizzen: {
    skizze_gebeugt: { haltung: 'gebeugt', pfaehle: 3, kappe: true, irrlicht: false },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, G = v.haltung === 'gebeugt';
    let L = 0, atem = 0, fall = 0, armH = 0, armX = 0, irr = 0, augenAn = true, kopfY = 0, sack = 0;
    // armH: 0 Hand am Boden, 1 erhoben, 2 Schlag (Hand weit vorn unten)
    if (p.idle) { atem = [0, 0, 1, 1][f]; irr = [0, -1, -1, 0][f]; kopfY = [0, 0, 0, 1][f]; }
    if (p.angriff) { L = [2, 4, -8, -3][f]; armH = [1, 1.3, 2, 2.5][f]; atem = [1, -4, 1, 0][f]; irr = [-1, -2, 0, 0][f]; }
    if (p.treffer) { L = [2, 1][f]; atem = -1; }
    if (p.tod) { fall = r(p.q * 30); L = r(p.q * 2); augenAn = f < 1; sack = r(p.q * 6); }
    const T = atem + fall, X = L;
    // Rumpf: vorgebeugt von der Hüfte zu den Schultern, mager, Rippen
    const hip = G ? [56 + X * 0.3, 74 + T] : [62 + X * 0.3, 86 + T + sack];
    const sch = G ? [44 + X, 44 + T] : [40 + X, 62 + T + sack];
    const rumpf = [C(hip[0], hip[1], sch[0], sch[1], 8, 9, null), E(sch[0] + 3, sch[1] + 1, 9, 7, null)];
    // Kopf: tief vorn, flach gedrückt, mit spitzer Fellkappe; Weidenschlinge um den Hals
    const kx = sch[0] - 15, ky = sch[1] + 4 + kopfY + (p.angriff ? [1, 0, -3, -1][f] : 0);
    const hals = C(sch[0] - 2, sch[1] + 1, kx + 4, ky + 1, 4, 3, null);
    const kopf = Pg([[kx - 6, ky - 4], [kx + 4, ky - 6], [kx + 7, ky], [kx + 4, ky + 6], [kx - 4, ky + 7], [kx - 7, ky + 2]], 'haut', { rd: 1.2 });
    const kappe = v.kappe ? [Pg([[kx - 6, ky - 4], [kx + 5, ky - 6], [kx + 13, ky - 13], [kx + 2, ky - 9]], null, { rd: 0.8 })] : [];
    // Beine: kniend (vorderes Knie hoch, hinteres am Boden) oder gebeugt stehend
    const beinV = G ? glied([[hip[0] - 3, hip[1]], [hip[0] - 10, 96], [hip[0] - 8, 113]], 4.5, 2.6, null)
      : glied([[hip[0] - 4, hip[1]], [42, 95 + r(fall / 3)], [41, 113]], 4.6, 2.4, null);
    const beinH = G ? glied([[hip[0] + 4, hip[1]], [hip[0] + 8, 95], [hip[0] + 6, 113]], 4.2, 2.6, null)
      : glied([[hip[0] + 2, hip[1] + 2], [55, 111], [76, 113]], 4.4, 2.4, null);
    const fussV = E(G ? hip[0] - 11 : 38, 113, 4, 1.8, 'dunkel'), fussH = G ? E(hip[0] + 4, 113, 4, 1.8, 'dunkel') : E(78, 112, 3, 2, 'dunkel');
    // Arme: lang, hängen bis zum Boden, Finger gespreizt
    const sV = [sch[0] - 2, sch[1] + 3], sH = [sch[0] + 7, sch[1] + 1];
    let ellV, handV;
    if (armH === 0) { ellV = [sch[0] - 10, sch[1] + 22]; handV = [sch[0] - 16, 108]; }
    else if (armH === 1) { ellV = [sch[0] - 4, sch[1] + 16]; handV = [sch[0] + 4, sch[1] + 30]; } // zurückgezogen an die Hüfte
    else if (armH < 1.5) { ellV = [sch[0] - 10, sch[1] - 6]; handV = [sch[0] - 20, sch[1] - 22]; } // hoch vor dem Gesicht
    else if (armH < 2.2) { ellV = [sch[0] - 18, sch[1] + 8]; handV = [sch[0] - 33, sch[1] + 30]; }
    else { ellV = [sch[0] - 14, sch[1] + 16]; handV = [sch[0] - 24, sch[1] + 40]; }
    const armV = glied([sV, ellV, handV], 4.2, 2.4, null);
    const fingerV = [];
    const fa = armH === 0 ? Math.PI / 2 : armH === 1 ? 1.2 : armH < 1.5 ? -Math.PI / 2 - 0.6 : armH < 2.2 ? 2.0 : 1.8;
    for (let i = -1.5; i <= 1.5; i++) { const a = fa + i * 0.4, l = 8 - Math.abs(i); fingerV.push(...glied([handV, [handV[0] + Math.cos(a) * l * 0.6, handV[1] + Math.sin(a) * l * 0.6], [handV[0] + Math.cos(a + 0.3) * l, handV[1] + Math.sin(a + 0.3) * l]], 1.1, 0.6, null)); }
    const armHint = glied([sH, [sH[0] + 4, sH[1] + 18], [sH[0] - 2 + (G ? 0 : 0), G ? 98 : 106]], 3, 1.8, null);
    const handHint = E(sH[0] - 2, G ? 100 : 108, 2.6, 2, null);
    // Flechtwerk auf dem Rücken, wie ein Dach; Pfähle durch Flechtwerk und Leib
    const hb = G ? [[26 + X, 26 + T], [70 + X, 20 + T], [76 + X, 46 + T], [36 + X, 52 + T]] : [[30 + X, 48 + T + sack], [76 + X * 0.5, 38 + T + sack], [86, 62 + T * 0.5 + sack], [42 + X * 0.5, 74 + T + sack]];
    const huerde = Pg(v.zerrissen ? [hb[0], hb[1], hb[2], [hb[2][0] - 10, hb[2][1] + 4], [hb[2][0] - 16, hb[2][1] - 2], hb[3]] : hb, null, { rd: 1 });
    // Staken des Flechtwerks stehen oben und unten über
    const hl = (u, w) => [hb[0][0] + (hb[1][0] - hb[0][0]) * u + (hb[3][0] - hb[0][0]) * w + ((hb[2][0] - hb[1][0]) - (hb[3][0] - hb[0][0])) * u * w, hb[0][1] + (hb[1][1] - hb[0][1]) * u + (hb[3][1] - hb[0][1]) * w + ((hb[2][1] - hb[1][1]) - (hb[3][1] - hb[0][1])) * u * w];
    const staken = [];
    for (let i = 1; i < 7; i++) { if (v.zerrissen && i === 5) continue; const u = i / 7, o = hl(u, -0.1), o2 = hl(u, 0.02), un = hl(u, 0.98), un2 = hl(u, 1.1 + (i % 2) * 0.05); staken.push(C(o[0], o[1], o2[0], o2[1], 0.9, 1, null), C(un[0], un[1], un2[0], un2[1], 1, 0.8, null)); }
    const pf = [
      [[50, 74], [40, 18]], [[68, 66], [80, 14]], [[60, 70], [92, 38]], [[44, 70], [20, 34]],
    ].slice(0, v.pfaehle).map(([[a, b], [c, d]], i) => {
      const dy = G ? -14 : 0; const kipp = p.tod ? r(p.q * 10) * (i % 2 ? 1 : -1) : 0;
      return [[a + X, b + T + dy + sack], [c + X * 0.6 + kipp, d + T + dy + sack + (p.tod ? r(p.q * 14) : 0)]];
    });
    const pfaehle = pf.map(([a, b]) => { const mx = a[0] + (b[0] - a[0]) * 0.85, my = a[1] + (b[1] - a[1]) * 0.85; return [C(a[0], a[1], mx, my, 1.9, 1.6, null), C(mx, my, b[0], b[1], 1.6, 0.3, null)]; }).flat();
    const schlinge = glied([[kx + 5, ky + 5], [kx + 2, ky + 16], [kx - 4, 104], [kx - 12, 113]], 1, 0.7, 'dunkel');
    const gruppen = [
      { p: [...armHint, handHint], k: 1, anker: [X, T] },
      { p: [...beinH, fussH], k: 1 },
      { p: pfaehle, k: 0 },
      { p: [...rumpf, hals], k: 2.5, anker: [X, T] },
      { p: [...beinV, fussV], k: 1 },
      { p: [huerde, ...staken], k: 0.5, anker: [X, T] },
      { p: schlinge, k: 0, noRim: true },
      { p: [kopf, ...kappe], k: 1, anker: [X, T] },
      { p: [...armV, ...fingerV], k: 0.8, anker: [X, T] },
    ];
    const augen = [];
    const details = P => {
      // Flechtwerk: senkrechte Staken, waagerechte Ruten im Wechsel darüber und darunter
      const [a, b, c, d] = hb, lerp = (u, w) => [a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * w + ((c[0] - b[0]) - (d[0] - a[0])) * u * w, a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * w + ((c[1] - b[1]) - (d[1] - a[1])) * u * w];
      for (let i = 1; i < 7; i++) { const u = i / 7; for (let k = 0; k <= 24; k++) { const [x, y] = lerp(u, k / 24); P.auf(r(x), r(y), 'k0'); } }
      for (let j = 1; j < 6; j++) { const w = j / 6; for (let k = 0; k <= 50; k++) { const u = k / 50, [x, y] = lerp(u, w); const seg = Math.floor(u * 7 + (j % 2) * 0.5); if (P.get(r(x), r(y)) === 0) continue; P.set(r(x), r(y), seg % 2 ? 'k3' : 'k1'); const [x2, y2] = lerp(u, w - 0.025); if (seg % 2 && P.get(r(x2), r(y2)) >= 1 && P.get(r(x2), r(y2)) <= 4) P.set(r(x2), r(y2), (k % 3) ? 'r1' : 'k3'); } }
      K.licht(P, [huerde], { c: 'r1', c2: 'k3' });
      K.schatten(P, [huerde], { d: [0, 2] });
      // Leder: Rippen und Falten am Rumpf, Kniescheibe, Sehnen am Arm
      for (let i = 0; i < 4; i++) { const q = 0.25 + i * 0.16, x = hip[0] + (sch[0] - hip[0]) * q, y = hip[1] + (sch[1] - hip[1]) * q; P.line(r(x - 4), r(y + 5), r(x + 1), r(y + 7), 'k0', true); P.line(r(x - 3), r(y + 4), r(x + 2), r(y + 6), 'k3', true); }
      K.licht(P, [...rumpf, hals], { c: 'k3', c2: null, nur: (x, y) => P.get(x, y) !== 0 });
      K.licht(P, [...armV, ...fingerV], { c: 'r1', c2: null });
      K.licht(P, [...beinV], { c: 'r1', c2: 'k3' });
      K.licht(P, [kopf, ...kappe], { c: 'r1', c2: 'k3' });
      K.schatten(P, [kopf], { d: [-1, 1] });
      // Kappe: Nähte
      if (v.kappe) { P.line(r(kx - 3), r(ky - 5), r(kx + 9), r(ky - 11), 'k1', true); }
      // Gesicht: geschlossene Lider, durch die Licht dringt; Mund zusammengezogen
      if (augenAn) {
        const ex = r(kx - 3), ey = r(ky);
        P.glow(ex + 1.5, ey + 0.5, 4.5, 0.7, 'glutDim', 'k3');
        P.set(ex - 1, ey, 'glutDim'); P.set(ex, ey, 'glut'); P.set(ex + 1, ey, 'kern'); P.set(ex + 2, ey, 'glut');
        P.set(ex + 4, ey - 1, 'glutDim'); P.set(ex + 5, ey - 1, 'glut'); P.set(ex + 6, ey - 1, 'glutDim');
        if (p.angriff && f === 2) { P.set(ex, ey - 1, 'glutDim'); P.set(ex + 5, ey - 2, 'glutDim'); }
        augen.push([ex + 1, ey], [ex + 5, ey - 1]);
      } else { P.line(r(kx - 4), r(ky), r(kx + 2), r(ky - 1), 'k0', true); }
      P.line(r(kx - 4), r(ky + 4), r(kx), r(ky + 4), 'k0', true);
      // Pfähle: Kerben vom Beil, Spitzen im Gegenlicht
      pf.forEach(([s, e], i) => { for (let q = 0.3; q < 0.8; q += 0.18) { const x = r(s[0] + (e[0] - s[0]) * q), y = r(s[1] + (e[1] - s[1]) * q); if (P.get(x, y)) P.set(x, y, 'k0'); } P.set(r(e[0]), r(e[1]), 'r2'); });
      // Irrlicht: schwebt über der Spitze des ersten Pfahls
      if (v.irrlicht && (!p.tod || f < 2)) {
        const [, e] = pf[1] || pf[0]; const ix = r(e[0] - 6), iy = r(e[1] - 1 + irr);
        P.set(ix, iy, 'kern'); P.set(ix + 1, iy, 'glut'); P.set(ix - 1, iy, 'glut'); P.set(ix, iy - 1, 'glut'); P.set(ix, iy + 1, 'glutDim'); P.set(ix, iy - 2, 'glutDim');
        if (f % 2 === 0) P.set(ix + 1, iy + 2, 'glutDim');
        augen.push([ix, iy]);
      }
    };
    return { gruppen, details, augen };
  },
};
