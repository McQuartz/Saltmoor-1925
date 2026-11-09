// Fahrt nach vorne (Auftrag 3 M3, docs/auftrag-3/05-oberflaeche.md Abschnitt 6).
// Nach der Wahl des nächsten Knotens fährt die aktuelle Szene 1,2 bis 1,6 s in ihre Weg-Richtung, danach ein kurzer Nebel
// (gedithert in den Nebelfarben des Bioms), dann kommt der Knoten. Das ist eine Fahrt durch die Ebenen, kein Zoom:
// jede Ebene hat eine Nähe p (0 = fern, 1 = nah). Nahe Ebenen werden stärker größer und wandern stärker als ferne.
// Der Boden (alle Ebenen unterhalb des Zielpunkts) fährt in Streifen zu 2 Zeilen: je tiefer im Bild, desto stärker.
// Technik-Vorlage: docs/auftrag-3/vorlagen/saltmoor-kampf-kamera-probe-2.html. Pixel bleiben scharf (kein Glätten, ganze Zielpixel).
// Daten: FAHRT["biom:kulisse"] = {r:'vor'|'links'|'rechts'|'ab'|'auf', ziel:[x,y]} (data/fahrt.json). Fehlt der Eintrag: r 'vor',
// Ziel = Fluchtpunkt der Szene (x 240, y = oberste Bodenreihe − 16, sonst 150).
// Fahrt.bild(ctx, sz, eintrag, t) zeichnet ein Bild der Fahrt (t 0..1) auf ein 480×270-Canvas; die Animation im Spiel und der
// Kontaktbogen (tools/fahrt-bogen.js) benutzen dieselbe Funktion.
const Fahrt=(()=>{
const W=480,H=270,M=12,EW=W+2*M;
const PAR=[.02,.06,.18,.35,.5];            // Nähe der Ebenen 0 bis 4 über dem Boden (Ebene 5 = vorne: NAH)
const XMIX=.45,NAH=.95, BODEN0=.3, ZOOM=.55;         // Nähe von Ebene 5 und des Bodens am Zielpunkt; Stärke der Fahrt (nah: ×2,2 am Ende)
const RICHTUNGEN=['vor','links','rechts','ab','auf'];
const DAUER={vor:1400,links:1600,rechts:1600,ab:1400,auf:1400}; // ms, mit „Übergänge kürzer“ halbiert
const NEBEL_EIN=200,NEBEL_AUS=250;          // ms
const cl=(v,a,b)=>v<a?a:v>b?b:v, sm=t=>{t=cl(t,0,1);return t*t*(3-2*t);};
const ease=t=>.35*t+.65*t*t;                // beginnt ruhig, wird zum Ende schneller

// Eintrag zur Szene: aus data/fahrt.json oder der Vorgabe (r 'vor', Ziel = Fluchtpunkt)
function fluchtpunkt(sz){const ys=(sz&&sz.reihen||[]).map(r=>r.y);return[240,ys.length?cl(Math.min(...ys)-16,110,180):150];}
function eintrag(sz){const tab=typeof FAHRT!=='undefined'?FAHRT:{};const e=sz&&tab[`${sz.biom}:${sz.kulisse}`];
 if(e&&RICHTUNGEN.includes(e.r)&&Array.isArray(e.ziel))return{r:e.r,ziel:[e.ziel[0],e.ziel[1]],aus:'data'};
 const f=fluchtpunkt(sz);return{r:e&&RICHTUNGEN.includes(e.r)?e.r:'vor',ziel:e&&Array.isArray(e.ziel)?[e.ziel[0],e.ziel[1]]:f,aus:'vorgabe'};}
const dauer=(e,kurz)=>(DAUER[e.r]||1400)*(kurz?.5:1);

// Kamera zum Zeitpunkt t: Zoom z (0 bis ZOOM) und Verschiebung je Nähe p
function kamera(r,t){const e=ease(t),d=r==='links'?-1:r==='rechts'?1:0;let z=ZOOM*e,shx=()=>0,shy=()=>0;
 if(d){const rot=sm(t/.35),drift=sm((t-.2)/.8);z=ZOOM*.9*e;
  // erst Drehung: nahe und ferne Ebenen verschieben sich gegenläufig; dann schräg zur Seite weg: nah wandert mehr als fern
  shx=p=>-d*(28*rot*(p-.25)+80*drift*p);}
 if(r==='ab')shy=p=>-34*e*p;if(r==='auf')shy=p=>34*e*p;
 return{z,shx,shy};}

// Eine Ebene (Zeilen ya..yb der Szene) mit Nähe p(y) zeichnen; Streifen: eigene Skala und Verschiebung je Zeilenband
function ebene(ctx,cv,ya,yb,pf,K,zx,zy,px){const sc=y=>1/(1-K.z*pf(y));px=px||pf;
 const Y=y=>zy+(y-zy)*sc(y)+K.shy(pf(y)),y0=Math.round(Y(ya)),y1=Math.round(Y(yb));if(y1<=y0||y0>=H||y1<=0)return;
 const ym=(ya+yb)/2,s=1/(1-K.z*px(ym));let sh=K.shx(px(ym));                // Breite und Seitenverschiebung folgen px (weniger Schräglage stehender Dinge)
 sh=cl(sh,-((W-zx)*(s-1)+M*s),zx*(s-1)+M*s);                     // nie über den Bildrand hinaus
 const x0=Math.round(zx+(-M-zx)*s+sh),x1=Math.round(zx+(W+M-zx)*s+sh);
 ctx.drawImage(cv,0,ya+M,EW,yb-ya,x0,y0,x1-x0,y1-y0);}

function bild(ctx,sz,e,t,opt){opt=opt||{};ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
 const zx=cl(e.ziel[0],0,W),zy=cl(Math.round(e.ziel[1]),60,200),K=kamera(e.r,cl(t,0,1));K.shy=K.shy||(()=>0);
 const Ls=sz.ebenen.map(L=>L.canvas);
 // Ebene 0 und 1 (Ferne) stehen zusätzlich unbewegt darunter: wandert eine nahe Ebene weg, schimmert dahinter die Ferne statt Schwarz durch
 ctx.drawImage(Ls[0],-M,-M);ctx.drawImage(Ls[1],-M,-M);
 ebene(ctx,Ls[0],-M,H+M,()=>PAR[0],K,zx,zy);
 // Ebenen 1 bis 4: über dem Zielpunkt je Ebene eine feste Nähe, darunter (Boden) für alle Ebenen dieselbe Kurve, damit keine Nähte entstehen
 const boden=y=>BODEN0+(NAH-BODEN0)*Math.pow(cl((y-zy)/(H-zy),0,1),.8);
 for(let i=1;i<5;i++){
  ebene(ctx,Ls[i],-M,Math.min(H+M,zy+6),()=>PAR[i],K,zx,zy);       // Block über dem Ziel (reicht 6 Zeilen darunter, deckt Nähte)
  for(let y=zy;y<H+M;y+=2)ebene(ctx,Ls[i],y,Math.min(H+M,y+2),boden,K,zx,zy,yy=>PAR[i]+(boden(yy)-PAR[i])*XMIX*sm((yy-zy)/40)); // Boden in Streifen
 }
 // Animiertes (Flammen, Nebelschwaden …) fährt mit der mittleren Ebene mit
 const mit=(p,f)=>{const s=1/(1-K.z*p),sh=cl(K.shx(p),-((W-zx)*(s-1)+M*s),zx*(s-1)+M*s);ctx.save();ctx.setTransform(s,0,0,s,Math.round(zx*(1-s)+sh),Math.round(zy*(1-s)+K.shy(p)));ctx.imageSmoothingEnabled=false;try{f();}catch(er){}ctx.restore();};
 const kam0={x:0,y:0},ta=opt.t||0;
 if(sz.zeichneAnimiert)mit(PAR[3],()=>sz.zeichneAnimiert(ctx,ta,kam0));
 // Ebene 5 (vorne) und Luft: ganz nah
 ebene(ctx,sz.vorne.canvas,-M,H+M,()=>NAH,K,zx,zy);
 if(sz.zeichneVordergrund)mit(NAH,()=>sz.zeichneVordergrund(ctx,ta,kam0,true));
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;}

// ---- Nebel-Übergang: Dithering in den Nebelfarben des Bioms (kein Weichzeichner) ----
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
let FOG=null;const hexA=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function nebelPalette(biom){const B=typeof BIOMES!=='undefined'&&(BIOMES[biom]||BIOMES.hafen);const n=B&&B.nebel?B.nebel:['#1c2228','#4a5560'];return[hexA(n[0]),hexA(n[1])];}
function nebel(g,f,ph,pal){if(f<=0)return;
 if(!FOG){const c=document.createElement('canvas');c.width=W;c.height=H;FOG={c,x:c.getContext('2d'),id:null};FOG.id=FOG.x.createImageData(W,H);}
 const d=FOG.id.data,sx=new Float32Array(W),sy=new Float32Array(H),sd=new Float32Array(W+H);
 for(let x=0;x<W;x++)sx[x]=Math.sin(x*.021+ph*.8);for(let y=0;y<H;y++)sy[y]=Math.sin(y*.045-ph*.5);for(let i=0;i<W+H;i++)sd[i]=Math.sin(i*.017+ph*.3);
 const dk=pal[0],hl=pal[1];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=(y*W+x)*4,b=(BAY[((y>>1)&3)*4+((x>>1)&3)]+.5)/16,n=(sx[x]+sy[y]+sd[x+y]+3)/6,th=b*.55+n*.45;
  if(th>=f){d[o+3]=0;continue;}
  const hell=n*.7+((BAY[(y&3)*4+(x&3)]+.5)/16)*.3>.5,c=hell?hl:dk;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;}
 FOG.x.putImageData(FOG.id,0,0);g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.imageSmoothingEnabled=false;g.drawImage(FOG.c,0,0);}

// ---- Ablauf im Spiel ----
let A=null;
function ruf(){if(!A||A.gerufen)return;A.gerufen=true;clearTimeout(A.sicher);const f=A.fertig;
 try{if(f)f();}finally{if(A){A.phase='aus';A.t2=performance.now();}}}   // genau einmal; die Fahrt endet auch, wenn der Knoten einen Fehler wirft
function start(fertig){
 if(A){if(typeof fertig==='function')fertig();return;}       // läuft schon eine Fahrt: kein zweiter Knoten, keine zweite Animation
 let sz=null,e=null;
 try{sz=typeof BU!=='undefined'?BU.sz:null;if(sz&&sz.ebenen&&sz.vorne&&typeof BU.g!=='undefined'&&BU.g)e=eintrag(sz);}catch(er){e=null;}
 if(!e){if(typeof fertig==='function')fertig();return;}
 const d=dauer(e,typeof Einst!=='undefined'&&Einst.get('fahrtkurz'));
 A={fertig,sz,e,d,t0:null,phase:'fahrt',f:0,pal:nebelPalette(sz.biom),gerufen:false,sicher:null};
 if(typeof render==='function')try{render();}catch(er){console.warn('Fahrt render',er);}   // Phase ist 'knoten': die Wegwahl verschwindet, die Szene bleibt allein
 A.sicher=setTimeout(ruf,d+NEBEL_EIN+NEBEL_AUS+1500);          // Rückfall, falls das Zeichnen nicht läuft (verdeckter Tab): das Spiel hängt nie
}
// Von der Bühne je Bild aufgerufen. true = die Fahrt hat das Bild gezeichnet (normale Szene auslassen)
function zeichne(g,sz,now,t){if(!A)return false;
 try{return zeichne1(g,now,t);}catch(er){console.warn('Fahrt',er);setTimeout(ruf,0);if(A)A.phase='aus',A.t2=performance.now();return false;}}
function zeichne1(g,now,t){
 if(A.t0==null)A.t0=now;
 if(A.phase==='fahrt'){const q=(now-A.t0)/A.d;if(q<1){A.f=0;bild(g,A.sz,A.e,q,{t});return true;}A.phase='ein';A.t1=now;}
 if(A.phase==='ein'){const q=(now-A.t1)/NEBEL_EIN;bild(g,A.sz,A.e,1,{t});if(q<1){A.f=sm(q);return true;}
  A.f=1;A.phase='warte';setTimeout(ruf,0);return true;}        // voll im Nebel: jetzt den Knoten laden (außerhalb des Bildes, damit ein Fehler die Schleife nicht stoppt)
 if(A.phase==='warte'){A.f=1;bild(g,A.sz,A.e,1,{t});return true;}
 return false;}
// Nach der normalen Szene gezeichnet: Nebel liegt über Fahrt und neuer Szene
function deck(g,now,t){if(!A)return;try{deck1(g,t);}catch(er){console.warn('Fahrt',er);A=null;}}
function deck1(g,t){let f=A.f;
 if(A.phase==='aus'){const q=(performance.now()-A.t2)/NEBEL_AUS;if(q>=1){clearTimeout(A.sicher);A=null;return;}f=1-sm(q);}
 nebel(g,f,t||0,A.pal);}
return{start,bild,eintrag,dauer,zeichne,deck,nebel,nebelPalette,RICHTUNGEN,aktiv:()=>!!A,zustand:()=>A&&{phase:A.phase,f:A.f,r:A.e.r,ziel:A.e.ziel,d:A.d}};
})();
