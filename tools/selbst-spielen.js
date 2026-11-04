// M11: ein Run, gespielt über echte Klicks im Browser (Entscheidungen wie der Autospieler), mit Bildschirmfotos jeder Station.
// node tools/selbst-spielen.js <ordner> [figur] [seed]
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'.',job=process.argv[3]||'fischer',seed=process.argv[4]||'1';require('fs').mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const fehler=[];const gesehen={};let nr=0;
 p.on('console',m=>{if(m.type()==='error')fehler.push(m.text());});p.on('pageerror',e=>fehler.push(String(e)));
 const foto=async(name,immer)=>{if(!immer&&gesehen[name])return;gesehen[name]=1;await p.waitForTimeout(500);await p.screenshot({path:`${out}/${String(++nr).padStart(2,'0')}-${name}.png`});};
 const klick=async sel=>{const el=await p.$(sel);if(!el)throw new Error('nicht gefunden: '+sel);await el.click();await p.waitForTimeout(250);};
 await p.goto('http://localhost:8000/index.html?dev=0');await p.evaluate(()=>{localStorage.clear();});
 await p.goto('http://localhost:8000/index.html?dev=0&seed='+seed);await p.waitForTimeout(800);await foto('titel');
 await klick('[data-act=neu]');await foto('figurwahl');await klick(`[data-job=${job}]`);
 const log=[];let schritte=0;
 while(schritte++<900){const z=await p.evaluate(()=>({ph:S.phase,akt:S.akt,b:S.route&&S.route[S.akt],busy,ebene:S.ebene,hp:S.hp,d:S.depth,art:S.kampfArt}));
  if(z.busy){await p.waitForTimeout(200);continue;}
  if(z.ph==='uebergang'){await foto('uebergang-akt'+(z.akt+1),true);await klick('[data-act=weiter]');continue;}
  if(z.ph==='weg'){await foto('weg-'+z.b);const i=await p.evaluate(()=>Bot.wegIndex());log.push(`Tiefe ${z.d+1}: ${await p.evaluate(i=>S.weg[i].art,i)}`);await klick(`[data-weg="${i}"]`);continue;}
  if(z.ph==='fight'){await foto(`kampf-${z.b}${z.art==='waechter'?'-waechter':z.art==='finale'?'-finale':''}`);
   const w=await p.evaluate(()=>Bot.besteKarte());
   if(w){if(w.t!=null)await klick(`.feind[data-ei="${w.t}"]`);await klick(`[data-card="${w.i}"]`);await p.waitForTimeout(300);}
   else{await klick('[data-act=end]');await p.waitForTimeout(400);}continue;}
  if(z.ph==='reward'){await foto('belohnung');const ok=await p.evaluate(()=>S.bag.includes(null)&&!S.picked);if(ok)await klick('[data-take]');await p.evaluate(()=>Bot.ausruesten());await klick('[data-act=weiterReward]');continue;}
  if(z.ph==='event'){await foto('ereignis-'+z.b);const k=await p.evaluate(()=>Bot.eventIndex());await klick(`[data-ev="${k}"]`);continue;}
  if(z.ph==='streichen'){await foto('streichen');await klick('[data-act=skipstrike]');continue;}
  if(z.ph==='kraemer'){await foto('kraemer-'+z.b);const h=await p.evaluate(()=>S.hp<maxHp()*.75&&!S.shop.heal&&S.gold>=BAL.shop.heal.price);if(h)await klick('[data-buy=heal]');await klick('[data-act=leave]');continue;}
  if(z.ph==='kraemer_streichen'){await klick('[data-act=kstrike0]');continue;}
  if(z.ph==='werkstatt'){await foto('werkstatt');await klick('[data-act=leave]');continue;}
  if(z.ph==='rast'){await foto('rast');await klick('[data-act=rastHeil]');await klick('[data-act=leave]');continue;}
  if(z.ph==='wandbild'){await foto('wandbild-'+z.b);await klick('[data-act=leave]');continue;}
  if(z.ph==='fund'){await foto('fundstelle');await klick('[data-act=fund]');await klick('[data-act=leave]');continue;}
  if(z.ph==='ankunft'){await foto('ankunft');await klick('[data-ende=bleiben]');await foto('ende');break;}
  if(z.ph==='strand'){await foto('strand');break;}
  if(z.ph==='event_folge'||z.ph==='knoten'){await p.waitForTimeout(200);continue;}
  throw new Error('unbekannte Phase '+z.ph);}
 const end=await p.evaluate(()=>({ph:S.phase,d:S.depth,hp:S.hp,route:S.route.join(' → ')}));
 console.log(log.join('\n'));console.log(`Ende: ${end.ph} auf Tiefe ${end.d}, Weg ${end.route}`);
 console.log(fehler.length?'KONSOLENFEHLER:\n'+[...new Set(fehler)].join('\n'):'Keine Konsolenfehler.');await b.close();})();
