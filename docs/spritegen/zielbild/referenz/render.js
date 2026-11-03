// Mini-Renderer für die Ziel-Look-Entwürfe: Formen als Distanzfelder -> Höhe -> Normalen -> Licht -> Palette -> Umriss.
// Genau die Kette, die der Generator später nutzen soll, nur mit von Hand gesetzten Formen.
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v;
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);const bay=(x,y)=>BAY[(y&3)*4+(x&3)];
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
// Formen
const E=(x,y,rx,ry,m,o={})=>({t:'e',x,y,rx,ry,m,...o});
const C=(x1,y1,x2,y2,r1,r2,m,o={})=>({t:'c',x1,y1,x2,y2,r1,r2,m,...o});
const Pg=(v,m,o={})=>({t:'p',v,m,...o});
function sdPoly(px,py,v){let d=(px-v[0][0])**2+(py-v[0][1])**2,s=1;const n=v.length;for(let i=0,j=n-1;i<n;j=i,i++){const ex=v[j][0]-v[i][0],ey=v[j][1]-v[i][1],wx=px-v[i][0],wy=py-v[i][1];const h=clamp((wx*ex+wy*ey)/(ex*ex+ey*ey||1),0,1);const bx=wx-ex*h,by=wy-ey*h;d=Math.min(d,bx*bx+by*by);const c1=py>=v[i][1],c2=py<v[j][1],c3=ex*wy>ey*wx;if((c1&&c2&&c3)||(!c1&&!c2&&!c3))s=-s;}return s*Math.sqrt(d);}
function sd(px,py,p){if(p.t==='p')return[sdPoly(px,py,p.v)-(p.rd||0),p.b??2.5];if(p.t==='e'){const dx=(px-p.x)/p.rx,dy=(py-p.y)/p.ry;const k=Math.hypot(dx,dy);return[(k-1)*Math.min(p.rx,p.ry),Math.min(p.rx,p.ry)];}
 const ax=px-p.x1,ay=py-p.y1,bx=p.x2-p.x1,by=p.y2-p.y1;const h=clamp((ax*bx+ay*by)/(bx*bx+by*by||1),0,1);const r=p.r1+(p.r2-p.r1)*h;return[Math.hypot(ax-bx*h,ay-by*h)-r,r];}
// Kette aus Kapseln (Tentakel, Arme)
function chain(x,y,a,n,len,r0,r1,m,wig,o={}){const out=[];for(let i=0;i<n;i++){const q=i/n;a+=wig(q,i);const nx=x+Math.cos(a)*len,ny=y+Math.sin(a)*len;out.push(C(x,y,nx,ny,r0+(r1-r0)*q,r0+(r1-r0)*(q+1/n),m,o));x=nx;y=ny;}out.end=[x,y];return out;}

