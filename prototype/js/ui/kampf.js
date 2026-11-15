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
 if(it.t==='karte'){const K=it.karte||{};const d=typeof Diener!=='undefined'?Diener.schaden(e,it):0;return{k:'atk',html:`<span class="diener" title="${esc(e.n)} spielt deine Karte „${esc(K.n)}“">${K.img?`<img class="dk" src="${K.img}" alt="${esc(K.n)}">`:''}${d?`${gi('atk',GZ())}${d}`:''}${K.blk?`${gi('blk',GZ())}${K.blk}`:''}</span>`};} // M9: deine Karte gegen dich
 if(it.t==='blk')return{k:'blk',html:`${gi('blk',GZ())}${it.v}`};
 // Ansage: lädt, dann großer Schlag; zeigt die Wucht und wie viele Züge noch
 if(it.t==='laedt'){let n=1,j=e.pi+1;while(n<9&&e.pat[j%e.pat.length].t==='laedt'){n++;j++;}const s=e.pat[j%e.pat.length];const v=(s.v||0)+e.str;return{k:'atk',html:`<span class="laedt">${gi('atk',GZ())}${v} <small>in ${n}</small></span>`};}
 return{k:'buff',html:`${gi('buff',GZ())}+${it.v}`};}
// Plakette (Auftrag 3, M2): Absicht oben, Leben als roter Balken, Block/Panzer als blaue Verlängerung, Status darunter, Kniff am Rand, Spitze zum Kopf.
// Die Höhenstaffelung (--dx, --dy) setzt plakettenOrdnen() in js/ui/plakette.js nach dem Einsetzen ins DOM.
function plaketteHtml(e,i,f,pv,tg){
 // Auftrag 4: Plakette 50 × 26 im 9-Slice (Randlicht in Zonenfarbe). Oben die Absicht, rechts die Zustände, darunter der Balken mit der Zahl.
 // Der Name steht darüber und erscheint bei Hover oder Ziel. Stumm: die Zeile der Absicht entfällt. Seltenes (danach, Panzer, Asche) in einer kleinen Zeile darunter.
 const sicht=f&&absichtSichtbar(e),a=sicht?absicht(e):null,abs=a?`<div class="abs">${a.html}</div>`:'';
 const danach=sicht&&typeof Bieg!=='undefined'&&Bieg.absichtenSichtbar(e)>1?`<div class="pl-x" title="Die Rückseite: was ${esc(e.n)} im Zug danach vorhat">danach <span class="abs abs2">${absicht0({...e,pi:e.pi+1}).html}</span></div>`:'';
 const d=pv?Math.min(e.hp,pv.d):0,ab=pv?Math.min(e.block,pv.ab):0,W=v=>Math.max(0,Math.min(100,v/e.max*100)).toFixed(1)+'%';
 const st=[e.burn&&['burn',e.burn,STN.burn],e.poison&&['poison',e.poison,STN.poison],e.weak2&&['weak',1,'Geschwächt: halber Schaden'],e.str&&['buff',e.str,STN.buff],e.vuln>0&&['atk2',e.vuln,`Verwundbar ${e.vuln} (+50 %)`]].filter(Boolean);
 const sts=st.length?`<div class="sts">${st.map(([k,v,t])=>`<span title="${esc(t)}">${gi(k,KZ(),k==='atk2'?'#ffb070':undefined)}<b>${v}</b></span>`).join('')}</div>`:'';
 const blk=e.block-ab,ext=(blk>0||ab>0?`<b class="pl-blk ${ab?'pvb':''}" title="Block">${blk>0?blk:ab}</b>`:'')+(e.panzer>0?`<b class="pl-pz" title="${esc((BAL.panzer&&BAL.panzer.t)||'')}">${gi('blk',KZ())}${e.panzer}</b>`:'');
 const bk=e.block>0?`<u class="bk${ab?' pvb':''}" style="width:${W(e.block)}"></u>`:'';
 return `<div class="plakette${e.verbuendet?' verb':''}"><div class="pl-box px9">${e.kniff||e.besonders?'<b class="knf" title="Kniff: Maus darüber">◆</b>':''}${e.ascheSpur||e.verbuendet?`<b class="pl-asche" title="${e.verbuendet?'Aus der Asche gerufen: kämpft für dich':'Dieselbe Asche-Spur: du hast ihn gerufen'}"></b>`:''}${f?klangzeichenHtml(e):''}
  <div class="pl-nm"><span>${esc(e.n).toUpperCase()}</span>${e.weak?gi(e.weak,KZ()):''}</div>${abs||sts?`<div class="pl-row">${abs}${sts}</div>`:''}
  <div class="pl-bar"><i class="hp" style="width:${W(e.hp-d)}"></i>${d?`<i class="pv" style="left:${W(e.hp-d)};width:${W(d)}"></i>`:''}${bk}<span>${e.hp}/${e.max}${pv&&(pv.d||pv.ab)?` <em class="pvt">−${pv.d}</em>`:''}</span>${ext?`<div class="pl-ext">${ext}</div>`:''}</div>
  ${e.verbuendet?'<div class="pl-verb">AUS DER ASCHE · FÜR DICH</div>':''}${danach}</div><div class="spitze"></div></div>`;}
