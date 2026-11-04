// Bühne: zeichnet die 480×270-Szene (Hintergrund aus js/scenes/world/, Gegner, Partikel, Effekte, Stummfilm).
// Ganzzahlig skaliert, Pixel bleiben scharf. Sichtdaten der Gegner (vis) liegen hier, nicht im Spielzustand.
const SW=480,SH=270;
const BU={cv:null,g:null,k:2,cam:{x:0,y:0},sz:null,key:'',vis:new Map(),t:0,stumm:null,lastStumm:-1e9,stummKampf:null,shake:0,flashA:0,flashCol:'#fff',freeze:0,maus:{x:240,y:135}};
const PT=[],FXL=[];
// --- Sprite-Sheets (M6): prototype/assets/gegner/<name>.png + .json ---
const SPRITES={};
function ladeSprite(name){if(!name||SPRITES[name])return SPRITES[name];const o=SPRITES[name]={ok:false,img:new Image(),meta:null};
 fetch('assets/gegner/'+name+'.json').then(r=>r.ok?r.json():null).then(m=>{if(!m){o.fehlt=true;return;}o.meta=m;o.img.onload=()=>{o.ok=true;if(S.phase==='fight'&&typeof render==='function')render();};o.img.src='assets/gegner/'+name+'.png';}).catch(()=>{o.fehlt=true;});return o;}

// Alle Gegner-Sheets aus foes.json vorladen (klein), damit Positionen von Anfang an stimmen
function spritesVorladen(){for(const id in FOES){const f=FOES[id];[f.sprite,...(f.varianten||[]),...((f.besonders&&f.besonders.sprites)||[])].filter(Boolean).forEach(ladeSprite);}}
function buehneInit(){spritesVorladen();BU.cv=document.getElementById('scene');BU.cv.width=SW;BU.cv.height=SH;BU.g=BU.cv.getContext('2d');BU.g.imageSmoothingEnabled=false;
 BU.cv.addEventListener('pointermove',e=>{const r=BU.cv.getBoundingClientRect();BU.maus={x:(e.clientX-r.left)/r.width*SW,y:(e.clientY-r.top)/r.height*SH};});}

// Welche Szene gehört zum aktuellen Bildschirm?
function szenenWahl(){const ph=S.phase||'titel';const b=S.route?biomId():'hafen';
 const fremd=S.route?Math.min(1,(S.ebene||0)/Math.max(1,(RUN.akte[S.akt]?.ebenen.length||4)-1)):0;
 const variante=S.seed!=null?R(`szene:${S.akt}:${S.ebene}`).int(0,2):0;
 const map={titel:'titel',figur:'strand',strand:'strand',ankunft:'ankunft',ende:'ankunft',uebergang:'uebergang',weg:'weg',reward:'kampf',event:'ereignis',event_folge:'ereignis',streichen:'ereignis',kraemer:'kraemer',kraemer_streichen:'kraemer',werkstatt:'werkstatt',rast:'rast',wandbild:'wandbild',fund:'fund',knoten:'weg'};
 let art=map[ph]||'kampf';if(ph==='fight'||ph==='reward')art=(S.kampfArt==='waechter'||S.kampfArt==='finale')?'waechter':'kampf';
 return{biom:b,art,variante,fremdheit:fremd,seed:(S.seed||7)+S.akt*101+(S.ebene||0)*13};}
function szeneHolen(){const w=szenenWahl();const key=JSON.stringify(w);if(key===BU.key&&BU.sz)return BU.sz;BU.key=key;
 try{BU.sz=typeof World!=='undefined'?World.build(w.biom,w):ersatzSzene(w);}catch(e){console.warn('Szene',e);BU.sz=ersatzSzene(w);}return BU.sz;}
// Ersatz, solange js/scenes/world/ fehlt: Nebel-Verlauf in den Biom-Farben, Boden, drei Reihen
function ersatzSzene(w){const B=BIOMES[w.biom]||BIOMES.hafen;const c=document.createElement('canvas');c.width=SW;c.height=SH;const x=c.getContext('2d');
 const A=hx(B.nebel[0]),Z=hx(B.nebel[1]),K=hx(B.koerper[1]);const id=x.createImageData(SW,SH),d=id.data;
 for(let y=0;y<SH;y++)for(let i=0;i<SW;i++){let q=y<170?Math.max(0,1-Math.abs(y-120)/120)*(.6+.4*Math.exp(-(((i-240)/180)**2))):0.08;const col=y<170?(q>bay(i,y)?Z:A):(((y-170)/100)>bay(i,y)?K:A);const o=(y*SW+i)*4;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255;}
 x.putImageData(id,0,0);return{w:SW,h:SH,ebenen:[{canvas:c,parallax:0}],reihen:[{y:168,skala:.9,nebel:.35},{y:190,skala:1,nebel:.15},{y:214,skala:1,nebel:0}],zeichneAnimiert(){},zeichneVordergrund(){}};}

