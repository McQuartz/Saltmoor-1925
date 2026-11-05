// Reaktionsregeln, Kartenkosten und der Effekt-Interpreter für data/reactions.json und data/events.json.
const pairKey=(a,b)=>[a,b].sort().join('');
function reactionsFor(prev,cur){const out=[];const add=r=>{if(!out.includes(r))out.push(r);};
 for(const a of prev)for(const b of cur){if(a===b)add(VERST);else{const r=REACT.find(r=>r.k===pairKey(a,b));if(r)add(r);}}
 for(let i=0;i<cur.length;i++)for(let j=i+1;j<cur.length;j++){const r=REACT.find(r=>r.k===pairKey(cur[i],cur[j]));if(r)add(r);}
 const u=new Set([...prev,...cur]);for(const h of HOCH){if([...h.s].every(x=>u.has(x))&&[...h.s].some(x=>cur.includes(x))&&!(S.hochUsed||new Set()).has(h.n))add(h);}
 return out;}
// Warum hat etwas reagiert? Für Ketten-Anzeige und Dev-Modus.
function whyRx(r,prev,cur){
 if(r===VERST){const x=cur.find(y=>prev.includes(y));return{n:r.n,t:r.t,keys:[x,x],src:`${ST[x].n} zweimal hintereinander`,kind:'v'};}
 if(r.s){const ks=[...r.s];const fp=ks.filter(x=>prev.includes(x)&&!cur.includes(x)),fc=ks.filter(x=>cur.includes(x));return{n:r.n,t:r.t,keys:ks,src:fp.length?`${fp.map(x=>ST[x].n).join(' + ')} aus der Karte davor, ${fc.map(x=>ST[x].n).join(' + ')} aus dieser`:'alle drei Stoffe in dieser Karte',kind:'h'};}
 const[a,b]=[...r.k];const self=cur.includes(a)&&cur.includes(b);const pa=prev.includes(a)&&cur.includes(b)?[a,b]:[b,a];
 return{n:r.n,t:r.t,keys:self?[a,b]:pa,src:self?'beide Stoffe stecken in dieser Karte':`${ST[pa[0]].n} von der Karte davor trifft ${ST[pa[1]].n}`,kind:''};}
// Kosten einer Karte: Grundkosten + Aufpreis für zwei Stoffe, Boni, Pforten-Verzerrung (c.mod)
// Unspielbare Karten kosten 0, wenn sie über Bord gehen können (Ballaststein); Zoll: 0 Energie, solange das Gold reicht
function cardCost(c){
 if(typeof werfbar==='function'&&werfbar(c))return 0;
 if(c.unspielbar||c.frost)return 99;
 if(c.zoll&&(S.gold||0)>=c.zoll)return 0;
 if(c.opfer)return 0; // Opfer: zahlt Leben statt Energie
 if(c.x)return S.energy||0; // X: verbraucht alle Energie
 if(bonuses('stoff_free').some(b=>c.st.includes(b.stoff)))return 0;
 if(S.played===0&&S.turnNo===1&&!S.compassUsed&&passive('erste_karte_billiger').length)return 0;
 if(c.funke&&S.last&&reactionsFor(S.joker?[...S.last,...S.joker]:S.last,c.st).length)return 0; // Funke: umsonst, wenn sie eine Reaktion auslöst
 return Math.max(0,c.c+(c.st.length>1&&!c.hg?BAL.forge.double_cost_extra:0)+(c.mod||0)+(c.teuer||0));}
