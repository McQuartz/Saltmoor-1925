// Ablauf eines Runs: Strand → Figurwahl → fünf feste Akte (Anzahl und Reihenfolge nie ändern) → Ankunft.
// Jeder Akt hat Ebenen (data/run.json). Nach jedem Knoten wählt man den nächsten Weg. Verlieren → Strand.
// Alles Zufällige hängt am Seed (js/core/rng.js). Gespeichert wird nach jedem Knoten (localStorage).
const SAVE_KEY='saltmoor.run.v1';

// --- Weg durch die Welt: welcher Einstieg, welche Tiefe ---
function routeFor(seed,job){const r=Rng.of(seed,'route');const route=[];const why=[];
 RUN.akte.forEach((a,i)=>{if(a.biome.length===1){route.push(a.biome[0]);return;}
  if(a.wahl==='figur'){const lieb=job.vorliebe,anders=a.biome.find(b=>b!==lieb);const roll=r.next();const b=roll<a.vorliebe?lieb:anders;route.push(b);why.push(`Einstieg ${BIOMES[b].kurz}: Vorliebe ${job.n} → ${BIOMES[lieb].kurz} mit ${Math.round(a.vorliebe*100)} %, Wurf ${roll.toFixed(2)}`);}
  else{const roll=r.next();const b=a.biome[roll<.5?0:1];route.push(b);why.push(`Akt ${i+1}: ${BIOMES[b].kurz} (Seed, Wurf ${roll.toFixed(2)})`);}});
 return{route,why};}

function newRun(jobId,seed,opt={}){
 const job=JOBS.find(j=>j.id===jobId)||JOBS[0];uidc=0;seed=seed>>>0;
 const{route,why}=opt.route?{route:opt.route,why:['Gabelung im Dev-Modus erzwungen']}:routeFor(seed,job);
 S={phase:'uebergang',seed,job:job.id,jobN:job.n,route,routeWhy:why,akt:0,ebene:0,depth:0,
  hp:0,bonusHp:0,gold:0,energy:BAL.energy_per_turn,block:0,ward:0,
  slots:{waffe:BAL.start_slots,kleidung:BAL.start_slots,talisman:BAL.start_slots},
  areas:{waffe:[null,null,null,null],kleidung:[null,null,null,null],talisman:[null,null,null,null]},bag:Array(BAL.bag_size).fill(null),bench:[null,null],
  enemies:[],disc:new Set(),sel:null,log:[],custom:{},rs:{},weg:null,cur:null,pending:[],dev:!!opt.dev,
  stats:{kaempfe:0,fragmente:[],gold:0},metaItems:(typeof Meta!=='undefined'?Meta.items():[]),startT:Date.now(),
  draw:[],hand:[],discard:[],exhaust:[],last:[],played:0,hochUsed:new Set(),target:0,chainLog:[]};
 job.w.forEach((id,i)=>S.areas.waffe[i]=mk(id));job.k.forEach((id,i)=>S.areas.kleidung[i]=mk(id));job.t.forEach((id,i)=>S.areas.talisman[i]=mk(id));(job.bag||[]).forEach((id,i)=>S.bag[i]=mk(id));
 S.stufe=opt.stufe||0;S.start=opt.start||null;
 S.hp=maxHp();
 const sv=(RUN.startvarianten||[]).find(v=>v.id===S.start);if(sv)runFx(sv.fx,{why:'Startvariante '+sv.n});
 const sr=Rng.of(seed,'schreck');const J=BAL.jumpscare;S.scareAt=(J.fenster_min[0]+sr.next()*(J.fenster_min[1]-J.fenster_min[0]))*60000;S.scares=0;
 log(job.ausrede);
 Bus.emit('run_start',{seed,job:job.id,route,why:`Seed ${seed}, Weg ${route.map(b=>BIOMES[b].kurz).join(' → ')}. ${why.join('; ')}`});
 enterAct();}

