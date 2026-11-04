@tool
## Editor-Dock des Sprite-Generators. Reines Control, läuft auch außerhalb des Editors (Tests, Szene).
## Vorschau mit Animation, Regler je Parameter, Gelenke ziehen, Pinsel "Malen mit Absicht" (marks),
## Mini-Pixelmodus (fixes, am Knochen verankert oder nur dieses Bild, Zwiebelhaut, Rückgängig),
## Evolutions-Raster mit 12 Kindern, Export (Genom-JSON, PNG-Sheet, SpriteFrames).
extends Control

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")
const Frames := preload("res://addons/spritegen/core/frames.gd")
const Indexed := preload("res://addons/spritegen/core/indexed.gd")

const ZOOM := 3
const MODES := ["Ansehen", "Gelenk ziehen", "Absicht malen", "Pixel"]
const MARK_KINDS := ["eye", "growth", "rust", "scar", "light"]
const PIXEL_TOOLS := ["Stift", "Radierer", "Pipette"]
const INDEX_NAMES := ["leer", "Umriss", "Körper 0", "Körper 1", "Körper 2", "Körper 3", "Rand innen", "Rand außen", "Auge", "Glühen"]

var genome: Dictionary
var palette: Dictionary
var result: Dictionary        # letztes Pipeline-Ergebnis des aktuellen Bilds
var anim := "idle"
var frame := 0
var playing := false
var anim_cache: Array = []    # gerenderte Bilder der aktuellen Animation (Pipeline-Ergebnisse)
var mode := 0
var mark_kind := 0
var mark_r := 1.5
var pixel_tool := 0
var pixel_index := Indexed.EYE
var fix_only_frame := false
var onion := false
var undo_stack: Array = []    # [{"kind": "mark"|"fix"|"joint", "data": ...}]
var drag_bone := ""
var drag_last := Vector2.ZERO
var dirty := false
var export_dir := "res://export/spritegen"

var preview: TextureRect
var status: Label
var params_box: VBoxContainer
var sliders := {}
var plan_opt: OptionButton
var zone_opt: OptionButton
var seed_spin: SpinBox
var anim_opt: OptionButton
var frame_spin: SpinBox
var mode_opt: OptionButton
var kind_opt: OptionButton
var tool_opt: OptionButton
var color_opt: OptionButton
var only_frame_chk: CheckBox
var onion_chk: CheckBox
var strength_slider: HSlider
var evo_grid: GridContainer
var play_timer: Timer
var debounce: Timer
var export_edit: LineEdit


func _ready() -> void:
	name = "SpriteGen"
	custom_minimum_size = Vector2(340, 600)
	_build_ui()
	set_genome(Genome.make(1, "biped", "hafen"))


