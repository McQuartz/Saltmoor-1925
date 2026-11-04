// Wächter Konservenfabrik: Die Schicht. Zwölf Arbeiterinnen der Nachtschicht, übereinander gewachsen
// wie ein Dosenturm (Lagen zu fünf, vier, zwei, einer), zwölf Kopftücher, ein Leib, ein Gesicht.
// Vor ihnen läuft das Hauptband; alle Arme greifen im selben Winkel aufs Band.
'use strict';
module.exports = {
  id: 'schicht', biom: 'fabrik', zone: 'fabrik', rang: 'waechter', w: 128, h: 160, fuss: [64, 156], kopf: [64, 6], rimBis: 154,
  varianten: { schicht: { lagen: [5, 4, 2, 1] } },
  skizzen: { skizze_reihe: { lagen: [6, 6], breit: 19 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, BR = v.breit || 22, LH = 22, yBand = 128;
    // Takt: Hände gehen gemeinsam auf und ab; Akkord: weit ausholen, dann alle zugleich aufs Band
    let hand = 0, vor = 0, nick = 0, lean = 0, dosen = 0, sink = [0, 0, 0, 0];
    if (p.idle) { hand = [0, 1, 2, 1][f]; dosen = f * 2; }
    if (p.angriff) { hand = [-8, -14, 3, 0][f]; vor = [0, -2, 12, 4][f]; nick = [-1, -2, 1, 0][f]; lean = [1, 2, -3, -1][f]; dosen = [0, 0, 6, 9][f]; }
    if (p.treffer) { lean = [2, 1][f]; nick = [-1, 0][f]; hand = [-3, -1][f]; }
    if (p.tod) { sink = [3, 2, 1, 0].map(k => r(p.q * (10 + k * 9))); hand = r(p.q * 6); }
    const cx = 64, n = v.lagen.length, augen = [];
    // Lagen von unten nach oben: Schulterlinie, Mittelpunkte
    const lagen = v.lagen.map((m, li) => { const sy = yBand - 20 - li * LH + (sink[li] || 0); const xs = []; for (let i = 0; i < m; i++) xs.push(cx + (i - (m - 1) / 2) * BR + r(lean * (li + 1) / n)); return { sy, xs, li }; });
    // Der gemeinsame Leib: eine gestufte Masse, jede Lage etwas schmaler; Schultern rund
    const leib = [];
    lagen.forEach(({ sy, xs }, li) => {
      const x0 = xs[0] - BR / 2 - 1, x1 = xs[xs.length - 1] + BR / 2 + 1, yu = li === 0 ? yBand + 1 : lagen[li - 1].sy + 4;
      leib.push(Pg([[x0 + 4, sy - 1], [x1 - 4, sy - 1], [x1 + 1, sy + 4], [x1 + 1, yu], [x0 - 1, yu], [x0 - 1, sy + 4]], null, { rd: 1.5 }));
    });
    // Nähte zwischen den Körpern (wo sie zusammengewachsen sind)
    const naehte = [];
    lagen.forEach(({ sy, xs }, li) => { for (let i = 1; i < xs.length; i++) { const x = (xs[i - 1] + xs[i]) / 2; naehte.push(C(x, sy + 3, x + (i % 2 ? 1 : -1), sy + LH - 4, 0.5, 0.9, 'dunkel')); } });
    // Köpfe mit Kopftuch und Knoten im Nacken (rechts); alle gleich
    const koepfe = [], tuecher = [];
    lagen.forEach(({ sy, xs }, li) => xs.forEach((x, i) => {
      const hx = x - 1, hy = sy - 6 + (p.idle ? nick : nick * (li % 2 ? 1 : -1));
      tuecher.push(Pg([[hx - 6, hy - 1], [hx - 3, hy - 7], [hx + 3, hy - 8], [hx + 7, hy - 3], [hx + 7, hy + 4], [hx + 4, hy + 6], [hx, hy + 3], [hx - 2, hy - 1]], null, { rd: 1.1 }));
      tuecher.push(E(hx + 8, hy + 2, 2.2, 2, null));
      koepfe.push(E(hx - 2, hy + 1, 4.6, 5.4, 'haut'));
      if (!p.tod || f < 1) augen.push([r(hx - 5), r(hy + 1)], [r(hx - 2), r(hy + 1)]);
    }));
    // Arme der unteren Lage: je zwei, alle im selben Winkel aufs Band (ein Kamm)
    const arme = [];
    lagen[0].xs.forEach((x, i) => {
      for (const d of [-5, 3]) {
        const s0 = [x + d, lagen[0].sy + 6], el = [x + d - 5 + vor * 0.4, lagen[0].sy + 13 + hand * 0.5], hd = [x + d - 9 + vor, yBand - 1 + hand];
        arme.push(...glied([s0, el, hd], 2, 1.3, null), E(hd[0], hd[1], 1.8, 1.4, 'haut'));
      }
    });
    // Arme der zweiten Lage greifen über die Köpfe der ersten nach vorn (gleicher Winkel)
    if (lagen[1]) lagen[1].xs.forEach((x, i) => {
      const s0 = [x - 6, lagen[1].sy + 8], el = [x - 13 + vor * 0.3, lagen[1].sy + 12 + hand * 0.4], hd = [x - 19 + vor * 0.6, lagen[1].sy + 20 + hand * 0.6];
      arme.push(...glied([s0, el, hd], 1.8, 1.2, null), E(hd[0], hd[1], 1.6, 1.3, 'haut'));
    });
    // Das Band: Gurt, Rahmen, Rollen, Stützen; Dosen darauf
    const band = [Pg([[2, yBand], [126, yBand], [126, yBand + 7], [2, yBand + 7]], null, { rd: 1 }), C(2, yBand + 9, 126, yBand + 9, 1.2, 1.2, 'dunkel')];
    const stuetzen = [[10, 1], [64, 0], [118, -1]].map(([x, d]) => C(x, yBand + 9, x + d, 155, 1.8, 2, null));
    const fuesse = [10, 64, 118].map(x => C(x - 4, 155, x + 4, 155, 1.2, 1.2, 'dunkel'));
    const dosenF = [];
    for (let k = 0; k < 7; k++) { const x = 8 + ((k * 19 + 200 - dosen) % 133) - 4; if (x < 4 || x > 122) continue; dosenF.push(Pg([[x - 3, yBand - 7], [x + 3, yBand - 7], [x + 3, yBand], [x - 3, yBand]], null, { rd: 0.5 })); }
    // Eine Lampe unter Blechschirm hängt tief über der obersten; sie ist das einzige Licht am Band
    const lx = cx + 1, ly = 12 + (p.tod ? r(p.q * 4) : 0);
    const lampe = [C(lx, 0, lx, ly - 3, 0.5, 0.5, 'dunkel', { pf: 'flat', noRim: true }), Pg([[lx - 2, ly - 4], [lx + 2, ly - 4], [lx + 8, ly + 1], [lx - 8, ly + 1]], null, { rd: 0.6 })];
    const gruppen = [
      { p: lampe, k: 0 },
      { p: stuetzen, k: 0 },
      { p: fuesse, k: 0 },
      { p: leib, k: 1 },
      { p: naehte, k: 0, noRim: true },
      { p: tuecher, k: 0.8 },
      { p: koepfe, k: 0 },
      { p: dosenF, k: 0 },
      { p: band, k: 0.5 },
      { p: arme, k: 1 },
    ];
    const details = P => {
      // Lampe: Birne unter dem Schirm, Licht fällt auf die oberen Kopftücher
      if (!p.tod || f < 2) { P.set(lx, ly + 1, 'kern'); P.set(lx - 1, ly + 1, 'glut'); P.set(lx + 1, ly + 1, 'glut'); P.glow(lx, ly + 22, 34, 1.3, 'glutDim', 'k3'); augen.push([lx, ly + 1]); }
      // Gesichter: alle dasselbe, trübe helle Augen
      if (!p.tod || f < 1) augen.forEach(([x, y], i) => { P.set(x, y, i % 2 ? 'glut' : 'kern'); });
      if (!p.tod || f < 1) for (let i = 0; i < augen.length; i += 2) P.glow(augen[i][0] + 1.5, augen[i][1] + 0.5, 3.2, 0.45);
      // Rollen im Band und Glanz auf der Gurtkante
      for (let x = 5; x < 126; x += 6) { P.auf(x, yBand + 4, 'k0'); P.auf(x + 1, yBand + 4, 'k3'); }
      for (let x = 3; x < 126; x++) if (x % 5) P.auf(x, yBand, 'r1');
      // Datumsstempel auf jeder Dose (derselbe Fleck)
      dosenF.forEach(d => { const x = r(d.v[0][0]) + 2, y = yBand - 4; P.auf(x, y, 'rost'); P.auf(x + 1, y, 'rost'); });
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
