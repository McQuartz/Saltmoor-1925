// Verlauf eines Autospieler-Runs, Kampf für Kampf: node tools/verlauf.js [figur] [seed] [--m7]
const {ladeKern}=require('./kern');const fs=require('fs'),path=require('path');
(async()=>{const a=process.argv.slice(2);const job=a[0]||'pfarrerin',seed=+(a[1]||7);const K=ladeKern();await K.init();
 if(a.includes('--m7')){const f=JSON.parse(fs.readFileSync(path.join(__dirname,'../prototype/data/foes_m7.json'),'utf8'));
  K.run(`FOES=${JSON.stringify(f)};for(const b in BIOMES){const ids=Object.keys(FOES).filter(k=>FOES[k].biom===b);BIOMES[b].gegner=ids.filter(k=>FOES[k].rang==='normal');const w=ids.find(k=>FOES[k].rang!=='normal');if(w)BIOMES[b].waechter=w;}`);}
 for(const x of a.filter(x=>x.startsWith('--set=')))K.run(x.slice(6));
 const L=K.run(`(()=>{const L=[];let h0=0;
  Bus.on('fight_start',p=>{h0=S.hp;L.push('T'+S.depth+' '+S.route[S.akt]+' '+p.art+' ['+S.enemies.map(e=>e.id+':'+e.hp).join(', ')+'] Leben '+S.hp+'/'+maxHp()+', Deck '+(S.draw.length+S.hand.length));});
  Bus.on('victory',()=>{L.push('   gewonnen in '+S.turnNo+' Zügen, verloren '+(h0-S.hp));});
  Bus.on('weg_gewaehlt',p=>L.push('  > '+p.why));
  const r=Bot.spiele(${JSON.stringify(job)},${seed},{});L.push(JSON.stringify(r));
  L.push('Ausrüstung: '+allActive().map(it=>def(it).n).join(', '));L.push('Rucksack: '+S.bag.filter(Boolean).map(it=>def(it).n).join(', '));L.push('Slots: '+JSON.stringify(S.slots)+', Gold '+S.gold);
  return L;})()`);console.log(L.join('\n'));})();
