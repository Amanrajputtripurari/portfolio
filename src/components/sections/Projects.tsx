import { useState } from "react";
import { projects, type Project } from "../../data/portfolio";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import ProjectCaseStudy from "./ProjectCaseStudy";
import styles from "./Projects.module.css";

export default function Projects() {
  const sectionRef = useGsapReveal();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" ref={sectionRef} className={`${styles.section} container`}>
      <SectionHeading
        id="projects"
        title="Selected Work"
        description="A handful of projects that show how I think, not just what I shipped."
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
