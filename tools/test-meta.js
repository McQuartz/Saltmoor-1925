// M5: 20 Runs hintereinander mit gemeinsamem Meta-Speicher. Zeigt, nach wie vielen Runs was frei ist.
// node tools/test-meta.js [runs=20] [startSeed=1]
// Auftrag 3 M10: danach die Prüfungen der Metaebene (Strand, Ausrede, Ankunft, Notizen, Erbe, Fehlzeit, Pause, Schalter). Exit 1 bei Fehler.
const {ladeKern}=require('./kern');
(async()=>{const n=+(process.argv[2]||20),s0=+(process.argv[3]||1);const K=ladeKern();await K.init();K.run('Meta.reset()');
 for(let i=0;i<n;i++){const job=K.run(`(()=>{const f=JOBS.filter(Meta.figurFrei);return f[${i}%f.length].id})()`);
  const r=K.run(`Bot.spiele(${JSON.stringify(job)},${s0+i},{meta:true})`);
  const v=K.run('JSON.stringify(Meta.get().verlauf.slice(-1)[0]||{})');const neu=JSON.parse(v).neu||[];
  console.log(`| ${i+1} | ${job} | ${r.sieg?'Sieg':'Strand'} | ${r.tiefe} | ${K.run('Meta.get().fragmente.length')} | ${neu.join(', ')||'–'} |${r.fehler?' FEHLER '+r.fehler.split('\n')[0]:''}`);}
 // Neuladen: Meta bleibt (localStorage), Reset leert
 const vor=K.run('Meta.get().fragmente.length');K.run('(()=>{const raw=localStorage.getItem("saltmoor.meta.v1");return raw})()');
 console.log(`\nFragmente gespeichert: ${vor}, nach Reset: ${K.run('(Meta.reset(),Meta.get().fragmente.length)')}`);
 await metaebene(K);})();
