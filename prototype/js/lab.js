// Sprite-Labor: Oberfläche für js/procgen/*. Läuft ohne Server (keine JSON-Daten nötig).
const $=id=>document.getElementById(id);
const anims=[];// f(t), wird jedes Bild aufgerufen
const store={get(k,d){try{return JSON.parse(localStorage.getItem('saltmoor.lab.'+k))??d;}catch(e){return d;}},set(k,v){try{localStorage.setItem('saltmoor.lab.'+k,JSON.stringify(v));}catch(e){}}};
const opt=(o,zufall=true)=>(zufall?'<option value="">Zufall</option>':'')+Object.entries(o).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
const download=(c,name)=>{const a=document.createElement('a');a.download=name;a.href=c.toDataURL('image/png');a.click();};

// ---------------- 1 Gegner ----------------
const S={grid:[],sel:null,favs:store.get('favs',[]),next:Math.floor(Math.random()*9000)+1};
$('genCtl').innerHTML=`
 <label>Körperbau<select id="lPlan">${opt(GEN_OPTS.plan)}</select></label>
 <label>Kopf<select id="lHead">${opt(GEN_OPTS.head)}</select></label>
 <label>Palette<select id="lPal">${opt(Object.fromEntries(Object.entries(CPAL).map(([k,v])=>[k,v.n])))}</select></label>
 <label>Extra<select id="lExtra">${opt(GEN_OPTS.extra)}</select></label>
 <label>Augen: <b id="vEyes">Zufall</b><input type="range" id="lEyes" min="0" max="9" value="0"></label>
 <label>Tentakel: <b id="vTent">Zufall</b><input type="range" id="lTent" min="-1" max="8" value="-1"></label>
 <label>Mutation: <b id="vMut">Zufall</b><input type="range" id="lMut" min="-1" max="10" value="-1"></label>
 <label>Seed<input type="number" id="lSeed" min="1" max="999999"></label>`;
const lock=()=>{const e=+$('lEyes').value,t=+$('lTent').value,m=+$('lMut').value;return{plan:$('lPlan').value,head:$('lHead').value,pal:$('lPal').value,extra:$('lExtra').value,eyes:e||'',tent:t<0?'':t,mut:m<0?'':m/10};};
[['lEyes','vEyes',v=>+v||'Zufall'],['lTent','vTent',v=>+v<0?'Zufall':v],['lMut','vMut',v=>+v<0?'Zufall':v*10+'%']].forEach(([i,o,f])=>{const u=()=>$(o).textContent=f($(i).value);$(i).addEventListener('input',u);$(i).addEventListener('change',()=>roll());u();});
['lPlan','lHead','lPal','lExtra'].forEach(i=>$(i).addEventListener('change',()=>roll()));
$('lSeed').addEventListener('change',()=>{const s=+$('lSeed').value;if(s>0){S.next=s;roll();}});

function thumb(g,onClick,small){const d=document.createElement('div');d.className='thumb';const[c,x]=cnv(64,80);c.className='px';d.appendChild(c);
 if(!small)d.insertAdjacentHTML('beforeend',`<span>${g.seed}</span>`);d.title=describeGenome(g);d.onclick=()=>onClick(g,d);d._g=g;
 anims.push({lazy:true,f:t=>renderCreature(c,x,t,g)});return d;}
function select(g){S.sel=g;$('bigD').textContent=describeGenome(g)+` · Seed ${g.seed}`;document.querySelectorAll('#grid .thumb').forEach(d=>d.classList.toggle('sel',d._g===g));refreshVariantBase();refreshWorldFoes();}
function showGrid(list){S.grid=list;anims.splice(0,anims.length,...anims.filter(a=>!a.grid));const gr=$('grid');gr.innerHTML='';
 list.forEach(g=>{const d=thumb(g,select);anims[anims.length-1].grid=true;gr.appendChild(d);});select(list[0]);}
function roll(){const L=lock();const list=[];for(let i=0;i<12;i++)list.push(genCreature(S.next+i,L));$('lSeed').value=S.next;S.next+=12;showGrid(list);}
$('bRoll').onclick=roll;
$('bKids').onclick=()=>{if(!S.sel)return;const m=+$('lMut').value;const amt=m<0?.35:Math.max(.1,m/10);const p=S.sel;showGrid([p,...[...Array(11)].map((_,i)=>mutateGenome(p,amt,i+1+Math.floor(Math.random()*1e4)))]);};
$('bCross').onclick=()=>{const b=S.favs[S.favs.length-1];if(!S.sel||!b){alert('Erst einen Gegner mit ★ merken, dann einen anderen auswählen und kreuzen.');return;}const a=S.sel;showGrid([a,b,...[...Array(10)].map((_,i)=>crossGenome(a,b,i+Math.floor(Math.random()*1e4)))]);};
function showFavs(){const fv=$('favs');anims.splice(0,anims.length,...anims.filter(a=>!a.fav));fv.innerHTML='';if(!S.favs.length){fv.innerHTML='<span class="empty">noch keine</span>';return;}
 S.favs.forEach((g,i)=>{const d=thumb(g,g2=>select(g2),true);anims[anims.length-1].fav=true;d.title+=' · Rechtsklick: entfernen';d.oncontextmenu=e=>{e.preventDefault();S.favs.splice(i,1);store.set('favs',S.favs);showFavs();refreshWorldFoes();};fv.appendChild(d);});}
