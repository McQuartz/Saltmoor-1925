// Der Ziegelträger (Ziegelgruben). Ein Träger, der die Rohlinge auf dem Tragreff zu den Öfen trug.
// Klein, tief gebückt unter einem schiefen Turm aus Ziegeln, doppelt so hoch wie er, der nach vorn
// überhängt. Die untersten Ziegel sind in seinen Rücken gewachsen, die oberen glühen in den Fugen:
// Er trägt sie nicht zum Ofen, sondern aus ihm. In jedem Ziegel ein heller Fleck, der Abdruck.
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
const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

module.exports = {
  id: 'ziegeltraeger', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 96, h: 120, fuss: [56, 115], kopf: [40, 6], rimBis: 113,
  varianten: {
    ziegeltraeger_a: { lagen: 12, breit: 25, ueber: 16, seed: 3 },
    ziegeltraeger_b: { lagen: 13, breit: 21, ueber: 22, seed: 7, knick: true },
  },
  // Silhouetten-Probe (verworfen): der Stapel senkrecht und gerade über ihm las sich wie ein Schornstein
  // auf Beinen (zu nah an Kesselmann und Gewicht). Erst der Überhang nach vorn zeigt die Last, die kippt.
  proben: { sil_gerade: { lagen: 12, breit: 25, ueber: 0, seed: 3 } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, kipp = 0, fall = 0, wurf = 0, zusammen = 0, wank = 0;
    // kipp: Neigung des Stapels (+ nach hinten, − nach vorn), wurf: obere Ziegel fliegen nach vorn
    if (p.idle) { atem = [0, 0, 1, 1][f]; wank = [0, 0, 1, 0][f]; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; kipp = [0.35, 0.7, -0.75, -0.25][f]; wurf = [0, 0, 1, 0.6][f]; }
    if (p.treffer) { lean = [2, 1][f]; kipp = [0.25, 0.1][f]; }
    if (p.tod) { zusammen = p.q; fall = r(p.q * 14); kipp = -p.q * 0.9; }
    const T = fall; // Leerlauf-Atem als ganzzahlige Verschiebung des ganzen Bilds (kein kriechender Dither)
    const cx = 56 + lean;
    // Körper: tief gebückt, Hüfte rechts, Schultern vorn links, Kopf unter dem Überhang
    const hx = cx + 6, hy = 86 + T; // Hüfte
    const sx = cx - 12, sy = 68 + T + r(zusammen * 6); // Schulter
    const knie = 1 + zusammen;
    const beinH = glied([[hx + 4, hy], [hx + 11, 98 + zusammen * 4], [hx + 7, 112]], 4.4, 3.2, null);
    const beinV = glied([[hx - 3, hy + 2], [hx - 12 * knie, 99 + zusammen * 6], [hx - 11, 112]], 4.6, 3.4, null);
    const fuesse = [Pg([[hx + 1, 109], [hx + 10, 109], [hx + 11, 115], [hx - 1, 115]], 'dunkel', { rd: 1 }), Pg([[hx - 20, 110], [hx - 8, 109], [hx - 8, 115], [hx - 21, 115]], 'dunkel', { rd: 1 })];
    const rumpf = Pg([[sx - 6, sy + 2], [sx + 2, sy - 6], [hx + 2, hy - 18], [hx + 10, hy - 8], [hx + 8, hy + 4], [hx - 6, hy + 6], [sx - 2, sy + 14]], null, { rd: 3 });
    // Lendentuch / Schurz als eigene Fläche (Binnenform)
    const schurz = Pg([[hx - 9, hy - 3], [hx + 9, hy - 6], [hx + 10, hy + 6], [hx + 2, hy + 12], [hx - 10, hy + 9]], 'haut', { rd: 1.5 });
    const kx = sx - 9, ky = sy + 6 + r(zusammen * 4);
    const kopf = E(kx, ky, 6, 6.5, 'haut', { pf: 'bevel' });
    const nacken = C(kx + 3, ky - 2, sx + 2, sy - 1, 4, 4.5, null);
    // Arme: der vordere hält den Gurt vor der Brust, der hintere hängt fast bis zum Knie
    const armV = glied([[sx - 2, sy + 3], [sx - 7, sy + 14], [sx + 1, sy + 18]], 3.4, 2.6, null);
    const armH = glied([[sx + 6, sy - 1], [sx + 3, sy + 14], [sx - 3, sy + 27 - zusammen * 6]], 3.2, 2.4, null);
    const handH = E(sx - 3, sy + 28 - zusammen * 6, 2.8, 2.6, 'haut');
    // Stapel: Lagen von 4 px, jede nach vorn versetzt (Überhang nach oben quadratisch), Neigung kipp um die Basis
    const L = v.lagen, B0 = v.breit, bx0 = sx + 10, by0 = sy - 4; // Basis: auf dem Rücken
    const lagen = [];
    for (let i = 0; i < L; i++) {
      const q = i / L;
      let dx = -v.ueber * q * q + kipp * i * 1.15 + (v.knick && i > L * 0.55 ? -(i - L * 0.55) * 0.6 : 0);
      dx += (hash(i, v.seed) - 0.5) * 1.6 + (p.idle && i > L * 0.6 ? -wank : 0);
      let yy = by0 - i * 5;
      if (wurf && i >= L - 3) { const k = i - (L - 4); dx -= wurf * (k * 7 + 4); yy += wurf * (k * k * 2.5 - 2) ; }
      if (zusammen) { const k = Math.max(0, i - L * (1 - zusammen * 1.1)); dx -= k * k * 0.7 * zusammen; yy += k * k * 0.9 * zusammen + zusammen * 10; }
      const br = (wurf && i >= L - 3) ? 11 : B0 - (i % 2) * 1 + (hash(i, v.seed + 2) > 0.8 ? 2 : 0) - (i > L - 3 ? 3 : 0);
      lagen.push({ x0: bx0 - br / 2 + dx, x1: bx0 + br / 2 + dx, y0: yy - 5, y1: yy, i });
    }
    const stapel = lagen.map(l => Pg([[l.x0, l.y0], [l.x1, l.y0], [l.x1, l.y1], [l.x0, l.y1]], 'haut', { rd: 0.2, b: 1.6 }));
    // Tragreff: zwei Stangen entlang der Stapelseite, unten am Kreuz, mit Querstreben
    const top = lagen[Math.min(L - 1, Math.floor(L * 0.72))];
    const reff = [C(bx0 + B0 / 2 + 2, by0 + 6, top.x1 + 2, top.y0 - 3, 1.1, 0.9, 'dunkel', { pf: 'flat' })];
    const gurt = C(sx - 4, sy + 6, bx0 + 3, by0 + 2, 1.2, 1.2, 'dunkel');
    const gruppen = [
      { p: beinH, k: 1.5 },
      { p: [fuesse[0]], k: 0, kante: true },
      { p: armH, k: 1, kante: true },
      { p: [handH], k: 0, kante: true },
      { p: [rumpf], k: 2, tone: 0.12 },
      { p: [schurz], k: 1, kante: true },
      { p: beinV, k: 1.5, kante: true },
      { p: [fuesse[1]], k: 0, kante: true },
      { p: stapel, k: 0 },
      { p: reff, k: 0, kante: true },
      { p: [nacken], k: 1 },
      { p: [kopf], k: 0, kante: true },
      { p: [gurt], k: 0, kante: true },
      { p: armV, k: 1, kante: true },
    ];
    const STAPEL = 8, RUMPF = 4, SCHURZ = 5;
    gruppen.forEach(g => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('ziegelgruben'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => gid[r(y) * W + r(x)] === g;
      // Ziegel: Lagerfugen dunkel, Stoßfugen im Verband, die Oberkante jeder Lage fängt etwas Licht,
      // die oberen Lagen glühen in den Fugen; in jedem Ziegel der Abdruck (heller Fleck)
      lagen.forEach((l, li) => {
        const y1 = r(l.y1), y0 = r(l.y0), heiss = li >= L - 6 && !p.tod ? (li - (L - 6)) / 6 : 0;
        for (let x = r(l.x0); x <= r(l.x1); x++) {
          if (ist(x, y1 - 1, STAPEL) && P.get(x, y1 - 1) <= 4) P.set(x, y1 - 1, heiss > 0.3 && LIB.bay(x, y1) < heiss ? 'glutDim' : 'k0');
          if (ist(x, y0, STAPEL) && P.get(x, y0) <= 4 && LIB.bay(x - lean, y0) < 0.5) P.set(x, y0, 'k3');
        }
        const off = (li % 2) * 5.5 + (hash(li, 9) - 0.5);
        for (let x = r(l.x0 + off + 2); x < l.x1 - 1; x += 11) for (let y = y0; y < y1 - 1; y++) if (ist(x, y, STAPEL) && P.get(x, y) <= 4) P.set(x, y, heiss > 0.55 ? 'glutDim' : 'k0');
        // Abdruck: je Ziegel ein heller Punkt mit dunklem Ring (Ringlinien im Kleinen)
        for (let x = r(l.x0 + off + 6); x < l.x1 - 2; x += 11) { const y = y0 + 1 + (li % 2); if (ist(x, y, STAPEL) && P.get(x, y) <= 4 && hash(x, li) > 0.35) { P.set(x, y, li >= L - 4 && !p.tod ? 'glut' : 'ziegel'); if (P.get(x + 1, y) <= 4 && ist(x + 1, y, STAPEL)) P.set(x + 1, y, 'k0'); } }
        // glühende Fugen oben: ein Pixel Glut in der Fuge, das Glühen leuchtet die Ziegel an
        if (heiss > 0.5) { const gx = r(l.x0 + off + 2 + 11 * (li % 3 === 0 ? 1 : 0)); if (ist(gx, y1 - 1, STAPEL)) { P.set(gx, y1 - 1, 'glut'); P.glow(gx + 0.5, y1 - 0.5, 4, 0.5, 'glutDim', 'k3'); } }
      });
      // eingewachsen: unten wachsen zwei Ziegel aus dem Rücken
      for (let i = 0; i < 2; i++) { const yy = r(by0 + 6 + i * 5), xx = r(bx0 - 4 + i * 6); for (let x = xx; x < xx + 6; x++) for (let y = yy; y < yy + 3; y++) if (ist(x, y, RUMPF)) P.set(x, y, y === yy ? 'k3' : x === xx + 5 ? 'k0' : 'k2'); }
      // Rücken: Rippen unter der Haut, Wirbel als Punkte zum Stapel hin
      for (let i = 0; i < 4; i++) for (let t = 0; t < 1; t += 0.08) { const x = r(sx + 4 + i * 3.5 + t * 4), y = r(sy + 6 + i * 2.5 + t * 7); if (ist(x, y, RUMPF) && P.get(x, y) <= 4) P.set(x, y, i % 2 ? 'k0' : 'k3'); }
      // Schurz: Saum und eine Falte
      for (let y = r(hy - 6); y <= r(hy + 12); y++) for (let x = r(hx - 11); x <= r(hx + 11); x++) if (ist(x, y, SCHURZ) && P.get(x, y) <= 4) { if (!ist(x, y + 1, SCHURZ)) P.set(x, y, 'k0'); if (Math.abs(x - hx - 1 + (y - hy) * 0.3) < 0.6) P.set(x, y, 'k0'); if (Math.abs(x - hx + (y - hy) * 0.3) < 0.6 && LIB.bay(x, y) < 0.5) P.set(x, y, 'k3'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kräftiges Randlicht am Stapel: rechts zwei Pixel (außen hell), oben eine Linie
      {
        const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          if (gid[y * W + x] !== STAPEL) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue;
          if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r2']);
          else if (leer(x + 2, y) || leer(x, y - 1)) z.push([x, y, 'r1']);
        }
        for (const [x, y, c] of z) P.set(x, y, c);
      }
      // die Glut oben leuchtet nach unten auf Kopf und Schultern
      if (!p.tod) { P.glow(kx + 4, ky - 4, 9, 0.45, 'glutDim', 'k3'); }
      // Augen: klein, unter dem Überhang, zu Boden gerichtet
      if (!p.tod || f < 1) {
        const ex = r(kx - 3), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut'); P.glow(ex + 1.5, ey + 0.5, 3.5, 0.6);
        P.auf(ex, ey - 1, 'k0'); P.auf(ex + 3, ey - 1, 'k0'); P.auf(ex + 1, ey + 3, 'k0'); P.auf(ex + 2, ey + 3, 'k0');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, dy: atem };
  },
};
