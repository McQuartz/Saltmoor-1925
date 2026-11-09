// Auftrag 3, M1: Tests für die sieben Fixes aus docs/auftrag-3/04-welle-1.md.
// node tools/test-welle1.js [--ohne-browser]
// Teil 1 läuft im Kern (Node), Teil 2 im Browser (Playwright, startet selbst einen Server auf Port 8013).
const { ladeKern } = require('./kern');
const path = require('path'), { spawn } = require('child_process');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
(async () => {
  const K = ladeKern(); await K.init(); const run = K.run;
  // ---------- Fix 1: Fragmente in jedem Biom ----------
  try {
    const r = JSON.parse(run(`JSON.stringify(RUN.akte.flatMap(a=>a.biome).map(b=>[b,FRAGS.filter(f=>f.biom===b).length]))`));
    const falsch = r.filter(([, n]) => n !== 3);
    ok(!falsch.length, `Fix 1: jedes Biom hat genau 3 Fragmente${falsch.length ? ' (falsch: ' + falsch.map(x => x.join('=')).join(', ') + ')' : ''}`);
    ok(run(`FRAGS.length`) === 75, `Fix 1: 75 Fragmente insgesamt (${run('FRAGS.length')})`);
    // 50 Seeds Autospieler: jeder Wandbild-Knoten hat ein Fragment (kein „Eine leere Wand“)
    const w = JSON.parse(run(`(()=>{let n=0,leer=0;Bus.on('node',p=>{if(p.art==='wandbild'){n++;if(!S.frag)leer++;}});const jobs=JOBS.map(j=>j.id);for(let i=0;i<50;i++)Bot.spiele(jobs[i%jobs.length],500+i,{});return JSON.stringify({n,leer});})()`));
    ok(w.n > 20 && w.leer === 0, `Fix 1: ${w.n} Wandbild-Knoten in 50 Runs, davon leer: ${w.leer}`);
    // Freischaltung: drei Fragmente aus neuen Biomen schalten die erste gesperrte Figur frei
    const neu = JSON.parse(run(`(()=>{Meta.reset();const alt=new Set(['hafen','moor','kapelle','salz','stadt','eis','pforte']);const fs=FRAGS.filter(f=>!alt.has(f.biom)).slice(0,3);const vor=JOBS.filter(Meta.figurFrei).length;fs.forEach(f=>Meta.lies(f.id));const nach=JOBS.filter(Meta.figurFrei).length;Meta.reset();return JSON.stringify({vor,nach,ids:fs.map(f=>f.id)});})()`));
    ok(neu.nach > neu.vor, `Fix 1: drei neue Fragmente (${neu.ids.join(', ')}) schalten eine Figur frei (${neu.vor} → ${neu.nach})`);
  } catch (e) { ok(false, 'Fix 1: ' + String(e).split('\n')[0]); }
  // ---------- Fix 2: Beute-Satz ----------
  try {
    const r = JSON.parse(run(`(()=>{const o=[];Bus.on('reward',()=>o.push(S.beuteSatz||null));const jobs=JOBS.map(j=>j.id);const runs=[];for(let i=0;i<50;i++){const a=o.length;Bot.spiele(jobs[i%jobs.length],700+i,{});runs.push(o.slice(a));}return JSON.stringify(runs);})()`));
    const alle = r.flat(); const ersatz = alle.filter(x => !x).length;
    let doppelt = 0; r.forEach(l => l.forEach((x, i) => { if (i && x && x === l[i - 1]) doppelt++; }));
    ok(alle.length > 200 && ersatz / alle.length < .05, `Fix 2: ${alle.length} Belohnungen, Ersatztext ${ersatz} (${(ersatz / alle.length * 100).toFixed(1)} %, Ziel < 5 %)`);
    ok(doppelt === 0, `Fix 2: kein Satz zweimal hintereinander (${doppelt})`);
  } catch (e) { ok(false, 'Fix 2: ' + String(e).split('\n')[0]); }
  // ---------- Fix 3: Absicht nach dem Gegnerzug ausgeblendet (Kern) ----------
  try {
    const r = JSON.parse(await new Promise(res => {
      run(`newRun('fischer',41,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=1;S.depth=8;startFight([biom().gegner[0],biom().gegner[1]],'kampf');FAST=false;
        globalThis.__w3=null;Bus.on('gegnerzug_ende',()=>{if(!globalThis.__w3)globalThis.__w3=JSON.stringify({sicht:alive().map(e=>typeof absichtSichtbar==='function'?absichtSichtbar(e):true),vorschau:incomingSichtbar()});});
        S.hand=[];endTurn();`);
      const t0 = Date.now(); const iv = setInterval(() => { const v = run('globalThis.__w3'); if (v || Date.now() - t0 > 8000) { clearInterval(iv); run('FAST=false'); res(v || JSON.stringify({ sicht: [true], vorschau: -1 })); } }, 50);
    }));
    ok(r.sicht.every(x => x === false), `Fix 3: nach dem Gegnerzug ist keine Absicht sichtbar (${JSON.stringify(r.sicht)})`);
    ok(r.vorschau === 0, `Fix 3: Schadensvorschau nach dem Gegnerzug 0 (${r.vorschau})`);
    await new Promise(res => { const t0 = Date.now(); const iv = setInterval(() => { if (run('busy') === false || Date.now() - t0 > 4000) { clearInterval(iv); res(); } }, 30); });
    const z = JSON.parse(run(`JSON.stringify(alive().map(e=>absichtSichtbar(e)))`));
    ok(z.every(x => x), `Fix 3: zum Zugbeginn ist die neue Absicht wieder sichtbar`);
  } catch (e) { ok(false, 'Fix 3: ' + String(e).split('\n')[0]); }
  // ---------- Fix 6: Reaktionen verstärken Ziehen, Stärke, Gold, nicht Energie ----------
  try {
    const t = (karte, feld) => JSON.parse(run(`(()=>{newRun('fischer',5,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.depth=3;startFight([biom().gegner[0]],'kampf');FAST=true;
      S.hand=[{n:'Test',c:0,st:['W'],...${JSON.stringify(karte)}}];S.draw=[...Array(10)].map((_,i)=>({n:'K'+i,c:1,st:['F'],blk:1}));S.last=['W'];S.energy=3;S.gold=0;S.pstr=0;
      const h0=S.hand.length,e0=S.energy,g0=S.gold,s0=S.pstr;playCard(0);FAST=false;return JSON.stringify({zieh:S.hand.length-h0+1,en:S.energy-e0,gold:S.gold-g0,str:S.pstr-s0});})()`))[feld];
    ok(t({ draw: 2 }, 'zieh') === 3, `Fix 6: „ziehe 2“ mit Verstärkt zieht 3 (${t({ draw: 2 }, 'zieh')})`);
    ok(t({ draw: 1 }, 'zieh') === 2, `Fix 6: „ziehe 1“ mit Verstärkt zieht 2 (${t({ draw: 1 }, 'zieh')})`);
    ok(t({ en: 1 }, 'en') === 1, `Fix 6: „+1 Energie“ mit Verstärkt gibt 1 (${t({ en: 1 }, 'en')})`);
    ok(t({ gold: 4 }, 'gold') === 6, `Fix 6: „+4 Gold“ mit Verstärkt gibt 6 (${t({ gold: 4 }, 'gold')})`);
    ok(t({ str: 2 }, 'str') === 3, `Fix 6: „Stärke 2“ mit Verstärkt gibt 3 (${t({ str: 2 }, 'str')})`);
    const pv = JSON.parse(run(`(()=>{newRun('fischer',5,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.depth=3;startFight([biom().gegner[0]],'kampf');S.hand=[{n:'Test',c:0,st:['W'],draw:2}];S.draw=[...Array(5)].map((_,i)=>({n:'K'+i,c:1,st:['F'],blk:1}));S.last=['W'];const p=previewCard(0,null);return JSON.stringify({draw:p.draw});})()`));
    ok(pv.draw === 3, `Fix 6: Vorschau zeigt 3 gezogene Karten (${pv.draw})`);
  } catch (e) { ok(false, 'Fix 6: ' + String(e).split('\n')[0]); }
  // ---------- Fix 7: Boss allein Panzer, mit Dienern unverwundbar ----------
  try {
    const setup = mitDiener => `newRun('fischer',9,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.route[1]='waisenhaus';S.akt=1;S.depth=13;startFight(['heimleiterin'${mitDiener ? ",'zwillinge'" : ''}],'waechter');FAST=true;
      const bs=S.enemies[0];bs.pi=bs.pat.findIndex(p=>p.unverw);S.enemies.forEach(e=>e.block=0);if(typeof panzerZugbeginn==="function")panzerZugbeginn();`;
    const allein = JSON.parse(run(`(()=>{${setup(false)}const b=S.enemies[0];const hp0=b.hp,p0=b.panzer||0;
      b.poison=5;hit(b,5,1,'V','Gift',{dot:true});const nachGift=b.hp;hit(b,6,1,null,'Schlag');const nachSchlag=b.hp;return JSON.stringify({hp0,p0,nachGift,nachSchlag,panzer:b.panzer||0,max:b.max});})()`));
    const soll = Math.round(allein.max * .4 / 5) * 5;
    ok(allein.p0 === soll, `Fix 7: Boss allein bekommt Panzer ${soll} (40 % von ${allein.max}, auf 5 gerundet): ${allein.p0}`);
    ok(allein.nachGift === allein.hp0 - 5, `Fix 7: Gift trifft den Boss trotz Panzer (${allein.hp0} → ${allein.nachGift})`);
    ok(allein.nachSchlag === allein.nachGift && allein.panzer === soll - 6, `Fix 7: Panzer fängt direkten Schaden ab (Leben ${allein.nachSchlag}, Panzer ${allein.panzer})`);
    const mit = JSON.parse(run(`(()=>{${setup(true)}const b=S.enemies[0];const hp0=b.hp;hit(b,6,1,null,'Schlag');const a=b.hp;b.poison=3;hit(b,3,1,'V','Gift',{dot:true});const g=b.hp;
      S.enemies[1].hp=1;hit(S.enemies[1],5,1,null,'Diener weg');hit(b,6,1,null,'Schlag');return JSON.stringify({hp0,a,g,c:b.hp,panzer:b.panzer||0});})()`));
    ok(mit.a === mit.hp0 && mit.g === mit.hp0 && mit.panzer === 0, `Fix 7: mit Diener unverwundbar, ohne Panzer (Leben ${mit.hp0} → ${mit.a} → ${mit.g})`);
    ok(mit.c === mit.g - 6, `Fix 7: Diener stirbt im selben Zug, der Schutz fällt sofort (${mit.g} → ${mit.c})`);
  } catch (e) { ok(false, 'Fix 7: ' + String(e).split('\n')[0]); }
  // ---------- Teil 2: Browser (Fix 3, 4, 5 im DOM) ----------
  if (!process.argv.includes('--ohne-browser')) {
    const srv = spawn('python3', ['-m', 'http.server', '8013'], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 900));
    try {
      const { chromium } = require('playwright'); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
      const konsole = []; p.on('pageerror', e => konsole.push(String(e)));
      await p.goto('http://localhost:8013/index.html?dev=0&job=fischer&seed=12&springe=kampf&akt=1'); await p.waitForTimeout(1500);
      // Fix 4: geschwächter Gegner, kein Durchgestrichenes
      await p.evaluate(() => { const e = alive()[0]; e.pi = e.pat.findIndex(x => x.t === 'atk'); if (e.pi < 0) { e.pat.unshift({ t: 'atk', v: 9 }); e.pi = 0; } e.weak2 = 1; S.block = 0; render(); });
      const d4 = await p.evaluate(() => { const h = document.body.innerHTML; const st = [...document.querySelectorAll('#hud *, #leiste *')].filter(el => getComputedStyle(el).textDecorationLine.includes('line-through')).length; return { s: /<s>|<del>/.test(document.getElementById('hud').innerHTML + document.getElementById('leiste').innerHTML), st, tip: (document.querySelector('[data-ei]') || {}).title || '' }; });
      ok(!d4.s && d4.st === 0, `Fix 4: kein <s>/<del>/line-through in Absicht, Karte oder Balken (${JSON.stringify(d4)})`);
      const tip4 = await p.evaluate(() => typeof feindTip === 'function' ? feindTip(S.enemies.indexOf(alive()[0])) : '');
      ok(/Geschwächt/.test(tip4), `Fix 4: der Grund steht im Tooltip der Plakette (${tip4.includes('Geschwächt') ? 'Geschwächt …' : 'fehlt'})`);
      // Fix 5: keine „−x Leben“-Zeile, Schraffur = max(0, eingehend − Block)
      await p.evaluate(() => { const e = alive()[0]; e.weak2 = 0; S.block = 3; render(); });
      const d5 = await p.evaluate(() => { const txt = [...document.querySelectorAll('#spieler, #leiste, #hud')].map(x => x.innerText).join('\n'); const sch = document.querySelector('.schraffur'); const bar = sch && sch.parentElement;
        return { minus: /[−-]\s*\d+\s*Leben/.test(txt), w: sch ? sch.getBoundingClientRect().width / bar.getBoundingClientRect().width : -1, soll: Math.max(0, incomingSichtbar() - S.block) / maxHp() }; });
      ok(!d5.minus, `Fix 5: kein Text „−x Leben“ unter dem Balken`);
      ok(Math.abs(d5.w - d5.soll) < .01, `Fix 5: Schraffur-Breite ${d5.w.toFixed(3)} = max(0, eingehend − Block) / max. Leben ${d5.soll.toFixed(3)}`);
      // Fix 3 im DOM: nach dem Gegnerzug keine Absicht, keine Schraffur
      const d3 = await p.evaluate(() => new Promise(res => { let fertig = false; Bus.on('gegnerzug_ende', () => { if (fertig) return; fertig = true; render(); res({ abs: [...document.querySelectorAll('#gegner .abs')].filter(x => x.innerText.trim()).length, sch: !!document.querySelector('.schraffur') }); }); S.hand = []; endTurn(); setTimeout(() => res({ abs: -1, sch: true }), 9000); }));
      ok(d3.abs === 0 && !d3.sch, `Fix 3: im DOM nach dem Gegnerzug keine Absicht, keine Schraffur (${JSON.stringify(d3)})`);
      ok(!konsole.length, `Browser ohne Fehler${konsole.length ? ': ' + konsole[0] : ''}`);
      await b.close();
    } finally { srv.kill(); }
  }
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
