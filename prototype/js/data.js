// Lädt alle Spieldaten aus data/*.json. Dieselben Dateien soll später die Godot-Version einlesen.
let ST,SUFFIX,AREAS,AREA_N,ITEMS,ROLES,FOES,JOBS,REACT,VERST,HOCH,EVENTS,BAL,RUN,BIOMES,FRAGS;
async function loadData(base='data/',fetchJson){
 const get=fetchJson||(async f=>{const r=await fetch(base+f+'.json',{cache:'no-store'});if(!r.ok)throw new Error(f+'.json: '+r.status);return r.json();});
 const opt=async f=>{try{return await get(f);}catch(e){return null;}};
 const[st,items,roles,foes,jobs,rx,ev,bal,run,biomes]=await Promise.all(['stoffe','items','roles','foes','jobs','reactions','events','balance','run','biomes'].map(get));
 const frags=await opt('fragmente');
 ST=st.stoffe;SUFFIX=st.suffix;AREAS=st.areas;AREA_N=st.area_names;ITEMS=items;ROLES=roles;FOES=foes;JOBS=jobs;
 REACT=rx.pairs;VERST=rx.same;HOCH=rx.triples;BAL=bal;RUN=run;BIOMES=biomes;delete BIOMES._doc;FRAGS=frags||[];
 // Ereignisse: id und biom ergänzen, falls alte Einträge sie nicht haben
 // Items, die ein Fragment freischaltet, sind erst danach im Fundpool (meta)
 FRAGS.forEach(f=>{if(f.schaltet&&f.schaltet.art==='item'&&ITEMS[f.schaltet.id])ITEMS[f.schaltet.id].meta=true;});
 EVENTS=ev.map((e,i)=>({id:e.id||('alt_'+i),biom:e.biom||'alle',...e}));
}
const chip=k=>`<span class="st" style="background:${ST[k].c}" title="${ST[k].n}">${ST[k].s}</span>`;
