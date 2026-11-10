// Spieltest 2026-11-10 (Ideen 3+4): Handgriffe vertiefen, gezielte Angebote, riskante Handgriffe mit Preis. node tools/test-belohnung.js
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const run=c=>K.run(c);let fehler=0;const ok=(c,m)=>{if(!c){fehler++;console.log('FEHLER: '+m);}else console.log('ok    '+m);};
 run(`newRun('fischer',7,{dev:true});`);
 // 1. Vertieft: Zahlen steigen, Name bekommt +, Karten ohne Zahl werden billiger
 const v=JSON.parse(run(`JSON.stringify({o:hgVertieft(HANDGRIFFE.ofentuer,1),f:hgVertieft(HANDGRIFFE.flaechenbrand,1),f0:HANDGRIFFE.flaechenbrand,o2:hgVertieft(HANDGRIFFE.ofentuer,2)})`));
 ok(v.o.n==='Ofentür+'&&v.o.c===2,`Ofentür+ kostet 1 weniger (${v.o.c})`);
 ok(v.f.sonder.fx[0].v>v.f0.sonder.fx[0].v,`Flächenbrand+ mehr Brand (${v.f0.sonder.fx[0].v}→${v.f.sonder.fx[0].v})`);
 ok(v.o2.n==='Ofentür++','Stufe 2 heißt Ofentür++');
 // 2. Vertiefen beim Nehmen: keine neue Karte, Stufe steigt
 const t=JSON.parse(run(`(()=>{const it=besitz().find(b=>b.an).it;it.hg=['ofentuer'];it.kerbenPlus=1;it.tief={};const vor=deckListe().length;
   S.phase='reward';S.rewardHg=['ofentuer'];S.rewardHgMeta={ofentuer:{art:'vertiefen'}};S.hgPicked=false;takeHandgriff('ofentuer');
   const c=kartenVon(it).find(x=>x.hg==='ofentuer');return JSON.stringify({vor,nach:deckListe().length,n:c.n,stufe:it.tief.ofentuer,picked:S.hgPicked,pending:S.hgPending})})()`));
 ok(t.vor===t.nach&&t.n==='Ofentür+'&&t.stufe===1&&t.picked&&!t.pending,`Vertiefen: Deck bleibt ${t.vor} Karten, Karte heißt ${t.n}`);
 // 3. Riskant: Preis wird gezahlt, danach normal ritzen
 const r=JSON.parse(run(`(()=>{const mh=maxHp();S.phase='reward';S.rewardHg=['trommelfeuer'];S.rewardHgMeta={trommelfeuer:{art:'riskant',preis:{art:'maxleben',v:5}}};S.hgPicked=false;takeHandgriff('trommelfeuer');return JSON.stringify({vor:mh,nach:maxHp(),pending:S.hgPending})})()`));
 ok(r.nach===r.vor-5&&r.pending==='trommelfeuer',`riskant: max. Leben ${r.vor}→${r.nach}, dann ritzen`);
 // 4. Angebot: genau EIN Handgriff (mit Blick zwei, verschieden), später öfter Vertiefen; Wächter weiter 3 seltene
 const a=JSON.parse(run(`(()=>{const it=besitz().find(b=>b.an).it;it.hg=['ofentuer'];it.tief={};S.gold=100;const z={};let eins=0,zwei=0,doppelt=0;
   for(const akt of [0,3]){S.akt=akt;z[akt]={tief:0,risk:0,frei:0};for(let i=0;i<200;i++){const o=handgriffAngebot(new Rng(1000+i+akt*7),i%2?'mix':'gewoehnlich',1);if(o.length===1)eins++;
     const m=Object.values(S.rewardHgMeta)[0];z[akt][m?(m.art==='vertiefen'?'tief':'risk'):'frei']++;
     const o2=handgriffAngebot(new Rng(5000+i),'gewoehnlich',2);if(o2.length===2)zwei++;if(new Set(o2).size!==o2.length)doppelt++;}}
   const w=handgriffAngebot(new Rng(9),'selten',3);return JSON.stringify({z,eins,zwei,doppelt,w:w.length,wSel:w.every(id=>HANDGRIFFE[id].rar==='selten')})})()`));
 ok(a.eins===400,'Kampf: immer genau 1 Handgriff');
 ok(a.zwei===400&&a.doppelt===0,'Blick: 2 zur Wahl, verschieden');
 ok(a.z[3].tief>a.z[0].tief&&a.z[3].risk>0&&a.z[0].frei>a.z[3].frei,`Vertiefen/riskant/passend: Akt 1 ${a.z[0].tief}/${a.z[0].risk}/${a.z[0].frei}, Akt 4 ${a.z[3].tief}/${a.z[3].risk}/${a.z[3].frei}`);
 ok(a.w===3&&a.wSel,'Wächter: 3 seltene zur Wahl');
 // 4b. Fight-Ende: Belohnung hat 1 Handgriff
 const fw=JSON.parse(run(`(()=>{newRun('fischer',11,{dev:true});const n=[];for(let i=0;i<6;i++){S.phase='fight';S.kampfArt=i%2?'schwer':'normal';S.depth=i+1;S.enemies=[];try{fightWon();}catch(e){return JSON.stringify({err:e.message})}n.push(S.rewardHg.length);}return JSON.stringify({n})})()`));
 ok(!fw.err&&fw.n.every(x=>x===1),`nach dem Kampf: Handgriffe angeboten ${fw.err||fw.n.join(',')}`);
 // 5. Umritzen nimmt die Stufe mit
 const u=JSON.parse(run(`(()=>{const l=besitz().filter(b=>b.an).map(b=>b.it);const[x,y]=l;x.hg=['ofentuer'];x.tief={ofentuer:2};x.kerbenPlus=1;y.hg=[];y.kerbenPlus=1;S.wahl={art:'umritzen',phase:'werkstatt'};umritzen(x.uid,0,y.uid);return JSON.stringify({y:y.tief,x:x.tief})})()`));
 ok(u.y&&u.y.ofentuer===2&&!u.x.ofentuer,'Umritzen: Stufe wandert mit');
 console.log(fehler?`${fehler} FEHLER`:'alle ok');process.exit(fehler?1:0);})();
