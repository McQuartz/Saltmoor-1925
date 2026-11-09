// Spielzustand und kleine Helfer. Kein DOM, keine Grafik.
// S ist der ganze Run (serialisierbar, siehe run.js → speichern). Sichtdaten der Gegner liegen NICHT in S, sondern in der Bühne.
let uidc=0;const mk=id=>({uid:++uidc,id});
let S={phase:'titel'};let busy=false;
// FAST: Autospieler und Schadens-Vorschau, alles läuft ohne Wartezeiten synchron durch.
let FAST=false,DRY=false;
function wait(ms,f){if(FAST)f();else setTimeout(f,ms);}
// M8: Spuren der Farbe (it.st) überlagern die Stoffe des Items; sonst die Daten selbst
const _defSpur=new WeakMap();
const def=it=>{const D=ITEMS[it.id];if(!it.st||!D)return D;let c=_defSpur.get(it);if(!c||c.st.join()!==it.st.join()){c={...D,st:[...it.st]};_defSpur.set(it,c);}return c;};
function act(a){return S.areas[a].slice(0,S.slots[a]).filter(Boolean);}
function allActive(){return AREAS.flatMap(act);}
function bases(it){const d=def(it);return d.bases||[it.id];}
function maxHp(){return BAL.start_hp+S.bonusHp+allActive().reduce((s,it)=>s+(def(it).hp||0),0);}
function roleState(){return ROLES.map(r=>{const have=r.i.filter(id=>allActive().some(it=>bases(it).includes(id)));return{r,have,on:have.length===r.i.length};});}
// aktive Rollen-Boni eines Typs (siehe data/roles.json)
function bonuses(type){return roleState().filter(x=>x.on&&x.r.bonus&&x.r.bonus.type===type).map(x=>x.r.bonus);}
// Eigenschaften angelegter Items (items.json → passiv aus Auftrag 1 und eigen aus Auftrag 2), z. B. passive('brand_haelt')
function passive(typ){const o=[];for(const it of allActive()){const D=def(it);for(const p of [D.passiv,D.eigen])if(p&&p.typ===typ)o.push(p);}return o;}
// Seltenheit und Kerben (04-deckbau.md Abschnitt 3): gewöhnlich 1 Kerbe, selten und Reliquie 2, Werkstatt höchstens 3
function rarOf(D){return D.rar||(D.rare?'selten':'gewoehnlich');}
function kerbenVon(it){const D=def(it);const b=D.kerben!=null?D.kerben:(rarOf(D)==='gewoehnlich'?1:2);return Math.min(3,b+(it.kerbenPlus||0));}
function hgVon(it){if(!it.hg)it.hg=[...(def(it).fest_hg||[])];return it.hg;}
// Karte eines Handgriffs in einem Item: nimmt die Stoffe des Items an
function hgKarte(id,it,k){const H=HANDGRIFFE[id];if(!H)return null;const D=def(it);const geschliffen=it.schliff&&it.schliff['h'+k];
 return{...H,c:Math.max(0,(H.c||0)-(geschliffen?1:0)),st:[...D.st],src:D.n,spr:H.spr||D.spr,img:(typeof hgBild==='function'&&hgBild(id))||(typeof itemBild==='function'?itemBild(it.id):''),uid:it.uid,hg:id,hgk:k,fest:(D.fest_hg||[]).includes(id),schliff:!!geschliffen};}
// Alle Karten eines Items (Stammkarten × Kopien, dann Handgriffe), gleiche Rechnung für Deck, Vorschau und Rucksackmodus
function kartenVon(it){if(it.x)return hgVon(it).map((id,k)=>hgKarte(id,it,k)).filter(Boolean);const D=def(it);const o=[];
 for(let k=0;k<(BAL.card_copies||1);k++)D.cards.forEach((c,ci)=>{const g=it.schliff&&it.schliff['s'+ci];const kc={...c,c:Math.max(0,c.c-(g?1:0)),st:[...D.st],src:D.n,spr:D.spr,img:typeof itemBild==='function'?itemBild(it.id):'',uid:it.uid,ci,schliff:!!g,cid:it.uid+':'+ci+':'+k};o.push(it.fremd&&it.fremd['s'+ci]&&typeof fremdeFassung==='function'?fremdeFassung(kc):kc);});
 hgVon(it).forEach((id,k)=>{const c=hgKarte(id,it,k);if(c){c.cid=it.uid+':h'+k;o.push(it.fremd&&it.fremd['h'+k]&&typeof fremdeFassung==='function'?fremdeFassung(c):c);}});return o;} // M9: fremde Fassung je Karte (it.fremd)
function deckListe(items){const l=(items||allActive()).flatMap(kartenVon);if(!items&&S.lose&&S.lose.length&&typeof Tiefe!=='undefined')S.lose.forEach(id=>{const c=Tiefe.karte(id);if(c)l.push(c);});return l;} // M9: lose Karten (Das Zeichen)
function alive(){return S.enemies.filter(e=>e.hp>0);}
function log(s){S.log.unshift(s);S.log=S.log.slice(0,14);}
function biomId(){if(!S.route)return'hafen';return S.route[S.akt]||(S.angebote&&S.angebote[S.akt]&&S.angebote[S.akt][0])||S.route[S.akt-1]||'hafen';}
function biom(){return BIOMES[biomId()]||BIOMES.hafen;}
function itemOk(id){return !!ITEMS[id];}
// Fundpool des aktuellen Bioms plus runübergreifend freigeschaltete Items
function dropPool(){const b=biom();const extra=(S.metaItems||[]).filter(itemOk);let pool=[...(b.fundpool||[]),...extra].filter(id=>itemOk(id)&&!ITEMS[id].nodrop&&!ITEMS[id].bases&&!ITEMS[id].rare);
 if(!pool.length)pool=Object.keys(ITEMS).filter(k=>!ITEMS[k].nodrop&&!ITEMS[k].bases&&!ITEMS[k].rare&&!ITEMS[k].meta);return[...new Set(pool)];}
function rarePool(){return Object.keys(ITEMS).filter(k=>ITEMS[k].rare&&!ITEMS[k].bases&&!ITEMS[k].nodrop&&(!ITEMS[k].meta||(S.metaItems||[]).includes(k))&&blickAb(k)<=(S.akt||0));}
// M7: Blick-Items (eigen.typ blick) gibt es erst ab dem Akt, in dessen Fundpools sie stehen (Linse Akt II, Resonator Akt III, Lampe Akt IV), auch beim Krämer
function blickAb(k){const D=ITEMS[k];if(!D||!D.eigen||D.eigen.typ!=='blick')return 0;let a=99;for(const b in BIOMES)if((BIOMES[b].fundpool||[]).includes(k))a=Math.min(a,BIOMES[b].akt??99);return a===99?0:a;}
const romanN=n=>{const r=[['X',10],['IX',9],['V',5],['IV',4],['I',1]];let s='';for(const[k,v]of r)while(n>=v){s+=k;n-=v;}return s;};
// Auftrag 3: ist ein neues System eingeschaltet? (balance.json → auftrag3, im Dev-Reiter TIEFE umschaltbar)
function a3(k){return !!(BAL&&BAL.auftrag3&&BAL.auftrag3[k]);}
function jobFaehigkeit(){const j=JOBS.find(x=>x.id===S.job);return j&&j.faehigkeit||null;}
