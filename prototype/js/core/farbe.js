// Auftrag 3 M8: Die Farbe (docs/auftrag-3/06-lovecraft-kern.md Abschnitt 6). Der neunte Stoff X, dynamisch statt zerstörend.
// Zustand in S.farbe = {uid, letzte, gebunden, ab}: auf welchem Item sie sitzt, wo sie zuletzt war, ob sie mit Salz gebunden ist.
// Spuren am Item selbst: it.st (getauschte Stoffe, def(it) liest sie) und it.spuren = [{i, alt, neu}] (zum Tilgen in der Werkstatt).
// Kommt höchstens einmal je Run über das Ereignis „farbe_brunnen“ in Akt II oder III (S.farbePlan per Seed, etwa jeder zweite Run).
// Schalter: balance.json → auftrag3.farbe.
const Farbe={
 an(){return a3('farbe');},
 // Plan zu Run-Beginn: ob und in welchem Akt (1 = Akt II, 2 = Akt III) der Brunnen kommt
 planen(){const r=R('farbe-plan');S.farbePlan=r.chance(.85)?(r.chance(.6)?1:2):null;S.farbeGesehen=false;S.farbe=null;},
 // Ersetzt das nächste Ereignis ab dem geplanten Akt durch den Brunnen (einmal je Run, spätestens in Akt III)
 ereignisHier(){return this.an()&&!S.farbeGesehen&&S.farbePlan!=null&&S.farbePlan<=S.akt&&S.akt<=2&&EVENTS.some(e=>e.id==='farbe_brunnen');},
 // Annehmen (Ereignis-fx „farbe_annehmen“): setzt sich auf ein angelegtes Item, per Seed
 annehmen(why){const l=allActive().filter(it=>!it.x);if(!l.length||S.farbe)return false;const it=R(`farbe-an:${S.depth}`).pick(l);
  S.farbe={uid:it.uid,letzte:null,gebunden:false,ab:S.depth};
  Bus.emit('farbe',{art:'an',uid:it.uid,why:`${why||'Die Farbe'}: sie setzt sich auf ${def(it).n}`});return true;},
 sitztAuf(it){return !!(it&&S.farbe&&S.farbe.uid===it.uid);},
 item(){return S.farbe?itemByUid(S.farbe.uid):null;},
 // Karte gehört zum Farbe-Item (auch Handgriff-Karten des Items)
 karte(c){return !!(c&&S.farbe&&c.uid===S.farbe.uid&&!c.unspielbar);},
 // Stoffe, die eine Karte des Farbe-Items jetzt hätte: die der Karte davor in diesem Zug, die erste Karte behält ihre eigenen
 stoffeJetzt(c){const eig=c.st0||c.st;if(!this.karte(c))return eig;const z=S.zugSt||[];const vor=S.played>0&&z.length?z[z.length-1]:null;return vor&&vor.length?[...vor]:eig;},
 // Hand nachführen: jede Karte des Farbe-Items trägt die Stoffe, die sie jetzt annehmen würde (Hand, Baum, Vorschau und Bot sehen dasselbe)
 hand(){if(!S.farbe||!S.hand)return;for(const c of S.hand){if(c.uid!==S.farbe.uid)continue;if(!c.st0)c.st0=[...c.st];c.st=this.stoffeJetzt(c);c.farbe=true;}},
 // Binden: direkt nach einer Karte des Farbe-Items eine Karte mit Salz (eigener Stoff Salz, auch ein angenommenes Salz zählt nicht)
 nachKarte(c,vorher){if(!S.farbe||S.farbe.gebunden)return;if(this.karte(vorher)&&!this.karte(c)&&(c.st0||c.st).includes('S')){S.farbe.gebunden=true;
  Bus.emit('farbe',{art:'gebunden',uid:S.farbe.uid,why:`Salz nach der Farbe: sie bleibt auf ${def(this.item()).n} und wandert nicht mehr`});}},
 // Nach jedem gewonnenen Kampf: springt auf ein anderes angelegtes Item (nie zurück auf das letzte) und hinterlässt eine Spur
 wandern(){const F=S.farbe;if(!F||F.gebunden)return null;const hier=this.item();const l=allActive().filter(it=>!it.x&&it.uid!==F.uid);
  if(!l.length)return null;const ohneLetzte=l.filter(it=>it.uid!==F.letzte);const r=R(`farbe-wandert:${S.depth}:${S.stats.kaempfe}`);const ziel=r.pick(ohneLetzte.length?ohneLetzte:l);
  const spur=hier?this.spur(hier,r):null;F.letzte=F.uid;F.uid=ziel.uid;
  Bus.emit('farbe',{art:'wandert',uid:ziel.uid,von:hier&&hier.uid,spur,why:`Die Farbe wandert${hier?` von ${def(hier).n}`:''} auf ${def(ziel).n}${spur?`, ${def(hier).n} trägt jetzt ${ST[spur.neu].n} statt ${ST[spur.alt].n}`:''}`});return ziel;},
 // Spur: ein Stoff des Items gegen einen anderen (nie X, nie doppelt). Items ohne Stoff behalten nichts zurück.
 spur(it,r){const st=[...(it.st||ITEMS[it.id].st||[])];if(!st.length)return null;const i=r.int(0,st.length-1);const frei=Object.keys(ST).filter(k=>k!=='X'&&!st.includes(k));if(!frei.length)return null;
  const neu=r.pick(frei);const s={i,alt:st[i],neu};st[i]=neu;it.st=st;(it.spuren=it.spuren||[]).push(s);return s;},
 // Werkstatt „Spur tilgen“: dreht den letzten Tausch an diesem Item zurück
 tilgen(uid){const it=itemByUid(uid);if(!it||!it.spuren||!it.spuren.length)return false;const s=it.spuren.pop();const st=[...it.st];st[s.i]=s.alt;
  if(!it.spuren.length&&st.join()===ITEMS[it.id].st.join()){delete it.st;delete it.spuren;}else it.st=st;
  Bus.emit('farbe',{art:'getilgt',uid,why:`Spur getilgt: ${def(it).n} trägt wieder ${ST[s.alt].n} statt ${ST[s.neu].n}`});return true;},
 mitSpur(){return besitz().map(b=>b.it).filter(it=>it.spuren&&it.spuren.length);}
};
