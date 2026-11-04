## Hintergründe (Grundstufe M6): Himmel/Nebel aus Rauschen, Silhouetten aus Rauschen, Mauer/Boden per WFC
## aus kleinen eigenen Beispielkacheln. Ausgabe als Ebenen (für Parallax) und als Gesamtbild.
## Farben: Zonenpalette (body 0..3 dunkel, fog 0..2 heller), mit Bayer-Dither. Deterministisch je Seed.
extends RefCounted

const Nz := preload("res://addons/spritegen/core/backdrop/noise.gd")
const WFC := preload("res://addons/spritegen/core/backdrop/wfc.gd")
const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")

## Eigene Beispielkacheln (Ziffern = Farbstufe 0..3 der Körperpalette). Klein, von uns, keine fremden Assets.
const SAMPLES := {
	"ziegel": [
		"11111111",
		"12222122",
		"12222122",
		"11111111",
		"22122221",
		"22122221",
	],
	"stein": [
		"1111111111",
		"1222211221",
		"1222211221",
		"1111111221",
		"1221111111",
		"1221122221",
		"1111122221",
	],
	"planken": [
		"222222222222",
		"111111111111",
		"222222222222",
		"222222222222",
		"111111111111",
		"333333333333",
	],
	"fels": [
		"0001100",
		"0011110",
		"0111111",
		"0011110",
		"1100011",
		"1000001",
	],
}

const ZONE_STYLE := {
	"hafen": {"wall": "planken", "wall_h": 40, "pillars": 0.6, "water": true},
	"wald": {"wall": "", "wall_h": 0, "pillars": 1.0, "water": false},
	"kapelle": {"wall": "stein", "wall_h": 70, "pillars": 0.8, "water": false},
	"grund": {"wall": "fels", "wall_h": 60, "pillars": 0.3, "water": false},
}


static func _pick(cols: Array, v: float, x: int, y: int) -> Color:
	var t := clampf(v, 0.0, 0.9999) * (cols.size() - 1)
	var k := int(floor(t))
	var f := t - k
	return cols[mini(cols.size() - 1, k + 1 if f > Indexed.bayer(x, y) else k)]


