// M1-Prüfungen: Wege über Seeds, Ebenen-Regeln, Gleicher Seed = gleicher Weg. Aufruf: node tools/test-run.js
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const run=K.run;
 let fehler=0;const ok=(c,m)=>{if(!c){fehler++;console.log('FEHLER: '+m);}};
 // 1. Wege über 20 Seeds
 const wege={};for(let s=1;s<=20;s++){run(`newRun('${['fischer','friedhofswaerter','pfarrerin','detektiv','okkultist','kneipenschlaeger'][s%6]}',${s},{dev:true})`);const r=run('S.route.join(">")');wege[r]=(wege[r]||0)+1;}
 console.log('Wege über 20 Seeds:',wege);ok(Object.keys(wege).length===4,'nicht alle vier Wege kommen vor');
 // 2. Gleicher Seed → gleicher Weg und gleiche Weg-Wahl
 run(`newRun('fischer',77,{dev:true});leaveUebergang();`);const a=run('JSON.stringify([S.route,S.weg])');
 run(`newRun('fischer',77,{dev:true});leaveUebergang();`);const b=run('JSON.stringify([S.route,S.weg])');ok(a===b,'gleicher Seed ergibt anderen Weg');
 // 3. Ebenen-Regeln für 100 Seeds: alle Weg-Wahlen eines Runs erzeugen (ohne zu spielen)
 const RUN=K.get('RUN');let geprueft=0;
 for(let s=1;s<=100;s++){run(`newRun('pfarrerin',${s},{dev:true})`);
  for(let akt=0;akt<5;akt++){const eb=RUN.akte[akt].ebenen;for(let e=0;e<eb.length;e++){run(`S.akt=${akt};S.ebene=${e};genWeg()`);const arten=JSON.parse(run('JSON.stringify(S.weg.map(o=>o.art))'));const E=RUN.ebenen[eb[e]];geprueft++;
   if(E.fest)ok(arten.length===1&&arten[0]===E.fest,`Seed ${s} Akt ${akt} Ebene ${e}: fest ${E.fest}, ist ${arten}`);
   else if(E.fest_wahl)ok(JSON.stringify(arten)===JSON.stringify(E.fest_wahl),`Vorraum falsch ${arten}`);
   else{ok(arten.length>=E.wege[0]&&arten.length<=E.wege[1],`Seed ${s} ${eb[e]}: ${arten.length} Wege`);
    if(E.mindestens)for(const[k,v]of Object.entries(E.mindestens))ok(arten.filter(x=>x===k).length>=v,`Seed ${s} ${eb[e]}: zu wenig ${k} (${arten})`);
    if(E.verschiedene)ok(new Set(arten).size>=E.verschiedene,`Seed ${s} ${eb[e]}: zu wenig verschiedene (${arten})`);
    if(E.einer_von)ok(arten.some(x=>E.einer_von.includes(x)),`Seed ${s} ${eb[e]}: weder Rast noch Werkstatt (${arten})`);
    ok(arten.every(x=>E.pool.includes(x)),`Seed ${s}: Art nicht im Pool (${arten})`);}}}}
 console.log(`Ebenen geprüft: ${geprueft}`);
 console.log(fehler?`${fehler} FEHLER`:'Alles gut.');process.exit(fehler?1:0);})();
