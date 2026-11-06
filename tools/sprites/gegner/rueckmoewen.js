// Leuchtturmhof: Die Rückwärtsmöwe. Eine Silbermöwe, so groß wie ein Mann, die auf der Hofmauer
// sitzt, seit der Strahl nach innen fällt. Sie fliegt rückwärts: Brust und Schnabel zeigen vom Meer
// weg, der Schwanz voran, und so kommt sie näher. Falsch ist der Kopf: Der Schnabel zeigt fort, aber
// die Augen sitzen nebeneinander auf der Seite, die dich ansieht, wie bei einem Menschen.
// Was du eben getan hast, bringt sie dir zurück, Schwanz voran.
'use strict';
const LIB = require('../lib');
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
module.exports = {
  id: 'rueckmoewen', biom: 'leuchtturm', zone: 'leuchtturm', w: 96, h: 120, fuss: [50, 115], kopf: [52, 8], rimBis: 113,
  varianten: {
    // a: Flügel angelegt wie ein Mantel, ein Ring am Bein
    rueckmoewen_a: { offen: 0, hals: 0 },
    // b: ein Flügel halb geöffnet und hängend, der Hals länger, zerzaust
    rueckmoewen_b: { offen: 0.2, hals: 5, zaus: true },
  },
  // Silhouetten-Proben (nicht gebaut): ein Schwarm kleiner Möwen um den Signalmast las sich als Stange
  // mit Fähnchen, ohne Masse; die große Möwe ist sofort ein Vogel und groß genug für den Kampf.
  proben: { probe_offen: { offen: 1, hals: 2 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, hoch = 0, auf = v.offen, nick = 0, fuss = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; nick = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [3, 6, -14, -6][f]; hoch = [3, 6, 2, 0][f]; auf = [0.8, 1.25, 1.1, 0.6][f]; fuss = [0, 0, 1, 0.4][f]; }
    if (p.treffer) { lean = [4, 2][f]; auf = v.offen + 0.3; }
    if (p.tod) { fall = r(p.q * 22); lean = r(p.q * 6); auf = v.offen + p.q * 0.8; }
    const T = atem + fall - hoch;
    const bx = 48 + lean, by = 64 + T; // Rumpfmitte
    // Beine: rosa wären sie am Tag; hier dunkle Schienen mit Schwimmfüßen. Beim Angriff greifen sie voran
    const knX = bx - 2 - fuss * 8, fX = bx - 6 - fuss * 22, fY = 112 - fuss * 14 + fall * 0;
    const beine = [...glied([[bx - 2, by + 20], [knX, by + 34], [fX, Math.min(fY, 112)]], 1.8, 1.3, null), ...glied([[bx + 6, by + 20], [bx + 8 - fuss * 4, by + 34], [bx + 6 - fuss * 16, Math.min(fY + 2, 112)]], 1.7, 1.2, 'dunkel')];
    const fuesse = [Pg([[fX - 7, Math.min(fY, 112) + 2], [fX + 2, Math.min(fY, 112) - 1], [fX + 3, Math.min(fY, 112) + 2]], null, { rd: 0.3 }), Pg([[bx + 6 - fuss * 16 - 5, Math.min(fY + 2, 112) + 2], [bx + 6 - fuss * 16 + 3, Math.min(fY + 2, 112) - 1], [bx + 6 - fuss * 16 + 4, Math.min(fY + 2, 112) + 2]], 'dunkel', { rd: 0.3 })];
    // Rumpf: aufrecht, Brust nach rechts (weg von dir), Rücken zu dir
    const rumpf = Pg([[bx - 10, by - 18], [bx + 4, by - 24], [bx + 14, by - 12], [bx + 16, by + 6], [bx + 10, by + 22], [bx - 2, by + 26], [bx - 12, by + 16], [bx - 14, by - 2]], null, { rd: 4 });
    const brust = Pg([[bx + 3, by - 20], [bx + 13, by - 10], [bx + 15, by + 6], [bx + 9, by + 20], [bx + 2, by + 18], [bx + 6, by]], 'haut', { rd: 3 });
    // Hals und Kopf: der Schnabel zeigt nach rechts oben, fort von dir
    const hx = bx + 6 + (v.hals || 0) * 0.3, hy = by - 34 - (v.hals || 0) + nick;
    const hals = C(bx + 2, by - 18, hx, hy + 4, 7, 5, null);
    const kopf = E(hx, hy, 8, 7, null, { pf: 'bevel' });
    const schnabel = [Pg([[hx + 6, hy - 2], [hx + 19, hy - 1], [hx + 21, hy + 1], [hx + 18, hy + 3], [hx + 6, hy + 3]], 'haut', { rd: 0.6 }), Pg([[hx + 15, hy + 2], [hx + 18, hy + 2], [hx + 17, hy + 5]], null, { rd: 0.3 })];
    // Flügel: angelegt wie ein Mantel über dem Rücken (links, zu dir), Schwingen kreuzen unten am Schwanz.
    // auf > 0: der Flügel hebt sich nach hinten oben (Ausholen)
    const fw = [];
    // Richtung der Schwinge: hängt nach links unten (Ruhe) bis steil nach links oben (ausgeholt)
    const wq = Math.min(1, Math.max(0, auf / 1.2)), wa = Math.PI * (0.6 + 0.68 * wq), wl = 52 - wq * 4;
    const sx = bx - 5, sy = by - 18;
    const ex = sx + Math.cos(wa) * wl, ey = sy + Math.sin(wa) * wl;
    let nx = -Math.sin(wa), ny = Math.cos(wa); if (nx + ny * 0.3 < 0) { nx = -nx; ny = -ny; } // n zeigt zum Körper (Hinterkante)
    const pt = (t, d) => [sx + (ex - sx) * t + nx * d, sy + (ey - sy) * t + ny * d];
    fw.push(Pg([[sx + 8, sy - 4], pt(0.02, -7), pt(0.5, -5), [ex, ey], pt(0.7, 6), pt(0.42, 11), [sx + 10, sy + 26]], null, { rd: 1.5 }));
    // Handschwingen: vier gestaffelte Federn an der Hinterkante zur Spitze
    const fed = [];
    for (let i = 0; i < 4; i++) { const t = 0.55 + i * 0.11; const [px, py] = pt(t, 4 - i * 0.6); const lx = Math.cos(wa) * (7 + i * 2) + nx * 3, ly = Math.sin(wa) * (7 + i * 2) + ny * 3; fed.push(Pg([[px, py], [px + nx * 3, py + ny * 3], [px + lx, py + ly], [px + lx - nx * 2, py + ly - ny * 2]], 'dunkel', { rd: 0.4 })); }
    // Schwanz: voran (links unten), gefächert
    const schwanz = Pg([[bx - 10, by + 14], [bx - 22, by + 26 - fuss * 4], [bx - 18, by + 30], [bx - 4, by + 24]], 'dunkel', { rd: 0.6 });
    // hinterer Flügel (b: hängt halb offen)
    const fwH = auf > 0.3 ? [Pg([[bx + 6, by - 18], [bx + 14 + auf * 8, by - 26 - auf * 18], [bx + 22 + auf * 6, by - 30 - auf * 20], [bx + 24 + auf * 4, by - 22 - auf * 14], [bx + 20, by - 8 - auf * 6], [bx + 12, by - 2]], 'dunkel', { rd: 1.2 })] : [];
    const gruppen = [
      { p: fwH, k: 0.6, tone: -0.05 },
      { p: beine, k: 0.5 },
      { p: [schwanz], k: 0.5 },
      { p: [rumpf, hals], k: 3, anker: [lean, T] },
      { p: [brust], k: 0, kante: true, anker: [lean, T] },
      { p: [kopf], k: 0, kante: true, anker: [lean, T] },
      { p: schnabel, k: 0, kante: true },
      { p: fed, k: 0, kante: true },
      { p: fw, k: 0, kante: true, anker: [lean, T] },
      { p: fuesse, k: 0 },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('leuchtturm'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      const istG = (x, y, i) => gid[y * W + x] === i;
      // Brust: Möwenweiß im Gegenlicht (k3, rechte Kante hell), feine Federreihen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!istG(x, y, 4)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; P.set(x, y, !istG(x + 1, y, 4) || !istG(x + 2, y - 1, 4) ? 'r2' : !istG(x + 3, y, 4) ? 'r1' : ((x + y * 2) % 7 === 0 ? 'k2' : 'k3')); }
      // Flügel: Deckfedern als Schuppen (Reihen kleiner Bögen), Armschwingen als Linien
      // Flügel in Federreihen entlang der Schwinge: t = Weg von der Schulter zur Spitze, d = Abstand zur Hinterkante.
      // Deckfedern oben (Bögen, Tal dunkel, Grat hell), dann die Armschwingen mit hellem Saum (Möwenweiß an der Hinterkante)
      const wx = ex - sx, wy = ey - sy, wlen = Math.hypot(wx, wy) || 1;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!istG(x, y, 8)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const t = ((x - sx) * wx + (y - sy) * wy) / wlen, d = (x - sx) * nx + (y - sy) * ny; // d > 0 zum Körper
        const hinterkante = !istG(r(x + nx * 2), r(y + ny * 2), 8) && istG(r(x - nx), r(y - ny), 8);
        if (hinterkante && t < wlen * 0.7) { P.set(x, y, 'r1'); continue; }
        const reihe = Math.floor((d + 8) / 4.5), ph = (t + reihe * 2.5) % 6;
        if (t < wlen * 0.55) { if (ph < 1) P.set(x, y, 'k0'); else if (ph < 2) P.set(x, y, reihe % 2 ? 'k3' : 'k2'); }
        else if (((t * 0.8 + d) % 5 + 5) % 5 < 0.9) P.set(x, y, 'k0'); }
      // Federspitzen: schwarz mit einem hellen Fleck (Spiegel), wie bei Silbermöwen
      fed.forEach((q, i) => { const [px, py] = q.v[2]; if (i % 2 === 0) P.auf(r(px + 1), r(py - 2), 'r2'); });
      // Schnabel: gelb mit rotem Fleck an der Unterseite
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (istG(x, y, 6) && P.get(x, y) >= 1 && P.get(x, y) <= 4) P.set(x, y, x > hx + 8 && (y < hy + 1) ? 'messing' : 'k3');
      P.auf(r(hx + 16), r(hy + 3), 'rot');
      // Ring am Bein (a): Messing, beschriftet wie beim Vogelwart
      if (!v.zaus) { P.auf(r(knX + (fX - knX) * 0.5), r(by + 34 + (Math.min(fY, 112) - by - 34) * 0.5), 'messing'); }
      // zerzaust (b): abstehende Federn am Hals
      if (v.zaus) for (let i = 0; i < 4; i++) P.set(r(hx - 6 - i), r(hy + 6 + i * 3), i % 2 ? 'r1' : 'k3');
      // Augen: zwei nebeneinander auf der Seite zu dir, wie ein Gesicht (falsch für einen Vogel)
      if (!p.tod || f < 1) {
        const ax = r(hx - 4), ay = r(hy - 1);
        P.glow(ax + 1.5, ay + 0.5, 5, 0.7);
        P.set(ax, ay, 'kern'); P.set(ax + 3, ay, 'kern'); P.set(ax - 1, ay, 'glut'); P.set(ax + 4, ay, 'glut');
        if (p.angriff && f >= 1) { P.set(ax, ay - 1, 'glut'); P.set(ax + 3, ay - 1, 'glut'); }
        P.auf(ax, ay + 2, 'k0'); P.auf(ax + 3, ay + 2, 'k0');
        augen.push([ax, ay], [ax + 3, ay]);
      }
      if (p.tod) for (let y = 115; y < H; y++) for (let x = 0; x < W; x++) P.loesch(x, y);
    };
    return { gruppen, details, augen };
  },
};
