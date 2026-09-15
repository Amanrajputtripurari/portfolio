import * as THREE from "three";

export interface ParticleField {
  points: THREE.Points;
  update: (elapsed: number, progress: number) => void;
}

export interface ParticleFieldOptions {
  color?: number;
  opacity?: number;
  additive?: boolean;
}

/** Depth dots around the portrait, kept off the face. */
export function createParticleField(count: number, options: ParticleFieldOptions = {}): ParticleField {
  const { color = 0x9fb4ff, opacity = 0.35, additive = true } = options;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    do {
      x = (Math.random() - 0.5) * 14;
      y = (Math.random() - 0.5) * 9;
    } while (x * x + y * y < 3.6);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.4;
    speeds[i] = 0.05 + Math.random() * 0.1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size: 0.048,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);

  const update = (elapsed: number, progress: number) => {
    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const baseY = positions[i * 3 + 1];
      positionAttr.setY(i, baseY + Math.sin(elapsed * speeds[i] + i) * 0.15);
    }
    positionAttr.needsUpdate = true;
    points.rotation.y = progress * 0.22;
  };

  return { points, update };
}
