import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useHeroScrollProgress } from "@/hooks/useHeroScrollProgress";
import { useTheme } from "@/providers/ThemeProvider";
import HeroPortrait from "@/features/hero/HeroPortrait";
import HeroText from "@/features/hero/HeroText";
import ModuleLoader from "@/components/ui/ModuleLoader";
import styles from "./CinematicHero.module.css";

const Scene = lazy(() => import("@/lib/three/Scene"));

interface CinematicHeroProps {
  onReady?: () => void;
}

/**
 * The signature interaction: a tall (280vh) scroll container with a
 * sticky 100vh viewport inside it. Scroll progress drives three distinct
 * copy chapters — intro never repeats.
 */
export default function CinematicHero({ onReady }: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const [portraitReady, setPortraitReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  useHeroScrollProgress(containerRef);

  useEffect(() => {
    if (portraitReady && sceneReady) onReady?.();
  }, [onReady, portraitReady, sceneReady]);

  useEffect(() => {
    setSceneReady(false);
    const id = window.setTimeout(() => setSceneReady(true), 3500);
    return () => window.clearTimeout(id);
  }, [theme]);

  return (
    <section id="hero" ref={containerRef} className={styles.scrollContainer}>
      <div className={styles.sticky}>
        {!sceneReady && <ModuleLoader label="Loading 3D module" />}
        <Suspense fallback={null}>
          <Scene key={theme} onReady={() => setSceneReady(true)} />
        </Suspense>
        <HeroPortrait onReady={() => setPortraitReady(true)} />
        <HeroText />
      </div>
    </section>
  );
}
