// Setzt alle Bildschirme zusammen (Formensprache Variante A: schwarz, Messinglinien, Cinzel / IM Fell English / Limelight, Pixelzeichen der Stoffe).
// Liest nur den Zustand, ändert ihn nie. Eingaben laufen über data-Attribute (js/ui/eingabe.js).
const $=id=>document.getElementById(id);
let dealAnim=false,vorschau=null;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const allRx=()=>[VERST,...REACT,...HOCH];

function render(){
 const ph=S.phase||'titel';document.body.dataset.phase=ph;
 $('kopf').innerHTML=S.route&&!['titel','figur','strand','ende','ankunft','uebergang','biomwahl'].includes(ph)?kopfHtml():'';
 $('gegner').innerHTML=ph==='fight'||ph==='reward'?gegnerHtml(ph==='fight'):'';
 if($('spieler'))$('spieler').innerHTML=ph==='fight'?spielerHtml():'';
 $('panel').innerHTML=panelHtml(ph);$('panel').className=ph==='fight'?'':'an p-'+ph;
 $('leiste').innerHTML=ph==='fight'?leisteKampf():S.route&&canEquip()?gearHtml():'';
 $('leiste').className=ph==='fight'?'kampf':S.route&&canEquip()?'gear':'';
 dealAnim=false;if(typeof Dev!=='undefined'&&Dev.an)Dev.render();}

// ---------- Kopfzeile ----------
function kopfHtml(){const f=S.phase==='fight';const m=maxHp();const inc=f?incoming():0;const lose=Math.max(0,inc-S.block);
 const total=allRx().length;
 return `<div class="tz">TIEFE ${romanN(Math.max(1,S.depth))}${f?` · ZUG ${S.turnNo}`:''}</div>
 <div class="sub">${esc(biom().n)} · ${S.gold} Gold · <a data-act="buch">Buch ${S.disc.size}/${total}</a></div>
 ${f?'':`<div class="du">DU · ${esc(S.jobN).toUpperCase()}</div>${barHtml(S.hp,m,0,null,'gross')}<div class="zahlen">${S.hp}/${m}</div>`}`;}
// Spieler-Lebensbalken unten mittig über der Hand: Block als Schild links, angekündigter Schaden als roter Schatten im Balken
function spielerHtml(){const m=maxHp(),inc=incomingSichtbar(),lose=Math.min(S.hp,Math.max(0,inc-S.block));const W=v=>Math.max(0,Math.min(100,v/m*100)).toFixed(1)+'%';
 return `<div class="schild ${S.block?'an':''}" title="Block">${gi('blk',GZ())}<b>${S.block}</b></div>
 <div class="sbar"><i class="hp" style="width:${W(S.hp-lose)}"></i>${lose?`<i class="schatten" style="width:${W(lose)}"></i>`:''}<span>${esc(S.jobN).toUpperCase()} · ${S.hp}/${m}</span></div>
 <div class="swarn">${alive().some(e=>e.kniff&&e.kniff.art==='verborgen'&&e.pat[e.pi%e.pat.length].t==='atk')?`${inc} und mehr kommen, wie viel, siehst du nicht`:inc?`${inc} kommen → ${lose?'−'+lose+' Leben':'alles geblockt'}`:'nichts kommt'}</div>`;}
// Lebensbalken mit Block-Schraffur direkt hinter dem Leben; pv = Vorschau {d, ab}
function barHtml(hp,max,block,pv,cls=''){const W=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(1)+'%';const d=pv?Math.min(hp,pv.d):0,ab=pv?Math.min(block,pv.ab):0;
 return `<div class="bar ${cls}"><i class="hp" style="width:${W(hp-d)}"></i>${d?`<i class="pv" style="width:${W(d)}"></i>`:''}${block-ab>0?`<i class="bk" style="width:${W(block-ab)}"></i>`:''}${ab?`<i class="pvb" style="width:${W(ab)}"></i>`:''}</div>`;}

// ---------- Gegner (Absicht über dem Kopf, Name/Balken unter den Füßen) ----------
// Kniffe und Besonderheiten der Gegner in Spielerworten (Tooltip über dem Gegner)
const KNIFF_TEXT={dornen:k=>`Dornen: jeder Treffer an ihm kostet dich ${k.v||2}`,loeschen:()=>'Löscht jeden Brand seiner Seite',rein:()=>'Rein: Gift wirkt nicht',brecher:()=>'Zerbricht deinen Block, bevor er zuschlägt',kleinvieh:()=>'Kommt selten allein',
 abschrift:k=>`Mischt ${k.n||1} unspielbare Karte(n) in deinen Ablagestapel`,waechst:k=>`Wächst: jeden Zug +${k.v||2} Stärke`,schuetzer:k=>`Gibt Verbündeten ${k.v||4} Block`,ruf:k=>`Ruft alle ${k.alle||3} Züge Verstärkung: ${[].concat(k.gegner).map(g=>FOES[g]?FOES[g].n:'?').join(', dann ')}`,
 wechsel:k=>`Wechselt die Schwachstelle: ${(k.stoffe||[]).map(x=>ST[x]?ST[x].n:x).join(' → ')}`,ansage:k=>`Lädt ${k.zuege||2} Züge, dann ein großer Schlag`,nachlass:k=>k.was==='explodiert'?`Explodiert beim Tod (${k.v||0})`:k.was==='teilt'?'Teilt sich beim Tod':'Hinterlässt etwas',
 verborgen:()=>'Verborgen: du siehst nur, was, nicht wie viel',heiler:k=>`Heilt Verbündete um ${k.v||4}`,einfrieren:()=>'Friert jeden Zug eine Handkarte ein',verstopfen:k=>`Steckt ${k.n||1} unspielbare Karte(n) in deine Hand`,
 teurer:k=>`Eine Handkarte kostet jeden Zug ${k.v||1} mehr`,kopie:k=>`Schreibt deine letzte Karte ab und spielt sie gegen dich${k.n?', mischt Abschriften ein':''}`,takt:k=>`Schlägt jeden zweiten Zug: alle +${k.v||6} Block; dazwischen verwundbar`,voraus:()=>'Spielt deine nächste Karte vor dir; schwach gegen den Stoff, den du am wenigsten spielst'};
const BES_TEXT={ruft:b=>`Ruft alle ${b.alle||3} Züge Verstärkung: ${FOES[b.gegner]?FOES[b.gegner].n:'?'}`,schwach_wechsel:b=>`Schwachstelle wechselt: ${(b.stoffe||[]).map(x=>ST[x]?ST[x].n:x).join(' → ')}`,phasen:()=>'Verwandelt sich, wenn es schwächer wird'};
// Nächste Schwachstelle bei Kniff „wechsel“ oder Besonderheit „schwach_wechsel“ (so wie combat.js sie am Zugende setzt)
function naechsteSchwach(e){const k=kniffeVon(e).find(k=>k.art==='wechsel'&&k.stoffe);if(k)return k.stoffe[(e.turns+1)%k.stoffe.length];const b=e.besonders;if(b&&b.art==='schwach_wechsel'&&b.stoffe)return b.stoffe[(e.turns+1)%b.stoffe.length];return null;}
function feindTip(i){const e=S.enemies[i];if(!e||e.hp<=0)return'';const ks=[e.kniff,...(e.kniffe||[])].filter(k=>k&&KNIFF_TEXT[k.art]);
 const nw=naechsteSchwach(e);const pu=e.pat[e.pi%e.pat.length];
 const ruf=rufeVon(e);
 return `<b>${esc(e.n)}</b>${ruf.length?`<br>◆ Ruft im nächsten Gegnerzug: ${esc(ruf.map(id=>FOES[id].n).join(', '))}`:''}${pu&&pu.unverw?`<br>◆ Diesen Zug unverwundbar${pu.why?`<br><i class="hint">${esc(pu.why)}</i>`:''}`:''}${e.weak?`<br>Schwachstelle: ${gi(e.weak,KZ())} ${ST[e.weak].n} (×1,5)`:''}${nw&&nw!==e.weak?`<br>Danach: ${gi(nw,KZ())} ${ST[nw].n}`:''}${ks.map(k=>`<br>◆ ${esc(KNIFF_TEXT[k.art](k))}${k.why?`<br><i class="hint">${esc(k.why)}</i>`:''}`).join('')}${e.besonders&&BES_TEXT[e.besonders.art]?`<br>◆ ${esc(BES_TEXT[e.besonders.art](e.besonders))}`:''}${e.vuln>0?`<br>Verwundbar ${e.vuln} (+50 %)`:''}`;}