func _build_ui() -> void:
	var scroll := ScrollContainer.new()
	scroll.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(scroll)
	var root := VBoxContainer.new()
	root.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(root)

	# Kopf: Plan, Zone, Seed
	var head := HBoxContainer.new()
	root.add_child(head)
	plan_opt = OptionButton.new()
	for p in Genome.PLANS:
		plan_opt.add_item(p)
	plan_opt.item_selected.connect(func(i): _new_genome(Genome.PLANS[i], genome["zone"], genome["seed"]))
	head.add_child(plan_opt)
	zone_opt = OptionButton.new()
	for z in Genome.ZONES:
		zone_opt.add_item(z)
	zone_opt.item_selected.connect(func(i): _new_genome(genome["plan"], Genome.ZONES[i], genome["seed"]))
	head.add_child(zone_opt)
	seed_spin = SpinBox.new()
	seed_spin.min_value = 0
	seed_spin.max_value = 1000000
	seed_spin.value_changed.connect(func(v): _new_genome(genome["plan"], genome["zone"], int(v)))
	head.add_child(seed_spin)
	var btn_next := Button.new()
	btn_next.text = "Zufall"
	btn_next.pressed.connect(func(): seed_spin.value = genome["seed"] + 1)
	head.add_child(btn_next)

	# Vorschau
	preview = TextureRect.new()
	preview.custom_minimum_size = Vector2(96 * ZOOM, 120 * ZOOM)
	preview.stretch_mode = TextureRect.STRETCH_SCALE
	preview.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	preview.gui_input.connect(_on_preview_input)
	root.add_child(preview)
	status = Label.new()
	status.text = "–"
	root.add_child(status)

	# Animation
	var arow := HBoxContainer.new()
	root.add_child(arow)
	anim_opt = OptionButton.new()
	for a in Frames.ANIMS.keys():
		anim_opt.add_item(a)
	anim_opt.item_selected.connect(func(i): set_anim(Frames.ANIMS.keys()[i]))
	arow.add_child(anim_opt)
	var play := CheckButton.new()
	play.text = "Abspielen"
	play.toggled.connect(func(on): playing = on; if on: _ensure_anim_cache())
	arow.add_child(play)
	frame_spin = SpinBox.new()
	frame_spin.min_value = 0
	frame_spin.max_value = 7
	frame_spin.value_changed.connect(func(v): set_frame(int(v)))
	arow.add_child(frame_spin)
	onion_chk = CheckBox.new()
	onion_chk.text = "Zwiebelhaut"
	onion_chk.toggled.connect(func(on): onion = on; _show())
	arow.add_child(onion_chk)
	play_timer = Timer.new()
	play_timer.wait_time = 1.0 / 6.0
	play_timer.autostart = true
	play_timer.timeout.connect(_tick)
	add_child(play_timer)
	debounce = Timer.new()
	debounce.one_shot = true
	debounce.wait_time = 0.15
	debounce.timeout.connect(_render_current)
	add_child(debounce)

	# Werkzeuge
	var trow := HBoxContainer.new()
	root.add_child(trow)
	mode_opt = OptionButton.new()
	for m in MODES:
		mode_opt.add_item(m)
	mode_opt.item_selected.connect(func(i): mode = i)
	trow.add_child(mode_opt)
	kind_opt = OptionButton.new()
	for k in MARK_KINDS:
		kind_opt.add_item(k)
	kind_opt.item_selected.connect(func(i): mark_kind = i)
	trow.add_child(kind_opt)
	var rspin := SpinBox.new()
	rspin.min_value = 0.5
	rspin.max_value = 6
	rspin.step = 0.5
	rspin.value = mark_r
	rspin.value_changed.connect(func(v): mark_r = v)
	trow.add_child(rspin)
	var prow := HBoxContainer.new()
	root.add_child(prow)
	tool_opt = OptionButton.new()
	for t in PIXEL_TOOLS:
		tool_opt.add_item(t)
	tool_opt.item_selected.connect(func(i): pixel_tool = i)
	prow.add_child(tool_opt)
	color_opt = OptionButton.new()
	for i in INDEX_NAMES.size():
		color_opt.add_item(INDEX_NAMES[i])
	color_opt.selected = pixel_index
	color_opt.item_selected.connect(func(i): pixel_index = i)
	prow.add_child(color_opt)
	only_frame_chk = CheckBox.new()
	only_frame_chk.text = "nur dieses Bild"
	only_frame_chk.toggled.connect(func(on): fix_only_frame = on)
	prow.add_child(only_frame_chk)
	var undo := Button.new()
	undo.text = "Rückgängig"
	undo.pressed.connect(undo_last)
	prow.add_child(undo)

	# Parameter
	params_box = VBoxContainer.new()
	root.add_child(params_box)

	# Evolution
	var erow := HBoxContainer.new()
	root.add_child(erow)
	var evo := Button.new()
	evo.text = "12 Kinder"
	evo.pressed.connect(evolve)
	erow.add_child(evo)
	strength_slider = HSlider.new()
	strength_slider.min_value = 0.02
	strength_slider.max_value = 0.5
	strength_slider.step = 0.01
	strength_slider.value = 0.15
	strength_slider.custom_minimum_size.x = 120
	erow.add_child(strength_slider)
	evo_grid = GridContainer.new()
	evo_grid.columns = 4
	root.add_child(evo_grid)

	# Export / Laden
	var xrow := HBoxContainer.new()
	root.add_child(xrow)
	export_edit = LineEdit.new()
	export_edit.text = export_dir
	export_edit.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	xrow.add_child(export_edit)
	var xbtn := Button.new()
	xbtn.text = "Export"
	xbtn.pressed.connect(func(): export_all(export_edit.text))
	xrow.add_child(xbtn)
	var lbtn := Button.new()
	lbtn.text = "Genom laden"
	lbtn.pressed.connect(func(): load_genome_file(export_edit.text.path_join("genome.json")))
	xrow.add_child(lbtn)


