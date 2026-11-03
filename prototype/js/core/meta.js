// Runübergreifender Fortschritt (Meta), gespeichert in localStorage 'saltmoor.meta.v1'.
// Konzept: docs/auftrag/progression.md. Gelesene Fragmente bleiben, schalten Figuren und Items frei; Tagebuch-Statistik.
const Meta=(()=>{const KEY='saltmoor.meta.v1';
 const leer=()=>({v:1,fragmente:[],items:[],figuren:[],runs:0,siege:0,enden:{bleiben:0,umkehren:0},besteTiefe:0,biome:[],stufe:0,maxStufe:0,neuSeit:[],tode:{}});
 let M=null;
 function load(){if(M)return M;try{M=JSON.parse(localStorage.getItem(KEY))||leer();}catch(e){M=leer();}M={...leer(),...M};return M;}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(M));}catch(e){}}
 // Figur frei? frei_ab = Zahl gelesener Fragmente
 function figurFrei(job){load();return job.frei_ab<=M.fragmente.length||M.figuren.includes(job.id);}
 // Ein Fragment lesen. Gibt neu Freigeschaltetes zurück: [{art,id,n}]
 function lies(id){load();if(M.fragmente.includes(id))return[];const vorher=JOBS.filter(figurFrei).map(j=>j.id);M.fragmente.push(id);const neu=[];
  const fr=FRAGS.find(f=>f.id===id);if(fr&&fr.schaltet&&fr.schaltet.art==='item'&&ITEMS[fr.schaltet.id]&&!M.items.includes(fr.schaltet.id)){M.items.push(fr.schaltet.id);neu.push({art:'item',id:fr.schaltet.id,n:ITEMS[fr.schaltet.id].n});}
  JOBS.filter(figurFrei).forEach(j=>{if(!vorher.includes(j.id)){neu.push({art:'figur',id:j.id,n:j.n});}});
  M.neuSeit.push(...neu);save();if(neu.length&&typeof Bus!=='undefined')Bus.emit('unlock',{neu,why:`Fragment ${id}: ${neu.map(x=>x.n).join(', ')} freigeschaltet (${M.fragmente.length} Fragmente gelesen)`});return neu;}
 function runEnde(res,S){load();M.runs++;M.besteTiefe=Math.max(M.besteTiefe,res.tiefe);(S.route||[]).slice(0,res.akt+1).forEach(b=>{if(!M.biome.includes(b))M.biome.push(b);});
  const neu=[];if(res.sieg){M.siege++;M.enden[res.ende]=(M.enden[res.ende]||0)+1;if(M.stufe>=M.maxStufe&&M.maxStufe<5){M.maxStufe++;neu.push({art:'stufe',id:M.maxStufe,n:'Schwierigkeit '+romanN(M.maxStufe+1)});}}
  else{const k=res.biom;M.tode[k]=(M.tode[k]||0)+1;}
  const seit=M.neuSeit;M.neuSeit=[];save();return[...seit,...neu];}
 return{load,save,figurFrei,lies,runEnde,
  read:()=>load().fragmente,items:()=>load().items,get:()=>load(),
  reset(){M=leer();save();},
  allesFrei(){load();M.fragmente=FRAGS.map(f=>f.id);M.items=FRAGS.filter(f=>f.schaltet&&f.schaltet.art==='item').map(f=>f.schaltet.id);M.figuren=JOBS.map(j=>j.id);M.maxStufe=5;save();}};})();
