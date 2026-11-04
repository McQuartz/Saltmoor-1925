// Der Genesende (Kurhaus). Ein Lungenkranker aus der Liegehalle, jetzt kerngesund: der Brustkorb
// gewölbt wie ein Blasebalg, der Kopf in den Nacken gelegt, der Mund offen. Er atmet nicht mehr.
// In der Brust brennt ein Licht, man sieht es zwischen den Rippen und im offenen Mund.
// Angriff: der erste Atemzug seit Jahren, nach vorne ausgestoßen.
'use strict';
const rot = (pts, cx, cy, a) => pts.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
module.exports = {
  id: 'genesender', biom: 'kurhaus', zone: 'kurhaus', w: 96, h: 120, fuss: [47, 115], kopf: [52, 10], rimBis: 112,
  varianten: {
    // a: Nachthemd, die blaue Taschenflasche in der Hand
    genesender_a: { brust: [17, 16], hemd: 'nacht', flasche: true, kopf: 1.15 },
    // b: Bademantel mit Gürtel, ein Handtuch über der Schulter, Brust noch weiter
    genesender_b: { brust: [19, 17], hemd: 'mantel', tuch: true, kopf: 1.3, lang: 3 },
  },
  // Silhouetten-Proben (nicht gebaut): Arme seitlich gehoben wie bei der Atemgymnastik
  probe: { probe_arme: { brust: [17, 16], hemd: 'nacht', kopf: 1.15, armeHoch: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f, L = v.lang || 0;
    let lean = 0, dB = 0, tip = v.kopf, licht = 1, hem = 0, fall = 0, hauch = 0, hand = 0, mund = 1;
    if (p.idle) { tip = v.kopf + [0, 0, 0.05, 0.02][f]; licht = [1, 0.85, 1.05, 0.9][f]; hand = [0, 0, 1, 0][f]; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; dB = [2, 4, -2, -3][f]; tip = [v.kopf + 0.15, v.kopf + 0.3, 0.05, -0.15][f]; licht = [1.1, 1.35, 1.5, 0.6][f]; hauch = [0, 0, 1, 0.45][f]; mund = [1, 1, 2, 1][f]; hem = [0, 1, -1, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; dB = [-2, -1][f]; tip = v.kopf + 0.25; licht = 0.6; }
    if (p.tod) { const q = p.q; fall = r(q * 30); dB = -r(q * 9); tip = v.kopf - q * 1.9; lean = -r(q * 3); licht = f < 1 ? 0.8 : 0; }
    const cx = 50, rx = v.brust[0] + dB, ry = v.brust[1] + r(dB * 0.8), by = 54 - L + fall * 0.8, bx = cx - 5 + lean;
    // Beine: dünne Stelzen unter einem kurzen Saum, Füße nach links
    const fy = 114, saumY = 90 + fall * 0.45;
    const beine = [C(46, saumY - 3, 45, fy - 1, 2.2, 1.4, null), C(55, saumY - 3, 56, fy - 1, 2.1, 1.3, null), E(42, fy, 3.6, 1.5, null), E(53, fy, 3.4, 1.5, null)];
    // Hemd: unter der Brust eingezogen (schmale Hüfte), unten etwas weiter
    const hemd = Pg([[bx - 4, by + ry - 6], [bx + rx - 2, by + 2], [cx + 9 + r(lean / 3), by + ry + 8], [cx + 12, saumY - 4], ...saum(cx + 13, cx - 11, saumY + (v.hemd === 'mantel' ? 5 : 0), 4, 2, v.hemd === 'mantel' ? 3 : 7, hem), [cx - 11, saumY - 4], [cx - 8 + r(lean / 3), by + ry + 6]], null, { rd: 1 });
    // Brustkorb: eine Taubenbrust, weit nach vorne gewölbt, steht still
    const brust = E(bx, by, rx, ry, null, { pf: 'bevel' });
    const ruecken = E(cx + 4 + r(lean * 0.7), by - 2, 10, ry - 3, null, { pf: 'bevel' });
    // Hals und Kopf: in den Nacken gelegt (tip = Drehung, 0 = Blick nach links)
    const nx = bx + 9, ny = by - ry + 2;
    const hals = C(nx, ny + 4, nx + Math.sin(tip) * 2, ny - 5, 3, 2.4, null);
    const hx = nx + Math.sin(tip) * 2, hy = ny - 5;
    const sch = rot([[0.5, -7.5]], hx, hy, tip)[0];
    const schaedel = E(sch[0], sch[1], 7.2, 7.6, 'haut', { pf: 'bevel' });
    const kiefer = Pg(rot([[-3, -3], [-7, -1.5 + mund], [-5.5, 1.5 + mund], [0, 0.5]], hx, hy, tip), 'haut', { rd: 0.6 });
    const nase = Pg(rot([[-5.5, -8], [-8.5, -5.5], [-5.5, -4.5]], hx, hy, tip), 'haut', { rd: 0.3 });
    // Arme: steif, zu lang, hängen hinter der Brust bis unter die Hüfte (Probe: seitlich gehoben)
    let armL, armR, flasche = [];
    const sw = p.angriff ? [2, 3, -5, -2][f] : p.tod ? -r(p.q * 6) : 0;
    const handX = cx - 12 + sw + hand, handY = 97 + fall * 0.6;
    if (v.armeHoch) {
      armL = glied([[bx - 2, by - ry + 6], [bx - rx - 8, by - ry + 2], [bx - rx - 22, by - ry - 3]], 2.4, 1.3, null);
      armR = glied([[cx + 6, by - ry + 6], [cx + 20, by - ry + 2], [cx + 32, by - ry - 3]], 2.2, 1.2, null);
    } else {
      armL = glied([[nx - 2, ny + 6], [cx - 9 + sw, by + 6], [handX, handY]], 2.4, 1.3, null);
      armR = glied([[cx + 8, ny + 6], [cx + 13, by + 8], [cx + 13 - (p.angriff ? [0, 1, 3, 2][f] : 0), 95 + fall * 0.6]], 2.2, 1.2, null);
      if (v.flasche && !(p.tod && f > 2)) flasche = [Pg([[handX - 3, handY], [handX + 3, handY], [handX + 3, handY + 7], [handX - 3, handY + 7]], null, { rd: 0.8 })];
    }
    const tuch = v.tuch ? [Pg([[nx - 4, ny + 2], [nx + 6, ny + 1], [cx + 13, by + 4], [cx + 11, by + 22], [cx + 7, by + 21], [cx + 6, by + 2]], 'haut', { rd: 0.8 })] : [];
    const guertel = v.hemd === 'mantel' ? [C(bx - 2, by + ry - 3, cx + 9, by + ry + 3, 1.2, 1.2, 'dunkel', { noRim: true })] : [];
    const gruppen = [
      { p: beine, k: 1 },
      { p: armR, k: 0 },
      { p: [hemd], k: 2 },
      { p: [ruecken, brust], k: 5 },
      { p: guertel, k: 0, noRim: true },
      { p: [hals], k: 0 },
      { p: [schaedel, kiefer, nase], k: 1.5 },
      { p: tuch, k: 1 },
      { p: armL, k: 0 },
      { p: flasche, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Licht in der Brust: gedithert, scheint zwischen den Rippen durch das Hemd (Rippenbögen von hinten oben nach vorne unten)
      if (licht > 0) {
        P.glow(bx - 3, by + 2, (rx - 2) * Math.min(1.15, licht), 0.6 * licht, 'glutDim', 'k3');
        for (let i = 0; i < 4; i++) {
          const y0 = by - ry * 0.5 + i * 6.5, x0 = bx + rx * 0.45, x1 = bx - rx * 0.75 + i * 2;
          for (let k = 0; k <= 1; k += 0.04) { const x = r(x0 + (x1 - x0) * k), y = r(y0 + Math.sin(k * Math.PI * 0.8) * 4 + k * 3); if ((r(k * 25) + i) % 6 === 0) continue; P.auf(x, y, licht > 1.2 && k > 0.3 && k < 0.8 ? 'glut' : 'glutDim'); }
        }
      }
      // Mund: offen, innen das Licht
      const [mx, my] = rot([[-4.5, -2.4 + mund * 0.5]], hx, hy, tip)[0];
      if (licht > 0) {
        P.set(mx, my, licht > 0.95 ? 'kern' : 'glut'); P.set(mx + 1, my, 'glut'); if (mund > 1) { P.set(mx, my + 1, 'glut'); P.set(mx - 1, my, 'glut'); }
        P.glow(mx + 0.5, my + 0.5, 4, 0.8);
        augen.push([r(mx), r(my)]);
      } else P.set(mx, my, 'k0');
      // Augen geschlossen: zwei dunkle Striche
      const [ex, ey] = rot([[-3.5, -8.5]], hx, hy, tip)[0];
      P.auf(ex, ey, 'k0'); P.auf(ex + 1, ey, 'k1');
      // Flasche: der blaue Heinrich, Messingdeckel
      if (flasche.length) { const fx = r(handX), fy2 = r(handY + 1); P.set(fx - 1, fy2 - 1, 'messing'); P.set(fx, fy2 - 1, 'messing'); P.auf(fx - 1, fy2 + 2, 'wasser'); P.auf(fx - 1, fy2 + 3, 'r1'); }
      // Hauch: der eine Atemzug, als gedithertes Licht nach links
      if (hauch > 0) {
        const LEN = 44;
        for (let k = 0; k < LEN; k++) for (let j = -k * 0.42 - 1.5; j <= k * 0.42 + 1.5; j++) {
          const x = r(mx - 2 - k), y = r(my + 1 + j + k * 0.18), d = Math.abs(j) / (k * 0.42 + 2);
          const a = hauch * (1 - k / LEN) ** 0.7 * (1 - d * d) * (0.75 + 0.25 * Math.sin(k * 0.9 + j));
          if (a > 0.62 + A.bay(x, y) * 0.3) P.set(x, y, k < 8 ? 'glut' : 'r2'); else if (a > 0.12 + A.bay(x, y) * 0.55) P.set(x, y, 'r1');
        }
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
