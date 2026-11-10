// Auftrag 3 M8: Bot-Vergleich aller vier Kern-Systeme (06-lovecraft-kern.md Abschnitt 8).
// Gleiche Seeds, Figuren reihum, generischer Autospieler: alle aus, je eines an, alle an.
// Systeme: regelbiegung (M5), hoeren (M6), blick (M7), farbe (M8). Ausgabe: Tabelle und JSON in der letzten Zeile.
// node tools/kern-alle.js [seeds=40] [startSeed=1]
const {ladeKern}=require('./kern');
(async()=>{const n=+(process.argv[2]||40),s0=+(process.argv[3]||1);const K=ladeKern();await K.init();
 const SYS=['regelbiegung','hoeren','blick','farbe'];
 K.run(`globalThis.__k={};Bus.on('blick',p=>{if(p.ja)__k.hin=(__k.hin||0)+1;});Bus.on('farbe',p=>{__k['farbe_'+p.art]=(__k['farbe_'+p.art]||0)+1;});Bus.on('biegung',()=>{__k.biegung=(__k.biegung||0)+1;});`);
 const lauf=an=>JSON.parse(K.run(`(()=>{const A=${JSON.stringify(an)};${JSON.stringify(SYS)}.forEach(k=>BAL.auftrag3[k]=A.includes(k));for(const k in __k)delete __k[k];const jobs=JOBS.map(j=>j.id);const o=[];
  for(let i=0;i<${n};i++){const r=Bot.spiele(jobs[i%jobs.length],${s0}+i,{});o.push({sieg:r.sieg,akt:r.akt,tiefe:r.tiefe,zuege:r.zuege,kaempfe:r.kaempfe,fehler:r.fehler});}
  ${JSON.stringify(SYS)}.forEach(k=>BAL.auftrag3[k]=true);return JSON.stringify({o,k:{...__k}});})()`));
 const laeufe=[['alle aus',[]],...SYS.map(s=>['nur '+s,[s]]),['alle an',SYS]];
 const p=v=>(Math.round(v*100)+' %').padStart(5);let basis=null;const out=[];
 console.log('Lauf'.padEnd(20)+'Siege   Δ zu aus   Ø Tiefe  Züge/Kampf  Tod je Akt (I–V)        Fehler  ausgelöst');
 for(const [name,an] of laeufe){const {o,k}=lauf(an);const s=o.filter(x=>x.sieg).length/n;if(basis==null)basis=s;
  const tod=[0,1,2,3,4].map(a=>o.filter(x=>!x.sieg&&x.akt===a).length);const zk=o.reduce((q,x)=>q+x.zuege,0)/Math.max(1,o.reduce((q,x)=>q+x.kaempfe,0));const f=o.filter(x=>x.fehler);
  out.push({name,an,siege:s,delta:s-basis,tiefe:o.reduce((q,x)=>q+x.tiefe,0)/n,zk,tod,fehler:f.length,k});
  console.log(`${name.padEnd(20)}${p(s)}   ${((s-basis>=0?'+':'')+Math.round((s-basis)*100)+' Pp').padStart(8)}   ${(o.reduce((q,x)=>q+x.tiefe,0)/n).toFixed(1).padStart(6)}   ${zk.toFixed(2).padStart(9)}  ${tod.join(' / ').padEnd(22)}  ${String(f.length).padStart(6)}  ${JSON.stringify(k)}`);
  if(f.length)console.log('   '+f[0].fehler.split('\n').slice(0,3).join(' | '));}
 console.log(JSON.stringify(out));})();
