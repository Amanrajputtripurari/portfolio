import { useEffect, useRef } from "react";
import type { Project } from "@/types/portfolio";
import ProjectMock from "@/features/projects/ProjectMock";
import ProjectLiveLink from "@/features/projects/ProjectLiveLink";
import LivePreview from "@/features/projects/LivePreview";
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
        <article className={styles.panel}>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close case study">
            Close
          </button>
          {project.embed && project.liveUrl ? (
            <div className={`${styles.preview} ${styles.previewLive}`}>
              <LivePreview
                url={project.liveUrl}
                title={project.name}
                poster={project.image}
                posterAlt={project.imageAlt}
                interactive
              />
            </div>
          ) : (
            <div className={`${styles.preview} ${project.imageFull ? styles.previewShot : ""}`}>
              {project.imageFull || project.image ? (
                <img
                  src={project.imageFull ?? project.image}
                  alt={project.imageAlt ?? `${project.name} preview`}
                  decoding="async"
                />
              ) : (
                <ProjectMock project={project} />
              )}
            </div>
          )}
          <p className={styles.kicker}>
            Case study {project.number} — {project.year}
          </p>
          <h3>{project.name}</h3>
          <p className={styles.role}>{project.role}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            {project.approach && (
              <div>
                <dt>Approach</dt>
                <dd>{project.approach}</dd>
              </div>
            )}
            {project.features && project.features.length > 0 && (
              <div>
                <dt>What shipped</dt>
                <dd>
                  <ul className={styles.featureList}>
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            <div>
              <dt>Outcome</dt>
              <dd>{project.outcome}</dd>
            </div>
          </dl>
          {project.technologies && project.technologies.length > 0 && (
            <ul className={styles.tech}>
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          )}
          <div className={styles.actions}>
            {project.liveUrl && <ProjectLiveLink href={project.liveUrl} />}
            {project.sourceUrl && <ProjectLiveLink href={project.sourceUrl} label="GitHub" />}
          </div>
        </article>
      )}
    </dialog>
  );
}
