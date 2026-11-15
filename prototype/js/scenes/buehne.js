// Bühne: zeichnet die 480×270-Szene (Hintergrund aus js/scenes/world/, Gegner, Partikel, Effekte, Stummfilm).
// Ganzzahlig skaliert, Pixel bleiben scharf. Sichtdaten der Gegner (vis) liegen hier, nicht im Spielzustand.
const SW=480,SH=270;
// Auftrag 4 Phase 0: Bildraum Mitte. Die Szene wird in 560 × 315 gerendert (Szenenkoordinaten bleiben 480 × 270, Ursprung bei x 40, y −3:
// 40 Pixel mehr links und rechts, die Kamera 15 tiefer, 48 Zeilen mehr Boden) und als Ganzes unter die 480 × 270 große Oberfläche skaliert.
// uiX/uiY rechnen Szenenkoordinaten in Oberflächenpixel um (Faktor 480/560 = 6/7). Plaketten, Karten und Leisten haben in jeder Bildgröße dieselben Maße.
const BILD={w:560,h:315,x:40,y:-3};
const uiX=x=>(x+BILD.x)*480/BILD.w,uiY=y=>(y+BILD.y)*270/BILD.h,ausUiX=u=>u*BILD.w/480-BILD.x,ausUiY=u=>u*BILD.h/270-BILD.y;
// Bildschirmpunkt → Szenenkoordinaten (über das sichtbare Bild, #scene)
function ausBildschirm(cx,cy){const r=BU.cv.getBoundingClientRect();return{x:ausUiX((cx-r.left)/r.width*480),y:ausUiY((cy-r.top)/r.height*270),r};}
const BU={cv:null,g:null,k:2,cam:{x:0,y:0},sz:null,key:'',vis:new Map(),t:0,stumm:null,lastStumm:-1e9,stummKampf:null,shake:0,flashA:0,flashCol:'#fff',freeze:0,maus:{x:240,y:135}};
const PT=[],FXL=[];
// --- Sprite-Sheets (M6): prototype/assets/gegner/<name>.png + .json ---
const SPRITES={};
function ladeSprite(name){if(!name||SPRITES[name])return SPRITES[name];const o=SPRITES[name]={ok:false,img:new Image(),meta:null};
 fetch('assets/gegner/'+name+'.json').then(r=>r.ok?r.json():null).then(m=>{if(!m){o.fehlt=true;return;}o.meta=m;o.img.onload=()=>{o.ok=true;if(S.phase==='fight'&&typeof render==='function')render();};o.img.src='assets/gegner/'+name+'.png';}).catch(()=>{o.fehlt=true;});return o;}

// Alle Gegner-Sheets aus foes.json vorladen (klein), damit Positionen von Anfang an stimmen
function spritesVorladen(){for(const id in FOES){const f=FOES[id];[f.sprite,...(f.varianten||[]),...((f.besonders&&f.besonders.sprites)||[])].filter(Boolean).forEach(ladeSprite);}}
// BU.bild: die Szene in ihrer echten Größe (560 × 315), dorthin zeichnet alles mit BU.g in Szenenkoordinaten.
// BU.cv (#scene): das sichtbare Bild in Gerätepixeln. bildZeigen() vergrößert BU.bild dorthin (siehe dort).
function buehneInit(){spritesVorladen();BU.cv=document.getElementById('scene');BU.ag=BU.cv.getContext('2d');
 BU.bild=document.createElement('canvas');BU.bild.width=BILD.w;BU.bild.height=BILD.h;BU.g=BU.bild.getContext('2d',{willReadFrequently:true});BU.g.imageSmoothingEnabled=false;
 BU.zw=document.createElement('canvas');BU.zg=BU.zw.getContext('2d');bildGroesse();
 addEventListener('pointermove',e=>{if(!BU.cv)return;const p=ausBildschirm(e.clientX,e.clientY);BU.maus={x:p.x,y:p.y};});}
// Größe des sichtbaren Bildes an das Fenster anpassen (von skala() in main.js gerufen)
function bildGroesse(){if(!BU.cv)return;const r=BU.cv.getBoundingClientRect(),d=window.devicePixelRatio||1;const w=Math.max(BILD.w,Math.round(r.width*d)),h=Math.max(BILD.h,Math.round(r.height*d));
 if(BU.cv.width!==w||BU.cv.height!==h){BU.cv.width=w;BU.cv.height=h;}
 // Zwischenbild in der nächsten ganzen Vergrößerung (scharf), danach eine leichte Verkleinerung auf die Zielgröße: Pixel bleiben gleich breit
 const n=Math.max(1,Math.ceil(w/BILD.w));if(BU.zw.width!==BILD.w*n){BU.zw.width=BILD.w*n;BU.zw.height=BILD.h*n;}}
