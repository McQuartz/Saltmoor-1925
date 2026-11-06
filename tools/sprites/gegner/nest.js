// Das Nest (Moorwald, Neubau Auftrag 2, M5). Ein Erdhügel am Bohlenweg, um den man im Dorf einen Bogen macht.
// Jemand hat einen Pflock mit einem Lappen hineingesteckt, als Warnung (Variante b: eine alte Bohle liegt quer darüber).
// Im Leerlauf liest es sich als Hügel: Gras, Wurzeln, die angezogenen Beine sehen aus wie Wurzelknie.
// Erst im Angriff steht es auf acht kantigen Beinen auf, und vorne öffnet sich eine Reihe menschlicher Zähne.
// Die Augen blinzeln nacheinander, nie gleichzeitig.
// Silhouette: ein schiefer Grashügel mit Pflock und Lappen, an den Seiten geknickte Wurzelknie.
'use strict';
module.exports = {
  id: 'nest', biom: 'moor', zone: 'moor_gruen', w: 96, h: 120, fuss: [48, 115], kopf: [44, 52], rimBis: 114,
  varianten: {
    nest_a: { beine: 4, breit: 25, hoch: 15, zaehne: 9, pflock: true },
    nest_b: { beine: 4, breit: 23, hoch: 17, zaehne: 7, bohle: true, zone: 'moor' },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A; const f = p.f;
    let auf = 0, lean = 0, fall = 0, aus = false, weh = 0, offen = 0;
    if (p.idle) { weh = [0, 1, 1, 0][f]; }
    if (p.angriff) { auf = [5, 13, 15, 7][f]; lean = [1, -1, -5, -2][f]; offen = [1, 2, 3, 1][f]; weh = f; }
    if (p.treffer) { auf = [7, 5][f]; lean = [3, 2][f]; offen = 1; }
    if (p.tod) { auf = -r(p.q * 4); fall = r(p.q * 6); aus = f >= 1; }
    const cx = 47 + lean, by = 101 - auf + fall, Bw = v.breit, Bh = v.hoch;
    // Hügel: zwei Buckel, schief, unten ein Rand aus Erde
    const boden = 114 - auf + fall * 0.3, dach = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, ang = Math.PI * (1 - t); const wob = Math.sin(i * 2.7) * 1.4; dach.push([cx + Math.cos(ang) * (Bw + 3) + wob * 0.5, by + 4 - Math.sin(ang) * (Bh + 2) * (0.85 + 0.15 * Math.sin(t * 3.1)) + wob]); }
    const kq = Math.min(1, Math.max(0, auf) / 9), bauchU = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; bauchU.push([cx + (Bw + 4) * (1 - 2 * t), (1 - kq) * boden + kq * (by + 5 + 7 * Math.sin(Math.PI * t))]); }
    const huegel = Pg([...dach, ...bauchU], null, { rd: 1 });
    const buckel = E(cx + 9, by - Bh * 0.45, Bw * 0.55, Bh * 0.75, null);
    const rand = kq > 0.5 ? null : Pg([[cx - Bw - 5, boden - 3], [cx + Bw + 5, boden - 3], [cx + Bw + 3, boden], [cx - Bw - 3, boden]], 'dunkel', { rd: 1 });
    // Gras: Büschel aus geknickten Halmen
    const halme = [];
    [[-16, 0.55], [-7, 0.85], [3, 1], [12, 1.05], [20, 0.75]].forEach(([dx, hq], i) => {
      const x = cx + dx, top = by - Bh * hq - (dx > 2 && dx < 16 ? Bh * 0.25 : 0) + 3;
      for (let k = -1; k <= 1; k++) { const h = 5 + ((i * 3 + k * 5 + 9) % 4); const kipp = k * 1.6 + (p.idle ? (k ? weh * 0.6 * k : 0) : -weh * 0.5); halme.push(...glied([[x + k * 1.5, top], [x + k * 2 + kipp * 0.6, top - h * 0.6], [x + k * 2.5 + kipp, top - h]], 0.8, 0.45, null)); }
    });
    // Warnzeichen: Pflock mit Lappen (a) oder eine quer liegende Bohle (b)
    const zeichen = [];
    if (v.pflock) {
      const px = cx - 9, py = by - Bh + 2;
      zeichen.push(C(px, py + 2, px - 4, py - 22, 1.4, 1.1, 'dunkel'));
      zeichen.push(Pg([[px - 4, py - 19], [px - 11 - weh, py - 17], [px - 14 - weh, py - 12 + weh], [px - 10, py - 13], [px - 4, py - 15]], null, { rd: 0.4 }));
    }
    if (v.bohle) zeichen.push(Pg([[cx - Bw - 9, by - 1], [cx + 9, by - Bh - 15], [cx + 13, by - Bh - 12], [cx - Bw - 5, by + 3]], null, { rd: 0.6 }));
    // Beine: im Leerlauf angezogen wie Wurzelknie, beim Aufstehen lang und kantig
    const vorn = [], hinten = [];
    for (let i = 0; i < v.beine; i++) for (const s of [-1, 1]) {
      const q = i / (v.beine - 1), hx = cx + s * (Bw * 0.35 + q * Bw * 0.4), hy = by + 4;
      const kx = cx + s * (Bw * 0.6 + q * 15 + 3 + auf * 0.25), ky = by - 3 - auf * 0.6 - (i % 2) * 3 + (p.tod ? r(p.q * 6) : 0);
      const fx = cx + s * (Bw * 0.55 + q * 20 + 3 + auf * 0.2), fy = 114;
      (i % 2 ? hinten : vorn).push(...glied([[hx, hy], [kx, ky], [fx, fy]], 1.9, 0.8, null));
    }
    const gruppen = [
      { p: hinten, k: 0 },
      { p: zeichen.slice(0, 1), k: 0 },
      { p: [huegel, buckel, rand].filter(Boolean), k: 4, anker: [0, by] },
      { p: halme, k: 0 },
      { p: zeichen.slice(1), k: 0.5 },
      { p: vorn, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Wurzeln und Erdkrumen auf dem Hügel
      for (let i = 0; i < 7; i++) { const x = r(cx - Bw + 6 + i * (2 * Bw - 12) / 6), y = r(by - Bh * 0.4 + ((i * 5) % 7)); P.auf(x, y, 'k0'); P.auf(x + 1, y + 1, 'k0'); P.auf(x + 2, y + 1, 'k3'); }
      // Zahnreihe: menschliche Zähne, im Leerlauf fast geschlossen
      const zy = r(by + 4), n = v.zaehne;
      for (let i = 0; i < n; i++) { const x = r(cx - n + 2 + i * 2); P.auf(x, zy - 1, 'k0'); P.auf(x + 1, zy - 1, 'k0'); P.auf(x, zy, offen || i % 2 ? 'r1' : 'k3'); for (let k = 1; k <= offen; k++) { P.auf(x, zy + k, 'k0'); P.auf(x + 1, zy + k, 'k0'); } if (offen) P.auf(x, zy + offen + 1, 'k3'); }
      // Augenreihe über den Zähnen: blinzeln nacheinander
      for (let i = 0; i < 5; i++) {
        const x = r(cx - 9 + i * 4), y = r(by - 4 - Math.abs(i - 2) * 0.8);
        const zu = aus || (p.idle && i === f) || (p.idle && f === 3 && i === 4);
        if (zu) { P.auf(x, y, 'k0'); P.auf(x + 1, y, 'k0'); continue; }
        P.auf(x, y, i === 2 ? 'kern' : 'glut'); P.glow(x + 0.5, y + 0.5, 3, 0.7); augen.push([x, y]);
      }
    };
    return { gruppen, details, augen };
  },
};
