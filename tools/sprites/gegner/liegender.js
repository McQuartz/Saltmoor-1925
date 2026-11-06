// Der Liegende (Kurhaus). Liegekur in der Halle: eingepackt in Decken nach Vorschrift, festgeschnürt,
// nur das Gesicht frei. Er steht nie auf. Das Paket ist zu lang für den Stuhl: am Fußende hängt es
// über die Kante bis zum Boden und liegt dort weiter. Wenn er angreift, klappt er aus der Hüfte hoch.
'use strict';
module.exports = {
  id: 'liegender', biom: 'kurhaus', zone: 'kurhaus', w: 96, h: 120, fuss: [50, 115], kopf: [72, 30], rimBis: 113,
  varianten: {
    liegender_a: { lehne: 1.05, dick: 6.2, rest: 16, gurte: 6 },
    // b: steilere Lehne, dünneres Paket, das Ende rollt sich am Boden ein, eine Hand ist frei
    liegender_b: { lehne: 1.2, dick: 5.4, rest: 22, gurte: 7, hand: true, roll: true },
  },
  probe: { probe_strandkorb: { korb: true, lehne: 1.05, dick: 6, rest: 16, gurte: 5 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, chain } = A;
    const f = p.f;
    let klapp = 0, peitsche = 0, kriech = 0, flach = 0, nick = 0, blinz = -1;
    if (p.idle) { kriech = [0, 0, 1, 1][f]; blinz = [-1, 0, -1, 1][f]; nick = [0, 0, 0, 1][f]; }
    if (p.angriff) { klapp = [0.25, 1, 1.45, 0.5][f]; peitsche = [0, 0.3, 1, 0.4][f]; }
    if (p.treffer) { klapp = [-0.15, -0.05][f]; nick = -1; }
    if (p.tod) { flach = p.q; klapp = -p.q * 0.15; }
    // Stuhl: Hüftpunkt H, Lehne steigt nach rechts oben, Sitz nach links, Fußteil fällt ab
    const Hx = 64, Hy = 90, ang = -v.lehne - klapp; // Winkel der Lehne (nach oben rechts = negativ)
    const lehneL = 40, Kx = 36, Ky = 88, Fx = 16, Fy = 95;
    const lehneTop = [Hx + Math.cos(-v.lehne) * -lehneL * -1, Hy + Math.sin(-v.lehne) * lehneL];
    const stuhl = [];
    if (!v.korb) {
      stuhl.push(...glied([lehneTop, [Hx + 2, Hy + 2], [Kx, Ky + 2], [Fx, Fy + 2]], 1.6, 1.4, 'dunkel'));
      for (const [x, y0] of [[Fx + 3, Fy + 2], [Kx, Ky + 2], [Hx - 4, Hy + 2], [Hx + 10, Hy - 6]]) stuhl.push(C(x, y0, x + (x > 60 ? 3 : 0), 114, 1.2, 1.1, 'dunkel', { noRim: x < 60 }));
      stuhl.push(C(Fx + 3, 106, Hx + 12, 106, 0.8, 0.8, 'dunkel', { noRim: true }));
      stuhl.push(C(Hx + 2, Hy + 2, lehneTop[0] + 6, lehneTop[1] - 6, 1.1, 1.1, 'dunkel')); // Stellbügel
    }
    // Paket: Oberkörper entlang der (beweglichen) Lehne, Unterteil entlang Sitz und Fußteil, dann über die Kante
    const d = v.dick * (1 - flach * 0.55);
    const ob = [Hx - 2 + Math.cos(ang) * (lehneL - 6), Hy - 4 + Math.sin(ang) * (lehneL - 6)];
    const kopfP = [Hx - 2 + Math.cos(ang) * (lehneL + 2), Hy - 4 + Math.sin(ang) * (lehneL + 2)];
    const ende = [];
    // Überhang: vom Fußende zum Boden, dann am Boden zurück (zu lang)
    const pk = peitsche * 0.62, kx0 = Fx - 2, ky0 = Fy - 3;
    const hang = [[kx0, ky0], [kx0 - 7 - pk * 10, ky0 + 7 - pk * 16], [kx0 - 9 - pk * 20, ky0 + 15 - pk * 22], [kx0 - 6 - pk * 26, 111 - pk * 30]];
    const boden = v.roll ? [[kx0 - 2 - pk * 26 + kriech, 112 - pk * 30], [kx0 + 8 - pk * 20 + kriech, 112 - pk * 26], [kx0 + 10 + kriech - pk * 16, 107 - pk * 24]] : [[kx0 + 2 - pk * 24 + kriech, 112 - pk * 28], [kx0 + 4 + v.rest - pk * 12 + kriech, 112 - pk * 20]];
    const paket = [
      ...glied([kopfP, ob, [Hx - 3, Hy - 5]], d * 0.9, d, null),
      ...glied([[Hx - 3, Hy - 5], [Kx, Ky - 5], [Fx, Fy - 4]], d, d * 0.9, null),
      ...glied([...hang, ...boden], d * 0.85, d * 0.55, null),
    ];
    // Kopf: Gesicht frei im Deckenrand, sieht zur Decke und zu dir
    const kx = kopfP[0] - 1, ky = kopfP[1] - 3 + nick;
    const kapuze = [E(kx + 1, ky, 8.5, 8, null, { pf: 'bevel' })];
    const gesicht = [E(kx - 2, ky + 1, 5, 5.5, 'haut', { pf: 'bevel' })];
    const hand = v.hand ? [E(Kx + 14, Ky - 11 - klapp * 6, 2.6, 2, 'haut')] : [];
    // Probe: Strandkorb (Kasten mit Haube)
    const korb = v.korb ? [Pg([[Hx - 30, 114], [Hx - 32, 70], [Hx - 26, 46], [Hx + 4, 40], [Hx + 14, 54], [Hx + 14, 114]], null, { rd: 2 })] : [];
    const gruppen = [
      { p: korb, k: 2 },
      { p: stuhl, k: 0.5 },
      { p: paket, k: 3 },
      { p: kapuze, k: 0 },
      { p: gesicht, k: 0 },
      { p: hand, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Gurte: festgeschnürte Bänder quer über das Paket (dunkle Linie, darüber ein heller Faden)
      const pfad = [kopfP, ob, [Hx - 3, Hy - 5], [Kx, Ky - 5], [Fx, Fy - 4], ...hang];
      let len = 0; const seg = []; for (let i = 0; i < pfad.length - 1; i++) { const l = Math.hypot(pfad[i + 1][0] - pfad[i][0], pfad[i + 1][1] - pfad[i][1]); seg.push([pfad[i], pfad[i + 1], len, l]); len += l; }
      for (let g = 1; g <= v.gurte; g++) {
        const t = (g / (v.gurte + 1)) * len; const sg = seg.find(s => t >= s[2] && t <= s[2] + s[3]) || seg[seg.length - 1];
        const q = (t - sg[2]) / sg[3], x = sg[0][0] + (sg[1][0] - sg[0][0]) * q, y = sg[0][1] + (sg[1][1] - sg[0][1]) * q;
        const nx = -(sg[1][1] - sg[0][1]) / sg[3], ny = (sg[1][0] - sg[0][0]) / sg[3];
        for (let k = -d; k <= d; k += 0.5) { P.auf(x + nx * k, y + ny * k, 'k0'); P.auf(x + nx * k + 1, y + ny * k, 'k1'); }
        P.auf(x - nx * (d - 1), y - ny * (d - 1), 'r1');
      }
      // Gesicht: offene Augen, blass, Mund geschlossen; das Thermometer steckt noch im Mund
      if (!p.tod || f < 1) {
        const ex = r(kx - 4), ey = r(ky);
        if (blinz !== 0) { P.auge(ex, ey, 1); augen.push([ex, ey]); } else P.set(ex, ey, 'k1');
        if (blinz !== 1) { P.auge(ex + 3, ey - 1, 1); augen.push([ex + 3, ey - 1]); } else P.set(ex + 3, ey - 1, 'k1');
        P.set(ex - 1, ey + 4, 'k0'); P.set(ex, ey + 4, 'k0');
        P.line(ex - 2, ey + 4, ex - 6, ey + 6, 'messing'); P.set(ex - 6, ey + 6, 'wasser');
      }
      if (v.hand) { P.line(Kx + 13, Ky - 13 - klapp * 6, Kx + 9, Ky - 15 - klapp * 6, 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
