## Randlicht nach Zielbild: Gegenlicht von hinten oben rechts. Linie an der Außenkante auf der Lichtseite:
## außen hell (RIM2), innen dunkler (RIM1); dünne Teile nur RIM1. Dazu Randlicht aus der Normalen.
## Kontaktschatten-Pixel bekommen kein Randlicht. Nahe am Boden (Füße) kein Randlicht.
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")

const RIM_DIR := [0.9, -0.5]
const RIM_OUTER := 3
const RIM_HI := 0.36
const RIM_LO := 0.18
const GROUND_CUTOFF := 18  # Pixel über foot_y ohne Randlicht


static func apply(img: Dictionary, buf: Dictionary, nrm: Dictionary, foot_y: int) -> Dictionary:
	var w: int = img["w"]
	var h: int = img["h"]
	var px: PackedByteArray = img["px"]
	var out := px.duplicate()
	var cover: PackedByteArray = buf["cover"]
	var nx: PackedFloat64Array = nrm["nx"]
	var ny: PackedFloat64Array = nrm["ny"]
	var nz: PackedFloat64Array = nrm["nz"]
	var depth: PackedFloat64Array = buf["depth"]
	var group: PackedInt32Array = buf["group"]
	var cutoff := foot_y - GROUND_CUTOFF
	for y in h:
		for x in w:
			var i := y * w + x
			if cover[i] == 0 or not Indexed.is_ramp(px[i]):
				continue
			# Kontaktschatten (dunkelste Stufe durch eine Gruppe davor) bleibt dunkel.
			var front := false
			for d in [[1, 0], [-1, 0], [0, 1], [0, -1]]:
				var X: int = x + d[0]
				var Y: int = y + d[1]
				if X < 0 or Y < 0 or X >= w or Y >= h:
					continue
				var j := Y * w + X
				if cover[j] == 1 and group[j] != group[i] and depth[j] - depth[i] > 2.5:
					front = true
					break
			if front:
				continue
			# Außenkante in Lichtrichtung suchen.
			var rim_k := 0
			for k in range(1, RIM_OUTER + 1):
				var sx := int(round(x + RIM_DIR[0] * k))
				var sy := int(round(y + RIM_DIR[1] * k))
				if sx < 0 or sy < 0 or sx >= w or sy >= h or cover[sy * w + sx] == 0:
					rim_k = k
					break
			var ox := int(round(x - RIM_DIR[0]))
			var oy := int(round(y - RIM_DIR[1]))
			var thin := ox < 0 or oy < 0 or ox >= w or oy >= h or cover[oy * w + ox] == 0
			if rim_k > 0 and y < cutoff:
				if rim_k == 1:
					out[i] = Indexed.RIM1 if thin else Indexed.RIM2
					continue
				if rim_k == 2 and not thin:
					out[i] = Indexed.RIM1
					continue
			var rim := (1.0 - nz[i]) * (1.0 - nz[i]) * maxf(0.0, nx[i] * RIM_DIR[0] + ny[i] * RIM_DIR[1] + 0.3)
			if rim > RIM_HI:
				out[i] = Indexed.RIM2
			elif rim > RIM_LO:
				out[i] = Indexed.RIM1
	return Indexed.make(w, h, out)
