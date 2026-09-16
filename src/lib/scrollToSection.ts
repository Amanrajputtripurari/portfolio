import { gsap } from "@/lib/gsap";

/** Single navigation primitive every navigator (top nav, mobile menu, hero CTAs) shares. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  } else {
    const nav = document.querySelector("header");
    const offset = id === "hero" ? 0 : Math.round(nav?.getBoundingClientRect().height ?? 0);
    gsap.to(document.scrollingElement ?? document.documentElement, {
      scrollTo: { y: el, offsetY: offset, autoKill: true },
      duration: 1.1,
      ease: "expo.out",
      overwrite: true,
    });
  }

  if (window.history?.pushState) {
    window.history.pushState(null, "", `#${id}`);
  }
}
