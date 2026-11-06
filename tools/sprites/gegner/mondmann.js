// Der Mond unter dem Eis, zweiter Wächter: Der Mann im Mond. Der aus dem Bauernkalender, der am Sonntag Reisig
// gesammelt hat und dafür auf den Mond musste. Er ist immer noch unterwegs, gebückt unter einem Bündel, größer
// als er selbst, mit Stock und Laterne. Das Falsche ist das Bündel: Es ist kein Reisig. Es sind die Sprossen
// der Strickleiter von 1890, zusammengeschnürt, und an manchen hängen noch die Hände, die sich daran festhielten.
// Er geht auf Asche, in der jede Spur bleibt, und hinterlässt keine (darum kein Bodenschatten unter ihm). Was er trägt, lädt er dir auf (Kniff
// abschrift: „Reisig“). Phase 2 (mondmann_p2, „Ohne Last“): Er wirft das Bündel ab und richtet sich auf, und
// erst jetzt sieht man, wie groß er ist.
// Randlicht Erdschein-Blau (Zone mond_erde): Das Licht, das die dunkle Seite des Mondes von der Erde bekommt.
// Die Szene der Rückseite ist grau und bleichgelb, das kalte Blau kommt dort nicht vor.
'use strict';
const LIB = require('../lib');
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'mondmann', biom: 'mond', zone: 'mond_erde', rang: 'waechter', w: 160, h: 180, fuss: [92, 176], kopf: [96, 8], rimBis: 176,
  todStart: 0.2,
  varianten: {
    mondmann: { last: true },
    mondmann_p2: { last: false },
  },
  // Silhouetten-Proben (nicht gebaut): aufrecht mit dem Bündel auf der Schulter (ein Wanderer, das Bündel liest
  // sich als Gewehr oder Sense); das Bündel als runder Sack (ein Lumpensammler, Seepockenmann-nah).
  // Genommen: tief gebückt, das Bündel schräg über ihm wie ein Dornenkamm, Stock mit Laterne vorn.
  proben: {
    probe_aufrecht: { last: true, aufrecht: true },
    probe_sack: { last: true, sack: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    // hebe: Bündel (Winkel, negativ = zurück/hoch, positiv = nach vorn geschlagen); lean; schw: Laterne
    let lean = 0, dy = 0, hebe = 0, schw = 0, fall = 0, stock = 0;
    if (p.idle) { dy = [0, 0, 1, 1][f]; schw = [0, 1, 0, -1][f]; }
    if (p.angriff) { lean = [4, 6, -8, -4][f]; hebe = [-0.25, -0.45, 0.42, 0.2][f]; dy = [0, -2, 2, 1][f]; schw = [2, 3, -3, -2][f]; stock = [0.1, 0.2, -0.3, -0.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; hebe = -0.08; }
    if (p.tod) { fall = r(p.q * 22); lean = r(p.q * 4); hebe = p.q * 0.3; }
    const aufrecht = !v.last || v.aufrecht;
    const T = dy + fall, L = lean;
    // Beine im Schritt, langer Mantel, gebeugter Rücken; ohne Last aufrecht und viel größer
    const hip = aufrecht ? [96 + L, 100 + T] : [102 + L, 120 + T];
    const sho = aufrecht ? [92 + L, 40 + T] : [78 + L, 86 + T];
    const kopf = aufrecht ? [86 + L, 25 + T] : [64 + L, 86 + T];
    const beinV = glied([[hip[0] - 4, hip[1]], [hip[0] - 12, (hip[1] + FY) / 2 + 4], [hip[0] - 18, FY - 2]], 4, 2.8, null);
    const beinH = glied([[hip[0] + 4, hip[1]], [hip[0] + 14, (hip[1] + FY) / 2], [hip[0] + 16, FY - 2]], 4, 2.8, 'dunkel');
    const schuhe = [E(hip[0] - 21, FY - 1, 5, 2.4, 'dunkel'), E(hip[0] + 14, FY - 1, 4.5, 2.2, 'dunkel')];
    // Mantel: von den Schultern über den Rücken bis unter die Hüfte, der Saum zerrissen
    const mx = (sho[0] + hip[0]) / 2;
    const mantel = Pg(aufrecht
      ? [[sho[0] - 7, sho[1] - 3], [sho[0] + 3, sho[1] - 6], [sho[0] + 11, sho[1] + 2], [hip[0] + 13, hip[1]], [hip[0] + 18, hip[1] + 26], ...saum(hip[0] + 18, hip[0] - 20, hip[1] + 30, 6, 6, 5), [hip[0] - 18, hip[1] + 24], [hip[0] - 13, hip[1]], [sho[0] - 12, sho[1] + 10]]
      : [[sho[0] - 10, sho[1] + 6], [sho[0] - 4, sho[1] - 8], [mx + 8, sho[1] - 14], [hip[0] + 14, hip[1] - 10], [hip[0] + 16, hip[1] + 12], ...saum(hip[0] + 16, hip[0] - 22, hip[1] + 18, 6, 6, 5), [hip[0] - 22, hip[1] + 8], [sho[0] + 2, sho[1] + 18]], null, { rd: 2 });
    // Kopf: rund, das Gesicht aus dem Bauernkalender (Mondgesicht), Kapuze dahinter
    const kapuze = E(kopf[0] + 5, kopf[1] - 2, 11, 10, 'dunkel');
    const gesicht = E(kopf[0], kopf[1], 9, 9.5, 'haut', { pf: 'bevel' });
    // Stock mit Haken vorn, Laterne daran; der Arm hält ihn
    const sx = aufrecht ? 56 + L : 44 + L;
    const sTop = [sx - 4 + stock * 20, (aufrecht ? 18 : 40) + T], sBot = [sx + 2, FY];
    const stockP = [C(sBot[0], sBot[1], sTop[0], sTop[1], 1.8, 1.5, null), C(sTop[0], sTop[1], sTop[0] - 6, sTop[1] + 2, 1.4, 1.2, null)];
    const lat = [sTop[0] - 7 + schw, sTop[1] + 14];
    const laterne = [C(sTop[0] - 6, sTop[1] + 2, lat[0], lat[1] - 6, 0.6, 0.6, null, { pf: 'flat' }), Pg([[lat[0] - 4, lat[1] - 5], [lat[0] + 4, lat[1] - 5], [lat[0] + 5, lat[1] + 5], [lat[0] - 5, lat[1] + 5]], null, { rd: 0.8 }), E(lat[0], lat[1] - 6, 3.4, 1.6, null)];
    const handS = [sx - 1 + stock * 8, (aufrecht ? 82 : 104) + T];
    const armV = [...glied([[sho[0] - 4, sho[1] + 4], [aufrecht ? sho[0] - 20 : sho[0] - 14, aufrecht ? sho[1] + 22 : sho[1] + 16], handS], 3.6, 2.8, null), E(handS[0], handS[1], 3, 3, 'haut')];
    // ohne Last: der zweite Arm hängt lang bis unter das Knie (er ist größer, als man dachte)
    // im Angriff holt der lange Arm nach hinten aus und fegt dann nach vorn (Drehung um die Schulter)
    const gw = p.angriff ? [-0.35, -0.6, 1.25, 0.7][f] : p.treffer ? -0.15 : 0;
    const AR = ([x, y]) => { const ox = sho[0] + 10, oy = sho[1] + 2, c = Math.cos(gw), si = Math.sin(gw); return [ox + (x - ox) * c - (y - oy) * si, oy + (x - ox) * si + (y - oy) * c]; };
    const armH = aufrecht ? [...glied([[sho[0] + 10, sho[1] + 2], AR([sho[0] + 26, sho[1] + 44]), AR([sho[0] + 28, sho[1] + 104])], 3.6, 2.6, null), ...[0, 1, 2, 3].map(k => C(...AR([sho[0] + 28, sho[1] + 104]), ...AR([sho[0] + 24 + k * 3, sho[1] + 118 + (k % 2) * 3]), 1.3, 0.7, null))] : [];
    // Bündel: schräg über ihm, von hinten unten nach vorn oben, in der Mitte zweimal geschnürt; Stäbe gespreizt
    const buendel = [], haende = [], seil = [];
    if (v.last && !v.sack) {
      const piv = [104 + L, 92 + T]; const ca = Math.cos(hebe), sa = Math.sin(hebe);
      const R = ([x, y]) => [piv[0] + (x - piv[0]) * ca - (y - piv[1]) * sa, piv[1] + (x - piv[0]) * sa + (y - piv[1]) * ca];
      const a0 = [138 + L, 112 + T], a1 = [70 + L, 30 + T];  // Achse: hinten unten -> vorn oben
      const ax = a1[0] - a0[0], ay = a1[1] - a0[1], al = Math.hypot(ax, ay), ux = ax / al, uy = ay / al, nx = -uy, ny = ux;
      for (let i = 0; i < 13; i++) {
        const o = (i - 6) * 3.1, sp = (i - 6) * 1.5, len = 0.86 + ((i * 7) % 5) * 0.045;
        const s0 = [a0[0] - ux * 4 + nx * (o * 0.8 + sp * 0.5), a0[1] - uy * 4 + ny * (o * 0.8 + sp * 0.5)];
        const sm = [(a0[0] + a1[0]) / 2 + nx * o * 0.4, (a0[1] + a1[1]) / 2 + ny * o * 0.4];
        const s1 = [a0[0] + ax * len + nx * (o + sp * 1.4), a0[1] + ay * len + ny * (o + sp * 1.4)];
        buendel.push(C(...R(s0), ...R(sm), 1.8, 2.0, null), C(...R(sm), ...R(s1), 2.0, 1.1, null));
        // an jeder vierten Sprosse: eine Hand, die sich noch daran festhält
        if (i % 4 === 1) { const hp = R([s1[0] - ux * 4, s1[1] - uy * 4]); haende.push({ x: hp[0], y: hp[1], a: Math.atan2(uy, ux) + hebe }); }
      }
      for (const t of [0.42, 0.58]) { const c = [a0[0] + ax * t, a0[1] + ay * t]; seil.push(C(...R([c[0] + nx * 12, c[1] + ny * 12]), ...R([c[0] - nx * 12, c[1] - ny * 12]), 1.6, 1.6, null)); }
      // Leiterstück: zwei Seile und Sprossen hängen hinten aus dem Bündel herab
      const lt = R([a0[0] - 4, a0[1] - 2]);
      for (const dx of [-5, 5]) seil.push(C(lt[0] + dx, lt[1], lt[0] + dx + 2, lt[1] + 34, 0.9, 0.9, null));
      for (let k = 1; k <= 3; k++) seil.push(C(lt[0] - 5, lt[1] + k * 9, lt[0] + 6, lt[1] + k * 9 + 1, 1, 1, null));
    }
    if (v.sack) buendel.push(E(118 + L, 70 + T, 34, 30, null));
    const handFormen = haende.map(h => { const out = [E(h.x, h.y, 2.4, 2, 'haut')]; for (let k = 0; k < 4; k++) { const a = h.a + Math.PI * 0.5 + (k - 1.5) * 0.35; out.push(C(h.x, h.y, h.x + Math.cos(a) * 5, h.y + Math.sin(a) * 5, 0.9, 0.6, 'haut')); } return out; }).flat();
    const gruppen = [
      { p: beinH, k: 0.8, kante: true },                     // 0
      { p: gw > 0.3 ? [] : armH, k: 0.8, kante: true },     // 1
      { p: [...seil.slice(2)], k: 0.4, kante: true },        // 2 Leiterstück
      { p: buendel, k: 0.4 },                                // 3 Bündel
      { p: seil.slice(0, 2), k: 0.4, kante: true },          // 4 Schnüre
      { p: handFormen, k: 0.5, kante: true },                // 5 Hände an den Sprossen
      { p: [mantel], k: 2, kante: true },                    // 6 Mantel
      { p: [...beinV, ...schuhe], k: 0.8, kante: true },     // 7 vorderes Bein
      { p: [kapuze], k: 1, kante: true },                    // 8 Kapuze
      { p: [gesicht], k: 0.5, kante: true },                 // 9 Gesicht
      { p: stockP, k: 0.5, kante: true },                    // 10 Stock
      { p: laterne, k: 0.4, kante: true },                   // 11 Laterne
      { p: armV, k: 0.8, kante: true },                      // 12 Arm
      { p: gw > 0.3 ? armH : [], k: 0.8, kante: true },     // 13 langer Arm vorn (im Schlag)
    ];
    gruppen.forEach(g => { g.anker = [L, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('mond_erde'), { rimBis: 176 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - L, y - T);
      // Bündel: Stäbe einzeln (Rinde dunkel, Sprossenholz grau), Enden hell geschnitten
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 3)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (!ist(x, y + 1, 3) || !ist(x - 1, y + 1, 3)) P.set(x, y, 'k0');
        else if (!ist(x + 1, y - 1, 3) && b(x, y) < 0.6) P.set(x, y, 'k3');
      }
      KA.licht(P, buendel.filter((_, i) => i % 2 === 1 && i % 4 === 1), { c: 'r1', c2: null, luecke: 3 });
      // Hände an den Sprossen: bleich wie Asche
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, 5) && P.get(x, y) <= 4) P.set(x, y, (x + y) % 3 ? 'asche' : 'k3');
      // Mantel: Flicken und Falten, Gürtelstrick
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 6)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (x - L) * 0.7 + (y - T) * 0.3; if (((u % 9) + 9) % 9 < 1) P.set(x, y, 'k0'); else if (((u % 9) + 9) % 9 < 2 && b(x, y) < 0.4) P.set(x, y, c < 4 ? c + 1 : c);
      }
      // Gesicht: Mondgesicht im Profil nach links, Krater als Narben, Augen bleichgelb
      const [gx, gy] = kopf.map(r);
      for (let y = gy - 10; y <= gy + 10; y++) for (let x = gx - 10; x <= gx + 10; x++) {
        if (!ist(x, y, 9)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const dx = x + 0.5 - kopf[0], dy = y + 0.5 - kopf[1];
        P.set(x, y, dx > 4 || dy > 6 ? 'k2' : (dx < -5 ? 'k3' : (b(x, y) < 0.5 ? 'asche' : 'k3')));
      }
      for (const [cx2, cy2, rr] of [[3, -5, 1.6], [-2, 4, 1.2], [5, 2, 1.1], [-5, -3, 0.9]]) { P.el(gx + cx2 + 0.5, gy + cy2 + 0.5, rr, rr, 'k1', true); P.auf(gx + cx2 + 1, gy + cy2 - 1, 'asche'); }
      // Nase und Mund (Profil links), wie im Kalender
      P.auf(gx - 9, gy + 1, 'k3'); P.auf(gx - 10, gy + 2, 'asche'); P.auf(gx - 8, gy + 5, 'k0'); P.auf(gx - 7, gy + 5, 'k0');
      if (!aus) { P.glow(gx - 5, gy - 2, 5, 0.8, 'glutDim', 'k3'); P.set(gx - 6, gy - 2, 'kern'); P.set(gx - 5, gy - 2, 'glut'); P.set(gx - 2, gy - 2, p.idle && f === 2 ? 'k1' : 'glut'); augen.push([gx - 6, gy - 2]); }
      // Laterne: Messingrahmen, die Flamme bleich (das innere Licht), Schein auf Arm und Stock
      const [lx, ly] = lat.map(r);
      for (let y = ly - 4; y <= ly + 4; y++) for (let x = lx - 4; x <= lx + 4; x++) if (ist(x, y, 11) && P.get(x, y) <= 6) P.set(x, y, Math.abs(x - lx) >= 3 || Math.abs(y - ly) >= 4 ? 'messing' : 'k1');
      if (!aus) { P.glow(lx + 0.5, ly + 0.5, 10, 0.85); P.set(lx, ly, 'kern'); P.set(lx, ly - 1, 'glut'); P.set(lx, ly + 1, 'glut'); P.set(lx - 1, ly, 'glutDim'); P.set(lx + 1, ly, 'glutDim'); augen.push([lx, ly]); }
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
    };
    return { gruppen, details, augen };
  },
};
