// --- Szenen ---
function buildHafen(){const r=rng(7);const[bg,b]=cnv(W,H),[fg,f]=cnv(W,H);
 vgrad(b,0,101,['#04050a','#070b16','#0e1628','#18243c','#24344c']);
 for(let i=0;i<80;i++){px(b,r()*W,r()*75,r()<.2?'#d8e0f0':'#56627c');}
 dglow(b,248,30,34,'#1a2440',.7);el(b,248,30,13,13,'#e8e2c8');el(b,251,26,4,3,'#cfc6a6');el(b,243,35,3,2,'#cfc6a6');el(b,252,37,2,2,'#d6cfb2');el(b,245,24,1.5,1.5,'#d6cfb2');
 for(let i=0;i<16;i++){const bx=i*11+r()*4-6,bw=8+r()*8,bh=7+r()*20;b.fillStyle='#090d17';b.fillRect(bx|0,(101-bh)|0,bw|0,bh|0);poly(b,[[bx,101-bh],[bx+bw/2,101-bh-4-r()*4],[bx+bw,101-bh]],'#090d17');
  for(let k=0;k<3;k++)if(r()<.45)px(b,bx+2+r()*(bw-4),101-bh+3+r()*(bh-5),r()<.7?'#e8b94a':'#8a6a2a');}
 poly(b,[[118,101],[118,62],[121,50],[124,62],[124,101]],'#090d17');px(b,121,66,'#e8b94a');
 vgrad(b,101,140,['#0c1828','#08111e','#050a12']);
 for(let i=0;i<60;i++){b.fillStyle=r()<.5?'#13223a':'#0f1a2c';b.fillRect(r()*W|0,101+r()*38|0,2+r()*8|0,1);}
 poly(b,[[284,101],[290,95],[310,95],[318,101]],'#0a0e16');poly(b,[[294,96],[296,70],[304,70],[306,96]],'#1a1e28');b.fillStyle='#2a1a1a';for(let y=74;y<96;y+=6)b.fillRect(295,y,10,2);
 b.fillStyle='#10141c';b.fillRect(293,64,14,6);b.fillStyle='#e8d890';b.fillRect(297,65,6,4);
 poly(b,[[92,126],[228,126],[340,180],[-20,180]],'#21170f');
 for(let k=0;k<=13;k++){const y=126+Math.pow(k/13,1.5)*54;const t=(y-126)/54;const l=92-112*t,rr=228+112*t;b.fillStyle='#120c08';b.fillRect(l|0,y|0,(rr-l)|0,1);b.fillStyle='#33251a';b.fillRect(l|0,(y+1)|0,(rr-l)|0,1);}
 for(let s=-6;s<=6;s++){ln(b,160+s*11,126,160+s*30,180,1,'#150e09');}
 for(let i=0;i<40;i++){const y=128+r()*50,t=(y-126)/54;px(b,92-112*t+r()*(136+224*t),y,'#3c2c1e');}
 b.fillStyle='#120c08';b.fillRect(86,120,4,12);b.fillRect(230,120,4,12);
 f.fillStyle='#050608';f.fillRect(24,40,4,140);f.fillRect(292,40,4,140);f.fillRect(18,36,16,5);f.fillRect(286,36,16,5);f.fillRect(21,41,10,6);f.fillRect(289,41,10,6);
 f.fillStyle='#e8c060';f.fillRect(23,42,6,3);f.fillRect(291,42,6,3);
 poly(f,[[0,150],[26,150],[30,180],[0,180]],'#070605');poly(f,[[4,140],[22,140],[22,152],[4,152]],'#0a0806');ln(f,6,146,20,146,1,'#1a120c');
 poly(f,[[296,158],[320,152],[320,180],[292,180]],'#070605');el(f,306,168,10,4,'#0c0a08');el(f,306,167,6,2,'#070605');
 const fog=fogTex('#2a3448',22,.55,1),fog2=fogTex('#1c2436',16,.5,4);
 const drops=[...Array(70)].map(()=>[Math.random()*W,Math.random()*H,1+Math.random()]);
 return{bg,fg,far:{y:127,xs:[150,170,190]},
  back:(x,t)=>{const a=Math.sin(t*.7);if(a>-.2){const bx=300,by=67,len=170,sp=.12;const dir=Math.PI+a*.9;const amt=Math.min(1,(a+.2)*1.4)*.32;
    const x0=Math.max(0,Math.round(bx-len)),x1=bx;x.fillStyle='#4a4a30';for(let j=by-40;j<by+40;j++)for(let i=x0;i<x1;i+=1){const dx=i-bx,dy=j-by;const d=Math.hypot(dx,dy);if(d>len)continue;let da=Math.atan2(dy,dx)-dir;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>sp)continue;if(amt*(1-d/len)*(1-Math.abs(da)/sp)>bay(i,j)){x.fillStyle='#3a3a2a';x.globalCompositeOperation='lighter';x.fillRect(i,j,1,1);x.globalCompositeOperation='source-over';}}}
   for(let j=102;j<140;j+=2){const w=2+((j*7+Math.floor(t*6))%5);const o=Math.sin(t*2+j)*3;x.fillStyle=(j+Math.floor(t*8))%3?'#3a4258':'#b8b298';x.fillRect(Math.round(246+o-w/2),j,w,1);}
   drawFog(x,fog2,92,t,4);},
  mid:(x,t)=>{drawFog(x,fog,112,t,7);},
  front:(x,t)=>{const fl=.65+Math.sin(t*9)*.08+Math.sin(t*23)*.05;dglow(x,26,44,26,'#3a2a10',fl);dglow(x,294,44,26,'#3a2a10',fl*.95);
   x.fillStyle='#2c3a52';drops.forEach(d=>{const y=(d[1]+t*140*d[2])%H,X=(d[0]-t*30*d[2]+W*4)%W;x.fillRect(X|0,y|0,1,3);});}};}

