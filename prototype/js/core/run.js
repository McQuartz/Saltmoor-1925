// Ablauf eines Runs: Strand → Figurwahl → fünf feste Akte (Anzahl und Reihenfolge nie ändern) → Ankunft.
// Jeder Akt hat Ebenen (data/run.json). Nach jedem Knoten wählt man den nächsten Weg. Verlieren → Strand.
// Alles Zufällige hängt am Seed (js/core/rng.js). Gespeichert wird nach jedem Knoten (localStorage).
const SAVE_KEY='saltmoor.run.v1';

// --- Weg durch die Welt: am Anfang jedes Akts zwei Biome zur Wahl ---
// Akt I: die Vorliebe der Figur plus eins per Seed; sonst zwei per Seed. Biome ohne Daten werden übersprungen.
function biomAngebot(akt){const a=RUN.akte[akt];const da=a.biome.filter(b=>BIOMES[b]);if(da.length<=1)return{biome:da,why:`${a.n}: nur ${da.map(b=>BIOMES[b].kurz).join('')}`};
 const r=R(`angebot:${akt}`);const job=JOBS.find(j=>j.id===S.job)||JOBS[0];
 if(a.wahl==='figur'&&da.includes(job.vorliebe)){const rest=da.filter(b=>b!==job.vorliebe);const z=r.pick(rest);return{biome:r.chance(.5)?[job.vorliebe,z]:[z,job.vorliebe],why:`${a.n}: Vorliebe ${job.n} → ${BIOMES[job.vorliebe].kurz}, dazu ${BIOMES[z].kurz} per Seed`};}
 const two=r.sample(da,2);return{biome:two,why:`${a.n}: ${two.map(b=>BIOMES[b].kurz).join(' oder ')} per Seed aus ${da.length}`};}
function newRun(jobId,seed,opt={}){
 const job=JOBS.find(j=>j.id===jobId)||JOBS[0];uidc=0;seed=seed>>>0;
 S={phase:'uebergang',seed,job:job.id,jobN:job.n,route:opt.route?[...opt.route]:[],routeFixed:!!opt.route,routeWhy:opt.route?['Weg im Dev-Modus vorgegeben']:[],angebote:[],akt:0,ebene:0,depth:0,
  hp:0,bonusHp:0,gold:0,energy:BAL.energy_per_turn,block:0,ward:0,
  slots:{waffe:BAL.start_slots,kleidung:BAL.start_slots,talisman:BAL.start_slots},
  areas:{waffe:[null,null,null,null],kleidung:[null,null,null,null],talisman:[null,null,null,null]},bag:Array(BAL.bag_size).fill(null),bench:[null,null],
  enemies:[],disc:new Set(),sel:null,log:[],custom:{},rs:{},weg:null,cur:null,pending:[],dev:!!opt.dev,
  stats:{kaempfe:0,fragmente:[],gold:0},metaItems:(typeof Meta!=='undefined'?Meta.items():[]),startT:Date.now(),
  draw:[],hand:[],discard:[],exhaust:[],last:[],played:0,hochUsed:new Set(),target:0,chainLog:[]};
 job.w.forEach((id,i)=>S.areas.waffe[i]=mk(id));job.k.forEach((id,i)=>S.areas.kleidung[i]=mk(id));job.t.forEach((id,i)=>S.areas.talisman[i]=mk(id));(job.bag||[]).forEach((id,i)=>S.bag[i]=mk(id));
 // Start-Handgriffe stecken schon in den Kerben der Startitems (04-deckbau.md Abschnitt 2)
 for(const it of [...AREAS.flatMap(a=>S.areas[a]),...S.bag].filter(Boolean)){const l=(job.hg||{})[it.id];if(l)hgVon(it).push(...l.filter(id=>HANDGRIFFE[id]).slice(0,kerbenVon(it)-hgVon(it).length));}
 S.stufe=opt.stufe||0;S.start=opt.start||null;
 S.hp=maxHp();
 const sv=(RUN.startvarianten||[]).find(v=>v.id===S.start);if(sv)runFx(sv.fx,{why:'Startvariante '+sv.n});
 const sr=Rng.of(seed,'schreck');const J=BAL.jumpscare;S.scareAt=(J.fenster_min[0]+sr.next()*(J.fenster_min[1]-J.fenster_min[0]))*60000;S.scares=0;
 log(job.ausrede);
 Bus.emit('run_start',{seed,job:job.id,why:`Seed ${seed}, ${job.n}`});
 enterAct();}

