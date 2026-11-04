// M5: 20 Runs hintereinander mit gemeinsamem Meta-Speicher. Zeigt, nach wie vielen Runs was frei ist.
// node tools/test-meta.js [runs=20] [startSeed=1]
const {ladeKern}=require('./kern');
(async()=>{const n=+(process.argv[2]||20),s0=+(process.argv[3]||1);const K=ladeKern();await K.init();K.run('Meta.reset()');
 for(let i=0;i<n;i++){const job=K.run(`(()=>{const f=JOBS.filter(Meta.figurFrei);return f[${i}%f.length].id})()`);
  const r=K.run(`Bot.spiele(${JSON.stringify(job)},${s0+i},{meta:true})`);
  const v=K.run('JSON.stringify(Meta.get().verlauf.slice(-1)[0]||{})');const neu=JSON.parse(v).neu||[];
  console.log(`| ${i+1} | ${job} | ${r.sieg?'Sieg':'Strand'} | ${r.tiefe} | ${K.run('Meta.get().fragmente.length')} | ${neu.join(', ')||'–'} |${r.fehler?' FEHLER '+r.fehler.split('\n')[0]:''}`);}
 // Neuladen: Meta bleibt (localStorage), Reset leert
 const vor=K.run('Meta.get().fragmente.length');K.run('(()=>{const raw=localStorage.getItem("saltmoor.meta.v1");return raw})()');
 console.log(`\nFragmente gespeichert: ${vor}, nach Reset: ${K.run('(Meta.reset(),Meta.get().fragmente.length)')}`);})();
