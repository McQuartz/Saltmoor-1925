// Bühne: zeichnet Szene, Gegner, Partikel und Effekte in den 320x180-Canvas.
// Die Sichtdaten eines Gegners (e.vis) legt die Bühne selbst an, die Spielregeln wissen nichts davon.
// --- Partikel und Effekte ---
const PT=[],FXL=[];let shake=0,freezeUntil=0,flashA=0,flashCol='#fff',mouseS={x:160,y:90};
function burst(X,Y,col,n,sp=1.6,up=0){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.4+Math.random())*sp;PT.push({x:X,y:Y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-up,g:.06,life:0,max:.35+Math.random()*.45,col});}}
const FX={
 pos(e){const i=S.enemies.indexOf(e);return enemyPos(i,S.enemies.length,e);},
 hit(e,d,col){if(!e||!e.vis)return;const p=FX.pos(e);e.vis.hit=.11;e.vis.kx=Math.min(8,3+d/3);burst(p.x,p.y-p.h*.55,col||'#ff5a4a',Math.min(30,6+d),1.8);burst(p.x,p.y-p.h*.55,'#fff2c0',4,2.4);
  if(d>0){freezeUntil=performance.now()+(d>=12?120:50);shake=Math.max(shake,Math.min(10,2+d/3));}},
 slash(e,col){if(!e)return;const p=FX.pos(e);FXL.push({k:'slash',x:p.x,y:p.y-p.h*.55,col,t:0,dur:.2,s:p.w*.7,flip:Math.random()<.5});},
 ring(col,e){const p=e&&e.hp!==undefined?FX.pos(e):{x:160,y:120,h:0};FXL.push({k:'ring',x:p.x,y:p.y-p.h*.5,col,t:0,dur:.55,r:e?40:120});},
 flash(col,a){flashCol=col;flashA=a;},
 shake(n){shake=Math.max(shake,n);},
 lunge(e){if(e&&e.vis)e.vis.lunge=.38;},
 die(e){if(!e||!e.vis||e.vis.dying)return;const v=e.vis,p=FX.pos(e),w=v.c.width,h=v.c.height,ox=p.x-w/2,oy=p.y-(v.big?138:78);const d=v.x.getImageData(0,0,w,h).data;
  for(let y=0;y<h;y+=1)for(let i=0;i<w;i+=1){const q=(y*w+i)*4;if(d[q+3]<200||Math.random()>.55)continue;PT.push({x:ox+i,y:oy+y,vx:(Math.random()-.5)*.8,vy:-Math.random()*1.4-.2,g:-.02,life:0,max:.5+Math.random()*1.1,col:`rgb(${d[q]},${d[q+1]},${d[q+2]})`});}
  burst(p.x,p.y-p.h*.5,'#7affc8',24,2.2);v.dying=true;v.gone=true;shake=Math.max(shake,6);}
};
function hexMix(col){return ST[col]?ST[col].c:col;}

