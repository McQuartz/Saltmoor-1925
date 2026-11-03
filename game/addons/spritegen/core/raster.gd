## Volumen rastern, rein aus dem 2D-projizierten Abstandsfeld (Zielbild: flache Flächen mit Fase, keine Kuppeln).
##
## Knochen sind Kegel mit runden Enden. Je Pixel:
## - Silhouette: Abstand zur projizierten Achse minus Radius, innerhalb einer Gruppe glattes Minimum,
##   zwischen Gruppen hartes Minimum. 4×4 Teilproben am Rand, Mehrheitsentscheid.
## - Höhe für die Schattierung: Fase-Profil h = min(Innenabstand, R) * 0.9 (R = Radius des nächsten Knochens).
## - Tiefe (Reihenfolge): analytisch je Knochen z + sqrt(r² - a²); der vorderste Knochen gewinnt.
## - Körperkoordinaten u (entlang des Knochens) und v (Winkel um die Achse, 0..1).
##
## Ausgabe: cover, height, depth, bone, group, u, v, inside, layer, bone_names, tags je Knochen.
extends RefCounted

const BLEND_BODY := 3.0
const BLEND_LIMB := 1.5
const BLEND_ATTACH := 2.0
const BLEND_HEAD := 1.2
const BLEND_HEAD_ATTACH := 1.5
const SUPERSAMPLE := 4
const STRIDE := 8  # ax ay az dx dy dz r0 r1
const CULL_MARGIN := 8.0
const BEVEL := 0.9

var bone_data := PackedFloat64Array()
var groups: Array = []
var box := {}
var g_start := PackedInt32Array()
var g_bones := PackedInt32Array()
var g_k := PackedFloat64Array()
var g_attach := PackedInt32Array()
var g_k_attach := PackedFloat64Array()
var b_box := PackedFloat64Array()  # x0 y0 x1 y1
var n_bones := 0
# Ergebnis der letzten depth_at-Abfrage
var last_bone := -1
var last_t := 0.0
var last_r := 1.0


static func smin(a: float, b: float, k: float) -> float:
	if k <= 0.0:
		return minf(a, b)
	var h := maxf(k - absf(a - b), 0.0) / k
	return minf(a, b) - h * h * k * 0.25


func _init(skeleton: Dictionary) -> void:
	var bones: Array = skeleton["bones"]
	var blend: Dictionary = skeleton.get("blend", {})
	n_bones = bones.size()
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
	var attach_map: Dictionary = skeleton.get("attach", {})
	for g in groups:
		var n: String = g["name"]
		var kind := "limb"
		if n == "body":
			kind = "body"
		elif n == "head":
			kind = "head"
		g["k"] = blend.get(kind, BLEND_BODY if kind == "body" else (BLEND_HEAD if kind == "head" else BLEND_LIMB))
		g["k_attach"] = blend.get("head_attach" if kind == "head" else "attach", BLEND_HEAD_ATTACH if kind == "head" else BLEND_ATTACH)
		if attach_map.has(n):
			g["attach"] = _find(bones, attach_map[n])
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
	for b in bones:
		var m: float = maxf(b["r0"], b["r1"]) + CULL_MARGIN
		b_box.append_array([
			minf(b["a"][0], b["b"][0]) - m, minf(b["a"][1], b["b"][1]) - m,
			maxf(b["a"][0], b["b"][0]) + m, maxf(b["a"][1], b["b"][1]) + m])
		for pr in [[b["a"], b["r0"]], [b["b"], b["r1"]]]:
			var p: Array = pr[0]
			var r: float = pr[1]
			x0 = minf(x0, p[0] - r)
			x1 = maxf(x1, p[0] + r)
			y0 = minf(y0, p[1] - r)
			y1 = maxf(y1, p[1] + r)
	box = {"x0": x0, "y0": y0, "x1": x1, "y1": y1}


static func _find(bones: Array, name: String) -> int:
	for i in bones.size():
		if bones[i]["name"] == name:
			return i
	return -1


