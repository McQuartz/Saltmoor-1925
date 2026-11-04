// Zufall mit Seed. Alle Inhaltsentscheidungen (Wege, Begegnungen, Belohnungen, Krämer, Ereignisse, Aufstellung, Kartenmischen)
// laufen hierüber. Gleicher Seed + gleiche Entscheidungen = gleicher Run. Math.random() nur für Kosmetik (Partikel, Funkeln).
// Der Zustand eines Zufallsstroms ist eine einzige Zahl, damit er mit dem Run gespeichert werden kann.
function hashStr(s){s=String(s);let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
// splitmix32: nimmt den Zustand, gibt [Zahl 0..1, neuer Zustand]
function smix(a){a=(a+0x9e3779b9)|0;let t=a^(a>>>16);t=Math.imul(t,0x21f0aaad);t^=t>>>15;t=Math.imul(t,0x735a2d97);t^=t>>>15;return[(t>>>0)/4294967296,a>>>0];}
// Ein Strom mit Namen hängt am Run-Seed: Rng.of(seed,'weg:2:1')
class Rng{
 constructor(state){this.s=state>>>0;}
 static of(seed,name){return new Rng(hashStr(seed+'|'+name));}
 next(){const[v,s]=smix(this.s);this.s=s;return v;}
 int(a,b){return a+Math.floor(this.next()*(b-a+1));}
 chance(p){return this.next()<p;}
 pick(list){return list[Math.floor(this.next()*list.length)];}
 shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(this.next()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 sample(list,n){const l=[...list],o=[];while(o.length<n&&l.length)o.push(l.splice(Math.floor(this.next()*l.length),1)[0]);return o;}
 fork(name){return new Rng(hashStr(this.s+'|'+name));}
}
// Laufende Ströme im Spielzustand (S.rs = {name: zustand}). So überleben sie Speichern und Laden.
function rs(name){if(!S.rs)S.rs={};if(S.rs[name]==null)S.rs[name]=hashStr(S.seed+'|strom|'+name);const r=new Rng(S.rs[name]);return{next(){const v=r.next();S.rs[name]=r.s;return v;},int(a,b){return a+Math.floor(this.next()*(b-a+1));},pick(l){return l[Math.floor(this.next()*l.length)];},chance(p){return this.next()<p;},shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(this.next()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},sample(list,n){const l=[...list],o=[];while(o.length<n&&l.length)o.push(l.splice(Math.floor(this.next()*l.length),1)[0]);return o;}};}
// Einmalige Entscheidung an einer festen Stelle des Runs (immer gleich, egal wie oft man lädt)
function R(name){return Rng.of(S.seed,name);}
function neuerSeed(){return Math.floor(Math.random()*1e9);} // nur für die Wahl eines neuen Seeds, nicht für Inhalte
if(typeof module!=='undefined')module.exports={Rng,hashStr};
