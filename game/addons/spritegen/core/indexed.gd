## Index-Bild {w, h, px: PackedByteArray}. Bis kurz vor Schluss wird mit Rampen-Indizes gearbeitet.
## 0 = transparent, 1 = Umriss, 2..5 = Rampe dunkel -> hell.
extends RefCounted

const TRANSPARENT := 0
const OUTLINE := 1
const RAMP0 := 2
const RAMP_SIZE := 4


static func is_body(v: int) -> bool:
	return v >= RAMP0


static func make(w: int, h: int, px: PackedByteArray = PackedByteArray()) -> Dictionary:
	if px.is_empty():
		px.resize(w * h)
	return {"w": w, "h": h, "px": px}


## Aus Textzeilen für Regel-Tests: '.' = transparent, 'o' = Umriss, '0'..'3' = Rampe.
static func from_rows(rows: Array) -> Dictionary:
	var h := rows.size()
	var w: int = rows[0].length()
	var px := PackedByteArray()
	px.resize(w * h)
	for y in h:
		for x in w:
			var c: String = rows[y][x]
			px[y * w + x] = TRANSPARENT if c == "." else (OUTLINE if c == "o" else RAMP0 + int(c))
	return make(w, h, px)


static func to_rows(img: Dictionary) -> Array:
	var rows := []
	var px: PackedByteArray = img["px"]
	for y in img["h"]:
		var s := ""
		for x in img["w"]:
			var v := px[y * img["w"] + x]
			s += "." if v == TRANSPARENT else ("o" if v == OUTLINE else str(v - RAMP0))
		rows.append(s)
	return rows
