// Beschriftete Kontaktbögen für die Doku (Playwright/Chromium):
//   docs/auftrag/bilder/M6/favoriten-vergleich.png   Referenz | Variante a | Variante b
//   docs/auftrag/bilder/M6/favoriten-animation.png   alle Bilder aller Animationen der Favoriten
//   docs/auftrag/bilder/M6/silhouetten.png           alle Sprites schwarz gefüllt
//   docs/auftrag/bilder/M7/<biom>.png                je Biom alle Typen und Varianten (Idle, Angriff, Treffer, Tod)
// Vorher: node tools/sprites/bauen.js
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const L = require('./lib');
const { chromium } = require('playwright');

const WURZEL = path.resolve(__dirname, '../..');
const TMP = fs.mkdtempSync(path.join(process.env.KONTAKT_TMP || os.tmpdir(), 'kontakt-'));
const M6 = path.join(WURZEL, 'docs/auftrag/bilder/M6'), M7 = path.join(WURZEL, 'docs/auftrag/bilder/M7');
fs.mkdirSync(M6, { recursive: true }); fs.mkdirSync(M7, { recursive: true });
const foes = JSON.parse(fs.readFileSync(path.join(WURZEL, 'prototype/data/foes_m7.json'), 'utf8'));
let zaehler = 0;

const defs = {};
for (const d of fs.readdirSync(path.join(__dirname, 'gegner'))) { const def = require('./gegner/' + d); defs[def.id] = def; }

// Ein Bild (Animation/Bildnummer) einer Variante auf Nebel als PNG-Datei; gibt den Pfad zurück
function zelle(def, name, anim = 'idle', f = 0, schwarz = false) {
  const v = def.varianten[name]; const an = { ...L.ANIM_STANDARD, ...(def.anim || {}) };
  const b = L.bild(def, v, anim, f, an[anim].n);
  const bild = L.leinwand(def.w, def.h, schwarz ? '#d8d4cc' : '#000');
  if (!schwarz) L.nebel(bild, 0, 0, def.w, def.h, v.zone || def.zone, 1);
  L.einsetzen(bild, L.zuRGBA(b.buf, b.pal), def.w, def.h, 0, 0, 1, schwarz);
  const p = path.join(TMP, `z${zaehler++}.png`); L.pngSchreiben(p, def.w, def.h, bild.data); return p;
}
const img = (p, w, h, s) => `<img src="file://${p}" style="width:${w * s}px;height:${h * s}px">`;
const CSS = `body{margin:0;padding:16px;background:#0b0c0e;color:#d8d4cc;font:13px/1.35 ui-monospace,Menlo,Consolas,monospace}
h1{font-size:18px;margin:0 0 4px;color:#f0e2b8}p.sub{margin:0 0 14px;color:#9a968c;max-width:1400px}
img{image-rendering:pixelated;display:block}.reihe{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin-bottom:14px}
.karte{background:#121418;border:1px solid #23262c;padding:8px}.karte b{color:#f0e2b8}.k{color:#9a968c;font-size:12px;max-width:420px}
.strip{display:flex;gap:4px;align-items:flex-end}.lbl{font-size:11px;color:#7d7a72;margin:4px 0 2px}`;

async function foto(page, html, ziel) {
  const f = path.join(TMP, `s${zaehler++}.html`); fs.writeFileSync(f, `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>${html}</body>`);
  await page.goto('file://' + f); await page.waitForTimeout(150);
  await page.screenshot({ path: ziel, fullPage: true }); console.log('geschrieben:', path.relative(WURZEL, ziel));
}

(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1500, height: 800 } });
  // M6: Favoriten neben Referenz
  const fav = [['1-chorknabe', 'chorknabe'], ['2-hirte', 'hirte'], ['3-netzflickerin', 'netzflickerin']];
  let h = `<h1>M6 · Favoriten neben dem Zielbild</h1><p class=sub>Links das bestätigte Zielbild (docs/spritegen/zielbild, mit Hintergrund), rechts die beiden Varianten aus tools/sprites (Idle-Bild 0 auf einem Vorschau-Nebel in Zonenfarbe, der Nebel gehört nicht zum Sprite). Maßstab ×3.</p>`;
  for (const [ref, id] of fav) {
    const def = defs[id]; h += `<div class=reihe><div class=karte><div class=lbl>Zielbild ${ref}</div>${img(path.join(WURZEL, 'docs/spritegen/zielbild', ref + '.png'), 96, 120, 3)}</div>`;
    for (const n of Object.keys(def.varianten)) h += `<div class=karte><div class=lbl>${n}</div>${img(zelle(def, n), 96, 120, 3)}</div>`;
    h += `<div class=k><b>${foes[id].n}</b><br>${foes[id].konzept}</div></div>`;
  }
  await foto(page, h, path.join(M6, 'favoriten-vergleich.png'));
  // M6: Animationen der Favoriten
  h = `<h1>M6 · Animationen der Favoriten</h1><p class=sub>Je Zeile eine Animation: Idle, Angriff, Treffer, Tod. Maßstab ×2.</p>`;
  for (const [, id] of fav) { const def = defs[id], n = Object.keys(def.varianten)[0]; const an = { ...L.ANIM_STANDARD, ...(def.anim || {}) };
    h += `<div class=karte style="margin-bottom:10px"><b>${n}</b>`; for (const a of L.REIHENFOLGE) { h += `<div class=lbl>${a} (${an[a].n} Bilder, ${an[a].fps} fps)</div><div class=strip>`; for (let f = 0; f < an[a].n; f++) h += img(zelle(def, n, a, f), 96, 120, 2); h += `</div>`; } h += `</div>`; }
  await foto(page, h, path.join(M6, 'favoriten-animation.png'));
  // M6: Silhouetten
  h = `<h1>M6 · Silhouetten-Test</h1><p class=sub>Alle Sprites schwarz gefüllt (Idle-Bild 0). Maßstab ×2, Wächter und Boss in ihrer größeren Fläche.</p><div class=reihe>`;
  for (const id of Object.keys(foes)) { const def = defs[id]; for (const n of Object.keys(def.varianten)) h += `<div><div class=lbl>${n}</div>${img(zelle(def, n, 'idle', 0, true), def.w, def.h, 2)}</div>`; }
  await foto(page, h + '</div>', path.join(M6, 'silhouetten.png'));
  // M7: je Biom
  const biome = [...new Set(Object.values(foes).map(f => f.biom))];
  for (const biom of biome) {
    h = `<h1>M7 · ${biom}: alle Typen und Varianten</h1><p class=sub>Je Sprite: Idle 0, Angriff 2, Treffer 0, Tod 2. Maßstab ×2. Keine Auswahl, alle Varianten.</p>`;
    for (const [id, fo] of Object.entries(foes).filter(([, f]) => f.biom === biom)) {
      const def = defs[id];
      h += `<div class=karte style="margin-bottom:10px"><b>${fo.n}</b> <span class=k>(${fo.rang}, schwach: ${fo.weak}, ${fo.hp} LP)</span><div class=k>${fo.konzept}</div><div class=reihe style="margin:6px 0 0">`;
      for (const n of Object.keys(def.varianten)) { h += `<div><div class=lbl>${n}</div><div class=strip>`; for (const [a, f] of [['idle', 0], ['angriff', 2], ['treffer', 0], ['tod', 2]]) h += img(zelle(def, n, a, f), def.w, def.h, 2); h += `</div></div>`; }
      h += `</div></div>`;
    }
    await foto(page, h, path.join(M7, biom + '.png'));
  }
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
})();
