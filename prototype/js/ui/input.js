// Eingabe: Karten ziehen und zielen, Items verschieben, Knöpfe, Tastatur.
const AIM={ei:-1};let down=null,cdrag=null;const ghost=$('ghost');const aimSvg=$('aim'),aimP=$('aimp'),aimH=$('aimh');
function sceneXY(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};}
function enemyAt(x,y){const t=document.elementFromPoint(x,y);const en=t&&t.closest&&t.closest('.enemy[data-ei]');return en&&!en.classList.contains('dead')?+en.dataset.ei:-1;}
function inScene(x,y){const r=$('scenewrap').getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom-30;}
document.addEventListener('pointerdown',e=>{au();if(AC&&AC.state==='suspended')AC.resume();
 const cd=e.target.closest('[data-card]');
 if(cd&&S.phase==='fight'&&!busy){const i=+cd.dataset.card;const c=S.hand[i];if(!c)return;const r=cd.getBoundingClientRect();cdrag={i,el:cd,x0:e.clientX,y0:e.clientY,moved:false,tg:needsTarget(c),ox:r.left+r.width/2,oy:r.top+10};e.preventDefault();return;}
 const sl=e.target.closest('[data-loc]');if(!sl)return;const loc=sl.dataset.loc;down={loc,x:e.clientX,y:e.clientY,drag:false,has:loc!=='trash'&&!!getAt(loc)};});
document.addEventListener('pointermove',e=>{
 const s=sceneXY(e);mouseS=s;
 if(cdrag){const d=cdrag;if(!d.moved&&Math.hypot(e.clientX-d.x0,e.clientY-d.y0)>6){d.moved=true;hideTip();sfx.card();d.el.classList.add(d.tg?'aim':'drag');if(d.tg){aimSvg.style.display='block';const r=d.el.getBoundingClientRect();d.ox=r.left+r.width/2;d.oy=r.top+8;}}
  if(!d.moved)return;
  if(d.tg){const ei=enemyAt(e.clientX,e.clientY);AIM.ei=ei;const col=ei>=0?'#ff4a3a':'#e8c547';const sx=d.ox,sy=d.oy,qx=sx+(e.clientX-sx)*.15,qy=Math.min(sy,e.clientY)-60;
   aimP.setAttribute('d',`M${sx},${sy} Q${qx},${qy} ${e.clientX},${e.clientY}`);aimP.setAttribute('stroke',col);aimH.setAttribute('fill',col);const ang=Math.atan2(e.clientY-qy,e.clientX-qx)*180/Math.PI;aimH.setAttribute('transform',`translate(${e.clientX},${e.clientY}) rotate(${ang})`);}
  else{d.el.style.transform=`translate(${e.clientX-d.x0}px,${e.clientY-d.y0}px) rotate(${(e.clientX-d.x0)*.03}deg) scale(1.08)`;$('scenewrap').classList.toggle('drop',inScene(e.clientX,e.clientY));}
  return;}
 if(!down&&e.target.closest){const sl=e.target.closest('.slot[data-loc]');const cd=e.target.closest('[data-card]');
  if(sl&&sl.dataset.loc!=='trash'&&getAt(sl.dataset.loc))showTip(itemTip(sl.dataset.loc),e.clientX,e.clientY);
  else if(cd){const h=cardTip(+cd.dataset.card);if(h)showTip(h,e.clientX,e.clientY);else hideTip();}
  else hideTip();}
 if(!down||!down.has)return;if(!down.drag&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down.drag=true;hideTip();ghost.src=spr(def(getAt(down.loc)).spr);ghost.style.display='block';}
 if(down.drag){ghost.style.left=(e.clientX-25)+'px';ghost.style.top=(e.clientY-25)+'px';}});
document.addEventListener('pointerup',e=>{
 if(cdrag){const d=cdrag;cdrag=null;aimSvg.style.display='none';AIM.ei=-1;$('scenewrap').classList.remove('drop');
  if(!d.moved){playCard(d.i);return;}
  if(d.tg){const ei=enemyAt(e.clientX,e.clientY);if(ei>=0)playCard(d.i,ei);else if(alive().length===1&&inScene(e.clientX,e.clientY))playCard(d.i);else render();}
  else{if(inScene(e.clientX,e.clientY))playCard(d.i);else render();}
  return;}
 if(!down)return;const d=down;down=null;ghost.style.display='none';
 const t=document.elementFromPoint(e.clientX,e.clientY);const sl=t&&t.closest('[data-loc]');
 if(d.drag){if(sl)move(d.loc,sl.dataset.loc);S.sel=null;render();return;}
 if(!sl||sl.dataset.loc!==d.loc)return;const loc=d.loc;
 if(S.sel){const s=S.sel;S.sel=null;if(s!==loc)move(s,loc);else render();}
 else if(loc!=='trash'&&getAt(loc)){S.sel=loc;sfx.click();render();}
});
document.addEventListener('click',e=>{
 const en=e.target.closest('.enemy[data-ei]');if(en&&S.phase==='fight'){S.target=+en.dataset.ei;sfx.click();render();return;}
 const a=e.target.closest('[data-act]');if(a){const k=a.dataset.act;if(k==='end')endTurn();else if(k==='forge')forge();else if(k==='go')leaveRest();else if(k==='restart'){S={phase:'start'};render();}else if(k==='closebook')closeOv();return;}
 const bu=e.target.closest('[data-buy]');if(bu){buy(bu.dataset.buy);return;}
 const tk=e.target.closest('[data-take]');if(tk){takeReward(tk.dataset.take);return;}
 const ev=e.target.closest('[data-ev]');if(ev){chooseEvent(+ev.dataset.ev);return;}
 const j=e.target.closest('[data-job]');if(j){au();newGame(JOBS[+j.dataset.job]);return;}
});
function closeOv(){$('overlay').classList.remove('on');}
$('bookBtn').addEventListener('click',()=>{const ov=$('overlay');ov.innerHTML=bookHtml();ov.classList.add('on');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){S.sel=null;closeOv();if(S.phase!=='start')render();}
 if(S.phase==='fight'&&!busy){if(e.key===' '||e.key==='e'){e.preventDefault();endTurn();}const n=+e.key;if(n>=1&&n<=9)playCard(n-1);}});
