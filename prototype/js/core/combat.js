// Kampf: Gegner aufstellen, Züge, Karten spielen, Gegnerzug. Meldet alles über den Bus, jeweils mit Grund (why).
// Läuft im FAST-Modus (Autospieler, Vorschau) ohne Wartezeiten synchron durch.

// Deck aus den angelegten Items: jede Karte BAL.card_copies-mal, gestrichene Items (it.x) geben keine Karte.
// Dazu je Item mit Karten eine Grundkarte (grundKarte in rules.js).
function buildDeck(){const d=[];for(const it of allActive()){if(it.x)continue;const D=def(it);for(let k=0;k<(BAL.card_copies||1);k++)D.cards.forEach((c,ci)=>d.push({...c,st:[...D.st],src:D.n,spr:D.spr,uid:it.uid,ci,cid:it.uid+':'+ci+':'+k}));
 const g=grundKarte(D);if(g)for(let k=0;k<(BAL.grundkarten.copies||1);k++)d.push({...g,st:[],src:D.n,spr:D.spr,uid:it.uid,ci:'g',grund:true,cid:it.uid+':g:'+k});}return rs('kampf').shuffle(d);}

// Gegner aus foes.json erzeugen, skaliert nach Tiefe
function mkEnemy(id,i){const f=FOES[id];if(!f)throw new Error('Unbekannter Gegner '+id);const d=S.depth;
 const st=S.stufe||0,ST2=RUN.stufen||{hp_je_stufe:0,atk_alle_n_stufen:99};
 // Wächter und Boss sind je Akt eigens ausgelegt und skalieren nicht mit der Tiefe, nur mit der Schwierigkeitsstufe
 const tief=(f.rang||'normal')==='normal';const sc=(tief?1+BAL.enemy_scaling.hp_per_depth*(d-1):1)*(1+ST2.hp_je_stufe*st),as=(tief?Math.floor((d-1)/BAL.enemy_scaling.atk_every_n_depths):0)+(st>=2?Math.floor(st/ST2.atk_alle_n_stufen):0);const hp=Math.round(f.hp*sc);
 const r=rs('kampf');
 return{uid:++uidc,id,n:f.n,spr:f.spr||f.sprite||id,variant:f.variant,sprite:f.rang==='boss'?(f.sprite||null):f.varianten?r.pick(f.varianten):(f.sprite||null),rang:f.rang||'normal',weak:f.weak,hp,max:hp,block:0,str:0,burn:0,poison:0,weak2:0,
  pi:f.rang==='boss'||f.rang==='waechter'?0:Math.floor(r.next()*f.pat.length),as,pat:f.pat.map(p=>({...p,v:p.t==='atk'?p.v+as:p.v})),besonders:f.besonders||null,phase:0,turns:0};}
// Aufstellung: drei Tiefenreihen (0 hinten, 1 mitte, 2 vorne), per Seed mit etwas Zufall, Wächter/Boss vorne mittig
function aufstellen(list){const r=rs('aufstellung');const n=list.length;
 const xs=n===1?[.5]:n===2?[.36,.64]:n===3?[.22,.5,.78]:[.14,.38,.62,.86];
 const reihen=n===1?[2]:r.shuffle(n===2?[1,2]:n===3?[0,1,2]:[0,1,1,2]);
 list.forEach((e,i)=>{e.x=xs[i]+(r.next()-.5)*.06;e.reihe=e.rang==='normal'?reihen[i]:2;});
 if(list.some(e=>e.rang!=='normal')){const big=list.find(e=>e.rang!=='normal');big.x=.5;const others=list.filter(e=>e!==big);others.forEach((e,i)=>{e.x=others.length===1?.2:[.16,.84,.3,.7][i];e.reihe=r.pick([0,1]);});}}

