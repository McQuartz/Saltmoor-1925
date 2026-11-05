// Kontaktbögen der Icons (Playwright/Chromium). Vorher: node tools/icons/bauen.js
//   docs/auftrag-2/bilder/M5/icons.png               alle Item-Icons bei 48 und 32 px, auf dem Feldton des Spiels, mit Namen
//   docs/auftrag-2/bilder/M5/icons-silhouetten.png   alle Item-Icons schwarz gefüllt bei 32 px (Unterscheidbarkeit)
//   docs/auftrag-2/bilder/M5/icons-vorher-nachher.png  20 bekannte Items: altes 12×12 ×4 neben dem neuen 48er
//   docs/auftrag-2/bilder/M5/handgriffe.png          alle Handgriff-Bilder bei 48×32 (und ×2), nach Familie
// node tools/icons/kontakt.js [--nur=icons|silhouetten|vorher|handgriffe|auswahl]   (auswahl: --ids=a,b --hg=x,y --ziel=docs/… --titel=…)
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const L = require('./lib');
const B = require('./bauen');

const W = L.WURZEL; const ZIEL = path.join(W, 'docs/auftrag-2/bilder/M5'); fs.mkdirSync(ZIEL, { recursive: true });
const url = (art, id) => 'data:image/png;base64,' + fs.readFileSync(path.join(W, 'prototype/assets', art, id + '.png')).toString('base64');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KOPF = `<meta charset="utf-8"><style>body{margin:0;background:#120f0b;color:#ddd4bc;font:11px/1.25 monospace;padding:14px}h1{font-size:15px;margin:0 0 4px;color:#e0c080}p{margin:0 0 10px;color:#8f8672}
img{image-rendering:pixelated}.raster{display:flex;flex-wrap:wrap;gap:6px}.z{width:118px;background:#0a0806;border:1px solid #3a2e1a;padding:4px;display:flex;flex-direction:column;align-items:center;gap:3px}
.z .b{display:flex;align-items:flex-end;gap:6px}.z .n{text-align:center;color:#cfc4a8;height:26px;overflow:hidden}.z .r{color:#8f8672;font-size:9px}.rel{color:#e8b860}.sel{color:#a8c0e0}
h2{font-size:12px;color:#b08a4a;margin:12px 0 6px}</style>`;

