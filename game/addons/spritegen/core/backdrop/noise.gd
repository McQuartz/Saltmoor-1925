## Rauschen für Hintergründe: Wert-Rauschen 2D, fBm, Domain Warping. Eigener Hash, deterministisch.
extends RefCounted

const Rng := preload("res://addons/spritegen/core/rng.gd")


static func hash01(ix: int, iy: int, seed_value: int) -> float:
	var h := Rng.mix32((ix * 374761393 + iy * 668265263 + seed_value * 1013904223) & 0xFFFFFFFF)
	return float(h) / 4294967296.0


static func _smooth(t: float) -> float:
	return t * t * (3.0 - 2.0 * t)


static func value(x: float, y: float, seed_value: int) -> float:
	var ix := int(floor(x))
	var iy := int(floor(y))
	var sx := _smooth(x - ix)
	var sy := _smooth(y - iy)
	var a := hash01(ix, iy, seed_value)
	var b := hash01(ix + 1, iy, seed_value)
	var c := hash01(ix, iy + 1, seed_value)
	var d := hash01(ix + 1, iy + 1, seed_value)
	return lerpf(lerpf(a, b, sx), lerpf(c, d, sx), sy)


static func fbm(x: float, y: float, seed_value: int, octaves: int = 4, gain: float = 0.5) -> float:
	var sum := 0.0
	var amp := 1.0
	var norm := 0.0
	var f := 1.0
	for o in octaves:
		sum += value(x * f, y * f, seed_value + o * 17) * amp
		norm += amp
		amp *= gain
		f *= 2.0
	return sum / norm


## Domain Warping: Koordinaten mit Rauschen verzerren, dann fBm. Gibt wolkige, organische Felder.
static func warped(x: float, y: float, seed_value: int, strength: float = 1.5) -> float:
	var wx := fbm(x + 3.1, y + 1.7, seed_value + 101, 3) - 0.5
	var wy := fbm(x - 2.3, y + 4.9, seed_value + 202, 3) - 0.5
	return fbm(x + wx * strength, y + wy * strength, seed_value, 4)