function buildWald(){const r=rng(11);const[bg,b]=cnv(W,H),[md,m]=cnv(W,H),[fg,f]=cnv(W,H);
 vgrad(b,0,100,['#050409','#0a0812','#141026','#22183a','#2e2040']);
 for(let i=0;i<55;i++)px(b,r()*W,r()*62,r()<.3?'#b8acd8':'#4a4068');
 b.fillStyle='#120e1e';for(let X=0;X<W;X++){const h=86+Math.sin(X*.03)*4+Math.sin(X*.11)*2;b.fillRect(X,h|0,1,(H-h)|0);}
 for(let i=0;i<26;i++){const X=r()*W;if(Math.abs(X-160)<26)continue;tree(b,r,X,98,13+r()*10,-Math.PI/2+(r()-.5)*.2,2,4,'#1d1732');}
 vgrad(b,95,H,['#100d16','#0e100e','#11150f','#151b12']);
 poly(m,[[152,94],[168,94],[266,180],[54,180]],'#1f1913');
 for(let y=95;y<180;y++){const t=(y-94)/86,l=152-98*t,rr=168+98*t;for(let k=0;k<3;k++)px(m,l+r()*(rr-l),y,r()<.5?'#2c241a':'#14100b');}
 el(m,142,136,11,2,'#25183a');el(m,188,160,15,3,'#25183a');px(m,138,136,'#7a4ab8');px(m,190,159,'#7affc8');ln(m,180,160,195,160,1,'#3a2560');
 for(let i=0;i<14;i++){const left=r()<.5;const X=left?8+r()*100:212+r()*100;const Y=102+r()*26;tree(m,r,X,Y,18+r()*16,-Math.PI/2+(r()-.5)*.3,3+r()*2,5,'#0b0912');ln(m,X-4,Y+1,X+4,Y+1,2,'#0b0912');}
 for(let i=0;i<60;i++){const X=r()*W,Y=110+r()*70;if(Math.abs(X-160)<(Y-94)*1.1)continue;ln(m,X,Y,X+(r()-.5)*3,Y-3-r()*4,1,'#0a0d0a');}
 poly(f,[[0,0],[30,0],[24,60],[30,120],[22,180],[0,180]],'#040306');poly(f,[[320,0],[292,0],[298,70],[290,130],[298,180],[320,180]],'#040306');
 tree(f,r,22,40,40,-.25,4,4,'#040306');tree(f,r,296,30,40,Math.PI+.25,4,4,'#040306');
 for(let i=0;i<14;i++){const X=r()<.5?r()*70:250+r()*70;ln(f,X,180,X+(r()-.5)*20,160-r()*14,2,'#050706');}
 for(let i=0;i<10;i++){const X=30+r()*260;const L=4+r()*10;if(Math.abs(X-160)<40)continue;ln(f,X,0,X,L,1,'#0a0c10');}
 const fog=fogTex('#3a3050',26,.5,2),fog2=fogTex('#241d36',18,.55,5);
 const ff=[...Array(14)].map(()=>[Math.random()*W,110+Math.random()*60,Math.random()*6]);
 return{bg,midc:md,fg,far:{y:100,xs:[150,160,170]},
  back:(x,t)=>{portal(x,160,70,16,23,t);drawFog(x,fog2,84,t,3);},
  mid:(x,t)=>{drawFog(x,fog,108,t,6);dglow(x,160,110,40,'#1a0c34',.35);},
  front:(x,t)=>{ff.forEach(p=>{const X=p[0]+Math.sin(t*.7+p[2])*14,Y=p[1]+Math.sin(t*1.1+p[2]*2)*8;if(Math.sin(t*2+p[2]*3)>-.3){px(x,X,Y,'#d8ff9a');dglow(x,X,Y,4,'#2a3a10',.8);}});}};}

