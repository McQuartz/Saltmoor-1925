// Wächter Namenlose Stadt: Der Wind, der Gestalt hat. Eine gedrehte Säule aus Sand und Stoff,
// die nach oben breiter wird; ein Augenpaar wandert durch sie. Der Sand fällt nach oben.
'use strict';
module.exports = {
  id: 'windgestalt', biom: 'stadt', zone: 'stadt', rang: 'waechter', w: 128, h: 160, fuss: [64, 155], kopf: [64, 8], rimBis: 156,
  varianten: { windgestalt: {} },
  anim: { idle: { n: 4, fps: 5, loop: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, pose } = A;
    const P0 = pose(p, { lunge: 8, fall: 0 }), f = p.f;
    const lean = P0.lean, dreh = p.idle ? [0, 0.12, 0.2, 0.1][f] : p.angriff ? f * 0.9 : p.treffer ? 0.3 : p.q * 3;
    const zerfall = p.tod ? p.q : 0;
    // Scheiben von unten (schmal) nach oben (breit), seitlich versetzt wie eine Windhose
    const n = 12, scheiben = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), y = 152 - t * 124, rad = 5 + t * t * 24 + Math.sin(i * 1.9 + dreh) * 1.5;
      const x = 64 + Math.sin(t * 2.6 + dreh * 0.6) * 6 * t + lean * t;
      scheiben.push(E(x, y + zerfall * 30 * t, rad * (1 - zerfall * 0.4), 7 + t * 3, null, { pf: 'bevel' }));
    }
    // Stofffetzen, die nach rechts oben wehen
    const fetzen = [];
    for (let i = 0; i < 4; i++) { const s = scheiben[4 + i * 2], ph = Math.sin(dreh * 2 + i) * 3; fetzen.push(Pg([[s.x + s.rx - 3, s.y - 3], [s.x + s.rx + 6, s.y - 7 - i], [s.x + s.rx + 12 + ph, s.y - 6 - i * 2], [s.x + s.rx + 20 + ph, s.y - 10 - i * 2], [s.x + s.rx + 14 + ph, s.y - 3 - i], [s.x + s.rx + 6, s.y], [s.x + s.rx - 2, s.y + 3]], 'dunkel', { rd: 0.3 })); }
    const gruppen = [
      { p: fetzen, k: 0 },
      { p: scheiben, k: 6 },
    ];
    const augen = [];
    const details = P => {
      // Rillen der Drehung
      scheiben.forEach((s, i) => { if (i % 2) for (let k = -s.rx + 3; k < s.rx - 3; k += 2) P.auf(r(s.x + k), r(s.y + Math.sin(k * 0.2 + dreh) * 2), 'k0'); });
      // Sand, der nach oben fällt: Körner über der Säule
      for (let i = 0; i < 18; i++) { const x = 30 + ((i * 37) % 70), y = 26 - ((i * 13 + (p.idle ? f : f * 3) * 4) % 22); P.set(x, y, i % 3 ? 'k3' : 'r1'); }
      // wanderndes Augenpaar
      if (!P0.aus) { const k = p.idle ? [6, 7, 8, 7][f] : p.angriff ? 9 : 8; const s = scheiben[k]; const ex = r(s.x - 4 + (p.idle ? [0, 2, -2, 1][f] : 0)), ey = r(s.y);
        P.auge(ex, ey, 2); P.auge(ex + 7, ey - 1, 2); augen.push([ex, ey], [ex + 7, ey - 1]); }
    };
    return { gruppen, details, augen };
  },
};
