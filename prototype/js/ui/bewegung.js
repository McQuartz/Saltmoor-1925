// Auftrag 4, Phase 3: Bewegung der Kampfoberfläche (Look-Runde 1).
// Austeilen vom Ziehstapel mit Umdrehen (CSS, Startpunkt je Karte in --sx/--sy), Ausspielen mit Ausholen und Flug zum Ziel oder zum Leben,
// am Zugende fliegt die Hand zur Ablage, Energie-Rauten erlöschen beim Bezahlen und leuchten zu Zugbeginn nacheinander auf,
// Reaktionen schlagen als Stempel ein, Splitter in Zonenfarbe beim Aufprall. Hitstop und Schadenszahl kommen aus feedback.js (FX.hit, floatScene).
// Nichts hier hält das Spiel an: Flüge sind Klone über der Oberfläche, die Regeln laufen sofort weiter, Klicks gehen nie verloren.
const BW={en:null,turn:-1};
const bwAus=()=>typeof FAST!=='undefined'&&FAST||matchMedia('(prefers-reduced-motion: reduce)').matches;
function bwEbene(){let f=document.getElementById('flug');if(!f){f=document.createElement('div');f.id='flug';document.getElementById('spiel').appendChild(f);}return f;}
// Punkt auf dem Bildschirm → Oberflächenpixel in #spiel
function bwUi(x,y){const r=document.getElementById('spiel').getBoundingClientRect();const s=r.width/480;return[(x-r.left)/s,(y-r.top)/s];}
function bwMitte(el){if(!el)return null;const r=el.getBoundingClientRect();return bwUi(r.left+r.width/2,r.top+r.height/2);}
// Klon einer Handkarte an ihrer Stelle in der Flugebene
function bwKlon(el){const [cx,cy]=bwMitte(el);const k=el.cloneNode(true);k.removeAttribute('data-card');k.classList.remove('neu','zielt','zieht');k.classList.add('flug');
 const rot=getComputedStyle(el).rotate;k.style.cssText=`left:calc(var(--u)*${(cx-25).toFixed(2)});top:calc(var(--u)*${(cy-35).toFixed(2)});--r0:${rot==='none'?'0deg':rot}`;bwEbene().appendChild(k);return{k,cx,cy};}
// Ausspielen: holt kurz aus (nach unten), fliegt zum Ziel oder zum eigenen Leben und löst sich auf
function kartenFlug(el,ei){if(bwAus()||!el)return;try{
 const c=S.hand[+el.dataset.card];const ziel=ei!=null&&ei>=0?document.querySelector(`#gegner .feind[data-ei="${ei}"] .pl-box`):null;
 const selbst=c&&!c.atk&&!c.poison&&!c.burn&&!c.vuln&&!c.weak;
 const zp=bwMitte(ziel||(selbst?document.querySelector('#spieler2 .sbar'):document.querySelector('#gegner .feind.ziel .pl-box'))||document.querySelector('#spieler2'));if(!zp)return;
 const {k,cx,cy}=bwKlon(el);const dx=zp[0]-cx,dy=zp[1]-cy+(ziel||!selbst?18:0);const u=v=>`calc(var(--u)*${v.toFixed(1)})`;
 const a=k.animate([{transform:`rotate(var(--r0)) scale(1.07)`,opacity:1,filter:'brightness(1.18)'},{transform:`translate(0,${u(7)}) rotate(var(--r0)) scale(1.04)`,opacity:1,offset:.22},
  {transform:`translate(${u(dx*.85)},${u(dy*.85)}) rotate(0deg) scale(.55)`,opacity:1,filter:'brightness(1.6)',offset:.78},{transform:`translate(${u(dx)},${u(dy)}) rotate(0deg) scale(.3)`,opacity:0,filter:'brightness(3)'}],
  {duration:360,easing:'cubic-bezier(.4,0,.2,1)'});a.onfinish=()=>k.remove();setTimeout(()=>k.remove(),600);}catch(e){}}
// Zugende: die Hand fliegt zur Ablage
function handAbwerfen(){if(bwAus())return;const ab=document.getElementById('ablage')||document.getElementById('ziehen');const zp=bwMitte(ab);if(!zp)return;
 [...document.querySelectorAll('#hand .karte')].forEach((el,i)=>{try{const {k,cx,cy}=bwKlon(el);const u=v=>`calc(var(--u)*${v.toFixed(1)})`;
  const a=k.animate([{transform:'rotate(var(--r0))',opacity:1},{transform:`translate(${u(zp[0]-cx)},${u(zp[1]-cy)}) rotate(12deg) scale(.32)`,opacity:.2}],{duration:260,delay:i*28,easing:'cubic-bezier(.5,0,.8,.4)',fill:'backwards'});
  a.onfinish=()=>k.remove();setTimeout(()=>k.remove(),900);}catch(e){}});}
// Austeilen: Startpunkt jeder Karte relativ zu ihrer Lage im Fächer (Mitte des Ziehstapels 16, 246)
function austeilenStil(i,n,L,m){const hb=L.base,fx=m*L.step,fy=m*m*L.arc;return`--sx:${(16-(240+fx)).toFixed(1)};--sy:${(246-(270-hb+fy-35)).toFixed(1)};--d:${i*70}ms;`;}
// Energie: welche Rauten gerade erlöschen oder aufleuchten (verglichen mit dem letzten Bild)
function rautenKlassen(E){const alt=BW.en,neu=S.energy,zug=S.turnNo;BW.en=neu;const neuerZug=BW.turn!==zug;BW.turn=zug;
 return [...Array(E)].map((_,i)=>{const an=i<neu;if(alt==null)return{c:an?'':'aus',d:0};
  if(neuerZug&&an&&!bwAus())return{c:'zuend',d:i*110};
  if(!an&&i<alt&&!bwAus())return{c:'aus erlischt',d:0};if(an&&i>=alt&&!bwAus())return{c:'zuend',d:(i-alt)*110};return{c:an?'':'aus',d:0};});}
// Reaktionen als Stempel über der Hand (Hochreaktionen haben ihren Zwischentitel)
if(typeof Bus!=='undefined')Bus.on('reaction',({r,keys,hoch})=>{if(bwAus()||hoch||!r)return;const hud=document.getElementById('hud');if(!hud)return;
 const s=document.createElement('div');s.className='stempel px9';s.style.setProperty('--c',(ST[keys&&keys[0]]||{}).c||'#e8c547');s.style.setProperty('--sr',((Math.random()*6-3)|0)+'deg');
 s.innerHTML=`${(keys||[]).map(k=>gi(k,KZ())).join('<i>+</i>')}<b>${esc(String(r.n).toUpperCase())}</b>`;hud.querySelectorAll('.stempel').forEach(x=>x.remove());hud.appendChild(s);setTimeout(()=>s.remove(),1300);});
// Splitter in Zonenfarbe beim Aufprall
if(typeof Bus!=='undefined')Bus.on('enemy_hit',({e,d})=>{if(bwAus()||!(d>0)||typeof burst!=='function')return;const b=enemyBox(e);const z=(typeof BST!=='undefined'&&BST.rim)||'#e8c547';burst(b.x,b.y-Math.round(b.h*.55),z,Math.min(14,4+d),2.2,.4);});