function gegnerHtml(f){return S.enemies.map((e,i)=>{if(e.hp<=0)return'';const b={...enemyBox(e)};if(e.pendel)b.x=Math.round(e.x*SW);const pv=vorschau&&vorschau.foes[i];const tg=f&&i===S.target;
  return `<div class="feind ${tg?'ziel':''} ${e.rang}" data-ei="${i}" style="left:${(uiX(b.x)/4.8).toFixed(2)}%;top:${(uiY(b.kopf)/2.7).toFixed(2)}%;--fh:${(b.y-b.kopf)*6/7/2.7}">
   ${plaketteHtml(e,i,f,pv,tg)}<div class="treffer" style="height:calc(var(--u)*${((b.y-b.kopf)*6/7).toFixed(1)})"></div></div>`;}).join('')+(f?schutzLinien():'')+verbuendeterHtml(f);}
// M9: Plakette des Verbündeten aus der Asche (zeigt seinen nächsten Angriff; nicht anwählbar, Gegner greifen ihn nicht an)
function verbuendeterHtml(f){const v=S.verbuendeter;if(!v||typeof Asche==='undefined')return'';const b=enemyBox(v);const z=Asche.naechster(v);const e={...v,pi:z?v.pi+z.j:v.pi};
 return `<div class="feind verbuendet" style="left:${(uiX(b.x)/4.8).toFixed(2)}%;top:${(uiY(b.kopf)/2.7).toFixed(2)}%;--fh:${(b.y-b.kopf)*6/7/2.7}">${plaketteHtml(e,-1,f&&!!z,null,false)}</div>`;}
// Fix 7: im Unverwundbar-Zug je eine dünne Linie von der Plakette des Bosses zu jedem Diener, an dem der Schutz hängt
function schutzLinien(){if(typeof unverwJetzt!=='function')return'';const l=[];for(const e of alive())if(unverwJetzt(e)){const a=enemyBox(e),ax=e.pendel?Math.round(e.x*SW):a.x;for(const d of dienerVon(e)){const b=enemyBox(d),bx=d.pendel?Math.round(d.x*SW):b.x;l.push(`<line x1="${uiX(ax).toFixed(1)}" y1="${uiY(a.y).toFixed(1)}" x2="${uiX(bx).toFixed(1)}" y2="${uiY(b.y).toFixed(1)}"/>`);}}
 return l.length?`<svg class="schutz" viewBox="0 0 480 270" preserveAspectRatio="none">${l.join('')}</svg>`:'';}
const U=()=>BU.k;
// Pixelzeichen immer ganzzahlig: GROSS = 9 px × Skala, KLEIN = halb so groß (mindestens 9 px)
const GZ=()=>9*U(),KZ=()=>9*Math.max(1,Math.round(U()/2));

