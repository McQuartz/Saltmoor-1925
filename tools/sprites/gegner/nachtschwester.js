// Die Nachtschwester (Waisenhaus am Deich). Diakonisse, seit 1913 im Haus. Sie macht jede Nacht die Runde
// durch den Schlafsaal und zählt. Schmal, steif, im langen Kleid mit Schürze und der eng anliegenden Haube,
// deren Bänder unter dem Kinn zur Schleife gebunden sind. Sie trägt den Schlüsselbund: einen Eisenring,
// so groß wie ein Fassreifen, mit einem Schlüssel für jedes Bett. Jede Nacht ist ein Schlüssel mehr daran,
// und alle Schlüssel tropfen.
'use strict';
const LIB = require('../lib');
// Innere Randlicht-Stufe: wo ein Teil vor einem anderen liegt, fängt seine Lichtkante eine Linie Licht
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
module.exports = {
  id: 'nachtschwester', biom: 'waisenhaus', zone: 'waisenhaus', w: 96, h: 120, fuss: [54, 115], kopf: [48, 22], rimBis: 113,
  varianten: {
    // a: den Ring vor sich in der ausgestreckten Hand, wie eine Laterne
    nachtschwester_a: { ring: 'hand', R: 16, keys: 17 },
    // b: der Ring hängt an einer Kette vom Gürtel und schleift; in der erhobenen Hand ein einzelner Schlüssel
    nachtschwester_b: { ring: 'kette', R: 15, keys: 15, offen: true },
  },
  // Silhouetten-Probe (verworfen): der Ring klein am Gürtel; schwarz las sie sich als irgendeine Frau im langen
  // Kleid (Hirte, Opfernde, Kontrolleurin). Erst der übergroße Ring mit dem Loch in der Mitte macht sie eindeutig.
  proben: { sil_guertel: { ring: 'guertel', R: 7, keys: 6 } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, hub = 0, fall = 0, knie = 0, schw = 0, kling = 0;
    // hub: 0 Ring unten vor ihr, 1 hoch hinter der Schulter, 2 nach vorn unten geschlagen
    if (p.idle) { atem = [0, 0, 1, 1][f]; kling = f; }
    if (p.angriff) { lean = [2, 4, -6, -2][f]; hub = [0.5, 1, 2, 1.4][f]; kling = f + 1; }
    if (p.treffer) { lean = [3, 1][f]; schw = 2; }
    if (p.tod) { knie = Math.min(1, p.q * 1.4); fall = r(p.q * 16); lean = r(p.q * 3); }
    const T = atem + fall, cx = 56 + lean;
    // Kleid: schmal oben, bis zum Boden ausgestellt, vorn leicht vorgebeugt
    const sy = 44 + T, hy = 66 + T;
    const kleid = Pg([[cx - 7, sy - 3], [cx + 6, sy - 3], [cx + 10, sy + 6], [cx + 10, hy], [cx + 15 - knie * 2, 100 + knie * 2], [cx + 18, 115], [cx - 17 - knie * 4, 115], [cx - 13, 100], [cx - 10, hy], [cx - 11, sy + 6]], null, { rd: 2.5 });
    // Schürze: vorn, vom Latz bis knapp über den Saum
    const schuerze = Pg([[cx - 9, sy + 1], [cx - 1, sy + 1], [cx, hy - 2], [cx + 3, 104], [cx - 2, 108], [cx - 15 - knie * 3, 108], [cx - 13, hy + 4], [cx - 11, hy - 2]], 'haut', { rd: 1.5 });
    // Kopf mit Haube: die Haube umrahmt das Gesicht, hinten tiefer; die Bänder fallen zur Schleife
    const kx = cx - 5, ky = 30 + T;
    // Haube: gestärkter Schirm, der vorn über das Gesicht ragt (Diakonissenhaube), hinten der Knoten im Tuch
    const haube = Pg([[kx - 9, ky - 5], [kx - 4, ky - 11], [kx + 4, ky - 12], [kx + 10, ky - 8], [kx + 13, ky - 1], [kx + 12, ky + 6], [kx + 8, ky + 10], [kx + 2, ky + 9], [kx - 2, ky + 7], [kx - 8, ky + 4], [kx - 10, ky + 1]], 'haut', { rd: 1.4, tone: 0.55 });
    const gesicht = E(kx - 3, ky + 1, 4, 5.4, null, { pf: 'bevel' });
    const schleife = [E(kx - 3, ky + 9, 2.4, 1.6, 'haut'), C(kx - 3, ky + 10, kx - 6, ky + 15, 1, 0.8, 'haut'), C(kx - 2, ky + 10, kx, ky + 15, 1, 0.8, 'haut')];
    const hals = C(kx + 1, ky + 6, cx - 1, sy, 2.6, 3.2, null);
    // weißer Schulterkragen über dem Kleid
    const kragen = Pg([[cx - 10, sy - 1], [cx - 4, sy - 5], [cx + 5, sy - 5], [cx + 11, sy], [cx + 11, sy + 4], [cx + 3, sy + 3], [cx - 4, sy + 5], [cx - 11, sy + 4]], 'haut', { rd: 1.2, tone: 0.2 });
    // Arme. Vorn (links im Bild) hält sie den Ring.
    const schV = [cx - 6, sy + 2], schH = [cx + 6, sy + 2];
    let handV, ellV;
    if (v.ring === 'hand') {
      if (hub === 0) { ellV = [cx - 13, sy + 14]; handV = [cx - 20 + schw * 0.5, sy + 20]; }
      else if (hub < 1.5) { ellV = [cx + 2 - hub * 4, sy - 6]; handV = [cx + 8 + hub * 2, sy - 16 - hub * 4]; }
      else { ellV = [cx - 16, sy + 4]; handV = [cx - 26, sy + 12]; }
    } else { ellV = [cx - 12, sy + 12]; handV = [cx - 15, sy - 4 - (hub ? 6 : 0)]; }
    if (p.tod) { ellV = [cx - 12, sy + 14 + fall * 0.2]; handV = [cx - 18, sy + 26]; }
    const armV = [...glied([schV, ellV, handV], 2.8, 2.2, null), E(handV[0], handV[1], 2.4, 2.2, 'haut')];
    const armH = [...glied([schH, [cx + 10, sy + 14], [cx + 4, hy - 1]], 2.6, 2.2, null), E(cx + 3, hy, 2.2, 2, 'haut')];
    // Ring: Mittelpunkt hängt unter der Hand (a) oder an der Kette vom Gürtel (b)
    const R = v.R;
    let rx, ry;
    if (v.ring === 'hand') { rx = handV[0] - (hub === 1 ? -2 : 1) + schw; ry = handV[1] + R + 1; if (hub >= 1.5) { rx = handV[0] - 6; ry = handV[1] + R - 4; } }
    else if (v.ring === 'kette') { rx = cx - 22 + schw; ry = 115 - R; if (hub >= 1.5) { rx -= 8; ry -= 6; } }
    else { rx = cx - 13; ry = hy + 6; }
    if (p.tod) { rx = cx - 26 - p.q * 6; ry = 115 - R + (p.q > 0.5 ? 0 : 0); }
    const ring = [];
    for (let i = 0; i < 24; i++) { const a0 = i / 24 * Math.PI * 2, a1 = (i + 1) / 24 * Math.PI * 2; ring.push(C(rx + Math.cos(a0) * R, ry + Math.sin(a0) * R, rx + Math.cos(a1) * R, ry + Math.sin(a1) * R, 1.3, 1.3, null)); }
    const kette = [];
    if (v.ring === 'kette') { const gx = cx - 10, gy = hy + 1; for (let i = 0; i < 6; i++) { const t = i / 5, x = gx + (rx - gx) * t, y = gy + (ry - R - gy) * t + Math.sin(t * Math.PI) * 5; kette.push(i % 2 ? C(x - 1, y, x + 1, y, 0.9, 0.9, null) : E(x, y, 1.6, 1.2, null)); } }
    // Schlüssel: hängen am Ring nach unten (auch die oberen hängen durch das Loch), je einer mit Bart
    const keys = [], keyPos = [];
    const nK = v.keys;
    for (let i = 0; i < nK; i++) {
      const a = Math.PI * 0.08 + i / nK * Math.PI * 2;
      const ax = rx + Math.cos(a) * R, ay = ry + Math.sin(a) * R;
      const len = 6 + ((i * 7) % 4) + (Math.sin(a) > 0.3 ? 1 : 0);
      const sx = i % 4 === 0 ? ((i + kling) % 3) - 1 : 0; // klingeln: nur jeder vierte Schlüssel pendelt
      const ex = ax + sx * 0.6, ey = ay + len;
      keys.push(C(ax, ay + 1, ex, ey, 0.6, 0.6, null, { pf: 'flat' }));
      keys.push(Pg([[ex - 0.4, ey - 2], [ex + 2.4, ey - 2], [ex + 2.4, ey + 0.6], [ex - 0.4, ey + 0.6]], null, { pf: 'flat' }));
      keyPos.push([ax, ay, ex, ey]);
    }
    // b: ein einzelner großer Schlüssel in der erhobenen Hand
    const einzel = [];
    if (v.ring === 'kette' && !p.tod) { const hx = handV[0], hy2 = handV[1]; einzel.push(E(hx - 1, hy2 - 4, 2.6, 2.6, null), C(hx - 1, hy2 - 1, hx - 1, hy2 + 9, 0.8, 0.8, null, { pf: 'flat' }), Pg([[hx - 1, hy2 + 6], [hx - 5, hy2 + 6], [hx - 5, hy2 + 9], [hx - 1, hy2 + 9]], null, { pf: 'flat' })); }
    const gruppen = [
      { p: armH, k: 1, kante: true },
      { p: [kleid], k: 2 },
      { p: kette, k: 0, kante: true },
      { p: [hals], k: 1 },
      { p: [schuerze], k: 1, tone: 0.32 },
      { p: [kragen], k: 0.5, kante: true },
      { p: [haube], k: 1, kante: true },
      { p: [gesicht], k: 0.5, kante: true },
      { p: schleife, k: 0.5, kante: true },
      { p: armV, k: 1, kante: true },
      { p: einzel, k: 0, kante: true },
      { p: ring, k: 0.4, kante: true },
      { p: keys, k: 0, kante: true },
    ];
    const KLEID = 1, SCHUERZE = 4, KRAGEN = 5, HAUBE = 6, GES = 7, RING = 11, KEYS = 12;
    gruppen.forEach(g => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waisenhaus'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - lean, y - T);
      // Kleid: Falten vom Gürtel abwärts, Knopfleiste oben, Saum dunkel
      for (let y = sy; y < 115; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, KLEID)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (y - hy) / (115 - hy);
        if (y > sy + 4) for (const fx of [cx + 2, cx + 6, cx + 9, cx - 14]) { const uu = Math.max(0, (y - sy) / (115 - sy)); const lx = fx + (fx - cx) * uu * 0.55; if (Math.abs(x - lx) < 0.6) P.set(x, y, 'k0'); else if (Math.abs(x - lx - 1) < 0.6 && b(x, y) < 0.3 + uu * 0.5) P.set(x, y, 'k3'); else if (Math.abs(x - lx - 2) < 0.6 && b(x, y) < uu * 0.35) P.set(x, y, 'k2'); }
        if (y > 112) P.set(x, y, 'k0');
      }
      // Gürtel mit Schnalle (Messing)
      for (let x = cx - 12; x <= cx + 10; x++) { if (ist(x, hy - 1, KLEID) || ist(x, hy - 1, SCHUERZE)) { P.set(x, hy - 1, 'k0'); if (P.get(x, hy - 2) && P.get(x, hy - 2) <= 4) P.set(x, hy - 2, x > cx - 2 ? 'r1' : 'k2'); } }
      P.auf(cx - 2, hy - 1, 'ocker');
      // Schürze: Latz, Saum, Faltenlinien; Kalk nur an der Lichtkante und als Bügelfalte
      for (let y = sy; y < 110; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, SCHUERZE)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (!ist(x + 1, y, SCHUERZE) && (y < sy + 12 || ((y & 1) && y < hy + 10))) P.set(x, y, 'r1');
        if (!ist(x - 1, y, SCHUERZE) && y < 104) P.set(x, y, 'k1');
        if (y > hy + 6 && Math.abs(x - (cx - 6 - (y - hy) * 0.12)) < 0.6) P.set(x, y, 'k1');
        if (!ist(x, y + 1, SCHUERZE)) P.set(x, y, 'k1');
        if (Math.abs(y - (hy + 14)) < 0.6 && b(x, y) < 0.5) P.set(x, y, 'k1');
      }
      // Kragen: Saum unten dunkel, Kante hell gesäumt
      for (let y = sy - 6; y < sy + 7; y++) for (let x = cx - 12; x < cx + 13; x++) { if (!ist(x, y, KRAGEN)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; if (!ist(x, y + 1, KRAGEN)) P.set(x, y, 'k0'); else if (!ist(x, y + 2, KRAGEN) && b(x, y) < 0.5) P.set(x, y, 'kalk'); else P.set(x, y, b(x, y) < 0.4 ? 'r1' : 'k3'); }
      // Tasche der Schürze mit einem Zettel (die Liste)
      for (let x = cx - 10; x <= cx - 4; x++) P.auf(x, hy + 9, 'k1');
      P.auf(cx - 8, hy + 8, 'kalk'); P.auf(cx - 7, hy + 8, 'kalk');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Haube: gestärktes Leinen, Kante hell, Rüsche um das Gesicht, nasse Strähne fällt unter dem Rand hervor
      for (let y = ky - 11; y < ky + 11; y++) for (let x = kx - 8; x < kx + 13; x++) {
        if (!ist(x, y, HAUBE)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (ist(x - 1, y, GES) || ist(x - 1, y + 1, GES) || ist(x, y + 1, GES)) P.set(x, y, (y & 1) ? 'kalk' : 'k3');
        else if (Math.abs(x - (kx + 5 + (y - ky) * 0.25)) < 0.6 && y > ky - 9) P.set(x, y, 'k1');
        else if (x > kx + 6 && y > ky - 9 && y < ky + 7 && b(x, y) < 0.45) P.set(x, y, 'k3');
        // gestärktes Leinen: hell gedithert (Licht von hinten oben scheint durch den Stoff)
        else if (x < kx + 5 + (y - ky) * 0.25 && y < ky + 6) P.set(x, y, b(x, y) < 0.5 ? 'r1' : 'k3');
      }
      for (let i = 0; i < 6; i++) { P.auf(kx + 7, ky + 7 + i, i % 2 ? 'nass' : 'k0'); }
      P.set(kx + 7, ky + 13, 'nass'); P.set(kx + 7, ky + 15 + (f % 2), 'nass');
      // Gesicht: im Schatten, eingefallen; die Augen das rote Nachtlicht
      if (!(p.tod && f >= 1)) {
        P.glow(kx - 3, ky, 6, 0.85, 'glutDim', 'k3');
        P.set(kx - 5, ky, 'kern'); P.set(kx - 4, ky, 'glut'); P.set(kx - 1, ky, 'glut');
        augen.push([kx - 5, ky], [kx - 1, ky]);
      }
      P.auf(kx - 4, ky + 3, 'k0'); P.auf(kx - 3, ky + 3, 'k0'); P.auf(kx - 2, ky + 4, 'k1');
      // Ring und Schlüssel: Eisen, oben Licht, unten Messing an manchen Bärten; es tropft
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, RING)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const a = Math.atan2(y + 0.5 - ry, x + 0.5 - rx);
        const dx = x + 0.5 - rx, dy = y + 0.5 - ry, d = Math.hypot(dx, dy);
        if (d > R && (Math.cos(a) * 0.9 - Math.sin(a) * 0.5) > 0.35) P.set(x, y, 'r2');
        else if (d < R && (Math.cos(a) * 0.9 - Math.sin(a) * 0.5) < -0.4) P.set(x, y, 'r1');
        else P.set(x, y, d > R ? 'k3' : 'k1');
      }
      keyPos.forEach(([ax, ay, ex, ey], i) => {
        if (i % 4 === 1) { P.auf(ex + 1, ey - 1, 'ocker'); P.auf(ex + 2, ey, 'ocker'); }
        else P.auf(ex + 2, ey - 1, 'r1');
        P.auf(ax + 0.5, ay + 2, 'k3');
        // Tropfen
        if (i % 3 === (kling % 3) && !p.tod) { P.set(ex + 1, ey + 3 + (f % 2), 'nass'); }
      });
      // der neue Schlüssel: blank, frisch; er hängt als letzter
      if (keyPos.length) { const [, , ex, ey] = keyPos[keyPos.length - 1]; P.auf(ex, ey - 1, 'kalk'); P.auf(ex + 1, ey, 'kalk'); }
      // Kette (b) und einzelner Schlüssel
      if (v.ring === 'kette' && !p.tod) { const hx = handV[0], hy2 = handV[1]; P.auf(hx - 1, hy2 - 4, 'k0'); P.auf(hx, hy2 - 5, 'r2'); P.auf(hx - 4, hy2 + 7, 'ocker'); P.auf(hx - 1, hy2 + 2, 'r1'); }
      // Hände blass
      P.auf(handV[0] - 1, handV[1] + 1, 'kalk');
      // Lichtkante oben rechts an Schulter und Haube kräftiger
      const z = [];
      for (let y = 0; y < 112; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 4) continue; if (gid[y * W + x] !== KLEID && gid[y * W + x] !== HAUBE) continue; if (!P.get(x + 1, y) && !P.get(x + 1, y - 1) && y < hy + 12) z.push([x, y]); }
      for (const [x, y] of z) P.set(x, y, 'r2');
    };
    return { gruppen, details, augen };
  },
};
