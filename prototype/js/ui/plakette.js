// Plaketten der Gegner ordnen (Auftrag 3, M2): keine zwei Plaketten überlappen, keine verlässt die Szene.
// Nach jedem Einsetzen von gegnerHtml (MutationObserver auf #gegner) werden --dx (seitlich, nur bis zum Szenenrand)
// und --dy (Höhe in Szenenpixeln, nach oben positiv) je Plakette gesetzt. Die Spitze bleibt am Kopf des Gegners (Leitlinie wächst mit --dy).
const PLK={rand:3,oben:22,abstand:2};
function plakettenOrdnen(){
 const g=document.getElementById('gegner');if(!g)return;const gr=g.getBoundingClientRect();if(!gr.width)return;
 const u=gr.width/SW;const el=[...g.querySelectorAll('.feind .plakette')];if(!el.length)return;
 el.forEach(p=>{p.style.setProperty('--dx','0');p.style.setProperty('--dy','0');});
 // natürliche Lage in Szenenpixeln: Fläche aus Kasten, Verlängerung und Statuszeile (ohne Spitze)
 const L=el.map(p=>{const fe=p.closest('.feind'),r=p.getBoundingClientRect();
  return{p,l:(r.left-gr.left)/u,r:(r.right-gr.left)/u,t:(r.top-gr.top)/u,b:(r.bottom-gr.top)/u,dx:0,dy:0,fuss:(fe.getBoundingClientRect().bottom-gr.top)/u};});
 // seitlich nur im Szenenrand halten
 for(const a of L){if(a.l<PLK.rand)a.dx=PLK.rand-a.l;else if(a.r>SW-PLK.rand)a.dx=SW-PLK.rand-a.r;a.l+=a.dx;a.r+=a.dx;}
 const lap=(a,b)=>a.l<b.r+PLK.abstand&&b.l<a.r+PLK.abstand&&a.t<b.b+PLK.abstand&&b.t<a.b+PLK.abstand;
 const hoch=(a,s)=>{a.t-=s;a.b-=s;a.dy+=s;};
 // vorn (größerer Fußpunkt) zuerst, die hinteren rücken nach oben
 const fest=[];
 for(const a of [...L].sort((x,y)=>y.fuss-x.fuss)){
  for(let n=0;n<60;n++){const c=fest.find(b=>lap(a,b));if(!c)break;hoch(a,a.b-(c.t-PLK.abstand));}
  // oben ist Schluss (Kopfleiste): dort bleiben und unter die darüberliegenden ausweichen
  if(a.t<PLK.oben){hoch(a,a.t-PLK.oben);for(let n=0;n<60;n++){const c=fest.find(b=>lap(a,b));if(!c)break;hoch(a,a.t-(c.b+PLK.abstand));}}
  fest.push(a);}
 for(const a of L){a.p.style.setProperty('--dx',a.dx.toFixed(2));a.p.style.setProperty('--dy',a.dy.toFixed(2));}
}
(function(){const g=document.getElementById('gegner');if(!g||typeof MutationObserver==='undefined')return;
 let l=false;new MutationObserver(()=>{if(l)return;l=true;try{plakettenOrdnen();}finally{l=false;}}).observe(g,{childList:true});
 addEventListener('resize',()=>requestAnimationFrame(plakettenOrdnen));if(document.fonts&&document.fonts.ready)document.fonts.ready.then(plakettenOrdnen);})();
