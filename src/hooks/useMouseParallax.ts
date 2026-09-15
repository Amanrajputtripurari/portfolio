import { useEffect, useRef } from "react";
import { lerp } from "../utils/animation";
import { useReducedMotion } from "./useReducedMotion";

export interface ParallaxVector {
  x: number;
  y: number;
}

/**
 * Tracks normalized mouse position (-1..1) with lerp smoothing, run off
 * its own rAF loop. Returns a mutable ref so consumers (Three.js scene,
 * portrait wrapper) can read the latest value inside their own render
 * loop without triggering React re-renders on every mouse move.
 */
export function useMouseParallax(): RefObjectReadonly<ParallaxVector> {
  const target = useRef<ParallaxVector>({ x: 0, y: 0 });
  const current = useRef<ParallaxVector>({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    let frameId: number;
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.05);
      current.current.y = lerp(current.current.y, target.current.y, 0.05);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frameId);
    };
  }, [reducedMotion]);

  return current;
}

type RefObjectReadonly<T> = { readonly current: T };
