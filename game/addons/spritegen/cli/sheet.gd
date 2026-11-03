## Kontaktbogen: N aufeinanderfolgende Seeds ab Start-Seed, je Paar links ohne, rechts mit Aufräumregeln.
## godot --headless --path game --script res://addons/spritegen/cli/sheet.gd -- [plan=biped] [zone=hafen] [start=1] [count=16] [out] [scale=4] [cols=4] [mode=pair|clean|surface]  (pair: ohne/mit Aufräumregeln, surface: ohne/mit Oberfläche+Details)
extends SceneTree

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")

const COLS := 4
const GAP := 2
const PAD := 6
const BG := Color8(0x10, 0x10, 0x12)


func _init() -> void:
	var args := OS.get_cmdline_user_args()
	var plan: String = args[0] if args.size() > 0 else "biped"
	var zone: String = args[1] if args.size() > 1 else "hafen"
	var start := int(args[2]) if args.size() > 2 else 1
	var count := int(args[3]) if args.size() > 3 else 16
	var out: String = args[4] if args.size() > 4 and args[4] != "-" else ProjectSettings.globalize_path("res://").path_join(
		"../docs/spritegen/sheets/%s_%s_seed%d-%d.png" % [plan, zone, start, start + count - 1])
	var scale := int(args[5]) if args.size() > 5 else 4
	var cols := int(args[6]) if args.size() > 6 else COLS
	var mode: String = args[7] if args.size() > 7 else "pair"
	var sides := 2 if mode in ["pair", "surface"] else 1
	var psize: Dictionary = Genome.plan_def(plan)["size"]
	var W: int = psize["w"]
	var H: int = psize["h"]
	var pair_w := W * sides + GAP * (sides - 1)
	var rows := ceili(count / float(cols))
	var sheet := Image.create(cols * pair_w + (cols + 1) * PAD, rows * H + (rows + 1) * PAD, false, Image.FORMAT_RGBA8)
	sheet.fill(BG)
	var t0 := Time.get_ticks_msec()
	var ctx := HashingContext.new()
	ctx.start(HashingContext.HASH_SHA256)
	for k in count:
		var seed_value := start + k
		# zone "mix": je 16 Seeds eine Zone (hafen, wald, kapelle, grund)
		var z: String = zone if zone != "mix" else Genome.ZONES[(k / 16) % 4]
		var genome := Genome.make(seed_value, plan, z)
		var palette := Pipeline.load_palette(genome["palette"])
		var col := k % cols
		var row := k / cols
		var ox := PAD + col * (pair_w + PAD)
		var oy := PAD + row * (H + PAD)
		for side in sides:
			var o := {}
			if mode == "pair":
				o = {"cleanup": side == 1}
			elif mode == "surface":
				o = {"surface": side == 1, "details": side == 1}
			var r := Pipeline.generate(genome, o)
			ctx.update(r["image"]["px"])
			var img := Pipeline.to_image(r["image"], palette)
			var bx := ox + side * (W + GAP)
			sheet.blit_rect(Pipeline.fog_background(W, H, palette, seed_value), Rect2i(0, 0, W, H), Vector2i(bx, oy))
			sheet.blend_rect(img, Rect2i(0, 0, W, H), Vector2i(bx, oy))
	var ms := Time.get_ticks_msec() - t0
	sheet.resize(sheet.get_width() * scale, sheet.get_height() * scale, Image.INTERPOLATE_NEAREST)
	DirAccess.make_dir_recursive_absolute(out.get_base_dir())
	sheet.save_png(out)
	print("%s\n%d Seeds ab %d, %d ms (%.1f ms je Sprite), Index-Hash %s" % [out, count, start, ms,
		ms / float(count * 2), ctx.finish().hex_encode().substr(0, 16)])
	quit()
