/** Single navigation primitive every navigator (top nav, mobile menu, hero CTAs) shares. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });

  if (window.history?.pushState) {
    window.history.pushState(null, "", `#${id}`);
  }
}
