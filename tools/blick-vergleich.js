// Auftrag 3 M7: Bot-Vergleich für den Blick (06-lovecraft-kern.md Abschnitt 5 und 8).
// Gleiche Seeds, gleiche Figuren reihum, vier Läufe: Blick aus/an (Bots finden die Items selbst), und beides mit einem Blick-Item ab Kampf 1
// (Linse am Körper, damit die Wahl in jedem Kampf fällt). Gezählt: Siege, Tiefe, Züge je Kampf, wie oft hingesehen, Gesehene besiegt, Wächter mit Zusatzschritt.
// node tools/blick-vergleich.js [seeds=40] [startSeed=1]
const {ladeKern}=require('./kern');
(async()=>{const n=+(process.argv[2]||40),s0=+(process.argv[3]||1);const K=ladeKern();await K.init();
 K.run(`globalThis.__bl={ja:0,nein:0,ges:0,wz:0,schatten:0};Bus.on('blick',p=>{p.ja?__bl.ja++:__bl.nein++;});Bus.on('enemy_die',p=>{if(p.e&&p.e.gesehener)__bl.ges++;});Bus.on('blick_schatten',()=>__bl.schatten++);Bus.on('kniff',p=>{if(/^Hinsehen:/.test(p.why||''))__bl.wz++;});`);
 const lauf=(an,mitItem)=>JSON.parse(K.run(`(()=>{BAL.auftrag3.blick=${an};for(const k in __bl)__bl[k]=0;const jobs=JOBS.map(j=>j.id);const o=[];
  const nachStart=${mitItem}?()=>{const a=ITEMS.linse.a;S.slots[a]=Math.max(1,S.slots[a]);const frei=S.areas[a].findIndex((x,i)=>i<S.slots[a]&&!x);S.areas[a][frei<0?0:frei]=mk('linse');}:null;
  for(let i=0;i<${n};i++){const r=Bot.spiele(jobs[i%jobs.length],${s0}+i,nachStart?{nachStart}:{});o.push({sieg:r.sieg,tiefe:r.tiefe,zuege:r.zuege,kaempfe:r.kaempfe,fehler:r.fehler});}
  BAL.auftrag3.blick=true;return JSON.stringify({o,bl:{...__bl}});})()`));
 const zeilen=[['Blick aus',lauf(false,false)],['Blick an',lauf(true,false)],['Blick aus, Linse ab Start',lauf(false,true)],['Blick an, Linse ab Start',lauf(true,true)]];
 const p=v=>(Math.round(v*100)+' %').padStart(5);
 console.log('Lauf'.padEnd(28)+'Siege   Ø Tiefe  Züge/Kampf  hingesehen  nicht  Gesehene besiegt  Wächter+  Schatten  Fehler');
 const out=[];for(const [name,{o,bl}] of zeilen){const s=o.filter(x=>x.sieg).length/n,t=o.reduce((q,x)=>q+x.tiefe,0)/n,zk=o.reduce((q,x)=>q+x.zuege,0)/Math.max(1,o.reduce((q,x)=>q+x.kaempfe,0)),f=o.filter(x=>x.fehler);
  out.push({name,siege:s,tiefe:t,zk,...bl,fehler:f.length});
  console.log(`${name.padEnd(28)}${p(s)}   ${t.toFixed(1).padStart(6)}   ${zk.toFixed(2).padStart(9)}  ${String(bl.ja).padStart(10)}  ${String(bl.nein).padStart(5)}  ${String(bl.ges).padStart(16)}  ${String(bl.wz).padStart(8)}  ${String(bl.schatten).padStart(8)}  ${f.length}`);
  if(f.length)console.log('   '+f[0].fehler.split('\n').slice(0,3).join(' | '));}
 console.log(JSON.stringify(out));})();
