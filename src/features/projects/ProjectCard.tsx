import { useRef, type MouseEvent } from "react";
import type { Project } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ProjectMock from "@/features/projects/ProjectMock";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${y * -6}deg`);
    el.style.setProperty("--tilt-y", `${x * 8}deg`);
    el.style.setProperty("--shift-x", `${x * 10}px`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--shift-x", "0px");
  };

  function handleOpen() {
    onOpen(project);
  }

  return (
    <article
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={styles.preview}
        onClick={handleOpen}
        aria-label={`Open case study: ${project.name}`}
      >
        {project.image ? (
          <img className={styles.previewImage} src={project.image} alt="" />
        ) : (
          <ProjectMock project={project} />
        )}
        <span className={styles.previewHint}>View</span>
      </button>

      <div className={styles.info}>
        <div className={styles.infoHead}>
          <h3>
            <button type="button" className={styles.titleButton} onClick={handleOpen}>
              {project.name}
            </button>
          </h3>
          <span className={styles.year}>{project.year}</span>
        </div>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tech}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className={styles.meta}>
          <span>{project.role}</span>
          <div className={styles.links}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Live
              </a>
            )}
            {project.sourceUrl && (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
            )}
            <button type="button" className={styles.study} onClick={handleOpen}>
              Case study
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
