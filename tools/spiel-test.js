// Startet das Spiel in Chromium, prüft Konsolenfehler und macht Bildschirmfotos. node tools/spiel-test.js <ordner> [seed]
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'/tmp/shots',seed=process.argv[3]||5;require('fs').mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const fehler=[];
 p.on('console',m=>{if(m.type()==='error')fehler.push(m.text());});p.on('pageerror',e=>fehler.push(String(e)));
 const shot=async n=>{await p.waitForTimeout(700);await p.screenshot({path:`${out}/${n}.png`});};
 await p.goto('http://localhost:8000/index.html?dev=0');await p.evaluate(()=>{localStorage.clear();});await p.goto('http://localhost:8000/index.html?dev=0&seed='+seed);await shot('01-titel');
 await p.click('[data-act=neu]');await shot('02-figur');
 await p.click('[data-job=fischer]');await shot('03-uebergang');
 await p.click('[data-act=weiter]');await shot('04-weg');
 // ersten Kampf-Weg nehmen
 await p.evaluate(()=>{const i=S.weg.findIndex(o=>o.art==='kampf');chooseWeg(Math.max(0,i));});await shot('05-kampf');
 await p.hover('[data-card="0"]');await shot('06-kampf-vorschau');
 for(const sp of ['kraemer','ereignis','rast','werkstatt','wandbild','waechter','finale']){await p.goto(`http://localhost:8000/index.html?dev=0&job=pfarrerin&seed=${seed}&springe=${sp}&akt=${sp==='finale'?4:1}`);await shot('07-'+sp);}
 await p.evaluate(()=>{S.hp=0;runLost();});await shot('08-strand');
 await p.goto('http://localhost:8000/index.html?dev=1&job=fischer&seed=3&springe=kampf&akt=0');await p.waitForTimeout(500);await shot('09-dev');
 console.log(fehler.length?'KONSOLENFEHLER:\n'+[...new Set(fehler)].join('\n'):'Keine Konsolenfehler.');await b.close();})();
