## Körperbau "Schwebend": Körper in der Luft, Kuppel oben, hängende Tentakel als Verlet-Ketten.
## Posen: idle (Schweben), attack (Sturzflug nach vorne), hit (nach hinten/oben gestoßen), death (Absturz).
extends RefCounted

const C := preload("res://addons/spritegen/core/plans/common.gd")
const P := preload("res://addons/spritegen/core/posing.gd")


static func pose_vars(anim: String, t: float, amp: float) -> Dictionary:
	var v := {"dx": 0.0, "dy": 0.0, "tilt": 0.0, "squash": 1.0, "fall": 0.0}
	match anim:
		"idle":
			v["dy"] = 2.0 * P.cycle(t, 1) * amp
			v["tilt"] = 0.08 * P.cycle(t, 1, 0.25) * amp
		"attack":
			v["dx"] = P.keys(t, [[0, 0], [0.25, 4.0], [0.5, -9.0], [0.75, -5.0], [1, 0]])
			v["dy"] = P.keys(t, [[0, 0], [0.25, -4.0], [0.5, 5.0], [0.75, 2.0], [1, 0]])
			v["tilt"] = P.keys(t, [[0, 0], [0.25, -0.3], [0.5, 0.6], [1, 0]])
			v["squash"] = P.keys(t, [[0, 1], [0.25, 0.9], [0.5, 1.15], [1, 1]])
		"hit":
			v["dx"] = P.keys(t, [[0, 0], [0.15, 5.0], [0.5, 2.0], [1, 0]])
			v["dy"] = P.keys(t, [[0, 0], [0.15, -3.0], [1, 0]])
			v["tilt"] = P.keys(t, [[0, 0], [0.15, -0.5], [1, 0]])
			v["squash"] = P.keys(t, [[0, 1], [0.15, 0.85], [0.5, 1.05], [1, 1]])
		"death":
			v["fall"] = P.keys(t, [[0, 0], [0.2, 0.0], [0.7, 1.0], [1, 1]])
			v["tilt"] = P.keys(t, [[0, 0], [0.3, -0.4], [0.7, 0.9], [1, 1.1]])
			v["squash"] = P.keys(t, [[0, 1], [0.7, 1.0], [0.8, 0.6], [1, 0.7]])
			v["dx"] = P.keys(t, [[0, 0], [1, 2.0]])
	return v


static func build(p: Dictionary, pose: Dictionary, size: Dictionary) -> Dictionary:
	var anim: String = pose.get("anim", "idle")
	var t: float = pose.get("t", 0.0)
	var amp: float = pose.get("amp", 1.0)
	var v := pose_vars(anim, t, amp)
	var ground: float = size["foot_y"] + 0.5
	var scale_h: float = size["h"] / 80.0

	var body_r: float = C.lerp(6, 13, p["body"]) * scale_h
	var flat: float = p["flat"]
	var body_len := body_r * C.lerp(0.2, 1.6, flat)
	var r: float = body_r * C.lerp(1.0, 0.7, flat) * v["squash"]
	var hover: float = C.lerp(22, 48, p["hover"]) * scale_h
	var tent_n: int = C.count(p["tentacles"], 2, 5)
	var tent_len: float = C.lerp(10, 30, p["tentLen"]) * scale_h
	var asym: float = (p["asym"] - 0.5)

	var cy: float = ground - hover * (1.0 - v["fall"]) - r + v["dy"]
	if v["fall"] > 0.0:
		cy = minf(cy, ground - r * 1.05)
	var cx: float = v["dx"]
	var tilt: float = v["tilt"]
	var a := [cx + cos(tilt) * body_len * 0.5, cy + sin(tilt) * body_len * 0.5, 0.0]
	var b := [cx - cos(tilt) * body_len * 0.5, cy - sin(tilt) * body_len * 0.5, 0.0]
	var bones: Array = [C.bone("body", "body", "mid", a, b, r * (1 + asym * 0.2), r * (1 - asym * 0.2), ["torso", "head", "eyes", "mouth"])]
	if p["dome"] > 0.3:
		var dome_r: float = r * C.lerp(0.4, 0.8, p["dome"])
		var top := [cx + sin(tilt) * r * 0.6, cy - cos(tilt) * r * 0.6, 0.0]
		var top2 := [top[0] + sin(tilt) * dome_r * 0.5, top[1] - cos(tilt) * dome_r * 0.5, 0.0]
		bones.append(C.bone("dome", "body", "mid", top, top2, dome_r, dome_r * 0.8, ["dome"]))

	# Tentakel: Wurzeln an der Unterseite, als Verlet-Ketten simuliert. Die Wurzel folgt dem Körper über die Zeit.
	var limb_r: float = C.lerp(0.9, 2.0, p["tentThick"]) * scale_h
	var spread: float = C.lerp(0.6, 1.3, p["tentSpread"])
	var attach := {}
	for i in tent_n:
		var f := (float(i) + 0.5) / tent_n - 0.5
		var layer := "front" if i % 2 == 0 else "back"
		var zs := 0.5 if i % 2 == 0 else -0.5
		var root_off_x := f * 2.0 * r * 0.8 * spread
		var root_off_y := r * 0.75 * sqrt(maxf(0.0, 1.0 - (f * 2.0 * spread) * (f * 2.0 * spread)))
		var seg_n := 4
		var seg_len := tent_len * (1.0 + asym * f) / seg_n
		var root_at := func(tt: float) -> Array:
			var vv := pose_vars(anim, tt, amp)
			var ccy: float = ground - hover * (1.0 - vv["fall"]) - r + vv["dy"]
			if vv["fall"] > 0.0:
				ccy = minf(ccy, ground - r * 1.05)
			var ct: float = vv["tilt"]
			return [vv["dx"] + cos(ct) * root_off_x - sin(ct) * root_off_y, ccy + sin(ct) * root_off_x + cos(ct) * root_off_y]
		var loop := anim == "idle"
		# Ruhelage schräg nach außen, damit die Tentakel sich spreizen statt zu einem Stiel zu verkleben.
		var rd := [f * 2.0 * spread * 0.8, 1.0]
		var rl := sqrt(rd[0] * rd[0] + rd[1] * rd[1])
		rd = [rd[0] / rl, rd[1] / rl]
		var pts := P.chain(root_at, t, seg_n, seg_len, 0.6, 0.35 + 0.4 * p["tentThick"], 0.1, 32, loop, rd)
		# Auf dem Boden liegen bleiben.
		for q in pts:
			if q[1] > ground - limb_r:
				q[1] = ground - limb_r
		var grp := "tent_%d" % i
		for bn in P.chain_bones(pts, grp, grp, layer, zs * r, limb_r, limb_r * 0.45, ["tentacle"]):
			bones.append(bn)
		attach[grp] = "body"

	return {"bones": bones, "anchor_x": cx, "attach": attach, "blend": {"body": 3.0, "limb": 1.2, "attach": 2.5}}
