// Auftrag 3 M5: Fotos jeder Regelbiegung im Kampf (Kopfleiste, Stoff-Baum, Stapel, Plakette), auf der Peilkarte und auf der Biom-Wahl.
// Braucht den Server auf Port 8000 (prototype/). node tools/m5-biegung-fotos.js [ordner=docs/auftrag-3/bilder/M5] [biegung …] [--aufloesungen]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const a=process.argv.slice(2);const pos=a.filter(x=>!x.startsWith('--'));const out=pos[0]||'docs/auftrag-3/bilder/M5';const nur=pos.slice(1);fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const f=[];
 const neu=async(w=1440,h=900)=>{const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error')f.push(m.text());});
  await p.goto('http://localhost:8000/index.html?dev=0&job=fischer&seed=8');await p.waitForTimeout(1200);return p;};
 const p=await neu();
 const ids=await p.evaluate(()=>BIEGUNGEN.map(b=>b.id));
 // Je Biegung ein Zug, der sie sichtbar macht: Stoffe der Handkarten und wie viele davon gespielt werden
 const SZ={alte_stoffe:{st:[['S'],['W'],['B'],['E']],spiel:1},ueber_eck:{st:[['E'],['W'],['B'],['F'],['L']],spiel:3},rueckwaerts:{st:[['F'],['W'],['B'],['E'],['L']],spiel:2,zug:true},
  gezeiten:{st:[['F'],['W'],['B'],['E'],['L']],spiel:1,zug:true},ringofen:{st:[['F'],['E'],['B'],['W'],['L']],spiel:2,zug:true},keiner_faehrt:{st:[['F'],['E'],['B'],['W'],['L']],spiel:2},
  falsche_winkel:{st:[['F'],['W'],['E'],['B'],['L']],spiel:2},schlag:{st:[['F'],['W'],['S'],['B'],['L']],spiel:2},spiegelbild:{st:[['F'],['W'],['B'],['E'],['L']],spiel:0},
  rueckseite:{st:[['F'],['W'],['B'],['E'],['L']],spiel:0},funkspruch:{st:[['F'],['W'],['B'],['E'],['L']],spiel:3,gleich:true},ausser_zeit:{st:[['F'],['W'],['B'],['E'],['L']],spiel:1},
  wellen_oben:{st:[['F'],['W'],['B'],['E'],['L']],spiel:2},aufgewogen:{st:[['F'],['W'],['B'],['E'],['L']],spiel:1}};
 for(const id of ids){if(nur.length&&!nur.includes(id))continue;const sz=SZ[id]||{st:[['F'],['W']],spiel:0};
  await p.evaluate(([id,sz])=>{const B=Bieg.def(id);const akt=BIOMES[B.biom].akt;newRun('fischer',8,{dev:true});S.route=[];S.route[akt]=B.biom;S.akt=akt;S.depth=3+akt*6;
   for(let i=0;i<akt;i++)S.route[i]=RUN.akte[i].biome[0];
   BU.key='';startFight(BIOMES[B.biom].gegner.slice(0,2),'kampf');S.enemies.forEach(e=>{e.hp=e.max=Math.max(e.max,60);});
   const deck=deckListe();const mk=(st,k)=>({...deck[k%deck.length],st,cid:'foto'+k,c:sz.gleich?1:(deck[k%deck.length].c||1)});
   S.hand=sz.st.map(mk);S.draw=deck.slice(0,8).map((c,k)=>({...c,cid:'fd'+k}));S.discard=[];S.energy=6;
   if(sz.zug){FAST=true;playCard(0,0);playCard(0,0);S.enemies.forEach(e=>{e.pat=[{t:'blk',v:3}];});endTurn();FAST=false;S.hand=sz.st.map(mk).slice(0,S.hand.length||5);S.energy=6;}
   for(let i=0;i<sz.spiel;i++){FAST=true;playCard(0,0);FAST=false;}
   if(id==='ausser_zeit'){/* zeigt Biegung dieses und des nächsten Zuges */}
   render();},[id,sz]);
  await p.waitForTimeout(500);
  if(id==='spiegelbild'){const el=await p.$('.voraus.spiegel');if(el){await el.click();await p.waitForTimeout(200);}}
  // Tooltip der Biegung in der Kopfleiste
  const kb=await p.$('#kopf .kopfbieg');if(kb){const bb=await kb.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(250);}
  await p.screenshot({path:`${out}/kampf-${id}-1440x900.png`});await p.mouse.move(1,1);
  // Peilkarte des Akts
  await p.evaluate(()=>{S.phase='weg';genWeg();render();});await p.waitForTimeout(500);await p.screenshot({path:`${out}/karte-${id}-1440x900.png`});}
 // Biom-Wahl: alle Angebote der Akte III bis V (je zwei Biome nebeneinander, mit Biegung)
 for(const akt of [2,3,4]){await p.evaluate(akt=>{newRun('fischer',8+akt,{dev:true});for(let i=0;i<akt;i++)S.route[i]=RUN.akte[i].biome[0];S.akt=akt;S.route.length=akt;enterAct();if(S.phase!=='biomwahl'){S.angebote[akt]=RUN.akte[akt].biome.slice(0,2);S.phase='biomwahl';}render();},akt);
  await p.waitForTimeout(600);await p.screenshot({path:`${out}/biomwahl-akt${akt+1}-1440x900.png`});}
 if(a.includes('--aufloesungen'))for(const [w,h] of [[1280,720],[1920,1080]]){const q=await neu(w,h);await q.evaluate(()=>{newRun('fischer',8,{dev:true});S.route=[];S.route[2]='stadt';S.akt=2;S.depth=15;S.route[0]='hafen';S.route[1]='kapelle';startFight(BIOMES.stadt.gegner.slice(0,2),'kampf');
   const deck=deckListe();S.hand=[['E'],['W'],['B'],['F'],['L']].map((st,k)=>({...deck[k],st,cid:'a'+k}));S.energy=6;FAST=true;playCard(0,0);playCard(0,0);playCard(0,0);FAST=false;render();});
  await q.waitForTimeout(500);await q.screenshot({path:`${out}/kampf-ueber_eck-${w}x${h}.png`});await q.close();}
 console.log(f.length?[...new Set(f)].join('\n'):'Keine Konsolenfehler.');await b.close();})();
