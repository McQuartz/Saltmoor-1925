## Körperbau "Krabbler": waagerechter Rumpf auf 2–4 Beinpaaren, Kopf vorne, optional Schwanz.
## Posen: idle (Wippen), attack (Aufbäumen, Biss nach vorne-unten), hit (zurückgeschoben), death (Beine knicken ein).
extends RefCounted

const C := preload("res://addons/spritegen/core/plans/common.gd")
const P := preload("res://addons/spritegen/core/posing.gd")


static func pose_vars(anim: String, t: float, amp: float) -> Dictionary:
	var v := {"dx": 0.0, "dy": 0.0, "rear": 0.0, "head": 0.0, "collapse": 0.0, "splay": 0.0}
	match anim:
		"idle":
			v["dy"] = 1.0 * P.cycle(t, 1) * amp
			v["head"] = 0.1 * P.cycle(t, 1, 0.25) * amp
			v["rear"] = 0.03 * P.cycle(t, 1) * amp
		"attack":
			v["rear"] = P.keys(t, [[0, 0], [0.3, 0.6], [0.5, -0.2], [0.75, 0.1], [1, 0]])
			v["head"] = P.keys(t, [[0, 0], [0.3, -0.5], [0.5, 0.9], [0.75, 0.4], [1, 0]])
			v["dx"] = P.keys(t, [[0, 0], [0.3, 2.0], [0.5, -5.0], [0.8, -2.0], [1, 0]])
			v["dy"] = P.keys(t, [[0, 0], [0.3, -2.0], [0.5, 1.5], [1, 0]])
		"hit":
			v["dx"] = P.keys(t, [[0, 0], [0.15, 4.0], [0.5, 2.0], [1, 0]])
			v["dy"] = P.keys(t, [[0, 0], [0.15, -1.5], [1, 0]])
			v["splay"] = P.keys(t, [[0, 0], [0.15, 1.0], [0.6, 0.3], [1, 0]])
			v["head"] = P.keys(t, [[0, 0], [0.15, -0.6], [1, 0]])
		"death":
			v["collapse"] = P.keys(t, [[0, 0], [0.2, 0.1], [0.6, 0.9], [1, 1]])
			v["splay"] = P.keys(t, [[0, 0], [0.6, 0.8], [1, 1.2]])
			v["head"] = P.keys(t, [[0, 0], [0.3, -0.5], [1, 0.8]])
			v["rear"] = P.keys(t, [[0, 0], [0.2, 0.3], [0.6, -0.1], [1, 0]])
	return v


static func build(p: Dictionary, pose: Dictionary, size: Dictionary) -> Dictionary:
	var v := pose_vars(pose.get("anim", "idle"), pose.get("t", 0.0), pose.get("amp", 1.0))
	var ground: float = size["foot_y"] + 0.5
	var scale_h: float = size["h"] / 80.0

	var length: float = C.lerp(22, 44, p["length"]) * scale_h
	var body_r: float = C.lerp(3.5, 8.0, p["bulk"]) * scale_h
	var height: float = C.lerp(10, 26, p["height"]) * scale_h * (1.0 - 0.75 * v["collapse"]) + v["dy"]
	var pairs: int = C.count(p["legPairs"], 2, 4)
	var leg_len: float = maxf(height * 1.1, C.lerp(10, 26, p["legLen"]) * scale_h)
	var limb_r: float = C.lerp(1.0, 2.4, p["limbThick"]) * scale_h
	var head_r: float = minf(C.lerp(3, 7, p["head"]) * scale_h, body_r * 1.3)
	var asym: float = (p["asym"] - 0.5)

	# Rumpf: hinten (+x) nach vorne (-x), vorne angehoben bei "rear".
	var cy := ground - height - body_r
	var back := [v["dx"] + length * 0.5, cy + 1.0, 0.0]
	var mid := [v["dx"], cy - v["rear"] * 3.0, 0.0]
	var front := [v["dx"] - length * 0.5, cy - v["rear"] * 10.0, 0.0]
	var bones: Array = [
		C.bone("abdomen", "body", "mid", back, mid, body_r * 1.1, body_r, ["torso"]),
		C.bone("thorax", "body", "mid", mid, front, body_r, body_r * 0.85, ["torso"]),
	]
	var head_down: float = C.lerp(0.1, 0.9, p["headDown"]) + v["head"]
	var head_a := [front[0] - body_r * 0.3, front[1], 0.0]
	var head_b := [head_a[0] - cos(head_down) * head_r * 1.4, head_a[1] + sin(head_down) * head_r * 1.4, 0.0]
	bones.append(C.bone("head", "head", "mid", head_a, head_b, head_r, head_r * 0.75, ["head", "eyes", "mouth"]))
	if p["tail"] > 0.4:
		var tail_len: float = C.lerp(6, 18, p["tailLen"]) * scale_h
		var tail_a := [back[0] + body_r * 0.5, back[1], 0.0]
		var tail_b := [tail_a[0] + tail_len * 0.9, tail_a[1] - tail_len * 0.4 + v["collapse"] * tail_len * 0.4, 0.0]
		bones.append(C.bone("tail", "tail", "mid", tail_a, tail_b, body_r * 0.5, limb_r * 0.6, ["tail"]))

	# Beine: Paare entlang des Rumpfs, nah (vorne) und fern (hinten). Knie zeigt nach oben.
	var spread: float = C.lerp(0.6, 1.4, p["legSpread"])
	var knee_up: float = C.lerp(0.5, 1.3, p["kneeUp"])
	var attach := {}
	for i in pairs:
		var f := (float(i) + 0.5) / pairs - 0.5  # -0.5..0.5 entlang des Rumpfs
		var hx: float = v["dx"] + f * length * 0.8 * -1.0
		var hy := cy + body_r * 0.5
		for s in [["near", "front", 1.0], ["far", "back", -1.0]]:
			var zs: float = s[2]
			var hip := [hx + zs * 0.5, hy, zs * body_r * 0.8]
			var foot_x: float = hx + f * length * -0.2 * spread + (f * 2.0) * leg_len * 0.35 * spread * -1.0 \
				- zs * 1.5 * (1.0 + asym) + v["splay"] * f * 8.0 * -1.0
			var foot := [foot_x, ground - limb_r, hip[2]]
			var seg := leg_len * 0.5 * (1.0 + 0.15 * asym * zs)
			var dd := sqrt((foot[0] - hip[0]) ** 2 + (foot[1] - hip[1]) ** 2)
			seg = maxf(seg, dd * 0.5 * 1.02)
			var knee := C.ik2(hip, foot, seg * knee_up, seg, [0.0, -1.0])
			var grp := "leg_%d_%s" % [i, s[0]]
			bones.append(C.bone(grp + "_up", grp, s[1], hip, knee, limb_r * 1.2, limb_r, ["leg"]))
			bones.append(C.bone(grp + "_lo", grp, s[1], knee, foot, limb_r, limb_r * 0.7, ["leg", "foot"]))
			attach[grp] = "abdomen" if f > 0 else "thorax"
	attach["head"] = "thorax"
	attach["tail"] = "abdomen"
	C.floor_clamp(bones, ground)
	return {"bones": bones, "anchor_x": C.anchor_x(bones, "torso"), "attach": attach, "blend": {"body": 3.0, "limb": 1.0, "attach": 1.5}}
