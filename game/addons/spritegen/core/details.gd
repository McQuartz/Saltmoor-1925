## Details als Regeln: Augen (mit Glühen), Maul (mit Zähnen), Markierungen aus dem Genom ("Malen mit Absicht"),
## Korrekturen (fixes). Alles wird über Körperkoordinaten (Knochen, u, v) verankert und je Bild neu gefunden,
## darum sitzt es in jeder Pose an derselben Körperstelle.
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const Genome := preload("res://addons/spritegen/core/genome.gd")
const Surface := preload("res://addons/spritegen/core/surface.gd")

const EYE_V := 0.2       # Winkel um die Achse: zum Betrachter und etwas nach oben/vorne
const MOUTH_V := 0.38
const MAX_UV_DIST := 0.18


## Pixel finden, dessen Körperkoordinate (Knochen, u, v) dem Ziel am nächsten liegt. -1 wenn nicht sichtbar.
static func find_anchor(buf: Dictionary, bone_idx: int, u: float, v: float) -> int:
	var cover: PackedByteArray = buf["cover"]
	var bone: PackedInt32Array = buf["bone"]
	var bu: PackedFloat64Array = buf["u"]
	var bv: PackedFloat64Array = buf["v"]
	var best := -1
	var best_d := INF
	for i in cover.size():
		if cover[i] == 0 or bone[i] != bone_idx:
			continue
		var du := bu[i] - u
		var dv := absf(bv[i] - v)
		if dv > 0.5:
			dv = 1.0 - dv
		var d := du * du + dv * dv * 1.5
		if d < best_d:
			best_d = d
			best = i
	if best_d > MAX_UV_DIST * MAX_UV_DIST:
		return -1
	return best


static func bone_index(buf: Dictionary, name: String) -> int:
	return buf["bone_names"].find(name)


static func bones_with_tag(buf: Dictionary, tag: String) -> Array:
	var out := []
	for i in buf["tags"].size():
		if buf["tags"][i].has(tag):
			out.append(i)
	return out


static func _put(img: Dictionary, x: int, y: int, v: int, buf: Dictionary) -> void:
	if x < 0 or y < 0 or x >= img["w"] or y >= img["h"]:
		return
	var i: int = y * img["w"] + x
	if buf["cover"][i] == 0:
		return
	img["px"][i] = v


## Auge: Scheibe in Augenfarbe, Glühen drum herum (gedithert, nur auf Körperpixeln).
static func draw_eye(img: Dictionary, buf: Dictionary, cx: int, cy: int, r: float) -> void:
	var w: int = img["w"]
	var px: PackedByteArray = img["px"]
	var gr := r + 2.5
	for y in range(int(floor(cy - gr)), int(ceil(cy + gr)) + 1):
		for x in range(int(floor(cx - gr)), int(ceil(cx + gr)) + 1):
			if x < 0 or y < 0 or x >= w or y >= img["h"]:
				continue
			var i := y * w + x
			if buf["cover"][i] == 0:
				continue
			var dx := x + 0.5 - (cx + 0.5)
			var dy := y + 0.5 - (cy + 0.5)
			var q := sqrt(dx * dx + dy * dy)
			if q <= r:
				px[i] = Indexed.EYE
			elif px[i] != Indexed.EYE:
				var f := 1.0 - (q - r) / (gr - r)
				if f > 0.0 and f * f * 0.9 > Indexed.bayer(x, y) * 0.9:
					px[i] = Indexed.GLOW


