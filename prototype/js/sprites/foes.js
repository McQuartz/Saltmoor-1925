// --- Gegner-Zeichner (64x80, Füße bei 32,78) ---
const FOE_DRAW={
 cultist(x,t){const s=Math.sin(t*1.8),hx=32+s*.8;
  poly(x,[[19,78],[45,78],[40,44],[24,44]],'#4a1010');poly(x,[[34,78],[45,78],[40,44],[35,44]],'#300a0a');
  ln(x,27,52,24,77,1,'#360b0b');ln(x,31,50,30,77,1,'#360b0b');ln(x,38,52,40,77,1,'#220707');
  for(let i=19;i<45;i+=3){x.fillStyle='#260707';x.fillRect(i+Math.round(Math.sin(t*3+i)*.7),77,2,1);}
  poly(x,[[25,48],[22,62],[31,64],[33,56]],'#5c1515');poly(x,[[39,48],[42,62],[33,64],[31,56]],'#3e0d0d');
  x.fillStyle='#c8b090';x.fillRect(29,62,6,2);x.fillStyle='#d8d0b0';x.fillRect(31,56,2,6);
  const fl=Math.sin(t*21)+Math.sin(t*13);x.fillStyle='#ff9a2a';x.fillRect(31,52+(fl>0?0:1),2,4);px(x,31,54,'#fff2a0');
  el(x,hx,35,10,11,'#601717');poly(x,[[hx-4,26],[hx+4,26],[hx+1,18]],'#601717');el(x,hx+1,37,6,7,'#070303');
  if((t%4.3)>.14){px(x,hx-2,37,'#ffd84a');px(x,hx+3,37,'#ffd84a');}
  x.fillStyle='#b08a3a';x.fillRect(30,69,5,1);x.fillRect(32,67,1,5);
  for(let j=27;j<44;j+=2)px(x,hx-10+Math.abs(j-35)*.25,j,'#8a2a22');
  return[[32,54,'#4a2808',12]];},
 fishman(x,t){const b=Math.round(Math.sin(t*3)),g=Math.sin(t*5)>.3;
  poly(x,[[23,78],[28,78],[29,66],[25,63]],'#24392c');poly(x,[[36,78],[41,78],[39,63],[35,66]],'#1b2c22');x.fillStyle='#2f4a38';x.fillRect(21,77,8,1);x.fillRect(35,77,9,1);
  el(x,32,57+b,13,13,'#2f4a3a');el(x,29,59+b,8,9,'#5d7a5a');for(let j=52;j<70;j+=3)ln(x,24,j+b,33,j+b,1,'#4d6a4a');
  for(let i=0;i<4;i++)poly(x,[[38+i,44+i*4+b],[47+i,41+i*4+b],[41+i,48+i*4+b]],'#6f8f5a');
  ln(x,21,51+b,15,71+b,3,'#2a4232');ln(x,43,51+b,48,71+b,3,'#22372a');x.fillStyle='#c8d0b0';[13,15,17].forEach(X=>x.fillRect(X,72+b,1,3));[46,48,50].forEach(X=>x.fillRect(X,72+b,1,3));
  el(x,31,38+b,12,9,'#3d5f48');el(x,31,43+b,9,4,'#2a4232');poly(x,[[26,30+b],[31,22+b],[36,30+b]],'#6f8f5a');
  x.fillStyle='#0b0f0c';x.fillRect(23,42+b,16,2);x.fillStyle='#e8e2c8';for(let i=24;i<39;i+=2)x.fillRect(i,42+b,1,1);
  el(x,20,35+b,4,4,'#d8d080');el(x,42,34+b,4,4,'#d8d080');x.fillStyle='#080808';x.fillRect(20,35+b,2,2);x.fillRect(42,34+b,2,2);
  x.fillStyle=g?'#a04a4a':'#1b2c22';x.fillRect(36,47+b,4,1);x.fillRect(36,49+b,4,1);
  if((t*1.3)%2<1){x.fillStyle='#9fd8d0';x.fillRect(30,44+b,1,2+Math.floor((t*1.3%1)*5));}
  return[];},
 drowned(x,t){const s=Math.sin(t*1.2);
  poly(x,[[25,78],[30,78],[30,66],[26,66]],'#4a5a64');poly(x,[[35,78],[40,78],[39,66],[35,66]],'#3e4c56');
  el(x,32,54,13,16,'#6f8590');el(x,29,52,8,11,'#8ea2a8');[[36,58],[27,62],[34,48]].forEach(p=>el(x,p[0],p[1],2,1.5,'#56687a'));
  ln(x,20,44,17+s,68,3,'#6f8590');ln(x,44,44,47+s,68,3,'#5f7580');
  el(x,32,31+s*.5,8,9,'#a2b4b6');el(x,29,30+s*.5,2,2.5,'#0a0e10');el(x,35,30+s*.5,2,2.5,'#0a0e10');px(x,29,30+s*.5,'#7affc8');px(x,35,30+s*.5,'#7affc8');el(x,32,36+s*.5,2,2.5,'#0a0e10');
  for(let k=0;k<7;k++){const sx=24+k*2.6;x.fillStyle=k%2?'#2f5a32':'#4f7f3a';for(let j=0;j<16+k*3;j++){x.fillRect(Math.round(sx+Math.sin(t*1.5+j*.3+k)*1.6),22+(k%2)*2+j,1,1);}}
  return[];},
 shade(x,t){for(let k=0;k<17;k++){const f=k/17;const cx=32+Math.sin(t*1.3+k*.7)*5*f+Math.sin(t*.7)*2;const cy=76-k*3.1;const rr=11-f*5+Math.sin(t*3+k)*1.2;el(x,cx,cy,rr,rr*.8,k%3?'#120a1c':'#1f1032');}
  for(let k=0;k<5;k++)ln(x,24+k*4,72,22+k*4+Math.sin(t*2+k)*3,79,1,'#1f1032');
  const hy=26+Math.sin(t*1.3);x.fillStyle='#7affc8';x.fillRect(28+Math.round(Math.sin(t*.7)*2),Math.round(hy),2,1);x.fillRect(35+Math.round(Math.sin(t*.7)*2),Math.round(hy),2,1);
  return[[32,27,'#0a3a2a',8]];},
 // Der Endgegner hat mehrere Entwürfe, siehe BOSS_VARIANTS unten. data/foes.json legt mit "variant" fest, welcher im Spiel kommt.
 boss(x,t,v){return(BOSS_VARIANTS[v.variant]||BOSS_VARIANTS.eye)(x,t,v);}
};

