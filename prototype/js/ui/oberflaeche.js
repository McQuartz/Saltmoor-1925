// Setzt alle Bildschirme zusammen (Formensprache Variante A: schwarz, Messinglinien, Cinzel / IM Fell English / Limelight, Pixelzeichen der Stoffe).
// Liest nur den Zustand, ändert ihn nie. Eingaben laufen über data-Attribute (js/ui/eingabe.js).
const $=id=>document.getElementById(id);
let dealAnim=false,vorschau=null;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const allRx=()=>[VERST,...REACT,...HOCH];

function render(){
 const ph=S.phase||'titel';document.body.dataset.phase=ph;
 $('kopf').innerHTML=S.route&&!['titel','figur','strand','ende','ankunft','uebergang'].includes(ph)?kopfHtml():'';
 $('gegner').innerHTML=ph==='fight'||ph==='reward'?gegnerHtml(ph==='fight'):'';
 $('panel').innerHTML=panelHtml(ph);$('panel').className=ph==='fight'?'':'an p-'+ph;
 $('leiste').innerHTML=ph==='fight'?leisteKampf():S.route&&canEquip()?gearHtml():'';
 $('leiste').className=ph==='fight'?'kampf':S.route&&canEquip()?'gear':'';
 dealAnim=false;if(typeof Dev!=='undefined'&&Dev.an)Dev.render();}

// ---------- Kopfzeile ----------
function kopfHtml(){const f=S.phase==='fight';const m=maxHp();const inc=f?incoming():0;const lose=Math.max(0,inc-S.block);
 const total=allRx().length;
 return `<div class="tz">TIEFE ${romanN(Math.max(1,S.depth))}${f?` · ZUG ${S.turnNo}`:''}</div>
 <div class="sub">${esc(biom().n)} · ${S.gold} Gold · <a data-act="buch">Buch ${S.disc.size}/${total}</a></div>
 <div class="du">DU · ${esc(S.jobN).toUpperCase()}</div>${barHtml(S.hp,m,f?S.block:0,null,'gross')}
 <div class="zahlen">${S.hp}/${m}${f&&S.block?` <span class="blk">Block ${S.block}</span>`:''}</div>
 ${f&&inc?`<div class="warn">${inc} kommen → ${lose?'−'+lose+' Leben':'alles geblockt'}</div>`:''}`;}
// Lebensbalken mit Block-Schraffur direkt hinter dem Leben; pv = Vorschau {d, ab}
function barHtml(hp,max,block,pv,cls=''){const W=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(1)+'%';const d=pv?Math.min(hp,pv.d):0,ab=pv?Math.min(block,pv.ab):0;
 return `<div class="bar ${cls}"><i class="hp" style="width:${W(hp-d)}"></i>${d?`<i class="pv" style="width:${W(d)}"></i>`:''}${block-ab>0?`<i class="bk" style="width:${W(block-ab)}"></i>`:''}${ab?`<i class="pvb" style="width:${W(ab)}"></i>`:''}</div>`;}

// ---------- Gegner (Absicht über dem Kopf, Name/Balken unter den Füßen) ----------
function absicht(e){const it=e.pat[e.pi%e.pat.length];if(it.t==='atk'){const v=it.v+e.str;const h=it.h?'×'+it.h:'';if(e.weak2){const n=Math.floor(v/2);return{k:'atk',html:`${gi('atk',GZ())}<s>${v}</s>${n}${h}`};}return{k:'atk',html:`${gi('atk',GZ())}${v}${h}`};}
 if(it.t==='blk')return{k:'blk',html:`${gi('blk',GZ())}${it.v}`};return{k:'buff',html:`${gi('buff',GZ())}+${it.v}`};}