// --- Hauptschleife ---
let tA=0,lastT=performance.now();
function frame(now){let dt=Math.min(.05,(now-lastT)/1000);lastT=now;const frozen=now<freezeUntil;if(frozen)dt=0;tA+=dt;
 const ph=S.phase||'start';const z=ph==='start'?'hafen':zoneOf(S.depth||1);const sc=scene(z);const t=tA;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.drawImage(sc.bg,0,0);sc.back&&sc.back(g,t);if(sc.midc)g.drawImage(sc.midc,0,0);
 if(sc.mid)sc.mid(g,t);
 if((ph==='reward'||ph==='event')&&S.nextIds)drawFar(sc,t);
 if(ph==='fight'||ph==='over'){const n=S.enemies.length;S.enemies.forEach((e,i)=>{if(!e.vis)e.vis=mkVis(e.id,e.variant);const v=e.vis;if(v.gone)return;const p=enemyPos(i,n,e);
   v.hit=Math.max(0,v.hit-dt);v.kx*=Math.pow(.0005,dt);v.lunge=Math.max(0,v.lunge-dt);
   if(v.big){v.lx+=(Math.max(-1,Math.min(1,(mouseS.x-p.x)/90))-(v.lx||0))*.1||0;v.ly=(v.ly||0)+((Math.max(-1,Math.min(1,(mouseS.y-80)/60)))-(v.ly||0))*.1;if(isNaN(v.lx))v.lx=0;}
   v.x.clearRect(0,0,v.c.width,v.c.height);const glows=FOE_DRAW[e.spr](v.x,t+v.ph,v)||[];
   const aimed=AIM.ei===i,tg=i===S.target&&ph==='fight';finish(v.c,v.x,aimed?'#ff3a2a':tg?'#7a1810':(OUTLINE[e.spr]||'#000'),v.hit>0);
   const L=v.lunge>0?Math.sin((1-v.lunge/.38)*Math.PI):0;const ox=Math.round(p.x-v.c.width/2+(Math.random()-.5)*v.kx*.6),oy=Math.round(p.y-(v.big?138:78)+L*10-(v.big?0:Math.abs(v.kx)*.3));
   el(g,p.x,p.y+1,v.big?46:14+L*3,v.big?6:3,'rgba(0,0,0,.55)');g.drawImage(v.c,ox,oy);
   glows.forEach(q=>dglow(g,ox+q[0],oy+q[1],q[3],q[2],.7));});}
 g.drawImage(sc.fg,0,0);sc.front&&sc.front(g,t);
 if(ph==='reward'||ph==='event')campfire(t);
 for(let i=FXL.length-1;i>=0;i--){const f=FXL[i];f.t+=dt||.016;const p=f.t/f.dur;if(p>=1){FXL.splice(i,1);continue;}
  if(f.k==='slash'){const s=f.s,dir=f.flip?-1:1;const a=Math.min(1,p*2.2),b=Math.max(0,p*2.2-1.1);for(let k=Math.floor(b*20);k<a*20;k++){const q=k/20;const X=f.x+(q-.5)*s*2*dir,Y=f.y+(q-.5)*s*1.4;ln(g,X,Y,X+dir,Y+1,3,hexMix(f.col));px(g,X,Y,'#fff');}}
  if(f.k==='ring'){const rr=f.r*(1-Math.pow(1-p,3));const c=hexMix(f.col);for(let a=0;a<6.283;a+=1.5/Math.max(8,rr)){px(g,f.x+Math.cos(a)*rr,f.y+Math.sin(a)*rr*.55,c);if(p<.5)px(g,f.x+Math.cos(a)*(rr-2),f.y+Math.sin(a)*(rr-2)*.55,'#fff');}}}
 for(let i=PT.length-1;i>=0;i--){const q=PT[i];q.life+=dt||.016;if(q.life>=q.max){PT.splice(i,1);continue;}q.vy+=q.g;q.x+=q.vx;q.y+=q.vy;g.globalAlpha=q.life/q.max>.7?.6:1;g.fillStyle=q.col;g.fillRect(Math.round(q.x),Math.round(q.y),1,1);}
 g.globalAlpha=1;
 if(flashA>0){g.globalAlpha=Math.min(1,flashA);g.fillStyle=flashCol;g.fillRect(0,0,W,H);g.globalAlpha=1;flashA-=dt*2.5;}
 if(ph==='over'){g.globalAlpha=.45;g.fillStyle='#3a0606';g.fillRect(0,0,W,H);g.globalAlpha=1;}
 g.drawImage(VIG,0,0);
 shake*=Math.pow(.002,dt||.016);const sx=(Math.random()-.5)*shake,sy=(Math.random()-.5)*shake;cv.style.transform=shake>.3?`translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`:'';
 requestAnimationFrame(frame);}
const fireP=[];
function campfire(t){const X=160,Y=164;dglow(g,X,Y-6,58,'#4a2208',.55+Math.sin(t*9)*.05+Math.sin(t*23)*.04);
 ln(g,X-10,Y+2,X+10,Y-2,3,'#2a1a0e');ln(g,X-10,Y-2,X+10,Y+2,3,'#3a2414');el(g,X,Y+3,14,2,'#0a0806');
 for(let k=0;k<3;k++)fireP.push({x:X+(Math.random()-.5)*10,y:Y-2,vx:(Math.random()-.5)*.2,vy:-.35-Math.random()*.5,life:0,max:.5+Math.random()*.6});
 for(let i=fireP.length-1;i>=0;i--){const q=fireP[i];q.life+=.016;if(q.life>q.max){fireP.splice(i,1);continue;}q.x+=q.vx+Math.sin(t*6+q.y)*.15;q.y+=q.vy;const l=q.life/q.max;g.fillStyle=l<.2?'#fff4b0':l<.45?'#ffc23a':l<.7?'#ff7a1a':l<.9?'#a8320c':'#3a1a10';const s=l<.5?2:1;g.fillRect(Math.round(q.x),Math.round(q.y),s,s);}
 if(Math.random()<.15)PT.push({x:X+(Math.random()-.5)*6,y:Y-12,vx:(Math.random()-.5)*.4,vy:-.6-Math.random()*.6,g:0,life:0,max:1.4,col:'#ffb34a'});}
const farCache={};
function drawFar(sc,t){const ids=S.nextIds;const n=ids.length;ids.forEach((id,i)=>{const key=id+(FOES[id].variant||'');let o=farCache[key];if(!o){o=farCache[key]=mkVis(id,FOES[id].variant);}
  o.x.clearRect(0,0,o.c.width,o.c.height);FOE_DRAW[FOES[id].spr](o.x,t+i*3,o);o.x.globalCompositeOperation='source-atop';o.x.fillStyle='#050308';o.x.fillRect(0,0,o.c.width,o.c.height);o.x.globalCompositeOperation='source-over';
  const s=o.big?.42:.5;const w=o.c.width*s,h=o.c.height*s;const X=(n===1?160:sc.far.xs[i]||160)+(n===2?(i?6:-6):0);const Y=sc.far.y;
  g.globalAlpha=.85;g.drawImage(o.c,Math.round(X-w/2),Math.round(Y-h),Math.round(w),Math.round(h));g.globalAlpha=1;
  if((t+i)%3>.15){px(g,X-1,Y-h*.62,'#ff4a3a');px(g,X+2,Y-h*.62,'#ff4a3a');}});}

