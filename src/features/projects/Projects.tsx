import { useState } from "react";
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

  return (
    <section id="projects" ref={sectionRef} className={`${styles.section} container`}>
      <SectionHeading
        id="projects"
        title="Selected Work"
        description="FastWhistle, Yaaro Fit, and BINGO."
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
