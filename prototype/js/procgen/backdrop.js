// ===================== WELTEN-BAUKASTEN =====================
// Ein Hintergrund = Stimmung (Palette) × Himmel × Ferne × Boden × Wetter × Requisiten, dazu ein Seed.
// Jede Schicht ist eine kleine Funktion mit den Helfern aus pixel.js. Statisches wird einmal gemalt,
// Bewegtes (Sterne, Blitze, Nebel, Regen, Flammen) läuft jedes Bild in back()/front().
// Horizont liegt bei y=100, Gegner stehen wie im Spiel bei y=153.

const MOODS={
 mitternacht:{n:'Mitternacht',sky:['#04050a','#070b16','#0e1628','#18243c','#24344c'],sil:'#090d17',sil2:'#131b2c',gnd:['#1c1712','#120e0a','#0a0806'],acc:'#e8b94a',fog:'#2a3448',lite:'#d8e0f0',water:['#0c1828','#08111e','#050a12']},
 verderbnis:{n:'Verderbnis',sky:['#030604','#061008','#0c1a10','#142818','#1c3420'],sil:'#06100a',sil2:'#0e1c12',gnd:['#151b10','#0e120a','#080a06'],acc:'#9aff5a',fog:'#2a4430',lite:'#c8ffb0',water:['#0c1a12','#08120c','#040a06']},
 blut:{n:'Blutmond',sky:['#080204','#140408','#260a10','#3a1016','#4a1a1a'],sil:'#100406',sil2:'#1e090b',gnd:['#1a0e0a','#120806','#0a0404'],acc:'#ff6a3a',fog:'#4a2228',lite:'#ffb0a0',water:['#1a0a0c','#120608','#0a0304']},
 leere:{n:'Leere',sky:['#050409','#0a0812','#141026','#22183a','#2e2040'],sil:'#0b0912',sil2:'#161029',gnd:['#14101c','#0e0a14','#08060c'],acc:'#7affc8',fog:'#3a3050',lite:'#c7a2ff',water:['#120c22','#0c0818','#06040e']},
 dunst:{n:'Dunst',sky:['#0e0e0c','#1a1a16','#2a2a24','#3a3a32','#4a4a3e'],sil:'#14140f',sil2:'#24241c',gnd:['#1e1c16','#16140e','#0e0c08'],acc:'#e8c060',fog:'#5a5a4c',lite:'#e8e2c8',water:['#1a1c1a','#121412','#0a0c0a']}
};
const WORLD_OPTS={
 mood:Object.fromEntries(Object.entries(MOODS).map(([k,v])=>[k,v.n])),
 sky:{sterne:'Sterne + Sichel',sturm:'Gewitter',mond:'Großer Mond',aurora:'Polarlicht',bedeckt:'Bedeckt'},
 far:{stadt:'Hafenstadt',huegel:'Hügel',wald:'Wald',klippe:'Klippe + Leuchtturm',steine:'Steinkreis'},
 ground:{steg:'Steg am Wasser',moor:'Moor',pfad:'Waldweg',fels:'Steinboden',hoehle:'Höhle'},
 weather:{keins:'kein Wetter',regen:'Regen',nebel:'Nebel',asche:'Asche',gluehw:'Glühwürmchen',sporen:'Sporen'},
 prop:{keins:'keine',laternen:'Laternen',graeber:'Gräber',kerzen:'Kerzen',totem:'Totempfahl',wrack:'Bootswrack'}
};
const HZ=100;

function genWorld(seed,lock={}){const r=rng(seed*977+1);const c={seed};Object.keys(WORLD_OPTS).forEach(k=>{c[k]=lock[k]||pick(r,Object.keys(WORLD_OPTS[k]));});
 if(c.ground==='hoehle'&&c.sky!=='bedeckt'&&r()<.5)c.sky='bedeckt';return c;}
const worldCount=()=>Object.values(WORLD_OPTS).reduce((a,o)=>a*Object.keys(o).length,1);

