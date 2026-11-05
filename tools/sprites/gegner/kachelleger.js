// Die Station, die nie eröffnet wurde: Der Kachelleger. Er hat die Station 1925 gekachelt, Wand um Wand, bis
// zum Tag der Eröffnung, und er hat nicht aufgehört. Die Kacheln wachsen ihm jetzt über Rücken, Schulter und
// Kopf, in sauberen Reihen mit Fugen, und er drückt mit der Kelle die nächste an sich selbst. Aus den Fugen
// kommt ein kaltes Licht, als wäre hinter ihm noch ein Raum. Was offen ist, verfugt er.
'use strict';
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'kachelleger', biom: 'station', zone: 'station', w: 96, h: 120, fuss: [48, 115], kopf: [34, 30], rimBis: 113,
  varianten: {
    // a: die Kacheln auf Rücken und Schulter, halber Hinterkopf; in der Hand eine Kachel, die er sich auf die Brust drückt
    kachelleger_a: { weit: false },
    // b: weiter zugekachelt: der Kopf bis auf ein Auge, der Kellenarm bis zum Ellbogen; ein Mörteleimer an der Hand
    kachelleger_b: { weit: true },
  },
  // Silhouetten-Probe (nicht gebaut): gebückter Arbeiter mit Kelle ohne Kachelpanzer (las sich als Maurer, nichts
  // Falsches; zu nah am Holzfäller). Genommen: der Kachelbuckel mit Treppenkante.
  proben: { probe_ohne: { weit: false, ohne: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, fall = 0, arm = 0, kopfH = 0;
    // arm: 0 Kelle vorn, 1 hoch hinter dem Kopf (ausgeholt), 2 vorn unten durchgezogen
    if (p.idle) { kopfH = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; arm = [0.5, 1, 2, 1.6][f]; kopfH = [-1, -2, 2, 1][f]; }
    if (p.treffer) { lean = [3, 2][f]; kopfH = -1; }
    if (p.tod) { fall = r(p.q * 24); lean = r(p.q * 3); }
    const T = fall, L = lean;
    // Beine: breit, Arbeitshose, schwere Schuhe
    const beinV = glied([[42 + L * 0.3, 84 + T], [38, 98 + T * 0.4], [37, 111]], 4.2, 3.4, null);
    const beinH = glied([[55 + L * 0.3, 84 + T], [58, 98 + T * 0.4], [59, 111]], 4.2, 3.4, null);
    const schuhe = [E(35, 112.5, 6, 2.8, 'dunkel'), E(60, 112.5, 5.5, 2.8, 'dunkel')];
    // Rumpf: gebückt, Buckel hinten oben
    const sx = 48 + L, sy = 46 + T;
    const rumpf = Pg([[sx - 12, sy + 4], [sx - 6, sy - 2], [sx + 6, sy - 6], [sx + 16, sy - 4], [sx + 20, sy + 6], [sx + 18, sy + 24], [sx + 12, sy + 40], [sx - 12, sy + 40], [sx - 15, sy + 22]], null, { rd: 2 });
    const schurz = Pg([[sx - 14, sy + 12], [sx - 2, sy + 14], [sx + 2, sy + 52], [sx - 16, sy + 50]], null, { rd: 1 });
    const kx = 34 + L * 1.2, ky = 42 + T + kopfH;
    const kopf = [E(kx, ky, 6.6, 7.2, 'haut', { pf: 'bevel' }), C(kx - 6, ky + 1, kx - 8.5, ky + 3, 1.8, 1.1, 'haut'), E(kx - 2, ky + 5, 4, 3, 'haut')];
    const halsF = C(sx - 6, sy, kx + 2, ky + 2, 4.5, 3.6, 'haut');
    // Kellenarm (vorn)
    const schV = [sx - 9, sy + 4];
    let eV, hV, kd;
    if (arm < 0.5) { eV = [sx - 16, sy + 18]; hV = [sx - 26, sy + 16]; kd = Math.PI; }
    else if (arm < 1.5) { const k = Math.min(1, arm); eV = [sx - 12 + k * 4, sy + 2 - k * 8]; hV = [sx - 18 + k * 8, sy - 10 - k * 8]; kd = Math.PI + 0.5 + k * 0.6; }
    else { const k = arm - 1.5; eV = [sx - 20 + k * 4, sy + 16]; hV = [sx - 32 + k * 6, sy + 28 - k * 4]; kd = Math.PI - 0.6; }
    const armV = [...glied([schV, eV, hV], 4, 3.2, null), E(hV[0], hV[1], 3, 2.6, 'haut')];
    const cd = Math.cos(kd), sd = Math.sin(kd), nx = -sd, ny = cd;
    const griff = C(hV[0], hV[1], hV[0] + cd * 4, hV[1] + sd * 4, 1, 1, null);
    const bx0 = hV[0] + cd * 4, by0 = hV[1] + sd * 4;
    const kelle = [griff, Pg([[bx0 + nx * 4, by0 + ny * 4], [bx0 + cd * 12, by0 + sd * 12], [bx0 - nx * 4, by0 - ny * 4]], null, { rd: 0.4 })];
    // hinterer Arm: drückt eine Kachel auf die eigene Brust (a) bzw. trägt den Mörteleimer (b)
    const schH = [sx + 12, sy + 4];
    const eH = v.weit ? [sx + 17, sy + 20] : [sx + 10, sy + 22], hH = v.weit ? [sx + 16, sy + 34] : [sx - 4, sy + 18];
    const armH = [...glied([schH, eH, hH], 3.8, 3, null), E(hH[0], hH[1], 2.8, 2.4, 'haut')];
    const eimer = v.weit ? [Pg([[hH[0] - 5, hH[1] + 4], [hH[0] + 6, hH[1] + 4], [hH[0] + 5, hH[1] + 15], [hH[0] - 4, hH[1] + 15]], null, { rd: 0.8 }), C(hH[0] - 5, hH[1] + 4, hH[0], hH[1], 0.6, 0.6, null), C(hH[0] + 6, hH[1] + 4, hH[0], hH[1], 0.6, 0.6, null)] : [];
    // Kacheln: Raster über Rücken, Schulter, Hinterkopf (b: auch Gesicht und Kellenarm), Treppenkante nach außen
    const kacheln = [];
    if (!v.ohne) {
      const z = 5, ox = r(sx) - 20, oy = r(sy) - 24;
      const bedeckt = (cx, cy) => {
        const rx = cx - sx, ry = cy - sy;
        const ruecken = rx > -2 - ry * 0.1 && ry < 34 && ry > -6 && rx < 23 - Math.max(0, ry - 20) * 0.5;
        const kopfK = Math.hypot(cx - kx - (v.weit ? -1 : 3), cy - ky + 1) < (v.weit ? 8 : 6.5) && cx > kx - (v.weit ? 6 : 0);
        const armK = v.weit && arm < 0.5 && Math.hypot(cx - (sx - 12), cy - (sy + 12)) < 7;
        return ruecken || kopfK || armK;
      };
      for (let j = 0; j < 14; j++) for (let i = 0; i < 12; i++) {
        const x0 = ox + i * z + (j % 2 ? 2 : 0), y0 = oy + j * z;
        if (!bedeckt(x0 + 2, y0 + 2)) continue;
        kacheln.push(Pg([[x0, y0], [x0 + z - 1.2, y0], [x0 + z - 1.2, y0 + z - 1.2], [x0, y0 + z - 1.2]], null, { rd: 0.2 }));
      }
    }
    const kachelHand = v.weit ? [] : [Pg([[hH[0] - 3, hH[1] - 6], [hH[0] + 2, hH[1] - 6], [hH[0] + 2, hH[1] - 1], [hH[0] - 3, hH[1] - 1]], null, { rd: 0.2 })];
    const gruppen = [
      { p: [...beinH, schuhe[1]], k: 1, kante: true },                   // 0
      { p: [...beinV, schuhe[0]], k: 1, kante: true },                   // 1
      { p: [rumpf], k: 2, kante: true, anker: [L, T] },                  // 2 Rumpf
      { p: [schurz], k: 0.8, kante: true, tone: 0.1 },                   // 3 Schurz
      { p: [halsF], k: 1, kante: true },                                 // 4 Hals
      { p: kopf, k: 1.4, kante: true, anker: [L, T] },                   // 5 Kopf
      { p: kacheln, k: 0, kante: false, tone: 0.75, pf: 'flat' },        // 6 Kacheln
      { p: armH, k: 1, kante: true, anker: [L, T] },                     // 7 hinterer Arm
      { p: [...eimer, ...kachelHand], k: 0, kante: true, tone: 0.25 },   // 8 Eimer / Kachel in der Hand
      { p: armV, k: 1, kante: true, anker: [L, T] },                     // 9 Kellenarm
      { p: kelle, k: 0, kante: true, tone: 0.2 },                        // 10 Kelle
    ];
    if (v.weit && arm < 0.5) { const g = gruppen.splice(6, 1)[0]; gruppen.splice(9, 0, g); }
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('station'), { rimBis: 113 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const kGrp = gruppen.findIndex(g => g.p === kacheln);
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kacheln: Glasur (heller Fleck oben rechts), Lichtkante; Fugen dunkel, manche glimmen kalt
      kacheln.forEach((k, n) => {
        const [x0, y0] = k.v[0]; const X0 = Math.round(x0), Y0 = Math.round(y0);
        if (gid[Math.min(W * H - 1, Math.max(0, (Y0 + 2) * W + X0 + 2))] !== kGrp) return;
        for (let yy = Y0; yy < Y0 + 4; yy++) for (let xx = X0; xx < X0 + 4; xx++) { const c = P.get(xx, yy); if (c >= 1 && c <= 4) P.set(xx, yy, (xx === X0 || yy === Y0 + 3) ? 'k2' : 'k3'); }
        P.auf(X0 + 3, Y0, n % 2 ? 'blass' : 'r1'); if (n % 3 === 0) P.auf(X0 + 2, Y0, 'k3');
        if (!aus && (n * 7) % 5 === 0) { P.set(X0 + 4, Y0 + 2, 'glutDim'); P.set(X0 + 4, Y0 + 3, 'glutDim'); if (n % 4 === 0) P.set(X0 + 4, Y0 + 1, 'glut'); }
      });
      const X = r(sx), Y = r(sy);
      // Schurz: Latz, Tasche, Mörtelflecken
      for (let y = Y + 16; y < Y + 50; y += 3) P.auf(X - 3 + r((y - Y) * 0.1), y, 'k3');
      for (let x = X - 13; x < X - 4; x++) { P.auf(x, Y + 30, 'k0'); P.auf(x, Y + 29, 'k3'); }
      for (const [dx, dy] of [[-10, 22], [-7, 40], [-12, 45], [-4, 36]]) { P.auf(X + dx, Y + dy, 'blass'); P.auf(X + dx + 1, Y + dy, 'k3'); }
      // Hose: Knie, Falte
      P.line(38, 100, 37, 108, 'k3', true); P.line(58, 99, 59, 108, 'k0', true);
      // Gesicht: ein Auge (b: nur eins zwischen den Kacheln), Bartstoppeln, Mund zu
      const KX = r(kx), KY = r(ky);
      if (!aus) { P.set(KX - 4, KY - 1, 'kern'); P.set(KX - 5, KY - 1, 'glut'); P.glow(KX - 4, KY - 0.5, 4, 0.5); augen.push([KX - 4, KY - 1]); if (!v.weit) { P.set(KX, KY - 1, 'glut'); P.set(KX + 1, KY - 1, 'glutDim'); } }
      P.auf(KX - 6, KY - 3, 'k0'); P.auf(KX - 5, KY - 3, 'k0'); P.auf(KX - 3, KY - 3, 'k3');
      for (let x = KX - 6; x < KX - 1; x++) P.auf(x, KY + 5, 'k0');
      P.auf(KX - 8, KY + 1, 'k3'); P.auf(KX - 7, KY + 2, 'k3');
      // Kelle: Blatt glänzt, Mörtel darauf
      const KD = [r(bx0 + cd * 6), r(by0 + sd * 6)]; P.auf(KD[0], KD[1], 'blass'); P.auf(KD[0] + 1, KD[1], 'r1'); P.auf(KD[0] - 1, KD[1] + 1, 'k3');
      // Kachel in der Hand bzw. Eimer
      if (kachelHand.length) { const hx = r(hH[0]), hy = r(hH[1]); for (let y = hy - 6; y < hy - 1; y++) for (let x = hx - 3; x < hx + 2; x++) P.auf(x, y, (x + y) % 3 ? 'k3' : 'blass'); P.auf(hx + 1, hy - 6, 'r2'); }
      if (eimer.length) { const hx = r(hH[0]), hy = r(hH[1]); for (let x = hx - 4; x < hx + 6; x++) { P.auf(x, hy + 5, 'blass'); P.auf(x, hy + 6, x % 2 ? 'k3' : 'k1'); } P.line(hx - 4, hy + 10, hx + 5, hy + 10, 'k0', true); }
    };
    return { gruppen, details, augen };
  },
};
