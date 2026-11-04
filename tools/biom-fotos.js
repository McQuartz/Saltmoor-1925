// Je Biom ein Kampf und der Wächter (Pforte: Finale), als Bildschirmfotos: node tools/biom-fotos.js <ordner> [seed]
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.',seed=+(process.argv[3]||5);require('fs').mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const f=[];
 p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))f.push(m.text());});
 const wege={hafen:['hafen','kapelle','salz','eis','pforte'],moor:['moor','kapelle','stadt','eis','pforte'],kapelle:['hafen','kapelle','salz','eis','pforte'],
  salz:['hafen','kapelle','salz','eis','pforte'],stadt:['moor','kapelle','stadt','eis','pforte'],eis:['moor','kapelle','stadt','eis','pforte'],pforte:['hafen','kapelle','salz','eis','pforte']};
 const akt={hafen:0,moor:0,kapelle:1,salz:2,stadt:2,eis:3,pforte:4};
 await p.goto('http://localhost:8000/index.html?dev=0');await p.waitForTimeout(800);
 for(const bi of Object.keys(wege)){for(const art of (bi==='pforte'?['finale']:['kampf_schwer','waechter'])){
  await p.evaluate(([r,a,art,seed])=>{newRun('fischer',seed,{dev:true,route:r});S.akt=a;S.ebene=art==='kampf_schwer'?2:3;S.depth=a*4+S.ebene+1;BU.key='';Dev.springe(art);
   if(art==='finale'){S.enemies[0].hp=Math.round(S.enemies[0].max*.5);checkPhase(S.enemies[0]);}render();},[wege[bi],akt[bi],art,seed]);
  await p.waitForTimeout(1600);await p.screenshot({path:`${out}/${bi}-${art==='kampf_schwer'?'kampf':art}.png`});}}
 console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
