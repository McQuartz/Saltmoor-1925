// Kampfanzeige (aus oberflaeche.js geteilt, Auftrag 3 M2): Gegner mit Absicht und Plakette, untere Leiste mit Hand und Energie, Ausrüstung unter der Szene.
// ---------- Gegner (Plakette über dem Kopf: Absicht, Leben, Block, Status) ----------
// Kniffe und Besonderheiten der Gegner in Spielerworten (Tooltip über dem Gegner)
const KNIFF_TEXT={dornen:k=>`Dornen: jeder Treffer an ihm kostet dich ${k.v||2}`,loeschen:()=>'Löscht jeden Brand seiner Seite',rein:()=>'Rein: Gift wirkt nur halb',brecher:()=>'Zerbricht deinen Block, bevor er zuschlägt',kleinvieh:()=>'Kommt selten allein',
 abschrift:k=>`Mischt ${k.n||1} unspielbare Karte(n) in deinen Ablagestapel`,waechst:k=>`Wächst: jeden Zug +${k.v||2} Stärke`,schuetzer:k=>`Gibt Verbündeten ${k.v||4} Block`,ruf:k=>`Ruft alle ${k.alle||3} Züge Verstärkung: ${[].concat(k.gegner).map(g=>FOES[g]?FOES[g].n:'?').join(', dann ')}`,
 wechsel:k=>`Wechselt die Schwachstelle: ${(k.stoffe||[]).map(x=>ST[x]?ST[x].n:x).join(' → ')}`,ansage:k=>`Lädt ${k.zuege||2} Züge, dann ein großer Schlag`,nachlass:k=>k.was==='explodiert'?`Explodiert beim Tod (${k.v||0})`:k.was==='teilt'?'Teilt sich beim Tod':'Hinterlässt etwas',
 verborgen:()=>'Verborgen: du siehst nur, was, nicht wie viel',heiler:k=>`Heilt Verbündete um ${k.v||4}`,einfrieren:()=>'Friert jeden Zug eine Handkarte ein',verstopfen:k=>`Steckt ${k.n||1} unspielbare Karte(n) in deine Hand`,
 teurer:k=>`Eine Handkarte kostet jeden Zug ${k.v||1} mehr`,kopie:k=>`Schreibt deine letzte Karte ab und spielt sie gegen dich${k.n?', mischt Abschriften ein':''}`,takt:k=>`Schlägt jeden zweiten Zug: alle +${k.v||6} Block; dazwischen verwundbar`,voraus:()=>'Spielt deine nächste Karte vor dir; schwach gegen den Stoff, den du am wenigsten spielst'};
const BES_TEXT={ruft:b=>`Ruft alle ${b.alle||3} Züge Verstärkung: ${FOES[b.gegner]?FOES[b.gegner].n:'?'}`,schwach_wechsel:b=>`Schwachstelle wechselt: ${(b.stoffe||[]).map(x=>ST[x]?ST[x].n:x).join(' → ')}`,phasen:()=>'Verwandelt sich, wenn es schwächer wird'};
// Nächste Schwachstelle bei Kniff „wechsel“ oder Besonderheit „schwach_wechsel“ (so wie combat.js sie am Zugende setzt)
function naechsteSchwach(e){const k=kniffeVon(e).find(k=>k.art==='wechsel'&&k.stoffe);if(k)return k.stoffe[(e.turns+1)%k.stoffe.length];const b=e.besonders;if(b&&b.art==='schwach_wechsel'&&b.stoffe)return b.stoffe[(e.turns+1)%b.stoffe.length];return null;}
function feindTip(i){const e=S.enemies[i];if(!e||e.hp<=0)return'';const bl=typeof Blick!=='undefined'&&Blick.aktiv();const ks=[e.kniff,...(e.kniffe||[])].filter(k=>k&&KNIFF_TEXT[k.art]&&!(bl&&k.art==='verborgen')); // M7: mit Hinsehen ist nichts verborgen
 const nw=naechsteSchwach(e);const pu=e.pat[e.pi%e.pat.length];
 const ruf=rufeVon(e);
 const stumm=typeof Hoeren!=='undefined'&&Hoeren.istStumm(e); // M6: kein Hinweis auf die Absicht, auch nicht im Tooltip
 return `<b>${esc(e.n)}</b>${ruf.length&&!stumm?`<br>◆ Ruft im nächsten Gegnerzug: ${esc(ruf.map(id=>FOES[id].n).join(', '))}`:''}${pu&&unverwJetzt(e)&&!stumm?`<br>◆ Diesen Zug unverwundbar${pu.why?`<br><i class="hint">${esc(pu.why)}</i>`:''}`:''}${e.weak?`<br>Schwachstelle: ${gi(e.weak,KZ())} ${ST[e.weak].n} (×1,5)`:''}${nw&&nw!==e.weak?`<br>Danach: ${gi(nw,KZ())} ${ST[nw].n}`:''}${ks.map(k=>`<br>◆ ${esc(KNIFF_TEXT[k.art](k))}${k.why?`<br><i class="hint">${esc(k.why)}</i>`:''}`).join('')}${e.besonders&&BES_TEXT[e.besonders.art]?`<br>◆ ${esc(BES_TEXT[e.besonders.art](e.besonders))}`:''}${e.weak2?'<br>Geschwächt: halber Schaden':''}${e.panzer>0&&BAL.panzer?`<br>◆ ${esc(BAL.panzer.t)}`:''}${e.vuln>0?`<br>Verwundbar ${e.vuln} (+50 %)`:''}`;}