// ---------- Fußleiste im Kampf (Auftrag 4): Schultern links und rechts, Leben unter der Hand ----------
// Links außen der Ziehstapel, innen der Baum „Klar“; rechts innen Energie über ZUG BEENDEN, außen die Ablage. Lage in Oberflächenpixeln wie in Look-Runde 7.
function leisteKampf(){const n=S.hand.length,E=Math.max(BAL.energy_per_turn,S.energy);
 return `<div class="fussbild"></div>${stapelHtml()}<div id="baum">${stoffBaumHtml()}</div><div id="letzteRx">${letzteRxHtml()}</div>
 <div id="spieler2">${spielerHtml()}</div>${blickWahlHtml()}${begegnungHtml()}
 <div id="hand" class="${S.blickWahl||S.begegnung?'verdeckt':''}" style="--hb:${handLage(n).base}">${S.hand.map((c,i)=>cardHtml(c,i,n)).join('')}</div>
 <div class="ener${E>3?' viel':''}" title="Energie">${(typeof rautenKlassen==='function'?rautenKlassen(E):[...Array(E)].map((_,i)=>({c:i<S.energy?'':'aus',d:0}))).map(r=>`<i class="${r.c}"${r.d?` style="animation-delay:${r.d}ms"`:''}></i>`).join('')}</div>
 <button id="endBtn" class="knopf px9" data-act="end" ${busy||S.blickWahl||S.begegnung?'disabled':''}>ZUG BEENDEN</button>`;}
// Spieltest 2026-11-09: die letzte Reaktion steht unten links unter dem Stoff-Baum, bis die nächste kommt (statt oben als Meldung).
// LETZTE_RX setzt feedback.js beim Bus-Ereignis „reaction“, ein neuer Kampf leert sie.
let LETZTE_RX=null;
function letzteRxHtml(){const x=LETZTE_RX;if(!x)return'';const c=(ST[x.keys[0]]||{}).c||'#e8c547';
 return `<div class="lrx${x.hoch?' hoch':''}${x.neu?' neu':''}" style="--c:${c}" title="${esc(x.n+': '+x.t)}"><span class="lrx-k">${x.keys.map(k=>gi(k,KZ())).join('<i>+</i>')}<b>${esc(x.n.toUpperCase())}</b>${x.hoch?'<em>HOCHREAKTION</em>':''}${x.neu?'<em>NEU</em>':''}</span>${esc(x.t)}</div>`;}
// M9: Begegnung nach dem Seitenwechsel: die Wesen stehen da, man geht weiter (halbe Beute)
function begegnungHtml(){if(!S.begegnung)return'';const B=RUN.begegnungen;return `<div class="blickwahl begegnung px9"><p>${esc(B.begegnung.t)}</p><button class="knopf px9 haupt" data-act="weitergehen" autofocus>${esc(B.weiter.t)}</button></div>`;}
// M7: Wahl zu Kampfbeginn mit Blick-Item, liegt über der Hand, bis gewählt ist (Standard: Nicht hinsehen)
function blickWahlHtml(){if(!S.blickWahl)return'';const its=allActive().filter(it=>{const d=def(it);return d.eigen&&d.eigen.typ==='blick';});
 return `<div class="blickwahl px9"><div class="bw-items">${its.map(it=>`<img src="${itemBild(it.id)}" alt="${esc(def(it).n)}" title="${esc(def(it).n)}" draggable="false">`).join('')}</div><button class="knopf px9" data-act="hinsehen">HINSEHEN</button><button class="knopf px9 haupt" data-act="wegsehen" autofocus>NICHT HINSEHEN</button></div>`;}
