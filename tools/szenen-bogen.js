// Auftrag 3, M2: Kontaktbogen der Kampfszenen für die Stellplätze (05-oberflaeche.md Abschnitt 4).
// Je Biom ein PNG mit den vier Kampfszenen (kampf Variante 0, 1, 2 und waechter), zweifach vergrößert, mit Raster alle 20 px (Szene 480 × 270),
// den alten Bodenreihen (dünn, grau) und den Stellplätzen aus prototype/data/stell.json (Kreis mit Nummer, Strich in Gegnerhöhe × Maßstab).
// node tools/szenen-bogen.js [ordner=docs/auftrag-3/bilder/M2/stell] [biom,…] [--ohne-raster]
// Bedient prototype/ selbst über einen eigenen Server (freier Port) und lädt alle Biom-Szenen nach.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
(async () => {
  const a = process.argv.slice(2), pos = a.filter(x => !x.startsWith('--'));
  const out = path.resolve(pos[0] || path.join(__dirname, '../docs/auftrag-3/bilder/M2/stell')); fs.mkdirSync(out, { recursive: true });
  const wurzel = path.join(__dirname, '../prototype');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.ogg': 'audio/ogg' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1200, height: 800 } }), fehler = [];
  p.on('pageerror', e => fehler.push('Seitenfehler: ' + e));
  await p.goto(url + '/index.html'); await p.waitForFunction(() => typeof World !== 'undefined' && typeof BIOMES !== 'undefined' && Object.keys(BIOMES).length > 20, null, { timeout: 20000 });
  for (const s of fs.readdirSync(path.join(wurzel, 'js/scenes/world')).filter(f => f.endsWith('.js') && f !== 'basis.js')) { const nm = s.replace('.js', ''); if (!(await p.evaluate(n => !!World._biome[n], nm))) await p.addScriptTag({ url: url + '/js/scenes/world/' + s }).catch(e => fehler.push(s + ': ' + e.message)); }
  const biome = pos[1] ? pos[1].split(',') : await p.evaluate(() => Object.keys(BIOMES));
  const stell = JSON.parse(fs.readFileSync(path.join(wurzel, 'data/stell.json'), 'utf8').toString() || '{}').szenen || {};
  const raster = !a.includes('--ohne-raster');
  for (const bi of biome) {
    const bilder = await p.evaluate(([bi, stell, raster]) => ['kampf:0', 'kampf:1', 'kampf:2', 'waechter:0'].map(k => {
      const [art, v] = k.split(':'); let sz; try { sz = World.build(bi, { art, variante: +v, seed: 7 }); } catch (e) { return { k, f: String(e) }; }
      const c = document.createElement('canvas'); c.width = 960; c.height = 540; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      const t = document.createElement('canvas'); t.width = 480; t.height = 270; const h = t.getContext('2d');
      try { if (sz.zeichneHintergrund) sz.zeichneHintergrund(h, 0, { x: 0, y: 0 }); else sz.ebenen.forEach(L => h.drawImage(L.canvas, L.x || 0, L.y || 0)); if (sz.zeichneVordergrund) sz.zeichneVordergrund(h, 0, { x: 0, y: 0 }); } catch (e) { }
      g.drawImage(t, 0, 0, 960, 540);
      if (raster) { g.font = '10px monospace'; for (let x = 0; x <= 480; x += 20) { g.strokeStyle = x % 100 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,0,.35)'; g.beginPath(); g.moveTo(x * 2 + .5, 0); g.lineTo(x * 2 + .5, 540); g.stroke(); if (x % 40 === 0) { g.fillStyle = '#ff0'; g.fillText(x, x * 2 + 2, 10); } }
        for (let y = 0; y <= 270; y += 20) { g.strokeStyle = y % 100 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,0,.35)'; g.beginPath(); g.moveTo(0, y * 2 + .5); g.lineTo(960, y * 2 + .5); g.stroke(); g.fillStyle = '#ff0'; g.fillText(y, 2, y * 2 - 2); } }
      (sz.reihen || []).forEach(r => { g.strokeStyle = 'rgba(160,160,160,.7)'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(0, r.y * 2); g.lineTo(960, r.y * 2); g.stroke(); g.setLineDash([]); });
      const l = stell[bi + ':' + art + ':' + v] || stell[bi + ':' + art] || [];
      l.forEach((s, i) => { const hh = 80 * (s.s || 1) * 2; g.strokeStyle = '#3cf'; g.lineWidth = 3; g.beginPath(); g.moveTo(s.x * 2, s.y * 2); g.lineTo(s.x * 2, s.y * 2 - hh); g.stroke(); g.beginPath(); g.arc(s.x * 2, s.y * 2, 9, 0, 7); g.fillStyle = '#036'; g.fill(); g.stroke(); g.fillStyle = '#fff'; g.font = 'bold 12px monospace'; g.fillText(i + 1, s.x * 2 - 4, s.y * 2 + 4); g.lineWidth = 1; });
      return { k, d: c.toDataURL(), n: l.length };
    }), [bi, stell, raster]);
    const q = await b.newPage({ viewport: { width: 1960, height: 1200 } });
    await q.setContent(`<html><body style="margin:0;background:#0b0c0e;color:#e8dcc0;font:14px monospace;padding:12px"><div style="margin-bottom:8px">${bi}: Kampfszenen 480×270, zweifach. Raster 20 px, gestrichelt = alte Bodenreihen, blau = Stellplätze (Strich = Höhe eines 80-px-Gegners × Maßstab)</div><div style="display:grid;grid-template-columns:960px 960px;gap:12px">${bilder.map(x => `<div><div>${x.k}${x.f ? ' FEHLER ' + x.f : ''} · ${x.n || 0} Stellplätze</div>${x.d ? `<img src="${x.d}" width="960" height="540">` : ''}</div>`).join('')}</div></body></html>`);
    const f = path.join(out, bi + '.png'); await q.screenshot({ path: f, fullPage: true }); await q.close(); console.log(path.relative(process.cwd(), f));
  }
  console.log(fehler.length ? fehler.join('\n') : 'Keine Seitenfehler.'); await b.close(); srv.close();
})();
