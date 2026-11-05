// Kurhaus, zweiter Wächter: Der Badekarren. Ein Badekarren von 1900, Holzhütte auf zwei hohen Rädern, vorn das
// Leinenverdeck, unter dem die Dame ungesehen ins Wasser steigt. Seit der Nachsaison 1900 hat ihn niemand
// zurückgezogen, und die Dame darin ist nicht ausgestiegen. Nach dem Krankenblatt geht es ihr jeden Tag
// besser. Das Verdeck ist von innen erleuchtet; man sieht ihren Schatten darauf, sie sitzt sehr gerade, und
// ihr Hals ist zu lang. Der Karren fährt ohne Pferd. Wenn sich der Vorhang öffnet, greift sie heraus.
'use strict';
const KA = require('./hilfe/kanten');
const LIB = require('../lib');

module.exports = {
  id: 'badekarren', biom: 'kurhaus', zone: 'kurhaus_karren', rang: 'waechter', w: 160, h: 180, fuss: [90, 176], kopf: [96, 40], rimBis: 174,
  varianten: { badekarren: {} },
  // Silhouetten-Probe (nicht gebaut): die Hütte ohne Verdeck, nur Kasten, Dach und Räder. Schwarz ein Wohnwagen
  // oder eine Kutsche, zu nah am Gepäckstück (Nachtzug) und an einem Schrank. Genommen: mit dem Verdeck als
  // großer Haube nach vorn, darunter die Stufen, davor die Deichsel.
  proben: { probe_ohne_verdeck: { ohneVerdeck: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let X = 0, Y = 0, kipp = 0, arm = 0, auf = 0, hals = 0, fall = 0, rad = 0;
    if (p.idle) { hals = [0, 1, 2, 1][f]; }
    if (p.angriff) { X = [5, 8, -10, -4][f]; kipp = [1, 2, -2, -1][f]; arm = [0, 0.15, 1, 0.5][f]; auf = [0.2, 0.5, 1, 0.6][f]; rad = [1, 2, -3, -1][f]; }
    if (p.treffer) { X = [3, 1][f]; kipp = 1; }
    if (p.tod) { fall = r(p.q * 16); kipp = -r(p.q * 6); }
    const ohne = !!v.ohneVerdeck;
    const kY = x => Y + fall + kipp * (x - 100) / 40; // Kippen um die Achse: vorne hoch beim Ausholen
    const P2 = (x, y) => [x + X, y + kY(x)];
    const Rr = pts => pts.map(([x, y]) => P2(x, y));
    // Räder: hinten groß, vorn kleiner; Speichen in den Details
    const radH = { x: 116 + X, y: 154 + fall * 0.4, r: 21 }, radV = { x: 62 + X, y: 158 + fall * 0.4, r: 17 };
    const raeder = [E(radH.x, radH.y, radH.r, radH.r, null, { pf: 'flat' }), E(radV.x, radV.y, radV.r, radV.r, null, { pf: 'flat' })];
    // Fahrgestell, Deichsel nach vorn auf den Boden
    const gestell = [Pg(Rr([[60, 142], [138, 142], [138, 149], [60, 149]]), null, { rd: 0.6 }), C(...P2(64, 147), 10 + X * 0.5, 172, 2, 1.6, null), C(...P2(70, 148), 22 + X * 0.5, 174, 1.8, 1.4, null)];
    // Hütte: Kasten mit Bretterwand, Dach mit Überstand und Firstleiste
    const huette = Pg(Rr([[66, 76], [100, 56], [134, 76], [134, 144], [66, 144]]), null, { rd: 0.8 });
    const dach = Pg(Rr([[58, 76], [100, 50], [142, 76], [138, 80], [100, 57], [62, 80]]), null, { rd: 0.8 });
    const first = C(...P2(97, 50), ...P2(103, 50), 2.4, 2.4, null);
    const fahne = [C(...P2(100, 50), ...P2(100, 36), 0.8, 0.7, null, { pf: 'flat' }), Pg(Rr([[100, 36 + hals * 0.5], [88, 38 + hals * 0.5], [100, 42]]), null, { rd: 0.3 })];
    // Verdeck: Leinenhaube vorn, mit Spriegeln; öffnet sich im Angriff (Vorhang)
    const vd = ohne ? [] : [Pg(Rr([[70, 72], [54, 72], [40, 80], [30, 96], [26, 118], [26, 142], [36, 144], [52, 142], [68, 140]]), null, { rd: 1.6 })];
    // Stufen unter dem Verdeck
    const stufen = ohne ? [] : [Pg(Rr([[44, 144], [66, 144], [66, 150], [44, 150]]), null, { rd: 0.4 }), Pg(Rr([[38, 156], [62, 156], [62, 161], [38, 161]]), null, { rd: 0.4 }), C(...P2(46, 146), 40 + X, 170, 1.2, 1.2, null), C(...P2(62, 146), 58 + X, 170, 1.2, 1.2, null)];
    // Arm der Dame (Angriff): aus dem Spalt des Vorhangs, viel zu lang
    const armF = [];
    if (arm > 0.1) { const ex = 30 - arm * 28, ey = 126 - arm * 6; armF.push(...glied(Rr([[38, 104], [22 - arm * 6, 116], [ex, ey]]), 3.4, 2.6, 'haut'), E(...P2(ex - 2, ey + 1), 4, 3.2, 'haut')); for (let k = -1.5; k <= 1.5; k++) armF.push(C(...P2(ex - 4, ey + 1), ...P2(ex - 11, ey + k * 2.6 + 2), 1, 0.7, 'haut')); }
    const gruppen = [
      { p: [raeder[0]], k: 0, kante: true },          // 0 Hinterrad
      { p: gestell, k: 0.5, kante: true },            // 1
      { p: [huette], k: 0, kante: true, tone: 0.04 }, // 2
      { p: [dach, first], k: 0.6, kante: true, tone: 0.1 }, // 3
      { p: fahne, k: 0, kante: true },                // 4
      { p: stufen, k: 0, kante: true },               // 5
      { p: [raeder[1]], k: 0, kante: true },          // 6 Vorderrad
      { p: vd, k: 0, kante: true, tone: 0.1 },        // 7 Verdeck
      { p: armF, k: 1, kante: true, tone: 0.3 },      // 8
    ];
    const RH = 0, HUETTE = 2, DACH = 3, RV = 6, VD = 7;
    gruppen.forEach(g => { g.anker = [X, Y + fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('kurhaus_karren'), { rimBis: 174 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - X, y - Y - fall);
      // Hütte: senkrechte Bretter, gestreifter Anstrich (abwechselnd hell und dunkel, verblichen), ein Fenster mit Licht
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== HUETTE) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = x - X - 66, band = Math.floor(u / 7);
        let t = band % 2 ? Math.max(1, c - 1) : c;
        if (u % 7 < 1) t = 1;
        if (band % 2 === 0 && u > 40 && B(x, y) < 0.35 + (u - 40) / 60) t = 4;
        P.set(x, y, t);
      }
      // Fensterchen hoch in der Seitenwand, von innen hell
      { const [fx, fy] = P2(110, 86); for (let yy = 0; yy < 9; yy++) for (let xx = 0; xx < 12; xx++) { const xX = r(fx + xx), yY = r(fy + yy + (kipp * xx) / 40); if (gid[yY * W + xX] !== HUETTE) continue; const rahmen = xx === 0 || xx === 11 || yy === 0 || yy === 8; P.set(xX, yY, rahmen ? 'k1' : (yy < 3 || xx > 8 ? 'glutDim' : 'glut')); }
        P.glow(fx + 6, fy + 4, 9, 0.6, 'glutDim', 'k3'); augen.push([r(fx + 3), r(fy + 4)]);
        // im Fenster: ein Kopf von hinten, sehr hoch
        P.set(fx + 3, fy + 2, 'k1'); P.set(fx + 3, fy + 3, 'k1'); P.set(fx + 4, fy + 2, 'k1'); P.set(fx + 3, fy + 4, 'k2'); P.set(fx + 3, fy + 5, 'k2'); P.set(fx + 3, fy + 6, 'k2'); P.set(fx + 3, fy + 7, 'k2'); }
      // Dach: Schindelreihen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== DACH) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; if (((y - kY(x) + 400) % 4) < 1) P.set(x, y, 'k0'); }
      // Räder: Felge, Speichen, Nabe aus Messing
      for (const [R0, g] of [[radH, RH], [radV, RV]]) {
        for (let y = r(R0.y - R0.r); y <= R0.y + R0.r; y++) for (let x = r(R0.x - R0.r); x <= R0.x + R0.r; x++) {
          if (gid[y * W + x] !== g) continue; const c = P.get(x, y); if (c > 6) continue; const d = Math.hypot(x + 0.5 - R0.x, y + 0.5 - R0.y), an = Math.atan2(y + 0.5 - R0.y, x + 0.5 - R0.x) + rad * 0.12;
          if (d > R0.r - 3) P.set(x, y, d > R0.r - 1.2 ? c : 'k3');
          else if (d < 3) P.set(x, y, d < 1.6 ? 'messing' : 'k3');
          else P.loesch(x, y);
        }
      }
      for (const [R0, g] of [[radH, RH], [radV, RV]]) for (let k = 0; k < 10; k++) { const an = k / 10 * Math.PI * 2 + rad * 0.12; for (let q = 2.5; q < R0.r - 2.5; q += 0.5) { const x = r(R0.x + Math.cos(an) * q - 0.5), y = r(R0.y + Math.sin(an) * q - 0.5); if (gid[y * W + x] === g) P.set(x, y, Math.cos(an) - Math.sin(an) > 0.6 ? 'r1' : 'k2'); } }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Verdeck: Leinen von innen erleuchtet, Spriegel radial, der Schatten der Dame darauf; der Vorhang vorn
      if (!ohne) {
        const [ox, oy] = P2(70, 108); // Mitte der Spriegel (hinten am Kasten)
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          if (gid[y * W + x] !== VD) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue;
          const an = Math.atan2(y + 0.5 - oy, x + 0.5 - ox), d = Math.hypot(x + 0.5 - ox, y + 0.5 - oy);
          const sp = ((an / 0.32) % 1 + 1) % 1;
          // Licht von innen: zur Mitte der Haube heller (gedithert), am Rand dunkel
          const lv = Math.max(0, 1 - Math.hypot((x - ox + 24) / 30, (y - oy) / 36));
          let t = lv > 0.55 + B(x, y) * 0.3 ? 'glutDim' : lv > 0.25 + B(x, y) * 0.3 ? 'k3' : c > 4 ? c : 'k2';
          if (sp < 0.12 && d > 8) t = 'k0';
          if (c === 5 || c === 6) t = c;
          P.set(x, y, t);
        }
        // Schatten der Dame auf dem Leinen: sitzend, Rücken gerade, Hals zu lang, kleiner Kopf
        const sx = ox - 24, sy = oy + 18;
        const schatten = (x, y) => (Math.abs(x - sx) < 6 && y > sy - 14 && y < sy + 14) || (Math.abs(x - sx - 1) < 1.4 && y > sy - 30 - hals && y <= sy - 14) || Math.hypot(x - sx - 1, y - (sy - 33 - hals)) < 3.6;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === VD && schatten(x, y) && P.get(x, y) !== 5 && P.get(x, y) !== 6) P.set(x, y, 'k1');
        // Spalt im Vorhang vorn: zwei Augen
        const offen = auf;
        const [gx, gy] = P2(28, 116);
        for (let yy = -16; yy <= 16; yy++) { const w = 1 + Math.round(offen * 4 * (1 - Math.abs(yy) / 17)); for (let k = 0; k < w; k++) if (P.get(r(gx + 2 + k), r(gy + yy))) P.set(r(gx + 2 + k), r(gy + yy), 'k0'); }
        if (!(p.tod && f >= 1)) { P.set(gx + 3, gy - 6, 'kern'); P.set(gx + 4 + offen * 2, gy - 6, 'glut'); P.glow(gx + 3, gy - 6, 5, 0.6, 'glutDim', 'k3'); augen.push([r(gx + 3), r(gy - 6)]); }
        // Saum mit Fransen unten
        for (let x = 0; x < W; x++) { let yb = -1; for (let y = H - 1; y > 0; y--) if (gid[y * W + x] === VD) { yb = y; break; } if (yb > 0 && x % 2 === 0) { P.set(x, yb + 1, 'k2'); if (x % 4 === 0) P.set(x, yb + 2, 'k1'); } }
      }
      // Arm: Licht an der Oberseite
      if (armF.length) KA.licht(P, armF, { c: 'r1', c2: null });
      // Deichsel und Stufen: Lichtkante
      KA.licht(P, gestell.slice(1), { c: 'r1', c2: null });
      // Randlicht oben rechts kräftig
      { const z = []; for (let y = 0; y < 172; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y, 'r2']); } for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
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