// --- Boss-Entwürfe (160x140, Boden bei y=138). Jeder Entwurf gibt Leucht-Punkte [x,y,farbe,radius] zurück. ---
// Neuer Entwurf: Funktion hier eintragen, in BOSS_INFO beschreiben, dann erscheint er automatisch in gallery.html.
const BOSS_INFO={
 eye:{n:'Das Auge im Grund',d:'Tentakelmasse mit einem riesigen Auge, das dem Mauszeiger folgt. Kleine Augen blinzeln.'},
 maw:{n:'Der Schlund',d:'Ein Maul im Boden mit Zahnringen, aus dem Zungen tasten. Atmet, öffnet sich weit vor einem Angriff.'},
 king:{n:'Der ertrunkene König',d:'Riesige Gestalt in verrottetem Mantel, Krone aus Korallen, Gesicht aus Seetang. Laterne als Herz.'}
};
const BOSS_VARIANTS={
 eye(x,t,v){
  for(let k=0;k<9;k++){const base=k/8;const ax=80+(base-.5)*96;let X=ax,Y=138;const a0=-Math.PI/2+(base-.5)*1.8;
   for(let j=0;j<38;j++){const f=j/38;const a=a0+Math.sin(t*1.4+k*1.7+f*4)*.7*f;X+=Math.cos(a)*2.3;Y+=Math.sin(a)*2.3;const rr=6*(1-f)+1;el(x,X,Y,rr,rr,j%4===0?'#3a1a4a':'#22102e');if(j%5===2&&rr>2.5)px(x,X,Y,'#a06ab0');}}
  el(x,80,98,42,32,'#170a20');el(x,80,92,35,26,'#24102f');for(let i=0;i<14;i++)px(x,50+i*4,96+Math.sin(i)*6,'#3a1a4a');
  [[52,78],[108,76],[60,104],[100,106],[80,112]].forEach((p,i)=>{el(x,p[0],p[1],3,2.4,'#0a0510');if((t+i*1.3)%3.7>.2){px(x,p[0],p[1],'#ffd84a');px(x,p[0]-1,p[1],'#a8822a');}});
  el(x,80,80,27,20,'#0e0614');
  if((t%5.2)>.18){el(x,80,80,24,17,'#d8cfa8');[[60,76,70,80],[98,74,90,79],[66,90,74,86],[96,88,88,84]].forEach(l=>ln(x,l[0],l[1],l[2],l[3],1,'#a83a3a'));
   const dx=v.lx||0,dy=v.ly||0;el(x,80+dx*9,80+dy*5,12,12,'#1f8a62');el(x,80+dx*9,80+dy*5,9,9,'#7affc8');x.fillStyle='#050505';x.fillRect(Math.round(79+dx*10),Math.round(71+dy*5),3,18);x.fillStyle='#fff';x.fillRect(Math.round(74+dx*9),Math.round(75+dy*5),2,2);}
  else ln(x,56,80,104,80,2,'#3a1a4a');
  return[[80,80,'#0a3a2a',40]];},
 maw(x,t,v){const br=Math.sin(t*1.1),op=.55+.45*Math.max(0,Math.sin(t*.6))+(v.lunge>0?.4:0);
  el(x,80,128,76,14,'#0c0610');el(x,80,124,70,12,'#1a0c22');
  for(let k=0;k<6;k++){const s=k<3?-1:1,base=k%3;let X=80+s*(30+base*14),Y=124;let a=-Math.PI/2+s*(.5+base*.25);
   for(let j=0;j<30;j++){const f=j/30;a+=Math.sin(t*1.7+k*2+f*5)*.09;X+=Math.cos(a)*2.4;Y+=Math.sin(a)*2.4;el(x,X,Y,4*(1-f)+1,4*(1-f)+1,j%3?'#3a1222':'#5a1a30');if(j%6===3)px(x,X,Y,'#d86a8a');}}
  const ry=16+op*22+br*2;el(x,80,96,48+br*2,ry+8,'#2a0e1e');el(x,80,96,44+br*2,ry+4,'#4a1426');el(x,80,96,38,ry,'#08020a');
  for(let ring=0;ring<3;ring++){const rx=36-ring*9,rr=ry-ring*(ry/4);const n=18-ring*4;for(let i=0;i<n;i++){const a=i/n*6.283+t*.3*(ring%2?-1:1);const X=80+Math.cos(a)*rx,Y=96+Math.sin(a)*rr;
    const ix=80+Math.cos(a)*(rx-6),iy=96+Math.sin(a)*(rr-5);ln(x,X,Y,ix,iy,2,ring?'#b8ac88':'#e8e0c0');}}
  dglow(x,80,96,14,'#5a0a2a',.6);
  const tl=Math.sin(t*2.3);let X=80,Y=100;for(let j=0;j<20;j++){X+=Math.sin(t*2+j*.4)*1.4;Y-=1.6*op;el(x,X,Y,3.5-j*.12,3-j*.1,j%2?'#c85a7a':'#a84060');}
  [[40,70],[120,72],[30,104],[130,106]].forEach((p,i)=>{if((t+i)%4.1>.2){el(x,p[0],p[1],2.5,2,'#0a0408');px(x,p[0],p[1],'#ff4a6a');}});
  return[[80,96,'#3a0a1a',38]];},
 king(x,t,v){const s=Math.sin(t*.9),b=Math.round(s*1.5),L=v.lunge>0?Math.sin((1-v.lunge/.38)*Math.PI)*6:0;
  poly(x,[[30,138],[130,138],[112,60+b],[48,60+b]],'#1a2830');poly(x,[[80,138],[130,138],[112,60+b],[86,60+b]],'#12202a');
  for(let i=32;i<130;i+=4){const h=Math.round(Math.sin(t*2+i)*2);x.fillStyle=i%8?'#0e181e':'#22343c';x.fillRect(i,134+h,3,4);}
  for(let k=0;k<9;k++)ln(x,52+k*7,66+b,46+k*8+Math.sin(t+k)*2,132,1,k%2?'#2c4048':'#0c161c');
  ln(x,48,68+b,24-L,100,7,'#1e3038');ln(x,24-L,100,18-L,118,5,'#2a3e46');ln(x,112,68+b,138+L,96,7,'#16242c');ln(x,138+L,96,144+L,114,5,'#22343c');
  [[18,118],[144,114]].forEach(p=>{for(let f=-2;f<=2;f++)ln(x,p[0]-L*(p[0]<80?1:-1),p[1],p[0]+f*3-L*(p[0]<80?1:-1),p[1]+8,1,'#a8b8b0');});
  el(x,80,90+b,10,12,'#1a1206');el(x,80,90+b,7,9,'#e8a83a');el(x,80,90+b,4,6,'#fff0b0');ln(x,80,70+b,80,78+b,1,'#3a2a14');
  el(x,80,46+b,20,22,'#24343a');el(x,80,50+b,16,18,'#3a5450');
  for(let k=0;k<11;k++){const sx=64+k*3.2;x.fillStyle=k%2?'#2f5a32':'#4f7f3a';for(let j=0;j<20+(k*5)%14;j++)x.fillRect(Math.round(sx+Math.sin(t*1.3+j*.3+k)*1.8),36+b+j,1,1);}
  const blink=(t%5.7)>.15;if(blink){el(x,72,46+b,3,2,'#020604');el(x,88,46+b,3,2,'#020604');px(x,72,46+b,'#7affc8');px(x,88,46+b,'#7affc8');}
  [[62,26],[68,18],[74,22],[80,12],[86,22],[92,18],[98,26]].forEach((p,i)=>{ln(x,p[0],30+b,p[0]+(i-3)*.6,p[1]+b,2,i%2?'#c84a3a':'#e86a4a');px(x,p[0]+(i-3)*.6,p[1]+b,'#ffb0a0');});
  x.fillStyle='#8a2a22';x.fillRect(60,29+b,41,3);
  return[[80,90+b,'#5a3a08',22],[80,46+b,'#0a3a2a',14]];}
};
const OUTLINE={shade:'#2a1440',boss:'#05020a'};
function finish(c,x,outline,flash){const w=c.width,h=c.height,id=x.getImageData(0,0,w,h),d=id.data,a=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++){if(d[i*4+3]>110){a[i]=1;d[i*4+3]=255;if(flash){d[i*4]=255;d[i*4+1]=250;d[i*4+2]=235;}}else d[i*4+3]=0;}
 const oc=hx(outline);for(let y=0;y<h;y++)for(let i=0;i<w;i++){const p=y*w+i;if(a[p])continue;if((i>0&&a[p-1])||(i<w-1&&a[p+1])||(y>0&&a[p-w])||(y<h-1&&a[p+w])){d[p*4]=oc[0];d[p*4+1]=oc[1];d[p*4+2]=oc[2];d[p*4+3]=255;}}
 x.putImageData(id,0,0);}
function mkVis(id,variant){const big=id==='boss';const[c,x]=cnv(big?160:64,big?140:80);return{c,x,big,variant,hit:0,kx:0,lunge:0,dying:false,gone:false,ph:Math.random()*10};}
function enemyPos(i,n,e){if(e&&e.id==='boss')return{x:160,y:170,w:120,h:125};const xs=n===1?[160]:n===2?[118,204]:[84,160,236];return{x:xs[i]||160,y:153,w:40,h:58};}