function startFight(ids,art='kampf'){
 S.enemies=ids.map((id,i)=>mkEnemy(id,i));aufstellen(S.enemies);
 S.kampfArt=art;S.target=0;S.phase='fight';S.chainLog=[];S.turnNo=0;S.draw=buildDeck();S.hand=[];S.discard=[];S.exhaust=[];S.ward=0;S.compassUsed=false;S.kampfLog=[];
 const pb=passive('start_block').reduce((s,p)=>s+p.v,0);
 log(`Tiefe ${S.depth}: ${S.enemies.map(e=>e.n).join(', ')}`);
 Bus.emit('fight_start',{art,ids,why:`${RUN.knoten[art==='schwer'?'kampf_schwer':art]?.n||art} auf Tiefe ${S.depth} (${biom().kurz}), Gegner aus dem Biom per Seed`});
 startTurn();if(pb){S.block+=pb;Bus.emit('player_block',{v:pb,why:'Passiver Talisman: Block zu Kampfbeginn'});}}

function drawCards(n){for(let i=0;i<n;i++){if(!S.draw.length){if(!S.discard.length)return;S.draw=rs('kampf').shuffle(S.discard);S.discard=[];}S.hand.push(S.draw.pop());}}
function handSize(){return Math.max(BAL.hand_size,...bonuses('hand_size').map(b=>b.amount));}
function startTurn(){S.block=S.ward;S.ward=0;S.energy=BAL.energy_per_turn;S.last=[];S.played=0;S.hochUsed=new Set();S.turnNo=(S.turnNo||0)+1;
 drawCards(handSize());
 // Falsches Detail der Pforte: Im Finale kosten zufällige Karten diese Runde 1 weniger oder 1 mehr
 if(S.kampfArt==='finale'){const r=rs('pforte');S.hand.forEach(c=>{c.mod=0;if(r.chance(.35))c.mod=r.chance(.5)?-1:1;});const m=S.hand.filter(c=>c.mod);if(m.length)Bus.emit('pforte_mod',{why:`Die Regeln biegen sich: ${m.map(c=>c.n+(c.mod>0?' +1':' −1')).join(', ')}`});}
 Bus.emit('deal');Bus.emit('turn_start',{turn:S.turnNo,why:`Zug ${S.turnNo}: ${handSize()} Karten, ${S.energy} Energie`+(S.block?`, ${S.block} Block aus dem Bannkreis`:'')});Bus.emit('changed');}
function healP(v,why=''){const m=maxHp(),b=S.hp;S.hp=Math.min(m,S.hp+v);if(S.hp>b)Bus.emit('player_heal',{v:S.hp-b,why});}
function addBlock(v,why=''){S.block+=v;Bus.emit('player_block',{v,why});}
function addSlot(a){if(S.slots[a]<BAL.max_slots){S.slots[a]++;log(`Neuer Slot: ${AREA_N[a]}`);Bus.emit('slot',{a,why:'Ereignis'});}}
function tgt(){let e=S.enemies[S.target];if(!e||e.hp<=0){e=alive()[0];S.target=S.enemies.indexOf(e);}return e;}
// Schaden an einem Gegner. Block fängt zuerst. Gibt den echten Schaden zurück.
function hit(e,dmg,k=1,col,why=''){if(!e||e.hp<=0)return 0;let d=Math.max(0,Math.round(dmg));let ab=0;if(e.block>0){ab=Math.min(e.block,d);e.block-=ab;d-=ab;}
 e.hp=Math.max(0,e.hp-d);Bus.emit('enemy_hit',{e,d,ab,col,why});
 if(e.hp<=0){log(`${e.n} fällt.`);Bus.emit('enemy_die',{e,why:`${e.n} hat kein Leben mehr`});}
 else checkPhase(e);return d;}
