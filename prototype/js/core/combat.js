// Kampf: Gegner aufstellen, Züge, Karten spielen, Gegnerzug. Meldet alles über den Bus.
function buildDeck(){const d=[];for(const it of allActive()){const D=def(it);D.cards.forEach(c=>d.push({...c,st:[...D.st],src:D.n,spr:D.spr,uid:it.uid}));}return shuffle(d);}
function genFoes(d){const E=BAL.encounters;if(d===E.boss_depth)return['boss'];const pool=Object.keys(E.pool_from_depth).filter(id=>d>=E.pool_from_depth[id]);
 const c=E.count[String(d)]??E.count.default;const n=Array.isArray(c)?rnd(c[0],c[1]):c;return[...Array(n)].map(()=>pool[Math.floor(Math.random()*pool.length)]);}
function startFight(){
 const d=S.depth;const ids=S.nextIds||genFoes(d);S.nextIds=null;
 const sc=1+BAL.enemy_scaling.hp_per_depth*(d-1),as=Math.floor((d-1)/BAL.enemy_scaling.atk_every_n_depths);
 S.enemies=ids.map(id=>{const f=FOES[id];const hp=Math.round(f.hp*sc);return{id,n:f.n,spr:f.spr,variant:f.variant,weak:f.weak,hp,max:hp,block:0,str:0,burn:0,poison:0,weak2:0,pi:id==='boss'?0:Math.floor(Math.random()*f.pat.length),pat:f.pat.map(p=>({...p,v:p.t==='atk'?p.v+as:p.v}))};});
 S.target=0;S.phase='fight';S.chainLog=[];S.turnNo=0;S.draw=buildDeck();S.hand=[];S.discard=[];S.ward=0;
 log(`Tiefe ${d}: ${S.enemies.map(e=>e.n).join(', ')}`);Bus.emit('fight_start',{boss:ids[0]==='boss'});startTurn();
}
function drawCards(n){for(let i=0;i<n;i++){if(!S.draw.length){if(!S.discard.length)return;S.draw=shuffle(S.discard);S.discard=[];}S.hand.push(S.draw.pop());}}
function handSize(){return Math.max(BAL.hand_size,...bonuses('hand_size').map(b=>b.amount));}
function startTurn(){S.block=S.ward;S.ward=0;S.energy=BAL.energy_per_turn;S.last=[];S.played=0;S.hochUsed=new Set();S.turnNo=(S.turnNo||0)+1;drawCards(handSize());Bus.emit('deal');Bus.emit('changed');}
function healP(v){const m=maxHp(),b=S.hp;S.hp=Math.min(m,S.hp+v);if(S.hp>b)Bus.emit('player_heal',{v:S.hp-b});}
function addBlock(v){S.block+=v;Bus.emit('player_block',{v});}
function addSlot(a){if(S.slots[a]<BAL.max_slots){S.slots[a]++;log(`Neuer Slot: ${AREA_N[a]}`);}}
function tgt(){let e=S.enemies[S.target];if(!e||e.hp<=0){e=alive()[0];S.target=S.enemies.indexOf(e);}return e;}
function hit(e,dmg,k=1,col){if(!e||e.hp<=0)return 0;let d=Math.max(0,Math.round(dmg));if(e.block>0){const ab=Math.min(e.block,d);e.block-=ab;d-=ab;}
 e.hp=Math.max(0,e.hp-d);Bus.emit('enemy_hit',{e,d,col});
 if(e.hp<=0){log(`${e.n} fällt.`);Bus.emit('enemy_die',{e});}return d;}