// Szene (560 × 315) ins sichtbare Bild. 3,43-fach (1080p) ist nicht ganzzahlig: reines Nächster-Nachbar-Skalieren gäbe ungleich breite Pixel
// (Spalten mal 3, mal 4 Bildschirmpixel). Darum erst ganzzahlig scharf auf das nächstgrößere Vielfache, dann einmal auf die Zielgröße verkleinert.
// Dabei wird nur die Kante jedes Pixels um höchstens einen Bildschirmpixel gemittelt, kein Weichzeichner über das Bild (BU.glatt=false: nur scharf).
function bildZeigen(){const a=BU.ag,c=BU.cv;a.setTransform(1,0,0,1,0,0);
 if(BU.glatt===false||c.width%BILD.w===0){a.imageSmoothingEnabled=false;a.drawImage(BU.bild,0,0,c.width,c.height);return;}
 const z=BU.zg;z.imageSmoothingEnabled=false;z.drawImage(BU.bild,0,0,BU.zw.width,BU.zw.height);
 a.imageSmoothingEnabled=true;a.imageSmoothingQuality='high';a.drawImage(BU.zw,0,0,c.width,c.height);}

// Welche Szene gehört zum aktuellen Bildschirm?
function szenenWahl(){const ph=S.phase||'titel';const b=S.route?biomId():'hafen';
 const fremd=S.route?Math.min(1,(S.ebene||0)/Math.max(1,(RUN.akte[S.akt]?.ebenen.length||4)-1)):0;
 const variante=S.seed!=null?R(`szene:${S.akt}:${S.ebene}`).int(0,2):0;
 const map={titel:'titel',figur:'strand',erbe:'strand',brief:'ereignis',strand:'strand',ankunft:'ankunft',ende:'ankunft',uebergang:'uebergang',weg:'weg',reward:'kampf',event:'ereignis',event_folge:'ereignis',streichen:'ereignis',kraemer:'kraemer',kraemer_streichen:'kraemer',werkstatt:'werkstatt',rast:'rast',wandbild:'wandbild',fund:'fund',knoten:'weg'};
 let art=map[ph]||'kampf';if(ph==='fight'||ph==='reward')art=(S.kampfArt==='waechter'||S.kampfArt==='finale')?'waechter':'kampf';
 const w={biom:b,art,variante,fremdheit:fremd,seed:(S.seed||7)+S.akt*101+(S.ebene||0)*13};
 if(art==='strand'&&typeof Metaebene!=='undefined')w.spuren=Metaebene.strandStufe(); // M10: das Spiel zählt mit (Fußspuren am Strand)
 // Wächter-Szene je Boss-Phase (szenenPhase in combat.js): ab Phase 1 bekommt World.build ein Feld phase (paket-format.md)
 const sp=art==='waechter'&&typeof szenenPhase==='function'?szenenPhase():0;if(sp)w.phase=sp;
 // Dev/Werkzeuge (tools/stell-bogen.js): bestimmte Szene erzwingen, z. B. S.devSzene={variante:2}
 if(S.devSzene)Object.assign(w,S.devSzene);return w;}
function szeneHolen(){const w=szenenWahl();const key=JSON.stringify(w);if(key===BU.key&&BU.sz)return BU.sz;BU.key=key;const alt=BU.sz,altPh=BU.szPhase||0;
 try{BU.sz=typeof World!=='undefined'?World.build(w.biom,w):ersatzSzene(w);}catch(e){console.warn('Szene',e);BU.sz=ersatzSzene(w);}
 // Neue Boss-Phase: alte Szene blendet in 0,8 s gestuft aus, die neue liegt darunter; optionaler Haken World._biome.<id>.phase(n, szene)
 const ph=w.phase||0;BU.szPhase=ph;
 if(alt&&w.art==='waechter'&&ph>altPh){BU.szAlt={sz:alt,t0:BU.t};const D=typeof World!=='undefined'&&World._biome&&World._biome[w.biom];
  if(D&&typeof D.phase==='function'){try{D.phase(ph,BU.sz);}catch(e){console.warn('Szenenphase',e);}}
  Bus.emit('szene_phase',{biom:w.biom,phase:ph,why:`Wächter-Szene ${w.biom} für Phase ${ph+1} neu gebaut (World.build mit phase ${ph})`});}
 return BU.sz;}
function zeichneSzene(sz,g,t,cam,dunst){if(sz.zeichneHintergrund){try{sz.zeichneHintergrund(g,t,cam);}catch(e){}return;}
 sz.ebenen.forEach((L,i)=>{if(dunst&&i===3)dunst();g.drawImage(L.canvas,(L.x||0)-Math.round(cam.x*L.parallax),(L.y||0)-Math.round(cam.y*L.parallax));});try{sz.zeichneAnimiert&&sz.zeichneAnimiert(g,t,cam);}catch(e){}}
