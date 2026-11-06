// Saltmoor 1925 · Hintergründe: Akt III, Die Station, die nie eröffnet wurde (Biom-Paket station).
// Komposition: docs/auftrag-2/biome/station.md. Eine Untergrundbahn-Station von 1925 tief unter der Stadt, fertig
// gekachelt, nie eröffnet. Weiße Wandkacheln mit grünem Sockel, Emailblau, Messing, kaltes Bogenlampenlicht.
// Wahrzeichen: das Emailschild mit dem Namen der Station; der Name ist länger als das Schild und läuft in weißer
// Farbe über die Kacheln weiter. Falsches Detail: Züge fahren ein, keiner fährt ab; der Tunnel der Ausfahrt ist
// zugemauert, und der Mörtel ist nach außen gequollen: Man hat ihn von innen vermauert. Die Treppe nach oben endet
// an der Decke. Licht: Bogenlampen (kalt, weißviolett), Gegenlicht von oben rechts. Die Gegner tragen rosa-rotes
// Randlicht vom Haltesignal; der Hintergrund hat kein Rot außer dem einen Signal.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#05070b', '#0b1018', '#141c28', '#1f2b3c'], rand: ['#7c8ca6', '#e6eeff'], augen: '#9ff0da', nebel: ['#090c12', '#262e3a'], fern: '#2e3846' };
const KACHEL = ['#0d1114', '#141a1d', '#1b2326', '#232d30', '#2d383a', '#384446', '#455152', '#545f5f', '#656f6d', '#79817e', '#8e958f', '#a5aaa3', '#bcc0b7', '#d4d6cc'];
const GRUEN = ['#040a08', '#07110d', '#0b1914', '#10221b', '#162d24', '#1d392e', '#25463a', '#2f5648'];
const EMAIL = ['#070d22', '#0c1638', '#13214f', '#1b2e6a', '#243c86', '#2f4ea4'];
const MESSING = ['#1c1406', '#30230c', '#4a3614', '#6a4f20', '#8c6c30', '#b08e48', '#d2b46e'];
const DUNKEL = ['#030406', '#06080b', '#0a0d12', '#0f141b', '#151c25', '#1c2530'];
const STEIN = ['#07080a', '#0c0e11', '#121519', '#191d22', '#21262c', '#2a3037', '#343b43', '#3f474f', '#4b545c'];
const ZIEGEL = ['#0b0807', '#130e0c', '#1c1512', '#251c18', '#30251f', '#3c2f27', '#4a3a30'];
const MOERTEL = ['#2a2a26', '#3c3b35', '#504e46', '#666358', '#7e7a6c'];
const LAMPE = '#e8f0ff', LAMPE_K = '#ffffff', LAMPE_G = '#1c2236', LAMPE_G2 = '#2c3656', LAMPE_M = '#a8b8e8';
const SIGNAL = '#ff3a3a', SIGNAL_G = '#2a0808';
const KANTE = ['#7c8ca6', '#e6eeff'];
const frac = v => v - Math.floor(v);
const steinMat = (ton, x) => Object.assign({ k: STEIN.slice(1, 7), r: KANTE, ton, fase: 1, rand: 2, schatten: 2 }, x || {});
const messingMat = (ton, x) => Object.assign({ k: MESSING.slice(0, 5), r: ['#b08e48', '#f0dca0'], ton, fase: 0, rand: 1 }, x || {});
const holzMat = (ton, x) => Object.assign({ k: ['#0a0705', '#140e0a', '#1e150f', '#2a1d14', '#382819'], r: ['#8a7058', '#e0cbb0'], ton, fase: 1, rand: 2, schatten: 2 }, x || {});
const eisenMat = (ton, x) => Object.assign({ k: DUNKEL.slice(0, 5), r: KANTE, ton, fase: 0, rand: 1 }, x || {});

