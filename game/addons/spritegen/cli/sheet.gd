## Kontaktbogen: N aufeinanderfolgende Seeds ab Start-Seed, je Paar links ohne, rechts mit Aufräumregeln.
## godot --headless --path game --script res://addons/spritegen/cli/sheet.gd -- [start=1] [count=16] [out] [scale=4]
extends SceneTree

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")

const COLS := 4
const GAP := 2
const PAD := 6
const BG := Color8(0xc9, 0xc3, 0xb6)
const BG_PAIR := Color8(0xb4, 0xad, 0x9e)


func _init() -> void:
	var args := OS.get_cmdline_user_args()
	var start := int(args[0]) if args.size() > 0 else 1
	var count := int(args[1]) if args.size() > 1 else 16
	var out := args[2] if args.size() > 2 else ProjectSettings.globalize_path("res://").path_join(
		"../docs/spritegen/sheets/M1/godot_biped_seed%d-%d.png" % [start, start + count - 1])
	var scale := int(args[3]) if args.size() > 3 else 4
	var palette := Pipeline.load_palette("tiefsee")
	var W := 64
	var H := 80
	var pair_w := W * 2 + GAP
	var rows := ceili(count / float(COLS))
	var sheet := Image.create(COLS * pair_w + (COLS + 1) * PAD, rows * H + (rows + 1) * PAD, false, Image.FORMAT_RGBA8)
	sheet.fill(BG)
	var t0 := Time.get_ticks_msec()
	var ctx := HashingContext.new()
	ctx.start(HashingContext.HASH_SHA256)
	for k in count:
		var seed_value := start + k
		var genome := Genome.make(seed_value)
		var col := k % COLS
		var row := k / COLS
		var ox := PAD + col * (pair_w + PAD)
		var oy := PAD + row * (H + PAD)
		for side in 2:
			var r := Pipeline.generate(genome, {"cleanup": side == 1})
			ctx.update(r["image"]["px"])
			var img := Pipeline.to_image(r["image"], palette)
			var bx := ox + side * (W + GAP)
			sheet.fill_rect(Rect2i(bx, oy, W, H), BG_PAIR)
			sheet.blend_rect(img, Rect2i(0, 0, W, H), Vector2i(bx, oy))
	var ms := Time.get_ticks_msec() - t0
	sheet.resize(sheet.get_width() * scale, sheet.get_height() * scale, Image.INTERPOLATE_NEAREST)
	DirAccess.make_dir_recursive_absolute(out.get_base_dir())
	sheet.save_png(out)
	print("%s\n%d Seeds ab %d, %d ms (%.1f ms je Sprite), Index-Hash %s" % [out, count, start, ms,
		ms / float(count * 2), ctx.finish().hex_encode().substr(0, 16)])
	quit()
