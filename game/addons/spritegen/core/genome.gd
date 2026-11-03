## Genom: Seed -> Parameter-Dictionary (alle Werte normiert 0..1).
## Jeder Parameter hat seinen eigenen RNG-Strom (fork nach Namen).
extends RefCounted

const Rng := preload("res://addons/spritegen/core/rng.gd")

const VERSION := 1

const BIPED_PARAMS: Array[String] = [
	"height",     # Gesamthöhe
	"legs",       # Beinanteil an der Höhe
	"bulk",       # Rumpfdicke
	"belly",      # 0 = breite Schultern, 1 = birnenförmig
	"neck",       # Halslänge
	"head",       # Kopfgröße
	"headFwd",    # Kopf nach vorne gestreckt (fischartig)
	"hunch",      # Buckel / Vorneigung
	"arms",       # Armlänge
	"armSwing",   # Arme vor/zurück
	"elbow",      # Ellbogenbeugung
	"limbThick",  # Gliedmaßendicke
	"knee",       # Kniebeugung
	"stance",     # Schrittweite
	"asym",       # Asymmetrie nah/fern
]


## Wie Math.round(x * 10000) / 10000 in JS (für x >= 0 identisch).
static func round4(x: float) -> float:
	return floorf(x * 10000.0 + 0.5) / 10000.0


static func make(seed_value: int, plan: String = "biped", palette: String = "tiefsee") -> Dictionary:
	assert(plan == "biped", "Körperbau %s gibt es in M1 noch nicht" % plan)
	var root = Rng.new(seed_value)
	var params := {}
	for name in BIPED_PARAMS:
		params[name] = round4(root.fork("param:" + name).next_float())
	return {"v": VERSION, "seed": seed_value, "plan": plan, "zone": "hafen", "palette": palette,
		"params": params, "marks": [], "fixes": []}
