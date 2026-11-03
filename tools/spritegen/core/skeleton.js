// Skelett für den Körperbau "Zweibeiner".
// Koordinaten in Pixeln: x nach rechts, y nach unten, z zum Betrachter.
// Blickrichtung: nach links (vorne = -x), Dreiviertelansicht.
// Jeder Knochen ist ein Kegel mit runden Enden: a, b, Radius r0 (bei a), r1 (bei b).
// Kein Knochen hat eine vorgezeichnete Form, alles folgt aus den Parametern.

const lerp = (a, b, t) => a + (b - a) * t;

function bone(name, group, layer, a, b, r0, r1, tags = []) {
  return { name, group, layer, a, b, r0, r1, tags };
}

// Punkt in Richtung Winkel (0 = nach unten, positiv = nach vorne/links).
function step(p, angle, len, dz = 0) {
  return [p[0] - Math.sin(angle) * len, p[1] + Math.cos(angle) * len, p[2] + dz];
}

// Zwei-Knochen-IK in der x/y-Ebene. Knie zeigt nach vorne (-x).
function ik2(hip, ankle, l1, l2, z) {
  const dx = ankle[0] - hip[0];
  const dy = ankle[1] - hip[1];
  let d = Math.sqrt(dx * dx + dy * dy);
  const dMax = (l1 + l2) * 0.999;
  if (d > dMax) d = dMax;
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const hgt = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / Math.sqrt(dx * dx + dy * dy);
  const uy = dy / Math.sqrt(dx * dx + dy * dy);
  // Senkrechte, die nach vorne (-x) zeigt, wenn das Bein nach unten geht.
  const px = -uy;
  const py = ux;
  const sign = px < 0 ? 1 : -1;
  return [hip[0] + ux * a + sign * px * hgt, hip[1] + uy * a + sign * py * hgt, z];
}