function buildKapelle(){const r=rng(5);const[bg,b]=cnv(W,H),[fg,f]=cnv(W,H);
 vgrad(b,0,132,['#07080c','#0d0f16','#12151d','#151a22']);
 for(let y=4;y<132;y+=6){b.fillStyle='#08090d';b.fillRect(0,y,W,1);const o=(y/6)%2?0:7;for(let X=o;X<W;X+=14){b.fillRect(X,y-5,1,5);if(r()<.07){b.fillStyle='#161a23';b.fillRect(X+1,y-5,13,5);b.fillStyle='#08090d';}}}
 poly(b,[[136,96],[136,40],[184,40],[184,96]],'#05060a');el(b,160,40,24,22,'#05060a');
 const pc=['#1c3270','#6e1c2a','#8a6c20','#1a5240','#44206a'];
 for(let j=21;j<95;j+=4)for(let i=138;i<183;i+=4){const dx=(i+3-160)/22,dy=(Math.min(j,40)-40)/20;if(j<40&&dx*dx+dy*dy>.85)continue;if(r()<.12)continue;b.fillStyle=pc[(r()*pc.length)|0];b.fillRect(i,j,3,3);}
 ln(b,160,20,160,96,1,'#05060a');ln(b,136,58,184,58,1,'#05060a');
 [36,284].forEach(X=>{b.fillStyle='#12141b';b.fillRect(X-10,0,20,132);b.fillStyle='#1e222c';b.fillRect(X-10,0,3,132);b.fillStyle='#0a0b10';b.fillRect(X+7,0,3,132);b.fillStyle='#1a1d26';b.fillRect(X-13,20,26,5);b.fillRect(X-13,124,26,8);});
 vgrad(b,132,H,['#0b1018','#080c14','#05080e']);
 for(let j=134;j<H;j+=2)for(let k=0;k<5;k++){const c=pc[(r()*pc.length)|0];if(r()<.5){b.fillStyle=c;b.globalAlpha=.25;b.fillRect(140+r()*40|0,j,2+r()*6|0,1);b.globalAlpha=1;}}
 for(let i=0;i<40;i++){b.fillStyle='#141c28';b.fillRect(r()*W|0,134+r()*44|0,3+r()*10|0,1);}
 const pew=(X,Y,w)=>{f.fillStyle='#050406';f.fillRect(X,Y,w,4);f.fillRect(X,Y-10,3,14);f.fillRect(X+w-3,Y-8,3,12);f.fillRect(X+2,Y+4,2,8);f.fillRect(X+w-4,Y+4,2,8);};
 pew(0,160,60);pew(260,162,60);pew(-10,172,52);pew(280,174,50);
 [[64,150],[256,150]].forEach(([X,Y])=>{f.fillStyle='#0a0806';f.fillRect(X-1,Y-30,3,32);f.fillRect(X-8,Y-30,17,2);f.fillRect(X-4,Y+1,9,2);[-7,0,7].forEach(o=>{f.fillStyle='#d8d0b0';f.fillRect(X+o,Y-35,2,5);});});
 const shaft=(()=>{const[c,x]=cnv(W,H);dither(x,100,40,120,140,'#4a4a6a',(i,j)=>{const w=20+(j-40)*.35;const d=Math.abs(i-160)/w;return d<1?(1-d)*.18*(1-(j-40)/150):0;});return c;})();
 const motes=[...Array(24)].map(()=>[130+Math.random()*60,40+Math.random()*120,Math.random()*6]);
 return{bg,fg,far:{y:122,xs:[148,160,172]},
  back:(x,t)=>{x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.75+Math.sin(t*.8)*.25;x.drawImage(shaft,0,0);x.restore();dglow(x,160,60,30,'#14102a',.6);},
  mid:(x,t)=>{for(let k=0;k<3;k++){const p=((t*.4+k/3)%1);const rr=p*14;x.fillStyle='#22304a';for(let a=0;a<6.28;a+=.25)px(x,100+k*60+Math.cos(a)*rr,150+k*8+Math.sin(a)*rr*.3,'#1c2a40');}},
  front:(x,t)=>{[[64,150],[256,150]].forEach(([X,Y])=>{[-7,0,7].forEach((o,i)=>{const fl=Math.sin(t*15+i*2+X)>0;x.fillStyle='#ff9a2a';x.fillRect(X+o,Y-38+(fl?0:1),2,3);px(x,X+o,Y-37,'#fff2a0');});dglow(x,X,Y-37,26,'#3a2008',.6+Math.sin(t*11+X)*.06);});
   motes.forEach(m=>{px(x,m[0]+Math.sin(t*.5+m[2])*6,(m[1]-t*3+200)%140+40,'#6a6a8a');});}};}