function gegnerHtml(f){return S.enemies.map((e,i)=>{if(e.hp<=0)return'';const b=enemyBox(e);const pv=vorschau&&vorschau.foes[i];const tg=f&&i===S.target;
  const st=[e.burn&&['burn',e.burn],e.poison&&['poison',e.poison],e.weak2&&['weak',1],e.str&&['buff',e.str]].filter(Boolean);
  return `<div class="feind ${tg?'ziel':''} ${e.rang}" data-ei="${i}" style="left:${(b.x/SW*100).toFixed(2)}%;top:${(b.kopf/SH*100).toFixed(2)}%;--fh:${(b.y-b.kopf)/SH*100}">
   ${f?`<div class="abs">${absicht(e).html}</div>`:''}<div class="treffer" style="height:calc(var(--u)*${b.y-b.kopf})"></div>
   <div class="info"><div class="nm"><span>${esc(e.n).toUpperCase()}</span>${e.weak?gi(e.weak,GZ()):''}</div>${barHtml(e.hp,e.max,e.block,pv)}
   <div class="zl"><span>${e.hp}/${e.max}${e.block?` <b class="blk">+${e.block}</b>`:''}${pv&&(pv.d||pv.ab)?` <b class="pvt">−${pv.d}</b>`:''}</span><span class="sts">${st.map(([k,v])=>`${gi(k,GZ())}${v}`).join(' ')}</span></div></div></div>`;}).join('');}
const U=()=>BU.k;
// Pixelzeichen immer ganzzahlig: GROSS = 9 px × Skala, KLEIN = halb so groß (mindestens 9 px)
const GZ=()=>9*U(),KZ=()=>9*Math.max(1,Math.round(U()/2));

// ---------- Untere Leiste im Kampf: Stoffrad, Hand, Energie ----------
function leisteKampf(){const n=S.hand.length;
 return `<div id="rad">${radSvg()}</div><div id="hand">${S.hand.map((c,i)=>cardHtml(c,i,n)).join('')}</div>
 <div id="rechts"><div class="en-l">ENERGIE</div><div class="rauten">${[...Array(Math.max(BAL.energy_per_turn,S.energy))].map((_,i)=>`<i class="${i<S.energy?'voll':''}"></i>`).join('')}</div>
 <button id="endBtn" class="deco" data-act="end" ${busy?'disabled':''}>ZUG<br>BEENDEN</button><div class="stapel">Stapel ${S.draw.length} · Ablage ${S.discard.length}</div>${jobFaehigkeit()==='voraus'&&S.draw.length?`<div class="voraus">Als Nächstes: ${esc(S.draw[S.draw.length-1].n)}</div>`:''}</div>`;}
function cardText(c){const p=[];if(c.atk)p.push(`${c.atk}${c.h?'×'+c.h:''} Schaden${c.all?' an allen':''}`);if(c.blk)p.push(`${c.blk} Block`);if(c.heal)p.push(`+${c.heal} Leben`);if(c.poison)p.push(`Gift ${c.poison}`);if(c.burn)p.push(`Brand ${c.burn}`);if(c.weak)p.push('Geschwächt');if(c.strip)p.push('Block weg');if(c.draw)p.push(`Ziehe ${c.draw}`);if(c.en)p.push(`+${c.en} Energie`);if(c.self)p.push(`−${c.self} Leben`);
 let s=p.join(', ')||'–';if(c.eroeffnung)s+=`. Eröffnung: ${Object.entries(c.eroeffnung).map(([k,v])=>k==='atk'?`+${v} Schaden`:k==='blk'?`+${v} Block`:k==='draw'?`ziehe ${v}`:k==='heal'?`+${v} Leben`:k==='en'?`+${v} Energie`:k==='burn'?`Brand ${v}`:k==='poison'?`Gift ${v}`:`${k} ${v}`).join(', ')}`;if(c.verbraucht)s+='. Verbraucht';return s;}
function cardHtml(c,i,n){const cost=cardCost(c);const rx=reactionsFor(S.last,c.st);const self=c.st.length>1?rx.filter(r=>r.k&&[...r.k].every(k=>c.st.includes(k))):[];const vor=rx.filter(r=>!self.includes(r));
 const known=r=>S.disc.has(r.n);let rxl='';
 if(vor.length)rxl=vor.every(known)?`<div class="rx">${vor.map(r=>r.n.toUpperCase()).join(' + ')}</div>`:`<div class="rx un">? ? ?</div>`;
 if(self.length)rxl+=`<div class="rx in">IN SICH: ${self.map(r=>known(r)?r.n.toUpperCase():'???').join(' + ')}</div>`;
 const rot=((i*37)%5-2)*1.3+(i-(n-1)/2)*.6,dy=((i*53)%3)*1.2;
 return `<div class="karte ${cost>S.energy?'teuer':''} ${vor.length?'reagiert':''} ${c.st.length>1?'duo':''}" data-card="${i}" style="--r:${rot.toFixed(1)}deg;--dy:${dy}px;${dealAnim?`animation-delay:${i*60}ms`:'animation:none'}">
  <div class="kost${c.mod?(c.mod>0?' hoch':' tief'):''}"><span>${cost}</span></div><div class="kst">${c.st.map(k=>gi(k,KZ())).join('')}</div>
  <div class="kn">${esc(c.n).toUpperCase()}</div><div class="bogen"><img src="${spr(c.spr)}" alt=""></div>
  <div class="kt">${esc(cardText(c))}</div>${rxl}</div>`;}