# ---------- Genom und Rendern ----------

func _new_genome(plan: String, zone: String, seed_value: int) -> void:
	set_genome(Genome.make(seed_value, plan, zone))


func set_genome(g: Dictionary) -> void:
	genome = Genome.migrate(g)
	palette = Pipeline.load_palette(genome["palette"])
	undo_stack.clear()
	anim_cache.clear()
	plan_opt.selected = Genome.PLANS.find(genome["plan"])
	zone_opt.selected = Genome.ZONES.find(genome["zone"])
	seed_spin.set_value_no_signal(genome["seed"])
	_rebuild_sliders()
	_render_current()


func _rebuild_sliders() -> void:
	for c in params_box.get_children():
		c.queue_free()
	sliders.clear()
	var def := Genome.plan_def(genome["plan"])
	for pname in def["params"]:
		var row := HBoxContainer.new()
		var lbl := Label.new()
		lbl.text = def.get("doc", {}).get(pname, pname)
		lbl.custom_minimum_size.x = 150
		lbl.tooltip_text = pname
		row.add_child(lbl)
		var sl := HSlider.new()
		sl.min_value = 0.0
		sl.max_value = 1.0
		sl.step = 0.01
		sl.value = genome["params"].get(pname, 0.5)
		sl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		sl.value_changed.connect(func(v): set_param(pname, v))
		row.add_child(sl)
		params_box.add_child(row)
		sliders[pname] = sl


func set_param(pname: String, v: float) -> void:
	genome["params"][pname] = Genome.round4(v)
	anim_cache.clear()
	debounce.start()


func set_anim(a: String) -> void:
	anim = a
	frame = 0
	anim_cache.clear()
	frame_spin.max_value = Frames.ANIMS[anim]["frames"] - 1
	frame_spin.set_value_no_signal(0)
	_render_current()


func set_frame(k: int) -> void:
	frame = clampi(k, 0, Frames.ANIMS[anim]["frames"] - 1)
	frame_spin.set_value_no_signal(frame)
	_render_current()


func _pose() -> Dictionary:
	return {"anim": anim, "t": Frames.frame_time(anim, frame, Frames.ANIMS[anim]["frames"]), "amp": 1.0}


func _render_current() -> void:
	if genome.is_empty():
		return
	var t0 := Time.get_ticks_msec()
	if anim_cache.size() > frame and anim_cache[frame] != null:
		result = anim_cache[frame]
	else:
		result = Pipeline.generate(genome, {"pose": _pose(), "frame": "%s:%d" % [anim, frame]})
		if anim_cache.size() == Frames.ANIMS[anim]["frames"]:
			anim_cache[frame] = result
	_show()
	status.text = "%s #%d  %s %s Seed %d  (%d ms)  Markierungen %d, Korrekturen %d" % [anim, frame, genome["plan"], genome["zone"], genome["seed"], Time.get_ticks_msec() - t0, genome["marks"].size(), genome["fixes"].size()]


func _ensure_anim_cache() -> void:
	var n: int = Frames.ANIMS[anim]["frames"]
	if anim_cache.size() != n:
		anim_cache.resize(n)
		anim_cache.fill(null)
	for k in n:
		if anim_cache[k] == null:
			anim_cache[k] = Pipeline.generate(genome, {"pose": {"anim": anim, "t": Frames.frame_time(anim, k, n), "amp": 1.0}, "frame": "%s:%d" % [anim, k]})


func _tick() -> void:
	if not playing or genome.is_empty():
		return
	_ensure_anim_cache()
	var n: int = Frames.ANIMS[anim]["frames"]
	frame = (frame + 1) % n
	frame_spin.set_value_no_signal(frame)
	result = anim_cache[frame]
	_show()


