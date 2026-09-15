import { useEffect, useState } from "react";
import { onMediaQueryChange } from "@/lib/mediaQuery";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    return onMediaQueryChange(mq, () => setReduced(mq.matches));
  }, []);

  return reduced;
}
