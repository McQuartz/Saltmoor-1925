## Körperbau "Zweibeiner": Becken, Brust, Hals, Kopf, je zwei Arm- und drei Beinknochen.
## Posen: idle (Atmen, Loop), attack (Ausholen, Zuschlagen), hit (Rückstoß), death (Zusammensacken).
extends RefCounted

const C := preload("res://addons/spritegen/core/plans/common.gd")
const P := preload("res://addons/spritegen/core/posing.gd")


## Posen-Variablen für Zeit t. Alle Werte 0 in Ruhe.
static func pose_vars(anim: String, t: float, amp: float) -> Dictionary:
	var v := {"dx": 0.0, "dy": 0.0, "lean": 0.0, "arm_near": 0.0, "arm_far": 0.0, "elbow": 0.0,
		"head": 0.0, "squash": 1.0, "drop": 0.0}
	match anim:
		"idle":
			var b := P.cycle(t, 1) * amp
			v["dy"] = -0.6 * b
			v["lean"] = 0.04 * b
			v["arm_near"] = 0.08 * P.cycle(t, 1, 0.25) * amp
			v["arm_far"] = -0.06 * P.cycle(t, 1, 0.25) * amp
			v["head"] = 0.06 * b
			v["squash"] = 1.0 + 0.02 * b
		"attack":
			v["lean"] = P.keys(t, [[0, 0], [0.25, -0.35], [0.45, 0.7], [0.7, 0.5], [1, 0]])
			v["arm_near"] = P.keys(t, [[0, 0], [0.25, -1.3], [0.45, 1.6], [0.7, 1.2], [1, 0]])
			v["arm_far"] = P.keys(t, [[0, 0], [0.25, -0.5], [0.45, 0.8], [1, 0]])
			v["elbow"] = P.keys(t, [[0, 0], [0.25, 0.6], [0.45, -0.7], [1, 0]])
			v["dx"] = P.keys(t, [[0, 0], [0.25, 2.0], [0.45, -5.0], [0.7, -3.0], [1, 0]])
			v["dy"] = P.keys(t, [[0, 0], [0.25, 1.0], [0.45, -2.0], [0.6, 1.0], [1, 0]])
			v["head"] = P.keys(t, [[0, 0], [0.25, -0.3], [0.45, 0.5], [1, 0]])
		"hit":
			v["dx"] = P.keys(t, [[0, 0], [0.15, 4.0], [0.5, 2.0], [1, 0]])
			v["lean"] = P.keys(t, [[0, 0], [0.15, -0.5], [0.6, -0.2], [1, 0]])
			v["squash"] = P.keys(t, [[0, 1], [0.15, 0.9], [0.5, 1.04], [1, 1]])
			v["arm_near"] = P.keys(t, [[0, 0], [0.15, -0.7], [1, 0]])
			v["arm_far"] = P.keys(t, [[0, 0], [0.15, 0.5], [1, 0]])
			v["head"] = P.keys(t, [[0, 0], [0.15, -0.5], [1, 0]])
		"death":
			v["drop"] = P.keys(t, [[0, 0], [0.3, 0.15], [0.7, 0.9], [1, 1]])
			v["lean"] = P.keys(t, [[0, 0], [0.25, -0.3], [0.6, 1.0], [1, 1.5]])
			v["arm_near"] = P.keys(t, [[0, 0], [0.4, 0.6], [1, 1.4]])
			v["arm_far"] = P.keys(t, [[0, 0], [0.4, 0.3], [1, 1.0]])
			v["head"] = P.keys(t, [[0, 0], [0.3, -0.4], [1, 0.9]])
			v["elbow"] = P.keys(t, [[0, 0], [1, 0.5]])
			v["dx"] = P.keys(t, [[0, 0], [0.6, -2.0], [1, -4.0]])
	return v


