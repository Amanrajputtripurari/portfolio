import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { projects } from "@/data/portfolio";
import type { Project } from "@/types/portfolio";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/features/projects/ProjectCard";
import ProjectCaseStudy from "@/features/projects/ProjectCaseStudy";
import styles from "./Projects.module.css";

export default function Projects() {
  const sectionRef = useGsapReveal();
  const [active, setActive] = useState<Project | null>(null);
  const reducedMotion = useReducedMotion();

  // Each browser frame starts tipped back and swings upright as it scrolls in.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-project-stage]").forEach((stage) => {
        gsap.fromTo(
          stage,
          { rotateX: 28, y: 70, scale: 0.9, transformPerspective: 1400, transformOrigin: "50% 100%" },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top bottom",
              end: "center 60%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, sectionRef]);

  return (
    <section id="projects" ref={sectionRef} className={`${styles.section} container`} aria-labelledby="projects-title">
      <SectionHeading
        id="projects"
        title="Selected Work"
        description="Two products in production and one open-source game. Open any of them for the full case study."
      />
      <div className={styles.list}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            data-reveal="item"
            data-reveal-from={index % 2 === 0 ? "left" : "right"}
          >
            <ProjectCard project={project} onOpen={setActive} />
          </div>
        ))}
      </div>
      <ProjectCaseStudy project={active} onClose={() => setActive(null)} />
    </section>
  );
}
