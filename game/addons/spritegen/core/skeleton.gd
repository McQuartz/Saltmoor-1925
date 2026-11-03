## Skelett für den Körperbau "Zweibeiner". Port von tools/spritegen/core/skeleton.js.
## Koordinaten in Pixeln: x nach rechts, y nach unten, z zum Betrachter. Blick nach links (vorne = -x).
## Jeder Knochen ist ein Kegel mit runden Enden: a, b, Radius r0 (bei a), r1 (bei b).
## Punkte sind Arrays [x, y, z] mit 64-Bit-Floats (Vector3 hätte nur 32 Bit).
extends RefCounted

const DEFAULT_SIZE := {"w": 64, "h": 80, "foot_x": 32, "foot_y": 78}


static func _lerp(a: float, b: float, t: float) -> float:
	return a + (b - a) * t


static func _bone(name: String, group: String, layer: String, a: Array, b: Array, r0: float, r1: float, tags: Array) -> Dictionary:
	return {"name": name, "group": group, "layer": layer, "a": a, "b": b, "r0": r0, "r1": r1, "tags": tags}


## Punkt in Richtung Winkel (0 = nach unten, positiv = nach vorne/links).
static func _step(p: Array, angle: float, length: float) -> Array:
	return [p[0] - sin(angle) * length, p[1] + cos(angle) * length, p[2]]


## Zwei-Knochen-IK in der x/y-Ebene. Knie zeigt nach vorne (-x).
static func _ik2(hip: Array, ankle: Array, l1: float, l2: float, z: float) -> Array:
	var dx: float = ankle[0] - hip[0]
	var dy: float = ankle[1] - hip[1]
	var d := sqrt(dx * dx + dy * dy)
	var d_max := (l1 + l2) * 0.999
	if d > d_max:
		d = d_max
	var a := (l1 * l1 - l2 * l2 + d * d) / (2.0 * d)
	var hgt := sqrt(maxf(0.0, l1 * l1 - a * a))
	var ux := dx / sqrt(dx * dx + dy * dy)
	var uy := dy / sqrt(dx * dx + dy * dy)
	var px := -uy
	var py := ux
	var sgn := 1.0 if px < 0.0 else -1.0
	return [hip[0] + ux * a + sgn * px * hgt, hip[1] + uy * a + sgn * py * hgt, z]


