// Bildschirmfotos der neuen Icons im laufenden Spiel (Server auf Port 8000): Kampf und Belohnung mit Handgriff-Wahl.
// node tools/icons/foto.js  ->  docs/auftrag-2/bilder/M5/icons-im-spiel-*.png
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:2});const f=[];
 p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error')f.push(m.text());});
 await p.goto('http://localhost:8000/index.html?dev=0&job=fischer&seed=8&springe=kampf&akt=0');await p.waitForTimeout(1800);
 await p.screenshot({path:'docs/auftrag-2/bilder/M5/icons-im-spiel-kampf.png'});
 await p.evaluate(()=>{S.enemies.forEach(e=>e.hp=0);checkVictory(30);});await p.waitForTimeout(1800);
 await p.screenshot({path:'docs/auftrag-2/bilder/M5/icons-im-spiel-handgriff-wahl.png'});
 await p.screenshot({path:'docs/auftrag-2/bilder/M5/icons-im-spiel-leiste.png',clip:{x:225,y:540,width:830,height:68}});
 const info=await p.evaluate(()=>({hg:[...document.querySelectorAll('img')].filter(i=>/handgriffe\//.test(i.src)).length,it:[...document.querySelectorAll('img')].filter(i=>/assets\/items\//.test(i.src)).length}));
 console.log(JSON.stringify(info));console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
