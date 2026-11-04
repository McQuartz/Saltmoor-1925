## Außenumriss (nach Zielbild standardmäßig aus; bleibt als Option und für Regel-Tests).
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const N4 := [[1, 0], [-1, 0], [0, 1], [0, -1]]


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
