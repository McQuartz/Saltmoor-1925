// Wächter Kloster: Der Abschreiber. Ein massiger Mönch mit hoher Kapuze an einem schrägen Pult auf einem Pfosten.
// Der Schreibarm hat ein Gelenk zu viel und hört nie auf. Aus dem Pult fällt ein beschriebener Pergamentstreifen
// in Schlingen bis auf den Boden, und er wird in jedem Bild länger. Eine Kerze auf der Pultecke.
'use strict';
module.exports = {
  id: 'abschreiber', biom: 'kloster', zone: 'kloster', rang: 'waechter', w: 128, h: 160, fuss: [70, 155], kopf: [84, 6], rimBis: 153,
  varianten: { abschreiber: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let atem = 0, lean = 0, fall = 0, augenAn = true, kerzeAn = true, schreib = 0, hand = null, nick = 0, streifen = 0;
    if (p.idle) { atem = 0; schreib = [0, 1, 2, 1][f]; nick = [0, 0, 1, 0][f]; streifen = f; }
    if (p.angriff) { lean = [1, 2, -4, -2][f]; hand = [[60, 40], [70, 18], [10, 96], [30, 80]][f]; nick = [-1, -2, 2, 1][f]; streifen = 4; }
    if (p.treffer) { lean = [3, 1][f]; nick = [-2, -1][f]; streifen = 4; }
    if (p.tod) { fall = r(p.q * 24); lean = -r(p.q * 8); augenAn = f < 1; kerzeAn = f < 2; streifen = 4; }
    const T = atem + fall;
    // Pult: schräge Platte (links hoch, zum Schreiber hin abfallend), Pfosten, Fußkreuz
    const pl = [[18, 66], [60, 78]]; // Oberkante links -> rechts
    const platte = Pg([[pl[0][0], pl[0][1]], [pl[1][0], pl[1][1]], [pl[1][0], pl[1][1] + 5], [pl[0][0] + 1, pl[0][1] + 5]], null, { rd: 0.6 });
    const kasten = Pg([[22, 71], [58, 82], [54, 92], [28, 86]], 'dunkel', { rd: 0.8 });
    const pfosten = [C(41, 86, 41, 150, 3, 3.6, null), C(26, 151, 56, 151, 2.4, 2.4, null), E(26, 152, 3, 2, null), E(56, 152, 3, 2, null)];
    // Mönch: sitzt hinter dem Pult, Rücken als Buckel, hohe spitze Kapuze, Kutte bis zum Boden
    const cx = 92 + lean;
    const kutte = Pg([[cx - 22, 64 + T], [cx - 16, 46 + T], [cx - 4, 38 + T], [cx + 10, 40 + T], [cx + 18, 54 + T], [cx + 22, 80 + T / 2], [cx + 24, 120], [cx + 26, 146], ...saum(cx + 26, cx - 30, 154, 8, 3, 61, p.idle ? [0, 1, 1, 0][f] : 0), [cx - 30, 146], [cx - 24, 118], [cx - 26, 94]], null, { rd: 2 });
    const knie = E(cx - 20, 100 + T / 2, 14, 7, null);
    const hx = cx - 10 + nick + Math.min(0, lean), hy = 32 + T + Math.abs(nick);
    const kapuze = Pg([[hx - 11, hy + 14], [hx - 12, hy + 2], [hx - 6, hy - 10], [hx + 6, hy - 24], [hx + 10, hy - 12], [hx + 13, hy + 6], [hx + 10, hy + 16]], null, { rd: 2.2 });
    const falten = [C(cx - 2, 56 + T, cx - 6, 148, 1.2, 2, 'dunkel'), C(cx + 10, 58 + T, cx + 14, 146, 1, 1.8, 'dunkel'), C(cx - 14, 60 + T, cx - 20, 92, 0.8, 1.2, 'dunkel')];
    // Schreibarm: Schulter -> Ellbogen -> zweiter Ellbogen (ein Gelenk zu viel) -> Hand am Pult
    const sh = [cx - 12, 52 + T];
    const H = hand ? [hand[0] + lean, hand[1]] : [34 + schreib, 70 + (schreib === 2 ? -1 : 0)];
    const e1 = hand ? [sh[0] - 4 + (H[0] - sh[0]) * 0.3, sh[1] + 16 + (H[1] - sh[1]) * 0.2] : [cx - 20, 76 + T];
    const e2 = hand ? [(e1[0] + H[0]) / 2 + 6, (e1[1] + H[1]) / 2 - 10] : [56 + schreib / 2, 62];
    const arm = glied([e1, e2, H], 2.6, 1.9, null);
    const aermel = [C(sh[0], sh[1], e1[0], e1[1], 5, 6.5, null), E(e1[0], e1[1] + 1, 6, 4.5, 'dunkel')];
    const knoechel = E(e2[0], e2[1], 2.8, 2.8, null);
    const handF = E(H[0], H[1], 3, 2.5, 'haut');
    // Feder: dünner Kiel von der Hand schräg nach oben links
    const fd = hand && f === 2 ? [H[0] - 10, H[1] + 6] : [H[0] + 5, H[1] - 13];
    const feder = [C(H[0], H[1], fd[0], fd[1], 0.6, 0.6, null, { pf: 'flat' }), C(H[0] - 1 + (fd[0] - H[0]) * 0.55, H[1] + (fd[1] - H[1]) * 0.55, fd[0], fd[1], 1.6, 0.6, null)];
    // linker Arm hält das Original (Buch auf dem Pult)
    const arm2 = glied([[cx - 6, 54 + T], [cx - 12, 74 + T], [52, 76]], 3.2, 2.2, null);
    // Pergamentstreifen: vom Pult herab, Schlingen am Boden; jedes Bild ein Stück länger
    const sp = [[19, 70], [14, 84], [17, 100], [12, 116], [16, 130], [10, 142], [20, 150], [36, 152], [46, 147], [36, 141], [26, 146], [30, 152 - streifen * 0.5], [42 + streifen * 2, 152]];
    if (p.tod) sp.forEach(q => { q[1] = Math.min(153, q[1] + fall * 0.3); });
    const streifenF = glied(sp, 2.8, 2.8, 'haut', { pf: 'flat' });
    const kerze = kerzeAn || p.tod ? [C(22, 58 - 1, 22, 65, 1.4, 1.6, null, { pf: 'flat' })] : [];
    const gruppen = [
      { p: arm2, k: 1 },
      { p: [kutte, knie], k: 4, anker: [lean, T] },
      { p: falten, k: 0, noRim: true },
      { p: [kapuze], k: 2, anker: [lean, T] },
      { p: pfosten, k: 1 },
      { p: [kasten], k: 1 },
      { p: [platte], k: 0 },
      { p: kerze, k: 0 },
      { p: streifenF, k: 1 },
      { p: aermel, k: 2 },
      { p: [...arm, knoechel, handF], k: 1 },
      { p: feder, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Buch (Original) und Blatt auf der Platte: helle Seiten im Kerzenlicht
      for (let k = 0; k < 30; k++) { const t = k / 30, x = 22 + t * 34, y = 66 + t * 11; P.auf(r(x), r(y), k % 4 === 3 ? 'k3' : 'r1'); P.auf(r(x), r(y) + 1, (k % 3) ? 'k3' : 'k2'); }
      // Pergament: der Streifen ist hell (Randlicht-Ton innen), mit gedithertem Schatten in den Schlingen
      for (let y = 66; y < 156; y++) for (let x = 4; x < 60; x++) { let d = 9; for (let i = 0; i < sp.length - 1; i++) { const [x0, y0] = sp[i], [x1, y1] = sp[i + 1]; const bx = x1 - x0, by = y1 - y0, t = Math.max(0, Math.min(1, ((x + 0.5 - x0) * bx + (y + 0.5 - y0) * by) / (bx * bx + by * by))); d = Math.min(d, Math.hypot(x + 0.5 - x0 - bx * t, y + 0.5 - y0 - by * t)); } if (d < 2.1) { const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, (x + y) % 3 === 0 && y > 138 ? 'k3' : 'r1'); } }
      // Schrift auf dem Streifen: kleine dunkle Zeichen in Reihen
      for (let i = 0; i < sp.length - 1; i++) { const [x0, y0] = sp[i], [x1, y1] = sp[i + 1]; const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)); for (let k = 0; k < n; k += 2) { const q = k / n, x = x0 + (x1 - x0) * q, y = y0 + (y1 - y0) * q; if (((i * 7 + k) % 5) !== 0) P.auf(r(x), r(y), (k + i) % 3 ? 'k0' : 'k1'); } }
      // Kapuze: dunkle Öffnung, darin zwei Augen, die dich ansehen (nicht das Blatt)
      const ox = r(hx - 6), oy = r(hy + 4);
      for (let y = oy - 6; y <= oy + 7; y++) for (let x = ox - 4; x <= ox + 4; x++) if (((x - ox) / 4.6) ** 2 + ((y - oy) / 7.5) ** 2 <= 1) P.auf(x, y, 'k0');
      if (augenAn) { P.auge(ox - 2, oy, 2); P.auge(ox + 2, oy + 1, 1); augen.push([ox - 2, oy], [ox + 2, oy + 1]); }
      // Kerze: Flamme, Schein auf Pult, Hand und Streifen
      if (kerzeAn) {
        const fl = p.idle ? [3, 4, 3, 4][f] : p.angriff ? [3, 2, 4, 3][f] : 3;
        P.glow(22.5, 54, 22, 0.8, 'glutDim', 'k3');
        P.set(22, 56, 'flamme'); P.set(22, 55, 'kern'); P.set(21, 55, 'flamme'); for (let k = 2; k <= fl; k++) P.set(22, 56 - k, k === fl ? 'flamme' : 'glut');
        augen.push([22, 55]);
      } else if (f < 4) for (let k = 0; k < 4; k++) P.set(22 + (k % 2), 54 - k - f, 'k3');
      // Federspitze: frische Tinte
      P.set(r(fd[0]), r(fd[1]), 'r2');
      if (!hand) { P.set(r(H[0]) - 3, r(H[1]) + 2, 'tinte'); P.set(r(H[0]) - 4, r(H[1]) + 2, 'k0'); }
      // Strick
      P.line(cx - 22, 92 + T, cx + 22, 90 + T, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
