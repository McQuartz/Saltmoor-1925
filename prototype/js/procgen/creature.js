// ===================== PROZEDURALE GEGNER =====================
// Ein Gegner ist hier nur ein "Genom": ein kleines Objekt mit Zahlen und Bausteinnamen.
// drawCreature() malt daraus jedes Bild neu, im selben Format wie FOE_DRAW (64x80, Füße bei 32,78).
// Alle Bewegungen laufen über eine Periode g.per mit ganzzahligen Vielfachen, damit Spritesheets nahtlos loopen.
// Braucht nur die Malhelfer aus js/scenes/pixel.js (rng, el, poly, ln, px).

const TAU=Math.PI*2;
// Paletten: [dunkel, mittel, hell, Augen, Leuchten], o = Umriss
const CPAL={
 moor:{n:'Moor',c:['#16241c','#2f4a3a','#5d7a5a','#d8d080','#1a3a10'],o:'#050a06'},
 tiefsee:{n:'Tiefsee',c:['#1a2630','#3e5662','#7f97a0','#7affc8','#0a3a2a'],o:'#04080a'},
 kult:{n:'Kult',c:['#2a0808','#5c1515','#8a2a22','#ffd84a','#4a2808'],o:'#0a0202'},
 leere:{n:'Leere',c:['#120a1c','#2b1048','#5d2a8c','#7affc8','#2a0f52'],o:'#05020a'},
 knochen:{n:'Knochen',c:['#3a3428','#7a7262','#c8c0a0','#ff4a3a','#3a0a0a'],o:'#0a0806'},
 rost:{n:'Rost',c:['#2a1608','#5a3218','#9a5a2a','#9fd8ff','#0a2a3a'],o:'#0a0502'},
 fleisch:{n:'Fleisch',c:['#3a1222','#6a2238','#b04a68','#fff0a0','#5a0a2a'],o:'#0a0206'},
 asche:{n:'Asche',c:['#18181a','#3a3a3e','#6a6a70','#ff9a2a','#4a1a00'],o:'#030303'}
};
const GEN_OPTS={
 plan:{stand:'Zweibeiner',blob:'Klumpen',float:'Schwebend',crawl:'Krabbler',worm:'Wurm'},
 head:{none:'kein Kopf',round:'rund',hood:'Kapuze',fish:'Fischkopf',skull:'Schädel',stalk:'Stielaugen'},
 mouth:{none:'kein Maul',teeth:'Zahnschlitz',maw:'Schlund',beak:'Schnabel'},
 extra:{none:'nichts',lantern:'Angel-Laterne',crown:'Korallenkrone',barnacles:'Seepocken',ribs:'Rippen',halo:'Augenkranz'},
 skin:{plain:'glatt',stripes:'Streifen',spots:'Flecken',scales:'Schuppen'}
};
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const rint=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// Neues Genom aus einer Zahl. lock legt einzelne Bausteine fest (aus den Auswahlfeldern im Labor).
function genCreature(seed,lock={}){const r=rng(seed*7919+13);
 const g={v:1,seed,
  plan:pick(r,Object.keys(GEN_OPTS.plan)),pal:pick(r,Object.keys(CPAL)),
  w:rint(r,8,14),h:rint(r,8,15),leg:rint(r,8,18),
  head:pick(r,Object.keys(GEN_OPTS.head)),hs:rint(r,5,9),
  eyes:pick(r,[1,2,2,2,3,4,5,7]),elay:pick(r,['row','ring','stack','scatter']),es:pick(r,[1,2,2]),
  mouth:pick(r,Object.keys(GEN_OPTS.mouth)),arms:pick(r,[0,2,2,4]),alen:rint(r,10,20),claw:r()<.5,
  tent:pick(r,[0,0,2,3,4,6]),tlen:rint(r,12,26),tfrom:pick(r,['base','face','back']),
  spikes:pick(r,[0,0,3,5,7]),horns:pick(r,[0,0,1,2]),extra:pick(r,Object.keys(GEN_OPTS.extra)),skin:pick(r,Object.keys(GEN_OPTS.skin)),
  asym:r()*.6,mut:r()*.25,per:pick(r,[2,2.4,3]),sway:.5+r()*1.5,ph:r()};
 Object.entries(lock).forEach(([k,v])=>{if(v!==''&&v!=null)g[k]=v;});
 return fixGenome(g);}

