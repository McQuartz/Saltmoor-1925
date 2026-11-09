// Auftrag 3 M6: Hören statt sehen (docs/auftrag-3/06-lovecraft-kern.md Abschnitt 4).
// Stumme Gegner (foes → stumm: true, je Akt-IV-Biom einer und einer im Vorraum von Akt V) zeigen keine Absicht.
// Was sie vorhaben, hört man: hoerbareAbsicht(e) ist die eine Schnittstelle, aus der Musik, Einstellung „Klänge als Zeichen“ und Bots lesen.
// Schalter: balance.json → auftrag3.hoeren (aus = alle Gegner zeigen ihre Absicht wie bisher).
const Hoeren={
 an(){return a3('hoeren');},
 // Ist dieser Gegner gerade stumm? Nur normale Gegner in Akt IV und V; der Blick (M7) macht ihn sichtbar.
 istStumm(e){if(!e||!e.stumm||!this.an()||e.rang!=='normal')return false;const B=BIOMES[biomId()];if(!B||(B.akt||0)<3)return false;
  if(typeof Blick!=='undefined'&&Blick.siehtAbsicht&&Blick.siehtAbsicht(e))return false;return true;},
 // Höchstens ein stummer Gegner je Kampf: beim Aufstellen und beim Rufen
 begrenzen(list){let da=(S.enemies||[]).some(x=>x.hp>0&&x.stumm&&!list.includes(x));for(const e of list){if(!e.stumm)continue;if(da)e.stumm=false;else da=true;}},
 // Art einer Absicht für das Ohr: angriff (Puls), schutz (Glocke), zauber (Harmonium)
 art(it,e){if(!it)return null;if(it.t==='atk')return'angriff';if(it.t==='blk')return'schutz';
  if(it.t==='buff'||it.t==='laedt')return'zauber';return'zauber';},
 // Stärke eines Angriffs in drei Stufen (wie viele Schläge pro Takt): bis 6, bis 14, darüber
 stufe(v){return v<=6?1:v<=14?2:3;},
 // Grob geschätzter Schaden je Stufe (für Bots, die nur hören)
 SCHAETZ:{1:5,2:11,3:18}
};
// Was ein stummer Gegner in diesem Zug vorhat, so wie man es hört: {art, stufe, heilt, ruft} oder null (nicht stumm, tot, schon gehandelt)
function hoerbareAbsicht(e){if(!Hoeren.istStumm(e)||!e||e.hp<=0||e.gehandelt||S.nachGegnerzug)return null;const it=e.pat[e.pi%e.pat.length];if(!it)return null;
 const art=Hoeren.art(it,e);let stufe=1;if(art==='angriff'){let v=(it.v+e.str)*(it.h||1);if(e.weak2)v=Math.floor(v/2);stufe=Hoeren.stufe(v);}
 const heilt=!!(e.kniff&&e.kniff.art==='heiler');const ruft=typeof rufAnsage==='function'&&rufAnsage(e).length>0;
 return{art:heilt&&art!=='angriff'?'schutz':ruft&&art!=='angriff'?'zauber':art,stufe,uid:e.uid};}
function hoerbareAbsichten(){return(S.enemies||[]).filter(e=>e.hp>0).map(hoerbareAbsicht).filter(Boolean);}
// Erwarteter Schaden, so wie ein Spieler ihn kennt: sichtbare Absichten genau, stumme nur aus dem Gehörten geschätzt
// incoming(true) lässt nur Gegner ohne sichtbare Absicht weg (im Spielerzug: die stummen), sonst gleiche Rechnung wie vorher
function incomingGehoert(){return incoming(true)+hoerbareAbsichten().filter(h=>h.art==='angriff').reduce((s,h)=>s+Hoeren.SCHAETZ[h.stufe],0);}
