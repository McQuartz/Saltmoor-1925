// Die Station, die nie eröffnet wurde: Der Zug, der einfährt (Wächter). Ein Triebwagen der Untergrundbahn von
// 1925, von vorn und schräg, wie er aus dem Tunnel kommt: das gewölbte Dach, drei Stirnfenster, die Tür in der
// Mitte, zwei Stirnlampen, darunter Pufferbohle und Bahnräumer; die Seite läuft nach hinten ins Dunkel, Fenster
// um Fenster. Er ist voll. In jedem Fenster stehen Gesichter, die Hände flach an der Scheibe. Der Zielanzeiger
// zeigt den Namen der Station, und der Name ist länger als das Schild. Züge fahren hier ein. Keiner fährt ab.
// Phase 2 (einfahrt_p2): Die Türen gehen auf. Was drin ist, will nicht aussteigen; es greift heraus.
'use strict';
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'einfahrt', biom: 'station', zone: 'station', rang: 'waechter', w: 160, h: 180, fuss: [104, 174], kopf: [107, 18], rimBis: 172,
  todStart: 0.2,
  varianten: {
    einfahrt: { offen: false },
    einfahrt_p2: { offen: true },
  },
  // Silhouetten-Probe (nicht gebaut): der Triebwagen nur von vorn, ohne Seite (ein Kasten mit Bogen, zu nah am
  // Sender und an einem Schrank). Genommen: schräg, die Seite als Keil nach hinten, unten Räder und Räumer.
  proben: { probe_frontal: { offen: false, frontal: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let dx = 0, dy = 0, greif = 0, funken = false, ab = 0;
    let ruck = 0; if (p.idle) { ruck = [0, 0, 1, 0][f]; }
    if (p.angriff) { dx = [3, 4, -9, -4][f]; dy = [0, 0, 2, 1][f]; greif = [0.3, 0, 1, 0.6][f]; funken = f === 1 || f === 2; }
    if (p.treffer) { dx = [3, 2][f]; dy = [-1, 0][f]; }
    if (p.tod) { ab = r(p.q * 26); }
    const X = dx + ab, Y = dy - r(ab * 0.4);
    // Stirn: Rechteck mit gewölbtem Dach
    const fx0 = 66 + X, fx1 = 148 + X, fyT = 42 + Y, fyB = 160 + Y, dachH = 22;
    const bogen = []; for (let i = 0; i <= 12; i++) { const q = i / 12; bogen.push([fx0 + (fx1 - fx0) * q, fyT - Math.sin(q * Math.PI) * dachH]); }
    const stirn = Pg([[fx0, fyB], ...bogen, [fx1, fyB]], null, { rd: 1 });
    // Seite: Keil nach links hinten (Fluchtpunkt links), Dachkante gebogen
    const sxL = v.frontal ? fx0 : 6 + X, syT = 76 + Y, syB = 138 + Y;
    const yT = x => fyT + (syT - fyT) * (fx0 - x) / (fx0 - sxL), yB = x => fyB + (syB - fyB) * (fx0 - x) / (fx0 - sxL);
    const seite = v.frontal ? null : Pg([[fx0, fyT], [sxL, syT], [sxL, syB], [fx0, fyB]], null, { rd: 0.6 });
    const dachSeite = v.frontal ? null : Pg([[fx0, fyT + 1], [fx0 + 6, fyT - 12], [fx0 + 16, fyT - 18], [sxL + 8, syT - 9], [sxL, syT - 4], [sxL, syT + 1]], null, { rd: 0.6 });
    // Drehgestell und Räder unter der Seite
    const raeder = v.frontal ? [] : [[56, 9], [42, 8], [24, 6.5], [13, 5.5]].map(([x, rr]) => E(x + X, yB(x + X) + rr * 0.3, rr, rr * 0.9, null));
    const gestell = v.frontal ? [] : [Pg([[sxL + 2, syB - 2], [fx0, fyB - 4], [fx0, fyB + 6], [sxL + 2, syB + 5]], null, { rd: 0.5 })];
    // Pufferbohle mit Puffern, Kupplung, Bahnräumer
    const bohle = Pg([[fx0 - 2, fyB - 14], [fx1 + 2, fyB - 14], [fx1 + 2, fyB - 4], [fx0 - 2, fyB - 4]], null, { rd: 0.5 });
    const puffer = [E(fx0 + 6, fyB - 9, 5, 4.4, null), E(fx1 - 6, fyB - 9, 5, 4.4, null)];
    const kupplung = [C(107 + X, fyB - 6, 107 + X, fyB + 4, 2.6, 2.2, null), E(107 + X, fyB + 5, 4, 2.6, null)];
    const raeumer = Pg([[fx0 + 2, fyB - 4], [fx1 - 2, fyB - 4], [fx1 - 8, fyB + 12], [fx0 + 8, fyB + 12]], null, { rd: 0.6 });
    // Zielanzeiger oben in der Stirn, Stirnlampen
    const schild = Pg([[86 + X, 24 + Y], [128 + X, 24 + Y], [128 + X, 33 + Y], [86 + X, 33 + Y]], null, { rd: 0.4 });
    const lampen = [E(80 + X, 116 + Y, 7, 7, null, { pf: 'bevel' }), E(134 + X, 116 + Y, 7, 7, null, { pf: 'bevel' })];
    const signal = E(107 + X, 13 + Y, 3, 2.4, null);
    // Phase 2: Arme aus Tür, Stirnfenstern und Seitenfenstern
    const arme = [];
    if (v.offen) {
      const g = greif;
      const arm = (pts, r0, r1) => { arme.push(...glied(pts, r0 + 0.6, r1 + 0.5, 'haut')); const e = pts[pts.length - 1], d = pts[pts.length - 2]; const a = Math.atan2(e[1] - d[1], e[0] - d[0]); arme.push(E(e[0], e[1], r0 + 0.6, r0 + 0.2, 'haut')); for (let k = -1.5; k <= 1.5; k++) { const aa = a + k * 0.4; arme.push(C(e[0], e[1], e[0] + Math.cos(aa) * 5, e[1] + Math.sin(aa) * 5, 0.8, 0.6, 'haut')); } };
      // aus der Tür: vier Arme nach vorn unten und zur Seite
      arm([[103 + X, 70 + Y], [92 + X - g * 8, 92 + Y], [78 + X - g * 16, 104 + Y + g * 6]], 2.4, 1.8);
      arm([[110 + X, 66 + Y], [100 + X - g * 6, 84 + Y], [96 + X - g * 14, 100 + Y + g * 4], [88 + X - g * 20, 108 + Y + g * 8]], 2.2, 1.6);
      arm([[108 + X, 94 + Y], [100 + X - g * 8, 118 + Y], [94 + X - g * 18, 136 + Y + g * 4]], 2.4, 1.8);
      arm([[112 + X, 104 + Y], [118 + X + g * 2, 128 + Y], [116 + X - g * 6, 148 + Y]], 2.2, 1.6);
      // aus den Seitenfenstern: hängende Arme
      arm([[50 + X, 64 + Y], [44 + X - g * 6, 82 + Y], [42 + X - g * 10, 98 + Y]], 2, 1.5);
      arm([[30 + X, 80 + Y], [24 + X - g * 6, 96 + Y], [22 + X - g * 10, 110 + Y]], 1.8, 1.3);
      arm([[16 + X, 90 + Y], [10 + X - g * 4, 104 + Y], [8 + X - g * 6, 116 + Y]], 1.6, 1.2);
      // aus dem linken Stirnfenster
      arm([[78 + X, 72 + Y], [70 + X - g * 10, 86 + Y], [62 + X - g * 18, 92 + Y + g * 6]], 2.2, 1.6);
    }
    const gruppen = [
      { p: gestell, k: 0, kante: true, tone: -0.2 },                      // 0
      { p: raeder, k: 0, kante: true, tone: -0.1 },                       // 1
      { p: seite ? [seite] : [], k: 0, kante: true, tone: -0.12 },        // 2 Seite
      { p: dachSeite ? [dachSeite] : [], k: 0, kante: true, tone: 0.1 },  // 3 Dach der Seite
      { p: [stirn], k: 0, kante: true, tone: 0.05 },                      // 4 Stirn
      { p: [schild], k: 0, kante: true, tone: -0.3 },                     // 5 Zielanzeiger
      { p: [signal], k: 0, kante: true },                                 // 6 Dachlampe
      { p: [raeumer], k: 0, kante: true, tone: -0.05 },                   // 7 Räumer
      { p: [bohle], k: 0, kante: true, tone: 0.1 },                       // 8 Pufferbohle
      { p: [...puffer, ...kupplung], k: 0.6, kante: true, tone: 0.1 },    // 9 Puffer, Kupplung
      { p: lampen, k: 0, kante: true, tone: 0.2 },                        // 10 Lampengehäuse
      { p: arme, k: 0.8, kante: true, tone: 0.45 },                       // 11 Arme (Phase 2)
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('station'), { rimBis: 172 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const nurLeer = (P, x, y, c) => { if (gid[y * W + x] !== 11) P.set(x, y, c); };
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      if (arme.length) { H0.kapselLicht(P, arme.filter(k => k.t === 'c'), 'r1'); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === 11) { const c = P.get(x, y); if (c >= 2 && c <= 4 && (x + y) % 3 === 0) P.set(x, y, 'blass'); else if (c >= 2 && c <= 3) P.set(x, y, 'k3'); else if (c === 1) P.set(x, y, 'k2'); }
        const finger = arme.filter(k => k.t === 'c' && k.r1 <= 0.8);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = P.get(x, y); if ((c === 5 || c === 6) && KA.drin(finger, x, y)) P.set(x, y, c === 6 ? 'blass' : 'k3'); } }
      const ox = X, oy = Y;
      // Fenster: Nische dunkel, Lichtkante unten links (das Licht fällt hinein), Gesichter, Hände an der Scheibe
      const fenster = (x0, y0, w, h, n, seed, offen) => {
        x0 = r(x0 + ox); y0 = r(y0 + oy);
        for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { if (gid[y * W + x] === 11) continue; const rand = x === x0 || y === y0 + h - 1; const oben = y === y0 || x === x0 + w - 1; P.set(x, y, rand ? 'r1' : oben ? 'k0' : offen ? ((x + y) % 2 ? 'k0' : 'k1') : (y - y0 < h * 0.3 ? ((x + y) % 2 ? 'k3' : 'k2') : ((x + y) % 2 ? 'k2' : (x + 2 * y) % 3 ? 'k1' : 'k2'))); }
        if (offen) return;
        // Gesichter: blasse Ovale, Augen
        for (let i = 0; i < n; i++) {
          const fxp = n > 1 ? x0 + Math.round(w * (0.3 + 0.42 * i)) : x0 + Math.round(w / 2), fyp = y0 + Math.round(h * 0.32) + ((i + seed) % 2) * 3;
          const fw = Math.max(2, Math.round(w / 5.2)), fh = Math.round(fw * 1.3);
          for (let y = -fh; y <= fh; y++) for (let x = -fw; x <= fw; x++) { const d = (x / fw) ** 2 + (y / fh) ** 2; if (d > 1) continue; nurLeer(P, fxp + x, fyp + y, d > 0.7 && (x < 0 || y > 0) ? 'k3' : 'blass'); }
          const ax = Math.max(1, Math.round(fw * 0.45));
          nurLeer(P, fxp - ax, fyp - 1, 'k0'); nurLeer(P, fxp + ax, fyp - 1, 'k0');
          if (!aus) { nurLeer(P, fxp - ax, fyp - 1, 'glut'); nurLeer(P, fxp + ax, fyp - 1, i % 2 ? 'glut' : 'kern'); }
          nurLeer(P, fxp, fyp + Math.max(1, fh - 2), 'k0'); if (fh > 3) nurLeer(P, fxp, fyp + fh - 1, 'k0');
          // Schultern unter dem Gesicht
          for (let x = -fw - 1; x <= fw + 1; x++) for (let y = fh + 1; y < fh + 4 && fyp + y < y0 + h - 1; y++) nurLeer(P, fxp + x, fyp + y, (x + y) % 2 ? 'k2' : 'k1');
        }
        // Hände flach an der Scheibe
        if (w > 12) for (let i = 0; i < 2; i++) { const hx = x0 + 2 + i * (w - 8), hy = y0 + h - 9 - i * 4; for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) nurLeer(P, hx + k, hy + j, j === 0 ? 'k3' : 'k2'); for (let k = 0; k < 4; k++) nurLeer(P, hx + k, hy - 1 - (k % 2), 'k3'); }
      };
      fenster(71, 46, 26, 38, 2, 1, false);
      fenster(118, 46, 26, 38, 2, 2, v.offen);
      if (v.offen) {
        // Tür offen: ein schwarzes Loch voller Gesichter
        for (let y = r(44 + oy); y < r(154 + oy); y++) for (let x = r(98 + ox); x < r(117 + ox); x++) { if (gid[y * W + x] === 11) continue; P.set(x, y, (x === r(98 + ox)) ? 'r1' : x === r(116 + ox) ? 'k3' : (x + y) % 4 ? 'k0' : 'k1'); }
        // Türflügel zur Seite geschoben: Kanten mit Licht
        for (let y = r(44 + oy); y < r(146 + oy); y++) { P.auf(r(96 + ox), y, 'k3'); P.auf(r(118 + ox), y, 'r1'); P.auf(r(119 + ox), y, 'k0'); }
        for (let i = 0; i < 6; i++) { const cx = r(103 + ox + (i % 2) * 7), cy = r(52 + oy + i * 15); for (let y = -3; y <= 3; y++) for (let x = -2; x <= 2; x++) if ((x / 2.4) ** 2 + (y / 3.2) ** 2 <= 1) nurLeer(P, cx + x, cy + y, (x + y) > 1 ? 'blass' : 'k3'); if (!aus) { nurLeer(P, cx - 1, cy, 'glut'); nurLeer(P, cx + 1, cy, 'kern'); } }
        // im rechten Fenster viele Augen im Dunkel
        if (!aus) for (let i = 0; i < 7; i++) nurLeer(P, r(121 + ox + (i * 5) % 19), r(50 + oy + (i * 9) % 24), i % 3 ? 'glutDim' : 'glut');
      } else {
        fenster(100, 46, 14, 26, 1, 3, false);
        // Tür: Fuge, Griff, Nummernschild aus Email
        for (let y = r(46 + oy); y < r(146 + oy); y++) { P.auf(r(99 + ox), y, 'k0'); P.auf(r(115 + ox), y, 'k0'); P.auf(r(116 + ox), y, 'k3'); }
        P.auf(r(112 + ox), r(100 + oy), 'messing'); P.auf(r(112 + ox), r(101 + oy), 'k3');
        for (let y = r(80 + oy); y < r(88 + oy); y++) for (let x = r(102 + ox); x < r(112 + ox); x++) P.auf(x, y, (y === r(80 + oy) || x === r(111 + ox)) ? 'r1' : 'email');
        P.auf(r(105 + ox), r(84 + oy), 'blass'); P.auf(r(108 + ox), r(84 + oy), 'blass');
      }
      // Seitenfenster: kleiner nach hinten, Gesichter als Schatten mit Augen
      if (!v.frontal) {
        const sw = t => fx0 - (fx0 - sxL) * t;
        [[0.08, 0.2], [0.33, 0.17], [0.55, 0.14], [0.74, 0.11], [0.89, 0.08]].forEach(([t, bt], i) => { const x1 = sw(t), x2 = sw(t + bt * 0.85); const top = yT(x1), bot = yB(x1); const hh = (bot - top); fenster(x2 - ox, top + hh * 0.14 - oy, Math.max(4, x1 - x2), Math.max(5, hh * 0.3), 1, i + 4, false); });
        // Zierleiste unter den Fenstern und an der Dachkante, Türfugen
        for (let x = r(sxL + 1); x < r(fx0); x++) { const yl = r(yT(x) + (yB(x) - yT(x)) * 0.5); P.auf(x, yl, 'messing'); P.auf(x, yl + 1, 'k0'); P.auf(x, r(yT(x)) + 1, x % 2 ? 'r1' : 'k3'); P.auf(x, r(yB(x) - (yB(x) - yT(x)) * 0.08), 'k3'); }
        [0.27, 0.5, 0.7].forEach(t => { const x = r(sw(t)); for (let y = r(yT(x) + 2); y < r(yB(x)) - 2; y++) { P.auf(x, y, 'k0'); P.auf(x + 1, y, (y % 2) ? 'k3' : 'k2'); } });
        for (let x = r(sxL + 3); x < r(fx0); x += 3) for (const q of [0.62, 0.74, 0.86]) { const y = r(yT(x) + (yB(x) - yT(x)) * q); if ((x + r(q * 10)) % 2) P.auf(x, y, 'k2'); }
      }
      // Zierleiste der Stirn
      for (let x = r(fx0 + 1); x < r(fx1); x++) { if (!v.offen || x < r(99 + ox) || x > r(115 + ox)) { P.auf(x, r(92 + oy), 'messing'); P.auf(x, r(93 + oy), 'k0'); } }
      // Bleche und Nieten: Fugen waagerecht, Nietenreihen
      for (const yy of [40, 86, 130]) for (let x = r(fx0 + 1); x < r(fx1); x++) { if (x > r(99 + ox) && x < r(116 + ox) && yy < 140) continue; P.auf(x, r(yy + oy), 'k0'); if (x % 4 === 0) P.auf(x, r(yy + oy) + 2, 'k3'); }
      for (let y = r(fyT + 2); y < r(fyB - 14); y += 4) { P.auf(r(fx1 - 3), y, 'k3'); P.auf(r(fx0 + 3), y, 'k3'); }
      // Zielanzeiger: Lichtpunkte wie Buchstaben; der Name ist länger als das Schild und läuft hinaus aufs Blech
      if (!aus) { for (let i = 0; i < 26; i++) { const bx = r(88 + ox + i * 2), by = r(27 + oy + ((i * 7) % 3) * 2); const auf = (i * 5 + f) % 7 !== 0; if (!auf) continue; const c = bx > r(126 + ox) ? 'glutDim' : (i % 4 ? 'glutDim' : 'glut'); if (bx < W - 1) P.set(bx, by, c); } P.set(r(96 + ox), r(28 + oy), 'kern'); }
      // Dachlampe (Signal) und Stirnlampen: die Augen
      if (!aus) {
        P.set(r(107 + ox), r(13 + oy), 'glut'); P.glow(107 + ox, 13 + oy, 6, 0.6);
        const l2 = v.offen ? [f % 2 === 0, true] : [true, true];
        [[80, 116], [134, 116]].forEach(([lx, ly], i) => { if (!l2[i]) return; const LX = r(lx + ox), LY = r(ly + oy); P.glow(LX + 0.5, LY + 0.5, 13, 1); for (let yy = -3; yy <= 3; yy++) for (let xx = -3; xx <= 3; xx++) if (xx * xx + yy * yy <= 10) P.set(LX + xx, LY + yy, xx * xx + yy * yy <= 2 ? 'kern' : xx + yy < 0 ? 'glut' : 'glutDim'); augen.push([LX, LY]); });
      }
      // Lampenringe in Messing
      [[80, 116], [134, 116]].forEach(([lx, ly]) => { for (let a = 0; a < 6.28; a += 0.3) P.auf(r(lx + ox + Math.cos(a) * 5.5), r(ly + oy + Math.sin(a) * 5.5), Math.cos(a) - Math.sin(a) > 0.6 ? 'messing' : 'k1'); });
      // Räumer: senkrechte Stäbe
      for (let x = r(fx0 + 10); x < r(fx1 - 8); x += 4) { P.line(x, r(fyB - 3), x + (x < 107 + ox ? 2 : -2), r(fyB + 10), 'k0', true); P.line(x + 1, r(fyB - 3), x + 1 + (x < 107 + ox ? 2 : -2), r(fyB + 10), 'k3', true); }
      // Funken an den Rädern beim Bremsen und Einfahren
      if (funken) for (let i = 0; i < 9; i++) { const sx = r(30 + X + i * 9 + (f * 5) % 7), sy = r(150 + Y - (i % 3) * 3 + (i * 13) % 5); P.set(sx, sy, i % 3 ? 'glut' : 'kern'); if (i % 2) P.set(sx - 1, sy + 1, 'glutDim'); }
    };
    return { gruppen, details, augen, dy: ruck };
  },
};
