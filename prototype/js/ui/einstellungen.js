// Einstellungen (localStorage 'saltmoor.einst.v1'): Lautstärken, Stummfilm, Jumpscare, Bildschirmwackeln, Textgeschwindigkeit.
const Einst=(()=>{const KEY='saltmoor.einst.v1';const STD={musik:.55,effekte:.8,stummfilm:true,jumpscare:true,wackeln:true,text:1};let E=null;
 function load(){if(E)return E;try{E={...STD,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch(e){E={...STD};}return E;}
 return{get:k=>load()[k],set(k,v){load()[k]=v;try{localStorage.setItem(KEY,JSON.stringify(E));}catch(e){}if(typeof Bus!=='undefined')Bus.emit('einst',{k,v});},all:()=>({...load()}),STD};})();
