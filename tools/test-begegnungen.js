// Auftrag 3 M9: Tests der Begegnungen (docs/auftrag-3/07-begegnungen-meta-wuerze.md Abschnitte 1 und 2) und der fremden Fassung (Abschnitt 5).
// Läuft im Kern (Node). node tools/test-begegnungen.js [seeds=100]
const { ladeKern } = require('./kern');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
const N = +(process.argv[2] || 100);
(async () => {
  const K = ladeKern(); await K.init(); const run = K.run; const J = c => JSON.parse(run(`JSON.stringify(${c})`));
  // Kampf im Biom b mit festem Zettel
  run(`globalThis.T={start(b,zettel,seed=5){newRun('fischer',seed,{dev:true});const akt=BIOMES[b].akt;S.route=[];for(let i=0;i<akt;i++)S.route[i]=RUN.akte[i].biome[0];S.route[akt]=b;S.akt=akt;S.depth=3+akt*6;FAST=true;S.zettel.begegnungen=zettel;return S;},
   kampf(b,ids,art='kampf',zettel=['diener','asche','spuren','tiefe'],seed=5){T.start(b,zettel,seed);startFight(ids,art);return S;},
   // eine Karte mit genau diesen eigenen Stoffen in die Hand legen und spielen
   spiele(st){const c={n:'Probe '+st.join(''),c:0,atk:1,st:[...st],src:'Test',cid:'t:'+st.join('')+':'+Math.random()};S.hand.push(c);S.energy=9;playCard(S.hand.length-1,0);return c;}};`);

  // ---------- Run-Zettel ----------
  try {
    const z = J(`(()=>{const n={diener:0,asche:0,spuren:0,tiefe:0},laenge=[];for(let s=1;s<=${N};s++){newRun('fischer',s,{dev:true});laenge.push(S.zettel.begegnungen.length);S.zettel.begegnungen.forEach(k=>n[k]++);}return{n,laenge}})()`);
    ok(z.laenge.every(l => l === 2), `${N} Seeds: jeder Zettel hat genau zwei Begegnungen (nie mehr)`);
    ok(N < 100 || Object.values(z.n).every(v => v > N * 0.3 && v < N * 0.7), `Häufigkeit je Begegnung: ${Object.entries(z.n).map(([k, v]) => k + ' ' + v).join(', ')}`);
    const gleich = J(`(()=>{newRun('fischer',7,{dev:true});const a=S.zettel.begegnungen.join();newRun('fischer',7,{dev:true});return a===S.zettel.begegnungen.join();})()`);
    ok(gleich, 'gleicher Seed, gleicher Zettel');
    const aus = J(`(()=>{BAL.auftrag3.begegnungen=false;newRun('fischer',3,{dev:true});const r=['diener','asche','spuren','tiefe'].map(k=>Zettel.hat(k));BAL.auftrag3.begegnungen=true;return r;})()`);
    ok(aus.every(x => !x), 'Schalter aus: keine Begegnung möglich');
    const nicht = J(`(()=>{T.start('kloster',['diener','spuren']);return[Zettel.hat('diener'),Zettel.hat('asche'),Zettel.hat('tiefe')];})()`);
    ok(nicht[0] && !nicht[1] && !nicht[2], 'was nicht auf dem Zettel steht, kann nicht auftreten');
  } catch (e) { ok(false, 'Zettel: ' + e.message); }

  // ---------- Fremde Fassung ----------
  try {
    const f = J(`fremdeFassung({n:'X',c:2,atk:4,h:2,blk:5,poison:3,draw:1,en:1})`);
    ok(f.fremd && f.atk === 6 && f.blk === 8 && f.poison === 5 && f.draw === 2 && f.c === 2 && f.en === 1 && f.h === 2, `fremde Fassung ×1,5 außer Kosten, Energie, Trefferzahl (${f.atk}/${f.blk}/${f.poison}/${f.draw}, Kosten ${f.c}, h ${f.h})`);
  } catch (e) { ok(false, 'Fremde Fassung: ' + e.message); }

  // ---------- Die Diener erheben sich ----------
  try {
    const d = J(`(()=>{T.start('kloster',['diener','spuren']);const c=deckListe().find(x=>x.atk&&!x.hg);const id=kartenSchluessel(c);
      for(let i=0;i<7;i++)Diener.gespielt(c);const vor=Diener.kandidat();Diener.gespielt(c);const k=Diener.kandidat();
      startFight([BIOMES.kloster.waechter],'waechter');const w=S.enemies[0];const sch=w.pat.find(p=>p.t==='karte');const pos=w.pat.indexOf(sch);
      const pi=w.pi%w.pat.length;S.hp=99;S.block=0;const hp0=S.hp;const it={...sch};const dmg=Diener.schaden(w,it);
      // Zug des Wächters mit diesem Schritt
      w.pi=pos;w.str=0;busy=false;endTurn();const verlust=hp0-S.hp;
      const zweimal=(()=>{S.dienerGenutzt=true;startFight([BIOMES.kloster.waechter],'waechter');return S.enemies[0].pat.some(p=>p.t==='karte');})();
      return{vor:!!vor,k:k&&k.n,n:c.n,pos,pi,schritt:sch&&sch.karte.n,st:sch&&sch.karte.st,cst:c.st,dmg,verlust,zweimal};})()`);
    ok(!d.vor && d.k === 8, `Kandidat erst ab 8 gespielten Einsätzen (${d.k})`);
    ok(d.schritt === d.n && d.pos === d.pi + 1, `Wächter bekommt „${d.schritt}“ als Schritt direkt nach dem aktuellen (Stelle ${d.pos})`);
    ok(JSON.stringify(d.st) === JSON.stringify(d.cst), `mit deinen Stoffen (${d.st})`);
    ok(d.dmg > 0 && d.verlust >= d.dmg, `der Schritt trifft dich (${d.dmg} Schaden, verloren ${d.verlust})`);
    ok(!d.zweimal, 'höchstens einmal je Run');
    const kein = J(`(()=>{T.start('kloster',['diener','spuren']);const c=deckListe().find(x=>x.atk&&!x.hg);for(let i=0;i<12;i++)Diener.gespielt(c);startFight(BIOMES.kloster.gegner.slice(0,1),'kampf');const a=S.enemies[0].pat.some(p=>p.t==='karte');startFight([BIOMES.kloster.waechter],'finale');return[a,S.enemies[0].pat.some(p=>p.t==='karte')];})()`);
    ok(!kein[0] && !kein[1], 'nie im normalen Kampf, nie im Finale');
    const s = J(`(()=>{T.start('kloster',['diener','spuren']);const c=deckListe().find(x=>x.atk&&!x.hg&&x.c>0);const k=kartenSchluessel(c);for(let i=0;i<9;i++)Diener.gespielt(c);startFight([BIOMES.kloster.waechter],'waechter');
      const wie=Diener.sieg();const neu=deckListe().find(x=>{const q=kartenSchluessel(x);return q&&q.uid===k.uid&&q.key===k.key;});
      // zweites Mal (schon geschliffen): fremde Fassung
      S.dienerGenutzt=false;S.kartenZahl={};for(let i=0;i<9;i++)Diener.gespielt(neu);startFight([BIOMES.kloster.waechter],'waechter');const wie2=Diener.sieg();const neu2=deckListe().find(x=>{const q=kartenSchluessel(x);return q&&q.uid===k.uid&&q.key===k.key;});
      return{c0:c.c,wie,c1:neu.c,schliff:neu.schliff,wie2,fremd:!!neu2.fremd,a0:c.atk,a2:neu2.atk};})()`);
    ok(s.wie === 'geschliffen' && s.c1 === s.c0 - 1 && s.schliff, `Sieg: geschliffen zurück (Kosten ${s.c0} → ${s.c1})`);
    ok(s.wie2 === 'fremd' && s.fremd && s.a2 === Math.round(s.a0 * 1.5), `schon geschliffen: fremde Fassung (Angriff ${s.a0} → ${s.a2})`);
    const sp = J(`(()=>{T.start('kloster',['diener','spuren']);const c=deckListe().find(x=>x.atk&&!x.hg);for(let i=0;i<9;i++)Diener.gespielt(c);startFight([BIOMES.kloster.waechter],'waechter');const a=JSON.stringify(S.diener);const s2=JSON.parse(JSON.stringify(S));return !!s2.diener&&!!s2.dienerGenutzt&&JSON.stringify(s2.diener)===a;})()`);
    ok(sp, 'Speicherstand trägt Zähler und Diener');
  } catch (e) { ok(false, 'Diener: ' + e.message); }

  // ---------- Spuren ----------
  try {
    const m = J(`(()=>{const r=[];for(let s=1;s<=20;s++){newRun('fischer',s,{dev:true});S.zettel.begegnungen=['spuren','diener'];for(let a=0;a<5;a++){S.akt=a;S.route[a]=S.route[a]||RUN.akte[a].biome[0];S.netz=null;genWeg();let n=0;S.netz.ebenen.forEach((l,e)=>l.forEach(v=>{if(v.spuren!=null){n++;if(!['kampf','kampf_schwer'].includes(v.art)||e>=S.netz.ebenen.length-1)n+=100;}}));r.push([a,n]);}}return r;})()`);
    ok(m.filter(x => x[0] < 4).every(x => x[1] === 1), 'je Akt I–IV genau ein Spuren-Knoten auf einem Kampf, nie auf der Wächter-Ebene');
    ok(m.filter(x => x[0] === 4).every(x => x[1] === 0), 'in Akt V keine Spuren');
    const g = J(`(()=>{T.start('kloster',['spuren','diener']);S.netz=null;genWeg();const v=Spuren.knoten();const stufen=[];
      // woanders hingehen: bis zu viermal einen anderen Knoten wählen
      for(let i=0;i<5;i++){const N=S.netz;const e=Math.min(N.ebenen.length-1,i);const j=N.ebenen[e].findIndex(x=>x!==v);Spuren.gehe({ziel:[e,j<0?0:j]});stufen.push(v.spuren);}
      return stufen;})()`);
    ok(g.join() === '1,2,3,3,3', `Spuren wachsen je Knoten, an dem man vorbeigeht, bis Stufe 4 von 4 (${g.join(' ')})`);
    const st = J(`(()=>{const r=[];for(let s=0;s<4;s++){T.start('kloster',['spuren','diener']);S.netz=null;genWeg();const v=Spuren.knoten();v.spuren=s;const o={ziel:(()=>{for(let e=0;e<S.netz.ebenen.length;e++){const i=S.netz.ebenen[e].indexOf(v);if(i>=0)return[e,i];}})()};
      Spuren.starten(o);const e=S.enemies[0];r.push({hp:e.max,id:e.id,art:S.kampfArt,beute:S.spurenKampf.beute,sp:e.spuren,box:Spuren.W().gross[e.spuren]});}return r;})()`);
    ok(st[0].hp < st[1].hp && st[1].hp < st[2].hp && st[2].hp < st[3].hp, `Leben wächst mit der Stufe (${st.map(x => x.hp).join(' < ')}), Gegner ${st[0].id}`);
    ok(st[0].art === 'kampf' && st[3].art === 'schwer' && st[3].beute === 'reliquie', `früh leichter Kampf, spät schwerer Kampf mit Reliquie (${st.map(x => x.art + '/' + x.beute).join(', ')})`);
    ok(st.every((x, i) => x.sp === i) && st[3].box > st[0].box, `sichtbar größer im Bild (Faktor ${st.map(x => x.box).join(' → ')})`);
    const rel = J(`(()=>{T.start('kloster',['spuren','diener']);S.netz=null;genWeg();const v=Spuren.knoten();v.spuren=3;const o={ziel:(()=>{for(let e=0;e<S.netz.ebenen.length;e++){const i=S.netz.ebenen[e].indexOf(v);if(i>=0)return[e,i];}})()};Spuren.starten(o);fightWon();return S.reward.every(id=>ITEMS[id]&&(ITEMS[id].rar==='reliquie'||ITEMS[id].reliquie||ITEMS[id].rare));})()`);
    ok(rel, 'Stufe 4: die Beute ist ein Reliquien-Angebot');
    const w = J(`(()=>{T.start('kloster',['spuren','diener']);S.netz=null;genWeg();const N=S.netz;const L=N.ebenen.length-1;return N.ebenen[L].every(v=>v.spuren==null);})()`);
    ok(w, 'beim Wächter ist das Ding nicht dabei');
  } catch (e) { ok(false, 'Spuren: ' + e.message); }

  // ---------- Asche ----------
  try {
    const a = J(`(()=>{const id=Object.keys(FOES).find(k=>FOES[k].asche&&BIOMES.kloster.gegner.includes(k));T.kampf('kloster',[id,id,id,id],'kampf',['asche','diener']);
      S.enemies.forEach(e=>{hit(e,999,1,null,'Test');});const n=S.asche.length;return{id,n,namen:S.asche.map(x=>x.n)};})()`);
    ok(!!a.id, `Kloster hat einen Asche-Gegner (${a.id})`);
    ok(a.n === 3, `beim Tod bleibt Asche, höchstens drei im Rucksack (${a.n}: ${a.namen.join(', ')})`);
    const r = J(`(()=>{const id=Object.keys(FOES).find(k=>FOES[k].asche&&BIOMES.kloster.gegner.includes(k));T.kampf('kloster',[BIOMES.kloster.gegner.find(k=>!FOES[k].asche)],'kampf',['asche','diener']);S.asche=[{id,n:FOES[id].n,akt:S.akt}];
      const e0=S.enemies[0];e0.hp=e0.max=999;T.spiele(['F']);T.spiele(['S']);const nachFS=S.asche.length;
      S.asche=[{id,n:FOES[id].n,akt:S.akt}];S.zugKarten=[];T.spiele(['S']);const vorRuf=!!S.verbuendeter;T.spiele(['F']);const v=S.verbuendeter;
      // zweiter Ruf, solange einer da ist: geht nicht
      S.asche=[{id,n:FOES[id].n,akt:S.akt}];S.zugKarten=[];T.spiele(['S']);T.spiele(['F']);const nochDa=S.asche.length;
      const hp0=e0.hp;S.hp=999;busy=false;endTurn();const getroffen=hp0-e0.hp;
      const angegriffen=S.enemies.includes(v);
      return{nachFS,vorRuf,ruf:!!v,n:v&&v.n,nochDa,getroffen,angegriffen,rueck:S.ascheRueck};})()`);
    ok(r.nachFS === 0, 'Feuer, dann Salz: die Asche zerfällt');
    ok(!r.vorRuf && r.ruf, `Salz, dann Feuer: ${r.n} wird gerufen`);
    ok(r.nochDa === 1, 'höchstens ein Verbündeter auf einmal');
    ok(r.getroffen > 0 && !r.angegriffen, `er greift nach deinem Zug an (${r.getroffen} Schaden) und steht nicht bei den Gegnern`);
    ok(r.rueck.length === 1 && r.rueck[0].akt === 3, `Preis: kommt zwei Biome später wieder (Akt ${r.rueck[0] && r.rueck[0].akt + 1})`);
    const umk = J(`(()=>{const id=Object.keys(FOES).find(k=>FOES[k].asche&&BIOMES.kloster.gegner.includes(k));T.kampf('kloster',[BIOMES.kloster.gegner.find(k=>!FOES[k].asche)],'kampf',['asche','diener']);S.enemies[0].hp=999;S.asche=[{id,n:FOES[id].n,akt:S.akt}];
      T.spiele(['F','S']);T.spiele(['S','F']);return !!S.verbuendeter;})()`);
    ok(umk, 'Karte mit beiden Stoffen nach einer mit beiden: Rufen geht vor');
    const z = J(`(()=>{const id=Object.keys(FOES).find(k=>FOES[k].asche&&BIOMES.kloster.gegner.includes(k));T.start('kloster',['asche','diener']);S.ascheRueck=[{id,akt:3}];
      const b=RUN.akte[3].biome.find(x=>BIOMES[x]);S.akt=3;S.route[3]=b;startFight(BIOMES[b].waechter?[BIOMES[b].waechter]:[BIOMES[b].gegner[0]],'waechter');const imW=S.enemies.some(e=>e.id===id);
      startFight([BIOMES[b].gegner[0]],'kampf');const e=S.enemies.find(e=>e.id===id);const sv=JSON.parse(JSON.stringify(S));return{imW,da:!!e,spur:!!(e&&e.ascheSpur),leer:S.ascheRueck.length,v:S.verbuendeter};})()`);
    ok(!z.imW && z.da && z.spur && z.leer === 0, 'zwei Biome später als Gegner mit Asche-Spur (nicht beim Wächter)');
    ok(z.v === null, 'kein Verbündeter aus dem letzten Kampf');
  } catch (e) { ok(false, 'Asche: ' + e.message); }

  // ---------- Die Tiefe erkennt dich ----------
  try {
    const t = J(`(()=>{const tief=EVENTS.flatMap(e=>e.o.map((o,i)=>o.tiefe?e.id+'#'+i:null)).filter(Boolean);return tief;})()`);
    ok(t.length >= 8 && t.length <= 12, `${t.length} Ereignis-Wahlen tragen tiefe: 1`);
    const ar = J(`(()=>{const k=Object.keys(FOES);return{ohne:k.filter(x=>!['mensch','veraendert','nachahmer','tiefe'].includes(FOES[x].art))}})()`);
    ok(ar.ohne.length === 0, `jeder Gegner hat art (${ar.ohne.length} ohne)`);
    const z = J(`(()=>{T.start('kloster',['tiefe','diener']);const n0=deckListe().length;Tiefe.wahl({tiefe:1,l:'a'});const n1=deckListe().length;Tiefe.wahl({tiefe:1,l:'b'});const d=deckListe();Tiefe.wahl({tiefe:1,l:'c'});
      return{n0,n1,n2:d.length,z:d.filter(c=>c.zeichen).length,n3:deckListe().filter(c=>c.zeichen).length,c:d.find(c=>c.zeichen)};})()`);
    ok(z.n1 === z.n0 && z.n2 === z.n0 + 1 && z.z === 1 && z.n3 === 1, 'nach zwei Entscheidungen liegt „Das Zeichen“ im Deck, genau einmal');
    ok(z.c.c === 0 && z.c.n === 'Das Zeichen', 'Das Zeichen kostet 0');
    const nie = J(`(()=>{T.start('kloster',['tiefe','diener']);Tiefe.wahl({tiefe:1,l:'a'});Tiefe.wahl({tiefe:1,l:'b'});const ids=BIOMES.kloster.gegner.filter(k=>['tiefe','nachahmer'].includes(FOES[k].art)).slice(0,1);startFight(ids,'kampf');return{b:!!S.begegnung,seite:!!S.tiefeSeite};})()`);
    ok(!nie.b && !nie.seite, 'nie erzwungen: solange man es nicht spielt, passiert nichts');
    const st = J(`(()=>{T.start('kloster',['tiefe','diener']);S.lose=['zeichen'];S.phase='streichen';S.pending=['strike'];strikeItem('lose:zeichen');return deckListe().some(c=>c.zeichen);})()`);
    ok(!st, 'man kann es streichen wie jede Karte');
    const s = J(`(()=>{const nrm=k=>(FOES[k].rang||'normal')==='normal';const b=Object.keys(BIOMES).find(x=>BIOMES[x].akt>0&&BIOMES[x].waechter&&(BIOMES[x].gegner||[]).some(k=>nrm(k)&&['tiefe','nachahmer'].includes(FOES[k].art))&&(BIOMES[x].gegner||[]).some(k=>nrm(k)&&['mensch','veraendert'].includes(FOES[k].art)));const tiefIds=BIOMES[b].gegner.filter(k=>['tiefe','nachahmer'].includes(FOES[k].art)&&(FOES[k].rang||'normal')==='normal');const menschIds=BIOMES[b].gegner.filter(k=>['mensch','veraendert'].includes(FOES[k].art)&&(FOES[k].rang||'normal')==='normal');
      T.kampf(b,[menschIds[0]],'kampf',['tiefe','diener']);S.lose=['zeichen'];const zc=Tiefe.karte('zeichen');S.hand.push(zc);S.energy=3;playCard(S.hand.length-1,0);const seite=!!S.tiefeSeite;const imDeck=deckListe().some(c=>c.zeichen);
      startFight([tiefIds[0],tiefIds[0]],'kampf');const beg=!!S.begegnung;const g0=S.gold;const kannSpielen=(()=>{S.hand.push({n:'x',c:0,atk:1,st:[]});return playCard(S.hand.length-1,0);})();
      Tiefe.weiter();const halb=S.gold-g0;
      // derselbe Kampf ohne Seitenwechsel: volle Beute
      const r2=(()=>{T.kampf(b,[tiefIds[0],tiefIds[0]],'kampf',['tiefe','diener']);const g=S.gold;fightWon();return S.gold-g;})();
      T.kampf(b,[menschIds[0]],'kampf',['tiefe','diener']);S.tiefeSeite=true;startFight([menschIds[0]],'kampf');const mehr=S.enemies.length;
      startFight([BIOMES[b].waechter],'waechter');const w=S.enemies.length===1&&!S.begegnung;
      S.depth++;enterNode({art:'kraemer'});const kr=S.shop.zu&&!S.shop.items.length;
      return{seite,imDeck,beg,kannSpielen,halb,voll:r2,mehr,w,kr};})()`);
    ok(s.seite && !s.imDeck, 'gespielt: Seitenwechsel, die Karte ist danach weg');
    ok(s.beg && !s.kannSpielen, 'Kampf nur gegen tiefe/nachahmer wird zur Begegnung (keine Karte spielbar)');
    ok(s.halb > 0 && s.halb <= Math.ceil(s.voll / 2) + 1, `Weitergehen: halbe Beute (${s.halb} statt ${s.voll} Gold)`);
    ok(s.mehr === 2, `Kampf mit mensch/veraendert: ein Gegner mehr (${s.mehr})`);
    ok(s.w, 'Wächter bleibt ein Kampf');
    ok(s.kr, 'der Krämer verweigert dich');
  } catch (e) { ok(false, 'Tiefe: ' + e.message); }

  // ---------- Bots ----------
  try {
    run(`globalThis.__m={diener:0,zurueck:0,asche:0,gerufen:0,aufgeloest:0,ascheZurueck:0,spurenKampf:0,zeichen:0,seite:0,begegnung:0,kraemerZu:0,runs:{}};
      Bus.on('diener',p=>{if(p.art==='erhebt')__m.diener++;if(p.art==='zurueck')__m.zurueck++;});
      Bus.on('asche',p=>{if(p.art==='liegt')__m.asche++;if(p.art==='gerufen')__m.gerufen++;if(p.art==='aufgeloest')__m.aufgeloest++;if(p.art==='zurueck')__m.ascheZurueck++;});
      Bus.on('spuren',p=>{if(p.kampf)__m.spurenKampf++;});
      Bus.on('tiefe',p=>{if(p.art==='zeichen')__m.zeichen++;if(p.art==='seite')__m.seite++;if(p.art==='begegnung')__m.begegnung++;});
      Bus.on('kraemer',p=>{if(p.zu)__m.kraemerZu++;});`);
    const B = J(`(()=>{const jobs=JOBS.map(j=>j.id);const o=[];const auf={};for(let i=0;i<${N};i++){const r=Bot.spiele(jobs[i%jobs.length],1+i);o.push({sieg:r.sieg,fehler:r.fehler});(S.zettel.begegnungen).forEach(k=>auf[k]=(auf[k]||0)+1);}
      return{siege:o.filter(x=>x.sieg).length,fehler:o.filter(x=>x.fehler).map(x=>x.fehler.split('\\n')[0]).slice(0,3),m:__m,auf};})()`);
    ok(B.fehler.length === 0, `Bots in ${N} Runs ohne Fehler (${B.siege} Siege)${B.fehler.length ? ': ' + B.fehler.join(' | ') : ''}`);
    console.log(`      Zettel: ${Object.entries(B.auf).map(([k, v]) => k + ' ' + v).join(', ')}`);
    console.log(`      Diener erhoben ${B.m.diener}, zurück ${B.m.zurueck}; Asche liegt ${B.m.asche}, gerufen ${B.m.gerufen}, aufgelöst ${B.m.aufgeloest}, wiedergekehrt ${B.m.ascheZurueck}; Spuren-Kämpfe ${B.m.spurenKampf}; Zeichen ${B.m.zeichen}, Seitenwechsel ${B.m.seite}, Begegnungen ${B.m.begegnung}, Krämer zu ${B.m.kraemerZu}`);
    ok(B.m.diener > 0 && B.m.spurenKampf > 0 && B.m.asche > 0 && B.m.gerufen > 0, 'Diener, Spuren und Asche kommen bei den Bots vor, Asche wird gerufen');
    // Die Tiefe: zwei Entscheidungen mit tiefe: 1 in einem Run sind selten. Zweiter Lauf: Zettel mit Tiefe, das Zeichen liegt ab Start im Deck
    const T2 = J(`(()=>{for(const k in __m)if(typeof __m[k]==='number')__m[k]=0;const jobs=JOBS.map(j=>j.id);const o=[];const n=Math.max(20,Math.round(${N}/3));
      for(let i=0;i<n;i++){const r=Bot.spiele(jobs[i%jobs.length],500+i,{nachStart:()=>{S.zettel.begegnungen=['tiefe','asche'];S.lose=['zeichen'];S.zeichenGegeben=true;}});o.push(r);}
      return{n,siege:o.filter(x=>x.sieg).length,fehler:o.filter(x=>x.fehler).map(x=>x.fehler.split('\\n')[0]).slice(0,3),m:__m};})()`);
    console.log(`      Mit Zeichen ab Start (${T2.n} Runs, ${T2.siege} Siege): Seitenwechsel ${T2.m.seite}, Begegnungen ${T2.m.begegnung}, Krämer zu ${T2.m.kraemerZu}`);
    ok(T2.fehler.length === 0 && T2.m.seite > 0 && T2.m.begegnung > 0, `Seitenwechsel, Begegnungen und Krämer laufen bei den Bots ohne Fehler${T2.fehler.length ? ': ' + T2.fehler.join(' | ') : ''}`);
  } catch (e) { ok(false, 'Bots: ' + e.message); }

  console.log(fehler ? `${fehler} Fehler.` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