// ---------- Himmel ----------
const SKY={
 sterne(b,r,M,A){vgrad(b,0,HZ+2,M.sky);for(let i=0;i<90;i++)px(b,r()*W,r()*80,r()<.2?M.lite:M.sil2);const mx=40+r()*240,my=18+r()*20;dglow(b,mx,my,30,M.sil2,.8);el(b,mx,my,9,9,M.lite);el(b,mx+4,my-2,8,8,M.sky[1]);
  const tw=[...Array(14)].map(()=>[r()*W,r()*80,r()*6]);A.back.push((x,t)=>tw.forEach(s=>{if(Math.sin(t*2+s[2]*5)>.6)px(x,s[0],s[1],M.lite);}));},
 sturm(b,r,M,A){vgrad(b,0,HZ+2,M.sky);for(let k=0;k<4;k++){const y0=8+k*16;dither(b,0,y0,W,16,k%2?M.sil2:M.sil,(i,j)=>.45+.35*Math.sin(i*.04+k*2+r()*.02)+.2*Math.sin(i*.13+j*.4));}
  const bolt=[];let X=60+r()*200,Y=0;while(Y<HZ-8){const nx=X+(r()-.5)*16,ny=Y+5+r()*8;bolt.push([X,Y,nx,ny]);X=nx;Y=ny;}
  A.back.push((x,t)=>{const p=t%4.7;if(p<.25){x.save();x.globalCompositeOperation='lighter';x.globalAlpha=(.25-p)*1.4;x.fillStyle=M.fog;x.fillRect(0,0,W,H);x.restore();if(p<.12)bolt.forEach(s=>ln(x,s[0],s[1],s[2],s[3],1,M.lite));}});},
 mond(b,r,M,A){vgrad(b,0,HZ+2,M.sky);for(let i=0;i<40;i++)px(b,r()*W,r()*70,M.sil2);const mx=80+r()*160;dglow(b,mx,46,60,M.acc,.35);el(b,mx,46,26,26,M.acc);
  for(let i=0;i<9;i++)el(b,mx-16+r()*32,30+r()*32,1.5+r()*3,1.5+r()*2.5,M.sky[4]);
  dither(b,mx-26,40,52,32,M.sky[3],(i,j)=>Math.hypot(i-mx,j-46)<25?.4+.3*Math.sin(i*.2+j*.5):0);},
 aurora(b,r,M,A){vgrad(b,0,HZ+2,M.sky);for(let i=0;i<70;i++)px(b,r()*W,r()*85,r()<.3?M.lite:M.sil2);
  const[ac,ax]=cnv(W,70);A.back.push((x,t)=>{ax.clearRect(0,0,W,70);for(let k=0;k<3;k++){const ph=k*2.1;dither(ax,0,0,W,70,k===1?M.lite:M.acc,(i,j)=>{const c=22+k*10+Math.sin(i*.025+t*.4+ph)*12+Math.sin(i*.07-t*.7)*4;const d=Math.abs(j-c);return d<9?(1-d/9)*.28*(.6+.4*Math.sin(i*.05+t+ph)):0;});}x.save();x.globalCompositeOperation='lighter';x.drawImage(ac,0,4);x.restore();});},
 bedeckt(b,r,M,A){vgrad(b,0,HZ+2,[M.sky[1],M.sky[2],M.sky[3],M.sky[2]]);for(let k=0;k<5;k++)dither(b,0,k*18,W,20,M.sil2,(i,j)=>.3+.25*Math.sin(i*.03+k*1.7)+.2*Math.sin(i*.11+j*.3+k));}
};
// ---------- Ferne (Silhouetten am Horizont) ----------
const FAR={
 stadt(b,r,M,A){for(let i=0;i<22;i++){const bx=i*15+r()*6-8,bw=9+r()*9,bh=8+r()*24;b.fillStyle=M.sil;b.fillRect(bx|0,(HZ-bh)|0,bw|0,(bh+2)|0);poly(b,[[bx,HZ-bh],[bx+bw/2,HZ-bh-3-r()*5],[bx+bw,HZ-bh]],M.sil);
   for(let k=0;k<3;k++)if(r()<.4)px(b,bx+2+r()*(bw-4),HZ-bh+3+r()*(bh-5),M.acc);}
  const sx=60+r()*200;poly(b,[[sx-3,HZ],[sx-3,HZ-38],[sx,HZ-52],[sx+3,HZ-38],[sx+3,HZ]],M.sil);px(b,sx,HZ-34,M.acc);},
 huegel(b,r,M,A){const o=r()*99;for(let L=0;L<2;L++){b.fillStyle=L?M.sil:M.sil2;for(let X=0;X<W;X++){const h=HZ-(L?8:20)-Math.sin(X*.018+o+L)*(L?6:10)-Math.sin(X*.07+o*2)*3;b.fillRect(X,h|0,1,(HZ-h+2)|0);}}},
 wald(b,r,M,A){b.fillStyle=M.sil2;for(let X=0;X<W;X++){const h=HZ-6-Math.sin(X*.05)*2-r()*1.5;b.fillRect(X,h|0,1,(HZ-h+2)|0);}for(let i=0;i<30;i++)tree(b,r,r()*W,HZ+1,10+r()*12,-Math.PI/2+(r()-.5)*.2,2,4,M.sil);},
 klippe(b,r,M,A){const left=r()<.5;const cx=left?0:W;poly(b,[[cx,HZ+2],[cx,HZ-34],[cx+(left?40:-40),HZ-30],[cx+(left?62:-62),HZ-12],[cx+(left?80:-80),HZ+2]],M.sil);
  const lx=cx+(left?26:-26),ly=HZ-30;poly(b,[[lx-4,ly],[lx-3,ly-24],[lx+3,ly-24],[lx+4,ly]],M.sil2);b.fillStyle=M.sil;for(let y=ly-20;y<ly;y+=6)b.fillRect(lx-4,y,8,2);b.fillRect(lx-5,ly-30,10,6);b.fillStyle=M.acc;b.fillRect(lx-2,ly-29,4,4);
  A.back.push((x,t)=>{const a=Math.sin(t*.7);const dir=(left?0:Math.PI)+a*.6;const amt=.3*(.5+.5*Math.cos(t*.7));x.save();x.globalCompositeOperation='lighter';x.fillStyle=M.fog;
   for(let j=ly-60;j<ly+20;j++)for(let i=0;i<W;i+=1){const dx=i-lx,dy=j-(ly-27);const d=Math.hypot(dx,dy);if(d>190||d<4)continue;let da=Math.atan2(dy,dx)-dir;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>.1)continue;if(amt*(1-d/190)*(1-Math.abs(da)/.1)>bay(i,j))x.fillRect(i,j,1,1);}x.restore();});},
 steine(b,r,M,A){b.fillStyle=M.sil2;for(let X=0;X<W;X++){const h=HZ-4-Math.sin(X*.03)*2;b.fillRect(X,h|0,1,6);}const n=5+Math.floor(r()*3),pts=[];
  for(let i=0;i<n;i++){const X=30+i*(260/(n-1))+(r()-.5)*14,hh=14+r()*18,w=5+r()*4;poly(b,[[X-w,HZ+1],[X-w+1,HZ-hh],[X+w-1,HZ-hh-2],[X+w,HZ+1]],M.sil);pts.push([X,HZ-hh*.6]);}
  const a=Math.floor(n/2);b.fillStyle=M.sil;b.fillRect((pts[a][0]-14)|0,(HZ-40)|0,28,5);b.fillRect((pts[a][0]-12)|0,(HZ-36)|0,4,37);b.fillRect((pts[a][0]+8)|0,(HZ-36)|0,4,37);
  A.back.push((x,t)=>pts.forEach((p,i)=>{const v=.5+.5*Math.sin(t*1.3+i*1.7);px(x,p[0],p[1],M.acc);if(v>.6)dglow(x,p[0],p[1],5,M.fog,v*.6);}));}
};
// ---------- Boden ----------
const GROUND={
 steg(b,r,M,A){vgrad(b,HZ,H,M.water);for(let i=0;i<60;i++){b.fillStyle=r()<.5?M.sil2:M.water[0];b.fillRect(r()*W|0,HZ+2+r()*60|0,2+r()*8|0,1);}
  poly(b,[[100,128],[220,128],[330,180],[-10,180]],M.gnd[0]);for(let k=0;k<=12;k++){const y=128+Math.pow(k/12,1.5)*52,t=(y-128)/52,l=100-110*t,rr=220+110*t;b.fillStyle=M.gnd[2];b.fillRect(l|0,y|0,(rr-l)|0,1);}
  for(let s=-5;s<=5;s++)ln(b,160+s*11,128,160+s*30,180,1,M.gnd[2]);b.fillStyle=M.gnd[2];b.fillRect(94,122,4,12);b.fillRect(222,122,4,12);
  A.back.push((x,t)=>{for(let j=HZ+2;j<128;j+=3){const o=Math.sin(t*1.5+j)*4;x.fillStyle=M.sil2;x.fillRect(Math.round((j*37)%W+o),j,4,1);}});},
 moor(b,r,M,A){vgrad(b,HZ,H,[M.water[0],M.gnd[1],M.gnd[2]]);const mounds=[];for(let i=0;i<9;i++){const X=r()*W,Y=110+r()*66;if(Math.abs(X-160)<60&&Y>135)continue;el(b,X,Y,10+r()*16,2+r()*3,M.gnd[0]);mounds.push([X,Y]);}
  for(let i=0;i<40;i++){const X=r()*W,Y=104+r()*76;if(Math.abs(X-160)<70&&Y>130)continue;for(let k=0;k<3;k++)ln(b,X+k*2,Y,X+k*2+(r()-.5)*3,Y-4-r()*7,1,M.sil);}
  el(b,160,156,70,14,M.gnd[0]);el(b,160,155,62,10,M.gnd[1]);
  const pools=[...Array(6)].map(()=>[r()*W,108+r()*20]);A.back.push((x,t)=>pools.forEach((p,i)=>{const w=3+((t*4+i*3)%6);x.fillStyle=M.sil2;x.fillRect(Math.round(p[0]-w/2),Math.round(p[1]),Math.round(w),1);}));},
 pfad(b,r,M,A){vgrad(b,HZ,H,[M.gnd[1],M.gnd[0],M.gnd[1]]);poly(b,[[150,HZ],[170,HZ],[270,180],[50,180]],M.gnd[0]);
  for(let y=HZ+1;y<180;y++){const t=(y-HZ)/80,l=150-100*t,rr=170+100*t;for(let k=0;k<3;k++)px(b,l+r()*(rr-l),y,r()<.5?M.gnd[2]:M.sil2);}
  for(let i=0;i<70;i++){const X=r()*W,Y=HZ+6+r()*74;if(Math.abs(X-160)<(Y-HZ)*1.25)continue;ln(b,X,Y,X+(r()-.5)*3,Y-3-r()*4,1,M.sil);}},
 fels(b,r,M,A){vgrad(b,HZ,H,[M.gnd[1],M.gnd[0],M.gnd[1]]);for(let k=0;k<=10;k++){const y=HZ+Math.pow(k/10,1.6)*80;b.fillStyle=M.gnd[2];b.fillRect(0,y|0,W,1);}
  for(let s=-12;s<=12;s++)ln(b,160+s*14,HZ,160+s*44,180,1,M.gnd[2]);for(let i=0;i<30;i++){const X=r()*W,Y=HZ+8+r()*70;ln(b,X,Y,X+(r()-.5)*8,Y+r()*4,1,M.sil);}
  for(let i=0;i<18;i++){px(b,r()*W,HZ+4+r()*76,M.acc);}},
 hoehle(b,r,M,A){vgrad(b,HZ-10,H,[M.sil2,M.gnd[1],M.gnd[2]]);for(let X=0;X<W;X++){const h=HZ+4+Math.sin(X*.07)*2+Math.sin(X*.23)*1;px(b,X,h,M.sil);}
  for(let i=0;i<10;i++){const X=r()*W,Y=HZ+20+r()*60;if(Math.abs(X-160)<50)continue;poly(b,[[X-5,Y],[X+5,Y],[X+1,Y-8-r()*10]],M.sil);}
  A.cave=true;}
};
// ---------- Wetter ----------
const WEATHER={
 keins(){},
 regen(r,M,A){const d=[...Array(80)].map(()=>[r()*W,r()*H,1+r()]);A.front.push((x,t)=>{x.fillStyle=M.fog;d.forEach(p=>{const y=(p[1]+t*150*p[2])%H,X=((p[0]-t*30*p[2])%W+W)%W;x.fillRect(X|0,y|0,1,3);});});},
 nebel(r,M,A){const f1=fogTex(M.fog,24,.6,r()*9),f2=fogTex(M.fog,18,.5,r()*9);A.back.push((x,t)=>drawFog(x,f2,HZ-14,t,4));A.front.push((x,t)=>drawFog(x,f1,HZ+30,t,8));},
 asche(r,M,A){const d=[...Array(50)].map(()=>[r()*W,r()*H,.3+r(),r()*6]);A.front.push((x,t)=>d.forEach(p=>{const y=(p[1]+t*10*p[2])%H;px(x,p[0]+Math.sin(t+p[3])*6,y,p[2]>1.1?M.acc:M.sil2);}));},
 gluehw(r,M,A){const d=[...Array(16)].map(()=>[r()*W,HZ+r()*70,r()*6]);A.front.push((x,t)=>d.forEach(p=>{const X=p[0]+Math.sin(t*.7+p[2])*14,Y=p[1]+Math.sin(t*1.1+p[2]*2)*8;if(Math.sin(t*2+p[2]*3)>-.3){px(x,X,Y,M.lite);dglow(x,X,Y,4,M.fog,.7);}}));},
 sporen(r,M,A){const d=[...Array(45)].map(()=>[r()*W,r()*H,.3+r()]);A.front.push((x,t)=>d.forEach(p=>{const y=((p[1]-t*12*p[2])%H+H)%H;px(x,p[0]+Math.sin(t+p[1])*3,y,p[2]>.9?M.acc:M.sil2);}));}
};
// ---------- Requisiten (Vordergrund) ----------
const PROPS={
 keins(){},
 laternen(f,r,M,A){[26,294].forEach(X=>{f.fillStyle='#050608';f.fillRect(X-2,40,4,140);f.fillRect(X-8,36,16,5);f.fillRect(X-5,41,10,6);f.fillStyle=M.acc;f.fillRect(X-3,42,6,3);});
  A.front.push((x,t)=>{const fl=.6+Math.sin(t*9)*.08+Math.sin(t*23)*.05;dglow(x,26,44,26,M.fog,fl);dglow(x,294,44,26,M.fog,fl*.95);});},
 graeber(f,r,M,A){for(let i=0;i<6;i++){const left=i%2===0,X=left?10+r()*60:250+r()*60,Y=150+r()*26,h=12+r()*10;if(r()<.5){poly(f,[[X-6,Y],[X-6,Y-h+5],[X,Y-h],[X+6,Y-h+5],[X+6,Y]],'#07070a');}else{f.fillStyle='#07070a';f.fillRect(X-1,Y-h,3,h);f.fillRect(X-5,Y-h+4,11,3);}ln(f,X-8,Y,X+8,Y,1,'#050505');}},
 kerzen(f,r,M,A){const c=[];for(let k=0;k<2;k++){const cx=k?262+r()*30:28+r()*30,cy=158+r()*14;for(let i=0;i<5;i++){const X=cx+(r()-.5)*24,Y=cy+(r()-.5)*8,h=3+r()*6;f.fillStyle='#c8c0a0';f.fillRect(X|0,(Y-h)|0,2,h|0);f.fillStyle='#8a8270';f.fillRect((X+1)|0,(Y-h)|0,1,h|0);c.push([X,Y-h]);}}
  A.front.push((x,t)=>c.forEach((p,i)=>{const fl=Math.sin(t*15+i*2)>0;x.fillStyle='#ff9a2a';x.fillRect(Math.round(p[0]),Math.round(p[1]-3+(fl?0:1)),2,3);px(x,p[0],p[1]-2,'#fff2a0');if(i%2===0)dglow(x,p[0],p[1]-2,12,'#3a2008',.55+Math.sin(t*11+i)*.06);}));},
 totem(f,r,M,A){const left=r()<.5,X=left?36:284;f.fillStyle='#08070a';f.fillRect(X-6,60,12,120);for(let k=0;k<4;k++){const Y=70+k*24;f.fillStyle='#0e0c10';f.fillRect(X-8,Y,16,4);px(f,X-3,Y+10,M.acc);px(f,X+2,Y+10,M.acc);ln(f,X-3,Y+16,X+3,Y+16,1,'#151218');}
  poly(f,[[X-18,64],[X-6,58],[X-6,66]],'#08070a');poly(f,[[X+18,64],[X+6,58],[X+6,66]],'#08070a');for(let i=0;i<5;i++)el(f,X+(left?14:-14)+(r()-.5)*14,174-((i*3)%7),4,3,'#c8c0a0');
  A.front.push((x,t)=>{if(Math.sin(t*1.7)>.2)for(let k=0;k<4;k++){dglow(x,X,80+k*24,5,M.fog,.5);}});},
 wrack(f,r,M,A){const left=r()<.5,X=left?0:W,s=left?1:-1;poly(f,[[X,150],[X+s*70,156],[X+s*60,172],[X,176]],'#070605');for(let k=0;k<5;k++)ln(f,X+s*(8+k*12),152+k,X+s*(6+k*12),170,1,'#0c0a08');ln(f,X+s*40,156,X+s*46,110,2,'#070605');ln(f,X+s*46,112,X+s*30,128,1,'#0c0a08');}
};

