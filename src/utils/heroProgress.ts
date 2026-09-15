import { clamp } from "./animation";

/**
 * Single source of truth for the cinematic hero. Every visual system
 * (portrait, Three.js scene, text, lighting) reads from this one mutable
 * value instead of running its own scroll calculation, so nothing can
 * drift out of sync with anything else.
 */
export interface HeroProgressState {
  progress: number;
}

export const heroProgress: HeroProgressState = {
  progress: 0,
};

type Listener = (state: HeroProgressState) => void;
const listeners = new Set<Listener>();

/** Imperative subscription — called on every progress update, no React re-render involved. */
export function subscribeHeroProgress(listener: Listener): () => void {
  listeners.add(listener);
  listener(heroProgress);
  return () => listeners.delete(listener);
}

export function setHeroProgress(progress: number): void {
  heroProgress.progress = clamp(progress, 0, 1);
  listeners.forEach((listener) => listener(heroProgress));
}
