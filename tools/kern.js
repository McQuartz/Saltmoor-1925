// Lädt den Spielkern (ohne DOM) in Node. Für Tests und den schnellen Autospieler auf der Kommandozeile.
const fs=require('fs'),path=require('path'),vm=require('vm');
const P=path.join(__dirname,'..','prototype');
function ladeKern(extra=[]){
 const ctx={console,structuredClone,Math,JSON,Date,Set,Map,Object,Array,String,Number,setTimeout,clearTimeout,performance:{now:()=>Date.now()},localStorage:mkStore()};
 vm.createContext(ctx);
 const files=['js/data.js','js/core/rng.js','js/core/bus.js','js/core/state.js','js/core/rules.js','js/core/biegung.js','js/core/combat.js','js/core/run.js','js/core/netz.js','js/core/meta.js','js/dev/bot.js',...extra];
 let code='';for(const f of files){const p=path.join(P,f);if(fs.existsSync(p))code+=fs.readFileSync(p,'utf8')+'\n';}
 // let/const im Skript-Kontext sind nicht über ctx sichtbar: Zugriffsfunktion anhängen
 code+='\nthis.__get=n=>eval(n);this.__set=(n,v)=>eval(n+"=v");';
 vm.runInContext(code,ctx,{filename:'kern.js'});
 const json=f=>JSON.parse(fs.readFileSync(path.join(P,'data',f+'.json'),'utf8'));
 return{ctx,init:async()=>{await ctx.__get('loadData')('data/',async f=>json(f));},get:ctx.__get,run:c=>vm.runInContext(c,ctx)};}
function mkStore(){const m={};return{getItem:k=>k in m?m[k]:null,setItem:(k,v)=>{m[k]=String(v);},removeItem:k=>{delete m[k];},clear:()=>{for(const k in m)delete m[k];},_m:m};}
module.exports={ladeKern};
