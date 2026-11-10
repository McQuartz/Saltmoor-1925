// Setzt alle Bildschirme zusammen (Formensprache Variante A: schwarz, Messinglinien, Cinzel / IM Fell English / Limelight, Pixelzeichen der Stoffe).
// Liest nur den Zustand, ändert ihn nie. Eingaben laufen über data-Attribute (js/ui/eingabe.js).
// Auftrag 3 M2: geteilt in oberflaeche.js (Zusammensetzen, Kopf, eigener Balken), kampf.js, bildschirme.js, ueberlagerungen.js.
const $=id=>document.getElementById(id);
let dealAnim=false,vorschau=null;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const allRx=()=>[VERST,...REACT,...HOCH];

function render(){
 const ph=S.phase||'titel';document.body.dataset.phase=ph;
 $('kopf').innerHTML=S.route&&!['titel','figur','strand','ende','ankunft','uebergang','biomwahl'].includes(ph)?kopfHtml():'';
 $('gegner').innerHTML=ph==='fight'||ph==='reward'?gegnerHtml(ph==='fight'):'';
 if($('spieler'))$('spieler').innerHTML=''; // M2: der eigene Balken sitzt im Footer (leisteKampf)
 $('panel').innerHTML=panelHtml(ph);$('panel').className=ph==='fight'?'':'an p-'+ph;
 $('leiste').innerHTML=ph==='fight'?leisteKampf():'';
 $('leiste').className=ph==='fight'?'kampf':'';
 dealAnim=false;karteNach();kartenEinpassen();if(typeof koeNachRender==='function')koeNachRender();if(typeof Dev!=='undefined'&&Dev.an)Dev.render();}

// Spieltest 2026-11-09: Kartentitel passen in die Karte (lange Wörter werden kleiner statt über den Rand zu laufen),
// und die Hand rückt zusammen, sobald sie breiter als ihr Platz wäre. So bleibt der Knopf ZUG BEENDEN immer an seiner Stelle.
function kartenEinpassen(){
 for(const el of document.querySelectorAll('.karte .kn')){el.style.fontSize='';let fs=parseFloat(getComputedStyle(el).fontSize),min=fs*.55;
  while((el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)&&fs>min){fs-=.5;el.style.fontSize=fs+'px';}}
 const h=$('hand');if(!h)return;const ks=[...h.querySelectorAll(':scope>.karte')],n=ks.length;h.style.setProperty('--ov',0);if(n<2)return;
 const gap=parseFloat(getComputedStyle(h).columnGap)||0,cw=ks[0].offsetWidth,platz=h.clientWidth,braucht=n*cw+(n-1)*gap;
 if(braucht>platz)h.style.setProperty('--ov',((braucht-platz)/(n-1)/BU.k).toFixed(2));}

// ---------- Kopfzeile ----------
function kopfHtml(){const f=S.phase==='fight';const m=maxHp();const inc=f?incoming():0;const lose=Math.max(0,inc-S.block);
 const total=allRx().length;
 // Auftrag 3 M2 (Variante 2): links Tiefe/Zug und Biom kursiv, rechts Gold, Buch und Deck in gleicher Größe
 return `<div class="tz">TIEFE ${romanN(Math.max(1,S.depth))}${f?` · ZUG ${S.turnNo}`:''}<span class="sub">${esc(biom().n)}</span>${biegKopfHtml()}</div>
 <div class="kr"><span class="gold">${gi('gold',KZ())} <b>${S.gold}</b> Gold</span>${S.netz&&S.netz.akt===S.akt&&S.phase!=='weg'?'<a data-act="karte" title="Karte (M)">Karte</a>':''}${!f&&canEquip()?'<a data-act="rucksack" class="amk" title="Rucksack: Am Körper (R)">Am Körper</a>':''}<a data-act="buch">Buch <b>${S.disc.size}/${total}</b></a><span>Deck <b>${deckListe().length}</b></span></div>
 ${f?'':`<div class="du">DU · ${esc(S.jobN).toUpperCase()}</div>${barHtml(S.hp,m,0,null,'gross')}<div class="zahlen">${S.hp}/${m}</div>`}`;}
