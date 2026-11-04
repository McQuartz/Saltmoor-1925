## Deterministischer RNG (splitmix32), bitgleich zur JS-Referenz tools/spritegen/core/rng.js.
## GDScript-Ganzzahlen sind 64 Bit: nach jeder Operation auf 32 Bit maskieren.
## Nie randi()/randf(), nie Zeit.
extends RefCounted

const MASK := 0xFFFFFFFF

var state: int = 0


func _init(seed_value: int) -> void:
	state = seed_value & MASK


## 32-Bit-Multiplikation modulo 2^32 ohne 64-Bit-Überlauf (entspricht Math.imul >>> 0).
static func mul32(a: int, b: int) -> int:
	var lo := (a & 0xFFFF) * b
	var hi := (((a >> 16) * b) & 0xFFFF) << 16
	return (lo + hi) & MASK


static func mix32(z: int) -> int:
	z = mul32(z ^ (z >> 16), 0x85EBCA6B)
	z = mul32(z ^ (z >> 13), 0xC2B2AE35)
	return (z ^ (z >> 16)) & MASK


## FNV-1a über einen String, 32 Bit.
static func hash_string(s: String) -> int:
	var h := 0x811C9DC5
	for i in s.length():
		h ^= s.unicode_at(i)
		h = mul32(h, 0x01000193)
	return h


## Eigener Strom pro Name: neue Parameter verschieben die alten nicht.
func fork(name: String):
	return get_script().new(mix32((state ^ hash_string(name)) & MASK))


func next_u32() -> int:
	state = (state + 0x9E3779B9) & MASK
	return mix32(state)


## [0, 1), Auflösung 2^-32.
func next_float() -> float:
	return float(next_u32()) / 4294967296.0


func range_f(a: float, b: float) -> float:
	return a + (b - a) * next_float()