// Boss-Phasen (foes.json → besonders.art = phasen)
function checkPhase(e){const b=e.besonders;if(!b||b.art!=='phasen')return;const q=e.hp/e.max;const want=b.bei.filter(x=>q<=x).length;if(want>e.phase){e.phase=want;const m=b.muster&&b.muster[want-1];if(m){e.pat=m.map(p=>({...p,v:p.t==='atk'?p.v+e.as:p.v}));e.pi=0;}
 const sp=b.sprites&&b.sprites[want-1],sw=(b.schwach||b.weak)&&(b.schwach||b.weak)[want-1];if(sp)e.sprite=sp;if(sw)e.weak=sw;
 Bus.emit('boss_phase',{e,phase:want,why:`${e.n} fällt unter ${Math.round(b.bei[want-1]*100)} % Leben: Phase ${want+1}`});}}
function checkVictory(delay=900){if(DRY)return;if(!alive().length&&!busy&&S.phase==='fight'){busy=true;wait(delay,()=>{busy=false;fightWon();});}}

// Was würde Karte i jetzt anrichten? Spielt sie auf einer Kopie des Zustands durch, ohne Ereignisse und ohne Zeitverzögerung.
// Gibt je Gegner {d (Lebensverlust), ab (verlorener Block)} und für den Spieler {block, heal, self} zurück. Gleiche Rechnung wie das echte Spielen.
function previewCard(i,ei){const keep=S,kb=busy,kf=FAST,ku=uidc;let out=null;
 try{S=structuredClone(S);busy=false;FAST=true;DRY=true;Bus.muted=true;
  const before=S.enemies.map(e=>({hp:e.hp,block:e.block}));const p0={hp:S.hp,block:S.block,en:S.energy};
  playCard(i,ei);
  out={foes:S.enemies.map((e,k)=>({d:before[k].hp-e.hp,ab:Math.max(0,before[k].block-e.block),kill:before[k].hp>0&&e.hp<=0})),block:S.block-p0.block,hp:S.hp-p0.hp,energy:S.energy-p0.en,rx:S.chainLog.length?S.chainLog[S.chainLog.length-1].rx:[]};
 }catch(err){console.warn('Vorschau',err);}
 finally{S=keep;busy=kb;FAST=kf;DRY=false;Bus.muted=false;uidc=ku;}return out;}

function playCard(i,ei){
 if(S.phase!=='fight'||busy)return false;const c=S.hand[i];if(!c)return false;const cost=cardCost(c);
 if(S.energy<cost){Bus.emit('no_energy');Bus.emit('changed');return false;}
 if(ei!=null&&S.enemies[ei]&&S.enemies[ei].hp>0)S.target=ei;
 const first=S.played===0;if(first&&S.turnNo===1&&passive('erste_karte_billiger').length)S.compassUsed=true;
 S.energy-=cost;S.hand.splice(i,1);if(c.verbraucht)S.exhaust.push(c);else S.discard.push(c);S.played++;
 const e=tgt();const rx=reactionsFor(S.last,c.st);const ctx={tg:e,card:c};
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
 for(let r=0;r<reps;r++)applyMain(card,ctx,mult,flat,multWhy);
 bonuses('stoff_block').forEach(b=>{if(c.st.includes(b.stoff))addBlock(b.amount,`Set Pfarrerin: Karte mit ${ST[b.stoff].n} gibt ${b.amount} Block`);});
 const prevSt=[...S.last];S.chainLog.push({turn:S.turnNo,n:c.n,st:[...c.st],prev:prevSt,rx:rx.map(r=>whyRx(r,prevSt,c.st))});
 let k=0;for(const r of rx){k++;if(r.s)S.hochUsed.add(r.n);
  const live=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];const w=S.chainLog[S.chainLog.length-1].rx.find(x=>x.n===r.n);
  const why=`${r.n} ausgelöst: ${w?w.src:''}`+(r===VERST?' (gleicher Stoff)':r.s?` (Hochreaktion ${[...r.s].join('')})`:` (Paar ${r.k} aus reactions.json)`);
  if(r.fx)runFx(r.fx,{tg:live,why});
  const isNew=!S.disc.has(r.n);S.disc.add(r.n);log(isNew?`Reaktion entdeckt: ${r.n}`:`Reaktion: ${r.n}`);
  Bus.emit('reaction',{r,k,isNew,keys:w?w.keys:c.st,live,hoch:!!r.s,why});}
 S.last=[...c.st];
 Bus.emit('changed');checkVictory();return true;}

