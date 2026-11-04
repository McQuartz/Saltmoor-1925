// Autospieler: spielt Runs selbstständig nach einer einfachen gierigen Regel.
// Kampf: probiert jede bezahlbare Karte auf jedes Ziel mit der Schadens-Vorschau (previewCard) und nimmt die beste.
// Läuft schnell (FAST, synchron) im Browser (?bot=50&seed=1) und in Node (tools/bot.js).
const Bot={
 // Bewertung einer Karte aus der Vorschau
 wert(p,inc){if(!p)return-1;let v=0;p.foes.forEach(f=>{v+=f.d+f.ab*.4+(f.kill?12:0);});const offen=Math.max(0,inc-S.block);v+=Math.min(p.block,offen)*1.3+p.block*.1;v+=Math.max(0,p.hp)*.8;if(p.hp<0)v+=p.hp*(S.hp<15?2:.6);v+=p.energy*3;return v;},
 // beste Karte jetzt (für den geklickten Run in tools/selbst-spielen.js): {i,t} oder null
 besteKarte(){const inc=incoming();let best=null;S.hand.forEach((c,i)=>{if(cardCost(c)>S.energy)return;const ts=needsTarget(c)?alive().map(e=>S.enemies.indexOf(e)):[null];ts.forEach(t=>{const p=previewCard(i,t);const w=this.wert(p,inc)-cardCost(c)*.5+(p&&p.rx.length?2:0);if(!best||w>best.w)best={i,t,w};});});return best&&best.w>0?best:null;},
 kampfZug(){let guard=0;while(S.phase==='fight'&&!busy&&guard++<30){const inc=incoming();let best=null;
   S.hand.forEach((c,i)=>{if(cardCost(c)>S.energy)return;const ts=needsTarget(c)?alive().map(e=>S.enemies.indexOf(e)):[null];
    ts.forEach(t=>{const p=previewCard(i,t);const w=this.wert(p,inc)-cardCost(c)*.5+(p&&p.rx.length?2:0);if(!best||w>best.w)best={i,t,w};});});
   if(!best||best.w<=0)break;playCard(best.i,best.t);}
  if(S.phase==='fight'&&!busy)endTurn();},
 ausruesten(){// leere Slots aus dem Rucksack füllen, sonst schwächere Items tauschen (einfach: mehr Karten-Werte)
  const wertItem=it=>{const d=def(it);return d.cards.reduce((s,c)=>s+(c.atk||0)*(c.h||1)*(c.all?1.6:1)+(c.blk||0)+(c.heal||0)+(c.poison||0)*1.5+(c.burn||0)*1.5+(c.draw||0)*3-(c.c||0)*2,0)+(d.hp||0)+(d.passiv?6:0)+d.st.length*2;};
  for(let b=0;b<S.bag.length;b++){const it=S.bag[b];if(!it)continue;const a=def(it).a;
   for(let i=0;i<S.slots[a];i++){const cur=S.areas[a][i];if(!cur){move('bag:'+b,a+':'+i);break;}}}
  for(let b=0;b<S.bag.length;b++){const it=S.bag[b];if(!it)continue;const a=def(it).a;let worst=-1,wv=1e9;
   for(let i=0;i<S.slots[a];i++){const cur=S.areas[a][i];if(cur&&!roleState().some(x=>x.r.i.some(id=>bases(cur).includes(id))&&x.have.length>=2)){const w=wertItem(cur);if(w<wv){wv=w;worst=i;}}}
   if(worst>=0&&wertItem(it)>wv+2)move('bag:'+b,a+':'+worst);}
  // Rucksack voll halten vermeiden: schwächstes wegwerfen, wenn kein Platz
  if(!S.bag.includes(null)){let wi=-1,wv=1e9;S.bag.forEach((it,i)=>{if(it){const w=wertItem(it);if(w<wv){wv=w;wi=i;}}});if(wi>=0)move('bag:'+wi,'trash');}},
 wegIndex(){const o=S.weg;const hpq=S.hp/maxHp();const score=x=>({rast:hpq<.55?10:2,werkstatt:4,kraemer:S.gold>=40?(hpq<.5?8:5):1,wandbild:6,ereignis:4,fundstelle:5,kampf:hpq>.5?5:1,kampf_schwer:hpq>.75?6:0})[x.art]??3;let bi=0,bs=-1;o.forEach((x,i)=>{const s=score(x);if(s>bs){bs=s;bi=i;}});return bi;},
 eventIndex(){const ev=curEvent();let k=ev.o.findIndex(o=>condOk(o.if)&&!(o.fx||[]).some(f=>f.op==='lose_hp'&&S.hp<f.v+10||f.op==='fight'&&S.hp<maxHp()*.5));if(k<0)k=ev.o.findIndex(o=>condOk(o.if));return Math.max(0,k);},
 wegWahl(){const o=S.weg;const hpq=S.hp/maxHp();const score=x=>{switch(x.art){case'rast':return hpq<.55?10:2;case'werkstatt':return 4;case'kraemer':return S.gold>=40?(hpq<.5?8:5):1;
   case'wandbild':return 6;case'ereignis':return 4;case'fundstelle':return 5;case'kampf':return hpq>.5?5:1;case'kampf_schwer':return hpq>.75?6:0;default:return 3;}};
  let bi=0,bs=-1;o.forEach((x,i)=>{const s=score(x);if(s>bs){bs=s;bi=i;}});chooseWeg(bi);},
 schritt(){switch(S.phase){
  case'uebergang':leaveUebergang();break;
  case'biomwahl':{const an=S.angebote[S.akt];const job=JOBS.find(j=>j.id===S.job);let i=an.indexOf(job&&job.vorliebe);if(i<0)i=S.seed%an.length;chooseBiom(i);break;}
  case'weg':this.wegWahl();break;
  case'fight':this.kampfZug();break;
  case'reward':if(!S.picked){takeReward(S.bag.includes(null)?S.reward[0]:'');}this.ausruesten();leaveReward();break;
  case'event':{const ev=curEvent();let k=ev.o.findIndex(o=>condOk(o.if)&&!(o.fx||[]).some(f=>f.op==='lose_hp'&&S.hp<f.v+10||f.op==='fight'&&S.hp<maxHp()*.5));if(k<0)k=ev.o.findIndex(o=>condOk(o.if));chooseEvent(Math.max(0,k));break;}
  case'streichen':{const t=strikeTargets();const w=t.find(it=>def(it).cards.every(c=>!c.atk&&!c.blk));if(w)strikeItem(w.uid);else skipStrike();break;}
  case'kraemer':{if(S.hp<maxHp()*.75&&!S.shop.heal&&S.gold>=BAL.shop.heal.price)buy('heal');S.shop.items.map((o,i)=>[o,i]).sort((a,b)=>(ITEMS[b[0].id].rare?1:0)-(ITEMS[a[0].id].rare?1:0)).forEach(([o,i])=>{if(!o.sold&&S.gold>=o.price&&S.bag.includes(null))buy(i);});this.ausruesten();leaveNode();break;}
  case'kraemer_streichen':kraemerStrike(null);break;
  case'werkstatt':{const cand=[...S.bag.map((it,i)=>it?'bag:'+i:null),...AREAS.flatMap(a=>S.areas[a].map((it,i)=>it?a+':'+i:null))].filter(Boolean);let done=false;
   for(let i=0;i<cand.length&&!done;i++)for(let j=0;j<cand.length&&!done;j++){if(i===j)continue;const A=getAt(cand[i]),B=getAt(cand[j]);if(!A||!B||def(A).a!==def(B).a)continue;
    S.bench=[A,B];const p=forgePreview();S.bench=[null,null];if(p&&!p.err&&p.same){setAt(cand[i],null);setAt(cand[j],null);S.bench=[A,B];forge();const nw=S.bench[0];S.bench=[null,null];setAt(cand[i],nw);done=true;}}
   this.ausruesten();leaveNode();break;}
  case'rast':if(S.hp<maxHp()*.7)rastHeal();else{const w=act('waffe')[0];if(w){const loc=AREAS.flatMap(a=>S.areas[a].map((it,i)=>it===w?a+':'+i:null)).find(Boolean);rastUpgrade(loc);}else rastHeal();}leaveNode();break;
  case'wandbild':leaveNode();break;
  case'fund':takeFund();this.ausruesten();leaveNode();break;
  case'ankunft':chooseEnde(S.seed%2?'bleiben':'umkehren');break;
  default:return false;}return true;},
 // Ganzer Run, schnell. Gibt das Ergebnis zurück.
 spiele(job,seed,opt={}){const kf=FAST;FAST=true;let fehler=null,n=0;try{const M=opt.meta?Meta.get():null;const sv=M&&M.start.length?M.start[M.start.length-1]:null;newRun(job,seed,{dev:!opt.meta,start:sv,stufe:opt.stufe||0});
   while(!['strand','ende'].includes(S.phase)&&n++<5000){if(!this.schritt())throw new Error('Bot hängt in Phase '+S.phase);}
   if(n>=5000)throw new Error('Run endet nicht');}catch(e){fehler=String(e&&e.stack||e);}finally{FAST=kf;}
  const res=S.ergebnis||{};return{seed,job,sieg:!!res.sieg,ende:res.ende||null,tiefe:S.depth,akt:S.akt,biom:biomId(),route:S.route.join('>'),gegner:res.gegner||[],kaempfe:S.stats.kaempfe,zuege:S.stats.zuege||0,gold:S.stats.gold,fehler};}
};
