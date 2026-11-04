// Volumen rastern: Knochen als Signed Distance Fields, verschmolzen mit glattem Minimum,
// pro Pixel ein Strahl entlang -z (Sphere Tracing). Abdeckung per Supersampling + Mehrheitsentscheid.
// Ausgabe: Puffer mit Abdeckung, Tiefe, Normale, Knochen-ID, Gruppen-ID.

// Glattes Minimum (polynomiell, Inigo Quilez). k in Pixeln.
export function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

// Abstand zu einem Kegel mit runden Enden (Näherung: Radius linear entlang der Projektion).
function coneDist(px, py, pz, bn) {
  const ax = bn.a[0], ay = bn.a[1], az = bn.a[2];
  const bx = bn.b[0] - ax, by = bn.b[1] - ay, bz = bn.b[2] - az;
  const qx = px - ax, qy = py - ay, qz = pz - az;
  const ll = bx * bx + by * by + bz * bz;
  let t = ll > 0 ? (qx * bx + qy * by + qz * bz) / ll : 0;
  if (t < 0) t = 0; else if (t > 1) t = 1;
  const dx = qx - bx * t, dy = qy - by * t, dz = qz - bz * t;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - (bn.r0 + (bn.r1 - bn.r0) * t);
}

// Verschmelzungs-Stärken (Pixel).
export const BLEND = { body: 3.0, limb: 1.5, attach: 2.0, head: 1.2, headAttach: 1.5 };

// Gruppen vorbereiten: "body" verschmilzt in sich, jede Gliedmaße verschmilzt in sich
// und mit ihrem Ansatzknochen. Gruppen untereinander: hartes Minimum (sonst kleben Arme am Rumpf).
export function prepareScene(skeleton) {
  const bones = skeleton.bones;
  const groups = [];
  const byGroup = new Map();
  bones.forEach((b, i) => {
    if (!byGroup.has(b.group)) {
      byGroup.set(b.group, groups.length);
      groups.push({ name: b.group, bones: [], attach: -1 });
    }
    groups[byGroup.get(b.group)].bones.push(i);
  });
  for (const g of groups) {
    if (g.name.startsWith('arm_')) g.attach = bones.findIndex((b) => b.name === 'chest');
    if (g.name.startsWith('leg_')) g.attach = bones.findIndex((b) => b.name === 'pelvis');
    if (g.name === 'head') g.attach = bones.findIndex((b) => b.name === 'chest');
  }
  // Begrenzungsbox in x/y für schnelles Überspringen.
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
  for (const b of bones) {
    for (const [p, r] of [[b.a, b.r0], [b.b, b.r1]]) {
      x0 = Math.min(x0, p[0] - r); x1 = Math.max(x1, p[0] + r);
      y0 = Math.min(y0, p[1] - r); y1 = Math.max(y1, p[1] + r);
      z1 = Math.max(z1, p[2] + r);
    }
  }
  return { bones, groups, box: { x0, y0, x1, y1, z1 } };
}

// Abstandsfeld der ganzen Figur. Gibt Abstand, Index des nächsten Knochens und der Gruppe.
export function sceneDist(scene, px, py, pz, out) {
  const { bones, groups } = scene;
  let best = Infinity, bestBone = -1, bestGroup = -1, nearest = Infinity;
  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    const k = g.name === 'body' ? BLEND.body : g.name === 'head' ? BLEND.head : BLEND.limb;
    let d = Infinity;
    for (const bi of g.bones) {
      const di = coneDist(px, py, pz, bones[bi]);
      d = d === Infinity ? di : smin(d, di, k);
      if (di < nearest) { nearest = di; bestBone = bi; bestGroup = gi; }
    }
    if (g.attach >= 0) d = smin(d, coneDist(px, py, pz, bones[g.attach]), g.name === 'head' ? BLEND.headAttach : BLEND.attach);
    if (d < best) best = d;
  }
  if (out) { out.bone = bestBone; out.group = bestGroup; }
  return best;
}

