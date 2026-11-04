## Oberfläche im Körperraum: Rauschen auf (u, v, Knochen) statt auf Bildkoordinaten, damit Muster
## in jeder Pose an derselben Körperstelle sitzen. Muster je Zone: skin (Flecken), scales (Zellen), slime (Glanz).
## Wucherungen per Zellautomat auf der Körpermaske. Ergebnis: Wert-Offsets (vor dem Dither addiert) und Masken.
extends RefCounted

const Rng := preload("res://addons/spritegen/core/rng.gd")
const Genome := preload("res://addons/spritegen/core/genome.gd")

const U_SCALE := 6.0      # Zellen entlang eines Knochens
const V_SCALE := 10.0     # Zellen um den Knochen herum


## Hash -> 0..1 aus Ganzzahlkoordinaten und Seed.
static func hash01(ix: int, iy: int, iz: int, seed_value: int) -> float:
	var h := Rng.mix32((ix * 374761393 + iy * 668265263 + iz * 2147483647 + seed_value) & 0xFFFFFFFF)
	return float(h) / 4294967296.0


static func _smooth(t: float) -> float:
	return t * t * (3.0 - 2.0 * t)


## Wert-Rauschen 3D (v-Achse periodisch mit Periode `vp`, damit der Umlauf um den Knochen nahtlos ist).
static func value_noise(x: float, y: float, z: int, seed_value: int, vp: int) -> float:
	var ix := int(floor(x))
	var iy := int(floor(y))
	var fx := x - ix
	var fy := y - iy
	var sx := _smooth(fx)
	var sy := _smooth(fy)
	var iy0 := posmod(iy, vp)
	var iy1 := posmod(iy + 1, vp)
	var a := hash01(ix, iy0, z, seed_value)
	var b := hash01(ix + 1, iy0, z, seed_value)
	var c := hash01(ix, iy1, z, seed_value)
	var d := hash01(ix + 1, iy1, z, seed_value)
	return lerpf(lerpf(a, b, sx), lerpf(c, d, sx), sy)


static func fbm(x: float, y: float, z: int, seed_value: int, vp: int) -> float:
	return value_noise(x, y, z, seed_value, vp) * 0.65 + value_noise(x * 2.0, y * 2.0, z, seed_value + 101, vp * 2) * 0.35


## Liefert {offset: PackedFloat64Array, growth: PackedByteArray, pattern: String}.
static func compute(buf: Dictionary, genome: Dictionary) -> Dictionary:
	var w: int = buf["w"]
	var h: int = buf["h"]
	var n := w * h
	var cover: PackedByteArray = buf["cover"]
	var bone: PackedInt32Array = buf["bone"]
	var bu: PackedFloat64Array = buf["u"]
	var bv: PackedFloat64Array = buf["v"]
	var p: Dictionary = genome["params"]
	var strength: float = p.get("pattern", 0.5)
	var growth_p: float = p.get("growth", 0.0)
	var seed_value: int = Rng.hash_string("surface:%d" % genome["seed"])
	var pattern: String = Genome.zones_def().get(genome["zone"], {}).get("surface", "skin")
	var offset := PackedFloat64Array()
	offset.resize(n)
	var seed_cells := PackedByteArray()
	seed_cells.resize(n)
	var vp := int(V_SCALE)
	for i in n:
		if cover[i] == 0:
			continue
		var bi := bone[i]
		var x := bu[i] * U_SCALE
		var y := bv[i] * V_SCALE
		var o := 0.0
		match pattern:
			"skin":
				var nz := fbm(x, y, bi, seed_value, vp)
				o = (nz - 0.5) * 0.3
				if value_noise(x * 1.7, y * 1.7, bi, seed_value + 7, vp * 2) > 0.74:
					o -= 0.2
			"scales":
				var cy := y * 1.2
				var row := int(floor(cy))
				var cx := x * 1.4 + (0.5 if row % 2 == 1 else 0.0)
				var fx: float = cx - floor(cx)
				var fy: float = cy - floor(cy)
				var edge := minf(minf(fx, 1.0 - fx) * 2.0, minf(fy, 1.0 - fy) * 2.0)
				o = -0.22 if edge < 0.28 else 0.06 * (1.0 - edge)
				o += (value_noise(x, y, bi, seed_value, vp) - 0.5) * 0.1
			"slime":
				var nz := fbm(x * 0.6, y * 2.0, bi, seed_value, vp * 2)
				o = (nz - 0.5) * 0.15
				if nz > 0.68:
					o += 0.35
		offset[i] = o * strength * 2.0
		if growth_p > 0.05 and value_noise(x * 1.6, y * 1.6, bi, seed_value + 31, vp * 2) > 1.0 - growth_p * 0.5:
			seed_cells[i] = 1
	# Wucherungen: Zellautomat (4-5-Regel) auf der Körpermaske, 3 Schritte.
	var growth := seed_cells
	for _step in 3:
		var nxt := PackedByteArray()
		nxt.resize(n)
		for y in h:
			for x in w:
				var i := y * w + x
				if cover[i] == 0:
					continue
				var cnt := 0
				for dy in range(-1, 2):
					for dx in range(-1, 2):
						if dx == 0 and dy == 0:
							continue
						var X := x + dx
						var Y := y + dy
						if X >= 0 and Y >= 0 and X < w and Y < h and growth[Y * w + X] == 1:
							cnt += 1
				if (growth[i] == 1 and cnt >= 3) or (growth[i] == 0 and cnt >= 5):
					nxt[i] = 1
		growth = nxt
	# Beule: oben heller, unten dunkler.
	for y in h:
		for x in w:
			var i := y * w + x
			if growth[i] == 0:
				continue
			var up := y > 0 and growth[i - w] == 1
			var down := y < h - 1 and growth[i + w] == 1
			if not up:
				offset[i] += 0.3
			elif not down:
				offset[i] -= 0.3
			else:
				offset[i] += 0.05
	return {"offset": offset, "growth": growth, "pattern": pattern}
