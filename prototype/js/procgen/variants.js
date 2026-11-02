// ===================== VARIANTEN AUS EINEM BASIS-SPRITE =====================
// Nimmt ein fertiges Sprite (handgezeichneter Gegner, Generator-Gegner oder hochgeladenes Bild)
// und legt ein "Rezept" darüber: Farben tauschen, Augen aufsetzen, Stacheln und Fäden wachsen lassen,
// Ränder wegfaulen lassen, größer machen. Keine KI, nur Zufall mit festem Seed.
// Ein statisches Bild bekommt seine Animation über Verformung (Wiegen + Atmen, Füße bleiben stehen).

const VAR_KINDS={hue:'Farbvariante',mutant:'Mutant',rot:'Verrottet',elite:'Elite'};

// Maske und Umriss eines Bildes, daraus werden Augen- und Stachelpositionen gewählt.
function analyzeSprite(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data,m=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++)m[i]=d[i*4+3]>110?1:0;const inside=[],edge=[];let dark=null,dl=1e9;
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;if(!m[p])continue;
  const l=d[p*4]+d[p*4+1]+d[p*4+2];if(l<dl&&l>15){dl=l;dark=[d[p*4],d[p*4+1],d[p*4+2]];}
  let nx=0,ny=0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const X=x+i,Y=y+j;if(X<0||Y<0||X>=w||Y>=h||!m[Y*w+X]){nx+=i;ny+=j;}}
  if(nx||ny){if(!m[p-1]||!m[p+1]||!m[p-w]||!m[p+w])edge.push([x,y,Math.atan2(ny,nx)]);}
  else inside.push([x,y]);}
 return{w,h,m,inside,edge,dark:dark?`rgb(${dark})`:'#111'};}

function genVariant(seed,kind,strength,info){const r=rng(seed*613+kind.length);const k=strength;
 const v={kind,seed,dark:info.dark,hue:0,ramp:null,sat:1,eyes:[],spikes:[],strands:[],rot:0,scale:1,glow:false};
 const pickIn=()=>info.inside.length?info.inside[Math.floor(r()*info.inside.length)]:[32,50];
 const top=info.edge.filter(e=>Math.sin(e[2])<-.3),side=info.edge.filter(e=>Math.abs(Math.cos(e[2]))>.6&&e[1]<info.h-10);
 if(kind==='hue'){v.hue=(60+r()*240)|0;v.sat=.8+r()*.6;if(r()<.5)v.ramp=pick(r,Object.keys(CPAL));if(r()<k)v.eyes=[...Array(1+Math.floor(r()*2))].map(pickIn);}
 if(kind==='mutant'){v.eyes=[...Array(2+Math.floor(r()*5*k))].map(pickIn);
  v.spikes=[...Array(Math.round(3+r()*8*k))].map(()=>{const e=top[Math.floor(r()*top.length)]||[32,20,-Math.PI/2];return[e[0],e[1],e[2]+(r()-.5)*.5,3+r()*6*k];});
  v.strands=[...Array(Math.round(r()*4*k))].map(()=>{const e=side[Math.floor(r()*side.length)]||[20,50,Math.PI];return[e[0],e[1],e[2],8+r()*12,r()*6];});
  if(r()<.5)v.hue=((r()-.5)*90)|0;}
 if(kind==='rot'){v.rot=.25+k*.45;v.sat=.45;v.hue=((r()-.5)*40)|0;v.ramp=r()<.5?'asche':null;if(r()<.6)v.strands=[...Array(2+Math.round(r()*2))].map(()=>{const e=info.edge[Math.floor(r()*info.edge.length)]||[32,60,Math.PI/2];return[e[0],e[1],Math.PI/2+(r()-.5)*.6,6+r()*10,r()*6];});}
 if(kind==='elite'){v.scale=1.15+k*.1;v.glow=true;v.ramp=pick(r,['kult','leere','rost','fleisch']);v.eyes=[...Array(1+Math.floor(r()*3))].map(pickIn);v.spikes=[...Array(4)].map(()=>{const e=top[Math.floor(r()*top.length)]||[32,20,-Math.PI/2];return[e[0],e[1],e[2],4+r()*4];});}
 return v;}

function describeVariant(v){const p=[VAR_KINDS[v.kind]];if(v.ramp)p.push('Palette '+CPAL[v.ramp].n);else if(v.hue)p.push(`Farbton ${v.hue>0?'+':''}${v.hue}°`);if(v.eyes.length)p.push(v.eyes.length+' Zusatzaugen');if(v.spikes.length)p.push(v.spikes.length+' Stacheln');if(v.strands.length)p.push(v.strands.length+' Fäden');if(v.rot)p.push('Fäulnis '+Math.round(v.rot*100)+'%');if(v.scale>1)p.push('×'+v.scale.toFixed(2));return p.join(' · ');}

