// Rucksack „Am Körper“ (Auftrag 3 M4, docs/auftrag-3/05-oberflaeche.md Abschnitt 8).
// Ersetzt den Rucksackmodus aus Auftrag 2 und die alte Itemleiste außerhalb des Kampfes.
// Mitte: die Figur als dunkle Silhouette im Nebel (assets/figuren/<figur>.png, gebaut mit tools/sprites/figuren.js),
// Fächer am Körper (Talismane Reihe am Hals, Kleidung 2×2 am Leib, Waffen Säule an der Hand) mit gepunkteten Linien zu den
// Anschlusspunkten aus jobs.json → koerper. Rechts das gewählte Item mit seinen Karten und das Deck mit Stoff-Balken und
// Änderungen seit dem Öffnen (grün rein, rot raus). Unten der Rucksack als Holz-Footer.
// Bedienung über die gleichen Orte wie überall (data-loc, S.sel, move() in run.js): Ziehen tauscht, Klicken wählt nur aus (Spieltest 2026-11-09). Im Kampf nur lesend.
// Liest den Zustand, ändert ihn nie selbst; jede Änderung läuft über move(), verkaufen() usw.
let KOE=null; // {lesen, alt: Kartenzählung beim Öffnen, zeig: uid des gezeigten Items}
const KOE_GROESSE={w:110,h:172}; // Leinwand der Silhouetten (tools/sprites/figuren.js)
// Lage der Fächer in Szenen-Pixeln (480 × 362, 1 = ein Pixel der Szene), Figur steht bei FIG
const KOE_FIG={x:122,y:66};
const KOE_FACH={talisman:{x:200,y:30,art:'reihe'},kleidung:{x:244,y:122,art:'block'},waffe:{x:20,y:84,art:'saeule'}};
const KOE_ANKER={talisman:'hals',kleidung:'leib',waffe:'hand'};

function rucksackAuf(o={}){if(!S.route)return;const lesen=!canEquip();if(lesen&&S.phase!=='fight')return;
 KOE={lesen,alt:koeZaehlung(deckListe()),zeig:o.uid||null};S.sel=null;hideTip&&hideTip();koerperRender();sfx&&sfx.click&&sfx.click();}
function rucksackZu(){if(!KOE)return;KOE=null;S.sel=null;const el=$('koerper');if(el){el.classList.remove('an');el.innerHTML='';}$('spiel').classList.remove('koe');koeNebelStop();render();}
// Karten eines Decks gezählt nach Name und Herkunft (für Grün/Rot)
function koeZaehlung(karten){const m=new Map();karten.forEach(c=>{const k=c.n+'\u0001'+(c.src||'');m.set(k,(m.get(k)||0)+1);});return m;}
function koeDiff(){const neu=koeZaehlung(deckListe());const rein=[],raus=[];
 neu.forEach((n,k)=>{const d=n-(KOE.alt.get(k)||0);if(d>0)rein.push({k,n:d});});KOE.alt.forEach((n,k)=>{const d=n-(neu.get(k)||0);if(d>0)raus.push({k,n:d});});return{rein,raus};}
function koeFigur(){return JOBS.find(j=>j.id===S.job)||JOBS[0];}
function koeItemByUid(uid){if(uid==null)return null;for(const b of besitz())if(b.it.uid===uid)return b;for(let i=0;i<(S.bench||[]).length;i++){const it=S.bench[i];if(it&&it.uid===uid)return{it,loc:'bench:'+i,an:false};}return null;}

// Ein Platz: data-loc nur, wenn nicht lesend; „ziel“, wenn das gewählte Item hierher passt
function koeSlot(loc,{zu=false,klein=false}={}){const it=zu?null:getAt(loc);const D=it&&def(it);const sel=S.sel===loc;
 const ziel=false; // Spieltest 2026-11-09: kein Tausch per Klick mehr, also keine Ziel-Markierung nach dem Auswählen
 const rar=D?rarOf(D):'';const zeig=it&&KOE.zeig===it.uid;
 const kerben=it&&!it.x?[...Array(kerbenVon(it))].map((_,k)=>{const st=D.st[k%Math.max(1,D.st.length)];const col=st&&ST[st]?ST[st].c:'#b08a4a';return `<i class="${hgVon(it)[k]?'voll':''}" style="--k:${col}"></i>`;}).join(''):'';
 const attr=zu?'':KOE.lesen?(it?`data-kzeig="${it.uid}"`:''):`data-loc="${loc}"`;
 return `<div class="kslot ${zu?'zu':''} ${sel?'sel':''} ${ziel?'ziel':''} ${zeig?'zeig':''} ${rar&&rar!=='gewoehnlich'?'selten':''} ${rar==='reliquie'?'reliquie':''} ${it&&it.x?'gestrichen':''} ${klein?'klein':''}" ${attr}>
 ${zu?KOE_SCHLOSS:D?`<img src="${itemBild(it.id)}" alt="${esc(D.n)}" draggable="false" data-fuid="${it.uid}">${D.st.length?`<span class="kss">${D.st.map(k=>gi(k,KZ())).join('')}</span>`:''}<span class="kkb">${kerben}</span>`:''}</div>`;}
