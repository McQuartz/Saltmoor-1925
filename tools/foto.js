// Bildschirmfoto einer Prototyp-Seite: node tools/foto.js <url-pfad> <ausgabe.png> [breite] [höhe] [warte-ms]
// Beispiel: node tools/foto.js "index.html?seed=3" docs/auftrag/bilder/M0/kampf.png
const { chromium } = require('playwright');
(async () => {
  const [, , pfad, aus, w = 1280, h = 720, warte = 1500] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const fehler = [];
  p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  p.on('pageerror', e => fehler.push(String(e)));
  await p.goto('http://localhost:8000/' + pfad);
  await p.waitForTimeout(+warte);
  await p.screenshot({ path: aus });
  if (fehler.length) console.log('KONSOLENFEHLER:\n' + fehler.join('\n'));
  await b.close();
})();
