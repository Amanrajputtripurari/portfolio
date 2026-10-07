import { useEffect, useRef, type MouseEvent } from "react";
import { subscribeHeroProgress } from "@/lib/heroProgress";
import { bandOpacity, clamp, mapRange } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollToSection } from "@/lib/scrollToSection";
import { heroChapters, personal } from "@/data/portfolio";
import {
  PHASE_KEYWORDS_LEFT,
  PHASE_KEYWORDS_RIGHT,
  craftBand,
  introBand,
  inviteBand,
  keywordsLeftBand,
  keywordsRightBand,
} from "@/features/hero/heroPhases";
import styles from "./HeroText.module.css";

function applyChapter(
  el: HTMLDivElement,
  opacity: number,
  motionScale: number,
  fromX = 0,
) {
  const hidden = 1 - opacity;
  el.style.opacity = String(opacity);
  el.style.filter = "none";
  el.style.transform = `translate(${fromX * hidden * motionScale}px, ${-12 * hidden * motionScale}px)`;
  el.style.visibility = opacity < 0.02 ? "hidden" : "visible";
  el.style.pointerEvents = opacity > 0.45 ? "auto" : "none";
}

export default function HeroText() {
  const introRef = useRef<HTMLDivElement | null>(null);
  const craftRef = useRef<HTMLDivElement | null>(null);
  const inviteRef = useRef<HTMLDivElement | null>(null);
  const rightKeywordsRef = useRef<HTMLDivElement | null>(null);
  const leftKeywordsRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const intro = introRef.current;
    const craft = craftRef.current;
    const invite = inviteRef.current;
    const right = rightKeywordsRef.current;
    const left = leftKeywordsRef.current;
    if (!intro || !craft || !invite || !right || !left) return;

    const motionScale = reducedMotion ? 0.15 : 1;

    const unsubscribe = subscribeHeroProgress((state) => {
      const p = state.progress;

      const introOpacity = clamp(mapRange(p, introBand.fadeOutStart, introBand.fadeOutEnd, 1, 0), 0, 1);
      applyChapter(intro, introOpacity, motionScale);

      const craftOpacity = bandOpacity(
        p,
        craftBand.fadeInStart,
        craftBand.fadeInEnd,
        craftBand.fadeOutStart,
        craftBand.fadeOutEnd,
      );
      applyChapter(craft, craftOpacity, motionScale, -10);

      const inviteOpacity = clamp(mapRange(p, inviteBand.fadeInStart, inviteBand.fadeInEnd, 0, 1), 0, 1);
      applyChapter(invite, inviteOpacity, motionScale, 10);

      const rightOpacity = bandOpacity(
        p,
        keywordsRightBand.fadeInStart,
        keywordsRightBand.fadeInEnd,
        keywordsRightBand.fadeOutStart,
        keywordsRightBand.fadeOutEnd,
      );
      right.style.opacity = String(rightOpacity);
      right.style.transform = `translate(${(1 - rightOpacity) * 12 * motionScale}px, -50%)`;

      const leftOpacity = bandOpacity(
        p,
        keywordsLeftBand.fadeInStart,
        keywordsLeftBand.fadeInEnd,
        keywordsLeftBand.fadeOutStart,
        keywordsLeftBand.fadeOutEnd,
      );
      left.style.opacity = String(leftOpacity);
      left.style.transform = `translate(${(1 - leftOpacity) * 12 * motionScale}px, -50%)`;
    });

    return unsubscribe;
  }, [reducedMotion]);

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <div className={styles.textLayer}>
      <div ref={introRef} className={styles.chapter}>
        <p className={styles.status}>
          {personal.available && <span className={styles.liveDot} aria-hidden="true" />}
          <span>
            {personal.role}
            {personal.available ? ", available for new projects" : ""}
          </span>
        </p>
        <h1 className={styles.headline}>
          {personal.headline.map((line) => (
            <span key={line} className={styles.headlineLine}>
              {line}
            </span>
          ))}
        </h1>
        <p className={styles.summary}>{personal.summary}</p>
        <div className={styles.ctaRow}>
          <a href="#projects" className={styles.ctaPrimary} onClick={(e) => handleLinkClick(e, "projects")}>
            View Projects
          </a>
          <a href="#contact" className={styles.ctaSecondary} onClick={(e) => handleLinkClick(e, "contact")}>
            Let&rsquo;s Connect
          </a>
        </div>
      </div>

      <div ref={craftRef} className={`${styles.chapter} ${styles.chapterHidden}`}>
        <p className={styles.eyebrow}>{heroChapters.craft.eyebrow}</p>
        <h2 className={styles.headline}>
          {heroChapters.craft.headline.map((line) => (
            <span key={line} className={styles.headlineLine}>
              {line}
            </span>
          ))}
        </h2>
        <p className={styles.summary}>{heroChapters.craft.summary}</p>
      </div>

      <div ref={inviteRef} className={`${styles.chapter} ${styles.chapterHidden}`}>
        <p className={styles.eyebrow}>{heroChapters.invite.eyebrow}</p>
        <h2 className={styles.headline}>
          {heroChapters.invite.headline.map((line) => (
            <span key={line} className={styles.headlineLine}>
              {line}
            </span>
          ))}
        </h2>
        <p className={styles.summary}>{heroChapters.invite.summary}</p>
        <div className={styles.ctaRow}>
          <a href="#projects" className={styles.ctaPrimary} onClick={(e) => handleLinkClick(e, "projects")}>
            {heroChapters.invite.cta}
          </a>
        </div>
      </div>

      <div ref={rightKeywordsRef} className={`${styles.keywords} ${styles.keywordsRight}`}>
        {PHASE_KEYWORDS_RIGHT.map((word) => (
          <span key={word} className={styles.keyword}>
            / {word}
          </span>
        ))}
      </div>

      <div ref={leftKeywordsRef} className={`${styles.keywords} ${styles.keywordsLeft}`}>
        {PHASE_KEYWORDS_LEFT.map((word) => (
          <span key={word} className={styles.keyword}>
            / {word}
          </span>
        ))}
      </div>
    </div>
  );
}
