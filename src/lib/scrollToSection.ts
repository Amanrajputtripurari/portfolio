import { gsap } from "@/lib/gsap";

let activeTween: gsap.core.Tween | null = null;

function scrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || 0;
}

function maxScrollY(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function targetYFor(el: HTMLElement, id: string): number {
  if (id === "hero") return 0;

  const nav = document.querySelector("header");
  const offset = Math.round(nav?.getBoundingClientRect().height ?? 0);
  const y = el.getBoundingClientRect().top + scrollTop() - offset;
  return Math.max(0, Math.min(maxScrollY(), Math.round(y)));
}

/** Unlock body scroll if the mobile drawer left overflow locked. */
function unlockBodyScroll(): void {
  if (document.body.style.overflow) {
    document.body.style.overflow = "";
  }
}

/** Single navigation primitive every navigator (top nav, mobile menu, hero CTAs) shares. */
export function scrollToSection(id: string): void {
  unlockBodyScroll();

  const el = document.getElementById(id);
  if (!el) return;

  const target = targetYFor(el, id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  activeTween?.kill();
  activeTween = null;

  if (reduced) {
    window.scrollTo(0, target);
  } else {
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    activeTween = gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: 1.05,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        root.style.scrollBehavior = previousBehavior;
        activeTween = null;
      },
      onInterrupt: () => {
        root.style.scrollBehavior = previousBehavior;
        activeTween = null;
      },
    });
  }

  if (window.history?.pushState) {
    window.history.pushState(null, "", `#${id}`);
  }
}
