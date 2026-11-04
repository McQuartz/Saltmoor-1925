## Hintergrund je Zone rendern, mit einem generierten Gegner davor.
## godot --headless --path game --script res://addons/spritegen/cli/backdrop.gd -- [zone|all] [seed] [outdir]
extends SceneTree

const Backdrop := preload("res://addons/spritegen/core/backdrop/backdrop.gd")
const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")


func _init() -> void:
	var args := OS.get_cmdline_user_args()
	var zone: String = args[0] if args.size() > 0 else "all"
	var seed_value := int(args[1]) if args.size() > 1 else 1
	var outdir: String = args[2] if args.size() > 2 else ProjectSettings.globalize_path("res://").path_join("../docs/spritegen/sheets/M6")
	DirAccess.make_dir_recursive_absolute(outdir)
	var zones: Array = Genome.ZONES if zone == "all" else [zone]
	var plans := ["biped", "floater", "crawler", "worm"]
	for zi in zones.size():
		var z: String = zones[zi]
		var t0 := Time.get_ticks_msec()
		var bd := Backdrop.render(z, seed_value)
		var comp: Image = bd["composite"]
		var genome := Genome.make(seed_value + zi, plans[zi % plans.size()], z)
		var r := Pipeline.generate(genome)
		var spr := Pipeline.to_image(r["image"], Pipeline.load_palette(genome["palette"]))
		comp.blend_rect(spr, Rect2i(0, 0, spr.get_width(), spr.get_height()), Vector2i(240 - 48, 270 - 118 - 20))
		comp.resize(comp.get_width() * 2, comp.get_height() * 2, Image.INTERPOLATE_NEAREST)
		var out := outdir.path_join("hintergrund_%s_seed%d.png" % [z, seed_value])
		comp.save_png(out)
		print("%s  (%d ms, %d Ebenen)" % [out, Time.get_ticks_msec() - t0, bd["layers"].size()])
	quit()