// --- Akte und Ebenen ---
function aktDef(){return RUN.akte[S.akt];}
function enterAct(){S.ebene=0;if(S.akt>0)leiheZurueck();
 if(!S.route[S.akt]||!BIOMES[S.route[S.akt]]){const an=biomAngebot(S.akt);S.angebote[S.akt]=an.biome;S.routeWhy.push(an.why);
  if(an.biome.length>1){S.phase='biomwahl';Bus.emit('biomwahl',{biome:an.biome,why:an.why});save();Bus.emit('changed');return;}S.route[S.akt]=an.biome[0];}
 S.phase='uebergang';Bus.emit('act_start',{akt:S.akt,biom:biomId(),why:`${aktDef().n}: ${biom().n}`});Bus.emit('changed');}
function leaveUebergang(){genWeg();}
function chooseBiom(i){if(S.phase!=='biomwahl')return;const b=S.angebote[S.akt][i];if(!b)return;S.route[S.akt]=b;S.routeWhy.push(`${RUN.akte[S.akt].n}: ${BIOMES[b].kurz} gewählt`);Bus.emit('biom_gewaehlt',{biom:b,why:`${BIOMES[b].n} gewählt`});enterAct();}
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
 // Ufer unten: im Vorraum wartet „Der, der vor dir kam“ (Elite, Pflicht)
 if(key==='vorraum'&&b.vorraum_elite&&FOES[b.vorraum_elite])arten=['kampf_schwer'];
 S.weg=arten.map((art,i)=>{const hs=(b.weg_hinweise&&b.weg_hinweise[art==='kampf_schwer'?'kampf':art])||[RUN.knoten[art].n];used[art]=(used[art]||0);const hint=hs[(r.int(0,hs.length-1)+used[art]++)%hs.length];
  const o={art,hint,i};if(art==='kampf'||art==='kampf_schwer')o.foes=key==='vorraum'&&b.vorraum_elite?[b.vorraum_elite]:rollFoes(art,r);if(key==='vorraum'&&b.vorraum_elite&&b.weg_hinweise&&b.weg_hinweise.vorraum)o.hint=b.weg_hinweise.vorraum[0];if(art==='waechter')o.foes=[b.waechter];if(art==='finale')o.foes=[b.waechter];return o;});
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
  case'ereignis':{const seen=S.stats.events||[];const geht=e=>!seen.includes(e.id)&&condOk(e.if);const fresh=EVENTS.filter(e=>e.biom===biomId()&&geht(e));
   // biomübergreifende Ereignisse: in einem Viertel der Fälle (BAL.ereignis_allgemein), sonst nur, wenn das Biom leer ist
   const alle=EVENTS.filter(e=>e.biom==='alle'&&geht(e));const allg=alle.length&&(!fresh.length||r.chance(BAL.ereignis_allgemein!=null?BAL.ereignis_allgemein:.25));
   const ev=r.pick(allg?alle:fresh.length?fresh:EVENTS.filter(e=>!e.if));
   S.stats.events=[...seen,ev.id];S.event=ev.id;S.phase='event';Bus.emit('event',{ev,why:`Ereignis „${ev.t}“ aus ${allg?'allgemein':b.kurz} per Seed`});break;}
  case'kraemer':{const SH=BAL.shop;const o2=[...r.sample(dropPool(),SH.normal_items),...r.sample(rarePool(),SH.rare_items)];
   const hgA=handgriffAngebot(r,'mix',2).map(id=>({id,price:(HANDGRIFFE[id].rar==='selten'?SH.hg_preis_selten:SH.hg_preis)||40,sold:false}));
   const rel=r.chance(SH.reliquie_chance||.15)?reliquienPool():[];
   S.shop={items:o2.map(id=>({id,price:ITEMS[id].rare?SH.rare_price:r.int(SH.normal_price[0],SH.normal_price[1]),sold:false})),hg:hgA,heal:false,strike:false};
   if(rel.length)S.shop.items.push({id:r.pick(rel),price:SH.reliquie_preis||140,sold:false});
   // Besondere Krämer (Steckbriefe Auftrag 2): tausch = Item gegen Item, leihe = billig, aber nur bis zum nächsten Akt, spiegel = Waren des letzten Krämers mit vertauschten Stoffen
   const kart=b.kraemer&&b.kraemer.art;S.shop.art=kart||null;
   if(kart==='tausch')S.shop.items.forEach(o=>{o.price=0;o.tausch=true;});
   if(kart==='leihe')S.shop.items.forEach(o=>{o.price=Math.max(5,Math.round(o.price*(SH.leih_anteil||.3)));o.leihe=true;});
   if(kart==='spiegel'){const alt=(S.letzterKraemer&&S.letzterKraemer.length?S.letzterKraemer:o2).filter(id=>ITEMS[id]);S.shop.items=alt.map(id=>({id:spiegelItem(id),price:ITEMS[id].rare?SH.rare_price:r.int(SH.normal_price[0],SH.normal_price[1]),sold:false}));}
   else S.letzterKraemer=S.shop.items.map(o=>o.id);
   S.phase='kraemer';
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
 // Handgriff 1 aus 3 (zwei passend zum Deck, einer frei), Item je nach Knoten, Wächter: Reliquie 1 aus 3
 const RW=BAL.belohnung||{};const glueck=passive('glueck').length?1:0;
 const hg=handgriffAngebot(r,art==='waechter'?'selten':art==='schwer'?'mix':'gewoehnlich',3);
 let items=[];
 if(art==='waechter'){items=r.sample(reliquienPool(),3+glueck);}
 else if(art==='schwer'){items=r.sample(dropPool(),2+glueck);const rp=rarePool();if(rp.length)items.push(r.pick(rp));}
 else if(r.chance(RW.item_chance??.25)){items=r.sample(dropPool(),2+glueck);}
 // Gegner-Beute: kleine Chance auf das eigene Stück eines Gegners (Kniff „nachlass: item“ sicher)
 const beute=S.enemies.map(e=>FOES[e.id].beute).filter(id=>id&&ITEMS[id]);if(S.sicheresBeute&&ITEMS[S.sicheresBeute]){items[0]=S.sicheresBeute;S.sicheresBeute=null;}else if(beute.length&&r.chance(.15)){items[0]=r.pick(beute);}
 const rare=art==='waechter'||art==='schwer';const pick=items;
 S.reward=pick;S.picked=!pick.length;S.rewardHg=hg;S.hgPicked=!hg.length;S.hgPending=null;S.phase='reward';S.hand=[];
 Bus.emit('reward',{gold:gd,items:pick,hg,why:`Belohnung: ${gd} Gold, Handgriffe ${hg.map(id=>HANDGRIFFE[id].n).join('/')}${pick.length?', Items '+pick.map(id=>ITEMS[id].n).join('/'):''}${art==='waechter'?' (Reliquien)':''}`});Bus.emit('changed');}
