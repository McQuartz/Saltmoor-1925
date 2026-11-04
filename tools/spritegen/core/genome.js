// Genom: Seed -> Parameter-Dictionary (alle Werte normiert 0..1).
// Jeder Parameter hat seinen eigenen RNG-Strom (fork nach Namen).
import { Rng } from './rng.js';

export const GENOME_VERSION = 1;

// Reihenfolge ist egal (jeder Parameter hat eigenen Strom), aber fest für die JSON-Ausgabe.
export const BIPED_PARAMS = [
  'height',     // Gesamthöhe
  'legs',       // Beinanteil an der Höhe
  'bulk',       // Rumpfdicke
  'belly',      // 0 = breite Schultern, 1 = birnenförmig
  'neck',       // Halslänge
  'head',       // Kopfgröße
  'headFwd',    // Kopf nach vorne gestreckt (fischartig)
  'hunch',      // Buckel / Vorneigung
  'arms',       // Armlänge
  'armSwing',   // Arme vor/zurück
  'elbow',      // Ellbogenbeugung
  'limbThick',  // Gliedmaßendicke
  'knee',       // Kniebeugung
  'stance',     // Schrittweite
  'asym',       // Asymmetrie nah/fern
];

const round4 = (x) => Math.floor(x * 10000 + 0.5) / 10000; // wie im Godot-Port

export function makeGenome(seed, plan = 'biped', palette = 'tiefsee') {
  if (plan !== 'biped') throw new Error(`Körperbau ${plan} gibt es in M1 noch nicht`);
  const root = new Rng(seed);
  const params = {};
  for (const name of BIPED_PARAMS) params[name] = round4(root.fork('param:' + name).float());
  return { v: GENOME_VERSION, seed, plan, zone: 'hafen', palette, params, marks: [], fixes: [] };
}
