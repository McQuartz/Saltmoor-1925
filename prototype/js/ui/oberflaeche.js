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
 $('leiste').innerHTML=ph==='fight'?leisteKampf():S.route&&canEquip()?tischHtml():'';
 $('leiste').className=ph==='fight'?'kampf':S.route&&canEquip()?'tisch':'';
 dealAnim=false;karteNach();if(typeof koeNachRender==='function')koeNachRender();if(typeof Dev!=='undefined'&&Dev.an)Dev.render();}

// ---------- Kopfzeile ----------
function kopfHtml(){const f=S.phase==='fight';const m=maxHp();const inc=f?incoming():0;const lose=Math.max(0,inc-S.block);
 const total=allRx().length;
 // Auftrag 3 M2 (Variante 2): links Tiefe/Zug und Biom kursiv, rechts Gold, Buch und Deck in gleicher Größe
 return `<div class="tz">TIEFE ${romanN(Math.max(1,S.depth))}${f?` · ZUG ${S.turnNo}`:''}<span class="sub">${esc(biom().n)}</span></div>
 <div class="kr"><span class="gold">${gi('gold',KZ())} <b>${S.gold}</b> Gold</span>${S.netz&&S.netz.akt===S.akt&&S.phase!=='weg'?'<a data-act="karte" title="Karte (M)">Karte</a>':''}<a data-act="buch">Buch <b>${S.disc.size}/${total}</b></a><span>Deck <b>${deckListe().length}</b></span></div>
 ${f?'':`<div class="du">DU · ${esc(S.jobN).toUpperCase()}</div>${barHtml(S.hp,m,0,null,'gross')}<div class="zahlen">${S.hp}/${m}</div>`}`;}
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
