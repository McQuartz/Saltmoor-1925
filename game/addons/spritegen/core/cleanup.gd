## Aufräumregeln auf dem Index-Bild. Port von tools/spritegen/core/cleanup.js.
## Jede Regel ist eine reine Funktion Bild -> Bild, liest nur das Eingabebild, schreibt in eine Kopie.
extends RefCounted

const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const N4 := [[1, 0], [-1, 0], [0, 1], [0, -1]]
const N8 := [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
const DEFAULT_ORDER := ["banding", "staircase", "orphans"]


static func _at(img: Dictionary, x: int, y: int) -> int:
	if x < 0 or y < 0 or x >= img["w"] or y >= img["h"]:
		return Indexed.TRANSPARENT
	return img["px"][y * img["w"] + x]


## Häufigster Wert unter den Kandidaten in der 8er-Nachbarschaft. Gleichstand: dunkler (kleiner).
static func _pick(img: Dictionary, x: int, y: int, candidates: Array) -> int:
	var uniq := []
	for c in candidates:
		if not uniq.has(c):
			uniq.append(c)
	uniq.sort()
	var best := -1
	var best_count := -1
	for c in uniq:
		var n := 0
		for d in N8:
			if _at(img, x + d[0], y + d[1]) == c:
				n += 1
		if n > best_count:
			best = c
			best_count = n
	return best


## Regel 1: Einzelpixel (Sporne, Kerben, einzelne Töne).
## Mit dither = true gilt die Ton-Regel nur bei Sprüngen von mindestens 2 Stufen (Dither erzeugt nur ±1).
static func rule_orphans(img: Dictionary, dither: bool = false) -> Dictionary:
	var w: int = img["w"]
	var out: PackedByteArray = img["px"].duplicate()
	for y in img["h"]:
		for x in w:
			var v := _at(img, x, y)
			var nb := []
			for d in N4:
				var n := _at(img, x + d[0], y + d[1])
				if Indexed.is_body(n):
					nb.append(n)
			if Indexed.is_body(v):
				if nb.size() <= 1:
					out[y * w + x] = Indexed.TRANSPARENT
				elif not nb.has(v):
					var far := true
					if dither:
						for nv in nb:
							if absi(nv - v) < 2:
								far = false
					if far:
						out[y * w + x] = _pick(img, x, y, nb)
			elif v == Indexed.TRANSPARENT and nb.size() >= 3:
				out[y * w + x] = _pick(img, x, y, nb)
	return Indexed.make(w, img["h"], out)


## Regel 2: Treppen glätten. Für "linke Kanten" umgesetzt; die anderen drei Ausrichtungen entstehen
## durch Spiegeln/Transponieren in einen Arbeitspuffer (U×V) und zurück.
static func _to_oriented(img: Dictionary, o: int) -> Array:
	var w: int = img["w"]
	var h: int = img["h"]
	var px: PackedByteArray = img["px"]
	var U := w if o < 2 else h
	var V := h if o < 2 else w
	var arr := PackedByteArray()
	arr.resize(U * V)
	var idx := PackedInt32Array()
	idx.resize(U * V)
	for v in V:
		for u in U:
			var x: int
			var y: int
			match o:
				0:
					x = u
					y = v
				1:
					x = w - 1 - u
					y = v
				2:
					x = v
					y = u
				_:
					x = v
					y = h - 1 - u
			arr[v * U + u] = px[y * w + x]
			idx[v * U + u] = y * w + x
	return [arr, idx, U, V]


## Treppenregel auf einem Arbeitspuffer mit linken Kanten. Gibt Liste von Änderungen [i, value].
static func _staircase_edits(arr: PackedByteArray, U: int, V: int) -> Array:
	var edge := PackedByteArray()
	edge.resize(U * V)
	for v in V:
		for u in U:
			var i := v * U + u
			if Indexed.is_body(arr[i]) and (u == 0 or not Indexed.is_body(arr[i - 1])):
				edge[i] = 1
	var succ := PackedInt32Array()
	succ.resize(U * V)
	succ.fill(-1)
	var claimed := PackedByteArray()
	claimed.resize(U * V)
	for v in V - 1:
		for u in U:
			if edge[v * U + u] == 0:
				continue
			for du in [0, -1, 1]:
				var nu: int = u + du
				if nu < 0 or nu >= U:
					continue
				var k: int = (v + 1) * U + nu
				if edge[k] == 1 and claimed[k] == 0:
					succ[v * U + u] = nu
					claimed[k] = 1
					break
	var edits := []
	for v in V:
		for u in U:
			var i0 := v * U + u
			if edge[i0] == 0 or claimed[i0] == 1:
				continue
			var runs := []  # [u, len, start]
			var cu := u
			var cv := v
			while true:
				if runs.size() > 0 and runs[-1][0] == cu:
					runs[-1][1] += 1
				else:
					runs.append([cu, 1, cv])
				var nxt := succ[cv * U + cu]
				if nxt < 0:
					break
				cu = nxt
				cv += 1
			for i in range(1, runs.size() - 1):
				var p: Array = runs[i - 1]
				var c: Array = runs[i]
				var n: Array = runs[i + 1]
				var s: int = c[0] - p[0]
				if c[1] != 1 or s == 0 or n[0] - c[0] != s:
					continue
				if mini(p[1], n[1]) < 2 or maxi(p[1], n[1]) < 3:
					continue
				var r: int
				var tu: int
				var remove: bool
				var from_u: int
				if p[1] >= n[1]:
					r = c[2] - 1
					remove = s > 0
					tu = p[0] if remove else p[0] - 1
					from_u = p[0]
				else:
					r = n[2]
					remove = s < 0
					tu = n[0] if remove else n[0] - 1
					from_u = n[0]
				var ti := r * U + tu
				if remove:
					# Nicht ausdünnen: nur entfernen, wenn innen weiter Körper ist.
					if tu + 1 < U and Indexed.is_body(arr[ti + 1]):
						edits.append([ti, Indexed.TRANSPARENT])
				elif tu >= 0 and arr[ti] == Indexed.TRANSPARENT:
					edits.append([ti, arr[r * U + from_u]])
	return edits


static func _staircase_one(img: Dictionary, o: int) -> Dictionary:
	var t := _to_oriented(img, o)
	var arr: PackedByteArray = t[0]
	var idx: PackedInt32Array = t[1]
	var out: PackedByteArray = img["px"].duplicate()
	for e in _staircase_edits(arr, t[2], t[3]):
		out[idx[e[0]]] = e[1]
	return Indexed.make(img["w"], img["h"], out)


static func rule_staircase(img: Dictionary) -> Dictionary:
	var cur := img
	for o in 4:
		cur = _staircase_one(cur, o)
	return cur


## Regel 3: Banding brechen. 1 px breiter Zwischenton zwischen zwei mindestens 2 px breiten Bändern.
static func rule_banding(img: Dictionary) -> Dictionary:
	var w: int = img["w"]
	var out: PackedByteArray = img["px"].duplicate()
	for y in img["h"]:
		for x in w:
			var v := _at(img, x, y)
			if not Indexed.is_body(v):
				continue
			var cands := []
			for ax_pair in [[[-1, 0], [1, 0]], [[0, -1], [0, 1]]]:
				var da: Array = ax_pair[0]
				var db: Array = ax_pair[1]
				var a := _at(img, x + da[0], y + da[1])
				var b := _at(img, x + db[0], y + db[1])
				if not Indexed.is_body(a) or not Indexed.is_body(b):
					continue
				if _at(img, x + 2 * da[0], y + 2 * da[1]) != a or _at(img, x + 2 * db[0], y + 2 * db[1]) != b:
					continue
				if (a < v and v < b) or (a > v and v > b):
					cands.append(a)
					cands.append(b)
			if cands.size() > 0:
				out[y * w + x] = _pick(img, x, y, cands)
	return Indexed.make(w, img["h"], out)


static func cleanup(img: Dictionary, enabled: Dictionary = {"orphans": true, "staircase": true, "banding": true}, dither: bool = false) -> Dictionary:
	var cur := img
	for name in DEFAULT_ORDER:
		if enabled.get(name, false):
			match name:
				"orphans": cur = rule_orphans(cur, dither)
				"staircase": cur = rule_staircase(cur)
				"banding": cur = rule_banding(cur)
	return cur
