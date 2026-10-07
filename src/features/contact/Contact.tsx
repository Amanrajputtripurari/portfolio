import { lazy, Suspense, useState, type FormEvent } from "react";
import { builtWith, contact, personal, socialLinks } from "@/data/portfolio";
import { scrollToSection } from "@/lib/scrollToSection";
import { useTheme } from "@/providers/ThemeProvider";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Contact.module.css";

const Globe = lazy(() => import("@/lib/three/Globe"));

export default function Contact() {
  const sectionRef = useGsapReveal();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy email address", personal.email);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()} (${fromEmail.trim()})`);
    setStatus("Opening your mail app…");
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" ref={sectionRef} className={`${styles.section} container`} aria-labelledby="contact-title">
      <div className={styles.top}>
        <SectionHeading id="contact" title={contact.headline} />
        <figure className={styles.globe}>
          <div className={styles.globeCanvas}>
            <Suspense fallback={null}>
              <Globe key={theme} />
            </Suspense>
          </div>
          <figcaption>{contact.globeCaption}</figcaption>
        </figure>
      </div>

      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.prompt}>{contact.prompt}</p>
          <div className={styles.emailRow}>
            <a href={`mailto:${personal.email}`} className={styles.emailLink}>
              {personal.email}
            </a>
            <button type="button" className={styles.copy} onClick={copyEmail} aria-live="polite">
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>
          <ul className={styles.social}>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.url} target="_blank" rel="noreferrer" data-cursor="hover">
                  {link.label}
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4.25 11.75L11.75 4.25M11.75 4.25H6.25M11.75 4.25V9.75" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
          <div className={styles.fields}>
            <label htmlFor="contact-name">
              Name
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label htmlFor="contact-email">
              Email
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={fromEmail}
                onChange={(event) => setFromEmail(event.target.value)}
                required
              />
            </label>
          </div>
          <label htmlFor="contact-message">
            Message
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="submit" className={styles.send}>
              Send message
            </button>
            {status && (
              <p className={styles.status} role="status">
                {status}
              </p>
            )}
          </div>
        </form>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <p className={styles.footerName}>{personal.name}</p>
          <p>
            {personal.role}. {personal.location}.
          </p>
        </div>
        <p className={styles.footerStack}>Built with {builtWith.join(", ")}.</p>
        <div className={styles.footerEnd}>
          <span>
            &copy; {new Date().getFullYear()} {personal.name}
          </span>
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("hero");
            }}
          >
            Back to top
          </a>
        </div>
      </footer>
    </section>
  );
}