// Stoffrad: in der Mitte der zuletzt gespielte Stoff, Linien nur zu Stoffen, die jetzt reagieren
function radSvg(){const K=Object.keys(ST);const s=60*U()/2,cx=s,cy=s,R=s*.72,nr=s*.15;const last=S.last||[];let lines='',nodes='';
 const reacts=k=>{if(!last.length)return null;const rx=reactionsFor(last,[k]).filter(r=>!r.s);return rx.length?rx:null;};
 K.forEach((k,i)=>{const a=-Math.PI/2+i/K.length*Math.PI*2;const x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;const rx=reacts(k);const kn=rx&&rx.every(r=>S.disc.has(r.n));
  if(rx)lines+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${kn?ST[k].c:'#a080e0'}" stroke-width="${U()}" ${kn?'':`stroke-dasharray="${U()*2} ${U()*2}"`}/>`;
  nodes+=`<circle cx="${x}" cy="${y}" r="${nr}" fill="#0c0a08" stroke="${rx?(kn?ST[k].c:'#a080e0'):'#3a3020'}" stroke-width="${rx?U():U()/2}"/><image href="${glyph(k)}" x="${x-nr*.62}" y="${y-nr*.62}" width="${nr*1.24}" height="${nr*1.24}" style="image-rendering:pixelated" opacity="${rx?1:.28}"><title>${ST[k].n}</title></image>`;});
 const c0=last[0];const mid=c0?`<image href="${glyph(c0)}" x="${cx-nr*.9}" y="${cy-nr*.9}" width="${nr*1.8}" height="${nr*1.8}" style="image-rendering:pixelated"/>`:'';
 return `<svg width="${s*2}" height="${s*2}">${lines}<circle cx="${cx}" cy="${cy}" r="${nr*1.6}" fill="#14110c" stroke="#efe4c8" stroke-width="${U()}"/>${mid}${nodes}<text x="${cx}" y="${cy+nr*2.6}" text-anchor="middle" class="radl">${c0?'ZULETZT':'—'}</text></svg>`;}

// ---------- Ausrüstung unter der Szene ----------
function slotHtml(loc,locked){const it=locked?null:getAt(loc);const d=it?def(it):null;
 return `<div class="slot ${locked?'zu':''} ${S.sel===loc?'sel':''} ${d&&d.rare?'selten':''} ${it&&it.x?'gestrichen':''}" ${locked?'':`data-loc="${loc}"`}>${d?`<img src="${spr(d.spr)}" alt="">${d.st.length?`<span class="ss">${d.st.map(k=>gi(k,KZ())).join('')}</span>`:''}${d.lvl?`<span class="lv">+${d.lvl}</span>`:''}`:''}</div>`;}
function gearHtml(){const M=BAL.max_slots;const rs=roleState().filter(x=>x.have.length);
 return `<div class="areas">${AREAS.map(a=>`<div class="area"><h4>${AREA_N[a]} <em>${S.slots[a]}/${M}</em></h4><div class="slots">${[...Array(M).keys()].map(i=>slotHtml(a+':'+i,i>=S.slots[a])).join('')}</div></div>`).join('')}
 <div class="area"><h4>RUCKSACK</h4><div class="slots">${S.bag.map((_,i)=>slotHtml('bag:'+i)).join('')}<div class="slot trash" data-loc="trash">✕</div></div></div></div>
 <div class="rollen">${rs.map(x=>`<span class="${x.on?'an':''}">${x.r.n} ${x.have.length}/${x.r.i.length}${x.on?': '+esc(x.r.t):''}</span>`).join(' · ')||'<span class="hint">Trag drei passende Teile, um ein Set zu bilden.</span>'}
 <span class="hint"> · Ziehen oder anklicken zum Tauschen.</span></div>`;}

