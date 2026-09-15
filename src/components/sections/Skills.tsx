import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "../../utils/gsapSetup";
import { onMediaQueryChange } from "../../utils/mediaQuery";
import SectionHeading from "./SectionHeading";
import ModuleLoader from "../ModuleLoader";
import styles from "./Skills.module.css";

const TechGraph = lazy(() => import("../three/TechGraph"));

export default function Skills() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [graphReady, setGraphReady] = useState(false);

  useEffect(() => {
    setGraphReady(false);
    const id = window.setTimeout(() => setGraphReady(true), 4000);
    return () => window.clearTimeout(id);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const update = () => setIsMobile(mq.matches);
    update();
    return onMediaQueryChange(mq, update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    const graph = graphRef.current;
    if (!section || !copy || !graph) return;

    if (reducedMotion) {
      gsap.set([copy, graph], { clearProps: "all", opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: isMobile ? "top 82%" : "top 70%",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      if (isMobile) {
        timeline.fromTo(copy, { y: 28, opacity: 0 }, { y: 0, opacity: 1, ease: "none", duration: 0.8 });
        timeline.fromTo(
          graph,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "none", duration: 1 },
          "-=0.2",
        );
      } else {
        timeline.fromTo(
          copy,
          { x: "-32vw", opacity: 0 },
          { x: "12vw", opacity: 1, ease: "none", duration: 1 },
        );
        timeline.to(copy, { x: 0, ease: "none", duration: 0.7 });
        timeline.fromTo(
          graph,
          { opacity: 0, scale: 0.82, y: 36 },
          { opacity: 1, scale: 1, y: 0, ease: "none", duration: 1.15 },
          "-=0.25",
        );
      }
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isMobile]);

  return (
    <section id="skills" ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <div ref={copyRef} className={styles.copy}>
          <SectionHeading
            id="skills"
            title="Technology"
            description="The tools and systems I actually build with — nothing here is aspirational."
            reveal={false}
          />
          <p className={styles.hint}>
            <span className={styles.hintFine}>Hold and drag for a 360° view. Hover an icon for the rating.</span>
            <span className={styles.hintCoarse}>Drag sideways to rotate. Tap an icon for the rating.</span>
          </p>
        </div>
        <div className={styles.graphStage}>
          {!graphReady && <ModuleLoader label="Loading 3D module" />}
          <div ref={graphRef} className={styles.graph}>
            <Suspense fallback={null}>
              <TechGraph key={theme} onReady={() => setGraphReady(true)} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
