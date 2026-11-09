// Autospieler: spielt Runs selbstständig nach einer einfachen gierigen Regel.
// Kampf: probiert jede bezahlbare Karte auf jedes Ziel mit der Schadens-Vorschau (previewCard) und nimmt die beste.
// Läuft schnell (FAST, synchron) im Browser (?bot=50&seed=1) und in Node (tools/bot.js).
const Bot={
 // Bewertung einer Karte aus der Vorschau
 // Wert einer Karte aus der Vorschau: sofortiger Schaden plus erwarteter Schaden von Gift/Brand (über die Züge), Verwundbar, Schwächung, Stärke, Block nach Bedarf
 wert(p,inc){if(!p)return-1;let v=0;p.foes.forEach(f=>{if(f.hp<=0&&!f.kill)return;v+=f.d+f.ab*.4+(f.kill?12:0);const g=Math.max(0,f.gift),b=Math.max(0,f.brand);v+=Math.min(f.hp,g*(g+1)/2)*.7+Math.min(f.hp,b*1.8)*.7+(f.vuln>0?f.vuln*3:0)+(f.weak?4:0);});
  v+=(p.str||0)*4;const offen=Math.max(0,inc-S.block);v+=Math.min(p.block,offen)*1.3+p.block*.1;v+=Math.max(0,p.hp)*.8;if(p.hp<0)v+=p.hp*(S.hp<15?2:.6);v+=p.energy*3;v+=(p.gold||0)*(this.profil&&this.profil.gold_rest?.3:.15);return v;},
 // beste Karte jetzt (für den geklickten Run in tools/selbst-spielen.js): {i,t} oder null
 besteKarte(){const inc=typeof incomingGehoert==='function'?incomingGehoert():incoming();/* M6: der Bot hört stumme Gegner wie ein Spieler */let best=null;S.hand.forEach((c,i)=>{if(cardCost(c)>S.energy)return;const ts=needsTarget(c)?alive().map(e=>S.enemies.indexOf(e)):[null];ts.forEach(t=>{const p=previewCard(i,t);const w=this.wert(p,inc)-cardCost(c)*.5+(p&&p.rx.length?2:0);if(!best||w>best.w)best={i,t,w};});});return best&&best.w>0?best:null;},
 // M8: die Farbe binden, wenn es geht: erst eine Karte des Farbe-Items, direkt danach eine Karte mit eigenem Salz
 // M9 Asche: Salz, dann Feuer ruft einen Verbündeten (der Bot ruft, wenn Asche da ist und kein Verbündeter steht); Das Zeichen spielt er, sobald er es zieht (er gibt der Tiefe nach)
 ascheWert(c){if(c&&c.zeichen)return 20;if(typeof Asche==='undefined'||!Zettel.hat('asche')||!(S.asche&&S.asche.length)||S.verbuendeter)return 0;const e=Asche.eigene(c);const z=S.zugKarten||[];const vor=z[z.length-1];
  if(vor&&Asche.eigene(vor).includes('S')&&e.includes('F'))return 10;if(vor&&Asche.eigene(vor).includes('F')&&e.includes('S'))return -6;
  if(e.includes('S')&&S.hand.some(x=>x!==c&&Asche.eigene(x).includes('F')&&cardCost(x)<=S.energy-cardCost(c)))return 4;return 0;},
 farbeWert(c){if(typeof Farbe==='undefined'||!S.farbe||S.farbe.gebunden)return 0;const salz=x=>!Farbe.karte(x)&&(x.st0||x.st).includes('S');
  const z=S.zugKarten||[];const vor=z[z.length-1];if(salz(c)&&Farbe.karte(vor))return 8;
  if(Farbe.karte(c)&&S.hand.some(x=>x!==c&&salz(x)&&cardCost(x)<=S.energy-cardCost(c)))return 4;return 0;},
 kampfZug(){let guard=0;if(S.begegnung&&typeof Tiefe!=='undefined'){Tiefe.weiter();return;} /* M9: Begegnung, weitergehen */if(S.blickWahl&&typeof Blick!=='undefined')Blick.waehlen(Blick.botWahl()); /* M7: hinsehen, wenn Leben über 60 % */this.biegZugbeginn();while(S.phase==='fight'&&!busy&&guard++<30){const inc=typeof incomingGehoert==='function'?incomingGehoert():incoming();/* M6: der Bot hört stumme Gegner wie ein Spieler */let best=null;
   S.hand.forEach((c,i)=>{if(cardCost(c)>S.energy)return;const ts=needsTarget(c)?alive().map(e=>S.enemies.indexOf(e)):[null];const bw=this.biegWert(c,inc)+this.farbeWert(c)+this.ascheWert(c);
    ts.forEach(t=>{const p=previewCard(i,t);const w=this.wert(p,inc)-cardCost(c)*.5+(p&&p.rx.length?2:0)+bw;if(!best||w>best.w)best={i,t,w};});});
   if(!best||best.w<=0)break;playCard(best.i,best.t);}
  if(S.phase==='fight'&&!busy)endTurn();},
 // ---------- Regelbiegung (Auftrag 3 M5): der Bot kennt die Biegung und spielt auf sie hin, über dieselben Einhakpunkte wie der Kampf ----------
 // Zusatzwert einer Karte durch die Biegung (zu dem, was die Vorschau schon sieht)
 biegWert(c,inc){const b=Bieg.aktiv();if(!b)return 0;let v=0;
  // Über Eck: als dritte oder spätere Karte zählt, ob sie mit der ersten Karte des Zuges den Kreis schließt
  if(b.id==='ueber_eck'&&(S.zugSt||[]).length>=2){const innen=reactionsFor([],c.st);v+=reactionsFor(S.zugSt[0],c.st).filter(r=>!innen.includes(r)).length*5;}
  // Aufgewogen: übrige Energie ist Block wert, eine Karte muss mehr bringen als 3 Block je Energie
  // Nur der Teil zählt, der wirklich einen Treffer fängt, sonst würde der Bot gar nicht mehr angreifen
  if(b.id==='aufgewogen'){const offen=Math.max(0,inc-S.block),e=S.energy,k=cardCost(c);v-=1.3*(Math.min(offen,3*e)-Math.min(offen,3*Math.max(0,e-k)));}
  return v;},
 // Wert einer Karte für Tausch-Entscheidungen (Spiegelbild)
 kartenWert(c){if(!c||c.unspielbar)return -9;return this.hgWertRoh(c);},
 biegZugbeginn(){if(typeof Bieg==='undefined')return;
  // Das Spiegelbild ist voraus: die offene oberste Karte gegen die schwächste Handkarte tauschen, wenn sie klar besser ist
  if(Bieg.spiegelKann()){const top=Bieg.spiegelOffen();let wi=-1,wv=1e9;S.hand.forEach((c,i)=>{const v=this.kartenWert(c);if(v<wv){wv=v;wi=i;}});if(wi>=0&&this.kartenWert(top)>wv+2)Bieg.spiegelTausch(wi);}},
 wertItem(it){const P=this.profil;const d=def(it);return (P&&(P.items||[]).includes(it.id)?12:0)+(P?d.st.filter(k=>(P.stoffe||[]).includes(k)).length*3:0)+hgVon(it).length*3+(d.eigen?6:0)+d.cards.reduce((s,c)=>s+(c.atk||0)*(c.h||1)*(c.all?1.6:1)+(c.blk||0)+(c.heal||0)+(c.poison||0)*1.5+(c.burn||0)*1.5+(c.draw||0)*3-(c.c||0)*2,0)+(d.hp||0)+(d.passiv?6:0)+d.st.length*2;},
 ausruesten(){// leere Slots aus dem Rucksack füllen, sonst schwächere Items tauschen (einfach: mehr Karten-Werte)
  const wertItem=it=>this.wertItem(it);
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
 // Wert eines Handgriffs (grob, für Wahl und Kauf)
 profil:null, // Build-Bot: {build, items:[], handgriffe:[], stoffe:[]} aus data/builds.json
 hgWert(id){const c=HANDGRIFFE[id];if(!c||c.unspielbar)return -9;const P=this.profil;const bonus=P?((P.handgriffe||[]).includes(id)?5:0)+(c.build===P.build?2:0):0;return bonus+this.hgWertRoh(c);},
 hgWertRoh(c){const atk=(c.atk||0)*(c.x?3:(c.h||1))*(c.all?1.6:1)+(c.sonder&&c.sonder.art==='ueber_bord'&&c.sonder.je?c.sonder.je:0);return atk+(c.blk||0)*.9+(c.heal||0)+(c.poison||0)*1.6+(c.burn||0)*1.6+(c.draw||0)*3+(c.en||0)*4+(c.str||0)*4+(c.vuln||0)*2.5+(c.weak?3:0)+(c.funke?2:0)+(c.kette||0)*2+(c.behalten?1:0)+(c.sonder?(this.ballastFx(c)&&!allActive().some(it=>/^ballast_/.test((def(it).eigen||{}).typ||''))?-3:4):0)-(c.opfer?c.opfer*.6:c.zoll?1+c.zoll*.2:(c.c||0)*2.5)+(c.gold||0)*.5;},
 // Erzeugt die Karte Ballast? Ohne Ballast-Reliquie ist das für den Bot nur eine tote Karte mehr
 ballastFx(c){return !!(c.sonder&&(c.sonder.fx||[]).some(f=>f.op==='ballast'));},
 // Bestes Item zum Ritzen: angelegt, freie Kerbe, Stoffe mit möglichst vielen Reaktionen im Deck; sonst schwächsten Handgriff überschreiben
 ritzen(){const id=S.hgPending;if(!id)return false;const st=allActive().flatMap(it=>def(it).st);
  const rx=D=>REACT.filter(r=>{const[a,b]=[...r.k];return(D.st.includes(a)&&st.includes(b))||(D.st.includes(b)&&st.includes(a));}).length;
  const P=this.profil;const kand=besitz().filter(b=>b.an).map(b=>({...b,frei:kerbenVon(b.it)-hgVon(b.it).length,w:rx(def(b.it))+def(b.it).st.length*.3+(P?def(b.it).st.filter(k=>(P.stoffe||[]).includes(k)).length*3:0)}));
  const frei=kand.filter(k=>k.frei>0).sort((a,b)=>b.w-a.w);if(frei.length)return placeHandgriff(frei[0].it.uid);
  let best=null;kand.forEach(k=>hgVon(k.it).forEach((h,i)=>{if((def(k.it).fest_hg||[]).includes(h))return;const d=this.hgWert(id)-this.hgWert(h);if(d>1&&(!best||d>best.d))best={uid:k.it.uid,i,d};}));
  if(best)return placeHandgriff(best.uid,best.i);hgVerwerfen();return true;},
 schritt(){switch(S.phase){
  case'event_hg':case'kraemer_hg':this.ritzen();break;
  case'wahl':{const w=S.wahl;if(w.art==='schleifen'){let best=null;besitz().filter(b=>b.an).forEach(({it})=>{const D=def(it);D.cards.forEach((c,ci)=>{if(c.c>=1&&!(it.schliff&&it.schliff['s'+ci])&&(!best||c.c>best.c))best={uid:it.uid,key:'s'+ci,c:c.c+.5};});hgVon(it).forEach((h,k)=>{const H=HANDGRIFFE[h];if(H&&H.c>=1&&!(it.schliff&&it.schliff['h'+k])&&(!best||H.c>best.c))best={uid:it.uid,key:'h'+k,c:H.c};});});if(best)schleifen(best.uid,best.key);else wahlAbbrechen();}
   else if(w.art==='kerbe'){const k=besitz().filter(b=>b.an&&kerbenVon(b.it)<3).sort((a,b)=>kerbenVon(a.it)-kerbenVon(b.it))[0];if(k)kerbeDazu(k.it.uid);else wahlAbbrechen();}
   else wahlAbbrechen();break;}
  case'uebergang':leaveUebergang();break;
  case'erbe':Metaebene.erbeWahl(true);break; // M10: das Erbe nimmt er immer
  case'biomwahl':{const an=S.angebote[S.akt];const job=JOBS.find(j=>j.id===S.job);let i=an.indexOf(job&&job.vorliebe);if(i<0)i=S.seed%an.length;chooseBiom(i);break;}
  case'weg':this.wegWahl();break;
  case'fight':this.kampfZug();break;
  case'reward':if(S.hgPending&&!S.hgPicked){this.ritzen();break;}
   if(!S.hgPicked){const best=[...S.rewardHg].sort((a,c)=>this.hgWert(c)-this.hgWert(a))[0];if(best&&this.hgWert(best)>2){takeHandgriff(best);break;}skipHandgriff();break;}
   if(!S.picked&&S.reward.length){const P=this.profil;const w=id=>(P&&(P.items||[]).includes(id)?10:0)+(P?ITEMS[id].st.filter(k=>(P.stoffe||[]).includes(k)).length*3:0)+(rarOf(ITEMS[id])==='reliquie'?5:rarOf(ITEMS[id])==='selten'?2:0);const best=[...S.reward].sort((a,c)=>w(c)-w(a))[0];takeReward(S.bag.includes(null)?best:'');}this.ausruesten();leaveReward();break;
  case'event':{const ev=curEvent();let k=ev.o.findIndex(o=>condOk(o.if)&&!(o.fx||[]).some(f=>f.op==='lose_hp'&&S.hp<f.v+10||f.op==='fight'&&S.hp<maxHp()*.5));if(k<0)k=ev.o.findIndex(o=>condOk(o.if));chooseEvent(Math.max(0,k));break;}
  case'streichen':{const t=strikeTargets();const w=t.find(it=>def(it).cards.every(c=>!c.atk&&!c.blk));if(w)strikeItem(w.uid);else skipStrike();break;}
  case'kraemer':{if(S.shop.art==='tausch'){S.shop.items.forEach((o,i)=>{if(o.sold)return;let wl=null,wv=1e9;S.bag.forEach((it,b)=>{if(it){const w=this.wertItem(it);if(w<wv){wv=w;wl='bag:'+b;}}});if(wl&&this.wertItem({id:o.id,uid:-1})>wv+3){S.sel=wl;buy(i);}});S.sel=null;}
   const rest=this.profil&&this.profil.gold_rest&&['gold_schaden','gold_block','faehrgeld','gold_energie'].some(t=>passive(t).length)?this.profil.gold_rest:0; // Goldreserve des Profils, sobald Gold im Kampf zählt (Kollekte)
   if(S.hp<maxHp()*.75&&!S.shop.heal&&S.gold>=BAL.shop.heal.price)buy('heal');
   {const i=(S.shop.hg||[]).findIndex(o=>!o.sold&&S.gold>=o.price+15+rest&&this.hgWert(o.id)>4);if(i>=0){kaufeHandgriff(i);break;}}S.shop.items.map((o,i)=>[o,i]).sort((a,b)=>(ITEMS[b[0].id].rare?1:0)-(ITEMS[a[0].id].rare?1:0)).forEach(([o,i])=>{const eigen=this.profil&&(this.profil.items||[]).includes(o.id);if(!o.sold&&S.gold>=o.price+(eigen?0:rest)&&S.bag.includes(null))buy(i);});this.ausruesten();leaveNode();break;}
  case'kraemer_streichen':kraemerStrike(null);break;
  case'werkstatt':{const cand=[...S.bag.map((it,i)=>it?'bag:'+i:null),...AREAS.flatMap(a=>S.areas[a].map((it,i)=>it?a+':'+i:null))].filter(Boolean);let done=false;
   for(let i=0;i<cand.length&&!done;i++)for(let j=0;j<cand.length&&!done;j++){if(i===j)continue;const A=getAt(cand[i]),B=getAt(cand[j]);if(!A||!B||def(A).a!==def(B).a)continue;
    S.bench=[A,B];const p=forgePreview();S.bench=[null,null];if(p&&!p.err&&p.same){setAt(cand[i],null);setAt(cand[j],null);S.bench=[A,B];forge();const nw=S.bench[0];S.bench=[null,null];setAt(cand[i],nw);done=true;}}
   if(!S.forged){const k=besitz().filter(b=>b.an&&kerbenVon(b.it)<3)[0];if(k){S.wahl={art:'kerbe',quelle:'werkstatt',phase:'werkstatt'};kerbeDazu(k.it.uid);}}
   this.ausruesten();leaveNode();break;}
  case'rast':{if(S.rastDone){leaveNode();break;}const schleifbar=besitz().some(({it,an})=>an&&(def(it).cards.some((c,ci)=>c.c>=1&&!(it.schliff&&it.schliff['s'+ci]))||hgVon(it).some((h,k)=>HANDGRIFFE[h]&&HANDGRIFFE[h].c>=1&&!(it.schliff&&it.schliff['h'+k]))));
   if(S.hp<maxHp()*.65||!schleifbar||S._botRast===S.depth)rastHeal();else{S._botRast=S.depth;wahlStart('schleifen','rast');break;}leaveNode();break;}
  case'wandbild':leaveNode();break;
  case'fund':takeFund();this.ausruesten();leaveNode();break;
  case'ankunft':chooseEnde(S.seed%2?'bleiben':'umkehren');break;
  default:return false;}return true;},
 // Ganzer Run, schnell. Gibt das Ergebnis zurück.
 spiele(job,seed,opt={}){this.profil=opt.profil||null;const kf=FAST;FAST=true;let fehler=null,n=0;try{const M=opt.meta?Meta.get():null;const sv=M&&M.start.length?M.start[M.start.length-1]:null;newRun(job,seed,{dev:!opt.meta,start:sv,stufe:opt.stufe||0,...(opt.route?{route:opt.route}:{})});if(opt.nachStart)opt.nachStart();
   while(!['strand','ende'].includes(S.phase)&&n++<5000){if(!this.schritt())throw new Error('Bot hängt in Phase '+S.phase);}
   if(n>=5000)throw new Error('Run endet nicht');}catch(e){fehler=String(e&&e.stack||e);}finally{FAST=kf;}
  const res=S.ergebnis||{};return{seed,job,sieg:!!res.sieg,ende:res.ende||null,tiefe:S.depth,akt:S.akt,biom:biomId(),route:S.route.join('>'),gegner:res.gegner||[],kaempfe:S.stats.kaempfe,zuege:S.stats.zuege||0,gold:S.stats.gold,fehler};}
};
