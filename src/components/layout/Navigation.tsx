import { useEffect, useState, type MouseEvent } from "react";
import { sections } from "@/data/sections";
import { personal } from "@/data/portfolio";
import { scrollToSection } from "@/lib/scrollToSection";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useActiveSection } from "@/hooks/useActiveSection";
import { onMediaQueryChange } from "@/lib/mediaQuery";
import ThemeToggle from "@/components/theme/ThemeToggle";
import styles from "./Navigation.module.css";

const navSections = sections.filter((s) => s.id !== "hero");
const sectionIds = sections.map((s) => s.id);
const DESKTOP_NAV = "(min-width: 901px)";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useScrollProgress();
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV);
    const closeOnDesktop = () => {
      if (mq.matches) setMenuOpen(false);
    };
    return onMediaQueryChange(mq, closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const wasOpen = menuOpen;
    document.body.style.overflow = "";
    setMenuOpen(false);

    // Drawer unlock needs a frame before scroll measurements are reliable.
    if (wasOpen) {
      window.requestAnimationFrame(() => scrollToSection(id));
      return;
    }
    scrollToSection(id);
  }

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.brand} onClick={(e) => handleNavClick(e, "hero")}>
          {personal.name}
        </a>

        <nav className={styles.links} aria-label="Primary">
          <ul>
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={activeId === section.id ? "location" : undefined}
                  onClick={(e) => handleNavClick(e, section.id)}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {personal.resumeUrl && (
            <a className={styles.resume} href={personal.resumeUrl} target="_blank" rel="noreferrer">
              CV
            </a>
          )}
          <ThemeToggle />

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span data-open={menuOpen ? "true" : "false"} />
            <span data-open={menuOpen ? "true" : "false"} />
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={styles.drawer}
        data-open={menuOpen ? "true" : "false"}
        aria-hidden={!menuOpen}
        aria-label="Mobile"
        {...(!menuOpen ? ({ inert: true } as { inert: boolean }) : {})}
      >
        <div className={styles.drawerClip}>
          <ul>
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={activeId === section.id ? "location" : undefined}
                  onClick={(e) => handleNavClick(e, section.id)}
                >
                  <span className={styles.drawerNumber}>{section.number}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={styles.progress} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}
