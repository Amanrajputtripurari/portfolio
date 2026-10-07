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
  return (
    <div className={styles.heading} data-reveal={reveal ? "heading" : undefined}>
      <h2 className={styles.title} id={`${id}-title`} aria-label={title}>
        {title.split(" ").map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className={styles.word} aria-hidden="true">
            {Array.from(word).map((char, index) => (
              <span key={`${char}-${index}`} className={styles.char} data-char>
                {char}
              </span>
            ))}
          </span>
        ))}
      </h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
