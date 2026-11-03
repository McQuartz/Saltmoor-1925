## Körperbau "Wurm": Segmentkette vom Schwanz (hinten, am Boden) zum aufgerichteten Kopf (vorne).
## Posen: idle (Welle läuft durch den Körper), attack (Kopf stößt vor), hit (Kopf zurück), death (sinkt flach).
extends RefCounted

const C := preload("res://addons/spritegen/core/plans/common.gd")
const P := preload("res://addons/spritegen/core/posing.gd")


static func pose_vars(anim: String, t: float, amp: float) -> Dictionary:
	var v := {"wave": 0.0, "wave_t": 0.0, "strike": 0.0, "rise": 1.0, "recoil": 0.0, "jaw": 0.0}
	match anim:
		"idle":
			v["wave"] = 1.5 * amp
			v["wave_t"] = t
		"attack":
			v["strike"] = P.keys(t, [[0, 0], [0.3, -0.35], [0.5, 1.0], [0.75, 0.6], [1, 0]])
			v["jaw"] = P.keys(t, [[0, 0], [0.3, 1.0], [0.5, 0.0], [1, 0]])
			v["rise"] = P.keys(t, [[0, 1], [0.3, 1.15], [0.5, 0.8], [1, 1]])
		"hit":
			v["recoil"] = P.keys(t, [[0, 0], [0.15, 1.0], [0.6, 0.3], [1, 0]])
			v["rise"] = P.keys(t, [[0, 1], [0.15, 0.85], [1, 1]])
		"death":
			v["rise"] = P.keys(t, [[0, 1], [0.25, 1.1], [0.7, 0.2], [1, 0.08]])
			v["jaw"] = P.keys(t, [[0, 0], [0.5, 0.8], [1, 0.3]])
			v["strike"] = P.keys(t, [[0, 0], [0.7, 0.3], [1, 0.4]])
	return v


static func build(p: Dictionary, pose: Dictionary, size: Dictionary) -> Dictionary:
	var v := pose_vars(pose.get("anim", "idle"), pose.get("t", 0.0), pose.get("amp", 1.0))
	var ground: float = size["foot_y"] + 0.5
	var scale_h: float = size["h"] / 80.0

	var n: int = C.count(p["segments"], 4, 9)
	var length: float = C.lerp(40, 80, p["length"]) * scale_h
	var thick: float = C.lerp(2.5, 6.5, p["thick"]) * C.lerp(0.8, 1.2, p["bulk"]) * scale_h
	var taper: float = p["taper"]
	var rise: float = C.lerp(14, 48, p["rise"]) * scale_h * v["rise"]
	var curl: float = (p["curl"] - 0.5) * 2.0
	var asym: float = (p["asym"] - 0.5)

	# Pfad: s = 0 Schwanz (hinten, +x) .. 1 Kopf (vorne, -x). Der Schwanz liegt, der Kopf hebt sich.
	var pts := []
	for i in n + 1:
		var s := float(i) / n
		var lift := pow(s, 1.6)
		var x := length * 0.45 - s * length * 0.9 * (1.0 - 0.45 * lift)
		var y := ground - thick - rise * lift
		# Krümmung: S-Form im vorderen Teil.
		x += curl * sin(s * PI) * 8.0 * scale_h
		# Welle im Loop: läuft vom Schwanz zum Kopf, ganzzahlige Frequenz.
		y += v["wave"] * sin(TAU * (v["wave_t"] - s)) * (0.3 + s)
		# Vorstoß/Rückstoß: wirkt auf das vordere Drittel.
		var w := maxf(0.0, (s - 0.6) / 0.4)
		x += (-v["strike"] * 10.0 + v["recoil"] * 6.0) * w * w
		y += v["strike"] * 5.0 * w * w
		pts.append([x + asym * 2.0 * sin(s * TAU), y, 0.0])

	# Jedes Segment aus zwei Halbknochen: schmal an den Segmentgrenzen, dick in der Mitte -> sichtbare Ringe.
	var bones: Array = []
	for i in n:
		var s0 := float(i) / n
		var s1 := float(i + 1) / n
		var r_mid: float = thick * (1.0 - taper * (1.0 - (s0 + s1) * 0.5))
		var r_a: float = thick * (1.0 - taper * (1.0 - s0)) * 0.72
		var r_b: float = thick * (1.0 - taper * (1.0 - s1)) * 0.72
		if i == n - 1:
			r_mid = thick * C.lerp(1.0, 1.5, p["headBulb"])
			r_b = r_mid * 0.85
		var tags := ["torso"]
		if i == n - 1:
			tags = ["head", "eyes", "mouth"]
		var m := [(pts[i][0] + pts[i + 1][0]) * 0.5, (pts[i][1] + pts[i + 1][1]) * 0.5, 0.0]
		bones.append(C.bone("seg_%d" % i, "body", "mid", pts[i], m, r_a, r_mid, tags))
		bones.append(C.bone("seg_%db" % i, "body", "mid", m, pts[i + 1], r_mid, r_b, tags))
	# Kiefer: kurzer Knochen unter dem Kopf, öffnet sich nach unten.
	var head_r: float = bones[-1]["r1"]
	var head_end: Array = pts[n]
	if p["jaw"] > 0.35:
		var dirx: float = pts[n][0] - pts[n - 1][0]
		var diry: float = pts[n][1] - pts[n - 1][1]
		var dl := sqrt(dirx * dirx + diry * diry)
		dirx /= dl
		diry /= dl
		var open_ang: float = 0.35 + v["jaw"] * 0.7
		var jx := dirx * cos(open_ang) - diry * sin(open_ang)
		var jy := dirx * sin(open_ang) + diry * cos(open_ang)
		var ja := [head_end[0] - dirx * head_r * 0.3, head_end[1] + head_r * 0.2, 0.0]
		var jb := [ja[0] + jx * head_r * 1.3, ja[1] + jy * head_r * 1.3, 0.0]
		bones.append(C.bone("jaw", "jaw", "front", ja, jb, head_r * 0.45, head_r * 0.25, ["jaw"]))
	# Stacheln: dünne Knochen nach oben auf jedem zweiten Segment.
	if p["spines"] > 0.5:
		for i in range(1, n, 2):
			var a: Array = pts[i]
			var dirx: float = pts[i + 1][0] - pts[i - 1][0]
			var diry: float = pts[i + 1][1] - pts[i - 1][1]
			var dl := sqrt(dirx * dirx + diry * diry)
			var nx := diry / dl
			var ny := -dirx / dl
			if ny > 0:
				nx = -nx
				ny = -ny
			var r := thick * (1.0 - taper * (1.0 - float(i) / n))
			var sl: float = r * C.lerp(0.8, 1.6, p["spines"])
			var sa := [a[0] + nx * r * 0.5, a[1] + ny * r * 0.5, 0.0]
			var sb := [a[0] + nx * (r + sl), a[1] + ny * (r + sl), 0.0]
			bones.append(C.bone("spine_%d" % i, "spine_%d" % i, "mid", sa, sb, r * 0.35, r * 0.1, ["spine"]))
	C.floor_clamp(bones, ground)
	var attach := {"jaw": "seg_%d" % (n - 1)}
	for b in bones:
		if b["group"].begins_with("spine_"):
			attach[b["group"]] = "seg_%d" % int(b["name"].substr(6))
	return {"bones": bones, "anchor_x": C.anchor_x(bones, "torso"), "attach": attach, "blend": {"body": 1.2, "limb": 1.0, "attach": 1.5}}
