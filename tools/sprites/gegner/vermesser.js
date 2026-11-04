// Der Vermesser (Namenlose Stadt, Ergänzung). Kam 1903 mit der Expedition, wie die Vermesserin
// und der Schlittenführer, und hat seither Türen gemessen, die zu breit sind. Er hat zu lange
// gemessen: Von der Hüfte abwärts ist er das Stativ seines Theodoliten, drei Holzbeine mit Messingschuhen.
// Im rechten Auge sitzt das Fernrohr. Er trägt noch den Tropenhelm und den Staubmantel.
// Falsch ist die Geometrie um ihn: Die Messlatte knickt in der Mitte, obwohl sie gerade ist,
// und sein Lot hängt schräg, als zöge unten etwas daran.
'use strict';
module.exports = {
  id: 'vermesser', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [50, 115], kopf: [46, 8], rimBis: 113,
  varianten: {
    // a: Messlatte mit Knick, Lot nach rechts gezogen
    vermesser_a: { spreiz: 1, knick: 5, lot: [12, 38], helm: 1 },
    // b: Beine enger und höher, das Lot hängt weiter schräg, Helm mit Nackenschutz
    vermesser_b: { spreiz: 0.8, knick: -4, lot: [16, 34], helm: 2, hoch: 4 },
  },
  skizzen: {
    sil_stativ: { spreiz: 1, knick: 5, lot: [12, 38], helm: 1 },
    sil_ohneLatte: { spreiz: 1.25, knick: 0, lot: [6, 40], helm: 1, ohneLatte: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, bay, saum } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, linse = 1, la = 0, lotS = 0, hem = 0, spr = 0;
    // la: Winkel der Messlatte (0 senkrecht, + nach hinten gekippt, - nach vorn geschlagen)
    if (p.idle) { atem = [0, 0, 1, 1][f]; linse = [1, 0.9, 1.1, 0.8][f]; lotS = [0, 1, 1, 0][f]; hem = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; la = [0.35, 0.55, -1.1, -0.6][f]; linse = [1.1, 1.3, 1.6, 1.2][f]; hem = [0, 1, 2, 1][f]; lotS = [1, 2, -1, 0][f]; }
    if (p.treffer) { lean = [3, 2][f]; linse = 0.5; la = 0.15; lotS = 2; }
    if (p.tod) { fall = r(p.q * 22); spr = p.q * 10; linse = Math.max(0, 1 - p.q * 3); la = p.q * 0.9; lean = r(p.q * 3); }
    const H = v.hoch || 0, T = atem + fall, sp = v.spreiz;
    const kx = 50 + lean, ky = 66 - H + T; // Stativkopf
    // Stativ: drei Beine, das mittlere hinten (dunkler), Messingschuhe
    const fussL = [kx - 22 * sp - spr, 113], fussR = [kx + 20 * sp + spr, 113], fussM = [kx + 4, 109];
    const bein = (z) => { const m = [(kx + z[0]) / 2 + (z[0] < kx ? -1 : 1), (ky + z[1]) / 2]; return [...glied([[kx, ky], m, [z[0], z[1] - 4]], 2.2, 1.5, null), C(z[0], z[1] - 5, z[0] + (z[0] < kx ? -1 : 1) * 0.5, z[1], 1.2, 0.6, 'dunkel')]; };
    const beinM = bein(fussM), beinL = bein(fussL), beinR = bein(fussR);
    const kopfplatte = E(kx, ky + 1, 6, 2.2, 'dunkel');
    // Staubmantel: schmaler Rumpf, die Schöße teilen sich und hängen in drei Bahnen über die Stativbeine
    const mx = kx - 2, my = 40 - H + T; // Schulterlinie
    const rumpf = Pg([[mx - 9, my], [mx + 8, my - 1], [mx + 11, my + 5], [mx + 10, my + 21], [mx - 10, my + 22], [mx - 11, my + 5]], null, { rd: 1.2 });
    const schoss = (x0, x1, z, ph) => { const unten = ky + 14 + (ph % 2); const zx = z[0] < kx ? -1 : z[0] > kx + 6 ? 1 : 0; return Pg([[x0, my + 19], [x1, my + 19], [x1 + zx * 4 + 1, unten - 2], [(x0 + x1) / 2 + zx * 5, unten + 3], [x0 + zx * 4 - 1, unten - 1]], null, { rd: 0.8 }); };
    const schoesse = [schoss(mx - 11, mx - 3, fussL, hem), schoss(mx - 3, mx + 4, fussM, hem + 1), schoss(mx + 4, mx + 11, fussR, hem)];
    const kragen = Pg([[mx - 8, my - 1], [mx + 8, my - 2], [mx + 5, my + 5], [mx, my + 8], [mx - 5, my + 5]], 'dunkel', { rd: 0.8 });
    const guertel = C(mx - 11, my + 19, mx + 11, my + 18, 1.3, 1.3, 'dunkel');
    // Kopf mit Tropenhelm, aus dem rechten Auge wächst das Fernrohr
    const hx = mx - 2, hy = my - 9 + (p.idle && f === 3 ? 1 : 0);
    const hals = C(mx, my, hx + 1, hy + 3, 3, 2.6, 'haut');
    const kopf = Pg([[hx - 5, hy - 4], [hx + 5, hy - 4], [hx + 5, hy + 3], [hx + 2, hy + 7], [hx - 3, hy + 7], [hx - 6, hy + 2]], 'haut', { rd: 1 });
    const helm = E(hx + 1, hy - 6, 7, 5, null, { pf: 'bevel' });
    const krempe = v.helm === 2 ? Pg([[hx - 10, hy - 3], [hx + 9, hy - 4], [hx + 13, hy + 2], [hx + 7, hy - 1]], null, { rd: 0.6 }) : C(hx - 10, hy - 3, hx + 11, hy - 3, 1.4, 1.2, null);
    const rohr = [C(hx - 3, hy, hx - 18, hy - 2, 2.3, 2.6, null), E(hx - 18, hy - 2, 1.6, 3, 'dunkel'), C(hx - 9, hy - 1, hx - 10, hy - 1, 2.9, 2.9, 'dunkel')];
    // vorderer Arm hält das Lot; die Schnur hängt schräg zu dir hin
    const hand = [mx - 15, my + 14 + (p.angriff ? [0, -1, 2, 1][f] : 0)];
    const armV = [...glied([[mx - 8, my + 2], [mx - 14, my + 7], hand], 3, 2.2, null), E(hand[0], hand[1], 2.4, 2.2, 'haut')];
    const lotP = [hand[0] - v.lot[0] - lotS, hand[1] + v.lot[1]];
    const lot = Pg([[lotP[0] - 2.5, lotP[1] - 2], [lotP[0] + 2.5, lotP[1] - 2], [lotP[0], lotP[1] + 5]], null, { rd: 0.6 });
    // hinterer Arm hält die Messlatte; sie knickt in der Mitte, obwohl sie gerade ist
    const handH = [mx + 15 - (la < 0 ? 10 : 0) + (la > 0 ? 3 : 0), my + 12 - (la > 0 ? 6 : 0) - (la < 0 ? 4 : 0)];
    const armH = [...glied([[mx + 8, my + 2], [mx + 16 - (la < 0 ? 6 : 0), my + 6 - (la > 0 ? 3 : 0)], handH], 2.8, 2.1, null), E(handH[0], handH[1], 2.3, 2.1, 'haut')];
    const latte = [], lattePkt = [];
    if (!v.ohneLatte) {
      const dir = [Math.sin(la), -Math.cos(la)];
      const unten = [handH[0] - dir[0] * 44, handH[1] - dir[1] * 44], mitte = [handH[0] + dir[0] * 12, handH[1] + dir[1] * 12];
      const kn = v.knick, oben0 = [mitte[0] + kn * Math.cos(la), mitte[1] + kn * Math.sin(la)], oben = [oben0[0] + dir[0] * 40, oben0[1] + dir[1] * 40];
      latte.push(C(unten[0], unten[1], mitte[0], mitte[1], 1.7, 1.7, null, { pf: 'flat' }), C(oben0[0], oben0[1], oben[0], oben[1], 1.7, 1.7, null, { pf: 'flat' }));
      lattePkt.push(unten, mitte, oben0, oben);
    }
    const gruppen = [
      { p: latte.length && la >= 0 ? latte : [], k: 0 },
      { p: armH, k: 1, anker: [lean, T] },
      { p: beinM, k: 0.5, tone: -0.15 },
      { p: beinR, k: 0.5 },
      { p: [schoesse[1]], k: 0, anker: [lean, T] },
      { p: [schoesse[2]], k: 0, anker: [lean, T] },
      { p: [kopfplatte], k: 0, noRim: true },
      { p: beinL, k: 0.5 },
      { p: [schoesse[0]], k: 0, anker: [lean, T] },
      { p: [rumpf], k: 1.5, anker: [lean, T] },
      { p: [kragen], k: 0, anker: [lean, T] },
      { p: [guertel], k: 0, noRim: true },
      { p: [hals], k: 0 },
      { p: [kopf], k: 0.5, anker: [lean, T] },
      { p: [helm, krempe], k: 1, anker: [lean, T] },
      { p: rohr, k: 0.6, anker: [lean, T] },
      { p: [lot], k: 0 },
      { p: armV, k: 1.2, anker: [lean, T] },
      { p: latte.length && la < 0 ? latte : [], k: 0 },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Messlatte: Felder abwechselnd hell und dunkel (Teilung), Messingkappen
      if (lattePkt.length) {
        const seg = (a, b, off) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])); for (let k = 0; k <= n; k++) { const x = a[0] + (b[0] - a[0]) * k / n, y = a[1] + (b[1] - a[1]) * k / n; const feld = Math.floor((k + off) / 5) % 2; P.auf(r(x), r(y), feld ? 'r1' : 'k1'); P.auf(r(x) - 1, r(y), feld ? 'k3' : 'k0'); P.auf(r(x) + 1, r(y), feld ? 'r2' : 'k2'); } };
        seg(lattePkt[0], lattePkt[1], 0); seg(lattePkt[2], lattePkt[3], 2);
        // Ziffern-Kerben an der Latte (Teilstriche)
        for (const q of [lattePkt[0], lattePkt[3]]) { P.auf(r(q[0]), r(q[1]), 'r2'); }
      }
      // Mantel: Knopfleiste, Taschenklappe, Faltenwurf der Schöße mit Lichtkante links der Falte
      for (let y = r(my + 6); y < my + 19; y += 3) P.auf(r(mx - 2), y, 'k3');
      P.line(mx + 3, my + 12, mx + 9, my + 12, 'k0', true); P.line(mx + 3, my + 11, mx + 9, my + 11, 'k3', true);
      // Schöße: je eine Lichtkante oben rechts und eine Falte in der Mitte
      schoesse.forEach(sc => { const q = sc.v; P.line(q[1][0] - 1, q[1][1] + 2, q[2][0] - 1, q[2][1] - 2, 'k3', true); P.line((q[0][0] + q[1][0]) / 2, q[0][1] + 3, q[3][0], q[3][1] - 3, 'k0', true); });
      // Rumpf: Schulternaht mit Lichtkante, Revers, Riemen der Instrumententasche quer über die Brust
      P.line(mx - 8, my + 1, mx + 7, my, 'k3', true);
      P.line(mx - 5, my + 5, mx - 1, my + 12, 'k3', true); P.line(mx + 5, my + 4, mx + 1, my + 12, 'k0', true);
      P.line(mx - 9, my + 3, mx + 9, my + 17, 'k0', true); P.line(mx - 9, my + 2, mx + 9, my + 16, 'k3', true);
      P.el(mx + 8, my + 18, 2.5, 2, 'k3', true); P.auf(r(mx + 8), r(my + 18), 'glutDim');
      // Tropenhelm: Band und Naht
      P.line(hx - 5, hy - 4, hx + 7, hy - 5, 'k0', true); P.line(hx - 4, hy - 5, hx + 6, hy - 6, 'k3', true);
      P.line(hx + 1, hy - 10, hx + 1, hy - 6, 'k1', true);
      // Gesicht: Schnurrbart, das linke Auge zugekniffen
      P.line(hx - 4, hy + 4, hx, hy + 4, 'k0', true); P.auf(r(hx + 2), r(hy - 1), 'k0'); P.auf(r(hx + 3), r(hy - 1), 'k0');
      // Fernrohr: Messingringe, die Linse leuchtet (Auge)
      P.line(hx - 13, hy - 4, hx - 13, hy + 1, 'r1', true); P.line(hx - 6, hy - 3, hx - 6, hy + 2, 'k3', true);
      if (linse > 0) {
        const lx = r(hx - 19), ly = r(hy - 2);
        P.glow(lx + 0.5, ly + 0.5, 7 * linse, 0.9);
        P.set(lx, ly, 'kern'); P.set(lx, ly - 1, 'glut'); P.set(lx, ly + 1, 'glut'); if (linse > 1.2) { P.set(lx - 1, ly, 'glut'); P.set(lx, ly - 2, 'glutDim'); P.set(lx, ly + 2, 'glutDim'); }
        augen.push([lx, ly]);
      }
      // Schnur des Lots: schräg, als zöge unten etwas daran; das Lot glänzt
      for (let k = 0, n = Math.ceil(Math.hypot(lotP[0] - hand[0], lotP[1] - hand[1])); k < n - 2; k++) P.set(hand[0] + (lotP[0] - hand[0]) * k / n, hand[1] + 1 + (lotP[1] - 3 - hand[1]) * k / n, k % 3 === 2 ? 'k3' : 'r1');
      if (!p.tod) { P.set(r(lotP[0]) + 1, r(lotP[1]) - 1, 'glut'); P.set(r(lotP[0]), r(lotP[1]) + 3, 'glutDim'); augen.push([r(lotP[0]) + 1, r(lotP[1]) - 1]); }
      // Stativkopf: Messingschrauben, Beinklemmen
      P.auf(r(kx - 3), r(ky + 1), 'glutDim'); P.auf(r(kx + 3), r(ky + 1), 'k3');
      for (const z of [fussL, fussR]) { const q = [(kx + z[0]) / 2 + (z[0] < kx ? -1 : 1), (ky + z[1]) / 2]; P.auf(r(q[0]), r(q[1]), 'k3'); P.auf(r(q[0]), r(q[1]) + 1, 'k0'); }
    };
    return { gruppen, details, augen };
  },
};
