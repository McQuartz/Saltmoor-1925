// Auftrag 4 (Phase 0): Bausteine der Oberfläche im Pixelraster, übernommen aus docs/auftrag-4/vorlagen/look-runde-7.
// 9-Slice-Rahmen (border-image, 12 × 12 Pixel, Rand 4) mit Fase und Randlicht in Zonenfarbe, Rauten 11 und 13, Schild, Zipfel,
// Fußleiste mit Schultern. Alle Bilder entstehen hier einmal als Pixelbild (data:-URL) und liegen als CSS-Variablen auf :root.
// Die Zonenfarbe (Randlicht) kommt aus dem Biom: BIOMES[id].rand[1] hell, rand[0] dunkel. Messing bleibt an Karten, Rauten und Schlagwort-Marken.
const BST={zone:null,fuss:{},form:null};
const bstHex=h=>{h=String(h||'#000');if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];};
const bstMisch=(a,b,t)=>{const A=bstHex(a),B=bstHex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
function pxc(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,(a,b,cw,ch,col)=>{x.fillStyle=col;x.fillRect(a,b,cw||1,ch||1);});return c.toDataURL();}
// 9-Slice: außen schwarz mit abgeschrägten Ecken, Kante, Fläche, oben Randlicht, unten dunkle Kante
function slice9({fill,rim,edge,dark,out}){return pxc(12,12,(x,p)=>{p(0,0,12,12,out||'#000');p(1,1,10,10,edge);p(2,2,8,8,fill);p(2,1,8,1,rim);p(1,2,1,1,rim);p(10,2,1,1,rim);p(2,10,8,1,dark);
 x.clearRect(0,0,1,1);x.clearRect(11,0,1,1);x.clearRect(0,11,1,1);x.clearRect(11,11,1,1);p(1,1,1,1,out||'#000');p(10,1,1,1,out||'#000');p(1,10,1,1,out||'#000');p(10,10,1,1,out||'#000');});}
const bmp=(rows,pal)=>pxc(rows[0].length,rows.length,(x,p)=>rows.forEach((r,y)=>[...r].forEach((c,i)=>{if(pal[c])p(i,y,1,1,pal[c]);})));
const RAUTE13=a=>pxc(13,13,(x,p)=>{for(let y=0;y<13;y++){const w=6-Math.abs(6-y);p(6-w,y,w*2+1,1,'#000');if(w>0)p(7-w,y,w*2-1,1,a?(y<6?'#ffe9a6':'#c8a24a'):(y<6?'#3a3226':'#241e16'));}if(a)p(6,2,1,1,'#fff');});
const RAUTE11=a=>pxc(11,11,(x,p)=>{for(let y=0;y<11;y++){const w=5-Math.abs(5-y);p(5-w,y,w*2+1,1,'#000');if(w>0)p(6-w,y,w*2-1,1,a?(y<5?'#ffe9a6':'#c8a24a'):(y<5?'#3a3226':'#241e16'));}if(a)p(5,2,1,1,'#fff');});
// Kosten-Raute der Karte, rot (teurer) oder grün (günstiger)
const RAUTE13F=(hell,dunkel)=>pxc(13,13,(x,p)=>{for(let y=0;y<13;y++){const w=6-Math.abs(6-y);p(6-w,y,w*2+1,1,'#000');if(w>0)p(7-w,y,w*2-1,1,y<6?hell:dunkel);}});
const SCHILD=(b,B)=>bmp(['.###########.','#bbbbbbbbbbb#','#bBBBBBBBBBb#','#bBBBBBBBBBb#','#bBBBBBBBBBb#','#bBBBBBBBBBb#','#bBBBBBBBBBb#','#bBBBBBBBBBb#','.#bBBBBBBBb#.','.#bBBBBBBBb#.','..#bBBBBBb#..','...#bBBBb#...','....#bBb#....','.....#b#.....','......#......'],{'#':'#000','b':b,'B':B});
// Bayer-Raster 4 × 4 für Schatten unter der Leiste
const DITHER=()=>pxc(4,4,(x,p)=>{[[0,0],[2,2],[2,0],[0,2],[1,1],[3,3],[3,1],[1,3]].forEach(([a,b])=>p(a,b,1,1,'#000'));});

// ---------- Fußleiste mit Schultern (Runde 6/7): Mitte 18 hoch unter der Hand, Schultern 44 hoch, 118 breit, Randlicht oben ----------
const FUSS={top:190,mitte:252,schulter:226,wl:118,wr:362};
function fussBild(form,rim,rimd){const key=form+rim;if(BST.fuss[key])return BST.fuss[key];
 const {top:FTOP,mitte:mid,schulter:sh,wl,wr}=FUSS;const H=270-FTOP;const top=new Int16Array(480);
 for(let x=0;x<480;x++){let y=mid;
  if(form==='K'){const a=wl-16,b=wl+14,c=wr-14,d=wr+16;
   if(x<=a)y=sh;else if(x<b){const t=(x-a)/(b-a);y=sh+(mid-sh)*(1-Math.cos(Math.PI*t))/2;}
   else if(x>=d)y=sh;else if(x>c){const t=(d-x)/(d-c);y=sh+(mid-sh)*(1-Math.cos(Math.PI*t))/2;}}
  else{const f=4;if(x<=wl)y=sh+(x>wl-f?x-(wl-f):0);else if(x>=wr)y=sh+(x<wr+f?(wr+f)-x:0);
   if(x>wl&&x<wl+f)y=Math.min(mid,mid-(wl+f-x));if(x<wr&&x>wr-f)y=Math.min(mid,mid-(x-(wr-f)));}
  top[x]=Math.round(y);}
 const c=document.createElement('canvas');c.width=480;c.height=H;const g=c.getContext('2d');const id=g.createImageData(480,H),d=id.data;
 const set=(x,y,col)=>{if(x<0||x>=480||y<0||y>=H)return;const o=(y*480+x)*4;const v=bstHex(col);d[o]=v[0];d[o+1]=v[1];d[o+2]=v[2];d[o+3]=255;};
 const inn=(x,y)=>x>=0&&x<480&&y+FTOP>=top[x];
 for(let y=0;y<H;y++)for(let x=0;x<480;x++){if(!inn(x,y)){if(inn(x,y+1)||inn(x-1,y)||inn(x+1,y))set(x,y,'#000');continue;}
  let col=((x*97+y*31)%53<3)?'#141118':'#0d0b0e';
  if(!inn(x,y-1))col=rim;else if(!inn(x,y-2))col=rimd;else if(!inn(x,y-3))col='#000';
  else if(!inn(x-1,y)||!inn(x+1,y))col='#2e2834';
  set(x,y,col);}
 g.putImageData(id,0,0);return BST.fuss[key]={src:c.toDataURL(),top};}
