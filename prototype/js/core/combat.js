// Kampf: Gegner aufstellen, Züge, Karten spielen, Gegnerzug. Meldet alles über den Bus, jeweils mit Grund (why).
// Läuft im FAST-Modus (Autospieler, Vorschau) ohne Wartezeiten synchron durch.

// Deck aus den angelegten Items (Auftrag 2): Stammkarten × card_copies plus je Kerbe ein Handgriff mit den Stoffen des Items
// (kartenVon in state.js). Gestrichene Items (it.x) geben nur noch ihre Handgriffe.
function buildDeck(){return rs('kampf').shuffle(deckListe());}

// Gegner aus foes.json erzeugen, skaliert nach Tiefe
function mkEnemy(id,i){const f0=FOES[id];if(!f0)throw new Error('Unbekannter Gegner '+id);const f=f0.vorgaenger?vorgaengerDef(f0):f0;const d=S.depth;
 const st=S.stufe||0,ST2=RUN.stufen||{hp_je_stufe:0,atk_alle_n_stufen:99};
 // Wächter und Boss sind je Akt eigens ausgelegt und skalieren nicht mit der Tiefe, nur mit der Schwierigkeitsstufe
 const tief=(f.rang||'normal')==='normal'&&!f.ohne_tiefe;const sc=(tief?1+BAL.enemy_scaling.hp_per_depth*(d-1):1)*(1+ST2.hp_je_stufe*st),as=(tief?Math.floor((d-1)/BAL.enemy_scaling.atk_every_n_depths):0)+(st>=2?Math.floor(st/ST2.atk_alle_n_stufen):0);const hp=Math.round(f.hp*sc*(tief?(BAL.enemy_scaling.hp_faktor||1):(BAL.enemy_scaling.waechter_faktor||1)));
 const r=rs('kampf');
 return{uid:++uidc,id,n:f.n,spr:f.spr||f.sprite||id,variant:f.variant,sprite:f.rang==='boss'?(f.sprite||null):f.varianten?r.pick(f.varianten):(f.sprite||null),rang:f.rang||'normal',weak:f.weak,hp,max:hp,block:0,str:0,burn:0,poison:0,weak2:0,
  pi:f.rang==='boss'||f.rang==='waechter'?0:Math.floor(r.next()*f.pat.length),as,pat:f.pat.map(p=>({...p,v:p.t==='atk'?Math.max(1,Math.round(p.v*(BAL.enemy_scaling.atk_faktor||1)))+as:p.v})),besonders:f.besonders||null,kniff:f.kniff||null,kniffe:f.kniffe||null,pendel:!!f.pendel,vuln:0,phase:0,turns:0,stumm:!!f.stumm,...kniffMuster(f,as)};}
// „Der, der vor dir kam“ (Ufer unten): Figur und Items deines letzten verlorenen Runs (Meta), sonst eine Figur per Seed.
// Sein Muster sind seine besten Karten, verstärkt (f.atk_faktor); die Beute ist eines seiner Items.
function vorgaengerDef(f){const r=rs('kampf');let v=typeof Meta!=='undefined'&&!S.dev?Meta.get().vorgaenger:null;
 if(!v||!JOBS.find(j=>j.id===v.job)){const j=r.pick(JOBS.filter(j=>j.id!==S.job));
  // ohne gespeicherten Run: Startitems einer anderen Figur plus je ein Fund aus den Fundpools der Akte davor (per Seed), damit er so stark ist wie ein echter Vorgänger
  const funde=(S.route||[]).slice(0,S.akt).map(b=>BIOMES[b]&&(BIOMES[b].fundpool||[]).filter(id=>ITEMS[id]&&!ITEMS[id].bases)).filter(p=>p&&p.length).map(p=>r.pick(p));
  v={job:j.id,items:[...(j.w||[]),...(j.k||[]),...(j.t||[]),...funde]};}
 const job=JOBS.find(j=>j.id===v.job);const ids=(v.items||[]).filter(id=>ITEMS[id]);const cards=ids.flatMap(id=>ITEMS[id].cards||[]);
 const F=f.atk_faktor||1.6;const atk=cards.filter(c=>c.atk).sort((a,b)=>b.atk*(b.h||1)-a.atk*(a.h||1)).slice(0,3).map(c=>({t:'atk',v:Math.round(c.atk*F),...(c.h>1?{h:c.h}:{}),karte:c.n}));
 const blk=cards.filter(c=>c.blk&&!c.atk).sort((a,b)=>b.blk-a.blk).slice(0,1).map(c=>({t:'blk',v:Math.round(c.blk*F),karte:c.n}));
 const pat=[...atk,...blk];if(atk.length<2)pat.push(...f.pat.filter(p=>p.t!=='blk'||!blk.length));
 const st={};ids.forEach(id=>(ITEMS[id].st||[]).forEach(k=>st[k]=(st[k]||0)+1));const alle=Object.keys(ST);const weak=alle.filter(k=>!st[k]).sort()[0]||f.weak;
 if(ids.length)S.sicheresBeute=r.pick(ids);
 return{...f,n:`${f.n} (${job?job.n:'?'})`,pat,weak,vorgaengerJob:v.job};}
// Kniff „ansage“: lädt n Züge (Absicht „lädt“), dann ein großer Schlag
function kniffMuster(f,as){const k=f.kniff;if(!k||k.art!=='ansage')return{};const p=[];for(let i=0;i<(k.zuege||2);i++)p.push({t:'laedt',v:0});p.push({t:'atk',v:Math.round((k.v||20)*(BAL.enemy_scaling.atk_faktor||1))+as});return{pat:p,pi:0};}
// Aufstellung: drei Tiefenreihen (0 hinten, 1 mitte, 2 vorne), per Seed mit etwas Zufall, Wächter/Boss vorne mittig
function aufstellen(list){const r=rs('aufstellung');const n=list.length;
 const xs=n===1?[.5]:n===2?[.36,.64]:n===3?[.22,.5,.78]:[.14,.38,.62,.86];
 const reihen=n===1?[2]:r.shuffle(n===2?[1,2]:n===3?[0,1,2]:[0,1,1,2]);
 list.forEach((e,i)=>{e.x=xs[i]+(r.next()-.5)*.06;e.reihe=e.rang==='normal'?reihen[i]:2;});
 if(list.some(e=>e.rang!=='normal')){const big=list.find(e=>e.rang!=='normal');big.x=.5;const others=list.filter(e=>e!==big);others.forEach((e,i)=>{e.x=others.length===1?.2:[.16,.84,.3,.7][i];e.reihe=r.pick([0,1]);});}
 // Auftrag 3 M2: Wunsch-Stellplatz (data/stell.json, Platz 0 = vorn Mitte, 1/2 = links/rechts, 3/4 = hinten); nur Anzeige, buehne.js vergibt
 const big=list.find(e=>e.rang!=='normal');const rest=list.filter(e=>e!==big);if(big)big.platzWunsch=0;
 const plan=big?[1,2,3,4]:n===1?[0]:n===2?[1,2]:[0,1,2,3,4];rest.forEach((e,i)=>{e.platzWunsch=plan[i]??null;e.platz=null;});if(big)big.platz=null;}

