// ===================== WACHSWALZE: MUND-SOUNDS IM SPIEL AUFNEHMEN (2026-11-14) =====================
// Menü → WACHSWALZE (auch aus den Einstellungen) öffnet das Aufnahme-Studio (studio.html?eingebettet=1) über dem Spiel,
// mit allem, was das Studio kann: Welle, Spur schieben, mehrere Aufnahmen pro Sound, Pegel, Ordner/ZIP, Musik-Loops.
// Dazu oben drei Profile (Mund.profilKey). Gespeichert wird in derselben Ablage (IndexedDB „saltmoor-mund“).
// Solange die Wachswalze offen ist, ist die Spielmusik stumm; beim Schließen lädt das Spiel die Aufnahmen und das Profil neu.
const MundAufnahme=(()=>{
 let el=null,musikVorher=null;
 function auf(){if(el)return;if(typeof closeOv==='function')closeOv();
  if(typeof Music!=='undefined'&&Music.volume&&musikVorher==null){musikVorher=typeof Einst!=='undefined'?Einst.get('musik'):.5;Music.volume(0);}
  el=document.createElement('div');el.id='wachswalze';
  el.innerHTML=`<iframe src="studio.html?eingebettet=1" allow="microphone; autoplay" title="Wachswalze"></iframe>`;
  document.body.appendChild(el);const f=el.querySelector('iframe');f.addEventListener('load',()=>{try{f.contentWindow.focus();}catch(e){}});}
 async function zu(){if(!el)return;el.remove();el=null;
  if(musikVorher!=null&&typeof Music!=='undefined'&&Music.volume)Music.volume(musikVorher);musikVorher=null;
  if(typeof Mund!=='undefined'&&Mund.neuLaden)await Mund.neuLaden();}
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-mauf="auf"]');if(b)auf();});
 // Esc im Spiel schließt die Wachswalze (im Studio selbst fängt studio.js Esc ab und ruft zu())
 document.addEventListener('keydown',e=>{if(el&&e.key==='Escape'){e.stopImmediatePropagation();zu();}},true);
 return {auf,zu,get offen(){return !!el;}};
})();
window.MundAufnahme=MundAufnahme; // für den Zurück-Knopf im eingebetteten Studio (parent.MundAufnahme)
