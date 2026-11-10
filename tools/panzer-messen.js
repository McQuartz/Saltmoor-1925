// Auftrag 3, Fix 7: Verlängert der Panzer den Wächterkampf um höchstens einen Zug?
// Ganze Runs des Autospielers mit festem Seed; der Akt mit dem Biom des Wächters liegt auf der Route, der Wächter ist erzwungen (S.devWaechter).
// Jeder Run läuft zweimal: mit Panzer (balance.json → panzer.anteil) und ohne Schutz (anteil 0). Gezählt werden die Züge dieses Wächterkampfs
// und die Panzer-Züge darin, nur wo beide Läufe den Kampf gewinnen.
// node tools/panzer-messen.js [seeds=20] [--anteil=0.25]  (--anteil probiert einen anderen Wert als balance.json)
const { ladeKern } = require('./kern');
(async () => {
  const K = ladeKern(); await K.init(); const n = +(process.argv.slice(2).find(x => !x.startsWith('--')) || 20);
  const ant = (process.argv.find(x => x.startsWith('--anteil=')) || '').split('=')[1]; if (ant) K.run(`BAL.panzer.anteil=${+ant}`);
  const r = JSON.parse(K.run(`(()=>{const boss=Object.keys(FOES).filter(id=>FOES[id].rang==='waechter'&&JSON.stringify(FOES[id]).includes('"unverw"'));const an0=BAL.panzer.anteil;const jobs=JOBS.map(j=>j.id);
   const M={id:null,ai:-1,an:false,zug:0,pz:0,fertig:null};
   Bus.on('turn_start',()=>{if(M.an)M.zug++;else if(M.fertig==null&&S.kampfArt==='waechter'&&S.akt===M.ai&&S.enemies.some(e=>e.id===M.id)){M.an=true;M.zug=1;}});
   Bus.on('panzer_an',()=>{if(M.an)M.pz++;});
   Bus.on('victory',()=>{if(M.an){M.fertig={zuege:M.zug,panzer:M.pz};M.an=false;}});
   const out={};
   for(const id of boss){M.id=id;M.ai=RUN.akte.findIndex(a=>a.biome.includes(FOES[id].biom));const paare=[];
    for(let i=0;i<${n};i++){const je={};for(const an of [an0,0]){BAL.panzer.anteil=an;Object.assign(M,{an:false,zug:0,pz:0,fertig:null});
      Bot.spiele(jobs[i%jobs.length],3100+i,{nachStart:()=>{S.route=RUN.akte.map((a,k)=>k===M.ai?FOES[id].biom:a.biome[0]);S.devWaechter=id;}});
      je[an?'mit':'ohne']=M.fertig;}
     if(je.mit&&je.ohne)paare.push(je);}
    const s=(k,f)=>+(paare.reduce((t,p)=>t+p[k][f],0)/Math.max(1,paare.length)).toFixed(2);
    out[id]={kaempfe:paare.length,mit:s('mit','zuege'),ohne:s('ohne','zuege'),panzer:s('mit','panzer')};}
   BAL.panzer.anteil=an0;return JSON.stringify(out);})()`));
  for (const [id, v] of Object.entries(r)) console.log(`${id.padEnd(20)} ${v.kaempfe} Kämpfe in beiden Läufen gewonnen · mit Panzer Ø ${v.mit} Züge, ohne Schutz Ø ${v.ohne} · Ø ${v.panzer} Panzer-Züge · Verlängerung je Panzer-Zug ${v.panzer ? ((v.mit - v.ohne) / v.panzer).toFixed(2) : '–'}`);
})();
