## Registry der Körperbaupläne. Jeder Plan: static build(params, pose, size) -> Skelett-Dictionary
## {bones, size, scale, attach, blend, anchors}. Danach gemeinsame Nacharbeit: Gelenk-Überschreibungen, Einpassen.
extends RefCounted

const Biped := preload("res://addons/spritegen/core/plans/biped.gd")
const Blob := preload("res://addons/spritegen/core/plans/blob.gd")
const Floater := preload("res://addons/spritegen/core/plans/floater.gd")
const Crawler := preload("res://addons/spritegen/core/plans/crawler.gd")
const Worm := preload("res://addons/spritegen/core/plans/worm.gd")

const REST_POSE := {"anim": "idle", "t": 0.0, "amp": 0.0}


static func builder(plan: String) -> GDScript:
	match plan:
		"biped": return Biped
		"blob": return Blob
		"floater": return Floater
		"crawler": return Crawler
		"worm": return Worm
	assert(false, "Körperbau %s unbekannt" % plan)
	return null


static func build(genome: Dictionary, pose: Dictionary = REST_POSE, size: Dictionary = {}) -> Dictionary:
	var def_size: Dictionary = size if not size.is_empty() else {"w": 96, "h": 120, "foot_x": 48, "foot_y": 117}
	var b := builder(genome["plan"])
	# Einpass-Maßstab aus der Ruhepose, damit die Figur in Animationen nicht springt.
	var rest: Dictionary = b.build(genome["params"], REST_POSE, def_size)
	apply_joints(rest, genome.get("joints", {}))
	fit_to_canvas(rest, def_size)
	var sk: Dictionary = rest
	if pose != REST_POSE:
		sk = b.build(genome["params"], pose, def_size)
		apply_joints(sk, genome.get("joints", {}))
		fit_to_canvas(sk, def_size, rest["scale"])
	return sk


## Gelenk-Überschreibungen aus dem Editor: {knochenname: [dx, dy]} verschiebt das Ende b des Knochens
## und den Anfang aller Knochen, die dort ansetzen.
static func apply_joints(sk: Dictionary, joints: Dictionary) -> void:
	if joints.is_empty():
		return
	for b in sk["bones"]:
		if not joints.has(b["name"]):
			continue
		var d: Array = joints[b["name"]]
		var old: Array = b["b"]
		b["b"] = [old[0] + d[0], old[1] + d[1], old[2]]
		for c in sk["bones"]:
			if c != b and absf(c["a"][0] - old[0]) < 1e-6 and absf(c["a"][1] - old[1]) < 1e-6 and absf(c["a"][2] - old[2]) < 1e-6:
				c["a"] = [c["a"][0] + d[0], c["a"][1] + d[1], c["a"][2]]


## Figur waagerecht auf foot_x zentrieren (Ankerpunkt des Plans), bei Bedarf um den Fußpunkt verkleinern.
static func fit_to_canvas(sk: Dictionary, size: Dictionary, fixed_scale: float = -1.0) -> void:
	var bones: Array = sk["bones"]
	var anchor_x: float = sk.get("anchor_x", 0.0)
	var shift_x: float = size["foot_x"] - anchor_x
	for b in bones:
		b["a"] = [b["a"][0] + shift_x, b["a"][1], b["a"][2]]
		b["b"] = [b["b"][0] + shift_x, b["b"][1], b["b"][2]]
	var margin := 2.0
	var scale := 1.0
	var ox: float = size["foot_x"]
	var oy: float = size["foot_y"] + 0.5
	if fixed_scale > 0.0:
		scale = fixed_scale
	for b in (bones if fixed_scale <= 0.0 else []):
		for pr in [[b["a"], b["r0"]], [b["b"], b["r1"]]]:
			var pt: Array = pr[0]
			var r: float = pr[1]
			var dx: float = pt[0] - ox
			var dy: float = pt[1] - oy
			if dx - r < 0:
				scale = minf(scale, (ox - margin) / (r - dx))
			if dx + r > 0:
				scale = minf(scale, (size["w"] - margin - ox) / (dx + r))
			if dy - r < 0:
				scale = minf(scale, (oy - margin) / (r - dy))
	if scale < 1:
		for b in bones:
			b["a"] = [ox + (b["a"][0] - ox) * scale, oy + (b["a"][1] - oy) * scale, b["a"][2] * scale]
			b["b"] = [ox + (b["b"][0] - ox) * scale, oy + (b["b"][1] - oy) * scale, b["b"][2] * scale]
			b["r0"] *= scale
			b["r1"] *= scale
	# Posen dürfen nicht aus dem Bild laufen: Endpunkte seitlich und oben in den Rand klemmen (Boden: floor_clamp der Pläne).
	for b in bones:
		for key in ["a", "b"]:
			var p: Array = b[key]
			var r: float = b["r0"] if key == "a" else b["r1"]
			var lo := margin + r
			var hi: float = size["w"] - margin - r
			var x: float = clampf(p[0], lo, hi) if lo < hi else size["w"] * 0.5
			var y: float = maxf(p[1], margin + r)
			y = minf(y, size["foot_y"] + 0.5 - r)
			b[key] = [x, y, p[2]]
	sk["scale"] = scale
	sk["size"] = size
