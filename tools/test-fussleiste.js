// Auftrag 4, Phase 2: Prüfung der Kampfoberfläche wie im Mockup (Look-Runde 7, pruefe() und messe()).
// 1. Überlappung (SAT mit gedrehten Karten) zwischen Karten und Leben, Baum, Stapeln, Energie, Knopf, und der Bausteine untereinander, bei 5, 7 und 10 Karten.
// 2. Die 10 längsten Kartentexte passen in die Karte 50 × 70 (keine .warn, Bildfenster mindestens 9 hoch).
// 3. Messung (kein Fehler, Abnahmewert steht in docs/auftrag-4/fortschritt.md): Verdeckung der Gegner durch Fußleiste und Hand in der Kapelle (Anteil der Gegnerfläche, gemessen auf den deckenden Pixeln jedes Gegners im Bildraum 560 × 315).
// node tools/test-fussleiste.js   (eigener Server, Ton aus)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
let fehler = 0; const ok = (b, t) => { console.log((b ? 'ok    ' : 'FEHLER ') + t); if (!b) fehler++; };
(async () => {
  const wurzel = path.join(__dirname, '../prototype');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(); const konsole = [];
  for (const [W, H] of [[1920, 1080], [1280, 720], [1000, 700]]) {
    const p = await b.newPage({ viewport: { width: W, height: H } }); p.on('pageerror', e => konsole.push(String(e)));
    await p.goto(`${url}/index.html?dev=0&job=fischer&seed=3&springe=kampf&akt=1`); await p.waitForTimeout(1300);
    await p.evaluate(() => { try { audioOn = false; Einst.set('musik', 0); Einst.set('ton', 0); } catch (e) { } });
    await p.evaluate(() => { S.route[S.akt] = 'kapelle'; BU.key = ''; Dev.springe('kampf', 1); });
    await p.waitForTimeout(700); await p.evaluate(() => document.fonts && document.fonts.ready);
    // alle Karten des Spiels, die 10 längsten Texte
    const lang = await p.evaluate(() => { const all = [...Object.values(ITEMS).flatMap(d => (d.cards || []).map(c => ({ ...c, st: c.st || d.st || [] }))), ...Object.entries(HANDGRIFFE).map(([id, h]) => ({ ...h, st: h.st || [], hg: id }))];
      const seen = new Set(); return all.map(c => ({ c, n: cardText(c).length })).sort((a, z) => z.n - a.n).filter(x => { const k = x.c.n; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 10).map(x => ({ n: x.c.n, len: x.n })); });
    for (const n of [5, 7, 10, 'lang']) {
      const r = await p.evaluate(async n => {
        const all = [...Object.values(ITEMS).flatMap(d => (d.cards || []).map(c => ({ ...c, st: c.st || d.st || [] }))), ...Object.entries(HANDGRIFFE).map(([id, h]) => ({ ...h, st: h.st || [], hg: id }))];
        if (n === 'lang') { const seen = new Set(); S.hand = all.map(c => ({ c, n: cardText(c).length })).sort((a, z) => z.n - a.n).filter(x => { if (seen.has(x.c.n)) return false; seen.add(x.c.n); return true; }).slice(0, 10).map(x => JSON.parse(JSON.stringify(x.c))); }
        else { const pool = [...S.hand, ...S.draw, ...S.discard]; while (pool.length < n) pool.push(...pool.slice(0, n - pool.length)); S.hand = pool.slice(0, n); }
        S.enemies = biom().gegner.slice(0, 3).map(id => mkEnemy(id)); aufstellen(S.enemies); render(); await new Promise(r => setTimeout(r, 50)); render();
        const poly = r => [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]];
        const kartePoly = k => { const r = k.getBoundingClientRect(); const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2; const s = BU.s || 1, w = k.offsetWidth / 2 * s, h = k.offsetHeight / 2 * s; const a = parseFloat(getComputedStyle(k).rotate) * Math.PI / 180 || 0; const c = Math.cos(a), si = Math.sin(a); return [[-w, -h], [w, -h], [w, h], [-w, h]].map(([x, y]) => [cx + x * c - y * si, cy + x * si + y * c]); };
        const sat = (A, B) => { for (const Q of [A, B]) for (let i = 0; i < Q.length; i++) { const p = Q[i], q = Q[(i + 1) % Q.length]; const ax = q[1] - p[1], ay = p[0] - q[0]; const pr = X => X.map(v => v[0] * ax + v[1] * ay); const a = pr(A), b = pr(B); if (Math.max(...a) <= Math.min(...b) + .5 || Math.max(...b) <= Math.min(...a) + .5) return false; } return true; };
        const els = [['Ziehen', '#ziehen'], ['Ablage', '#ablage'], ['Baum', '#baum'], ['Leben', '#spieler2'], ['Energie', '#leiste .ener'], ['Zug beenden', '#endBtn']].map(([k, s]) => [k, document.querySelector(s)]).filter(x => x[1]);
        const ks = [...document.querySelectorAll('#hand .karte')]; const hits = [];
        const RR = els.map(([k, e]) => [k, poly(e.getBoundingClientRect())]);
        for (let i = 0; i < RR.length; i++) { for (let j = i + 1; j < RR.length; j++) if (sat(RR[i][1], RR[j][1])) hits.push(RR[i][0] + '/' + RR[j][0]); for (const k of ks) if (sat(RR[i][1], kartePoly(k))) hits.push(RR[i][0] + '/Karte ' + k.dataset.card); }
        const warn = ks.filter(k => k.classList.contains('warn')).map(k => S.hand[+k.dataset.card].n);
        const stufen = ks.map(k => +k.dataset.stufe), bild = ks.map(k => +k.dataset.bild);
        // ganz sichtbar: jede Karte im Bild
        const sp = document.getElementById('spiel').getBoundingClientRect(); const raus = ks.filter(k => { const r = k.getBoundingClientRect(); return r.left < sp.left - 1 || r.right > sp.right + 1 || r.bottom > sp.bottom + 1; }).length;
        // Verdeckung: deckende Pixel jedes Gegners, bedeckt von Fußleiste (Oberkante je Spalte) oder einer Karte
        const top = fussBild(fussForm(), getComputedStyle(document.documentElement).getPropertyValue('--zone').trim() || '#fff', '#000').top;
        const s = BU.s || 1, u = sp.width / 480; const KP = ks.map(kartePoly); const inPoly = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; } return c; };
        // jeden Gegner allein in den Bildraum zeichnen (560 × 315), deckende Pixel (Alpha > 200, ohne Kontaktschatten) zählen
        let fl = 0, bed = 0; const c = document.createElement('canvas'); c.width = BILD.w; c.height = BILD.h; const g = c.getContext('2d', { willReadFrequently: true });
        for (const e of S.enemies) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.setTransform(1, 0, 0, 1, BILD.x, BILD.y); try { zeichneGegner(g, e, 0, performance.now() / 1000, { x: 0, y: 0 }); } catch (er) { }
          const d = g.getImageData(0, 0, c.width, c.height).data;
          for (let Y = 0; Y < c.height; Y++) for (let X = 0; X < c.width; X++) { if (d[(Y * c.width + X) * 4 + 3] <= 200) continue; fl++; const x = (X + .5) * 480 / BILD.w, y = (Y + .5) * 270 / BILD.h; const xi = Math.floor(x);
            if ((xi >= 0 && xi < 480 && y >= top[xi]) || KP.some(P => inPoly(P, sp.left + x * u, sp.top + y * u))) bed++; } }
        return { n: ks.length, hits, warn, stufen, bild, raus, verdeckt: fl ? bed / fl : 0 };
      }, n);
      const was = n === 'lang' ? `10 längste Texte (${lang.map(x => x.len).join(', ')} Zeichen)` : `${n} Karten`;
      ok(!r.hits.length && !r.raus, `${W}×${H} ${was}: Überlappungen ${r.hits.length ? r.hits.join(', ') : 'keine'}, außerhalb ${r.raus}`);
      ok(!r.warn.length, `${W}×${H} ${was}: alle Kartentexte passen${r.warn.length ? ' (läuft über: ' + r.warn.join(', ') + ')' : ''}, Stufen ${r.stufen.join('')}, Bildfenster ${Math.min(...r.bild)} bis ${Math.max(...r.bild)}`);
      console.log(`      Verdeckung bei ${was}: ${(r.verdeckt * 100).toFixed(2)} %`);
    }
    await p.close();
  }
  ok(!konsole.length, `Browser ohne Fehler${konsole.length ? ': ' + konsole[0] : ''}`);
  await b.close(); srv.close();
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
