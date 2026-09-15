import * as THREE from "three";
import type { SkillItem } from "@/types/portfolio";
import { createSkillTexture } from "@/lib/three/skillTexture";

export interface TechGraph {
  group: THREE.Group;
  hits: THREE.Mesh[];
  sprites: THREE.Sprite[];
  skills: SkillItem[];
  update: (elapsed: number, hoverIndex: number) => void;
  dispose: () => void;
}

export interface TechGraphOptions {
  lineColor?: number;
}

const BASE_SCALE = 0.58;
const HOVER_SCALE = 1.08;

/** Skill icons on a connected sphere, with invisible hit spheres for picking. */
export function createTechGraph(skills: SkillItem[], options: TechGraphOptions = {}): TechGraph {
  const { lineColor = 0x3d4d78 } = options;
  const group = new THREE.Group();
  const radius = 3.35;
  const count = skills.length;
  const nodePositions: THREE.Vector3[] = [];
  const sprites: THREE.Sprite[] = [];
  const hits: THREE.Mesh[] = [];
  const textures: THREE.CanvasTexture[] = [];

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const position = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    );
    nodePositions.push(position);

    const texture = createSkillTexture(skills[i]);
    textures.push(texture);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      }),
    );
    sprite.position.copy(position);
    sprite.scale.setScalar(BASE_SCALE);
    sprite.userData.index = i;
    sprites.push(sprite);
    group.add(sprite);

    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 10, 10),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    hit.position.copy(position);
    hit.userData.index = i;
    hits.push(hit);
    group.add(hit);
  }

  const linePositions: number[] = [];
  const maxDistance = radius * 1.18;
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < maxDistance) {
        linePositions.push(
          nodePositions[i].x,
          nodePositions[i].y,
          nodePositions[i].z,
          nodePositions[j].x,
          nodePositions[j].y,
          nodePositions[j].z,
        );
      }
    }
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.28 }),
  );
  group.add(lines);

  const update = (_elapsed: number, hoverIndex: number) => {
    sprites.forEach((sprite, index) => {
      const target = index === hoverIndex ? HOVER_SCALE : BASE_SCALE;
      const next = sprite.scale.x + (target - sprite.scale.x) * 0.16;
      sprite.scale.setScalar(next);
    });
  };

  const dispose = () => {
    textures.forEach((texture) => texture.dispose());
  };

  return { group, hits, sprites, skills, update, dispose };
}