// Stapel und Ablage; Regelbiegungen ändern, was man davon sieht (M5): Spiegelbild (oberste Karte offen, Tausch), Keiner fährt ab (zurückgekommene Karte oben), Wellen von oben (keine Ablage)
let spiegelWahl=false;
function stapelHtml(){const B=typeof Bieg!=='undefined';const top=S.draw.length?S.draw[S.draw.length-1]:null;
 const ufer=B&&Bieg.ist('wellen_oben');let h=`<div id="ziehen" class="pile px9" title="Ziehstapel">${S.draw.length}<span>ZIEHEN</span></div>${ufer?'':`<div id="ablage" class="pile px9" title="Ablage">${S.discard.length}<span>ABLAGE</span></div>`}`;
 if(B&&Bieg.ist('spiegelbild')&&top){const kann=Bieg.spiegelKann();h+=`<div class="voraus spiegel${spiegelWahl?' wahl':''}${kann?'':' aus'}" ${kann?'data-act="spiegel"':''} title="${esc(kann?'Erst hier klicken, dann die Handkarte, die du gegen sie tauschst (einmal je Zug)':'In diesem Zug schon getauscht')}">Oben: ${esc(top.n)}${spiegelWahl?' · Handkarte wählen':''}</div>`;}
 else if(B&&Bieg.ist('keiner_faehrt')&&top&&top.zurueck)h+=`<div class="voraus">Oben: ${esc(top.n)}</div>`;
 else if(jobFaehigkeit()==='voraus'&&top)h+=`<div class="voraus">Als Nächstes: ${esc(top.n)}</div>`;
 return h;}
// Spieltest 2026-11-09: Sonderwirkungen ohne eigenen Text (sonder.t) standen auf der Karte gar nicht, die Karte wirkte leer.
// Der Text kommt aus der Art der Wirkung, dieselben Werte wie sonderAtk/sonderWirkung in combat.js.
const SONDER_KLEIN=new Set(['zugende_hand','block_verdoppeln','gift_wandert','lebensraub','stoff_joker','wiederholen']); // Satzanfang klein, wenn davor schon etwas steht
function sonderText(s){if(!s)return'';const fk=fx=>typeof fxKurz==='function'?fxKurz(fx):'';
 switch(s.art){
  case'fx':return fk(s.fx);
  case'zugende_hand':return `Liegt sie am Zugende auf der Hand: ${fk(s.fx)}`;
  case'brand_verdoppeln':return s.alle?'Brand aller Gegner verdoppeln':'Brand des Ziels verdoppeln';
  case'gift_verdoppeln':return 'Gift des Ziels verdoppeln';
  case'block_verdoppeln':return 'Deinen Block verdoppeln';
  case'gift_wandert':return 'Stirbt das Ziel, wandert sein Gift weiter';
  case'schaden_gleich_block':return (s.anteil||1)===1?'Schaden in Höhe deines Blocks':`Schaden: ${Math.round((s.anteil||1)*100)} % deines Blocks`;
  case'schaden_je_fehlleben':return `+1 Schaden je ${s.je||5} fehlende Leben`;
  case'lebensraub':return `Heilt dich um ${Math.round((s.anteil||.5)*100)} % des Schadens`;
  case'stoff_joker':return 'Die nächste Karte reagiert auch mit der Karte davor';
  case'wiederholen':return 'Wiederholt die vorige Karte';
  case'x_plus':return `X +${s.v||1}`;
  default:return'';}}
