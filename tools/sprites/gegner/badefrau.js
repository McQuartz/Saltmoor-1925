// Die Badefrau (Kurhaus). Hat 1900 die Damen in den Badekarren ins Meer gebracht und untergetaucht.
// Glockenkleid, nass bis zur Brust, eine gekräuselte Badehaube. Ihre Arme stecken bis zu den Ellbogen
// in einer Pfütze vor ihren Füßen, die tiefer ist als der Boden. Sie gießt, wo es brennt.
// Angriff: sie zieht die Arme aus dem Wasser, viel zu lange Hände, und greift.
'use strict';
module.exports = {
  id: 'badefrau', biom: 'kurhaus', zone: 'kurhaus', w: 96, h: 120, fuss: [56, 115], kopf: [60, 22], rimBis: 112,
  varianten: {
    badefrau_a: { haube: 11, breit: 18 },
    // b: schmaler, höher, Haube flach wie ein Teller, ohne Kragen, Arme länger
    badefrau_b: { haube: 13, breit: 15, flach: true, lang: 4, arm: 1.12 },
  },
  probe: { probe_laken: { haube: 11, breit: 18, kragen: true, laken: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f, L = v.lang || 0, am = v.arm || 1;
    let lean = 0, schu = 0, hub = 0, griff = 0, hem = 0, fall = 0, ring = 0, nick = 0;
    if (p.idle) { schu = [0, 1, 1, 0][f]; ring = f; hem = [0, 1, 0, -1][f]; nick = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 0, -6, -2][f]; schu = [2, -2, -1, 0][f]; hub = [0.2, 1, 0.55, 0.15][f]; griff = [0, 0.2, 1, 0.35][f]; hem = [0, 1, 2, 1][f]; nick = [1, -2, 0, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; schu = -1; nick = -2; }
    if (p.tod) { fall = r(p.q * 70); nick = 2; }
    const cx = 60 + r(lean / 2), B = v.breit, top = 48 - L + schu + fall;
    // Pfütze: liegt fest am Boden vor ihr, Wellenringe
    const px = 26, py = 114, prx = 17;
    const pfuetze = [E(px, py, prx, 2.6, 'dunkel', { pf: 'flat' })];
    // Kleid: Oberkörper nach vorne gebeugt (runder Rücken), darunter eine schwere Glocke mit Falten
    const vb = -7 + lean; // Vorbeuge der Schultern
    const kleid = Pg([[cx - 8 + vb, top + 4], [cx - 1 + vb, top - 1], [cx + 8 + vb * 0.6, top], [cx + 13 + vb * 0.3, top + 8], [cx + 14, top + 22], [cx + B - 4, 90 + fall * 0.5], [cx + B + 1, 108 + fall], ...saum(cx + B + 1, cx - B - 1, 113 + fall, 7, 2, 3, hem), [cx - B - 2, 108 + fall], [cx - B + 4, 92 + fall * 0.5], [cx - 12 + vb * 0.4, top + 26], [cx - 12 + vb * 0.8, top + 12]], null, { rd: 2.5 });
    const ruecken = E(cx + 4 + vb * 0.6, top + 9, 11, 10, null, { pf: 'bevel' });
    const falten = [C(cx - 4, top + 34 + fall * 0.5, cx - 9, 110 + fall, 0.8, 1.6, 'dunkel'), C(cx + 4, top + 32 + fall * 0.5, cx + 6, 111 + fall, 0.8, 1.7, 'dunkel'), C(cx + 11, top + 36 + fall * 0.5, cx + 16, 108 + fall, 0.6, 1.3, 'dunkel')];
    const scharpe = [C(cx - 12 + vb * 0.4, top + 25, cx + 14, top + 22, 1.4, 1.4, 'dunkel', { noRim: true })];
    const kragen = v.kragen ? [Pg([[cx + 1 + vb * 0.7, top - 2], [cx + 13 + vb * 0.4, top + 1], [cx + 15 + vb * 0.3, top + 12], [cx + 5 + vb * 0.5, top + 11]], 'haut', { rd: 1.2 })] : [];
    // Kopf: rund, nach vorne geneigt, unter einer gekräuselten Haube
    const kx = cx - 13 + lean + (p.angriff ? [0, 0, -3, -1][f] : 0), ky = top - 6 + nick;
    const kopf = E(kx, ky + 2, 6, 6.5, 'haut', { pf: 'bevel' });
    const hR = v.haube, hY = ky - 3;
    const haube = v.flach ? [E(kx + 2, hY, hR + 1, 4.5, null, { pf: 'bevel' }), E(kx + 2, hY - 3, 7, 4, null)]
      : [E(kx + 2, hY - 2, hR - 1, hR * 0.85, null, { pf: 'bevel' })];
    const krause = []; for (let i = 0; i < 9; i++) { const a = Math.PI * (0.05 + i * 0.11); krause.push(E(kx + 2 - Math.cos(a) * (hR + 0.5), hY + 3 - Math.sin(a) * hR * 0.3 + (i % 2), 2.3, 1.8, 'haut')); }
    // Arme: Schulter -> Ellbogen -> verschwinden in der Pfütze. Beim Griff kommen sie heraus.
    const armeG = [];
    let haende = [];
    for (const [s, dx, dy] of [[1, 0, 0], [0, 7, 2]]) {
      const sx = cx - 9 + dx + vb * 0.8, sy = top + 7 + dy;
      const ell0 = [cx - 24 + dx + lean / 2, top + 20 + dy], end0 = [px - 6 + dx * 1.3, py + 1];
      const ell1 = [cx - 22 + dx, top - 8 + dy], end1 = [cx - 34 + dx, top - 2 + dy];      // hoch aus dem Wasser
      const ell2 = [cx - 30 + dx + lean, top + 14 + dy], end2 = [cx - 58 * am + dx + lean, top + 16 + dy]; // nach vorne
      const mixP = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      let el = mixP(ell0, ell1, hub), en = mixP(end0, end1, hub);
      el = mixP(el, ell2, griff); en = mixP(en, end2, griff);
      if (p.tod) { el = [ell0[0], ell0[1] + fall * 0.5]; en = end0; }
      if (v.laken) { el = [cx - 22 + dx, top + 2 + dy]; en = [cx - 26 + dx * 2, top - 18]; }
      const dick = s ? [2.2, 1.5] : [2, 1.3];
      const mid = [(el[0] + en[0]) / 2 - 1.5, (el[1] + en[1]) / 2];
      const aermel = [E(sx + (el[0] - sx) * 0.4, sy + (el[1] - sy) * 0.4, 5.5, 4.6, null, { pf: 'bevel' }), C(sx, sy, el[0], el[1], 3.6, 2.6, null)];
      armeG.push({ p: [...aermel, ...glied([el, mid, en], dick[0], dick[1], 'haut')], k: 1.5 });
      if ((hub > 0.5 || griff > 0.5) && !p.tod) { // Hand mit zu langen Fingern, tropfend
        for (let k = 0; k < 4; k++) { const a = Math.atan2(en[1] - el[1], en[0] - el[0]) + (k - 1.5) * 0.28; haende.push(...glied([en, [en[0] + Math.cos(a) * 9 * am, en[1] + Math.sin(a) * 9 * am], [en[0] + Math.cos(a + 0.5) * 14 * am, en[1] + Math.sin(a + 0.5) * 14 * am]], 1, 0.6, null)); }
      }
    }
    const laken = v.laken ? [Pg([[cx - 40, top - 18], [cx - 10, top - 22], [cx - 12, 100], ...saum(cx - 12, cx - 42, 104, 5, 4, 2), [cx - 42, 98]], null, { rd: 1 })] : [];
    const gruppen = [
      { p: pfuetze, k: 0, pf: 'flat', noRim: true },
      armeG[1],
      { p: [kleid, ruecken], k: 4 },
      { p: falten, k: 0, noRim: true },
      { p: kragen, k: 1 },
      { p: [kopf], k: 0 },
      { p: haube, k: 1.5, pf: 'bevel' },
      { p: krause, k: 0.6 },
      armeG[0],
      { p: haende, k: 0 },
      { p: laken, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Tod: sie sinkt in die Pfütze, alles unter der Bodenlinie außerhalb der Pfütze verschwindet
      if (p.tod) for (let y = 110; y < 120; y++) for (let x = 0; x < 96; x++) { if (((x + 0.5 - px) / prx) ** 2 + ((y + 0.5 - py) / 2.6) ** 2 > 1) { if (y > 112) P.loesch(x, y); } }
      // nasser Stoff: unterhalb einer welligen Linie eine Stufe dunkler (geordnet gedithert), an der Linie Wasserglanz
      for (let y = 70; y < 116; y++) for (let x = cx - B - 4; x <= cx + B + 4; x++) {
        const wl = 79 + fall + Math.sin(x * 0.45 + f) * 1.2; const c = P.get(x, y); if (c < 2 || c > 4) continue;
        if (y > wl + 2 || (y > wl && A.bay(x, y) < 0.6)) P.set(x, y, c - 1); else if (r(y) === r(wl) && A.bay(x, 0) > 0.55) P.set(x, y, 'r1');
      }
      // Pfütze: Wellenringe um die Arme, Glanz am hinteren Rand
      for (let x = px - prx + 2; x <= px + prx - 2; x++) { if (A.bay(x, 0) > 0.45) P.auf(x, py - 2, 'r1'); }
      for (let k = 0; k < 2; k++) { const rr = 4 + ((ring + k * 2) % 4) * 3; for (let a = 0; a < Math.PI * 2; a += 0.22) { const x = r(px - 4 + Math.cos(a) * rr), y = r(py + Math.sin(a) * rr * 0.16); if (Math.sin(a) < 0.2) P.auf(x, y, k ? 'r1' : 'wasser'); } }
      if (!p.tod || f < 2) P.auf(px + 6, py - 1, 'r2');
      // nasses Kleid: Glanzpunkte und Tropfspuren
      for (let i = 0; i < 7; i++) { const x = r(cx - B + 6 + i * (2 * B - 10) / 6), y0 = r(84 + (i * 7) % 11 + fall); P.auf(x, y0, 'r1'); if (i % 2) P.auf(x, y0 + 2, 'r1'); }
      // Tropfen von den Händen
      if (hub > 0.5 && !p.tod) for (let i = 0; i < 5; i++) P.set(r(cx - 36 + i * 3 + lean), r(top + 6 + (i * 5) % 9 + f * 2), i % 2 ? 'r1' : 'wasser');
      // Augen unter der Haube, blass; der Mund ein Strich
      if (!p.tod || f < 1) { P.auge(kx - 3, ky + 2, 1); P.auge(kx + 1, ky + 2, 1); augen.push([r(kx - 3), r(ky + 2)], [r(kx + 1), r(ky + 2)]); }
      P.auf(kx - 2, ky + 6, 'k0'); P.auf(kx - 1, ky + 6, 'k0');
    };
    return { gruppen, details, augen };
  },
};
