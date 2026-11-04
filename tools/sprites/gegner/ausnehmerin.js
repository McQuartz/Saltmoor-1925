// Die Ausnehmerin (Konservenfabrik). Fischausnehmerin mit Kopftuch und bodenlanger Gummischürze.
// Ihr Messerarm existiert in allen Stellungen des Schnitts zugleich (Chronofotografie): ein Fächer
// aus Armen mit dünnen Klingen. In der anderen Hand hängt ein Hering, dessen Auge noch glänzt.
'use strict';
module.exports = {
  id: 'ausnehmerin', biom: 'fabrik', zone: 'fabrik', w: 96, h: 120, fuss: [56, 115], kopf: [52, 18], rimBis: 112,
  varianten: {
    ausnehmerin_a: { arme: 5, spreiz: 1, cx: 56, knoten: true, fische: 1, buckel: 0 },
    ausnehmerin_b: { arme: 4, spreiz: 0.85, cx: 57, knoten: false, fische: 2, buckel: 3, schuerze: 2 },
  },
  // Silhouetten-Skizzen (nur Vorschau, nicht gebaut): Fächer aus der Schulter gegen einen Kamm aus parallelen Armen
  skizzen: {
    skizze_kamm: { arme: 5, spreiz: 1, cx: 56, knoten: true, fische: 1, buckel: 6, kamm: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, cx = v.cx, B = v.buckel || 0, sch = v.schuerze || 0;
    // Pose: lean (Oberkörper), rot (Fächer dreht im Uhrzeigersinn = nach oben), aus (Arme strecken), spr (Spreizung)
    let lean = 0, atem = 0, rot = 0, aus = 0, spr = v.spreiz, fall = 0, tick = 0, fisch = 0;
    let nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; tick = [0, 1, 2, 1][f]; fisch = [0, 1, 0, -1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; rot = [0.5, 0.95, -0.55, -0.15][f]; aus = [0, -1, 6, 2][f]; spr = v.spreiz * [0.8, 0.65, 1.25, 1.05][f]; fisch = [1, 2, -2, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; rot = [0.25, 0.1][f]; spr = v.spreiz * [1.3, 1.1][f]; fisch = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 26); rot = -0.9 * p.q; spr = v.spreiz * (1 - 0.6 * p.q); lean = r(p.q * 3); aus = -r(p.q * 4); }
    const T = atem + fall;
    const top = 44 + B + T; // Schulterlinie
    const ox = lean - B;     // Neigung nach vorn (links)
    // Stiefel, Schürze bis zum Boden (steifes Gummi, glatter Saum, unten weiter)
    const stiefel = [E(cx - 6, 113, 5, 2.5, 'dunkel'), E(cx + 6, 113, 5, 2.5, 'dunkel')];
    const schuerze = Pg([[cx - 7 + r(ox / 2), top + 20], [cx + 7 + r(ox / 2), top + 20], [cx + 13 + sch, 96], [cx + 17 + sch, 111], [cx - 17 - sch, 111], [cx - 13 - sch, 96]], null, { rd: 1 });
    const rumpf = Pg([[cx - 10 + ox, top + 2], [cx - 4 + ox, top - 2], [cx + 6 + ox, top - 2], [cx + 11 + ox, top + 3], [cx + 8 + r(ox / 2), top + 15], [cx + 6 + r(ox / 2), top + 22], [cx - 6 + r(ox / 2), top + 22], [cx - 8 + r(ox / 2), top + 15]], null, { rd: 1.5 });
    const latz = [C(cx - 5 + ox, top + 1, cx - 7 + r(ox / 2), top + 21, 0.6, 0.8, 'dunkel'), C(cx + 2 + ox, top - 1, cx + 3 + r(ox / 2), top + 21, 0.6, 0.8, 'dunkel'), C(cx - 6 + r(ox / 2), top + 21, cx + 6 + r(ox / 2), top + 21, 0.8, 0.8, 'dunkel')];
    // Kopf mit Kopftuch: Tuch rund über Kopf und Nacken, Knoten hinten (rechts)
    const hx = cx - 4 + ox - r(B / 2), hy = top - 9 + r(B / 2) + nick;
    const gesicht = E(hx - 1, hy + 1, 5, 6, 'haut');
    const tuch = Pg([[hx - 6, hy - 1], [hx - 3, hy - 7], [hx + 3, hy - 8], [hx + 7, hy - 4], [hx + 8, hy + 3], [hx + 5, hy + 8], [hx + 1, hy + 6], [hx - 1, hy - 1]], null, { rd: 1.2 });
    const knoten = v.knoten ? [E(hx + 8, hy + 2, 2.5, 2.2, null), C(hx + 9, hy + 2, hx + 15, hy + 1 + (p.idle ? [0, 0, 1, 1][f] : 2), 1.3, 0.8, null), C(hx + 9, hy + 3, hx + 14, hy + 7, 1.1, 0.6, null)] : [C(hx - 4, hy + 6, hx + 2, hy + 9, 1.4, 1.2, null)];
    // Hinterer Arm hängt, hält den Hering am Schwanz
    const hand = [cx + 19 + r(ox / 2) + fisch, top + 28];
    const armH = glied([[cx + 9 + ox, top + 3], [cx + 17 + r(ox * 0.7), top + 14], hand], 2.4, 1.5, null);
    const fische = [];
    for (let i = 0; i < v.fische; i++) {
      const fx = hand[0] + i * 3 + r(fisch / 2), fy = hand[1] + 2 + i;
      fische.push(Pg([[fx - 4, fy - 3], [fx, fy + 1], [fx + 4, fy - 3], [fx + 1, fy + 4], [fx + 3, fy + 9], [fx + 5, fy + 12], [fx + 4, fy + 15], [fx + 4, fy + 21], [fx + 2, fy + 27], [fx, fy + 29], [fx - 2, fy + 26], [fx - 3, fy + 20], [fx - 3, fy + 12], [fx - 1, fy + 4]], 'haut', { rd: 0.4 }));
    }
    // Der Fächer: ein Arm in n Stellungen des Schnitts, alle aus derselben Schulter
    const sx = cx - 8 + ox, sy = top + 3, n = v.arme, arme = [], klingen = [], spitzen = [];
    // die echte Stellung wandert im Leerlauf durch den Fächer, die anderen sind Nachbilder (dunkler)
    const echt = p.idle ? [1, 2, 3, 2][f] % n : p.angriff ? (f >= 2 ? -1 : 0) : -1;
    for (let i = 0; i < n; i++) {
      const q = n > 1 ? i / (n - 1) : 0.5;
      let a0, ax = sx, ay = sy;
      if (v.kamm) { a0 = 2.05 + (q - 0.5) * 0.2 * spr + rot * 0.6; ax = sx + 4 - i * 4; ay = sy + 2 + i * 1.5; }
      else a0 = Math.PI + (q - 0.5) * 2.3 * spr + rot;
      const l1 = 13 + aus * 0.4, l2 = 11 + aus * 0.6, knick = -0.6;
      const ell = [ax + Math.cos(a0) * l1, ay + Math.sin(a0) * l1];
      const a1 = a0 + knick, hd = [ell[0] + Math.cos(a1) * l2, ell[1] + Math.sin(a1) * l2];
      const tn = p.idle ? (i % 2 ? -0.1 : 0.05) : echt < 0 || i === echt ? 0.12 : -0.22;
      arme.push(...glied([[ax, ay], ell, hd], 2.4, 1.2, null, { tone: tn }));
      arme.push(E(ell[0], ell[1], 2, 2, null, { tone: tn })); arme.push(E(hd[0], hd[1], 1.9, 1.6, 'haut', { tone: tn }));
      const a2 = a1 + 0.1, bl = 10 + (i === 2 ? 2 : 0);
      const tip = [hd[0] + Math.cos(a2) * bl, hd[1] + Math.sin(a2) * bl];
      klingen.push(C(hd[0], hd[1], tip[0], tip[1], 1.15, 0.4, null, { pf: 'flat' }));
      spitzen.push(tip);
    }
    const gruppen = [
      { p: stiefel, k: 1 },
      { p: [schuerze], k: 2 },
      { p: armH, k: 1, anker: [0, T] },
      { p: [rumpf], k: 2, anker: [0, T] },
      { p: fische, k: 0, anker: [0, T] },
      { p: latz, k: 0, noRim: true },
      { p: knoten, k: 1, anker: [0, T] },
      { p: [tuch], k: 1, anker: [0, T] },
      { p: [gesicht], k: 0, pf: 'bevel', anker: [0, T] },
      { p: klingen, k: 0 },
      { p: arme, k: 1.2, anker: [0, T] },
    ];
    const augen = [];
    const details = P => {
      const ex = r(hx - 3), ey = r(hy + 1);
      if (!p.tod || f < 1) {
        P.set(ex, ey, 'glut'); P.set(ex + 3, ey, 'glut'); P.glow(ex + 1.5, ey + 0.5, 4, 0.6);
        P.set(ex, ey, 'kern');
        augen.push([ex, ey], [ex + 3, ey]);
        // Heringsauge: trüb, aber es glänzt
        if (v.fische) { const fx = hand[0] + r(fisch / 2) + 1, fy = hand[1] + 27; P.line(fx - 2, fy - 4, fx + 3, fy - 5, 'k0', true); P.set(fx, fy, 'glut'); P.set(fx, fy + 1, 'k0'); augen.push([fx, fy]); for (let k = 0; k < 4; k++) P.auf(fx + 1 - (k % 2), fy - 9 - k * 3, 'r1'); }
      }
      // Klingen glänzen an der Spitze, beim Schnitt alle
      spitzen.forEach(([x, y], i) => { P.set(r(x), r(y), (p.angriff && f >= 2) || i === echt ? 'kern' : 'r2'); });
    };
    return { gruppen, details, augen };
  },
};