// ---------- Bildschirme (Panel über der Szene) ----------
function panelHtml(ph){switch(ph){
 case'titel':return titelHtml();case'figur':return figurHtml();case'uebergang':return uebergangHtml();case'weg':return wegHtml();case'knoten':return'';
 case'fight':return'';case'reward':return rewardHtml();case'event':case'event_folge':return eventHtml();case'streichen':return streichenHtml('Welche Karte streichst du?','skipstrike');
 case'kraemer':return kraemerHtml();case'kraemer_streichen':return streichenHtml(`Für ${BAL.shop.streichen_preis} Gold streicht ${esc(biom().kraemer.n)} eine Karte aus deinem Deck. Das Item bleibt angelegt.`,'kstrike0');
 case'werkstatt':return werkstattHtml();case'rast':return rastHtml();case'wandbild':return wandbildHtml();case'fund':return fundHtml();
 case'strand':return strandHtml();case'ankunft':return ankunftHtml();case'ende':return endeHtml();}return'';}
const box=(cls,inner)=>`<div class="box ${cls}"><div class="innen">${inner}</div></div>`;
function titelHtml(){const M=Meta.get();return `<div class="titel"><h1>SALTMOOR</h1><div class="jahr">NEUENGLAND · 1925</div>
 <div class="menue">${hasSave()?'<button class="deco" data-act="fortsetzen">FORTSETZEN</button>':''}<button class="deco" data-act="neu">${hasSave()?'NEUER ABSTIEG':'HINAB'}</button>
 <button class="deco klein" data-act="tagebuch">TAGEBUCH</button><button class="deco klein" data-act="einst">EINSTELLUNGEN</button></div>
 <div class="fuss">${M.runs?`${M.runs} Abstiege · ${M.fragmente.length} von ${FRAGS.length} Fragmenten`:'Etwas unter der Stadt ruft.'}</div></div>`;}
function figurHtml(){const M=Meta.get();const st=M.maxStufe;
 return box('figur',`<h2>WER STEIGT HINAB?</h2><p class="lead">Du wachst am Strand von Saltmoor auf. Salz in der Lunge. Unter dir ruft etwas.</p>
 <div class="figuren">${JOBS.map(j=>{const frei=Meta.figurFrei(j)||(typeof Dev!=='undefined'&&Dev.an);const items=[...j.w,...j.k,...j.t];const deck=items.reduce((s,id)=>s+ITEMS[id].cards.length,0)*(BAL.card_copies||1);const set=ROLES.find(r=>r.n===j.set);
  return `<div class="fig ${frei?'':'zu'}" ${frei?`data-job="${j.id}"`:''}><div class="fn">${esc(j.n).toUpperCase()}</div>
   ${frei?`<div class="aus">„${esc(j.ausrede)}“</div><div class="its">${items.map(id=>`<img src="${spr(ITEMS[id].spr)}" title="${esc(ITEMS[id].n)}">`).join('')}</div>
   <div class="fd">${esc(j.d)}</div>${j.faehigkeit_t?`<div class="set">Fähigkeit: <span class="hat">${esc(j.faehigkeit_t)}</span></div>`:''}<div class="set">${set?'Set: ':''}${set?set.i.map(id=>`<span class="${items.includes(id)?'hat':''}">${esc(ITEMS[id].n)}</span>`).join(', '):''}<br><span class="hint">${set?esc(set.t):''}</span></div><div class="deck">${deck} Karten · zieht ${BIOMES[j.vorliebe].kurz} vor</div>`
   :`<div class="aus zu">Gesperrt</div><div class="fd">Lies ${j.frei_ab} Wandbild-Fragmente (${M.fragmente.length}/${j.frei_ab}).</div>`}</div>`;}).join('')}</div>
 ${M.start.length?`<div class="stufen">Startvariante: <button class="${!S.wahlStart?'an':''}" data-start="">keine</button>${RUN.startvarianten.filter(v=>M.start.includes(v.id)).map(v=>`<button class="${S.wahlStart===v.id?'an':''}" data-start="${v.id}" title="${esc(v.t)}">${esc(v.n)}</button>`).join('')}</div>`:''}
 ${st?`<div class="stufen">Schwierigkeit: ${[...Array(st+1).keys()].map(i=>`<button class="${(S.wahlStufe||0)===i?'an':''}" data-stufe="${i}">${romanN(i+1)}</button>`).join('')}</div>`:''}`);}
