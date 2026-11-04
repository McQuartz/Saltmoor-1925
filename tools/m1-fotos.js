// Auftrag 2, M1: Bildschirmfotos Kampf (Mehrfachtreffer in 3 Einzelbildern), Belohnung, Übergang, Endbildschirm
// node tools/m1-fotos.js <ordner>
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.';require('fs').mkdirSync(out,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const f=[];
 p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error')f.push(m.text());});
 await p.goto('http://localhost:8000/index.html?dev=0&job=fischer&seed=5&springe=kampf&akt=0');await p.waitForTimeout(1200);
 // Schmuggler mit „3 × 3“ als nächstem Zug
 await p.evaluate(()=>{S.enemies=[mkEnemy('schmuggler')];aufstellen(S.enemies);const e=S.enemies[0];e.pi=e.pat.findIndex(x=>x.h===3);S.block=0;render();});
 await p.waitForTimeout(900);await p.screenshot({path:out+'/kampf-vorher.png'});
 await p.evaluate(()=>endTurn());
 const W=await p.evaluate(()=>BAL.wucht);const t0=300+W.anlauf_gegner_ms;
 await p.waitForTimeout(t0+30);await p.screenshot({path:out+'/mehrfach-1.png'});
 await p.waitForTimeout(W.mehrfach_abstand_ms);await p.screenshot({path:out+'/mehrfach-2.png'});
 await p.waitForTimeout(W.mehrfach_abstand_ms);await p.screenshot({path:out+'/mehrfach-3.png'});
 await p.waitForTimeout(1500);
 // Belohnung
 await p.evaluate(()=>{S.enemies.forEach(e=>e.hp=0);checkVictory(50);});await p.waitForTimeout(900);await p.screenshot({path:out+'/belohnung.png'});
 // Übergang (wartet auf Klick)
 await p.evaluate(()=>{S.akt=1;S.route[1]=null;enterAct();if(S.phase==='biomwahl')chooseBiom(0);});await p.waitForTimeout(4500);await p.screenshot({path:out+'/uebergang-nach-4s.png'});
 // Endbildschirm nach Niederlage
 await p.evaluate(()=>{S.stats.kaempfe=7;S.stats.schadenRaus=412;S.stats.maxTreffer=31;S.stats.maxKette=4;S.depth=12;runLost();});await p.waitForTimeout(1200);await p.screenshot({path:out+'/endschirm.png'});
 console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
