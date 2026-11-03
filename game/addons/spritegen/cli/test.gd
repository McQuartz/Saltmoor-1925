## Headless-Tests ohne Zusatz-Addon. Beendet mit Code 0 (grün) oder 1 (rot).
## godot --headless --path game --script res://addons/spritegen/cli/test.gd
extends SceneTree

const Rng := preload("res://addons/spritegen/core/rng.gd")
const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")
const Indexed := preload("res://addons/spritegen/core/indexed.gd")
const Cleanup := preload("res://addons/spritegen/core/cleanup.gd")
const Outline := preload("res://addons/spritegen/core/outline.gd")

const GOLDEN_SEEDS := [1, 2, 3, 4, 5, 6, 7, 8, 100, 4711]

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


func _init() -> void:
	# RNG: Referenzfolge, identisch zur JS-Referenz.
	var r = Rng.new(1)
	check("RNG Referenzfolge", [r.next_u32(), r.next_u32(), r.next_u32()] == [2527132011, 314344336, 2535364964])

	var g1 := Genome.make(42)
	check("Genom deterministisch", g1 == Genome.make(42))
	check("Genom Version", g1["v"] == 1)
	check("Genom JSON-Rundreise", JSON.parse_string(JSON.stringify(g1))["params"] == g1["params"])
	check("Genom Seeds verschieden", g1["params"] != Genome.make(43)["params"])

	# Regel-Tests (dieselben Fälle wie tools/spritegen/tests/rules.test.js).
	rule_case("Einzelpixel: Sporn", Cleanup.rule_orphans,
		["......", ".2222.", ".22222", ".2222."], ["......", ".2222.", ".2222.", ".2222."])
	rule_case("Einzelpixel: Kerbe", Cleanup.rule_orphans,
		[".222.", ".2.2.", ".222."], [".222.", ".222.", ".222."])
	rule_case("Einzelpixel: Einzelton", Cleanup.rule_orphans,
		["11111", "11311", "11111"], ["11111", "11111", "11111"])
	rule_case("Einzelpixel: saubere Fläche", Cleanup.rule_orphans,
		[".....", ".112.", ".112.", "....."], [".....", ".112.", ".112.", "....."])
	rule_case("Treppen: 4,1,4 -> 3,2,4", Cleanup.rule_staircase,
		[".1111111", ".1111111", ".1111111", ".1111111", "..111111", "...11111", "...11111", "...11111", "...11111"],
		[".1111111", ".1111111", ".1111111", "..111111", "..111111", "...11111", "...11111", "...11111", "...11111"])
	rule_case("Treppen: Diagonale bleibt", Cleanup.rule_staircase,
		["...1111", "..11111", ".111111", "1111111"], ["...1111", "..11111", ".111111", "1111111"])
	rule_case("Banding: Zwischenton weg", Cleanup.rule_banding,
		["000122", "000122", "000122"], ["000022", "000022", "000022"])
	rule_case("Banding: 1-px-Verlauf bleibt", Cleanup.rule_banding,
		["00123", "00123", "00123"], ["00123", "00123", "00123"])
	rule_case("Banding: breite Stufen bleiben", Cleanup.rule_banding,
		["0011", "0011", "0011"], ["0011", "0011", "0011"])
	rule_case("Außenumriss", Outline.outer_outline,
		[".....", "..2..", "....."], ["..o..", ".o2o.", "..o.."])

	# Determinismus.
	var a := Pipeline.generate(Genome.make(9))
	var b := Pipeline.generate(Genome.make(9))
	check("Determinismus Seed 9", a["image"]["px"] == b["image"]["px"])

	# Golden-Tests: bitgleich zu den Referenzbildern (erzeugt von der JS-Referenz).
	var palette := Pipeline.load_palette("tiefsee")
	for seed_value in GOLDEN_SEEDS:
		for clean in [false, true]:
			var name := "biped_%d_%s.png" % [seed_value, "clean" if clean else "raw"]
			var expected := Image.load_from_file("res://addons/spritegen/golden/" + name)
			expected.convert(Image.FORMAT_RGBA8)
			var got := Pipeline.to_image(Pipeline.generate(Genome.make(seed_value), {"cleanup": clean})["image"], palette)
			check("Golden " + name, got.get_data() == expected.get_data())

	print("\n%d ok, %d fehlgeschlagen" % [passed, failed])
	quit(1 if failed > 0 else 0)