function uebergangHtml(){const a=RUN.akte[S.akt];const b=biom();let satz=S.akt===0?(JOBS.find(j=>j.id===S.job).ausrede):BIOMES[S.route[S.akt-1]].uebergang;
 return `<div class="zwischentitel klick" data-act="weiter"><div class="akt">${a.n.toUpperCase()}</div><h2>${esc(b.n).toUpperCase()}</h2><div class="zeit">${esc(b.zeit)}</div><p>„${esc(satz)}“</p><div class="hint">Klicken zum Überspringen</div></div>`;}
function wegHtml(){const a=RUN.akte[S.akt];const eb=a.ebenen.length;
 return box('weg',`<div class="ueber">${a.n.toUpperCase()} · ${esc(biom().kurz).toUpperCase()} · EBENE ${S.ebene+1}/${eb}</div><h2>WOHIN?</h2>${jobFaehigkeit()==='karte'?`<div class="karte-geo">Die alte Karte: ${S.route.map((b,i)=>i===S.akt?`<b>${esc(BIOMES[b].kurz)}</b>`:esc(BIOMES[b].kurz)).join(' → ')}</div>`:''}
 <div class="wege">${S.weg.map((o,i)=>{const kn=RUN.knoten[o.art];const fz=o.foes&&o.art==='waechter'?FOES[o.foes[0]]:null;
  return `<div class="tuer ${o.art}" data-weg="${i}"><div class="zei">${gi(o.art,GZ()*2)}</div><div class="wn">${kn.n.toUpperCase()}</div><div class="hinw">${esc(o.hint)}</div>
   ${fz?`<div class="ank">${esc(fz.n)}. Hinter ihm führt eine Treppe nach unten.</div>`:''}${o.foes&&jobFaehigkeit()==='karte'&&o.art.startsWith('kampf')?`<div class="ank">${o.foes.map(id=>esc(FOES[id].n)).join(', ')}</div>`:''}${typeof Dev!=='undefined'&&Dev.an&&o.foes?`<div class="devz">${o.foes.join(', ')}</div>`:''}</div>`;}).join('')}</div>`);}
function itemPick(id,attr,extra=''){const d=ITEMS[id];const ex=d.st.length>1?BAL.forge.double_cost_extra:0;
 return `<div class="pick ${d.rare?'selten':''}" ${attr}><img src="${spr(d.spr)}"><div class="pn">${esc(d.n)}</div><div class="pst">${d.st.map(k=>gi(k,KZ())).join('')}</div>
 <div class="ps">${AREA_N[d.a]}${d.hp?` · +${d.hp} Leben`:''}${d.passiv?' · passiv':''}<br>${d.cards.map(c=>`${esc(c.n)} (${c.c+ex}): ${esc(cardText(c))}`).join('<br>')}${d.passiv?esc(passivText(d.passiv)):''}</div>${extra}</div>`;}
function passivText(p){return{gold_bonus:`+${p.v} Gold nach jedem Sieg`,start_block:`${p.v} Block zu Kampfbeginn`,heil_nach_sieg:`+${p.v} Leben nach jedem Sieg`,erste_karte_billiger:'Die erste Karte im Kampf kostet 0',glueck:'Ein Fund mehr zur Auswahl'}[p.typ]||p.typ;}
function rewardHtml(){return box('reward',`<h2>${S.kampfArt==='waechter'?'DER WÄCHTER FÄLLT':'STILLE'}</h2><p class="lead">${S.goldGain?`+${S.goldGain} Gold. `:''}Unter dem, was übrig ist, liegt etwas.</p>
 ${S.picked?'<p class="hint">Eingesteckt. Leg es unten an oder lass es im Rucksack.</p>':`<div class="picks">${S.reward.map(id=>itemPick(id,`data-take="${id}"`)).join('')}</div><p><button class="deco klein" data-take="">NICHTS NEHMEN</button></p>`}
 <button class="deco" data-act="weiterReward">WEITER ›</button>`);}
