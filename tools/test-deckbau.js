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
 console.log(fehler?`${fehler} FEHLER`:'Alles gut.');process.exit(fehler?1:0);})();
