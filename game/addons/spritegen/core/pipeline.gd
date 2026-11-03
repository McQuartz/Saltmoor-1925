## Die ganze Kette: Genom -> Skelett(Pose) -> Rastern (2D-Feld, Fase, Tiefe, Körperkoordinaten)
## -> Oberfläche (Wert-Offsets im Körperraum) -> Schattierung + Dither -> Aufräumregeln -> Randlicht
## -> Details (Augen, Maul, Markierungen) -> Korrekturen (fixes) -> Image.
extends RefCounted

const Plans := preload("res://addons/spritegen/core/plans.gd")
const Raster := preload("res://addons/spritegen/core/raster.gd")
const Shade := preload("res://addons/spritegen/core/shade.gd")
const Surface := preload("res://addons/spritegen/core/surface.gd")
const Cleanup := preload("res://addons/spritegen/core/cleanup.gd")
const Rim := preload("res://addons/spritegen/core/rim.gd")
const Details := preload("res://addons/spritegen/core/details.gd")
const Outline := preload("res://addons/spritegen/core/outline.gd")
const Indexed := preload("res://addons/spritegen/core/indexed.gd")

const ALL_RULES := {"orphans": true, "staircase": true, "banding": false}


## opts: size, pose {anim, t, amp}, cleanup (bool), rules, dither (bool), rim (bool), surface (bool),
## details (bool), outline (bool), frame (String "anim:n" für Bild-Korrekturen)
static func generate(genome: Dictionary, opts: Dictionary = {}) -> Dictionary:
	var size: Dictionary = opts.get("size", {})
	var rules: Dictionary = opts.get("rules", ALL_RULES) if opts.get("cleanup", true) else {}
	var dither: bool = opts.get("dither", true)
	var skeleton := Plans.build(genome, opts.get("pose", Plans.REST_POSE), size)
	var buf := Raster.rasterize(skeleton)
	var nrm := Shade.normals(buf)
	var offset := PackedFloat64Array()
	var surf := {}
	if opts.get("surface", true):
		surf = Surface.compute(buf, genome)
		offset = surf["offset"]
	var vals := Shade.values(buf, nrm, offset)
	var shaded := Shade.quantize(buf, vals, dither)
	var cleaned := Cleanup.cleanup(shaded, rules, dither)
	var lit := Rim.apply(cleaned, buf, nrm, skeleton["size"]["foot_y"]) if opts.get("rim", true) else cleaned
	var detailed := Details.apply(lit, buf, genome, surf) if opts.get("details", true) else lit
	var fixed := Details.apply_fixes(detailed, buf, genome, opts.get("frame", ""))
	var final: Dictionary = Outline.outer_outline(fixed) if opts.get("outline", false) else fixed
	return {"skeleton": skeleton, "buf": buf, "normals": nrm, "values": vals, "shaded": shaded,
		"cleaned": cleaned, "image": final}


static func load_palette(name: String) -> Dictionary:
	var f := FileAccess.open("res://addons/spritegen/palettes/%s.json" % name, FileAccess.READ)
	assert(f != null, "Palette %s fehlt" % name)
	return JSON.parse_string(f.get_as_text())


static func hex(c: String) -> Color:
	return Color.html(c)


## Farbtabelle je Index.
static func lut(palette: Dictionary) -> Array:
	var out := []
	out.resize(Indexed.COUNT)
	out[Indexed.TRANSPARENT] = Color(0, 0, 0, 0)
	out[Indexed.OUTLINE] = hex(palette["body"][0]).darkened(0.5)
	for i in Indexed.RAMP_SIZE:
		out[Indexed.RAMP0 + i] = hex(palette["body"][i])
	out[Indexed.RIM1] = hex(palette["rim"][0])
	out[Indexed.RIM2] = hex(palette["rim"][1])
	out[Indexed.EYE] = hex(palette["eye"])
	out[Indexed.GLOW] = hex(palette["glow"])
	return out


## Index-Bild -> Image (RGBA8), erst ganz am Ende.
static func to_image(img: Dictionary, palette: Dictionary) -> Image:
	var table := lut(palette)
	var px: PackedByteArray = img["px"]
	var data := PackedByteArray()
	data.resize(px.size() * 4)
	for i in px.size():
		var c: Color = table[px[i]]
		data[i * 4] = int(c.r * 255.0 + 0.5)
		data[i * 4 + 1] = int(c.g * 255.0 + 0.5)
		data[i * 4 + 2] = int(c.b * 255.0 + 0.5)
		data[i * 4 + 3] = int(c.a * 255.0 + 0.5)
	return Image.create_from_data(img["w"], img["h"], false, Image.FORMAT_RGBA8, data)


## Nebel-Hintergrund in Zonenfarbe (Darstellung, nicht Teil des Sprites): unten dunkler, hinter der Figur heller, gedithert.
static func fog_background(w: int, h: int, palette: Dictionary, seed_value: int = 0) -> Image:
	var fog: Array = palette["fog"]
	var cols := [hex(fog[0]), hex(fog[1]), hex(fog[2])]
	var img := Image.create(w, h, false, Image.FORMAT_RGBA8)
	for y in h:
		for x in w:
			var fx := (x + 0.5) / w - 0.5
			var fy := (y + 0.5) / h
			var v := 0.55 - fy * 0.5 + 0.45 * maxf(0.0, 1.0 - sqrt(fx * fx * 2.5 + (fy - 0.45) * (fy - 0.45) * 1.5) * 1.6)
			v += 0.08 * sin((x + seed_value * 7) * 0.21) * sin(y * 0.17)
			var t := clampf(v, 0.0, 0.9999) * 2.0
			var k := int(floor(t))
			var f := t - k
			var c: Color = cols[mini(2, k + 1 if f > Indexed.bayer(x, y) else k)]
			img.set_pixel(x, y, c)
	return img