function startFight(ids,art='kampf'){
 S.enemies=ids.map((id,i)=>mkEnemy(id,i));aufstellen(S.enemies);if(typeof Hoeren!=='undefined')Hoeren.begrenzen(S.enemies); // M6: höchstens ein stummer Gegner
 S.kampfArt=art;S.target=0;S.phase='fight';S.chainLog=[];S.pstr=passive('start_staerke').reduce((s,p)=>s+(p.v||1),0);S.vorrat=0;S.blockVorher=0;S.frost=null;S.turnNo=0;S.draw=buildDeck();S.hand=[];S.discard=[];S.exhaust=[];S.ward=0;S.compassUsed=false;S.kampfLog=[];S.faehrgeld=false;S.ballastWeg=0;S.biegFolge=null;S.zuletztGespielt=null;S.vorzugLetzt=null;S.flutHand=0;S.zugSt=[];
 const pb=passive('start_block').reduce((s,p)=>s+p.v,0);
 log(`Tiefe ${S.depth}: ${S.enemies.map(e=>e.n).join(', ')}`);
 Bus.emit('fight_start',{art,ids,why:`${RUN.knoten[art==='schwer'?'kampf_schwer':art]?.n||art} auf Tiefe ${S.depth} (${biom().kurz}), Gegner aus dem Biom per Seed`});
 const vs=passive('verwundbar_start').reduce((s,p)=>s+(p.v||1),0);if(vs)S.enemies.forEach(e=>{e.vuln+=vs;});
 // Ballast-Reliquien (eigen.ballast_start): n unspielbare Karten in den Ziehstapel, bevor die erste Hand gezogen wird
 allActive().forEach(it=>{const e=def(it).eigen;if(e&&e.ballast_start)ballastMischen(e.ballast_start,'stapel',e.ballast_karte,def(it).n);});
 startTurn();if(pb){S.block+=pb;Bus.emit('player_block',{v:pb,why:'Eigenschaft: Block zu Kampfbeginn'});}
 passive('kampfstart_fx').forEach(p=>runFx(p.fx,{why:'Eigenschaft zu Kampfbeginn'}));}
// Energie je Zug: Grundwert, Reliquien mit Preis (energie_plus), Pfandschein (gold_energie: ab p.ab Gold), übrige Energie (energie_bleibt)
function energieJeZug(){return BAL.energy_per_turn+(S.energiePlus||0)+passive('energie_plus').reduce((s,p)=>s+(p.v||1),0)+passive('gold_energie').reduce((s,p)=>s+((S.gold||0)>=(p.ab||100)?(p.v||1):0),0);}

function drawCards(n){for(let i=0;i<n;i++){if(!S.draw.length){if(!S.discard.length)return;S.draw=Bieg.mischen(S.discard);S.discard=[];}const c=S.draw.pop();c.zurueck=false;S.hand.push(c);S.gezogen=(S.gezogen||0)+1;
 // Eigenschaft ballast_ziehen (Strandbuch): eine unspielbare Karte gezogen → eine nach und Block, höchstens 4-mal je Zug
 if(c.unspielbar&&S.phase==='fight'){const bz=passive('ballast_ziehen');if(bz.length&&(S.bzZug||0)<4){S.bzZug=(S.bzZug||0)+1;n+=bz.reduce((s,p)=>s+(p.v||1),0);const b=bz.reduce((s,p)=>s+(p.blk||0),0);if(b)addBlock(b,`Strandbuch: „${c.n}“ gezogen, ${b} Block und eine Karte nach`);}}}}
function handSize(){return Math.max(BAL.hand_size,...bonuses('hand_size').map(b=>b.amount))+passive('hand_plus').reduce((s,p)=>s+(p.v||1),0)-passive('energie_plus').filter(p=>p.preis==='hand').length;}
function startTurn(){S.nachGegnerzug=false;(S.enemies||[]).forEach(e=>{e.gehandelt=false;});S.rxZug=passive('kette_start').reduce((s,p)=>s+(p.v||1),0);S.bzZug=0;S.joker=null;S.vorherKarte=null;if(S.stats&&!DRY)S.stats.zuege=(S.stats.zuege||0)+1;
 // Block: verfällt, außer Bannkreis (ward) und Eigenschaft block_haelt_halb
 const halb=passive('block_haelt_halb').length?Math.floor((S.block||0)/2):0;S.block=S.ward+halb;S.ward=0;
 const gbk=goldStufe('gold_block');if(gbk){S.block+=gbk;Bus.emit('player_block',{v:gbk,why:`Opferstock: ${gbk} Block für ${S.gold} Gold im Beutel`});}
 const bleibt=Math.min(S.vorrat||0,passive('energie_bleibt').reduce((s,p)=>s+(p.v||1),0));S.energy=energieJeZug()+bleibt;S.vorrat=0;
 S.last=[];S.played=0;S.hochUsed=new Set();S.hochZahl=0;S.turnNo=(S.turnNo||0)+1;
 Bieg.zugStart(); // Regelbiegung: Zugbuchhaltung, Ringofen setzt S.last auf die letzte Karte des Vorzugs
 Bieg.ziehen(); // normal: drawCards(handSize()); Rückwärts gewachsen, Ebbe und Flut ändern es
 kniffeZugbeginn();panzerZugbeginn();ansagenZugbeginn();
 // Falsches Detail der Pforte: Im Finale kosten zufällige Karten diese Runde 1 weniger oder 1 mehr
 if(S.kampfArt==='finale'){const r=rs('pforte');S.hand.forEach(c=>{c.mod=0;if(r.chance(.35))c.mod=r.chance(.5)?-1:1;});const m=S.hand.filter(c=>c.mod);if(m.length)Bus.emit('pforte_mod',{why:`Die Regeln biegen sich: ${m.map(c=>c.n+(c.mod>0?' +1':' −1')).join(', ')}`});}
 Bus.emit('deal');Bus.emit('turn_start',{turn:S.turnNo,why:`Zug ${S.turnNo}: ${handSize()} Karten, ${S.energy} Energie`+(S.block?`, ${S.block} Block aus dem Bannkreis`:'')});Bus.emit('changed');}
function healP(v,why=''){const m=maxHp(),b=S.hp;S.hp=Math.min(m,S.hp+v);if(S.hp>b)Bus.emit('player_heal',{v:S.hp-b,why});}
function addBlock(v,why=''){S.block+=v;Bus.emit('player_block',{v,why});}
function addSlot(a){if(S.slots[a]<BAL.max_slots){S.slots[a]++;log(`Neuer Slot: ${AREA_N[a]}`);Bus.emit('slot',{a,why:'Ereignis'});}}
function tgt(){let e=S.enemies[S.target];if(!e||e.hp<=0){e=alive()[0];S.target=S.enemies.indexOf(e);}return e;}
// Schaden an einem Gegner. Block fängt zuerst. Gibt den echten Schaden zurück.
// opts.dot: Gift und Brand (wirken auch durch Unverwundbarkeit nicht, aber am Panzer vorbei). Fix 7 (Auftrag 3): unverw nur, solange ein Diener lebt.
function hit(e,dmg,k=1,col,why='',opts){if(!e||e.hp<=0)return 0;const dot=!!(opts&&opts.dot);if(unverwJetzt(e)){const pu=e.pat[e.pi%e.pat.length];Bus.emit('enemy_hit',{e,d:0,ab:0,col,why:`${e.n} ist diesen Zug unverwundbar${pu.why?' ('+pu.why+')':''}, solange ${dienerVon(e).map(o=>o.n).join(' und ')} lebt`});return 0;}let d=Math.max(0,Math.round(dmg));const brandVorher=e.burn;let ab=0;
 if(!dot&&e.panzer>0){const pz=Math.min(e.panzer,d);e.panzer-=pz;d-=pz;ab+=pz;if(pz)Bus.emit('panzer',{e,v:pz,rest:e.panzer,why:`Panzer von ${e.n} fängt ${pz} (noch ${e.panzer})`});}
 if(e.block>0){const b=Math.min(e.block,d);e.block-=b;d-=b;ab+=b;}
 e.hp=Math.max(0,e.hp-d);if(S.stats&&!DRY){S.stats.schadenRaus=(S.stats.schadenRaus||0)+d;if(d>(S.stats.maxTreffer||0))S.stats.maxTreffer=d;}Bus.emit('enemy_hit',{e,d,ab,col,why});
 if(e.hp<=0){log(`${e.n} fällt.`);Bus.emit('enemy_die',{e,why:`${e.n} hat kein Leben mehr`});nachTod(e,brandVorher);}
 else checkPhase(e);return d;}
