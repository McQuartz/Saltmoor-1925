## Genom: Seed + Körperbau + Zone -> Parameter-Dictionary (alle Werte normiert 0..1).
## Jeder Parameter hat seinen eigenen RNG-Strom (fork nach Namen), Zonen-Regeln bilden ihn in [lo, hi] ab.
## Version 2: plan/zone frei, Augen/Maul-Parameter, marks, fixes, joints.
extends RefCounted

const Rng := preload("res://addons/spritegen/core/rng.gd")

const VERSION := 2
const PLANS: Array[String] = ["biped", "blob", "floater", "crawler", "worm"]
const ZONES: Array[String] = ["hafen", "wald", "kapelle", "grund"]

static var _plan_cache := {}
static var _zones_cache := {}


static func plan_def(plan: String) -> Dictionary:
	if not _plan_cache.has(plan):
		var f := FileAccess.open("res://addons/spritegen/bodyplans/%s.json" % plan, FileAccess.READ)
		assert(f != null, "Körperbau %s unbekannt" % plan)
		_plan_cache[plan] = JSON.parse_string(f.get_as_text())
	return _plan_cache[plan]


static func zones_def() -> Dictionary:
	if _zones_cache.is_empty():
		var f := FileAccess.open("res://addons/spritegen/bodyplans/zones.json", FileAccess.READ)
		_zones_cache = JSON.parse_string(f.get_as_text())
	return _zones_cache


## Wie Math.round(x * 10000) / 10000 (für x >= 0).
static func round4(x: float) -> float:
	return floorf(x * 10000.0 + 0.5) / 10000.0


## Wertebereich eines Parameters in einer Zone: [lo, hi] innerhalb 0..1.
static func param_range(plan: String, zone: String, name: String) -> Array:
	var z: Dictionary = zones_def().get(zone, {})
	var zp: Dictionary = z.get("params", {})
	var r: Array = [0.0, 1.0]
	if zp.has("*") and zp["*"].has(name):
		r = zp["*"][name]
	if zp.has(plan) and zp[plan].has(name):
		r = zp[plan][name]
	return r


static func make(seed_value: int, plan: String = "biped", zone: String = "hafen") -> Dictionary:
	var def := plan_def(plan)
	var root = Rng.new(seed_value)
	var params := {}
	for name in def["params"]:
		var raw: float = root.fork("param:" + name).next_float()
		var r := param_range(plan, zone, name)
		params[name] = round4(r[0] + (r[1] - r[0]) * raw)
	var pals: Array = zones_def()[zone]["palettes"]
	var palette: String = pals[root.fork("palette").next_u32() % pals.size()]
	return {"v": VERSION, "seed": seed_value, "plan": plan, "zone": zone, "palette": palette,
		"params": params, "marks": [], "fixes": [], "joints": {}}


## Alte Genome auf die aktuelle Version heben.
static func migrate(g: Dictionary) -> Dictionary:
	var out := g.duplicate(true)
	if out.get("v", 1) == 1:
		out["zone"] = out.get("zone", "hafen")
		out["joints"] = {}
		var def := plan_def(out["plan"])
		var root = Rng.new(out["seed"])
		for name in def["params"]:
			if not out["params"].has(name):
				out["params"][name] = round4(root.fork("param:" + name).next_float())
		out["v"] = 2
	return out


## Kind-Genom: Parameter um `strength` verrauscht, mit eigenem Seed für den Nachwuchs (Evolution im Editor).
static func mutate(parent: Dictionary, child_seed: int, strength: float = 0.15) -> Dictionary:
	var child := parent.duplicate(true)
	child["seed"] = child_seed
	var r = Rng.new(child_seed)
	for name in child["params"].keys():
		var v: float = child["params"][name] + (r.fork("mut:" + name).next_float() * 2.0 - 1.0) * strength
		child["params"][name] = round4(clampf(v, 0.0, 1.0))
	return child


## Zwei Eltern mischen: je Parameter zufällig vom einen oder anderen.
static func crossover(a: Dictionary, b: Dictionary, child_seed: int) -> Dictionary:
	var child := a.duplicate(true)
	child["seed"] = child_seed
	var r = Rng.new(child_seed)
	for name in child["params"].keys():
		if b["params"].has(name) and r.fork("x:" + name).next_float() < 0.5:
			child["params"][name] = b["params"][name]
	return child
