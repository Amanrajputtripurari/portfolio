import { useEffect, useRef } from "react";
import { lerp } from "../../utils/animation";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { onMediaQueryChange } from "../../utils/mediaQuery";
import styles from "./CustomCursor.module.css";

const INTERACTIVE = "a, button, [role='button'], label, summary, [data-cursor='hover']";
const NATIVE_TEXT = "input, textarea, select, [contenteditable='true']";
const FINE_POINTER = "(pointer: fine) and (hover: hover)";
const TRAIL_COUNT = 8;

function isFinePointer(): boolean {
  return window.matchMedia(FINE_POINTER).matches;
}

interface Spring2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function createSpring(x: number, y: number): Spring2D {
  return { x, y, vx: 0, vy: 0 };
}

/** Critically-damped spring. `omega` is the response speed in rad/s. */
function stepSpring(spring: Spring2D, tx: number, ty: number, omega: number, dt: number) {
  const stiffness = omega * omega;
  const damping = 2 * omega;
  spring.vx += ((tx - spring.x) * stiffness - spring.vx * damping) * dt;
  spring.vy += ((ty - spring.y) * stiffness - spring.vy * damping) * dt;
  spring.x += spring.vx * dt;
  spring.y += spring.vy * dt;
}

/**
 * Physical pointer: springs instead of linear lerp, velocity stretch,
 * and a short speed-based trail. Fine-pointer only.
 */
export default function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLDivElement | null>(null);
  const trailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !isFinePointer()) return;

    const root = rootRef.current;
    const glowEl = glowRef.current;
    const ringEl = ringRef.current;
    const coreEl = coreRef.current;
    const rippleEl = rippleRef.current;
    const trailNodes = trailsRef.current ? Array.from(trailsRef.current.children) as HTMLElement[] : [];
    if (!root || !glowEl || !ringEl || !coreEl || !rippleEl) return;

    document.documentElement.classList.add("has-custom-cursor");

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const mouse = { x: startX, y: startY };
    const core = createSpring(startX, startY);
    const ring = createSpring(startX, startY);
    const glow = createSpring(startX, startY);
    let scale = 1;
    let scaleV = 0;
    let hovering = false;
    let pressing = false;
    let nativeText = false;
    let ripple = 0;
    let last = performance.now();
    let frameId = 0;
    let stillTime = 0;
    let prevMouseX = startX;
    let prevMouseY = startY;

    const history: Array<{ x: number; y: number }> = Array.from({ length: 18 }, () => ({
      x: startX,
      y: startY,
    }));

    const setVisible = (next: boolean) => {
      root.dataset.visible = next && !nativeText ? "true" : "false";
    };

    const readTarget = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        setVisible(false);
        return;
      }

      mouse.x = event.clientX;
      mouse.y = event.clientY;

      const path = event.composedPath();
      nativeText = path.some((node) => node instanceof Element && node.matches(NATIVE_TEXT));
      document.documentElement.classList.toggle("cursor-native", nativeText);

      const target = path.find((node): node is Element => node instanceof Element && node.matches(INTERACTIVE));
      hovering = Boolean(target) && !nativeText;

      root.dataset.state = pressing ? "down" : hovering ? "hover" : "idle";
      setVisible(true);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pressing = true;
      ripple = 0.001;
      root.dataset.state = "down";
    };

    const handlePointerUp = () => {
      pressing = false;
      root.dataset.state = hovering ? "hover" : "idle";
    };

    const handlePointerLeave = () => {
      setVisible(false);
      document.documentElement.classList.remove("cursor-native");
    };

    const handleMedia = () => {
      if (!isFinePointer()) {
        document.documentElement.classList.remove("has-custom-cursor", "cursor-native");
        setVisible(false);
      }
    };

    const media = window.matchMedia(FINE_POINTER);
    const stopMedia = onMediaQueryChange(media, handleMedia);
    window.addEventListener("pointermove", readTarget);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", handlePointerLeave);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      stepSpring(core, mouse.x, mouse.y, 34, dt);
      stepSpring(ring, mouse.x, mouse.y, hovering ? 26 : 13, dt);
      stepSpring(glow, mouse.x, mouse.y, 6.5, dt);

      const targetScale = pressing ? 0.82 : hovering ? 1.32 : 1;
      const scaleOmega = 22;
      scaleV += ((targetScale - scale) * scaleOmega * scaleOmega - scaleV * 2 * scaleOmega) * dt;
      scale += scaleV * dt;

      const mouseDelta = Math.hypot(mouse.x - prevMouseX, mouse.y - prevMouseY);
      prevMouseX = mouse.x;
      prevMouseY = mouse.y;
      stillTime = mouseDelta < 0.35 ? stillTime + dt : 0;
      const settle = Math.min(stillTime / 0.07, 1);

      const speed = Math.hypot(ring.vx, ring.vy);
      const live = hovering || pressing ? 0 : 1 - settle;
      const angle = live > 0.05 ? Math.atan2(ring.vy, ring.vx) : 0;
      const deform = Math.min(speed / 2400, 0.78) * live;
      const stretchX = 1 + deform;
      const stretchY = Math.max(0.42, 1 - deform * 0.55);

      if (settle >= 1) {
        core.x = ring.x;
        core.y = ring.y;
        core.vx = 0;
        core.vy = 0;
        ring.vx = 0;
        ring.vy = 0;
      }

      const visCoreX = lerp(core.x, ring.x, settle);
      const visCoreY = lerp(core.y, ring.y, settle);

      history.pop();
      history.unshift({ x: visCoreX, y: visCoreY });

      coreEl.style.transform = `translate3d(${visCoreX}px, ${visCoreY}px, 0) scale(${pressing ? 0.82 : 1})`;
      ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) rotate(${angle}rad) scale(${stretchX * scale}, ${stretchY * scale})`;
      glowEl.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0)`;

      const trailStrength = Math.min(speed / 900, 1);
      trailNodes.forEach((node, index) => {
        const sample = history[Math.min((index + 1) * 2, history.length - 1)];
        const fade = (1 - index / TRAIL_COUNT) * trailStrength;
        node.style.transform = `translate3d(${sample.x}px, ${sample.y}px, 0) scale(${0.7 - index * 0.06})`;
        node.style.opacity = String(fade * 0.55);
      });

      if (ripple > 0) {
        ripple += dt * 3.2;
        const t = Math.min(ripple, 1);
        rippleEl.style.opacity = String(1 - t);
        rippleEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) scale(${0.45 + t * 2.1})`;
        if (t >= 1) ripple = 0;
      } else {
        rippleEl.style.opacity = "0";
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      stopMedia();
      window.removeEventListener("pointermove", readTarget);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.documentElement.classList.remove("has-custom-cursor", "cursor-native");
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={rootRef} className={styles.root} data-visible="false" data-state="idle" aria-hidden="true">
      <div ref={glowRef} className={styles.layer}>
        <div className={styles.glow} />
      </div>
      <div ref={trailsRef} className={styles.trails}>
        {Array.from({ length: TRAIL_COUNT }, (_, index) => (
          <div key={index} className={styles.layer}>
            <div className={styles.trail} />
          </div>
        ))}
      </div>
      <div ref={ringRef} className={styles.layer}>
        <div className={styles.ring} />
      </div>
      <div ref={rippleRef} className={styles.layer}>
        <div className={styles.ripple} />
      </div>
      <div ref={coreRef} className={styles.layer}>
        <div className={styles.core} />
      </div>
    </div>
  );
}
