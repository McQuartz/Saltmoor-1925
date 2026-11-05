// Lädt alle Spieldaten aus data/*.json. Dieselben Dateien soll später die Godot-Version einlesen.
let HANDGRIFFE={},PAKETE=[],ICONS=new Set(),HG_ICONS=new Set(),ST,SUFFIX,AREAS,AREA_N,ITEMS,ROLES,FOES,JOBS,REACT,VERST,HOCH,EVENTS,BAL,RUN,BIOMES,FRAGS;
async function loadData(base='data/',fetchJson){
 const get=fetchJson||(async f=>{const r=await fetch(base+f+'.json',{cache:'no-store'});if(!r.ok)throw new Error(f+'.json: '+r.status);return r.json();});
 const opt=async f=>{try{return await get(f);}catch(e){return null;}};
 const[st,items,roles,foes,jobs,rx,ev,bal,run,biomes]=await Promise.all(['stoffe','items','roles','foes','jobs','reactions','events','balance','run','biomes'].map(get));
 const frags=await opt('fragmente');
 const hg=await opt('handgriffe');
 // Neue Icons (M5): assets/items/index.json und assets/handgriffe/index.json = Listen vorhandener IDs
 const ii=await (async()=>{try{const r=await fetch('assets/items/index.json',{cache:'no-store'});return r.ok?r.json():null;}catch(e){return null;}})();const hi=await (async()=>{try{const r=await fetch('assets/handgriffe/index.json',{cache:'no-store'});return r.ok?r.json():null;}catch(e){return null;}})();
 ICONS=new Set((ii&&(ii.items||ii.ids||ii))||[]);HG_ICONS=new Set((hi&&(hi.handgriffe||hi.ids||hi))||[]);
 // Biom-Pakete (data/biome/index.json → data/biome/<id>.json): Biom, Gegner, Ereignisse, Items, Handgriffe, Musik, Skripte
 const idx=await opt('biome/index');const packs=[];for(const id of (idx&&idx.pakete)||[]){const p=await opt('biome/'+id);if(p)packs.push(p);}
 ST=st.stoffe;SUFFIX=st.suffix;AREAS=st.areas;AREA_N=st.area_names;ITEMS=items;ROLES=roles;FOES=foes;JOBS=jobs;
 REACT=rx.pairs;VERST=rx.same;HOCH=rx.triples;BAL=bal;RUN=run;BIOMES=biomes;delete BIOMES._doc;FRAGS=frags||[];
 // Ereignisse: id und biom ergänzen, falls alte Einträge sie nicht haben
 // Items, die ein Fragment freischaltet, sind erst danach im Fundpool (meta)
 FRAGS.forEach(f=>{if(f.schaltet&&f.schaltet.art==='item'&&ITEMS[f.schaltet.id])ITEMS[f.schaltet.id].meta=true;});
 HANDGRIFFE=(hg&&hg.handgriffe)||{};PAKETE=packs;let evAll=ev;
 for(const p of packs){
  // Ergänzung eines vorhandenen Bioms (Auftrag 2, M6/M7): {"id":"hafen_plus","ergaenzt":"hafen","gegner_dazu":[…],"gegner_weg":[…],"fundpool_dazu":[…],foes,events,items}
  if(p.ergaenzt){const b=BIOMES[p.ergaenzt];if(!b)continue;const weg=new Set(p.gegner_weg||[]);b.gegner=(b.gegner||[]).filter(g=>!weg.has(g)).concat((p.gegner_dazu||[]).filter(g=>!(b.gegner||[]).includes(g)));
   if(p.fundpool_dazu)b.fundpool=[...new Set((b.fundpool||[]).concat(p.fundpool_dazu))];
   if(p.waechter_dazu)b.waechter_alt=[...new Set((b.waechter_alt||[]).concat(p.waechter_dazu))];
   Object.assign(FOES,p.foes||{});Object.assign(ITEMS,p.items||{});Object.assign(HANDGRIFFE,p.handgriffe||{});evAll=evAll.concat((p.events||[]).map(e=>({biom:p.ergaenzt,...e})));continue;}
  BIOMES[p.id]={...p.biom,akt:p.akt};Object.assign(FOES,p.foes||{});Object.assign(ITEMS,p.items||{});Object.assign(HANDGRIFFE,p.handgriffe||{});evAll=evAll.concat((p.events||[]).map(e=>({biom:p.id,...e})));}
 EVENTS=evAll.map((e,i)=>({id:e.id||('alt_'+i),biom:e.biom||'alle',...e}));
}
const chip=k=>`<span class="st" style="background:${ST[k].c}" title="${ST[k].n}">${ST[k].s}</span>`;
// Bild eines Items: neues 48er-Icon (assets/items/<id>.png), sonst das alte 12×12-Sprite. Verschmolzene Items nehmen das Bild ihres ersten Teils.
function itemBild(id){const D=ITEMS[id];if(!D)return'';const basis=ICONS.has(id)?id:(D.bases||[]).find(b=>ICONS.has(b));if(basis)return 'assets/items/'+basis+'.png';return typeof spr==='function'?spr(D.spr):'';}
function hgBild(id){return HG_ICONS.has(id)?'assets/handgriffe/'+id+'.png':null;}