// Absicht mit Zusatzzeichen: „unverwundbar“ (Musterschritt unverw) und „ruft“ (holt im nächsten Gegnerzug Verstärkung, rufAnsage in combat.js)
const rufeVon=e=>e&&e.uid&&typeof rufAnsage==='function'&&S.enemies&&S.enemies.includes(e)?rufAnsage(e):[];
function absicht(e){const r=absicht0(e);const it=e.pat[e.pi%e.pat.length];if(it.unverw)r.html+=' <small class="unverw">unverwundbar</small>';
 const ruf=rufeVon(e);if(ruf.length)r.html+=` <small class="ruft" title="Ruft: ${esc(ruf.map(id=>FOES[id].n).join(', '))}">ruft</small>`;return r;}
function absicht0(e){const it=e.pat[e.pi%e.pat.length];if(e.kniff&&e.kniff.art==='verborgen'){const k=it.t==='atk'?'atk':it.t==='blk'?'blk':'buff';return{k,html:`${gi(k,GZ())}?`};}if(it.t==='atk'){const v=it.v+e.str;const h=it.h?'×'+it.h:'';if(e.weak2){const n=Math.floor(v/2);return{k:'atk',html:`${gi('atk',GZ())}<s>${v}</s>${n}${h}`};}return{k:'atk',html:`${gi('atk',GZ())}${v}${h}`};}
 if(it.t==='blk')return{k:'blk',html:`${gi('blk',GZ())}${it.v}`};
 // Ansage: lädt, dann großer Schlag; zeigt die Wucht und wie viele Züge noch
 if(it.t==='laedt'){let n=1,j=e.pi+1;while(n<9&&e.pat[j%e.pat.length].t==='laedt'){n++;j++;}const s=e.pat[j%e.pat.length];const v=(s.v||0)+e.str;return{k:'atk',html:`<span class="laedt">${gi('atk',GZ())}${v} <small>in ${n}</small></span>`};}
 return{k:'buff',html:`${gi('buff',GZ())}+${it.v}`};}
function gegnerHtml(f){return S.enemies.map((e,i)=>{if(e.hp<=0)return'';const b={...enemyBox(e)};if(e.pendel)b.x=Math.round(e.x*SW);const pv=vorschau&&vorschau.foes[i];const tg=f&&i===S.target;
  const st=[e.burn&&['burn',e.burn],e.poison&&['poison',e.poison],e.weak2&&['weak',1],e.str&&['buff',e.str]].filter(Boolean);
  return `<div class="feind ${tg?'ziel':''} ${e.rang}" data-ei="${i}" style="left:${(b.x/SW*100).toFixed(2)}%;top:${(b.kopf/SH*100).toFixed(2)}%;--fh:${(b.y-b.kopf)/SH*100}">
   ${f?`<div class="abs">${absicht(e).html}</div>`:''}<div class="treffer" style="height:calc(var(--u)*${b.y-b.kopf})"></div>
   <div class="info"><div class="nm"><span>${esc(e.n).toUpperCase()}</span>${e.weak?gi(e.weak,GZ()):''}${e.kniff||e.besonders?'<b class="knf" title="Kniff: Maus darüber">◆</b>':''}</div>${barHtml(e.hp,e.max,e.block,pv)}
   <div class="zl"><span>${e.hp}/${e.max}${e.block?` <b class="blk">+${e.block}</b>`:''}${pv&&(pv.d||pv.ab)?` <b class="pvt">−${pv.d}</b>`:''}</span><span class="sts">${st.map(([k,v])=>`${gi(k,GZ())}${v}`).join(' ')}</span></div></div></div>`;}).join('');}
const U=()=>BU.k;
// Pixelzeichen immer ganzzahlig: GROSS = 9 px × Skala, KLEIN = halb so groß (mindestens 9 px)
const GZ=()=>9*U(),KZ=()=>9*Math.max(1,Math.round(U()/2));

// ---------- Untere Leiste im Kampf: Stoffrad, Hand, Energie ----------
function leisteKampf(){const n=S.hand.length;
 return `<div id="rad">${radSvg()}</div><div id="hand" style="--ov:${S.hand.length>6?((S.hand.length-6)*59/(S.hand.length-1)).toFixed(2):0}">${S.hand.map((c,i)=>cardHtml(c,i,n)).join('')}</div>
 <div id="rechts"><div class="en-l">ENERGIE</div><div class="rauten">${[...Array(Math.max(BAL.energy_per_turn,S.energy))].map((_,i)=>`<i class="${i<S.energy?'voll':''}"></i>`).join('')}</div>
 <button id="endBtn" class="deco" data-act="end" ${busy?'disabled':''}>ZUG<br>BEENDEN</button><div class="stapel">Stapel ${S.draw.length} · Ablage ${S.discard.length}</div>${jobFaehigkeit()==='voraus'&&S.draw.length?`<div class="voraus">Als Nächstes: ${esc(S.draw[S.draw.length-1].n)}</div>`:''}</div>`;}
function cardText(c){if(c.unspielbar)return typeof werfbar==='function'&&werfbar(c)?`Über Bord werfen: ${passive('ballast_werfen').map(p=>fxKurz(p.fx)).join(', ')}.`:'Unspielbar.';const p=[];const kw=[];if(c.funke)kw.push('Funke');if(c.zoll)kw.push(`Zoll ${c.zoll}`);if(c.behalten)kw.push('Behalten');if(c.x)kw.push('X');if(c.kette)kw.push(`Kette ${c.kette}`);if(c.opfer)kw.push(`Opfer ${c.opfer}`);
 if(c.atk)p.push(`${c.atk}${c.x?'×X':c.h?'×'+c.h:''} Schaden${c.all?' an allen':''}`);if(c.blk)p.push(`${c.blk} Block`);if(c.heal)p.push(`+${c.heal} Leben`);if(c.poison)p.push(`Gift ${c.poison}`);if(c.burn)p.push(`Brand ${c.burn}`);if(c.weak)p.push('Geschwächt');if(c.vuln)p.push(`Verwundbar ${c.vuln}`);if(c.str)p.push(`Stärke ${c.str}`);if(c.strip)p.push('Block weg');if(c.draw)p.push(`Ziehe ${c.draw}`);if(c.en)p.push(`+${c.en} Energie`);if(c.self)p.push(`−${c.self} Leben`);if(c.gold)p.push(`+${c.gold} Gold`);
 if(c.sonder&&c.sonder.t)p.push(c.sonder.t);
 let s=(kw.length?kw.join(', ')+'. ':'')+(p.join(', ')||(c.t&&!c.atk&&!c.blk?'':'–'));if(c.eroeffnung)s+=`. Eröffnung: ${Object.entries(c.eroeffnung).map(([k,v])=>k==='atk'?`+${v} Schaden`:k==='blk'?`+${v} Block`:k==='draw'?`ziehe ${v}`:k==='heal'?`+${v} Leben`:k==='en'?`+${v} Energie`:k==='burn'?`Brand ${v}`:k==='poison'?`Gift ${v}`:`${k} ${v}`).join(', ')}`;if(c.verbraucht)s+='. Verbraucht';return s;}