function render(img,W,H,groups,st,t){
 const N=W*H,tone=new Float32Array(N),gid=new Int16Array(N).fill(-1),mat=new Array(N),z=new Float32Array(N),dd=new Float32Array(N);
 groups.forEach((g,gi)=>{const k=g.k??3;const pr=g.p;
  // Begrenzungsrahmen
  let x0=W,y0=H,x1=0,y1=0;pr.forEach(p=>{if(p.t==='p'){p.v.forEach(([a,b])=>{x0=Math.min(x0,a-k-1);x1=Math.max(x1,a+k+1);y0=Math.min(y0,b-k-1);y1=Math.max(y1,b+k+1);});return;}const r=p.t==='e'?Math.max(p.rx,p.ry):Math.max(p.r1,p.r2);const xs=p.t==='e'?[p.x]:[p.x1,p.x2],ys=p.t==='e'?[p.y]:[p.y1,p.y2];xs.forEach(v=>{x0=Math.min(x0,v-r-k);x1=Math.max(x1,v+r+k);});ys.forEach(v=>{y0=Math.min(y0,v-r-k);y1=Math.max(y1,v+r+k);});});
  x0=Math.max(0,x0|0);y0=Math.max(0,y0|0);x1=Math.min(W-1,Math.ceil(x1));y1=Math.min(H-1,Math.ceil(y1));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){let D=1e9,R=1,M=null,best=1e9;
   let PF=null,TN=0;for(const p of pr){const[d,r]=sd(x+.5,y+.5,p);if(d<best){best=d;M=p.m;R=r*(p.hz??1);PF=p.pf||g.pf||'dome';TN=p.tone||0;}
    if(D===1e9)D=d;else if(k<=0)D=Math.min(D,d);else{const h=Math.max(k-Math.abs(D-d),0)/k;D=Math.min(D,d)-h*h*k/4;}}
   if(D<0){const i=y*W+x;gid[i]=gi;mat[i]=M;dd[i]=D;tone[i]=TN;const u=-D;z[i]=(PF==='flat'?Math.min(u,1):PF==='bevel'?Math.min(u,R)*.9:(u>=R?R:Math.sqrt(2*R*u-u*u)))*(g.hz??1);}}});
 const L=st.light,Ln=Math.hypot(...L),lx=L[0]/Ln,ly=L[1]/Ln,lz=L[2]/Ln;const d=img.data;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,o=i*4;if(gid[i]<0){d[o+3]=0;continue;}
  const g=gid[i],zz=z[i],zl=x>0&&gid[i-1]===g?z[i-1]:0,zr=x<W-1&&gid[i+1]===g?z[i+1]:0,zu=y>0&&gid[i-W]===g?z[i-W]:0,zd=y<H-1&&gid[i+W]===g?z[i+W]:0;
  let nx=-(zr-zl)/2,ny=-(zd-zu)/2,nz=1;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
  const diff=Math.max(0,nx*lx+ny*ly+nz*lz);let rimOk=true,rimK=0;if(st.rimOuter){rimOk=false;for(let k=1;k<=st.rimOuter;k++){const sx=Math.round(x+st.rimDir[0]*k),sy=Math.round(y+st.rimDir[1]*k);if(sx<0||sy<0||sx>=W||sy>=H||gid[sy*W+sx]<0){rimOk=true;rimK=k;break;}}}const outer=rimOk;const ox=Math.round(x-st.rimDir[0]),oy=Math.round(y-st.rimDir[1]);const thin=ox<0||oy<0||ox>=W||oy>=H||gid[oy*W+ox]<0;const rim=!rimOk?0:Math.pow(1-nz,2)*Math.max(0,nx*st.rimDir[0]+ny*st.rimDir[1]+.3);
  // Kontaktschatten: ein Teil davor wirft einen Strich
  const front=(x>0&&gid[i-1]>g)||(x<W-1&&gid[i+1]>g)||(y>0&&gid[i-W]>g)||(y<H-1&&gid[i+W]>g);
  const c=st.shade(mat[i],diff,rim,x,y,{front,z:zz,depth:-dd[i],nz,tone:tone[i],outer,thin,rimK});d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;}
 // Außenumriss
 if(st.outline){const oc=hx(st.outline);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(gid[i]>=0)continue;if((x>0&&gid[i-1]>=0)||(x<W-1&&gid[i+1]>=0)||(y>0&&gid[i-W]>=0)||(y<H-1&&gid[i+W]>=0)){const o=i*4;d[o]=oc[0];d[o+1]=oc[1];d[o+2]=oc[2];d[o+3]=255;}}}
 return{gid,z};}

// Rampen-Abbildung mit geordnetem Dither
function rampPick(ramp,v,x,y,dither=1){const n=ramp.length-1;const t=clamp(v,0,.9999)*n;const k=Math.floor(t);const f=t-k;return hx(ramp[Math.min(n,f>(dither?bay(x,y):.5)?k+1:k)]);}
// Pixel-Werkzeuge für Details auf dem fertigen Bild
function P(img,W,H){const d=img.data;const set=(x,y,c,a=1)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=W||y>=H)return;const o=(y*W+x)*4;const C=typeof c==='string'?hx(c):c;if(a>=1){d[o]=C[0];d[o+1]=C[1];d[o+2]=C[2];d[o+3]=255;}else if(a>bay(x,y)){d[o]=C[0];d[o+1]=C[1];d[o+2]=C[2];d[o+3]=255;}};
 const add=(x,y,c,a)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=W||y>=H)return;const o=(y*W+x)*4;if(!d[o+3])return;const C=hx(c);d[o]=Math.min(255,d[o]+C[0]*a);d[o+1]=Math.min(255,d[o+1]+C[1]*a);d[o+2]=Math.min(255,d[o+2]+C[2]*a);};
 return{set,add,
  el(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)set(x,y,c);}},
  line(x0,y0,x1,y1,c){const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let k=0;k<=n;k++){const q=k/(n||1);set(x0+(x1-x0)*q,y0+(y1-y0)*q,c);}},
  glow(cx,cy,r,c,a){for(let y=Math.floor(cy-r);y<=cy+r;y++)for(let x=Math.floor(cx-r);x<=cx+r;x++){const q=Math.hypot(x-cx,y-cy)/r;if(q<1){const v=a*(1-q)*(1-q);if(v>bay(x,y)*.9)add(x,y,c,.55);}}},
  get:(x,y)=>{const o=(y*W+x)*4;return d[o+3]?[d[o],d[o+1],d[o+2]]:null;}};}
