import { useRef } from "react";
import { useThreeRenderer } from "@/hooks/useThreeRenderer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/providers/ThemeProvider";
import { createGlobe, type GlobeHandles, type GlobePalette } from "@/lib/three/createGlobe";
import styles from "./Globe.module.css";

const PALETTES: Record<"dark" | "light", GlobePalette> = {
  dark: {
    dot: 0xaec4ff,
    dotOpacity: 0.9,
    core: 0x0c1020,
    atmosphere: 0x7d9cff,
    arc: 0xb8ccff,
    home: 0x3ddc97,
    additive: true,
  },
  light: {
    dot: 0x3457d5,
    dotOpacity: 0.7,
    core: 0xf4f2ec,
    atmosphere: 0x6b8cff,
    arc: 0x2b4fd0,
    home: 0x12a46b,
    additive: false,
  },
};

const AUTO_SPIN = 0.08;
const TILT = 0.32;

/** Interactive globe: auto-rotates, and can be dragged sideways to spin. */
export default function Globe({ onReady }: { onReady?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeHandles | null>(null);
  const spin = useRef({ angle: 0, velocity: 0, dragging: false, lastX: 0 });
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  useThreeRenderer(
    containerRef,
    ({ scene, camera, renderer }) => {
      const globe = createGlobe(PALETTES[theme]);
      globe.group.rotation.x = TILT;
      // Start with home just left of centre; the auto-spin carries it across.
      spin.current.angle = globe.homeFacing - 0.45;
      globe.group.rotation.y = spin.current.angle;
      globeRef.current = globe;
      scene.add(globe.group);
      camera.position.set(0, 0, 7.4);

      const canvas = renderer.domElement;
      canvas.style.touchAction = "pan-y";
      canvas.style.cursor = "grab";

      const onDown = (event: PointerEvent) => {
        spin.current.dragging = true;
        spin.current.lastX = event.clientX;
        spin.current.velocity = 0;
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = "grabbing";
      };
      const onMove = (event: PointerEvent) => {
        if (!spin.current.dragging) return;
        const dx = event.clientX - spin.current.lastX;
        spin.current.lastX = event.clientX;
        const delta = (dx / Math.max(canvas.clientWidth, 1)) * Math.PI * 1.4;
        spin.current.angle += delta;
        spin.current.velocity = delta * 60;
      };
      const onUp = (event: PointerEvent) => {
        spin.current.dragging = false;
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
        canvas.style.cursor = "grab";
      };

      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);

      return () => {
        globeRef.current = null;
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
      };
    },
    (_handles, elapsed) => {
      const globe = globeRef.current;
      if (!globe) return;
      const state = spin.current;
      const dt = 1 / 60;

      if (!state.dragging) {
        // Fling momentum decays back toward the slow auto-spin.
        const idle = reducedMotion ? 0 : AUTO_SPIN;
        state.velocity += (idle - state.velocity) * 0.04;
        state.angle += state.velocity * dt;
      }

      globe.group.rotation.y = state.angle;
      globe.update(reducedMotion ? 0 : elapsed);
    },
    onReady,
  );

  return <div ref={containerRef} className={styles.host} aria-hidden="true" />;
}
