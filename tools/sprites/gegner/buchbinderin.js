// Die Buchbinderin (Kloster der Abschrift, Elite). Schwester Agathe bindet ein, was der Armarius
// abschreibt. Die fertigen Bände trägt sie auf dem Rücken, mit Hanfschnur an sich gebunden, ein
// Turm aus Büchern, der höher ist als sie selbst und sich nach vorn über ihren Kopf neigt. Ihre
// Hände stecken in der Buchpresse: zwei Bretter mit einer Spindel. Unter der Haube leuchten zwei
// Lesesteine. Angriff: sie klappt die Presse zu.
'use strict';
module.exports = {
  id: 'buchbinderin', biom: 'kloster', zone: 'kloster', w: 128, h: 160, fuss: [62, 155], kopf: [50, 10], rimBis: 152, rang: 'elite',
  varianten: { buchbinderin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, presse = 6, atem = 0, fall = 0, augen1 = 1, hem = 0, wank = 0;
    if (p.idle) { wank = [0, 0.5, 1, 0.5][f]; augen1 = [1, 1, 0.9, 1.1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; presse = [9, 12, 1, 4][f]; wank = [1, 2, -2, -1][f]; augen1 = [1, 1.3, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; wank = 3; augen1 = 0.5; }
    if (p.tod) { fall = r(p.q * 46); lean = r(p.q * 4); augen1 = f < 2 ? 0.6 : 0; wank = r(p.q * 8); }
    const cx = 62, ox = lean, sy = 78 + atem + fall;
    // Habit: schwer, weit, Saum am Boden
    const habit = Pg([[cx - 14 + ox, sy], [cx + 14 + ox, sy - 2], [cx + 20 + r(ox / 2), sy + 30 - fall / 2], [cx + 24, 146], ...saum(cx + 24, cx - 22, 152, 6, 3, 11, hem), [cx - 22, 146], [cx - 18 + r(ox / 2), sy + 30 - fall / 2]], null, { rd: 1.5 });
    const schulter = E(cx + ox, sy + 3, 16, 7, null, { pf: 'bevel' });
    // Kopf mit Haube (Schleier fällt hinten auf die Schultern)
    const kx = cx - 8 + ox, ky = sy - 10;
    const haube = Pg([[kx - 9, ky + 4], [kx - 7, ky - 8], [kx + 4, ky - 11], [kx + 12, ky - 4], [kx + 16, ky + 12], [kx + 6, ky + 10], [kx + 2, ky + 6]], null, { rd: 1.2 });
    const gesicht = E(kx - 3, ky + 1, 5, 6, 'haut');
    // Bücherturm: gestapelte Bände, nach vorn geneigt (wank)
    const baende = [];
    let by = sy - 2, bx = cx + 10 + ox;
    const masse = [[22, 7], [18, 6], [24, 8], [16, 5], [20, 7], [14, 6], [19, 6], [12, 5], [16, 6], [10, 5]];
    masse.forEach(([w0, h], i) => {
      let w = w0;
      const nx = bx - i * i * (0.22 + wank * 0.04) - (i % 2 ? 1 : 0);
      w += 6;
      baende.push(Pg([[nx - w / 2, by - h], [nx + w / 2, by - h], [nx + w / 2, by], [nx - w / 2, by]], i % 3 === 1 ? 'dunkel' : null, { rd: 0.6, pf: 'bevel' }));
      by -= h;
    });
    const turmTop = [bx - 81 * (0.22 + wank * 0.04), by];
    const schnur = [C(cx - 8 + ox, sy + 2, bx - 4, sy - 30, 0.6, 0.6, 'dunkel', { noRim: true }), C(cx + 12 + ox, sy + 4, bx + 6, sy - 46, 0.6, 0.6, 'dunkel', { noRim: true })];
    // Arme nach vorn in die Presse; Presse = zwei Bretter, Abstand "presse"
    const px = cx - 30 + ox, py = sy + 24;
    const armO = glied([[cx - 10 + ox, sy + 4], [cx - 18 + ox, sy + 14], [px + 6, py - presse / 2 - 2]], 3, 2.4, null);
    const armU = glied([[cx - 6 + ox, sy + 8], [cx - 14 + ox, sy + 22], [px + 6, py + presse / 2 + 2]], 3, 2.4, null);
    const brettO = Pg([[px - 12, py - presse / 2 - 4], [px + 12, py - presse / 2 - 4], [px + 12, py - presse / 2], [px - 12, py - presse / 2]], null, { rd: 0.4, pf: 'flat' });
    const brettU = Pg([[px - 12, py + presse / 2], [px + 12, py + presse / 2], [px + 12, py + presse / 2 + 4], [px - 12, py + presse / 2 + 4]], null, { rd: 0.4, pf: 'flat' });
    const spindel = C(px, py - presse / 2 - 4, px, py - presse / 2 - 12, 1, 1, 'dunkel', { pf: 'flat' });
    const blatt = presse > 2 ? [Pg([[px - 10, py - presse / 2 + 0.5], [px + 10, py - presse / 2 + 0.5], [px + 10, py + presse / 2 - 0.5], [px - 10, py + presse / 2 - 0.5]], 'haut', { pf: 'flat' })] : [];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : baende, k: 0.3, pf: 'bevel' },
      { p: schnur, k: 0, noRim: true },
      { p: [habit, schulter], k: 3 },
      { p: [haube], k: 1 },
      { p: [gesicht], k: 0 },
      { p: armU, k: 1 },
      { p: tot ? [] : [brettU, ...blatt, brettO, spindel], k: 0, pf: 'flat' },
      { p: armO, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Buchrücken: Bünde in Tinte, Titel in Gold (ein Pixel)
      if (!tot) baende.forEach((b, i) => { const [x0, y0] = b.v[0], [x1, y1] = b.v[2]; const ym = r((y0 + y1) / 2); P.auf(r(x0 + 3), ym, 'tinte'); P.auf(r(x1 - 3), ym, 'tinte'); if (i % 2 === 0) P.auf(r((x0 + x1) / 2), ym, 'glutDim'); });
      // ein Licht oben im Turm: eine Kerze steht auf dem letzten Band
      if (!tot) { const [tx, ty] = turmTop; P.set(r(tx), r(ty) - 1, 'flamme'); P.set(r(tx), r(ty) - 2, 'glut'); P.set(r(tx), r(ty) - 3, 'kern'); }
      // Lesesteine statt Augen
      if (augen1 > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey + 0.5, 7 * augen1, 0.8 * augen1, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
      // Presse: Messingspindel, gepresstes Blatt mit Tinte
      if (!tot) { P.line(r(px - 8), r(py), r(px + 8), r(py), presse > 2 ? 'tinte' : 'k0', true); if (p.angriff && f === 2) { P.set(r(px - 13), r(py), 'kern'); P.set(r(px - 14), r(py) - 1, 'glut'); P.set(r(px - 14), r(py) + 1, 'glut'); } }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
