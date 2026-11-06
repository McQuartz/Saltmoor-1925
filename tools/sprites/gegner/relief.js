// Der aus dem Relief (Namenlose Stadt, Ergänzung). Eine Platte aus dem Reliefband, das durch die
// ganze Stadt läuft. Darauf ist einer der Erbauer gemeißelt, die nicht aufrecht gingen: langer
// Schädel mit Kamm, Arme mit drei Fingern. Falsch ist, dass er sich aus dem Stein lehnt. Unten ist
// er noch flach und Teil des Bildes, oben hat er schon Tiefe und Schatten, und er greift nach dir.
// Die Rahmenlinie der Platte schließt nicht: Ihre Ecken treffen sich in keinem Winkel, den es gibt.
'use strict';
module.exports = {
  id: 'relief', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [60, 115], kopf: [52, 10], rimBis: 113,
  varianten: {
    // a: breite Platte, oben abgebrochen, der Erbauer lehnt sich weit heraus, Kamm wie ein Fächer
    relief_a: { x0: 46, x1: 76, top: 22, bogen: false, kamm: 'faecher', sy: 50 },
    // b: schmale, hohe Platte, schräg abgebrochen, er kommt tiefer heraus, Kamm als zwei Hörner
    relief_b: { x0: 50, x1: 76, top: 14, bogen: true, kamm: 'hoerner', sy: 56 },
  },
  skizzen: {
    sil_platte: { x0: 46, x1: 76, top: 22, bogen: false, kamm: 'faecher', sy: 50 },
    sil_bogen: { x0: 50, x1: 76, top: 14, bogen: true, kamm: 'hoerner', sy: 56 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, bay } = A;
    const f = p.f;
    let aus = 0, atem = 0, fall = 0, glanz = 1, greif = 0, mund = 0, brock = 0;
    // aus: wie weit er aus dem Stein kommt (Pixel nach links), greif: Arm 0 hängend, 1 zurückgezogen, 2 vorgeschnellt
    if (p.idle) { aus = [0, 0, 1, 1][f]; atem = [0, 0, 1, 1][f]; glanz = [1, 0.9, 1.1, 0.9][f]; }
    if (p.angriff) { aus = [-3, -4, 8, 4][f]; greif = [1, 1.2, 2, 1.6][f]; glanz = [1.1, 1.3, 1.6, 1.2][f]; mund = [0, 1, 2, 1][f]; }
    if (p.treffer) { aus = [-3, -2][f]; glanz = 0.5; brock = f + 1; }
    if (p.tod) { aus = -r(p.q * 8); fall = r(p.q * 6); glanz = Math.max(0, 1 - p.q * 3); brock = 3; }
    const { x0, x1 } = v, top = v.top, unten = 106, tief = 5; // Tiefe der Platte (Seitenfläche rechts)
    // Platte: Vorderfläche, rechte Seitenfläche (schräg nach hinten oben), oben abgebrochen oder Bogen
    const oberkante = v.bogen
      ? [[x0, top + 22], [x0 + 4, top + 18], [x0 + 7, top + 19], [x0 + 11, top + 12], [x0 + 15, top + 10], [x0 + 18, top + 4], [x0 + 22, top + 3], [x1, top]]
      : [[x0, top + 10], [x0 + 5, top + 6], [x0 + 9, top + 9], [x0 + 14, top + 2], [x0 + 19, top + 4], [x0 + 23, top], [x1, top + 3]];
    const platte = Pg([[x0, unten], ...oberkante, [x1, unten]], null, { rd: 0.4, pf: 'flat' });
    const seite = Pg([[x1 - 0.5, oberkante[oberkante.length - 1][1]], [x1 + tief, oberkante[oberkante.length - 1][1] - 3], [x1 + tief, unten - 3], [x1 - 0.5, unten]], null, { rd: 0.2, pf: 'flat' });
    const sockel = Pg([[x0 - 6, 107], [x1 + tief + 3, 105], [x1 + tief + 4, 113], [x0 - 7, 114]], null, { rd: 0.6 });
    // Der Erbauer: Schulter am linken Plattenrand, Hals lang nach vorn, Schädel lang mit Kamm
    const sx = x0 + 2 - aus * 0.4, sy = v.sy + atem;
    const hx = x0 - 16 - aus, hy = sy - 12 + atem + (p.angriff ? [-1, -2, 2, 1][f] : 0);
    const rumpf = Pg([[x0 + 10, sy - 6], [sx - 2, sy - 7], [sx - 6, sy], [sx - 3, sy + 9], [x0 + 10, sy + 14]], null, { rd: 2 });
    const hals = glied([[sx - 2, sy - 3], [hx + 9, hy + 5], [hx + 4, hy + 2]], 3.6, 2.6, null);
    const schaedel = Pg([[hx + 8, hy - 3], [hx + 3, hy - 5], [hx - 6, hy - 3], [hx - 13, hy + 1], [hx - 14, hy + 3], [hx - 6, hy + 4 + mund], [hx + 2, hy + 6], [hx + 8, hy + 3]], 'haut', { rd: 0.8 });
    const kiefer = mund ? Pg([[hx - 12, hy + 3 + mund], [hx - 3, hy + 6 + mund], [hx + 3, hy + 6], [hx - 4, hy + 4]], null, { rd: 0.5 }) : null;
    const kamm = v.kamm === 'faecher'
      ? [0, 1, 2, 3].map(i => C(hx + 4, hy - 3, hx + 6 + i * 4, hy - 13 + i * 3, 1.4, 0.7, null))
      : [C(hx + 2, hy - 4, hx + 9, hy - 15, 1.6, 0.6, null), C(hx + 6, hy - 3, hx + 15, hy - 11, 1.5, 0.6, null)];
    const haut = v.kamm === 'faecher' ? [Pg([[hx + 4, hy - 3], [hx + 6, hy - 13], [hx + 10, hy - 10], [hx + 14, hy - 7], [hx + 18, hy - 4], [hx + 9, hy - 1]], 'dunkel', { rd: 0.3 })] : [];
    // Arme: vorn lang mit drei Fingern; hinten flach, noch halb im Stein
    const el = greif === 0 ? [sx - 12, sy + 10] : greif < 1.5 ? [sx - 4, sy + 2] : [sx - 18, sy - 2];
    const ha = greif === 0 ? [sx - 18, sy + 24] : greif < 1.5 ? [sx - 10, sy + 12] : [sx - 34, sy + 2];
    const armV = glied([[sx - 3, sy + 2], el, ha], 3, 1.8, null);
    const fing = (h, a0) => [0, 1, 2].map(i => { const a = a0 + (i - 1) * 0.35, k = [h[0] + Math.cos(a) * 5, h[1] + Math.sin(a) * 5], e = [k[0] + Math.cos(a + 0.5) * 5, k[1] + Math.sin(a + 0.5) * 5]; return glied([h, k, e], 1.1, 0.6, null); }).flat();
    const fingerV = fing(ha, greif === 0 ? 1.9 : greif < 1.5 ? 2.2 : Math.PI + 0.1);
    const armH = glied([[x0 + 6, sy + 8], [x0 + 2, sy + 22], [x0 - 4 - (greif > 1.5 ? 6 : 0), sy + 30]], 2.4, 1.5, null);
    const fingerH = fing([x0 - 4 - (greif > 1.5 ? 6 : 0), sy + 30], 2.0);
    // Brocken, die abplatzen
    const brocken = [];
    for (let i = 0; i < brock; i++) brocken.push(E(x1 + 2 + i * 3 + fall, oberkante[oberkante.length - 2][1] + 6 + i * 9 + fall * (i + 1), 1.6, 1.3, null));
    const gruppen = [
      { p: [sockel], k: 0.5 },
      { p: [seite], k: 0 },
      { p: [platte], k: 0 },
      { p: brocken, k: 0 },
      { p: [armH, fingerH].flat(), k: 0.6, tone: -0.1 },
      { p: [rumpf], k: 2 },
      { p: hals, k: 1.5 },
      { p: [...kamm, ...haut], k: 0.5 },
      { p: kiefer ? [kiefer] : [], k: 0 },
      { p: [schaedel], k: 0.6 },
      { p: [armV, fingerV].flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Vorderfläche: Stein mit leichtem Verlauf (oben rechts heller), gedithert
      const ok0 = oberkante.map(q => q[1]);
      for (let y = Math.min(...ok0); y < unten; y++) for (let x = x0; x < x1; x++) {
        const c = P.get(x, y); if (c < 1 || c > 4) continue; if (x < x0 + 1 && y > sy - 10 && y < sy + 16) continue;
        const t = 0.45 + (x - x0) / (x1 - x0) * 0.25 - (y - top) / (unten - top) * 0.3;
        const q = Math.max(0, Math.min(0.999, t)) * 3, k = Math.floor(q); P.set(x, y, ['k0', 'k1', 'k2', 'k3'][Math.min(3, (q - k) > bay(x, y) ? k + 1 : k)]);
      }
      // Seitenfläche im Gegenlicht: hell, Bruchkante oben
      for (let y = 0; y < 120; y++) for (let x = x1; x <= x1 + tief; x++) { const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, bay(x, y) < 0.45 ? 'r1' : 'k3'); }
      // Rahmenlinie, die nicht schließt: drei Seiten als Rille, die Ecke oben links springt um 2 Pixel
      const rl = x0 + 3, rr = x1 - 3, ro = Math.max(...ok0) + 3, ru = unten - 4;
      const rille = (a, b, c) => { P.line(a[0], a[1], b[0], b[1], 'k0', true); P.line(a[0] + 1, a[1] + 1, b[0] + 1, b[1] + 1, c, true); };
      rille([rl, ru], [rr, ru], 'k3'); rille([rr, ru], [rr, ro], 'k3'); rille([rr, ro], [rl + 5, ro], 'k3'); rille([rl, ru], [rl, ro + 3], 'k3'); rille([rl + 5, ro], [rl + 4, ro - 3], 'k3');
      // Der Rest des Erbauers ist noch flach gemeißelt: Rumpf, Schwanz, Beine als Rillen im Stein
      const kr = [[x0 + 10, sy + 14], [x0 + 15, sy + 24], [x0 + 20, sy + 38], [x0 + 16, sy + 44], [x0 + 22, unten - 8]];
      for (let i = 0; i < kr.length - 1; i++) rille(kr[i], kr[i + 1], 'r1');
      rille([x0 + 15, sy + 26], [x0 + 8, sy + 34], 'k3'); rille([x0 + 8, sy + 34], [x0 + 10, sy + 42], 'k3');
      rille([x0 + 20, sy + 36], [x0 + 26, sy + 44], 'k3');
      // Zeichenband: kleine Kerben in einer Reihe, nicht gleich weit voneinander
      for (let i = 0, x = x0 + 18; x < rr - 2 && i < 6; i++, x += 2 + (i % 3)) { P.auf(x, ro + 4, 'k0'); P.auf(x, ro + 5, 'k3'); }
      // Risse, aus denen es rot glimmt (inneres Licht)
      if (glanz > 0) {
        const riss = [[x1 - 6, top + 14], [x1 - 9, top + 22], [x1 - 7, top + 30], [x1 - 11, top + 40]];
        for (let i = 0; i < riss.length - 1; i++) P.line(riss[i][0], riss[i][1], riss[i + 1][0], riss[i + 1][1], i === 1 && glanz > 1 ? 'glut' : 'glutDim', true);
      }
      // Schädel: Kammfalten, Lid, Zahnreihe; Hals und Rumpf mit Schuppenbändern
      P.line(hx - 12, hy + 2, hx - 2, hy + 2, 'k1', true);
      for (let x = r(hx - 12); x < hx - 2; x += 2) P.auf(x, r(hy + 3 + mund), 'r1');
      for (let i = 0; i < 4; i++) { const q = [sx - 2 + (hx + 6 - sx) * (i + 1) / 5, sy - 3 + (hy + 4 - sy) * (i + 1) / 5]; P.auf(r(q[0]), r(q[1]) - 1, 'k3'); P.auf(r(q[0]) + 1, r(q[1]) + 1, 'k0'); }
      for (let y = r(sy - 4); y < sy + 10; y += 3) P.line(sx - 4, y, x0 + 6, y + 1, 'k3', true);
      // Augen: zwei, übereinander, gelb (die Erbauer hatten sie an der Seite des Schädels)
      if (glanz > 0) {
        const ex = r(hx - 4), ey = r(hy - 1);
        P.glow(ex + 0.5, ey + 1, 6 * glanz, 0.9);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 3, ey + 1, glanz > 1.2 ? 'kern' : 'glut');
        augen.push([ex, ey], [ex + 3, ey + 1]);
      }
    };
    return { gruppen, details, augen, sinken: fall };
  },
};
