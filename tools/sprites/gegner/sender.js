// Die Funkstation am Pol, Wächter: Der Sender. Der Röhrensender der Station, ein Schrank aus Bakelit und Eiche
// so hoch wie zwei Männer, auf dem eine Kupferspule sitzt wie eine Krone. Aus ihm wächst ein Schalltrichter, der
// sich zu dir dreht wie ein Kopf; unten laufen seine Kabel wie Wurzeln in den Boden und weiter ins Eis. Hinter
// dem Gitter glühen die Röhren in Reihen. Er sendet nicht. Er antwortet.
// Phase 2 (sender_p2, „Die Stimme“): Die Türen springen auf. Innen sitzen die Röhren in einem Brustkorb aus
// Kupfer, und in der Mitte, wo die große Senderöhre sein sollte, ist ein Gesicht hinter Glas, das spricht.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'sender', biom: 'funkstation', zone: 'funkstation', w: 160, h: 180, fuss: [88, 174], kopf: [90, 6], rimBis: 168, rang: 'waechter',
  todStart: 0.2,
  varianten: {
    sender: { offen: false },
    sender_p2: { offen: true },
  },
  // Silhouetten-Probe (nicht gebaut): Schrank ohne Trichter (ein Kasten, ein Möbel, nichts schaut dich an);
  // genommen: Schrank mit Spulenkrone, Trichter wie ein Kopf, Kabelwurzeln.
  proben: { probe_kasten: { offen: false, ohneTrichter: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let dx = 0, dy = 0, fall = 0, hw = 0, hx = 0, blitz = 0, ganz = 0;
    // hw: Drehung des Trichters (negativ = aufgerichtet, positiv = zu dir hinab), hx: Stoß nach vorn
    if (p.idle) { ganz = 0; hw = [0, 0.015, 0.03, 0.015][f]; }
    if (p.angriff) { dx = [2, 4, -6, -2][f]; hw = [-0.25, -0.5, 0.28, 0.1][f]; hx = [0, 2, -8, -3][f]; blitz = [0, 1, 2, 0][f]; }
    if (p.treffer) { dx = [3, 1][f]; hw = [-0.1, -0.05][f]; }
    if (p.tod) { fall = r(p.q * 30); hw = p.q * 0.6; }
    const X = (x) => x + dx, Y = (y) => y + dy + fall + ganz;
    // Schrank: Front, rechte Seite (schräg), Deckplatte; vier kurze gedrechselte Beine
    const fx0 = 64, fx1 = 122, fy0 = 50, fy1 = 148, mx0 = (fx0 + fx1) / 2;
    const front = Pg([[X(fx0), Y(fy0)], [X(fx1), Y(fy0)], [X(fx1), Y(fy1)], [X(fx0), Y(fy1)]], null, { rd: 1.5 });
    const seite = Pg([[X(fx1), Y(fy0)], [X(fx1 + 12), Y(fy0 - 7)], [X(fx1 + 12), Y(fy1 - 6)], [X(fx1), Y(fy1)]], 'dunkel', { rd: 1 });
    const deckel = Pg([[X(fx0 - 3), Y(fy0)], [X(fx0 + 9), Y(fy0 - 8)], [X(fx1 + 15), Y(fy0 - 8)], [X(fx1 + 3), Y(fy0)], [X(fx1 + 3), Y(fy0 + 4)], [X(fx0 - 3), Y(fy0 + 4)]], null, { rd: 0.8 });
    const sockel = Pg([[X(fx0 - 3), Y(fy1 - 4)], [X(fx1 + 3), Y(fy1 - 4)], [X(fx1 + 14), Y(fy1 - 10)], [X(fx1 + 14), Y(fy1 - 5)], [X(fx1 + 3), Y(fy1 + 2)], [X(fx0 - 3), Y(fy1 + 2)]], null, { rd: 0.8 });
    const beine = [[fx0 + 4, 0], [fx1 - 4, 0], [fx1 + 10, -5]].map(([x, o]) => [C(X(x), Y(fy1 + 2 + o), X(x), Y(fy1 + 12 + o), 3, 2.2, null), E(X(x), Y(fy1 + 12 + o), 3.4, 2, null)]).flat();
    // Krone: Kupferspule auf drei Isolatoren, darüber ein Stab mit Kugel
    const kx = mx0 + 5, ky = 26;
    const spule = []; for (let i = 0; i < 7; i++) spule.push(...H0.ring(C, X(kx), Y(ky - 12 + i * 4), 15 - Math.abs(i - 3) * 0.6, 3.2, -0.06, 1.1, 22));
    spule.push(C(X(kx), Y(ky - 15), X(kx), Y(ky + 14), 1.8, 1.8, null));
    const isol = [-12, 0, 12].map(o => [C(X(kx + o), Y(ky + 13), X(kx + o), Y(fy0 - 7), 2.2, 2.6, null)]).flat();
    const stab = [C(X(kx + 4), Y(ky - 11), X(kx + 6), Y(ky - 22), 0.9, 0.7, null), E(X(kx + 6), Y(ky - 23), 2.4, 2.4, null)];
    // Trichter: Rohr aus der linken Flanke, biegt nach links und weitet sich; dreht sich um den Ansatz
    const piv = [X(fx0 + 8), Y(fy0 - 2)];
    const rot = ([x, y]) => { const a = hw, ux = x - piv[0], uy = y - piv[1]; return [piv[0] + ux * Math.cos(a) - uy * Math.sin(a) + hx, piv[1] + ux * Math.sin(a) + uy * Math.cos(a)]; };
    const rohrPts = [[X(fx0 + 8), Y(fy0 + 2)], [X(fx0 + 4), Y(fy0 - 12)], [X(fx0 - 4), Y(fy0 - 24)], [X(fx0 - 16), Y(fy0 - 30)], [X(fx0 - 27), Y(fy0 - 26)], [X(fx0 - 33), Y(fy0 - 17)]].map(rot);
    const rohr = glied(rohrPts, 4.2, 3.4, null);
    const sc = v.offen ? 1.18 : 1;
    // Kegel entlang der Achse vom Halsende nach links unten, Mündung senkrecht dazu
    const e0 = rohrPts[rohrPts.length - 1], ang = 2.0 + hw, dxA = Math.cos(ang), dyA = Math.sin(ang), nxA = -dyA, nyA = dxA, Lk = 22 * sc, Bk = 17 * sc;
    const ende = [e0[0] + dxA * Lk, e0[1] + dyA * Lk];
    const kegel = Pg([[e0[0] + nxA * 3.5, e0[1] + nyA * 3.5], [ende[0] + nxA * Bk, ende[1] + nyA * Bk], [ende[0] - nxA * Bk, ende[1] - nyA * Bk], [e0[0] - nxA * 3.5, e0[1] - nyA * 3.5]], null, { rd: 1 });
    const oeffPts = []; for (let i = 0; i < 20; i++) { const t = i / 20 * Math.PI * 2; oeffPts.push([ende[0] + nxA * Math.cos(t) * Bk + dxA * Math.sin(t) * 5, ende[1] + nyA * Math.cos(t) * Bk + dyA * Math.sin(t) * 5]); }
    const muendung = Pg(oeffPts, null, { rd: 0.5 });
    const oeff = ende;
    // Wurzeln: Kabel aus dem Sockel, die sich in den Boden krallen
    const wurzeln = [];
    [[fx0 + 2, -26, 0], [fx0 + 14, -12, 1], [fx0 + 30, -4, 2], [fx1 - 10, 10, 3], [fx1 + 2, 24, 4], [fx1 + 10, 34, 5]].forEach(([x, w, i]) => {
      const x0 = X(x), y0 = Y(fy1 + 1); const pts = [[x0, y0], [x0 + w * 0.3, y0 + 9], [x0 + w * 0.7, Y(168) + (i % 2)], [x0 + w + Math.sign(w || 1) * 4, 173]];
      wurzeln.push(...glied(pts, 2.4, 1.3, null));
    });
    const boden = [Pg([[18, 179], [30, 172], [56, 169], [90, 167], [124, 169], [146, 173], [156, 179]], null, { rd: 1.5 })];
    // Phase 2: Türen offen (links fast von vorn gesehen als schmale Platte, rechts aufgeklappt), innen Rippen
    const tueren = [], rippen = [];
    if (v.offen) {
      tueren.push(Pg([[X(fx0), Y(fy0 + 6)], [X(fx0 - 10), Y(fy0 + 12)], [X(fx0 - 10), Y(fy1 - 12)], [X(fx0), Y(fy1 - 6)]], null, { rd: 0.8 }));
      for (let i = 0; i < 5; i++) { const yy = fy0 + 18 + i * 14; rippen.push(...glied([[X(fx0 + 6), Y(yy + 4)], [X(fx0 + 16), Y(yy)], [X(fx0 + 29), Y(yy - 2)], [X(fx1 - 16), Y(yy)], [X(fx1 - 6), Y(yy + 4)]], 1.6, 1.6, null)); }
      rippen.push(C(X(mx0), Y(fy0 + 12), X(mx0), Y(fy1 - 10), 2.2, 2.2, null));
    }
    const glas = v.offen ? [E(X(mx0), Y(96), 15, 21, null)] : [];
    const gruppen = [
      { p: wurzeln.filter((_, i) => i % 3 !== 2), k: 1, kante: true },       // 0 Wurzeln hinten
      { p: boden, k: 1.5 },                                                  // 1 Boden (Schnee, Bretter)
      { p: [seite, ...beine], k: 0.5, kante: true },                         // 2 Seite, Beine
      { p: isol, k: 0.5, kante: true },                                      // 3 Isolatoren
      { p: [front], k: 0.5, kante: true },                                   // 4 Front
      { p: [deckel, sockel], k: 0.5, kante: true },                          // 5 Deckel, Sockel
      { p: [...spule, ...stab], k: 0.5, kante: true },                       // 6 Spule
      { p: rippen, k: 0.5, kante: true },                                    // 7 Rippen (Phase 2)
      { p: glas, k: 0, kante: true },                                        // 8 Glas mit Gesicht
      { p: tueren, k: 0.5, kante: true },                                    // 9 Tür
      { p: v.ohneTrichter ? [] : rohr, k: 1.5, kante: true },                // 10 Rohr
      { p: v.ohneTrichter ? [] : [kegel], k: 1, kante: true },               // 11 Kegel
      { p: v.ohneTrichter ? [] : [muendung], k: 0, kante: true },            // 12 Mündung
      { p: wurzeln.filter((_, i) => i % 3 === 2), k: 1, kante: true },       // 13 Wurzeln vorn
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('funkstation'), { rimBis: 168 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      H0.kapselLicht(P, isol, 'r1');
      const FX0 = r(X(fx0)), FX1 = r(X(fx1)), FY0 = r(Y(fy0)), FY1 = r(Y(fy1));
      // Front: Eichenrahmen (Fase), Füllungen, Maserung
      const rahmen = (x0, y0, x1, y1) => { P.line(x0, y0, x1, y0, 'r1', true); P.line(x1, y0, x1, y1, 'r1', true); P.line(x0, y1, x1, y1, 'k0', true); P.line(x0, y0, x0, y1, 'k0', true); };
      rahmen(FX0 + 3, FY0 + 6, FX1 - 3, FY1 - 6);
      for (let y = FY0 + 8; y < FY1 - 8; y += 3) for (let x = FX0 + 5; x < FX1 - 5; x++) if (gid[y * W + x] === 4 && LIB.bay(x * 3, y) < 0.12) P.auf(x, y, 'k1');
      if (!v.offen) {
        // Gitterfenster mit Röhren in drei Reihen; im Leerlauf glimmen sie der Reihe nach auf
        const gx0 = FX0 + 8, gx1 = FX1 - 8, gy0 = FY0 + 12, gy1 = FY0 + 50;
        for (let y = gy0; y <= gy1; y++) for (let x = gx0; x <= gx1; x++) P.auf(x, y, (x - gx0) % 4 === 0 ? 'k2' : 'k0');
        rahmen(gx0 - 1, gy0 - 1, gx1 + 1, gy1 + 1);
        for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) {
          const tx = gx0 + 6 + i * 11, ty = gy0 + 5 + row * 12; const an = !aus && ((row + i + (p.idle ? f : 1)) % 4 !== 0);
          for (let y = ty; y < ty + 7; y++) for (let x = tx - 1; x <= tx + 1; x++) P.auf(x, y, x === tx - 1 || y === ty ? 'k1' : 'k3');
          if (an) { P.glow(tx + 0.5, ty + 3.5, 6, 0.7); P.set(tx, ty + 3, row === 1 && i === 1 ? 'kern' : 'glut'); P.set(tx, ty + 4, 'glut'); P.set(tx, ty + 2, 'glutDim'); P.set(tx, ty + 5, 'glutDim'); if (row === 1 && i === 1) augen.push([tx, ty + 3]); }
        }
        // Skalen: zwei runde Zifferblätter, der Zeiger steht immer auf dem Strich ganz unten
        { const cx = FX0 + 15, cy = FY0 + 64; P.el(cx + 0.5, cy + 0.5, 7, 7, 'k1', true); P.el(cx + 0.5, cy + 0.5, 5.6, 5.6, 'papier', true); for (let k = 0; k < 7; k++) { const a = 2.6 + k * 0.6; P.auf(r(cx + Math.cos(a) * 4.4), r(cy + Math.sin(a) * 4.4), 'k1'); } P.line(cx, cy, cx - 1, cy + 5, 'k0', true); P.auf(cx + 4, cy - 5, 'r1'); }
        // Schlitz des Schreibers, aus dem ein Papierstreifen bis auf den Boden hängt
        { const sx0 = FX1 - 22, sy0 = FY0 + 62; P.line(sx0, sy0, sx0 + 12, sy0, 'k0', true); for (let y = sy0 + 1; y < 170; y++) { const x = sx0 + 4 + r(Math.sin((y - sy0) * 0.12) * 2 + (y > 150 ? (y - 150) * 0.4 : 0)); for (let k = 0; k < 3; k++) { const c = (y + k) % 7 === 0 ? 'k0' : k === 2 ? 'r1' : 'k3'; if (gid[y * W + x + k] !== 13) P.set(x + k, y, c); } } }
        // Drehknöpfe aus Bakelit mit Kupferkappe, Messingschild
        for (let i = 0; i < 4; i++) { const x = FX0 + 12 + i * 10, y = FY0 + 82; P.el(x + 0.5, y + 0.5, 2.6, 2.6, 'k0', true); P.auf(x + 1, y - 1, 'kupfer'); }
      } else {
        // innen: dunkel, die Rippen fangen das Licht der Röhren; Röhren auf den Rippen
        for (let y = FY0 + 6; y < FY1 - 6; y++) for (let x = FX0 + 4; x < FX1 - 4; x++) if (gid[y * W + x] === 4) P.set(x, y, LIB.bay(x, y) < 0.3 ? 'k1' : 'k0');
        H0.kapselLicht(P, rippen, 'kupfer');
        for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) { if (i === 2) continue; const tx = r(X(mx0 + sx * 18)), ty = r(Y(fy0 + 12 + i * 14)); if (!aus && (i + (p.idle ? f : 0) + (sx > 0 ? 1 : 0)) % 3 !== 0) { P.glow(tx + 0.5, ty + 2, 6, 0.8); P.set(tx, ty + 1, 'glut'); P.set(tx, ty + 2, 'glut'); P.set(tx, ty, 'glutDim'); } else { P.auf(tx, ty + 1, 'k3'); P.auf(tx, ty + 2, 'k3'); } }
        // Glas: dunkel, mit Spiegelung oben rechts; darin ein Gesicht, das spricht
        const gx = r(X(mx0)), gy = r(Y(96));
        for (let y = gy - 21; y <= gy + 21; y++) for (let x = gx - 15; x <= gx + 15; x++) if (gid[y * W + x] === 8) { const q = Math.hypot((x - gx) / 15, (y - gy) / 21); P.set(x, y, q > 0.9 ? 'k2' : 'k0'); }
        if (!aus) {
          P.glow(gx + 0.5, gy + 2, 16, 0.85);
          // Gesicht: Stirn, Augenhöhlen, Nase, Mund offen (je nach Bild weiter)
          P.el(gx + 0.5, gy, 9, 13, 'k3', true); P.el(gx + 0.5, gy - 4, 7, 7, 'r1', true); P.el(gx + 1.5, gy - 5, 4, 4, 'r2', true); for (const ex of [gx - 4, gx + 4]) P.el(ex + 0.5, gy - 2.5, 2.4, 2.8, 'k0', true);
          for (const ex of [gx - 3, gx + 3]) { P.set(ex, gy - 2, 'k0'); P.set(ex + (ex < gx ? 0 : 0), gy - 3, 'k1'); }
          P.set(gx - 4, gy - 2, 'kern'); P.set(gx + 4, gy - 2, 'glut'); augen.push([gx - 4, gy - 2]);
          P.set(gx, gy + 1, 'k1'); const m = p.angriff ? [1, 2, 3, 1][f] : p.idle ? [1, 1, 2, 1][f] : 1;
          P.line(gx, gy + 1, gx - 1, gy + 3, 'k1'); for (let j = 0; j < m + 1; j++) P.line(gx - 3, gy + 6 + j, gx + 3, gy + 6 + j, j === m ? 'k0' : 'glutDim');
          P.auf(gx + 8, gy - 12, 'r2'); P.auf(gx + 9, gy - 10, 'r1'); P.auf(gx + 7, gy - 13, 'r1');
        }
        // offene Tür: Füllung, Scharnier aus Kupfer
        P.auf(FX0 - 1, FY0 + 10, 'kupfer'); P.auf(FX0 - 1, FY1 - 10, 'kupfer');
      }
      // Spule: Windungen aus Kupfer, schräg, die lichtzugewandte Hälfte hell
      const KX = r(X(kx)), KY = r(Y(ky));
      H0.kapselLicht(P, spule.filter((k, i) => k.t === 'c' && k.r1 < 1.5 && i % 3 === 0), 'kupfer'); H0.kapselLicht(P, spule.filter((k, i) => k.t === 'c' && k.r1 < 1.5 && i % 3 !== 0), 'r1'); void KX; void KY;
      if (!aus) { const sx = r(X(kx + 6)), sy = r(Y(ky - 23)); P.glow(sx + 0.5, sy + 0.5, 7, 0.8); P.set(sx, sy, 'kern'); P.set(sx + 1, sy, p.idle && f % 2 ? 'glut' : 'glutDim'); augen.push([sx, sy]); }
      // Funken zwischen Spule und Stab im Angriff
      if (blitz && !aus) { let x = r(X(kx - 16)), y = r(Y(ky - 4)); for (let i = 0; i < 9; i++) { P.set(x, y, i % 3 ? 'glut' : 'kern'); x -= 2; y += (i % 2 ? 1 : -1) * blitz; } }
      // Trichter: Mündung innen dunkel, tief drin glimmt die Stimme; Rand der Mündung hell
      if (!v.ohneTrichter) {
        const OX = r(oeff[0] - dxA * 2), OY = r(oeff[1] - dyA * 2);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === 12) { const u = ((x + 0.5 - ende[0]) * nxA + (y + 0.5 - ende[1]) * nyA) / Bk, w2 = ((x + 0.5 - ende[0]) * dxA + (y + 0.5 - ende[1]) * dyA) / 5; const q = Math.hypot(u, w2); P.set(x, y, q > 0.8 ? (u * nxA + w2 * dxA * 0 < 0 ? 'r1' : 'k3') : q > 0.55 ? 'k1' : 'k0'); }
        if (!aus) { const st = p.angriff ? [0.6, 0.8, 1.3, 0.9][f] : 0.7; P.glow(OX + 2.5, OY + 0.5, 9 * st, 0.8); P.set(OX + 2, OY, 'glut'); P.set(OX + 1, OY, 'glutDim'); P.set(OX + 2, OY - 1, 'glutDim'); if (p.angriff && f === 2) { P.set(OX + 1, OY, 'kern'); P.set(OX, OY - 1, 'glut'); P.set(OX, OY + 1, 'glut'); } augen.push([OX + 2, OY]); }
        // Kegel: Ringe (Falze) aus Kupfer
        for (const t of [0.35, 0.7]) { const c = [e0[0] + dxA * Lk * t, e0[1] + dyA * Lk * t], bw = 3.5 + (Bk - 3.5) * t; P.line(r(c[0] + nxA * bw), r(c[1] + nyA * bw), r(c[0] - nxA * bw), r(c[1] - nyA * bw), 'k1', true); P.line(r(c[0] + nxA * bw) + 1, r(c[1] + nyA * bw), r(c[0] - nxA * bw) + 1, r(c[1] - nyA * bw), 'kupfer', true); }
      }
      // Wurzeln: Kupferglanz an der Lichtkante
      H0.kapselLicht(P, wurzeln, 'k3');
      // Boden: Bretter, Reif
      for (let x = 22; x < 152; x += 6) P.auf(x, 172 + (x % 4 ? 0 : 1), 'k0');
      for (let x = 30; x < 146; x += 3) { let y = 164; while (y < H && gid[y * W + x] !== 1) y++; if (y < H) P.set(x, y, (x * 7) % 5 < 2 ? 'r1' : 'k3'); }
    };
    return { gruppen, details, augen, dy: 0 };
  },
};
