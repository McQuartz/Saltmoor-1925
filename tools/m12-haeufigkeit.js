// Auftrag 3 M12: Wie oft kommt jedes System, jede Begegnung und jedes Würze-Stück pro Run vor? (01-regeln.md Abschnitt 9)
// node tools/m12-haeufigkeit.js [runs=100] [startSeed=1]   Autospieler, Figuren reihum, alle Systeme an. Dazu Niederlagen je Akt.
const { ladeKern } = require('./kern');
(async () => {
  const n = +(process.argv[2] || 100), s0 = +(process.argv[3] || 1); const K = ladeKern(); await K.init();
  const r = K.run(`(()=>{const jobs=JOBS.map(j=>j.id);let st;const Z={};const z=(k,v=1)=>{st[k]=(st[k]||0)+v;};
  Bus.on('fight_start',()=>{z('kaempfe');const b=Bieg.aktiv();if(b){z('kampf_mit_biegung');st.bieg.add(b.id);}if(S.enemies.some(e=>Hoeren.istStumm(e)))z('kampf_mit_stummem');});
  Bus.on('blick',x=>{if(x&&x.art==='wahl'||x&&x.ja!==undefined)z('blick_wahl');z('blick_ereignis');});
  Bus.on('farbe',()=>z('farbe_ereignis'));Bus.on('tiefe',x=>z('tiefe_'+(x&&x.art)));Bus.on('asche',x=>z('asche_'+(x&&x.art)));Bus.on('wuerze',x=>z('wuerze_'+(x&&x.art)));
  const L=[];for(let i=0;i<${n};i++){const seed=${s0}+i;st={bieg:new Set()};const res=Bot.spiele(jobs[seed%jobs.length],seed,{});
   const a=S.route?S.akt:0;L.push({seed,sieg:!!res.sieg,akt:a,bieg:st.bieg.size,farbe:!!S.farbe,blickItem:!!(typeof Blick!=='undefined'&&Blick.traegt()),beg:(S.zettel.begegnungen||[]),wz:(S.zettel.wuerze||[]),diener:S.dienerGespielt?1:0,st:Object.fromEntries(Object.entries(st).filter(([k])=>k!=='bieg'))});}
  return L;})()`);
  const N = r.length, m = f => (r.reduce((s, x) => s + f(x), 0) / N);
  const zaehl = (k) => r.filter(x => (x.st[k] || 0) > 0).length;
  console.log(`Runs ${N}, Siege ${r.filter(x => x.sieg).length}`);
  console.log(`Regelbiegungen: Ø ${m(x => x.bieg).toFixed(2)} verschiedene je Run, Kämpfe mit Biegung Ø ${m(x => x.st.kampf_mit_biegung || 0).toFixed(1)} von ${m(x => x.st.kaempfe || 0).toFixed(1)}`);
  console.log(`Hören: Kämpfe mit stummem Gegner Ø ${m(x => x.st.kampf_mit_stummem || 0).toFixed(2)} je Run, in ${zaehl('kampf_mit_stummem')} von ${N} Runs`);
  console.log(`Blick: Blick-Item am Ende getragen in ${r.filter(x => x.blickItem).length} Runs, Blick-Meldungen Ø ${m(x => x.st.blick_ereignis || 0).toFixed(2)}`);
  console.log(`Farbe: im Run in ${r.filter(x => x.farbe).length} von ${N} Runs, Meldungen Ø ${m(x => x.st.farbe_ereignis || 0).toFixed(2)}`);
  const B = {}; r.forEach(x => x.beg.forEach(b => B[b] = (B[b] || 0) + 1));
  console.log(`Begegnungen auf dem Zettel (je Run höchstens ${Math.max(...r.map(x => x.beg.length))}, Ø ${m(x => x.beg.length).toFixed(2)}): ${JSON.stringify(B)}`);
  console.log(`  Tiefe: Zeichen bekommen in ${zaehl('tiefe_zeichen')} Runs, gespielt (Seitenwechsel) in ${zaehl('tiefe_seite')}, Begegnung statt Kampf Ø ${m(x => x.st.tiefe_begegnung || 0).toFixed(2)}; Asche gerufen in ${zaehl('asche_gerufen') || zaehl('asche_ruf')} Runs`);
  const W = {}; r.forEach(x => x.wz.forEach(b => W[b] = (W[b] || 0) + 1));
  console.log(`Würze (je Run höchstens ${Math.max(...r.map(x => x.wz.length))}, Ø ${m(x => x.wz.length).toFixed(2)}): ${JSON.stringify(W)}`);
  const ak = [0, 0, 0, 0, 0]; r.filter(x => !x.sieg).forEach(x => ak[Math.min(4, x.akt)]++); const t = ak.reduce((a, b) => a + b, 0);
  console.log(`Niederlagen je Akt I–V: ${ak.join('/')} (${ak.map(v => Math.round(100 * v / Math.max(1, t)) + ' %').join(' · ')})`);
})();
