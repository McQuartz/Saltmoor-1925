// Effekte fürs Spiel (klassisches Skript): PFX.spiel startet einen Effekt an einer Szenenposition, PFX.zeichne
// malt alle laufenden in den 2D-Kontext der Bühne. Die Effekte selbst kommen aus pixelfx (js/vendor/pixelfx,
// MIT) und js/fx/eigene.js; js/fx/bruecke.js lädt sie als ES-Modul und stellt sie als window.PixelFX bereit.
// Solange PixelFX fehlt, tut PFX.spiel still nichts.
//
// Look (zielbild.md): dunkel, gedämpft, Licht nur als Akzent. Darum
//  - werden fremde pixelfx-Effekte nach Helligkeit auf die Palette des Aufrufs abgebildet (kein Weiß, kein Grell),
//  - kommt Licht nur additiv und in wenigen geditherten Stufen dazu (Bayer 4×4, kein Weichzeichnen),
//  - ist ein Effekt-Pixel ein Szenen-Pixel (480 × 270), immer ganzzahlig.
const PFX = (() => {
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  const LICHT_STUFEN = 4;
  const laufend = [];
  let zaehler = 0;

  // ------------------------------------------------------------------ Farben
  const rgbAus = (h) => { const s = h.replace('#', ''); const v = parseInt(s.length === 3 ? s.replace(/./g, '$&$&') : s.slice(0, 6), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
  const hexAus = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const misch = (a, b, t) => hexAus(rgbAus(a).map((v, i) => v + (rgbAus(b)[i] - v) * t));
  function zuHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
    if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  }
  function ausHsl(h, s, l) {
    const f = (n) => { const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return hexAus([f(0) * 255, f(8) * 255, f(4) * 255]);
  }
  // Rückfall, falls data/*.json (noch) nicht geladen ist: dieselben Werte wie in stoffe.json / biomes.json (hafen)
  const ERSATZ_STOFF = { E: '#a6acb4', F: '#e8873a', W: '#6d9be0', S: '#f1ede2', B: '#d0453e', G: '#e8c547', L: '#fff6b8', V: '#86c062' };
  const ERSATZ_BIOM = { koerper: ['#05070a', '#0b1016', '#141c26', '#22303e'], rand: ['#4a6a8a', '#cfe6ff'], augen: '#ffe9a0', nebel: ['#0e1628', '#2a3a52'] };
  const EIGENE = {
    asche: ['#0b0a0c', '#18151a', '#2a2529', '#443c3e', '#6a5e5a', '#968676', '#c8b498'],
    grau: ['#050407', '#0c0a10', '#16131c', '#26212e', '#3c3446', '#5c5068', '#8a7c96'],
  };
  const daten = { st: null, bi: null };
  try {
    fetch('data/stoffe.json').then((r) => (r.ok ? r.json() : null)).then((j) => { if (j) daten.st = j.stoffe; }).catch(() => {});
    fetch('data/biomes.json').then((r) => (r.ok ? r.json() : null)).then((j) => { if (j) daten.bi = j; }).catch(() => {});
  } catch (e) { /* ohne Daten gilt der Rückfall */ }
  const stoffe = () => { try { if (typeof ST !== 'undefined' && ST) return ST; } catch (e) {} return daten.st; };
  const biome = () => { try { if (typeof BIOMES !== 'undefined' && BIOMES) return BIOMES; } catch (e) {} return daten.bi; };

  /** Stofffarbe gedämpft: sechs dunkle, entsättigte Stufen und ein heller Akzent (7 Stufen, dunkel → hell). */
  function stoffRampe(c) {
    const [h, s, l] = zuHsl(rgbAus(c)), S = s * 0.5;
    const stufen = [0.05, 0.09, 0.15, 0.23, 0.33, 0.46].map((L) => ausHsl(h, S, Math.min(L, l * 0.8)));
    return [...stufen, ausHsl(h, s * 0.45, Math.min(0.72, Math.max(l * 0.9, 0.56)))];
  }
  /** Zonenfarben: Körper (dunkel), Randlicht (mittel), Augen als einziger heller Akzent. */
  function biomRampe(B) {
    const k = B.koerper, r = B.rand;
    return [k[1], k[3], misch(k[3], r[0], 0.45), r[0], misch(r[0], r[1], 0.35), misch(r[0], r[1], 0.65), misch(B.augen, r[0], 0.25)];
  }
  /** Palette (7 Hex-Farben, dunkel → hell) für einen Stoff ('F' oder 'Feuer'), ein Biom ('hafen') oder 'asche'/'grau'. */
  function palette(k) {
    if (Array.isArray(k)) return k.slice();
    if (!k) return EIGENE.asche.slice();
    if (EIGENE[k]) return EIGENE[k].slice();
    const st = stoffe() || {}, bi = biome() || {};
    if (st[k]) return stoffRampe(st[k].c);
    const nach = Object.keys(st).find((s) => (st[s].n || '').toLowerCase() === String(k).toLowerCase());
    if (nach) return stoffRampe(st[nach].c);
    if (bi[k] && bi[k].koerper) return biomRampe(bi[k]);
    if (ERSATZ_STOFF[k]) return stoffRampe(ERSATZ_STOFF[k]);
    if (/^(hafen|moor|kapelle|salz|stadt|eis|pforte)$/.test(k)) return biomRampe(ERSATZ_BIOM);
    return EIGENE.asche.slice();
  }

  // ------------------------------------------------------------------ Gegnerbild → pixelfx-Akteur
  // bild: Canvas, Bild oder ImageData in Szenenpixeln (oder mit skala hochgerechnet, nächster Nachbar).
  function akteurAus(bild, skala = 1) {
    let id;
    if (typeof ImageData !== 'undefined' && bild instanceof ImageData) id = bild;
    else {
      const c = document.createElement('canvas'); c.width = bild.width; c.height = bild.height;
      const x = c.getContext('2d'); x.drawImage(bild, 0, 0); id = x.getImageData(0, 0, c.width, c.height);
    }
    const sw = id.width, sh = id.height, W = Math.max(1, Math.round(sw * skala)), H = Math.max(1, Math.round(sh * skala)), d = id.data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    const roh = new Uint32Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const o = (Math.min(sh - 1, Math.floor(y / skala)) * sw + Math.min(sw - 1, Math.floor(x / skala))) * 4;
        if (d[o + 3] < 96) continue;
        roh[y * W + x] = (255 << 24) | (d[o + 2] << 16) | (d[o + 1] << 8) | d[o];
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    if (x1 < 0) return null;
    const w = x1 - x0 + 1, h = y1 - y0 + 1, data = new Uint8Array(w * h), pixels = new Uint32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = roh[(y + y0) * W + x + x0]; if (c) { data[y * w + x] = 1; pixels[y * w + x] = c; } }
    // Füße bei (0, 0); fx/fy: wo diese Füße im Bild liegen
    return { mask: { w, h, data }, pixels, x: -Math.floor(w / 2), y: -h, w, h, k: 1, fx: x0 + Math.floor(w / 2), fy: y0 + h };
  }

  // ------------------------------------------------------------------ Welche Effekte es gibt
  // id: pixelfx-Id; umf: nach Helligkeit auf die Palette abbilden (fremde Effekte); deckel: höchste Stufe dabei
  // (große Flächen bekommen nicht den hellen Akzent); pal: Standardpalette;
  // box(o, a): Zeichenfläche um den Ursprung [x0, y0, x1, y1]; dy: Ursprung so weit unter (x, y).
  const DEF = {
    treffer: { id: 'impacts/hit-spark', umf: true, pal: 'asche', gamma: 1.25, licht: 0.45, opt: (o) => ({ height: o.hoehe ?? 14, aim: 0.1 }), dy: (o) => o.hoehe ?? 14 },
    treffer_gross: { id: 'impacts/blunt-hit', umf: true, pal: 'asche', gamma: 1.5, deckel: 5, licht: 0.4, opt: (o) => ({ height: o.hoehe ?? 18 }), dy: (o) => o.hoehe ?? 18 },
    brand: { id: 'saltmoor/brand', pal: 'F', koerper: true, licht: 0.6 },
    gift: { id: 'saltmoor/gift', pal: 'V', koerper: true, licht: 0.6 },
    geschwaecht: { id: 'saltmoor/geschwaecht', pal: 'grau', koerper: true, licht: 0.5 },
    block_splitter: { id: 'impacts/shield-block', umf: true, pal: 'E', gamma: 1.6, deckel: 4, licht: 0.4 },
    block_auf: { id: 'saltmoor/block-auf', pal: 'E', licht: 0.6, box: (o) => { const G = o.groesse; return [-G * 0.5 - 6, -G * 1.3 - 6, G * 0.5 + 6, 4]; } },
    heilen: { id: 'saltmoor/heilen', pal: 'L', licht: 1.0, box: (o) => { const G = o.groesse; return [-G * 0.7 - 4, -G * 1.7, G * 0.7 + 4, 4]; } },
    reaktion: { id: 'saltmoor/reaktion', pal: 'W', licht: 0.6, box: (o) => { const G = o.groesse; return [-G * 1.6, -G * 1.1, G * 1.6, G * 1.1]; } },
    hochreaktion: { id: 'saltmoor/hochreaktion', pal: 'L', licht: 1.3, box: (o) => { const G = o.groesse; return [-G * 1.15, -G * 1.25, G * 1.15, G * 0.75]; } },
    tod: { id: 'saltmoor/zerfall', umf: true, pal: 'hafen', gamma: 1.0, licht: 0.4, koerper: true, zeigeKoerper: true, keinSpiegel: true, opt: (o) => ({ wind: (o.richtung ?? 1) < 0 ? -1 : 1 }) },
    uebergang: { id: 'saltmoor/uebergang', pal: 'hafen', licht: 0, ganz: true },
  };
  const namen = Object.keys(DEF);

  function boxVon(d, mod, o, a, flip) {
    let b;
    if (d.box) b = d.box(o, a);
    else { const [w, h] = mod.meta.size, [ox, oy] = mod.meta.origin; b = [-ox, -oy, w - ox, h - oy]; }
    if (flip) b = [-b[2], b[1], -b[0], b[3]];
    if (a) {
      const wind = d.zeigeKoerper ? 150 : 24, w2 = (o.richtung ?? 1) < 0;
      b = [Math.min(b[0], a.x - (w2 ? wind : 24)), Math.min(b[1], a.y - (d.zeigeKoerper ? 70 : 40)), Math.max(b[2], a.x + a.w + (w2 ? 24 : wind)), Math.max(b[3], 6)];
    }
    return b.map(Math.round);
  }

  // ------------------------------------------------------------------ Starten
  /**
   * PFX.spiel(name, { x, y, palette, seed, groesse, richtung, ... }) → Effekt oder null.
   * x, y: Szenenpixel (480 × 270). Für Treffer der Trefferpunkt, für Körper-Effekte und Tod der Fußpunkt.
   * palette: Stoff ('F'), Biom ('moor'), Liste von Hex-Farben, oder leer (Standard je Effekt).
   * groesse: Pixel (Körperhöhe ohne Bild, Schildhöhe, Hochreaktion-Radius). richtung: 1 / -1 (Schlagrichtung, Wind).
   * Körper-Effekte (brand, gift, geschwaecht, tod) nehmen optional bild (Canvas/Image/ImageData des Gegners);
   *   dazu entweder bx, by (linke obere Ecke, an der das Bild in der Szene liegt) oder x, y als Fußpunkt; skala optional.
   * uebergang: deckt die ganze Szene; mitte: Funktion, die aufgerufen wird, wenn alles dunkel ist (Szene wechseln).
   * tempo: Geschwindigkeit (1 = normal).
   */
  function spiel(name, o = {}) {
    try {
      const X = window.PixelFX, d = DEF[name];
      if (!X || !d) return null;
      const mod = X.fx[d.id];
      if (!mod) return null;
      const flip = !d.keinSpiegel && (o.richtung ?? 1) < 0;
      const groesse = o.groesse ?? (mod.meta.options && mod.meta.options.groesse) ?? 48;
      let x = Math.round(o.x ?? 240), y = Math.round(o.y ?? 135), akteur = null;
      if (d.koerper) {
        if (o.bild) akteur = akteurAus(o.bild, o.skala || 1);
        if (akteur && o.bx != null && o.by != null) { x = Math.round(o.bx + akteur.fx); y = Math.round(o.by + akteur.fy); }
        if (!akteur) akteur = X.ersatzKoerper(groesse);
      }
      const pal = palette(o.palette ?? d.pal);
      const opts = { ...(d.opt ? d.opt(o) : {}), seed: o.seed ?? (1 + (zaehler++ * 7) % 97), groesse, flip };
      if (!d.umf) opts.palette = pal;
      if (akteur) opts.actor = akteur;
      if (d.ganz) { opts.w = o.w ?? 480; opts.h = o.h ?? 270; x = o.x ?? 0; y = o.y ?? 0; }
      opts.x = x + 0; opts.y = y + (d.dy ? d.dy(o) : 0);
      const fx = X.createFx(mod, opts);
      const b = d.ganz ? [0, 0, opts.w, opts.h] : boxVon(d, mod, { ...o, groesse }, akteur, flip);
      const e = {
        name, ebene: o.ebene, fx, mod, d, opts, akteur, b, tempo: o.tempo ?? 1, mitte: o.mitte, mitteGerufen: false,
        umf: !!d.umf, gamma: d.gamma ?? 1.2, deckel: d.deckel ?? pal.length - 1, lichtK: o.licht ?? d.licht ?? 0.5,
        rampe: pal.map(rgbAus), lichtFarbe: rgbAus(pal[Math.max(0, pal.length - 2)]),
        frame: null, cc: null, lc: null,
      };
      laufend.push(e);
      return e;
    } catch (err) {
      if (typeof console !== 'undefined') console.warn('PFX.spiel', name, err);
      return null;
    }
  }

  // ------------------------------------------------------------------ Zeichnen
  function flaechen(e, W, H) {
    const ox = Math.max(0, e.opts.x + e.b[0]), oy = Math.max(0, e.opts.y + e.b[1]);
    const x1 = Math.min(W, e.opts.x + e.b[2]), y1 = Math.min(H, e.opts.y + e.b[3]);
    const w = Math.max(1, x1 - ox), h = Math.max(1, y1 - oy);
    if (!e.frame || e.frame.w !== w || e.frame.h !== h || e.frame.ox !== ox || e.frame.oy !== oy) {
      e.frame = window.PixelFX.createFrame(w, h, ox, oy);
      const mk = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
      e.cc = mk(); e.lc = mk();
      e.cx = e.cc.getContext('2d'); e.lx = e.lc.getContext('2d');
      e.cimg = e.cx.createImageData(w, h); e.limg = e.lx.createImageData(w, h);
    }
    return x1 > ox && y1 > oy;
  }

  // der Körper selbst, solange der Tod-Effekt ihn noch nicht übernimmt (das Spiel zeichnet den Gegner dann nicht mehr)
  function koerperMalen(e) {
    const a = e.akteur, f = e.frame, C = f.color, X0 = e.opts.x + a.x - f.ox, Y0 = e.opts.y + a.y - f.oy;
    for (let my = 0; my < a.h; my++)
      for (let mx = 0; mx < a.w; mx++) {
        const c = a.pixels ? a.pixels[my * a.w + mx] : 0;
        if (!c) continue;
        const x = X0 + mx, y = Y0 + my;
        if (x >= 0 && y >= 0 && x < f.w && y < f.h) C[y * f.w + x] = c;
      }
  }

  function malen(g, e) {
    const f = e.frame, n = f.w * f.h, C = f.color, L = f.light, cd = e.cimg.data, ld = e.limg.data;
    const R = e.rampe, N = R.length, LF = e.lichtFarbe;
    let licht = false;
    for (let i = 0; i < n; i++) {
      const c = C[i], a = c >>> 24, j = i * 4;
      if (a) {
        let r = c & 255, gg = (c >>> 8) & 255, b = (c >>> 16) & 255;
        if (e.umf) {
          const l = (0.299 * r + 0.587 * gg + 0.114 * b) / 255, k = Math.min(e.deckel, N - 1, Math.floor(Math.pow(l, e.gamma) * N));
          r = R[k][0]; gg = R[k][1]; b = R[k][2];
        }
        cd[j] = r; cd[j + 1] = gg; cd[j + 2] = b; cd[j + 3] = a;
      } else cd[j + 3] = 0;
      const l = L[i] & 0xffffff;
      if (l && e.lichtK > 0) {
        const lr = l & 255, lg = (l >>> 8) & 255, lb = (l >>> 16) & 255, m = Math.max(lr, lg, lb);
        const x = (i % f.w) + f.ox, y = ((i / f.w) | 0) + f.oy;
        const q = Math.min(LICHT_STUFEN, Math.floor((m / 255) * e.lichtK * LICHT_STUFEN + BAY[((y & 3) << 2) | (x & 3)])) / LICHT_STUFEN * 0.5;
        if (q > 0) {
          if (e.umf) { ld[j] = LF[0] * q; ld[j + 1] = LF[1] * q; ld[j + 2] = LF[2] * q; }
          else { ld[j] = (lr / m) * 255 * q; ld[j + 1] = (lg / m) * 255 * q; ld[j + 2] = (lb / m) * 255 * q; }
          ld[j + 3] = 255; licht = true;
        } else ld[j + 3] = 0;
      } else ld[j + 3] = 0;
    }
    e.cx.putImageData(e.cimg, 0, 0);
    g.drawImage(e.cc, f.ox, f.oy);
    if (licht) {
      e.lx.putImageData(e.limg, 0, 0);
      const alt = g.globalCompositeOperation;
      g.globalCompositeOperation = 'lighter';
      g.drawImage(e.lc, f.ox, f.oy);
      g.globalCompositeOperation = alt;
    }
  }

  /**
   * PFX.zeichne(g, dt[, ebene]): alle laufenden Effekte weiterschalten (dt in Sekunden, 0 = eingefroren) und in g malen.
   * ebene: nur Effekte, die mit derselben `ebene` gestartet wurden (Standard: ohne Ebene).
   */
  function zeichne(g, dt = 1 / 60, ebene) {
    if (!laufend.length || !window.PixelFX) return;
    const W = g.canvas ? g.canvas.width : 480, H = g.canvas ? g.canvas.height : 270;
    const glatt = g.imageSmoothingEnabled, alpha = g.globalAlpha;
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.imageSmoothingEnabled = false; g.globalAlpha = 1;
    for (let i = 0; i < laufend.length; i++) {
      const e = laufend[i];
      if (e.ebene !== ebene) continue;
      try {
        e.fx.update(Math.max(0, dt) * e.tempo);
        if (e.fx.done()) { laufend.splice(i--, 1); continue; }
        if (e.mitte && !e.mitteGerufen && e.fx.t >= (e.mod.meta.duration || 1) / 2) { e.mitteGerufen = true; try { e.mitte(); } catch (err) { console.warn('PFX mitte', err); } }
        if (!flaechen(e, W, H)) continue;
        window.PixelFX.clearFrame(e.frame);
        if (e.d.zeigeKoerper && e.akteur && e.mod.actorAlpha && e.mod.actorAlpha(e.fx.t, e.opts) > 0) koerperMalen(e);
        e.fx.draw(e.frame);
        malen(g, e);
      } catch (err) {
        console.warn('PFX', e.name, err);
        laufend.splice(i--, 1);
      }
    }
    g.restore();
    g.imageSmoothingEnabled = glatt; g.globalAlpha = alpha;
  }

  /**
   * PFX.takt(name) → { anlauf, einfrieren, ruck, ruckStaerke, erholung } in Sekunden/Pixeln, nach dem pixelfx-`act`
   * (Anlauf, Einfrieren beim Kontakt, Erholung). block_splitter liest das act von impacts/shield-block; treffer und
   * treffer_gross nehmen die Werte aus pixelfx impacts/hit-flash (0.26 s Anlauf, 0.07 s Stopp, 0.14 s Ruck, 2 px).
   */
  function takt(name) {
    const X = window.PixelFX, d = DEF[name];
    if (X && d && X.fx[d.id] && X.fx[d.id].act) {
      const a = X.actTiming(X.fx[d.id]), h = a.hits[0] || {};
      return { anlauf: a.windup, einfrieren: h.freeze || 0, ruck: h.shake || 0, ruckStaerke: h.amp || 0, erholung: a.recovery };
    }
    if (name === 'treffer_gross') return { anlauf: 0.3, einfrieren: 0.12, ruck: 0.2, ruckStaerke: 3, erholung: 0.9 };
    return { anlauf: 0.26, einfrieren: 0.07, ruck: 0.14, ruckStaerke: 2, erholung: 0.86 };
  }

  return {
    namen, spiel, zeichne, palette, takt,
    get bereit() { return !!window.PixelFX; },
    /** PFX.laeuft([name][, ebene]): läuft (noch) ein Effekt dieses Namens / dieser Ebene? */
    laeuft: (name, ebene) => laufend.some((e) => (!name || e.name === name) && (ebene === undefined || e.ebene === ebene)),
    stoppe: (e) => { if (e && e.fx) e.fx.stop(); else laufend.forEach((x) => (!e || x.name === e) && x.fx.stop()); },
    leeren: (ebene) => { for (let i = laufend.length - 1; i >= 0; i--) if (ebene === undefined || laufend[i].ebene === ebene) laufend.splice(i, 1); },
  };
})();
if (typeof window !== 'undefined') window.PFX = PFX;
