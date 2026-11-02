// ===================== AUDIO =====================
let AC=null,NB=null;
function au(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}catch(e){}}
function nz(f,dur,v,q=3){if(!AC)return;const s=AC.createBufferSource();s.buffer=NB;const fl=AC.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain(),n=AC.currentTime;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+dur);s.connect(fl).connect(g).connect(AC.destination);s.start(n,Math.random()*.5);s.stop(n+dur+.02);}
function tn(f,dur,type='triangle',v=.2,sl=0,delay=0){if(!AC)return;const o=AC.createOscillator();o.type=type;const g=AC.createGain(),n=AC.currentTime+delay;o.frequency.setValueAtTime(f,n);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*sl),n+dur);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+dur);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+dur+.02);}
const sfx={
 hit:k=>{nz(900+k*80,.12,.5,1.5);tn(160+k*30,.12,'square',.12,.5);},
 card:()=>{nz(5000,.06,.15,1);},
 block:()=>{nz(400,.25,.4,2);tn(220,.2,'triangle',.2,.7);},
 hurt:()=>{tn(120,.3,'sawtooth',.25,.4);nz(250,.25,.5,1);},
 heal:()=>{[0,4,7].forEach((k,i)=>tn(523*Math.pow(2,k/12),.2,'sine',.15,0,i*.06));},
 die:()=>{tn(300,.5,'square',.15,.2);nz(200,.4,.3,1);},
 react:k=>{[0,7,12].forEach((x,i)=>tn(330*Math.pow(2,(x+k*2)/12),.25,'triangle',.14,0,i*.05));nz(3000,.3,.1,.8);},
 disc:()=>{[0,3,7,10,14,19].forEach((k,i)=>tn(220*Math.pow(2,k/12),.6,'sine',.12,0,i*.08));nz(3000,.8,.05,.5);},
 hoch:()=>{[0,4,7,11,14,19,24].forEach((k,i)=>tn(196*Math.pow(2,k/12),.8,'sawtooth',.06,0,i*.07));nz(800,1,.3,.6);},
 click:()=>tn(900,.04,'square',.05),
 pick:()=>{tn(600,.05,'square',.06);tn(900,.06,'square',.05,0,.04);},
 bad:()=>tn(140,.25,'square',.12,.8),
 forge:()=>{nz(2500,.15,.4,2);tn(150,.4,'square',.15,.5);[0,5,9,12].forEach((k,i)=>tn(440*Math.pow(2,k/12),.3,'triangle',.12,0,.2+i*.08));},
 win:()=>{[0,4,7,12].forEach((k,i)=>tn(392*Math.pow(2,k/12),.3,'triangle',.18,0,i*.1));}
};


