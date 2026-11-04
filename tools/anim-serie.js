// Bildschirmfoto-Serie im Kampf: Idle, Treffer, Angriff, Tod (M6-Abnahme): node tools/anim-serie.js <ordner>
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.';require('fs').mkdirSync(out,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
 await p.goto('http://localhost:8000/index.html?dev=0&job=fischer&seed=21&springe=kampf&akt=0');await p.waitForTimeout(1200);
 const clip={x:160,y:0,width:960,height:540};
 await p.screenshot({path:out+'/serie-1-idle.png',clip});
 await p.evaluate(()=>{S.dev=true;const i=S.hand.findIndex(c=>c.atk);playCard(i>=0?i:0,0);});await p.waitForTimeout(60);await p.screenshot({path:out+'/serie-2-treffer.png',clip});
 await p.waitForTimeout(800);await p.evaluate(()=>endTurn());await p.waitForTimeout(420);await p.screenshot({path:out+'/serie-3-angriff.png',clip});
 await p.waitForTimeout(1500);await p.evaluate(()=>{const e=S.enemies.find(e=>e.hp>0);hit(e,999);});await p.waitForTimeout(350);await p.screenshot({path:out+'/serie-4-tod.png',clip});
 await b.close();})();
