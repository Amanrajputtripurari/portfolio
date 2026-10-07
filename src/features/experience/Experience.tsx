import { experience } from "@/data/portfolio";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Experience.module.css";

export default function Experience() {
  const sectionRef = useGsapReveal();

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={`${styles.section} container`}
      aria-labelledby="experience-title"
    >
      <SectionHeading id="experience" title="Experience" />
      <ol className={styles.timeline}>
        {experience.map((item) => {
          const current = item.period.includes("Present");
          return (
            <li key={item.id} className={styles.item} data-reveal="item">
              <div className={styles.when}>
                <span className={styles.marker} data-current={current ? "true" : "false"} aria-hidden="true" />
                <span className={styles.period}>{item.period}</span>
                {current && <span className={styles.current}>Current</span>}
              </div>
              <div className={styles.body}>
                <h3>{item.role}</h3>
                <p className={styles.company}>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" data-cursor="hover">
                      {item.company}
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4.25 11.75L11.75 4.25M11.75 4.25H6.25M11.75 4.25V9.75" />
                      </svg>
                    </a>
                  ) : (
                    item.company
                  )}
                </p>
                <p className={styles.summary}>{item.summary}</p>
                <ul className={styles.highlights}>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
