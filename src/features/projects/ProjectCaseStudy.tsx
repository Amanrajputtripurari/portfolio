import { useEffect, useRef } from "react";
import type { Project } from "@/types/portfolio";
import ProjectMock from "@/features/projects/ProjectMock";
import styles from "./ProjectCaseStudy.module.css";

interface ProjectCaseStudyProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectCaseStudy({ project, onClose }: ProjectCaseStudyProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className={styles.panel}>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close case study">
            Close
          </button>
          <div className={styles.preview}>
            {project.image ? (
              <img src={project.image} alt="" />
            ) : (
              <ProjectMock project={project} />
            )}
          </div>
          <p className={styles.kicker}>
            {project.number} — {project.year}
          </p>
          <h3>{project.name}</h3>
          <p className={styles.role}>{project.role}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt>Outcome</dt>
              <dd>{project.outcome}</dd>
            </div>
          </dl>
          <ul className={styles.tech}>
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Live site
              </a>
            )}
            {project.sourceUrl && (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
