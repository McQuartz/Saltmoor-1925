// Auftrag 2, M4/M8: Build-Bots. Je Archetyp ein Autospieler, der dessen Items, Handgriffe und Stoffe bevorzugt.
// Profile aus prototype/data/builds.json (erzeugt aus docs/auftrag-2/builds.md). node tools/build-bots.js [seeds=20] [startSeed=1] [build]
const {ladeKern}=require('./kern');const fs=require('fs'),path=require('path');
(async()=>{const a=process.argv.slice(2);const n=+(a[0]||20),s0=+(a[1]||1),nur=a[2];const K=ladeKern();await K.init();
 const P=JSON.parse(fs.readFileSync(path.join(__dirname,'../prototype/data/builds.json'),'utf8')).builds;
 const zeilen=[];
 for(const [id,p] of Object.entries(P)){if(nur&&nur!==id)continue;const jobs=p.figuren&&p.figuren.length?p.figuren:K.get('JOBS').slice(0,6).map(j=>j.id);
  const r=JSON.parse(K.run(`(()=>{const o=[];for(let i=0;i<${n};i++){const x=Bot.spiele(${JSON.stringify(jobs)}[i%${jobs.length}],${s0}+i,{profil:${JSON.stringify({...p,build:id})}});o.push({sieg:x.sieg,tiefe:x.tiefe,akt:x.akt,biom:x.biom,deck:deckListe().length,build:buildArchetyp().id,rx:(S.stats.reaktionen||0)/Math.max(1,S.stats.zuege||1),fehler:x.fehler});}return JSON.stringify(o)})()`));
  const s=r.filter(x=>x.sieg).length,f=r.filter(x=>x.fehler).length;const akte=[0,0,0,0,0];r.filter(x=>!x.sieg).forEach(x=>akte[x.akt]++);
  const z={build:id,siege:s,rate:s/n,deck:r.reduce((t,x)=>t+x.deck,0)/n,rx:r.reduce((t,x)=>t+x.rx,0)/n,erkannt:r.filter(x=>x.build===id).length/n,akte,fehler:f,tiefe:r.reduce((t,x)=>t+x.tiefe,0)/n};zeilen.push(z);
  console.log(`${id.padEnd(12)} Siege ${String(s).padStart(2)}/${n} (${Math.round(s/n*100)} %) · Ø Tiefe ${z.tiefe.toFixed(1)} · Ø Deck ${z.deck.toFixed(1)} · Reaktionen/Zug ${z.rx.toFixed(2)} · als Build erkannt ${Math.round(z.erkannt*100)} % · Niederlagen je Akt ${akte.join('/')} · Fehler ${f}`);
  const fe=r.find(x=>x.fehler);if(fe)console.log('   '+fe.fehler.split('\n')[0]);}
 console.log(JSON.stringify(zeilen));})();