func _show() -> void:
	if result.is_empty():
		return
	var img := Pipeline.to_image(result["image"], palette)
	var w := img.get_width()
	var h := img.get_height()
	var comp := Pipeline.fog_background(w, h, palette, genome["seed"])
	if onion and anim_cache.size() > 0:
		var prev_k: int = (frame - 1 + anim_cache.size()) % anim_cache.size()
		if anim_cache[prev_k] != null:
			var prev := Pipeline.to_image(anim_cache[prev_k]["image"], palette)
			for y in h:
				for x in w:
					var c := prev.get_pixel(x, y)
					if c.a > 0:
						comp.set_pixel(x, y, comp.get_pixel(x, y).lerp(c, 0.4))
	comp.blend_rect(img, Rect2i(0, 0, w, h), Vector2i(0, 0))
	# Gelenke anzeigen im Gelenk-Modus
	if mode == 1:
		for b in result["skeleton"]["bones"]:
			var p: Array = b["b"]
			var x := int(p[0])
			var y := int(p[1])
			if x >= 0 and y >= 0 and x < w and y < h:
				comp.set_pixel(x, y, Color(1, 0.3, 0.3))
	preview.texture = ImageTexture.create_from_image(comp)


# ---------- Eingriffe ----------

func _pixel_at(pos: Vector2) -> Vector2i:
	return Vector2i(int(pos.x / ZOOM), int(pos.y / ZOOM))


func _on_preview_input(event: InputEvent) -> void:
	if result.is_empty():
		return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		var px := _pixel_at(event.position)
		if event.pressed:
			match mode:
				1: _joint_start(px)
				2: add_mark_at(px.x, px.y)
				3: paint_pixel(px.x, px.y)
		elif mode == 1 and drag_bone != "":
			drag_bone = ""
			_render_current()
	elif event is InputEventMouseMotion and mode == 1 and drag_bone != "" and event.button_mask & MOUSE_BUTTON_MASK_LEFT:
		_joint_drag(_pixel_at(event.position))
	elif event is InputEventMouseMotion and mode == 3 and event.button_mask & MOUSE_BUTTON_MASK_LEFT and pixel_tool != 2:
		var px := _pixel_at(event.position)
		paint_pixel(px.x, px.y)


## Körperkoordinate des Pixels: {bone, u, v} oder leer, wenn kein Körper.
func body_coord_at(x: int, y: int) -> Dictionary:
	var buf: Dictionary = result["buf"]
	var w: int = buf["w"]
	if x < 0 or y < 0 or x >= w or y >= buf["h"]:
		return {}
	var i := y * w + x
	if buf["cover"][i] == 0:
		return {}
	return {"bone": buf["bone_names"][buf["bone"][i]], "u": buf["u"][i], "v": buf["v"][i]}


func add_mark_at(x: int, y: int) -> bool:
	var bc := body_coord_at(x, y)
	if bc.is_empty():
		return false
	var m := {"kind": MARK_KINDS[mark_kind], "bone": bc["bone"], "u": Genome.round4(bc["u"]), "v": Genome.round4(bc["v"]), "r": mark_r}
	genome["marks"].append(m)
	undo_stack.append({"kind": "mark"})
	anim_cache.clear()
	_render_current()
	return true


func paint_pixel(x: int, y: int) -> bool:
	if pixel_tool == 2:
		var img: Dictionary = result["image"]
		if x >= 0 and y >= 0 and x < img["w"] and y < img["h"]:
			pixel_index = img["px"][y * img["w"] + x]
			color_opt.selected = pixel_index
		return true
	var idx := pixel_index if pixel_tool == 0 else Indexed.TRANSPARENT
	var fx := {}
	if fix_only_frame:
		fx = {"frame": "%s:%d" % [anim, frame], "x": x, "y": y, "ramp": idx}
	else:
		var bc := body_coord_at(x, y)
		if bc.is_empty():
			return false
		fx = {"bone": bc["bone"], "u": Genome.round4(bc["u"]), "v": Genome.round4(bc["v"]), "ramp": idx}
	genome["fixes"].append(fx)
	undo_stack.append({"kind": "fix"})
	anim_cache.clear()
	_render_current()
	return true


