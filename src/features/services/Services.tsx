import { services } from "@/data/portfolio";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { scrollToSection } from "@/lib/scrollToSection";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Services.module.css";

export default function Services() {
  const sectionRef = useGsapReveal();

  return (
    <section id="services" ref={sectionRef} className={`${styles.section} container`} aria-labelledby="services-title">
      <SectionHeading
        id="services"
        title="How I can help"
        description="Hire me for a whole product, a frontend that has to scale, or a second opinion on the system you already have."
      />
      <ul className={styles.list}>
        {services.map((service) => (
          <li key={service.id} className={styles.row} data-reveal="item">
            <h3>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>
            <ul className={styles.deliverables} aria-label={`${service.title} deliverables`}>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className={styles.cta}>
        <p>Not sure which fits? Describe the problem and we’ll work it out.</p>
        <a
          href="#contact"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("contact");
          }}
        >
          Start a conversation
        </a>
      </div>
    </section>
  );
}
