// Autospieler in Node (ohne Browser): node tools/bot.js [runs=20] [startSeed=1] [--meta]
const {ladeKern}=require('./kern');
(async()=>{const a=process.argv.slice(2);const n=+(a[0]||20),s0=+(a[1]||1),meta=a.includes('--meta');const K=ladeKern();await K.init();
 const jobs=K.get('JOBS').map(j=>j.id);const out=[];
 for(let i=0;i<n;i++){const seed=s0+i;const job=jobs[i%jobs.length];const r=K.run(`Bot.spiele(${JSON.stringify(job)},${seed},{meta:${meta}})`);out.push(r);
  console.log(`${String(seed).padStart(4)} ${job.padEnd(17)} ${r.sieg?'SIEG ('+r.ende+')':'Strand'} Tiefe ${r.tiefe} ${r.biom} Kämpfe ${r.kaempfe}${r.fehler?' FEHLER '+r.fehler.split('\n')[0]:''}`);
  if(r.fehler)console.log(r.fehler);}
 const siege=out.filter(r=>r.sieg).length;const tief=out.reduce((s,r)=>s+r.tiefe,0)/n;const tode={};out.filter(r=>!r.sieg).forEach(r=>{tode[r.biom]=(tode[r.biom]||0)+1;});
 console.log(`\nRuns ${n}, Siege ${siege} (${Math.round(siege/n*100)} %), Ø Tiefe ${tief.toFixed(1)}, Niederlagen je Biom ${JSON.stringify(tode)}, Fehler ${out.filter(r=>r.fehler).length}`);
 if(meta)console.log('Meta:',K.run('JSON.stringify(Meta.get())'));})();
