// Auftrag 3 M8: Farbton für den neunten Stoff „Die Farbe“ (06-lovecraft-kern.md Abschnitt 6).
// Sammelt alle Hex-Farben aus den Paletten (tools/sprites/zonen/*.json, prototype/data/biomes.json,
// prototype/data/biome/*.json, prototype/data/stoffe.json, tools/icons/**/*.js), rechnet in CIELAB (D65)
// und misst mit CIEDE2000. Gesucht wird der Farbton (0–359°, HSL-Raster), der von allen Palettenfarben
// den größten Mindestabstand hat. Keine Zufallszahlen, keine Abhängigkeiten.
// node tools/farbe-ton.js          Tabelle
// node tools/farbe-ton.js --json   Ergebnisse als JSON
// node tools/farbe-ton.js --alles  zusätzlich alle Hex-Farben unter prototype/ (Sprite-JSON, Vendor-Paletten, UI)
const fs = require('fs');
const path = require('path');

const WURZEL = path.join(__dirname, '..');
const JSON_HEX = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
const JS_HEX = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g;
const S_WERTE = [0.6, 0.7, 0.8, 0.9, 1.0];
const L_WERTE = [0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75];
const SCHIMMER_D = [-0.15, -0.075, 0, 0.075, 0.15];
const ALLES = process.argv.includes('--alles');

function normHex(hex) {
  let h = hex.slice(1).toLowerCase();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return '#' + h;
}

function dateienIn(ordner, endung) {
  return fs.readdirSync(ordner).filter(f => f.endsWith(endung)).sort().map(f => path.join(ordner, f));
}

function rekursivDateien(ordner, endungen) {
  const out = [];
  for (const name of fs.readdirSync(ordner).sort()) {
    const p = path.join(ordner, name);
    if (fs.statSync(p).isDirectory()) out.push(...rekursivDateien(p, endungen));
    else if (endungen.some(e => name.endsWith(e))) out.push(p);
  }
  return out;
}

function textSammeln(p, rel, fund) {
  const vorher = fund.length;
  fs.readFileSync(p, 'utf8').split('\n').forEach((zeile, i) => {
    for (const m of zeile.matchAll(JS_HEX)) fund.push({ hex: normHex('#' + m[1]), herkunft: `${rel}:${i + 1}` });
  });
  return fund.length - vorher;
}

// Rekursiv durch jeden JSON-Wert; jede Zeichenkette, die eine Hex-Farbe ist, wird mit Pfad notiert.
function sammleJson(wert, pfad, datei, out) {
  if (typeof wert === 'string') {
    if (JSON_HEX.test(wert)) out.push({ hex: normHex(wert), herkunft: `${datei}: ${pfad || '(Wurzel)'}` });
    return;
  }
  if (Array.isArray(wert)) {
    wert.forEach((v, i) => sammleJson(v, `${pfad}[${i}]`, datei, out));
  } else if (wert && typeof wert === 'object') {
    for (const k of Object.keys(wert)) sammleJson(wert[k], pfad ? `${pfad}.${k}` : k, datei, out);
  }
}

function sammlePaletten() {
  const fund = [];
  const quellen = [];
  const jsonDateien = [
    ...dateienIn(path.join(WURZEL, 'tools/sprites/zonen'), '.json'),
    path.join(WURZEL, 'prototype/data/biomes.json'),
    ...dateienIn(path.join(WURZEL, 'prototype/data/biome'), '.json'),
    path.join(WURZEL, 'prototype/data/stoffe.json'),
  ];
  for (const p of jsonDateien) {
    const rel = path.relative(WURZEL, p);
    const vorher = fund.length;
    const daten = JSON.parse(fs.readFileSync(p, 'utf8'));
    // Die Farbe selbst (Stoff X) ist das Ergebnis dieser Suche und zählt nicht als Palette
    if (rel.endsWith('stoffe.json') && daten.stoffe) { daten.stoffe = { ...daten.stoffe }; delete daten.stoffe.X; }
    sammleJson(daten, '', rel, fund);
    quellen.push({ datei: rel, fundstellen: fund.length - vorher });
  }
  const erfasst = new Set(quellen.map(q => q.datei));
  for (const p of rekursivDateien(path.join(WURZEL, 'tools/icons'), ['.js'])) {
    const rel = path.relative(WURZEL, p);
    const n = textSammeln(p, rel, fund);
    if (n > 0) quellen.push({ datei: rel, fundstellen: n });
    erfasst.add(rel);
  }
  if (ALLES) {
    // Opt-in (--alles): zusätzlich jede Hex-Farbe unter prototype/ (JS, Sprite-JSON, HTML, CSS)
    for (const p of rekursivDateien(path.join(WURZEL, 'prototype'), ['.js', '.json', '.html', '.css'])) {
      const rel = path.relative(WURZEL, p);
      if (erfasst.has(rel)) continue;
      const n = textSammeln(p, rel, fund);
      if (n > 0) quellen.push({ datei: rel, fundstellen: n });
    }
  }
  const verschieden = new Map();
  for (const f of fund) {
    if (!verschieden.has(f.hex)) verschieden.set(f.hex, []);
    verschieden.get(f.hex).push(f.herkunft);
  }
  return { fundstellen: fund.length, quellen, farben: verschieden };
}

