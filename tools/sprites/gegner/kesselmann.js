// Der Kesselmann (Konservenfabrik). Heizer an den Retorten: Sein Leib ist ein genieteter Kessel
// mit offener Feuertür im Bauch, ein kleiner kahler Kopf sitzt obendrauf. Aus dem Rohr auf seinem
// Rücken quillt Rauch und fällt nach unten, wie aus dem Schornstein. Er hält eine Kohlenschaufel.
'use strict';
module.exports = {
  id: 'kesselmann', biom: 'fabrik', zone: 'fabrik', w: 96, h: 120, fuss: [50, 115], kopf: [44, 20], rimBis: 112,
  varianten: {
    kesselmann_a: { rx: 22, ry: 24, cy: 70, rohr: 'haken', werkzeug: 'schaufel' },
    kesselmann_b: { rx: 18, ry: 27, cy: 68, rohr: 'haken', werkzeug: 'haken', hoch: 6 },
  },
  skizzen: { skizze_ohne: { rx: 22, ry: 24, cy: 70, rohr: 'gerade', werkzeug: null } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, atem = 0, sw = 0, feuer = 1, rauchY = 0, fall = 0, tuer = 0;
    // sw: Schaufel/Haken: 0 ruhend, 1 ausgeholt (hinter der Schulter), 2 Schlag nach vorn unten
    let nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; feuer = [1, 0.85, 1.1, 0.9][f]; rauchY = f * 3; tuer = [0, 0, 1, 0][f]; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; sw = [0.6, 1, 2, 1.4][f]; feuer = [1.1, 1.3, 1.6, 1.2][f]; rauchY = f * 3; }
    if (p.treffer) { lean = [2, 1][f]; feuer = 0.6; tuer = 2; }
    if (p.tod) { fall = r(p.q * 18); feuer = Math.max(0, 1 - p.q * 2.5); lean = r(p.q * 3); tuer = 3; }
    const T = atem + fall, cx = 50 + lean, cy = v.cy + T, RX = v.rx, RY = v.ry;
    // Beine: kurz, schwer, Hosen und Stiefel
    const beine = [...glied([[cx - 9, cy + RY - 6], [cx - 11, 104], [cx - 11, 112]], 4.2, 3.6, null), ...glied([[cx + 8, cy + RY - 6], [cx + 9, 104], [cx + 9, 112]], 4.2, 3.6, null), E(cx - 13 - (lean < 0 ? 1 : 0), 113, 6, 2.6, 'dunkel'), E(cx + 8, 113, 6, 2.6, 'dunkel')];
    // Kesselleib: oben etwas schmaler, Bauch weit
    const leib = Pg([[cx - RX + 6, cy - RY], [cx + RX - 5, cy - RY], [cx + RX, cy - RY + 9], [cx + RX + 1, cy + 4], [cx + RX - 2, cy + RY - 4], [cx + RX - 8, cy + RY], [cx - RX + 7, cy + RY], [cx - RX - 1, cy + RY - 6], [cx - RX - 2, cy + 3], [cx - RX + 1, cy - RY + 8]], null, { rd: 3 });
    const bund = C(cx - RX + 2, cy + RY - 3, cx + RX - 2, cy + RY - 3, 1.6, 1.6, 'dunkel');
    // Kopf: klein, kahl, tief eingesunken vorne oben
    const hx = cx - 9, hy = cy - RY - 2 + nick;
    const kopf = E(hx, hy, 6, 6.5, 'haut', { pf: 'bevel' });
    const nacken = E(hx + 3, hy + 5, 6, 3, null);
    // Rohr auf dem Rücken: steigt, biegt um und zeigt nach unten (Haken) oder steigt gerade
    const rb = [cx + RX - 6, cy - RY + 6 - (v.hoch || 0)];
    const rohr = v.rohr === 'haken'
      ? glied([rb, [rb[0] + 3, rb[1] - 22], [rb[0] + 7, rb[1] - 30], [rb[0] + 13, rb[1] - 30], [rb[0] + 16, rb[1] - 24]], 2.8, 2.6, null)
      : glied([rb, [rb[0] + 2, rb[1] - 28], [rb[0] + 2, rb[1] - 36]], 2.6, 2.6, null);
    const muendung = v.rohr === 'haken' ? [rb[0] + 16, rb[1] - 21] : [rb[0] + 2, rb[1] - 37];
    const kragen = [E(muendung[0], muendung[1] + (v.rohr === 'haken' ? 0 : 1), 3.6, 2, 'dunkel')];
    // Rauch fällt aus der Mündung nach unten, an Rohr und Rücken entlang
    const rauch = [];
    if (!p.tod || f < 3) {
      const mx = muendung[0] + (v.rohr === 'haken' ? 1 : 4);
      // eine Säule aus Schwaden, die nach unten fällt und am Boden auseinanderläuft
      for (let i = 0; i < 14; i++) { const qq = ((i * 4 + rauchY) % 56) / 56, yy = muendung[1] + 3 + qq * (112 - muendung[1] - 3), rr = 2.6 + qq * 3.5 + (i % 3) * 0.5; rauch.push(E(mx + Math.sin(i * 2.3) * 1.4 + qq * qq * 7, yy, rr * (qq > 0.85 ? 1.9 : 1), rr * (qq > 0.85 ? 0.55 : 0.9), null, { pf: 'flat', tone: 0.2 })); }
    }
    // Arme: dick, menschlich; vorne mit dem Werkzeug
    const schulterV = [cx - RX + 5, cy - RY + 9], schulterH = [cx + RX - 4, cy - RY + 9];
    let hand, stiel = [], blatt = [];
    if (sw === 0) hand = [cx - RX - 4, cy + 4];
    else if (sw < 1.5) hand = [cx - RX + 8 + sw * 8, cy - RY - 2 - sw * 4];
    else hand = [cx - RX - 10, cy - 2];
    const ell = sw >= 1.5 ? [cx - RX - 6, cy - RY + 8] : sw > 0 ? [cx - RX - 3, cy - RY + 14] : [cx - RX - 6, cy - 6];
    const armV = [...glied([schulterV, ell, hand], 4, 3, null), E(hand[0], hand[1], 3, 2.6, 'haut')];
    const armH = glied([schulterH, [cx + RX + 4, cy - 2], [cx + RX + 2, cy + 12]], 3.6, 2.8, null);
    if (v.werkzeug) {
      // Werkzeug zeigt vom Griff in Richtung wa (Blatt am Ende)
      const wa = sw === 0 ? 1.95 : sw < 1.5 ? -0.35 - sw * 0.45 : 2.6, L = v.werkzeug === 'schaufel' ? 34 : 38;
      const a0 = [hand[0] - Math.cos(wa) * 6, hand[1] - Math.sin(wa) * 6], e = [hand[0] + Math.cos(wa) * L, hand[1] + Math.sin(wa) * L];
      stiel.push(C(a0[0], a0[1], e[0], e[1], 1.1, 1.1, 'dunkel', { pf: 'flat' }));
      if (v.werkzeug === 'schaufel') { const nx = -Math.sin(wa), ny = Math.cos(wa), dx = Math.cos(wa), dy = Math.sin(wa); blatt.push(Pg([[e[0] - nx * 3, e[1] - ny * 3], [e[0] + nx * 3, e[1] + ny * 3], [e[0] + nx * 5 + dx * 11, e[1] + ny * 5 + dy * 11], [e[0] - nx * 5 + dx * 11, e[1] - ny * 5 + dy * 11]], null, { rd: 0.6 })); }
      else blatt.push(...glied([e, [e[0] + Math.cos(wa) * 3, e[1] + Math.sin(wa) * 3], [e[0] + Math.cos(wa + 1.6) * 5, e[1] + Math.sin(wa + 1.6) * 5]], 1.4, 1, null));
    }
    const hinterWz = sw > 0 && sw < 1.5;
    const gruppen = [
      { p: hinterWz ? [...stiel, ...blatt] : [], k: 0 },
      { p: armH, k: 1, anker: [lean, T] },
      { p: rauch, k: 3, noRim: true },
      { p: rohr, k: 1, anker: [lean, T] },
      { p: kragen, k: 0 },
      { p: beine, k: 1.5 },
      { p: [leib], k: 2, anker: [lean, T] },
      { p: [bund], k: 0, noRim: true },
      { p: [nacken], k: 1, anker: [lean, T] },
      { p: [kopf], k: 0, anker: [lean, T] },
      { p: hinterWz ? [] : [...blatt, ...stiel], k: 0 },
      { p: armV, k: 1.5, anker: [lean, T] },
    ];
    const augen = [];
    const details = P => {
      // Nietreihen entlang der Nähte (Rost), eine waagerecht, eine senkrecht
      for (let x = r(cx - RX + 4); x <= cx + RX - 3; x += 3) { const u = (x - cx) / RX; P.auf(x, r(cy - 9 + 3 * u * u), (x / 3 | 0) % 2 ? 'rost' : 'k3'); }
      for (let y = r(cy - RY + 6); y <= cy + RY - 6; y += 3) P.auf(r(cx + 9), y, 'k3');
      // Feuertür im Bauch: Rahmen, glühendes Loch, die Tür hängt aufgeklappt nach vorn (links)
      const tx = r(cx - 12), ty = r(cy + 1), tw = 12, th = 10;
      const imTor = (x, y) => y >= ty + 3 || Math.hypot(x + 0.5 - tx - tw / 2, (y + 0.5 - ty - 3) * 1.6) <= tw / 2;
      for (let y = ty - 2; y <= ty + th; y++) for (let x = tx - 1; x <= tx + tw; x++) { if (!imTor(x, y) && !imTor(x - 1, y + 1)) continue; P.auf(x, y, imTor(x, y) ? 'k0' : 'r1'); }
      if (feuer > 0) {
        P.glow(tx + tw / 2, ty + th / 2 + 1, 12 * feuer, 0.9);
        for (let y = ty; y < ty + th; y++) for (let x = tx; x < tx + tw; x++) {
          if (!imTor(x, y) || x === tx || x === tx + tw - 1) continue;
          const q = Math.hypot((x - tx - tw / 2) / tw * 2, (y - ty - th) / th * 1.2), t = feuer * (1.15 - q) + (((x * 7 + y * 3 + (p.idle ? f : 0)) % 5) - 2) * 0.06;
          P.set(x, y, t > 0.95 ? 'kern' : t > 0.65 ? 'flamme' : t > 0.35 ? 'rost' : 'k0');
        }
        augen.push([tx + tw / 2, ty + th - 2]);
      }
      const tl = tuer >= 2 ? 0 : 1 + tuer;
      if (tuer < 3) for (let y = ty - 1; y <= ty + th; y++) for (let k = 1; k <= 3 - tl; k++) P.set(tx - k - 1, y + (k === 3 - tl ? 1 : 0), k === 1 ? 'k2' : 'k3');
      // Manometer auf der Brust, Zeiger steht immer über dem roten Strich
      const mx = r(cx - 4), my = r(cy - RY + 9);
      P.el(mx + 0.5, my + 0.5, 3.2, 3.2, 'k1', true); P.el(mx + 0.5, my + 0.5, 2.2, 2.2, 'k3', true); P.auf(mx, my, 'k0'); P.auf(mx + 1, my - 1, 'rost'); P.auf(mx + 2, my - 2, 'rost');
      // Augen: klein, trüb, unter schweren Lidern
      if (!p.tod || f < 1) { const ex = r(hx - 4), ey = r(hy); P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut'); P.glow(ex + 1.5, ey + 0.5, 3.5, 0.5); P.auf(ex, ey - 1, 'k0'); P.auf(ex + 3, ey - 1, 'k0'); augen.push([ex, ey], [ex + 3, ey]); }
      // Rauch hat nur einen Saum aus Licht, wo die Lampe ihn trifft
      rauch.forEach((s, i) => { if (i % 2 === 0) P.auf(r(s.x + s.rx - 1), r(s.y - s.ry + 1), 'r1'); });
    };
    return { gruppen, details, augen };
  },
};
