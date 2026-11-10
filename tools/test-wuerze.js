// Auftrag 3 M11: Würze. node tools/test-wuerze.js [seeds=100]
// Zettel über 100 Seeds (höchstens drei Stücke, Mittel etwa 1,5, kein Stück in zwei aufeinanderfolgenden Runs), jedes Stück einzeln erzwungen und geprüft, Bots mit allen Stücken.
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const run=K.run;let fehler=0,n=0;const ok=(c,m)=>{n++;if(!c){fehler++;console.log('FEHLER: '+m);}else console.log('ok    '+m);};
 const seeds=+(process.argv[2]||100);
 // --- Zettel über aufeinanderfolgende Runs (echte Runs, Meta zählt mit) ---
 run('Meta.reset()');const anz=[],je={};let doppelt=0,vor=[];
 for(let s=1;s<=seeds;s++){const z=run(`(()=>{newRun(JOBS[${s}%9].id,${s},{});if(S.phase==='erbe')Metaebene.erbeWahl(false);return S.zettel.wuerze})()`);anz.push(z.length);z.forEach(x=>{je[x]=(je[x]||0)+1;if(vor.includes(x))doppelt++;});vor=z;}
 const mittel=anz.reduce((a,b)=>a+b,0)/anz.length;const vert=[0,1,2,3].map(k=>anz.filter(x=>x===k).length);
 ok(Math.max(...anz)<=3,`${seeds} Seeds: höchstens drei Stücke je Run (Verteilung 0/1/2/3: ${vert.join('/')})`);
 ok(mittel>=1.2&&mittel<=1.8,`Mittel ${mittel.toFixed(2)} Stücke je Run (soll etwa 1,5); je Stück: ${JSON.stringify(je)}`);
 ok(doppelt===0,`kein Stück in zwei aufeinanderfolgenden Runs (${doppelt} Wiederholungen)`);
 ok(!Object.keys(je).some(k=>['grabbeigabe','licht','luegt'].includes(k)),'abgeschaltete Stücke (Grabbeigabe, Licht im Turm, Lügender Kartentext) kommen nicht');
 const neu=(z,seed=7,job='fischer')=>run(`(()=>{Meta.reset();newRun('${job}',${seed},{});S.zettel.wuerze=${JSON.stringify(z)};})()`);
 // --- Zeitungsausschnitte ---
 let z=0,v=0,ue=0;for(let s=1;s<=40;s++){neu(['zeitung'],s);for(let a=1;a<=4;a++){run(`S.akt=${a};S.route[${a}]=null;enterAct();if(S.phase==='biomwahl')chooseBiom(0);`);ue++;if(run('!!Wuerze.zeitungJetzt()'))z++;}}
 ok(z>ue*.3&&z<ue*.7,`Zeitung in ${z} von ${ue} Übergängen (nicht in jedem)`);
 for(let s=1;s<=40;s++){neu(['zeitung'],s);run('Meta.get().runs=12');for(let a=1;a<=4;a++){run(`S.akt=${a};S.route[${a}]=null;enterAct();if(S.phase==='biomwahl')chooseBiom(0);`);if(run('!!(S.zeitung&&S.zeitung.vermisst&&S.zeitung.akt===S.akt)'))v++;}}
 ok(v>0&&v<=40,`ab dem 10. Run: Vermisstenanzeige in ${v} von 40 Runs (höchstens einmal je Run)`);
 neu(['zeitung'],3);run('Meta.get().runs=3');let vv=0;for(let s=1;s<=30;s++){neu(['zeitung'],s);for(let a=1;a<=4;a++){run(`S.akt=${a};S.route[${a}]=null;enterAct();if(S.phase==='biomwahl')chooseBiom(0);`);if(run('!!(S.zeitung&&S.zeitung.vermisst)'))vv++;}}
 ok(vv===0,'vor dem 10. Run nie die Vermisstenanzeige');
 // --- Der falsche Brief ---
 neu(['brief'],5);run(`S.phase='weg';enterNode({art:'ereignis'})`);ok(run('S.event')==='falscher_brief'&&run('!!curEvent()&&curEvent().o.length===2'),'Brief: erstes Ereignis in Akt I ist der Brief');
 run('chooseEvent(0)');const ziel=run('S.brief.ziel'),zakt=run('S.brief.akt');ok(run('S.brief.angenommen')&&zakt>=1&&zakt<=3,`Brief eingesteckt: verspricht ${ziel} in Akt ${zakt+1}`);
 run(`finishNodeSicher=()=>{};S.akt=${zakt};S.route[${zakt}]=null;enterAct();`);ok(run(`(S.angebote[${zakt}]||[S.route[${zakt}]]).includes('${ziel}')`),'Biomwahl: das versprochene Biom steht im Angebot');
 run(`if(S.phase==='biomwahl')chooseBiom(S.angebote[${zakt}].indexOf('${ziel}'));leaveUebergang();`);const bk=run('(()=>{let k=null;S.netz.ebenen.forEach((l,e)=>l.forEach((v,i)=>{if(v.brief)k=[e,i,v.art];}));return k;})()');
 ok(bk&&!/kampf|waechter/.test(bk[2]),`Peilkarte: Brief-Knoten auf Ebene ${bk&&bk[0]} (${bk&&bk[2]})`);
 run(`Meta.get().vorgaenger={job:'veteran',items:['rosary','lantern'],tiefe:14,biom:'salz',max:40};enterNode({art:'${bk[2]}',ziel:[${bk[0]},${bk[1]}]})`);
 ok(run('S.phase')==='brief'&&['rosary','lantern'].includes(run('S.briefAngebot.item')),'Brief-Knoten mit Vorgänger: er bietet eines seiner Items');
 const vorher=run('allActive().length+S.bag.filter(Boolean).length');run('Wuerze.briefNehmen(true)');ok(run('allActive().length+S.bag.filter(Boolean).length')===vorher+1,'Item genommen, Knoten fertig');
 neu(['brief'],5);run(`S.phase='weg';enterNode({art:'ereignis'});chooseEvent(0);Meta.get().vorgaenger=null;S.akt=S.brief.akt;S.route[S.akt]=S.brief.ziel;enterAct();leaveUebergang();`);
 const bk2=run('(()=>{let k=null;S.netz.ebenen.forEach((l,e)=>l.forEach((v,i)=>{if(v.brief)k=[e,i,v.art];}));return k;})()');run(`enterNode({art:'${bk2[2]}',ziel:[${bk2[0]},${bk2[1]}]})`);
 ok(run('S.phase')==='brief'&&!run('S.briefAngebot.item')&&run("Meta.get().seiten.some(s=>s.art==='brief')"),'Brief-Knoten ohne verlorenen Run: leer, der Brief bleibt im Tagebuch');
 neu(['brief'],5);run(`S.phase='weg';enterNode({art:'ereignis'});chooseEvent(1);`);ok(!run('S.brief.angenommen'),'Brief liegen gelassen: kein Knoten');
 neu([],5);run(`S.phase='weg';enterNode({art:'ereignis'})`);ok(run('S.event')!=='falscher_brief','ohne Zettel kein Brief');
 // --- Barmherzige Trennung ---
 neu(['trennung'],9);for(let i=0;i<4;i++)run(`S.phase='weg';enterNode({art:'fundstelle'})`);ok(run("JSON.stringify(S.lose)")==='["tr_relief","tr_ausschnitt","tr_aussage"]','Trennung: drei Teile an drei Fundstellen, die vierte bringt keinen');
 ok(run("deckListe().filter(c=>c.trennung).every(c=>c.c===0)")&&run("deckListe().filter(c=>c.trennung).length")===3,'Teile sind 0-Kosten-Karten im Deck');
 const kampf=`(()=>{leaveUebergang?0:0;const g=biom().gegner.filter(k=>(FOES[k].rang||'normal')==='normal').slice(0,2);startFight(g,'kampf');S.blickWahl=null;})()`;
 run(kampf);run(`(()=>{const a=deckListe().find(c=>c.trennung==='relief');S.hand=[a,...S.hand];S.energy=3;playCard(0,0);const x=S.hand.find(c=>!c.trennung&&cardCost(c)<=S.energy);if(x)playCard(S.hand.indexOf(x),0);const b=deckListe().find(c=>c.trennung==='aussage');S.hand=[b,...S.hand];playCard(0,0);})()`);
 ok(!run('!!S.trennungOffen'),'zwei Teile mit einer anderen Karte dazwischen: nichts');
 run(`(()=>{const a=deckListe().find(c=>c.trennung==='relief');S.hand=[a,...S.hand];playCard(0,0);const b=deckListe().find(c=>c.trennung==='ausschnitt');S.hand=[b,...S.hand];playCard(0,0);})()`);
 ok(run('!!S.trennungOffen'),'zwei Teile direkt nacheinander: der Zusammenhang');
 run('S.enemies.forEach(e=>e.hp=0);fightWon()');ok(run('S.phase')==='wahl'&&run("S.wahl.art")==='trennung','nach dem Sieg: Wahl des Handgriffs');
 const h=run('(()=>{const x=Wuerze.handgriffe()[0];Wuerze.trennen(x.it.uid,x.k);return [x.it.uid,x.k]})()');ok(run(`!!allActive().find(i=>i.uid===${h[0]}).fremd.h${h[1]}`)&&run('S.phase')==='reward'&&run(`deckListe().some(c=>c.uid===${h[0]}&&c.fremd)`),'Handgriff dauerhaft fremd, zurück zur Belohnung');
 run(kampf);run(`(()=>{const a=deckListe().find(c=>c.trennung==='relief');S.hand=[a,...S.hand];S.energy=3;playCard(0,0);const b=deckListe().find(c=>c.trennung==='aussage');S.hand=[b,...S.hand];playCard(0,0);})()`);ok(!run('!!S.trennungOffen'),'einmal pro Run');
 // --- Zanns Takt ---
 neu(['zann'],11);run("S.akt=1;S.route[1]='glockengiesserei';enterAct();");ok(run('S.sicheresBeute')==='zanns_geige','Glockengießerei mit zann: die Geige kommt sicher als nächste Beute');
 ok(run("dropPool().includes('zanns_geige')"),'Geige im Fundpool der Glockengießerei');run("S.route[1]='kloster'");ok(!run("dropPool().includes('zanns_geige')"),'nicht in anderen Biomen');run("S.route[1]='glockengiesserei'");
 run("giveItem('zanns_geige','Test');const b=S.bag.findIndex(x=>x&&x.id==='zanns_geige');for(let i=0;i<S.slots.talisman;i++){if(!S.areas.talisman[i]){move('bag:'+b,'talisman:'+i);break;}}if(!allActive().some(i=>i.id==='zanns_geige'))move('bag:'+b,'talisman:0');");
 ok(run("allActive().some(i=>i.id==='zanns_geige')"),'Geige angelegt');
 run("startFight(['ungetaufte'],'waechter');S.blickWahl=null;");ok(run('S.zannKampf'),'Kampf gegen die Ungetaufte mit Geige: Zanns Takt aktiv');
 const w0=run("(()=>{const w=S.enemies[0];let bi=-1,bv=-1;w.pat.forEach((x,i)=>{if(x.t==='atk'){const v=(x.v||0)*(x.h||1);if(v>bv){bv=v;bi=i;}}});return bi})()");
 run("(()=>{const g=deckListe().find(c=>c.src===ITEMS.zanns_geige.n);S.hand=[g,...S.hand];S.energy=3;playCard(0,0);})()");const piA=run('S.enemies[0].pi');run('busy=false;FAST=true;endTurn()');
 ok(run('S.enemies[0].pi')===piA+1&&!run('S.zannAus'),'Zug mit Geige: Wächter wie immer');
 run('busy=false;S.energy=3;endTurn()');ok(run('S.enemies[0].pi%S.enemies[0].pat.length')===w0&&run('S.zannAus'),`Zug ohne Geige: Fenster offen, nächster Schritt ist der stärkste (Schritt ${w0})`);
 run("(()=>{busy=false;const g=deckListe().find(c=>c.src===ITEMS.zanns_geige.n);S.hand=[g,...S.hand];S.energy=3;playCard(0,0);})()");ok(!run('S.zannAus'),'wieder gespielt: Fenster zu');
 run("startFight(['ungetaufte'],'waechter');S.blickWahl=null;S.areas.talisman=S.areas.talisman.map(i=>i&&i.id==='zanns_geige'?null:i);");run('busy=false;endTurn()');ok(!run('S.zannAus'),'ohne Geige: Wächter wie immer');
 // --- Zugabe, Probe: Der Krämer mit tausend Masken ---
 neu(['masken'],7);run(`S.akt=1;S.route[1]=S.route[1]||RUN.akte[1].biome.find(b=>BIOMES[b]);S.phase='weg';enterNode({art:'kraemer'})`);
 ok(run('!!S.shop.masken&&!!S.masken'),'Masken: der erste Krämer in Akt II schreibt an');
 const kr=run(`(()=>{const i=S.shop.items.findIndex(o=>!o.sold&&!o.tausch);const g=S.gold;const id=S.shop.items[i].id;Wuerze.anschreiben(i);return{g0:g,g1:S.gold,id,hat:besitz().some(b=>b.it.id===id),schuld:S.masken.schuld&&S.masken.schuld.id}})()`);
 ok(kr.g0===kr.g1&&kr.hat&&kr.schuld===kr.id,`angeschrieben ohne Gold: ${kr.id}`);
 run(`(()=>{const i=S.shop.items.findIndex(o=>!o.sold&&!o.tausch);if(i>=0)Wuerze.anschreiben(i);})()`);ok(run('S.shop.items.filter(o=>o.kredit).length')===1,'nur ein Stück auf Kredit');
 run(`leaveNode();S.akt=2;S.route[2]=S.route[2]||RUN.akte[2].biome.find(b=>BIOMES[b]);enterAct()`);
 ok(run(`S.phase==='wahl'&&S.wahl.art==='masken'`),'Anfang von Akt III: er kassiert (Wahl eines Handgriffs)');
 const hgVor=run('Wuerze.maskenHandgriffe().length');run(`(()=>{const x=Wuerze.maskenHandgriffe()[0];Wuerze.bezahlen(x.it.uid,x.k);})()`);
 ok(run('Wuerze.maskenHandgriffe().length')===hgVor-1&&run(`S.phase==='uebergang'&&S.masken.bezahlt`),'bezahlt: ein Handgriff weniger, zurück im Übergang');
 run(`S.akt=3;S.route[3]=S.route[3]||RUN.akte[3].biome.find(b=>BIOMES[b]);enterAct()`);ok(run(`S.phase==='uebergang'`),'danach kassiert er nicht noch einmal');
 run(`S.phase='weg';enterNode({art:'kraemer'})`);ok(run('!S.shop.masken'),'einmal je Run');
 neu([],7);run(`S.akt=1;S.route[1]=S.route[1]||RUN.akte[1].biome.find(b=>BIOMES[b]);S.phase='weg';enterNode({art:'kraemer'})`);ok(run('!S.shop.masken'),'ohne Zettel kein Masken-Krämer');
 run('BAL.auftrag3.masken=false');ok(!run(`Wuerze.stuecke().some(s=>s.id==='masken')`),'Schalter masken aus: das Stück wird nicht gewürfelt');run('BAL.auftrag3.masken=true');
 // --- Schalter ---
 run('BAL.auftrag3.wuerze=false');run(`(()=>{Meta.reset();newRun('fischer',3,{});})()`);ok(run('S.zettel.wuerze.length')===0,'wuerze aus: leerer Zettel');run('BAL.auftrag3.wuerze=true');
 // --- Bots mit allen vier Stücken ---
 run('Meta.reset()');let bf=0,sieg=0;const zahl={zeitung:0,brief:0,briefKnoten:0,teile:0,trennung:0,geige:0,zann:0};
 for(let s=1;s<=30;s++){const r=run(`(()=>{const x=Bot.spiele(JOBS[${s}%9].id,${s},{nachStart:()=>{S.zettel.wuerze=['zeitung','brief','trennung','zann','masken'];}});return {x,z:(S.zeitungGesehen||[]).length,b:!!(S.brief&&S.brief.angenommen),t:S.trennungTeile||0,tf:!!S.trennungFertig,g:allActive().some(i=>i.id==='zanns_geige')||S.bag.some(i=>i&&i.id==='zanns_geige'),bk:!!(S.netz&&0)}})()`);
  if(r.x.fehler){bf++;console.log(r.x.fehler.split('\n').slice(0,3).join(' | '));}if(r.x.sieg)sieg++;zahl.zeitung+=r.z;if(r.b)zahl.brief++;zahl.teile+=r.t;if(r.tf)zahl.trennung++;if(r.g)zahl.geige++;}
 ok(bf===0,`30 Bot-Runs mit allen fünf Stücken ohne Fehler (${sieg} Siege; Zeitungen ${zahl.zeitung}, Brief eingesteckt ${zahl.brief}, Teile gefunden ${zahl.teile}, Trennung ausgelöst ${zahl.trennung}, Geige getragen ${zahl.geige})`);
 run('Meta.reset()');console.log(`\n${n} Prüfungen, ${fehler?fehler+' FEHLER':'alles gut'}`);process.exit(fehler?1:0);})();
