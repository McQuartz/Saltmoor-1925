// Auftrag 3 M9: Begegnungen und Run-Zettel (docs/auftrag-3/07-begegnungen-meta-wuerze.md Abschnitte 1, 2 und 5).
// Run-Zettel (S.zettel): beim Start würfelt der Seed, welche zwei Begegnungen in diesem Run möglich sind (und in M11 die Würze).
// Begegnungen: diener (Die Diener erheben sich), asche, spuren, tiefe (Die Tiefe erkennt dich). Schalter: auftrag3.begegnungen.
// Fremde Fassung (Abschnitt 5): it.fremd = {s0: true, h1: true …}, kartenVon macht daraus Karten mit Wirkung ×1,5 und fremd: true.
const BEGEGNUNGEN=['diener','asche','spuren','tiefe'];
const Zettel={
 an(){return a3('begegnungen');},
 wuerfeln(){const r=R('zettel');S.zettel={begegnungen:r.shuffle([...BEGEGNUNGEN]).slice(0,2),wuerze:[]};
  if(typeof Wuerze!=='undefined'&&Wuerze.wuerfeln)S.zettel.wuerze=Wuerze.wuerfeln(r);},
 // Steht die Begegnung auf dem Zettel (und ist das System an)?
 hat(k){return this.an()&&!!(S.zettel&&S.zettel.begegnungen.includes(k));}
};
// Schlüssel einer Karte im Run: feste Item-Karte s<ci>, Handgriff h<k>; Stör- und Ballastkarten zählen nicht
function kartenSchluessel(c){if(!c||c.uid==null||c.unspielbar||!c.cid)return null;const t=String(c.cid).split(':');if(t[1]==null)return null;
 return{uid:c.uid,key:t[1].startsWith('h')?t[1]:'s'+t[1]};}
