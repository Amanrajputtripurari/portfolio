import { about } from "@/data/portfolio";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./About.module.css";

export default function About() {
  const sectionRef = useGsapReveal();

  return (
    <section id="about" ref={sectionRef} className={`${styles.section} container`} aria-labelledby="about-title">
      <SectionHeading id="about" title="About" />
      <p className={styles.lead} data-reveal="line">
        {about.lead}
      </p>
      <div className={styles.grid}>
        <div className={styles.copy}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} data-reveal="line">
              {paragraph}
            </p>
          ))}
        </div>
        <aside className={styles.side}>
          <h3 className={styles.sideTitle}>Right now</h3>
          <dl className={styles.now}>
            {about.now.map((item) => (
              <div key={item.label} data-reveal="item">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <dl className={styles.stats}>
        {about.stats.map((stat) => (
          <div key={stat.label} className={styles.stat} data-reveal="item">
            <dt>{stat.label}</dt>
            <dd data-reveal-count={stat.value}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
