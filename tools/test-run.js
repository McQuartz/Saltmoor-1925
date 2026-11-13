// Prüfungen für den Run-Ablauf (Auftrag 1 M1, Auftrag 2 M2): node tools/test-run.js
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const run=K.run;
 let fehler=0;const ok=(c,m)=>{if(!c){fehler++;console.log('FEHLER: '+m);}};
 const RUN=K.get('RUN'),BIOMES=K.get('BIOMES');const jobs=K.get('JOBS').map(j=>j.id);
 // 1. Biom-Angebote über 40 Seeds: jedes vorhandene Biom wird mal angeboten, immer zwei (wenn möglich), Vorliebe in Akt I dabei
 const gesehen={};for(let s=1;s<=40;s++){const job=jobs[s%6];run(`newRun('${job}',${s},{dev:true})`);
  for(let a=0;a<5;a++){const an=JSON.parse(run(`(()=>{const x=biomAngebot(${a});return JSON.stringify(x.biome)})()`));an.forEach(b=>gesehen[b]=1);
   const da=RUN.akte[a].biome.filter(b=>BIOMES[b]);ok(an.length===Math.min(2,da.length),`Seed ${s} Akt ${a}: ${an.length} Biome angeboten`);
   if(a===0){const v=run(`JOBS.find(j=>j.id==='${job}').vorliebe`);if(da.includes(v))ok(an.includes(v),`Seed ${s}: Vorliebe ${v} fehlt im Angebot`);}
   run(`S.route[${a}]=${JSON.stringify(an[0])}`);}}
 const fehlt=Object.keys(BIOMES).filter(b=>!gesehen[b]);ok(!fehlt.length,'nie angeboten: '+fehlt);console.log('Angebotene Biome:',Object.keys(gesehen).join(', '));
 // 2. Gleicher Seed → gleiches Angebot und gleiche Weg-Wahl
 const zug=s=>{run(`newRun('fischer',${s},{dev:true});if(S.phase==='biomwahl')chooseBiom(0);leaveUebergang();`);return run('JSON.stringify([S.route,S.weg])');};
 ok(zug(77)===zug(77),'gleicher Seed ergibt anderen Weg');
 // 3. Ebenen-Regeln für 100 Seeds (Auftrag 3 M3: die Regeln gelten für jede Ebene des Netzes, S.netz.ebenen, statt für die alte 1-aus-3-Wahl)
 let geprueft=0;
 for(let s=1;s<=100;s++){run(`newRun('pfarrerin',${s},{dev:true});for(let i=0;i<5;i++)S.route[i]=RUN.akte[i].biome.find(b=>BIOMES[b]);`);
  for(let akt=0;akt<5;akt++){const eb=RUN.akte[akt].ebenen;for(let e=0;e<eb.length;e++){run(`S.akt=${akt};S.ebene=${e};S.netz=null;genWeg()`);const arten=JSON.parse(run(`JSON.stringify(S.netz.ebenen[${e}].map(o=>o.art))`));const E=RUN.ebenen[eb[e]];geprueft++;
   if(E.fest)ok(arten.length===1&&arten[0]===E.fest,`Seed ${s} Akt ${akt} Ebene ${e}: fest ${E.fest}, ist ${arten}`);
   else if(E.fest_wahl){const ve=run(`(BIOMES[S.route[${akt}]]||{}).vorraum_elite||''`);ok(JSON.stringify(arten)===JSON.stringify(ve&&eb[e]==='vorraum'?['kampf_schwer']:E.fest_wahl),`Vorraum falsch ${arten}`);} // Biome mit vorraum_elite (Ufer, Waage, Pforte ab Runde 3) haben nur den schweren Kampf
   else{ok(arten.length>=E.wege[0]&&arten.length<=E.wege[1],`Seed ${s} ${eb[e]}: ${arten.length} Wege`);
    if(E.mindestens)for(const[k,v]of Object.entries(E.mindestens))ok(arten.filter(x=>x===k).length>=v,`Seed ${s} ${eb[e]}: zu wenig ${k} (${arten})`);
    if(E.verschiedene)ok(new Set(arten).size>=E.verschiedene,`Seed ${s} ${eb[e]}: zu wenig verschiedene (${arten})`);
    if(E.einer_von)ok(arten.some(x=>E.einer_von.includes(x)),`Seed ${s} ${eb[e]}: keiner von ${E.einer_von} (${arten})`);
    ok(arten.every(x=>E.pool.includes(x)),`Seed ${s}: Art nicht im Pool (${arten})`);}}}}
 console.log(`Ebenen geprüft: ${geprueft}`);
 // 4. Ganze Runs: Knotenzahl (Ziel M2: Ø mindestens 26), jeder Run endet
 const r=JSON.parse(run(`(()=>{const o=[];BAL.start_hp=900;for(let s=1;s<=10;s++){const x=Bot.spiele(jobs=JOBS[s%6].id,s,{});o.push([x.tiefe,x.sieg,x.fehler]);}BAL.start_hp=50;return JSON.stringify(o)})()`.replace('jobs=','')));
 r.forEach(([t,s,f])=>{ok(!f,'Run-Fehler '+f);ok(s,'Run ohne Sieg trotz viel Leben');});console.log('Knoten je vollem Run:',r.map(x=>x[0]).join(', '));
 console.log(fehler?`${fehler} FEHLER`:'Alles gut.');process.exit(fehler?1:0);})();
