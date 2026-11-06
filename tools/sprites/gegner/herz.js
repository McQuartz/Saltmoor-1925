// Wächter der Walkathedrale: Das Herz. Das Herz des Wals, so groß wie eine Kapelle, in einer Wiege aus Knochen,
// die von allen Seiten nach innen wächst. Die großen Adern stehen oben aus ihm heraus wie Orgelpfeifen,
// abgeschnitten, offen. In der Wand ist eine Tür aus Schiffsplanken, angelehnt; dahinter brennt Licht.
// Es schlägt sehr langsam. Jeder Schlag gibt den anderen Schutz (Kniff takt), zwischen den Schlägen ist es offen.
'use strict';
module.exports = {
  id: 'herz', biom: 'walkathedrale', zone: 'walkathedrale', rang: 'waechter', w: 160, h: 180, fuss: [80, 175], kopf: [84, 40], rimBis: 172,
  varianten: { herz: { pfeifen: 4, dorne: 7 } },
  // verworfen: Herz frei schwebend ohne Wiege und Pfeifen (liest sich als Fleischklumpen, kein Ort)
  skizzen: { skizze_klumpen: { pfeifen: 0, dorne: 0, nackt: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    // s: Größe des Herzens (Schlag zieht zusammen, dann weitet es sich), tuer: Türspalt, glut: Licht hinter der Tür
    let s = 1, tuer = 1, glut = 1, fall = 0, lean = 0, dorn = 0;
    if (p.idle) { s = [1, 1, 1.012, 1][f]; glut = [1, 1.35, 0.9, 1][f]; tuer = [1, 0.6, 1.1, 1][f]; }
    if (p.angriff) { s = [0.97, 0.9, 1.08, 1.03][f]; glut = [1.1, 1.5, 1.7, 1.2][f]; tuer = [1, 0.4, 1.8, 1.3][f]; lean = [1, 2, -5, -2][f]; dorn = [0, 0, 3, 1][f]; }
    if (p.treffer) { s = [1.03, 1][f]; glut = 0.6; tuer = 0.5; lean = [3, 1][f]; }
    if (p.tod) { s = 1 - p.q * 0.15; glut = Math.max(0, 1 - p.q * 1.6); tuer = 1.6 + p.q; fall = r(p.q * 10); }
    const cx = 80 + lean, cy = 104 + fall, RX = 42 * s, RY = 46 * s;
    // Wiege: Knochen von unten, ein Bett aus Rippen, deren Spitzen nach innen zum Herzen wachsen
    const wiege = [];
    if (!v.nackt) {
      wiege.push(Pg([[14, 176], [146, 176], [140, 166], [112, 158], [80, 155], [48, 158], [20, 166]], null, { rd: 2 }));
      for (let i = 0; i < v.dorne; i++) {
        const q = i / (v.dorne - 1), seite = q < 0.5 ? -1 : 1, x0 = 10 + q * 140, y0 = 168 - Math.sin(q * Math.PI) * 6;
        // Spitze zeigt zum Herzen, bleibt knapp davor
        const ang = Math.atan2(cy - y0, cx - x0), d = Math.hypot(cx - x0, cy - y0) - (seite ? RX * 0.95 : RY) - 6 + dorn;
        const len = Math.max(14, Math.min(d, 48 - Math.abs(q - 0.5) * 30));
        const mx = x0 + Math.cos(ang - 0.25 * seite) * len * 0.55, my = y0 + Math.sin(ang - 0.25 * seite) * len * 0.55;
        wiege.push(...glied([[x0, y0], [mx, my], [x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len]], 5 - Math.abs(q - 0.5) * 3, 0.8, null));
      }
    }
    // Herzkörper: zwei ungleiche Kammern, die Spitze unten links (zum Spieler geneigt)
    const herz = [
      Pg([[cx - RX * 0.95, cy - RY * 0.35], [cx - RX * 0.6, cy - RY * 0.85], [cx - RX * 0.05, cy - RY * 0.95], [cx + RX * 0.55, cy - RY * 0.85], [cx + RX * 0.95, cy - RY * 0.4], [cx + RX * 0.92, cy + RY * 0.15], [cx + RX * 0.55, cy + RY * 0.6], [cx - RX * 0.05, cy + RY * 0.95], [cx - RX * 0.38, cy + RY * 0.98], [cx - RX * 0.75, cy + RY * 0.55], [cx - RX * 1.0, cy + RY * 0.05]], null, { rd: 6 * s }),
    ];
    const vorhof = E(cx + RX * 0.55, cy - RY * 0.72, RX * 0.42, RY * 0.32, 'dunkel');
    // Große Adern: Aortenbogen nach links oben, dazu Pfeifen, gerade abgeschnitten, oben offen
    const adern = [];
    if (!v.nackt) {
      adern.push(...glied([[cx - RX * 0.1, cy - RY * 0.8], [cx - RX * 0.2, cy - RY - 22], [cx - RX * 0.55, cy - RY - 36], [cx - RX * 0.95, cy - RY - 30], [cx - RX * 1.15, cy - RY - 14]], 10 * s, 7.5 * s, null));
      for (let i = 0; i < v.pfeifen; i++) {
        const x = cx + RX * (0.05 + i * 0.2), top = 8 + [10, 0, 16, 28][i] + (p.idle ? [0, 2, -1, 0][f] : 0) * (i % 2), y0 = cy - RY * 0.75 + i * 3;
        adern.push(C(x, y0, x + (i - 1.5) * 1.5, top, (6 - i * 0.7) * s, (5.5 - i * 0.7) * s, null));
      }
    }
    // Knochenplatten, die über das Herz wachsen (das Skelett wächst nach innen, auch hierher)
    const platte = (u, w2, n, gr, rot) => { const pts = []; for (let k = 0; k < n; k++) { const a = rot + k / n * Math.PI * 2, rr = gr * (0.75 + ((k * 7 + n) % 5) * 0.09); pts.push([cx + RX * u + Math.cos(a) * rr * 1.2, cy + RY * w2 + Math.sin(a) * rr]); } return Pg(pts, null, { rd: 1 }); };
    const platten = v.nackt ? [] : [platte(0.45, -0.6, 7, 10 * s, 0.3), platte(0.72, -0.18, 6, 7.5 * s, 1.1), platte(0.18, -0.8, 6, 7 * s, 0.7), platte(-0.66, 0.36, 7, 8 * s, 0.2), platte(0.52, 0.45, 6, 6.5 * s, 0.9), platte(-0.62, -0.42, 6, 6 * s, 0.4)];
    const gruppen = [
      { p: adern.slice(5), k: 1.2, tone: 0.1 },
      { p: [vorhof], k: 2, tone: 0.1 },
      { p: adern.slice(0, 5), k: 1.5 },
      { p: herz, k: 3, tone: 0.18 },
      ...platten.map(pl => ({ p: [pl], k: 0.5, tone: 0.55 })),
      { p: wiege, k: 1.5, tone: 0.45 },
    ];
    const augen = [];
    const details = P => {
      // Muskelfasern: schräge Bahnen, in Bändern, von links unten nach rechts oben
      for (let y = r(cy - RY); y <= cy + RY; y++) for (let x = r(cx - RX); x <= cx + RX; x++) {
        const c = P.get(x, y); if (!c || c > 4) continue;
        const u = (x - cx) * 0.55 + (y - cy) * 0.8, band = ((u % 7) + 7) % 7;
        if (band < 1) P.set(x, y, Math.max(1, c - 1));
        else if (band > 3 && band < 4.4 && c < 4 && (c < 3 || (x + y) % 2)) P.set(x, y, c + 1);
      }
      // Gegenlicht von hinten rechts oben: die Wölbung zum Licht hin gedithert heller (Fase in die Fläche)
      for (let y = r(cy - RY); y <= cy + RY; y++) for (let x = r(cx - RX); x <= cx + RX; x++) {
        const c = P.get(x, y); if (!c || c > 4) continue;
        const u = (x - cx) / RX * 0.75 - (y - cy) / RY * 0.65, b = A.bay(x, y);
        if (u + b * 0.5 > 0.95) P.set(x, y, 4); else if (u + b * 0.5 > 0.62 && c < 3) P.set(x, y, 3); else if (u + b * 0.5 < -0.55 && c > 1) P.set(x, y, c - 1);
      }
      // Kranzadern: erhabene Wülste, die über das Herz laufen, von oben nach unten verzweigt
      const ader = (pts, hell) => { for (let k = 0; k < pts.length - 1; k++) { const [a, b] = pts[k], [c2, d] = pts[k + 1], n = Math.ceil(Math.hypot(c2 - a, d - b)); for (let j = 0; j <= n; j++) { const x = r(a + (c2 - a) * j / n), y = r(b + (d - b) * j / n); if (P.get(x, y) && P.get(x, y) <= 4) { P.set(x, y, hell); P.auf(x - 1, y + 1, 'k0'); } } } };
      // Furche zwischen den Kammern, tief und dunkel; daneben die Kranzader
      { const fz = [[cx + RX * 0.05, cy - RY * 0.85], [cx + RX * 0.12, cy - RY * 0.3], [cx + RX * 0.02, cy + RY * 0.3], [cx - RX * 0.2, cy + RY * 0.9]];
        for (let k = 0; k < fz.length - 1; k++) { const [a, b] = fz[k], [c2, d] = fz[k + 1], n = Math.ceil(Math.hypot(c2 - a, d - b)); for (let j = 0; j <= n; j++) { const x = r(a + (c2 - a) * j / n), y = r(b + (d - b) * j / n); P.auf(x, y, 'k0'); P.auf(x + 1, y, 'k0'); P.auf(x - 1, y, 'k1'); P.auf(x + 2, y, j % 3 ? 'k3' : 'r1'); } } }
      ader([[cx - RX * 0.15, cy - RY * 0.7], [cx - RX * 0.3, cy - RY * 0.2], [cx - RX * 0.25, cy + RY * 0.35], [cx - RX * 0.4, cy + RY * 0.8]], 'k3');
      // Risse, aus denen das Mark glimmt (heller beim Schlag)
      const riss = (pts) => { for (let k = 0; k < pts.length - 1; k++) { const [a, b] = pts[k], [c2, d] = pts[k + 1], n = Math.ceil(Math.hypot(c2 - a, d - b)); for (let j = 0; j <= n; j++) { const x = r(a + (c2 - a) * j / n), y = r(b + (d - b) * j / n); if (!P.get(x, y)) continue; const t = glut * (0.9 - Math.abs(j / n - 0.5)); P.set(x, y, t > 0.95 ? 'glut' : t > 0.6 ? 'mark' : 'glutDim'); } } };
      if (glut > 0) { riss([[cx + RX * 0.35, cy - RY * 0.2], [cx + RX * 0.42, cy], [cx + RX * 0.36, cy + RY * 0.12], [cx + RX * 0.45, cy + RY * 0.3]]); riss([[cx + RX * 0.62, cy + RY * 0.05], [cx + RX * 0.7, cy + RY * 0.2]]); riss([[cx - RX * 0.75, cy + RY * 0.2], [cx - RX * 0.66, cy + RY * 0.38], [cx - RX * 0.7, cy + RY * 0.5]]); P.glow(cx + RX * 0.4, cy + RY * 0.05, 12 * glut, 0.5, 'glutDim', 'k3'); }
      ader([[cx - RX * 0.27, cy - RY * 0.1], [cx - RX * 0.65, cy + RY * 0.2], [cx - RX * 0.7, cy + RY * 0.45]], 'k3');
      ader([[cx + RX * 0.3, cy - RY * 0.55], [cx + RX * 0.55, cy - RY * 0.1], [cx + RX * 0.5, cy + RY * 0.4]], 'r1');
      // Knochenplatten: Kalk gedithert (bein), Kante zum Licht hell (r1), Poren dunkel
      platten.forEach(pl => { const xs = pl.v.map(q => q[0]), ys = pl.v.map(q => q[1]), mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2, rx = (Math.max(...xs) - Math.min(...xs)) / 2, ry = (Math.max(...ys) - Math.min(...ys)) / 2;
        for (let y = r(my - ry); y <= my + ry; y++) for (let x = r(mx - rx); x <= mx + rx; x++) { const q = Math.hypot((x + 0.5 - mx) / rx, (y + 0.5 - my) / ry); if (q > 0.95 || !P.get(x, y) || P.get(x, y) > 4) continue;
          const u = (x - mx) / rx * 0.7 - (y - my) / ry * 0.7;
          if (q > 0.62 && u > 0.35) P.set(x, y, 'r1'); else if (u + A.bay(x, y) * 0.9 > 0.55) P.set(x, y, 'bein'); else if ((x * 5 + y * 3) % 11 === 0) P.set(x, y, 'k0'); } });
      // Pfeifen: offene Mündungen (dunkel) mit Kalkrand
      if (!v.nackt) for (let i = 0; i < v.pfeifen; i++) { const x = cx + RX * (0.05 + i * 0.2) + (i - 1.5) * 1.5, top = 8 + [10, 0, 16, 28][i] + (p.idle ? [0, 2, -1, 0][f] : 0) * (i % 2), w = (5.5 - i * 0.7) * s; for (let k = -w + 1; k <= w - 1; k++) { P.auf(r(x + k), r(top), 'k0'); P.auf(r(x + k), r(top) + 1, k > 0 ? 'bein' : 'k1'); if (Math.abs(k) < w - 2 && glut > 1.2) P.auf(r(x + k), r(top) + 2, 'glutDim'); } }
      // Die Tür: Schiffsplanken, eingesetzt in die Herzwand, angelehnt; dahinter Licht
      const tx = r(cx - RX * 0.5), ty = r(cy - 10), tw = 18, th = 30;
      for (let y = ty; y < ty + th; y++) for (let x = tx; x < tx + tw; x++) {
        const bogen = y < ty + 5 && Math.hypot(x + 0.5 - tx - tw / 2, (y - ty - 5) * 1.3) > tw / 2; if (bogen) continue;
        const spalt = x - tx < tw * 0.45 * tuer;
        if (spalt && glut > 0) { const q = (x - tx) / (tw * 0.45 * tuer + 0.01), t = glut * (0.6 + 0.6 * (1 - Math.abs(q - 0.5) * 2)) - (y - ty) / th * 0.25; P.set(x, y, t > 1.05 ? 'kern' : t > 0.75 ? 'glut' : t > 0.45 ? 'mark' : 'glutDim'); }
        else { const pl = (x - tx) % 4; P.set(x, y, pl === 0 ? 'k0' : pl === 3 ? 'k3' : 'k2'); }
      }
      P.set(tx + 2, ty + r(th / 2), 'kern'); P.set(tx + 2, ty + r(th / 2) + 1, 'glut');
      // Im Türspalt steht jemand, klein, gegen das Licht (nur wenn die Tür weit genug offen ist)
      if (tuer >= 0.9 && glut > 0) { const gx = tx + 4, gy = ty + th - 1; for (let k = 0; k < 9; k++) { P.set(gx, gy - k, 'k0'); if (k > 1 && k < 7) P.set(gx + 1, gy - k, 'k0'); } P.set(gx, gy - 9, 'k0'); P.set(gx + 1, gy - 9, 'k0'); P.set(gx, gy - 10, 'k0'); P.set(gx + 1, gy - 10, 'k1'); }
      // Türblatt nach außen geklappt (schmal, perspektivisch), mit Beschlag
      if (!spaltZu(tuer)) for (let y = ty + 1; y < ty + th + 1; y++) { P.set(tx - 1, y, 'k3'); P.set(tx - 2, y, y % 6 === 0 ? 'bein' : 'k2'); P.set(tx - 3, y + 1, 'k1'); }
      for (let x = tx - 2; x < tx + tw; x++) { P.auf(x, ty + th, 'k0'); }
      // Türrahmen aus Knochen
      for (let y = ty - 1; y <= ty + th; y++) { P.set(tx + tw, y, y % 5 ? 'bein' : 'r1'); P.set(tx + tw + 1, y, 'k0'); }
      for (let x = tx; x <= tx + tw; x++) if (x - tx > tw / 2 - 5 && x - tx < tw / 2 + 5) P.set(x, ty - 1 + (Math.abs(x - tx - tw / 2) > 3 ? 1 : 0), 'bein');
      // Licht aus der Tür fällt auf die Herzwand (warm, gedithert, nach außen dünner) und auf den Boden der Wiege
      if (glut > 0) {
        for (let y = ty - 18; y < ty + th + 22; y++) for (let x = tx - 26; x < tx + tw + 20; x++) {
          const c = P.get(x, y); if (!c || c > 4 || (x >= tx && x < tx + tw && y >= ty && y < ty + th)) continue;
          const d = Math.hypot((x - tx - 3) / 1.2, y - ty - th / 2) / 30, v2 = glut * 0.75 * (1 - d) * (1 - d);
          if (v2 > 0.42 + A.bay(x, y) * 0.35) P.set(x, y, 'glutDim'); else if (v2 > A.bay(x, y) * 0.7 && c < 3) P.set(x, y, 3);
        } P.glow(tx + 3, ty + th / 2, 26 * glut, 0.55, 'glutDim', 'k3'); P.glow(tx + 4, ty + th + 14, 16 * glut, 0.5, 'glutDim', 'k3'); augen.push([tx + 3, ty + th / 2]); }
      // Schwelle aus Knochen
      for (let x = tx - 3; x <= tx + tw; x++) P.set(x, ty + th + 1, x % 3 ? 'bein' : 'r1');
      // Wiege: Poren und Fugen im Knochen
      if (!v.nackt) for (let x = 18; x < 144; x += 5) { P.auf(x, 168 + (x % 3), 'k0'); P.auf(x + 2, 171 - (x % 2), 'bein'); }
    };
    function spaltZu(t) { return t < 0.5; }
    return { gruppen, details, augen };
  },
};
