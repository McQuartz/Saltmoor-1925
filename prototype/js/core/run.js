// Ablauf eines Runs: Start, Belohnung, Lagerfeuer, Werkstatt, Krämer, Ereignisse, Inventar.
function newGame(job){
 uidc=0;const n0=performance.now(),m=60000;
 S={phase:'fight',hp:0,bonusHp:0,depth:1,energy:BAL.energy_per_turn,block:0,ward:0,slots:{waffe:BAL.start_slots,kleidung:BAL.start_slots,talisman:BAL.start_slots},
  areas:{waffe:[null,null,null,null],kleidung:[null,null,null,null],talisman:[null,null,null,null]},bag:Array(BAL.bag_size).fill(null),bench:[null,null],
  enemies:[],disc:new Set(),sel:null,log:[],job:job.n,reward:null,event:null,picked:false,forged:false,nextIds:null,gold:0,
  scares:BAL.jumpscare.windows_min.map(([a,b])=>n0+(a+Math.random()*(b-a))*m),
  draw:[],hand:[],discard:[],last:[],played:0,hochUsed:new Set(),target:0,chainLog:[]};
 job.w.forEach((id,i)=>S.areas.waffe[i]=mk(id));job.k.forEach((id,i)=>S.areas.kleidung[i]=mk(id));job.t.forEach((id,i)=>S.areas.talisman[i]=mk(id));job.bag.forEach((id,i)=>S.bag[i]=mk(id));
 S.hp=maxHp();log(`Du bist ${job.n}. Etwas ruft aus der Tiefe.`);log('Zieh Karten auf die Gegner. Direkt nacheinander reagieren ihre Stoffe.');
 log('Im Rucksack liegt etwas, das zu deiner Ausrüstung passt.');startFight();
}
function giveItem(id){const it=mk(id);const i=S.bag.indexOf(null);if(i>=0){S.bag[i]=it;log(`Erhalten: ${ITEMS[id].n}`);return true;}log('Rucksack voll, Item verloren.');return false;}
function giveRandom(){const ks=dropPool();giveItem(ks[Math.floor(Math.random()*ks.length)]);}
function victory(){
 Bus.emit('victory');const hb=Math.round(maxHp()*BAL.victory_heal_pct);healP(hb);log(`Sieg! +${hb} Leben`);
 bonuses('after_victory_item').forEach(b=>{giveItem(b.item);Bus.emit('toast',{a:'FRIEDHOFSWÄRTER',b:'Ein Knochen für den Rucksack'});});
 const R=BAL.rewards;const pick=pickN(dropPool(),R.choices);
 if(S.depth>=R.rare_from_depth&&Math.random()<R.rare_chance){const rs=rarePool();pick[R.choices-1]=rs[Math.floor(Math.random()*rs.length)];}
 S.nextIds=genFoes(S.depth+1);
 const G=BAL.gold_per_victory;const gd=S.depth===BAL.encounters.boss_depth?G.boss:rnd(G.min,G.max)+S.enemies.length*G.per_enemy;S.gold+=gd;log(`+${gd} Gold`);Bus.emit('toast',{a:'BEUTE',b:`+${gd} Gold`});
 const SH=BAL.shop;S.shop=every(S.depth,SH);
 if(S.shop){const o=[...pickN(dropPool(),SH.normal_items),...pickN(rarePool(),SH.rare_items)];S.shopItems=o.map(id=>({id,price:ITEMS[id].rare?SH.rare_price:rnd(SH.normal_price[0],SH.normal_price[1]),sold:false}));S.shopHeal=false;}
 S.reward=pick;S.picked=false;S.forged=false;S.workshop=every(S.depth,BAL.workshop);S.phase='reward';S.hand=[];Bus.emit('changed');
}
function takeReward(id){if(S.picked)return;if(id){if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}giveItem(id);Bus.emit('pick');}S.picked=true;Bus.emit('changed');}
function leaveRest(){
 for(let i=0;i<2;i++){const it=S.bench[i];if(it){const j=S.bag.indexOf(null);if(j<0){Bus.emit('bad',{a:'KEIN PLATZ',b:'Nimm die Items von der Werkbank erst weg.'});return;}S.bag[j]=it;S.bench[i]=null;}}
 S.depth++;if(every(S.depth,BAL.event)&&S.depth!==BAL.encounters.boss_depth&&S.depth>1){S.event=EVENTS[Math.floor(Math.random()*EVENTS.length)];S.phase='event';Bus.emit('changed');}else startFight();}
