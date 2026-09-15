import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapSetup";
import { useReducedMotion } from "./useReducedMotion";

const TOGGLE_ACTIONS = "play none none reverse" as const;

function scrollTriggerFor(trigger: Element, start: string): ScrollTrigger.Vars {
  return {
    trigger,
    start,
    toggleActions: TOGGLE_ACTIONS,
    invalidateOnRefresh: true,
  };
}

function selectReveals(root: HTMLElement, kind: string): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>(root.querySelectorAll(`[data-reveal="${kind}"]`));
}

function itemFromOffset(from: string | undefined, narrow: boolean): { x: number; y: number } {
  const distance = narrow ? 20 : 56;
  if (from === "left") return { x: -distance, y: 12 };
  if (from === "right") return { x: distance, y: 12 };
  return { x: 0, y: narrow ? 28 : 48 };
}

function revealHeading(heading: Element, narrow: boolean): void {
  const chars = heading.querySelectorAll("[data-char]");
  if (chars.length > 0) {
    gsap.from(chars, {
      yPercent: 110,
      opacity: 0,
      duration: 0.7,
      stagger: 0.018,
      ease: "power3.out",
      scrollTrigger: scrollTriggerFor(heading, "top 88%"),
    });
    return;
  }

  gsap.from(heading, {
    y: narrow ? 22 : 36,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: scrollTriggerFor(heading, "top 88%"),
  });
}

function revealItem(item: HTMLElement, narrow: boolean): void {
  const { x, y } = itemFromOffset(item.dataset.revealFrom, narrow);
  gsap.from(item, {
    x,
    y,
    opacity: 0,
    duration: 0.85,
    ease: "power3.out",
    scrollTrigger: scrollTriggerFor(item, "top 92%"),
  });
}

function revealLines(lines: HTMLElement[]): void {
  gsap.from(lines, {
    y: 28,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: scrollTriggerFor(lines[0], "top 90%"),
  });
}

function revealCounter(el: HTMLElement): void {
  const raw = el.dataset.revealCount ?? "0";
  const numeric = Number.parseFloat(raw);
  if (Number.isNaN(numeric)) return;

  const suffix = raw.replace(/[\d.]/g, "");
  const proxy = { n: 0 };

  gsap.fromTo(
    proxy,
    { n: 0 },
    {
      n: numeric,
      duration: 1.35,
      ease: "power2.out",
      scrollTrigger: scrollTriggerFor(el, "top 90%"),
      onUpdate: () => {
        el.textContent = `${Math.round(proxy.n)}${suffix}`;
      },
    },
  );
}

/** Scroll-triggered GSAP reveals for section headings, items, lines, and counters. */
export function useGsapReveal(): RefObject<HTMLElement | null> {
  const rootRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      const narrow = window.matchMedia("(max-width: 760px)").matches;
      const heading = root.querySelector("[data-reveal='heading']");
      if (heading) revealHeading(heading, narrow);

      selectReveals(root, "item").forEach((item) => revealItem(item, narrow));

      const lines = selectReveals(root, "line");
      if (lines.length > 0) revealLines(lines);

      const counters = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-reveal-count]"));
      counters.forEach(revealCounter);
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reducedMotion]);

  return rootRef;
}
