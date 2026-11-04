// Patronengurt des Lotsen: ein breiter Lederriemen als schräge Schlaufe (so, wie er über der Schulter hing),
// außen ringsum die Messingpatronen in Schlaufen, alle nach außen; eine Schlaufe ist leer. Messingschnalle unten.
'use strict';
module.exports = {
  form(A) {
    const { ring, achse, acap, Pg } = A;
    const cx = 24, cy = 25, rx = 13, ry = 18, dreh = -0.5;
    const P0 = (a, k = 1) => { const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k; return [cx + x * Math.cos(dreh) - y * Math.sin(dreh), cy + x * Math.sin(dreh) + y * Math.cos(dreh)]; };
    const gurt = []; for (let i = 0; i < 28; i++) { const a0 = i / 28 * Math.PI * 2, a1 = (i + 1) / 28 * Math.PI * 2; gurt.push(A.C(...P0(a0), ...P0(a1), 2.6, 2.6)); }
    const pat = []; const leer = 7;
    for (let i = 0; i < 14; i++) { if (i === leer) continue; const a = i / 14 * Math.PI * 2; const [x0, y0] = P0(a, 1.0), [x1, y1] = P0(a, 1.4); pat.push(A.C(x0, y0, x1, y1, 1.6, 1.3)); }
    const [sx, sy] = P0(Math.PI * 0.5); const schnalle = [Pg([[sx - 3.5, sy - 3], [sx + 3.5, sy - 3], [sx + 3.5, sy + 3], [sx - 3.5, sy + 3]], null, { b: 0.6 })];
    void ring; void achse; void acap;
    return {
      gruppen: [{ p: pat, mat: 'messing', k: 0 }, { p: gurt, mat: 'leder', k: 0 }, { p: schnalle, mat: 'messing', k: 0 }],
      details(P) { const [x, y] = P0(leer / 14 * Math.PI * 2, 1.08); P.set(x, y, 'kohle0'); P.set(sx, sy, 'kohle0'); P.set(sx - 1, sy, 'kohle0'); for (let i = 0; i < 14; i++) { if (i === leer) continue; const [px, py] = P0(i / 14 * Math.PI * 2, 1.42); P.auf(px, py, "kupfer1"); } },
    };
  },
};
