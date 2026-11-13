// Die Mondsüchtige (Mond unter dem Eis, Elite). Die Frau des Gehilfen, die 1890 jede Vollmondnacht
// aus dem Haus ging und eines Nachts nicht mehr zurückkam. Sie ist im Nachthemd bis hierher
// gelaufen, die Arme vorgestreckt, die Augen zu. Der kleine Mond zieht an ihr: Sie schwebt eine
// Handbreit über dem Staub, die Zehen hängen nach unten, Haar und Saum steigen nach oben. Hinter
// den geschlossenen Lidern brennt es. Sie träumt schon, was du als Nächstes tust, und tut es vor
// dir. Angriff: die ausgestreckten Hände greifen zu.
'use strict';
module.exports = {
  id: 'mondsuechtige', biom: 'mond', zone: 'mond', w: 128, h: 160, fuss: [64, 155], kopf: [56, 30], rimBis: 156, rang: 'elite',
  varianten: { mondsuechtige: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, griff = 0, schweb = 0, fall = 0, glanz = 1, wehen = 0;
    if (p.idle) { schweb = 0; wehen = [0, 0, 1, 1][f]; glanz = [1, 1, 1.1, 0.9][f]; }
    if (p.angriff) { lean = [1, 2, -8, -3][f]; griff = [-2, -4, 10, 4][f]; schweb = [0, -1, -3, -1][f]; wehen = [1, 2, 2, 1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, sy = 48 + schweb + fall;
    // Nachthemd: schmal oben, der Saum steigt und wellt sich nach oben
    const hemd = Pg([[cx - 10 + ox, sy], [cx + 10 + ox, sy - 1], [cx + 14 + r(ox / 2), sy + 40], [cx + 20, sy + 80], [cx + 16 + wehen, sy + 92], [cx + 8, sy + 86], [cx, sy + 94 - wehen], [cx - 8, sy + 86], [cx - 16 - wehen, sy + 92], [cx - 20, sy + 80], [cx - 14 + r(ox / 2), sy + 40]], null, { rd: 1.6 });
    // Füße hängen, Zehen nach unten, eine Handbreit über dem Boden
    const fuesse = [...glied([[cx - 5, sy + 88], [cx - 6, sy + 98], [cx - 8, sy + 104]], 2.4, 1.4, 'haut'), ...glied([[cx + 5, sy + 88], [cx + 7, sy + 97], [cx + 6, sy + 103]], 2.4, 1.4, 'haut')];
    // Kopf leicht im Nacken, Haar steigt nach oben in Strähnen
    const kx = cx - 2 + ox * 1.3, ky = sy - 12;
    const kopf = E(kx, ky, 7, 8, 'haut');
    const haare = [-7, -4, -1, 2, 5, 8].map((dx, i) => { const w = (i % 2 ? 1 : -1); return glied([[kx + dx * 0.8, ky - 4], [kx + dx * 1.1 + w * 3, ky - 12], [kx + dx * 1.5 - w * 2 + wehen, ky - 20], [kx + dx * 2 + w * 3 + wehen, ky - 26 - (i % 3) * 3], [kx + dx * 2.6 + w * 6 + wehen, ky - 30 - (i % 3) * 3]], 2.6, 0.5, 'dunkel'); });
    // Arme: beide nach vorn gestreckt, schlafwandelnd
    const ax = cx - 36 + ox - griff, ay = sy + 14 - r(griff / 3);
    const armO = glied([[cx - 8 + ox, sy + 4], [cx - 22 + ox - griff / 2, sy + 8], [ax, ay]], 2.8, 2, 'haut');
    const armU = glied([[cx - 4 + ox, sy + 8], [cx - 20 + ox - griff / 2, sy + 14], [ax + 2, ay + 7]], 2.8, 2, 'haut');
    const finger = [...glied([[ax, ay], [ax - 5, ay + 1], [ax - 8, ay + 4]], 1.3, 0.7, 'haut'), ...glied([[ax + 2, ay + 7], [ax - 3, ay + 8], [ax - 6, ay + 11]], 1.3, 0.7, 'haut')];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: haare.flat(), k: 1.5 },
      { p: armU, k: 1 },
      { p: fuesse, k: 0 },
      { p: [hemd], k: 3 },
      { p: [kopf], k: 1 },
      { p: [...armO, ...finger], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Staub, der unter ihr nach oben rieselt
      [[cx - 10, 150], [cx - 2, 146], [cx + 8, 152], [cx + 2, 140], [cx - 6, 136], [cx + 12, 144]].forEach(([x, y], i) => { if ((i + wehen) % 2 === 0) P.set(x, y - schweb, 'asche'); });
      // Rüschen am Kragen, Falten
      for (let x = -8; x <= 8; x += 2) P.auf(r(kx + 2 + x + ox / 2), r(sy + 2), 'bleich');
      P.line(r(cx - 4), r(sy + 30), r(cx - 9), r(sy + 82), 'k1', true); P.line(r(cx + 6), r(sy + 34), r(cx + 11), r(sy + 82), 'k1', true);
      // geschlossene Lider, dahinter Glut: je eine Linie
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'glut'); P.set(ex + 1, ey, 'kern'); P.set(ex + 2, ey, 'glut');
        P.set(ex + 5, ey, 'glut'); P.set(ex + 6, ey, 'kern'); P.set(ex + 7, ey, 'glut');
        P.glow(ex + 3.5, ey + 0.5, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex + 1, ey], [ex + 6, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