// Absicht mit Zusatzzeichen: „unverwundbar“ (Musterschritt unverw) und „ruft“ (holt im nächsten Gegnerzug Verstärkung, rufAnsage in combat.js)
const rufeVon=e=>e&&e.uid&&typeof rufAnsage==='function'&&S.enemies&&S.enemies.includes(e)?rufAnsage(e):[];
function absicht(e){const r=absicht0(e);if(unverwJetzt(e))r.html+=' <small class="unverw">unverwundbar</small>';
 if(e.pat[e.pi%e.pat.length].gesehen)r.html+=' <small class="gesehen">sieht dich</small>'; // M7: der stärkere Zug, der mit dem Hinsehen dazukam
 const ruf=rufeVon(e);if(ruf.length)r.html+=` <small class="ruft" title="Ruft: ${esc(ruf.map(id=>FOES[id].n).join(', '))}">ruft</small>`;return r;}
function absicht0(e){const it=e.pat[e.pi%e.pat.length];if(e.kniff&&e.kniff.art==='verborgen'&&!(typeof Blick!=='undefined'&&Blick.aktiv())){const k=it.t==='atk'?'atk':it.t==='blk'?'blk':'buff';return{k,html:`${gi(k,GZ())}`};}if(it.t==='atk'){const v=it.v+e.str;const h=it.h?'×'+it.h:'';if(e.weak2){const n=Math.floor(v/2);return{k:'atk',html:`<span class="geschw" title="Geschwächt: halber Schaden">${gi('atk',GZ())}${n}${h}</span>`};}return{k:'atk',html:`${gi('atk',GZ())}${v}${h}`};}
 if(it.t==='blk')return{k:'blk',html:`${gi('blk',GZ())}${it.v}`};
 // Ansage: lädt, dann großer Schlag; zeigt die Wucht und wie viele Züge noch
 if(it.t==='laedt'){let n=1,j=e.pi+1;while(n<9&&e.pat[j%e.pat.length].t==='laedt'){n++;j++;}const s=e.pat[j%e.pat.length];const v=(s.v||0)+e.str;return{k:'atk',html:`<span class="laedt">${gi('atk',GZ())}${v} <small>in ${n}</small></span>`};}
 return{k:'buff',html:`${gi('buff',GZ())}+${it.v}`};}
