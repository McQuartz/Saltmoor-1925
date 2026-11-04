// Der Kirchenvogt (Überflutete Kapelle, Ergänzung). Er ging 1634 mit dem Klingelbeutel durch die Bänke,
// als die Flut kam, und sammelt seitdem weiter. Schwarzer Talar, ein Mühlsteinkragen so groß wie ein Teller,
// und auf dem Teller liegt sein Kopf, auf der Seite, und sieht dich von dort aus an.
// Der Beutel an der langen Stange ist schwer und nass; das Glöckchen daran läutet, wenn jemand nicht gibt.
'use strict';
const K = require('./hilfe/kanten');
module.exports = {
  id: 'kirchenvogt', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [58, 115], kopf: [60, 18], rimBis: 113,
  varianten: {
    kirchenvogt_a: { kragen: 19, stange: 30, kopfLiegt: true, saum: 6 },
    kirchenvogt_b: { kragen: 21, stange: 27, kopfLiegt: true, saum: 8, hut: true },
  },
  skizzen: { skizze_aufrecht: { kragen: 19, stange: 30, kopfLiegt: false, saum: 6 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    // st: Stangenwinkel (0 = waagerecht nach links), bl: Beutelpendel
    let L = 0, atem = 0, fall = 0, st = 0.12, bl = 0, hem = 0, augenAn = true, hand = [37, 66], glock = 0, nick = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; bl = [0, 1, 0, -1][f]; hem = [0, 1, 1, 0][f]; glock = f === 1 ? 1 : 0; }
    if (p.angriff) { L = [3, 4, -6, -3][f]; st = [-0.45, -0.95, 0.75, 0.4][f]; hand = [[43, 58], [47, 48], [33, 68], [35, 68]][f]; bl = [2, 3, -3, -1][f]; hem = [1, 2, -1, 0][f]; glock = f === 2 ? 2 : 0; nick = [1, 1, -1, 0][f]; }
    if (p.treffer) { L = [2, 1][f]; st = 0.3; bl = 2; }
    if (p.tod) { fall = r(p.q * 24); L = r(p.q * 2); augenAn = f < 1; st = 0.3 + p.q * 1.1; nick = r(p.q * 3); }
    const T = atem + fall, X = L;
    // Talar: schmal an den Schultern, fällt weit und gerade, Saum schleift nass
    const sch = 42 + T, S = 11;
    const talar = Pg([[55 - S + 3 + X, sch], [55 + S - 2 + X, sch], [56 + S + 3 + X, sch + 12], [70, 90 + fall * 0.3], [75, 108], ...saum(75, 41, 114, v.saum, 3, 5, hem), [42, 105], [46 + X * 0.5, 80 + fall * 0.4], [46 + X, sch + 9]], null, { rd: 1.2 });
    const falten = [[54, 60, 50, 110], [61, 58, 60, 111], [67, 62, 70, 109]].map(([a, b, c, d], i) => C(a + X, b + T, c, d, 0.7, 1.4, 'dunkel', { noRim: true }));
    // Mühlsteinkragen: flache Scheibe, leicht von oben gesehen
    const KR = v.kragen, kx = 55 + X, ky = sch - 1;
    const kragen = E(kx, ky, KR, KR * 0.36, 'haut', { pf: 'bevel', tone: 0.3 });
    // Kopf liegt auf dem Kragen, auf der Seite, Gesicht zu dir (links)
    const hx = v.kopfLiegt ? kx - KR + 8 + nick : kx - 3, hy = v.kopfLiegt ? ky - 5 : ky - 10;
    const kopf = v.kopfLiegt ? E(hx, hy - 1, 8, 5.5, null) : E(hx, hy - 2, 5.5, 7, 'haut');
    const haar = v.kopfLiegt ? Pg([[hx + 3, hy - 5], [hx + 8, hy - 3], [hx + 8, hy + 3], [hx + 4, hy + 4]], null, { rd: 1 }) : Pg([[hx - 5, hy - 8], [hx + 5, hy - 9], [hx + 6, hy - 4], [hx - 4, hy - 5]], null, { rd: 1 });
    const hut = v.hut ? [Pg([[kx + 6, ky - 2], [kx + 12, ky - 4], [kx + 14, ky - 15], [kx + 9, ky - 16], [kx + 6, ky - 12]], null, { rd: 1 })] : []; // der Hut steht noch auf dem Kragen, wo der Kopf war
    // Arme: der hintere ruht am Leib, der vordere hält die Stange
    const armH = glied([[63 + X, sch + 6], [69 + X, sch + 20], [64 + X, sch + 30]], 3.2, 2.4, null);
    const handH = E(63 + X, sch + 31, 2.4, 2.2, 'haut');
    const schluessel = [C(60 + X, 82 + T, 59 + X, 92 + T, 0.8, 0.8, null), E(59 + X, 93 + T, 2.2, 2.2, null)];
    const H = [hand[0] + X, hand[1] + T];
    const armV = glied([[47 + X, sch + 6], [(47 + X + H[0]) / 2 - 2, (sch + 6 + H[1]) / 2 + 6], H], 3.6, 2.8, null);
    const manschV = C(H[0] + 2, H[1] - 1, H[0] + 4, H[1] - 2, 3.6, 3.6, 'haut', { tone: 0.12 });
    const handV = E(H[0], H[1], 2.6, 2.4, 'haut');
    // Stange mit Klingelbeutel: vom Griff nach links, am Ende ein Bügel, darunter der Beutel
    const dx = -Math.cos(st), dy = Math.sin(st) * -1 * -1; // nach links, st > 0 senkt die Spitze
    const ende = [H[0] + dx * v.stange, H[1] + Math.sin(st) * v.stange];
    const griff = [H[0] - dx * 6, H[1] - Math.sin(st) * 6];
    const stange = C(griff[0], griff[1], ende[0], ende[1], 1.2, 1, 'dunkel', { pf: 'flat' });
    const buegel = [C(ende[0], ende[1], ende[0] - 1, ende[1] + 3, 1, 1, null), C(ende[0] + 5, ende[1] - 0.5 * Math.sin(st) * 5, ende[0] + 4, ende[1] + 3, 1, 1, null)];
    const bx = ende[0] + 2 + bl, by = ende[1] + 4;
    const beutel = Pg([[bx - 4, by], [bx + 5, by], [bx + 6, by + 7], [bx + 3 + bl * 0.5, by + 13], [bx - 3 + bl * 0.5, by + 13], [bx - 5, by + 7]], null, { rd: 1.3 });
    const quaste = C(bx + bl * 0.5, by + 13, bx + bl, by + 18, 1.2, 0.6, null);
    const stangeVorn = !(p.angriff && f < 2);
    const gruppen = [
      { p: stangeVorn ? [] : [stange, ...buegel, beutel, quaste], k: 0.5 },
      { p: [...armH, handH], k: 1, anker: [X, T] },
      { p: [talar], k: 2, anker: [X, T] },
      { p: schluessel, k: 0 },
      { p: falten, k: 0, noRim: true },
      { p: [...hut], k: 0.5, anker: [X, T] },
      { p: [kragen], k: 0, anker: [X, T] },
      { p: [kopf, haar], k: 1.5, anker: [X, T] },
      { p: stangeVorn ? [stange, ...buegel, beutel, quaste] : [], k: 0.5 },
      { p: [...armV, manschV, handV], k: 1, anker: [X, T] },
    ];
    const augen = [];
    const details = P => {
      K.licht(P, [talar], { c: 'k3', c2: null });
      K.licht(P, [...armV, handV], { c: 'r1', c2: 'k3' });
      K.schatten(P, [kragen], { d: [0, 2] });
      K.licht(P, [beutel], { c: 'r1', c2: 'k3' });
      K.licht(P, [kopf], { c: 'r1', c2: 'k3' });
      if (v.kopfLiegt) {
        K.schatten(P, [kopf], { d: [0, 1] });
        // Haar fällt vom Scheitel über den Tellerrand
        for (let i = 0; i < 4; i++) { const x0 = r(hx - 7 + i * 1.2), y0 = r(hy - 2 + i); P.line(x0, y0, x0 - 2 + (i & 1), r(ky + 4 + i * 1.5), i % 2 ? 'k0' : 'k1'); }
        P.set(r(hx - 8), r(ky + 5), 'r1');
      }
      // Mühlsteinkragen: Pfeifenfalten als Strahlen, Licht auf der oberen Kante
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 11) {
        for (let q = 0.45; q <= 1; q += 0.1) { const x = r(kx + Math.cos(a) * KR * q), y = r(ky + Math.sin(a) * KR * 0.38 * q); if (P.get(x, y) >= 1 && P.get(x, y) <= 4) P.set(x, y, 'k2'); }
        const x = r(kx + Math.cos(a + 0.14) * KR * 0.9), y = r(ky + Math.sin(a + 0.14) * KR * 0.38 * 0.9);
        if (P.get(x, y) >= 1 && P.get(x, y) <= 4) P.set(x, y, Math.sin(a) < 0 ? 'r1' : 'k3');
      }
      // Die Öffnung des Kragens, wo der Hals war: leer und dunkel
      if (v.kopfLiegt) { P.el(kx + 2.5, ky - 0.5, 4.5, 1.8, 'k0', true); P.line(r(kx - 1), r(ky - 2), r(kx + 6), r(ky - 2), 'k1', true); }
      // Talar: Knopfleiste und nasser Saum
      for (let y = r(sch + 6); y < 100 + fall * 0.3; y += 4) P.auf(r(54 + X * (1 - (y - sch) / 70) + (y - sch) * 0.06), y, 'k3');
      // Faltenwurf: neben jeder dunklen Falte eine Lichtkante, unten nass glänzend
      [[54, 60, 50, 110], [61, 58, 60, 111], [67, 62, 70, 109]].forEach(([a, b, c, d]) => { for (let q = 0; q <= 1; q += 0.02) { const x = r(a + X + (c - a - X) * q) + 2, y = r(b + T + (d - b - T) * q); if (P.get(x, y) >= 1 && P.get(x, y) <= 4) P.set(x, y, q > 0.75 && (y & 1) ? 'r1' : 'k3'); } });
      // Gürtel und Schlüsselbund
      P.line(r(46 + X), r(80 + T), r(68 + X), r(80 + T), 'k0', true); P.line(r(47 + X), r(79 + T), r(67 + X), r(79 + T), 'k3', true);
      P.set(r(60 + X), r(93 + T), 'r1'); P.set(r(58 + X), r(95 + T), 'k3');
      K.licht(P, [manschV], { c: 'r1', c2: null });
      for (let x = 44; x <= 72; x += 3) P.auf(x, 111, (x / 3 | 0) % 2 ? 'r1' : 'k3');
      // Gesicht: liegt quer, die Augen übereinander statt nebeneinander
      if (augenAn) {
        if (v.kopfLiegt) { // Kopf liegt auf dem rechten Ohr: Scheitel links, Kinn rechts, Augen übereinander, Mund senkrecht
          const ex = r(hx - 1), ey = r(hy - 4); P.glow(ex + 0.5, ey + 3, 4.5, 0.8);
          P.set(ex, ey, 'kern'); P.set(ex, ey + 1, 'glut'); P.set(ex, ey + 4, 'glut'); P.set(ex, ey + 5, 'glutDim');
          P.line(r(hx + 4), r(hy - 4), r(hx + 4), r(hy + 1), 'k0', true); P.auf(r(hx + 2), r(hy - 2), 'k3');
          augen.push([ex, ey], [ex, ey + 4]); }
        else { const ex = r(hx - 3), ey = r(hy - 2); P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut'); augen.push([ex, ey], [ex + 3, ey]); }
      }
      // Glöckchen am Bügel: glänzt, schwingt beim Schlag
      const gx = r(ende[0] + 2 + glock), gy = r(ende[1] + 1);
      P.set(gx, gy, 'flamme'); P.set(gx + 1, gy, 'glut'); P.set(gx, gy + 1, 'k3'); if (glock) { P.set(gx - 1, gy - 1, 'r2'); }
      // Im Beutel klingt etwas, das kein Geld ist: ein schwaches Licht aus der Öffnung
      if (!p.tod || f < 2) { P.glow(bx + 0.5, by + 2, 5, 0.8); P.set(r(bx), r(by + 1), 'glut'); P.set(r(bx) + 2, r(by + 1), 'flamme'); augen.push([r(bx), r(by + 1)]); }
      // Beutel: Samtfalten und Tropfen
      P.line(r(bx - 2), r(by + 3), r(bx - 1 + bl * 0.3), r(by + 11), 'k0', true); P.line(r(bx + 2), r(by + 3), r(bx + 2 + bl * 0.3), r(by + 11), 'k3', true);
      if (p.idle) { const ty = r(by + 19 + f * 3); if (ty < 113) P.set(r(bx + bl), ty, 'r1'); }
    };
    return { gruppen, details, augen };
  },
};
