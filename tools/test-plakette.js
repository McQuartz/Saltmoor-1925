// Auftrag 3, M2: Gegner-Plaketten. node tools/test-plakette.js [--ohne-fotos]
// Startet selbst einen Server auf freiem Port aus prototype/, prüft Überlappung, Szenengrenzen, Ziel, Absicht nach dem Gegnerzug, stumme Gegner,
// kein „?“ und schreibt Bildschirmfotos nach docs/auftrag-3/bilder/M2/plakette-*.png (1440×900).
const path = require('path'), fs = require('fs'), http = require('http'), net = require('net');
const { spawn } = require('child_process');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
const fotos = !process.argv.includes('--ohne-fotos');
const AUS = path.join(__dirname, '..', 'docs', 'auftrag-3', 'bilder', 'M2');
const freierPort = () => new Promise(r => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const warten = (url, n = 40) => new Promise((res, rej) => { const t = i => http.get(url, x => { x.resume(); res(); }).on('error', () => i > n ? rej(new Error('Server startet nicht')) : setTimeout(() => t(i + 1), 150)); t(0); });
const AUFL = [[1280, 720], [1440, 900], [1920, 1080]];
// Messung im Browser: Rechtecke aller Plaketten (Szenenpixel), Szene, Texte
const MESSEN = () => {
  const sz = document.getElementById('szene').getBoundingClientRect(), u = sz.width / SW;
  const pl = [...document.querySelectorAll('#gegner .feind .plakette')].map(p => { const r = p.getBoundingClientRect(); return { l: (r.left - sz.left) / u, r: (r.right - sz.left) / u, t: (r.top - sz.top) / u, b: (r.bottom - sz.top) / u }; });
  const lap = []; for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) { const a = pl[i], b = pl[j]; if (a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b) lap.push([i, j]); }
  const raus = pl.filter(a => a.l < 0 || a.r > SW || a.t < 22 - .5 || a.b > SH).length;
  return { n: pl.length, lap, raus, pl: pl.map(a => [a.l, a.r, a.t, a.b].map(x => Math.round(x))), text: document.getElementById('gegner').innerText };
};
const STELLE = n => `S.enemies=biom().gegner.slice(0,${n}).map(id=>mkEnemy(id));aufstellen(S.enemies);render();`;
(async () => {
  const port = await freierPort();
  const srv = spawn('python3', ['-m', 'http.server', String(port)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  try {
    await warten(`http://localhost:${port}/index.html`);
    const { chromium } = require('playwright'); const b = await chromium.launch();
    const konsole = [];
    const seite = async (W, H, s, nach) => {
      const p = await b.newPage({ viewport: { width: W, height: H } }); p.on('pageerror', e => konsole.push(String(e)));
      await p.goto(`http://localhost:${port}/index.html?dev=0&job=fischer&seed=3&springe=${s}&akt=1`); await p.waitForTimeout(1300);
      if (nach) { await p.evaluate(nach); await p.waitForTimeout(500); } return p;
    };
    // ---------- 1. Überlappung, Szenengrenzen, kein „?“ ----------
    for (const [W, H] of AUFL) {
      for (const n of [1, 2, 3, 4]) {
        const p = await seite(W, H, 'kampf', STELLE(n)); const m = await p.evaluate(MESSEN);
        ok(m.n === n && !m.lap.length && !m.raus && !/\?/.test(m.text), `${W}×${H}, ${n} Gegner: ${m.n} Plaketten, Überlappungen ${m.lap.length}, außerhalb ${m.raus}, „?“ ${/\?/.test(m.text) ? 'ja' : 'nein'} ${JSON.stringify(m.pl)}`);
        await p.close();
      }
      const p = await seite(W, H, 'waechter'); const m = await p.evaluate(MESSEN);
      ok(m.n >= 1 && !m.lap.length && !m.raus && !/\?/.test(m.text), `${W}×${H}, Wächter: ${m.n} Plaketten, Überlappungen ${m.lap.length}, außerhalb ${m.raus} ${JSON.stringify(m.pl)}`);
      await p.close();
      // Wächter mit Dienern (zwei Plaketten eng beieinander), Boss mit Panzer, viele Statuswerte und Block
      const q = await seite(W, H, 'waechter', `S.enemies=[mkEnemy('heimleiterin'),mkEnemy('zwillinge')];aufstellen(S.enemies);const bb=S.enemies[0];bb.pi=bb.pat.findIndex(p=>p.unverw);panzerZugbeginn();S.enemies.forEach(e=>{e.block=14;e.burn=3;e.poison=4;e.weak2=1;e.str=2;e.vuln=2;});render();`);
      const m2 = await q.evaluate(MESSEN); ok(m2.n === 2 && !m2.lap.length && !m2.raus, `${W}×${H}, Wächter mit Diener, Block, Panzer, alle Status: Überlappungen ${m2.lap.length}, außerhalb ${m2.raus} ${JSON.stringify(m2.pl)}`); await q.close();
    }
    // Alle Gegner jedes Bioms zu viert (so eng wie möglich)
    {
      const p = await seite(1440, 900, 'kampf'); await p.evaluate(`window.MESSEN=${MESSEN.toString()}`); const r = await p.evaluate(async () => { const bad = []; let n = 0;
        for (const id of Object.keys(FOES)) { S.enemies = [id, id, id, id].map(x => mkEnemy(x)); aufstellen(S.enemies); render(); await new Promise(r => setTimeout(r, 0)); const m = MESSEN(); n++; if (m.lap.length || m.raus) bad.push(id + ' ' + JSON.stringify(m.pl)); }
        const abg = []; for (const id of Object.keys(FOES)) { S.enemies = [mkEnemy(id)]; aufstellen(S.enemies); render(); await new Promise(r => setTimeout(r, 0)); const sp = document.querySelector('#gegner .pl-nm span'); if (sp.scrollWidth > sp.clientWidth + 1) abg.push(FOES[id].n); }
        return { n, bad, abg }; });
      ok(!r.abg.length, `1440×900: kein Gegnername in der Plakette abgeschnitten${r.abg.length ? ' (' + r.abg.slice(0, 8).join(', ') + ')' : ''}`);
      ok(!r.bad.length, `1440×900: jeder der ${r.n} Gegnertypen viermal nebeneinander: keine Überlappung, nichts außerhalb${r.bad.length ? ' (' + r.bad.slice(0, 4).join('; ') + ')' : ''}`); await p.close();
    }
    // ---------- 2. Ziel per Klick, Tooltip-Anker ----------
    {
      const p = await seite(1440, 900, 'kampf', STELLE(3));
      const z = await p.evaluate(() => S.target); const ziel = z === 0 ? 1 : 0;
      await p.locator(`#gegner .feind[data-ei="${ziel}"] .pl-box`).click(); await p.waitForTimeout(200);
      const z2 = await p.evaluate(() => ({ t: S.target, k: document.querySelector('#gegner .feind.ziel').dataset.ei })); ok(z2.t === ziel && +z2.k === ziel, `Klick auf die Plakette wählt Ziel ${ziel} (S.target=${z2.t}, hell: ${z2.k})`);
      const ziel2 = ziel === 2 ? 0 : 2; await p.locator(`#gegner .feind[data-ei="${ziel2}"] .treffer`).click({ force: true }); await p.waitForTimeout(200);
      const z3 = await p.evaluate(() => S.target); ok(z3 === ziel2, `Klick auf den Gegner (Trefferbereich) wählt Ziel ${ziel2} (S.target=${z3})`);
      await p.close();
    }
    // ---------- 3. Absicht: sichtbar vor dem Gegnerzug, danach keine; stumm ohne Absicht-Element; Kniff verborgen ohne Zahl und „?“ ----------
    {
      const p = await seite(1440, 900, 'kampf', STELLE(2));
      const vor = await p.evaluate(() => document.querySelectorAll('#gegner .plakette .abs').length); ok(vor === 2, `vor dem Gegnerzug: ${vor} Absicht-Bereiche in 2 Plaketten`);
      const nach = await p.evaluate(() => new Promise(res => { let f = false; Bus.on('gegnerzug_ende', () => { if (f) return; f = true; render(); res({ abs: document.querySelectorAll('#gegner .abs').length, leer: [...document.querySelectorAll('#gegner .plakette')].length, bar: document.querySelectorAll('#gegner .pl-bar').length }); }); S.hand = []; endTurn(); setTimeout(() => res({ abs: -1 }), 9000); }));
      ok(nach.abs === 0 && nach.bar === nach.leer && nach.leer > 0, `nach dem Gegnerzug (gegnerzug_ende): keine Absicht, nur Leben (${JSON.stringify(nach)})`);
      await p.close();
      const q = await seite(1440, 900, 'kampf', `S.enemies=[mkEnemy(biom().gegner[0]),mkEnemy(biom().gegner[1])];aufstellen(S.enemies);S.enemies[1].stumm=true;/* seit M6 zählt stumm nur in Akt IV und V (hoeren.js); hier im frühen Akt erzwungen */const alt=Hoeren.istStumm;Hoeren.istStumm=e=>e===S.enemies[1]||alt.call(Hoeren,e);render();`);
      const st = await q.evaluate(() => [...document.querySelectorAll('#gegner .feind')].map(f => ({ abs: f.querySelectorAll('.abs').length, bar: f.querySelectorAll('.pl-bar').length })));
      ok(st[0].abs === 1 && st[1].abs === 0 && st[1].bar === 1, `stummer Gegner: Plakette ohne Absicht-Element, mit Leben (${JSON.stringify(st)})`);
      const hoehe = await q.evaluate(() => [...document.querySelectorAll('#gegner .pl-box')].map(x => Math.round(x.getBoundingClientRect().height)));
      ok(hoehe[1] < hoehe[0], `stumme Plakette ist niedriger, kein leerer Platz (Höhen ${hoehe})`); await q.close();
      const v = await seite(1440, 900, 'kampf', `S.enemies=[mkEnemy(biom().gegner[0])];aufstellen(S.enemies);const e=S.enemies[0];e.kniff={art:'verborgen'};e.pi=Math.max(0,e.pat.findIndex(x=>x.t==='atk'));render();`);
      const vt = await v.evaluate(() => { const a = document.querySelector('#gegner .abs'); return { t: a ? a.innerText.trim() : null, img: a ? a.querySelectorAll('img').length : 0, q: /\?/.test(document.getElementById('gegner').innerText) }; });
      ok(vt.img === 1 && vt.t === '' && !vt.q, `Kniff verborgen: nur das Zeichen, keine Zahl, kein „?“ (${JSON.stringify(vt)})`); await v.close();
    }
    ok(!konsole.length, `Browser ohne Fehler${konsole.length ? ': ' + konsole[0] : ''}`);
    // ---------- 4. Bildschirmfotos bei 1440×900 ----------
    if (fotos) {
      fs.mkdirSync(AUS, { recursive: true });
      const FOTOS = {
        '1-gegner': ['kampf', STELLE(1)], '2-gegner': ['kampf', STELLE(2)], '3-gegner': ['kampf', STELLE(3)], '4-gegner': ['kampf', STELLE(4)], 'waechter': ['waechter', null],
        'geschwaecht': ['kampf', `${STELLE(2)}const e=S.enemies[0];e.pi=Math.max(0,e.pat.findIndex(x=>x.t==='atk'));e.weak2=1;e.vuln=2;e.poison=3;render();`],
        'block': ['kampf', `${STELLE(2)}S.enemies[0].block=9;S.enemies[0].str=2;S.enemies[1].block=4;render();`],
        'panzer': ['waechter', `S.enemies=[mkEnemy('heimleiterin')];aufstellen(S.enemies);const b=S.enemies[0];b.pi=b.pat.findIndex(p=>p.unverw);panzerZugbeginn();render();`],
        'verborgen': ['kampf', `${STELLE(2)}S.enemies[0].kniff={art:'verborgen'};S.enemies[0].pi=Math.max(0,S.enemies[0].pat.findIndex(x=>x.t==='atk'));render();`],
        'stumm': ['kampf', `${STELLE(2)}S.enemies[1].stumm=true;render();`],
        'nach-gegnerzug': ['kampf', `${STELLE(2)}S.nachGegnerzug=true;render();`],
        'vorschau': ['kampf', `${STELLE(2)}S.hand=[{n:'Schlag',c:1,st:['F'],atk:9}];S.energy=3;vorschau=previewCard(0,0);vorschau.i=0;S.enemies[0].block=4;render();`],
      };
      for (const [k, [s, js]] of Object.entries(FOTOS)) { const p = await seite(1440, 900, s, js); const f = path.join(AUS, `plakette-${k}.png`); await p.screenshot({ path: f }); console.log(f); await p.close(); }
    }
    await b.close();
  } finally { srv.kill(); }
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
