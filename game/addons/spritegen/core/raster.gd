## Volumen rastern. Port von tools/spritegen/core/raster.js.
## Knochen als Signed Distance Fields, verschmolzen mit glattem Minimum, Strahl je Pixel entlang -z.
## Abdeckung per 4×4 Supersampling + Mehrheitsentscheid.
extends RefCounted

const BLEND_BODY := 3.0
const BLEND_LIMB := 1.5
const BLEND_ATTACH := 2.0
const BLEND_HEAD := 1.2
const BLEND_HEAD_ATTACH := 1.5
const SUPERSAMPLE := 4
const STRIDE := 8  # ax ay az dx dy dz r0 r1

var bone_data := PackedFloat64Array()
## Je Gruppe: {name, bones: PackedInt32Array, attach: int, k: float, k_attach: float}
var groups: Array = []
var box := {}
## Ergebnis der letzten scene_dist-Abfrage mit Merker.
var last_bone := -1
var last_group := -1
## Flache Kopie der Gruppen für die heiße Schleife (keine Dictionary-Zugriffe).
var g_start := PackedInt32Array()   # Anfang je Gruppe in g_bones, plus Endmarke
var g_bones := PackedInt32Array()
var g_k := PackedFloat64Array()
var g_attach := PackedInt32Array()
var g_k_attach := PackedFloat64Array()


static func smin(a: float, b: float, k: float) -> float:
	if k <= 0.0:
		return minf(a, b)
	var h := maxf(k - absf(a - b), 0.0) / k
	return minf(a, b) - h * h * k * 0.25


func _init(skeleton: Dictionary) -> void:
	var bones: Array = skeleton["bones"]
	var by_group := {}
	for i in bones.size():
		var b: Dictionary = bones[i]
		var a: Array = b["a"]
		var e: Array = b["b"]
		bone_data.append_array([a[0], a[1], a[2], e[0] - a[0], e[1] - a[1], e[2] - a[2], b["r0"], b["r1"]])
		if not by_group.has(b["group"]):
			by_group[b["group"]] = groups.size()
			groups.append({"name": b["group"], "bones": PackedInt32Array(), "attach": -1})
		groups[by_group[b["group"]]]["bones"].append(i)
	var chest := _find(bones, "chest")
	var pelvis := _find(bones, "pelvis")
	for g in groups:
		var n: String = g["name"]
		g["k"] = BLEND_BODY if n == "body" else (BLEND_HEAD if n == "head" else BLEND_LIMB)
		g["k_attach"] = BLEND_HEAD_ATTACH if n == "head" else BLEND_ATTACH
		if n.begins_with("arm_") or n == "head":
			g["attach"] = chest
		elif n.begins_with("leg_"):
			g["attach"] = pelvis
	for g in groups:
		g_start.append(g_bones.size())
		g_bones.append_array(g["bones"])
		g_k.append(g["k"])
		g_attach.append(g["attach"])
		g_k_attach.append(g["k_attach"])
	g_start.append(g_bones.size())
	var x0 := INF
	var y0 := INF
	var x1 := -INF
	var y1 := -INF
	var z1 := -INF
	for b in bones:
		for pr in [[b["a"], b["r0"]], [b["b"], b["r1"]]]:
			var p: Array = pr[0]
			var r: float = pr[1]
			x0 = minf(x0, p[0] - r)
			x1 = maxf(x1, p[0] + r)
			y0 = minf(y0, p[1] - r)
			y1 = maxf(y1, p[1] + r)
			z1 = maxf(z1, p[2] + r)
	box = {"x0": x0, "y0": y0, "x1": x1, "y1": y1, "z1": z1}


static func _find(bones: Array, name: String) -> int:
	for i in bones.size():
		if bones[i]["name"] == name:
			return i
	return -1


## Abstand zu einem Kegel mit runden Enden (Näherung: Radius linear entlang der Projektion).
func cone_dist(px: float, py: float, pz: float, bi: int) -> float:
	var o := bi * STRIDE
	var bd := bone_data
	var qx := px - bd[o]
	var qy := py - bd[o + 1]
	var qz := pz - bd[o + 2]
	var bx := bd[o + 3]
	var by := bd[o + 4]
	var bz := bd[o + 5]
	var ll := bx * bx + by * by + bz * bz
	var t := (qx * bx + qy * by + qz * bz) / ll if ll > 0.0 else 0.0
	if t < 0.0:
		t = 0.0
	elif t > 1.0:
		t = 1.0
	var dx := qx - bx * t
	var dy := qy - by * t
	var dz := qz - bz * t
	return sqrt(dx * dx + dy * dy + dz * dz) - (bd[o + 6] + (bd[o + 7] - bd[o + 6]) * t)


