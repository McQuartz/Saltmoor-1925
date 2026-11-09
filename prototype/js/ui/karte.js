// Auftrag 3, M3: Peilkarte im Nebel, die Ansicht (05-oberflaeche.md Abschnitt 7). Das Netz selbst liegt im Kern (js/core/netz.js), hier wird es nur gezeichnet.
// Liest S.netz, ändert nie etwas. Eingaben: Klick auf einen erreichbaren Knoten ([data-weg] → chooseWeg, siehe eingabe.js), Taste M und der Knopf „Karte“ in der Kopfleiste.
//
// Aufbau: karteModell(N) legt das Netz aus (Knoten, Kanten mit Zustand, Nebelkante), kartenHtml() setzt Zeichenfläche und Klickflächen zusammen,
// karteZeichnen() malt die Zeichenfläche in Pixeln (1 Kartenpixel = 2/3 Szenenpixel, also feiner als die Szenen, gedithert, nichts weichgezeichnet).
// Der Nebel bewegt sich langsam (karteTick). Alles in der Palette des Bioms.
const KW=720,KH=405; // Kartenpixel; 720×405 füllt #szene (480u×270u), ein Kartenpixel ist 2/3 u
let KARTE_AUF=false,KARTE_PH=null;
const KCACHE=new Map();

// ---------- Farben ----------
const khex=c=>{c=String(c||'#000').replace('#','');return[parseInt(c.slice(0,2),16)||0,parseInt(c.slice(2,4),16)||0,parseInt(c.slice(4,6),16)||0];};
const kmix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function kpal(bid){const B=BIOMES[bid]||{};return{k:(B.koerper||['#05070a','#0b1016','#141c26','#22303e']).map(khex),r:(B.rand||['#4a6a8a','#cfe6ff']).map(khex),n:(B.nebel||['#0e1628','#2a3a52']).map(khex),gold:khex('#e8c547')};}

// ---------- Regelbiegung des Bioms (kommt in M5; ohne Biegung bleibt der Platz leer) ----------
function karteBiegung(bid){const id=BIOMES[bid]&&BIOMES[bid].biegung;if(!id)return null;
 const b=typeof Bieg!=='undefined'?Bieg.vomBiom(bid):null;if(!b)return null; // M5: Schalter aus oder Vergleichslauf → kein Hinweis
 return{id,n:b.n||id,t:b.t||'',zeichen:b.zeichen||null};}
function karteBiegungHtml(bid){const b=karteBiegung(bid);if(!b)return'<div class="kbieg"></div>';
 return `<div class="kbieg" data-tip="${esc(`<div class="tn">${esc(b.n)}</div><div>${esc(b.t)}</div>`)}">${b.zeichen?gi(b.zeichen,0):''}<b>${esc(b.n)}</b></div>`;}

// ---------- Auslegung ----------
// Kurve zwischen zwei Punkten: waagerecht heraus, S-förmig hinüber (zwei Kurven zwischen denselben Ebenen kreuzen sich deshalb nie, solange die Reihenfolge stimmt).
// yp (nur Abkürzung): Höhe des Bogens über oder unter der übersprungenen Ebene; steil hinauf, waagerecht darüber, steil hinab
function karteKurve(ax,ay,bx,by,yp=null){const n=Math.max(8,Math.ceil(Math.hypot(bx-ax,by-ay)+(yp==null?0:Math.abs(yp-ay)+Math.abs(yp-by))*1.2)),P=[];
 for(let k=0;k<=n;k++){const t=k/n;let y;
  if(yp==null){const s=t*t*(3-2*t);y=ay+(by-ay)*s;}else y=t<.3?ay+(yp-ay)*Math.sin(Math.PI/2*t/.3):t<.7?yp:by+(yp-by)*Math.cos(Math.PI/2*(t-.7)/.3);
  P.push([ax+(bx-ax)*t,y]);}return P;}