// m: Reaktionsfaktor, den die Karte jetzt bekäme (Fix 6: Ziehen, Stärke und Gold zeigen den verstärkten Wert)
function cardText(c,m=1){const vs=v=>typeof verstaerkt==='function'?verstaerkt(v,m):v;if(c.unspielbar)return typeof werfbar==='function'&&werfbar(c)?`Über Bord werfen: ${passive('ballast_werfen').map(p=>fxKurz(p.fx)).join(', ')}.`:'Unspielbar.';const p=[];const kw=[];if(c.funke)kw.push('Funke');if(c.zoll)kw.push(`Zoll ${c.zoll}`);if(c.behalten)kw.push('Behalten');if(c.x)kw.push('X');if(c.kette)kw.push(`Kette ${c.kette}`);if(c.opfer)kw.push(`Opfer ${c.opfer}`);
 if(c.atk)p.push(`${c.atk}${c.x?'×X':c.h?'×'+c.h:''} Schaden${c.all?' an allen':''}`);if(c.blk)p.push(`${c.blk} Block`);if(c.heal)p.push(`+${c.heal} Leben`);if(c.poison)p.push(`Gift ${c.poison}`);if(c.burn)p.push(`Brand ${c.burn}`);if(c.weak)p.push('Geschwächt');if(c.vuln)p.push(`Verwundbar ${c.vuln}`);if(c.str)p.push(`Stärke ${vs(c.str)}`);if(c.strip)p.push('Block weg');if(c.draw)p.push(`Ziehe ${vs(c.draw)}`);if(c.en)p.push(`+${c.en} Energie`);if(c.self)p.push(`−${c.self} Leben`);if(c.gold)p.push(`+${c.gold} Gold`.replace(String(c.gold),String(vs(c.gold))));
 if(c.sonder){let st=c.sonder.t||sonderText(c.sonder);if(st&&p.length&&!c.sonder.t&&SONDER_KLEIN.has(c.sonder.art))st=st[0].toLowerCase()+st.slice(1);if(st)p.push(st);}
 let s=(kw.length?kw.join(', ')+'. ':'')+(p.join(', ')||(c.t&&!c.atk&&!c.blk?'':'–'));if(c.eroeffnung)s+=`. Eröffnung: ${Object.entries(c.eroeffnung).map(([k,v])=>k==='atk'?`+${v} Schaden`:k==='blk'?`+${v} Block`:k==='draw'?`ziehe ${v}`:k==='heal'?`+${v} Leben`:k==='en'?`+${v} Energie`:k==='burn'?`Brand ${v}`:k==='poison'?`Gift ${v}`:`${k} ${v}`).join(', ')}`;if(c.verbraucht)s=s.replace(/\.$/,'')+'. Verbraucht';return s;}
// Auftrag 4: eine Karte für alle Stellen (Hand, Vorschau am Zeiger, Rucksack). Schlagwörter Behalten, Verbraucht und Funke stehen als Marke unten,
// Zahlen im Text in Jersey 10. Der Wortlaut bleibt der von cardText, nur die Schlagwörter wandern aus dem Satz in die Marke.
const KARTE_MARKEN=['Behalten','Verbraucht','Funke'];
function karteTextTeile(t){t=String(t||'');const tags=[];for(const k of KARTE_MARKEN){const re=new RegExp('(^|[.,]\\s*)'+k+'(?![a-zäöüß])\\.?\\s*');if(re.test(t)){tags.push(k);t=t.replace(re,'$1').replace(/^[.,\s]+|[.,\s]+$/g,'');}}
 return{t,tags};}
function karteHtml(c,o={}){const T=karteTextTeile(o.text!=null?o.text:cardText(c,o.m||1));let t=esc(T.t).replace(/(\d+(?:×\d+)?)/g,'<b>$1</b>');if(t&&!/[.!?]$/.test(T.t))t+='.';
 const ko=o.kost==null?'':String(o.kost);const img=o.img!=null?o.img:(c.img||(c.spr&&typeof spr==='function'?spr(c.spr):''));
 return `<div class="karte ${o.cls||''}" ${o.attr||''} ${o.style?`style="${o.style}"`:''}><div class="kin px9"><div class="kn">${esc(c.n).toUpperCase()}</div><div class="bild px9">${img?`<img src="${img}" alt="" draggable="false">`:''}${o.rx?`<div class="rxb">${o.rx}</div>`:''}</div>
  <div class="kt${o.verst?' verst':''}">${t}</div><div class="tags">${T.tags.map(x=>`<span>${x.toUpperCase()}</span>`).join('')}</div>
  <span class="ko${o.koCls?' '+o.koCls:''}${ko===''?' leer':''}">${esc(ko)}</span><span class="sf">${(c.st||[]).map(k=>gi(k,KZ())).join('')}${c.farbe&&typeof FarbeUI!=='undefined'?FarbeUI.zeichen():''}</span>${o.mk||''}</div></div>`;}
