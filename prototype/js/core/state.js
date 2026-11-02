// Spielzustand und kleine Helfer. Kein DOM, keine Grafik.
let uidc=0;const mk=id=>({uid:++uidc,id});
let S={phase:'start'};let busy=false;
const def=it=>ITEMS[it.id];
function act(a){return S.areas[a].slice(0,S.slots[a]).filter(Boolean);}
function allActive(){return AREAS.flatMap(act);}
function bases(it){const d=def(it);return d.bases||[it.id];}
function maxHp(){return BAL.start_hp+S.bonusHp+allActive().reduce((s,it)=>s+(def(it).hp||0),0);}
function roleState(){return ROLES.map(r=>{const have=r.i.filter(id=>allActive().some(it=>bases(it).includes(id)));return{r,have,on:have.length===r.i.length};});}
// aktive Rollen-Boni eines Typs (siehe data/roles.json)
function bonuses(type){return roleState().filter(x=>x.on&&x.r.bonus&&x.r.bonus.type===type).map(x=>x.r.bonus);}
function alive(){return S.enemies.filter(e=>e.hp>0);}
function log(s){S.log.unshift(s);S.log=S.log.slice(0,14);}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function pickN(list,n){const o=[];const l=[...list];while(o.length<n&&l.length){o.push(l.splice(Math.floor(Math.random()*l.length),1)[0]);}return o;}
function dropPool(){return Object.keys(ITEMS).filter(k=>!ITEMS[k].nodrop&&!ITEMS[k].bases&&!ITEMS[k].rare);}
function rarePool(){return Object.keys(ITEMS).filter(k=>ITEMS[k].rare&&!ITEMS[k].bases);}
function zoneOfDepth(d){return BAL.zones.find(z=>d<=z.until);}
function place(d){return zoneOfDepth(d).name;}
function zoneOf(d){return zoneOfDepth(d).id;}
function every(d,rule){return d%rule.every===rule.offset%rule.every;}