static func build(genome: Dictionary, size: Dictionary = DEFAULT_SIZE) -> Dictionary:
	var p: Dictionary = genome["params"]
	var ground: float = size["foot_y"] + 0.5
	var scale_h: float = size["h"] / 80.0

	var H := _lerp(46, 72, p["height"]) * scale_h
	var leg_len := H * _lerp(0.3, 0.46, p["legs"])
	var torso_r := _lerp(4.5, 10.5, p["bulk"]) * scale_h
	var belly: float = p["belly"] * 2 - 1
	var r_shoulder := torso_r * (1 - 0.28 * belly)
	var r_hip := torso_r * (1 + 0.22 * belly) * 0.9
	var head_r := minf(_lerp(3.2, 7.5, p["head"]) * scale_h, torso_r * 1.2)
	var neck_len := _lerp(0, 6, p["neck"]) * scale_h
	var limb_r := _lerp(1.3, 3.0, p["limbThick"]) * _lerp(0.85, 1.25, p["bulk"]) * scale_h
	var asym: float = (p["asym"] - 0.5) * 0.5

	var foot_r := maxf(1.2, limb_r * 0.85)
	var hip_y := ground - leg_len - foot_r
	var torso_len := maxf(torso_r * 0.8, H - leg_len - neck_len - head_r * 2 - foot_r)

	# Wirbelsäule in zwei Knochen, damit ein Buckel entsteht.
	var tilt: float = p["hunch"] * 0.75
	var pelvis := [0.0, hip_y, 0.0]
	var mid := _step(pelvis, PI - tilt * 0.35, torso_len * 0.5)
	var chest := _step(mid, PI - tilt * 1.15, torso_len * 0.5)

	# Hals und Kopf: Kopf neigt sich weiter nach vorne.
	var neck_angle: float = PI - tilt * 1.4 - p["headFwd"] * 0.7
	var neck_end := _step(chest, neck_angle, neck_len + head_r * 0.4)
	var head_back := _step(neck_end, neck_angle, head_r * 0.5)
	var head_len := head_r * _lerp(0.1, 1.3, p["headFwd"])
	var head_front := [head_back[0] - head_len, head_back[1] + head_len * 0.15, 0.0]

	var neck_r := minf(r_shoulder, head_r)
	var bones: Array = [
		_bone("pelvis", "body", "mid", pelvis, mid, r_hip, (r_hip + r_shoulder) / 2, ["torso"]),
		_bone("chest", "body", "mid", mid, chest, (r_hip + r_shoulder) / 2, r_shoulder, ["torso"]),
		_bone("neck", "head", "mid", chest, neck_end, neck_r * 0.5, neck_r * 0.45, ["neck"]),
		_bone("head", "head", "mid", head_back, head_front, head_r, head_r * 0.82, ["head"]),
	]

	# Seiten: nah (z+, front) und fern (z-, back).
	var sides := [
		{"key": "near", "layer": "front", "zs": 1.0, "len": 1 + asym, "swing": 1.0},
		{"key": "far", "layer": "back", "zs": -1.0, "len": 1 - asym, "swing": -1.0},
	]

	var arm_len := torso_len * _lerp(0.75, 1.45, p["arms"])
	var stance := _lerp(1.5, 7, p["stance"]) * scale_h

	for s in sides:
		var zs: float = s["zs"]
		var z := zs * (torso_r * 0.85 + limb_r * 0.6)
		# Schulter etwas unterhalb der Brust-Oberkante.
		var shoulder := [chest[0] + zs * torso_r * 0.15, chest[1] + r_shoulder * 0.45, z]
		var swing: float = (p["armSwing"] - 0.5) * 0.9 * s["swing"] + tilt * 0.6
		var length: float = arm_len * s["len"]
		var elbow := _step(shoulder, swing, length * 0.5)
		var hand := _step(elbow, swing + p["elbow"] * 1.2, length * 0.5)
		bones.append(_bone("arm_upper_" + s["key"], "arm_" + s["key"], s["layer"], shoulder, elbow, limb_r * 1.15, limb_r, ["arm"]))
		bones.append(_bone("arm_lower_" + s["key"], "arm_" + s["key"], s["layer"], elbow, hand, limb_r, limb_r * 1.05, ["arm", "hand"]))

		var hip := [pelvis[0] + zs * r_hip * 0.2, pelvis[1] + r_hip * 0.3, zs * r_hip * 0.6]
		var ankle_y := ground - foot_r
		var ankle := [hip[0] - s["swing"] * stance * 0.5, ankle_y, hip[2]]
		# Kniebeugung: Knochen länger als der Abstand Hüfte–Knöchel, IK beugt das Knie nach vorne.
		var ddx: float = ankle[0] - hip[0]
		var ddy: float = ankle[1] - hip[1]
		var dist := sqrt(ddx * ddx + ddy * ddy)
		var seg := (dist / 2) / _lerp(0.99, 0.82, p["knee"])
		var knee := _ik2(hip, ankle, seg, seg, hip[2])
		var toe := [ankle[0] - foot_r * 2.2, ankle_y, hip[2]]
		bones.append(_bone("leg_upper_" + s["key"], "leg_" + s["key"], s["layer"], hip, knee, limb_r * 1.35, limb_r * 1.05, ["leg"]))
		bones.append(_bone("leg_lower_" + s["key"], "leg_" + s["key"], s["layer"], knee, ankle, limb_r * 1.05, foot_r, ["leg"]))
		bones.append(_bone("foot_" + s["key"], "leg_" + s["key"], s["layer"], ankle, toe, foot_r, foot_r * 0.85, ["foot"]))

	return _fit_to_canvas(bones, size)


## Füße mittig auf foot_x setzen, bei Bedarf um den Fußpunkt verkleinern, damit 2 px Rand bleiben.
static func _fit_to_canvas(bones: Array, size: Dictionary) -> Dictionary:
	var fx := 0.0
	var n := 0
	for b in bones:
		if b["tags"].has("foot"):
			fx += (b["a"][0] + b["b"][0]) / 2
			n += 1
	fx = fx / n
	var shift_x: float = size["foot_x"] - fx
	for b in bones:
		b["a"] = [b["a"][0] + shift_x, b["a"][1], b["a"][2]]
		b["b"] = [b["b"][0] + shift_x, b["b"][1], b["b"][2]]
	var margin := 2.0
	var scale := 1.0
	var ox: float = size["foot_x"]
	var oy: float = size["foot_y"] + 0.5
	for b in bones:
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
	return {"bones": bones, "size": size, "scale": scale}
