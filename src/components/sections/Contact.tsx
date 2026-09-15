import { useState, type FormEvent } from "react";
import { personal, socialLinks } from "../../data/portfolio";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import SectionHeading from "./SectionHeading";
import styles from "./Contact.module.css";

export default function Contact() {
  const sectionRef = useGsapReveal();
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
    <section id="contact" ref={sectionRef} className={`${styles.section} container`}>
      <SectionHeading id="contact" title="Contact" />

      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.prompt}>Have a project in mind, or just want to talk shop?</p>
          <div className={styles.emailRow}>
            <a href={`mailto:${personal.email}`} className={styles.emailLink}>
              {personal.email}
            </a>
            <button type="button" className={styles.copy} onClick={copyEmail}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <ul className={styles.social}>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
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
        <span>
          &copy; {new Date().getFullYear()} {personal.name}
        </span>
        <span>{personal.location}</span>
      </footer>
    </section>
  );
}