// Strahl von vorne (+z) nach hinten. Gibt z des Treffers oder NaN.
function march(scene, x, y) {
  const zFar = -scene.box.z1 - 1;
  let z = scene.box.z1 + 1;
  for (let i = 0; i < 96 && z > zFar; i++) {
    const d = sceneDist(scene, x, y, z, null);
    if (d < 0.01) return z;
    z -= Math.max(d * 0.9, 0.02);
  }
  return NaN;
}

export const SUPERSAMPLE = 4; // 4×4 Teilproben pro Pixel

export function rasterize(skeleton) {
  const { w, h } = skeleton.size;
  const scene = prepareScene(skeleton);
  const n = w * h;
  const buf = {
    w, h,
    cover: new Uint8Array(n),
    depth: new Float64Array(n).fill(-Infinity),
    nx: new Float64Array(n), ny: new Float64Array(n), nz: new Float64Array(n),
    bone: new Int16Array(n).fill(-1),
    group: new Int16Array(n).fill(-1),
    layer: [], // Name der Ebene je Knochen-ID
    boneNames: skeleton.bones.map((b) => b.name),
    groupNames: scene.groups.map((g) => g.name),
  };
  buf.layer = skeleton.bones.map((b) => b.layer);
  const S = SUPERSAMPLE;
  const tmp = { bone: -1, group: -1 };
  const { box } = scene;
  // Durchgang 1: nur Pixelmitten. Durchgang 2: Supersampling nur, wo die 3×3-Nachbarschaft
  // gemischt ist (Rand). Ganz innen = voll abgedeckt, ganz außen = leer.
  const centerZ = new Float64Array(n).fill(NaN);
  const inBox = (x, y) => !(y + 1 < box.y0 || y > box.y1 || x + 1 < box.x0 || x > box.x1);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inBox(x, y)) centerZ[y * w + x] = march(scene, x + 0.5, y + 0.5);
    }
  }
  const centerHit = (x, y) => x >= 0 && y >= 0 && x < w && y < h && !Number.isNaN(centerZ[y * w + x]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!inBox(x, y)) continue;
      let nHit = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (centerHit(x + i, y + j)) nHit++;
      if (nHit === 0) continue;
      let hits = 0, sx = NaN, sy = NaN, sz = NaN;
      const cz = centerZ[y * w + x];
      if (!Number.isNaN(cz)) { sx = x + 0.5; sy = y + 0.5; sz = cz; }
      if (nHit === 9) {
        hits = S * S;
      } else {
        for (let j = 0; j < S; j++) {
          for (let i = 0; i < S; i++) {
            const fx = x + (i + 0.5) / S, fy = y + (j + 0.5) / S;
            const z = march(scene, fx, fy);
            if (!Number.isNaN(z)) {
              hits++;
              if (Number.isNaN(sz)) { sx = fx; sy = fy; sz = z; }
            }
          }
        }
      }
      if (hits * 2 < S * S) continue; // Mehrheitsentscheid
      const idx = y * w + x;
      buf.cover[idx] = 1;
      buf.depth[idx] = sz;
      const e = 0.25;
      const gx = sceneDist(scene, sx + e, sy, sz, null) - sceneDist(scene, sx - e, sy, sz, null);
      const gy = sceneDist(scene, sx, sy + e, sz, null) - sceneDist(scene, sx, sy - e, sz, null);
      const gz = sceneDist(scene, sx, sy, sz + e, null) - sceneDist(scene, sx, sy, sz - e, null);
      const len = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
      buf.nx[idx] = gx / len; buf.ny[idx] = gy / len; buf.nz[idx] = gz / len;
      sceneDist(scene, sx, sy, sz, tmp);
      buf.bone[idx] = tmp.bone;
      buf.group[idx] = tmp.group;
    }
  }
  return buf;
}