// --- Effekte ---
function burst(X,Y,col,n,sp=1.6,up=0){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.4+Math.random())*sp;PT.push({x:X,y:Y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-up,g:.06,life:0,max:.35+Math.random()*.45,col});}}
function visOf(e){let v=BU.vis.get(e.uid);if(!v){v={hit:0,kx:0,lunge:0,dying:0,gone:false,ph:Math.random()*10,anim:'idle',at:0,old:null};BU.vis.set(e.uid,v);}return v;}
// Position eines Gegners in der Szene (Fußpunkt, Größe), aus Aufstellung und Reihen der Szene
function enemyBox(e){const sz=BU.sz||szeneHolen();const rh=sz.reihen[e.reihe??2]||sz.reihen[2];const sp=e.sprite&&SPRITES[e.sprite];
 let w=96,h=120;if(sp&&sp.meta){w=sp.meta.w;h=sp.meta.h;}else if(e.spr==='boss'){w=160;h=140;}else{w=64;h=80;}
 const sk=e.rang==='normal'?rh.skala:1;return{x:Math.round(e.x*SW),y:rh.y,w:Math.round(w*sk),h:Math.round(h*sk),sk,nebel:rh.nebel,kopf:sp&&sp.meta&&sp.meta.kopf?rh.y-Math.round((sp.meta.fuss[1]-sp.meta.kopf[1])*sk):rh.y-Math.round(h*sk*.92)};}
const FX={
 pos(e){return enemyBox(e);},
 hit(e,d,col){if(!e)return;const v=visOf(e);const p=enemyBox(e);v.hit=.11;v.kx=Math.min(8,3+d/3);v.anim='treffer';v.at=0;burst(p.x,p.y-p.h*.55,col||'#c8483a',Math.min(24,4+d),1.5);
  if(d>0){BU.freeze=performance.now()+(d>=12?110:45);BU.shake=Math.max(BU.shake,Math.min(8,1.5+d/4));}},
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
 const atm=Math.sin(t*.35)*1.2;BU.cam.x+=(((BU.maus.x-240)/240)*4-BU.cam.x)*.05;BU.cam.y+=(((BU.maus.y-135)/135)*2+atm-BU.cam.y)*.05;
 BU.shake*=Math.pow(.002,dt||.016);const sx=(Math.random()-.5)*BU.shake,sy=(Math.random()-.5)*BU.shake;const cam={x:BU.cam.x+sx,y:BU.cam.y+sy};
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,SW,SH);
 sz.ebenen.forEach(L=>{g.drawImage(L.canvas,Math.round(-cam.x*L.parallax),Math.round(-cam.y*L.parallax));});
 try{sz.zeichneAnimiert&&sz.zeichneAnimiert(g,t,cam);}catch(e){}
 if(S.enemies&&['fight','reward'].includes(S.phase)){const list=[...S.enemies].sort((a,b)=>(a.reihe-b.reihe)||(a.x-b.x));list.forEach(e=>zeichneGegner(g,e,dt,t,cam));}
 if(typeof PFX!=='undefined')try{PFX.zeichne(g,dt);}catch(e){}
 try{sz.zeichneVordergrund&&sz.zeichneVordergrund(g,t,cam);}catch(e){}
 for(let i=FXL.length-1;i>=0;i--){const f=FXL[i];f.t+=dt||.016;const p=f.t/f.dur;if(p>=1){FXL.splice(i,1);continue;}
  if(f.k==='slash'){const s=f.s,dir=f.flip?-1:1;const a=Math.min(1,p*2.2),b=Math.max(0,p*2.2-1.1);g.fillStyle=stc(f.col);for(let k=Math.floor(b*24);k<a*24;k++){const q=k/24;g.fillRect(Math.round(f.x+(q-.5)*s*2*dir),Math.round(f.y+(q-.5)*s*1.3),2,1);}}
  if(f.k==='ring'){const rr=f.r*(1-Math.pow(1-p,3));g.fillStyle=stc(f.col);for(let a=0;a<6.283;a+=1.5/Math.max(8,rr)){g.fillRect(Math.round(f.x+Math.cos(a)*rr),Math.round(f.y+Math.sin(a)*rr*.5),1,1);}}}
 for(let i=PT.length-1;i>=0;i--){const q=PT[i];q.life+=dt||.016;if(q.life>=q.max){PT.splice(i,1);continue;}q.vy+=q.g;q.x+=q.vx;q.y+=q.vy;if(q.life/q.max>.7&&bay(q.x,q.y)>.5)continue;g.fillStyle=q.col;g.fillRect(Math.round(q.x),Math.round(q.y),1,1);}
 if(BU.flashA>0){g.globalAlpha=Math.min(.5,BU.flashA);g.fillStyle=BU.flashCol;g.fillRect(0,0,SW,SH);g.globalAlpha=1;BU.flashA-=dt*2.5;}
 if(S.phase==='strand'&&S.ergebnis&&!S.ergebnis.sieg&&t-(BU.strandT||0)<0)0;
 if(BU.stumm){const q=(now-BU.stumm.t0)/BU.stumm.dur;if(q>=1)BU.stumm=null;else stummfilmMalen(g,q);}
 if(typeof Dev!=='undefined'&&Dev.an)Dev.szene(g,t);
 requestAnimationFrame(frame);}