// Form der Schultern: eckig (Standard) oder geschwungen, Schalter in den Einstellungen
const fussForm=()=>typeof Einst!=='undefined'&&Einst.get('schultern_geschwungen')?'K':'E';

// ---------- Zonenlicht: alle Rahmen mit Randlicht in der Farbe des Bioms ----------
const BST_FEST={};
function bausteineFest(){if(BST_FEST.ok)return;BST_FEST.ok=1;const R=document.documentElement.style,u=v=>`url(${v})`;
 R.setProperty('--s9karte',u(slice9({fill:'#141119',rim:'#c8a24a',edge:'#3a3240',dark:'#000'})));
 R.setProperty('--s9hg',u(slice9({fill:'#14122a',rim:'#9a8cff',edge:'#3a3460',dark:'#000'})));
 R.setProperty('--s9fenster',u(slice9({fill:'#1c1822',rim:'#000',edge:'#0a080c',dark:'#3a3240'})));
 R.setProperty('--s9ruecken',u(slice9({fill:'#1a1520',rim:'#c8a24a',edge:'#3a3240',dark:'#000'})));
 R.setProperty('--s9glied',u(slice9({fill:'#0c0a08',rim:'#3a3226',edge:'#2a2420',dark:'#000'})));
 R.setProperty('--s9gliedl',u(slice9({fill:'#0c0a08',rim:'#f1ede2',edge:'#c8c0b0',dark:'#000'})));
 R.setProperty('--s9knopfx',u(slice9({fill:'#0e0d10',rim:'#2a2630',edge:'#1e1b22',dark:'#000'})));
 R.setProperty('--raute',u(RAUTE13(1)));R.setProperty('--rauteaus',u(RAUTE13(0)));
 R.setProperty('--raute11',u(RAUTE11(1)));R.setProperty('--raute11aus',u(RAUTE11(0)));
 R.setProperty('--rautehoch',u(RAUTE13F('#ffb0a0','#d8584a')));R.setProperty('--rautetief',u(RAUTE13F('#c8ffe8','#5ac898')));
 R.setProperty('--schild',u(SCHILD('#cfe6ff','#3f78c0')));R.setProperty('--schildaus',u(SCHILD('#6a7a90','#22303e')));
 R.setProperty('--dither',u(DITHER()));}
function zonenLicht(biom){bausteineFest();const B=(typeof BIOMES!=='undefined'&&BIOMES[biom])||{rand:['#2e5a4a','#7dffc4']};const rim=(B.rand&&B.rand[1])||'#7dffc4',rimd=bstMisch((B.rand&&B.rand[0])||'#2e5a4a','#000',.35);
 const key=biom+rim+fussForm();if(BST.zone===key)return;BST.zone=key;const R=document.documentElement.style,u=v=>`url(${v})`;
 R.setProperty('--zone',rim);BST.rim=rim;R.setProperty('--zone2',rimd);
 R.setProperty('--s9plak',u(slice9({fill:'#0e0c12',rim,edge:'#2e2834',dark:'#000'})));
 R.setProperty('--s9ziel',u(slice9({fill:bstMisch(rim,'#0e0c12',.9),rim:bstMisch(rim,'#ffffff',.6),edge:rim,dark:'#000'})));
 R.setProperty('--s9panel',u(slice9({fill:'#0c0b0f',rim,edge:'#2e2834',dark:'#000'})));
 R.setProperty('--s9knopf',u(slice9({fill:'#16131a',rim,edge:'#3a3340',dark:'#000'})));
 R.setProperty('--s9knopfh',u(slice9({fill:bstMisch(rim,'#16131a',.85),rim:bstMisch(rim,'#ffffff',.6),edge:bstMisch(rim,'#3a3340',.6),dark:'#000'})));
 R.setProperty('--s9knopfd',u(slice9({fill:'#0f1412',rim:rimd,edge:'#2e2834',dark:bstMisch(rim,'#16131a',.85)})));
 R.setProperty('--zipfel',u(bmp(['######','#oooo#','.#oo#.','..##..'],{'#':'#000','o':rim})));
 R.setProperty('--zipfelz',u(bmp(['######','#oooo#','.#oo#.','..##..'],{'#':'#000','o':bstMisch(rim,'#ffffff',.6)})));
 const F=fussBild(fussForm(),rim,rimd);R.setProperty('--fussbild',u(F.src));}
// Pixelzeichen (9 × 9, js/ui/zeichen.js) als Hintergrund eines Elements, scharf skaliert
const icoStil=(k,col)=>typeof glyph==='function'?`--i:url(${glyph(k,col)})`:'';