$('bFav').onclick=()=>{if(S.sel&&!S.favs.some(f=>JSON.stringify(f)===JSON.stringify(S.sel))){S.favs.push(S.sel);if(S.favs.length>16)S.favs.shift();store.set('favs',S.favs);showFavs();refreshWorldFoes();}};
$('bSheet').onclick=()=>S.sel&&download(creatureSheet(S.sel,8),`gegner_${S.sel.seed}_8bilder.png`);
$('bCode').onclick=async()=>{if(!S.sel)return;const code=genomeCode(S.sel);try{await navigator.clipboard.writeText(code);$('bCode').textContent='Kopiert ✓';}catch(e){prompt('Code:',code);}setTimeout(()=>$('bCode').textContent='Code kopieren',1500);};
$('codeIn').addEventListener('change',()=>{try{const g=genomeFrom($('codeIn').value);showGrid([g,...[...Array(11)].map((_,i)=>mutateGenome(g,.3,i+1))]);}catch(e){alert('Der Code passt nicht.');}});
const[BC,BX]=[$('bigC'),$('bigC').getContext('2d',{willReadFrequently:true})];BX.imageSmoothingEnabled=false;
const bigV={hit:0};BC.style.cursor='pointer';BC.title='Klicken: Treffer-Blitz';BC.onclick=()=>bigV.hit=.12;
anims.push({f:t=>{if(S.sel){bigV.hit=Math.max(0,bigV.hit-.016);renderCreature(BC,BX,t,S.sel,bigV);}}});

// ---------------- 2 Varianten ----------------
const BASES={cultist:'Kultist (von Hand)',fishman:'Fischmensch (von Hand)',drowned:'Ertrunkener (von Hand)',shade:'Schatten (von Hand)',gen:'Ausgewählter Generator-Gegner',upload:'Eigenes Bild'};
$('varCtl').innerHTML=`<label>Basis<select id="vBase">${opt(BASES,false)}</select></label><label>Stärke: <b id="vStrV">50%</b><input type="range" id="vStr" min="0" max="10" value="5"></label>`;
const V={img:null,seed:1};
function baseFn(){const k=$('vBase').value;
 if(k==='gen'&&S.sel){const g=S.sel;return{fn:(x,t)=>drawCreature(x,t,g),o:CPAL[g.pal].o};}
 if(k==='upload'&&V.img){const b=wobbleBase(V.img);return{fn:b,o:'#050505'};}
 const id=FOE_DRAW[k]?k:'cultist';return{fn:(x,t)=>FOE_DRAW[id](x,t,{lx:0,ly:0}),o:OUTLINE[id]||'#000'};}
function buildVariants(){anims.splice(0,anims.length,...anims.filter(a=>!a.v));const row=$('vrow');row.innerHTML='';
 const B=baseFn();const[fc,fx]=cnv(64,80);B.fn(fx,0);const info=analyzeSprite(fc);const k=+$('vStr').value/10;
 const kinds=Object.keys(VAR_KINDS);const r=rng(V.seed);const chosen=[kinds[Math.floor(r()*4)]];while(chosen.length<3){const c=kinds[Math.floor(r()*4)];if(!chosen.includes(c))chosen.push(c);}
 const list=[{n:'Basis',v:{kind:'base',eyes:[],spikes:[],strands:[],scale:1,sat:1,hue:0,rot:0}},...chosen.map((kd,i)=>{const v=genVariant(V.seed*10+i,kd,k,info);return{n:VAR_KINDS[kd],v};})];
 list.forEach(({n,v})=>{const p=document.createElement('div');p.className='panel';const[c,x]=cnv(64,80);c.className='px stage';p.appendChild(c);
  p.insertAdjacentHTML('beforeend',`<div class="n">${n}</div><div class="desc">${v.kind==='base'?BASES[$('vBase').value]||'':describeVariant(v)}</div>`);row.appendChild(p);
  anims.push({v:true,lazy:true,f:t=>renderVariant(c,x,t,B.fn,v,B.o)});});}
