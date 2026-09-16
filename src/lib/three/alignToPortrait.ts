import * as THREE from "three";

const ndc = new THREE.Vector3();
const world = new THREE.Vector3();

export function queryHeroPortrait(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-hero-portrait]");
}

/**
 * World point on the z-plane that sits under a spot on the cutout
 * (default: chest / upper-middle, so rings wrap the figure).
 */
export function portraitWorldPoint(
  camera: THREE.PerspectiveCamera,
  canvas: HTMLElement,
  portrait: HTMLElement,
  planeZ = 0,
  anchorY = 0.56,
): THREE.Vector3 | null {
  const canvasRect = canvas.getBoundingClientRect();
  const rect = portrait.getBoundingClientRect();
  if (rect.width < 8 || canvasRect.width < 8) return null;

  const x = (rect.left + rect.width * 0.5 - canvasRect.left) / canvasRect.width;
  const y = (rect.top + rect.height * anchorY - canvasRect.top) / canvasRect.height;

  ndc.set(x * 2 - 1, -(y * 2 - 1), 0.5).unproject(camera);
  ndc.sub(camera.position);
  if (Math.abs(ndc.z) < 1e-5) return null;
  const distance = (planeZ - camera.position.z) / ndc.z;
  if (!Number.isFinite(distance)) return null;

  world.copy(camera.position).addScaledVector(ndc, distance);
  world.z = planeZ;
  return world;
}

/** Scale rings so they wrap this portrait, not the full viewport. */
export function portraitRingScale(
  camera: THREE.PerspectiveCamera,
  canvas: HTMLElement,
  portrait: HTMLElement,
  baseRadius = 2.55,
): number {
  const canvasRect = canvas.getBoundingClientRect();
  const rect = portrait.getBoundingClientRect();
  if (rect.width < 8 || canvasRect.width < 8) return 0.92;

  const distance = Math.abs(camera.position.z);
  const halfW =
    Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5) * distance * camera.aspect;
  const portraitWorldWidth = (rect.width / canvasRect.width) * halfW * 2;
  const desiredRadius = portraitWorldWidth * 0.56;
  return THREE.MathUtils.clamp(desiredRadius / baseRadius, 0.55, 1.08);
}
