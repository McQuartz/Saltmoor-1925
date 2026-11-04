## Headless-Tests ohne Zusatz-Addon. Beendet mit Code 0 (grün) oder 1 (rot).
## godot --headless --path game --script res://addons/spritegen/cli/test.gd
extends SceneTree

const Rng := preload("res://addons/spritegen/core/rng.gd")
const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")
const Plans := preload("res://addons/spritegen/core/plans.gd")
const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const Cleanup := preload("res://addons/spritegen/core/cleanup.gd")
const Outline := preload("res://addons/spritegen/core/outline.gd")
const Details := preload("res://addons/spritegen/core/details.gd")
const Frames := preload("res://addons/spritegen/core/frames.gd")
const Posing := preload("res://addons/spritegen/core/posing.gd")
const WFC := preload("res://addons/spritegen/core/backdrop/wfc.gd")
const Golden := preload("res://addons/spritegen/cli/golden.gd")

var failed := 0
var passed := 0


func check(name: String, ok: bool, detail: String = "") -> void:
	if ok:
		passed += 1
		print("ok   ", name)
	else:
		failed += 1
		print("FAIL ", name, "  ", detail)


func rule_case(name: String, rule: Callable, input: Array, expected: Array) -> void:
	var got := Indexed.to_rows(rule.call(Indexed.from_rows(input)))
	check(name, got == expected, "erwartet %s, bekommen %s" % [expected, got])


func bounds_ok(img: Dictionary) -> bool:
	var w: int = img["w"]
	var h: int = img["h"]
	var px: PackedByteArray = img["px"]
	var any := false
	for y in h:
		if px[y * w] != 0 or px[y * w + w - 1] != 0:
			return false
	for x in w:
		if px[x] != 0:
			return false
		if px[(h - 1) * w + x] != 0:
			return false
	for i in px.size():
		if px[i] != 0:
			any = true
			break
	return any


