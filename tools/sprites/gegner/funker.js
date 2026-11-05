// Die Funkstation am Pol: Der Funker. Der Funker der Expedition von 1912, der die Wache am Empfänger hatte,
// als das Signal zum ersten Mal kam. Der Kopfhörer ist ihm eingewachsen: Der Bügel liegt unter der Haut wie ein
// zweiter Scheitel, die Muschel ist Teil des Schädels und glüht, und aus ihr läuft das Kabel den Rücken hinab
// bis ins Eis wie ein Schwanz. Er drückt die Hand an die Muschel und horcht. Was er hört, gibt er weiter.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'funker', biom: 'funkstation', zone: 'funkstation', w: 96, h: 120, fuss: [50, 115], kopf: [42, 10], rimBis: 113,
  varianten: {
    // a: Bleistift und Block, das Kabel läuft frei in den Schnee und rollt sich dort
    funker_a: { tornister: false, block: true },
    // b: Tornister-Empfänger auf dem Rücken (eine Röhre glüht im Fenster), Stabantenne; das Kabel geht in den Kasten
    funker_b: { tornister: true, block: false },
  },
  // Silhouetten-Proben (nicht gebaut): Mann mit Kopfhörer, Arme unten, Kabel gerade (las sich als
  // gewöhnlicher Polarforscher, der Kopfhörer verschwand im Kopf). Genommen: Hand an der Muschel, Ellbogen
  // nach oben, Kabel als Schwanz bis zum Boden.
  proben: { probe_gerade: { tornister: false, block: false, gerade: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, kopfH = 0, armV = 0, horch = 1;
    // armV: vorderer Arm 0 unten mit Block, 1 hochgezogen (ausgeholt), 2 nach vorn gestoßen
    if (p.idle) { atem = [0, 0, 1, 1][f]; kopfH = [0, 0, 0, 1][f]; horch = [1, 1, 0.8, 1][f]; }
    if (p.angriff) { lean = [2, 4, -7, -3][f]; armV = [0.6, 1, 2, 1.4][f]; kopfH = [-1, -2, 1, 0][f]; }
    if (p.treffer) { lean = [3, 2][f]; kopfH = -1; }
    if (p.tod) { fall = r(p.q * 24); lean = r(p.q * 5); horch = 0; }
    const T = atem + fall, L = lean;
    // Beine in Fellstiefeln, leicht eingeknickt
    const knick = p.tod ? p.q * 6 : 0;
    const beinV = glied([[45 + L * 0.3, 90 + T], [42 + L * 0.2 - knick, 102 + T * 0.5], [41, 111]], 3.6, 3, null);
    const beinH = glied([[57 + L * 0.3, 90 + T], [60, 102 + T * 0.5], [60, 111]], 3.6, 3, null);
    const stiefel = [E(39, 112.5, 5.5, 3, null), E(60, 112.5, 5, 3, null), C(41, 106, 41, 110, 3.6, 3.8, null), C(60, 106, 60, 110, 3.4, 3.6, null)];
    // Anorak: gebeugter Rücken, Saum mit Fell, Gürtel
    const sx = 50 + L, sy = 40 + T;
    const latz = Pg([[sx - 12, sy + 4], [sx - 2, sy + 1], [sx - 1, sy + 30], [sx - 14, sy + 30]], 'haut', { rd: 1 });
    const anorak = Pg([[sx - 11, sy + 2], [sx - 4, sy - 3], [sx + 6, sy - 4], [sx + 13, sy + 2], [sx + 17, sy + 14], [sx + 18, sy + 34], [sx + 19, sy + 52], ...saum(sx + 20, sx - 19, sy + 52, 7, 3, 5, 0), [sx - 19, sy + 51], [sx - 15, sy + 32], [sx - 14, sy + 14]], null, { rd: 1.6 });
    const guertel = C(sx - 15, sy + 32, sx + 18, sy + 32, 1.6, 1.6, 'dunkel');
    const tasche = Pg([[sx - 9, sy + 33], [sx - 3, sy + 33], [sx - 3, sy + 41], [sx - 9, sy + 41]], null, { rd: 0.6 });
    // Kragen: Fellwulst der zurückgeschlagenen Kapuze im Nacken
    const kx = 39 + L * 1.15, ky = 27 + T + kopfH;
    const kapuze = [E(sx + 6, sy - 3, 8, 5, null), E(sx + 11, sy - 6, 4, 3.5, null)];
    const hals = C(sx - 2, sy - 2, kx + 2, ky + 5, 4.2, 3.2, 'haut');
    // Kopf zur Hand geneigt, das Gesicht nach links: Stirn, Nase, offener Kiefer; Muschel hinten am Schädel
    const kopf = [E(kx, ky, 7.5, 8.5, 'haut', { pf: 'bevel' }), E(kx - 5, ky + 5, 3.6, 3.4, 'haut'), C(kx - 6, ky - 1, kx - 10, ky + 2.5, 1.8, 1.1, 'haut'), C(kx - 7, ky + 7, kx - 8, ky + 10, 1.6, 1.2, 'haut')];
    const mx = kx + 7, my = ky - 1;
    const muschel = [E(mx, my, 5, 6, null)];
    const buegel = v.gerade ? [] : glied([[mx - 1, my - 5], [kx + 2, ky - 10], [kx - 5, ky - 9]], 1.5, 1.2, null);
    // Hinterer Arm: Ellbogen seitlich nach außen, die Hand flach auf der Muschel
    const schH = [sx + 9, sy + 2];
    const ellH = v.gerade ? [sx + 15, sy + 18] : [sx + 19 + L * 0.1, sy - 2 + horch * 2];
    const handH = v.gerade ? [sx + 15, sy + 30] : [mx + 3, my + 2];
    const armHinten = [...glied([schH, ellH, handH], 3.8, 2.8, null), E(handH[0], handH[1], 2.8, 3.2, 'haut')];
    // Vorderer Arm: Block und Bleistift vor der Brust; holt aus und stößt die Hand vor
    const schV = [sx - 8, sy + 3];
    let ellV, handV;
    if (armV < 0.5) { ellV = [sx - 13, sy + 16]; handV = [sx - 17, sy + 22]; }
    else if (armV < 1.5) { const k = armV - 0.5; ellV = [sx - 16 + k * 2, sy + 2 - k * 6]; handV = [sx - 16 + k * 4, sy - 12 - k * 8]; }
    else { const k = armV - 1.5; ellV = [sx - 20 + k * 6, sy + 4]; handV = [sx - 31 + k * 10, sy + 2 + k * 6]; }
    const armVorn = [...glied([schV, ellV, handV], 3.8, 2.8, null), E(handV[0], handV[1], 2.6, 2.4, 'haut')];
    const finger = armV >= 1.5 ? [-0.5, 0, 0.5].map(d => C(handV[0], handV[1], handV[0] - 5 * Math.cos(d), handV[1] + 5 * Math.sin(d) - 1, 0.8, 0.6, 'haut')) : [];
    const block = v.block && armV < 0.5 ? [Pg([[handV[0] - 5, handV[1] - 2], [handV[0] + 1, handV[1] - 4], [handV[0] + 3, handV[1] + 4], [handV[0] - 3, handV[1] + 6]], 'haut', { rd: 0.3 }), C(handV[0] - 1, handV[1] - 1, handV[0] - 7, handV[1] - 7, 0.6, 0.5, null)] : [];
    // Kabel: aus der Muschel den Rücken hinab, am Boden gerollt (a) oder in den Tornister (b)
    const kab = [];
    let tornister = [], antenne = [];
    const tx = sx + 17, ty = sy + 4;
    if (v.tornister) {
      tornister = [Pg([[tx - 4, ty - 6], [tx + 11, ty - 8], [tx + 13, ty + 22], [tx - 3, ty + 25]], null, { rd: 1 })];
      antenne = [C(tx + 9, ty - 7, tx + 13, ty - 40, 0.9, 0.6, null), E(tx + 13, ty - 40.5, 1.4, 1.4, null)];
      kab.push(...glied([[mx + 2, my + 5], [mx + 9, my + 6], [tx + 2, ty - 6]], 1.6, 1.6, null));
      kab.push(...glied([[tx + 4, ty + 23], [tx + 6, ty + 40], [tx + 7, 70 + T], [tx + 9, 96], [tx + 14, 111], [tx + 20, 112.5]], 1.6, 1.5, null));
    } else if (v.gerade) {
      kab.push(...glied([[mx + 2, my + 4], [sx + 20, sy + 10], [sx + 22, 110]], 1.6, 1.5, null));
    } else {
      const sw = p.angriff ? [0, 2, -3, -1][f] : 0;
      kab.push(...glied([[mx + 2, my + 4], [mx + 9, my + 12], [sx + 21, sy + 20], [sx + 23 + sw, sy + 40], [sx + 24 + sw, 96], [sx + 26, 108], [sx + 31, 112.5]], 1.9, 1.6, null));
      kab.push(...glied([[sx + 31, 112.5], [sx + 38, 112], [sx + 40, 108], [sx + 35, 106], [sx + 31, 109]], 1.5, 1.3, null));
    }
    const vornHoch = armV >= 0.5 && armV < 1.5;
    const gruppen = [
      { p: kab, k: 0.8, kante: true },                                   // 0 Kabel
      { p: [...tornister, ...antenne], k: 0.5, kante: true },            // 1 Tornister
      { p: [beinH, stiefel[1], stiefel[3]].flat(), k: 1, kante: true },  // 2
      { p: [beinV, stiefel[0], stiefel[2]].flat(), k: 1, kante: true },  // 3
      { p: kapuze, k: 2, anker: [L, T] },                                // 4 Kapuze
      { p: [anorak], k: 1.5, anker: [L, T], kante: true, tone: 0.1 },               // 5 Anorak
      { p: [latz], k: 1, anker: [L, T], kante: true },                 // 6a Brustlatz
      { p: [guertel, tasche], k: 0, noRim: true },                       // 6
      { p: [hals], k: 1, kante: true },                                  // 7
      { p: kopf, k: 1.5, kante: true, anker: [L, T] },                   // 8 Kopf
      { p: [...muschel, ...buegel], k: 1, kante: true },                 // 9 Muschel und Bügel
      { p: armHinten, k: 1, kante: true, anker: [L, T] },                // 10 hinterer Arm (Hand an der Muschel)
      { p: [...armVorn, ...finger], k: 1, kante: true, anker: [L, T] },  // 11 vorderer Arm
      { p: block, k: 0, kante: true },                                   // 12 Block
    ];
    void vornHoch;
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('funkstation'), { rimBis: 113 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      { const tmp = []; for (let i = 0; i < W * H; i++) if (gid[i] !== 0) tmp.push([i, P.get(i % W, (i / W) | 0)]); H0.kapselLicht(P, kab, 'kupfer'); for (const [i, c] of tmp) P.set(i % W, (i / W) | 0, c); }
      H0.kapselLicht(P, buegel, 'r1');
      const X = r(sx), Y = r(sy);
      // Anorak: Fellsaum hell gefleckt, Nähte (Tal und Grat), Falten vom Gürtel nach unten
      for (let x = X - 18; x <= X + 19; x += 2) { const yy = Y + 50 + ((x * 7) % 3); P.auf(x, yy, (x % 4) ? 'k3' : 'r1'); P.auf(x + 1, yy + 2, 'k1'); }
      for (const [x0, y0, x1, y1] of [[X + 6, Y - 2, X + 9, Y + 30], [X - 4, Y + 36, X - 7, Y + 50], [X + 5, Y + 36, X + 7, Y + 51], [X + 13, Y + 36, X + 16, Y + 50]]) { P.line(x0, y0, x1, y1, 'k0', true); P.line(x0 + 1, y0 + 1, x1 + 1, y1, 'k3', true); }
      // Brustlatz mit Knebelknöpfen aus Holz, Fellkante entlang der Öffnung
      for (let y = Y + 4; y < Y + 30; y += 2) { P.auf(X - 1, y, 'k3'); P.auf(X - 2, y + 1, (y >> 1) % 2 ? 'r1' : 'k2'); }
      for (let i = 0; i < 3; i++) { P.auf(X - 6, Y + 8 + i * 7, 'k3'); P.auf(X - 5, Y + 8 + i * 7, 'r1'); }
      // Gürtelschnalle, Tasche mit Klappe
      P.auf(X - 1, Y + 32, 'kupfer'); P.line(X - 9, Y + 35, X - 3, Y + 35, 'k3', true);
      // Kapuzenfell: Büschel
      for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.5; P.auf(r(kx + 12 + Math.cos(a) * 8), r(ky + 6 + Math.sin(a) * 6), i % 2 ? 'r1' : 'k3'); }
      // Bügel unter der Haut: ein Grat über den Schädel, links und rechts davon dunkel
      if (!v.gerade) { P.line(r(kx - 3), r(ky - 7), r(mx - 1), r(my - 4), 'k3', true); P.line(r(kx - 3), r(ky - 6), r(mx - 2), r(my - 3), 'k0', true); }
      // Muschel: Kupferring, in der Mitte glüht es, wo sie in den Schädel wächst
      const MX = r(mx), MY = r(my);
      for (let a = 0; a < 6.28; a += 0.35) P.auf(r(MX + Math.cos(a) * 3.6), r(MY + Math.sin(a) * 4.4), Math.cos(a) * 0.9 - Math.sin(a) * 0.5 > 0.2 ? 'kupfer' : 'k1');
      if (!aus) { P.glow(MX + 0.5, MY + 0.5, 11 * horch, 0.85); P.glow(r(kx - 2), r(ky + 4), 6, 0.5); P.set(MX, MY, 'glut'); P.set(MX - 1, MY, 'kern'); P.set(MX, MY + 1, 'glutDim'); P.set(MX + 1, MY, 'glutDim'); augen.push([MX, MY]); }
      // Gesicht: tiefe Augenhöhle, ein Auge glimmt; der Mund offen, er spricht mit, was er hört
      const ex = r(kx - 4), ey = r(ky - 1);
      P.auf(ex - 1, ey - 1, 'k0'); P.auf(ex, ey - 1, 'k0'); P.auf(ex + 1, ey - 1, 'k1');
      if (!aus) { P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.glow(ex + 0.5, ey + 0.5, 4, 0.5); augen.push([ex, ey]); P.set(ex + 4, ey, 'glutDim'); }
      P.auf(ex - 2, ey + 5, 'k0'); P.auf(ex - 1, ey + 5, p.angriff && f === 2 ? 'glutDim' : 'k0'); P.auf(ex - 1, ey + 6, 'k1');
      // Bartstoppeln, Reif auf den Brauen
      P.auf(ex, ey - 2, 'r1'); P.auf(ex - 1, ey - 2, 'r1');
      // Block: Zeilen in Punkt und Strich
      if (block.length) { const [hx, hy] = handV; for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) if ((i + j) % 3) P.auf(r(hx - 3 + j), r(hy - 1 + i * 2), j % 2 ? 'k1' : 'k0'); }
      // Tornister: Holzkasten mit Beschlägen, ein Fenster, in dem eine Röhre glüht
      if (v.tornister) {
        const TX = r(tx), TY = r(ty);
        P.line(TX - 4, TY + 7, TX + 8, TY + 6, 'k0', true); P.line(TX - 4, TY + 8, TX + 8, TY + 7, 'k3', true);
        for (let y = TY + 10; y <= TY + 17; y++) for (let x = TX - 1; x <= TX + 4; x++) P.auf(x, y, x === TX - 1 || y === TY + 10 ? 'k0' : 'k1');
        if (!aus) { P.glow(TX + 1.5, TY + 14, 7, 0.9); P.set(TX + 1, TY + 13, 'kern'); P.set(TX + 2, TY + 13, 'glut'); P.set(TX + 1, TY + 14, 'glut'); P.set(TX + 1, TY + 12, 'glutDim'); P.set(TX + 1, TY + 15, 'glutDim'); augen.push([TX + 1, TY + 13]); }
        P.auf(TX - 4, TY, 'kupfer'); P.auf(TX + 8, TY - 2, 'kupfer');
      }
      // Kabel am Boden: ein Glanz, wo es das Licht fängt
      if (!v.tornister && !v.gerade) { P.auf(r(sx + 37), 106, 'kupfer'); }
    };
    return { gruppen, details, augen };
  },
};