// Hand im Fächer: 236 breit in der Mitte, Abstand bis 45, höchstens 2° je Karte, leichter Bogen (Look-Runde 7, hand())
function handLage(n){const h=(n-1)/2;const rot=h?Math.min(2,6/h):0;const th=rot*h*Math.PI/180;const step=h?Math.min(45,(236/2-25*Math.cos(th)-91*Math.sin(th))/h):0;const arc=h?6/(h*h):0;const slop=Math.ceil(25*Math.sin(th)+21*(1-Math.cos(th)));
 return{h,rot,step,arc,base:20+6+slop};}
function cardHtml(c,i,n){const cost=cardCost(c);const rx=reactionsFor(S.last,c.st);const self=c.st.length>1?rx.filter(r=>r.k&&[...r.k].every(k=>c.st.includes(k))):[];const vor=rx.filter(r=>!self.includes(r));
 // M2: Reaktionen stehen immer mit Namen als Band an der Karte (kein Fragezeichen); Auftrag 4: das Band liegt über der Unterkante des Bildfensters
 let rxl='';const km=rx.length?rx.reduce((m,r)=>m*(r.pre&&r.pre.mult||1),1):1;
 const glow=vor.length?(ST[c.st.find(k=>vor.some(r=>!r.k||String(r.k).includes(k)))||c.st[0]]||{}).c:null;
 if(vor.length)rxl=`<div class="rx">${vor.map(r=>r.n.toUpperCase()).join(' + ')}</div>`;
 if(self.length)rxl+=`<div class="rx in">IN SICH: ${self.map(r=>r.n.toUpperCase()).join(' + ')}</div>`;
 const L=handLage(n||S.hand.length),m=i-L.h;
 const cls=`${cost>S.energy?'teuer':''} ${vor.length?'reagiert':''} ${c.st.length>1?'duo':''} ${c.unspielbar&&!(typeof werfbar==='function'&&werfbar(c))?'unspielbar':''} ${c.frost?'frost':''} ${c.teuer?'verteuert':''} ${c.hg?'handgriff':''} ${c.farbe?'farbe':''} ${c.erbe?'erbe':''} ${c.fremd?'fremd':''} ${dealAnim||c.frisch?'neu':''} ${c.frisch&&!dealAnim?'nachgezogen':''}`;
 const koCls=c.mod||c.teuer?((c.mod||0)+(c.teuer||0)>0?'hoch':'tief'):'';
 return karteHtml(c,{cls,attr:`data-card="${i}"`,m:km,verst:km!==1&&(c.draw||c.str||c.gold),kost:cost>=99?'–':cost,koCls,rx:rxl,
  mk:(c.schliff?'<span class="mk schl" title="geschliffen">◇</span>':''),
  style:`${glow?`--c:${glow};`:''}--fx:${(m*L.step).toFixed(2)};--fy:${(m*m*L.arc).toFixed(2)};--fr:${(m*L.rot).toFixed(2)}deg;z-index:${10+i};${(dealAnim||c.frisch)&&typeof austeilenStil==='function'?austeilenStil(dealAnim?i:0,n||S.hand.length,L,m,i):''}`});}
// ---------- Ausrüstung unter der Szene ----------
function slotHtml(loc,locked){const it=locked?null:getAt(loc);const d=it?def(it):null;const ibi=it?itemBild(it.id):'';
 return `<div class="slot ${locked?'zu':''} ${S.sel===loc?'sel':''} ${d&&d.rare?'selten':''} ${it&&it.x?'gestrichen':''}" ${locked?'':`data-loc="${loc}"`}>${d?`<img src="${ibi}" alt="" data-fuid="${it.uid}">${d.st.length?`<span class="ss">${d.st.map(k=>gi(k,KZ())).join('')}</span>`:''}${d.lvl?`<span class="lv">+${d.lvl}</span>`:''}<span class="kb">${[...Array(kerbenVon(it))].map((_,k)=>`<i class="${hgVon(it)[k]?'voll':''}"></i>`).join('')}</span>`:''}</div>`;}

