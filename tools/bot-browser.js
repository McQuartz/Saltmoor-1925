// Autospieler im echten Browser (Chromium, headless): node tools/bot-browser.js [runs=20] [startSeed=1]
// Öffnet index.html?bot=N&seed=S, wartet auf window.BOT_ERGEBNIS und meldet Konsolenfehler.
const {chromium}=require('playwright');
(async()=>{const n=+(process.argv[2]||20),s=+(process.argv[3]||1);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const fehler=[];
 p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))fehler.push(m.text());});p.on('pageerror',e=>fehler.push(String(e)));
 await p.goto(`http://localhost:8000/index.html?bot=${n}&seed=${s}`);
 await p.waitForFunction(()=>window.BOT_ERGEBNIS,null,{timeout:600000});
 const r=await p.evaluate(()=>window.BOT_ERGEBNIS);
 for(const o of r.out)console.log(`${String(o.seed).padStart(4)} ${o.job.padEnd(17)} ${o.sieg?'SIEG ('+o.ende+')':'Strand'} Tiefe ${String(o.tiefe).padStart(2)} ${o.biom.padEnd(8)} ${o.route}${o.fehler?' FEHLER '+o.fehler.split('\n')[0]:''}`);
 const S=r.sum;console.log(`\nRuns ${S.runs} · Siege ${S.siege} (${Math.round(S.rate*100)} %) · Ø Tiefe ${S.tiefe.toFixed(1)} · Niederlagen je Biom ${JSON.stringify(S.tode)} · Run-Fehler ${S.fehler} · ${S.ms} ms`);
 console.log(fehler.length?'KONSOLENFEHLER:\n'+[...new Set(fehler)].join('\n'):'Keine Konsolenfehler.');await b.close();process.exit(S.fehler||fehler.length?1:0);})();
