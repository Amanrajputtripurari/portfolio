import * as THREE from "three";

export interface DepthGrid {
  group: THREE.Group;
  update: (progress: number) => void;
}

export interface DepthGridOptions {
  colorMain?: number;
  colorSecondary?: number;
  opacity?: number;
}

/** A faint technical reference grid, set far behind the portrait. */
export function createDepthGrid(options: DepthGridOptions = {}): DepthGrid {
  const { colorMain = 0x3a4a6b, colorSecondary = 0x1c2436, opacity = 0.12 } = options;
  const group = new THREE.Group();

  const grid = new THREE.GridHelper(16, 32, colorMain, colorSecondary);
  const material = grid.material as THREE.Material & { opacity: number; transparent: boolean };
  material.transparent = true;
  material.opacity = opacity;
  grid.position.set(0, -2.55, -2.4);
  group.add(grid);

  const update = (progress: number) => {
    grid.position.z = -2.4 + progress * 0.45;
  };

  return { group, update };
}
