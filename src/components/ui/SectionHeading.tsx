import { sections } from "@/data/sections";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  id: string;
  title: string;
  description?: string;
  reveal?: boolean;
}

export default function SectionHeading({
  id,
  title,
  description,
  reveal = true,
}: SectionHeadingProps) {
  const meta = sections.find((s) => s.id === id);

  return (
    <div className={styles.heading} data-reveal={reveal ? "heading" : undefined}>
      <div className={styles.meta}>
        <span className={styles.number}>{meta?.number}</span>
        <span className={styles.label}>{meta?.label}</span>
      </div>
      <h2 className={styles.title}>
        <span className={styles.titleClip}>
          {Array.from(title).map((char, index) => (
            <span key={`${char}-${index}`} className={styles.char} data-char>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