// Was beim Tod eines Gegners passiert: Kniff „nachlass“, Eigenschaft brand_springt
function nachTod(e,brand){const k=e.kniff;
 if(e.wandert&&e.poison>0){const z=alive().sort((a,b)=>a.poison-b.poison)[0];if(z){z.poison+=e.poison;z.wandert=true;Bus.emit('enemy_status',{e:z,status:'poison',why:`Ansteckung: Gift ${e.poison} wandert von ${e.n} zu ${z.n}`});}}
 passive('gold_je_tod').forEach(p=>{const v=p.v||5;S.gold+=v;if(S.stats&&!DRY)S.stats.gold=(S.stats.gold||0)+v;Bus.emit('gold',{v,why:`Lohntüte: ${e.n} fällt, +${v} Gold`});});
 if(brand>0&&passive('brand_springt').length){alive().forEach(o=>{o.burn+=brand;Bus.emit('enemy_status',{e:o,status:'burn',why:`Brand springt über: ${e.n} stirbt mit Brand ${brand}`});});}
 if(!k||k.art!=='nachlass')return;
 if(k.was==='explodiert'){const v=k.v||5;const ab=Math.min(S.block,v);S.block-=ab;S.hp=Math.max(1,S.hp-(v-ab));Bus.emit('player_hurt',{v:v-ab,e,why:`${e.n} zerplatzt (Nachlass): ${v} Schaden, Block fängt ${ab}`});}
 if(k.was==='teilt'&&FOES[k.gegner||e.id]){for(let n=0;n<2&&S.enemies.filter(x=>x.hp>0).length<4;n++){const a=mkEnemy(k.gegner||e.id);a.hp=a.max=Math.max(4,Math.round(a.max/2));a.kniff=null;a.x=Math.min(.9,Math.max(.1,e.x+(n?.12:-.12)));a.reihe=e.reihe;if(typeof Hoeren!=='undefined')Hoeren.begrenzen([a]);S.enemies.push(a);Bus.emit('enemy_spawn',{e:a,why:`${e.n} teilt sich (Nachlass)`});}}
 if(k.was==='item'&&FOES[e.id].beute){S.sicheresBeute=FOES[e.id].beute;Bus.emit('toast',{a:'NACHLASS',b:`${e.n} hinterlässt etwas`});}}
// Boss-Phasen (foes.json → besonders.art = phasen)
function checkPhase(e){const b=e.besonders;if(!b||b.art!=='phasen')return;const q=e.hp/e.max;const want=b.bei.filter(x=>q<=x).length;if(want>e.phase){e.phase=want;const m=b.muster&&b.muster[want-1];if(m){e.pat=m.map(p=>({...p,v:p.t==='atk'?p.v+e.as:p.v}));e.pi=0;}
 const sp=b.sprites&&b.sprites[want-1],sw=(b.schwach||b.weak)&&(b.schwach||b.weak)[want-1];if(sp)e.sprite=sp;if(sw)e.weak=sw;
 Bus.emit('boss_phase',{e,phase:want,why:`${e.n} fällt unter ${Math.round(b.bei[want-1]*100)} % Leben: Phase ${want+1}`});}}
function checkVictory(delay=900){if(DRY)return;if(!alive().length&&!busy&&S.phase==='fight'){busy=true;wait(delay,()=>{busy=false;fightWon();});}}

// Was würde Karte i jetzt anrichten? Spielt sie auf einer Kopie des Zustands durch, ohne Ereignisse und ohne Zeitverzögerung.
// Gibt je Gegner {d (Lebensverlust), ab (verlorener Block)} und für den Spieler {block, heal, self} zurück. Gleiche Rechnung wie das echte Spielen.
function previewCard(i,ei){const keep=S,kb=busy,kf=FAST,ku=uidc;let out=null;
 try{S=structuredClone(S);busy=false;FAST=true;DRY=true;Bus.muted=true;
  const before=S.enemies.map(e=>({hp:e.hp,block:e.block,poison:e.poison,burn:e.burn,vuln:e.vuln||0,weak2:e.weak2}));const p0={hp:S.hp,block:S.block,en:S.energy,str:S.pstr||0,gold:S.gold||0};S.gezogen=0;
  playCard(i,ei);
  out={foes:S.enemies.map((e,k)=>({d:before[k]?before[k].hp-e.hp:0,ab:before[k]?Math.max(0,before[k].block-e.block):0,kill:!!before[k]&&before[k].hp>0&&e.hp<=0,gift:before[k]?e.poison-before[k].poison:0,brand:before[k]?e.burn-before[k].burn:0,vuln:before[k]?(e.vuln||0)-before[k].vuln:0,weak:before[k]?!!e.weak2&&!before[k].weak2:false,hp:e.hp})),block:S.block-p0.block,hp:S.hp-p0.hp,energy:S.energy-p0.en,str:(S.pstr||0)-p0.str,gold:(S.gold||0)-p0.gold,draw:S.gezogen||0,rx:S.chainLog.length?S.chainLog[S.chainLog.length-1].rx:[]};
 }catch(err){console.warn('Vorschau',err);}
 finally{S=keep;busy=kb;FAST=kf;DRY=false;Bus.muted=false;uidc=ku;}return out;}

