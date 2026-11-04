// Der Mann im Salz (Salzstollen, Ergänzung). Ein Bergmann aus der Bronzezeit, drei Jahrtausende
// vor den Römern im Salz verschüttet und vom Salz bewahrt. Er trägt noch die Kraxe auf dem Rücken,
// aber was darin wächst, ist kein gebrochenes Salz: würfelige Kristalle, die aus ihm selbst kommen.
// Zwischen den Zähnen hält er einen brennenden Kienspan, wie die Hauer damals, und der brennt seit
// dreitausend Jahren. Gebeugt, spitze Fellmütze, kurzer Bronzepickel.
'use strict';
// Würfel als Polygon: Mitte, halbe Kantenlänge, Drehung
const wuerfel = (x, y, s, a) => [0, 1, 2, 3].map(i => [x + Math.cos(a + i * Math.PI / 2 + Math.PI / 4) * s * 1.414, y + Math.sin(a + i * Math.PI / 2 + Math.PI / 4) * s * 1.414]);
module.exports = {
  id: 'salzmann', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [44, 115], kopf: [52, 8], rimBis: 112,
  varianten: {
    // a: hoher Turm aus Würfeln über der Kraxe, Pickel in der Hand
    salzmann_a: { turm: [[60, 44, 7, 0.12], [66, 31, 6, -0.2], [57, 26, 5, 0.35], [68, 18, 4.5, 0.05], [61, 13, 3.5, -0.3], [72, 40, 4.5, 0.4], [52, 36, 4, -0.1]], pickel: true },
    // b: die Kristalle brechen breiter aus, schräg nach hinten, die Kraxe sieht man mehr
    salzmann_b: { turm: [[62, 44, 6.5, -0.15], [71, 36, 6, 0.3], [79, 28, 4.5, 0.1], [58, 31, 5, 0.25], [67, 24, 4, -0.25], [84, 39, 3.5, -0.3], [53, 40, 3.5, 0.5]], pickel: true, kraxe: 1 },
  },
  skizzen: {
    sil_turm: { turm: [[60, 44, 7, 0.12], [66, 31, 6, -0.2], [57, 26, 5, 0.35], [68, 18, 4.5, 0.05], [61, 13, 3.5, -0.3], [72, 40, 4.5, 0.4], [52, 36, 4, -0.1]], pickel: true },
    sil_buckel: { turm: [[62, 48, 10, 0], [72, 52, 7, 0.4], [54, 44, 6, 0.2]], pickel: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, flamme = 1, nick = 0, pk = 0, kipp = 0;
    // pk: Pickel 0 hängend, 1 hoch hinter dem Kopf ausgeholt, 2 nach vorn unten geschlagen
    if (p.idle) { atem = [0, 0, 1, 1][f]; flamme = [1, 0.8, 1.1, 0.9][f]; nick = [0, 0, 1, 0][f]; }
    if (p.angriff) { lean = [3, 4, -6, -3][f]; pk = [0.7, 1, 2, 1.6][f]; flamme = [1, 1.2, 1.4, 1.1][f]; nick = [-1, -2, 2, 1][f]; }
    if (p.treffer) { lean = [3, 2][f]; flamme = 0.6; nick = -1; kipp = 1; }
    if (p.tod) { fall = r(p.q * 14); lean = r(p.q * 4); flamme = Math.max(0, 1 - p.q * 3); kipp = r(p.q * 3); }
    const T = atem + fall, bx = 44 + lean, by = 66 + T; // Hüfte/Rumpfmitte
    // Beine: gebeugt, Lederwickel, kurze Schritte
    const beinV = glied([[bx - 4, by + 12], [bx - 10, by + 30 - fall / 2], [bx - 8, 112]], 3.4, 2.4, null);
    const beinH = glied([[bx + 6, by + 12], [bx + 10, by + 30 - fall / 2], [bx + 6, 112]], 3.4, 2.4, null);
    const fuesse = [E(bx - 11, 113, 4.5, 2.2, 'dunkel'), E(bx + 4, 113, 4.5, 2.2, 'dunkel')];
    // Rumpf: nach vorn gebeugt, Fellumhang mit Fransen
    const rumpf = Pg([[bx - 12, by - 14], [bx - 2, by - 22], [bx + 10, by - 20], [bx + 14, by - 6], [bx + 12, by + 8], [bx + 6, by + 16], [bx - 6, by + 16], [bx - 12, by + 6], [bx - 15, by - 4]], null, { rd: 2 });
    const umhangSaum = Pg([[bx - 13, by + 2], [bx + 13, by + 2], [bx + 12, by + 14], [bx + 9, by + 18], [bx + 6, by + 15], [bx + 2, by + 19], [bx - 2, by + 15], [bx - 6, by + 19], [bx - 9, by + 15], [bx - 13, by + 17], [bx - 14, by + 8]], 'dunkel', { rd: 0.5 });
    const guertel = C(bx - 13, by + 3, bx + 12, by + 2, 1.3, 1.3, 'dunkel');
    // Kopf vorgestreckt, spitze Fellmütze nach hinten gekippt
    const hx = bx - 16 + (nick > 0 ? 1 : 0), hy = by - 20 + nick;
    const hals = C(bx - 6, by - 16, hx + 2, hy + 3, 3.6, 3, null);
    const kopf = E(hx, hy, 5.5, 6, 'haut', { pf: 'bevel' });
    const kiefer = Pg([[hx - 6, hy + 1], [hx + 2, hy + 3], [hx + 1, hy + 8], [hx - 4, hy + 7]], 'haut', { rd: 0.8 });
    const muetze = Pg([[hx - 5, hy - 3], [hx + 6, hy - 4], [hx + 13, hy - 14], [hx + 15, hy - 16], [hx + 11, hy - 15], [hx + 1, hy - 9]], null, { rd: 1.2 });
    const krempe = C(hx - 6, hy - 3, hx + 6, hy - 4, 1.6, 1.6, 'dunkel');
    // Kraxe (Holzgestell) auf dem Rücken: zwei Stangen, Sack dazwischen
    const kr = v.kraxe || 0, kx = bx + 10, ky = by - 18;
    const stangen = [...glied([[kx - 4, by + 8], [kx - 2, ky - 2], [kx + 2, ky - 22 - kr * 2]], 1.4, 1.1, 'dunkel'), ...glied([[kx + 10, by + 4], [kx + 12, ky - 2], [kx + 15 + kr * 3, ky - 18 - kr * 2]], 1.4, 1.1, 'dunkel')];
    const sack = Pg([[kx - 4, ky + 10], [kx - 3, ky - 8], [kx + 4, ky - 14], [kx + 16, ky - 10], [kx + 17, ky + 2], [kx + 12, ky + 14], [kx + 2, ky + 16]], null, { rd: 2 });
    // Kristalle: Würfel, jeder eine eigene Gruppe (harte Kanten, Kontaktschatten dazwischen)
    const sh = p.treffer ? 1 : 0;
    const kristalle = v.turm.map(([x, y, s, a], i) => {
      const dx = lean + sh * (i % 2 ? 1 : -1) * (i > 2 ? 1 : 0) + (kipp && i > 3 ? kipp : 0), dy = T + (kipp && i > 3 ? kipp : 0);
      return Pg(wuerfel(x + dx, y + dy, s, a + (p.tod && i > 3 ? p.q * 0.6 : 0)), i % 3 === 0 ? 'haut' : null, { rd: 0.4, b: 2 });
    });
    // kleine Würfel auf Schulter und Unterarm: das Salz wächst aus ihm heraus
    const kleinK = [Pg(wuerfel(bx + 2, by - 22, 2.4, 0.4), 'haut', { rd: 0.2 }), Pg(wuerfel(bx - 3, by - 20, 1.8, -0.2), null, { rd: 0.2 })];
    // Arme: vorne mit Pickel, hinten am Tragriemen
    const schV = [bx - 8, by - 14];
    let hand, ell;
    if (pk === 0) { ell = [bx - 14, by - 2]; hand = [bx - 20, by + 6]; }
    else if (pk < 1.5) { ell = [bx - 2 - pk * 6, by - 26 - pk * 4]; hand = [bx + 4 - pk * 2, by - 36 - pk * 4]; }
    else { ell = [bx - 18, by - 12]; hand = [bx - 26, by - 2]; }
    const armV = [...glied([schV, ell, hand], 3.2, 2.2, null), E(hand[0], hand[1], 2.6, 2.4, 'haut')];
    const armH = glied([[bx + 6, by - 16], [bx + 4, by - 4], [bx + 9, by + 2]], 2.6, 2, null);
    // Bronzepickel: kurzer Stiel, Klinge quer, Spitze nach vorn
    const pick = [];
    if (v.pickel) {
      const wa = pk === 0 ? 1.25 : pk < 1.5 ? -1.9 - pk * 0.5 : 1.0, L = 20;
      const e = [hand[0] + Math.cos(wa) * L, hand[1] + Math.sin(wa) * L], s0 = [hand[0] - Math.cos(wa) * 4, hand[1] - Math.sin(wa) * 4];
      const nx = -Math.sin(wa), ny = Math.cos(wa);
      pick.push(C(s0[0], s0[1], e[0], e[1], 1.1, 1.2, 'dunkel', { pf: 'flat' }));
      const sp = pk >= 1.5 || pk === 0 ? -1 : 1; // Spitze zeigt in Schlagrichtung
      pick.push(Pg([[e[0] - nx * 2 * sp, e[1] - ny * 2 * sp], [e[0] + nx * 9 * sp + Math.cos(wa) * 2, e[1] + ny * 9 * sp + Math.sin(wa) * 2], [e[0] + nx * 1 * sp + Math.cos(wa) * 2.5, e[1] + ny * 1 * sp + Math.sin(wa) * 2.5], [e[0] - nx * 4 * sp + Math.cos(wa) * 1, e[1] - ny * 4 * sp + Math.sin(wa) * 1]], null, { rd: 0.4 }));
    }
    const pickHinten = pk > 0 && pk < 1.5;
    const gruppen = [
      { p: pickHinten ? pick : [], k: 0 },
      { p: stangen, k: 0.5, anker: [lean, T] },
      { p: [sack], k: 1, anker: [lean, T] },
      ...kristalle.map(k => ({ p: [k], k: 0, anker: [lean, T] })),
      { p: armH, k: 1, anker: [lean, T] },
      { p: [beinH, fuesse[1]].flat(), k: 1 },
      { p: [beinV, fuesse[0]].flat(), k: 1 },
      { p: [rumpf], k: 2, anker: [lean, T] },
      { p: [umhangSaum], k: 0, anker: [lean, T] },
      { p: [guertel], k: 0, noRim: true },
      ...kleinK.map(k => ({ p: [k], k: 0, anker: [lean, T] })),
      { p: [hals], k: 1 },
      { p: [muetze], k: 0.5, anker: [lean, T] },
      { p: [kopf, kiefer], k: 1.2, anker: [lean, T] },
      { p: [krempe], k: 0, noRim: true },
      { p: pickHinten ? [] : pick, k: 0 },
      { p: armV, k: 1.2, anker: [lean, T] },
    ];
    const augen = [];
    const details = P => {
      // Fellmütze: Strich-Struktur
      for (let i = 0; i < 4; i++) P.auf(r(hx + 2 + i * 3), r(hy - 6 - i * 2), 'k0');
      // Fransen am Umhang
      for (let x = r(bx - 12); x <= bx + 11; x += 2) P.auf(x, r(by + 12 + ((x * 7) % 3)), 'k0');
      // Kristallkanten innen: eine helle Kante je großem Würfel (Salz glänzt)
      v.turm.forEach(([x, y, s, a], i) => {
        if (s < 4) return; const dx = lean + (kipp && i > 3 ? kipp : 0), dy = T + (kipp && i > 3 ? kipp : 0);
        const w = wuerfel(x + dx, y + dy, s - 1.4, a);
        P.line(w[0][0], w[0][1], w[1][0], w[1][1], 'k3', true);
        if (i % 2 === 0) P.auf(r(x + dx), r(y + dy), 'k0');
      });
      // eingeschlossenes Licht: im untersten großen Würfel schimmert die Flamme mit
      const k0 = v.turm[0];
      if (flamme > 0) P.glow(k0[0] + lean, k0[1] + T + 1, 5 * flamme, 0.6);
      // Kienspan zwischen den Zähnen, Flamme vorn
      const sx0 = r(hx - 3), sy0 = r(hy + 4);
      for (let k = 0; k < 7; k++) P.set(sx0 - k, sy0 - (k >> 2), k < 2 ? 'k1' : 'k3');
      const fx = sx0 - 8, fy = sy0 - 2;
      if (flamme > 0) {
        P.glow(fx + 0.5, fy + 0.5, 9 * flamme, 0.8);
        P.set(fx, fy, 'kern'); P.set(fx, fy - 1, flamme > 0.85 ? 'kern' : 'glut'); P.set(fx - 1, fy, 'glut'); P.set(fx + 1, fy - 1, 'glut');
        if (flamme > 0.95) { P.set(fx, fy - 2, 'glut'); P.set(fx - 1, fy - 3, 'glutDim'); }
        if (flamme > 1.2) { P.set(fx - 1, fy - 2, 'glut'); P.set(fx + 1, fy - 3, 'glutDim'); P.set(fx - 2, fy - 1, 'glutDim'); }
        augen.push([fx, fy]);
      }
      // Gesicht: eingefallene Wange, Augen als zwei trübe Bernsteinpunkte
      P.auf(r(hx + 1), r(hy + 2), 'k1'); P.auf(r(hx + 2), r(hy + 3), 'k1');
      if (!p.tod || f < 1) { const ex = r(hx - 3), ey = r(hy - 1); P.set(ex, ey, 'glut'); P.set(ex + 3, ey, 'glutDim'); P.auf(ex, ey - 1, 'k0'); P.auf(ex + 3, ey - 1, 'k0'); P.auf(ex + 1, ey - 1, 'k0'); augen.push([ex, ey]); }
      // Salzkruste am Unterarm: helle Körner
      if (pk === 0 && !p.tod) { P.auf(r(hand[0] + 3), r(hand[1] - 4), 'r1'); P.auf(r(hand[0] + 5), r(hand[1] - 7), 'r1'); }
    };
    return { gruppen, details, augen };
  },
};
