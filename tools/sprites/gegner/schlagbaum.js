// Die Waage am Grund: Der Schlagbaum. Ein Grenzaufseher vom Zollamt, Pelerine, Schirmmütze, hoher Kragen.
// Er hat keinen rechten Arm mehr: Aus der Schulter wächst der Schlagbaum, rot und dunkel geringelt, mit der
// Laterne, die bei Nacht rot brennt. Mit dem Bolzen durch die Schulter hebt und senkt er ihn. Falsch ist sein
// Gesicht: Die Augen sind versiegelt, zwei Tropfen Siegellack, und darunter glimmt es. Er sieht trotzdem,
// wer kommt. Die Grenze, die er bewacht, hat keinen Weg mehr.
'use strict';
const K = require('./hilfe/kanten');

module.exports = {
  id: 'schlagbaum', biom: 'waage', zone: 'waage', w: 96, h: 120, fuss: [60, 115], kopf: [56, 18], rimBis: 113,
  varianten: {
    // a: Pelerine über dem Rock, Schirmmütze, Laterne am Baum
    schlagbaum_a: { kleid: 'pelerine', muetze: 'schirm', behang: false },
    // b: langer Mantel mit Koppel, Tschako, unter dem Baum ein Gitterbehang
    schlagbaum_b: { kleid: 'mantel', muetze: 'tschako', behang: true },
  },
  // Silhouetten-Proben (nicht gebaut): Baum senkrecht wie eine Fahnenstange (las sich als Fahnenträger aus dem Eis);
  // Baum waagerecht in Hüfthöhe (las sich als Lanze, die Figur verschwand dahinter). Genommen: schräg erhoben.
  proben: {
    probe_senkrecht: { kleid: 'pelerine', muetze: 'schirm', behang: false, winkel: -1.45 },
    probe_waagerecht: { kleid: 'pelerine', muetze: 'schirm', behang: false, winkel: 0.02, tief: 16 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, wink = v.winkel ?? -0.62, lampe = 1, schw = 0;
    // wink: Richtung des langen Endes, gemessen von „nach links“ (0 = waagerecht nach links, negativ = nach oben)
    if (p.idle) { atem = [0, 0, 1, 1][f]; wink += [0, 0.02, 0.04, 0.02][f]; schw = [0, 1, 0, -1][f]; lampe = [1, 0.9, 1.1, 1][f]; }
    if (p.angriff) { lean = [1, 2, -5, -2][f]; wink = [-0.95, -1.2, 0.12, -0.12][f]; schw = [1, 2, -2, 0][f]; lampe = [1.1, 1.2, 1.5, 1.2][f]; }
    if (p.treffer) { lean = [2, 1][f]; wink = -0.5 + [0.12, 0.06][f]; schw = 2; lampe = 0.7; }
    if (p.tod) { fall = r(p.q * 22); lean = r(p.q * 4); wink = -0.62 + p.q * 0.9; lampe = Math.max(0, 1 - p.q * 3); }
    const T = atem + fall, L = lean;
    const mantel = v.kleid === 'mantel';
    // Beine und Stiefel (unter dem Rock)
    const knick = p.tod ? p.q * 6 : 0;
    const beinV = glied([[56 + L * 0.3, 86 + T], [55 - knick, 100 + T * 0.5], [54, 111]], 3.4, 2.8, null);
    const beinH = glied([[65 + L * 0.3, 86 + T], [66, 100 + T * 0.5], [67, 111]], 3.4, 2.8, null);
    const stiefel = [E(52, 113, 5.5, 2.6, 'dunkel'), E(67, 113, 5, 2.6, 'dunkel')];
    // Rock bis unter das Knie
    const sx = 60 + L, sy = 46 + T;
    const rock = Pg([[sx - 10, sy + 4], [sx + 10, sy + 3], [sx + 13, sy + 40], [sx + 14, sy + 56], [sx - 12, sy + 56], [sx - 12, sy + 36]], null, { rd: 1.5 });
    // Pelerine (a): Glocke von den Schultern, hinten länger, Saum leicht zerfetzt; Mantel (b): Schöße, Koppel
    const pel = mantel
      ? Pg([[sx - 11, sy + 1], [sx + 9, sy - 1], [sx + 15, sy + 10], [sx + 17, sy + 44], [sx + 20, sy + 62], [sx - 15, sy + 62], [sx - 13, sy + 40], [sx - 14, sy + 12]], null, { rd: 1.6 })
      : Pg([[sx - 12, sy + 1], [sx + 8, sy - 2], [sx + 16, sy + 8], [sx + 21, sy + 26], [sx + 24, sy + 44], ...saum(sx + 24, sx - 17, sy + 44, 7, 3, 3, schw * 0.5), [sx - 17, sy + 40], [sx - 15, sy + 16]], null, { rd: 1.4 });
    const kragenCape = mantel ? null : Pg([[sx - 13, sy], [sx + 8, sy - 3], [sx + 15, sy + 4], [sx + 19, sy + 18], ...saum(sx + 19, sx - 14, sy + 19, 5, 2, 7, schw * 0.3), [sx - 15, sy + 16]], null, { rd: 1.2 });
    const koppel = mantel ? [C(sx - 14, sy + 30, sx + 16, sy + 30, 1.6, 1.6, 'dunkel')] : [];
    // Kragen (hoch, steif), Kopf, Mütze
    const kopfX = 56 + L * 1.1, kopfY = 34 + T;
    const kragen = Pg([[sx - 8, sy - 7], [sx + 6, sy - 8], [sx + 8, sy + 1], [sx - 9, sy + 2]], null, { rd: 0.8 });
    const kopf = [E(kopfX, kopfY, 5.6, 7, 'haut'), E(kopfX - 5, kopfY + 1, 1.8, 2, 'haut')];
    const muetze = v.muetze === 'tschako'
      ? [Pg([[kopfX - 6, kopfY - 6], [kopfX + 7, kopfY - 7], [kopfX + 8, kopfY - 20], [kopfX - 5, kopfY - 19]], null, { rd: 0.8 }), Pg([[kopfX - 13, kopfY - 6], [kopfX - 3, kopfY - 7], [kopfX - 3, kopfY - 4], [kopfX - 12, kopfY - 3]], 'dunkel', { rd: 0.4 })]
      : [Pg([[kopfX - 8, kopfY - 9], [kopfX + 7, kopfY - 13], [kopfX + 10, kopfY - 9], [kopfX + 6, kopfY - 5], [kopfX - 6, kopfY - 4]], null, { rd: 1 }), Pg([[kopfX - 14, kopfY - 5], [kopfX - 3, kopfY - 6], [kopfX - 3, kopfY - 3], [kopfX - 12, kopfY - 2]], 'dunkel', { rd: 0.4 })];
    // Der Baum: Bolzen in der vorderen Schulter, langes Ende nach links oben, kurzes Ende mit Gegengewicht hinter ihm
    const px = sx - 9, py = sy + 6 + (v.tief || 0);
    const lang = 56, kurz = 15, ca = Math.cos(wink), sa = Math.sin(wink);
    const ende = [px - ca * lang, py + sa * lang], hinten = [px + ca * kurz, py - sa * kurz];
    const baumH = [C(hinten[0], hinten[1], px, py, 2.6, 2.6, null)];
    const baum = [C(px, py, ende[0], ende[1], 2.6, 2.0, null)];
    // Signalscheibe an der Spitze (rund, mit rotem Rand)
    const scheibe = E(ende[0] + ca * 3, ende[1] - sa * 3, 5.2, 5.2, null, { pf: 'flat' });
    const bolzen = E(px, py, 3.4, 3.4, null);
    // Gegengewicht: ein Gusseisenklotz am kurzen Ende, hängt nach unten
    const gg = [C(hinten[0], hinten[1], hinten[0] + 1, hinten[1] + 5, 0.7, 0.7, null), Pg([[hinten[0] - 4, hinten[1] + 5], [hinten[0] + 5, hinten[1] + 5], [hinten[0] + 6, hinten[1] + 13], [hinten[0] - 3, hinten[1] + 13]], null, { rd: 0.8 })];
    // Laterne: hängt in Dreiviertel der Länge am Baum, pendelt
    const lq = 0.72, lx0 = px - ca * lang * lq, ly0 = py + sa * lang * lq;
    const lx = lx0 + schw * 0.5, ly = ly0 + 7;
    const laterne = [C(lx0, ly0, lx, ly - 3, 0.5, 0.5, null), Pg([[lx - 2.5, ly - 3], [lx + 2.5, ly - 3], [lx + 2.8, ly + 3], [lx - 2.8, ly + 3]], null, { rd: 0.5 }), E(lx, ly - 3.4, 2.4, 1, null), E(lx, ly + 3.6, 3, 1, null)];
    // Gitterbehang (b): senkrechte Stäbe unter dem Baum, oben an ihm hängend
    const behang = [];
    if (v.behang) for (let i = 1; i <= 7; i++) { const q = 0.14 + i * 0.1, bx = px - ca * lang * q, by = py + sa * lang * q; behang.push(C(bx, by, bx + schw * 0.3, by + 9 - i * 0.4, 0.55, 0.55, null)); }
    if (v.behang) { const a1 = 0.24, a2 = 0.84; behang.push(C(px - ca * lang * a1, py + sa * lang * a1 + 8, px - ca * lang * a2, py + sa * lang * a2 + 6, 0.5, 0.5, null)); }
    // hinterer Arm: Hand am Koppel, hält den Riegel
    const armH = [...glied([[sx + 8, sy + 3], [sx + 13, sy + 18], [sx + 9, sy + 28]], 2.8, 2.2, null), E(sx + 8, sy + 28, 2.2, 2, 'haut')];
    const gruppen = [
      { p: [...gg, ...baumH], k: 0, kante: true },                    // 0 kurzes Ende und Gegengewicht hinten
      { p: armH, k: 1, anker: [L, T] },                               // 1
      { p: [beinH, stiefel[1]].flat(), k: 1, kante: true },           // 2
      { p: [rock], k: 1.2, anker: [L, T], kante: true },              // 3
      { p: [beinV, stiefel[0]].flat(), k: 1, kante: true },           // 4
      { p: [pel, ...koppel], k: 1.2, anker: [L, T], kante: true },    // 5
      { p: kragenCape ? [kragenCape] : [], k: 1, anker: [L, T], kante: true }, // 5b Schulterkragen
      { p: [kragen], k: 0.8, kante: true },                           // 6
      { p: kopf, k: 1, anker: [L, T], kante: true },                  // 7
      { p: muetze, k: 0.6, kante: true },                             // 8
      { p: behang, k: 0, noRim: true },                               // 9
      { p: baum, k: 0, kante: true },                                 // 10
      { p: [scheibe], k: 0, kante: true },                            // 10b
      { p: [bolzen], k: 0, kante: true },                             // 11
      { p: laterne, k: 0, kante: true },                              // 12
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(96, 120, gruppen, LIB.palette('waage'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      // Innenkanten: vordere Teile fangen an ihrer Lichtkante eine Linie
      const g = (x, y) => (x < 0 || y < 0 || x >= 96 || y >= 120 ? -1 : gid[y * 96 + x]);
      const ziel = [];
      for (let y = 1; y < 119; y++) for (let x = 0; x < 95; x++) { const gi = g(x, y); if (gi < 0 || !gruppen[gi].kante) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1); const h = q => q >= 0 && q < gi; if (h(a) || (h(b) && h(d))) ziel.push([x, y]); }
      ziel.forEach(([x, y]) => P.set(x, y, 'r1'));
      const rx = r(sx), ry = r(sy);
      // Pelerine/Mantel: Faltentäler mit Grat, vom Kragen strahlenförmig
      const falten = mantel ? [[rx + 2, ry + 34, rx + 3, ry + 60], [rx + 9, ry + 32, rx + 13, ry + 60], [rx - 7, ry + 34, rx - 10, ry + 60], [rx + 12, ry + 8, rx + 14, ry + 28]]
        : [[rx - 3, ry + 20, rx - 6, ry + 42], [rx + 5, ry + 21, rx + 8, ry + 44], [rx + 13, ry + 20, rx + 18, ry + 44], [rx - 10, ry + 20, rx - 13, ry + 38]];
      for (const [x0, y0, x1, y1] of falten) { P.line(x0, y0, x1, y1, 'k0', true); P.line(x0 - 1, y0, x1 - 1, y1, 'k0', true); P.line(x0 + 1, y0 + 1, x1 + 1, y1, 'k3', true); P.line(x0 + 1, y0 + 1, (x0 + x1) / 2 + 1, (y0 + y1) / 2, 'r1', true); }
      // Schulterkragen: Saum wirft Schatten auf die Pelerine, Grate darauf
      if (kragenCape) { K.schatten(P, [kragenCape], { d: [0, 1], c: 'k0' }); K.schatten(P, [kragenCape], { d: [0, 2], c: 'k0' }); for (const [x0, y0, x1, y1] of [[rx - 4, ry + 3, rx - 8, ry + 16], [rx + 4, ry + 2, rx + 7, ry + 17], [rx + 10, ry + 4, rx + 15, ry + 16]]) { P.line(x0, y0, x1, y1, 'k0', true); P.line(x0 + 1, y0, x1 + 1, y1, 'r1', true); } }
      // Saum der Pelerine fängt Licht von oben im Wasser
      if (!mantel) for (let x = rx - 14; x < rx + 22; x++) { const y = ry + 43 + ((x * 7) % 3); if (P.get(x, y) && P.get(x, y) <= 4 && (x & 1)) P.set(x, y - 1, 'k3'); }
      // Knopfreihe (Messing) und Koppelschloss
      for (let i = 0; i < 4; i++) P.auf(rx - 1, ry + 6 + i * 6, i % 2 ? 'k3' : 'messing');
      if (mantel) { P.auf(rx - 2, ry + 30, 'messing'); P.auf(rx - 1, ry + 30, 'messing'); P.auf(rx - 2, ry + 29, 'r1'); }
      // Mützenabzeichen, Kragenspiegel
      P.auf(r(kopfX + 1), r(kopfY - 8 - (v.muetze === 'tschako' ? 6 : 0)), 'messing');
      P.auf(rx - 6, ry - 3, 'siegel'); P.auf(rx - 5, ry - 3, 'siegel');
      // Der Baum: geringelt, Siegelrot und Dunkel; Oberkante fängt Licht, Unterkante im Schatten
      const n = 7;
      for (let i = 0; i < n; i++) {
        if (i % 2) continue; const q0 = i / n + 0.02, q1 = (i + 1) / n;
        for (let s = 0; s <= 10; s++) { const q = q0 + (q1 - q0) * s / 10, bx = px - ca * lang * q, by = py + sa * lang * q; for (let d = -2; d <= 2; d++) { const x = r(bx + sa * d * 0.8), y = r(by + ca * d * 0.8); const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, d > 1 ? 'k1' : 'siegel'); } }
      }
      K.licht(P, baum, { c: 'r1', c2: null });
      K.schatten(P, baum, { d: [0, 1], c: 'k0' });
      // Signalscheibe: roter Ring, dunkle Mitte, ein Rückstrahler
      { const sxx = ende[0] + ca * 3, syy = ende[1] - sa * 3;
        for (let y = r(syy) - 6; y <= r(syy) + 6; y++) for (let x = r(sxx) - 6; x <= r(sxx) + 6; x++) { const d = Math.hypot(x + 0.5 - sxx, y + 0.5 - syy); const c = P.get(x, y); if (!c || c > 6) continue; if (d < 2.2) P.set(x, y, 'k1'); else if (d < 4.1 && c <= 4) P.set(x, y, 'siegel'); }
        if (lampe > 0) { P.set(r(sxx), r(syy), 'glut'); } }
      // Bolzen: Messingkopf
      P.auf(r(px), r(py) - 1, 'messing'); P.auf(r(px) + 1, r(py) - 1, 'r1');
      // Gesicht: Nase, Mund als Strich; die Augen versiegelt (zwei Tropfen Siegellack, darunter glimmt es)
      if (!p.tod || f < 1) {
        const ex = r(kopfX - 3), ey = r(kopfY - 1);
        P.glow(ex + 1, ey + 1, 6, 0.75);
        for (const [x, y] of [[ex - 1, ey], [ex + 2, ey]]) { P.set(x, y, 'siegel'); P.set(x + 1, y, 'siegel'); P.set(x, y + 1, 'siegel'); P.set(x + 1, y + 1, 'glut'); }
        P.set(ex + 3, ey + 1, 'kern'); P.set(ex, ey + 1, 'glut');
        augen.push([ex + 3, ey + 1]);
      }
      P.auf(r(kopfX - 3), r(kopfY + 4), 'k0'); P.auf(r(kopfX - 2), r(kopfY + 4), 'k0');
      // Laterne: rotes Glas, Licht fällt auf den Baum und die Pelerine
      if (lampe > 0) {
        const X = r(lx), Y = r(ly);
        P.glow(X + 0.5, Y + 0.5, 9 * lampe, 0.9);
        for (let y = Y - 2; y <= Y + 2; y++) for (let x = X - 1; x <= X + 1; x++) P.set(x, y, (x === X && (y === Y || y === Y - 1)) ? (lampe > 0.8 ? 'kern' : 'glut') : 'glut');
        P.set(X - 2, Y - 2, 'k1'); P.set(X + 2, Y - 2, 'r1');
        augen.push([X, Y]);
      }
      // Gegengewicht: Gussnaht
      P.line(r(hinten[0] - 2), r(hinten[1] + 9), r(hinten[0] + 4), r(hinten[1] + 9), 'k3', true);
    };
    return { gruppen, details, augen };
  },
};
