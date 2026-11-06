// Der Kühlhausgast (Konservenfabrik). Ein Herr vom Aufsichtsrat, 1911 bei der Besichtigung im Kühlhaus
// eingeschlossen. Er steckt bis zur Hüfte in einem Eisblock und lehnt steif schräg nach vorn wie ein Brett,
// Mantel und Melone. Im Eis sind Heringe eingefroren, alle blicken zu ihm hinauf. Die Eiszapfen hängen schräg.
'use strict';
module.exports = {
  id: 'kuehlhausgast', biom: 'fabrik', zone: 'fabrik', w: 96, h: 120, fuss: [52, 115], kopf: [40, 14], rimBis: 112,
  varianten: {
    kuehlhausgast_a: { phi: 0.36, blockB: 19, blockH: 30, hut: 'melone', fische: 3, lang: 6 },
    kuehlhausgast_b: { phi: 0.3, blockB: 21, blockH: 38, hut: 'zylinder', fische: 4, lang: 3 },
  },
  skizzen: { skizze_aufrecht: { phi: 0, blockB: 22, blockH: 32, hut: 'melone', fische: 3 } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f;
    let phi = v.phi, riss = 0, hauch = 0, fall = 0, dx = 0;
    if (p.idle) { hauch = f; }
    if (p.angriff) { phi = v.phi + [-0.12, -0.3, 0.42, 0.12][f]; dx = [1, 2, -2, 0][f]; }
    if (p.treffer) { phi = v.phi - [0.12, 0.05][f]; riss = 1 + f; dx = [2, 1][f]; }
    if (p.tod) { phi = v.phi + p.q * 1.1; riss = 3; fall = r(p.q * 6); }
    const bx = 52 + dx, BB = v.blockB, BH = v.blockH, yb = 114, yt = yb - BH;
    // Eisblock: Vorderseite, Deckfläche (heller), schmale rechte Seite
    const front = Pg([[bx - BB, yt], [bx + BB - 4, yt], [bx + BB - 4, yb], [bx - BB, yb]], null, { rd: 1.2, tone: 0.42 });
    const deck = Pg([[bx - BB, yt], [bx - BB + 5, yt - 4], [bx + BB + 1, yt - 4], [bx + BB - 4, yt]], 'haut', { rd: 0.6, tone: 0.3 });
    const seite = Pg([[bx + BB - 4, yt], [bx + BB + 1, yt - 4], [bx + BB + 1, yb - 4], [bx + BB - 4, yb]], null, { rd: 0.6, tone: 0.3 });
    // Körperachse: Hüfte im Eis, steif um phi nach vorn (links) gekippt
    const hx = bx + 2, hy = yt + 2 + fall;
    const s = Math.sin(phi), c = Math.cos(phi);
    const LG = v.lang || 0, P = (u, w) => { const ww = w > 4 ? w + LG * Math.min(1, (w - 4) / 20) : w; return [hx - s * ww + c * u, hy - c * ww - s * u]; }; // u: quer (rechts +), w: längs (hoch +)
    const mantel = Pg([P(-8, 0), P(8, 0), P(7, 10), P(9, 20), P(11, 26), P(8, 30), P(3, 31), P(-4, 31), P(-10, 28), P(-9, 18), P(-7, 10)], null, { rd: 1.2 });
    const kragen = Pg([P(-4, 30), P(4, 30), P(0, 20)], 'dunkel', { rd: 0.4 });
    const hals = C(...P(0, 29), ...P(-1, 33), 2.4, 2.4, 'haut');
    const kopf = E(...P(-1, 37), 5.5, 6.5, 'haut', { pf: 'bevel' });
    const hut = v.hut === 'melone'
      ? [Pg([P(-6, 41), P(-5, 46), P(0, 48), P(5, 46), P(6, 41)], 'dunkel', { rd: 1.2 }), C(...P(-10, 41), ...P(9, 41), 1.2, 1.2, 'dunkel')]
      : [Pg([P(-5, 41), P(-5, 53), P(5, 53), P(5, 41)], 'dunkel', { rd: 0.6 }), C(...P(-10, 41), ...P(9, 41), 1.2, 1.2, 'dunkel')];
    // Arme steif an den Seiten, die Hand vorne hält noch den Hut nicht mehr, sie hängt
    const armV = [C(...P(-9, 27), ...P(-12, 16), 2.8, 2.4, null), C(...P(-12, 16), ...P(-12, 5), 2.4, 2.1, null), E(...P(-12, 3), 2.2, 2.6, 'haut')];
    const armH = [C(...P(9, 27), ...P(12, 14), 2.6, 2.2, null), C(...P(12, 14), ...P(11, 5), 2.2, 2, null)];
    // Eiszapfen: hängen nicht senkrecht, sondern schräg zur Tür (nach links unten)
    const zapfen = [];
    const zr = [-0.62, 0.78], zl = (x, y, l) => zapfen.push(C(x, y, x + zr[0] * l, y + zr[1] * l, 1, 0.3, null, { pf: 'flat' }));
    [[-10, 41, 7], [-6, 41, 4], [9, 41, 5], [-12, 2, 6], [-12, 15, 4], [11, 6, 5]].forEach(([u, w, l]) => { const [x, y] = P(u, w); zl(x, y + 1, l); });
    const gruppen = [
      { p: [seite], k: 0 },
      { p: armH, k: 1 },
      { p: [hals], k: 0 },
      { p: [mantel], k: 1 },
      { p: [kragen], k: 0, noRim: true },
      { p: [kopf], k: 0 },
      { p: hut, k: 0.8 },
      { p: armV, k: 1 },
      { p: [deck], k: 0 },
      { p: [front], k: 0 },
      { p: zapfen, k: 0 },
    ];
    const augen = [];
    const details = P2 => {
      // Das Eis leuchtet von innen, kalt wie die Kühlhauslampe; davor die Schatten
      if (!p.tod || f < 3) { P2.glow(bx - 2, yt + BH * 0.55, BH * 0.8, 1.7, 'glutDim', 'k3'); P2.glow(bx - 4, yt + BH * 0.5, BH * 0.3, 0.6, 'r1', 'glutDim'); }
      // Im Eis: die Beine als dunkle Schatten, Heringe mit hellen Augen, alle nach oben zu ihm
      for (let y = yt + 3; y < yb - 3; y++) { if (y % 2 === 0 || y > yt + 8) { P2.auf(hx - 3, y, 'k1'); P2.auf(hx - 2, y, 'k0'); P2.auf(hx + 3, y, 'k1'); P2.auf(hx + 4, y, 'k0'); } }
      const fp = [[-14, 22, -0.5], [9, 20, 0.6], [-6, 27, -0.2], [15, 26, 0.9]].slice(0, v.fische);
      fp.forEach(([u, y0, k], i) => {
        const x0 = bx + u, y1 = yb - (BH - y0) - 0; const ex = r(x0 + k * 2), ey = r(yt + (y0 - 22) + 8);
        const bw = [1, 2, 2, 2, 2, 1, 1, 0, 0];
        for (let t = 0; t < bw.length; t++) { const x = r(x0 + k * (2 - t * 0.6)), y = ey + t; for (let q = -bw[t] + 1; q <= bw[t] - 1 + (bw[t] ? 1 : 0); q++) P2.auf(x + q, y, t < 2 ? 'k3' : 'k1'); if (bw[t] === 2) P2.auf(x + 2, y, 'k2'); }
        { const x = r(x0 + k * (2 - 9 * 0.6)), y = ey + 9; P2.auf(x - 1, y, 'k1'); P2.auf(x + 1, y, 'k1'); P2.auf(x - 2, y + 1, 'k1'); P2.auf(x + 2, y + 1, 'k1'); }
        const blick = p.idle ? [0, 0, 1, 0][f] && i === 1 : false;
        P2.auf(ex, ey, blick ? 'k1' : 'glut'); augen.push([ex, ey]); void y1;
      });
      // Glanz und Kanten im Eis: einzelne helle Linien von rechts oben
      for (let k = 0; k < 3; k++) { const x0 = bx + BB - 8 - k * 9, y0 = yt + 3 + k * 4; for (let t = 0; t < 6; t++) P2.auf(x0 - t, y0 + t * 2, t % 2 ? 'k3' : 'r1'); }
      // Risse im Eis bei Treffer und Tod
      if (riss) { let x = bx - 4, y = yt + 2; for (let t = 0; t < 8 * riss; t++) { P2.auf(r(x), r(y), 'r1'); x += [1, -1, 0, 1][t % 4]; y += 1; } }
      // Gesicht: trübe Augen, Schnurrbart mit Reif
      const [kx, ky] = P(-1, 37);
      if (!p.tod || f < 1) {
        const ex = r(kx - 3 + s * 2), ey = r(ky - 1);
        P2.set(ex, ey, 'kern'); P2.set(ex + 3, ey, 'glut'); P2.glow(ex + 1.5, ey + 0.5, 3.5, 0.5); augen.push([ex, ey], [ex + 3, ey]);
        P2.auf(ex, ey + 3, 'k0'); P2.auf(ex + 1, ey + 3, 'k0'); P2.auf(ex + 2, ey + 3, 'k3'); P2.auf(ex + 3, ey + 3, 'k0');
      }
      // ein Tropfen, der schräg fällt
      if (p.idle) { const [zx, zy] = P(-10, 41); P2.set(r(zx - 5 - f * 2), r(zy + 6 + f * 3), 'r1'); }
      // Atemhauch, der nicht steigt, sondern vor ihm in der Luft gefriert
      if (p.idle || p.angriff) for (let k = 0; k < 3; k++) { const x = r(kx - 8 - k * 3 - (p.idle ? hauch % 2 : 0)), y = r(ky + 2 + k); P2.set(x, y, k === 0 ? 'r1' : 'k3'); }
    };
    return { gruppen, details, augen, sinken: p.tod ? r(p.q * 2) : 0 };
  },
};