// Ersatz, solange js/scenes/world/ fehlt: Nebel-Verlauf in den Biom-Farben, Boden, drei Reihen
function ersatzSzene(w){const B=BIOMES[w.biom]||BIOMES.hafen;const c=document.createElement('canvas');c.width=SW;c.height=SH;const x=c.getContext('2d');
 const A=hx(B.nebel[0]),Z=hx(B.nebel[1]),K=hx(B.koerper[1]);const id=x.createImageData(SW,SH),d=id.data;
 for(let y=0;y<SH;y++)for(let i=0;i<SW;i++){let q=y<170?Math.max(0,1-Math.abs(y-120)/120)*(.6+.4*Math.exp(-(((i-240)/180)**2))):0.08;const col=y<170?(q>bay(i,y)?Z:A):(((y-170)/100)>bay(i,y)?K:A);const o=(y*SW+i)*4;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255;}
 x.putImageData(id,0,0);return{w:SW,h:SH,ebenen:[{canvas:c,parallax:0}],reihen:[{y:168,skala:.9,nebel:.35},{y:190,skala:1,nebel:.15},{y:214,skala:1,nebel:0}],zeichneAnimiert(){},zeichneVordergrund(){}};}

// --- Effekte ---
function burst(X,Y,col,n,sp=1.6,up=0){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.4+Math.random())*sp;PT.push({x:X,y:Y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-up,g:.06,life:0,max:.35+Math.random()*.45,col});}}
function visOf(e){let v=BU.vis.get(e.uid);if(!v){v={hit:0,kx:0,lunge:0,dying:0,gone:false,ph:Math.random()*10,anim:'idle',at:0,old:null};BU.vis.set(e.uid,v);}return v;}
// Position eines Gegners in der Szene (Fußpunkt, Größe), aus Aufstellung und Reihen der Szene
// Auftrag 3 M2: Stellplätze der Szene (data/stell.json). Jeder Gegner bekommt beim ersten Zeichnen den ersten freien Platz
// in der Reihenfolge von S.enemies (aufstellen() gibt Wächtern Platz 1 = vorn Mitte); fehlt die Liste, gelten die alten Bodenreihen.
function stellListe(){const w=szenenWahl();return STELL[`${w.biom}:${w.art}:${w.variante||0}`]||STELL[`${w.biom}:${w.art}`]||null;}
function stellPlatz(e,l){if(e.platz!=null&&e.platz<l.length)return e.platz;const belegt=new Set((S.enemies||[]).filter(o=>o!==e&&o.hp>0&&o.platz!=null).map(o=>o.platz));
 const frei=[...l.keys()].filter(i=>!belegt.has(i));const wunsch=e.platzWunsch!=null&&frei.includes(e.platzWunsch)?e.platzWunsch:frei[0];e.platz=wunsch??0;return e.platz;}
// M9 Spuren: der Gegner wächst mit der Stufe sichtbar (balance.json → spuren.gross)
function enemyBox(e){const b=enemyBox0(e);if(e.spuren==null||typeof Spuren==='undefined')return b;const f=Spuren.W().gross[e.spuren]||1;
 return{...b,sk:b.sk*f,w:Math.round(b.w*f),h:Math.round(b.h*f),kopf:b.y-Math.round((b.y-b.kopf)*f)};}
function enemyBox0(e){const sz=BU.sz||szeneHolen();const sl=!e.pendel&&typeof STELL!=='undefined'?stellListe():null;
 if(sl&&sl.length){const P=sl[stellPlatz(e,sl)];const sp=e.sprite&&SPRITES[e.sprite];let w=96,h=120;if(sp&&sp.meta){w=sp.meta.w;h=sp.meta.h;}else if(e.spr==='boss'){w=160;h=140;}else{w=64;h=80;}
  const sk=1;/* Auftrag 4: kein Skalieren mehr, Tiefe über Reihe, Höhe und Dunst */const nebel=P.s<.85?.3:P.s<.97?.12:0;
  return{x:P.x,y:P.y,w:Math.round(w*sk),h:Math.round(h*sk),sk,nebel,kopf:sp&&sp.meta&&sp.meta.kopf!=null?P.y-Math.round((sp.meta.fuss[1]-(Array.isArray(sp.meta.kopf)?sp.meta.kopf[1]:sp.meta.kopf))*sk):P.y-Math.round(h*sk*.92)};}
 const rh=sz.reihen[e.reihe??2]||sz.reihen[2];const sp=e.sprite&&SPRITES[e.sprite];
 let w=96,h=120;if(sp&&sp.meta){w=sp.meta.w;h=sp.meta.h;}else if(e.spr==='boss'){w=160;h=140;}else{w=64;h=80;}
 const sk=1;if(e.pendel&&!FAST){e.xa=e.xa==null?e.x:e.xa+(e.x-e.xa)*.06;}const ex=e.pendel&&e.xa!=null?e.xa:e.x;return{x:Math.round(ex*SW),y:rh.y,w:Math.round(w*sk),h:Math.round(h*sk),sk,nebel:rh.nebel,kopf:sp&&sp.meta&&sp.meta.kopf!=null?rh.y-Math.round((sp.meta.fuss[1]-(Array.isArray(sp.meta.kopf)?sp.meta.kopf[1]:sp.meta.kopf))*sk):rh.y-Math.round(h*sk*.92)};}
