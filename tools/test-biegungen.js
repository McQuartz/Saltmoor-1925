// Auftrag 3 M5: Tests der Regelbiegungen (docs/auftrag-3/06-lovecraft-kern.md Abschnitte 2, 3 und 8).
// Je Biegung ein fester Zug, der die Regel prüft. Läuft im Kern (Node). node tools/test-biegungen.js
const { ladeKern } = require('./kern');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
(async () => {
  const K = ladeKern(); await K.init(); const run = K.run;
  // Hilfen im Kern: Kampf im Biom b mit einem zähen Gegner, Testkarten mit festen Stoffen
  run(`globalThis.T={
   kampf(b,seed=7){BAL.auftrag3.regelbiegung=true;BAL.auftrag3.biegung_nur=null;newRun('fischer',seed,{dev:true});const akt=BIOMES[b].akt;S.route=[];S.route[akt]=b;S.akt=akt;S.depth=3+akt*6;
    FAST=true;startFight([BIOMES[b].gegner[0]],'kampf');S.enemies.forEach(e=>{e.hp=e.max=999;e.pat=[{t:'blk',v:0}];e.kniff=null;e.kniffe=null;e.besonders=null;e.weak=null;});S.hp=S.bonusHp=0;S.bonusHp=500;S.hp=maxHp();
    S.hand=[];S.draw=[];S.discard=[];S.energy=99;T.log=[];return S;},
   karte(st,o={}){return{n:'Test '+st.join(''),c:1,atk:1,st:[...st],src:'Test',cid:'t'+(++uidc),...o};},
   hand(...l){S.hand=l.map(x=>Array.isArray(x)?T.karte(x):x);return S.hand;},
   spiele(i=0){return playCard(i,0);},
   log:[]};
   Bus.on('reaction',p=>T.log.push({n:p.r.n,why:p.why||''}));Bus.on('biegung',p=>T.log.push({biegung:p.id,why:p.why||''}));`);
  const J = c => JSON.parse(run(`JSON.stringify(${c})`));

  // ---------- Daten ----------
  try {
    const d = J(`{n:BIEGUNGEN.length,biome:BIEGUNGEN.map(b=>b.biom),akte:BIEGUNGEN.map(b=>BIOMES[b.biom]&&BIOMES[b.biom].akt),entwurf:BIEGUNGEN.every(b=>b.entwurf===true),zeichen:BIEGUNGEN.every(b=>!!b.zeichen),tief:Object.keys(BIOMES).filter(k=>BIOMES[k].akt>=2).filter(k=>!BIOMES[k].biegung),flach:Object.keys(BIOMES).filter(k=>BIOMES[k].akt<2&&BIOMES[k].biegung)}`);
    ok(d.n === 14, `14 Biegungen in biegungen.json (${d.n})`);
    ok(new Set(d.biome).size === 14 && d.akte.every(a => a >= 2), `je Biom der Akte III bis V genau eine Biegung (${d.biome.join(', ')})`);
    ok(!d.tief.length, `kein Biom in Akt III bis V ohne Biegung${d.tief.length ? ' (fehlt: ' + d.tief.join(', ') + ')' : ''}`);
    ok(!d.flach.length, `Akte I und II ohne Biegung${d.flach.length ? ' (falsch: ' + d.flach.join(', ') + ')' : ''}`);
    ok(d.entwurf, 'alle Namen und Regeltexte als Entwurf markiert');
    ok(d.zeichen, 'jede Biegung hat ein Zeichen');
  } catch (e) { ok(false, 'Daten: ' + String(e).split('\n')[0]); }

  // ---------- Schalter aus = Basis-Verhalten ----------
  try {
    const r = J(`(()=>{const o=[];const jobs=JOBS.map(j=>j.id);const L=[...BIEGUNGEN];
     for(let i=0;i<6;i++){BAL.auftrag3.regelbiegung=false;const a=Bot.spiele(jobs[i%9],300+i,{});const za=S.stats.zuege;
      BIEGUNGEN.length=0;BAL.auftrag3.regelbiegung=true;const b=Bot.spiele(jobs[i%9],300+i,{});const zb=S.stats.zuege;BIEGUNGEN.push(...L);
      o.push([a.sieg===b.sieg&&a.tiefe===b.tiefe&&za===zb&&a.route===b.route,a.tiefe,b.tiefe]);}BAL.auftrag3.regelbiegung=true;return o;})()`);
    ok(r.every(x => x[0]), `Schalter aus spielt sich wie ohne Biegungen (6 Seeds gleich: ${r.map(x => x[1] + '/' + x[2]).join(' ')})`);
  } catch (e) { ok(false, 'Schalter: ' + String(e).split('\n')[0]); }

  // ---------- Über Eck (namenlose Stadt) ----------
  try {
    // Eisen, Wasser, Blut, Feuer: kein Paar zwischen Nachbarn; erste (Eisen) und letzte (Feuer) ergeben Glühend
    run(`T.kampf('stadt');T.hand(['E'],['W'],['B'],['F']);T.spiele();T.spiele();T.spiele();T.spiele();`);
    const vorEnde = J(`{rx:T.log.filter(x=>x.n).length,brand:S.enemies[0].burn,uebereck:Bieg.ueberEckRx().map(r=>r.n)}`);
    ok(vorEnde.rx === 0, `Über Eck: zwischen Nachbarn reagiert nichts (${vorEnde.rx})`);
    ok(vorEnde.uebereck.join() === 'Glühend', `Über Eck: Vorschau des Kreises zeigt Glühend (${vorEnde.uebereck.join()})`);
    const hp0 = J(`S.enemies[0].hp`);
    run(`S.enemies[0].pat=[{t:'blk',v:0}];endTurn();`);
    const nach = J(`{l:T.log,hp:S.enemies[0].hp,disc:S.disc.has('Glühend')}`);
    const ue = nach.l.filter(x => x.n && /^Über Eck/.test(x.why));
    ok(ue.length === 1 && ue[0].n === 'Glühend', `Über Eck: beim Zugende reagieren erste und letzte Karte: ${ue.map(x => x.n).join(', ') || 'nichts'}`);
    ok(hp0 - nach.hp >= 4, `Über Eck: Glühend trifft (4 Schaden, Brand 2 tickt im Gegnerzug): Leben ${hp0} → ${nach.hp}`);
    ok(nach.l.some(x => x.biegung === 'ueber_eck'), 'Über Eck: meldet sich mit Grund auf dem Bus');
    // nur zwei Karten: kein Kreis
    run(`T.kampf('stadt');T.hand(['E'],['F']);S.hand[0].st=['E'];S.hand[1].st=['W'];T.spiele();T.spiele();T.log=[];endTurn();`);
    ok(!J(`T.log.some(x=>/^Über Eck/.test(x.why))`), 'Über Eck: mit zwei Karten schließt sich kein Kreis');
    // Verstärkt über Eck: die letzte Karte wirkt um die Hälfte nach (1 Schaden ×0,5 gerundet)
    run(`T.kampf('stadt');T.hand(['F'],['W'],['B'],T.karte(['F'],{atk:10}));T.spiele();T.spiele();T.spiele();`);
    const h1 = J(`S.enemies[0].hp`); run(`T.spiele();`); const h2 = J(`S.enemies[0].hp`); run(`T.log=[];endTurn();`);
    const v = J(`{l:T.log.filter(x=>/^Über Eck/.test(x.why)&&x.n).map(x=>x.n),hp:S.enemies[0].hp}`);
    ok(v.l.includes('Verstärkt') && h2 - v.hp >= 5, `Über Eck: Verstärkt zwischen erster und letzter Karte lässt die letzte um 50 % nachwirken (${h1 - h2} → +${h2 - v.hp})`);
    // Hochreaktion zählt mit, wenn noch nicht verbraucht: F, ..., G+S als letzte Karte → FGS
    run(`T.kampf('stadt');T.hand(['F'],['W'],['B'],['G','S']);T.spiele();T.spiele();T.spiele();T.spiele();`);
    const hoch = J(`Bieg.ueberEckRx().map(r=>r.n)`);
    ok(hoch.some(n => J(`HOCH.map(h=>h.n)`).includes(n)), `Über Eck: Hochreaktion zählt mit (${hoch.join(', ')})`);
    // anderes Biom: keine Biegung; Schalter aus: keine Biegung
    run(`T.kampf('hafen');T.hand(['E'],['W'],['B'],['F']);T.spiele();T.spiele();T.spiele();T.spiele();T.log=[];endTurn();`);
    ok(!J(`T.log.some(x=>/^Über Eck/.test(x.why))`), 'Über Eck: im Hafen (Akt I) gilt sie nicht');
    run(`T.kampf('stadt');BAL.auftrag3.regelbiegung=false;T.hand(['E'],['W'],['B'],['F']);T.spiele();T.spiele();T.spiele();T.spiele();T.log=[];endTurn();BAL.auftrag3.regelbiegung=true;`);
    ok(!J(`T.log.some(x=>/^Über Eck/.test(x.why))`), 'Über Eck: Schalter aus, kein Kreis');
    // Bot spielt auf sie hin: Biegungs-Wert für eine Karte, die mit der ersten reagiert
    run(`T.kampf('stadt');T.hand(['E'],['W'],['F'],['L']);T.spiele();T.spiele();`);
    const bw = J(`[Bot.biegWert(S.hand[0],0),Bot.biegWert(S.hand[1],0)]`);
    ok(bw[0] > 0 && bw[1] === 0, `Über Eck: der Bot bewertet die Karte, die den Kreis schließt, höher (Feuer ${bw[0]}, Licht ${bw[1]})`);
  } catch (e) { ok(false, 'Über Eck: ' + String(e).split('\n')[0]); }

  // ---------- weitere Hilfen ----------
  run(`T.stapel=(n,st=[],o={})=>{S.draw=Array.from({length:n},(_,k)=>T.karte(st,{n:'Stapel'+k,...o}));return S.draw;};
   T.rx=()=>T.log.filter(x=>x.n).map(x=>x.n);
   T.bw=()=>T.log.filter(x=>x.biegung).map(x=>x.biegung);`);
  const sek = (name, f) => { try { f(); } catch (e) { ok(false, name + ': ' + String(e).split('\n')[0]); } };
  const rx = () => J(`T.rx()`);

  // ---------- Alte Stoffe erinnern sich (Salzstollen) ----------
  sek('Alte Stoffe', () => {
    // S→W Sole: 6 Block und eine Karte ziehen
    run(`T.kampf('salz');T.stapel(5);T.hand(['S'],['W']);T.spiele();`);
    const b0 = J(`{b:S.block,h:S.hand.length,d:S.draw.length}`); run(`T.log=[];T.spiele();`);
    const a = J(`{b:S.block,h:S.hand.length,d:S.draw.length,l:T.rx()}`);
    ok(a.l.join() === 'Sole' && a.b - b0.b === 6 && a.h === 1 && b0.d - a.d === 1, `Alte Stoffe: Salz→Wasser löst Sole aus (${a.l.join()}): Block ${b0.b} → ${a.b}, Handkarten ${b0.h} → ${a.h} (1 gezogen), Stapel ${b0.d} → ${a.d}`);
    // B→S Pökeln: 6 Schaden (+1 der Karte) und 3 Heilung
    run(`T.kampf('salz');T.hand(['B'],['S']);S.hp=S.hp-20;T.spiele();`);
    const p0 = J(`{hp:S.hp,e:S.enemies[0].hp}`); run(`T.log=[];T.spiele();`);
    const p1 = J(`{hp:S.hp,e:S.enemies[0].hp,l:T.rx()}`);
    ok(p1.l.join() === 'Pökeln' && p0.e - p1.e === 7 && p1.hp - p0.hp === 3, `Alte Stoffe: Blut→Salz löst Pökeln aus (${p1.l.join()}): Gegner −${p0.e - p1.e} (6 + 1 der Karte), Heilung +${p1.hp - p0.hp}`);
    // B→W Gezeitenblut: alle Gegner verwundbar
    run(`T.kampf('salz');T.hand(['B'],['W']);T.spiele();`);
    const v0 = J(`S.enemies.map(e=>e.vuln||0)`); run(`T.log=[];T.spiele();`);
    const v1 = J(`{v:S.enemies.map(e=>e.vuln||0),l:T.rx()}`);
    ok(v1.l.join() === 'Gezeitenblut' && v1.v.every(x => x > 0) && v0.every(x => x === 0), `Alte Stoffe: Blut→Wasser löst Gezeitenblut aus (${v1.l.join()}): verwundbar ${v0} → ${v1.v}`);
    // Gegenproben: Hafen und Schalter aus
    for (const [k, st] of [['SW', ['S', 'W']], ['BS', ['B', 'S']], ['BW', ['B', 'W']]]) {
      run(`T.kampf('hafen');T.hand(${JSON.stringify([[st[0]], [st[1]]])});T.spiele();T.spiele();`);
      const h = rx();
      run(`T.kampf('salz');BAL.auftrag3.regelbiegung=false;T.hand(${JSON.stringify([[st[0]], [st[1]]])});T.spiele();T.spiele();BAL.auftrag3.regelbiegung=true;`);
      const o = rx();
      ok(!h.length && !o.length, `Alte Stoffe: ${k} reagiert im Hafen nicht (${h.length}) und bei ausgeschalteter Regelbiegung nicht (${o.length})`);
    }
    // Junge Paare bleiben: E→F Glühend, 4 Schaden (+1) und Brand 2
    run(`T.kampf('salz');T.hand(['E'],['F']);T.spiele();`);
    const g0 = J(`S.enemies[0].hp`); run(`T.log=[];T.spiele();`);
    const g1 = J(`{hp:S.enemies[0].hp,burn:S.enemies[0].burn,l:T.rx()}`);
    ok(g1.l.join() === 'Glühend' && g0 - g1.hp === 5 && g1.burn === 2, `Alte Stoffe: junges Paar Eisen→Feuer unverändert (${g1.l.join()}): −${g0 - g1.hp} Leben, Brand ${g1.burn}`);
  });

  // ---------- Rückwärts gewachsen (Wald) ----------
  sek('Rückwärts', () => {
    run(`T.kampf('wald');T.stapel(30);T.hand(['E'],['F'],['W']);T.spiele();T.spiele();`);
    const z = J(`S.zuletztGespielt.cid`);
    run(`endTurn();`);
    const a = J(`{hand:S.hand.map(c=>c.cid),n:S.hand.length,hs:handSize(),disc:S.discard.map(c=>c.cid),turn:S.turnNo,l:T.bw()}`);
    ok(a.turn === 2 && a.hand.includes(z), `Rückwärts: die zuletzt gespielte Karte liegt am Zugbeginn 2 auf der Hand (${z})`);
    ok(!a.disc.includes(z), `Rückwärts: sie ist aus der Ablage entfernt (Ablage ${a.disc.length} Karten, ohne ${z})`);
    ok(a.n === a.hs, `Rückwärts: die Hand hat trotzdem Handgröße (${a.n} von ${a.hs})`);
    ok(a.l.includes('rueckwaerts'), 'Rückwärts: meldet sich auf dem Bus');
    // leere Ablage: normal ziehen
    run(`T.kampf('wald');T.stapel(30);T.hand(['E']);T.spiele();S.discard=[];endTurn();`);
    const b = J(`{n:S.hand.length,hs:handSize(),z:S.zuletztGespielt.cid,h:S.hand.some(c=>c.cid===S.zuletztGespielt.cid),l:T.bw()}`);
    ok(b.n === b.hs && !b.h && !b.l.includes('rueckwaerts'), `Rückwärts: bei leerer Ablage normal gezogen (${b.n} von ${b.hs} Karten, gespielte Karte nicht zurück)`);
    // Gegenprobe Hafen
    run(`T.kampf('hafen');T.stapel(30);T.hand(['E'],['F']);T.spiele();T.spiele();const z=S.zuletztGespielt;endTurn();globalThis.zz=z;`);
    const c = J(`{h:S.hand.some(c=>c===zz),d:S.discard.includes(zz)}`);
    ok(!c.h && c.d, `Rückwärts: im Hafen bleibt die gespielte Karte auf der Ablage (Hand ${c.h}, Ablage ${c.d})`);
  });

  // ---------- Ebbe und Flut (Gezeitenwerk) ----------
  sek('Gezeiten', () => {
    run(`T.kampf('gezeitenwerk');T.stapel(40);T.hand(['E'],['F'],['W']);`);
    const k1 = J(`Bieg.kopf().zusatz`);
    const alt = J(`S.hand.map(c=>c.cid)`);
    run(`endTurn();S.energy=99;`);
    const t2 = J(`{turn:S.turnNo,n:S.hand.length,hs:handSize(),alt:S.hand.some(c=>${JSON.stringify(alt)}.includes(c.cid)),disc:S.discard.length,kopf:Bieg.kopf().zusatz}`);
    ok(k1 === 'Ebbe' && t2.kopf === 'Flut' && t2.turn === 2, `Gezeiten: Kopfleiste zeigt Zug 1 „${k1}“, Zug 2 „${t2.kopf}“`);
    ok(!t2.alt && t2.n === t2.hs && t2.disc === 3, `Gezeiten: Ebbe warf die Hand ab (Ablage ${t2.disc}), Zug 2 zog ${t2.n} von ${t2.hs} frisch`);
    run(`T.spiele();T.spiele();`);
    const vor = J(`{ids:S.hand.map(c=>c.cid),dl:S.discard.length}`);
    run(`endTurn();S.energy=99;`);
    const t3 = J(`{ids:S.hand.map(c=>c.cid),n:S.hand.length,hs:handSize(),turn:S.turnNo,dl:S.discard.length,kopf:Bieg.kopf().zusatz,l:T.bw()}`);
    ok(vor.ids.every(i => t3.ids.includes(i)), `Gezeiten: Flut: die ${vor.ids.length} Handkarten bleiben am Zugende liegen`);
    ok(t3.dl === vor.dl && t3.n === t3.hs && t3.n > vor.ids.length, `Gezeiten: Zug 3 zieht nur bis Handgröße auf (${vor.ids.length} behalten, ${t3.n} von ${t3.hs}), Ablage unverändert ${vor.dl} → ${t3.dl}`);
    ok(t3.kopf === 'Ebbe' && t3.l.includes('gezeiten'), `Gezeiten: Zug 3 ist wieder ${t3.kopf}, Bus meldet die Flut`);
    // Gegenprobe Hafen: Hand wird immer abgeworfen
    run(`T.kampf('hafen');T.stapel(40);T.hand(['E']);T.spiele();T.hand(['E'],['F']);endTurn();endTurn();`);
    ok(J(`Bieg.kopf()`) === null && J(`S.discard.length`) >= 2, 'Gezeiten: im Hafen keine Kopfleiste, Hand wird abgeworfen');
  });

  // ---------- Der Ringofen (Ziegelgruben) ----------
  sek('Ringofen', () => {
    run(`T.kampf('ziegelgruben');`);
    const s1 = J(`S.last`);
    run(`T.stapel(40,['F']);T.hand(['W'],['E']);T.spiele();T.spiele();endTurn();S.energy=99;`);
    const s2 = J(`{last:S.last,turn:S.turnNo}`);
    ok(s1.length === 0 && s2.turn === 2 && s2.last.join() === 'E', `Ringofen: S.last in Zug 1 leer (${s1.length}), zu Beginn von Zug 2 = Stoffe der letzten Karte (${s2.last.join()})`);
    run(`T.log=[];T.spiele();`);
    ok(rx().join() === 'Glühend', `Ringofen: die erste Karte von Zug 2 (Feuer) reagiert mit der letzten von Zug 1 (Eisen): ${rx().join() || 'nichts'}`);
    run(`T.kampf('hafen');T.stapel(40,['F']);T.hand(['W'],['E']);T.spiele();T.spiele();endTurn();S.energy=99;`);
    const h = J(`S.last`); run(`T.log=[];T.spiele();`);
    ok(h.length === 0 && rx().length === 0, `Ringofen: im Hafen reißt die Kette ab (S.last ${h.length}, Reaktionen ${rx().length})`);
  });

  // ---------- Keiner fährt ab (Station) ----------
  sek('Keiner fährt ab', () => {
    // E (keine Reaktion), F (Glühend), E (Glühend), F (dritte Reaktion)
    run(`T.kampf('station');T.stapel(10);T.hand(['E'],['F'],['E'],['F']);globalThis.hh=[...S.hand];T.spiele();`);
    const a = J(`{top:S.draw[S.draw.length-1].cid,dis:S.discard.map(c=>c.cid),n:S.draw.length}`);
    ok(a.dis.length === 1 && a.dis[0] === J(`hh[0].cid`) && a.n === 10, `Keiner fährt ab: Karte ohne Reaktion geht normal auf die Ablage (Ablage ${a.dis.length}, Stapel ${a.n})`);
    run(`T.spiele();`);
    const b = J(`{top:S.draw[S.draw.length-1].cid,dis:S.discard.map(c=>c.cid),n:S.draw.length,z:S.stationZug,l:T.bw(),r:T.rx()}`);
    ok(b.r.join() === 'Glühend' && b.top === J(`hh[1].cid`) && !b.dis.includes(b.top) && b.n === 11, `Keiner fährt ab: reagierende Karte liegt oben auf dem Stapel, nicht auf der Ablage (Stapel ${a.n} → ${b.n}, Ablage ${b.dis.length})`);
    run(`T.spiele();`);
    const c = J(`{top:S.draw[S.draw.length-1].cid,z:S.stationZug,n:S.draw.length}`);
    ok(c.top === J(`hh[2].cid`) && c.z === 2 && c.n === 12, `Keiner fährt ab: die zweite reagierende Karte liegt auch oben (Zähler ${c.z} von 2)`);
    run(`T.spiele();`);
    const d = J(`{top:S.draw[S.draw.length-1].cid,dis:S.discard.map(c=>c.cid),z:S.stationZug,n:S.draw.length,r:T.rx().length}`);
    ok(d.r === 3 && d.top !== J(`hh[3].cid`) && d.dis.includes(J(`hh[3].cid`)) && d.z === 2 && d.n === 12, `Keiner fährt ab: die dritte reagierende Karte geht auf die Ablage (Stapel ${d.n}, Zähler ${d.z})`);
    run(`endTurn();`);
    ok(J(`S.stationZug`) === 0, 'Keiner fährt ab: der Zähler beginnt im nächsten Zug wieder bei 0');
    // verbraucht
    run(`T.kampf('station');T.stapel(10);T.hand(['E'],T.karte(['F'],{verbraucht:true}));globalThis.vv=S.hand[1];T.spiele();T.spiele();`);
    const e = J(`{r:T.rx(),n:S.draw.length,z:S.stationZug,ex:S.exhaust.includes(vv),top:S.draw.includes(vv)}`);
    ok(e.r.join() === 'Glühend' && e.ex && !e.top && e.n === 10 && e.z === 0, `Keiner fährt ab: verbrauchte Karte reagiert, bleibt aber verbraucht (Stapel ${e.n}, Zähler ${e.z})`);
    // Gegenprobe Hafen
    run(`T.kampf('hafen');T.stapel(10);T.hand(['E'],['F']);T.spiele();T.spiele();`);
    ok(J(`S.draw.length`) === 10 && J(`S.discard.length`) === 2, 'Keiner fährt ab: im Hafen geht die reagierende Karte auf die Ablage');
  });

  // ---------- Falsche Winkel (Eis) ----------
  sek('Falsche Winkel', () => {
    // Eisen, Feuer, Salz: Karte 2 hätte normal Glühend, Karte 3 normal Knistern
    run(`T.kampf('eis');T.hand(['E'],['F'],['S']);T.spiele();T.log=[];T.spiele();`);
    const r2 = rx(); run(`T.log=[];T.spiele();`);
    const r3 = rx();
    ok(r2.length === 0, `Falsche Winkel: Karte 2 reagiert mit nichts von außen (${r2.join() || 'nichts'}, normal wäre Glühend)`);
    ok(r3.join() === 'Zersetzen', `Falsche Winkel: Karte 3 reagiert mit Karte 1 (Eisen→Salz: ${r3.join() || 'nichts'}), nicht mit Karte 2 (Knistern)`);
    run(`T.kampf('eis');BAL.auftrag3.falsche_winkel_beide=true;T.hand(['E'],['F'],['S']);T.spiele();T.log=[];T.spiele();`);
    const b2 = rx(); run(`T.log=[];T.spiele();BAL.auftrag3.falsche_winkel_beide=false;`);
    const b3 = rx();
    ok(b2.join() === 'Glühend' && b3.slice().sort().join() === 'Knistern,Zersetzen', `Falsche Winkel, Variante „beide“: Karte 2 ${b2.join()}, Karte 3 reagiert mit beiden (${b3.join()})`);
    run(`T.kampf('hafen');T.hand(['E'],['F'],['S']);T.spiele();T.log=[];T.spiele();`);
    const h2 = rx(); run(`T.log=[];T.spiele();`);
    ok(h2.join() === 'Glühend' && rx().join() === 'Knistern', `Falsche Winkel: im Hafen normal (Karte 2 ${h2.join()}, Karte 3 ${rx().join()})`);
    run(`T.kampf('eis');BAL.auftrag3.regelbiegung=false;T.hand(['E'],['F']);T.spiele();T.log=[];T.spiele();BAL.auftrag3.regelbiegung=true;`);
    ok(rx().join() === 'Glühend', 'Falsche Winkel: Schalter aus, Karte 2 reagiert normal mit Karte 1');
  });

  // ---------- Der Schlag (Walkathedrale) ----------
  sek('Schlag', () => {
    // E, W, F, S: Karte 3 (F) mit E und W → Glühend und Dampf; Karte 4 (S) nur mit F → Knistern, nicht Zersetzen
    run(`T.kampf('walkathedrale');T.hand(['E'],['W'],['F'],['S']);T.spiele();T.log=[];T.spiele();`);
    const r2 = rx(); run(`T.log=[];T.spiele();`);
    const r3 = rx(); run(`T.log=[];T.spiele();`);
    const r4 = rx();
    ok(r2.length === 0, `Schlag: Karte 2 reagiert normal nur mit der ersten (Eisen→Wasser: ${r2.join() || 'nichts'})`);
    ok(r3.slice().sort().join() === 'Dampf,Glühend', `Schlag: Karte 3 reagiert mit den Stoffen der ersten und zweiten (${r3.join()})`);
    ok(r4.join() === 'Knistern', `Schlag: Karte 4 wieder nur mit Karte 3 (${r4.join()}), nicht mit Eisen (Zersetzen)`);
    run(`T.kampf('hafen');T.hand(['E'],['W'],['F']);T.spiele();T.spiele();T.log=[];T.spiele();`);
    ok(rx().join() === 'Dampf', `Schlag: im Hafen reagiert Karte 3 nur mit Karte 2 (${rx().join()})`);
  });

  // ---------- Das Spiegelbild ist voraus (Glasmeer) ----------
  sek('Spiegelbild', () => {
    run(`T.kampf('glasmeer');T.stapel(6);T.hand(['E'],['F'],['W']);globalThis.top=S.draw[5];globalThis.h0=S.hand[0];`);
    ok(J(`Bieg.spiegelOffen()===top`), 'Spiegelbild: die offene Karte ist die oberste von S.draw');
    ok(J(`Bieg.spiegelTausch(9)`) === false && J(`Bieg.spiegelKann()`), 'Spiegelbild: ungültige Handkarte wird abgelehnt und verbraucht den Tausch nicht');
    const t1 = J(`Bieg.spiegelTausch(0)`);
    const a = J(`{h:S.hand[0]===top,d:S.draw[S.draw.length-1]===h0,n:S.hand.length,dn:S.draw.length,off:Bieg.spiegelOffen()===h0}`);
    ok(t1 && a.h && a.d && a.n === 3 && a.dn === 6 && a.off, `Spiegelbild: Tausch klappt (Hand hat die offene Karte, Stapel oben die abgelegte Handkarte, ${a.n} Hand / ${a.dn} Stapel)`);
    ok(J(`Bieg.spiegelTausch(1)`) === false, 'Spiegelbild: zweiter Tausch im selben Zug (false)');
    run(`endTurn();`);
    ok(J(`Bieg.spiegelTausch(0)`) === true, 'Spiegelbild: im nächsten Zug wieder möglich');
    // Bot: klar bessere offene Karte gegen schwache Handkarte
    run(`T.kampf('glasmeer');T.stapel(6);T.hand(T.karte([],{atk:0,c:1,n:'Schwach'}),T.karte([],{atk:20,c:1,n:'Stark'}));S.draw.push(T.karte([],{atk:30,c:1,n:'Offen'}));Bot.biegZugbeginn();`);
    const bot = J(`{h:S.hand.map(c=>c.n),o:Bieg.spiegelOffen().n}`);
    ok(bot.h.includes('Offen') && !bot.h.includes('Schwach') && bot.h.includes('Stark') && bot.o === 'Schwach', `Spiegelbild: der Bot tauscht die starke offene Karte gegen die schwache Handkarte (Hand ${bot.h.join(', ')}, oben ${bot.o})`);
    run(`T.kampf('glasmeer');T.stapel(6);T.hand(T.karte([],{atk:20,c:1,n:'Stark'}),T.karte([],{atk:20,c:1,n:'Stark2'}));S.draw.push(T.karte([],{atk:0,c:1,n:'Offen'}));Bot.biegZugbeginn();`);
    ok(!J(`S.hand.some(c=>c.n==='Offen')`), 'Spiegelbild: der Bot tauscht keine schwächere offene Karte');
    run(`T.kampf('hafen');T.stapel(6);T.hand(['E']);`);
    ok(J(`Bieg.spiegelOffen()`) === null && J(`Bieg.spiegelTausch(0)`) === false, 'Spiegelbild: im Hafen keine offene Karte, kein Tausch');
  });

  // ---------- Die Rückseite (Mond) ----------
  sek('Rückseite', () => {
    run(`T.kampf('mond');`);
    const m = J(`Bieg.absichtenSichtbar(S.enemies[0])`);
    run(`T.kampf('hafen');`);
    const h = J(`Bieg.absichtenSichtbar(S.enemies[0])`);
    run(`T.kampf('mond');BAL.auftrag3.regelbiegung=false;`);
    const o = J(`Bieg.absichtenSichtbar(S.enemies[0])`); run(`BAL.auftrag3.regelbiegung=true;`);
    ok(m === 2 && h === 1 && o === 1, `Rückseite: Absichten sichtbar Mond ${m}, Hafen ${h}, Schalter aus ${o}`);
  });

  // ---------- Funkspruch (Funkstation) ----------
  sek('Funkspruch', () => {
    const karten = (l) => `T.hand(${l.map(c => `T.karte([],{atk:10,c:${c}})`).join(',')});`;
    run(`T.kampf('funkstation');${karten([1, 1, 1])}`);
    const d = []; for (let i = 0; i < 3; i++) { const h0 = J(`S.enemies[0].hp`); run(`T.log=[];T.spiele();`); d.push(h0 - J(`S.enemies[0].hp`)); }
    ok(d.join() === '10,10,15' && rx().join() === 'Funkspruch', `Funkspruch: dritte Karte mit gleichen Kosten wirkt ×1,5 (Schaden ${d.join(', ')}, Reaktion ${rx().join() || 'keine'})`);
    ok(!J(`S.disc.has('Funkspruch')`), 'Funkspruch: landet nicht in S.disc');
    run(`T.kampf('funkstation');${karten([1, 1, 1, 1, 1, 1])}T.spiele();T.spiele();T.spiele();T.spiele();T.spiele();T.spiele();`);
    ok(J(`T.rx().filter(n=>n==='Funkspruch').length`) === 1, `Funkspruch: sechs gleiche Karten lösen ihn nur einmal je Zug aus (${J(`T.rx().filter(n=>n==='Funkspruch').length`)})`);
    run(`T.kampf('funkstation');${karten([1, 2, 3])}T.spiele();T.spiele();T.spiele();`);
    ok(rx().length === 0, `Funkspruch: unterschiedliche Kosten lösen nichts aus (${rx().length})`);
    run(`T.kampf('funkstation');${karten([1, 1, 2, 2])}T.spiele();T.spiele();T.spiele();T.spiele();`);
    ok(rx().length === 0, 'Funkspruch: zwei Paare gleicher Kosten (1,1,2,2) lösen nichts aus');
    run(`T.kampf('hafen');${karten([1, 1, 1])}T.spiele();T.spiele();T.spiele();`);
    const h = rx();
    run(`T.kampf('funkstation');BAL.auftrag3.regelbiegung=false;${karten([1, 1, 1])}T.spiele();T.spiele();T.spiele();BAL.auftrag3.regelbiegung=true;`);
    ok(h.length === 0 && rx().length === 0, 'Funkspruch: im Hafen und bei Schalter aus nichts');
  });

  // ---------- Außerhalb der Zeit (Pforte) ----------
  sek('Außerhalb der Zeit', () => {
    run(`T.kampf('pforte');`);
    const f = J(`(()=>{const o=[];for(let t=1;t<=30;t++){S.turnNo=t;const b=Bieg.aktiv();o.push(b?b.id:null);}return o;})()`);
    const kein = f.every(x => x && x !== 'ausser_zeit');
    const nie2 = f.every((x, i) => i === 0 || x !== f[i - 1]);
    ok(kein && f.every(x => x), `Außerhalb der Zeit: über 30 Züge nie die Pforte selbst (${new Set(f).size} verschiedene Biegungen)`);
    ok(nie2, 'Außerhalb der Zeit: nie zweimal dieselbe hintereinander');
    ok(new Set(f).size >= 5, `Außerhalb der Zeit: die Biegung wechselt wirklich (${f.slice(0, 8).join(', ')} …)`);
    run(`T.kampf('pforte');`);
    const g = J(`(()=>{const o=[];for(let t=1;t<=30;t++){S.turnNo=t;o.push(Bieg.aktiv().id);}return o;})()`);
    ok(g.join() === f.join(), 'Außerhalb der Zeit: gleicher Seed, gleiche Folge');
    run(`T.kampf('pforte',99);`);
    const h = J(`(()=>{const o=[];for(let t=1;t<=30;t++){S.turnNo=t;o.push(Bieg.aktiv().id);}return o;})()`);
    ok(h.join() !== f.join(), 'Außerhalb der Zeit: anderer Seed, andere Folge');
    run(`T.kampf('pforte');S.turnNo=3;`);
    const k = J(`(()=>{const k=Bieg.kopf();return{j:k.jetzt.id,n:k.naechste.id,wj:Bieg.wechselZug(3),wn:Bieg.wechselZug(4)};})()`);
    ok(k.j === k.wj && k.n === k.wn && k.j !== k.n, `Außerhalb der Zeit: Kopfleiste zeigt jetzt ${k.j} und nächste ${k.n}`);
    // Unterbiegung wirkt: Falsche Winkel
    run(`T.kampf('pforte');`);
    const t = J(`(()=>{for(let t=1;t<=60;t++){S.turnNo=t;if(Bieg.ist('falsche_winkel'))return t;}return 0;})()`);
    ok(t > 0, `Außerhalb der Zeit: Falsche Winkel kommt vor (Zug ${t})`);
    if (t > 0) {
      run(`T.kampf('pforte');S.turnNo=${t};Bieg.zugStart();T.hand(['E'],['F'],['S']);T.spiele();T.spiele();T.log=[];T.spiele();`);
      ok(rx().join() === 'Zersetzen', `Außerhalb der Zeit: in Zug ${t} wirkt Falsche Winkel wirklich (Karte 3 reagiert mit Karte 1: ${rx().join() || 'nichts'})`);
    }
    // Unterbiegung Aufgewogen
    const t2 = J(`(()=>{for(let t=1;t<=60;t++){S.turnNo=t;if(Bieg.ist('aufgewogen'))return t;}return 0;})()`);
    if (t2 > 0) {
      run(`T.kampf('pforte');S.turnNo=${t2};S.energy=2;S.block=0;S.enemies[0].pat=[{t:'blk',v:0}];Bieg.zugEnde();`);
      ok(J(`S.block`) === 6, `Außerhalb der Zeit: in Zug ${t2} wirkt Aufgewogen (2 Energie → ${J(`S.block`)} Block)`);
    }
  });

  // ---------- Die Wellen kommen von oben (Ufer) ----------
  sek('Wellen', () => {
    run(`T.kampf('ufer');T.stapel(30);T.hand(['E'],['F'],['W']);globalThis.h0=S.hand[0];globalThis.h1=S.hand[1];globalThis.h2=S.hand[2];T.spiele();`);
    const a = J(`{u:S.draw[0]===h0,dis:S.discard.length,n:S.draw.length}`);
    ok(a.u && a.dis === 0 && a.n === 31, `Wellen: gespielte Karte geht unter den Stapel (S.draw[0]), Ablage ${a.dis}, Stapel ${a.n}`);
    run(`endTurn();`);
    const b = J(`{d0:S.draw[0]===h2,d1:S.draw[1]===h1,d2:S.draw[2]===h0,dis:S.discard.length,n:S.draw.length,hs:handSize(),h:S.hand.length}`);
    ok(b.dis === 0 && b.h === b.hs, `Wellen: Zugende-Abwurf ebenfalls unter den Stapel, Ablage ${b.dis}, Hand ${b.h} von ${b.hs}`);
    ok(b.d0 && b.d1 && b.d2, `Wellen: Reihenfolge unten: abgeworfene Karten (letzte zuerst) über der gespielten (S.draw[0..2], Stapel ${b.n})`);
    // leerer Stapel: Ablage ohne Mischen
    run(`T.kampf('ufer');S.hand=[];S.draw=[];S.discard=[T.karte([],{n:'D1'}),T.karte([],{n:'D2'}),T.karte([],{n:'D3'}),T.karte([],{n:'D4'})];drawCards(2);`);
    const c = J(`{h:S.hand.map(c=>c.n),d:S.draw.map(c=>c.n),dis:S.discard.length}`);
    ok(c.h.join() === 'D4,D3' && c.d.join() === 'D1,D2' && c.dis === 0, `Wellen: leerer Stapel übernimmt die Ablage ohne Mischen (gezogen ${c.h.join()}, Rest ${c.d.join()})`);
    run(`T.kampf('hafen');T.stapel(30);T.hand(['E']);T.spiele();`);
    ok(J(`S.discard.length`) === 1 && J(`S.draw.length`) === 30, 'Wellen: im Hafen geht die Karte auf die Ablage');
  });

  // ---------- Aufgewogen (Waage) ----------
  sek('Aufgewogen', () => {
    const lauf = (biom, sw = true) => { run(`T.kampf('${biom}');BAL.auftrag3.regelbiegung=${sw};T.stapel(20);T.hand(['E']);S.enemies[0].pat=[{t:'atk',v:10}];S.enemies[0].pi=0;S.enemies[0].str=0;S.energy=4;globalThis.hp0=S.hp;endTurn();BAL.auftrag3.regelbiegung=true;`);
      return J(`{hp:hp0-S.hp,l:T.log.filter(x=>x.biegung).map(x=>x.why)}`); };
    const w = lauf('waage'), h = lauf('hafen'), o = lauf('waage', false);
    ok(w.hp === 0 && w.l.some(x => /4 Energie → 12 Block/.test(x)), `Aufgewogen: 4 übrige Energie = 12 Block fängt die 10 vor dem Gegnerzug (Verlust ${w.hp} Leben)`);
    ok(h.hp === 10 && o.hp === 10, `Aufgewogen: im Hafen (Verlust ${h.hp}) und bei Schalter aus (${o.hp}) trifft der Angriff voll`);
  });

  // ---------- Vorschau = Kampf ----------
  sek('Vorschau', () => {
    const vgl = (name, setup, ziel) => {
      run(setup);
      const pv = J(`previewCard(${ziel},0).rx.map(r=>r.n)`);
      run(`T.log=[];playCard(${ziel},0);`);
      const k = rx();
      ok(pv.slice().sort().join() === k.slice().sort().join() && k.length > 0, `Vorschau = Kampf, ${name}: Vorschau ${pv.join() || 'nichts'}, Kampf ${k.join() || 'nichts'}`);
    };
    vgl('alte Stoffe', `T.kampf('salz');T.hand(['S'],['W']);T.spiele();`, 0);
    vgl('falsche Winkel', `T.kampf('eis');T.hand(['E'],['F'],['S']);T.spiele();T.spiele();`, 0);
    vgl('Schlag', `T.kampf('walkathedrale');T.hand(['E'],['W'],['F']);T.spiele();T.spiele();`, 0);
    vgl('Funkspruch', `T.kampf('funkstation');T.hand(T.karte([],{atk:10}),T.karte([],{atk:10}),T.karte([],{atk:10}));T.spiele();T.spiele();`, 0);
    vgl('Ringofen', `T.kampf('ziegelgruben');T.stapel(40,['F']);T.hand(['E']);T.spiele();endTurn();S.energy=99;`, 0);
  });

  console.log(fehler ? `${fehler} Fehler.` : 'Alles gut.');
  process.exit(fehler ? 1 : 0);
})();