function takeReward(id){if(S.picked)return;if(id){if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}giveItem(id,'Fund nach dem Kampf');Bus.emit('pick');}S.picked=true;Bus.emit('changed');}
function leaveReward(){if(!S.picked)S.picked=true;finishNode();}
function runLost(){S.phase='strand';busy=false;S.stats.endeT=Date.now();const res={sieg:false,tiefe:S.depth,akt:S.akt,biom:biomId(),gegner:S.enemies.filter(e=>e.hp>0).map(e=>e.id),job:S.job};
 S.ergebnis=res;Bus.emit('game_over',{...res,why:`Leben 0 auf Tiefe ${S.depth} in ${biom().kurz}`});
 if(typeof Meta!=='undefined'&&!S.dev)S.neu=Meta.runEnde(res,S);clearSave();Bus.emit('changed');}
function chooseEnde(art){if(S.phase!=='ankunft')return;S.stats.endeT=Date.now();const res={sieg:true,ende:art,tiefe:S.depth,akt:4,biom:'pforte',job:S.job};S.ergebnis=res;S.phase='ende';
 Bus.emit('ende',{art,why:art==='bleiben'?'Du bleibst.':'Du kehrst um.'});if(typeof Meta!=='undefined'&&!S.dev)S.neu=Meta.runEnde(res,S);clearSave();Bus.emit('changed');}

