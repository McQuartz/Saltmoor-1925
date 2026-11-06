// Wächter Waisenhaus: Die Heimleiterin. Hoch, schmal, im schwarzen Kleid von 1890 mit Keulenärmeln und
// Stehkragen, das Haar zum Knoten gedreht. Sie hält das Aufnahmebuch aufgeschlagen auf dem Unterarm und hält
// Appell: In der anderen Hand die Feder, mit der sie jeden einträgt, der antwortet. Hinter ihr stehen die
// Kinder in einer Reihe, nach hinten kleiner, und es sind mehr, als Platz ist. Alle haben nasses Haar.
'use strict';
const LIB = require('../lib');
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
  id: 'heimleiterin', biom: 'waisenhaus', zone: 'waisenhaus', rang: 'waechter', w: 160, h: 180, fuss: [70, 176], kopf: [64, 14], rimBis: 177,
  varianten: { heimleiterin: { kinder: 4 } },
  // Silhouetten-Probe (verworfen): sie sitzt am Pult mit dem Buch; schwarz zu nah am Abschreiber (Kloster) und
  // ohne die Reihe der Kinder nur eine Frau am Tisch. Genommen: stehend, Buch auf dem Arm, die Reihe hinter ihr.
  proben: { probe_ohne_reihe: { kinder: 0 } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    let atem = 0, lean = 0, hebe = 0, zu = 0, fall = 0, feder = 0, reihe = 0;
    // hebe: Buch hoch (0..1), zu: Buch zugeschlagen (0..1), feder: Feder hoch
    if (p.idle) { atem = [0, 0, 1, 1][f]; feder = [0, 0.2, 0.2, 0][f]; }
    if (p.angriff) { lean = [2, 4, -9, -4][f]; hebe = [0.4, 1, 0.3, 0.1][f]; zu = [0, 0.2, 1, 0.6][f]; feder = [0.8, 1, 0, 0][f]; reihe = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 4); }
    const T = fall, cx = 60 + lean;
    // Rock: glockig bis zum Boden, hinten eine Schleppe
    const wy = 94 + T;
    const rock = Pg([[cx - 9, wy], [cx + 9, wy], [cx + 17, 130], [cx + 24, FY - 6], [cx + 30, FY], [cx - 26, FY], [cx - 22, FY - 8], [cx - 16, 130]], null, { rd: 2.5 });
    // Mieder: eng, Brust vorgewölbt
    const mieder = Pg([[cx - 9, wy + 1], [cx - 13, 74 + T], [cx - 12, 60 + T], [cx - 6, 54 + T], [cx + 7, 54 + T], [cx + 11, 62 + T], [cx + 9, 80 + T], [cx + 9, wy + 1]], null, { rd: 2 });
    // Keulenärmel: hohe Puffen an den Schultern
    const puffV = E(cx - 11, 60 + T, 8, 7.5, null), puffH = E(cx + 9, 59 + T, 7.5, 7.5, null);
    // Stehkragen und Kopf, Haarknoten oben
    const hals = Pg([[cx - 6, 55 + T], [cx - 5, 45 + T], [cx + 3, 45 + T], [cx + 5, 55 + T]], null, { rd: 1 });
    const kx = cx - 3, ky = 39 + T + atem;
    const kopf = E(kx, ky, 7, 8.6, 'haut', { pf: 'bevel' });
    const knoten = [E(kx + 3, ky - 11, 5.2, 4.6, null), E(kx + 2, ky - 6, 7.4, 4, null)];
    // Buch: aufgeschlagen auf dem vorderen Unterarm, zur Seite gekippt, so dass man die Seiten sieht
    const bh = hebe * 30, bx = cx - 30 - lean * 0.3, by = 84 + T - bh;
    const bz = zu; // zugeschlagen: die Seiten werden schmal
    const seiten = Pg([[bx - 18 + bz * 12, by - 2 + bz * 4], [bx + 16, by - 9], [bx + 18, by + 5], [bx - 16 + bz * 12, by + 11 - bz * 2]], 'haut', { rd: 0.6, pf: 'flat', tone: 0.35 });
    const deckel = Pg([[bx - 19 + bz * 12, by + 10 - bz * 2], [bx + 18, by + 4], [bx + 19, by + 8], [bx - 18 + bz * 12, by + 14 - bz * 2]], 'dunkel', { rd: 0.4 });
    // Arme: vorn trägt sie das Buch, hinten hält sie die Feder
    const armV = [...glied([[cx - 13, 64 + T], [cx - 20, 80 + T - bh * 0.5], [bx + 2, by + 10]], 3.6, 2.8, null), E(bx + 1, by + 11, 3, 2.6, 'haut')];
    const fh = [cx - 10 - feder * 6, 76 + T - feder * 30 - hebe * 6];
    const armH = [...glied([[cx + 8, 64 + T], [cx + 4, 80 + T - feder * 10], fh], 3.4, 2.6, null), E(fh[0], fh[1], 2.6, 2.4, 'haut')];
    const federP = [C(fh[0] - 1, fh[1] + 2, fh[0] - 6, fh[1] - 10, 0.7, 0.5, null, { pf: 'flat' }), C(fh[0] - 5, fh[1] - 8, fh[0] - 9, fh[1] - 15, 1.6, 0.6, null, { pf: 'flat' })];
    // Chatelaine: Kette mit Taschenuhr am Gürtel
    const kette = [C(cx - 4, wy + 1, cx - 6, wy + 16, 0.6, 0.6, null, { pf: 'flat' }), E(cx - 6, wy + 19, 2.6, 2.6, null)];
    // die Reihe: Kinder hinter ihr, nach hinten kleiner und höher
    const kinder = [];
    for (let i = 0; i < v.kinder; i++) {
      const s = [1, 0.86, 0.8, 0.66][i], kxx = cx + 38 + [0, 19, 35, 48][i] + (reihe && i < 3 ? -reihe * (3 - i) * 0.5 : 0), fy = FY - 2 - i * 8, hh = 60 * s;
      if (kxx > 156) break;
      const top = fy - hh;
      kinder.push({ i, s, x: kxx, fy, top, formen: [
        Pg([[kxx - 3.5 * s, top + 15 * s], [kxx + 3.5 * s, top + 15 * s], [kxx + 5.5 * s, top + 21 * s], [kxx + 9 * s, fy - 3], [kxx - 8 * s, fy - 3], [kxx - 5.5 * s, top + 21 * s]], 'haut', { rd: 1.2, tone: 0.1 }),
        E(kxx - 1, top + 8 * s, 7.4 * s, 7.8 * s, 'haut', { pf: 'bevel' }),
        Pg([[kxx + 1 * s, top + 1 * s], [kxx + 6 * s, top + 5 * s], [kxx + 5 * s, top + 26 * s], [kxx + 2 * s, top + 24 * s]], null, { rd: 0.6 }),
        C(kxx - 3 * s, fy - 3, kxx - 3 * s, fy, 1.2, 1, 'haut'), C(kxx + 3 * s, fy - 3, kxx + 3 * s, fy, 1.2, 1, 'haut'),
      ] });
    }
    const gruppen = [];
    // hinterste Kinder zuerst
    for (const k of kinder.slice().reverse()) gruppen.push({ p: k.formen, k: 0.6, kante: true, kind: k });
    const N0 = gruppen.length;
    gruppen.push(
      { p: armH, k: 1, kante: true },
      { p: [puffH], k: 1, kante: true },
      { p: [rock], k: 2, kante: true },
      { p: [mieder], k: 1.5, kante: true },
      { p: kette, k: 0, kante: true },
      { p: [hals], k: 1, kante: true },
      { p: knoten, k: 1, kante: true },
      { p: [kopf], k: 0.5, kante: true },
      { p: [puffV], k: 1, kante: true },
      { p: armV, k: 1, kante: true },
      { p: [deckel], k: 0, kante: true },
      { p: [seiten], k: 0, kante: true },
      { p: federP, k: 0, kante: true },
    );
    const ARMH = N0, ROCK = N0 + 2, MIEDER = N0 + 3, KETTE = N0 + 4, HALS = N0 + 5, KNOTEN = N0 + 6, KOPF = N0 + 7, PUFFV = N0 + 8, DECKEL = N0 + 10, SEITEN = N0 + 11, FEDER = N0 + 12;
    gruppen.forEach(g => { g.anker = g.kind ? [0, 0] : [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waisenhaus'), { rimBis: 177 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - lean, y - T);
      // Rock: Falten fächern vom Gürtel, Saum mit Volant, Licht an der Schleppe
      for (let y = wy; y < FY + 1; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, ROCK)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (y - wy) / (FY - wy);
        for (const o of [-14, -6, 3, 12, 22]) { const lx = cx + o * u * 1.1 + (o > 0 ? o * 0.15 : 0); if (Math.abs(x - lx) < 0.6) P.set(x, y, 'k0'); else if (Math.abs(x - lx - 1) < 0.6 && b(x, y) < 0.3 + u * 0.5) P.set(x, y, 'k3'); }
        // Licht vom Fenster hinten rechts: die rechte Seite des Rocks fängt einen breiten, gedämpften Schein (Fase)
        { let rr = x; while (ist(rr + 1, y, ROCK)) rr++; const d = rr - x; if (d < 7 && d > 1 && b(x, y) < 0.55 - d * 0.07) P.set(x, y, d < 3 ? 'k3' : 'k2'); }
        if (y > FY - 8 && y < FY - 5) P.set(x, y, y === FY - 7 ? 'k0' : (b(x, y) < 0.5 ? 'k3' : c));
        if (y >= FY - 1) P.set(x, y, 'k0');
      }
      // Mieder: Knopfleiste (Messing), Abnäher, Gürtel
      for (let y = 56 + T; y < wy; y += 3) P.auf(cx - 10 + (y - 56 - T) * 0.05, y, 'ocker');
      for (let y = 58 + T; y < wy; y++) { P.auf(cx - 4, y, 'k0'); if (b(cx - 3, y) < 0.5) P.auf(cx - 3, y, 'k3'); P.auf(cx + 4, y, 'k0'); }
      for (let x = cx - 10; x <= cx + 9; x++) { P.auf(x, wy, 'k0'); P.auf(x, wy - 1, x > cx ? 'r1' : 'k2'); }
      // Ärmelpuffen: Raffungen
      for (const [px, py, g] of [[cx - 11, 60 + T, PUFFV], [cx + 9, 59 + T, ARMH + 1]]) for (let i = -2; i <= 2; i++) for (let k = -5; k <= 5; k++) { const x = px + i * 2.6, y = py + k; if (ist(x, y, g) && P.get(r(x), r(y)) <= 4) P.set(x, y, (k + i) % 2 ? 'k1' : 'k2'); }
      // Spitzenkragen: helle Punkte am Stehkragen
      for (let x = cx - 6; x <= cx + 4; x++) { if ((x & 1) && ist(x, 54 + T, HALS)) P.set(x, 54 + T, 'kalk'); if (ist(x, 46 + T, HALS)) P.set(x, 46 + T, (x & 1) ? 'kalk' : 'k3'); }
      // Kette und Taschenuhr
      P.auf(cx - 6, wy + 19, 'ocker'); P.auf(cx - 5, wy + 18, 'kalk');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kopf: Haar straff zurück, nass glänzend; Gesicht hager; Kneifer fängt das rote Licht
      for (let y = r(ky - 16); y <= r(ky + 9); y++) for (let x = r(kx - 8); x <= r(kx + 11); x++) {
        const g = gid[y * W + x]; if (g !== KOPF && g !== KNOTEN) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const dx = x + 0.5 - kx, dy = y + 0.5 - ky;
        if (g === KNOTEN || dy < -4 + Math.max(0, dx) * 0.6 || dx > 3) P.set(x, y, (x * 3 + y * 2) % 11 === 0 ? 'nass' : ((x + y) & 1) && dy < -2 ? 'k2' : 'k1');
        else P.set(x, y, dx < -5 ? 'k2' : (dy > 4 ? 'k2' : 'k3'));
      }
      // Mund schmal, Wangen eingefallen
      P.auf(kx - 6, ky + 4, 'k0'); P.auf(kx - 5, ky + 4, 'k0'); P.auf(kx - 3, ky + 2, 'k1'); P.auf(kx - 3, ky + 3, 'k1');
      if (!(p.tod && f >= 1)) {
        P.glow(kx - 4, ky - 1, 8, 0.9, 'glutDim', 'k3');
        P.set(kx - 6, ky - 1, 'kern'); P.set(kx - 5, ky - 1, 'glut'); P.set(kx - 2, ky - 1, 'glut');
        P.set(kx - 7, ky - 2, 'kalk'); P.set(kx - 3, ky - 2, 'kalk'); P.set(kx - 4, ky - 1, 'k0');
        augen.push([r(kx - 6), r(ky - 1)], [r(kx - 2), r(ky - 1)]);
      }
      // Buch: die Seiten hell, Zeilen voll Namen (dunkle Striche), die Mitte (Falz) dunkel, Messingecken
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, SEITEN)) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue;
        const u = (x - (bx - 18 + bz * 12)) / (34 - bz * 12);
        const zl = Math.floor((y - by + (x - bx) * 0.15) + 30) % 3;
        const wort = Math.floor((x - bx + 40 + (Math.floor(y / 3) % 2) * 2) / 4) % 3 !== 2;
        if (Math.abs(u - 0.52) < 0.03) P.set(x, y, 'k1');
        else if (zl === 0 && wort && Math.abs(u - 0.52) > 0.06 && u > 0.08 && u < 0.95) P.set(x, y, 'k1');
        else P.set(x, y, (u > 0.6 && b(x, y) < 0.35) || (u < 0.45 && u > 0.1 && b(x, y) < 0.12) ? 'kalk' : 'k3');
      }
      for (const [x, y] of [[bx - 18 + bz * 12, by + 12], [bx + 18, by + 5]]) { P.auf(x, y, 'ocker'); P.auf(x + 1, y, 'ocker'); }
      // die letzte Zeile ist frisch: ein Tropfen rote Tinte (das Licht des Buchs)
      if (!p.tod && zu < 0.5) { P.set(bx + 6, by + 3, 'glut'); P.glow(bx + 6, by + 3, 4, 0.5, 'glutDim', 'k3'); }
      // Feder: Kiel hell
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, FEDER) && P.get(x, y) <= 4 && (x + y) % 2) P.set(x, y, 'k3');
      // Kinder: Nachthemd, nasses Haar, Augen rot (klein)
      for (const k of kinder) {
        const gi = gruppen.findIndex(g => g.kind === k);
        const hx = k.x - 1, hy = k.top + 8 * k.s;
        for (let y = r(k.top - 1); y < k.fy + 1; y++) for (let x = r(k.x - 10); x < r(k.x + 10); x++) {
          if (!ist(x, y, gi)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          const dx = x + 0.5 - hx, dy = y + 0.5 - hy;
          if (Math.hypot(dx / (7.4 * k.s), dy / (7.8 * k.s)) < 1) { if (dy < -3 * k.s || dx > 2) P.set(x, y, (x + y) % 5 ? 'k1' : 'nass'); else P.set(x, y, dx < -4 ? 'k2' : 'k3'); }
          else if (y > hy + 6 && !ist(x, y + 1, gi)) P.set(x, y, 'k0');
          else if (y > hy + 8 * k.s && Math.abs(x - k.x) < 0.6) P.set(x, y, 'k1');
        }
        if (!(p.tod && f >= 1) && k.i < 4) { P.set(hx - 3 * k.s, hy, 'glut'); P.set(hx, hy, 'glutDim'); }
        if (!p.tod) P.set(k.x + 5 * k.s, k.top + 24 * k.s + ((f + k.i) % 2) * 2, 'nass');
      }
      // Lichtkante: Knoten, Puffen, Schultern, Schleppe kräftig
      const z = [];
      for (let y = 0; y < FY - 2; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y]); }
      for (const [x, y] of z) P.set(x, y, 'r2');
    };
    return { gruppen, details, augen };
  },
};