// Bausteine, die nicht zusammenpassen, gerade ziehen.
function fixGenome(g){
 if(g.plan==='float'){g.tfrom='base';if(g.tent<3)g.tent=3+(g.seed%4);}
 if(g.plan==='worm'){g.w=Math.min(g.w,9);g.arms=Math.min(g.arms,2);if(g.tfrom==='base')g.tfrom='face';}
 if(g.plan==='crawl'){g.h=Math.min(g.h,10);g.w=Math.max(g.w,11);g.arms=0;}
 if(g.plan==='blob')g.arms=Math.min(g.arms,2);
 g.eyes=clamp(Math.round(g.eyes),1,9);g.tent=clamp(Math.round(g.tent),0,8);
 g.w=clamp(g.w,6,15);g.h=clamp(g.h,6,16);g.leg=clamp(g.leg,6,18);g.hs=clamp(g.hs,4,10);
 return g;}

// Mutation: Zahlen leicht verschieben, mit Wahrscheinlichkeit amt einen Baustein tauschen.
function mutateGenome(src,amt,seed){const r=rng(seed*104729+7);const g={...src,seed:(src.seed*31+seed)%1e6};
 const nudge=(k,d)=>{g[k]=g[k]+Math.round((r()-.5)*2*d*(.4+amt));};
 ['w','h','leg','hs','alen','tlen'].forEach(k=>nudge(k,3));
 const sw=(k,opts)=>{if(r()<amt*.6)g[k]=pick(r,opts);};
 sw('head',Object.keys(GEN_OPTS.head));sw('mouth',Object.keys(GEN_OPTS.mouth));sw('extra',Object.keys(GEN_OPTS.extra));sw('skin',Object.keys(GEN_OPTS.skin));
 sw('elay',['row','ring','stack','scatter']);sw('tfrom',['base','face','back']);
 if(r()<amt*.3)g.plan=pick(r,Object.keys(GEN_OPTS.plan));
 if(r()<amt*.25)g.pal=pick(r,Object.keys(CPAL));
 if(r()<amt)g.eyes+=pick(r,[-1,1,1,2]);if(r()<amt)g.tent+=pick(r,[-2,-1,1,2]);
 if(r()<amt*.5)g.spikes=pick(r,[0,3,5,7]);if(r()<amt*.4)g.horns=pick(r,[0,1,2]);if(r()<amt*.4)g.arms=pick(r,[0,2,4]);
 g.mut=clamp(g.mut+(r()-.3)*amt*.3,0,1);g.asym=clamp(g.asym+(r()-.5)*amt*.4,0,1);
 return fixGenome(g);}

// Kreuzen: jeder Baustein kommt zufällig von einem der Eltern.
function crossGenome(a,b,seed){const r=rng(seed*7+3);const g={};Object.keys(a).forEach(k=>{g[k]=r()<.5?a[k]:b[k];});g.seed=(a.seed+b.seed*7+seed)%1e6;return fixGenome(g);}

const genomeCode=g=>btoa(JSON.stringify(g)).replace(/=+$/,'');
const genomeFrom=s=>fixGenome(JSON.parse(atob(s.trim())));

// ---------- Malen ----------
function shBody(x,cx,cy,rx,ry,P){el(x,cx,cy,rx,ry,P[0]);el(x,cx-rx*.16,cy-ry*.1,rx*.8,ry*.84,P[1]);}
function skin(x,cx,cy,rx,ry,g,P){const r=rng(g.seed+99);const inE=(i,j)=>((i-cx)/(rx*.78))**2+((j-cy)/(ry*.8))**2<1;
 if(g.skin==='stripes'){for(let j=Math.round(cy-ry);j<cy+ry;j++)if((j-Math.round(cy)+40)%4===0)for(let i=Math.round(cx-rx);i<cx+rx;i++)if(inE(i,j))px(x,i,j,P[0]);}
 else if(g.skin==='spots'){for(let k=0;k<5;k++){const a=r()*TAU,d=r()*.6;const X=cx+Math.cos(a)*rx*d,Y=cy+Math.sin(a)*ry*d;el(x,X,Y,1.5,1.2,k%2?P[0]:P[2]);}}
 else if(g.skin==='scales'){for(let j=Math.round(cy-ry);j<cy+ry;j+=2)for(let i=Math.round(cx-rx);i<cx+rx;i++){const o=((j-Math.round(cy))/2)&1?2:0;if((i-Math.round(cx)+o+40)%4===0&&inE(i,j))px(x,i,j,P[2]);}}
 // Glanzpunkt oben links
 el(x,cx-rx*.42,cy-ry*.42,Math.max(1,rx*.18),Math.max(1,ry*.14),P[2]);}

