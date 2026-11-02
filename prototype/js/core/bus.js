// Ereignis-Bus: Die Spielregeln (core) melden, was passiert. Darstellung, Sound und Effekte hören zu.
// In Godot entspricht das Signalen.
const Bus={h:{},on(n,f){(this.h[n]=this.h[n]||[]).push(f);},emit(n,p={}){(this.h[n]||[]).forEach(f=>f(p));(this.h['*']||[]).forEach(f=>f(n,p));}};
