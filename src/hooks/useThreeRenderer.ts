import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

export interface ThreeHandles {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

type SetupFn = (handles: ThreeHandles) => (() => void) | void;
type FrameFn = (handles: ThreeHandles, elapsed: number) => void;

/**
 * Shared Three.js lifecycle: renderer/camera/scene creation, resize,
 * visibility-gated rendering (paused off-screen or when the tab is
 * hidden), and full disposal on unmount. Individual scenes (hero
 * particles, skills tech graph) only supply what objects to add and how
 * to animate them per frame.
 */
export function useThreeRenderer(
  containerRef: RefObject<HTMLDivElement | null>,
  setup: SetupFn,
  onFrame: FrameFn,
  onReady?: () => void,
): void {
  const setupRef = useRef(setup);
  setupRef.current = setup;
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100,
    );
    camera.position.z = 8;

    let renderer: THREE.WebGLRenderer;
    const signalReady = () => {
      onReadyRef.current?.();
      onReadyRef.current = undefined;
    };

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      signalReady();
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const handles: ThreeHandles = { scene, camera, renderer };
    const cleanupSetup = setupRef.current(handles);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;
    let hasRendered = false;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (document.hidden) return;
      if (!isVisible && hasRendered) return;
      onFrameRef.current(handles, clock.getElapsedTime());
      renderer.render(scene, camera);
      hasRendered = true;
      signalReady();
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      cleanupSetup?.();
      scene.traverse((object) => {
        if (object instanceof THREE.Sprite) {
          const material = object.material;
          material.map?.dispose();
          material.dispose();
          return;
        }
        if (object instanceof THREE.Points || object instanceof THREE.Line || object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);
}
