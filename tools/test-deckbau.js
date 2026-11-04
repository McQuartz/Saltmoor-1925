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
 console.log(fehler?`${fehler} FEHLER`:'Alles gut.');process.exit(fehler?1:0);})();