export function buildSkeleton(genome, size = { w: 64, h: 80, footX: 32, footY: 78 }) {
  const p = genome.params;
  const ground = size.footY + 0.5; // Unterkante des Fußpixels
  const scaleH = size.h / 80;

  const H = lerp(46, 72, p.height) * scaleH;
  const legLen = H * lerp(0.3, 0.46, p.legs);
  const torsoR = lerp(4.5, 10.5, p.bulk) * scaleH;
  const belly = p.belly * 2 - 1; // -1..1
  const rShoulder = torsoR * (1 - 0.28 * belly);
  const rHip = torsoR * (1 + 0.22 * belly) * 0.9;
  const headR = Math.min(lerp(3.2, 7.5, p.head) * scaleH, torsoR * 1.2);
  const neckLen = lerp(0, 6, p.neck) * scaleH;
  const limbR = lerp(1.3, 3.0, p.limbThick) * lerp(0.85, 1.25, p.bulk) * scaleH;
  const asym = (p.asym - 0.5) * 0.5; // -0.25..0.25

  const footR = Math.max(1.2, limbR * 0.85);
  const hipY = ground - legLen - footR;
  const torsoLen = Math.max(torsoR * 0.8, H - legLen - neckLen - headR * 2 - footR);

  // Wirbelsäule in zwei Knochen, damit ein Buckel entsteht.
  const tilt = p.hunch * 0.75;
  const pelvis = [0, hipY, 0];
  const mid = step(pelvis, Math.PI - tilt * 0.35, torsoLen * 0.5);
  const chest = step(mid, Math.PI - tilt * 1.15, torsoLen * 0.5);

  // Hals und Kopf: Kopf neigt sich weiter nach vorne.
  const neckAngle = Math.PI - tilt * 1.4 - p.headFwd * 0.7;
  const neckEnd = step(chest, neckAngle, neckLen + headR * 0.4);
  const headBack = step(neckEnd, neckAngle, headR * 0.5);
  const headLen = headR * lerp(0.1, 1.3, p.headFwd);
  const headFront = [headBack[0] - headLen, headBack[1] + headLen * 0.15, 0];

  const bones = [
    bone('pelvis', 'body', 'mid', pelvis, mid, rHip, (rHip + rShoulder) / 2, ['torso']),
    bone('chest', 'body', 'mid', mid, chest, (rHip + rShoulder) / 2, rShoulder, ['torso']),
    bone('neck', 'head', 'mid', chest, neckEnd, Math.min(rShoulder, headR) * 0.5, Math.min(rShoulder, headR) * 0.45, ['neck']),
    bone('head', 'head', 'mid', headBack, headFront, headR, headR * 0.82, ['head']),
  ];

  // Seiten: nah (z+, front) und fern (z-, back).
  const sides = [
    { key: 'near', layer: 'front', zs: 1, len: 1 + asym, swing: 1 },
    { key: 'far', layer: 'back', zs: -1, len: 1 - asym, swing: -1 },
  ];

  const armLen = torsoLen * lerp(0.75, 1.45, p.arms);
  const stance = lerp(1.5, 7, p.stance) * scaleH;

  for (const s of sides) {
    const z = s.zs * (torsoR * 0.85 + limbR * 0.6);
    // Schulter etwas unterhalb der Brust-Oberkante.
    const shoulder = [chest[0] + s.zs * torsoR * 0.15, chest[1] + rShoulder * 0.45, z];
    const swing = (p.armSwing - 0.5) * 0.9 * s.swing + tilt * 0.6;
    const len = armLen * s.len;
    const elbow = step(shoulder, swing, len * 0.5);
    const hand = step(elbow, swing + p.elbow * 1.2, len * 0.5);
    bones.push(bone(`arm_upper_${s.key}`, `arm_${s.key}`, s.layer, shoulder, elbow, limbR * 1.15, limbR, ['arm']));
    bones.push(bone(`arm_lower_${s.key}`, `arm_${s.key}`, s.layer, elbow, hand, limbR, limbR * 1.05, ['arm', 'hand']));

    const hip = [pelvis[0] + s.zs * rHip * 0.2, pelvis[1] + rHip * 0.3, s.zs * rHip * 0.6];
    const ankleY = ground - footR;
    const ankle = [hip[0] - s.swing * stance * 0.5, ankleY, hip[2]];
    // Kniebeugung: Knochen länger als der Abstand Hüfte–Knöchel, IK beugt das Knie nach vorne.
    const ddx = ankle[0] - hip[0], ddy = ankle[1] - hip[1];
    const dist = Math.sqrt(ddx * ddx + ddy * ddy);
    const seg = (dist / 2) / lerp(0.99, 0.82, p.knee);
    const knee = ik2(hip, ankle, seg, seg, hip[2]);
    const toe = [ankle[0] - footR * 2.2, ankleY, hip[2]];
    bones.push(bone(`leg_upper_${s.key}`, `leg_${s.key}`, s.layer, hip, knee, limbR * 1.35, limbR * 1.05, ['leg']));
    bones.push(bone(`leg_lower_${s.key}`, `leg_${s.key}`, s.layer, knee, ankle, limbR * 1.05, footR, ['leg']));
    bones.push(bone(`foot_${s.key}`, `leg_${s.key}`, s.layer, ankle, toe, footR, footR * 0.85, ['foot']));
  }

  return fitToCanvas(bones, size);
}

// Füße mittig auf footX setzen, bei Bedarf um den Fußpunkt verkleinern, damit 2 px Rand bleiben.
function fitToCanvas(bones, size) {
  const feet = bones.filter((b) => b.tags.includes('foot'));
  const fx = feet.reduce((s, b) => s + (b.a[0] + b.b[0]) / 2, 0) / feet.length;
  const shiftX = size.footX - fx;
  for (const b of bones) {
    b.a = [b.a[0] + shiftX, b.a[1], b.a[2]];
    b.b = [b.b[0] + shiftX, b.b[1], b.b[2]];
  }
  const margin = 2;
  let scale = 1;
  const ox = size.footX;
  const oy = size.footY + 0.5;
  for (const b of bones) {
    for (const [pt, r] of [[b.a, b.r0], [b.b, b.r1]]) {
      const dx = pt[0] - ox;
      const dy = pt[1] - oy;
      if (dx - r < 0) scale = Math.min(scale, (ox - margin) / (r - dx));
      if (dx + r > 0) scale = Math.min(scale, (size.w - margin - ox) / (dx + r));
      if (dy - r < 0) scale = Math.min(scale, (oy - margin) / (r - dy));
    }
  }
  if (scale < 1) {
    for (const b of bones) {
      b.a = [ox + (b.a[0] - ox) * scale, oy + (b.a[1] - oy) * scale, b.a[2] * scale];
      b.b = [ox + (b.b[0] - ox) * scale, oy + (b.b[1] - oy) * scale, b.b[2] * scale];
      b.r0 *= scale;
      b.r1 *= scale;
    }
  }
  return { bones, size, scale };
}