## Abstandsfeld der ganzen Figur. Mit track = true werden last_bone/last_group gesetzt.
## Kegelabstand und glattes Minimum sind hier eingebettet (Funktionsaufrufe sind in GDScript teuer);
## Rechenschritte in derselben Reihenfolge wie cone_dist/smin, damit das Ergebnis bitgleich bleibt.
func scene_dist(px: float, py: float, pz: float, track: bool = false) -> float:
	var bd := bone_data
	var best := INF
	var nearest := INF
	var ng := g_k.size()
	for gi in ng:
		var k: float = g_k[gi]
		var d := INF
		var att: int = g_attach[gi]
		var j0: int = g_start[gi]
		var j1: int = g_start[gi + 1]
		var j := j0
		# Ansatzknochen als letzter Durchlauf (j == j1).
		var j_end := j1 + (1 if att >= 0 else 0)
		while j < j_end:
			var bi: int = g_bones[j] if j < j1 else att
			var o := bi * STRIDE
			var qx := px - bd[o]
			var qy := py - bd[o + 1]
			var qz := pz - bd[o + 2]
			var bx := bd[o + 3]
			var by := bd[o + 4]
			var bz := bd[o + 5]
			var ll := bx * bx + by * by + bz * bz
			var t := (qx * bx + qy * by + qz * bz) / ll if ll > 0.0 else 0.0
			if t < 0.0:
				t = 0.0
			elif t > 1.0:
				t = 1.0
			var dx := qx - bx * t
			var dy := qy - by * t
			var dz := qz - bz * t
			var di := sqrt(dx * dx + dy * dy + dz * dz) - (bd[o + 6] + (bd[o + 7] - bd[o + 6]) * t)
			if j < j1:
				if d == INF:
					d = di
				else:
					var h := maxf(k - absf(d - di), 0.0) / k
					d = minf(d, di) - h * h * k * 0.25
				if track and di < nearest:
					nearest = di
					last_bone = bi
					last_group = gi
			else:
				var ka: float = g_k_attach[gi]
				var h2 := maxf(ka - absf(d - di), 0.0) / ka
				d = minf(d, di) - h2 * h2 * ka * 0.25
			j += 1
		if d < best:
			best = d
	return best


## Strahl von vorne (+z) nach hinten. Gibt z des Treffers oder NAN.
func march(x: float, y: float) -> float:
	var z_far: float = -box["z1"] - 1
	var z: float = box["z1"] + 1
	var i := 0
	while i < 96 and z > z_far:
		var d := scene_dist(x, y, z)
		if d < 0.01:
			return z
		z -= maxf(d * 0.9, 0.02)
		i += 1
	return NAN


static func rasterize(skeleton: Dictionary) -> Dictionary:
	var sc = new(skeleton)
	var w: int = skeleton["size"]["w"]
	var h: int = skeleton["size"]["h"]
	var n := w * h
	var cover := PackedByteArray()
	cover.resize(n)
	var depth := PackedFloat64Array()
	depth.resize(n)
	depth.fill(-INF)
	var nx := PackedFloat64Array()
	nx.resize(n)
	var ny := PackedFloat64Array()
	ny.resize(n)
	var nz := PackedFloat64Array()
	nz.resize(n)
	var bone := PackedInt32Array()
	bone.resize(n)
	bone.fill(-1)
	var group := PackedInt32Array()
	group.resize(n)
	group.fill(-1)
	var layer: Array = []
	for b in skeleton["bones"]:
		layer.append(b["layer"])
	var S := SUPERSAMPLE
	var bx: Dictionary = sc.box
	var bx0: float = bx["x0"]
	var bx1: float = bx["x1"]
	var by0: float = bx["y0"]
	var by1: float = bx["y1"]
	# Durchgang 1: nur Pixelmitten. Durchgang 2: Supersampling nur, wo die 3×3-Nachbarschaft
	# gemischt ist (Rand). Ganz innen = voll abgedeckt, ganz außen = leer. Bitgleich zur JS-Referenz.
	var center_z := PackedFloat64Array()
	center_z.resize(n)
	center_z.fill(NAN)
	var center_hit := PackedByteArray()
	center_hit.resize(n)
	for y in h:
		if y + 1 < by0 or y > by1:
			continue
		for x in w:
			if x + 1 < bx0 or x > bx1:
				continue
			var z0: float = sc.march(x + 0.5, y + 0.5)
			center_z[y * w + x] = z0
			if not is_nan(z0):
				center_hit[y * w + x] = 1
	for y in h:
		if y + 1 < by0 or y > by1:
			continue
		for x in w:
			if x + 1 < bx0 or x > bx1:
				continue
			var n_hit := 0
			for j in range(-1, 2):
				for i in range(-1, 2):
					var X := x + i
					var Y := y + j
					if X >= 0 and Y >= 0 and X < w and Y < h and center_hit[Y * w + X] == 1:
						n_hit += 1
			if n_hit == 0:
				continue
			var hits := 0
			var sx := NAN
			var sy := NAN
			var sz := NAN
			var cz: float = center_z[y * w + x]
			if not is_nan(cz):
				sx = x + 0.5
				sy = y + 0.5
				sz = cz
			if n_hit == 9:
				hits = S * S
			else:
				for j in S:
					for i in S:
						var fx := x + (i + 0.5) / S
						var fy := y + (j + 0.5) / S
						var z: float = sc.march(fx, fy)
						if not is_nan(z):
							hits += 1
							if is_nan(sz):
								sx = fx
								sy = fy
								sz = z
			if hits * 2 < S * S:
				continue
			var idx := y * w + x
			cover[idx] = 1
			depth[idx] = sz
			var e := 0.25
			var gx: float = sc.scene_dist(sx + e, sy, sz) - sc.scene_dist(sx - e, sy, sz)
			var gy: float = sc.scene_dist(sx, sy + e, sz) - sc.scene_dist(sx, sy - e, sz)
			var gz: float = sc.scene_dist(sx, sy, sz + e) - sc.scene_dist(sx, sy, sz - e)
			var length := sqrt(gx * gx + gy * gy + gz * gz)
			if length == 0.0:
				length = 1.0
			nx[idx] = gx / length
			ny[idx] = gy / length
			nz[idx] = gz / length
			sc.scene_dist(sx, sy, sz, true)
			bone[idx] = sc.last_bone
			group[idx] = sc.last_group
	return {"w": w, "h": h, "cover": cover, "depth": depth, "nx": nx, "ny": ny, "nz": nz,
		"bone": bone, "group": group, "layer": layer}
