import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./HeroLighting.module.css";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Rim intensity only. Never render a blurred copy of the portrait —
 * glow must come from drop-shadow on the sharp cutout itself.
 */
export default function HeroLighting() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.parentElement;
    if (!root || !stage) return;

    const setVar = (name: string, value: number) => {
      stage.style.setProperty(name, value.toFixed(3));
    };

    setVar("--tl", 0.42);
    setVar("--tr", 0.46);
    setVar("--bl", 0.4);
    setVar("--br", 0.44);

    if (reducedMotion) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = stage.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / Math.max(rect.width, 1));
      const y = clamp01((event.clientY - rect.top) / Math.max(rect.height, 1));

      const falloff = (cx: number, cy: number) => {
        const dist = Math.hypot(x - cx, y - cy);
        return clamp01(1 - dist * 0.95);
      };

      setVar("--tl", 0.32 + falloff(0.08, 0.12) * 0.28);
      setVar("--tr", 0.34 + falloff(0.92, 0.12) * 0.26);
      setVar("--bl", 0.3 + falloff(0.1, 0.9) * 0.24);
      setVar("--br", 0.32 + falloff(0.9, 0.9) * 0.26);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion]);

  return <div ref={rootRef} className={styles.root} aria-hidden="true" />;
}
