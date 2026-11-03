## Headless-Test des Editor-Docks: Dock aufbauen, Markierung setzen, Pixel korrigieren, Gelenk ziehen,
## Evolution, Export. Beendet mit 0 (grün) oder 1 (rot).
extends SceneTree

const Dock := preload("res://addons/spritegen/editor/dock.gd")

var failed := 0


func check(name: String, ok: bool) -> void:
	if ok:
		print("ok   ", name)
	else:
		failed += 1
		print("FAIL ", name)


func _init() -> void:
	var dock = Dock.new()
	root.add_child(dock)
	await process_frame
	check("Dock gerendert", not dock.result.is_empty())
	var n_marks: int = dock.genome["marks"].size()
	# Augenpixel des aktuellen Bildes suchen und daneben eine Markierung setzen.
	var buf: Dictionary = dock.result["buf"]
	var found := -1
	for i in buf["cover"].size():
		if buf["cover"][i] == 1:
			found = i
			break
	check("Körperpixel gefunden", found >= 0)
	var x: int = found % buf["w"]
	var y: int = found / buf["w"]
	check("Markierung setzen", dock.add_mark_at(x + 2, y + 6) or dock.add_mark_at(x, y))
	check("Markierung im Genom", dock.genome["marks"].size() == n_marks + 1)
	dock.pixel_tool = 0
	check("Pixel am Knochen", dock.paint_pixel(x, y))
	dock.fix_only_frame = true
	check("Pixel nur dieses Bild", dock.paint_pixel(x, y))
	check("Zwei Korrekturen", dock.genome["fixes"].size() == 2)
	dock.undo_last()
	check("Rückgängig", dock.genome["fixes"].size() == 1)
	dock.move_joint("head", 2.0, -1.0)
	check("Gelenk verschoben", dock.genome["joints"].has("head"))
	dock._render_current()
	dock.set_anim("attack")
	dock.set_frame(3)
	check("Angriff Bild 3", dock.frame == 3 and not dock.result.is_empty())
	dock.evolve()
	await process_frame
	check("12 Kinder", dock.evo_grid.get_child_count() == 12)
	var out: Dictionary = dock.export_all("user://spritegen_test")
	check("Export Genom", FileAccess.file_exists(out["genome"]))
	check("Export Sheet", FileAccess.file_exists(out["sheet"]))
	check("Export SpriteFrames", out["frames"] != "" and FileAccess.file_exists(out["frames"]))
	check("Genom laden", dock.load_genome_file(out["genome"]))
	print("\n%s" % ("alle grün" if failed == 0 else "%d fehlgeschlagen" % failed))
	quit(1 if failed > 0 else 0)