// Modell der Karte für ein Netz N. o: {wahl: erreichbare Knoten anklickbar, mini: kleiner Ausschnitt (Biom-Wahl), W, H}
function karteModell(N,o={}){const mini=!!o.mini,W=o.W||KW,H=o.H||KH;
 const L=N.ebenen.length,sicht=Math.min(L-1,netzSicht(N)),e0=N.pos?N.pos[0]:-1;
 const xc=mini?34:140,ym=mini?76:228,dxMax=mini?62:160,gapMax=mini?32:62,rN=mini?7:20,rA=mini?9:22,rH=mini?4:7,rand=mini?20:58;
 const dx=Math.min(dxMax,(W-rand-xc)/Math.max(1,sicht-e0));
 const hs=e0>1?Math.min(36,(xc-62-16)/(e0-1)):0; // gegangene Ebenen links vom aktuellen Knoten, eng gestaffelt
 const xs=e=>e>=e0?xc+(e-e0)*dx:xc-62-(e0-1-e)*hs;
 const ys=(e,i)=>{const n=N.ebenen[e].length,g=e<e0?gapMax*.6:gapMax;return ym+(i-(n-1)/2)*g;};
 const rv=e=>e<e0?rH:e===e0?rA:rN;
 const gi_=p=>N.gegangen.findIndex(q=>q[0]===p[0]&&q[1]===p[1]);
 const verloren=(e,i)=>e<=e0&&gi_([e,i])<0;
 const nebel=sicht<L-1?xs(sicht)+dx/2:null;
 const nodes=[];
 for(let e=0;e<=sicht;e++)N.ebenen[e].forEach((v,i)=>{const zeigt=netzZeigt(N,e,i);const w=o.wahl&&S.weg?S.weg.findIndex(x=>x.ziel&&x.ziel[0]===e&&x.ziel[1]===i):-1;
  const kn=v.art&&RUN.knoten[v.art];
  nodes.push({e,i,x:xs(e),y:ys(e,i),r:rv(e),art:zeigt?v.art||null:null,glyph:zeigt&&kn?kn.zeichen:null,zeigt,dunkel:!!v.dunkel,aktuell:!!N.pos&&N.pos[0]===e&&N.pos[1]===i,gegangen:gi_([e,i])>=0,verloren:verloren(e,i),wahl:w,spuren:zeigt&&v.spuren!=null&&!v.besucht?v.spuren:null});});
 const kanten=[];
 const start=!N.pos?{x:xc,y:ym,r:mini?9:16}:null;
 if(start)N.ebenen[0].forEach((v,j)=>{const b=nodes.find(n=>n.e===0&&n.i===j);if(!b)return;
  kanten.push({a:null,b:[0,j],z:'normal',blass:false,wahl:b.wahl>=0,kurz:false,pfad:karteKurve(start.x+start.r,start.y,b.x-b.r,b.y)});});
 for(const k of N.kanten){if(k.a[0]>sicht)continue;
  const na=nodes.find(n=>n.e===k.a[0]&&n.i===k.a[1]);const bs=k.b[0]<=sicht;const nb=bs?nodes.find(n=>n.e===k.b[0]&&n.i===k.b[1]):null;
  const bx=bs?nb.x:xs(k.b[0]),by=bs?nb.y:ys(k.b[0],k.b[1]),br=bs?nb.r:rN;
  const ga=gi_(k.a),gb=gi_(k.b);const gegangen=ga>=0&&gb===ga+1;
  let z='normal';if(!bs)z='stumpf';else if(k.bruch&&k.bruch.weg)z='eingestuerzt';else if(gegangen)z='gegangen';else if(k.bruch)z='riss';
  const blass=!gegangen&&(na.verloren||(bs&&nb.verloren));
  let yp=null;
  if(k.kurz){// Abkürzung: Bogen um die übersprungene Ebene herum, am oberen oder unteren Rand
   const mid=k.a[0]+1,n=N.ebenen[mid].length,oben=k.a[1]===0;const ymid=oben?ys(mid,0)-rv(mid)-16:ys(mid,n-1)+rv(mid)+16;
   yp=oben?Math.min(ymid,na.y-10,by-10):Math.max(ymid,na.y+10,by+10);yp=Math.max(mini?8:60,Math.min(H-(mini?8:46),yp));}
  kanten.push({a:k.a,b:k.b,z,blass,wahl:!!o.wahl&&!!N.pos&&N.pos[0]===k.a[0]&&N.pos[1]===k.a[1]&&z!=='eingestuerzt',kurz:!!k.kurz,
   pfad:karteKurve(na.x+na.r,na.y,bx-br,by,yp).filter(p=>z!=='stumpf'||p[0]<=(nebel==null?W:nebel+34))});}
 return{W,H,L,e0,sicht,nebel,dx,start,nodes,kanten,mini};}