## Bitmaske der Knochen, deren Begrenzung das Pixel enthält.
func pixel_mask(x: float, y: float) -> int:
	var mask := 0
	for bi in n_bones:
		var o := bi * 4
		if x >= b_box[o] and x <= b_box[o + 2] and y >= b_box[o + 1] and y <= b_box[o + 3]:
			mask |= 1 << bi
	return mask


## 2D-projiziertes Feld (Silhouette). Gleiche Verschmelzung wie in 3D.
func silhouette_dist(px: float, py: float, mask: int) -> float:
	var bd := bone_data
	var best := INF
	for gi in g_k.size():
		var k: float = g_k[gi]
		var d := INF
		var att: int = g_attach[gi]
		var j1: int = g_start[gi + 1]
		var j: int = g_start[gi]
		var j_end := j1 + (1 if att >= 0 else 0)
		while j < j_end:
			var bi: int = g_bones[j] if j < j1 else att
			if j < j1 and (mask >> bi) & 1 == 0:
				j += 1
				continue
			if j == j1 and d == INF:
				break
			var o := bi * STRIDE
			var qx := px - bd[o]
			var qy := py - bd[o + 1]
			var bx := bd[o + 3]
			var by := bd[o + 4]
			var ll := bx * bx + by * by
			var t := (qx * bx + qy * by) / ll if ll > 0.0 else 0.0
			if t < 0.0:
				t = 0.0
			elif t > 1.0:
				t = 1.0
			var dx := qx - bx * t
			var dy := qy - by * t
			var di := sqrt(dx * dx + dy * dy) - (bd[o + 6] + (bd[o + 7] - bd[o + 6]) * t)
			if j < j1:
				if d == INF:
					d = di
				else:
					var h := maxf(k - absf(d - di), 0.0) / k
					d = minf(d, di) - h * h * k * 0.25
			else:
				var ka: float = g_k_attach[gi]
				var h2 := maxf(ka - absf(d - di), 0.0) / ka
				d = minf(d, di) - h2 * h2 * ka * 0.25
			j += 1
		if d < best:
			best = d
	return best


## Vorderster Knochen am Pixel (analytische Kapsel-Tiefe). Setzt last_bone/last_t/last_r, gibt Tiefe z.
func depth_at(px: float, py: float, mask: int) -> float:
	var bd := bone_data
	var best_z := -INF
	var best_d := INF
	last_bone = -1
	for bi in n_bones:
		if (mask >> bi) & 1 == 0:
			continue
		var o := bi * STRIDE
		var qx := px - bd[o]
		var qy := py - bd[o + 1]
		var bx := bd[o + 3]
		var by := bd[o + 4]
		var ll := bx * bx + by * by
		var t := (qx * bx + qy * by) / ll if ll > 0.0 else 0.0
		if t < 0.0:
			t = 0.0
		elif t > 1.0:
			t = 1.0
		var dx := qx - bx * t
		var dy := qy - by * t
		var a2 := dx * dx + dy * dy
		var r := bd[o + 6] + (bd[o + 7] - bd[o + 6]) * t
		var d := sqrt(a2) - r
		var zc := bd[o + 2] + bd[o + 5] * t
		var z := zc + sqrt(maxf(0.0, r * r - a2)) if d <= 0.0 else zc - d
		# Innen liegende Knochen bevorzugen; knapp außen nur, wenn nichts innen liegt (Verschmelzungszonen).
		var inside := d <= 0.0
		var best_inside := best_d <= 0.0
		if (inside and (not best_inside or z > best_z)) or (not inside and not best_inside and d < best_d):
			best_z = z
			best_d = d
			last_bone = bi
			last_t = t
			last_r = r
	return best_z


