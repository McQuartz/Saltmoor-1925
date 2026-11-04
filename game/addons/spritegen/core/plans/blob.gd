## Körperbau "Klumpen": ein Haufen aus Rumpfsäule, Beulen und Stummel-Gliedmaßen, sitzt auf dem Boden.
## Posen: idle (Wabern), attack (Aufbäumen und Vorstoßen), hit (Zusammenzucken), death (Zerfließen).
extends RefCounted

const C := preload("res://addons/spritegen/core/plans/common.gd")
const P := preload("res://addons/spritegen/core/posing.gd")


static func pose_vars(anim: String, t: float, amp: float) -> Dictionary:
	var v := {"dx": 0.0, "sway": 0.0, "stretch": 1.0, "widen": 1.0, "melt": 0.0, "lump_sag": 0.0, "stub": 0.0}
	match anim:
		"idle":
			v["sway"] = 1.2 * P.cycle(t, 1) * amp
			v["stretch"] = 1.0 + 0.04 * P.cycle(t, 1, 0.25) * amp
			v["widen"] = 1.0 - 0.03 * P.cycle(t, 1, 0.25) * amp
			v["stub"] = 0.15 * P.cycle(t, 2) * amp
		"attack":
			v["stretch"] = P.keys(t, [[0, 1], [0.3, 0.8], [0.5, 1.35], [0.75, 1.1], [1, 1]])
			v["widen"] = P.keys(t, [[0, 1], [0.3, 1.2], [0.5, 0.85], [1, 1]])
			v["sway"] = P.keys(t, [[0, 0], [0.3, 2.5], [0.5, -6.0], [0.8, -3.0], [1, 0]])
			v["dx"] = P.keys(t, [[0, 0], [0.5, -3.0], [1, 0]])
			v["stub"] = P.keys(t, [[0, 0], [0.3, -0.8], [0.5, 1.2], [1, 0]])
		"hit":
			v["stretch"] = P.keys(t, [[0, 1], [0.15, 0.8], [0.5, 1.06], [1, 1]])
			v["widen"] = P.keys(t, [[0, 1], [0.15, 1.2], [0.5, 0.97], [1, 1]])
			v["dx"] = P.keys(t, [[0, 0], [0.15, 3.0], [1, 0]])
			v["sway"] = P.keys(t, [[0, 0], [0.15, 3.0], [1, 0]])
		"death":
			v["melt"] = P.keys(t, [[0, 0], [0.3, 0.2], [1, 1]])
			v["stretch"] = P.keys(t, [[0, 1], [0.3, 1.1], [1, 0.35]])
			v["widen"] = P.keys(t, [[0, 1], [0.3, 0.95], [1, 1.5]])
			v["lump_sag"] = P.keys(t, [[0, 0], [1, 1]])
			v["sway"] = P.keys(t, [[0, 0], [0.3, -2.0], [1, 3.0]])
	return v


static func build(p: Dictionary, pose: Dictionary, size: Dictionary) -> Dictionary:
	var v := pose_vars(pose.get("anim", "idle"), pose.get("t", 0.0), pose.get("amp", 1.0))
	var ground: float = size["foot_y"] + 0.5
	var scale_h: float = size["h"] / 80.0

	var width: float = C.lerp(9, 19, p["width"]) * scale_h * v["widen"]
	var height: float = C.lerp(14, 40, p["height"]) * scale_h * v["stretch"]
	var r_base: float = width * C.lerp(0.8, 1.15, p["squash"])
	var r_top: float = width * C.lerp(0.55, 0.95, p["bulk"])
	var lean: float = (p["lean"] - 0.5) * 0.6
	var asym: float = (p["asym"] - 0.5)

	var base := [v["dx"], ground - r_base * 0.9, 0.0]
	var mid := C.step(base, PI - lean * 0.5, height * 0.45)
	mid[0] += v["sway"] * 0.5
	var top := C.step(mid, PI - lean - v["sway"] * 0.08, height * 0.4)
	top[0] += v["sway"]
	var r_mid := (r_base + r_top) * 0.5
	var bones: Array = [
		C.bone("base", "body", "mid", base, mid, r_base, r_mid, ["torso", "foot"]),
		C.bone("top", "body", "mid", mid, top, r_mid, r_top, ["torso", "head", "eyes", "mouth"]),
	]

	# Beulen: um die Säule verteilt, Winkel aus Index + Parameter, keine Zufallszahlen im Bauplan.
	var n_lumps: int = C.count(p["lumps"], 0, 5)
	for i in n_lumps:
		var f := float(i) / maxf(1, n_lumps)
		var ang: float = TAU * (f + p["lumpSize"] * 0.37 + asym * 0.3)
		var h: float = 0.25 + 0.6 * fmod(f * 1.7 + p["lean"] * 0.5, 1.0)
		var cx: float = base[0] + (mid[0] - base[0]) * 2 * minf(h, 0.5) + (top[0] - mid[0]) * 2 * maxf(h - 0.5, 0)
		var cy: float = base[1] + (top[1] - base[1]) * h
		var rr := r_mid * C.lerp(0.9, 1.0, h)
		var lr: float = r_mid * C.lerp(0.3, 0.6, p["lumpSize"]) * (1.0 - 0.3 * v["lump_sag"])
		var ox := cos(ang) * (rr * 0.95 + lr * 0.5)
		var oy: float = sin(ang) * (rr * 0.45 + lr * 0.3) - rr * 0.1 + v["lump_sag"] * rr * 0.5
		var oz := sin(ang + 1.0) * rr * 0.6
		var a := [cx + ox * 0.6, cy + oy * 0.6, oz * 0.6]
		var b := [cx + ox, cy + oy, oz]
		bones.append(C.bone("lump_%d" % i, "body", "mid", a, b, lr * 0.9, lr, ["lump"]))

	# Stummel-Gliedmaßen unten seitlich.
	var n_stubs: int = C.count(p["stubs"], 0, 3)
	var limb_r: float = C.lerp(1.4, 3.2, p["limbThick"]) * scale_h
	var stub_len: float = C.lerp(7, 16, p["stubLen"]) * scale_h
	for i in n_stubs:
		var side := 1.0 if i % 2 == 0 else -1.0
		var zs := 1.0 if i < 2 else -1.0
		var ang: float = 1.1 * side + v["stub"] + asym * 0.4 * side
		var root := [mid[0] + side * r_mid * 0.9 * (0.6 if i == 2 else 1.0), mid[1] + r_mid * 0.25 + i * 1.5, zs * r_mid * 0.75]
		var tip := C.step(root, ang, stub_len * (1 + asym * side * 0.3))
		var grp := "stub_%d" % i
		bones.append(C.bone(grp, grp, "front" if zs > 0 else "back", root, tip, limb_r * 1.1, limb_r * 0.8, ["arm", "hand"]))

	# Zerfließen: alles nach unten drücken.
	if v["melt"] > 0.0:
		for b in bones:
			for key in ["a", "b"]:
				var q: Array = b[key]
				b[key] = [q[0], ground - (ground - q[1]) * (1.0 - 0.6 * v["melt"]), q[2]]
	C.floor_clamp(bones, ground)
	var attach := {}
	for i in n_stubs:
		attach["stub_%d" % i] = "base"
	return {"bones": bones, "anchor_x": C.anchor_x(bones, "foot"), "attach": attach, "blend": {"body": 4.0}}
