## M4-Nachweis: ein Zweibeiner mit Markierungen (Auge auf der Brust, Wucherung am Arm, Narbe am Bein, Licht am Kopf)
## in drei Posen. Markierungen müssen in jeder Pose an derselben Körperstelle sitzen.
## godot --headless --path game --script res://addons/spritegen/cli/marks_test.gd -- [out]
extends SceneTree

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")


func _init() -> void:
	var args := OS.get_cmdline_user_args()
	var out: String = args[0] if args.size() > 0 else ProjectSettings.globalize_path("res://").path_join("../docs/spritegen/sheets/M4/marks_3posen_seed2.png")
	var g := Genome.make(2, "biped", "hafen")
	g["marks"] = [
		{"kind": "eye", "bone": "chest", "u": 0.5, "v": 0.25, "r": 2.0},
		{"kind": "growth", "bone": "arm_upper_near", "u": 0.5, "v": 0.25, "r": 3.0},
		{"kind": "scar", "bone": "leg_upper_near", "u": 0.5, "v": 0.25, "r": 3.0},
		{"kind": "light", "bone": "head", "u": 0.3, "v": 0.0, "r": 1.5},
	]
	var pal := Pipeline.load_palette(g["palette"])
	var poses := [{"anim": "idle", "t": 0.0, "amp": 1.0}, {"anim": "attack", "t": 0.45, "amp": 1.0}, {"anim": "death", "t": 0.6, "amp": 1.0}]
	var W := 96
	var H := 120
	var sheet := Image.create((W + 4) * poses.size() + 4, H + 8, false, Image.FORMAT_RGBA8)
	sheet.fill(Color8(16, 16, 18))
	for i in poses.size():
		var r := Pipeline.generate(g, {"pose": poses[i]})
		sheet.blit_rect(Pipeline.fog_background(W, H, pal, 2), Rect2i(0, 0, W, H), Vector2i(4 + i * (W + 4), 4))
		sheet.blend_rect(Pipeline.to_image(r["image"], pal), Rect2i(0, 0, W, H), Vector2i(4 + i * (W + 4), 4))
	sheet.resize(sheet.get_width() * 3, sheet.get_height() * 3, Image.INTERPOLATE_NEAREST)
	DirAccess.make_dir_recursive_absolute(out.get_base_dir())
	sheet.save_png(out)
	print(out)
	quit()