const stc=k=>k&&ST&&ST[k]?ST[k].c:(k||'#e8c547');

function zeichneGegner(g,e,dt,t,cam){const v=visOf(e);if(v.gone)return;const p=enemyBox(e);
 v.hit=Math.max(0,v.hit-dt);v.kx*=Math.pow(.0005,dt);v.lunge=Math.max(0,v.lunge-dt);v.at+=dt;
 if(e.hp<=0&&!v.dying){v.dying=.001;v.anim='tod';v.at=0;}
 if(v.dying){v.dying+=dt;}
 const sp=e.sprite&&ladeSprite(e.sprite);
 const L=v.lunge>0?Math.sin((1-v.lunge/.38)*Math.PI):0;
 const ox=Math.round(p.x-cam.x*.5+(Math.random()-.5)*v.kx*.5),fy=Math.round(p.y-cam.y*.5+L*6);
 // Kontaktschatten
 g.fillStyle='rgba(0,0,0,.5)';const rw=Math.round(p.w*.32);for(let j=-1;j<=1;j++){const w2=Math.round(rw*(1-Math.abs(j)*.4));g.fillRect(ox-w2,fy+j,w2*2,1);}
 if(sp&&sp.ok){v.sheet=true;const m=sp.meta;let an=m.anim[v.anim]||m.anim.idle;let n=Math.floor(v.at*an.fps);
  if(!an.loop&&n>=an.n){if(v.anim==='tod'){v.gone=true;return;}v.anim='idle';v.at=0;an=m.anim.idle;n=0;}
  const fr=an.loop?n%an.n:Math.min(n,an.n-1);
  const tc=tmpCanvas(m.w,m.h);tc.x.clearRect(0,0,m.w,m.h);tc.x.drawImage(sp.img,fr*m.w,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
  nachbearbeiten(tc,e,v,p);
  const dw=Math.round(m.w*p.sk),dh=Math.round(m.h*p.sk);g.drawImage(tc.c,0,0,m.w,m.h,ox-Math.round(m.fuss[0]*p.sk),fy-Math.round(m.fuss[1]*p.sk),dw,dh);
  if(v.anim!=='tod'&&m.augen&&e.hp>0){const ac=m.augenfarbe||BIOMES[biomId()].augen;m.augen.forEach(([ax,ay])=>dglowA(g,ox+Math.round((ax-m.fuss[0])*p.sk),fy+Math.round((ay-m.fuss[1])*p.sk),6,ac,.35+Math.sin(t*2+v.ph)*.05));}
  return;}
 // Rückfall: alte Zeichner aus js/sprites/foes.js (bis die Sheets aus M6 da sind)
 if(typeof FOE_DRAW==='undefined'||!FOE_DRAW[e.spr])return;
 if(!v.old)v.old=mkVis(e.spr==='boss'?'boss':e.id,e.variant);const o=v.old;o.x.clearRect(0,0,o.c.width,o.c.height);
 if(v.dying){if(v.dying>.9){v.gone=true;return;}}
 const glows=FOE_DRAW[e.spr](o.x,t+v.ph,o)||[];finish(o.c,o.x,'#000',v.hit>0);
 const tc=tmpCanvas(o.c.width,o.c.height);tc.x.clearRect(0,0,o.c.width,o.c.height);tc.x.drawImage(o.c,0,0);nachbearbeiten(tc,e,v,p);
 const big=e.spr==='boss',fx=o.c.width/2,fyy=big?138:78;const sk=p.sk*(e.rang==='waechter'&&!big?1.3:1);
 g.drawImage(tc.c,0,0,o.c.width,o.c.height,ox-Math.round(fx*sk),fy-Math.round(fyy*sk),Math.round(o.c.width*sk),Math.round(o.c.height*sk));
 glows.forEach(q=>dglowA(g,ox+Math.round((q[0]-fx)*sk),fy+Math.round((q[1]-fyy)*sk),q[3],q[2],.6));}
// Trefferblitz, Zielmarkierung, Nebel der hinteren Reihe, Auflösen beim Tod (alles gedithert, keine Weichzeichnung)
const _tmp={};function tmpCanvas(w,h){const k=w+'x'+h;if(!_tmp[k]){const c=document.createElement('canvas');c.width=w;c.height=h;_tmp[k]={c,x:c.getContext('2d',{willReadFrequently:true})};}return _tmp[k];}
function nachbearbeiten(tc,e,v,p){const w=tc.c.width,h=tc.c.height;const neb=p.nebel||0;const tod=v.dying?Math.min(1,v.dying/.9):0;const ziel=typeof AIM!=='undefined'&&AIM.ei===S.enemies.indexOf(e);
 if(!(v.hit&&!v.sheet)&&!neb&&!tod&&!ziel)return;const id=tc.x.getImageData(0,0,w,h),d=id.data;const nc=hx(BIOMES[biomId()].nebel[1]);
 for(let y=0;y<h;y++)for(let i=0;i<w;i++){const o=(y*w+i)*4;if(!d[o+3])continue;
  if(tod&&(tod*1.15>bay(i,y)*.6+(1-y/h)*.5)){d[o+3]=0;continue;}
  if(v.hit>0&&!v.sheet&&((i+y)&1)){d[o]=Math.min(255,d[o]+50);d[o+1]=Math.min(255,d[o+1]+45);d[o+2]=Math.min(255,d[o+2]+40);continue;} // dezent; Sheets haben eine eigene Treffer-Animation
  if(neb&&neb>bay(i,y)+.35){d[o]=(d[o]+nc[0])>>1;d[o+1]=(d[o+1]+nc[1])>>1;d[o+2]=(d[o+2]+nc[2])>>1;}
  if(ziel&&((i+y)&7)===0){d[o]=Math.min(255,d[o]+60);}}
 tc.x.putImageData(id,0,0);}
function dglowA(x,cx,cy,r,col,a){x.save();x.globalCompositeOperation='lighter';x.fillStyle=col;const R=Math.ceil(r);
 for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const d=Math.sqrt(i*i+j*j)/r;if(d>=1)continue;const v=a*(1-d)*(1-d)*.6;const X=Math.round(cx+i),Y=Math.round(cy+j);if(v>bay(X,Y))x.fillRect(X,Y,1,1);}x.restore();}
