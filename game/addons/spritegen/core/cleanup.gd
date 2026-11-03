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
static func rule_orphans(img: Dictionary) -> Dictionary:
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
					out[y * w + x] = _pick(img, x, y, nb)
			elif v == Indexed.TRANSPARENT and nb.size() >= 3:
				out[y * w + x] = _pick(img, x, y, nb)
	return Indexed.make(w, img["h"], out)


## Ausrichtungen für die Treppenregel: links, rechts, oben, unten.
static func _dims(o: int, w: int, h: int) -> Vector2i:
	return Vector2i(w, h) if o < 2 else Vector2i(h, w)


static func _map(o: int, u: int, v: int, w: int, h: int) -> Vector2i:
	match o:
		0: return Vector2i(u, v)
		1: return Vector2i(w - 1 - u, v)
		2: return Vector2i(v, u)
		_: return Vector2i(v, h - 1 - u)


static func _get_o(img: Dictionary, o: int, u: int, v: int) -> int:
	var d := _dims(o, img["w"], img["h"])
	if u < 0 or v < 0 or u >= d.x or v >= d.y:
		return Indexed.TRANSPARENT
	var p := _map(o, u, v, img["w"], img["h"])
	return img["px"][p.y * img["w"] + p.x]


static func _body_o(img: Dictionary, o: int, u: int, v: int) -> bool:
	return Indexed.is_body(_get_o(img, o, u, v))


static func _edge_o(img: Dictionary, o: int, u: int, v: int) -> bool:
	return _body_o(img, o, u, v) and not _body_o(img, o, u - 1, v)


## Regel 2 für eine Ausrichtung: Stufenfolge wie 4,1,4 an der Kante wird 3,2,4.
static func _staircase_one(img: Dictionary, o: int) -> Dictionary:
	var dim := _dims(o, img["w"], img["h"])
	var U := dim.x
	var V := dim.y
	var succ := {}
	var claimed := {}
	for v in V - 1:
		for u in U:
			if not _edge_o(img, o, u, v):
				continue
			for du in [0, -1, 1]:
				var k: int = (v + 1) * U + u + du
				if u + du >= 0 and u + du < U and _edge_o(img, o, u + du, v + 1) and not claimed.has(k):
					succ[v * U + u] = u + du
					claimed[k] = true
					break

	var edits := []
	for v in V:
		for u in U:
			if not _edge_o(img, o, u, v) or claimed.has(v * U + u):
				continue
			var chain := []
			var cu := u
			var cv := v
			while true:
				chain.append(cu)
				var k := cv * U + cu
				if not succ.has(k):
					break
				cu = succ[k]
				cv += 1
			var runs := []
			for i in chain.size():
				if runs.size() > 0 and runs[-1]["u"] == chain[i]:
					runs[-1]["len"] += 1
				else:
					runs.append({"u": chain[i], "len": 1, "start": v + i})
			for i in range(1, runs.size() - 1):
				var p: Dictionary = runs[i - 1]
				var c: Dictionary = runs[i]
				var n: Dictionary = runs[i + 1]
				var s: int = c["u"] - p["u"]
				if c["len"] != 1 or s == 0 or n["u"] - c["u"] != s:
					continue
				if mini(p["len"], n["len"]) < 2 or maxi(p["len"], n["len"]) < 3:
					continue
				if p["len"] >= n["len"]:
					var r: int = c["start"] - 1
					if s > 0:
						edits.append({"u": p["u"], "v": r, "op": "remove"})
					else:
						edits.append({"u": p["u"] - 1, "v": r, "op": "add", "fu": p["u"], "fv": r})
				else:
					var r: int = n["start"]
					if s > 0:
						edits.append({"u": n["u"] - 1, "v": r, "op": "add", "fu": n["u"], "fv": r})
					else:
						edits.append({"u": n["u"], "v": r, "op": "remove"})

	var w: int = img["w"]
	var out: PackedByteArray = img["px"].duplicate()
	for e in edits:
		var p := _map(o, e["u"], e["v"], w, img["h"])
		if e["op"] == "remove":
			if _body_o(img, o, e["u"] + 1, e["v"]):
				out[p.y * w + p.x] = Indexed.TRANSPARENT
		elif _get_o(img, o, e["u"], e["v"]) == Indexed.TRANSPARENT:
			out[p.y * w + p.x] = _get_o(img, o, e["fu"], e["fv"])
	return Indexed.make(w, img["h"], out)


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


static func cleanup(img: Dictionary, enabled: Dictionary = {"orphans": true, "staircase": true, "banding": true}) -> Dictionary:
	var cur := img
	for name in DEFAULT_ORDER:
		if enabled.get(name, false):
			match name:
				"orphans": cur = rule_orphans(cur)
				"staircase": cur = rule_staircase(cur)
				"banding": cur = rule_banding(cur)
	return cur
