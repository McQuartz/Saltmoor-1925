// Das Glasmeer, zweiter Wächter: Die Lichtqualle. Das Polarlicht unter dem Glas ist kein Licht. Es ist ein Tier,
// eine Qualle so groß wie ein Zelt, die durch das Glas heraufgestiegen ist. Ihre Vorhänge hängen bis auf den
// Boden und wehen, obwohl hier kein Wind geht. Das Falsche ist in ihrer Glocke: Wo ein Tier seinen Magen hätte,
// hängt die Expedition von 1925, ein Schlitten und drei Männer im Geschirr, klein und schon halb zu Glas
// verdaut. Wer in ihr Licht sieht, erstarrt (Kniff einfrieren). Sie gibt die Vorausgegangenen wieder her
// (ruft den Vorhergehenden).
// Randlicht Violett (Zone glasmeer_licht): die andere Seite des Polarlichts. Die Spiegelwand der Wächter-Szene
// ist grün, das Violett kommt dort nicht vor; das Grün bleibt innen, in der Glocke.
'use strict';
const LIB = require('../lib');
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'lichtqualle', biom: 'glasmeer', zone: 'glasmeer_licht', rang: 'waechter', w: 160, h: 180, fuss: [82, 176], kopf: [82, 6], rimBis: 178,
  todStart: 0.2,
  varianten: { lichtqualle: {} },
  // Silhouetten-Proben (nicht gebaut): flache Glocke mit vielen dünnen Fäden (ein Wischmopp, bei 96 px nur noch
  // Streifen); Glocke ohne Vorhänge (ein Pilz oder eine Lampe). Genommen: hohe Glocke mit gezacktem Saum,
  // sechs breite Vorhänge, die bis zum Boden reichen, in der Mitte die Mundarme.
  proben: {
    probe_faeden: { faeden: true },
    probe_pilz: { ohneVorhang: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    // puls: Glocke zieht sich zusammen (<1) oder weitet sich; hub: Glocke hebt sich; peitsch: Vorhänge nach vorn
    let puls = 1, hub = 0, peitsch = 0, dx = 0, fall = 0, phase = 0;
    let spitze = 0; if (p.idle) { hub = [0, 0, -1, -1][f]; spitze = [0, 1, 2, 1][f]; }
    if (p.angriff) { puls = [0.92, 0.86, 1.1, 1.02][f]; hub = [-4, -8, 4, 2][f]; peitsch = [-0.3, -0.5, 1, 0.5][f]; dx = [2, 3, -8, -4][f]; phase = 1.5 + f; }
    if (p.treffer) { puls = [0.95, 0.98][f]; dx = [3, 1][f]; peitsch = -0.15; }
    if (p.tod) { fall = r(p.q * 50); puls = 1 + p.q * 0.15; peitsch = -0.2; }
    const cx = 80 + dx, by = 58 + hub + fall; // Saum der Glocke
    const bw = 46 * (2 - puls) ** 0.5 * (v.faeden ? 1.15 : 1), bh = 46 * puls * (v.faeden ? 0.6 : 1);
    // Glocke: hoch gewölbt, oben leicht zugespitzt, Saum gezackt (16 Lappen)
    const glocke = [];
    for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; const k = 1 - 0.08 * Math.sin(i / 24 * Math.PI) ** 6; glocke.push([cx + Math.cos(a) * bw, by + Math.sin(a) * bh * k - (i === 12 ? 3 : 0)]); }
    const lappen = [];
    for (let i = 16; i >= 0; i--) { const x = cx - bw + i / 16 * bw * 2; lappen.push([x, by + (i % 2 ? 6 : 1) + Math.sin(i * 1.3 + phase) * 0.6]); }
    const glockeP = Pg([...glocke, ...lappen], null, { rd: 1.5 });
    // Vorhänge: breite Bänder vom Saum bis fast zum Boden, wellig; nach vorn gepeitscht im Angriff
    const vorh = [];
    if (!v.ohneVorhang) {
      const N = v.faeden ? 14 : 6;
      for (let i = 0; i < N; i++) {
        const q = (i + 0.5) / N, x0 = cx - bw * 0.86 + q * bw * 1.72, len = (FY - 4 - by) * (0.82 + ((i * 5) % 3) * 0.08) - (v.faeden ? 0 : 0);
        const breit = v.faeden ? 0.9 : 5 + (i % 2) * 1.6;
        const pts = [];
        for (let k = 0; k <= 10; k++) { const t = k / 10; const sw = Math.sin(t * 4 + phase + i * 0.9) * (2 + t * 4) - peitsch * t * t * (28 + i * 2) + spitze * t ** 4 * (i % 2 ? 1.5 : -1.5); pts.push([x0 + sw, by + 4 + t * len]); }
        const L = [], R = [];
        pts.forEach(([x, y], k) => { const w = breit * (1 - k / 16) * (1 + 0.18 * Math.sin(k * 1.7 + i)); L.push([x - w, y]); R.unshift([x + w, y]); });
        vorh.push(Pg([...L, ...R], null, { rd: 0.6 }));
      }
    }
    // Mundarme: kurz, gekräuselt, unter der Mitte
    const arme = [];
    for (const [o, l] of [[-8, 34], [0, 44], [8, 30]]) { let x = cx + o, y = by + 2; for (let k = 0; k < 6; k++) { const nx = x + Math.sin(k * 1.4 + phase + o) * 3 - peitsch * k * 2, ny = y + l / 6; arme.push(C(x, y, nx, ny, 3.4 - k * 0.4, 3 - k * 0.4, null)); x = nx; y = ny; } }
    const gruppen = [
      { p: vorh.filter((_, i) => i % 2 === 1), k: 0.5 },   // 0 hintere Vorhänge
      { p: [glockeP], k: 2 },                              // 1 Glocke
      { p: arme, k: 1.2, kante: true },                    // 2 Mundarme
      { p: vorh.filter((_, i) => i % 2 === 0), k: 0.5, kante: true }, // 3 vordere Vorhänge
    ];
    gruppen.forEach(g => { g.anker = [dx, hub + fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glasmeer_licht'), { rimBis: 178 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - dx, y - hub - fall);
      // Glocke durchscheinend: innen glimmt es grün (gedithert), am dichtesten in der Mitte, zum Rand dunkel;
      // radiale Kanäle wie bei einer Qualle
      const gcx = cx, gcy = by - bh * 0.42;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 1)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (x + 0.5 - gcx) / bw, w = (y + 0.5 - gcy) / (bh * 0.75); const d = Math.hypot(u, w);
        const a = Math.atan2(y - by, x - cx); const kanal = Math.abs(((a / Math.PI * 8) % 1 + 1) % 1 - 0.5) < 0.06 && d > 0.35;
        if (kanal) { P.set(x, y, 'k0'); continue; }
        const g = aus ? 0 : (1 - d) * 1.1;
        if (g > 0.55 + b(x, y) * 0.4) P.set(x, y, 'glutDim'); else if (g > 0.2 + b(x, y) * 0.35) P.set(x, y, c < 3 ? 3 : 4); else if (y > by - 3) P.set(x, y, 'k1');
      }
      // Die Expedition im Magen: Schlitten und drei kleine Männer im Geschirr, dunkel gegen das Grün
      if (!aus || f < 3) {
        const sx = r(gcx - 2), sy = r(gcy + 6);
        for (let k = -9; k <= 9; k++) { P.auf(sx + k, sy + 3, 'k0'); if (Math.abs(k) < 8) P.auf(sx + k, sy, 'k1'); }
        P.auf(sx - 10, sy + 2, 'k0'); P.auf(sx - 11, sy + 1, 'k0'); P.auf(sx + 9, sy + 1, 'k1'); P.auf(sx + 9, sy + 2, 'k1');
        for (const [mx, h2] of [[-17, 7], [-23, 7], [-29, 6]]) { const x = sx + mx; for (let k = 0; k < h2; k++) P.auf(x + (k > 4 ? 1 : 0), sy + 2 - k, 'k0'); P.auf(x - 1, sy - h2 + 2, 'k0'); P.auf(x + 1, sy + 3, 'k0'); P.auf(x - 1, sy + 3, 'k0'); P.line(x + 1, sy - 2, x + 7, sy - 1, 'k1', true); }
        // Laterne am Schlitten: das kleine warme Ding im kalten Licht ist hier der hellste Punkt (das Auge der Qualle)
        if (!aus) { P.set(sx + 7, sy - 2, 'kern'); P.set(sx + 7, sy - 1, 'glut'); P.set(sx + 6, sy - 2, 'nordlicht'); augen.push([sx + 7, sy - 2]); }
      }
      // Sinnesknoten am Saum (Randkörperchen): Lichtpunkte in den Lappen, blinken nacheinander
      if (!aus) for (let i = 1; i < 16; i += 2) { const x = r(cx - bw + i / 16 * bw * 2), y = r(by + 3); if (!ist(x, y, 1)) continue; const an = p.idle ? ((i >> 1) + f) % 4 !== 0 : true; P.set(x, y, an ? (i === 7 ? 'kern' : 'glut') : 'k3'); if (an && i % 4 === 1) P.glow(x + 0.5, y + 0.5, 3.5, 0.5); }
      // Vorhänge: Polarlicht in Falten, unten gedithert grün (das Licht kommt von unten aus dem Glas), Säume hell
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const g = ist(x, y, 3) ? 3 : ist(x, y, 0) ? 0 : -1; if (g < 0) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const t = (y - by) / (FY - by);
        if (!ist(x - 1, y, g) || !ist(x + 1, y, g)) { P.set(x, y, g === 3 ? 'k2' : 'k1'); continue; }
        if (!aus && t > 0.35 && (t - 0.35) * 1.6 > 0.25 + b(x, y) * 0.75) P.set(x, y, (t > 0.8 && b(x, y) < 0.2 && g === 3) ? 'nordlicht' : 'glutDim');
        else if (((y + x * 2) % 9) === 0) P.set(x, y, 'k0');
      }
      // Mundarme: gekräuselte Kanten
      KA.licht(P, arme, { c: 'r1', c2: null, luecke: 2 });
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
    };
    return { gruppen, details, augen };
  },
};