// --- Akte und Ebenen ---
function aktDef(){return RUN.akte[S.akt];}
function enterAct(){S.phase='uebergang';S.ebene=0;Bus.emit('act_start',{akt:S.akt,biom:biomId(),why:`${aktDef().n}: ${biom().n}`});Bus.emit('changed');}
function leaveUebergang(){genWeg();}
function ebeneKey(){return aktDef().ebenen[S.ebene];}
// Wege für die nächste Ebene nach den Regeln aus run.json
function genWeg(){const key=ebeneKey(),E=RUN.ebenen[key];const r=R(`weg:${S.akt}:${S.ebene}`);let arten;
 if(E.fest)arten=[E.fest];
 else if(E.fest_wahl)arten=[...E.fest_wahl];
 else{const n=r.int(E.wege[0],E.wege[1]);
  for(let tries=0;tries<50;tries++){arten=E.verschiedene?r.sample([...new Set(E.pool)],n):r.sample(E.pool,n);
   if(E.mindestens&&Object.entries(E.mindestens).some(([k,v])=>arten.filter(a=>a===k).length<v))continue;
   if(E.verschiedene&&new Set(arten).size<E.verschiedene)continue;
   if(E.einer_von&&!arten.some(a=>E.einer_von.includes(a)))continue;break;}}
 const b=biom();const used={};
 S.weg=arten.map((art,i)=>{const hs=(b.weg_hinweise&&b.weg_hinweise[art==='kampf_schwer'?'kampf':art])||[RUN.knoten[art].n];used[art]=(used[art]||0);const hint=hs[(r.int(0,hs.length-1)+used[art]++)%hs.length];
  const o={art,hint,i};if(art==='kampf'||art==='kampf_schwer')o.foes=rollFoes(art,r);if(art==='waechter')o.foes=[b.waechter];if(art==='finale')o.foes=[b.waechter];return o;});
 S.phase='weg';
 Bus.emit('weg',{optionen:S.weg.map(o=>o.art),why:`Ebene ${S.ebene+1} von ${aktDef().ebenen.length} (${key}): ${S.weg.map(o=>RUN.knoten[o.art].n).join(', ')} nach Regel ${JSON.stringify(E.mindestens||E.einer_von||E.verschiedene||E.fest||E.fest_wahl||'frei')}`});
 save();Bus.emit('changed');}
function rollFoes(art,r){const b=biom();const z=RUN.kaempfe.zahl[S.akt];let n=z[Math.min(S.ebene,z.length-1)];if(art==='kampf_schwer')n+=RUN.kaempfe.schwer_extra;n=Math.min(4,n);
 const pool=b.gegner.filter(id=>FOES[id]);return[...Array(n)].map(()=>r.pick(pool));}

function chooseWeg(i){if(S.phase!=='weg')return;const o=S.weg[i];if(!o)return;S.cur=o;S.depth++;S.weg=null;S.phase='knoten';
 save(); // vor dem Betreten sichern: Fortsetzen betritt denselben Knoten neu (gleicher Seed = gleicher Inhalt)
 Bus.emit('weg_gewaehlt',{art:o.art,why:`Weg gewählt: ${RUN.knoten[o.art].n} („${o.hint}“), Tiefe ${S.depth}`});enterNode(o);}

// --- Knoten ---
function enterNode(o){S.node={art:o.art};const b=biom();const r=R(`knoten:${S.depth}:${o.art}`);
 switch(o.art){
  case'kampf':startFight(o.foes,'kampf');break;
  case'kampf_schwer':startFight(o.foes,'schwer');break;
  case'waechter':startFight(o.foes,'waechter');break;
  case'finale':startFight(o.foes,'finale');break;
  case'ereignis':{const pool=EVENTS.filter(e=>e.biom===biomId());const seen=S.stats.events||[];const fresh=pool.filter(e=>!seen.includes(e.id));
   const alle=EVENTS.filter(e=>e.biom==='alle'&&!seen.includes(e.id));const ev=r.pick(fresh.length?fresh:alle.length?alle:EVENTS);
   S.stats.events=[...seen,ev.id];S.event=ev.id;S.phase='event';Bus.emit('event',{ev,why:`Ereignis „${ev.t}“ aus ${fresh.length?b.kurz:'allgemein'} per Seed`});break;}
  case'kraemer':{const SH=BAL.shop;const o2=[...r.sample(dropPool(),SH.normal_items),...r.sample(rarePool(),SH.rare_items)];
   S.shop={items:o2.map(id=>({id,price:ITEMS[id].rare?SH.rare_price:r.int(SH.normal_price[0],SH.normal_price[1]),sold:false})),heal:false,strike:false};S.phase='kraemer';
   Bus.emit('kraemer',{why:`Krämer ${b.kraemer.n}: Sortiment aus dem Fundpool von ${b.kurz}`});break;}
  case'werkstatt':S.forged=false;S.phase='werkstatt';break;
  case'rast':S.rastDone=false;S.phase='rast';break;
  case'wandbild':{const fr=nextFragment(r);S.frag=fr?fr.id:null;S.phase='wandbild';if(fr)readFragment(fr);break;}
  case'fundstelle':{const F=RUN.fundstelle;const haken=r.chance(F.haken_chance);const item=r.chance(.55)?r.pick(dropPool()):null;const gold=item?0:r.int(F.gold[0],F.gold[1]);
   S.fund={item,gold,haken,taken:false};S.phase='fund';break;}
 }
 Bus.emit('node',{art:o.art,why:`Knoten ${RUN.knoten[o.art].n} auf Tiefe ${S.depth}`});Bus.emit('changed');}

