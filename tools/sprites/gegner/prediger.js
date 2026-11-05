// Zweiter Wächter Kapelle: Der Prediger. Die Kanzel der Kapelle steht schief im schrägen Wasser, darüber
// schwebt der Schalldeckel ohne Wand. Der Prediger von 1634 steht noch darin: Er ist über die Jahre länger
// geworden, Rumpf und Hals, bis sein Kopf unter den Schalldeckel stieß. Die Arme liegen ausgebreitet über
// der Brüstung, die Hände hängen außen herab bis unter den Korb. An der Brüstung die Kanzelsanduhr: Der Sand
// läuft nach oben. Unten im Wasser brennt eine Kerze weiter.
// Randlicht kalt (Licht vom Wasserspiegel, Zone kapelle_w2): Die Wächter-Szene ist ganz Bernstein und Grün.
'use strict';
const LIB = require('../lib');
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
module.exports = {
  id: 'prediger', biom: 'kapelle', zone: 'kapelle_w2', rang: 'waechter', w: 160, h: 180, fuss: [80, 175], kopf: [80, 4], rimBis: 168,
  varianten: { prediger: {} },
  // Silhouetten-Probe (verworfen): der Prediger aufrecht, Arme am Leib, ohne Treppe. Schwarz eine Lampe mit
  // Schirm oder ein Pilz (Korb und Deckel ohne Mensch dazwischen). Erst die ausgebreiteten, zu langen Arme über
  // der Brüstung und die Treppe als Diagonale machen ihn zu jemandem, der von oben herab predigt.
  proben: { probe_aufrecht: { aufrecht: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let lean = 0, sway = 0, kopfN = 0, fall = 0, deck = 0, sand = f, sinken = 0, mund = 0;
    // armL/armR: 0 hängen, 1 hoch erhoben; lean: Rumpf nach links negativ
    if (p.idle) { kopfN = [0, 0, 1, 1][f]; sway = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [3, 5, -12, -6][f]; kopfN = [-1, -2, 3, 2][f]; mund = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; kopfN = [-1, 0][f]; sway = 2; }
    if (p.tod) { sinken = r(p.q * 34); fall = r(p.q * 10); deck = p.q; lean = r(p.q * 3); }
    const aufrecht = !!v.aufrecht;
    // Wasser schräg (links höher): Linie von (40,168) nach (122,172)
    const wy = x => 168 + (x - 40) * 0.05;
    // Kanzelfuß: gedrehte Säule mit Knauf, Kegel unter dem Korb
    const fuss = [Pg([[75, 128], [85, 128], [84, 150], [86, 172], [74, 172], [76, 150]], null, { rd: 1 }), E(80, 146, 7, 4, null), Pg([[64, 122], [96, 122], [86, 136], [74, 136]], null, { rd: 1.5 })];
    // Korb: achteckig, oben Gesims
    const korb = [Pg([[44, 94], [116, 94], [114, 104], [108, 122], [96, 130], [64, 130], [52, 122], [46, 104]], null, { rd: 1.5 })];
    const gesims = [Pg([[40, 90], [120, 90], [119, 97], [41, 97]], null, { rd: 0.8 })];
    // Treppe: Wange und Handlauf diagonal nach links unten
    const treppe = [Pg([[46, 112], [52, 120], [22, 170], [10, 170]], null, { rd: 1 }), C(42, 94, 8, 164, 1.6, 1.6, null), C(8, 164, 8, 171, 1.6, 1.8, null)];
    for (let i = 1; i < 6; i++) { const q = i / 6; const x = 42 - 34 * q, y = 94 + 70 * q; treppe.push(C(x, y, x + 2, y + 13, 0.9, 0.9, null)); }
    // Prediger: Talar, zu langer Rumpf und Hals, Kopf unter dem Deckel
    const T = sinken, L = lean;
    const sx = 80 + L * 0.6, sy = (aufrecht ? 62 : 58) + T; // Schultern
    const rumpf = Pg([[68 + L * 0.2, 98], [92 + L * 0.2, 98], [90 + L * 0.5, 76 + T], [sx + 10, sy + 4], [sx - 10, sy + 4], [70 + L * 0.5, 76 + T]], null, { rd: 2 });
    const hx = 80 + L * 1.0 - 2, hy = sy - 16 + kopfN * 0.5;
    const hals = C(sx - 1, sy + 2, hx + 1, hy + 6, 4.2, 3.6, null);
    const kopf = E(hx, hy, 7.2, 8.8, 'haut', { pf: 'bevel' });
    const haar = [Pg([[hx + 1, hy - 9], [hx + 7, hy - 6], [hx + 8, hy + 10], [hx + 5, hy + 16], [hx + 2, hy + 8]], null, { rd: 0.8 })];
    const beff = [Pg([[sx - 4, sy + 4], [sx - 1, sy + 4], [sx - 1, sy + 13], [sx - 4, sy + 13]], 'haut', { rd: 0.2, pf: 'flat', tone: 0.5 }), Pg([[sx, sy + 4], [sx + 3, sy + 4], [sx + 3, sy + 13], [sx, sy + 13]], 'haut', { rd: 0.2, pf: 'flat', tone: 0.5 })];
    // Arme: Schulter -> Ellbogen -> Hand; je Bild feste Punkte (Ellbogen, Hand) links und rechts
    const ARM = {
      idle: [[[42, 90], [45, 138]], [[118, 90], [115, 138]]],
      a0: [[[40, 68], [34, 44]], [[121, 68], [126, 44]]], a1: [[[46, 48], [58, 30]], [[114, 48], [102, 30]]],
      a2: [[[30, 96], [4, 126]], [[110, 90], [98, 134]]], a3: [[[36, 94], [24, 138]], [[115, 90], [110, 138]]],
    };
    const arm = (s, sw) => {
      const sh = [sx + s * 9, sy + 6];
      if (aufrecht) { const e = [sh[0] + s * 4, sh[1] + 18], h = [sh[0] + s * 3, sh[1] + 34]; return { pts: [sh, e, h], hand: h, s }; }
      const key = p.angriff ? 'a' + f : 'idle'; const [el0, ha0] = ARM[key][s < 0 ? 0 : 1];
      const el = [el0[0] + L * 0.4, el0[1] + T * 0.6], ha = [ha0[0] + L * 0.4 + sw, ha0[1] + T * 0.4];
      const mid = [sh[0] + (el[0] - sh[0]) * 0.55, Math.min(sh[1], el[1]) - 3];
      return { pts: [sh, mid, el, ha], hand: ha, s, sh, mid, el };
    };
    const armL = arm(-1, sway), armR = arm(1, -sway);
    const armForm = a => { const o = glied(a.pts, 3.6, 2.2, null); const h = a.hand, dx = a.pts[a.pts.length - 1][0] - a.pts[a.pts.length - 2][0], dy = a.pts[a.pts.length - 1][1] - a.pts[a.pts.length - 2][1], dl = Math.hypot(dx, dy) || 1;
      const ux = dx / dl, uy = dy / dl; o.push(E(h[0] + ux * 2, h[1] + uy * 2, 2.8, 2.8, 'haut'));
      for (let k = -1; k <= 1; k++) o.push(C(h[0] + ux * 3 + k * 1.6 * uy, h[1] + uy * 3 - k * 1.6 * ux, h[0] + ux * (12 + Math.abs(k) * -2) + k * 2.2 * uy, h[1] + uy * (12 - Math.abs(k) * 2) - k * 2.2 * ux, 0.9, 0.6, 'haut'));
      if (a.sh) { const s = a.s, dr = p.angriff && f < 2 ? 3 : 7; o.push(Pg([[a.sh[0], a.sh[1] - 1], [a.mid[0], a.mid[1]], [a.mid[0] + (a.el[0] - a.mid[0]) * 0.5, a.mid[1] + (a.el[1] - a.mid[1]) * 0.5 + 1], [a.mid[0] - s * 1, a.mid[1] + dr + 3], [a.sh[0] - s * 2, a.sh[1] + 9]], null, { rd: 1 })); }
      return o; };
    // Sanduhr am Arm rechts an der Brüstung
    const ux0 = 124, uy0 = 74 + fall;
    const uhrArm = [C(116, 92, ux0 - 2, uy0 + 12, 1.2, 1.2, null)];
    const uhr = [Pg([[ux0 - 7, uy0 - 2], [ux0 + 7, uy0 - 2], [ux0 + 7, uy0], [ux0 - 7, uy0]], null, { rd: 0.4 }), Pg([[ux0 - 7, uy0 + 24], [ux0 + 7, uy0 + 24], [ux0 + 7, uy0 + 26], [ux0 - 7, uy0 + 26]], null, { rd: 0.4 }),
      C(ux0 - 6, uy0, ux0 - 6, uy0 + 24, 0.7, 0.7, null), C(ux0 + 6, uy0, ux0 + 6, uy0 + 24, 0.7, 0.7, null)];
    const glas = [Pg([[ux0 - 4.5, uy0 + 1], [ux0 + 4.5, uy0 + 1], [ux0 + 4, uy0 + 8], [ux0 + 0.8, uy0 + 12], [ux0 + 4, uy0 + 16], [ux0 + 4.5, uy0 + 23], [ux0 - 4.5, uy0 + 23], [ux0 - 4, uy0 + 16], [ux0 - 0.8, uy0 + 12], [ux0 - 4, uy0 + 8]], 'dunkel', { rd: 0.3, pf: 'flat' })];
    // Schalldeckel: sechseckige Platte, Gesims, Behang mit Zacken, oben Bekrönung
    const dk = deck, dy0 = 27 + r(dk * 70), dkip = dk * 0.25;
    const rotD = (x, y) => [80 + (x - 80) * Math.cos(dkip) - (y - 28) * Math.sin(dkip), dy0 + (x - 80) * Math.sin(dkip) + (y - 28) * Math.cos(dkip) - 6];
    const deckel = [Pg([[38, 26], [122, 26], [126, 31], [122, 36], [38, 36], [34, 31]].map(([x, y]) => rotD(x, y)), null, { rd: 1 })];
    const behang = []; for (let i = 0; i < 9; i++) { const x = 42 + i * 9.5; behang.push(E(...rotD(x + 1, 37), 4.2, 3.4, null)); }
    const krone = [Pg([[46, 27], [114, 27], [104, 19], [56, 19]].map(([x, y]) => rotD(x, y)), null, { rd: 1 }), Pg([[62, 20], [98, 20], [90, 12], [70, 12]].map(([x, y]) => rotD(x, y)), null, { rd: 1 }),
      C(...rotD(80, 13), ...rotD(80, 5), 2, 1.2, null), E(...rotD(80, 4), 2.6, 2.6, null)];
    for (const s of [-1, 1]) krone.push(C(...rotD(80 + s * 27, 21), ...rotD(80 + s * 31, 13), 1.6, 1, null), E(...rotD(80 + s * 31, 12), 1.6, 1.6, null));
    // Wasser: flache Kräusel um den Fuß (schräg)
    const wasser = [Pg([[52, wy(52) - 1], [108, wy(108) - 1], [112, wy(112) + 2], [48, wy(48) + 2]], null, { rd: 0.6, pf: 'flat' })];
    const gruppen = [
      { p: treppe, k: 0.5, kante: true },
      { p: uhrArm, k: 0, kante: true },
      { p: fuss, k: 1.5, kante: true },
      { p: armForm(armR), k: 1, kante: true },
      { p: [rumpf, hals], k: 2, kante: true },
      { p: haar, k: 0.5, kante: true },
      { p: [kopf], k: 0.5, kante: true },
      { p: beff, k: 0, kante: true },
      { p: korb, k: 0, kante: true },
      { p: gesims, k: 0, kante: true },
      { p: armForm(armL), k: 1, kante: true },
      { p: uhr, k: 0, kante: true },
      { p: glas, k: 0, kante: false, noRim: true },
      { p: [...deckel, ...behang], k: 1, kante: true },
      { p: krone, k: 0.5, kante: true },
      { p: wasser, k: 0, kante: true, noRim: true },
    ];
    const TREPPE = 0, FUSS = 2, ARMR = 3, RUMPF = 4, HAAR = 5, KOPF = 6, BEFF = 7, KORB = 8, GESIMS = 9, ARML = 10, UHR = 11, GLAS = 12, DECKEL = 13, KRONE = 14, WASSER = 15;
    gruppen.forEach((g, i) => { g.anker = [RUMPF, HAAR, KOPF, BEFF].includes(i) ? [r(L * 0.6), T] : [0, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('kapelle_w2'), { rimBis: 168 });
    const augen = [];
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
    const details = P => {
      const B = LIB.bay;
      // Korb: Felder mit Rundbogen (Binnenform), Fase rechts, Wasserlinie schräg (unten nass und dunkler)
      for (let y = 94; y < 131; y++) for (let x = 40; x < 121; x++) {
        if (!ist(x, y, KORB)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const fx = ((x - 46) % 14 + 14) % 14;
        if (fx === 0 && y > 98 && y < 126) P.set(x, y, 'k0');
        else if (fx === 1 && y > 98 && y < 126) P.set(x, y, x > 76 ? 'r1' : 'k3');
        else if (fx > 3 && fx < 12 && y > 101 && y < 121) { const bo = y < 105 ? Math.abs(fx - 7.5) > (y - 101) * 1.1 + 0.5 : false; if (!bo) P.set(x, y, (fx === 4 || y === 120) ? 'k0' : (fx === 11 && x > 70 ? 'k3' : (B(x, y) < 0.25 ? 'k2' : 'k1'))); }
        if (y === 127 || y === 128) P.set(x, y, y === 127 ? 'k0' : 'k2');
      }
      // Gesims: Zahnschnitt
      for (let x = 41; x < 120; x++) { if (ist(x, 95, GESIMS)) P.set(x, 95, x % 3 ? 'k1' : 'k3'); if (ist(x, 92, GESIMS) && x > 60) P.set(x, 92, 'k3'); }
      // Deckel: Unterseite dunkel, Felder, Gesimslinie hell zur Lichtseite; Behang mit Quasten
      for (let y = 0; y < 60 + r(deck * 80); y++) for (let x = 20; x < 140; x++) {
        if (!ist(x, y, DECKEL)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [ux, uy] = [x, y - dy0 + 22];
        if (uy > 31 && uy < 34) P.set(x, y, (x % 6 === 0) ? 'k0' : (x > 70 ? 'k3' : 'k2'));
        if (Math.abs(uy - 29) < 0.6) P.set(x, y, 'k0');
        if (uy > 19 && uy < 25 && ((x - 50) % 10 === 0)) P.set(x, y, 'k0');
      }
      // Haube des Predigers: Haar nass, Gesicht hager, Mund offen
      const HX = r(hx), HY = r(hy);
      for (let y = HY - 9; y < HY + 9; y++) for (let x = HX - 7; x < HX + 8; x++) {
        if (!ist(x, y, KOPF)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const dx = x - hx, dy = y - hy;
        if (dy < -4 + dx * 0.3 || dx > 3) P.set(x, y, (x + y) % 4 ? 'k1' : 'k2');
        else P.set(x, y, dx < -5 ? 'k2' : (dy > 5 ? 'k2' : 'k3'));
      }
      // Mund: senkrechter Spalt, im Angriff weit
      for (let k = 0; k < 2 + mund * 2; k++) P.auf(HX - 4, HY + 3 + k, 'k0');
      if (mund) P.auf(HX - 3, HY + 4, 'k0');
      if (!(p.tod && f >= 1)) {
        P.glow(HX - 3, HY - 1, 7, 0.8, 'glutDim', 'k3');
        P.set(HX - 5, HY - 1, 'kern'); P.set(HX - 4, HY - 1, 'glut'); P.set(HX - 1, HY - 2, 'glut');
        augen.push([HX - 5, HY - 1], [HX - 1, HY - 2]);
      }
      // Talar: Falten vom Gürtel zur Brüstung, Knopfreihe
      for (let y = r(sy + 6); y < 98; y++) { P.auf(sx - 6 + (y - sy) * 0.08, y, 'k0'); P.auf(sx + 5 + (y - sy) * 0.1, y, 'k0'); if (ist(sx + 6 + (y - sy) * 0.1, y, RUMPF) && B(r(sx), y) < 0.5) P.set(sx + 6 + (y - sy) * 0.1, y, 'k3'); if (y % 4 === 0 && y > sy + 14) P.auf(sx - 1, y, 'k3'); }
      // Beffchen hell
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, BEFF) && P.get(x, y) <= 6) P.set(x, y, (x + y) % 3 ? 'r2' : 'r1');
      // Sanduhr: Sand läuft nach oben, das obere Glas füllt sich, glimmt im Kerzenschein
      if (!(p.tod && f >= 3)) {
        const top = 9 - Math.min(6, (sand % 4) + 3);
        for (let y = r(uy0 + 2); y < r(uy0 + 22); y++) for (let x = ux0 - 5; x <= ux0 + 5; x++) {
          if (!ist(x, y, GLAS)) continue; const yy = y - uy0;
          if (yy < 11 && yy >= 1 + top - 2) P.set(x, y, B(x, y) < 0.55 ? 'flamme' : 'glutDim');
          else if (yy > 19) P.set(x, y, B(x, y) < 0.3 ? 'glutDim' : 'k1');
          else if (x === ux0 && yy >= 11 && yy <= 19 && (yy + sand) % 2 === 0) P.set(x, y, 'flamme');
          else P.set(x, y, x > ux0 + 2 ? 'r1' : 'k1');
        }
        P.set(ux0 + 3, r(uy0 + 3), 'r2');
      }
      // Kerze im Wasser: brennt unter der Wasserlinie
      if (!p.tod) { const kx = 98, ky = 170; P.set(kx, ky + 1, 'k3'); P.set(kx, ky + 2, 'k3'); P.set(kx, ky, 'flamme'); P.set(kx, ky - 1, f % 2 ? 'glut' : 'flamme'); }
      // Wasserlinie: kalte Kräusel
      for (let x = 46; x < 114; x++) { const y = r(wy(x) - 1); if (ist(x, y, WASSER) || ist(x, y + 1, WASSER)) { if ((x + f) % 5 < 3) P.set(x, y, x > 70 ? 'r1' : 'k3'); } }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Hände: hell (Totenhaut), Finger
      // kräftiges Randlicht zur Lichtseite (oben rechts frei)
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < 168; y++) for (let x = 0; x < W; x++) { const g = gid[y * W + x]; if (g < 0 || g === GLAS || g === WASSER) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue;
          if ((leer(x + 1, y) && leer(x, y - 1)) || (leer(x + 1, y - 1) && leer(x + 1, y))) z.push([x, y, 'r2']); else if (leer(x + 1, y) || leer(x, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