// Plakette (Auftrag 3, M2): Absicht oben, Leben als roter Balken, Block/Panzer als blaue Verlängerung, Status darunter, Kniff am Rand, Spitze zum Kopf.
// Die Höhenstaffelung (--dx, --dy) setzt plakettenOrdnen() in js/ui/plakette.js nach dem Einsetzen ins DOM.
function plaketteHtml(e,i,f,pv,tg){
 const abs=f&&absichtSichtbar(e)?`<div class="abs">${absicht(e).html}</div>${typeof Bieg!=='undefined'&&Bieg.absichtenSichtbar(e)>1?`<div class="abs abs2" title="Die Rückseite: was ${esc(e.n)} im Zug danach vorhat">danach ${absicht0({...e,pi:e.pi+1}).html}</div>`:''}`:'';
 const d=pv?Math.min(e.hp,pv.d):0,ab=pv?Math.min(e.block,pv.ab):0,W=v=>Math.max(0,Math.min(100,v/e.max*100)).toFixed(1)+'%';
 const st=[e.burn&&['burn',e.burn,STN.burn],e.poison&&['poison',e.poison,STN.poison],e.weak2&&['weak',1,'Geschwächt: halber Schaden'],e.str&&['buff',e.str,STN.buff],e.vuln>0&&['atk2',e.vuln,`Verwundbar ${e.vuln} (+50 %)`]].filter(Boolean);
 const blk=e.block-ab,ext=(blk>0||ab>0?`<b class="pl-blk ${ab?'pvb':''}" title="Block">${blk>0?blk:ab}</b>`:'')+(e.panzer>0?`<b class="pl-pz" title="${esc((BAL.panzer&&BAL.panzer.t)||'')}">${gi('blk',KZ())}${e.panzer}</b>`:'');
 return `<div class="plakette"><div class="pl-box">${e.kniff||e.besonders?'<b class="knf" title="Kniff: Maus darüber">◆</b>':''}${abs}${f?klangzeichenHtml(e):''}
  <div class="pl-nm"><span>${esc(e.n).toUpperCase()}</span>${e.weak?gi(e.weak,KZ()):''}</div>
  <div class="pl-bar"><i class="hp" style="width:${W(e.hp-d)}"></i>${d?`<i class="pv" style="width:${W(d)}"></i>`:''}<span>${e.hp}/${e.max}${pv&&(pv.d||pv.ab)?` <em class="pvt">−${pv.d}</em>`:''}</span>${ext?`<div class="pl-ext">${ext}</div>`:''}</div></div>
  ${st.length?`<div class="sts">${st.map(([k,v,t])=>`<span title="${esc(t)}">${gi(k,KZ(),k==='atk2'?'#ffb070':undefined)}${v}</span>`).join('')}</div>`:''}<div class="spitze"></div></div>`;}
function gegnerHtml(f){return S.enemies.map((e,i)=>{if(e.hp<=0)return'';const b={...enemyBox(e)};if(e.pendel)b.x=Math.round(e.x*SW);const pv=vorschau&&vorschau.foes[i];const tg=f&&i===S.target;
  return `<div class="feind ${tg?'ziel':''} ${e.rang}" data-ei="${i}" style="left:${(b.x/SW*100).toFixed(2)}%;top:${(b.kopf/SH*100).toFixed(2)}%;--fh:${(b.y-b.kopf)/SH*100}">
   ${plaketteHtml(e,i,f,pv,tg)}<div class="treffer" style="height:calc(var(--u)*${b.y-b.kopf})"></div></div>`;}).join('')+(f?schutzLinien():'');}
// Fix 7: im Unverwundbar-Zug je eine dünne Linie von der Plakette des Bosses zu jedem Diener, an dem der Schutz hängt
function schutzLinien(){if(typeof unverwJetzt!=='function')return'';const l=[];for(const e of alive())if(unverwJetzt(e)){const a=enemyBox(e),ax=e.pendel?Math.round(e.x*SW):a.x;for(const d of dienerVon(e)){const b=enemyBox(d),bx=d.pendel?Math.round(d.x*SW):b.x;l.push(`<line x1="${ax}" y1="${a.y}" x2="${bx}" y2="${b.y}"/>`);}}
 return l.length?`<svg class="schutz" viewBox="0 0 ${SW} ${SH}" preserveAspectRatio="none">${l.join('')}</svg>`:'';}
const U=()=>BU.k;
// Pixelzeichen immer ganzzahlig: GROSS = 9 px × Skala, KLEIN = halb so groß (mindestens 9 px)
const GZ=()=>9*U(),KZ=()=>9*Math.max(1,Math.round(U()/2));

// ---------- Untere Leiste im Kampf (Footer als Tisch): eigener Balken und Stoff-Baum, Hand, Energie ----------
function leisteKampf(){const n=S.hand.length;
 return `<div id="links"><div id="spieler2">${spielerHtml()}</div><div id="baum">${stoffBaumHtml()}</div></div>${blickWahlHtml()}<div id="hand" class="${S.blickWahl?'verdeckt':''}" style="--ov:${S.hand.length>6?((S.hand.length-6)*59/(S.hand.length-1)).toFixed(2):0}">${S.hand.map((c,i)=>cardHtml(c,i,n)).join('')}</div>
 <div id="rechts"><div class="en-l">ENERGIE</div><div class="rauten">${[...Array(Math.max(BAL.energy_per_turn,S.energy))].map((_,i)=>`<i class="${i<S.energy?'voll':''}"></i>`).join('')}</div>
 <button id="endBtn" class="deco" data-act="end" ${busy||S.blickWahl?'disabled':''}>ZUG<br>BEENDEN</button>${stapelHtml()}${jobFaehigkeit()==='voraus'&&S.draw.length?`<div class="voraus">Als Nächstes: ${esc(S.draw[S.draw.length-1].n)}</div>`:''}</div>`;}