function playCard(i,ei){
 if(S.phase!=='fight'||busy)return false;const c=S.hand[i];if(!c)return false;const cost=cardCost(c);
 // Ballaststein (ballast_werfen): unspielbare Karten gehen für 0 über Bord und lösen die fx der Eigenschaft aus. Kein Stoff, keine Reaktion, zählt nicht als gespielte Karte.
 if(werfbar(c)){if(ei!=null&&S.enemies[ei]&&S.enemies[ei].hp>0)S.target=ei;ueberBord(c,'geworfen');passive('ballast_werfen').forEach(p=>runFx(p.fx,{tg:tgt(),why:`Ballaststein: „${c.n}“ über Bord`}));Bus.emit('changed');checkVictory();return true;}
 if(c.unspielbar||c.frost){Bus.emit('bad',{a:'UNSPIELBAR',b:c.frost?'Eingefroren für diesen Zug':c.n});return false;}
 if(S.energy<cost){Bus.emit('no_energy');Bus.emit('changed');return false;}
 if(ei!=null&&S.enemies[ei]&&S.enemies[ei].hp>0)S.target=ei;
 const first=S.played===0;if(first&&S.turnNo===1&&passive('erste_karte_billiger').length)S.compassUsed=true;
 const zoll=c.zoll&&S.gold>=c.zoll?c.zoll:0; // Zoll: zahlt Gold statt Energie
 const xMal=c.x?S.energy:0;S.energy-=cost;S.hand.splice(i,1);if(c.verbraucht)S.exhaust.push(c);else Bieg.ablegen(c);S.played++;
 if(c.opfer){zahleLeben(c.opfer,`${c.n}: Opfer ${c.opfer} statt Energie`);}
 if(zoll){S.gold-=zoll;if(S.stats&&!DRY)S.stats.zoll=(S.stats.zoll||0)+zoll;Bus.emit('gold',{v:-zoll,why:`${c.n}: Zoll ${zoll} Gold statt Energie`});}
 const e=tgt();const vorher=S.joker?[...new Set([...S.last,...S.joker])]:S.last;const rx=reactionsFor(vorher,c.st);const ctx={tg:e,card:c};
 const fk=Bieg.funkspruch(cost);if(fk){rx.push(fk);S.funkZug=true;}
 Bus.emit('card_played',{c,e,why:`${c.n} (${c.src}) gespielt, kostet ${cost}`+(c.st.length?`, Stoff ${c.st.map(k=>ST[k].n).join(' + ')}`:', ohne Stoff')});
 let mult=1;const multWhy=[];rx.forEach(r=>{if(r.pre&&r.pre.mult){mult*=r.pre.mult;multWhy.push(`${r.n} ×${r.pre.mult}`);}});
 if(first&&jobFaehigkeit()==='erste_doppelt'){mult*=1.5;multWhy.push('Kriegsveteran: erste Karte ×1,5');}
 bonuses('every_nth_mult').forEach(b=>{if(S.played%b.n===0){mult*=b.mult;multWhy.push(`Kneipenschläger ×${b.mult}`);Bus.emit('toast',{a:'KNEIPENSCHLÄGER',b:`Karte ${b.n}: doppelt`});}});
 const flat=bonuses('stoff_flat').filter(b=>c.st.includes(b.stoff)).reduce((s,b)=>s+b.amount,0);
 const rep=rx.find(r=>r.pre&&r.pre.repeat);const reps=rep?rep.pre.repeat:1;
 if(rep){S.hp=Math.max(1,S.hp-rep.pre.self_damage);Bus.emit('self_damage',{v:rep.pre.self_damage,why:`${rep.n}: du zahlst ${rep.pre.self_damage} Leben, die Karte wirkt ${reps}-mal`});}
 // Eröffnung: Bonus, wenn die Karte als erste im Zug kommt
 const card=first&&c.eroeffnung?{...c,...Object.fromEntries(Object.entries(c.eroeffnung).map(([k,v])=>[k,(typeof v==='number'?(c[k]||0)+v:v)]))}:c;
 if(card!==c)Bus.emit('toast',{a:'ERÖFFNUNG',b:c.n});
 // Kette: +n Wirkung je Reaktion, die in diesem Zug schon ausgelöst wurde
 const ketteBonus=card.kette?card.kette*(S.rxZug||0):0;if(ketteBonus)multWhy.push(`Kette +${ketteBonus}`);
 const mal=card.x?xMal+((card.sonder&&card.sonder.art==='x_plus')?(card.sonder.v||1):0):1;if(card.x)multWhy.push(`X = ${xMal}`);
 for(let r=0;r<reps;r++)for(let m=0;m<mal;m++)applyMain(card,ctx,mult,flat,multWhy,ketteBonus);
 bonuses('stoff_block').forEach(b=>{if(c.st.includes(b.stoff))addBlock(b.amount,`Set Pfarrerin: Karte mit ${ST[b.stoff].n} gibt ${b.amount} Block`);});
 const prevSt=[...vorher];S.chainLog.push({turn:S.turnNo,n:c.n,st:[...c.st],prev:prevSt,rx:rx.map(r=>whyRx(r,prevSt,c.st))});
 let k=0;for(const r of rx){k++;if(r.s){S.hochZahl=(S.hochZahl||0)+1;if(!passive('hoch_zweimal').length||S.hochZahl>=2)S.hochUsed.add(r.n);}
  passive('reaktion_schaden').forEach(p=>{const z=alive();if(z.length)hit(rs('kampf').pick(z),p.v||2,1,null,'Eigenschaft: Reaktion trifft');});
  passive('reaktion_block').forEach(p=>addBlock(p.v||1,`Eigenschaft: Reaktion gibt ${p.v||1} Block`));passive('reaktion_heil').forEach(p=>healP(p.v||1,`Eigenschaft: Reaktion heilt ${p.v||1}`));
  const live=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];const w=S.chainLog[S.chainLog.length-1].rx.find(x=>x.n===r.n);
  const why=`${r.n} ausgelöst: ${w?w.src:''}`+(r===VERST?' (gleicher Stoff)':r.s?` (Hochreaktion ${[...r.s].join('')})`:r.biegung?` (Regelbiegung ${(Bieg.def(r.biegung)||{}).n||r.biegung})`:` (Paar ${r.k} aus reactions.json)`);
  if(r.fx)runFx(r.fx,{tg:live,why});
  const isNew=!S.disc.has(r.n);if(r.k||r.s||r===VERST)S.disc.add(r.n);log(isNew?`Reaktion entdeckt: ${r.n}`:`Reaktion: ${r.n}`);
  Bus.emit('reaction',{r,k,isNew,keys:w?w.keys:c.st,live,hoch:!!r.s,why});}
 S.rxZug=(S.rxZug||0)+rx.length;if(!DRY&&S.stats&&S.rxZug>(S.stats.maxKette||0))S.stats.maxKette=S.rxZug;if(!DRY&&S.stats)S.stats.reaktionen=(S.stats.reaktionen||0)+rx.length;
 // Gegenlauf: merkt sich die Stoffe der Karte davor für die nächste Karte
 S.joker=S.jokerNaechste?prevSt:null;S.jokerNaechste=false;S.vorherKarte=c.sonder&&c.sonder.art==='wiederholen'?S.vorherKarte:c;
 Bieg.nachKarte(c,cost); // setzt S.last (normal: die Stoffe dieser Karte; Falsche Winkel, Der Schlag ändern es)
 Bieg.nachReaktion(c,rx); // Keiner fährt ab
 Bus.emit('changed');checkVictory();return true;}

function applyMain(c,ctx,mult,flat,multWhy=[],kette=0){
 const col=c.st[0]||null;
 const t0=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];
 if(c.strip&&t0){t0.block=0;Bus.emit('enemy_status',{e:t0,status:'block_weg',why:`${c.n}: Block von ${t0.n} zerbricht`});} // vor dem Schaden
 if(c.self){zahleLeben(c.self,`${c.n} kostet ${c.self} Leben`);}
 if(c.vuln&&t0){t0.vuln=(t0.vuln||0)+c.vuln;Bus.emit('enemy_status',{e:t0,status:'vuln',why:`${c.n}: ${t0.n} verwundbar ${c.vuln} Züge (+50 % Schaden)`});}
 const sb=c.sonder&&(c.sonder.art==='schaden_gleich_block'||c.sonder.art==='ueber_bord'&&c.sonder.je);const atk=c.atk||sb?(c.atk||0)+(c.atk?kette:0)+sonderAtk(c,t0):0;
 if(atk){let hits=c.h||1;if(hits>1&&passive('mehrfach_plus1').length){hits++;multWhy=[...multWhy,'Patronengurt: ein Treffer mehr'];}
  for(let h=0;h<hits;h++){const targets=c.all?alive():[ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0]];
   const go=()=>targets.forEach(en=>{if(!en||en.hp<=0)return;const pstr=S.pstr||0,gb=goldStufe('gold_schaden');let d=(atk+flat+pstr+gb)*mult;const parts=[`${c.n} ${c.atk||atk}`];if(kette)parts.push(`Kette +${kette}`);if(gb)parts.push(`Klingelbeutel +${gb} (${S.gold} Gold)`);if(flat)parts.push(`Fischer-Bonus +${flat}`);if(pstr)parts.push(`Stärke +${pstr}`);if(mult!==1)parts.push(multWhy.join(', ')||`×${mult}`);
     if(en.weak&&c.st.includes(en.weak)){d*=1.5;parts.push(`Schwachstelle ${ST[en.weak].n} ×1,5`);Bus.emit('weakspot',{e:en});}
     else if(en.weak)parts.push(`keine Schwachstelle (${en.n} ist schwach gegen ${ST[en.weak].n})`);
     if(en.vuln>0){d*=1.5;parts.push('verwundbar ×1,5');}
     Bus.emit('slash',{e:en,col});const blk=en.block;const real=hit(en,d,h+1,col,'');
     Bus.emit('damage_calc',{e:en,roh:Math.round(d),block:Math.min(blk,Math.round(d)),d:real,parts,why:`${real} Schaden an ${en.n}: ${parts.join('; ')}`+(blk?`; Block ${Math.min(blk,Math.round(d))}`:'')+` = ${real}`});
     if(c.sonder&&c.sonder.art==='lebensraub'&&real>0)healP(Math.floor(real*(c.sonder.anteil||.5)),`${c.n}: Lebensraub`);
     kniffBeimTreffer(en);});
   if(h===0)go();else wait(h*((BAL.wucht&&BAL.wucht.mehrfach_abstand_ms)||120),()=>{go();Bus.emit('attack',{k:S.played+h});Bus.emit('changed');checkVictory();});}
  Bus.emit('attack',{k:S.played});}
 const blkW=c.blk?c.blk+(c.atk?0:kette):0;
 if(blkW)addBlock(Math.round((blkW+flat)*mult),`${c.n}: ${c.blk}${kette&&!c.atk?' +'+kette+' Kette':''}${flat?' +'+flat:''}${mult!==1?' ×'+mult:''} Block`);
 if(c.heal)healP(Math.round(c.heal*mult),`${c.n} heilt`);
 // Fix 6 (Auftrag 3): der Reaktionsfaktor wirkt auch auf Stärke, Ziehen und Gold (gleiche Rundung), nicht auf Energie
 if(c.str){const sv=verstaerkt(c.str,mult);S.pstr=(S.pstr||0)+sv;Bus.emit('player_buff',{v:sv,why:`${c.n}: Stärke +${sv}${sv!==c.str?' (×'+mult+')':''} (jetzt ${S.pstr}) bis Kampfende`});}
 const t=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];
 if(c.poison&&t){const reinH=t.kniff&&t.kniff.art==='rein';if(reinH)Bus.emit('enemy_status',{e:t,status:'rein',why:`${t.n} ist rein: Gift wirkt nur halb`});{const g=reinH?Math.floor(c.poison*mult/2):Math.round(c.poison*mult);t.poison+=g;Bus.emit('enemy_status',{e:t,status:'poison',why:`${c.n}: Gift ${g}${reinH?' (halb, rein)':''}`});}}
 if(c.burn&&t){t.burn+=Math.round(c.burn*mult);Bus.emit('enemy_status',{e:t,status:'burn',why:`${c.n}: Brand ${Math.round(c.burn*mult)}`});}
 if(c.weak&&t){t.weak2=1;Bus.emit('enemy_status',{e:t,status:'weak',why:`${c.n}: ${t.n} geschwächt`});}
 if(c.sonder)sonderWirkung(c,t,mult);
 if(c.draw)drawCards(verstaerkt(c.draw,mult));
 if(c.en){S.energy+=c.en;Bus.emit('energy',{v:c.en,why:c.n});}
 if(c.gold){const gv=verstaerkt(c.gold,mult);S.gold+=gv;if(S.stats&&!DRY)S.stats.gold=(S.stats.gold||0)+gv;Bus.emit('gold',{v:gv,why:`${c.n}: +${gv} Gold${gv!==c.gold?' (×'+mult+')':''}`});}}