function refreshVariantBase(){if($('vBase').value==='gen')buildVariants();}
$('vBase').onchange=()=>{if($('vBase').value==='upload'&&!V.img){$('file').click();return;}buildVariants();};
$('vStr').oninput=()=>{$('vStrV').textContent=$('vStr').value*10+'%';};$('vStr').onchange=buildVariants;
$('bVar').onclick=()=>{V.seed=Math.floor(Math.random()*1e5);buildVariants();};
function loadFile(file){if(!file)return;const img=new Image();img.onload=()=>{V.img=spriteFromImage(img);$('vBase').value='upload';V.seed++;buildVariants();};img.src=URL.createObjectURL(file);}
$('file').onchange=e=>loadFile(e.target.files[0]);
const drop=$('drop');['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('on');}));['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('on');}));
drop.addEventListener('drop',e=>loadFile(e.dataTransfer.files[0]));drop.onclick=()=>$('file').click();drop.style.cursor='pointer';

// ---------------- 3 Welten ----------------
const WN={mood:'Stimmung',sky:'Himmel',far:'Ferne',ground:'Boden',weather:'Wetter',prop:'Requisiten'};
$('wCtl').innerHTML=Object.entries(WN).map(([k,n])=>`<label>${n}<select id="w_${k}">${opt(WORLD_OPTS[k])}</select></label>`).join('')+
 `<label>Gegner in der Szene<select id="wFoes"><option value="0">keine</option><option value="1">1</option><option value="2">2</option><option value="3" selected>3</option></select></label><label>Seed<input type="number" id="wSeed" min="1"></label>`;
$('wCount').textContent=`Das sind ${worldCount().toLocaleString('de-DE')} Kombinationen, und jede sieht mit jedem Seed wieder etwas anders aus.`;
const WS={cfg:null,foes:[]};
const wlock=()=>Object.fromEntries(Object.keys(WN).map(k=>[k,$('w_'+k).value]));
function setWorld(c){WS.cfg=c;$('wSeed').value=c.seed;Object.keys(WN).forEach(k=>{if($('w_'+k).value)$('w_'+k).value=c[k];});$('worldC').title=Object.keys(WN).map(k=>WORLD_OPTS[k][c[k]]).join(' · ');}
function newWorld(){setWorld(genWorld(Math.floor(Math.random()*1e5)+1,wlock()));}
Object.keys(WN).forEach(k=>$('w_'+k).onchange=()=>setWorld(genWorld(WS.cfg.seed,wlock())));
$('wSeed').onchange=()=>setWorld(genWorld(+$('wSeed').value||1,wlock()));
$('bWorld').onclick=newWorld;
$('bWorlds').onclick=()=>{const box=$('wthumbs');box.innerHTML='';for(let i=0;i<4;i++){const c=genWorld(Math.floor(Math.random()*1e5)+1,wlock());const[cv,x]=cnv(W,H);cv.className='px';drawWorld(x,1.3,c,[]);cv.title=Object.keys(WN).map(k=>WORLD_OPTS[k][c[k]]).join(' · ')+' · klicken zum Übernehmen';cv.onclick=()=>setWorld(c);box.appendChild(cv);}};
function refreshWorldFoes(){const n=+$('wFoes').value;const src=[S.sel,...S.favs.slice().reverse(),...S.grid].filter(Boolean);const seen=new Set();WS.foes=[];
 for(const g of src){const key=JSON.stringify(g);if(seen.has(key))continue;seen.add(key);WS.foes.push({g,cx:cnv(64,80)});if(WS.foes.length>=n)break;}}
$('wFoes').onchange=refreshWorldFoes;
const WX=$('worldC').getContext('2d');WX.imageSmoothingEnabled=false;
anims.push({lazy:true,el:$('worldC'),f:t=>{if(!WS.cfg)return;const cs=WS.foes.map(fo=>{renderCreature(fo.cx[0],fo.cx[1],t,fo.g);return fo.cx[0];});drawWorld(WX,t,WS.cfg,cs);}});

// ---------------- Schleife ----------------
// Nur sichtbare Canvases neu malen, Vorschaubilder mit halber Bildrate.
const visible=el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};
let frame=0;const t0=performance.now();
function loop(now){const t=(now-t0)/1000;frame++;anims.forEach(a=>{if(a.lazy&&frame%2)return;if(a.el&&!visible(a.el))return;a.f(t);});requestAnimationFrame(loop);}
roll();showFavs();buildVariants();newWorld();refreshWorldFoes();requestAnimationFrame(loop);