// M7: Wahl zu Kampfbeginn mit Blick-Item, liegt über der Hand, bis gewählt ist (Standard: Nicht hinsehen)
function blickWahlHtml(){if(!S.blickWahl)return'';const its=allActive().filter(it=>{const d=def(it);return d.eigen&&d.eigen.typ==='blick';});
 return `<div class="blickwahl"><div class="bw-items">${its.map(it=>`<img src="${itemBild(it.id)}" alt="${esc(def(it).n)}" title="${esc(def(it).n)}" draggable="false">`).join('')}</div><button class="deco" data-act="hinsehen">HINSEHEN</button><button class="deco haupt" data-act="wegsehen" autofocus>NICHT HINSEHEN</button></div>`;}
// Stapel und Ablage; Regelbiegungen ändern, was man davon sieht (M5): Spiegelbild (oberste Karte offen, Tausch), Keiner fährt ab (zurückgekommene Karte oben), Wellen von oben (keine Ablage)
let spiegelWahl=false;
function stapelHtml(){const B=typeof Bieg!=='undefined';const top=S.draw.length?S.draw[S.draw.length-1]:null;
 const ufer=B&&Bieg.ist('wellen_oben');let h=`<div class="stapel">Stapel ${S.draw.length}${ufer?'':` · Ablage ${S.discard.length}`}</div>`;
 if(B&&Bieg.ist('spiegelbild')&&top){const kann=Bieg.spiegelKann();h+=`<div class="voraus spiegel${spiegelWahl?' wahl':''}${kann?'':' aus'}" ${kann?'data-act="spiegel"':''} title="${esc(kann?'Erst hier klicken, dann die Handkarte, die du gegen sie tauschst (einmal je Zug)':'In diesem Zug schon getauscht')}">Oben: ${esc(top.n)}${spiegelWahl?' · Handkarte wählen':''}</div>`;}
 else if(B&&Bieg.ist('keiner_faehrt')&&top&&top.zurueck)h+=`<div class="voraus">Oben: ${esc(top.n)}</div>`;
 else if(jobFaehigkeit()==='voraus'&&top)h+=`<div class="voraus">Als Nächstes: ${esc(top.n)}</div>`;
 return h;}
// m: Reaktionsfaktor, den die Karte jetzt bekäme (Fix 6: Ziehen, Stärke und Gold zeigen den verstärkten Wert)
function cardText(c,m=1){const vs=v=>typeof verstaerkt==='function'?verstaerkt(v,m):v;if(c.unspielbar)return typeof werfbar==='function'&&werfbar(c)?`Über Bord werfen: ${passive('ballast_werfen').map(p=>fxKurz(p.fx)).join(', ')}.`:'Unspielbar.';const p=[];const kw=[];if(c.funke)kw.push('Funke');if(c.zoll)kw.push(`Zoll ${c.zoll}`);if(c.behalten)kw.push('Behalten');if(c.x)kw.push('X');if(c.kette)kw.push(`Kette ${c.kette}`);if(c.opfer)kw.push(`Opfer ${c.opfer}`);
 if(c.atk)p.push(`${c.atk}${c.x?'×X':c.h?'×'+c.h:''} Schaden${c.all?' an allen':''}`);if(c.blk)p.push(`${c.blk} Block`);if(c.heal)p.push(`+${c.heal} Leben`);if(c.poison)p.push(`Gift ${c.poison}`);if(c.burn)p.push(`Brand ${c.burn}`);if(c.weak)p.push('Geschwächt');if(c.vuln)p.push(`Verwundbar ${c.vuln}`);if(c.str)p.push(`Stärke ${vs(c.str)}`);if(c.strip)p.push('Block weg');if(c.draw)p.push(`Ziehe ${vs(c.draw)}`);if(c.en)p.push(`+${c.en} Energie`);if(c.self)p.push(`−${c.self} Leben`);if(c.gold)p.push(`+${c.gold} Gold`.replace(String(c.gold),String(vs(c.gold))));
 if(c.sonder&&c.sonder.t)p.push(c.sonder.t);
 let s=(kw.length?kw.join(', ')+'. ':'')+(p.join(', ')||(c.t&&!c.atk&&!c.blk?'':'–'));if(c.eroeffnung)s+=`. Eröffnung: ${Object.entries(c.eroeffnung).map(([k,v])=>k==='atk'?`+${v} Schaden`:k==='blk'?`+${v} Block`:k==='draw'?`ziehe ${v}`:k==='heal'?`+${v} Leben`:k==='en'?`+${v} Energie`:k==='burn'?`Brand ${v}`:k==='poison'?`Gift ${v}`:`${k} ${v}`).join(', ')}`;if(c.verbraucht)s+='. Verbraucht';return s;}