// ---------- Kachelwand: Berliner Fliesen (9 × 5 px, versetzt), Fugen nur eine Stufe dunkler ----------
// o: lichter [{x,y,r,s}], ton(x,y) Grundhelligkeit, ruhig: [x0,y0,x1,y1] Zone hinter den Gegnern (dunkler, ruhiger)
function kachelwand(K, eb, x0, y0, x1, y1, o) {
  o = o || {}; const sd = K.o.seed, gx = o.gx || 9, gy = o.gy || 5, ramp = o.ramp || KACHEL;
  const fl = o.lichter || [];
  B.feld(K.e[eb], x0, y0, x1, y1, ramp, (x, y) => {
    const row = Math.floor((y - y0) / gy), off = row % 2 ? Math.floor(gx / 2) : 0, col = Math.floor((x + off + 400) / gx);
    const fuge = ((y - y0) % gy) === gy - 1 || ((x + off + 400) % gx) === gx - 1;
    let licht = 0; for (const L of fl) licht += Math.max(0, 1 - Math.hypot(x - L.x, (y - L.y) * (L.sy || 1)) / L.r) * L.s;
    let t = (o.ton ? o.ton(x, y) : .3) + licht * .55 + B.hash(col, row, sd) * .05 + (B.fbm(x * .03, y * .05, sd + 4, 2) - .5) * .1;
    if (o.ruhig) { const [a, b, c, d] = o.ruhig; const q = Math.min(1, Math.max(0, Math.min(x - a, c - x) / 40), Math.max(0, Math.min(y - b, d - y) / 30)); t -= q * (o.ruhigTief || .14); if (fuge) return t - .1 * (1 - q) - .04 - licht * .12 * (1 - q); }
    // Glanz der Glasur oben rechts in jeder Kachel, nur wo Licht hinkommt
    if (!fuge && licht > .25 && ((y - y0) % gy) === 0 && ((x + off + 400) % gx) === gx - 2) t += .08;
    return fuge ? t - .1 - licht * .12 : t;
  });
}
// Sockel aus grünen Kacheln (Kennfarbe), mit einer Zierreihe oben
function sockel(K, eb, x0, y0, x1, y1, o) {
  o = o || {}; const sd = K.o.seed, fl = o.lichter || [];
  B.feld(K.e[eb], x0, y0, x1, y1, GRUEN, (x, y) => {
    const fuge = ((y - y0) % 6) === 5 || ((x + 400) % 6) === 5;
    let licht = 0; for (const L of fl) licht += Math.max(0, 1 - Math.hypot(x - L.x, (y - L.y)) / L.r) * L.s;
    let t = .3 + licht * .5 + (B.hash(Math.floor((x + 400) / 6), Math.floor((y - y0) / 6), sd + 1) - .5) * .1 - (y - y0) / (y1 - y0) * .12;
    if (y - y0 < 2) t = .75 + licht * .3;
    return fuge ? t - .12 : t;
  });
}
// Gewölbe: Tonnendecke, dunkel, Kacheln nur angedeutet, Rippen
function gewoelbe(K, y1, o) {
  o = o || {}; const sd = K.o.seed;
  B.feld(K.e[0], -M, -M, W + M, y1, DUNKEL.concat([KACHEL[3], KACHEL[4]]), (x, y) => {
    const q = (y + M) / (y1 + M); const rippe = (Math.abs(((x + 400) % 96) - 48) > 45) ? -.12 : 0;
    return .1 + q * q * .45 + rippe + (B.fbm(x * .02, y * .06, sd + 9, 2) - .5) * .08 + ((Math.floor((x + 400) / 9) + Math.floor(y / 5)) % 2 ? 0 : .02);
  });
}
// Bogenlampe an einer Stange aus der Decke: Glaskugel, kaltes Licht, Lichtfleck auf der Wand
function bogenlampe(K, eb, x, y, s, o) {
  o = o || {}; s = s || 1; const top = o.top === undefined ? -M : o.top;
  const st = B.maske(); st.kap(x, top, x, y - 6 * s, .8 * s, .8 * s); st.kap(x - 4 * s, y - 6 * s, x + 4 * s, y - 6 * s, .9 * s, .9 * s); K.form(eb, st, 0, eisenMat(1.3));
  const k = B.maske(); k.ell(x, y, 4.2 * s, 5 * s); B.form(K.e[eb], k, { k: [B.pk(LAMPE_G2), B.pk('#56628a'), B.pk(LAMPE_M), B.pk(LAMPE)], ton: 2.2, fase: 1.5, rand: 0, verlauf: .4 });
  K.e[eb].set(x, y - 1, B.pk(LAMPE_K)); K.e[eb].set(x + 1, y - 1, B.pk(LAMPE_K));
  for (const i of o.ebenen || [0, 1]) B.gluehen(K.e[i], x, y, (o.r || 40) * s, LAMPE_G, .9);
  K.licht(x, y, LAMPE_M, 80 * s, .5);
  const g = B.glanzSprite(9 * s, LAMPE_G2, .8), ph = x * .37;
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { const fl = Math.sin(t * 23 + ph) + Math.sin(t * 7.1 + ph) * .5; if (fl < -1.1) return; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}
// Emailschild: blaue Tafel mit weißem Rand und weißen Zeichen; der Name läuft über das Schild hinaus in weißer
// Farbe weiter über die Kacheln (jede Nacht ein Zeichen mehr), das letzte ist halb fertig
function zeichen(e, x, y, w, h, n, seed, c, roh) {
  const r = B.rng(seed); const pc = B.pk(c);
  for (let i = 0; i < n; i++) {
    const cx = x + i * (w + 2), m = r.i(0, 15) | 1, halb = roh && i === n - 1;
    const strich = (a, b, c2, d) => { B.linie(e, cx + a, y + b, cx + c2, y + d, pc, roh ? .85 : undefined); };
    if (m & 1) strich(0, 0, 0, h - 1);
    if (m & 2 && !halb) strich(w - 1, 0, w - 1, h - 1);
    if (m & 4) strich(0, 0, w - 1, 0);
    if (m & 8 && !halb) strich(0, Math.floor(h / 2), w - 1, Math.floor(h / 2));
    if ((m & 6) === 6 && !halb) strich(0, h - 1, w - 1, h - 1);
    if (r() < .25 && !halb) strich(0, 0, w - 1, h - 1);
  }
}
function emailschild(K, eb, x, y, w, h, o) {
  o = o || {}; const e = K.e[eb];
  const m = B.maske(); m.rect(x, y, w, h); B.form(e, m, { k: EMAIL.map(B.pk), r: [B.pk('#8090c0'), B.pk('#dfe6ff')], ton: o.ton || 2.4, fase: 1, rand: 1, muster: (px, py) => (B.fbm(px * .08, py * .2, 3, 2) - .5) * .4 });
  // weißer Rand innen, Schrauben in Messing
  for (let i = 1; i < w - 1; i++) { e.set(x + i, y + 1, B.pk('#b8c2d8')); e.set(x + i, y + h - 2, B.pk('#8a94ac')); }
  for (let j = 1; j < h - 1; j++) { e.set(x + 1, y + j, B.pk('#8a94ac')); e.set(x + w - 2, y + j, B.pk('#b8c2d8')); }
  for (const [a, b] of [[3, 3], [w - 4, 3], [3, h - 4], [w - 4, h - 4]]) e.set(x + a, y + b, B.pk(MESSING[5]));
  // abgeplatzte Emaille: schwarze Flecken mit Rost
  const r = B.rng(K.o.seed * 7 + 2); for (let i = 0; i < 4; i++) { const px = x + r.i(4, w - 5), py = y + r.i(2, h - 3); e.set(px, py, B.pk('#05060a')); e.set(px + 1, py, B.pk('#2a1a10')); }
  const zw = o.zw || Math.max(3, Math.round(h * .36)), zh = Math.max(4, h - 8), n = Math.floor((w - 10) / (zw + 2));
  zeichen(e, x + 5, y + 4, zw, zh, n, 4711, '#e8ecf4');
  // Überlauf: weitere Zeichen auf den Kacheln, mit dem Pinsel, das letzte halb
  const extra = (o.extra || 3) + Math.round(K.fr * 2);
  zeichen(e, x + w + 2, y + 4, zw, zh, extra, 815 + extra, '#c8ccc4', true);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { if (Math.sin(t * .7) > .96) { ctx.fillStyle = '#dfe2d8'; ctx.fillRect(x + w + 2 + extra * (zw + 2) + ox, y + 4 + zh - 2 + oy, 1, 2); } } });
}
// Tunnelmund: Rundbogen, innen schwarz mit Ringen in die Tiefe; Gleise laufen hinein; Signal rot
function tunnelmund(K, eb, x, y, w, h, o) {
  o = o || {}; const e = K.e[eb], cx = x + w / 2, rb = w / 2;
  const innen = (px, py) => py >= y + rb ? (px >= x && px < x + w) : Math.hypot(px - cx, py - (y + rb)) <= rb;
  const rand = B.maske(); rand.fn(x - 7, y - 7, x + w + 7, y + h, (px, py) => { const d = py >= y + rb ? Math.max(x - px, px - x - w) : Math.hypot(px - cx, py - (y + rb)) - rb; return d > 0 && d < 6; }); K.form(eb, rand, 0, steinMat(1.7, { k: KACHEL.slice(3, 10) }));
  if (o.vermauert) {
    // Ziegel vermauert, Mörtel quillt aus jeder Fuge nach vorn (zu dir): von innen gemauert
    B.feld(e, x, y, x + w, y + h, ZIEGEL, (px, py) => { if (!innen(px, py)) return -1; const row = Math.floor((py - y) / 4), off = row % 2 ? 4 : 0, fuge = ((py - y) % 4) === 3 || ((px - x + off) % 9) === 8; return fuge ? -1 : .35 + B.hash(Math.floor((px - x + off) / 9), row, 5) * .25 - (py - y) / h * .1 + (o.licht ? Math.max(0, 1 - Math.hypot(px - o.licht[0], py - o.licht[1]) / o.licht[2]) * .5 : 0); });
    const mp = MOERTEL.map(B.pk);
    for (let py = y; py < y + h; py++) for (let px = x; px < x + w; px++) { if (!innen(px, py)) continue; const row = Math.floor((py - y) / 4), off = row % 2 ? 4 : 0; const fuge = ((py - y) % 4) === 3 || ((px - x + off) % 9) === 8; if (!fuge) continue;
      const q = B.hash(px, py, 77); e.set(px, py, mp[q < .35 ? 3 : q < .7 ? 2 : 1]);
      // Wülste: unterhalb der waagerechten Fuge hängt Mörtel heraus, mit Lichtkante oben
      if (((py - y) % 4) === 3 && B.hash(Math.floor(px / 3), row, 9) < .55) { e.set(px, py + 1, mp[1]); if (B.hash(px, row, 3) < .3) e.set(px, py + 2, mp[0]); e.set(px, py, mp[4]); } }
    // ein paar Ziegel frischer, ein Handabdruck im Mörtel
    return { innen };
  }
  B.feld(e, x, y, x + w, y + h, DUNKEL, (px, py) => { if (!innen(px, py)) return -1; const d = py >= y + rb ? Math.min(px - x, x + w - px) / rb : 1 - Math.hypot(px - cx, py - (y + rb)) / rb; const ring = frac(d * 5 + .2) < .12 ? .12 : 0; return .3 - d * .5 + ring + (o.glimm ? Math.max(0, .6 - d) * o.glimm : 0); });
  if (o.signal) { const [sx, sy] = o.signal; e.set(sx, sy, B.pk(SIGNAL)); e.set(sx, sy + 1, B.pk('#a01818')); B.gluehen(e, sx, sy, 9, SIGNAL_G, .9); K.licht(sx, sy, SIGNAL, 30, .3); K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { if (Math.sin(t * 1.3) > .2) { ctx.fillStyle = '#ffb0a8'; ctx.fillRect(sx + ox, sy + oy, 1, 1); } } }); }
  return { innen };
}
// Gleisbett: Schotter dunkel, Schwellen, zwei Schienen mit Glanz (frontal, waagerecht)
function gleisbett(K, eb, y0, y1, o) {
  o = o || {}; const sd = K.o.seed, e = K.e[eb];
  B.feld(e, -M, y0, W + M, y1, STEIN.slice(0, 6), (x, y) => .15 + B.hash(x >> 1, y >> 1, sd) * .3 + (y - y0) / (y1 - y0) * .2 - (B.hash(Math.floor((x + 400) / 14), 0, sd) < .5 && (x + 400) % 14 < 6 && y > y0 + 4 && y < y1 - 3 ? -.1 : 0));
  for (const ry of [y0 + 5, y1 - 6]) for (let x = -M; x < W + M; x++) { e.set(x, ry, B.pk(B.hash(x >> 3, ry, sd) < .2 ? '#8a96a8' : '#3a4452')); e.set(x, ry + 1, B.pk(DUNKEL[3])); e.set(x, ry + 2, B.pk(DUNKEL[1])); }
  // Stromschiene seitlich, Holzabdeckung
  for (let x = -M; x < W + M; x++) { e.set(x, y0 + 1, B.pk(DUNKEL[4])); e.set(x, y0 + 2, B.pk('#2a1d14')); }
}
// Bahnsteig: Asphalt mit Fluchtlinien, weiße Kante hinten; Licht der Lampen; Pfützen
function bahnsteig(K, P, y0, o) {
  o = o || {}; const sd = K.o.seed;
  K.boden(y0, H + M, STEIN, (x, y) => {
    if (y < y0 + 3) return y === y0 ? .55 : .85 - (y - y0) * .1; // weiße Kante
    const X = P.X(x, y), Z = P.z(y + .5);
    const platte = Math.abs(frac(X * 1.2) - .5) > .47 || Math.abs(frac(Z * .7) - .5) > .46;
    let licht = 0; for (const L of o.lichter || []) licht += Math.max(0, 1 - Math.hypot(x - L.x, (y - L.y) * 2.2) / L.r) * L.s;
    return (platte ? .14 : .26) + licht * .5 + (B.fbm(X * 2, Z * .6, sd + 3, 2) - .5) * .12 + Math.min(.12, 2 / Z) * .4;
  });
}
// Bank aus Holz mit Eisenbeinen (frontal)
function bank(K, eb, x, y, w, tiefe) { const m = B.maske(); m.rect(x, y - 14, w, 4); m.rect(x, y - 24, w, 3); m.rect(x, y - 30, w, 3); m.rect(x + 3, y - 14, 4, 14); m.rect(x + w - 7, y - 14, 4, 14); m.rect(x + 3, y - 31, 3, 18); m.rect(x + w - 6, y - 31, 3, 18); K.form(eb, m, tiefe || 0, holzMat(1.3)); }
// Koffer (Fundstelle)
function koffer(K, eb, x, y) { const m = B.maske(); m.rect(x - 12, y - 14, 24, 14); m.kap(x - 4, y - 16, x + 4, y - 16, 1, 1); K.form(eb, m, 0, holzMat(1.7, { k: ['#120a08', '#1e110c', '#2c1912', '#3c2418', '#4c301f'], muster: (px, py) => (Math.abs(px - x) < 1 || py === y - 7 ? -.6 : 0) })); K.e[eb].set(x - 8, y - 9, B.pk(MESSING[5])); K.e[eb].set(x + 8, y - 9, B.pk(MESSING[5])); }