// --- Ereignisse ---
function curEvent(){return EVENTS.find(e=>e.id===S.event);}
function chooseEvent(i){const ev=curEvent();if(!ev)return;const o=ev.o[i];if(!o||!condOk(o.if))return;
 S.eventChoice=i;runFx(o.fx,{why:`Ereignis „${ev.t}“: ${o.l}`});Bus.emit('pick');Bus.emit('event_choice',{ev,i,why:`Entscheidung „${o.l}“`});
 S.phase='event_folge';afterEventFx();}
function afterEventFx(){const p=S.pending||[];if(!p.length){finishNode();return;}
 const nx=p[0];if(nx==='strike'){S.phase='streichen';Bus.emit('changed');return;}
 if(nx.hg){S.hgPending=nx.hg;S.phase='event_hg';Bus.emit('changed');return;}
 if(nx.wahl){S.wahl={art:nx.wahl,quelle:'event',phase:'event_folge'};S.phase='wahl';Bus.emit('changed');return;}
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
// Spiegel-Krämer: dasselbe Item mit vertauschten Stoffen (Feuer↔Wasser, Eisen↔Fäulnis, Salz↔Blut, Glaube↔Licht)
const SPIEGEL={F:'W',W:'F',E:'V',V:'E',S:'B',B:'S',G:'L',L:'G'};
function spiegelItem(id){const D=ITEMS[id];if(!D||D.spiegel)return id;const nid='sp_'+id;if(!ITEMS[nid]){const nd=JSON.parse(JSON.stringify(D));nd.st=(D.st||[]).map(k=>SPIEGEL[k]||k);(nd.cards||[]).forEach(c=>{if(c.st)c.st=c.st.map(k=>SPIEGEL[k]||k);});nd.n=D.n+', gespiegelt';nd.spiegel=id;nd.bases=[id];nd.nodrop=true;ITEMS[nid]=nd;S.custom[nid]=nd;}return nid;}
// Leihgaben des Bibliothekars gehen beim nächsten Akt zurück
function leiheZurueck(){const weg=[];besitz().forEach(b=>{if(b.it.leihe!=null&&b.it.leihe<S.akt){weg.push(def(b.it).n);setAt(b.loc,null);}});if(weg.length){Bus.emit('toast',{a:'ZURÜCKGEGEBEN',b:weg.join(', ')});log('Leihgabe zurück: '+weg.join(', '));}}
function buy(i){const H=BAL.shop.heal;const sh=S.shop;if(!sh)return;
 if(i==='heal'){if(sh.heal||S.gold<H.price){Bus.emit('bad',{a:'ZU WENIG GOLD',b:''});return;}S.gold-=H.price;S.stats.goldAus=(S.stats.goldAus||0)+H.price;sh.heal=true;healP(H.v,'Krämer: Laudanum');Bus.emit('changed');return;}
 if(i==='strike'){if(sh.strike||S.gold<BAL.shop.streichen_preis){Bus.emit('bad',{a:'ZU WENIG GOLD',b:''});return;}S.phase='kraemer_streichen';Bus.emit('changed');return;}
 const o=sh.items[+i];if(!o||o.sold)return;
 if(o.tausch){const gabe=S.sel&&getAt(S.sel);if(!gabe){Bus.emit('bad',{a:'GABE GEGEN GABE',b:'Wähl unten zuerst ein Item, das du hergibst.'});return;}const gn=def(gabe).n;setAt(S.sel,null);S.sel=null;o.sold=true;giveItem(o.id,`Getauscht gegen ${gn}`);Bus.emit('pick');Bus.emit('toast',{a:'GETAUSCHT',b:`${gn} → ${ITEMS[o.id].n}`});Bus.emit('changed');return;}
 if(S.gold<o.price){Bus.emit('bad',{a:'ZU WENIG GOLD',b:`Du brauchst ${o.price}.`});return;}if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}
 S.gold-=o.price;S.stats.goldAus=(S.stats.goldAus||0)+o.price;o.sold=true;giveItem(o.id,`Gekauft für ${o.price} Gold`);if(o.leihe){const neu=besitz().map(b=>b.it).filter(it=>it.id===o.id&&it.leihe==null).pop();if(neu)neu.leihe=S.akt;}Bus.emit('pick');Bus.emit('toast',{a:'GEKAUFT',b:ITEMS[o.id].n});Bus.emit('changed');}
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
function canEquip(){return!['fight','titel','figur','strand','ende','ankunft','biomwahl'].includes(S.phase);}
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
 if(['weg','uebergang','ankunft','biomwahl'].includes(S.phase)){Bus.emit('changed');return true;}
 if(S.phase==='knoten'&&S.cur)enterNode(S.cur);else genWeg();
 Bus.emit('load',{why:`Run fortgesetzt (Seed ${S.seed}, Tiefe ${S.depth})`});return true;}

