import styles from "./ProjectLiveLink.module.css";

interface ProjectLiveLinkProps {
  href: string;
  label?: string;
}

function hostname(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ProjectLiveLink({ href, label }: ProjectLiveLinkProps) {
  return (
    <a
      className={styles.link}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="hover"
    >
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.copy}>{label ?? hostname(href)}</span>
      <svg className={styles.arrow} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4.25 11.75L11.75 4.25M11.75 4.25H6.25M11.75 4.25V9.75" />
      </svg>
    </a>
  );
}
