## Goldens NEU erzeugen. Nur bewusst aufrufen und in docs/spritegen/entscheidungen.md begründen!
## godot --headless --path game --script res://addons/spritegen/cli/golden.gd
extends SceneTree

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")

## Je Körperbau 3 Seeds (Ruhepose) + je ein Animationsbild.
const CASES := [
	["biped", "hafen", 1], ["biped", "wald", 2], ["biped", "grund", 4711],
	["blob", "hafen", 1], ["blob", "kapelle", 5], ["blob", "grund", 100],
	["floater", "hafen", 1], ["floater", "wald", 3], ["floater", "kapelle", 7],
	["crawler", "wald", 1], ["crawler", "grund", 2], ["crawler", "hafen", 9],
	["worm", "grund", 1], ["worm", "hafen", 6], ["worm", "wald", 8],
]
const POSES := [
	["biped", "attack", 0.45], ["floater", "death", 0.7], ["crawler", "hit", 0.15], ["worm", "idle", 0.375], ["blob", "attack", 0.5],
]


static func name_for(plan: String, zone: String, seed_value: int, stage: String) -> String:
	return "%s_%s_%d_%s.png" % [plan, zone, seed_value, stage]


static func pose_name(plan: String, anim: String, t: float) -> String:
	return "%s_%s_t%03d.png" % [plan, anim, int(round(t * 1000))]


func _init() -> void:
	var dir := "res://addons/spritegen/golden/"
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(dir))
	# alte Goldens entfernen
	for f in DirAccess.get_files_at(dir):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(dir + f))
	for c in CASES:
		var g := Genome.make(c[2], c[0], c[1])
		var pal := Pipeline.load_palette(g["palette"])
		# Stufen: raw = nur Schattierung (ohne Aufräumen/Randlicht/Details/Oberfläche), final = alles
		var raw := Pipeline.generate(g, {"cleanup": false, "rim": false, "details": false, "surface": false})
		Pipeline.to_image(raw["image"], pal).save_png(dir + name_for(c[0], c[1], c[2], "raw"))
		var fin := Pipeline.generate(g)
		Pipeline.to_image(fin["image"], pal).save_png(dir + name_for(c[0], c[1], c[2], "final"))
		print(name_for(c[0], c[1], c[2], "final"))
	for p in POSES:
		var g := Genome.make(1, p[0], "hafen")
		var pal := Pipeline.load_palette(g["palette"])
		var r := Pipeline.generate(g, {"pose": {"anim": p[1], "t": p[2], "amp": 1.0}})
		Pipeline.to_image(r["image"], pal).save_png(dir + pose_name(p[0], p[1], p[2]))
		print(pose_name(p[0], p[1], p[2]))
	quit()
