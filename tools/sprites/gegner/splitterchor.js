// Der Splitterchor (Glasmeer). Die Glasplatten-Negative der Expedition von 1925: vierzig Aufnahmen der
// Mannschaft, in der Kiste zerbrochen. Die Scherben stehen aufrecht im zerborstenen Plattenkasten wie ein
// Fächer, und in jeder ist ein Gesicht im Negativ (die Augen und der singende Mund hell, die Pelzkapuze
// als heller Ring). Sie singen mehrstimmig, mit nassem Finger auf Glas. Bricht eine, singen zwei.
'use strict';
const { glas } = require('./glasschwimmer');
module.exports = {
  id: 'splitterchor', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [48, 114], kopf: [48, 14], rimBis: 113,
  varianten: {
    // Platten: [x am Fuß, Neigung (rad, + nach rechts), Höhe, Breite, Zacken-Seed, Gesicht-y (Anteil)]
    splitterchor_a: { platten: [[30, -0.42, 56, 13, 3, 0.62], [40, -0.16, 78, 14, 7, 0.7], [50, 0.04, 96, 15, 2, 0.74], [60, 0.24, 72, 14, 5, 0.66], [69, 0.5, 50, 12, 9, 0.6]], kiste: 1 },
    splitterchor_b: { platten: [[34, -0.3, 70, 14, 4, 0.68], [47, -0.05, 90, 16, 8, 0.72], [60, 0.2, 62, 13, 1, 0.62], [70, 0.62, 40, 11, 6, 0.55]], kiste: 1, liegend: true },
  },
  skizzen: { skizze_buendel: { platten: [[44, -0.08, 80, 12, 3, 0.7], [48, 0, 88, 12, 7, 0.7], [52, 0.08, 82, 12, 2, 0.7]], kiste: 0 } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, n = v.platten.length;
    // sch: Scherung der Spitzen (Angriff: erst nach rechts holen, dann nach links schlagen); zit: Zittern je Platte
    let sch = 0, sink = 0, mundAuf = -1, licht = 1, lean = 0, zit = [0, 0, 0, 0, 0];
    if (p.idle) { mundAuf = f % n; zit = zit.map((_, i) => (i === (f + 1) % n ? 1 : 0)); }
    if (p.angriff) { sch = [5, 10, -16, -7][f]; lean = [1, 2, -3, -1][f]; licht = [1.1, 1.3, 1.6, 1.2][f]; mundAuf = 99; }
    if (p.treffer) { sch = [4, 2][f]; zit = [1, -1, 1, -1, 1]; licht = 0.6; }
    if (p.tod) { sink = r(p.q * 14); sch = r(p.q * 8); licht = Math.max(0, 1 - p.q * 1.8); }
    const FY = 102 + Math.min(sink, 6);
    // Kasten: Holzkiste mit Latten, ein Brett gebrochen und nach vorn geklappt
    const kiste = v.kiste ? [Pg([[20 + lean, FY - 6], [76 + lean, FY - 9], [79, 114], [17, 114]], 'dunkel', { rd: 1 })] : [];
    const brett = v.kiste ? [Pg([[14, 109], [36, 104], [38, 107], [16, 114]], null, { rd: 0.6 })] : [];
    const platten = v.platten.map(([bx, a, h, w, seed], i) => {
      const hh = h - sink * (1 + i * 0.3), ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux, z = zit[i] || 0;
      const top = q => sch * q * q;
      const b0 = [bx + lean - nx * w / 2, FY + 2], b1 = [bx + lean + nx * w / 2, FY + 2];
      const t1 = [b1[0] + ux * hh * 0.86 + top(0.86) + z, b1[1] + uy * hh * 0.86], t0 = [b0[0] + ux * hh * 0.7 + top(0.7) + z, b0[1] + uy * hh * 0.7];
      // gebrochene Oberkante: Zacken zwischen t1 und t0, eine Spitze ragt bis zur vollen Höhe
      const pk = 0.3 + glas.hsh(seed, 1) * 0.4, spitze = [b0[0] + (b1[0] - b0[0]) * pk + ux * hh + top(1) + z, b0[1] + (b1[1] - b0[1]) * pk + uy * hh];
      const m1 = [t1[0] + (spitze[0] - t1[0]) * 0.5 - nx * 1.5 - ux * 3, t1[1] + (spitze[1] - t1[1]) * 0.5 - uy * 3];
      const m0 = [t0[0] + (spitze[0] - t0[0]) * 0.55 + nx * 1, t0[1] + (spitze[1] - t0[1]) * 0.55 + 2];
      return { poly: Pg([b0, b1, t1, m1, spitze, m0, t0], null, { rd: 0.4, pf: 'bevel' }), bx: bx + lean, a, hh, w, ux, uy, nx, ny, i, top, z };
    });
    // eine Scherbe liegt abgebrochen vorn (Variante b)
    const liegend = v.liegend ? [Pg([[56, 113], [62, 106], [84, 108], [88, 113]], null, { rd: 0.4 })] : [];
    // Reihenfolge: äußere hinten, mittlere vorn
    const ord = platten.slice().sort((A2, B2) => Math.abs(B2.i - (n - 1) / 2) - Math.abs(A2.i - (n - 1) / 2));
    const gruppen = [{ p: kiste, k: 1 }, ...ord.map(pl => ({ p: [pl.poly], k: 0, anker: [pl.z, 0] })), { p: brett, k: 0 }, { p: liegend, k: 0 }];
    const augen = [];
    const inPoly = (x, y, v2) => { let c = false; for (let i = 0, j = v2.length - 1; i < v2.length; j = i++) { const [xi, yi] = v2[i], [xj, yj] = v2[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const details = P => {
      // Kiste: Latten und Nagelköpfe
      if (v.kiste) { P.line(20 + lean, FY - 5, 76 + lean, FY - 8, 'k3', true); for (let y = FY + 2; y < 114; y += 5) P.line(18, y, 78, y - 1, 'k0', true); for (const x of [23, 49, 74]) { P.auf(x, FY - 1, 'k3'); P.auf(x, FY + 6, 'r1'); } P.line(16, 111, 36, 106, 'k3', true); }
      // jede Platte: Glas mit Schliff an der Kante, ein Gesicht im Negativ
      ord.forEach(pl => {
        const at = (s2, t) => [pl.bx + pl.nx * s2 + pl.ux * t * pl.hh + pl.top(t) + pl.z, FY + 2 + pl.ny * s2 + pl.uy * t * pl.hh];
        const fy = v.platten[pl.i][5];
        // unbelichteter Rand der Glasplatte: heller Saum 2 px innen (nur sichtbare Pixel dieser Platte)
        const pv = pl.poly.v;
        for (let y = 0; y < 120; y++) for (let x = 0; x < 96; x++) {
          if (!inPoly(x + 0.5, y + 0.5, pv)) continue; const c = P.get(x, y); if (!c || c > 4) continue;
          const am = [[2, 0], [-2, 0], [0, 2], [0, -2], [1, 1], [-1, -1]].some(([dx, dy]) => !inPoly(x + 0.5 + dx, y + 0.5 + dy, pv));
          const ganz = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !inPoly(x + 0.5 + dx, y + 0.5 + dy, pv));
          if (am && !ganz && y < FY - 2) P.set(x, y, (x + y) % 3 ? 4 : 3);
        }
        // Spiegelstreif quer über die Platte
        const s0 = at(-pl.w / 2 + 2, fy - 0.32), s1 = at(pl.w / 2 - 2, fy - 0.22); glas.streif(P, s0, s1, 0.8, { hell: 0.35 });
        // Gesicht: dunkles Oval, Pelzkapuze als heller Ring (Negativ), Augen und Mund hell
        const [gx, gy] = at(0, fy);
        for (let y = r(gy - 8); y <= gy + 8; y++) for (let x = r(gx - 7); x <= gx + 7; x++) {
          const c = P.get(x, y); if (!c || c > 4) continue; const d = Math.hypot((x + 0.5 - gx) / 4.6, (y + 0.5 - gy) / 5.6);
          if (d < 1) P.set(x, y, d < 0.75 ? 1 : 2); else if (d < 1.5) P.set(x, y, (x + y) % 2 && d > 1.35 ? 3 : 4);
        }
        if (licht > 0 && !(p.tod && f > 1)) {
          const ex = r(gx - 2 + pl.ux * 1), ey = r(gy - 1);
          P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut'); augen.push([ex, ey]);
          const offen = mundAuf === pl.i || mundAuf === 99;
          P.set(r(gx), ey + 3, offen ? 'glut' : 'glutDim'); if (offen) { P.set(r(gx), ey + 4, 'nordlicht'); P.set(r(gx) + 1, ey + 3, 'nordlicht'); }
          P.glow(gx + 0.5, gy + 1, 5 * licht, 0.45);
        }
        // Bruchkante oben: grüner Riss von der Spitze ins Bild
        const sp = at((glas.hsh(v.platten[pl.i][4], 1) - 0.5) * pl.w * 0.4, 0.94), sp2 = at(pl.w * 0.15, fy + 0.12);
        glas.riss(P, sp, sp2, { seed: pl.i + 3, zacken: 3, staerke: licht * (pl.i === (p.idle ? f : 2) % n ? 1 : 0.55) });
      });
      // Licht aus dem Kasten: unter den Platten glimmt es grün durch die Fugen
      if (v.kiste && licht > 0) { for (const x0 of [30, 44, 58, 68]) { const y = FY + 3 - Math.round((x0 - 20) * 0.05); for (let k = 0; k < 4; k++) { if (P.get(x0 + k, y) && P.get(x0 + k, y) <= 4) P.set(x0 + k, y, k === 1 || k === 2 ? 'nordlicht' : 'glutDim'); } } P.glow(48, FY - 4, 16 * licht, 0.6); }
      glas.unterlicht(P, FY - 4, 14, licht * 0.8, (x, y) => y < FY - 3);
    };
    return { gruppen, details, augen, rimBis: 112 };
  },
};