// Farben: Farbton drehen oder auf eine Palette abbilden (nach Helligkeit, mit Dither).
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2;if(M===m)return[0,0,l];const d=M-m,s=l>.5?d/(2-M-m):d/(M+m);let h=M===r?(g-b)/d+(g<b?6:0):M===g?(b-r)/d+2:(r-g)/d+4;return[h/6,s,l];}
function hsl2rgb(h,s,l){if(!s){const v=l*255;return[v,v,v];}const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;const f=t=>{t=(t%1+1)%1;return 255*(t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p);};return[f(h+1/3),f(h),f(h-1/3)];}
function recolor(id,v){const d=id.data;const ramp=v.ramp?[CPAL[v.ramp].o,...CPAL[v.ramp].c.slice(0,3)].map(hx):null,acc=v.ramp?hx(CPAL[v.ramp].c[3]):null;
 for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;let[h,s,l]=rgb2hsl(d[i],d[i+1],d[i+2]);
  if(ramp){if(s>.55&&l>.45){d[i]=acc[0];d[i+1]=acc[1];d[i+2]=acc[2];continue;}// leuchtende Stellen (Augen) bleiben Akzent
   const p=i/4,x=p%id.width,y=(p/id.width)|0;const t=Math.min(.999,l*1.9)*(ramp.length-1);const k=Math.floor(t);const c=(t-k)>bay(x,y)?ramp[Math.min(k+1,ramp.length-1)]:ramp[k];d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];}
  else{const c=hsl2rgb(h+v.hue/360,Math.min(1,s*v.sat),l);d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];}}}

// Ein Bild der Variante: base(x,t) malt das rohe Sprite (ohne Umriss) in den Arbeits-Canvas.
function renderVariant(c,x,t,base,v,outline='#000'){const w=c.width,h=c.height;x.clearRect(0,0,w,h);
 const f=TAU*(t/2.4);
 if(v.scale!==1){const[tc,tx]=VWORK(w,h);tx.clearRect(0,0,w,h);base(tx,t);const s=v.scale;x.drawImage(tc,0,0,w,h,Math.round(w/2-w*s/2),Math.round(h-h*s),Math.round(w*s),Math.round(h*s));}
 else base(x,t);
 // hinter dem Körper: Stacheln und Fäden
 x.save();x.globalCompositeOperation='destination-over';
 v.spikes.forEach((s,i)=>{const L=s[3]+Math.sin(f*2+i)*.6;poly(x,[[s[0]+Math.cos(s[2]+1.57)*1.6,s[1]+Math.sin(s[2]+1.57)*1.6],[s[0]-Math.cos(s[2]+1.57)*1.6,s[1]-Math.sin(s[2]+1.57)*1.6],[s[0]+Math.cos(s[2])*L,s[1]+Math.sin(s[2])*L]],v.dark||'#1a1a1a');});
 v.strands.forEach((s,i)=>{let X=s[0],Y=s[1],a=s[2];for(let j=0;j<s[3];j++){a+=Math.sin(f+s[4]+j*.3)*.08;X+=Math.cos(a);Y+=Math.sin(a);px(x,X,Y,j%3?(v.dark||'#1a1a1a'):'#3a4a3a');}});
 x.restore();
 const id=x.getImageData(0,0,w,h);if(v.hue||v.ramp||v.sat!==1)recolor(id,v);
 if(v.rot){const d=id.data,R=v.seed*7;for(let y=0;y<h;y++)for(let i=0;i<w;i++){const p=(y*w+i)*4;if(!d[p+3])continue;const n=.5+.3*Math.sin(i*.9+R)*Math.sin(y*.7+R*1.3)+.2*Math.sin(i*2.3+y*1.9+R);
   const nearEdge=(i>0&&!d[p-1])||(i<w-1&&!d[p+7])||(y>0&&!d[p-w*4+3])||(y<h-1&&!d[p+w*4+3]);
   if(nearEdge&&n<v.rot*.8)d[p+3]=0;else if(n<v.rot*.55){d[p]*=.45;d[p+1]*=.5;d[p+2]*=.45;}else if(n>1-v.rot*.25&&(i+y)%2){d[p]=Math.min(255,d[p]+40);d[p+1]=Math.min(255,d[p+1]+50);d[p+2]=Math.min(255,d[p+2]+30);}}}
 x.putImageData(id,0,0);
 const glows=[];const acc=v.ramp?CPAL[v.ramp].c[3]:'#ffd84a';
 v.eyes.forEach((e,i)=>{const closed=((t/2.4+i*.29)%1)<.07;el(x,e[0],e[1],1.6,1.2,'#050505');if(!closed){px(x,e[0],e[1],acc);if(v.glow)glows.push([e[0],e[1]]);}});
 finish(c,x,outline,false);
 glows.forEach(q=>dglow(x,q[0],q[1],4,v.ramp?CPAL[v.ramp].c[4]:'#4a3008',.7));}
