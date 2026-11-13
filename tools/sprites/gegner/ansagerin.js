// Die Ansagerin (Station, Elite). Sie hat auf dem Bahnhof die Züge ausgerufen, und als der letzte
// nicht kam, hat sie weiter ausgerufen. Ihr Kopf ist ein Grammophontrichter geworden, und was er
// ansagt, kommt: drei Züge, dann der Schlag. Solange sie spricht, kostet jede Karte mehr.
// Eine Frau in Uniform, steif, die Hände auf dem Pult. Angriff: der Trichter brüllt.
'use strict';
module.exports = {
  id: 'ansagerin', biom: 'station', zone: 'station', w: 128, h: 160, fuss: [64, 155], kopf: [50, 36], rimBis: 152, rang: 'elite',
  varianten: { ansagerin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, bruell = 0, fall = 0, glanz = 1, ton = 0;
    if (p.idle) { ton = [0, 1, 0, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { bruell = [1, 2, 5, 2][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; }
    const cx = 70, ox = lean, sy = 58 + fall;
    const uni = Pg([[cx - 12 + ox, sy], [cx + 12 + ox, sy - 1], [cx + 16, sy + 30], [cx + 20, 146], ...saum(cx + 20, cx - 18, 150, 6, 2, 4), [cx - 18, 146], [cx - 16, sy + 30]], null, { rd: 2 });
    const hals = C(cx + ox, sy, cx - 2 + ox, sy - 10, 2.6, 2.2, null);
    // Trichter: schräg nach vorn links oben, Mündung groß
    const tx = cx - 4 + ox, ty = sy - 12;
    const mx = tx - 26 - bruell, my = ty - 22 - bruell * 0.6, rr = 13 + bruell;
    const trichter = Pg([[tx + 3, ty + 2], [tx - 3, ty - 3], [mx + rr * 0.5, my - rr * 0.8], [mx - rr * 0.3, my - rr * 0.2], [mx + rr * 0.1, my + rr * 0.7], [mx + rr * 0.9, my + rr * 0.5]], null, { rd: 1.6, pf: 'bevel' });
    const muendung = E(mx + rr * 0.3, my + rr * 0.2, rr * 0.45, rr * 0.6, 'dunkel', { pf: 'flat' });
    const pult = Pg([[cx - 34, sy + 30], [cx - 6, sy + 26], [cx - 4, sy + 34], [cx - 10, sy + 36], [cx - 10, 150], [cx - 28, 150], [cx - 28, sy + 38], [cx - 34, sy + 36]], 'dunkel', { rd: 1, pf: 'bevel' });
    const arme = [glied([[cx - 10 + ox, sy + 4], [cx - 16 + ox, sy + 18], [cx - 20, sy + 28]], 2.8, 2.4, null), glied([[cx + 10 + ox, sy + 4], [cx + 4 + ox, sy + 20], [cx - 10, sy + 27]], 2.8, 2.4, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: arme[1], k: 1 },
      { p: [uni], k: 3 },
      { p: [hals], k: 2 },
      { p: tot ? [] : [trichter], k: 1.5, pf: 'bevel' },
      { p: tot ? [] : [muendung], k: 0, pf: 'flat', noRim: true },
      { p: [pult], k: 1, pf: 'bevel' },
      { p: arme[0], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Messingrand am Trichter, Emailschild am Pult, Knöpfe, Schallwellen
      if (!tot) { P.line(r(mx + rr * 0.5), r(my - rr * 0.8), r(mx - rr * 0.3), r(my - rr * 0.2), 'messing'); P.line(r(mx - rr * 0.3), r(my - rr * 0.2), r(mx + rr * 0.1), r(my + rr * 0.7), 'messing'); }
      P.line(r(cx - 26), r(sy + 44), r(cx - 14), r(sy + 44), 'email'); P.line(r(cx - 26), r(sy + 46), r(cx - 14), r(sy + 46), 'email');
      for (let y = sy + 6; y < sy + 40; y += 8) P.set(r(cx + 2 + ox), y, 'messing');
      if (glanz > 0) {
        if (!tot) { const ex = r(mx + rr * 0.3), ey = r(my + rr * 0.2); P.set(ex, ey, 'kern'); P.set(ex, ey + 1, 'glut'); P.glow(ex, ey, (5 + bruell) * glanz, 0.8 * glanz, 'glutDim', 'k3'); augen.push([ex, ey]);
          if (bruell > 1 || ton) for (let i = 1; i <= (bruell > 1 ? 3 : 1); i++) { const q = mx - rr * 0.6 - i * 5; P.line(r(q), r(my - 4 - i), r(q - 2), r(my + 4 + i), 'blass'); } }
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
