## Schattierung nach Zielbild: Normale aus dem Höhenfeld (Fase), Lambert-Licht, Kontaktschatten,
## Ton je Material (Gesicht heller), Oberflächen-Offsets aus der Surface-Stufe, dann Rampe mit Bayer-Dither.
## Liefert zuerst ein Wertfeld 0..1 (value) und daraus das Index-Bild.
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")

const LIGHT := [-0.6, -0.7, 0.6]
const BASE := 0.02
const DIFFUSE := 0.75
const FACE_TONE := 0.25
const CONTACT_DEPTH := 2.5


static func light() -> Array:
	var l := sqrt(LIGHT[0] * LIGHT[0] + LIGHT[1] * LIGHT[1] + LIGHT[2] * LIGHT[2])
	return [LIGHT[0] / l, LIGHT[1] / l, LIGHT[2] / l]


## Normalen aus Höhendifferenzen innerhalb derselben Gruppe. Gibt {nx, ny, nz} als PackedFloat64Array.
static func normals(buf: Dictionary) -> Dictionary:
	var w: int = buf["w"]
	var h: int = buf["h"]
	var n := w * h
	var cover: PackedByteArray = buf["cover"]
	var hgt: PackedFloat64Array = buf["height"]
	var group: PackedInt32Array = buf["group"]
	var nx := PackedFloat64Array()
	nx.resize(n)
	var ny := PackedFloat64Array()
	ny.resize(n)
	var nz := PackedFloat64Array()
	nz.resize(n)
	for y in h:
		for x in w:
			var i := y * w + x
			if cover[i] == 0:
				continue
			var g := group[i]
			var zl := hgt[i - 1] if x > 0 and cover[i - 1] == 1 and group[i - 1] == g else 0.0
			var zr := hgt[i + 1] if x < w - 1 and cover[i + 1] == 1 and group[i + 1] == g else 0.0
			var zu := hgt[i - w] if y > 0 and cover[i - w] == 1 and group[i - w] == g else 0.0
			var zd := hgt[i + w] if y < h - 1 and cover[i + w] == 1 and group[i + w] == g else 0.0
			var vx := -(zr - zl) / 2.0
			var vy := -(zd - zu) / 2.0
			var l := sqrt(vx * vx + vy * vy + 1.0)
			nx[i] = vx / l
			ny[i] = vy / l
			nz[i] = 1.0 / l
	return {"nx": nx, "ny": ny, "nz": nz}


## Kontaktschatten: Nachbarpixel gehört zu einer anderen Gruppe, die deutlich weiter vorne liegt.
static func contact(buf: Dictionary) -> PackedByteArray:
	var w: int = buf["w"]
	var h: int = buf["h"]
	var cover: PackedByteArray = buf["cover"]
	var depth: PackedFloat64Array = buf["depth"]
	var group: PackedInt32Array = buf["group"]
	var out := PackedByteArray()
	out.resize(w * h)
	for y in h:
		for x in w:
			var i := y * w + x
			if cover[i] == 0:
				continue
			for d in [[1, 0], [-1, 0], [0, 1], [0, -1]]:
				var X: int = x + d[0]
				var Y: int = y + d[1]
				if X < 0 or Y < 0 or X >= w or Y >= h:
					continue
				var j := Y * w + X
				if cover[j] == 1 and group[j] != group[i] and depth[j] - depth[i] > CONTACT_DEPTH:
					out[i] = 1
					break
	return out


## Wertfeld 0..1 je Pixel. surface_offset: optionales PackedFloat64Array (aus der Surface-Stufe), wird addiert.
static func values(buf: Dictionary, nrm: Dictionary, surface_offset: PackedFloat64Array = PackedFloat64Array()) -> PackedFloat64Array:
	var L := light()
	var w: int = buf["w"]
	var h: int = buf["h"]
	var n := w * h
	var cover: PackedByteArray = buf["cover"]
	var bone: PackedInt32Array = buf["bone"]
	var tags: Array = buf["tags"]
	var nx: PackedFloat64Array = nrm["nx"]
	var ny: PackedFloat64Array = nrm["ny"]
	var nz: PackedFloat64Array = nrm["nz"]
	var con := contact(buf)
	var vals := PackedFloat64Array()
	vals.resize(n)
	for i in n:
		if cover[i] == 0:
			continue
		if con[i] == 1:
			vals[i] = 0.0
			continue
		var diff := maxf(0.0, nx[i] * L[0] + ny[i] * L[1] + nz[i] * L[2])
		var v := BASE + diff * DIFFUSE
		if bone[i] >= 0 and tags[bone[i]].has("head"):
			v += FACE_TONE
		if surface_offset.size() == n:
			v += surface_offset[i]
		vals[i] = clampf(v, 0.0, 1.0)
	return vals


static func quantize(buf: Dictionary, vals: PackedFloat64Array, dither: bool = true) -> Dictionary:
	var w: int = buf["w"]
	var h: int = buf["h"]
	var cover: PackedByteArray = buf["cover"]
	var px := PackedByteArray()
	px.resize(w * h)
	for y in h:
		for x in w:
			var i := y * w + x
			if cover[i] == 1:
				px[i] = Indexed.quantize(vals[i], x, y, dither)
	return Indexed.make(w, h, px)


## Bequemlichkeit: ganze Stufe ohne Oberfläche.
static func shade(buf: Dictionary, dither: bool = true) -> Dictionary:
	return quantize(buf, values(buf, normals(buf)), dither)
