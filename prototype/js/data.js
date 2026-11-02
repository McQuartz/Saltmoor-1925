// Lädt alle Spieldaten aus data/*.json. Dieselben Dateien soll später die Godot-Version einlesen.
let ST,SUFFIX,AREAS,AREA_N,ITEMS,ROLES,FOES,JOBS,REACT,VERST,HOCH,EVENTS,BAL;
async function loadData(base='data/'){
 const get=async f=>{const r=await fetch(base+f+'.json',{cache:'no-store'});if(!r.ok)throw new Error(f+'.json: '+r.status);return r.json();};
 const[st,items,roles,foes,jobs,rx,ev,bal]=await Promise.all(['stoffe','items','roles','foes','jobs','reactions','events','balance'].map(get));
 ST=st.stoffe;SUFFIX=st.suffix;AREAS=st.areas;AREA_N=st.area_names;ITEMS=items;ROLES=roles;FOES=foes;JOBS=jobs;
 REACT=rx.pairs;VERST=rx.same;HOCH=rx.triples;EVENTS=ev;BAL=bal;
}
const chip=k=>`<span class="st" style="background:${ST[k].c}" title="${ST[k].n}">${ST[k].s}</span>`;
