// Der Mann im Salz (Salzstollen, Ergänzung). Ein Hauer aus der Bronzezeit, lange vor den Römern
// im Stollen verschüttet und vom Salz bewahrt. Fellumhang, Tragsack, Bronzepickel, in der anderen
// Hand ein Bündel brennender Kienspäne, wie man sie damals im Berg trug. Falsch ist der Kopf:
// Das Salz hat ihn zu einem einzigen Würfel auskristallisiert, glatt und rechtwinklig, und drinnen
// sieht man sein Gesicht, bewahrt und mit offenen Augen. Am Tragsack wachsen weitere Würfel nach.
'use strict';
// Würfel in Schrägansicht als Sechseck: Mitte, Größe, Drehung -> Eckpunkte und Flächen
function wuerfel(x, y, s, a) {
  const ro = ([u, w]) => [x + u * Math.cos(a) - w * Math.sin(a), y + u * Math.sin(a) + w * Math.cos(a)];
  const k = 0.87 * s;
  const o = ro([0, -s]), or = ro([k, -s / 2]), ur = ro([k, s / 2]), u = ro([0, s]), ul = ro([-k, s / 2]), ol = ro([-k, -s / 2]), m = ro([0, 0]);
  return { umriss: [o, or, ur, u, ul, ol], oben: [o, or, m, ol], links: [ol, m, u, ul], rechts: [m, or, ur, u], m, o, or, ur, u, ul, ol };
}
function inPoly(px, py, v) { let c = false; for (let i = 0, j = v.length - 1; i < v.length; j = i++) { if ((v[i][1] > py) !== (v[j][1] > py) && px < (v[j][0] - v[i][0]) * (py - v[i][1]) / (v[j][1] - v[i][1]) + v[i][0]) c = !c; } return c; }
module.exports = {
  id: 'salzmann', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [46, 115], kopf: [42, 10], rimBis: 112,
  varianten: {
    // a: großer Würfelkopf, leicht gekippt, Kristalle am Tragsack
    salzmann_a: { kopfS: 11, kipp: 0.1, sackK: [[66, 40, 5, 0.25], [71, 50, 3.5, -0.2], [62, 33, 3, 0.5]], hals: 4 },
    // b: Würfel stärker gekippt, Hals länger, die Kristalle wachsen auch auf der Schulter
    salzmann_b: { kopfS: 10, kipp: -0.22, sackK: [[68, 44, 6, -0.15], [59, 36, 3.5, 0.4], [72, 33, 3, 0.1]], hals: 7, schulterK: 1 },
  },
  skizzen: {
    sil_wuerfelkopf: { kopfS: 11, kipp: 0.1, sackK: [[66, 40, 5, 0.25], [71, 50, 3.5, -0.2], [62, 33, 3, 0.5]], hals: 4 },
    sil_langhals: { kopfS: 10, kipp: -0.22, sackK: [[68, 44, 6, -0.15], [59, 36, 3.5, 0.4], [72, 33, 3, 0.1]], hals: 7, schulterK: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, bay } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, flamme = 1, pk = 0, kipp = 0, blick = 1, span = 0;
    // pk: Pickel 0 gesenkt, 1 hoch über dem Kopf ausgeholt, 2 nach vorn unten geschlagen
    if (p.idle) { atem = [0, 0, 1, 1][f]; flamme = [1, 0.8, 1.15, 0.9][f]; blick = [1, 1, 1, 0][f]; span = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -3][f]; pk = [0.6, 1, 2, 1.7][f]; flamme = [1, 1.2, 1.4, 1.1][f]; blick = [1, 1.4, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; flamme = 0.6; kipp = 0.12; blick = 0.6; }
    if (p.tod) { fall = r(p.q * 14); lean = r(p.q * 5); flamme = Math.max(0, 1 - p.q * 3); kipp = p.q * 0.5; blick = 0; }
    const T = atem + fall, bx = 46 + lean, by = 76 + T; // Hüfte
    // Beine: leicht gebeugt, Lederwickel, Bundschuhe
    const beinV = glied([[bx - 5, by + 2], [bx - 9, by + 20 - fall / 2], [bx - 8, 112]], 3.8, 2.6, null);
    const beinH = glied([[bx + 5, by + 2], [bx + 9, by + 20 - fall / 2], [bx + 7, 112]], 3.8, 2.6, null);
    const fuesse = [E(bx - 11, 113, 4.6, 2.3, 'dunkel'), E(bx + 5, 113, 4.6, 2.3, 'dunkel')];
    // Rumpf: leicht gebeugt, breite Schultern unter dem Fellumhang
    const sx = bx - 6, sy = by - 30; // vordere Schulter
    const rumpf = Pg([[sx - 6, sy + 3], [sx, sy - 3], [bx + 8, by - 34], [bx + 14, by - 28], [bx + 13, by - 4], [bx + 10, by + 4], [bx - 8, by + 4], [bx - 11, by - 8], [sx - 7, sy + 12]], null, { rd: 2 });
    // Umhang: fällt in drei Bahnen, Fransensaum
    const umhang = Pg([[sx - 7, sy + 4], [bx + 14, by - 26], [bx + 15, by - 6], [bx + 12, by - 1], [bx + 9, by - 4], [bx + 6, by], [bx + 2, by - 4], [bx - 2, by], [bx - 5, by - 4], [bx - 9, by - 1], [bx - 12, by - 6], [sx - 8, sy + 12]], null, { rd: 0.6 });
    const falten = [C(bx - 4, by - 22, bx - 6, by - 5, 0.8, 1.2, 'dunkel'), C(bx + 5, by - 24, bx + 5, by - 5, 0.8, 1.2, 'dunkel')];
    const guertel = C(bx - 11, by - 1, bx + 13, by - 2, 1.3, 1.3, 'dunkel');
    const schurz = Pg([[bx - 10, by], [bx + 11, by - 1], [bx + 9, by + 7], [bx - 8, by + 8]], 'dunkel', { rd: 0.6 });
    // Tragsack auf dem Rücken: Leder, oben offen, zwei Riemen
    const kx = bx + 14, ky = by - 30;
    const sack = Pg([[kx - 4, ky - 4], [kx + 8, ky - 8], [kx + 14, ky + 4], [kx + 12, ky + 22], [kx + 4, ky + 28], [kx - 3, ky + 24]], null, { rd: 2.5 });
    const sackRand = C(kx - 4, ky - 4, kx + 8, ky - 8, 1.4, 1.4, 'dunkel');
    // Hals und Würfelkopf
    const kS = v.kopfS, hx = sx - 4 + r(lean * 0.4), hy = sy - v.hals - kS + 2 + (p.idle && f === 2 ? 1 : 0);
    const hals = C(sx + 1, sy + 2, hx + 1, hy + kS * 0.6, 3.4, 2.8, 'haut');
    const KW = wuerfel(hx, hy, kS, v.kipp + kipp + (p.angriff ? [0, -0.06, 0.1, 0.05][f] : 0));
    // Kristalle am Tragsack (und auf der Schulter)
    const SK = v.sackK.map(([x, y, s, a], i) => wuerfel(x + lean + (p.tod ? r(p.q * 3) * (i + 1) : 0), y + T + (p.tod ? r(p.q * 4) : 0), s, a + (p.treffer && f === 0 ? 0.1 : 0)));
    if (v.schulterK) SK.push(wuerfel(sx + 6, sy - 2, 3, 0.35));
    // Arme: vorne der Pickel, hinten das Spanbündel
    let hand, ell;
    if (pk === 0) { ell = [sx - 6, sy + 12]; hand = [sx - 9, sy + 23]; }
    else if (pk < 1.5) { ell = [sx - 2 + pk, sy - 6 - pk * 3]; hand = [sx + 6 - pk * 2, sy - 16 - pk * 4]; }
    else { ell = [sx - 12, sy + 2]; hand = [sx - 21, sy + 9]; }
    const armV = [...glied([[sx - 2, sy + 2], ell, hand], 3.5, 2.3, null), E(hand[0], hand[1], 2.8, 2.5, 'haut')];
    const hh = [bx + 12 + (p.angriff ? 2 : 0), by - 8 - span];
    const armH = [...glied([[bx + 9, by - 26], [bx + 15, by - 16], hh], 3, 2.3, null), E(hh[0], hh[1], 2.6, 2.3, 'haut')];
    const spaene = [0, 1, 2].map(i => C(hh[0] - 2 + i * 2, hh[1] + 4, hh[0] + 1 + i * 3, hh[1] - 9 + i, 0.8, 0.8, 'dunkel', { pf: 'flat' }));
    const flX = hh[0] + 3, flY = hh[1] - 10;
    // Bronzepickel: Stiel, Klinge quer, Spitze in Schlagrichtung
    const pick = [];
    {
      const wa = pk === 0 ? 1.45 : pk < 1.5 ? -1.5 - pk * 0.75 : 0.7, L = 22;
      const e = [hand[0] + Math.cos(wa) * L, hand[1] + Math.sin(wa) * L], s0 = [hand[0] - Math.cos(wa) * 4, hand[1] - Math.sin(wa) * 4];
      const nx = -Math.sin(wa), ny = Math.cos(wa), dx = Math.cos(wa), dy = Math.sin(wa);
      pick.push(C(s0[0], s0[1], e[0], e[1], 1.3, 1.4, 'dunkel', { pf: 'flat' }));
      const sp = pk >= 1.5 || pk === 0 ? 1 : -1;
      pick.push(Pg([[e[0] - nx * 3 * sp - dx, e[1] - ny * 3 * sp - dy], [e[0] - nx * 3 * sp + dx * 3, e[1] - ny * 3 * sp + dy * 3], [e[0] + nx * 10 * sp + dx * 1, e[1] + ny * 10 * sp + dy * 1], [e[0] + nx * 1 * sp - dx * 1.5, e[1] + ny * 1 * sp - dy * 1.5]], null, { rd: 0.3 }));
    }
    const pickHinten = pk > 0 && pk < 1.5;
    const gruppen = [
      { p: pickHinten ? pick : [], k: 0 },
      { p: [sack], k: 1, anker: [lean, T] },
      { p: [sackRand], k: 0 },
      ...SK.map(w => ({ p: [Pg(w.umriss, null, { rd: 0.3, b: 1.5 })], k: 0, anker: [lean, T] })),
      { p: [beinH, fuesse[1]].flat(), k: 1 },
      { p: [beinV, fuesse[0]].flat(), k: 1 },
      { p: [rumpf], k: 2, anker: [lean, T] },
      { p: [umhang], k: 0.5, anker: [lean, T] },
      { p: falten, k: 0, noRim: true },
      { p: [schurz], k: 0, anker: [lean, T] },
      { p: [guertel], k: 0, noRim: true },
      { p: spaene, k: 0 },
      { p: armH, k: 1, anker: [lean, T] },
      { p: [hals], k: 0 },
      { p: [Pg(KW.umriss, null, { rd: 0.4, pf: 'flat' })], k: 0, anker: [lean, T] },
      { p: pickHinten ? [] : pick, k: 0 },
      { p: armV, k: 1.2, anker: [lean, T] },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Würfelflächen: oben hell gedithert, rechts mittel, links (zum Betrachter) dunkler; Grate dazwischen
      const flaechen = (w, oben, rechts, links) => {
        const xs = w.umriss.map(q => q[0]), ys = w.umriss.map(q => q[1]);
        for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++) {
          if (!B(x, y)) continue; const X = x + 0.5, Y = y + 0.5;
          if (inPoly(X, Y, w.oben)) P.set(x, y, bay(x, y) < oben ? 'k3' : 'k2');
          else if (inPoly(X, Y, w.rechts)) P.set(x, y, bay(x, y) < rechts ? 'k3' : 'k2');
          else if (inPoly(X, Y, w.links)) P.set(x, y, bay(x, y) < links ? 'k2' : 'k1');
        }
        P.line(w.ol[0], w.ol[1], w.m[0], w.m[1], 'k1', true); P.line(w.m[0], w.m[1], w.u[0], w.u[1], 'k1', true);
        P.line(w.m[0], w.m[1], w.or[0], w.or[1], 'r1', true);
      };
      SK.forEach(w => flaechen(w, 0.55, 0.2, 0.15));
      // Würfelkopf: Salz ist heller als alles andere an ihm
      flaechen(KW, 0.8, 0.45, 0.35);
      // Glitzern auf der Oberseite (Salzkorn), ein Pixel, wandert im Leerlauf
      const gl = [[0.3, 0.25], [0.55, 0.4], [0.4, 0.55], [0.6, 0.3]][f % 4];
      P.auf(r(KW.ol[0] + (KW.or[0] - KW.ol[0]) * gl[0]), r(KW.o[1] + (KW.m[1] - KW.o[1]) * gl[1] + 1), 'r2');
      // Gesicht im Salz, auf der vorderen (linken) Fläche: Augenhöhlen, Nase, offener Mund, Augen
      const L = (a, b) => [KW.ol[0] + (KW.m[0] - KW.ol[0]) * a + (KW.ul[0] - KW.ol[0]) * b, KW.ol[1] + (KW.m[1] - KW.ol[1]) * a + (KW.ul[1] - KW.ol[1]) * b];
      const [e1x, e1y] = L(0.28, 0.32), [e2x, e2y] = L(0.7, 0.32), [nx_, ny_] = L(0.5, 0.55), [mx, my] = L(0.48, 0.78);
      P.el(e1x + 0.5, e1y + 0.5, 1.8, 1.4, 'k0', true); P.el(e2x + 0.5, e2y + 0.5, 1.8, 1.4, 'k0', true);
      P.auf(r(nx_), r(ny_), 'k0'); P.auf(r(nx_), r(ny_) - 1, 'k1');
      P.el(mx + 0.5, my + 0.5, p.angriff ? 2.2 : 1.6, p.angriff ? 1.6 : 1, 'k0', true);
      if (blick > 0) {
        P.glow((e1x + e2x) / 2 + 0.5, e1y + 0.5, 7 * blick, 0.7);
        P.set(r(e1x), r(e1y), 'kern'); P.set(r(e2x), r(e2y), blick > 1.2 ? 'kern' : 'glut');
        if (blick > 1.3) { P.set(r(e1x) + 1, r(e1y), 'glut'); P.set(r(e2x) + 1, r(e2y), 'glut'); }
        augen.push([r(e1x), r(e1y)], [r(e2x), r(e2y)]);
      }
      // Fellumhang: Zotteln entlang der Schulterlinie, Fransen am Saum
      for (let i = 0; i < 6; i++) P.auf(r(sx - 5 + i * 3.5), r(sy + 6 + i * 0.4 + (i % 2)), 'k0');
      for (let x = r(bx - 10); x <= bx + 12; x += 2) P.auf(x, r(by - 2 + ((x * 5) % 3)), 'k3');
      // Riemen des Tragsacks quer über die Schulter
      P.line(sx + 2, sy - 1, bx + 6, by - 8, 'k0', true);
      // Bundschuh-Schnürung
      P.auf(r(bx - 9), 110, 'k3'); P.auf(r(bx + 7), 110, 'k3');
      // Spanbündel brennt: inneres Licht, beleuchtet Hand und Sack von unten
      if (flamme > 0) {
        P.glow(flX + 0.5, flY + 3.5, 11 * flamme, 0.9);
        P.set(flX, flY, 'kern'); P.set(flX, flY - 1, flamme > 0.85 ? 'kern' : 'glut'); P.set(flX - 1, flY, 'glut'); P.set(flX + 1, flY, 'glut'); P.set(flX + 1, flY - 1, 'glut');
        if (flamme > 0.95) { P.set(flX, flY - 2, 'glut'); P.set(flX - 1, flY - 3, 'glutDim'); P.set(flX - 1, flY - 1, 'glut'); }
        if (flamme > 1.1) { P.set(flX + 1, flY - 3, 'glut'); P.set(flX, flY - 4, 'glutDim'); P.set(flX + 2, flY - 2, 'glutDim'); }
        P.set(flX - 2, flY + 1, 'glutDim'); P.set(flX + 2, flY + 1, 'glutDim');
        augen.push([flX, flY]);
      }
    };
    return { gruppen, details, augen };
  },
};
