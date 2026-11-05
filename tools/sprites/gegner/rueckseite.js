// Der Mond unter dem Eis, Wächter: Die Rückseite. Am Rand des kleinen Mondes geht die Rückseite auf, und sie
// hat ein Gesicht: eine Sichel, so hoch wie ein Haus, an ihrer Innenkante ein Profil wie in einem alten
// Bauernkalender, Stirn, Nase, Mund, Kinn. Der Rest der Scheibe liegt im aschgrauen Licht, nur als Rand zu
// sehen, und darin öffnen sich die Krater wie Augen. Je weiter sie abnimmt, desto mehr Augen öffnen sich.
// Phasen: rueckseite (Vollmond nimmt ab), rueckseite_p2 (Halbmond), rueckseite_p3 (Sichel vor Neumond).
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'rueckseite', biom: 'mond', zone: 'mond', w: 160, h: 180, fuss: [84, 174], kopf: [96, 8], rimBis: 172, rang: 'waechter',
  todStart: 0.2,
  varianten: {
    rueckseite: { d: 38, augen: 2, ring: 3.2 },
    rueckseite_p2: { d: 25, augen: 4, ring: 3.6 },
    rueckseite_p3: { d: 13, augen: 7, ring: 4.2 },
  },
  // Silhouetten-Proben (nicht gebaut): volle Scheibe (nur ein Kreis auf einem Hügel, das Gesicht verschwand);
  // Sichel ohne Ring (las sich als Horn oder Hauer, nicht als Mond). Genommen: Sichel mit Profil und Ring.
  proben: {
    probe_scheibe: { d: 38, augen: 2, ring: 2.6, voll: true },
    probe_ohnering: { d: 30, augen: 0, ring: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180;
    let rot = 0, dx = 0, dy = 0, fall = 0, mund = 0, blinz = -1;
    let ganz = 0; if (p.idle) { ganz = [0, 0, 1, 1][f]; blinz = f; }
    if (p.angriff) { rot = [0.08, 0.15, -0.2, -0.07][f]; dx = [3, 5, -12, -4][f]; mund = [0.3, 1, 0.6, 0.2][f]; }
    if (p.treffer) { rot = [0.05, 0.02][f]; dx = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 34); rot = p.q * 0.12; }
    const R = 68, cx = 84, cy = 86, R1 = R * 1.02, d = v.d;
    const px = 84, py = 166; // Drehpunkt im Hügel
    const ca = Math.cos(rot), sa = Math.sin(rot);
    const T = ([x, y]) => [px + (x - px) * ca - (y - py) * sa + dx, py + (x - px) * sa + (y - py) * ca + dy + fall];
    // Sichel: Außenbogen von C0 (wo außerhalb von C1), Innenbogen von C1 mit Profil
    const c1x = cx - d;
    const aussen = [];
    for (let i = 0; i <= 80; i++) { const a = -Math.PI + i / 80 * 2 * Math.PI; const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; if (Math.hypot(x - c1x, y - cy) > R1) aussen.push([x, y]); }
    aussen.sort((p1, p2) => p1[1] - p2[1]);
    // nur rechte Seite: von oben nach unten entlang x>c1x
    const rechts = aussen.filter(([x]) => x > c1x);
    const top = rechts[0], bot = rechts[rechts.length - 1];
    // Profil an der Innenkante, nach links vorspringend (y relativ zur Mitte): Stirn, Nasenwurzel, Nase, Lippen, Kinn
    const prof = y => { const u = (y - cy) / R; const k = Math.max(0.62, d / 38);
      const bump = (m, s, h) => h * Math.exp(-(((u - m) / s) ** 2));
      return k * (bump(-0.38, 0.13, 7) - bump(-0.2, 0.05, 4) + bump(-0.06, 0.075, 15) - bump(0.07, 0.04, 3) + bump(0.135, 0.035, 5) - bump(0.19, 0.025, 2.5) + bump(0.23, 0.04, 4) + bump(0.37, 0.09, 8)); };
    const innen = [];
    const aT = Math.asin(Math.max(-1, Math.min(1, (top[1] - cy) / R1))), aB = Math.asin(Math.max(-1, Math.min(1, (bot[1] - cy) / R1)));
    for (let i = 0; i <= 90; i++) { const a = aB - (aB - aT) * i / 90; const y = cy + Math.sin(a) * R1, x = c1x + Math.cos(a) * R1; innen.push([x - prof(y), y]); }
    const sichel = v.voll ? E(...T([cx, cy]), R, R, null) : Pg([...rechts, ...innen].map(T), null, { rd: 1 });
    // Ring: der Rest der Scheibe im aschgrauen Licht (linker Bogen von C0 zwischen den Spitzen)
    const ringK = [];
    if (v.ring && !v.voll) { const n = 40; let last = null;
      // von der oberen Spitze gegen den Uhrzeigersinn über links zur unteren Spitze
      const aa = Math.atan2(top[1] - cy, top[0] - cx); // obere Spitze; von dort gegen den Uhrzeigersinn über links zur unteren
      const span = 2 * Math.PI - Math.abs(Math.atan2(bot[1] - cy, bot[0] - cx) - Math.atan2(top[1] - cy, top[0] - cx));
      for (let i = 0; i <= n; i++) { const a = aa - span * i / n; const pt = T([cx + Math.cos(a) * (R - 1), cy + Math.sin(a) * (R - 1)]); if (last) ringK.push(C(last[0], last[1], pt[0], pt[1], v.ring * (0.8 + 0.25 * Math.sin(i * 0.7)), v.ring * (0.8 + 0.25 * Math.sin((i + 1) * 0.7)), null)); last = pt; }
    }
    // Augen im Dunkel: Krater mit Wall, frei schwebend auf der Scheibe (Positionen fest, je Phase mehr)
    const AUGEN = [[50, 64, 9], [46, 106, 8], [78, 40, 6], [26, 86, 6.5], [70, 130, 6.5], [84, 92, 5.5], [30, 120, 5], [86, 62, 5]];
    const augenK = [];
    if (!v.voll) for (let i = 0; i < v.augen; i++) { const [ex, ey, er] = AUGEN[i]; const [tx, ty] = T([ex, ey]); if (Math.hypot(ex - c1x, ey - cy) < R1 - er - 1) augenK.push({ x: tx, y: ty, r: er, i }); }
    const augenF = augenK.map(a => E(a.x, a.y, a.r, a.r * 0.8, null));
    // Hügel aus Asche, in dem die Scheibe steht
    const huegel = Pg([[30, 178], [40, 170], [52, 166], [60, 160], [70, 162], [80, 156], [92, 158], [104, 154], [114, 159], [124, 166], [134, 168], [142, 178]], null, { rd: 2.5 });
    const brocken = [E(46, 172, 6, 4, null), E(132, 173, 7, 4, null), E(116, 176, 4, 3, null)];
    const gruppen = [
      { p: ringK, k: 0, kante: true },                 // 0
      { p: augenF, k: 0, kante: true },                // 1
      { p: [sichel], k: 0, kante: true, anker: [0, dy] }, // 2
      { p: [huegel, ...brocken], k: 2, tone: 0.1 },    // 3
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('mond'), { rimBis: 160 });
    const augen = [];
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Sichel: zur Außenkante hin heller (dort liegt das Licht), zur Innenkante dunkler: gedithert
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== 2) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const ux = x + 0.5 - dx - px, uy = y + 0.5 - dy - fall - py; const lx = px + ux * ca + uy * sa, ly = py - ux * sa + uy * ca; const dd = R - Math.hypot(lx - cx, ly - cy); // Abstand zur Außenkante (zurückgedreht)
        const t = 1 - Math.min(1, dd / (d * 0.9 + 4)); const b = LIB.bay(x, y - dy);
        if (t > 0.86 + b * 0.1) P.set(x, y, 'r1'); else if (t > 0.6 + b * 0.25) P.set(x, y, 'k3'); else if (t > 0.3 + b * 0.3 && c < 3) P.set(x, y, 'k2');
      }
      // Krater auf der Sichel: Wall hell unten links, Schatten oben rechts; in manchen wohnt ein Licht
      const KR = [[0.55, -0.62, 5], [0.7, -0.3, 3.5], [0.84, 0.05, 6], [0.7, 0.38, 4], [0.5, 0.66, 5], [0.88, -0.12, 2.5], [0.62, 0.12, 3]];
      KR.forEach(([fx, fy, kr], i) => {
        const ang = Math.atan2(fy, fx); const rr = R - Math.max(kr + 3, (d * 0.45)) ; const [kx, ky] = T([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]);
        const KX = r(kx), KY = r(ky); if (gid[KY * W + KX] !== 2) return;
        for (let y = Math.floor(KY - kr - 1); y <= KY + kr + 1; y++) for (let x = Math.floor(KX - kr - 1); x <= KX + kr + 1; x++) {
          if (gid[y * W + x] !== 2) continue; const q = Math.hypot(x - KX, y - KY) / kr; const lit = (x - KX) * -0.7 + (y - KY) * 0.7;
          if (q < 0.55) P.set(x, y, lit > 0 ? 'k1' : 'k0'); else if (q < 1) P.set(x, y, lit > 0 ? 'r1' : 'k1'); else if (q < 1.3 && lit > 0 && LIB.bay(x, y) < 0.6) P.set(x, y, 'k3');
        }
        if (i % 3 === 1 && (!p.tod || f < 1)) { P.set(KX, KY, 'glutDim'); P.set(KX - 1, KY, 'bleich'); }
      });
      // Gesicht am Profil: Auge (offen, sieht nach links), Braue, Mund (öffnet sich beim Angriff)
      const ink = y => { const a = Math.asin(Math.max(-1, Math.min(1, (y - cy) / R1))); return c1x + Math.cos(a) * R1 - prof(y); };
      if (!v.voll) {
        const k = Math.max(0.5, d / 38);
        const ey0 = cy - R * 0.22, [ex, ey] = T([ink(ey0) + 4 + 3 * k, ey0]);
        const EX = r(ex), EY = r(ey);
        // Augenhöhle
        for (let y = EY - 2; y <= EY + 2; y++) for (let x = EX - 3; x <= EX + 3; x++) if (gid[y * W + x] === 2 && Math.hypot((x - EX) / 3.4, (y - EY) / 2.2) < 1) P.set(x, y, 'k0');
        P.line(EX - 3, EY - 4, EX + 4, EY - 5, 'k3', true); P.line(EX - 3, EY - 3, EX + 3, EY - 4, 'k0', true);
        if (!p.tod || f < 1) { const zu = blinz === 2; if (!zu) { P.set(EX - 2, EY, 'kern'); P.set(EX - 1, EY, 'glut'); P.set(EX, EY, 'glutDim'); P.glow(EX - 1, EY + 0.5, 6, 0.6); } else P.line(EX - 3, EY, EX + 2, EY, 'k3', true); augen.push([EX - 2, EY]); }
        // Mund: zwischen Lippen, ein Spalt; offen glimmt es darin
        const my0 = cy + R * 0.135; const [mx, my] = T([ink(my0) + 2, my0]); const MX = r(mx), MY = r(my);
        P.line(MX, MY, MX + 6 + 2 * k, MY, 'k0', true);
        if (mund > 0.2) { const h = Math.round(mund * 3); for (let j = 1; j <= h; j++) P.line(MX + 1, MY + j, MX + 5, MY + j, j === h ? 'k0' : 'glutDim', true); P.auf(MX + 2, MY + 1, 'bleich'); }
        // Nasenflügel, Wange: ein Grat
        const [nx, ny] = T([ink(cy - R * 0.02) + 5, cy - R * 0.02]); P.auf(r(nx), r(ny), 'k0'); P.auf(r(nx) + 1, r(ny) - 1, 'k3');
        const [wx, wy] = T([ink(cy + R * 0.02) + 9 * k, cy + R * 0.02]); for (let j = 0; j < 5; j++) P.auf(r(wx) + (j >> 1), r(wy) - j * 2, j % 2 ? 'k3' : 'k2');
      }
      // Augen im Ring: Krater mit Wall, darin Lider, die sich öffnen; die Pupille sieht nach links
      augenK.forEach(a => {
        const AX = r(a.x), AY = r(a.y);
        const zu = p.idle && a.i > 0 && (a.i % 4) === ((blinz + 1) % 4);
        const off = p.tod ? 0 : zu ? 0.12 : 0.62; // Öffnung der Lider
        for (let y = Math.floor(AY - a.r - 1); y <= AY + a.r + 1; y++) for (let x = Math.floor(AX - a.r - 1); x <= AX + a.r + 1; x++) {
          if (gid[y * W + x] !== 1) continue; const q = Math.hypot(x - AX, (y - AY) / 0.8) / a.r; const lit = (x - AX) * -0.7 + (y - AY) * 0.7;
          const u = (x - AX) / (a.r * 0.78), w = (y - AY) / (a.r * 0.8 * off); const imLid = u * u + w * w < 1 && Math.abs(u) < 1;
          if (imLid) P.set(x, y, Math.hypot(x - AX + 1.5, y - AY) < a.r * 0.36 ? 'bleich' : 'k0');
          else if (q < 0.72) P.set(x, y, lit > 0 ? 'k3' : 'k1'); else P.set(x, y, lit > 0 ? 'r1' : 'k2');
        }
        if (!p.tod || f < 1) { if (!zu) { P.set(AX - 2, AY, 'kern'); P.set(AX - 1, AY, 'glut'); P.set(AX - 2, AY - 1, 'glut'); P.set(AX - 1, AY - 1, 'glut'); augen.push([AX - 2, AY]); } else P.line(AX - a.r * 0.7, AY, AX + a.r * 0.7, AY, 'k0', true); }
      });
      // aschgraues Licht: der Ring leuchtet innen (zur Scheibe hin) schwach nach
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === 0) { const c = P.get(x, y); if (c >= 1 && c <= 2 && LIB.bay(x, y) < 0.4) P.set(x, y, 'k3'); }
      // Hügel: Körner, Spuren; Fuß der Sichel steckt darin
      for (let x = 30; x < 146; x += 3) { let y = 150; while (y < H && gid[y * W + x] !== 3) y++; if (y < H) P.set(x, y, (x * 7) % 5 < 2 ? 'r1' : 'k3'); if (y + 3 < H && x % 2) P.auf(x, y + 3 + (x % 5), 'asche'); }
    };
    return { gruppen, details, augen, dy: ganz };
  },
};
