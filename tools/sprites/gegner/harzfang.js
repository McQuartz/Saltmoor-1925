// Wald (Akt III): Der Harzfang. Im Wald hängt das einzige Licht in Harztropfen von den Wurzeln.
// Einer dieser Tropfen ist keiner: Er hängt an einem Faden, hat sechs Beine, die er wie einen
// Schirm um sich legt, und in seinem Bernstein schwimmt ein Gesicht, das er irgendwann gefangen hat.
// Was er berührt, klebt.
'use strict';
module.exports = {
  id: 'harzfang', biom: 'wald', zone: 'wald', w: 96, h: 120, fuss: [48, 116], kopf: [48, 10], rimBis: 120,
  varianten: {
    harzfang_a: { tropfen: 1.15, beine: 6, faden: 44 },
    harzfang_b: { tropfen: 1.26, beine: 8, faden: 38, zweiGesichter: true },
  },
  // probe1 genommen: hängt am Faden, die Beine wie ein geschlossener Schirm um den Tropfen.
  // probe2 verworfen: der Tropfen sitzt am Boden, die Beine stehen gespreizt wie bei einer Spinne.
  // Las sich als gewöhnliche Riesenspinne (Klischee) und verlor das Hängen, das zum Wald gehört.
  proben: { probe1: { tropfen: 1, beine: 6, faden: 46 }, probe2: { tropfen: 1, beine: 6, faden: 46, boden: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, S = v.tropfen;
    let dy = 0, dx = 0, offen = 0, zuck = [0, 0, 0, 0, 0, 0, 0, 0], puls = 0, fall = 0, augen = true, riss = false;
    if (p.idle) { offen = 0.18; puls = [0, 0.4, 0.8, 0.4][f]; zuck = [[0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]][f]; }
    // Angriff: zieht sich am Faden hoch, spreizt die Beine, lässt sich fallen und greift nach vorn, zieht sich zurück
    if (p.angriff) { dy = [-8, -12, 14, 2][f]; dx = [1, 2, -14, -4][f]; offen = [0.3, 1, 0.7, 0.2][f]; puls = [1, 2, 3, 1][f]; }
    if (p.treffer) { dx = [4, 2][f]; dy = [-2, -1][f]; offen = 0.15; }
    if (p.tod) { riss = f >= 1; fall = riss ? r(Math.min(1, (p.q - 0.15) * 2.2) * 44) : 0; augen = f < 1; offen = p.q * 0.6; }
    const boden = !!v.boden;
    // Tropfen: oben schmal (am Faden), unten rund und schwer
    const cx = 48 + dx, top = (boden ? 70 : v.faden) + dy + fall;
    const dh = 34 * S, dw = 13 * S;
    const tropfen = Pg([[cx - 2, top], [cx + 2, top], [cx + dw * 0.55, top + dh * 0.35], [cx + dw, top + dh * 0.68], [cx + dw * 0.8, top + dh * 0.92], [cx, top + dh], [cx - dw * 0.8, top + dh * 0.92], [cx - dw, top + dh * 0.68], [cx - dw * 0.55, top + dh * 0.35]], null, { rd: 2.5 });
    // Kopfbrust oben am Tropfen, darauf der Faden
    const brust = E(cx, top + 2, 5.5, 4.5, null, { pf: 'bevel' });
    const faden = boden ? [] : [C(cx + dx * -0.2, -2, cx, top, 0.6, 0.7, null)];
    // Beine: Wurzel an der Kopfbrust, Knie hoch und außen, Spitze unten; offen = gespreizt
    const n = v.beine, beine = [];
    for (let i = 0; i < n; i++) {
      const s = i < n / 2 ? -1 : 1, k = i % (n / 2), q = k / (n / 2 - 1 || 1); // q 0 = vorne/oben, 1 = hinten
      const bx0 = cx + s * 2, by0 = top + 2 + k * 1.2;
      // geschlossen: die Beine legen sich wie die Streben einer Laterne um den Tropfen, die Spitzen treffen sich darunter
      const L0 = (a, b2) => a + (b2 - a) * offen;
      const kx = L0(cx + s * (10 + q * 4), cx + s * (16 + q * 6)) + (s < 0 ? -1 : 0), ky = L0(top - 5 + q * 7, top - 14 + q * 4) + zuck[i];
      const mx = L0(cx + s * (dw + 6 - q * 2), cx + s * (dw + 16 + q * 4 + (s < 0 ? 8 : 0))), my = L0(top + dh * (0.5 + q * 0.15), top + dh * 0.45) + zuck[i];
      const tx = boden ? cx + s * (16 + q * 10) : L0(cx + s * (2 + q * 3), cx + s * (14 + q * 6 + (s < 0 && k === 0 ? 18 : 6))), ty = boden ? 115 : L0(top + dh + 9 + q * 4, top + dh + 2) + zuck[i];
      beine.push({ s, k, g: glied([[bx0, by0], [kx, ky], [mx, my], [tx, ty]], 1.6, 0.7, null), tip: [tx, ty] });
    }
    const hinten = beine.filter(b => b.k % 2 === 1), vorne = beine.filter(b => b.k % 2 === 0);
    const gruppen = [
      { p: faden, k: 0, pf: 'flat' },
      { p: hinten.flatMap(b => b.g), k: 0.5, tone: -0.1 },
      { p: [tropfen], k: 2, tone: 0.05 },
      { p: [brust], k: 1, tone: 0.1 },
      { p: vorne.flatMap(b => b.g), k: 0.5 },
    ];
    const augenL = [];
    const details = P => {
      // Bernstein: der Tropfen leuchtet von innen (unten am hellsten), die Haut zum Rand hin dunkel.
      // Die Füllung liegt in Randlicht-innen und Glühen, nur der Kern in Harzfarbe.
      const gx = cx - 1, gy = top + dh * 0.66;
      for (let y = r(top + 3); y <= r(top + dh); y++) for (let x = r(cx - dw); x <= r(cx + dw); x++) {
        const c = P.get(x, y); if (!c || c > 4) continue;
        const q = Math.hypot((x + 0.5 - gx) / (dw * 0.95), (y + 0.5 - gy) / (dh * 0.5)) - puls * 0.02;
        const b = A.bay(x, y);
        if (q < 0.28) P.set(x, y, b < 0.5 ? 'harz' : 'r1');
        else if (q < 0.55) P.set(x, y, b < 0.75 - (q - 0.28) * 1.5 ? 'r1' : 'glutDim');
        else if (q < 0.8) P.set(x, y, b < 0.9 - (q - 0.55) * 3 ? 'glutDim' : 'k3');
        else if (q < 0.95) P.set(x, y, b < 0.3 ? 'glutDim' : c);
      }
      P.auf(r(cx + dw * 0.45), r(top + dh * 0.45), 'r2'); P.auf(r(cx + dw * 0.5), r(top + dh * 0.5), 'r1'); P.auf(r(cx + dw * 0.4), r(top + dh * 0.41), 'r2');
      // Das Gesicht im Bernstein: dunkle Augenhöhlen, Nase, offener Mund, gegen die Wand gedrückt
      const fx = r(cx - 2), fy = r(top + dh * 0.6);
      const gesicht = (ox, oy, s2) => {
        for (const [a, b] of [[-3, -3], [-2, -3], [2, -3], [3, -3], [-4, -2], [4, -2], [-4, 2], [4, 2], [-3, 4], [-2, 5], [2, 5], [3, 4], [0, 6]]) P.auf(ox + r(a * s2), oy + r(b * s2), 'k3');
        P.auf(ox - 2, oy - 1, 'k0'); P.auf(ox + 2, oy - 1, 'k0'); P.auf(ox, oy + 1, 'k1'); P.auf(ox - 1, oy + 3, 'k0'); P.auf(ox, oy + 3, 'k0'); P.auf(ox + 1, oy + 3, 'k0');
      };
      gesicht(fx, fy, 1);
      if (v.zweiGesichter) gesicht(fx + 7, fy + 7, 0.6);
      // Augen: Er selbst hat zwei kleine, harte Augen oben an der Kopfbrust, dazu glimmt das Gesicht innen
      if (augen) { P.auge(cx - 2, top + 1, 1); P.auge(cx + 2, top + 1, 1); augenL.push([r(cx - 2), r(top + 1)], [r(cx + 2), r(top + 1)]); P.set(fx - 2, fy - 1, 'harzhell'); P.set(fx + 2, fy - 1, 'harz'); }
      // Gelenke der Beine: kleine Verdickungen mit Licht, an den Spitzen Harzfäden (kleben)
      beine.forEach((b, i) => { const [tx, ty] = b.tip; if (i % 2 === 0 && ty < 117) { P.set(r(tx), r(ty) + 1, 'glutDim'); P.set(r(tx), r(ty) + 2, 'harz'); } });
      // Faden: ab und zu ein Harzknoten
      if (!boden && !riss) for (let y = 6; y < top - 4; y += 11) P.set(r(cx), y, 'r1');
      if (riss) { P.set(r(cx), r(top - 2), 'harz'); }
    };
    // Tod: der Faden reißt (aus dem Bild), der Tropfen fällt
    if (riss) gruppen[0].p = [];
    gruppen.forEach(g => { g.anker = [0, 0]; });
    return { gruppen, details, augen: augenL };
  },
};