function finishNode(){if(S.pending&&S.pending.length)return; // erst offene Ereignisfolgen (Streichen, Kampf)
 const art=S.node&&S.node.art;S.node=null;S.event=null;S.shop=null;S.fund=null;
 if(art==='finale'){S.phase='ankunft';Bus.emit('finale_gewonnen',{why:'Das, was ruft ist besiegt'});save(true);Bus.emit('changed');return;}
 S.ebene++;
 if(S.ebene>=aktDef().ebenen.length){S.akt++;S.stats.akt=S.akt;enterAct();save();return;}
 genWeg();}

// --- Kampf gewonnen / verloren ---
function fightWon(){const art=S.kampfArt;S.stats.kaempfe++;
 Bus.emit('victory',{art,why:`Alle Gegner besiegt (${S.turnNo} Züge)`});
 const hb=Math.round(maxHp()*BAL.victory_heal_pct)+passive('heil_nach_sieg').reduce((s,p)=>s+p.v,0);healP(hb,`Sieg: ${Math.round(BAL.victory_heal_pct*100)} % von ${maxHp()} Leben`);
 bonuses('after_victory_item').forEach(b=>{giveItem(b.item,'Set Friedhofswärter');Bus.emit('toast',{a:'FRIEDHOFSWÄRTER',b:'Ein Knochen für den Rucksack'});});
 if(art==='finale'){S.phase='reward';S.reward=[];S.picked=true;S.goldGain=0;finishNode();return;}
 const r=R(`beute:${S.depth}`);const G=BAL.gold_per_victory;
 let gd=art==='waechter'?r.int(BAL.waechter_belohnung.gold[0],BAL.waechter_belohnung.gold[1]):r.int(G.min,G.max)+S.enemies.length*G.per_enemy;
 gd+=passive('gold_bonus').reduce((s,p)=>s+p.v,0);S.gold+=gd;S.stats.gold+=gd;S.goldGain=gd;
 const R2=BAL.rewards;const n=R2.choices+(passive('glueck').length?1:0);const pick=r.sample(dropPool(),n);
 const rare=art==='waechter'||art==='schwer'||(S.depth>=R2.rare_from_depth&&r.chance(R2.rare_chance));
 if(rare){const rp=rarePool();if(rp.length)pick[pick.length-1]=r.pick(rp);}
 // Gegner-Beute: kleine Chance auf das eigene Stück eines Gegners
 const beute=S.enemies.map(e=>FOES[e.id].beute).filter(id=>id&&ITEMS[id]);if(beute.length&&r.chance(.2)){pick[0]=r.pick(beute);S.beuteFrom=true;}
 S.reward=pick;S.picked=false;S.phase='reward';S.hand=[];
 Bus.emit('reward',{gold:gd,items:pick,why:`Belohnung: ${gd} Gold, Auswahl aus Fundpool ${biom().kurz}${rare?', ein seltenes Item':''}`});Bus.emit('changed');}
function takeReward(id){if(S.picked)return;if(id){if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}giveItem(id,'Fund nach dem Kampf');Bus.emit('pick');}S.picked=true;Bus.emit('changed');}
function leaveReward(){if(!S.picked)S.picked=true;finishNode();}
function runLost(){S.phase='strand';busy=false;const res={sieg:false,tiefe:S.depth,akt:S.akt,biom:biomId(),gegner:S.enemies.filter(e=>e.hp>0).map(e=>e.id),job:S.job};
 S.ergebnis=res;Bus.emit('game_over',{...res,why:`Leben 0 auf Tiefe ${S.depth} in ${biom().kurz}`});
 if(typeof Meta!=='undefined'&&!S.dev)S.neu=Meta.runEnde(res,S);clearSave();Bus.emit('changed');}