// Leben zahlen (Opfer, Karten mit self, Reaktion Opfer); Eigenschaft opfer_staerke gibt dafür Stärke
function zahleLeben(v,why){S.hp=Math.max(1,S.hp-v);Bus.emit('self_damage',{v,why});if(passive('opfer_staerke').length){S.pstr=(S.pstr||0)+1;Bus.emit('player_buff',{v:1,why:'Herz im Glas: Leben gezahlt, Stärke +1'});}}
// Sonderwirkungen der Handgriffe (docs/auftrag-2/handgriffe.md, 12 Arten)
function sonderAtk(c,t){const s=c.sonder;if(!s)return 0;
 if(s.art==='schaden_gleich_block')return Math.floor((S.block||0)*(s.anteil||1));
 if(s.art==='schaden_je_fehlleben')return Math.floor((maxHp()-S.hp)/(s.je||5));
 if(s.art==='ueber_bord'&&s.je)return s.je*Math.min(s.max||99,S.hand.filter(x=>x.unspielbar).length);
 return 0;}
function sonderWirkung(c,t,mult){const s=c.sonder;if(!s)return;const why=`${c.n}: Sonderwirkung`;
 if(s.art==='fx')runFx(s.fx,{tg:t,why:`${c.n}`});
 if(s.art==='brand_verdoppeln'){(s.alle?alive():t?[t]:[]).forEach(e=>{e.burn*=2;Bus.emit('enemy_status',{e,status:'burn',why:`${c.n}: Brand verdoppelt auf ${e.burn}`});});}
 if(s.art==='gift_verdoppeln'&&t){t.poison*=2;Bus.emit('enemy_status',{e:t,status:'poison',why:`${c.n}: Gift verdoppelt auf ${t.poison}`});}
 if(s.art==='block_verdoppeln'){const v=S.block;S.block*=2;Bus.emit('player_block',{v,why:`${c.n}: Block verdoppelt auf ${S.block}`});}
 if(s.art==='gift_wandert'&&t){t.wandert=true;Bus.emit('enemy_status',{e:t,status:'poison',why:`${c.n}: stirbt ${t.n}, wandert das Gift weiter`});}
 if(s.art==='stoff_joker'){S.jokerNaechste=true;Bus.emit('toast',{a:'GEGENLAUF',b:'Die nächste Karte reagiert auch mit der Karte davor'});}
 if(s.art==='ueber_bord'){const l=S.hand.filter(x=>x.unspielbar).slice(0,s.max||99);l.forEach(x=>ueberBord(x,c.n));if(s.draw&&l.length)drawCards(s.draw);}
 if(s.art==='wiederholen'&&S.vorherKarte&&!S.wiederholt){const v=S.vorherKarte;S.wiederholt=true;Bus.emit('toast',{a:'NOCH EINMAL',b:v.n});applyMain(v,{tg:t},1,0,[`${c.n}: wiederholt`]);S.wiederholt=false;}}

// ---------- Zugabe 4: Ballast und Kollekte (docs/auftrag-2/builds.md Abschnitt 10 und 11) ----------
// Ballast: unspielbare Karten (eigener Ballast, Abschriften und Störkarten der Gegner, Zittern) als Treibstoff
function ballastKarte(name,quelle){const n=name||'Ballast';return{n,c:0,unspielbar:true,ballast:true,st:[],src:quelle||n,spr:'bone',img:typeof itemBild==='function'?itemBild(({'Leere Seite':'leere_seiten','Strandgut':'strandbuch'})[n]||'ballaststein'):'',cid:'stoer'+(++uidc),verbraucht:true};}
// n Ballast-Karten in Ziehstapel (an zufällige Stelle per Seed), Hand oder Ablage
function ballastMischen(n,wohin,name,why){if(S.phase!=='fight')return;for(let i=0;i<n;i++){const k=ballastKarte(name,why);if(wohin==='hand')S.hand.push(k);else if(wohin==='ablage')S.discard.push(k);else S.draw.splice(rs('kampf').int(0,S.draw.length),0,k);}
 Bus.emit('ballast',{n,wohin,why:`${why?why+': ':''}${n}× „${name||'Ballast'}“ in ${wohin==='hand'?'die Hand':wohin==='ablage'?'den Ablagestapel':'den Ziehstapel'}`});}
// Lässt sich diese Karte über Bord werfen (Eigenschaft ballast_werfen)? Eingefrorene nicht.
function werfbar(c){return !!(c&&c.unspielbar&&!c.frost&&S.phase==='fight'&&passive('ballast_werfen').length);}
// Eine unspielbare Karte von der Hand über Bord: für den Rest des Kampfes weg; Radiermesser (ballast_staerke) gibt Stärke
function ueberBord(c,why){const i=S.hand.indexOf(c);if(i<0)return false;S.hand.splice(i,1);S.exhaust.push(c);S.ballastWeg=(S.ballastWeg||0)+1;if(S.stats&&!DRY)S.stats.ballast=(S.stats.ballast||0)+1;
 Bus.emit('ueber_bord',{c,why:`„${c.n}“ geht über Bord${why?' ('+why+')':''}`});
 passive('ballast_staerke').forEach(p=>{const v=p.v||1;S.pstr=(S.pstr||0)+v;Bus.emit('player_buff',{v,why:`Radiermesser: „${c.n}“ über Bord, Stärke +${v} (jetzt ${S.pstr})`});});return true;}
