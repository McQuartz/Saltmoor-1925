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
  const hv=hoverVorschau(e.target);const fd=S.phase==='fight'&&e.target.closest('.feind[data-ei]');const kt=e.target.closest('.kn,.kstart,.kbieg');const ktt=kt?karteTip(kt):'';if(ktt)showTip(ktt,e.clientX,e.clientY);else if(hv)showTip(hv,e.clientX,e.clientY);else if(fd&&!cd)showTip(feindTip(+fd.dataset.ei),e.clientX,e.clientY);else if(sl&&sl.dataset.loc!=='trash'&&getAt(sl.dataset.loc))showTip(itemTip(sl.dataset.loc),e.clientX,e.clientY);else hideTip();
  const hi=cd?+cd.dataset.card:-1;if(hi!==hoverCard){hoverCard=hi;setVorschau(hi,-1);}}
 if(!down||!down.has)return;if(!down.drag&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down.drag=true;hideTip();$('ghost').src=itemBild(getAt(down.loc).id);$('ghost').style.display='block';}
 if(down.drag){$('ghost').style.left=(e.clientX-20)+'px';$('ghost').style.top=(e.clientY-20)+'px';}});
document.addEventListener('pointerup',e=>{
 if(cdrag){const d=cdrag;cdrag=null;$('aim').style.display='none';const ei=AIM.ei;AIM.ei=-1;$('szene').classList.remove('drop');vorschau=null;hoverCard=-1;
  if(!d.moved){if(spiegelWahl){spiegelWahl=false;Bieg.spiegelTausch(d.i);render();return;}playCard(d.i);return;}
  if(d.tg){if(ei>=0)playCard(d.i,ei);else if(alive().length===1&&inScene(e.clientX,e.clientY))playCard(d.i);else render();}
  else{if(inScene(e.clientX,e.clientY))playCard(d.i);else render();}return;}
 if(!down)return;const d=down;down=null;$('ghost').style.display='none';
 const t=document.elementFromPoint(e.clientX,e.clientY);const sl=t&&t.closest('[data-loc]');
 if(d.drag){if(sl)move(d.loc,sl.dataset.loc);S.sel=null;render();return;}
 if(!sl||sl.dataset.loc!==d.loc)return;const loc=d.loc;
 if(S.sel){const s=S.sel;S.sel=null;if(s!==loc)move(s,loc);else render();}else if(loc!=='trash'&&getAt(loc)){S.sel=loc;sfx.click();render();}});
