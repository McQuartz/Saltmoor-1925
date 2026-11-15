// Auftrag 4, Phase 1: Tiefe im Kampfbild (Lichtpult, docs/auftrag-4/vorlagen/look-runde-2, Preset „Alles“ ohne Vordergrund).
// Szenenlicht auf den Gegnern (je Bild gecacht), Bodenkontakt (Schatten vom Licht weg, Spiegelung im Wasser, Füße 2 Pixel im Wasser),
// Bayer-Dunst zwischen den Ebenen und über dem Boden, Lichtstrahlen (Maske einmal je Szene), Augenlicht auf dem Boden, leichte Vignette,
// Wiegen und Atmen zeilenweise. Alles in Szenenpixeln; gezeichnet wird in den Bildraum 560 × 315 (Ursprung BILD.x, BILD.y).
// Licht je Biom steht als Daten in data/biomes.json (licht: punkt, farbe, raum, wasser, strahlen). Fehlt es, kommt es aus der Palette.
const TF={key:'',L:null,relit:new Map(),ray:null,rayKey:'',rayC:null,rayN:0,dunstC:null,motes:null};
const tfHex=h=>{h=String(h||'#000');if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];};
const TIEFE_AN=()=>!(typeof Einst!=='undefined'&&Einst.get('tiefe')===false);
// Licht der aktuellen Szene: Punkt, Farbe, Raumfarbe, Wasser, Strahlen, Bodenlinie der hinteren Reihe
function tiefeLicht(){const id=typeof biomId==='function'?biomId():'hafen';const k=id+'|'+BU.key;if(TF.key===k&&TF.L)return TF.L;TF.key=k;
 const B=(typeof BIOMES!=='undefined'&&BIOMES[id])||{};const l=B.licht||{};const sl=typeof stellListe==='function'&&typeof STELL!=='undefined'?stellListe():null;
 const ys=sl&&sl.length?sl.map(p=>p.y):[180];
 TF.L={id,p:l.punkt||[240,40],lc:tfHex(l.farbe||(B.rand||[])[1]||'#ffe0a0'),amb:tfHex(l.raum||(B.koerper||[])[1]||'#101010'),nebel:tfHex((B.nebel||[])[1]||'#2a3a52'),
  wasser:!!l.wasser,strahlen:l.strahlen||null,boden:Math.min(...ys)-6,vorn:Math.max(...ys)};
 if(TF.relit.size>600)TF.relit.clear();return TF.L;}
// Szenenlicht: Randpixel zur Lichtquelle bekommen die Lichtfarbe (oben und zur Lichtseite 60 %, Ecken 85 %),
// der Körper geht 30 % zur Raumfarbe, helle Pixel ziehen zur Lichtfarbe. Ergebnis je (Bild, Licht, Seite) gecacht.
function tiefeRelight(tc,key,x){const L=tiefeLicht();const dx=Math.sign(L.p[0]-x)||0;const k=key+'|'+L.id+'|'+dx;let c=TF.relit.get(k);
 const w=tc.c.width,h=tc.c.height;
 if(!c){c=document.createElement('canvas');c.width=w;c.height=h;const xx=c.getContext('2d');xx.drawImage(tc.c,0,0);const id=xx.getImageData(0,0,w,h),d=id.data,a=new Uint8Array(w*h);
  for(let i=0;i<a.length;i++)a[i]=d[i*4+3]>0?1:0;const op=(X,Y)=>X>=0&&X<w&&Y>=0&&Y<h&&a[Y*w+X];const Lc=L.lc,A=L.amb;
  for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++){const i=Y*w+X;if(!a[i])continue;const o=i*4;const lum=d[o]*.3+d[o+1]*.59+d[o+2]*.11;
   let r=d[o]*.7+A[0]*.3,g=d[o+1]*.7+A[1]*.3,b=d[o+2]*.7+A[2]*.3;
   if(lum>90){const q=Math.min(1,(lum-90)/120)*.7;r=r*(1-q)+Lc[0]*q*lum/200;g=g*(1-q)+Lc[1]*q*lum/200;b=b*(1-q)+Lc[2]*q*lum/200;}
   const top=!op(X,Y-1),side=dx&&!op(X+dx,Y)&&!op(X+dx,Y-1);
   if(top||side){const q=top&&side?.85:.6;r=r*(1-q)+Lc[0]*q;g=g*(1-q)+Lc[1]*q;b=b*(1-q)+Lc[2]*q;}
   d[o]=r;d[o+1]=g;d[o+2]=b;}
  xx.putImageData(id,0,0);TF.relit.set(k,c);}
 tc.x.clearRect(0,0,w,h);tc.x.drawImage(c,0,0);}