const VWORK=(()=>{let k=null;return(w,h)=>{if(!k||k[0].width!==w||k[0].height!==h)k=cnv(w,h);return k;};})();

// ---------- eigenes Bild ----------
// Hintergrund entfernen (Farbe der Ecken), auf 64x80 verkleinern, auf wenige Farben reduzieren.
function spriteFromImage(img,maxColors=14){const sw=img.naturalWidth||img.width,sh=img.naturalHeight||img.height;
 const[sc,sx]=cnv(sw,sh);sx.drawImage(img,0,0);const id=sx.getImageData(0,0,sw,sh),d=id.data;
 // Hintergrund: Flutfüllung von den Ecken mit Toleranz, falls das Bild keine Transparenz hat
 const hasAlpha=[0,sw-1,(sh-1)*sw,sh*sw-1].some(p=>d[p*4+3]<200);
 if(!hasAlpha){const seen=new Uint8Array(sw*sh),st=[0,sw-1,(sh-1)*sw,sh*sw-1];const ref=[d[0],d[1],d[2]];
  const near=p=>Math.abs(d[p*4]-ref[0])+Math.abs(d[p*4+1]-ref[1])+Math.abs(d[p*4+2]-ref[2])<60;
  while(st.length){const p=st.pop();if(seen[p]||!near(p))continue;seen[p]=1;d[p*4+3]=0;const x=p%sw,y=(p/sw)|0;if(x>0)st.push(p-1);if(x<sw-1)st.push(p+1);if(y>0)st.push(p-sw);if(y<sh-1)st.push(p+sw);}}
 let x0=sw,y0=sh,x1=0,y1=0;for(let y=0;y<sh;y++)for(let x=0;x<sw;x++)if(d[(y*sw+x)*4+3]>110){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 sx.putImageData(id,0,0);if(x1<x0){x0=0;y0=0;x1=sw-1;y1=sh-1;}
 const bw=x1-x0+1,bh=y1-y0+1,s=Math.min(56/bw,74/bh);const tw=Math.max(1,Math.round(bw*s)),th=Math.max(1,Math.round(bh*s));
 const[out,ox]=cnv(64,80);ox.imageSmoothingEnabled=true;ox.imageSmoothingQuality='high';ox.drawImage(sc,x0,y0,bw,bh,Math.round(32-tw/2),78-th,tw,th);
 // Farben reduzieren (einfaches k-means), damit es nach Pixel-Art aussieht
 const od=ox.getImageData(0,0,64,80),q=od.data,px_=[];for(let i=0;i<q.length;i+=4)if(q[i+3]>110)px_.push(i);
 if(px_.length){let cent=[...Array(Math.min(maxColors,px_.length))].map((_,k)=>{const i=px_[Math.floor(k/maxColors*px_.length)];return[q[i],q[i+1],q[i+2]];});
  const asg=new Uint8Array(px_.length);for(let it=0;it<6;it++){const sum=cent.map(()=>[0,0,0,0]);px_.forEach((i,n)=>{let b=0,bd=1e9;cent.forEach((c,k)=>{const dd=(q[i]-c[0])**2+(q[i+1]-c[1])**2+(q[i+2]-c[2])**2;if(dd<bd){bd=dd;b=k;}});asg[n]=b;const S=sum[b];S[0]+=q[i];S[1]+=q[i+1];S[2]+=q[i+2];S[3]++;});cent=cent.map((c,k)=>sum[k][3]?[sum[k][0]/sum[k][3],sum[k][1]/sum[k][3],sum[k][2]/sum[k][3]]:c);}
  px_.forEach((i,n)=>{const c=cent[asg[n]];q[i]=c[0];q[i+1]=c[1];q[i+2]=c[2];q[i+3]=255;});}
 for(let i=3;i<q.length;i+=4)if(q[i]<=110)q[i]=0;ox.putImageData(od,0,0);return out;}

// Statisches Bild lebendig machen: oben mehr wiegen als unten, leicht atmen. Loopt über 2,4 s.
function wobbleBase(img){return(x,t)=>{const f=TAU*(t/2.4),sy=1+Math.sin(f)*.03,w=img.width,h=img.height;
 for(let y=0;y<h;y++){const src=Math.round(h-2-(h-2-y)/sy);if(src<0||src>=h)continue;const k=1-y/h;const o=Math.round(Math.sin(f+y*.06)*k*k*2.2);x.drawImage(img,0,src,w,1,o,y,w,1);}};}
