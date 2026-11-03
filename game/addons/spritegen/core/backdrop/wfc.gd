## Wave Function Collapse (Overlapping Model, N×N-Muster) aus einem kleinen eigenen Beispiel.
## Beispiel = Textzeilen mit Ziffern (Farbindizes). Lernt, welche Muster nebeneinander vorkommen,
## und füllt ein Raster so, dass lokal nur bekannte Nachbarschaften entstehen. Eigener RNG, deterministisch.
## Bei Widerspruch: Neustart mit nächstem Seed (max. 8 Versuche), danach Rückfall auf gekacheltes Beispiel.
extends RefCounted

const Rng := preload("res://addons/spritegen/core/rng.gd")

var N := 2
var patterns: Array = []          # je Muster: PackedByteArray N*N
var weights := PackedFloat64Array()
var compat: Array = []            # compat[p][dir] = PackedInt32Array erlaubter Nachbarn
const DIRS := [[1, 0], [-1, 0], [0, 1], [0, -1]]


func _init(sample_rows: Array, n: int = 2, symmetry: bool = true) -> void:
	N = n
	var h := sample_rows.size()
	var w: int = sample_rows[0].length()
	var sample := PackedByteArray()
	sample.resize(w * h)
	for y in h:
		for x in w:
			sample[y * w + x] = int(sample_rows[y][x])
	var index := {}
	for y in h:
		for x in w:
			var variants := [_extract(sample, w, h, x, y)]
			if symmetry:
				variants.append(_mirror(variants[0]))
			for p in variants:
				var key: String = p.hex_encode()
				if index.has(key):
					weights[index[key]] += 1.0
				else:
					index[key] = patterns.size()
					patterns.append(p)
					weights.append(1.0)
	for a in patterns.size():
		var row := []
		for d in DIRS:
			var ok := PackedInt32Array()
			for b in patterns.size():
				if _agrees(patterns[a], patterns[b], d[0], d[1]):
					ok.append(b)
			row.append(ok)
		compat.append(row)


func _extract(sample: PackedByteArray, w: int, h: int, x: int, y: int) -> PackedByteArray:
	var p := PackedByteArray()
	p.resize(N * N)
	for j in N:
		for i in N:
			p[j * N + i] = sample[posmod(y + j, h) * w + posmod(x + i, w)]
	return p


func _mirror(p: PackedByteArray) -> PackedByteArray:
	var m := PackedByteArray()
	m.resize(N * N)
	for j in N:
		for i in N:
			m[j * N + i] = p[j * N + (N - 1 - i)]
	return m


## Stimmen Muster a und b überein, wenn b um (dx, dy) verschoben liegt?
func _agrees(a: PackedByteArray, b: PackedByteArray, dx: int, dy: int) -> bool:
	var x0 := maxi(0, dx)
	var x1 := mini(N, N + dx)
	var y0 := maxi(0, dy)
	var y1 := mini(N, N + dy)
	for y in range(y0, y1):
		for x in range(x0, x1):
			if a[y * N + x] != b[(y - dy) * N + (x - dx)]:
				return false
	return true


## Raster w×h aus Farbindizes. Gibt PackedByteArray oder leer bei Scheitern.
func generate(w: int, h: int, seed_value: int) -> PackedByteArray:
	for attempt in 8:
		var out := _run(w, h, seed_value + attempt * 7919)
		if not out.is_empty():
			return out
	return PackedByteArray()


func _run(w: int, h: int, seed_value: int) -> PackedByteArray:
	var P := patterns.size()
	var n := w * h
	var rng = Rng.new(seed_value)
	# wave[i] = Array of bool je Muster (als PackedByteArray), count[i] = Zahl möglicher Muster
	var wave := []
	var count := PackedInt32Array()
	count.resize(n)
	for i in n:
		var all := PackedByteArray()
		all.resize(P)
		all.fill(1)
		wave.append(all)
		count[i] = P
	var stack := PackedInt32Array()
	var done := 0
	while done < n:
		# Zelle mit kleinster Entropie (wenigste Möglichkeiten > 1), Gleichstand per RNG.
		var best := -1
		var best_c := P + 1
		var best_r := 0.0
		for i in n:
			var c := count[i]
			if c <= 1:
				continue
			var r := rng.next_float() * 0.01
			if c + r < best_c + best_r:
				best = i
				best_c = c
				best_r = r
		if best < 0:
			break
		# Muster gewichtet wählen.
		var cell: PackedByteArray = wave[best]
		var total := 0.0
		for p in P:
			if cell[p] == 1:
				total += weights[p]
		var pick := rng.next_float() * total
		var chosen := -1
		for p in P:
			if cell[p] == 1:
				pick -= weights[p]
				if pick <= 0.0:
					chosen = p
					break
		if chosen < 0:
			for p in range(P - 1, -1, -1):
				if cell[p] == 1:
					chosen = p
					break
		for p in P:
			cell[p] = 1 if p == chosen else 0
		count[best] = 1
		stack.append(best)
		# Propagieren.
		while stack.size() > 0:
			var i := stack[stack.size() - 1]
			stack.resize(stack.size() - 1)
			var x := i % w
			var y := i / w
			var src: PackedByteArray = wave[i]
			for di in DIRS.size():
				var d: Array = DIRS[di]
				var X: int = x + d[0]
				var Y: int = y + d[1]
				if X < 0 or Y < 0 or X >= w or Y >= h:
					continue
				var j := Y * w + X
				var dst: PackedByteArray = wave[j]
				if count[j] <= 1 and count[j] > 0 and false:
					continue
				var changed := false
				for q in P:
					if dst[q] == 0:
						continue
					# q bleibt, wenn irgendein in src mögliches Muster p es als Nachbar in Richtung d erlaubt.
					var supported := false
					var back: PackedInt32Array = compat[q][di ^ 1]  # Gegenrichtung
					for p in back:
						if src[p] == 1:
							supported = true
							break
					if not supported:
						dst[q] = 0
						count[j] -= 1
						changed = true
				if count[j] == 0:
					return PackedByteArray()
				if changed:
					stack.append(j)
		done = 0
		for i in n:
			if count[i] == 1:
				done += 1
	var out := PackedByteArray()
	out.resize(n)
	for i in n:
		var cell: PackedByteArray = wave[i]
		for p in P:
			if cell[p] == 1:
				out[i] = patterns[p][0]
				break
	return out
