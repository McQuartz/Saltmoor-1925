// Auftrag 4, Phase 4: kleine Bewegungen der Szenen-Bildschirme (css/szenen.css).
// Rast: das Feuer wird heller, je näher der Zeiger ihm kommt (--nah 0 bis 1). Beute: das Gold fliegt zum Zähler in der Kopfleiste.
addEventListener('pointermove',e=>{if(S.phase!=='rast')return;const b=document.querySelector('#panel .box.szene.rast');if(!b)return;const r=b.getBoundingClientRect();
 const d=Math.hypot((e.clientX-(r.left+r.width/2))/r.width,(e.clientY-(r.top+r.height*.58))/r.height);b.style.setProperty('--nah',Math.max(0,1-d*2.2).toFixed(2));});
let goldFlugPhase=null;
function goldFliegt(n){if(typeof FAST!=='undefined'&&FAST||!n)return;const sp=document.getElementById('spiel'),ziel=document.querySelector('#kopf .gold');if(!sp||!ziel)return;
 const R=sp.getBoundingClientRect(),s=R.width/480,z=ziel.getBoundingClientRect();const zx=(z.left-R.left)/s+4,zy=(z.top-R.top)/s+2;const src=typeof glyph==='function'?glyph('gold'):'';
 for(let i=0;i<Math.min(8,2+Math.ceil(n/6));i++){const m=document.createElement('img');m.className='goldflug';m.src=src;m.alt='';const x0=240+(i%4-1.5)*10,y0=150+(i>>2)*8;
  m.style.left=`calc(var(--u)*${x0})`;m.style.top=`calc(var(--u)*${y0})`;sp.appendChild(m);
  const a=m.animate([{transform:'translate(0,0)',opacity:0},{transform:`translate(0,calc(var(--u)*-14))`,opacity:1,offset:.25},{transform:`translate(calc(var(--u)*${zx-x0}),calc(var(--u)*${zy-y0})) scale(.7)`,opacity:1}],{duration:700,delay:300+i*70,easing:'cubic-bezier(.5,0,.6,1)',fill:'backwards'});
  a.onfinish=()=>m.remove();setTimeout(()=>m.remove(),2000);}}
if(typeof Bus!=='undefined')Bus.on('changed',()=>{const ph=S.phase;if(ph==='reward'&&goldFlugPhase!=='reward'&&S.goldGain)setTimeout(()=>goldFliegt(S.goldGain),50);goldFlugPhase=ph;});
