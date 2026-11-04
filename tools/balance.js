// Balance-Lauf (M9): node tools/balance.js [runs=50] [startSeed=1] [--alt-m7]
// --set='BAL.start_hp=60' : Werte nur für diesen Lauf ändern (mehrfach möglich)
// --alt-m7: Gegner aus data/foes_m7.json mit der Biom-Zuordnung daraus (bis sie foes.json ersetzt)
// Gibt Gewinnrate, Ø Tiefe, Niederlagen je Biom, Ø Züge je Kampf und die tödlichsten Gegner aus.
const {ladeKern}=require('./kern');const fs=require('fs'),path=require('path');
(async()=>{const a=process.argv.slice(2);const pos=a.filter(x=>!x.startsWith('--'));const n=+(pos[0]||50),s0=+(pos[1]||1);const K=ladeKern();await K.init();
 if(a.includes('--alt-m7')){const f=JSON.parse(fs.readFileSync(path.join(__dirname,'../prototype/data/foes_m7.json'),'utf8'));
  K.run(`FOES=${JSON.stringify(f)};for(const b in BIOMES){const ids=Object.keys(FOES).filter(k=>FOES[k].biom===b);BIOMES[b].gegner=ids.filter(k=>FOES[k].rang==='normal');const w=ids.find(k=>FOES[k].rang!=='normal');if(w)BIOMES[b].waechter=w;}`);}
 for(const x of a.filter(x=>x.startsWith('--set=')))K.run(x.slice(6));
 const r=K.run(`(()=>{const out=[];let zuege=0,kaempfe=0;const killer={};
  Bus.on('turn_start',p=>{zuege++;});Bus.on('fight_start',()=>{kaempfe++;});
  const jobs=JOBS.map(j=>j.id);
  for(let i=0;i<${n};i++){const r=Bot.spiele(jobs[i%jobs.length],${s0}+i,{});out.push(r);if(!r.sieg)(r.gegner||[]).forEach(g=>killer[g]=(killer[g]||0)+1);}
  return{out,zuege,kaempfe,killer};})()`);
 const out=r.out;const siege=out.filter(x=>x.sieg).length;const tode={};out.filter(x=>!x.sieg).forEach(x=>{tode[x.biom]=(tode[x.biom]||0)+1;});
 const jobs={};out.forEach(x=>{jobs[x.job]=jobs[x.job]||[0,0];jobs[x.job][0]++;if(x.sieg)jobs[x.job][1]++;});
 console.log(`Runs ${n} · Siege ${siege} (${Math.round(siege/n*100)} %) · Ø Tiefe ${(out.reduce((s,x)=>s+x.tiefe,0)/n).toFixed(1)} · Ø Züge je Kampf ${(r.zuege/r.kaempfe).toFixed(1)} · Fehler ${out.filter(x=>x.fehler).length}`);
 const nl=n-siege;console.log('Niederlagen je Biom: '+Object.entries(tode).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v} (${Math.round(v/Math.max(1,nl)*100)} %)`).join(', '));
 console.log('Je Figur (Runs/Siege): '+Object.entries(jobs).map(([k,v])=>`${k} ${v[0]}/${v[1]}`).join(', '));
 console.log('Am Leben beim Tod: '+Object.entries(r.killer).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>`${k} ${v}`).join(', '));
 const f=out.find(x=>x.fehler);if(f)console.log(f.fehler);})();