// Welcher der acht Builds (04-deckbau.md Abschnitt 7, builds.md Abschnitt 7–8) passt am ehesten zum Deck? Grobe Zählung über Stoffe und Wirkungen.
function buildArchetyp(){const z={glutnest:0,brackwasser:0,bollwerk:0,aderlass:0,kettenwerk:0,hagel:0,ballast:0,kollekte:0};const st=new Set();
 // Ballast und Kollekte (Zugabe 4) zählen nur über eigene Merkmale: Ballast erzeugen oder abwerfen, Zoll und Gold, und ihre Reliquien
 const BALLAST=c=>c.sonder&&(c.sonder.art==='ueber_bord'||(c.sonder.fx||[]).some(f=>f.op==='ballast'));
 for(const it of allActive()){const D=def(it);D.st.forEach(k=>st.add(k));const ks=[...D.cards,...((it.hg||[]).map(id=>HANDGRIFFE[id]).filter(Boolean))];
  const e=D.eigen&&D.eigen.typ;if(e&&/^ballast_/.test(e))z.ballast+=8;if(e&&['gold_schaden','gold_block','gold_je_tod','faehrgeld','gold_energie'].includes(e))z.kollekte+=8;
  for(const c of ks){if(c.unspielbar)z.ballast+=1;if(BALLAST(c))z.ballast+=3.5;if(c.zoll)z.kollekte+=3.5;if(c.gold)z.kollekte+=3;}
  for(const c of ks){const s=D.st;if(c.burn||s.includes('F'))z.glutnest+=1+(c.burn||0)/2;if(c.poison||s.includes('V'))z.brackwasser+=1+(c.poison||0)/2;
   if(c.blk&&(s.includes('G')||s.includes('S')))z.bollwerk+=1+c.blk/6;if(c.self||c.opfer||s.includes('B'))z.aderlass+=1.2;if(c.funke||c.kette)z.kettenwerk+=1.5;if((c.h||1)>1||c.str||c.vuln||s.includes('E'))z.hagel+=1+((c.h||1)-1)*.6;}}
 z.kettenwerk+=Math.max(0,st.size-3)*1.5;const best=Object.entries(z).sort((a,b)=>b[1]-a[1])[0];
 const N={glutnest:'Glutnest',brackwasser:'Brackwasser',bollwerk:'Bollwerk',aderlass:'Aderlass',kettenwerk:'Kettenwerk',hagel:'Hagel',ballast:'Ballast',kollekte:'Kollekte'};return{id:best[0],n:N[best[0]],werte:z};}

// ---------- Handgriffe und Kerben (04-deckbau.md Abschnitt 2, 6, 8) ----------
function handgriffPool(rar){return Object.keys(HANDGRIFFE).filter(id=>{const H=HANDGRIFFE[id];return !H.unspielbar&&!H.start&&(!rar||rar==='mix'||(H.rar||'gewoehnlich')===rar);});}
// Angebot: zwei Handgriffe passend zu Stoffen/Build im Deck (gewichtet), einer frei
function handgriffAngebot(r,rar,n){let pool=handgriffPool(rar);if(pool.length<n)pool=handgriffPool(null);if(!pool.length)return[];
 const b=buildArchetyp().id;const st=new Set(allActive().flatMap(it=>def(it).st));
 const passt=pool.filter(id=>{const H=HANDGRIFFE[id];return H.build===b||(H.stoffe||[]).some(k=>st.has(k));});
 const o=[];const a=r.sample(passt.length>=2?passt:pool,Math.min(2,n));o.push(...a);const rest=pool.filter(id=>!o.includes(id));o.push(...r.sample(rest,n-o.length));
 if(rar==='mix'){const sel=handgriffPool('selten').filter(id=>!o.includes(id));if(sel.length)o[o.length-1]=r.pick(sel);}return o.slice(0,n);}
