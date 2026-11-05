// Kontaktbogen eines Bioms automatisch aus den Spieldaten (auch Pakete und Ergänzungen):
// alle Gegner, die Vorraum-Elite (biom.vorraum_elite, Akt V) und Varianten (Idle-Bild 0 und Angriffsbild 2) neben den Favoriten Chorknabe, Hirte, Netzflickerin
// auf dem Nebel des Bioms, darunter der Silhouetten-Bogen (alle Sprites schwarz gefüllt).
// Braucht den lokalen Server (cd prototype && python3 -m http.server 8000).
// node tools/biom-bogen.js <biom> [ordner=docs/auftrag-2/bilder/bogen] [--alle]   (--alle: jedes Biom einzeln)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const a=process.argv.slice(2);const pos=a.filter(x=>!x.startsWith('--'));const out=pos[1]||path.join(__dirname,'../docs/auftrag-2/bilder/bogen');fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900}});const fehler=[];p.on('pageerror',e=>fehler.push(String(e)));
 await p.goto('http://localhost:8000/index.html?dev=0');await p.waitForFunction(()=>typeof BIOMES!=='undefined'&&Object.keys(BIOMES).length>3);
 const biome=a.includes('--alle')?await p.evaluate(()=>Object.keys(BIOMES).filter(k=>!k.startsWith('_'))):[pos[0]];
 for(const biom of biome){
  const html=await p.evaluate(async biom=>{const B=BIOMES[biom];if(!B)return null;
   const ids=[...new Set([...(B.gegner||[]),B.vorraum_elite,B.waechter,...(B.waechter_alt||[])])].filter(id=>id&&FOES[id]);
   const sprites=[];for(const id of ids){const F=FOES[id];[...new Set([...(F.varianten||[F.sprite]),...((F.besonders&&F.besonders.sprites)||[])])].filter(Boolean).forEach(s=>sprites.push({id,s,n:F.n,rang:(F.rang||'normal')+(id===B.vorraum_elite?' · Vorraum-Elite':''),fav:false}));}
   const fav=['chorknabe_a','hirte_a','netzflickerin_a'].map(s=>({s,n:s.replace('_a','')+' (Favorit)',fav:true}));
   const lade=s=>new Promise(res=>{fetch('assets/gegner/'+s+'.json').then(r=>r.ok?r.json():null).then(m=>{if(!m)return res(null);const img=new Image();img.onload=()=>res({m,img});img.onerror=()=>res(null);img.src='assets/gegner/'+s+'.png';}).catch(()=>res(null));});
   const neb=(B.nebel||['#101418','#202830']);const K=2;
   const zeichne=(x,silh,frame,zeile)=>{const {m,img}=x;const c=document.createElement('canvas');c.width=m.w*K;c.height=m.h*K;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    const gr=g.createRadialGradient(c.width/2,c.height*.55,10,c.width/2,c.height*.55,c.width*.7);gr.addColorStop(0,neb[1]);gr.addColorStop(1,neb[0]);g.fillStyle=silh?'#d8d0c0':gr;g.fillRect(0,0,c.width,c.height);
    const z=document.createElement('canvas');z.width=m.w;z.height=m.h;const zg=z.getContext('2d');const an=m.anim[zeile]||m.anim.idle;zg.drawImage(img,Math.min(frame,an.n-1)*m.w,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
    if(silh){zg.globalCompositeOperation='source-in';zg.fillStyle='#000';zg.fillRect(0,0,m.w,m.h);}g.drawImage(z,0,0,m.w*K,m.h*K);return c.toDataURL();};
   const kachel=async(e,silh)=>{const x=await lade(e.s);if(!x)return `<div class="k fehlt">${e.s}: Sprite fehlt</div>`;
    return `<div class="k ${e.fav?'fav':''}"><div class="t">${e.fav?'★ ':''}${e.s} <small>${x.m.w}×${x.m.h}${e.rang&&e.rang!=='normal'?' · '+e.rang:''}</small></div><div class="r"><img src="${zeichne(x,silh,0,'idle')}">${silh?'':`<img src="${zeichne(x,false,2,'angriff')}">`}</div></div>`;};
   let h=`<h1>${B.n} <small>(${biom}, Akt ${['I','II','III','IV','V'][B.akt]||'?'}) · ${ids.length} Typen, ${sprites.length} Sprites · Idle 0 und Angriff 2, ×${K}</small></h1><div class="g">`;
   for(const e of [...fav,...sprites])h+=await kachel(e,false);h+=`</div><h2>Silhouetten</h2><div class="g">`;for(const e of [...fav,...sprites])h+=await kachel(e,true);h+='</div>';return h;},biom);
  if(!html){console.log('Biom unbekannt: '+biom);continue;}
  const q=await b.newPage({viewport:{width:1600,height:900}});
  await q.setContent(`<html><body style="margin:0;background:#0b0c0e;color:#e8dcc0;font:14px monospace;padding:14px"><style>h1{font-size:20px}h1 small,h2{font-size:13px;color:#9a8f78}.g{display:flex;flex-wrap:wrap;gap:10px}.k{background:#15161a;border:1px solid #2a2a30;padding:6px}.k.fav{border-color:#8a7440}.t{font-size:12px;margin-bottom:4px}.t small{color:#8a8070}.r{display:flex;gap:4px}.r img{display:block;image-rendering:pixelated}.fehlt{color:#ff7a6a}</style>${html}</body></html>`);
  const f=path.join(out,biom+'-bogen.png');await q.screenshot({path:f,fullPage:true});await q.close();console.log('geschrieben: '+path.relative(process.cwd(),f));}
 console.log(fehler.length?fehler.join('\n'):'Keine Seitenfehler.');await b.close();})();
