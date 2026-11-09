// Auftrag 3 M12: Bildschirmfotos der neuen Abschnitte in Galerie und Artboard.
// node tools/m12-galerie-fotos.js [ziel=docs/auftrag-3/bilder/M12]   (startet selbst einen Server aus prototype/, Port 8100 bis 8900)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), { spawn } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800);
const BASIS = `http://localhost:${PORT}`;
const hoch = () => new Promise(r => http.get(BASIS + '/gallery.html', x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/M12'; require('fs').mkdirSync(out, { recursive: true });
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const f = [];
  const seite = async (name) => {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    p.on('pageerror', e => f.push(`${name}: ${e}`));
    p.on('console', m => { if (m.type() === 'error' && !/404|fonts\.g/.test(m.text())) f.push(`${name}: ${m.text()}`); });
    p.on('console', m => { if (m.type() === 'warning' && /Galerie|Artboard/.test(m.text())) f.push(`${name} (Warnung): ${m.text()}`); });
    await p.goto(`${BASIS}/${name}.html`); return p;
  };
  // Ausschnitt als Bild: ganze Seite, Klammer um das Element (Element-Fotos schneiden bei der Seitenhöhe ab); die klebende Leiste wird dazu gelöst
  const foto = async (p, el, datei) => {
    await p.addStyleTag({ content: 'nav.sprung{position:static!important}html,body{overflow:visible!important;height:auto!important}' });
    const r = await el.evaluate(e => { const q = e.getBoundingClientRect(); return { x: Math.max(0, q.left + scrollX), y: q.top + scrollY, width: q.width, height: q.height }; });
    await p.screenshot({ path: `${out}/${datei}.png`, fullPage: true, clip: r });
  };
  const abschnitt = async (p, id, datei, warte = 400) => {
    const el = await p.$('#' + id); if (!el) { f.push(`Abschnitt #${id} fehlt`); return; }
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(warte);
    await foto(p, el, datei);
  };
  // ---- Galerie ----
  const g = await seite('gallery');
  // alle Szenen sind gebaut, wenn die fünf Strand-Bilder etwas enthalten
  await g.waitForFunction(() => { const c = [...document.querySelectorAll('#strandBox canvas')]; return c.length === 5 && c.every(k => { const d = k.getContext('2d').getImageData(0, 0, 480, 270).data; for (let i = 0; i < d.length; i += 400) if (d[i] || d[i + 1] || d[i + 2]) return true; return false; }); }, null, { timeout: 90000 }).catch(() => f.push('gallery: Strand-Bilder nicht fertig'));
  await g.waitForTimeout(1500);
  await abschnitt(g, 'demo', 'galerie-0-oberflaeche-gesehener-blick', 1500);
  await abschnitt(g, 'silhouetten', 'galerie-1-silhouetten');
  await g.click('#silhPunkte'); await abschnitt(g, 'silhouetten', 'galerie-1b-silhouetten-ohne-punkte', 200); await g.click('#silhPunkte');
  await abschnitt(g, 'gesehene', 'galerie-2-gesehene', 1500);
  await abschnitt(g, 'biegungen', 'galerie-3-biegungs-zeichen');
  await abschnitt(g, 'farbe', 'galerie-4-farbe-frei', 800);
  await g.click('#farbeGebunden'); await g.waitForTimeout(600);
  await abschnitt(g, 'farbe', 'galerie-4b-farbe-gebunden', 600);
  await abschnitt(g, 'neues', 'galerie-5-neue-items-und-karten');
  await abschnitt(g, 'strand', 'galerie-6-strand-stufen', 600);
  const n = await g.evaluate(() => ({ silh: document.querySelectorAll('#silhBox figure').length, gesehene: document.querySelectorAll('#gesehBox .kachel').length, biegungen: document.querySelectorAll('#biegBox .kachel').length, strand: document.querySelectorAll('#strandBox canvas').length, punkte: document.querySelectorAll('#silhBox .pkt').length, overlays: document.querySelectorAll('#farbeBox canvas.fb-ov').length, karten: document.querySelectorAll('#neuKarten .karte').length, picks: document.querySelectorAll('#neuPicks .pick, #neuPicks [data-pick], #neuPicks .picks > *').length }));
  console.log('Galerie zählt:', JSON.stringify(n));
  // ---- Artboard ----
  const a = await seite('artboard');
  await a.waitForTimeout(3000);
  for (const [id, d] of [['stoffe', 'artboard-0-stoffe-mit-x'], ['biegungen', 'artboard-1-biegungen'], ['begegnungen', 'artboard-2-begegnungen'], ['meta', 'artboard-3-metaebene'], ['wuerze', 'artboard-4-wuerze']]) await abschnitt(a, id, d, 500);
  // Gegner ohne Biom (Gesehene, Asche) und neue Items
  const ohne = await a.evaluateHandle(() => [...document.querySelectorAll('#gegnerBox h3.unter')].find(h => /OHNE BIOM/.test(h.textContent)));
  if (ohne.asElement()) { const bx = await ohne.evaluateHandle(h => h.nextElementSibling); await bx.asElement().scrollIntoViewIfNeeded(); await a.waitForTimeout(1200); await foto(a, bx.asElement(), 'artboard-5-gesehene'); } else f.push('artboard: Gegner ohne Biom fehlen');
  // Suche: findbar
  const suche = async (q, datei) => { await a.fill('#q', q); await a.waitForTimeout(300); const sichtbar = await a.evaluate(() => [...document.querySelectorAll('#seite section')].filter(s => !s.classList.contains('versteckt')).map(s => s.id + ':' + [...s.querySelectorAll('.kachel')].filter(k => !k.classList.contains('versteckt')).length)); console.log(`Suche "${q}":`, sichtbar.join(' ')); if (datei) { await a.evaluate(() => scrollTo(0, 0)); await a.screenshot({ path: `${out}/${datei}.png` }); } };
  await suche('Linse', 'artboard-6-suche-linse'); await suche('Zeitung'); await suche('Über Eck'); await suche('Asche'); await suche('Die Farbe'); await suche('Geige'); await suche('Gesehener'); await suche('Pause'); await a.fill('#q', '');
  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
})();
