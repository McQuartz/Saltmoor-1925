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
// Fix 5 (Auftrag 3): keine Zeile „−x Leben“ mehr. Der drohende Verlust steht im Balken: Block (blau) bricht zuerst, der rote Rest ist schraffiert.
// Die Worte stehen nur noch im Tooltip des Balkens.
function spielerHtml(){const m=maxHp(),inc=incomingSichtbar(),lose=Math.min(S.hp,Math.max(0,inc-S.block)),bricht=Math.min(S.block,inc);const W=v=>Math.max(0,Math.min(100,v/m*100)).toFixed(3)+'%';
 const tip=alive().some(e=>absichtSichtbar(e)&&e.kniff&&e.kniff.art==='verborgen'&&e.pat[e.pi%e.pat.length].t==='atk')?`${inc} und mehr kommen, wie viel, siehst du nicht`:inc?`${inc} kommen → ${lose?'−'+lose+' Leben':'alles geblockt'}`:'nichts kommt';
 return `<div class="schild ${S.block?'an':''}" title="Block">${gi('blk',GZ())}<b>${S.block}</b></div>
 <div class="sbar" title="${esc(tip)}"><i class="hp" style="width:${W(S.hp-lose)}"></i>${lose?`<i class="schraffur" style="width:${W(lose)}"></i>`:''}<span>${esc(S.jobN).toUpperCase()} · ${S.hp}/${m}</span>${S.block?`<div class="sblock">${bricht?`<i class="bricht" style="width:${W(bricht)}"></i>`:''}<i class="bk" style="width:${W(S.block-bricht)}"></i></div>`:''}</div>`;}
// Lebensbalken mit Block-Schraffur direkt hinter dem Leben; pv = Vorschau {d, ab}
function barHtml(hp,max,block,pv,cls=''){const W=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(1)+'%';const d=pv?Math.min(hp,pv.d):0,ab=pv?Math.min(block,pv.ab):0;
 return `<div class="bar ${cls}"><i class="hp" style="width:${W(hp-d)}"></i>${d?`<i class="pv" style="width:${W(d)}"></i>`:''}${block-ab>0?`<i class="bk" style="width:${W(block-ab)}"></i>`:''}${ab?`<i class="pvb" style="width:${W(ab)}"></i>`:''}</div>`;}
