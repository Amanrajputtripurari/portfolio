import { useEffect, useRef } from "react";
import { subscribeHeroProgress } from "../../utils/heroProgress";
import { PORTRAIT_IMAGE_SRC } from "../../utils/config";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./HeroImage.module.css";

interface HeroImageProps {
  onReady?: () => void;
}

/**
 * The portrait itself — a static cutout, not a video. Scroll still drives
 * a subtle float/sway (scale, lift, tilt) from the same master heroProgress
 * value everything else reads, so the hero stays reactive to scroll even
 * without frame-by-frame footage.
 */
export default function HeroImage({ onReady }: HeroImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const signalled = useRef(false);
  const reducedMotion = useReducedMotion();

  const signalReady = () => {
    if (signalled.current) return;
    signalled.current = true;
    onReady?.();
  };

  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete) signalReady();
  }, []);

  useEffect(() => {
    const el = imgRef.current;
    if (!el || reducedMotion) return;

    const unsubscribe = subscribeHeroProgress((state) => {
      const p = state.progress;
      const lift = Math.sin(p * Math.PI) * -8;
      const scale = 1 + Math.sin(p * Math.PI) * 0.02;
      el.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
    });

    return unsubscribe;
  }, [reducedMotion]);

  return (
    <img
      ref={imgRef}
      className={styles.image}
      src={PORTRAIT_IMAGE_SRC}
      alt="Portrait"
      draggable={false}
      loading="eager"
      fetchPriority="high"
      onLoad={signalReady}
      onError={signalReady}
    />
  );
}
