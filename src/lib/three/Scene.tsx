import { useRef } from "react";
import * as THREE from "three";
import { useThreeRenderer } from "@/hooks/useThreeRenderer";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/providers/ThemeProvider";
import { subscribeHeroProgress } from "@/lib/heroProgress";
import { createParticleField, type ParticleField } from "@/lib/three/particles";
import { createDepthGrid, type DepthGrid } from "@/lib/three/grid";
import { createOrbitalElements, type OrbitalElements } from "@/lib/three/orbitalElements";
import { lerp, mapRange } from "@/lib/animation";
import styles from "./Scene.module.css";

const PALETTES = {
  dark: {
    particle: 0xc4d6ff,
    particleOpacity: 0.7,
    particleAdditive: true,
    gridMain: 0x8aa0dc,
    gridSecondary: 0x4a5a80,
    gridOpacity: 0.45,
    ringA: 0xa8c4ff,
    ringB: 0x8aa0dc,
  },
  light: {
    particle: 0x2b4fd0,
    particleOpacity: 0.5,
    particleAdditive: false,
    gridMain: 0x4a68c8,
    gridSecondary: 0x9aa8d0,
    gridOpacity: 0.5,
    ringA: 0x2b4fd0,
    ringB: 0x4c66c4,
  },
} as const;

interface SceneObjects {
  particles: ParticleField;
  grid: DepthGrid;
  orbitals: OrbitalElements;
}

/**
 * Atmosphere around the portrait: particles, a floor grid, and thin
 * orbital rings that wrap the sides of the cutout.
 */
export default function Scene({ onReady }: { onReady?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouse = useMouseParallax();
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const progressRef = useRef(0);
  const objectsRef = useRef<SceneObjects | null>(null);

  useThreeRenderer(
    containerRef,
    ({ scene, camera }) => {
      const palette = PALETTES[theme];
      const particles = createParticleField(reducedMotion ? 80 : 260, {
        color: palette.particle,
        opacity: palette.particleOpacity,
        additive: palette.particleAdditive,
      });
      const grid = createDepthGrid({
        colorMain: palette.gridMain,
        colorSecondary: palette.gridSecondary,
        opacity: palette.gridOpacity,
      });
      const orbitals = createOrbitalElements({
        colorA: palette.ringA,
        colorB: palette.ringB,
        opacityA: theme === "dark" ? 0.58 : 0.42,
        opacityB: theme === "dark" ? 0.34 : 0.26,
        additive: theme === "dark",
      });
      objectsRef.current = { particles, grid, orbitals };

      scene.add(particles.points, grid.group, orbitals.group);

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      const key = new THREE.DirectionalLight(0xffffff, 0.4);
      key.position.set(2, 2, 4);
      scene.add(ambient, key);

      camera.position.set(0, 0, 8);

      const unsubscribe = subscribeHeroProgress((state) => {
        progressRef.current = state.progress;
      });

      return () => {
        objectsRef.current = null;
        unsubscribe();
      };
    },
    ({ camera }, elapsed) => {
      const progress = progressRef.current;
      const objects = objectsRef.current;

      if (objects) {
        objects.particles.update(elapsed, progress);
        objects.grid.update(progress);
        objects.orbitals.update(elapsed, progress);
      }

      const parallaxStrength = reducedMotion ? 0 : 0.35;
      const targetX = mapRange(progress, 0, 1, -0.4, 0.4) + mouse.current.x * parallaxStrength;
      const targetY = mouse.current.y * -parallaxStrength * 0.6;
      const targetZ = 8 - Math.sin(progress * Math.PI) * 0.6;

      camera.position.x = lerp(camera.position.x, targetX, 0.06);
      camera.position.y = lerp(camera.position.y, targetY, 0.06);
      camera.position.z = lerp(camera.position.z, targetZ, 0.06);
      camera.lookAt(0, 0, 0);
    },
    onReady,
  );

  return <div ref={containerRef} className={styles.canvasHost} aria-hidden="true" />;
}