function chooseEnde(art){if(S.phase!=='ankunft')return;const res={sieg:true,ende:art,tiefe:S.depth,akt:4,biom:'pforte',job:S.job};S.ergebnis=res;S.phase='ende';
 Bus.emit('ende',{art,why:art==='bleiben'?'Du bleibst.':'Du kehrst um.'});if(typeof Meta!=='undefined'&&!S.dev)S.neu=Meta.runEnde(res,S);clearSave();Bus.emit('changed');}

// --- Ereignisse ---
function curEvent(){return EVENTS.find(e=>e.id===S.event);}
function chooseEvent(i){const ev=curEvent();if(!ev)return;const o=ev.o[i];if(!o||!condOk(o.if))return;
 S.eventChoice=i;runFx(o.fx,{why:`Ereignis „${ev.t}“: ${o.l}`});Bus.emit('pick');Bus.emit('event_choice',{ev,i,why:`Entscheidung „${o.l}“`});
 S.phase='event_folge';afterEventFx();}
function afterEventFx(){const p=S.pending||[];if(!p.length){finishNode();return;}
 const nx=p[0];if(nx==='strike'){S.phase='streichen';Bus.emit('changed');return;}
 if(nx.fight!==undefined){p.shift();const b=biom();const r=R(`ereigniskampf:${S.depth}`);const ids=(nx.fight||[]).filter(id=>FOES[id]);const foes=ids.length?ids:[r.pick(b.gegner.filter(id=>FOES[id])),r.pick(b.gegner.filter(id=>FOES[id]))];
  S.node={art:'kampf'};startFight(foes,'kampf');Bus.emit('changed');return;}
 p.shift();afterEventFx();}

// --- Karte streichen (Krämer, Ereignis): Item bleibt angelegt, gibt aber keine Karte mehr ---
function strikeTargets(){return allActive().filter(it=>!it.x&&def(it).cards.length);}
function strikeItem(uid){const it=allActive().find(x=>x.uid===uid);if(!it||it.x)return;it.x=1;log(`Gestrichen: ${def(it).n}`);Bus.emit('strike',{it,why:`Karte von ${def(it).n} gestrichen, das Item zählt weiter für Leben und Sets`});
 if(S.phase==='streichen'){S.pending.shift();afterEventFx();}else Bus.emit('changed');}
function skipStrike(){if(S.phase==='streichen'){S.pending.shift();afterEventFx();}}
function transformRandom(why){const list=allActive().filter(it=>!def(it).bases);if(!list.length)return;const r=rs('fund');const it=r.pick(list);const a=def(it).a;
 const pool=Object.keys(ITEMS).filter(k=>ITEMS[k].a===a&&k!==it.id&&!ITEMS[k].nodrop&&!ITEMS[k].bases&&!ITEMS[k].rare);if(!pool.length)return;const old=def(it).n;it.id=r.pick(pool);it.x=0;
 log(`${old} wird zu ${def(it).n}`);Bus.emit('transform',{why:`${why}: ${old} verwandelt sich in ${def(it).n}`});after();}

// --- Krämer ---
function buy(i){const H=BAL.shop.heal;const sh=S.shop;if(!sh)return;
 if(i==='heal'){if(sh.heal||S.gold<H.price){Bus.emit('bad',{a:'ZU WENIG GOLD',b:''});return;}S.gold-=H.price;sh.heal=true;healP(H.v,'Krämer: Laudanum');Bus.emit('changed');return;}
 if(i==='strike'){if(sh.strike||S.gold<BAL.shop.streichen_preis){Bus.emit('bad',{a:'ZU WENIG GOLD',b:''});return;}S.phase='kraemer_streichen';Bus.emit('changed');return;}
 const o=sh.items[+i];if(!o||o.sold)return;if(S.gold<o.price){Bus.emit('bad',{a:'ZU WENIG GOLD',b:`Du brauchst ${o.price}.`});return;}if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}
 S.gold-=o.price;o.sold=true;giveItem(o.id,`Gekauft für ${o.price} Gold`);Bus.emit('pick');Bus.emit('toast',{a:'GEKAUFT',b:ITEMS[o.id].n});Bus.emit('changed');}
function kraemerStrike(uid){if(uid!=null){S.gold-=BAL.shop.streichen_preis;S.shop.strike=true;strikeItem(uid);}S.phase='kraemer';Bus.emit('changed');}

