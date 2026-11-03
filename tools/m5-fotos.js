// M5-Bildschirmfotos: Strand, Figurwahl, Weg-Wahl, Kampf, Ereignis, Krämer, Wandbild, Ankunft, Ende, Tagebuch
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2];require('fs').mkdirSync(out,{recursive:true});const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const f=[];
 p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))f.push(m.text());});
 const go=async(q,n,js)=>{await p.goto('http://localhost:8000/index.html?dev=0&'+q);await p.waitForTimeout(700);if(js)await p.evaluate(js);await p.waitForTimeout(600);await p.screenshot({path:out+'/'+n+'.png'});};
 await go('seed=3','00-leer',()=>{localStorage.clear();Meta.reset();});
 await go('seed=3','02-figurwahl',()=>{Meta.lies('hafen_1');Meta.lies('moor_1');S={phase:'figur'};render();});
 await go('job=friedhofswaerter&seed=8','03-weg-wahl',()=>{leaveUebergang();});
 await go('job=friedhofswaerter&seed=8&springe=kampf&akt=0','04-kampf');
 await go('job=friedhofswaerter&seed=8&springe=ereignis&akt=0','05-ereignis');
 await go('job=friedhofswaerter&seed=8&springe=kraemer&akt=2','06-kraemer');
 await go('job=friedhofswaerter&seed=8&springe=wandbild&akt=3','07-wandbild');
 await go('job=friedhofswaerter&seed=8','08-ankunft',()=>{S.phase='ankunft';S.depth=18;S.akt=4;render();});
 await go('job=friedhofswaerter&seed=8','09-ende',()=>{S.phase='ankunft';S.depth=18;S.akt=4;S.dev=true;chooseEnde('umkehren');});
 await go('job=fischer&seed=8','01-strand',()=>{S.dev=false;S.depth=7;S.akt=1;S.stats.fragmente=['kapelle_1'];runLost();});
 await go('seed=3','10-tagebuch',()=>{S={phase:'titel'};render();zeigeOverlay(tagebuchHtml());});
 console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
