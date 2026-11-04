// Kontaktbogen der Spiel-Effekte (PFX, pixelfx + eigene): node tools/effekte-kontakt.js [ausgabe.png] [live.png]
// Öffnet prototype/effekte.html?kontakt=1 (Server: cd prototype && python3 -m http.server 8000), wartet, bis alle
// Zeilen gerendert sind, und fotografiert den Bogen ab. Zusätzlich 3 s Live-Ansicht auf Konsolenfehler prüfen.
// Standard-Ausgabe: docs/auftrag/bilder/M10/effekte-kontakt.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const aus = process.argv[2] || path.join(__dirname, '..', 'docs', 'auftrag', 'bilder', 'M10', 'effekte-kontakt.png');
  fs.mkdirSync(path.dirname(aus), { recursive: true });
  const b = await chromium.launch();
  const fehler = [];
  const seite = async (url, vp) => {
    const p = await b.newPage({ viewport: vp });
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') fehler.push(m.type() + ': ' + m.text()); });
    p.on('pageerror', e => fehler.push('pageerror: ' + String(e)));
    await p.goto('http://localhost:8000/' + url);
    return p;
  };
  const p = await seite('effekte.html?kontakt=1', { width: 1400, height: 900 });
  await p.waitForSelector('body[data-fertig="1"]', { timeout: 120000 });
  await p.locator('#kontakt').screenshot({ path: aus });
  await p.close();
  // Live-Ansicht kurz laufen lassen (Fehler beim Starten, Zeichnen, Aufräumen)
  const l = await seite('effekte.html', { width: 1600, height: 1000 });
  await l.waitForTimeout(3500);
  if (process.argv[3]) await l.screenshot({ path: process.argv[3] });
  await l.close();
  await b.close();
  console.log('Kontaktbogen: ' + aus);
  if (fehler.length) { console.log('KONSOLE:\n' + fehler.join('\n')); process.exitCode = 1; }
  else console.log('Keine Konsolenfehler.');
})();
