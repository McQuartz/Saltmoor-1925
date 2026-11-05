// Das schwarze Eis, zweiter Wächter: Die Welle, die weiterkam. Ein Brecher aus schwarzem Eis, so hoch wie ein
// Haus, mitten im Überschlagen gefroren. In seiner Wand stecken die Ersten, die zum Land hin schwammen; das Eis
// hat sie in der Wendung gehalten, halb umgedreht, und ihre Augen sehen an dir vorbei auf etwas hinter dir.
// Hinter seinem Fuß liegt im Eis eine helle Narbe: Dort stand er vorhin. Jedes Mal, wenn man wegsieht, ist er
// ein Stück weiter. Phase 2 (welle_p2, „Gebrochen“): Die Lippe ist abgebrochen, die Wand steht offen, und die
// Ersten lehnen sich mit den Armen heraus.
// Randlicht in Fliederweiß (Zone eis_welle): Die Wächter-Szene „Der Riss“ ist ganz in Blau; der Flieder kommt
// dort nicht vor, die Welle löst sich so vom blauen Eis hinter ihr.
'use strict';
const LIB = require('../lib');
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'welle', biom: 'eis', zone: 'eis_welle', rang: 'waechter', w: 160, h: 180, fuss: [86, 174], kopf: [80, 10], rimBis: 168,
  todStart: 0.2,
  varianten: {
    welle: { gebrochen: false },
    welle_p2: { gebrochen: true },
  },
  // Silhouetten-Proben (nicht gebaut): stehende Wand ohne Überschlag (las sich als Fels oder Eisberg, zu nah am
  // Chor), Welle flach und breit wie eine Düne (bei 96 px Höhe im Kampf nur noch ein Hügel).
  // Genommen: hoher Brecher mit Lippe und Krallen, darunter die hohle Röhre.
  proben: {
    probe_wand: { gebrochen: false, wand: true },
    probe_flach: { gebrochen: false, flach: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180, FY = 174;
    // rueck: Welle lehnt sich zurück (Ausholen), lip: Lippe senkt sich (Schlag), dx: Vorrücken
    let dx = 0, rueck = 0, lip = 0, fall = 0, blinz = -1, tropf = 0;
    if (p.idle) { dx = [0, 0, -1, -1][f]; blinz = f; tropf = f; }
    if (p.angriff) { dx = [3, 5, -10, -5][f]; rueck = [0.5, 1, -0.6, -0.25][f]; lip = [-0.4, -0.9, 1, 0.5][f]; }
    if (p.treffer) { dx = [3, 1][f]; rueck = [0.25, 0.1][f]; }
    if (p.tod) { fall = r(p.q * 40); rueck = -p.q * 0.6; lip = p.q; }
    const flach = v.flach ? 0.55 : 1;
    // Verzerrung: Punkte oberhalb des Fußes kippen mit rueck nach rechts und mit fall nach unten
    const T = ([x, y]) => { const h = (FY - y) / 150; return [x + dx + rueck * 20 * h * h, FY - (FY - y) * flach + fall * h]; };
    // Lippe: um den Kamm nach unten gedreht (lip > 0 schlägt zu, < 0 hebt sich)
    const piv = [70, 22];
    const L = ([x, y]) => { const a = -lip * 0.42, ux = x - piv[0], uy = y - piv[1]; return T([piv[0] + ux * Math.cos(a) - uy * Math.sin(a), piv[1] + ux * Math.sin(a) + uy * Math.cos(a) + Math.max(0, lip) * 4]); };
    // Rücken und Kamm: von hinten rechts den Hang hinauf über den Kamm, dann die Wand (Innenseite der Röhre) hinab zum Fuß
    const ruecken = v.wand
      ? [[150, FY], [148, 120], [136, 60], [112, 26], [84, 16], [60, 22], [52, 50], [48, 100], [36, 150], [16, FY]]
      : [[154, FY], [150, 150], [143, 118], [134, 88], [124, 62], [112, 42], [98, 28], [82, 20], [68, 19], [63, 30], [67, 44], [73, 58], [75, 74], [73, 94], [67, 114], [57, 134], [43, 152], [27, 164], [8, FY]];
    const ruckK = Pg(ruecken.map(T), null, { rd: 2 });
    // Lippe: der überschlagende Kamm, nach links hinaus und hinab gekrümmt, unten in Krallen (gefrorene Gischt)
    const lippeP = [[96, 26], [84, 18], [68, 16], [54, 19], [42, 26], [32, 36], [24, 48], [20, 60], [21, 70], [26, 66], [31, 56], [38, 46], [48, 38], [60, 33], [72, 34], [82, 40]];
    const lippe = v.wand ? null : Pg(v.gebrochen ? [[96, 26], [84, 18], [70, 16], [62, 13], [58, 22], [52, 18], [48, 28], [44, 26], [46, 34], [60, 33], [72, 34], [82, 40]].map(L) : lippeP.map(L), null, { rd: 1.5 });
    // Krallen unter der Lippe: Gischt, gefroren zu langen, gekrümmten Fingern
    const krallen = [];
    if (!v.wand && !v.gebrochen) for (const [x0, y0, l, k] of [[21, 66, 14, 0.3], [26, 64, 11, 0.5], [31, 56, 9, 0.6], [37, 48, 7, 0.7]]) {
      const tp = tropf === krallen.length ? 1 : 0;
      const a = L([x0, y0]), b = L([x0 + 2 + k * 3, y0 + l * 0.6]), c = L([x0 + 4 + k * 5, y0 + l + tp]);
      krallen.push(C(a[0], a[1], b[0], b[1], 2.2, 1.4, null), C(b[0], b[1], c[0], c[1], 1.4, 0.5, null));
    }
    // Schaumkamm: gefrorene Schaumballen auf Kamm und Lippe (keine Zacken, sonst liest er sich als Rückenstachel)
    const gischt = [];
    for (const [x, y, rx, ry] of [[104, 32, 5, 3.5], [96, 25, 5.5, 3.5], [86, 19, 5, 3.2], [114, 43, 4, 3], [122, 55, 3.4, 2.6]]) { const q = T([x, y]); gischt.push(E(q[0], q[1], rx, ry, null)); }
    if (!v.wand && !v.gebrochen) for (const [x, y, rx, ry] of [[74, 16, 4.5, 3], [62, 17, 4, 2.8], [50, 21, 3.6, 2.6]]) { const q = L([x, y]); gischt.push(E(q[0], q[1], rx, ry, null)); }
    // Scholle unter dem Fuß und die Narbe dahinter (Boden, flach)
    const scholle = Pg([[6, FY + 1], [20, FY - 3], [150, FY - 4], [158, FY + 2], [158, 179], [6, 179]], null, { rd: 1, pf: 'flat' });
    // Die Ersten in der Wand: Köpfe und Schultern, halb umgedreht (Gesicht nach rechts hinten), dazu bei p2 Arme heraus
    const leute = [];
    const PL = [[86, 52, 1.25], [93, 78, 1.25], [91, 102, 1.2], [84, 124, 1.15], [74, 143, 1.1], [60, 160, 1]];
    if (!v.wand) PL.forEach(([x, y, s], i) => {
      const [hx, hy] = T([x, y]);
      const raus = v.gebrochen ? 7 : 0, X = hx - raus;
      // Schwimmzug: ein Arm nach vorn über den Kopf gestreckt (zum Land hin), der Körper schräg dahinter
      const arm = v.gebrochen && i < 5
        ? [C(X - 2 * s, hy + 5 * s, X - 12 * s, hy + (i % 2 ? -1 : 6) * s, 2.4 * s, 1.8, 'haut'), C(X - 12 * s, hy + (i % 2 ? -1 : 6) * s, X - 18 * s, hy + (i % 2 ? 3 : 11) * s, 1.8, 1.1, 'haut'), C(X + 4 * s, hy + 6 * s, X - 6 * s, hy + 12 * s, 2.2 * s, 1.6, 'haut')]
        : [C(X + 2 * s, hy + 3 * s, X - 4 * s, hy - 7 * s, 1.5 * s, 1.0, 'haut'), C(X - 4 * s, hy - 7 * s, X - 9 * s, hy - 9 * s, 1.0, 0.7, 'haut')];
      leute.push({ i, hx: X, hy, s, formen: [
        Pg([[X - 2 * s, hy + 2 * s], [X + 6 * s, hy + 1 * s], [X + 13 * s, hy + 9 * s], [X + 9 * s, hy + 13 * s], [X - 1 * s, hy + 8 * s]], 'dunkel', { rd: 1 }),
        E(X, hy, 3.6 * s, 4.2 * s, 'dunkel'),
        ...arm,
      ] });
    });
    const gruppen = [
      { p: [scholle], k: 1, boden: true },                        // 0 Scholle
      { p: gischt, k: 1.5 },                                       // 1 Schaumkamm
      { p: [ruckK], k: 2 },                                        // 2 Rücken und Wand
      ...leute.map(l => ({ p: l.formen, k: 0.8, leute: l })),
      { p: lippe ? [lippe] : [], k: 1.5, kante: true },            // Lippe
      { p: krallen, k: 0.6, kante: true },                         // Krallen
    ];
    const NL = 3 + leute.length, LIP = NL, KR = NL + 1;
    gruppen.forEach(g => { g.anker = [dx, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('eis_welle'), { rimBis: 168 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - dx, y);
      // Eis: Schichten quer (Wasserlinien, die im Eis stehen geblieben sind), parallel zum Rücken gebogen
      for (let y = 0; y < FY - 2; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 2)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (x - dx) * 0.42 + y * 0.9 + Math.sin((x - dx) * 0.08) * 6;
        const band = ((u % 13) + 13) % 13;
        if (band < 1) P.set(x, y, 'k0');
        else if (band < 2 && b(x, y) < 0.5) P.set(x, y, c < 4 ? c + 1 : c);
        // Innenseite der Röhre (links von der Wandkante) tiefer: das Wasser wird dunkler, wo es sich einrollt
        let rr = x; while (rr < W - 1 && ist(rr + 1, y, 2)) rr++;
        if (x < 90 && y > 30 && y < 150 && !ist(x - 1, y, 2) === false && rr - x > 40 && b(x, y) < 0.35) P.set(x, y, 'k1');
      }
      // Die Wand der Röhre ist durchscheinend: Von unten kommt das Leuchten des Umrisses durchs Eis. Nahe der
      // Wandkante (links) wird das Eis gedithert heller, unten am meisten; davor stehen die Ersten dunkel.
      for (let y = 30; y < FY - 2; y++) { let x0 = 0; while (x0 < W && !ist(x0, y, 2)) x0++; if (x0 >= W) continue;
        for (let x = x0; x < Math.min(W, x0 + 46); x++) { if (!ist(x, y, 2)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          const d = (x - x0) / 46, hgt = Math.min(1, (y - 30) / 110); const v0 = (1 - d) * (0.35 + hgt * 0.65) * (aus ? 0.4 : 1);
          if (v0 > 0.7 + b(x, y) * 0.45 && !aus) P.set(x, y, 'tiefe'); else if (v0 > 0.28 + b(x, y) * 0.35) P.set(x, y, 'k3'); else if (v0 > 0.1 + b(x, y) * 0.25) P.set(x, y, c < 3 ? 3 : c); } }
      // Die Ersten: Haar nass, Gesicht im Profil nach rechts (umgedreht), rote Augen sehen an dir vorbei
      for (const g of gruppen) if (g.leute) {
        const l = g.leute, gi = gruppen.indexOf(g);
        for (let y = r(l.hy - 11 * l.s); y <= r(l.hy + 14 * l.s); y++) for (let x = r(l.hx - 18 * l.s); x <= r(l.hx + 14 * l.s); x++) {
          if (!ist(x, y, gi)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          const ddx = x + 0.5 - l.hx, ddy = y + 0.5 - l.hy;
          if (Math.hypot(ddx / (3.6 * l.s), ddy / (4.2 * l.s)) < 1) P.set(x, y, ddx > 1 && ddy < 0 ? 'k2' : 'k1');
          else P.set(x, y, !ist(x, y + 1, gi) || !ist(x - 1, y, gi) ? 'k0' : (b(x, y) < 0.2 ? 'k2' : 'k1'));
        }
        // Licht von unten (durchs Eis): Unterkanten der Figur fangen es; Kopf oben rechts eine Linie Randlicht
        for (let y = r(l.hy - 11 * l.s); y <= r(l.hy + 14 * l.s); y++) for (let x = r(l.hx - 18 * l.s); x <= r(l.hx + 14 * l.s); x++) {
          if (!ist(x, y, gi) || P.get(x, y) > 4) continue;
          if (!ist(x, y + 1, gi) && !aus && y > l.hy) P.set(x, y, (x + y) % 3 ? 'tiefe' : 'k3');
          else if (!ist(x + 1, y - 1, gi) && Math.hypot(x + 0.5 - l.hx, y + 0.5 - l.hy) < 4.6 * l.s) P.set(x, y, 'r1');
          else if (!ist(x, y - 1, gi) && x < l.hx - 2) P.set(x, y, 'k3');
        }
        if (!aus) {
          const off = blinz >= 0 && (l.i % 4) === blinz && l.i > 0;
          const ex = r(l.hx - 2 * l.s), ey = r(l.hy - 0.5);
          if (!off) { P.set(ex, ey, l.i === 0 ? 'kern' : 'glut'); P.set(ex + 1, ey, 'glut'); if (l.i < 3) P.glow(ex + 1, ey + 0.5, 3.5, 0.6, 'glutDim', 'k3'); }
          else { P.set(ex, ey, 'k0'); P.set(ex + 1, ey, 'k0'); }
          if (l.i < 3) augen.push([ex, ey]);
        }
      }
      // Lippe: Kante der Röhre innen dunkel, Wasserlinien längs der Lippe, Kamm hell
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, LIP)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (!ist(x, y + 2, LIP) && !ist(x, y + 2, KR)) P.set(x, y, 'k0');
        else if ((x * 2 + y * 3) % 17 === 0) P.set(x, y, 'k3');
      }
      if (v.gebrochen) { // Bruchkante: helle, gezackte Fläche, frisch gebrochenes Eis
        for (let y = 0; y < 40; y++) for (let x = 40; x < 100; x++) if (ist(x, y, LIP) && P.get(x, y) <= 4 && !ist(x - 2, y - 1, LIP) && b(x, y) < 0.6) P.set(x, y, 'r1');
      }
      KA.licht(P, krallen, { c: 'r1', c2: null });
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Gischt: Spitzen hell
      KA.licht(P, gischt, { c: 'r2', c2: 'r1' });
      // Scholle: Oberkante Reif, davor dunkel; die Narbe hinter dem Fuß, wo die Welle vorhin stand
      for (let x = 0; x < W; x++) for (let y = FY - 6; y < H; y++) if (ist(x, y, 0)) { if (!ist(x, y - 1, 0) && !P.get(x, y - 1)) P.set(x, y, (x & 3) ? 'k3' : 'r1'); else if (P.get(x, y) <= 4) P.set(x, y, y > 176 ? 'k0' : (b(x, y) < 0.3 ? 'k2' : 'k1')); }
      if (!p.tod) { const nx0 = r(132 + dx * 0.5); for (let k = 0; k < 22; k++) { const x = nx0 + k, y = FY - 2 + (k > 14 ? 1 : 0); if (ist(x, y, 0)) P.set(x, y, k % 5 === 4 ? 'k3' : 'r1'); if (k > 3 && k < 18 && ist(x, y + 1, 0)) P.set(x, y + 1, 'k3'); } }
    };
    return { gruppen, details, augen };
  },
};
