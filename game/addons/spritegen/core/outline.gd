## Umriss: Außenumriss und Innenkanten. Port von outline.js.
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const N4 := [[1, 0], [-1, 0], [0, 1], [0, -1]]
const INNER_EDGE_DEPTH := 2.5


static func outer_outline(img: Dictionary) -> Dictionary:
	var w: int = img["w"]
	var h: int = img["h"]
	var px: PackedByteArray = img["px"]
	var out := px.duplicate()
	for y in h:
		for x in w:
			if px[y * w + x] != Indexed.TRANSPARENT:
				continue
			for d in N4:
				var X: int = x + d[0]
				var Y: int = y + d[1]
				if X >= 0 and Y >= 0 and X < w and Y < h and Indexed.is_body(px[Y * w + X]):
					out[y * w + x] = Indexed.OUTLINE
					break
	return Indexed.make(w, h, out)


static func inner_edges(img: Dictionary, buf: Dictionary) -> Dictionary:
	var w: int = img["w"]
	var h: int = img["h"]
	var px: PackedByteArray = img["px"]
	var group: PackedInt32Array = buf["group"]
	var depth: PackedFloat64Array = buf["depth"]
	var out := px.duplicate()
	for y in h:
		for x in w:
			var i := y * w + x
			if not Indexed.is_body(px[i]):
				continue
			for d in N4:
				var X: int = x + d[0]
				var Y: int = y + d[1]
				if X < 0 or Y < 0 or X >= w or Y >= h:
					continue
				var j := Y * w + X
				if not Indexed.is_body(px[j]) or group[j] == group[i]:
					continue
				if depth[j] - depth[i] > INNER_EDGE_DEPTH:
					out[i] = Indexed.RAMP0
					break
	return Indexed.make(w, h, out)
