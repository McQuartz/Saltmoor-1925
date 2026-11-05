// Auftrag 2, M3: Kerben, Stoffübernahme der Handgriffe, Schlagworte. node tools/test-deckbau.js
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const run=c=>K.run(c);let fehler=0;const ok=(c,m)=>{if(!c){fehler++;console.log('FEHLER: '+m);}else console.log('ok    '+m);};
 // Testhandgriffe (falls handgriffe.json noch leer ist), danach Run
 run(`Object.assign(HANDGRIFFE,{_t_schlag:{n:'T-Schlag',c:1,atk:5},_t_funke:{n:'T-Funke',c:1,atk:3,funke:true},_t_kette:{n:'T-Kette',c:1,atk:2,kette:3},_t_opfer:{n:'T-Opfer',c:0,opfer:3,en:2},_t_x:{n:'T-X',c:0,x:true,atk:3},_t_behalt:{n:'T-Behalt',c:1,blk:4,behalten:true},_t_str:{n:'T-Stärke',c:1,str:2},_t_vuln:{n:'T-Verw',c:0,vuln:2}});
  for(const id of ['stossen','ausweichen','abwarten','durchatmen'])if(!HANDGRIFFE[id])HANDGRIFFE[id]={n:id,c:1,blk:3,start:true};`);
 run(`newRun('fischer',5,{dev:true});`);
 // 1. Start: Start-Handgriffe in den Kerben
 const start=JSON.parse(run(`JSON.stringify(besitz().map(b=>({id:b.it.id,hg:hgVon(b.it),k:kerbenVon(b.it)})))`));
 ok(start.some(x=>x.hg.includes('stossen')),'Start-Handgriff „Stoßen“ steckt in einer Waffe');
 ok(start.every(x=>x.hg.length<=x.k),'nie mehr Handgriffe als Kerben');
 // 2. Stoffübernahme: Handgriff nimmt die Stoffe des Items an
 const st=JSON.parse(run(`(()=>{const it=besitz().find(b=>b.an&&def(b.it).st.length).it;it.hg=[];S.hgPending='_t_schlag';placeHandgriff(it.uid);const c=kartenVon(it).find(x=>x.hg==='_t_schlag');return JSON.stringify({itemSt:def(it).st,karteSt:c.st})})()`));
 ok(JSON.stringify(st.itemSt)===JSON.stringify(st.karteSt),`Handgriff übernimmt Stoffe des Items (${st.karteSt})`);
 // 3. Kerbe voll: ohne Überschreiben kein Platz, mit Überschreiben ersetzt
 const voll=JSON.parse(run(`(()=>{const it=besitz().find(b=>b.an).it;it.hg=[];it.kerbenPlus=0;const cap=kerbenVon(it);for(let i=0;i<cap;i++)it.hg.push('_t_schlag');S.hgPending='_t_str';const a=placeHandgriff(it.uid);const b=placeHandgriff(it.uid,0);return JSON.stringify({a,b,hg:it.hg[0]})})()`));
 ok(!voll.a&&voll.b&&voll.hg==='_t_str','volle Kerbe: erst abgelehnt, mit Überschreiben ersetzt');
 // 4. Kerbe dazu, höchstens 3
 const kb=JSON.parse(run(`(()=>{const it=besitz().find(b=>b.an).it;it.kerbenPlus=0;const v=kerbenVon(it);S.wahl={art:'kerbe',quelle:'werkstatt',phase:'werkstatt'};kerbeDazu(it.uid);const n=kerbenVon(it);it.kerbenPlus=5;return JSON.stringify({v,n,max:kerbenVon(it)})})()`));
 ok(kb.n===kb.v+1&&kb.max===3,`Kerbe dazu (${kb.v}→${kb.n}), Obergrenze 3`);
 // 5. Schleifen: Kosten −1, Deck zeigt es
 const sch=JSON.parse(run(`(()=>{const it=besitz().find(b=>b.an&&def(b.it).cards.some(c=>c.c>=1)).it;const ci=def(it).cards.findIndex(c=>c.c>=1);const vor=def(it).cards[ci].c;S.wahl={art:'schleifen',quelle:'rast',phase:'rast'};schleifen(it.uid,'s'+ci);const nach=kartenVon(it).find(c=>c.ci===ci).c;return JSON.stringify({vor,nach})})()`));
 ok(sch.nach===sch.vor-1,`Schleifen senkt Kosten (${sch.vor}→${sch.nach})`);
 // 6. Schlagworte im Kampf
 const kampf=c=>JSON.parse(run(`(()=>{newRun('fischer',9,{dev:true});S.route=['hafen','kapelle','salz','eis','pforte'];S.akt=0;S.depth=1;startFight(['netzflickerin'],'kampf');const e=S.enemies[0];e.hp=e.max=200;e.block=0;${c}})()`));
 const k=kampf(`S.hand=[{...HANDGRIFFE._t_funke,st:['F']}];S.last=['E'];const vor=S.energy;playCard(0,0);return JSON.stringify({energie:vor-S.energy})`);ok(k.energie===0,'Funke: kostet 0, wenn eine Reaktion ausgelöst wird (Eisen → Feuer)');
 const k2=kampf(`S.rxZug=2;S.hand=[{...HANDGRIFFE._t_kette,st:[]}];const vor=S.enemies[0].hp;playCard(0,0);return JSON.stringify({d:vor-S.enemies[0].hp})`);ok(k2.d===8,`Kette 3: 2 + 3×2 Reaktionen = 8 (ist ${k2.d})`);
 const k3=kampf(`S.hand=[{...HANDGRIFFE._t_opfer,st:[]}];const h=S.hp,en=S.energy;playCard(0);return JSON.stringify({leben:h-S.hp,en:S.energy-en})`);ok(k3.leben===3&&k3.en===2,`Opfer 3: zahlt Leben statt Energie (−${k3.leben} Leben, +${k3.en} Energie)`);
 const k4=kampf(`S.energy=3;S.hand=[{...HANDGRIFFE._t_x,st:[]}];const vor=S.enemies[0].hp;playCard(0,0);return JSON.stringify({d:vor-S.enemies[0].hp,en:S.energy})`);ok(k4.d===9&&k4.en===0,`X: verbraucht alle Energie (3), wirkt 3-mal (Schaden ${k4.d})`);
 const k5=kampf(`S.hand=[{...HANDGRIFFE._t_str,st:[]},{...HANDGRIFFE._t_schlag,st:[]}];playCard(0);const vor=S.enemies[0].hp;playCard(0,0);return JSON.stringify({d:vor-S.enemies[0].hp})`);ok(k5.d===7,`Stärke 2: nächster Angriff 5+2 = 7 (ist ${k5.d})`);
 const k6=kampf(`S.hand=[{...HANDGRIFFE._t_vuln,st:[]},{...HANDGRIFFE._t_schlag,st:[]}];playCard(0,0);const vor=S.enemies[0].hp;playCard(0,0);return JSON.stringify({d:vor-S.enemies[0].hp,v:S.enemies[0].vuln})`);ok(k6.d===8,`Verwundbar: 5 × 1,5 = 8 (ist ${k6.d})`);
 const k7=kampf(`FAST=true;S.hand=[{...HANDGRIFFE._t_behalt,st:[]},{...HANDGRIFFE._t_schlag,st:[]}];S.draw=[];S.discard=[];endTurn();FAST=false;return JSON.stringify({hand:S.hand.map(c=>c.n)})`);ok(k7.hand.includes('T-Behalt'),'Behalten: bleibt über das Zugende auf der Hand');
 // 7. Kniffe für Wächter (M6/M7): teurer, kopie, takt, voraus
 const kn=(kn,c)=>JSON.parse(run(`(()=>{newRun('fischer',9,{dev:true});S.route=['hafen','kapelle','salz','eis','pforte'];S.akt=0;S.depth=1;startFight(['netzflickerin'],'kampf');const e=S.enemies[0];e.hp=e.max=200;e.block=0;e.kniff=${JSON.stringify(kn)};${c}})()`));
 const t1=kn({art:'teurer',v:1},`S.hand=[{...HANDGRIFFE._t_schlag,st:[]}];const vor=cardCost(S.hand[0]);kniffeZugbeginn();return JSON.stringify({vor,nach:cardCost(S.hand[0])})`);ok(t1.nach===t1.vor+1,`teurer: Karte kostet diesen Zug 1 mehr (${t1.vor}→${t1.nach})`);
 const t2=kn({art:'kopie'},`S.hand=[{...HANDGRIFFE._t_schlag,st:[]}];playCard(0,0);S.block=0;const h=S.hp;kniffGegnerzug(S.enemies[0]);return JSON.stringify({d:h-S.hp})`);ok(t2.d===5,`kopie: schreibt deine letzte Karte ab und trifft dich mit 5 (ist ${t2.d})`);
 const t3=kn({art:'takt',v:6},`e.turns=0;kniffGegnerzug(e);const b=e.block;e.turns=1;e.block=0;kniffGegnerzug(e);return JSON.stringify({b,v:e.vuln})`);ok(t3.b===6&&t3.v>=1,`takt: Schlag gibt Block (${t3.b}), dazwischen verwundbar (${t3.v})`);
 const t4=kn({art:'voraus'},`S.draw=[{...HANDGRIFFE._t_schlag,st:['F']}];S.block=0;const h=S.hp;kniffGegnerzug(S.enemies[0]);return JSON.stringify({d:h-S.hp,w:S.enemies[0].weak})`);ok(t4.d===5&&!!t4.w,`voraus: spielt deine nächste Karte vor dir (${t4.d} Schaden), Schwachstelle ${t4.w}`);
 // 8. „Der, der vor dir kam“: Muster aus den Karten einer Figur, Beute eines ihrer Items
 const vg=JSON.parse(run(`(()=>{newRun('fischer',9,{dev:true});S.depth=30;FOES._t_vor={n:'Der, der vor dir kam',hp:60,weak:'L',pat:[{t:'atk',v:5}],vorgaenger:true,rang:'elite'};const e=mkEnemy('_t_vor');delete FOES._t_vor;return JSON.stringify({n:e.n,pat:e.pat,beute:S.sicheresBeute})})()`));
 ok(/\(.+\)/.test(vg.n)&&vg.pat.length>=2&&vg.pat.some(p=>p.t==='atk')&&!!vg.beute,`Vorgänger: ${vg.n}, Muster ${vg.pat.map(p=>p.t+p.v).join('/')}, Beute ${vg.beute}`);
 // 9. Besondere Krämer: Tausch, Leihe, Spiegel
 const kr=art=>JSON.parse(run(`(()=>{newRun('fischer',9,{dev:true});S.route=['hafen','kapelle','salz','eis','pforte'];S.akt=0;S.depth=3;const b=biom();const alt=b.kraemer.art;b.kraemer.art=${JSON.stringify(art)};S.letzterKraemer=['knife','lantern'];S.gold=500;enterNode({art:'kraemer',hint:''});b.kraemer.art=alt;
  const vor=besitz().length;const loc=besitz().find(x=>!x.an).loc;S.sel=loc;const gold=S.gold;buy(0);const it=besitz().map(x=>x.it).find(x=>x.id===S.shop.items[0].id);
  let zurueck=null;if(${JSON.stringify(art)}==='leihe'){S.akt=1;leiheZurueck();zurueck=!besitz().some(x=>x.it.id===S.shop.items[0].id);}
  return JSON.stringify({ids:S.shop.items.map(o=>o.id),st:S.shop.items.map(o=>ITEMS[o.id].st),gold:gold-S.gold,vor,nach:besitz().length,sold:S.shop.items[0].sold,zurueck})})()`));
 const ta=kr('tausch');ok(ta.sold&&ta.gold===0&&ta.nach===ta.vor,`Tausch-Krämer: Item gegen Item, kein Gold (${ta.vor}→${ta.nach} Items)`);
 const le=kr('leihe');ok(le.sold&&le.gold>0&&le.zurueck,`Leih-Krämer: billig (${le.gold} Gold), im nächsten Akt zurück`);
 const sp=kr('spiegel');ok(sp.ids[0]==='sp_knife'&&sp.ids[1]==='sp_lantern',`Spiegel-Krämer: Waren des letzten Krämers gespiegelt (${sp.ids.join(', ')}; Stoffe ${JSON.stringify(sp.st)})`);
 // 10. Zugabe: unverwundbarer Zug (Neumond), ruf mit Liste, Störkarten-Name aus dem Kniff
 const u1=kn(null,`e.pat=[{t:'blk',v:8,unverw:true},{t:'atk',v:5}];e.pi=0;S.hand=[{...HANDGRIFFE._t_schlag,st:[]}];const vor=e.hp;playCard(0,0);const a=vor-e.hp;e.pi=1;S.hand=[{...HANDGRIFFE._t_schlag,st:[]}];const v2=e.hp;playCard(0,0);return JSON.stringify({a,b:v2-e.hp})`);ok(u1.a===0&&u1.b===5,`unverw: im Neumond-Zug 0 Schaden (${u1.a}), danach wieder ${u1.b}`);
 const u2=kn({art:'ruf',gegner:['kurgast','netzflickerin'],alle:3},`const ids=[];for(const t of [2,5]){e.turns=t;S.enemies=S.enemies.slice(0,1);kniffGegnerzug(e);ids.push(S.enemies[1]&&S.enemies[1].id);}return JSON.stringify({ids})`);ok(u2.ids[0]==='kurgast'&&u2.ids[1]==='netzflickerin',`ruf mit Liste: ruft der Reihe nach ${u2.ids.join(', dann ')}`);
 const u3=kn({art:'waechst',v:1},`e.kniffe=[{art:'abschrift',n:1,karte:'Seewasser'}];S.discard=[];kniffGegnerzug(e);return JSON.stringify({n:S.discard.map(c=>c.n)})`);ok(u3.n[0]==='Seewasser',`Störkarte aus kniffe[] heißt nach ihrem Kniff (${u3.n[0]})`);
 // 11. Zugabe 4: Ballast (unspielbare Karten als Treibstoff) und Kollekte (Gold als Treibstoff)
 const mitItem=(ids,c)=>JSON.parse(run(`(()=>{busy=false;newRun('fischer',9,{dev:true});S.route=['hafen','kapelle','salz','eis','pforte'];S.akt=0;S.depth=1;S.areas.talisman=[null,null,null,null];${JSON.stringify(ids)}.forEach((id,i)=>S.areas.talisman[i]=mk(id));startFight(['netzflickerin'],'kampf');const e=S.enemies[0];e.hp=e.max=200;e.block=0;${c}})()`));
 const b1=mitItem([],`S.draw=[];S.discard=[];runFx([{op:'ballast',n:2},{op:'ballast',n:1,wohin:'hand',karte:'Leere Seite'}],{why:'Test'});return JSON.stringify({stapel:S.draw.map(c=>c.n),hand:S.hand.filter(c=>c.unspielbar).map(c=>c.n),kosten:cardCost(S.hand.find(c=>c.ballast))})`);
 ok(b1.stapel.length===2&&b1.stapel.every(n=>n==='Ballast')&&b1.hand.includes('Leere Seite')&&b1.kosten===99,`fx ballast: 2 in den Ziehstapel, 1 „Leere Seite“ auf die Hand, ohne Ballaststein unspielbar (Kosten ${b1.kosten})`);
 const b2=mitItem(['ballaststein'],`S.hand=[ballastKarte()];const en=S.energy,vor=e.hp,pl=S.played;const k=cardCost(S.hand[0]);playCard(0,0);return JSON.stringify({k,d:vor-e.hp,en:en-S.energy,hand:S.hand.length,weg:S.exhaust.filter(c=>c.ballast).length,pl:S.played-pl})`);
 ok(b2.k===0&&b2.d===3&&b2.en===0&&b2.hand===0&&b2.weg===1&&b2.pl===0,`ballast_werfen: Ballast kostet 0, geht über Bord (verbraucht), 3 Schaden an allen (${b2.d}), zählt nicht als gespielte Karte`);
 const b3=mitItem(['ballaststein'],`S.areas.waffe[0]=mk('radiermesser');S.hand=[ballastKarte(),{n:'Zittern',c:0,unspielbar:true,st:[]}];const s0=S.pstr||0;playCard(0,0);playCard(0,0);return JSON.stringify({str:(S.pstr||0)-s0})`);
 ok(b3.str===2,`ballast_staerke: zwei unspielbare Karten über Bord (auch Zittern) geben Stärke 2 (ist ${b3.str})`);
 const b4=mitItem(['strandbuch'],`S.hand=[];S.discard=[];S.block=0;S.bzZug=0;S.draw=[{n:'A',c:1,atk:1,st:[]},{n:'B',c:1,atk:1,st:[]},ballastKarte(),ballastKarte()];drawCards(2);return JSON.stringify({hand:S.hand.length,block:S.block})`);
 ok(b4.hand===4&&b4.block===4,`ballast_ziehen: zwei Ballast gezogen, je eine Karte nach (Hand ${b4.hand}) und je 2 Block (${b4.block})`);
 const b5=mitItem(['leere_seiten'],`FAST=true;S.hand=[ballastKarte(),ballastKarte('Leere Seite'),{n:'A',c:1,atk:1,st:[]}];S.block=0;const hp=S.hp;let blk=0;Bus.on('player_block',p=>{if(/Gesangbuch/.test(p.why))blk+=p.v;});endTurn();FAST=false;return JSON.stringify({blk})`);
 ok(b5.blk===8,`ballast_block: am Zugende 2 unspielbare Karten auf der Hand, je 4 Block (${b5.blk})`);
 const b6=mitItem([],`S.areas.kleidung[0]=mk('bleiguertel');const c=kartenVon(S.areas.kleidung[0])[0];S.draw=[{n:'Z',c:1,atk:1,st:[]}];S.hand=[c,ballastKarte(),ballastKarte()];S.block=0;playCard(0);return JSON.stringify({ball:S.hand.filter(x=>x.ballast).length,hand:S.hand.map(x=>x.n),block:S.block})`);
 ok(b6.ball===1&&b6.hand.includes('Z')&&b6.block>=6,`ueber_bord (Bleigürtel): 6 Block, genau 1 Ballast über Bord, 1 Karte nachgezogen (${b6.hand.join(', ')})`);
 const b7=mitItem([],`S.hand=[{n:'Über Bord',c:1,st:[],sonder:{art:'ueber_bord',je:5}},ballastKarte(),ballastKarte(),ballastKarte()];const vor=e.hp;playCard(0,0);return JSON.stringify({d:vor-e.hp,rest:S.hand.length})`);
 ok(b7.d===15&&b7.rest===0,`ueber_bord mit je 5: drei Ballast über Bord, 15 Schaden (${b7.d})`);
 const g1=mitItem([],`S.gold=12;S.hand=[{n:'Münzwurf',c:1,zoll:5,atk:8,st:[]},{n:'Münzwurf',c:1,zoll:5,atk:8,st:[]},{n:'Münzwurf',c:1,zoll:5,atk:8,st:[]}];const en=S.energy;const k1=cardCost(S.hand[0]);playCard(0,0);playCard(0,0);const k3=cardCost(S.hand[0]);playCard(0,0);return JSON.stringify({k1,k3,gold:S.gold,en:en-S.energy})`);
 ok(g1.k1===0&&g1.k3===1&&g1.gold===2&&g1.en===1,`Zoll 5: zweimal 5 Gold statt Energie (Gold 12→${g1.gold}), beim dritten reicht das Gold nicht, kostet 1 Energie`);
 const g2=mitItem([],`S.areas.waffe[0]=mk('pfennigstrumpf');S.gold=150;S.pstr=0;S.hand=[{n:'Hieb',c:1,atk:5,gold:3,st:[]}];const vor=e.hp;playCard(0,0);const d=vor-e.hp;S.gold=40;S.hand=[{n:'Hieb',c:1,atk:5,st:[]}];const v2=e.hp;playCard(0,0);return JSON.stringify({d,d2:v2-e.hp})`);
 ok(g2.d===11&&g2.d2===7,`gold_schaden: mit 150 Gold +6 (höchstens) = ${g2.d}, mit 40 Gold +2 = ${g2.d2}; Karte mit gold gibt Gold`);
 const g3=mitItem(['opferstock'],`S.gold=50;startTurn();return JSON.stringify({block:S.block})`);
 ok(g3.block===3,`gold_block: 50 Gold geben zu Zugbeginn 3 Block (${g3.block})`);
 const g4=mitItem(['heuerbeutel'],`e.hp=3;S.gold=0;S.hand=[{n:'Hieb',c:1,atk:5,st:[]}];playCard(0,0);return JSON.stringify({gold:S.gold})`);
 ok(g4.gold===7,`gold_je_tod: Gegner fällt, +7 Gold (${g4.gold})`);
 const g5=mitItem(['faehrgeld'],`FAST=true;S.gold=50;S.hp=3;S.block=0;e.pat=[{t:'atk',v:30}];e.pi=0;S.hand=[];endTurn();const a={hp:S.hp,gold:S.gold,phase:S.phase};S.hp=3;S.block=0;e.pi=0;endTurn();FAST=false;return JSON.stringify({a,phase2:S.phase})`);
 ok(g5.a.phase==='fight'&&g5.a.hp===14&&g5.a.gold===15&&g5.phase2==='strand',`faehrgeld: tödlicher Treffer kostet 35 Gold, du stehst mit ${g5.a.hp} Leben auf (Gold ${g5.a.gold}); im selben Kampf nicht noch einmal`);
 const g6=JSON.parse(run(`(()=>{newRun('fischer',9,{dev:true});S.areas.talisman=[mk('ballaststein'),mk('leere_seiten'),null,null];const a=buildArchetyp().id;S.areas.talisman=[mk('opferstock'),mk('faehrgeld'),null,null];S.areas.kleidung[0]=mk('geldkatze');const b=buildArchetyp().id;return JSON.stringify({a,b})})()`));
 ok(g6.a==='ballast'&&g6.b==='kollekte',`buildArchetyp erkennt Ballast (${g6.a}) und Kollekte (${g6.b})`);
 console.log(fehler?`${fehler} FEHLER`:'Alles gut.');process.exit(fehler?1:0);})();
