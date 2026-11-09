// Auftrag 3: Tests der Kern-Systeme (docs/auftrag-3/06-lovecraft-kern.md Abschnitt 8). Teil Hören (M6); Blick und Farbe kommen dazu.
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

  console.log(fehler ? `${fehler} Fehler.` : 'Alles gut.');
  process.exit(fehler ? 1 : 0);
})();
