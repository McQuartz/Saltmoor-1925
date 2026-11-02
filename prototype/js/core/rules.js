// Reaktionsregeln, Kartenkosten und der Effekt-Interpreter für data/reactions.json und data/events.json.
const pairKey=(a,b)=>[a,b].sort().join('');
function reactionsFor(prev,cur){const out=[];const add=r=>{if(!out.includes(r))out.push(r);};
 for(const a of prev)for(const b of cur){if(a===b)add(VERST);else{const r=REACT.find(r=>r.k===pairKey(a,b));if(r)add(r);}}
 for(let i=0;i<cur.length;i++)for(let j=i+1;j<cur.length;j++){const r=REACT.find(r=>r.k===pairKey(cur[i],cur[j]));if(r)add(r);}
 const u=new Set([...prev,...cur]);for(const h of HOCH){if([...h.s].every(x=>u.has(x))&&[...h.s].some(x=>cur.includes(x))&&!(S.hochUsed||new Set()).has(h.n))add(h);}
 return out;}
// Warum hat etwas reagiert? Für die Ketten-Anzeige.
function whyRx(r,prev,cur){
 if(r===VERST){const x=cur.find(y=>prev.includes(y));return{n:r.n,t:r.t,keys:[x,x],src:`${ST[x].n} zweimal hintereinander`,kind:'v'};}
 if(r.s){const ks=[...r.s];const fp=ks.filter(x=>prev.includes(x)&&!cur.includes(x)),fc=ks.filter(x=>cur.includes(x));return{n:r.n,t:r.t,keys:ks,src:fp.length?`${fp.map(x=>ST[x].n).join(' + ')} aus der Karte davor, ${fc.map(x=>ST[x].n).join(' + ')} aus dieser`:'alle drei Stoffe in dieser Karte',kind:'h'};}
 const[a,b]=[...r.k];const self=cur.includes(a)&&cur.includes(b);const pa=prev.includes(a)&&cur.includes(b)?[a,b]:[b,a];
 return{n:r.n,t:r.t,keys:self?[a,b]:pa,src:self?'beide Stoffe stecken in dieser Karte':`${ST[pa[0]].n} von der Karte davor trifft ${ST[pa[1]].n}`,kind:''};}
function cardCost(c){if(bonuses('stoff_free').some(b=>c.st.includes(b.stoff)))return 0;return c.c+(c.st.length>1?BAL.forge.double_cost_extra:0);}
function needsTarget(c){return !!((c.atk&&!c.all)||c.poison||c.burn);}
// Effekte aus den Daten ausführen. ctx.tg = aktuelles Ziel.
function runFx(list,ctx={}){for(const f of list||[]){const tg=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];const tos=f.to==='all'?alive():tg?[tg]:[];
 switch(f.op){
  case'damage':tos.forEach(e=>hit(e,f.v));break;
  case'status':tos.forEach(e=>{if(f.status==='weak')e.weak2=1;else e[f.status]+=f.v;Bus.emit('enemy_status',{e,status:f.status});});break;
  case'block':addBlock(f.v);break;
  case'ward':S.ward+=f.v;break;
  case'heal':healP(f.v);break;
  case'energy':S.energy+=f.v;break;
  case'break_block':tos.forEach(e=>{e.block=0;});break;
  case'poison_burst':tos.forEach(e=>{if(e.poison){const d=e.poison*f.mult;e.poison=0;hit(e,d);}});break;
  case'poison_mult':tos.forEach(e=>{e.poison*=f.mult;Bus.emit('enemy_status',{e,status:'poison'});});break;
  // Event-Effekte
  case'give_random':giveRandom();break;
  case'give_item':giveItem(f.item);break;
  case'add_slot':addSlot(f.area);break;
  case'max_hp':S.bonusHp+=f.v;S.hp=Math.min(S.hp,maxHp());break;
  case'lose_hp':S.hp=Math.max(1,S.hp-f.v);break;
  case'full_heal':S.hp=maxHp();break;
  default:console.warn('Unbekannter Effekt',f);}}}
function condOk(c){if(!c)return true;if(c.slot_below_max)return S.slots[c.slot_below_max]<BAL.max_slots;return true;}
