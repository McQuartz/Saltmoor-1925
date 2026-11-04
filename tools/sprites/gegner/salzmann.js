// Der Mann im Salz (Salzstollen, Ergänzung). Ein Bergmann aus der Bronzezeit, lange vor den Römern
// im Salz verschüttet und vom Salz bewahrt. Er trägt noch die Kraxe auf dem Rücken, aber was darauf
// wächst, ist kein gebrochenes Salz: würfelige Kristalle, die aus ihm selbst kommen. Er ist tot,
// die Augen geschlossen. Wach ist, was im größten Würfel sitzt: zwei Augen im Salz.
// Zwischen den Zähnen hält er einen brennenden Kienspan, wie die Hauer damals, und der brennt noch.
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
  id: 'salzmann', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [42, 115], kopf: [60, 6], rimBis: 112,
  varianten: {
    // a: die Kristalle türmen sich steil über ihm
    salzmann_a: { turm: [[76, 22, 5, 0.3], [64, 22, 6, -0.1], [74, 36, 8.5, 0.15], [83, 49, 5, -0.2], [62, 33, 6.5, 0.05], [55, 47, 11, 0.06]], augenIn: 5 },
    // b: die Kristalle brechen breiter und flacher nach hinten aus, die Augen sitzen im hinteren Würfel
    salzmann_b: { turm: [[85, 34, 4.5, 0.1], [70, 26, 5.5, -0.25], [80, 44, 7.5, 0.22], [64, 36, 8, -0.05], [56, 48, 10, -0.08]], augenIn: 4 },
  },
  skizzen: {
    sil_turm: { turm: [[76, 22, 5, 0.3], [64, 22, 6, -0.1], [74, 36, 8.5, 0.15], [83, 49, 5, -0.2], [62, 33, 6.5, 0.05], [55, 47, 11, 0.06]], augenIn: 5 },
    sil_breit: { turm: [[85, 34, 4.5, 0.1], [70, 26, 5.5, -0.25], [80, 44, 7.5, 0.22], [64, 36, 8, -0.05], [56, 48, 10, -0.08]], augenIn: 4 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, flamme = 1, nick = 0, pk = 0, kipp = 0, blick = 1;
    // pk: Pickel 0 hängend, 1 hoch über der Schulter ausgeholt, 2 nach vorn unten geschlagen
    if (p.idle) { atem = [0, 0, 1, 1][f]; flamme = [1, 0.8, 1.1, 0.9][f]; nick = [0, 0, 1, 0][f]; blick = [1, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, 4, -6, -3][f]; pk = [0.6, 1, 2, 1.7][f]; flamme = [1, 1.2, 1.4, 1.1][f]; nick = [-1, -2, 2, 1][f]; blick = [1, 1.4, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; flamme = 0.6; nick = -1; kipp = 1; blick = 0.7; }
    if (p.tod) { fall = r(p.q * 12); lean = r(p.q * 4); flamme = Math.max(0, 1 - p.q * 3); kipp = r(p.q * 4); blick = 0; }
    const T = atem + fall, bx = 40 + lean, by = 74 + T; // Hüfte
    // Beine: gebeugt, Lederwickel
    const beinV = glied([[bx - 3, by + 4], [bx - 10, by + 22 - fall / 2], [bx - 7, 112]], 3.6, 2.4, null);
    const beinH = glied([[bx + 7, by + 2], [bx + 13, by + 22 - fall / 2], [bx + 9, 112]], 3.6, 2.4, null);
    const fuesse = [E(bx - 10, 113, 4.5, 2.2, 'dunkel'), E(bx + 7, 113, 4.5, 2.2, 'dunkel')];
    // Rumpf: tief nach vorn gebeugt, Fellumhang mit Fransen
    const sx = bx - 9, sy = by - 18; // vordere Schulter
    const rumpf = Pg([[sx - 4, sy + 1], [sx + 2, sy - 5], [bx + 8, by - 20], [bx + 14, by - 12], [bx + 13, by + 1], [bx + 7, by + 6], [bx - 4, by + 6], [bx - 8, by - 2], [sx - 4, sy + 9]], null, { rd: 2 });
    const umhang = Pg([[bx - 8, by - 7], [bx + 14, by - 5], [bx + 14, by + 5], [bx + 11, by + 11], [bx + 8, by + 8], [bx + 4, by + 12], [bx, by + 8], [bx - 4, by + 12], [bx - 7, by + 8], [bx - 10, by + 10], [bx - 10, by + 1]], 'dunkel', { rd: 0.5 });
    const guertel = C(bx - 10, by - 5, bx + 14, by - 4, 1.2, 1.2, 'dunkel');
    // Kopf hängt vor den Schultern, Profil: Stirn, Nase, Kiefer; runde Fellkappe
    const hx = sx - 8 + (nick > 0 ? 1 : 0), hy = sy + 3 + nick;
    const hals = C(sx + 2, sy + 1, hx + 3, hy, 3.6, 2.8, null);
    const kopf = Pg([[hx - 2, hy - 5], [hx + 4, hy - 5], [hx + 6, hy], [hx + 4, hy + 6], [hx - 1, hy + 8], [hx - 5, hy + 7], [hx - 6, hy + 3], [hx - 8, hy + 1], [hx - 6, hy - 1]], 'haut', { rd: 0.8 });
    const muetze = Pg([[hx - 6, hy - 2], [hx - 4, hy - 7], [hx + 1, hy - 9], [hx + 6, hy - 8], [hx + 9, hy - 6], [hx + 7, hy - 1], [hx + 2, hy - 2]], null, { rd: 1.4 });
    // Kraxe: zwei Stangen, die zwischen den Kristallen herausragen
    const kx = bx + 6, ky = by - 22;
    const stangen = [...glied([[kx - 2, by + 4], [kx + 2, ky], [kx + 8, ky - 34]], 1.3, 1, 'dunkel'), ...glied([[kx + 10, by], [kx + 16, ky + 2], [kx + 28, ky - 22]], 1.3, 1, 'dunkel')];
    const sack = Pg([[kx - 4, ky + 14], [kx - 4, ky - 2], [kx + 4, ky - 8], [kx + 18, ky - 4], [kx + 19, ky + 8], [kx + 12, ky + 18], [kx + 2, ky + 18]], null, { rd: 2 });
    // Kristalle: Würfel, jeder eine eigene Gruppe (harte Kanten, Kontaktschatten dazwischen)
    const W = v.turm.map(([x, y, s, a], i) => {
      const lose = s < 7 ? 1 : 0;
      const dx = lean + (kipp && lose ? kipp : 0) + (p.treffer && f === 0 && lose ? (i % 2 ? 1 : -1) : 0), dy = T + (kipp && lose ? kipp : 0);
      return wuerfel(x + dx, y + dy, s, a + (p.tod && lose ? p.q * 0.5 : 0));
    });
    // kleine Würfel an Nacken und Hüfte: das Salz wächst aus ihm heraus
    const WK = [wuerfel(sx + 3, sy - 5, 2.6, 0.3), wuerfel(bx + 14, by - 1, 2.4, 0.5), wuerfel(sx - 1, sy + 10, 1.8, -0.3)];
    // Arme: vorne mit Pickel, hinten am Tragriemen
    let hand, ell;
    if (pk === 0) { ell = [sx - 3, sy + 12]; hand = [sx - 7, sy + 22]; }
    else if (pk < 1.5) { ell = [sx + 3 - pk * 4, sy - 6 - pk * 4]; hand = [sx + 10 - pk * 4, sy - 16 - pk * 4]; }
    else { ell = [sx - 10, sy + 4]; hand = [sx - 18, sy + 12]; }
    const armV = [...glied([[sx + 1, sy + 1], ell, hand], 3.3, 2.2, null), E(hand[0], hand[1], 2.7, 2.4, 'haut')];
    const armH = glied([[bx + 9, by - 16], [bx + 8, by - 5], [bx + 12, by + 2]], 2.6, 2, null);
    // Bronzepickel: Stiel, Klinge quer mit Spitze in Schlagrichtung
    const pick = [];
    {
      const wa = pk === 0 ? 1.35 : pk < 1.5 ? -1.6 - pk * 0.7 : 0.75, L = 21;
      const e = [hand[0] + Math.cos(wa) * L, hand[1] + Math.sin(wa) * L], s0 = [hand[0] - Math.cos(wa) * 4, hand[1] - Math.sin(wa) * 4];
      const nx = -Math.sin(wa), ny = Math.cos(wa), dx = Math.cos(wa), dy = Math.sin(wa);
      pick.push(C(s0[0], s0[1], e[0], e[1], 1.3, 1.4, 'dunkel', { pf: 'flat' }));
      const sp = pk >= 1.5 || pk === 0 ? 1 : -1; // Spitze zeigt in Schlagrichtung
      pick.push(Pg([[e[0] - nx * 3 * sp - dx, e[1] - ny * 3 * sp - dy], [e[0] - nx * 3 * sp + dx * 3, e[1] - ny * 3 * sp + dy * 3], [e[0] + nx * 10 * sp + dx * 1, e[1] + ny * 10 * sp + dy * 1], [e[0] + nx * 1 * sp - dx * 1.5, e[1] + ny * 1 * sp - dy * 1.5]], null, { rd: 0.3 }));
    }
    const pickHinten = pk > 0 && pk < 1.5;
    const gruppen = [
      { p: pickHinten ? pick : [], k: 0 },
      { p: stangen, k: 0.5, anker: [lean, T] },
      { p: [sack], k: 1, anker: [lean, T] },
      ...W.map(w => ({ p: [Pg(w.umriss, null, { rd: 0.3, b: 1.5 })], k: 0, anker: [lean, T] })),
      { p: armH, k: 1, anker: [lean, T] },
      { p: [beinH, fuesse[1]].flat(), k: 1 },
      { p: [beinV, fuesse[0]].flat(), k: 1 },
      { p: [rumpf], k: 2, anker: [lean, T] },
      { p: [umhang], k: 0, anker: [lean, T] },
      { p: [guertel], k: 0, noRim: true },
      ...WK.map(w => ({ p: [Pg(w.umriss, null, { rd: 0.2 })], k: 0, anker: [lean, T] })),
      { p: [hals], k: 1 },
      { p: [muetze], k: 0.5, anker: [lean, T] },
      { p: [kopf], k: 0, anker: [lean, T] },
      { p: pickHinten ? [] : pick, k: 0 },
      { p: armV, k: 1.2, anker: [lean, T] },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Würfelflächen: oben hell gedithert, rechts mittel, links dunkel; Kanten dazwischen
      const flaechen = (w, gross) => {
        const xs = w.umriss.map(q => q[0]), ys = w.umriss.map(q => q[1]);
        for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++) {
          if (!B(x, y)) continue; const X = x + 0.5, Y = y + 0.5;
          if (inPoly(X, Y, w.oben)) P.set(x, y, A.bay(x, y) < 0.6 ? 'k3' : 'k2');
          else if (inPoly(X, Y, w.rechts)) P.set(x, y, A.bay(x, y) < 0.25 ? 'k3' : 'k2');
          else if (inPoly(X, Y, w.links)) P.set(x, y, A.bay(x, y) < 0.2 ? 'k2' : 'k1');
        }
        // Grat zwischen oben und links dunkel, Grat oben-rechts hell (Gegenlicht trifft die Kante)
        P.line(w.ol[0], w.ol[1], w.m[0], w.m[1], 'k0', true); P.line(w.m[0], w.m[1], w.u[0], w.u[1], gross ? 'k0' : 'k1', true);
        P.line(w.m[0], w.m[1], w.or[0], w.or[1], 'r1', true);
      };
      W.forEach((w, i) => flaechen(w, v.turm[i][2] >= 6));
      WK.forEach(w => flaechen(w, false));
      // die Augen im Salz: im markierten Würfel, auf der linken Fläche, schauen nach vorn
      const wa = W[v.augenIn];
      if (blick > 0) {
        const ax = r((wa.ol[0] + wa.m[0] + wa.u[0] + wa.ul[0]) / 4), ay = r((wa.ol[1] + wa.m[1] + wa.u[1] + wa.ul[1]) / 4);
        P.glow(ax + 1, ay + 0.5, 6 * blick, 0.8);
        P.set(ax - 1, ay, 'kern'); P.set(ax, ay, 'glut'); P.set(ax + 3, ay, 'glut'); P.set(ax + 2, ay, blick > 1.2 ? 'kern' : 'glutDim');
        if (blick > 1.3) { P.set(ax - 1, ay - 1, 'glutDim'); P.set(ax + 3, ay - 1, 'glutDim'); }
        augen.push([ax - 1, ay], [ax + 3, ay]);
      }
      // Fellmütze: Strichstruktur, Mützenrand
      for (let i = 0; i < 5; i++) P.auf(r(hx - 3 + i * 2), r(hy - 6 - i * 1.4), i % 2 ? 'k0' : 'k1');
      P.line(hx - 5, hy - 3, hx + 6, hy - 3, 'k1', true);
      // Fransen am Umhang
      for (let x = r(bx - 9); x <= bx + 13; x += 2) P.auf(x, r(by + 7 + ((x * 7) % 3)), 'k0');
      // Gesicht: geschlossenes Lid, eingefallene Wange, Ohr
      P.auf(r(hx - 3), r(hy), 'k0'); P.auf(r(hx - 2), r(hy), 'k0'); P.auf(r(hx - 1), r(hy + 1), 'k1');
      P.auf(r(hx + 1), r(hy + 3), 'k1'); P.auf(r(hx + 2), r(hy + 4), 'k1'); P.auf(r(hx + 3), r(hy), 'k1');
      // Kienspan zwischen den Zähnen, Flamme vorn
      const s0x = r(hx - 6), s0y = r(hy + 5);
      for (let k = 0; k < 6; k++) P.set(s0x - k, s0y - (k >> 2), k < 2 ? 'k1' : 'k3');
      const fx = s0x - 7, fy = s0y - 2;
      if (flamme > 0) {
        P.glow(fx + 0.5, fy + 0.5, 10 * flamme, 0.9);
        P.set(fx, fy, 'kern'); P.set(fx, fy - 1, flamme > 0.85 ? 'kern' : 'glut'); P.set(fx - 1, fy, 'glut'); P.set(fx + 1, fy - 1, 'glut');
        if (flamme > 0.95) { P.set(fx, fy - 2, 'glut'); P.set(fx - 1, fy - 3, 'glutDim'); }
        if (flamme > 1.2) { P.set(fx - 1, fy - 2, 'glut'); P.set(fx + 1, fy - 3, 'glutDim'); P.set(fx - 2, fy - 1, 'glutDim'); }
        // Flammenschein auf Kinn und Hand
        P.auf(r(hx - 5), r(hy + 6), 'glutDim'); P.auf(r(hx - 4), r(hy + 7), 'k3');
        augen.push([fx, fy]);
      }
      // Bronzeklinge: eine helle Schneide
      // Salzkörner auf dem Unterarm
      if (!p.tod) { P.auf(r(ell[0] - 1), r(ell[1] + 2), 'r1'); P.auf(r((ell[0] + hand[0]) / 2), r((ell[1] + hand[1]) / 2), 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