## Gibt {layers: [{name, image, parallax}], composite: Image}.
static func render(zone: String, seed_value: int, w: int = 480, h: int = 270) -> Dictionary:
	var palette := Pipeline.load_palette(zone if zone != "mix" else "hafen")
	var body: Array = palette["body"].map(func(c): return Color.html(c))
	var fog: Array = palette["fog"].map(func(c): return Color.html(c))
	var style: Dictionary = ZONE_STYLE.get(zone, ZONE_STYLE["hafen"])
	var layers := []

	# 1. Himmel/Nebel: Verlauf + verzerrtes Rauschen, hinten hell, oben dunkler.
	var sky := Image.create(w, h, false, Image.FORMAT_RGBA8)
	var cols := [body[0], body[1], fog[0], fog[1], fog[2]]
	for y in h:
		for x in w:
			var n := Nz.warped(x / 90.0, y / 70.0, seed_value, 2.0)
			var v := 0.25 + 0.5 * (1.0 - absf(y / float(h) - 0.55) * 1.6) + (n - 0.5) * 0.6
			sky.set_pixel(x, y, _pick(cols, v, x, y))
	layers.append({"name": "himmel", "image": sky, "parallax": 0.1})

	# 2. Silhouetten: Säulen/Masten/Stämme aus Rauschen (Breite und Lücken), nur dunkle Stufen.
	var sil := Image.create(w, h, false, Image.FORMAT_RGBA8)
	var density: float = style["pillars"]
	var x := 0
	var rng_x := seed_value * 31
	while x < w:
		var gap := int(20 + Nz.hash01(x, 1, rng_x) * 90 * (1.5 - density))
		var width := int(3 + Nz.hash01(x, 2, rng_x) * 10)
		var top := int(h * (0.05 + Nz.hash01(x, 3, rng_x) * 0.35))
		var ground_y: int = h - style["wall_h"] - 10 if style["wall_h"] > 0 else h - 30
		for yy in range(top, ground_y):
			var wobble := int(round(sin(yy * 0.08 + x) * 1.5 * (1.0 - density)))
			for i in width:
				var xx := x + i + wobble
				if xx >= 0 and xx < w:
					var depth := 0.35 + 0.3 * Nz.value(xx / 8.0, yy / 8.0, seed_value + 5)
					sil.set_pixel(xx, yy, _pick([body[0], body[1], body[2]], depth, xx, yy))
			# Äste im Wald
			if zone == "wald" and yy % 23 == 0 and Nz.hash01(x, yy, rng_x) > 0.5:
				var dir := 1 if Nz.hash01(x, yy + 1, rng_x) > 0.5 else -1
				var blen := int(6 + Nz.hash01(x, yy + 2, rng_x) * 18)
				for k in blen:
					var bx := x + (width / 2) + dir * k
					var by := yy - k / 2
					if bx >= 0 and bx < w and by >= 0:
						sil.set_pixel(bx, by, body[1])
		x += width + gap
	layers.append({"name": "silhouetten", "image": sil, "parallax": 0.4})

	# 3. Mauer/Boden per WFC aus Beispielkacheln, als Streifen unten.
	if style["wall"] != "":
		var wall := Image.create(w, h, false, Image.FORMAT_RGBA8)
		var wh: int = style["wall_h"]
		var seg_w := 64
		var wfc = WFC.new(SAMPLES[style["wall"]], 2, style["wall"] != "planken")
		var seg := wfc.generate(seg_w, wh, seed_value)
		if seg.is_empty():
			# Rückfall: Beispiel kacheln.
			var rows: Array = SAMPLES[style["wall"]]
			seg.resize(seg_w * wh)
			for yy in wh:
				for xx in seg_w:
					seg[yy * seg_w + xx] = int(rows[yy % rows.size()][xx % rows[0].length()])
		for yy in wh:
			for xx in w:
				var sx := xx % seg_w
				# jedes zweite Segment gespiegelt, damit die Naht nicht springt
				if (xx / seg_w) % 2 == 1:
					sx = seg_w - 1 - sx
				var idx := seg[yy * seg_w + sx]
				var shade := 1.0 - yy / float(wh) * 0.5
				var c: Color = body[clampi(idx, 0, 3)]
				wall.set_pixel(xx, h - wh + yy, c.darkened(1.0 - shade) if yy > wh * 0.6 else c)
		layers.append({"name": "mauer", "image": wall, "parallax": 0.8})

	# 4. Wasser (Hafen): Wellen aus Rauschen, hell gedithert.
	if style["water"]:
		var water := Image.create(w, h, false, Image.FORMAT_RGBA8)
		var wy0 := h - 22
		for yy in range(wy0, h):
			for xx in w:
				var n := Nz.value(xx / 14.0 + yy * 0.3, yy / 3.0, seed_value + 9)
				var v := 0.2 + (n - 0.5) * 0.9 + (yy - wy0) / 22.0 * 0.3
				water.set_pixel(xx, yy, _pick([body[0], body[1], fog[0], fog[1]], v, xx, yy))
		layers.append({"name": "wasser", "image": water, "parallax": 1.0})

	# 5. Bodennebel vorne: Rauschen, nur die hellen Nebelstufen, mit Alpha-Dither.
	var mist := Image.create(w, h, false, Image.FORMAT_RGBA8)
	for yy in range(h - 70, h):
		for xx in w:
			var n := Nz.warped(xx / 60.0, yy / 25.0, seed_value + 77, 1.2)
			var a := clampf((yy - (h - 70)) / 70.0 * 1.2 - 0.2 + (n - 0.5) * 0.9, 0.0, 1.0)
			if a > Indexed.bayer(xx, yy):
				mist.set_pixel(xx, yy, fog[1] if n > 0.55 else fog[0])
	layers.append({"name": "bodennebel", "image": mist, "parallax": 1.2})

	var comp := Image.create(w, h, false, Image.FORMAT_RGBA8)
	for l in layers:
		comp.blend_rect(l["image"], Rect2i(0, 0, w, h), Vector2i(0, 0))
	return {"layers": layers, "composite": comp, "palette": palette}
