## Animationen rendern: Idle (Loop), Angriff, Treffer, Tod. Ausgabe als Index-Bilder, Images oder SpriteFrames.
## Flacker-Maß: Anteil der Randpixel, die zwischen zwei aufeinanderfolgenden Bildern ihren Wert ändern.
extends RefCounted

const Pipeline := preload("res://addons/spritegen/core/pipeline.gd")
const Indexed := preload("res://addons/spritegen/core/indexed.gd")

const ANIMS := {
	"idle": {"frames": 8, "loop": true, "fps": 6.0},
	"attack": {"frames": 8, "loop": false, "fps": 10.0},
	"hit": {"frames": 6, "loop": false, "fps": 10.0},
	"death": {"frames": 8, "loop": false, "fps": 8.0},
}


## Zeit t je Bild: Loops laufen von 0 bis (n-1)/n, damit das letzte Bild nicht dem ersten gleicht.
static func frame_time(anim: String, k: int, n: int) -> float:
	if ANIMS[anim]["loop"]:
		return float(k) / n
	return float(k) / maxi(1, n - 1)


## Liefert Array von Pipeline-Ergebnissen (je {image, buf, ...}).
static func render(genome: Dictionary, anim: String, opts: Dictionary = {}) -> Array:
	var n: int = opts.get("frames", ANIMS[anim]["frames"])
	var amp: float = opts.get("amp", 1.0)
	var out := []
	for k in n:
		var o := opts.duplicate()
		o["pose"] = {"anim": anim, "t": frame_time(anim, k, n), "amp": amp}
		o["frame"] = "%s:%d" % [anim, k]
		out.append(Pipeline.generate(genome, o))
	return out


static func render_all(genome: Dictionary, opts: Dictionary = {}) -> Dictionary:
	var out := {}
	for anim in ANIMS.keys():
		out[anim] = render(genome, anim, opts)
	return out


## Randpixel: Körperpixel mit mindestens einem transparenten 4er-Nachbarn.
static func edge_mask(img: Dictionary) -> PackedByteArray:
	var w: int = img["w"]
	var h: int = img["h"]
	var px: PackedByteArray = img["px"]
	var out := PackedByteArray()
	out.resize(w * h)
	for y in h:
		for x in w:
			var i := y * w + x
			if px[i] == Indexed.TRANSPARENT:
				continue
			if x == 0 or y == 0 or x == w - 1 or y == h - 1 or px[i - 1] == 0 or px[i + 1] == 0 or px[i - w] == 0 or px[i + w] == 0:
				out[i] = 1
	return out


## Flacker-Maß zwischen zwei Bildern: geänderte Randpixel / Randpixel (Vereinigung beider Bilder).
static func flicker(a: Dictionary, b: Dictionary) -> float:
	var ea := edge_mask(a)
	var eb := edge_mask(b)
	var edges := 0
	var changed := 0
	for i in ea.size():
		if ea[i] == 1 or eb[i] == 1:
			edges += 1
			if a["px"][i] != b["px"][i]:
				changed += 1
	return float(changed) / maxi(1, edges)


## Mittleres Flacker-Maß über eine Bildfolge (bei Loop auch letztes -> erstes Bild).
static func flicker_sequence(results: Array, loop: bool) -> float:
	var n := results.size()
	if n < 2:
		return 0.0
	var sum := 0.0
	var cnt := 0
	for k in range(1, n):
		sum += flicker(results[k - 1]["image"], results[k]["image"])
		cnt += 1
	if loop:
		sum += flicker(results[n - 1]["image"], results[0]["image"])
		cnt += 1
	return sum / cnt


## SpriteFrames für AnimatedSprite2D. Alle Bilder einer Animation nebeneinander, Palette eingebrannt.
static func to_sprite_frames(genome: Dictionary, palette: Dictionary, opts: Dictionary = {}) -> SpriteFrames:
	var sf := SpriteFrames.new()
	sf.remove_animation("default")
	for anim in ANIMS.keys():
		sf.add_animation(anim)
		sf.set_animation_loop(anim, ANIMS[anim]["loop"])
		sf.set_animation_speed(anim, ANIMS[anim]["fps"])
		for r in render(genome, anim, opts):
			var tex := ImageTexture.create_from_image(Pipeline.to_image(r["image"], palette))
			sf.add_frame(anim, tex)
	return sf


## Alle Animationen als ein PNG-Sheet (eine Zeile je Animation). Gibt {image, meta}.
static func to_sheet(genome: Dictionary, palette: Dictionary, opts: Dictionary = {}) -> Dictionary:
	var all := render_all(genome, opts)
	var w: int = all["idle"][0]["image"]["w"]
	var h: int = all["idle"][0]["image"]["h"]
	var max_n := 0
	for anim in ANIMS.keys():
		max_n = maxi(max_n, all[anim].size())
	var sheet := Image.create(w * max_n, h * ANIMS.size(), false, Image.FORMAT_RGBA8)
	var meta := {"frame_w": w, "frame_h": h, "rows": {}}
	var row := 0
	for anim in ANIMS.keys():
		meta["rows"][anim] = {"row": row, "frames": all[anim].size(), "loop": ANIMS[anim]["loop"], "fps": ANIMS[anim]["fps"],
			"flicker": flicker_sequence(all[anim], ANIMS[anim]["loop"])}
		for k in all[anim].size():
			sheet.blit_rect(Pipeline.to_image(all[anim][k]["image"], palette), Rect2i(0, 0, w, h), Vector2i(k * w, row * h))
		row += 1
	return {"image": sheet, "meta": meta, "frames": all}
