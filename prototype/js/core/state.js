// Spielzustand und kleine Helfer. Kein DOM, keine Grafik.
// S ist der ganze Run (serialisierbar, siehe run.js → speichern). Sichtdaten der Gegner liegen NICHT in S, sondern in der Bühne.
let uidc=0;const mk=id=>({uid:++uidc,id});
let S={phase:'titel'};let busy=false;
// FAST: Autospieler und Schadens-Vorschau, alles läuft ohne Wartezeiten synchron durch.
let FAST=false,DRY=false;
function wait(ms,f){if(FAST)f();else setTimeout(f,ms);}
const def=it=>ITEMS[it.id];
function act(a){return S.areas[a].slice(0,S.slots[a]).filter(Boolean);}
function allActive(){return AREAS.flatMap(act);}
function bases(it){const d=def(it);return d.bases||[it.id];}
function maxHp(){return BAL.start_hp+S.bonusHp+allActive().reduce((s,it)=>s+(def(it).hp||0),0);}
function roleState(){return ROLES.map(r=>{const have=r.i.filter(id=>allActive().some(it=>bases(it).includes(id)));return{r,have,on:have.length===r.i.length};});}
// aktive Rollen-Boni eines Typs (siehe data/roles.json)
function bonuses(type){return roleState().filter(x=>x.on&&x.r.bonus&&x.r.bonus.type===type).map(x=>x.r.bonus);}
// passive Talismane (items.json → passiv)
function passive(typ){return allActive().map(it=>def(it).passiv).filter(p=>p&&p.typ===typ);}
function alive(){return S.enemies.filter(e=>e.hp>0);}
function log(s){S.log.unshift(s);S.log=S.log.slice(0,14);}
function biom(){return BIOMES[S.route?S.route[S.akt]:'hafen'];}
function biomId(){return S.route?S.route[S.akt]:'hafen';}
function itemOk(id){return !!ITEMS[id];}
// Fundpool des aktuellen Bioms plus runübergreifend freigeschaltete Items
function dropPool(){const b=biom();const extra=(S.metaItems||[]).filter(itemOk);let pool=[...(b.fundpool||[]),...extra].filter(id=>itemOk(id)&&!ITEMS[id].nodrop&&!ITEMS[id].bases&&!ITEMS[id].rare);
 if(!pool.length)pool=Object.keys(ITEMS).filter(k=>!ITEMS[k].nodrop&&!ITEMS[k].bases&&!ITEMS[k].rare&&!ITEMS[k].meta);return[...new Set(pool)];}
function rarePool(){return Object.keys(ITEMS).filter(k=>ITEMS[k].rare&&!ITEMS[k].bases&&!ITEMS[k].nodrop&&(!ITEMS[k].meta||(S.metaItems||[]).includes(k)));}
const romanN=n=>{const r=[['X',10],['IX',9],['V',5],['IV',4],['I',1]];let s='';for(const[k,v]of r)while(n>=v){s+=k;n-=v;}return s;};
function jobFaehigkeit(){const j=JOBS.find(x=>x.id===S.job);return j&&j.faehigkeit||null;}