function buildGrund(){const r=rng(3);const[bg,b]=cnv(W,H),[fg,f]=cnv(W,H);
 vgrad(b,0,H,['#020104','#07030c','#10071c','#180a28','#1e0c30']);
 for(let i=0;i<9;i++){const X=r()*W,Y=20+r()*90,s=4+r()*10;poly(b,[[X-s,Y],[X+s,Y],[X+s*.4,Y+s*1.4],[X-s*.3,Y+s]],'#0a0614');ln(b,X-s,Y,X+s,Y,1,'#241838');}
 poly(fg?f:f,[[0,152],[40,148],[90,154],[130,150],[190,151],[240,147],[290,153],[320,150],[320,180],[0,180]],'#0b0910');
 for(let X=0;X<W;X++){px(f,X,151+Math.sin(X*.13)*2+Math.sin(X*.05)*1.5,'#2a1e3a');}
 for(let i=0;i<30;i++)px(f,r()*W,156+r()*24,'#17121e');
 const P=[...Array(50)].map(()=>[Math.random()*W,Math.random()*H,.3+Math.random()]);
 return{bg,fg,far:{y:150,xs:[150,160,170]},
  back:(x,t)=>{portal(x,160,82,74,58,t*.6);
   for(let k=0;k<6;k++){const side=k<3?-1:1;const bx=side<0?-10:330;let X=bx,Y=40+(k%3)*45;for(let j=0;j<40;j++){const a=(side<0?0:Math.PI)+Math.sin(t*.8+k+j*.12)*.7;X+=Math.cos(a)*2.4;Y+=Math.sin(a)*1.6;el(x,X,Y,5-j*.1,5-j*.1,'#0b0614');}}},
  front:(x,t)=>{P.forEach(p=>{const Y=(p[1]-t*12*p[2]+H*10)%H;px(x,p[0]+Math.sin(t+p[1])*3,Y,p[2]>.8?'#7affc8':'#6b2fb0');});}};}

const SCN={};
function scene(z){return SCN[z]||(SCN[z]=({hafen:buildHafen,wald:buildWald,kapelle:buildKapelle,grund:buildGrund})[z]());}

