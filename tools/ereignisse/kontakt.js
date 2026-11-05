// Kontaktbogen der Ereignisbilder (Playwright/Chromium). Vorher: node tools/ereignisse/bauen.js
//   node tools/ereignisse/kontakt.js <charge> [biom|id …] [--x2]
// Schreibt docs/auftrag-2/bilder/Zugabe/ereignisse/kontakt-<charge>.png: jedes Bild ×3 (oder ×2) mit Titel,
// ID, Biom und der Bildbeschreibung aus den Daten (Feld "bild"), damit man Motiv und Vorgabe vergleichen kann.
// Ohne Auswahl: alle vorhandenen Bilder.
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const L = require('./lib');
const Bau = require('./bauen');

const W = L.WURZEL;
const ZIEL = path.join(W, 'docs/auftrag-2/bilder/Zugabe/ereignisse');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

(async () => {
  const args = process.argv.slice(2), x = args.includes('--x2') ? 2 : 3;
  const namen = args.filter(a => !a.startsWith('--'));
  const charge = namen.shift() || 'alle';
  fs.mkdirSync(ZIEL, { recursive: true });
  const daten = Bau.ereignisDaten();
  const ids = JSON.parse(fs.readFileSync(path.join(Bau.ZIEL, 'index.json'), 'utf8')).ereignisse;
  const wahl = ids.filter(id => !namen.length || namen.includes(id) || namen.includes((daten[id] || {}).biom));
  // Reihenfolge: erst biomübergreifend, dann nach Biom, innerhalb in Datenreihenfolge
  const ord = Object.keys(daten);
  wahl.sort((a, b) => (((daten[a] || {}).biom === 'alle' ? 0 : 1) - ((daten[b] || {}).biom === 'alle' ? 0 : 1)) || String((daten[a] || {}).biom).localeCompare(String((daten[b] || {}).biom)) || ord.indexOf(a) - ord.indexOf(b));
  const zellen = wahl.map(id => {
    const d = daten[id] || {}, u = 'data:image/png;base64,' + fs.readFileSync(path.join(Bau.ZIEL, id + '.png')).toString('base64');
    return `<div class="z"><img src="${u}" width="${160 * x}" height="${90 * x}"><div class="t">${esc(d.t || id)}</div><div class="i">${esc(id)} · ${esc(d.biom || '?')}</div><div class="b">${esc(d.bild || '')}</div></div>`;
  }).join('');
  const html = `<meta charset="utf-8"><style>body{margin:0;background:#120f0b;color:#ddd4bc;font:12px/1.3 Georgia,serif;padding:16px}h1{font:bold 16px monospace;margin:0 0 4px;color:#e0c080}p{margin:0 0 12px;color:#8f8672;font-family:monospace}
img{image-rendering:pixelated;display:block;border:2px solid #000;outline:1px solid #3a2e1a}.r{display:flex;flex-wrap:wrap;gap:14px}.z{width:${160 * x + 4}px}.t{font-weight:bold;color:#efe4c8;margin-top:5px;font-size:14px}.i{font:10px monospace;color:#8f8672}.b{font-style:italic;color:#bfb49a;margin-top:2px}</style>
<h1>Ereignisbilder · Charge ${esc(charge)} · ${wahl.length} Bilder · 160×90 ×${x}</h1><p>tools/ereignisse/ · Bausteine aus basis.js · Bildbeschreibung aus dem Feld „bild“ darunter</p><div class="r">${zellen}</div>`;
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: x === 3 ? 1520 : 1400, height: 400 } });
  await page.setContent(html, { waitUntil: 'load' }); await page.waitForTimeout(150);
  const datei = path.join(ZIEL, 'kontakt-' + charge + '.png');
  await (await page.$('body')).screenshot({ path: datei });
  console.log(path.relative(W, datei), '·', wahl.length, 'Bilder');
  await browser.close();
})();
