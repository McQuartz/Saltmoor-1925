## Die ganze Kette: Genom -> Skelett -> Volumen -> Schattierung -> Aufräumregeln -> Umriss -> Image.
extends RefCounted

const Skeleton := preload("res://addons/spritegen/core/skeleton.gd")
const Raster := preload("res://addons/spritegen/core/raster.gd")
const Shade := preload("res://addons/spritegen/core/shade.gd")
const Cleanup := preload("res://addons/spritegen/core/cleanup.gd")
const Outline := preload("res://addons/spritegen/core/outline.gd")

const ALL_RULES := {"orphans": true, "staircase": true, "banding": true}


## opts: size (Dictionary), cleanup (bool), rules (Dictionary), inner_edges (bool)
static func generate(genome: Dictionary, opts: Dictionary = {}) -> Dictionary:
	var size: Dictionary = opts.get("size", Skeleton.DEFAULT_SIZE)
	var rules: Dictionary = opts.get("rules", ALL_RULES) if opts.get("cleanup", true) else {}
	var skeleton := Skeleton.build(genome, size)
	var buf := Raster.rasterize(skeleton)
	var shaded := Shade.shade(buf)
	var cleaned := Cleanup.cleanup(shaded, rules)
	var edged := cleaned if opts.get("inner_edges", true) == false else Outline.inner_edges(cleaned, buf)
	var final := Outline.outer_outline(edged)
	return {"skeleton": skeleton, "buf": buf, "shaded": shaded, "cleaned": cleaned, "image": final}


static func load_palette(name: String) -> Dictionary:
	var f := FileAccess.open("res://addons/spritegen/palettes/%s.json" % name, FileAccess.READ)
	return JSON.parse_string(f.get_as_text())


static func _hex(c: String) -> Array:
	return [c.substr(1, 2).hex_to_int(), c.substr(3, 2).hex_to_int(), c.substr(5, 2).hex_to_int(), 255]


## Index-Bild -> Image (RGBA8), erst ganz am Ende.
static func to_image(img: Dictionary, palette: Dictionary) -> Image:
	var lut := [[0, 0, 0, 0], _hex(palette["outline"])]
	for c in palette["ramp"]:
		lut.append(_hex(c))
	var px: PackedByteArray = img["px"]
	var data := PackedByteArray()
	data.resize(px.size() * 4)
	for i in px.size():
		var c: Array = lut[px[i]]
		data[i * 4] = c[0]
		data[i * 4 + 1] = c[1]
		data[i * 4 + 2] = c[2]
		data[i * 4 + 3] = c[3]
	return Image.create_from_data(img["w"], img["h"], false, Image.FORMAT_RGBA8, data)