// sRGB (0–255) -> CIELAB, Weißpunkt D65
function labVonRgb([r, g, b]) {
  const lin = c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047;
  const Y = 0.2126729 * R + 0.7151522 * G + 0.0721750 * B;
  const Z = (0.0193339 * R + 0.1191920 * G + 0.9503041 * B) / 1.08883;
  const f = t => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const fx = f(X), fy = f(Y), fz = f(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function labVonHex(hex) {
  return labVonRgb([1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)));
}

// CIEDE2000 (Sharma, Wu, Dalal 2005), kL = kC = kH = 1
function deltaE00([L1, a1, b1], [L2, a2, b2]) {
  const rad = d => (d * Math.PI) / 180;
  const deg = r => (r * 180) / Math.PI;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2);
  const Cq = (C1 + C2) / 2;
  const Cq7 = Math.pow(Cq, 7);
  const G = 0.5 * (1 - Math.sqrt(Cq7 / (Cq7 + Math.pow(25, 7))));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const winkel = (ap, b) => (ap === 0 && b === 0 ? 0 : (deg(Math.atan2(b, ap)) + 360) % 360);
  const h1p = winkel(a1p, b1), h2p = winkel(a2p, b2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp;
  if (C1p * C2p === 0) dhp = 0;
  else {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2);
  const Lbar = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp;
  if (C1p * C2p === 0) hbp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2;
  else hbp = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  const T = 1 - 0.17 * Math.cos(rad(hbp - 30)) + 0.24 * Math.cos(rad(2 * hbp))
    + 0.32 * Math.cos(rad(3 * hbp + 6)) - 0.2 * Math.cos(rad(4 * hbp - 63));
  const dth = 30 * Math.exp(-Math.pow((hbp - 275) / 25, 2));
  const Cbp7 = Math.pow(Cbp, 7);
  const RC = 2 * Math.sqrt(Cbp7 / (Cbp7 + Math.pow(25, 7)));
  const SL = 1 + (0.015 * Math.pow(Lbar - 50, 2)) / Math.sqrt(20 + Math.pow(Lbar - 50, 2));
  const SC = 1 + 0.045 * Cbp;
  const SH = 1 + 0.015 * Cbp * T;
  const RT = -Math.sin(rad(2 * dth)) * RC;
  return Math.sqrt(
    Math.pow(dLp / SL, 2) + Math.pow(dCp / SC, 2) + Math.pow(dHp / SH, 2)
    + RT * (dCp / SC) * (dHp / SH),
  );
}

// HSL (h in Grad, s und l in 0–1) -> Hex, auf 8 Bit gerundet
function hslZuHex(h, s, l) {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;
  const sektor = Math.floor(h / 60) % 6;
  const [r, g, b] = [
    [C, X, 0], [X, C, 0], [0, C, X], [0, X, C], [X, 0, C], [C, 0, X],
  ][sektor];
  return '#' + [r, g, b].map(v => Math.round(255 * (v + m)).toString(16).padStart(2, '0')).join('');
}

function nachbarn(lab, paletteLab) {
  let min = Infinity;
  let naechst = null;
  for (const p of paletteLab) {
    const d = deltaE00(lab, p.lab);
    if (d < min) {
      min = d;
      naechst = p;
    }
  }
  return { min, naechst };
}

function herkunftText(herkunft) {
  return herkunft.length > 2 ? `${herkunft[0]} (+${herkunft.length - 1})` : herkunft.join(', ');
}

function main() {
  const json = process.argv.includes('--json');
  const pal = sammlePaletten();
  const paletteLab = [...pal.farben.entries()].map(([hex, herkunft]) => ({ hex, lab: labVonHex(hex), herkunft }));

  const kandidaten = [];
  for (let h = 0; h < 360; h++) {
    for (const s of S_WERTE) {
      for (const l of L_WERTE) {
        const hex = hslZuHex(h, s, l);
        const { min, naechst } = nachbarn(labVonHex(hex), paletteLab);
        kandidaten.push({ h, s, l, hex, min, naechst });
      }
    }
  }
  kandidaten.sort((a, b) => b.min - a.min || a.h - b.h || a.s - b.s || a.l - b.l);
  const bester = kandidaten[0];

  const schimmer = SCHIMMER_D.map(d => {
    const l = Math.min(0.95, Math.max(0.05, +(bester.l + d).toFixed(3)));
    const hex = hslZuHex(bester.h, bester.s, l);
    const { min, naechst } = nachbarn(labVonHex(hex), paletteLab);
    return { l, hex, min, naechst };
  });

  const top10 = kandidaten.slice(0, 10);

  if (json) {
    const ausgabe = {
      palette: {
        fundstellen: pal.fundstellen,
        verschiedene_farben: paletteLab.length,
        quellen: pal.quellen,
      },
      kandidaten_geprueft: kandidaten.length,
      bester: { ...kandidatJson(bester) },
      top10: top10.map(kandidatJson),
      schimmer: schimmer.map(s => ({
        helligkeit: s.l,
        hex: s.hex,
        mindestabstand: +s.min.toFixed(3),
        naechste_palettenfarbe: s.naechst.hex,
        herkunft: s.naechst.herkunft,
      })),
    };
    console.log(JSON.stringify(ausgabe, null, 2));
    return;
  }

  console.log('Farbton für „Die Farbe“: Suche nach dem größten Mindestabstand (CIEDE2000, CIELAB D65)');
  console.log(`Umfang: ${ALLES ? 'Standardquellen plus alles unter prototype/ (--alles)' : 'Standardquellen (Liste aus 06-lovecraft-kern.md)'}`);
  console.log(`Palettenquellen: ${pal.quellen.length} Dateien, ${pal.fundstellen} Fundstellen`);
  console.log(`Verschiedene Palettenfarben: ${paletteLab.length}`);
  console.log(`Geprüfte Kandidaten: ${kandidaten.length} (360 Farbtöne × ${S_WERTE.length} Sättigungen × ${L_WERTE.length} Helligkeiten)`);
  console.log('');
  console.log('Die zehn besten Kandidaten');
  console.log(zeile(['Rang', 'Farbton', 'S', 'L', 'Hex', 'Mindestabstand', 'nächste Palettenfarbe', 'Herkunft']));
  top10.forEach((k, i) => console.log(zeile([
    i + 1, `${k.h}°`, k.s.toFixed(2), k.l.toFixed(2), k.hex, k.min.toFixed(3),
    k.naechst.hex, herkunftText(k.naechst.herkunft),
  ])));
  console.log('');
  console.log(`Bester Ton: ${bester.hex} (Farbton ${bester.h}°, S ${bester.s.toFixed(2)}, L ${bester.l.toFixed(2)})`);
  console.log(`Mindestabstand zur nächsten Palettenfarbe: ${bester.min.toFixed(3)} dE00`);
  console.log(`Nächste Palettenfarbe: ${bester.naechst.hex}, Fundstellen: ${bester.naechst.herkunft.join('; ')}`);
  console.log('');
  console.log('Schimmer-Stufen (gleicher Farbton und Sättigung, dunkler bis heller)');
  console.log(zeile(['Stufe', 'L', 'Hex', 'Mindestabstand', 'nächste Palettenfarbe', 'Herkunft']));
  schimmer.forEach((s, i) => console.log(zeile([
    i + 1, s.l.toFixed(3), s.hex, s.min.toFixed(3), s.naechst.hex, herkunftText(s.naechst.herkunft),
  ])));
}

function kandidatJson(k) {
  return {
    farbton: k.h,
    saettigung: k.s,
    helligkeit: k.l,
    hex: k.hex,
    mindestabstand: +k.min.toFixed(3),
    naechste_palettenfarbe: k.naechst.hex,
    herkunft: k.naechst.herkunft,
  };
}

function zeile(spalten) {
  const breiten = [6, 9, 6, 6, 9, 15, 22, 0];
  return spalten.map((s, i) => String(s).padEnd(breiten[i] || 0)).join(' ').trimEnd();
}

main();