## Körperkoordinate v (Winkel um die Achse, 0..1) für Punkt (px, py, pz) auf Knochen bi.
func body_v(px: float, py: float, pz: float, bi: int, t: float) -> float:
	var o := bi * STRIDE
	var bx := bone_data[o + 3]
	var by := bone_data[o + 4]
	var bz := bone_data[o + 5]
	var ll := bx * bx + by * by + bz * bz
	var ox := px - bone_data[o] - bx * t
	var oy := py - bone_data[o + 1] - by * t
	var oz := pz - bone_data[o + 2] - bz * t
	var al := sqrt(ll) if ll > 0.0 else 1.0
	var ax := bx / al
	var ay := by / al
	var az := bz / al
	# n1 = Achse × z (in der Bildebene quer zur Achse), n2 = Achse × n1.
	var n1x := ay
	var n1y := -ax
	var nl := sqrt(n1x * n1x + n1y * n1y)
	if nl < 1e-6:
		n1x = 1.0
		n1y = 0.0
		nl = 1.0
	n1x /= nl
	n1y /= nl
	var n2x := -az * n1y
	var n2y := az * n1x
	var n2z := ax * n1y - ay * n1x
	var c1 := ox * n1x + oy * n1y
	var c2 := ox * n2x + oy * n2y + oz * n2z
	return atan2(c2, c1) / TAU + 0.5


static func rasterize(skeleton: Dictionary) -> Dictionary:
	var sc = new(skeleton)
	var w: int = skeleton["size"]["w"]
	var h: int = skeleton["size"]["h"]
	var n := w * h
	var cover := PackedByteArray()
	cover.resize(n)
	var height := PackedFloat64Array()
	height.resize(n)
	var inside := PackedFloat64Array()
	inside.resize(n)
	var depth := PackedFloat64Array()
	depth.resize(n)
	depth.fill(-INF)
	var bone := PackedInt32Array()
	bone.resize(n)
	bone.fill(-1)
	var group := PackedInt32Array()
	group.resize(n)
	group.fill(-1)
	var bu := PackedFloat64Array()
	bu.resize(n)
	var bv := PackedFloat64Array()
	bv.resize(n)
	var bone_group := PackedInt32Array()
	var layer: Array = []
	var tags: Array = []
	var names: Array = []
	for b in skeleton["bones"]:
		layer.append(b["layer"])
		tags.append(b["tags"])
		names.append(b["name"])
		for gi in sc.groups.size():
			if sc.groups[gi]["name"] == b["group"]:
				bone_group.append(gi)
	var S := SUPERSAMPLE
	var bx0: float = sc.box["x0"]
	var bx1: float = sc.box["x1"]
	var by0: float = sc.box["y0"]
	var by1: float = sc.box["y1"]
	for y in h:
		if y + 1 < by0 or y > by1:
			continue
		for x in w:
			if x + 1 < bx0 or x > bx1:
				continue
			var cx := x + 0.5
			var cy := y + 0.5
			var mask: int = sc.pixel_mask(cx, cy)
			if mask == 0:
				continue
			var dc: float = sc.silhouette_dist(cx, cy, mask)
			if dc > 0.75:
				continue
			var hits := 0
			if dc < -0.75:
				hits = S * S
			else:
				for j in S:
					for i in S:
						if sc.silhouette_dist(x + (i + 0.5) / S, y + (j + 0.5) / S, mask) <= 0.0:
							hits += 1
			if hits * 2 < S * S:
				continue
			var idx := y * w + x
			cover[idx] = 1
			var z: float = sc.depth_at(cx, cy, mask)
			var bi: int = sc.last_bone
			var u_in := maxf(-dc, 0.05)
			inside[idx] = u_in
			height[idx] = minf(u_in, sc.last_r) * BEVEL
			depth[idx] = z
			bone[idx] = bi
			group[idx] = bone_group[bi] if bi >= 0 else -1
			bu[idx] = sc.last_t
			bv[idx] = sc.body_v(cx, cy, z, bi, sc.last_t) if bi >= 0 else 0.0
	return {"w": w, "h": h, "cover": cover, "height": height, "inside": inside, "depth": depth,
		"bone": bone, "group": group, "u": bu, "v": bv, "layer": layer, "tags": tags, "bone_names": names,
		"group_names": sc.groups.map(func(g): return g["name"])}
