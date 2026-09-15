import type { CSSProperties } from "react";
import type { Project } from "@/types/portfolio";
import styles from "./ProjectCard.module.css";

export default function ProjectMock({ project }: { project: Project }) {
  return (
    <div
      className={styles.mock}
      data-kind={project.mock}
      style={{ "--mock-accent": project.accent } as CSSProperties}
    >
      <div className={styles.mockChrome}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.mockBody}>
        {project.mock === "console" && (
          <>
            <div className={styles.mockSidebar} />
            <div className={styles.mockMain}>
              <i />
              <i />
              <i />
            </div>
          </>
        )}
        {project.mock === "realtime" && (
          <>
            <div className={styles.mockPulse} />
            <div className={styles.mockRows}>
              <i />
              <i />
              <i />
            </div>
          </>
        )}
        {project.mock === "spatial" && (
          <div className={styles.mockOrbit}>
            <b />
            <em />
          </div>
        )}
      </div>
    </div>
  );
}