async function foto(page, html, datei, breite = 1400) {
  await page.setViewportSize({ width: breite, height: 400 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(150);
  const el = await page.$('body'); await el.screenshot({ path: datei });
  console.log(path.relative(W, datei));
}

(async () => {
  const nur = (process.argv.find(a => a.startsWith('--nur=')) || '').slice(6);
  const it = B.itemDaten(), hg = B.hgDaten();
  const ii = JSON.parse(fs.readFileSync(path.join(W, 'prototype/assets/items/index.json'), 'utf8')).items;
  const hi = JSON.parse(fs.readFileSync(path.join(W, 'prototype/assets/handgriffe/index.json'), 'utf8')).handgriffe;
  // Reihenfolge: nach Bereich (Waffe, Kleidung, Talisman), dann Seltenheit
  const ordnung = { waffe: 0, kleidung: 1, talisman: 2 }, rarO = { gewoehnlich: 0, selten: 1, reliquie: 2 };
  const items = ii.slice().sort((a, b) => ((ordnung[it[a]?.a] ?? 3) - (ordnung[it[b]?.a] ?? 3)) || ((rarO[it[a]?.rar] ?? 0) - (rarO[it[b]?.rar] ?? 0)) || a.localeCompare(b));
  const browser = await chromium.launch(); const page = await browser.newPage({ deviceScaleFactor: 2 });

  if (!nur || nur === 'icons') {
    const zellen = items.map(id => { const d = it[id] || {}; const u = url('items', id); return `<div class="z"><div class="b"><img src="${u}" width="48" height="48"><img src="${u}" width="32" height="32"></div><div class="n">${esc(d.n || id)}</div><div class="r ${d.rar === 'reliquie' ? 'rel' : d.rar === 'selten' ? 'sel' : ''}">${esc(id)} · ${(d.st || []).join('') || '–'} · ${esc(d.rar || '')}</div></div>`; }).join('');
    await foto(page, `${KOPF}<h1>Item-Icons · ${items.length} Stück · 48 px und 32 px</h1><p>Weg A (Skript, tools/icons/). Gegenlicht oben rechts, Randlicht in der Stofffarbe, Bayer-Dither, kein Umriss. Feldton #0a0806 wie im Spiel. Aufnahme mit Pixeldichte 2.</p><div class="raster">${zellen}</div>`, path.join(ZIEL, 'icons.png'));
  }
  if (!nur || nur === 'silhouetten') {
    const zellen = items.map(id => `<div style="display:flex;flex-direction:column;align-items:center;width:60px;gap:2px"><img src="${url('items', id)}" width="32" height="32" style="filter:brightness(0)"><span style="font-size:8px;color:#555">${esc(id.slice(0, 11))}</span></div>`).join('');
    await foto(page, `${KOPF}<style>body{background:#d8d4cc}h1{color:#222}p{color:#555}</style><h1>Silhouetten aller Item-Icons bei 32 px (schwarz gefüllt)</h1><p>Jede Form muss sich hier von allen anderen unterscheiden.</p><div class="raster">${zellen}</div>`, path.join(ZIEL, 'icons-silhouetten.png'), 1200);
  }
  if (!nur || nur === 'vorher') {
    const bekannt = ['poker', 'knife', 'harpoon', 'revolver', 'pan', 'bible', 'pick', 'torch', 'bottle', 'oilcoat', 'woolcoat', 'boots', 'gasmask', 'lantern', 'rosary', 'watch', 'candle', 'divinghelm', 'compass', 'dynamite'].filter(id => ii.includes(id));
    const js = fs.readFileSync(path.join(W, 'prototype/js/sprites/items.js'), 'utf8');
    const zellen = bekannt.map(id => `<div class="z" style="width:150px"><div class="b"><img class="alt" data-spr="${esc(it[id]?.spr || id)}" width="48" height="48"><span style="color:#8f8672">→</span><img src="${url('items', id)}" width="48" height="48"></div><div class="n">${esc(it[id]?.n || id)}</div></div>`).join('');
    await foto(page, `${KOPF}<h1>Vorher / nachher · 20 bekannte Items</h1><p>Links das alte 12×12-Sprite ×4 (prototype/js/sprites/items.js), rechts das neue 48×48-Icon, beide in Spielgröße 48 px.</p><div class="raster">${zellen}</div><script>${js}\nfor(const i of document.querySelectorAll('img.alt'))i.src=spr(i.dataset.spr);</script>`, path.join(ZIEL, 'icons-vorher-nachher.png'), 820);
  }
  if (!nur || nur === 'handgriffe') {
    const fam = {}; for (const id of hi) { const b = hg[id]?.build || 'ohne Daten'; (fam[b] = fam[b] || []).push(id); }
    const reihe = ['neutral', 'glutnest', 'brackwasser', 'bollwerk', 'aderlass', 'kettenwerk', 'hagel'].filter(f => fam[f]).concat(Object.keys(fam).filter(f => !['neutral', 'glutnest', 'brackwasser', 'bollwerk', 'aderlass', 'kettenwerk', 'hagel'].includes(f)));
    const html = reihe.map(f => `<h2>${esc(f)} · ${fam[f].length}</h2><div class="raster">${fam[f].map(id => { const u = url('handgriffe', id); return `<div class="z" style="width:150px"><div class="b"><img src="${u}" width="96" height="64"><img src="${u}" width="48" height="32"></div><div class="n">${esc(hg[id]?.n || id)}</div></div>`; }).join('')}</div>`).join('');
    await foto(page, `${KOPF}<h1>Handgriff-Bilder · ${hi.length} Stück · 48×32 (×2 und ×1)</h1><p>Hände, Werkzeug, Geste. Gleiche Lichtregeln, Haut dunkel im Randlicht, Akzent in der Farbe der Build-Familie.</p>${html}`, path.join(ZIEL, 'handgriffe.png'));
  }
  // Auswahl (Zugabe-Pakete): --nur=auswahl --ids=a,b --hg=x,y --ziel=docs/… [--titel=…]
  // Bogen mit ×4, 48 und 32 px, Silhouette, Eigenschaft und Flavor; dazu die Handgriff-Bilder ×2/×1
  if (nur === 'auswahl') {
    const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').slice(k.length + 3);
    const ids = arg('ids').split(',').filter(id => ii.includes(id)), hgs = arg('hg').split(',').filter(id => hi.includes(id));
    const ziel = path.join(W, arg('ziel') || 'docs/auftrag-2/bilder/Zugabe'); fs.mkdirSync(ziel, { recursive: true });
    const zellen = ids.map(id => { const d = it[id] || {}; const u = url('items', id); return `<div class="z" style="width:300px;align-items:flex-start"><div class="b"><img src="${u}" width="192" height="192"><div style="display:flex;flex-direction:column;gap:6px"><img src="${u}" width="48" height="48"><img src="${u}" width="32" height="32"><span style="background:#d8d4cc;display:inline-block;width:32px;height:32px"><img src="${u}" width="32" height="32" style="filter:brightness(0)"></span></div></div><div class="n" style="height:auto;text-align:left">${esc(d.n || id)}</div><div class="r ${d.rar === 'reliquie' ? 'rel' : d.rar === 'selten' ? 'sel' : ''}">${esc(id)} · ${(d.st || []).join('') || '–'} · ${esc(d.rar || '')}</div>${d.eigen && d.eigen.t ? `<div style="color:#e0c080">${esc(d.eigen.t)}</div>` : ''}<div style="color:#8f8672"><i>${esc(d.flavor || '')}</i></div></div>`; }).join('');
    const hz = hgs.map(id => { const u = url('handgriffe', id); return `<div class="z" style="width:300px"><div class="b"><img src="${u}" width="192" height="128"><img src="${u}" width="48" height="32"></div><div class="n">${esc(hg[id]?.n || id)} · ${esc(hg[id]?.build || '')}</div></div>`; }).join('');
    await foto(page, `${KOPF}<h1>${esc(arg('titel') || 'Auswahl')} · ${ids.length} Icons${hgs.length ? ', ' + hgs.length + ' Handgriffe' : ''}</h1><p>×4, 48 px, 32 px und Silhouette bei 32 px. Feldton #0a0806 wie im Spiel.</p><div class="raster">${zellen}</div>${hz ? `<h2>Handgriffe</h2><div class="raster">${hz}</div>` : ''}`, path.join(ziel, 'kontaktbogen.png'), 1600);
  }
  await browser.close();
})();