// =====================================================================
// Variante 0: Die Gleiswand. Frontal über das Gleis: drüben die gekachelte Wand mit dem Emailschild, links der
// Tunnel der Einfahrt mit dem roten Signal, rechts der Tunnel der Ausfahrt, zugemauert. Lampen an den Seiten.
function gleiswand(K) {
  const fr = K.fr, vy = 150, P = B.persp(240, 112, H); K.split = [158, 172];
  gewoelbe(K, 32);
  const lichter = [{ x: 96, y: 40, r: 140, s: .7 }, { x: 384, y: 40, r: 140, s: .7 }, { x: 240, y: 22, r: 120, s: .55 }];
  kachelwand(K, 0, -M, 26, W + M, 104, { lichter, ton: (x, y) => .28 + (y < 30 ? -.1 : 0), ruhig: [80, 60, 400, 104], ruhigTief: .18 });
  sockel(K, 0, -M, 104, W + M, 130, { lichter: [{ x: 96, y: 100, r: 70, s: .3 }, { x: 384, y: 100, r: 70, s: .3 }] });
  // Zierband aus Emailkacheln unter dem Gewölbe
  B.feld(K.e[0], -M, 26, W + M, 30, EMAIL, (x, y) => (y === 26 ? .7 : .45) + ((x + 400) % 9 === 8 ? -.2 : 0));
  tunnelmund(K, 1, -40, 40, 92, 92, { signal: [36, 70], glimm: .2 * fr });
  tunnelmund(K, 1, 428, 40, 92, 92, { vermauert: true, licht: [440, 60, 70] });
  emailschild(K, 1, 156, 42, 136, 18, { extra: 3 });
  bogenlampe(K, 1, 96, 22, 1.2, { top: 30 }); bogenlampe(K, 1, 384, 22, 1.2, { top: 30 }); bogenlampe(K, 1, 240, 12, 1, { top: -M });
  gleisbett(K, 1, 130, 150);
  bahnsteig(K, P, vy, { lichter: [{ x: 96, y: 160, r: 160, s: .35 }, { x: 384, y: 160, r: 160, s: .35 }] });
  // Bänke an der Wand drüben (klein, über dem Sockel), Uhrensäule? nein: ein Fahrplankasten, leer
  const fk = B.maske(); fk.rect(318, 66, 22, 30); K.form(1, fk, .1, holzMat(1.4)); B.feld(K.e[1], 321, 69, 337, 93, KACHEL.slice(1, 5), (x, y) => .3 + ((y - 69) % 4 === 0 ? .4 : 0));
  // Vordergrund: Säule links angeschnitten, Bank rechts vorne
  const v = B.maske(); v.rect(-M, -M, 30, H + 2 * M); v.rect(-M, -M, 38, 10); K.form(5, v, 0, steinMat(1.1, { k: GRUEN.slice(0, 6), r: KANTE, muster: (px, py) => ((py + 400) % 6 === 5 || (px + 400) % 6 === 5 ? -.4 : 0) }));
  B.partikel(K, { n: 18, farben: [KACHEL[6], KACHEL[9]], vx: 2, vy: 1, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 240, p: .8 });
  K.reihen = [{ y: 168, skala: .9, nebel: .12 }, { y: 192, skala: 1, nebel: .04 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Variante 1: Der Zug am Bahnsteig. Ein Zug steht drüben am Gleis, die Fenster schwach erleuchtet, voll; rechts
// drückt seine Stirn gegen die vermauerte Ausfahrt. Über dem Dach die Wand mit dem Schild.
function zugAmBahnsteig(K) {
  const fr = K.fr, vy = 150, P = B.persp(240, 112, H); K.split = [158, 172];
  gewoelbe(K, 28);
  kachelwand(K, 0, -M, 22, W + M, 80, { lichter: [{ x: 60, y: 30, r: 130, s: .6 }, { x: 330, y: 30, r: 130, s: .6 }], ton: () => .3 });
  emailschild(K, 0, 120, 30, 130, 16, { extra: 4 });
  bogenlampe(K, 1, 60, 14, 1.1, { top: -M }); bogenlampe(K, 1, 330, 14, 1.1, { top: -M });
  // Ausfahrt rechts vermauert; der Zug steht mit der Stirn daran
  tunnelmund(K, 0, 440, 30, 70, 104, { vermauert: true, licht: [452, 50, 60] });
  // Zug: langer Wagenkasten, Dach gewölbt, Fenster in Reihe, Türen; dunkelblaugrün, Fenster gedämpft
  const zy0 = 66, zy1 = 140, zx1 = 438;
  const zug = B.maske(); zug.poly([[-M - 2, zy0 + 4], [zx1 - 6, zy0 + 4], [zx1, zy0 + 10], [zx1, zy1], [-M - 2, zy1]]); zug.poly([[-M - 2, zy0 + 4], [-M - 2, zy0 - 2], [zx1 - 14, zy0 - 2], [zx1 - 4, zy0 + 4]]);
  K.form(1, zug, 0, { k: ['#05080a', '#0a1014', '#10191e', '#172328', '#1f2e33'], r: KANTE, ton: 1.5, fase: 1, rand: 2, muster: (px, py) => (py === zy0 + 40 ? .9 : py === zy0 + 41 ? -.6 : 0) + ((px + 400) % 48 < 1 ? -.5 : 0) });
  // Fenster: Nischen, innen trübes Licht und Stehende, alle zu dir gewandt; Hände an der Scheibe
  const r = B.rng(K.o.seed * 3 + 7), e1 = K.e[1];
  for (let wx = -4; wx < zx1 - 24; wx += 48) for (const dx of [6, 26]) {
    const fx = wx + dx, fy = zy0 + 10, fw = 16, fh = 24;
    B.feld(e1, fx, fy, fx + fw, fy + fh, ['#0c1418', '#121c22', '#18252c', '#203038', '#2a3c44'], (x, y) => .45 + (y < fy + 3 ? .3 : 0) - (y - fy) / fh * .25 - (x - fx) / fw * .1 + fr * -.1);
    for (let i = 0; i < 2; i++) { const kx = fx + 4 + i * 8 + r.i(-1, 1), ky = fy + 8 + r.i(0, 3); const kk = B.maske(); kk.ell(kx, ky, 2.4, 3); kk.rect(kx - 4, ky + 4, 8, fy + fh - ky - 4); B.form(e1, kk, { k: ['#05080a', '#0a1014', '#121a20'].map(B.pk), ton: .8, fase: 0, rand: 0 }); if (r() < .6) { e1.set(kx - 1, ky, B.pk('#5a7a74')); e1.set(kx + 1, ky, B.pk('#5a7a74')); } }
    for (let i = 0; i < fw; i++) { e1.set(fx + i, fy, B.pk(DUNKEL[0])); e1.set(fx + i, fy + fh - 1, B.pk('#3a4c56')); }
  }
  // Stirn rechts an den Ziegeln: Stirnlampe, Puffer an der Wand
  const st = B.maske(); st.rect(zx1 - 4, zy0 + 10, 6, zy1 - zy0 - 10); K.form(1, st, 0, eisenMat(1.4));
  e1.set(zx1 - 2, zy0 + 52, B.pk(LAMPE)); B.gluehen(e1, zx1 - 2, zy0 + 52, 14, LAMPE_G2, .8);
  // Räder und Schatten unter dem Zug, Gleis
  gleisbett(K, 1, 140, 150);
  for (let x = 20; x < zx1; x += 48) for (const d of [0, 14]) { const rr = B.maske(); rr.ell(x + d, 141, 6, 3); K.form(1, rr, 0, eisenMat(.6, { rand: 0 })); }
  bahnsteig(K, P, vy, { lichter: [{ x: 60, y: 160, r: 140, s: .3 }, { x: 330, y: 160, r: 140, s: .3 }] });
  // Vordergrund: ein Mülleimer rechts
  const me = B.maske(); me.rect(452, 236, 16, 30); me.ell(460, 236, 9, 3); K.form(5, me, 0, eisenMat(1.4, { k: GRUEN.slice(0, 5) }));
  B.partikel(K, { n: 16, farben: [KACHEL[6], KACHEL[9]], vx: 2, vy: 1, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 240, p: .8 });
  K.reihen = [{ y: 168, skala: .9, nebel: .12 }, { y: 192, skala: 1, nebel: .04 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Variante 2: Die Vorhalle. Ein gekachelter Saal in Fluchtpunkt-Sicht; hinten die breite Treppe nach oben, die an der
// Decke endet; darüber das Emailschild; links Fahrkartenschalter mit Messinggittern; vorn die Sperrgitter.
function vorhalle(K) {
  const fr = K.fr, P = B.persp(240, 124, H); K.split = [160, 176];
  const sd = K.o.seed, xl = -2.6, xr = 2.6, yc = 2.3, ze = 5.2;
  const LAMPEN = [[-1, 2.0, 2.2], [1, 2.0, 2.2], [0, 2.0, 4.2]];
  B.feld(K.e[0], -M, -M, W + M, H + M, KACHEL, (x, y) => {
    const dx = x + .5 - P.vx, dy = y + .5 - P.vy;
    let Z = ze, fl = 'stirn';
    if (dx < 0) { const z = xl * P.h / dx; if (z > 0 && z < Z) { Z = z; fl = 'links'; } }
    if (dx > 0) { const z = xr * P.h / dx; if (z > 0 && z < Z) { Z = z; fl = 'rechts'; } }
    if (dy < 0) { const z = (1 - yc) * P.h / dy; if (z > 0 && z < Z) { Z = z; fl = 'decke'; } }
    if (dy > 0) { const z = P.h / dy; if (z < Z) return -1; }
    const Y = 1 - dy * Z / P.h, X = dx * Z / P.h;
    let licht = 0; for (const [lx, ly, lz] of LAMPEN) licht += Math.max(0, 1 - Math.hypot(X - lx, Y - ly, Z - lz) / 2.2) * .5;
    if (fl === 'decke') return .1 + licht * .3 + (Math.abs(frac(Z * 1.5) - .5) > .46 ? -.06 : 0);
    const u = fl === 'stirn' ? X : Z, fuge = Math.abs(frac(u * 7 + (Math.floor(Y * 13) % 2 ? .5 : 0)) - .5) > .44 || Math.abs(frac(Y * 13) - .5) > .42;
    let t = (Y < .55 ? .02 : .26) + licht * .6 - (fl === 'rechts' ? .06 : 0) + (B.fbm(u * 3, Y * 3, sd + 2, 2) - .5) * .08 - Z * .01;
    if (Y < .55) return (fuge ? .1 : .2) + licht * .2;
    if (Math.abs(Y - .58) < .03) t = .5 + licht * .3;
    return fuge ? t - .05 : t;
  });
  // Sockelband grün über alles, was unter Y .55 liegt: nachträglich einfärben (Kennfarbe)
  const gp = GRUEN.map(B.pk);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const dx = x + .5 - P.vx, dy = y + .5 - P.vy; let Z = ze; if (dx < 0) { const z = xl * P.h / dx; if (z > 0 && z < Z) Z = z; } if (dx > 0) { const z = xr * P.h / dx; if (z > 0 && z < Z) Z = z; } const Y = 1 - dy * Z / P.h; if (dy > 0 && P.h / dy < Z) continue; if (Y < .55 && Y > -.1) K.e[0].set(x, y, gp[(Math.abs(frac(Y * 13) - .5) > .42 || Math.abs(frac((dx < 0 || dx > 0 ? Z : 0) * 7 + dx * .01) - .5) > .46) ? 1 : 3]); }
  // Stirnwand: Treppe nach oben, die an der Decke endet
  const [ax, ay] = P.q(-1.1, 0, ze), [bx, by] = P.q(1.1, yc, ze);
  const tm = B.maske(); const stufen = 14;
  for (let i = 0; i < stufen; i++) { const q0 = i / stufen, q1 = (i + 1) / stufen; const y0 = ay - (ay - by) * q1, y1 = ay - (ay - by) * q0; tm.rect(ax - 2, y0, bx - ax + 4, y1 - y0 + .5); }
  K.form(1, tm, .15, steinMat(1.4, { k: STEIN.slice(2, 8), rand: 1, muster: (px, py) => (Math.round(py - by) % Math.max(2, Math.round((ay - by) / stufen)) === 0 ? .9 : -.1) }));
  // Geländer links und rechts der Treppe in Messing
  for (const xx of [ax - 4, bx + 3]) { const g = B.maske(); g.kap(xx, ay - 2, xx + (xx < 240 ? 3 : -3), by + 4, .9, .9); K.form(1, g, .1, messingMat(1.6)); }
  // Decke über der Treppe: eine Betonplatte, die Treppe läuft hinein
  const dp = B.maske(); dp.rect(ax - 6, by - 6, bx - ax + 12, 7); K.form(1, dp, .1, steinMat(1.2, { k: STEIN.slice(1, 6) }));
  emailschild(K, 1, 196, by - 22, 88, 13, { extra: 3, zw: 4 });
  // Fahrkartenschalter links: zwei Fenster mit Messinggitter, dahinter Dunkel
  for (const [z0, z1] of [[1.6, 2.3], [2.8, 3.4]]) {
    const pts = [P.q(xl, .9, z0), P.q(xl, 1.6, z0), P.q(xl, 1.6, z1), P.q(xl, .9, z1)]; const fm = B.maske(); fm.poly(pts); B.form(K.e[1], fm, { k: DUNKEL.slice(0, 3).map(B.pk), ton: .5, fase: 0, rand: 0 });
    const n = 6; for (let i = 0; i <= n; i++) { const z = z0 + (z1 - z0) * i / n; const [x0, y0] = P.q(xl, .9, z), [x1, y1] = P.q(xl, 1.6, z); B.linie(K.e[1], x0, y0, x1, y1, B.pk(MESSING[4])); }
    const [lx0, ly0] = P.q(xl, .88, z0), [lx1, ly1] = P.q(xl, .88, z1); B.linie(K.e[1], lx0, ly0, lx1, ly1, B.pk(MESSING[5]));
  }
  // Lampen: Kugeln an Stangen aus der Decke
  for (const [lx, ly, lz] of LAMPEN) { const [x, y] = P.q(lx, ly, lz), [, yt] = P.q(lx, yc, lz); bogenlampe(K, 1, Math.round(x), Math.round(y), Math.max(.6, 2.2 / lz), { top: yt, r: 30 }); }
  // Boden: Terrazzo in Feldern, Licht
  K.boden(P.vy + 1, H + M, STEIN, (x, y) => { const X = P.X(x, y), Z = P.z(y + .5); if (Z > ze) return -1; const feld = Math.abs(frac(X * 1.1) - .5) > .46 || Math.abs(frac(Z * 1.1) - .5) > .46; let licht = 0; for (const [lx, , lz] of LAMPEN) licht += Math.max(0, 1 - Math.hypot(X - lx, Z - lz) / 2.4) * .45; return (feld ? .16 : .28) + licht + (B.hash(x, y, sd) - .5) * .08; });
  // Sperrgitter quer durch den Mittelgrund (niedrige Geländer mit Durchlässen), Sperrhäuschen leer, rechts
  const zg = 3.0; for (const [x0, x1] of [[-2.6, -1.4], [-.9, .1], [.6, 1.4]]) { const g = B.maske(); const [a1, a2] = P.q(x0, .45, zg), [b1, b2] = P.q(x1, .45, zg), [c1, c2] = P.q(x0, 0, zg), [d1, d2] = P.q(x1, 0, zg); g.kap(a1, a2, b1, b2, 1, 1); for (let i = 0; i <= 4; i++) { const q = i / 4; g.kap(a1 + (b1 - a1) * q, a2 + (b2 - a2) * q, c1 + (d1 - c1) * q, c2 + (d2 - c2) * q, .7, .7); } K.form(K.eb(c2), g, .05, messingMat(1.4)); }
  { const [hx, hy] = P.q(1.9, 0, zg), k = P.k(zg); const hm = B.maske(); hm.rect(hx - k * .3, hy - k * .62, k * .6, k * .62); hm.rect(hx - k * .34, hy - k * .66, k * .68, k * .06); K.form(K.eb(hy), hm, .05, holzMat(1.5)); }
  // Vordergrund: Pfeiler rechts angeschnitten
  const v = B.maske(); v.rect(462, -M, 40, H + 2 * M); K.form(5, v, 0, steinMat(1.1, { k: GRUEN.slice(0, 6) }));
  B.partikel(K, { n: 18, farben: [KACHEL[6], KACHEL[9]], vx: 1, vy: -1, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 240, p: .8 });
  K.reihen = [{ y: 170, skala: .9, nebel: .12 }, { y: 193, skala: 1, nebel: .04 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Wächter: Der Tunnelmund. Frontal vor dem großen Mund des Tunnels, aus dem der Zug kommt. Im Tunnel brennt ein
// kaltes, gleichmäßiges Licht, wo keins sein dürfte: die ruhige, helle Zone direkt hinter dem Wächter. Darüber
// das Schild, an den Seiten Kachelwand und Lampen. Ab Phase 2 wird das Licht im Tunnel dunkler und das Signal rot.
function tunnelSzene(K) {
  const fr = K.fr, ph = K.o.phase || 0, P = B.persp(240, 112, H); K.split = [160, 174];
  gewoelbe(K, 20);
  kachelwand(K, 0, -M, 16, W + M, 150, { lichter: [{ x: 50, y: 40, r: 120, s: .6 }, { x: 430, y: 40, r: 120, s: .6 }], ton: (x, y) => .3 - (y > 118 ? .15 : 0) });
  sockel(K, 0, -M, 118, W + M, 150);
  // Mund: Bogen, innen gleichmäßiges kaltes Licht, das nach hinten dichter wird
  const x0 = 120, w = 240, y0 = 26, rb = w / 2, cx = x0 + rb, hell = Math.max(0, .42 - fr * .08 - ph * .1);
  const LICHT = ['#141a26', '#1e2636', '#2a3448', '#38445c', '#485672', '#5a6a88', '#6e7e9e', '#8494b4', '#9aa8c6'];
  const innen = (px, py) => py >= y0 + rb ? (px >= x0 && px < x0 + w) : Math.hypot(px - cx, py - (y0 + rb)) <= rb;
  B.feld(K.e[0], x0, y0, x0 + w, 160, LICHT, (px, py) => { if (!innen(px, py)) return -1; const d = Math.hypot((px - cx) / rb, (py - 96) / 80); const kern = Math.max(0, 1 - Math.hypot((px - cx) / 70, (py - 104) / 46)); return hell + .22 * Math.max(0, 1 - d) + .3 * kern * kern - Math.max(0, d - .75) * .5 - (py > 140 ? (py - 140) / 20 * .35 : 0); });
  // Ringe des Tunnels, sehr flach, damit die Fläche ruhig bleibt
  for (let i = 1; i <= 3; i++) { const q = 1 - i * .2, rr = rb * q, cy = y0 + rb + 14 * (1 - q); const c = B.pk(LICHT[Math.min(8, Math.max(0, Math.round((hell + .1 * i) * 8)))]); for (let a = Math.PI; a <= 2 * Math.PI; a += .006) { const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; if (B.bay(px, py) < .5) K.e[0].set(px, py, c); } for (const s of [-1, 1]) for (let py = cy; py < 150; py++) if (B.bay(cx + s * rr, py) < .5) K.e[0].set(cx + s * rr, py, c); }
  // Rahmen des Mundes in Kacheln mit Lichtkante, Schlussstein
  const rand = B.maske(); rand.fn(x0 - 10, y0 - 10, x0 + w + 10, 152, (px, py) => { const d = py >= y0 + rb ? Math.max(x0 - px, px - x0 - w) : Math.hypot(px - cx, py - (y0 + rb)) - rb; return d > 0 && d < 9; });
  K.form(1, rand, 0, steinMat(1.8, { k: KACHEL.slice(3, 11), muster: (px, py) => ((Math.round(Math.atan2(py - y0 - rb, px - cx) * 20) % 2) ? .3 : -.1) }));
  emailschild(K, 1, 170, 4, 140, 16, { extra: 4 });
  // Gleis kommt aus dem Mund auf dich zu; links und rechts die Bahnsteige mit weißer Kante
  K.boden(150, H + M, STEIN, (x, y) => { const X = P.X(x, y), Z = P.z(y + .5), ax = Math.abs(X);
    if (ax > 1.05) { if (ax < 1.12) return .9; const pl = Math.abs(frac(Z * .8) - .5) > .46; let l = Math.max(0, 1 - Math.hypot(x - (X < 0 ? 50 : 430), y - 170) / 160) * .4; return (pl ? .16 : .26) + l + (B.hash(x >> 1, y, 5) - .5) * .06; }
    if (ax > .98) return .05;
    const schiene = Math.abs(ax - .5) < .025 + .4 / Z * .02, schwelle = Math.abs(frac(Z * 1.6) - .5) > .36 && ax < .8;
    const glanz = Math.max(0, 1 - Z / 6) * .4;
    return schiene ? .55 + glanz : schwelle ? .22 : .08 + B.hash(x >> 1, y >> 1, 7) * .14; });
  // Signal links am Mund: grün in Phase 1, rot ab Phase 2
  const sg = B.maske(); sg.rect(98, 60, 10, 22); K.form(1, sg, 0, eisenMat(1.4));
  const sc = ph ? SIGNAL : '#7affc0'; K.e[1].set(102, 64, B.pk(sc)); K.e[1].set(103, 64, B.pk(sc)); B.gluehen(K.e[1], 102.5, 64.5, 10, ph ? SIGNAL_G : '#0a2a1c', .9);
  K.e[1].set(102, 74, B.pk(DUNKEL[3])); K.e[1].set(103, 74, B.pk(DUNKEL[3]));
  bogenlampe(K, 1, 50, 30, 1.2, { top: -M }); bogenlampe(K, 1, 430, 30, 1.2, { top: -M });
  // Vordergrund: Säule rechts
  const v = B.maske(); v.rect(462, -M, 40, H + 2 * M); K.form(5, v, 0, steinMat(1.1, { k: GRUEN.slice(0, 6) }));
  // Luftzug aus dem Tunnel: Staub, der nach vorn treibt
  B.partikel(K, { n: 30, farben: [LICHT[6], LICHT[8]], vx: 0, vy: 2, wob: 6, wf: .4, x0: 130, x1: 350, y0: 40, y1: 200, p: .6 });
  K.reihen = [{ y: 172, skala: .9, nebel: .1 }, { y: 194, skala: 1, nebel: .04 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}

// Übergang: in den Tunnel, an den Gleisen entlang hinab (zum schwarzen Eis). Tunnel in Fluchtsicht, Ringe, eine
// Lampe nach der anderen, am Ende ein kaltes Licht, das nicht näher kommt.
function tunnelHinab(K) {
  const P = B.persp(240, 120, H); K.split = [150, 170];
  B.feld(K.e[0], -M, -M, W + M, H + M, DUNKEL.concat(STEIN.slice(4, 7)), (x, y) => {
    const dx = (x - P.vx) / 1.0, dy = (y - P.vy) * 1.3, d = Math.hypot(dx, dy); if (y > P.vy + 6 && Math.abs(dx) < (y - P.vy) * 2.4) return -1;
    const Z = 160 / Math.max(4, d); const ring = Math.abs(frac(Z * .8) - .5) > .44 ? -.08 : 0; return .55 - Math.min(.5, Z * .03) + ring + (B.fbm(Math.atan2(dy, dx) * 6, Z, 3, 2) - .5) * .1;
  });
  B.feld(K.e[0], P.vx - 14, P.vy - 12, P.vx + 14, P.vy + 8, ['#2c3656', '#56628a', '#a8b8e8'], (x, y) => .9 - Math.hypot(x - P.vx, (y - P.vy) * 1.4) / 14);
  K.boden(P.vy + 6, H + M, STEIN, (x, y) => { const X = P.X(x, y), Z = P.z(y + .5); const schiene = Math.abs(Math.abs(X) - .55) < .03; const schwelle = Math.abs(frac(Z * 1.4) - .5) > .4 && Math.abs(X) < .8; return schiene ? .9 : schwelle ? .3 : .12 + (B.hash(Math.floor(X * 8), Math.floor(Z * 3), 7) < .3 ? .06 : 0) + Math.min(.12, 1.2 / Z); });
  for (const z of [2, 3.5, 6, 10]) { const [x, y] = P.q(1.4, 1.6, z); bogenlampe(K, 2, Math.round(x), Math.round(y), Math.max(.5, 2 / z), { top: P.q(1.4, 2.2, z)[1], ebenen: [0] }); }
  K.licht(P.vx, P.vy, LAMPE_M, 60, .6);
  K.reihen = [{ y: 170, skala: .9, nebel: .2 }, { y: 192, skala: 1, nebel: .08 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Krämer: das Fundbüro, ein Schalter mit Gitter, dahinter Regale voller Schirme, Hüte, Koffer; eine Lampe
function fundbuero(K, x, y) {
  const m = B.maske(); m.rect(x - 46, y - 40, 92, 40); K.form(4, m, 0, holzMat(1.5));
  B.feld(K.e[4], x - 40, y - 86, x + 40, y - 40, DUNKEL, (px, py) => .3 + ((py - (y - 86)) % 14 === 0 ? .5 : 0));
  const r = B.rng(K.o.seed * 11 + 1);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) { const ix = x - 36 + i * 13 + r.i(-2, 2), iy = y - 74 + row * 14; const g = B.maske(); const art = r.i(0, 2); if (art === 0) { g.ell(ix, iy - 3, 5, 3); g.rect(ix - 6, iy - 2, 12, 1); } else if (art === 1) g.rect(ix - 5, iy - 9, 10, 9); else { g.kap(ix, iy, ix + 2, iy - 11, .8, .8); g.poly([[ix - 2, iy - 11], [ix + 6, iy - 11], [ix + 2, iy - 2]]); } K.form(4, g, 0, holzMat(1.4 + r() * .4, art === 1 ? { k: ['#120a08', '#1e110c', '#2c1912', '#3c2418'] } : { k: DUNKEL.slice(1, 6) })); }
  for (let i = 0; i < 9; i++) { const g = B.maske(); g.kap(x - 44 + i * 11, y - 86, x - 44 + i * 11, y - 40, .7, .7); K.form(4, g, 0, messingMat(1.5)); }
  const sh = B.maske(); sh.rect(x - 48, y - 90, 96, 4); K.form(4, sh, 0, holzMat(1.7));
  bogenlampe(K, 4, x + 30, y - 100, .9, { top: y - 130, ebenen: [3, 4] });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' || art === 'werkstatt' || art === 'kraemer' ? 2 : art === 'ereignis' || art === 'fund' ? 0 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = tunnelSzene(K);
  else if (art === 'uebergang') info = tunnelHinab(K);
  else info = [gleiswand, zugAmBahnsteig, vorhalle][v](K);
  if (art === 'fund' || art === 'ereignis') { koffer(K, 4, info.mitte[0] + 50, info.mitte[1]); B.gluehen(K.e[4], info.mitte[0] + 50, info.mitte[1] - 8, 30, LAMPE_G, .8); }
  else if (art === 'kraemer') fundbuero(K, info.mitte[0] + 60, info.mitte[1] - 6);
  else if (art === 'rast') { bank(K, 4, info.mitte[0] - 10, info.mitte[1] + 2, 44, 0); B.feuer(K, info.mitte[0] + 60, info.mitte[1] + 6); }
  else if (art === 'werkstatt') B.werkbank(K, info.mitte[0] + 50, info.mitte[1] + 4);
  return K.fertig();
}
World._biome.station = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 3, knick: .4, grossX: 112, stein: ['#232d30', '#384446', '#545f5f', '#79817e'] } };
if (World.BIOME.indexOf('station') < 0) World.BIOME.push('station');
})();