// Kollekte: Stufe einer Gold-Eigenschaft (gold_schaden, gold_block) = 1 je p.je Gold, höchstens p.max
function goldStufe(typ){return passive(typ).reduce((s,p)=>s+Math.min(p.max||5,Math.floor(Math.max(0,S.gold||0)/(p.je||25))),0);}
// Fährgeld: Würdest du sterben, zahlst du p.kosten Gold und stehst mit p.leben Leben wieder auf (einmal je Kampf). true = gerettet.
function faehrgeld(){if(S.hp>0||S.faehrgeld||S.phase!=='fight')return false;const p=passive('faehrgeld')[0];if(!p)return false;const preis=p.kosten||40;if((S.gold||0)<preis)return false;
 S.gold-=preis;S.faehrgeld=true;S.hp=Math.min(maxHp(),p.leben||8);if(S.stats&&!DRY)S.stats.faehrgeld=(S.stats.faehrgeld||0)+1;
 Bus.emit('gold',{v:-preis,why:`Fährgeld: ${preis} Gold für den Fährmann`});Bus.emit('player_heal',{v:S.hp,why:`Fährgeld: Der Fährmann nimmt ${preis} Gold und bringt dich mit ${S.hp} Leben zurück (einmal je Kampf)`});Bus.emit('toast',{a:'FÄHRGELD',b:`${preis} Gold · ${S.hp} Leben`});return true;}

// Kniffe der Gegner (paket-format.md): beim Treffer, zu Zugbeginn des Spielers, im Gegnerzug
function kniffBeimTreffer(en){const k=en.kniff;if(!k)return;
 if(k.art==='dornen'&&en.hp>0||k.art==='dornen'){const v=k.v||2;const ab=Math.min(S.block,v);S.block-=ab;S.hp=Math.max(0,S.hp-(v-ab));if(v-ab>0)S.stats.todesursache=en.n+' (Dornen)';Bus.emit(v-ab>0?'player_hurt':'player_blocked',{v:v-ab,e:en,why:`${en.n} hat Dornen: ${v} zurück, Block fängt ${ab}`});}}
// Zusätzliche Kniffe (Feld „kniffe“, z. B. beim Uhrmacher) wirken bei Zugbeginn und nach dem Gegnerzug mit
function kniffeVon(en){return [en.kniff,...(en.kniffe||[])].filter(Boolean);}
function kniffeZugbeginn(){for(const en of alive())for(const k of kniffeVon(en)){
 if(k.art==='einfrieren'&&S.hand.length){const c=rs('kampf').pick(S.hand);c.frost=true;Bus.emit('toast',{a:'EINGEFROREN',b:c.n});Bus.emit('kniff',{e:en,why:`${en.n} friert „${c.n}“ für diesen Zug ein`});}
 if(k.art==='teurer'){const z=S.hand.filter(c=>!c.unspielbar&&!c.teuer);if(z.length){const c=rs('kampf').pick(z);c.teuer=k.v||1;Bus.emit('toast',{a:'TEURER',b:c.n});Bus.emit('kniff',{e:en,why:`${en.n}: „${c.n}“ kostet diesen Zug ${k.v||1} mehr${k.why?' ('+k.why+')':''}`});}}
 if(k.art==='verstopfen'){for(let n=0;n<(k.n||1);n++)S.hand.push(stoerKarte(en,k));Bus.emit('kniff',{e:en,why:`${en.n} steckt ${k.n||1} unspielbare Karte(n) in deine Hand`});}}}
// Störkarte eines Gegners: Name und Bild aus dem auslösenden Kniff (k.karte, k.spr), sonst aus seinem Hauptkniff, sonst „Abschrift“ mit dem alten Knochen-Sprite
function stoerKarte(en,k){const sp=k&&k.spr||en.kniff&&en.kniff.spr||'';return{n:k&&k.karte||en.kniff&&en.kniff.karte||'Abschrift',c:0,unspielbar:true,st:[],src:en.n,spr:sp||'bone',img:stoerBild(sp),cid:'stoer'+(++uidc),verbraucht:true};}
// Bild-Schlüssel einer Störkarte: Item-ID mit Icon (assets/items/), Handgriff-ID mit Icon (assets/handgriffe/), sonst '' (dann zeigt die Karte das 12×12-Sprite spr aus js/sprites/items.js)
function stoerBild(sp){if(!sp)return'';if(ICONS.has(sp))return 'assets/items/'+sp+'.png';if(HG_ICONS.has(sp))return 'assets/handgriffe/'+sp+'.png';return'';}
// nach dem eigenen Zug eines Gegners
function kniffGegnerzug(en){for(const k of kniffeVon(en))kniffEiner(en,k);}
function kniffEiner(en,k){const why=k.why?` (${k.why})`:'';
 if(k.art==='waechst'){en.str+=k.v||2;Bus.emit('enemy_buff',{e:en,why:`${en.n} wächst: Stärke +${k.v||2}${why}`});}
 if(k.art==='schuetzer'){alive().filter(o=>o!==en).forEach(o=>{o.block+=k.v||4;Bus.emit('enemy_block',{e:o,why:`${en.n} schützt ${o.n}: +${k.v||4} Block`});});}
 if(k.art==='heiler'){const o=alive().filter(x=>x!==en&&x.hp<x.max).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(o){o.hp=Math.min(o.max,o.hp+(k.v||4));Bus.emit('enemy_heal',{e:o,why:`${en.n} heilt ${o.n} um ${k.v||4}`});}}
 if(k.art==='loeschen'){alive().forEach(o=>{if(o.burn){o.burn=0;Bus.emit('enemy_status',{e:o,status:'geloescht',why:`${en.n} löscht den Brand${why}`});}});}
 if(k.art==='abschrift'){for(let n=0;n<(k.n||1);n++)S.discard.push(stoerKarte(en,k));Bus.emit('kniff',{e:en,why:`${en.n} mischt ${k.n||1}× „${k.karte||(en.kniff&&en.kniff.karte)||"Abschrift"}“ in deinen Ablagestapel`});}
 const rufId=k.art==='ruf'?[].concat(k.gegner)[Math.floor(en.turns/(k.alle||3))%[].concat(k.gegner).length]:null;
 if(k.art==='ruf'&&FOES[rufId]&&en.turns%(k.alle||3)===2&&alive().length<4){const a=mkEnemy(rufId);a.gerufen=true;if(a.kniff&&a.kniff.art==='ruf')a.kniff=null;a.x=rs('aufstellung').pick([.16,.84,.3,.7]);a.reihe=rs('aufstellung').pick([0,1]);if(typeof Hoeren!=='undefined')Hoeren.begrenzen([a]);S.enemies.push(a);Bus.emit('enemy_spawn',{e:a,why:`${en.n} ruft ${a.n}`});}
 if(k.art==='kopie'){const c=S.vorherKarte;if(c&&!c.unspielbar){if(c.atk){gegnerTrifft(en,(c.atk+en.str)*(c.h||1),`${en.n} schreibt „${c.n}“ ab und spielt sie gegen dich`);}else if(c.blk){en.block+=c.blk;Bus.emit('enemy_block',{e:en,why:`${en.n} schreibt „${c.n}“ ab: +${c.blk} Block`});}
   Bus.emit('toast',{a:'ABGESCHRIEBEN',b:c.n});}
   if(k.n){for(let n=0;n<k.n;n++)S.discard.push(stoerKarte(en,k));Bus.emit('kniff',{e:en,why:`${en.n} mischt ${k.n}× „${k.karte||(en.kniff&&en.kniff.karte)||"Abschrift"}“ in deinen Ablagestapel`});}}
 if(k.art==='takt'){const v=k.v||6;if(en.turns%2===0){alive().forEach(o=>{o.block+=v;});en.schlag=true;Bus.emit('kniff',{e:en,why:`${en.n} schlägt: alle Gegner +${v} Block${why}`});Bus.emit('herzschlag',{e:en,klang:k.klang||'herz',why:`${en.n} schlägt im Takt (${k.klang==='glocke'?'Glockenschlag':'Herzschlag'})`});}
   else{en.schlag=false;en.vuln=Math.max(en.vuln||0,2);Bus.emit('enemy_status',{e:en,status:'vuln',why:`Zwischen den Schlägen: ${en.n} ist verwundbar (+50 % Schaden)`});}}
 if(k.art==='voraus'){const c=S.draw[S.draw.length-1]||S.discard[0];if(c&&!c.unspielbar){if(c.atk)gegnerTrifft(en,(c.atk+en.str)*(c.h||1),`${en.n} spielt deine nächste Karte „${c.n}“ vor dir`);else{const b=c.blk||5;en.block+=b;Bus.emit('enemy_block',{e:en,why:`${en.n} spielt deine nächste Karte „${c.n}“ vor dir: +${b} Block`});}Bus.emit('toast',{a:'VORAUS',b:c.n});}
   const zahl={};deckListe().forEach(x=>(x.st||[]).forEach(t=>{if(ST[t])zahl[t]=zahl[t]||0;}));(S.chainLog||[]).forEach(l=>l.st.forEach(t=>{if(t in zahl)zahl[t]++;}));
   const ks=Object.keys(zahl);if(ks.length){const min=Math.min(...ks.map(t=>zahl[t]));const w=ks.filter(t=>zahl[t]===min).sort()[0];if(en.weak!==w){en.weak=w;Bus.emit('enemy_status',{e:en,status:'schwach',why:`${en.n} ist schwach gegen den Stoff, den du am wenigsten spielst: ${ST[w].n}`});}}}
 if(k.art==='wechsel'&&k.stoffe){en.weak=k.stoffe[(en.turns+1)%k.stoffe.length];Bus.emit('enemy_status',{e:en,status:'schwach',why:`${en.n} wechselt die Schwachstelle: jetzt ${ST[en.weak].n}`});}}

