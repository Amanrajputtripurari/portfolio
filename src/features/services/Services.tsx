import { services } from "@/data/portfolio";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Services.module.css";

function serviceRevealFrom(index: number): "left" | "right" | undefined {
  if (index === 0) return "left";
  if (index === 2) return "right";
  return undefined;
}

export default function Services() {
  const sectionRef = useGsapReveal();

  return (
    <section id="services" ref={sectionRef} className={`${styles.section} container`}>
      <SectionHeading id="services" title="Services" />
      <div className={styles.grid}>
        {services.map((service, index) => (
          <div key={service.id} data-reveal="item" data-reveal-from={serviceRevealFrom(index)}>
            <div className={styles.card}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