// Schloss aus Pixeln (7 × 8), scharf in jeder Größe
const KOE_SCHLOSS=`<svg class="schloss" viewBox="0 0 7 8" shape-rendering="crispEdges"><path fill="#5a4626" d="M2 0h3v1h1v3H5V1H2v3H1V1h1z"/><path fill="#7a6036" d="M0 3h7v5H0z"/><path fill="#2a2012" d="M3 5h1v2H3z"/></svg>`;

function koeFach(a){const F=KOE_FACH[a];const M=BAL.max_slots;const n=act(a).length;
 const plaetze=[...Array(M).keys()].map(i=>koeSlot(a+':'+i,{zu:i>=S.slots[a]})).join('');
 return `<div class="fach ${F.art}" data-fach="${a}" style="left:calc(var(--u)*${F.x});top:calc(var(--u)*${F.y})"><h4>${esc(AREA_N[a])} <em>${S.slots[a]}/${M}</em></h4><div class="fp">${plaetze}</div></div>`;}

// Kleine Karte im Stil des HUD (ohne Hand-Index, ohne Reaktions-Band)
function koeKarte(c){return `<div class="karte mini ${c.st.length>1?'duo':''} ${c.hg?'handgriff':''}"><div class="kost"><span>${c.x?'X':cardCost(c)}</span></div><div class="kst">${c.st.map(k=>gi(k,KZ())).join('')}</div>
 <div class="kn">${esc(c.n).toUpperCase()}</div><div class="bogen"><img src="${c.img||(typeof spr==='function'?spr(c.spr):'')}" alt="">${c.hg?'<span class="hgm" title="Handgriff">✋</span>':''}${c.schliff?'<span class="schl" title="geschliffen">◇</span>':''}</div><div class="kt">${esc(cardText(c))}</div></div>`;}

function koeRechts(){const b=koeItemByUid(KOE.zeig);let oben='';
 if(b){const it=b.it,D=def(it);const rar={gewoehnlich:'Gewöhnlich',selten:'Selten',reliquie:'Reliquie'}[rarOf(D)]||'';
  const karten=kartenVon(it);const einm=[];const seen=new Map();karten.forEach(c=>{const k=c.n+(c.hg||'');if(seen.has(k))seen.get(k).anz++;else{const o={c,anz:1};seen.set(k,o);einm.push(o);}});
  const ort=b.loc.startsWith('bag')?'Im Rucksack: bringt keine Karten.':b.loc.startsWith('bench')?'Auf der Werkbank.':!b.an?'Gesperrter Platz.':'';
  const rs2=ROLES.filter(r=>(D.bases||[it.id]).some(x=>r.i.includes(x)));
  oben=`<div class="kitem"><div class="kin"><b>${esc(D.n)}</b> ${D.st.map(k=>gi(k,KZ())).join('')}</div><div class="kia">${rar} · ${esc(AREA_N[D.a]||'')}${D.hp?` · +${D.hp} Leben`:''}</div>
  ${D.eigen?`<div class="kie"><i>${esc(eigenText(D.eigen))}</i></div>`:''}${D.passiv?`<div class="kie">${esc(passivText(D.passiv))}</div>`:''}${rs2.length?`<div class="kia">Teil von: ${rs2.map(r=>esc(r.n)).join(', ')}</div>`:''}
  ${ort?`<div class="kia">${ort}</div>`:''}<div class="kkarten">${einm.map(o=>`<div class="kkw">${koeKarte(o.c)}${o.anz>1?`<span class="anz">×${o.anz}</span>`:''}</div>`).join('')}</div>
  ${D.flavor?`<div class="kfl">${esc(D.flavor)}</div>`:''}</div>`;}
 else oben=`<p class="klead">Klick ein Item, dann den Platz, an den es soll. Rechts siehst du, was das mit deinem Deck macht.</p>`;
 // Deck: Kartenzahl, Stoff-Balken, Änderung seit dem Öffnen
 const deck=deckListe();const z={};let summe=0;deck.forEach(c=>c.st.forEach(k=>{z[k]=(z[k]||0)+1;summe++;}));const ks=Object.keys(ST).filter(k=>z[k]);
 const{rein,raus}=koeDiff();const nm=k=>esc(k.split('\u0001')[0]);
 return `<div class="krechts">${oben}<div class="kdeck"><div class="kdz">DECK <b>${deck.length}</b> KARTEN</div>
 <div class="kbalken">${ks.map(k=>`<i style="flex:${z[k]};background:${ST[k].c}" title="${esc(ST[k].n)} ${z[k]}"></i>`).join('')||'<i style="flex:1;background:#2a2218"></i>'}</div>
 <div class="kleg">${ks.map(k=>`<span>${gi(k,KZ())}${z[k]}</span>`).join('')}</div>
 ${rein.length||raus.length?`<div class="kdiff">${rein.map(r=>`<span class="gr">+ ${nm(r.k)}${r.n>1?' ×'+r.n:''}</span>`).join('')}${raus.map(r=>`<span class="rt">− ${nm(r.k)}${r.n>1?' ×'+r.n:''}</span>`).join('')}</div>`:''}</div></div>`;}