// Kleines Netz für den Ausschnitt der Biom-Wahl (Kurzbild: nur die Form, ohne Zeichen; das echte Netz entsteht erst beim Betreten)
function karteMiniNetz(bid){const r=Rng.of(S.seed||1,'kartemini:'+bid);const sz=[r.int(2,3),r.int(2,4),r.int(2,3)];
 const N={ebenen:sz.map(n=>[...Array(n)].map((_,i)=>({i}))),kanten:[],pos:null,gegangen:[],klar:false};
 for(let e=0;e<2;e++)N.kanten.push(...netzVerbinden(e,sz[e],sz[e+1],r));return N;}

// ---------- Zeichnen (Pixel, gedithert) ----------
const KBAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
const kpack=c=>(255<<24)|((c[2]|0)<<16)|((c[1]|0)<<8)|(c[0]|0);
function kput(B,x,y,c,a=1){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=B.W||y>=B.H)return;const i=y*B.W+x;
 if(a>=1){B.d[i]=kpack(c);return;}const p=B.d[i];B.d[i]=kpack([(p&255)+(c[0]-(p&255))*a,((p>>8)&255)+(c[1]-((p>>8)&255))*a,((p>>16)&255)+(c[2]-((p>>16)&255))*a]);}
// Rauschkachel für den Nebel (zwei Oktaven, nahtlos), einmal aus festem Startwert
let KRAUSCH=null;
function krausch(){if(KRAUSCH)return KRAUSCH;const T=128;const mk=c=>{let s=1925+c;const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};const g=[...Array(c*c)].map(rnd);const cs=t=>(1-Math.cos(t*Math.PI))/2;
  return(x,y)=>{const fx=x/T*c,fy=y/T*c,x0=Math.floor(fx),y0=Math.floor(fy),tx=cs(fx-x0),ty=cs(fy-y0);const v=(a,b)=>g[((b%c+c)%c)*c+((a%c+c)%c)];
   return v(x0,y0)*(1-tx)*(1-ty)+v(x0+1,y0)*tx*(1-ty)+v(x0,y0+1)*(1-tx)*ty+v(x0+1,y0+1)*tx*ty;};};
 const a=mk(8),b=mk(16);KRAUSCH=new Uint8Array(T*T);for(let y=0;y<T;y++)for(let x=0;x<T;x++)KRAUSCH[y*T+x]=Math.min(255,(a(x,y)*.62+b(x,y)*.38)*255);return KRAUSCH;}

function kHintergrund(B,pal,m){const{k}=pal,W=B.W,H=B.H;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=Math.max(0,1-Math.hypot((x-W*.3)/(W*.55),(y-H*.5)/(H*.62)));const lv=t*.6;
  B.d[y*W+x]=kpack(lv>KBAYER[(y&3)*4+(x&3)]?k[1]:k[0]);}
 const gs=m.mini?16:24;for(let y=gs;y<H;y+=gs)for(let x=gs;x<W;x+=gs)kput(B,x,y,kmix(k[1],k[3],.55),.8);}

function kRaute(B,cx,cy,r,rahmen,fill,a,hatch){
 for(let dy=-r;dy<=r;dy++)for(let dx=-(r-Math.abs(dy));dx<=r-Math.abs(dy);dx++){const d=Math.abs(dx)+Math.abs(dy);
  if(d===r)kput(B,cx+dx,cy+dy,rahmen,a);else if(d===r-1)kput(B,cx+dx,cy+dy,rahmen,a*.3);
  else if(fill)kput(B,cx+dx,cy+dy,hatch&&((dx+dy)&1)?kmix(fill,rahmen,.18):fill,a*.92);}}
