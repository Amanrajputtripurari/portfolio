import { about } from "../../data/portfolio";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import SectionHeading from "./SectionHeading";
import styles from "./About.module.css";

export default function About() {
  const sectionRef = useGsapReveal();

  return (
    <section id="about" ref={sectionRef} className={`${styles.section} container`}>
      <SectionHeading id="about" title="About" />
      <div className={styles.grid}>
        <div className={styles.copy}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} data-reveal="line">
              {paragraph}
            </p>
          ))}
        </div>
        <dl className={styles.stats}>
          {about.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={styles.stat}
              data-reveal="item"
              data-reveal-from={index % 2 === 0 ? "right" : "left"}
            >
              <dt>{stat.label}</dt>
              <dd data-reveal-count={stat.value}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
