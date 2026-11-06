// Das Dosenkind (Konservenfabrik). Ein Lötjunge in einer Dose so groß wie ein Fass.
// Der Deckel ist wie bei Sardinen mit dem Schlüssel aufgerollt; aus der Öffnung schauen Kopf mit
// Schiebermütze und zwei dünne Arme. Kein Etikett, nur der Stempel mit dem Datum von morgen.
'use strict';
module.exports = {
  id: 'dosenkind', biom: 'fabrik', zone: 'fabrik', w: 96, h: 120, fuss: [50, 115], kopf: [46, 34], rimBis: 112,
  varianten: {
    dosenkind_a: { breit: 17, oben: 72, konisch: 0, muetze: true, rolle: 1 },
    dosenkind_b: { breit: 15, oben: 66, konisch: 4, muetze: false, rolle: -1 },
  },
  skizzen: { skizze_liegend: { breit: 17, oben: 72, konisch: 0, muetze: true, rolle: 1, liegend: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, b = v.breit, k = v.konisch;
    // tk = Kippen der Dose (oben verschoben), dz = Dose rollt, kopfY = Kopf taucht ein/auf
    let tk = 0, dz = 0, kopfY = 0, armA = 0, fall = 0, lean = 0;
    if (p.idle) { dz = [0, 0, 1, 1][f]; kopfY = [0, 1, 1, 0][f]; armA = [0, 0, 0, 0][f]; }
    if (p.angriff) { tk = [3, 5, -6, -2][f]; dz = [1, 2, -7, -3][f]; kopfY = [3, 6, -5, -1][f]; armA = [0, 0, -9, -3][f]; }
    if (p.treffer) { tk = [3, 1][f]; dz = [2, 1][f]; kopfY = [4, 2][f]; armA = [2, 1][f]; }
    if (p.tod) { tk = r(p.q * 6); kopfY = r(p.q * 14); fall = r(p.q * 6); armA = r(p.q * 4); }
    const cx = 50 + dz, yb = 113, yt = v.oben + fall;
    if (v.liegend) {
      // Skizze: liegende Dose, Kopf aus dem offenen Ende links
      const dose = Pg([[cx - 26, 88], [cx + 22, 88], [cx + 24, 100], [cx + 22, 113], [cx - 26, 113]], null, { rd: 1 });
      const kopf = E(cx - 30, 96, 8, 8, 'haut');
      return { gruppen: [{ p: [kopf], k: 0, anker: [dz, kopfY] }, { p: [dose], k: 1 }], details: P => { P.set(cx - 34, 95, 'kern'); }, augen: [[cx - 34, 95]] };
    }
    // Dose: Zylinder mit gekipptem Oberteil; vorne die Öffnungskante, hinten der Rand
    const xl0 = cx - b, xr0 = cx + b, xl1 = cx - b + k + tk, xr1 = cx + b - k + tk;
    const rueckRand = E(cx + tk, yt, b - k, 4, 'dunkel', { pf: 'flat' });
    const dose = Pg([[xl1, yt], [xl1 + 2, yt + 3], [cx + tk, yt + 4], [xr1 - 2, yt + 3], [xr1, yt], [xr0, yb - 3], [xr0 - 3, yb], [xl0 + 3, yb], [xl0, yb - 3]], null, { rd: 1 });
    const boden = C(xl0 + 1, yb - 1, xr0 - 1, yb - 1, 1.6, 1.6, 'dunkel');
    // Kind: Kopf (zu groß), Hals verschwindet in der Dose; Mütze mit Schirm nach vorn (links)
    const hx = cx - 3 + tk, hy = yt - 12 + kopfY;
    const kopf = E(hx, hy, 8, 8.5, 'haut', { pf: 'bevel' });
    const hals = C(hx + 1, hy + 6, hx + 2, yt + 6, 3.5, 3.5, null);
    const muetze = v.muetze ? [Pg([[hx - 8, hy - 3], [hx - 4, hy - 9], [hx + 5, hy - 10], [hx + 10, hy - 6], [hx + 9, hy - 2]], 'dunkel', { rd: 1 }), C(hx - 14, hy - 2, hx - 4, hy - 3, 1, 1.2, 'dunkel')] : [E(hx + 7, hy + 1, 2.2, 3, 'haut'), C(hx - 4, hy - 7, hx - 7, hy - 9, 1, 0.6, null), C(hx + 1, hy - 8, hx + 1, hy - 11, 1, 0.6, null), C(hx + 5, hy - 6, hx + 8, hy - 8, 1, 0.6, null)];
    // Arme: aus der Öffnung über die Vorderkante, hängen außen an der Dose herab, Finger lang
    // linker Arm viel zu lang: knickt hoch über den Rand und stützt sich vor der Dose auf den Boden (so rollt es)
    const hdL = p.angriff ? [[xl0 - 16, 112], [xl0 - 12, 104], [xl0 - 26, 86], [xl0 - 22, 104]][f] : p.tod ? [xl0 - 14 + armA, 112] : [xl0 - 14 + armA, 112];
    const elL = p.angriff ? [[xl1 - 6, yt - 18], [xl1 - 2, yt - 24], [xl1 - 18, yt - 8], [xl1 - 12, yt - 14]][f] : [xl1 - 9 + armA, yt - 20 + (p.tod ? r(p.q * 16) : 0)];
    const armL = [...glied([[hx - 3, yt + 1], [xl1 - 3, yt - 6], elL], 2.2, 1.7, 'haut'), E(elL[0], elL[1], 2.1, 2.1, 'haut'), ...glied([elL, hdL], 1.7, 1.1, 'haut'), E(hdL[0] - 1, hdL[1] - 1, 2.6, 1.6, 'haut'), C(hdL[0] - 1, hdL[1], hdL[0] - 6, hdL[1] + 1, 0.7, 0.6, 'haut'), C(hdL[0] - 1, hdL[1] - 1, hdL[0] - 5, hdL[1] - 3, 0.7, 0.6, 'haut')];
    // rechter Arm hält den Schlüssel der eigenen Dose
    const armR = glied([[hx + 4, yt + 2], [hx + 9, yt - 6], [xr1 + 7, yt - 9 - (p.idle ? [0, 0, 1, 1][f] : 0)]], 1.5, 1.0, 'haut');
    // Aufgerollter Deckel am Schlüssel (hinten rechts), Schlüsselgriff steht ab
    const rx = xr1 - 2 + v.rolle * 0, ry = yt - 3;
    const rolle = [E(rx, ry, 5.5, 5, null, { pf: 'bevel' })];
    const schluessel = [C(rx + 3, ry - 1, rx + 8, ry - 5, 0.8, 0.8, null), E(rx + 10, ry - 7, 2.8, 2.8, null)];
    const gruppen = [
      { p: [rueckRand], k: 0, noRim: true },
      { p: [hals], k: 0 },
      { p: [kopf], k: 0, anker: [dz, kopfY] },
      { p: muetze, k: 1, anker: [dz, kopfY] },
      { p: [dose, boden], k: 1, anker: [dz, 0] },
      { p: schluessel, k: 0 },
      { p: rolle, k: 0 },
      { p: armR, k: 0.5 },
      { p: armL, k: 0.5 },
    ];
    const augen = [];
    const details = P => {
      // Sicken (Rillen) auf der Dose: leicht gebogene Ringe, Vorderkante der Öffnung hell
      for (const yy of [yt + 12, yt + 22, yt + 32]) {
        if (yy > yb - 4) continue;
        const q = (yy - yt) / (yb - yt), xl = xl1 + (xl0 - xl1) * q, xr = xr1 + (xr0 - xr1) * q;
        for (let x = Math.ceil(xl + 2); x <= xr - 2; x++) { const u = (x - (xl + xr) / 2) / ((xr - xl) / 2); P.auf(x, r(yy + 2 * (1 - u * u)), 'k0'); P.auf(x, r(yy + 2 * (1 - u * u)) - 1, 'k3'); }
      }
      for (let x = r(xl1 + 2); x <= r(xr1 - 3); x++) { const u = (x - (xl1 + xr1) / 2) / ((xr1 - xl1) / 2); P.auf(x, r(yt + 3.5 * (1 - u * u)) + 1, 'r1'); }
      // Blechglanz: senkrechter Streifen rechts der Mitte, gedithert
      for (let y = r(yt + 5); y < yb - 3; y++) { const q = (y - yt) / (yb - yt), xr = xr1 + (xr0 - xr1) * q; P.auf(r(xr - 6), y, (y & 1) ? 'k3' : 'r1'); if ((y + 1) % 3) P.auf(r(xr - 8), y, 'k3'); if (y % 4 === 0) P.auf(r(xr - 10), y, 'k3'); }
      // Rolle: Spirale aus zwei Ringen
      P.el(rx + 0.5, ry + 0.5, 3.6, 3.2, 'k0', true); P.el(rx + 0.5, ry + 0.5, 2.4, 2.1, 'k3', true); P.el(rx + 0.5, ry + 0.5, 1.3, 1.1, 'k0', true); P.auf(r(rx), r(ry), 'k2'); P.auf(r(rx + 10), r(ry - 7), 'k0');
      // Stempel: kein Etikett, nur der Datumsfleck
      const sx = r(cx - 4 + tk / 2), sy = r(yt + 16);
      for (const [a, c] of [[0, 'rost'], [2, 'rost'], [3, 'rost'], [5, 'rost'], [7, 'rost'], [8, 'rost']]) P.auf(sx + a, sy, c);
      P.auf(sx + 1, sy + 1, 'rost'); P.auf(sx + 4, sy + 1, 'rost'); P.auf(sx + 6, sy + 1, 'rost');
      // Aus der Dose kommt Licht: die Lake leuchtet trüb und beleuchtet das Gesicht von unten
      if (!p.tod || f < 2) { P.glow(hx - 1, yt + 1, 16, 1.5, 'glutDim', 'k3'); P.glow(hx - 2, yt - 1, 7, 0.8, 'r1', 'glutDim'); for (let x = r(xl1 + 3); x <= r(xr1 - 4); x++) { const u = (x - (xl1 + xr1) / 2) / ((xr1 - xl1) / 2); if (Math.abs(u) < 0.8 && P.get(x, r(yt + 2)) && (x & 1)) P.set(x, r(yt + 2), 'glut'); } }
      // Gesicht: große Augen, trüb und hell, ein kleiner offener Mund
      if (!p.tod || f < 1) {
        const ex = r(hx - 5), ey = r(hy + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 5, ey, 'glut'); P.set(ex + 5, ey + 1, 'glutDim');
        P.glow(ex + 3, ey + 0.5, 5, 0.6);
        P.set(ex + 2, ey + 4, 'k0'); if (p.angriff && f === 2) { P.set(ex + 2, ey + 5, 'k0'); P.set(ex + 3, ey + 5, 'k0'); }
        augen.push([ex, ey], [ex + 5, ey]);
      }
      // Lake spritzt, wenn die Dose platzt
      if (p.tod && f >= 2 && f <= 4) for (let i = 0; i < 14; i++) { const a = -Math.PI * (0.1 + 0.8 * ((i * 7) % 13) / 13), d = 6 + f * 5 + (i % 3) * 3; P.set(r(cx + Math.cos(a) * d * 1.4), r(yt + 6 + Math.sin(a) * d * 0.6 + f * 2), i % 3 ? 'r1' : 'glutDim'); }
    };
    return { gruppen, details, augen };
  },
};