// Auftrag 3 M5: Zeichen und Name der Regelbiegung rechts neben dem Biom-Namen, Tooltip mit dem Regeltext.
// Pforte: die Biegung dieses Zuges, klein die des nächsten. Ebbe und Flut: ob dieser Zug Ebbe oder Flut ist.
function biegKopfHtml(){if(typeof Bieg==='undefined')return'';const k=Bieg.kopf();if(!k)return'';const b=k.b,j=k.jetzt||b;
 const tip=`<div class="tn">${esc(b.n)}</div><div>${esc(b.t)}</div>`+(j!==b?`<div class="tn" style="margin-top:6px">Dieser Zug: ${esc(j.n)}</div><div>${esc(j.t)}</div>`:'')+(k.naechste?`<div class="tn" style="margin-top:6px">Nächster Zug: ${esc(k.naechste.n)}</div><div>${esc(k.naechste.t)}</div>`:'')+(k.zusatzT?`<div style="margin-top:6px">${esc(k.zusatzT)}</div>`:'');
 return `<span class="kbieg kopfbieg" data-bieg="${b.id}" data-tip="${esc(tip)}">${gi(j.zeichen,KZ())}<b>${esc(j.n)}</b>${k.zusatz?`<em class="bz">${esc(k.zusatz)}</em>`:''}${k.naechste?`<em class="bz">danach ${esc(k.naechste.n)}</em>`:''}</span>`;}
// Spieler-Lebensbalken unten mittig über der Hand: Block als Schild links, angekündigter Schaden als roter Schatten im Balken
// Fix 5 (Auftrag 3): keine Zeile „−x Leben“ mehr. Der drohende Verlust steht im Balken: Block (blau) bricht zuerst, der rote Rest ist schraffiert.
// Die Worte stehen nur noch im Tooltip des Balkens.
// M2 (Variante 2): Name links, Leben groß rechts darüber; Rot = Leben, Blau = Block als Verlängerung nach rechts mit dem Wert im Schild am Ende.
function spielerHtml(){const m=maxHp(),inc=incomingSichtbar(),lose=Math.min(S.hp,Math.max(0,inc-S.block)),bricht=Math.min(S.block,inc);const W=v=>Math.max(0,Math.min(100,v/m*100)).toFixed(3)+'%';
 const BW=v=>Math.min(32,v/m*100).toFixed(3);
 const tip=alive().some(e=>absichtSichtbar(e)&&e.kniff&&e.kniff.art==='verborgen'&&e.pat[e.pi%e.pat.length].t==='atk')?`${inc} und mehr kommen, wie viel, siehst du nicht`:inc?`${inc} kommen → ${lose?'−'+lose+' Leben':'alles geblockt'}`:'nichts kommt';
 return `<div class="skopf"><span class="snm">${esc(S.jobN).toUpperCase()}</span><span class="shp"><b>${S.hp}</b>/${m}</span></div>
 <div class="szeile" title="${esc(tip)}"><div class="sbar"><i class="hp" style="width:${W(S.hp-lose)}"></i>${lose?`<i class="schraffur" style="width:${W(lose)}"></i>`:''}</div>${S.block?`<div class="sblock" style="--bw:${BW(S.block)}"><i class="bk" style="flex:${S.block-bricht}"></i>${bricht?`<i class="bricht" style="flex:${bricht}"></i>`:''}</div><div class="schild an" title="Block">${gi('blk',KZ())}<b>${S.block}</b></div>`:''}</div>`;}
// Lebensbalken mit Block-Schraffur direkt hinter dem Leben; pv = Vorschau {d, ab}
function barHtml(hp,max,block,pv,cls=''){const W=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(1)+'%';const d=pv?Math.min(hp,pv.d):0,ab=pv?Math.min(block,pv.ab):0;
 return `<div class="bar ${cls}"><i class="hp" style="width:${W(hp-d)}"></i>${d?`<i class="pv" style="width:${W(d)}"></i>`:''}${block-ab>0?`<i class="bk" style="width:${W(block-ab)}"></i>`:''}${ab?`<i class="pvb" style="width:${W(ab)}"></i>`:''}</div>`;}
