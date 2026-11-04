## Einbau-Test (M5): ein generierter Gegner in einer einfachen Kampfszene.
## Leertaste: Angriff, H: Treffer, D: Tod, R: neuer Seed, Pfeile links/rechts: Körperbau.
extends Node2D

const Genome := preload("res://addons/spritegen/core/genome.gd")
const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")
const Frames := preload("res://addons/spritegen/core/frames.gd")

@export var seed_value := 1
@export var plan := "biped"
@export var zone := "hafen"

var sprite: AnimatedSprite2D
var label: Label
var backdrop: TextureRect


func _ready() -> void:
	backdrop = TextureRect.new()
	backdrop.stretch_mode = TextureRect.STRETCH_SCALE
	backdrop.size = Vector2(480, 270)
	add_child(backdrop)
	sprite = AnimatedSprite2D.new()
	sprite.position = Vector2(300, 150)
	sprite.scale = Vector2(1, 1)
	add_child(sprite)
	label = Label.new()
	label.position = Vector2(8, 8)
	add_child(label)
	sprite.animation_finished.connect(_on_finished)
	build()


func build() -> void:
	var genome := Genome.make(seed_value, plan, zone)
	var palette := Pipeline.load_palette(genome["palette"])
	sprite.sprite_frames = Frames.to_sprite_frames(genome, palette)
	sprite.play("idle")
	backdrop.texture = ImageTexture.create_from_image(Pipeline.fog_background(480, 270, palette, seed_value))
	label.text = "%s / %s / Seed %d   [Leertaste Angriff, H Treffer, D Tod, R Seed, <- -> Körperbau]" % [plan, zone, seed_value]


func _on_finished() -> void:
	if sprite.animation != "death":
		sprite.play("idle")


func _unhandled_key_input(event: InputEvent) -> void:
	if not event.is_pressed():
		return
	match event.keycode:
		KEY_SPACE: sprite.play("attack")
		KEY_H: sprite.play("hit")
		KEY_D: sprite.play("death")
		KEY_R:
			seed_value += 1
			build()
		KEY_LEFT, KEY_RIGHT:
			var i := Genome.PLANS.find(plan)
			plan = Genome.PLANS[(i + (1 if event.keycode == KEY_RIGHT else Genome.PLANS.size() - 1)) % Genome.PLANS.size()]
			build()
