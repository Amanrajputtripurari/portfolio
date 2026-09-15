import * as THREE from "three";

export interface OrbitalElements {
  group: THREE.Group;
  update: (elapsed: number, progress: number) => void;
}

function createRing(
  radius: number,
  color: number,
  opacity: number,
  tube: number,
  additive: boolean,
): THREE.Mesh {
  const geometry = new THREE.TorusGeometry(radius, tube, 12, 160);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  return new THREE.Mesh(geometry, material);
}

export interface OrbitalElementsOptions {
  colorA?: number;
  colorB?: number;
  opacityA?: number;
  opacityB?: number;
  additive?: boolean;
}

/** Thin orbital rings that wrap the sides of the portrait, not the face. */
export function createOrbitalElements(options: OrbitalElementsOptions = {}): OrbitalElements {
  const {
    colorA = 0x8fb2ff,
    colorB = 0x6f88c8,
    opacityA = 0.55,
    opacityB = 0.32,
    additive = true,
  } = options;
  const group = new THREE.Group();
  group.scale.setScalar(0.92);

  const ringA = createRing(2.55, colorA, opacityA, 0.012, additive);
  ringA.rotation.x = Math.PI / 2.35;

  const ringAGlow = createRing(2.55, colorA, opacityA * 0.28, 0.028, additive);
  ringAGlow.rotation.copy(ringA.rotation);

  const ringB = createRing(3.15, colorB, opacityB, 0.01, additive);
  ringB.rotation.x = Math.PI / 1.85;
  ringB.rotation.y = Math.PI / 6;

  group.add(ringA, ringAGlow, ringB);

  const update = (elapsed: number, progress: number) => {
    const spinA = elapsed * 0.04 + progress * Math.PI * 0.5;
    const spinB = -elapsed * 0.025 - progress * Math.PI * 0.3;
    ringA.rotation.z = spinA;
    ringAGlow.rotation.z = spinA;
    ringB.rotation.z = spinB;
  };

  return { group, update };
}
