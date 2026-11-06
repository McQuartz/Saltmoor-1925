// Nachtzug: Die Kontrolleurin. Uniformmantel bis zum Boden, Schirmmütze, Messingknöpfe in zwei Reihen.
// Sie hält dir die offene Hand hin, viel zu weit: der Arm hat ein Gelenk zu viel und reicht durch den halben Wagen.
// Falsch: Ihr Gesicht ist gelocht wie eine Fahrkarte. Durch die Löcher scheint Licht von hinten.
'use strict';
module.exports = {
  id: 'kontrolleurin', biom: 'nachtzug', zone: 'nachtzug', w: 96, h: 120, fuss: [56, 116], kopf: [58, 6], rimBis: 113,
  varianten: {
    kontrolleurin_a: { glieder: 2, schulter: 9, loecher: [[-2, -1], [2, -1], [0, 3]], tasche: false },
    kontrolleurin_b: { glieder: 3, schulter: 10, loecher: [[-2, -2], [2, 0], [-1, 3], [1, 4]], tasche: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let atem = 0, lean = 0, hem = 0, reach = 0, zange = 0, fall = 0, licht = 1, nick = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; hem = [0, 1, 1, 0][f]; reach = [0, 0, 1, 0][f]; licht = [1, 1, 0.9, 1][f]; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; reach = [-10, -14, 6, 0][f]; zange = [0.3, 0.6, 1, 0.3][f]; nick = [-1, -1, 1, 0][f]; licht = [1, 1.2, 1.5, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; reach = [-4, -2][f]; nick = -1; licht = 0.7; }
    if (p.tod) { fall = r(p.q * 34); reach = -r(p.q * 18); licht = f < 1 ? 0.6 : 0; lean = r(p.q * 3); }
    const cx = 58, T = atem + fall, S = v.schulter;
    const top = 30 + T;
    // Mantel: schmal oben, gerade nach unten, vorn geschlitzt
    const mantel = Pg([[cx - S + 2 + lean, top], [cx + S - 1 + lean, top], [cx + S + 2 + r(lean / 2), top + 12], [cx + S + 9, 104], ...saum(cx + S + 11, cx - S - 11, 113, 6, 2, 23, hem), [cx - S - 9, 104], [cx - S + r(lean / 2), top + 12]], null, { rd: 1 });
    const schultern = E(cx + lean, top + 3, S + 2, 3.5, null, { pf: 'dome' });
    const falte = [C(cx + 1 + lean, top + 8, cx + 2, 110, 0.6, 1, 'dunkel'), C(cx + 6 + lean, top + 12, cx + 9, 108, 0.6, 1.2, 'dunkel')];
    // Kopf klein, Mütze mit Schirm nach links
    const kx = cx - 1 + lean + nick, ky = top - 9 + (p.tod ? r(fall * 0.2) : 0);
    const hals = C(cx + lean, top, kx, ky + 4, 2.4, 2, null);
    const kopf = E(kx, ky, 5, 6.5, 'haut', { pf: 'flat', tone: 0.45 });
    const muetze = [Pg([[kx - 6, ky - 4], [kx + 7, ky - 4], [kx + 8, ky - 10], [kx - 5, ky - 11]], null, { rd: 0.8 }), Pg([[kx - 12, ky - 3], [kx - 4, ky - 5], [kx - 4, ky - 3]], 'dunkel', { rd: 0.4 })];
    // Ausgestreckter Arm: zu viele Glieder, zuletzt waagerecht nach links, Hand offen nach oben
    const s0 = [cx - S + 3 + lean, top + 4];
    const pts = v.glieder === 2
      ? [s0, [cx - 16 + lean, top + 28], [cx - 54 - reach + lean, top + 22 + r(reach * 0.2)]]
      : [s0, [cx - 14 + lean, top + 26], [cx - 30 - reach * 0.5 + lean, top + 12], [cx - 56 - reach + lean, top + 18 + r(reach * 0.2)]];
    const arm = glied(pts, 2.4, 1.3, null);
    const hp = pts[pts.length - 1];
    const hand = [Pg([[hp[0] + 1, hp[1] - 1], [hp[0] - 6, hp[1] - 2], [hp[0] - 7, hp[1]], [hp[0], hp[1] + 2]], 'haut', { rd: 0.6 }), C(hp[0] - 6, hp[1] - 2, hp[0] - 8, hp[1] - 4, 0.6, 0.5, 'haut'), C(hp[0] + 1, hp[1] - 1, hp[0] - 1, hp[1] - 5, 0.7, 0.5, 'haut')];
    // Zange in der anderen Hand: hängt am Mantel, im Angriff schwingt sie nach vorn
    const zx = cx + S + 1 + lean - r(zange * 34), zy = top + 32 - r(zange * 22) + (p.tod ? fall * 0.3 : 0);
    const armR = glied([[cx + S - 2 + lean, top + 4], [cx + S + 4 + lean - r(zange * 10), top + 18 - r(zange * 12)], [zx, zy]], 2.4, 1.6, null);
    const za = -Math.PI / 2 + 0.3 - zange * 1.7;
    const zang = [C(zx, zy, zx + Math.cos(za) * 9, zy + Math.sin(za) * 9, 1.1, 0.8, 'dunkel', { pf: 'flat' }), C(zx, zy, zx + Math.cos(za + 0.35) * 9, zy + Math.sin(za + 0.35) * 9, 1.1, 0.8, 'dunkel', { pf: 'flat' })];
    const tasche = v.tasche ? [Pg([[cx + S - 2, top + 34 + T * 0], [cx + S + 8, top + 34], [cx + S + 9, top + 46], [cx + S - 1, top + 46]], null, { rd: 1 }), C(cx - 4 + lean, top + 2, cx + S + 3, top + 34, 0.6, 0.6, 'dunkel', { pf: 'flat', noRim: true })] : [];
    const gruppen = [
      { p: [...armR.slice(0, 1)], k: 0 },
      { p: [mantel, schultern], k: 3, anker: [0, atem] },
      { p: falte, k: 0, noRim: true },
      { p: tasche, k: 0 },
      { p: [hals, kopf], k: 1, anker: [0, atem] },
      { p: muetze, k: 0, anker: [0, atem] },
      { p: [...arm, ...hand], k: 1 },
      { p: [...armR.slice(1), ...zang], k: 0.5 },
    ];
    const augen = [];
    const details = P => {
      // zwei Reihen Messingknöpfe, Gürtel
      for (let i = 0; i < 5; i++) { P.auf(cx - 2 + lean, top + 6 + i * 7, 'messing'); P.auf(cx + 4 + lean, top + 6 + i * 7, 'messing'); }
      for (let x = cx - S - 1; x <= cx + S + 2; x++) P.auf(x + r(lean / 2), top + 38, 'k0');
      P.auf(kx + 1, ky - 8, 'messing'); P.auf(kx + 2, ky - 8, 'messing'); // Abzeichen an der Mütze
      // gelochtes Gesicht: blass wie Karton, Licht scheint durch die Löcher
      for (let y = r(ky - 5); y <= r(ky + 6); y++) for (let x = r(kx - 4); x <= r(kx + 4); x++) { const q = ((x + 0.5 - kx) / 4.6) ** 2 + ((y + 0.5 - ky) / 6.4) ** 2; if (q > 1 || !P.get(x, y)) continue; const c = P.get(x, y); if (c === 5 || c === 6) continue; P.set(x, y, A.bay(x, y) < 0.62 - q * 0.35 + (x - kx) * 0.05 ? 'r1' : 'k3'); }
      if (licht > 0) {
        v.loecher.forEach(([a, b]) => P.glow(kx + a + 0.5, ky + b + 0.5, 2.6 * licht, 1, 'glutDim', 'k3'));
        v.loecher.forEach(([a, b], i) => { P.set(r(kx + a), r(ky + b), i === 0 || licht > 1.2 ? 'kern' : 'glut'); augen.push([r(kx + a), r(ky + b)]); });
      } else v.loecher.forEach(([a, b]) => P.set(r(kx + a), r(ky + b), 'k0'));
      // Fahrkarte in der offenen Hand? nein: die Hand ist leer und wartet. Ein heller Fleck auf der Handfläche.
      P.auf(r(hp[0] - 3), r(hp[1] - 1), 'r1');
      // Zangenmaul blitzt
      if (zange > 0.8) P.set(r(zx + Math.cos(za) * 9), r(zy + Math.sin(za) * 9), 'messing');
    };
    return { gruppen, details, augen };
  },
};