function kRing(B,cx,cy,R,c,a){for(let y=-R-1;y<=R+1;y++)for(let x=-R-1;x<=R+1;x++){const d=Math.hypot(x,y);if(d>=R-.75&&d<R+.9)kput(B,cx+x,cy+y,c,a);}}
function kGlyph(B,cx,cy,key,col,sc,a){const g=GLY[key];if(!g)return;const c=khex(col);const o=Math.floor(9*sc/2);
 g.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch!=='#')return;for(let u=0;u<sc;u++)for(let v=0;v<sc;v++)kput(B,cx-o+i*sc+u,cy-o+j*sc+v,c,a);}));}
const KPFEIL=['.#..#..','..#..#.','...#..#','..#..#.','.#..#..'];
function kPfeil(B,cx,cy,c){KPFEIL.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch==='#')kput(B,cx-3+i,cy-2+j,c,1);}));}

function kKante(B,k,pal,m){const P=k.pfad,n=P.length;if(n<2)return;
 const {r}=pal;let c=r[0],a=.9,on=3,off=3;
 if(k.wahl){c=r[1];a=1;on=3;off=2;}
 if(k.z==='gegangen'){c=kmix(pal.gold,r[1],.3);a=.95;on=6;off=1;}
 if(k.blass)a*=.26;
 const rnd=(()=>{let s=(k.b[0]*131+k.b[1]*17+(k.a?k.a[1]*7:3))>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();
 for(let q=0;q<n;q++){const t=q/(n-1);if((q%(on+off))>=on)continue;
  if(k.z==='eingestuerzt'&&t>.3&&t<.7)continue;
  if(k.z==='riss'&&t>.43&&t<.52)continue;
  let al=a;if(k.z==='stumpf'&&m.nebel!=null)al*=Math.max(.25,1-Math.max(0,P[q][0]-(m.nebel-50))/90);
  kput(B,P[q][0],P[q][1],c,al);}
 if(k.z==='riss'){// feiner Riss: zwei Splitter neben der Lücke, kein Warnzeichen
  const q=Math.floor(n*.475),p0=P[Math.max(0,q-2)],p1=P[Math.min(n-1,q+2)];const L=Math.hypot(p1[0]-p0[0],p1[1]-p0[1])||1,nx=-(p1[1]-p0[1])/L,ny=(p1[0]-p0[0])/L;
  kput(B,P[q][0]+nx*2,P[q][1]+ny*2,c,.7*(k.blass?.3:1));kput(B,P[q][0]-nx*2,P[q][1]-ny*2,c,.7*(k.blass?.3:1));kput(B,P[q][0]+nx*3.4-1,P[q][1]+ny*3.4,c,.4*(k.blass?.3:1));}
 if(k.z==='eingestuerzt'){// verschütteter Pfad: ein Schutthaufen in der Lücke, Brocken daneben
  const f=k.blass?.4:1,staub=kmix([158,128,92],r[0],.3),m=P[Math.floor(n*.5)];
  for(let row=0;row<4;row++){const w=9-row*2;for(let i=0;i<w;i++)if(row===0||rnd()>.18)kput(B,m[0]-(w>>1)+i,m[1]-row+1,row>1?kmix(staub,[255,255,255],.18):kmix(staub,pal.k[3],row*.12),.95*f);}
  for(let j=0;j<12;j++){const q=Math.floor(n*(.32+.36*rnd())),p=P[q];kput(B,p[0]+(rnd()-.5)*3,p[1]+(rnd()-.5)*9,kmix(staub,r[0],rnd()*.5),.9*f);}}
 if(k.kurz){const p=P[Math.floor(n/2)];kPfeil(B,p[0],p[1]-7,kmix(pal.gold,r[1],.35));}}

function kKnoten(B,n,pal,mini){const{k,r}=pal;const a=n.verloren?.3:1;
 const rahmen=!n.zeigt?kmix(r[0],k[0],.45):n.wahl>=0||n.aktuell?r[1]:n.gegangen?kmix(pal.gold,r[1],.4):r[0];
 const fill=!n.zeigt?kmix(k[0],[0,0,0],.55):k[1];
 kRaute(B,n.x,n.y,n.r,rahmen,fill,a,!n.zeigt);
 if(n.zeigt&&n.glyph&&!mini&&n.r>=10)kGlyph(B,n.x,n.y,n.glyph,FXC[n.glyph]||'#ddd',2,a);
 if(n.aktuell)kRing(B,n.x,n.y,n.r+7,pal.gold,1);}

// Spuren (Auftrag 3 M9): Abdrücke, die von unten links auf den Knoten zulaufen. Stufe 0–3: mehr, größer, tiefer. Keine Zahl.
function kSpuren(B,n,pal){const s=n.spuren;if(s==null||n.r<10)return;const zahl=3+s*2,gr=1.2+s*.9,c=kmix(pal.k[0],[20,14,10],.5),rand=kmix(pal.r[0],pal.k[0],.5),a=n.verloren?.35:1;
 for(let j=0;j<zahl;j++){const t=(j+1)/(zahl+1),d=n.r+8+(zahl-j)*(7+s*2.2);const ang=Math.PI*.82;const x=n.x+Math.cos(ang)*d,y=n.y+Math.sin(ang)*d*.55+((j&1)?-1:1)*(3+s);
  const rx=gr*1.4,ry=gr;for(let dy=-Math.ceil(ry)-1;dy<=Math.ceil(ry)+1;dy++)for(let dx=-Math.ceil(rx)-1;dx<=Math.ceil(rx)+1;dx++){const q=(dx/rx)**2+(dy/ry)**2;
   if(q<=1)kput(B,x+dx,y+dy,c,a*(.55+.45*t));else if(q<=1.7&&s>=2)kput(B,x+dx,y+dy,rand,a*.5*t);}
  if(s>=1)for(let z=-1;z<=1;z++)kput(B,x+rx+1.5,y+z*(gr*.8),c,a*.8*t);}}
function karteStatisch(B,m,pal){kHintergrund(B,pal,m);m.kanten.forEach(k=>kKante(B,k,pal,m));m.nodes.forEach(n=>kSpuren(B,n,pal));
 if(m.start){kRing(B,m.start.x,m.start.y,m.start.r,pal.gold,1);kRaute(B,m.start.x,m.start.y,m.mini?3:5,pal.gold,pal.gold,1);}
 m.nodes.forEach(n=>kKnoten(B,n,pal,m.mini));}

// Nebel und leuchtende Punkte, jeder Durchgang (t in Sekunden)
function karteNebel(B,m,pal,t){const T=128,R=krausch(),F=m.nebel;if(F==null)return;const W=B.W,H=B.H,x0=Math.max(0,Math.floor(F-52));
 const o1=Math.floor(t*5),p1=Math.floor(t*1.5),o2=Math.floor(t*-3),p2=Math.floor(t*2);const[n0,n1]=pal.n;const nm=kmix(n0,n1,.55);const c0=kpack(n0),c1=kpack(nm),c2=kpack(n1);
 const span=m.mini?60:96;
 for(let y=0;y<H;y++)for(let x=x0;x<W;x++){const s=(x-(F-52))/span;const d=s<=0?0:s>=1?1:s*s*(3-2*s);if(d<=0)continue;
  const nv=(R[((y+p1)&127)*T+((x+o1)&127)]*.65+R[((y*1+p2+37)&127)*T+((x+o2+61)&127)]*.35)/255;
  const lv=d*(.6+.8*nv)+(KBAYER[(y&3)*4+(x&3)]-.5)*.4;
  if(lv>.84)B.d[y*W+x]=c2;else if(lv>.56)B.d[y*W+x]=c1;else if(lv>.3)B.d[y*W+x]=c0;}}
function kPuls(B,m,pal,t){const a=.3+.45*(.5+.5*Math.sin(t*3));m.nodes.forEach(n=>{if(n.wahl<0)return;const R=n.r+3;
 for(let dx=-R;dx<=R;dx++){const dy=R-Math.abs(dx);kput(B,n.x+dx,n.y+dy,pal.r[1],a);if(dy)kput(B,n.x+dx,n.y-dy,pal.r[1],a);}});}

function karteFrame(cv,t){const st=cv._k;if(!st)return;const B={W:st.W,H:st.H,d:st.u32};st.u32.set(st.basis);
 karteNebel(B,st.m,st.pal,t);kPuls(B,st.m,st.pal,t);cv.getContext('2d').putImageData(st.img,0,0);}

function karteZeichnen(cv){let m,pal,bid;
 if(cv.dataset.mini){bid=cv.dataset.mini;m=karteModell(karteMiniNetz(bid),{W:cv.width,H:cv.height,mini:true});pal=kpal(bid);}
 else{const N=S.netz;if(!N)return;bid=N.biom;m=karteModell(N,{wahl:cv.dataset.modus==='haupt'&&S.phase==='weg'});pal=kpal(bid);}
 const sig=bid+'|'+cv.width+'|'+JSON.stringify(m);let basis=KCACHE.get(sig);
 if(!basis){const B={W:cv.width,H:cv.height,d:new Uint32Array(cv.width*cv.height)};karteStatisch(B,m,pal);basis=B.d;KCACHE.set(sig,basis);if(KCACHE.size>8)KCACHE.delete(KCACHE.keys().next().value);}
 const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;const img=ctx.createImageData(cv.width,cv.height);
 cv._k={m,pal,basis,img,u32:new Uint32Array(img.data.buffer),W:cv.width,H:cv.height};karteFrame(cv,performance.now()/1000);}
// Der Nebel bewegt sich langsam: nur eine Animation, im Autospieler (FAST) ohne Bedeutung
setInterval(()=>{if(document.hidden||(typeof FAST!=='undefined'&&FAST))return;const t=performance.now()/1000;document.querySelectorAll('.kartecv').forEach(cv=>karteFrame(cv,t));},140);

// ---------- HTML ----------
function kartenHtml(modus){const N=S.netz;if(!N)return'';const haupt=modus==='haupt';const m=karteModell(N,{wahl:haupt&&S.phase==='weg'});
 const px=v=>(v/KW*100).toFixed(3)+'%',py=v=>(v/KH*100).toFixed(3)+'%';
 const kn=m.nodes.map(n=>{const g=2*n.r+8;const st=`left:${px(n.x)};top:${py(n.y)};width:${px(g)};height:${py(g)}`;
  const cls=['kn',n.wahl>=0?'wahl':'',n.aktuell?'aktuell':'',n.gegangen?'gegangen':'',n.verloren?'verloren':'',n.zeigt?'':'leer'].filter(Boolean).join(' ');
  const da=`data-e="${n.e}" data-i="${n.i}"${n.zeigt&&n.art?` data-art="${n.art}"`:''}`;
  return n.wahl>=0?`<button class="${cls}" ${da} data-weg="${n.wahl}" style="${st}" aria-label="${esc(RUN.knoten[n.art].n)}"></button>`:`<div class="${cls}" ${da} style="${st}"></div>`;}).join('');
 const st=m.start?`<div class="kstart" style="left:${px(m.start.x)};top:${py(m.start.y)};width:${px(2*m.start.r+8)};height:${py(2*m.start.r+8)}"></div>`:'';
 const wort=m.nebel!=null?`<div class="kwort" style="left:${px((m.nebel+KW)/2+8)};top:${py(m.H*.52)}">UNKARTIERT</div>`:'';
 const a=RUN.akte[S.akt],eb=a.ebenen.length;
 const ueber=`${a.n.toUpperCase()} · ${esc(biom().kurz).toUpperCase()} · EBENE ${Math.min(S.ebene+1,eb)}/${eb}`;
 const geo=jobFaehigkeit()==='karte'?`<span class="kgeo">Die alte Karte: ${RUN.akte.map((a,i)=>S.route[i]?(i===S.akt?`<b>${esc(BIOMES[S.route[i]].kurz)}</b>`:esc(BIOMES[S.route[i]].kurz)):a.biome.filter(b=>BIOMES[b]).map(b=>BIOMES[b].kurz).join('/')).join(' → ')}</span>`:'';
 const satz=haupt&&S.phase==='weg'?`<div class="kz">${N.pos?'Wähle den nächsten Abschnitt.':'Wähle den ersten Abschnitt.'} Leuchtende Punkte kannst du anklicken.</div>`:'';
 return `<div class="peil ${modus}" data-modus="${modus}"><canvas class="kartecv" data-modus="${modus}" width="${KW}" height="${KH}"></canvas>${wort}${st}${kn}
  <div class="kfuss"><div class="kl">${satz}<div class="ku">${ueber}${geo}</div></div>${karteBiegungHtml(N.biom)}</div></div>`;}

// Ausschnitt für die Biom-Wahl: Kurzbild, Name steht im Aufrufer
function karteMiniHtml(bid){return `<div class="kbild"><canvas class="kartecv mini" data-mini="${bid}" width="240" height="150"></canvas><div class="kwort mini">UNKARTIERT</div></div>`;}

// Beim Drüberfahren: was der Knoten ist (Knotenart und Hinweis). Dunkle, noch unsichtbare Knoten sagen nichts.
function karteTip(el){if(el.classList.contains('kbieg'))return el.dataset.tip||'';
 if(el.classList.contains('kstart'))return'<div class="tn">Aufbruch</div>';
 if(el.classList.contains('leer'))return'';const N=S.netz;const v=N&&N.ebenen[+el.dataset.e]&&N.ebenen[+el.dataset.e][+el.dataset.i];if(!v||!RUN.knoten[v.art])return'';
 const fz=v.foes&&v.art==='waechter'?FOES[v.foes[0]]:null;
 return `<div class="tn">${esc(RUN.knoten[v.art].n)}</div><div class="hint">${esc(v.hint)}</div>${fz?`<div>${esc(fz.n)}. Hinter ihm führt eine Treppe nach unten.</div>`:''}${v.foes&&jobFaehigkeit()==='karte'&&v.art.startsWith('kampf')?`<div>${v.foes.map(id=>esc(FOES[id].n)).join(', ')}</div>`:''}${typeof Dev!=='undefined'&&Dev.an&&v.foes?`<div class="hint">${v.foes.join(', ')}</div>`:''}`;}

// ---------- Überlagerung (Taste M, Knopf in der Kopfleiste) ----------
const karteDarf=()=>!!(S.netz&&S.route&&S.netz.akt===S.akt&&!['titel','figur','biomwahl','uebergang','strand','ende','ankunft','weg'].includes(S.phase));
function karteUmschalten(){if(KARTE_AUF){KARTE_AUF=false;karteNach();return;}
 const ov=document.getElementById('overlay');if(!karteDarf()||(ov&&ov.classList.contains('an')))return;
 KARTE_AUF=true;KARTE_PH=S.phase;if(typeof hideTip==='function')hideTip();karteNach();}
function karteZu(){if(KARTE_AUF){KARTE_AUF=false;karteNach();}}
// Von render() gerufen: Überlagerung setzen oder entfernen, alle Zeichenflächen malen
function karteNach(){const sz=document.getElementById('szene');
 if(KARTE_AUF&&(!karteDarf()||S.phase!==KARTE_PH))KARTE_AUF=false;
 document.body.classList.toggle('karte-auf',KARTE_AUF);
 let ov=document.getElementById('kartenueber');
 if(!sz){}else if(KARTE_AUF){if(!ov){ov=document.createElement('div');ov.id='kartenueber';sz.appendChild(ov);}ov.style.display='block';const h=kartenHtml('ueber');if(ov._h!==h){ov.innerHTML=h;ov._h=h;}}
 else if(ov&&ov.style.display!=='none'){ov.style.display='none';ov.innerHTML='';ov._h=null;}
 document.querySelectorAll('.kartecv').forEach(karteZeichnen);}
