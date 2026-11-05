// Der Mond unter dem Eis: Die Mondmotte. Es gibt hier nichts, was lebt. Der Staub hat nur gesehen, was zum
// Licht fliegt, und hat sich so gesetzt. Eine Motte, so groß wie ein Kind, aufrecht im Staub, die Flügel
// offen. Auf jedem Vorderflügel ein Augenfleck, und jeder Augenfleck ist ein Krater mit Wall und Zentralberg.
// Wo sie mit den Flügeln schlägt, fällt Asche, und jede Glut darunter erstickt.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'mondmotte', biom: 'mond', zone: 'mond', w: 96, h: 120, fuss: [48, 115], kopf: [48, 10], rimBis: 113,
  varianten: {
    // a: breite, runde Flügel, kurze Fühler
    mondmotte_a: { spann: 1, schwanz: false, fuehler: 1, fleck: 6.5 },
    // b: wie ein Mondspinner: schmalere Vorderflügel, lange Schwänze an den Hinterflügeln bis in den Staub
    mondmotte_b: { spann: 0.9, schwanz: true, fuehler: 1.25, fleck: 5.5 },
  },
  // Silhouetten-Proben (nicht gebaut): Flügel als Zelt von der Seite (ein Dreieck, las sich als Felsbrocken);
  // flach ausgebreitet wie ein Drachen (zu niedrig, wie ein Vogel im Flug). Genommen: aufrecht, Flügel offen.
  proben: {
    probe_zelt: { spann: 0.35, schwanz: false, fuehler: 1, fleck: 0, zelt: true },
    probe_flach: { spann: 1.15, schwanz: false, fuehler: 0.6, fleck: 6, flach: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, saum } = A;
    const f = p.f, W = 96, H = 120;
    let hub = 0, off = 1, lean = 0, fall = 0, wolke = 0;
    // hub: Flügel heben (Pixel), off: Spannweite (Faktor), wolke: Staubstoß nach vorn
    if (p.idle) { hub = [0, 0, 1, 1][f]; }
    if (p.angriff) { hub = [6, 12, -8, -3][f]; off = [0.82, 0.7, 1.08, 1][f]; lean = [3, 5, -9, -4][f]; wolke = [0, 0, 1, 0.5][f]; }
    if (p.treffer) { hub = [-2, -1][f]; off = [0.9, 0.95][f]; lean = [3, 2][f]; }
    if (p.tod) { fall = r(p.q * 20); hub = -r(p.q * 10); off = 1 - p.q * 0.2; }
    const S = v.spann * off * (v.flach ? 1.1 : 1), cx = 48 + lean, ty = 64 + fall, fy = v.flach ? 22 : 0;
    // Flügel: Vorderflügel (vf) und Hinterflügel (hf) je Seite s = -1 links, 1 rechts
    const vf = s => { const h = hub * (s < 0 ? 1 : 0.9); return Pg([[cx + s * 4, ty - 3], [cx + s * 16 * S, ty - 18 - h * 0.6 + fy * 0.6], [cx + s * 40 * S, ty - 30 - h + fy], [cx + s * 44 * S, ty - 24 - h + fy], [cx + s * 40 * S, ty - 2 - h * 0.4 + fy * 0.5], [cx + s * 28 * S, ty + 6 - h * 0.2 + fy * 0.3], [cx + s * 6, ty + 10]], null, { rd: 2 }); };
    const hf = s => { const pts = [[cx + s * 5, ty + 8], [cx + s * 26 * S, ty + 10 + fy * 0.2], [cx + s * 33 * S, ty + 22 + fy * 0.1], [cx + s * 26 * S, ty + 38 - fy * 0.3], [cx + s * 12 * S, ty + 40 - fy * 0.3], [cx + s * 5, ty + 30]]; return Pg(pts, null, { rd: 2 }); };
    const schwanz = s => (v.schwanz ? [...glied([[cx + s * 18 * S, ty + 34], [cx + s * 26 * S, ty + 40], [cx + s * 30 * S, ty + 46 + (p.idle ? f % 2 : 0)], [cx + s * 28 * S, 108 - fall * 0.3]], 4.4, 2.6, null), E(cx + s * 28 * S, 109 - fall * 0.3, 3.4, 3, null)] : []);
    // Körper: Kopf, pelziger Thorax, geringelter Hinterleib
    const kopf = E(cx, ty - 9, 4.5, 3.8, 'haut');
    const thorax = E(cx, ty + 2, 7, 10, null);
    const pelz = Pg([[cx - 7, ty - 6], ...saum(cx - 7, cx + 7, ty - 7, 6, -2.5, 3), [cx + 7, ty - 6], [cx + 8, ty + 8], [cx - 8, ty + 8]], 'haut', { rd: 0.8 });
    const leib = []; for (let i = 0; i < 6; i++) { const y = ty + 14 + i * 5.2, rr = 6.2 - i * 0.65; leib.push(E(cx, y, rr, 3.2, null)); }
    // Fühler: gefiedert, nach außen gebogen
    const fl = v.fuehler, fuehler = [];
    for (const s of [-1, 1]) {
      const pts = [[cx + s * 1.5, ty - 12], [cx + s * 7 * fl, ty - 24 * fl - hub * 0.3], [cx + s * 15 * fl, ty - 33 * fl - hub * 0.5], [cx + s * 22 * fl, ty - 36 * fl - hub * 0.6]];
      fuehler.push(...glied(pts, 1.1, 0.6, null));
      for (let k = 1; k < 7; k++) { const q = k / 7, i = Math.min(2, Math.floor(q * 3)), qq = q * 3 - i; const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * qq, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * qq; fuehler.push(C(x, y, x + s * 2.4 * (1 - q * 0.4), y + 2.6 * (1 - q * 0.3), 0.6, 0.4, null), C(x, y, x - s * 1.2, y - 2.2 * (1 - q * 0.3), 0.55, 0.4, null)); }
    }
    // Beine: drei Paar, dünn, knicken unter dem Körper nach außen in den Staub
    const beine = [];
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) beine.push(...glied([[cx + s * 4, ty + 6 + i * 4], [cx + s * (14 + i * 4), ty + 22 + i * 4], [cx + s * (12 + i * 7), 114 - (i === 1 ? 1 : 0)]], 1.3, 0.7, null));
    const zelt = v.zelt ? [Pg([[cx - 6, ty - 12], [cx + 30, ty + 40], [cx - 24, ty + 40]], null, { rd: 2 })] : [];
    const gruppen = [
      { p: beine, k: 0.5, noRim: true },                                  // 0
      { p: [...schwanz(-1), ...schwanz(1)], k: 1, kante: true },          // 1
      { p: v.zelt ? [] : [hf(-1), hf(1)], k: 0, kante: true },            // 2
      { p: v.zelt ? zelt : [vf(-1), vf(1)], k: 0, kante: true },          // 3
      { p: leib, k: 1.5, anker: [r(lean), fall], kante: true },           // 4
      { p: [thorax], k: 0, anker: [r(lean), fall], kante: true },         // 5
      { p: [pelz], k: 0, anker: [r(lean), fall], noRim: true },           // 6
      { p: fuehler, k: 0, kante: true },                                  // 7
      { p: [kopf], k: 0, kante: true },                                   // 8
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('mond'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      for (const k of beine) if (k.t === 'c' && k.y2 > k.y1 + 6) P.auf(k.x1 + (k.x2 > k.x1 ? 1 : 0), k.y1, 'r1');
      // Adern: von der Flügelwurzel strahlenförmig, dunkel mit hellem Grat daneben; Saumband aus Staubpunkten
      for (const s of [-1, 1]) {
        const h = hub * (s < 0 ? 1 : 0.9);
        const enden = [[40, -27], [42, -14], [36, 0], [24, 6]];
        for (const [ex, ey] of enden) { const x1 = cx + s * ex * S, y1 = ty + ey - h * (ex > 38 ? 0.9 : 0.5) + fy * 0.6; P.line(cx + s * 7, ty + 2, x1, y1, 'k0', true); P.line(cx + s * 7, ty + 1, x1, y1 - 1, 'k2', true); }
        for (const [ex, ey] of [[24, 16], [28, 28], [16, 36]]) P.line(cx + s * 6, ty + 14, cx + s * ex * S, ty + ey, 'k0', true);
        // Staubband: eine Reihe heller Körner parallel zum Außenrand
        for (let t = 0.1; t < 0.95; t += 0.06) { const x = cx + s * (30 + 10 * t) * S, y = ty - 26 + t * 26 - h * (1 - t * 0.6) + fy * 0.8; if (gid[r(y) * W + r(x)] === 3) P.set(x, y, (t * 50 | 0) % 3 ? 'k3' : 'asche'); }
        for (let t = 0.15; t < 0.9; t += 0.09) { const x = cx + s * (12 + 18 * t) * S, y = ty + 34 - t * 8; if (gid[r(y) * W + r(x)] === 2) P.set(x, y, 'k3'); }
        // Augenfleck: ein Krater (heller Wall unten links, Schatten oben rechts), in der Mitte ein bleiches Auge
        if (v.fleck && (!p.tod || f < 2)) {
          const ax = r(cx + s * 25 * S), ay = r(ty - 13 - h * 0.7 + fy * 0.7), R = v.fleck * 1.3 * Math.min(1, S + 0.05);
          for (let y = Math.floor(ay - R - 2); y <= ay + R + 2; y++) for (let x = Math.floor(ax - R - 2); x <= ax + R + 2; x++) {
            if (gid[y * W + x] !== 3) continue; const d = Math.hypot(x - ax, y - ay) / R; const lit = (x - ax) * -0.7 + (y - ay) * 0.7;
            if (d < 0.38) P.set(x, y, 'k0'); else if (d < 0.62) P.set(x, y, lit > 0 ? 'k2' : 'k0'); else if (d < 0.86) P.set(x, y, lit > 1 ? 'r1' : lit > -2 ? 'k3' : 'k1'); else if (d < 1.15) P.set(x, y, lit > 0 ? 'k3' : 'k2'); else if (d < 1.4 && LIB.bay(x, y) < 0.5) P.set(x, y, 'k3');
          }
          if (!p.tod) { P.set(ax, ay, 'kern'); P.set(ax + s, ay, 'glut'); P.set(ax, ay + 1, 'glut'); P.set(ax - s, ay, 'bleich'); P.set(ax, ay - 1, 'glutDim'); augen.push([ax, ay]); }
        }
        // Hinterflügel: ein zweiter, kleinerer Krater, blind (ohne Auge)
        { const bx2 = r(cx + s * 19 * S), by2 = r(ty + 24), R2 = 3.5; for (let y = by2 - 4; y <= by2 + 4; y++) for (let x = bx2 - 4; x <= bx2 + 4; x++) { if (gid[y * W + x] !== 2) continue; const d = Math.hypot(x - bx2, y - by2) / R2; const lit = (x - bx2) * -0.7 + (y - by2) * 0.7; if (d < 0.6) P.set(x, y, 'k0'); else if (d < 1.05) P.set(x, y, lit > 0 ? 'k3' : 'k1'); } }
        // Randbinde: gedithert heller Staub zum Außenrand hin (Mottenflügel sind dort bepudert)
        for (let y = 0; y < H; y++) for (let x = s < 0 ? 0 : r(cx); s < 0 ? x < cx : x < W; x++) { const gi = gid[y * W + x]; if (gi !== 3 && gi !== 2) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const q = Math.abs(x - cx) / (44 * S); if (q > 0.72 && LIB.bay(x, y) < (q - 0.72) * 2.4) P.set(x, y, c < 3 ? c + 1 : (LIB.bay(x >> 1, y) < 0.3 ? 'asche' : 'k3')); }
      }
      // Hinterleib: Ringe als dunkle Fugen mit Licht darunter
      for (let i = 0; i < 6; i++) { const y = r(ty + 16.5 + i * 5.2) + 0, rr = 6 - i * 0.65; P.line(cx - rr + 1, y, cx + rr - 1, y, 'k0', true); P.line(cx - rr + 2, y + 1, cx + rr - 2, y + 1, 'k3', true); }
      // Kopf: zwei kleine Facettenaugen, matt
      if (!p.tod || f < 1) { P.set(r(cx - 3), r(ty - 9), 'glutDim'); P.set(r(cx + 2), r(ty - 9), 'glutDim'); P.set(r(cx + 3), r(ty - 10), 'bleich'); }
      // fallender Staub unter den Flügeln (Leerlauf), Staubstoß beim Schlag
      if (p.idle) for (let k = 0; k < 7; k++) { const x = cx + (k % 2 ? 1 : -1) * (14 + k * 4), y = ty + 44 + ((k * 9 + f * 4) % 26); P.set(x, y, k % 3 ? 'asche' : 'k3'); }
      if (wolke) for (let k = 0; k < 26 * wolke; k++) { const a = Math.PI + (k * 0.618 % 1 - 0.5) * 1.6, d = 8 + (k * 7 % 26); P.set(cx - 30 + Math.cos(a) * d, ty + 8 + Math.sin(a) * d * 0.6, k % 3 ? 'asche' : 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
