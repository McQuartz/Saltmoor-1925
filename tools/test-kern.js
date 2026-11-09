// Auftrag 3: Tests der Kern-Systeme (docs/auftrag-3/06-lovecraft-kern.md Abschnitt 8). Teil Hören (M6), Teil Blick (M7), Teil Farbe (M8).
// Läuft im Kern (Node). node tools/test-kern.js
const { ladeKern } = require('./kern');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
(async () => {
  const K = ladeKern(); await K.init(); const run = K.run; const J = c => JSON.parse(run(`JSON.stringify(${c})`));
  run(`globalThis.T={kampf(b,ids,seed=5){BAL.auftrag3.hoeren=true;newRun('fischer',seed,{dev:true});const akt=BIOMES[b].akt;S.route=[];for(let i=0;i<akt;i++)S.route[i]=RUN.akte[i].biome[0];S.route[akt]=b;S.akt=akt;S.depth=3+akt*6;FAST=true;startFight(ids,'kampf');return S;}};`);

  // ---------- Hören statt sehen (M6) ----------
  try {
    const d = J(`(()=>{const st=Object.keys(FOES).filter(k=>FOES[k].stumm);return{st,biome:st.map(k=>Object.keys(BIOMES).filter(b=>(BIOMES[b].gegner||[]).includes(k))),rang:st.map(k=>FOES[k].rang),arten:st.map(k=>new Set(FOES[k].pat.map(p=>p.t)).size),
      akt4:RUN.akte[3].biome.map(b=>(BIOMES[b].gegner||[]).filter(k=>FOES[k].stumm).length),akt5:RUN.akte[4].biome.reduce((s,b)=>s+(BIOMES[b].gegner||[]).filter(k=>FOES[k].stumm).length,0)}})()`);
    ok(d.st.length === 6, `sechs stumme Gegnertypen (${d.st.join(', ')})`);
    ok(d.akt4.every(n => n === 1), `je Akt-IV-Biom genau einer (${d.akt4.join(' ')})`);
    ok(d.akt5 === 1, `im Vorraum von Akt V genau einer (${d.akt5})`);
    ok(d.rang.every(r => r === 'normal'), 'nie Wächter, Elite oder Finale');
    ok(d.arten.every(n => n >= 2), `jeder hat mindestens zwei Absicht-Arten (${d.arten.join(' ')})`);
    // Plakette und Vorschau: keine Absicht, kein Schaden in der Vorschau
    run(`T.kampf('mond',['astronom','kraterbewohner']);S.enemies.forEach(e=>{e.pat=[{t:'atk',v:9}];e.pi=0;e.str=0;});`);
    const m = J(`{stumm:S.enemies.map(e=>Hoeren.istStumm(e)),sicht:S.enemies.map(absichtSichtbar),inc:incoming(),incS:incomingSichtbar(),hoer:hoerbareAbsichten(),geh:incomingGehoert()}`);
    ok(m.stumm[0] && !m.stumm[1], `Astronom stumm, Kraterbewohner nicht (${m.stumm})`);
    ok(!m.sicht[0] && m.sicht[1], `Absicht nur beim Kraterbewohner sichtbar (${m.sicht})`);
    ok(m.inc === 18 && m.incS === 9, `Vorschau im Balken zählt den stummen nicht mit (alle ${m.inc}, sichtbar ${m.incS})`);
    ok(m.hoer.length === 1 && m.hoer[0].art === 'angriff' && m.hoer[0].stufe === 2, `hörbare Absicht: Angriff Stufe 2 bei 9 Schaden (${JSON.stringify(m.hoer)})`);
    ok(m.geh === 9 + 11, `der Bot rechnet mit dem Gehörten (9 sichtbar + 11 geschätzt = ${m.geh})`);
    // Arten und Stufen
    const a = J(`(()=>{T.kampf('mond',['astronom']);const e=S.enemies[0];e.str=0;const r=[];for(const p of [{t:'atk',v:4},{t:'atk',v:7},{t:'atk',v:5,h:3},{t:'blk',v:6},{t:'buff',v:2},{t:'laedt',v:0}]){e.pat=[p];e.pi=0;r.push(hoerbareAbsicht(e));}return r.map(h=>h.art+(h.art==='angriff'?h.stufe:''));})()`);
    ok(a.join() === 'angriff1,angriff2,angriff3,schutz,zauber,zauber', `Arten und Stufen: ${a.join(', ')}`);
    // höchstens ein stummer je Kampf, auch beim Rufen
    const zwei = J(`(()=>{T.kampf('mond',['astronom','astronom','astronom']);const n0=S.enemies.filter(e=>Hoeren.istStumm(e)).length;const x=mkEnemy('astronom');Hoeren.begrenzen([x]);S.enemies.push(x);return[n0,S.enemies.filter(e=>Hoeren.istStumm(e)).length];})()`);
    ok(zwei[0] === 1 && zwei[1] === 1, `höchstens ein stummer Gegner je Kampf (drei aufgestellt → ${zwei[0]}, einer gerufen → ${zwei[1]})`);
    // nicht in Akt I bis III, Schalter aus, nach dem Gegnerzug
    const frueh = J(`(()=>{T.kampf('hafen',['rufer']);return Hoeren.istStumm(S.enemies[0]);})()`);
    ok(!frueh, 'ein Rufer in Akt I ist nicht stumm');
    const aus = J(`(()=>{T.kampf('mond',['astronom']);BAL.auftrag3.hoeren=false;const r=[Hoeren.istStumm(S.enemies[0]),absichtSichtbar(S.enemies[0]),hoerbareAbsichten().length];BAL.auftrag3.hoeren=true;return r;})()`);
    ok(!aus[0] && aus[1] && aus[2] === 0, `Schalter aus: Absicht wieder sichtbar, nichts zu hören (${aus})`);
    const nach = J(`(()=>{T.kampf('mond',['astronom']);S.enemies[0].pat=[{t:'blk',v:3}];S.enemies[0].pi=0;S.hand=[];endTurn();const vor=S.turnNo;return [hoerbareAbsichten().length,vor];})()`);
    ok(nach[0] === 1, `nach dem Gegnerzug hört man im neuen Zug wieder die neue Absicht (${nach[0]})`);
    // Speicherstand: stumm bleibt stumm
    const sp = J(`(()=>{T.kampf('mond',['astronom','kraterbewohner']);const j=JSON.parse(JSON.stringify(S));return j.enemies.map(e=>!!e.stumm);})()`);
    ok(sp[0] && !sp[1], `Speicherstand trägt stumm (${sp})`);
    // Schalter aus = Basis-Verhalten der Bots (nur die Absicht-Schätzung ändert sich mit dem Schalter)
    const r = J(`(()=>{const o=[];for(let i=0;i<4;i++){BAL.auftrag3.hoeren=false;const a=Bot.spiele(JOBS[i].id,40+i,{});const za=S.stats.zuege;const sa=Object.keys(FOES).filter(k=>FOES[k].stumm);sa.forEach(k=>FOES[k].stumm=false);BAL.auftrag3.hoeren=true;const b=Bot.spiele(JOBS[i].id,40+i,{});sa.forEach(k=>FOES[k].stumm=true);o.push(a.tiefe===b.tiefe&&a.sieg===b.sieg&&za===S.stats.zuege);}return o;})()`);
    ok(r.every(Boolean), `Schalter aus spielt sich wie ohne stumme Gegner (4 Seeds: ${r})`);
  } catch (e) { ok(false, 'Hören: ' + String(e).split('\n')[0]); }

  // ---------- Sehen und gesehen werden (M7) ----------
  try {
    run(`T.blick=function(b,ids,art='kampf',seed=7,item='linse'){BAL.auftrag3.hoeren=true;BAL.auftrag3.blick=true;newRun('fischer',seed,{dev:true});const akt=BIOMES[b].akt;S.route=[];for(let i=0;i<akt;i++)S.route[i]=RUN.akte[i].biome[0];S.route[akt]=b;S.akt=akt;S.depth=3+akt*6;FAST=true;if(item){const a=ITEMS[item].a;S.slots[a]=Math.max(1,S.slots[a]);S.areas[a][0]=mk(item);}startFight(ids,art);return S;};`);
    const it = J(`(()=>{const ids=Object.keys(ITEMS).filter(k=>ITEMS[k].eigen&&ITEMS[k].eigen.typ==='blick');return{ids,ab:ids.map(blickAb),entwurf:ids.every(k=>ITEMS[k].entwurf),bild:ids.every(k=>ITEMS[k].a)}})()`);
    ok(it.ids.length === 3 && it.entwurf, `drei Blick-Items (${it.ids.join(', ')}), als Entwurf markiert`);
    ok(JSON.stringify(it.ab) === '[1,2,3]', `Fundorte: ab Akt II, III, IV (Akt-Index ${it.ab})`);
    const rp = J(`(()=>{newRun('fischer',3,{dev:true});const r=[];for(let a=0;a<5;a++){S.akt=a;r.push(rarePool().filter(k=>blickAb(k)>0).length);}return r;})()`);
    ok(JSON.stringify(rp) === '[0,1,2,3,3]', `Krämer und seltene Beute: Blick-Items erst ab ihrem Akt (${rp})`);
    // ohne Item keine Wahl, mit Item Wahl vor dem ersten Zug; bis dahin kein Spielen und kein Zugende
    const ohne = J(`(()=>{T.blick('kloster',['abschreiber'],'kampf',7,null);return S.blickWahl;})()`);
    ok(!ohne, 'ohne Blick-Item keine Wahl');
    const w = J(`(()=>{T.blick('kloster',[biome0()],'kampf');const vor=S.hand.length;const p=playCard(0,0);endTurn();return{wahl:S.blickWahl,p,zug:S.turnNo,hand:S.hand.length===vor,hin:!!S.hinsehen};})()`.replace('biome0()', `BIOMES.kloster.gegner[0]`));
    ok(w.wahl && !w.p && w.zug === 1 && w.hand && !w.hin, `mit Linse: Wahl liegt aus, Standard nicht hinsehen, Karten und Zugende gesperrt (${JSON.stringify(w)})`);
    const fin = J(`(()=>{T.blick('kloster',[BIOMES.kloster.gegner[0]],'finale');return S.blickWahl;})()`);
    ok(!fin, 'im Finale keine Wahl');
    const aus = J(`(()=>{BAL.auftrag3.blick=false;newRun('fischer',7,{dev:true});const a=ITEMS.linse.a;S.slots[a]=Math.max(1,S.slots[a]);S.areas[a][0]=mk('linse');S.akt=1;S.route=['hafen','kloster'];FAST=true;startFight([BIOMES.kloster.gegner[0]],'kampf');const r=S.blickWahl;BAL.auftrag3.blick=true;return r;})()`);
    ok(!aus, 'Schalter aus: keine Wahl, auch mit Linse');
    // Nicht hinsehen: nichts kommt dazu, der stumme bleibt stumm
    const nein = J(`(()=>{T.blick('mond',['astronom','kraterbewohner'],'kampf',7,'grablampe');const n=S.enemies.length;Blick.waehlen(false);return{n0:n,n:S.enemies.length,sicht:absichtSichtbar(S.enemies[0]),stumm:Hoeren.istStumm(S.enemies[0])};})()`);
    ok(nein.n === nein.n0 && !nein.sicht && nein.stumm, `nicht hinsehen: kein Gesehener, der Astronom bleibt stumm (${JSON.stringify(nein)})`);
    // Hinsehen: der stumme wird lesbar, ein Gesehener kommt dazu (je Akt der richtige)
    const ja = J(`(()=>{T.blick('mond',['astronom','kraterbewohner'],'kampf',7,'grablampe');S.enemies.forEach(e=>{e.pat=[{t:'atk',v:9}];e.pi=0;e.str=0;});Blick.waehlen(true);const g=S.enemies.find(e=>e.gesehener);return{sicht:absichtSichtbar(S.enemies[0]),hoer:hoerbareAbsichten().length,g:g&&g.id,n:S.enemies.length,incS:incomingSichtbar(),inc:incoming()};})()`);
    ok(ja.sicht && ja.hoer === 0, `hinsehen: der Astronom zeigt seine Absicht (sichtbar ${ja.sicht}, zu hören ${ja.hoer})`);
    ok(ja.g === 'gesehener_grund' && ja.n === 3, `hinsehen in Akt IV: ${ja.g} kommt dazu (${ja.n} Gegner)`);
    ok(ja.incS === ja.inc, `Vorschau mit Hinsehen zählt alle Absichten (${ja.incS} von ${ja.inc})`);
    const akte = J(`(()=>{const o=[];for(const b of ['kloster','salz','eis','ufer']){T.blick(b,[BIOMES[b].gegner[0]],'kampf');Blick.waehlen(true);const g=S.enemies.find(e=>e.gesehener);o.push(g?g.id:null);}return o;})()`);
    ok(JSON.stringify(akte) === '["gesehener_tief","gesehener_tief","gesehener_grund","gesehener_letzt"]', `Gesehene je Akt II, III, IV, V: ${akte.join(', ')}`);
    const schw = J(`(()=>{T.blick('salz',[BIOMES.salz.gegner[0]],'schwer');Blick.waehlen(true);return S.enemies.some(e=>e.gesehener);})()`);
    ok(schw, 'auch im schweren Kampf kommt ein Gesehener');
    const gs = J(`Object.keys(FOES).filter(k=>FOES[k].gesehener).map(k=>({k,biome:Object.keys(BIOMES).filter(b=>(BIOMES[b].gegner||[]).includes(k)).length,sp:!!FOES[k].sprite,e:!!FOES[k].entwurf}))`);
    ok(gs.length === 3 && gs.every(g => g.biome === 0 && g.sp && g.e), `drei Gesehene mit Sprite, als Entwurf, in keinem Biom-Pool (${JSON.stringify(gs)})`);
    // verborgener Kniff: mit Hinsehen voller Wert in der Vorschau
    const vb = J(`(()=>{const id=Object.keys(FOES).find(k=>FOES[k].kniff&&FOES[k].kniff.art==='verborgen');const b=Object.keys(BIOMES).find(b=>(BIOMES[b].gegner||[]).includes(id))||'moor';T.blick(b,[id]);const e=S.enemies[0];e.pat=[{t:'atk',v:8}];e.pi=0;e.str=0;const vor=incomingSichtbar();Blick.waehlen(true);S.enemies.filter(x=>x.gesehener).forEach(x=>x.hp=0);return[vor,incomingSichtbar()];})()`);
    ok(vb[0] === 0 && vb[1] === 8, `verborgener Kniff: ohne Hinsehen 0 in der Vorschau, mit Hinsehen 8 (${vb})`);
    // Wächter: ein stärkerer Zug direkt nach dem aktuellen Schritt
    const wa = J(`(()=>{const b='kloster';const id=BIOMES[b].waechter;T.blick(b,[id],'waechter');const e=S.enemies[0];const n=e.pat.length,pi=e.pi;const n0=S.enemies.length;Blick.waehlen(true);const st=e.pat[(pi%n)+1];return{n,neu:e.pat.length,gesehen:!!st.gesehen,gegner:S.enemies.length===n0,quelle:S.blickZusatz.quelle};})()`);
    ok(wa.neu === wa.n + 1 && wa.gesehen && wa.gegner, `Wächter: ein Musterschritt mehr (${wa.n} → ${wa.neu}), kein Gesehener (Quelle ${wa.quelle})`);
    // Beute: 1 aus 4 und sicher ein Item-Angebot; ohne Hinsehen 1 aus 3
    const be = J(`(()=>{const o=[];for(const h of [true,false]){let items=0,hg=0;for(let s=1;s<=12;s++){T.blick('kloster',[BIOMES.kloster.gegner[0]],'kampf',s);Blick.waehlen(h);S.enemies.forEach(e=>e.hp=0);fightWon();items+=S.reward.length?1:0;hg=Math.max(hg,S.rewardHg.length);}o.push({items,hg});}return o;})()`);
    ok(be[0].hg === 4 && be[0].items === 12, `nach Hinsehen: Handgriffe 1 aus ${be[0].hg}, Item-Angebot in ${be[0].items} von 12 Siegen`);
    ok(be[1].hg === 3 && be[1].items < 12, `ohne Hinsehen: 1 aus ${be[1].hg}, Item-Angebot in ${be[1].items} von 12`);
    // Schatten: höchstens einmal je Akt, nur ohne Hinsehen
    const sc = J(`(()=>{let n=0;const h=()=>n++;Bus.on('blick_schatten',h);T.blick('kloster',[BIOMES.kloster.gegner[0]],'kampf',11);const bs=[];for(let i=0;i<12;i++){S.depth=9+i;S.blickWahl=true;Blick.waehlen(false);}const a=n;S.akt=2;S.route[2]='salz';for(let i=0;i<12;i++){S.depth=20+i;S.blickWahl=true;Blick.waehlen(false);}const b2=n-a;for(let i=0;i<12;i++){S.akt=3;S.depth=30+i;S.blickWahl=true;S.kampfArt='kampf';Blick.waehlen(true);S.enemies=S.enemies.filter(e=>!e.gesehener);}Bus.off&&Bus.off('blick_schatten',h);return[a,b2,n-a-b2];})()`);
    ok(sc[0] === 1 && sc[1] === 1 && sc[2] === 0, `Schatten: Akt II ${sc[0]}×, Akt III ${sc[1]}× in je 12 Kämpfen, mit Hinsehen ${sc[2]}×`);
    // Speicherstand trägt die Wahl und den Gesehenen
    const sp = J(`(()=>{T.blick('salz',[BIOMES.salz.gegner[0]]);Blick.waehlen(true);const j=JSON.parse(JSON.stringify(S));return[j.hinsehen,j.enemies.some(e=>e.gesehener)];})()`);
    ok(sp[0] === true && sp[1], `Speicherstand trägt Hinsehen und den Gesehenen (${sp})`);
    // Bot-Regel: hinsehen, wenn Leben über 60 %
    const bot = J(`(()=>{const o=[];for(const q of [.9,.5]){T.blick('kloster',[BIOMES.kloster.gegner[0]]);S.hp=Math.round(maxHp()*q);Bot.kampfZug();o.push(!!S.hinsehen);}return o;})()`);
    ok(bot[0] && !bot[1], `Bot: bei 90 % hinsehen, bei 50 % nicht (${bot})`);
  } catch (e) { ok(false, 'Blick: ' + String(e).split('\n')[0]); }

  // ---------- Die Farbe (M8) ----------
  try {
    // Testaufbau: Run mit drei angelegten Items mit Stoff, Farbe auf dem ersten
    run(`T.farbe=function(seed=5){BAL.auftrag3.farbe=true;newRun('fischer',seed,{dev:true});S.route=['hafen','kloster'];S.akt=1;S.depth=8;const ids=['knife','holywater','lantern'].filter(id=>ITEMS[id]);ids.forEach((id,i)=>{const a=ITEMS[id].a;S.slots[a]=Math.max(S.slots[a],1);const f=S.areas[a].findIndex((x,k)=>k<S.slots[a]&&!x);S.areas[a][f<0?0:f]=mk(id);});return allActive().filter(it=>(ITEMS[it.id].st||[]).length).map(it=>it.uid);};`);
    const x = J(`{st:ST.X,leer:Object.values(ITEMS).every(d=>!(d.st||[]).includes('X'))}`);
    ok(x.st && x.st.n === 'Die Farbe' && x.leer, `neunter Stoff X „${x.st && x.st.n}“ (${x.st && x.st.c}), auf keinem Item in den Daten`);
    const plan = J(`(()=>{let n=0;for(let s=1;s<=200;s++){newRun('fischer',s,{dev:true});if(S.farbePlan!=null&&[1,2].includes(S.farbePlan))n++;}return n;})()`);
    ok(plan >= 150 && plan <= 190, `geplant in ${plan} von 200 Runs für Akt II oder III (ankommen tut er in etwa jedem zweiten, siehe Bots unten)`);
    const ev = J(`(()=>{newRun('fischer',3,{dev:true});S.farbePlan=1;S.akt=1;S.route[1]='kloster';S.depth=8;FAST=true;enterNode({art:'ereignis'});const a=S.event;S.phase='weg';enterNode({art:'ereignis'});return[a,S.event];})()`);
    ok(ev[0] === 'farbe_brunnen' && ev[1] !== 'farbe_brunnen', `das nächste Ereignis im Akt ist der Brunnen, nur einmal (${ev})`);
    const aus = J(`(()=>{newRun('fischer',3,{dev:true});S.farbePlan=1;S.akt=1;BAL.auftrag3.farbe=false;const r=Farbe.ereignisHier();BAL.auftrag3.farbe=true;return r;})()`);
    ok(!aus, 'Schalter aus: kein Brunnen');
    const an = J(`(()=>{const u=T.farbe();runFx([{op:'farbe_annehmen'}],{why:'Test'});return{f:S.farbe,an:allActive().some(it=>it.uid===S.farbe.uid)};})()`);
    ok(an.f && an.an && !an.f.gebunden, `annehmen: sitzt auf einem angelegten Item (${an.f && an.f.uid})`);
    // Annehmen der Stoffe im Kampf
    const k = J(`(()=>{const u=T.farbe();S.farbe={uid:u[0],letzte:null,gebunden:false};FAST=true;startFight(['nachgeher'].filter(id=>FOES[id]).concat(Object.keys(FOES).filter(k=>FOES[k].rang==='normal').slice(0,1)).slice(0,1),'kampf');S.enemies[0].hp=S.enemies[0].max=999;
      const fc={...kartenVon(itemByUid(u[0]))[0],c:0};const fremd=kartenVon(itemByUid(u[1]))[0];const andere={...fremd,c:0};S.hand=[fc,andere];S.energy=9;S.played=0;S.zugSt=[];S.zugKarten=[];S.last=[];Farbe.hand();const erst=[...S.hand[0].st];
      playCard(1,0);const nachher=[...S.hand[0].st];const log0=S.chainLog.length;playCard(0,0);const rx=S.chainLog[S.chainLog.length-1].rx.map(r=>r.n);return{eigen:ITEMS[itemByUid(u[0]).id].st,erst,fremd:fremd.st,nachher,rx};})()`);
    ok(JSON.stringify(k.erst) === JSON.stringify(k.eigen), `erste Karte im Zug behält ihre Stoffe (${k.erst})`);
    ok(JSON.stringify(k.nachher) === JSON.stringify(k.fremd), `danach nimmt die Karte den Stoff der Karte davor an (${k.nachher} = ${k.fremd})`);
    ok(k.rx.includes('Verstärkt'), `und reagiert damit: ${k.rx.join(', ')}`);
    // Wandern und Spur
    const w = J(`(()=>{const u=T.farbe(7);S.farbe={uid:u[0],letzte:null,gebunden:false};const vorSt=[...def(itemByUid(u[0])).st];S.stats.kaempfe=1;Farbe.wandern();const it0=itemByUid(u[0]);const nach=[...def(it0).st];const ziel=S.farbe.uid;const spuren=JSON.parse(JSON.stringify(it0.spuren||null));const karten=kartenVon(it0)[0].st;
      const z=[];for(let i=0;i<30;i++){const vor=S.farbe.uid,letzte=S.farbe.letzte;S.stats.kaempfe++;Farbe.wandern();z.push([vor,letzte,S.farbe.uid]);}
      const st=allActive().map(it=>def(it).st);return{vorSt,nach,ziel,u,spuren,z,st,karten};})()`);
    ok(w.ziel !== w.u[0] && w.u.includes(w.ziel), `wandert nach dem Kampf auf ein anderes angelegtes Item (${w.u[0]} → ${w.ziel})`);
    ok(w.spuren && w.spuren.length === 1 && w.vorSt.length === w.nach.length && w.vorSt.filter((s, i) => s !== w.nach[i]).length === 1, `Spur: genau ein Stoff getauscht (${w.vorSt} → ${w.nach})`);
    ok(JSON.stringify(w.karten) === JSON.stringify(w.nach), `die Karten des Items tragen die Spur (${w.karten})`);
    ok(w.z.every(([vor, letzte, neu]) => neu !== vor && neu !== letzte), `30-mal gewandert, nie geblieben, nie zurück auf das letzte`);
    ok(w.st.every(s => !s.includes('X') && new Set(s).size === s.length), `nie X, nie zweimal derselbe Stoff (${w.st.map(s => s.join('')).join(' ')})`);
    const eins = J(`(()=>{const u=T.farbe();allActive().slice(1).forEach(it=>{for(const a of AREAS){const i=S.areas[a].indexOf(it);if(i>=0)S.areas[a][i]=null;}});const it=allActive()[0];S.farbe={uid:it.uid,letzte:null,gebunden:false};Farbe.wandern();return[S.farbe.uid===it.uid,!it.spuren];})()`);
    ok(eins[0] && eins[1], 'nur ein Item angelegt: sie bleibt und hinterlässt nichts');
    // Binden mit Salz
    const b = J(`(()=>{const u=T.farbe();const salzId=Object.keys(ITEMS).find(k=>ITEMS[k].st&&ITEMS[k].st.join()==='S'&&ITEMS[k].cards&&!ITEMS[k].bases);const it=mk(salzId);const a=ITEMS[salzId].a;S.slots[a]=Math.max(S.slots[a],2);S.areas[a][1]=it;S.farbe={uid:u[0],letzte:null,gebunden:false};FAST=true;
      startFight([Object.keys(FOES).find(k=>FOES[k].rang==='normal')],'kampf');S.enemies[0].hp=S.enemies[0].max=999;const fc={...kartenVon(itemByUid(u[0]))[0],c:0},sc={...kartenVon(it)[0],c:0};S.hand=[fc,sc];S.energy=9;S.played=0;S.zugSt=[];S.zugKarten=[];Farbe.hand();playCard(0,0);playCard(0,0);
      const g=S.farbe.gebunden;const vor=JSON.stringify(allActive().map(i=>def(i).st));for(let i=0;i<5;i++){S.stats.kaempfe++;Farbe.wandern();}return{salzId,g,bleibt:S.farbe.uid===u[0],spur:JSON.stringify(allActive().map(i=>def(i).st))===vor};})()`);
    ok(b.g && b.bleibt && b.spur, `Salz direkt nach der Farbe (${b.salzId}): gebunden, bleibt auf dem Item, keine Spuren mehr`);
    // Tilgen in der Werkstatt
    const t = J(`(()=>{const u=T.farbe(9);S.farbe={uid:u[0],letzte:null,gebunden:false};const it=itemByUid(u[0]);const alt=[...def(it).st];S.stats.kaempfe=1;Farbe.wandern();const mit=[...def(it).st];S.phase='werkstatt';S.forged=false;wahlStart('tilgen','werkstatt');const ok1=Farbe.tilgen(it.uid);wahlFertig();return{alt,mit,nach:def(it).st,forged:S.forged,ohne:!it.spuren&&!it.st};})()`);
    ok(JSON.stringify(t.nach) === JSON.stringify(t.alt) && t.mit.join() !== t.alt.join() && t.forged && t.ohne, `Spur tilgen: ${t.mit} → ${t.nach}, kostet die Werkstatt-Aktion`);
    // Speicherstand
    const sp = J(`(()=>{const u=T.farbe(11);S.farbe={uid:u[0],letzte:null,gebunden:false};S.stats.kaempfe=1;Farbe.wandern();S.farbe.gebunden=true;S.dev=false;S.phase='weg';save(true);const vor=JSON.stringify({f:S.farbe,st:allActive().map(it=>[it.uid,it.st||null,it.spuren||null])});newRun('pfarrerin',99,{dev:true});loadRun();const nach=JSON.stringify({f:S.farbe,st:allActive().map(it=>[it.uid,it.st||null,it.spuren||null])});clearSave();return[vor===nach,vor];})()`);
    ok(sp[0], `Speicherstand trägt Farbe, Bindung und Spuren`);
    // Bots: nehmen an und binden, wenn sie können
    const bot = J(`(()=>{let an=0,geb=0,spur=0,n=0;const h=p=>{if(p.art==='an')an++;if(p.art==='gebunden')geb++;if(p.art==='wandert'&&p.spur)spur++;};Bus.on('farbe',h);for(let i=0;i<40;i++){const r=Bot.spiele(JOBS[i%JOBS.length].id,300+i,{});n++;}return{an,geb,spur,n};})()`);
    ok(bot.an >= 12 && bot.an <= 28 && bot.geb >= 1, `Bots in 40 Runs: Brunnen ${bot.an}-mal (etwa jeder zweite Run) und angenommen, ${bot.geb}-mal gebunden, ${bot.spur} Spuren`);
  } catch (e) { ok(false, 'Farbe: ' + String(e).split('\n')[0]); }

  console.log(fehler ? `${fehler} Fehler.` : 'Alles gut.');
  process.exit(fehler ? 1 : 0);
})();
