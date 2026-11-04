@tool
## Editor-Plugin: hängt das Sprite-Generator-Dock rechts in den Editor.
extends EditorPlugin

const Dock := preload("res://addons/spritegen/editor/dock.gd")

var dock: Control


func _enter_tree() -> void:
	dock = Dock.new()
	add_control_to_dock(EditorPlugin.DOCK_SLOT_RIGHT_UL, dock)


func _exit_tree() -> void:
	if dock:
		remove_control_from_docks(dock)
		dock.queue_free()