function eventHtml(){const ev=curEvent();if(!ev)return'';const done=S.phase==='event_folge';
 return box('ereignis zettel',`<h2>${esc(ev.t).toUpperCase()}</h2><p class="evd">${esc(ev.d)}</p>${ev.o.map((o,i)=>`<button class="opt ${S.eventChoice===i&&done?'gew':''}" data-ev="${i}" ${condOk(o.if)&&!done?'':'disabled'}>› ${esc(o.l)}</button>`).join('')}`);}
function streichenHtml(t,skip){const list=strikeTargets();return box('streichen',`<h2>KARTE STREICHEN</h2><p class="lead">${t}</p><div class="picks">${list.map(it=>{const d=def(it);return `<div class="pick" data-strike="${it.uid}"><img src="${spr(d.spr)}"><div class="pn">${esc(d.n)}</div><div class="ps">${d.cards.map(c=>esc(c.n)+': '+esc(cardText(c))).join('<br>')}</div></div>`;}).join('')}</div><button class="deco klein" data-act="${skip}">LIEBER NICHT</button>`);}
function kraemerHtml(){const b=biom();const k=b.kraemer;const H=BAL.shop.heal;const sh=S.shop;
 return box('kraemer',`<h2>${esc(k.n).toUpperCase()}</h2><p class="lead">${esc(k.ort)}. ${esc(k.zeile)}</p><p class="gold">${gi('gold',KZ())} ${S.gold} Gold</p>
 <div class="picks">${sh.items.map((o,i)=>itemPick(o.id,`data-buy="${i}"`,`<div class="preis">${o.sold?'VERKAUFT':o.price+' GOLD'}</div>`).replace('class="pick ',`class="pick ${o.sold?'weg ':''}`)).join('')}
 <div class="pick ${sh.heal?'weg':''}" data-buy="heal"><div class="pn">Laudanum</div><div class="ps">+${H.v} Leben</div><div class="preis">${sh.heal?'VERKAUFT':H.price+' GOLD'}</div></div>
 <div class="pick ${sh.strike?'weg':''}" data-buy="strike"><div class="pn">Karte streichen</div><div class="ps">Eine Karte verschwindet aus deinem Deck.</div><div class="preis">${sh.strike?'ERLEDIGT':BAL.shop.streichen_preis+' GOLD'}</div></div></div>
 <button class="deco" data-act="leave">WEITER ›</button>`);}
function werkstattHtml(){const p=forgePreview();const F=BAL.forge;
 return box('werkstatt',`<h2>WERKSTATT</h2><p class="lead">Eine Werkbank, die noch funktioniert. Einmal verschmelzen: gleicher Stoff gibt eine Stufe, zwei Stoffe, die reagieren, ein Doppel-Item.</p>
 <div class="bench">${slotHtml('bench:0')}<span class="plus">+</span>${slotHtml('bench:1')}<div class="preview">${S.forged?'<b>Fertig.</b> Zieh das neue Item in deine Ausrüstung.':p?(p.err?`<span class="err">${esc(p.err)}</span>`:`<b>${esc(p.n)}</b> ${p.st.map(k=>gi(k,KZ())).join('')}<br>${p.same?`Stufe: ${p.cards.length} Karten, je +${F.bump}`:`Doppel-Item: ${p.cards.length} Karten, je +${F.bump}, jede kostet ${F.double_cost_extra} mehr`}${p.rx.length?'<br>In sich: '+p.rx.map(r=>S.disc.has(r.n)?r.n:'???').join(', '):''}`):'<span class="hint">Zieh zwei Items aus der Ausrüstung oder dem Rucksack auf die Werkbank.</span>'}</div>
 <button class="deco klein" data-act="forge" ${!p||p.err||S.forged?'disabled':''}>VERSCHMELZEN</button></div><button class="deco" data-act="leave">WEITER ›</button>`);}
function rastHtml(){const v=Math.round(maxHp()*RUN.rast.heil_anteil);
 return box('rast',`<h2>RAST</h2><p class="lead">${esc((biom().weg_hinweise.rast||[''])[0])} Für einen Moment ruft nichts.</p>
 ${S.rastDone?'<p class="hint">Du hast gerastet.</p>':`<div class="wahl"><button class="deco" data-act="rastHeil">SCHLAFEN<br><small>+${v} Leben</small></button><div class="oder">oder ein Item verbessern (alle Werte +${BAL.forge.bump}): klick es unten an</div></div>`}
 <button class="deco" data-act="leave">WEITER ›</button>`);}
function wandbildHtml(){const fr=FRAGS.find(f=>f.id===S.frag);const neu=S.fragNeu||[];
 return `<div class="wandbild"><canvas id="relief" width="160" height="100"></canvas><div class="zettel"><h3>${fr?esc(fr.titel):'Eine leere Wand'}</h3><p>${fr?esc(fr.text):'Jemand hat hier etwas weggekratzt.'}</p>
 ${neu.length?`<div class="neu">${neu.map(x=>`Neu: ${esc(x.n)}`).join('<br>')}</div>`:''}</div><button class="deco" data-act="leave">WEITER ›</button></div>`;}
function fundHtml(){const f=S.fund;return box('fund',`<h2>FUNDSTELLE</h2><p class="lead">${esc((biom().weg_hinweise.fundstelle||[''])[0])}</p>
 ${f.taken?`<p>${f.item?'Eingesteckt: '+esc(ITEMS[f.item].n):''}${f.gold?`+${f.gold} Gold`:''}${f.haken?` · Es hatte einen Haken: −${RUN.fundstelle.haken_schaden} Leben.`:''}</p>`:`<div class="picks">${f.item?itemPick(f.item,'data-act="fund"'):`<div class="pick" data-act="fund"><div class="pn">${f.gold} Gold</div></div>`}</div><p class="hint">Vielleicht hat es einen Haken.</p>`}
 <button class="deco" data-act="leave">${f.taken?'WEITER ›':'LIEGEN LASSEN ›'}</button>`);}
function strandHtml(){const r=S.ergebnis||{};const neu=S.neu||[];
 return box('strand',`<h2>${esc(RUN.strand.titel).toUpperCase()}</h2><p class="lead">${esc(RUN.strand.text)}</p>
 <div class="liste"><div>Erreicht: Tiefe ${romanN(Math.max(1,r.tiefe||1))} · ${esc(BIOMES[r.biom||'hafen'].n)}</div><div>Gelesene Fragmente in diesem Abstieg: ${S.stats.fragmente.length}</div><div>Kämpfe gewonnen: ${S.stats.kaempfe}</div>
 ${neu.length?`<div class="neu">${neu.map(x=>'Neu: '+esc(x.n)).join('<br>')}</div>`:''}</div><button class="deco" data-act="neu">WIEDER HINAB</button> <button class="deco klein" data-act="titel">ZUM TITEL</button>`);}
function ankunftHtml(){const A=RUN.ankunft;const j=JOBS.find(x=>x.id===S.job);
 return `<div class="ankunft"><p class="bild">${esc(A.bild)}</p><p class="wahr">„${esc(j.wahrheit)}“</p><div class="zwei"><button class="deco" data-ende="bleiben">${A.bleiben.knopf.toUpperCase()}</button><button class="deco" data-ende="umkehren">${A.umkehren.knopf.toUpperCase()}</button></div></div>`;}
function endeHtml(){const A=RUN.ankunft;const r=S.ergebnis;const neu=S.neu||[];return `<div class="ankunft ende"><h2>${esc(A[r.ende].text)}</h2><p class="wahr">${esc(JOBS.find(x=>x.id===S.job).n)} · Tiefe ${romanN(r.tiefe)} · ${S.stats.kaempfe} Kämpfe</p>${neu.length?`<div class="neu">${neu.map(x=>'Neu: '+esc(x.n)).join('<br>')}</div>`:''}<button class="deco" data-act="titel">ZUM TITEL</button></div>`;}

// ---------- Überlagerungen: Buch der Reaktionen, Tagebuch, Einstellungen ----------
function buchHtml(){const disc=S.disc||new Set();const all=allRx();
 return box('buch',`<h2>BUCH DER REAKTIONEN</h2><p class="hint">${[...disc].length} von ${all.length} entdeckt.</p><div class="stoffe">${Object.keys(ST).map(k=>`${gi(k,KZ())} ${ST[k].n}`).join(' · ')}</div>
 <div class="rliste">${all.map(r=>{const keys=r.k?[...r.k]:r.s?[...r.s]:null;return disc.has(r.n)?`<div><b>${r.n}</b> ${keys?keys.map(k=>gi(k,KZ())).join('+'):'(gleicher Stoff zweimal)'}: ${esc(r.t)}</div>`:`<div class="u">${r.s?'Hochreaktion: drei Stoffe':'? ? ?'}</div>`;}).join('')}</div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function tagebuchHtml(){const M=Meta.get();const st=M.biome;
 return box('tagebuch zettel',`<h2>TAGEBUCH</h2><div class="liste"><div>Abstiege: ${M.runs} · Angekommen: ${M.siege} (Bleiben ${M.enden.bleiben||0}, Umkehren ${M.enden.umkehren||0})</div><div>Größte Tiefe: ${M.besteTiefe?romanN(M.besteTiefe):'–'}</div>
 <div>Erreichte Orte: ${Object.keys(BIOMES).map(b=>st.includes(b)?esc(BIOMES[b].kurz):'…').join(' · ')}</div></div>
 <h3>Fragmente ${M.fragmente.length}/${FRAGS.length}</h3><div class="frags">${Object.keys(BIOMES).map(b=>`<div class="fb"><b>${esc(BIOMES[b].kurz)}</b>${FRAGS.filter(f=>f.biom===b).map(f=>M.fragmente.includes(f.id)?`<p><i>${esc(f.titel)}.</i> ${esc(f.text)}</p>`:'<p class="u">…</p>').join('')}</div>`).join('')}</div>
 <button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function einstHtml(){const E=Einst.all();const sl=(k,n)=>`<label>${n}<input type="range" min="0" max="1" step="0.05" value="${E[k]}" data-einst="${k}"></label>`;const cb=(k,n)=>`<label><input type="checkbox" ${E[k]?'checked':''} data-einst="${k}"> ${n}</label>`;
 return box('einst',`<h2>EINSTELLUNGEN</h2><div class="formular">${sl('musik','Musik')}${sl('effekte','Effekte')}${cb('stummfilm','Stummfilm-Rauschen bei besonderen Anlässen')}${cb('jumpscare','Jumpscare (höchstens einmal pro Abstieg)')}${cb('wackeln','Bildschirmwackeln')}
 <label>Textgeschwindigkeit<select data-einst="text"><option value="0.6" ${E.text==.6?'selected':''}>langsam</option><option value="1" ${E.text==1?'selected':''}>normal</option><option value="1.6" ${E.text==1.6?'selected':''}>schnell</option></select></label>
 <label><input type="checkbox" ${typeof Dev!=='undefined'&&Dev.an?'checked':''} data-act="devToggle"> Dev-Modus</label></div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function zeigeOverlay(html){const o=$('overlay');o.innerHTML=html;o.classList.add('an');}
function closeOv(){$('overlay').classList.remove('an');}
// Wandbild-Relief zeichnen (prozedural; im Stil der Hintergründe, sobald World.relief da ist)
function reliefMalen(){const c=$('relief');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 if(typeof World!=='undefined'&&World.relief){try{const r=World.relief(biomId(),hashStr(S.frag||'x'));x.drawImage(r,0,0,160,100);return;}catch(e){}}
 const B=biom();const r=new Rng(hashStr(S.frag||'leer'));x.fillStyle=B.koerper[2];x.fillRect(0,0,160,100);
 for(let i=0;i<9;i++){const cx=14+i*16+r.int(-3,3),cy=50+r.int(-6,6),h=r.int(18,34);x.fillStyle=B.koerper[0];x.fillRect(cx,cy-h/2,2,h);x.fillRect(cx-4,cy-h/2+4,10,2);x.fillStyle=B.rand[0];x.fillRect(cx+2,cy-h/2,1,h);}
 x.fillStyle=B.rand[1];x.fillRect(78,12,4,4);}
