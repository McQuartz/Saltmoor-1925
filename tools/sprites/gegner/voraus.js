// Wächter Glasmeer: Der Voraus. Dein Spiegelbild, aber es ist dir einen Schritt voraus. Ein Reisender von 1925
// im langen Ulster mit Pelerine und Homburg, ganz aus schwarzem Glas, geschliffen in Facetten; in den
// Bruchkanten steht grünes Licht. In der vorderen Hand hält er einen Fächer aus gläsernen Karten (deine nächsten),
// in der hinteren einen Koffer. Hinter ihm, dort wo er eigentlich noch sein müsste, steht sein Nachbild.
// Das Gesicht ist glatt wie ein Spiegel; nur die zwei Augen sitzen darin.
'use strict';
const { glas } = require('./glasschwimmer');
let L = null;
module.exports = {
  id: 'voraus', biom: 'glasmeer', zone: 'glasmeer', rang: 'waechter', w: 160, h: 180, fuss: [80, 174], kopf: [74, 8], rimBis: 172,
  varianten: { voraus: { karten: 5, nachbild: 20 } },
  skizzen: { skizze_stehend: { karten: 0, nachbild: 0, stehend: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    // ka: Kartenhand 0 vorn, 1 zurückgezogen (Ausholen), 2 geworfen; sw: Schwung; fall: Zerbrechen
    const poseVon = (anim, k, n) => {
      const o = { ka: 0, lean: 0, fall: 0, nick: 0, hem: 0, licht: 1, glanz: 0, wurf: 0 };
      if (anim === 'idle') { o.hem = k; o.glanz = k; o.nick = [0, 0, 1, 0][k]; }
      if (anim === 'angriff') { o.ka = [0.5, 1, 2, 1.4][k]; o.lean = [2, 5, -8, -3][k]; o.hem = [0, 1, 3, 2][k]; o.licht = [1.1, 1.3, 1.7, 1.2][k]; o.wurf = k === 2 ? 1 : k === 3 ? 2 : 0; }
      if (anim === 'treffer') { o.lean = [4, 2][k]; o.licht = 1.5; o.ka = 0.3; }
      if (anim === 'tod') { o.fall = Math.round(k / (n - 1) * 30); o.licht = k < 2 ? 1.8 : Math.max(0, 1.8 - k * 0.5); o.lean = Math.round(k * 0.8); }
      return o;
    };
    const figur = (o, ghost) => {
      const lx = o.lean, F = o.fall, st = v.stehend;
      const top = 52 + F, cx = 80;
      // Füße und Hosenbeine (Schritt: vorn links weit, hinten rechts)
      const fv = st ? [70, 173] : [56 - Math.min(0, lx) * 0.3, 173], fh = st ? [90, 173] : [102, 172];
      const beine = [...glied([[cx - 6 + lx * 0.4, 120 + F * 0.5], [fv[0] + 6, 150], [fv[0] + 2, fv[1] - 3]], 5.5, 4.4, null), ...glied([[cx + 8 + lx * 0.3, 120 + F * 0.5], [fh[0] - 2, 148], [fh[0], fh[1] - 3]], 5.5, 4.4, null)];
      const schuhe = [Pg([[fv[0] - 9, fv[1] + 1], [fv[0] - 7, fv[1] - 4], [fv[0] + 6, fv[1] - 5], [fv[0] + 7, fv[1] + 1]], 'dunkel', { rd: 1 }), Pg([[fh[0] - 6, fh[1] + 1], [fh[0] - 5, fh[1] - 5], [fh[0] + 8, fh[1] - 4], [fh[0] + 9, fh[1] + 1]], 'dunkel', { rd: 1 })];
      // Ulster: lang, vorn bis übers Knie, hinten weht der Saum zurück
      const hm = o.hem % 2;
      const mantel = Pg([[cx - 14 + lx, top], [cx + 14 + lx, top], [cx + 22 + lx * 0.6, top + 30], [cx + 30, 120 + F * 0.5], [cx + 44 + hm, 150 + F * 0.3], [cx + 30, 154], [cx + 14, 146], [cx, 150], [cx - 18, 144], [cx - 26 + lx * 0.3, 140], [cx - 22 + lx * 0.6, 110], [cx - 20 + lx, top + 22]], null, { rd: 2 });
      // Pelerine: kurzer Umhang über den Schultern, eigener Saum
      const pel = Pg([[cx - 16 + lx, top - 2], [cx + 16 + lx, top - 2], [cx + 28 + lx * 0.8, top + 22], [cx + 30 + lx * 0.7 + hm, top + 32], [cx + 12 + lx * 0.8, top + 30], [cx - 8 + lx, top + 32], [cx - 26 + lx, top + 28], [cx - 22 + lx, top + 10]], null, { rd: 1.5 });
      const kragen = Pg([[cx - 10 + lx, top - 9], [cx + 8 + lx, top - 9], [cx + 12 + lx, top + 2], [cx - 12 + lx, top + 2]], null, { rd: 1 });
      // Kopf: glattes Spiegelgesicht unter dem Homburg
      const hx = cx - 4 + lx + (st ? 0 : -2), hy = top - 16 + o.nick;
      const gesicht = E(hx, hy, 7.5, 9.5, 'haut', { pf: 'bevel' });
      const krempe = Pg([[hx - 16, hy - 8], [hx + 14, hy - 10], [hx + 16, hy - 7], [hx - 15, hy - 5]], null, { rd: 1.2 });
      const hut = Pg([[hx - 10, hy - 8], [hx - 9, hy - 20], [hx - 3, hy - 23], [hx + 4, hy - 23], [hx + 10, hy - 20], [hx + 10, hy - 9]], null, { rd: 1.5 });
      // Hinterer Arm mit Koffer
      const sH = [cx + 14 + lx, top + 8];
      const armH = glied([sH, [cx + 24 + lx * 0.5, top + 32], [cx + 26, top + 54]], 5, 3.8, null);
      const kof = [cx + 16, top + 56];
      const koffer = [Pg([[kof[0], kof[1]], [kof[0] + 28, kof[1] - 1], [kof[0] + 29, kof[1] + 20], [kof[0] + 1, kof[1] + 21]], null, { rd: 1.5 }), C(kof[0] + 9, kof[1] - 1, kof[0] + 9, kof[1] - 5, 1.6, 1.6, null), C(kof[0] + 9, kof[1] - 5, kof[0] + 17, kof[1] - 5, 1.6, 1.6, null), C(kof[0] + 17, kof[1] - 5, kof[0] + 17, kof[1] - 1, 1.6, 1.6, null)];
      // Vorderer Arm: hält den Kartenfächer nach vorn
      const sV = [cx - 14 + lx, top + 8];
      let ell, hand;
      if (o.ka < 0.75) { ell = [cx - 26 + lx, top + 26]; hand = [cx - 42 + lx, top + 22 - o.ka * 10]; }
      else if (o.ka < 1.5) { ell = [cx - 14 + lx, top + 30]; hand = [cx - 18 + lx, top + 6]; }
      else { ell = [cx - 32 + lx, top + 16]; hand = [cx - 54 + lx, top + 22]; }
      if (F) { hand = [hand[0], hand[1] + F]; ell = [ell[0], ell[1] + F * 0.6]; }
      const armV = [...glied([sV, ell, hand], 5, 3.4, null), E(hand[0], hand[1], 4, 3.6, null)];
      // Karten: Fächer über der Hand
      const karten = [], kp = [];
      const nk = o.wurf === 1 ? v.karten - 1 : v.karten;
      for (let i = 0; i < nk; i++) {
        const a = -Math.PI / 2 - 0.55 + i * (1.1 / Math.max(1, v.karten - 1)) + (o.ka >= 1.5 ? -0.5 : o.ka >= 0.75 ? 0.5 : 0), d = 9, w = 3.4, h = 8;
        const mx = hand[0] + Math.cos(a) * d, my = hand[1] - 2 + Math.sin(a) * d, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
        const pts = [[mx - ux * h + nx * w, my - uy * h + ny * w], [mx - ux * h - nx * w, my - uy * h - ny * w], [mx + ux * h - nx * w, my + uy * h - ny * w], [mx + ux * h + nx * w, my + uy * h + ny * w]];
        karten.push(Pg(pts, null, { rd: 0.4, pf: 'flat' })); kp.push({ mx, my, ux, uy, nx, ny, w, h });
      }
      // geworfene Karte fliegt nach vorn links
      const flug = o.wurf ? [Pg([[12 + o.wurf * -6, hand[1] - 6], [20 + o.wurf * -6, hand[1] - 10], [24 + o.wurf * -6, hand[1] - 2], [16 + o.wurf * -6, hand[1] + 2]], null, { rd: 0.4, pf: 'flat' })] : [];
      // Scherben: der Saum hinten zerfällt in schwebende Splitter
      const scherben = [];
      if (!st) for (let i = 0; i < 7; i++) { const q = ((i * 0.37 + o.hem * 0.06 + (o.wurf ? 0.1 : 0)) % 1), x = cx + 40 + q * 26 + (i % 3) * 3, y = 150 - i * 7 + Math.sin(i * 1.9) * 4 + F * 0.4, s = 2.4 + (i % 3); scherben.push(Pg([[x, y - s], [x + s * 1.1, y + s * 0.2], [x - s * 0.3, y + s * 0.9]], null, { rd: 0.2 })); }
      const grp = [
        { p: koffer, k: 0.8 }, { p: armH, k: 1.2 },
        { p: beine, k: 1.5 }, { p: schuhe, k: 0.8 },
        { p: [mantel], k: 2, anker: [lx, F] },
        { p: scherben, k: 0 },
        { p: [pel], k: 1.5, anker: [lx, F] },
        { p: [kragen], k: 1 },
        { p: [gesicht], k: 0 },
        { p: [hut, krempe], k: 1 },
        { p: armV, k: 1.4 },
        { p: karten, k: 0 }, { p: flug, k: 0 },
      ];
      return { grp, hx, hy, top, cx, lx, hand, kp, kof, F, flug, fv, fh };
    };
    const o = poseVon(p.anim, f, p.n);
    const Fg = figur(o);
    const augen = [];
    const details = P => {
      const { hx, hy, top, cx, lx, F } = Fg, li = o.licht;
      // Facetten: der Mantel ist geschliffen wie Obsidian; gerade Kanten, hell rechts, dunkel links
      const facette = (a, b) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])); for (let k = 0; k <= n; k++) { const x = r(a[0] + (b[0] - a[0]) * k / n), y = r(a[1] + (b[1] - a[1]) * k / n); const c = P.get(x, y); if (!c || c > 4) continue; P.set(x, y, 'k0'); const c2 = P.get(x + 1, y); if (c2 && c2 <= 4) P.set(x + 1, y, (x + y) % 4 ? 4 : 'r1'); } };
      facette([cx - 18 + lx * 0.6, top + 36], [cx - 4, 146]); facette([cx + 4 + lx * 0.7, top + 32], [cx + 14, 146]); facette([cx + 18 + lx * 0.6, top + 34], [cx + 34, 140]);
      facette([cx - 20 + lx * 0.5, 104], [cx + 24, 98]); facette([cx - 6 + lx, top + 4], [cx + 22 + lx, top + 26]);
      // Knopfleiste und Gürtel
      for (let y = top + 34; y < 136; y += 9) { P.auf(cx - 9 + r(lx * (1 - (y - top) / 100)), y, 'k3'); P.auf(cx - 9 + r(lx * (1 - (y - top) / 100)) + 1, y - 1, 'r1'); }
      for (let x = cx - 22; x <= cx + 26; x++) P.auf(x, 106 + r((x - cx) * 0.08), 'k1');
      // Pelerine: Saumkante hell
      // Hutband
      for (let x = r(hx - 9); x <= hx + 9; x++) P.auf(x, r(hy - 10), 'k0');
      // Spiegelgesicht: senkrechter Glanzstreif, zwei Augen; Licht in den Bruchkanten
      glas.streif(P, [hx + 3, hy - 6], [hx + 1, hy + 7], 1.2, { hell: 0.7 });
      if (li > 0 && !(p.tod && f >= 3)) {
        P.set(r(hx - 4), r(hy), 'kern'); P.set(r(hx - 3), r(hy), 'glut'); P.set(r(hx + 2), r(hy - 0.5), 'kern'); P.set(r(hx + 1), r(hy - 0.5), 'glut');
        P.glow(hx - 1, hy + 0.5, 7 * Math.min(1.3, li), 0.5); augen.push([r(hx - 4), r(hy)], [r(hx + 2), r(hy - 0.5)]);
        // Risse: Bruchkanten mit grünem Licht, über Gesicht, Brust, Mantel
        const rs = (a, b, s, z) => glas.riss(P, a, b, { seed: s, zacken: z, staerke: Math.min(1, li * (0.75 + 0.25 * Math.sin(s + (p.idle ? f * 1.3 : 0)))) });
        rs([hx + 6, hy - 6], [hx - 2, hy + 9], 2, 3);
        rs([cx - 8 + lx, top + 4], [cx + 6 + lx * 0.8, top + 40], 5, 6);
        rs([cx + 6 + lx * 0.6, top + 40], [cx + 22, 120], 7, 6);
        rs([cx - 16 + lx * 0.4, 118], [cx - 4, 144], 9, 4);
        rs([cx + 20, 126], [cx + 36, 148], 11, 4);
        if (p.treffer || p.tod) { rs([cx - 14 + lx, top + 20], [cx - 20 + lx * 0.4, 100], 13, 5); rs([cx + 20 + lx, top + 16], [cx + 30, 96], 15, 5); }
        P.glow(cx + 6, top + 30, 14 * li, 0.35);
      }
      // Karten: Glaskanten leuchten grün, die oberste trägt ein Zeichen
      Fg.kp.forEach((k, i) => {
        for (let t = -k.h + 1; t <= k.h - 1; t++) { const x = r(k.mx + k.ux * t + k.nx * (k.w - 0.6)), y = r(k.my + k.uy * t + k.ny * (k.w - 0.6)); if (P.get(x, y)) P.set(x, y, (t + i + (p.idle ? f : 0)) % 4 === 0 && li > 0.5 ? 'nordlicht' : 'k3'); }
        const sx = r(k.mx + k.ux * 2), sy = r(k.my + k.uy * 2); if (li > 0 && i === ((p.idle ? f : 2) % Fg.kp.length)) { P.set(sx, sy, 'glut'); P.glow(sx + 0.5, sy + 0.5, 3, 0.6); } else P.auf(sx, sy, 'k0');
      });
      if (Fg.flug.length) { const q = Fg.flug[0].v; const mx = (q[0][0] + q[2][0]) / 2, my = (q[0][1] + q[2][1]) / 2; P.set(r(mx), r(my), 'kern'); P.set(r(mx) + 1, r(my), 'glut'); P.glow(mx, my, 6, 0.8); for (let k = 2; k < 14; k += 2) P.set(r(mx + k), r(my + k * 0.15), k < 8 ? 'nordlicht' : 'glutDim'); }
      // Koffer: Riemen und Beschläge
      { const [kx, ky] = Fg.kof; P.line(kx + 2, ky + 7, kx + 27, ky + 6, 'k0', true); P.line(kx + 2, ky + 14, kx + 27, ky + 13, 'k0', true); for (const x of [kx + 7, kx + 21]) { P.line(x, ky + 1, x, ky + 20, 'k3', true); P.auf(x, ky + 7, 'r1'); P.auf(x, ky + 14, 'r1'); } }
      // Licht von unten auf Mantelsaum und Schuhe
      glas.unterlicht(P, 170, 50, Math.min(1, li) * 0.6);
      // Glanz auf den Facetten der Pelerine
      glas.streif(P, [cx + 2 + lx, top + 4], [cx + 22 + lx, top + 26], 1.2, { hell: 0.5 });
      glas.muschel(P, cx + 2 + lx, top + 60, 14, -2.5, -0.7, 4);
      // Nachbild: dort, wo er eigentlich noch sein müsste (einen Schritt zurück, rechts), gedithert und dunkel
      if (v.nachbild && !(p.tod && f >= 2)) {
        if (!L) L = require('../lib');
        const G = figur(poseVon('idle', 0), true);
        const { buf } = L.render(160, 180, G.grp, L.palette('glasmeer'), { rimBis: 172 });
        const NX = v.nachbild + (p.angriff ? [0, 2, 8, 4][f] : 0);
        for (let y = 0; y < 180; y++) for (let x = 0; x < 160; x++) {
          const c = buf[y * 160 + x]; if (!c) continue; const tx = x + NX; if (tx >= 160 || P.get(tx, y)) continue;
          const kante = !buf[y * 160 + x + 1] || !buf[(y - 1) * 160 + x];
          if (kante) { if ((y + x) % 2) P.set(tx, y, y < 100 ? 'r1' : 'glutDim'); } else if (A.bay(tx, y) < 0.16) P.set(tx, y, 'glutDim');
        }
      }
    };
    return { gruppen: Fg.grp, details, augen };
  },
};