function limb(x,x0,y0,x1,y1,x2,y2,w,col){ln(x,x0,y0,x1,y1,w,col);ln(x,x1,y1,x2,y2,Math.max(1,w-1),col);}
function tentacle(x,X,Y,a,len,w,ph,curl,P,f){for(let j=0;j<len;j++){const q=j/len;a+=Math.sin(f+ph+q*5)*curl*q*.25;X+=Math.cos(a)*1.6;Y+=Math.sin(a)*1.6;const rr=w*(1-q)+.6;el(x,X,Y,rr,rr,j%4===0?P[0]:P[1]);if(j===len-1)px(x,X,Y,P[2]);}}

function eyePts(g,n,cx,cy,rw,rh){const p=[],r=rng(g.seed+7);if(n===1)return[[cx,cy]];
 if(g.elay==='row'){for(let i=0;i<n;i++)p.push([cx-rw+2*rw*i/(n-1),cy+(n>3?((i%2)*2-1):0)]);}
 else if(g.elay==='ring'){for(let i=0;i<n;i++){const a=-Math.PI/2+i/n*TAU;p.push([cx+Math.cos(a)*rw*.75,cy+Math.sin(a)*rh*.75]);}}
 else if(g.elay==='stack'){const rows=Math.ceil(n/2);for(let i=0;i<n;i++){const row=Math.floor(i/2),solo=(i===n-1&&n%2);p.push([solo?cx:cx+(i%2?1:-1)*rw*.5,cy-rh*.6+(rows>1?row*(rh*1.2/(rows-1)):0)]);}}
 else{for(let i=0;i<n;i++){let best=null;for(let k=0;k<12;k++){const a=r()*TAU,d=Math.sqrt(r())*.85;const c=[cx+Math.cos(a)*rw*d,cy+Math.sin(a)*rh*d];const md=Math.min(9,...p.map(q=>Math.hypot(q[0]-c[0],q[1]-c[1])));if(!best||md>best[1])best=[c,md];}p.push(best[0]);}}
 return p;}
function eye(x,ex,ey,s,P,t,g,i,glows){const closed=((t/g.per+g.ph+i*.37)%1)<.06;
 if(s>=2){el(x,ex,ey,2.6,2,'#050505');if(closed){ln(x,ex-2,ey,ex+2,ey,1,P[0]);return;}x.fillStyle=P[3];x.fillRect(Math.round(ex)-1,Math.round(ey)-1,3,2);px(x,ex,ey-1,'#050505');glows.push([ex,ey,P[4],5]);}
 else{el(x,ex,ey,1.6,1.2,'#050505');if(!closed){px(x,ex,ey,P[3]);}}}

function mouthAt(x,g,mx,my,mw,P,f){
 if(g.mouth==='teeth'){x.fillStyle='#0a0606';x.fillRect(Math.round(mx-mw),Math.round(my),Math.round(mw*2),2);x.fillStyle='#e8e2c8';for(let i=Math.round(mx-mw)+1;i<mx+mw;i+=2)x.fillRect(i,Math.round(my),1,1);}
 else if(g.mouth==='maw'){const op=2+Math.max(0,Math.sin(f))*2.5;el(x,mx,my+1,mw*.7,op,'#080204');for(let i=0;i<6;i++){const a=i/6*TAU;px(x,mx+Math.cos(a)*mw*.6,my+1+Math.sin(a)*(op-.5),'#e8e0c0');}}
 else if(g.mouth==='beak'){poly(x,[[mx-mw*.6,my-1],[mx+mw*.6,my-1],[mx,my+4+Math.max(0,Math.sin(f))]],P[2]);ln(x,mx-mw*.5,my,mx+mw*.5,my,1,'#080204');}}