static func apply(img: Dictionary, buf: Dictionary, genome: Dictionary, surf: Dictionary) -> Dictionary:
	var out := Indexed.make(img["w"], img["h"], img["px"].duplicate())
	var p: Dictionary = genome["params"]
	var def := Genome.plan_def(genome["plan"])
	var scale: float = buf["h"] / 80.0
	var w: int = img["w"]
	# Augen auf allen Knochen mit Tag "eyes", verteilt entlang u und v.
	var eye_bones := bones_with_tag(buf, "eyes")
	var er: Array = def.get("eyes_range", [1, 3])
	var n_eyes: int = clampi(er[0] + int(floor(p.get("eyes", 0.5) * (er[1] - er[0] + 1))), er[0], er[1])
	var eye_r: float = lerpf(0.8, 2.2, p.get("eyeSize", 0.5)) * scale * 0.8 / sqrt(maxf(1.0, n_eyes * 0.6))
	if not eye_bones.is_empty() and n_eyes > 0:
		var host: int = eye_bones[-1]
		for k in n_eyes:
			var f := (k + 0.5) / n_eyes
			# Augen um den Kopf herum (v) auf halber Höhe des Knochens (u), zum Betrachter hin.
			var u := 0.62 + 0.08 * sin(k * 2.1)
			var v := EYE_V + (f - 0.5) * 0.3
			var a := find_anchor(buf, host, u, v)
			if a < 0:
				continue
			draw_eye(out, buf, a % w, a / w, eye_r)
	# Maul: dunkle Linie quer, Zähne als helle Punkte darunter.
	var mouth_bones := bones_with_tag(buf, "mouth")
	var mouth: float = p.get("mouth", 0.0)
	if not mouth_bones.is_empty() and mouth > 0.2:
		var host: int = mouth_bones[-1]
		var a := find_anchor(buf, host, 0.9, MOUTH_V)
		if a >= 0:
			var cx := a % w
			var cy := a / w
			var half := int(round(lerpf(1.5, 6.0, mouth) * scale * 0.7))
			for dx in range(-half, half + 1):
				_put(out, cx + dx, cy, Indexed.RAMP0, buf)
				if mouth > 0.55 and (dx + half) % 2 == 0:
					_put(out, cx + dx, cy + 1, Indexed.RIM2, buf)
	# Markierungen aus dem Genom.
	for m in genome.get("marks", []):
		var bi := bone_index(buf, m.get("bone", ""))
		if bi < 0:
			continue
		var a := find_anchor(buf, bi, m.get("u", 0.5), m.get("v", 0.25))
		if a < 0:
			continue
		var cx := a % w
		var cy := a / w
		var r: float = m.get("r", 1.5) * scale * 0.8
		match m.get("kind", "eye"):
			"eye":
				draw_eye(out, buf, cx, cy, r)
			"growth":
				for y in range(int(cy - r), int(cy + r) + 1):
					for x in range(int(cx - r), int(cx + r) + 1):
						var dx := x - cx
						var dy := y - cy
						if dx * dx + dy * dy <= r * r:
							var cur := _peek(out, x, y)
							if Indexed.is_ramp(cur):
								_put(out, x, y, clampi(cur + (1 if dy < 0 else -1), Indexed.RAMP0, Indexed.RAMP0 + 3), buf)
			"rust":
				for y in range(int(cy - r), int(cy + r) + 1):
					for x in range(int(cx - r), int(cx + r) + 1):
						var dx := x - cx
						var dy := y - cy
						if dx * dx + dy * dy <= r * r and Surface.hash01(x, y, 3, genome["seed"]) > 0.55:
							var cur := _peek(out, x, y)
							if Indexed.is_ramp(cur):
								_put(out, x, y, maxi(Indexed.RAMP0, cur - 1), buf)
			"scar":
				for k in range(-int(r), int(r) + 1):
					_put(out, cx + k, cy + int(round(k * 0.4)), Indexed.RAMP0, buf)
			"light":
				draw_eye(out, buf, cx, cy, r * 0.7)
	return out


static func _peek(img: Dictionary, x: int, y: int) -> int:
	if x < 0 or y < 0 or x >= img["w"] or y >= img["h"]:
		return 0
	return img["px"][y * img["w"] + x]


## Korrekturen: am Knochen verankert {bone, u, v, ramp} oder nur ein Bild {frame: "idle:3", x, y, ramp}.
static func apply_fixes(img: Dictionary, buf: Dictionary, genome: Dictionary, frame: String) -> Dictionary:
	var fixes: Array = genome.get("fixes", [])
	if fixes.is_empty():
		return img
	var out := Indexed.make(img["w"], img["h"], img["px"].duplicate())
	var w: int = img["w"]
	for f in fixes:
		var ramp: int = clampi(int(f.get("ramp", 0)), 0, Indexed.COUNT - 1)
		if f.has("frame"):
			if f["frame"] == frame:
				var x: int = f["x"]
				var y: int = f["y"]
				if x >= 0 and y >= 0 and x < w and y < img["h"]:
					out["px"][y * w + x] = ramp
		else:
			var bi := bone_index(buf, f.get("bone", ""))
			if bi < 0:
				continue
			var a := find_anchor(buf, bi, f.get("u", 0.5), f.get("v", 0.25))
			if a >= 0:
				out["px"][a] = ramp
	return out