// --- Rast: heilen oder ein Item verbessern ---
function rastHeal(){if(S.rastDone)return;S.rastDone=true;const v=Math.round(maxHp()*RUN.rast.heil_anteil);healP(v,`Rast: ${Math.round(RUN.rast.heil_anteil*100)} % Leben`);Bus.emit('changed');}
function rastUpgrade(loc){if(S.rastDone)return;const it=getAt(loc);if(!it)return;const A=def(it);const F=BAL.forge;
 const id='m'+(++uidc)+'_'+S.depth;const nd={...A,n:`${A.base||A.n} +${(A.lvl||0)+1}`,base:A.base||A.n,lvl:(A.lvl||0)+1,bases:A.bases||[it.id],cards:A.cards.map(c=>{const n={...c};['atk','blk','heal','poison','burn'].forEach(q=>{if(n[q])n[q]+=F.bump;});return n;})};
 ITEMS[id]=nd;S.custom[id]=nd;it.id=id;S.rastDone=true;log(`Verbessert: ${nd.n}`);Bus.emit('forged',{name:nd.n,why:`Rast: ${A.n} verbessert, alle Werte +${F.bump}`});Bus.emit('changed');}

// --- Fundstelle ---
function takeFund(){const f=S.fund;if(!f||f.taken)return;f.taken=true;if(f.haken){S.hp=Math.max(1,S.hp-RUN.fundstelle.haken_schaden);Bus.emit('player_hurt',{v:RUN.fundstelle.haken_schaden,why:'Fundstelle mit Haken'});}
 if(f.item)giveItem(f.item,'Fundstelle');if(f.gold){S.gold+=f.gold;Bus.emit('gold',{v:f.gold,why:'Fundstelle'});}Bus.emit('changed');}

// --- Wandbild ---
function nextFragment(r){const b=biomId();const list=FRAGS.filter(f=>f.biom===b);if(!list.length)return null;const read=typeof Meta!=='undefined'?Meta.read():[];const fresh=list.filter(f=>!read.includes(f.id));return fresh.length?fresh[0]:r.pick(list);}
function readFragment(fr){if(!S.stats.fragmente.includes(fr.id))S.stats.fragmente.push(fr.id);let neu=null;if(typeof Meta!=='undefined'&&!S.dev)neu=Meta.lies(fr.id);S.fragNeu=neu;
 Bus.emit('fragment',{fr,neu,why:`Fragment ${fr.id} gelesen${neu&&neu.length?': schaltet frei '+neu.map(x=>x.n).join(', '):''}`});}

// --- Werkstatt (Verschmelzen wie bisher) ---
function forgePreview(){const[a,b]=S.bench;if(!a||!b)return null;const A=def(a),B=def(b);const F=BAL.forge;const st=[...new Set([...A.st,...B.st])];
 if(st.length>F.max_stoffe)return{err:`Zu viele Stoffe. Ein Item kann höchstens ${F.max_stoffe} tragen.`};
 const base=A.base||A.n;const lvl=(A.lvl||0)+(B.lvl||0)+1;const same=B.st.every(x=>A.st.includes(x));
 if(F.double_needs_reaction&&!same&&st.length===2&&!REACT.find(r=>r.k===pairKey(st[0],st[1])))return{err:`${ST[st[0]].n} und ${ST[st[1]].n} verbinden sich nicht. Verschmelzen geht nur mit Stoffen, die miteinander reagieren.`};
 const newSt=B.st.find(x=>!A.st.includes(x));const name=same?`${base} +${lvl}`:`${base} ${SUFFIX[newSt]}`;
 const rx=[];for(let i=0;i<st.length;i++)for(let j=i+1;j<st.length;j++){const r=REACT.find(r=>r.k===pairKey(st[i],st[j]));if(r)rx.push(r);}
 const bump=c=>{const n={...c};['atk','blk','heal','poison','burn'].forEach(q=>{if(n[q])n[q]+=F.bump;});return n;};
 return{n:name,a:A.a,st,same,hp:(A.hp||0)+(B.hp||0),spr:A.spr,cards:[...A.cards,...B.cards].map(bump),bases:[...(A.bases||[a.id]),...(B.bases||[b.id])],base,lvl,rx};}
