// Die Geprüfte (Überflutete Kapelle, Ergänzung). 1651 der Wasserprobe unterzogen: Daumen an die großen Zehen
// gebunden, ein Seil um den Leib, ins Wasser vor der Kapelle geworfen. Wer schwimmt, ist schuldig.
// Sie schwimmt bis heute, auch in der Luft. Das Seil hängt schlaff bis auf den Boden, niemand hält es.
// Zusammengekrümmt, die Knie vor der Brust, das nasse Haar fällt wie ein Vorhang bis unter die Füße.
'use strict';
const K = require('./hilfe/kanten');
module.exports = {
  id: 'gepruefte', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [50, 114], kopf: [50, 18], rimBis: 113,
  varianten: {
    gepruefte_a: { haar: 6, haarLang: 52, seil: true, schwebe: -4 },
    gepruefte_b: { haar: 7, haarLang: 62, seil: true, schwebe: -8, haube: true },
  },
  skizzen: { skizze_ohne_seil: { haar: 8, haarLang: 40, seil: false, schwebe: 0 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let bob = 0, rot = 0, dx = 0, fall = 0, wehen = 0, augenAn = true, tropf = 0;
    if (p.idle) { bob = [0, -1, -1, 0][f]; rot = 0; wehen = 0; tropf = f; }
    if (p.angriff) { bob = [-3, -7, 4, 1][f]; rot = [0.18, 0.3, -0.35, -0.12][f]; dx = [3, 4, -9, -4][f]; wehen = [1, 3, -4, -1][f]; tropf = f; }
    if (p.treffer) { dx = [3, 1][f]; rot = [0.12, 0.05][f]; bob = -1; }
    if (p.tod) { fall = r(p.q * p.q * 40); rot = -p.q * 0.5; augenAn = f < 1; wehen = -r(p.q * 3); }
    const cx = 54 + dx, cy = 52 + (v.schwebe || 0) + bob + fall, S = 1.3;
    const co = Math.cos(rot), si = Math.sin(rot);
    const R = ([x, y]) => [cx + (x * co - y * si) * S, cy + (x * si + y * co) * S];   // lokale Koordinaten -> Bild, gedreht um die Mitte
    // Körper zusammengekrümmt: Rücken rund nach rechts, Knie vorne links oben, Füße unten links
    const ruecken = Pg([[-4, -17], [6, -15], [12, -6], [13, 6], [8, 15], [-2, 17], [-8, 12], [-6, 0]].map(R), null, { rd: 3 });
    const hemdSaum = Pg([[-8, 10], [10, 12], ...saum(11, -10, 20, 5, 3, 3, wehen).map(([x, y]) => [x, y])].map(R), null, { rd: 0.8 });
    const knie = E(...R([-12, -8]), 7.5, 8, null);
    const schenkel = C(...R([4, 10]), ...R([-12, -8]), 8, 7, null);
    const schienbein = C(...R([-15, -4]), ...R([-14, 14]), 5.5, 4, null);
    const fuss = C(...R([-14, 15]), ...R([-21, 17]), 3, 2.2, null);
    // Kopf über die Knie gebeugt, Haar fällt nach vorn und unten
    const kopfP = R([-9, -18]);
    const kopf = E(kopfP[0], kopfP[1], 7.5, 7, 'haut');
    const haube = v.haube ? [Pg([[-12, -24], [-2, -28], [2, -22], [-10, -17]].map(R), null, { rd: 1 })] : [];
    // Arme um die Schienbeine, Hände an den Zehen gebunden (über Kreuz)
    const armV = glied([R([0, -12]), R([-20, -4]), R([-18, 12])], 3.6, 2.6, 'haut');
    const handV = E(...R([-18, 14]), 3, 2.6, 'haut');
    // Haar: Strähnen vom Scheitel nach vorn über die Knie, dann senkrecht nach unten (nass, schwer)
    const haar = [];
    for (let i = 0; i < v.haar; i++) {
      const q = i / (v.haar - 1), s0 = R([-7 + q * 6, -22 + q * 3]);
      const ueber = R([1 + q * 6, -17 + q * 8]);            // am Hinterkopf vorbei auf den Rücken
      const kante = R([8 + q * 3, 2 + q * 9]);            // liegt am Rücken an
      const fx = kante[0] + (q - 0.5) * 10, unten = 66 + v.haarLang * 0.55 - Math.abs(q - 0.5) * 16 - (i % 2) * 7;
      const sway = wehen * (0.4 + q * 0.6);
      haar.push(...glied([s0, ueber, kante, [fx + sway * 0.5, (kante[1] + unten) / 2], [fx + (i % 2 ? 1 : -1) + sway, unten + bob + fall * 0.6]], 1.6 - q * 0.2, 0.55, 'dunkel'));
    }
    // Seil: um den Leib geknotet, hängt schlaff bis auf den Boden und liegt dort in einer Schlinge
    const seil = [];
    if (v.seil && fall < 30) {
      const s0 = R([2, 16]);
      seil.push(...glied([s0, [s0[0] - 4, s0[1] + 16], [s0[0] - 2 + wehen, 98], [s0[0] - 8, 110], [s0[0] - 18, 113], [s0[0] - 24, 111], [s0[0] - 16, 109]], 1.2, 1, null));
    }
    const leib = [ruecken, hemdSaum];
    const gruppen = [
      { p: seil, k: 0.5 },
      { p: [...leib, schenkel], k: 2.5, anker: [dx, bob] },
      { p: [knie, schienbein, fuss], k: 2, anker: [dx, bob] },
      { p: [kopf, ...haube], k: 1, anker: [dx, bob] },
      { p: [...armV, handV], k: 1, anker: [dx, bob] },
      { p: haar, k: 0 },
    ];
    const augen = [];
    const details = P => {
      K.licht(P, [ruecken, schenkel], { c: 'r1', c2: 'k3' });
      K.licht(P, [knie, schienbein], { c: 'r1', c2: 'k3' });
      K.schatten(P, [knie, schienbein], { d: [-1, 1] });
      K.licht(P, [...armV, handV], { c: 'r1', c2: null });
      // Hemd: Falten fallen vom Rücken zum Saum, nass und schwer
      [[4, -12, 8, 18], [-1, -4, 2, 19], [9, -6, 11, 14], [-5, 4, -6, 18]].forEach(([a, b, c, d], i) => { const [x1, y1] = R([a, b]), [x2, y2] = R([c, d]); P.line(x1, y1, x2, y2, 'k0', true); P.line(x1 + 1, y1, x2 + 1, y2, i % 2 ? 'k3' : 'r1', true); });
      // Wirbel zeichnen sich durch das nasse Hemd ab
      for (let k = 0; k < 6; k++) { const t = -14 + k * 4.5, [x, y] = R([7 + Math.sin((k / 5) * 2.2) * 4, t]); P.auf(r(x), r(y), 'k3'); P.auf(r(x) + 1, r(y) - 1, k % 2 ? 'r1' : 'k3'); }
      // Fesseln: Strick um Handgelenk und Knöchel, Knoten am Leib
      const [fx, fy] = R([-17, 12]); P.line(fx - 3, fy - 1, fx + 3, fy + 1, 'r1', true); P.line(fx - 3, fy, fx + 3, fy + 2, 'k0', true);
      const [sx, sy] = R([2, 15]); P.el(sx, sy, 2, 1.6, 'k3', true); P.set(sx + 1, sy - 1, 'r1');
      for (let k = -1; k <= 1; k++) { const [bx, by] = R([4 + k * 6, 10 + Math.abs(k)]); P.auf(bx, by, 'k3'); }
      // Augen: durch das Haar, tief unter dem Scheitel
      if (augenAn) {
        const [ex, ey] = R([-14, -17]);
        P.glow(ex + 1, ey + 1, 5, 0.85);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey + 1, 'glut');
        // ein Strähne über dem einen Auge
        P.set(ex + 2, ey, 'k1');
        augen.push([r(ex), r(ey)], [r(ex + 4), r(ey + 1)]);
      }
      // Haar: Licht an einzelnen Strähnen (nass glänzend)
      haar.forEach((h, i) => { if (i % 3 === 1) { const x = r((h.x1 + h.x2) / 2), y = r((h.y1 + h.y2) / 2); if (P.get(x, y)) P.set(x, y, 'r1'); } });
      // Wasser tropft aus Haar und Hemd, obwohl sie nie nass werden dürfte
      if (!p.tod || f < 3) {
        const enden = haar.filter((_, i) => i % 4 === 3).map(h => [h.x2, h.y2]);
        enden.push(R([2, 24]));
        enden.forEach(([x, y], i) => { const yy = r(y + 4 + ((tropf * 3 + i * 5) % 12)); if (yy < 113) { P.set(r(x), yy, 'r1'); P.set(r(x), yy + 1, 'k3'); } });
      }
      // Kerzenschein auf der Stirn: ein kleiner warmer Fleck (die Kerze ist die der Kapelle)
      const [kx, ky] = R([-3, -24]); P.auf(kx, ky, 'flamme');
    };
    return { gruppen, details, augen };
  },
};
