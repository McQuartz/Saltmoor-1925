// Auftrag 3 M12: ganzer Run im Browser (09-pruefen.md Abschnitt 6), jede Station ein Bild, Kontaktbogen.
// node tools/m12-geklickt.js [figur=detektiv] [seed=21] [ziel=docs/auftrag-3/bilder/M12/run]
// Alle Systeme an. Die Entscheidungen trifft der Autospieler (Bot.schritt) in der laufenden Seite; vor jedem Schritt wird
// die Station gezeichnet und fotografiert, sobald sich Phase, Tiefe, Zug oder Ereignis ändern. Startet selbst einen Server.
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs'), { spawn, execFileSync } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800), URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const job = process.argv[2] || 'detektiv', seed = +(process.argv[3] || 21), out = process.argv[4] || 'docs/auftrag-3/bilder/M12/run';
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  await p.goto(`${URL}?dev=0`); await p.waitForTimeout(800);
  await p.evaluate(([job, seed]) => {
    window.__st = { bieg: new Set(), stumm: 0, blick: 0, farbe: 0, beg: 0, mehr: 0, wz: new Set(), log: [] };
    const st = window.__st;
    Bus.on('fight_start', () => { const g = Bieg.aktiv(); if (g) st.bieg.add(g.id); if (S.enemies.some(e => Hoeren.istStumm(e))) st.stumm++; });
    Bus.on('blick', () => st.blick++); Bus.on('farbe', () => st.farbe++);
    Bus.on('tiefe', x => { if (x.art === 'begegnung') st.beg++; if (x.art === 'mehr') st.mehr++; });
    Bus.on('wuerze', x => st.wz.add(x.art));
    newRun(job, seed, { dev: true }); render();
  }, [job, seed]);
  let n = 0, letzte = '', liste = [];
  for (let schritt = 0; schritt < 4000; schritt++) {
    const z = await p.evaluate(() => ({ ph: S.phase, d: S.depth, akt: S.akt, zug: S.turnNo || 0, biom: S.route && S.route[S.akt] || '', ev: S.event && (S.event.id || S.event) || '', koe: !!KOE, beg: !!S.begegnung, blick: !!S.blickWahl }));
    if (['strand', 'ende'].includes(z.ph) && n && letzte.startsWith(z.ph)) break;
    // eine Station: neue Phase oder neuer Knoten; im Kampf der erste Zug und jeder dritte
    const key = `${z.ph}|${z.d}|${z.akt}|${z.ph === 'fight' ? (z.zug <= 1 ? 1 : z.zug % 3 ? 'x' : z.zug) : ''}|${z.ev}`;
    if (key !== letzte && !key.includes('|x|')) {
      letzte = key; n++;
      await p.evaluate(() => { BU.key = ''; render(); }); await p.waitForTimeout(z.ph === 'fight' ? 1100 : 700);
      const name = `${String(n).padStart(3, '0')}-${z.ph}${z.biom ? '-' + z.biom : ''}${z.ph === 'fight' ? '-zug' + z.zug : ''}${z.beg ? '-begegnung' : ''}${z.blick ? '-blick' : ''}`;
      await p.screenshot({ path: `${out}/${name}.png` }); liste.push(name);
      if (z.koe) { await p.evaluate(() => rucksackZu()); }
    }
    if (['strand', 'ende'].includes(z.ph)) break;
    const ok = await p.evaluate(() => { const kf = FAST; FAST = true; let r; try { r = Bot.schritt(); } finally { FAST = kf; busy = false; } if (KOE) rucksackZu(); return !!r; });
    if (!ok) { f.push('Bot hängt in Phase ' + z.ph); break; }
  }
  const st = await p.evaluate(() => { const s = window.__st; return { phase: S.phase, tiefe: S.depth, route: S.route, bieg: [...s.bieg], stumm: s.stumm, blick: s.blick, farbe: s.farbe, begegnungen: S.zettel.begegnungen, begegnungStatt: s.beg, mehr: s.mehr, wuerze: S.zettel.wuerze, wuerzeEreignisse: [...s.wz] }; });
  fs.writeFileSync(`${out}/../run-protokoll.json`, JSON.stringify({ job, seed, stationen: liste.length, ...st, liste }, null, 1));
  console.log(JSON.stringify({ job, seed, stationen: liste.length, ...st }));
  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
  // Kontaktbogen
  execFileSync('python3', ['-c', `
import sys,os
from PIL import Image,ImageDraw
d=sys.argv[1];fs=sorted(x for x in os.listdir(d) if x.endswith('.png'));W,H=320,180;C=8;R=(len(fs)+C-1)//C
o=Image.new('RGB',(C*W,R*(H+14)),(12,12,14));dr=ImageDraw.Draw(o)
for i,x in enumerate(fs):
 im=Image.open(os.path.join(d,x)).convert('RGB').resize((W,H));c,r=i%C,i//C;o.paste(im,(c*W,r*(H+14)));dr.text((c*W+3,r*(H+14)+H+1),x[:-4][:52],fill=(200,200,190))
o.save(sys.argv[2])`, out, path.join(out, '..', 'run-uebersicht.png')]);
})();