// Fremde Fassung: alle Zahlen ×1,5 außer Kosten, Energie, Treffer-Anzahl und X
const FREMD_FELDER=['atk','blk','poison','burn','heal','draw','vuln','weak','str','gold','ward','self'];
function fremdeFassung(c){const o={...c,fremd:true};for(const k of FREMD_FELDER)if(typeof o[k]==='number'&&o[k]>0)o[k]=Math.round(o[k]*1.5);return o;}
const Diener={
 MIN:8,
 // nach jeder gespielten Karte: mitzählen
 gespielt(c){const k=kartenSchluessel(c);if(!k||DRY)return;const id=k.uid+':'+k.key;const z=S.kartenZahl=S.kartenZahl||{};z[id]=(z[id]||0)+1;},
 // die meistgespielte Karte mit mindestens 8 Einsätzen, deren Item noch angelegt ist
 kandidat(){const z=S.kartenZahl||{};let best=null;for(const id in z){if(z[id]<this.MIN)continue;const [uid,key]=id.split(':');const c=deckListe().find(x=>{const k=kartenSchluessel(x);return k&&String(k.uid)===uid&&k.key===key;});
  if(c&&(!best||z[id]>best.n))best={uid:+uid,key,n:z[id],c};}return best;},
 // Wächterkampf: deine Karte kommt als zusätzlicher Schritt direkt nach dem aktuellen in sein Muster (höchstens einmal je Run)
 kampfStart(art){S.diener=null;if(art!=='waechter'||!Zettel.hat('diener')||S.dienerGenutzt)return;const k=this.kandidat();if(!k)return;const w=alive().find(e=>e.rang==='waechter');if(!w)return;
  const c=k.c;const schritt={t:'karte',karte:{n:c.n,st:[...c.st],img:c.img||'',atk:c.atk||0,h:c.h||1,blk:c.blk||0,poison:c.poison||0,burn:c.burn||0},v:c.atk||0,h:c.h||1};
  w.pat.splice(w.pi%w.pat.length+1,0,schritt);S.dienerGenutzt=true;S.diener={uid:k.uid,key:k.key,n:c.n,waechter:w.uid};
  Bus.emit('diener',{art:'erhebt',e:w,karte:c.n,why:`${c.n} (${k.n}-mal gespielt) erhebt sich: ${w.n} spielt sie gegen dich`});},
 // Schaden des Schritts gegen dich: Angriff mit Stärke, dazu Gift und Brand als Schaden (du hast selbst keinen Gift- oder Brandzustand)
 schaden(en,it){const K=it.karte||{};return K.atk?(K.atk+en.str)*(K.h||1)+K.poison+K.burn:K.poison+K.burn;},
 // Wächter geschlagen: die Karte kommt geschliffen zurück (−1 Kosten), kostet sie schon 0 oder ist geschliffen, als fremde Fassung
 sieg(){const d=S.diener;if(!d||S.kampfArt!=='waechter')return null;S.diener=null;const it=itemByUid(d.uid);if(!it)return null;
  const c=kartenVon(it).find(x=>{const k=kartenSchluessel(x);return k&&k.key===d.key;});if(!c)return null;
  let wie;if(c.c>0&&!(it.schliff&&it.schliff[d.key])){it.schliff=it.schliff||{};it.schliff[d.key]=true;wie='geschliffen';}else{it.fremd=it.fremd||{};it.fremd[d.key]=true;wie='fremd';}
  Bus.emit('diener',{art:'zurueck',karte:d.n,wie,why:`${d.n} kommt ${wie==='geschliffen'?'geschliffen zurück (kostet 1 weniger)':'in der fremden Fassung zurück (Wirkung ×1,5)'}`});return wie;}
};
// Spuren (Dunwich): ein Kampfknoten je Akt I–IV trägt auf der Peilkarte Spuren. Jeder Knoten, zu dem man woanders hingeht, lässt sie wachsen (Stufe 0–3, nur im Bild).
// Früh: leichter Kampf, kleine Beute. Spät: schwerer Kampf, dafür eine Reliquie. Der Gegner ist eine Elite des Bioms (sonst der zäheste normale Gegner), wächst je Stufe (balance.json → spuren).
const Spuren={
 W(){return BAL.spuren||{hp:[.6,.85,1.1,1.35],atk:[-2,0,2,4],gross:[.9,1,1.1,1.22],beute:['kampf','kampf','schwer','reliquie']};},
 // beim Bauen des Netzes (netzBauen): ein normaler Kampfknoten zwischen der zweiten und der vorletzten Ebene
 markieren(N,r){if(!Zettel.hat('spuren')||N.akt>3)return;const kand=[];N.ebenen.forEach((l,e)=>{if(e>=1&&e<N.ebenen.length-1)l.forEach(v=>{if(v.art==='kampf')kand.push(v);});});
  if(!kand.length)return;const v=r.pick(kand);v.spuren=0;N.folgen.push('spuren');},
 knoten(N){N=N||S.netz;if(!N)return null;for(const l of N.ebenen)for(const v of l)if(v.spuren!=null)return v;return null;},
 // nach jeder Wahl auf der Karte: woanders hingegangen → Spuren wachsen
 gehe(o){const N=S.netz;const v=this.knoten(N);if(!v||v.besucht)return;const hier=N.ebenen[o.ziel[0]][o.ziel[1]];if(hier===v){v.besucht=true;return;}
  if(v.spuren<3){v.spuren++;Bus.emit('spuren',{stufe:v.spuren,why:`Die Spuren werden größer (Stufe ${v.spuren+1} von 4)`});}},
 // Betreten: ein Gegner, der mit den Spuren gewachsen ist
 istHier(o){const v=this.knoten();return !!(v&&o&&o.ziel&&S.netz.ebenen[o.ziel[0]][o.ziel[1]]===v);},
 starten(o){const v=this.knoten();const st=v.spuren||0;const b=biom();const W=this.W();
  const el=(b.elite||[]).filter(id=>FOES[id]);const pool=b.gegner.filter(id=>FOES[id]&&(FOES[id].rang||'normal')==='normal');
  const id=el.length?R(`spuren:${S.akt}`).pick(el):pool.reduce((a,c)=>FOES[c].hp>FOES[a].hp?c:a,pool[0]);
  const art=W.beute[st]==='kampf'?'kampf':'schwer';S.spurenKampf={stufe:st,beute:W.beute[st]};startFight([id],art);
  const e=S.enemies[0];e.hp=e.max=Math.max(6,Math.round(e.max*W.hp[st]));e.pat=e.pat.map(p=>p.t==='atk'?{...p,v:Math.max(1,p.v+W.atk[st])}:p);e.spuren=st;
  Bus.emit('spuren',{stufe:st,kampf:true,why:`Spuren, Stufe ${st+1} von 4: ${e.n} mit ${e.max} Leben${W.beute[st]==='reliquie'?', dafür eine Reliquie':''}`});Bus.emit('changed');}
};