function forge(){if(S.forged||S.phase!=='werkstatt')return;const p=forgePreview();if(!p||p.err){Bus.emit('bad',{});return;}
 const id='m'+(++uidc)+'_'+S.depth;const nd={n:p.n,a:p.a,st:p.st,hp:p.hp,spr:p.spr,cards:p.cards,bases:p.bases,base:p.base,lvl:p.lvl};ITEMS[id]=nd;S.custom[id]=nd;
 S.bench=[{uid:++uidc,id},null];S.forged=true;Bus.emit('forged',{name:p.n,why:`Werkstatt: ${p.same?'Stufe':'Doppel-Item'} ${p.n}`});log(`Verschmolzen: ${p.n}`);
 p.rx.forEach(r=>{if(!S.disc.has(r.n)){S.disc.add(r.n);log(`Reaktion entdeckt: ${r.n}`);}});Bus.emit('changed');}
function leaveBench(){for(let i=0;i<2;i++){const it=S.bench[i];if(it){const j=S.bag.indexOf(null);if(j<0){Bus.emit('bad',{a:'KEIN PLATZ',b:'Nimm die Items von der Werkbank erst weg.'});return false;}S.bag[j]=it;S.bench[i]=null;}}return true;}
function leaveNode(){if(!leaveBench())return;finishNode();}

// --- Inventar ---
function giveItem(id,why=''){if(!ITEMS[id])return false;const it=mk(id);const i=S.bag.indexOf(null);if(i>=0){S.bag[i]=it;log(`Erhalten: ${ITEMS[id].n}`);Bus.emit('item',{id,why:why||'Item erhalten'});return true;}log('Rucksack voll, Item verloren.');return false;}
function getAt(loc){const[k,i]=loc.split(':');if(k==='bag')return S.bag[+i];if(k==='bench')return S.bench[+i];return S.areas[k][+i];}
function setAt(loc,v){const[k,i]=loc.split(':');if(k==='bag')S.bag[+i]=v;else if(k==='bench')S.bench[+i]=v;else S.areas[k][+i]=v;}
function canPlace(it,loc){if(!it)return true;const[k,i]=loc.split(':');if(k==='bag'||k==='bench')return true;return def(it).a===k&&+i<S.slots[k];}
function canEquip(){return!['fight','titel','figur','strand','ende','ankunft'].includes(S.phase);}
function move(from,to){
 if(busy||from===to||!canEquip()){if(S.phase==='fight')Bus.emit('bad',{a:'IM KAMPF',b:'Umrüsten geht nur zwischen den Kämpfen.'});return;}
 if(to==='trash'){const it=getAt(from);if(!it)return;setAt(from,null);log(`Weggeworfen: ${def(it).n}`);Bus.emit('click');return after();}
 const[k,i]=to.split(':');if(k!=='bag'&&k!=='bench'&&+i>=S.slots[k]){Bus.emit('bad',{});return;}
 if((k==='bench'||from.startsWith('bench'))&&S.phase!=='werkstatt')return;
 const a=getAt(from),b=getAt(to);if(!canPlace(a,to)||!canPlace(b,from)){Bus.emit('bad',{a:'PASST NICHT',b:a?'Gehört zu '+AREA_N[def(a).a]:''});return;}
 setAt(to,a);setAt(from,b);Bus.emit('pick');after();}
function after(){S.hp=Math.min(Math.max(1,S.hp),maxHp());Bus.emit('changed');}

// --- Speichern und Fortsetzen ---
function serialize(){const o={...S};o.disc=[...S.disc];o.hochUsed=[...(S.hochUsed||[])];o.uidc=uidc;return JSON.stringify(o);}
function save(force){if(DRY||FAST&&!force)return;if(S.dev&&!force)return;try{if(['strand','ende'].includes(S.phase))return;localStorage.setItem(SAVE_KEY,serialize());}catch(e){}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
function hasSave(){try{return !!localStorage.getItem(SAVE_KEY);}catch(e){return false;}}
function loadRun(){let o;try{o=JSON.parse(localStorage.getItem(SAVE_KEY));}catch(e){return false;}if(!o)return false;
 o.disc=new Set(o.disc||[]);o.hochUsed=new Set(o.hochUsed||[]);uidc=o.uidc||100;Object.assign(ITEMS,o.custom||{});S=o;
 // Mitten im Knoten gespeichert: den Knoten neu betreten (deterministisch), sonst an der Weg-Wahl weitermachen
 if(S.phase==='weg'||S.phase==='uebergang'||S.phase==='ankunft'){Bus.emit('changed');return true;}
 if(S.phase==='knoten'&&S.cur)enterNode(S.cur);else genWeg();
 Bus.emit('load',{why:`Run fortgesetzt (Seed ${S.seed}, Tiefe ${S.depth})`});return true;}
