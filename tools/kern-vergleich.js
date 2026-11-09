// Auftrag 3 M5: Bot-Vergleich je Regelbiegung (06-lovecraft-kern.md Abschnitt 8).
// Je Biegung zwei Läufe auf denselben Seeds und demselben Weg (das Biom der Biegung ist in seinem Akt erzwungen):
// einmal alle Biegungen aus, einmal nur diese an (balance.json → auftrag3.biegung_nur). Generischer Autospieler, Figuren reihum.
// node tools/kern-vergleich.js [seeds=40] [startSeed=1] [biegung …]   Ausgabe: Tabelle und JSON in der letzten Zeile.
const {ladeKern}=require('./kern');
(async()=>{const a=process.argv.slice(2);const pos=a.filter(x=>!x.startsWith('--'));const n=+(pos[0]||40),s0=+(pos[1]||1),nur=pos.slice(2);
 const K=ladeKern();await K.init();
 K.run(`globalThis.__bz={};Bus.on('biegung',p=>{__bz[p.id]=(__bz[p.id]||0)+1;});Bus.on('reaction',p=>{if(/^Über Eck/.test(p.why||''))__bz.ueber_eck_rx=(__bz.ueber_eck_rx||0)+1;if(p.r&&p.r.biegung){const k='rx_'+p.r.n;__bz[k]=(__bz[k]||0)+1;}});`);
 const L=K.run(`BIEGUNGEN.map(b=>({id:b.id,biom:b.biom,n:b.n,akt:BIOMES[b.biom].akt}))`).filter(b=>!nur.length||nur.includes(b.id));
 const lauf=(b,an)=>JSON.parse(K.run(`(()=>{BAL.auftrag3.regelbiegung=${an};for(const k in __bz)delete __bz[k];BAL.auftrag3.biegung_nur=${an?JSON.stringify(b.id):'null'};
  const route=[];route[${b.akt}]=${JSON.stringify(b.biom)};const jobs=JOBS.map(j=>j.id);const o=[];let zuege=0,kaempfe=0;
  for(let i=0;i<${n};i++){const r=Bot.spiele(jobs[i%jobs.length],${s0}+i,{route});o.push({sieg:r.sieg,akt:r.akt,tiefe:r.tiefe,zuege:S.stats.zuege||0,kaempfe:S.stats.kaempfe||0,fehler:r.fehler});}
  BAL.auftrag3.regelbiegung=true;BAL.auftrag3.biegung_nur=null;return JSON.stringify({o,bz:{...__bz}});})()`));
 const zeilen=[];
 console.log('Biegung'.padEnd(30)+'Akt  aus: Siege  Tod im Akt   an: Siege  Tod im Akt   Δ Siege  Züge/Kampf aus→an  Fehler');
 for(const b of L){const A0=lauf(b,false),B0=lauf(b,true),A=A0.o,B=B0.o;
  const s=r=>r.filter(x=>x.sieg).length/n,t=r=>r.filter(x=>!x.sieg&&x.akt===b.akt).length/n,zk=r=>r.reduce((q,x)=>q+x.zuege,0)/Math.max(1,r.reduce((q,x)=>q+x.kaempfe,0));
  const z={id:b.id,biom:b.biom,akt:b.akt+1,aus:s(A),an:s(B),todAus:t(A),todAn:t(B),delta:s(B)-s(A),zkAus:zk(A),zkAn:zk(B),fehler:A.filter(x=>x.fehler).length+B.filter(x=>x.fehler).length,ausgeloest:B0.bz};zeilen.push(z);
  const p=v=>(Math.round(v*100)+' %').padStart(5);
  console.log(`${(b.n+' ('+b.biom+')').padEnd(30)}${String(['I','II','III','IV','V'][b.akt]).padEnd(5)}${p(z.aus)}       ${p(z.todAus)}       ${p(z.an)}      ${p(z.todAn)}    ${(z.delta>=0?'+':'')+Math.round(z.delta*100)} Pp    ${z.zkAus.toFixed(2)} → ${z.zkAn.toFixed(2)}     ${z.fehler}   ausgelöst ${JSON.stringify(z.ausgeloest)}`);
  const f=[...A,...B].find(x=>x.fehler);if(f)console.log('   '+f.fehler.split('\n').slice(0,3).join(' | '));}
 console.log(JSON.stringify(zeilen));})();
