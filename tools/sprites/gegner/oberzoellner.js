// Die Waage am Grund, Elite im Vorraum: Der Oberzöllner. Ein schwerer Mann im Uniformmantel mit zwei Reihen
// Messingknöpfen und hoher Dienstmütze. Er trägt den Waagebalken über den Schultern wie ein Joch, an jedem Ende
// eine Schale an drei Ketten, über dem Nacken die Zunge der Waage. In der rechten Schale liegt, was andere
// hergeben mussten: Ringe, ein Brief, der Ärmel eines Mantels. Die linke Schale ist leer, auf deiner Seite.
// Falsch ist die Neigung: Die leere Schale hängt tiefer. Er hat kein Gesicht, nur ein Siegel aus rotem Lack,
// wo die Augen wären, und darunter glimmt es.
'use strict';
const K = require('./hilfe/kanten');

module.exports = {
  id: 'oberzoellner', biom: 'waage', zone: 'waage', w: 128, h: 160, fuss: [64, 155], kopf: [60, 4], rimBis: 152, rang: 'elite',
  varianten: {
    oberzoellner: { zunge: true },
  },
  // Silhouetten-Proben (nicht gebaut): Waage als Ständer neben ihm (las sich als Mann neben Möbel, die Waage
  // war Kulisse); Schalen an den ausgestreckten Armen ohne Balken (las sich als Krämer mit zwei Eimern).
  // Genommen: der Balken als Joch über den Schultern, die Zunge über dem Kopf.
  proben: { probe_arme: { zunge: false, ohneBalken: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f, W = 128, H = 160;
    let lean = 0, atem = 0, fall = 0, kipp = 0.13, pend = 0, siegel = 1;
    // kipp: Neigung des Balkens (positiv = links/zu dir hin tiefer)
    if (p.idle) { atem = [0, 0, 1, 1][f]; pend = [0, 1, 0, -1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; kipp = [-0.06, -0.2, 0.42, 0.24][f]; pend = [2, 3, -4, -1][f]; siegel = [1, 1.2, 1.5, 1.2][f]; }
    if (p.treffer) { lean = [2, 1][f]; kipp = 0.05; pend = 2; siegel = 0.7; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 4); kipp = 0.13 + p.q * 0.5; siegel = Math.max(0, 1 - p.q * 3); }
    const T = atem + fall, L = lean;
    // Beine und Stiefel
    const beine = [...glied([[56 + L * 0.2, 128 + T * 0.5], [55, 142], [54, 151]], 4.6, 3.8, null), ...glied([[72 + L * 0.2, 128 + T * 0.5], [73, 142], [74, 151]], 4.6, 3.8, null), E(51, 153, 7, 3, 'dunkel'), E(75, 153, 6.5, 3, 'dunkel')];
    // Mantel: breit, schwer, bis unter die Knie; zwei Knopfreihen; Schöße hinten geteilt
    const sx = 64 + L, sy = 54 + T;
    const mantel = Pg([[sx - 21, sy + 2], [sx - 8, sy - 4], [sx + 9, sy - 4], [sx + 22, sy + 2], [sx + 25, sy + 30], [sx + 27, sy + 60], [sx + 30, sy + 84], ...saum(sx + 30, sx - 28, sy + 86, 8, 2.4, 11, pend * 0.4).slice(1), [sx - 28, sy + 82], [sx - 25, sy + 56], [sx - 24, sy + 28]], null, { rd: 2.5 });
    const revers = Pg([[sx - 9, sy - 3], [sx + 9, sy - 3], [sx + 6, sy + 24], [sx, sy + 30], [sx - 6, sy + 24]], 'haut', { rd: 1 });
    const kragen = Pg([[sx - 11, sy - 8], [sx + 11, sy - 8], [sx + 12, sy - 1], [sx - 12, sy - 1]], null, { rd: 1 });
    const schulterL = Pg([[sx - 24, sy], [sx - 11, sy - 4], [sx - 10, sy + 2], [sx - 23, sy + 5]], null, { rd: 1 });
    const schulterR = Pg([[sx + 11, sy - 4], [sx + 24, sy], [sx + 23, sy + 5], [sx + 10, sy + 2]], null, { rd: 1 });
    const koppel = C(sx - 24, sy + 40, sx + 25, sy + 40, 2, 2, 'dunkel');
    // Kopf: groß, gesichtslos; Dienstmütze mit hoher Front
    const kx = 60 + L * 1.2, ky = 34 + T;
    const kopf = [E(kx, ky, 8.5, 10, 'haut'), C(kx + 1, ky + 6, sx, sy - 6, 6, 7, 'haut')];
    const muetze = [Pg([[kx - 10, ky - 7], [kx - 8, ky - 17], [kx + 2, ky - 22], [kx + 13, ky - 18], [kx + 12, ky - 8]], null, { rd: 1.6 }), Pg([[kx - 20, ky - 7], [kx - 6, ky - 9], [kx - 6, ky - 5], [kx - 18, ky - 4]], 'dunkel', { rd: 0.6 }), C(kx - 10, ky - 8, kx + 12, ky - 9, 1.6, 1.6, 'dunkel')];
    // Balken: liegt hinter dem Nacken auf den Schultern; Drehpunkt hinter dem Kopf
    const bx0 = kx + 1, by0 = ky - 21, halb = 46, ca = Math.cos(kipp), sa = Math.sin(kipp);
    const endeL = [bx0 - ca * halb, by0 + sa * halb], endeR = [bx0 + ca * halb, by0 - sa * halb];
    const balken = v.ohneBalken ? [] : [C(endeL[0], endeL[1], bx0, by0, 2.6, 3.6, null), C(bx0, by0, endeR[0], endeR[1], 3.6, 2.6, null), E(endeL[0], endeL[1], 3.2, 3.2, null), E(endeR[0], endeR[1], 3.2, 3.2, null)];
    const zx = bx0 - sa * 13, zy = by0 - ca * 13;
    // Zunge: steigt aus dem Scheitel durch die Mütze, Drehpunkt und Balken sitzen auf ihm
    const zunge = v.zunge ? [C(bx0, ky - 12, zx, zy + 5, 2.2, 1.2, null), Pg([[zx - 3, zy + 6], [zx + 3, zy + 6], [zx, zy - 1]], null, { rd: 0.3 }), E(bx0, by0, 4.4, 4.4, null)] : [];
    // Schalen an je drei Ketten; links leer und tiefer, rechts voll
    const schale = (ex, ey, tief, dx) => {
      const cx = ex + dx, cy = ey + tief, w = 13;
      return { cx, cy, w, ketten: [C(ex, ey, cx - w + 2, cy - 1, 0.55, 0.55, null), C(ex, ey, cx + w - 2, cy - 1, 0.55, 0.55, null), C(ex, ey, cx + 1, cy - 2, 0.5, 0.5, null)],
        form: Pg([[cx - w, cy - 1], [cx + w, cy - 1], [cx + w - 4, cy + 5], [cx + 4, cy + 8], [cx - 4, cy + 8], [cx - w + 4, cy + 5]], null, { rd: 1 }) };
    };
    const ohne = v.ohneBalken;
    const SL = schale(ohne ? sx - 30 : endeL[0], ohne ? sy + 20 : endeL[1], ohne ? 26 : 76, pend * 0.6 + (p.angriff && f === 2 ? -5 : 0));
    const SR = schale(ohne ? sx + 30 : endeR[0], ohne ? sy + 20 : endeR[1], ohne ? 26 : 64, pend * 0.4);
    // Inhalt rechts: Mantelärmel über den Rand, Brief, Bündel, Ringe
    const inhalt = [E(SR.cx - 6, SR.cy - 4, 7, 4, null), E(SR.cx + 5, SR.cy - 5, 6, 5, null), Pg([[SR.cx - 2, SR.cy - 10], [SR.cx + 8, SR.cy - 12], [SR.cx + 9, SR.cy - 6], [SR.cx - 1, SR.cy - 4]], 'haut', { rd: 0.4 }), ...glied([[SR.cx - 10, SR.cy - 3], [SR.cx - 17, SR.cy + 1], [SR.cx - 19, SR.cy + 12], [SR.cx - 17, SR.cy + 18]], 3, 2.2, null)];
    // Arme: halten den Balken wie ein Joch
    const handL = ohne ? [sx - 30, sy + 20] : [sx - 14 - (p.angriff ? [0, 2, -8, -3][f] * -1 : 0), sy + 34], handR = ohne ? [sx + 30, sy + 20] : [sx + 27, sy + 30];
    const buch = ohne ? [] : [Pg([[handL[0] - 6, handL[1] - 6], [handL[0] + 7, handL[1] - 8], [handL[0] + 8, handL[1] + 3], [handL[0] - 5, handL[1] + 5]], null, { rd: 0.6 })];
    const armL = [...glied([[sx - 18, sy + 4], [sx - 26, sy + 22], handL], 5, 3.6, null), E(handL[0], handL[1], 3.4, 3, 'haut'), ...buch];
    const armR = [...glied([[sx + 18, sy + 4], [sx + 27, sy + 16], handR], 4.6, 3.4, null), E(handR[0], handR[1], 3.2, 3, 'haut')];
    const gruppen = [
      { p: [...SR.ketten], k: 0 },                               // 0
      { p: zunge, k: 0, kante: true },                           // 1
      { p: balken, k: 0, kante: true },                          // 2
      { p: armR, k: 1.2, anker: [L, T], kante: true },           // 3
      { p: beine, k: 1, kante: true },                           // 4
      { p: [mantel], k: 2, anker: [L, T], kante: true },         // 5
      { p: [schulterL, schulterR, koppel], k: 0.6, anker: [L, T], kante: true }, // 6
      { p: [revers], k: 1, anker: [L, T], kante: true },         // 7
      { p: [kragen], k: 1, kante: true },                        // 8
      { p: kopf, k: 1.5, kante: true },                          // 9
      { p: muetze, k: 0.6, kante: true },                        // 10
      { p: [SR.form], k: 0.4, kante: true },                     // 11
      { p: inhalt, k: 0.8, kante: true },                        // 12
      { p: armL, k: 1.2, anker: [L, T], kante: true },           // 13
      { p: [...SL.ketten], k: 0 },                               // 14
      { p: [SL.form], k: 0.4, kante: true },                     // 15
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waage'), { rimBis: 152 });
    const augen = [];
    const details = P => {
      const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
      const ziel = [];
      for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) { const gi = g(x, y); if (gi < 0 || !gruppen[gi].kante) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1); const h = q => q >= 0 && q < gi; if (h(a) || (h(b) && h(d))) ziel.push([x, y]); }
      ziel.forEach(([x, y]) => P.set(x, y, 'r1'));
      const X = r(sx), Y = r(sy);
      // Mantel: zwei Knopfreihen (Messing), Faltentäler mit Grat bis zum Saum, Taschenklappen
      for (let i = 0; i < 5; i++) { P.auf(X - 6, Y + 6 + i * 7, i % 2 ? 'k3' : 'messing'); P.auf(X + 5, Y + 6 + i * 7, i % 2 ? 'k3' : 'messing'); }
      for (const [x0, x1] of [[-14, -20], [-6, -9], [8, 12], [16, 24]]) { P.line(X + x0, Y + 44, X + x1, Y + 84, 'k0', true); P.line(X + x0 - 1, Y + 44, X + x1 - 1, Y + 84, 'k0', true); P.line(X + x0 + 1, Y + 45, X + x1 + 1, Y + 84, 'k3', true); P.line(X + x0 + 1, Y + 45, X + (x0 + x1) / 2 + 1, Y + 62, 'r1', true); }
      for (const dx of [-17, 9]) { P.line(X + dx, Y + 50, X + dx + 9, Y + 50, 'k0', true); P.line(X + dx, Y + 49, X + dx + 9, Y + 49, 'r1', true); }
      P.line(X, Y + 30, X, Y + 84, 'k0', true);
      // Koppelschloss, Schulterstücke mit Fransen
      P.auf(X - 1, Y + 40, 'messing'); P.auf(X, Y + 40, 'messing'); P.auf(X, Y + 39, 'r2');
      for (let i = 0; i < 6; i++) { P.auf(X - 23 + i * 2, Y + 5 + (i % 2), 'messing'); P.auf(X + 12 + i * 2, Y + 4 + (i % 2), 'r1'); }
      // Mützenabzeichen
      P.auf(r(kx + 1), r(ky - 14), 'messing'); P.auf(r(kx + 2), r(ky - 14), 'messing'); P.auf(r(kx + 1), r(ky - 15), 'r2');
      // Balken: Messing an der Oberkante, Gravur in der Mitte, Knäufe
      if (balken.length) { K.licht(P, balken, { c: 'r2', c2: null, nur: (x, y) => gid[y * W + x] === 2 }); for (const e of [endeL, endeR]) P.auf(r(e[0]), r(e[1]) - 1, 'messing'); }
      if (zunge.length) { K.licht(P, zunge, { c: 'r1', c2: null, nur: (x, y) => gid[y * W + x] === 1 }); P.auf(r(bx0) + 6, r(by0), 'messing'); P.auf(r(bx0) + 7, r(by0) - 1, 'r2'); P.auf(r(zx), r(zy) + 2, 'messing'); }
      // Ketten: Glieder im Wechsel hell/dunkel
      for (const S of [SL, SR]) for (const k of S.ketten) { const n = Math.ceil(Math.hypot(k.x2 - k.x1, k.y2 - k.y1)); for (let i = 0; i <= n; i += 2) { const q = i / n; P.auf(k.x1 + (k.x2 - k.x1) * q, k.y1 + (k.y2 - k.y1) * q, i % 4 ? 'r1' : 'k3'); } }
      // Schalen: Messingrand, Unterseite dunkel; die leere links fängt Licht innen
      for (const S of [SL, SR]) { for (let x = r(S.cx - S.w + 1); x <= r(S.cx + S.w - 1); x++) { P.auf(x, r(S.cy - 1), x % 3 ? 'messing' : 'r2'); P.auf(x, r(S.cy), 'k3'); } K.schatten(P, [S.form], { d: [0, 1], c: 'k0' }); }
      // Inhalt: Brief (Papier mit Siegel), Ringe, ein Knopf am Ärmel
      { const cx = r(SR.cx), cy = r(SR.cy); for (let x = cx; x < cx + 8; x++) P.auf(x, cy - 10 + ((x - cx) > 4 ? -1 : 0), 'papier'); P.auf(cx + 3, cy - 8, 'siegel'); P.auf(cx + 4, cy - 8, 'siegel');
        for (const [x, y] of [[cx - 8, cy - 7], [cx - 4, cy - 8], [cx + 9, cy - 9], [cx + 3, cy - 3]]) { P.set(x, y, 'messing'); P.set(x + 1, y, 'r2'); }
        P.auf(r(SR.cx - 18), r(SR.cy + 14), 'messing'); }
      // Gesicht: kein Gesicht. Das Siegel sitzt, wo die Augen wären, darunter glimmt es; Mund als Naht
      if (siegel > 0) {
        const ex = r(kx - 4), ey = r(ky - 1);
        P.glow(ex + 0.5, ey + 0.5, 9 * siegel, 0.85);
        P.el(ex + 0.5, ey + 0.5, 3.2, 3.2, 'siegel');
        P.el(ex + 0.5, ey + 0.5, 1.8, 1.8, 'glut');
        P.set(ex, ey, 'kern'); P.set(ex + 2, ey - 2, 'k1'); P.set(ex - 2, ey + 2, 'k1');
        augen.push([ex, ey]);
      }
      for (let i = 0; i < 4; i++) P.auf(r(kx - 6) + i * 2, r(ky + 6), 'k0');
      if (buch.length) { const bx = r(handL[0]), by = r(handL[1]); for (let i = -4; i <= 6; i++) P.auf(bx + i, by - 7 - Math.round(i * 0.15), i % 3 ? 'papier' : 'r1'); P.auf(bx + 1, by - 2, 'siegel'); P.auf(bx + 2, by - 2, 'siegel'); }
    };
    return { gruppen, details, augen };
  },
};
