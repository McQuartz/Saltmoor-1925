// Jumpscare: einmal zufällig in den ersten 5 Minuten eines Runs, dann einmal in den 15 Minuten danach (data/balance.json → jumpscare).
function jumpscare(){if(S.phase==='start'||document.hidden)return;const c=$('scareC'),x=c.getContext('2d');x.imageSmoothingEnabled=false;
 x.fillStyle='#000';x.fillRect(0,0,80,60);
 el(x,40,36,25,30,'#8a9c9e');dither(x,14,4,52,60,'#5a6a70',(i,j)=>Math.abs(i-40)/26*.9);el(x,40,30,20,20,'#a8b8b8');dither(x,20,12,40,36,'#8a9c9e',(i,j)=>Math.abs(i-40)/22);
 for(let k=0;k<14;k++){const sx=14+k*4;x.fillStyle=k%2?'#1f3a22':'#2f5a32';for(let j=0;j<12+(k*7)%22;j++)x.fillRect(Math.round(sx+Math.sin(j*.4+k)*1.5),2+j,2,1);}
 el(x,29,30,8,7,'#030303');el(x,51,30,8,7,'#030303');el(x,29,31,2.5,2.5,'#ff2a1a');el(x,51,31,2.5,2.5,'#ff2a1a');px(x,28,30,'#fff');px(x,50,30,'#fff');
 ln(x,27,37,25,52,1,'#101010');ln(x,53,37,56,50,1,'#101010');ln(x,31,37,32,46,1,'#202020');
 el(x,40,50,10,9,'#030303');x.fillStyle='#d8d0b0';for(let i=32;i<48;i+=2){x.fillRect(i,42,1,3);x.fillRect(i+1,56,1,2);}
 ln(x,44,12,48,22,1,'#4a5a60');ln(x,48,22,46,26,1,'#4a5a60');
 au();if(AC){nz(1800,.9,1.2,.4);nz(300,1.1,1,.5);tn(70,1.1,'sawtooth',.5,.5);tn(1250,.7,'square',.18,1.6);tn(1330,.7,'square',.15,1.5);}
 const sc=$('scare');sc.classList.add('on');FX.shake(14);setTimeout(()=>{sc.classList.remove('on');FX.flash('#000',1);},650);}
setInterval(()=>{if(!S.scares||!S.scares.length||S.phase==='start'||document.hidden)return;if(performance.now()>S.scares[0]){S.scares.shift();jumpscare();}},1000);