function chooseEvent(i){const o=S.event.o[i];if(!condOk(o.if))return;runFx(o.fx);Bus.emit('pick');S.event=null;startFight();}
function buy(i){const H=BAL.shop.heal;
 if(i==='heal'){if(S.shopHeal||S.gold<H.price){Bus.emit('bad',{});return;}S.gold-=H.price;S.shopHeal=true;healP(H.v);Bus.emit('changed');return;}
 const o=S.shopItems[+i];if(!o||o.sold)return;if(S.gold<o.price){Bus.emit('bad',{a:'ZU WENIG GOLD',b:`Du brauchst ${o.price}.`});return;}if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}
 S.gold-=o.price;o.sold=true;giveItem(o.id);Bus.emit('pick');Bus.emit('toast',{a:'GEKAUFT',b:ITEMS[o.id].n});Bus.emit('changed');}
function nextShop(){let d=S.depth+1;while(!every(d,BAL.workshop))d++;return d;}
// --- Werkbank ---
function forgePreview(){const[a,b]=S.bench;if(!a||!b)return null;const A=def(a),B=def(b);const F=BAL.forge;const st=[...new Set([...A.st,...B.st])];
 if(st.length>F.max_stoffe)return{err:`Zu viele Stoffe. Ein Item kann höchstens ${F.max_stoffe} tragen.`};
 const base=A.base||A.n;const lvl=(A.lvl||0)+(B.lvl||0)+1;const same=B.st.every(x=>A.st.includes(x));
 if(F.double_needs_reaction&&!same&&st.length===2&&!REACT.find(r=>r.k===pairKey(st[0],st[1])))return{err:`${ST[st[0]].n} und ${ST[st[1]].n} verbinden sich nicht. Verschmelzen geht nur mit Stoffen, die miteinander reagieren.`};
 const newSt=B.st.find(x=>!A.st.includes(x));const name=same?`${base} +${lvl}`:`${base} ${SUFFIX[newSt]}`;
 const rx=[];for(let i=0;i<st.length;i++)for(let j=i+1;j<st.length;j++){const r=REACT.find(r=>r.k===pairKey(st[i],st[j]));if(r)rx.push(r);}
 const bump=c=>{const n={...c};['atk','blk','heal','poison','burn'].forEach(q=>{if(n[q])n[q]+=F.bump;});return n;};
 return{n:name,a:A.a,st,same,hp:(A.hp||0)+(B.hp||0),spr:A.spr,cards:[...A.cards,...B.cards].map(bump),bases:[...(A.bases||[a.id]),...(B.bases||[b.id])],base,lvl,rx};}
function forge(){if(S.forged||!S.workshop)return;const p=forgePreview();if(!p||p.err){Bus.emit('bad',{});return;}
 const id='m'+(++uidc);ITEMS[id]={n:p.n,a:p.a,st:p.st,hp:p.hp,spr:p.spr,cards:p.cards,bases:p.bases,base:p.base,lvl:p.lvl};
 S.bench=[{uid:++uidc,id},null];S.forged=true;Bus.emit('forged',{name:p.n});log(`Verschmolzen: ${p.n}`);
 p.rx.forEach(r=>{if(!S.disc.has(r.n)){S.disc.add(r.n);log(`Reaktion entdeckt: ${r.n}`);}});Bus.emit('changed');}
// --- Inventar ---
function getAt(loc){const[k,i]=loc.split(':');if(k==='bag')return S.bag[+i];if(k==='bench')return S.bench[+i];return S.areas[k][+i];}
function setAt(loc,v){const[k,i]=loc.split(':');if(k==='bag')S.bag[+i]=v;else if(k==='bench')S.bench[+i]=v;else S.areas[k][+i]=v;}
function canPlace(it,loc){if(!it)return true;const[k,i]=loc.split(':');if(k==='bag'||k==='bench')return true;return def(it).a===k&&+i<S.slots[k];}
function move(from,to){
 if(busy||from===to||S.phase==='over'||S.phase==='start')return;
 if(S.phase==='fight'){Bus.emit('bad',{a:'IM KAMPF',b:'Umrüsten geht nur zwischen den Kämpfen.'});return;}
 if(to==='trash'){const it=getAt(from);if(!it)return;setAt(from,null);log(`Weggeworfen: ${def(it).n}`);Bus.emit('click');return after();}
 const[k,i]=to.split(':');if(k!=='bag'&&k!=='bench'&&+i>=S.slots[k]){Bus.emit('bad',{});return;}
 const a=getAt(from),b=getAt(to);if(!canPlace(a,to)||!canPlace(b,from)){Bus.emit('bad',{a:'PASST NICHT',b:a?'Gehört zu '+AREA_N[def(a).a]:''});return;}
 setAt(to,a);setAt(from,b);Bus.emit('pick');after();
}
function after(){S.hp=Math.min(Math.max(1,S.hp),maxHp());Bus.emit('changed');}