// ---------- Ansagen für die Anzeige (Kern-Wünsche der Biom-Agenten) ----------
// Wen ruft dieser Gegner im kommenden Gegnerzug? Gleiche Bedingungen wie kniffEiner (Kniff ruf, vor dem Zählerschritt)
// und specials (besonders.ruft und phasen.ruft, nach dem Zählerschritt). Liste von Gegner-IDs, höchstens so viele, wie Platz ist.
function rufAnsage(e){if(!e||e.hp<=0)return[];const platz=4-alive().length;if(platz<=0)return[];const out=[],t=(e.turns||0)+1;
 for(const k of kniffeVon(e))if(k.art==='ruf'&&k.gegner!=null&&(e.turns||0)%(k.alle||3)===2){const l=[].concat(k.gegner);const id=l[Math.floor((e.turns||0)/(k.alle||3))%l.length];if(FOES[id])out.push(id);}
 const b=e.besonders;
 if(b&&b.art==='ruft'&&FOES[b.gegner]&&t%(b.alle||3)===0)out.push(b.gegner);
 if(b&&b.art==='phasen'&&b.ruft){const R2=typeof b.ruft==='string'?{gegner:b.ruft,alle:3,anzahl:1}:b.ruft;if(FOES[R2.gegner]&&e.phase>=1&&t%(R2.alle||3)===0)for(let k=0;k<(R2.anzahl||1);k++)out.push(R2.gegner);}
 return out.slice(0,platz);}
// Ist der Gegner in diesem Zug unverwundbar (Musterschritt mit unverw, so wie hit() es prüft)?
function unverwSchritt(e){const p=e&&e.pat&&e.pat.length?e.pat[e.pi%e.pat.length]:null;return !!(p&&p.unverw);}
// Diener: alle anderen lebenden Gegner (gerufen oder mitgebracht)
function dienerVon(e){return alive().filter(o=>o!==e);}
function unverwJetzt(e){return unverwSchritt(e)&&dienerVon(e).length>0;}
// Fix 7: Ist der Boss im unverw-Schritt allein, bekommt er zu deinem Zugbeginn Panzer (balance.json → panzer), der nur direkten Schaden fängt
function panzerZugbeginn(){const an=BAL.panzer?BAL.panzer.anteil??.4:.4;for(const e of alive()){e.panzer=0;if(an>0&&unverwSchritt(e)&&!dienerVon(e).length){e.panzer=Math.max(5,Math.round(e.max*an/5)*5);Bus.emit('panzer_an',{e,v:e.panzer,why:`${e.n} ist allein: Panzer ${e.panzer} statt Unverwundbarkeit (${Math.round(an*100)} % von ${e.max} Leben, auf 5 gerundet); Gift und Brand gehen durch`});}}}
// Zu Zugbeginn: Ansagen melden, die die Absicht zeigt (ruft, unverwundbar)
function ansagenZugbeginn(){for(const e of alive()){
 const r=rufAnsage(e);if(r.length)Bus.emit('ruf_ansage',{e,gegner:r,why:`${e.n} ruft im nächsten Gegnerzug ${r.map(id=>FOES[id].n).join(' und ')} (Absicht „ruft“)`});
 if(unverwJetzt(e)){const p=e.pat[e.pi%e.pat.length];Bus.emit('unverw_zug',{e,why:`${e.n} ist diesen Zug unverwundbar${p.why?' ('+p.why+')':''}; die Bühne zeigt es mit kühlem Rand`});}}}
// Phase der Wächter-Szene: höchste Boss-Phase der Wächter und Bosse im Kampf (0 = Anfang). buehne.js baut die Szene damit neu.
function szenenPhase(){if(S.phase!=='fight'&&S.phase!=='reward')return 0;return Math.max(0,...(S.enemies||[]).filter(e=>e.rang!=='normal').map(e=>e.phase||0));}

// Ein Gegner trifft dich außerhalb seines Musters (Kniffe kopie, voraus): Block fängt zuerst
function gegnerTrifft(en,v,why){let d=Math.max(0,Math.round(v));if(en.weak2)d=Math.floor(d/2);const ab=Math.min(S.block,d);S.block-=ab;d-=ab;S.hp=Math.max(0,S.hp-d);if(S.stats){S.stats.schadenRein=(S.stats.schadenRein||0)+d;if(d>0)S.stats.todesursache=en.n;}
 Bus.emit(d>0?'player_hurt':'player_blocked',{v:d,e:en,nr:1,von:1,letzter:true,why:`${why}; Block fängt ${ab}; du verlierst ${d}`});}
// Angekündigter Schaden aller Gegner im nächsten Zug (für Warnung und Musik)
function kniffNachAngriff(en,tot){if(tot>0)S.stats.todesursache=en.n;}
// was der Spieler sieht: verborgene Angriffe zählen nicht mit
// Fix 3 (Auftrag 3): wer in diesem Gegnerzug schon gehandelt hat, zeigt keine Absicht mehr, bis dein Zug beginnt
// M6: stumme Gegner zeigen keine Absicht (man hört sie, hoeren.js)
function absichtSichtbar(e){return !!e&&e.hp>0&&!e.gehandelt&&!S.nachGegnerzug&&!(typeof Hoeren!=='undefined'&&Hoeren.istStumm(e));}
function incomingSichtbar(){const v=alive().filter(e=>e.kniff&&e.kniff.art==='verborgen');if(!v.length)return incoming(true);const keep=v.map(e=>e.pat);v.forEach(e=>{e.pat=e.pat.map(p=>p.t==='atk'?{...p,v:-e.str,h:1}:p);});const r=incoming(true);v.forEach((e,i)=>e.pat=keep[i]);return Math.max(0,r);}
function incoming(sicht){let tot=0;for(const en of alive()){if(sicht&&!absichtSichtbar(en))continue;if(en.kniff&&en.kniff.art==='voraus'){const c=S.draw[S.draw.length-1];if(c&&c.atk)tot+=(c.atk+en.str)*(c.h||1);}const it=en.pat[en.pi%en.pat.length];if(it.t==='atk'){if(en.kniff&&en.kniff.art==='brecher'){tot+=S.block||0;}let v=it.v+en.str;if(en.weak2)v=Math.floor(v/2);tot+=v*(it.h||1);}}return tot;}

