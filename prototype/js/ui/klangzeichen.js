// Auftrag 3 M6: „Klänge als Zeichen“ (Einstellung, Standard aus). Stumme Gegner zeigen keine Absicht; wer nicht hören kann, bekommt stattdessen
// neben der Plakette ein kleines Notenzeichen im Takt der Musik, in der Farbe der Absicht-Art. Kein Text, keine Erklärung.
Object.assign(GLY,{
 note:['....###..','....#..#.','....#..#.','....#....','....#....','..###....','.####....','.####....','..##.....']
});
STN.note='Klang';
// Takt in Sekunden: aus der laufenden Musik, sonst 84 BPM (Takt = 4 Viertel)
function klangTakt(){let bpm=84;try{if(typeof Music!=='undefined'&&Music.state){const m=Music.state();if(m&&m.chord&&m.chord!=='–'&&m.bpm>0)bpm=m.bpm;}}catch(e){}return 240/bpm;}
// HTML des Notenzeichens für einen Gegner oder '' (Einstellung aus oder nichts zu hören). Die Animation läuft rein in CSS.
function klangzeichenHtml(e){if(typeof Einst==='undefined'||!Einst.get('klangzeichen')||typeof hoerbareAbsicht!=='function')return'';
 const h=hoerbareAbsicht(e);if(!h)return'';const T=klangTakt();
 const farbe={angriff:FXC.atk,schutz:FXC.blk,zauber:FXC.buff}[h.art]||FXC.buff;
 const n=h.art==='angriff'?(h.stufe>=3?4:h.stufe===2?2:1):1;
 const dauer=(h.art==='angriff'?T/n:T).toFixed(3);
 return`<span class="klang ${h.art}" title="Klang" style="--kf:${farbe};--kt:${dauer}s">${gi('note',typeof KZ==='function'?KZ():18,farbe)}</span>`;}
