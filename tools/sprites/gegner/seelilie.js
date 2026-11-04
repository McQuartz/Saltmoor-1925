// Die Seelilie (Schwarzes Eis, Ergänzung). Aus der Zeit, bevor etwas an Land lebte: ein Tier, das
// aussieht wie eine Pflanze, auf einem Stiel aus gestapelten Steinscheiben, mit einer Krone aus
// gefiederten Armen. Das Eis hat sie aufbewahrt, und jetzt hat sie sich losgerissen und geht auf
// ihren Wurzelkrallen. Falsch ist ihr Kelch: Darin sitzt ein Menschengesicht, ein Matrose von 1903,
// mit offenen Augen. Sie hat es sich genommen, weil sie selbst nie eins hatte.
'use strict';
function kapselLicht(P, caps, c = 'r1') {
  for (const k of caps) {
    if (k.t !== 'c') continue; const dx = k.x2 - k.x1, dy = k.y2 - k.y1, l = Math.hypot(dx, dy) || 1; let nx = -dy / l, ny = dx / l;
    if (nx * 0.9 - ny * 0.5 < 0) { nx = -nx; ny = -ny; } if (nx * 0.9 - ny * 0.5 < 0.15) continue;
    for (let i = 0; i <= Math.ceil(l); i++) { const q = i / Math.ceil(l), rr = k.r1 + (k.r2 - k.r1) * q - 0.6; const x = Math.round(k.x1 + dx * q + nx * rr - 0.5), y = Math.round(k.y1 + dy * q + ny * rr - 0.5); const cur = P.get(x, y); if (cur && cur <= 4) P.set(x, y, c); }
  }
}
module.exports = {
  id: 'seelilie', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [50, 115], kopf: [46, 6], rimBis: 113,
  varianten: {
    // a: S-förmiger Stiel, Krone weit offen, acht Arme
    seelilie_a: { arme: 8, krone: 1, schwung: 1, kelchY: 38 },
    // b: Stiel gerader und höher, Krone halb geschlossen wie eine Faust, sechs Arme
    seelilie_b: { arme: 6, krone: 0.55, schwung: 0.4, kelchY: 32 },
  },
  skizzen: {
    sil_offen: { arme: 8, krone: 1, schwung: 1, kelchY: 38 },
    sil_faust: { arme: 6, krone: 0.4, schwung: 0.4, kelchY: 32 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, chain, r, bay } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, blick = 1, auf = v.krone, wipp = 0, peitsch = 0;
    // auf: wie weit die Krone offen ist (0 geschlossen, 1 offen, >1 weit gespreizt); peitsch: Arme schlagen nach vorn
    if (p.idle) { atem = [0, 0, 1, 1][f]; wipp = [0, 1, 1, 0][f]; auf = v.krone + [0, 0.05, 0.1, 0.05][f]; blick = [1, 1, 0.8, 1][f]; }
    if (p.angriff) { lean = [3, 5, -10, -5][f]; auf = [1.15, 1.35, 0.5, 0.8][f]; peitsch = [0, 0, 1, 0.6][f]; blick = [1.1, 1.4, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [4, 2][f]; auf = v.krone * 0.7; blick = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 8); auf = v.krone * (1 - p.q * 0.8); blick = 0; }
    const T = atem + fall;
    // Wurzelkrallen am Boden: fünf gekrümmte Haken, die sich ins Eis graben
    const basis = [50, 106];
    const krallen = [[-1, -0.9], [-0.5, -0.4], [0.1, 0.2], [0.6, 0.6], [1.1, 1]].map(([s, b], i) => glied([[basis[0] + s * 3, basis[1]], [basis[0] + s * 12, basis[1] + 2 + Math.abs(s) * 2], [basis[0] + s * 19, 112 + (i % 2)], [basis[0] + s * 22 + b * 2, 114]], 2.2, 0.7, null));
    const fussK = E(basis[0], basis[1] + 2, 6, 4, null);
    // Stiel: gestapelte Scheiben, S-Kurve, oben neigt er sich mit der Krone nach vorn
    const kx = 46 + lean, ky = v.kelchY + T;
    const stielPkt = [];
    for (let i = 0; i <= 14; i++) {
      const q = i / 14; const y = basis[1] - 2 + (ky + 10 - basis[1] + 2) * q;
      const x = basis[0] + (kx + 2 - basis[0]) * q * q + Math.sin(q * Math.PI * 1.6) * 6 * v.schwung + (wipp && q > 0.6 ? 1 : 0);
      stielPkt.push([x, y]);
    }
    const stiel = glied(stielPkt, 4.2, 2.6, null);
    // Kelch: eine Schale aus Platten, oben offen
    const kelch = Pg([[kx - 11, ky - 5], [kx + 12, ky - 6], [kx + 10, ky + 6], [kx + 5, ky + 13], [kx - 3, ky + 13], [kx - 9, ky + 6]], null, { rd: 1.2 });
    // Arme: vom Kelchrand, gegliedert, mit Fiedern; offen biegen sie nach außen und unten
    const arme = [], fiedern = [], spitzen = [];
    for (let i = 0; i < v.arme; i++) {
      const q = v.arme > 1 ? i / (v.arme - 1) : 0.5; // 0 vorn links, 1 hinten rechts
      const x0 = kx - 8 + q * 18, y0 = ky - 4 - Math.sin(q * Math.PI) * 1.5;
      let a = -Math.PI / 2 + (q - 0.5) * 1.4 * auf; // Startwinkel nach oben, gefächert
      const kr = (0.16 + 0.1 * auf) * (q < 0.5 ? -1 : 1); // Krümmung nach außen
      const pts = [[x0, y0]]; let x = x0, y = y0;
      const n = 6, len = 4.2 + (1 - Math.abs(q - 0.5)) * 1.4;
      for (let k = 0; k < n; k++) {
        a += kr * (0.6 + k * 0.25);
        if (peitsch) a += (-Math.PI - 0.45 - a) * 0.2 * peitsch * (k + 1) / n * (q < 0.6 ? 1.7 : 0.5);
        x += Math.cos(a) * len; y += Math.sin(a) * len; pts.push([x, y]);
      }
      const hinten = q > 0.55;
      const arm = glied(pts, 1.9, 0.6, hinten ? 'dunkel' : null);
      arme.push({ arm, hinten, pts });
      spitzen.push(pts[pts.length - 1]);
      // Fiedern: kurze Striche zu beiden Seiten jedes Gliedes
      for (let k = 1; k < n; k++) {
        const [ax, ay] = pts[k], [bx, by] = pts[k + 1]; const d = Math.atan2(by - ay, bx - ax);
        for (const sgn of [-1, 1]) fiedern.push({ hinten, c: C(ax, ay, ax + Math.cos(d + sgn * 1.0) * 3.2, ay + Math.sin(d + sgn * 1.0) * 3.2, 0.5, 0.45, hinten ? 'dunkel' : null, { pf: 'flat' }) });
      }
    }
    const gruppen = [
      { p: arme.filter(a => a.hinten).flatMap(a => a.arm).concat(fiedern.filter(x => x.hinten).map(x => x.c)), k: 0.4, tone: -0.1 },
      { p: krallen.flat().concat([fussK]), k: 1 },
      { p: stiel, k: 1.2 },
      { p: [kelch], k: 1, anker: [lean, T] },
      { p: arme.filter(a => !a.hinten).flatMap(a => a.arm).concat(fiedern.filter(x => !x.hinten).map(x => x.c)), k: 0.4 },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Stielscheiben: je Scheibe eine dunkle Fuge und darüber eine helle Kante (Gliederung)
      for (let i = 1; i < stielPkt.length - 1; i++) {
        const [x, y] = stielPkt[i], w = 4.2 - 1.6 * i / 14;
        P.line(x - w + 0.5, y, x + w - 0.5, y + 0.6, 'k0', true);
        P.line(x - w + 1, y - 1, x + w - 1, y - 0.4, 'k3', true);
        P.auf(r(x + w - 1), r(y - 1), 'r1');
      }
      // Kelchplatten: Fugen in Fünfecken, Rand oben hell
      P.line(kx - 8, ky - 3, kx - 7, ky + 6, 'k0', true); P.line(kx + 8, ky - 4, kx + 7, ky + 9, 'k0', true);
      P.line(kx - 7, ky - 3, kx - 6, ky + 6, 'k3', true); P.line(kx + 9, ky - 4, kx + 8, ky + 9, 'k3', true);
      // das Gesicht im Kelch: blass (Haut eine Stufe heller), Augen rot, Mund offen
      const gx = r(kx), gy = r(ky + 2);
      P.el(gx + 0.5, gy + 1.5, 5.5, 6.5, 'k3', true);
      for (let y = gy - 5; y <= gy + 8; y++) for (let x = gx - 5; x <= gx + 6; x++) { if (P.get(x, y) !== 4) continue; const t = 0.55 - Math.hypot(x - gx + 1.5, y - gy + 2) / 14; if (bay(x - lean, y - T) < t) P.set(x, y, 'r1'); }
      // Augenhöhlen, Nase, offener Mund; Haar klebt am Kelchrand
      P.el(gx - 1.5, gy + 0.5, 1.6, 1.3, 'k1', true); P.el(gx + 3.5, gy + 0.5, 1.6, 1.3, 'k1', true);
      P.auf(gx + 1, gy + 2, 'k2'); P.auf(gx + 1, gy + 3, 'k1');
      P.el(gx + 1.5, gy + 5.5, 1.6, p.angriff ? 1.6 : 1, 'k0', true);
      for (let x = gx - 4; x <= gx + 5; x += 2) P.auf(x, gy - 4, 'k1');
      if (blick > 0) {
        P.glow(gx + 1, gy, 5 * blick, 0.6);
        P.set(gx - 2, gy, 'kern'); P.set(gx + 3, gy, blick > 1.2 ? 'kern' : 'glut');
        if (blick > 1.3) { P.set(gx - 1, gy, 'glut'); P.set(gx + 4, gy, 'glut'); }
        augen.push([gx - 2, gy], [gx + 3, gy]);
      }
      // Arme: Lichtkante auf den vorderen Armen, Reif auf den Spitzen (kleine Lichtpunkte)
      arme.filter(a => !a.hinten).forEach(a => kapselLicht(P, a.arm, 'r1'));
      spitzen.forEach(([x, y], i) => { if (!p.tod && i % 2 === 0) P.set(r(x), r(y), 'glutDim'); });
      // Wurzelkrallen: Kanten
      krallen.forEach(k => kapselLicht(P, k, 'k3'));
    };
    return { gruppen, details, augen };
  },
};
