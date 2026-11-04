## Gemeinsame Helfer für Körperbaupläne. Punkte sind Arrays [x, y, z] (64-Bit-Floats).
## Koordinaten: x nach rechts, y nach unten, z zum Betrachter. Gegner blicken nach links (vorne = -x).
extends RefCounted


static func lerp(a: float, b: float, t: float) -> float:
	return a + (b - a) * t


static func bone(name: String, group: String, layer: String, a: Array, b: Array, r0: float, r1: float, tags: Array) -> Dictionary:
	return {"name": name, "group": group, "layer": layer, "a": a, "b": b, "r0": r0, "r1": r1, "tags": tags}


## Punkt in Richtung Winkel (0 = nach unten, PI = nach oben, positiv dreht nach vorne/links).
static func step(p: Array, angle: float, length: float) -> Array:
	return [p[0] - sin(angle) * length, p[1] + cos(angle) * length, p[2]]


## Zwei-Knochen-IK in der x/y-Ebene zwischen a und c. Das Gelenk liegt auf der Seite von bend ([bx, by]).
static func ik2(a: Array, c: Array, l1: float, l2: float, bend: Array) -> Array:
	var dx: float = c[0] - a[0]
	var dy: float = c[1] - a[1]
	var d := sqrt(dx * dx + dy * dy)
	if d < 1e-6:
		return [a[0], a[1] + l1, a[2]]
	var d_max := (l1 + l2) * 0.999
	var dd := minf(d, d_max)
	var t := (l1 * l1 - l2 * l2 + dd * dd) / (2.0 * dd)
	var hgt := sqrt(maxf(0.0, l1 * l1 - t * t))
	var ux := dx / d
	var uy := dy / d
	var px := -uy
	var py := ux
	if px * bend[0] + py * bend[1] < 0.0:
		px = -px
		py = -py
	return [a[0] + ux * t + px * hgt, a[1] + uy * t + py * hgt, a[2]]


## Kein Knochen unter den Boden.
static func floor_clamp(bones: Array, ground: float) -> void:
	for b in bones:
		for key in ["a", "b"]:
			var p: Array = b[key]
			var r: float = b["r0"] if key == "a" else b["r1"]
			if p[1] + r > ground:
				b[key] = [p[0], ground - r, p[2]]


## Schwerpunkt-x der Knochen mit Tag (für die Einpassung).
static func anchor_x(bones: Array, tag: String) -> float:
	var sx := 0.0
	var n := 0
	for b in bones:
		if b["tags"].has(tag):
			sx += (b["a"][0] + b["b"][0]) / 2.0
			n += 1
	if n == 0:
		for b in bones:
			sx += (b["a"][0] + b["b"][0]) / 2.0
			n += 1
	return sx / n


static func count(p01: float, lo: int, hi: int) -> int:
	return clampi(lo + int(floor(p01 * (hi - lo + 1))), lo, hi)