function stummfilmMalen(g,q){const SF=BAL.stummfilm;const k=Math.sin(Math.min(1,q)*Math.PI);const B=BIOMES[biomId()]||BIOMES.hafen;const tint=hx(B.rand[1]);const vir=SF.viragierung*k;
 const id=g.getImageData(0,0,SW,SH),d=id.data;const fl=1-SF.flackern*k*(Math.random()<.5?1:0);
 for(let p=0;p<d.length;p+=4){const r=d[p],gg=d[p+1],b=d[p+2];const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);if(mx>200&&mx-mn>60)continue; // Augen und Lichter behalten ihre Farbe
  const l=(r*.3+gg*.59+b*.11)/255;const tr=l*tint[0],tg=l*tint[1],tb=l*tint[2];d[p]=(r+(tr-r)*vir)*fl;d[p+1]=(gg+(tg-gg)*vir)*fl;d[p+2]=(b+(tb-b)*vir)*fl;}
 g.putImageData(id,0,0);g.fillStyle='rgba(240,230,210,.35)';
 for(let i=0;i<SW*SH*SF.koernung*k*.01;i++)g.fillRect(Math.random()*SW|0,Math.random()*SH|0,1,1);
 if(Math.random()<SF.kratzer*k){const xx=Math.random()*SW|0;g.fillRect(xx,0,1,SH);}}
