// Der Seepockenmann (Walkathedrale). Ein Matrose der Expedition, der sich zum Schlafen an den Kiefer des Wals lehnte.
// Auf der Seite, die dem Wal zugewandt war, sind ihm Seepocken gewachsen, so schwer, dass er schief steht:
// links ein dünner Mann, rechts ein Fels aus Kegeln, der über seinen Kopf wächst; der rechte Arm ist eine Keule.
// Falsch: Alle Seepocken öffnen sich in dieselbe Richtung, nach innen, zum Herzen. In jeder brennt ein kleines Licht.
'use strict';
module.exports = {
  id: 'seepockenmann', biom: 'walkathedrale', zone: 'walkathedrale', w: 96, h: 120, fuss: [44, 115], kopf: [34, 40], rimBis: 113,
  varianten: {
    seepockenmann_a: { hoch: 1, kegel: 26, seed: 3, keule: 1 },
    seepockenmann_b: { hoch: 1.2, kegel: 30, seed: 8, keule: 1.15, krone: true },
  },
  // verworfen: gleichmäßig bewachsen, aufrecht (liest sich als Fels oder Mumie, der Mensch ist weg)
  skizzen: { skizze_rund: { hoch: 0.8, kegel: 24, seed: 5, keule: 0.8, rund: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, heb = 0, fall = 0, glut = 1, dy = 0, cirri = 0;
    // heb: Keule gehoben (Ausholen), dann niedergeschlagen
    if (p.idle) { dy = [0, 0, 1, 1][f]; cirri = f; glut = [1, .9, 1.1, 1][f]; }
    if (p.angriff) { lean = [3, 5, -6, -2][f]; heb = [0.5, 1, -0.6, -0.2][f]; glut = [1.1, 1.2, 1.5, 1.2][f]; cirri = 4; }
    if (p.treffer) { lean = [3, 2][f]; glut = 0.6; }
    if (p.tod) { fall = r(p.q * 14); glut = Math.max(0, 1 - p.q * 2); lean = r(p.q * 3); }
    const T = fall, cx = 40 + lean, hipY = 78 + T;
    const rnd = k => { const x = Math.sin(v.seed * 91.7 + k * 12.9898) * 43758.5453; return x - Math.floor(x); };
    // dünner Mann links: Beine, Rumpf schräg zur schweren Seite, kleiner Kopf zur Seite geneigt
    const beine = [...glied([[cx - 3, hipY], [cx - 7, 96], [cx - 8, 112]], 3.4, 2.6, null), ...glied([[cx + 5, hipY], [cx + 8, 96], [cx + 9, 112]], 3.6, 2.8, 'dunkel'), E(cx - 10, 113, 5, 2.4, 'dunkel'), E(cx + 9, 113, 5, 2.4, 'dunkel')];
    const shL = [cx - 7, hipY - 30], shR = [cx + 10, hipY - 26];
    const rumpf = Pg([[cx - 5, hipY + 2], [cx + 7, hipY + 2], [shR[0] + 2, shR[1]], [shL[0] + 3, shL[1] - 2], [shL[0] - 1, shL[1] + 4]], null, { rd: 2.5 });
    const hx = cx - 9, hy = hipY - 38;
    const kopf = E(hx, hy, 5, 6, 'haut');
    const hals = C(hx + 2, hy + 4, shL[0] + 5, shL[1] + 1, 2.2, 3, null);
    const armL = glied([[shL[0] + 1, shL[1] + 2], [cx - 14, hipY - 10], [cx - 13, hipY + 6]], 2.8, 2, null);
    const handL = E(cx - 13, hipY + 7, 2.4, 2.6, 'haut');
    // Kolonie: Kegel auf rechter Schulter und Rücken, wächst über den Kopf
    const H = v.hoch, kol = [], licht = [];
    const kcx = cx + 16, kcy = hipY - 34 - 8 * H;
    const fels = v.rund ? [E(cx + 2, hipY - 22, 16, 30, null)] : [E(kcx, kcy, 13, 22 * H, null), E(kcx - 6, kcy + 16, 12, 12, null), E(kcx + 6, kcy - 14 * H, 8, 10, null)];
    // Keule: rechter Arm, zugewachsen, hängt bis zum Boden; beim Ausholen gehoben
    const ka = heb > 0 ? -0.6 - heb * 1.4 : 1.25 + heb * -0.6;
    const kl = 36 * v.keule, kb = [shR[0] + 4, shR[1] + 2];
    const ke = [kb[0] + Math.cos(ka) * kl + 6, kb[1] + Math.sin(ka) * kl];
    const keule = [C(kb[0], kb[1], ke[0], ke[1], 5, 8.5 * v.keule, null)];
    // Kegel verteilen: auf Fels und Keule; alle öffnen sich nach links (zum Herzen, das hinter dem Spieler liegt)
    const n = v.kegel;
    const kdx = ke[0] - kb[0], kdy = ke[1] - kb[1], kL = Math.hypot(kdx, kdy);
    for (let i = 0; i < n; i++) {
      const aufKeule = i % 3 === 2;
      let bx, by, dx, dy, s = 3.2 + rnd(i) * 3.4;
      if (aufKeule) {
        const t = 0.3 + rnd(i + 40) * 0.72, seite = rnd(i + 7) < 0.5 ? 1 : -1, rad = (5 + (8.5 * v.keule - 5) * t) * 0.85;
        dx = -kdy / kL * seite; dy = kdx / kL * seite; bx = kb[0] + kdx * t + dx * rad; by = kb[1] + kdy * t + dy * rad;
      } else {
        const a = -Math.PI * 0.95 + rnd(i + 3) * Math.PI * 1.5, e = v.rund ? [cx + 2, hipY - 22, 16, 30] : rnd(i + 5) < 0.6 ? [kcx, kcy, 13, 22 * H] : [kcx + 6, kcy - 14 * H, 8, 10];
        const rr = i % 4 === 0 ? 0.35 : 0.85; bx = e[0] + Math.cos(a) * e[2] * rr; by = e[1] + Math.sin(a) * e[3] * rr; dx = Math.cos(a) / e[2]; dy = Math.sin(a) / e[3]; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
      }
      // Öffnung: nach außen, aber alle nach links gezogen (zum Herzen)
      let ux = dx * 0.6 - 0.55, uy = dy * 0.6 - 0.25; const ul = Math.hypot(ux, uy); ux /= ul; uy /= ul;
      const nx = -uy, ny = ux, hgt = s * 1.3;
      kol.push(Pg([[bx + nx * s - ux * 2, by + ny * s - uy * 2], [bx + ux * hgt + nx * s * 0.5, by + uy * hgt + ny * s * 0.5], [bx + ux * hgt - nx * s * 0.5, by + uy * hgt - ny * s * 0.5], [bx - nx * s - ux * 2, by - ny * s - uy * 2]], null, { rd: 0.5 }));
      licht.push({ x: bx + ux * hgt * 0.9, y: by + uy * hgt * 0.9, an: rnd(i + 21) < 0.45, s, ux, uy, nx, ny, bx, by, hgt, keule: aufKeule });
    }
    // Krone (Variante b): Kegel auch auf dem Kopf
    const krone = v.krone ? [Pg([[hx - 4, hy - 4], [hx - 7, hy - 11], [hx - 3, hy - 9], [hx, hy - 6]], null, { rd: 0.5 }), Pg([[hx + 1, hy - 5], [hx + 1, hy - 12], [hx + 4, hy - 9], [hx + 5, hy - 3]], null, { rd: 0.5 })] : [];
    const kolKeule = kol.filter((_, i) => licht[i].keule), kolFels = kol.filter((_, i) => !licht[i].keule);
    const gruppen = [
      { p: beine, k: 1.2 },
      { p: [rumpf, hals], k: 2, anker: [lean, T] },
      { p: [...armL, handL], k: 1, anker: [lean, T] },
      { p: fels, k: 1.5, anker: [lean, T] },
      ...kolFels.map(c => ({ p: [c], k: 0, tone: 0.42 })),
      { p: [kopf, ...krone], k: 0.6, anker: [lean, T] },
      { p: keule, k: 1.5 },
      ...kolKeule.map(c => ({ p: [c], k: 0, tone: 0.42 })),
    ];
    const augen = [];
    const details = P => {
      // Kegel: Rillen, Öffnung dunkel, in jeder zweiten ein kleines Licht; Rankfüße (Cirren) tasten heraus
      licht.forEach((L, i) => {
        const x = r(L.x), y = r(L.y);
        for (let k = 1; k < L.s * 1.2; k += 2) P.auf(r(L.x - L.ux * k * 1.1 + L.uy * 1.5), r(L.y - L.uy * k * 1.1 - L.ux * 1.5), 'k0');
        P.auf(x, y, 'k0'); P.auf(x - 1, y, 'k0');
        if (L.an && glut > 0) { P.set(x, y, glut > 1.2 && i % 4 === 0 ? 'kern' : i % 3 ? 'glut' : 'mark'); if (i % 4 === 0) { P.glow(x + 0.5, y + 0.5, 4 * glut, 0.6); } augen.push([x, y]); }
        if (i % 4 === 1 && (!p.tod)) { const ph = (cirri + i) % 4; for (let k = 1; k <= 3; k++) P.set(r(L.x + L.ux * k * 1.4), r(L.y + L.uy * k * 1.2 + (ph > 1 ? k * 0.5 : -k * 0.3)), k === 3 ? 'r1' : 'k3'); }
        // Fase: die Flanke zum Licht (oben rechts) hell, die andere dunkel; Kalkring um die Öffnung
        const sg = (L.nx * 0.9 - L.ny * 0.5) > 0 ? 1 : -1;
        for (let k = 0; k <= 4; k++) { const t = k / 4, w = L.s * (1 - t * 0.5) - 0.8; P.auf(r(L.bx + L.ux * L.hgt * t + L.nx * w * sg), r(L.by + L.uy * L.hgt * t + L.ny * w * sg), k > 1 ? 'bein' : 'k3'); P.auf(r(L.bx + L.ux * L.hgt * t - L.nx * w * sg), r(L.by + L.uy * L.hgt * t - L.ny * w * sg), 'k0'); }
        P.auf(r(L.x + L.nx * 1.5 * sg), r(L.y + L.ny * 1.5 * sg), 'r1');
      });
      // Wo der Mann aufhört und die Kolonie anfängt: Haut reißt in Kalk über
      for (let k = 0; k < 8; k++) P.auf(r(shR[0] - 2 + (k % 3)), r(shR[1] - 2 + k * 2), k % 2 ? 'bein' : 'k3');
      // Hemd: Knopfleiste und Falten am dünnen Rumpf
      for (let y = r(shL[1] + 6); y < hipY; y += 3) P.auf(r(cx + 1), y, 'k3');
      for (let k = 0; k < 4; k++) P.auf(r(cx - 3 + k), r(hipY + 1), 'k0');
      // Gesicht: zur schweren Seite geneigt, ein Auge, das andere ist schon zugewachsen
      if (!p.tod || f < 1) { const ex = r(hx - 3), ey = r(hy); P.set(ex, ey, 'kern'); P.glow(ex + 0.5, ey + 0.5, 3.5, 0.6); P.auf(ex + 3, ey, 'bein'); P.auf(ex + 4, ey - 1, 'k3'); P.auf(ex, ey + 3, 'k0'); P.auf(ex + 1, ey + 3, 'k0'); augen.push([ex, ey]); }
    };
    return { gruppen, details, augen, dy };
  },
};