// Sprite zeilenweise: Wiegen (oben mehr als unten) und Atmen (Höhe ±2 %), Füße bleiben stehen
function tiefeSprite(g,src,w,h,fx,fyIn,x,y,t,ph,sway){const br=1+Math.sin(t*1.9+ph)*.018;
 for(let r=0;r<h;r++){const k=Math.max(0,(fyIn-r)/fyIn);const off=Math.round(Math.sin(t*1.6+ph+r*.045)*sway*k);const dy=Math.round(y-(fyIn-r)*br);g.drawImage(src,0,r,w,1,x-fx+off,dy,w,Math.ceil(br));}}
// Schatten vom Licht weg (gerastert), im Wasser ein flacher Fleck
function tiefeSchatten(g,x,y){const L=tiefeLicht();const dir=x<L.p[0]?-1:1;g.fillStyle='#000';
 if(L.wasser){for(let j=0;j<4;j++){const w=22-j*4;for(let i=-w;i<=w;i++)if(bay(x+i,y+j)<.55-j*.1)g.fillRect(x+i,y+j,1,1);}}
 else{for(let j=0;j<14;j++){const w=Math.round(16*(1-j/18));const cx=Math.round(x-dir*j*1.6);for(let i=-w;i<=w;i++)if(bay(cx+i,y+j)<.6-j*.035)g.fillRect(cx+i,y+j,1,1);}}}
// Spiegelung Zeile für Zeile mit Wellenversatz
function tiefeSpiegel(g,src,w,fx,fyIn,x,y,t){for(let r=1;r<46;r++){const sr=fyIn-r;if(sr<0)break;if((r+(t*8|0))&1)continue;const off=Math.round(Math.sin(t*2.2+r*.55)*(1+r*.06));g.globalAlpha=.32*(1-r/46);g.drawImage(src,0,sr,w,1,x-fx+off,y+r,w,1);}g.globalAlpha=1;}
function tiefeWellen(g,x,y,t,ph){const L=tiefeLicht();g.fillStyle=`rgb(${L.lc.map(v=>v*.6|0)})`;const w=13+Math.round(Math.sin(t*2+ph)*2);for(let i=-w;i<=w;i++)if(((i+(t*5|0))&3)===0)g.fillRect(x+i,y+1,1,1);}
// Augenlicht: gerasterter Fleck auf dem Boden unter jedem Auge, im Wasser ein gespiegelter Punkt
function tiefeAugenlicht(g,augen,col,x,y,fyIn,t){const L=tiefeLicht();const A=tfHex(col);g.fillStyle=`rgb(${A})`;
 for(const [ex,ey] of augen){for(let j=0;j<3;j++)for(let i=-5+j*2;i<=5-j*2;i++)if(bay(ex+i,y+1+j)<.18)g.fillRect(ex+i,y+1+j,1,1);
  if(L.wasser&&!((t*6|0)&1)){g.globalAlpha=.6;g.fillRect(ex,y+(fyIn-ey)+Math.round(Math.sin(t*3)),1,1);g.globalAlpha=1;}}}