function cardHtml(c,i,n){const cost=cardCost(c);const rx=reactionsFor(S.last,c.st);const self=c.st.length>1?rx.filter(r=>r.k&&[...r.k].every(k=>c.st.includes(k))):[];const vor=rx.filter(r=>!self.includes(r));
 // M2: Reaktionen stehen immer mit Namen als Band unten an der Karte (kein Fragezeichen); die Karte leuchtet in der Farbe ihres reagierenden Stoffs
 let rxl='';const km=rx.length?rx.reduce((m,r)=>m*(r.pre&&r.pre.mult||1),1):1;
 const glow=vor.length?(ST[c.st.find(k=>vor.some(r=>!r.k||String(r.k).includes(k)))||c.st[0]]||{}).c:null;
 if(vor.length)rxl=`<div class="rx">${vor.map(r=>r.n.toUpperCase()).join(' + ')}</div>`;
 if(self.length)rxl+=`<div class="rx in">IN SICH: ${self.map(r=>r.n.toUpperCase()).join(' + ')}</div>`;
 const rot=((i*37)%5-2)*1.3+(i-(n-1)/2)*.6,dy=((i*53)%3)*1.2;
 return `<div class="karte ${cost>S.energy?'teuer':''} ${vor.length?'reagiert':''} ${c.st.length>1?'duo':''} ${c.unspielbar&&!(typeof werfbar==='function'&&werfbar(c))?'unspielbar':''} ${c.frost?'frost':''} ${c.teuer?'verteuert':''} ${c.hg?'handgriff':''}" data-card="${i}" style="${glow?`--c:${glow};`:''}--r:${rot.toFixed(1)}deg;--dy:${dy}px;${dealAnim?`animation-delay:${i*60}ms`:'animation:none'}">
  <div class="kost${c.mod||c.teuer?((c.mod||0)+(c.teuer||0)>0?' hoch':' tief'):''}"><span>${cost>=99?'–':cost}</span></div><div class="kst">${c.st.map(k=>gi(k,KZ())).join('')}</div>
  <div class="kn">${esc(c.n).toUpperCase()}</div><div class="bogen"><img src="${c.img||spr(c.spr)}" alt="">${c.hg?'<span class="hgm" title="Handgriff">✋</span>':''}${c.schliff?'<span class="schl" title="geschliffen">◇</span>':''}</div>
  <div class="kt${km!==1&&(c.draw||c.str||c.gold)?' verst':''}">${esc(cardText(c,km))}</div>${rxl}</div>`;}
// ---------- Ausrüstung unter der Szene ----------
function slotHtml(loc,locked){const it=locked?null:getAt(loc);const d=it?def(it):null;const ibi=it?itemBild(it.id):'';
 return `<div class="slot ${locked?'zu':''} ${S.sel===loc?'sel':''} ${d&&d.rare?'selten':''} ${it&&it.x?'gestrichen':''}" ${locked?'':`data-loc="${loc}"`}>${d?`<img src="${ibi}" alt="">${d.st.length?`<span class="ss">${d.st.map(k=>gi(k,KZ())).join('')}</span>`:''}${d.lvl?`<span class="lv">+${d.lvl}</span>`:''}<span class="kb">${[...Array(kerbenVon(it))].map((_,k)=>`<i class="${hgVon(it)[k]?'voll':''}"></i>`).join('')}</span>`:''}</div>`;}
// Auftrag 3 M4: die alte Itemleiste ist entfernt. Außerhalb des Kampfes liegt unten nur der Tisch mit dem Weg zum Rucksack „Am Körper“ (js/ui/rucksack.js).
function tischHtml(){const an=allActive();return `<div class="tischreihe"><div class="tangelegt">${an.map(it=>`<img src="${itemBild(it.id)}" alt="${esc(def(it).n)}" title="${esc(def(it).n)}" draggable="false">`).join('')}</div><button class="deco" data-act="rucksack">AM KÖRPER (R)</button><span class="hint">${S.bag.filter(Boolean).length} im Rucksack</span></div>`;}

