// Der Kurgast mit Taucherbrille (Kurhaus). Ein Herr im gestreiften Badeanzug von 1900, der am
// Beckenrand steht und springen will, seit fünfundzwanzig Jahren. Auf Zehenspitzen, die Arme über
// dem Kopf zur Spitze gefaltet, alles an ihm ein Glied zu lang. Die Brille ist voll Wasser, und
// die Augen schwimmen darin, jedes für sich. Angriff: endlich der Kopfsprung, auf dich.
'use strict';
module.exports = {
  id: 'kurgast', biom: 'kurhaus', zone: 'kurhaus', w: 96, h: 120, fuss: [50, 115], kopf: [50, 4], rimBis: 113,
  varianten: {
    kurgast_a: { gross: 1, streifen: 3, bauch: 0 },
    // b: kleiner, mit Bauch und Schnurrbart, die Arme nur halb gehoben (er zögert noch)
    kurgast_b: { gross: 0.9, streifen: 4, bauch: 4, bart: true, zoegern: true },
  },
  probe: { probe_hocke: { gross: 1, streifen: 3, bauch: 0, hocke: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, G = v.gross;
    let tilt = 0, duck = 0, hub = 0, schweb = [[0, 0], [0, 0]], fall = 0, armA = v.zoegern ? 0.45 : 0, zitter = 0, auge = 1;
    if (p.idle) { schweb = [[[0, 0], [1, 0]], [[1, 1], [0, 1]], [[1, 0], [0, -1]], [[0, -1], [1, 0]]][f]; zitter = [0, 1, 0, 1][f]; hub = [0, 0, 1, 1][f]; }
    if (p.angriff) { duck = [10, 3, 0, 2][f]; tilt = [0.06, -0.3, -0.68, -0.25][f]; hub = [0, 5, 12, 2][f]; fall = [0, 3, 10, 2][f]; armA = [0, 0, 0, 0][f]; auge = [1, 1.2, 1.4, 1][f]; schweb = [[0, 1], [0, 0], [-1, 0], [0, 0]].map(q => [q, q])[f]; }
    if (p.treffer) { tilt = [0.18, 0.08][f]; duck = 2; schweb = [[1, -1], [-1, 1]]; }
    if (p.tod) { const q = p.q; tilt = -q * 0.25; duck = r(q * 30); fall = 0; auge = f < 1 ? 1 : 0; armA = 0.9 * q; }
    if (v.hocke && !p.angriff) { duck = 26; tilt = -0.55; }
    // lokale Koordinaten: x nach rechts, y nach oben (negativ), Fuß = (0,0); Drehung um den Fuß
    const ox = 50 + fall * 2, oy = 114 - hub, an = [r(fall * 2), -hub];
    const T = (x, y) => { const c = Math.cos(tilt), s = Math.sin(tilt); return [ox + x * c - y * s, oy + x * s + y * c]; };
    const k = duck; // Kniebeuge: Hüfte sinkt, Knie gehen nach vorne
    const hY = -52 * G + k, knie = [-5 - k * 0.6, -30 * G + k * 0.35];
    // Beine: Badehose bis zum Knie (dunkel), darunter lange, dünne Schienbeine auf Zehenspitzen
    const bein = (dx, dz) => [
      C(...T(0 + dx * 0.6, hY + 2), ...T(knie[0] + dx, knie[1]), 3.6 - dz, 2.8 - dz, null),
      ...glied([T(knie[0] + dx, knie[1]), T(-1 + dx, -8), T(-2 + dx, -1)], 2 - dz, 1.5 - dz, 'haut'),
    ];
    const beinH = bein(4, 0.3), beinV = bein(-2, 0);
    const fuss = [E(...T(-5, -1), 3.2, 1.4, 'haut'), E(...T(2, -1), 3, 1.3, 'haut')];
    // Rumpf: schmal, eingefallene Brust, ggf. Bauch
    const sh = hY - 30 * G, b = v.bauch;
    const rumpf = Pg([T(-7 - b * 0.3, hY + 4), T(-6 - b, hY - 10), T(-7, sh + 7), T(-9, sh + 1), T(-4, sh - 2), T(5, sh - 2), T(9, sh + 2), T(8, sh + 9), T(6, hY - 8), T(7, hY + 4)], null, { rd: 1.5 });
    const hals = C(...T(0, sh - 1), ...T(-1, sh - 6), 2, 1.8, 'haut');
    const kc = T(-1, sh - 11 + zitter * 0);
    const kopf = E(kc[0], kc[1], 5.4, 6, 'haut', { pf: 'bevel' });
    const kappe = Pg([T(-6, sh - 14), T(-3, sh - 18), T(3, sh - 18), T(5, sh - 13), T(4, sh - 9), T(-2, sh - 12)], 'dunkel', { rd: 1 });
    // Arme: über dem Kopf zur Spitze gefaltet (Zögern: halb gehoben)
    const spitze = T(0 - armA * 10, sh - 34 * G + armA * 26);
    const armV = glied([T(-8, sh + 2), T(-12 - armA * 8, sh - 12 + armA * 14), T(-2 - armA * 8, sh - 28 * G + armA * 24), spitze], 2.6, 1.4, 'haut');
    const armH = glied([T(8, sh + 2), T(11 - armA * 4, sh - 13 + armA * 12), T(2 - armA * 6, sh - 28 * G + armA * 24), spitze], 2.4, 1.3, 'haut');
    const gruppen = [
      { p: armH, k: 0.5, anker: an },
      { p: beinH, k: 0.8, anker: an, noRim: true },
      { p: [rumpf], k: 2, anker: an },
      { p: beinV, k: 0.8, anker: an },
      { p: fuss, k: 0, anker: an },
      { p: [hals], k: 0, anker: an },
      { p: [kopf, kappe], k: 1, anker: an },
      { p: armV, k: 0.5, anker: an },
    ];
    const augen = [];
    const details = P => {
      // Streifen des Badeanzugs (quer zur Körperachse)
      for (let y = hY + 1; y > sh + 1; y -= v.streifen) { const a = T(-10, y), c = T(10, y); P.line(a[0], a[1], c[0], c[1], 'k1', true); }
      // Runzeln an den Armen (zu lange im Wasser)
      for (let t = 0.2; t < 0.9; t += 0.18) { const q = T(-12 - armA * 8 + (10 - armA * 0) * t * 0.5, sh - 12 + armA * 14 - 14 * t); P.auf(q[0], q[1], 'k2'); }
      // Taucherbrille: zwei Gläser mit Messingrand, voll Wasser; die Augen schwimmen darin
      const g1 = T(-5, sh - 11), g2 = T(-1, sh - 12);
      for (const [g, i] of [[g2, 1], [g1, 0]]) {
        const gx = r(g[0]), gy = r(g[1]);
        for (let a = 0; a < 6.283; a += 0.3) P.set(r(gx + Math.cos(a) * 2.6), r(gy + Math.sin(a) * 2.6), 'messing');
        for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) P.set(gx + x, gy + y, auge > 0 ? 'wasser' : 'k2');
        if (auge > 0) { const [ex, ey] = schweb[i]; P.set(gx + ex, gy + ey, 'kern'); P.glow(gx + 0.5, gy + 0.5, 5 * auge, 0.7); P.set(gx + ex, gy + ey, 'kern'); augen.push([gx + ex, gy + ey]); }
      }
      const band = T(4, sh - 12); P.line(g2[0] + 2, g2[1], band[0], band[1], 'k0', true);
      if (v.bart) { const m = T(-6, sh - 8); P.line(m[0], m[1], m[0] + 3, m[1] + 1, 'k0', true); }
      // Tropfen von den Fingerspitzen, sein Becken ist leer
      if (p.idle && f % 2) P.set(r(spitze[0]) - 1, r(spitze[1]) + 6 + f, 'r1');
    };
    return { gruppen, details, augen };
  },
};
