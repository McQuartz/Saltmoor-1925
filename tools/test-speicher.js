// Auftrag 3 M3: Das Netz der Peilkarte gehört zum Speicherstand. node tools/test-speicher.js [seeds=30]
// Prüft je Seed: Netz nach Speichern und Laden gleich (Knoten, Kanten, Position, gegangene Wege, Nebel, eingestürzte Gänge),
// Laden baut das Netz nicht neu, die erreichbaren Knoten (S.weg) sind dieselben, ein Weiterspielen nach dem Laden geht im selben Netz weiter.
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const run=K.run;
 let fehler=0,n=0;const ok=(c,m)=>{n++;if(!c){fehler++;console.log('FEHLER: '+m);}};
 const seeds=+(process.argv[2]||30);
 const netz=()=>run('JSON.stringify(S.netz)'),weg=()=>run('JSON.stringify((S.weg||[]).map(o=>[o.art,o.ziel]))');
 let mitBruch=0,mitKlar=0;
 for(let s=1;s<=seeds;s++){
  run(`newRun('fischer',${s},{dev:true});if(S.phase==='biomwahl')chooseBiom(0);leaveUebergang();`);
  ok(run('S.phase')==='weg'&&run('!!S.netz'),`Seed ${s}: kein Netz am Aktanfang`);
  // zwei Schritte im Netz gehen (Position direkt setzen wie chooseWeg, ohne den Knoten zu spielen)
  for(let k=0;k<2;k++)run(`(()=>{const o=S.weg[${s}%S.weg.length];netzGehe(o);genWeg();})()`);
  // je zweiter Seed: einen brüchigen Gang einstürzen lassen, je dritter: Wandbild gelesen
  if(s%2===0&&run('S.netz.kanten.some(k=>k.bruch)')){run(`(()=>{const k=S.netz.kanten.find(k=>k.bruch);k.bruch.weg=true;})()`);mitBruch++;}
  if(s%3===0){run('netzKlar()');mitKlar++;}
  run('genWeg()');
  const vorN=netz(),vorW=weg(),vorPos=run('JSON.stringify(S.netz.pos)');
  run('save(true)');
  // anderen Zustand herstellen, dann laden
  run(`newRun('pfarrerin',${s+1000},{dev:true});if(S.phase==='biomwahl')chooseBiom(0);leaveUebergang();`);
  ok(netz()!==vorN,`Seed ${s}: Testaufbau, das zweite Netz gleicht dem ersten`);
  ok(run('loadRun()')===true,`Seed ${s}: loadRun schlägt fehl`);
  ok(netz()===vorN,`Seed ${s}: Netz nach dem Laden anders`);
  ok(weg()===vorW,`Seed ${s}: erreichbare Knoten nach dem Laden anders (${weg()} statt ${vorW})`);
  ok(run('JSON.stringify(S.netz.pos)')===vorPos,`Seed ${s}: Position anders`);
  // genWeg nach dem Laden baut das Netz nicht neu
  run('genWeg()');ok(netz()===vorN,`Seed ${s}: genWeg nach dem Laden baut das Netz neu`);
  // Weiterspielen: ein Schritt nach dem Laden führt zu einem Nachfolger der gespeicherten Position
  const nach=JSON.parse(run(`(()=>{const o=S.weg[0];netzGehe(o);return JSON.stringify(o.ziel)})()`));
  const vorObj=JSON.parse(vorN);
  ok(vorObj.kanten.some(k=>JSON.stringify(k.a)===vorPos&&JSON.stringify(k.b)===JSON.stringify(nach)&&!(k.bruch&&k.bruch.weg))||(vorPos==='null'&&nach[0]===0),`Seed ${s}: Schritt nach dem Laden geht nicht von der gespeicherten Position aus`);
 }
 run('clearSave()');
 console.log(`Seeds: ${seeds}, Prüfungen: ${n}, davon mit eingestürztem Gang: ${mitBruch}, mit Wandbild: ${mitKlar}`);
 console.log(fehler?`${fehler} FEHLER`:'Alles gut.');process.exit(fehler?1:0);
})();
