// Der Helmtaucher (Hafenviertel, Ergänzung). Hafentaucher von 1919, prüfte die abgesackte Kaimauer.
// Man hat ihm oben den Luftschlauch gekappt, als er an der Leine zweimal ruckte. Sechs Jahre später
// steigt er die Leiter herauf: schwerer Kupferhelm, Bleischuhe, Gewicht auf der Brust, der Schlauch
// hängt abgeschnitten hinter ihm. Im Sichtglas steht Wasser, und aus dem Ventil steigen Blasen.
'use strict';
const K = require('./hilfe/kanten');
module.exports = {
  id: 'taucher', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [44, 115], kopf: [44, 10], rimBis: 113,
  varianten: {
    taucher_a: { helm: 14, werkzeug: 'haken', gitter: false, buckel: 0 },
    taucher_b: { helm: 15, werkzeug: 'lot', gitter: true, buckel: 3 },
  },
  skizzen: {
    skizze_gebeugt: { helm: 14, werkzeug: 'haken', gitter: false, buckel: 8, vor: 6 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, B = v.buckel || 0, VOR = v.vor || 0;
    let L = 0, atem = 0, fall = 0, wa = 1.95, hand = [24, 84], ell = [22, 70], blasen = 0, augenAn = true, schwing = 0, kipp = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; blasen = f; schwing = [0, 1, 1, 0][f]; }
    if (p.angriff) {
      L = [3, 4, -6, -3][f];
      hand = [[36, 48], [44, 38], [12, 72], [16, 80]][f];
      ell = [[26, 56], [32, 46], [18, 60], [20, 68]][f];
      wa = [-1.25, -0.85, 2.55, 2.2][f]; blasen = f; schwing = [1, 2, -2, -1][f];
    }
    if (p.treffer) { L = [2, 1][f]; hand = [26, 82]; wa = 1.8; }
    if (p.tod) { fall = r(p.q * 22); L = r(p.q * 3); augenAn = f < 1; kipp = r(p.q * 4); hand = [26, 86 + r(p.q * 8)]; }
    const T = atem + fall, X = L - VOR * 0.3, HR = v.helm;
    // Helm: großer Kupferhelm, sitzt vorne auf dem Schulterstück
    const hx = 44 + L - VOR + kipp, hy = 34 + T + B;
    const helm = E(hx, hy, HR, HR - 0.5, null, { pf: 'bevel' });
    const sicht = E(hx - HR + 2, hy + 2, 5.5, 6.2, 'dunkel', { pf: 'flat' }); // Sichtglas vorne, Fassung steht vor
    const ventil = [C(hx + 7, hy - HR + 2, hx + 10, hy - HR - 2, 1.8, 1.4, null), E(hx + 10, hy - HR - 2, 2.6, 1.4, null)];
    // Schlauch: aus dem Helm nach hinten oben, dann in einem Bogen zum Boden, abgeschnitten und ausgefranst
    const s0 = [hx + 12, hy - 4];
    const sp = [s0, [s0[0] + 8, s0[1] - 10], [s0[0] + 18, s0[1] - 8 + schwing], [s0[0] + 24, s0[1] + 6 + schwing], [s0[0] + 26, s0[1] + 30 + schwing], [s0[0] + 24 + schwing, 98], [s0[0] + 30, 108], [s0[0] + 34, 110]];
    const schlauch = fall > 14 ? [] : glied(sp.map(([a, b]) => [Math.min(93, a), b]), 2, 1.7, null);
    // Leib: sackiger Taucheranzug, Schulterstück (Corselet) aus Kupfer mit Bolzen
    const leib = Pg([[30 + X, 54 + T], [62 + X, 54 + T], [67 + X, 66 + T], [65 + X, 84 + T], [59 + X, 91 + T], [34 + X, 91 + T], [28 + X, 81 + T], [27 + X, 64 + T]], null, { rd: 2.5 });
    const korselett = Pg([[27 + X, 54 + T], [34 + X, 46 + T + B], [56 + X, 46 + T + B], [65 + X, 53 + T], [63 + X, 59 + T], [29 + X, 59 + T]], null, { rd: 1 });
    const brustblei = Pg([[33 + X, 63 + T], [48 + X, 63 + T], [47 + X, 72 + T], [40 + X, 76 + T], [34 + X, 72 + T]], null, { rd: 0.6 });
    const gurt = C(29 + X, 83 + T, 64 + X, 83 + T, 1.8, 1.8, 'dunkel');
    // Beine: sackig, Bleischuhe als schwere Klötze mit Sohle
    const beinV = glied([[39 + X, 88 + T], [37 + r(X / 2), 100 + r(fall / 2)], [37, 106]], 6, 5, null);
    const beinH = glied([[55 + X, 88 + T], [56 + r(X / 2), 100 + r(fall / 2)], [56, 106]], 5.5, 4.8, null);
    const schuhV = Pg([[28, 105], [44, 105], [45, 115], [27, 115]], null, { rd: 0.8 });
    const schuhH = Pg([[50, 106], [63, 106], [64, 114], [50, 114]], null, { rd: 0.8 });
    // Arme: dicke Ärmel, Manschetten, schwere Handschuhe
    const armH = glied([[62 + X, 58 + T], [70 + X, 72 + T], [67 + X, 84 + T]], 5, 4.2, null);
    const handH = E(67 + X, 87 + T, 4.2, 3.6, null);
    const armV = glied([[31 + X, 58 + T], [ell[0] + X, ell[1] + T], [hand[0] + L, hand[1] + T]], 5.2, 4.2, null);
    const handV = E(hand[0] + L, hand[1] + T + 1, 4.4, 3.8, null);
    // Werkzeug: Bergungshaken an der Stange (a) oder Senkblei an der Leine (b)
    const hX = hand[0] + L, hY = hand[1] + T + 1, wz = [], lang = v.werkzeug === 'haken' ? 30 : 10;
    const e = [hX + Math.cos(wa) * lang, hY + Math.sin(wa) * lang];
    if (v.werkzeug === 'haken') {
      wz.push(C(hX - Math.cos(wa) * 6, hY - Math.sin(wa) * 6, e[0], e[1], 1.1, 1.1, 'dunkel', { pf: 'flat' }));
      const nx = -Math.sin(wa), ny = Math.cos(wa), dx = Math.cos(wa), dy = Math.sin(wa);
      wz.push(...glied([e, [e[0] + dx * 4, e[1] + dy * 4], [e[0] + dx * 5 - nx * 5, e[1] + dy * 5 - ny * 5], [e[0] + dx * 2 - nx * 7, e[1] + dy * 2 - ny * 7]], 1.6, 0.9, null));
    } else {
      const la = p.angriff ? wa : Math.PI / 2 + schwing * 0.08, ll = p.angriff ? 16 : 14;
      const ende = [hX + Math.cos(la) * ll, hY + Math.sin(la) * ll];
      wz.push(C(hX, hY, ende[0], ende[1], 0.6, 0.6, 'dunkel', { pf: 'flat', noRim: true }));
      wz.push(Pg([[ende[0] - 3, ende[1]], [ende[0] + 3, ende[1]], [ende[0] + 4, ende[1] + 8], [ende[0], ende[1] + 11], [ende[0] - 4, ende[1] + 8]], null, { rd: 0.5 }));
    }
    const wzHinten = p.angriff && f < 2;
    const gruppen = [
      { p: schlauch, k: 0.5 },
      { p: wzHinten ? wz : [], k: 0 },
      { p: [...armH, handH], k: 1.2, anker: [X, T] },
      { p: [...beinH, schuhH], k: 1 },
      { p: [leib], k: 2, anker: [X, T] },
      { p: [...beinV, schuhV], k: 1 },
      { p: [gurt], k: 0, noRim: true },
      { p: [brustblei], k: 0, anker: [X, T] },
      { p: [korselett], k: 0.5, anker: [X, T] },
      { p: [...ventil, helm], k: 0.8, anker: [L, T] },
      { p: [sicht], k: 0 },
      { p: wzHinten ? [] : wz, k: 0 },
      { p: [...armV, handV], k: 1.2, anker: [X, T] },
    ];
    const augen = [];
    const details = P => {
      // Binnenkanten: Gegenlicht fängt sich an Helm, Schulterstück, Bleigewicht, Schuhen, Ärmel
      K.licht(P, [helm], { c: 'r1', c2: 'k3' });
      K.licht(P, [korselett], { c: 'r1', c2: 'k3' });
      K.schatten(P, [korselett], { d: [0, 1] });
      K.licht(P, [brustblei], { c: 'r1', c2: 'k3' });
      K.schatten(P, [brustblei], { d: [0, 1] });
      K.licht(P, [schuhV], { c: 'r1', c2: null, d: [0, -1] }); K.licht(P, [schuhH], { c: 'k3', c2: null, d: [0, -1] });
      K.licht(P, [...armV], { c: 'k3', c2: null });
      K.licht(P, [leib], { c: 'k3', c2: null, d: [1, -1] });
      // Helm: Lötnaht quer und senkrecht (Fase: dunkle Fuge, helle Kante darüber)
      for (let x = r(hx - HR + 3); x <= hx + HR - 2; x++) { const u = (x - hx) / HR, y = r(hy + 5 + 2 * u * u); P.auf(x, y, 'k0'); if ((x & 1) === 0) P.auf(x, y - 1, 'k3'); }
      for (let y = r(hy - HR + 3); y <= hy + 4; y++) { const x = r(hx + 3 + (y - hy) * 0.1); P.auf(x, y, 'k1'); }
      // Bolzen am Schulterstück und am Helmrand
      for (let x = r(30 + X); x <= 62 + X; x += 4) { P.auf(x, r(56 + T), x > 50 + X ? 'r1' : 'k3'); }
      [[-6, 2], [0, 3], [6, 2]].forEach(([a, b]) => P.auf(r(hx + a * 1.6), r(hy + HR - 3 + b * 0), 'k3'));
      // Brustblei: gegossene Rippen
      for (let y = r(65 + T); y <= 71 + T; y += 3) P.line(r(36 + X), y, r(45 + X), y, 'k1', true);
      // Anzug: Falten an Ellbogen und Knien (dunkle Fuge, Licht darüber)
      [[26, 66, 30, 68], [64, 70, 68, 69], [34, 98, 40, 97], [52, 99, 58, 98]].forEach(([a, b, c, d], i) => { const dx = i < 2 ? X : 0; P.line(a + dx, b + T, c + dx, d + T, 'k0', true); P.line(a + dx + 1, b + T - 1, c + dx + 1, d + T - 1, 'k3', true); });
      for (let y = r(60 + T); y < 90 + T; y += 5) { P.auf(r(57 + X), y, 'k1'); P.auf(r(58 + X), y + 1, 'k1'); }
      // Manschetten
      P.line(r(hand[0] + L - 4), r(hand[1] + T - 3), r(hand[0] + L + 3), r(hand[1] + T - 4), 'k3', true);
      // Schlauch: Ringe
      if (schlauch.length) sp.forEach(([a, b], i) => { if (i && i < sp.length - 1) { P.auf(Math.min(93, r(a)), r(b), 'k3'); } });
      if (schlauch.length) { const [ea, eb] = sp[sp.length - 1]; P.set(Math.min(94, r(ea) + 1), r(eb) - 1, 'r1'); P.set(Math.min(94, r(ea) + 1), r(eb) + 1, 'k3'); }
      // Sichtglas: Fassung (Ring mit Licht oben rechts), innen Wasser, das von innen leuchtet
      const sx = hx - HR + 2, sy = hy + 2;
      for (let y = Math.floor(sy - 7); y <= sy + 7; y++) for (let x = Math.floor(sx - 7); x <= sx + 7; x++) {
        const q = Math.hypot((x + 0.5 - sx) / 5.5, (y + 0.5 - sy) / 6.2);
        if (q > 0.78 && q <= 1.0) P.auf(x, y, (x + 0.5 - sx) - (y + 0.5 - sy) > 2 ? 'r1' : (x + 0.5 - sx) - (y + 0.5 - sy) > -2 ? 'k3' : 'k1');
        else if (q <= 0.78) P.auf(x, y, 'k0');
      }
      if (augenAn) {
        P.glow(sx + 0.5, sy + 1, 6, p.angriff && f === 2 ? 1.2 : 0.95, 'glutDim', 'k2');
        // im Wasser ein Gesicht, zu nah am Glas: zwei Augen ungleich hoch
        P.set(r(sx - 2), r(sy), 'kern'); P.set(r(sx - 1), r(sy), 'glut');
        P.set(r(sx + 2), r(sy + 1), 'glut');
        P.set(r(sx), r(sy + 3), 'glutDim'); P.set(r(sx - 1), r(sy + 4), 'glutDim');
        augen.push([r(sx - 2), r(sy)], [r(sx + 2), r(sy + 1)]);
        if (v.gitter) for (let k = -1; k <= 1; k++) for (let y = r(sy - 4); y <= sy + 4; y++) if (P.get(r(sx + k * 2.5), y) >= 7 || P.get(r(sx + k * 2.5), y) === 1) P.set(r(sx + k * 2.5), y, 'k2');
      } else { P.set(r(sx - 2), r(sy), 'k1'); }
      // Kleines Seitenfenster oben am Helm
      const fx = r(hx + 2), fy = r(hy - 6);
      P.el(fx + 0.5, fy + 0.5, 2.6, 2.6, 'k3', true); P.el(fx + 0.5, fy + 0.5, 1.6, 1.6, 'k0', true); if (augenAn) { P.set(fx, fy, 'glutDim'); P.set(fx + 1, fy - 1, 'r1'); }
      // Blasen steigen aus dem Ventil, obwohl kein Schlauch mehr Luft gibt
      if (!p.tod || f < 3) {
        const vx = r(hx + 10), vy = r(hy - HR - 4);
        [[0, 0], [2, -7], [-1, -13]].forEach(([a, b], i) => {
          const yy = vy + b - ((blasen * 2) % 6), xx = vx + a + (i === 1 ? (blasen & 1) : 0);
          if (yy < 1) return;
          if (i === 2) { P.set(xx, yy, 'r1'); P.set(xx + 1, yy - 1, 'r2'); P.set(xx + 1, yy, 'k3'); }
          else { P.set(xx, yy, 'r1'); P.set(xx + 1, yy, 'r2'); }
        });
      }
    };
    return { gruppen, details, augen };
  },
};