const FX={
 pos(e){return enemyBox(e);},
 hit(e,d,col,wer){if(!e)return;const W=BAL.wucht||{},k=wer==='eigen'?(W.eigen||1):(W.gegner||1);const v=visOf(e);const p=enemyBox(e);v.hit=.11;v.kx=Math.min(10,(W.rueckstoss||4)*k+d/4);v.anim='treffer';v.at=0;burst(p.x,p.y-p.h*.55,col||'#c8483a',Math.min(28,4+d)*k|0,1.5*k);
  if(d>0){BU.freeze=performance.now()+(d>=(W.gross_ab||12)?(W.hitstop_gross_ms||120):(W.hitstop_ms||55))*k;BU.shake=Math.max(BU.shake,Math.min(9,((W.ruck||3)+d/5)*k));}},
 slash(e,col){const p=enemyBox(e);FXL.push({k:'slash',x:p.x,y:p.y-p.h*.55,col,t:0,dur:.2,s:p.w*.6,flip:Math.random()<.5});},
 ring(col,e){const p=e&&e.hp!==undefined?enemyBox(e):{x:240,y:180,h:0};FXL.push({k:'ring',x:p.x,y:p.y-p.h*.5,col,t:0,dur:.55,r:e?44:150});},
 flash(col,a){BU.flashCol=col;BU.flashA=a;},
 shake(n){if(Einst.get('wackeln'))BU.shake=Math.max(BU.shake,n);},
 lunge(e){const v=visOf(e);v.lunge=.38;v.anim='angriff';v.at=0;},
 die(e){const v=visOf(e);if(v.dying)return;const p=enemyBox(e);
  // pixelfx: der Gegner zerfällt in seine eigenen Pixel (zeichnet ihn selbst weiter)
  const sp=e.sprite&&SPRITES[e.sprite];if(typeof PFX!=='undefined'&&PFX.bereit&&sp&&sp.ok){const m=sp.meta,an=m.anim[v.anim]||m.anim.idle;const fr=an.loop?Math.floor(v.at*an.fps)%an.n:0;const c=document.createElement('canvas');c.width=m.w;c.height=m.h;c.getContext('2d').drawImage(sp.img,fr*m.w,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
   const r=PFX.spiel('tod',{bild:c,bx:p.x-Math.round(m.fuss[0]*p.sk),by:p.y-Math.round(m.fuss[1]*p.sk),skala:p.sk,palette:biomId(),seed:e.uid});if(r){v.dying=1;v.gone=true;BU.shake=Math.max(BU.shake,3);return;}}
  v.dying=.001;v.anim='tod';v.at=0;burst(p.x,p.y-p.h*.5,ST&&BIOMES[biomId()]?BIOMES[biomId()].augen:'#7affc8',18,1.6);BU.shake=Math.max(BU.shake,4);}
};
// Stummfilm-Rauschen: nur bei besonderen Anlässen (Wächter, Boss, markiertes Ereignis), höchstens einmal pro Kampf, frühestens alle 3 Minuten
function stummfilm(grund){const SF=BAL.stummfilm;const now=performance.now();if(!Einst.get('stummfilm'))return false;
 if(now-BU.lastStumm<SF.abstand_min_s*1000)return false;if(S.phase==='fight'&&BU.stummKampf===S.turnNo+':'+S.depth&&SF.max_pro_kampf<=1)return false;
 BU.lastStumm=now;BU.stumm={t0:now,dur:SF.dauer_s*1000};BU.stummKampf=S.phase==='fight'?S.turnNo+':'+S.depth:null;Bus.emit('stummfilm',{why:grund});return true;}

// --- Hauptschleife ---
let lastT=performance.now();
function frame(now){let dt=Math.min(.05,(now-lastT)/1000);lastT=now;if(now<BU.freeze)dt=0;BU.t+=dt;const t=BU.t,g=BU.g;
 const sz=szeneHolen();
 // Kamera: ruhiges Atmen + ein paar Pixel Maus-Parallax + Ruck
 // Auftrag 3 M2: im Kampf keine Kamera (keine Mausfolge, kein Atmen); Wackeln bei Treffern (shake) bleibt
 const kampfSzene=S.phase==='fight'||S.phase==='reward';if(kampfSzene){BU.cam.x=0;BU.cam.y=0;}else{const atm=Math.sin(t*.35)*1.2;BU.cam.x+=(((BU.maus.x-240)/240)*4-BU.cam.x)*.05;BU.cam.y+=(((BU.maus.y-135)/135)*2+atm-BU.cam.y)*.05;}
 BU.shake*=Math.pow(.002,dt||.016);const sx=(Math.random()-.5)*BU.shake,sy=(Math.random()-.5)*BU.shake;const cam={x:BU.cam.x+sx,y:BU.cam.y+sy};
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,BILD.w,BILD.h);g.setTransform(1,0,0,1,BILD.x,BILD.y);
 // M3: während der Fahrt nach vorne zeichnet Fahrt das Bild (Ebenen mit Tiefe), keine Gegner, kein Wackeln der Szene
 const fahrtBild=typeof Fahrt!=='undefined'&&Fahrt.zeichne?Fahrt.zeichne(g,sz,now,t):false;
 if(!fahrtBild){
 const TA=typeof tiefeLicht==='function'&&TIEFE_AN()&&['fight','reward'].includes(S.phase),TL=TA?tiefeLicht():null;
 zeichneSzene(sz,g,t,cam,TA?()=>tiefeDunst(g,t,TL.boden-34,TL.boden+4,.24,false):null);
 if(BU.szAlt){const q=(t-BU.szAlt.t0)/.8;if(q>=1||BU.szAlt.sz===sz)BU.szAlt=null;else{g.globalAlpha=Math.ceil((1-q)*4)/4;zeichneSzene(BU.szAlt.sz,g,t,cam);g.globalAlpha=1;}}
 if(S.enemies&&['fight','reward'].includes(S.phase)){const list=[...S.enemies].sort((a,b)=>(enemyBox(a).y-enemyBox(b).y)||(a.x-b.x));
  // Auftrag 4: die hintere Reihe steht im Dunst über dem Boden, die vorderen davor
  let dunst2=!TA;list.forEach(e=>{if(!dunst2&&enemyBox(e).y>TL.boden+16){dunst2=true;tiefeDunst(g,t,TL.boden-14,TL.boden+26,.18,true);}zeichneGegner(g,e,dt,t,cam);});if(!dunst2)tiefeDunst(g,t,TL.boden-14,TL.boden+26,.18,true);
  if(S.verbuendeter&&S.phase==='fight')zeichneVerbuendeter(g,dt,t,cam);}
 if(BU.schatten){const q=(now-BU.schatten.t0)/BU.schatten.dur;if(q>=1)BU.schatten=null;else schattenMalen(g,q,cam);}
 if(typeof PFX!=='undefined')try{PFX.zeichne(g,dt);}catch(e){}
 if(TA)tiefeStrahlen(g,t);
 try{sz.zeichneVordergrund&&sz.zeichneVordergrund(g,t,cam);}catch(e){}
 if(TA)tiefeVignette(g);
 }
 for(let i=FXL.length-1;i>=0;i--){const f=FXL[i];f.t+=dt||.016;const p=f.t/f.dur;if(p>=1){FXL.splice(i,1);continue;}
  if(f.k==='slash'){const s=f.s,dir=f.flip?-1:1;const a=Math.min(1,p*2.2),b=Math.max(0,p*2.2-1.1);g.fillStyle=stc(f.col);for(let k=Math.floor(b*24);k<a*24;k++){const q=k/24;g.fillRect(Math.round(f.x+(q-.5)*s*2*dir),Math.round(f.y+(q-.5)*s*1.3),2,1);}}
  if(f.k==='ring'){const rr=f.r*(1-Math.pow(1-p,3));g.fillStyle=stc(f.col);for(let a=0;a<6.283;a+=1.5/Math.max(8,rr)){g.fillRect(Math.round(f.x+Math.cos(a)*rr),Math.round(f.y+Math.sin(a)*rr*.5),1,1);}}}
 for(let i=PT.length-1;i>=0;i--){const q=PT[i];q.life+=dt||.016;if(q.life>=q.max){PT.splice(i,1);continue;}q.vy+=q.g;q.x+=q.vx;q.y+=q.vy;if(q.life/q.max>.7&&bay(q.x,q.y)>.5)continue;g.fillStyle=q.col;g.fillRect(Math.round(q.x),Math.round(q.y),1,1);}
 if(BU.flashA>0){g.globalAlpha=Math.min(.5,BU.flashA);g.fillStyle=BU.flashCol;g.fillRect(-BILD.x,-BILD.y,BILD.w,BILD.h);g.globalAlpha=1;BU.flashA-=dt*2.5;}
 if(S.phase==='strand'&&S.ergebnis&&!S.ergebnis.sieg&&t-(BU.strandT||0)<0)0;
 if(BU.stumm){const q=(now-BU.stumm.t0)/BU.stumm.dur;if(q>=1)BU.stumm=null;else stummfilmMalen(g,q);}
 if(typeof Fahrt!=='undefined'&&Fahrt.deck){Fahrt.deck(g,now,t);g.setTransform(1,0,0,1,BILD.x,BILD.y);} // Nebel-Übergang nach der Fahrt
 if(typeof Dev!=='undefined'&&Dev.an)Dev.szene(g,t);
 g.setTransform(1,0,0,1,0,0);bildZeigen();
 requestAnimationFrame(frame);}
