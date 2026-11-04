// Bildschirmfotos des Dev-Modus (Reiter Jetzt, Kampf, Run, Cheats): node tools/dev-fotos.js <ordner>
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.';require('fs').mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
 await p.goto('http://localhost:8000/index.html?dev=1&job=fischer&seed=4&springe=kampf&akt=1');await p.waitForTimeout(800);
 // zwei Karten spielen, damit Kette und Warum gefüllt sind
 await p.evaluate(()=>{for(let k=0;k<2;k++){const i=S.hand.findIndex(c=>cardCost(c)<=S.energy);if(i>=0)playCard(i,S.enemies.findIndex(e=>e.hp>0));}render();});
 await p.waitForTimeout(1200);
 for(const t of ['jetzt','kampf','run','cheats']){await p.evaluate(t=>{Dev.tab=t;Dev.render();},t);await p.waitForTimeout(300);await p.screenshot({path:`${out}/dev-${t}.png`});}
 await b.close();})();