// Linien von den Fächern zu den Anschlusspunkten der Figur (Szenen-Pixel)
function koeLinien(){const J=koeFigur();const K=J.koerper||{hals:[55,62],leib:[58,92],hand:[24,106]};
 const ziele={};AREAS.forEach(a=>{const p=K[KOE_ANKER[a]]||[55,90];ziele[a]=[KOE_FIG.x+p[0],KOE_FIG.y+p[1]];});
 const start={talisman:[KOE_FACH.talisman.x+6,KOE_FACH.talisman.y+18+44],kleidung:[KOE_FACH.kleidung.x,KOE_FACH.kleidung.y+18+20],waffe:[KOE_FACH.waffe.x+46,KOE_FACH.waffe.y+18+60]};
 return `<svg class="klinien" viewBox="0 0 480 362" preserveAspectRatio="none">${AREAS.map(a=>{const[s,t]=[start[a],ziele[a]];return `<line x1="${s[0]}" y1="${s[1]}" x2="${t[0]}" y2="${t[1]}"/><rect class="pkt" x="${t[0]-1}" y="${t[1]-1}" width="2" height="2"/><rect class="pkt" x="${s[0]-1}" y="${s[1]-1}" width="2" height="2"/>`;}).join('')}</svg>`;}

function koeKopf(){const ph={rast:'RAST',werkstatt:'WERKSTATT',kraemer:'KRÄMER',reward:'FUND',fund:'FUND',fight:'KAMPF',event:'EREIGNIS',event_folge:'EREIGNIS',wandbild:'WANDBILD',weg:'KARTE'}[S.phase]||'';
 return `<div class="kkopf"><div class="tz">TIEFE ${romanN(Math.max(1,S.depth))}${ph?' · '+ph:''}<span class="sub">${esc(biom().n)}</span></div>
 <div class="kr"><span class="gold">${gi('gold',KZ())} <b>${S.gold}</b> Gold</span><span>Buch <b>${S.disc.size}/${allRx().length}</b></span><span>Deck <b>${deckListe().length}</b></span></div></div>`;}

function koeLinks(){const J=koeFigur();const m=maxHp();const rs=roleState().filter(x=>x.have.length);
 return `<div class="kname"><h3>${esc(J.n).toUpperCase()}</h3><div class="khp">${S.hp}/${m} Leben</div><div class="kaus">„${esc(ausredeVon(J))}“</div>
 <div class="krollen">${rs.map(x=>`<span class="${x.on?'an':''}">${esc(x.r.n)} ${x.have.length}/${x.r.i.length}${x.on?': '+esc(x.r.t):''}</span>`).join('<br>')||'<span class="hint">Trag drei passende Teile, um ein Set zu bilden.</span>'}</div></div>`;}

