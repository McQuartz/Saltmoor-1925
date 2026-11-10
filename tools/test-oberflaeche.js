// Auftrag 3, M2: DOM-Prüfungen der Kampfoberfläche (09-pruefen.md): kein Fragezeichen für Unbekanntes, keine Überlappung von
// eigenem Balken, Karten und Plaketten, Stoff-Baum zeigt dieselben Reaktionen wie reactionsFor, keine Kamera im Kampf.
// node tools/test-oberflaeche.js   (startet selbst einen Server auf Port 8014)
const path = require('path'), { spawn } = require('child_process');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', '8014'], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 900));
  try {
    const { chromium } = require('playwright'); const b = await chromium.launch();
    for (const [W, H] of [[1280, 720], [1440, 900], [1920, 1080]]) {
      const p = await b.newPage({ viewport: { width: W, height: H } }); const konsole = []; p.on('pageerror', e => konsole.push(String(e)));
      for (const biom of ['hafen', 'stadt', 'waisenhaus', 'glasmeer']) for (const art of ['kampf', 'waechter']) for (const n of [1, 2, 3]) {
        await p.goto(`http://localhost:8014/index.html?dev=0&job=fischer&seed=${n + 4}&springe=kampf&akt=0`); await p.waitForFunction(() => typeof S !== 'undefined' && S.phase === 'fight' && typeof RUN !== 'undefined', null, { timeout: 15000 }); await p.waitForTimeout(300);
        const r = await p.evaluate(async ([biom, art, n]) => {
          const ai = RUN.akte.findIndex(a => a.biome.includes(biom)); S.akt = ai; S.route[ai] = biom; BU.key = '';
          const B = BIOMES[biom], g = (B.gegner || []).filter(id => FOES[id]);
          const ids = art === 'waechter' ? [B.waechter, ...g.slice(0, n - 1)] : g.concat(g).slice(0, n);
          S.kampfArt = art; S.enemies = ids.map(id => mkEnemy(id)); aufstellen(S.enemies); render();
          // eine Karte spielen, damit der Baum Äste hat
          const i = S.hand.findIndex(c => cardCost(c) <= S.energy && !c.unspielbar); if (i >= 0) { playCard(i, 0); render(); }
          // die Plaketten ordnet ein MutationObserver nach dem Einsetzen (plakette.js): einen Zeitschlitz warten
          await new Promise(r => setTimeout(r, 0));
          const box = el => { const q = el.getBoundingClientRect(); return { l: q.left, t: q.top, r: q.right, b: q.bottom }; };
          const ueber = (a, c) => a.l < c.r - 1 && c.l < a.r - 1 && a.t < c.b - 1 && c.t < a.b - 1;
          const plak = [...document.querySelectorAll('#gegner .feind')].map(el => box(el.querySelector('.plakette') || el));
          const balken = box(document.querySelector('#spieler2'));
          const karten = [...document.querySelectorAll('#hand .karte')].map(box);
          let pp = 0; for (let a = 0; a < plak.length; a++) for (let c = a + 1; c < plak.length; c++) if (ueber(plak[a], plak[c])) pp++;
          const pb = plak.filter(x => ueber(x, balken)).length, pk = plak.filter(x => karten.some(k => ueber(x, k))).length, bk = karten.filter(k => ueber(k, balken)).length;
          const txt = ['#hud', '#leiste'].map(s => document.querySelector(s).innerText).join('\n');
          const frage = /\?|unbekannt|unentdeckt/i.test(txt);
          // Baum = reactionsFor
          const dom = [...document.querySelectorAll('#baum [data-ast]')].map(x => x.dataset.ast + ':' + x.dataset.rx).sort();
          const soll = []; if (S.last.length) for (const k of Object.keys(ST)) { const rx = reactionsFor(S.last, [k]); if (rx.length) soll.push(k + ':' + rx.map(r => r.n).join('|')); }
          const sack = !!document.querySelector('#baum .sackgasse');
          const baumOk = sack ? !baumDaten().aeste.some(a => a.hell) : soll.every(s => dom.includes(s));
          return { pp, pb, pk, bk, frage, baumOk, dom: dom.length, soll: soll.length, sack };
        }, [biom, art, n]);
        ok(!r.pp && !r.pb && !r.pk && !r.bk && !r.frage && r.baumOk, `${W}×${H} ${biom} ${art} ${n}: Plaketten überlappen ${r.pp}, mit Balken ${r.pb}, mit Karten ${r.pk}, Karten/Balken ${r.bk}, Fragezeichen ${r.frage}, Baum = reactionsFor ${r.baumOk} (${r.sack ? 'Sackgasse' : r.dom + ' Äste, soll ' + r.soll})`);
      }
      // keine Kamera im Kampf: Maus bewegen, Kamera bleibt bei 0
      await p.mouse.move(50, 50); await p.waitForTimeout(300); await p.mouse.move(W - 50, H / 2); await p.waitForTimeout(600);
      const cam = await p.evaluate(() => ({ x: BU.cam.x, y: BU.cam.y, ph: S.phase }));
      ok(cam.ph === 'fight' && cam.x === 0 && cam.y === 0, `${W}×${H}: keine Kamera im Kampf (cam ${cam.x.toFixed(2)}, ${cam.y.toFixed(2)})`);
      ok(!konsole.length, `${W}×${H}: Browser ohne Fehler${konsole.length ? ': ' + konsole[0] : ''}`);
      await p.close();
    }
    await b.close();
  } finally { srv.kill(); }
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
