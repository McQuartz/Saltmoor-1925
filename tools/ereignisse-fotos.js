// Ereignisbilder im Spiel prüfen (Playwright, Server auf http://localhost:8000).
//   node tools/ereignisse-fotos.js                       jedes Ereignis mit Bild einmal öffnen, auf Seitenfehler prüfen
//   node tools/ereignisse-fotos.js --fotos               dazu Bildschirmfotos 1280×720 nach docs/auftrag-2/bilder/Zugabe/ereignisse/
//   node tools/ereignisse-fotos.js --fotos=hafen_netze:hafen,alle_brief:kapelle   eigene Auswahl (id:biom)
// Geprüft wird je Ereignis: Zettel da, Bild geladen (160×90), keine Konsolen- oder Seitenfehler.
// Dazu ein Ereignis ohne Bild: der Zettel muss ohne Bild erscheinen (Rückfall wie vorher).
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const W = path.resolve(__dirname, '..');
const URL = process.env.SPIEL_URL || 'http://localhost:8000/index.html';
const ZIEL = path.join(W, 'docs/auftrag-2/bilder/Zugabe/ereignisse');
const STANDARD_FOTOS = [['hafen_netze', 'hafen'], ['alle_nachtwaechter', 'kapelle'], ['hafen_leiter', 'hafen']];

(async () => {
  const arg = process.argv.find(a => a.startsWith('--fotos'));
  const fotos = !arg ? [] : arg.includes('=') ? arg.split('=')[1].split(',').map(s => s.split(':')) : STANDARD_FOTOS;
  const ids = JSON.parse(fs.readFileSync(path.join(W, 'prototype/assets/ereignisse/index.json'), 'utf8')).ereignisse;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const fehler = [];
  page.on('pageerror', e => fehler.push('Seitenfehler: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fehler.push('Konsole: ' + m.text()); });
  page.on('requestfailed', r => fehler.push('Anfrage fehlgeschlagen: ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) fehler.push('HTTP ' + r.status() + ': ' + r.url()); });
  await page.goto(URL + '?dev=0&job=fischer&seed=3&springe=ereignis&akt=0');
  await page.waitForTimeout(1500);

  // Ein Ereignis öffnen (im gewünschten Biom, falls angegeben) und warten, bis das Bild geladen ist
  const oeffne = async (id, biom) => {
    await page.evaluate(([id, biom]) => {
      if (biom) { const akt = RUN.akte.findIndex(a => a.biome.includes(biom)); S.route[akt] = biom; Dev.springe('ereignis', akt); }
      S.event = id; S.phase = 'event'; S.eventChoice = null; render();
    }, [id, biom || null]);
    return page.evaluate(async () => {
      const img = document.querySelector('#panel .evbild img');
      if (!img) return { bild: false, zettel: !!document.querySelector('#panel .zettel') };
      if (!img.complete) await new Promise(r => { img.onload = img.onerror = r; });
      return { bild: true, zettel: true, w: img.naturalWidth, h: img.naturalHeight };
    });
  };

  let ok = 0;
  for (const id of ids) {
    const vorher = fehler.length;
    const r = await oeffne(id);
    if (!r.zettel) fehler.push(id + ': kein Zettel');
    else if (!r.bild) fehler.push(id + ': Bild fehlt im Zettel');
    else if (r.w !== 160 || r.h !== 90) fehler.push(id + `: Bild ${r.w}×${r.h} statt 160×90`);
    if (fehler.length === vorher) ok++;
  }
  // Rückfall: ein Ereignis ohne Bild
  const ohne = await page.evaluate(ids => (EVENTS.find(e => !ids.includes(e.id)) || {}).id, ids);
  if (ohne) { const r = await oeffne(ohne); if (!r.zettel || r.bild) fehler.push(ohne + ': Rückfall ohne Bild klappt nicht'); else console.log(`Rückfall ohne Bild geprüft (${ohne}).`); }

  if (fotos.length) fs.mkdirSync(ZIEL, { recursive: true });
  for (const [id, biom] of fotos) {
    await oeffne(id, biom); await page.waitForTimeout(700);
    const datei = path.join(ZIEL, 'spiel-' + id + '.png');
    await page.screenshot({ path: datei }); console.log(path.relative(W, datei));
  }
  console.log(`${ok} von ${ids.length} Ereignissen mit Bild geöffnet ohne Fehler.`);
  if (fehler.length) { console.log(fehler.join('\n')); process.exitCode = 1; } else console.log('Keine Seitenfehler.');
  await browser.close();
})();
