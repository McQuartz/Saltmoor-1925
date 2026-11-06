// Die Station, die nie eröffnet wurde: Der Streckengänger. Er ging 1925 jede Nacht die Strecke ab, mit Laterne
// und Hammer, und klopfte an jede Schiene, ob sie klingt. Das Gleis endet an ihm: Die beiden Schienen kommen
// aus dem Tunnel, laufen am Boden heran und biegen an seinen Fersen nach oben; sie sind seine Beine. Wohin er
// geht, geht das Gleis mit. Er geht voraus, und seine Laterne leuchtet auf das, was als Nächstes kommt.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'streckengaenger', biom: 'station', zone: 'station', w: 96, h: 120, fuss: [40, 115], kopf: [36, 18], rimBis: 116,
  varianten: {
    // a: Laterne weit vorgestreckt, der Hammer auf der Schulter
    streckengaenger_a: { hoch: false },
    // b: Laterne hoch über dem Kopf, der Hammer hängt in der anderen Hand, der Kopf ruht auf der Schiene
    streckengaenger_b: { hoch: true },
  },
  // Silhouetten-Probe (nicht gebaut): gewöhnliche Beine in Stiefeln, die Schienen nur am Boden hinter ihm (las
  // sich als Mann, der auf Gleisen steht). Genommen: Die Schienen biegen an den Fersen hoch und sind die Beine.
  proben: { probe_stiefel: { hoch: false, stiefel: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, ham = 0, kopfH = 0, pendel = 0;
    // ham: 0 Ruhe, 1 hoch über dem Kopf ausgeholt, 2 vorn unten eingeschlagen
    if (p.idle) { kopfH = [0, 0, 1, 1][f]; pendel = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; ham = [0.5, 1, 2, 1.6][f]; kopfH = [-1, -2, 2, 1][f]; pendel = [1, 2, -2, -1][f]; }
    if (p.treffer) { lean = [3, 2][f]; kopfH = -1; pendel = 2; }
    if (p.tod) { fall = r(p.q * 26); lean = r(p.q * 4); }
    const T = atem + fall, L = lean;
    // Schienen: am Boden von rechts heran, an der Ferse hoch bis unter den Mantel (Knie leicht gebeugt)
    const huefte = [40 + L * 0.4, 88 + T];
    const schieneH = v.stiefel ? glied([[44, 89 + T], [46, 101], [46, 111]], 2.6, 2.2, null) : glied([[44, 88 + T], [47, 100 + T * 0.5], [45, 110], [49, 113], [96, 113]], 1.8, 1.8, null);
    const schieneV = v.stiefel ? glied([[36, 89 + T], [34, 101], [33, 111]], 2.6, 2.2, null) : glied([[36, 88 + T], [33, 100 + T * 0.5], [34, 112], [39, 116], [96, 116]], 2, 2, null);
    const stiefel = v.stiefel ? [E(31, 113, 5, 2.6, null), E(46, 113, 5, 2.6, null), C(50, 113, 96, 113, 1.2, 1.2, null), C(46, 116, 96, 116, 1.2, 1.2, null)] : [];
    // Schwellen unter den Schienen
    const schwellen = [56, 68, 80, 92].map(x => Pg([[x - 3, 112], [x + 3, 112], [x + 4, 118], [x - 4, 118]], null, { rd: 0.3 }));
    // Mantel aus Ölzeug bis zum Knie, Kragen hoch
    const sx = 40 + L, sy = 44 + T;
    const mantel = Pg([[sx - 7, sy - 1], [sx + 6, sy - 2], [sx + 13, sy + 3], [sx + 15, sy + 12], [sx + 13, sy + 24], [sx + 16, sy + 46], [sx + 13, sy + 49], [sx - 14, sy + 49], [sx - 15, sy + 44], [sx - 11, sy + 22], [sx - 11, sy + 5]], null, { rd: 1.6 });
    const kragen = Pg([[sx - 7, sy - 4], [sx + 6, sy - 5], [sx + 8, sy + 2], [sx - 8, sy + 3]], null, { rd: 0.6 });
    const kx = 35 + L * 1.15, ky = 31 + T + kopfH;
    const kopf = [E(kx, ky, 6, 7, 'haut', { pf: 'bevel' }), C(kx - 5, ky + 1, kx - 7.5, ky + 3, 1.6, 1, 'haut'), E(kx - 2, ky + 5, 3.8, 3, 'haut')];
    const muetze = [Pg([[kx - 6, ky - 4], [kx - 5, ky - 9], [kx + 7, ky - 9], [kx + 8, ky - 4]], null, { rd: 1 }), Pg([[kx - 5, ky - 5], [kx - 12, ky - 4], [kx - 12, ky - 3], [kx - 3, ky - 3]], null, { rd: 0.4 })];
    // Laternenarm (vorn, links)
    const schV = [sx - 8, sy + 3];
    let eV, hV;
    if (v.hoch) { eV = [sx - 17, sy - 6]; hV = [sx - 18, sy - 32]; }
    else { eV = [sx - 15, sy + 12]; hV = [sx - 26, sy + 14]; }
    if (p.angriff && !v.hoch) { hV = [hV[0] + [2, 4, -4, 0][f], hV[1] + [0, -2, 4, 2][f]]; }
    const armV = [...glied([schV, eV, hV], 3.4, 2.8, null), E(hV[0], hV[1], 2.6, 2.4, 'haut')];
    const lx = hV[0] + pendel * 0.6, ly = hV[1] + 4;
    const laterne = [C(hV[0], hV[1], lx, ly, 0.6, 0.6, null), Pg([[lx - 4, ly], [lx + 4, ly], [lx + 4, ly + 10], [lx - 4, ly + 10]], null, { rd: 0.8 }), Pg([[lx - 5, ly - 1], [lx + 5, ly - 1], [lx + 3, ly - 3], [lx - 3, ly - 3]], null, { rd: 0.4 }), Pg([[lx - 4, ly + 10], [lx + 4, ly + 10], [lx + 5, ly + 12], [lx - 5, ly + 12]], null, { rd: 0.3 })];
    // Hammerarm (hinten, rechts): Stiel und Kopf
    const schH = [sx + 8, sy + 3];
    let eH, hH, stielEnde;
    if (v.hoch && ham < 0.5) { eH = [sx + 12, sy + 16]; hH = [sx + 12, sy + 30]; stielEnde = [sx + 20, 110]; }
    else if (ham < 0.5) { eH = [sx + 13, sy + 14]; hH = [sx + 7, sy + 4]; stielEnde = [sx + 22, sy - 18]; }
    else if (ham < 1.5) { const k = Math.min(1, ham); eH = [sx + 12, sy + 2 - k * 6]; hH = [sx + 6, sy - 8 - k * 6]; stielEnde = [sx + 14 + k * 8, sy - 28 - k * 4]; }
    else { const k = ham - 1.5; eH = [sx - 6 + k * 6, sy + 6]; hH = [sx - 18 + k * 8, sy + 16 - k * 4]; stielEnde = [sx - 40 + k * 14, sy + 44 - k * 10]; }
    const armH = [...glied([schH, eH, hH], 3.4, 2.8, null), E(hH[0], hH[1], 2.6, 2.4, 'haut')];
    const dx = stielEnde[0] - hH[0], dy = stielEnde[1] - hH[1], dl = Math.hypot(dx, dy) || 1, ux = dx / dl, uy = dy / dl;
    const sE = [hH[0] + ux * Math.min(dl, 34), hH[1] + uy * Math.min(dl, 34)];
    const stiel = [C(hH[0] - ux * 3, hH[1] - uy * 3, sE[0], sE[1], 1.1, 1.1, null)];
    const nx = -uy, ny = ux;
    const hammerKopf = [Pg([[sE[0] - nx * 6 - ux * 2.5, sE[1] - ny * 6 - uy * 2.5], [sE[0] + nx * 7 - ux * 2, sE[1] + ny * 7 - uy * 2], [sE[0] + nx * 7 + ux * 2, sE[1] + ny * 7 + uy * 2], [sE[0] - nx * 6 + ux * 2.5, sE[1] - ny * 6 + uy * 2.5]], null, { rd: 0.6 })];
    const gruppen = [
      { p: schwellen, k: 0, kante: true, tone: -0.1 },                   // 0 Schwellen
      { p: [...schieneH, ...(v.stiefel ? [stiefel[1], stiefel[2]] : [])], k: 0.3, kante: true }, // 1 hintere Schiene
      { p: [...stiel, ...hammerKopf], k: 0.3, kante: true },             // 2 Hammer (hinter dem Arm, wenn geschultert)
      { p: armH, k: 1, kante: true, anker: [L, T] },                     // 3 Hammerarm
      { p: [...schieneV, ...(v.stiefel ? [stiefel[0], stiefel[3]] : [])], k: 0.3, kante: true }, // 4 vordere Schiene
      { p: [mantel], k: 1.5, kante: true, anker: [L, T], tone: 0.05 },   // 5 Mantel
      { p: [kragen], k: 0.6, kante: true },                              // 6 Kragen
      { p: kopf, k: 1.4, kante: true, anker: [L, T] },                   // 7 Kopf
      { p: muetze, k: 0.6, kante: true },                                // 8 Mütze
      { p: armV, k: 1, kante: true, anker: [L, T] },                     // 9 Laternenarm
      { p: laterne, k: 0.3, kante: true },                               // 10 Laterne
    ];
    if (ham >= 1.5) { const g = gruppen.splice(2, 1)[0]; gruppen.push(g); } // eingeschlagen: Hammer vorn
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('station'), { rimBis: 116 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      H0.kapselLicht(P, stiel, 'r1');
      // Schienen: Kopf hell (gefahrenes Eisen glänzt), Steg dunkel; Nägel auf den Schwellen
      if (!v.stiefel) {
        for (let x = 50; x < 96; x++) { P.auf(x, 112, x % 3 ? 'r1' : 'r2'); P.auf(x, 114, 'k0'); P.auf(x, 115, (x % 4) ? 'r1' : 'k3'); P.auf(x, 117, 'k0'); }
        for (const x of [56, 68, 80, 92]) { P.auf(x - 2, 114, 'messing'); P.auf(x + 2, 117, 'k3'); }
        // Biegung an der Ferse: ein Grat, wo das Eisen gestaucht ist
        P.auf(r(46), 110, 'r2'); P.auf(r(35), 113, 'r1');
      }
      const X = r(sx), Y = r(sy);
      // Ölzeug: steife Falten mit hellem Grat, Gürtel mit Werkzeug, Knöpfe
      for (const [x0, x1] of [[X - 6, X - 9], [X + 1, X + 1], [X + 7, X + 10]]) { P.line(x0, Y + 26, x1, Y + 47, 'k0', true); P.line(x0 + 1, Y + 26, x1 + 1, Y + 47, 'k3', true); }
      for (let x = X - 11; x <= X + 12; x++) { P.auf(x, Y + 23, 'k0'); P.auf(x, Y + 22, x % 2 ? 'k3' : 'k2'); }
      P.auf(X + 3, Y + 22, 'messing'); P.line(X + 9, Y + 24, X + 10, Y + 32, 'k3', true); P.auf(X + 10, Y + 33, 'r1');
      for (let i = 0; i < 3; i++) P.auf(X - 2, Y + 6 + i * 6, 'messing');
      for (let x = X - 12; x <= X + 13; x++) P.auf(x, Y + 47, x % 2 ? 'r1' : 'k3');
      // Schulterstück aus Leder, Lichtkante
      P.line(X + 1, Y - 1, X + 9, Y + 4, 'k3', true);
      // Mütze: Band, Abzeichen
      const KX = r(kx), KY = r(ky);
      for (let x = KX - 5; x <= KX + 7; x++) P.auf(x, KY - 5, 'k0');
      P.auf(KX + 1, KY - 7, 'messing');
      // Gesicht von unten von der Laterne beleuchtet (a) bzw. von oben (b); Bart
      if (!aus) { P.set(KX - 4, KY, 'kern'); P.set(KX - 3, KY, 'glut'); P.set(KX, KY, 'glutDim'); P.glow(KX - 3.5, KY + 0.5, 4, 0.5); augen.push([KX - 4, KY]); }
      for (let y = KY + 4; y < KY + 8; y++) for (let x = KX - 6; x < KX + 1; x++) if ((x + y) % 2 && P.get(x, y) >= 1 && P.get(x, y) <= 4) P.set(x, y, 'k1');
      P.auf(KX - 7, KY + 2, 'k3'); P.auf(KX - 6, KY + 3, 'k3');
      // Laterne: Messingrahmen, Glas, darin das kalte Licht; sie wirft Licht auf Arm und Gesicht
      const LX = r(lx), LY = r(ly);
      for (let y = LY + 1; y < LY + 10; y++) { P.set(LX - 4, y, 'messing'); P.set(LX + 3, y, 'k1'); }
      if (!aus) {
        for (let y = LY + 2; y < LY + 9; y++) for (let x = LX - 3; x < LX + 3; x++) P.set(x, y, (x === LX - 1 || x === LX) && y > LY + 3 && y < LY + 8 ? 'glut' : 'glutDim');
        P.set(LX - 1, LY + 5, 'kern'); P.set(LX, LY + 5, 'kern'); P.set(LX - 1, LY + 6, 'kern');
        P.glow(LX, LY + 5, 14, 0.9); augen.push([LX - 1, LY + 5]);
        if (!v.hoch) P.glow(KX - 4, KY + 4, 7, 0.5); else P.glow(KX - 2, KY - 6, 7, 0.5);
      } else for (let y = LY + 2; y < LY + 9; y++) for (let x = LX - 3; x < LX + 3; x++) P.set(x, y, 'k1');
      // Hammerkopf: Schlagfläche glänzt
      P.auf(r(sE[0] + nx * 5), r(sE[1] + ny * 5), 'r2');
    };
    return { gruppen, details, augen };
  },
};