function cardHtml(c,i,n){const cost=cardCost(c);const rx=reactionsFor(S.last,c.st);const self=c.st.length>1?rx.filter(r=>r.k&&[...r.k].every(k=>c.st.includes(k))):[];const vor=rx.filter(r=>!self.includes(r));
 const known=r=>S.disc.has(r.n);let rxl='';
 if(vor.length)rxl=vor.every(known)?`<div class="rx">${vor.map(r=>r.n.toUpperCase()).join(' + ')}</div>`:`<div class="rx un">? ? ?</div>`;
 if(self.length)rxl+=`<div class="rx in">IN SICH: ${self.map(r=>known(r)?r.n.toUpperCase():'???').join(' + ')}</div>`;
 const rot=((i*37)%5-2)*1.3+(i-(n-1)/2)*.6,dy=((i*53)%3)*1.2;
 return `<div class="karte ${cost>S.energy?'teuer':''} ${vor.length?'reagiert':''} ${c.st.length>1?'duo':''} ${c.unspielbar&&!(typeof werfbar==='function'&&werfbar(c))?'unspielbar':''} ${c.frost?'frost':''} ${c.teuer?'verteuert':''} ${c.hg?'handgriff':''}" data-card="${i}" style="--r:${rot.toFixed(1)}deg;--dy:${dy}px;${dealAnim?`animation-delay:${i*60}ms`:'animation:none'}">
  <div class="kost${c.mod||c.teuer?((c.mod||0)+(c.teuer||0)>0?' hoch':' tief'):''}"><span>${cost>=99?'–':cost}</span></div><div class="kst">${c.st.map(k=>gi(k,KZ())).join('')}</div>
  <div class="kn">${esc(c.n).toUpperCase()}</div><div class="bogen"><img src="${c.img||spr(c.spr)}" alt="">${c.hg?'<span class="hgm" title="Handgriff">✋</span>':''}${c.schliff?'<span class="schl" title="geschliffen">◇</span>':''}</div>
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
function slotHtml(loc,locked){const it=locked?null:getAt(loc);const d=it?def(it):null;const ibi=it?itemBild(it.id):'';
 return `<div class="slot ${locked?'zu':''} ${S.sel===loc?'sel':''} ${d&&d.rare?'selten':''} ${it&&it.x?'gestrichen':''}" ${locked?'':`data-loc="${loc}"`}>${d?`<img src="${ibi}" alt="">${d.st.length?`<span class="ss">${d.st.map(k=>gi(k,KZ())).join('')}</span>`:''}${d.lvl?`<span class="lv">+${d.lvl}</span>`:''}<span class="kb">${[...Array(kerbenVon(it))].map((_,k)=>`<i class="${hgVon(it)[k]?'voll':''}"></i>`).join('')}</span>`:''}</div>`;}
function gearHtml(){const M=BAL.max_slots;const rs=roleState().filter(x=>x.have.length);
 return `<div class="areas">${AREAS.map(a=>`<div class="area"><h4>${AREA_N[a]} <em>${S.slots[a]}/${M}</em></h4><div class="slots">${[...Array(M).keys()].map(i=>slotHtml(a+':'+i,i>=S.slots[a])).join('')}</div></div>`).join('')}
 <div class="area"><h4>RUCKSACK</h4><div class="slots">${S.bag.map((_,i)=>slotHtml('bag:'+i)).join('')}<div class="slot trash" data-loc="trash">✕</div></div></div></div>
 <div class="rollen">${rs.map(x=>`<span class="${x.on?'an':''}">${x.r.n} ${x.have.length}/${x.r.i.length}${x.on?': '+esc(x.r.t):''}</span>`).join(' · ')||'<span class="hint">Trag drei passende Teile, um ein Set zu bilden.</span>'}
 <span class="hint"> · Ziehen oder anklicken zum Tauschen.</span> <button class="deco klein" data-act="rucksack">RUCKSACK (R)</button></div>`;}

// ---------- Bildschirme (Panel über der Szene) ----------
function panelHtml(ph){switch(ph){
 case'titel':return titelHtml();case'biomwahl':return biomwahlHtml();case'figur':return figurHtml();case'uebergang':return uebergangHtml();case'weg':return wegHtml();case'knoten':return'';
 case'fight':return'';case'reward':return rewardHtml();case'event':case'event_folge':return eventHtml();case'streichen':return streichenHtml('Welche Karte streichst du?','skipstrike');
 case'kraemer':return kraemerHtml();case'kraemer_streichen':return streichenHtml(`Für ${BAL.shop.streichen_preis} Gold streicht ${esc(biom().kraemer.n)} eine Karte aus deinem Deck. Das Item bleibt angelegt.`,'kstrike0');
 case'werkstatt':return werkstattHtml();case'wahl':return wahlHtml();case'event_hg':case'kraemer_hg':return ritzenHtml('Wohin ritzt du den Handgriff?');case'rast':return rastHtml();case'wandbild':return wandbildHtml();case'fund':return fundHtml();
 case'strand':return strandHtml();case'ankunft':return ankunftHtml();case'ende':return endeHtml();}return'';}
const box=(cls,inner)=>`<div class="box ${cls}"><div class="innen">${inner}</div></div>`;
function titelHtml(){const M=Meta.get();return `<div class="titel"><h1>SALTMOOR</h1><div class="jahr">NEUENGLAND · 1925</div>
 <div class="menue">${hasSave()?'<button class="deco" data-act="fortsetzen">FORTSETZEN</button>':''}<button class="deco" data-act="neu">${hasSave()?'NEUER ABSTIEG':'HINAB'}</button>
 <button class="deco klein" data-act="tagebuch">TAGEBUCH</button><button class="deco klein" data-act="einst">EINSTELLUNGEN</button></div>
 <div class="fuss">${M.runs?`${M.runs} Abstiege · ${M.fragmente.length} von ${FRAGS.length} Fragmenten`:'Etwas unter der Stadt ruft.'}</div></div>`;}
function figurHtml(){const M=Meta.get();const st=M.maxStufe;
 return box('figur',`<h2>WER STEIGT HINAB?</h2><p class="lead">Du wachst am Strand von Saltmoor auf. Salz in der Lunge. Unter dir ruft etwas.</p>
 <div class="figuren">${JOBS.map(j=>{const frei=Meta.figurFrei(j)||(typeof Dev!=='undefined'&&Dev.an);const items=[...j.w,...j.k,...j.t];const deck=deckGroesse(items,j);const set=ROLES.find(r=>r.n===j.set);
  return `<div class="fig ${frei?'':'zu'}" ${frei?`data-job="${j.id}"`:''}><div class="fn">${esc(j.n).toUpperCase()}</div>
   ${frei?`<div class="aus">„${esc(j.ausrede)}“</div><div class="its">${items.map(id=>`<img src="${itemBild(id)}" title="${esc(ITEMS[id].n)}">`).join('')}</div>
   <div class="fd">${esc(j.d)}</div>${j.faehigkeit_t?`<div class="set">Fähigkeit: <span class="hat">${esc(j.faehigkeit_t)}</span></div>`:''}<div class="set">${set?'Set: ':''}${set?set.i.map(id=>`<span class="${items.includes(id)?'hat':''}">${esc(ITEMS[id].n)}</span>`).join(', '):''}<br><span class="hint">${set?esc(set.t):''}</span></div><div class="deck">${deck} Karten · zieht ${BIOMES[j.vorliebe].kurz} vor</div>`
   :`<div class="aus zu">Gesperrt</div><div class="fd">Lies ${j.frei_ab} Wandbild-Fragmente (${M.fragmente.length}/${j.frei_ab}).</div>`}</div>`;}).join('')}</div>
 ${M.start.length?`<div class="stufen">Startvariante: <button class="${!S.wahlStart?'an':''}" data-start="">keine</button>${RUN.startvarianten.filter(v=>M.start.includes(v.id)).map(v=>`<button class="${S.wahlStart===v.id?'an':''}" data-start="${v.id}" title="${esc(v.t)}">${esc(v.n)}</button>`).join('')}</div>`:''}
 ${st?`<div class="stufen">Schwierigkeit: ${[...Array(st+1).keys()].map(i=>`<button class="${(S.wahlStufe||0)===i?'an':''}" data-stufe="${i}">${romanN(i+1)}</button>`).join('')}</div>`:''}`);}
function biomwahlHtml(){const a=RUN.akte[S.akt];const an=S.angebote[S.akt]||[];
 return box('weg',`<div class="ueber">${a.n.toUpperCase()} · ${esc(a.titel).toUpperCase()}</div><h2>WELCHER WEG FÜHRT HINAB?</h2>
 <div class="wege">${an.map((b,i)=>{const B=BIOMES[b];return `<div class="tuer biom" data-biom="${i}"><div class="wn">${esc(B.n).toUpperCase()}</div><div class="hinw">${esc(B.zeit||'')}</div><div class="ank">${esc(B.anreise||(B.weg_hinweise&&B.weg_hinweise.kampf&&B.weg_hinweise.kampf[0])||'')}</div></div>`;}).join('')}</div>`);}
function uebergangHtml(){const a=RUN.akte[S.akt];const b=biom();let satz=S.akt===0?(JOBS.find(j=>j.id===S.job).ausrede):BIOMES[S.route[S.akt-1]].uebergang;
 return `<div class="zwischentitel klick" data-act="weiter"><div class="akt">${a.n.toUpperCase()}</div><h2>${esc(b.n).toUpperCase()}</h2><div class="zeit">${esc(b.zeit)}</div><p>„${esc(satz)}“</p><div class="hint spaet">Klicken oder Taste drücken</div></div>`;}
function wegHtml(){const a=RUN.akte[S.akt];const eb=a.ebenen.length;
 return box('weg',`<div class="ueber">${a.n.toUpperCase()} · ${esc(biom().kurz).toUpperCase()} · EBENE ${S.ebene+1}/${eb}</div><h2>WOHIN?</h2>${jobFaehigkeit()==='karte'?`<div class="karte-geo">Die alte Karte: ${RUN.akte.map((a,i)=>S.route[i]?(i===S.akt?`<b>${esc(BIOMES[S.route[i]].kurz)}</b>`:esc(BIOMES[S.route[i]].kurz)):a.biome.filter(b=>BIOMES[b]).map(b=>BIOMES[b].kurz).join('/')).join(' → ')}</div>`:''}
 <div class="wege">${S.weg.map((o,i)=>{const kn=RUN.knoten[o.art];const fz=o.foes&&o.art==='waechter'?FOES[o.foes[0]]:null;
  return `<div class="tuer ${o.art}" data-weg="${i}"><div class="zei">${gi(o.art,GZ()*2)}</div><div class="wn">${kn.n.toUpperCase()}</div><div class="hinw">${esc(o.hint)}</div>
   ${fz?`<div class="ank">${esc(fz.n)}. Hinter ihm führt eine Treppe nach unten.</div>`:''}${o.foes&&jobFaehigkeit()==='karte'&&o.art.startsWith('kampf')?`<div class="ank">${o.foes.map(id=>esc(FOES[id].n)).join(', ')}</div>`:''}${typeof Dev!=='undefined'&&Dev.an&&o.foes?`<div class="devz">${o.foes.join(', ')}</div>`:''}</div>`;}).join('')}</div>`);}
function itemPick(id,attr,extra=''){const d=ITEMS[id];const ex=d.st.length>1?BAL.forge.double_cost_extra:0;
 return `<div class="pick ${rarOf(d)!=='gewoehnlich'?'selten':''} ${rarOf(d)==='reliquie'?'reliquie':''}" ${attr}><img src="${itemBild(id)}"><div class="pn">${esc(d.n)}</div><div class="pst">${d.st.map(k=>gi(k,KZ())).join('')}</div>
 <div class="ps">${AREA_N[d.a]}${d.hp?` · +${d.hp} Leben`:''}${d.passiv?' · passiv':''}<br>${d.cards.map(c=>`${esc(c.n)} (${c.c+ex}): ${esc(cardText(c))}`).join('<br>')}${d.passiv?esc(passivText(d.passiv)):''}${d.eigen?`${d.cards.length?'<br>':''}<i>${esc(eigenText(d.eigen))}</i>`:''}</div>${extra}</div>`;}
// Kurztext für Effektlisten (Ballaststein, Korkweste: was ein Wurf über Bord bewirkt)
function fxKurz(fx){return(fx||[]).map(f=>f.op==='damage'?`${f.v} Schaden${f.to==='all'?' an allen':''}`:f.op==='block'?`${f.v} Block`:f.op==='ward'?`Schutz ${f.v}`:f.op==='heal'?`+${f.v} Leben`:f.op==='status'?`${({burn:'Brand',poison:'Gift',vuln:'Verwundbar',weak:'Geschwächt'})[f.status]||f.status} ${f.v}${f.to==='all'?' an allen':''}`:f.op==='ballast'?`${f.n||1} Ballast`:f.op).join(', ');}
// Eigenschaft eines Items in einem Satz: eigener Text (eigen.t) oder aus dem Typ
function eigenText(e){if(!e)return'';if(e.t)return e.t;return{brand_haelt:'Brand verfällt am Zugende nur um 1',brand_springt:'Stirbt ein Gegner mit Brand, springt der Brand auf alle anderen',gift_doppelt:'Gift wirkt am Zugende zweimal',block_haelt_halb:'Block verfällt nur zur Hälfte',reaktion_block:`Jede Reaktion gibt ${e.v||1} Block`,reaktion_heil:`Jede Reaktion heilt ${e.v||1}`,reaktion_schaden:`Jede Reaktion macht ${e.v||2} Schaden an einem Gegner`,hoch_zweimal:'Hochreaktionen zweimal pro Zug',opfer_staerke:'Jedes gezahlte Leben gibt 1 Stärke',mehrfach_plus1:'Mehrfachangriffe treffen einmal mehr',start_staerke:`Stärke ${e.v} zu Kampfbeginn`,start_block:`${e.v} Block zu Kampfbeginn`,verwundbar_start:`Alle Gegner verwundbar ${e.v} zu Kampfbeginn`,energie_bleibt:`${e.v||1} ungenutzte Energie bleibt`,energie_plus:`+${e.v||1} Energie je Zug${e.preis==='hand'?', eine Karte weniger auf der Hand':e.preis==='heil'?', keine Heilung nach dem Sieg':''}`,kette_start:`Kette zählt jeden Zug ab ${e.v||1}`,behalten_eine:'Eine Handkarte bleibt am Zugende liegen',hand_plus:`+${e.v||1} Karte auf der Hand`,kampfstart_fx:`Zu Kampfbeginn: ${fxKurz(e.fx)}`,gold_bonus:`+${e.v} Gold nach jedem Sieg`,heil_nach_sieg:`+${e.v} Leben nach jedem Sieg`}[e.typ]||e.typ;}
function passivText(p){return{gold_bonus:`+${p.v} Gold nach jedem Sieg`,start_block:`${p.v} Block zu Kampfbeginn`,heil_nach_sieg:`+${p.v} Leben nach jedem Sieg`,erste_karte_billiger:'Die erste Karte im Kampf kostet 0',glueck:'Ein Fund mehr zur Auswahl'}[p.typ]||p.typ;}
function hgKarteHtml(id,attr,extra=''){const H=HANDGRIFFE[id];if(!H)return'';return `<div class="pick hgpick ${H.rar==='selten'?'selten':''}" ${attr}><div class="hgk">${H.c>0||!H.opfer?`<span class="hgc">${H.x?'X':H.c}</span>`:''}<b>${esc(H.n).toUpperCase()}</b></div>${hgBild(id)?`<img class="hgimg" src="${hgBild(id)}" alt="">`:''}<div class="ps">${esc(cardText(H))}</div>${H.t?`<div class="hgt">${esc(H.t)}</div>`:''}<div class="hgb">${esc(BUILD_N[H.build]||'')}</div>${extra}</div>`;}
const BUILD_N={glutnest:'Glutnest',brackwasser:'Brackwasser',bollwerk:'Bollwerk',aderlass:'Aderlass',kettenwerk:'Kettenwerk',hagel:'Hagel',ballast:'Ballast',kollekte:'Kollekte',neutral:''};
function rewardHtml(){if(S.hgPending&&!S.hgPicked)return ritzenHtml('Wohin ritzt du ihn?');
 const wa=S.kampfArt==='waechter';
 return box('reward',`<h2>${wa?'DER WÄCHTER FÄLLT':'STILLE'}</h2><p class="lead">${S.goldGain?`+${S.goldGain} Gold. `:''}${esc(S.beuteSatz||'Unter dem, was übrig ist, liegt etwas.')}</p>
 ${S.hgPicked?'':`<h3>EIN HANDGRIFF</h3><div class="picks">${S.rewardHg.map(id=>hgKarteHtml(id,`data-hg="${id}"`)).join('')}</div><p><button class="deco klein" data-act="hgSkip">ÜBERSPRINGEN (+${(BAL.belohnung&&BAL.belohnung.ueberspringen_gold)||10} GOLD)</button></p>`}
 ${S.reward.length&&!S.picked?`<h3>${wa?'EINE RELIQUIE':'EIN FUND'}</h3><div class="picks">${S.reward.map(id=>itemPick(id,`data-take="${id}"`)).join('')}</div><p><button class="deco klein" data-take="">NICHTS NEHMEN</button></p>`:''}
 <button class="deco" data-act="weiterReward">WEITER ›</button>`);}
// Ritzen: Handgriff in ein Item. Zeigt je Item den Stoff, den er annimmt, und welche Reaktionen er dann auslösen kann.
function ritzenHtml(frage){const id=S.hgPending;const H=HANDGRIFFE[id];if(!H)return'';const deckSt=new Set(allActive().flatMap(it=>def(it).st));
 const reih=st=>{const o=[];REACT.forEach(r=>{const[a,b]=[...r.k];if((st.includes(a)&&deckSt.has(b))||(st.includes(b)&&deckSt.has(a)))o.push(S.disc.has(r.n)?r.n:'???');});return[...new Set(o)];};
 return box('ritzen',`<h2>${esc(H.n).toUpperCase()}</h2><p class="lead">${esc(cardText(H))}${H.t?` · <i>${esc(H.t)}</i>`:''}</p><p>${frage} Er nimmt den Stoff des Items an.</p>
 <div class="ritzliste">${besitz().map(({it,an})=>{const D=def(it);const hg=hgVon(it),cap=kerbenVon(it);const rx=reih(D.st);
  return `<div class="ritz ${an?'':'rucksack'}"><img src="${itemBild(it.id)}"><div class="rn"><b>${esc(D.n)}</b> ${D.st.map(k=>gi(k,KZ())).join('')||'<span class="hint">stofflos</span>'}${an?'':' <span class="hint">(Rucksack)</span>'}<br><span class="hint">${rx.length?'reagiert mit: '+rx.join(', '):'keine Reaktion mit deinem Deck'}</span></div>
  <div class="kerben">${[...Array(cap)].map((_,k)=>hg[k]?`<button class="kerbe voll" data-ritz="${it.uid}" data-k="${k}" title="überschreiben">${esc(HANDGRIFFE[hg[k]]?HANDGRIFFE[hg[k]].n:hg[k])}</button>`:`<button class="kerbe leer" data-ritz="${it.uid}">frei</button>`).join('')}</div></div>`;}).join('')}</div>
 ${S.ueberschreiben?`<p class="err">„${esc(HANDGRIFFE[S.ueberschreiben.alt].n)}“ wirklich überschreiben? <button class="deco klein" data-act="ueberJa">JA</button> <button class="deco klein" data-act="ueberNein">NEIN</button></p>`:''}
 <button class="deco klein" data-act="hgVerwerfen">VERWERFEN</button>`);}
// Wahl: Schleifen, Kerbe dazu, Umritzen
function wahlHtml(){const w=S.wahl;if(!w)return'';
 if(w.art==='kerbe')return box('ritzen',`<h2>EINE KERBE MEHR</h2><p class="lead">Welches Item bekommt eine weitere Kerbe (höchstens 3)?</p><div class="ritzliste">${besitz().map(({it})=>{const D=def(it);return `<div class="ritz"><img src="${itemBild(it.id)}"><div class="rn"><b>${esc(D.n)}</b> ${kerbenVon(it)} Kerben</div><button class="deco klein" data-kerbe="${it.uid}" ${kerbenVon(it)>=3?'disabled':''}>KERBE</button></div>`;}).join('')}</div><button class="deco klein" data-act="wahlAbbruch">LIEBER NICHT</button>`);
 if(w.art==='schleifen')return box('ritzen',`<h2>SCHLEIFEN</h2><p class="lead">Eine Karte kostet dauerhaft 1 weniger. Jede Karte nur einmal.</p><div class="ritzliste">${besitz().filter(b=>b.an).map(({it})=>{const D=def(it);
  const ks=[...D.cards.map((c,ci)=>({key:'s'+ci,c,n:c.n})),...hgVon(it).map((id,k)=>({key:'h'+k,c:HANDGRIFFE[id],n:HANDGRIFFE[id]&&HANDGRIFFE[id].n}))].filter(x=>x.c);
  return `<div class="ritz"><img src="${itemBild(it.id)}"><div class="rn"><b>${esc(D.n)}</b></div><div class="kerben">${ks.map(x=>{const g=it.schliff&&it.schliff[x.key];return `<button class="kerbe ${g?'voll':'leer'}" data-schleif="${it.uid}" data-key="${x.key}" ${g||(x.c.c||0)<1?'disabled':''}>${esc(x.n)} (${x.c.c||0}${g?' ◇':''})</button>`;}).join('')}</div></div>`;}).join('')}</div><button class="deco klein" data-act="wahlAbbruch">LIEBER NICHT</button>`);
 if(w.art==='umritzen'){const q=S.umritzQuelle;return box('ritzen',`<h2>UMRITZEN</h2><p class="lead">${q?'Wohin damit?':'Welchen Handgriff willst du in ein anderes Item ritzen?'}</p><div class="ritzliste">${besitz().map(({it,an})=>{const D=def(it);const hg=hgVon(it);
  return `<div class="ritz ${an?'':'rucksack'}"><img src="${itemBild(it.id)}"><div class="rn"><b>${esc(D.n)}</b> ${D.st.map(k=>gi(k,KZ())).join('')}</div><div class="kerben">${q?(q.uid!==it.uid&&hg.length<kerbenVon(it)?`<button class="kerbe leer" data-umziel="${it.uid}">hierher</button>`:''):hg.map((id,k)=>`<button class="kerbe voll" data-umquelle="${it.uid}" data-k="${k}">${esc(HANDGRIFFE[id]?HANDGRIFFE[id].n:id)}</button>`).join('')}</div></div>`;}).join('')}</div><button class="deco klein" data-act="wahlAbbruch">LIEBER NICHT</button>`);}
 return'';}
// Ereignisbilder (Zugabe 3): assets/ereignisse/index.json listet die vorhandenen Bilder 160×90 (gebaut mit tools/ereignisse/bauen.js).
// Ein Ereignis ohne Eintrag zeigt den Zettel wie bisher, ohne Bild und ohne Anfrage nach einer fehlenden Datei.
let EV_BILDER=new Set();
(async()=>{try{const r=await fetch('assets/ereignisse/index.json',{cache:'no-store'});if(!r.ok)return;const j=await r.json();EV_BILDER=new Set(j.ereignisse||[]);
 if(typeof S!=='undefined'&&S&&(S.phase==='event'||S.phase==='event_folge'))render();}catch(e){}})();
function evBildHtml(ev){return EV_BILDER.has(ev.id)?`<div class="evbild"><img src="assets/ereignisse/${encodeURIComponent(ev.id)}.png" alt="${esc(ev.bild||ev.t)}" draggable="false"></div>`:'';}
function eventHtml(){const ev=curEvent();if(!ev)return'';const done=S.phase==='event_folge';
 return box('ereignis zettel',`${evBildHtml(ev)}<h2>${esc(ev.t).toUpperCase()}</h2><p class="evd">${esc(ev.d)}</p>${ev.o.map((o,i)=>`<button class="opt ${S.eventChoice===i&&done?'gew':''}" data-ev="${i}" ${condOk(o.if)&&!done?'':'disabled'}>› ${esc(o.l)}</button>`).join('')}`);}
function streichenHtml(t,skip){const list=strikeTargets();return box('streichen',`<h2>KARTE STREICHEN</h2><p class="lead">${t}</p><div class="picks">${list.map(it=>{const d=def(it);return `<div class="pick" data-strike="${it.uid}"><img src="${itemBild(it.id)}"><div class="pn">${esc(d.n)}</div><div class="ps">${d.cards.map(c=>esc(c.n)+': '+esc(cardText(c))).join('<br>')}</div></div>`;}).join('')}</div><button class="deco klein" data-act="${skip}">LIEBER NICHT</button>`);}
function kraemerHtml(){const b=biom();const k=b.kraemer;const H=BAL.shop.heal;const sh=S.shop;
 return box('kraemer',`<h2>${esc(k.n).toUpperCase()}</h2><p class="lead">${esc(k.ort)}. ${esc(k.zeile)}</p><p class="gold">${gi('gold',KZ())} ${S.gold} Gold</p>${sh.art==='tausch'?`<p class="hint">Hier zahlt man nicht mit Gold. Wähl unten ein Item, das du hergibst${S.sel&&getAt(S.sel)?` (gewählt: <b>${esc(def(getAt(S.sel)).n)}</b>)`:''}, dann das, was du dafür nimmst.</p>`:sh.art==='leihe'?'<p class="hint">Alles hier ist geliehen. Am Anfang des nächsten Akts kommt es zurück.</p>':sh.art==='spiegel'?'<p class="hint">Dieselben Dinge wie beim letzten Krämer. Nur andersherum.</p>':''}
 <div class="picks">${sh.items.map((o,i)=>itemPick(o.id,`data-buy="${i}"`,`<div class="preis">${o.sold?(o.tausch?'GETAUSCHT':o.leihe?'VERLIEHEN':'VERKAUFT'):o.tausch?'GABE GEGEN GABE':o.leihe?o.price+' GOLD · BIS ZUM NÄCHSTEN AKT':o.price+' GOLD'}</div>`).replace('class="pick ',`class="pick ${o.sold?'weg ':''}`)).join('')}
 <div class="pick ${sh.heal?'weg':''}" data-buy="heal"><div class="pn">Laudanum</div><div class="ps">+${H.v} Leben</div><div class="preis">${sh.heal?'VERKAUFT':H.price+' GOLD'}</div></div>
 </div>
 ${(sh.hg||[]).length?`<h3>HANDGRIFFE</h3><div class="picks">${sh.hg.map((o,i)=>hgKarteHtml(o.id,`data-buyhg="${i}"`,`<div class="preis">${o.sold?'VERKAUFT':o.price+' GOLD'}</div>`).replace('class="pick ',`class="pick ${o.sold?'weg ':''}`)).join('')}</div>`:''}
 <h3>VERKAUFEN UND ENTFERNEN</h3><p class="hint">Klick unten ein Item an, dann verkaufst du es hier für 40 % (${S.sel&&getAt(S.sel)?`<button class="deco klein" data-act="verkaufen">${esc(def(getAt(S.sel)).n).toUpperCase()} FÜR ${Math.floor(preisVon(def(getAt(S.sel)))*.4)} GOLD</button>`:'nichts gewählt'}). Handgriff entfernen: ${(BAL.shop.hg_entfernen||25)} Gold.</p>
 <div class="entf">${besitz().filter(b=>hgVon(b.it).length).map(({it})=>hgVon(it).map((id,k)=>(def(it).fest_hg||[]).includes(id)?'':`<button class="kerbe voll" data-entf="${it.uid}" data-k="${k}">✕ ${esc(HANDGRIFFE[id]?HANDGRIFFE[id].n:id)} <span class="hint">(${esc(def(it).n)})</span></button>`).join('')).join('')}</div>
 <button class="deco" data-act="leave">WEITER ›</button>`);}
function werkstattHtml(){const p=forgePreview();const F=BAL.forge;
 return box('werkstatt',`<h2>WERKSTATT</h2><p class="lead">Eine Werkbank, die noch funktioniert. Einmal verschmelzen: gleicher Stoff gibt eine Stufe, zwei Stoffe, die reagieren, ein Doppel-Item.</p>
 <div class="bench">${slotHtml('bench:0')}<span class="plus">+</span>${slotHtml('bench:1')}<div class="preview">${S.forged?'<b>Fertig.</b> Zieh das neue Item in deine Ausrüstung.':p?(p.err?`<span class="err">${esc(p.err)}</span>`:`<b>${esc(p.n)}</b> ${p.st.map(k=>gi(k,KZ())).join('')}<br>${p.same?`Stufe: ${p.cards.length} Karten, je +${F.bump}`:`Doppel-Item: ${p.cards.length} Karten, je +${F.bump}, jede kostet ${F.double_cost_extra} mehr`}${p.rx.length?'<br>In sich: '+p.rx.map(r=>S.disc.has(r.n)?r.n:'???').join(', '):''}`):'<span class="hint">Zieh zwei Items aus der Ausrüstung oder dem Rucksack auf die Werkbank.</span>'}</div>
 <button class="deco klein" data-act="forge" ${!p||p.err||S.forged?'disabled':''}>VERSCHMELZEN</button></div>
 ${S.forged?'':`<p class="hint">Oder statt zu verschmelzen:</p><p><button class="deco klein" data-act="wsKerbe">EINE KERBE MEHR</button> <button class="deco klein" data-act="wsSchleifen">EINE KARTE SCHLEIFEN</button></p>`}<button class="deco" data-act="leave">WEITER ›</button>`);}
function rastHtml(){const v=Math.round(maxHp()*RUN.rast.heil_anteil);
 return box('rast',`<h2>RAST</h2><p class="lead">${esc((biom().weg_hinweise.rast||[''])[0])} Für einen Moment ruft nichts.</p>
 ${S.rastDone?'<p class="hint">Du hast gerastet.</p>':`<div class="wahl"><button class="deco" data-act="rastHeil">SCHLAFEN<br><small>+${v} Leben</small></button><button class="deco" data-act="rastSchleifen">SCHLEIFEN<br><small>eine Karte −1 Kosten</small></button><button class="deco" data-act="rastUmritzen">UMRITZEN<br><small>Handgriff verlegen</small></button></div>`}
 <button class="deco" data-act="leave">WEITER ›</button>`);}
function wandbildHtml(){const fr=FRAGS.find(f=>f.id===S.frag);const neu=S.fragNeu||[];
 return `<div class="wandbild"><canvas id="relief" width="160" height="100"></canvas><div class="zettel"><h3>${fr?esc(fr.titel):'Eine leere Wand'}</h3><p>${fr?esc(fr.text):'Jemand hat hier etwas weggekratzt.'}</p>
 ${neu.length?`<div class="neu">${neu.map(x=>`Neu: ${esc(x.n)}`).join('<br>')}</div>`:''}</div><button class="deco" data-act="leave">WEITER ›</button></div>`;}
function fundHtml(){const f=S.fund;return box('fund',`<h2>FUNDSTELLE</h2><p class="lead">${esc((biom().weg_hinweise.fundstelle||[''])[0])}</p>
 ${f.taken?`<p>${f.item?'Eingesteckt: '+esc(ITEMS[f.item].n):''}${f.gold?`+${f.gold} Gold`:''}${f.haken?` · Es hatte einen Haken: −${RUN.fundstelle.haken_schaden} Leben.`:''}</p>`:`<div class="picks">${f.item?itemPick(f.item,'data-act="fund"'):`<div class="pick" data-act="fund"><div class="pn">${f.gold} Gold</div></div>`}</div><p class="hint">Vielleicht hat es einen Haken.</p>`}
 <button class="deco" data-act="leave">${f.taken?'WEITER ›':'LIEGEN LASSEN ›'}</button>`);}
// Endbildschirm (nach Strand, Bleiben und Umkehren): Statistik, Weg, Deck, Build, neue Freischaltungen
function dauerText(ms){const m=Math.max(0,Math.round(ms/60000));return m<60?`${m} min`:`${Math.floor(m/60)} h ${m%60} min`;}
function endschirmHtml(titel,satz){const r=S.ergebnis||{};const st=S.stats||{};const neu=S.neu||[];const b=buildArchetyp();const j=JOBS.find(x=>x.id===S.job)||{};
 const deck=allActive().filter(it=>!it.x).map(it=>{const D=def(it);return `<div class="dk"><img src="${itemBild(it.id)}"><b>${esc(D.n)}</b> ${D.st.map(k=>gi(k,KZ())).join('')}<br><span class="hint">${D.cards.map(c=>esc(c.n)).join(', ')}${(it.hg||[]).map(id=>HANDGRIFFE[id]?', '+esc(HANDGRIFFE[id].n):'').join('')}</span></div>`;}).join('');
 const zeile=(k,v)=>`<div><span class="hint">${k}</span> ${v}</div>`;
 return box('endschirm',`<h2>${titel}</h2><p class="lead">${satz}</p>
 <div class="wegbilder">${S.route.filter(Boolean).map((bi,i)=>`<div><canvas class="wegbild" data-wbiom="${bi}" width="96" height="54"></canvas><span>${esc(BIOMES[bi].kurz)}</span></div>`).join('<span class="pfeil">→</span>')}</div>
 <div class="stats">${zeile('Figur',esc(j.n||S.jobN))}${zeile('Seed',S.seed)}${zeile('Dauer',dauerText((st.endeT||Date.now())-S.startT))}${zeile('Tiefe',romanN(Math.max(1,r.tiefe||S.depth)))}
 ${zeile('Kämpfe',st.kaempfe||0)}${zeile('Gold',`${st.gold||0} verdient, ${st.goldAus||0} ausgegeben`)}${zeile('Schaden',`${st.schadenRaus||0} ausgeteilt, ${st.schadenRein||0} genommen`)}
 ${zeile('Höchster Treffer',st.maxTreffer||0)}${zeile('Längste Kette',`${st.maxKette||0} Reaktionen in einem Zug`)}${zeile('Reaktionen entdeckt',`${S.disc.size} von ${allRx().length}`)}
 ${zeile('Build',b.n)}${r.sieg?'':zeile('Todesursache',esc(st.todesursache||'die Tiefe'))}</div>
 <h3>DAS DECK AM ENDE</h3><div class="deckende">${deck}</div>
 ${neu.length?`<div class="neu">${neu.map(x=>'Neu: '+esc(x.n)).join('<br>')}</div>`:''}
 <div class="knoepfe"><button class="deco" data-act="neu">NEUER ABSTIEG</button><button class="deco klein" data-act="gleicherSeed">GLEICHER SEED</button><button class="deco klein" data-act="bildSpeichern">BILD SPEICHERN</button><button class="deco klein" data-act="titel">ZUM TITEL</button></div>`);}
function strandHtml(){return endschirmHtml(esc(RUN.strand.titel).toUpperCase(),esc(RUN.strand.text));}
function ankunftHtml(){const A=RUN.ankunft;const j=JOBS.find(x=>x.id===S.job);
 return `<div class="ankunft"><p class="bild">${esc(biom().ankunft_bild||A.bild)}</p><p class="wahr">„${esc(j.wahrheit)}“</p><div class="zwei"><button class="deco" data-ende="bleiben">${A.bleiben.knopf.toUpperCase()}</button><button class="deco" data-ende="umkehren">${A.umkehren.knopf.toUpperCase()}</button></div></div>`;}
function endeHtml(){const A=RUN.ankunft;const r=S.ergebnis;return endschirmHtml(esc(A[r.ende].text).toUpperCase(),`„${esc(JOBS.find(x=>x.id===S.job).wahrheit)}“`);}
// kleine Bilder des Wegs (Kampfszene je Biom, ganzzahlig 1:5 verkleinert)
function wegbilderMalen(){document.querySelectorAll('canvas.wegbild').forEach(c=>{if(c.dataset.ok)return;c.dataset.ok=1;try{const sz=typeof World!=='undefined'?World.build(c.dataset.wbiom,{art:'kampf',variante:0,seed:3,fremdheit:.3}):ersatzSzene({biom:c.dataset.wbiom});
 const t=document.createElement('canvas');t.width=SW;t.height=SH;const g=t.getContext('2d');sz.ebenen.forEach(L=>g.drawImage(L.canvas,L.x||0,L.y||0));const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 for(let y=0;y<54;y++)for(let i=0;i<96;i++){x.drawImage(t,i*5+2,y*5+2,1,1,i,y,1,1);}}catch(e){}});}

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
function zeigeOverlay(html){if(typeof hideTip==='function')hideTip();const o=$('overlay');o.innerHTML=html;o.classList.add('an');}
function closeOv(){$('overlay').classList.remove('an');}
// Wandbild-Relief zeichnen (prozedural; im Stil der Hintergründe, sobald World.relief da ist)
function reliefMalen(){const c=$('relief');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 if(typeof World!=='undefined'&&World.relief){try{const r=World.relief(biomId(),hashStr(S.frag||'x'));x.drawImage(r,0,0,160,100);return;}catch(e){}}
 const B=biom();const r=new Rng(hashStr(S.frag||'leer'));x.fillStyle=B.koerper[2];x.fillRect(0,0,160,100);
 for(let i=0;i<9;i++){const cx=14+i*16+r.int(-3,3),cy=50+r.int(-6,6),h=r.int(18,34);x.fillStyle=B.koerper[0];x.fillRect(cx,cy-h/2,2,h);x.fillRect(cx-4,cy-h/2+4,10,2);x.fillStyle=B.rand[0];x.fillRect(cx+2,cy-h/2,1,h);}
 x.fillStyle=B.rand[1];x.fillRect(78,12,4,4);}

// ---------- Rucksackmodus (07-ui-und-gefuehl.md Abschnitt 2): Entwurf ändern, Deck-Änderung grün/rot, erst „Übernehmen“ macht es fest ----------
let RS=null;
function rucksackAuf(){if(!S.route||!canEquip())return;RS={areas:Object.fromEntries(AREAS.map(a=>[a,[...S.areas[a]]])),bag:[...S.bag],sel:null};zeigeRucksack();}
function rsAktiv(){return AREAS.flatMap(a=>RS.areas[a].slice(0,S.slots[a]).filter(Boolean));}
function rsGet(loc){const[k,i]=loc.split(':');return k==='bag'?RS.bag[+i]:RS.areas[k][+i];}
function rsSet(loc,v){const[k,i]=loc.split(':');if(k==='bag')RS.bag[+i]=v;else RS.areas[k][+i]=v;}
function rsKlick(loc){if(!RS.sel){if(rsGet(loc))RS.sel=loc;zeigeRucksack();return;}const a=rsGet(RS.sel),b=rsGet(loc);const[k]=loc.split(':'),[k0]=RS.sel.split(':');
 const passt=(it,l)=>{if(!it)return true;const[kk,ii]=l.split(':');return kk==='bag'||(def(it).a===kk&&+ii<S.slots[kk]);};
 if(RS.sel!==loc&&passt(a,loc)&&passt(b,RS.sel)){rsSet(loc,a);rsSet(RS.sel,b);}else if(RS.sel!==loc)Bus.emit('bad',{a:'PASST NICHT',b:a?'Gehört zu '+AREA_N[def(a).a]:''});RS.sel=null;zeigeRucksack();}
function rucksackHtml(){const alt=allActive(),neu=rsAktiv();const altD=deckListe(alt),neuD=deckListe(neu);
 const slot=(loc,locked)=>{const it=locked?null:rsGet(loc);const D=it&&def(it);return `<div class="slot ${locked?'zu':''} ${RS.sel===loc?'sel':''} ${D&&rarOf(D)!=='gewoehnlich'?'selten':''}" ${locked?'':`data-rs="${loc}"`}>${D?`<img src="${itemBild(it.id)}"><span class="kb">${[...Array(kerbenVon(it))].map((_,k)=>`<i class="${hgVon(it)[k]?'voll':''}"></i>`).join('')}</span>`:''}</div>`;};
 const gruppen=[...new Set([...alt,...neu])].map(it=>{const st=neu.includes(it)&&alt.includes(it)?'bleibt':neu.includes(it)?'neu':'raus';const D=def(it);
  return `<div class="dg ${st}"><b>${esc(D.n)}</b> ${D.st.map(k=>gi(k,KZ())).join('')}<span class="hint"> ${st==='neu'?'kommt rein':st==='raus'?'geht raus':''}</span><div>${kartenVon(it).map(c=>`<span class="dc">${c.hg?'✋ ':''}${esc(c.n)} (${cardCost(c)})</span>`).join('')}</div></div>`;}).join('');
 return box('rucksack',`<h2>RUCKSACK</h2><p class="lead">Klick ein Item, dann den Platz, an den es soll. Rechts siehst du, was das mit deinem Deck macht.</p>
 <div class="rs3"><div class="rsl">${AREAS.map(a=>`<h4>${AREA_N[a]}</h4><div class="slots">${[...Array(BAL.max_slots).keys()].map(i=>slot(a+':'+i,i>=S.slots[a])).join('')}</div>`).join('')}<h4>RUCKSACK</h4><div class="slots">${RS.bag.map((_,i)=>slot('bag:'+i)).join('')}</div>
 ${RS.sel&&rsGet(RS.sel)?`<div class="rsinfo"><b>${esc(def(rsGet(RS.sel)).n)}</b>${def(rsGet(RS.sel)).eigen?`<br><i>${esc(eigenText(def(rsGet(RS.sel)).eigen))}</i>`:''}<br><span class="hint">${esc(def(rsGet(RS.sel)).flavor||'')}</span><br>Kerben: ${hgVon(rsGet(RS.sel)).map(id=>HANDGRIFFE[id]?esc(HANDGRIFFE[id].n):id).join(', ')||'leer'}${S.phase==='kraemer'?`<br><button class="deco klein" data-act="rsVerkaufen">VERKAUFEN FÜR ${Math.floor(preisVon(def(rsGet(RS.sel)))*.4)} GOLD</button>`:''}</div>`:''}</div>
 <div class="rsr"><h4>DECK: ${altD.length} → <span class="${neuD.length>altD.length?'gr':neuD.length<altD.length?'rt':''}">${neuD.length}</span> KARTEN</h4>${gruppen}</div></div>
 <p><button class="deco" data-act="rsUebernehmen">ÜBERNEHMEN</button> <button class="deco klein" data-act="rsZu">VERWERFEN</button></p>`);}
function zeigeRucksack(){zeigeOverlay(rucksackHtml());}
function rucksackUebernehmen(){if(!RS)return;AREAS.forEach(a=>{S.areas[a]=RS.areas[a];});S.bag=RS.bag;RS=null;closeOv();Bus.emit('pick');after();}
// ---------- Hover-Vorschau am Cursor: welche Karten ins Deck kämen, welche Reaktionen dadurch möglich würden ----------
function vorschauKarten(karten,titel){const deckSt=new Set(allActive().flatMap(it=>def(it).st));const st=new Set(karten.flatMap(c=>c.st));const rx=[];
 REACT.forEach(r=>{const[a,b]=[...r.k];if((st.has(a)&&deckSt.has(b))||(st.has(b)&&deckSt.has(a)))rx.push(S.disc.has(r.n)?r.n:'???');});
 const einm=[];const seen=new Set();karten.forEach(c=>{const k=c.n+c.hg;if(!seen.has(k)){seen.add(k);einm.push({...c,anz:karten.filter(x=>x.n===c.n&&x.hg===c.hg).length});}});
 return `<div class="tn">${titel}</div><div class="vkr">${einm.map(c=>`<div class="vk"><div class="vkc">${c.x?'X':c.opfer?'♥'+c.opfer:c.c}</div><b>${esc(c.n)}${c.anz>1?' ×'+c.anz:''}</b><div>${c.st.map(k=>gi(k,9)).join('')||'<span class="hint">Stoff des Items</span>'}</div><div class="vkt">${esc(cardText(c))}</div></div>`).join('')}</div>${rx.length?`<div class="hint">Reagiert mit deinem Deck: ${[...new Set(rx)].join(', ')}</div>`:''}`;}
function hoverVorschau(el){const tk=el.closest('[data-take],[data-buy],[data-hg],[data-buyhg]');if(!tk)return null;
 if(tk.dataset.hg||tk.dataset.buyhg!=null){const id=tk.dataset.hg||(S.shop&&S.shop.hg[+tk.dataset.buyhg]||{}).id;const H=HANDGRIFFE[id];if(!H)return null;return vorschauKarten([{...H,st:[]}],'Kommt als 1 Karte ins Deck, mit dem Stoff des Items, in das du ihn ritzt');}
 const id=tk.dataset.take||(tk.dataset.buy!=null&&S.shop&&S.shop.items[+tk.dataset.buy]&&S.shop.items[+tk.dataset.buy].id);if(!id||!ITEMS[id])return null;
 const tmp={uid:-1,id};return vorschauKarten(kartenVon(tmp),'Angelegt kommen ins Deck:');}