async function metaebene(K){const run=K.run;let fehler=0,n=0;const ok=(c,m)=>{n++;if(!c){fehler++;console.log('FEHLER: '+m);}else console.log('ok    '+m);};
 const M=()=>JSON.parse(run('JSON.stringify(Meta.get())'));const set=(k,v)=>run(`Meta.get()[${JSON.stringify(k)}]=${JSON.stringify(v)};Meta.save()`);
 console.log('\n=== Metaebene (M10) ===');run('Meta.reset()');
 // Das Spiel zählt mit
 const st=[0,1,4,14,39].map(r=>(set('runs',r),run('Metaebene.strandStufe()')));ok(JSON.stringify(st)==='[0,1,2,3,4]',`Strand-Stufen bei 0/1/4/14/39 Runs: ${st}`);
 // Die Ausrede bröckelt (Stufe 0 = jobs.json wörtlich)
 const j0=run('JOBS[0].ausrede');const aus=[0,2,7,14].map(r=>(set('runsJob',{[run('JOBS[0].id')]:r}),run('Metaebene.ausrede(JOBS[0])')));
 ok(aus[0]===j0&&aus[1]!==j0&&aus[2]!==aus[1]&&aus[3]==='Ich gehe hinunter.',`Ausrede-Stufen: ${aus.map(x=>'„'+x+'“').join(' / ')}`);
 ok(run('JOBS.every(j=>META.ausrede[j.id]&&META.ausrede[j.id].length===2&&META.ausrede[j.id].every(x=>x.entwurf))'),'Ausrede: je Figur zwei Stufen, alle Entwurf');
 run('Meta.reset()');
 // Bleiben ist der Sog: erstes Umkehren → einmal die Ankunftszeile
 run(`newRun('fischer',3,{});S.phase='ankunft';chooseEnde('umkehren')`);ok(M().ankunftOffen&&run('!!Metaebene.ankunftZeile()'),'Nach dem ersten Umkehren: Ankunftszeile steht');
 run(`newRun('fischer',4,{});`);ok(!M().ankunftOffen&&!run('Metaebene.ankunftZeile()'),'Nach dem nächsten Start: Ankunftszeile weg');
 run(`S.phase='ankunft';chooseEnde('umkehren')`);ok(!M().ankunftOffen,'Zweites Umkehren: keine Ankunftszeile mehr');
 run('Meta.reset()');
 // Tagebuch des Vorgängers: 1/3 nach verlorenem Run, Anteil falscher Notizen = Tiefe/40, höchstens 60 %
 let mit=0,ges=0,falsch=0,zeilen=0;const N=300;
 for(let s=1;s<=N;s++){set('letzter',{verloren:true,job:'fischer',tiefe:s%2?8:30,biome:['hafen','kapelle','salz'],waechter:['lotse','glockenmutter']});
  run(`newRun('fischer',${s},{});S.phase='weg';enterNode({art:'rast'})`);const no=JSON.parse(run('JSON.stringify(S.notizen)'));ges++;if(no){mit++;zeilen+=no.length;falsch+=no.filter(x=>!x.wahr).length;
   if(no.some(x=>!x.t))ok(false,'Notiz ohne Text');}}
 ok(mit/ges>.25&&mit/ges<.42,`Notizen an der ersten Rast in ${mit} von ${ges} Runs (soll etwa 1/3)`);
 ok(zeilen>=mit&&zeilen<=mit*3,`Notizen je Fund: Mittel ${(zeilen/mit).toFixed(2)} (1 bis 3)`);
 ok(falsch/zeilen>.25&&falsch/zeilen<.55,`Anteil falscher Notizen bei Tiefe 8 und 30 gemischt: ${Math.round(falsch/zeilen*100)} % (erwartet etwa 40 %)`);
 set('letzter',{verloren:false,tiefe:30,biome:['hafen'],waechter:['lotse']});let nachSieg=0;for(let s=1;s<=60;s++){run(`newRun('fischer',${s},{});S.phase='weg';enterNode({art:'rast'})`);if(run('!!S.notizen'))nachSieg++;}
 ok(nachSieg===0,'Nach einem Sieg keine Notizen');
 ok(run('Object.keys(BIOMES).every(b=>META.notizen.biome[b])')&&run('Object.values(BIOMES).every(b=>[b.waechter,...(b.waechter_alt||[])].filter(Boolean).every(w=>META.notizen.waechter[w]))'),'Notizen: jedes Biom und jeder Wächter hat eine wahre und eine falsche');
 ok(M().seiten.length>0,`Tagebuch: ${M().seiten.length} Seiten gemerkt (höchstens 12)`);
 run('Meta.reset()');
 // Das Erbe
 run(`Bot.spiele('fischer',11,{meta:true})`);const e=M().erbe;ok(e&&run(`!!HANDGRIFFE[${JSON.stringify(e&&e.hg)}]`)&&e.st.length>0,`Erbe gemerkt: ${e&&e.hg} (${e&&e.n}×, Stoffe ${e&&e.st.join('')})`);
 run(`newRun('fischer',12,{})`);ok(run('S.phase')==='erbe','Erbe wird nach der Figurwahl angeboten');
 const d0=run('deckListe().length');run('Metaebene.erbeWahl(true)');ok(run('deckListe().length')===d0+1&&run('deckListe().some(c=>c.erbe&&c.hg==='+JSON.stringify(e.hg)+')'),'Erbe genommen: liegt zusätzlich lose im Deck');
 ok(['uebergang','biomwahl'].includes(run('S.phase')),'Nach dem Erbe geht der Run los');
 run(`newRun('fischer',12,{});Metaebene.erbeWahl(false)`);ok(run('deckListe().length')===d0&&!run('S.loseHg.length'),'Erbe abgelehnt: Deck unverändert');
 run(`newRun('fischer',12,{});Metaebene.erbeWahl(true);strikeItem('losehg:0')`);ok(run('S.loseHg.length')===0,'Erbe lässt sich streichen');
 // Fehlzeit
 run('Meta.reset()');run(`newRun('fischer',5,{});S.akt=4;runLost()`);ok(M().fehlzeitAngebot,'Tod in Akt V: Fehlzeit wird angeboten');
 run(`newRun('fischer',5,{});S.akt=3;runLost()`);ok(!M().fehlzeitAngebot,'Tod in Akt IV: keine Fehlzeit');
 let lebt=0,tot=0,feh=0;for(let s=1;s<=20;s++){run('Meta.reset()');set('fehlzeitAngebot',true);run('Metaebene.fehlzeitWahl(true)');run(`newRun('veteran',${s},{})`);if(run('S.phase')==='erbe')run('Metaebene.erbeWahl(false)');
  const z=JSON.parse(run('JSON.stringify({akt:S.akt,ph:S.phase,fz:S.fehlzeit,fremd:allActive().filter(i=>i.fremd&&Object.keys(i.fremd).some(k=>k[0]==="h")).length,lose:S.loseHg,dev:S.dev,muted:Bus.muted,nf:Meta.get().fehlzeitNaechster})'));
  if(z.akt!==1||!['uebergang','biomwahl'].includes(z.ph)||z.dev||z.muted||z.nf){feh++;console.log('  Seed',s,JSON.stringify(z));}
  if(z.fz&&z.fz.tot){tot++;if(!(z.lose.length===1&&z.lose[0].art==='fremd'))feh++;}else{lebt++;if(!z.fremd)feh++;}}
 ok(feh===0,`Fehlzeit, 20 Seeds: beginnt in Akt II (${lebt} mit seinem Deck in fremder Fassung, ${tot} nach seinem Tod mit Startdeck und einem fremden Handgriff)`);
 ok(run(`(()=>{Meta.reset();Meta.get().fehlzeitNaechster=true;newRun('veteran',3,{});if(S.phase==='erbe')Metaebene.erbeWahl(false);return S.fehlzeit&&S.fehlzeit.zeilen.length>0&&!!Metaebene.übergangSatz();})()`),'Fehlzeit: Tagebucheinträge und Satz am Übergang');
 // Pause
 run('Meta.reset()');const T=86400000,jetzt=Date.UTC(2026,10,9);set('runs',3);set('letzterOrt','kapelle');
 set('zuletzt',jetzt-10*T);ok(!run(`Metaebene.sitzung(${jetzt})`),'Pause 10 Tage: keine Zeile');
 set('zuletzt',jetzt-20*T);ok(run(`Metaebene.sitzung(${jetzt})`)===run('META.pause.kapelle.t'),'Pause 20 Tage: Zeile der Kapelle');
 set('zuletzt',jetzt+5*T-20*T);ok(!run(`Metaebene.sitzung(${jetzt+5*T})`),'Zweite lange Pause nach 5 Tagen: keine Zeile (höchstens einmal in 30 Tagen)');
 set('zuletzt',jetzt+40*T-20*T);ok(!!run(`Metaebene.sitzung(${jetzt+40*T})`),'Nach 40 Tagen wieder möglich');
 // Schalter
 run('Meta.reset()');run('BAL.auftrag3.meta=false');set('runs',20);set('runsJob',{fischer:20});run("Meta.get().erbe={hg:Object.keys(HANDGRIFFE)[0],st:['S'],src:'x',n:9}");set('ankunftOffen',true);
 ok(run('Metaebene.strandStufe()')===0&&run('Metaebene.ausrede(JOBS[0])')===j0&&!run('Metaebene.ankunftZeile()'),'meta aus: Strand, Ausrede, Ankunft wie vorher');
 run(`newRun('fischer',3,{})`);ok(run('S.phase')!=='erbe'&&!run('S.loseHg.length'),'meta aus: kein Erbe');run('BAL.auftrag3.meta=true');
 run('BAL.auftrag3.fehlzeit=false');run(`Meta.reset();newRun('fischer',5,{});S.akt=4;runLost()`);ok(!M().fehlzeitAngebot,'fehlzeit aus: kein Angebot');run('BAL.auftrag3.fehlzeit=true');
 run('BAL.auftrag3.pause=false');set('runs',3);set('letzterOrt','kapelle');set('zuletzt',jetzt-20*T);set('pauseGezeigt',0);ok(!run(`Metaebene.sitzung(${jetzt})`),'pause aus: keine Zeile');run('BAL.auftrag3.pause=true');
 run('Meta.reset()');console.log(`\nMetaebene: ${n} Prüfungen, ${fehler?fehler+' FEHLER':'alles gut'}`);process.exitCode=fehler?1:0;}
