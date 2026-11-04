// Autospieler nur in einem Biom (Abnahme je Biom-Paket): node tools/biom-test.js <biom> [seeds=10] [startSeed=1]
// Startet je Seed einen Dev-Run, springt an den Anfang des Akts dieses Bioms und spielt den ganzen Akt
// (alle Ebenen bis einschließlich Wächter). Meldet Siege (Akt überstanden), Leben am Ende, Gegner, Fehler.
const {ladeKern}=require('./kern');
(async()=>{const a=process.argv.slice(2);const biom=a[0];const n=+(a[1]||10),s0=+(a[2]||1);if(!biom){console.log('Aufruf: node tools/biom-test.js <biom> [seeds] [start]');process.exit(2);}
 const K=ladeKern();await K.init();if(!K.run(`!!BIOMES[${JSON.stringify(biom)}]`)){console.log('Biom unbekannt (in data/biome/index.json eingetragen?): '+biom);process.exit(2);}
 const r=K.run(`(()=>{const out=[];const akt=BIOMES[${JSON.stringify(biom)}].akt;const jobs=JOBS.slice(0,6).map(j=>j.id);
  for(let i=0;i<${n};i++){const seed=${s0}+i;const kf=FAST;FAST=true;let fehler=null,gegner=new Set(),kaempfe=0;
   try{const route=RUN.akte.map((x,k)=>k===akt?${JSON.stringify(biom)}:x.biome.find(b=>BIOMES[b]));newRun(jobs[i%6],seed,{dev:true,route});
    // Vorbereitung: Ausrüstung wie nach den Akten davor (Leben und Gold grob)
    S.akt=akt;S.depth=akt*7;S.gold=40*akt;S.bonusHp=akt*4;S.hp=maxHp();enterAct();
    Bus.on('fight_start',p=>{if(S.akt===akt){kaempfe++;S.enemies.forEach(e=>gegner.add(e.id));}});
    let g=0;while(S.akt===akt&&!['strand','ende'].includes(S.phase)&&g++<3000){if(!Bot.schritt())throw new Error('Bot hängt in '+S.phase);}
   }catch(e){fehler=String(e&&e.stack||e).split('\\n').slice(0,3).join(' | ');}finally{FAST=kf;}
   out.push({seed,job:jobs[i%6],ueberlebt:S.akt>akt||S.phase==='ankunft'||S.phase==='ende',hp:S.hp,max:maxHp(),kaempfe,gegner:[...gegner],fehler});}
  return out;})()`);
 let ok=0;for(const x of r){if(x.ueberlebt)ok++;console.log(`${String(x.seed).padStart(3)} ${x.job.padEnd(17)} ${x.ueberlebt?'überstanden':'Strand     '} Leben ${x.hp}/${x.max} Kämpfe ${x.kaempfe} Gegner ${x.gegner.join(',')}${x.fehler?' FEHLER '+x.fehler:''}`);}
 const fe=r.filter(x=>x.fehler).length;console.log(`\n${biom}: ${ok}/${r.length} Akte überstanden, Fehler ${fe}`);process.exit(fe?1:0);})();