function koeFuss(){const bag=S.bag.map((_,i)=>koeSlot('bag:'+i)).join('');const ws=S.phase==='werkstatt'&&!KOE.lesen;
 const selIt=S.sel&&getAt(S.sel);const kr=S.phase==='kraemer'&&S.shop&&S.shop.art!=='tausch'&&selIt&&!S.sel.startsWith('bench');
 return `<div class="rkfuss"><div class="kbag"><h4>RUCKSACK</h4><div class="fp">${bag}${KOE.lesen?'':`<div class="kslot trash" data-loc="trash" title="Wegwerfen">✕</div>`}</div></div>
 ${ws?`<div class="kbag kbank"><h4>WERKBANK</h4><div class="fp">${koeSlot('bench:0')}${koeSlot('bench:1')}</div></div>`:''}
 <div class="kknopf">${kr?`<button class="deco klein" data-act="verkaufen">${esc(def(selIt).n).toUpperCase()} FÜR ${Math.floor(preisVon(def(selIt))*((BAL.shop&&BAL.shop.verkauf_anteil)||.4))} GOLD</button>`:''}
 ${KOE.lesen?'':'<span class="hint">· Ziehen zum Tauschen.</span>'}<button class="deco" data-act="rucksackZu">${KOE.lesen?'ZURÜCK':'WEITER ›'}</button></div></div>`;}

function koerperHtml(){const J=koeFigur();
 return `${koeKopf()}<div class="kmitte"><canvas id="koeNebel" width="200" height="70" style="left:calc(var(--u)*${KOE_FIG.x-45});top:calc(var(--u)*${KOE_FIG.y+112})"></canvas>
 <img class="kfigur" src="assets/figuren/${encodeURIComponent(J.id)}.png" alt="${esc(J.n)}" draggable="false" style="left:calc(var(--u)*${KOE_FIG.x});top:calc(var(--u)*${KOE_FIG.y})">
 <canvas id="koeNebelVorn" width="200" height="40" style="left:calc(var(--u)*${KOE_FIG.x-45});top:calc(var(--u)*${KOE_FIG.y+142})"></canvas>
 ${koeLinien()}${koeLinks()}${AREAS.map(koeFach).join('')}${koeRechts()}</div>${koeFuss()}`;}

function koerperRender(){const el=$('koerper');if(!el)return;if(!KOE){el.classList.remove('an');return;}
 // Wer gerade ein Item gewählt hat, sieht es rechts; nach dem Ablegen bleibt es gezeigt
 if(S.sel&&getAt(S.sel))KOE.zeig=getAt(S.sel).uid;if(KOE.zeig!=null&&!koeItemByUid(KOE.zeig))KOE.zeig=null;
 el.innerHTML=koerperHtml();el.classList.add('an');$('spiel').classList.add('koe');el.classList.toggle('lesen',KOE.lesen);koeNebelStart();}

// ---------- Nebel um die Beine: Bayer-Dither, wandert langsam (kein Weichzeichner) ----------
const KOE_BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
let koeNebelT=null;
function koeNebelMalen(t){[['koeNebel',70,.55],['koeNebelVorn',40,.85]].forEach(([id,H,dicht])=>{const c=$(id);if(!c)return;const x=c.getContext('2d');const W=c.width;x.clearRect(0,0,W,H);
 const cols=['#121214','#18181b','#202024'];
 for(let y=0;y<H;y++)for(let i=0;i<W;i++){const nx=i/W-.5,ny=y/H;
  let v=(1-Math.abs(nx)*1.9)*(id==='koeNebel'?Math.min(1,ny*2.2):1-ny*.9)*dicht;
  v+=.22*Math.sin(i*.09+t*.6+y*.21)+.16*Math.sin(i*.031-t*.35+y*.07);if(v<=0)continue;
  const b=KOE_BAY[(y&3)*4+(i&3)];const k=v>b+.55?2:v>b+.25?1:v>b?0:-1;if(k<0)continue;x.fillStyle=cols[k];x.fillRect(i,y,1,1);}});}
function koeNebelStart(){if(koeNebelT||FAST)return;let t=0;koeNebelMalen(t);koeNebelT=setInterval(()=>{if(!KOE){koeNebelStop();return;}t+=.15;koeNebelMalen(t);},125);}
function koeNebelStop(){if(koeNebelT){clearInterval(koeNebelT);koeNebelT=null;}}

// Nach einem Fund öffnet sich der Rucksack von selbst und zeigt das neue Item (nicht im Autospieler)
let KOE_FUND=null;
if(typeof Bus!=='undefined')Bus.on('item',d=>{if(FAST||DRY)return;const b=besitz().filter(x=>x.it.id===d.id).pop();if(b)KOE_FUND=b.it.uid;});
function koeNachRender(){if(KOE){koerperRender();return;}if(KOE_FUND!=null&&canEquip()&&!busy){const uid=KOE_FUND;KOE_FUND=null;rucksackAuf({uid});}}
