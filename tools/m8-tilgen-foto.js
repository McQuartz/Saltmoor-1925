// Auftrag 3 M8: Bildschirmfotos Spur tilgen in der Werkstatt (Knopf, Auswahl, danach).
// node tools/m8-tilgen-foto.js [ziel=docs/auftrag-3/bilder/M8]   (startet selbst einen Server aus prototype/)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), { spawn } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800), URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/M8';
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  await p.goto(`${URL}?dev=0&job=fischer&seed=8&springe=werkstatt&akt=1`); await p.waitForTimeout(900);
  await p.evaluate(() => { const l = allActive().filter(it => !it.x && (ITEMS[it.id].st || []).length); const r = R('foto'); for (const it of l.slice(0, 2)) Farbe.spur(it, r); S.farbe = { uid: l[2] ? l[2].uid : l[0].uid, letzte: null, gebunden: false, ab: 0 }; render(); });
  await p.waitForTimeout(700); await p.screenshot({ path: `${out}/06-werkstatt-spur-tilgen-knopf.png` });
  await p.click('[data-act="wsTilgen"]'); await p.waitForTimeout(700); await p.screenshot({ path: `${out}/07-spur-tilgen-wahl.png` });
  await p.click('[data-tilgen]'); await p.waitForTimeout(900); await p.screenshot({ path: `${out}/08-nach-dem-tilgen.png` });
  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
})();