function applyMain(c,ctx,mult,flat,multWhy=[]){
 const col=c.st[0]||null;
 const t0=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];
 if(c.strip&&t0){t0.block=0;Bus.emit('enemy_status',{e:t0,status:'block_weg',why:`${c.n}: Block von ${t0.n} zerbricht`});} // vor dem Schaden
 if(c.self){S.hp=Math.max(1,S.hp-c.self);Bus.emit('self_damage',{v:c.self,why:`${c.n} kostet ${c.self} Leben`});}
 if(c.atk){const hits=c.h||1;for(let h=0;h<hits;h++){const targets=c.all?alive():[ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0]];
   const go=()=>targets.forEach(en=>{if(!en||en.hp<=0)return;let d=(c.atk+flat)*mult;const parts=[`${c.n} ${c.atk}`];if(flat)parts.push(`Fischer-Bonus +${flat}`);if(mult!==1)parts.push(multWhy.join(', ')||`×${mult}`);
     if(en.weak&&c.st.includes(en.weak)){d*=1.5;parts.push(`Schwachstelle ${ST[en.weak].n} ×1,5`);Bus.emit('weakspot',{e:en});}
     else if(en.weak)parts.push(`keine Schwachstelle (${en.n} ist schwach gegen ${ST[en.weak].n})`);
     Bus.emit('slash',{e:en,col});const blk=en.block;const real=hit(en,d,h+1,col,'');
     Bus.emit('damage_calc',{e:en,roh:Math.round(d),block:Math.min(blk,Math.round(d)),d:real,parts,why:`${real} Schaden an ${en.n}: ${parts.join('; ')}`+(blk?`; Block ${Math.min(blk,Math.round(d))}`:'')+` = ${real}`});});
   if(h===0)go();else wait(h*140,()=>{go();Bus.emit('attack',{k:S.played+h});Bus.emit('changed');checkVictory();});}
  Bus.emit('attack',{k:S.played});}
 if(c.blk)addBlock(Math.round((c.blk+flat)*mult),`${c.n}: ${c.blk}${flat?' +'+flat:''}${mult!==1?' ×'+mult:''} Block`);
 if(c.heal)healP(Math.round(c.heal*mult),`${c.n} heilt`);
 const t=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];
 if(c.poison&&t){t.poison+=Math.round(c.poison*mult);Bus.emit('enemy_status',{e:t,status:'poison',why:`${c.n}: Gift ${Math.round(c.poison*mult)}`});}
 if(c.burn&&t){t.burn+=Math.round(c.burn*mult);Bus.emit('enemy_status',{e:t,status:'burn',why:`${c.n}: Brand ${Math.round(c.burn*mult)}`});}
 if(c.weak&&t){t.weak2=1;Bus.emit('enemy_status',{e:t,status:'weak',why:`${c.n}: ${t.n} geschwächt`});}
 if(c.draw)drawCards(c.draw);
 if(c.en){S.energy+=c.en;Bus.emit('energy',{v:c.en,why:c.n});}}

// Angekündigter Schaden aller Gegner im nächsten Zug (für Warnung und Musik)
function incoming(){let tot=0;for(const en of alive()){const it=en.pat[en.pi%en.pat.length];if(it.t==='atk'){let v=it.v+en.str;if(en.weak2)v=Math.floor(v/2);tot+=v*(it.h||1);}}return tot;}

