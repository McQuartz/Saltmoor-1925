// Die Waage am Grund: Die Tarierte. Eine Frau im Sonntagskleid, die mit der Personenwaage aus der Wartehalle
// verwachsen ist (die Sorte vom Bahnhof: zehn Pfennig, Zifferblatt in Kopfhöhe). Sie steht auf der Platte,
// die Säule wächst ihr aus dem Rücken, und wo ihr Kopf war, sitzt das Zifferblatt. Das Haar hängt ihr noch
// vom Rand des Blattes über die Schultern. Mit zwei Fingern dreht sie an der Tarierschraube. Falsch ist der
// Zeiger: Er steht unter Null. Sie wiegt weniger als nichts, und sie gleicht es bei den anderen aus.
'use strict';
const K = require('./hilfe/kanten');

module.exports = {
  id: 'tarierte', biom: 'waage', zone: 'waage', w: 96, h: 120, fuss: [52, 113], kopf: [52, 6], rimBis: 112,
  varianten: {
    // a: Haar hängt, Rüschenkragen, Gewichtsstück in der hängenden Hand
    tarierte_a: { R: 11, haar: 'haengt', schuerze: false },
    // b: größeres Blatt, Haar steigt im Wasser nach oben, Schürze, Münzkasten an der Platte
    tarierte_b: { R: 12.5, haar: 'steigt', schuerze: true },
  },
  // Silhouetten-Proben (nicht gebaut): Frau sitzt in einer hängenden Waagschale an drei Ketten (las sich wie
  // die Gezogene aus dem Mond, etwas hängt von oben); Kopf vorhanden, Waage nur neben ihr (las sich als Frau
  // mit Möbel). Genommen: Zifferblatt statt Kopf, Säule im Rücken.
  proben: {
    probe_mitkopf: { R: 0, haar: 'haengt', schuerze: false, mitKopf: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, zeiger = -0.35, schwing = 0;
    // zeiger: Winkel des Zeigers (0 = senkrecht nach oben = Null; negativ = links unter Null)
    if (p.idle) { atem = [0, 0, 1, 1][f]; zeiger = -0.35 + [0, 0.06, -0.06, 0.03][f]; schwing = 0; }
    if (p.angriff) { lean = [3, 5, -8, -3][f]; zeiger = [0.3, 1.2, -2.2, -1][f]; schwing = [1, 2, -3, -1][f]; }
    if (p.treffer) { lean = [3, 1][f]; zeiger = [1.6, 0.8][f]; schwing = 2; }
    if (p.tod) { fall = r(p.q * 10); lean = r(p.q * 6); zeiger = -0.35 - p.q * 2.4; }
    const T = fall, L = lean;
    // Platte: flacher Kasten mit Messingkante, kurze Füße
    const platte = [Pg([[32, 104], [72, 103], [74, 110], [30, 111]], null, { rd: 1 }), E(34, 112, 3, 1.6, 'dunkel'), E(70, 112, 3, 1.6, 'dunkel')];
    const muenz = v.schuerze ? [Pg([[66, 88], [74, 88], [74, 103], [66, 103]], null, { rd: 0.6 })] : [];
    // Säule: wächst aus dem hinteren Teil der Platte, biegt sich beim Angriff mit ihr
    const kx = 52 + L * (p.angriff ? 1.6 : 1), ky = 28 + T + atem + (p.angriff && f === 2 ? 3 : 0);
    const saeule = [C(64, 104, 64 + L * 0.3, 70, 2.6, 2.4, null), C(64 + L * 0.3, 70, kx + 9, ky + 6, 2.4, 2.2, null)];
    // Kleid: Glocke von der Taille bis auf die Platte, Mieder, Schultern
    const tx = 51 + L * 0.5, ty = 62 + T;
    const rock = Pg([[tx - 6, ty], [tx + 6, ty], [tx + 12, 86], [tx + 18, 103], [tx - 18, 103], [tx - 12, 86]], null, { rd: 2 });
    const saumF = Pg(saum(tx - 18, tx + 18, 103, 9, 1.6, 5, schwing * 0.3).concat([[tx + 18, 99], [tx - 18, 99]]), null, { rd: 0.4 });
    const sx = 52 + L * 0.8, sy = 44 + T;
    const mieder = Pg([[sx - 9, sy], [sx + 8, sy - 1], [sx + 6, sy + 10], [tx + 5, ty + 2], [tx - 5, ty + 2], [sx - 7, sy + 10]], null, { rd: 2 });
    const schuerze = v.schuerze ? [Pg([[tx - 7, ty + 2], [tx + 6, ty + 2], [tx + 9, 98], [tx - 10, 98]], 'haut', { rd: 1 })] : [];
    const kragen = Pg([[sx - 8, sy - 2], [sx + 7, sy - 3], [sx + 6, sy + 3], [sx, sy + 6], [sx - 7, sy + 3]], 'haut', { rd: 0.8 });
    const hals = C(sx, sy - 1, kx, ky + v.R * 0.6, 2.4, 2, 'haut');
    // Zifferblatt statt des Kopfes: Gehäuse (Ring), Blatt, Tarierschraube rechts
    const R = v.R;
    const gehaeuse = v.mitKopf ? [E(kx, ky + 6, 5.5, 6.5, 'haut')] : [E(kx, ky, R + 1.6, R + 1.6, null), E(kx + R + 2, ky - 3, 2.2, 1.6, null)];
    const blatt = v.mitKopf ? [] : [E(kx, ky, R - 0.6, R - 0.6, 'haut', { pf: 'flat', tone: 0.35 })];
    // Haar: vom oberen Rand des Blatts über die Schultern (a) oder nach oben ins Wasser (b)
    const haar = [];
    if (!v.mitKopf) for (let i = 0; i < 6; i++) {
      const a = (v.haar === 'haengt' ? -1.5 : -2.4) + i * (v.haar === 'haengt' ? 0.26 : 0.32), hx0 = kx + Math.cos(a) * (R + 1), hy0 = ky + Math.sin(a) * (R + 1);
      if (v.haar === 'haengt') haar.push(...glied([[hx0, hy0], [hx0 + 4 + i * 0.8, hy0 + 6], [hx0 + 5 + i * 1.2 + schwing * 0.4, sy + 8 + i * 3], [hx0 + 4 + i * 1.4 + schwing * 0.6, sy + 18 + i * 3]], 1.7, 0.7, null));
      else haar.push(...glied([[hx0, hy0], [hx0 + 3 + i, hy0 - 6], [hx0 + 5 + i * 1.4 + schwing * 0.5, hy0 - 11], [hx0 + 4 + i * 1.8 + schwing, hy0 - 15 + i]], 1.5, 0.6, null));
    }
    // Arme: vorn hängt einer (hält ein Gewichtsstück), hinten dreht einer an der Schraube
    const handV = p.angriff && f === 2 ? [sx - 18, sy + 8] : [sx - 11, sy + 26 - (p.angriff ? f * 3 : 0)];
    const armV = glied([[sx - 7, sy + 1], [sx - 12, sy + 13], handV], 2.6, 1.8, null);
    const gewicht = v.schuerze ? [] : [C(handV[0], handV[1] + 2, handV[0], handV[1] + 7, 2.2, 2.4, null), E(handV[0], handV[1] + 1.4, 1, 1, null)];
    const schraube = [kx + R + 3, ky - 3];
    const armH = glied([[sx + 7, sy], [sx + 15, sy - 6], [schraube[0] + 1, schraube[1] + 2]], 2.4, 1.6, null);
    const gruppen = [
      { p: haar, k: 0.6, kante: true },                            // 0 Haar (hinter dem Blatt)
      { p: saeule, k: 0.6, kante: true },                          // 1
      { p: muenz, k: 0.4, kante: true },                           // 2
      { p: platte, k: 0.6, kante: true },                          // 3
      { p: armH, k: 0.8, kante: true },                            // 4
      { p: [rock, saumF], k: 1.4, anker: [L, T], kante: true },    // 5
      { p: schuerze, k: 0.8, kante: true },                        // 6
      { p: [mieder], k: 1.4, anker: [L, T], kante: true },         // 7
      { p: [hals, kragen], k: 0.8, kante: true },                  // 8
      { p: gehaeuse, k: 0.6, kante: true },                        // 9
      { p: blatt, k: 0, noRim: true },                             // 10
      { p: [], k: 0 },                                             // 11
      { p: [...armV, ...gewicht], k: 0.8, kante: true },           // 12
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(96, 120, gruppen, LIB.palette('waage'), { rimBis: 112 });
    const augen = [];
    const details = P => {
      const g = (x, y) => (x < 0 || y < 0 || x >= 96 || y >= 120 ? -1 : gid[y * 96 + x]);
      const ziel = [];
      for (let y = 1; y < 119; y++) for (let x = 0; x < 95; x++) { const gi = g(x, y); if (gi < 0 || !gruppen[gi].kante) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1); const h = q => q >= 0 && q < gi; if (h(a) || (h(b) && h(d))) ziel.push([x, y]); }
      ziel.forEach(([x, y]) => P.set(x, y, 'r1'));
      // Rock: Falten laufen von der Taille auseinander (Tal dunkel, Grat hell)
      const X = r(tx), Y = r(ty);
      for (const dx of [-12, -6, 0, 6, 12]) { P.line(X + dx * 0.25, Y + 4, X + dx, 101, 'k0', true); P.line(X + dx * 0.25 + 1, Y + 4, X + dx + 1, 101, 'k3', true); }
      for (const dx of [-9, 3, 9]) P.line(X + dx * 0.3 + 1, Y + 8, X + dx + 1, Y + 22, 'r1', true);
      // Mieder: Knopfleiste, Taillenband
      for (let i = 0; i < 4; i++) P.auf(r(sx) - 1, r(sy) + 5 + i * 3, i % 2 ? 'k3' : 'messing');
      P.line(X - 6, Y + 1, X + 6, Y + 1, 'k0', true); P.line(X - 5, Y, X + 5, Y, 'k3', true);
      // Kragen: Rüschen (Zacken)
      for (let x = r(sx) - 7; x <= r(sx) + 6; x += 2) P.auf(x, r(sy) + 3, 'k1');
      // Platte: Messingkante, Riffelblech
      for (let x = 32; x < 72; x++) { if (P.get(x, 104) && (x & 1)) P.set(x, 104, 'messing'); }
      for (let x = 34; x < 70; x += 3) P.auf(x, 107, 'k3');
      if (v.schuerze) { P.line(67, 93, 72, 93, 'k0', true); P.auf(70, 92, 'messing'); }
      K.licht(P, saeule, { c: 'r1', c2: null, nur: (x, y) => gid[y * 96 + x] === 1 });
      // Zifferblatt: Teilstriche, Ziffernring, der Zeiger (rot) steht links unter Null; Mitte ist das Auge
      if (!v.mitKopf) {
        const kxR = kx, kyR = ky;
        for (let y = r(kyR - R); y <= r(kyR + R); y++) for (let x = r(kxR - R); x <= r(kxR + R); x++) if (gid[y * 96 + x] === 10) { const q = Math.hypot(x + 0.5 - kxR, y + 0.5 - kyR) / R; P.set(x, y, LIB.bay(x, y) < 0.62 - q * 0.45 ? 'r1' : q > 0.82 ? 'k2' : 'k3'); }
        for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (i - 8) * (Math.PI * 1.5 / 16); if (i === 0) continue; const x = kxR + Math.cos(a) * (R - 2.2), y = kyR + Math.sin(a) * (R - 2.2); P.auf(x, y, i % 4 === 0 ? 'k0' : 'k1'); if (i % 4 === 0) P.auf(x + Math.cos(a) * -1, y + Math.sin(a) * -1, 'k1'); }
        P.auf(kxR, kyR - R + 2, 'siegel'); P.auf(kxR + 1, kyR - R + 2, 'siegel'); // Null-Marke
        // Ring des Gehäuses: Messing an der Lichtseite
        for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, x = r(kxR + Math.cos(a) * (R + 0.9)), y = r(kyR + Math.sin(a) * (R + 0.9)); const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, Math.cos(a) * 0.8 - Math.sin(a) * 0.5 > 0.3 ? 'r2' : Math.cos(a) * 0.8 - Math.sin(a) * 0.5 > -0.2 ? 'messing' : 'k1'); }
        if (!p.tod || f < 1) {
          const za = -Math.PI / 2 + zeiger, zl = R - 2.5;
          P.glow(kxR + 0.5, kyR + 0.5, 6, 0.7);
          P.line(kxR, kyR, kxR + Math.cos(za) * zl, kyR + Math.sin(za) * zl, 'glut');
          P.line(kxR, kyR, kxR - Math.cos(za) * 3, kyR - Math.sin(za) * 3, 'siegel');
          P.set(r(kxR), r(kyR), 'kern');
          augen.push([r(kxR), r(kyR)]);
        }
        // Glas fängt das Wasserlicht oben rechts
        P.auf(r(kxR + R * 0.45), r(kyR - R * 0.55), 'papier'); P.auf(r(kxR + R * 0.55), r(kyR - R * 0.4), 'r1');
      } else if (!p.tod || f < 1) { P.auge(r(kx - 3), r(ky + 5), 2); augen.push([r(kx - 3), r(ky + 5)]); }
      // Haar: einzelne Strähnen heller
      K.licht(P, haar, { c: 'r1', c2: null, luecke: 2, nur: (x, y) => gid[y * 96 + x] === 0 });
      // Gewichtsstück: Messing
      if (gewicht.length) { P.auf(r(handV[0]) + 1, r(handV[1]) + 3, 'messing'); P.auf(r(handV[0]) + 1, r(handV[1]) + 4, 'r1'); }
      // Tarierschraube
      P.auf(schraube[0], schraube[1], 'messing');
    };
    return { gruppen, details, augen };
  },
};
