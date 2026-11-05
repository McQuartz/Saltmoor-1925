// Leuchtturmhof, Wächter: Die Linse. Die Gürtellinse erster Ordnung, groß wie ein Zimmer, auf ihrem
// Quecksilberbad. Der Oberwärter ist im Winter 1917 hineingestiegen, um sie nach innen zu drehen, und
// nicht wieder herausgekommen. Durch das Glas sieht man ihn in Streifen, jeder Prismenring zeigt ein
// anderes Stück und keins passt zum nächsten. Das Ochsenauge in der Mitte vergrößert sein Auge.
// Es dreht sich. Wenn es dich ansieht, ist es ein Strahl.
'use strict';
const LIB = require('../lib');
module.exports = {
  id: 'linse', biom: 'leuchtturm', zone: 'leuchtturm', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 6], rimBis: 172,
  varianten: { linse: {} },
  // Probe (nicht gebaut): die Linse ohne Sockel, schwebend, las sich wie ein Bienenkorb oder eine Laterne.
  proben: { probe_ohne_sockel: { ohneSockel: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180;
    let dx = 0, dy = 0, dreh = 0, auge = 1, blitz = 0, fall = 0, riss = 0;
    if (p.idle) { dreh = f * 3; auge = [1, 1, 0.4, 1][f]; }
    if (p.angriff) { dx = [2, 4, -6, -2][f]; dy = [-1, -2, 0, 0][f]; dreh = [4, 8, 14, 16][f]; auge = [0.6, 0.15, 1.6, 1.1][f]; blitz = [0.3, 0.7, 1, 0.3][f]; }
    if (p.treffer) { dx = [3, 1][f]; auge = 0.5; }
    if (p.tod) { fall = r(p.q * 14); riss = p.q; auge = 0; dreh = 2; }
    const cx = 80 + dx, top = 16 + dy + fall, unten = 146 + fall * 0.3;
    // Umriss der Linse: Bienenkorb, oben und unten eingezogen, in der Mitte der Gürtel
    const bauch = y => { const q = (y - top) / (unten - top); return 30 + 26 * Math.sin(Math.PI * Math.min(1, Math.max(0, q * 0.92 + 0.04))); };
    const umriss = [];
    for (let y = top; y <= unten; y += 4) umriss.push([cx + bauch(y), y]);
    for (let y = unten; y >= top; y -= 4) umriss.push([cx - bauch(y), y]);
    const linse = Pg(umriss, null, { rd: 1.5 });
    // Krone: Ring und Lüftungshaube oben
    const krone = [Pg([[cx - 24, top + 2], [cx + 24, top + 2], [cx + 18, top - 6], [cx - 18, top - 6]], null, { rd: 1 }), E(cx, top - 8, 9, 4, null), C(cx, top - 10, cx, top - 16, 2, 1.4, null)];
    // Sockel: gusseiserne Säule, das Quecksilberbad als flacher Ring, Fuß
    const sockel = v.ohneSockel ? [] : [Pg([[cx - 40, unten - 2], [cx + 40, unten - 2], [cx + 36, unten + 6], [cx - 36, unten + 6]], 'dunkel', { rd: 1 }),
      Pg([[cx - 14, unten + 6], [cx + 14, unten + 6], [cx + 18, 166], [cx - 18, 166]], null, { rd: 1.5 }),
      Pg([[cx - 34, 166], [cx + 34, 166], [cx + 36, 176], [cx - 36, 176]], null, { rd: 1 })];
    const gruppen = [
      { p: sockel, k: 1 },
      { p: [linse], k: 0, pf: 'flat' },
      { p: krone, k: 1 },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('leuchtturm'), { rimBis: 172 });
    const augen = [];
    const details = P => {
      const inL = (x, y) => gid[y * W + x] === 1;
      const my = r(top + (unten - top) * 0.5), bR = 25; // Mitte des Ochsenauges
      // Prismenringe oben und unten: Bänder mit Lichtkante oben (rechts heller), Fuge unten
      const ringe = [];
      for (let y = top + 4; y < my - bR - 4; y += 7) ringe.push(y);
      for (let y = my + bR + 6; y < unten - 2; y += 7) ringe.push(y);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!inL(x, y)) continue; const c = P.get(x, y); if (c >= 5) continue;
        const u = (x - cx) / bauch(y); // -1..1 über die Breite
        // Glas: dunkel, zur Mitte etwas heller (die Lampe dahinter), zur Lichtseite rechts heller
        const lampe = Math.max(0, 1 - Math.hypot((x - cx) / 66, (y - my) / 80));
        let t = 0.25 + lampe * 1.05 + Math.max(0, u) * 0.12 - (p.tod ? p.q * 0.4 : 0) + (blitz > 0.5 ? 0.15 : 0) - (p.angriff && f === 1 ? 0.15 : 0);
        const bb = LIB.bay(x, y); let farbe = t > 0.95 + bb * 0.3 ? 'r1' : t > 0.62 + bb * 0.3 ? 'glutDim' : t > 0.36 + bb * 0.26 ? 'k3' : t > 0.2 + bb * 0.16 ? 'k2' : 'k1';
        P.set(x, y, farbe);
      }
      // Ringe zeichnen (gebogen: die Mitte etwas tiefer, wie von leicht unten gesehen)
      for (const y0 of ringe) {
        for (let x = 0; x < W; x++) {
          const u = (x - cx) / 56, yy = r(y0 + 2.2 * (1 - u * u)), oben = y0 < my;
          if (!inL(x, yy) || !inL(x, yy + 1)) continue;
          const rechts = x > cx + 10;
          P.set(x, yy, rechts ? 'r2' : 'r1');                // Kante des Prismas fängt Licht
          P.set(x, yy + 1, oben ? 'k3' : 'k0');
          if (inL(x, yy - 1)) P.set(x, yy - 1, 'k0');         // Fuge
          if (rechts && inL(x, yy + 2) && (x + y0) % 3 === 0) P.set(x, yy + 2, 'r1');
        }
      }
      // Messingrahmen: senkrechte Stäbe, die sich mit der Linse drehen (Abstand 26 px, wandern um dreh)
      for (let k = -4; k <= 4; k++) {
        const a = (k * 26 + dreh) / 56; if (Math.abs(a) > 0.95) continue;
        for (let y = top + 2; y < unten - 1; y++) { const x = r(cx + Math.sin(a * Math.PI / 2) * bauch(y)); if (!inL(x, y)) continue; P.set(x, y, a > 0.15 ? 'r1' : 'k0'); if (inL(x + 1, y)) P.set(x + 1, y, a > 0.15 ? 'k3' : 'k1'); if ((y - top) % 9 === 0) P.set(x, y, 'messing'); }
      }
      // Der Mann im Glas: sitzend, die Knie angezogen; jeder Prismenring zeigt sein Stück versetzt
      const figur = (x, y) => {
        const hx = cx - 2, hy = my - 40;
        if (Math.hypot(x - hx, (y - hy) * 0.9) < 8) return true;                       // Kopf
        if (y > hy + 6 && y < my + 16 && Math.abs(x - cx - (y - my) * 0.1) < 15 - Math.max(0, (hy + 14 - y)) * 0.8) return true; // Rumpf
        if (Math.hypot((x - cx + 18) / 7, (y - my - 26) / 9) < 1 || Math.hypot((x - cx - 14) / 7, (y - my - 24) / 9) < 1) return true; // Knie
        if (y > my - 20 && y < my + 14 && (Math.abs(x - cx + 22) < 4 || Math.abs(x - cx - 20) < 4)) return true; // Arme
        return false;
      };
      const versatz = [-7, 5, -3, 9, -10, 2, 7, -5, 4, -8];
      const bandVon = y => { let i = -1; for (let k = 0; k < ringe.length; k++) if (y > ringe[k] + 1) i = k; return i; };
      for (let y = top + 2; y < unten - 1; y++) for (let x = 0; x < W; x++) {
        if (!inL(x, y)) continue; const c = P.get(x, y); if (c > 4 && c !== 7) continue;
        if (Math.hypot(x + 0.5 - cx, y + 0.5 - my) < bR + 1) continue;
        const i = bandVon(y), o = i < 0 ? 0 : versatz[i % versatz.length] + (p.idle ? 0 : (i % 2 ? 1 : -1) * dreh * 0.2);
        if (figur(x - o, y)) P.set(x, y, figur(x - o + 1, y - 1) ? 'k0' : 'k2');
      }
      // zwei Hände, von innen gegen das Glas gedrückt (unten im Gürtel)
      for (const [hx, hy, s] of [[cx - 30, my + bR + 2, 1], [cx + 22, my + bR + 9, -1]]) {
        const X = r(hx), Y = r(hy);
        P.el(X, Y, 4, 3, 'k0', true); for (let k = 0; k < 4; k++) P.line(X - 3 + k * 2, Y - 2, X - 4 + k * 2 + s, Y - 7 - (k % 2), 'k0', true); P.line(X + 4 * s, Y, X + 7 * s, Y - 2, 'k0', true);
        P.auf(X - 3 + s, Y - 1, 'r1');
      }
      // Ochsenauge: konzentrische Ringe um ein vergrößertes Auge
      for (let y = my - bR - 1; y <= my + bR + 1; y++) for (let x = cx - bR - 1; x <= cx + bR + 1; x++) {
        if (!inL(x, y)) continue; const d = Math.hypot(x + 0.5 - cx, y + 0.5 - my); if (d > bR) continue;
        const ring = d % 5; const lichtSeite = (x - cx) - (y - my) > 0;
        if (ring < 1) P.set(x, y, lichtSeite ? 'r2' : 'r1'); else if (ring < 2) P.set(x, y, 'k0');
        else if (d > bR - 1.2) P.set(x, y, 'k0');
      }
      // das Auge des Wärters, vergrößert: Lid, Iris, Pupille aus Licht
      if (auge > 0 && (!p.tod || f < 1)) {
        const ew = 16, eh = Math.max(1, 9 * Math.min(1.2, auge));
        for (let y = r(my - eh); y <= my + eh; y++) for (let x = cx - ew; x <= cx + ew; x++) {
          const q = ((x + 0.5 - cx) / ew) ** 2 + ((y + 0.5 - my) / eh) ** 2; if (q > 1) continue;
          const d = Math.hypot(x + 0.5 - cx, (y + 0.5 - my) * 1.1);
          P.set(x, y, d < 2.2 ? 'kern' : d < 4.6 ? 'glut' : d < 7.5 ? (LIB.bay(x, y) < 0.7 ? 'glutDim' : 'glut') : d < 8.5 ? 'k0' : q > 0.82 ? 'k1' : (x - cx) - (y - my) * 2 > 6 ? 'r1' : 'k3');
        }
        // Lidfalte und Wimpern, groß wie Finger
        P.line(cx - ew, my - eh - 1, cx + ew, my - eh - 1, 'k0', true);
        for (let k = -3; k <= 3; k++) P.line(cx + k * 5, r(my - eh - 1), cx + k * 6, r(my - eh - 5), 'k0', true);
        P.line(cx - ew + 2, r(my + eh + 1), cx + ew - 2, r(my + eh + 1), 'k1', true);
        augen.push([cx, my]);
      } else if (!p.tod) { P.line(cx - 16, my, cx + 16, my, 'k0', true); P.set(cx, my, 'glut'); augen.push([cx, my]); }
      // Blitz (Angriff): die Lampe hinter dem Auge flammt auf, Lichtspeichen aus dem Ochsenauge
      if (blitz > 0.5) {
        P.glow(cx, my, 28 * blitz, 0.9);
        for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; for (let rr = bR - 2; rr < bR + 6 * blitz; rr++) P.auf(r(cx + Math.cos(a) * rr), r(my + Math.sin(a) * rr), k % 2 ? 'glutDim' : 'r2'); }
        P.set(cx - 1, my, 'kern'); P.set(cx + 1, my, 'kern'); P.set(cx, my - 1, 'kern'); P.set(cx, my + 1, 'kern');
      }
      // Krone: Lüftungsschlitze, Messingknopf
      for (let x = cx - 14; x <= cx + 14; x += 4) P.auf(x, r(top - 2), 'k0');
      P.auf(cx, r(top - 16), 'messing');
      // Quecksilberbad: eine helle, glatte Linie (das Quecksilber spiegelt die Lampe)
      if (!v.ohneSockel) { for (let x = cx - 36; x <= cx + 36; x++) { P.auf(x, r(unten), x > cx ? 'r2' : 'r1'); if ((x - cx) % 11 === 0) P.auf(x, r(unten) + 3, 'messing'); } }
      // Tod: Risse im Glas
      if (riss > 0) for (let k = 0; k < 6; k++) { let x = cx + (k - 2.5) * 12, y = my; for (let s = 0; s < 18 * riss; s++) { x += Math.sin(k * 3 + s) * 1.5; y += (k % 2 ? 1 : -1) * 2; P.auf(r(x), r(y), 'r1'); } }
    };
    return { gruppen, details, augen };
  },
};
