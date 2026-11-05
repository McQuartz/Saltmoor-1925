// Die Funkstation am Pol: Der Mastkletterer. Der Mechaniker der Expedition stieg im Sturm hinauf, um die
// Antenne zu richten, weil das Signal schwächer wurde. Er ist nie heruntergekommen. Er hängt an einem Stück
// Gittermast, das mit ihm wandert, festgefroren, und das Eis wächst ihm aus Kopf und Armen in langen Strähnen
// bis zum Boden, wie Haar. Oben auf dem Mast glüht ein Isolator, als liefe noch Strom hindurch.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'mastkletterer', biom: 'funkstation', zone: 'funkstation', w: 96, h: 120, fuss: [50, 115], kopf: [50, 4], rimBis: 113,
  varianten: {
    // a: hoher Mast, er klammert sich mit beiden Armen an den vorderen Pfosten, die Strähnen lang
    mastkletterer_a: { top: 6, sitzt: false },
    // b: kürzerer Mast mit Querträger und zwei Isolatoren, er hockt darauf wie ein Vogel und greift nach dir
    mastkletterer_b: { top: 16, sitzt: true },
  },
  // Silhouetten-Probe (nicht gebaut): nur der Mann mit dem Eishaar, ohne Mast (ein Zottelwesen, man sah
  // nicht, wo er hängt und was er war). Genommen: der Gittermast als Rückgrat der Figur.
  proben: { probe_ohnemast: { top: 6, sitzt: false, ohneMast: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lx = 0, ly = 0, atem = 0, fall = 0, griff = 0;
    // griff: 0 festgeklammert, 1 zurückgezogen (ausgeholt), 2 hinausgeschwungen, nur eine Hand am Mast
    if (p.idle) { atem = [0, 0, 1, 1][f]; }
    if (p.angriff) { griff = [0.6, 1, 2, 1.5][f]; lx = [1, 3, -9, -4][f]; ly = [0, -1, 3, 1][f]; }
    if (p.treffer) { lx = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 40); lx = r(p.q * 3); }
    // Mast: zwei Pfosten, die sich nach oben verjüngen, Sprossen und Kreuzstreben; Fuß im Schneehügel
    const top = v.top, mast = [], streben = [];
    const pl = y => 39 + (114 - y) / (114 - top) * 6, pr = y => 61 - (114 - y) / (114 - top) * 6;
    if (!v.ohneMast) {
      mast.push(C(pl(114), 114, pl(top), top, 1.8, 1.3, null), C(pr(114), 114, pr(top), top, 1.8, 1.3, null));
      const st = 13; let yPrev = 114;
      for (let y = 114 - st; y > top + 4; y -= st) { streben.push(C(pl(y), y, pr(y), y, 1.1, 1.1, null), C(pl(yPrev), yPrev, pr(y), y, 0.6, 0.6, null), C(pr(yPrev), yPrev, pl(y), y, 0.6, 0.6, null)); yPrev = y; }
      mast.push(C(pl(top + 2), top + 2, pr(top + 2), top + 2, 1.3, 1.3, null));
      // Spitze: Isolator auf einem Stab, ein abgerissener Draht nach rechts
      mast.push(C(50, top + 2, 50, top - 3, 1, 1, null), E(50, top - 4, 2.2, 1.6, null), C(50, top - 4, 62, top - 1, 0.6, 0.6, null));
      if (v.sitzt) { const yq = top + 24; mast.push(C(14, yq, 80, yq, 1.6, 1.6, null), E(16, yq - 2.5, 1.8, 1.5, null), E(78, yq - 2.5, 1.8, 1.5, null)); }
    }
    const huegel = [Pg([[26, 116], [32, 110], [42, 108], [54, 107], [64, 109], [72, 112], [76, 116]], null, { rd: 1.5 })];
    // Der Mann: an der Vorderseite des linken Pfostens, Gesicht zu dir gedreht
    const T = atem + fall;
    let kopf, leib, armO, armU, beinO, beinU, kx, ky;
    if (!v.sitzt) {
      const bx = 34 + lx, by = 44 + T + ly;
      kx = bx - 6; ky = by - 21;
      leib = [Pg([[bx - 7, by - 15], [bx + 6, by - 16], [bx + 9, by - 3], [bx + 7, by + 15], [bx - 4, by + 16], [bx - 9, by + 3]], null, { rd: 2.4 })];
      kopf = [E(kx, ky, 6.6, 7.6, 'haut'), C(kx - 5, ky - 1, kx - 8, ky + 2.5, 1.6, 0.9, 'haut'), E(bx + 1, by - 16, 7.5, 3.6, null)];
      const hO = griff >= 1.5 ? [pl(18) + 1, 18] : [pl(20 + T) + 1, 20 + T];
      armO = [...glied([[bx + 4, by - 12], [bx + 1 - griff * 2, by - 26], hO], 3.2, 2.4, null), E(hO[0], hO[1], 2.6, 2.6, 'haut')];
      let hU; if (griff < 0.5) hU = [pl(48) + 2, 48 + T]; else if (griff < 1.5) hU = [bx + 11, by - 8]; else hU = [bx - 22, by + 4];
      const eU = griff >= 1.5 ? [bx - 11, by] : [bx - 6, by + 3];
      armU = [...glied([[bx - 3, by - 10], eU, hU], 3.2, 2.4, null), E(hU[0], hU[1], 2.6, 2.8, 'haut'), ...(griff >= 1.5 ? [-0.4, 0, 0.4].map(d => C(hU[0], hU[1], hU[0] - 6 * Math.cos(d), hU[1] + 6 * Math.sin(d), 0.9, 0.6, 'haut')) : [])];
      const fO = [pl(66) + 1, 66 + T * 0.5], fU = [pl(82) + 2, 82];
      beinO = [...glied([[bx + 2, by + 13], [bx - 8, by + 22], fO], 3.6, 2.8, null), C(fO[0] - 4, fO[1] + 1, fO[0] + 3, fO[1] + 1, 1.8, 1.6, 'dunkel')];
      beinU = [...glied([[bx - 1, by + 14], [bx - 4, by + 30], fU], 3.6, 2.8, null), C(fU[0] - 4, fU[1] + 1, fU[0] + 3, fU[1] + 1, 1.8, 1.6, 'dunkel')];
    } else {
      const yq = v.top + 24, bx = 30 + lx, by = yq - 9 + T + ly;
      kx = bx - 8; ky = by - 7;
      leib = [Pg([[bx - 8, by - 5], [bx + 2, by - 10], [bx + 9, by - 4], [bx + 8, by + 6], [bx - 4, by + 8]], null, { rd: 2.5 })];
      kopf = [E(kx, ky, 5.4, 6, 'haut'), C(kx - 4, ky, kx - 6.5, ky + 3, 1.3, 0.8, 'haut'), E(bx, by - 9, 6, 3, null)];
      const hO = [bx + 12, yq - 1];
      armO = [...glied([[bx + 5, by - 6], [bx + 12, by - 6], hO], 2.6, 2, null), E(hO[0], hO[1], 2.2, 2, 'haut')];
      let hU; if (griff < 0.5) hU = [bx - 16, by + 12]; else if (griff < 1.5) hU = [bx + 2, by - 18]; else hU = [bx - 28, by + 8];
      const eU = griff >= 0.5 && griff < 1.5 ? [bx - 4, by - 12] : [bx - 10, by + 2];
      armU = [...glied([[bx - 5, by - 3], eU, hU], 2.6, 2, null), E(hU[0], hU[1], 2.2, 2.4, 'haut'), ...[-0.5, 0, 0.5].map(d => C(hU[0], hU[1], hU[0] - 5 * Math.cos(d + (griff >= 0.5 && griff < 1.5 ? -1.4 : 0.3)), hU[1] + 5 * Math.sin(d + (griff >= 0.5 && griff < 1.5 ? -1.4 : 0.3)), 0.8, 0.5, 'haut'))];
      beinO = [...glied([[bx + 2, by + 5], [bx - 6, by + 2], [bx - 3, yq - 1]], 3, 2.4, null), C(bx - 6, yq - 1, bx, yq - 1, 1.6, 1.4, 'dunkel')];
      beinU = [...glied([[bx + 6, by + 5], [bx + 4, by + 2], [bx + 7, yq - 1]], 3, 2.4, null), C(bx + 4, yq - 1, bx + 10, yq - 1, 1.6, 1.4, 'dunkel')];
    }
    // Eishaar: Strähnen aus Kopf, Kinn und Armen, senkrecht bis fast zum Boden, leicht gewellt
    const haar = [];
    const strang = (x, y, bis, dick, ph) => { dick *= 1.25; const pts = []; const n = 6; for (let i = 0; i <= n; i++) { const q = i / n; pts.push([x + Math.sin(q * 3.1 + ph) * 1.2 + (p.angriff ? -griff * q * 1.5 : 0), y + (bis - y) * q]); } haar.push(...glied(pts, dick, 0.5, null)); };
    const hb = v.sitzt ? 102 : 106;
    [[kx - 4, ky + 5, hb - 6, 1.3, 0], [kx - 1, ky + 5, hb, 1.5, 1], [kx + 2, ky + 4, hb - 12, 1.2, 2], [kx - 6, ky + 1, hb - 16, 1, 3], [kx + 4, ky + 2, hb - 3, 1.1, 4]].forEach(a => strang(...a));
    if (!v.sitzt) { const ex = armU[1] ? armU[1].x2 : kx; const ey = armU[1] ? armU[1].y2 : ky; strang(ex, ey + 2, hb - 8, 1, 5); strang(ex + 3, ey + 2, hb - 20, 0.9, 6); }
    else { strang(kx + 10, ky + 14, hb - 2, 1.3, 5); strang(kx + 14, ky + 14, hb - 14, 1, 6); }
    // auch der Mast trägt Eis an den Sprossen
    const zapfen = [];
    if (!v.ohneMast) for (let y = 114 - 13; y > v.top + 4; y -= 13) for (let k = 0; k < 3; k++) { const x = pl(y) + 4 + k * 5 + (y % 3); zapfen.push(C(x, y + 1, x + 0.3, y + 4 + ((k * 7 + y) % 6), 0.8, 0.4, null)); }
    const gruppen = [
      { p: v.ohneMast ? [] : streben, k: 0, noRim: true, tone: -0.1 }, // 0 Streben
      { p: v.ohneMast ? [] : mast, k: 0, kante: true },             // 0b Mast
      { p: zapfen, k: 0, noRim: true },                              // 1
      { p: huegel, k: 1.5 },                                         // 2
      { p: beinU, k: 1, kante: true, anker: [lx, T] },               // 3
      { p: leib, k: 1.5, kante: true, anker: [lx, T] },              // 4
      { p: beinO, k: 1, kante: true, anker: [lx, T] },               // 5
      { p: armO, k: 1, kante: true },                                // 6
      { p: kopf, k: 1.2, kante: true, anker: [lx, T] },              // 7
      { p: haar, k: 0.6, kante: true },                              // 8 Eishaar
      { p: armU, k: 1, kante: true },                                // 9 vorderer Arm
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('funkstation'), { rimBis: 112 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Eishaar: hell an der Lichtseite, gedithert zur Spitze hin; ein paar Strähnen ganz weiß
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== 9) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const rechts = gid[y * W + x + 1] !== 9;
        if (rechts) P.set(x, y, LIB.bay(x, y) < 0.7 ? 'r1' : 'k3'); else P.set(x, y, LIB.bay(x, y * 2) < 0.4 ? 'k3' : 'k2');
      }
      // Lichtkante oben rechts an allem, was frei steht (dünne Teile, die der Renderer innen dunkel lässt)
      for (let y = 1; y < 110; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c >= 1 && c <= 4 && !P.get(x, y - 1) && !P.get(x + 1, y)) P.set(x, y, 'r1'); }
      // Mast: Nieten an den Sprossen, Reif oben auf jeder Sprosse
      if (!v.ohneMast) for (let y = 114 - 13; y > v.top + 4; y -= 13) { P.auf(r(pl(y)), y, 'kupfer'); P.auf(r(pr(y)), y, 'k3'); for (let x = r(pl(y)) + 1; x < pr(y); x += 2) P.auf(x, y - 1, 'r1'); }
      // Anorak: Gurt, Steigeisen, Falten
      // Isolator oben: glüht, ein Funke springt zum abgerissenen Draht
      if (!v.ohneMast && !aus) { const X = 50, Y = v.top - 4; P.glow(X + 0.5, Y + 0.5, 8, 0.9); P.set(X, Y, 'kern'); P.set(X - 1, Y, 'glut'); P.set(X + 1, Y, 'glut'); P.set(X, Y + 1, 'glutDim'); augen.push([X, Y]); if (p.idle && f % 2) P.set(X + 4, Y + 1, 'glut'); }
      if (v.sitzt && !aus) { const yq = v.top + 24; for (const X of [16, 78]) { P.set(X, yq - 3, 'glut'); P.set(X, yq - 2, 'glutDim'); } }
      // Gesicht: Reif in den Brauen, die Augen glühen (zu dir gedreht)
      const ex = r(kx - 3), ey = r(ky - 1);
      if (!aus) { P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 3, ey, 'glut'); P.glow(ex + 1, ey + 0.5, 5, 0.6); augen.push([ex, ey]); }
      P.auf(ex - 1, ey - 2, 'r1'); P.auf(ex, ey - 2, 'r1'); P.auf(ex + 2, ey - 2, 'r1');
      P.auf(ex - 1, ey + 4, 'k0'); P.auf(ex, ey + 4, 'k0');
      // Leib: Gürtel mit Werkzeug (Zange), Steppnähte der Jacke
      const L0 = leib[0].v; const lxm = r((L0[0][0] + L0[2][0]) / 2), lym = r((L0[0][1] + L0[3][1]) / 2);
      P.line(lxm - 6, lym + 4, lxm + 6, lym + 3, 'k0', true); P.auf(lxm, lym + 3, 'kupfer');
      for (const dx of [-3, 2]) { P.line(lxm + dx, lym - 10, lxm + dx + 1, lym + 2, 'k1', true); P.line(lxm + dx + 1, lym - 10, lxm + dx + 2, lym + 2, 'k3', true); }
    };
    return { gruppen, details, augen };
  },
};
