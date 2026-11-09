// Galerie: Schaufenster der Bausteine. Nutzt nur, was das Spiel selbst benutzt:
// cardHtml, barHtml, absicht, gegnerHtml, kopfHtml, leisteKampf, stoffBaumHtml (stoffbaum.js), gearHtml, itemPick, wegHtml, eventHtml, wandbildHtml (oberflaeche.js),
// gi/glyph (zeichen.js), ladeSprite/frame/dglowA/ersatzSzene (buehne.js), World.build (scenes/world), alte Zeichner aus foes.js und zones.js.
// Die Beispiele laufen über einen kleinen Beispielzustand S, der hier gebaut wird. Die Seite schreibt nichts in den Speicher.
(()=>{
'use strict';
BU.k=2; // 1 Szenenpixel = 2 Bildschirmpixel, passt zu --u:2px in css/galerie.css
const anims=[];// {c, f(t) → true wenn gezeichnet, fertig}
let BIOM_IDS=[];
const ANIMS=['idle','angriff','treffer','tod'];
const ANIM_N={idle:'Idle',angriff:'Angriff',treffer:'Treffer',tod:'Tod'};

// ---------- Beispielzustand ----------
function probeS(extra){const it=id=>mk(id);
 return Object.assign({phase:'fight',seed:11,route:['hafen','kapelle','salz','eis','pforte'],akt:0,ebene:1,depth:3,turnNo:3,gold:47,disc:new Set(),jobN:'Fischer',job:'fischer',
  hp:31,bonusHp:0,block:6,ward:0,energy:3,last:[],played:1,compassUsed:true,hochUsed:new Set(),stufe:0,
  areas:{waffe:[it('harpoon'),it('knife'),null,null],kleidung:[it('oilcoat'),it('cap'),null,null],talisman:[it('salt'),null,null,null]},slots:{waffe:2,kleidung:2,talisman:1},
  bag:[it('torch'),it('dynamite'),null,null,null],bench:[null,null],enemies:[],hand:[],draw:[1,2,3,4,5,6,7],discard:[1,2,3],exhaust:[],sel:null,rs:{},stats:{kaempfe:2,fragmente:[]},log:[],metaItems:[],target:0},extra||{});}
const karte=(id,i=0,extra)=>{const d=ITEMS[id];return{...d.cards[i],st:[...d.st],src:d.n,spr:d.spr,...(extra||{})};};
const spec=(lbl,html,stil='')=>`<div class="spec" style="${stil}"><span class="lbl">${lbl}</span>${html}</div>`;
const itemMit=pred=>Object.keys(ITEMS).find(k=>{const d=ITEMS[k];return !d.bases&&d.cards.length&&pred(d);});

// ---------- (1) Oberfläche ----------
function bauDemo(){
 S=probeS({last:['F'],disc:new Set()});
 const ids=['netzflickerin','tiefling','schmuggler'].filter(id=>FOES[id]);S.enemies=ids.map(id=>mkEnemy(id));aufstellen(S.enemies);
 const [a,b,c]=S.enemies;if(a){a.burn=3;}if(b){b.poison=4;b.weak2=1;}if(c){c.str=2;c.block=5;}
 const hand=['torch','knife','harpoon','oilcoat','salt'].filter(id=>ITEMS[id]&&ITEMS[id].cards.length).map(id=>karte(id));S.hand=hand;
 const rFeuer=REACT.find(r=>hand.some(h=>reactionsFor(['F'],h.st).includes(r)));if(rFeuer)S.disc.add(rFeuer.n);
 vorschau={foes:S.enemies.map((e,i)=>i===0?{d:6,ab:0}:null)};
 $('demo').innerHTML=`<div id="szene"><canvas id="buehne" width="480" height="270" style="position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated"></canvas><div id="hud"><div id="gegner"></div><div id="kopf"></div><div id="panel"></div></div></div><div class="leistebox"><div id="leiste" class="kampf"></div></div>`;
 const hud=()=>{const keep=S;S=demoS;try{$('gegner').innerHTML=gegnerHtml(true);$('kopf').innerHTML=kopfHtml();$('leiste').innerHTML=leisteKampf();}finally{S=keep;}};
 const demoS=S;
 BU.cv=$('buehne');BU.g=BU.cv.getContext('2d');BU.g.imageSmoothingEnabled=false;
 BU.cv.addEventListener('pointermove',e=>{const r=BU.cv.getBoundingClientRect();BU.maus={x:(e.clientX-r.left)/r.width*SW,y:(e.clientY-r.top)/r.height*SH};});
 hud();[400,1200,2500].forEach(ms=>setTimeout(hud,ms));// Positionen stimmen, sobald die Sheets geladen sind
 // Die Bühne des Spiels zeichnet mit dem globalen S: kurz auf den Demo-Zustand umschalten
 const loop=now=>{const keep=S;S=demoS;try{frameEinmal(now);}catch(e){console.warn('Bühne',e);}finally{S=keep;}requestAnimationFrame(loop);};
 requestAnimationFrame(loop);}
// frame() aus buehne.js ruft sich selbst wieder auf; hier wird requestAnimationFrame kurz abgefangen, damit genau ein Bild entsteht
function frameEinmal(now){const raf=window.requestAnimationFrame;window.requestAnimationFrame=()=>0;try{frame(now);}finally{window.requestAnimationFrame=raf;}}

function bauKarten(){const out=[];
 const zeig=(lbl,st,c,i=0)=>{S=probeS(st);out.push(spec(lbl,cardHtml(c,i,5)));};
 // Paar-Reaktion suchen, die eine normale Ein-Stoff-Karte auslöst
 let paar=null,pk=null;for(const r of REACT){const[a,b]=[...r.k];const id=itemMit(d=>!d.rare&&d.st.length===1&&d.st[0]===b)||null;if(id){paar=r;pk={id,vor:a};break;}}
 const duo=itemMit(d=>d.st.length===2&&REACT.some(r=>r.k===pairKey(d.st[0],d.st[1])));const rDuo=duo?REACT.find(r=>r.k===pairKey(ITEMS[duo].st[0],ITEMS[duo].st[1])):null;
 const normal=itemMit(d=>d.st.length===1&&!d.rare&&d.cards[0].c>0)||'knife';
 zeig('normal',{},karte(normal),0);
 if(paar){zeig(`reagiert, entdeckt (davor ${ST[pk.vor].n})`,{last:[pk.vor],disc:new Set([paar.n])},karte(pk.id),1);
  zeig('reagiert, unentdeckt',{last:[pk.vor],disc:new Set()},karte(pk.id),2);}
 if(duo){zeig('Doppel-Stoff, „In sich“',{disc:new Set([rDuo.n])},karte(duo),3);zeig('Doppel-Stoff, In sich unentdeckt',{},karte(duo),4);}
 const h=HOCH[0];if(h){const ks=[...h.s];const id=itemMit(d=>d.st.length===1&&d.st[0]===ks[2]);if(id)zeig('Hochreaktion möglich',{last:[ks[0],ks[1]],disc:new Set(allRx().map(r=>r.n))},karte(id),0);}
 zeig('zu teuer (0 Energie)',{energy:0},karte(normal),1);
 zeig('Pforte: kostet +1',{},karte(normal,0,{mod:1}),2);
 zeig('Pforte: kostet −1',{},karte(normal,0,{mod:-1}),3);
 const er=itemMit(d=>d.cards.some(c=>c.eroeffnung));if(er)zeig('Eröffnung',{},karte(er),4);
 const vb=itemMit(d=>d.cards.some(c=>c.verbraucht));if(vb)zeig('verbraucht',{},karte(vb),0);
 $('karten').innerHTML=out.join('');}

function bauBalken(){const w=b=>`<div style="width:calc(var(--u)*64)">${b}</div>`;
 $('balken').innerHTML=[spec('nur Leben',w(barHtml(14,22,0))),spec('mit Block (Schraffur blau)',w(barHtml(14,22,6))),spec('Vorschau: −6 Leben',w(barHtml(14,22,0,{d:6,ab:0}))),
  spec('Vorschau: Block fängt 4 ab, −3 Leben',w(barHtml(14,22,4,{d:3,ab:4}))),spec('fast leer',w(barHtml(2,22,0))),spec('Spieler (groß)',barHtml(31,50,6,null,'gross'))].join('');}

function bauAbsichten(){const ab=(pat,mod={})=>`<div class="abs-reihe"><div class="feind"><div class="abs">${absicht({pat,pi:0,str:0,weak2:0,...mod}).html}</div></div></div>`;
 $('absichten').innerHTML=[spec('Angriff',ab([{t:'atk',v:7}])),spec('Mehrfach',ab([{t:'atk',v:4,h:3}])),spec('mit Stärke +2',ab([{t:'atk',v:7}],{str:2})),
  spec('geschwächt',ab([{t:'atk',v:9}],{weak2:1})),spec('geschwächt, mehrfach',ab([{t:'atk',v:5,h:2}],{weak2:1})),spec('Block',ab([{t:'blk',v:8}])),spec('Stärke',ab([{t:'buff',v:2}]))].join('');}

// M2: Zustände in der Gegner-Plakette (plaketteHtml in kampf.js)
function bauZustaende(){const fe=(mod,pv)=>{const e={n:'Schmuggler',hp:18,max:22,block:0,str:0,burn:0,poison:0,weak2:0,vuln:0,panzer:0,pat:[{t:'atk',v:7}],pi:0,...mod};
  return `<div class="feind" style="position:relative;transform:none;left:auto;top:auto;width:calc(var(--u)*64);height:calc(var(--u)*56)"><div style="position:absolute;bottom:0;left:0;right:0">${plaketteHtml(e,0,false,pv,false)}</div></div>`;};
 $('zustaende').innerHTML=[['burn',3,'Brand',{burn:3}],['poison',4,'Gift',{poison:4}],['weak',1,'Geschwächt',{weak2:1}],['buff',2,'Stärke',{str:2}]].map(([k,v,n,m])=>spec(n,fe(m))).join('')
  +spec('Block am Gegner',fe({block:5,burn:3,weak2:1}))
  +spec('Vorschau-Zahl',fe({hp:14},{d:6,ab:0}));}

function bauKnoepfe(){const rauten=(n,max)=>`<div class="rauten">${[...Array(max)].map((_,i)=>`<i class="${i<n?'voll':''}"></i>`).join('')}</div>`;
 $('knoepfe').innerHTML=[spec('Energie 3/3',rauten(3,3)),spec('Energie 1/3',rauten(1,3)),spec('Energie 4 (Bonus)',rauten(4,4)),
  spec('Knopf',`<button class="deco">ZUG<br>BEENDEN</button>`),spec('Knopf klein',`<button class="deco klein">TAGEBUCH</button>`),spec('Knopf mit Zusatz',`<button class="deco">SCHLAFEN<br><small>+20 Leben</small></button>`),spec('gesperrt',`<button class="deco" disabled>VERSCHMELZEN</button>`)].join('');
 const rad=(lbl,st)=>{S=probeS(st);return spec(lbl,`<div id="baum" class="radw" style="width:calc(var(--u)*118);height:calc(var(--u)*44)">${stoffBaumHtml()}</div>`);};
 const alle=new Set(allRx().map(r=>r.n));
 $('raeder').innerHTML=[rad('Stoff-Baum: Zugbeginn',{}),rad('nach Feuer, Hand passt',{last:['F'],chainLog:[{turn:3,st:['F'],prev:[],rx:[]}],hand:[karte('harpoon'),karte('salt')]}),rad('nach Feuer, Sackgasse (Hand zu teuer)',{last:['F'],chainLog:[{turn:3,st:['F'],prev:[],rx:[]}],energy:0,hand:[karte('harpoon')]}),rad('nach Salz + Blut',{last:['S','B'],chainLog:[{turn:3,st:['S'],prev:[],rx:[]},{turn:3,st:['S','B'],prev:['S'],rx:[]}],hand:[karte('torch')]})].join('');}

function bauGear(){S=probeS({phase:'rast'});S.slots.talisman=1;S.bag[2]=mk(itemMit(d=>d.rare)||'knife');
 // Auftrag 3 M4: Rucksack „Am Körper“ (js/ui/rucksack.js) statt der alten Itemleiste, dazu die Silhouetten aller Figuren
 KOE={lesen:false,alt:koeZaehlung(deckListe()),zeig:S.areas.waffe[0]&&S.areas.waffe[0].uid};
 const swap=S.bag.findIndex(it=>it&&def(it).a==='waffe');if(swap>=0){const a=S.areas.waffe[0];S.areas.waffe[0]=S.bag[swap];S.bag[swap]=a;}
 $('gear').innerHTML=`<div class="koeprobe"><div id="koerper" class="an">${koerperHtml()}</div></div><p class="einl" style="margin-top:8px">Rucksack an der Rast, nach einem Tausch (Deck grün/rot), Talismane mit einem offenen Platz, Rest mit Schloss.</p>
 <div class="silh">${JOBS.map(j=>`<figure><img src="assets/figuren/${j.id}.png" alt=""><figcaption>${esc(j.n)}</figcaption></figure>`).join('')}</div>`;
 KOE=null;}
function bauPicks(){S=probeS({phase:'kraemer'});
 const ids=[itemMit(d=>d.cards.some(c=>c.eroeffnung)),itemMit(d=>d.rare),Object.keys(ITEMS).find(k=>ITEMS[k].passiv),itemMit(d=>d.cards.some(c=>c.verbraucht))].filter(Boolean);
 $('picks').innerHTML=`<div class="box"><div class="innen"><div class="picks">${ids.map((id,i)=>itemPick(id,'',i===1?`<div class="preis">${BAL.shop.rare_price} GOLD</div>`:i===2?'<div class="preis">28 GOLD</div>':'')).join('')}</div></div></div>`;}

function bauPanels(){const out=[];
 S=probeS({phase:'weg',ebene:2});S.netz=netzBauen();S.netz.pos=[1,0];S.netz.gegangen=[[0,0],[1,0]];S.ebene=1;S.weg=netzAusgaenge(S.netz,S.netz.pos).map(k=>({...S.netz.ebenen[k.b[0]][k.b[1]],ziel:k.b,kurz:!!k.kurz}));window.kartenS=S;
 out.push(spec('Weg-Wahl',`<div class="panelbox" style="padding:0"><div style="position:relative;width:calc(var(--u)*480);height:calc(var(--u)*270)">${wegHtml()}</div></div>`));
 const ev=EVENTS.find(e=>e.stummfilm)||EVENTS.find(e=>e.biom==='hafen')||EVENTS[0];
 if(ev){S=probeS({phase:'event',event:ev.id,gold:12});out.push(spec('Ereignis als Zettel'+(ev.o.some(o=>o.if)?' (eine Option gesperrt)':''),`<div class="panelbox" style="width:760px">${eventHtml()}</div>`));}
 const fr=FRAGS.find(f=>f.schaltet&&f.schaltet.art==='item')||FRAGS[0];
 if(fr){S=probeS({phase:'wandbild',frag:fr.id,fragNeu:fr.schaltet&&fr.schaltet.art==='item'?[{n:ITEMS[fr.schaltet.id]?.n||fr.schaltet.id}]:[],route:[fr.biom,'kapelle','salz','eis','pforte']});
  out.push(spec('Wandbild mit Relief und Zettel',`<div class="panelbox">${wandbildHtml()}</div>`));$('panels').innerHTML=out.join('');try{reliefMalen();}catch(e){console.warn('Relief',e);}}
 else $('panels').innerHTML=out.join('');
 {const alt=S;S=window.kartenS;try{karteNach();}catch(e){console.warn('Karte',e);}S=alt;}}

// ---------- (2) Pixelzeichen ----------
function bauZeichen(){const kachel=(k,n,col)=>`<div class="zeichen"><div class="gr">${[9,18,36,54].map(s=>gi(k,s,col)).join('')}</div><div class="zn">${esc(n)}</div><div class="zk">${esc(k)}</div></div>`;
 const knoten=Object.entries(RUN.knoten).filter(([k])=>!k.startsWith('_'));
 const sonst=[['atk','Angriff'],['atk2','Mehrfach / schwer'],['blk','Block'],['buff','Stärke'],['weak','Geschwächt'],['burn','Brand'],['poison','Gift'],['heal','Leben'],['gold','Gold']];
 $('zeichenBox').innerHTML=`<h3 class="unter">DIE ACHT STOFFE</h3><div class="zeichenraster">${Object.keys(ST).map(k=>kachel(k,ST[k].n)).join('')}</div>
  <h3 class="unter">KNOTENARTEN <small>run.json → knoten.zeichen</small></h3><div class="zeichenraster">${knoten.map(([k,kn])=>kachel(kn.zeichen,kn.n)).join('')}</div>
  <h3 class="unter">ABSICHTEN UND ZUSTÄNDE</h3><div class="zeichenraster">${sonst.map(([k,n])=>kachel(k,n)).join('')}</div>`;}

// ---------- (3) Gegner mit allen Animationen ----------
const spieler=[];// alle Sheet-Abspieler, für den Schalter „alle“
function sheetSpieler(name,biom,k=2){const sp=ladeSprite(name);const c=document.createElement('canvas');c.className='figur';c.width=96;c.height=120;c.style.width=96*k+'px';c.style.height=120*k+'px';
 const B=BIOMES[biom]||BIOMES.hafen;const o={c,anim:'idle',t0:0,groesse:false,setze(a){o.anim=a;o.t0=performance.now()/1000;}};let last='';
 anims.push({c,f:t=>{if(!sp||!sp.ok||!sp.meta)return false;const m=sp.meta;
  if(!o.groesse){c.width=m.w;c.height=m.h;c.style.width=m.w*k+'px';c.style.height=m.h*k+'px';o.groesse=true;}
  const an=m.anim[o.anim]||m.anim.idle;const lt=Math.max(0,t-o.t0);let fr;
  if(an.loop)fr=Math.floor(lt*an.fps)%an.n;else{const zyklus=an.n/an.fps+.7;fr=Math.min(an.n-1,Math.floor((lt%zyklus)*an.fps));}
  const key=o.anim+fr+'|'+Math.floor(t*6);if(key===last)return true;last=key;
  const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle=B.nebel[0];x.fillRect(0,0,m.w,m.h);x.fillStyle=B.koerper[1];x.fillRect(0,m.fuss[1]+1,m.w,m.h);
  x.drawImage(sp.img,fr*m.w,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
  if(m.augen&&o.anim!=='tod')m.augen.forEach(([ax,ay])=>dglowA(x,ax,ay,6,m.augenfarbe||B.augen,.35+Math.sin(t*2)*.05));return true;}});
 o.info=()=>sp&&sp.meta?`${sp.meta.w}×${sp.meta.h} · ${ANIMS.filter(a=>sp.meta.anim[a]).map(a=>`${ANIM_N[a]} ${sp.meta.anim[a].n}`).join(', ')}`:(sp&&sp.fehlt?'Sheet fehlt':'lädt …');
 spieler.push(o);return o;}
function knoepfe(liste){const box=document.createElement('div');box.className='animknoepfe';
 ANIMS.forEach(a=>{const b=document.createElement('button');b.textContent=ANIM_N[a];b.dataset.a=a;if(a==='idle')b.className='an';b.onclick=()=>{liste.forEach(s=>s.setze(a));box.querySelectorAll('button').forEach(x=>x.classList.toggle('an',x.dataset.a===a));};box.appendChild(b);});return box;}
const musterHtml=pat=>`<div class="abs-reihe">${pat.map((p,i)=>`<div class="feind"><div class="abs">${absicht({pat,pi:i,str:0,weak2:0}).html}</div></div>`).join('<span class="pfeil">›</span>')}</div>`;
function gegnerKachel(id,F){const t=document.createElement('div');t.className='kachel'+(F.rang!=='normal'?' selten':'');if(F.rang==='boss')t.style.gridColumn='1 / -1';
 const b=F.besonders||{};const sheets=[...new Set([...(F.varianten||[F.sprite]),...(b.sprites||[])])].filter(Boolean);
 const row=document.createElement('div');row.className='sheets';const sps=[];
 sheets.forEach((name,i)=>{const s=sheetSpieler(name,F.biom);sps.push(s);const fig=document.createElement('figure');fig.appendChild(s.c);const cap=document.createElement('figcaption');
  const phase=F.rang==='boss'?`Phase ${i+1} · schwach ${ST[i===0?F.weak:(b.schwach||[])[i-1]]?.n||'?'} · `:'';cap.textContent=phase+name;fig.appendChild(cap);row.appendChild(fig);
  setTimeout(()=>{cap.textContent=phase+name+' · '+s.info();},2500);});
 t.appendChild(row);t.appendChild(knoepfe(sps));
 const rang={normal:'normal',waechter:'Wächter',boss:'Boss'}[F.rang]||F.rang;
 let bes='';if(b.art==='ruft')bes=`Ruft alle ${b.alle||3} Züge ${esc(FOES[b.gegner]?.n||b.gegner)}.`;
 else if(b.art==='schwach_wechsel')bes=`Wechselt jeden Zug die Schwachstelle: ${b.stoffe.map(k=>gi(k,18)).join(' ')}`;
 else if(b.art==='phasen')bes=`Phasen bei ${b.bei.map(x=>Math.round(x*100)+' %').join(' / ')} Leben, ruft ${esc(FOES[(b.ruft&&b.ruft.gegner)||b.ruft]?.n||'')}.`;
 t.insertAdjacentHTML('beforeend',`<div class="kopf"><div><div class="kn">${esc(F.n)}</div><div class="id">${id} · ${rang} · ${esc(BIOMES[F.biom]?.kurz||F.biom)} · ${F.hp} Leben · schwach ${gi(F.weak,18)} ${esc(ST[F.weak].n)}</div></div></div>
  ${musterHtml(F.pat)}${b.art==='phasen'?(b.muster||[]).map((m,i)=>`<div class="ref">Phase ${i+2}:</div>${musterHtml(m)}`).join(''):''}
  ${bes?`<div class="kzeile" style="--kb:#ff6a5a">${bes}</div>`:''}<div class="tx"><i>${esc(F.konzept||'')}</i></div>`);
 return t;}
function bauGegner(){const box=$('gegnerBox');
 BIOM_IDS.forEach(bi=>{const list=Object.entries(FOES).filter(([,F])=>F.biom===bi).sort((x,y)=>({normal:0,waechter:1,boss:2}[x[1].rang]||0)-({normal:0,waechter:1,boss:2}[y[1].rang]||0));if(!list.length)return;
  box.insertAdjacentHTML('beforeend',`<h3 class="unter">${esc(BIOMES[bi].n).toUpperCase()}</h3>`);const g=document.createElement('div');g.className='raster';g.style.gridTemplateColumns='repeat(auto-fill,minmax(440px,1fr))';
  list.forEach(([id,F])=>g.appendChild(gegnerKachel(id,F)));box.appendChild(g);});
 const k=knoepfe(spieler);$('alleAnim').append(Object.assign(document.createElement('span'),{className:'spec',innerHTML:'<span class="lbl" style="margin-right:8px">Alle Gegner:</span>'}),...k.childNodes);
 $('alleAnim').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>document.querySelectorAll('#gegnerBox .animknoepfe button').forEach(x=>x.classList.toggle('an',x.dataset.a===btn.dataset.a))));}

// ---------- (4) Biome ----------
const warte=[];
function szene(b,opt,c,figur){const x=c.getContext('2d');x.imageSmoothingEnabled=false;let sz=null;const sp=figur?ladeSprite(figur):null;
 warte.push(()=>{try{if(typeof World==='undefined'||!World._biome||!World._biome[b])throw new Error('fehlt');sz=World.build(b,opt);}
  catch(e){const fig=c.parentNode;fig.insertAdjacentHTML('beforeend',`<div class="hinweis">${e.message==='fehlt'?`<code>js/scenes/world/${b}.js</code> ist noch nicht gebaut; gezeigt wird der Ersatz der Bühne.`:`World.build-Fehler: ${esc(e.message)}; gezeigt wird der Ersatz.`}</div>`);
   try{sz=ersatzSzene({biom:b});}catch(e2){sz=null;}}});
 const waechterMalen=(ctx,reihen,t)=>{if(!sp||!sp.ok||!sp.meta)return;const m=sp.meta,an=m.anim.idle,fr=Math.floor(t*an.fps)%an.n;const r=reihen[2]||{y:214};const X=240-m.fuss[0],Y=r.y-m.fuss[1];
  ctx.drawImage(sp.img,fr*m.w,an.zeile*m.h,m.w,m.h,X,Y,m.w,m.h);if(m.augen)m.augen.forEach(([ax,ay])=>dglowA(ctx,X+ax,Y+ay,6,m.augenfarbe||BIOMES[b].augen,.35+Math.sin(t*2)*.05));};
 let last=-1;
 anims.push({c,f:t=>{if(!sz)return false;const step=Math.floor(t*15);if(step===last)return true;last=step;const kam={x:Math.sin(t*.3)*3,y:Math.sin(t*.35)*1.2};
  x.fillStyle='#000';x.fillRect(0,0,480,270);
  try{if(sz.zeichne)sz.zeichne(x,t,kam,figur?(ctx,reihen)=>waechterMalen(ctx,reihen,t):null);else{(sz.ebenen||[]).forEach(L=>x.drawImage(L.canvas,L.x||0,L.y||0));if(figur)waechterMalen(x,sz.reihen||[],t);}}catch(e){}
  return !!(figur?sp&&(sp.ok||sp.fehlt):true);}});}
function bauBiome(){const box=$('biomBox');
 BIOM_IDS.forEach(b=>{const B=BIOMES[b];const da=typeof World!=='undefined'&&World._biome&&World._biome[b];const W2=FOES[B.waechter];
  const f=(l,cols)=>`<span>${l}</span>${cols.map(c=>`<i style="background:${c}" title="${c}"></i>`).join('')}`;
  const blk=document.createElement('div');blk.className='biomblock';
  blk.innerHTML=`<div class="kopf" style="display:flex;gap:16px;align-items:baseline;flex-wrap:wrap"><div class="kachel" style="padding:0;border:none;box-shadow:none;background:none"><div class="kn" style="font-size:24px">${esc(B.n)}</div></div><span class="einl" style="margin:0">${esc(B.zeit)}</span>
   <div class="farben">${f('Körper',B.koerper)}${f('Rand',B.rand)}${f('Augen',[B.augen])}${f('Nebel',B.nebel)}</div>${da?'':'<span class="hinweis">noch nicht in World gebaut</span>'}</div><div class="szenen"></div>`;
  const g=blk.querySelector('.szenen');
  [0,1,2].forEach(v=>{const fig=document.createElement('figure');const c=document.createElement('canvas');c.width=480;c.height=270;c.className='szene';fig.appendChild(c);fig.insertAdjacentHTML('beforeend',`<figcaption>Variante ${v} · Kampf · Fremdheit ${[0,.5,1][v]}</figcaption>`);g.appendChild(fig);szene(b,{variante:v,seed:7+v*13,fremdheit:[0,.5,1][v],art:'kampf'},c,null);});
  const fig=document.createElement('figure');const c=document.createElement('canvas');c.width=480;c.height=270;c.className='szene';fig.appendChild(c);fig.insertAdjacentHTML('beforeend',`<figcaption>Wächter-Szene · ${esc(W2?W2.n:B.waechter)}</figcaption>`);g.appendChild(fig);
  szene(b,{variante:0,seed:7,fremdheit:1,art:'waechter'},c,W2?W2.sprite:null);
  box.appendChild(blk);});}

// ---------- (5) Alt ----------
function bauAlt(){const g=$('altGegner');
 const altKachel=(name,variant,info)=>{const big=name==='boss';const v=mkVis(name,variant);v.lx=0;v.ly=0;const k=big?2:3;v.c.className='figur';v.c.style.width=v.c.width*k+'px';v.c.style.height=v.c.height*k+'px';v.c.style.background='radial-gradient(ellipse at 50% 85%,#1a1814,#000 70%)';
  const t=document.createElement('div');t.className='kachel';if(big)t.style.gridColumn='span 2';t.appendChild(v.c);t.insertAdjacentHTML('beforeend',`<div class="kn">${esc(info.n)}</div><div class="id">FOE_DRAW.${name}${variant?` · BOSS_VARIANTS.${variant}`:''}</div>${info.d?`<div class="tx">${esc(info.d)}</div>`:''}`);
  const ph=Math.random()*10;let last=-1;
  anims.push({c:v.c,f:tt=>{const s=Math.floor(tt*30);if(s===last)return true;last=s;v.x.clearRect(0,0,v.c.width,v.c.height);const gl=FOE_DRAW[name](v.x,tt+ph,v)||[];finish(v.c,v.x,OUTLINE[name]||'#000',false);gl.forEach(q=>dglow(v.x,q[0],q[1],q[3]*.6,q[2],.5));return true;}});
  g.appendChild(t);};
 const N={cultist:'Kultist',fishman:'Fischmensch',drowned:'Ertrunkener',shade:'Schatten'};
 Object.keys(FOE_DRAW).filter(k=>k!=='boss').forEach(k=>altKachel(k,null,{n:N[k]||k}));
 Object.keys(BOSS_VARIANTS).forEach(k=>altKachel('boss',k,BOSS_INFO[k]||{n:k}));
 const zg=$('altZonen');
 ['hafen','wald','kapelle','grund'].forEach(z=>{let sc;try{sc=scene(z);}catch(e){console.warn('alte Zone',z,e);return;}const c=document.createElement('canvas');c.width=W;c.height=H;c.className='szene';c.style.width=W*2+'px';c.style.height=H*2+'px';const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  const t=document.createElement('div');t.className='kachel';t.appendChild(c);t.insertAdjacentHTML('beforeend',`<div class="kn">${esc(z)}</div><div class="id">zones.js → scene("${z}")</div>`);zg.appendChild(t);
  let last=-1;anims.push({c,f:tt=>{const s=Math.floor(tt*20);if(s===last)return true;last=s;x.drawImage(sc.bg,0,0);sc.back&&sc.back(x,tt);if(sc.midc)x.drawImage(sc.midc,0,0);sc.mid&&sc.mid(x,tt);x.drawImage(sc.fg,0,0);sc.front&&sc.front(x,tt);x.drawImage(VIG,0,0);return true;}});});}

// ---------- Start ----------
(async()=>{
 try{await loadData();}catch(err){document.body.insertAdjacentHTML('afterbegin',`<div style="padding:20px;color:#ff8a7a;font:16px monospace">Daten konnten nicht geladen werden (${esc(err.message)}).<br>Bitte über einen lokalen Server öffnen (start.command / start.bat oder: python3 -m http.server im Ordner prototype).</div>`);return;}
 for(const p of (typeof PAKETE!=='undefined'?PAKETE:[]))for(const src of p.skripte||[])await new Promise(res=>{const sc=document.createElement('script');sc.src=src;sc.onload=res;sc.onerror=res;document.head.appendChild(sc);});
 const reihe=RUN.akte.flatMap(a=>a.biome);BIOM_IDS=Object.keys(BIOMES).filter(k=>!k.startsWith('_')).sort((x,y)=>((BIOMES[x].akt??9)-(BIOMES[y].akt??9))||((reihe.indexOf(x)+99)%99-(reihe.indexOf(y)+99)%99));
 spritesVorladen();
 for(const f of [bauKarten,bauBalken,bauAbsichten,bauZustaende,bauKnoepfe,bauGear,bauPicks,bauPanels,bauZeichen,bauGegner,bauBiome,bauAlt]){try{f();}catch(e){console.warn('Galerie:',f.name,e);}}
 S=probeS({phase:'titel'});
 try{bauDemo();}catch(e){console.warn('Galerie: Demo',e);}
 const naechste=()=>{const f=warte.shift();if(!f)return;f();setTimeout(naechste,20);};setTimeout(naechste,100);
 const sicht=new WeakSet();const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?sicht.add(e.target):sicht.delete(e.target)));anims.forEach(a=>io.observe(a.c));
 const t0=performance.now();
 const loop=now=>{const t=(now-t0)/1000;for(const a of anims){if(a.fertig&&!sicht.has(a.c))continue;try{if(a.f(t))a.fertig=true;}catch(e){a.fertig=true;console.warn(e);}}requestAnimationFrame(loop);};requestAnimationFrame(loop);
})();
})();