const WCACHE={};
function buildWorld(c){const key=JSON.stringify(c);if(WCACHE[key])return WCACHE[key];const M=MOODS[c.mood],r=rng(c.seed*131+7);
 const[bg,b]=cnv(W,H),[fg,f]=cnv(W,H);const A={back:[],front:[],cave:false};
 SKY[c.sky](b,r,M,A);FAR[c.far](b,r,M,A);GROUND[c.ground](b,r,M,A);
 if(A.cave){// Höhle: Decke mit Tropfsteinen und Felswände an den Seiten
  poly(f,[[0,0],[W,0],[W,18],[0,22]],'#050407');for(let i=0;i<26;i++){const X=r()*W,L=6+r()*26;poly(f,[[X-3-r()*3,12],[X+3+r()*3,12],[X,12+L]],'#050407');}
  poly(f,[[0,0],[34,0],[26,70],[36,130],[24,180],[0,180]],'#040306');poly(f,[[W,0],[W-30,0],[W-24,80],[W-34,140],[W-22,180],[W,180]],'#040306');}
 PROPS[c.prop](f,r,M,A);WEATHER[c.weather](r,M,A);
 return WCACHE[key]={bg,fg,back:(x,t)=>A.back.forEach(fn=>fn(x,t)),front:(x,t)=>A.front.forEach(fn=>fn(x,t))};}

// Szene inklusive Gegner malen (wie im Spiel: Gegner auf y=153, Schatten darunter).
function drawWorld(x,t,c,foes=[]){const w=buildWorld(c);x.drawImage(w.bg,0,0);w.back(x,t);
 const n=foes.length,xs=n===1?[160]:n===2?[118,204]:[84,160,236];
 foes.forEach((fc,i)=>{el(x,xs[i],154,14,3,'rgba(0,0,0,.55)');x.drawImage(fc,Math.round(xs[i]-32),153-78);});
 x.drawImage(w.fg,0,0);w.front(x,t);x.drawImage(VIG,0,0);}
