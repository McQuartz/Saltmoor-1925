// Auftrag 3 M8: Die Farbe im Bild (docs/auftrag-3/06-lovecraft-kern.md Abschnitt 6). Reine Darstellung, liest S.farbe und it.spuren, ändert nie etwas.
// Schimmern: ein Canvas in Bildgröße über jedem Item-Bild mit data-fuid. Ein wanderndes Bayer-Muster färbt Pixel des Item-Umrisses
// in den fünf Schimmer-Stufen von ST.X (zyklisch, langsam), nur Pixelfarben, kein Weichzeichner, keine Alpha-Verläufe.
// Gebunden: dasselbe Bild, aber starr und kantig (feste Facetten in den hellen Stufen, keine Bewegung).
// Spur: je Spur eine Linie von einem Pixel in ST.X.c quer über das ganze Item-Bild.
const FarbeUI=(()=>{
 const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
 const masken={};          // src -> {w,h,a:Uint8Array, kante:Uint8Array} oder 'lade'
 let phase=0,timer=null,geplant=false;
 const XC=()=>(ST.X&&ST.X.c)||'#c800ff';
 const STUFEN=()=>(ST.X&&ST.X.schimmer)||[XC()];
 function maske(src,fertig){const m=masken[src];if(m&&m!=='lade')return m;if(m==='lade')return null;masken[src]='lade';
  const im=new Image();im.onload=()=>{const w=im.naturalWidth,h=im.naturalHeight;const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0);
   let d;try{d=x.getImageData(0,0,w,h).data;}catch(e){delete masken[src];return;}
   const a=new Uint8Array(w*h),k=new Uint8Array(w*h);for(let i=0;i<w*h;i++)a[i]=d[i*4+3]>128?1:0;
   const dicht=(i,j)=>i>=0&&j>=0&&i<w&&j<h&&a[j*w+i];
   for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(a[j*w+i]&&!(dicht(i-1,j)&&dicht(i+1,j)&&dicht(i,j-1)&&dicht(i,j+1)))k[j*w+i]=1;
   masken[src]={w,h,a,kante:k};scan();};im.onerror=()=>{delete masken[src];};im.src=src;return null;}
 // Linie von (x0,y0) nach (x1,y1), jeder Pixel einzeln
 function linie(x0,y0,x1,y1,f){let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;for(;;){f(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
 // Zeichnet ein Overlay: art 'schimmer' | 'kristall' | null, spuren: Anzahl
 function malen(cv,m,art,spuren){const w=m.w,h=m.h;if(cv.width!==w)cv.width=w;if(cv.height!==h)cv.height=h;const x=cv.getContext('2d');x.clearRect(0,0,w,h);
  const S5=STUFEN();const n=S5.length;
  if(art==='schimmer'){
   for(let j=0;j<h;j++)for(let i=0;i<w;i++){const p=j*w+i;if(!m.a[p])continue;
    const b=BAY[(j&3)*4+(i&3)];const wel=(Math.sin((i+j)*.42-phase*.45)+1)/2;       // wandernde Welle über dem Bild
    const lv=Math.min(n-1,Math.floor(wel*n));
    if(m.kante[p]){if(wel>b*.85){x.fillStyle=S5[lv];x.fillRect(i,j,1,1);}}
    else if(wel>.88&&b<.3){x.fillStyle=S5[Math.max(0,lv-2)];x.fillRect(i,j,1,1);}}
  }else if(art==='kristall'){
   // Starr und kantig: Umriss in festen Blöcken der hellen Stufen, die Fläche in scharfkantigen Rauten (Facetten) der dunklen und mittleren Stufen
   const hell=[S5[Math.min(n-1,2)],S5[Math.min(n-1,3)],S5[n-1]];
   for(let j=0;j<h;j++)for(let i=0;i<w;i++){const p=j*w+i;if(!m.a[p])continue;
    const blk=((i>>2)+(j>>2))%3;
    if(m.kante[p]){x.fillStyle=hell[blk];x.fillRect(i,j,1,1);continue;}
    const ra=Math.floor((i+j)/5),rb=Math.floor((i-j+96)/5);const f=(ra*3+rb*5)%4;
    if((i+j)%5===0||(i-j+96)%5===0){x.fillStyle=hell[(ra+rb)%3];x.fillRect(i,j,1,1);}
    else if(f===1||f===2){x.fillStyle=S5[f-1];x.fillRect(i,j,1,1);}}
  }
  if(spuren){x.fillStyle=XC();for(let s=0;s<spuren;s++){const y0=Math.round(h*(.3+.17*s))%h,y1=Math.round(h*(.78-.15*s))%h;
   linie(0,y0,w-1,y1,(i,j)=>x.fillRect(i,j,1,1));}}}
 function zustand(img){const uid=+img.dataset.fuid;const it=typeof itemByUid==='function'?itemByUid(uid):null;if(!it)return{};
  const F=typeof S!=='undefined'?S.farbe:null;const hier=!!(F&&F.uid===uid);
  return{art:hier?(F.gebunden?'kristall':'schimmer'):null,spuren:(it.spuren&&it.spuren.length)||0};}
 function scan(){geplant=false;if(typeof S==='undefined'||!S||!S.route)return;
  document.querySelectorAll('img[data-fuid]').forEach(img=>{const z=zustand(img);const p=img.parentNode;
   let cv=img.nextElementSibling&&img.nextElementSibling.classList.contains('fb-ov')?img.nextElementSibling:null;
   if(!z.art&&!z.spuren){if(cv)cv.remove();return;}
   const m=maske(img.getAttribute('src'));if(!m)return;
   if(!cv){cv=document.createElement('canvas');cv.className='fb-ov';cv.setAttribute('aria-hidden','true');img.insertAdjacentElement('afterend',cv);}
   if(getComputedStyle(p).position==='static')p.style.position='relative';
   cv.style.left=img.offsetLeft+'px';cv.style.top=img.offsetTop+'px';cv.style.width=img.offsetWidth+'px';cv.style.height=img.offsetHeight+'px';
   cv.dataset.art=z.art||'';cv._m=m;cv._z=z;malen(cv,m,z.art,z.spuren);});}
 function tick(){phase++;document.querySelectorAll('canvas.fb-ov').forEach(cv=>{if(cv._m&&cv._z&&cv._z.art==='schimmer')malen(cv,cv._m,'schimmer',cv._z.spuren);});}
 function plane(){if(geplant)return;geplant=true;setTimeout(scan,0);}
 function start(){if(timer||typeof FAST!=='undefined'&&FAST)return;timer=setInterval(tick,180);}
 if(typeof document!=='undefined'){const los=()=>{new MutationObserver(plane).observe(document.body,{childList:true,subtree:true});plane();start();};
  if(document.body)los();else document.addEventListener('DOMContentLoaded',los);}
 return{scan,tick,
  // Das Zeichen X klein neben den Stoffen einer Karte
  zeichen(){return gi('X',typeof KZ==='function'?KZ():18);},
  setPhase(p){phase=p;tick();}};
})();
