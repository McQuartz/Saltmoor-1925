// Auftrag 3, M10: Fotos der Strand-Szene mit Fußspuren-Stufe 0 bis 4 (Das Spiel zählt mit)
// node tools/strand-fotos.js <ordner> [port]   (Server: cd prototype && python3 -m http.server <port>)
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.',port=process.argv[3]||'8000';require('fs').mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const p3=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:3});const f=[];
 for(const q of [p,p3]){q.on('pageerror',e=>f.push(String(e)));q.on('console',m=>{if(m.type()==='error')f.push(m.text());});}
 await p.goto(`http://localhost:${port}/index.html?dev=0`);await p3.goto(`http://localhost:${port}/index.html?dev=0`);await p.waitForTimeout(1500);
 for(let n=0;n<=4;n++){
  await p.evaluate(n=>{S.phase='figur';S.devSzene={spuren:n};BU.key='';render();document.getElementById('hud').style.display='none';},n);await p.waitForTimeout(1200);
  await p.screenshot({path:`${out}/strand-${n}.png`});
  // Szene ohne Oberfläche (#hud aus). Ausschnitt 427x240 Bildpunkte, mit Gerätefaktor 3 aufgenommen (1281x720)
  await p3.evaluate(n=>{S.phase='figur';S.devSzene={spuren:n};BU.key='';render();document.getElementById('hud').style.display='none';},n);await p3.waitForTimeout(1200);
  await p3.screenshot({path:`${out}/strand-${n}-zoom.png`,clip:{x:200,y:450,width:427,height:240}});
 }
 console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
