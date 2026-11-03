// Kampf-Bildschirmfoto mit Vorschau: node tools/kampf-foto.js <aus.png> [job] [seed] [akt] [art]
const {chromium}=require('playwright');
(async()=>{
 const[,,aus,job='pfarrerin',seed=11,akt=1,art='kampf_schwer']=process.argv;
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const f=[];
 p.on('pageerror',e=>f.push(String(e)));
 await p.goto('http://localhost:8000/index.html?dev=0&job='+job+'&seed='+seed+'&springe='+art+'&akt='+akt);
 await p.waitForTimeout(900);
 await p.evaluate(()=>{S.dev=true;S.enemies[0].weak2=1;S.enemies[0].burn=2;if(S.enemies[1]){S.enemies[1].block=6;S.enemies[1].poison=3;}
  playCard(S.hand.findIndex(c=>cardCost(c)<=1));render();});
 await p.waitForTimeout(1200);
 const n=await p.$$('[data-card]');if(n.length)await n[0].hover();
 await p.waitForTimeout(400);await p.screenshot({path:aus});
 if(f.length)console.log(f.join('\n'));await b.close();})();
