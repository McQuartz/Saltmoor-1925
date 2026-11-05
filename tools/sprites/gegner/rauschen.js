// Die Funkstation am Pol: Das Rauschen. Niemand. Das, was zwischen zwei Sendern liegt. Es setzt sich zusammen
// wie ein Sender, den man sucht: erst Streifen, dann Schultern, dann ein Gesicht. Eine Gestalt aus waagerechten
// Bändern, die gegeneinander verrutscht sind; in der Brust glüht eine Röhre wie ein Herz. Im Leerlauf rutschen
// die Bänder auf ihren Platz und wieder weg. Gebaut wird erst die ganze Gestalt, dann wird sie in Bänder
// geschnitten und jedes Band seitlich versetzt; jede Schnittkante fängt oben das Licht.
'use strict';
const H0 = require('./astronom').hilfe;

module.exports = {
  id: 'rauschen', biom: 'funkstation', zone: 'funkstation', w: 96, h: 120, fuss: [50, 115], kopf: [46, 8], rimBis: 114,
  varianten: {
    // a: aufrecht, die Bänder eng (fast eingestellt)
    rauschen_a: { band: 5, luecke: 1, amp: 3, gebueckt: false },
    // b: gebückt und breiter, die Bänder weit auseinander, der Kopf ganz verschoben
    rauschen_b: { band: 6, luecke: 2, amp: 4, gebueckt: true },
  },
  // Silhouetten-Probe (nicht gebaut): als Wolke aus Einzelpixeln (gefüllt nur ein Fleck, ohne Umriss nicht
  // lesbar, und auf dem Schnee im Spiel Rauschen im schlechten Sinn). Genommen: Bänder, die ganz bleiben.
  proben: { probe_wolke: { band: 1, luecke: 1, amp: 5, gebueckt: false, wolke: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, arm = 0, streu = 0, ph = 0;
    // arm: 0 hängend, 1 zurückgezogen (ausgeholt), 2 Krallenhand nach vorn
    if (p.idle) { atem = 0; ph = f; }
    if (p.angriff) { lean = [2, 4, -8, -3][f]; arm = [0.6, 1, 2, 1.4][f]; streu = [1.5, 2.6, 0, 0.6][f]; ph = 5 + f; }
    if (p.treffer) { lean = [2, 1][f]; streu = [3, 2][f]; ph = 9 + f; }
    if (p.tod) { fall = r(p.q * 10); streu = 1 + p.q * 4; ph = 12 + f; }
    const T = atem + fall, L = lean;
    const g = v.gebueckt;
    const sx = 48 + L, sy = (g ? 46 : 38) + T;
    const kx = sx - (g ? 10 : 3), ky = sy - (g ? 9 : 14);
    // Gestalt: hager, breite Schultern, lange Arme; b gebückt nach vorn
    const leib = Pg(g
      ? [[sx - 14, sy - 2], [sx + 2, sy - 8], [sx + 14, sy - 4], [sx + 16, sy + 12], [sx + 12, sy + 30], [sx - 6, sy + 32], [sx - 12, sy + 16]]
      : [[sx - 13, sy - 4], [sx - 3, sy - 7], [sx + 10, sy - 6], [sx + 13, sy + 2], [sx + 10, sy + 22], [sx + 8, sy + 38], [sx - 8, sy + 38], [sx - 10, sy + 20], [sx - 14, sy + 4]], null, { rd: 2 });
    const kopf = [E(kx, ky, 7, 8.5, null), C(kx + 1, ky + 6, sx - 1, sy - 4, 3.2, 4, null)];
    const hb = g ? sy + 30 : sy + 38;
    const beine = [...glied([[sx - 5, hb - 2], [sx - 8, hb + 18], [sx - 9, 112]], 4.2, 2.8, null), ...glied([[sx + 5, hb - 2], [sx + 7, hb + 18], [sx + 9, 112]], 4.2, 2.8, null), E(sx - 11, 113, 4, 2, null), E(sx + 9, 113, 4, 2, null)];
    // Arme: lang, bis unter die Knie; der vordere holt aus und greift mit gespreizten Fingern
    const sV = [sx - 11, sy - 2], sH = [sx + 11, sy - 1];
    let eV, hV;
    if (arm < 0.5) { eV = [sx - 16, sy + 20]; hV = [sx - 17, sy + 46]; }
    else if (arm < 1.5) { eV = [sx - 6, sy - 14]; hV = [sx + 4, sy - 26]; }
    else { eV = [sx - 26, sy + 2]; hV = [sx - 40, sy + 8]; }
    const fingerV = [-0.6, -0.2, 0.2, 0.6].map(d => { const a = (arm < 0.5 ? 1.57 : arm < 1.5 ? -0.9 : 3.0) + d; return C(hV[0], hV[1], hV[0] + Math.cos(a) * 7, hV[1] + Math.sin(a) * 7, 1.1, 0.6, null); });
    const armV = [...glied([sV, eV, hV], 3.6, 2.4, null), ...fingerV];
    const armH = [...glied([sH, [sx + 17, sy + 20], [sx + 16, sy + 44]], 3.4, 2.2, null), ...[-0.4, 0, 0.4].map(d => C(sx + 16, sy + 44, sx + 16 + Math.sin(d) * 6, sy + 50, 1, 0.6, null))];
    const gruppen = [
      { p: armH, k: 1, kante: true },     // 0
      { p: beine, k: 1.5, kante: true },  // 1
      { p: [leib], k: 2, kante: true },   // 2
      { p: kopf, k: 2, kante: true },     // 3
      { p: armV, k: 1, kante: true },     // 4
    ];
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('funkstation'), { rimBis: 114 });
    // Versatz je Band: ruhige Welle, je Bild nur wenige Bänder bewegt
    const hash = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
    // Bänder unterschiedlich hoch (wie Streifen auf einem Schirm, die nicht stillhalten)
    const top = 4, grenzen = []; { let y = top, i = 0; while (y < H) { const h = [3, 7, 4, 9, 5, 3, 6, 8][(i * 5 + (v.band * 3)) % 8] + (v.band > 5 ? 1 : 0); grenzen.push([y, y + h, y + h + v.luecke]); y += h + v.luecke; i++; } }
    const bandVon = y => { for (let i = 0; i < grenzen.length; i++) if (y < grenzen[i][2]) return [i, y >= grenzen[i][1]]; return [grenzen.length, false]; };
    const versatz = b => {
      const basis = Math.round((hash(b, 1) - 0.5) * 2 * v.amp);
      const wackel = p.idle ? (b === [4, 9, 6, 2][f] ? (f % 2 ? 1 : -1) : 0) : (hash(b, 2 + (ph % 4)) > 0.72 ? (hash(b, ph) > 0.5 ? 1 : -1) : 0);
      const s = streu ? Math.round((hash(b, 3 + ph) - 0.5) * 2 * (v.amp + 2) * streu) : 0;
      return basis + wackel + s;
    };
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
      // Binnenform vor dem Schneiden: Rippen als Lichtbögen, eine Naht die Brust hinab
      for (let i = 0; i < 4; i++) { const yy = r(sy + 4 + i * 5); P.line(r(sx - 7), yy, r(sx + 7), yy - 2, 'k3', true); P.line(r(sx - 7), yy + 1, r(sx + 7), yy - 1, 'k1', true); }
      // Röhre in der Brust (vor dem Schneiden, damit sie mitwandert): Glaskolben, Gitter, glühender Faden
      const rx = r(sx + 1), ry = r(sy + 10);
      for (let y = ry - 5; y <= ry + 5; y++) for (let x = rx - 2; x <= rx + 2; x++) { const q = Math.abs(x - rx) / 2.6 + Math.max(0, Math.abs(y - ry) - 3) / 3; if (q < 1) P.auf(x, y, q > 0.75 ? 'k1' : 'k0'); }
      if (!aus) { P.glow(rx + 0.5, ry + 0.5, 10, 0.95); for (let y = ry - 3; y <= ry + 3; y++) P.set(rx, y, Math.abs(y - ry) < 2 ? 'kern' : 'glut'); P.set(rx - 1, ry, 'glut'); P.set(rx + 1, ry, 'glut'); P.set(rx - 1, ry - 3, 'kupfer'); P.set(rx + 1, ry + 3, 'kupfer'); }
      // Augen: zwei Punkte, eins tiefer als das andere
      const ex = r(kx - 3), ey = r(ky - 1);
      if (!aus) { P.set(ex, ey, 'kern'); P.set(ex + 4, ey + 1, 'glut'); P.glow(ex + 2, ey + 0.5, 5, 0.6); }
      // Schneiden: jede Zeile in ihrem Band seitlich versetzen, Lücken leeren
      const alt = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) alt[y * W + x] = P.get(x, y);
      const altGid = Int16Array.from(gid);
      for (let y = 0; y < H; y++) {
        const [b, luecke] = bandVon(y);
        const leer = v.wolke ? (x => hash(x, y) < 0.55) : null;
        const dx = y >= 108 ? 0 : versatz(b);
        for (let x = 0; x < W; x++) { const sx2 = x - dx; let c = sx2 >= 0 && sx2 < W ? alt[y * W + sx2] : 0; if (luecke && y < 108 && y >= top) c = 0; if (leer && leer(x)) c = 0; P.set(x, y, c); gid[y * W + x] = c && sx2 >= 0 && sx2 < W ? altGid[y * W + sx2] : -1; }
        if (y === ey && !aus) augen.push([ex + dx, ey]);
        if (y === ry && !aus) augen.push([rx + dx, ry]);
      }
      // Schnittkanten: oben fängt jedes Band das Licht (rechts heller), unten liegt es im Schatten
      for (let y = 1; y < H - 1; y++) for (let x = 0; x < W; x++) {
        const c = P.get(x, y); if (!c || c > 4) continue;
        if (!P.get(x, y - 1) && y < 108) P.set(x, y, (x + y) % 5 === 0 ? 'k3' : LIB.bay(x, y) < 0.55 ? 'r1' : 'k3');
        else if (!P.get(x, y + 1) && y < 107) P.set(x, y, 'k0');
      }
      // Statik: einzelne Körner, die an den Bandenden abreißen
      for (let y = top; y < 106; y += 1) { const [b] = bandVon(y); if (!grenzen[b] || y !== grenzen[b][0] + 1) continue; let x0 = -1, x1 = -1; for (let x = 0; x < W; x++) if (P.get(x, y)) { if (x0 < 0) x0 = x; x1 = x; } if (x0 < 0) continue; const k = hash(b, (p.idle ? 0 : ph) + 7); if (k > 0.5) P.set(x1 + 2 + Math.round(k * 3), y, 'r1'); if (k < 0.3) P.set(x0 - 2 - Math.round(k * 5), y, 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
