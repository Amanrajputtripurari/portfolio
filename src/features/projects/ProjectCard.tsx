import { useRef, type CSSProperties, type MouseEvent } from "react";
import type { Project } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ProjectMock from "@/features/projects/ProjectMock";
import ProjectLiveLink from "@/features/projects/ProjectLiveLink";
import LivePreview from "@/features/projects/LivePreview";
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
    el.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
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
      <div className={styles.stage} data-project-stage>
        <div className={styles.preview} style={{ "--accent": project.accent } as CSSProperties}>
          {project.embed && project.liveUrl ? (
            <LivePreview
              url={project.liveUrl}
              title={project.name}
              poster={project.image}
              posterAlt={project.imageAlt}
            />
          ) : project.image ? (
            <img
              className={styles.previewImage}
              src={project.image}
              alt={project.imageAlt ?? ""}
              width={1440}
              height={900}
              decoding="async"
            />
          ) : (
            <ProjectMock project={project} />
          )}
          <span className={styles.glare} aria-hidden="true" />
          <button
            type="button"
            className={styles.previewButton}
            onClick={handleOpen}
            aria-label={`Open case study: ${project.name}`}
          >
            <span className={styles.previewHint}>{project.embed ? "Open live preview" : "View case study"}</span>
          </button>
        </div>
      </div>

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
        {project.technologies && project.technologies.length > 0 && (
          <ul className={styles.tech}>
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}
        <div className={styles.meta}>
          <span>{project.role}</span>
          <div className={styles.links}>
            {project.liveUrl && <ProjectLiveLink href={project.liveUrl} />}
            {project.sourceUrl && (
              <ProjectLiveLink href={project.sourceUrl} label="GitHub" />
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