// M7: Ohne Hinsehen flackert höchstens einmal je Akt ein Schatten (Umriss des Gesehenen, dunkel, gedithert), kein Text
Bus.on('blick_schatten',({gegner})=>{if(FAST)return;const f=FOES[gegner];const xs=(S.enemies||[]).filter(e=>e.hp>0).map(e=>e.x);const x=[.12,.88,.3,.7].reduce((a,b)=>Math.min(1,...xs.map(q=>Math.abs(q-b)))>Math.min(1,...xs.map(q=>Math.abs(q-a)))?b:a);BU.schatten={t0:performance.now(),dur:520,sprite:f&&f.sprite,x};if(f&&f.sprite)ladeSprite(f.sprite);});
function schattenMalen(g,q,cam){const sp=BU.schatten.sprite&&SPRITES[BU.schatten.sprite];if(!sp||!sp.ok)return;const m=sp.meta,an=m.anim.idle;
 const a=Math.sin(q*Math.PI)*(Math.random()<.25?.35:1)*.8;const tc=tmpCanvas(m.w,m.h);tc.x.clearRect(0,0,m.w,m.h);tc.x.drawImage(sp.img,0,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
 const id=tc.x.getImageData(0,0,m.w,m.h),d=id.data;for(let y=0;y<m.h;y++)for(let i=0;i<m.w;i++){const o=(y*m.w+i)*4;if(!d[o+3])continue;if(bay(i,y)>a){d[o+3]=0;continue;}d[o]=6;d[o+1]=8;d[o+2]=10;d[o+3]=255;}
 tc.x.putImageData(id,0,0);const x=Math.round(BU.schatten.x*SW-cam.x*.5-m.fuss[0]),y=Math.round(SH*.7-cam.y*.5-m.fuss[1]);g.drawImage(tc.c,x,y);}
const stc=k=>k&&ST&&ST[k]?ST[k].c:(k||'#e8c547');

// M9: der Verbündete aus der Asche steht links und schaut nach rechts zu den Gegnern (gespiegelt gezeichnet, aschgrau getönt)
function zeichneVerbuendeter(g,dt,t,cam){const v=S.verbuendeter;const p=enemyBox(v);const px=Math.round(p.x-cam.x*.5);g.save();g.translate(px*2,0);g.scale(-1,1);zeichneGegner(g,v,dt,t,cam);g.restore();}
function zeichneGegner(g,e,dt,t,cam){const v=visOf(e);if(v.gone)return;const p=enemyBox(e);
 v.hit=Math.max(0,v.hit-dt);v.kx*=Math.pow(.0005,dt);v.lunge=Math.max(0,v.lunge-dt);v.at+=dt;
 if(e.hp<=0&&!v.dying){v.dying=.001;v.anim='tod';v.at=0;}
 if(v.dying){v.dying+=dt;}
 const sp=e.sprite&&ladeSprite(e.sprite);
 const lq=v.lunge>0?1-v.lunge/.38:0;const L=v.lunge>0?(lq<.3?-.5*Math.sin(lq/.3*Math.PI):Math.sin((lq-.3)/.7*Math.PI)):0; // Auftrag 4: erst ausholen, dann vor
 const gs=!!e.gesehener; // M7: Gesehene schweben (kein Bodenschatten, langsames Heben und Senken)
 const ox=Math.round(p.x-cam.x*.5+(Math.random()-.5)*v.kx*.5),fy=Math.round(p.y-cam.y*.5+L*6-(gs?6+Math.round(Math.sin(t*1.1+v.ph)*2):0));
 // Kontaktschatten
 const TA=typeof tiefeLicht==='function'&&TIEFE_AN(),TL=TA?tiefeLicht():null,nass=TA&&TL.wasser&&!gs;
 if(!gs){if(TA)tiefeSchatten(g,ox,fy);else{g.fillStyle='rgba(0,0,0,.5)';const rw=Math.round(p.w*.32);for(let j=-1;j<=1;j++){const w2=Math.round(rw*(1-Math.abs(j)*.4));g.fillRect(ox-w2,fy+j,w2*2,1);}}}
 if(sp&&sp.ok){v.sheet=true;const m=sp.meta;let an=m.anim[v.anim]||m.anim.idle;let n=Math.floor(v.at*an.fps);
  if(!an.loop&&n>=an.n){if(v.anim==='tod'){v.gone=true;return;}v.anim='idle';v.at=0;an=m.anim.idle;n=0;}
  const fr=an.loop?n%an.n:Math.min(n,an.n-1);
  const tc=tmpCanvas(m.w,m.h);tc.x.clearRect(0,0,m.w,m.h);tc.x.drawImage(sp.img,fr*m.w,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
  if(TA&&!v.dying)tiefeRelight(tc,e.sprite+':'+(an.zeile||0)+':'+fr+':'+(e.variant||''),ox);
  nachbearbeiten(tc,e,v,p);
  const ac=m.augenfarbe||BIOMES[biomId()].augen,aug=m.augen&&v.anim!=='tod'&&e.hp>0?m.augen.map(([ax,ay])=>[ox+Math.round((ax-m.fuss[0])*p.sk),ay]):null;
  if(TA&&p.sk===1){
   // Auftrag 4: Augenlicht auf dem Boden, Spiegelung, Füße 2 Pixel im Wasser, Wiegen und Atmen zeilenweise
   if(aug&&!gs)tiefeAugenlicht(g,aug,ac,ox,fy,m.fuss[1],t);
   if(nass){tiefeSpiegel(g,tc.c,m.w,m.fuss[0],m.fuss[1],ox,fy,t);g.save();g.beginPath();g.rect(-BILD.x,-BILD.y,BILD.w,fy+1+BILD.y);g.clip();tiefeSprite(g,tc.c,m.w,m.h,m.fuss[0],m.fuss[1],ox,fy+2,t,v.ph,e.rang==='normal'?1:.6);g.restore();tiefeWellen(g,ox,fy,t,v.ph);}
   else tiefeSprite(g,tc.c,m.w,m.h,m.fuss[0],m.fuss[1],ox,fy,t,v.ph,e.rang==='normal'?1:.6);}
  else{const dw=Math.round(m.w*p.sk),dh=Math.round(m.h*p.sk);g.drawImage(tc.c,0,0,m.w,m.h,ox-Math.round(m.fuss[0]*p.sk),fy-Math.round(m.fuss[1]*p.sk),dw,dh);}
  if(aug)m.augen.forEach(([ax,ay])=>dglowA(g,ox+Math.round((ax-m.fuss[0])*p.sk),fy+(nass?2:0)+Math.round((ay-m.fuss[1])*p.sk),6,ac,.35+Math.sin(t*2+v.ph)*.12));
  return;}
 // Rückfall: alte Zeichner aus js/sprites/foes.js (bis die Sheets aus M6 da sind)
 if(typeof FOE_DRAW==='undefined'||!FOE_DRAW[e.spr])return;
 if(!v.old)v.old=mkVis(e.spr==='boss'?'boss':e.id,e.variant);const o=v.old;o.x.clearRect(0,0,o.c.width,o.c.height);
 if(v.dying){if(v.dying>.9){v.gone=true;return;}}
 const glows=FOE_DRAW[e.spr](o.x,t+v.ph,o)||[];finish(o.c,o.x,'#000',v.hit>0);
 const tc=tmpCanvas(o.c.width,o.c.height);tc.x.clearRect(0,0,o.c.width,o.c.height);tc.x.drawImage(o.c,0,0);nachbearbeiten(tc,e,v,p);
 const big=e.spr==='boss',fx=o.c.width/2,fyy=big?138:78;const sk=p.sk;
 g.drawImage(tc.c,0,0,o.c.width,o.c.height,ox-Math.round(fx*sk),fy-Math.round(fyy*sk),Math.round(o.c.width*sk),Math.round(o.c.height*sk));
 glows.forEach(q=>dglowA(g,ox+Math.round((q[0]-fx)*sk),fy+Math.round((q[1]-fyy)*sk),q[3],q[2],.6));}
// Trefferblitz, Zielmarkierung, Nebel der hinteren Reihe, Auflösen beim Tod (alles gedithert, keine Weichzeichnung)
const _tmp={};function tmpCanvas(w,h){const k=w+'x'+h;if(!_tmp[k]){const c=document.createElement('canvas');c.width=w;c.height=h;_tmp[k]={c,x:c.getContext('2d',{willReadFrequently:true})};}return _tmp[k];}
// Unverwundbarer Zug (Musterschritt unverw): halb durchscheinend im Schachbrett-Raster, kühl getönt, am Rand ein wandernder kalter Schimmer (kein Weichzeichner)
const UNVERW_RAND=[[207,232,255],[120,160,210]],UNVERW_TON=[150,185,230];
function nachbearbeiten(tc,e,v,p){const w=tc.c.width,h=tc.c.height;const neb=p.nebel||0;const tod=v.dying?Math.min(1,v.dying/.9):0;const ziel=typeof AIM!=='undefined'&&S.enemies.indexOf(e)>=0&&AIM.ei===S.enemies.indexOf(e);
 const uv=!tod&&e.hp>0&&S.phase==='fight'&&typeof unverwJetzt==='function'&&unverwJetzt(e);
 const gs=!!e.gesehener&&!tod;const gph=Math.floor(BU.t*4)&3; // M7: Gesehene halb durchsichtig im wandernden Bayer-Raster, kühl getönt
 const asch=!!e.verbuendet&&!tod;const aph=Math.floor(BU.t*3); // M9: aus der Asche, grau, oben rieselt es
 if(!(v.hit&&!v.sheet)&&!neb&&!tod&&!ziel&&!uv&&!gs&&!asch)return;const id=tc.x.getImageData(0,0,w,h),d=id.data;const nc=hx(BIOMES[biomId()].nebel[1]);
 let al=null,ph=0;if(uv){al=new Uint8Array(w*h);for(let k=0;k<w*h;k++)al[k]=d[k*4+3]>0?1:0;ph=Math.floor(BU.t*7);}
 for(let y=0;y<h;y++)for(let i=0;i<w;i++){const o=(y*w+i)*4;if(!d[o+3])continue;
  if(tod&&(tod*1.15>bay(i,y)*.6+(1-y/h)*.5)){d[o+3]=0;continue;}
  if(asch){const l=(d[o]*.3+d[o+1]*.59+d[o+2]*.11);const hel=bay(i,y+aph)<.12&&y<h*.45;const q=hel?l*.55+120:l*.8+22;d[o]=q;d[o+1]=q*.97;d[o+2]=q*.92;if(y<h*.3&&bay(i,y+aph)<.08){d[o+3]=0;continue;}}
  if(gs){if(bay(i+gph,y)<.45){d[o+3]=0;continue;}d[o]=(d[o]*3+170)>>2;d[o+1]=(d[o+1]*3+200)>>2;d[o+2]=(d[o+2]*3+215)>>2;}
  if(uv){const k=y*w+i;const rand=!(i>0&&al[k-1])||!(i<w-1&&al[k+1])||!(y>0&&al[k-w])||!(y<h-1&&al[k+w]);
   if(rand){const c=UNVERW_RAND[((i+y+ph)%7)<3?0:1];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;continue;}
   d[o]=(d[o]*3+UNVERW_TON[0])>>2;d[o+1]=(d[o+1]*3+UNVERW_TON[1])>>2;d[o+2]=(d[o+2]*3+UNVERW_TON[2])>>2;if((i+y)&1)d[o+3]=d[o+3]>>1;}
  if(v.hit>0&&!v.sheet&&((i+y)&1)){d[o]=Math.min(255,d[o]+50);d[o+1]=Math.min(255,d[o+1]+45);d[o+2]=Math.min(255,d[o+2]+40);continue;} // dezent; Sheets haben eine eigene Treffer-Animation
  if(neb&&neb>bay(i,y)+.35){d[o]=(d[o]+nc[0])>>1;d[o+1]=(d[o+1]+nc[1])>>1;d[o+2]=(d[o+2]+nc[2])>>1;}
  if(ziel&&((i+y)&7)===0){d[o]=Math.min(255,d[o]+60);}}
 tc.x.putImageData(id,0,0);}
function dglowA(x,cx,cy,r,col,a){x.save();x.globalCompositeOperation='lighter';x.fillStyle=col;const R=Math.ceil(r);
 for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const d=Math.sqrt(i*i+j*j)/r;if(d>=1)continue;const v=a*(1-d)*(1-d)*.6;const X=Math.round(cx+i),Y=Math.round(cy+j);if(v>bay(X,Y))x.fillRect(X,Y,1,1);}x.restore();}
function stummfilmMalen(g,q){const SF=BAL.stummfilm;const k=Math.sin(Math.min(1,q)*Math.PI);const B=BIOMES[biomId()]||BIOMES.hafen;const tint=hx(B.rand[1]);const vir=SF.viragierung*k;
 const id=g.getImageData(0,0,BILD.w,BILD.h),d=id.data;const fl=1-SF.flackern*k*(Math.random()<.5?1:0);
 for(let p=0;p<d.length;p+=4){const r=d[p],gg=d[p+1],b=d[p+2];const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);if(mx>200&&mx-mn>60)continue; // Augen und Lichter behalten ihre Farbe
  const l=(r*.3+gg*.59+b*.11)/255;const tr=l*tint[0],tg=l*tint[1],tb=l*tint[2];d[p]=(r+(tr-r)*vir)*fl;d[p+1]=(gg+(tg-gg)*vir)*fl;d[p+2]=(b+(tb-b)*vir)*fl;}
 g.putImageData(id,0,0);g.fillStyle='rgba(240,230,210,.35)';g.save();g.setTransform(1,0,0,1,0,0);
 for(let i=0;i<BILD.w*BILD.h*SF.koernung*k*.01;i++)g.fillRect(Math.random()*BILD.w|0,Math.random()*BILD.h|0,1,1);
 if(Math.random()<SF.kratzer*k){const xx=Math.random()*BILD.w|0;g.fillRect(xx,0,1,BILD.h);}g.restore();}