function endTurn(){
 if(S.phase!=='fight'||busy)return;busy=true;S.vorrat=S.energy;
 Bieg.zugEnde(); // Über Eck, Aufgewogen
 const bb=passive('ballast_block').reduce((s,p)=>s+(p.v||2),0),bz=S.hand.filter(c=>c.unspielbar).length;if(bb&&bz)addBlock(bb*bz,`Gesangbuch: ${bz} unspielbare Karte(n) auf der Hand, je ${bb} Block`);
 let bleib=S.hand.filter(c=>c.behalten&&!c.unspielbar);
 if(passive('behalten_eine').length){const rest=S.hand.filter(c=>!bleib.includes(c)&&!c.unspielbar).sort((a,b)=>cardCost(b)-cardCost(a));if(rest[0])bleib=[...bleib,rest[0]];}
 if(Bieg.handBleibt())bleib=S.hand.filter(c=>!c.unspielbar); // Ebbe und Flut: in der Flut bleibt die Hand
 bleib.forEach(c=>{if(c.sonder&&c.sonder.art==='zugende_hand')runFx(c.sonder.fx,{tg:alive()[0],why:`${c.n} am Zugende auf der Hand`});});Bieg.abwerfen(S.hand.filter(c=>!bleib.includes(c)).filter(c=>!(c.unspielbar&&c.verbraucht&&c.cid&&String(c.cid).startsWith('stoer')&&c.hand)));S.hand=bleib;Bieg.zugAus();S.hand.forEach(c=>{c.frost=false;c.teuer=0;});S.discard.forEach(c=>{c.frost=false;c.teuer=0;});S.behaltenNaechster=bleib.length;Bus.emit('changed');
 const list=alive();let i=0;
 const step=()=>{
  if(S.hp<=0&&!faehrgeld()){busy=false;return runLost();}
  if(i>=list.length){S.enemies.forEach(en=>{en.pi++;en.turns++;});specials();if(!alive().length){busy=false;checkVictory(700);return;}
   S.nachGegnerzug=true;Bus.emit('gegnerzug_ende',{why:'Die Gegner haben gehandelt; ihre neuen Absichten zeigen sich erst mit deinem Zug'});Bus.emit('changed');wait(380,()=>{busy=false;startTurn();});return;}
  const en=list[i++];if(en.hp<=0){step();return;}en.gehandelt=true;
  // Brand tickt und halbiert sich (Eigenschaft brand_haelt: nur −1); Gift tickt und sinkt um 1 (gift_doppelt: tickt zweimal)
  const giftMal=passive('gift_doppelt').length?2:1;const dot=en.burn+en.poison*giftMal;
  if(dot){hit(en,dot,1,en.burn?'F':'V',`Brand ${en.burn} + Gift ${en.poison}${giftMal>1?' ×2':''} am Zugbeginn von ${en.n}`,{dot:true});if(en.burn)en.burn=passive('brand_haelt').length?en.burn-1:Math.floor(en.burn/2);if(en.poison)en.poison--;if(en.hp<=0){wait(450,step);return;}}
  const it=en.pat[en.pi%en.pat.length];en.block=0;en.panzer=0;
  if(it.t==='atk'){if(en.kniff&&en.kniff.art==='brecher'&&S.block){Bus.emit('kniff',{e:en,why:`${en.n} zerbricht deinen Block (${S.block})`});S.block=0;}
   Bus.emit('enemy_lunge',{e:en});const W=BAL.wucht||{};const hits=it.h||1,halb=!!en.weak2;let nr=0,tot=0,abs=0;
   // Jeder Treffer einzeln (Anlauf, dann im Abstand), damit 4×3 auch dreimal zu sehen und zu hören ist
   const einer=()=>{nr++;let d=it.v+en.str;if(halb)d=Math.floor(d/2);const ab=Math.min(S.block,d);S.block-=ab;abs+=ab;d-=ab;S.hp=Math.max(0,S.hp-d);tot+=d;S.stats.schadenRein=(S.stats.schadenRein||0)+d;
    const letzter=nr>=hits;const why=`${en.n} greift an${hits>1?` (Treffer ${nr} von ${hits})`:''}: ${it.v}${en.str?' +'+en.str+' Stärke':''}${halb?', geschwächt halbiert':''}; Block fängt ${ab}; du verlierst ${d}`;
    Bus.emit(d>0?'player_hurt':'player_blocked',{v:d,e:en,nr,von:hits,letzter,why});Bus.emit('changed');
    if(S.hp<=0&&!faehrgeld()){busy=false;return runLost();}
    if(!letzter){wait(W.mehrfach_abstand_ms||120,einer);return;}
    if(en.weak2)en.weak2=0;log(`${en.n} trifft: ${tot}`);kniffNachAngriff(en,tot);kniffGegnerzug(en);if(en.vuln>0)en.vuln--;Bus.emit('changed');wait(560,step);};
   wait(W.anlauf_gegner_ms||330,einer);return;}
  else if(it.t==='blk'){en.block+=it.v;Bus.emit('enemy_block',{e:en,why:`${en.n} schützt sich (+${it.v} Block)`});log(`${en.n} schützt sich (+${it.v})`);}
  else if(it.t==='buff'){en.str+=it.v;Bus.emit('enemy_buff',{e:en,why:`${en.n} wird stärker (+${it.v} Stärke)`});log(`${en.n} wird stärker (+${it.v})`);}
  else if(it.t==='laedt'){Bus.emit('enemy_buff',{e:en,why:`${en.n} lädt (Ansage): bald ein großer Schlag`});}
  kniffGegnerzug(en);if(en.vuln>0)en.vuln--;
  Bus.emit('changed');wait(680,step);
 };wait(300,step);}
// Besonderheiten der Wächter und des Bosses nach dem Gegnerzug
function specials(){for(const en of alive()){
 // Pendel (Regulator): schwingt jeden Zug auf die andere Seite und zwischen zwei Tiefenreihen
 if(en.pendel){const l=en.turns%2===1;en.x=l?.3:.7;en.reihe=l?1:2;Bus.emit('kniff',{e:en,why:`${en.n} schwingt nach ${l?'links hinten':'rechts vorn'}`});}
 const b=en.besonders;if(!b)continue;
 if(b.art==='ruft'&&FOES[b.gegner]&&en.turns%(b.alle||3)===0&&alive().length<4){const add=mkEnemy(b.gegner);add.gerufen=true;if(add.kniff&&add.kniff.art==='ruf')add.kniff=null;add.x=rs('aufstellung').pick([.16,.84,.3,.7]);add.reihe=rs('aufstellung').pick([0,1]);if(typeof Hoeren!=='undefined')Hoeren.begrenzen([add]);S.enemies.push(add);Bus.emit('enemy_spawn',{e:add,why:`${en.n} ruft ${add.n} (alle ${b.alle||3} Züge)`});}
 if(b.art==='schwach_wechsel'&&b.stoffe){en.weak=b.stoffe[en.turns%b.stoffe.length];Bus.emit('enemy_status',{e:en,status:'schwach',why:`${en.n} wechselt die Schwachstelle: jetzt ${ST[en.weak].n}`});}
 if(b.art==='phasen'&&b.ruft){const R2=typeof b.ruft==='string'?{gegner:b.ruft,alle:3,anzahl:1}:b.ruft;if(FOES[R2.gegner]&&en.phase>=1&&en.turns%(R2.alle||3)===0){for(let k=0;k<(R2.anzahl||1)&&alive().length<4;k++){const add=mkEnemy(R2.gegner);add.gerufen=true;if(add.kniff&&add.kniff.art==='ruf')add.kniff=null;add.x=rs('aufstellung').pick([.14,.86,.28,.72]);add.reihe=0;if(typeof Hoeren!=='undefined')Hoeren.begrenzen([add]);S.enemies.push(add);Bus.emit('enemy_spawn',{e:add,why:`${en.n} ruft ${add.n} (Phase ${en.phase+1}, alle ${R2.alle||3} Züge)`});}}}}}
