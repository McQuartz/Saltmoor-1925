// Eingabe: Karten ziehen und zielen (mit Schadens-Vorschau), Items verschieben, Knöpfe, Tastatur.
const AIM={ei:-1};let down=null,cdrag=null,hoverCard=-1;
function enemyAt(x,y){const els=document.elementsFromPoint(x,y);for(const t of els){const en=t.closest&&t.closest('.feind[data-ei]');if(en)return +en.dataset.ei;}
 // auch direkt auf dem Sprite (Canvas): nächster Gegner zur Mausposition
 const r=BU.cv.getBoundingClientRect();if(x<r.left||x>r.right||y<r.top||y>r.bottom)return-1;const sx=(x-r.left)/r.width*SW,sy=(y-r.top)/r.height*SH;let best=-1,bd=1e9;
 (S.enemies||[]).forEach((e,i)=>{if(e.hp<=0)return;const b=enemyBox(e);if(sx>b.x-b.w/2&&sx<b.x+b.w/2&&sy>b.kopf&&sy<b.y+6){const d=Math.abs(sx-b.x);if(d<bd){bd=d;best=i;}}});return best;}
function inScene(x,y){const r=$('szene').getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom-20;}
// Vorschau für Handkarte i auf Ziel ei (oder aktuelles Ziel)
function setVorschau(i,ei){if(S.phase!=='fight'||busy||i<0||!S.hand[i]){if(vorschau){vorschau=null;$('gegner').innerHTML=gegnerHtml(true);$('kopf').innerHTML=kopfHtml();}return;}
 const c=S.hand[i];const t=needsTarget(c)?(ei>=0?ei:S.target):null;vorschau=previewCard(i,t);if(vorschau)vorschau.i=i;$('gegner').innerHTML=gegnerHtml(true);
 if(typeof Dev!=='undefined'&&Dev.an)Dev.render();}
document.addEventListener('pointerdown',e=>{startAudio();
 const cd=e.target.closest('[data-card]');
 if(cd&&S.phase==='fight'&&!busy){const i=+cd.dataset.card;const c=S.hand[i];if(!c)return;const r=cd.getBoundingClientRect();cdrag={i,el:cd,x0:e.clientX,y0:e.clientY,moved:false,tg:needsTarget(c),ox:r.left+r.width/2,oy:r.top+10};e.preventDefault();return;}
 const sl=e.target.closest('[data-loc]');if(!sl)return;const loc=sl.dataset.loc;down={loc,x:e.clientX,y:e.clientY,drag:false,has:loc!=='trash'&&!!getAt(loc)};});
document.addEventListener('pointermove',e=>{
 if(cdrag){const d=cdrag;if(!d.moved&&Math.hypot(e.clientX-d.x0,e.clientY-d.y0)>6){d.moved=true;hideTip();sfx.card();d.el.classList.add(d.tg?'zielt':'zieht');if(d.tg){$('aim').style.display='block';}}
  if(!d.moved)return;
  if(d.tg){const ei=enemyAt(e.clientX,e.clientY);if(ei!==AIM.ei){AIM.ei=ei;setVorschau(d.i,ei);}const col=ei>=0?'#d84a3a':'#c8a24a';const sx=d.ox,sy=d.oy,qx=sx+(e.clientX-sx)*.15,qy=Math.min(sy,e.clientY)-60;
   $('aimp').setAttribute('d',`M${sx},${sy} Q${qx},${qy} ${e.clientX},${e.clientY}`);$('aimp').setAttribute('stroke',col);$('aimh').setAttribute('fill',col);const ang=Math.atan2(e.clientY-qy,e.clientX-qx)*180/Math.PI;$('aimh').setAttribute('transform',`translate(${e.clientX},${e.clientY}) rotate(${ang})`);}
  else{d.el.style.transform=`translate(${(e.clientX-d.x0)/(BU.s||1)}px,${(e.clientY-d.y0)/(BU.s||1)}px) rotate(${(e.clientX-d.x0)*.03}deg) scale(1.06)`;$('szene').classList.toggle('drop',inScene(e.clientX,e.clientY));}
  return;}
 if(!down&&e.target.closest){const sl=e.target.closest('.slot[data-loc]');const cd=e.target.closest('[data-card]');
  if(sl&&sl.dataset.loc!=='trash'&&getAt(sl.dataset.loc))showTip(itemTip(sl.dataset.loc),e.clientX,e.clientY);else hideTip();
  const hi=cd?+cd.dataset.card:-1;if(hi!==hoverCard){hoverCard=hi;setVorschau(hi,-1);}}
 if(!down||!down.has)return;if(!down.drag&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down.drag=true;hideTip();$('ghost').src=spr(def(getAt(down.loc)).spr);$('ghost').style.display='block';}
 if(down.drag){$('ghost').style.left=(e.clientX-20)+'px';$('ghost').style.top=(e.clientY-20)+'px';}});
document.addEventListener('pointerup',e=>{
 if(cdrag){const d=cdrag;cdrag=null;$('aim').style.display='none';const ei=AIM.ei;AIM.ei=-1;$('szene').classList.remove('drop');vorschau=null;hoverCard=-1;
  if(!d.moved){playCard(d.i);return;}
  if(d.tg){if(ei>=0)playCard(d.i,ei);else if(alive().length===1&&inScene(e.clientX,e.clientY))playCard(d.i);else render();}
  else{if(inScene(e.clientX,e.clientY))playCard(d.i);else render();}return;}
 if(!down)return;const d=down;down=null;$('ghost').style.display='none';
 const t=document.elementFromPoint(e.clientX,e.clientY);const sl=t&&t.closest('[data-loc]');
 if(d.drag){if(sl)move(d.loc,sl.dataset.loc);S.sel=null;render();return;}
 if(!sl||sl.dataset.loc!==d.loc)return;const loc=d.loc;
 if(S.phase==='rast'&&!S.rastDone&&loc!=='trash'&&getAt(loc)){rastUpgrade(loc);return;}
 if(S.sel){const s=S.sel;S.sel=null;if(s!==loc)move(s,loc);else render();}else if(loc!=='trash'&&getAt(loc)){S.sel=loc;sfx.click();render();}});