func _joint_start(px: Vector2i) -> void:
	var best := ""
	var best_d := 36.0
	for b in result["skeleton"]["bones"]:
		var p: Array = b["b"]
		var d := (Vector2(p[0], p[1]) - Vector2(px.x + 0.5, px.y + 0.5)).length_squared()
		if d < best_d:
			best_d = d
			best = b["name"]
	drag_bone = best
	drag_last = Vector2(px)
	if best != "":
		undo_stack.append({"kind": "joint", "bone": best, "before": genome["joints"].get(best, [0.0, 0.0]).duplicate()})


func _joint_drag(px: Vector2i) -> void:
	var delta := Vector2(px) - drag_last
	if delta == Vector2.ZERO:
		return
	drag_last = Vector2(px)
	move_joint(drag_bone, delta.x, delta.y)


func move_joint(bone_name: String, dx: float, dy: float) -> void:
	var cur: Array = genome["joints"].get(bone_name, [0.0, 0.0])
	genome["joints"][bone_name] = [cur[0] + dx, cur[1] + dy]
	anim_cache.clear()
	debounce.start()


func undo_last() -> void:
	if undo_stack.is_empty():
		return
	var u: Dictionary = undo_stack.pop_back()
	match u["kind"]:
		"mark": genome["marks"].pop_back()
		"fix": genome["fixes"].pop_back()
		"joint":
			if u["before"] == [0.0, 0.0]:
				genome["joints"].erase(u["bone"])
			else:
				genome["joints"][u["bone"]] = u["before"]
	anim_cache.clear()
	_render_current()


# ---------- Evolution ----------

func evolve() -> void:
	for c in evo_grid.get_children():
		c.queue_free()
	var strength: float = strength_slider.value
	for k in 12:
		var child := Genome.mutate(genome, genome["seed"] * 100 + k + 1, strength)
		var r := Pipeline.generate(child)
		var img := Pipeline.to_image(r["image"], palette)
		img.resize(img.get_width() * 1, img.get_height() * 1, Image.INTERPOLATE_NEAREST)
		var btn := TextureButton.new()
		btn.texture_normal = ImageTexture.create_from_image(img)
		btn.tooltip_text = "Kind %d" % (k + 1)
		btn.pressed.connect(func(): set_genome(child))
		evo_grid.add_child(btn)


# ---------- Export / Laden ----------

func export_all(dir: String) -> Dictionary:
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(dir))
	var base := "%s_%s_%d" % [genome["plan"], genome["zone"], genome["seed"]]
	var out := {}
	var f := FileAccess.open(dir.path_join(base + ".genome.json"), FileAccess.WRITE)
	f.store_string(JSON.stringify(genome, "  "))
	f.close()
	out["genome"] = dir.path_join(base + ".genome.json")
	var sheet := Frames.to_sheet(genome, palette)
	sheet["image"].save_png(ProjectSettings.globalize_path(dir.path_join(base + ".sheet.png")))
	out["sheet"] = dir.path_join(base + ".sheet.png")
	var mf := FileAccess.open(dir.path_join(base + ".sheet.json"), FileAccess.WRITE)
	mf.store_string(JSON.stringify(sheet["meta"], "  "))
	mf.close()
	var sf := Frames.to_sprite_frames(genome, palette)
	var err := ResourceSaver.save(sf, dir.path_join(base + ".frames.tres"))
	out["frames"] = dir.path_join(base + ".frames.tres") if err == OK else ""
	status.text = "Exportiert nach %s" % dir
	return out


func load_genome_file(path: String) -> bool:
	var f := FileAccess.open(path, FileAccess.READ)
	if f == null:
		status.text = "Datei nicht gefunden: %s" % path
		return false
	var g = JSON.parse_string(f.get_as_text())
	if typeof(g) != TYPE_DICTIONARY:
		return false
	set_genome(g)
	return true