function drawCreature(x,t,g,v={}){
 const P=CPAL[g.pal].c,f=TAU*(t/g.per+g.ph),s1=Math.sin(f),s2=Math.sin(2*f),glows=[],r=rng(g.seed*31+5);
 const br=1+s1*.05,sw=s1*g.sway*.8;let bx=32,by,bw=g.w,bh=g.h*br,hx,hy;
 const seg=[];// Wurm-Segmente
 // Körperbau
 if(g.plan==='stand'){by=78-g.leg-bh*.75;hx=bx+sw;hy=by-bh-g.hs*.55;}
 else if(g.plan==='blob'){bw=g.w+3;by=78-bh;hx=bx+sw*.6;hy=by-bh*.75;}
 else if(g.plan==='float'){by=40+s1*2;hx=bx+sw*.5;hy=by-bh*.8;}
 else if(g.plan==='crawl'){by=78-g.leg*.8-bh*.3;hx=bx+sw*.4;hy=by-bh*.3;}
 else{const n=4+g.h%4,ty=78-(22+g.h*2.2);for(let k=0;k<n;k++){const q=k/(n-1);seg.push([32+Math.sin(f+k*.7)*q*g.sway*3,78-4-q*(78-4-ty)*br,g.w*(1-q*.4)]);}
  const top=seg[seg.length-1];bx=top[0];by=top[1];bw=top[2];bh=bw*.9;hx=bx;hy=by-bh*.5;}
 const headOn=g.head!=='none'&&g.head!=='stalk';
 // 1 Stacheln hinter dem Körper
 for(let i=0;i<g.spikes;i++){const a=-Math.PI*.9+i/(Math.max(1,g.spikes-1))*Math.PI*.8;const X=bx+Math.cos(a)*bw*.85,Y=by+Math.sin(a)*bh*.85;const L=4+(i%2)*3+s2*.5;
  poly(x,[[X-2,Y],[X+2,Y],[X+Math.cos(a)*L,Y+Math.sin(a)*L]],i%2?P[1]:P[2]);}
 // 2 Tentakel vom Rücken
 if(g.tent&&g.tfrom==='back')for(let k=0;k<g.tent;k++){const side=k%2?1:-1;tentacle(x,bx+side*bw*.5,by-bh*.4,-Math.PI/2+side*(.4+k*.12),Math.round(g.tlen*.7),2.5,k*1.7,2,P,f);}
 // 3 Beine
 if(g.plan==='stand'){const hip=by+bh*.6;[-1,1].forEach((s,i)=>{const st=Math.sin(f+i*Math.PI)*1;const fx=bx+s*bw*.45;limb(x,bx+s*bw*.35,hip,fx+s*2,hip+(78-hip)*.5,fx+st,77,3,i?P[0]:P[1]);x.fillStyle=P[0];x.fillRect(Math.round(fx+st-2),77,5,1);});}
 if(g.plan==='crawl'){for(let k=0;k<3;k++)[-1,1].forEach(s=>{const lift=Math.max(0,Math.sin(2*f+k*2.1+(s>0?Math.PI:0)))*2;const kx=bx+s*(bw+5+k*3),ky=by-4-k-lift,fx=bx+s*(bw+2+k*6);limb(x,bx+s*bw*.6,by,kx,ky,fx,78-lift*.5,2,k===1?P[0]:P[1]);});}
 // 4 Körper
 if(g.plan==='worm'){seg.forEach((sg,k)=>{shBody(x,sg[0],sg[1],sg[2],sg[2]*.75,P);if(k%2)ln(x,sg[0]-sg[2]*.6,sg[1],sg[0]+sg[2]*.6,sg[1],1,P[0]);});
  for(let i=0;i<5;i++)ln(x,32-g.w+i*g.w/2,78,32-g.w+i*g.w/2+Math.sin(f+i)*1.5,76,1,P[0]);}
 else shBody(x,bx,by,bw,bh,P);
 if(g.plan==='blob')for(let i=Math.round(bx-bw);i<bx+bw;i+=2)px(x,i+Math.round(Math.sin(f*2+i)*.6),77,P[0]);
 skin(x,bx,by,bw,bh,g,P);
 if(g.extra==='barnacles')for(let k=0;k<7;k++){const a=r()*TAU,d=.3+r()*.5;el(x,bx+Math.cos(a)*bw*d,by+Math.sin(a)*bh*d,1.5,1.2,P[2]);px(x,bx+Math.cos(a)*bw*d,by+Math.sin(a)*bh*d,P[0]);}
 if(g.extra==='ribs')for(let k=-2;k<=2;k++){const Y=by+k*bh*.22;ln(x,bx-bw*.55,Y,bx+bw*.55,Y+Math.abs(k)*.5,1,'#a8a088');}
 // 5 Tentakel unten
 if(g.tent&&g.tfrom==='base'){const y0=g.plan==='float'?by+bh*.6:by+bh*.7;const len=g.plan==='float'?Math.round((78-y0)/1.6):Math.round(g.tlen*.6);
  for(let k=0;k<g.tent;k++){const q=g.tent>1?k/(g.tent-1):.5;tentacle(x,bx+(q-.5)*bw*1.4,y0,Math.PI/2+(q-.5)*.6,len,2.4,k*1.3,1.4,P,f);}}
 // 6 Arme
 if(g.arms){const sy=by-bh*.35;for(let k=0;k<g.arms;k++){const s=k%2?1:-1,row=k>>1;const big=s>0&&g.asym>.45?1.35:1;const L=g.alen*big;const sx=bx+s*bw*.8;
  const ex=sx+s*4,ey=sy+L*.5+row*4+Math.sin(f+k)*1.2,hx2=ex+s*(1+Math.sin(f)*.5),hy2=sy+L+row*3;
  limb(x,sx,sy+row*4,ex,ey,hx2,hy2,Math.round(2+big),row?P[0]:P[1]);
  if(g.claw){[-2,0,2].forEach(o=>ln(x,hx2,hy2,hx2+o,hy2+3,1,P[2]));}}}
 // 7 Kopf
 let er={cx:bx,cy:by-bh*.25,rw:bw*.55,rh:bh*.35};// Augen auf dem Körper, falls kein Kopf
 if(headOn){const hs=g.hs;
  if(g.horns)[-1,1].slice(0,g.horns===1?1:2).forEach((s,i)=>{const X=hx+(g.horns===1?0:s*hs*.6);ln(x,X,hy-hs*.6,X+s*3,hy-hs-4,2,P[2]);ln(x,X+s*3,hy-hs-4,X+s*5,hy-hs-7+s2,1,P[2]);});
  if(g.head==='round'){shBody(x,hx,hy,hs,hs*.9,P);er={cx:hx,cy:hy-hs*.15,rw:hs*.6,rh:hs*.4};mouthAt(x,g,hx,hy+hs*.4,hs*.5,P,f);}
  else if(g.head==='hood'){el(x,hx,hy,hs+1,hs+1.5,P[1]);poly(x,[[hx-hs*.5,hy-hs],[hx+hs*.5,hy-hs],[hx+1,hy-hs*2]],P[1]);el(x,hx+1,hy+1,hs*.6,hs*.7,'#070303');er={cx:hx+1,cy:hy+1,rw:hs*.35,rh:hs*.35};}
  else if(g.head==='fish'){el(x,hx,hy,hs*1.3,hs*.8,P[1]);el(x,hx,hy+hs*.4,hs*1.1,hs*.35,P[0]);poly(x,[[hx-2,hy-hs*.7],[hx+2,hy-hs*.7],[hx,hy-hs*1.5]],P[2]);er={cx:hx,cy:hy-hs*.2,rw:hs*1.1,rh:hs*.25};
   const mm=g.mouth;g.mouth='teeth';mouthAt(x,g,hx,hy+hs*.35,hs*.9,P,f);g.mouth=mm;}
  else if(g.head==='skull'){el(x,hx,hy,hs,hs*.85,'#c8c0a0');el(x,hx+hs*.3,hy,hs*.6,hs*.7,'#a89f80');x.fillStyle='#a89f80';x.fillRect(Math.round(hx-hs*.5),Math.round(hy+hs*.6),Math.round(hs),3);x.fillStyle='#1a1410';for(let i=0;i<hs;i+=2)x.fillRect(Math.round(hx-hs*.5+i),Math.round(hy+hs*.6+1),1,2);
   er={cx:hx,cy:hy-hs*.1,rw:hs*.45,rh:hs*.25};}
  if(g.extra==='crown'){for(let i=0;i<5;i++){const X=hx-hs*.8+i*hs*.4;const L=3+(i%2?2:4);ln(x,X,hy-hs*.8,X+(i-2)*.4,hy-hs*.8-L,1,i%2?'#c84a3a':'#e86a4a');}}}
 if(g.head==='stalk'){const n=Math.min(g.eyes,5);er=null;for(let i=0;i<n;i++){const q=n>1?i/(n-1)-.5:0;const X=bx+q*bw*1.2+Math.sin(f+i*1.3)*1.5,Y=by-bh-5-((i*7)%5)-Math.abs(s1)*1;ln(x,bx+q*bw*.8,by-bh*.6,X,Y,1,P[1]);el(x,X,Y,2.4,2.4,P[2]);eye(x,X,Y,1,P,t,g,i,glows);}
  if(g.eyes>n)eyePts(g,g.eyes-n,bx,by,bw*.5,bh*.3).forEach((p,i)=>eye(x,p[0],p[1],1,P,t,g,i+n,glows));
  mouthAt(x,g,bx,by+bh*.25,bw*.4,P,f);}
 else if(er){eyePts(g,g.eyes,er.cx,er.cy,er.rw,er.rh).forEach((p,i)=>eye(x,p[0],p[1],g.eyes<=3?g.es:1,P,t,g,i,glows));if(!headOn)mouthAt(x,g,bx,by+bh*.25,bw*.4,P,f);}
 // 8 Tentakel aus dem Gesicht
 if(g.tent&&g.tfrom==='face'){const fy=headOn?hy+g.hs*.6:by+bh*.3,fx=headOn?hx:bx;for(let k=0;k<g.tent;k++){const q=g.tent>1?k/(g.tent-1)-.5:0;tentacle(x,fx+q*g.hs,fy,Math.PI/2+q*.5,Math.round(g.tlen*.55),1.4,k*1.1,1.2,P,f);}}
 // 9 Laterne / Augenkranz
 if(g.extra==='lantern'){const ax=(headOn?hx:bx),ay=(headOn?hy-g.hs:by-bh);const tx=ax+8+s1*2,ty=ay-8+s2;ln(x,ax,ay,ax+5,ay-10,1,P[1]);ln(x,ax+5,ay-10,tx,ty,1,P[1]);el(x,tx,ty+1,2,2,'#fff0b0');glows.push([tx,ty+1,'#4a3008',9]);}
 if(g.extra==='halo'){const ax=headOn?hx:bx,ay=(headOn?hy:by-bh*.4);for(let i=0;i<8;i++){const a=i/8*TAU+f*.25;const X=ax+Math.cos(a)*(g.hs+5),Y=ay+Math.sin(a)*(g.hs+3)*.7;if(Math.sin(a)<.2){el(x,X,Y,1.4,1.4,'#050505');px(x,X,Y,P[3]);}}}
 // 10 Mutation: verstreute Zusatzaugen und Wucherungen
 const nm=Math.round(g.mut*6);for(let k=0;k<nm;k++){const a=r()*TAU,d=r()*.7;const X=bx+Math.cos(a)*bw*d,Y=by+Math.sin(a)*bh*d;if(k%3===2){el(x,X,Y,2,1.6,P[2]);px(x,X,Y,P[0]);}else eye(x,X,Y,1,P,t,g,k+20,glows);}
 return glows;}

// Fertiges Bild mit Umriss und Leuchten (für Galerie, Labor und Export).
function renderCreature(c,x,t,g,v={}){x.clearRect(0,0,c.width,c.height);const gl=drawCreature(x,t,g,v);finish(c,x,CPAL[g.pal].o,v.hit>0);gl.forEach(q=>dglow(x,q[0],q[1],q[3]*.7,q[2],.55));}

// Spritesheet: n Bilder einer vollen Periode nebeneinander, loopt nahtlos.
function creatureSheet(g,n=8){const[c,x]=cnv(64*n,80),[fc,fx]=cnv(64,80);for(let i=0;i<n;i++){renderCreature(fc,fx,i/n*g.per,g);x.drawImage(fc,i*64,0);}return c;}

// Kurzbeschreibung fürs Labor.
function describeGenome(g){return`${GEN_OPTS.plan[g.plan]}, ${GEN_OPTS.head[g.head]}, ${g.eyes} Auge${g.eyes>1?'n':''}`+(g.tent?`, ${g.tent} Tentakel`:'')+(g.arms?`, ${g.arms} Arme`:'')+(g.extra!=='none'?`, ${GEN_OPTS.extra[g.extra]}`:'')+` · ${CPAL[g.pal].n}`;}
