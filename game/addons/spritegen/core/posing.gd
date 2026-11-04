## Hilfen für Posen: Zyklen, Schlüsselposen, Verlet-Ketten. Alles deterministisch, keine Zeit.
extends RefCounted

## Sinus mit ganzzahliger Frequenz, damit Loops nahtlos sind. t in 0..1.
static func cycle(t: float, freq: int = 1, phase: float = 0.0) -> float:
	return sin(TAU * (t * freq + phase))


static func smooth(t: float) -> float:
	t = clampf(t, 0.0, 1.0)
	return t * t * (3.0 - 2.0 * t)


## Schlüsselposen: keys = [[t0, v0], [t1, v1], ...] (t aufsteigend). Weich interpoliert.
static func keys(t: float, keys_arr: Array) -> float:
	if t <= keys_arr[0][0]:
		return keys_arr[0][1]
	for i in range(1, keys_arr.size()):
		if t <= keys_arr[i][0]:
			var a: Array = keys_arr[i - 1]
			var b: Array = keys_arr[i]
			var f := smooth((t - a[0]) / (b[0] - a[0]))
			return a[1] + (b[1] - a[1]) * f
	return keys_arr[-1][1]


## Verlet-Kette (2D in der x/y-Ebene, z konstant). root_at: Callable(t) -> [x, y]. Gibt Punkte [[x,y],...] (n+1).
## Simuliert zwei volle Zyklen mit Vorlauf und mischt Zyklus A und B, damit der Loop nahtlos ist.
## gravity: Fallrichtung (+y = nach unten, negativ = schwebt nach oben), stiffness: Biegewiderstand 0..1.
static func chain(root_at: Callable, t: float, n: int, seg_len: float, gravity: float, stiffness: float,
		drag: float = 0.08, steps_per_cycle: int = 32, loop: bool = true, rest_dir: Array = [0.0, 1.0]) -> Array:
	var dt := 1.0 / steps_per_cycle
	var cycles := 3 if loop else 2
	var total := steps_per_cycle * cycles
	var r0: Array = root_at.call(0.0)
	var pos := []
	var prev := []
	for i in n + 1:
		pos.append([r0[0] + rest_dir[0] * seg_len * i, r0[1] + rest_dir[1] * seg_len * i])
		prev.append([pos[i][0], pos[i][1]])
	var frame_a := []
	var frame_b := []
	var target_a := int(floor(t * steps_per_cycle + 0.5)) + steps_per_cycle * (cycles - 2)
	var target_b := target_a + steps_per_cycle
	for step in total + 1:
		var tt := fmod(step * dt, 1.0) if loop else minf(step * dt - (cycles - 2), 1.0)
		if not loop:
			tt = clampf(step * dt - (cycles - 2), 0.0, 1.0)
		var root: Array = root_at.call(tt)
		pos[0] = [root[0], root[1]]
		for i in range(1, n + 1):
			var vx: float = (pos[i][0] - prev[i][0]) * (1.0 - drag)
			var vy: float = (pos[i][1] - prev[i][1]) * (1.0 - drag)
			prev[i] = [pos[i][0], pos[i][1]]
			pos[i] = [pos[i][0] + vx, pos[i][1] + vy + gravity * dt * dt * 400.0]
		for _iter in 3:
			for i in range(1, n + 1):
				var dx: float = pos[i][0] - pos[i - 1][0]
				var dy: float = pos[i][1] - pos[i - 1][1]
				var d := sqrt(dx * dx + dy * dy)
				if d < 1e-6:
					d = 1e-6
				var diff := (d - seg_len) / d
				var wa := 0.0 if i == 1 else 0.5
				var wb := 1.0 - wa
				pos[i - 1] = [pos[i - 1][0] + dx * diff * wa, pos[i - 1][1] + dy * diff * wa]
				pos[i] = [pos[i][0] - dx * diff * wb, pos[i][1] - dy * diff * wb]
			# Biegewiderstand: Richtung zum Ruhezustand ziehen.
			if stiffness > 0.0:
				for i in range(1, n + 1):
					var tx: float = pos[i - 1][0] + rest_dir[0] * seg_len
					var ty: float = pos[i - 1][1] + rest_dir[1] * seg_len
					pos[i] = [pos[i][0] + (tx - pos[i][0]) * stiffness * 0.1, pos[i][1] + (ty - pos[i][1]) * stiffness * 0.1]
		if step == target_a:
			for p in pos:
				frame_a.append([p[0], p[1]])
		if step == target_b:
			for p in pos:
				frame_b.append([p[0], p[1]])
	if not loop or frame_b.is_empty():
		return frame_a
	var out := []
	var mix := t
	for i in frame_a.size():
		out.append([frame_a[i][0] * (1.0 - mix) + frame_b[i][0] * mix, frame_a[i][1] * (1.0 - mix) + frame_b[i][1] * mix])
	return out


## Kettenpunkte in Knochen umwandeln.
static func chain_bones(points: Array, name: String, group: String, layer: String, z: float, r_start: float, r_end: float, tags: Array) -> Array:
	var bones := []
	var n := points.size() - 1
	for i in n:
		var ra := r_start + (r_end - r_start) * (float(i) / n)
		var rb := r_start + (r_end - r_start) * (float(i + 1) / n)
		bones.append({"name": "%s_%d" % [name, i], "group": group, "layer": layer,
			"a": [points[i][0], points[i][1], z], "b": [points[i + 1][0], points[i + 1][1], z],
			"r0": ra, "r1": rb, "tags": tags})
	return bones