document.addEventListener('click',e=>{
 const en=e.target.closest('.feind[data-ei]');if(en&&S.phase==='fight'){S.target=+en.dataset.ei;sfx.click();render();return;}
 const a=e.target.closest('[data-act]');if(a){aktion(a.dataset.act,a);return;}
 const bw=e.target.closest('[data-biom]');if(bw){chooseBiom(+bw.dataset.biom);return;}
 const w=e.target.closest('[data-weg]');if(w){hideTip();chooseWeg(+w.dataset.weg);return;}
 const bu=e.target.closest('[data-buy]');if(bu){buy(bu.dataset.buy);return;}
 const ks=e.target.closest('[data-ksel]');if(ks){S.sel=S.sel===ks.dataset.ksel?null:ks.dataset.ksel;sfx.click();render();return;}
 const kz=e.target.closest('[data-kzeig]');if(kz&&KOE){KOE.zeig=+kz.dataset.kzeig;koerperRender();return;}
 const hgp=e.target.closest('[data-hg]');if(hgp){takeHandgriff(hgp.dataset.hg);return;}
 const rz=e.target.closest('[data-ritz]');if(rz){const uid=+rz.dataset.ritz;if(rz.dataset.k!=null){S.ueberschreiben={uid,k:+rz.dataset.k,alt:hgVon(itemByUid(uid))[+rz.dataset.k]};render();}else placeHandgriff(uid);return;}
 const kb=e.target.closest('[data-kerbe]');if(kb){kerbeDazu(+kb.dataset.kerbe);return;}
 const tg=e.target.closest('[data-tilgen]');if(tg){if(Farbe.tilgen(+tg.dataset.tilgen))wahlFertig();return;} // M8
 const sl2=e.target.closest('[data-schleif]');if(sl2){schleifen(+sl2.dataset.schleif,sl2.dataset.key);return;}
 const uq=e.target.closest('[data-umquelle]');if(uq){S.umritzQuelle={uid:+uq.dataset.umquelle,k:+uq.dataset.k};render();return;}
 const uz=e.target.closest('[data-umziel]');if(uz){const q=S.umritzQuelle;S.umritzQuelle=null;umritzen(q.uid,q.k,+uz.dataset.umziel);return;}
 const bh=e.target.closest('[data-buyhg]');if(bh){kaufeHandgriff(+bh.dataset.buyhg);return;}
 const en3=e.target.closest('[data-entf]');if(en3){entferneHandgriff(+en3.dataset.entf,+en3.dataset.k);return;}
 const tk=e.target.closest('[data-take]');if(tk){takeReward(tk.dataset.take);return;}
 const ev=e.target.closest('[data-ev]');if(ev&&!ev.disabled){chooseEvent(+ev.dataset.ev);return;}
 const st=e.target.closest('[data-strike]');if(st){const sv=st.dataset.strike;const uid=sv.startsWith('lose:')?sv:+sv;if(S.phase==='kraemer_streichen')kraemerStrike(uid);else strikeItem(uid);return;}
 const j=e.target.closest('[data-job]');if(j){starteRun(j.dataset.job);return;}
 const sv=e.target.closest('[data-start]');if(sv){S.wahlStart=sv.dataset.start||null;render();return;}
 const sf=e.target.closest('[data-stufe]');if(sf){S.wahlStufe=+sf.dataset.stufe;render();return;}
 const en2=e.target.closest('[data-ende]');if(en2){chooseEnde(en2.dataset.ende);return;}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.einst;if(!k)return;const v=e.target.type==='checkbox'?e.target.checked:e.target.tagName==='SELECT'?+e.target.value:+e.target.value;Einst.set(k,v);});
function aktion(k,el){switch(k){
 case'end':spiegelWahl=false;endTurn();break;case'hinsehen':Blick.waehlen(true);break;case'wegsehen':Blick.waehlen(false);break;case'spiegel':spiegelWahl=!spiegelWahl;render();break;case'forge':forge();break;case'leave':leaveNode();break;case'weiterReward':leaveReward();break;
 case'karte':karteUmschalten();break; case'weiter':leaveUebergang();break;case'neu':S={phase:'figur',wahlStufe:Meta.get().stufe||0};render();break;case'titel':S={phase:'titel'};render();break;
 case'fortsetzen':loadRun();render();break;case'rastHeil':rastHeal();break;case'fund':takeFund();break;
 case'skipstrike':skipStrike();break;case'kstrike0':kraemerStrike(null);break;
 case'buch':zeigeOverlay(buchHtml());break;case'tagebuch':zeigeOverlay(tagebuchHtml());break;case'einst':zeigeOverlay(einstHtml());break;case'zu':closeOv();break;
 case'gleicherSeed':{const sd=S.seed,jb=S.job;newRun(jb,sd,{});render();break;}
 case'bildSpeichern':endbildSpeichern();break;
 case'rucksack':rucksackAuf();break;case'rucksackZu':rucksackZu();break;
 case'hgSkip':skipHandgriff();break;case'hgVerwerfen':hgVerwerfen();break;
 case'ueberJa':{const u=S.ueberschreiben;S.ueberschreiben=null;placeHandgriff(u.uid,u.k);break;}case'ueberNein':S.ueberschreiben=null;render();break;
 case'wsKerbe':wahlStart('kerbe','werkstatt');break;case'wsSchleifen':wahlStart('schleifen','werkstatt');break;case'wsTilgen':wahlStart('tilgen','werkstatt');break;
 case'rastSchleifen':wahlStart('schleifen','rast');break;case'rastUmritzen':S.umritzQuelle=null;wahlStart('umritzen','rast');break;case'wahlAbbruch':S.umritzQuelle=null;wahlAbbrechen();break;
 case'verkaufen':if(S.sel){verkaufen(S.sel);S.sel=null;render();}break;
 case'devToggle':if(typeof Dev!=='undefined')Dev.toggle();break;}}