// Bayer-Dunst als Band (y0 bis y1), zieht langsam. Gezeichnet über die ganze Bildbreite (−40 bis 520).
function tiefeDunst(g,t,y0,y1,dens,schnell){const L=tiefeLicht();const W=BILD.w,H=Math.max(1,y1-y0);if(!TF.dunstC||TF.dunstC.width!==W||TF.dunstC.height<H){TF.dunstC=document.createElement('canvas');TF.dunstC.width=W;TF.dunstC.height=Math.max(64,H);TF.dunstX=TF.dunstC.getContext('2d');}
 const x=TF.dunstX,id=x.createImageData(W,H),d=id.data,N=L.nebel;
 for(let j=0;j<H;j++){const y=y0+j;const v=Math.sin(j/H*Math.PI)*dens;for(let i=0;i<W;i++){const X=i-BILD.x;const n=schnell?Math.sin(X*.05-t*.4+y*.3)*.12:Math.sin(X*.045+t*.35+y*.21)*.12+Math.sin(X*.013-t*.2)*.1;
  if(v+n>bay(X+(schnell?1:0),y+(schnell?2:0))){const o=(j*W+i)*4;d[o]=N[0];d[o+1]=N[1];d[o+2]=N[2];d[o+3]=255;}}}
 x.clearRect(0,0,W,TF.dunstC.height);x.putImageData(id,0,0);g.drawImage(TF.dunstC,0,0,W,H,-BILD.x,y0,W,H);}
// Lichtstrahlen: Maske einmal je Szene, liegt vor den Gegnern, nur in Szenen mit Strahlen in den Daten
function tiefeStrahlen(g,t){const L=tiefeLicht();if(!L.strahlen)return;const W=BILD.w,H=BILD.h;
 if(TF.rayKey!==TF.key){TF.rayKey=TF.key;TF.ray=new Float32Array(W*H);const [lx,ly]=L.p;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=i-BILD.x,y=j-BILD.y;const dx=x-lx,dy=y-ly;if(dy<10)continue;const dist=Math.hypot(dx,dy);const a=Math.atan2(dx,dy);let v=0;
   for(const [b,w] of L.strahlen){const q=1-Math.abs(a-b)/w;if(q>0)v=Math.max(v,q);}TF.ray[j*W+i]=v*Math.max(0,1-dist/210)*.75;}
  TF.rayC=document.createElement('canvas');TF.rayC.width=W;TF.rayC.height=H;TF.rayX=TF.rayC.getContext('2d');TF.rayN=0;}
 // nur jedes dritte Bild neu rastern, das Flimmern ist langsam
 if(TF.rayN++%3===0){const id=TF.rayX.createImageData(W,H),d=id.data,Lc=L.lc;for(let k=0;k<TF.ray.length;k++){const v=TF.ray[k];if(!v)continue;const x=k%W,y=k/W|0;const n=v*(.85+.15*Math.sin(t*.8+x*.03));if(n>bay(x,y)+.12){const o=k*4;d[o]=Lc[0]*.5;d[o+1]=Lc[1]*.5;d[o+2]=Lc[2]*.5;d[o+3]=255;}}TF.rayX.putImageData(id,0,0);}
 g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.5;g.drawImage(TF.rayC,-BILD.x,-BILD.y);g.restore();
 // Staub im Licht
 if(!TF.motes)TF.motes=Array.from({length:40},()=>({x:Math.random()*560-40,y:Math.random()*240,s:Math.random()<.2?2:1,v:2+Math.random()*5,p:Math.random()*6}));
 g.fillStyle=`rgb(${Lc2(L.lc)})`;for(const m of TF.motes){const x=((m.x+Math.sin(t*.3+m.p)*12+40)%560+560)%560-40,y=(m.y+t*m.v)%250;g.globalAlpha=.3+.2*Math.sin(t*1.3+m.p);g.fillRect(x|0,y|0,m.s,m.s);}g.globalAlpha=1;}
const Lc2=c=>c.map(v=>Math.min(255,v*.6+100|0));
// Leichte Vignette über dem ganzen Bildraum
function tiefeVignette(g){if(!TF.vig){const c=document.createElement('canvas');c.width=BILD.w;c.height=BILD.h;const x=c.getContext('2d');const W=BILD.w,H=BILD.h;
  const vg=x.createRadialGradient(W/2,H*.5,W*.3,W/2,H*.5,W*.64);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=vg;x.fillRect(0,0,W,H);TF.vig=c;}
 g.drawImage(TF.vig,-BILD.x,-BILD.y);}