function checkVictory(delay=900){if(!alive().length&&!busy){busy=true;setTimeout(()=>{busy=false;victory();},delay);}}
function playCard(i,ei){
 if(S.phase!=='fight'||busy)return;const c=S.hand[i];if(!c)return;const cost=cardCost(c);
 if(S.energy<cost){Bus.emit('no_energy');Bus.emit('changed');return;}
 if(ei!=null&&S.enemies[ei]&&S.enemies[ei].hp>0)S.target=ei;
 S.energy-=cost;S.hand.splice(i,1);S.discard.push(c);S.played++;Bus.emit('card_played',{c});
 const e=tgt();const rx=reactionsFor(S.last,c.st);const ctx={tg:e,card:c};
 let mult=1;rx.forEach(r=>{if(r.pre&&r.pre.mult)mult*=r.pre.mult;});
 bonuses('every_nth_mult').forEach(b=>{if(S.played%b.n===0){mult*=b.mult;Bus.emit('toast',{a:'KNEIPENSCHLÄGER',b:`Karte ${b.n}: doppelt`});}});
 const flat=bonuses('stoff_flat').filter(b=>c.st.includes(b.stoff)).reduce((s,b)=>s+b.amount,0);
 const rep=rx.find(r=>r.pre&&r.pre.repeat);const reps=rep?rep.pre.repeat:1;if(rep){S.hp=Math.max(1,S.hp-rep.pre.self_damage);Bus.emit('self_damage',{v:rep.pre.self_damage});}
 for(let r=0;r<reps;r++)applyMain(c,ctx,mult,flat);
 bonuses('stoff_block').forEach(b=>{if(c.st.includes(b.stoff))addBlock(b.amount);});
 const prevSt=[...S.last];S.chainLog.push({turn:S.turnNo,n:c.n,st:[...c.st],prev:prevSt,rx:rx.map(r=>whyRx(r,prevSt,c.st))});
 let k=0;for(const r of rx){k++;if(r.s)S.hochUsed.add(r.n);
  const live=ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0];
  if(r.fx)runFx(r.fx,{tg:live});
  const isNew=!S.disc.has(r.n);S.disc.add(r.n);if(isNew)log(`Reaktion entdeckt: ${r.n}`);else log(`Reaktion: ${r.n}`);
  const w=S.chainLog[S.chainLog.length-1].rx.find(x=>x.n===r.n);
  Bus.emit('reaction',{r,k,isNew,keys:w?w.keys:c.st,live,hoch:!!r.s});}
 S.last=[...c.st];
 Bus.emit('changed');checkVictory();
}
function applyMain(c,ctx,mult,flat){
 const col=c.st[0]||null;
 if(c.self){S.hp=Math.max(1,S.hp-c.self);Bus.emit('self_damage',{v:c.self});}
 if(c.atk){const hits=c.h||1;for(let h=0;h<hits;h++){const targets=c.all?alive():[ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0]];
   const go=()=>targets.forEach(en=>{if(!en||en.hp<=0)return;let d=(c.atk+flat)*mult;if(en.weak&&c.st.includes(en.weak)){d*=1.5;Bus.emit('weakspot',{e:en});}Bus.emit('slash',{e:en,col});hit(en,d,h+1,col);});
   if(h===0)go();else setTimeout(()=>{go();Bus.emit('attack',{k:S.played+h});Bus.emit('changed');checkVictory();},h*140);}
  Bus.emit('attack',{k:S.played});}
 if(c.blk)addBlock(Math.round((c.blk+flat)*mult));
 if(c.heal)healP(Math.round(c.heal*mult));
 if(c.poison&&ctx.tg){ctx.tg.poison+=Math.round(c.poison*mult);Bus.emit('enemy_status',{e:ctx.tg,status:'poison'});}
 if(c.burn&&ctx.tg){ctx.tg.burn+=Math.round(c.burn*mult);Bus.emit('enemy_status',{e:ctx.tg,status:'burn'});}
 if(c.draw)drawCards(c.draw);
 if(c.en)S.energy+=c.en;
}
function endTurn(){
 if(S.phase!=='fight'||busy)return;busy=true;S.discard.push(...S.hand);S.hand=[];Bus.emit('changed');
 const list=alive();let i=0;
 const step=()=>{
  if(S.hp<=0){busy=false;return gameOver();}
  if(i>=list.length){S.enemies.forEach(en=>en.pi++);busy=false;if(!alive().length){checkVictory(700);return;}startTurn();return;}
  const en=list[i++];if(en.hp<=0){step();return;}
  const dot=en.burn+en.poison;if(dot){hit(en,dot,1,en.burn?'F':'V');if(en.burn)en.burn--;if(en.poison)en.poison--;if(en.hp<=0){setTimeout(step,450);return;}}
  const it=en.pat[en.pi%en.pat.length];en.block=0;
  if(it.t==='atk'){Bus.emit('enemy_lunge',{e:en});setTimeout(()=>{const hits=it.h||1;let tot=0;for(let h=0;h<hits;h++){let d=it.v+en.str;if(en.weak2){d=Math.floor(d/2);}const ab=Math.min(S.block,d);S.block-=ab;d-=ab;S.hp=Math.max(0,S.hp-d);tot+=d;}
   if(en.weak2)en.weak2=0;
   Bus.emit(tot>0?'player_hurt':'player_blocked',{v:tot,e:en});log(`${en.n} trifft: ${tot}`);Bus.emit('changed');},170);}
  else if(it.t==='blk'){en.block+=it.v;Bus.emit('enemy_block',{e:en});log(`${en.n} schützt sich (+${it.v})`);}
  else if(it.t==='buff'){en.str+=it.v;Bus.emit('enemy_buff',{e:en});log(`${en.n} wird stärker (+${it.v})`);}
  Bus.emit('changed');setTimeout(step,680);
 };setTimeout(step,300);
}
function gameOver(){S.phase='over';Bus.emit('game_over');Bus.emit('changed');}