static func build(p: Dictionary, pose: Dictionary, size: Dictionary) -> Dictionary:
	var v := pose_vars(pose.get("anim", "idle"), pose.get("t", 0.0), pose.get("amp", 1.0))
	var ground: float = size["foot_y"] + 0.5
	var scale_h: float = size["h"] / 80.0

	var H: float = C.lerp(46, 72, p["height"]) * scale_h
	var leg_len: float = H * C.lerp(0.3, 0.46, p["legs"])
	var torso_r: float = C.lerp(4.5, 10.5, p["bulk"]) * scale_h / v["squash"]
	var belly: float = p["belly"] * 2 - 1
	var r_shoulder := torso_r * (1 - 0.28 * belly)
	var r_hip := torso_r * (1 + 0.22 * belly) * 0.9
	var head_r: float = minf(C.lerp(3.2, 7.5, p["head"]) * scale_h, torso_r * 1.2)
	var neck_len: float = C.lerp(0, 6, p["neck"]) * scale_h
	var limb_r: float = C.lerp(1.3, 3.0, p["limbThick"]) * C.lerp(0.85, 1.25, p["bulk"]) * scale_h
	var asym: float = (p["asym"] - 0.5) * 0.5

	var foot_r := maxf(1.2, limb_r * 0.85)
	var hip_y: float = ground - leg_len * (1.0 - 0.85 * v["drop"]) - foot_r + v["dy"]
	var torso_len: float = maxf(torso_r * 0.8, H - leg_len - neck_len - head_r * 2 - foot_r) * v["squash"]

	var tilt: float = p["hunch"] * 0.75 + v["lean"]
	var pelvis := [v["dx"], hip_y, 0.0]
	var mid := C.step(pelvis, PI - tilt * 0.35, torso_len * 0.5)
	var chest := C.step(mid, PI - tilt * 1.15, torso_len * 0.5)

	var neck_angle: float = PI - tilt * 1.4 - p["headFwd"] * 0.7 - v["head"]
	var neck_end := C.step(chest, neck_angle, neck_len + head_r * 0.4)
	var head_back := C.step(neck_end, neck_angle, head_r * 0.5)
	var head_len: float = head_r * C.lerp(0.1, 1.3, p["headFwd"])
	# Kopf zeigt nach vorne (-x), bei Buckel/Posen weiter nach unten.
	var head_down: float = 0.15 + 0.5 * v["head"] + 0.3 * p["hunch"]
	var head_front := [head_back[0] - head_len * cos(head_down), head_back[1] + head_len * sin(head_down), 0.0]

	var neck_r := minf(r_shoulder, head_r)
	var bones: Array = [
		C.bone("pelvis", "body", "mid", pelvis, mid, r_hip, (r_hip + r_shoulder) / 2, ["torso"]),
		C.bone("chest", "body", "mid", mid, chest, (r_hip + r_shoulder) / 2, r_shoulder, ["torso"]),
		C.bone("neck", "head", "mid", chest, neck_end, neck_r * 0.5, neck_r * 0.45, ["neck"]),
		C.bone("head", "head", "mid", head_back, head_front, head_r, head_r * 0.82, ["head", "eyes", "mouth"]),
	]

	var sides := [
		{"key": "near", "layer": "front", "zs": 1.0, "len": 1 + asym, "swing": 1.0, "arm": v["arm_near"]},
		{"key": "far", "layer": "back", "zs": -1.0, "len": 1 - asym, "swing": -1.0, "arm": v["arm_far"]},
	]
	var arm_len: float = torso_len / v["squash"] * C.lerp(0.75, 1.45, p["arms"])
	var stance: float = C.lerp(1.5, 7, p["stance"]) * scale_h

	for s in sides:
		var zs: float = s["zs"]
		var z := zs * (torso_r * 0.85 + limb_r * 0.6)
		var shoulder := [chest[0] + zs * torso_r * 0.15, chest[1] + r_shoulder * 0.45, z]
		var swing: float = (p["armSwing"] - 0.5) * 0.9 * s["swing"] + tilt * 0.6 + s["arm"]
		var length: float = arm_len * s["len"]
		var elbow := C.step(shoulder, swing, length * 0.5)
		var hand := C.step(elbow, swing + maxf(0.0, p["elbow"] * 1.2 + v["elbow"]), length * 0.5)
		bones.append(C.bone("arm_upper_" + s["key"], "arm_" + s["key"], s["layer"], shoulder, elbow, limb_r * 1.15, limb_r, ["arm"]))
		bones.append(C.bone("arm_lower_" + s["key"], "arm_" + s["key"], s["layer"], elbow, hand, limb_r, limb_r * 1.05, ["arm", "hand"]))

		var hip := [pelvis[0] + zs * r_hip * 0.2, pelvis[1] + r_hip * 0.3, zs * r_hip * 0.6]
		var ankle_y := ground - foot_r
		var ankle := [0.0 - s["swing"] * stance * 0.5, ankle_y, hip[2]]
		var ddx: float = ankle[0] - hip[0]
		var ddy: float = ankle[1] - hip[1]
		var dist := sqrt(ddx * ddx + ddy * ddy)
		var rest_dist := sqrt(ddx * ddx + (leg_len) * (leg_len))
		var seg: float = (maxf(dist, rest_dist * 0.5) / 2) / C.lerp(0.99, 0.82, p["knee"])
		seg = maxf(seg, dist / 2 * 1.001)
		var knee := C.ik2(hip, ankle, seg, seg, [-1.0, 0.0])
		var toe := [ankle[0] - foot_r * 2.2, ankle_y, hip[2]]
		bones.append(C.bone("leg_upper_" + s["key"], "leg_" + s["key"], s["layer"], hip, knee, limb_r * 1.35, limb_r * 1.05, ["leg"]))
		bones.append(C.bone("leg_lower_" + s["key"], "leg_" + s["key"], s["layer"], knee, ankle, limb_r * 1.05, foot_r, ["leg"]))
		bones.append(C.bone("foot_" + s["key"], "leg_" + s["key"], s["layer"], ankle, toe, foot_r, foot_r * 0.85, ["foot"]))

	C.floor_clamp(bones, ground)
	return {"bones": bones, "anchor_x": C.anchor_x(bones, "foot"),
		"attach": {"head": "chest", "arm_near": "chest", "arm_far": "chest", "leg_near": "pelvis", "leg_far": "pelvis"},
		"blend": {}}
