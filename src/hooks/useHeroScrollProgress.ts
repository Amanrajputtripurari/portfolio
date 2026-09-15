import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "../utils/gsapSetup";
import { setHeroProgress } from "../utils/heroProgress";

/**
 * Drives the single master `heroProgress` value from the hero scroll
 * container's scroll position. This is the ONLY scroll listener for the
 * hero — the portrait, Three.js scene, and text all read the store this
 * writes to, so nothing can drift out of sync.
 *
 * scrub is exact (no smoothing) so visuals always match the scroll
 * position, even on a fast scroll or a jump. This stays active under
 * prefers-reduced-motion too, since it's user-driven scroll, not
 * autoplay — decorative motion (parallax, particles, camera) is what
 * individual components dial back for reduced motion, not the scrub itself.
 */
export function useHeroScrollProgress(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => setHeroProgress(self.progress),
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef]);
}