document.addEventListener('click',e=>{
 const en=e.target.closest('.feind[data-ei]');if(en&&S.phase==='fight'){S.target=+en.dataset.ei;sfx.click();render();return;}
 const a=e.target.closest('[data-act]');if(a){aktion(a.dataset.act,a);return;}
 const bw=e.target.closest('[data-biom]');if(bw){chooseBiom(+bw.dataset.biom);return;}
 const w=e.target.closest('[data-weg]');if(w){chooseWeg(+w.dataset.weg);return;}
 const bu=e.target.closest('[data-buy]');if(bu){buy(bu.dataset.buy);return;}
 const tk=e.target.closest('[data-take]');if(tk){takeReward(tk.dataset.take);return;}
 const ev=e.target.closest('[data-ev]');if(ev&&!ev.disabled){chooseEvent(+ev.dataset.ev);return;}
 const st=e.target.closest('[data-strike]');if(st){const uid=+st.dataset.strike;if(S.phase==='kraemer_streichen')kraemerStrike(uid);else strikeItem(uid);return;}
 const j=e.target.closest('[data-job]');if(j){starteRun(j.dataset.job);return;}
 const sv=e.target.closest('[data-start]');if(sv){S.wahlStart=sv.dataset.start||null;render();return;}
 const sf=e.target.closest('[data-stufe]');if(sf){S.wahlStufe=+sf.dataset.stufe;render();return;}
 const en2=e.target.closest('[data-ende]');if(en2){chooseEnde(en2.dataset.ende);return;}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.einst;if(!k)return;const v=e.target.type==='checkbox'?e.target.checked:e.target.tagName==='SELECT'?+e.target.value:+e.target.value;Einst.set(k,v);});
function aktion(k,el){switch(k){
 case'end':endTurn();break;case'forge':forge();break;case'leave':leaveNode();break;case'weiterReward':leaveReward();break;
 case'weiter':leaveUebergang();break;case'neu':S={phase:'figur',wahlStufe:Meta.get().stufe||0};render();break;case'titel':S={phase:'titel'};render();break;
 case'fortsetzen':loadRun();render();break;case'rastHeil':rastHeal();break;case'fund':takeFund();break;
 case'skipstrike':skipStrike();break;case'kstrike0':kraemerStrike(null);break;
 case'buch':zeigeOverlay(buchHtml());break;case'tagebuch':zeigeOverlay(tagebuchHtml());break;case'einst':zeigeOverlay(einstHtml());break;case'zu':closeOv();break;
 case'devToggle':if(typeof Dev!=='undefined')Dev.toggle();break;}}
function starteRun(job){const st=S.wahlStufe||0;const q=new URLSearchParams(location.search);const seed=q.get('seed')!=null&&!S.seedUsed?+q.get('seed'):neuerSeed();
 const start=S.wahlStart||null;newRun(job,seed,{dev:typeof Dev!=='undefined'&&Dev.cheat,stufe:st,start});Meta.get().stufe=st;Meta.save();render();}
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;
 if(e.key==='Escape'){S.sel=null;closeOv();render();}
 if(e.key==='d'||e.key==='D'){if(typeof Dev!=='undefined')Dev.toggle();}
 if(S.phase==='fight'&&!busy){if(e.key===' '||e.key==='e'){e.preventDefault();endTurn();}const n=+e.key;if(n>=1&&n<=9)playCard(n-1);}
 if(S.phase==='uebergang'&&(e.key===' '||e.key==='Enter'))leaveUebergang();});
// Tooltips
function showTip(h,x,y){const tip=$('tip');tip.innerHTML=h;tip.style.display='block';const w=tip.offsetWidth,hh=tip.offsetHeight;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,x+16))+'px';tip.style.top=(y+hh+24>innerHeight?y-hh-12:y+18)+'px';}
function hideTip(){$('tip').style.display='none';}
function itemTip(loc){const it=getAt(loc);if(!it)return'';const d=def(it);const[k]=loc.split(':');
 let h=`<div class="tn">${esc(d.n)}</div><div>${d.st.map(k=>gi(k,18)).join('')}</div><div class="hint">${AREA_N[d.a]}${d.hp?' · +'+d.hp+' max. Leben':''}</div>`;
 h+=d.cards.map(c=>`<div>${esc(c.n)} (${c.c}): ${esc(cardText(c))}</div>`).join('');if(d.passiv)h+=`<div>${esc(passivText(d.passiv))}</div>`;
 const rs2=ROLES.filter(r=>(d.bases||[it.id]).some(b=>r.i.includes(b)));if(rs2.length)h+=`<div class="hint">Teil von: ${rs2.map(r=>r.n).join(', ')}</div>`;
 if(it.x)h+='<div class="hint">Gestrichen: gibt keine Karte mehr.</div>';if(k==='bag'||k==='bench')h+='<div class="hint">Nicht angelegt: bringt keine Karten.</div>';
 if(S.phase==='rast'&&!S.rastDone)h+='<div class="tn">Klicken: verbessern</div>';return h;}
