## Schattierung: Lambert aus der Normalen, in 4 Stufen quantisiert. Port von shade.js.
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")

const AMBIENT := 0.12
const BACK_DARKEN := 0.16
const THRESHOLDS := [0.3, 0.55, 0.8]


static func light() -> Array:
	var v := [-0.55, -0.7, 0.55]
	var l := sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
	return [v[0] / l, v[1] / l, v[2] / l]


static func shade(buf: Dictionary) -> Dictionary:
	var L := light()
	var w: int = buf["w"]
	var h: int = buf["h"]
	var px := PackedByteArray()
	px.resize(w * h)
	var cover: PackedByteArray = buf["cover"]
	var nx: PackedFloat64Array = buf["nx"]
	var ny: PackedFloat64Array = buf["ny"]
	var nz: PackedFloat64Array = buf["nz"]
	var bone: PackedInt32Array = buf["bone"]
	var layer: Array = buf["layer"]
	for i in w * h:
		if cover[i] == 0:
			continue
		var ndl: float = nx[i] * L[0] + ny[i] * L[1] + nz[i] * L[2]
		var l: float = AMBIENT + (1 - AMBIENT) * maxf(0.0, ndl)
		if layer[bone[i]] == "back":
			l -= BACK_DARKEN
		var st := 0
		while st < Indexed.RAMP_SIZE - 1 and l >= THRESHOLDS[st]:
			st += 1
		px[i] = Indexed.RAMP0 + st
	return Indexed.make(w, h, px)
