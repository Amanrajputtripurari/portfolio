import { experience } from "../../data/portfolio";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import SectionHeading from "./SectionHeading";
import styles from "./Experience.module.css";

export default function Experience() {
  const sectionRef = useGsapReveal();

  return (
    <section id="experience" ref={sectionRef} className={`${styles.section} container`}>
      <SectionHeading id="experience" title="Experience" />
      <div className={styles.timeline}>
        {experience.map((item, index) => (
          <article
            key={item.id}
            className={styles.item}
            data-reveal="item"
            data-reveal-from={index % 2 === 0 ? "left" : "right"}
          >
            <div className={styles.itemHead}>
              <h3>{item.role}</h3>
              <span className={styles.period}>{item.period}</span>
            </div>
            <p className={styles.company}>{item.company}</p>
            <p className={styles.summary}>{item.summary}</p>
            <ul className={styles.highlights}>
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