function needsTarget(c){return !!(c.ziel||(c.atk&&!c.all)||c.poison||c.burn||c.weak||c.strip||c.vuln);}
// Effekte aus den Daten ausführen. ctx.tg = aktuelles Ziel, ctx.why = Grund für den Dev-Modus.
function runFx(list,ctx={}){for(const f of list||[]){const tg=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];const tos=f.to==='all'?alive():tg?[tg]:[];const why=ctx.why||'';
 switch(f.op){
  case'damage':tos.forEach(e=>hit(e,f.v,1,null,why));break;
  case'status':tos.forEach(e=>{if(f.status==='weak')e.weak2=1;else e[f.status]+=f.v;Bus.emit('enemy_status',{e,status:f.status,v:f.v,why});});break;
  case'block':addBlock(f.v,why);break;
  case'ward':S.ward+=f.v;Bus.emit('ward',{v:f.v,why});break;
  case'heal':healP(f.v,why);break;
  case'energy':S.energy+=f.v;Bus.emit('energy',{v:f.v,why});break;
  case'break_block':tos.forEach(e=>{e.block=0;Bus.emit('enemy_status',{e,status:'block_weg',why});});break;
  case'poison_burst':tos.forEach(e=>{if(e.poison){const d=e.poison*f.mult;e.poison=0;hit(e,d,1,'V',why);}});break;
  case'poison_mult':tos.forEach(e=>{e.poison*=f.mult;Bus.emit('enemy_status',{e,status:'poison',why});});break;
  // Ereignis-Effekte (außerhalb des Kampfes)
  case'give_random':giveItem(rs('fund').pick(dropPool()),why);break;
  case'give_rare':{const p=rarePool();if(p.length)giveItem(rs('fund').pick(p),why);break;}
  case'give_item':if(ITEMS[f.item])giveItem(f.item,why);break;
  case'add_slot':addSlot(f.area);break;
  case'max_hp':S.bonusHp+=f.v;S.hp=Math.max(1,Math.min(S.hp+(f.v>0?f.v:0),maxHp()));Bus.emit('meta_hp',{v:f.v,why});break;
  case'lose_hp':S.hp=Math.max(1,S.hp-f.v);Bus.emit('self_damage',{v:f.v,why});break;
  case'full_heal':S.hp=maxHp();Bus.emit('player_heal',{v:0,why});break;
  case'gold':S.gold=Math.max(0,S.gold+f.v);Bus.emit('gold',{v:f.v,why});break;
  case'strike':S.pending=S.pending||[];S.pending.push('strike');break;
  case'transform':transformRandom(why);break;
  case'discover':{const all=[VERST,...REACT,...HOCH].filter(r=>!S.disc.has(r.n));if(all.length){const r=rs('fund').pick(all);S.disc.add(r.n);log(`Reaktion entdeckt: ${r.n}`);Bus.emit('discover',{r,why});}break;}
  case'fight':S.pending=S.pending||[];S.pending.push({fight:f.foes||null});break;
  // Auftrag 2: Deckbau-Folgen
  case'handgriff':{const id=f.id&&HANDGRIFFE[f.id]?f.id:rs('fund').pick(handgriffPool(f.rar||null));if(id){S.pending=S.pending||[];S.pending.push({hg:id});}break;}
  case'schleifen':case'kerbe':case'umritzen':S.pending=S.pending||[];S.pending.push({wahl:f.op});break;
  case'item_tausch':transformRandom(why);break;
  case'reliquie':{const p=reliquienPool();if(p.length)giveItem(rs('fund').pick(p),why);break;}
  // Zugabe 4: n Ballast-Karten (unspielbar, stofflos, verbraucht) in Ziehstapel (wohin: stapel), Hand oder Ablage; nur im Kampf
  case'ballast':ballastMischen(f.n||1,f.wohin||'stapel',f.karte,why);break;
  case'energie_dauer':S.energiePlus=(S.energiePlus||0)+(f.v||1);Bus.emit('energy',{v:f.v||1,why:why+': dauerhaft mehr Energie'});break;
  default:console.warn('Unbekannter Effekt',f);}}}
function condOk(c){if(!c)return true;if(c.item&&!besitz().some(b=>b.it.id===c.item))return false;if(c.job&&S.job!==c.job)return false;if(c.event_gesehen&&!(S.stats.events||[]).includes(c.event_gesehen))return false;if(c.slot_below_max&&!(S.slots[c.slot_below_max]<BAL.max_slots))return false;if(c.gold_min&&S.gold<c.gold_min)return false;if(c.hp_min&&S.hp<c.hp_min)return false;return true;}

// Deckgröße einer Startfigur (angelegte Items × Kopien + Start-Handgriffe), für Figurwahl und Artboard
function deckGroesse(ids,job){return ids.reduce((s,id)=>{const D=ITEMS[id];return D?s+D.cards.length*(BAL.card_copies||1):s;},0)+(job&&job.hg?Object.entries(job.hg).filter(([id])=>ids.includes(id)).reduce((s,[,l])=>s+l.length,0):0);}