function reliquienPool(){const p=Object.keys(ITEMS).filter(k=>rarOf(ITEMS[k])==='reliquie'&&!ITEMS[k].nodrop&&!ITEMS[k].bases);return p.length?p:rarePool();}
// Alle Items im Besitz (angelegt und Rucksack) mit Ort
function besitz(){const o=[];AREAS.forEach(a=>S.areas[a].forEach((it,i)=>{if(it)o.push({it,loc:a+':'+i,an:i<S.slots[a]});}));S.bag.forEach((it,i)=>{if(it)o.push({it,loc:'bag:'+i,an:false});});return o;}
function itemByUid(uid){const b=besitz().find(x=>x.it.uid===uid);return b?b.it:null;}
// Handgriff wählen (Belohnung, Krämer, Ereignis): danach ins Item ritzen
function takeHandgriff(id){if(!HANDGRIFFE[id])return;if(id===null){S.hgPicked=true;Bus.emit('changed');return;}S.hgPending=id;Bus.emit('changed');}
function skipHandgriff(){S.hgPicked=true;S.hgPending=null;const g=(BAL.belohnung&&BAL.belohnung.ueberspringen_gold)||10;S.gold+=g;S.stats.gold+=g;Bus.emit('gold',{v:g,why:'Handgriff übersprungen'});Bus.emit('changed');}
// Ritzen: in Item uid, optional Kerbe k überschreiben (wenn voll). Gibt true zurück, wenn es geklappt hat.
function placeHandgriff(uid,k){const id=S.hgPending;const it=itemByUid(uid);if(!id||!it)return false;const hg=hgVon(it);const cap=kerbenVon(it);
 if(k==null){if(hg.length>=cap){Bus.emit('bad',{a:'KERBE VOLL',b:'Wähle einen Handgriff zum Überschreiben oder ein anderes Item.'});return false;}hg.push(id);}
 else{if((def(it).fest_hg||[]).includes(hg[k])){Bus.emit('bad',{a:'FEST EINGERITZT',b:'Dieser Handgriff lässt sich nicht lösen.'});return false;}const alt=hg[k];hg[k]=id;if(it.schliff)delete it.schliff['h'+k];log(`${HANDGRIFFE[alt]?HANDGRIFFE[alt].n:alt} überschrieben`);}
 S.hgPending=null;S.hgPicked=true;S.stats.handgriffe=(S.stats.handgriffe||0)+1;
 Bus.emit('handgriff',{id,it,why:`${HANDGRIFFE[id].n} in ${def(it).n} geritzt: wird ${def(it).st.map(x=>ST[x].n).join(' + ')||'stofflos'}`});
 if(S.pending&&S.pending[0]&&S.pending[0].hg){S.pending.shift();afterEventFx();return true;}
 if(S.phase==='kraemer_hg')S.phase='kraemer';Bus.emit('changed');return true;}
