## Index-Bild {w, h, px: PackedByteArray}. Bis kurz vor Schluss wird mit Rampen-Indizes gearbeitet.
## 0 transparent, 1 Umriss (nur optional), 2..5 Körperrampe dunkel -> hell, 6 Randlicht innen, 7 Randlicht außen,
## 8 Auge, 9 Glühen.
extends RefCounted

const TRANSPARENT := 0
const OUTLINE := 1
const RAMP0 := 2
const RAMP_SIZE := 4
const RIM1 := 6
const RIM2 := 7
const EYE := 8
const GLOW := 9
const COUNT := 10

## Bayer 4×4, Werte (v + 0.5) / 16.
const BAYER := [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]


static func bayer(x: int, y: int) -> float:
	return (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16.0


static func is_body(v: int) -> bool:
	return v >= RAMP0


static func is_ramp(v: int) -> bool:
	return v >= RAMP0 and v < RAMP0 + RAMP_SIZE


static func make(w: int, h: int, px: PackedByteArray = PackedByteArray()) -> Dictionary:
	if px.is_empty():
		px.resize(w * h)
	return {"w": w, "h": h, "px": px}


## Wert 0..1 -> Rampenindex mit geordnetem Dither.
static func quantize(v: float, x: int, y: int, dither: bool = true) -> int:
	var t := clampf(v, 0.0, 0.9999) * (RAMP_SIZE - 1)
	var k := int(floor(t))
	var f := t - k
	var thr := bayer(x, y) if dither else 0.5
	return RAMP0 + mini(RAMP_SIZE - 1, k + 1 if f > thr else k)


## Aus Textzeilen für Regel-Tests: '.' transparent, 'o' Umriss, '0'..'3' Rampe, 'r'/'R' Randlicht, 'e' Auge, 'g' Glühen.
static func from_rows(rows: Array) -> Dictionary:
	var h := rows.size()
	var w: int = rows[0].length()
	var px := PackedByteArray()
	px.resize(w * h)
	for y in h:
		for x in w:
			var c: String = rows[y][x]
			var v := TRANSPARENT
			match c:
				".": v = TRANSPARENT
				"o": v = OUTLINE
				"r": v = RIM1
				"R": v = RIM2
				"e": v = EYE
				"g": v = GLOW
				_: v = RAMP0 + int(c)
			px[y * w + x] = v
	return make(w, h, px)


static func to_rows(img: Dictionary) -> Array:
	var rows := []
	var px: PackedByteArray = img["px"]
	for y in img["h"]:
		var s := ""
		for x in img["w"]:
			var v := px[y * img["w"] + x]
			match v:
				TRANSPARENT: s += "."
				OUTLINE: s += "o"
				RIM1: s += "r"
				RIM2: s += "R"
				EYE: s += "e"
				GLOW: s += "g"
				_: s += str(v - RAMP0)
		rows.append(s)
	return rows