function endTurn(){
 if(S.phase!=='fight'||busy)return;busy=true;S.discard.push(...S.hand);S.hand=[];Bus.emit('changed');
 const list=alive();let i=0;
 const step=()=>{
  if(S.hp<=0){busy=false;return runLost();}
  if(i>=list.length){S.enemies.forEach(en=>{en.pi++;en.turns++;});specials();busy=false;if(!alive().length){checkVictory(700);return;}startTurn();return;}
  const en=list[i++];if(en.hp<=0){step();return;}
  const dot=en.burn+en.poison;if(dot){hit(en,dot,1,en.burn?'F':'V',`Brand ${en.burn} + Gift ${en.poison} am Zugbeginn von ${en.n}`);if(en.burn)en.burn--;if(en.poison)en.poison--;if(en.hp<=0){wait(450,step);return;}}
  const it=en.pat[en.pi%en.pat.length];en.block=0;
  if(it.t==='atk'){Bus.emit('enemy_lunge',{e:en});wait(170,()=>{const hits=it.h||1;let tot=0,abs=0;const halb=!!en.weak2;
    for(let h=0;h<hits;h++){let d=it.v+en.str;if(halb)d=Math.floor(d/2);const ab=Math.min(S.block,d);S.block-=ab;abs+=ab;d-=ab;S.hp=Math.max(0,S.hp-d);tot+=d;}
    if(en.weak2)en.weak2=0;
    const why=`${en.n} greift an: ${it.v}${en.str?' +'+en.str+' Stärke':''}${hits>1?' ×'+hits:''}${halb?', geschwächt halbiert':''}; Block fängt ${abs}; du verlierst ${tot}`;
    Bus.emit(tot>0?'player_hurt':'player_blocked',{v:tot,e:en,why});log(`${en.n} trifft: ${tot}`);Bus.emit('changed');});}
  else if(it.t==='blk'){en.block+=it.v;Bus.emit('enemy_block',{e:en,why:`${en.n} schützt sich (+${it.v} Block)`});log(`${en.n} schützt sich (+${it.v})`);}
  else if(it.t==='buff'){en.str+=it.v;Bus.emit('enemy_buff',{e:en,why:`${en.n} wird stärker (+${it.v} Stärke)`});log(`${en.n} wird stärker (+${it.v})`);}
  Bus.emit('changed');wait(680,step);
 };wait(300,step);}
// Besonderheiten der Wächter und des Bosses nach dem Gegnerzug
function specials(){for(const en of alive()){const b=en.besonders;if(!b)continue;
 if(b.art==='ruft'&&FOES[b.gegner]&&en.turns%(b.alle||3)===0&&alive().length<4){const add=mkEnemy(b.gegner);add.x=rs('aufstellung').pick([.16,.84,.3,.7]);add.reihe=rs('aufstellung').pick([0,1]);S.enemies.push(add);Bus.emit('enemy_spawn',{e:add,why:`${en.n} ruft ${add.n} (alle ${b.alle||3} Züge)`});}
 if(b.art==='schwach_wechsel'&&b.stoffe){en.weak=b.stoffe[en.turns%b.stoffe.length];Bus.emit('enemy_status',{e:en,status:'schwach',why:`${en.n} wechselt die Schwachstelle: jetzt ${ST[en.weak].n}`});}
 if(b.art==='phasen'&&b.ruft){const R2=typeof b.ruft==='string'?{gegner:b.ruft,alle:3,anzahl:1}:b.ruft;if(FOES[R2.gegner]&&en.phase>=1&&en.turns%(R2.alle||3)===0){for(let k=0;k<(R2.anzahl||1)&&alive().length<4;k++){const add=mkEnemy(R2.gegner);add.x=rs('aufstellung').pick([.14,.86,.28,.72]);add.reihe=0;S.enemies.push(add);Bus.emit('enemy_spawn',{e:add,why:`${en.n} ruft ${add.n} (Phase ${en.phase+1}, alle ${R2.alle||3} Züge)`});}}}}}
