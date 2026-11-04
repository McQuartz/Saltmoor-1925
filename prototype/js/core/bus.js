// Ereignis-Bus: Die Spielregeln (core) melden, was passiert. Darstellung, Sound, Effekte und der Dev-Modus hören zu.
// Jedes System gibt einen Grund mit (why), damit der Dev-Modus erklären kann, was passiert. In Godot entspricht das Signalen.
const Bus={h:{},muted:false,
 on(n,f){(this.h[n]=this.h[n]||[]).push(f);},
 emit(n,p={}){if(this.muted)return;(this.h[n]||[]).forEach(f=>f(p));(this.h['*']||[]).forEach(f=>f(n,p));}};
