## Animations-Sheet für einen Gegner rendern (eine Zeile je Animation) und Flacker-Maß ausgeben.
## godot --headless --path game --script res://addons/spritegen/cli/anim.gd -- [plan] [zone] [seed] [out] [scale] [still_amp]
extends SceneTree

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")
const Frames := preload("res://addons/spritegen/core/frames.gd")


func _init() -> void:
	var args := OS.get_cmdline_user_args()
	var plan: String = args[0] if args.size() > 0 else "biped"
	var zone: String = args[1] if args.size() > 1 else "hafen"
	var seed_value := int(args[2]) if args.size() > 2 else 1
	var out: String = args[3] if args.size() > 3 and args[3] != "-" else ProjectSettings.globalize_path("res://").path_join(
		"../docs/spritegen/sheets/M5/%s_%s_seed%d_anim.png" % [plan, zone, seed_value])
	var scale := int(args[4]) if args.size() > 4 else 2
	var genome := Genome.make(seed_value, plan, zone)
	var palette := Pipeline.load_palette(genome["palette"])
	var t0 := Time.get_ticks_msec()
	var sheet := Frames.to_sheet(genome, palette)
	var ms := Time.get_ticks_msec() - t0
	var img: Image = sheet["image"]
	# Nebel hinter jedes Bild, damit man es beurteilen kann.
	var fw: int = sheet["meta"]["frame_w"]
	var fh: int = sheet["meta"]["frame_h"]
	var bg := Image.create(img.get_width(), img.get_height(), false, Image.FORMAT_RGBA8)
	var fog := Pipeline.fog_background(fw, fh, palette, seed_value)
	for y in img.get_height() / fh:
		for x in img.get_width() / fw:
			bg.blit_rect(fog, Rect2i(0, 0, fw, fh), Vector2i(x * fw, y * fh))
	bg.blend_rect(img, Rect2i(0, 0, img.get_width(), img.get_height()), Vector2i(0, 0))
	bg.resize(bg.get_width() * scale, bg.get_height() * scale, Image.INTERPOLATE_NEAREST)
	DirAccess.make_dir_recursive_absolute(out.get_base_dir())
	bg.save_png(out)
	# Flacker-Maß "still": Idle mit kleiner Amplitude, zeigt reines Raster-Flackern.
	var still := Frames.render(genome, "idle", {"amp": 0.15})
	var fl_still := Frames.flicker_sequence(still, true)
	print(out)
	print("%d Bilder in %d ms (%.0f ms je Bild)" % [30, ms, ms / 30.0])
	for anim in sheet["meta"]["rows"].keys():
		print("  %s: %d Bilder, Flacker %.3f" % [anim, sheet["meta"]["rows"][anim]["frames"], sheet["meta"]["rows"][anim]["flicker"]])
	print("  idle still (amp 0.15): Flacker %.3f" % fl_still)
	quit()
