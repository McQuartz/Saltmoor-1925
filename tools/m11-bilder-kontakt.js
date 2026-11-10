// Kontaktbogen der fünf Bilder aus Auftrag 3 M11 (Würze), vergrößert, je mit zwei vorhandenen Nachbarn.
//   node tools/m11-bilder-kontakt.js  ->  docs/auftrag-3/bilder/M11/bilder-kontakt.png
// Vorher: node tools/icons/bauen.js zanns_geige relief ausschnitt aussage; node tools/ereignisse/bauen.js falscher_brief
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const W = path.resolve(__dirname, '..');
const ZIEL = path.join(W, 'docs/auftrag-3/bilder/M11'); fs.mkdirSync(ZIEL, { recursive: true });
const url = (art, id) => 'data:image/png;base64,' + fs.readFileSync(path.join(W, 'prototype/assets', art, id + '.png')).toString('base64');

// Je Bild: Art, Id, Titel, Nachbarn [Art, Id]
const BILDER = [
  ['items', 'zanns_geige', 'Zanns Geige (Item-Icon)', [['items', 'stimmeisen'], ['items', 'musicbox']]],
  ['karten', 'relief', 'Das Relief (Karte)', [['karten', 'zeichen'], ['items', 'taufstein']]],
  ['karten', 'ausschnitt', 'Der Ausschnitt (Karte)', [['karten', 'zeichen'], ['items', 'bahnsteigkarte']]],
  ['karten', 'aussage', 'Die Aussage (Karte)', [['items', 'knotenschnur'], ['items', 'leere_seiten']]],
  ['ereignisse', 'falscher_brief', 'Der falsche Brief (Ereignisbild)', [['ereignisse', 'alle_brief'], ['ereignisse', 'alle_kirchenbuch']]],
];

const zelle = (art, id, gross) => {
  const ereignis = art === 'ereignisse', s = ereignis ? (gross ? 4 : 2) : (gross ? 8 : 4);
  const w = ereignis ? 160 : 48, h = ereignis ? 90 : 48;
  return `<div class="z"><img src="${url(art, id)}" width="${w * s}" height="${h * s}"><div class="n">${gross ? '' : id}</div></div>`;
};
const html = `<meta charset="utf-8"><style>body{margin:0;background:#120f0b;color:#ddd4bc;font:12px/1.3 monospace;padding:16px;width:1400px}
h1{font-size:16px;color:#e0c080;margin:0 0 4px}h2{font-size:13px;color:#b08a4a;margin:18px 0 6px}p{margin:0 0 8px;color:#8f8672}
img{image-rendering:pixelated;display:block}.reihe{display:flex;gap:18px;align-items:flex-end}.z{background:#0a0806;border:1px solid #3a2e1a;padding:4px}.n{color:#8f8672;font-size:10px;text-align:center;margin-top:2px}</style>
<h1>M11 Würze: fünf neue Bilder</h1><p>Links das neue Bild groß, rechts zwei vorhandene Nachbarn (Icons ×4, Ereignisbilder ×2) zum Vergleich. Feldton #0a0806 wie im Spiel.</p>
${BILDER.map(([art, id, titel, nb]) => `<h2>${titel} · ${id}</h2><div class="reihe">${zelle(art, id, true)}${nb.map(([a, i]) => zelle(a, i, false)).join('')}${art === 'ereignisse' ? '' : `<div class="z">${[1, 2].map(k => `<img src="${url(art, id)}" width="${(art === 'ereignisse' ? 160 : 48) * (k === 1 ? 1 : 2)}" height="${(art === 'ereignisse' ? 90 : 48) * (k === 1 ? 1 : 2)}" style="margin-bottom:4px">`).join('')}<div class="n">1× und 2×</div></div>`}</div>`).join('')}`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 800 }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' }); await p.waitForTimeout(200);
  const el = await p.$('body'); const datei = path.join(ZIEL, 'bilder-kontakt.png'); await el.screenshot({ path: datei });
  console.log(path.relative(W, datei)); await b.close();
})();