func _init() -> void:
	# RNG: Referenzfolge, identisch zur JS-Referenz in tools/spritegen.
	var r = Rng.new(1)
	check("RNG Referenzfolge", [r.next_u32(), r.next_u32(), r.next_u32()] == [2527132011, 314344336, 2535364964])

	# Genom
	var g1 := Genome.make(42, "biped", "hafen")
	check("Genom deterministisch", g1 == Genome.make(42, "biped", "hafen"))
	check("Genom Version 2", g1["v"] == 2)
	check("Genom JSON-Rundreise", JSON.parse_string(JSON.stringify(g1))["params"] == g1["params"])
	check("Zonen-Regel greift (grund: bulk >= 0.5)", Genome.make(7, "biped", "grund")["params"]["bulk"] >= 0.5)
	var old := {"v": 1, "seed": 3, "plan": "biped", "palette": "tiefsee", "params": {"height": 0.5}, "marks": [], "fixes": []}
	var mig := Genome.migrate(old)
	check("Migration v1 -> v2", mig["v"] == 2 and mig["params"].has("eyes") and mig.has("joints"))
	var child := Genome.mutate(g1, 99, 0.1)
	check("Mutation bleibt in 0..1", child["params"].values().all(func(v): return v >= 0.0 and v <= 1.0))

	# Regel-Tests (dieselben Fälle wie tools/spritegen/tests/rules.test.js, plus Dither-Variante).
	rule_case("Einzelpixel: Sporn", Cleanup.rule_orphans,
		["......", ".2222.", ".22222", ".2222."], ["......", ".2222.", ".2222.", ".2222."])
	rule_case("Einzelpixel: Kerbe", Cleanup.rule_orphans,
		[".222.", ".2.2.", ".222."], [".222.", ".222.", ".222."])
	rule_case("Einzelpixel: Einzelton", Cleanup.rule_orphans,
		["11111", "11311", "11111"], ["11111", "11111", "11111"])
	rule_case("Einzelpixel: saubere Fläche", Cleanup.rule_orphans,
		[".....", ".112.", ".112.", "....."], [".....", ".112.", ".112.", "....."])
	rule_case("Einzelpixel mit Dither: ±1 bleibt", Cleanup.rule_orphans.bind(true),
		["11111", "11211", "11111"], ["11111", "11211", "11111"])
	rule_case("Einzelpixel mit Dither: ±2 wird angepasst", Cleanup.rule_orphans.bind(true),
		["11111", "11311", "11111"], ["11111", "11111", "11111"])
	rule_case("Treppen: 4,1,4 -> 3,2,4", Cleanup.rule_staircase,
		[".1111111", ".1111111", ".1111111", ".1111111", "..111111", "...11111", "...11111", "...11111", "...11111"],
		[".1111111", ".1111111", ".1111111", "..111111", "..111111", "...11111", "...11111", "...11111", "...11111"])
	rule_case("Treppen: Diagonale bleibt", Cleanup.rule_staircase,
		["...1111", "..11111", ".111111", "1111111"], ["...1111", "..11111", ".111111", "1111111"])
	rule_case("Banding: Zwischenton weg", Cleanup.rule_banding,
		["000122", "000122", "000122"], ["000022", "000022", "000022"])
	rule_case("Banding: 1-px-Verlauf bleibt", Cleanup.rule_banding,
		["00123", "00123", "00123"], ["00123", "00123", "00123"])
	rule_case("Außenumriss", Outline.outer_outline,
		[".....", "..2..", "....."], ["..o..", ".o2o.", "..o.."])
	check("Dither: Bayer-Matrix 0..1", Indexed.bayer(0, 0) < 0.1 and Indexed.bayer(3, 2) > 0.3)
	check("Quantisierung ohne Dither", Indexed.quantize(0.0, 0, 0, false) == Indexed.RAMP0 and Indexed.quantize(0.99, 0, 0, false) == Indexed.RAMP0 + 3)

	# Posen-Helfer
	check("Zyklus nahtlos", absf(Posing.cycle(0.0) - Posing.cycle(1.0)) < 1e-9)
	check("Schlüsselposen", absf(Posing.keys(0.5, [[0, 0], [1, 2]]) - 1.0) < 1e-9)

	# Alle Körperbaupläne: deterministisch, im Bild, Fuß-/Ankerzeile.
	for plan in Genome.PLANS:
		for zone in Genome.ZONES:
			var g := Genome.make(3, plan, zone)
			var a := Pipeline.generate(g)
			var b := Pipeline.generate(g)
			check("%s/%s deterministisch" % [plan, zone], a["image"]["px"] == b["image"]["px"])
			check("%s/%s im Bild mit Rand" % [plan, zone], bounds_ok(a["image"]))
		for anim in Frames.ANIMS.keys():
			var g := Genome.make(5, plan, "hafen")
			var rr := Pipeline.generate(g, {"pose": {"anim": anim, "t": 0.5, "amp": 1.0}})
			check("%s %s t=0.5 rendert" % [plan, anim], bounds_ok(rr["image"]))

	# M4: Markierung sitzt in drei Posen an derselben Körperstelle (Knochen/u/v gleich, Pixel im Körper).
	var gm := Genome.make(2, "biped", "hafen")
	gm["marks"].append({"kind": "eye", "bone": "chest", "u": 0.5, "v": 0.25, "r": 2.0})
	var hits := 0
	for pose in [{"anim": "idle", "t": 0.0, "amp": 1.0}, {"anim": "attack", "t": 0.45, "amp": 1.0}, {"anim": "death", "t": 1.0, "amp": 1.0}]:
		var rm := Pipeline.generate(gm, {"pose": pose})
		var bi := Details.bone_index(rm["buf"], "chest")
		var idx := Details.find_anchor(rm["buf"], bi, 0.5, 0.25)
		if idx >= 0 and rm["buf"]["bone"][idx] == bi and rm["image"]["px"][idx] == Indexed.EYE:
			hits += 1
	check("Markierung in 3 Posen am Knochen (Augenpixel dort)", hits == 3, "%d von 3" % hits)

	# Korrekturen
	var gf := Genome.make(2, "biped", "hafen")
	gf["fixes"].append({"frame": "idle:0", "x": 1, "y": 1, "ramp": Indexed.EYE})
	var rf := Pipeline.generate(gf, {"frame": "idle:0"})
	var rf2 := Pipeline.generate(gf, {"frame": "idle:1"})
	check("Bild-Korrektur nur im genannten Bild", rf["image"]["px"][1 * 96 + 1] == Indexed.EYE and rf2["image"]["px"][1 * 96 + 1] != Indexed.EYE)

	# M5: Loop nahtlos (Bild n entspricht Zeit < 1), Flacker-Maß definiert, SpriteFrames vollständig.
	var ga := Genome.make(1, "crawler", "wald")
	var idle := Frames.render(ga, "idle", {"frames": 4})
	check("Idle: 4 Bilder", idle.size() == 4)
	var fl := Frames.flicker_sequence(idle, true)
	check("Flacker-Maß 0..1", fl >= 0.0 and fl <= 1.0)
	check("Flacker 0 bei identischen Bildern", Frames.flicker(idle[0]["image"], idle[0]["image"]) == 0.0)
	var sf := Frames.to_sprite_frames(ga, Pipeline.load_palette(ga["palette"]), {"frames": 2})
	check("SpriteFrames: 4 Animationen", sf.get_animation_names().size() == 4 and sf.has_animation("idle") and sf.get_animation_loop("idle") and not sf.get_animation_loop("death"))

	# M6: WFC liefert ein Raster, das nur Nachbarschaften aus dem Beispiel enthält (2×2-Muster).
	var sample := ["1111", "1221", "1221", "1111"]
	var wfc = WFC.new(sample, 2, false)
	var grid: PackedByteArray = wfc.generate(12, 8, 1)
	check("WFC: Raster erzeugt", grid.size() == 96)
	var ok_patterns := true
	if grid.size() == 96:
		var known := {}
		for pt in wfc.patterns:
			known[pt.hex_encode()] = true
		for y in 7:
			for x in 11:
				var pt := PackedByteArray([grid[y * 12 + x], grid[y * 12 + x + 1], grid[(y + 1) * 12 + x], grid[(y + 1) * 12 + x + 1]])
				if not known.has(pt.hex_encode()):
					ok_patterns = false
	check("WFC: nur bekannte 2×2-Muster", ok_patterns)
	check("WFC deterministisch", grid == wfc.generate(12, 8, 1))

	# Golden-Tests: bitgleich zu golden/*.png
	for c in Golden.CASES:
		var g := Genome.make(c[2], c[0], c[1])
		var pal := Pipeline.load_palette(g["palette"])
		for stage in ["raw", "final"]:
			var name := Golden.name_for(c[0], c[1], c[2], stage)
			var expected := Image.load_from_file("res://addons/spritegen/golden/" + name)
			if expected == null:
				check("Golden " + name, false, "fehlt")
				continue
			expected.convert(Image.FORMAT_RGBA8)
			var rr := Pipeline.generate(g, {"cleanup": false, "rim": false, "details": false, "surface": false}) if stage == "raw" else Pipeline.generate(g)
			check("Golden " + name, Pipeline.to_image(rr["image"], pal).get_data() == expected.get_data())
	for p in Golden.POSES:
		var g := Genome.make(1, p[0], "hafen")
		var name := Golden.pose_name(p[0], p[1], p[2])
		var expected := Image.load_from_file("res://addons/spritegen/golden/" + name)
		if expected == null:
			check("Golden " + name, false, "fehlt")
			continue
		expected.convert(Image.FORMAT_RGBA8)
		var rr := Pipeline.generate(g, {"pose": {"anim": p[1], "t": p[2], "amp": 1.0}})
		check("Golden " + name, Pipeline.to_image(rr["image"], Pipeline.load_palette(g["palette"])).get_data() == expected.get_data())

	print("\n%d ok, %d fehlgeschlagen" % [passed, failed])
	quit(1 if failed > 0 else 0)
