// Wächter Ziegelgruben: Der Brennofen. Ein Flaschenofen aus Ziegeln mit eisernen Bändern, krummem Schornstein
// und zwei Armen aus gemauerten Lagen, die bis zum Boden hängen und in Ziegelzangen enden. Über der Feuertür
// zwei Schaulöcher, die dich ansehen. Phase 1: Die eiserne Feuertür ist zu, Glut steht in den Fugen.
// Phase 2 (Sheet brennofen_glut, „Weißglut“): Die Tür springt auf, und in der weißen Glut steht ein Gesicht,
// das nicht verbrennt. In jedem Ziegel der Abdruck.
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
const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

module.exports = {
  id: 'brennofen', biom: 'ziegelgruben', zone: 'ziegelgruben', rang: 'waechter', w: 160, h: 180, fuss: [80, 174], kopf: [76, 6], rimBis: 176,
  varianten: { brennofen: { offen: false }, brennofen_glut: { offen: true } },
  // Silhouetten-Probe (verworfen): eine Kuppel ohne Hals (Bienenkorbofen) las sich neben der Ungetauften aus der
  // Glockengießerei wie eine zweite Glocke. Die Flasche mit schiefem Hals und den langen Armen ist eigen.
  proben: { probe_kuppel: { offen: false, kuppel: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let arm = 0, schlag = 0, fall = 0, lodern = 0, dx = 0, kipp = 0;
    // arm: 0 Ruhe, 1 ausgeholt (vorderer Arm hoch hinter der Schulter), 2 geschlagen (vorn am Boden)
    if (p.idle) { arm = [0, 0.08, 0.12, 0.05][f]; lodern = f; }
    if (p.angriff) { arm = [0.6, 1, 2, 1.4][f]; lodern = [1, 2, 3, 2][f]; dx = [2, 3, -5, -2][f]; }
    if (p.treffer) { dx = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 22); kipp = p.q; }
    const cx = 82, T = fall;
    // Profil der Flasche: Halbbreite je Höhe (y von oben). Sockel 150–172, Bauch bei 104, Schulter 58, Hals bis 14
    const prof = y => {
      if (v.kuppel) { if (y < 40) return -1; if (y > 150) return 50; const q = (y - 40) / 110; return 50 * Math.sqrt(Math.max(0, 1 - (1 - q) * (1 - q))); }
      if (y < 12) return -1;
      if (y < 22) return 11; // Lippe
      if (y < 46) return 9 + (y - 22) * 0.12; // Hals
      if (y < 100) { const q = (y - 46) / 54; return 12 + 29 * (1 - Math.cos(q * Math.PI)) / 2 + 4 * Math.sin(q * Math.PI); }
      if (y < 150) { const q = (y - 100) / 50; return 41 + 2 * Math.sin(q * Math.PI) - 4 * q * q; }
      return 40;
    };
    // Hals schief: oben nach links versetzt
    const versatz = y => (y < 46 ? -(46 - y) * 0.34 - kipp * (46 - y) * 0.6 : 0);
    const umriss = [];
    for (let y = 12; y <= 172; y += 2) { const w = prof(y); if (w > 0) umriss.push([cx + versatz(y) + w + (y >= 150 ? 3 : 0), y + T]); }
    for (let y = 172; y >= 12; y -= 2) { const w = prof(y); if (w > 0) umriss.push([cx + versatz(y) - w - (y >= 150 ? 3 : 0), y + T]); }
    const leib = Pg(umriss, null, { rd: 1.5, b: 5 });
    const lippe = Pg([[cx + versatz(12) - 14, 12 + T], [cx + versatz(12) + 13, 12 + T], [cx + versatz(18) + 13, 18 + T], [cx + versatz(18) - 14, 18 + T]], null, { rd: 1, b: 2 });
    // Sockel als eigene, vorspringende Lage
    const sockel = Pg([[cx - 46, 152 + T], [cx + 46, 152 + T], [cx + 48, 172], [cx - 48, 172]], null, { rd: 1.2, b: 3 });
    // eiserne Bänder (als schmale Ringe vor dem Leib)
    const baender = [70, 100, 132].map(y => { const w = prof(y) + 1.5; return Pg([[cx - w, y - 2 + T], [cx, y - 5 + T], [cx + w, y - 2 + T], [cx + w, y + 1 + T], [cx, y - 2 + T], [cx - w, y + 1 + T]], 'dunkel', { rd: 0.6, b: 1.2 }); });
    // Arme aus gemauerten Lagen: Schulter → Ellbogen → Zange; vorn (links) schlägt, hinten (rechts) hängt
    const shV = [cx - 28, 70 + T], shH = [cx + 28, 70 + T];
    let elV, haV;
    if (arm < 0.5) { elV = [cx - 64 - arm * 10, 106 + T]; haV = [cx - 56 - arm * 20, 158 + T - arm * 40]; }
    else if (arm <= 1) { const q = (arm - 0.5) * 2; elV = [cx - 50 + q * 4, 70 - q * 30 + T]; haV = [cx - 40 + q * 10, 36 - q * 22 + T]; }
    else if (arm < 1.7) { elV = [cx - 62, 104 + T]; haV = [cx - 72, 150 + T]; }
    else { elV = [cx - 64, 96 + T]; haV = [cx - 74, 166]; }
    const elH = [cx + 62, 104 + T], haH = [cx + 56 + (p.idle ? r(arm * 10) : 0), 158 + T + (p.tod ? 6 : 0)];
    const armV = glied([shV, elV, haV], 7.5, 5.5, null);
    const armH = glied([shH, elH, haH], 7, 5, null);
    // Zangen: zwei eiserne Schenkel am Ende jedes Arms
    const zange = (h, e, auf) => { const a = Math.atan2(h[1] - e[1], h[0] - e[0]); const L2 = 14; const out = [];
      for (const s of [-1, 1]) { const b = a + s * (0.25 + auf * 0.25); const m = [h[0] + Math.cos(b) * L2 * 0.6, h[1] + Math.sin(b) * L2 * 0.6]; const t = [h[0] + Math.cos(a) * L2, h[1] + Math.sin(a) * L2]; out.push(C(h[0], h[1], m[0], m[1], 1.6, 1.4, 'dunkel'), C(m[0], m[1], t[0] + s * 1.5 * Math.cos(a + Math.PI / 2), t[1] + s * 1.5 * Math.sin(a + Math.PI / 2), 1.4, 1.1, 'dunkel')); }
      return out; };
    const zV = zange(haV, elV, arm >= 1.7 ? 0 : 1), zH = zange(haH, elH, 0.4);
    const hinterV = arm > 0.5 && arm < 1.7; // ausgeholt: der vordere Arm liegt hinter dem Leib
    const gArmV = { p: [...armV, ...zV], k: 1.5, kante: true };
    const gruppen = [
      ...(hinterV ? [gArmV] : []),
      { p: [...armH, ...zH], k: 1.5, kante: true },
      { p: [leib], k: 0 },
      { p: [lippe], k: 0, kante: true },
      { p: [sockel], k: 0, kante: true },
      { p: baender, k: 0, kante: true },
      ...(hinterV ? [] : [gArmV]),
    ];
    const LEIB = gruppen.findIndex(g => g.p[0] === leib), SOCKEL = gruppen.findIndex(g => g.p[0] === sockel);
    const ARME = [gruppen.indexOf(gArmV), hinterV ? 1 : 0];
    gruppen.forEach(g => { g.anker = [0, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('ziegelgruben'), { rimBis: 176 });
    const augen = [];
    // Er beugt sich zu dir: das ganze Bild wird oberhalb des Sockels nach links geschert (oben 9 px)
    const SCHER = P => { for (let y = 0; y < 152; y++) { const d = -r((152 - y) * 0.06); if (!d) continue; const row = []; for (let x = 0; x < W; x++) row.push(P.get(x, y)); for (let x = 0; x < W; x++) { const sx = x - d; if (sx >= 0 && sx < W && row[sx]) P.set(x, y, row[sx]); else P.loesch(x, y); } } };
    const details = P => {
      const ist = (x, y, g) => gid[r(y) * W + r(x)] === g;
      const istArm = (x, y) => ARME.includes(gid[r(y) * W + r(x)]);
      // Mauerwerk: Lagen als Bögen (Untersicht: die Mitte höher), Stoßfugen im Verband, nach außen enger;
      // die Oberkante jeder Lage fängt Licht, in manchen Ziegeln der Abdruck
      for (let y0 = 22; y0 < 150; y0 += 5) {
        const w = prof(y0 + 2); if (w <= 0) continue; const vs = versatz(y0);
        for (let x = r(cx + vs - w); x <= r(cx + vs + w); x++) {
          const u = (x - cx - vs) / w; if (Math.abs(u) > 1) continue; const y = r(y0 + T - (1 - u * u) * 2.5);
          if (!ist(x, y, LEIB) || P.get(x, y) > 4) continue; P.set(x, y, 'k0');
          if (ist(x, y + 1, LEIB) && P.get(x, y + 1) <= 4 && u > -0.6 && LIB.bay(x, y + 1 - T) < 0.6) P.set(x, y + 1, 'k3');
        }
        const lage = (y0 / 5) | 0;
        for (let k = -6; k <= 6; k++) {
          const th = (k + (lage % 2) * 0.5) / 6.5 * 1.45; if (Math.abs(th) > 1.45) continue;
          const x = r(cx + vs + Math.sin(th) * w); const yy = r(y0 + T - (1 - Math.sin(th) ** 2) * 2.5);
          for (let j = 1; j < 5; j++) if (ist(x, yy + j, LEIB) && P.get(x, yy + j) <= 4) P.set(x, yy + j, 'k0');
          if (hash(k, lage) > 0.72) { const fx = r(cx + vs + Math.sin(th + 0.12) * w), fy = yy + 2; if (ist(fx, fy, LEIB) && P.get(fx, fy) <= 4) { P.set(fx, fy, 'ziegel'); if (P.get(fx + 1, fy) <= 4) P.set(fx + 1, fy, 'k0'); } }
        }
      }
      // Arme: Lagen quer zum Arm
      for (const [a0, a1, a2] of [[shV, elV, haV], [shH, elH, haH]]) for (const [s, e] of [[a0, a1], [a1, a2]]) {
        const L2 = Math.hypot(e[0] - s[0], e[1] - s[1]), ux = (e[0] - s[0]) / L2, uy = (e[1] - s[1]) / L2;
        for (let t = 3; t < L2; t += 4) for (let k = -9; k <= 9; k += 0.5) { const x = s[0] + ux * t - uy * k, y = s[1] + uy * t + ux * k; if (istArm(x, y) && P.get(r(x), r(y)) <= 4) P.set(x, y, 'k0'); }
        for (let t = 5; t < L2; t += 8) { const x = s[0] + ux * t, y = s[1] + uy * t; if (istArm(x, y) && P.get(r(x), r(y)) <= 4) P.set(x, y, 'k0'); }
      }
      // Bänder: Nieten
      for (const y of [70, 100, 132]) { const w = prof(y); for (let u = -0.9; u <= 0.9; u += 0.15) { const x = r(cx + u * w), yy = r(y - 2 + T - (1 - u * u) * 3); if (P.get(x, yy)) P.set(x, yy, u > 0 ? 'r1' : 'k3'); } }
      // Sockel: Fugen
      for (let x = cx - 54; x <= cx + 54; x += 7) for (let y = 153 + T; y < 172; y++) if (ist(x + ((y >> 2) % 2) * 3, y, SOCKEL) && P.get(x + ((y >> 2) % 2) * 3, y) <= 4) P.set(x + ((y >> 2) % 2) * 3, y, 'k0');
      for (let y = 156 + T; y < 172; y += 4) for (let x = cx - 55; x <= cx + 55; x++) if (ist(x, y, SOCKEL) && P.get(x, y) <= 4) P.set(x, y, 'k0');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kräftiges Randlicht außen: zur Lichtseite zwei Pixel, ringsum eine Linie (er steht vor der hellen Aschewand)
      {
        const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < 174; y++) for (let x = 0; x < W; x++) {
          const c = P.get(x, y); if (c < 1 || c > 5) continue;
          if (leer(x + 1, y - 1) || leer(x + 1, y)) z.push([x, y, 'r2']);
          else if (leer(x, y - 1) || leer(x + 2, y) || leer(x + 2, y - 1)) z.push([x, y, 'r1']);
          else if ((leer(x - 1, y) || leer(x - 1, y + 1)) && LIB.bay(x, y) < 0.75) z.push([x, y, 'r1']);
        }
        for (const [x, y, c] of z) P.set(x, y, c);
      }
      // Glut in den Fugen: an der Lichtseite und um die Tür; mit lodern wandert sie
      const glutMenge = v.offen ? 0.5 : 0.28;
      for (let y0 = 107; y0 < 150; y0 += 5) { const lage = (y0 / 5) | 0; for (let k = -6; k <= 6; k++) { if (hash(k + lodern, lage) > glutMenge) continue; const th = (k + (lage % 2) * 0.5) / 6.5 * 1.45; const w = prof(y0); const x = r(cx + Math.sin(th) * w), yy = r(y0 + T - (1 - Math.sin(th) ** 2) * 2.5) + 2; if (ist(x, yy, LEIB) && P.get(x, yy) === 1) P.set(x, yy, 'glutDim'); } }
      // Feuertür: Rundbogen unten in der Mitte
      const tx = cx, ty = 168 + T, tw = 19, th2 = 40;
      const inTor = (x, y) => { const dy = ty - y; if (dy < 0 || dy > th2) return false; const rr = dy > th2 - tw ? Math.hypot(x + 0.5 - tx, (dy - (th2 - tw))) <= tw : Math.abs(x + 0.5 - tx) <= tw; return rr; };
      const glu = p.tod ? Math.max(0, 1 - p.q * 1.6) : 1;
      // Bogen aus Bindern: helle Kante (Ziegelrot) um die Öffnung
      for (let y = ty - th2 - 4; y <= ty; y++) for (let x = tx - tw - 4; x <= tx + tw + 4; x++) { if (inTor(x, y)) continue; const nah = inTor(x + 2, y) || inTor(x - 2, y) || inTor(x, y + 2) || inTor(x + 2, y + 2) || inTor(x - 2, y + 2); if (nah && P.get(x, y)) P.set(x, y, (Math.atan2(y - ty + th2 - tw, x - tx) * 6 | 0) % 2 ? 'ziegel' : 'k1'); }
      if (!v.offen) {
        // geschlossen: eiserne Tür, genietet, mit glühendem Spalt ringsum und einem Gitter unten (der Mund)
        for (let y = ty - th2; y <= ty; y++) for (let x = tx - tw; x <= tx + tw; x++) {
          if (!inTor(x, y)) continue; const rand = !inTor(x - 1, y) || !inTor(x + 1, y) || !inTor(x, y - 1);
          if (rand) { P.set(x, y, glu > 0.3 ? (hash(x, y + lodern) > 0.5 ? 'glut' : 'glutDim') : 'k0'); continue; }
          let c = x > tx + 4 ? 'k3' : 'k2'; if ((x - tx + 40) % 9 === 0 || (y - ty + 40) % 10 === 0) c = 'k0'; if ((x - tx + 40) % 9 === 1 && (y - ty + 40) % 10 === 2) c = 'r1';
          P.set(x, y, c);
        }
        // Gitter (Zugloch) unten: Schlitze mit Glut, wie Zähne
        if (glu > 0.2) for (let i = -3; i <= 3; i++) for (let y = ty - 7; y <= ty - 2; y++) { const x = tx + i * 4; P.set(x, y, Math.abs(i) <= 1 && y > ty - 6 ? 'glut' : 'glutDim'); }
        if (glu > 0.2) { P.glow(tx, ty - 4, 16, 0.5 * glu, 'glutDim', 'k3'); augen.push([tx, ty - 4]); }
      } else {
        // offen: weiße Glut, darin ein Gesicht (Stirn, Augenhöhlen, Nase, offener Mund) aus dunklerer Glut
        const gx = tx - 2, gy = ty - 20;
        for (let y = ty - th2; y <= ty; y++) for (let x = tx - tw; x <= tx + tw; x++) {
          if (!inTor(x, y)) continue; const rand = !inTor(x - 2, y) || !inTor(x + 2, y) || !inTor(x, y - 2);
          const u = (x - gx) / 11, w2 = (y - gy) / 14; const imKopf = u * u + w2 * w2 < 1;
          const auge = y === gy - 3 && (Math.abs(x - gx + 4.5) < 2.5 || Math.abs(x - gx - 4.5) < 2.5); // geschlossen, ruhig
          const mund = (y === gy + 7 && Math.abs(x - gx) < 4) || (y === gy + 8 && Math.abs(x - gx) < 2);
          const nase = (x === gx + 1 && y > gy - 2 && y < gy + 4) || (y === gy + 4 && x >= gx - 1 && x <= gx + 1); const wange = Math.abs(u) > 0.7 && w2 > -0.2 && w2 < 0.5;
          let c;
          if (glu < 0.3) c = rand ? 'k0' : 'k1';
          else if (rand) c = 'glutDim';
          else if (imKopf) c = auge || mund || nase ? 'glutDim' : wange ? (LIB.bay(x, y) < 0.5 ? 'glut' : 'glutDim') : (LIB.bay(x, y) < 0.12 ? 'kern' : LIB.bay(x, y) < 0.62 ? 'glut' : 'glutDim');
          else if (u * u + w2 * w2 < 1.35) c = 'glutDim';
          else c = LIB.bay(x + lodern, y) < 0.1 ? 'kern' : LIB.bay(x + lodern, y) < 0.36 ? 'glut' : 'glutDim';
          P.set(x, y, c);
        }
        if (glu >= 0.3) { P.set(gx - 5, gy - 3, 'glutDim'); P.set(gx + 4, gy - 3, 'glutDim'); augen.push([gx - 4, gy - 3], [gx + 3, gy - 3]); }
        // die Tür hängt aufgesprungen links am Rahmen (eine eiserne Platte, schräg)
        for (let y = ty - th2 + 6; y <= ty; y++) for (let k = 0; k < 6; k++) { const x = tx - tw - 3 - k - r((ty - y) * 0.05); P.set(x, y, k === 0 ? 'k0' : k === 5 ? 'r1' : (y % 10 === 3 ? 'k0' : 'k2')); }
        P.glow(tx, ty - 14, 28, 0.6 * glu, 'glutDim', 'k3');
      }
      // Schaulöcher: zwei runde Löcher über der Tür, weiße Glut darin (die Augen)
      if (!p.tod || f < 1) {
        const ey = 114 + T;
        for (const ex of [cx - 14, cx + 12]) {
          P.glow(ex + 0.5, ey + 0.5, 9, 0.8, 'glutDim', 'k3');
          for (let y = ey - 2; y <= ey + 2; y++) for (let x = ex - 2; x <= ex + 2; x++) { const d = Math.hypot(x - ex, y - ey); if (d < 2.6) P.set(x, y, d < 1 ? 'kern' : 'glut'); else if (d < 3.4) P.set(x, y, 'k0'); }
          if (v.offen || p.angriff) { P.set(ex - 3, ey - 3, 'k0'); P.set(ex + 3, ey - 3, 'k0'); }
          augen.push([ex, ey]);
        }
      }
      // Schornstein: oben glimmt es in der Lippe, im Angriff schlägt eine Flamme heraus
      {
        const lx = r(cx + versatz(12)), ly = 12 + T;
        for (let x = lx - 9; x <= lx + 8; x++) if (P.get(x, ly)) P.set(x, ly, Math.abs(x - lx) < 4 ? 'glut' : 'glutDim');
        if (!p.tod) { const hh = p.angriff ? [3, 6, 10, 5][f] : v.offen ? 5 : 2; for (let j = 1; j <= hh; j++) { const w = Math.max(0, r((hh - j) * 0.6)); for (let x = lx - w; x <= lx + w; x++) P.set(x + r(Math.sin(j + lodern) * 1), ly - j, j > hh - 2 ? 'glutDim' : (Math.abs(x - lx) < w * 0.5 ? 'kern' : 'glut')); } }
        augen.push([lx, ly]);
      }
      // Zangen: die Spitzen glühen (sie haben eben Ziegel aus der Kammer geholt)
      for (const h of [haV, haH]) { P.set(r(h[0]), r(h[1]), 'glutDim'); }
      SCHER(P); augen.forEach(a => { if (a[1] < 152) a[0] -= r((152 - a[1]) * 0.06); });
      if (v.offen && !p.tod) for (let i = 0; i < 6; i++) { const y = 60 + i * 9 + T, x = r(cx + 26 + Math.sin(i * 1.7) * 8); if (P.get(x, y) && P.get(x, y) <= 4) { P.set(x, y, 'glutDim'); P.set(x, y + 1, 'glut'); P.set(x + 1, y + 2, 'glutDim'); } }
    };
    return { gruppen, details, augen, dx };
  },
};
