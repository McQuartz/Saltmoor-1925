// Der Helmtaucher (Hafenviertel, Ergänzung). Hafentaucher von 1919, prüfte die abgesackte Kaimauer.
// Man hat ihm oben den Luftschlauch gekappt, als er an der Leine zweimal ruckte. Sechs Jahre später
// steigt er die Leiter herauf: schwerer Kupferhelm, Bleischuhe, Gewicht auf der Brust, der Schlauch
// hängt abgeschnitten hinter ihm. Im Sichtglas steht Wasser, und aus dem Ventil steigen Blasen.
'use strict';
const K = require('./hilfe/kanten');
module.exports = {
  id: 'taucher', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [44, 115], kopf: [44, 10], rimBis: 113,
  varianten: {
    taucher_a: { helm: 15, werkzeug: 'haken', gitter: false, buckel: 4, vor: 3 },
    taucher_b: { helm: 16, werkzeug: 'lot', gitter: true, buckel: 6, vor: 4 },
  },
  skizzen: {
    skizze_aufrecht: { helm: 15, werkzeug: 'haken', gitter: false, buckel: 0, vor: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, B = v.buckel || 0, VOR = v.vor || 0;
    let L = 0, atem = 0, fall = 0, wa = 1.95, hand = [16, 88], ell = [18, 72], blasen = 0, augenAn = true, schwing = 0, kipp = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; blasen = f; schwing = [0, 1, 1, 0][f]; }
    if (p.angriff) {
      L = [3, 4, -6, -3][f];
      hand = [[34, 46], [42, 36], [8, 74], [12, 82]][f];
      ell = [[22, 56], [28, 46], [14, 62], [16, 70]][f];
      wa = [-1.25, -0.85, 2.55, 2.2][f]; blasen = f; schwing = [1, 2, -2, -1][f];
    }
    if (p.treffer) { L = [2, 1][f]; hand = [18, 86]; wa = 1.8; }
    if (p.tod) { fall = r(p.q * 22); L = r(p.q * 3); augenAn = f < 1; kipp = r(p.q * 4); hand = [18, 88 + r(p.q * 8)]; }
    const T = atem + fall, X = L - VOR * 0.3, HR = v.helm;
    // Helm: großer Kupferhelm, sitzt vorne auf dem Schulterstück
    const hx = 44 + L - VOR + kipp, hy = 34 + T + B;
    const helm = E(hx, hy, HR, HR - 0.5, 'haut', { pf: 'bevel' });
    const sicht = E(hx - HR, hy + 2, 6, 7, 'dunkel', { pf: 'flat' }); // Sichtglas vorne, Fassung steht vor
    const stutzen = C(hx - HR + 4, hy + 2, hx - HR - 1, hy + 2, 7, 6.8, 'haut');
    const ventil = [C(hx + 7, hy - HR + 2, hx + 10, hy - HR - 2, 1.8, 1.4, null), E(hx + 10, hy - HR - 2, 2.6, 1.4, null)];
    // Schlauch: aus dem Helm nach hinten oben, dann in einem Bogen zum Boden, abgeschnitten und ausgefranst
    const s0 = [hx + 12, hy - 4];
    const sp = [s0, [s0[0] + 8, s0[1] - 10], [s0[0] + 18, s0[1] - 8 + schwing], [s0[0] + 24, s0[1] + 6 + schwing], [s0[0] + 26, s0[1] + 30 + schwing], [s0[0] + 24 + schwing, 98], [s0[0] + 30, 108], [s0[0] + 34, 110]];
    const schlauch = fall > 14 ? [] : glied(sp.map(([a, b]) => [Math.min(93, a), b]), 2, 1.7, null);
    // Leib: sackiger Taucheranzug, Schulterstück (Corselet) aus Kupfer mit Bolzen
    const leib = Pg([[32 + X, 56 + T], [60 + X, 56 + T], [63 + X, 66 + T], [62 + X, 79 + T], [58 + X, 89 + T], [37 + X, 91 + T], [30 + X, 86 + T], [28 + X, 76 + T], [30 + X, 64 + T]], null, { rd: 3 });
    const bauch = E(37 + X, 79 + T, 8, 8, null);
    const korselett = Pg([[27 + X, 56 + T], [33 + X, 48 + T + B], [57 + X, 48 + T + B], [65 + X, 55 + T], [62 + X, 61 + T], [30 + X, 61 + T]], 'haut', { rd: 1 });
    const brustblei = Pg([[34 + X, 65 + T], [48 + X, 65 + T], [47 + X, 73 + T], [41 + X, 77 + T], [35 + X, 73 + T]], null, { rd: 0.6 });
    const gurt = C(32 + X, 84 + T, 60 + X, 84 + T, 1.8, 1.8, 'dunkel');
    // Beine: sackig, Bleischuhe als schwere Klötze mit Sohle
    const beinV = glied([[40 + X, 88 + T], [37 + r(X / 2), 100 + r(fall / 2)], [36, 106]], 5.5, 4.4, null);
    const beinH = glied([[53 + X, 88 + T], [55 + r(X / 2), 100 + r(fall / 2)], [55, 106]], 5, 4.2, null);
    const schuhV = Pg([[28, 105], [43, 105], [44, 115], [27, 115]], 'dunkel', { rd: 0.8 });
    const schuhH = Pg([[50, 106], [62, 106], [63, 114], [50, 114]], 'dunkel', { rd: 0.8 });
    // Arme: dicke Ärmel, Manschetten, schwere Handschuhe
    const armH = glied([[61 + X, 59 + T], [71 + X, 71 + T], [71 + X, 84 + T]], 4.6, 3.8, null);
    const handH = [E(71 + X, 87 + T, 3.8, 3.4, null), C(70 + X, 89 + T, 69 + X, 93 + T, 1.3, 1, null), C(73 + X, 89 + T, 73 + X, 92 + T, 1.2, 1, null)];
    const armV = glied([[31 + X, 59 + T], [ell[0] + X, ell[1] + T], [hand[0] + L, hand[1] + T]], 4.8, 3.8, null);
    const handV = [E(hand[0] + L, hand[1] + T + 1, 4.4, 3.8, null), C(hand[0] + L - 2, hand[1] + T + 3, hand[0] + L - 4, hand[1] + T + 6, 1.4, 1.1, null)];
    const manschV = C(hand[0] + L + (ell[0] - hand[0]) * 0.25, hand[1] + T + (ell[1] - hand[1]) * 0.25, hand[0] + L + (ell[0] - hand[0]) * 0.32, hand[1] + T + (ell[1] - hand[1]) * 0.32, 4.6, 4.6, null);
    // Werkzeug: Bergungshaken an der Stange (a) oder Senkblei an der Leine (b)
    const hX = hand[0] + L, hY = hand[1] + T + 1, wz = [], lang = v.werkzeug === 'haken' ? 30 : 10;
    const e = [hX + Math.cos(wa) * lang, hY + Math.sin(wa) * lang];
    if (v.werkzeug === 'haken') { // Haken schleift am Boden, Widerhaken zeigt nach hinten
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
      { p: [...armH, ...handH], k: 1.2, anker: [X, T] },
      { p: [...beinH, schuhH], k: 1 },
      { p: [leib, bauch], k: 3, anker: [X, T] },
      { p: [...beinV, schuhV], k: 1 },
      { p: [gurt], k: 0, noRim: true },
      { p: [brustblei], k: 0, anker: [X, T] },
      { p: [korselett], k: 0.5, anker: [X, T] },
      { p: [...ventil, helm, stutzen], k: 0.8, anker: [L, T] },
      { p: [sicht], k: 0 },
      { p: wzHinten ? [] : wz, k: 0 },
      { p: [...armV, manschV, ...handV], k: 1.2, anker: [X, T] },
    ];
    const augen = [];
    const details = P => {
      // Binnenkanten: Gegenlicht fängt sich an Helm, Schulterstück, Bleigewicht, Schuhen, Ärmel
      K.licht(P, [helm, stutzen], { c: 'r1', c2: 'k3' });
      K.licht(P, [korselett], { c: 'r1', c2: 'k3' });
      K.schatten(P, [korselett], { d: [0, 1] });
      K.licht(P, [brustblei], { c: 'r1', c2: 'k3' });
      K.schatten(P, [brustblei], { d: [0, 1] });
      K.licht(P, [schuhV], { c: 'r1', c2: null, d: [0, -1] }); K.licht(P, [schuhH], { c: 'k3', c2: null, d: [0, -1] });
      K.licht(P, [...armV, ...handV], { c: 'r1', c2: 'k3' }); K.schatten(P, [leib, bauch], { d: [-2, 0], c: 'k1' });
      K.licht(P, [leib, bauch], { c: 'k3', c2: null, d: [1, -1] });
      K.licht(P, [manschV], { c: 'r1', c2: null }); K.schatten(P, [manschV], { d: [-1, 1] });
      K.licht(P, [...armH], { c: 'k3', c2: null });
      // Helm: Lötnaht quer und senkrecht (Fase: dunkle Fuge, helle Kante darüber)
      // Kupfer: Glanzbogen oben rechts (gedithert), unten der Bördelring mit Bolzen
      for (let y = r(hy - HR); y <= hy + HR; y++) for (let x = r(hx - HR); x <= hx + HR; x++) {
        const dx = (x + 0.5 - hx) / HR, dy = (y + 0.5 - hy) / HR, q = Math.hypot(dx, dy), u = dx * 0.6 - dy * 0.8;
        const c = P.get(x, y); if (c < 1 || c > 4 || q > 0.86) continue;
        if (q > 0.58 && u > 0.42) P.set(x, y, A.bay(x, y) < (u - 0.42) * 2.2 ? 'k3' : c);
        if (q > 0.66 && q < 0.76 && u > 0.62 && (x + y) % 3) P.set(x, y, 'r1');
      }
      for (let x = r(hx - HR + 4); x <= hx + HR - 3; x++) { const u = (x - hx) / HR, y = r(hy + HR - 4 + 1.5 * u * u); if (P.get(x, y) >= 1 && P.get(x, y) <= 4) { P.set(x, y, 'k0'); P.set(x, y - 1, x % 4 === 0 ? 'r1' : 'k3'); } }
      for (let y = r(hy - HR + 3); y <= hy + HR - 6; y++) { const x = r(hx + 2 + (y - hy) * 0.15); if (P.get(x, y) <= 4) P.auf(x, y, 'k1'); if (P.get(x + 1, y) <= 4 && y % 3 === 0) P.auf(x + 1, y, 'k3'); }
      // Bolzen am Schulterstück und am Helmrand
      for (let x = r(30 + X); x <= 62 + X; x += 4) { P.auf(x, r(56 + T), x > 50 + X ? 'r1' : 'k3'); }
      [[-6, 2], [0, 3], [6, 2]].forEach(([a, b]) => P.auf(r(hx + a * 1.6), r(hy + HR - 3 + b * 0), 'k3'));
      // Brustblei: gegossene Rippen
      for (let y = r(65 + T); y <= 71 + T; y += 3) P.line(r(36 + X), y, r(45 + X), y, 'k1', true);
      // Anzug: Falten an Ellbogen und Knien (dunkle Fuge, Licht darüber)
      [[17, 70, 22, 72], [68, 70, 73, 70], [33, 98, 39, 97], [52, 99, 58, 98], [34, 63, 38, 76], [50, 76, 56, 80], [58, 63, 58, 74], [31, 81, 36, 86]].forEach(([a, b, c, d], i) => { const dx = i < 2 || i > 3 ? X : 0; P.line(a + dx, b + T, c + dx, d + T, 'k0', true); P.line(a + dx + 1, b + T - 1, c + dx + 1, d + T - 1, 'k3', true); });
      for (let y = r(63 + T); y < 90 + T; y += 5) { P.auf(r(55 + X), y, 'k0'); P.auf(r(56 + X), y + 1, 'k3'); }
      // Messerscheide am Gurt, Leine um den Leib
      P.line(r(52 + X), r(86 + T), r(54 + X), r(95 + T), 'k3', true); P.line(r(53 + X), r(86 + T), r(55 + X), r(95 + T), 'k1', true);
      for (let x = r(33 + X); x <= 59 + X; x += 2) P.auf(x, r(80 + T + (x & 2 ? 1 : 0)), 'k3');
      // Manschetten
      P.line(r(hand[0] + L - 4), r(hand[1] + T - 3), r(hand[0] + L + 3), r(hand[1] + T - 4), 'k3', true);
      // Schlauch: Ringe
      if (schlauch.length) sp.forEach(([a, b], i) => { if (i && i < sp.length - 1) { P.auf(Math.min(93, r(a)), r(b), 'k3'); } });
      if (schlauch.length) { const [ea, eb] = sp[sp.length - 1]; P.set(Math.min(94, r(ea) + 1), r(eb) - 1, 'r1'); P.set(Math.min(94, r(ea) + 1), r(eb) + 1, 'k3'); }
      // Sichtglas: Fassung (Ring mit Licht oben rechts), innen Wasser, das von innen leuchtet
      const sx = hx - HR, sy = hy + 2;
      for (let y = Math.floor(sy - 7); y <= sy + 7; y++) for (let x = Math.floor(sx - 7); x <= sx + 7; x++) {
        const q = Math.hypot((x + 0.5 - sx) / 6, (y + 0.5 - sy) / 7);
        if (q > 0.78 && q <= 1.0) P.auf(x, y, (x + 0.5 - sx) - (y + 0.5 - sy) > 2 ? 'r1' : (x + 0.5 - sx) - (y + 0.5 - sy) > -2 ? 'k3' : 'k1');
        else if (q <= 0.78) P.auf(x, y, 'k0');
      }
      if (augenAn) {
        P.glow(sx + 0.5, sy + 1, 7, p.angriff && f === 2 ? 1.3 : 1.05, 'glutDim', 'k2');
        // im Wasser ein Gesicht, zu nah am Glas: zwei Augen ungleich hoch, darunter ein offener Mund
        P.set(r(sx - 2), r(sy - 1), 'kern'); P.set(r(sx - 1), r(sy - 1), 'glut'); P.set(r(sx - 2), r(sy), 'glut');
        P.set(r(sx + 2), r(sy), 'glut'); P.set(r(sx + 3), r(sy), 'glutDim');
        P.set(r(sx), r(sy + 3), 'k0'); P.set(r(sx - 1), r(sy + 3), 'k0'); P.set(r(sx), r(sy + 4), 'k0');
        // Wasserlinie: oben im Glas eine Handbreit Luft, die nicht da sein dürfte
        for (let x = r(sx - 4); x <= sx + 3; x++) if (P.get(x, r(sy - 4)) >= 1) P.set(x, r(sy - 4), (x & 1) ? 'r1' : 'k3');
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
