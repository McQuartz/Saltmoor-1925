// ===================== PIXEL-SZENE =====================
const W=320,H=180;
const cv=document.getElementById('scene');const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
const bay=(x,y)=>BAY[((y|0)&3)*4+((x|0)&3)];
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function cnv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;return[c,x];}
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function vgrad(x,y0,y1,cols,x0=0,x1=W){const cs=cols.map(hx),n=cs.length-1,w=x1-x0,h=y1-y0,id=x.getImageData(x0,y0,w,h),d=id.data;
 for(let y=0;y<h;y++){const t=y/Math.max(1,h-1)*n;const k=Math.min(n-1,Math.floor(t)),f=t-k;for(let i=0;i<w;i++){const c=f>bay(i+x0,y+y0)?cs[k+1]:cs[k];const p=(y*w+i)*4;d[p]=c[0];d[p+1]=c[1];d[p+2]=c[2];d[p+3]=255;}}
 x.putImageData(id,x0,y0);}
function dither(x,x0,y0,w,h,col,f){x.fillStyle=col;for(let j=y0;j<y0+h;j++)for(let i=x0;i<x0+w;i++){if(f(i,j)>bay(i,j))x.fillRect(i,j,1,1);}}
function px(x,X,Y,col){x.fillStyle=col;x.fillRect(Math.round(X),Math.round(Y),1,1);}
function el(x,cx,cy,rx,ry,col){x.fillStyle=col;const R=Math.ceil(ry);for(let j=-R;j<=R;j++){const w=rx*Math.sqrt(Math.max(0,1-(j*j)/(ry*ry||1)));if(w<.5&&j!==0)continue;x.fillRect(Math.round(cx-w),Math.round(cy+j),Math.max(1,Math.round(w*2)),1);}}
function poly(x,pts,col){x.fillStyle=col;let y0=1e9,y1=-1e9;pts.forEach(p=>{y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);});
 for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const xs=[],yc=y+.5;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
  xs.sort((p,q)=>p-q);for(let i=0;i+1<xs.length;i+=2){const s=Math.round(xs[i]),e=Math.round(xs[i+1]);if(e>s)x.fillRect(s,y,e-s,1);}}}
function ln(x,x0,y0,x1,y1,w,col){x.fillStyle=col;const n=Math.ceil(Math.hypot(x1-x0,y1-y0));const s=Math.max(1,Math.round(w));for(let k=0;k<=n;k++){const t=k/(n||1);x.fillRect(Math.round(x0+(x1-x0)*t-s/2),Math.round(y0+(y1-y0)*t-s/2),s,s);}}
function tree(x,r,X,Y,len,ang,w,d,col){const ex=X+Math.cos(ang)*len,ey=Y+Math.sin(ang)*len;ln(x,X,Y,ex,ey,w,col);if(d<=0)return;const k=2+(r()<.35?1:0);
 for(let i=0;i<k;i++)tree(x,r,ex,ey,len*(.58+r()*.22),ang+(r()-.5)*1.25,Math.max(1,w*.62),d-1,col);}
function dglow(x,cx,cy,r,col,a){x.save();x.globalCompositeOperation='lighter';x.fillStyle=col;const R=Math.ceil(r);
 for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const d=Math.sqrt(i*i+j*j)/r;if(d>=1)continue;const v=a*(1-d)*(1-d);const X=Math.round(cx+i),Y=Math.round(cy+j);if(v>bay(X,Y))x.fillRect(X,Y,1,1);}x.restore();}
function fogTex(col,h,dens,seed){const[c,x]=cnv(W*2,h);const k=Math.PI*2/(W*2);
 dither(x,0,0,W*2,h,col,(i,j)=>{const v=.45+.3*Math.sin(i*k*3+seed)+.25*Math.sin(i*k*7+j*.25+seed*2);return v*Math.sin(j/h*Math.PI)*dens;});return c;}
function drawFog(x,tex,y,t,speed){const o=-((t*speed)%(W*2)+W*2)%(W*2);x.drawImage(tex,Math.round(o),y);x.drawImage(tex,Math.round(o+W*2),y);}
const VIG=(()=>{const[c,x]=cnv(W,H);dither(x,0,0,W,H,'#000',(i,j)=>{const dx=(i-W/2)/(W/2),dy=(j-H/2)/(H/2);return Math.max(0,dx*dx*.55+dy*dy*.75-.5)*1.5;});return c;})();

// --- Portal ---
const PCOL=['#1e0a30','#3d1866','#6b2fb0','#9b5de5','#c7a2ff','#7affc8','#9b5de5','#3d1866'];
function portal(x,cx,cy,rx,ry,t){
 el(x,cx,cy,rx*.9,ry*.9,'#040108');
 for(let i=0;i<46;i++){const a=i*2.39+t*(.5+(i%5)*.12);const rr=1-(((i*37)%100)/100+t*.18)%1;x.fillStyle=['#2b1048','#5d2a8c','#7affc8','#3d1866'][i%4];x.fillRect(Math.round(cx+Math.cos(a)*rx*.85*rr),Math.round(cy+Math.sin(a)*ry*.85*rr),1,1);}
 const step=Math.max(.6,140/Math.max(rx,ry))/2;
 for(let k=0;k<360;k+=step){const a=k*Math.PI/180;const wob=1+.045*Math.sin(a*5+t*2)+.02*Math.sin(a*9-t*3);
  for(let th=0;th<3;th++){const rr=(1+th*.07)*wob;const ci=((Math.floor(k/24+t*4+th*2))%PCOL.length+PCOL.length)%PCOL.length;x.fillStyle=PCOL[ci];x.fillRect(Math.round(cx+Math.cos(a)*rx*rr),Math.round(cy+Math.sin(a)*ry*rr),1,1);}}
 dglow(x,cx,cy,Math.max(rx,ry)*1.9,'#2a0f52',.55);}

