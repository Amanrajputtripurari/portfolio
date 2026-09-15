import { useEffect, useState } from "react";

/** Section id currently occupying the middle of the viewport. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let next = ids[0] ?? "";
        let best = -1;
        for (const id of ids) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > best) {
            best = ratio;
            next = id;
          }
        }
        if (best > 0) setActive(next);
      },
      { rootMargin: "-28% 0px -48% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
