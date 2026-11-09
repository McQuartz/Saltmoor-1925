// Auftrag 3, M3: Kontaktbogen der Fahrt nach vorne (05-oberflaeche.md Abschnitt 6).
// Je Biom ein PNG docs/auftrag-3/bilder/M3/fahrt/<biom>.png: je Kulisse 0, 1, 2 eine Zeile mit drei Bildern der Fahrt
// (Anfang t=0, Mitte t=0,5, Ende t=1, vor dem Nebel), beschriftet mit r und ziel, das Ziel als kleines Kreuz im Anfangsbild.
// node tools/fahrt-bogen.js [ordner] [--nur=hafen,stadt] [--massstab=1|2] [--r=links --ziel=150,150]
// --r / --ziel erzwingen Richtung und Zielpunkt für alle Zeilen (zum Ausprobieren der Bewegungen, ohne fahrt.json zu ändern)
// Benutzt Fahrt.bild() aus prototype/js/scenes/fahrt.js (dieselbe Funktion wie die Animation im Spiel) und die Einträge aus
// prototype/data/fahrt.json (FAHRT); fehlt ein Eintrag, gilt die Vorgabe (r vor, Ziel = Fluchtpunkt) und die Zeile sagt „Vorgabe“.
// Bedient prototype/ selbst über einen eigenen Server (freier Port) und lädt alle Biom-Szenen nach.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
(async () => {
  const a = process.argv.slice(2), pos = a.filter(x => !x.startsWith('--'));
  const out = path.resolve(pos[0] || path.join(__dirname, '../docs/auftrag-3/bilder/M3/fahrt')); fs.mkdirSync(out, { recursive: true });
  const nur = ((a.find(x => x.startsWith('--nur=')) || '').split('=')[1] || '').split(',').filter(Boolean);
  const ms = +((a.find(x => x.startsWith('--massstab=')) || '').split('=')[1] || 1);
  const erzwingen = { r: (a.find(x => x.startsWith('--r=')) || '').split('=')[1] || null, ziel: ((a.find(x => x.startsWith('--ziel=')) || '').split('=')[1] || '').split(',').map(Number).filter(n => !isNaN(n)) };
  const wurzel = path.join(__dirname, '../prototype');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.ogg': 'audio/ogg' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1200, height: 800 } }), fehler = [];
  p.on('pageerror', e => fehler.push('Seitenfehler: ' + e)); p.on('console', m => { if (m.type() === 'error') fehler.push('Konsole: ' + m.text()); });
  await p.goto(url + '/index.html'); await p.waitForFunction(() => typeof World !== 'undefined' && typeof BIOMES !== 'undefined' && Object.keys(BIOMES).length > 20 && typeof Fahrt !== 'undefined', null, { timeout: 20000 });
  for (const s of fs.readdirSync(path.join(wurzel, 'js/scenes/world')).filter(f => f.endsWith('.js') && f !== 'basis.js')) { const nm = s.replace('.js', ''); if (!(await p.evaluate(n => !!World._biome[n], nm))) await p.addScriptTag({ url: url + '/js/scenes/world/' + s }).catch(e => fehler.push(s + ': ' + e.message)); }
  const alle = await p.evaluate(() => Object.keys(BIOMES)), biome = nur.length ? nur : alle;
  for (const bi of biome) {
    if (!alle.includes(bi)) { fehler.push('Unbekanntes Biom: ' + bi); continue; }
    const zeilen = await p.evaluate(([bi, ms, erz]) => [0, 1, 2].map(v => {
      let sz; try { sz = World.build(bi, { art: 'kampf', variante: v, seed: 7 }); } catch (e) { return { v, f: String(e) }; }
      const e = Fahrt.eintrag(sz); if (erz.r) { e.r = erz.r; e.aus = 'erzwungen'; } if (erz.ziel.length === 2) { e.ziel = erz.ziel; e.aus = 'erzwungen'; }
      const bilder = [0, .5, 1].map((t, i) => {
        const c = document.createElement('canvas'); c.width = 480 * ms; c.height = 270 * ms; const t0 = document.createElement('canvas'); t0.width = 480; t0.height = 270;
        const h = t0.getContext('2d'); Fahrt.bild(h, sz, e, t, { t: 0 });
        if (i === 0) { h.strokeStyle = '#000'; h.lineWidth = 3; h.beginPath(); h.moveTo(e.ziel[0] - 6, e.ziel[1]); h.lineTo(e.ziel[0] + 6, e.ziel[1]); h.moveTo(e.ziel[0], e.ziel[1] - 6); h.lineTo(e.ziel[0], e.ziel[1] + 6); h.stroke(); h.strokeStyle = '#ff2'; h.lineWidth = 1; h.stroke(); }
        const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(t0, 0, 0, 480 * ms, 270 * ms); return c.toDataURL();
      });
      return { v, kulisse: sz.kulisse, e, bilder };
    }), [bi, ms, erzwingen]);
    const q = await b.newPage({ viewport: { width: 480 * ms * 3 + 60, height: 900 } });
    await q.setContent(`<html><body style="margin:0;background:#0b0c0e;color:#e8dcc0;font:14px monospace;padding:12px"><div style="margin-bottom:8px">${bi}: Fahrt nach vorne. Je Zeile eine Kulisse, links Anfang (t=0, Ziel als Kreuz), Mitte (t=0,5), rechts Ende (t=1, vor dem Nebel)</div>${zeilen.map(z => `<div style="margin-bottom:10px"><div>Kulisse ${z.v}${z.f ? ' FEHLER ' + z.f : ` · r=${z.e.r} · ziel=[${z.e.ziel}] · ${z.e.aus === 'data' ? 'aus fahrt.json' : z.e.aus === 'erzwungen' ? 'erzwungen (Schalter)' : 'Vorgabe (kein Eintrag)'}`}</div>${z.bilder ? `<div style="display:flex;gap:6px">${z.bilder.map(d => `<img src="${d}" width="${480 * ms}" height="${270 * ms}" style="image-rendering:pixelated">`).join('')}</div>` : ''}</div>`).join('')}</body></html>`);
    const f = path.join(out, bi + '.png'); await q.screenshot({ path: f, fullPage: true }); await q.close(); console.log(path.relative(process.cwd(), f));
  }
  console.log(fehler.length ? fehler.join('\n') : 'Keine Seitenfehler.'); await b.close(); srv.close();
})();
