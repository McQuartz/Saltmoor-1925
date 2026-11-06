// Auftrag 2, M3: Handgriff-Wahl, Ritzen, Rucksackmodus mit Grün/Rot, Hover-Vorschau. node tools/m3-fotos.js <ordner>
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.';require('fs').mkdirSync(out,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const f=[];
 p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error')f.push(m.text());});
 await p.goto('http://localhost:8000/index.html?dev=0&job=fischer&seed=8&springe=kampf&akt=0');await p.waitForTimeout(1500);
 // Kampf gewinnen → Belohnung mit Handgriff-Wahl
 await p.evaluate(()=>{S.enemies.forEach(e=>e.hp=0);checkVictory(30);});await p.waitForTimeout(1600);await p.screenshot({path:out+'/handgriff-wahl.png'});
 // Hover über den ersten Handgriff
 const h=await p.$('[data-hg]');if(h){await h.hover();await p.waitForTimeout(400);await p.screenshot({path:out+'/hover-handgriff.png'});}
 // Handgriff wählen → Ritzen
 await p.evaluate(()=>{takeHandgriff(S.rewardHg[0]);});await p.waitForTimeout(500);await p.screenshot({path:out+'/ritzen.png'});
 await p.evaluate(()=>{const b=besitz().find(x=>x.an&&kerbenVon(x.it)>hgVon(x.it).length)||besitz()[0];placeHandgriff(b.it.uid,hgVon(b.it).length>=kerbenVon(b.it)?0:null);});await p.waitForTimeout(400);
 // Item-Belohnung mit Hover
 await p.evaluate(()=>{S.reward=dropPool().slice(0,2);S.picked=false;render();});await p.waitForTimeout(300);const it=await p.$('[data-take]');if(it){await it.hover();await p.waitForTimeout(400);await p.screenshot({path:out+'/hover-item.png'});}
 await p.evaluate(()=>{takeReward(S.reward[0]);});
 // Rucksackmodus: Item aus dem Rucksack gegen ein angelegtes tauschen (Entwurf)
 await p.evaluate(()=>{rucksackAuf();const bi=RS.bag.findIndex(Boolean);const it=RS.bag[bi];const a=def(it).a;rsKlick('bag:'+bi);rsKlick(a+':0');});await p.waitForTimeout(500);await p.screenshot({path:out+'/rucksackmodus.png'});
 console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