function starteRun(job){const st=S.wahlStufe||0;const q=new URLSearchParams(location.search);const seed=q.get('seed')!=null&&!S.seedUsed?+q.get('seed'):neuerSeed();
 const start=S.wahlStart||null;newRun(job,seed,{dev:typeof Dev!=='undefined'&&Dev.cheat,stufe:st,start});Meta.get().stufe=st;Meta.save();render();}
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;
 if(e.key==='Escape'){if(KOE){rucksackZu();return;}S.sel=null;karteZu();closeOv();render();}
 if((e.key==='m'||e.key==='M')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat)karteUmschalten();
 if(e.key==='d'||e.key==='D'){if(typeof Dev!=='undefined')Dev.toggle();}
 if((e.key==='r'||e.key==='R')&&!e.ctrlKey&&!e.metaKey&&!e.repeat&&S.route&&(canEquip()||S.phase==='fight')){if(KOE)rucksackZu();else rucksackAuf();}
 if(S.phase==='fight'&&!busy){if(e.key===' '||e.key==='e'){e.preventDefault();endTurn();}const n=+e.key;if(n>=1&&n<=9)playCard(n-1);}
 if(S.phase==='uebergang'&&!['Shift','Control','Alt','Meta','d','D'].includes(e.key))leaveUebergang();});
// Tooltips
function showTip(h,x,y){const tip=$('tip');tip.innerHTML=h;tip.style.display='block';const w=tip.offsetWidth,hh=tip.offsetHeight;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,x+16))+'px';tip.style.top=(y+hh+24>innerHeight?y-hh-12:y+18)+'px';}
function hideTip(){$('tip').style.display='none';}
function itemTip(loc){const it=getAt(loc);if(!it)return'';const d=def(it);const[k]=loc.split(':');
 let h=`<div class="tn">${esc(d.n)}</div><div>${d.st.map(k=>gi(k,18)).join('')}</div><div class="hint">${AREA_N[d.a]}${d.hp?' · +'+d.hp+' max. Leben':''}</div>`;
 h+=d.cards.map(c=>`<div>${esc(c.n)} (${c.c}): ${esc(cardText(c))}</div>`).join('');if(d.passiv)h+=`<div>${esc(passivText(d.passiv))}</div>`;
 const rs2=ROLES.filter(r=>(d.bases||[it.id]).some(b=>r.i.includes(b)));if(rs2.length)h+=`<div class="hint">Teil von: ${rs2.map(r=>r.n).join(', ')}</div>`;
 if(it.x)h+='<div class="hint">Gestrichen: gibt keine Karte mehr.</div>';if(k==='bag'||k==='bench')h+='<div class="hint">Nicht angelegt: bringt keine Karten.</div>';
 if(S.phase==='rast'&&!S.rastDone)h+='<div class="tn">Klicken: verbessern</div>';return h;}

// Endbildschirm als PNG speichern (Szene + Statistik als Text)
function endbildSpeichern(){const c=document.createElement('canvas');c.width=960;c.height=540;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(BU.cv,0,0,960,540);
 g.fillStyle='rgba(0,0,0,.78)';g.fillRect(40,40,880,460);g.fillStyle='#efe4c8';g.font='28px serif';const r=S.ergebnis||{},st=S.stats||{};g.fillText('SALTMOOR 1925 · '+(r.sieg?(r.ende==='bleiben'?'Geblieben':'Umgekehrt'):'Am Strand'),70,90);
 g.font='20px serif';const L=[`${S.jobN} · Seed ${S.seed} · ${dauerText((st.endeT||Date.now())-S.startT)}`,`Weg: ${S.route.filter(Boolean).map(b=>BIOMES[b].kurz).join(' → ')}`,`Tiefe ${r.tiefe||S.depth} · Kämpfe ${st.kaempfe||0} · Gold ${st.gold||0}`,`Schaden ${st.schadenRaus||0} / ${st.schadenRein||0} · höchster Treffer ${st.maxTreffer||0} · längste Kette ${st.maxKette||0}`,`Build: ${buildArchetyp().n} · Reaktionen ${S.disc.size}`,`Deck: ${allActive().map(it=>def(it).n).join(', ')}`];
 L.forEach((t,i)=>g.fillText(t,70,140+i*40,820));const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=`saltmoor-${S.seed}.png`;a.click();}
