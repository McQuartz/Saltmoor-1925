// Der Geheilte (Grotte der Gaben). Kam an zwei Krücken, ging ohne. Die Krücken hängen an der Wand.
// Er geht seitdem auf allen vieren: die Arme zu lang und gerade wie Stelzen, die Knie nach hinten
// geknickt, der Kopf im Nacken, der Mund offen vor Dank. Um den Hals das Wachsbein, das er geopfert hat.
'use strict';
module.exports = {
  id: 'geheilter', biom: 'grotte', zone: 'grotte', w: 96, h: 120, fuss: [52, 114], kopf: [30, 12], rimBis: 112,
  varianten: {
    geheilter_a: { arm: 1, ruecken: 0, krueckenRest: false, kopfA: -0.5 },
    geheilter_b: { arm: 1.1, ruecken: 4, krueckenRest: true, kopfA: -0.8 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const f = p.f, P0 = pose(p, { fall: 30 });
    let sx = 0, sy = 0, hebe = 0, vor = 0, nick = 0, mund = 1, hem = 0;
    if (p.idle) { sy = 0; nick = [0, 0, 1, 1][f]; mund = [1, 2, 2, 1][f]; hem = [0, 1, 1, 0][f]; }
    // Ausholen: er steigt vorne hoch (Gewicht auf die Hinterbeine), dann schlägt er mit den Armen nieder
    if (p.angriff) { sx = [3, 5, -9, -3][f]; sy = [-5, -10, 3, 0][f]; hebe = [0.5, 1, -0.3, 0][f]; vor = [0, 0, 1, 0.3][f]; mund = [2, 3, 3, 1][f]; nick = [-1, -2, 1, 0][f]; }
    if (p.treffer) { sx = [3, 1][f]; sy = [-2, -1][f]; mund = 3; nick = -2; }
    if (p.tod) { sy = r(p.q * 20); sx = r(p.q * 4); mund = 0; }
    const R = v.ruecken, T = 0;
    // Hüfte und Schulter
    const hx = 66, hy = 56 + T + (p.tod ? r(p.q * 30) : 0);
    const ax = 40 + sx, ay = 45 + sy + T;
    // Hinterbeine: Knie zeigt nach hinten (rechts), Ferse hoch, Zehen vorn
    const bein = (dx, dunkel) => [E(hx + 15 + dx, hy + 21 - (p.tod ? r(p.q * 10) : 0), 2.6, 2.4, dunkel ? 'dunkel' : null), ...glied([[hx + dx, hy], [hx + 15 + dx, hy + 21 - (p.tod ? r(p.q * 10) : 0)], [hx + 8 + dx, hy + 48 - (p.tod ? r(p.q * 18) : 0)]], 3.2, 1.3, dunkel ? 'dunkel' : null), ...glied([[hx + 9 + dx, hy + 48 - (p.tod ? r(p.q * 18) : 0)], [hx + 4 + dx, 112], [hx - 4 + dx, 114]], 1.5, 1.1, dunkel ? 'dunkel' : null)];
    const beinH = bein(5, true), beinV = bein(0, false);
    // Arme: lang, fast gerade, Hand flach auf dem Boden, Finger nach vorn
    const al = v.arm;
    const arm = (dx, dunkel) => {
      const sh = [ax + dx, ay + 2];
      let hand = [ax - 8 + dx - vor * 8, 113];
      if (hebe > 0) hand = [ax - 10 - hebe * 8 + dx, ay + 44 * al - hebe * 26];
      if (hebe < 0) hand = [ax - 16 + dx, 113];
      if (p.tod) hand = [ax - 10 + dx - p.q * 6, 113];
      const el = [(sh[0] + hand[0]) / 2 + 3, (sh[1] + hand[1]) / 2];
      const g = glied([sh, el, hand], 3, 1.5, dunkel ? 'dunkel' : null);
      const fing = [];
      for (let k = 0; k < 3; k++) fing.push(C(hand[0], hand[1], hand[0] - 5 - k, hand[1] + (hebe > 0 ? 3 - k * 2 : 0.5) - (k === 2 ? 1 : 0), 1, 0.7, dunkel ? 'dunkel' : null));
      return [...g, ...fing];
    };
    const armH = arm(5, true), armV = arm(0, false);
    // Rumpf: gebogener Rücken, hinten tiefer als vorne
    // Rumpf: mager, gebogener Rücken, die Wirbel stehen heraus
    const rumpf = Pg([[ax - 4, ay + 2], [ax + 1, ay - 5 - R * 0.4], [ax + 12, ay - 8 - R], [hx - 8, hy - 9 - R * 0.7], [hx + 3, hy - 5], [hx + 6, hy + 2], [hx, hy + 6], [hx - 10, hy + 3], [ax + 10, ay + 7], [ax, ay + 8]], null, { rd: 1.5 });
    const wirbel = [];
    for (let k = 0; k < 6; k++) { const q = k / 5, x = ax + 4 + (hx - ax - 6) * q, y = ay - 6 - R * 0.6 + (hy - ay - 4) * q - Math.sin(q * Math.PI) * (4 + R * 0.5); wirbel.push(E(x, y, 1.8, 1.6, null)); }
    // Hemdfetzen am Bauch
    const hemd = Pg([[ax + 6, ay + 6], [hx - 8, hy + 2], ...saum(hx - 8, ax + 6, hy + 6, 4, 3, 3, hem).map(([x, y]) => [x, y - (hx - x) * 0.12])], 'dunkel', { rd: 0.6 });
    // Hals und Kopf: weit im Nacken, Gesicht nach oben
    const ka = v.kopfA, kx = ax - 13 + nick * 0.5, ky = ay - 11 + nick;
    const hals = C(ax - 1, ay - 1, kx + 3, ky + 4, 4, 2.6, null);
    const kopf = Pg([[kx + 6, ky + 3], [kx + 3, ky - 4], [kx - 3, ky - 8 + ka * 2], [kx - 9, ky - 7 + ka * 3], [kx - 8, ky - 2], [kx - 3, ky + 3], [kx + 2, ky + 6]], 'haut', { rd: 1.2 });
    const kiefer = Pg([[kx - 2, ky + 2], [kx - 8 - mund * 0.5, ky + 1 + mund * 1.6], [kx - 4, ky + 6 + mund], [kx + 1, ky + 6]], 'haut', { rd: 0.6 });
    // Wachsbein an einer Schnur
    const vbx = ax - 3 + r(sx * 0.1), vby = ay + 14;
    const votiv = p.tod && f > 2 ? [] : [C(vbx, vby, vbx + 1, vby + 7, 1.6, 1.3, 'haut'), C(vbx + 1, vby + 7, vbx - 2, vby + 8, 1.1, 1, 'haut')];
    const kruecke = v.krueckenRest ? [C(hx + 10, hy - 18, hx + 4, hy + 6, 0.9, 0.9, 'dunkel', { pf: 'flat' }), C(hx + 6, hy - 18, hx + 14, hy - 18, 1.1, 1.1, 'dunkel', { pf: 'flat' })] : [];
    const gruppen = [
      { p: beinH, k: 1 },
      { p: armH, k: 1 },
      { p: kruecke, k: 0 },
      { p: [rumpf, hals, ...wirbel], k: 2, anker: [r(sx), r(sy)] },
      { p: [hemd], k: 1, noRim: false },
      { p: beinV, k: 1 },
      { p: [kopf, kiefer], k: 1.5 },
      { p: armV, k: 1 },
      { p: votiv, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Schnur
      P.line(ax - 2, ay + 2, vbx, vby - 1, 'r1');
      // Das Wachsbein ist warm
      if (votiv.length) { P.glow(vbx + 0.5, vby + 4, 7, 0.9, 'glutDim', 'k3'); P.set(vbx, vby + 2, 'wachs'); P.set(vbx + 1, vby + 5, 'wachs'); }
      // offener Mund, dunkel
      for (let k = 0; k < mund + 1; k++) { P.auf(kx - 5 - k * 0.3, ky + 2 + k, 'k0'); P.auf(kx - 4, ky + 2 + k, 'k0'); }
      // Augen: zwei schmale, nach oben gedrehte Schlitze
      if (!P0.aus) {
        const e1 = [kx - 3, ky - 3], e2 = [kx - 6, ky - 4];
        P.auge(e1[0], e1[1], 2); P.set(e2[0], e2[1], 'glut'); P.set(e2[0] - 1, e2[1], 'glutDim');
        augen.push([r(e1[0]), r(e1[1])], [r(e2[0]), r(e2[1])]);
      }
      // Rippen unter dem Hemd: drei Kerben
      for (let k = 0; k < 3; k++) P.auf(ax + 10 + k * 5, ay - 2 - R * 0.6 + k * 0.5, 'k1');
    };
    return { gruppen, details, augen };
  },
};
