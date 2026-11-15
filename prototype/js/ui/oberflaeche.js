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
 if(typeof zonenLicht==='function')zonenLicht(biomId());
 $('leiste').innerHTML=ph==='fight'?leisteKampf():'';
 $('leiste').className=ph==='fight'?'kampf':'';
 dealAnim=false;karteNach();kartenEinpassen();if(typeof koeNachRender==='function')koeNachRender();if(typeof Dev!=='undefined'&&Dev.an)Dev.render();}

// Auftrag 4: Karten passen sich in Stufen an (Look-Runde 7, passen()). Name 5 / 4,5 / 4, Text 5,4 / 5 / 4,6 / 4,6 / 4,2 mit Mindesthöhe des Bildfensters.
// Läuft auf allen Karten im DOM (Hand, Vorschau am Zeiger, Rucksack). Eine Karte, die selbst in der kleinsten Stufe überläuft, bekommt .warn.
const KARTE_STUFEN=[[5.4,16],[5,16],[4.6,16],[4.6,11],[4.2,10]];
function kartenEinpassen(root){for(const k of (root||document).querySelectorAll('.karte')){const px=k.offsetWidth/50;if(!px)continue;const n=k.querySelector('.kn'),t=k.querySelector('.kt'),b=k.querySelector('.bild'),kin=k.querySelector('.kin');if(!n||!t||!b||!kin)continue;
 for(const ns of [5,4.5,4]){n.style.setProperty('--ns',ns);if(n.scrollHeight<=n.clientHeight+1&&n.scrollWidth<=n.clientWidth+1)break;}
 k.classList.remove('warn');let stufe=0;
 for(const [fs,mb] of KARTE_STUFEN){t.style.setProperty('--fs',fs);if(b.offsetHeight>=mb*px-.5&&kin.scrollHeight<=kin.clientHeight+1)break;stufe++;}
 k.dataset.stufe=Math.min(stufe,4);k.dataset.bild=Math.round(b.offsetHeight/px);if(b.offsetHeight<9*px||kin.scrollHeight>kin.clientHeight+1)k.classList.add('warn');}}

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
// Auftrag 4: Leben unter der Hand. Schild mit Block-Zahl, Balken 224 × 8, Block als blaue Kerben am Ende, dahinter Zahl und Zustände (Schutz, Stärke).
// Aus Auftrag 3 bleibt: bei drohendem Verlust bricht zuerst das Blau (hell gestreift), der rote Rest ist schraffiert. Neu: ein heller Rest läuft beim Schaden verzögert nach.
const LEBEN_NACH={hp:null,von:0,t:0};
function spielerHtml(){const m=maxHp(),inc=incomingSichtbar(),lose=Math.min(S.hp,Math.max(0,inc-S.block)),bricht=Math.min(S.block,inc);const W=v=>Math.max(0,Math.min(100,v/m*100)).toFixed(3)+'%';
 const tip=alive().some(e=>absichtSichtbar(e)&&e.kniff&&e.kniff.art==='verborgen'&&e.pat[e.pi%e.pat.length].t==='atk')?`${inc} und mehr kommen, wie viel, siehst du nicht`:inc?`${inc} kommen → ${lose?'−'+lose+' Leben':'alles geblockt'}`:'nichts kommt';
 const N=LEBEN_NACH,jetzt=performance.now();if(N.hp!=null&&S.hp<N.hp){N.von=N.hp;N.t=jetzt;}N.hp=S.hp;const alt=jetzt-N.t<800&&N.von>S.hp;
 const st=[S.ward>0&&['blk',S.ward,'Schutz: kommt im nächsten Zug als Block','#7dffc4'],S.pstr>0&&['buff',S.pstr,'Stärke']].filter(Boolean);
 return `<div class="schild${S.block?' an':''}" title="Block">${S.block||''}</div>
 <div class="sbar${S.block?' block':''}" title="${esc(tip)}">${alt?`<b class="nach" style="width:${W(N.von)};--bis:${W(S.hp)};animation-delay:${(250-(jetzt-N.t)).toFixed(0)}ms"></b>`:''}<i class="hp" style="width:${W(S.hp-lose)}"></i>${lose?`<i class="schraffur" style="left:${W(S.hp-lose)};width:${W(lose)}"></i>`:''}${S.block?`<u class="bk" style="width:${W(S.block-bricht)};right:${W(bricht)}"></u>`:''}${bricht?`<u class="bricht" style="width:${W(bricht)}"></u>`:''}</div>
 <div class="shp"><b>${S.hp}<small>/${m}</small></b>${st.length?`<span class="sts">${st.map(([k,v,t,c])=>`<span title="${esc(t)}">${gi(k,KZ(),c)}<b>${v}</b></span>`).join('')}</span>`:''}</div>`;}
// Lebensbalken mit Block-Schraffur direkt hinter dem Leben; pv = Vorschau {d, ab}
function barHtml(hp,max,block,pv,cls=''){const W=v=>Math.max(0,Math.min(100,v/max*100)).toFixed(1)+'%';const d=pv?Math.min(hp,pv.d):0,ab=pv?Math.min(block,pv.ab):0;
 return `<div class="bar ${cls}"><i class="hp" style="width:${W(hp-d)}"></i>${d?`<i class="pv" style="width:${W(d)}"></i>`:''}${block-ab>0?`<i class="bk" style="width:${W(block-ab)}"></i>`:''}${ab?`<i class="pvb" style="width:${W(ab)}"></i>`:''}</div>`;}