function hgVerwerfen(){if(S.phase==='event_hg'){S.hgPending=null;S.pending.shift();afterEventFx();return;}if(S.phase==='kraemer_hg'){S.hgPending=null;S.phase='kraemer';Bus.emit('changed');return;}skipHandgriff();}
// Werkstatt/Ereignis: Kerbe dazu (höchstens 3)
function kerbeDazu(uid){const it=itemByUid(uid);if(!it)return false;if(kerbenVon(it)>=3){Bus.emit('bad',{a:'HÖCHSTENS 3 KERBEN',b:''});return false;}it.kerbenPlus=(it.kerbenPlus||0)+1;Bus.emit('kerbe',{it,why:`${def(it).n} bekommt eine Kerbe (jetzt ${kerbenVon(it)})`});wahlFertig();return true;}
// Schleifen: eine Karte kostet dauerhaft 1 weniger (je Karte einmal). key = 's<ci>' (Stammkarte) oder 'h<k>' (Handgriff)
function schleifen(uid,key){const it=itemByUid(uid);if(!it)return false;it.schliff=it.schliff||{};if(it.schliff[key]){Bus.emit('bad',{a:'SCHON GESCHLIFFEN',b:''});return false;}it.schliff[key]=true;Bus.emit('schliff',{it,key,why:`${def(it).n}: Karte geschliffen, kostet dauerhaft 1 weniger`});wahlFertig();return true;}
// Umritzen: Handgriff k aus Item a in Item b
function umritzen(uidA,k,uidB){const a=itemByUid(uidA),b=itemByUid(uidB);if(!a||!b||a===b)return false;const id=hgVon(a)[k];if(!id)return false;if((def(a).fest_hg||[]).includes(id)){Bus.emit('bad',{a:'FEST EINGERITZT',b:''});return false;}
 if(hgVon(b).length>=kerbenVon(b)){Bus.emit('bad',{a:'KERBE VOLL',b:''});return false;}hgVon(a).splice(k,1);hgVon(b).push(id);if(a.schliff)delete a.schliff['h'+k];
 Bus.emit('umritzen',{why:`${HANDGRIFFE[id].n} von ${def(a).n} nach ${def(b).n} umgeritzt`});wahlFertig();return true;}
// Wahl-Modus (Schleifen, Kerbe, Umritzen) aus Rast, Werkstatt oder Ereignis
function wahlStart(art,quelle){S.wahl={art,quelle,phase:S.phase};S.phase='wahl';Bus.emit('changed');}
function wahlFertig(){const w=S.wahl;if(!w){Bus.emit('changed');return;}S.wahl=null;S.phase=w.phase;
 if(w.quelle==='rast')S.rastDone=true;if(w.quelle==='werkstatt')S.forged=true;
 if(w.quelle==='event'){S.pending.shift();afterEventFx();return;}Bus.emit('changed');}
function wahlAbbrechen(){const w=S.wahl;if(!w)return;S.wahl=null;S.phase=w.phase;if(w.quelle==='event'){S.pending.shift();afterEventFx();return;}Bus.emit('changed');}
// Krämer: Item verkaufen (40 % des Preises), Handgriff kaufen, Handgriff entfernen
function preisVon(D){return D.preis||({gewoehnlich:30,selten:55,reliquie:130})[rarOf(D)];}
function verkaufen(loc){if(!S.shop)return;const it=getAt(loc);if(!it)return;const v=Math.floor(preisVon(def(it))*((BAL.shop&&BAL.shop.verkauf_anteil)||.4));setAt(loc,null);S.gold+=v;S.stats.gold+=v;
 Bus.emit('gold',{v,why:`${def(it).n} verkauft für ${v} Gold (40 %)`});Bus.emit('toast',{a:'VERKAUFT',b:`${def(it).n} · +${v} Gold`});after();}
function kaufeHandgriff(i){const o=S.shop&&S.shop.hg&&S.shop.hg[i];if(!o||o.sold)return;if(S.gold<o.price){Bus.emit('bad',{a:'ZU WENIG GOLD',b:`Du brauchst ${o.price}.`});return;}
 S.gold-=o.price;S.stats.goldAus=(S.stats.goldAus||0)+o.price;o.sold=true;S.hgPending=o.id;S.phase='kraemer_hg';Bus.emit('changed');}
function entferneHandgriff(uid,k){const it=itemByUid(uid);const p=(BAL.shop&&BAL.shop.hg_entfernen)||25;if(!it||!hgVon(it)[k])return;if((def(it).fest_hg||[]).includes(hgVon(it)[k])){Bus.emit('bad',{a:'FEST EINGERITZT',b:''});return;}
 if(S.gold<p){Bus.emit('bad',{a:'ZU WENIG GOLD',b:''});return;}S.gold-=p;S.stats.goldAus=(S.stats.goldAus||0)+p;const id=hgVon(it).splice(k,1)[0];Bus.emit('toast',{a:'ENTFERNT',b:HANDGRIFFE[id].n});after();}
